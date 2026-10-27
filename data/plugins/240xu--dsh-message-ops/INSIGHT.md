# dsh-message-ops

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d82f6de](https://github.com/240xu/dsh-message-ops/tree/d82f6de21683162ac7e83483536490a647f88ab5)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/240xu/dsh-message-ops) [![npm 30d 5,171](https://img.shields.io/static/v1?label=npm+30d&message=5%2C171&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops)
<!-- END META -->

> **实现功能**：为DSH Web提供消息回撤、单条遮蔽、文本恢复和会话回收站操作。

> **核心亮点**：在append-only会话上提供按seq控制上下文和渐进恢复的用户流程，避免重复实现原生分支；恢复不是解除遮蔽。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：回撤不撤销现实副作用；live路径先记录全部恢复seq再逐条append，异常时可能出现进度与实际文本不一致，尚未故障注入复现。[Q03](#research-q03)

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
  - [Q01 · 消息撤回、隐藏与恢复分别解决什么任务？](#detail-section-11)
  - [Q02 · surface替换和恢复进度如何绑定原始事件seq？](#detail-section-12)
  - [Q03 · 恢复是否会重放副作用，回撤是否等同业务撤销？](#detail-section-13)
  - [Q04 · 宿主依赖、客户端流程和恢复成本如何？](#detail-section-14)
  - [Q05 · 哪些状态设计可复用，哪些测试只证明局部？](#detail-section-15)
  - [Q06 · 副作用收据与上下文回撤联动能否降低状态分叉，如何采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在长会话中控制模型可见文本并查回历史的人，操作前必须停止会话。

原生session/fork用于分支，手工复制/新会话可做简单替代；消息可见性控制与业务状态撤销是不同任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回撤/单条遮蔽 | 控制模型可见内容 | 不抹除原始日志，不撤销工具副作用 |
| 恢复 | 追加被遮蔽消息文本 | 不重跑tool事件；需核对部分失败 |
| 消息查询/搜索 | 查可见与被遮蔽文本 | Web鉴权和会话格式依赖 |
| 会话回收站 | 移走/恢复会话目录 | purge为另一类永久删除操作，未完整审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=23.5与DSH Web运行时 | 必需 | zstd日志和客户端 | 无法保证加载 |
| 空闲会话及兼容surface格式 | 写操作必需 | seq操作与恢复 | 运行中409，协议不匹配可拒绝 |
| BrowserAuth | 有credentials时必需 | Web访问 | 缺失/不可读401 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并停止会话 | 原会话可重载 |
| 操作 | 面板选seq并确认 | 返回范围、计数与进度 |
| 验收 | 核对重载文本与实际工作区 | 不一致则停用，保留日志副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储和备份，金额未知 | 核对Node/宿主、备份会话 | 日志格式兼容需确认 |
| 持续 | 日志增加与索引扫描 | 停会话、选seq、核对副作用 | 无合格恢复耗时 |
| 失败恢复 | 会话副本与重复追加 | 比较进度、文本、工作区并人工补偿 | 部分append失败一致性未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 上下文控制 | surface遮蔽与消息文本重放 | 目标宿主重载兼容 |
| 恢复进度 | 原seq排除重复 | 中途失败后的真实性 |
| 业务撤销 | 不重放工具事件 | 不提供外部副作用补偿 |

> **思考**：回撤不撤销现实副作用；live路径先记录全部恢复seq再逐条append，异常时可能出现进度与实际文本不一致，尚未故障注入复现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在append-only会话上提供按seq控制上下文和渐进恢复的用户流程，避免重复实现原生分支；恢复不是解除遮蔽。[Q01](#research-q01)、[Q02](#research-q02)

在append-only会话上提供按seq控制上下文和渐进恢复的用户流程，避免重复实现原生分支；恢复不是解除遮蔽。[Q01](#research-q01)、[Q02](#research-q02)

原seq集合比单一恢复开关更可审计，live日志补算减少落盘窗口漂移；notice先写与逐条append仍非事务，失败闭合窗口不能代替状态回滚。[Q02](#research-q02)、[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

回撤不撤销现实副作用；live路径先记录全部恢复seq再逐条append，异常时可能出现进度与实际文本不一致，尚未故障注入复现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先保留可重载的会话备份，验证回撤、分步恢复、中断和重载均一致，再考虑限定试用；涉及已执行工具的区间必须另外核对现实状态。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

遮蔽及文本重放机制有源码支持；部分失败后的进度一致性存在待验证风险；副作用收据与后置确认方案未验证。

- 已检查：作者 README、包清单、源码路径 src/index.js、src/ops-core.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查消息恢复核心、服务端围栏、包声明和作者用法；未完整审计客户端、回收站和宿主引擎，不把消息恢复等同工具副作用回滚。
- 下一步：可进一步对live第N次append、flush和重载故障做隔离注入，对照恢复notice的原seq集合与实际新事件。

**分析版本**

- **仓库**：[240xu/dsh-message-ops](https://github.com/240xu/dsh-message-ops)
- **版本号**：0.11.5（[固定提交 d82f6de](https://github.com/240xu/dsh-message-ops/tree/d82f6de21683162ac7e83483536490a647f88ab5)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是回撤前生成副作用收据，并在成功append后提交恢复进度；用带外部写入及中断的会话副本检验状态分叉和重复动作。[Q06](#research-q06)

可进一步对live第N次append、flush和重载故障做隔离注入，对照恢复notice的原seq集合与实际新事件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 269 | 214 | 38 | — |
| .md | source | 1 | 832 | — | — | 11226 |
| .js | source | 5 | 6075 | 4591 | 1297 | — |
| .js | test | 25 | 3970 | 3060 | 566 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/240xu/dsh-message-ops/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对消息遮蔽与重放的实际语义、恢复一致性和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 消息撤回、隐藏与恢复分别解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是用户在长会话中不再把某段内容送入模型上下文，或找回被遮蔽的消息文本。回撤隐藏指定点及后续，单条删除只遮蔽一个节点；恢复追加文本副本，而非撤销遮蔽标志。相对手工重开会话或复制消息，增量是按seq定位、面板预览和恢复进度；分支与导出明确交给宿主原生能力。合格交付应同时核对模型可见内容和原始日志仍可加载，不能把UI消失当数据被彻底删除。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-36](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/README.md#L20-L36)

作者限定补充的消息能力与原生能力分工。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:12-20](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L12-L20)

源码说明append-only下的恢复语义。

```text
 * 引擎能力查证（来自安装的运行时 @deepseek-ai/dsh-session/lib/types/surface.js）：
 *   - SurfaceOp 只有 'append' 与 'replace' 两个变体，不存在「解除遮蔽」
 *     操作；surface replace 是 append-only 的永久遮蔽。
 *   - 运行时引擎的 replace 形状是 { op:'replace', startSeq, endSeq }
 *     （dsh-src 仓库较新副本已改名为 start/end；本插件面向安装的运行时，
 *     写入用 startSeq/endSeq，读取端两种拼写都兼容以便前向迁移）。
 *   - 因此「回滚恢复」只能实现为「重放」（replay）：把被遮蔽区间的
 *     user/assistant 消息文本重新 append 为新事件（0.6.0：干净文本无前缀，对齐 opencode），
 *     而不是取消遮蔽。语义差异见 README。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · surface替换和恢复进度如何绑定原始事件seq？

**研究主题**：功能与机制

#### 完整回答

服务端先验证sessionId/seq并拒绝运行中的会话，读取磁盘后优先使用live日志重建恢复计划。planRestore从回撤marker的replace范围筛选user/assistant消息，排除既有restoredSourceSeqs；tool/call等只计skipped，不重新执行工具。live路径在合成turn/step里append恢复notice及消息并对齐游标；store-miss磁盘路径把preamble、notice、replay和postamble作为一批追加。恢复进度由原事件seq建立，而新事件拥有新seq，因此文本接续与原始执行历史仍需区分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:717-755](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/index.js#L717-L755)

恢复计划、live日志和游标对齐主链。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/index.js:765-790](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/index.js#L765-L790)

磁盘批次保存restoredSourceSeqs。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[src/ops-core.js:375-410](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L375-L410)

按原seq排除已恢复项并跳过工具事件。

<details>
<summary>查看原文（36行）</summary>

```text
export function planRestore(events, restoreSeq, upToSeq, excludeSeqs) {
  if (!Array.isArray(events)) throw new OpsError("restore: events must be an array", 500);
  if (!Number.isSafeInteger(restoreSeq) || restoreSeq < 0) throw new OpsError("invalid seq", 400);
  const ev = events.find((e) => e && e.seq === restoreSeq);
  if (!ev) throw new OpsError(`restore: event seq ${restoreSeq} not found in log`, 404);
  // 读取端拼写统一走 session-file 的 readReplaceOp（双拼写兼容的单点）。
  const range = readReplaceOp(ev);
  if (!range) {
    throw new OpsError(`restore: seq ${restoreSeq} is not a revert/delete marker event (no well-formed replace surfaceOp)`, 409);
  }
  const { startSeq, endSeq } = range;
  // 0.8.0 按轮步进：upToSeq 给定则只重放到该 seq（含），后续仍保持遮蔽；
  // excludeSeqs = 已重放过（先前轮次 notice 的 restoredSourceSeqs 并集），
  // **必须排除，否则每轮都从区间头重放 → 消息副本刷屏**（0.8.0 实测 B1）。
  const cap = Number.isSafeInteger(upToSeq) ? Math.min(upToSeq, endSeq) : endSeq;
  const excluded = Array.isArray(excludeSeqs) ? new Set(excludeSeqs.filter((q) => Number.isSafeInteger(q))) : null;
  const replayable = [];
  let skipped = 0;
  for (const e of events) {
    if (!e || typeof e.seq !== "number" || e.seq < startSeq || e.seq > cap) continue;
    if (e.type === "user/message" || e.type === "assistant/message") {
      if (excluded && excluded.has(e.seq)) continue;
      const text = messageText(e);
      if (!text.trim()) { skipped++; continue; }
      replayable.push({
        seq: e.seq,
        type: e.type,
        role: e.type === "user/message" ? "user" : "assistant",
        text,
        source: e.type === "assistant/message" && e.data && e.data.message
          ? e.data.message.source
          : undefined,
      });
    } else {
      skipped++; // tool/call 等不可安全重放的事件：跳过并在结果里计数
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复是否会重放副作用，回撤是否等同业务撤销？

**研究主题**：缺陷与关键质疑

#### 完整回答

恢复只复制user/assistant文本而跳过tool事件，因此不会在这里直接重跑原工具；但回撤也没有撤销工具之前写的文件、发送的请求或外部状态。随后模型面对恢复文本可能再次安排动作，用户需防止现实状态与上下文分叉。另一个源码级风险是live applyRestore先写含全部计划seq的notice，再逐条append消息；若中途append失败，notice已声称全部seq恢复，后续按进度排除可能漏掉未成功追加项。外层补postamble不撤回notice；这是一条静态失败路径，未作故障注入复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:393-410](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L393-L410)

只恢复消息文本，工具跳过。

<details>
<summary>查看原文（18行）</summary>

```text
  for (const e of events) {
    if (!e || typeof e.seq !== "number" || e.seq < startSeq || e.seq > cap) continue;
    if (e.type === "user/message" || e.type === "assistant/message") {
      if (excluded && excluded.has(e.seq)) continue;
      const text = messageText(e);
      if (!text.trim()) { skipped++; continue; }
      replayable.push({
        seq: e.seq,
        type: e.type,
        role: e.type === "user/message" ? "user" : "assistant",
        text,
        source: e.type === "assistant/message" && e.data && e.data.message
          ? e.data.message.source
          : undefined,
      });
    } else {
      skipped++; // tool/call 等不可安全重放的事件：跳过并在结果里计数
    }
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:435-459](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L435-L459)

进度notice先于逐条append且flush失败不回滚。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/index.js:743-762](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/index.js#L743-L762)

外层异常只补闭合事件并释放会话。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

#### 缺口

- 缺少live逐条append中途失败后进度与加载一致性的独立证据
  **影响**：恢复可能出现文本缺口且状态显示已完成
  **进一步探讨**：在隔离会话副本对第N条append故障注入，核对notice集合、实际新事件及下一次恢复计划

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 宿主依赖、客户端流程和恢复成本如何？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node>=23.5提供内建zstd，Web客户端依赖宿主运行时；消息surface和日志版本约定是效果依赖。用户需先停止会话，在面板选seq确认操作，再核对恢复内容；整会话回收站与永久purge是另一类数据操作，不能混同消息遮蔽。HTTP入口检查loopback/same-origin，存在credentials但密钥记录不可读时fail-closed，老宿主无服务则退旧围栏。此边界减小Web误访问，不证明所有宿主版本兼容或磁盘恢复事务性。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-48](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/package.json#L25-L48)

客户端、Node和工具peer声明。

<details>
<summary>查看原文（24行）</summary>

```text
    "./session-file": "./src/session-file.js",
    "./package.json": "./package.json",
    "./ops-core": "./src/ops-core.js"
  },
  "engines": {
    "node": ">=23.5"
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
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.2.0-rc.1"
  }
```

</details>

**依据 2 · 源码核查**：[src/index.js:47-70](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/index.js#L47-L70)

HTTP信任、BrowserAuth与JSON围栏。

<details>
<summary>查看原文（24行）</summary>

```text
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
}

/** 写操作围栏：入口信任 + Content-Type 必须 application/json（CSRF 纵深）。 */
async function writeFence(targetCtx, req, res) {
  if (!(await fence(targetCtx, req, res))) return false;
  if (!isJsonContentType(req)) {
    sendJson(res, 415, { ok: false, error: "content-type must be application/json" });
    return false;
  }
  return true;
```

</details>

**依据 3 · 作者声明**：[README.md:38-48](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/README.md#L38-L48)

用户入口和确认步骤。

<details>
<summary>查看原文（11行）</summary>

```text
## 用法

- **会话头部**的 `Message ops` 按钮 → 右侧 `OpsPanel` 抽屉（消息 / 回收站双 tab）；
  旧 `OpsDialog` 仅 `window.__MOPS_LEGACY_DIALOG === true` 时回退
- **助手消息** hover 行的 `Revert to here` / `Quote to composer`
- **用户消息** hover 行的 `Revert to here`
- **输入框上方的回撤贴条**：展开后可逐条 `Restore`（消息级恢复入口）
- **侧栏会话行**的 `...` 菜单

面板流程：**选一条消息 → 回滚 / 仅删除 / 分支 → 破坏性操作二次确认**；
整会话删除在回收站 tab，需输入会话标题确认。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些状态设计可复用，哪些测试只证明局部？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

按原seq累计进度、使用live日志避免落盘延迟造成陈旧判断、恢复前校验marker范围，是可借鉴的append-only恢复设计。代价是与宿主turn/step、source、surface及压缩日志深耦合，升级需持续复核协议。一次合格操作应包括重新加载和确认上下文；没有真实耗时/失败率资料，不能声称降低维护成本。源码存在大量专门契约测试，但本轮只检查实现，不运行测试，也不把作者历史修复描述当新版本通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:168-181](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/index.js#L168-L181)

live内存日志用于补算committed。

<details>
<summary>查看原文（14行）</summary>

```text
 * 用**宿主内存日志**补算 marker's committed（0.10.5 · R2 的根治）。
 *
 * 问题：宿主在 session.append 后**同步** emit api-session/activity，而落盘是
 * **异步批窗**（$B/dsh-session/lib/index.js:1406 "hot path never blocks on I/O"；
 * persistence-jsonl:187 buffered/batchTimer，批窗 200ms）。opsList 读磁盘 +
 * derivedCache 按 mtimeMs+size 失效（loadDerived:376），所以 activity 刚到时
 * 几乎必然命中旧缓存 → markCommitted 看不到刚发出的 user 消息 → committed=false
 * → dock 不清。客户端此前只能靠「延迟 350/1400ms 重拉」赌落盘已完成，
 * 实测在 82% CPU 的 Android 上最坏 2×2.2s CPU + 2×248ms 卡顿，且 >1400ms 的
 * 落盘没有第三次触发（残留缺口）。
 *
 * 根治：live Session 直接暴露内存事件日志 `this.log`
 * （$B/dsh-session/lib/index.js:516），元素与磁盘事件**同构**
 * （:1454-1459 `{type, seq, time, data, ...surfaceMetadata}`）→ 直接补算。
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:375-390](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L375-L390)

marker与seq集合校验。

<details>
<summary>查看原文（16行）</summary>

```text
export function planRestore(events, restoreSeq, upToSeq, excludeSeqs) {
  if (!Array.isArray(events)) throw new OpsError("restore: events must be an array", 500);
  if (!Number.isSafeInteger(restoreSeq) || restoreSeq < 0) throw new OpsError("invalid seq", 400);
  const ev = events.find((e) => e && e.seq === restoreSeq);
  if (!ev) throw new OpsError(`restore: event seq ${restoreSeq} not found in log`, 404);
  // 读取端拼写统一走 session-file 的 readReplaceOp（双拼写兼容的单点）。
  const range = readReplaceOp(ev);
  if (!range) {
    throw new OpsError(`restore: seq ${restoreSeq} is not a revert/delete marker event (no well-formed replace surfaceOp)`, 409);
  }
  const { startSeq, endSeq } = range;
  // 0.8.0 按轮步进：upToSeq 给定则只重放到该 seq（含），后续仍保持遮蔽；
  // excludeSeqs = 已重放过（先前轮次 notice 的 restoredSourceSeqs 并集），
  // **必须排除，否则每轮都从区间头重放 → 消息副本刷屏**（0.8.0 实测 B1）。
  const cap = Number.isSafeInteger(upToSeq) ? Math.min(upToSeq, endSeq) : endSeq;
  const excluded = Array.isArray(excludeSeqs) ? new Set(excludeSeqs.filter((q) => Number.isSafeInteger(q))) : null;
```

</details>

**依据 3 · 作者声明**：[README.md:92-100](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/README.md#L92-L100)

作者报告磁盘进度修复而非本轮独立执行。

```text
### 0.11.5 · restore 进度落盘 + `turnAligned` 可观测

- **磁盘 restore 漏写 `restoredSourceSeqs`（数据正确性）**：`buildRestoreNoticeEvent`
  只写 `restoresSeq`，而 `restoreProgress` 靠 `restoredSourceSeqs` 累计已重放项。
  结果每次恢复都被判 `legacy`（`complete:true` 但 `restoredSeqs` 恒空）→ 进度不可见，
  且下一轮 `excludeSeqs` 为空 → **同一区间被反复重放**（实测 008f3759 两轮各 209 条）。
  磁盘路径改为把 `plan.replayable.map(i => i.seq)` 落进 notice；discard 时不写。
- `/revert` 与 `/restore` 响应新增 `turnAligned`：live 路径应为 `true`，
  disk/store-miss 路径没有内存 agent，`false` 属正常。便于运行时确认游标对齐是否生效。
```

#### 缺口

- 宿主升级后全量日志格式和部分失败成本未测
  **影响**：未知是否值得长期承担深耦合维护
  **进一步探讨**：在目标版本会话副本测回撤/分步恢复/重载，记录恢复人工时间与失败率

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 副作用收据与上下文回撤联动能否降低状态分叉，如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可在回撤前列出被遮蔽区间的工具副作用收据，明确哪些仅隐藏、哪些已影响工作区，并将恢复进度改为成功事件确认后再提交。前者帮助用户决定补偿，后者针对先报全部seq的失败窗口；两者都是未验证设计，不是现成功能。用带文件写入的会话副本对照“只看消息”与“副作用清单”，再注入中断验证恢复幂等；若清单遗漏或增加确认负担却不降低重复动作，则方向不成立。建议只在可备份会话上观察和验证后试用，关键恢复一致性缺口尚未排除，当前结论为观察。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:408-409](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L408-L409)

工具被跳过，副作用不在文本恢复范围。

```text
    } else {
      skipped++; // tool/call 等不可安全重放的事件：跳过并在结果里计数
```

**依据 2 · 源码核查**：[src/ops-core.js:444-456](https://github.com/240xu/dsh-message-ops/blob/d82f6de21683162ac7e83483536490a647f88ab5/src/ops-core.js#L444-L456)

逐项确认可收窄进度提交失败窗口。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
