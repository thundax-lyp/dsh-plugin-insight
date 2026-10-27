# dsh-snapshot-manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d520c0f](https://github.com/985451842/dsh-snapshot-manager/tree/d520c0f9e3ccec269fbe82f226604165e1471a0f)

<!-- BEGIN META -->
[![npm 30d 1,088](https://img.shields.io/static/v1?label=npm+30d&message=1%2C088&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-snapshot-manager)
<!-- END META -->

> **功能**：每轮前增量快照工作区，并用预览令牌、事务日志和会话 fork 组合文件/对话回滚。

> **亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

> **主要限制**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 运行态双源检查也有明确边界：controller.list不可用且没有已见事件状态时返回null，restore只拒绝true，故“未知”会放行；不能宣称无法确认时必定阻断。工作区队列是当前服务内存队列，不是跨进程文件锁，外部编辑或另一个进程不受该队列保护。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种重复场景需要 dsh-snapshot-manager，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-snapshot-manager 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-snapshot-manager 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-snapshot-manager 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-snapshot-manager 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-snapshot-manager 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-snapshot-manager 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-snapshot-manager？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话多轮改代码后结果不对，开发者希望回到某轮提问前的文件与对话；基线是 Git checkout/stash 加手工新会话。合格结果是预览精确列出恢复/删除、只改工作区内目标、快照链完整、文件恢复可撤销、对话 fork 不覆盖原会话，排除项被明确告知。 详见[Q01](#research-q01)。

长会话多轮改代码后结果不对，开发者希望回到某轮提问前的文件与对话；基线是 Git checkout/stash 加手工新会话。合格结果是预览精确列出恢复/删除、只改工作区内目标、快照链完整、文件恢复可撤销、对话 fork 不覆盖原会话，排除项被明确告知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：会话头快照面板、轮尾“编辑并重来”、回滚/撤销/清理操作
- **Host 路由**：快照列表、预览、恢复、采集、删除、恢复事务与GC接口
- **事件监听**：在轮次/消息事件上采集并把快照锚到真实用户提问
- **后台**：内容寻址增量扫描、事务恢复、会话fork和垃圾回收

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可写快照根和磁盘空间 | 必需 | 索引、对象、记录和事务日志 | 不足会使采集/恢复失败 |
| 稳定工作区cwd/真实路径 | 必需 | 限制扫描与写入边界 | 跨cwd对话回退跳过 |
| 会话事件/sessionController | 对话能力必需 | 锚轮次、fork和继续提示 | 缺失只能处理文件或失败 |
| 完整对象与快照链 | 恢复必需 | 解析目标完整树 | 残缺链拒绝回滚 |
| 单进程队列与文件系统rename | 文件操作必需 | 服务内串行及完整文件替换 | 外部编辑不受锁保护，fsync异常不阻断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置/采集 | 管理员设排除和上限；每轮前自动扫 | 时间线出现锚定提问的快照 |
| 预览 | 用户选择快照和范围 | 完整计划、警告与一次性token |
| 确认/执行 | 二次确认后写文件并可fork | 事务记录done/partial/failed |
| 恢复/维护 | resume/revert或撤销；定期GC | 哈希核对且原会话仍在 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 磁盘用于对象库，金额未知 | 配置边界并做数据损失演练 | 项目规模决定初扫时长 |
| 每轮持续 | 扫描/哈希I/O与新增内容字节 | 关注排除/超大文件警告 | 按一个可解析快照计量 |
| 失败恢复 | 额外pre-rollback副本与重复I/O | 选resume/revert，人工修.git/权限等 | partial事务处理时长未知 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件恢复 | 源码有计划token、原子写和事务日志 | 目标OS崩溃注入下完整率 |
| 对话回退 | fork保留原会话并可续投输入 | 宿主版本时序和重复动作 |
| 存储控制 | 内容寻址、checkpoint与GC | 大型仓库长期磁盘/扫描成本 |

> **思考**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 运行态双源检查也有明确边界：controller.list不可用且没有已见事件状态时返回null，restore只拒绝true，故“未知”会放行；不能宣称无法确认时必定阻断。工作区队列是当前服务内存队列，不是跨进程文件锁，外部编辑或另一个进程不受该队列保护。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

内容寻址、按会话增量基线、链修剪提升full、计划token与事务日志形成较完整安全层，realpath阻止经链接写出工作区。可复用的是“预览摘要绑定执行+先建恢复点”；移植要重新验证文件系统原子性和会话事件顺序。 这些是降低常见误恢复的机制而非完整事务隔离：fsync错误不阻断，同进程队列挡不住外部编辑，运行态unknown未强制拒绝。 [Q07](#research-q07)

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 运行态双源检查也有明确边界：controller.list不可用且没有已见事件状态时返回null，restore只拒绝true，故“未知”会放行；不能宣称无法确认时必定阻断。工作区队列是当前服务内存队列，不是跨进程文件锁，外部编辑或另一个进程不受该队列保护。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

重要仓库不应仅依赖本插件；已有 Git/备份并能理解排除边界的开发者可先观察。试验要在临时工作区做新增/删除/改写、进程中断、链缺失、跨会话同cwd和撤销回滚，只有文件哈希与原会话保留全部符合预期才考虑常开。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了每轮增量快照、内容寻址链、摘要绑定的一次性计划令牌、pre-rollback 恢复点、事务日志和会话 fork；本轮未对真实文件系统执行恢复或中断注入，故不确认排除项、session-only 漏记、跨会话并发和元数据缺失下的恢复完整性。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 d520c0f9e3ccec269fbe82f226604165e1471a0f 的README、package与host.js：核查采集、恢复点、计划令牌、真实路径、运行态及恢复接线；未执行文件回滚或目标测试。
- 下一步：在临时工作区构造新增/删除/改写、空目录、大文件、symlink、git index、权限位和两会话并发；逐阶段中断restore并执行resume/revert，逐文件哈希比较目标树，确认排除项警告和原会话保留。

**分析版本**

- **仓库**：[985451842/dsh-snapshot-manager](https://github.com/985451842/dsh-snapshot-manager)
- **版本号**：0.3.1（[固定提交 d520c0f](https://github.com/985451842/dsh-snapshot-manager/tree/d520c0f9e3ccec269fbe82f226604165e1471a0f)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。 详见[Q08](#research-q08)。

在临时工作区构造新增/删除/改写、空目录、大文件、symlink、git index、权限位和两会话并发；逐阶段中断restore并执行resume/revert，逐文件哈希比较目标树，确认排除项警告和原会话保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 5123 | 3847 | 1037 | — |
| .md | source | 1 | 310 | — | — | 5676 |
| .mjs | test | 5 | 583 | 518 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/985451842/dsh-snapshot-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/985451842/dsh-snapshot-manager/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/985451842/dsh-snapshot-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-snapshot-manager 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-snapshot-manager，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

长会话多轮改代码后结果不对，开发者希望回到某轮提问前的文件与对话；基线是 Git checkout/stash 加手工新会话。合格结果是预览精确列出恢复/删除、只改工作区内目标、快照链完整、文件恢复可撤销、对话 fork 不覆盖原会话，排除项被明确告知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/README.md#L1-L22)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
# dsh-snapshot-manager

DeepSeek Harness（DSH）桌面版插件：**会话快照 / 回滚**。

- 每个轮次**开始前**自动对工作区做一次**增量文件快照**（内容寻址存储，同一内容只存一份）——回滚语义统一为"回到本轮之前"，所以每轮只留一条快照。
- 发现连续对话最后结果不对时，可以从任一快照**回滚**：文件恢复 + 通过 `sessionController.fork(atSeq)` 把对话退回到该时点（原会话完整保留），并可把**编辑后的输入**自动发进新会话继续。
- 快照库维护：面板右上角「**清理快照垃圾**」删除孤立快照（会话日志已不存在）、回收没有任何快照引用的内容对象，并归并历史遗留的非规范化工作区索引 key。

纯 JavaScript，无构建步骤；Host 半边只用 Node 内置模块（不 import 任何 `@deepseek-ai/*` 包），Client 半边是手写的 `window.__ModuleLoader__` bundle。

## 0.3.x 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **运行中拒绝回滚（0.3.1）**：预览会通过事件流和 `sessionController.list()` 双重检测会话是否仍在运行（包括运行中的子代理）。运行中时面板禁用“执行回滚”，服务端在执行前也会再次拒绝；停止当前轮并等待 `turn/end` 后重新预览即可。不会自动 cancel 当前任务，避免静默杀掉用户正在跑的工作。
- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-snapshot-manager 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

turn/start 按会话和工作区串行扫描，内容寻址 objects 与增量/full checkpoint 组成链；preview 根据目标树和当前树生成完整计划及摘要绑定的一次性 token。restore 先建立 pre-rollback 恢复点和事务日志，以同目录临时文件+fsync+rename写文件，可选 sessionController.fork/prompt；中断事务可 resume/revert，GC 回收无引用对象。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1506-1531](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1506-L1531)

turn/start实际触发扫描，编辑journal是另一路范围。

<details>
<summary>查看原文（26行）</summary>

```text
      // 覆盖 write / edit / 有修改作用的 str_replace_editor；经 pwsh 等间接改的文件
      // 拿不到路径，属于已知不完整，因此该范围只是可选项、绝不作为默认行为。
      const abs = extractMutationPath(event.data?.name, event.data?.arguments);
      if (abs !== null) {
        const rel = relWithinWorkspace(session.header?.cwd, abs);
        if (rel !== null && !isExcluded(rel, this.excludeSet, this.excludeExtSet)) {
          void this.recordTouched(session, rel);
        }
      }
      return;
    }
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
      return;
    }
    if (type === 'turn/end') {
      meta.lastTurnEndSeq = event.seq;
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2194-2223](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2194-L2223)

执行重建计划、检查运行态并消费绑定摘要令牌。

<details>
<summary>查看原文（30行）</summary>

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

    // 运行中的会话直接拒绝回滚：文件恢复会和当前轮的工具写入互相踩。
    // 这里用“事件流 + sessionController.list”双重检测；即使面板已经打开，
    // 服务端也会在真正执行前再拦一次。
    const runningNow = await this.detectRunning(sessionId);
    if (runningNow.state === true) throw new Error(this.runningError(runningNow));

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

**依据 3 · 源码核查**：[lib/host.js:2244-2295](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2244-L2295)

恢复点必须成功，skipTrim保留目标，事务意图在写入前保存。

<details>
<summary>查看原文（52行）</summary>

```text
    if (doFiles) {
      // 1) 回滚前恢复点：万一回滚错了，还能再回滚回来。
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
        }
      }

      // 预恢复点采集本身也要花时间；在真正写文件前再确认一次。
      const beforeApply = await this.detectRunning(sessionId);
      if (beforeApply.state === true) throw new Error(this.runningError(beforeApply));

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
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2334-2365](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2334-L2365)

部分文件失败不fork，跨cwd跳过，真实调用controller.fork。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-snapshot-manager 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/README.md#L1-L22)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
# dsh-snapshot-manager

DeepSeek Harness（DSH）桌面版插件：**会话快照 / 回滚**。

- 每个轮次**开始前**自动对工作区做一次**增量文件快照**（内容寻址存储，同一内容只存一份）——回滚语义统一为"回到本轮之前"，所以每轮只留一条快照。
- 发现连续对话最后结果不对时，可以从任一快照**回滚**：文件恢复 + 通过 `sessionController.fork(atSeq)` 把对话退回到该时点（原会话完整保留），并可把**编辑后的输入**自动发进新会话继续。
- 快照库维护：面板右上角「**清理快照垃圾**」删除孤立快照（会话日志已不存在）、回收没有任何快照引用的内容对象，并归并历史遗留的非规范化工作区索引 key。

纯 JavaScript，无构建步骤；Host 半边只用 Node 内置模块（不 import 任何 `@deepseek-ai/*` 包），Client 半边是手写的 `window.__ModuleLoader__` bundle。

## 0.3.x 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **运行中拒绝回滚（0.3.1）**：预览会通过事件流和 `sessionController.list()` 双重检测会话是否仍在运行（包括运行中的子代理）。运行中时面板禁用“执行回滚”，服务端在执行前也会再次拒绝；停止当前轮并等待 `turn/end` 后重新预览即可。不会自动 cancel 当前任务，避免静默杀掉用户正在跑的工作。
- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2334-2365](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2334-L2365)

文件恢复和对话fork组合，部分失败时不继续新会话。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-snapshot-manager 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 运行态双源检查也有明确边界：controller.list不可用且没有已见事件状态时返回null，restore只拒绝true，故“未知”会放行；不能宣称无法确认时必定阻断。工作区队列是当前服务内存队列，不是跨进程文件锁，外部编辑或另一个进程不受该队列保护。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1506-1515](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1506-L1515)

journal只登记三个编辑工具的可提取路径。

<details>
<summary>查看原文（10行）</summary>

```text
      // 覆盖 write / edit / 有修改作用的 str_replace_editor；经 pwsh 等间接改的文件
      // 拿不到路径，属于已知不完整，因此该范围只是可选项、绝不作为默认行为。
      const abs = extractMutationPath(event.data?.name, event.data?.arguments);
      if (abs !== null) {
        const rel = relWithinWorkspace(session.header?.cwd, abs);
        if (rel !== null && !isExcluded(rel, this.excludeSet, this.excludeExtSet)) {
          void this.recordTouched(session, rel);
        }
      }
      return;
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1073-1100](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1073-L1100)

运行状态无法判定时返回null。

<details>
<summary>查看原文（28行）</summary>

```text
  async detectRunning(sessionId) {
    const meta = this.meta.get(sessionId);
    const controller = typeof this.ctx?.get === 'function' ? this.ctx.get('sessionController') : undefined;
    if (controller !== null && controller !== undefined && typeof controller.list === 'function') {
      try {
        const result = await controller.list({}, new AbortController().signal);
        const items = Array.isArray(result?.items) ? result.items : [];
        const self = items.find((item) => item?.sessionId === sessionId);
        const subagents = items
          .filter((item) => item?.parentSessionId === sessionId && item?.running === true)
          .map((item) => String(item.sessionId));
        if (self !== undefined && typeof self.running === 'boolean' && meta !== undefined) {
          meta.running = self.running;
        }
        if (self?.running === true || subagents.length > 0) {
          return { state: true, source: 'list', subagents };
        }
        if (self !== undefined && typeof self.running === 'boolean') {
          return { state: false, source: 'list', subagents: [] };
        }
      } catch {
        /* list 不可用/超时：退回到事件流状态 */
      }
    }
    if (meta?.running === true) return { state: true, source: 'events', subagents: [] };
    if (meta?.running === false) return { state: false, source: 'events', subagents: [] };
    return { state: null, source: 'unknown', subagents: [] };
  }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:2208-2212](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2208-L2212)

执行只在state===true时拒绝，unknown不是fail-closed。

```text
    // 运行中的会话直接拒绝回滚：文件恢复会和当前轮的工具写入互相踩。
    // 这里用“事件流 + sessionController.list”双重检测；即使面板已经打开，
    // 服务端也会在真正执行前再拦一次。
    const runningNow = await this.detectRunning(sessionId);
    if (runningNow.state === true) throw new Error(this.runningError(runningNow));
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-snapshot-manager 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要可写 $DSH_HOME/snapshot-manager、稳定 cwd、会话事件/查询与 sessionController，文件系统应支持同目录原子 rename；fsync 只是尽力执行，异常被吞掉，所以断电持久性不可保证。内容对象和快照链必须完整；跨 cwd 对话回退会跳过。磁盘空间、200快照上限和8MiB文件阈值需按项目规模配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/README.md#L1-L22)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
# dsh-snapshot-manager

DeepSeek Harness（DSH）桌面版插件：**会话快照 / 回滚**。

- 每个轮次**开始前**自动对工作区做一次**增量文件快照**（内容寻址存储，同一内容只存一份）——回滚语义统一为"回到本轮之前"，所以每轮只留一条快照。
- 发现连续对话最后结果不对时，可以从任一快照**回滚**：文件恢复 + 通过 `sessionController.fork(atSeq)` 把对话退回到该时点（原会话完整保留），并可把**编辑后的输入**自动发进新会话继续。
- 快照库维护：面板右上角「**清理快照垃圾**」删除孤立快照（会话日志已不存在）、回收没有任何快照引用的内容对象，并归并历史遗留的非规范化工作区索引 key。

纯 JavaScript，无构建步骤；Host 半边只用 Node 内置模块（不 import 任何 `@deepseek-ai/*` 包），Client 半边是手写的 `window.__ModuleLoader__` bundle。

## 0.3.x 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **运行中拒绝回滚（0.3.1）**：预览会通过事件流和 `sessionController.list()` 双重检测会话是否仍在运行（包括运行中的子代理）。运行中时面板禁用“执行回滚”，服务端在执行前也会再次拒绝；停止当前轮并等待 `turn/end` 后重新预览即可。不会自动 cancel 当前任务，避免静默杀掉用户正在跑的工作。
- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。
```

</details>

**依据 2 · 源码核查**：[lib/host.js:749-771](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L749-L771)

临时文件写入和fsync异常忽略的实际边界。

<details>
<summary>查看原文（23行）</summary>

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
  } catch (error) {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-snapshot-manager 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要选 root、排除、文件上限、checkpoint频率并在可丢弃项目做回滚演练；持续每轮扫描元数据/哈希、存新增内容对象和索引，成本随变更字节与文件数增长；失败恢复依赖 restore事务的resume/revert和pre-rollback点，仍需人工处理未覆盖.git/权限/大文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:2489-2518](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2489-L2518)

resume/revert重建计划并应用，恢复点存在是revert条件。

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
    return this.withWorkspace(tx.cwd, async () => {
      const plan = await this.buildPlan(tx.sessionId, target);
      const runningNow = await this.detectRunning(tx.sessionId);
      if (runningNow.state === true) throw new Error(this.runningError(runningNow));
      const files = await this.applyFilePlan(plan, tx.scope === 'session' ? 'session' : 'all', { sessionId: tx.sessionId });
      try {
        const previousIndex = await this.store.readIndex(workspaceKeyOf(tx.cwd));
        const { index } = await scanWorkspace({ cwd: tx.cwd, config: this.config, previousIndex });
        await this.store.writeIndex(workspaceKeyOf(tx.cwd), index);
      } catch {
        /* 索引刷新失败不影响恢复本身 */
      }
      tx.status = files.failed > 0 ? 'interrupted' : (action === 'revert' ? 'reverted' : 'recovered');
      tx.recoveredAt = Date.now();
      tx.recoveryAction = action;
      tx.recoveryReport = {
        restored: files.restored,
```

</details>

#### 缺口

- 排除项和session-only漏记对用户恢复预期的影响未知
  **影响**：可能把部分回滚误认为完整回滚
  **进一步探讨**：构造含shell/build/subagent、.git、权限、大文件和symlink的50例恢复矩阵，统计未提示残留和误删除

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-snapshot-manager 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

内容寻址、按会话增量基线、链修剪提升full、计划token与事务日志形成较完整安全层，realpath阻止经链接写出工作区。可复用的是“预览摘要绑定执行+先建恢复点”；移植要重新验证文件系统原子性和会话事件顺序。 这些是降低常见误恢复的机制而非完整事务隔离：fsync错误不阻断，同进程队列挡不住外部编辑，运行态unknown未强制拒绝。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1052-1059](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1052-L1059)

服务内按归一化cwd排队，不是跨进程锁。

```text
  withWorkspace(cwd, task) {
    const key = normalizeWorkspacePath(cwd).toLowerCase();
    if (key.length === 0) return task();
    const previous = this.workspaceQueues.get(key) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(task);
    // 队列里保存一个不会 reject 的尾指针，避免一次失败把后续任务全部带崩。
    this.workspaceQueues.set(key, next.catch(() => undefined));
    return next;
```

**依据 2 · 源码核查**：[lib/host.js:1163-1215](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1163-L1215)

一次令牌绑定范围与完整摘要，消费后标used。

<details>
<summary>查看原文（53行）</summary>

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
  }

  /**
```

</details>

**依据 3 · 源码核查**：[lib/host.js:858-890](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L858-L890)

真实路径守卫拒绝指向工作区外祖先，但不等于并发文件系统事务。

<details>
<summary>查看原文（33行）</summary>

```text
async function createRealGuard(cwd) {
  const realCwd = await realpath(cwd).catch(() => normalizeWorkspacePath(cwd));
  const cache = new Map();
  const realOf = async (path) => {
    if (cache.has(path)) return cache.get(path);
    const value = await realpath(path).catch(() => path);
    cache.set(path, value);
    return value;
  };
  const check = async (target, { write = false } = {}) => {
    let current = target;
    let leaf;
    for (;;) {
      const info = await lstat(current).catch(() => undefined);
      if (info !== undefined) {
        leaf = { path: current, info };
        break;
      }
      const parent = dirname(current);
      if (parent === current) return { ok: false, reason: 'no-existing-ancestor' };
      current = parent;
    }
    const realAncestor = await realOf(leaf.path);
    if (!isWithinReal(realCwd, realAncestor)) return { ok: false, reason: 'outside-workspace' };
    if (leaf.path === target && leaf.info.isSymbolicLink()) {
      return write ? { ok: false, reason: 'target-is-symlink' } : { ok: true };
    }
    if (leaf.path === target) {
      const realTarget = await realOf(target);
      if (!isWithinReal(realCwd, realTarget)) return { ok: false, reason: 'outside-workspace' };
    }
    return { ok: true };
  };
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1506-1515](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1506-L1515)

间接写入漏记为不可恢复清单提供具体推导。

<details>
<summary>查看原文（10行）</summary>

```text
      // 覆盖 write / edit / 有修改作用的 str_replace_editor；经 pwsh 等间接改的文件
      // 拿不到路径，属于已知不完整，因此该范围只是可选项、绝不作为默认行为。
      const abs = extractMutationPath(event.data?.name, event.data?.arguments);
      if (abs !== null) {
        const rel = relWithinWorkspace(session.header?.cwd, abs);
        if (rel !== null && !isExcluded(rel, this.excludeSet, this.excludeExtSet)) {
          void this.recordTouched(session, rel);
        }
      }
      return;
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1073-1100](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L1073-L1100)

运行态unknown是未来门禁的额外输入。

<details>
<summary>查看原文（28行）</summary>

```text
  async detectRunning(sessionId) {
    const meta = this.meta.get(sessionId);
    const controller = typeof this.ctx?.get === 'function' ? this.ctx.get('sessionController') : undefined;
    if (controller !== null && controller !== undefined && typeof controller.list === 'function') {
      try {
        const result = await controller.list({}, new AbortController().signal);
        const items = Array.isArray(result?.items) ? result.items : [];
        const self = items.find((item) => item?.sessionId === sessionId);
        const subagents = items
          .filter((item) => item?.parentSessionId === sessionId && item?.running === true)
          .map((item) => String(item.sessionId));
        if (self !== undefined && typeof self.running === 'boolean' && meta !== undefined) {
          meta.running = self.running;
        }
        if (self?.running === true || subagents.length > 0) {
          return { state: true, source: 'list', subagents };
        }
        if (self !== undefined && typeof self.running === 'boolean') {
          return { state: false, source: 'list', subagents: [] };
        }
      } catch {
        /* list 不可用/超时：退回到事件流状态 */
      }
    }
    if (meta?.running === true) return { state: true, source: 'events', subagents: [] };
    if (meta?.running === false) return { state: false, source: 'events', subagents: [] };
    return { state: null, source: 'unknown', subagents: [] };
  }
```

</details>

#### 缺口

- 排除项和session-only漏记对用户恢复预期的影响未知
  **影响**：可能把部分回滚误认为完整回滚
  **进一步探讨**：构造含shell/build/subagent、.git、权限、大文件和symlink的50例恢复矩阵，统计未提示残留和误删除

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-snapshot-manager？

**研究主题**：采用判断

#### 完整回答

重要仓库不应仅依赖本插件；已有 Git/备份并能理解排除边界的开发者可先观察。试验要在临时工作区做新增/删除/改写、进程中断、链缺失、跨会话同cwd和撤销回滚，只有文件哈希与原会话保留全部符合预期才考虑常开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/README.md#L1-L22)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
# dsh-snapshot-manager

DeepSeek Harness（DSH）桌面版插件：**会话快照 / 回滚**。

- 每个轮次**开始前**自动对工作区做一次**增量文件快照**（内容寻址存储，同一内容只存一份）——回滚语义统一为"回到本轮之前"，所以每轮只留一条快照。
- 发现连续对话最后结果不对时，可以从任一快照**回滚**：文件恢复 + 通过 `sessionController.fork(atSeq)` 把对话退回到该时点（原会话完整保留），并可把**编辑后的输入**自动发进新会话继续。
- 快照库维护：面板右上角「**清理快照垃圾**」删除孤立快照（会话日志已不存在）、回收没有任何快照引用的内容对象，并归并历史遗留的非规范化工作区索引 key。

纯 JavaScript，无构建步骤；Host 半边只用 Node 内置模块（不 import 任何 `@deepseek-ai/*` 包），Client 半边是手写的 `window.__ModuleLoader__` bundle。

## 0.3.x 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **运行中拒绝回滚（0.3.1）**：预览会通过事件流和 `sessionController.list()` 双重检测会话是否仍在运行（包括运行中的子代理）。运行中时面板禁用“执行回滚”，服务端在执行前也会再次拒绝；停止当前轮并等待 `turn/end` 后重新预览即可。不会自动 cancel 当前任务，避免静默杀掉用户正在跑的工作。
- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2489-2518](https://github.com/985451842/dsh-snapshot-manager/blob/d520c0f9e3ccec269fbe82f226604165e1471a0f/lib/host.js#L2489-L2518)

恢复动作存在但仍需真实文件系统故障演练。

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
    return this.withWorkspace(tx.cwd, async () => {
      const plan = await this.buildPlan(tx.sessionId, target);
      const runningNow = await this.detectRunning(tx.sessionId);
      if (runningNow.state === true) throw new Error(this.runningError(runningNow));
      const files = await this.applyFilePlan(plan, tx.scope === 'session' ? 'session' : 'all', { sessionId: tx.sessionId });
      try {
        const previousIndex = await this.store.readIndex(workspaceKeyOf(tx.cwd));
        const { index } = await scanWorkspace({ cwd: tx.cwd, config: this.config, previousIndex });
        await this.store.writeIndex(workspaceKeyOf(tx.cwd), index);
      } catch {
        /* 索引刷新失败不影响恢复本身 */
      }
      tx.status = files.failed > 0 ? 'interrupted' : (action === 'revert' ? 'reverted' : 'recovered');
      tx.recoveredAt = Date.now();
      tx.recoveryAction = action;
      tx.recoveryReport = {
        restored: files.restored,
```

</details>

#### 缺口

- 排除项和session-only漏记对用户恢复预期的影响未知
  **影响**：可能把部分回滚误认为完整回滚
  **进一步探讨**：构造含shell/build/subagent、.git、权限、大文件和symlink的50例恢复矩阵，统计未提示残留和误删除

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
