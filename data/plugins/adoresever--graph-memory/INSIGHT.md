# Graph Memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[5841b19](https://github.com/adoresever/graph-memory/tree/5841b1987c3967998818764c9d4238add5f3aa7c)

<!-- BEGIN META -->
[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/adoresever/graph-memory) [![npm 30d 346](https://img.shields.io/static/v1?label=npm+30d&message=346&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory) [![最新发布 2026-04-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory)
<!-- END META -->

> **功能**：为 DSH 和 OpenClaw 压缩历史上下文，以图与向量导航召回原始问答并持久保存记忆。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将模型可见历史约束、后台抽取与源问答召回结合，保留原事件日志；这改变上下文组织，不等于原答案正确。

> **主要限制**：[Q03](#research-q03) 原问答可能缺少关键工具回执，跨项目回忆亦需独立隔离判断；首请求减少不能代替全部模型与抽取消耗的总账。

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
  - [Q01 · 上下文接管相对普通摘要增加什么？](#detail-section-11)
  - [Q02 · 归档、抽取、召回如何接到真实会话？](#detail-section-12)
  - [Q03 · 模型、存储、跨会话与成本边界在哪里？](#detail-section-13)
  - [Q04 · 谁值得试用，如何反证节省与不丢证据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话用户需要在有限模型上下文内继续使用旧任务知识，合格结果包含正确任务与可追回来源。

完整原生历史、普通摘要和手工查日志；图与摘要导航不作为独立事实证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 历史接管 | 约束后续模型可见轨迹 | 原日志保留，细节可见性变化 |
| 源问答召回 | 追回历史上下文 | 原答案仍需核真伪 |
| 抽取隔离与重试 | 处理非法结构输出 | 语义错误不由schema自动判断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node22.13+与兼容DSH | 必需 | 表面投影与宿主接线 | 接管可能失败后放行 |
| SQLite与抽取模型 | 记忆写入必需 | 持久化与生成导航 | 待处理或隔离错误 |
| embedding服务 | 可选 | 语义召回 | 全文检索回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定版本并备份库 | 正确graph-memory/dsh接入 |
| 完成一轮 | 插件捕获问答并后台抽取 | 状态无未解释隔离错误 |
| 继续任务 | 首步召回原始问答 | 来源与当前项目相符 |
| 验收退出 | 用户核正确性和全部费用 | 无收益恢复原历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | SQLite存储及模型路由 | 固定版本与备份配置 | 耗时未知 |
| 持续使用 | 主模型、抽取、embedding和召回正文 | 核对错误记忆 | 单位合格任务成本未知 |
| 失败恢复 | 重复抽取和数据库资源 | 检查隔离记录及来源 | 恢复和跨项目边界未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文约束 | 替换已完成轨迹，原日志保留 | 合格任务总节省 |
| 可追溯回忆 | 返回原始问答 | 原答案真伪和工具证据充分性 |

> **思考**：[Q03](#research-q03) 原问答可能缺少关键工具回执，跨项目回忆亦需独立隔离判断；首请求减少不能代替全部模型与抽取消耗的总账。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将模型可见历史约束、后台抽取与源问答召回结合，保留原事件日志；这改变上下文组织，不等于原答案正确。

[Q02](#research-q02) 将图导航与源证据分离、后台抽取不阻前台和严格结构契约值得借鉴；移植要匹配会话表面与原事件语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 原问答可能缺少关键工具回执，跨项目回忆亦需独立隔离判断；首请求减少不能代替全部模型与抽取消耗的总账。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 个人非敏感任务用副本库对照；审计或多租户任务先保留原历史并验证隔离。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

接管、抽取与召回接线有源码支持，作者数据非本轮独立验证；跨项目边界和总任务收益未知。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh.ts、src/format/dsh-turn-projection.ts、src/format/assemble.ts、src/extractor/extract.ts、src/recaller/recall.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH入口、轨迹替换、源问答装配与抽取契约，未运行官方benchmark、宿主或数据库迁移。
- 下一步：固定任务比较原历史、普通摘要和源问答召回，核对全部token、错误纠正、跨项目边界与恢复；未执行。

**分析版本**

- **仓库**：[adoresever/graph-memory](https://github.com/adoresever/graph-memory)
- **版本号**：1.6.0-beta.17（[固定提交 5841b19](https://github.com/adoresever/graph-memory/tree/5841b1987c3967998818764c9d4238add5f3aa7c)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按可复核任务保留关键工具回执，未验证；若无法提升纠错质量或抵消新增上下文则否定。

固定任务比较原历史、普通摘要和源问答召回，核对全部token、错误纠正、跨项目边界与恢复；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1618 | — | — | 17196 |
| .mjs | source | 4 | 282 | 258 | 0 | — |
| .js | source | 2 | 299 | 277 | 0 | — |
| .ts | source | 28 | 6659 | 5328 | 766 | — |
| .ts | test | 24 | 4205 | 3612 | 175 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/adoresever/graph-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/adoresever/graph-memory/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/adoresever/graph-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：压缩历史与源问答召回能否保持证据并降低合格任务总成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 上下文接管相对普通摘要增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Graph Memory 面向长编码或研究会话：保留近期问答，归档旧的推理和工具轨迹，再按当前问题召回。相对仅保留摘要，摘要与图作为导航，召回带回原始问题及最终回答，减少把抽取结论当证据的风险。但最终回答本身仍可能错误，原问答不等同原始工具证据。README 报告首请求上下文大幅减少，而全部测量 token 仅少6.43%，并注明基线提交与主请求数量不同；这些是作者数据，不是本轮独立A/B，也不能外推用户账单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-42](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/README.md#L30-L42)

导航层和原问答边界。

<details>
<summary>查看原文（13行）</summary>

```text
Graph Memory owns the **model-visible historical surface** without deleting DSH's event log. By default it keeps the newest five completed user turns, removes completed reasoning/tool traces from future requests, and recalls relevant older or cross-session source Q/A automatically.

## The 1.6 turn-memory navigation upgrade

| Before | Now |
|---|---|
| Extract TASK / SKILL / EVENT directly from messages | Create one self-contained turn summary, then derive SPO from that same sentence |
| Graph nodes could become the factual payload | Summary, SPO, and communities only navigate; original question and final answer remain the evidence |
| Old memories from the active session could be filtered wholesale | Exclude only sources still visible in the fresh window; archived same-session and cross-session recall share one path |
| Community expansion could pull a whole neighborhood | Local LPA narrows candidates, query-time PPR ranks them, and only matched Q/A is recovered |
| DSH retained complete tool and reasoning traces | Completed turns retain question + final answer; older prefixes collapse to one fixed marker |

Writing one completed turn costs exactly **one auxiliary LLM call**. Community detection and PPR are local. There are no hard-coded node/edge counts, semantic direction gates, or JSON repair that turns invalid output into accepted data. [Read the complete design, source map, and porting sequence →](docs/TURN_MEMORY_NAVIGATION_UPGRADE_CN.md)
```

</details>

**依据 2 · 作者声明**：[README.md:50-59](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/README.md#L50-L59)

作者结果及非严格A/B限制。

<details>
<summary>查看原文（10行）</summary>

```text
| Real 20-turn GLM-5.2 run | Historical native DSH baseline | Latest Graph Memory | Change |
|---|---:|---:|---:|
| T20 first request | 56,998 tokens | **11,008 tokens** | **−80.69%** |
| T20 model-visible messages | 171 | **21** | **−87.72%** |
| T01–T20 first-request context | 532,451 tokens | **165,896 tokens** | **−68.84%** |
| All measured tokens¹ | 2,487,776 | **2,327,728** | **−6.43%** |

<sub>¹ The latest candidate includes 166 main-agent requests, 20 turn extractions, and 41 embedding requests; the historical baseline made 77 main requests. DSH commits and nondeterministic tool loops differ, so this is not a simultaneous strict A/B. First-request context is the direct takeover metric; the full bill remains visible.</sub>

**20/20** scenario turns passed · **20/20** structured extractions succeeded · **0** quarantined · **20** turn summaries · **92** SPO triples · **30** communities · **20** summary vectors. T11, T19, and T20 automatically recalled out-of-window memory with exact source question and final answer.
```

</details>

**依据 3 · 源码核查**：[src/format/assemble.ts:77-107](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/format/assemble.ts#L77-L107)

召回原始问答绑定而非只输出图摘要。

<details>
<summary>查看原文（31行）</summary>

```text
  // Exact source Q/A is an atomic memory bundle. The plugin neither estimates
  // provider tokens nor slices evidence by character count.
  const episodicParts: string[] = [];
  const emittedEvidence = new Set<string>();

  const appendEvidence = (
    label: string,
    messages: Array<{ sessionId: string; turnIndex: number; role: string; text: string }>,
  ) => {
    const uniqueMessages = messages.filter(message => {
      const key = `${message.sessionId}\u0000${message.turnIndex}\u0000${message.role}\u0000${message.text}`;
      if (emittedEvidence.has(key)) return false;
      emittedEvidence.add(key);
      return true;
    });
    if (!uniqueMessages.length) return;
    const lines = uniqueMessages.map(message =>
      `    [${message.role.toUpperCase()}] ${escapeXml(message.text)}`
    ).join("\n");
    episodicParts.push(`  <trace source="${escapeXml(label)}">\n${lines}\n  </trace>`);
  };

  // The compact memory is the retrieval decision. Its exact Q/A evidence is
  // loaded only after that summary has passed the recall confidence policy.
  for (const memory of memories) {
    appendEvidence(
      `turn-memory:${memory.id}`,
      getTurnMemorySourceMessages(db, memory.id, params.excludedSourceMessageIds),
    );
  }

```

</details>

#### 缺口

- 原工具证据被归档后对复杂任务的影响未知
  **影响**：原问答可能不足以复核事实
  **进一步探讨**：加入需原始命令输出和纠错来源的任务比较

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 归档、抽取、召回如何接到真实会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH session/event 的 turn/end 先捕获已完成问答，再异步安排抽取和维护，随后投影已完成工具轨迹。trace替换向会话追加 compaction/prune，并以 surfaceOp.replace 替换模型可见段，原事件日志保留。pre-step 在首步基于用户查询召回，过滤当前仍可见的记忆，再以snapshot插入当前用户之前；召回失败返回原decision，不阻断前台。Extractor严格解析JSON并验证契约，不修补语义；因此减少坏结构入库，但不能判断命题真伪。

#### 证据与依据

**依据 1 · 源码核查**：[dsh.ts:799-820](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/dsh.ts#L799-L820)

真实完成事件接线和后台调度。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.on("session/event", (session: any, event: any) => {
    const id = session?.id;
    if (id === undefined) return;
    // This event is the deterministic cross-scope bridge in composed DSH
    // profiles. The first user append occurs after that turn's pre-step, then
    // the public Agents registry lets later pre-steps use the attached hook.
    if (event?.type === "user/message" && event.data?.source?.kind === "user") {
      attachRollingCompaction(ctx.agents?.get(id));
    }
    const route = routeFromEvent(event);
    if (route) latestRoute.set(String(id), route);
    if (event?.type === "turn/end") {
      const turn = Number(event.data?.turn);
      if (Number.isInteger(turn) && turn > 0) {
        captureCompletedTurn(session, turn, Number(event.seq));
      }
      // The committed turn is durable before the single per-session worker is
      // scheduled. No model call runs in turn-stopping or blocks the response.
      void scheduleExtract(id, turn);
      maintain(id);
      if (Number.isInteger(turn) && turn > 0) projectCompletedTurn(session, turn, Number(event.seq));
    }
```

</details>

**依据 2 · 源码核查**：[src/format/dsh-turn-projection.ts:208-244](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/format/dsh-turn-projection.ts#L208-L244)

模型可见替换不等同删除日志。

<details>
<summary>查看原文（37行）</summary>

```text
/** Replace a completed tool trace with a constant-size, model-free marker. */
export function replaceDshCompletedTurnTrace(
  session: DshTurnSession,
  tokenMeter: DshTokenMeter,
  range: DshCompletedTurnTraceRange,
): DshCompletedTurnProjection {
  if (typeof session.append !== "function") throw new Error("DSH session.append is unavailable");
  const measured = tokenMeter?.measure?.(session);
  if (!measured || !Array.isArray(measured.nodes)) throw new Error("DSH tokenMeter is unavailable");
  const prices = new Map(measured.nodes.map(node => [node.seq, node.heuristicTokens]));
  let shadowedTokenCount = 0;
  for (const seq of range.shadowedSeqs) {
    const price = prices.get(seq);
    if (!Number.isFinite(price)) throw new Error(`DSH tokenMeter did not price surface seq ${seq}`);
    shadowedTokenCount += Number(price);
  }

  const prune = session.append("compaction/prune", {
    shadowedRange: { start: range.start, end: range.end },
    shadowedSeqs: [...range.shadowedSeqs],
    shadowedTokenCount,
  });
  const replacement = session.append("user/message", {
    id: `graph-memory-turn-trace:${String(session.id ?? "session")}:${range.turn}`,
    role: "user",
    source: dshMemorySource(),
    content: [{
      type: "text",
      text: `<graph-memory-trace turn="${range.turn}">Intermediate tool trace archived; the original question and final answer remain visible.</graph-memory-trace>`,
    }],
  }, {
    // DSH's public surface protocol names replacement bounds startSeq/endSeq.
    // Using start/end writes the adjacent prune audit event but causes the
    // actual surface append to be rejected, leaving the old trace visible.
    surfaceOp: { op: "replace", startSeq: range.start, endSeq: range.end },
    sourceEventSeqs: [prune.seq, ...range.shadowedSeqs],
  });
```

</details>

**依据 3 · 源码核查**：[dsh.ts:690-731](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/dsh.ts#L690-L731)

首步查询与可见源过滤。

<details>
<summary>查看原文（42行）</summary>

```text
    if (!recallEnabled || closing || signal?.aborted || step !== 1 || decision?.kind === "reject") {
      return decision;
    }
    if (id === undefined) return decision;
    const directUsers = (Array.isArray(messages) ? messages : [])
      .filter(message => message?.source?.kind === "user");
    const query = directUsers.map(messageText).filter(Boolean).join("\n").trim();
    if (!query) return decision;
    try {
      // A new DSH session may issue its first prompt while the embedding probe
      // is still in flight. Historical recall must wait for that shared probe;
      // otherwise the very first cross-session question can miss all vectors.
      await embeddingReady;
      const recalled = await recaller.recall(query);
      signal?.throwIfAborted?.();
      const key = String(id);
      const currentSession = sessionKey(id);
      const session = agent?.session;
      const surfaceSeqs = Array.isArray(session?.surface?.nodes) ? session.surface.nodes as number[] : [];
      const immutableEvents = typeof session?.snapshotEvents === "function"
        ? session.snapshotEvents()
        : session?.events;
      const visibleMessageIds = new Set(surfaceSeqs.map(seq => `${HOST}:${key}:${String(seq)}`));
      const hasArchivedHistory = surfaceSeqs.some(seq => {
        const event = immutableEvents?.[seq];
        return event?.type === "user/message"
          && isDshMemorySource(event?.data?.source)
          && event?.surfaceOp?.op === "replace";
      });
      const recalledNodes = filterDshRecallNodes(
        recalled.nodes,
        getNodeSources(db, recalled.nodes.map(node => node.id)),
        currentSession,
        visibleMessageIds,
        hasArchivedHistory,
      );
      const recalledMemories = filterDshRecallMemories(
        recalled.turnMemories,
        currentSession,
        visibleMessageIds,
      );
      if (!recalledNodes.length && !recalledMemories.length) return decision;
```

</details>

**依据 4 · 源码核查**：[dsh.ts:748-770](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/dsh.ts#L748-L770)

历史快照插入位置和失败放行。

<details>
<summary>查看原文（23行）</summary>

```text
      if (!text) return decision;
      const recalledMessage = {
        id: randomUUID(),
        role: "user",
        source: {
          ...dshMemorySource(),
          form: "snapshot",
          sections: [{ name: "graph-memory:recall", text }],
        },
        content: [{ type: "text", text }],
      };
      // Historical memory is context for the live request, never a newer
      // instruction. Keep the direct user's message after the recall snapshot.
      // The snapshot remains bounded by the same rolling window as its user
      // turn; it is not part of the post-question tool-trace projection.
      const entered = insertDshRecallBeforeCurrentUser(
        Array.isArray(decision.messages) ? decision.messages : [],
        recalledMessage,
      );
      return { kind: "enter", messages: entered };
    } catch (error) {
      ctx.logger.warn(`[graph-memory] DSH recall failed open: ${String(error)}`);
      return decision;
```

</details>

**依据 5 · 源码核查**：[src/extractor/extract.ts:90-118](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/extractor/extract.ts#L90-L118)

JSON与领域契约门，非语义真伪判断。

<details>
<summary>查看原文（29行）</summary>

```text
    const raw = await this.llm(
      EXTRACT_SYS,
      EXTRACT_USER(msgs, params.priorTurns ?? []),
    );

    return this.parseExtract(raw);
  }

  private parseExtract(raw: string): ExtractionResult {
    try {
      // Graph extraction is a data contract, not an invitation for the host
      // to guess missing fields, normalize names, or repair a model claim.
      // Every host must emit exactly one JSON object matching the schema.
      const p = JSON.parse(raw.trim());
      if (!p || typeof p !== "object" || Array.isArray(p)) {
        throw new TypeError("extraction root must be a JSON object");
      }
      assertGraphExtractionContract(p);
      // The provider schema is the only extraction gate. A plugin must not
      // infer, rewrite, or reject the model's graph semantics from node types,
      // wording, lifecycle claims, or relation direction.
      return {
        turn: { summary: p.summary, outcome: p.outcome },
        triples: p.triples.map(triple => ({ ...triple })),
      };
    } catch (err) {
      // Extraction output can contain private conversation facts. Report the
      // contract failure without copying model output into host logs.
      throw new Error(`[graph-memory] extraction parse failed: ${err}`);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型、存储、跨会话与成本边界在哪里？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

启动需要Node22.13+、兼容DSH会话API和SQLite存储，抽取还需要有效模型路由，向量召回可配置外部embedding，无向量时有全文检索退路。README 强调固定Git发布版本，npm旧版不能用于验证当前DSH。持久记忆跨会话和项目并非隔离保证，团队多租户场景不能把共享数据库当权限系统。抽取JSON合法不保证摘要与关系正确，需检查来源、冲突与删除；模型最终答案不能替代被归档的工具事实。首次配置、每轮抽取、embedding、召回额外正文和失败重试均计入总账，不能只用首请求缩短量宣称等额节省。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-33](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/package.json#L24-L33)

Node与DSH导出。

<details>
<summary>查看原文（10行）</summary>

```text
  "engines": {
    "node": ">=22.13.0"
  },
  "main": "dist/index.js",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./dsh": "./dist/dsh.js",
    "./pro": "./dist/pro/index.js",
    "./pro/dsh": "./dist/pro/dsh.js",
```

</details>

**依据 2 · 作者声明**：[README.md:74-102](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/README.md#L74-L102)

固定版本、SQLite与embedding条件。

<details>
<summary>查看原文（29行）</summary>

````text
`1.6.0-beta.17` fixes producer attribution on DSH 0.1.7+ / Session V4 (#113), extraction on models that cannot use `off` (#117), and configurable SQLite lock waiting. Context-window and recall policies remain unchanged. [Fix details and recovery instructions (Chinese) →](docs/DSH_COMPATIBILITY_20260930_CN.md)

Node.js `22.13+` · no DSH fork · until npm `1.6` is published, install the pinned GitHub release:

```bash
npx @deepseek-ai/dsh plugin --profile web add github:adoresever/graph-memory#v1.6.0-beta.17
npx @deepseek-ai/dsh --profile web --dump-config
npx @deepseek-ai/dsh web
```

The npm registry still serves the old `1.5.8`; do not use it to validate DSH. Switch to `npx @deepseek-ai/dsh plugin --profile web add graph-memory` only after `npm view graph-memory version` reports `1.6.0-beta.17` or newer.

Confirm that `graph-memory/dsh` is active under **Settings → Plugins**. The default database is `$DSH_HOME/graph-memory/graph-memory.db`, normally `~/.dsh/graph-memory/graph-memory.db`.

## What ships

| Capability | Implementation |
|---|---|
| Context takeover | Configurable newest-N completed turns; one archive marker replaces the older model surface |
| Lightweight extraction | Only the user question and final answer; strict structured tool contract; no reasoning/tool transcript ingestion |
| Query-first recall | Vector Top-K with FTS5 fallback; exact source Q/A travels with graph hits |
| Durable memory | Local SQLite, stable provenance, cross-session and cross-project recall |
| Failure behavior | Invalid extraction is quarantined; foreground conversation continues; bad data is not repaired or persisted |
| Host support | Native DSH/Cordis adapter; maintained OpenClaw Context Engine adapter |

<details>
<summary><strong>Optional embeddings</strong></summary>

Graph Memory supports OpenAI-compatible embedding endpoints. Without embeddings it falls back to FTS5 and does not block conversation.
````

</details>

**依据 3 · 作者声明**：[README.md:119-128](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/README.md#L119-L128)

状态、重试与路由失败边界。

<details>
<summary>查看原文（10行）</summary>

```text
| `gm_status` | Store, extraction, recall, vector, and retention state |
| `gm_search` | Explicit graph-memory search |
| `gm_record` | Deterministically persist a `TASK`, `SKILL`, or `EVENT` |
| `gm_stats` | Graph and retention receipts |
| `gm_maintain` | One bounded maintenance tick |
| `gm_retry_extraction` | Explicitly retry pending or quarantined extraction |

Automatic recall needs no tool call. Extraction may use a dedicated model via `GRAPH_MEMORY_LLM_PROVIDER` and `GRAPH_MEMORY_LLM_MODEL`; optional reasoning and output controls are `GRAPH_MEMORY_LLM_REASONING_EFFORT` and `GRAPH_MEMORY_LLM_MAX_TOKENS`.

Without an explicit effort, extraction reads the exact model capability: prefer `off`, otherwise the host's first advertised effort, or omit the field on non-reasoning models. Route/provider failures keep source Q/A pending and report the cause in logs and `gm_status`. To recover old quarantined records, enable `assistantTools: all` and invoke `gm_retry_extraction`. Configure SQLite lock waiting with `GRAPH_MEMORY_DB_BUSY_TIMEOUT_MS` (default: 5000 milliseconds).
```

</details>

**依据 4 · 源码核查**：[src/recaller/recall.ts:163-193](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/recaller/recall.ts#L163-L193)

向量与FTS候选回退。

<details>
<summary>查看原文（31行）</summary>

```text
  /**
   * Preserve semantic rank. FTS5 contributes exact terms and is the complete
   * fallback when the embedding provider is absent or temporarily fails.
   */
  private async recallPrecise(
    query: string,
    limit: number,
    queryVector?: number[],
    legacyOnly = false,
  ): Promise<RecallResult> {
    const lexical = searchNodes(this.db, query, limit, legacyOnly);
    const threshold = this.cfg.semanticScoreThreshold;
    const semantic = queryVector && threshold !== undefined
      ? vectorSearchWithScore(
          this.db,
          queryVector,
          limit,
          threshold,
          legacyOnly,
        )
      : [];
    const selected: GmNode[] = [];
    const selectedIds = new Set<string>();
    const append = (node: GmNode) => {
      if (selected.length >= limit || selectedIds.has(node.id)) return;
      selected.push(node);
      selectedIds.add(node.id);
    };
    for (const { node } of semantic) append(node);
    for (const node of lexical) append(node);
    if (!selected.length) return { nodes: [], edges: [], turnMemories: [], triples: [] };
```

</details>

**依据 5 · 源码核查**：[src/extractor/extract.ts:103-113](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/extractor/extract.ts#L103-L113)

语义由模型产生，契约不能保证正确。

<details>
<summary>查看原文（11行）</summary>

```text
      const p = JSON.parse(raw.trim());
      if (!p || typeof p !== "object" || Array.isArray(p)) {
        throw new TypeError("extraction root must be a JSON object");
      }
      assertGraphExtractionContract(p);
      // The provider schema is the only extraction gate. A plugin must not
      // infer, rewrite, or reject the model's graph semantics from node types,
      // wording, lifecycle claims, or relation direction.
      return {
        turn: { summary: p.summary, outcome: p.outcome },
        triples: p.triples.map(triple => ({ ...triple })),
```

</details>

#### 缺口

- 跨项目敏感内容召回边界未完整验证
  **影响**：不适用于未经隔离验证的多租户共享数据库
  **进一步探讨**：用不同项目相同词和权限差异样本核对召回及清理
- 合格任务总费用与恢复成本未知
  **影响**：无法承诺账单下降
  **进一步探讨**：计入全部主调用、抽取、embedding与失败恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，如何反证节省与不丢证据？

**研究主题**：新假设与验证、采用判断

#### 完整回答

个人长会话用户可先在副本数据库与非敏感任务中试用，短对话或必须保留完整工具证据的审计任务先不接管。未验证方向是按任务可复核性选择保留原问答还是附带少量关键工具回执，避免为了压缩而丢掉纠错所需来源；这增加存储与注入，是否值得要对照。固定宿主、模型、任务及数据库，比较原生历史、普通摘要与本插件，验收最终任务正确性、旧证据可找回、跨项目边界和全部token。若召回错项目、缺关键回执或总开销升而质量未升，停用接管并回原会话历史与数据库备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/format/dsh-turn-projection.ts:225-243](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/format/dsh-turn-projection.ts#L225-L243)

轨迹替换决定保留证据粒度。

<details>
<summary>查看原文（19行）</summary>

```text
  const prune = session.append("compaction/prune", {
    shadowedRange: { start: range.start, end: range.end },
    shadowedSeqs: [...range.shadowedSeqs],
    shadowedTokenCount,
  });
  const replacement = session.append("user/message", {
    id: `graph-memory-turn-trace:${String(session.id ?? "session")}:${range.turn}`,
    role: "user",
    source: dshMemorySource(),
    content: [{
      type: "text",
      text: `<graph-memory-trace turn="${range.turn}">Intermediate tool trace archived; the original question and final answer remain visible.</graph-memory-trace>`,
    }],
  }, {
    // DSH's public surface protocol names replacement bounds startSeq/endSeq.
    // Using start/end writes the adjacent prune audit event but causes the
    // actual surface append to be rejected, leaving the old trace visible.
    surfaceOp: { op: "replace", startSeq: range.start, endSeq: range.end },
    sourceEventSeqs: [prune.seq, ...range.shadowedSeqs],
```

</details>

**依据 2 · 源码核查**：[src/format/assemble.ts:77-107](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/src/format/assemble.ts#L77-L107)

原问答是现有召回证据单位。

<details>
<summary>查看原文（31行）</summary>

```text
  // Exact source Q/A is an atomic memory bundle. The plugin neither estimates
  // provider tokens nor slices evidence by character count.
  const episodicParts: string[] = [];
  const emittedEvidence = new Set<string>();

  const appendEvidence = (
    label: string,
    messages: Array<{ sessionId: string; turnIndex: number; role: string; text: string }>,
  ) => {
    const uniqueMessages = messages.filter(message => {
      const key = `${message.sessionId}\u0000${message.turnIndex}\u0000${message.role}\u0000${message.text}`;
      if (emittedEvidence.has(key)) return false;
      emittedEvidence.add(key);
      return true;
    });
    if (!uniqueMessages.length) return;
    const lines = uniqueMessages.map(message =>
      `    [${message.role.toUpperCase()}] ${escapeXml(message.text)}`
    ).join("\n");
    episodicParts.push(`  <trace source="${escapeXml(label)}">\n${lines}\n  </trace>`);
  };

  // The compact memory is the retrieval decision. Its exact Q/A evidence is
  // loaded only after that summary has passed the recall confidence policy.
  for (const memory of memories) {
    appendEvidence(
      `turn-memory:${memory.id}`,
      getTurnMemorySourceMessages(db, memory.id, params.excludedSourceMessageIds),
    );
  }

```

</details>

**依据 3 · 作者声明**：[README.md:50-57](https://github.com/adoresever/graph-memory/blob/5841b1987c3967998818764c9d4238add5f3aa7c/README.md#L50-L57)

总费用和首请求指标不同。

```text
| Real 20-turn GLM-5.2 run | Historical native DSH baseline | Latest Graph Memory | Change |
|---|---:|---:|---:|
| T20 first request | 56,998 tokens | **11,008 tokens** | **−80.69%** |
| T20 model-visible messages | 171 | **21** | **−87.72%** |
| T01–T20 first-request context | 532,451 tokens | **165,896 tokens** | **−68.84%** |
| All measured tokens¹ | 2,487,776 | **2,327,728** | **−6.43%** |

<sub>¹ The latest candidate includes 166 main-agent requests, 20 turn extractions, and 41 embedding requests; the historical baseline made 77 main requests. DSH commits and nondeterministic tool loops differ, so this is not a simultaneous strict A/B. First-request context is the direct takeover metric; the full bill remains visible.</sub>
```

#### 缺口

- 选择性工具回执的净价值未知
  **影响**：仍是未实现设计假设
  **进一步探讨**：对证据纠错任务比较质量、恢复和总费用

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
