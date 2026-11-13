# dsh-pet（白饭）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[467f50e](https://github.com/PC2005-cloud/dsh-pet/tree/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 6,110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 543,535](https://img.shields.io/static/v1?label=npm+30d&message=543%2C535&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **功能**：在 DSH 中显示随会话活动变化的宠物，支持通知、余额提示和宠物对话。

> **亮点**：[Q01](#research-q01) 的通知把离开窗口后的活动提示与会话导航连起来。[Q02](#research-q02) 将前缀路由、命令与浏览器浮层纳入同一宿主生命周期。

> **主要限制**：[Q03](#research-q03) 的余额、自动碎碎念和手动闲聊各有条件。选择的模型不可用时，闲聊可回退当前模型。隐藏浮层无法作为停掉全部后台请求的验收判据。

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
  - [Q01 · 等待任务时，白饭的提醒比原会话状态多解决什么？](#detail-section-11)
  - [Q02 · 安装后有哪些入口，各自如何加载和退出？](#detail-section-12)
  - [Q03 · 手动闲聊及自动刷新如何使用模型和账户？](#detail-section-13)
  - [Q04 · 如何检验宠物提醒比原生状态更适合等候任务？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向将 DSH Web 长任务放到后台的人，用宠物状态和通知找到需要处理的会话。

以原生会话状态、原生通知和直接打开会话为基线。已保持会话可见时，原操作足以确认任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态与通知 | 找到需要处理的会话 | 宿主事件与浏览器服务齐备 |
| 对话 | 使用模型回复宠物消息 | 可回退模型，输入和图片可能进入请求 |
| 余额刷新 | 提示账户额度 | 按开关及宠物醒睡状态查询 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node >=22.12 | 必需 | 加载子包 | 检查宿主版本与模块注入 |
| 浏览器通知及工作区服务 | 通知按需 | 点击返回会话 | 服务缺失时可只带回窗口 |
| 模型和服务授权 | 对话按需 | 生成宠物回复 | 缺失返回失败或按候选回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户用隔离 profile 检查后台开关 | 允许的请求范围明确 |
| 核对 | 用户触发一次审批通知 | 能回到正确会话 |
| 退出 | 用户移除插件并检查挂起状态 | 原生提醒继续工作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 媒体和安装资源未知 | 核对 Web 与账户 | 真实加载未跑 |
| 持续 | 轮询、模型、额度未知 | 核对提醒与服务 | 自动和手动调用分别检查 |
| 失败及退出 | 额外请求和恢复未知 | 查回退与释放进程 | 已发生请求单独对账 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话提醒 | 事件监听和导航 | 真实及时性及误报 |
| 后台 | 余额和碎碎念独立开关 | 实际资源和账户成本 |

> **思考**：[Q03](#research-q03) 的余额、自动碎碎念和手动闲聊各有条件。选择的模型不可用时，闲聊可回退当前模型。隐藏浮层无法作为停掉全部后台请求的验收判据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的通知把离开窗口后的活动提示与会话导航连起来。[Q02](#research-q02) 将前缀路由、命令与浏览器浮层纳入同一宿主生命周期。

[Q02](#research-q02) 的配置串行队列只约束本进程经过该路由的竞争。请求断连会中止等待，卸载还会清理锁、播放和桌面 Helper。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的余额、自动碎碎念和手动闲聊各有条件。选择的模型不可用时，闲聊可回退当前模型。隐藏浮层无法作为停掉全部后台请求的验收判据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用一个无敏感内容的审批任务验证提醒。在启用闲聊前确认候选模型范围，出现未预期的请求时停用并回到原会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码已核 Web、宿主、模型与清理接线，通知准确性及后台请求成本未实测。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-pet/src/host/plugin/session-watch.ts、dsh-pet/src/client/app.ts、dsh-pet/package.json、dsh-pet/cordis.patch.yml、dsh-pet/src/host/index.ts、dsh-pet/src/host/plugin/http-route.ts、dsh-pet/src/host/plugin/lifecycle.ts、dsh-pet/src/host/chat.ts、dsh-pet/src/host/plugin/loops.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 DSH Web 的通知、路由、配置队列、模型请求与停用路径。独立桌面、真实服务商与语音未验。
- 下一步：按 [Q04](#research-q04) 在隔离宿主对照通知延迟和错误会话，并回读后台网络记录。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.4.7（[固定提交 467f50e](https://github.com/PC2005-cloud/dsh-pet/tree/467f50e5c5318216d94f6fc46f3eab782bd0db32)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提议只开启宠物状态提示，在相同审批任务中对照原生提醒，观察能否更快回到正确会话且不增加误报和额外请求。

按 [Q04](#research-q04) 在隔离宿主对照通知延迟和错误会话，并回读后台网络记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 34 | 6588 | 4693 | 1732 | — |
| .md | source | 1 | 7 | — | — | 65 |
| .mjs | source | 13 | 950 | 658 | 240 | — |
| .mjs | test | 6 | 913 | 826 | 52 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 210 | 35650 | 29276 | 3056 | — |
| .ts | source | 401 | 48791 | 32804 | 12956 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 164](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=164&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 166](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=166&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：白饭怎样把 DSH 会话反馈带到用户面前，哪些模型调用和后台行为决定是否适合试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 等待任务时，白饭的提醒比原会话状态多解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH Web 中把长任务切到后台的人，可以用常驻宠物和通知获知一次审批或终态，再点通知返回对应会话。相比主动打开会话列表看状态，这条路径把确认时点交给事件，用户仍需在会话中验收结果。宿主监听按会话 id 聚合活动，目标自动续跑的单轮结束单独标记，避免把回合结束当整个目标完成。浏览器取工作区服务打开会话，缺服务时可只把窗口带回前台。适合重复遇到等待、批准和返回的人，长期盯在同一会话时浮层可能只有装饰价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-18](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/README.md#L18-L18)

作者概述工作动画、余额、闲聊和失焦通知。

```text
一只住在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 里的桌面宠物：待机呼吸、随机动作（打瞌睡、玩魔方、吃火锅……）、左右转向、屏幕漫游、点击 Q 弹、拖拽甩抛反弹、右键菜单点播——一百余个透明动画随时无缝衔接；还能跟随 DSH 会话事件切换工作状态动画、按档位播放余额动画 + 头顶气泡、碎碎念与对话聊天、窗口失焦时弹系统通知。可多开同屏，能脱离浏览器住上**桌面**（透明置顶小窗），也能自己添加**全新宠物种类**（pet pack）。
```

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:151-184](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/session-watch.ts#L151-L184)

实际事件聚合、目标续跑识别和会话归属。

<details>
<summary>查看原文（34行）</summary>

```text
  // 工作状态联动：监听 DSH 会话事件 → 聚合当前活动状态（WorkStatusStore → 展示快照）。
  // 消费 turn/start、user/message（goal 续跑轮判定）、tool/call、tool/result、approval/asked、
  // turn/end、todo/write（只更新任务详情文案，不切档位）。纯监听不调用模型。
  ctx.effect(() => {
    const dispose = ctx.on('session/event', (session: unknown, event: unknown) => {
      const type = (event as { type?: string } | null)?.type;
      if (!type) return;
      const sessionId = String(
        (session as { id?: unknown; header?: { id?: unknown } } | null)?.header?.id ??
          (session as { id?: unknown } | null)?.id ??
          'unknown',
      );
      if (type === 'todo/write') {
        // 任务详情文案只写该会话的条目（state/task 同源，不可能串会话）。会话没有活动条目
        // （已空闲/已清理）→ 不动：不会被展示，写进去只会成为一条幽灵文案。
        // 清单里再无 in_progress/pending 时返回 null，气泡回落到档位文案。
        const text = currentTaskFromTodo(event as { data?: { todos?: Array<{ status?: string; content?: string }> } });
        // 缓存无条件更新：工具跑完要靠它把气泡恢复回来（见下方 tool/call 的接线）
        lastTodoText.set(sessionId, text);
        // 工具正在执行时不覆盖气泡：「修改 index.ts」比清单里那句更能说明此刻在动什么
        if ((toolsInFlight.get(sessionId)?.size ?? 0) > 0) return;
        if (workStatus.has(sessionId)) {
          workStatus.setTask(sessionId, text);
          publishWorkStatus(); // 任务文案变化也要写 S（气泡内容靠它更新）
        }
        return;
      }
      if (type === 'user/message') {
        // 目标续跑轮判定：自动轮的消息带 source.kind==='goal'（round>0），该轮属自动续跑，
        // 其 turn/end completed 只是「本轮完成」，不是整个任务完成
        const source = (event as { data?: { source?: { kind?: string } } })?.data?.source;
        if (source?.kind === 'goal') {
          const flags = turnFlags.get(sessionId) ?? { goalRound: false, closing: null };
          flags.goalRound = true;
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/client/app.ts:100-115](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/client/app.ts#L100-L115)

通知使用会话 id，工作区服务缺失有降级。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

#### 缺口

- 真实提醒及时性和持续任务的误报未对照。
  **影响**：无法断言比原生通知更省时间。
  **进一步探讨**：用两次可重放的批准和结束场景比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装后有哪些入口，各自如何加载和退出？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

选中的子包通过 Cordis 行挂载宿主模块，Web 侧构建进宿主模块加载器。宿主注入 webServer、默认模型、凭据、LLM、命令及连接，注册前缀路由、会话监听、余额、选宠和聊天命令。浏览器工厂把玩法挂在 shell.overlay，并提供只读宠物状态给同页组件。路由把部分配置读写排在同一串行队列，避免同进程的交叉覆盖。长轮询用断连信号停止等待，响应已关闭后跳过发送。卸载作用域清除工作状态定时器、占用锁、待回执和桌面 Helper。它提供有限范围的生命周期收尾，配置副本、素材和已发生的模型调用仍需分别处理。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:43-59](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/package.json#L43-L59)

宿主、Web 和独立入口。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh-pet/cordis.patch.yml:23-25](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/cordis.patch.yml#L23-L25)

实际 profile 挂载。

```text
- insert:
    - id: dsh-pet
      name: 'dsh-pet'             # 模块名：解析到 lib/index.js
```

**依据 3 · 源码核查**：[dsh-pet/src/host/index.ts:115-158](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/index.ts#L115-L158)

真实路由、事件、循环和命令注册。

<details>
<summary>查看原文（44行）</summary>

```text
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

  // 待办提醒：随插件生命周期起停；锁被第三方持有时由 pickReminderSpeaker 跳过该宠物。
  // 播报开关现读现用：改配置后下一次提醒即生效，不必重启。
  registerTodoReminders({
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/client/app.ts:82-98](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/client/app.ts#L82-L98)

浏览器提供只读服务和宿主浮层。

<details>
<summary>查看原文（17行）</summary>

```text
      // 同页第三方插件可通过 Cordis 服务 petApi7340 读取本页宠物的实况、播放进度、最近一拍状态与菜单点击。
      // 只开读，控制仍走 HTTP，避免出现两条控制通道。
      // 服务名带 7340 后缀避免与生态里的同名服务冲突；Cordis 同名 provide 会直接抛错。
      // 消费者用 ctx.get('petApi7340') 探测，拿不到就是老版本；`getState` / `menuEvents` 也要单独探测（老版本没有它们）。
      ctx.provide('petApi7340', {
        getState: getStateSnapshot,
        menuEvents: takeMenuEvents,
        pose: readPose,
        progress: readProgress,
      });

      // 内置玩法「吃白饭」：覆盖层注册进 shell.overlay（与桌宠同槽），不自己挂 body——
      // body 直接子级会命中宿主的 macOS no-drag 规则，还会越级盖住宿主模态框。
      const BaifanLayer = makeBaifanLayer({ h, useRef, useEffect }, (host) => mountBaifan(ctx, host));
      ctx.slots.inject('shell.overlay', function* () {
        yield ctx.slots.register({ name: 'shell.overlay', id: 'baifan', order: 1100 }, BaifanLayer);
      });
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:43-56](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/http-route.ts#L43-L56)

配置读写共用队列。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:72-94](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/http-route.ts#L72-L94)

断连中断路由等待。

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

**依据 7 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:27-43](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/lifecycle.ts#L27-L43)

卸载资源清理。

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

### Q03 · 手动闲聊及自动刷新如何使用模型和账户？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

手动宠物对话经过宿主 LLM 抽象。配置模型优先，失败可回退当前会话选用模型，源码会记录回退。没有模型或 LLM 服务会返回结构化失败。请求会带宠物对话历史、当前输入及可选图片引用，回复短不代表模型请求成本固定。余额循环启动即检查配置，至少一只醒着且启用余额的宠物才查询；配置读取失败停止重排。自动碎碎念独立受开关、显示、睡眠和占用状态控制，不能用隐藏窗口推断全部后台调用都停了。

在只需要状态提醒时，先逐项核对余额、自动碎碎念和语音设置，使用无敏感内容的隔离会话，确认提醒能返回正确任务。需要尝试宠物闲聊时另检查允许使用的模型服务，观察是否发生未预期的回退。如果不允许上传宠物对话文本或图片，保留原生状态和审批提示。首次有人力配置成本，持续运行有素材、后台请求和模型额度，失败回退可能再发起请求，实际金额和资源均未知。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/chat.ts:123-150](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/chat.ts#L123-L150)

模型选择、缺服务与回退。

<details>
<summary>查看原文（28行）</summary>

```text
export async function generateChat(input: ChatGenerateInput): Promise<ChatGenerateResult> {
  const { ctx, system, history, userText, preferred, image } = input;
  // 表情包侧的读池 / 校验函数按可变数组签名；这里复制一份，避免把调用方数组的引用往下传
  const pool: MemeEntry[] = [...(input.pool ?? [])];
  // 动作名单同样是「空 = 关闭」：开关关掉或 categories 没配任何动作时，指令与解析都不介入。
  const actions: string[] = [...(input.actions ?? [])];
  // 候选链：配置的模型优先 → 当前对话的模型兜底（chatModel 留空时链上只有后者）
  const candidates = modelCandidates(ctx, preferred);
  if (candidates.length === 0) {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  const llm = (ctx as { llm?: { stream(o: unknown): AsyncIterable<unknown> } }).llm;
  if (!llm || typeof llm.stream !== 'function') {
    return { ok: false, reason: 'generate-error', message: 'LLM 服务不可用' };
  }
  // 依次尝试：配置的模型失败（凭据被删 / 模型下架 / 该服务商没配 key）时回落到当前对话的模型
  // 重试一次——那才是用户当前真正在用的模型，报错更有意义。
  // 兜底文案与失败分支同源，避免两处字面量漂移
  let last: ChatGenerateResult = { ok: false, reason: 'generate-error', message: noTextReason(undefined) };
  for (const [i, sel] of candidates.entries()) {
    const result = await generateWith(ctx, { llm, sel, system, history, userText, pool, actions, image });
    if (result.ok) return result;
    last = result;
    // 回落要留痕：配的模型没生效时能在日志里看到原因（否则「我明明配了 A，怎么还是用 B」没法查）
    if (i + 1 < candidates.length) {
      defaultLog(
        'warn',
        `dsh-pet: 对话用 ${modelLabel(sel)} 生成失败（${result.message ?? result.reason}），回落到 ${modelLabel(candidates[i + 1])}`,
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/chat.ts:170-228](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/chat.ts#L170-L228)

历史、输入、图片引用与带期限的流请求。

<details>
<summary>查看原文（59行）</summary>

```text
async function generateWith(ctx: { llm?: unknown }, once: GenerateOnce): Promise<ChatGenerateResult> {
  const { llm, sel, system, history, userText, pool, actions, image } = once;
  // 历史 → dsh-llm 消息：user 经 createUserMessage（plugin 来源），assistant 经 createAssistantMessage
  // （provider/model 只是消息的角色载体，不涉及适配器回放）。
  // 时间前缀只加在 user 上（模型会照抄 assistant 自己那侧的格式）；配图/动作标记只加在 assistant 上。
  const nowMs = Date.now();
  const historyMessages = history.map((m) =>
    m.role === 'user'
      ? createUserMessage({
          content: [{ type: 'text', text: userHistoryTextOf(m, nowMs) }],
          source: { kind: 'user' },
        })
      : createAssistantMessage({
          content: [{ type: 'text', text: m.content + historyMarkersOf(m) }],
          source: { provider: sel.provider, model: sel.model },
        }),
  );

  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // 仅当模型声明支持 reasoning effort（含 "off"）时才传，否则省略：
  // 无 reasoning 元数据的模型显式传 off 会被 dsh-llm 判为 UNSUPPORTED_REASONING_EFFORT，
  // 折叠成空流（表现为「模型未返回文本」）。
  const supportsOff = await supportsReasoningOff(ctx, sel.provider, sel.model);
  // 配图 / 动作：各自的清单非空才把指令附进 user 正文（空 = 该功能关闭）。
  // 顺序固定「配图在前、动作在后」：配图是既有行为，新增的动作排在它后面，不改既有提示词的位置。
  const wantImage = pool.length > 0;
  const wantAction = actions.length > 0;
  const instruction = (wantImage ? imageInstruction(pool) : '') + (wantAction ? actionInstruction(actions) : '');
  const content: Record<string, unknown>[] = [
    { type: 'text', text: instruction === '' ? userText : userText + instruction },
  ];
  // 图片块排在文本块之后：提示词先到、像素后到，模型更容易按提示去看图。
  if (image !== undefined) content.push({ type: 'image', attachment: image });
  const options = {
    provider: sel.provider,
    model: sel.model,
    // 调用身份（见 llm-call.ts）：缺它时 opencode-go 回 400
    sessionId: PET_CALL_IDENTITY,
    messages: [
      ...historyMessages,
      createUserMessage({
        // PetImageRef 与 dsh-llm 的 ImageAttachmentRef 字段一致，差异只有品牌化类型（attachmentId 是 branded string）；
        // 插件侧不引 @deepseek-ai/dsh-attachment 的类型包，这里显式断言一次。
        content: content as unknown as Parameters<typeof createUserMessage>[0]['content'],
        source: { kind: 'user' },
      }),
    ],
    system,
    // 不显式限 maxTokens：与碎碎念同因——推理模型把思考计入预算，显式小上限会截断正文；
    // 不传由 dsh-llm 按适配器 defaultMaxTokens 兜底，对话短回复输出仍短。
    temperature: 1,
    // 统一关闭深度思考：闲聊对话不需要推理（与碎碎念同一约束；仅模型声明支持时传）
    ...(supportsOff ? { reasoningEffort: ReasoningEffortId('off') } : {}),
    signal: deadline,
  };

  const assembler = new BlockAssembler();
  try {
    for await (const chunk of llm.stream(options)) {
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:57-95](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/loops.ts#L57-L95)

余额周期及其启用与停止条件。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:153-196](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/loops.ts#L153-L196)

自动碎碎念独立条件。

<details>
<summary>查看原文（44行）</summary>

```text
        for (const pet of flattenPetList(cfg)) {
          const petId = String(pet.id ?? '');
          if (!petId) continue;
          // petId 就是从同一份 cfg 拍平出来的，所以必然命中（findPetInstance 与 flattenPetList
          // 搜索同一集合）；查不到只可能是两者口径漂移——跳过这一拍，不猜也不兜底 main。
          const found = findPetInstance(cfg, petId);
          if (!found) continue;
          checked += 1;
          const schedule = automaticWhisperSchedule(
            standaloneAiPolicy(),
            pet.whisperEnabled === true,
            whisperPeriodSec(found.conf),
          );
          if (!schedule.enabled) {
            // 两种「没启用」分开记：宠物自己关掉，与独立模式 AI 未就绪，处理方式完全不同
            skipped.push(petId + ': ' + (pet.whisperEnabled === true ? '独立模式 AI 未就绪' : 'whisperEnabled=false'));
            continue;
          }
          // 配置上不显示的宠物不生成：用户选「都不显示」就是不用了，后台继续调模型纯属白烧额度（#237）。
          // 放在 min 之前：不可见的宠物也不该把整拍的周期拖住。不推进 lastWhisperAt——
          // 与占用锁同一口径，重新可见后下一拍立刻补一句。
          const display = String(pet.display ?? '');
          if (!isDisplayed(display)) {
            skipped.push(petId + ': display=none');
            continue;
          }
          const sec = schedule.periodSec;
          min = Math.min(min, sec);
          if (now - (lastWhisperAt.get(petId) ?? 0) < sec * 1000) {
            notDue += 1;
            continue;
          }
          // 占用锁：这只宠物被占用时跳过这一拍——不生成也不补（碎碎念是瞬时事件，过期即弃），
          // 且不推进 lastWhisperAt：锁一放开，下一拍就该照常说。
          // 只挡这一处 per-pet 来源；全局段（balance / workStatus）由渲染端按宠物忽略——
          // 宿主跳过写入会连带静音别的宠物。
          if (lock.locked(petId)) {
            skipped.push(petId + ': 占用锁跳过');
            continue;
          }
          // 睡觉：不生成、也不推进 lastWhisperAt——醒来的下一拍立刻补一句，与占用锁同一口径。
          if (sleep.sleeping(petId)) {
            skipped.push(petId + ': 睡觉中');
            continue;
```

</details>

#### 缺口

- 真实账单、服务商数据处理及初始环境有效配置未核。
  **影响**：不能承诺无后台费用或内容留存策略。
  **进一步探讨**：用隔离环境逐项核对请求、模型名和配置生效状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何检验宠物提醒比原生状态更适合等候任务？

**研究主题**：新假设与验证

#### 完整回答

假设宠物提醒能缩短从需要审批到用户回到正确会话的时间，同时不增加误点或后台模型支出。以同一个 DSH 环境和相同事件序列比较原生提示、只启用宠物状态提示两组，交换试用顺序并交错产生两个会话的完成和审批事件。记录首个正确会话打开时间、漏报、误报、原生通知重复次数和后台请求。如果任务到达时间没有改善，误点增加，或额外后台请求超过事先预算，就不能支持采用。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/client/app.ts:100-115](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/client/app.ts#L100-L115)

会话导航与前台降级构成可测条件。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:262-288](https://github.com/PC2005-cloud/dsh-pet/blob/467f50e5c5318216d94f6fc46f3eab782bd0db32/dsh-pet/src/host/plugin/session-watch.ts#L262-L288)

真实通知接线与事件来源。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- 未执行用户行为和请求对照。
  **影响**：不能把设计目的写成实际效果。
  **进一步探讨**：用同环境两组交叉重复试用并保存通知和请求记录。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
