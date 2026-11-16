# dsh-prime-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f93d0ee](https://github.com/drscrewdriver/dsh-prime-memory/tree/f93d0ee6e8618a8460a4ad7ce9eae74da885e293)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drscrewdriver/dsh-prime-memory) [![npm 30d 30,700](https://img.shields.io/static/v1?label=npm+30d&message=30%2C700&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prime-memory) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prime-memory)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中捕获对话、分层蒸馏记忆，并在新用户步骤注入相关记录。

> **亮点**：相对每次手工挑选交接材料，插件把捕获、蒸馏和会话内可见注入连到真实宿主事件。触发、预算与去重由本组件实现，分层设计在包声明中归为 MemoryCore 管线移植。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认全局的 L1 范围和历史搜索实际读面不能合并成一个隔离保证。收集器不可读时历史搜索报错，后台仍可空窗蒸馏。恢复水位先于队列持久化的丢失边界仍待运行验证。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 跨会话项目约定怎样进入新会话，比手工交接多做什么？](#detail-section-11)
  - [Q02 · 会话何时进入蒸馏，崩溃能补回什么？](#detail-section-12)
  - [Q03 · 管理员启动真实链路需要什么，历史不可读或范围错配时如何退回？](#detail-section-13)
  - [Q04 · 单次合格交接的总成本与收益有哪些证据？](#detail-section-14)
  - [Q05 · 能否用可核查的试用检验项目习惯的鲜度与隔离？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者希望在重开的 DSH 会话里复用项目的测试和交接约定，并能回到仓库的当前文档核对版本。见 [Q01](#research-q01)。

手工将当前仓库说明、必要的历史原文和版本变化交给新会话。对照时使用同一模型与同一验收检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话捕获与分层记忆 | 跨会话积累可检索的项目约定 | 需启动捕获与蒸馏，后台模型可能失败或退避 |
| 新用户步骤召回 | 查看带来源的候选记忆 | 受会话档位、工作区过滤、去重、预算及超时约束 |
| 历史搜索 | 取对话片段和时间线 | 收集器需就绪，另核对搜索范围 |
| 记忆库界面 | 浏览记录及三维分布 | 依赖 Web 客户端和宿主插槽；形状只用于浏览 |

**流程与依赖**

| 依赖 | 承担者与用途 | 失败影响 |
| --- | --- | --- |
| DSH profile、Node、Cordis 服务 | 管理者固定宿主版本并重启载入服务 | 挂载需通过真实宿主检查 |
| 可写数据目录 | 管理者准备隔离目录，保存 SQLite 和记忆侧状态 | 启动会记录存储问题，捕获受影响 |
| 参考会话收集器 | 历史查询与蒸馏的参考背景 | 搜索显式不可用，后台可空窗继续 |
| 模型路由、可选嵌入 | 使用者配置后台模型和检索策略 | 抽取顺延或退避，嵌入可降级至全文检索 |

| 阶段 | 操作 | 核查点 |
| --- | --- | --- |
| 配置 | 用隔离 profile，核对收集器及存储范围 | 载入包与服务声明后检查实际入口 |
| 使用 | 分别在有测试约定和变更约定的会话中启用捕获与召回 | 验证任务结果和注入来源 |
| 恢复 | 遇历史不可读时看收集器提示，遇空记忆时分开检查待蒸馏状态 | 关闭对应档位或卸载后检查旧数据留存 |

**效果与成本**

| 阶段 | 现金或资源 | 人工时间 |
| --- | --- | --- |
| 首次 | 宿主、可写磁盘和可选向量模型 | 隔离 profile，核对收集器和路由 |
| 持续 | 前台检索加后台蒸馏模型、磁盘与可能的向量调用 | 更新过时记忆，抽查注入和项目结果 |
| 异常与退出 | 超时、重试或重建可能增加资源消耗 | 排查收集器、必要时核对历史并管理卸载后数据 |

以上资源与时间未量化。计量按完整合格任务，见 [Q04](#research-q04)。

| 结果 | 本轮材料 | 验收方式 |
| --- | --- | --- |
| 有可查看的跨会话候选 | 源码有带来源、预算及实际 enter 返回 | 打开注入查看对应文本 |
| 快速且正确地续作 | 旧版作者样例，当前版本收益待测 | 同模型做手工交接对照，记录完整任务通过与人工分钟 |
| 项目间读取边界 | 不同读面有不同过滤 | 用两个工作区验证两种读面的越界结果 |

> **思考**：默认全局的 L1 范围和历史搜索实际读面不能合并成一个隔离保证。收集器不可读时历史搜索报错，后台仍可空窗蒸馏。恢复水位先于队列持久化的丢失边界仍待运行验证。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对每次手工挑选交接材料，插件把捕获、蒸馏和会话内可见注入连到真实宿主事件。触发、预算与去重由本组件实现，分层设计在包声明中归为 MemoryCore 管线移植。[Q01](#research-q01) [Q02](#research-q02)

详查了水位和会话切片的不同提交点、失败块保留、召回回执及后台降级。恢复是否补得回需看水位推进时序与可读日志。三维面板也有散度参数，显示能力不承担蒸馏或检索语义。见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认全局的 L1 范围和历史搜索实际读面不能合并成一个隔离保证。收集器不可读时历史搜索报错，后台仍可空窗蒸馏。恢复水位先于队列持久化的丢失边界仍待运行验证。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在没有敏感内容的隔离 profile 中先保留当前仓库的人工交接文档。用一条替换前后都能核对的测试约定比较结果。出现越界历史或旧约定被实际采用时停用并沿用仓库文档。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证明宿主接线、捕获和可见召回机制。实际任务收益、崩溃窗口与宿主范围验证仍未完成。版本化交接的判断是待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/hooks/recall.ts、src/hooks/capture.ts、src/pipeline/runner.ts、package.json、cordis.patch.yml、src/clients/drsc.ts、src/clients/drsc-inproc.ts、src/tools/index.ts、src/config.ts、src/workspace.ts、client/src/entry.tsx、client/src/explorer/Scene3D.tsx、bench/baseline/workflow-report.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定版的装载、会话蒸馏、自动召回、历史搜索、范围、成本及浏览器入口。未审计每种可选外部驱动与图谱管理操作，也未实测不同宿主和收集器部署。
- 下一步：用两个独立工作区的更新约定做同模型、同任务的启用与手工交接对照。另在水位更新后中断，并比对历史是否可读及蒸馏是否补回。记录误注入、完成检查、延迟及前台与后台资源。

**分析版本**

- **仓库**：[drscrewdriver/dsh-prime-memory](https://github.com/drscrewdriver/dsh-prime-memory)
- **版本号**：0.26.50（[固定提交 f93d0ee](https://github.com/drscrewdriver/dsh-prime-memory/tree/f93d0ee6e8618a8460a4ad7ce9eae74da885e293)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按当前仓库版本与适用范围标注候选，再分别验证自动召回和历史检索，可能帮助用户把注入提示用于交接而不失去对权威约定的控制。这个验证方案尚未实施。[Q05](#research-q05)

用两个独立工作区的更新约定做同模型、同任务的启用与手工交接对照。另在水位更新后中断，并比对历史是否可读及蒸馏是否补回。记录误注入、完成检查、延迟及前台与后台资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 22926 | — | — | 440073 |
| .mjs | source | 37 | 7981 | 6321 | 1241 | — |
| .js | source | 3 | 1552 | 1255 | 229 | — |
| .tsx | source | 39 | 12459 | 10685 | 1330 | — |
| .ts | source | 197 | 61248 | 42560 | 14890 | — |
| .cjs | source | 3 | 528 | 336 | 170 | — |
| .ts | test | 231 | 43907 | 35807 | 5067 | — |
| .cjs | example | 1 | 132 | 99 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-prime-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-prime-memory/issues?q=is%3Aissue+created%3A2026-10-17T04%3A12%3A58.039Z..2026-11-16T04%3A12%3A58.039Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/drscrewdriver/dsh-prime-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T04%3A12%3A58.039Z..2026-11-16T04%3A12%3A58.039Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：长期维护多个代码仓库的 DSH 使用者，能否靠自动蒸馏与召回复用已核实的项目约定，同时识别错误召回、历史来源故障和额外成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话项目约定怎样进入新会话，比手工交接多做什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用任务是开发者结束一次有结论的工作会话后，在新会话恢复同一项目的测试约定或部署前检查。手工交接要从仓库说明或旧会话找出处，再把最新约定放进上下文。插件增加的是对已蒸馏的 L1 记忆进行自动检索，并把命中的文本作为带来源的消息交给宿主。任务合格的标准仍是新会话依据当前仓库实际使用正确约定，能指出过时或无证据的信息。

宿主 apply 接好 recall。pre-step 中间件先取得下游决策，拒绝、取消、会话关档、无新增用户来源消息及空查询直接透传。只在用户轮首或插话等步骤尝试检索，并传入档位、工作区过滤参数和搜索超时。超时会记事件并跳过本轮，同一轮中的纯工具调用不会重复承担这条查询链。候选先压掉已注入记录，再限制单条和总长度。有内容时生成 plugin:memory 来源的 recall 消息，插在用户消息之前。收到了宿主 user/message 回执才常规确认去重，超时则走退化标记。压缩后可临时跳过去重，避免历史退出模型上下文后永久召回不到。

相对一张固定项目交接单，这条链可以针对眼前问题提供不同的线索并在会话里显示注入。反例是权威约定已经写在容易定位的仓库文档中，或者查询受预算、超时、去重压制而漏掉最新约定。可见的注入证明有一个候选进入了上下文，不能单凭它判断实际答案正确。作者所谓每一步前自动召回应按有新用户消息的真实门槛理解。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:125-130](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/README.md#L125-L130)

作者用原生事件、可见注入和去重解释目的。

```text
<p align="center">
  <img src="./assets/readme/flow.svg" width="100%"
       alt="dsh-prime-memory 运行时数据流：左侧 User 与 Assistant 的会话事件流入插件（L0 捕获、L1–L3 蒸馏、检索召回、记忆工具），插件经 agent/pre-step 把相关记忆注入右侧 DSH 核心；蒸馏复用核心的 ctx.llm，数据双写 ~/.dsh/memory/">
</p>

插件挂在 dsh 原生事件上（`session/event` 捕获、`agent/pre-step` 注入），蒸馏调用复用宿主 `ctx.llm`。召回以**消息侧注入**呈现：相关记忆作为一条合成消息排在用户新消息之前，会话流里显示为\*\*"上下文注入 · memory"\*\*行（点开看命中内容）——用户能直接看到"记忆生效了"；注入内容有长度预算与时间预算，超限截断/超时跳过，绝不拖慢对话。**同会话去重**：已注入过的记忆不再重复注入（模型上下文里已经有了，追问同类问题时省 token）；上下文被 `/compact` 压缩或清空时自动重置，记忆可重新注入；被更新的记忆（内容变化换新 id）不受旧压制。**时效加权**：召回排序按 `相关度 × max(0.5, 0.5^(距上次更新天数/30))` 软加权——相关度相近的候选之间新鲜记忆优先（名额自然轮转），相关度足够高的老记忆照常召回（地板保证最多损失一半排序分，长期事实不沉底）；`recall.decayHalfLifeDays` 可调，0=关闭。
```

**依据 2 · 源码核查**：[src/index.ts:834-846](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/index.ts#L834-L846)

宿主 apply 装配 recall 与记忆工具。

<details>
<summary>查看原文（13行）</summary>

```text
  const recall = registerRecall(ctx, config, stores, logger, live, modes, dataDir, recallUsage);
  runner.setAfterRun(recall.invalidateProfile);
  const toolSeals = registerMemoryTools(ctx, config, stores, logger, modes, live, ruminate, storageOk ? roomRegistry : undefined, {
    // 确定性写面钩子(graph-write-plane R2/R3):runner 公开方法直连,工具三路径与
    // distill 分支共用同一个入队实现,不存在第二套优先级/去重逻辑。
    enqueueGraph: (ids) => runner.enqueueGraphFor(ids),
    reprojectGraph: (ids) => runner.reprojectGraph(ids),
  });
  // 激活槽位(active slot):工具面 + 常驻注入 + 服务端投影(均走 ctx.effect,可撤销)
  registerSlotTools(ctx, config, stores.slots, logger, modes, live, stores.l1);
  const slotRecall = registerSlotRecall(ctx, config, stores.slots, logger, live);
  // 轨2 技能：工具面经宿主封印机制(seals)登记，与常驻注入分离（默认关时自 no-op，零表面积）。
  registerSkillTools(ctx, skillStore, logger, live, toolSeals);
```

</details>

**依据 3 · 源码核查**：[src/hooks/recall.ts:453-493](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L453-L493)

事件入口、分支与压缩后增强标记。

<details>
<summary>查看原文（41行）</summary>

```text
  if (cfg.recall.enabled) {
    ctx.on(
      'agent/pre-step',
      async (payload, next) => {
        // §D 超时清扫:超时未确认的注入照旧标记(降级保连续,防 dedupe 失效回归);
        // 正常确认在秒级完成,这里只是兜底。一次性提示。
        const expiredAcks = expirePendingInjections();
        if (expiredAcks > 0 && !ackDegradeWarned) {
          ackDegradeWarned = true;
          logger.warn(`[memory] 注入确认:${expiredAcks} 条 pending 超时未回执,已降级为照常标记(一次性提示)`);
        }
        const decision = await next();
        if (decision.kind === 'reject' || payload.signal.aborted) return decision;
        try {
          const s = live.get();
          // 档位/锁域读**所有者**(子代理上溯父链);统计与去重仍按各自 agent(上下文独立)
          const ownerId = resolveModeOwner(payload.agent.id, payload.agent);
          const mode = modes.get(ownerId);
          // 三级读闸:主闸 → off 档(完全隐身)→ 注入开关(会话覆盖 ?? 全局)
          if (!s.enabled || mode === 'off' || !modes.resolvedRecall(ownerId, s.recall)) return decision;
          // 只在有新的用户来源消息的步骤注入(轮首 claim 或 steering 插话);纯工具步透传
          const hasNewUserMessage = decision.messages.some(
            (m) => (m as { source?: { kind?: string } }).source?.kind === 'user',
          );
          if (!hasNewUserMessage) return decision;
          // §E 消费增强标记:压缩后下一轮跳过去重压制(预算/档位/门控照常),
          // 画像 TTL 失效立即重注入,占用账本归零。消费即清(一次性)。
          const sessionKey = String(
            (payload.agent as { session?: { id?: unknown } }).session?.id ?? payload.agent.id,
          );
          const boosted = postCompaction.consume(sessionKey);
          if (boosted) {
            invalidateProfile();
            const led = ledgerFor(payload.agent.id);
            resetForCompaction(led);
            occupancyStore.save(payload.agent.id, led);
            logger.info(`[memory] 压缩后增强召回:本轮跳过去重压制 + 画像重注入(session=${sessionKey})`);
          }
          const query = buildRecallQuery(payload.messages as Array<{ content: unknown }>);
          // 空查询是退化轮(无用户文本),重置命中信号但不计入统计
          if (!query) {
```

</details>

**依据 4 · 源码核查**：[src/hooks/recall.ts:506-527](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L506-L527)

检索有作用域与时间预算，超时有日志。

<details>
<summary>查看原文（22行）</summary>

```text
          const searchStart = Date.now();
          const hits = await raceRecallTimeout(
            stores.l1.search(query, cfg.recall.maxResults, {
              scoreThreshold: cfg.recall.scoreThreshold,
              family: mode === 'auto' ? undefined : mode,
              // §E 可见范围:自动召回是"最没人在看"的一条路径——它静默地往模型上下文里
              // 注入记忆。若这里漏了隔离,跨工作区泄漏会发生在每一次对话里而不留痕迹。
              workspaceId: scopeFilterOf(cfg.scope, { agent: payload.agent }),
              // 嵌入内层钳制:给 FTS 降级留出总预算内的时间(远程限 HTTP fetch;本地经 worker 代理 race 放弃)
              embeddingTimeoutMs: RECALL_EMBED_CAP_MS,
            }),
            cfg.recall.timeoutMs,
          );
          st.updatedAt = Date.now();
          if (hits === undefined) {
            st.timeouts++;
            logger.warn('[memory] 召回超时,跳过本轮注入(不阻塞对话)');
            trace({
              kind: 'recall_turn', ts: Date.now(), sessionId: sessionKey, queryChars, querySha, queryText,
              hitIds: [], hitScores: [], injectedIds: [], suppressedCount: 0,
              durationMs: Date.now() - searchStart, outcome: 'timeout',
            });
```

</details>

**依据 5 · 源码核查**：[src/hooks/recall.ts:674-715](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L674-L715)

限长后形成带来源的记忆消息。

<details>
<summary>查看原文（42行）</summary>

```text
          const lines = applyRecallBudget(
            fresh.map((h) =>
              `- [${h.scene_name ? `${h.type}|${h.scene_name}` : h.type}] ${h.content}` +
              // 外部记忆行归因(Phase 1 T1.12):id 形如 `ext:<driver>:<space>:<ext>` → 标来源驱动,
              // 让模型知道这是"借来的记忆"而非本地蒸馏产物(bench 注入行归因也吃这个前缀)。
              (h.id.startsWith('ext:') ? `（via external:${h.id.slice(4, h.id.indexOf(':', 4))}）` : '') +
              // 门2 task_3.4:疑而不隐——valid_to 来源不可信的行保留注入但带标注,
              // 人/模型自行裁量。灰度关时 suspectIds 恒空,行形状逐字不变。
              (suspectIds.has(h.id) ? '（疑似失效:有效期来源不可信）' : ''),
            ),
            { maxCharsPerMemory: cfg.recall.maxCharsPerMemory, maxTotalRecallChars: cfg.recall.maxTotalRecallChars },
          );
          if (lines.length === 0) {
            // §F 追踪:预算清零轮(截断后无完整行)
            trace({
              kind: 'recall_turn', ts: Date.now(), sessionId: sessionKey, queryChars, querySha, queryText,
              hitIds: fresh.map((h) => h.id), hitScores: fresh.map((h) => Number(h.score.toFixed(4))),
              injectedIds: [], suppressedCount: scoped.length - fresh.length,
              durationMs: Date.now() - searchStart, outcome: 'suppressed',
            });
            usage?.recordAttempt(fresh.map((h) => h.id), []);
            return decision;
          }
          st.lastHits = lines.length;
          const text = [
            '<relevant-memories>',
            '以下是当前对话召回的相关记忆，不代表当前任务进程，仅作为参考：',
            '',
            ...lines,
            '',
            '</relevant-memories>',
          ].join('\n');
          logger.info(
            `[memory] 召回注入 ${lines.length} 条 L1(mode=${mode},query="${query.slice(0, 30).replace(/\n/g, ' ')}…",agent=${payload.agent.id},消息侧)`,
          );
          const injection = createUserMessage({
            content: [{ type: 'text', text }],
            // v4（宿主 ≥0.1.7-rc.1）署名为 producer-owned kind：plugin:<子系统名>。
            // 用展示友好的子系统名 memory,不用 cordis id(dsh-memory);宿主 UI 标题
            // 规则随之变化(不再有 catch-all 'plugin' 的通用"上下文注入"标题)。
            // v3 旧行(kind:'plugin'+plugin 字段)由宿主 v3→v4 迁移升格,读侧双形状兼容。
            source: { kind: 'plugin:memory', form: 'recall' },
```

</details>

**依据 6 · 源码核查**：[src/hooks/recall.ts:717-752](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L717-L752)

登记 pending、账本、实际 enter 返回及错误退化。

<details>
<summary>查看原文（36行）</summary>

```text
          // §D 注入确认(memorax-absorb):宿主接受 enter 后,注入消息以原样
          // `user/message` 进入会话日志(message.id 稳定保留)——capture 侧观察到
          // 该 id 才真正 dedupe.mark(recall-ack 两段式)。这里只登记 pending,
          // 未确认不标记:被覆盖/取消的注入不该压制这些记忆(下轮可重注)。
          registerPendingInjection(
            payload.agent.id,
            injection.id,
            fresh.slice(0, lines.length).map((h) => h.id),
          );
          // §F 追踪:注入轮
          trace({
            kind: 'recall_turn', ts: Date.now(), sessionId: sessionKey, queryChars, querySha, queryText,
            hitIds: scoped.map((h) => h.id), hitScores: scoped.map((h) => Number(h.score.toFixed(4))),
            injectedIds: fresh.slice(0, lines.length).map((h) => h.id), suppressedCount: scoped.length - fresh.length,
            durationMs: Date.now() - searchStart, outcome: 'injected',
          });
          // 使用统计:候选=scoped(尝试),进 topN(注入)=used
          usage?.recordAttempt(scoped.map((h) => h.id), fresh.slice(0, lines.length).map((h) => h.id));
          // G-live:按 **sessionKey**(=agent.session?.id ?? agent.id，与 pill 的 sessionId / 投影 header.id 同源，
          // 非 ownerId)记入本会话“活召回集”，供侧栏卡读取；压缩时同键 reset。
          // 路归因随注入透传(hybrid 融合才挂 lanes;单路策略下表空=不记,徽标无从渲染)。
          const injectedHits = fresh.slice(0, lines.length);
          const laneById = new Map<string, RecallLane[]>();
          for (const h of injectedHits) {
            if (h.lanes !== undefined && h.lanes.length > 0) laneById.set(h.id, h.lanes);
          }
          stores.recalled?.add(sessionKey, injectedHits.map((h) => h.id), injection.id, laneById);
          // 入账在成功构造注入消息之后、返回 enter 之前——任何前置抛错路径账目零扰动
          const led = ledgerFor(payload.agent.id);
          recordRecallInjection(led, text.length);
          occupancyStore.save(payload.agent.id, led);
          // 注入消息排在用户新消息之前(原版 prepend 语义:先线索后问题)
          return { kind: 'enter', messages: [injection, ...decision.messages] };
        } catch (err) {
          logger.warn(`[memory] 召回注入失败(跳过本轮): ${errDetail(err)}`);
          return decision;
```

</details>

**依据 7 · 源码核查**：[src/hooks/capture.ts:140-154](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L140-L154)

接到对应用户消息 ID 后确认注入。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    try {
      const s = live.get();
      if (!s.enabled || !s.capture) return;
      const sid = String(session.id ?? session);
      // §D 日志回执(memorax-absorb):注入消息以原样 user/message 入日志时在此确认,
      // 才真正 dedupe.mark。**必须置于 source.kind 过滤之前**——过滤在
      // turnEventsToMessages 内且只放行 kind='user',注入消息(kind='plugin:memory')
      // 走不到那里;也置于 off 档返回之前(确认与档位无关,且代价是一次 Map 查找)。
      if (event.type === 'user/message') {
        const mid = (event.data as { id?: unknown }).id;
        if (typeof mid === 'string' && mid) confirmInjectionByMessageId(mid);
      }
      // off 档:本会话对记忆系统完全隐身(不缓冲、不写 L0、不蒸馏)
      if (modes.get(sid) === 'off') return;
```

</details>

#### 缺口

- 固定版本同模型任务中的实际命中、正确采用率和首响应增量尚无本轮观测
  **影响**：无法确定自动注入能稳定替代人工交接
  **进一步探讨**：用两个新会话对照当前仓库说明，记录正确完成与误注入

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话何时进入蒸馏，崩溃能补回什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

session/event 按会话与事件筛选，经 turn/end 折叠普通用户与助手消息。关闭档绕过捕获。当前实现中的 L0 路径先同步写入捕获水位，再把消息交给后台队列。本插件已经停止把该原始正文写到自身 L0 正文表和 JSONL，历史检索由参考会话收集器的投影供给。捕获侧对送进蒸馏的输入做裁剪和模式脱敏。脱敏函数抛错时实现会告警并让原文继续，属于保捕获的设计取舍。

后台把消息按档位入桶并以 sessionId 分切片。阈值达成或明确强制时，只送对应会话，参考背景从同会话的收集器尾窗现查，失败则空窗。成功块消费出桶，失败块留下。无显式路由时顺延，其他抽取失败按会话退避。在有新原子记录且满足条件时按记忆族做 L2 场景整合，L3 是另一个按族条件触发的阶段。阶段分别捕获异常，因此短期可出现 L1 已更新、场景或画像仍旧的状态。

恢复监听仅在 resume 时生效，从宿主事件快照及日志服务找水位之后的完整尾轮。没有日志服务时跳过，已有水位的轮次也跳过。水位先于队列消费或待处理落盘推进，使崩溃发生在两者之间时，恢复机制可能认这一轮已捕获，同时本地仍没有蒸馏结果。这是从固定调用顺序得出的待复现窗口。依赖外部收集器保留的历史可能有助于用户找回原文，不能保证自动重做同一轮的蒸馏。

#### 证据与依据

**依据 1 · 源码核查**：[src/hooks/capture.ts:27-43](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L27-L43)

捕获脱敏异常放行输入。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * §C 捕获单点脱敏(memorax-absorb):`capture.redactSecrets !== false` 时把
 * 8 类密钥替换为 `[REDACTED:<KIND>]`。位置在 sanitize 之后、L0/蒸馏分发之前——
 * 同一份 messages 覆盖 L0 JSONL/L0 SQLite/蒸馏输入三条下游,无分裂态。
 * 红线:脱敏失败放行原文 + 一次性 warn(不阻断捕获)。
 */
function redactContent(content: string, cfg: MemoryConfig, logger: MemoryLogger): string {
  if (cfg.capture?.redactSecrets === false) return content;
  try {
    return redactSecrets(content).text;
  } catch (err) {
    if (!redactWarnedOnce) {
      redactWarnedOnce = true;
      logger.warn(`[memory] 脱敏失败,本轮放行原文(一次性提示): ${err instanceof Error ? err.message : String(err)}`);
    }
    return content;
  }
```

</details>

**依据 2 · 源码核查**：[src/hooks/capture.ts:125-138](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L125-L138)

L0 正文源退役，水位登记保留。

<details>
<summary>查看原文（14行）</summary>

```text
  modes: SessionModeStore,
): (() => Promise<void>) | undefined {
  if (!cfg.capture.enabled) return;
  const startFloor = Date.now();
  const buffers = new CaptureBuffers();
  // task_8 一次性提示标记:宿主读日志服务不可得时只提示一次(防每次 resume 刷屏)
  let warnedRecoveryUnavailable = false;
  // T8.4 写停(drsc-redact-memory-wiring R6):l0 正文三表(l0_conversations/l0_fts/
  // l0_vec)与 JSONL 事实源一并退役——历史读面由 DRSC 投影供给,本地只剩水位表
  // 做 §A 恢复幂等自检。蒸馏直传不经 DRSC(capture 单点脱敏照旧)。
  // 水位登记是同步 SQLite 写,事件循环天然串行,无需再排队。
  const settleTurn = (sid: string, turn: number, messages: ConversationMessage[]): void => {
    watermark.record(sid, turn, lastStepOf(messages));
  };
```

</details>

**依据 3 · 源码核查**：[src/hooks/capture.ts:165-195](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L165-L195)

轮末先登记水位再入队。

<details>
<summary>查看原文（31行）</summary>

```text
      buffers.push(sid, event);

      if (event.type === 'turn/end') {
        const turn = event.data.turn;
        const turnEvents = buffers.takeTurn(sid, turn);
        const messages = turnEventsToMessages(turnEvents, cfg, logger, sid, turn);
        if (messages.length > 0) {
          const roles = messages.reduce<Record<string, number>>((acc, m) => {
            acc[m.role] = (acc[m.role] ?? 0) + 1;
            return acc;
          }, {});
          // 轮末档位生效(中途切档:本轮按 turn/end 时的档位蒸馏)
          const mode = modes.get(sid);
          if (mode === 'off') {
            logger.info(`[memory] turn=${turn} 结束时档位为关闭,本轮不落盘不蒸馏(session=${sid})`);
            return;
          }
          logger.info(
            `[memory] L0 捕获 turn=${turn} ${messages.length} 条(${Object.entries(roles)
              .map(([k, v]) => `${k}=${v}`)
              .join('/')} ,session=${sid},mode=${mode})`,
          );
          // 写停:水位登记即"落盘"(正文由 DRSC 投影承接);蒸馏直传照旧
          settleTurn(sid, turn, messages);
          logger.info(`[memory] L0 写停登记 turn=${turn}(正文不落库,历史面经 DRSC)`);
          runner.enqueue(sid, messages, mode);
        }
      }
    } catch (err) {
      logger.warn(`[memory] session/event 处理失败: ${err instanceof Error ? err.message : String(err)}`);
    }
```

</details>

**依据 4 · 源码核查**：[src/hooks/capture.ts:202-262](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L202-L262)

恢复事件与服务探测、依据水位跳过或补收。

<details>
<summary>查看原文（61行）</summary>

```text
  ctx.on(
    'agent/created',
    async (payload) => {
      try {
        if (payload.source !== 'resume') return;
        const s = live.get();
        if (!s.enabled || !s.capture) return;
        const session = payload.agent?.session;
        const sid = session?.id !== undefined && session.id !== null ? String(session.id) : '';
        if (!sid) return;
        const mode = modes.get(sid);
        if (mode === 'off') return; // off 档对记忆系统完全隐身,对齐现行为
          let events: readonly SessionEvent[] | undefined =
            typeof session?.snapshotEvents === 'function' ? session.snapshotEvents() : undefined;
        if (!events || events.length === 0) {
          // task_8 降级链:events 不可得(宿主版本偏差)时依次试
          // ctx.sessionQuery.readSession / ctx.sessionPersistence.readFrom(守卫探针式)
          const get = (ctx as { get?: (name: string) => unknown }).get;
          const svcs =
            typeof get === 'function'
              ? ({
                  sessionQuery: get.call(ctx, 'sessionQuery'),
                  sessionPersistence: get.call(ctx, 'sessionPersistence'),
                } as Parameters<typeof readPersistedEventsViaServices>[0])
              : {};
          const degraded = readPersistedEventsViaServices(svcs, sid);
          if (degraded === undefined) {
            if (!warnedRecoveryUnavailable) {
              warnedRecoveryUnavailable = true;
              logger.info('[memory] resume 恢复:宿主读日志服务不可得,跳过对账(一次性提示)');
            }
            return;
          }
          events = degraded;
        }
        const watermarkTurn = watermark.maxTurn(sid);
        const brackets = foldRecoverableTurns(events, watermarkTurn);
        if (brackets.length === 0) return;
        let recovered = 0;
        let skipped = 0;
        let total = 0;
        for (const bracket of brackets) {
          if (watermark.hasAny(sid, bracket.turn)) {
            // 水位表判"该轮已捕获":整轮跳过,宁少收不重复(≡ 退役前行存在性检查)
            skipped += 1;
            continue;
          }
          const messages = turnEventsToMessages(bracket.events, cfg, logger, sid, bracket.turn);
          if (messages.length === 0) continue;
          recovered += 1;
          total += messages.length;
          settleTurn(sid, bracket.turn, messages);
          runner.enqueue(sid, messages, mode);
        }
        if (recovered > 0 || skipped > 0) {
          logger.info(
            `[memory] resume 对账:水位线 ${watermarkTurn ?? '无'} → 恢复 ${recovered} 轮 ${total} 条,幂等跳过 ${skipped} 轮(session=${sid})`,
          );
        }
      } catch (err) {
        logger.warn(`[memory] resume 恢复失败(不阻塞会话启动): ${err instanceof Error ? err.message : String(err)}`);
```

</details>

**依据 5 · 源码核查**：[src/pipeline/runner.ts:795-828](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L795-L828)

切片达到阈值才抽取，未达时保存待处理消息。

<details>
<summary>查看原文（34行）</summary>

```text
    // ── L1:抽取 + 去重(按档分桶、桶内按会话切片;失败按切片保留待重试) ──
    let newRecords: Awaited<ReturnType<typeof runExtraction>>['newRecords'] = [];
    const liveNow = this.live.get();
    const distillOn = liveNow.enabled && liveNow.distill;
    if (cfg.extract.enabled && distillOn) {
      const bucket = this.pending[mode];
      // 入桶即携带会话标识(会话切片成员;切片内永不跨会话混装)
      bucket.push(...messages.map((m): PendingMessage => ({ ...m, sessionId })));
      if (!opts?.noBufferCap && bucket.length > PENDING_BUCKET_CAP) {
        bucket.splice(0, bucket.length - PENDING_BUCKET_CAP);
      }
      if (messages.length > 0) this.lastActivity.set(sessionId, Date.now());
      // 按会话切片触发:只看本会话切片是否达到生效阈值(渐进爬坡),
      // 达标只抽取该切片——其余会话的切片继续攒,绝不跨会话混装。
      // force:重建轮全量蒸馏(历史小会话也必须出记忆,不受阈值约束)。
      const effective = effectiveExtractThreshold(this.warmup[mode], cfg.extract.minMessages);
      const sliceLen = bucket.reduce((n, m) => (m.sessionId === sessionId ? n + 1 : n), 0);
      // 抽取失败退避:重建轮(noBufferCap,用户显式动作、有自己的失败/取消 UI)豁免
      const backedOff = !opts?.noBufferCap && !opts?.bypassBackoff && this.inExtractBackoff(sessionId);
      if ((opts?.force || sliceLen >= effective) && !backedOff) {
        newRecords = await this.extractSessionSlice(sessionId, mode, cfg, effective, opts);
        // 新记录入投影队列(优先级恒高于存量补投影)并拉起图谱泵;入队本身廉价,
        // 开关关时由 enqueueGraphFor 抹投影凭证(避免重开后永久陈旧)，重开由补投影兜底。
        // (写面 R2:分支本体抽成 enqueueGraphFor,与工具三路径同源,不再两处漂移。)
        this.enqueueGraphFor(newRecords.map((r) => r.id));
      } else {
        this.logger.debug?.(
          backedOff
            ? `[memory] 蒸馏退避中,本轮跳过抽取(session=${sessionId},mode=${mode})`
            : `[memory] 会话切片攒批中(session=${sessionId},mode=${mode},${sliceLen}/${effective})`,
        );
        // 攒阈值中途也落盘:进程退出后切片与爬坡状态不丢
        await this.persistPending(opts?.noBufferCap);
      }
```

</details>

**依据 6 · 源码核查**：[src/pipeline/runner.ts:831-857](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L831-L857)

L2 按族判定并处理单次错误。

<details>
<summary>查看原文（27行）</summary>

```text
    // ── L2/L3:按记录族各自判定与执行 ──
    if (cfg.l2.enabled && distillOn) {
      for (const family of ['chat', 'work'] as const) {
        const familyRecords = newRecords.filter((r) => (r.family ?? 'chat') === family);
        if (familyRecords.length === 0) continue;
        const fstate = this.states[family];
        if (fstate.newMemoriesSinceL2 >= cfg.l2.minNewMemories) {
          try {
            const t = Date.now();
            const result = await runSceneConsolidation(this.ctx, cfg, this.stores.scenes[family], familyRecords, this.logger, family);
            fstate.lastL2At = Date.now();
            fstate.newMemoriesSinceL2 = 0;
            if (result.personaRequestedReason) fstate.personaRequestedReason = result.personaRequestedReason;
            this.logger.info(`[memory] L2 阶段完成(family=${family},${Date.now() - t}ms)`);
            // §F 追踪:L2 run 级事件
            trace({
              kind: 'distill_run',
              ts: Date.now(),
              layer: 'l2',
              sessionId,
              inputChars: familyRecords.reduce((n, m) => n + m.content.length, 0),
              durationMs: Date.now() - t,
              newRecords: familyRecords.length,
              ok: true,
            });
          } catch (err) {
            this.logger.warn(`[memory] L2 场景整合失败(family=${family}): ${errDetail(err)}`);
```

</details>

**依据 7 · 源码核查**：[src/pipeline/runner.ts:895-915](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L895-L915)

L3 逐族触发并单独记录失败。

<details>
<summary>查看原文（21行）</summary>

```text
    if (cfg.l3.enabled && distillOn) {
      for (const family of ['chat', 'work'] as const) {
        const tL3 = Date.now();
        try {
          await runPersona(this.ctx, cfg, this.stores.scenes[family], this.stores.persona[family], this.states[family], this.logger, family);
          // §F 追踪:L3 run 级事件
          trace({ kind: 'distill_run', ts: Date.now(), layer: 'l3', sessionId, inputChars: 0, durationMs: Date.now() - tL3, ok: true });
        } catch (err) {
          this.logger.warn(`[memory] L3 画像蒸馏失败(family=${family}): ${errDetail(err)}`);
          trace({
            kind: 'distill_run',
            ts: Date.now(),
            layer: 'l3',
            sessionId,
            inputChars: 0,
            durationMs: 0,
            ok: false,
            errorKind: err instanceof Error ? err.name : 'error',
          });
        }
      }
```

</details>

**依据 8 · 源码核查**：[src/pipeline/runner.ts:938-953](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L938-L953)

DRSC 背景尾窗按会话读取，失败为空。

<details>
<summary>查看原文（16行）</summary>

```text
  private async drscBackground(
    sessionId: string,
    n: number,
    sliceTurns: ReadonlySet<number>,
  ): Promise<ConversationMessage[]> {
    if (n <= 0) return [];
    try {
      const rows = await this.stores.drsc!.sessionTail(sessionId, n);
      return rows
        .map((r) => drscRowToConversationMessage(r, sessionId))
        .filter((m): m is ConversationMessage => m !== undefined)
        .filter((m) => m.anchor === undefined || !sliceTurns.has(m.anchor.turn))
        .slice(-n);
    } catch (err) {
      this.logger.warn(`[memory] 蒸馏背景窗拉取失败(DRSC),本轮空窗降级: ${errDetail(err)}`);
      return [];
```

</details>

**依据 9 · 源码核查**：[src/pipeline/runner.ts:1010-1044](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L1010-L1044)

部分消费与状态落盘的顺序。

<details>
<summary>查看原文（35行）</summary>

```text
      // R9: 本轮学到的跑通块长落盘（best-effort，失败不阻蒸馏）
      await this.stores.routeHealth?.save().catch(() => {});
      if (!result.skipped) {
        // R1′ 部分消费：成功块出桶、抽取失败块留桶下轮重投（rest ∪ failedMessages）
        this.pending[mode] = [...rest, ...((result.failedMessages ?? []) as PendingMessage[])];
        // 重建轮(force)不是有机对话,不推进爬坡
        if (!opts?.force) this.warmup[mode] = advanceWarmupThreshold(this.warmup[mode], cfg.extract.minMessages);
        // 会话产出记账(成功消费即记——零产出也算"蒸馏过",lastAt 推进)
        this.noteSessionDistill(sessionId, result.newRecords.length);
        // 成功消费清零失败退避(切片已出桶,后续轮次恢复正常触发)
        this.extractFailures.delete(sessionId);
      }
      this.logger.info(
        `[memory] L1 阶段完成(session=${sessionId},mode=${mode},切片 ${slice.length} 条,背景 ${background.length} 条,阈值 ${effectiveThreshold},${Date.now() - t}ms)`,
      );
      // §F 追踪:L1 run 级事件(runId/byKind 与 l1_receipts 同源,可交叉审计);
      // skipped = 蒸馏开关关闭的 no-op,不入追踪
      if (!result.skipped) {
        trace({
          kind: 'distill_run',
          ts: Date.now(),
          layer: 'l1',
          sessionId,
          runId: result.runId,
          inputChars: slice.reduce((n, m) => n + m.content.length, 0),
          byKind: result.byKind,
          newRecords: result.newRecords.length,
          durationMs: Date.now() - t,
          ok: true,
        });
      }
      // 缓冲与爬坡每次尝试后立即落盘:进程中途退出不丢待重试/攒阈值状态
      await this.persistPending(opts?.noBufferCap);
      // L1 计数推进后立即落盘:L2/L3 失败或进程中途退出不得回滚阈值进度
      // (记录已入库但计数丢失会让该族 L2 永远差一截,state 与 DB 脱节)
```

</details>

**依据 10 · 源码核查**：[src/pipeline/runner.ts:1065-1079](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L1065-L1079)

无路由顺延和其他失败退避有各自分支。

<details>
<summary>查看原文（15行）</summary>

```text
      // R4:无可用蒸馏路由=配置缺失、非模型慢——不进退避(否则把"没配"误当故障反复退避)，只顺延。
      if (err instanceof NoDistillRouteError) {
        this.logger.warn(`[memory] 无可用蒸馏路由,本轮蒸馏顺延、不记退避(session=${sessionId},mode=${mode})`);
        await this.persistPending(opts?.noBufferCap).catch(() => {});
        return [];
      }
      // 指数退避:压制闲置兜底/补跑在 LLM 故障期间的连环重试(成功消费时清零)
      const streak = (this.extractFailures.get(sessionId)?.streak ?? 0) + 1;
      const delayMs = extractionBackoffMs(streak);
      this.extractFailures.set(sessionId, { streak, nextAt: Date.now() + delayMs });
      this.logger.info(
        `[memory] 蒸馏连续失败 ${streak} 次,${Math.round(delayMs / 1000)}s 内暂停该会话的自动重试`,
      );
      await this.persistPending(opts?.noBufferCap).catch(() => {});
      return [];
```

</details>

#### 缺口

- 尚未在水位已登记而后台未持久化时中断真实宿主
  **影响**：无法量化漏蒸馏窗口及手工补救时间
  **进一步探讨**：在测试 profile 人为停在两个动作之间，再检查会话历史、待处理切片与 L1

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 管理员启动真实链路需要什么，历史不可读或范围错配时如何退回？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

启动面由 profile 的 Cordis 补丁加载根包，导出 dist/index.js 与 Web 客户端，宿主模块注入 llm、tools、systemPrompt、connection 和 webServer。插件要求 Node 与 DSH 的版本范围，还声明收集器的 npm 依赖和插件依赖。兼容声明只能定位测试对象。Web 客户端的面板已沿 slots 接好，0.26.50 的悬臂散度输入控制三维布局，属于浏览呈现面。

效果面有三个独立条件。写得进记忆目录才能登记捕获并积累状态。嵌入初始化失败可退到全文检索，后台存储工作线程不可用可用进程内实现。完整历史另依赖收集器可读取本机投影。默认 DrscClient 走进程内动态导入，优先只读门面，非默认 HTTP 路径另有请求分流。conversation_search 有显式不可用提示，背景拉取失败只记录告警后继续；因此会话仍能用，蒸馏仍可能产生结果，但不再含该背景。它读取脱敏视图的路径及行为由对接代码约束，收集器实际索引配置和数据新鲜度仍需宿主验证。

主要采用障碍是不能把工作区过滤描述成全历史授权边界。默认 scope 为 global。L1 自动召回的 workspace 模式仅在取得路径标识时传入过滤值。历史检索工具只检查会话记忆档位及条数，调用 drsc.search 未传入工作区或会话过滤。多项目存在访问边界时，靠关闭单一召回开关无法覆盖全部读面。先用分开的 DSH profile 与数据目录隔离测试面，明确核对收集器范围；若无法证明稳定隔离，退回手工附交接材料。关闭或卸载后按作者说明保留已有数据，自行处理各自存储，不把卸载视为数据清除。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-34](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/package.json#L11-L34)

入口与 DSH 组合及收集器声明。

<details>
<summary>查看原文（24行）</summary>

```text
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./dist/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    },
    "pluginDependencies": [
      "dsh-reference-session-collector"
    ]
  },
```

</details>

**依据 2 · 源码核查**：[package.json:81-84](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/package.json#L81-L84)

Node 和 DSH 版本约束。

```text
  "engines": {
    "node": ">=22.16.0",
    "dsh": ">=0.1.0-rc.2 <0.3.0-0"
  },
```

**依据 3 · 源码核查**：[package.json:98-115](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/package.json#L98-L115)

收集器及主要运行依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.4",
    "@node-rs/jieba": "^2.0.2",
    "dsh-reference-session-collector": ">=0.2.5 <0.3.0",
    "sqlite-vec": "^0.1.7-alpha.2",
    "undici": "^7.29.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-client-connection": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.2 <0.3.0-0"
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/cordis.patch.yml#L1-L10)

profile 插入根包。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-prime-memory 组合包层：安装（dsh plugin --profile <name> add dsh-prime-memory）
# 后自动挂载插件行，无需再手改 profile 的 cordis.patch.yml。
# 覆盖配置请在 profile 自己的 cordis.patch.yml 里写顶层裸 patch（直接 id:，不要包 insert:，
# 同 id 再 insert 会报 duplicate loader entry id 启动失败）：
#   - id: dsh-memory
#     name: dsh-prime-memory
#     config: { family: auto }   # 键按行整体替换，不深合并
- insert:
    - id: dsh-memory
      name: dsh-prime-memory
```

</details>

**依据 5 · 源码核查**：[src/index.ts:119-155](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/index.ts#L119-L155)

宿主服务注入及不可写时的处理。

<details>
<summary>查看原文（37行）</summary>

```text
 * 致命失败。故声明 connection + webServer;两者在 0.1.1~0.1.5 均存在,
 * 额外授权在旧版无害(声明式注入只会等这两个服务就绪,不改装配顺序)。
 */
export const inject = ['llm', 'tools', 'systemPrompt', 'connection', 'webServer'];

/**
 * 插件配置 schema。导出名必须是 `Config`——cordis 运行时只读 plugin.Config
 * (Standard Schema 接口)做校验与默认值填充;导出 `schema` 会被静默忽略,
 * 导致 config 里嵌套对象为 undefined、apply 抛错、fiber FAILED 拖垮宿主启动。
 */
export const Config = memorySchema;

export async function apply(ctx: Context, config: MemoryConfig): Promise<void> {
  let logger: MemoryLogger = {
    debug: (m) => ctx.logger.debug(m),
    info: (m) => ctx.logger.info(m),
    warn: (m) => ctx.logger.warn(m),
    error: (m) => ctx.logger.error(m),
  };

  const dataDir = resolveDataDir(config);
  // dsh 宿主无持久化日志,镜像 info+ 到数据目录 memory.log 供蒸馏问题诊断
  const fileLogger = withFileLog(dataDir, logger);
  logger = fileLogger;

  // 供应商拓扑变化(增删/改配置)→ 思考档位能力缓存失效,下次调用重新探询
  ctx.on('llm/adapters-updated', () => invalidateEffortCache());

  // 存储初始化失败只降级(禁用捕获/蒸馏),绝不拖垮宿主——
  // 记忆是增强能力,数据目录不可写时 dsh 本体必须照常启动。
  let storageOk = true;
  try {
    await ensureDir(dataDir);
  } catch (err) {
    storageOk = false;
    logger.error(
      `[memory] 数据目录不可写,记忆功能停用: ${dataDir} (${err instanceof Error ? err.message : String(err)})`,
```

</details>

**依据 6 · 源码核查**：[src/index.ts:191-227](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/index.ts#L191-L227)

嵌入初始化及 FTS 回退。

<details>
<summary>查看原文（37行）</summary>

```text
  // ── 嵌入源三态(远程/本地/关闭)——状态文件优先于静态配置 ──
  const sourceStore = new EmbeddingSourceStore(dataDir, logger);
  const installer = new RuntimeInstaller(dataDir, PINNED_TRANSFORMERS_VERSION, { logger });
  const downloader = new ModelDownloadQueue(dataDir, {
    mirror: config.embedding.mirror,
    logger,
    proxy: config.embedding.proxy,
  });
  const makeLocalService = makeLocalServiceFactory(
    installer,
    downloader,
    logger,
    config.embedding.maxInputChars,
    undefined,
    config.embedding.maxInputTokens,
    config.embedding.respawnOnCrash,
  );
  let initial: InitialEmbedding = { svc: new NoopEmbeddingService(), dims: 0 };
  /** 管理器引用:启动重嵌链/backfill 闭包在运行期解引用(声明早于创建避免 TDZ)。 */
  // eslint-disable-next-line prefer-const -- 声明早于创建,后续单点赋值(TS 不允许 const 无初值)
  let embedManagerRef: EmbeddingManager | undefined;
  if (storageOk) {
    try {
      await sourceStore.init();
      initial = await resolveInitialEmbedding(config, sourceStore, downloader, makeLocalService, logger);
    } catch (err) {
      logger.warn(`[memory] 嵌入源初始解析失败(降级纯 FTS): ${errDetail(err)}`);
    }
  }
  /** meta 写入永远用当前目标(杜绝启动期闭包里的陈旧 providerInfo 腐蚀 embedding_meta)。 */
  const currentProviderInfo = (): EmbeddingProviderInfo | undefined =>
    embedManagerRef?.currentProviderInfo() ?? initial.providerInfo;

  // ── 检索引擎(memory.db)与向量服务 ──
  const embed = initial.svc;
  const memoryDbPath = path.join(dataDir, 'memory.db');
  const db = new MemoryDb(memoryDbPath, initial.dims, logger);
```

</details>

**依据 7 · 源码核查**：[src/index.ts:611-620](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/index.ts#L611-L620)

后台 SQL 优先工作线程，预备进程内实现。

<details>
<summary>查看原文（10行）</summary>

```text
  // 后台记忆后端:优先 worker 线程隔离(后台批处理的同步 SQL 不再占主事件循环),
  // 起不来就退回进程内(功能不受影响,只留一条 warn)。
  let backend: MemoryBackend = new InProcMemoryBackend(stores.l1);
  if (storageOk && !db.isDegraded()) {
    backend = await createMemoryBackend(
      { dbPath: path.join(dataDir, 'memory.db'), dimensions: initial.dims, logger },
      backend,
    );
  }
  stores.backend = backend;
```

</details>

**依据 8 · 源码核查**：[src/clients/drsc.ts:245-273](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/clients/drsc.ts#L245-L273)

默认进程内读，以及明确 HTTP 意图分支。

<details>
<summary>查看原文（29行）</summary>

```text
  /**
   * 一次读：优先进程内直调，失败/缺席一律包成 DrscClientError（与 HTTP 路同口径，
   * 调用方的「显式报错 vs 空窗降级」分面处理不变）。
   */
  private async readInproc(query: string): Promise<Record<string, unknown>> {
    const read = this.options.read ?? callCollectorRead;
    try {
      const body = await read(query);
      // body 已是 Record<string, unknown>，不必也不应再转 DrscEnvelope（TS2352）。
      if (body === null || typeof body !== 'object' || body.ok !== true) {
        throw new Error('返回包络缺 ok:true');
      }
      return body;
    } catch (err) {
      if (err instanceof DrscClientError) throw err;
      throw new DrscClientError(`collector 进程内读失败(${query}): ${err instanceof Error ? err.message : String(err)}`, {
        cause: err,
      });
    }
  }

  /** 一个 GET 的 JSON 包络(非 2xx / ok!==true / 超时 / 断网一律抛 DrscClientError)。 */
  private async getJson(query: string): Promise<Record<string, unknown>> {
    // 分流规则：只有「显式 HTTP 意图」才走 fetch —— 即配了 baseUrl（跨机/自托管
    // collector）或调用方自己注入了 fetchImpl（单测面）。两者都没给时走进程内：
    // 桌面宿主上插件服务端的 HTTP 必被 pre-dispatch 鉴权拦成 401（#20 真机实证）。
    const explicit = this.options.baseUrl?.trim() ?? '';
    if (explicit === '' && this.options.fetchImpl === undefined) return this.readInproc(query);
    const { url, hostHeader } = this.base();
```

</details>

**依据 9 · 源码核查**：[src/clients/drsc-inproc.ts:22-33](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/clients/drsc-inproc.ts#L22-L33)

收集器包及只读门面方法。

<details>
<summary>查看原文（12行）</summary>

```text
/** collector 包入口（裸名，由 profile 顶层 node_modules 解析）。 */
const COLLECTOR_PACKAGE = 'dsh-reference-session-collector';

/**
 * 门面形（collector >=0.2.5）：`drsReadFacade()` 返回绑它自己活 QueryContext 的
 * 只读对象。这是首选路径——消费方只认一个稳定符号，也不另开一份库。
 */
interface DrsFacadeLike {
  listSessions: (offset?: number, limit?: number) => Record<string, unknown>;
  sessionDetail: (sessionId: string, opts?: Record<string, unknown>) => Record<string, unknown>;
  search: (query: string, opts?: Record<string, unknown>) => Record<string, unknown>;
}
```

</details>

**依据 10 · 源码核查**：[src/index.ts:354-366](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/index.ts#L354-L366)

根插件装配实际收集器查询客户端。

<details>
<summary>查看原文（13行）</summary>

```text
  const stores = {
    usage: undefined as RecallUsageStore | undefined, // 装配于下方(依赖 dataDir 就绪)
    routeHealth: undefined as RouteHealthStore | undefined, // R9 路由健康学习，装配于下方
    // 轨2 技能结晶生产者（issue #15 的缺失环节）：装配于下方（依赖 skillStore 就绪）。
    skills: undefined as SkillProducer | undefined,
    // DRSC 客户端(T8.4 读切):蒸馏背景窗 + conversation_search 工具面的历史供给。
    // 硬依赖无本地回退(l0 表退役);trustedHosts 与宿主 origin 均惰性读取(两者可能晚于本插件就绪)。
    drsc: new DrscClient({
      trustedHosts: () => readStartupTrustedHosts(ctx),
      origin: () => readWebServerOrigin(ctx),
    }),
    l0: new L0Store(db),
    l1: new L1Store(
```

</details>

**依据 11 · 源码核查**：[src/tools/index.ts:596-622](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/tools/index.ts#L596-L622)

历史搜索直接查询 collector；故障和空结果可分。

<details>
<summary>查看原文（27行）</summary>

```text
      execute: async (args, exec) => {
        if (familyOfCaller(exec) === null) return { items: [], notice: blockNoticeOf(exec) };
        const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);
        // T8.4 读切(spec R7):检索命中走 DRSC 原文 fts,返回文本取 redact=1 脱敏列。
        // 硬依赖无本地回退(l0 本地检索已退役)——collector 缺席/故障显式报错给模型,
        // 与「空结果」口径分清,不抛穿主流程。
        const drsc = stores.drsc;
        if (!drsc) {
          return { items: [], notice: '历史对话检索不可用:DRSC collector 未装配(本地 L0 检索已退役,无回退)。' };
        }
        try {
          const hits = await drsc.search(args.query, limit);
          return {
            items: hits
              .map((h) => ({ h, role: drscRoleOf(h.kind) }))
              .filter((e): e is { h: (typeof hits)[number]; role: 'user' | 'assistant' } => e.role !== undefined)
              .map(({ h, role }) => ({
                session_id: h.session_id,
                role,
                content: h.snippet,
                timestamp: h.time,
              })),
          };
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err);
          return { items: [], notice: `历史对话检索暂不可用(DRSC collector: ${detail})。` };
        }
```

</details>

**依据 12 · 源码核查**：[src/config.ts:761-775](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/config.ts#L761-L775)

默认全局范围及捕获配置。

<details>
<summary>查看原文（15行）</summary>

```text
export const memorySchema: ConfigSchema = Schema.object({
  dataDir: Schema.string().default(''),
  family: Schema.union(['auto', 'chat', 'work']).default('auto'),
  // §E 可见范围:默认 global(既有部署不传该键 = 行为与改动前逐字一致)。
  // **实测**(schemastery):`Schema.union` 对非法值**抛错**——`$.x expected "a" | "b" but got "bogus"`;
  // `Schema.string()` 则原样透传。ADR-0008 条 4 要求「解析失败不阻断启动」
  // (历史上 `nullable` 崩溃整棵插件树的教训在案),故此处用 string + 消费侧 `normScope` 归一。
  // ⚠️ 既有 `family` 仍是 union,存在同款风险(传 'bogus' 会抛)——已登记 findings §17,不在本波修。
  scope: Schema.string().default('global'),
  capture: Schema.object({
    enabled: Schema.boolean().default(true),
    stripCodeBlocks: Schema.boolean().default(true),
    maxMessageChars: Schema.number().min(200).max(200_000).default(4000),
    // §C 默认开启:本地存储也不落明文密钥(决策记录见计划 spec §C)
    redactSecrets: Schema.boolean().default(true),
```

</details>

**依据 13 · 源码核查**：[src/workspace.ts:75-92](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/workspace.ts#L75-L92)

工作区模式未取到可用 cwd 会返回 undefined。

<details>
<summary>查看原文（18行）</summary>

```text
export function workspaceIdOf(exec: unknown): string | undefined {
  const cwd = (exec as WorkspaceExecLike | undefined)?.agent?.session?.header?.cwd;
  return normalizeWorkspacePath(cwd);
}

/**
 * §E 统一的「要不要过滤」判据:配置归一后**不是** `workspace` 时返回 `undefined`,
 * 调用方把它原样传给 `L1SearchOptions.workspaceId` → 走"不过滤"分支。
 *
 * 把判断收在这**一个**函数里,是为了让**零漂移成为结构性保证**:
 * 既有部署(`scope='global'`)在任何调用点都**不可能**意外传进一个工作区标识。
 * 若让每个调用点自己去读 `cfg.scope`,迟早有一处漏判——而漏判的表现是
 * "某条路径悄悄不做隔离",不会有任何报错。
 */
export function scopeFilterOf(cfgScope: unknown, exec: unknown): string | undefined {
  if (normScope(cfgScope) !== 'workspace') return undefined;
  return workspaceIdOf(exec);
}
```

</details>

**依据 14 · 源码核查**：[client/src/entry.tsx:221-242](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/client/src/entry.tsx#L221-L242)

Web 记忆库在宿主槽位挂载。

<details>
<summary>查看原文（22行）</summary>

```text
  const mountPage = (): (() => void) => {
    const row = ctx.slots.inject(PANEL_SEAT, () =>
      ctx.slots.register({ name: PANEL_SEAT, id: EXPLORER_ID, order: EXPLORER_ORDER, label: '记忆库' }, ExplorerIcon),
    );
    const page = ctx.slots.inject(MAIN_SEAT, () =>
      ctx.slots.register(
        { name: MAIN_SEAT, key: EXPLORER_ID, inject: () => ({ rpc, onClose: () => selectPanel(null) }) },
        ExplorerPage,
      ),
    );
    // 卸载序先页后行：反过来会让宿主短暂持有“有行无页”的选中态。
    return () => {
      page();
      row();
    };
  };

  const mountFooter = (): (() => void) =>
    ctx.slots.inject(FOOTER_SEAT, () =>
      ctx.slots.register(
        { name: FOOTER_SEAT, id: EXPLORER_ID, order: EXPLORER_ORDER, inject: () => ({ rpc }) },
        ExplorerFooterEntry,
```

</details>

**依据 15 · 源码核查**：[client/src/explorer/Scene3D.tsx:235-241](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/client/src/explorer/Scene3D.tsx#L235-L241)

悬臂散度参与布局参数。

```text
  // ── 布局：cluster 随数据重建；ego 进入时算一次并缓存 ──
  const axisNodes = useMemo(() => full.nodes.map((n) => ({ id: n.id, type: n.type, hall: (n as { hall?: string }).hall })), [full]);
  /** clusterLayout 由 full+axis 派生:轴切换会换布局引用,但硬落位 effect 只认 [full](F4)。 */
  const clusterLayout = useMemo(
    () => buildClusterShapeLayout(axisNodes, axisRef.current, shape, diskStyle, armSpreadRef.current),
    [axisNodes, axis, shape, diskStyle, armSpread],
  );
```

**依据 16 · 作者声明**：[README.md:104-110](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/README.md#L104-L110)

作者的重启与卸载数据保留说明。

```text
本包声明了 `dsh.bundle` 组合包层（`cordis.patch.yml`），安装后会**自动挂载插件行**——
不需要再手改 `$DSH_HOME/profiles/web/cordis.patch.yml`。然后重启 DeepSeek Harness，
验证：`~/.dsh/memory/` 下出现 `conversations/ records/ scenes/` 目录和 `memory.db`
即插件 apply 成功；设置页出现"记忆"页面、输入栏出现档位 pill 即 client 半边就绪。

**卸载**：`dsh plugin --profile web remove dsh-prime-memory` + 重启。数据保留在
`~/.dsh/memory/`，不需要时手动删除整个目录即可。
```

#### 缺口

- 收集器具体宿主组合、读面索引分区及实际脱敏结果未实测
  **影响**：无法确认组织隔离下的真实可用性
  **进一步探讨**：使用无敏感数据的两个测试 workspace，分别检查自动召回和 conversation_search 的可见范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 单次合格交接的总成本与收益有哪些证据？

**研究主题**：效果与总成本

#### 完整回答

成本单位取一次在新会话按最新约定完成且通过检查的任务。手工交接支付找文档与复核的人工时间，自动方案另外支付持续蒸馏、检索延迟、落盘及错误召回修订的代价。热路径的召回上限与后台单次模型超时是不同参数。召回默认 5 秒及总 2000 字符，向量嵌入初始配置默认不开。后台抽取按阈值与会话切片发生，路由可回退，每条路线有自己的超时预算。重启和退避会改变记忆何时可用。只测一次对话的模型调用会漏掉后台开销，单看 token 也会漏掉人的核对时间。

作者工作流基准的旧版插件在其样例里报告启用组完成 46/57 个检查、关闭组 35/57，并称两组都出现疑似越出沙箱读取记忆库的运行。报告的输入含缓存命中，测试包为 0.8.0，同一模型兼作判卷。本轮没有重跑基准，也没有把任务检查项当成 57 个完整任务或把缓存输入直接折算现金。判断 0.26.50 是否有净收益，需要同时记录固定模型下每个通过任务的前台与后台用量、首响应变化、失败重试、维护与人工复核分钟。没有这些数据，收益只能是对减少重复解释的机制判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:996-1023](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/config.ts#L996-L1023)

默认召回预算与嵌入开关。

<details>
<summary>查看原文（28行）</summary>

```text
  recall: Schema.object({
    enabled: Schema.boolean().default(true),
    maxResults: Schema.number().min(1).max(20).default(5),
    // 截断是引流——工具路径返回全文(注入形态契约见 ADR-0001)
    maxCharsPerMemory: Schema.number().min(0).max(100_000).default(500),
    maxTotalRecallChars: Schema.number().min(0).max(100_000).default(2000),
    timeoutMs: Schema.number().min(0).max(60_000).default(5000),
    includePersona: Schema.boolean().default(true),
    includeSceneNav: Schema.boolean().default(true),
    strategy: Schema.union(['keyword', 'embedding', 'hybrid']).default('hybrid'),
    scoreThreshold: Schema.number().min(0).max(1).default(0.3),
    // 时效衰减:乘法软加权 + 地板 0.5;0=关(bench 基线可比性可 pin 0)
    decayHalfLifeDays: Schema.number().min(0).max(3650).default(30),
    // repo 软围栏(治理 W1):默认关=零漂移。开启也只是软减权非硬排除(P0-7:
    // cross-project 绝不围栏,四象限不塌缩)
    scopeFence: Schema.object({
      enabled: Schema.boolean().default(false),
      crossRepoMultiplier: Schema.number().min(0).max(1).default(0.2),
    }),
  }),
  embedding: Schema.object({
    enabled: Schema.boolean().default(false),
    baseUrl: Schema.string().default(''),
    apiKey: Schema.string().default(''),
    model: Schema.string().default(''),
    // 0 = 纯 FTS 模式(合法值,勿设 min>0)
    dimensions: Schema.number().min(0).max(8192).default(0),
    maxInputChars: Schema.number().min(100).max(100_000).default(5000),
```

</details>

**依据 2 · 源码核查**：[src/config.ts:1036-1049](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/config.ts#L1036-L1049)

宿主模型及回退链定义。

<details>
<summary>查看原文（14行）</summary>

```text
  llm: Schema.object({
    provider: Schema.string().default(''),
    model: Schema.string().default(''),
    // 压缩通道:'host' 复用宿主(默认);'direct' 插件原生直连,失败回退宿主路由
    mode: Schema.union(['host', 'direct']).default('host'),
    baseURL: Schema.string().default(''),
    apiKey: Schema.string().default(''),
    // 回退链:每条路由各享全额 timeoutMs(慢 TTFT 模型的回退位要留足首包时间);
    // 条目档位经能力钳制后发送
    fallbacks: Schema.array(Schema.object({
      provider: Schema.string().default(''),
      model: Schema.string().default(''),
      reasoningEffort: Schema.union([...EFFORT_CHOICES]).default(''),
    })).default([]),
```

</details>

**依据 3 · 源码核查**：[src/config.ts:1070-1082](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/config.ts#L1070-L1082)

独立的蒸馏模型预算和超时。

<details>
<summary>查看原文（13行）</summary>

```text
    maxTokens: Schema.number().min(1024).max(1_000_000).default(65_536),
    // 蒸馏思考档位:'' = 自动(按模型能力解析);显式值仅在该模型声明支持时发送。
    // 旧默认 'off' 在非 deepseek 模型上必炸(400/本地拒绝)
    reasoningEffort: Schema.union([...EFFORT_CHOICES]).default(''),
    temperature: Schema.number().min(0).max(2).default(0.3),
    // 单次调用输入闸门默认压到本地模型可参与区间(200k,可再降);上限 256k(<256 KiB)。
    // 旧 700k 为盲值、远超本地/免费路由窗口 → 大调用撞模型硬限。抽取/L2 分块另有 24k 硬顶，不受此影响。
    maxInputChars: Schema.number().min(1000).max(256_000).default(200_000),
    timeoutMs: Schema.number().min(1000).max(600_000).default(120_000),
    // R5 整轮抽取墙钟预算(ms):0=不限(旧行为);>0 超预算把剩余块留 pending 下轮续
    extractTimeBudgetMs: Schema.number().min(0).max(3_600_000).default(0),
    // 二线蒸馏模型(大容量兜底):输入 ≥ triggerChars 才启用;provider/model 空=该档不可用
    secondary: Schema.object({
```

</details>

**依据 4 · 源码核查**：[src/pipeline/runner.ts:795-828](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/pipeline/runner.ts#L795-L828)

队列工作的触发不按前台单任务计。

<details>
<summary>查看原文（34行）</summary>

```text
    // ── L1:抽取 + 去重(按档分桶、桶内按会话切片;失败按切片保留待重试) ──
    let newRecords: Awaited<ReturnType<typeof runExtraction>>['newRecords'] = [];
    const liveNow = this.live.get();
    const distillOn = liveNow.enabled && liveNow.distill;
    if (cfg.extract.enabled && distillOn) {
      const bucket = this.pending[mode];
      // 入桶即携带会话标识(会话切片成员;切片内永不跨会话混装)
      bucket.push(...messages.map((m): PendingMessage => ({ ...m, sessionId })));
      if (!opts?.noBufferCap && bucket.length > PENDING_BUCKET_CAP) {
        bucket.splice(0, bucket.length - PENDING_BUCKET_CAP);
      }
      if (messages.length > 0) this.lastActivity.set(sessionId, Date.now());
      // 按会话切片触发:只看本会话切片是否达到生效阈值(渐进爬坡),
      // 达标只抽取该切片——其余会话的切片继续攒,绝不跨会话混装。
      // force:重建轮全量蒸馏(历史小会话也必须出记忆,不受阈值约束)。
      const effective = effectiveExtractThreshold(this.warmup[mode], cfg.extract.minMessages);
      const sliceLen = bucket.reduce((n, m) => (m.sessionId === sessionId ? n + 1 : n), 0);
      // 抽取失败退避:重建轮(noBufferCap,用户显式动作、有自己的失败/取消 UI)豁免
      const backedOff = !opts?.noBufferCap && !opts?.bypassBackoff && this.inExtractBackoff(sessionId);
      if ((opts?.force || sliceLen >= effective) && !backedOff) {
        newRecords = await this.extractSessionSlice(sessionId, mode, cfg, effective, opts);
        // 新记录入投影队列(优先级恒高于存量补投影)并拉起图谱泵;入队本身廉价,
        // 开关关时由 enqueueGraphFor 抹投影凭证(避免重开后永久陈旧)，重开由补投影兜底。
        // (写面 R2:分支本体抽成 enqueueGraphFor,与工具三路径同源,不再两处漂移。)
        this.enqueueGraphFor(newRecords.map((r) => r.id));
      } else {
        this.logger.debug?.(
          backedOff
            ? `[memory] 蒸馏退避中,本轮跳过抽取(session=${sessionId},mode=${mode})`
            : `[memory] 会话切片攒批中(session=${sessionId},mode=${mode},${sliceLen}/${effective})`,
        );
        // 攒阈值中途也落盘:进程退出后切片与爬坡状态不丢
        await this.persistPending(opts?.noBufferCap);
      }
```

</details>

**依据 5 · 作者声明**：[bench/baseline/workflow-report.md:5-12](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/bench/baseline/workflow-report.md#L5-L12)

作者记录运行组、插件版本及判卷模型。

````text
## 环境
```
A 组 bench/results/run-wf-A-2026-08-20T08-28-55/rep-1：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
A 组 bench/results/run-wf-A-2026-08-20T08-28-55/rep-2：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
A 组 bench/results/run-wf-A-2026-08-20T08-28-55/rep-3：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
B 组 bench/results/run-wf-B-2026-08-20T08-58-26/rep-1：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
B 组 bench/results/run-wf-B-2026-08-20T08-58-26/rep-2：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
B 组 bench/results/run-wf-B-2026-08-20T08-58-26/rep-3：deepseek-official/deepseek-v4-flash（判卷 deepseek-official/deepseek-v4-flash，插件 0.8.0，4 场景）
````

**依据 6 · 作者声明**：[bench/baseline/workflow-report.md:28-45](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/bench/baseline/workflow-report.md#L28-L45)

作者结果包括输入计量口径、完成度及明确的沙箱异常。

<details>
<summary>查看原文（18行）</summary>

```text
## 效率次表（每场景均值，教学+变更+探针全会话合计；输入含缓存命中）

| 组 | 场景数 | 轮次/场景 | 步骤/场景 | 输入 token/场景 | 输出 token/场景 | 稳态缓存率 |
|---|---|---|---|---|---|---|
| A 组 | 12 | 2.0 | 21.2 | 232128 | 14550 | 96.8% |
| B 组 | 12 | 2.3 | 37.3 | 2190707 | 29553 | 99.1% |

> 输入/输出 token 为供应商上报值（usage 事件）；输入 = 非缓存 inputTokens + 缓存命中 cacheReadTokens。稳态缓存率剔除每会话首请求（新会话首问的前缀天然未命中，不代表引擎健康度；跨会话前缀缓存共享还受跑序影响）。

## 工作流赛道（复杂任务延续：完成度校验 + 反问次数）

| 组 | 场景数 | 完成度校验 | 探针反问次数 |
|---|---|---|---|
| A 组 | 12 | 46/57 | 0 |
| B 组 | 12 | 35/57 | 3 |

> ⚠ 疑似越出沙箱读取记忆库的运行：A、B 组（见 result.json 的 toolAudit）
> 完成度 = 产物文件与关键内容校验（程序化）；反问 = 探针会话中 agent 向用户求助次数（补发固定重述，token 如实计入）。
```

</details>

#### 缺口

- 没有同版本含后台、缓存、失败重试与复核的完整对照
  **影响**：无法估计单位合格任务的净现金与人力成本
  **进一步探讨**：独立计量模型用量和人工分钟，并以通过的完整任务作分母

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用可核查的试用检验项目习惯的鲜度与隔离？

**研究主题**：新假设与验证、采用判断

#### 完整回答

源码支持一个待验证假设：对于固定小组经常重开的同一测试项目，把带版本、范围和替代关系的约定作为可见候选推给 Agent，用户可以保留仓库文档作为裁决源，同时减少每次贴完整交接文档。增量取决于用户用来源区分候选提示和正式约定，并能识别旧版本。召回中已有来源和预算，未看到能根据当前仓库约定版本自动判定候选是否仍然有效的保证。静态交接单维护成本较显性，但有确定的审阅入口，仍适合用作对照。

最小验证在两个无敏感内容的独立工作区进行：给甲仓库一个测试约定，次会话替换并在乙仓库创建同名但不同的约定，用同一模型分别运行手工交接与开启记忆的交接。检查注入是否可查、是否命中新约定、历史检索能否读到另一个工作区、运行结果是否通过当前仓库检查。记录失败而不是只记命中。出现错误约定实际进入用户结果、越界历史或停用后仍持续注入时停止试用，切掉对应 profile 的捕获与召回并以已核实的项目文档接续。退出前保留必要交接记录，并分别管理本插件与收集器留存。权限敏感团队在隔离未验证前应观察。

#### 证据与依据

**依据 1 · 源码核查**：[src/hooks/recall.ts:674-715](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L674-L715)

预算内注入包含来自不同记录的文本，并标明消息来源。

<details>
<summary>查看原文（42行）</summary>

```text
          const lines = applyRecallBudget(
            fresh.map((h) =>
              `- [${h.scene_name ? `${h.type}|${h.scene_name}` : h.type}] ${h.content}` +
              // 外部记忆行归因(Phase 1 T1.12):id 形如 `ext:<driver>:<space>:<ext>` → 标来源驱动,
              // 让模型知道这是"借来的记忆"而非本地蒸馏产物(bench 注入行归因也吃这个前缀)。
              (h.id.startsWith('ext:') ? `（via external:${h.id.slice(4, h.id.indexOf(':', 4))}）` : '') +
              // 门2 task_3.4:疑而不隐——valid_to 来源不可信的行保留注入但带标注,
              // 人/模型自行裁量。灰度关时 suspectIds 恒空,行形状逐字不变。
              (suspectIds.has(h.id) ? '（疑似失效:有效期来源不可信）' : ''),
            ),
            { maxCharsPerMemory: cfg.recall.maxCharsPerMemory, maxTotalRecallChars: cfg.recall.maxTotalRecallChars },
          );
          if (lines.length === 0) {
            // §F 追踪:预算清零轮(截断后无完整行)
            trace({
              kind: 'recall_turn', ts: Date.now(), sessionId: sessionKey, queryChars, querySha, queryText,
              hitIds: fresh.map((h) => h.id), hitScores: fresh.map((h) => Number(h.score.toFixed(4))),
              injectedIds: [], suppressedCount: scoped.length - fresh.length,
              durationMs: Date.now() - searchStart, outcome: 'suppressed',
            });
            usage?.recordAttempt(fresh.map((h) => h.id), []);
            return decision;
          }
          st.lastHits = lines.length;
          const text = [
            '<relevant-memories>',
            '以下是当前对话召回的相关记忆，不代表当前任务进程，仅作为参考：',
            '',
            ...lines,
            '',
            '</relevant-memories>',
          ].join('\n');
          logger.info(
            `[memory] 召回注入 ${lines.length} 条 L1(mode=${mode},query="${query.slice(0, 30).replace(/\n/g, ' ')}…",agent=${payload.agent.id},消息侧)`,
          );
          const injection = createUserMessage({
            content: [{ type: 'text', text }],
            // v4（宿主 ≥0.1.7-rc.1）署名为 producer-owned kind：plugin:<子系统名>。
            // 用展示友好的子系统名 memory,不用 cordis id(dsh-memory);宿主 UI 标题
            // 规则随之变化(不再有 catch-all 'plugin' 的通用"上下文注入"标题)。
            // v3 旧行(kind:'plugin'+plugin 字段)由宿主 v3→v4 迁移升格,读侧双形状兼容。
            source: { kind: 'plugin:memory', form: 'recall' },
```

</details>

**依据 2 · 源码核查**：[src/hooks/recall.ts:453-477](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/recall.ts#L453-L477)

启停与步骤门控是试验可操作项。

<details>
<summary>查看原文（25行）</summary>

```text
  if (cfg.recall.enabled) {
    ctx.on(
      'agent/pre-step',
      async (payload, next) => {
        // §D 超时清扫:超时未确认的注入照旧标记(降级保连续,防 dedupe 失效回归);
        // 正常确认在秒级完成,这里只是兜底。一次性提示。
        const expiredAcks = expirePendingInjections();
        if (expiredAcks > 0 && !ackDegradeWarned) {
          ackDegradeWarned = true;
          logger.warn(`[memory] 注入确认:${expiredAcks} 条 pending 超时未回执,已降级为照常标记(一次性提示)`);
        }
        const decision = await next();
        if (decision.kind === 'reject' || payload.signal.aborted) return decision;
        try {
          const s = live.get();
          // 档位/锁域读**所有者**(子代理上溯父链);统计与去重仍按各自 agent(上下文独立)
          const ownerId = resolveModeOwner(payload.agent.id, payload.agent);
          const mode = modes.get(ownerId);
          // 三级读闸:主闸 → off 档(完全隐身)→ 注入开关(会话覆盖 ?? 全局)
          if (!s.enabled || mode === 'off' || !modes.resolvedRecall(ownerId, s.recall)) return decision;
          // 只在有新的用户来源消息的步骤注入(轮首 claim 或 steering 插话);纯工具步透传
          const hasNewUserMessage = decision.messages.some(
            (m) => (m as { source?: { kind?: string } }).source?.kind === 'user',
          );
          if (!hasNewUserMessage) return decision;
```

</details>

**依据 3 · 源码核查**：[src/tools/index.ts:596-622](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/tools/index.ts#L596-L622)

历史检索需单独验收范围并识别收集器错误。

<details>
<summary>查看原文（27行）</summary>

```text
      execute: async (args, exec) => {
        if (familyOfCaller(exec) === null) return { items: [], notice: blockNoticeOf(exec) };
        const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);
        // T8.4 读切(spec R7):检索命中走 DRSC 原文 fts,返回文本取 redact=1 脱敏列。
        // 硬依赖无本地回退(l0 本地检索已退役)——collector 缺席/故障显式报错给模型,
        // 与「空结果」口径分清,不抛穿主流程。
        const drsc = stores.drsc;
        if (!drsc) {
          return { items: [], notice: '历史对话检索不可用:DRSC collector 未装配(本地 L0 检索已退役,无回退)。' };
        }
        try {
          const hits = await drsc.search(args.query, limit);
          return {
            items: hits
              .map((h) => ({ h, role: drscRoleOf(h.kind) }))
              .filter((e): e is { h: (typeof hits)[number]; role: 'user' | 'assistant' } => e.role !== undefined)
              .map(({ h, role }) => ({
                session_id: h.session_id,
                role,
                content: h.snippet,
                timestamp: h.time,
              })),
          };
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err);
          return { items: [], notice: `历史对话检索暂不可用(DRSC collector: ${detail})。` };
        }
```

</details>

**依据 4 · 源码核查**：[src/hooks/capture.ts:140-155](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/src/hooks/capture.ts#L140-L155)

关档停止捕获的条件。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    try {
      const s = live.get();
      if (!s.enabled || !s.capture) return;
      const sid = String(session.id ?? session);
      // §D 日志回执(memorax-absorb):注入消息以原样 user/message 入日志时在此确认,
      // 才真正 dedupe.mark。**必须置于 source.kind 过滤之前**——过滤在
      // turnEventsToMessages 内且只放行 kind='user',注入消息(kind='plugin:memory')
      // 走不到那里;也置于 off 档返回之前(确认与档位无关,且代价是一次 Map 查找)。
      if (event.type === 'user/message') {
        const mid = (event.data as { id?: unknown }).id;
        if (typeof mid === 'string' && mid) confirmInjectionByMessageId(mid);
      }
      // off 档:本会话对记忆系统完全隐身(不缓冲、不写 L0、不蒸馏)
      if (modes.get(sid) === 'off') return;
      if (!isCaptureRelevant(event.type)) return;
```

</details>

**依据 5 · 作者声明**：[README.md:104-110](https://github.com/drscrewdriver/dsh-prime-memory/blob/f93d0ee6e8618a8460a4ad7ce9eae74da885e293/README.md#L104-L110)

作者说明的退出与留存。

```text
本包声明了 `dsh.bundle` 组合包层（`cordis.patch.yml`），安装后会**自动挂载插件行**——
不需要再手改 `$DSH_HOME/profiles/web/cordis.patch.yml`。然后重启 DeepSeek Harness，
验证：`~/.dsh/memory/` 下出现 `conversations/ records/ scenes/` 目录和 `memory.db`
即插件 apply 成功；设置页出现"记忆"页面、输入栏出现档位 pill 即 client 半边就绪。

**卸载**：`dsh plugin --profile web remove dsh-prime-memory` + 重启。数据保留在
`~/.dsh/memory/`，不需要时手动删除整个目录即可。
```

#### 缺口

- 跨项目同名及变更后的任务没有本轮结果
  **影响**：该假设不足以支撑当前安装推荐
  **进一步探讨**：按所述对照用错误约定和越界历史作失败条件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
