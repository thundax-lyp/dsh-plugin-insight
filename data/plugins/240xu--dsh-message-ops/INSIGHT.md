# DSH Message Ops

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d699ddb](https://github.com/240xu/dsh-message-ops/tree/d699ddb2c0df1a0ba795606a1e64459167373726)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/240xu/dsh-message-ops) [![npm 30d 5,728](https://img.shields.io/static/v1?label=npm+30d&message=5%2C728&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops)
<!-- END META -->

> **功能**：为 DSH Web 提供消息回撤、遮蔽恢复、分叉入口、编辑回填与会话回收站。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持按原seq管理上下文和渐进文本恢复，减少手工重建的潜在步骤；不等于实际业务撤销。

> **主要限制**：[Q02](#research-q02) 的live路径先声明进度再追加正文，失败可能使恢复进度与实际文本不符；[Q03](#research-q03) 的GET回收站会永久清到期负载。

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
  - [Q01 · 相对新会话与官方分支，增加何种可见操作？](#detail-section-11)
  - [Q02 · 遮蔽、恢复与进度如何接线，哪里可能部分完成？](#detail-section-12)
  - [Q03 · 回收站与鉴权怎样影响恢复及数据生命周期？](#detail-section-13)
  - [Q04 · 应如何核算负担、限制采用并验证更可靠的恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要调整长会话模型可见历史的用户可按消息区间遮蔽与恢复，原日志及外部业务状态须分别核对。

参照新会话手动粘贴与官方分叉；官方fork属于宿主，本组件增加边界和面板操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息回撤与单条遮蔽 | 调整模型上下文 | 不撤外部动作 |
| 渐进文本恢复 | 重放用户与助手消息 | 进度和正文可能部分不一致 |
| 消息检索 | 回查原历史文本 | 依赖会话日志可读 |
| 用户消息分叉 | 以之前轮次为分支 | 调用官方fork，边界信息缺失时回退 |
| 编辑草稿回填 | 修改后人工重发 | 不等自动安全重执行 |
| 会话回收站 | 目录删除与恢复 | 需标题确认，列表会清理到期项 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=23.5与兼容DSH会话格式 | 必需 | 读取与追加事件 | 格式漂移可能拒绝重载 |
| Web宿主和认证 | HTTP入口必需 | 面板与消息接口 | cookie不满足则拒绝 |
| 已停止会话 | 写操作必需 | 避免运行中修改 | 返回409 |
| 原日志与文件状态副本 | 采用条件 | 核对失败和业务状态 | 回收站不能替代备份 |
| 官方session/fork | 分叉必需 | 创建宿主分支 | 不回退自建磁盘分支 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户停止会话、备份日志和文件状态 | 副本可独立重载 |
| 调整 | 面板选择消息并确认遮蔽 | 仅预期上下文改变 |
| 恢复 | 小区间逐轮恢复文本 | 正文、进度、草稿一致 |
| 验收 | 重新加载并核对外部动作 | 不符则停止追加，保留现场从副本恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 日志和备份空间未知 | 格式、认证与副本检查 | 耗时未知 |
| 持续使用 | 追加事件增加存储 | 停会话、选区间、核正文 | 未测token净收益 |
| 失败恢复 | 日志副本及重试资源 | 进度与文本和外部状态对账 | 不能盲重试 |
| 退出 | 保留原日志 | 停用插件、用原副本续接 | 回收站有到期删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 上下文控制 | 原seq区间遮蔽 | 任务质量与token改善 |
| 文本恢复 | 消息重放与进度集合 | 中断后完整一致 |
| 会话回收 | manifest与恢复补偿 | 所有格式和失败分支可重载 |

> **思考**：[Q02](#research-q02) 的live路径先声明进度再追加正文，失败可能使恢复进度与实际文本不符；[Q03](#research-q03) 的GET回收站会永久清到期负载。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持按原seq管理上下文和渐进文本恢复，减少手工重建的潜在步骤；不等于实际业务撤销。

[Q02](#research-q02) 源seq去重和合成窗口降低错误追加风险，但恢复回执需与真正写入统一；[Q03](#research-q03) manifest保留中间态便于人工恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的live路径先声明进度再追加正文，失败可能使恢复进度与实际文本不符；[Q03](#research-q03) 的GET回收站会永久清到期负载。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 保持观察；只在可重载副本先测小区间，确认正文与进度和外部文件状态。缺正文或重载异常时停止追加，保留原日志与现场。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

上下文控制与回收机制有固定源码依据；live恢复一致性和业务收益未实测，逐条持久进度为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/ops-core.js、src/session-trash.js、src/client.js、src/session-file.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件抽读HTTP、surface和恢复核心、回收站及用户分叉边界；未审计全部客户端与宿主引擎，未执行目标。
- 下一步：在独立副本的每个恢复append处中断，重启后对照源seq、正文、可加载性与外部副作用，比较全部人工时间。

**分析版本**

- **仓库**：[240xu/dsh-message-ops](https://github.com/240xu/dsh-message-ops)
- **版本号**：0.12.0（[固定提交 d699ddb](https://github.com/240xu/dsh-message-ops/tree/d699ddb2c0df1a0ba795606a1e64459167373726)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 的未验证方向是在持久确认正文后逐条提交进度，并明确外部动作收据；中断对照若不能减少漏恢复与人工负担则放弃。

在独立副本的每个恢复append处中断，重启后对照源seq、正文、可加载性与外部副作用，比较全部人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 269 | 214 | 38 | — |
| .md | source | 1 | 887 | — | — | 12113 |
| .js | source | 5 | 6472 | 4837 | 1440 | — |
| .js | test | 30 | 4517 | 3505 | 617 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/240xu/dsh-message-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/240xu/dsh-message-ops/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/240xu/dsh-message-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：消息遮蔽、文本恢复与整会话回收怎样改变模型上下文，哪些恢复承诺不能据此成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对新会话与官方分支，增加何种可见操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件为需要控制长会话模型可见历史的用户提供消息遮蔽、恢复与操作面板。合格操作既要改变预期上下文，也必须保留能重载的会话及可核对的原消息；删掉界面上一行并非充分验收。相对另开新会话手动粘贴，它按原事件序号规划区间并保留追加日志，提供渐进文本恢复。

分叉由官方 session/fork 提供，本组件增加用户消息之前的边界计算和草稿回填，不应归因为它自己实现完整分支引擎。client优先使用turnStartSeq-1，无轮次信息时回退seq-1，存在边界精度差异。README中“官方没有”的描述仅是作者对所述版本的比较，本次没有审计所有当前宿主能力。消息回撤影响模型上下文，不撤销已经写出的文件、API请求或其他业务副作用；用户若要撤实际工作，应另用VCS或业务补偿。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-43](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/README.md#L1-L43)

作者范围、官方分支归属与删除磁盘分支的说明。

<details>
<summary>查看原文（43行）</summary>

````text
# @240xu/dsh-message-ops

DSH web 插件：**消息回滚 + 删除 + 恢复**。只补 dsh 官方**没有**的能力。

> **0.9.0 是破坏性变更**：移除了本插件的**磁盘分支实现**与 **Markdown 导出**。
> 两者 dsh 官方都已有（`session/fork` 与 `/api/session.export`），详见下方「为什么不重复造轮子」。
>
> **0.12.0**：消息动作收敛到用户消息（AI 消息的分支入口移除），用户消息动作行新增
> opencode 式 `Fork from here`，面板内新增「编辑并重发」。详见「用法」。


## 10 秒速查

```sh
dsh plugin --profile web add @240xu/dsh-message-ops
# 重启 dsh web 后，会话头部点 Message ops
```

- 能做什么：回滚到任意消息、只删一条、恢复、从用户消息分叉（opencode before 语义）、编辑并重发；分支调用官方 session/fork
- 不能做什么：Markdown 导出（请用官方 `/api/session.export`）
- 卸载：`dsh plugin --profile web remove @240xu/dsh-message-ops`

## 官方没有、本插件提供的

| 能力 | 官方 dsh 0.2.0-rc.2 | 本插件 |
|---|---|---|
| **消息回滚**（遮蔽该条及其后全部内容） | ❌ 没有。`SurfaceOp` 只有 `append\|replace`，**没有解除遮蔽的操作**；`undo` 仅指草稿编辑器的 Ctrl+Z | ✅ |
| **单条删除** | ❌ 没有。官方 README 明文 *"sessions can be archived but never deleted"* | ✅ |
| **恢复**（撤销一次回滚/删除） | ❌ 没有 | ✅ |

## 为什么不重复造轮子（0.9.0 的取舍）

- **分支** → 官方有完整实现：RPC `session/fork`（`atSeq` 任意）+ `SessionStore.fork()`
  + UI 消息级按钮 + 官方埋点就叫 `branch_session_click`。
  本插件原先还有一个磁盘实现（`applyBranch`）作为「官方失败时的回落」，但它语义是错的：
  删掉了 `isSeeded`（官方 fork 设 `true`）、不写 `inheritedEventCount`、
  也不补 fork closers → 产出的子会话边界可能悬空。**已删除**，失败时直接提示停止运行中的会话。
- **Markdown 导出** → 官方 `/api/session.export` 提供 ZIP 归档（原始 JSONL + 附件，面向迁移/复现）。
  格式确实不重叠，但本插件的导出**零 UI 入口**（实测路由可用但前端从不调用），等于死代码。**已删除**。

## 用法

- **会话头部**的 `Message ops` 按钮 → 右侧 `OpsPanel` 抽屉（消息 / 回收站双 tab）；
````

</details>

**依据 2 · 源码核查**：[src/client.js:1797-1826](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/client.js#L1797-L1826)

实际按轮边界及缺轮信息的保守回退。

<details>
<summary>查看原文（30行）</summary>

```text
    // --- 0.12.0 消息级分叉（opencode 语义：分叉点**排他**，原文回到新会话输入框）-----
    //
    // 官方 `sessions.fork(source, boundary)` 的 boundary 是**闭区间**（含该事件）。
    // opencode 的 fork 是 before 语义（不含该条用户消息）+ 把该条放回新会话 composer。
    // 两者要一致，就必须把边界退到「该用户消息所在 turn 之前」。
    //
    // ⚠️ 不能退到 `seq - 1`。实测 40 份语料：真人输入的前一个事件**恒是同一 turn
    // 内的 system/message**（turn/start → agent/inbox/spliced → step/start →
    // system/message → user/message）。按 seq-1 切会得到一个「turn/step 已开、
    // 却没有任何 user 消息」的悬空前缀，引擎必须补合成 closers，语义也不是
    // 用户要的「这条之前」。
    // 正确边界 = 该 turn 的 turn/start seq 的**前一个**事件（`turnStartSeq - 1`）。
    // 服务端在 `GET /messages?view=compact` 里直接给出 `turnStartSeq`（见
    // src/index.js buildDerived），客户端不猜。
    const FORK_SESSION_STORAGE_PREFIX = 'dsh.conversation.'

    /**
     * 官方 fork 边界（inclusive）：目标用户消息所在 turn 的 turn/start 前一个事件。
     *
     * @param seq - 目标用户消息的日志 seq（仅用于无 turn 信息时的保守回退）
     * @param turnStartSeq - 该消息所在 turn 的 turn/start seq；服务端 compact 视图提供
     * @returns 可直接作为 `sessions.fork({ atSeq })` 的闭区间边界；不可分叉时 -1
     */
    function forkBoundaryBefore(seq, turnStartSeq) {
      // 首选：按轮切（服务端已给出 turnStartSeq）
      if (Number.isSafeInteger(turnStartSeq) && turnStartSeq > 0) return turnStartSeq - 1
      // 回退：没有 turn 信息（老服务端 / 合成行）时退一格。
      // 这时切点可能落在 turn 内部，官方会补合成 closers —— 结果仍可加载，
      // 只是前缀边界不如按轮切干净。宁可这样也不静默不分叉。
      return Number.isSafeInteger(seq) && seq > 0 ? seq - 1 : -1
```

</details>

**依据 3 · 源码核查**：[src/index.js:653-707](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L653-L707)

回撤是surface replace与追加事件，不是外部业务回滚。

<details>
<summary>查看原文（55行）</summary>

```text
  if (!Number.isSafeInteger(seq) || seq < 0) throw new OpsError("invalid seq", 400);
  if (isRunning(targetCtx, sessionId)) throw new OpsError("session is running; stop it first", 409);
  const { logPath } = pickSessionDir(sessionId);
  const { header, events } = await readSessionFileAsync(logPath);
  // 0.8.2：空闲会话（实测 340/364）没有打开的 turn/step → 用自足的**合成 turn**
  // 承载 notice，而不是拒绝。引擎 append-only 插不进已有 step，但合成一整个 turn 合法
  //��已对官方校验闸实测：append 型 / 单节点 replace / 多节点 replace 全 PASS，遮蔽受保护头正确拒绝）。
  // 带 reason:"message-ops"，UI 与审计可识别，不与真实模型轮次混淆。
  let win = planNoticeWindow(events);
  const notice = mode === "delete"
    ? `[消息删除] 已遮蔽 seq ${seq}`
    : null; // revert 文案含 shadowed 数量，规划后拼
  const acq = await acquireSession(targetCtx, sessionId);
  if (acq !== null && acq.session !== undefined) {
    try {
      const session = acq.session;
      const liveEvents = sessionLogOf(session);
      if (liveEvents) win = planNoticeWindow(liveEvents);
      const turnStep = { turn: win.turn, step: win.step };
      // 0.5.4（P0）：v4 准入要求 system/message 带正 turn/step——缺字段时持久层
      // encodeEventBatch 的 SessionFormatError 未捕获会**打死整个 dsh 进程**。
      const plan = mode === "delete" ? planDelete(session.surface, seq) : planRevert(session.surface, seq);
      const text = mode === "delete" ? notice
        : `[消息回滚] 已回滚到 seq ${seq}（含）之后的 ${plan.shadowedSeqs.length} 个节点`;
      // 0.8.2：会话 store 命中时走引擎路径 —— 同样要先开合成 turn 窗口，
      // 否则 notice 落在已关闭的 turn/step 里，加载端拒绝整份历史。
      // 0.10.8 孤儿护栏：plan 校验（planRevert/planDelete 的 409 拒绝）本就在
      // preamble **之前**执行；落 preamble 后残余的失败路径只剩引擎侧的
      // replace/provenance/turn-step 校验（拼写探测双失败、surface TOCTOU 变化）。
      // 捕一层把合成 turn 用 postamble **闭合**——失败时内存里不再留一个常开
      // turn（0.8.2 注释锁定的「后半操作被 409 锁拒」形态），随后原样抛出，
      // 由路由层按既有 OpsError 映射。append-only 引擎无「删除已落事件」能力，
      // 闭合孤儿窗口是最小且可被动校验的整理。
      // 0.11.3 P0：postamble 只能写一次。
      // 旧实现把 `for (const post of postamble) session.append(...)` 同时放在 try
      // 成功路径和 catch 里；一旦**成功路径的 postamble 自身**抛错（引擎已接受
      // step/end，第二个 turn/end 被拒 / flush 失败），catch 会再写一遍 →
      // 日志落成 `step/end, turn/end, step/end, turn/end`。宿主读盘直接判
      // `step/end does not match an open turn and step`，整份会话变 corrupt
      // （实测 session-5b49db5b seq 806-809）。用 closed 标志保证闭环只发生一次。
      let closed = false
      const closeWindow = () => {
        if (closed) return
        closed = true
        for (const post of noticeWindowPostamble(win)) {
          try { session.append(post.kind, post.data) } catch { /* 引擎拒：维持原错误/继续 */ }
        }
      }
      try {
        for (const pre of noticeWindowPreamble(win)) session.append(pre.kind, pre.data);
        const event = applySurfaceReplace(session, plan.startSeq, plan.endSeq, plan.shadowedSeqs, text, turnStep);
        // 必须闭合：否则引擎内存里 turn 永远开着 → isRunning 恒真 → 后续操作全被 409
        closeWindow()
        const aligned = win.synthetic ? alignLiveTurnCursor(targetCtx, session, win.turn) : false;
        flushSessions(targetCtx, session);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 遮蔽、恢复与进度如何接线，哪里可能部分完成？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

写操作拒绝运行中的会话；live路径以合成turn窗口承载surface replace，成功后尝试闭合窗口、对齐游标与flush；没有live句柄时将新事件批量追加到磁盘。恢复先读原事件和已有恢复notice，排除已恢复的源seq，再把用户或助手消息文本追加为新事件。它是重放，不是解除原区间遮蔽，也不重放完整工具调用语义。

关键边界在live恢复。applyRestore先追加含全部计划源seq的notice，再逐条append正文；restoreProgress只合并notice的restoredSourceSeqs判断已恢复。因此如果后续append被拒或进程中断，notice可能声明了尚未实际出现的消息，下一次计划又排除它们。源码足以支持这种状态不一致风险，未在本轮复现其概率。flushSessions和applyRestore还吞同步flush错误，返回ok不能独立证明持久可重载。磁盘路径把notice与正文组成一个批次，不能用它的批次语义为live多次append背书。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:653-707](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L653-L707)

运行锁拒绝、surface变更、合成窗口和flush。

<details>
<summary>查看原文（55行）</summary>

```text
  if (!Number.isSafeInteger(seq) || seq < 0) throw new OpsError("invalid seq", 400);
  if (isRunning(targetCtx, sessionId)) throw new OpsError("session is running; stop it first", 409);
  const { logPath } = pickSessionDir(sessionId);
  const { header, events } = await readSessionFileAsync(logPath);
  // 0.8.2：空闲会话（实测 340/364）没有打开的 turn/step → 用自足的**合成 turn**
  // 承载 notice，而不是拒绝。引擎 append-only 插不进已有 step，但合成一整个 turn 合法
  //��已对官方校验闸实测：append 型 / 单节点 replace / 多节点 replace 全 PASS，遮蔽受保护头正确拒绝）。
  // 带 reason:"message-ops"，UI 与审计可识别，不与真实模型轮次混淆。
  let win = planNoticeWindow(events);
  const notice = mode === "delete"
    ? `[消息删除] 已遮蔽 seq ${seq}`
    : null; // revert 文案含 shadowed 数量，规划后拼
  const acq = await acquireSession(targetCtx, sessionId);
  if (acq !== null && acq.session !== undefined) {
    try {
      const session = acq.session;
      const liveEvents = sessionLogOf(session);
      if (liveEvents) win = planNoticeWindow(liveEvents);
      const turnStep = { turn: win.turn, step: win.step };
      // 0.5.4（P0）：v4 准入要求 system/message 带正 turn/step——缺字段时持久层
      // encodeEventBatch 的 SessionFormatError 未捕获会**打死整个 dsh 进程**。
      const plan = mode === "delete" ? planDelete(session.surface, seq) : planRevert(session.surface, seq);
      const text = mode === "delete" ? notice
        : `[消息回滚] 已回滚到 seq ${seq}（含）之后的 ${plan.shadowedSeqs.length} 个节点`;
      // 0.8.2：会话 store 命中时走引擎路径 —— 同样要先开合成 turn 窗口，
      // 否则 notice 落在已关闭的 turn/step 里，加载端拒绝整份历史。
      // 0.10.8 孤儿护栏：plan 校验（planRevert/planDelete 的 409 拒绝）本就在
      // preamble **之前**执行；落 preamble 后残余的失败路径只剩引擎侧的
      // replace/provenance/turn-step 校验（拼写探测双失败、surface TOCTOU 变化）。
      // 捕一层把合成 turn 用 postamble **闭合**——失败时内存里不再留一个常开
      // turn（0.8.2 注释锁定的「后半操作被 409 锁拒」形态），随后原样抛出，
      // 由路由层按既有 OpsError 映射。append-only 引擎无「删除已落事件」能力，
      // 闭合孤儿窗口是最小且可被动校验的整理。
      // 0.11.3 P0：postamble 只能写一次。
      // 旧实现把 `for (const post of postamble) session.append(...)` 同时放在 try
      // 成功路径和 catch 里；一旦**成功路径的 postamble 自身**抛错（引擎已接受
      // step/end，第二个 turn/end 被拒 / flush 失败），catch 会再写一遍 →
      // 日志落成 `step/end, turn/end, step/end, turn/end`。宿主读盘直接判
      // `step/end does not match an open turn and step`，整份会话变 corrupt
      // （实测 session-5b49db5b seq 806-809）。用 closed 标志保证闭环只发生一次。
      let closed = false
      const closeWindow = () => {
        if (closed) return
        closed = true
        for (const post of noticeWindowPostamble(win)) {
          try { session.append(post.kind, post.data) } catch { /* 引擎拒：维持原错误/继续 */ }
        }
      }
      try {
        for (const pre of noticeWindowPreamble(win)) session.append(pre.kind, pre.data);
        const event = applySurfaceReplace(session, plan.startSeq, plan.endSeq, plan.shadowedSeqs, text, turnStep);
        // 必须闭合：否则引擎内存里 turn 永远开着 → isRunning 恒真 → 后续操作全被 409
        closeWindow()
        const aligned = win.synthetic ? alignLiveTurnCursor(targetCtx, session, win.turn) : false;
        flushSessions(targetCtx, session);
```

</details>

**依据 2 · 源码核查**：[src/index.js:753-826](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L753-L826)

恢复计划、live多append和disk批次路径有区别。

<details>
<summary>查看原文（74行）</summary>

```text
async function opsRestore(targetCtx, sessionId, restoreSeq, upToSeq, discard) {
  if (!isSessionId(sessionId)) throw new OpsError("invalid sessionId", 400);
  if (!Number.isSafeInteger(restoreSeq) || restoreSeq < 0) throw new OpsError("invalid seq", 400);
  if (upToSeq !== undefined && (!Number.isSafeInteger(upToSeq) || upToSeq < 0)) throw new OpsError("invalid upToSeq", 400);
  if (isRunning(targetCtx, sessionId)) throw new OpsError("session is running; stop it first", 409);
  const { logPath } = pickSessionDir(sessionId);
  const { events } = await readSessionFileAsync(logPath);
  // 0.8.0（B1 修复）：步进恢复必须排除先前轮次已重放的源 seq，
  // 否则每轮从区间头重放 → 消息副本成倍出现。
  // 合成 turn 承载 notice 的完整理由见 opsCommit() 处（0.8.2，实测 340/364 空闲会话）。
  const buildPlan = (sourceEvents) => {
    const window = planNoticeWindow(sourceEvents);
    const progress = restoreProgress(sourceEvents, restoreSeq);
    const restorePlan = planRestore(sourceEvents, restoreSeq, upToSeq, progress ? progress.restoredSeqs : null);
    restorePlan.turnStep = { turn: window.turn, step: window.step };
    restorePlan.window = window;
    if (discard) restorePlan.discard = true;
    if (restorePlan.replayable.length === 0 && progress && !progress.complete && progress.pendingSeqs.length > 0) {
      // 请求的 upTo 之前已全部重放过 → 只补一条进度 notice（不重复重放）
      restorePlan.upToSeq = upToSeq != null ? Math.min(upToSeq, restorePlan.endSeq) : restorePlan.endSeq;
    }
    return { win: window, plan: restorePlan };
  };
  let { win, plan } = buildPlan(events);
  const acq = await acquireSession(targetCtx, sessionId);
  if (acq !== null && acq.session !== undefined) {
    // 0.10.8 孤儿护栏（与 opsCommit 同型）：planRestore/进度校验本就在 preamble
    // 之前完成；applyRestore 里的引擎 append 若抛（如 replay 坐标错开），
    // preamble 已落——闭合合成 turn 再原样抛出，不留常开孤儿窗口。
    try {
      const liveEvents = sessionLogOf(acq.session);
      if (liveEvents) ({ win, plan } = buildPlan(liveEvents));
      for (const pre of noticeWindowPreamble(win)) acq.session.append(pre.kind, pre.data);
      const result = applyRestore(acq.session, plan, {
        flush: () => { flushSessions(targetCtx, acq.session); },
      });
      for (const post of noticeWindowPostamble(win)) acq.session.append(post.kind, post.data);
      const aligned = win.synthetic ? alignLiveTurnCursor(targetCtx, acq.session, win.turn) : false;
      return { ok: true, ...result, turnAligned: aligned, discarded: plan.discard === true, upToSeq: plan.upToSeq, restoredSourceSeqs: plan.replayable.map((i) => i.seq), range: { startSeq: plan.startSeq, endSeq: plan.endSeq } };
    } catch (err) {
      for (const post of noticeWindowPostamble(win)) {
        try { acq.session.append(post.kind, post.data); } catch { /* postamble 被引擎拒：维持原错误上抛 */ }
      }
      throw err;
    } finally {
      acq.release();
    }
  }
  // store-miss → 磁盘路径：说明事件 + 重放事件批量追加（一个帧）
  let cursor = nextSeqFrom(events);
  const baseTime = Date.now();
  const version = (await readSessionFileAsync(logPath)).header?.version ?? 4;
  const batch = noticeWindowPreamble(win).map((e, i) => ({
    type: e.kind, seq: cursor++, time: baseTime + i, data: e.data,
  }));
  const noticeBase = baseTime + batch.length;
  batch.push(buildRestoreNoticeEvent({
    seq: cursor++, time: noticeBase, turnStep: plan.turnStep, version,
    text: plan.discard
      ? `[消息操作] 回撤标记 seq ${plan.restoreSeq} 已停用（丢弃）：区间内容保持遮蔽、未重放；日志原文仍在，可搜索`
      : restoreNoticeText(plan),
    restoreSeq: plan.restoreSeq,
    discard: plan.discard === true,
    // 0.11.4：把本轮实际重放的源 seq 落进 notice，restoreProgress 才能累计进度、
    // 下一轮 excludeSeqs 才不会重复重放同一批消息（详见 ops-core 该函数注释）。
    restoredSourceSeqs: plan.discard ? [] : plan.replayable.map((i) => i.seq),
  }));
  let offset = 0;
  for (const item of plan.discard ? [] : plan.replayable) {
    batch.push(buildReplayEvent({ seq: cursor++, time: noticeBase + (++offset), item, turnStep: plan.turnStep, version }));
  }
  let tail = noticeBase + offset + 1;
  for (const e of noticeWindowPostamble(win)) batch.push({ type: e.kind, seq: cursor++, time: tail++, data: e.data });
  await diskAppend(logPath, batch);
```

</details>

**依据 3 · 源码核查**：[src/ops-core.js:435-461](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/ops-core.js#L435-L461)

notice先声明全部源seq，再逐条正文，flush错误忽略。

<details>
<summary>查看原文（27行）</summary>

```text
export function applyRestore(session, plan, { flush } = {}) {
  const eventSeqs = [];
  const notice = plan.discard
    ? `[消息操作] 回撤标记 seq ${plan.restoreSeq} 已停用（丢弃）：区间内容保持遮蔽、未重放；日志原文仍在，可搜索`
    : restoreNoticeText(plan);
  // 0.4.2：notice 事件携带 restoresSeq —— dock 据此把被恢复的标记从「活跃回撤」
  // 中移除（对齐 opencode clear 语义：恢复后不再显示为待恢复项）。
  const ts = plan.turnStep && Number.isSafeInteger(plan.turnStep.turn) && plan.turnStep.turn > 0
    ? plan.turnStep : { turn: 1, step: 1 };
  const noticeEvent = session.append(
    "system/message",
    { turn: ts.turn, step: ts.step, message: { id: randomUUID(), role: "system", source: messageSource("system", 4), content: [{ type: "text", text: notice }] }, restoresSeq: plan.restoreSeq, restoredSourceSeqs: plan.discard ? [] : plan.replayable.map((i) => i.seq), ...(plan.discard ? { discarded: true } : {}) },
    { surfaceOp: "append" },
  );
  if (noticeEvent && noticeEvent.seq != null) eventSeqs.push(noticeEvent.seq);
  for (const item of plan.discard ? [] : plan.replayable) {
    const event = session.append(
      item.type,
      replayEventData(item, ts),
      { surfaceOp: "append" },
    );
    if (event && event.seq != null) eventSeqs.push(event.seq);
  }
  if (flush) {
    try { flush(); } catch { /* flush 失败不回滚已接受的事件 */ }
  }
  return { restoredCount: plan.discard ? 0 : plan.replayable.length, skipped: plan.skipped, eventSeqs };
```

</details>

**依据 4 · 源码核查**：[src/ops-core.js:481-509](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/ops-core.js#L481-L509)

恢复进度依据notice源seq集合，不回证每条正文存在。

<details>
<summary>查看原文（29行）</summary>

```text
  const { startSeq, endSeq } = range;
  // 该区间内可重放的消息型事件
  const candidates = [];
  for (const e of list) {
    if (!e || typeof e.seq !== "number" || e.seq < startSeq || e.seq > endSeq) continue;
    if (e.type !== "user/message" && e.type !== "assistant/message") continue;
    if (!(messageText(e) || "").trim()) continue;
    candidates.push(e.seq);
  }
  // 收集针对该标记的所有恢复 notice
  const notices = list.filter((e) => e && e.data && e.data.restoresSeq === markerSeq);
  const restored = new Set();
  let legacy = false;
  let discarded = false;
  for (const n of notices) {
    // 0.8.1：显式丢弃（不重放内容、仅停用标记）也算完成——
    // 用户场景"我都没回滚过，清掉测试遗留条"，2709 条重放是另一种污染。
    if (n.data.discarded === true) { discarded = true; continue; }
    const seqs = n.data && Array.isArray(n.data.restoredSourceSeqs) ? n.data.restoredSourceSeqs : null;
    if (!seqs) { legacy = true; continue; }
    for (const q of seqs) if (Number.isSafeInteger(q)) restored.add(q);
  }
  const pending = candidates.filter((q) => !restored.has(q));
  return {
    startSeq,
    endSeq,
    restoredSeqs: Array.from(restored).sort((a, b) => a - b),
    pendingSeqs: pending,
    complete: legacy || discarded ? true : pending.length === 0,
```

</details>

**依据 5 · 源码核查**：[src/index.js:286-291](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L286-L291)

flush同步错误未传播给操作回执。

```text
function flushSessions(ctx, session) {
  const sessions = ctx.get("sessions");
  if (sessions && typeof sessions.flush === "function") {
    try { return sessions.flush(session); } catch { /* flush 失败不回滚已接受的事件 */ }
  }
  return undefined;
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回收站与鉴权怎样影响恢复及数据生命周期？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

HTTP入口先检查本机同源条件，再使用宿主BrowserAuth cookie；credentials服务不存在时兼容旧围栏，有服务但记录不可读则拒绝。它是本地宿主信任模型，不证明对公开多租户服务有完整授权。Node>=23.5和会话事件格式、存储目录以及可写权限是实际依赖。

整会话回收是另一条机制。确认标题后先写moving manifest，再移动目录、剥离元数据并写trashed；失败尝试回移和恢复元数据，无法完成则保留manifest供人工恢复。恢复拒绝覆盖已存在会话，目录与元数据仍分步处理。GET回收站路由显式传purgeExpired:true，列表扫描会永久删除到期目录，所以“看回收站”具有清理副作用，回收站也不是长期备份。损坏manifest在列表被跳过，不等于对应负载不存在。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:46-60](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L46-L60)

同源与BrowserAuth接线及兼容分支。

<details>
<summary>查看原文（15行）</summary>

```text
/** 统一入口围栏：全部 /api/message-ops/* 路由先过这一层（三层信任 + 宿主 BrowserAuth cookie）。 */
async function fence(targetCtx, req, res) {
  if (!isTrustedApiRequest(req)) {
    sendJson(res, 403, { ok: false, error: "untrusted request origin (loopback Host + same-origin only)" });
    return false;
  }
  // 0.10.8：宿主同条件 GET 被读全量（审计缺口）。宿主 /api admit = 三层围栏
  // 之外还要 BrowserAuth cookie（无 cookie → 401）；前端同源 fetch 自动带
  // cookie，取数不受影响。无 credentials 服务 = 老宿主旧围栏；有服务但
  // 记录不可读 = 401 fail-closed（webAuthGate 内部告警一次）。
  if (!(await webAuthGate(targetCtx, req))) {
    sendJson(res, 401, { ok: false, error: "unauthorized (browser auth cookie required; reopen the URL printed by dsh web)" });
    return false;
  }
  return true;
```

</details>

**依据 2 · 源码核查**：[package.json:31-46](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/package.json#L31-L46)

Node、bundle、client和peer依赖声明。

<details>
<summary>查看原文（16行）</summary>

```text
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "test": "node --check src/client.js && node --test \"test/*.test.js\""
  },
  "peerDependencies": {
```

</details>

**依据 3 · 源码核查**：[src/index.js:1083-1120](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/index.js#L1083-L1120)

GET列表触发到期清理，POST调用会话动作。

<details>
<summary>查看原文（38行）</summary>

```text
    // --- Session trash：删除整条会话（可逆），列表 / 恢复 / 永久清理 ----------
    targetCtx.effect(() => host.register({
      kind: "exact",
      path: "/api/message-ops/session/trash",
      handler: async (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, error: "method not allowed" });
        if (!(await fence(targetCtx, req, res))) return;
        try {
          return sendJson(res, 200, { ok: true, entries: await listTrash(targetCtx, { purgeExpired: true }) });
        } catch (err) {
          return sendJson(res, err instanceof OpsError ? err.status : 500, { ok: false, error: String(err && err.message ? err.message : err) });
        }
      },
    }), "dsh-message-ops: session trash route");

    const sessionAction = (path, action) => targetCtx.effect(() => host.register({
      kind: "exact",
      path,
      handler: async (req, res) => {
        if (req.method !== "POST") return sendJson(res, 405, { ok: false, error: "method not allowed" });
        if (!(await writeFence(targetCtx, req, res))) return;
        const body = await readFencedBody(req, res);
        if (body === undefined) return;
        if (!body || typeof body !== "object") return sendJson(res, 400, { ok: false, error: "invalid json" });
        try {
          return sendJson(res, 200, await action(targetCtx, body));
        } catch (err) {
          return sendJson(res, err instanceof OpsError ? err.status : 500, { ok: false, error: String(err && err.message ? err.message : err) });
        }
      },
    }), "dsh-message-ops: " + path);

    sessionAction("/api/message-ops/session/delete", (c, b) =>
      deleteSessionToTrash(c, b.sessionId, b.confirmTitle));
    sessionAction("/api/message-ops/session/restore", (c, b) =>
      restoreTrash(c, b.trashId));
    sessionAction("/api/message-ops/session/purge", (c, b) =>
      purgeTrash(c, b.trashId));
```

</details>

**依据 4 · 源码核查**：[src/session-trash.js:285-326](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/session-trash.js#L285-L326)

manifest、移动、元数据与补偿顺序。

<details>
<summary>查看原文（42行）</summary>

```text
  if (String(confirmTitle == null ? "" : confirmTitle).trim() !== expected) {
    throw new OpsError(`title mismatch: type "${expected}" to delete`, 400);
  }

  const now = Date.now();
  const trashId = `${now}-${randomUUID().slice(0, 8)}`;
  const root = path.join(trashRoot(), trashId);
  const rel = path.relative(sessionsRoot(), dirs[0].dir);
  const dataRel = path.join("data", rel);
  const manifest = {
    version: 1,
    trashId,
    sessionId,
    title: title || null,
    state: "moving",
    deletedAt: now,
    expiresAt: now + TRASH_RETENTION_MS,
    dirs: [{ rel, originalSlug: dirs[0].slug, originalName: dirs[0].name }],
    ...meta,
  };
  writeManifest(root, manifest);

  const source = dirs[0].dir;
  const target = path.join(root, dataRel);
  let moved = false;
  try {
    moveDir(source, target);
    moved = true;
    if (findAllSessionDirs(sessionId).length > 0) throw new OpsError("session directory still present after move", 500);
    await stripMetadata(ctx, sessionId, meta);
    manifest.state = "trashed";
    writeManifest(root, manifest);
  } catch (err) {
    let dataBack = !moved && fs.existsSync(source) && !fs.existsSync(target);
    let metadataBack = dataBack;
    if (moved) {
      try {
        moveDir(target, source);
        dataBack = true;
        await restoreMetadata(ctx, sessionId, meta);
        metadataBack = true;
      } catch { /* leave the manifest for manual restore */ }
```

</details>

**依据 5 · 源码核查**：[src/session-trash.js:346-365](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/session-trash.js#L346-L365)

损坏manifest跳过、到期目录永久删除。

<details>
<summary>查看原文（20行）</summary>

```text
export async function listTrash(ctx, { purgeExpired = false, now = Date.now() } = {}) {
  let names = [];
  try { names = fs.readdirSync(trashRoot(), { withFileTypes: true }); } catch { return []; }
  const entries = [];
  for (const name of names) {
    if (!name.isDirectory() || !TRASH_ID_RE.test(name.name)) continue;
    let manifest;
    try { manifest = readManifest(name.name); } catch { continue; }
    if (purgeExpired && typeof manifest.expiresAt === "number" && manifest.expiresAt <= now) {
      try { fs.rmSync(path.join(trashRoot(), name.name), { recursive: true, force: true }); } catch { /* retry next time */ }
      continue;
    }
    entries.push({
      trashId: name.name,
      sessionId: manifest.sessionId,
      title: manifest.title || null,
      state: manifest.state || "trashed",
      deletedAt: manifest.deletedAt || null,
      expiresAt: manifest.expiresAt || null,
      workspaceIds: Array.isArray(manifest.workspaceIds) ? manifest.workspaceIds : [],
```

</details>

**依据 6 · 源码核查**：[src/session-trash.js:398-429](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/session-trash.js#L398-L429)

恢复防覆盖与永久清理机制。

<details>
<summary>查看原文（32行）</summary>

```text
export async function restoreTrash(ctx, trashId) {
  const manifest = readManifest(trashId);
  const { rel, target } = restoreTarget(manifest);
  if (fs.existsSync(target)) throw new OpsError("session directory already exists; refusing to overwrite", 409);

  const root = path.join(trashRoot(), trashId);
  const source = path.join(root, "data", rel);
  let sourceStat;
  try { sourceStat = fs.lstatSync(source); } catch { throw new OpsError("trash payload missing", 404); }
  if (!sourceStat.isDirectory()) throw new OpsError("trash payload is not a directory", 500);

  try {
    moveDir(source, target);
    if (!fs.existsSync(target)) throw new OpsError("restore move failed", 500);
    await restoreMetadata(ctx, manifest.sessionId, manifest);
  } catch (err) {
    try {
      if (fs.existsSync(target) && !fs.existsSync(source)) moveDir(target, source);
    } catch { /* leave both for manual recovery */ }
    throw err;
  }

  try { fs.rmSync(root, { recursive: true, force: true }); } catch { /* manifest cleanup is best effort */ }
  return { ok: true, trashId, sessionId: manifest.sessionId, title: manifest.title || null };
}

export async function purgeTrash(ctx, trashId) {
  assertTrashId(trashId);
  const root = path.join(trashRoot(), trashId);
  if (!fs.existsSync(root)) throw new OpsError("trash entry not found", 404);
  fs.rmSync(root, { recursive: true, force: true });
  return { ok: true, trashId };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应如何核算负担、限制采用并验证更可靠的恢复？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前建议保持观察，确有消息管理需求者仅在能独立重载的会话副本中验证。先停止会话、保存原日志和关联文件状态，再小区间遮蔽与逐轮恢复，核对消息、seq、草稿和重新加载；不要把回收站作为唯一备份。发现恢复进度与正文不符、重载失败或外部状态未撤销时应停止追加，保留现场并从原副本核对，不靠盲目重试。

按一次正确上下文调整计量时，必须把备份、停会话、选择消息、恢复检查、外部副作用核对和失败修复都计入。没有本次测量，无法给节省token、节时或单位成本。未验证假设是恢复正文取得持久确认后，再提交对应逐条进度，配合原操作副作用收据。与现有notice先写比较，应在副本中每个append处中断，再重启，统计缺失正文、重复消息、误认完成和人工恢复时间；若仅增加事件而未降低错配或总负担，则否定该设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:435-461](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/ops-core.js#L435-L461)

逐条提交假设针对现有notice与正文次序。

<details>
<summary>查看原文（27行）</summary>

```text
export function applyRestore(session, plan, { flush } = {}) {
  const eventSeqs = [];
  const notice = plan.discard
    ? `[消息操作] 回撤标记 seq ${plan.restoreSeq} 已停用（丢弃）：区间内容保持遮蔽、未重放；日志原文仍在，可搜索`
    : restoreNoticeText(plan);
  // 0.4.2：notice 事件携带 restoresSeq —— dock 据此把被恢复的标记从「活跃回撤」
  // 中移除（对齐 opencode clear 语义：恢复后不再显示为待恢复项）。
  const ts = plan.turnStep && Number.isSafeInteger(plan.turnStep.turn) && plan.turnStep.turn > 0
    ? plan.turnStep : { turn: 1, step: 1 };
  const noticeEvent = session.append(
    "system/message",
    { turn: ts.turn, step: ts.step, message: { id: randomUUID(), role: "system", source: messageSource("system", 4), content: [{ type: "text", text: notice }] }, restoresSeq: plan.restoreSeq, restoredSourceSeqs: plan.discard ? [] : plan.replayable.map((i) => i.seq), ...(plan.discard ? { discarded: true } : {}) },
    { surfaceOp: "append" },
  );
  if (noticeEvent && noticeEvent.seq != null) eventSeqs.push(noticeEvent.seq);
  for (const item of plan.discard ? [] : plan.replayable) {
    const event = session.append(
      item.type,
      replayEventData(item, ts),
      { surfaceOp: "append" },
    );
    if (event && event.seq != null) eventSeqs.push(event.seq);
  }
  if (flush) {
    try { flush(); } catch { /* flush 失败不回滚已接受的事件 */ }
  }
  return { restoredCount: plan.discard ? 0 : plan.replayable.length, skipped: plan.skipped, eventSeqs };
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:481-509](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/ops-core.js#L481-L509)

进度集合提供可观测验收对象。

<details>
<summary>查看原文（29行）</summary>

```text
  const { startSeq, endSeq } = range;
  // 该区间内可重放的消息型事件
  const candidates = [];
  for (const e of list) {
    if (!e || typeof e.seq !== "number" || e.seq < startSeq || e.seq > endSeq) continue;
    if (e.type !== "user/message" && e.type !== "assistant/message") continue;
    if (!(messageText(e) || "").trim()) continue;
    candidates.push(e.seq);
  }
  // 收集针对该标记的所有恢复 notice
  const notices = list.filter((e) => e && e.data && e.data.restoresSeq === markerSeq);
  const restored = new Set();
  let legacy = false;
  let discarded = false;
  for (const n of notices) {
    // 0.8.1：显式丢弃（不重放内容、仅停用标记）也算完成——
    // 用户场景"我都没回滚过，清掉测试遗留条"，2709 条重放是另一种污染。
    if (n.data.discarded === true) { discarded = true; continue; }
    const seqs = n.data && Array.isArray(n.data.restoredSourceSeqs) ? n.data.restoredSourceSeqs : null;
    if (!seqs) { legacy = true; continue; }
    for (const q of seqs) if (Number.isSafeInteger(q)) restored.add(q);
  }
  const pending = candidates.filter((q) => !restored.has(q));
  return {
    startSeq,
    endSeq,
    restoredSeqs: Array.from(restored).sort((a, b) => a - b),
    pendingSeqs: pending,
    complete: legacy || discarded ? true : pending.length === 0,
```

</details>

**依据 3 · 源码核查**：[src/session-trash.js:398-429](https://github.com/240xu/dsh-message-ops/blob/d699ddb2c0df1a0ba795606a1e64459167373726/src/session-trash.js#L398-L429)

防覆盖和恢复负担决定人工退路。

<details>
<summary>查看原文（32行）</summary>

```text
export async function restoreTrash(ctx, trashId) {
  const manifest = readManifest(trashId);
  const { rel, target } = restoreTarget(manifest);
  if (fs.existsSync(target)) throw new OpsError("session directory already exists; refusing to overwrite", 409);

  const root = path.join(trashRoot(), trashId);
  const source = path.join(root, "data", rel);
  let sourceStat;
  try { sourceStat = fs.lstatSync(source); } catch { throw new OpsError("trash payload missing", 404); }
  if (!sourceStat.isDirectory()) throw new OpsError("trash payload is not a directory", 500);

  try {
    moveDir(source, target);
    if (!fs.existsSync(target)) throw new OpsError("restore move failed", 500);
    await restoreMetadata(ctx, manifest.sessionId, manifest);
  } catch (err) {
    try {
      if (fs.existsSync(target) && !fs.existsSync(source)) moveDir(target, source);
    } catch { /* leave both for manual recovery */ }
    throw err;
  }

  try { fs.rmSync(root, { recursive: true, force: true }); } catch { /* manifest cleanup is best effort */ }
  return { ok: true, trashId, sessionId: manifest.sessionId, title: manifest.title || null };
}

export async function purgeTrash(ctx, trashId) {
  assertTrashId(trashId);
  const root = path.join(trashRoot(), trashId);
  if (!fs.existsSync(root)) throw new OpsError("trash entry not found", 404);
  fs.rmSync(root, { recursive: true, force: true });
  return { ok: true, trashId };
```

</details>

#### 缺口

- 未取得同条件消息管理任务和中断恢复测量。
  **影响**：不能确认端到端收益或恢复设计实效。
  **进一步探讨**：在独立可重载副本对比新会话粘贴、官方分叉和该组件，记录全部合格率与人工时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
