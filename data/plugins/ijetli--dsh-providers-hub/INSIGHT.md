# Providers Hub（Jet Hub）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6ad2e24](https://github.com/iJetLi/dsh-providers-hub/tree/6ad2e241a08c1204999a730dcfb212c9602929c5)

<!-- BEGIN META -->
[![GitHub ★ 127](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=127&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iJetLi/dsh-providers-hub) [![npm 30d 9,065](https://img.shields.io/static/v1?label=npm+30d&message=9%2C065&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-providers-hub) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-providers-hub)
<!-- END META -->

> **功能**：统一管理 AI 编程服务账号、续期与模型路由，并提供本机 OpenAI 兼容网关。

> **亮点**：把账户与模型入口集中，并在聚合流中避免产出后拼接第二服务的回答。收益集中在重复配置和故障诊断流程。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：实际渠道、协议与权限各有边界；最终渠道记录不代表此前候选未受理或未计费。通用轮换也不能替代每家服务的授权与可用性核实。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 相比逐服务登录和配置适配器，Hub 的增量是什么？](#detail-section-11)
  - [Q02 · 续期和聚合失败怎样处理？](#detail-section-12)
  - [Q03 · 网关凭据、账号边界与成本是什么？](#detail-section-13)
  - [Q04 · 怎样限定采用并检验切换结果？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：拥有多个已授权 AI 编程服务账号、需要在 DSH 中持续管理可用模型的用户，可集中配置和观察账号状态。

逐服务适配器和登录也可工作，但账号顺序、状态、目录与续期分散。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 账号池 | 按规则给适配器选择账号 | 服务可用性和凭据需核验 |
| 续期 | 减少逐次登录 | 按 provider 的实现和状态处理 |
| 兼容网关 | 供其他客户端复用路由 | 持 key 者共享相应账号能力 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| DSH 与构建链 | 注册适配器和 Jet Hub | 源码需编译客户端和资源 |
| 供应商账号 | 登录、模型调用和续期 | 应已获授权，逐服务验证 |
| 本机 key | 让外部客户端访问网关 | 需要维护客户端配置及撤销 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 仅一个测试渠道与 loopback 网关 | 先验证无 key 拒绝 |
| 持续 | 记录渠道、候选失败和账号状态 | 输出后错误停止，核对是否已受理 |
| 退出 | 停聚合及网关，撤销测试账号并处理 key | 分别核查已配置外部客户端 |

**效果与成本**

| 成本 | 单位 | 边界 |
| --- | --- | --- |
| 模型与服务 | 每个合格任务全部候选尝试的实际费用 | 首帧前失败也可能计费 |
| 人工 | 每账号登录、续期、故障排查 | 服务漂移未量化 |
| 退出 | 撤销账号与外部 key | 耗时未知 |

| 效果 | 判据 | 限制 |
| --- | --- | --- |
| 集中维护 | 单账号状态与预期路由一致 | 各渠道单独核验 |
| 回答完整 | 取消及失败不拼接多个候选内容 | 未运行同版本实验 |

> **思考**：实际渠道、协议与权限各有边界；最终渠道记录不代表此前候选未受理或未计费。通用轮换也不能替代每家服务的授权与可用性核实。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把账户与模型入口集中，并在聚合流中避免产出后拼接第二服务的回答。收益集中在重复配置和故障诊断流程。[Q01](#research-q01) [Q02](#research-q02)

续期同进程互斥且失败仍保持调度，聚合响应在正常结束后记录实际渠道；这些模式可复用。网关 key 的跨进程生成与具体服务生命周期需独立实验。

<a id="detail-section-5"></a>

### 1.4 主要限制

实际渠道、协议与权限各有边界；最终渠道记录不代表此前候选未受理或未计费。通用轮换也不能替代每家服务的授权与可用性核实。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察。先用一个已授权测试账号验证登录、一次调用、续期失败和退出，确认实际渠道与费用可对账后再讨论聚合。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码覆盖通用账号、调度、聚合和本机网关。各 provider 的真实登录、费用、积分与服务授权没有在本轮验证。

- 已检查：作者 README、包清单、源码路径 src/account-pool.ts、src/refresh-scheduler.ts、src/aggregate-adapter.ts、src/openai-gateway/server.ts、src/openai-gateway/auth.ts、src/index.ts、src/openai-gateway/config.ts、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖通用账号、续期、聚合与网关关键代码；没有逐个 provider 审计，未运行目标或登录。
- 下一步：用假适配器检查空池后加账号、首帧前后错误、块已开和取消，再用授权测试账号核对一次真实账单和 key 撤销。

**分析版本**

- **仓库**：[iJetLi/dsh-providers-hub](https://github.com/iJetLi/dsh-providers-hub)
- **版本号**：0.2.1-rc.2（[固定提交 6ad2e24](https://github.com/iJetLi/dsh-providers-hub/tree/6ad2e241a08c1204999a730dcfb212c9602929c5)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用请求级记录解释每个候选的受理、输出和未知成本，比较失败切换的账单一致性与排障时长；解释能力不升且延迟升高则撤回。[Q04](#research-q04)

用假适配器检查空池后加账号、首帧前后错误、块已开和取消，再用授权测试账号核对一次真实账单和 key 撤销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 53 | 41005 | — | — | 595827 |
| .js | source | 40 | 26892 | 12791 | 13300 | — |
| .mjs | source | 10 | 2824 | 2040 | 551 | — |
| .ts | source | 294 | 198379 | 89344 | 101216 | — |
| .ts | test | 616 | 259417 | 175002 | 65322 | — |
| .md | test | 1 | 445 | — | — | 9634 |

</details>

**活跃度**

[![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/iJetLi/dsh-providers-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多账户路由、续期和本机网关减少哪些重复配置，可靠性如何受具体服务影响？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比逐服务登录和配置适配器，Hub 的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有多个 AI 编程服务账户、需要在 DSH 切换可用模型的人，可用统一面板管理账号与凭据，并复用模型路由到本机兼容网关。单独配置适配器也能调用模型，差别是账号状态、手动顺序、续期与目录管理集中。账号池按候选顺序取第一个可解凭据，ZCode 另有会话亲和，不能将所有渠道的选择语义概括为同一负载均衡。合格操作是选到预期可用账号，并可追溯实际服务和模型。README 的渠道数只是作者口径，本轮未逐个核对可用性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-20](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/README.md#L10-L20)

作者陈述统一账号池、续期和本机网关目标。

<details>
<summary>查看原文（11行）</summary>

```text
deepseek-harness 插件：统一管理多个 AI 编程服务的账号，并把它们的模型接进 DSH
的模型选择器。支持**多账号池**（同一服务登录多个账号，按可用性自动选号）与
**凭据静默续期**（到期前自动刷新，无需再次打开浏览器）。

- **29 个 provider 路由**，外加 1 个**聚合**路由（见下）
- 登录、状态、续期、积分领取**全部在 Jet Hub 设置页完成**，不注册任何斜杠命令
- 附带一个**本机 OpenAI 兼容网关**，供其它客户端复用已登录账号

> 📌 **本 README 只写「怎么用」。** 各 provider 的协议、端点、登录流程、请求头
> 构造、实测数据与事故史等**实现细节**，统一记录在不入库的内部文档
> `docs/implementation-notes.md` 中。需要改动实现或排查协议问题时读它。
```

</details>

**依据 2 · 源码核查**：[src/account-pool.ts:2633-2660](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/account-pool.ts#L2633-L2660)

手动顺序选号和 ZCode 会话亲和分别定义。

<details>
<summary>查看原文（28行）</summary>

```text
  async getAvailableAccount<TCredential = CodeArtsCredential | BuddyCredential>(
    provider: string,
    modelId: string,
    excludeAccountIds?: ReadonlySet<string>,
  ): Promise<{ entry: ProviderAccountEntry; credential: TCredential } | null> {
    const candidates = this.candidateAccounts(provider, modelId, excludeAccountIds)
    if (candidates.length === 0) return null
    // 候选顺序即**用户在 Jet Hub 拖拽设定的手动顺序**（`reorderAccounts` 写入）。
    //
    // 为什么不再按「限流重置时间最早到期」重排（早期实现如此）：
    // 那个排序会让手动顺序形同虚设 —— 用户把某账号拖到首位，只要另一个
    // 账号的限流重置时间更早，实际选中的仍是后者，拖拽变成纯 UI 装饰。
    // 现在的语义是「手动顺序优先，限流豁免」：顺序完全由用户决定，
    // 而当前正处于限流期的账号已被候选筛排除，不会选到。
    //
    // 注意 candidates 来自 readAccounts() 的 filter，而 filter 保持原数组
    // 顺序，故这里天然就是手动顺序，无需任何排序。
    return await this.resolveFirstCredential<TCredential>(provider, candidates)
  }

  /**
   * 按 **sessionId** 选号（ZCode 专用，2026-10-30 用户要求）。
   *
   * - `sessionId` 非空：用 rendezvous 哈希把同一会话**稳定映射**到同一个候选
   *   账号（会话亲和），不同会话自动分散到不同账号；账号集合变化时只迁移
   *   原本落在该账号上的会话。
   * - `sessionId` 为空/未传：随机洗牌后取第一个可用账号（本地 OpenAI 网关等
   *   不带 DSH 会话标识的请求，随机均衡）。
```

</details>

**依据 3 · 源码核查**：[src/index.ts:6797-6799](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/index.ts#L6797-L6799)

本机网关实际由主入口挂载。

```text
  // 网关是旁路功能：这里传 `pool` 只为读设置页里的开关，其内部任何失败都已
  // 自行降级为日志，绝不会让插件 apply() 失败。
  mountOpenAiGateway(ctx, pool)
```

#### 缺口

- 全部供应商适配器及现有原生能力未逐一验证
  **影响**：无法宣称所有渠道当前能登录或稳定调用
  **进一步探讨**：先选一个已授权账户核对模型目录、选中账号与请求结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 续期和聚合失败怎样处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主入口建立续期调度器，首轮延迟十五秒，周期已武装。调度用 running 防同进程重叠，异常记录后保留定时，空账号池也不会停止。聚合适配器在迭代流外捕获错误，取消向上抛，已产出可见内容后不切候选，以免把两个回答拼接；正常流结束后才记录本次实际渠道。这个保护是响应拼接语义，不能证明前一个上游没收取请求费用，也不提供跨服务动作的幂等性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:5385-5408](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/index.ts#L5385-L5408)

主入口配置延迟、调用与错误报告。

<details>
<summary>查看原文（24行）</summary>

```text
  const refreshScheduler = new MultiAccountRefreshScheduler({
    refresh: refreshAllCredentials,
    intervalMs: REFRESH_INTERVAL_MS,
    /**
     * 首轮延后 15s（issue #20）：宿主启动时插件并发初始化，立即对全量账号
     * 发续期会和启动路径抢网络/凭据存储，日志里常见一串冷启动 `fetch failed`。
     * 周期定时器仍然立刻武装；只有首轮让路。
     */
    initialDelayMs: 15_000,
    isPoolEmpty: async () => (await pool.listAllAccounts()).length === 0,
    // ⚠️ 可选链：`logger` 在极简 profile 下可能缺席，而日志不该成为续期的
    // 单点故障（与仓库既有的 `ctx.logger?.warn?.()` 一致）。
    info: (message) => ctx.logger?.info?.(message),
    warn: (message) => ctx.logger?.warn?.(message),
  })
  // ⚠️ 不 await：`apply()` 是同步函数，而 `start()` 内含首轮续期（会发网络请求，
  // 可达数十秒）。阻塞在这里会让插件启动卡住（与 opencode 能力预热同款约定）。
  void refreshScheduler.start().catch((error: unknown) => {
    // 走到这里说明 `refresh()` 或订阅通知本身出了意料之外的异常；`onTick`
    // 内部已消化常规失败，故这条只是最后一道可观测性兜底。
    ctx.logger?.warn?.(
      `[jet-hub] 多账号续期调度器启动失败（本次会话不会自动续期）：`
      + `${error instanceof Error ? error.message : String(error)}`,
    )
```

</details>

**依据 2 · 源码核查**：[src/refresh-scheduler.ts:190-216](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/refresh-scheduler.ts#L190-L216)

互斥、空池与异常后的调度持续性。

<details>
<summary>查看原文（27行）</summary>

```text
  private async onTick(context?: { initial: boolean }): Promise<void> {
    if (this.running) {
      this.options.warn?.('[jet-hub] 上一轮续期尚未结束，跳过本轮')
      return
    }
    this.running = true
    try {
      const empty = await this.probeEmpty()
      if (empty) {
        // ⚠️ 这里**必须留痕**：issue IKJOZB 的一半伤害来自「日志无痕」——
        // 用户看到「可自动续期」却永远不续，且没有任何线索。
        // 措辞要能让人区分「正常等待」与「调度坏了」。
        this.options.info?.(
          context?.initial === true
            ? '[jet-hub] 账号池为空：续期调度器已武装并等待首个账号入库（后续每 30 分钟复查）'
            : '[jet-hub] 账号池仍为空，本轮无可续期账号（调度器保持武装）',
        )
      }
      await this.options.refresh()
    } catch (error) {
      this.options.warn?.(
        `[jet-hub] 一轮续期失败（调度器保持武装，下轮重试）：`
        + `${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      this.running = false
    }
```

</details>

**依据 3 · 源码核查**：[src/aggregate-adapter.ts:2795-2823](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/aggregate-adapter.ts#L2795-L2823)

明确流迭代和可见内容后不切换的设计。

<details>
<summary>查看原文（29行）</summary>

````text
   *
   * ## 为什么必须自己实现失败切换
   *
   * DSH 层没有跨 provider 重试：`dsh-llm-retry` 的 `retryStateKey(provider, policyKey)`
   * 只重试**同一** provider/model。故跨渠道切换只能在这里做。
   *
   * ## 为什么 `catch` 要包在**迭代过程**外层
   *
   * 生产路径只走 `prepareCall` 返回的 `call.stream`，而真实错误发生在**迭代
   * 过程中**（dsh-llm 的 `iterator.next()`），不是 `prepareCall` 自己抛的
   * ⇒ `try` 必须包住 `for await`。
   *
   * ## ⚠️⚠️ 只在「一个 chunk 都还没产出」时才能切换（本实现的关键约束）
   *
   * 已 `yield` 出去的内容**收不回来**。若某个候选先吐了「答案是……」然后中途失败，
   * 我们再切到下一个候选，用户看到的是：
   *
   * ```
   * 答案是……答案是 42。
   *      ↑ A 的半截        ↑ B 的完整答案
   * ```
   *
   * 这是**两段拼接的畸形回答**，比「半截 + 报错」严重得多 —— 前者看起来像一句
   * 正常但奇怪的话，用户会当成模型的问题；后者至少明确告诉用户失败了。
   * 本仓库对「静默降级」有明确红线（反复修过的那类缺陷），而拼接畸形内容更甚。
   *
   * ⇒ 规则：**该候选只要产出过「可见内容」，其后任何失败都直接向上抛**，不再尝试下一个。
   * 「切换」只发生在「尚未产出任何可见内容」的失败上（连接失败、认证失败、上游立刻
   * 返回错误 —— 这些恰好是跨渠道切换真正有价值的情形）。
````

</details>

**依据 4 · 源码核查**：[src/aggregate-adapter.ts:3024-3049](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/aggregate-adapter.ts#L3024-L3049)

流结束提交实际渠道，错误按取消或已输出处理。

<details>
<summary>查看原文（26行）</summary>

```text
              // ⇒ 改为：这里只记 `pendingProvider`，等**这一轮的 `for await` 正常结束**
              //   （即候选真的把整轮跑完）才提交进 Map。见下方 `return` 之前的提交处。
              pendingProvider = target.provider
            }
            yield chunk
          }
          // ⚠️ 走到这里 = 该候选的流**正常结束**（没有抛错、没有失败帧）⇒ 提交「实际选中」。
          if (pendingProvider !== undefined) {
            // ⚠️ 是**实际发往**的 `target.provider`，不是候选序第一个（带图改道时可能不同）。
            // ⚠️ 同时更新「最近一次」指针：`Map` 的迭代顺序是**插入顺序**，
            //    覆盖已存在的键**不改变**其位置 ⇒ 不能靠它取「最近」。
            self.activeProviderByModel.set(modelKey, pendingProvider)
            self.lastActiveProvider = pendingProvider
          }
          return
        } catch (error) {
          lastError = error
          // ⚠️ 中止/取消**不换候选**，立刻向上抛。
          if (isAbortLike(error, options.signal)) throw error
          if (emitted) {
            // 已经吐过内容：不能切换（否则把两段回答拼在一起）。
            self.ctx.logger?.warn?.(
              `[aggregate] ${target.provider}（${target.realId}）在产出内容后失败，`
              + `不再切换候选（已产出的内容无法撤回）：${String(error)}`,
            )
            throw error
```

</details>

#### 缺口

- 具体 provider 错误帧及断流未在真实宿主复现
  **影响**：跨渠道费用和失败分类未知
  **进一步探讨**：用可控适配器模拟首帧前失败、块已开、文字已出和用户取消，检查只产生一段结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网关凭据、账号边界与成本是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

网关默认本机地址，访问除 OPTIONS 外需要与本地 key 一致的 Bearer 头，具有 key 的客户端会使用同一个已登录账号池。key 可从环境变量来，也可生成后以 0600 临时文件改名保存；文件非空且形态异常会报错，读失败却会进入生成路径。跨进程同时生成时，普通 rename 在某些系统可覆盖已有文件，不能只凭异常分支就证明多个进程共享相同 key。操作人要维护账号、续期失败、模型目录和网关 key，聚合路由不代表供应商保证可用或免费。仅核查通用调度和网关，登录与积分领取的具体服务授权仍需逐项确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/openai-gateway/config.ts:1-6](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/openai-gateway/config.ts#L1-L6)

默认监听为 loopback。

```text
export const DEFAULT_GATEWAY_HOST = '127.0.0.1'
export const DEFAULT_GATEWAY_PORT = 8326

/**
 * 「允许局域网访问」设置页开关（2026-10-20）打开时的监听地址：绑全部网卡。
 *
```

**依据 2 · 源码核查**：[src/openai-gateway/server.ts:277-280](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/openai-gateway/server.ts#L277-L280)

Bearer 头精确比较。

```text
function authorized(request: IncomingMessage, key: string): boolean {
  const value = request.headers.authorization
  return typeof value === 'string' && value === `Bearer ${key}`
}
```

**依据 3 · 源码核查**：[src/openai-gateway/server.ts:744-760](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/openai-gateway/server.ts#L744-L760)

预检与实际认证流程。

<details>
<summary>查看原文（17行）</summary>

```text
  const requestHandler = (request: IncomingMessage, response: ServerResponse): void => {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization, Content-Type',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
      })
      response.end()
      return
    }
    if (!authorized(request, key)) {
      jsonResponse(response, 401, { error: { message: 'Missing or invalid API key', type: 'authentication_error', code: 'invalid_api_key' } })
      return
    }
    const path = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
    if (path === '/v1/models' && request.method === 'GET') {
      void handleModels(response).catch(error => jsonResponse(response, 502, { error: { message: String(error), type: 'server_error', code: 'model_list_failed' } }))
```

</details>

**依据 4 · 源码核查**：[src/openai-gateway/auth.ts:47-83](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/openai-gateway/auth.ts#L47-L83)

环境优先、校验、临时文件生成和改名。

<details>
<summary>查看原文（37行）</summary>

```text
export function loadOrCreateApiKey(home: string, env: NodeJS.ProcessEnv = process.env): ApiKeySource {
  const configured = env.DSH_OPENAI_GATEWAY_API_KEY?.trim()
  if (configured) return { value: configured, fromEnv: true, path: null }

  const directory = join(home, 'openai-gateway')
  const path = join(directory, KEY_FILE)
  let stored: string | undefined
  try {
    stored = readFileSync(path, 'utf8').trim()
  } catch {
    // 文件不存在或不可读：走生成路径；写入失败会向调用方暴露。
  }

  if (stored) {
    if (KEY_PATTERN.test(stored)) return { value: stored, fromEnv: false, path }
    throw new Error(
      `网关密钥文件内容异常（不是本插件生成的形态）：${path}。`
      + '可能是被手工编辑或被其它程序改写；本插件不会静默更换它，否则已配置的客户端会全部失效。'
      + `如需更换：删除该文件后重启 DSH（会重新生成），或改用 DSH_OPENAI_GATEWAY_API_KEY 环境变量。`,
    )
  }

  const key = randomBytes(32).toString('base64url')
  mkdirSync(directory, { recursive: true })
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(temporary, key, { encoding: 'utf8', mode: 0o600 })
  try {
    renameSync(temporary, path)
  } catch (error) {
    // 并发启动时另一进程可能已经落盘，优先复用它，避免生成两个有效密钥。
    if (existsSync(path)) {
      const existing = readFileSync(path, 'utf8').trim()
      if (KEY_PATTERN.test(existing)) return { value: existing, fromEnv: false, path }
    }
    throw error
  }
  return { value: key, fromEnv: false, path }
```

</details>

**依据 5 · 源码核查**：[package.json:22-28](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/package.json#L22-L28)

需要构建客户端及资源。

```text
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "build:client": "node plugin-src/client/build.mjs",
    "build:assets": "node scripts/copy-assets.mjs",
    "qoder:wasm": "node scripts/extract-qoder-wasm.mjs",
    "build:all": "tsc -p tsconfig.json && node scripts/copy-assets.mjs && node plugin-src/client/build.mjs && node scripts/sync-bootstrap-lib.mjs",
    "prepare": "tsc -p tsconfig.json && node scripts/copy-assets.mjs && node plugin-src/client/build.mjs && node scripts/sync-bootstrap-lib.mjs",
```

#### 缺口

- 本轮没有真实登录、续期、服务条款或费用核验
  **影响**：不能把路由和续期源码作为服务访问许可与结果保证
  **进一步探讨**：只选已获授权的测试账号，核对本地访问控制、主动退出与单次请求账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定采用并检验切换结果？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合维护多个已授权渠道且愿意排障的人，可先用一个测试渠道、loopback 网关做一次只读调用；此处保留观察，待确定请求失败和账户状态一致再谈聚合。应分别记录首帧前切换、产出后停止、真实服务用量与实际渠道。可尝试以请求级路由记录保存候选、状态、成本未知和最终渠道，并把未消费输出与工具副作用明确标注，以免面板显示最终服务掩盖先前尝试。若记录不能解释用户账单或显著拖慢首响应，而诊断无改进，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/aggregate-adapter.ts:3024-3049](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/aggregate-adapter.ts#L3024-L3049)

当前只在正常结束记录实际渠道，可作为对照。

<details>
<summary>查看原文（26行）</summary>

```text
              // ⇒ 改为：这里只记 `pendingProvider`，等**这一轮的 `for await` 正常结束**
              //   （即候选真的把整轮跑完）才提交进 Map。见下方 `return` 之前的提交处。
              pendingProvider = target.provider
            }
            yield chunk
          }
          // ⚠️ 走到这里 = 该候选的流**正常结束**（没有抛错、没有失败帧）⇒ 提交「实际选中」。
          if (pendingProvider !== undefined) {
            // ⚠️ 是**实际发往**的 `target.provider`，不是候选序第一个（带图改道时可能不同）。
            // ⚠️ 同时更新「最近一次」指针：`Map` 的迭代顺序是**插入顺序**，
            //    覆盖已存在的键**不改变**其位置 ⇒ 不能靠它取「最近」。
            self.activeProviderByModel.set(modelKey, pendingProvider)
            self.lastActiveProvider = pendingProvider
          }
          return
        } catch (error) {
          lastError = error
          // ⚠️ 中止/取消**不换候选**，立刻向上抛。
          if (isAbortLike(error, options.signal)) throw error
          if (emitted) {
            // 已经吐过内容：不能切换（否则把两段回答拼在一起）。
            self.ctx.logger?.warn?.(
              `[aggregate] ${target.provider}（${target.realId}）在产出内容后失败，`
              + `不再切换候选（已产出的内容无法撤回）：${String(error)}`,
            )
            throw error
```

</details>

**依据 2 · 源码核查**：[src/refresh-scheduler.ts:209-216](https://github.com/iJetLi/dsh-providers-hub/blob/6ad2e241a08c1204999a730dcfb212c9602929c5/src/refresh-scheduler.ts#L209-L216)

失败日志保留调度，但任务级可观察性须另外评估。

```text
    } catch (error) {
      this.options.warn?.(
        `[jet-hub] 一轮续期失败（调度器保持武装，下轮重试）：`
        + `${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      this.running = false
    }
```

#### 缺口

- 缺少同请求的跨服务账单和完整调用追踪
  **影响**：不能推算切换节省或总成本
  **进一步探讨**：记录测试替身的全部候选与外部受理状态，再对照有无请求记录的排障时长

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
