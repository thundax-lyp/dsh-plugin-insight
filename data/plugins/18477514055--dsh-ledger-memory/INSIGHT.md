# dsh-ledger-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[c3fda36](https://github.com/18477514055/dsh-ledger-memory/tree/c3fda3608c9e8585523df7d2db53d65dc69c6eea)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 3,126](https://img.shields.io/static/v1?label=npm+30d&message=3%2C126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)
<!-- END META -->

> **实现功能**：管理项目台账、决策目标经验卡、活动日志、压缩原文指针与跨会话交接。

> **核心亮点**：在普通项目笔记之上接入检测、注入、归档、卡片索引和压缩原文回读，减少记得手动查笔记的依赖；语义正确仍需复核。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：原则grant按会话而非精确内容/root，超预算单事件无法靠seq拆分；主写与审计非事务，临时创建失败清理未判断所有权；V3禁自动stage而V2仍默认允许。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 项目台账、卡片和压缩回读相对普通记忆文件增加什么？](#detail-section-11)
  - [Q02 · 项目root、分块注入、指针与seq读取如何串联？](#detail-section-12)
  - [Q03 · 授权是否绑定内容/root，超大事件和自动暂存怎样处理？](#detail-section-13)
  - [Q04 · 多资产写入、锁、失败审计和恢复有哪些边界？](#detail-section-14)
  - [Q05 · 按合格跨会话接续衡量效果成本与工程价值如何？](#detail-section-15)
  - [Q06 · 内容绑定授权与事务性记忆收据能否降低错写，如何采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给跨会话持续推进项目的人维护状态记忆，合格结果要核对真实目标与工作区。

简单AGENTS/项目笔记与人工交接清单为替代；比较的是生命周期机制，不宣称实际收益优胜。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 台账与卡片 | 项目状态/决策/目标经验 | 模型维护语义，清单定位 |
| 压缩胶囊/seq回读 | 找回被压缩文本 | 非原始全事件备份，单事件字符上限 |
| 原则授权 | 用户确认后一次写入 | 当前按sid窗口，不绑定精确正文 |
| 归档/日志/Git配合 | 维护历史与暂存回执 | 多资产非事务，V3禁自动stage |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19及DSH工具/事件 | 必需 | 注册、注入与生命周期 | 对应功能不可用 |
| 正确root/清单/可写目录 | 记忆必需 | 项目隔离与持久化 | 错误或误归属风险需核对 |
| session.eventAt/压缩服务 | 对应功能必需 | 原文回读及压缩 | 拒绝/降级，不能保证原文 |
| Git仓库及明确策略 | 可选 | 暂存 | V3禁自动stage，V2可默认启用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 确认root及记忆布局并备份 | 清单路径和隐私策略明确 |
| 使用 | 模型读写状态/卡片，用户授权原则修改 | 内容与回执逐项核对 |
| 接续 | 压缩/换会话后回读台账和原文 | 目标、副作用和缺口一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地记忆/备份，金额未知 | root、清单、隐私与stage策略 | V2/V3行为不同 |
| 持续 | 注入/压缩模型token及存储 | 整理卡片、核对回执 | 总token与接续收益未知 |
| 失败恢复 | 原文/归档/日志副本 | 对齐主写、清单和审计 | 非跨资产事务，超大事件边界 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 记忆接续 | pre-step状态注入与卡片 | 跨会话目标恢复正确率 |
| 原文回读 | seq读取与胶囊指针 | 超大事件完整性 |
| 写入可追责 | 原子单文件和审计回执 | 多资产事务与完整日志 |

> **思考**：原则grant按会话而非精确内容/root，超预算单事件无法靠seq拆分；主写与审计非事务，临时创建失败清理未判断所有权；V3禁自动stage而V2仍默认允许。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在普通项目笔记之上接入检测、注入、归档、卡片索引和压缩原文回读，减少记得手动查笔记的依赖；语义正确仍需复核。[Q01](#research-q01)、[Q02](#research-q02)

在普通项目笔记之上接入检测、注入、归档、卡片索引和压缩原文回读，减少记得手动查笔记的依赖；语义正确仍需复核。[Q01](#research-q01)、[Q02](#research-q02)

卡片权威与可重建索引、中央stage策略、真实路径回执可借鉴；主写审计分离和临时文件清理所有权是恢复边界，不能用原子rename概括全部可靠性。[Q04](#research-q04)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

原则grant按会话而非精确内容/root，超预算单事件无法靠seq拆分；主写与审计非事务，临时创建失败清理未判断所有权；V3禁自动stage而V2仍默认允许。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可备份的V3非关键项目核对写入、授权、stage和压缩回读；定期人工比较记忆与实际工作区，出现审计或文本缺口即暂停自动依赖。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

记忆生命周期与中央暂存判据有源码支持；授权内容绑定、超大事件和多资产恢复有限；事务收据是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/part1.js、lib/part2.js、lib/part3.js、lib/part4.js、lib/part5.js、lib/base.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口、分块/seq回读、原则授权、写入/审计和中央Git判据；未完整覆盖全部工具/UI/压缩分支，不把作者事故注释当本轮复现。
- 下一步：可进一步对双root授权、超大单事件、临时名碰撞、审计失败和跨进程写入做隔离矩阵，并比较普通笔记接续质量。

**分析版本**

- **仓库**：[18477514055/dsh-ledger-memory](https://github.com/18477514055/dsh-ledger-memory)
- **版本号**：1.6.1（[固定提交 c3fda36](https://github.com/18477514055/dsh-ledger-memory/tree/c3fda3608c9e8585523df7d2db53d65dc69c6eea)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是绑定root/内容/版本的授权与多资产写入收据，借故障矩阵检验错写、部分审计和可恢复性，不能把新假设当已实现保证。[Q06](#research-q06)

可进一步对双root授权、超大单事件、临时名碰撞、审计失败和跨进程写入做隔离矩阵，并比较普通笔记接续质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 16 | 32767 | 17881 | 13195 | — |
| .md | source | 6 | 1430 | — | — | 16297 |
| .mjs | source | 472 | 78597 | 57084 | 16877 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对项目长期记忆生命周期、授权/恢复与真实接续边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目台账、卡片和压缩回读相对普通记忆文件增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向反复跨会话推进同一项目的人，把活跃状态、决策、目标、原则与经验卡分开保存，用清单定位而不强制模板。相对手工维护一个AGENTS/笔记，贡献是检测、按需注入、回写回执、归档和压缩原文指针的生命周期接线；语义内容仍由模型与用户判断。合格接续需恢复正确目标、决策及真实工作区状态，不能用记忆文件存在或注入字数当成功指标。作者“只追加”的描述也不意味着活跃台账从不替换或无多文件失败窗口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-23](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/README.md#L3-L23)

作者定义项目记忆及接续用途。

<details>
<summary>查看原文（21行）</summary>

```text
一个面向 **DSH（DeepSeek Harness）** 的宿主侧插件，为每个项目建立独立、可回溯、可追查的长期记忆载体。

插件管理的对象并非对话记录，而是**项目自身的记忆载体 —— 台账**：可追溯、只追加、按周归档。
围绕台账还提供活动日志、上下文压缩与跨会话交接能力。

**不预设任何模板。** 台账的文件划分、命名与字段结构，全部由模型在初始化时依据项目类型自行确定；
插件仅承担**检测、注入、回写、归档与 Git 协作**等流程性职责。

---

## 解决的问题

| 问题 | 处理方式 |
|---|---|
| 新会话无法接续前一会话的项目进度 | 会话开始时注入**活跃台账全文**；内容未变更则不重复注入，以避免破坏 prompt 缓存 |
| 单个回合的产出未能沉淀 | 回合结束时将「已完成 / 受阻 / 下一步」写回活跃台账 |
| 台账持续增长、难以完整阅读 | 超出阈值时将**最旧的已完成条目**移入 `归档目录/YYYY-MM/weekN`，**只追加、不删除** |
| 细节在上下文压缩中被抹去 | 压缩**之前**将用户原话、报错原文、变更文件清单持久化为**逐字胶囊**，压缩后与台账一并注回 |
| 新会话缺少承接信息 | 生成**交接单**，并把指针推入新会话的**首轮注入**，无需使用者主动查询 |
| 需要核查台账变更来源与时间 | 台账末尾自动维护变更登记；完整历史保存在只追加的活动日志中 |
| 仅为一次性排查、不构成项目 | `ledger_note` 生成**问题记录**（现象 → 根因 → 结论 → 处理过程），不建立台账 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:25-35](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/index.js#L25-L35)

源码注释区分卡片真相、索引缓存和压缩事件。

<details>
<summary>查看原文（11行）</summary>

```text
 *   ⑪ 搬家   —— `ledger_migrate`：`conform` 的反面（把"历史"从状态文件里搬出去、
 *                把决策拆成卡片、给旧卡片补新字段）—— 同样是显式动作 + 用户确认
 *   ⑫ 卡片化 —— `decisions/` · `goals/` · `lessons/` 都是**一卡一文件**；
 *                `ledger_index` 给卡片目录生成多维索引表（**权威永远是卡片本身**，索引只是缓存）
 *   ⑬ 记忆类别 —— 活跃台账 / 回合流水 / 决策 / 目标树 / 根本原则 / 经验与教训，
 *                各自一个文件或目录（**语义不同 ⇒ 分开放**，表见 README 与台账 §七）
 *   ⑭ 回合末 —— agent/turn-stopping 自动给出四选一（不阻塞回合）
 *   ⑮ 第一轮 —— 会话第一轮结束时先弹「建项目 or 不建」（也是一次性、只问一次）
 *   ⑯ 压缩前 —— `compaction/start` ⇒ **那一瞬间抓「压缩前胶囊」**（此时历史还完整；
 *                官方那次也一样抓 —— D215 的 27 秒窗口）
 *   ⑰ 压缩后 —— compaction/end ⇒ 台账 + 逐字胶囊强制重注并提示（**失败的不冒充成功**）
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目root、分块注入、指针与seq读取如何串联？

**研究主题**：功能与机制

#### 完整回答

项目根清单指定活跃台账和各类路径，入口在agent/pre-step将项目记忆及压缩后指针送入当前步。分块注入读取活跃台账，按标题切块并结合内容摘要、模型/历史权重；超长或无法切块会返回fallback，改变块和压缩后重注有保护。seq回读依赖session.eventAt，先索引再挑事件，提取text而不是原始完整事件对象。这样兼顾常驻状态与按需原文，但压缩胶囊、文件台账和宿主日志是不同载体，不能把文本提取叫日志无损备份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:325-339](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/index.js#L325-L339)

pre-step接线及宿主压缩顺序。

<details>
<summary>查看原文（15行）</summary>

```text
  // ★ 入口选 `agent/pre-step` 的原因（与 6.会话工作区用途 同款，已在真机验证）：
  //   它是 waterfall，`next()` 之后拿到本步真正要发的 messages，能在**已认领消息之后**
  //   插一条自定义消息；而 systemPrompt.context 每次装配都重算 ⇒ 会写进
  //   runtime-context 快照、每步都变 ⇒ 打烂 prompt 缓存。pre-step 只在**内容变了**时插。
  if (cfg.inject !== false) {
    ctx.on("agent/pre-step", async ({ agent, messages }, next) => {
      const decision = await next();
      // ── ★★★★★ 2026-10-18（D244）：**长回合中途：先补义务 → 全量压缩 → 继续** ──
      //
      //   用户原话（逐字）：*"如果遇到一个非常长的工作，则工作到准备接近压缩线的时候，
      //   强制进行这些义务，然后进行一次强制的全量压缩，压缩完之后模型接着工作，
      //   整个过程不需要任何操作。"*
      //
      //   ★★★ 位置是**本钩子的第一件事**，而且必须在 `await next()` **之后**：
      //     - **之后**：内核自己的 `agent/pre-step` 压缩（`dsh-compaction-basic:840-853`）
```

</details>

**依据 2 · 源码核查**：[lib/part3.js:1329-1364](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part3.js#L1329-L1364)

切块、摘要差异和fallback。

<details>
<summary>查看原文（36行）</summary>

```text
export function renderBlockInjection(info, opts) {
  const fallback = (why) => ({ text: "", used: false, stats: { why } });
  if (info?.activeAbs === undefined) return fallback("没有活跃台账路径");
  let raw;
  try {
    raw = readTextSafe(info.activeAbs);
  } catch {
    return fallback("读盘抛错");
  }
  if (typeof raw !== "string" || raw === "") return fallback("台账读不到或为空");

  // ★ 台账过长时**不省**：那一段本来就带"已截断"警告，再切块会把语义搅乱。
  if (raw.length > numOf("maxReadChars", MAX_READ_CHARS)) return fallback("台账超过单次读取上限");

  let blocks;
  try {
    blocks = splitBlocks(raw);
  } catch {
    return fallback("切块抛错");
  }
  if (!Array.isArray(blocks) || blocks.length === 0) return fallback("切不出块");

  const afterCompaction = opts?.afterCompaction === true;

  // ── 算权重（★ 判据只来自确定性输入；模型没答的块按"必注"兜底）──
  const weighted = weightBlocks(blocks, opts?.modelAnswers, opts?.histByHash, Date.now());

  // ── 安全绳 ①：内容变了的块 ⇒ 必注 ──
  const prevHashes = new Set((opts?.prevBlocks ?? []).map((b) => b.hash));
  let changedSet = new Set();
  if (opts?.prevBlocks !== undefined) {
    try {
      changedSet = new Set(diffBlocks(opts.prevBlocks, blocks).changed.map((b) => b.hash));
    } catch {
      changedSet = new Set();
    }
```

</details>

**依据 3 · 源码核查**：[lib/part1.js:1924-1959](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part1.js#L1924-L1959)

seq按需读取返回文本并受字符预算约束。

<details>
<summary>查看原文（36行）</summary>

```text
export function readSessionPicked(session, seqs, opts) {
  const maxChars = Math.max(200, Number(opts?.maxChars) || 24000);
  const withReasoning = opts?.reasoning !== false;
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const wanted = [...new Set((Array.isArray(seqs) ? seqs : []).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n >= 0))]
    .sort((x, y) => x - y);
  const out = [];
  const skipped = [];
  let chars = 0;
  let truncated = false;
  for (const seq of wanted) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) { skipped.push(seq); continue; }
    const text = eventTextOf(e, withReasoning);
    if (text === "") { skipped.push(seq); continue; }
    if (chars + text.length > maxChars) { truncated = true; break; }
    chars += text.length;
    out.push({ seq, type: e.type, time: e.time, text });
  }
  return {
    ok: true,
    events: out,
    chars,
    truncated,
    // ★ 如实报告"点了名但取不到"的 seq —— 悄悄跳过会让模型以为自己取全了。
    ...(skipped.length > 0 ? { skipped } : {}),
    reasoning: withReasoning,
    picked: wanted.length,
  };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 授权是否绑定内容/root，超大事件和自动暂存怎样处理？

**研究主题**：缺陷与关键质疑

#### 完整回答

原则授权比自填authorizedBy更强，因为只有用户卡片写入state且成功后消费；但grant仅以sid保存时间、来源与reason，写入时未绑定root、正文摘要或版本，因此是会话内一次窗口而非特定内容批准。seq事件文本若单项超过maxChars，循环直接break，拆seq也无法拆开这个事件，须另有分片读法。自动暂存需区分项目形态：V3记忆子目录无论autoGitAdd配置都禁止自动stage，V2仍默认允许，不能泛称所有项目自动暂存或全都禁止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part2.js:363-378](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part2.js#L363-L378)

grant按sid与TTL，消费删除。

<details>
<summary>查看原文（16行）</summary>

```text
export function principleGrantOf(state, sid) {
  const key = String(sid);
  const g = state.principleGrants?.get(key);
  if (g === undefined) return undefined;
  // ★ 过期即失效（并且**顺手清掉** —— 免得它一直躺在 state 里让人误以为还有效）。
  if (Date.now() - g.at > PRINCIPLE_AUTH_TTL_MS) {
    state.principleGrants.delete(key);
    return undefined;
  }
  return g;
}

/** 消费掉那个窗口（**一次一授权**）。 */

export function consumePrincipleGrant(state, sid) {
  state.principleGrants?.delete(String(sid));
```

</details>

**依据 2 · 源码核查**：[lib/part2.js:478-485](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part2.js#L478-L485)

卡片授权仅写时间/来源/reason。

```text
      if (!authorized) {
        return {
          ok: true,
          authorized: false,
          reason: "用户没有授权（或没做出选择）⇒ 我**仍然没有**修改原则的路径，只能提议。",
        };
      }
      state.principleGrants.set(sid, { at: Date.now(), authorizedBy: "user-card", reason });
```

**依据 3 · 源码核查**：[lib/part4.js:2418-2451](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part4.js#L2418-L2451)

写原则读取grant并成功消费，无内容版本绑定。

<details>
<summary>查看原文（34行）</summary>

```text
    const sidForGrant = String(exec?.agent?.session?.header?.id ?? "");
    const grant = sidForGrant === "" ? undefined : principleGrantOf(state, sidForGrant);
    const authorizedBy = grant === undefined ? "" : grant.authorizedBy;
    if (authorizedBy === "") {
      return {
        ok: false,
        reason:
          "**根本原则条例只能由用户授权后写入** —— 这次调用没有携带**由用户动作产生**的授权，所以一个字节都没写。\n" +
          (forged
            ? "★ 注意：你（或调用方）传了 `authorizedBy`，但**那个字符串从来就不是授权凭据** ——\n" +
              "  任何人都能写一个字符串，所以它证明不了任何事（v1.2.8 起已把它从工具参数里彻底移除）。\n"
            : "") +
          "★ 正确流程（两条，任选）：\n" +
          `  ① 用 \`${PRINCIPLE_GRANT_TOOL}\` 弹一张**授权卡片**，用户点了"授权"即可（一次一授权）；\n` +
          "  ② 用 `ledger_propose_principle` 登记**一条具体提议**，" +
          "再请用户敲 `/ledger principles approve` —— ★ 批准**只在命令行层**，你调不到。",
        refused: true,
        ...(forged ? { selfAssertedAuthIgnored: true } : {}),
        hint: PRINCIPLE_GRANT_TOOL,
      };
    }
    const r = writePrinciples(root, {
      content,
      mode: explicitMode ?? "append",
      authorizedBy,
      exec,
      tag,
    });
    // ★★★ **一次一授权**：写成功后**立刻消费掉**那个窗口。
    //   ★ 为什么必须消费（而不是留着）：留着就等于"点一次 = 此后随便改"，
    //     守卫当场退化成空的。用户的原话是"解锁**改原则的权利**"，
    //     而本项目一贯的取舍是"授权针对**某一次具体修改**"（见 `PRINCIPLE_AUTH_TTL_MS`）。
    if (r.ok === true && grant !== undefined) {
      consumePrincipleGrant(state, sidForGrant);
```

</details>

**依据 4 · 源码核查**：[lib/part1.js:1943-1948](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part1.js#L1943-L1948)

单事件超预算直接停止。

```text
    if (e === undefined || e === null) { skipped.push(seq); continue; }
    const text = eventTextOf(e, withReasoning);
    if (text === "") { skipped.push(seq); continue; }
    if (chars + text.length > maxChars) { truncated = true; break; }
    chars += text.length;
    out.push({ seq, type: e.type, time: e.time, text });
```

**依据 5 · 源码核查**：[lib/part2.js:4849-4861](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part2.js#L4849-L4861)

V3禁止与V2默认允许的中央判据。

<details>
<summary>查看原文（13行）</summary>

```text
  if (isV3) {
    return {
      allow: false,
      v3: true,
      reason:
        "第三代项目（记忆在 " +
        mb +
        "）默认禁止自动暂存；清单里的 autoGitAdd 不能重新开启它（任务书 §3.1）",
    };
  }

  const allow = info?.manifest?.autoGitAdd !== false;
  return { allow, reason: allow ? "第二代默认允许（清单未显式关闭）" : "清单显式关闭" };
```

</details>

#### 缺口

- 同会话切换root或变更正文后授权窗口如何被用户理解缺乏验证
  **影响**：不能把用户点授权视为批准精确变更
  **进一步探讨**：在副本项目对授权后改root/正文做审计回放，并设计摘要绑定对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多资产写入、锁、失败审计和恢复有哪些边界？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

项目文件、清单、归档与活动日志分步写，不构成整体事务。台账主写成功后审计异常被吞，仍可返回ok，因此只追加日志并不能保证每次写都有完整审计。底层writeFileAtomic用pid+毫秒构造临时名并wx创建，失败catch无条件unlink该名；同进程同毫秒或预存碰撞时，未取得所有权也会删除该临时路径，是值得隔离复现的清理所有权风险。rename只防半文件，不提供跨进程丢更新防护。依赖宿主tools、事件与session接口，缺服务应按具体分支降级，不能从零外部import推断零宿主依赖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/base.js:265-293](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/base.js#L265-L293)

临时名、wx及失败清理的实际路径。

<details>
<summary>查看原文（29行）</summary>

```text
export function writeFileAtomic(file, data, opts) {
  const abs = path.resolve(file);
  const tmp = `${abs}.tmp-${process.pid}-${Date.now().toString(36)}`;
  try {
    ensureDir(path.dirname(abs));
  } catch (e) {
    return { ok: false, reason: `创建目录失败：${String((e && e.message) || e)}` };
  }
  try {
    // ① 独占创建（`wx`）：临时名撞了就直接失败，绝不覆盖别人的临时文件
    fs.writeFileSync(tmp, data, { encoding: "utf8", flag: "wx" });
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 连临时文件都没建出来，没什么可清的 */
    }
    return { ok: false, reason: `写临时文件失败：${String((e && e.message) || e)}`, tmp };
  }
  try {
    // ② 原子替换
    fs.renameSync(tmp, abs);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 清理失败不掩盖真正的原因 */
    }
    return { ok: false, reason: `原子替换失败：${String((e && e.message) || e)}`, tmp };
```

</details>

**依据 2 · 源码核查**：[lib/part4.js:2669-2707](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part4.js#L2669-L2707)

审计失败不影响主写成功，stage独立处理。

<details>
<summary>查看原文（39行）</summary>

```text
  // ── 审计：往活动日志记一条"谁改过台账"（用户提议）──────────────────────
  //
  // ★ 为什么记在**活动日志**而不是台账里：台账是"当前状态"，会被替换、会被归档；
  //   而"谁在什么时候改过它"是**历史**，只该进只追加的日志。
  //   这也正是"台账丢了条目还能追回来"的依据 —— 见 `ledger_log` 的 audit 视图。
  let auditLine;
  if (info.logRel !== undefined) {
    try {
      auditLine = appendAudit(root, info, {
        // ★★★★★ 2026-10-13（D183）：**显式给出 kind** —— 流水的改动要和台账改动分得清。
        //   ★ 不给就会退回按 `mode` 推断成 `ledger-write`（76④ 抓到的那个缺口）。
        ...(target === "journal" ? { kind: AUDIT_KIND_JOURNAL } : {}),
        tag,
        target,
        mode,
        relPath,
        lines: lines2,
        revision: newRevision,
        sessionId: exec?.agent?.session?.header?.id,
      });
    } catch {
      // 审计失败绝不影响台账写入本身。
      auditLine = undefined;
    }
  }

  // ★ V3/D290：走唯一闸门 —— 全部被 ignore 挡住时 `staged` 必须是 false，不是 true。
  let staged;
  let staging;
  // ★★★★★ 2026-10-22（V3 §3.1）：**问中央判据**，不再各自写 `autoGitAdd !== false`。
  //   旧条件的默认值是 true ⇒ V3 项目（记忆在子目录）照样会去 stage。
  if (shouldAutoStage(info).allow) {
    const r = gitAdd(root, [relPath]);
    staging = stageOutcomeOf(r, [relPath]);
    staged = staging.staged;
  }

  return {
    ok: true,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:54-85](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/index.js#L54-L85)

宿主服务、同步事件及Git副作用边界。

<details>
<summary>查看原文（32行）</summary>

```text
 * ★ 安全与稳定约束（**改动前必读**，每条都有出处或事故）
 * ═══════════════════════════════════════════════════════════════════════════
 * ① **不许 `import "@deepseek-ai/*"`**。插件本体在工作区，profile 里是 Junction，
 *    Node 按**真实路径**解析（内核没开 --preserve-symlinks）⇒ `ERR_MODULE_NOT_FOUND`
 *    ⇒ **内核起不来**。已实测：`6.会话工作区用途\lib\index.js:1013-1022`。
 *    ⇒ 内核能力全走**服务调用**，消息体自己手搓。
 *
 * ② **`inject` 里没声明的服务，访问属性即抛错**（不是"取到 undefined"）：
 *      Error: cannot get property "tools" without inject
 *    apply() 抛错 ⇒ **整个 profile 组合失败、内核起不来**（2026-09-23 真事故，
 *    出处见 `6.会话工作区用途\lib\index.js:62-88`）。
 *    ⇒ 必需服务写进 `inject`；可选服务用官方的 `ctx.inject([...], cb)` 模式
 *      （cb 不执行也不抛错），其余一律 `ctx.get(name)` + try/catch。
 *
 * ③ **注入的消息必须带非空 string `id`**。缺 id 时**当场不报错、重载历史时才校验**：
 *      dsh-session\lib\index.js:934
 *        throw new Error(`${subject} lacks an identified message`);
 *    一条坏事件 ⇒ **整个会话历史读不出来**（真实事故：60/60 条注入事件全缺 id，
 *    那个会话报废）。⇒ 用 `node:crypto` 的 randomUUID()（零解析风险），并加兜底自检。
 *
 * ④ **永不 `git add -A`**（全局红线 §九.6）⇒ 只 `git add -- <明确路径>`。
 *
 * ⑤ **不碰 `$DSH_HOME\sessions\` / `storages\`**（全局红线 §九.2）。
 *    本插件的会话态**只在内存**（Map），进程退出即消失，不落盘。
 *
 * ⑥ 所有写入**必须落在项目根之内**（isUnder 判定），拒绝 `..` 穿越。
 *
 * ⑦ **日志采集是同步跑在 `Session.append()` 路径上的**（`session/event` 在 append
 *    内部同步触发）⇒ 采集里抛错会**连累官方写会话日志**。所以采集全程吞错，
 *    并且已用"坏事件"用例覆盖（`data: null`、非法 JSON 参数、`message: null`、空 cwd）。
 *    另：落盘走**去抖**（`LOG_FLUSH_DEBOUNCE_MS`），且 `git add` 只在回合末/卸载做 ——
 *    否则一场几百次调用的会话会白拉几百个 git 进程。
```

</details>

#### 缺口

- 临时名碰撞、跨进程写与多资产中断没有独立故障注入
  **影响**：不能确认恢复和审计完整性
  **进一步探讨**：以隔离目录固定时钟/临时路径并注入审计失败，核对所有权、主文件和回执

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按合格跨会话接续衡量效果成本与工程价值如何？

**研究主题**：效果与总成本

#### 完整回答

首次要确认root、清单布局、记忆目录隐私和V2/V3暂存策略；持续要整理台账/卡片、读回注入内容并承担模型token，压缩与分类还可能增加模型工作；失败需比对清单、活跃状态、归档和审计。可借鉴的是卡片为真相而索引可重建、中央stage判据和返回真实stagedPaths，不以git命令成功等同真正入index。无同任务接续质量、总token和人工时间对照，不能把缓存/切块设计或作者百分比直接当净节省。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-35](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/index.js#L25-L35)

状态/卡片/索引分工。

<details>
<summary>查看原文（11行）</summary>

```text
 *   ⑪ 搬家   —— `ledger_migrate`：`conform` 的反面（把"历史"从状态文件里搬出去、
 *                把决策拆成卡片、给旧卡片补新字段）—— 同样是显式动作 + 用户确认
 *   ⑫ 卡片化 —— `decisions/` · `goals/` · `lessons/` 都是**一卡一文件**；
 *                `ledger_index` 给卡片目录生成多维索引表（**权威永远是卡片本身**，索引只是缓存）
 *   ⑬ 记忆类别 —— 活跃台账 / 回合流水 / 决策 / 目标树 / 根本原则 / 经验与教训，
 *                各自一个文件或目录（**语义不同 ⇒ 分开放**，表见 README 与台账 §七）
 *   ⑭ 回合末 —— agent/turn-stopping 自动给出四选一（不阻塞回合）
 *   ⑮ 第一轮 —— 会话第一轮结束时先弹「建项目 or 不建」（也是一次性、只问一次）
 *   ⑯ 压缩前 —— `compaction/start` ⇒ **那一瞬间抓「压缩前胶囊」**（此时历史还完整；
 *                官方那次也一样抓 —— D215 的 27 秒窗口）
 *   ⑰ 压缩后 —— compaction/end ⇒ 台账 + 逐字胶囊强制重注并提示（**失败的不冒充成功**）
```

</details>

**依据 2 · 源码核查**：[lib/part4.js:2695-2703](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part4.js#L2695-L2703)

中央stage判据。

```text
  // ★ V3/D290：走唯一闸门 —— 全部被 ignore 挡住时 `staged` 必须是 false，不是 true。
  let staged;
  let staging;
  // ★★★★★ 2026-10-22（V3 §3.1）：**问中央判据**，不再各自写 `autoGitAdd !== false`。
  //   旧条件的默认值是 true ⇒ V3 项目（记忆在子目录）照样会去 stage。
  if (shouldAutoStage(info).allow) {
    const r = gitAdd(root, [relPath]);
    staging = stageOutcomeOf(r, [relPath]);
    staged = staging.staged;
```

**依据 3 · 源码核查**：[lib/part4.js:2748-2762](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part4.js#L2748-L2762)

回执区分真实stage路径与跳过。

<details>
<summary>查看原文（15行）</summary>

```text
    // ★ `staged` **只在真的 stage 过时才出现**。不能直接写 `staged`（值可能是 undefined）——
    //   内核校验工具返回值必须是 **lossless JSON**，`undefined` 会让整个调用被判失败，
    //   而写入其实已经落盘（2026-10-08 实测撞到，写日志那条路先报了这个错）。
    ...(staged === undefined ? {} : { staged }),
    // ★ V3/D290：进去了哪些、被挡住哪些，都要说出来（只说"成功"不够）。
    ...(staging === undefined || staging.stagedPaths.length === 0
      ? {}
      : { stagedPaths: staging.stagedPaths }),
    // ★ V3/D290：被 ignore 挡住的路径如实列出（`staged` 为 false 时告诉调用方"为什么"）。
    ...(staging === undefined || staging.stagedSkipped.length === 0
      ? {}
      : { stagedSkipped: staging.stagedSkipped }),
    ...(staging === undefined || staging.stagedNote === undefined
      ? {}
      : { stagedNote: staging.stagedNote }),
```

</details>

**依据 4 · 作者声明**：[README.md:35-44](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/README.md#L35-L44)

作者压缩经验属于报告而非本轮验证。

<details>
<summary>查看原文（10行）</summary>

```text
**关于默认关闭的增量压缩**：该分支曾为主要路径，现已默认关闭且不再按固定节奏调用。
依据是实测取舍 —— 压缩幅度较浅的摘要**大概率会被再次压缩**（≤5 万 token 的浅层压缩中 **72.7%** 会被二次压缩），
层级增加会导致清晰度衰减。因此当前以**全量压缩**为主路径，单次压缩更深。
`deltaTriggerPoints`（触发涨幅）与 `deltaRemovePoints`（单轮最大压缩点数）两项配置**仅在启用增量压缩时生效**。

压缩遵循一条固定约束：**先记录台账，再执行压缩** —— 尚未落盘的进展将成为唯一副本。
该约束由**周期判定**（"自上次压缩以来是否落盘"）保证，而非"是否已发出要求"
（后者会使模型被阻塞：历史上曾出现拦截近 4 小时、压缩零次的情况）。
**收尾硬门**（`hardMaintenanceGate`）默认开启：未落盘则不压缩；关闭后回退为
"拦 3 次或超 20 分钟即放行"的旧行为。
```

</details>

#### 缺口

- 同条件跨会话目标恢复率和整体资源成本未知
  **影响**：不能判断复杂记忆流程优于普通笔记
  **进一步探讨**：固定项目任务对照普通AGENTS/交接清单，盲评接续并记录全部token、整理及恢复时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 内容绑定授权与事务性记忆收据能否降低错写，如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是授权绑定session、real root、目标路径、expected revision与内容摘要，并把主写、清单及审计状态形成事务收据，部分失败不得只报整体ok。由会话窗口和多资产尽力写入推导，相对增加记忆类型更能改善可追责性；代价是冲突重提与恢复日志维护。用双root、并发改文、审计失败和超大事件矩阵，检查是否阻断错写且能读回完整证据；若合法写被频繁误阻或仍无恢复闭环，应否定。当前可在可备份、V3记忆目录的非关键项目限定试用，先核对授权范围、暂存策略和日志缺失，不给长期无损记忆保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part2.js:363-378](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part2.js#L363-L378)

当前授权窗口可作内容绑定改造的基线。

<details>
<summary>查看原文（16行）</summary>

```text
export function principleGrantOf(state, sid) {
  const key = String(sid);
  const g = state.principleGrants?.get(key);
  if (g === undefined) return undefined;
  // ★ 过期即失效（并且**顺手清掉** —— 免得它一直躺在 state 里让人误以为还有效）。
  if (Date.now() - g.at > PRINCIPLE_AUTH_TTL_MS) {
    state.principleGrants.delete(key);
    return undefined;
  }
  return g;
}

/** 消费掉那个窗口（**一次一授权**）。 */

export function consumePrincipleGrant(state, sid) {
  state.principleGrants?.delete(String(sid));
```

</details>

**依据 2 · 源码核查**：[lib/part4.js:2669-2692](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part4.js#L2669-L2692)

主写与审计分离需要状态收据。

<details>
<summary>查看原文（24行）</summary>

```text
  // ── 审计：往活动日志记一条"谁改过台账"（用户提议）──────────────────────
  //
  // ★ 为什么记在**活动日志**而不是台账里：台账是"当前状态"，会被替换、会被归档；
  //   而"谁在什么时候改过它"是**历史**，只该进只追加的日志。
  //   这也正是"台账丢了条目还能追回来"的依据 —— 见 `ledger_log` 的 audit 视图。
  let auditLine;
  if (info.logRel !== undefined) {
    try {
      auditLine = appendAudit(root, info, {
        // ★★★★★ 2026-10-13（D183）：**显式给出 kind** —— 流水的改动要和台账改动分得清。
        //   ★ 不给就会退回按 `mode` 推断成 `ledger-write`（76④ 抓到的那个缺口）。
        ...(target === "journal" ? { kind: AUDIT_KIND_JOURNAL } : {}),
        tag,
        target,
        mode,
        relPath,
        lines: lines2,
        revision: newRevision,
        sessionId: exec?.agent?.session?.header?.id,
      });
    } catch {
      // 审计失败绝不影响台账写入本身。
      auditLine = undefined;
    }
```

</details>

**依据 3 · 源码核查**：[lib/part1.js:1943-1948](https://github.com/18477514055/dsh-ledger-memory/blob/c3fda3608c9e8585523df7d2db53d65dc69c6eea/lib/part1.js#L1943-L1948)

超大事件需另外设计分片。

```text
    if (e === undefined || e === null) { skipped.push(seq); continue; }
    const text = eventTextOf(e, withReasoning);
    if (text === "") { skipped.push(seq); continue; }
    if (chars + text.length > maxChars) { truncated = true; break; }
    chars += text.length;
    out.push({ seq, type: e.type, time: e.time, text });
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
