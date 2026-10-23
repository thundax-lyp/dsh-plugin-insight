# dsh-message-ops

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[86008c2](https://github.com/240xu/dsh-message-ops/tree/86008c2df0ffc49115037aef0f6194697b68951b)

<!-- BEGIN META -->
[![npm 30d 5,119](https://img.shields.io/static/v1?label=npm+30d&message=5%2C119&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops)
<!-- END META -->

> **实现功能**：为 DSH 提供消息回撤、删除显示与恢复操作及对应模型工具。

> **核心亮点**：相对直接截断压缩日志，主要增量是利用宿主provenance与surface语义保留原事件，并按原seq核对恢复；这提供可追溯纠错流程，不能等同撤销外部工具副作用。[Q01](#research-q01)

> **风险与缺陷**：回撤改变模型可见上下文，不撤回此前工具已写文件或调用外部服务；恢复含重放语义且依赖宿主事件格式，用户必须核对上下文与现实状态是否分叉。[Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 追加式纠错相对文件截断改变什么？](#detail-section-11)
  - [Q02 · Web请求如何安全到达会话变更？](#detail-section-12)
  - [Q03 · 恢复进度是否等于完整回滚？](#detail-section-13)
  - [Q04 · 什么试用路径能控制恢复成本？](#detail-section-14)
  - [Q05 · 副作用摘要能否减少回撤后的重复执行？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要纠正对话分支或隐藏错误轮次的DSH用户；合格结果是可见上下文按预期变化且原日志仍可追溯。

宿主原生undo/redo或另开分支是优先参照；直接编辑会话日志可实现截断，但要自行处理压缩格式、内存状态与恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回撤/删除显示 | 重建可见上下文 | 会话停止；不撤销外部副作用 |
| 按marker恢复 | 恢复遮蔽消息 | 原seq及宿主格式需匹配 |
| 消息列表与工具 | 定位和执行操作 | Web围栏或宿主工具权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| live Session及surface API | 写操作必需 | provenance约束下追加替换 | retain失败返回不可用 |
| 同源浏览器与宿主cookie | Web访问必需 | 认证读写 | 无cookie拒绝；旧宿主降级需另核对 |
| 会话停止运行 | 变更必需 | 避免与Agent同时变更 | running返回409 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在备份/隔离会话停止Agent | running不再占用 |
| 2 | 选择回撤或删除范围并确认 | 界面范围与原日志对应 |
| 3 | 恢复时核对原marker与剩余seq | 未知结果先读进度，不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地插件与日志备份资源 | 理解遮蔽和恢复，耗时未知 | 不是外部事务回滚 |
| 持续使用 | 追加事件与派生缓存 | 选范围、核对上下文及现实状态 | 大日志解析成本未测 |
| 失败恢复 | 读取marker和重放记录 | 核对已恢复seq，时间未知 | flush失败不回滚已接受事件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 保留原文纠错 | surface replace追加而非删日志 | 新宿主provenance兼容性 |
| 恢复进度 | 原seq集合记录已重放项 | 故障/重启下无重复保证 |

> **思考**：回撤改变模型可见上下文，不撤回此前工具已写文件或调用外部服务；恢复含重放语义且依赖宿主事件格式，用户必须核对上下文与现实状态是否分叉。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对直接截断压缩日志，主要增量是利用宿主provenance与surface语义保留原事件，并按原seq核对恢复；这提供可追溯纠错流程，不能等同撤销外部工具副作用。[Q01](#research-q01)

相对直接截断压缩日志，主要增量是利用宿主provenance与surface语义保留原事件，并按原seq核对恢复；这提供可追溯纠错流程，不能等同撤销外部工具副作用。[Q01](#research-q01)

按原事件seq保存恢复进度，比纯UI恢复开关更可审计；live日志补算committed避免仅依赖异步落盘的窗口。大量宿主内部格式兼容分支也意味着维护成本高，复用应优先借用原生surface契约，不能照搬会话文件解析。

<a id="detail-section-5"></a>

### 1.4 主要限制

回撤改变模型可见上下文，不撤回此前工具已写文件或调用外部服务；恢复含重放语义且依赖宿主事件格式，用户必须核对上下文与现实状态是否分叉。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可在备份后的非关键会话试用。先停止Agent，核对选中范围和外部动作，恢复失败先读原marker进度；重要会话优先保留可追溯副本。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/ops-core.js、src/session-file.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host认证、live会话获取、surface replace和restore进度；不操作真实会话文件。
- 下一步：用包含工具调用的隔离会话核对回撤前后可见消息、日志原文与外部文件，再在恢复中断时按seq检查重复；本轮未执行。

**分析版本**

- **仓库**：[240xu/dsh-message-ops](https://github.com/240xu/dsh-message-ops)
- **版本号**：0.11.1（[固定提交 86008c2](https://github.com/240xu/dsh-message-ops/tree/86008c2df0ffc49115037aef0f6194697b68951b)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是回撤前列出该范围包含的工具副作用摘要并要求复核，可减少上下文回退后重复执行；比较故障任务的重复写入和人工核对时间，若无法可靠归因则否定。[Q05](#research-q05)

用包含工具调用的隔离会话核对回撤前后可见消息、日志原文与外部文件，再在恢复中断时按seq检查重复；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 269 | 214 | 38 | — |
| .md | source | 1 | 757 | — | — | 9980 |
| .js | source | 4 | 4114 | 2803 | 1191 | — |
| .js | test | 20 | 3170 | 2366 | 539 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/240xu/dsh-message-ops/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：240xu/dsh-message-ops 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 追加式纠错相对文件截断改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对话中错误轮次可能污染后续上下文，但直接截断压缩日志会丢原文并与宿主内存状态冲突。这里通过session.append的surface replace遮蔽区间，provenance交给宿主检查，原日志仍存在。恢复又记原seq集合，使纠错可追溯。贡献是上下文控制和恢复流程，不是数据库或外部服务事务撤销，原生分支/导出能力不应重复算贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1-5](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/index.js#L1-L5)

声明append-only边界及移除重复原生能力。

```text
/**
 * dsh-message-ops 服务端：HTTP 路由（revert / delete / messages / restore）+ Agent
 * 工具 message_ops，核心逻辑在 src/ops-core.js；工具注册容错（缺 services 只跳过）。
 * 走 DSH 原生 surface replace（append-only，引擎 assertProvenance 校验，违规 409），
 * 运行中的会话一律 409。分支/导出已归官方（0.9.0 移除），见 README「为什么不重复造轮子」。
```

**依据 2 · 源码核查**：[src/ops-core.js:266-282](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L266-L282)

真正通过宿主append写入surface替换。

<details>
<summary>查看原文（17行）</summary>

```text
export function applySurfaceReplace(session, startSeq, endSeq, sourceEventSeqs, noticeText, turnStep) {
  const ts = turnStep && Number.isSafeInteger(turnStep.turn) && turnStep.turn > 0
    ? turnStep : { turn: 1, step: 1 };
  const data = { turn: ts.turn, step: ts.step, message: { id: randomUUID(), role: "system", source: messageSource("system", 4), content: [{ type: "text", text: noticeText }] } };
  if (replaceShape) {
    return session.append("system/message", data, { surfaceOp: replaceOpFor(replaceShape, startSeq, endSeq), sourceEventSeqs });
  }
  try {
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("legacy", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "legacy";
    return event;
  } catch (err) {
    if (!/invalid replace surfaceOp/.test(String(err && err.message))) throw err;
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("new", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "new";
    return event;
  }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Web请求如何安全到达会话变更？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口先限制可信Host/Origin和JSON类型，再检查BrowserAuth cookie；旧宿主secret不可读的降级有明确边界。获取Session优先注册表，必要时通过retain等待ready，最后release。运行态检测拦截修改。写入使用原生append而非直接改文件，兼容surfaceOp形状的回退只针对明确格式错误，不把任意错误吞掉重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:45-69](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/index.js#L45-L69)

读写认证分层。

<details>
<summary>查看原文（25行）</summary>

```text
/** 统一入口围栏：全部 /api/message-ops/* 路由先过这一层（三层信任 + 宿主 BrowserAuth cookie）。 */
async function fence(targetCtx, req, res) {
  if (!isTrustedApiRequest(req)) {
    sendJson(res, 403, { ok: false, error: "untrusted request origin (loopback Host + same-origin only)" });
    return false;
  }
  // 0.10.8：宿主同条件 GET 被读全量（审计缺口）。宿主 /api admit = 三层围栏
  // 之外还要 BrowserAuth cookie（无 cookie → 401）；前端同源 fetch 自动带
  // cookie，取数不受影响。secret 读不到 = 降级回旧围栏（webAuthGate 内部
  // 告警一次），老宿主/测桩不破坏。
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

**依据 2 · 源码核查**：[src/index.js:131-161](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/index.js#L131-L161)

live会话retain/release链路。

<details>
<summary>查看原文（31行）</summary>

```text
async function acquireSession(ctx, sessionId) {
  const direct = resolveSession(ctx, sessionId);
  if (direct !== undefined) return { session: direct, release() {} };
  const owners = [];
  // reflect 层：api-session-controller 把 ISessions（ClientSessions，带 retain）经
  // `rootCtx.reflect.provide("sessions", this)` 挂在根上；普通 ctx.get 取到的是
  // 近端同名对象层（get/list 有、retain 无）——必须走 reflect.get 才是契约面。
  try { if (ctx && ctx.reflect && typeof ctx.reflect.get === "function") owners.push(["reflect", ctx.reflect.get("sessions", false)]); } catch { /* not provided */ }
  try { if (ctx && ctx.sessions) owners.push(["prop", ctx.sessions]); } catch { /* getter threw */ }
  try { const svc = ctx.get("sessions"); if (svc) owners.push(["get", svc]); } catch { /* absent */ }
  const holders = owners.filter(([, o]) => o && typeof o.retain === "function");
  if (holders.length === 0) {
    const why = owners.length === 0
      ? "no-owner (prop-absent && get-absent)"
      : owners.map(([src, o]) => src + ":no-retain(" + (o == null ? "null" : typeof o) + ")").join(",");
    __resolveSource = (__resolveSource || "") + " | ISessions:" + why;
    return null;
  }
  const isess = holders[0][1];
  let ref = null;
  try {
    ref = isess.retain(sessionId, { source: "controllerOperation" });
    const binding = await ref.ready;
    const face = binding && binding.session;
    if (!face) { __resolveSource = "retain-ready-no-session-face"; try { ref.release(); } catch { /* */ } return null; }
    __resolveSource = "acquired via ISessions.retain";
    return { session: face, release: () => { try { ref.release(); } catch { /* already released */ } } };
  } catch (e) {
    __resolveSource = "retain-failed: " + String(e && e.message).slice(0, 80);
    if (ref) { try { ref.release(); } catch { /* */ } }
    return null;
```

</details>

**依据 3 · 源码核查**：[src/ops-core.js:266-282](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L266-L282)

有限形状兼容分支。

<details>
<summary>查看原文（17行）</summary>

```text
export function applySurfaceReplace(session, startSeq, endSeq, sourceEventSeqs, noticeText, turnStep) {
  const ts = turnStep && Number.isSafeInteger(turnStep.turn) && turnStep.turn > 0
    ? turnStep : { turn: 1, step: 1 };
  const data = { turn: ts.turn, step: ts.step, message: { id: randomUUID(), role: "system", source: messageSource("system", 4), content: [{ type: "text", text: noticeText }] } };
  if (replaceShape) {
    return session.append("system/message", data, { surfaceOp: replaceOpFor(replaceShape, startSeq, endSeq), sourceEventSeqs });
  }
  try {
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("legacy", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "legacy";
    return event;
  } catch (err) {
    if (!/invalid replace surfaceOp/.test(String(err && err.message))) throw err;
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("new", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "new";
    return event;
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复进度是否等于完整回滚？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等于。恢复源码用restoredSourceSeqs记录重放，flush失败也不撤回已被接受的事件；因此结果未知时应查询原marker进度。即便消息恢复正确，先前工具可能已经写文件或发送请求，这些效果不由消息surface管理。live日志补算committed有助于缩小落盘窗口误判，但没有故障实验就不能声称恢复无重复或所有宿主兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:349-375](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L349-L375)

恢复追加与flush失败语义。

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

**依据 2 · 源码核查**：[src/ops-core.js:389-421](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L389-L421)

恢复进度按原seq去重核对。

<details>
<summary>查看原文（33行）</summary>

```text
export function restoreProgress(events, markerSeq) {
  const list = Array.isArray(events) ? events : [];
  const marker = list.find((e) => e && e.seq === markerSeq);
  if (!marker) return null;
  const range = readReplaceOp(marker);
  if (!range) return null;
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
```

</details>

**依据 3 · 源码核查**：[src/index.js:189-218](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/index.js#L189-L218)

live日志补算避免读盘时间窗口。

<details>
<summary>查看原文（30行）</summary>

```text
function applyLiveCommitted(messages, live) {
  // R4（审计）：388 份语料里 360+ 无 marker。原先无条件扫完整个 live.log 才 return，
  // 是请求路径上一个无界的同步 O(log.length) 扫描（最大实测 15178 事件），且不像
  // buildDerived 那样有 framesPerYield 让出点。先判「有没有需要补算的 marker」。
  let pending = null;
  for (const m of messages) {
    if (m.marker === true && typeof m.seq === "number" && m.committed !== true) {
      (pending || (pending = [])).push(m);
    }
  }
  if (!pending) return false;
  const log = live && Array.isArray(live.log) ? live.log : null;
  if (!log || log.length === 0) return false;
  // 只要**最大的**真实用户输入 seq：判据是「存在 seq > marker.seq」，用 max 即可，
  // 不必建数组 + sort（扫描本身已 O(log.length)，别再叠 O(n log n)）。
  let maxUserSeq = -1;
  for (const e of log) {
    if (!e || typeof e.seq !== "number" || e.seq <= maxUserSeq) continue;
    if (e.type !== "user/message") continue;
    if (((e.data || {}).source || {}).kind !== "user") continue;
    maxUserSeq = e.seq;
  }
  if (maxUserSeq < 0) return false;
  // ⚠️ 遍历**全部** pending marker：审计实测「只补算第一个 + break」是存活突变，
  // 而它对应一个真实 bug —— 用户连续回撤两次时第二个 marker 不被补算，
  // 第二条 dock 行在发消息后不消失（正是用户原话的残留形态）。
  let touched = 0;
  for (const m of pending) {
    if (maxUserSeq > m.seq) { m.committed = true; touched++; }
  }
```

</details>

#### 缺口

- 故障窗口和外部副作用分叉未测试
  **影响**：限制关键会话的恢复保证
  **进一步探讨**：把文件写入和中断恢复纳入同一隔离任务，核对消息和现实状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么试用路径能控制恢复成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合能备份并理解上下文遮蔽的用户，先用非关键会话停止Agent后操作。成本包括选择范围、解释遮蔽、读取恢复进度与核对外部状态；没有时间测量不能宣称比原生undo总是更快。若只是从某点重新探索，原生分支可能更简单。试用应以可见消息符合预期、原文仍在且没有额外外部动作作为验收，而非按钮返回ok。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:492-507](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/index.js#L492-L507)

列表提供运行状态并在变更前阻止运行会话。

<details>
<summary>查看原文（16行）</summary>

```text
    running: isRunning(targetCtx, sessionId),
    runningSource: __runningSource,
    total: messages.length,
    visibleCount,
    turnEndSeq,
    messages,
  };
}

/** 测试钩子（非公开 API）：直接驱动 list 与文件派生缓存。 */
export const _internals = { opsList, loadDerived, derivedCache };

async function opsCommit(targetCtx, mode, sessionId, seq) {
  if (!isSessionId(sessionId)) throw new OpsError("invalid sessionId", 400);
  if (!Number.isSafeInteger(seq) || seq < 0) throw new OpsError("invalid seq", 400);
  if (isRunning(targetCtx, sessionId)) throw new OpsError("session is running; stop it first", 409);
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:389-421](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L389-L421)

按进度核对比盲重试可控。

<details>
<summary>查看原文（33行）</summary>

```text
export function restoreProgress(events, markerSeq) {
  const list = Array.isArray(events) ? events : [];
  const marker = list.find((e) => e && e.seq === markerSeq);
  if (!marker) return null;
  const range = readReplaceOp(marker);
  if (!range) return null;
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
```

</details>

#### 缺口

- 大日志、重复操作和人工复核耗时未知
  **影响**：不能量化单位纠错成本
  **进一步探讨**：同任务比较原生分支、消息操作与人工备份的总时间和错误。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 副作用摘要能否减少回撤后的重复执行？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是从选中区间的工具事件提取操作摘要，回撤前提示已执行动作仍在现实世界存在。当前surface管理和原事件保留使摘要有来源基础，但摘要不能充当自动补偿。用含文件写入、只读工具和失败请求的任务对照是否减少误重跑；若无法识别请求的实际结果，必须保留unknown，不能自动猜测已撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:266-282](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L266-L282)

保留来源事件使副作用摘要具备定位基础。

<details>
<summary>查看原文（17行）</summary>

```text
export function applySurfaceReplace(session, startSeq, endSeq, sourceEventSeqs, noticeText, turnStep) {
  const ts = turnStep && Number.isSafeInteger(turnStep.turn) && turnStep.turn > 0
    ? turnStep : { turn: 1, step: 1 };
  const data = { turn: ts.turn, step: ts.step, message: { id: randomUUID(), role: "system", source: messageSource("system", 4), content: [{ type: "text", text: noticeText }] } };
  if (replaceShape) {
    return session.append("system/message", data, { surfaceOp: replaceOpFor(replaceShape, startSeq, endSeq), sourceEventSeqs });
  }
  try {
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("legacy", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "legacy";
    return event;
  } catch (err) {
    if (!/invalid replace surfaceOp/.test(String(err && err.message))) throw err;
    const event = session.append("system/message", data, { surfaceOp: replaceOpFor("new", startSeq, endSeq), sourceEventSeqs });
    replaceShape = "new";
    return event;
  }
```

</details>

**依据 2 · 源码核查**：[src/ops-core.js:292-330](https://github.com/240xu/dsh-message-ops/blob/86008c2df0ffc49115037aef0f6194697b68951b/src/ops-core.js#L292-L330)

恢复从原事件规划，不含外部事务补偿。

<details>
<summary>查看原文（39行）</summary>

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
      });
    } else {
      skipped++; // tool/call 等不可安全重放的事件：跳过并在结果里计数
    }
  }
  // 0.5.6：区间无可重放消息（如只遮蔽了 tool/system 事件）不再 409 ——
  // dock 会为这类标记常驻显示恢复按钮，409 死按钮 = 永远清不掉（实测 8 连 409）。
  // 改为返回空计划：applyRestore 仍追加说明 notice（含 restoresSeq）→ 标记停用、
  // dock 计数递减；语义如实：0 条重放 + 文案说明区间无 user/assistant 内容。
  return { restoreSeq, startSeq, endSeq, upToSeq: Number.isSafeInteger(upToSeq) ? cap : endSeq, replayable, skipped };
```

</details>

#### 缺口

- 副作用提取与用户收益未验证
  **影响**：未来假设不属于当前恢复能力
  **进一步探讨**：先做只读摘要原型并对照重复执行率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
