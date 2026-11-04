# Tokdash

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f0868fe](https://github.com/JingbiaoMei/Tokdash/tree/f0868fe1b745a4d13eacc63dc479edb29e238f8e)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JingbiaoMei/Tokdash)
<!-- END META -->

> **功能**：本地 AI 编码工具用量与费用看板，汇总会话、模型、缓存用量及使用报告。

> **亮点**：[Q01](#research-q01) 和[Q02](#research-q02) 将异构工具日志归一并处理DSH重试、压缩和副本，贡献在计数语义和使用回顾；宿主用量与价格来源不归本工具原创。

> **主要限制**：[Q03](#research-q03) 缺失帧无法还原，未知价格计算可返回零，图表金额因此不等于实际账单，必须核对覆盖和模型映射。

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
  - [Q01 · Tokdash 怎样把 DSH 使用日志变成可比较的本地统计？](#detail-section-11)
  - [Q02 · 重试、重复文件和损坏日志怎样影响计数可信度？](#detail-section-12)
  - [Q03 · 本地与费用边界是什么，能否直接作为报销账本？](#detail-section-13)
  - [Q04 · 谁值得试用，以及怎样使缺失数据更可见？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Tokdash 是独立的本地用量与费用看板，适合需要按工具、模型或会话回顾AI编码使用情况的人。DSH输入来自会话事件日志，DSHParser实际调用共享解码和用量折叠模块，再把输入、输出、缓存用量及模型映射成条目，并由价格库计算估算费用。相比人工逐份翻日志或把所有usage事件直接相加，它提供统一条目与界面；日志本身的用量记录仍来自宿主，价格来自本地数据库，不是从供应商账单取回的实际扣费。合格结果应是与一组可核对日志的计数一致，而不是看到图表即视为财务准确。

基线为手工读取原始日志和直接累加usage事件，不与供应商账单或未核查竞品作效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH日志归一 | 汇总输入、输出、缓存用量 | 支持格式0/3/4；损坏帧会缺失 |
| 重试与副本折叠 | 减少重复统计并保留尝试开销 | 依赖日志事件语义与稳定会话身份 |
| 本地价格估算 | 回顾模型使用成本 | 缺价格可为零，不能当账单 |
| 本地看板 | 对比工具与会话 | 远程暴露另需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python>=3.10及包依赖 | 必需 | 服务与解码 | 不能按声明运行 |
| 可读且受支持的宿主日志 | 统计必需 | 提取用量 | 跳过或记录诊断，不当零使用 |
| 正确的模型价格映射 | 金额解释必需 | 计算估算成本 | 不用金额作扣费结论 |
| 本地受控网络入口 | 本地试用条件 | 保护用量与会话信息 | 不扩大到未验收远程暴露 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户保存固定日志副本并配置路径 | 样本可人工核对 |
| 加载 | 本地Python服务扫描解析 | 诊断没有未解释的遗漏 |
| 统计 | 折叠尝试、跨文件去重及估价 | 与人工样本计数一致 |
| 验收 | 用户核对模型价格和供应商账单 | 差异未解释时停止财务判断 |
| 退出 | 停服务并按明确范围清理派生数据 | 原宿主日志保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机扫描与存储量未知 | 配路径、核对样本耗时未知 | 需可读会话日志 |
| 持续使用 | 缓存、服务CPU与内存未测 | 维护价格与格式映射 | 金额不是实际账单 |
| 失败恢复 | 重解析资源未知 | 检查坏帧、缺失模型和诊断 | 缺失原始行无法靠缓存复原 |
| 退出 | 派生数据备份空间未知 | 停服务、保留原日志 | 远程入口需另行收回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH计数 | 按尝试折叠并跨副本去重 | 全部宿主版本及真实日志完整率 |
| 金额回顾 | 使用本地价格计算 | 实际扣费、节时与财务准确性 |

> **思考**：[Q03](#research-q03) 缺失帧无法还原，未知价格计算可返回零，图表金额因此不等于实际账单，必须核对覆盖和模型映射。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和[Q02](#research-q02) 将异构工具日志归一并处理DSH重试、压缩和副本，贡献在计数语义和使用回顾；宿主用量与价格来源不归本工具原创。

[Q02](#research-q02) 共用解码、稳定条目键和版本化解析签名防止视图口径漂移；将价格与内容身份作为一个快照发布的方式可复用，但大源解析模块和宿主格式适配会带来维护负担。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 缺失帧无法还原，未知价格计算可返回零，图表金额因此不等于实际账单，必须核对覆盖和模型映射。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定个人本地使用回顾，先人工核对一个会话；价格或日志缺口出现即暂停金额判断。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持计数语义与局部防护判断；账单准确性、跨版本兼容和节时尚未实测，覆盖提示为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/tokdash/sources/coding_tools.py、src/tokdash/sources/dsh_log.py、src/tokdash/pricing.py、src/tokdash/api.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查DSH解析、共享折叠、价格计算与API局部写保护，未覆盖全部来源、远程更新认证或整个看板安全面。
- 下一步：未执行目标代码、安装或测试，无真实账单和宿主验收。后续固定日志核对不等同于已完成。

**分析版本**

- **仓库**：[JingbiaoMei/Tokdash](https://github.com/JingbiaoMei/Tokdash)
- **版本号**：2.7.1（pyproject.toml 声明；未核实发布包）（[固定提交 f0868fe](https://github.com/JingbiaoMei/Tokdash/tree/f0868fe1b745a4d13eacc63dc479edb29e238f8e)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 给总计附带来源和价格覆盖状态，可能降低把缺失当作零费用的误判；需用户任务对照验证。

未执行目标代码、安装或测试，无真实账单和宿主验收。后续固定日志核对不等同于已完成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 51 | 16382 | — | — | 172668 |
| .js | source | 15 | 1486 | 1161 | 177 | — |
| .md | example | 1 | 22 | — | — | 196 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/JingbiaoMei/Tokdash/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/JingbiaoMei/Tokdash/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/JingbiaoMei/Tokdash/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Tokdash 的 DSH 日志统计能否支持可解释的个人使用回顾？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Tokdash 怎样把 DSH 使用日志变成可比较的本地统计？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Tokdash 是独立的本地用量与费用看板，适合需要按工具、模型或会话回顾AI编码使用情况的人。DSH输入来自会话事件日志，DSHParser实际调用共享解码和用量折叠模块，再把输入、输出、缓存用量及模型映射成条目，并由价格库计算估算费用。相比人工逐份翻日志或把所有usage事件直接相加，它提供统一条目与界面；日志本身的用量记录仍来自宿主，价格来自本地数据库，不是从供应商账单取回的实际扣费。合格结果应是与一组可核对日志的计数一致，而不是看到图表即视为财务准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:107-112](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/README.md#L107-L112)

作者将其定位为本地FastAPI看板

```text
### WebUI

The dashboard is a single page served by the local FastAPI app: exact input /
cache / output token breakdowns, per-tool and per-model tables, a contribution
heatmap, a week/month/year **Report**, per-provider **Quota** windows with reset
countdowns, and a **Servers** tab that combines and compares several machines.
```

**依据 2 · 源码核查**：[src/tokdash/sources/coding_tools.py:5961-5999](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/coding_tools.py#L5961-L5999)

实际将折叠样本映射成统计条目并调用价格库

<details>
<summary>查看原文（39行）</summary>

```text
    def _entries_for_decoded(self, path_str: str, decoded: Any) -> List[Dict[str, Any]]:
        """Fold one decoded log into usage entries.

        Shared by the live ``_parse_all`` and the stored ``_parse_file_strict`` so
        the two surfaces can never bill one file differently.
        """
        session_id = str(decoded.header.get("id") or Path(path_str).parent.name)
        entries: List[Dict[str, Any]] = []
        for sample in fold_dsh_usage_samples(decoded.header, decoded.events):
            model = sample["model"]
            input_t = sample["input"]
            output_t = sample["output"]
            cache_r = sample["cache_read"]
            cache_w = sample["cache_write"]
            entries.append(
                {
                    "source": self.source_name,
                    "model": model,
                    "provider": sample["provider"],
                    "input": input_t,
                    "output": output_t,
                    "cacheRead": cache_r,
                    "cacheWrite": cache_w,
                    "reasoning": 0,
                    "cost": self.pricing_db.get_cost(model, input_t, output_t, cache_r, cache_w),
                    "timestamp": int(sample["timestamp_ms"]),
                    "entry_id": dsh_sample_entry_id(session_id, sample),
                    "_session_id": session_id,
                    **({"_speed": sample["_speed"]} if "_speed" in sample else {}),
                    "_billing": usage_billing_pricing(
                        [model],
                        input_tokens=input_t,
                        output_tokens=output_t,
                        cache_read=cache_r,
                        cache_write=cache_w,
                    ),
                }
            )
        return entries
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 重试、重复文件和损坏日志怎样影响计数可信度？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

固定实现不是简单累加每一事件。折叠器在每个turn、step下推进retry-started的attempt序号，同一attempt的后续样本覆盖此前样本，并把压缩调用按时间另行记账；这样可以避免chunk与最终消息重复，同时保留重试开销。DSHParser又按稳定entry_id在重复物理文件间选最早位置，存储解析遇到无法读取的文件则抛专用异常，避免把读失败当作空文件删除历史。支持的格式代际固定为0、3、4；损坏压缩帧可跳过并报告，但跳过的行无法恢复，seed边界无法证明时不计费而非猜测。这些机制提高可解释性，却不证明任何新宿主格式、损坏日志或重复样本都得到完整账单。缓存签名包含解码/计数版本，价格状态与其内容签名原子发布的做法可借鉴；本次没有运行这些恢复或缓存用例。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokdash/sources/dsh_log.py:45-58](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/dsh_log.py#L45-L58)

支持格式范围

<details>
<summary>查看原文（14行）</summary>

```text
# Format generations Tokdash reads. A version outside this set is unsupported,
# not corrupt — the file is skipped, never treated as empty.
#
# 0 is the developer-preview layout. 4 is what dsh >= 0.2.0 writes
# (SESSION_FORMAT_VERSION in @deepseek-ai/dsh-session); its usage events keep
# the v0 shape (assistant/message with data.turn/step/data.usage), so the fold
# reads both. dsh names those files session.v4.jsonl[.zstd]; discovery matches
# them on the suffix. 3 is what earlier dsh builds left on disk: its
# header has the v4 key set, and dsh's own v3 reader cuts a seeded log at the
# final inherited end-seed marker exactly as v4 does, so the same fold and seed
# boundary apply (a real 24-log v3/v4 corpus decoded whole, #147). Generations
# 1-2 were superseded in place upstream and are not claimed here until a corpus
# proves the read.
SUPPORTED_SESSION_FORMAT_VERSIONS = frozenset({0, 3, 4})
```

</details>

**依据 2 · 源码核查**：[src/tokdash/sources/dsh_log.py:163-190](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/dsh_log.py#L163-L190)

帧损失与无法证明seed的告警

<details>
<summary>查看原文（28行）</summary>

```text
def report_dsh_decode(path: Any, decoded: "DSHDecodedSession") -> None:
    """Report everything one decode lost, identically for both surfaces.

    The usage parser and the Sessions panel decode the same file on their own
    schedules -- after a restart the persistent store re-reads only changed files,
    so the panel may be the only surface that ever sees an unchanged broken one.
    Each calls this, with one wording per problem, so the registry above names a
    file once no matter which surface read it, and neither can be the silent one.
    """
    if decoded.skip_reason is not None or decoded.header is None:
        report_dsh_diagnostic(path, f"skip:{decoded.skip_reason or 'missing-header'}")
        return
    recovered = True
    if decoded.failed_frames:
        recovered = False
        report_dsh_diagnostic(
            path,
            "frames-lost",
            f"{decoded.failed_frames} zstd frame(s) did not decode; their rows are missing",
        )
    if dsh_seed_boundary(decoded.header, decoded.events)[1]:
        recovered = False
        report_dsh_diagnostic(
            path,
            "seed-unprovable",
            "seeded session with no inherited session/end-seed marker; billing nothing "
            "rather than double-billing the parent's inherited prefix",
        )
```

</details>

**依据 3 · 源码核查**：[src/tokdash/sources/dsh_log.py:458-512](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/dsh_log.py#L458-L512)

重试序号与继承边界过滤

<details>
<summary>查看原文（55行）</summary>

```text
    seed_length, seed_unprovable = dsh_seed_boundary(header, events)
    # Insertion-ordered: a replaced key keeps the position of its first sighting,
    # so the emitted order stays the log's order rather than the fold's.
    from ..speed_mode import timing_enabled
    measure_speed = timing_enabled()
    if measure_speed:
        from ..output_speed_readers import dsh_stream_timing
        from ..output_speed import unmeasured, STATUS_RETRY_CONTAMINATED, STATUS_INCOMPLETE, STATUS_MISSING_TIMING

    samples: Dict[str, Dict[str, Any]] = {}
    streams = {}
    retry_steps = set()
    attempts: Dict[Tuple[int, int], int] = {}
    latest_model = ""
    latest_provider = ""

    for event in events:
        event_type = event.get("type")
        data = event.get("data") if isinstance(event.get("data"), dict) else {}

        if event_type == "request/context":
            model = str(data.get("model") or "").strip()
            if model:
                latest_model = model
            provider = str(data.get("provider") or "").strip()
            if provider:
                latest_provider = provider
            continue

        if event_type not in (
            "assistant/chunk", "assistant/message", "assistant/attempt",
            "compaction/summary", "llm/retry-started", "llm/retry",
            "text-chunks", "reasoning-chunks", "tool-call-chunks",
        ):
            continue

        # A forked child owns only events after its inherited prefix. Apply the
        # same boundary to retry markers and usage so inherited retries cannot
        # change the coordinates of the child's own calls.
        seq = _to_int(event.get("seq"))
        if seed_unprovable or (seed_length and (seq is None or seq < seed_length)):
            continue

        if measure_speed and event_type in ("llm/retry", "llm/retry-started"):
            retry_steps.add((_to_int(data.get("turn")), _to_int(data.get("step"))))
        if event_type == "llm/retry-started":
            turn = _to_int(data.get("turn"))
            step = _to_int(data.get("step"))
            if turn is not None and step is not None:
                key = (turn, step)
                attempts[key] = attempts.get(key, 0) + 1
            continue

        coordinates = (_to_int(data.get("turn")), _to_int(data.get("step")))
        stream_key = (*coordinates, attempts.get(coordinates, 0))
```

</details>

**依据 4 · 源码核查**：[src/tokdash/sources/dsh_log.py:596-635](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/dsh_log.py#L596-L635)

压缩/重试键及覆盖样本

<details>
<summary>查看原文（40行）</summary>

```text
        # A compaction call has no (turn, step); it is keyed on its own event time
        # so two physical copies of one session -- which share timestamps but may
        # not share dense seq positions across a format generation (upstream
        # renumbers those on conversion while preserving timestamps) -- land on
        # the same entry id and dedup under the earliest-(timestamp, path) rule.
        # The `c:` prefix also keeps the two key spaces disjoint so one map can
        # hold both: a loop-step key starts with a non-negative integer and can
        # never equal `c:<time_ms>`.
        entry_key = f"c:{timestamp_ms}" if is_compaction else f"{turn}:{step}"
        if not is_compaction:
            attempt = attempts.get((turn, step), 0)
            if attempt:
                # Retry ordinals survive format conversions that renumber seq.
                # Keep the original first-attempt id for sessions with no retry.
                entry_key += f":r:{attempt}"
        sample = {
            "turn": turn,
            "step": step,
            "entry_key": entry_key,
            "timestamp_ms": timestamp_ms,
            "model": model or "unknown",
            "provider": provider,
            "input": input_tokens,
            "output": output_tokens,
            "cache_read": cache_read,
            "cache_write": cache_write,
            # dsh outputTokens already includes reasoningTokens; reporting it
            # separately here would count those tokens twice downstream.
            "reasoning": 0,
        }
        if measure_speed:
            if is_compaction:
                speed = unmeasured(STATUS_MISSING_TIMING)
            elif event_type == "assistant/attempt":
                speed = unmeasured(STATUS_INCOMPLETE)
            else:
                stream = data.get("stream") if isinstance(data.get("stream"), list) else streams.get(stream_key)
                speed = dsh_stream_timing(stream, usage)
            sample["_speed"] = speed
        samples[entry_key] = sample
```

</details>

**依据 5 · 源码核查**：[src/tokdash/sources/coding_tools.py:6001-6051](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/coding_tools.py#L6001-L6051)

严格失败信号与重复文件去重

<details>
<summary>查看原文（51行）</summary>

```text
    def _parse_file_strict(self, file_sig: Tuple[str, int, int]) -> List[Dict[str, Any]]:
        """Strict single-file entry point for the stored sync.

        Raises UsageFileUnreadable / UsageFileVanished rather than returning []
        when the file yields nothing: under file_replace an empty list is an
        assertion that the file has zero entries, and the commit would delete the
        stored rows of a log that merely could not be decoded (corrupt frame, a
        header generation this build does not read). compute._collect_parser_file
        prefers this method when a parser defines it, so the signal reaches
        sync_files intact and the rows survive until the file reads again.
        """
        path_str = str(file_sig[0])
        decoded = decode_dsh_session_file(Path(path_str))
        # A file that yields no rows and one that yielded none because it could
        # not be read look identical downstream -- the whole of issue #147 -- so
        # every decode says what it lost, through the same reporter as Sessions.
        dsh_log_module.report_dsh_decode(path_str, decoded)
        if decoded.skip_reason is not None or decoded.header is None:
            if not Path(path_str).exists():
                raise UsageFileVanished(path_str)
            raise UsageFileUnreadable(path_str, decoded.skip_reason or "missing-header")
        return self._entries_for_decoded(path_str, decoded)

    def _parse_all(self) -> List[Dict[str, Any]]:
        # Keyed on the stable entry id so duplicate physical files for one
        # session id (both suffixes present, or one id under two project keys)
        # never bill twice. The winner is the EARLIEST (timestamp, file_path)
        # occurrence, ties breaking on the lexicographically smallest path -- the
        # same rule sync_files applies for cross_file_stable_keys sources and the
        # same one _merge_raw_session_sequence applies on the Sessions side, so
        # all three surfaces resolve a duplicate id to one winner no matter which
        # copy parses last. Parse order must not be an input to the answer.
        by_entry_id: Dict[str, Tuple[tuple, Dict[str, Any]]] = {}
        for path_str, _, _ in self._file_signatures():
            try:
                decoded = decode_dsh_session_file(Path(path_str))
                dsh_log_module.report_dsh_decode(path_str, decoded)
                if decoded.skip_reason is not None or decoded.header is None:
                    # The DB-off path keeps skipping (one unreadable log must not
                    # blank the source or land it in source_errors) but it no
                    # longer gets to be silent about it.
                    continue
                for entry in self._entries_for_decoded(path_str, decoded):
                    entry_id = entry["entry_id"]
                    position = (int(entry["timestamp"]), path_str)
                    previous = by_entry_id.get(entry_id)
                    if previous is None or position < previous[0]:
                        by_entry_id[entry_id] = (position, entry)
            except Exception:
                # One malformed file never blanks the whole DSH source.
                continue
```

</details>

**依据 6 · 源码核查**：[src/tokdash/pricing.py:20-39](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/pricing.py#L20-L39)

同一快照保存价格、别名、缓存与内容身份

<details>
<summary>查看原文（20行）</summary>

```text
    def __init__(self, db_path: Optional[Path] = None, override_path: Optional[Path] = None):
        self.db_path = db_path or (Path(__file__).parent / "pricing_db.json")
        # User overrides live under the data dir (not site-packages) so dashboard pricing
        # edits survive `tokdash update` and don't 500 on a read-only install. Resolved
        # lazily per-load (default None) so TOKDASH_DATA_DIR changes are honored.
        self._override_path_explicit = override_path
        # pricing + aliases + a memo cache + the CONTENT IDENTITY of the bytes they came
        # from are published together as ONE immutable snapshot reference (self._state).
        # load() rebuilds the tuple and swaps it in a single atomic assignment, and readers
        # (_resolve_pricing) grab the reference once — so a reload on a request worker thread
        # (sessions._pricing_signature reloads on signature drift) can never expose a
        # half-updated pricing/aliases pair, nor leak a stale entry into a freshly-cleared
        # cache. A single attribute rebind/read is atomic under the GIL, so no lock.
        #
        # The identity rides in the snapshot because it must describe THESE rates. Deriving
        # it by rereading the file later is a time-of-check/time-of-use bug: the file can
        # change in between, and a persistent cache would then record the new file's identity
        # against costs computed from the old in-memory rates — after which every request
        # holding the genuinely-new pricing matches that identity and skips repricing forever.
        self._state: tuple = ({}, {}, {}, _MISSING_PRICING_CONTENT)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地与费用边界是什么，能否直接作为报销账本？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

不能直接当实际扣费或报销凭据。price.get_cost按本地模型价格和token计算，找不到价格时返回0.0，所以零费用不充分证明免费；DSH条目另保留计费说明字段，用户仍需检查模型映射及供应商账单。运行需要Python>=3.10、FastAPI/Uvicorn、zstandard，终端界面还依赖Textual，持久解析与缓存会占本机存储。API是本地服务，通常写操作检查loopback绑定、Host、Origin和进程token；middleware有派生缓存与经过单独授权的更新例外，本研究未核查整条远程更新认证，不能将该局部防护说成全服务安全审计。首次接入需选日志路径并核对样本，持续需适配宿主格式、价格与缓存，失败需检查诊断；总费用、扫描耗时和CPU资源未实测。停服务和撤除看板可退出统计流程，原始宿主日志不应作为派生缓存清理对象。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-10](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/pyproject.toml#L5-L10)

Python版本

```text
[project]
name = "tokdash"
version = "2.7.1"
description = "Local token & cost dashboard for AI coding tools"
readme = "README.md"
requires-python = ">=3.10"
```

**依据 2 · 源码核查**：[pyproject.toml:29-45](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/pyproject.toml#L29-L45)

服务器、解码与终端依赖

<details>
<summary>查看原文（17行）</summary>

```text
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.32.0",
  # PEP 440-correct version comparison for the opt-in update check (updatecheck.py); the
  # hand-rolled fallback is only correct for plain X.Y.Z releases, not pre/post/dev.
  "packaging>=21.0",
  # DeepSeek Harness session logs are concatenated zstd frames (sources/dsh_log.py).
  "zstandard>=0.23",
  # Terminal dashboard (`tokdash tui`). Textual 8.x's worker/seam API is what
  # src/tokdash/tui/app.py is written against, and every 8.x verified fact in
  # the code (no on_*_success delivery, thread=True required, no column justify)
  # is a Textual-8 fact — so an unpinned future major (9+) could break the TUI
  # on an upgrade with no signal. Capped until a major is explicitly adopted.
  "textual>=8.0.0,<9",
]

[project.urls]
```

</details>

**依据 3 · 源码核查**：[src/tokdash/pricing.py:320-342](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/pricing.py#L320-L342)

无价格返回零及估算公式

<details>
<summary>查看原文（23行）</summary>

```text
    def get_cost(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int,
        cache_read: int = 0,
        cache_write: int = 0,
    ) -> float:
        pricing = self._resolve_pricing(model)
        if not pricing:
            return 0.0

        input_rate = float(pricing.get("input", 0.0) or 0.0)
        output_rate = float(pricing.get("output", 0.0) or 0.0)
        cache_read_rate = float(pricing.get("cache_read", input_rate * 0.1) or 0.0)
        cache_write_rate = float(pricing.get("cache_write", input_rate) or 0.0)

        return (
            (int(input_tokens or 0) * input_rate)
            + (int(output_tokens or 0) * output_rate)
            + (int(cache_read or 0) * cache_read_rate)
            + (int(cache_write or 0) * cache_write_rate)
        ) / 1_000_000
```

</details>

**依据 4 · 源码核查**：[src/tokdash/sources/coding_tools.py:5985-5996](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/coding_tools.py#L5985-L5996)

估算费用及计费说明字段

<details>
<summary>查看原文（12行）</summary>

```text
                    "cost": self.pricing_db.get_cost(model, input_t, output_t, cache_r, cache_w),
                    "timestamp": int(sample["timestamp_ms"]),
                    "entry_id": dsh_sample_entry_id(session_id, sample),
                    "_session_id": session_id,
                    **({"_speed": sample["_speed"]} if "_speed" in sample else {}),
                    "_billing": usage_billing_pricing(
                        [model],
                        input_tokens=input_t,
                        output_tokens=output_t,
                        cache_read=cache_r,
                        cache_write=cache_w,
                    ),
```

</details>

**依据 5 · 源码核查**：[src/tokdash/api.py:907-937](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/api.py#L907-L937)

局部写请求检查

<details>
<summary>查看原文（31行）</summary>

```text
def mutation_denied_reason(
    method: str, headers, *, bind: Optional[str] = None, port: Optional[int] = None
) -> Optional[str]:
    """Return why a state-changing request is denied, or None if allowed.

    Pure and dependency-free (takes a header mapping, not a Request) so it is
    unit-testable without an ASGI client.
    """
    if method.upper() not in _MUTATING_METHODS:
        return None
    bind = bind if bind is not None else _effective_bind()
    if not _is_loopback(bind):
        return "Tokdash is not bound to loopback; write endpoints are disabled. Bind 127.0.0.1 to make changes."
    port = port if port is not None else _effective_port()
    allow = _host_allowlist(port)
    host = (headers.get("host") or "").strip().lower()
    if host not in allow:
        return "Host header is not a recognized loopback address."
    cross = _origin_denied(headers, _origin_allowlist(port))
    if cross:
        return cross
    token = headers.get("x-tokdash-token", "")
    try:
        # compare_digest raises TypeError on non-ASCII str operands; a header decoded as
        # latin-1 can carry such bytes. Treat that as a normal mismatch (403), never a 500.
        ok = bool(token) and secrets.compare_digest(token, _CSRF_TOKEN)
    except TypeError:
        ok = False
    if not ok:
        return "Missing or invalid Tokdash write token."
    return None
```

</details>

**依据 6 · 源码核查**：[src/tokdash/api.py:1007-1027](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/api.py#L1007-L1027)

middleware实际接线及例外

<details>
<summary>查看原文（21行）</summary>

```text
@app.middleware("http")
async def _write_guard(request: Request, call_next):
    # Structured read queries and disposable derived-cache builds have the same
    # authority as their GET equivalents; they cannot modify user configuration.
    if request.method.upper() == 'POST' and _request_route_path(request) in {'/api/session-speeds', '/api/output-speed/ensure'}:
        return await call_next(request)
    if request.method.upper() in _MUTATING_METHODS and _dev_fixture_mode(request.app):
        return JSONResponse(
            {"detail": "Writes are disabled while a synthetic development fixture is active."},
            status_code=409,
        )
    if request.method.upper() in _MUTATING_METHODS:
        route = _request_route_path(request)
        if route == _UPDATE_ENROLL_PATH and _update_remote_authorized(request, require_session=False):
            return await call_next(request)
        if route == _UPDATE_START_PATH and _update_remote_authorized(request, require_session=True):
            return await call_next(request)
    reason = mutation_denied_reason(request.method, request.headers)
    if reason is not None:
        return JSONResponse({"detail": reason}, status_code=403)
    return await call_next(request)
```

</details>

#### 缺口

- 未与同账户实际账单及完整人工日志基线对齐
  **影响**：不能量化费用误差、完整性或节时
  **进一步探讨**：用固定日志样本逐条核对重试、压缩和未知模型，再与供应商账单分别比对，记录不可归因差异

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，以及怎样使缺失数据更可见？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议给已保存DSH日志、愿意核对计数的个人开发者试用本地看板，先限定一个可手工计数的会话，覆盖重试、压缩与未知模型，再检查诊断和价格映射；它适合回顾使用习惯，不适合作为单一计费凭据。若样本计数不一致、格式被跳过或价格缺失，应暂停费用判断，保留原日志并回到人工核对。由损坏帧告警和未知价格返回零可推导未验证假设：每个总计同时携带来源覆盖与价格覆盖状态，可能比单个金额更容易让用户识别“不完整的低费用”。相对当前日志告警，它把完整性直接放到决策处；最小验证让相同用户处理完整、坏帧、未知模型三组数据，比较识别错误总计的比例与操作时间。若提示仍使用户把缺失当零或显著增加负担却不改善识别，该假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/tokdash/sources/dsh_log.py:163-190](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/dsh_log.py#L163-L190)

已有诊断作为假设基线

<details>
<summary>查看原文（28行）</summary>

```text
def report_dsh_decode(path: Any, decoded: "DSHDecodedSession") -> None:
    """Report everything one decode lost, identically for both surfaces.

    The usage parser and the Sessions panel decode the same file on their own
    schedules -- after a restart the persistent store re-reads only changed files,
    so the panel may be the only surface that ever sees an unchanged broken one.
    Each calls this, with one wording per problem, so the registry above names a
    file once no matter which surface read it, and neither can be the silent one.
    """
    if decoded.skip_reason is not None or decoded.header is None:
        report_dsh_diagnostic(path, f"skip:{decoded.skip_reason or 'missing-header'}")
        return
    recovered = True
    if decoded.failed_frames:
        recovered = False
        report_dsh_diagnostic(
            path,
            "frames-lost",
            f"{decoded.failed_frames} zstd frame(s) did not decode; their rows are missing",
        )
    if dsh_seed_boundary(decoded.header, decoded.events)[1]:
        recovered = False
        report_dsh_diagnostic(
            path,
            "seed-unprovable",
            "seeded session with no inherited session/end-seed marker; billing nothing "
            "rather than double-billing the parent's inherited prefix",
        )
```

</details>

**依据 2 · 源码核查**：[src/tokdash/pricing.py:320-342](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/pricing.py#L320-L342)

未知价格零值触发完整性问题

<details>
<summary>查看原文（23行）</summary>

```text
    def get_cost(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int,
        cache_read: int = 0,
        cache_write: int = 0,
    ) -> float:
        pricing = self._resolve_pricing(model)
        if not pricing:
            return 0.0

        input_rate = float(pricing.get("input", 0.0) or 0.0)
        output_rate = float(pricing.get("output", 0.0) or 0.0)
        cache_read_rate = float(pricing.get("cache_read", input_rate * 0.1) or 0.0)
        cache_write_rate = float(pricing.get("cache_write", input_rate) or 0.0)

        return (
            (int(input_tokens or 0) * input_rate)
            + (int(output_tokens or 0) * output_rate)
            + (int(cache_read or 0) * cache_read_rate)
            + (int(cache_write or 0) * cache_write_rate)
        ) / 1_000_000
```

</details>

**依据 3 · 源码核查**：[src/tokdash/sources/coding_tools.py:5961-5999](https://github.com/JingbiaoMei/Tokdash/blob/f0868fe1b745a4d13eacc63dc479edb29e238f8e/src/tokdash/sources/coding_tools.py#L5961-L5999)

条目字段可承载来源与计费解释

<details>
<summary>查看原文（39行）</summary>

```text
    def _entries_for_decoded(self, path_str: str, decoded: Any) -> List[Dict[str, Any]]:
        """Fold one decoded log into usage entries.

        Shared by the live ``_parse_all`` and the stored ``_parse_file_strict`` so
        the two surfaces can never bill one file differently.
        """
        session_id = str(decoded.header.get("id") or Path(path_str).parent.name)
        entries: List[Dict[str, Any]] = []
        for sample in fold_dsh_usage_samples(decoded.header, decoded.events):
            model = sample["model"]
            input_t = sample["input"]
            output_t = sample["output"]
            cache_r = sample["cache_read"]
            cache_w = sample["cache_write"]
            entries.append(
                {
                    "source": self.source_name,
                    "model": model,
                    "provider": sample["provider"],
                    "input": input_t,
                    "output": output_t,
                    "cacheRead": cache_r,
                    "cacheWrite": cache_w,
                    "reasoning": 0,
                    "cost": self.pricing_db.get_cost(model, input_t, output_t, cache_r, cache_w),
                    "timestamp": int(sample["timestamp_ms"]),
                    "entry_id": dsh_sample_entry_id(session_id, sample),
                    "_session_id": session_id,
                    **({"_speed": sample["_speed"]} if "_speed" in sample else {}),
                    "_billing": usage_billing_pricing(
                        [model],
                        input_tokens=input_t,
                        output_tokens=output_t,
                        cache_read=cache_r,
                        cache_write=cache_w,
                    ),
                }
            )
        return entries
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
