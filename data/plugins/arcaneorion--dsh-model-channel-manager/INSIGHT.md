# dsh-model-channel-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[bcb5c5a](https://github.com/ArcaneOrion/dsh-model-channel-manager/tree/bcb5c5a634552e357aa0ae992f3396d19048f2a3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ArcaneOrion/dsh-model-channel-manager) [![npm 30d 2,291](https://img.shields.io/static/v1?label=npm+30d&message=2%2C291&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager)
<!-- END META -->

> **实现功能**：管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。

> **核心亮点**：相对手动换模型和单渠道调用，插件把候选能力过滤、首响应故障转移及健康/测速组织成虚拟路由，并在内容输出后拒绝拼接另一个模型，保留流语义。任务预留与配置分离减少运行指标写配置的耦合。真实模型能力、宿主LLM流和存储来自上游，不能将可用率提升直接当任务质量提升。[Q01](#research-q01)

> **风险与缺陷**：用户是否把totalBudgetMs理解为请求硬截止会改变可预期性。组层在开新尝试前检查剩余预算，streamAttempt内部只检查首响应/空闲超时，并不接收组截止时间；持续有chunk的长流可能越过组预算。切候选还可能改变模型行为与费用，健康成功只代表流终止成功，不证明合格业务结果。[Q02](#research-q02)

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
  - [Q01 · 故障转移在何时切换，贡献是什么？](#detail-section-11)
  - [Q02 · 总预算和健康数值能证明什么？](#detail-section-12)
  - [Q03 · 任务持久、配置和采用依赖如何？](#detail-section-13)
  - [Q04 · 端到端截止与能力分组能否改善路由可预期性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向维护多个真实模型渠道的用户，用虚拟轮询组处理首响应失败，并集中检查配置、测试和健康记录。

替代为宿主显式选择真实渠道并失败后人工换模型，或简单轮询adapter。插件主要改变故障处理和维护流程，任务输出质量仍需按同模型能力与预算对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 虚拟轮询路由 | sticky、round-robin、primary候选选择 | 只引用真实渠道，能力不完全等价 |
| 流式故障转移 | 首内容前重试或切换 | 内容后直接失败，避免混流 |
| 模型测试与测速任务 | 测候选可用性和延迟 | 真实调用花预算，保留nonce范围内去重 |
| 健康运行态 | 查询留存请求与任务状态 | 统计成功不等于任务质量，存储可退内存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.0-rc.1 LLM/Settings/Gateway | 核心必需 | 虚拟adapter和管理 | 其他版本需独立验收 |
| 可用真实渠道及credentials | 路由必需 | 执行模型请求 | 组耗尽后失败 |
| storageDomain | 跨重启持久必需 | 健康与任务运行态 | 内存模式不保留新状态 |
| web客户端接口与React | 管理界面必需 | 编辑和健康页 | host路由存在不证明界面可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对候选、凭据和预算 | 能力可替代且测试可撤销 |
| 配置 | 用户保存真实provider和轮询组 | 检查部分成功与revision冲突 |
| 请求 | 选择roundrobin组 | 输出归属与一次终止正确 |
| 验收 | 模拟失败取消并核对任务 | 不混流、不重放，费用在可接受范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多渠道账号、宿主与存储，金额未知 | 配候选能力、权限和预算 | 模型可替代性须人工确认 |
| 持续使用 | 正常请求、失败重试、可选后台测速 | 复核输出、健康窗口和费用 | token与服务价格未实测 |
| 失败恢复 | 取消、任务重试与迁移资源未知 | 核对终态、配置部分成功和重启中断 | 总预算非硬截止，不计算虚假单位成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 故障转移 | 首内容前可换候选，已输出后终止 | 真实可用率及业务质量改善 |
| 测试恢复 | nonce去重、持久预留和重启中断 | 各storage故障下最终恢复 |
| 健康统计 | 流usage及结果可记录 | 留存样本并非无限历史或任务质量 |

> **思考**：用户是否把totalBudgetMs理解为请求硬截止会改变可预期性。组层在开新尝试前检查剩余预算，streamAttempt内部只检查首响应/空闲超时，并不接收组截止时间；持续有chunk的长流可能越过组预算。切候选还可能改变模型行为与费用，健康成功只代表流终止成功，不证明合格业务结果。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手动换模型和单渠道调用，插件把候选能力过滤、首响应故障转移及健康/测速组织成虚拟路由，并在内容输出后拒绝拼接另一个模型，保留流语义。任务预留与配置分离减少运行指标写配置的耦合。真实模型能力、宿主LLM流和存储来自上游，不能将可用率提升直接当任务质量提升。[Q01](#research-q01)

相对手动换模型和单渠道调用，插件把候选能力过滤、首响应故障转移及健康/测速组织成虚拟路由，并在内容输出后拒绝拼接另一个模型，保留流语义。任务预留与配置分离减少运行指标写配置的耦合。真实模型能力、宿主LLM流和存储来自上游，不能将可用率提升直接当任务质量提升。[Q01](#research-q01)

首内容作为提交边界避免跨模型流拼接，Abort传播、有界close和原子指针推进值得借鉴。TaskService先persist预留再调用，失败不发请求，终态持久失败显式标记；幂等只覆盖保留nonce，完成任务裁剪后不能保证永久去重。复用需明确终止块与预算语义，不应把实现复杂度当可靠性证明。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

用户是否把totalBudgetMs理解为请求硬截止会改变可预期性。组层在开新尝试前检查剩余预算，streamAttempt内部只检查首响应/空闲超时，并不接收组截止时间；持续有chunk的长流可能越过组预算。切候选还可能改变模型行为与费用，健康成功只代表流终止成功，不证明合格业务结果。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。核对实际上游费用和合格结果；长流不能只依赖totalBudgetMs作硬限额，必要时外加截止。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

路由、流边界和任务持久协议有源码支持；总预算只约束新尝试准入，健康记录不等于任务质量，兼容及真实节省未本轮验证。硬截止假设未实现。

- 已检查：作者 README、包清单、源码路径 src/index.js、src/channel-state.js、src/health-store.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查host核心路由、流重试、预算、注册及channel-state任务服务，读取README和清单；客户端配置保存、迁移和健康存储未全面审计，未执行模型/测试或框架补丁。
- 下一步：在固定宿主用可控流适配器覆盖首响应挂起、持续chunk长流、内容后失败、取消与storage拒绝，再以同任务同预算真实渠道验收合格率和费用。本轮未执行。

**分析版本**

- **仓库**：[ArcaneOrion/dsh-model-channel-manager](https://github.com/ArcaneOrion/dsh-model-channel-manager)
- **版本号**：0.4.0（[固定提交 bcb5c5a](https://github.com/ArcaneOrion/dsh-model-channel-manager/tree/bcb5c5a634552e357aa0ae992f3396d19048f2a3)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把组剩余预算传入每次尝试并合成硬截止信号，另按任务能力和成本约束建立可替代候选集。用持续心跳长流、首响应失败和能力不等价模型对照现版，要求截止明确且合格任务率不降；若硬截止损失更多可接受结果或约束成本高于手工换模型，则否定。[Q04](#research-q04)

在固定宿主用可控流适配器覆盖首响应挂起、持续chunk长流、内容后失败、取消与storage拒绝，再以同任务同预算真实渠道验收合格率和费用。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1260 | — | — | 25304 |
| .cjs | source | 5 | 338 | 316 | 10 | — |
| .mjs | source | 1 | 419 | 384 | 9 | — |
| .js | source | 4 | 3227 | 2969 | 199 | — |
| .cjs | test | 29 | 2457 | 1910 | 375 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/ArcaneOrion/dsh-model-channel-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：虚拟路由如何保持故障输出语义，预算、健康与配置状态有哪些界限？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 故障转移在何时切换，贡献是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

每个组注册虚拟provider并只引用真实渠道，按策略和能力过滤确定候选。streamAttempt在首内容前缓存非内容块，空完成或失败可抛错给组层重试；首内容输出后标记emitted，后续失败由组层直接终止，不再把第二模型输出接在前段后面。相对手工换模型或简单轮询，增量是提交边界与恢复策略，流协议和真实能力归宿主及供应商。它更适合候选可替代且失败前未产生业务输出的请求，不能自动修复内容已交付后的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:432-468](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L432-L468)

首内容前后分支决定哪些失败可换候选。

<details>
<summary>查看原文（37行）</summary>

```text
                    if (isContentChunk(chunk)) {
                        started = true;
                        ttftMs = Date.now() - attemptStart;
                        for (const b of buffer)
                            yield b;
                        yield chunk;
                    }
                    else if (isTerminalChunk(chunk)) {
                        const reason = chunk.reason || {};
                        // 引擎提前终止的内层流不会被全局拦截器完整排水记账，这里自行记录
                        if (isSuccessReason(reason)) {
                            recordHealth(cand.provider, cand, { ok: false, ttftMs: null, latencyMs: null, code: 'EMPTY_RESPONSE', usage: lastUsage });
                            throw { code: 'EMPTY_RESPONSE', message: 'model returned a completed response with no content' };
                        }
                        const preCode = (reason.failure && reason.failure.code) || 'STREAM_ERROR';
                        recordHealth(cand.provider, cand, { ok: false, ttftMs: null, latencyMs: null, code: preCode, usage: lastUsage });
                        throw { code: preCode, message: (reason.failure && reason.failure.message) || 'candidate stream failed' };
                    }
                    else {
                        buffer.push(chunk);
                    }
                }
                else {
                    if (isTerminalChunk(chunk)) {
                        const reason = chunk.reason || {};
                        if (isSuccessReason(reason)) {
                            recordHealth(cand.provider, cand, { ok: true, ttftMs, latencyMs: Date.now() - attemptStart, code: null, usage: lastUsage });
                            yield chunk;
                            return;
                        }
                        // 内容已向下游输出：绝不能再下发该失败终止块（否则出现 finish 后继续输出/双 finish），
                        // 改为抛错并标记 emitted，由组层直接终结本次请求
                        const midCode = (reason.failure && reason.failure.code) || 'STREAM_ERROR';
                        recordHealth(cand.provider, cand, { ok: false, ttftMs, latencyMs: null, code: midCode, usage: lastUsage });
                        throw { code: midCode, message: (reason.failure && reason.failure.message) || 'candidate stream failed mid-stream' };
                    }
                    yield chunk;
```

</details>

**依据 2 · 源码核查**：[src/index.js:665-679](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L665-L679)

emitted失败直接终止，避免跨模型拼接。

<details>
<summary>查看原文（15行）</summary>

```text
                        if (err && err.emitted) {
                            // 内容已流出后失败：无法干净重放到下一候选（会拼接两个模型的输出/产生第二个 finish），
                            // 置冷却并直接以失败终结本次请求
                            rt.cooldowns.set(key, Date.now() + (cfg.cooldownMs || 0));
                            failedKeys.push(key);
                            pushEvent(cfg, 'midstream-fail', { candidate: key, reason: message });
                            yield failChunk('channel candidate failed after content was already delivered: ' + message, (err && err.code) || 'CHANNEL_MIDSTREAM_FAIL');
                            return;
                        }
                        if (r < (cfg.maxRetriesPerCandidate || 0)) {
                            pushEvent(cfg, 'retry', { candidate: key, attempt: r + 1, reason: message });
                            await ctx.timeout(Math.min(4000, 250 * Math.pow(2, r)));
                            continue;
                        }
                        rt.cooldowns.set(key, Date.now() + (cfg.cooldownMs || 0));
```

</details>

**依据 3 · 源码核查**：[src/index.js:1001-1012](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L1001-L1012)

真实注册adapter与replace提供生产入口。

<details>
<summary>查看原文（12行）</summary>

```text
        const current = llm.listProviders().map((p) => p.id).filter((id) => id.startsWith(ROUTE_PREFIX));
        if (next.length === 0) {
            // 空配置：LLM 服务拒绝注册零 provider 的适配器——推迟首次注册；已注册则清空路由
            if (adapterHandle !== null)
                adapterHandle.replace(next);
            return;
        }
        if (adapterHandle === null)
            adapterHandle = llm.registerAdapter(next, adapter);
        else if (JSON.stringify(current) !== JSON.stringify(next))
            adapterHandle.replace(next);
    }
```

</details>

#### 缺口

- 不同供应商终止协议和同任务质量未验收。
  **影响**：不能从路由存在推断全部渠道可替代。
  **进一步探讨**：用固定任务和流错误矩阵逐渠道验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 总预算和健康数值能证明什么？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

groupStart与budgetLeft在组循环和开始新尝试前检查，注释也说明超预算不再开新尝试；streamAttempt接收候选timeout而无组截止，内容后timeout按lastAt计算。若流持续产生chunk，单次尝试可能超过组totalBudgetMs，所以它是准入预算而非硬截止。健康成功依据成功终止块，不能证明答案或业务交付合格。重试、换模型和自动测速都消耗真实预算，首次配置、持续复核和失败恢复的现金/人工时间未实测，不可用可用率或低延迟直接推导节省。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:397-410](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L397-L410)

尝试计时按首响应或上次chunk，未合入组剩余预算。

<details>
<summary>查看原文（14行）</summary>

```text
        };
        try {
            while (true) {
                if (outerSignal && outerSignal.aborted)
                    throw { code: 'ABORTED', message: 'request aborted' };
                const remaining = Math.max(0, timeoutMs - (Date.now() - (started ? lastAt : attemptStart)));
                if (remaining <= 0)
                    throw { code: 'TIMEOUT', message: 'channel candidate timed out after ' + timeoutMs + 'ms' };
                // guard 覆盖全量 remaining：不能 cap 到 30s，否则 timeoutMs>30s 的首响应
                // 超时与动态超时（min(120s, ttft×2)）在 >30s 区间全部退化为 30s 切候选
                const guard = timed(Math.max(1, remaining), () => ({ code: 'TIMEOUT', message: 'channel candidate timed out after ' + timeoutMs + 'ms' }));
                let next;
                try {
                    next = await Promise.race([inner.next(), guard.promise]);
```

</details>

**依据 2 · 源码核查**：[src/index.js:601-613](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L601-L613)

组预算在循环边界检查。

<details>
<summary>查看原文（13行）</summary>

```text
        // 总请求预算（F01 配套）：组级起点。超预算不再开新尝试。
        const groupStart = Date.now();
        const budgetMs = cfg.totalBudgetMs || 600000;
        const budgetLeft = () => budgetMs - (Date.now() - groupStart);
        while (true) {
            if (options.signal && options.signal.aborted) {
                yield abortedChunk('request aborted');
                return;
            }
            if (budgetLeft() <= 0) {
                pushEvent(cfg, 'budget-exhausted', { budgetMs, failures: failedKeys.slice() });
                yield failChunk('channel group "' + cfg.id + '" exhausted its total budget of ' + budgetMs + 'ms: ' + (lastFail || 'multiple failures'), 'CHANNEL_BUDGET_EXCEEDED');
                return;
```

</details>

**依据 3 · 源码核查**：[src/index.js:636-643](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L636-L643)

尝试启动前检查，调用没有传组deadline。

```text
                    }
                    if (budgetLeft() <= 0)
                        break; // 预算耗尽：不开新尝试，交给组层终结
                    const attemptStart = Date.now();
                    try {
                        const attempt = streamAttempt(cfg, cand, options, attemptStart);
                        for await (const chunk of attempt)
                            yield chunk;
```

#### 缺口

- 长流、重试和测速的真实总费用未知。
  **影响**：不能把10分钟配置当绝对运行或金额上限。
  **进一步探讨**：构造持续chunk越界流，并记录同任务总调用及费用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务持久、配置和采用依赖如何？

**研究主题**：依赖、兼容与流程、工程质量与复用、采用判断

#### 完整回答

TaskService按nonce与参数hash判断重复，持久预留失败就删除任务且不调模型，成功后才启动可取消操作；终态落盘失败保留内存结果并显示persistenceError。重启把旧running标ABORTED，不重放；完成记录只保留100条，幂等不能无限期延伸。依赖固定RC、LLM/Settings/Gateway与真实渠道，storage缺失可退内存但不跨重启。适合能管理多渠道与预算者试用，须核对取消、不混流、配置冲突与部分保存，不能以任务登记成功代表模型测试完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/channel-state.js:114-122](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/channel-state.js#L114-L122)

重启运行任务中断而不重放。

```text
  restore(rows = []) {
    for (const row of rows) {
      if (!row || typeof row.id !== 'string') continue;
      if (this.running.has(row.id)) continue;
      this.tasks.set(row.id, row.status !== 'running' ? row : row.finishedAt
        ? { ...row, status: row.ok === true ? 'ok' : 'error' }
        : { ...row, status: 'error', code: 'ABORTED', error: '宿主已重启，任务未重放', finishedAt: Date.now() });
    }
  }
```

**依据 2 · 源码核查**：[src/channel-state.js:130-160](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/channel-state.js#L130-L160)

预留持久、冲突和终态失败协议明确，保留上限限制幂等范围。

<details>
<summary>查看原文（31行）</summary>

```text
  submit(kind, request, run) {
    const reserve = async () => {
      if (this.closed) throw fault('UNAVAILABLE', '插件正在停止');
      const id = request.nonce;
      const fingerprint = createHash('sha256').update(JSON.stringify([kind, request])).digest('hex');
      const old = this.tasks.get(id);
      if (old) {
        if (old.fingerprint !== fingerprint) throw fault('TASK_CONFLICT', '该任务编号已用于另一项请求');
        return this.get(id);
      }
      if (this.running.size >= this.limit) throw fault('BUSY', '同时执行的测试过多，请等待已有任务完成');
      if (kind === 'speed' && [...this.tasks.values()].some(t => t.kind === 'speed' && t.group === request.group && t.status === 'running'))
        throw fault('BUSY', '该轮询组正在测速');
      const row = { id, kind, fingerprint, status: 'running', startedAt: Date.now(), ...(kind === 'test' ? { provider: request.provider, model: request.model } : { group: request.group }) };
      this.tasks.set(id, row);
      try { await this.persist(this.list()); }
      catch (error) { this.tasks.delete(id); throw fault('STORAGE_ERROR', '任务未能保存，未发起模型请求：' + error.message); }
      const controller = new AbortController();
      const operation = { controller, done: null };
      this.running.set(id, operation);
      operation.done = Promise.resolve().then(() => { controller.signal.throwIfAborted(); return run(controller.signal); }).then(
        result => ({ status: 'ok', ...result }),
        error => ({ status: 'error', code: controller.signal.aborted ? 'ABORTED' : error.code || 'STREAM_ERROR', error: controller.signal.aborted ? '任务已取消' : String(error.message || error) }),
      ).then(async result => {
        if (controller.signal.aborted) result = { status: 'error', code: 'ABORTED', error: '任务已取消' };
        this.tasks.set(id, { ...row, ...result, finishedAt: Date.now() });
        const finished = [...this.tasks.values()].filter(t => t.status !== 'running').sort((a, b) => b.finishedAt - a.finishedAt);
        for (const expired of finished.slice(100)) this.tasks.delete(expired.id);
        try { await this.persist(this.list()); }
        catch (error) { this.tasks.get(id).persistenceError = '结果仅保留在当前进程：' + error.message; }
      }).finally(() => this.running.delete(id));
```

</details>

#### 缺口

- 当前storage及Settings集成与作者测试未本轮重跑。
  **影响**：不能宣称真实宿主恢复和迁移已通过。
  **进一步探讨**：在固定RC临时profile验证持久拒绝、重启和并发配置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 端到端截止与能力分组能否改善路由可预期性？

**研究主题**：新假设与验证

#### 完整回答

由组准入预算不约束正在运行尝试，可推导尚未实现的统一截止，合成外部取消、组deadline和候选idle信号，并在候选组注明能力与价格边界。它会拒绝本可最终完成的长任务，需按业务目标权衡。最小实验覆盖持续心跳长流、首响应失败和不同能力候选，在同预算下要求终止时刻可预测、无混流且合格任务率可接受；若更早中断使结果损失超过费用控制收益，就否定普遍采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:601-613](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L601-L613)

组预算边界提供硬截止假设的推导依据。

<details>
<summary>查看原文（13行）</summary>

```text
        // 总请求预算（F01 配套）：组级起点。超预算不再开新尝试。
        const groupStart = Date.now();
        const budgetMs = cfg.totalBudgetMs || 600000;
        const budgetLeft = () => budgetMs - (Date.now() - groupStart);
        while (true) {
            if (options.signal && options.signal.aborted) {
                yield abortedChunk('request aborted');
                return;
            }
            if (budgetLeft() <= 0) {
                pushEvent(cfg, 'budget-exhausted', { budgetMs, failures: failedKeys.slice() });
                yield failChunk('channel group "' + cfg.id + '" exhausted its total budget of ' + budgetMs + 'ms: ' + (lastFail || 'multiple failures'), 'CHANNEL_BUDGET_EXCEEDED');
                return;
```

</details>

**依据 2 · 源码核查**：[src/index.js:636-643](https://github.com/ArcaneOrion/dsh-model-channel-manager/blob/bcb5c5a634552e357aa0ae992f3396d19048f2a3/src/index.js#L636-L643)

当前尝试缺deadline参数，不把方案写成已实现。

```text
                    }
                    if (budgetLeft() <= 0)
                        break; // 预算耗尽：不开新尝试，交给组层终结
                    const attemptStart = Date.now();
                    try {
                        const attempt = streamAttempt(cfg, cand, options, attemptStart);
                        for await (const chunk of attempt)
                            yield chunk;
```

#### 缺口

- 任务可接受截止及模型能力等价标准未知。
  **影响**：硬限额未必提高总体价值。
  **进一步探讨**：按具体任务定义合格率、时限与费用后再做对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
