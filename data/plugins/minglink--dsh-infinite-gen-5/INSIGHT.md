# 无限五代 IG5

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a478030](https://github.com/Minglink/dsh-infinite-gen-5/tree/a478030f78b1cd4b2ba501d2f274536b82c1e45a)

<!-- BEGIN META -->
[![GitHub ★ 4,110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Minglink/dsh-infinite-gen-5)
<!-- END META -->

> **功能**：集成 Reverse、Ghidra 静态分析和 x64dbg 无头调试，并提供 HTTP 流量采集与分析。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将跨数据库标注交接变成可预览的单向计划。摘要绑定计划，双会话锁内重新核对修订与前后值，能在写入前拦住已过时的计划。

> **主要限制**：[Q03](#research-q03) 按行执行可留下部分修改，进程中断还可能使目的库变动与本地计划记录无法直接对账。

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
  - [Q01 · 哪类逆向协作适合用 IG5 交接标注？](#detail-section-11)
  - [Q02 · preview 和 apply 如何连接到宿主并发现过期内容？](#detail-section-12)
  - [Q03 · 拒绝、取消或写入中断后能否恢复？](#detail-section-13)
  - [Q04 · 试用要承担哪些负担，何时退回人工？](#detail-section-14)
  - [Q05 · 能否用逐行持久回执缩小未知写入范围？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在两个分析数据库之间交接同一授权样本的少量标注与字节改动，并保留审阅依据。

手工对齐 RVA 并在目的引擎复制名称、注释或字节。全量数据库同步以及跨版本语义迁移超出本次支持范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预览标注交接 | 查阅两侧标识和预期变更 | 两库已打开同一哈希，限支持的变更类别 |
| 应用跨库计划 | 把逐行变更写入目的库 | 审批、摘要和修订校验，可能部分提交 |
| 记录审批后结果 | 便于对照操作与执行返回 | 审计写入失败不回滚操作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与对应 runtime | 必需 | 装载工具和两条数据库路径 | 停止并检查已加载模块与运行资产 |
| 两个同哈希样本会话和宿主审批 | 双库应用必需 | 比较目的内容及批准写入 | 不派发申请未明确通过的变更 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户启动隔离 profile 和备份库，检查 doctor | 两端后端可用 |
| 预览 | 用户选少量名称并审查计划 | 两端身份及前后值匹配 |
| 应用 | 用户审批后核对目的库 | 部分写入或状态不明时停止并恢复副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行资产下载和双库磁盘 | 安装、校验与备份 | 费用、用时未知 |
| 持续 | 双引擎进程与报告存储 | 预览审查、目的库验收 | 任务数量和单件成本未知 |
| 失败恢复 | 备份与数据库对账空间 | 核对已持久内容并恢复 | 部分提交可能增加复核，耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 标注交接 | 可预览并拦截修订不符的计划 | 合格任务节时和覆盖率 |
| 写入诊断 | 返回已确认行及失败行的恢复字段 | 崩溃后每条修改的实际持久状态 |

> **思考**：[Q03](#research-q03) 按行执行可留下部分修改，进程中断还可能使目的库变动与本地计划记录无法直接对账。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将跨数据库标注交接变成可预览的单向计划。摘要绑定计划，双会话锁内重新核对修订与前后值，能在写入前拦住已过时的计划。

[Q02](#research-q02) 把用户审阅和锁内复查接起来，且要求目的库当前值匹配。[Q03](#research-q03) 区分前置拒绝、后端失败和事后审计失败，可为调用者提供不同恢复动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 按行执行可留下部分修改，进程中断还可能使目的库变动与本地计划记录无法直接对账。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从授权副本的少量函数名开始，事先保存两个数据库的可恢复副本。出现变更范围不明或无法解释的持久修订时，恢复副本并在原工具逐项核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查宿主接入、双库计划和审批分支的固定源码。实际加载、调试、恢复质量和未来回执方案尚待验证。

- 已检查：作者 README、包清单、源码路径 integration_tools.js、index.js、source/approval_gate.js、HARNESS_PLUGIN.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦根 DSH 插件的跨库同步路径及审批边界。其余工具、平台组合和后端二进制行为未逐项复核。
- 下一步：在备份库上对三条标注分别测试正常应用、目的修订漂移和单行执行后进程退出，记录实际变化、持久回执和恢复时间。

**分析版本**

- **仓库**：[Minglink/dsh-infinite-gen-5](https://github.com/Minglink/dsh-infinite-gen-5)
- **版本号**：1.3.0（[固定提交 a478030](https://github.com/Minglink/dsh-infinite-gen-5/tree/a478030f78b1cd4b2ba501d2f274536b82c1e45a)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设用绑定计划摘要的逐行待执行记录和后端回执，可以缩小进程中断后须人工对账的范围。

在备份库上对三条标注分别测试正常应用、目的修订漂移和单行执行后进程退出，记录实际变化、持久回执和恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 131 | 7482 | — | — | 254670 |
| .js | source | 174 | 25996 | 24589 | 775 | — |
| .mjs | source | 290 | 31743 | 30154 | 742 | — |
| .mjs | example | 31 | 1409 | 1274 | 104 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：获授权的逆向工程人员能否用宿主里的双数据库修改计划，安全地交接同一样本的少量标注？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类逆向协作适合用 IG5 交接标注？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已在两个分析数据库打开同一授权二进制、需要把少量经确认的函数名、行尾注释或字节改动交到另一侧的逆向人员。手工流程要对齐地址、抄写前后值并逐项核对。IG5 把单向变更组织成带两端标识和前后值的可审阅计划，合格交付是目的库的预期行变化与可回看证据。遇到不同样本、类型定义或仅有语义相似的函数时，仍需独立分析和人工迁移。

#### 证据与依据

**依据 1 · 作者声明**：[HARNESS_PLUGIN.md:65-69](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/HARNESS_PLUGIN.md#L65-L69)

作者限定同哈希、显式 RVA 和三类变更，并声明不存在全局 Undo。

```text
## 显式跨引擎 changeset

仅支持**同一文件哈希**在 Reverse/Ghidra 数据库间按显式 RVA 单向复制名称、行尾注释与有限字节；不自动同步全部分析结果或结构体。两个目标均先打开。preview 保存前后值、数据库 attachment/revision 与 digest，apply 重新检查哈希、修订及所有原值。示例见 [README](README.md#三引擎工程与跨引擎修改计划)。

apply 锁定两个参与数据库的修改队列，逐条记录目的后端操作日志。失败返回已应用项和剩余项，`atomic=false`；remaining 仅表示未确认，失败原语也可能已提交，须核对 `failed.committed/saved/recoveryRequired` 并恢复目的数据库。已尝试计划不可重放，需要重新 preview。没有跨引擎全局原子 Undo；名称相同不证明类型或语义一致。
```

**依据 2 · 源码核查**：[integration_tools.js:167-175](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L167-L175)

仅保存有变化的选定行，并返回摘要与两端证据。

```text
            if (selection.kind === 'patch' && (before.length !== size * 2 || after.length !== size * 2)) throw new Error('Incomplete byte evidence');
            if (before !== after) rows.push({ kind: selection.kind, rva: selection.rva, sourceEA, destinationEA, size, before, after });
          }
          verify(source, context.source); verify(destination, context.destination);
          const plan = { schema: 1, id: randomUUID(), target: path.resolve(args.target), createdAt: new Date().toISOString(), ...context, rows };
          const planDigest = digest(plan);
          fs.mkdirSync(directory, { recursive: true });
          fs.writeFileSync(filename(plan.id), JSON.stringify({ plan, digest: planDigest }, null, 2), { flag: 'wx' });
          return { action: 'preview', plan_id: plan.id, plan_digest: planDigest, ...plan, _ig5: context.destination, note: 'Review all rows before applying. Names and comments do not imply matching data types.' };
```

#### 缺口

- 未取得相同任务的实际交接记录。
  **影响**：重复频率和净省时未知。
  **进一步探讨**：用同一小样本的标注集比较手工与插件的正确性和时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · preview 和 apply 如何连接到宿主并发现过期内容？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口将引擎管理器、审批事件和工具定义接入宿主。preview 独占创建带摘要的计划文件，apply 要求计划摘要及目标匹配。等到两个会话都上锁之后再次读计划状态，重新检查两端身份和每一行当前值，写入 attempted 才开始目的引擎 RPC。用户面对的是可检查的预览与短时修订约束。锁和前置比较覆盖这一条调用路径，无法据此推定其他进程写数据库时也服从同一约束。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1205-1211](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/index.js#L1205-L1211)

工具定义数组接入 defineIntegrationTools。

```text
        return mgr.rpc(mgr.get(target), 'fingerprint', {});
      },
    },
    ...defineAdvancedTools(mgr, cfg, textRender),
    ...defineIntegrationTools(mgr, cfg, textRender),
    ...defineAnalysisTools(mgr, cfg, textRender),
    ...defineCaptureTools(ctx, mgr, cfg, textRender),
```

**依据 2 · 源码核查**：[index.js:1220-1239](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/index.js#L1220-L1239)

宿主 apply 创建 WorkerManager，挂载审批后建立工具定义。

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx, config = {}) {
  const cfg = resolveConfig(config);
  diagAppend(cfg, `host: implementation=${IMPLEMENTATION_REVISION} module=${fileURLToPath(import.meta.url)}`);
  const mgr = new WorkerManager(cfg);
  // AnalysisArtifacts is installed by defineAnalysisTools later in registration.
  let failureRecords, capabilityAcceptance;
  Object.defineProperties(mgr, {
    failures: { get: () => failureRecords ||= new FailureRecords({ root: cfg.projectRoot, artifacts: mgr.analysis.artifacts }) },
    capabilityAcceptance: { get: () => capabilityAcceptance ||= new CapabilityAcceptance({ root: cfg.projectRoot, artifacts: mgr.analysis.artifacts, cfg }) },
  });
  mgr.coordination = installDelegationControl(ctx, cfg);
  mgr.memory = installLcmBridge(ctx, cfg);
  ctx.effect(() => () => mgr.memory.dispose());
  installDiagRoute(ctx, cfg);
  installJobsRoute(ctx, mgr, cfg);
  installDataRoute(ctx, mgr, cfg);
  installApprovalGate(ctx, cfg);

  ctx.effect(() => {
    const definitions = defineIg5Tools(ctx, mgr, cfg).map((definition) => {
```

</details>

**依据 3 · 源码核查**：[integration_tools.js:177-210](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L177-L210)

计划比对、锁内重查及执行前写入 attempted。

<details>
<summary>查看原文（34行）</summary>

```text
        if (args.action !== 'apply') throw new Error('action must be preview or apply');
        const file = filename(args.plan_id);
        const record = JSON.parse(fs.readFileSync(file, 'utf8'));
        const { plan } = record;
        if (record.applied || record.attempted) throw new Error('This changeset has already been attempted; create a fresh preview');
        if (digest(plan) !== record.digest || args.plan_digest !== record.digest) throw new Error('Changeset digest does not match the reviewed preview');
        if (path.resolve(args.target).toLowerCase() !== plan.target.toLowerCase()) throw new Error('Changeset target mismatch');
        const source = opened(mgr, args.target, plan.source.engine);
        const destination = opened(mgr, args.target, plan.destination.engine);
        const apply = async () => {
          mgr.checkCancelled?.();
          // Another call may have consumed this file while this request waited.
          const latest = JSON.parse(fs.readFileSync(file, 'utf8'));
          if (latest.attempted || latest.applied) throw new Error('This changeset has already been attempted; create a fresh preview');
          verify(source, plan.source); verify(destination, plan.destination);
          // Recheck every row before the first mutation, including overlapping byte ranges.
          for (const row of plan.rows) {
            const [left, right] = await Promise.all([mgr.rpc(source, 'inspect', { ea: row.sourceEA, size: row.size }),
              mgr.rpc(destination, 'inspect', { ea: row.destinationEA, size: row.size })]);
            if ((left[fields[row.kind]] || '') !== row.after || (right[fields[row.kind]] || '') !== row.before) throw new Error('Changeset before/after evidence changed');
          }
          mgr.checkCancelled?.();
          verify(source, plan.source); verify(destination, plan.destination);
          record.attempted = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
          const applied = [];
          let error, failed;
          for (const row of plan.rows) {
            try {
              mgr.checkCancelled?.();
              const params = row.kind === 'rename' ? { ea: row.destinationEA, new_name: row.after }
                : row.kind === 'comment' ? { ea: row.destinationEA, text: row.after }
                  : { ea: row.destinationEA, hex: row.after, expected: row.before };
              const result = await mgr.rpc(destination, row.kind, params);
```

</details>

**依据 4 · 源码核查**：[integration_tools.js:224-229](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L224-L229)

调用使用两个会话的锁，并明确响应非原子。

```text
          return { ok: !error, action: 'apply', plan_id: plan.id, applied, remaining: plan.rows.slice(applied.length),
            error, failed, destination: mgr.evidence(destination), _ig5: mgr.evidence(destination), atomic: false,
            note: 'Remaining rows are unconfirmed, not necessarily unchanged. A failed primitive may have committed; inspect failed.committed/saved/recoveryRequired and recover the destination before generating another plan.' };
        };
        // Both participating databases are locked, so another approved tool cannot mutate a source halfway through the plan.
        return mgr.withSessions([source, destination], apply);
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 拒绝、取消或写入中断后能否恢复？

**研究主题**：缺陷与关键质疑

#### 完整回答

宿主审批服务必须明确返回一次批准才继续。写后审计另走 post-execute，落盘异常只尝试诊断，写入结果仍可保留。apply 在逐行 RPC 出错后停止并返回已确认行、未确认行及失败字段，目标引擎可能已写入失败行。原计划已经标记尝试过，再次应用会拒绝。发生这类失败时应冻结目的库、核对实际字节和持久修订，确认后再从新预览开始。进程若在 RPC 后、完成记录前退出，本路径没有逐行已持久回执可供完整重建。

#### 证据与依据

**依据 1 · 源码核查**：[source/approval_gate.js:61-82](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/source/approval_gate.js#L61-L82)

缺少真实 agent、服务异常、取消和非 allowed-once 分别拒绝或取消。

<details>
<summary>查看原文（22行）</summary>

```text
    // Resolve the public approval seam here. Some host builds turn a rejected
    // `ask` into an allow; a plugin-owned deny must remain a deny.
    if (exec?.signal?.aborted) return { kind: 'cancel' };
    let approval;
    try { approval = ctx.get('approval'); } catch { /* uncomposed host */ }
    if (!exec?.agent || typeof approval?.request !== 'function')
      return { kind: 'deny', reason: `IG5 ${exec.name} requires an active agent and an available approval service.` };
    let outcome;
    try {
      outcome = await approval.request({ agent: exec.agent, toolName: exec.name,
        callId: exec.callId, ...request, signal: exec.signal });
    } catch {
      if (exec?.signal?.aborted) return { kind: 'cancel' };
      return { kind: 'deny', reason: `IG5 ${exec.name} approval could not be confirmed; operation was not dispatched.` };
    }
    if (exec?.signal?.aborted || outcome === 'cancelled') return { kind: 'cancel' };
    if (outcome !== 'allowed-once')
      return { kind: 'deny', reason: `IG5 ${exec.name} approval was ${outcome === 'rejected' ? 'rejected' : 'unavailable'}; operation was not dispatched.` };
    return next();
  });
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
```

</details>

**依据 2 · 源码核查**：[source/approval_gate.js:94-102](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/source/approval_gate.js#L94-L102)

事后审计失败尝试诊断，随后调用 next。

```text
        isError: result?.isError === true,
        detail: result?.isError ? result?.error?.message : result?.value,
      };
      fs.appendFileSync(path.join(cfg.artifactDir, 'approvals.jsonl'), JSON.stringify(rec) + '\n', 'utf8');
    } catch (error) {
      // 审计失败不能破坏结果路径，但必须留下痕迹：该操作已执行而审计行没有落盘。
      try { diagAppend(cfg, `audit: 审计行写入失败，操作已执行但无记录 tool=${exec.name} callId=${exec.callId ?? ''} code=${error?.code ?? 'unknown'}`); } catch { /* diagnostics are best-effort */ }
    }
    return next();
```

**依据 3 · 源码核查**：[integration_tools.js:199-226](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L199-L226)

预写 attempted 与末尾批量落盘之间执行每行 RPC，失败返回目的库恢复字段。

<details>
<summary>查看原文（28行）</summary>

```text
          verify(source, plan.source); verify(destination, plan.destination);
          record.attempted = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
          const applied = [];
          let error, failed;
          for (const row of plan.rows) {
            try {
              mgr.checkCancelled?.();
              const params = row.kind === 'rename' ? { ea: row.destinationEA, new_name: row.after }
                : row.kind === 'comment' ? { ea: row.destinationEA, text: row.after }
                  : { ea: row.destinationEA, hex: row.after, expected: row.before };
              const result = await mgr.rpc(destination, row.kind, params);
              if (result?.ok === false) throw new Error(result.error || 'Engine rejected the change');
              applied.push({ ...row, result });
            } catch (failure) {
              error = failure.message;
              failed = { row };
              for (const field of ['code', 'committed', 'saved', 'recoveryRequired', 'stage', 'journalId', 'revision', 'durableRevision']) {
                if (failure[field] !== undefined) failed[field] = failure[field];
              }
              break;
            }
          }
          record.applied = applied; record.error = error; record.failed = failed; record.finishedAt = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
          return { ok: !error, action: 'apply', plan_id: plan.id, applied, remaining: plan.rows.slice(applied.length),
            error, failed, destination: mgr.evidence(destination), _ig5: mgr.evidence(destination), atomic: false,
            note: 'Remaining rows are unconfirmed, not necessarily unchanged. A failed primitive may have committed; inspect failed.committed/saved/recoveryRequired and recover the destination before generating another plan.' };
```

</details>

#### 缺口

- 实际后端在崩溃时如何保留数据库写入未复现。
  **影响**：不能预估恢复时间或断电下的可判定比例。
  **进一步探讨**：在备份样本库对单条 RPC 前后做中断实验，核对磁盘值和版本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用要承担哪些负担，何时退回人工？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已经维护 Windows 逆向环境和两个样本库的工程师，可用隔离 profile 与授权样本副本试一次两三条名称的单向交接。作者的完整安装包含引擎资源，源码安装另需经过校验的运行资产，重启后要用 doctor 核实相应后端。与手工抄录相比，试用要额外核对 runtime、准备副本并审阅预览。两边目标或修订不同、结果提示 recoveryRequired、或目的库存在无法解释的变化时停止写入，恢复备份并用原分析器核对。单位成果是按预期变更且可复查的一份目的库，现金、资源和人工时间均应独立记录。

#### 证据与依据

**依据 1 · 作者声明**：[HARNESS_PLUGIN.md:97-113](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/HARNESS_PLUGIN.md#L97-L113)

作者给出 PowerShell 安装、运行资产、重启与 doctor 验证的依赖。

<details>
<summary>查看原文（17行）</summary>

````text
## 安装与便携 runtime

完整发行包在 `plugin/` 根目录包含 `runtimes/ghidra`、`runtimes/x64dbg`，运行不依赖外部 `.dsh/ig5/runtimes`。在完整解压根目录执行 `& .\plugin\install.ps1`，离线校验、暂存并安装整包，备份已有插件并更新 profile；默认缺件或哈希不符即拒绝，现有 DSH 安装不被部分替换。`-RuntimeSource` 保留为显式导入其他已校验包的维护入口，用户无需另跑 setup。在插件目录运行 `.\uninstall.ps1` 卸载。

源码 ZIP / git clone 的新 `install.ps1` 可自动下载 `scripts/distribution.json` 锁定的完整资产，流式验证固定 ZIP 大小/SHA-256 与所有清单后，仅补齐 `runtimes/` 和 `third_party/sources/`，不替换当前源码。供体固定为已发布的 `IG5-1.0.0-Windows-x64-dsh021-full-20261010.zip`，其 SHA-256 为 `a2459ddca1f19e5eec2d7918c504f133889809800a0b277e1e379d3ce1459b54`；不能因更新插件代码而把供体指向包含自身描述文件的新 ZIP，产生自引用哈希。离线可在最新源码根目录使用：

```powershell
& .\install.ps1 -DistributionArchive 'D:\IG5-1.0.0-Windows-x64-dsh021-full-20261010.zip' -Offline
# 或使用已完整验证的解压供体根目录（含 manifest.json 与 plugin/）
& .\install.ps1 -DistributionRoot 'D:\已解压的完整发行包' -Offline
```

两个供体参数互斥；ZIP 应置于插件源码目录之外。对于包含新安装器的完整包，`-RepairAssets` 可显式恢复不变资产：完整外层清单及插件核心代码必须先通过校验，再从固定原 ZIP 或已验证解压供体替换运行时/上游源码并复验。缺少外层清单、核心代码变化、资产固定哈希不符仍拒绝；`-RepairAssets` 不能与 `-RuntimeSource` 合用。旧完整包的安装器没有新参数，用户应重新下载最新源码并使用其 `-DistributionArchive` 离线入口，不能把新脚本拷进旧 SHA-256 封存包。具体恢复命令见 [README 安装说明](README.md#local-install)。SHA-256 不符时保留相对路径、Expected/Actual SHA-256、文件大小和原始 ZIP 哈希；其他用户文件变化的原因尚未确定，不归咎某种解压器，不改清单或跳过校验。

安装器为各 profile 的 `node_modules/dsh-infinite-gen-5` 建立指向完整 `.dsh/plugins/dsh-infinite-gen-5` 的 Junction，并核验入口可读两份 runtime manifest；运行时从已加载模块的物理目录解析，支持 `--preserve-symlinks`。普通 npm 源码副本缺包会报告安装指引，不暗中借用其他版本目录；显式 `runtimeRoot` 或引擎覆盖错误时也不回退。安装成功后须完全退出并重启 DSH，再执行 `ig5_doctor engine=ghidra`。新源码修复不会自动修改已发布旧附件，完整包是否包含本次变更以 [Release 的版本说明和验证报告](https://github.com/Minglink/dsh-infinite-gen-5/releases/latest) 为准。

Ghidra runtime 包含自身 Ghidra/JDK/Python，x64dbg runtime 包含 x86/x64 debugger/Python/native bridge；不修改 Reverse 安装、全局 Python 或引擎 site-packages。`scripts/setup_ghidra_runtime.ps1`、`scripts/setup_x64dbg_runtime.ps1` 是维护者联网重建资产的脚本，不是默认安装前置依赖。`scripts/package_portable.ps1` 生成自包含目录及文件大小/SHA-256 清单；不附带 DSH、商业 Reverse 程序、用户项目或缓存，用户工程需单独备份，`-IncludeProjects` 明确拒绝。
````

</details>

**依据 2 · 源码核查**：[integration_tools.js:191-196](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L191-L196)

两库和内容发生变化会阻止计划继续。

```text
          verify(source, plan.source); verify(destination, plan.destination);
          // Recheck every row before the first mutation, including overlapping byte ranges.
          for (const row of plan.rows) {
            const [left, right] = await Promise.all([mgr.rpc(source, 'inspect', { ea: row.sourceEA, size: row.size }),
              mgr.rpc(destination, 'inspect', { ea: row.destinationEA, size: row.size })]);
            if ((left[fields[row.kind]] || '') !== row.after || (right[fields[row.kind]] || '') !== row.before) throw new Error('Changeset before/after evidence changed');
```

**依据 3 · 源码核查**：[integration_tools.js:214-226](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L214-L226)

失败可能需要核查已提交、已保存和持久修订。

<details>
<summary>查看原文（13行）</summary>

```text
              error = failure.message;
              failed = { row };
              for (const field of ['code', 'committed', 'saved', 'recoveryRequired', 'stage', 'journalId', 'revision', 'durableRevision']) {
                if (failure[field] !== undefined) failed[field] = failure[field];
              }
              break;
            }
          }
          record.applied = applied; record.error = error; record.failed = failed; record.finishedAt = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
          return { ok: !error, action: 'apply', plan_id: plan.id, applied, remaining: plan.rows.slice(applied.length),
            error, failed, destination: mgr.evidence(destination), _ig5: mgr.evidence(destination), atomic: false,
            note: 'Remaining rows are unconfirmed, not necessarily unchanged. A failed primitive may have committed; inspect failed.committed/saved/recoveryRequired and recover the destination before generating another plan.' };
```

</details>

#### 缺口

- 未验收固定提交对应完整发行包。
  **影响**：跨环境能否加载以及初次准备工作量未知。
  **进一步探讨**：核对发行资产和宿主版本后，在一次性 profile 中验证 doctor、预览、应用和退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用逐行持久回执缩小未知写入范围？

**研究主题**：新假设与验证

#### 完整回答

假设是在 plan digest 下为每行先保存带两端修订的待执行记录，调用后再保存可核对的后端回执。现有 attempted 只能证明整份计划已进入尝试；逐行记录可望让重启后至少区分从未派发与已派发待核查，仍应把回执缺失的 RPC 当作未知。用三个名称变更，在每行调用前、返回后与记录前分别终止，比较能正确重建的行数、恢复时间及额外 I/O。如果实际数据库变更与回执仍普遍无法对上，或额外写入开销使小批次不值得用，该假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[integration_tools.js:198-223](https://github.com/Minglink/dsh-infinite-gen-5/blob/a478030f78b1cd4b2ba501d2f274536b82c1e45a/integration_tools.js#L198-L223)

现有文件先标记一次尝试，所有 RPC 执行后统一保存结果。

<details>
<summary>查看原文（26行）</summary>

```text
          mgr.checkCancelled?.();
          verify(source, plan.source); verify(destination, plan.destination);
          record.attempted = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
          const applied = [];
          let error, failed;
          for (const row of plan.rows) {
            try {
              mgr.checkCancelled?.();
              const params = row.kind === 'rename' ? { ea: row.destinationEA, new_name: row.after }
                : row.kind === 'comment' ? { ea: row.destinationEA, text: row.after }
                  : { ea: row.destinationEA, hex: row.after, expected: row.before };
              const result = await mgr.rpc(destination, row.kind, params);
              if (result?.ok === false) throw new Error(result.error || 'Engine rejected the change');
              applied.push({ ...row, result });
            } catch (failure) {
              error = failure.message;
              failed = { row };
              for (const field of ['code', 'committed', 'saved', 'recoveryRequired', 'stage', 'journalId', 'revision', 'durableRevision']) {
                if (failure[field] !== undefined) failed[field] = failure[field];
              }
              break;
            }
          }
          record.applied = applied; record.error = error; record.failed = failed; record.finishedAt = new Date().toISOString();
          fs.writeFileSync(file, JSON.stringify(record, null, 2));
```

</details>

#### 缺口

- 逐行回执方案没有实现或运行验证。
  **影响**：无法确定比数据库对账多提供多少可信状态。
  **进一步探讨**：对同一目标库的同一组小变更，做配对故障注入并核对磁盘结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
