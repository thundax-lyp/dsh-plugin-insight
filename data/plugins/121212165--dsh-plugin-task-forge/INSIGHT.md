# dsh-plugin-task-forge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[af8cf4f](https://github.com/121212165/dsh-plugin-task-forge/tree/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge)
<!-- END META -->

> **实现功能**：将需求组织为版本任务书，导出跨窗口交接包，并记录回读状态、缺口答案与任务台账。

> **核心亮点**：集中需求/验收/缺口和版本回读台账，改善可审阅协作接线，不证明无损理解或字节一致。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：ACK缺缺口section仍可ok、无语义/hash校验，实例队列不保证跨进程唯一版本，全局pending主动注入可串任务。详见[Q02](#research-q02)。

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
  - [Q01 · 任务书交接适合谁，主链怎样运行？](#detail-section-11)
  - [Q02 · 贡献和无损/版本/上下文边界是什么？](#detail-section-12)
  - [Q03 · 依赖、退出与三阶段成本效果怎么判断？](#detail-section-13)
  - [Q04 · 可复用工程和作用域交接收据假设如何证伪？](#detail-section-14)
  - [Q05 · 当前推荐、继续研究入口及停止条件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多个AI窗口/IDE传递复杂需求，需明确约束/验收和真实送达/结果。

人工任务书/验收清单和复制交接可替代；插件管理缺口/版本，也增加模型回读、注入与同步维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务编译 | 显式目标/验收/缺口 | 模型内容需读者审 |
| relay | 自包含文件导出 | 非自动送达/执行授权 |
| ACK/答案 | 版本状态/缺口闭环 | 格式不证明语义，缺section漏洞 |
| 全局注入 | 旧任务可见与待编译推进 | 跨会话作用域/隐私需控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.18及DSH commands/tools/systemPrompt/llm/agents | 主链必需 | 编译指令、命令、工具与上下文 | 版本契约需固定核对 |
| 可写独占dataPath | 持久必需 | task.md/outbox/ledger | 实例内队列不协调多进程 |
| 编译模型与接收窗口 | 实际任务必需 | 形成任务书/复述/执行 | 格式通过不保证理解或执行正确 |
| IDE hub/quota | 可选 | 放副本/读取历史与价目 | 估算可退化启发式，不自动有真实价格 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者独占备份目录并核对跨会话注入范围 | 未完成旧任务不得无意影响新任务 |
| 编译 | 读者审目标/约束/验收/假设与缺口 | 任务书被保存不等需求已澄清 |
| 交接 | relay导出后明确向目标窗口传递 | 文件版本/内容与读者选择一致 |
| 回读/验收 | 人工逐约束核对复述及实际产物 | READY非权限或质量证明 |
| 退出/恢复 | 标done停止注入，备份book/ledger再停用 | 卸载不清已有交接文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/profile/模型环境，金额未知 | 任务书规范、目录和窗口身份核对 | 自动编译需模型实际工作 |
| 持续使用 | 编译/回读/多窗口重复任务书及全局prompt | 澄清缺口、逐版复核与重发 | tokens≈chars/2.4及执行倍率只是启发式 |
| 失败恢复 | 版本/副本/ledger修复与任务重做 | 判断接收内容和已执行副作用 | 多文件非事务，跨进程版本可冲突 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 需求显式 | 六段任务书/编号缺口/决策 | 是否覆盖读者真实意图 |
| 交接状态 | 版本/目标回读记录与过期检查 | 语义等价、字节一致和真实送达 |
| 成本感知 | 观测/启发式区分 | 对新任务/模型真实tokens和费用误差 |

> **思考**：ACK缺缺口section仍可ok、无语义/hash校验，实例队列不保证跨进程唯一版本，全局pending主动注入可串任务。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：集中需求/验收/缺口和版本回读台账，改善可审阅协作接线，不证明无损理解或字节一致。详见[Q01](#research-q01)与[Q02](#research-q02)。

集中需求/验收/缺口和版本回读台账，改善可审阅协作接线，不证明无损理解或字节一致。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是ID校验后再构造路径、原子task写、单实例失败不中断队列、旧版检查、台账事件分类与缺口答案显式进入决策。预估区分观测/启发式并拒绝没价编钱，是适当限制；结构化协议本身仍不验证语义或授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

ACK缺缺口section仍可ok、无语义/hash校验，实例队列不保证跨进程唯一版本，全局pending主动注入可串任务。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，修ACK缺口和作用域/版本边界再评估单写者，不把READY当理解或权限证明。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持任务约束编译、relay交接、ACK格式检查和修订注入；缺口文本仍可能ACK通过，版本与作用域不能证明语义约束已被接收执行。内容hash绑定交接与逐约束确认尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/plugin.ts、src/taskbook.ts、src/handshake.ts、src/ledger.ts、package.json、src/task-cost.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定plugin存储/命令ACK/pending、handshake、taskbook版本、ledger和成本启发式；未运行模型/任务/测试，不发送窗口或审计全部IDE联动。
- 下一步：进一步探讨可用缺section、同版异文、多store与无关会话夹具，再盲评逐约束复述/产物和完整返工成本。

**分析版本**

- **仓库**：[121212165/dsh-plugin-task-forge](https://github.com/121212165/dsh-plugin-task-forge)
- **版本号**：0.2.0（[固定提交 af8cf4f](https://github.com/121212165/dsh-plugin-task-forge/tree/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨作用域/内容hash绑定交接收据，跨进程版本CAS和逐约束ACK，pending仅当前选择任务；身份/冲突维护成本未验证。详见[Q04](#research-q04)。

进一步探讨可用缺section、同版异文、多store与无关会话夹具，再盲评逐约束复述/产物和完整返工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 138 | — | — | 2634 |
| .ts | source | 8 | 1874 | 1533 | 195 | — |
| .ts | test | 9 | 1957 | 1618 | 99 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+created%3A2026-09-22T06%3A13%3A13.498Z..2026-10-22T06%3A13%3A13.498Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A13%3A13.498Z..2026-10-22T06%3A13%3A13.498Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查需求任务书/回读/缺口/版本与跨会话作用域和完整交付成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务书交接适合谁，主链怎样运行？

**研究主题：**场景与需求、功能与机制

#### 完整回答

面向在多个AI窗口/IDE间搬运复杂需求的个人协调者。输入为模糊需求、已定约束/答案和接收方回读，输出版本化task.md、交接Markdown及窗口台账。合格任务需目标一致、缺口不被替答、接收内容明确且最终产物满足验收；导出文件不等自动送达或已经授权对方开工。

/forge创建草稿并向模型注入编译指令，forge_write保存六段任务书；relay导出带版本的自包含文件，可选写IDE hub副本。ack解析version/回读/缺口/STATUS，旧版或仍有问题不ready；answer把Q答案变决策并version+1，done停止进行中注入。单实例queue串行读改写，任务文件原子rename、台账JSONL另追加。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-26](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/README.md#L21-L26)

作者编译/relay/ack/answer目标。

```text
普通人和 AI 协作的真实瓶颈不是"不会写提示词"，而是缺一道**编译工序**：你脑子里只有一个模糊需求，直接丢给干活的 AI，它理解歪了你也不知道；换了窗口、换了 IDE，上下文全靠人肉搬运。task-forge 把这件事产品化：

1. `/forge` 把你的大白话编译成一份开源项目标准的**任务书**（目标/背景/约束/验收标准/已定决策/开放缺口，全部编号）；
2. `/relay` 导出自包含的交接包（单文件 markdown），粘贴给任何窗口的任何 AI；
3. 对方 AI 必须先**回读握手**（复述理解 + 列缺口 + `STATUS: READY`）才被允许开工——LLM 之间传东西永远有损耗，这套协议把损耗逼到明面上、几轮内逼到零；
4. `/answer` 补缺口自动版本 +1；`/forge-list` 台账总览"哪个窗口手里是哪个版本"；进行中任务注入每个新会话的系统提示。
```

**依据 2 · 源码核查**：[src/plugin.ts:80-115](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L80-L115)

存储、队列与ID约束。

<details>
<summary>查看原文（36行）</summary>

```text
export function writeAtomic(dest: string, content: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, content, 'utf8');
  renameSync(tmp, dest);
}

export class ForgeStore {
  readonly root: string;
  readonly ledgerPath: string;

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
  }

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

**依据 3 · 源码核查**：[src/plugin.ts:432-460](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L432-L460)

回读判定和台账。

<details>
<summary>查看原文（29行）</summary>

```text
      // One holder needs no flag; several windows must say which one read back,
      // otherwise the per-window ledger would credit the wrong window.
      const target = toMatch?.[1] ?? (task.targets.length === 1 ? task.targets[0]!.name : null);
      const content = input.trim().slice(found.tokenLen).replace(/\s--to\s+\S+/, '').trim();
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
      // 日志里的 version 永远记任务书当前的真实版本——foldStates 是后写者
      // 胜，把对方声称的旧版本号追加成最后一行会让台账版本倒退；旧版本
      // 只留在 note 里供排查。
      store.appendEvent({
        ts: now,
        task: task.id,
        event: 'acked',
        version: task.version,
        status: passing ? 'ready' : task.status,
        title: task.title,
        target: target ?? (passing ? '握手通过' : undefined),
        note: passing
          ? undefined
          : wantsInput
```

</details>

**依据 4 · 源码核查**：[src/taskbook.ts:89-90](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/taskbook.ts#L89-L90)

版本加一。

```text
export function revise(task: TaskBook, now = new Date()): TaskBook {
  return { ...task, version: task.version + 1, updatedAt: now.toISOString() };
```

**依据 5 · 源码核查**：[src/plugin.ts:163-165](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L163-L165)

独立ledger追加。

```text
  appendEvent(event: Parameters<typeof eventLine>[0]): void {
    mkdirSync(dirname(this.ledgerPath), { recursive: true });
    appendFileSync(this.ledgerPath, eventLine(event) + '\n', 'utf8');
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和无损/版本/上下文边界是什么？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是将需求、约束、验收、决策和缺口显式编号，把回读、旧版提醒与目标窗口台账串起来；比直接复制原对话更易审阅。不能由此证明无损。parseHandshake只验证status、非空复述与版本，既不逐项比对语义，也不检查字节/hash；甚至缺【缺口】会加入issues但ok表达式不含rawGaps/所有issues，ACK仍可能继续通过。因此README所称byte-for-byte/理解损耗逼零没有实现/效果支持。

实例Promise queue只在该ForgeStore对象内串行，没有跨进程锁；version由加载值+1，同一dataPath多进程可覆盖并产生同版本不同内容，ledger最大version不恢复书本内容。task.md/outbox/ledger分步骤写也不是一致事务，坏台账行跳过需可见盘点。

进行中/待编译任务从共享目录注入各会话。待编译文本要求先处理全部旧草稿再答其他问题，可能把不相关任务与原需求送进新会话/当前模型并抢占读者意图，不能当仅被动列表。应按项目/会话作用域和明确选择处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/handshake.ts:53-85](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/handshake.ts#L53-L85)

格式判定与缺口issues不参与ok。

<details>
<summary>查看原文（33行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:436-460](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L436-L460)

ACK依赖hs.ok和gaps/版本。

<details>
<summary>查看原文（25行）</summary>

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
      // 日志里的 version 永远记任务书当前的真实版本——foldStates 是后写者
      // 胜，把对方声称的旧版本号追加成最后一行会让台账版本倒退；旧版本
      // 只留在 note 里供排查。
      store.appendEvent({
        ts: now,
        task: task.id,
        event: 'acked',
        version: task.version,
        status: passing ? 'ready' : task.status,
        title: task.title,
        target: target ?? (passing ? '握手通过' : undefined),
        note: passing
          ? undefined
          : wantsInput
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:91-104](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L91-L104)

实例内Promise链。

<details>
<summary>查看原文（14行）</summary>

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
  }
```

</details>

**依据 4 · 源码核查**：[src/taskbook.ts:89-90](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/taskbook.ts#L89-L90)

从当前值加版本。

```text
export function revise(task: TaskBook, now = new Date()): TaskBook {
  return { ...task, version: task.version + 1, updatedAt: now.toISOString() };
```

**依据 5 · 源码核查**：[src/ledger.ts:100-114](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/ledger.ts#L100-L114)

台账最大版本与后写状态。

<details>
<summary>查看原文（15行）</summary>

```text
    current.events += 1;
    current.lastAt = event.ts;
    // 版本单调不回退：多进程对同一台账追加时，旧事件晚到不应把版本拽回去
    // （status/title 仍以后写者为准）。
    if (typeof event.version === 'number' && event.version > current.version) current.version = event.version;
    if (event.status) current.status = event.status;
    if (event.title) current.title = event.title;
    if (event.note) current.lastNote = event.note;
    if (event.event === 'noted') current.notes += 1;
    if (event.target && (event.event === 'relayed' || event.event === 'acked') && !current.targets.includes(event.target)) {
      current.targets.push(event.target);
    }
    if (event.event === 'acked') {
      if (event.status === 'ready') current.acksReady += 1;
      else if (/need-input|stale/i.test(event.note ?? '')) current.acksGap += 1;
```

</details>

**依据 6 · 源码核查**：[src/plugin.ts:293-312](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L293-L312)

全局待草稿指令注入。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

#### 缺口

- 多进程同写/部分文件失败和缺口缺失ACK未做运行复现。
  **影响：**不能把队列/原子rename称跨窗口唯一版本权威或完整协议。
  **进一步探讨：**可用独占假数据和两store/两进程桩，核对同版本冲突及缺口section缺失是否会被ready。
- 接收方复述和任务产物的真实语义保真未评估。
  **影响：**格式齐全和STATUS READY不证明理解/完成质量。
  **进一步探讨：**可用已知遗漏/冲突约束的盲评交接，逐编号比较复述与实际产物，不只解析格式。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、退出与三阶段成本效果怎么判断？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

package0.2.0、Node>=22.18，Host强注入commands/tools/systemPrompt/llm/agents。IDE hub与quota仅可选联动，不自动安装，也不能从已有quota混合价推断新任务准确费用。持久目录与当前DSH_HOME不是严格绑定，默认是homedir/.dsh/task-forge，多个profile共用需谨慎。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.18及DSH commands/tools/systemPrompt/llm/agents | 主链必需 | 编译指令、命令、工具与上下文 | 版本契约需固定核对 |
| 可写独占dataPath | 持久必需 | task.md/outbox/ledger | 实例内队列不协调多进程 |
| 编译模型与接收窗口 | 实际任务必需 | 形成任务书/复述/执行 | 格式通过不保证理解或执行正确 |
| IDE hub/quota | 可选 | 放副本/读取历史与价目 | 估算可退化启发式，不自动有真实价格 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者独占备份目录并核对跨会话注入范围 | 未完成旧任务不得无意影响新任务 |
| 编译 | 读者审目标/约束/验收/假设与缺口 | 任务书被保存不等需求已澄清 |
| 交接 | relay导出后明确向目标窗口传递 | 文件版本/内容与读者选择一致 |
| 回读/验收 | 人工逐约束核对复述及实际产物 | READY非权限或质量证明 |
| 退出/恢复 | 标done停止注入，备份book/ledger再停用 | 卸载不清已有交接文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/profile/模型环境，金额未知 | 任务书规范、目录和窗口身份核对 | 自动编译需模型实际工作 |
| 持续使用 | 编译/回读/多窗口重复任务书及全局prompt | 澄清缺口、逐版复核与重发 | tokens≈chars/2.4及执行倍率只是启发式 |
| 失败恢复 | 版本/副本/ledger修复与任务重做 | 判断接收内容和已执行副作用 | 多文件非事务，跨进程版本可冲突 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 需求显式 | 六段任务书/编号缺口/决策 | 是否覆盖读者真实意图 |
| 交接状态 | 版本/目标回读记录与过期检查 | 语义等价、字节一致和真实送达 |
| 成本感知 | 观测/启发式区分 | 对新任务/模型真实tokens和费用误差 |

共同对照为同需求跨窗口完成同一验收任务，计编译、回读、重发、错误返工和最终产物，而不是版本数/确认数。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-42](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/package.json#L34-L42)

Node和构建。

```text
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "prepare": "npm run build",
    "test": "node --test \"test/*.test.ts\"",
    "typecheck": "tsc --noEmit",
    "check": "npm run typecheck && npm test && npm run build"
  },
  "keywords": [
```

**依据 2 · 源码核查**：[src/plugin.ts:49-49](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L49-L49)

硬注入服务。

```text
export const inject = ['commands', 'tools', 'systemPrompt', 'llm', 'agents'];
```

**依据 3 · 源码核查**：[src/plugin.ts:106-108](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L106-L108)

默认共享目录。

```text
  constructor(dataPath: string | undefined) {
    this.root = dataPath ? expandHome(dataPath) : join(homedir(), '.dsh', 'task-forge');
    this.ledgerPath = join(this.root, 'ledger.jsonl');
```

**依据 4 · 源码核查**：[src/task-cost.ts:10-21](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/task-cost.ts#L10-L21)

token/步骤启发式。

<details>
<summary>查看原文（12行）</summary>

```text
/** tokens ≈ chars / 2.4 for mixed 中文/ASCII text — a measured-ish approximation
 * of what our models actually bill, NOT a real tokenizer. Don't quote it to a vendor. */
export const CHARS_PER_TOKEN = 2.4;

/** a read-back restatement re-emits roughly this fraction of the book's text */
const READBACK_FRACTION = 0.4;
/** the real work spans this many observed steps, low→high (the only range) */
const EXEC_LOW_STEPS = 6;
const EXEC_HIGH_STEPS = 20;
/** with no observations, execution is guessed as this multiple of the book size */
const EXEC_LOW_MULT = 8;
const EXEC_HIGH_MULT = 18;
```

</details>

**依据 5 · 源码核查**：[src/task-cost.ts:31-35](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/task-cost.ts#L31-L35)

观测混合价口径。

```text
export interface PriceInput {
  /** ISO-ish currency tag as quota publishes it, e.g. "CNY" */
  currency: string;
  /** blended micro-units per single token; only ever derived from quota's own meter */
  microsPerToken: number;
```

#### 缺口

- 缺少真实跨窗口同任务交付质量、返工、人时、tokens和估价误差对照。
  **影响：**不能称无损或成本可准确预测。
  **进一步探讨：**可固定需求/约束与接收模型，盲评复述和产物，记录全部编译/回读/执行重做。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可复用工程和作用域交接收据假设如何证伪？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

可复用的是ID校验后再构造路径、原子task写、单实例失败不中断队列、旧版检查、台账事件分类与缺口答案显式进入决策。预估区分观测/启发式并拒绝没价编钱，是适当限制；结构化协议本身仍不验证语义或授权。

可探讨未验证的“作用域与内容绑定交接收据”。book版本绑定项目/会话/目标身份和内容hash，以跨进程比较交换保证同版本唯一；ACK要求缺口section且无错误，逐约束核对复述并明确只确认接收，不授予额外执行权限。全局pending只显示被选任务，不自动优先处理其他会话草稿。相对现在格式/版本号，它让来源/内容/作用域可追踪，代价是身份映射、冲突恢复与用户核对。可用同版本不同字节、缺缺口标记、遗漏验收、多写者和无关会话夹具，比较误放行/任务串扰和返工；若仍只看READY，应否定保真承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:111-115](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L111-L115)

ID统一校验。

```text
  taskPath(id: string): string {
    // task_id 可以来自模型（forge_write）或手输命令，必须先过格式校验再
    // 拼路径；`../../` 形态的越界探测在这里被统一拒绝而不是各调用点各挡。
    if (!isValidTaskId(id)) throw new Error(`非法任务编号: ${id}（应为 YYYYMMDD-后缀）`);
    return join(this.root, 'tasks', id, 'task.md');
```

**依据 2 · 源码核查**：[src/plugin.ts:80-104](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L80-L104)

原子文件与实例队列。

<details>
<summary>查看原文（25行）</summary>

```text
export function writeAtomic(dest: string, content: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, content, 'utf8');
  renameSync(tmp, dest);
}

export class ForgeStore {
  readonly root: string;
  readonly ledgerPath: string;

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
  }
```

</details>

**依据 3 · 源码核查**：[src/handshake.ts:53-95](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/handshake.ts#L53-L95)

格式和旧版判定。

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

**依据 4 · 源码核查**：[src/plugin.ts:293-312](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L293-L312)

作用域假设针对全局pending。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前推荐、继续研究入口及停止条件？

**研究主题：**采用判断

#### 完整回答

推荐observe。任务书和缺口/版本台账有清楚协作价值，但缺口字段不完整仍可通过、语义/字节无损口号、跨进程版本和全局主动注入影响采用边界。先修ACK/作用域/版本再评估单人单写者trial，不把READY当理解/权限或交付完成。

继续探讨可先用假需求/文件验证缺section、同版不同文与多store冲突，再用盲评需求检查复述/最终产物。出现无关草稿抢占新会话、回读漏验收仍ready、缺口被代答、同版内容不同、book/ledger不一致或外部执行范围不明时应停止派发，保留各副本盘点。Q02/Q03结果明确后再扩大，本轮未编译/发送任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/handshake.ts:68-85](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/handshake.ts#L68-L85)

缺口section与ok差异。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 2 · 源码核查**：[src/plugin.ts:293-312](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L293-L312)

全局主动pending。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:91-104](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L91-L104)

实例内队列。

<details>
<summary>查看原文（14行）</summary>

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
  }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
