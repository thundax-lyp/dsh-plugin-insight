# last30days-cn

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e0e4141](https://github.com/Jesseovo/last30days-skill-cn/tree/e0e41410de18466aceb505faee5ef998cacee1e8)

<!-- BEGIN META -->
[![GitHub ★ 2,044](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C044&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jesseovo/last30days-skill-cn)
<!-- END META -->

> **功能**：检索中文平台近期讨论与热榜，整理附原始来源的研究结果。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将中文来源及整理流程接入 DSH；真实覆盖和效率未知。

> **主要限制**：[Q03](#research-q03) 外层默认超时可能早于 deep 流程预算；来源缺失不能当作无讨论。

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
  - [Q01 · 哪些用户需要多平台近期研究，与手工搜索相比增加什么？](#detail-section-11)
  - [Q02 · 工具如何调用检索并处理来源失败？](#detail-section-12)
  - [Q03 · 超时与数据来源会怎样影响结论？](#detail-section-13)
  - [Q04 · 环境、凭据和强制安装有何成本与退出条件？](#detail-section-14)
  - [Q05 · 如何让读者区分来源缺失与无结果？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要查找中文平台近期讨论并复核原始出处的研究者。

手工逐平台搜索和记录，或直接调用上游研究 Skill。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 主题研究 | 汇总近期讨论 | 覆盖依赖来源和授权 |
| 热榜 | 返回榜单及链接 | 榜单不代表 30 天总量 |
| 排序与聚类 | 整理候选线索 | 不证明代表性或同一事件 |
| 安装 Skill | 将包内资源复制到技能目录 | 强制覆盖需审查和备份 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容 DSH、Node | 宿主调用需要 | 注册工具 | 无 DSH 工具 |
| Python 3.8+ | 检索脚本需要 | 运行管线 | 调用失败 |
| 网络和可用来源 | 采集需要 | 获取讨论 | 来源缺失 |
| Cookie 或 API 密钥 | 部分来源可选 | 授权或扩展数据 | 覆盖可能下降 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户选择平台与授权 | 保护凭据并确认范围 |
| 检索 | Agent 调用研究或热榜 | 查看超时及来源状态 |
| 复核 | 用户访问原始链接 | 核对日期、上下文及来源 |
| 整理 | 用户形成有条件结论 | 覆盖不足时明确缺口 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | Python、宿主与网络 | 配置来源及授权 | 兼容未知 |
| 持续 | 网络、可选 API 和模型 | 核对链接及样本 | 成本与耗时未知 |
| 故障 | 来源状态及安装备份 | 排障、重试和恢复 | 实际失败频率未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 多源入口 | DSH 调用与来源 registry | 各平台可用性 |
| 独立超时 | Python 线程和状态 | 具体网络耗时 |
| 排序聚类 | 处理代码 | 准确性与代表性 |

> **思考**：[Q03](#research-q03) 外层默认超时可能早于 deep 流程预算；来源缺失不能当作无讨论。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将中文来源及整理流程接入 DSH；真实覆盖和效率未知。

[Q02](#research-q02) 使用每源状态与处理流水线；[Q03](#research-q03) 外层超时与 deep 预算需要协调。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 外层默认超时可能早于 deep 流程预算；来源缺失不能当作无讨论。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在授权范围内选公开来源并检查状态和原文；覆盖不足时停止总体结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本静态核查；未执行程序、访问来源或验证平台授权。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、skills/last30days/scripts/lib/pipeline.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH 工具接线、Python 并发与处理、超时预算及 Skill 安装；未审计全部来源适配器和平台隐私行为。
- 下一步：对固定话题核查来源状态、超时、原始链接、排序和取消；本轮未执行。

**分析版本**

- **仓库**：[Jesseovo/last30days-skill-cn](https://github.com/Jesseovo/last30days-skill-cn)
- **版本号**：4.0.0（[固定提交 e0e4141](https://github.com/Jesseovo/last30days-skill-cn/tree/e0e41410de18466aceb505faee5ef998cacee1e8)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议将来源状态与结论影响关联，需检验是否改变读者判断。

对固定话题核查来源状态、超时、原始链接、排序和取消；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1437 | — | — | 14702 |
| .js | source | 3 | 837 | 781 | 27 | — |
| .mjs | test | 1 | 150 | 147 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/Jesseovo/last30days-skill-cn/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 接线、多源处理及覆盖与运行成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户需要多平台近期研究，与手工搜索相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要梳理中文互联网近期话题的研究者，作者描述按相关、时效、互动排序并保留来源。用户也能手工逐平台搜索和记录；该项目将多个数据来源与研究输出组织到一条流程，并将能力接入 DSH。登录、平台可用性和搜索回退决定实际覆盖，不能把返回样本当全部平台舆情。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-56](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/README.md#L38-L56)

作者描述目标、平台和输出。

<details>
<summary>查看原文（19行）</summary>

````text
## 把好奇心交给 Agent

复制这句话，发给你正在使用的 AI Agent：

```text
帮我安装并配置 last30days-cn（https://github.com/Jesseovo/last30days-skill-cn），检查可用数据源，然后查看今天的全网热榜。
```

支持 Claude Code、Codex、Cursor、Gemini CLI 等具备命令行执行能力的 Agent。安装、环境检查和运行都交给它；需要你登录的平台，它会提示你完成。

## 带着问题来，带着线索走

想知道大家如何评价一个产品、一个话题最近发生了什么，或者今天有什么值得一看？last30days-cn 会检索近期讨论，按相关性、时效和互动排序，把同一件事在不同平台的声音放在一起，并保留原始链接。

**一个话题，一份研究。** 微博、小红书、B站、知乎、抖音、微信公众号、百度、今日头条，默认覆盖 8 个中文平台。可按需加入 Hacker News、GitHub 和 Reddit，或通过上游 skill 扩展更多海外来源。

**一次打开，看见今天。** [全网热榜](https://jesseovo.github.io/last30days-skill-cn/)聚合国内热搜、科技资讯和 Hacker News。搜索感兴趣的词，发现跨平台的「同频热点」，或者慢慢读完一个平台。

**每条结论，都能回到出处。** 输出精简证据、Markdown、JSON 和可离线打开的 HTML。拿到了多少、来自哪里、哪些平台暂时不可用，报告都会写清楚。
````

</details>

**依据 2 · 作者声明**：[README.md:75-85](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/README.md#L75-L85)

时间窗与覆盖限制。

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

**依据 3 · 源码核查**：[index.js:130-181](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L130-L181)

DSH 研究工具与参数。

<details>
<summary>查看原文（52行）</summary>

```text
function registerTools(ctx) {
  const tools = ctx.get ? ctx.get('tools') : ctx.tools
  if (!tools || typeof tools.register !== 'function') return []

  const disposers = []

  disposers.push(
    tools.register({
      name: 'last30days_research',
      description:
        '检索中国主流平台（微博、小红书、B站、知乎、抖音、微信公众号、百度、今日头条）最近 N 天关于某个主题的真实讨论，按相关度/时效/互动加权排序并跨平台聚类，返回附原始来源的报告。也可用 --global 追加 Hacker News / GitHub / Reddit 等海外来源。',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: '要研究的主题，中文自然语言即可，例如「AI 编程助手」。' },
          days: { type: 'integer', description: '回溯天数，1–30，默认 30。' },
          mode: {
            type: 'string',
            enum: ['default', 'quick', 'deep'],
            description: 'quick 更快（按问题类型挑选平台），deep 每平台抓更多页，默认 default。',
          },
          sources: {
            type: 'string',
            description: '逗号分隔的平台子集，例如 "bilibili,zhihu,xhs"；留空表示默认 8 个平台。',
          },
          global: { type: 'boolean', description: '同时检索海外来源（Hacker News / GitHub / Reddit）。' },
          emit: {
            type: 'string',
            enum: ['json', 'compact', 'md', 'html-path'],
            description: '输出格式：json 结构化结果（默认）、compact 精简文本、md Markdown、html-path 离线 HTML 报告路径。',
          },
          timeoutMs: { type: 'number', description: '命令超时毫秒数，默认 300000。' },
        },
        required: ['topic'],
        additionalProperties: false,
      },
      output: outputSpec,
      async execute(args = {}, exec = {}) {
        const topic = String(args.topic || '').trim()
        if (!topic) return { ok: false, error: 'topic 不能为空' }
        const error = validateArgs(args)
        if (error) return { ok: false, error }
        const emit = args.emit || 'json'
        const argv = ['--literal-topic', '--emit', emit]
        if (args.days !== undefined) argv.push('--days', String(args.days))
        if (args.mode === 'quick') argv.push('--quick')
        if (args.mode === 'deep') argv.push('--deep')
        if (args.sources) argv.push('--search', String(args.sources))
        if (args.global) argv.push('--global')
        argv.push('--', topic)

        const res = await runCli(argv, args.timeoutMs ?? DEFAULT_TIMEOUT, exec.signal)
```

</details>

#### 缺口

- 缺少人工对照和样本覆盖实测
  **影响**：无法量化节省时间和代表性
  **进一步探讨**：按相同主题比较手工检索、来源缺失和可复核比例。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何调用检索并处理来源失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH 注册 research 和 hot 工具，校验参数后使用 execFile 调用随包 Python，不通过 shell 拼接主题；超时和取消信号传给子进程。Python 研究管线按来源并发启动线程，超时记录 timeout 并丢弃该来源结果；后处理按来源归一化、日期过滤、评分、去重和相关过滤，跨来源建立关联与聚类。守护线程超时后并非立即被终止；未实测具体平台协议。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:78-105](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L78-L105)

子进程、超时与错误返回。

<details>
<summary>查看原文（28行）</summary>

```text
async function runCli(args, timeoutMs, signal) {
  try {
    const { bin, prefix } = await resolvePython(signal)
    if (!fs.existsSync(SCRIPT)) {
      throw new Error(`技能脚本缺失：${SCRIPT}。请确认包完整（skills/last30days/scripts）。`)
    }
    const env = {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1',
    }
    const { stdout, stderr } = await execFileAsync(bin, [...prefix, SCRIPT, ...args], {
      cwd: SKILL_DIR,
      encoding: 'utf8',
      timeout: timeoutMs,
      signal,
      maxBuffer: 64 * 1024 * 1024,
      env,
      windowsHide: true,
    })
    return { ok: true, stdout, stderr }
  } catch (error) {
    return {
      ok: false,
      stdout: String(error.stdout || ''),
      stderr: String(error.stderr || error.message || error),
    }
  }
```

</details>

**依据 2 · 源码核查**：[index.js:167-190](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L167-L190)

研究参数与 JSON 结果处理。

<details>
<summary>查看原文（24行）</summary>

```text
      async execute(args = {}, exec = {}) {
        const topic = String(args.topic || '').trim()
        if (!topic) return { ok: false, error: 'topic 不能为空' }
        const error = validateArgs(args)
        if (error) return { ok: false, error }
        const emit = args.emit || 'json'
        const argv = ['--literal-topic', '--emit', emit]
        if (args.days !== undefined) argv.push('--days', String(args.days))
        if (args.mode === 'quick') argv.push('--quick')
        if (args.mode === 'deep') argv.push('--deep')
        if (args.sources) argv.push('--search', String(args.sources))
        if (args.global) argv.push('--global')
        argv.push('--', topic)

        const res = await runCli(argv, args.timeoutMs ?? DEFAULT_TIMEOUT, exec.signal)
        if (emit === 'json') {
          const data = extractJson(res.stdout)
          if (data) return { ...data, ok: res.ok, ...(res.ok ? {} : { stderr: tail(res.stderr) }) }
          return {
            ok: false,
            error: res.ok ? '未能解析 JSON 输出' : '研究命令执行失败',
            stderr: tail(res.stderr),
            stdout: tail(res.stdout, 4000),
          }
```

</details>

**依据 3 · 源码核查**：[skills/last30days/scripts/lib/pipeline.py:240-301](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/skills/last30days/scripts/lib/pipeline.py#L240-L301)

每源并发、超时和状态。

<details>
<summary>查看原文（62行）</summary>

```text
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
    if log:
        sys.stderr.flush()
    return results
```

</details>

**依据 4 · 源码核查**：[skills/last30days/scripts/lib/pipeline.py:304-332](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/skills/last30days/scripts/lib/pipeline.py#L304-L332)

处理顺序和跨源聚类。

<details>
<summary>查看原文（29行）</summary>

```text
def process_results(
    raw_results: Dict[str, Dict[str, Any]],
    from_date: str,
    to_date: str,
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
```

</details>

#### 缺口

- 未请求任何平台或运行管线
  **影响**：无法判断实时可用性、完整性及正确率
  **进一步探讨**：固定主题在隔离环境核对每源状态、结果与原文。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时与数据来源会怎样影响结论？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

默认 DSH 研究调用总超时为 300 秒，而 Python deep 模式声明全局 420 秒，上游来源可配置更长等待；因此默认外层可能先终止深度任务，需由调用者显式调整 timeoutMs。README 承认公开搜索缺可靠互动和精确日期、登录态与接口影响覆盖；单源超时显示失败或空结果，不能解释成没有讨论，也不保证跨平台聚类就是同一事件。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:27-27](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L27-L27)

DSH 默认超时 300 秒。

```text
const DEFAULT_TIMEOUT = 300000
```

**依据 2 · 源码核查**：[index.js:167-181](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L167-L181)

deep 模式与调用超时参数。

<details>
<summary>查看原文（15行）</summary>

```text
      async execute(args = {}, exec = {}) {
        const topic = String(args.topic || '').trim()
        if (!topic) return { ok: false, error: 'topic 不能为空' }
        const error = validateArgs(args)
        if (error) return { ok: false, error }
        const emit = args.emit || 'json'
        const argv = ['--literal-topic', '--emit', emit]
        if (args.days !== undefined) argv.push('--days', String(args.days))
        if (args.mode === 'quick') argv.push('--quick')
        if (args.mode === 'deep') argv.push('--deep')
        if (args.sources) argv.push('--search', String(args.sources))
        if (args.global) argv.push('--global')
        argv.push('--', topic)

        const res = await runCli(argv, args.timeoutMs ?? DEFAULT_TIMEOUT, exec.signal)
```

</details>

**依据 3 · 源码核查**：[skills/last30days/scripts/lib/pipeline.py:42-60](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/skills/last30days/scripts/lib/pipeline.py#L42-L60)

不同深度和来源的时间预算。

<details>
<summary>查看原文（19行）</summary>

```text
TIMEOUT_PROFILES: Dict[str, Dict[str, int]] = {
    "quick": {
        "global": 120, "future": 30, "weibo_future": 30, "bilibili_future": 30, "zhihu_future": 30,
        "douyin_future": 45, "xiaohongshu_future": 45, "wechat_future": 25, "baidu_future": 25,
        "toutiao_future": 30, "hackernews_future": 20, "github_future": 25, "reddit_future": 20,
        "upstream_future": 240, "http": 15,
    },
    "default": {
        "global": 240, "future": 60, "weibo_future": 75, "bilibili_future": 60, "zhihu_future": 75,
        "douyin_future": 90, "xiaohongshu_future": 90, "wechat_future": 45, "baidu_future": 45,
        "toutiao_future": 45, "hackernews_future": 25, "github_future": 30, "reddit_future": 25,
        "upstream_future": 360, "http": 30,
    },
    "deep": {
        "global": 420, "future": 90, "weibo_future": 120, "bilibili_future": 90, "zhihu_future": 120,
        "douyin_future": 150, "xiaohongshu_future": 150, "wechat_future": 75, "baidu_future": 75,
        "toutiao_future": 75, "hackernews_future": 40, "github_future": 45, "reddit_future": 40,
        "upstream_future": 600, "http": 30,
    },
```

</details>

**依据 4 · 作者声明**：[README.md:77-85](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/README.md#L77-L85)

公开搜索和覆盖边界。

```text
热榜是当下的采集快照；主题研究会回看指定时间窗，两种模式可以接着用。

> 今天 AI 圈有什么热点？帮我挑 3 条值得关注的。
>
> 研究「AI 编程助手」最近 7 天的讨论，对比不同平台的评价，附上来源。
>
> 再补充 Hacker News、GitHub 和 Reddit 上的声音，生成可离线阅读的报告。

平台登录和接口可用性会影响覆盖范围。报告会区分登录态结果、热榜匹配与公开搜索；公开搜索缺少可靠的互动数据和精确日期，不能当作完整的平台样本。
```

#### 缺口

- 未实测 timeoutMs、上游与具体来源的组合
  **影响**：无法估计截断或等待频率
  **进一步探讨**：构造延迟来源，比较 deep 默认和显式超时的结果状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 环境、凭据和强制安装有何成本与退出条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

包声明 Node 与 DSH 版本，实际研究工具另需 Python 3.8+ 和网络，若使用某些来源还依赖 cookie 或 API 密钥。默认安装 Skill 时遇已有目录不覆盖；force 会先将旧目录移入 staging，替换失败时尝试恢复，回滚失败则保留备份。用户仍需管理凭据、审核来源与相关性、处理数据和模型费用；凭据保护和平台条款须自行核查。先观察匿名公开源，来源不可核对或授权不足时停止。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-30](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/package.json#L24-L30)

DSH 版本与 bundle。

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 2 · 源码核查**：[index.js:30-53](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L30-L53)

Python 版本探测。

<details>
<summary>查看原文（24行）</summary>

```text
/** 依次尝试 python3 / python / py -3，返回可用的解释器与前置参数。 */
async function resolvePython(signal) {
  if (pythonCache) return pythonCache
  const forced = process.env.LAST30DAYS_PYTHON || process.env.PYTHON
  const candidates = forced
    ? [[forced, []]]
    : [
        ['python3', []],
        ['python', []],
        ['py', ['-3']],
      ]
  for (const [bin, prefix] of candidates) {
    try {
      await execFileAsync(bin, [...prefix, '-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)'], { timeout: 20000, signal })
      pythonCache = { bin, prefix }
      return pythonCache
    } catch {
      signal?.throwIfAborted()
      /* 试下一个 */
    }
  }
  throw new Error(
    '找不到 Python 3.8+。请安装 Python 3.8+ 并确保 python / python3 在 PATH 中，或用 LAST30DAYS_PYTHON 指定解释器路径。',
  )
```

</details>

**依据 3 · 源码核查**：[index.js:259-311](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/index.js#L259-L311)

技能安装、强制覆盖和失败恢复。

<details>
<summary>查看原文（53行）</summary>

```text
    tools.register({
      name: 'last30days_install_skill',
      description:
        '把随包的 last30days-cn 技能安装到 ~/.dsh/skills（或 DSH_SKILLS_DIR），让它出现在 DSH 的技能目录里，可通过 /last30days-cn 或自然语言调用。幂等，默认不覆盖已存在的安装。',
      parameters: {
        type: 'object',
        properties: {
          force: { type: 'boolean', description: '覆盖已存在的安装。' },
        },
        additionalProperties: false,
      },
      output: outputSpec,
      async execute(args = {}) {
        const base = path.resolve(process.env.DSH_SKILLS_DIR || path.join(os.homedir(), '.dsh', 'skills'))
        const dest = path.join(base, SKILL_NAME)
        let staging
        let backup
        try {
          if (args.force !== undefined && typeof args.force !== 'boolean') throw new Error('force 必须是布尔值')
          if (!fs.existsSync(path.join(SKILL_DIR, 'SKILL.md'))) throw new Error(`随包技能目录缺失：${SKILL_DIR}`)
          const existing = fs.lstatSync(dest, { throwIfNoEntry: false })
          if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) throw new Error('安装目标必须是普通目录，不能是文件或符号链接')
          if (existing && !args.force) {
            return { ok: true, installed: false, path: dest, note: '已安装；需要覆盖请传 force=true' }
          }
          fs.mkdirSync(base, { recursive: true })
          staging = fs.mkdtempSync(path.join(base, '.last30days-stage-'))
          const payload = path.join(staging, 'payload')
          fs.cpSync(SKILL_DIR, payload, { recursive: true })
          // Stage the complete payload before moving an existing installation.
          if (existing) {
            const previous = path.join(staging, 'previous')
            fs.renameSync(dest, previous)
            backup = previous
          }
          try {
            fs.renameSync(payload, dest)
          } catch (error) {
            if (backup) {
              fs.renameSync(backup, dest)
              backup = undefined
            }
            throw error
          }
          backup = undefined
          return { ok: true, installed: true, path: dest, note: '重启 DSH 或重新加载技能后可见' }
        } catch (error) {
          return { ok: false, error: error.message, ...(backup ? { backup } : {}) }
        } finally {
          // Keep the backup for recovery if rollback itself failed.
          if (staging && !backup) {
            try { fs.rmSync(staging, { recursive: true, force: true }) } catch { /* best-effort cleanup */ }
          }
```

</details>

**依据 4 · 源码核查**：[skills/last30days/scripts/lib/pipeline.py:79-118](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/skills/last30days/scripts/lib/pipeline.py#L79-L118)

不同来源的 cookie 和 API 配置。

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

#### 缺口

- 未核验各来源网络、实际费用或恢复
  **影响**：无法保证授权和完整覆盖
  **进一步探讨**：用单独账户检查来源权限和报告，演练备份恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让读者区分来源缺失与无结果？

**研究主题**：新假设与验证

#### 完整回答

现有管线区分 timeout、error、empty 和 ok，可探索在结论旁标明每源采集状态与缺失对比较的影响，并限制不完整来源的总体舆情措辞。此为待验证改进，需与已有来源状态展示对照，不应声称它尚未显示状态；比较读者识别覆盖缺口的准确率、阅读时间和误解率，未改善或造成明显负担则否定。

#### 证据与依据

**依据 1 · 源码核查**：[skills/last30days/scripts/lib/pipeline.py:272-297](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/skills/last30days/scripts/lib/pipeline.py#L272-L297)

状态区分。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 2 · 作者声明**：[README.md:50-56](https://github.com/Jesseovo/last30days-skill-cn/blob/e0e41410de18466aceb505faee5ef998cacee1e8/README.md#L50-L56)

作者声称报告显示来源及不可用情况。

```text
想知道大家如何评价一个产品、一个话题最近发生了什么，或者今天有什么值得一看？last30days-cn 会检索近期讨论，按相关性、时效和互动排序，把同一件事在不同平台的声音放在一起，并保留原始链接。

**一个话题，一份研究。** 微博、小红书、B站、知乎、抖音、微信公众号、百度、今日头条，默认覆盖 8 个中文平台。可按需加入 Hacker News、GitHub 和 Reddit，或通过上游 skill 扩展更多海外来源。

**一次打开，看见今天。** [全网热榜](https://jesseovo.github.io/last30days-skill-cn/)聚合国内热搜、科技资讯和 Hacker News。搜索感兴趣的词，发现跨平台的「同频热点」，或者慢慢读完一个平台。

**每条结论，都能回到出处。** 输出精简证据、Markdown、JSON 和可离线打开的 HTML。拿到了多少、来自哪里、哪些平台暂时不可用，报告都会写清楚。
```

#### 缺口

- 读者理解和提示效果缺少证据
  **影响**：无法证明改进降低误判
  **进一步探讨**：用包含超时、空结果的合成报告做盲测。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
