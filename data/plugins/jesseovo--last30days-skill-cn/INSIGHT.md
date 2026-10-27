# last30days-cn

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[af785c6](https://github.com/Jesseovo/last30days-skill-cn/tree/af785c682de2fb9192e495daf061308a7a6799ec)

<!-- BEGIN META -->
[![GitHub ★ 1,967](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C967&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jesseovo/last30days-skill-cn)
<!-- END META -->

> **功能**：检索近期中文平台讨论并聚合热榜，输出带来源的研究报告。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 在上游研究Skill基础上组织中文来源与质量状态，减少手工聚合步骤；成熟检索/去重框架和上游贡献不作本项目原创。

> **主要限制**：[Q03](#research-q03) 不同采集路径、日期缺失和转载使样本不可当全网观点比例，热度与相关性分数不验证事实；关键结论必须回原文。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 主题研究与热榜适合哪些研究工作？](#detail-section-15)
  - [Q02 · 来源失败、清洗与排序怎样进入报告？](#detail-section-16)
  - [Q03 · 跨平台聚合能否被视为全网观点分布？](#detail-section-17)
  - [Q04 · 登录维护、人工复核和失败恢复是否值得？](#detail-section-18)
  - [Q05 · 覆盖矩阵能否减少对平台比较的误读？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：中文研究与内容人员以时间窗主题检索发现线索，再核查原始出处。

逐平台手工搜索和链接表是简单基线；这里比较组织流程，不做未经执行的质量或成本排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题研究 | 多平台近期线索聚合 | 不保证全网完整样本 |
| 来源状态 | 披露失败、路径和条数 | 不证明材料事实真实 |
| 热榜模式 | 查看采集时点热点 | 不等于30天主题研究 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 可执行Python的Skill宿主 | 运行检索与报告 | 核对完整载荷 |
| 平台访问/可选凭证API | 提供样本 | 限定公开源并披露缺失 |
| 人工原文判断 | 形成可靠结论 | 无法回链则不下结论 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 核查来源环境 | 用户diagnose确认路径 | 不伪装完整覆盖 |
| 固定主题与窗 | 研究者定义合格结果 | 区分热榜快照 |
| 读取来源状态与原文 | 研究者抽查日期引用 | 缺关键源则收窄结论 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | Python与可选API资源，未知 | 配置来源与登录，未知 |
| 持续 | API/模型/网络资源，未知 | 原文、日期和转载核查，未知 |
| 失败恢复 | 超时重试与替代搜索，未知 | 修凭证、收窄覆盖、手工补源，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 源码支持 | 未验证部分 |
|---|---|---|
| 多来源报告 | 并行/去重/日期与状态链 | 真实可用率和准确性 |
| 发现近期线索 | 相关性时效互动排序 | 代表性、真实性与节时 |

> **思考**：[Q03](#research-q03) 不同采集路径、日期缺失和转载使样本不可当全网观点比例，热度与相关性分数不验证事实；关键结论必须回原文。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 在上游研究Skill基础上组织中文来源与质量状态，减少手工聚合步骤；成熟检索/去重框架和上游贡献不作本项目原创。

来源独立失败、统一处理与来源状态有复用价值；移植必须保留日期、via与错误语义，不能只复制评分而丢弃覆盖边界。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 不同采集路径、日期缺失和转载使样本不可当全网观点比例，热度与相关性分数不验证事实；关键结论必须回原文。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 适合可接受非完整样本的线索研究，先核查每源状态与抽样链接；不适合未经补证的总体舆论比例或事实定论。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查处理链与评分、来源状态；未执行检索或登录，覆盖矩阵为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、scripts/lib/pipeline.py、scripts/lib/score.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码抽读Python pipeline/score与Skill；未联网执行目标采集、登录、安装或验证动态站点，不将目录收录视为DSH原生安装。
- 下一步：同题同窗抽核链接、日期与独立来源，记录人工分钟和费用；再做来源失败注入与覆盖矩阵读者对照，尚未执行。

**分析版本**

- **仓库**：[Jesseovo/last30days-skill-cn](https://github.com/Jesseovo/last30days-skill-cn)
- **版本号**：未声明（[固定提交 af785c6](https://github.com/Jesseovo/last30days-skill-cn/tree/af785c682de2fb9192e495daf061308a7a6799ec)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是用来源路径和日期/转载覆盖矩阵约束比较资格，五份报告对照误读与阅读时间；没有改善就停止。

同题同窗抽核链接、日期与独立来源，记录人工分钟和费用；再做来源失败注入与覆盖矩阵读者对照，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1437 | — | — | 14702 |
| .js | source | 2 | 502 | 482 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/Jesseovo/last30days-skill-cn/issues) 查看。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查中文多源近期研究的处理链、覆盖边界与采用成本。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 主题研究与热榜适合哪些研究工作？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合中文内容、产品和研究人员先发现近期讨论线索，再沿原始链接核查。主题模式围绕查询与时间窗检索，热榜是采集时点的排名快照，两者不能互换。合格结果是带来源、时间和不可用平台说明的线索报告，不是全网舆论比例或事实真伪判定。原办法是在多个平台手动搜、去重和整理链接，本项目集中这些步骤并输出Markdown/JSON/HTML。作者明确来自last30days上游，本次只把中文来源适配与组织视作增量，不把整个研究范式算原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-56](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/README.md#L48-L56)

作者主题检索、多源与输出定位。

```text
## 带着问题来，带着线索走

想知道大家如何评价一个产品、一个话题最近发生了什么，或者今天有什么值得一看？last30days-cn 会检索近期讨论，按相关性、时效和互动排序，把同一件事在不同平台的声音放在一起，并保留原始链接。

**一个话题，一份研究。** 微博、小红书、B站、知乎、抖音、微信公众号、百度、今日头条，默认覆盖 8 个中文平台。可按需加入 Hacker News、GitHub 和 Reddit，或通过上游 skill 扩展更多海外来源。

**一次打开，看见今天。** [全网热榜](https://jesseovo.github.io/last30days-skill-cn/)聚合国内热搜、科技资讯和 Hacker News。搜索感兴趣的词，发现跨平台的「同频热点」，或者慢慢读完一个平台。

**每条结论，都能回到出处。** 输出精简证据、Markdown、JSON 和可离线打开的 HTML。拿到了多少、来自哪里、哪些平台暂时不可用，报告都会写清楚。
```

**依据 2 · 作者声明**：[README.md:75-85](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/README.md#L75-L85)

热榜与时间窗及公开搜索局限。

<details>
<summary>查看原文（11行）</summary>

```text
## 顺着线索，再走一会儿

热榜是当下的采集快照；主题研究会回看指定时间窗，两种模式可以接着用。

> 今天 AI 圈有什么热点？帮我挑 3 条值得关注的。
>
> 研究「AI 编程助手」最近 7 天的讨论，对比不同平台的评价，附上来源。
>
> 再补充 Hacker News、GitHub 和 Reddit 上的声音，生成可离线阅读的报告。

平台登录和接口可用性会影响覆盖范围。报告会区分登录态结果、热榜匹配与公开搜索；公开搜索缺少可靠的互动数据和精确日期，不能当作完整的平台样本。
```

</details>

**依据 3 · 作者声明**：[README.md:110-114](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/README.md#L110-L114)

上游与本土化归属。

```text
## 致谢与许可

基于 Matt Van Horn 的 [last30days-skill](https://github.com/mvanhorn/last30days-skill)，由 [Jesse](https://github.com/Jesseovo) 做中文本土化。感谢 [MediaCrawler](https://github.com/NanmiCoder/MediaCrawler) 的登录态思路、[xiaohongshu-mcp](https://github.com/xpzouying/xiaohongshu-mcp) 的可选服务，以及 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) 对研究报告视觉的启发。

[MIT License](LICENSE) · [使用约定](docs/usage.zh-CN.md#usage-terms)
```

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 来源失败、清洗与排序怎样进入报告？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

pipeline使用来源适配函数按配置传cookie/API或服务地址，各来源daemon线程独立取数并捕获异常，join以从统一started计算的deadline为界；超时结果明确标timeout而不是伪装零讨论。后处理依次normalize、日期过滤、评分、排序、去重、相关性过滤与作者上限，build_report跨源归并并保存每源state/count/raw_count/elapsed/via与error。这样一个平台失败不会使全部已得结果丢失，且读者可分辨采集路径。score显式加权相关性、时效与互动，公开搜索使用不同权重和惩罚；权重只是排序启发式，不是证据可信度概率。未读完所有适配器，不能声称每个平台降级路径都正常，也没实际登录或请求接口。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/pipeline.py:79-118](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L79-L118)

来源凭证与服务依赖。

<details>
<summary>查看原文（40行）</summary>

```text
def _search_weibo(ctx: RunContext) -> List[Dict[str, Any]]:
    return weibo.search_weibo(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        token=ctx.config.get("WEIBO_ACCESS_TOKEN"), cookie=ctx.config.get("WEIBO_COOKIE"),
    )


def _search_xiaohongshu(ctx: RunContext) -> List[Dict[str, Any]]:
    return xiaohongshu.search_xiaohongshu(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        token=ctx.config.get("SCRAPECREATORS_API_KEY"),
        api_base=env_mod.discover_xiaohongshu_mcp(ctx.config),
    )


def _search_bilibili(ctx: RunContext) -> List[Dict[str, Any]]:
    return bilibili.search_bilibili(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        cookie=ctx.config.get("BILIBILI_COOKIE"),
    )


def _search_zhihu(ctx: RunContext) -> List[Dict[str, Any]]:
    return zhihu.search_zhihu(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        cookie=ctx.config.get("ZHIHU_COOKIE"),
    )


def _search_douyin(ctx: RunContext) -> List[Dict[str, Any]]:
    return douyin.search_douyin(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        token=ctx.config.get("TIKHUB_API_KEY") or ctx.config.get("DOUYIN_API_KEY"),
    )


def _search_wechat(ctx: RunContext) -> List[Dict[str, Any]]:
    return wechat.search_wechat(
        ctx.search_topic, ctx.from_date, ctx.to_date, depth=ctx.depth,
        api_key=ctx.config.get("WECHAT_API_KEY"),
```

</details>

**依据 2 · 源码核查**：[scripts/lib/pipeline.py:235-298](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L235-L298)

来源线程、异常、deadline与via。

<details>
<summary>查看原文（64行）</summary>

```text
def run_sources(
    ctx: RunContext,
    active: Sequence[str],
    timeouts: Optional[Dict[str, int]] = None,
    log: bool = True,
) -> Dict[str, Dict[str, Any]]:
    """Run the selected sources in parallel with per-source deadlines."""
    timeouts = timeouts or TIMEOUT_PROFILES.get(ctx.depth, TIMEOUT_PROFILES["default"])
    boxes: Dict[str, Dict[str, Any]] = {}
    threads: Dict[str, threading.Thread] = {}
    started = time.monotonic()

    for sid in active:
        box: Dict[str, Any] = {}
        boxes[sid] = box
        if log:
            sys.stderr.write(f"[{sources.label(sid)}] 搜索中...\n")

        def worker(sid=sid, box=box):
            t0 = time.monotonic()
            try:
                box["items"] = SEARCHERS[sid](ctx) or []
                box["error"] = None
            except Exception as exc:  # each source fails independently
                box["items"] = []
                box["error"] = _friendly_error(exc)
            box["elapsed"] = round(time.monotonic() - t0, 1)
            if log:
                if box["error"]:
                    sys.stderr.write(f"[{sources.label(sid)}] 失败: {box['error']}\n")
                else:
                    sys.stderr.write(f"[{sources.label(sid)}] {len(box['items'])} 条原始结果（{box['elapsed']}s）\n")

        thread = threading.Thread(target=worker, name=f"last30days-{sid}", daemon=True)
        thread.start()
        threads[sid] = thread

    results: Dict[str, Dict[str, Any]] = {}
    for sid, thread in threads.items():
        limit = timeouts.get(f"{sid}_future", timeouts.get("future", 60))
        if sid == "upstream":
            limit = max(limit, ctx.upstream_timeout + 15)
        remaining = limit - (time.monotonic() - started)
        thread.join(max(0.0, remaining))
        box = boxes[sid]
        if thread.is_alive():
            results[sid] = {
                "items": [],
                "error": f"{sources.label(sid)} 搜索超时（{limit}s），已跳过",
                "state": "timeout",
                "elapsed": float(limit),
            }
            if log:
                sys.stderr.write(f"[{sources.label(sid)}] 超时 ({limit}s)，已跳过\n")
            continue
        items = box.get("items") or []
        error = box.get("error")
        results[sid] = {
            "items": items,
            "error": error,
            "state": "error" if error and not items else ("ok" if items else "empty"),
            "elapsed": box.get("elapsed"),
            "via": dict(Counter(str(item.get("source") or "api") for item in items if isinstance(item, dict))),
        }
```

</details>

**依据 3 · 源码核查**：[scripts/lib/pipeline.py:308-351](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L308-L351)

处理链与来源状态保留。

<details>
<summary>查看原文（44行）</summary>

```text
    query_type: str,
) -> Dict[str, List[Any]]:
    """Normalize → date filter → score → sort → dedupe → relevance gate → author cap."""
    processed: Dict[str, List[Any]] = {}
    for sid, result in raw_results.items():
        normalized = NORMALIZERS[sid](result.get("items") or [], from_date, to_date)
        windowed = normalize.filter_by_date_range(normalized, from_date, to_date)
        scored = SCORERS[sid](windowed, query_type)
        ordered = score.sort_items(scored, query_type=query_type)
        unique = dedupe.dedupe_items(ordered)
        relevant = score.relevance_filter(unique, sources.get(sid).code)
        processed[sid] = score.apply_per_author_cap(relevant)
    return processed


def build_report(
    topic: str,
    ctx: RunContext,
    raw_results: Dict[str, Dict[str, Any]],
    processed: Dict[str, List[Any]],
    query_type: str,
) -> schema.Report:
    lists = [processed.get(sid, []) for sid in sources.SOURCES if sid in processed]
    dedupe.cross_source_link(*lists, query=ctx.search_topic)
    clusters = cluster.build_clusters(*lists, query=ctx.search_topic)

    report = schema.create_report(topic, ctx.from_date, ctx.to_date, "all")
    report.search_topic = ctx.search_topic
    report.query_type = query_type
    report.depth = ctx.depth
    report.clusters = clusters
    for sid, items in processed.items():
        setattr(report, sid, items)
        result = raw_results.get(sid, {})
        setattr(report, f"{sid}_error", result.get("error"))
        report.source_status[sid] = {
            "state": result.get("state") if items or result.get("state") != "ok" else "empty",
            "count": len(items),
            "raw_count": len(result.get("items") or []),
            "elapsed": result.get("elapsed"),
            "via": result.get("via") or {},
        }
        if result.get("error"):
            report.source_status[sid]["error"] = result["error"]
```

</details>

**依据 4 · 源码核查**：[scripts/lib/score.py:16-31](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/score.py#L16-L31)

权重及无日期/未知互动的处理参数。

<details>
<summary>查看原文（16行）</summary>

```text
WEIGHT_RELEVANCE = 0.45
WEIGHT_RECENCY = 0.25
WEIGHT_ENGAGEMENT = 0.30

WEBSEARCH_WEIGHT_RELEVANCE = 0.55
WEBSEARCH_WEIGHT_RECENCY = 0.45
WEBSEARCH_SOURCE_PENALTY = 15

WEBSEARCH_VERIFIED_BONUS = 10
WEBSEARCH_NO_DATE_PENALTY = 20

DEFAULT_ENGAGEMENT = 35
UNKNOWN_ENGAGEMENT_PENALTY = 3

# Below this, an item is noise even when the source returned nothing better.
HARD_RELEVANCE_FLOOR = 0.1
```

</details>

#### 缺口

- 没有实际接口、登录态与报告执行
  **影响**：平台实时可用性与真实覆盖未知
  **进一步探讨**：先diagnose，再固定主题检查每源状态与原始链接，不把失败样本纳入平台比较

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 跨平台聚合能否被视为全网观点分布？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献在中文平台适配、统一处理链与来源质量可见性，相对人工多页检索有组织性增量，但没有概率抽样或去机器人、身份独立性证明。登录态搜索、热榜匹配与公开搜索得到的是不同样本，日期和互动缺失会改变排序，即使权重一致也不能消除选择偏差。一个话题多个平台都出现可能来自同一转载源，跨源聚类不是独立证据计数。最强反例是仅可用平台都在推荐同一营销内容，报告仍可能有完整链接和高互动，却不代表普通用户总体意见。应报告“本轮拿到的讨论”并回看关键原文，不能以样本量或热度证明结论真实。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/pipeline.py:323-351](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L323-L351)

来源状态和聚类支持覆盖披露，不提供抽样代表性保证。

<details>
<summary>查看原文（29行）</summary>

```text
def build_report(
    topic: str,
    ctx: RunContext,
    raw_results: Dict[str, Dict[str, Any]],
    processed: Dict[str, List[Any]],
    query_type: str,
) -> schema.Report:
    lists = [processed.get(sid, []) for sid in sources.SOURCES if sid in processed]
    dedupe.cross_source_link(*lists, query=ctx.search_topic)
    clusters = cluster.build_clusters(*lists, query=ctx.search_topic)

    report = schema.create_report(topic, ctx.from_date, ctx.to_date, "all")
    report.search_topic = ctx.search_topic
    report.query_type = query_type
    report.depth = ctx.depth
    report.clusters = clusters
    for sid, items in processed.items():
        setattr(report, sid, items)
        result = raw_results.get(sid, {})
        setattr(report, f"{sid}_error", result.get("error"))
        report.source_status[sid] = {
            "state": result.get("state") if items or result.get("state") != "ok" else "empty",
            "count": len(items),
            "raw_count": len(result.get("items") or []),
            "elapsed": result.get("elapsed"),
            "via": result.get("via") or {},
        }
        if result.get("error"):
            report.source_status[sid]["error"] = result["error"]
```

</details>

**依据 2 · 源码核查**：[scripts/lib/score.py:16-31](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/score.py#L16-L31)

相关性/时效/互动启发式不等于真实性。

<details>
<summary>查看原文（16行）</summary>

```text
WEIGHT_RELEVANCE = 0.45
WEIGHT_RECENCY = 0.25
WEIGHT_ENGAGEMENT = 0.30

WEBSEARCH_WEIGHT_RELEVANCE = 0.55
WEBSEARCH_WEIGHT_RECENCY = 0.45
WEBSEARCH_SOURCE_PENALTY = 15

WEBSEARCH_VERIFIED_BONUS = 10
WEBSEARCH_NO_DATE_PENALTY = 20

DEFAULT_ENGAGEMENT = 35
UNKNOWN_ENGAGEMENT_PENALTY = 3

# Below this, an item is noise even when the source returned nothing better.
HARD_RELEVANCE_FLOOR = 0.1
```

</details>

**依据 3 · 作者声明**：[README.md:85-85](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/README.md#L85-L85)

作者明确公开搜索不能当完整平台样本。

```text
平台登录和接口可用性会影响覆盖范围。报告会区分登录态结果、热榜匹配与公开搜索；公开搜索缺少可靠的互动数据和精确日期，不能当作完整的平台样本。
```

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 登录维护、人工复核和失败恢复是否值得？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需宿主能执行Python、完整Skill脚本和可用数据源，登录或可选API由用户配置；持续需凭证维护、查询调整、原文复核与报告存储。现金取决于API、代理与模型使用，未采价格和调用量；人工包括错误源重试、日期核对与转载消歧，不能因为命令一行便认为成本为零。适合先用公开可访问来源做一个明确产品话题的探索性报告，并随机核对链接、日期和引用；输出覆盖薄、关键源失败或结论无法定位原文时停止作比较性结论，退回手工定向搜索。未执行故障恢复和覆盖评估，采用仅为受控线索试用。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:14-25](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/SKILL.md#L14-L25)

凭证与Python条件。

<details>
<summary>查看原文（12行）</summary>

```text
      optionalEnv:
        - WEIBO_COOKIE
        - ZHIHU_COOKIE
        - BILIBILI_COOKIE
        - TIKHUB_API_KEY
        - WECHAT_API_KEY
        - BAIDU_API_KEY
        - WEIBO_ACCESS_TOKEN
        - XIAOHONGSHU_API_BASE
        - GITHUB_TOKEN
      bins:
        - python3
```

</details>

**依据 2 · 源码核查**：[SKILL.md:49-61](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/SKILL.md#L49-L61)

证据和诊断模式约束。

<details>
<summary>查看原文（13行）</summary>

```text
## Core rule

Ground every claim in the returned evidence. Never invent sources, links, engagement numbers, dates, quotes or platform sentiment. When coverage is thin or a platform failed, say so plainly.

## 1. Pick the mode

| The user asks… | Run |
|---|---|
| About a topic / product / person / event | Topic research (section 2) |
| "今天/现在有什么热点", "热搜", "全网热榜", "trending" | Hot board: `--hot` (section 3) |
| Hot topics about one theme ("今天 AI 圈有什么热点") | `--hot "<关键词>"` |
| Overseas opinion too (Reddit / HN / GitHub / X / YouTube) | Add `--global --global-query "<English keywords>"` (section 4) |
| Something is broken / which platforms work | `--diagnose` (section 6) |
```

</details>

**依据 3 · 源码核查**：[scripts/lib/pipeline.py:280-298](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L280-L298)

超时与失败暴露，重试仍由使用者决定。

<details>
<summary>查看原文（19行）</summary>

```text
        if thread.is_alive():
            results[sid] = {
                "items": [],
                "error": f"{sources.label(sid)} 搜索超时（{limit}s），已跳过",
                "state": "timeout",
                "elapsed": float(limit),
            }
            if log:
                sys.stderr.write(f"[{sources.label(sid)}] 超时 ({limit}s)，已跳过\n")
            continue
        items = box.get("items") or []
        error = box.get("error")
        results[sid] = {
            "items": items,
            "error": error,
            "state": "error" if error and not items else ("ok" if items else "empty"),
            "elapsed": box.get("elapsed"),
            "via": dict(Counter(str(item.get("source") or "api") for item in items if isinstance(item, dict))),
        }
```

</details>

#### 缺口

- 无合格研究任务的费用、人工分钟与日期准确率
  **影响**：不能证明比手工检索更便宜或可靠
  **进一步探讨**：同题同窗记录采集费、核查分钟和有效独立来源数量

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 覆盖矩阵能否减少对平台比较的误读？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把每个平台的登录/公开路径、可用条数、日期完整性与同源转载比例放在结论旁，并在关键平台不满足最低覆盖时只输出线索，可降低读者把缺席当无讨论的误判。推导来自Q02已有source_status与Q03异质样本偏差，增量是结论生成的资格约束，非再增加数据源。最小验证给五个同题报告分别隐藏或展示矩阵，让三名目标读者判断可比较范围；记录错误推断与额外阅读时间。无误读改善或矩阵形成虚假确定性则停止；不把这个构想当已实现能力。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/pipeline.py:339-351](https://github.com/Jesseovo/last30days-skill-cn/blob/af785c682de2fb9192e495daf061308a7a6799ec/scripts/lib/pipeline.py#L339-L351)

source_status已有路径、数量与错误，可支持矩阵扩展。

<details>
<summary>查看原文（13行）</summary>

```text
    for sid, items in processed.items():
        setattr(report, sid, items)
        result = raw_results.get(sid, {})
        setattr(report, f"{sid}_error", result.get("error"))
        report.source_status[sid] = {
            "state": result.get("state") if items or result.get("state") != "ok" else "empty",
            "count": len(items),
            "raw_count": len(result.get("items") or []),
            "elapsed": result.get("elapsed"),
            "via": result.get("via") or {},
        }
        if result.get("error"):
            report.source_status[sid]["error"] = result["error"]
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
