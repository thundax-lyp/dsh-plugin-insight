# dsh-snapshot-manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[87656ae](https://github.com/985451842/dsh-snapshot-manager/tree/87656ae425067c06ead6addf79ad2d17286a10a3)

<!-- BEGIN META -->
[![npm 30d 1,642](https://img.shields.io/static/v1?label=npm+30d&message=1%2C642&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager)
<!-- END META -->

> **功能**：按会话轮次采集工作区快照，并提供文件恢复和对话回退入口。

> **亮点**：[Q01](#research-q01) 与 [Q04](#research-q04) 将范围内文件恢复和会话 fork 放进同一预览流程，并以计划令牌与恢复点减轻部分误操作；不代表完整事务或备份。

> **主要限制**：[Q02](#research-q02) 异步采集可能混入轮次中的写入；[Q03](#research-q03) 的默认排除和全量删除，加上 [Q05](#research-q05) 运行态未知仍可能继续，使快照不能等同完整、隔离的备份。

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
  - [Q01 · 谁需要此快照，与 Git 加手工重开会话相比新增什么？](#detail-section-11)
  - [Q02 · 快照在何时采集，内容寻址能否提供严格的轮次前一致状态？](#detail-section-12)
  - [Q03 · 文件范围和会话范围分别漏掉什么，何时会删除新文件？](#detail-section-13)
  - [Q04 · 从预览到执行和失败恢复，哪些安全措施实际接通？](#detail-section-14)
  - [Q05 · 运行态检查与锁能否阻止全部并发写入，怎样安全决定是否采用？](#detail-section-15)
  - [Q06 · 将未知运行态与采集窗口变为确认门禁能否减少错误恢复？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有独立备份的 DSH 开发者可观察如何将工作区恢复与会话分支关联，见 [Q01](#research-q01)。

Git 配合独立备份及手工重开会话是比较基线；本插件关联时间点和文件计划，但不恢复 Git 状态或完整元数据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 轮次快照 | 关联会话与工作区内容 | 异步扫描，排除项和时间窗口不保证完整 |
| 回滚预览 | 列出恢复与删除并签发令牌 | 未知路径保留；清单变化需重预览 |
| 文件恢复 | 根据计划恢复与删除 | 默认建立恢复点；未知运行态仍可能放行 |
| 会话分支 | 从指定位置 fork 并可发送输入 | 依赖 sessionController；可独立失败 |
| 事务恢复 | 中断后继续目标或回到恢复点 | 恢复点与对象须存在，故障恢复未实测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH connection | Host 路由必需 | 注册预览与恢复接口 | 缺失时接口未注册 |
| sessionController | 对话分支与运行态检查需要 | 检查活动会话、fork、发送文本 | 不可用时运行态可能未知，对话回退跳过 |
| 可写快照目录与工作区 | 文件恢复必需 | 写对象、恢复点及文件 | 写入失败可能部分恢复并需处理日志 |
| 受支持的普通文件 | 内容采集条件 | 保存范围内内容 | 排除、大文件与未知项不能视为完整备份 |
| 独立备份及 Git | 实际使用建议 | 应对范围外或不可恢复内容 | 不应只依赖插件恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在可丢弃副本中配置独立备份 | 核查工作区、排除项及重要文件 |
| 采集 | Host 在轮次开始事件后排队扫描 | 核对采集状态与时间窗口，不假设跨文件原子 |
| 预览 | 用户阅读完整恢复和删除计划 | 有未知状态或应保留文件时停止 |
| 恢复 | 用户确认后检查恢复点和执行报告 | 任一文件失败先处理事务，不继续依赖新会话 |
| 验收 | 用户比较文件哈希及原会话 | 不一致时转独立备份人工恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 对象库与备份磁盘需求未知 | 配置边界及演练 | 项目规模影响扫描 |
| 持续使用 | 每轮扫描、哈希和存储开销未知 | 核查采集失败和未知项 | 未测耗时及增长 |
| 失败恢复 | 恢复点与重复 I/O 资源未知 | 核对日志、文件哈希和会话 | 断电及并发行为未实测 |
| 退出 | 历史对象存储占用未知 | 导出必要材料及核对独立备份 | 是否可删除历史由用户决定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 内容恢复计划 | 预览摘要和对象预检 | 跨进程、故障下注入的完整性 |
| 会话分支 | 可调用宿主 fork 并报告异常 | 实际宿主时序及分支效果 |
| 存储组织 | 内容哈希对象和增量链 | 长期空间及扫描成本 |

> **思考**：[Q02](#research-q02) 异步采集可能混入轮次中的写入；[Q03](#research-q03) 的默认排除和全量删除，加上 [Q05](#research-q05) 运行态未知仍可能继续，使快照不能等同完整、隔离的备份。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q04](#research-q04) 将范围内文件恢复和会话 fork 放进同一预览流程，并以计划令牌与恢复点减轻部分误操作；不代表完整事务或备份。

[Q04](#research-q04) 令牌、对象预检、恢复点及事务日志形成分层防护；[Q02](#research-q02) 采集异步且风险计时起点存在盲区，需结合运行时验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 异步采集可能混入轮次中的写入；[Q03](#research-q03) 的默认排除和全量删除，加上 [Q05](#research-q05) 运行态未知仍可能继续，使快照不能等同完整、隔离的备份。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先在可丢弃副本检查排除项、运行态、文件哈希与独立备份；状态未知或预览异常时停止，不在重要工作区依赖单一快照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持内容寻址、计划校验和恢复事务的条件性机制；时间一致性、跨进程隔离与真实恢复未测。新的风险门禁为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/host.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查 Host 事件、扫描、差异、预览、运行态和恢复写入，包和 Client 入口；未审完所有 UI、垃圾回收及宿主实现。
- 下一步：在可丢弃项目注入队列写入、未知运行态、外部并发和恢复中断并核对哈希与会话；本次未运行目标代码、测试或宿主。

**分析版本**

- **仓库**：[985451842/dsh-snapshot-manager](https://github.com/985451842/dsh-snapshot-manager)
- **版本号**：0.3.3（[固定提交 87656ae](https://github.com/985451842/dsh-snapshot-manager/tree/87656ae425067c06ead6addf79ad2d17286a10a3)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设将准确入队时间、未知项与运行状态做成明确门禁可降低误回滚；尚未实现或验证。

在可丢弃项目注入队列写入、未知运行态、外部并发和恢复中断并核对哈希与会话；本次未运行目标代码、测试或宿主。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 5754 | 4251 | 1246 | — |
| .md | source | 1 | 337 | — | — | 7020 |
| .mjs | test | 8 | 1102 | 970 | 23 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/985451842/dsh-snapshot-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对快照时间、范围、回滚与会话分支机制，明确安全采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要此快照，与 Git 加手工重开会话相比新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 Git 和独立备份的 DSH 开发者，在多轮改动后需要回到某轮提问之前，可用该组件预览文件恢复和可选的对话分支。Host 包导出、客户端入口及 turn/start 监听表明它是双端 DSH 插件；目标快照链接工作区内容与会话序号，不依赖 Git 跟踪文件，因此覆盖范围内的未跟踪普通文件也可能进入快照。相比 Git 操作后手动找会话切点，它整合预览、恢复和 fork；但它不恢复 Git 索引或排除文件，也不保证已采集时间点正好是写入前。不能把它当完整备份或直接推断能节省多少恢复时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-9](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/README.md#L1-L9)

作者描述轮次快照、文件与对话回退。

```text
# dsh-snapshot-manager

DeepSeek Harness（DSH）桌面版插件：**会话快照 / 回滚**。

- 每个轮次**开始前**自动对工作区做一次**增量文件快照**（内容寻址存储，同一内容只存一份）——回滚语义统一为"回到本轮之前"，所以每轮只留一条快照。
- 发现连续对话最后结果不对时，可以从任一快照**回滚**：文件恢复 + 通过 `sessionController.fork(atSeq)` 把对话退回到该时点（原会话完整保留），并可把**编辑后的输入**自动发进新会话继续。
- 快照库维护：面板右上角「**清理快照垃圾**」删除孤立快照（会话日志已不存在）、回收没有任何快照引用的内容对象，并归并历史遗留的非规范化工作区索引 key。

纯 JavaScript，无构建步骤；Host 半边只用 Node 内置模块（不 import 任何 `@deepseek-ai/*` 包），Client 半边是手写的 `window.__ModuleLoader__` bundle。
```

**依据 2 · 源码核查**：[package.json:24-36](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/package.json#L24-L36)

声明 Host 和 Web Client 双端导出。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "exports": {
    ".": "./lib/host.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1756-1766](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1756-L1766)

turn/start 将采集放入队列。

<details>
<summary>查看原文（11行）</summary>

```text
    if (type === 'turn/start') {
      meta.turn = event.data?.turn ?? meta.turn;
      meta.running = true;
      if (this.config.captureOnTurnStart) {
        this.queueCapture(session, 'start', {
          seq: event.seq,
          // 「重来本轮」的干净切点：本轮之前最后一次 turn/end；首轮则为该事件前一序号。
          forkSeq: meta.lastTurnEndSeq ?? Math.max(0, event.seq - 1),
          turn: meta.turn,
        });
      }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2387-2405](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2387-L2405)

计划对快照后新建且非 unknown 的文件加入删除列表。

<details>
<summary>查看原文（19行）</summary>

```text
    // 当前索引里有、但目标快照没有跟踪过的路径 = 快照之后新建的文件。
    // 只有“目标时点明确不存在”才能删；目标时点未知的路径必须保留。
    for (const [key, cur] of currentByKey) {
      if (targetByKey.has(key)) continue;
      if (isUnderAnyKey(key, targetUnknownKeys)) {
        addUnknown(cur.rel, 'target-unknown');
        continue;
      }
      if (legacyUnknownRisk) {
        addUnknown(cur.rel, 'legacy-unknown');
        continue;
      }
      const why = currentUnknownReason(key);
      if (why !== null) {
        addUnknown(cur.rel, why);
        continue;
      }
      remove.push({ rel: cur.rel, action: 'created-after', size: cur.size });
    }
```

</details>

#### 缺口

- 未与 Git 加手工恢复进行相同任务对照
  **影响**：无法量化增加的恢复能力与操作代价
  **进一步探讨**：用可丢弃项目对照文件哈希、对话切点和人为恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照在何时采集，内容寻址能否提供严格的轮次前一致状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 监听 session/event，在 turn/start 标记运行并异步排队；采集经会话、存储及工作区内存队列执行，以该会话上个完整快照为增量基线，再扫描普通文件并按内容哈希存对象。排队和扫描并不阻塞 Agent 的写入：文件在扫描或读取时变化可能混入快照。代码用文件 mtime 记录 windowRisk，但 queueCapture 把 queuedAt 在实际获取存储队列之后才赋值，因此进入队列后到该时点之前发生的更改不一定落入提示窗口；它也不是跨文件原子快照。对象重读时重新算哈希，可保证对象标签对应读取字节，不能证明所有字节来自相同时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1651-1664](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1651-L1664)

事件监听同步调用处理器，没有等待采集完成。

<details>
<summary>查看原文（14行）</summary>

```text
    try {
      // ctx.on 返回 disposer：必须收集，否则每次热重载都会多留一份监听
      //（曾导致一次 turn/start 触发 8 次采集）。
      const listen = (event, handler) => {
        const dispose = this.ctx.on(event, handler);
        if (typeof dispose === 'function') this.listenerDisposers.push(dispose);
      };
      listen('session/event', (session, event) => {
        try {
          this.onSessionEvent(session, event);
        } catch (error) {
          this.lastError = { at: Date.now(), route: 'session/event', message: String(error?.message ?? error) };
          this.logger.warn(`处理 session/event 失败：${String(error?.message ?? error)}`);
        }
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1756-1766](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1756-L1766)

turn/start 调用 queueCapture。

<details>
<summary>查看原文（11行）</summary>

```text
    if (type === 'turn/start') {
      meta.turn = event.data?.turn ?? meta.turn;
      meta.running = true;
      if (this.config.captureOnTurnStart) {
        this.queueCapture(session, 'start', {
          seq: event.seq,
          // 「重来本轮」的干净切点：本轮之前最后一次 turn/end；首轮则为该事件前一序号。
          forkSeq: meta.lastTurnEndSeq ?? Math.max(0, event.seq - 1),
          turn: meta.turn,
        });
      }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1878-1901](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1878-L1901)

采集排队并在进入存储任务时才设置 queuedAt。

<details>
<summary>查看原文（24行）</summary>

```text
  queueCapture(session, phase, info) {
    const previous = this.queues.get(session.id) ?? Promise.resolve();
    const next = previous
      .catch(() => undefined)
      // 先按会话串行，再按存储串行，最后按工作区串行：
      // 同一 cwd 的多个会话不能同时扫/写索引，维护操作也不能和采集交错。
      //
      // cwd 必须在**真正执行时**读取：入队到执行之间会话可能被 /cd 切走，
      // 拿入队时的旧目录加锁会锁错工作区（扫描用的却是新目录）。
      .then(() => this.withStore(() => {
        const cwd = session?.header?.cwd;
        const detail = { ...info, queuedAt: Date.now() };
        return typeof cwd === 'string' && cwd.length > 0
          ? this.withWorkspace(cwd, () => this.capture(session, phase, detail))
          : this.capture(session, phase, detail);
      }))
      .catch((error) => {
        const message = String(error?.message ?? error);
        this.lastError = { at: Date.now(), route: `capture:${phase}`, sessionId: session.id, message };
        this.logger.warn(`采集失败（${phase}）：${message}`);
        return undefined;
      });
    this.queues.set(session.id, next);
    return next;
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1911-1939](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1911-L1939)

采集以同会话前一完整树为基线。

<details>
<summary>查看原文（29行）</summary>

```text
  async capture(session, phase, info = {}) {
    // 阶段会进入记录 id → 文件名；来自 HTTP 的任意字符串必须先收敛到白名单。
    phase = normalizePhase(phase);
    const cwd = session?.header?.cwd;
    if (typeof cwd !== 'string' || cwd.length === 0) throw new Error('该会话没有工作目录，跳过采集');
    const origin = session?.header?.origin;
    const depth = session?.header?.delegationDepth ?? 0;
    if (origin === 'subagent' || depth > 0) throw new Error('子代理会话不采集');

    const meta = this.metaFor(session);
    const startedAt = Date.now();
    const queuedAt = Number.isSafeInteger(info.queuedAt) ? info.queuedAt : startedAt;
    const workspaceKey = workspaceKeyOf(cwd);
    const snapshots = await this.store.listSnapshots(session.id);
    const last = snapshots.length > 0 ? snapshots[snapshots.length - 1] : undefined;

    // 上一条快照的完整路径表：增量差异必须相对它，而不是相对全局工作区索引。
    // 链断了（历史 trim/删除造成）时不能拿残缺树当基线，改为写一条新的 full 基座。
    let previousTree = null;
    let chainRepaired = false;
    if (last !== undefined) {
      const infoTree = this.store.resolveTreeInfo(snapshots, last.id);
      if (infoTree.complete) previousTree = infoTree.tree;
      else {
        chainRepaired = true;
        this.logger.warn(
          `会话 ${session.id} 的快照链不完整（${String(infoTree.reason)}），将为下一条快照重建 full 基座`,
        );
      }
```

</details>

**依据 5 · 源码核查**：[lib/host.js:2047-2087](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2047-L2087)

文件重读后重算内容哈希并保存对象。

<details>
<summary>查看原文（41行）</summary>

```text
    // 落对象：本次快照引用到的当前内容必须真的存在于对象库。
    // 顺便用“读到的字节”重新算哈希：扫描与读盘之间文件变了时，以实际内容为准，
    // 避免把新字节存到旧哈希名下（旧实现会静默产生不可校验的对象）。
    const currentRelByKey = new Map();
    for (const rel of Object.keys(index.entries)) currentRelByKey.set(pathKeyOf(rel), rel);
    let objectsWritten = 0;
    const referenced = full
      ? Object.keys(index.entries).map((rel) => [rel, index.entries[rel].hash])
      : Object.entries(effectiveChanges).filter(([, hash]) => typeof hash === 'string');
    for (const [rel, hash] of referenced) {
      const objectPath = join(this.config.root, 'objects', hash.slice(0, 2), hash);
      const before = await stat(objectPath).catch(() => undefined);
      if (before !== undefined && before.isFile()) continue;
      // 增量变更的 key 可能沿用上一条快照的写法（大小写不同），读盘时要用当前实际路径。
      const currentRel = currentRelByKey.get(pathKeyOf(rel)) ?? rel;
      let bytes;
      try {
        bytes = await readFileWithRetry(join(cwd, currentRel));
      } catch (error) {
        if (error?.code === 'ENOENT') {
          // 扫描之后被删了：按“此刻不存在”记录，避免快照引用一个不存在的对象。
          delete index.entries[currentRel];
          if (full) delete effectiveChanges[rel];
          else effectiveChanges[rel] = null;
          delete effectiveUnknown[rel];
          continue;
        }
        throw new Error(`采集失败：无法读取 ${currentRel}（${String(error?.message ?? error)}）`);
      }
      const actual = hashBytes(bytes);
      if (full) {
        effectiveChanges[rel] = actual;
      } else if (previousTree[rel] === actual) {
        // 读盘时已经回到上一条快照的内容，这条差异可以撤销。
        delete effectiveChanges[rel];
      } else {
        effectiveChanges[rel] = actual;
      }
      index.entries[currentRel] = { ...(index.entries[currentRel] ?? {}), hash: actual, size: bytes.length };
      await this.store.putObject(actual, bytes);
      objectsWritten += 1;
```

</details>

**依据 6 · 源码核查**：[lib/host.js:2090-2102](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2090-L2102)

风险以 mtime 与 queuedAt 比较，仅记录提示。

<details>
<summary>查看原文（13行）</summary>

```text
    // 捕获窗口风险：采集触发之后仍有 mtime 更新的文件，说明本轮改动可能已经混进
    // “本轮之前”的快照。只做提示，不假装能消除这个窗口。
    const windowRisk = [];
    for (const [rel, entry] of Object.entries(index.entries)) {
      if (entry.mtimeMs >= queuedAt && windowRisk.length < 50) windowRisk.push(rel);
    }
    const effectiveStats = {
      ...stats,
      changed: Object.keys(effectiveChanges).length,
      unknown: Object.keys(effectiveUnknown).length,
      unknownDirs: scannedUnknownDirs.length,
      windowRisk: windowRisk.length,
    };
```

</details>

#### 缺口

- 宿主是否会在采集结束前开始修改及各文件系统时间精度未实测
  **影响**：无法确定混入窗口和提示漏报概率
  **进一步探讨**：控制队列等待并在开始事件后修改文件，对比快照字节、时间记录和风险提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件范围和会话范围分别漏掉什么，何时会删除新文件？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认扫描排除 .git、构建和依赖目录及多种二进制扩展，单文件默认 8 MiB；符号链接、超限、不可读路径和不可读目录记录为 unknown，目标或当前状态未知时尽量跳过，不将其当作肯定不存在。旧 v1 只有跳过统计且缺少逐路径记录时，计划采取保守删除策略。全量计划仍会把可扫描、目标时点明确不存在的新文件放入删除清单。所谓仅本会话修改范围从 write、edit 和部分 str_replace_editor 调用记录路径，无法完整识别 shell、构建和子代理带来的修改。Git 分支与索引、文件权限与时间等元数据也不在快照恢复范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:69-83](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L69-L83)

默认排除目录及扩展名。

<details>
<summary>查看原文（15行）</summary>

```text
/** 默认排除的目录名（按路径段精确匹配，大小写不敏感）。 */
export const DEFAULT_EXCLUDES = [
  '.git', '.hg', '.svn', '.idea', '.vscode', '.vs',
  'node_modules', 'bower_components', 'vendor',
  'target', 'build', 'dist', 'out', 'output', 'bin', 'obj',
  '.gradle', '.gradle-user-home', '.next', '.nuxt', '.cache',
  'coverage', '__pycache__', '.venv', 'venv', '.dsh-probe',
];

/** 默认不采集的扩展名（体积大且通常不是源码/配置）。 */
export const DEFAULT_EXCLUDE_EXTENSIONS = [
  '.zip', '.7z', '.rar', '.gz', '.tar', '.jar', '.war', '.class',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.iso', '.img', '.pdb',
  '.mp4', '.mov', '.avi', '.mkv', '.mp3', '.wav', '.psd', '.ai', '.sketch',
];
```

</details>

**依据 2 · 源码核查**：[lib/host.js:124-140](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L124-L140)

大小上限及扫描配置。

<details>
<summary>查看原文（17行）</summary>

```text
export function resolveConfig(config = {}) {
  const dshHome = resolveDshHome(config);
  const int = (value, fallback, min = 1) => (Number.isSafeInteger(value) && value >= min ? value : fallback);
  const list = (value, fallback) =>
    Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.length > 0) : fallback;

  return {
    dshHome,
    root: typeof config.root === 'string' && config.root.trim().length > 0
      ? config.root.trim()
      : join(dshHome, 'snapshot-manager'),
    captureOnTurnStart: config.captureOnTurnStart !== false,
    captureOnTurnEnd: config.captureOnTurnEnd !== false,
    maxFileBytes: int(config.maxFileBytes, 8 * 1024 * 1024),
    maxFilesPerSnapshot: int(config.maxFilesPerSnapshot, 20000),
    excludes: list(config.excludes, DEFAULT_EXCLUDES),
    excludeExtensions: list(config.excludeExtensions, DEFAULT_EXCLUDE_EXTENSIONS),
```

</details>

**依据 3 · 源码核查**：[lib/host.js:479-490](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L479-L490)

未知内容路径与目录单独记录。

<details>
<summary>查看原文（12行）</summary>

```text
  const entries = {};
  const changes = {};
  /**
   * 本次扫描遇到、但**没有可靠内容哈希**的路径：符号链接、超大文件、stat/read 失败、
   * 非普通文件，以及 readdir 失败的目录。
   *
   * 这些路径不能简单地从索引里省略：省略会被 capture 解释成「已经不存在」，
   * 回滚时就会把仍然存在的文件删掉。记录成 unknown 后，回滚对这些路径只提示、不动手。
   */
  const unknown = {};
  /** readdir 失败的目录（相对路径；'' 表示工作区根）。 */
  const unreadableDirs = [];
```

</details>

**依据 4 · 源码核查**：[lib/host.js:530-550](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L530-L550)

排除与符号链接、非普通文件处理。

<details>
<summary>查看原文（21行）</summary>

```text
      if (isExcluded(rel, excludes, exts)) {
        excluded += 1;
        skipped += 1;
        if (excludedSamples.length < 20) excludedSamples.push(rel);
        continue;
      }
      if (dirent.isSymbolicLink()) {
        symlinks += 1;
        skipped += 1;
        unknown[rel] = 'symlink';
        if (symlinkSamples.length < 20) symlinkSamples.push(rel);
        continue;
      }
      if (dirent.isDirectory()) {
        dirs.add(rel);
        stack.push(rel);
        continue;
      }
      if (!dirent.isFile()) {
        skipped += 1;
        unknown[rel] = 'not-a-file';
```

</details>

**依据 5 · 源码核查**：[lib/host.js:302-328](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L302-L328)

会话 journal 只识别的写入工具。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * 从一次工具调用里取出它要**修改**的文件路径（绝对路径）；不改文件则返回 null。
 *
 * 覆盖三类写文件工具：
 *   - `write` / `edit`：参数为 `file_path`；
 *   - `str_replace_editor`：参数为 `path`，且只有 `create`/`str_replace`/`insert` 会落盘，
 *     `view` 是只读（DSH 自己的产出记录也是这么判定的）。
 * 注意：`read` 有 `file_path` 但只读，故意不在此列。
 * @param {string} toolName - event.data.name。
 * @param {string} raw - event.data.arguments（JSON 字符串）。
 * @returns {string|null} 绝对路径或 null。
 */
function extractMutationPath(toolName, raw) {
  if (toolName === 'write' || toolName === 'edit') return extractFilePath(raw, 'file_path');
  if (toolName === 'str_replace_editor') {
    const command = /"command"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(typeof raw === 'string' ? raw : '');
    if (command === null) return null;
    let value;
    try {
      value = JSON.parse(`"${command[1]}"`);
    } catch {
      return null;
    }
    if (value !== 'create' && value !== 'str_replace' && value !== 'insert') return null;
    return extractFilePath(raw, 'path');
  }
  return null;
```

</details>

**依据 6 · 源码核查**：[lib/host.js:2258-2277](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2258-L2277)

链完整性和旧快照保守策略。

<details>
<summary>查看原文（20行）</summary>

```text
    const treeInfo = this.store.resolveTreeInfo(snapshots, target);
    if (!treeInfo.complete) {
      throw new Error(
        `快照链不完整（${String(treeInfo.reason)}），已拒绝回滚。`
        + '请先清理该会话的旧快照，或换一个更近的快照；不要用残缺链执行回滚。',
      );
    }
    const tree = treeInfo.tree;
    const targetUnknown = treeInfo.unknown ?? {};
    const targetUnknownDirs = Array.isArray(treeInfo.unknownDirs) ? treeInfo.unknownDirs : [];
    /**
     * v1 快照没有 unknown 字段，无法区分“当时不存在”和“当时因超限/占用/链接未采集”。
     * 只要该快照的统计里出现过这些跳过项，就按保守策略处理：不删除目标为 null 的路径，
     * 也不把当前多出来的路径当成 created-after；宁可留下文件并提示，也不静默误删。
     */
    const legacyUnknownRisk = record.v !== 2 && (
      (Number(record.stats?.symlinks) || 0)
      + (Number(record.stats?.oversized) || 0)
      + (Number(record.stats?.unreadable) || 0)
    ) > 0;
```

</details>

**依据 7 · 源码核查**：[lib/host.js:2387-2405](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2387-L2405)

目标明确不存在时生成新文件删除项。

<details>
<summary>查看原文（19行）</summary>

```text
    // 当前索引里有、但目标快照没有跟踪过的路径 = 快照之后新建的文件。
    // 只有“目标时点明确不存在”才能删；目标时点未知的路径必须保留。
    for (const [key, cur] of currentByKey) {
      if (targetByKey.has(key)) continue;
      if (isUnderAnyKey(key, targetUnknownKeys)) {
        addUnknown(cur.rel, 'target-unknown');
        continue;
      }
      if (legacyUnknownRisk) {
        addUnknown(cur.rel, 'legacy-unknown');
        continue;
      }
      const why = currentUnknownReason(key);
      if (why !== null) {
        addUnknown(cur.rel, why);
        continue;
      }
      remove.push({ rel: cur.rel, action: 'created-after', size: cur.size });
    }
```

</details>

**依据 8 · 作者声明**：[README.md:20-22](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/README.md#L20-L22)

作者说明 journal、Git 和元数据边界。

```text
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。
```

#### 缺口

- 实际项目中哪些路径被排除或状态未知取决于文件和配置
  **影响**：无法假设目标项目可完整恢复
  **进一步探讨**：先在可丢弃副本检查预览及完整排除项，并用独立备份核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从预览到执行和失败恢复，哪些安全措施实际接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

预览构造完整计划并签发绑定会话、快照和两个文件范围摘要的一次性令牌；执行重新生成计划并比较选定范围摘要，变动或令牌过期会拒绝。写入前对所需对象逐一读取和校验哈希，默认先创建回滚前恢复点，写事务日志，再按删除、清空空目录、恢复顺序处理；路径经词法和 realpath 守卫，单文件用临时文件和 rename。部分文件失败被报告并阻止对话 fork，可用事务恢复入口继续或回到恢复点。对话 fork 是额外步骤，可能因宿主服务缺失或调用错误失败；写入与 fork 不是一个原子事务。fsync 失败被忽略，不能据源码声称断电后绝不丢失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1395-1444](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1395-L1444)

令牌绑定完整计划摘要、身份、有效期和单次使用。

<details>
<summary>查看原文（50行）</summary>

```text
  issuePlanToken(plan) {
    this.prunePlanTokens();
    const token = randomUUID();
    const now = Date.now();
    this.planTokens.set(token, {
      token,
      sessionId: plan.sessionId,
      snapshotId: plan.snapshotId,
      hashes: {
        all: planHashFor(plan, 'all'),
        session: planHashFor(plan, 'session'),
      },
      createdAt: now,
      expiresAt: now + PLAN_TOKEN_TTL_MS,
      used: false,
    });
    return token;
  }

  /**
   * 校验并消费一个计划令牌。
   *
   * 令牌绑定完整计划摘要：预览之后工作区又变了，摘要对不上就拒绝执行，
   * 而不是让用户“确认了 A、实际执行 B”。令牌只用一次。
   * @param {string} token - 令牌。
   * @param {{sessionId: string, snapshotId: string, scope: 'all'|'session', files: boolean}} expected - 期望绑定。
   * @param {{all: string, session: string}} [actualHashes] - 重新 buildPlan 后的实际计划摘要。
   * @returns {object} 令牌记录。
   */
  consumePlanToken(token, expected, actualHashes) {
    if (typeof token !== 'string' || token.length === 0) {
      throw new Error('缺少 planToken：请先预览并确认回滚清单');
    }
    this.prunePlanTokens();
    const entry = this.planTokens.get(token);
    if (entry === undefined) throw new Error('回滚确认令牌无效或已过期，请重新预览');
    if (entry.used) throw new Error('回滚确认令牌已使用过，请重新预览');
    if (entry.expiresAt <= Date.now()) throw new Error('回滚确认令牌已过期，请重新预览');
    if (entry.sessionId !== expected.sessionId || entry.snapshotId !== expected.snapshotId) {
      throw new Error('回滚确认令牌与目标快照不匹配，请重新预览');
    }
    if (expected.files === true) {
      const wanted = entry.hashes[expected.scope] ?? '';
      const actual = actualHashes?.[expected.scope] ?? '';
      if (wanted.length === 0 || actual.length === 0 || wanted !== actual) {
        throw new Error('工作区在预览之后已发生变化，计划清单不再一致：请重新预览并确认');
      }
    }
    entry.used = true;
    return entry;
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2690-2707](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2690-L2707)

执行前读取对象并核对哈希。

<details>
<summary>查看原文（18行）</summary>

```text
  async verifyRestoreObjects(restoreList) {
    const hashes = [...new Set(
      (Array.isArray(restoreList) ? restoreList : [])
        .map((item) => item?.hash)
        .filter((hash) => typeof hash === 'string' && hash.length > 0),
    )];
    const missing = [];
    const corrupt = [];
    for (const hash of hashes) {
      try {
        const bytes = await this.store.getObject(hash);
        if (hashBytes(bytes) !== hash) corrupt.push(hash);
      } catch (error) {
        if (error?.code === 'ENOENT') missing.push(hash);
        else corrupt.push(hash);
      }
    }
    return { missing, corrupt };
```

</details>

**依据 3 · 源码核查**：[lib/host.js:2716-2767](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2716-L2767)

重建计划、检查状态及消费令牌。

<details>
<summary>查看原文（52行）</summary>

```text
  async restoreLocked(request, cwd) {
    const sessionId = String(request.sessionId ?? '');
    const plan = await this.buildPlan(sessionId, request.snapshotId);
    const doFiles = request.files !== false;
    let doConversation = request.conversation === true;
    if (!doFiles && !doConversation) throw new Error('files 与 conversation 不能同时为否');
    // 文件恢复范围：默认全量；只有显式 'session' 才收窄。
    const scope = request.scope === 'session' ? 'session' : 'all';

    if (request.dryRun === true) {
      const planToken = this.issuePlanToken(plan);
      return { dryRun: true, plan: { ...this.displayPlan(plan), planToken } };
    }

    // 对象缺失/损坏时必须在动任何文件之前拒绝：否则先删掉“快照后新建”的文件，
    // 到写回缺失对象时才失败，工作区会停在半完成状态。
    const selectedRestore = scope === 'session' ? plan.sessionScope.restore : plan.restore;
    const objectCheck = await this.verifyRestoreObjects(selectedRestore);
    if (objectCheck.missing.length > 0 || objectCheck.corrupt.length > 0) {
      const parts = [];
      if (objectCheck.missing.length > 0) parts.push(`缺失 ${objectCheck.missing.length} 个`);
      if (objectCheck.corrupt.length > 0) parts.push(`损坏 ${objectCheck.corrupt.length} 个`);
      throw new Error(
        `快照对象${parts.join('、')}，已拒绝回滚；文件尚未改动。`
        + '请检查快照存储（objects 目录）是否完整，或换一个快照。',
      );
    }

    // 运行中的会话直接拒绝回滚：文件恢复会和当前轮的工具写入互相踩。
    // 这里用“事件流 + sessionController.list”双重检测；即使面板已经打开，
    // 服务端也会在真正执行前再拦一次。
    const runningNow = await this.detectRunning(sessionId);
    if (runningNow.state === true) throw new Error(this.runningError(runningNow));
    const busyNow = await this.detectWorkspaceBusy(cwd, sessionId);
    if (busyNow.length > 0) {
      const ids = busyNow.slice(0, 3).map((item) => item.sessionId).join('、');
      throw new Error(
        `同一工作区还有 ${busyNow.length} 个会话正在运行（${ids}${busyNow.length > 3 ? '…' : ''}），`
        + '已拒绝回滚：请先等它们结束（turn/end）后再试，避免互相覆盖文件。',
      );
    }

    const actualHashes = {
      all: planHashFor(plan, 'all'),
      session: planHashFor(plan, 'session'),
    };
    this.consumePlanToken(request.planToken, {
      sessionId,
      snapshotId: plan.snapshotId,
      scope,
      files: doFiles,
    }, actualHashes);
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2790-2811](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2790-L2811)

默认恢复点失败则中止。

<details>
<summary>查看原文（22行）</summary>

```text
      //    以前失败只 warning 然后继续，等于在“没有后悔药”的情况下改文件；
      //    现在默认生成失败就中止（显式 recoveryPoint:false 才允许跳过）。
      if (request.recoveryPoint !== false) {
        try {
          const recovery = await this.capture(
            { id: sessionId, header: { cwd: plan.cwd } },
            'pre-rollback',
            {
              seq: null,
              forkSeq: null,
              turn: null,
              queuedAt: Date.now(),
              rollbackOf: plan.snapshotId,
              label: `回滚前自动恢复点（${plan.snapshotId}）`,
              // 正在回滚的目标快照不能被这次恢复点采集顺带 trim 掉，
              // 否则中断后 resume 找不到目标记录。
              skipTrim: true,
            },
          );
          report.recoveryPoint = recovery.record.id;
        } catch (error) {
          throw new Error(`无法生成回滚前恢复点，已中止回滚：${String(error?.message ?? error)}`);
```

</details>

**依据 5 · 源码核查**：[lib/host.js:2823-2879](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2823-L2879)

创建事务、应用文件并记录部分失败。

<details>
<summary>查看原文（57行）</summary>

```text
      const filePlan = scope === 'session'
        ? { restore: plan.sessionScope.restore, remove: plan.sessionScope.remove, pruneDirs: plan.sessionScope.pruneDirs ?? [] }
        : { restore: plan.restore, remove: plan.remove, pruneDirs: plan.pruneDirs ?? [] };

      const tx = {
        id: this.nextRestoreId(),
        sessionId,
        snapshotId: plan.snapshotId,
        preRollbackId: report.recoveryPoint,
        scope,
        status: 'in-progress',
        startedAt: Date.now(),
        cwd: plan.cwd,
        files: true,
        conversation: doConversation,
        plan: {
          restore: filePlan.restore.length,
          remove: filePlan.remove.length,
          dirs: filePlan.pruneDirs.length,
        },
      };
      await this.writeRestoreTx(tx);
      report.transactionId = tx.id;

      try {
        report.files = await this.applyFilePlan(plan, scope, { sessionId });
        if (report.files.escapedCount > 0) {
          report.warnings.push(`有 ${report.files.escapedCount} 个路径未通过真实路径校验，已跳过（不写入、不删除）`);
        }
        try {
          const previousIndex = await this.store.readIndex(workspaceKeyOf(plan.cwd));
          const { index } = await scanWorkspace({ cwd: plan.cwd, config: this.config, previousIndex });
          await this.store.writeIndex(workspaceKeyOf(plan.cwd), index);
        } catch (error) {
          report.warnings.push(`刷新索引失败：${String(error?.message ?? error)}`);
        }
        tx.status = report.files.failed > 0 ? 'partial' : 'done';
        tx.finishedAt = Date.now();
        tx.report = {
          restored: report.files.restored,
          removed: report.files.removed,
          failed: report.files.failed,
          dirsRemoved: report.files.dirsRemoved,
        };
        await this.writeRestoreTx(tx);
      } catch (error) {
        tx.status = 'failed';
        tx.finishedAt = Date.now();
        tx.error = String(error?.message ?? error);
        await this.writeRestoreTx(tx).catch(() => undefined);
        throw error;
      }

      if (report.files.failed > 0) {
        report.warnings.push(
          `有 ${report.files.failed} 个文件恢复失败；${report.recoveryPoint ? `可回到回滚前恢复点 ${report.recoveryPoint}` : '未生成恢复点'}`,
        );
```

</details>

**依据 6 · 源码核查**：[lib/host.js:2883-2925](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2883-L2925)

文件失败跳过 fork，fork 和 prompt 异常分别报告。

<details>
<summary>查看原文（43行）</summary>

```text
    // 文件恢复不完整时不再 fork：否则新会话会基于一个半完成的工作区继续，用户却以为两边都成功了。
    if (doConversation && report.files !== null && report.files.failed > 0) {
      doConversation = false;
      report.warnings.push('文件恢复有失败，已跳过对话回退；请先处理失败项再重试对话回退');
    }
    const liveCwd = this.meta.get(sessionId)?.cwd;
    if (doConversation && typeof liveCwd === 'string' && liveCwd.length > 0
      && normalizeWorkspacePath(liveCwd) !== normalizeWorkspacePath(plan.cwd)) {
      doConversation = false;
      report.warnings.push('会话工作区已与目标快照不同，已跳过对话回退（避免新会话使用错误目录）');
    }
    if (doFiles && !doConversation) {
      report.warnings.push('本次只恢复文件，对话不会回退；原会话保持不变');
    } else if (!doFiles && doConversation) {
      report.warnings.push('本次只回退对话，文件不会变化；新会话可能看到被撤销轮次改动后的文件');
    }

    if (doConversation) {
      const controller = typeof this.ctx.get === 'function' ? this.ctx.get('sessionController') : undefined;
      if (controller === undefined || controller === null || typeof controller.fork !== 'function') {
        report.warnings.push('sessionController 不可用，未执行对话回退');
      } else {
        const atSeq = Number.isSafeInteger(plan.forkSeq) ? plan.forkSeq : undefined;
        try {
          const fork = await controller.fork(atSeq === undefined ? { sessionId } : { sessionId, atSeq });
          const childSessionId = fork?.sessionId ?? null;
          report.conversation = { childSessionId, atSeq: atSeq ?? null };
          if (childSessionId !== null && typeof request.promptText === 'string' && request.promptText.trim().length > 0) {
            try {
              const receipt = await controller.prompt({
                requestId: `snapshot-manager-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
                sessionId: childSessionId,
                mode: 'queue',
                content: [{ type: 'text', text: request.promptText }],
              }, new AbortController().signal);
              report.prompt = { accepted: receipt?.accepted === true };
            } catch (error) {
              report.warnings.push(`把消息发进新会话失败：${String(error?.message ?? error)}`);
            }
          }
        } catch (error) {
          report.warnings.push(`fork 失败：${String(error?.message ?? error)}`);
        }
```

</details>

**依据 7 · 源码核查**：[lib/host.js:887-908](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L887-L908)

同目录临时写入、尽力 fsync 和 rename。

<details>
<summary>查看原文（22行）</summary>

```text
async function writeFileAtomic(file, bytes) {
  await mkdir(dirname(file), { recursive: true });
  const seq = (writeJsonSeq += 1);
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}-${seq}`;
  let handle;
  try {
    handle = await open(tmp, 'w');
    await handle.writeFile(bytes);
    try {
      await handle.sync();
    } catch {
      /* 某些文件系统/网络盘不支持 fsync；不因此让写入失败 */
    }
  } finally {
    try {
      await handle?.close();
    } catch {
      /* 忽略 */
    }
  }
  try {
    await rename(tmp, file);
```

</details>

**依据 8 · 源码核查**：[lib/host.js:3043-3072](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L3043-L3072)

恢复事务重新规划和校验。

<details>
<summary>查看原文（30行）</summary>

```text
  async recover(id, action) {
    const tx = await this.readRestoreTx(id);
    if (tx === null) throw new Error('找不到该回滚事务');
    if (!['in-progress', 'interrupted', 'partial', 'failed'].includes(tx.status)) {
      throw new Error(`该事务当前状态为 ${String(tx.status)}，无需恢复`);
    }
    const target = action === 'revert' ? tx.preRollbackId : tx.snapshotId;
    if (action !== 'resume' && action !== 'revert') throw new Error('action 只能是 resume 或 revert');
    if (typeof target !== 'string' || target.length === 0) {
      throw new Error(action === 'revert' ? '该事务没有回滚前恢复点，无法 revert' : '该事务缺少目标快照');
    }
    const running = await this.detectRunning(tx.sessionId);
    if (running.state === true) throw new Error(this.runningError(running));
    return this.withStore(() => this.withWorkspace(tx.cwd, async () => {
      const plan = await this.buildPlan(tx.sessionId, target);
      const selectedRestore = tx.scope === 'session' ? plan.sessionScope.restore : plan.restore;
      const objectCheck = await this.verifyRestoreObjects(selectedRestore);
      if (objectCheck.missing.length > 0 || objectCheck.corrupt.length > 0) {
        throw new Error(
          `快照对象缺失/损坏（缺失 ${objectCheck.missing.length}、损坏 ${objectCheck.corrupt.length}），`
          + '已拒绝恢复；文件尚未改动',
        );
      }
      const runningNow = await this.detectRunning(tx.sessionId);
      if (runningNow.state === true) throw new Error(this.runningError(runningNow));
      const busyNow = await this.detectWorkspaceBusy(tx.cwd, tx.sessionId);
      if (busyNow.length > 0) {
        throw new Error('同一工作区还有其他会话正在运行，已拒绝恢复；请先等它们结束后再重试');
      }
      const files = await this.applyFilePlan(plan, tx.scope === 'session' ? 'session' : 'all', { sessionId: tx.sessionId });
```

</details>

#### 缺口

- 中断、电源故障及系统兼容未执行验证
  **影响**：无法保证事务恢复和文件持久性
  **进一步探讨**：在隔离工作区按删除、写入、日志及 fork 阶段注入终止并核查恢复副本和文件哈希。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 运行态检查与锁能否阻止全部并发写入，怎样安全决定是否采用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

执行前读取目标会话的事件态与 controller.list，并检查同 cwd 的已知其他运行会话，任何明确运行中都会拒绝；如果目标状态未知则只比较 state === true，仍可能继续，同工作区 list 不可用也只剩已见事件。队列是本服务内存中的 Promise 串行，不是跨进程文件锁；外部编辑、未知会话或其他进程仍可在预览、恢复点和逐文件写入之间修改文件。首次成本包括边界配置、独立备份和演练，持续成本包括逐轮扫描、哈希和磁盘对象；恢复要审阅删除列表与失败报告。由于全量恢复可能删除新文件且运行态未知仍可放行，建议只观察并在可丢弃副本演练，直到对真实宿主与备份恢复有充分验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1211-1238](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1211-L1238)

工作区及存储队列是服务内部 Promise。

<details>
<summary>查看原文（28行）</summary>

```text
  /**
   * 把任务排进某个工作区的串行队列。
   * @param {string} cwd - 工作区根。
   * @param {() => Promise<T>} task - 任务。
   * @returns {Promise<T>} 任务结果。
   * @template T
   */
  withWorkspace(cwd, task) {
    const key = normalizeWorkspacePath(cwd).toLowerCase();
    if (key.length === 0) return task();
    const previous = this.workspaceQueues.get(key) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(task);
    // 队列里保存一个不会 reject 的尾指针，避免一次失败把后续任务全部带崩。
    this.workspaceQueues.set(key, next.catch(() => undefined));
    return next;
  }

  /**
   * 把任务排进存储级串行队列。
   * @param {() => Promise<T>} task - 任务。
   * @returns {Promise<T>} 任务结果。
   * @template T
   */
  withStore(task) {
    const previous = this.storeQueue;
    const next = previous.catch(() => undefined).then(task);
    this.storeQueue = next.catch(() => undefined);
    return next;
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1257-1291](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1257-L1291)

目标会话运行态可返回 unknown。

<details>
<summary>查看原文（35行）</summary>

```text
  async detectRunning(sessionId) {
    const meta = this.meta.get(sessionId);
    const controller = typeof this.ctx?.get === 'function' ? this.ctx.get('sessionController') : undefined;
    let listState = null;
    let subagents = [];
    if (controller !== null && controller !== undefined && typeof controller.list === 'function') {
      try {
        const result = await controller.list({}, new AbortController().signal);
        const items = Array.isArray(result?.items) ? result.items : [];
        const self = items.find((item) => item?.sessionId === sessionId);
        subagents = items
          .filter((item) => item?.parentSessionId === sessionId && item?.running === true)
          .map((item) => String(item.sessionId));
        if (self !== undefined && typeof self.running === 'boolean') listState = self.running;
      } catch {
        /* list 不可用/超时：退回到事件流状态 */
      }
    }
    if (listState === true || subagents.length > 0) {
      // 注意不要把它写回 meta.running：那会让一次瞬时的“运行中”读数永久污染
      // 事件流状态（list 之后回落成 false 时，回滚会被永久拒绝）。
      return { state: true, source: 'list', subagents };
    }
    if (meta?.running === true) {
      const lastAt = Number.isSafeInteger(meta.lastEventAt) && meta.lastEventAt > 0 ? meta.lastEventAt : null;
      const silent = lastAt !== null && Date.now() - lastAt > STALE_RUNNING_MS;
      if (listState === false && silent) {
        meta.running = false;
        return { state: false, source: 'stale-events', subagents: [] };
      }
      return { state: true, source: 'events', subagents };
    }
    if (meta?.running === false) return { state: false, source: 'events', subagents: [] };
    if (listState === false) return { state: false, source: 'list', subagents: [] };
    return { state: null, source: 'unknown', subagents: [] };
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1304-1329](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1304-L1329)

其他会话检查在 list 失败时回退已知事件。

<details>
<summary>查看原文（26行）</summary>

```text
  async detectWorkspaceBusy(cwd, exceptSessionId) {
    const key = normalizeWorkspacePath(cwd).toLowerCase();
    if (key.length === 0) return [];
    const busy = new Map();
    for (const [id, meta] of this.meta) {
      if (id === exceptSessionId || meta?.running !== true) continue;
      if (typeof meta.cwd !== 'string' || meta.cwd.length === 0) continue;
      if (normalizeWorkspacePath(meta.cwd).toLowerCase() !== key) continue;
      busy.set(id, 'events');
    }
    const controller = typeof this.ctx?.get === 'function' ? this.ctx.get('sessionController') : undefined;
    if (controller !== null && controller !== undefined && typeof controller.list === 'function') {
      try {
        const result = await controller.list({}, new AbortController().signal);
        const items = Array.isArray(result?.items) ? result.items : [];
        for (const item of items) {
          if (item === null || item === undefined) continue;
          const id = String(item.sessionId ?? '');
          if (id.length === 0 || id === exceptSessionId || item.running !== true) continue;
          if (typeof item.cwd !== 'string' || item.cwd.length === 0) continue;
          if (normalizeWorkspacePath(item.cwd).toLowerCase() !== key) continue;
          busy.set(id, 'list');
        }
      } catch {
        /* list 不可用：只用事件流里已知的会话 */
      }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2744-2755](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2744-L2755)

执行仅拒绝明确 true 或已知其他会话。

<details>
<summary>查看原文（12行）</summary>

```text
    // 运行中的会话直接拒绝回滚：文件恢复会和当前轮的工具写入互相踩。
    // 这里用“事件流 + sessionController.list”双重检测；即使面板已经打开，
    // 服务端也会在真正执行前再拦一次。
    const runningNow = await this.detectRunning(sessionId);
    if (runningNow.state === true) throw new Error(this.runningError(runningNow));
    const busyNow = await this.detectWorkspaceBusy(cwd, sessionId);
    if (busyNow.length > 0) {
      const ids = busyNow.slice(0, 3).map((item) => item.sessionId).join('、');
      throw new Error(
        `同一工作区还有 ${busyNow.length} 个会话正在运行（${ids}${busyNow.length > 3 ? '…' : ''}），`
        + '已拒绝回滚：请先等它们结束（turn/end）后再试，避免互相覆盖文件。',
      );
```

</details>

**依据 5 · 源码核查**：[lib/host.js:2815-2820](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2815-L2820)

恢复点后再次检查已知运行态。

```text
      // 预恢复点采集本身也要花时间；在真正写文件前再确认一次。
      const beforeApply = await this.detectRunning(sessionId);
      if (beforeApply.state === true) throw new Error(this.runningError(beforeApply));
      const busyBeforeApply = await this.detectWorkspaceBusy(plan.cwd, sessionId);
      if (busyBeforeApply.length > 0) {
        throw new Error('同一工作区的其他会话在生成恢复点期间开始运行，已中止回滚（文件尚未改动）；请等它们结束后重新预览');
```

**依据 6 · 源码核查**：[lib/host.js:2942-2952](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2942-L2952)

逐文件检查仅针对当前会话已见运行标记。

<details>
<summary>查看原文（11行）</summary>

```text
  async applyFilePlan(plan, scope, options = {}) {
    const sessionId = typeof options.sessionId === 'string' ? options.sessionId : '';
    const assertNotRunning = () => {
      if (sessionId.length > 0 && this.meta.get(sessionId)?.running === true) {
        throw new Error('会话在回滚过程中开始运行，已中止；文件可能未完成恢复，请使用恢复入口处理');
      }
    };
    const filePlan = scope === 'session'
      ? { restore: plan.sessionScope.restore, remove: plan.sessionScope.remove, pruneDirs: plan.sessionScope.pruneDirs ?? [] }
      : { restore: plan.restore, remove: plan.remove, pruneDirs: plan.pruneDirs ?? [] };
    const guard = await createRealGuard(plan.cwd);
```

</details>

#### 缺口

- 外部进程并发、宿主事件覆盖率和实际恢复时间未知
  **影响**：无法保证不覆盖其他写入或计算运维成本
  **进一步探讨**：隔离副本中测试其他会话与外部进程并发、控制器不可用及人工恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 将未知运行态与采集窗口变为确认门禁能否减少错误恢复？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在预览时展示采集排队起点、扫描起止和所有未知覆盖项，并在运行状态未知或捕获窗口与活动写入重叠时禁止默认全量恢复，可能比现有仅提示更容易阻止错误回滚。该设计需要能独立观测队列入队时刻与宿主活动状态，不能只把现有 queuedAt 换个标签。最小对照可在可丢弃项目中构造排队写入、不可读目录、controller.list 不可用及新文件四类场景，比较误删、漏提示和人工退出率；若仍漏报危险写入或把安全任务大量拒绝而不能解释，则该假设不成立。目前代码记录风险并拒绝明确运行态，没有实现上述门禁。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1878-1893](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1878-L1893)

现有 queuedAt 在进入存储任务后获取。

<details>
<summary>查看原文（16行）</summary>

```text
  queueCapture(session, phase, info) {
    const previous = this.queues.get(session.id) ?? Promise.resolve();
    const next = previous
      .catch(() => undefined)
      // 先按会话串行，再按存储串行，最后按工作区串行：
      // 同一 cwd 的多个会话不能同时扫/写索引，维护操作也不能和采集交错。
      //
      // cwd 必须在**真正执行时**读取：入队到执行之间会话可能被 /cd 切走，
      // 拿入队时的旧目录加锁会锁错工作区（扫描用的却是新目录）。
      .then(() => this.withStore(() => {
        const cwd = session?.header?.cwd;
        const detail = { ...info, queuedAt: Date.now() };
        return typeof cwd === 'string' && cwd.length > 0
          ? this.withWorkspace(cwd, () => this.capture(session, phase, detail))
          : this.capture(session, phase, detail);
      }))
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2090-2102](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2090-L2102)

现有窗口风险只是 mtime 的提示。

<details>
<summary>查看原文（13行）</summary>

```text
    // 捕获窗口风险：采集触发之后仍有 mtime 更新的文件，说明本轮改动可能已经混进
    // “本轮之前”的快照。只做提示，不假装能消除这个窗口。
    const windowRisk = [];
    for (const [rel, entry] of Object.entries(index.entries)) {
      if (entry.mtimeMs >= queuedAt && windowRisk.length < 50) windowRisk.push(rel);
    }
    const effectiveStats = {
      ...stats,
      changed: Object.keys(effectiveChanges).length,
      unknown: Object.keys(effectiveUnknown).length,
      unknownDirs: scannedUnknownDirs.length,
      windowRisk: windowRisk.length,
    };
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1280-1291](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L1280-L1291)

会话运行态可能未知。

<details>
<summary>查看原文（12行）</summary>

```text
    if (meta?.running === true) {
      const lastAt = Number.isSafeInteger(meta.lastEventAt) && meta.lastEventAt > 0 ? meta.lastEventAt : null;
      const silent = lastAt !== null && Date.now() - lastAt > STALE_RUNNING_MS;
      if (listState === false && silent) {
        meta.running = false;
        return { state: false, source: 'stale-events', subagents: [] };
      }
      return { state: true, source: 'events', subagents };
    }
    if (meta?.running === false) return { state: false, source: 'events', subagents: [] };
    if (listState === false) return { state: false, source: 'list', subagents: [] };
    return { state: null, source: 'unknown', subagents: [] };
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2744-2755](https://github.com/985451842/dsh-snapshot-manager/blob/87656ae425067c06ead6addf79ad2d17286a10a3/lib/host.js#L2744-L2755)

现有执行检查只拒绝明确运行态。

<details>
<summary>查看原文（12行）</summary>

```text
    // 运行中的会话直接拒绝回滚：文件恢复会和当前轮的工具写入互相踩。
    // 这里用“事件流 + sessionController.list”双重检测；即使面板已经打开，
    // 服务端也会在真正执行前再拦一次。
    const runningNow = await this.detectRunning(sessionId);
    if (runningNow.state === true) throw new Error(this.runningError(runningNow));
    const busyNow = await this.detectWorkspaceBusy(cwd, sessionId);
    if (busyNow.length > 0) {
      const ids = busyNow.slice(0, 3).map((item) => item.sessionId).join('、');
      throw new Error(
        `同一工作区还有 ${busyNow.length} 个会话正在运行（${ids}${busyNow.length > 3 ? '…' : ''}），`
        + '已拒绝回滚：请先等它们结束（turn/end）后再试，避免互相覆盖文件。',
      );
```

</details>

#### 缺口

- 尚未实现新的观测与门禁
  **影响**：不能证明其能减少数据损失或误拒绝
  **进一步探讨**：构造并发写入与服务缺失对照，记录误删、漏报和恢复工作量。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
