# DSH Message Ops

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[75d798e](https://github.com/240xu/dsh-message-ops/tree/75d798ef0f015da242a721d3278430640b29b393)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/240xu/dsh-message-ops) [![npm 30d 7,265](https://img.shields.io/static/v1?label=npm+30d&message=7%2C265&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-message-ops)
<!-- END META -->

> **功能**：为 DSH Web 提供消息级回撤、删除遮蔽和文本恢复，并提供会话回收站入口。

> **亮点**：按消息seq控制上下文及渐进文本恢复，保留append-only原日志；回收站是另种目录操作，不等业务补偿。见[Q01](#research-q01)。

> **主要限制**：live先在notice声明全部源seq再逐条append，中断可能进度与正文不符；回撤不撤外部动作，GET回收站列表也会永久清到期条目。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 谁需要哪种删除/恢复，实际入口和增量？](#detail-section-11)
  - [Q02 · live/磁盘回撤与渐进恢复如何保持一致？](#detail-section-12)
  - [Q03 · 回收站/认证/运行时有哪些边界？](#detail-section-13)
  - [Q04 · 全周期成本、采用条件及可证伪方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望控制长会话模型可见文本并按需恢复历史的人，修改前先停会话并留副本。见[Q01](#research-q01)。

复制消息到新会话/原生fork，导出与分支交宿主，不重建错误磁盘分支。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回撤/单条删除 | 控制模型可见范围 | 追加遮蔽，原日志仍在 |
| 文本恢复 | 按源seq渐进新append | 不解除遮蔽/不重跑工具，进度失败窗口待验 |
| 搜索/引用 | 读历史及已遮蔽文本 | 认证/格式/日志可读 |
| 会话回收站 | 移动/恢复目录元数据 | 7天保留，GET列表也清到期内容 |

**流程与依赖**

Node/宿主格式、停止会话、写目录与可重载备份必需；表见[Q04](#research-q04)。

副本上选seq回撤/分段恢复，重载对照实际文本/进度和外部状态，关键故障先停写；步骤见[Q04](#research-q04)。

**效果与成本**

日志/备份、停会话、选择和补偿负担未知，回收站期限与恢复一致性增加复核；表见[Q04](#research-q04)。

上下文控制和源seq进度有源码，不等业务撤销或已证故障恢复；效果见[Q04](#research-q04)。

> **思考**：live先在notice声明全部源seq再逐条append，中断可能进度与正文不符；回撤不撤外部动作，GET回收站列表也会永久清到期条目。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：按消息seq控制上下文及渐进文本恢复，保留append-only原日志；回收站是另种目录操作，不等业务补偿。见[Q01](#research-q01)。

源seq进度、live日志优先与合成窗口闭合可借鉴；notice先写/flush吞错、宿主格式耦合及回收站多状态需分别验收。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

live先在notice声明全部源seq再逐条append，中断可能进度与正文不符；回撤不撤外部动作，GET回收站列表也会永久清到期条目。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察，确有需求者先在可重载副本验证渐进/中断恢复；正文缺失、重载或现实状态不符时停止追加，保留现场并从副本核对，不靠盲重试。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持遮蔽/恢复、认证和回收站机制，live关键失败一致性未排除。本轮观察；未运行，确认后进度和副作用收据是假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、src/index.js、src/ops-core.js、src/session-trash.js、src/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧六题、全部findings/证据版本与自身code依赖。当前核Host/客户端入口、surface与live/disk恢复及进度、HTTP认证、会话回收manifest/元数据/到期清理；未通读宿主引擎/全部client或执行目标。
- 下一步：后续副本故障矩阵核第N条append/flush/write、重载和外部文件，回收另验移动/元数据失败及到期列表；普通加载留授权环境。

**分析版本**

- **仓库**：[240xu/dsh-message-ops](https://github.com/240xu/dsh-message-ops)
- **版本号**：0.11.8（[固定提交 75d798e](https://github.com/240xu/dsh-message-ops/tree/75d798ef0f015da242a721d3278430640b29b393)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为成功接受/持久确认后提交逐条进度，加回撤副作用收据；用副本中断/文件写入对照分叉、漏恢复和人工时间，收益不足则否定，不当自动补偿。见[Q04](#research-q04)。

后续副本故障矩阵核第N条append/flush/write、重载和外部文件，回收另验移动/元数据失败及到期列表；普通加载留授权环境。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 269 | 214 | 38 | — |
| .md | source | 1 | 832 | — | — | 11226 |
| .js | source | 5 | 6143 | 4640 | 1316 | — |
| .js | test | 27 | 4138 | 3203 | 572 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/240xu/dsh-message-ops/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：消息遮蔽/恢复的日志一致性、会话回收与现实副作用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要哪种删除/恢复，实际入口和增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH Web插件，Host apply注册消息和会话回收站HTTP路径，并在tools服务可用时动态注册消息操作工具；client把会话头、消息动作和输入框回撤贴条接宿主slots。工具依赖不满足只警告并保留HTTP面，不能把看见按钮当所有入口都已启用。真实entry_type为plugin。

目标是长会话中希望某段内容不再送进模型、又想按需找回历史文本的人。基线是复制有用消息到新会话，或使用原生fork另开分支。增量是按seq（原日志事件序号）选回撤区间/单条、标注可见性与恢复进度，原生fork/导出继续由宿主承担，避免再造另一套边界语义。

三种“删除/恢复”不能混用。消息revert/delete追加surface replace标记来遮蔽模型上下文，原日志保留且可搜索；恢复是追加user/assistant文本副本，新事件有新seq，不是解除旧遮蔽。整会话delete则把目录/元数据移回收站，purge或到期清理才永久移除副本。无论哪种都不自动撤销原工具写的文件、已发请求或现实副作用。合格结果要同时核模型可见内容、日志重载与现实状态，而非只看UI行消失。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-46](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/package.json#L21-L46)

Host/client与bundle声明。

<details>
<summary>查看原文（26行）</summary>

```text
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./client": "./src/client.js",
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
```

</details>

**依据 2 · 源码核查**：[src/index.js:890-918](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L890-L918)

容错注册模型工具。

<details>
<summary>查看原文（29行）</summary>

```text
function registerToolTolerantly(ctx) {
  function tryRegister(targetCtx) {
    const tools = targetCtx.get("tools");
    if (!tools || typeof tools.register !== "function") return false;
    // 动态 import：包缺失时只跳过工具，不拖垮插件的 HTTP 面。
    import("@deepseek-ai/dsh-tools")
      .then(({ defineTool }) => {
        const ops = {
          list: (c, id) => opsList(c, id),
          revert: (c, id, seq) => opsCommit(c, "revert", id, seq),
          delete: (c, id, seq) => opsCommit(c, "delete", id, seq),
          restore: (c, id, seq, upToSeq) => opsRestore(c, id, seq, upToSeq),
        };
        tools.register(createMessageOpsTool({ defineTool, ops, ctx: targetCtx }));
      })
      // 0.9.0：不再静默吞错。原先 catch(() => {}) 让「工具注册成功与否」完全无从诊断
      // （实测日志里 defineTool / ERR_MODULE_NOT_FOUND 零命中）。
      .catch((e) => {
        console.warn('[message-ops] defineTool 注册失败，工具不可用（其余功能不受影响）:', e && (e.code || e.message) ? (e.code || e.message) : e)
      });
    return true;
  }
  if (tryRegister(ctx)) return;
  ctx.inject(["tools"], (sub) => { tryRegister(sub); });
}

// ---------------------------------------------------------------------------
// 插件入口：HTTP 路由 + 容错工具注册
// ---------------------------------------------------------------------------
```

</details>

**依据 3 · 源码核查**：[src/index.js:920-947](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L920-L947)

真实HTTP入口。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx) {
  // 诊断（0.5.4 调试）：会话状态服务解析情况
  try {
    const names = ["sessions", "agents", "sessionController", "sessionList", "session-manager"];
    const parts = names.map((n) => { const v = ctx.get(n); return n + "=" + (v == null ? String(v) : typeof v); });
    const ses = ctx.get("sessions");
    const hasList = ses && ses.list != null;
    const hasSnap = hasList && typeof ses.list.getSnapshot === "function";
    console.log("[message-ops] session services: " + parts.join(" ") + " | sessions.list=" + hasList + " getSnapshot=" + hasSnap + (ses ? " keys=" + Object.keys(ses).slice(0, 12).join("|") : ""));
  } catch (e) { console.log("[message-ops] probe failed: " + e); }
  function registerHttp(host, targetCtx) {
    // --- GET /api/message-ops/messages：消息列表（只读） ---------------------
    targetCtx.effect(() => host.register({
      kind: "exact",
      path: "/api/message-ops/messages",
      handler: async (req, res) => {
        if (req.method !== "GET") return sendJson(res, 405, { ok: false, error: "method not allowed" });
        if (!(await fence(targetCtx, req, res))) return;
        try {
          const url = new URL(req.url, "http://localhost");
          return sendJson(res, 200, await opsList(targetCtx, url.searchParams.get("sessionId") || "", {
            compact: url.searchParams.get("view") === "compact",
          }));
        } catch (err) {
          return sendJson(res, err instanceof OpsError ? err.status : 500, { ok: false, error: String(err && err.message ? err.message : err) });
        }
      },
    }), "dsh-message-ops: messages route");
```

</details>

**依据 4 · 源码核查**：[src/client.js:3109-3147](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/client.js#L3109-L3147)

宿主slot入口。

<details>
<summary>查看原文（39行）</summary>

```text
    function apply(ctx) {
      __sessionsSvc = ctx.get('sessions')
      __uiWorkspace = typeof ctx.get === 'function' ? ctx.get('uiWorkspace') : null
      if (!__uiWorkspace) {
        try { ctx.inject(['uiWorkspace'], (sub) => { __uiWorkspace = sub.uiWorkspace || sub }) } catch { /* 0.1.x 无此服务 */ }
      }
      if (!__sessionsSvc) {
        ctx.inject(['sessions'], (sub) => { __sessionsSvc = sub.sessions })
      }
      registerUndoSlash(ctx)
      adoptLocale(ctx.get('locale'), ctx)
      if (!__locale) {
        ctx.inject(['locale'], (sub) => {
          adoptLocale(sub.locale, ctx)
          refreshSidebarOpsLabel()
        })
      }
      ctx.on('locale/change', refreshSidebarOpsLabel)
      if (window.__MOPS_DISABLE_HEADER !== true) ctx.slots.inject(SLOT, () => ctx.slots.register({
        name: SLOT, id: ROW_ID, order: 31,
        ...(__locale ? { locale: NS } : {}),
      }, OpsButton))
      // 0.3.0：每条 AI 消息旁的原生回撤按钮（0.1.x 无此槽，inject 自动 no-op）
      ctx.slots.inject(CHAT_ACTIONS_SLOT, () => ctx.slots.register({
        name: CHAT_ACTIONS_SLOT, id: CHAT_ACTIONS_ID, order: 20,
        ...(__locale ? { locale: NS } : {}),
      }, MsgSlotActions))
      // 0.4.0：composer 上方回撤 dock（0.1.x 无此槽自动 no-op）
      ctx.slots.inject(INPUT_DOCK_SLOT, () => ctx.slots.register({
        name: INPUT_DOCK_SLOT, id: INPUT_DOCK_ID, order: 10,
        ...(__locale ? { locale: NS } : {}),
      }, RevertDock))
      ctx.slots.inject(OVERLAY_SLOT, () => ctx.slots.register({
        name: OVERLAY_SLOT, id: DIALOG_ID, order: 101,
        ...(__locale ? { locale: NS } : {}),
      }, window.__MOPS_LEGACY_DIALOG === true ? OpsDialog : OpsPanel))
      installSidebarOps()
      installUserRevertInjector()
    }
```

</details>

**依据 5 · 源码核查**：[src/ops-core.js:377-417](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L377-L417)

恢复只重放用户/助手文本，跳工具事件。

<details>
<summary>查看原文（41行）</summary>

```text
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
  }
  // 0.5.6：区间无可重放消息（如只遮蔽了 tool/system 事件）不再 409 ——
  // dock 会为这类标记常驻显示恢复按钮，409 死按钮 = 永远清不掉（实测 8 连 409）。
  // 改为返回空计划：applyRestore 仍追加说明 notice（含 restoresSeq）→ 标记停用、
  // dock 计数递减；语义如实：0 条重放 + 文案说明区间无 user/assistant 内容。
  return { restoreSeq, startSeq, endSeq, upToSeq: Number.isSafeInteger(upToSeq) ? cap : endSeq, replayable, skipped };
}
```

</details>

**依据 6 · 源码核查**：[src/session-trash.js:275-306](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/session-trash.js#L275-L306)

整会话不同的目录/manifest流程。

<details>
<summary>查看原文（32行）</summary>

```text
export async function deleteSessionToTrash(ctx, sessionId, confirmTitle) {
  if (!isSessionId(sessionId)) throw new OpsError("invalid sessionId", 400);
  const dirs = findAllSessionDirs(sessionId);
  if (dirs.length === 0) throw new OpsError("session not found", 404);
  if (dirs.length > 1) throw new OpsError(`ambiguous session id: found ${dirs.length} directories`, 409);
  if (agentRunning(ctx, sessionId)) throw new OpsError("session is running; stop it first", 409);

  const meta = readMetadata(ctx, sessionId);
  const title = titleOfRow(meta.projRow) || headerTitle(dirs[0].dir);
  const expected = title || sessionId;
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

```

</details>

#### 缺口

- 目标用户的上下文控制收益与原生fork/复制对照不足
  **影响**：有明确用途但不能称净节时或业务状态恢复
  **进一步探讨**：用可丢弃长会话比较可见内容准确率、恢复回读与人工补偿时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · live/磁盘回撤与渐进恢复如何保持一致？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

写操作先校sessionId/seq并拒绝running会话；优先acquire live session，从live日志重建计划，避免仅落盘读到旧尾。回撤按surface节点规划replace范围，使用承载system说明的合成turn/step和source/provenance字段让宿主校验，不直接改写旧日志。兼容依赖这些宿主surface/日志/turn约定，不能只因Node能读文件就认为所有宿主支持。

恢复plan从原marker的replace范围取非空user/assistant文本，按upToSeq限制，并排除各notice已声明的restoredSourceSeqs。工具事件只计skipped不执行，因此恢复动作本身不重跑旧工具；但新模型看恢复文本后仍可能再次决定执行外部动作，用户需核现实状态。discard则只停用标记、不重放，不能说所有“恢复成功”都复制了原内容。

live applyRestore先append notice，里面一次写计划全部源seq，后逐条append重放消息；任意中途append失败，notice已在，restoreProgress直接合并它所列源seq，可能把未实际追加的消息判已恢复。外层catch补postamble只尽力闭合窗口，既不撤notice也不逐项修进度；flush失败在applyRestore内被吞下，返回事件已接受不等于持久化已证明。这条静态失败路径仍存在，本轮没有注入错误，不能称已发生丢消息或给发生率。

store-miss磁盘路径将preamble/notice/replay/postamble组成一个zstd帧追加，write后sync，写/同步报错尝试truncate回原大小，回退失败抛AggregateError。它比逐条live写有不同故障边界，但不能被称跨进程锁或断电完整事务，且两条路径都需重载核对。恢复不是业务补偿，进度也不能仅从一个“ok”判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:615-643](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L615-L643)

写前校验/live和surface计划。

<details>
<summary>查看原文（29行）</summary>

```text
async function opsCommit(targetCtx, mode, sessionId, seq) {
  if (!isSessionId(sessionId)) throw new OpsError("invalid sessionId", 400);
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
```

</details>

**依据 2 · 源码核查**：[src/index.js:717-762](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L717-L762)

live恢复计划、append与失败闭合。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/ops-core.js:377-417](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L377-L417)

原范围/排除/跳工具/空计划。

<details>
<summary>查看原文（41行）</summary>

```text
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
  }
  // 0.5.6：区间无可重放消息（如只遮蔽了 tool/system 事件）不再 409 ——
  // dock 会为这类标记常驻显示恢复按钮，409 死按钮 = 永远清不掉（实测 8 连 409）。
  // 改为返回空计划：applyRestore 仍追加说明 notice（含 restoresSeq）→ 标记停用、
  // dock 计数递减；语义如实：0 条重放 + 文案说明区间无 user/assistant 内容。
  return { restoreSeq, startSeq, endSeq, upToSeq: Number.isSafeInteger(upToSeq) ? cap : endSeq, replayable, skipped };
}
```

</details>

**依据 4 · 源码核查**：[src/ops-core.js:435-461](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L435-L461)

notice先写全部seq，随后逐条append，flush吞错。

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

**依据 5 · 源码核查**：[src/ops-core.js:475-514](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L475-L514)

进度直接信任notice声明集合。

<details>
<summary>查看原文（40行）</summary>

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
    pendingSeqs: pending,
    complete: legacy || discarded ? true : pending.length === 0,
    legacy,
    discarded,
  };
}

```

</details>

**依据 6 · 源码核查**：[src/index.js:764-799](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L764-L799)

磁盘批次。

<details>
<summary>查看原文（36行）</summary>

```text
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
  return {
    ok: true, disk: true, syntheticTurn: win.synthetic === true,
    restoredCount: plan.replayable.length,
    upToSeq: plan.upToSeq,
    restoredSourceSeqs: plan.replayable.map((i) => i.seq),
    skipped: plan.skipped,
    eventSeqs: batch.map((e) => e.seq),
    range: { startSeq: plan.startSeq, endSeq: plan.endSeq },
  };
```

</details>

**依据 7 · 源码核查**：[src/index.js:260-283](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L260-L283)

写帧/sync与truncate恢复。

<details>
<summary>查看原文（24行）</summary>

```text
async function diskAppend(logPath, newEvents) {
  if (!Array.isArray(newEvents) || newEvents.length === 0) throw new OpsError("diskAppend: empty batch", 400);
  const jsonl = newEvents.map((e) => JSON.stringify(e)).join("\n") + "\n";
  const frame = zstdCompressSync(Buffer.from(jsonl, "utf8"));
  const handle = await openFile(logPath, "a");
  let closed = false;
  const closeHandle = async () => { if (closed) return; closed = true; await handle.close(); };
  try {
    const { size: before } = await statFile(logPath);
    try {
      await handle.writeFile(frame);
      await handle.sync();
    } catch (error) {
      try {
        await closeHandle();
        await truncateFile(logPath, before);
      } catch (rollbackError) {
        throw new AggregateError([error, rollbackError], `failed to roll back append to "${logPath}"`);
      }
      throw error;
    }
  } finally {
    await closeHandle();
  }
```

</details>

#### 缺口

- live中断、flush失败和磁盘回退的重载一致性未故障注入
  **影响**：核心恢复可信度未排除，当前不推荐真实关键会话试用
  **进一步探讨**：用会话副本在第N条append/flush/write失败后重载，对比源seq进度、实际消息和原始文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回收站/认证/运行时有哪些边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

运行需Node>=23.5的内建zstd、可写会话目录和兼容宿主事件格式/会话服务，客户端是Web表面。GET也经过Host loopback/same-origin围栏和BrowserAuth gate；存在credentials但秘密记录不可读时fail-closed，老宿主无credentials则保留旧围栏。写入口再要求application/json。它是具体防误访问边界，不等于多租户授权体系，也不保证所有版本的secret/服务契约匹配。

消息HTTP body只含sessionId/seq等，强制确认主要是界面流程，不能泛称每条服务器写入都验证“用户已二次确认”；工具入口也直接调用同操作。整会话删除另外要求confirmTitle准确匹配并拒绝运行/歧义目录。试用者应看实际入口，而不是把README安全说明视为服务端统一确认令牌。

回收站删除先写moving manifest，移动目录、去投影/工作区等元数据，再写trashed。失败尝试移回并恢复元数据，无法完全恢复时留manifest供人工处理。恢复拒绝覆盖现存目标，移动并恢复元数据失败尝试退回，但不是所有副作用原子撤销。7天保留也不是永久备份。

更重要的是GET /session/trash会用purgeExpired:true列目录，到期直接递归删除；因此永久删除不只显式POST purge，打开回收站列表也可能触发到期清理。README“唯一destructive操作”应按这条真实路径收窄，用户不能等过期后才拿回收站当后悔药。停用插件不自动恢复已遮蔽文本/删除会话，也不清理外部工具影响。

可借鉴按原seq记录进度、live日志优先和合成窗口闭合，但这些维护依赖宿主provenance/turn格式。真正恢复验收应有重载和模型可见性对照；契约测试文件/作者历史描述不当本轮运行证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-48](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/package.json#L29-L48)

Node/Web依赖。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[src/index.js:47-74](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L47-L74)

HTTP通用认证和JSON写门。

<details>
<summary>查看原文（28行）</summary>

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
}

/** POST body 读取（信任围栏之后）：413/400 语义区分。 */
async function readFencedBody(req, res) {
```

</details>

**依据 3 · 源码核查**：[src/ops-core.js:821-854](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L821-L854)

有credentials失败关闭/旧服务降级。

<details>
<summary>查看原文（34行）</summary>

```text
 * 无 credentials 服务（老宿主）→ true = 旧围栏；有服务但记录不可读 → false（fail-closed）。
 * @param {object|undefined} ctx 插件 ctx（get("credentials")）
 * @param {object} req http 请求
 */
export async function webAuthGate(ctx, req) {
  if (__webAuthSecret !== null) {
    return browserAuthPayload(req, __webAuthSecret) !== undefined;
  }

  let credentials = null;
  try { credentials = ctx && typeof ctx.get === "function" ? ctx.get("credentials") : null; } catch { /* legacy ctx */ }
  if (!credentials || typeof credentials.modifyRecord !== "function") return true;

  const now = Date.now();
  if (__webAuthProbe === null && now - __webAuthProbeAt >= WEB_AUTH_RETRY_MS) {
    __webAuthProbeAt = now;
    __webAuthProbe = loadBrowserAuthSecret(credentials)
      .then((secret) => {
        __webAuthSecret = secret;
        if (secret === null && !__webAuthWarned) {
          __webAuthWarned = true;
          console.warn(
            "[message-ops] BrowserAuth cookie 鉴权已启用但 `client-connection/browser-session` 记录不可读"
            + "——GET 鉴权 fail-closed；请检查该记录是否存在",
          );
        }
        return secret;
      })
      .finally(() => { __webAuthProbe = null; });
  }

  if (__webAuthProbe === null) return false;
  const secret = await __webAuthProbe;
  return secret !== null && browserAuthPayload(req, secret) !== undefined;
```

</details>

**依据 4 · 源码核查**：[src/index.js:1005-1045](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L1005-L1045)

消息写入不带确认token。

<details>
<summary>查看原文（41行）</summary>

```text
    // --- POST revert / delete：live-session surface replace ------------------
    const commitHandler = (mode) => async (req, res) => {
      if (req.method !== "POST") return sendJson(res, 405, { ok: false, error: "method not allowed" });
      if (!(await writeFence(targetCtx, req, res))) return;
      const body = await readFencedBody(req, res);
      if (body === undefined) return;
      if (!body || typeof body !== "object") return sendJson(res, 400, { ok: false, error: "invalid json" });
      try {
        return sendJson(res, 200, await opsCommit(targetCtx, mode, body.sessionId, body.seq));
      } catch (err) {
        return sendJson(res, err instanceof OpsError ? err.status : 500, { ok: false, error: String(err && err.message ? err.message : err) });
      }
    };

    targetCtx.effect(() => host.register({
      kind: "exact", path: "/api/message-ops/revert", handler: commitHandler("revert"),
    }), "dsh-message-ops: revert route");

    targetCtx.effect(() => host.register({
      kind: "exact", path: "/api/message-ops/delete", handler: commitHandler("delete"),
    }), "dsh-message-ops: delete route");


    // --- POST restore：回滚恢复（重放语义，见 ops-core.js 注释） --------------
    targetCtx.effect(() => host.register({
      kind: "exact",
      path: "/api/message-ops/restore",
      handler: async (req, res) => {
        if (req.method !== "POST") return sendJson(res, 405, { ok: false, error: "method not allowed" });
        if (!(await writeFence(targetCtx, req, res))) return;
        const body = await readFencedBody(req, res);
        if (body === undefined) return;
        if (!body || typeof body !== "object") return sendJson(res, 400, { ok: false, error: "invalid json" });
        try {
          // 0.8.0：body.upToSeq 存在 → 按轮步进恢复（只到该 seq）
          return sendJson(res, 200, await opsRestore(targetCtx, body.sessionId, body.seq, body.upToSeq != null ? Number(body.upToSeq) : undefined, body.discard === true));
        } catch (err) {
          return sendJson(res, err instanceof OpsError ? err.status : 500, { ok: false, error: String(err && err.message ? err.message : err) });
        }
      },
    }), "dsh-message-ops: restore route");
```

</details>

**依据 5 · 源码核查**：[src/session-trash.js:275-343](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/session-trash.js#L275-L343)

标题/运行检查、moving/trashed与失败回退。

<details>
<summary>查看原文（69行）</summary>

```text
export async function deleteSessionToTrash(ctx, sessionId, confirmTitle) {
  if (!isSessionId(sessionId)) throw new OpsError("invalid sessionId", 400);
  const dirs = findAllSessionDirs(sessionId);
  if (dirs.length === 0) throw new OpsError("session not found", 404);
  if (dirs.length > 1) throw new OpsError(`ambiguous session id: found ${dirs.length} directories`, 409);
  if (agentRunning(ctx, sessionId)) throw new OpsError("session is running; stop it first", 409);

  const meta = readMetadata(ctx, sessionId);
  const title = titleOfRow(meta.projRow) || headerTitle(dirs[0].dir);
  const expected = title || sessionId;
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
    }
    if (dataBack && metadataBack) {
      try { fs.rmSync(root, { recursive: true, force: true }); } catch { /* best effort */ }
    }
    throw err;
  }

  return {
    ok: true,
    trashId,
    sessionId,
    title: title || null,
    expiresAt: manifest.expiresAt,
    workspaceIds: meta.workspaceIds,
    archived: meta.archived,
    pinned: meta.pinned,
  };
```

</details>

**依据 6 · 源码核查**：[src/session-trash.js:346-364](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/session-trash.js#L346-L364)

到期永久清理。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[src/index.js:1048-1059](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L1048-L1059)

GET列表传purgeExpired。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 8 · 源码核查**：[src/session-trash.js:398-430](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/session-trash.js#L398-L430)

恢复拒绝覆盖、回退及显式purge。

<details>
<summary>查看原文（33行）</summary>

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
}
```

</details>

#### 缺口

- 回收站多文件/元数据失败恢复和宿主认证差异未独立核对
  **影响**：不能将目录移动/标题确认当全周期可撤销保证
  **进一步探讨**：临时目录模拟移动后元数据失败、已有目标和到期列表，再检查目录/投影与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期成本、采用条件及可证伪方向？

**研究主题**：效果与总成本、采用判断、新假设与验证、工程质量与复用

#### 完整回答

当前保持观察，原因是消息恢复进度在关键中断窗口可能先于实际文本，不能用“有备份”降低任务验收要求。确有上下文控制需求者应先在可重载副本验证回撤、渐进恢复和失败重载，再决定限定使用；重要工具副作用另行核对，不能用此插件做业务撤销。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=23.5与宿主日志/surface契约 | 核心必需 | 压缩追加与provenance校验 | Node支持不代表格式兼容 |
| 停止的会话与可写目录 | 修改必需 | 按seq计划和追加 | running拒绝，写失败可能有部分状态 |
| Web服务/BrowserAuth | HTTP必需 | 列表与写入认证 | secret不可读关闭；旧宿主降级 |
| 可重载完整副本及现实状态记录 | 验证必需 | 故障恢复/业务补偿 | 回收站/消息遮蔽不是完整备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份会话并记已执行外部动作 | 能恢复原始日志/现实基线 |
| 小样 | 停止副本会话，选明确seq确认 | 原生模型可见范围符合预期 |
| 渐进恢复 | 对同一marker分段恢复后重载 | 实际文本与源seq进度一致 |
| 故障 | 测中断/flush/write失败 | 不把notice声明当全部完成 |
| 退出 | 停更多写入，核日志/现实状态 | 必要时恢复副本，过期回收站不能兜底 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 存储/备份资源未知 | 核Node/宿主/格式并保存副本 | 普通安装未验 |
| 持续使用 | 追加日志/索引扫描未知 | 停会话、选seq、核上下文/副作用 | 无合格恢复耗时对照 |
| 失败恢复 | 副本与重复追加资源未知 | 比较进度/文本/重载并人工补偿 | live notice非事务 |
| 升级退出 | 会话和回收站副本未知 | 核格式、元数据和保留期限 | 7天后列表可永久清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 上下文控制 | replace遮蔽与文本新append | 目标宿主重载/模型可见一致 |
| 渐进恢复 | 源seq集合排除 | 中断后声明与实际文本吻合 |
| 会话回收 | manifest+目录/元数据迁移 | 失败/过期后可恢复程度 |
| 业务撤销 | 此处跳过工具事件 | 不补偿已有外部副作用 |

用户遇到进度完成但正文缺失、重载失败、会话重复/元数据不符或模型要重做已完成工具动作时，应停止继续恢复/重试，保存现状并从副本对照；不要拿更多append掩盖状态未知。

未来方向应分两层且均未验证。第一层在每条恢复事件被接受/持久确认后提交对应源seq进度，避免先报全部完成；第二层在回撤前列已执行工具的副作用收据，明确哪些只隐藏、哪些需现实补偿。最小验证用带文件写入的副本，并在第N条append/flush后失败，对比当前方案、确认后进度及“仅副作用清单”的错误完成数、漏恢复、重复动作与人工时间。若无法降低分叉或增加的确认负担超过收益，否定该方向；不得把收据当自动业务回滚或已有功能。

#### 证据与依据

**依据 1 · 源码核查**：[src/ops-core.js:435-461](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L435-L461)

恢复进度和实际append断点。

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

**依据 2 · 源码核查**：[src/ops-core.js:475-514](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/ops-core.js#L475-L514)

按声明源seq计进度。

<details>
<summary>查看原文（40行）</summary>

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
    pendingSeqs: pending,
    complete: legacy || discarded ? true : pending.length === 0,
    legacy,
    discarded,
  };
}

```

</details>

**依据 3 · 源码核查**：[src/index.js:260-283](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/index.js#L260-L283)

磁盘失败恢复边界。

<details>
<summary>查看原文（24行）</summary>

```text
async function diskAppend(logPath, newEvents) {
  if (!Array.isArray(newEvents) || newEvents.length === 0) throw new OpsError("diskAppend: empty batch", 400);
  const jsonl = newEvents.map((e) => JSON.stringify(e)).join("\n") + "\n";
  const frame = zstdCompressSync(Buffer.from(jsonl, "utf8"));
  const handle = await openFile(logPath, "a");
  let closed = false;
  const closeHandle = async () => { if (closed) return; closed = true; await handle.close(); };
  try {
    const { size: before } = await statFile(logPath);
    try {
      await handle.writeFile(frame);
      await handle.sync();
    } catch (error) {
      try {
        await closeHandle();
        await truncateFile(logPath, before);
      } catch (rollbackError) {
        throw new AggregateError([error, rollbackError], `failed to roll back append to "${logPath}"`);
      }
      throw error;
    }
  } finally {
    await closeHandle();
  }
```

</details>

**依据 4 · 源码核查**：[src/session-trash.js:346-364](https://github.com/240xu/dsh-message-ops/blob/75d798ef0f015da242a721d3278430640b29b393/src/session-trash.js#L346-L364)

保留期与永久清理。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

#### 缺口

- 确认后进度/副作用收据方案均未实现，效果对照不足
  **影响**：保持观察，不将可设计的恢复方案当当前可用
  **进一步探讨**：以副本故障矩阵与外部文件状态对照，先证明分叉和恢复负担下降。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
