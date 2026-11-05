# 大肥鱼的小说工坊

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b9e4922](https://github.com/akira399/dsh-novel-writer/tree/b9e49227aa70f7e42d8a348fc104180d2fe497e7)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/akira399/dsh-novel-writer)
<!-- END META -->

> **功能**：用阶段门禁、设定注入和版本归档管理连载小说

> **亮点**：[Q01](#research-q01) 把阶段、版本与设定集中到 DSH 创作界面。

> **主要限制**：[Q03](#research-q03) 有限裁剪和规则无法保证长文一致性。

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
  - [Q01 · 用户得到什么？](#detail-section-11)
  - [Q02 · 怎么推进和回退？](#detail-section-12)
  - [Q03 · 长篇上下文保证到什么程度？](#detail-section-13)
  - [Q04 · 如何试用与退出？](#detail-section-14)
  - [Q05 · 哪些结果否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：连载作者需要维持多章设定和修订历史。

手工维护设定表和文稿版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工维护设定表和文稿版本。 | 可直接比较 | 保留人工步骤 |
| 大肥鱼的小说工坊 | 把阶段、版本与设定集中到 DSH 创作界面。 | 有限裁剪和规则无法保证长文一致性。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 工作流校验前置状态，按世界书和上下文生成或修订。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 连载作者需要维持多章设定和修订历史。 | 保留原流程 |
| 试验 | 工作流校验前置状态，按世界书和上下文生成或修订。 | 观察固定版本 |
| 复核 | 先用虚构三章验证门禁、预算与导出。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少跨章设定冲突并保留可回退稿件 | 在同一连载样本上可减少查找设定和回退时间。 | 先用虚构三章验证门禁、预算与导出。 |

> **思考**：[Q03](#research-q03) 有限裁剪和规则无法保证长文一致性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把阶段、版本与设定集中到 DSH 创作界面。

状态转换和文本裁剪可逐步追踪。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 有限裁剪和规则无法保证长文一致性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用虚构三章验证门禁、预算与导出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少跨章设定冲突并保留可回退稿件。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/core/workflow/engine.ts、src/core/context/assembler.ts、src/core/atomic-file.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少跨章设定冲突并保留可回退稿件。未执行目标代码或实际宿主验证。
- 下一步：保留事实表、稿件版本和生成上下文长度。

**分析版本**

- **仓库**：[akira399/dsh-novel-writer](https://github.com/akira399/dsh-novel-writer)
- **版本号**：0.2.0（[固定提交 b9e4922](https://github.com/akira399/dsh-novel-writer/tree/b9e49227aa70f7e42d8a348fc104180d2fe497e7)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在同一连载样本上可减少查找设定和回退时间。

保留事实表、稿件版本和生成上下文长度。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 69 | 3848 | — | — | 54174 |
| .mjs | source | 3 | 251 | 165 | 62 | — |
| .js | source | 1 | 54 | 44 | 10 | — |
| .ts | source | 77 | 8552 | 6664 | 1276 | — |
| .tsx | source | 2 | 1721 | 1503 | 160 | — |
| .ts | test | 36 | 4866 | 4087 | 287 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/akira399/dsh-novel-writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/akira399/dsh-novel-writer/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/akira399/dsh-novel-writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少跨章设定冲突并保留可回退稿件

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

连载作者把大纲、章节、设定和修订放入同一工作流。与文档和聊天分别维护相比，验收应覆盖阶段跳转、冲突提示、选中修订和导出成稿。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-33](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/README.md#L20-L33)

作者说明阶段、快照和设定注入

<details>
<summary>查看原文（14行）</summary>

```text
## ✨ 功能特性

### 九阶段门禁式创作流程
`选题 → 设定 → 人设 → 大纲 → 分卷 → 细纲 → 正文 → 修订 → 完本`
- **阶段门禁**：未批准不能跳阶段（可用户显式放行/回退），杜绝模型"口头跳阶段"
- **产物版本快照**：每阶段每次提交留档 `versions/<phase>/v<n>`，可回退任意历史版本
- **审计日志**：每次 commit / 放行 / 回滚写入 `audit.jsonl`

### 世界书（lorebook）设定注入
- 关键词 / 正则触发 + 常驻注入，条目按书绑定（每本书独立栏目）
- 导入支持 **Operit / SillyTavern / 角色卡** 三格式，自动兼容警告
- **导出到酒馆**：世界书面板点「**导出到酒馆**」直接下载 SillyTavern 原生 lorebook JSON（`{entries:[...]}`）即可在酒馆「Import」导入作前置设定；也可用 `lorebook_export_entries format=sillytavern` 走对话导出
- **AI 一键生成设定**：按书名+题材自动生成 4-6 条核心设定并绑定本书
- 注入 token 预算裁剪，长上下文不爆窗
```

</details>

**依据 2 · 作者声明**：[README.md:44-55](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/README.md#L44-L55)

作者说明写章和逐条润色

<details>
<summary>查看原文（12行）</summary>

```text
### 百万字一致性
- **事实账本**：章节内 `<JSONPatch>` 自动落账（人物境界/物品/地点状态），冲突检测与巡检
- **时间线**：书内时间归一 + 倒挂检测；**伏笔**登记与回收跟踪；**世界书自动沉淀建议**
- **上下文包三层记忆**（L1 全书设定 + L2 卷章细纲前文 + L3 摘要/变量/世界书）预算恒定（压测 100 万字 0 超限）

### 一键写作与润色
- **一键写章**：host 直写（上下文包 → 正文 → 自动落盘），章节统计/账本/审计联动；写作指令强调**严格遵循本章细纲/全书设定/前文事实**，避免自创冲突
- **一键润色**：AI 做**重构式润色**——整句重写、大胆扩写、可在段后添加细节描写（只守情节/人物/设定底线），改动按**段落**拆成建议，每条可**单独采纳/拒绝**（也可全部采纳/全部拒绝），只保存你选中的改动
- **采纳即预览**：点「采纳这条」→ 顶部原文视图中该段**立即显示润色文并标绿**，新增段实时插入，取消采纳立即恢复——所见即所得
- **字级 diff 标亮**：每条建议段内标出具体改动（删除线=删，黄底=新增/改写处）
- **逐条可定位**：每条建议带「📍 定位」跳到原文对应段落
- **逐步撤销**：可撤销 AI 润色与手动编辑，还原到任意历史状态
```

</details>

**依据 3 · 源码核查**：[src/core/workflow/engine.ts:35-43](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/workflow/engine.ts#L35-L43)

源码检查前一阶段状态

```text
/** 阶段推进许可判定：前一阶段必须 approved/skipped（topic 恒可进）。 */
export function canEnter(ledger: PhaseLedger, phaseId: PhaseId): { ok: true } | { ok: false; reason: string } {
  if (!(phaseId in PHASE_INDEX)) return { ok: false, reason: `未知阶段: ${phaseId}` }
  const previous = PHASE_ORDER[PHASE_INDEX[phaseId] - 1]
  if (previous === undefined) return { ok: true }
  const record = ledger.phases[previous]
  if (!record) return { ok: false, reason: `前置阶段 ${previous} 尚未建立` }
  if (record.state === 'approved' || record.state === 'skipped') return { ok: true }
  return { ok: false, reason: `前置阶段 ${previous} 处于 ${record.state}，需 approved/skipped 后才能进入 ${phaseId}` }
```

#### 缺口

- 文稿质量需人工判断。
  **影响**：可减少散落上下文和版本寻找。
  **进一步探讨**：选三章和两个显式设定。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎么推进和回退？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

阶段前置要求 approved 或 skipped。提交依据校验报告决定 review 或 approved，支持强制放行并记事件。修订期回退时重置后续批准状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/workflow/engine.ts:71-111](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/workflow/engine.ts#L71-L111)

提交门禁及放行事件

<details>
<summary>查看原文（41行）</summary>

```text
 * report.passed → approved；errorCount>0 → review 挂起；其余按 passed 判定。
 */
export function submit(
  ledger: PhaseLedger,
  phaseId: PhaseId,
  report: PhaseReport,
  now: string,
  actor: AuditEvent['actor'] = 'agent',
): Result<{ ledger: PhaseLedger; event: AuditEvent; seq: number }> {
  const record = ledger.phases[phaseId]
  if (!record || record.state !== 'in_progress' && record.state !== 'review') {
    return { ok: false, error: invalid(`阶段 ${phaseId} 当前状态 ${record?.state ?? '缺失'}，不能提交`) }
  }
  const next = clone(ledger)
  const target: PhaseState = report.errorCount > 0 ? 'review' : report.passed ? 'approved' : 'review'
  next.phases[phaseId] = {
    ...next.phases[phaseId],
    state: target,
    version: next.phases[phaseId].version + 1,
    lastReport: report,
    ...(target === 'approved' ? { approvedAt: now } : {}),
  }
  const detail = target === 'approved' ? 'approved' : `review(${report.errorCount} errors, ${report.warningCount} warnings)`
  const event: AuditEvent = { seq: 0, at: now, action: 'submit', phase: phaseId, actor, detail }
  return { ok: true, value: { ledger: next, event, seq: 0 } }
}

/** 用户强制放行（review → approved；记录审计，不校验报告）。 */
export function forceApprove(
  ledger: PhaseLedger,
  phaseId: PhaseId,
  now: string,
  actor: AuditEvent['actor'] = 'user',
): Result<{ ledger: PhaseLedger; event: AuditEvent; seq: number }> {
  const record = ledger.phases[phaseId]
  if (!record || (record.state !== 'review' && record.state !== 'in_progress')) {
    return { ok: false, error: invalid(`阶段 ${phaseId} 状态 ${record?.state ?? '缺失'} 不能强制放行`) }
  }
  const next = clone(ledger)
  next.phases[phaseId] = { ...next.phases[phaseId], state: 'approved', approvedAt: now }
  const event: AuditEvent = { seq: 0, at: now, action: 'force', phase: phaseId, actor, detail: 'force approved' }
```

</details>

**依据 2 · 源码核查**：[src/core/workflow/engine.ts:151-185](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/workflow/engine.ts#L151-L185)

回退范围和状态改写

<details>
<summary>查看原文（35行）</summary>

```text
 * 规则：仅当 currentPhase 是 revision（或 done）时允许；目标必须已 approved/skipped。
 * 回退也会清除目标之后阶段的 approved 状态（置 locked），保证重新走。
 */
export function rollback(
  ledger: PhaseLedger,
  target: PhaseId,
  now: string,
  actor: AuditEvent['actor'] = 'user',
): Result<{ ledger: PhaseLedger; event: AuditEvent; seq: number }> {
  const current = ledger.phases[ledger.currentPhase]
  if (!current) return { ok: false, error: invalid('当前阶段缺失') }
  if (ledger.currentPhase !== 'revision' && ledger.currentPhase !== 'done') {
    return { ok: false, error: invalid(`仅 revision/done 阶段可回退，当前是 ${ledger.currentPhase}`) }
  }
  if (target === 'done' || target === 'revision') return { ok: false, error: invalid(`不能回退到 ${target}`) }
  const targetRecord = ledger.phases[target]
  if (!targetRecord || (targetRecord.state !== 'approved' && targetRecord.state !== 'skipped')) {
    return { ok: false, error: invalid(`目标阶段 ${target} 状态 ${targetRecord?.state ?? '缺失'}，需 approved/skipped`) }
  }
  const next = clone(ledger)
  // 目标之后的已批准阶段全部解锁（重新走），并清除 approved 残留元数据
  const targetIndex = PHASE_INDEX[target]
  for (const phaseId of PHASE_ORDER) {
    const index = PHASE_INDEX[phaseId]
    if (index > targetIndex && (next.phases[phaseId].state === 'approved' || next.phases[phaseId].state === 'skipped')) {
      const { approvedAt: _dropped, ...rest } = next.phases[phaseId]
      void _dropped
      next.phases[phaseId] = { ...rest, state: 'locked' }
    }
  }
  next.currentPhase = target
  const { approvedAt: _targetApprovedAt, ...targetRest } = next.phases[target]
  void _targetApprovedAt
  next.phases[target] = { ...targetRest, state: 'in_progress', startedAt: now }
  const event: AuditEvent = { seq: 0, at: now, action: 'rollback', phase: target, actor, detail: `rolled back from ${ledger.currentPhase}` }
```

</details>

#### 缺口

- 校验通过不代表情节合理。
  **影响**：作者可以在失误后回到可追溯阶段。
  **进一步探讨**：构造一条不通过的提交和回退。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 长篇上下文保证到什么程度？

**研究主题**：缺陷与关键质疑

#### 完整回答

组装器估算 token 并按分支减半摘要和前章数量。固定当前细纲、全书概要及保留的一章过长时，所见分支不能证明硬上限。报告的百万字压测是作者数据，也不能证明模型总能保留设定。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/context/assembler.ts:118-138](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/context/assembler.ts#L118-L138)

超预算仅做有限轮裁剪

<details>
<summary>查看原文（21行）</summary>

```text
    // ── 预算裁剪（保 L2 全文 → 摘要 → 前章数）──
    let tokenEstimate = estimateTokens(
      projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
    )
    const maxL3 = budget - Math.floor(budget / 3)
    if (tokenEstimate > maxL3 && prevSummaries.length > 0) {
      const before = prevSummaries.length
      prevSummaries.length = Math.max(0, Math.floor(prevSummaries.length / 2))
      truncatedInfo.push(`L3 摘要超预算，从 ${before} 条裁剪到 ${prevSummaries.length} 条`)
      tokenEstimate = estimateTokens(
        projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
      )
    }
    if (tokenEstimate > budget && prevChapters.length > 1) {
      const before = prevChapters.length
      prevChapters.length = Math.max(1, Math.floor(prevChapters.length / 2))
      truncatedInfo.push(`L2 前章全文超预算，从 ${before} 章裁剪到 ${prevChapters.length} 章`)
      tokenEstimate = estimateTokens(
        projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
      )
    }
```

</details>

**依据 2 · 作者声明**：[README.md:44-47](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/README.md#L44-L47)

作者报告压力测试与三层上下文

```text
### 百万字一致性
- **事实账本**：章节内 `<JSONPatch>` 自动落账（人物境界/物品/地点状态），冲突检测与巡检
- **时间线**：书内时间归一 + 倒挂检测；**伏笔**登记与回收跟踪；**世界书自动沉淀建议**
- **上下文包三层记忆**（L1 全书设定 + L2 卷章细纲前文 + L3 摘要/变量/世界书）预算恒定（压测 100 万字 0 超限）
```

#### 缺口

- 预算估算和实际分词可能不同。
  **影响**：长篇风险包括上下文超限及事实遗漏。
  **进一步探讨**：用超长概要和单章测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按作者版本线选择发行包，先导入虚构小项目而非原稿。首次准备题材和设定，持续成本含模型、版本存储和核对。退出前保存原稿和世界书，导出 txt/Markdown 后用独立编辑器检查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:111-119](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/README.md#L111-L119)

作者给出发行包和版本线

```text
## 📦 安装

> 需已装 DSH（跨 Windows/macOS/Linux；运行时 Node ≥18）。**本版本要求 DSH Desktop / CLI `0.2.0-rc.2` 或更高**（`@deepseek-ai/cordis` 4.0.4）；
> v0.1.x 系列是给 `0.1.0-rc.6` 的旧版，在 0.2.0 上会加载失败（见下方「版本对照」）。

### ① 一句话让 AI 装（推荐）
把下面这段发给能执行命令的 AI：

> 帮我安装 DSH 插件「大肥鱼的小说工坊」(dsh-novel-writer)，**只装最新版 0.2.x**。步骤：从 `https://github.com/akira399/dsh-novel-writer/releases/latest` 下载最新的 `dsh-external-dsh-novel-writer-*.tgz`（版本号最大的那个；别下 v0.1.x，那是给旧版 DSH 的）→ 执行 `dsh plugin --profile web add <该 tgz 绝对路径>` → `dsh plugin list` 确认在列且已启用 → 提醒我刷新 DSH 页面（Ctrl+Shift+R）。遇到报错先告诉我再处理。
```

**依据 2 · 作者声明**：[README.md:243-245](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/README.md#L243-L245)

文本导出入口

```text
### 9️⃣ 修订与导出
- **修订**：对话「修订第 3 章，校错别字」→ `novel_revise`（校对/节奏/文风三模式，产出**新版本不覆盖原稿**）。
- **导出**：界面项目详情「**导出 txt**」（带 BOM，可直接投稿）；对话「导出成稿」→ `novel_export`（txt / markdown / 平台排版）。
```

**依据 3 · 源码核查**：[src/core/atomic-file.ts:24-38](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/atomic-file.ts#L24-L38)

单文件临时写与替换

<details>
<summary>查看原文（15行）</summary>

```text
      const keep = options.keepBackups ?? 5
      if (keep > 0) await pruneBackups(dirname(path), baseStem(path), keep)
    }
  }
  const temporary = `${path}.tmp.${process.pid}-${Math.random().toString(36).slice(2, 8)}`
  try {
    await writeFile(temporary, content, { encoding: 'utf8', mode: 0o600 })
    await rename(temporary, path)
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined)
    throw error
  }
}

/** 追加写（审计日志等 append-only 场景；无备份）。 */
```

</details>

#### 缺口

- 整体存储事务与恢复能力需实测。
  **影响**：版本快照不能代替项目备份。
  **进一步探讨**：比较导出前后字节和关键设定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些结果否定采用？

**研究主题**：新假设与验证

#### 完整回答

同样三章比较手工大纲加模型与插件，记录违规设定、重写耗时、回滚可读性。增加故意矛盾条目、超长固定上下文和写入中断。若审计与稿件不一致、导出缺失，或事实冲突无改善，则采用目标未达到。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/workflow/engine.ts:151-185](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/workflow/engine.ts#L151-L185)

阶段回退可设定期望

<details>
<summary>查看原文（35行）</summary>

```text
 * 规则：仅当 currentPhase 是 revision（或 done）时允许；目标必须已 approved/skipped。
 * 回退也会清除目标之后阶段的 approved 状态（置 locked），保证重新走。
 */
export function rollback(
  ledger: PhaseLedger,
  target: PhaseId,
  now: string,
  actor: AuditEvent['actor'] = 'user',
): Result<{ ledger: PhaseLedger; event: AuditEvent; seq: number }> {
  const current = ledger.phases[ledger.currentPhase]
  if (!current) return { ok: false, error: invalid('当前阶段缺失') }
  if (ledger.currentPhase !== 'revision' && ledger.currentPhase !== 'done') {
    return { ok: false, error: invalid(`仅 revision/done 阶段可回退，当前是 ${ledger.currentPhase}`) }
  }
  if (target === 'done' || target === 'revision') return { ok: false, error: invalid(`不能回退到 ${target}`) }
  const targetRecord = ledger.phases[target]
  if (!targetRecord || (targetRecord.state !== 'approved' && targetRecord.state !== 'skipped')) {
    return { ok: false, error: invalid(`目标阶段 ${target} 状态 ${targetRecord?.state ?? '缺失'}，需 approved/skipped`) }
  }
  const next = clone(ledger)
  // 目标之后的已批准阶段全部解锁（重新走），并清除 approved 残留元数据
  const targetIndex = PHASE_INDEX[target]
  for (const phaseId of PHASE_ORDER) {
    const index = PHASE_INDEX[phaseId]
    if (index > targetIndex && (next.phases[phaseId].state === 'approved' || next.phases[phaseId].state === 'skipped')) {
      const { approvedAt: _dropped, ...rest } = next.phases[phaseId]
      void _dropped
      next.phases[phaseId] = { ...rest, state: 'locked' }
    }
  }
  next.currentPhase = target
  const { approvedAt: _targetApprovedAt, ...targetRest } = next.phases[target]
  void _targetApprovedAt
  next.phases[target] = { ...targetRest, state: 'in_progress', startedAt: now }
  const event: AuditEvent = { seq: 0, at: now, action: 'rollback', phase: target, actor, detail: `rolled back from ${ledger.currentPhase}` }
```

</details>

**依据 2 · 源码核查**：[src/core/context/assembler.ts:118-138](https://github.com/akira399/dsh-novel-writer/blob/b9e49227aa70f7e42d8a348fc104180d2fe497e7/src/core/context/assembler.ts#L118-L138)

长输入裁剪可验证

<details>
<summary>查看原文（21行）</summary>

```text
    // ── 预算裁剪（保 L2 全文 → 摘要 → 前章数）──
    let tokenEstimate = estimateTokens(
      projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
    )
    const maxL3 = budget - Math.floor(budget / 3)
    if (tokenEstimate > maxL3 && prevSummaries.length > 0) {
      const before = prevSummaries.length
      prevSummaries.length = Math.max(0, Math.floor(prevSummaries.length / 2))
      truncatedInfo.push(`L3 摘要超预算，从 ${before} 条裁剪到 ${prevSummaries.length} 条`)
      tokenEstimate = estimateTokens(
        projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
      )
    }
    if (tokenEstimate > budget && prevChapters.length > 1) {
      const before = prevChapters.length
      prevChapters.length = Math.max(1, Math.floor(prevChapters.length / 2))
      truncatedInfo.push(`L2 前章全文超预算，从 ${before} 章裁剪到 ${prevChapters.length} 章`)
      tokenEstimate = estimateTokens(
        projectBrief + currentBrief + volumeOutline + prevChapters.map((c) => c.text).join('') + JSON.stringify(prevSummaries),
      )
    }
```

</details>

#### 缺口

- 没有本次模型和长文测试。
  **影响**：可独立评估门禁和写作质量。
  **进一步探讨**：保留事实表、稿件版本和生成上下文长度。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
