# dsh-web-search-free

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1407bd3](https://github.com/MochiNek0/dsh-web-search-free/tree/1407bd34c83ad46e305eea0b70ba71551e57057f)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MochiNek0/dsh-web-search-free) [![npm 30d 6,350](https://img.shields.io/static/v1?label=npm+30d&message=6%2C350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-free) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-free)
<!-- END META -->

> **功能**：为 DSH 原生网页搜索与抓取提供多引擎轮换、并行策略、缓存及设置界面。

> **亮点**：贡献是将多凭据容错、结构来源和可选并行接入原生web接口，并显式处理空来源和弱抓取；没有证明净搜索质量/费用胜出，见 [Q01](#research-q01)与 [Q02](#research-q02)。

> **主要限制**：域名排除只过滤sources而非聚合answer，抓取缓存只按URL且新TTL不清旧项；多引擎扩大调用与外发，free不等于零成本，见 [Q02](#research-q02)、[Q03](#research-q03)和 [Q05](#research-q05)。

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
  - [Q01 · 真实插件类型、替代与贡献是什么？](#detail-section-11)
  - [Q02 · 搜索、轮换与并行如何工作？](#detail-section-12)
  - [Q03 · 抓取与缓存有哪些边界？](#detail-section-13)
  - [Q04 · 依赖、路由、生效与外发如何影响使用？](#detail-section-14)
  - [Q05 · “free”和全周期成本支持何种试用？](#detail-section-15)
  - [Q06 · 什么新假设可验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多个搜索凭据、公开查询遇单源限额/不可达的用户，可自动尝试替代来源；需以正确可回查来源和总费用验收，见 [Q01](#research-q01)。

单引擎原生搜索/手动换Key、人工打开网页是替代。此插件提供方不等于模型工具或自有抓取/搜索基础设施。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索提供方 | 原生工具调多引擎 | 非另注册工具，query真实外发 |
| 串行/并行策略 | Key轮换、竞速或合并 | 非空/最快不等于正确，额度可能增加 |
| 页面抓取 | 引擎/Jina/本地退路 | 短内容可最终返回，非浏览器验真 |
| 进程缓存 | 减少重复请求 | URL缓存未绑定配置，新TTL不清旧项 |
| Key测试/用量 | 排查凭据与尝试 | 真实搜索耗额，非账单/剩余额度 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH web provider与宿主工具 | 必需 | 接管原生搜索/抓取 | 安装不保证路由实际指向 |
| 可信提供方/有效Key与网络 | 对应搜索必需 | query/URL外发并取结果 | 冷却只是后移，可能再尝试 |
| 宿主本地fetch provider | 本地模式/退路需 | 不经第三方直接抓取 | 内部Map查不到就无退路 |
| live设置与可选connection.fetch | 设置/测试条件 | 热配置与Key检查 | 新配置不清旧缓存，测试真实耗额 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 起步 | 单Key/fallback，确认web路由 | 核公开已知查询回源 |
| 抓取 | 公开页面与原文对照 | 识别短内容/截断/缓存 |
| 容错 | 加第二源观察失败切换 | 记录调用与外发对象 |
| 并行 | 仅在预算内选择race/merge | 取消不代表未计费 |
| 退出 | 停用后核原生路由 | 回单源/人工，不留误指向 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 各提供方账户/Key资源未知 | 路由/配置与合法外发确认 | 无现价报价 |
| 持续 | 每次尝试/并行额度、缓存/模型上下文 | 来源与完整性复核 | 使用计数非厂商剩余额度 |
| 失败恢复 | 重试/Key测试真实耗额 | 查冷却/额度/路由/旧缓存 | 不保证省钱或更快 |
| 退出 | 配置和提供方账户资源 | 核覆写路由并回单源 | 卸载不撤回外部query |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 容错 | 空/失败继续下一Key/引擎 | 合格结果提高与总延迟 |
| 并行 | 取首成功或合并 | 速度/质量收益与真实费用 |
| 来源组织 | 结构source筛选/排序 | answer不含排除域的信息 |
| 缓存 | 同输入复用降低重复调用 | 新鲜度与换配置后的正确性 |

> **思考**：域名排除只过滤sources而非聚合answer，抓取缓存只按URL且新TTL不清旧项；多引擎扩大调用与外发，free不等于零成本，见 [Q02](#research-q02)、[Q03](#research-q03)和 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是将多凭据容错、结构来源和可选并行接入原生web接口，并显式处理空来源和弱抓取；没有证明净搜索质量/费用胜出，见 [Q01](#research-q01)与 [Q02](#research-q02)。

单尝试预算/取消、空来源容错与并行失败续链可参考；冷却不禁用、source/answer分离与URL缓存需明确语义，内部宿主Map耦合有兼容负担，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

域名排除只过滤sources而非聚合answer，抓取缓存只按URL且新TTL不清旧项；多引擎扩大调用与外发，free不等于零成本，见 [Q02](#research-q02)、[Q03](#research-q03)和 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

公开查询先单Key/fallback，核回源、页面完整与实际调用费用，再考虑第二源和并行。不可回源、预算超限或旧缓存误导时停用并核原生路由，回单引擎/人工，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生provider、代表API、容错/并行与缓存有源码支持；未验宿主接管/外部服务/现价和合格任务效果。来源清单设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/cache.ts、src/client.tsx、src/index.ts、src/providers/jina.ts、src/providers/tavily.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核原生provider/bundle、settings与路由覆盖、engine-key预算/冷却/并行、搜索source过滤、fetch/cache/本地退路、Jina/Tavily代表API和Key测试。已核客户端卡片注册，未逐审全部供应商/设置UI、上游web/connection安全；不把作者免费表当当前事实。
- 下一步：- 固定源码与作者说明检查。
- 未安装、运行目标、请求外部查询/Key测试或模型。
- 排除域与缓存限制为静态边界，未复现。
- 提供方当前价格/额度/可用与宿主安全未独立验收。

**分析版本**

- **仓库**：[MochiNek0/dsh-web-search-free](https://github.com/MochiNek0/dsh-web-search-free)
- **版本号**：1.9.1（[固定提交 1407bd3](https://github.com/MochiNek0/dsh-web-search-free/tree/1407bd34c83ad46e305eea0b70ba71551e57057f)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是给抓取缓存附实际来源/时间并绑定配置，强排除任务不使用无法归因的answer；比较错误引用改善与额外调用负担，见 [Q06](#research-q06)。

- 固定源码与作者说明检查。
- 未安装、运行目标、请求外部查询/Key测试或模型。
- 排除域与缓存限制为静态边界，未复现。
- 提供方当前价格/额度/可用与宿主安全未独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 392 | — | — | 4512 |
| .cjs | source | 2 | 138 | 86 | 35 | — |
| .ts | source | 19 | 2465 | 1567 | 763 | — |
| .tsx | source | 1 | 2827 | 2480 | 300 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MochiNek0/dsh-web-search-free/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多引擎提供方如何接入原生web能力，容错和缓存是否以可接受的费用/信息边界换取可用性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实插件类型、替代与贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH搜索/抓取提供方插件。它注入web服务，注册两个provider，bundle将原生web条目的searchProvider/fetchProvider指向自己；模型web_search/web_fetch工具仍由宿主composition挂载，不是本插件另发明工具。用户有多个搜索API凭据、原单通道易遇限额/不可达时，可以按顺序、并行竞速或合并调用。

相比单一提供方或手工切Key，增量是统一结构来源、自动尝试链、短抓取回退和本地缓存；搜索与页面读取仍来自外部引擎或宿主本地fetch。合格结果是来源可追、结果适用且总调用可承受，非“返回非空就有正确答案”。已有稳定单引擎或查询不可外发者不必扩大提供方范围。“free”指作者所述额度组织，不等于本插件替用户承担API费用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:13-14](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L13-L14)

真实provider插件导出。

```text
export const name = 'web-search-free'
export const inject = ['web']
```

**依据 2 · 源码核查**：[cordis.patch.yml:14-24](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/cordis.patch.yml#L14-L24)

bundle插入与web路由。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: web-search-free
      name: 'dsh-web-search-free'

# Repoint the web capability seam at this plugin's provider. dsh-base pins
# `searchProvider: deepseek-official`; a non-insert patch with a matching id
# overrides that entry's config wholesale, so both capabilities resolve here.
- id: web
  config:
    searchProvider: web-search-free
    fetchProvider: web-search-free
```

</details>

**依据 3 · 源码核查**：[src/index.ts:510-522](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L510-L522)

工具注册属于宿主composition。

<details>
<summary>查看原文（13行）</summary>

```text
 *
 * Up to dsh 0.1.2 this plugin mounted tool-web itself to own `web_fetch`'s
 * registration. Since 0.1.5 the composition mounts it everywhere — dsh-base's
 * `tool-web` row ships `fetch: true` (TUI/headless) and every shipped agent
 * preset mounts its own scoped row with `fetch: true` (the Web surface
 * disables the host row and composes per session) — so a global self-mount
 * would duplicate-register `web_fetch` against each of them, and a per-agent
 * scope SHADOWS a global registration, which means an unmount here could no
 * longer remove what a preset's row registered. The tool belongs to the
 * composition; this plugin only backs it through the seam, and `enableFetch`
 * gates the fetch PROVIDER's availability instead of the tool's registration.
 */
export function apply(ctx: Context, config: RawConfig) {
```

</details>

**依据 4 · 作者声明**：[README.md:3-20](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/README.md#L3-L20)

作者多引擎与费用定位。

<details>
<summary>查看原文（18行）</summary>

```text
中文 | [English](https://github.com/MochiNek0/dsh-web-search-free/blob/main/README.en.md)

[DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness) 的免费 Web Search / 网页抓取插件。它把 dsh 默认的 `deepseek-official` 通道换成**多引擎 + 自动 fallback**：按你排的顺序依次尝试已填 Key 的引擎，失败或额度用尽就换下一个；同一引擎可填多个 Key（每行一个），按序轮换。

- **不烧模型 token**：直接调各引擎的检索端点，不经过任何 LLM。
- **装上即接管，卸载即回落**：以 dsh bundle 层安装，无需手改 profile。
- **自带配置卡片**：拖动排序、填 Key、测试 Key、查看用量，界面语言跟随 dsh。
- **请求只从宿主进程发出**：浏览器侧只有配置卡片，不直接访问任何外部服务。

## 为什么是 "free"

官方通道 `deepseek-official` 的每次搜索都是一次**完整的模型调用**（带服务端 `web_search` 工具），搜索请求本身和回灌进上下文的 sources 都从 `DEEPSEEK_API_KEY` 余额扣 token。

|            | 官方 `deepseek-official`                    | 本插件 `web-search-free`            |
| ---------- | ------------------------------------------- | ----------------------------------- |
| 检索方式   | LLM 调用 + 服务端搜索工具                   | 直接调引擎检索端点                  |
| 模型 token | 每次搜索都消耗                              | **0**                               |
| 计费       | DeepSeek API 余额                           | 各搜索 API 自身额度（多数有免费层） |
```

</details>

#### 缺口

- 没有同任务单引擎/手动切Key对照。
  **影响**：无法确认多引擎提升合格答案而非仅返回率。
  **进一步探讨**：固定查询与验收标准比较来源正确率、失败/调用和总人工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索、轮换与并行如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

搜索入口先读live配置，生成engine-key尝试序列；冷却只把某Key移到后面，并非禁用，全部冷却仍会尝试。每次搜索10秒预算、抓取20秒预算与调用方signal合成，父取消中断后续链。fallback逐个尝试，空来源或排除后全空抛错才换下一个；Tavily代表链POST真实query/key并归一answer和sources。

race/merge先并行前N个不同引擎的首Key，竞速取首个成功后取消其余，合并等各结果再去重；全部失败再走其余Key。取消网络不证明提供方没计费，最快也不代表最佳；merge与重试会扩大调用。排除域只过滤结构sources，提供方返回的content/answer仍原样保留；因此只要还有一个未排除source，混合answer可能保留来自已排除域的信息。这是限定条件的源码边界，未运行复现，不应把excludeDomains当完整信息安全过滤。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:589-606](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L589-L606)

冷却重排而不移除。

<details>
<summary>查看原文（18行）</summary>

```text
  /**
   * Every configured (engine, key) pair for `kind`, in call order, with keys
   * benched by {@link cooldownFor} moved to the back rather than out — so a
   * fully benched chain still gets tried.
   */
  function orderedAttempts(kind: 'search' | 'fetch'): Attempt[] {
    const now = Date.now()
    const ready: Attempt[] = []
    const benched: Attempt[] = []
    for (const { provider, keys } of getActiveProviders(kind)) {
      for (const key of keys) {
        const until = benchedUntil.get(`${provider.name}:${key}`) ?? 0
        ;(until > now ? benched : ready).push({ provider, key })
      }
    }
    return [...ready, ...benched]
  }

```

</details>

**依据 2 · 源码核查**：[src/index.ts:624-654](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L624-L654)

单尝试预算、计数与冷却。

<details>
<summary>查看原文（31行）</summary>

```text
  async function tryAttempt<T>(
    kind: 'search' | 'fetch',
    { provider, key }: Attempt,
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<T>,
    trail?: string[],
  ): Promise<T> {
    if (signal?.aborted) throw signal.reason ?? new Error(`web ${kind} aborted`)
    const scoped = attemptSignal(signal, ATTEMPT_TIMEOUT_MS[kind], `${provider.name} ${kind}`)
    const who = `Provider ${provider.name} (${key ? `key ${maskKey(key)}` : 'keyless'})`
    const started = Date.now()
    try {
      const result = await attempt(provider, key, scoped.signal)
      benchedUntil.delete(`${provider.name}:${key}`)
      usage.record(provider.name, key, kind, Date.now() - started)
      return result
    } catch (err: any) {
      if (signal?.aborted) throw err
      usage.record(provider.name, key, kind, Date.now() - started, String(err?.message))
      const cooldown = cooldownFor(err, kind)
      if (cooldown !== undefined) benchedUntil.set(`${provider.name}:${key}`, Date.now() + cooldown)
      const benchNote = cooldown !== undefined ? ` Benched for ${Math.round(cooldown / 60_000)} min.` : ''
      const reason = String(err?.message).replace(/\.$/, '')
      logger.warn?.(`${who} ${kind} failed: ${reason}.${benchNote}`)
      trail?.push(`${provider.name} (${key ? maskKey(key) : 'keyless'}): ${reason}`)
      throw err
    } finally {
      scoped.dispose()
    }
  }

```

</details>

**依据 3 · 源码核查**：[src/index.ts:665-687](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L665-L687)

串行失败与weak回退。

<details>
<summary>查看原文（23行）</summary>

```text
  async function runChain<T>(
    kind: 'search' | 'fetch',
    attempts: readonly Attempt[],
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<T>,
    weak?: (result: T) => boolean,
    trail: string[] = [],
  ): Promise<T> {
    let fallback: T | undefined
    for (const a of attempts) {
      try {
        const result = await tryAttempt(kind, a, signal, attempt, trail)
        if (!weak?.(result)) return result
        fallback ??= result
        logger.warn?.(`Provider ${a.provider.name} ${kind} returned a suspiciously short result. Trying next key/provider...`)
      } catch (err: any) {
        if (signal?.aborted) throw err
      }
    }
    if (fallback !== undefined) return fallback
    throw chainFailure(kind, trail)
  }

```

</details>

**依据 4 · 源码核查**：[src/index.ts:695-735](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L695-L735)

并行首Key、竞速取消与继续。

<details>
<summary>查看原文（41行）</summary>

```text
  async function runParallel(
    mode: 'race' | 'merge',
    width: number,
    attempts: readonly Attempt[],
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<SearchResult>,
  ): Promise<SearchResult> {
    const leads: Attempt[] = []
    const rest: Attempt[] = []
    for (const a of attempts) {
      if (leads.length < width && !leads.some((l) => l.provider === a.provider)) leads.push(a)
      else rest.push(a)
    }
    // A child of the caller's signal: aborting it cancels a race's losers
    // without touching the caller, and a caller abort still reaches them all.
    const group = attemptSignal(signal, ATTEMPT_TIMEOUT_MS.search, 'parallel search')
    const trail: string[] = []
    const runs = leads.map((a) => tryAttempt('search', a, group.signal, attempt, trail))
    try {
      if (mode === 'race') {
        try {
          return await Promise.any(runs)
        } catch {
          // Every lead failed; `tryAttempt` logged each one.
        }
      } else {
        const settled = await Promise.allSettled(runs)
        const ok = settled.flatMap((s) => (s.status === 'fulfilled' ? [s.value] : []))
        if (ok.length > 0) return mergeResults(ok)
      }
    } finally {
      // Cancel a race's losers now rather than when their timers fire.
      group.abort()
      group.dispose()
      for (const run of runs) run.catch(() => {})
    }
    if (signal?.aborted) throw signal.reason ?? new Error('web search aborted')
    return runChain('search', rest, signal, attempt, undefined, trail)
  }

  /** Per-(engine, key) call counts since this plugin instance started, for the card. */
```

</details>

**依据 5 · 源码核查**：[src/index.ts:799-818](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L799-L818)

仅sources过滤，answer.content仍用result.content。

<details>
<summary>查看原文（20行）</summary>

```text
      const attempt = async (provider: MyProvider, key: string, scoped: AbortSignal): Promise<SearchResult> => {
        const result = await provider.search(request.query, key, scoped, options)
        const sources = (result.sources ?? []).filter((s) => !matchesDomain(s.url, blocked))
        if (sources.length === 0) {
          throw new ProviderError(`${provider.name} search returned no results outside the blocked domains.`)
        }
        return { ...result, sources }
      }

      const result = strategy === 'race' || strategy === 'merge'
        ? await runParallel(strategy, width, attempts, signal, attempt)
        : await runChain('search', attempts, signal, attempt)

      const answer = {
        content: result.content || '',
        sources: finalizeSources(result.sources ?? [], preferred, snippetLength),
      }
      searchCache.set(cacheKey, answer, cacheTtl(current))
      return { ...answer, sources: [...answer.sources], truncated: false }
    }
```

</details>

**依据 6 · 源码核查**：[src/providers/tavily.ts:22-55](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/providers/tavily.ts#L22-L55)

代表真实搜索请求和answer。

<details>
<summary>查看原文（34行）</summary>

```text
  async search(query: string, apiKey: string, signal?: AbortSignal, options?: SearchOptions): Promise<SearchResult> {
    // Tavily's `max_results` accepts 0-20; omitted keeps its default.
    const maxResults = clampCount(options?.maxResults, 20);
    const country = options?.region ? TAVILY_COUNTRY[options.region] : undefined;
    const exclude = options?.excludeDomains?.slice(0, 150) ?? [];
    const post = (withCountry: boolean) =>
      fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: options?.searchDepth === 'advanced' ? 'advanced' : 'basic',
          include_answer: true,
          ...(maxResults !== undefined ? { max_results: maxResults } : {}),
          ...(options?.freshness ? { time_range: options.freshness } : {}),
          ...(exclude.length > 0 ? { exclude_domains: exclude } : {}),
          ...(withCountry && country ? { country } : {}),
        }),
        signal,
      });
    let res = await post(true);
    // The country enum is documented only in part; a name it does not know
    // must cost the region, not the whole search.
    if (country && isParamRejection(res)) res = await post(false);
    assertOk(res, 'Tavily search');
    const data = await res.json();
    const entries: any[] = Array.isArray(data?.results) ? data.results : [];
    if (entries.length === 0) throw new ProviderError('Tavily search returned no results.');

    return {
      content: data.answer || '',
      sources: entries.map((r: any) => ({
        url: r.url,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 抓取与缓存有哪些边界？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

fetch默认先有Key引擎、可选无Key Jina Reader，失败再找宿主本地fetch。短于阈值的内容先保留而继续试，若后面都失败就返回第一份短内容；有短内容不抛错时不会继续走外层本地fallback，不能保证最终拿到全文。Jina把目标URL发送给r.jina.ai，读取文本；这是第三方抓取，不是本地浏览器渲染或必然无外发。truncated主要依提供方与宿主输出上限，不表示文章已完整读懂。

搜索缓存键纳入query、引擎名/顺序及搜索参数，但抓取缓存只按request.url，未绑定当前引擎/Key/内容版本；更换凭据/抓取引擎后同URL仍可能在旧TTL内返回旧内容。TTL调整只决定新写入，旧条目get仍按原expires，不能把cacheMinutes=0当立即清空。缓存只在进程内，重载清空是退路；不含抓取时间和具体来源的正文会让使用者难以辨别缓存与新抓。未证明跨用户部署存在，不从模块内缓存直接宣称泄露。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:854-891](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L854-L891)

抓取链、URL缓存与本地fallback。

<details>
<summary>查看原文（38行）</summary>

```text
    async fetch(request: any, signal: any) {
      const current = resolved()
      const local = dshFetchProvider()
      // Passed through untouched, so dsh's own WebError codes
      // (WEB_FETCH_TIMEOUT, WEB_REDIRECT_BLOCKED, …) reach the tool as-is.
      if (current.fetchSource === 'dsh') {
        if (!local) throw new Error(`dsh's local fetch provider "${DSH_FETCH_PROVIDER_ID}" is not registered in this composition.`)
        return local.fetch(request, signal)
      }
      const attempts = [...orderedAttempts('fetch'), ...keylessFetchAttempt(current)]
      if (attempts.length === 0) {
        if (local) return local.fetch(request, signal)
        throw new Error('No web fetch providers configured. Please set at least one API key in config.')
      }
      const weak = (r: { content: string }) => r.content.trim().length < MIN_FETCH_CHARS
      const hit = fetchCache.get(request.url)
      if (hit) usage.cacheHit('fetch')
      let result: { content: string; truncated: boolean }
      try {
        result = hit ?? await runChain(
          'fetch',
          attempts,
          signal,
          (provider, key, scoped) => provider.fetch(request.url, key, scoped),
          weak,
        )
      } catch (err: any) {
        if (!local || signal?.aborted) throw err
        logger.warn?.(`Every fetch engine failed; falling back to dsh's local fetch. ${String(err?.message)}`)
        try {
          return await local.fetch(request, signal)
        } catch (localErr: any) {
          throw new Error(`${String(err?.message).replace(/\.$/, '')}; dsh local fetch: ${String(localErr?.message)}`)
        }
      }
      // A weak result is the chain's last resort, not a good copy: leave it
      // out so the next fetch of this URL tries again.
      if (!weak(result)) fetchCache.set(request.url, result, cacheTtl(current))
```

</details>

**依据 2 · 源码核查**：[src/index.ts:665-687](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L665-L687)

短内容全失败后仍可返回。

<details>
<summary>查看原文（23行）</summary>

```text
  async function runChain<T>(
    kind: 'search' | 'fetch',
    attempts: readonly Attempt[],
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<T>,
    weak?: (result: T) => boolean,
    trail: string[] = [],
  ): Promise<T> {
    let fallback: T | undefined
    for (const a of attempts) {
      try {
        const result = await tryAttempt(kind, a, signal, attempt, trail)
        if (!weak?.(result)) return result
        fallback ??= result
        logger.warn?.(`Provider ${a.provider.name} ${kind} returned a suspiciously short result. Trying next key/provider...`)
      } catch (err: any) {
        if (signal?.aborted) throw err
      }
    }
    if (fallback !== undefined) return fallback
    throw chainFailure(kind, trail)
  }

```

</details>

**依据 3 · 源码核查**：[src/index.ts:788-795](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L788-L795)

搜索键范围。

```text
      const cacheKey = JSON.stringify([
        request.query, getActiveProviders('search').map((a) => a.provider.name),
        strategy, width, options, preferred, snippetLength,
      ])
      const cached = searchCache.get(cacheKey)
      if (cached) usage.cacheHit('search')
      if (cached) return { content: cached.content, sources: [...(cached.sources ?? [])], truncated: false }

```

**依据 4 · 源码核查**：[src/cache.ts:17-35](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/cache.ts#L17-L35)

get原期限、set非正TTL不写而非清空。

<details>
<summary>查看原文（19行）</summary>

```text
  get(key: string, now = Date.now()): V | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    this.entries.delete(key)
    if (entry.expires <= now) return undefined
    this.entries.set(key, entry)
    return entry.value
  }

  /** Store `value` for `ttlMs`; a non-positive TTL stores nothing. */
  set(key: string, value: V, ttlMs: number, now = Date.now()): void {
    if (!(ttlMs > 0)) return
    this.entries.delete(key)
    this.entries.set(key, { value, expires: now + ttlMs })
    while (this.entries.size > this.capacity) {
      this.entries.delete(this.entries.keys().next().value as string)
    }
  }
}
```

</details>

**依据 5 · 源码核查**：[src/providers/jina.ts:70-88](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/providers/jina.ts#L70-L88)

实际向Reader外发URL并读取。

<details>
<summary>查看原文（19行）</summary>

```text
  async fetch(url: string, apiKey: string, signal?: AbortSignal): Promise<FetchResult> {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        'Accept': 'text/plain',
      },
      signal,
    });
    assertOk(res, 'Jina fetch');
    const text = await res.text();
    if (text.trim() === '') throw new ProviderError('Jina fetch returned no content.');
    // Jina Reader returns the full decoded page unless an `x-max-tokens` budget
    // is requested, which we never set, so there is no provider-side cap to
    // report. The official seam still flags truncation if its own
    // `fetchMaxOutputChars` cap bites.
    return { content: text, truncated: false };
  },
};
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、路由、生效与外发如何影响使用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

启动需兼容web provider接口，搜索需可用引擎与Key（自建SearXNG等按其配置），本地抓取只在宿主已注册对应provider时存在。bundle路由能被更后profile patch或环境覆盖，装上插件不证明真的接管；routeOverrides读取运行时非公开config，未知形态返回无警告，也不能把无警告当已接管。dshFetchProvider还直接读内部fetchProviders Map，宿主实现改变可能失去本地退路。

新旧设置接口分别处理live entry与namespace，保存应影响下次请求，但与旧缓存返回要分开。测试Key是真实并行搜索，最多10个，不是离线校验，会占额度；统计/测试接口走宿主connection.fetch，源码注释称已有Host/Origin与cookie围栏，本轮未独立查宿主认证，不能当已验证网络隔离。搜索词与抓取URL会发给选中引擎，fallback/race扩大接触方；不要把“少用DSH余额”当内容不出机。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:305-325](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L305-L325)

路由覆盖探测依内部config且未知不报。

<details>
<summary>查看原文（21行）</summary>

```text
function routeOverrides(web: any): RouteOverride[] {
  const config = web?.config
  if (config === null || typeof config !== 'object') return []
  const out: RouteOverride[] = []
  const pins = [
    ['search', config.searchProvider, process.env.DSH_WEB_SEARCH_PROVIDER],
    ['fetch', config.fetchProvider, process.env.DSH_WEB_FETCH_PROVIDER],
  ] as const
  for (const [capability, field, env] of pins) {
    let provider: unknown
    try {
      provider = readLive<unknown>(field) ?? env
    } catch {
      continue
    }
    if (typeof provider === 'string' && provider !== '' && provider !== PROVIDER_ID) {
      out.push({ capability, provider })
    }
  }
  return out
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:529-552](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L529-L552)

新旧设置实时来源。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.inject(['settings'], (sctx) => {
    // dsh >= 0.1.7 has no namespace registry: `SettingsForms` keys forms by
    // profile entry id and projects them from the entry's own volatile Config,
    // so there is nothing to register and `resolved` already reads live. It is
    // also the only generation whose one-shot import can strand a section.
    if (typeof sctx.settings?.register !== 'function') {
      hintLegacySettings(sctx.settings, logger)
      return
    }

    // dsh <= 0.1.6: register the namespace so the user layer (written by the
    // settings card) exists at all — a namespace the Host does not serve is
    // never dispatched to a card. Each `scope.get()` projects the section
    // fresh, so a key saved in the UI reaches the next search without a
    // restart.
    const scope = sctx.settings.register(SETTINGS_NAMESPACE, SettingsConfig, {
      base: liveConfig(config),
    })
    resolved = () => scope.get()
    sctx.effect(() => () => {
      resolved = () => liveConfig(config)
    })
  })

```

</details>

**依据 3 · 源码核查**：[src/index.ts:829-838](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L829-L838)

本地fetch内部Map查找。

<details>
<summary>查看原文（10行）</summary>

```text
  function dshFetchProvider(): { available(): boolean; fetch(request: any, signal?: AbortSignal): Promise<any> } | undefined {
    const registry = (ctx.web as any)?.fetchProviders
    const provider = registry instanceof Map ? registry.get(DSH_FETCH_PROVIDER_ID) : undefined
    if (!provider || typeof provider.fetch !== 'function') return undefined
    try {
      return provider.available?.() === false ? undefined : provider
    } catch {
      return undefined
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:946-969](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L946-L969)

Key测试真实调用/最多10。

<details>
<summary>查看原文（24行）</summary>

```text
  async function testKeys(engine: string, requested: unknown) {
    const provider = availableProviders[engine]
    if (!provider) return jsonResponse(400, { error: `unknown engine ${JSON.stringify(engine)}` })
    const fromRequest = Array.isArray(requested)
      ? requested.filter((k): k is string => typeof k === 'string').map((k) => k.trim()).filter(Boolean)
      : []
    const stored = getActiveProviders('search').find((a) => a.provider === provider)?.keys ?? []
    const keys = (fromRequest.length > 0 ? fromRequest : stored).slice(0, MAX_TEST_KEYS)
    if (keys.length === 0) return jsonResponse(400, { error: 'no keys to test' })

    const results = await Promise.all(keys.map(async (key) => {
      const started = Date.now()
      try {
        const result = await tryAttempt('search', { provider, key }, undefined, (p, k, sig) =>
          p.search(TEST_QUERY, k, sig, { maxResults: 3 }),
        )
        return { key: maskKey(key), ok: true, ms: Date.now() - started, results: result.sources?.length ?? 0 }
      } catch (err: any) {
        return { key: maskKey(key), ok: false, ms: Date.now() - started, error: String(err?.message ?? err) }
      }
    }))
    return jsonResponse(200, { engine, results })
  }

```

</details>

**依据 5 · 源码核查**：[src/index.ts:976-997](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L976-L997)

可选connection路由接线。

<details>
<summary>查看原文（22行）</summary>

```text
    const register = cctx.connection?.fetch?.register
    if (typeof register !== 'function') return
    cctx.effect(() => cctx.connection.fetch.register({
      path: STATS_ROUTE,
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: async () => jsonResponse(200, statsSnapshot()),
    }), 'web-search-free: stats route')
    cctx.effect(() => cctx.connection.fetch.register({
      path: TEST_ROUTE,
      methods: ['POST'],
      requestBody: 'buffered',
      fetch: async (request: Request) => {
        let body: any
        try {
          body = await request.json()
        } catch {
          return jsonResponse(400, { error: 'expected a JSON body' })
        }
        return testKeys(String(body?.engine ?? ''), body?.keys)
      },
    }), 'web-search-free: key test route')
```

</details>

**依据 6 · 源码核查**：[src/client.tsx:807-869](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/client.tsx#L807-L869)

按可用设置服务绑定并注册卡片。

<details>
<summary>查看原文（63行）</summary>

```text
export const inject = ["slots"];

export function apply(ctx: any) {
  // A release providing both faces at once would otherwise mount two cards into
  // one slot cell, the second silently replacing the first. First one wins.
  let claimed = false;

  for (const provider of SCOPE_PROVIDERS) {
    ctx.inject(provider.services, (sctx: any) => {
      if (claimed) return;
      claimed = true;
      mountCard(sctx, provider.bind(sctx));
    });
  }

  // A dsh generation providing neither face leaves the plugin silently
  // unconfigurable, which reads as "the plugin is broken". Say so once.
  const timer = setTimeout(() => {
    if (claimed) return;
    console.warn(
      `[${NAMESPACE}] no settings service found: this dsh provides none of ${SCOPE_PROVIDERS.map((p) => p.services[0]).join(", ")}.` +
        ` Keys can still be set in the profile's cordis.patch.yml; please report this at https://github.com/MochiNek0/dsh-web-search-free/issues`,
    );
  }, 5000);
  ctx.effect(() => () => clearTimeout(timer));
}

/**
 * Put the card in the best slot this dsh declares, and keep it there.
 * @param ctx - the settings-service fiber the card's registrations belong to.
 * @param scope - the bound settings face, whichever generation supplied it.
 */
function mountCard(ctx: any, scope: any) {
  // Which candidates the host currently declares, and which one is mounted.
  // A host that declares two of them at once (an overlap release) must still
  // show exactly one card, so the arbiter always keeps the best one alone.
  const declared = new Set<string>();
  let mounted: { name: string; dispose: () => void } | null = null;

  const reconcile = () => {
    const best = SLOT_CANDIDATES.find((slot) => declared.has(slot.name));
    if (mounted?.name === best?.name) return;
    mounted?.dispose();
    mounted = null;
    if (!best) return;
    mounted = {
      name: best.name,
      dispose: ctx.slots.register(
        {
          ...best.options,
          name: best.name,
          // `reflect.get` is the read that does not require an `inject` entry: it
          // returns undefined rather than throwing when no locale plugin is loaded.
          inject: () => ({ scope, locale: ctx.reflect.get("locale") }),
        },
        WebSearchFreeCard,
      ),
    };
  };

  for (const slot of SLOT_CANDIDATES) {
    ctx.slots.inject(slot.name, () => {
      declared.add(slot.name);
```

</details>

**依据 7 · 源码核查**：[src/providers/jina.ts:70-85](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/providers/jina.ts#L70-L85)

URL到第三方。

<details>
<summary>查看原文（16行）</summary>

```text
  async fetch(url: string, apiKey: string, signal?: AbortSignal): Promise<FetchResult> {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
        'Accept': 'text/plain',
      },
      signal,
    });
    assertOk(res, 'Jina fetch');
    const text = await res.text();
    if (text.trim() === '') throw new ProviderError('Jina fetch returned no content.');
    // Jina Reader returns the full decoded page unless an `x-max-tokens` budget
    // is requested, which we never set, so there is no provider-side cap to
    // report. The official seam still flags truncation if its own
    // `fetchMaxOutputChars` cap bites.
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · “free”和全周期成本支持何种试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有公开检索任务、已有可信提供方与自愿预算的用户，可先只配一个Key、fallback策略，核已知查询来源/日期与公开页面；再加入第二引擎模拟限额/失败，记录实际尝试数，不同时上race/merge。页面抓取要辨别短内容与截断，换配置后确认旧缓存不会掩盖结果。敏感查询/带秘密URL不发送；任务若必须仅本地抓取，可选dsh但要先确认该provider存在。

首次成本是各提供方账号/Key、宿主路由和配置，持续成本是每次尝试消耗的API额度/现金、并行重复请求、缓存内存与模型阅读上下文；没有本轮现价/可用额度核查，不把README配额表当报价或算0。usage只记本实例调用和耗时，不是厂商剩余额度或用户完整账单。失败恢复需区分冷却重排、无结果、弱内容、账号额度及路由未接管；停用/卸载应回原生路由并核后续profile覆写，不假定移除后必然复原。结果无法回源、成本越预算或旧缓存误导时停用，回单引擎/人工检索。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:624-654](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L624-L654)

调用计数与冷却。

<details>
<summary>查看原文（31行）</summary>

```text
  async function tryAttempt<T>(
    kind: 'search' | 'fetch',
    { provider, key }: Attempt,
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<T>,
    trail?: string[],
  ): Promise<T> {
    if (signal?.aborted) throw signal.reason ?? new Error(`web ${kind} aborted`)
    const scoped = attemptSignal(signal, ATTEMPT_TIMEOUT_MS[kind], `${provider.name} ${kind}`)
    const who = `Provider ${provider.name} (${key ? `key ${maskKey(key)}` : 'keyless'})`
    const started = Date.now()
    try {
      const result = await attempt(provider, key, scoped.signal)
      benchedUntil.delete(`${provider.name}:${key}`)
      usage.record(provider.name, key, kind, Date.now() - started)
      return result
    } catch (err: any) {
      if (signal?.aborted) throw err
      usage.record(provider.name, key, kind, Date.now() - started, String(err?.message))
      const cooldown = cooldownFor(err, kind)
      if (cooldown !== undefined) benchedUntil.set(`${provider.name}:${key}`, Date.now() + cooldown)
      const benchNote = cooldown !== undefined ? ` Benched for ${Math.round(cooldown / 60_000)} min.` : ''
      const reason = String(err?.message).replace(/\.$/, '')
      logger.warn?.(`${who} ${kind} failed: ${reason}.${benchNote}`)
      trail?.push(`${provider.name} (${key ? maskKey(key) : 'keyless'}): ${reason}`)
      throw err
    } finally {
      scoped.dispose()
    }
  }

```

</details>

**依据 2 · 源码核查**：[src/index.ts:695-735](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L695-L735)

并行尝试资源。

<details>
<summary>查看原文（41行）</summary>

```text
  async function runParallel(
    mode: 'race' | 'merge',
    width: number,
    attempts: readonly Attempt[],
    signal: AbortSignal | undefined,
    attempt: (provider: MyProvider, key: string, signal: AbortSignal) => Promise<SearchResult>,
  ): Promise<SearchResult> {
    const leads: Attempt[] = []
    const rest: Attempt[] = []
    for (const a of attempts) {
      if (leads.length < width && !leads.some((l) => l.provider === a.provider)) leads.push(a)
      else rest.push(a)
    }
    // A child of the caller's signal: aborting it cancels a race's losers
    // without touching the caller, and a caller abort still reaches them all.
    const group = attemptSignal(signal, ATTEMPT_TIMEOUT_MS.search, 'parallel search')
    const trail: string[] = []
    const runs = leads.map((a) => tryAttempt('search', a, group.signal, attempt, trail))
    try {
      if (mode === 'race') {
        try {
          return await Promise.any(runs)
        } catch {
          // Every lead failed; `tryAttempt` logged each one.
        }
      } else {
        const settled = await Promise.allSettled(runs)
        const ok = settled.flatMap((s) => (s.status === 'fulfilled' ? [s.value] : []))
        if (ok.length > 0) return mergeResults(ok)
      }
    } finally {
      // Cancel a race's losers now rather than when their timers fire.
      group.abort()
      group.dispose()
      for (const run of runs) run.catch(() => {})
    }
    if (signal?.aborted) throw signal.reason ?? new Error('web search aborted')
    return runChain('search', rest, signal, attempt, undefined, trail)
  }

  /** Per-(engine, key) call counts since this plugin instance started, for the card. */
```

</details>

**依据 3 · 源码核查**：[src/index.ts:854-891](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L854-L891)

弱抓取/缓存与退路。

<details>
<summary>查看原文（38行）</summary>

```text
    async fetch(request: any, signal: any) {
      const current = resolved()
      const local = dshFetchProvider()
      // Passed through untouched, so dsh's own WebError codes
      // (WEB_FETCH_TIMEOUT, WEB_REDIRECT_BLOCKED, …) reach the tool as-is.
      if (current.fetchSource === 'dsh') {
        if (!local) throw new Error(`dsh's local fetch provider "${DSH_FETCH_PROVIDER_ID}" is not registered in this composition.`)
        return local.fetch(request, signal)
      }
      const attempts = [...orderedAttempts('fetch'), ...keylessFetchAttempt(current)]
      if (attempts.length === 0) {
        if (local) return local.fetch(request, signal)
        throw new Error('No web fetch providers configured. Please set at least one API key in config.')
      }
      const weak = (r: { content: string }) => r.content.trim().length < MIN_FETCH_CHARS
      const hit = fetchCache.get(request.url)
      if (hit) usage.cacheHit('fetch')
      let result: { content: string; truncated: boolean }
      try {
        result = hit ?? await runChain(
          'fetch',
          attempts,
          signal,
          (provider, key, scoped) => provider.fetch(request.url, key, scoped),
          weak,
        )
      } catch (err: any) {
        if (!local || signal?.aborted) throw err
        logger.warn?.(`Every fetch engine failed; falling back to dsh's local fetch. ${String(err?.message)}`)
        try {
          return await local.fetch(request, signal)
        } catch (localErr: any) {
          throw new Error(`${String(err?.message).replace(/\.$/, '')}; dsh local fetch: ${String(localErr?.message)}`)
        }
      }
      // A weak result is the chain's last resort, not a good copy: leave it
      // out so the next fetch of this URL tries again.
      if (!weak(result)) fetchCache.set(request.url, result, cacheTtl(current))
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-24](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/cordis.patch.yml#L1-L24)

bundle回原路径依层顺序。

<details>
<summary>查看原文（24行）</summary>

```text
# dsh bundle patch for dsh-web-search-free.
#
# Applied as a profile layer in dsh.profile.bundles order; later layers
# override earlier ones by entry id, so the `web` row repoint below wins
# over dsh-base's `searchProvider: deepseek-official`. Installing this plugin
# into a profile's bundles routes web search/fetch through it; removing the
# plugin drops this layer and the base route returns — no manual profile
# patch needed.
#
# The web seam (`@deepseek-ai/dsh-web`, row id `web`) selects a provider by id
# at execution time; `web-search-free` is the id this plugin's host half
# registers, and its own `providerOrder` setting governs the per-backend
# fallback sequence inside the provider.
- insert:
    - id: web-search-free
      name: 'dsh-web-search-free'

# Repoint the web capability seam at this plugin's provider. dsh-base pins
# `searchProvider: deepseek-official`; a non-insert patch with a matching id
# overrides that entry's config wholesale, so both capabilities resolve here.
- id: web
  config:
    searchProvider: web-search-free
    fetchProvider: web-search-free
```

</details>

**依据 5 · 作者声明**：[README.md:117-129](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/README.md#L117-L129)

作者策略/来源设置，不当现价。

<details>
<summary>查看原文（13行）</summary>

```text
卡片底部「高级设置」默认收起，不改也能用。顶部的**快捷预设**（省额度 / 速度优先 / 质量优先 / 中文优先 / 恢复默认）可叠加，保存后生效。

| 设置            | 字段                  | 说明                                                                                                                                   |
| --------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 搜索策略        | `searchStrategy`      | `fallback`（默认）逐个尝试，最省额度；`race` 同时调前 N 个、取最快；`merge` 同时调前 N 个并合并去重，结果最全但消耗 N 倍额度           |
| 并发引擎数      | `parallelEngines`     | 2–4，默认 2，仅 `race` / `merge` 使用                                                                                                  |
| 结果地区 / 语言 | `region` / `language` | 默认 `auto`。Brave、SerpApi、Serping API、TinyFish、AnySearch 两项都支持；Tavily、Exa 仅地区；SearXNG 仅语言；其余不支持            |
| 时间范围        | `freshness`           | `any`（默认）/ `day` / `week` / `month` / `year`。AnySearch、Jina 不支持；百度千帆的 `day` 按一周查                                    |
| 屏蔽域名        | `blockedDomains`      | 每行一个，含子域名                                                                                                                     |
| 优先域名        | `preferredDomains`    | 每行一个，这些域名的结果排到最前                                                                                                       |
| 摘要长度        | `snippetLength`       | 100–1000，默认 300                                                                                                                     |
| Tavily 搜索深度 | `tavilySearchDepth`   | `basic`（默认，1 credit）/ `advanced`（2 credits）                                                                                     |
| 抓取来源        | `fetchSource`         | `providers`（默认）：有 Key 的引擎 → 无 Key Jina → dsh 本地抓取；`dsh`：只用 dsh 本地抓取（免费、不经第三方，但不渲染 JS）             |
```

</details>

#### 缺口

- 没有真实外部额度/费用、宿主接管及合格查询效果。
  **影响**：仅支持公开内容的单引擎起步试用。
  **进一步探讨**：同查询记录API尝试/账单、正确来源、完整页面及人工核对总时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么新假设可验证？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是让抓取结果附缓存命中、抓取时间/提供方和内容版本，将缓存键绑定实际抓取配置；同时明确排除域只约束sources，若用户要求强排除就不使用无法归因的聚合answer。它来自URL单键缓存和content不随source过滤的边界，不需要再造爬虫或承诺“更多引擎必然正确”。

最小对照用同URL更正、换引擎/Key、TTL改0、混合被排除来源与短JS壳样本，比较旧内容识别、错误引用、调用数和维护负担。严格answer处理可能丢有用摘要、更细缓存增加请求/元数据；若事实引用没改善而费用/人工上涨，就否定方案。未实现或获用户需求，不计为插件现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:799-818](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L799-L818)

answer与source排除分离。

<details>
<summary>查看原文（20行）</summary>

```text
      const attempt = async (provider: MyProvider, key: string, scoped: AbortSignal): Promise<SearchResult> => {
        const result = await provider.search(request.query, key, scoped, options)
        const sources = (result.sources ?? []).filter((s) => !matchesDomain(s.url, blocked))
        if (sources.length === 0) {
          throw new ProviderError(`${provider.name} search returned no results outside the blocked domains.`)
        }
        return { ...result, sources }
      }

      const result = strategy === 'race' || strategy === 'merge'
        ? await runParallel(strategy, width, attempts, signal, attempt)
        : await runChain('search', attempts, signal, attempt)

      const answer = {
        content: result.content || '',
        sources: finalizeSources(result.sources ?? [], preferred, snippetLength),
      }
      searchCache.set(cacheKey, answer, cacheTtl(current))
      return { ...answer, sources: [...answer.sources], truncated: false }
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:868-891](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/index.ts#L868-L891)

URL缓存及短内容处理。

<details>
<summary>查看原文（24行）</summary>

```text
      const weak = (r: { content: string }) => r.content.trim().length < MIN_FETCH_CHARS
      const hit = fetchCache.get(request.url)
      if (hit) usage.cacheHit('fetch')
      let result: { content: string; truncated: boolean }
      try {
        result = hit ?? await runChain(
          'fetch',
          attempts,
          signal,
          (provider, key, scoped) => provider.fetch(request.url, key, scoped),
          weak,
        )
      } catch (err: any) {
        if (!local || signal?.aborted) throw err
        logger.warn?.(`Every fetch engine failed; falling back to dsh's local fetch. ${String(err?.message)}`)
        try {
          return await local.fetch(request, signal)
        } catch (localErr: any) {
          throw new Error(`${String(err?.message).replace(/\.$/, '')}; dsh local fetch: ${String(localErr?.message)}`)
        }
      }
      // A weak result is the chain's last resort, not a good copy: leave it
      // out so the next fetch of this URL tries again.
      if (!weak(result)) fetchCache.set(request.url, result, cacheTtl(current))
```

</details>

**依据 3 · 源码核查**：[src/cache.ts:17-35](https://github.com/MochiNek0/dsh-web-search-free/blob/1407bd34c83ad46e305eea0b70ba71551e57057f/src/cache.ts#L17-L35)

旧期限不受新TTL清空。

<details>
<summary>查看原文（19行）</summary>

```text
  get(key: string, now = Date.now()): V | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    this.entries.delete(key)
    if (entry.expires <= now) return undefined
    this.entries.set(key, entry)
    return entry.value
  }

  /** Store `value` for `ttlMs`; a non-positive TTL stores nothing. */
  set(key: string, value: V, ttlMs: number, now = Date.now()): void {
    if (!(ttlMs > 0)) return
    this.entries.delete(key)
    this.entries.set(key, { value, expires: now + ttlMs })
    while (this.entries.size > this.capacity) {
      this.entries.delete(this.entries.keys().next().value as string)
    }
  }
}
```

</details>

#### 缺口

- 未有配置/正文更正对照与强排除需求反馈。
  **影响**：不确定新增元数据/调用值得。
  **进一步探讨**：以固定样本比较可追溯性与费用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
