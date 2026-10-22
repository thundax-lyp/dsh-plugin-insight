# dsh-snapshot-manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[61ac9bc](https://github.com/985451842/dsh-snapshot-manager/tree/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae)

<!-- BEGIN META -->
[![npm 30d 816](https://img.shields.io/static/v1?label=npm+30d&message=816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-snapshot-manager)
<!-- END META -->

> **实现功能**：每轮前增量快照工作区，并用预览令牌、事务日志和会话 fork 组合文件/对话回滚。

> **核心亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 详见[Q04](#research-q04)。

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

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 每轮快照 | 保存轮次前工作区增量 | 排除.git、大文件、链接和元数据 |
| 预览与计划令牌 | 执行前固定恢复/删除清单 | 令牌5分钟一次性，清单变化需重预览 |
| 文件+对话回滚 | 恢复文件并fork到目标会话点 | 对话fork不可自动撤销；原会话保留 |
| 中断恢复/撤销 | resume/revert事务或回到pre-rollback | 仍不覆盖排除项 |
| GC/修剪 | 清孤立快照和无引用对象 | 删除仅允许叶子，需保链完整 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可写快照根和磁盘空间 | 必需 | 索引、对象、记录和事务日志 | 不足会使采集/恢复失败 |
| 稳定工作区cwd/真实路径 | 必需 | 限制扫描与写入边界 | 跨cwd对话回退跳过 |
| 会话事件/sessionController | 对话能力必需 | 锚轮次、fork和继续提示 | 缺失只能处理文件或失败 |
| 完整对象与快照链 | 恢复必需 | 解析目标完整树 | 残缺链拒绝回滚 |

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

> **思考**：核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。 详见[Q03](#research-q03)。

内容寻址、按会话增量基线、链修剪提升full、计划token与事务日志形成较完整安全层，realpath阻止经链接写出工作区。可复用的是“预览摘要绑定执行+先建恢复点”；移植要重新验证文件系统原子性和会话事件顺序。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

重要仓库不应仅依赖本插件；已有 Git/备份并能理解排除边界的开发者可先观察。试验要在临时工作区做新增/删除/改写、进程中断、链缺失、跨会话同cwd和撤销回滚，只有文件哈希与原会话保留全部符合预期才考虑常开。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了每轮增量快照、内容寻址链、摘要绑定的一次性计划令牌、pre-rollback 恢复点、事务日志和会话 fork；本轮未对真实文件系统执行恢复或中断注入，故不确认排除项、session-only 漏记、跨会话并发和元数据缺失下的恢复完整性。

- 已检查：作者 README、包清单、源码路径 README.md、lib/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在临时工作区构造新增/删除/改写、空目录、大文件、symlink、git index、权限位和两会话并发；逐阶段中断restore并执行resume/revert，逐文件哈希比较目标树，确认排除项警告和原会话保留。

**分析版本**

- **仓库**：[985451842/dsh-snapshot-manager](https://github.com/985451842/dsh-snapshot-manager)
- **版本号**：0.3.0（[固定提交 61ac9bc](https://github.com/985451842/dsh-snapshot-manager/tree/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。 详见[Q08](#research-q08)。

在临时工作区构造新增/删除/改写、空目录、大文件、symlink、git index、权限位和两会话并发；逐阶段中断restore并执行resume/revert，逐文件哈希比较目标树，确认排除项警告和原会话保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 5015 | 3765 | 1015 | — |
| .md | source | 1 | 308 | — | — | 5538 |
| .mjs | test | 4 | 478 | 422 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/985451842/dsh-snapshot-manager/issues) 查看。

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

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/README.md#L1-L22)

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

## 0.3.0 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

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

**依据 1 · 源码核查**：[lib/host.js:2122-2245](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/lib/host.js#L2122-L2245)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（124行）</summary>

```text
  async restore(request = {}) {
    const sessionId = String(request.sessionId ?? '');
    if (sessionId.length === 0) throw new Error('缺少 sessionId');
    const targetInfo = await this.resolvePlanTarget(sessionId, request.snapshotId);
    return this.withWorkspace(targetInfo.cwd, () => this.restoreLocked({ ...request, sessionId }, targetInfo.cwd));
  }

  /**
   * 在已持有工作区锁的情况下执行回滚。
   * @param {object} request - 回滚请求（sessionId 必填）。
   * @param {string} cwd - 工作区根。
   * @returns {Promise<object>} 执行报告。
   */
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

    const report = {
      sessionId,
      snapshotId: plan.snapshotId,
      cwd: plan.cwd,
      at: new Date().toISOString(),
      scope,
      files: null,
      conversation: null,
      prompt: null,
      recoveryPoint: null,
      transactionId: null,
      plan: {
        counts: plan.counts,
        sessionCounts: plan.sessionScope?.counts ?? null,
        warnings: plan.warnings ?? [],
      },
      warnings: [...(plan.warnings ?? [])],
    };

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
        report.files = await this.applyFilePlan(plan, scope);
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-snapshot-manager 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对 Git，它覆盖未跟踪文件和对话时间点，并把文件恢复与会话 fork 放在同一 UI；预览令牌、叶子删除、链完整性拒绝和撤销点降低误回滚。它不保存 .git 状态、权限/可执行位/mtime，session scope journal 也漏掉 shell/build/subagent 修改。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/README.md#L1-L22)

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

## 0.3.0 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-snapshot-manager 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是用户是否误解“快照”为完整工作区。默认排除、8MiB上限、符号链接、.git和元数据都不回滚；session-only 范围只认三个编辑工具，可能留下关联修改。全量 restore 会删除快照后新增文件，若 cwd/realpath 判定或链损坏处理出错后果严重。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:2122-2245](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/lib/host.js#L2122-L2245)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（124行）</summary>

```text
  async restore(request = {}) {
    const sessionId = String(request.sessionId ?? '');
    if (sessionId.length === 0) throw new Error('缺少 sessionId');
    const targetInfo = await this.resolvePlanTarget(sessionId, request.snapshotId);
    return this.withWorkspace(targetInfo.cwd, () => this.restoreLocked({ ...request, sessionId }, targetInfo.cwd));
  }

  /**
   * 在已持有工作区锁的情况下执行回滚。
   * @param {object} request - 回滚请求（sessionId 必填）。
   * @param {string} cwd - 工作区根。
   * @returns {Promise<object>} 执行报告。
   */
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

    const report = {
      sessionId,
      snapshotId: plan.snapshotId,
      cwd: plan.cwd,
      at: new Date().toISOString(),
      scope,
      files: null,
      conversation: null,
      prompt: null,
      recoveryPoint: null,
      transactionId: null,
      plan: {
        counts: plan.counts,
        sessionCounts: plan.sessionScope?.counts ?? null,
        warnings: plan.warnings ?? [],
      },
      warnings: [...(plan.warnings ?? [])],
    };

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
        report.files = await this.applyFilePlan(plan, scope);
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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-snapshot-manager 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要可写 $DSH_HOME/snapshot-manager、稳定 cwd、会话事件/查询与 sessionController，文件系统须支持原子 rename/fsync。内容对象和快照链必须完整；跨 cwd 对话回退会跳过。磁盘空间、200快照上限和8MiB文件阈值需按项目规模配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/README.md#L1-L22)

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

## 0.3.0 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。

```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-snapshot-manager 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要选 root、排除、文件上限、checkpoint频率并在可丢弃项目做回滚演练；持续每轮扫描元数据/哈希、存新增内容对象和索引，成本随变更字节与文件数增长；失败恢复依赖 restore事务的resume/revert和pre-rollback点，仍需人工处理未覆盖.git/权限/大文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:2122-2245](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/lib/host.js#L2122-L2245)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（124行）</summary>

```text
  async restore(request = {}) {
    const sessionId = String(request.sessionId ?? '');
    if (sessionId.length === 0) throw new Error('缺少 sessionId');
    const targetInfo = await this.resolvePlanTarget(sessionId, request.snapshotId);
    return this.withWorkspace(targetInfo.cwd, () => this.restoreLocked({ ...request, sessionId }, targetInfo.cwd));
  }

  /**
   * 在已持有工作区锁的情况下执行回滚。
   * @param {object} request - 回滚请求（sessionId 必填）。
   * @param {string} cwd - 工作区根。
   * @returns {Promise<object>} 执行报告。
   */
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

    const report = {
      sessionId,
      snapshotId: plan.snapshotId,
      cwd: plan.cwd,
      at: new Date().toISOString(),
      scope,
      files: null,
      conversation: null,
      prompt: null,
      recoveryPoint: null,
      transactionId: null,
      plan: {
        counts: plan.counts,
        sessionCounts: plan.sessionScope?.counts ?? null,
        warnings: plan.warnings ?? [],
      },
      warnings: [...(plan.warnings ?? [])],
    };

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
        report.files = await this.applyFilePlan(plan, scope);
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

内容寻址、按会话增量基线、链修剪提升full、计划token与事务日志形成较完整安全层，realpath阻止经链接写出工作区。可复用的是“预览摘要绑定执行+先建恢复点”；移植要重新验证文件系统原子性和会话事件顺序。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:2122-2245](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/lib/host.js#L2122-L2245)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（124行）</summary>

```text
  async restore(request = {}) {
    const sessionId = String(request.sessionId ?? '');
    if (sessionId.length === 0) throw new Error('缺少 sessionId');
    const targetInfo = await this.resolvePlanTarget(sessionId, request.snapshotId);
    return this.withWorkspace(targetInfo.cwd, () => this.restoreLocked({ ...request, sessionId }, targetInfo.cwd));
  }

  /**
   * 在已持有工作区锁的情况下执行回滚。
   * @param {object} request - 回滚请求（sessionId 必填）。
   * @param {string} cwd - 工作区根。
   * @returns {Promise<object>} 执行报告。
   */
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

    const report = {
      sessionId,
      snapshotId: plan.snapshotId,
      cwd: plan.cwd,
      at: new Date().toISOString(),
      scope,
      files: null,
      conversation: null,
      prompt: null,
      recoveryPoint: null,
      transactionId: null,
      plan: {
        counts: plan.counts,
        sessionCounts: plan.sessionScope?.counts ?? null,
        warnings: plan.warnings ?? [],
      },
      warnings: [...(plan.warnings ?? [])],
    };

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
        report.files = await this.applyFilePlan(plan, scope);
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
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把排除项、Git状态和元数据做成独立不可恢复清单，并在风险超过阈值时阻止全量回滚，可显著减少错误安全感。最小实验构造50个含大文件、symlink、权限、git index、shell改动的工作区，比较当前提示与风险门禁的误回滚和人工发现率；仍有未提示数据损失即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:2122-2245](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/lib/host.js#L2122-L2245)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（124行）</summary>

```text
  async restore(request = {}) {
    const sessionId = String(request.sessionId ?? '');
    if (sessionId.length === 0) throw new Error('缺少 sessionId');
    const targetInfo = await this.resolvePlanTarget(sessionId, request.snapshotId);
    return this.withWorkspace(targetInfo.cwd, () => this.restoreLocked({ ...request, sessionId }, targetInfo.cwd));
  }

  /**
   * 在已持有工作区锁的情况下执行回滚。
   * @param {object} request - 回滚请求（sessionId 必填）。
   * @param {string} cwd - 工作区根。
   * @returns {Promise<object>} 执行报告。
   */
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

    const report = {
      sessionId,
      snapshotId: plan.snapshotId,
      cwd: plan.cwd,
      at: new Date().toISOString(),
      scope,
      files: null,
      conversation: null,
      prompt: null,
      recoveryPoint: null,
      transactionId: null,
      plan: {
        counts: plan.counts,
        sessionCounts: plan.sessionScope?.counts ?? null,
        warnings: plan.warnings ?? [],
      },
      warnings: [...(plan.warnings ?? [])],
    };

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
        report.files = await this.applyFilePlan(plan, scope);
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

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/985451842/dsh-snapshot-manager/blob/61ac9bcfee6c9e991eb7655b6a4d3d7d84721bae/README.md#L1-L22)

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

## 0.3.0 重点变更

这一版按可靠性审计做了一轮整体加固，升级后**必须重启应用或禁用/启用一次插件**让 Host 重新加载。

- **快照链完整性**：`trim` 删除最老记录前，会先把新的最老记录提升为 `full` 基座；手动删除只允许删叶子，拒绝删还有子记录的基线。`resolveTree` 现在区分“完整树”和“残缺树”，残缺链直接拒绝回滚，避免把大量文件误判成“快照之后新建”而删除。
- **一次一令牌 + 二次确认**：`/preview` 签发 5 分钟有效、只能用一次的 `planToken`，并绑定完整计划摘要。执行前客户端要求再确认一次；预览之后清单变了（新增/删除文件、目录变化），令牌校验会失败并要求重新预览。执行始终使用完整清单，不再受 HTTP 展示上限 500 条影响。
- **回滚事务日志与中断恢复**：每次文件回滚写 `restore/<tx>.json`，记录 `in-progress`/`done`/`partial`/`failed`。进程中途退出后重启会把残留事务标成 `interrupted`，面板顶部出现恢复入口：可以继续还原目标，或回到回滚前恢复点。写文件改为同目录临时文件 + fsync + rename，对象写入也会校验内容哈希。
- **撤销回滚**：时间线里的“回滚前”记录现在有“撤销这次回滚…”入口，默认只恢复文件、不重复 fork 对话；回滚报告会显示恢复点、事务 id、失败明细与警告，不再在新会话创建后把报告清空。
- **跨会话正确性**：增量快照改为相对“本会话上一条快照”的树，而不是全局工作区索引；采集、手动采集、预览、回滚都按工作区串行化，多个会话共用同一 cwd 时不会互相漏文件。
- **边界提示**：扫描会统计符号链接/junction、排除项、超大文件、不可读项和 `.git` 目录，并在预览里提示“这些不会回滚”；回滚写入前做 `realpath` 校验，拒绝通过目录链接写到工作区外；会话 cwd 变化会更新缓存，跨 cwd 的对话回退会被跳过并提示。
- **已知仍不完整**：`journal`（只恢复本会话修改的文件）仍只认 `write`/`edit`/`str_replace_editor`，经终端/构建/子代理的改动不在其中；`.git` 的提交、分支、索引状态仍不参与回滚；权限、可执行位、mtime 等元数据不恢复。这些会在预览里明确提示，但不会假装已覆盖。

```

</details>

#### 缺口

- 排除项和session-only漏记对用户恢复预期的影响未知
  **影响**：可能把部分回滚误认为完整回滚
  **进一步探讨**：构造含shell/build/subagent、.git、权限、大文件和symlink的50例恢复矩阵，统计未提示残留和误删除

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
