# dsh-plugin-task-forge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3d35a8f](https://github.com/121212165/dsh-plugin-task-forge/tree/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-task-forge)
<!-- END META -->

> **功能**：将需求写成版本任务书，导出跨窗口交接包，记录回读、缺口答案和任务台账。

> **亮点**：把自由文本交接改成版本化任务和缺口闭环，便于指出谁读过哪版；READY自报仍不证明语义理解或字节一致。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：缺口段问题不影响parse ok；NEED-INPUT且空gaps也可能passing；全局pending可干扰无关会话，定义的queue没有在主要写路径使用，任务/ledger非事务。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 版本任务书和回读握手相对自由文本交接增加什么？](#detail-section-11)
  - [Q02 · 编译、导出、ACK、答复与上下文注入如何串联？](#detail-section-12)
  - [Q03 · ACK是否验证语义，版本和并发边界是否防串任务？](#detail-section-13)
  - [Q04 · 安装、磁盘状态、任务恢复与计价依赖怎样？](#detail-section-14)
  - [Q05 · 合格交接的成本效果和可复用工程点是什么？](#detail-section-15)
  - [Q06 · 内容摘要绑定ACK和任务作用域注入能否减少误接续，怎样采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给多AI窗口交接复杂需求的人明确目标/验收/决策和持有版本。

普通任务模板、人工回读与文件版本管理是替代；未对照实际交付的理解错误率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| forge/forge_write | 编译版本任务书 | 模型语义需人工审阅 |
| relay | 导出自包含交接文档 | 用户手工传递外部窗口 |
| ack/answer | 回读与缺口闭环 | 结构解析非语义/字节验证 |
| 台账/注入 | 查看版本与待编译事项 | 默认全局store，非会话隔离 |
| 成本预估 | 拆相提示token | 启发式/观测有标签，非账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH命令/提示/工具及运行时包 | 必需 | 编译和注入 | 加载或功能不可用 |
| 可写store/hub目录 | 持久化必需 | 任务/台账/交接包 | 部分写入须核对 |
| 人工传递和语义复核 | 办结必需 | 外部窗口接收 | 状态自报不等交付 |
| quota观测/价格 | 可选 | 成本估算 | 回退启发式且不显示金额 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份store、创建任务书 | 验收/约束完整 |
| 交接 | 用户relay并回贴目标窗口复述 | 对照正文逐项核验 |
| 验收 | 人工核对缺口/版本/实际交付 | 不依赖自动ready，漂移先修复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地存储，金额未知 | 定dataPath、备份和任务格式 | 干净依赖解析需核对 |
| 持续 | 编译/全文relay/回读token | 语义审阅、答缺口和版本同步 | 预估非账单 |
| 失败恢复 | 任务/ledger副本 | 核对双方版本与漂移 | 非事务/CAS |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 版本交接 | 自包含文档和目标ACK | 正文一致与真正理解 |
| 缺口闭环 | 答案进决策、版本更新 | READY闸门完整性 |
| 成本提示 | 区分观测/启发式 | 最终交付费用及返工减少 |

> **思考**：缺口段问题不影响parse ok；NEED-INPUT且空gaps也可能passing；全局pending可干扰无关会话，定义的queue没有在主要写路径使用，任务/ledger非事务。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把自由文本交接改成版本化任务和缺口闭环，便于指出谁读过哪版；READY自报仍不证明语义理解或字节一致。[Q01](#research-q01)、[Q02](#research-q02)

任务ID围栏、版本显示、漂移告警和缺价不造钱可借鉴；主写/台账分离及未用queue应明确收窄并发保证。[Q04](#research-q04)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

缺口段问题不影响parse ok；NEED-INPUT且空gaps也可能passing；全局pending可干扰无关会话，定义的queue没有在主要写路径使用，任务/ledger非事务。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察ACK条件和全局注入问题；可人工借鉴任务书格式，但不要将自动ready视为语义验收或允许开工的独立证明。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

版本/缺口流程由源码支持；ACK放行条件、全局注入和并发版本不支持严格无损保证；摘要绑定与作用域方案未验证。

- 已检查：作者 README、包清单、源码路径 src/plugin.ts、src/handshake.ts、src/task-cost.ts、README.md、package.json、lib/plugin.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查源/发布入口、ACK、store、注入及成本公式；未执行目标代码或跨窗口任务，不把作者自报测试当独立验证。
- 下一步：可进一步在任务副本测试缺段/空缺口NEED-INPUT/同版错文/并发写和无关会话注入，再盲评最终任务交付。

**分析版本**

- **仓库**：[121212165/dsh-plugin-task-forge](https://github.com/121212165/dsh-plugin-task-forge)
- **版本号**：0.2.0（[固定提交 3d35a8f](https://github.com/121212165/dsh-plugin-task-forge/tree/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是ID/版本/正文摘要ACK、逐验收语义映射与严格READY闸门，加项目会话作用域和版本CAS；用错文/空缺口/并发矩阵检验。[Q06](#research-q06)

可进一步在任务副本测试缺段/空缺口NEED-INPUT/同版错文/并发写和无关会话注入，再盲评最终任务交付。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1633 | 1461 | 174 | — |
| .md | source | 1 | 138 | — | — | 2634 |
| .ts | source | 8 | 1874 | 1533 | 195 | — |
| .ts | test | 9 | 1957 | 1618 | 99 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)

暂未获取：近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对版本任务书、回读握手及全局注入能否支持可靠跨窗口接续。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 版本任务书和回读握手相对自由文本交接增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在多个AI窗口/IDE传递复杂需求的人，把目标、背景、约束、验收、决策和缺口编号并存成版本任务书。相对复制长对话，增量是独立可读的任务载体、版本ACK和缺口答复闭环；交付正确仍需发送者核对接收者是否真正理解。作者“无损”“字节一致”主张比实现更强，系统没有逐字哈希回读验证，也不控制外部窗口何时开工。合格交接应是同一任务在目标窗口按约完成，READY只是接收者的结构化自报。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-26](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/README.md#L17-L26)

作者无损与握手主张。

<details>
<summary>查看原文（10行）</summary>

```text
**EN** · Compiles a rough need into a versioned task book, then hands it to any other AI window through a **read-back handshake**: `/forge` compiles, `/relay` emits, `/ack` proves the receiver got it byte-for-byte, `/answer` returns — aimed at the lossy copy-paste handoff between agents. · 61 `node --test` green · design notes in `TASK-FORGE-DESIGN.md`.

dsh 插件：**先把大白话编译成任务书，再无损交接给任意窗口的 AI**。

普通人和 AI 协作的真实瓶颈不是"不会写提示词"，而是缺一道**编译工序**：你脑子里只有一个模糊需求，直接丢给干活的 AI，它理解歪了你也不知道；换了窗口、换了 IDE，上下文全靠人肉搬运。task-forge 把这件事产品化：

1. `/forge` 把你的大白话编译成一份开源项目标准的**任务书**（目标/背景/约束/验收标准/已定决策/开放缺口，全部编号）；
2. `/relay` 导出自包含的交接包（单文件 markdown），粘贴给任何窗口的任何 AI；
3. 对方 AI 必须先**回读握手**（复述理解 + 列缺口 + `STATUS: READY`）才被允许开工——LLM 之间传东西永远有损耗，这套协议把损耗逼到明面上、几轮内逼到零；
4. `/answer` 补缺口自动版本 +1；`/forge-list` 台账总览"哪个窗口手里是哪个版本"；进行中任务注入每个新会话的系统提示。
```

</details>

**依据 2 · 作者声明**：[README.md:47-54](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/README.md#L47-L54)

命令职责和版本闭环。

```text
| 命令 | 作用 |
|---|---|
| `/forge <需求> [--mode interview]` | 编译。默认 auto：模型自己推演、暴露假设，定不了的写成编号缺口 Q1/Q2…；`--mode interview` 先出问题清单等你答完再编译。编译结果经 `forge_write` 工具落盘 |
| `/relay <id> [--to <窗口名>\|ide:<工具名>]` | 导出交接包到 `~/.dsh/task-forge/outbox/<id>-v<n>.md`，全文粘贴给对方窗口；`--to ide:zcode` 这类还会在当前项目 `<hubPath>/tasks/` 落一份同字节副本，并打印该 IDE 的接手步骤。输出还带**这份任务书预计烧多少 token**（见下） |
| `/ack <id> [--to <窗口名>] <回读全文>` | 登记对方回读：READY 放行并给该窗口盖上「确认了哪一版」；NEED-INPUT 的缺口自动登记进任务书。有多个窗口时必须带 `--to`，否则不知道该记在谁头上 |
| `/answer <id> <Q编号> <答案>` | 缺口答案写入已定决策（D 编号），版本 +1，提醒你重新 relay 新版；**interview 任务答完最后一个 Q 会自动重新注入编译指令**，不用你二次触发 |
| `/forge-list` | 台账：任务 × 版本 × 每个窗口的回读状态（`窗口A✓v2 / 窗口B◐v1 / 窗口C○`）× 缺口/决策计数 × 下一步 |
| `/forge-done <id>` | 标记完成（不再注入系统提示） |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编译、导出、ACK、答复与上下文注入如何串联？

**研究主题**：功能与机制

#### 完整回答

forge创建草稿并给模型编译指令，forge_write读取任务、合并模型字段，验证后先保存任务再append台账。relay输出自包含Markdown与目标登记，ACK解析最后一次version/STATUS并检查回读/缺口，旧版本不放行，READY但有缺口转need-input，answer把答案登记为决策并升版本。systemPrompt实时读取全局store台账与待编译前三项，加入提醒和漂移告警。它不是自动跨应用消息传输，外部窗口内容仍需用户搬运和回贴。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:639-675](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L639-L675)

模型字段合并与任务/台账顺序。

<details>
<summary>查看原文（37行）</summary>

```text
      async execute(args) {
        // task_id 是模型可控输入：先过格式校验，非法形状不触碰文件系统。
        const id = String(args.task_id ?? '').trim();
        if (!isValidTaskId(id)) return `任务编号不合法 ${id || '(空)'}。任务 id 形如 20261001-a3f2，用编译指令里给的那个。`;
        const task = store.loadTask(id);
        if (!task) return `找不到任务 ${id}。先用 /forge 建草稿，再按编译指令里的 id 调本工具。`;
        const now = new Date().toISOString();
        const questions = typeof args.questions === 'string' ? args.questions.trim() : '';
        const isInterviewRound = questions.length > 0 && !String(args.goal ?? '').trim();
        const writtenDecisions = String(args.decisions ?? task.decisions) || task.decisions;
        const preserved = isInterviewRound ? { decisions: writtenDecisions, restored: [] as string[] } : preservedAnswers(task.decisions, writtenDecisions);
        const merged: TaskBook = {
          ...task,
          title: String(args.title ?? task.title).trim() || task.title,
          goal: String(args.goal ?? task.goal) || task.goal,
          context: String(args.context ?? task.context) || task.context,
          constraints: String(args.constraints ?? task.constraints) || task.constraints,
          acceptance: String(args.acceptance ?? task.acceptance) || task.acceptance,
          decisions: preserved.decisions,
          open: (isInterviewRound ? questions : String(args.open ?? task.open)) || task.open,
          updatedAt: now,
        };
        const next = isInterviewRound ? withPhase(merged, 'awaiting-answers') : merged;
        const issues = validateTask(next);
        if (issues.length && !isInterviewRound) return `字段没过校验，未落盘：\n- ${issues.join('\n- ')}\n修好后重新调用。`;
        // model 同时给了 goal 和 questions 走的是非 interview 分支，questions
        // 会被 args.open 覆盖：明说被忽略，不静默丢弃。
        const questionsIgnored = questions.length > 0 && !isInterviewRound;
        store.saveTask(next);
        store.appendEvent({
          ts: now,
          task: next.id,
          // 编译落盘 version 不变，但事件名沿用上游的 'revised'（note 里写
          // 'compiled' 区分），台账下游都按这个名字统计。
          event: 'revised',
          version: next.version,
          status: next.status,
```

</details>

**依据 2 · 源码核查**：[src/handshake.ts:53-95](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/handshake.ts#L53-L95)

ACK结构、状态与旧版本判据。

<details>
<summary>查看原文（43行）</summary>

```text
export function parseHandshake(input: string): Handshake {
  const text = String(input ?? '');
  const issues: string[] = [];

  const statusMatch = lastMatch(STATUS_RE, text);
  const status = (statusMatch ? (statusMatch[1]!.toUpperCase().startsWith('READY') ? 'ready' : 'need-input') : null) as HandshakeStatus | null;
  if (!statusMatch) issues.push('缺少 STATUS 行（READY / NEED-INPUT）——没有明确放行，不能当握手通过');

  const versionMatch = lastMatch(VERSION_RE, text);
  const version = versionMatch ? Number.parseInt(versionMatch[1]!, 10) : null;
  if (version === null) issues.push('缺少 version 确认（接收方必须注明它读到的是哪一版）');

  const restatement = sectionAfter(text, MARKERS.restatement);
  if (!restatement) issues.push('缺少【回读】段——没有复述理解就不算确认');

  const rawGaps = sectionAfter(text, MARKERS.gaps);
  const gaps: string[] = [];
  if (!rawGaps) {
    issues.push('缺少【缺口】段');
  } else {
    for (const line of rawGaps.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean) continue;
      if (/^(无|none|没有)$/i.test(clean)) break;
      if (CHROME_RE.test(clean)) continue;
      const numbered = NUMBERED_RE.exec(clean);
      const body = (numbered ? numbered[2]! : clean.replace(/^[-*]\s*/, '')).replace(/\*\*/g, '').replace(/^[\s#]+|[\s]+$/g, '');
      if (!body || CHROME_RE.test(body)) continue;
      gaps.push(body);
    }
  }

  return { ok: status !== null && restatement !== '' && version !== null, status, version, restatement, gaps, issues };
}

/** A receiver that stamps READY while still listing questions has answered them on
 * the sender's behalf. That is not a green light — see the STATUS rule in HANDSHAKE_TEXT. */
export function needsSenderInput(hs: Handshake): boolean {
  return hs.gaps.length > 0 && (hs.status === 'need-input' || hs.status === 'ready');
}

export function isStaleVersion(hs: Handshake, current: number): boolean {
  return hs.version !== null && hs.version !== current;
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:287-334](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L287-L334)

全局待编译与系统提示注入。

<details>
<summary>查看原文（48行）</summary>

```text
  // Compile-pending tasks ride the system-prompt section — followup() proved
  // unreliable in live web runs (three drafts created, zero compiles), while
  // section injection is the family's live-verified channel.
  const compilePending = (): string => {
    const { events } = store.loadStates();
    // 'compiled' 是新名（version 不动）；'revised' 是旧名——历史台账继续可读。
    const compiled = new Set(
      events.filter((event) => event.event === 'revised' || event.event === 'compiled').map((event) => event.task),
    );
    const pending = events
      .filter((event) => event.event === 'created' && !compiled.has(event.task))
      .map((event) => event.task);
    const blocks: string[] = [];
    for (const id of pending.slice(0, 3)) {
      const task = store.loadTask(id);
      if (!task || task.status !== 'draft' || task.acceptance.trim()) continue; // only drafts pending compile
      blocks.push(
        [
          `### 待编译任务 ${id}（${task.mode === 'interview' ? 'interview' : 'auto'} 模式）`,
          `原始需求：${task.goal.slice(0, 300)}`,
          '请立即调用 forge_write 编译这个任务（task_id 用上面的 id），不要先询问用户：能定的写进 decisions，定不了的写成 open 缺口，acceptance 必须逐条编号 A1/A2…。编译完成后告诉用户 /relay 导出。',
        ].join('\n'),
      );
    }
    if (!blocks.length) return '';
    return ['## 待编译任务（task-forge）', '以下任务草稿还没有编译。逐个立即处理，全部完成后再继续回答用户的其他问题：', '', ...blocks].join('\n');
  };

  ctx.systemPrompt.section({
    name: 'task-forge',
    order: config.order,
    text: () => {
      try {
        const states = foldStates(store.loadStates().events);
        // 双权威对账：台账说一套、task.md 说另一套时当场亮出来，不再沉默漏沉。
        const alerts = driftAlerts(states, (id) => {
          if (!existsSync(store.taskPath(id))) return null;
          return store.loadTask(id);
        });
        const parts = [
          compilePending(),
          renderSection(states, { limit: config.limit, maxChars: config.maxChars }),
          ...alerts,
        ].filter(Boolean);
        return parts.join('\n\n');
      } catch (error) {
        log.warn(`task-forge section skipped: ${String(error)}`);
        return '';
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · ACK是否验证语义，版本和并发边界是否防串任务？

**研究主题**：缺陷与关键质疑

#### 完整回答

parseHandshake缺【缺口】会记issues，但ok只检查status、非空回读和version，因此缺口段缺失仍可能ok；handler据!wantsInput且版本相等设ready，并未强制status必须READY，NEED-INPUT而gaps空也可能进入passing。任何非空回读不证明目标/约束复述正确，无正文摘要也无法证明接收的确是所指版本。全局待编译指令要求先做旧草稿再回答其他问题，没有按当前会话/项目筛选，可能打断无关任务。ForgeStore queue虽定义但主要命令/forge_write路径未调用，跨进程更没有版本CAS；不能称唯一版本权威已被并发保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/handshake.ts:65-85](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/handshake.ts#L65-L85)

issues与ok条件不一致。

<details>
<summary>查看原文（21行）</summary>

```text
  const restatement = sectionAfter(text, MARKERS.restatement);
  if (!restatement) issues.push('缺少【回读】段——没有复述理解就不算确认');

  const rawGaps = sectionAfter(text, MARKERS.gaps);
  const gaps: string[] = [];
  if (!rawGaps) {
    issues.push('缺少【缺口】段');
  } else {
    for (const line of rawGaps.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean) continue;
      if (/^(无|none|没有)$/i.test(clean)) break;
      if (CHROME_RE.test(clean)) continue;
      const numbered = NUMBERED_RE.exec(clean);
      const body = (numbered ? numbered[2]! : clean.replace(/^[-*]\s*/, '')).replace(/\*\*/g, '').replace(/^[\s#]+|[\s]+$/g, '');
      if (!body || CHROME_RE.test(body)) continue;
      gaps.push(body);
    }
  }

  return { ok: status !== null && restatement !== '' && version !== null, status, version, restatement, gaps, issues };
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:436-446](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L436-L446)

passing未要求hs.status为ready。

<details>
<summary>查看原文（11行）</summary>

```text
      const hs = parseHandshake(content);
      if (!hs.ok) return { kind: 'error', text: renderAckReply(hs, task, target ?? '对方') };
      const now = new Date().toISOString();
      const wantsInput = needsSenderInput(hs);
      const passing = !wantsInput && !isStaleVersion(hs, task.version);
      if (target && !wantsInput) task.targets = withTargetAcked(task.targets, target, hs.version!, now);
      const qids = wantsInput ? nextGapQids(task, hs.gaps.length) : [];
      if (qids.length) task.open = [task.open.trim(), ...hs.gaps.map((gap, index) => `${qids[index]} (来自对方回读): ${gap}`)].filter(Boolean).join('\n');
      if (passing) task.status = 'ready';
      task.updatedAt = now;
      store.saveTask(task);
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:296-312](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L296-L312)

全局pending自动注入范围。

<details>
<summary>查看原文（17行）</summary>

```text
    const pending = events
      .filter((event) => event.event === 'created' && !compiled.has(event.task))
      .map((event) => event.task);
    const blocks: string[] = [];
    for (const id of pending.slice(0, 3)) {
      const task = store.loadTask(id);
      if (!task || task.status !== 'draft' || task.acceptance.trim()) continue; // only drafts pending compile
      blocks.push(
        [
          `### 待编译任务 ${id}（${task.mode === 'interview' ? 'interview' : 'auto'} 模式）`,
          `原始需求：${task.goal.slice(0, 300)}`,
          '请立即调用 forge_write 编译这个任务（task_id 用上面的 id），不要先询问用户：能定的写进 decisions，定不了的写成 open 缺口，acceptance 必须逐条编号 A1/A2…。编译完成后告诉用户 /relay 导出。',
        ].join('\n'),
      );
    }
    if (!blocks.length) return '';
    return ['## 待编译任务（task-forge）', '以下任务草稿还没有编译。逐个立即处理，全部完成后再继续回答用户的其他问题：', '', ...blocks].join('\n');
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:91-103](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L91-L103)

queue只是实例方法。

<details>
<summary>查看原文（13行）</summary>

```text
  /** task.md 的读改写必须整段排队执行：单实例内多窗口命令、多 dsh 进程
   * 竞争同一数据目录时，load→改→save 否则会互相覆盖（尤其 targets.push）。
   * 链式 promise 即可——失败必须被 catch 后继续，否则断链会让所有后续
   * 操作永远排队。 */
  private chain: Promise<unknown> = Promise.resolve();

  queue<T>(fn: () => T): Promise<T> {
    const next = this.chain.then(fn);
    this.chain = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
```

</details>

**依据 5 · 源码核查**：[src/plugin.ts:643-668](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L643-L668)

写工具直接load/save而不经queue或CAS。

<details>
<summary>查看原文（26行）</summary>

```text
        const task = store.loadTask(id);
        if (!task) return `找不到任务 ${id}。先用 /forge 建草稿，再按编译指令里的 id 调本工具。`;
        const now = new Date().toISOString();
        const questions = typeof args.questions === 'string' ? args.questions.trim() : '';
        const isInterviewRound = questions.length > 0 && !String(args.goal ?? '').trim();
        const writtenDecisions = String(args.decisions ?? task.decisions) || task.decisions;
        const preserved = isInterviewRound ? { decisions: writtenDecisions, restored: [] as string[] } : preservedAnswers(task.decisions, writtenDecisions);
        const merged: TaskBook = {
          ...task,
          title: String(args.title ?? task.title).trim() || task.title,
          goal: String(args.goal ?? task.goal) || task.goal,
          context: String(args.context ?? task.context) || task.context,
          constraints: String(args.constraints ?? task.constraints) || task.constraints,
          acceptance: String(args.acceptance ?? task.acceptance) || task.acceptance,
          decisions: preserved.decisions,
          open: (isInterviewRound ? questions : String(args.open ?? task.open)) || task.open,
          updatedAt: now,
        };
        const next = isInterviewRound ? withPhase(merged, 'awaiting-answers') : merged;
        const issues = validateTask(next);
        if (issues.length && !isInterviewRound) return `字段没过校验，未落盘：\n- ${issues.join('\n- ')}\n修好后重新调用。`;
        // model 同时给了 goal 和 questions 走的是非 interview 分支，questions
        // 会被 args.open 覆盖：明说被忽略，不静默丢弃。
        const questionsIgnored = questions.length > 0 && !isInterviewRound;
        store.saveTask(next);
        store.appendEvent({
```

</details>

#### 缺口

- 空缺口NEED-INPUT和同版本错误复述的真实放行未独立执行
  **影响**：握手不能充当语义和授权放行保证
  **进一步探讨**：在副本任务用缺段/空缺口/错误复述/旧版本矩阵核对状态，并比较正确交接结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、磁盘状态、任务恢复与计价依赖怎样？

**研究主题**：依赖、兼容与流程

#### 完整回答

插件运行时直接导入schemastery、dsh-tools、dsh-llm与dsh-brand，依赖宿主profile解析；声明peer仅cordis，不能从开发工作区可用推断干净分发。默认store在用户home全局task-forge目录，任务id先校验再拼路径；任务与ledger是两份状态，主文件写后日志失败可造成漂移，section有driftAlerts显示但不是自动修复事务。用户需备份任务/ledger、确认dataPath和hub输出位置，再限定目标窗口手工传递；失败先回读双方版本，避免重写覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:8-17](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L8-L17)

运行时宿主包导入。

<details>
<summary>查看原文（10行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import { brandString } from '@deepseek-ai/dsh-brand';
import type {} from '@deepseek-ai/dsh-commands';
import type {} from '@deepseek-ai/dsh-system-prompt';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:106-115](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L106-L115)

全局默认root与ID围栏。

<details>
<summary>查看原文（10行）</summary>

```text
  constructor(dataPath: string | undefined) {
    this.root = dataPath ? expandHome(dataPath) : join(homedir(), '.dsh', 'task-forge');
    this.ledgerPath = join(this.root, 'ledger.jsonl');
  }

  taskPath(id: string): string {
    // task_id 可以来自模型（forge_write）或手输命令，必须先过格式校验再
    // 拼路径；`../../` 形态的越界探测在这里被统一拒绝而不是各调用点各挡。
    if (!isValidTaskId(id)) throw new Error(`非法任务编号: ${id}（应为 YYYYMMDD-后缀）`);
    return join(this.root, 'tasks', id, 'task.md');
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:133-165](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L133-L165)

主文件与台账分开写。

<details>
<summary>查看原文（33行）</summary>

```text
  saveTask(task: TaskBook): void {
    writeAtomic(this.taskPath(task.id), renderTaskMarkdown(task));
  }

  loadStates() {
    if (!existsSync(this.ledgerPath)) return { events: [], skipped: 0 };
    return parseLedger(readFileSync(this.ledgerPath, 'utf8'));
  }

  /** Light inventory for fuzzy matching: id + title from every task book. */
  listTasks(): Array<{ id: string; title: string }> {
    const dir = join(this.root, 'tasks');
    if (!existsSync(dir)) return [];
    const out: Array<{ id: string; title: string }> = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = join(dir, entry.name, 'task.md');
      if (!existsSync(file)) continue;
      try {
        const head = readFileSync(file, 'utf8').slice(0, 400);
        const id = /\bid: (\S+)/.exec(head)?.[1];
        const title = /\btitle: (.+)/.exec(head)?.[1] ?? '';
        if (id) out.push({ id, title });
      } catch {
        // unreadable book: skip — exact-id lookup may still work
      }
    }
    return out;
  }

  appendEvent(event: Parameters<typeof eventLine>[0]): void {
    mkdirSync(dirname(this.ledgerPath), { recursive: true });
    appendFileSync(this.ledgerPath, eventLine(event) + '\n', 'utf8');
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:320-329](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L320-L329)

漂移告警而非事务修复。

<details>
<summary>查看原文（10行）</summary>

```text
        const states = foldStates(store.loadStates().events);
        // 双权威对账：台账说一套、task.md 说另一套时当场亮出来，不再沉默漏沉。
        const alerts = driftAlerts(states, (id) => {
          if (!existsSync(store.taskPath(id))) return null;
          return store.loadTask(id);
        });
        const parts = [
          compilePending(),
          renderSection(states, { limit: config.limit, maxChars: config.maxChars }),
          ...alerts,
```

</details>

#### 缺口

- 干净profile依赖闭合与任务/台账中断恢复无当前验收
  **影响**：未知安装和失败后的办结负担
  **进一步探讨**：副本目录注入save后append失败，再核对drift和手工恢复步骤

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 合格交接的成本效果和可复用工程点是什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

可借鉴稳定任务ID、显式版本/目标回读、保留已答决策和漂移告警，让缺口归属比自由文本清楚。代价是编译、全文relay、回读、反复答复和人工语义审核；多窗口都要发送完整任务书，不能仅计一次生成。cost模块清楚区分观测与字符启发式，只在有真实混合价格时显示金额，避免缺价编钱；仍使用固定执行倍数/步数，不能当未来账单承诺。以目标窗口最终按约交付为单位，没有成功率/总人工时间对照，不能宣称几轮损耗归零。

#### 证据与依据

**依据 1 · 源码核查**：[src/task-cost.ts:105-134](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/task-cost.ts#L105-L134)

成本拆相和启发/观测来源。

<details>
<summary>查看原文（30行）</summary>

```text
/** Deterministic: same text + same observations + same window count → same numbers. */
export function estimateTaskCost(input: EstimateInput): TaskCost {
  const chars = Math.max(0, input.text.length);
  const book = toTokens(chars);
  const windows = Math.max(1, Math.floor(input.windows));
  const steps = input.steps ?? [];
  const observed = steps.length > 0;
  const medOut = observed ? median(steps.map((step) => step.output)) : null;
  const medStep = observed ? median(steps.map((step) => step.input + step.output + step.cacheRead)) : null;

  const compile = book;
  const readback = medOut === null ? toTokens(chars * READBACK_FRACTION) : Math.round(medOut);
  const relayPerWindow = book;
  const relay = relayPerWindow * windows;
  const executeLow = medStep === null ? Math.round(book * EXEC_LOW_MULT) : Math.round(medStep * EXEC_LOW_STEPS);
  const executeHigh = medStep === null ? Math.round(book * EXEC_HIGH_MULT) : Math.round(medStep * EXEC_HIGH_STEPS);

  return {
    observed,
    stepCount: steps.length,
    windows,
    compile,
    readback,
    relayPerWindow,
    relay,
    executeLow,
    executeHigh,
    low: compile + readback + relay + executeLow,
    high: compile + readback + relay + executeHigh,
  };
```

</details>

**依据 2 · 源码核查**：[src/task-cost.ts:146-156](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/task-cost.ts#L146-L156)

缺价格不显示金额及估算标签。

<details>
<summary>查看原文（11行）</summary>

```text
function moneySuffix(cost: TaskCost, price?: PriceInput | null): string {
  if (!price || !price.currency || !(price.microsPerToken > 0)) return '';
  const units = (((cost.low + cost.high) / 2) * price.microsPerToken) / 1_000_000;
  return ` · ≈${units.toFixed(units < 0.01 ? 4 : 2)} ${price.currency}`;
}

/** One line for /relay. The base tail tells you whether this is 观测 or 估算. */
export function renderCostLine(cost: TaskCost, price?: PriceInput | null): string {
  const base = cost.observed ? `基于 ${cost.stepCount} 步观测` : '按字数启发式估算（无观测）';
  const phases = `编译 ${compactTokens(cost.compile)} + 回读 ${compactTokens(cost.readback)} + 交接 ${compactTokens(cost.relayPerWindow)}×${cost.windows}窗 + 执行 ${compactTokens(cost.executeLow)}–${compactTokens(cost.executeHigh)}`;
  return `这份任务书预计烧 ${compactTokens(cost.low)}–${compactTokens(cost.high)} tok（${phases}）· ${base}${moneySuffix(cost, price)}`;
```

</details>

**依据 3 · 作者声明**：[README.md:58-62](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/README.md#L58-L62)

作者明确字数近似不是分词器。

```text
派发之前先知道这一趟要烧多少。口径在 `src/task-cost.ts`（纯函数，同输入同输出）：

- **分相**：`编译`（任务书自身 token）+ `回读`（有观测就取各步 output 的中位数，没有就按任务书字数的 40%）+ `交接`（任务书 × 持有窗口数，每窗口都要重发一遍全文）+ `执行`（唯一给区间的一段：有观测按中位步长 × 6–20 步，没有就按任务书规模 × 8–18 倍）；
- **基数分两种，输出里写明是哪种**：`基于 3 步观测` 或 `按字数启发式估算（无观测）`——`tokens ≈ 字数 / 2.4` 是混合中英文的近似，**不是分词器**，别拿这个数去跟厂商对账；
- **钱只在有真实价目时出现**：单价从 quota 自己的仪表里取（`todayCostMicros / todayTokens` 的混合单价），拿不到就只报 token，不编价格；
```

#### 缺口

- 同任务自由文本与版本握手的最终交付错误率/总费用未知
  **影响**：无法确认新增回读是否值得
  **进一步探讨**：盲评相同需求在两个流程的目标/约束遗漏、修改次数、token与人工时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 内容摘要绑定ACK和任务作用域注入能否减少误接续，怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是ACK必须包含task ID、版本和正文摘要，语义复述逐验收项映射并明确缺口段；只有READY且无未解阻塞缺口才标可执行。待编译注入按项目/会话显式绑定，存储以expected version/CAS或跨进程锁保护。摘要只能证明材料一致，不能代替理解检查，新增字段/人工审核是代价。用同版本改正文、空缺口NEED-INPUT、双任务并发和无关会话矩阵检验错误放行与串任务；如果正确率没提高而负担显著增加应否定。当前先观察，仍可人工借鉴任务书格式，但不依赖自动ready或全局注入作为严格交付门禁。

#### 证据与依据

**依据 1 · 源码核查**：[src/handshake.ts:85-95](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/handshake.ts#L85-L95)

当前ACK只核对结构和版本。

<details>
<summary>查看原文（11行）</summary>

```text
  return { ok: status !== null && restatement !== '' && version !== null, status, version, restatement, gaps, issues };
}

/** A receiver that stamps READY while still listing questions has answered them on
 * the sender's behalf. That is not a green light — see the STATUS rule in HANDSHAKE_TEXT. */
export function needsSenderInput(hs: Handshake): boolean {
  return hs.gaps.length > 0 && (hs.status === 'need-input' || hs.status === 'ready');
}

export function isStaleVersion(hs: Handshake, current: number): boolean {
  return hs.version !== null && hs.version !== current;
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:436-446](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L436-L446)

状态闸门有明确改进对象。

<details>
<summary>查看原文（11行）</summary>

```text
      const hs = parseHandshake(content);
      if (!hs.ok) return { kind: 'error', text: renderAckReply(hs, task, target ?? '对方') };
      const now = new Date().toISOString();
      const wantsInput = needsSenderInput(hs);
      const passing = !wantsInput && !isStaleVersion(hs, task.version);
      if (target && !wantsInput) task.targets = withTargetAcked(task.targets, target, hs.version!, now);
      const qids = wantsInput ? nextGapQids(task, hs.gaps.length) : [];
      if (qids.length) task.open = [task.open.trim(), ...hs.gaps.map((gap, index) => `${qids[index]} (来自对方回读): ${gap}`)].filter(Boolean).join('\n');
      if (passing) task.status = 'ready';
      task.updatedAt = now;
      store.saveTask(task);
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:296-312](https://github.com/121212165/dsh-plugin-task-forge/blob/3d35a8f3c1ea1d7ac5c59574302c71511f4071d4/src/plugin.ts#L296-L312)

任务作用域绑定针对当前全局pending。

<details>
<summary>查看原文（17行）</summary>

```text
    const pending = events
      .filter((event) => event.event === 'created' && !compiled.has(event.task))
      .map((event) => event.task);
    const blocks: string[] = [];
    for (const id of pending.slice(0, 3)) {
      const task = store.loadTask(id);
      if (!task || task.status !== 'draft' || task.acceptance.trim()) continue; // only drafts pending compile
      blocks.push(
        [
          `### 待编译任务 ${id}（${task.mode === 'interview' ? 'interview' : 'auto'} 模式）`,
          `原始需求：${task.goal.slice(0, 300)}`,
          '请立即调用 forge_write 编译这个任务（task_id 用上面的 id），不要先询问用户：能定的写进 decisions，定不了的写成 open 缺口，acceptance 必须逐条编号 A1/A2…。编译完成后告诉用户 /relay 导出。',
        ].join('\n'),
      );
    }
    if (!blocks.length) return '';
    return ['## 待编译任务（task-forge）', '以下任务草稿还没有编译。逐个立即处理，全部完成后再继续回答用户的其他问题：', '', ...blocks].join('\n');
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
