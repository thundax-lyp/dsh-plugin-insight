# DSH Failover Search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin)

<!-- BEGIN META -->
[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 3,733](https://img.shields.io/static/v1?label=npm+30d&message=3%2C733&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-failover-search) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-failover-search)
<!-- END META -->

> **功能**：在宿主搜索与取回接缝按账号和平台故障转移

> **亮点**：[Q01](#research-q01) 将失败转移、用量探测和错误说明接入宿主。

> **主要限制**：[Q03](#research-q03) 顺序尝试带来延迟、配额与多方资料传输。

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
  - [Q01 · 具体增量与基线是什么？](#detail-section-11)
  - [Q02 · 搜索和取回怎样回退？](#detail-section-12)
  - [Q03 · 哪些代价会抵消恢复收益？](#detail-section-13)
  - [Q04 · 如何试用与退出？](#detail-section-14)
  - [Q05 · 怎样证明对任务有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：依赖网页资料的用户遇到单来源服务故障。

失败后手动改提供方。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 复合搜索 | 按平台和账号回退 | 只取首成功，非聚合 |
| 复合取回 | 本地失败后尝试平台 | URL可能发往多服务 |
| 会话开关 | 关闭第三方参与 | 搜索走官方，取回走本地 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH rc.2及web服务 | 必需 | 注册和选择复合提供方 | 其他组合需验 |
| 平台及官方凭据 | 按来源 | 调用服务 | 全缺时明确失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份两项web选择，设置少量账号 | 记录原提供方 |
| 测试 | 模拟首失败和全失败 | 核对尝试、结果及取消 |
| 退出 | 恢复原选择并清理账号 | 确认搜索取回可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 来源配置与探测资源未知 | 账号和故障情景准备耗时未知 | 实际费用规则未核 |
| 持续 | 多跳请求资源未知 | 配额、延迟和账号维护耗时未知 | 失败请求也可能计费 |
| 恢复 | 原配置恢复资源未知 | 恢复两项选择及凭据清理耗时未知 | 禁用后行为需验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 故障转移 | 循环继续后续账号或来源 | 实际合格任务恢复率未知 |
| 取消 | 循环检查并直抛abort | 上游已发请求停止未知 |
| 成本 | 可观察每次尝试 | 真实配额和用量成本未知 |

> **思考**：[Q03](#research-q03) 顺序尝试带来延迟、配额与多方资料传输。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将失败转移、用量探测和错误说明接入宿主。

每次配置快照、abort直抛与聚合错误可见。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 顺序尝试带来延迟、配额与多方资料传输。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 模拟服务起步，保存原搜索和取回配置作为退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的降低单一搜索来源失败导致任务中断的次数。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-failover-search-plugin/cordis.patch.yml、plugins/dsh-failover-search-plugin/src/host/failover-provider.ts、plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts、plugins/dsh-failover-search-plugin/src/host/account-pool.ts、plugins/dsh-failover-search-plugin/README.md 及固定范围 inventory；组件：plugins/dsh-failover-search-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的降低单一搜索来源失败导致任务中断的次数。未执行目标代码或实际宿主验证。
- 下一步：保存预期故障、尝试事件与最终证据质量。

**分析版本**

- **仓库**：[FNOSP/fnos-dsh](https://github.com/FNOSP/fnos-dsh)
- **版本号**：7.0.16（[固定提交 4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可在单来源故障时提高合格检索任务完成率。

保存预期故障、尝试事件与最终证据质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 36 | — | — | 581 |
| .ts | source | 32 | 4094 | 2366 | 1374 | — |
| .tsx | source | 4 | 1037 | 678 | 304 | — |
| .ts | test | 23 | 3271 | 2567 | 277 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：降低单一搜索来源失败导致任务中断的次数

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 具体增量与基线是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要网页资料的用户原先依赖宿主选中的一个搜索来源，失败后手工切换。组件注册复合搜索与取回提供方，patch同时选中它们。其增量是账号轮转、平台尝试和失败解释，返回第一个成功结果而非聚合证据。验收要区分请求恢复和结果质量。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-failover-search-plugin/cordis.patch.yml:4-18](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/cordis.patch.yml#L4-L18)

同时替换搜索和取回选择

<details>
<summary>查看原文（15行）</summary>

```text
# - searchProvider：TinyFish → Tavily → 官方（官方插件行保持原样作链尾兜底）；
# - fetchProvider：本地 HTTP 抓取为第一跳，失败时按 TinyFish Fetch → Tavily
#   Extract 兜底（FNOS-010-11）。
#
# 两个能力面都注册同一个 id，`fetchProvider` 因此不能再写 `http`——接缝在选择
# provider 时，配置了哪个 id 就固定用哪个，写 `http` 会让本地 provider 独占，
# 平台兜底永远不会被走到。
#
# `web` 行的 `config` 是**整行替换**而不是深度合并（发行版组合基线语义）：
# 两个 provider 键都必须显式写出，漏掉任何一个都会让该能力回落为不可用。
# 契约测试钉住这两个键，防止后续改动把它们漏掉。
- id: web
  config:
    searchProvider: dsh-failover-search
    fetchProvider: dsh-failover-search
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/failover-provider.ts:124-151](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/failover-provider.ts#L124-L151)

有序尝试并返回首个成功

<details>
<summary>查看原文（28行）</summary>

```text
  async search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult> {
    // 一次搜索开始时快照配置：一次搜索内配置一致，保存后下一次搜索即生效。
    const settings = this.options.readSettings()
    const failures: string[] = []
    this.credentialFailure = undefined

    // 会话级门控（FNOS-010-12-AC-03）：该会话关掉「智能搜索」时不接入本插件——
    // 直接走官方，三方来源一次都不尝试（配额零消耗）。门控在**每次调用**时求值，
    // 因此切换开关对下一次搜索立即生效（AC-04）。
    if (this.options.shouldBypass?.() === true) {
      const result = await this.tryOfficial(request, signal, failures)
      if (result !== undefined) return result
      throw this.finalError(failures)
    }

    for (const sourceId of this.normalizedOrder(settings)) {
      if (sourceId === OFFICIAL_SOURCE_ID) {
        const result = await this.tryOfficial(request, signal, failures)
        if (result !== undefined) return result
        continue
      }

      const platform = sourceId as PlatformId
      const result = await this.tryPlatform(platform, request, settings, signal, failures)
      if (result !== undefined) return result
    }

    throw this.finalError(failures)
```

</details>

#### 缺口

- 成功响应的相关性与独立性未测。
  **影响**：回退可能恢复HTTP结果但没解决资料任务。
  **进一步探讨**：使用同查询比较各来源及复合返回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索和取回怎样回退？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

搜索每次固定配置快照，会话关闭智能搜索直接走官方。平台内轮转账号，samePlatformRetry决定是否继续尝试其他账号，abort立即抛。取回先本地再平台，关闭智能搜索仅保留本地，全部失败聚合各跳原因。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/failover-provider.ts:124-151](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/failover-provider.ts#L124-L151)

会话开关和有序搜索

<details>
<summary>查看原文（28行）</summary>

```text
  async search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult> {
    // 一次搜索开始时快照配置：一次搜索内配置一致，保存后下一次搜索即生效。
    const settings = this.options.readSettings()
    const failures: string[] = []
    this.credentialFailure = undefined

    // 会话级门控（FNOS-010-12-AC-03）：该会话关掉「智能搜索」时不接入本插件——
    // 直接走官方，三方来源一次都不尝试（配额零消耗）。门控在**每次调用**时求值，
    // 因此切换开关对下一次搜索立即生效（AC-04）。
    if (this.options.shouldBypass?.() === true) {
      const result = await this.tryOfficial(request, signal, failures)
      if (result !== undefined) return result
      throw this.finalError(failures)
    }

    for (const sourceId of this.normalizedOrder(settings)) {
      if (sourceId === OFFICIAL_SOURCE_ID) {
        const result = await this.tryOfficial(request, signal, failures)
        if (result !== undefined) return result
        continue
      }

      const platform = sourceId as PlatformId
      const result = await this.tryPlatform(platform, request, settings, signal, failures)
      if (result !== undefined) return result
    }

    throw this.finalError(failures)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/failover-provider.ts:249-276](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/failover-provider.ts#L249-L276)

账号重试和取消

<details>
<summary>查看原文（28行）</summary>

```text
    for (const [offset, account] of ordered.entries()) {
      // 同平台重试关闭时，只尝试轮转选中的第一个账号。
      if (offset > 0 && !settings.samePlatformRetry) break
      if (signal?.aborted === true) throw new WebError('搜索已取消', WEB_ABORTED)

      const startedAt = Date.now()
      try {
        const result = await adapter.search(request, account.key, signal)
        this.options.onAttempt({
          platform,
          account: account.label,
          outcome: 'succeeded',
          durationMs: Date.now() - startedAt,
        })
        return result
      } catch (error) {
        if (isAborted(error)) throw error
        failures.push(`${platform}/${account.label}：${describeFailure(error)}`)
        this.options.onAttempt({
          platform,
          account: account.label,
          outcome: 'failed',
          durationMs: Date.now() - startedAt,
        })
      }
    }

    return undefined
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts:98-127](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts#L98-L127)

取回及错误聚合

<details>
<summary>查看原文（30行）</summary>

```text
  /** 按本地 → 各平台的顺序取回；中止直抛，其余失败转下一跳。 */
  async fetch(request: WebFetchRequest, signal?: AbortSignal): Promise<WebFetchResult> {
    const failures: { platform: string, error: unknown }[] = []

    for (const hop of this.hops()) {
      if (signal?.aborted) throw new WebError('web fetch aborted', 'WEB_ABORTED')
      if (hop.available === undefined || hop.available()) {
        const startedAt = Date.now()
        try {
          const result = await hop.call(request, signal)
          this.onHop?.({ platform: hop.platform, outcome: 'succeeded', url: request.url, durationMs: Date.now() - startedAt })
          return result
        } catch (error) {
          // 用户中止是终止信号，不是「这条路不通」：直抛，不再尝试任何跳。
          if (isAborted(error)) throw error
          this.onHop?.({ platform: hop.platform, outcome: 'failed', url: request.url, durationMs: Date.now() - startedAt })
          failures.push({ platform: hop.platform, error })
        }
      } else {
        this.onHop?.({ platform: hop.platform, outcome: 'skipped', url: request.url, durationMs: 0 })
        failures.push({ platform: hop.platform, error: new WebError(`fetch hop "${hop.platform}" is unavailable`, 'WEB_PROVIDER_UNAVAILABLE') })
      }
    }

    // 全跳失败：聚合各跳原因抛出。错误码取**本地跳**的码（与纯本地部署一致，AC-02）；
    // 本地跳缺位时用兜底码。消息带上各跳原因，诊断时不丢平台侧细节。
    const local = failures.find(f => f.platform === 'local')
    const code = (local !== undefined ? errorCode(local.error) : undefined) ?? 'WEB_PROVIDER_ERROR'
    const detail = failures.map(f => `${f.platform}: ${f.error instanceof Error ? f.error.message : String(f.error)}`).join('; ')
    throw new WebError(`all fetch hops failed (${detail})`, code)
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts:143-151](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts#L143-L151)

会话关闭后的取回链

```text
    // 会话级门控（FNOS-010-12-AC-03）：该会话关掉「智能搜索」时不接入本插件——
    // 只保留本地跳（等同未安装插件时的官方行为），平台跳整体不参与，因此平台
    // 零调用。判定在**每次调用**时求值，切换开关对下一次取回立即生效（AC-04）。
    const platformHops = this.shouldBypass?.() === true
      ? []
      : this.platforms.map(hop => ({ platform: hop.platform, ...wrap(hop.backend) }))
    return [
      { platform: 'local', ...wrap(this.local) },
      ...platformHops,
```

#### 缺口

- 并发共享账号的轮转与配额一致性未验。
  **影响**：可能重复使用过期配额快照而增加失败和耗时。
  **进一步探讨**：并发请求并记录真实尝试序列。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些代价会抵消恢复收益？

**研究主题**：缺陷与关键质疑

#### 完整回答

顺序重试会累加延迟，失败请求也可能消耗服务配额。轮转不证明同一平台多个key增加独立额度。用量探测只有fresh时才过滤已耗尽账号，过期时仍尝试。查询和目标URL可能依序送到多个服务，需按数据敏感度选择。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/failover-provider.ts:287-302](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/failover-provider.ts#L287-L302)

过期快照不筛除账号

<details>
<summary>查看原文（16行）</summary>

```text
    pool: readonly PoolAccount[],
    settings: FailoverSearchSettings,
  ): readonly PoolAccount[] {
    const usage = this.options.usage
    if (settings.requestProbe !== true || usage === undefined) return pool
    if (!usage.isFresh()) return pool

    const exhausted = new Set(
      usage.snapshot()
        .filter(entry => entry.platform === platform && entry.exhausted === true)
        .map(entry => entry.accountLabel),
    )

    return pool.filter(account => {
      if (exhausted.has(account.label)) return false
      return usage.locallyLimited?.(account.label) !== true
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/account-pool.ts:4-9](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/account-pool.ts#L4-L9)

作者说明账号与账户差别

```text
 * 每个平台一个池，账号 = 一个 key（含供展示的备注名）。均摊游标持久在内存，
 * 被探测排除或请求失败的账号在**同一次搜索**内不再重试，其余按轮转推进。
 *
 * 为什么是轮转：TinyFish 限流按 key 计（多 key 有真实扩容收益），Tavily 配额按
 * 账户计（多个 key 提供失效冗余与单 key 限流分散）。轮转实现简单、分布均匀、
 * 结果可解释，符合计划「均摊策略」决策；最少连接/加权等策略在均摊效果可验证前
```

**依据 3 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts:102-118](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts#L102-L118)

逐跳转交同一URL

<details>
<summary>查看原文（17行）</summary>

```text
    for (const hop of this.hops()) {
      if (signal?.aborted) throw new WebError('web fetch aborted', 'WEB_ABORTED')
      if (hop.available === undefined || hop.available()) {
        const startedAt = Date.now()
        try {
          const result = await hop.call(request, signal)
          this.onHop?.({ platform: hop.platform, outcome: 'succeeded', url: request.url, durationMs: Date.now() - startedAt })
          return result
        } catch (error) {
          // 用户中止是终止信号，不是「这条路不通」：直抛，不再尝试任何跳。
          if (isAborted(error)) throw error
          this.onHop?.({ platform: hop.platform, outcome: 'failed', url: request.url, durationMs: Date.now() - startedAt })
          failures.push({ platform: hop.platform, error })
        }
      } else {
        this.onHop?.({ platform: hop.platform, outcome: 'skipped', url: request.url, durationMs: 0 })
        failures.push({ platform: hop.platform, error: new WebError(`fetch hop "${hop.platform}" is unavailable`, 'WEB_PROVIDER_UNAVAILABLE') })
```

</details>

#### 缺口

- 供应商实际计费和配额未核。
  **影响**：无法据轮转承诺更高额度或更低总成本。
  **进一步探讨**：用模拟供应商先计数，后续核对目标服务规则。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

限定作者要求的rc.2，备份原web选择，配置少量账号并先模拟故障。首次成本为凭据及来源规则，持续成本为多服务、配额和用量维护。退出恢复searchProvider与fetchProvider原值再停用组件，检查搜索和本地取回仍可用，删除不需要的账号配置。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-failover-search-plugin/README.md:7-19](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/README.md#L7-L19)

作者安装条件及用量说明

<details>
<summary>查看原文（13行）</summary>

````text
## 安装

插件随 `fn-deepseek-harness` 自动安装。其他 DSH 环境手动安装，要求 DSH `0.2.0-rc.2`：

```sh
dsh plugin --profile web add @tnnevol/dsh-failover-search@7.0.16
```

## 这个包做什么

- 在 `ctx.web` 接缝上注册一个**复合搜索提供方**（id `dsh-failover-search`），组合包 patch 把 `searchProvider` 指到它。
- 平台顺序内遍历；同平台多账号按轮转分摊，账号失败或额度不足时先换同平台账号，再落到下一平台。
- 用量快照（Tavily 账户用量、TinyFish 钱包，均为免费查询）驱动请求前探测，并在插件详情页展示。
````

</details>

**依据 2 · 源码核查**：[plugins/dsh-failover-search-plugin/cordis.patch.yml:16-18](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/cordis.patch.yml#L16-L18)

需恢复两项选择

```text
  config:
    searchProvider: dsh-failover-search
    fetchProvider: dsh-failover-search
```

#### 缺口

- 停用后宿主选择器的回退未运行。
  **影响**：只停bundle可能留下无法解析的provider选择。
  **进一步探讨**：记录原配置并对照重启后的请求路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证明对任务有价值？

**研究主题**：新假设与验证

#### 完整回答

以相同查询构造正常、首来源失败、配额耗尽、全失败和中途取消，对比单来源与复合模式。记录正确资料任务完成率、延迟和各供应商请求次数。若新来源未提高合格答案率、延迟代价过大或取消后继续新增请求，则停止该回退设置。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/failover-provider.ts:249-276](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/failover-provider.ts#L249-L276)

尝试事件可对照

<details>
<summary>查看原文（28行）</summary>

```text
    for (const [offset, account] of ordered.entries()) {
      // 同平台重试关闭时，只尝试轮转选中的第一个账号。
      if (offset > 0 && !settings.samePlatformRetry) break
      if (signal?.aborted === true) throw new WebError('搜索已取消', WEB_ABORTED)

      const startedAt = Date.now()
      try {
        const result = await adapter.search(request, account.key, signal)
        this.options.onAttempt({
          platform,
          account: account.label,
          outcome: 'succeeded',
          durationMs: Date.now() - startedAt,
        })
        return result
      } catch (error) {
        if (isAborted(error)) throw error
        failures.push(`${platform}/${account.label}：${describeFailure(error)}`)
        this.options.onAttempt({
          platform,
          account: account.label,
          outcome: 'failed',
          durationMs: Date.now() - startedAt,
        })
      }
    }

    return undefined
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts:102-127](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-failover-search-plugin/src/host/fetch-failover-provider.ts#L102-L127)

取回失败与取消可测

<details>
<summary>查看原文（26行）</summary>

```text
    for (const hop of this.hops()) {
      if (signal?.aborted) throw new WebError('web fetch aborted', 'WEB_ABORTED')
      if (hop.available === undefined || hop.available()) {
        const startedAt = Date.now()
        try {
          const result = await hop.call(request, signal)
          this.onHop?.({ platform: hop.platform, outcome: 'succeeded', url: request.url, durationMs: Date.now() - startedAt })
          return result
        } catch (error) {
          // 用户中止是终止信号，不是「这条路不通」：直抛，不再尝试任何跳。
          if (isAborted(error)) throw error
          this.onHop?.({ platform: hop.platform, outcome: 'failed', url: request.url, durationMs: Date.now() - startedAt })
          failures.push({ platform: hop.platform, error })
        }
      } else {
        this.onHop?.({ platform: hop.platform, outcome: 'skipped', url: request.url, durationMs: 0 })
        failures.push({ platform: hop.platform, error: new WebError(`fetch hop "${hop.platform}" is unavailable`, 'WEB_PROVIDER_UNAVAILABLE') })
      }
    }

    // 全跳失败：聚合各跳原因抛出。错误码取**本地跳**的码（与纯本地部署一致，AC-02）；
    // 本地跳缺位时用兜底码。消息带上各跳原因，诊断时不丢平台侧细节。
    const local = failures.find(f => f.platform === 'local')
    const code = (local !== undefined ? errorCode(local.error) : undefined) ?? 'WEB_PROVIDER_ERROR'
    const detail = failures.map(f => `${f.platform}: ${f.error instanceof Error ? f.error.message : String(f.error)}`).join('; ')
    throw new WebError(`all fetch hops failed (${detail})`, code)
```

</details>

#### 缺口

- 本轮只读固定源码，没有网络对照。
  **影响**：尚不能量化稳定性收益或单位合格任务成本。
  **进一步探讨**：保存预期故障、尝试事件与最终证据质量。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
