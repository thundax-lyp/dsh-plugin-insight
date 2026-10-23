# DSH Douyin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2f28338](https://github.com/AnacondaKC/dsh-douyin/tree/2f28338b29503f20d159b1f0123a985530134b6a)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-douyin)
<!-- END META -->

> **实现功能**：在DSH WebUI侧栏或浮动面板播放第三方随机短视频，支持系列选择、直链历史与连播。

> **核心亮点**：相对直接打开随机源，增量是把随机入口解析为当前直链并保存短期历史，再适配侧栏/独立dock；它集成现成播放能力，不创造内容供给或研究能力。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：相同URL回放不等于永久同一视频。内存历史、第三方跳转/时效与浏览器策略限制可靠性，安装到DSH的净便利也尚无独立用户依据。[Q03](#research-q03)

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
  - [Q01 · 侧栏随机短视频相对浏览器独立页面增加什么？](#detail-section-11)
  - [Q02 · 白名单解析、历史与失败恢复如何接线？](#detail-section-12)
  - [Q03 · 直链回放是否意味着持久可用，依赖和成本在哪里？](#detail-section-13)
  - [Q04 · 是否值得为随机短视频安装插件，可检验什么改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在DSH内观看泛娱乐视频的个人用户，交付是可播放与短期同URL回放，不涉及内容研究。

独立浏览器标签页或直接播放器即可完成主要观看任务；本轮未比较真实用户收益，不扩展为内容分析能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 直链解析 | 取内置随机feed首个媒体目标 | 只允许内置HTTPS端点，不是任意URL代理 |
| 原生播放与历史 | 暂停/进度/音量/手势及返回同URL | 最多100条内存历史；URL不保证永不过期 |
| 双模式面板 | better-sidebar或独立dock观看 | 外部侧栏可选，前端/宿主兼容未实际验证 |
| 失败停止 | 有限退避及3次连续失败后提示 | 不是第三方API持续可用保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis ^4.0.1-rc.4、DSH webserver/client-runtime ^0.0.1-rc.5、React ^18.2.0 | 启动必需 | host路由与web播放器 | 包peer为作者声明，本轮未加载或验证其他宿主 |
| 第三方feed/媒体网络与浏览器解码 | 播放必需 | 解析与播放视频 | 错误有限重试，连续3次停止，不扩大代理白名单 |
| better-sidebar | 可选 | 提供统一tab入口 | 未安装走独立dock，不是硬依赖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 本地包加载 | 用户核对private包和宿主peer | 入口与播放器存在，不假定公开npm可装 |
| 单源播放 | 用户打开面板，插件解析首跳 | video真实播放，向后核对同段而非只看URL |
| 收起/异常 | 用户关闭或停止，插件卸载播放器 | 网络/音频停止、布局恢复，持续失败则停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地构建/安装依赖与磁盘 | 匹配宿主、装包与单源核对 | private包，金额与耗时未测 |
| 持续使用 | 随机源请求及视频带宽/解码 | 观看与主任务切换注意力 | 流量和便利性未知，不宣称效率提高 |
| 失败恢复 | 退避失败请求与重载资源 | 换源、核对浏览器和恢复布局 | 三次停止限制自动重试，恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 短期回放 | 已解析URL进入内存历史 | 长期时效、内容不变和实际同段率 |
| 资源边界 | 限流、三次失败停止与关闭卸载 | 真实带宽、解码成功率和关闭取消效果 |
| 采用便利 | 同屏dock/tab与手势控制 | 相对独立浏览器的净收益和需求频率 |

> **思考**：相同URL回放不等于永久同一视频。内存历史、第三方跳转/时效与浏览器策略限制可靠性，安装到DSH的净便利也尚无独立用户依据。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对直接打开随机源，增量是把随机入口解析为当前直链并保存短期历史，再适配侧栏/独立dock；它集成现成播放能力，不创造内容供给或研究能力。[Q01](#research-q01) [Q02](#research-q02)

相对直接打开随机源，增量是把随机入口解析为当前直链并保存短期历史，再适配侧栏/独立dock；它集成现成播放能力，不创造内容供给或研究能力。[Q01](#research-q01) [Q02](#research-q02)

随机入口与已解析媒体身份分离、白名单、有限重试与关闭卸载值得借鉴。首跳DNS检查不覆盖后续媒体变化，有限内存历史也不是长期媒体存档；迁移需管理浏览器事件和宿主布局副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

相同URL回放不等于永久同一视频。内存历史、第三方跳转/时效与浏览器策略限制可靠性，安装到DSH的净便利也尚无独立用户依据。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；确有DSH内娱乐需求者可在隔离profile单源短时评估，确认收起停止与布局恢复，持续报错或干扰主任务则停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查resolver、播放器策略与挂载源码；未播放媒体或调用外部源，长期内容可用性未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/MediaPlayer.ts、src/client/index.ts、src/index.ts、src/client/player-policy.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：固定媒体源及浏览器，对比独立标签、当前dock与时效/主动续播方案，观察同段率、全部网络请求和中断负担；本轮未调用外部源或播放视频。

**分析版本**

- **仓库**：[AnacondaKC/dsh-douyin](https://github.com/AnacondaKC/dsh-douyin)
- **版本号**：0.2.0（[固定提交 2f28338](https://github.com/AnacondaKC/dsh-douyin/tree/2f28338b29503f20d159b1f0123a985530134b6a)）
- **版本日期**：2026-08-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是暴露媒体身份/时效和失败原因、采用主动续播，能比默认随机连播降低坏链重试及主任务打断；需和独立标签页及当前dock对照回放率、带宽和中断负担。[Q04](#research-q04)

固定媒体源及浏览器，对比独立标签、当前dock与时效/主动续播方案，观察同段率、全部网络请求和中断负担；本轮未调用外部源或播放视频。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 136 | — | — | 1670 |
| .js | source | 7 | 2701 | 2410 | 356 | — |
| .mjs | source | 2 | 55 | 44 | 2 | — |
| .ts | source | 6 | 1269 | 1055 | 134 | — |
| .ts | test | 4 | 282 | 244 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-douyin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-douyin/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A30.336Z..2026-10-23T07%3A58%3A30.336Z)

暂未获取：近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：侧栏随机视频怎样通过白名单解析、历史和失败策略交付播放，长期可用性受什么限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏随机短视频相对浏览器独立页面增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是希望在DSH WebUI中短暂观看泛娱乐视频的个人用户，合格结果是选系列后能播放、向前向后切段，并在收起面板时停止相关媒体挂载。它不是抖音账号管理、内容搜索、转录或研究工具；内置内容来自第三方随机视频API，不能按插件名称推断为抖音官方数据源。相对直接打开网页，局部增量是宿主侧解析随机跳转，把真实直链保存在会话历史中，从而返回刚才那段而非再次随机；另提供better-sidebar集成或无额外侧栏插件的dock。机制有源码依据，但它没有改变内容供给和交付方式，需求频率和比独立浏览器更值得采用没有独立数据，不将娱乐便利包装为软件交付效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-11](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/README.md#L1-L11)

作者明确侧栏播放器与第三方随机API，不是官方抖音集成。

<details>
<summary>查看原文（11行）</summary>

```text
# dsh-douyin

DSH WebUI 侧栏短视频插件：**原生播放器直接解析视频直链播放**。顶部可选择学姐、甜妹、COS、舞蹈等 21 个系列，支持自动连播、滚轮切换与精确历史回放。

![dsh-douyin 在 DSH WebUI 中的短视频侧栏效果](docs/images/dsh-douyin-preview.png)

## 原理

聚合视频源来自 `api.yujn.cn` 的分类接口。每次请求会 302 到随机 mp4 直链；插件通过 host resolver 读取 `Location`，再交给原生 `<video>` 播放。历史栈保存真实直链，因此向上滚动能回到同一段视频。

## 安装
```

</details>

**依据 2 · 源码核查**：[src/client/MediaPlayer.ts:318-341](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/MediaPlayer.ts#L318-L341)

直链替换live入口，支持局部历史回放贡献。

<details>
<summary>查看原文（24行）</summary>

```text
  // Resolve a live feed request to its real redirect target before mounting
  // the video. An unresolved feed is a failed segment: retaining the request
  // URL would make a later history replay return a different random clip.
  useEffect(() => {
    const current = historyRef.current[index]
    if (current === undefined || !current.live || !isFeed) return
    const controller = new AbortController()
    setStatus('loading')
    resolveFeedUrl(current.url, controller.signal)
      .then(final => {
        if (controller.signal.aborted) return
        if (final === null) {
          handleError()
          return
        }
        historyRef.current = historyRef.current.map((h, i) =>
          i === index ? { url: final, live: false } : h,
        )
        setRevision(r => r + 1)
      })
      .catch(() => {
        if (!controller.signal.aborted) handleError()
      })
    return () => controller.abort()
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:394-404](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/index.ts#L394-L404)

可选better-sidebar单实例tab。

<details>
<summary>查看原文（11行）</summary>

```text
  const betterSidebar = ctx.get('betterSidebar') as { registerTab?: (descriptor: unknown) => () => void } | undefined

  if (betterSidebar?.registerTab) {
    ctx.effect(() => betterSidebar.registerTab!({
      id: 'dsh-douyin:feed',
      title: '刷视频',
      icon: (size: number) => createElement(Play, { size, strokeWidth: 2.2, 'aria-hidden': true }),
      single: true,
      component: () => createElement(FeedPanel),
    }), `${ID}: better-sidebar tab`)
    return
```

</details>

#### 缺口

- 目标用户实际频率与相对浏览器便利性未测
  **影响**：场景为作者设想而非独立采用证据
  **进一步探讨**：由愿意在DSH看视频的用户比较两种入口的操作量和主任务中断

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 白名单解析、历史与失败恢复如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host只接受DEFAULT_SOURCES构成的HTTPS origin/path以及至多一个_t参数；解析使用HEAD、manual redirect及8秒超时，只取第一个3xx Location，再对目标协议、凭据和DNS解析出的地址进行公网检查，不下载视频正文。接口另设8并发及每10秒60次限额。browser获得目标后将该历史entry替为live=false，video只使用解析结果；前进优先已有历史，末端才追加新请求，历史最多100条。失败按300ms倍数退避，连续3次停止自动请求，正常播放就重置计数。dock打开才挂载播放器，关闭撤去FeedPanel，插件释放时卸载root并恢复会话区margin。值得借鉴的是随机入口与已解析媒体身份分离、有限重试和面板生命周期，但静态代码不能证明浏览器解码或所有回调次序都正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:17-49](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/index.ts#L17-L49)

请求白名单、超时、并发和速率限制。

<details>
<summary>查看原文（33行）</summary>

```text
const RESOLVE_TIMEOUT_MS = 8000
const MAX_REQUEST_URL_LENGTH = 2048
const MAX_FEED_URL_LENGTH = 1024
const MAX_CONCURRENT_RESOLVES = 8
const RATE_WINDOW_MS = 10_000
const MAX_RESOLVES_PER_WINDOW = 60

const ALLOWED_FEEDS = new Set(DEFAULT_SOURCES
  .filter(source => source.kind === 'feed')
  .map(source => {
    const url = new URL(source.url)
    return `${url.origin}${url.pathname}`
  }))

let activeResolves = 0
let rateWindowStartedAt = 0
let resolvesInWindow = 0

/** Only built-in HTTPS feed endpoints may make the host issue a request. */
export function isAllowedFeedUrl(rawUrl: string): boolean {
  if (rawUrl.length === 0 || rawUrl.length > MAX_FEED_URL_LENGTH) return false
  let target: URL
  try {
    target = new URL(rawUrl)
  } catch {
    return false
  }
  if (target.protocol !== 'https:' || target.username !== '' || target.password !== '' || target.port !== '' || target.hash !== '') {
    return false
  }
  if (!ALLOWED_FEEDS.has(`${target.origin}${target.pathname}`)) return false
  const keys = [...target.searchParams.keys()]
  return keys.length <= 1 && keys.every(key => key === '_t')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:120-149](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/index.ts#L120-L149)

仅HEAD并取首个重定向，目标公网地址检查。

<details>
<summary>查看原文（30行）</summary>

```text
export async function isSafeRedirectTarget(target: URL, resolveHost: HostLookup = lookupAll): Promise<boolean> {
  if ((target.protocol !== 'http:' && target.protocol !== 'https:') || target.username !== '' || target.password !== '') return false
  if (isIP(target.hostname) !== 0) return isPublicIpAddress(target.hostname)
  try {
    const addresses = await resolveHost(target.hostname)
    return addresses.length > 0 && addresses.every(({ address }) => isPublicIpAddress(address))
  } catch {
    return false
  }
}

/** Resolve an allowlisted feed URL to its first public HTTP redirect target. */
export async function resolveRedirect(rawUrl: string): Promise<string | null> {
  if (!isAllowedFeedUrl(rawUrl)) return null
  const target = new URL(rawUrl)
  try {
    const res = await fetch(target, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(RESOLVE_TIMEOUT_MS),
    })
    if (res.status < 300 || res.status >= 400) return null
    const location = res.headers.get('location')
    if (location === null) return null
    const redirected = new URL(location, target)
    if (!await isSafeRedirectTarget(redirected)) return null
    return redirected.href === target.href ? null : redirected.href
  } catch {
    return null
  }
```

</details>

**依据 3 · 源码核查**：[src/client/MediaPlayer.ts:137-185](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/MediaPlayer.ts#L137-L185)

历史前进与错误退避的实际接线。

<details>
<summary>查看原文（49行）</summary>

```text
  /** Forward through feed history or append one bounded fresh request. */
  const next = useCallback(() => {
    if (!supportsSegmentNavigation(source.kind)) return
    const hist = historyRef.current
    if (index < hist.length - 1) {
      goTo(index + 1)
      return
    }
    historyRef.current = appendBounded(hist, { url: bustedUrl(source.url), live: true })
    setRevision(current => current + 1)
    goTo(historyRef.current.length - 1)
  }, [index, goTo, source.kind, source.url])

  /** Backward navigation exists only for random feeds. */
  const prev = useCallback(() => {
    if (isFeed && index > 0) goTo(index - 1)
  }, [index, isFeed, goTo])

  const handleReady = useCallback(() => {
    resetFailures()
    setStatus('ready')
  }, [resetFailures])

  const handleCanPlay = useCallback((): void => {
    handleReady()
    const video = videoRef.current
    if (video === null || !video.paused || paused) return
    void video.play().catch(() => setPaused(true))
  }, [handleReady, paused])

  /** Feed failures retry with backoff and stop after a strict upper bound. */
  const handleError = useCallback(() => {
    clearRetryTimer()
    if (!isFeed) {
      setStatus('error')
      return
    }
    const decision = nextFailureDecision(failureCountRef.current)
    failureCountRef.current = decision.count
    if (decision.retryDelayMs === null) {
      setStatus('error')
      return
    }
    setStatus('loading')
    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null
      next()
    }, decision.retryDelayMs)
  }, [clearRetryTimer, isFeed, next])
```

</details>

**依据 4 · 源码核查**：[src/client/player-policy.ts:1-34](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/player-policy.ts#L1-L34)

3次连续失败、100条历史和400ms滚轮节流。

<details>
<summary>查看原文（34行）</summary>

```text
export const WHEEL_THROTTLE_MS = 400
export const FAILURE_RETRY_BASE_MS = 300
export const MAX_CONSECUTIVE_FAILURES = 3
export const MAX_HISTORY_ENTRIES = 100

export interface FailureDecision {
  count: number
  retryDelayMs: number | null
}

/** A null delay means automatic retries must stop and surface an error. */
export function nextFailureDecision(previousCount: number): FailureDecision {
  const count = Math.max(0, previousCount) + 1
  return {
    count,
    retryDelayMs: count >= MAX_CONSECUTIVE_FAILURES
      ? null
      : FAILURE_RETRY_BASE_MS * count,
  }
}

export function acceptsWheel(lastAcceptedAt: number, now: number): boolean {
  return now - lastAcceptedAt >= WHEEL_THROTTLE_MS
}

export function supportsSegmentNavigation(kind: 'feed' | 'direct' | 'web'): boolean {
  return kind === 'feed'
}

export function appendBounded<T>(entries: readonly T[], entry: T, limit = MAX_HISTORY_ENTRIES): T[] {
  const appended = [...entries, entry]
  if (limit <= 0) return []
  return appended.length > limit ? appended.slice(appended.length - limit) : appended
}
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:414-450](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/index.ts#L414-L450)

打开时才挂载FeedPanel，释放恢复布局。

<details>
<summary>查看原文（37行）</summary>

```text
  const render = (open: boolean): void => {
    if (root === null) root = createRoot(dockHost)
    const mainRoot = document.querySelector(MAIN_ROOT_SELECTOR) as HTMLElement | null
    if (open) {
      if (marginBeforeOpen === null && mainRoot !== null) marginBeforeOpen = mainRoot.style.marginRight
      setMainRootMargin(DOCK_WIDTH_CSS)
    } else if (marginBeforeOpen !== null) {
      setMainRootMargin(marginBeforeOpen)
      marginBeforeOpen = null
    }
    root.render(createElement('div', null,
      createElement('button', {
        className: 'vf-fab',
        type: 'button',
        'data-open': open ? true : undefined,
        title: open ? '收起' : '打开刷视频面板',
        'aria-label': open ? '收起刷视频面板' : '打开刷视频面板',
        'aria-expanded': open,
        onClick: () => render(!open),
      }, createElement(open ? PanelRightClose : PanelRightOpen, {
        size: 17,
        strokeWidth: 2.2,
        'aria-hidden': true,
      })),
      open
        ? createElement('div', { className: 'vf-dock' }, createElement(FeedPanel))
        : null,
    ))
  }
  render(false)

  ctx.effect(() => {
    return () => {
      root?.unmount()
      dockHost.remove()
      if (marginBeforeOpen !== null) setMainRootMargin(marginBeforeOpen)
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 直链回放是否意味着持久可用，依赖和成本在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

不意味着。“精确回放”最多证明当前内存历史复用同一个URL；historyRef在组件内存，最多100条，刷新、卸载或换系列后不承诺保存。同URL可能过期、返回不同内容或继续重定向，因此并不保证长期同一媒体字节。host只验证第一个跳转目标当时的地址，浏览器随后请求的链条和内容本身仍由第三方控制，不能把源白名单解释成媒体内容长期可信保证。第三方API/媒体网络、浏览器解码/自动播放政策、DSH web/React接口均影响兑现。package为private且main指向lib，本轮未证明公开npm可安装；peer声明Cordis ^4.0.1-rc.4、宿主webserver/client-runtime ^0.0.1-rc.5、React ^18.2.0，并非现行所有宿主兼容保证。首次本地构建/装包，持续视频带宽和自动连播注意力，失败恢复网络/源选择和重试都要计入，金额、流量、人工时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MediaPlayer.ts:83-91](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/MediaPlayer.ts#L83-L91)

历史在useRef内存，不能推断持久保存。

```text
export function MediaPlayer(props: MediaPlayerProps): React.ReactElement {
  const source = props.source
  const isFeed = source.kind === 'feed'
  const stageRef = useRef<HTMLDivElement>(null)
  // Playback history, keyed by position; index walks it both ways.
  const historyRef = useRef<HistoryEntry[]>([])
  if (historyRef.current.length === 0) {
    historyRef.current = [{ url: isFeed ? bustedUrl(source.url) : source.url, live: isFeed }]
  }
```

**依据 2 · 源码核查**：[src/client/player-policy.ts:1-4](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/player-policy.ts#L1-L4)

历史有限100条。

```text
export const WHEEL_THROTTLE_MS = 400
export const FAILURE_RETRY_BASE_MS = 300
export const MAX_CONSECUTIVE_FAILURES = 3
export const MAX_HISTORY_ENTRIES = 100
```

**依据 3 · 源码核查**：[src/index.ts:120-146](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/index.ts#L120-L146)

检查首跳后返回URL，未验证后续内容不可变。

<details>
<summary>查看原文（27行）</summary>

```text
export async function isSafeRedirectTarget(target: URL, resolveHost: HostLookup = lookupAll): Promise<boolean> {
  if ((target.protocol !== 'http:' && target.protocol !== 'https:') || target.username !== '' || target.password !== '') return false
  if (isIP(target.hostname) !== 0) return isPublicIpAddress(target.hostname)
  try {
    const addresses = await resolveHost(target.hostname)
    return addresses.length > 0 && addresses.every(({ address }) => isPublicIpAddress(address))
  } catch {
    return false
  }
}

/** Resolve an allowlisted feed URL to its first public HTTP redirect target. */
export async function resolveRedirect(rawUrl: string): Promise<string | null> {
  if (!isAllowedFeedUrl(rawUrl)) return null
  const target = new URL(rawUrl)
  try {
    const res = await fetch(target, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(RESOLVE_TIMEOUT_MS),
    })
    if (res.status < 300 || res.status >= 400) return null
    const location = res.headers.get('location')
    if (location === null) return null
    const redirected = new URL(location, target)
    if (!await isSafeRedirectTarget(redirected)) return null
    return redirected.href === target.href ? null : redirected.href
```

</details>

**依据 4 · 源码核查**：[package.json:1-16](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/package.json#L1-L16)

private与发布入口，不假定公开npm分发。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-douyin",
  "version": "0.2.0",
  "description": "DSH WebUI 侧栏短视频插件：原生播放器、21 个系列选择、直链解析、滚轮历史回放与自动连播",
  "private": true,
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 5 · 源码核查**：[package.json:49-56](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/package.json#L49-L56)

宿主与React peer范围为声明条件。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.4",
    "@deepseek-ai/dsh-client-runtime": "^0.0.1-rc.5",
    "@deepseek-ai/dsh-host-webserver": "^0.0.1-rc.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
```

#### 缺口

- 第三方URL时效、内容稳定性和实际浏览器播放未独立核查
  **影响**：不能给长期回放或播放成功率保证
  **进一步探讨**：冻结同一URL不同时间回放，记录最终响应/媒体身份和解码结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 是否值得为随机短视频安装插件，可检验什么改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议observe。确有侧栏娱乐需求时，它的局部历史和手势控制是可解释便利；但独立浏览器已经能完成观看，新增宿主维护与第三方源依赖的净优势证据不足，不为“在DSH内”本身给持续安装推荐。未验证假设是显示媒体身份/直链时效和失败原因，并给用户主动续播而非默认继续随机，可以在保留精确短期回放的同时减少坏链重试和主任务打断。推导来自内存历史、三次失败停止与按需挂载，不把这一设计当已实现。最小验证相同视频源和浏览器比较独立标签页、当前dock、带时效/主动续播方案，记录回放同段率、网络请求、带宽和用户中断感；若提示不能改善回放可靠性或额外操作抵消收益，则否定。若用户自行试用，先单源短时播放并检查收起停止；持续报错或影响工作区布局时停用，不通过放宽host任意URL代理来“修复”可用性。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/player-policy.ts:11-19](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/player-policy.ts#L11-L19)

重试停止边界支持改进网络与中断策略的推导。

```text
/** A null delay means automatic retries must stop and surface an error. */
export function nextFailureDecision(previousCount: number): FailureDecision {
  const count = Math.max(0, previousCount) + 1
  return {
    count,
    retryDelayMs: count >= MAX_CONSECUTIVE_FAILURES
      ? null
      : FAILURE_RETRY_BASE_MS * count,
  }
```

**依据 2 · 源码核查**：[src/client/MediaPlayer.ts:318-341](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/MediaPlayer.ts#L318-L341)

直链身份仅当前内存存储，时效假设从此产生。

<details>
<summary>查看原文（24行）</summary>

```text
  // Resolve a live feed request to its real redirect target before mounting
  // the video. An unresolved feed is a failed segment: retaining the request
  // URL would make a later history replay return a different random clip.
  useEffect(() => {
    const current = historyRef.current[index]
    if (current === undefined || !current.live || !isFeed) return
    const controller = new AbortController()
    setStatus('loading')
    resolveFeedUrl(current.url, controller.signal)
      .then(final => {
        if (controller.signal.aborted) return
        if (final === null) {
          handleError()
          return
        }
        historyRef.current = historyRef.current.map((h, i) =>
          i === index ? { url: final, live: false } : h,
        )
        setRevision(r => r + 1)
      })
      .catch(() => {
        if (!controller.signal.aborted) handleError()
      })
    return () => controller.abort()
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:414-450](https://github.com/AnacondaKC/dsh-douyin/blob/2f28338b29503f20d159b1f0123a985530134b6a/src/client/index.ts#L414-L450)

按需挂载和布局恢复使小范围验收可控。

<details>
<summary>查看原文（37行）</summary>

```text
  const render = (open: boolean): void => {
    if (root === null) root = createRoot(dockHost)
    const mainRoot = document.querySelector(MAIN_ROOT_SELECTOR) as HTMLElement | null
    if (open) {
      if (marginBeforeOpen === null && mainRoot !== null) marginBeforeOpen = mainRoot.style.marginRight
      setMainRootMargin(DOCK_WIDTH_CSS)
    } else if (marginBeforeOpen !== null) {
      setMainRootMargin(marginBeforeOpen)
      marginBeforeOpen = null
    }
    root.render(createElement('div', null,
      createElement('button', {
        className: 'vf-fab',
        type: 'button',
        'data-open': open ? true : undefined,
        title: open ? '收起' : '打开刷视频面板',
        'aria-label': open ? '收起刷视频面板' : '打开刷视频面板',
        'aria-expanded': open,
        onClick: () => render(!open),
      }, createElement(open ? PanelRightClose : PanelRightOpen, {
        size: 17,
        strokeWidth: 2.2,
        'aria-hidden': true,
      })),
      open
        ? createElement('div', { className: 'vf-dock' }, createElement(FeedPanel))
        : null,
    ))
  }
  render(false)

  ctx.effect(() => {
    return () => {
      root?.unmount()
      dockHost.remove()
      if (marginBeforeOpen !== null) setMainRootMargin(marginBeforeOpen)
    }
```

</details>

#### 缺口

- 时效提示及主动续播对照未实施
  **影响**：设计假设不计现有贡献，需求仍需用户验证
  **进一步探讨**：固定源/环境比较同段回放率、带宽与中断负担

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
