# Mnemosyne OS

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[250ee90](https://github.com/MnemosyneOS/mnemosyne/tree/250ee905b7f0154c1bb1f03144a1cf1d483eea59)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MnemosyneOS/mnemosyne)
<!-- END META -->

> **功能**：提供 Agent 记忆的 Python API、CLI 与 MCP 接入，支持存取、过滤、多信号检索和可选后端。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将记忆范围过滤、主召回及有标记的词面兜底接到一个接口。

> **主要限制**：[Q03](#research-q03) 主路阈值不再应用于词面回退结果，调用者要检查实际分数与解释。

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
  - [Q01 · 哪类任务适合记忆召回？](#detail-section-11)
  - [Q02 · 搜索怎么筛选和解释结果？](#detail-section-12)
  - [Q03 · threshold 是否约束所有返回？](#detail-section-13)
  - [Q04 · 怎么评估本地记忆的采用条件？](#detail-section-14)
  - [Q05 · 把词面回退单独标成候选能减少误用吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者需要按上下文找回曾记录的偏好或决策，并判断结果来源与验证状态。

直接查原记录或关键词检索，由调用者自行维护作用域与排序。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆查询 | 查找作用域内候选 | 结果需回原记录验证 |
| 词面回退 | 主召回为空时补候选 | 主路阈值不约束此路径 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python 与独立记录目录 | 必需 | 存取和搜索 | 回原记录 |
| 外部后端许可 | 选用时必需 | 提升召回 | 先保留本地试验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 创建合成记忆 | 明确作用域与预期 |
| 检索 | 查看分数和 explain | 核对原始记录 |
| 退出 | 关闭自动采用 | 回原记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储 | 准备合成数据 | 耗时未测 |
| 持续 | 查询与可选模型资源 | 验证候选和边界 | 净节时未知 |
| 失败 | 保留原资料 | 回查和恢复 | 额外工作量未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 记忆召回 | 范围过滤和结果解释 | 真实语义质量 |
| 回退 | 返回词面候选 | 阈值误用与误采纳率 |

> **思考**：[Q03](#research-q03) 主路阈值不再应用于词面回退结果，调用者要检查实际分数与解释。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将记忆范围过滤、主召回及有标记的词面兜底接到一个接口。

[Q02](#research-q02) 主召回和回退共享作用域谓词，[Q03](#research-q03) 两者的阈值语义不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 主路阈值不再应用于词面回退结果，调用者要检查实际分数与解释。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用独立数据先核对 explain 和阈值回退，保留原始资料作为退路。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定 Python 搜索与回退。MCP、向量后端和效果未运行。

- 已检查：作者 README、包清单、源码路径 mnemosyne/api/memory.py、README_CN.md、pyproject.toml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 Python 记忆接口，未全审 MCP、多租户、删除与外部供应商。
- 下一步：对高阈值、低重叠和不相关范围运行合成查询，分别核对回退、解释及验证状态。

**分析版本**

- **仓库**：[MnemosyneOS/mnemosyne](https://github.com/MnemosyneOS/mnemosyne)
- **版本号**：未声明（[固定提交 250ee90](https://github.com/MnemosyneOS/mnemosyne/tree/250ee905b7f0154c1bb1f03144a1cf1d483eea59)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 显示主路和回退路径差别可测试是否减少误采纳。

对高阈值、低重叠和不相关范围运行合成查询，分别核对回退、解释及验证状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 7024 | — | — | 62378 |
| .js | source | 1 | 2131 | 1883 | 121 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/MnemosyneOS/mnemosyne/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要跨任务复用记忆的开发者能否解释本地搜索结果，尤其是阈值后回退的含义？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类任务适合记忆召回？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护应用的用户偏好和历史决定时，开发者需要按用户或任务重新查找事实。相对直接查 SQLite 或文本，根库提供筛选、召回和解释标记；合格结果需回看记录内容、作用域及验证状态。DSH 通过独立 MCP 接入是可选集成，本条研究根 Python 接口。

#### 证据与依据

**依据 1 · 作者声明**：[README_CN.md:75-96](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/README_CN.md#L75-L96)

作者给出本地 Memory 示例。

<details>
<summary>查看原文（22行）</summary>

````text
## 🚀 快速开始

### 安装

```bash
pip install mnemosyne-os          # 核心：零三方依赖
```

### 零配置就能记住和想起

```python
from mnemosyne import Memory

m = Memory()                       # 内置嵌入器 + 规则式抽取器
m.add("I prefer dark mode and use vim keybindings. My name is Alice.",
      user_id="alice")

for hit in m.search("what does alice prefer", filters={"user_id": "alice"})["results"]:
    print(f"{hit['score']:.3f}  {hit['memory']}")
```

离线、无 API Key、不下载模型、不装数据库就能跑。也正因为如此，才有下一节。
````

</details>

**依据 2 · 源码核查**：[mnemosyne/api/memory.py:701-721](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L701-L721)

搜索接口接受过滤与解释参数。

<details>
<summary>查看原文（21行）</summary>

```text
    def search(self, query: str, *,
               top_k: int = 20,
               filters: Optional[Dict[str, Any]] = None,
               threshold: float = 0.1,
               rerank: bool = False,
               explain: bool = False,
               reference_date: Optional[Any] = None,
               show_expired: bool = False,
               **kwargs: Any) -> Dict[str, Any]:
        """Retrieve memories relevant to *query*.

        ``threshold`` filters low-relevance hits and is validated to ``[0, 1]``;
        pass ``0.0`` to disable filtering.  ``rerank=True`` runs the configured
        reranker as a second stage.  ``explain=True`` adds a ``reason`` field
        naming the signals that matched, which is what makes a surprising result
        debuggable instead of mysterious.
        """
        reject_top_level_entity_kwargs(kwargs, "search")
        thr = validate_threshold(threshold)
        ctx, rest = self._scoped({}, filters)
        predicate = compile_filter(combine(rest, _freshness_filter(show_expired)))
```

</details>

#### 缺口

- 真实工作流召回频率和正确率未知。
  **影响**：无法保证优于直接关键词。
  **进一步探讨**：对固定决策集比较命中及误命中。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索怎么筛选和解释结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

调用先解析作用域与过期条件，再扩大候选集调用 brain.recall，去除已删除或不符合谓词记录。主路归一化并应用阈值，无命中才扫描存储并按查询词覆盖程度排序；解释模式可输出 reason 和 verification。可选重排另行执行。

#### 证据与依据

**依据 1 · 源码核查**：[mnemosyne/api/memory.py:718-771](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L718-L771)

主路、过滤、阈值、回退和解释。

<details>
<summary>查看原文（54行）</summary>

```text
        reject_top_level_entity_kwargs(kwargs, "search")
        thr = validate_threshold(threshold)
        ctx, rest = self._scoped({}, filters)
        predicate = compile_filter(combine(rest, _freshness_filter(show_expired)))

        effective_query = query
        if reference_date:
            effective_query = f"{query} (reference date: {reference_date})"

        raw = ctx.brain.recall(effective_query, k=max(int(top_k) * 3, 20))
        if isinstance(raw, tuple):
            raw = raw[0]

        hits: List[Tuple[float, Dict[str, Any], List[str]]] = []
        for entry in raw or []:
            score, rec, reasons = _unpack_hit(entry)
            if rec is None or rec.get("status") == "deleted":
                continue
            if not predicate(rec):
                continue
            hits.append((score, rec, reasons))

        hits = _normalise_scores(hits)
        if thr > 0.0:
            hits = [h for h in hits if h[0] >= thr]

        if not hits:
            # Lexical fallback. The fused retriever returns *nothing* on a query
            # with zero token overlap — the built-in embedder is a Johnson-
            # Lindenstrauss projection of TF-IDF, which is deterministic and free
            # but has no cross-word generalisation. That is exactly the capability
            # a configured embedding provider buys, so the miss is working as
            # designed; what is not acceptable is that it is indistinguishable
            # from "no such memory exists".
            #
            # The fallback is narrow on purpose: it runs only when the primary
            # pass is empty, requires at least one shared token, and tags its
            # results so `explain=True` reveals that they are token matches rather
            # than semantic ones.
            hits = self._lexical_fallback(ctx, query, predicate, int(top_k))

        if rerank and ctx.reranker is not None and hits:
            hits = self._apply_rerank(ctx.reranker, query, hits)

        hits = hits[: int(top_k)]
        results: List[Dict[str, Any]] = []
        for score, rec, reasons in hits:
            item = to_memory_item(rec, score=score)
            if explain:
                item["reason"] = ("+" .join(reasons) if reasons
                                  else "similarity")
                item["verification"] = rec.get("verification", "unverified")
            results.append(item)
        return {"results": results}
```

</details>

**依据 2 · 源码核查**：[mnemosyne/api/memory.py:798-827](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L798-L827)

回退的实际遍历与评分。

<details>
<summary>查看原文（30行）</summary>

```text
    def _lexical_fallback(self, ctx: MemoryBrainContext, query: str,
                          predicate: Any, top_k: int
                          ) -> List[Tuple[float, Dict[str, Any], List[str]]]:
        """Token-overlap search used only when the fused retriever found nothing.

        Deliberately narrow. It runs only on an empty primary result, so it can
        never dilute a good result set; it requires at least one shared token, so
        it cannot return a wholly unrelated memory; and it tags every hit so
        ``explain=True`` discloses that the match was lexical. The score is the
        fraction of query tokens found, which is a coverage measure a caller can
        reason about rather than an opaque similarity.
        """
        q_tokens = _tokens_for(query)
        if not q_tokens:
            return []
        scored: List[Tuple[float, Dict[str, Any], List[str]]] = []
        for rec in ctx.brain.store.iter_records():
            if rec.get("status") == "deleted":
                continue
            if not predicate(rec):
                continue
            surface = " ".join([str(rec.get("content") or ""),
                                " ".join(str(e) for e in (rec.get("entities") or []))])
            shared = q_tokens & _tokens_for(surface)
            if not shared:
                continue
            scored.append((len(shared) / float(len(q_tokens)), rec,
                           ["lexical_fallback"]))
        scored.sort(key=lambda h: h[0], reverse=True)
        return scored[:top_k] if top_k else scored
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · threshold 是否约束所有返回？

**研究主题**：缺陷与关键质疑

#### 完整回答

阈值只应用到主召回。若过滤后无命中，词面回退使用相同谓词，但直接把词覆盖分作为结果，没有再次检查 threshold。因此一个低于调用者阈值的词面匹配仍可出现。开启 explain 能区分 lexical_fallback 及验证状态，不能把词面覆盖当成已核实事实。

#### 证据与依据

**依据 1 · 源码核查**：[mnemosyne/api/memory.py:740-769](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L740-L769)

阈值后进入回退，输出前没有再次判阈值。

<details>
<summary>查看原文（30行）</summary>

```text
        hits = _normalise_scores(hits)
        if thr > 0.0:
            hits = [h for h in hits if h[0] >= thr]

        if not hits:
            # Lexical fallback. The fused retriever returns *nothing* on a query
            # with zero token overlap — the built-in embedder is a Johnson-
            # Lindenstrauss projection of TF-IDF, which is deterministic and free
            # but has no cross-word generalisation. That is exactly the capability
            # a configured embedding provider buys, so the miss is working as
            # designed; what is not acceptable is that it is indistinguishable
            # from "no such memory exists".
            #
            # The fallback is narrow on purpose: it runs only when the primary
            # pass is empty, requires at least one shared token, and tags its
            # results so `explain=True` reveals that they are token matches rather
            # than semantic ones.
            hits = self._lexical_fallback(ctx, query, predicate, int(top_k))

        if rerank and ctx.reranker is not None and hits:
            hits = self._apply_rerank(ctx.reranker, query, hits)

        hits = hits[: int(top_k)]
        results: List[Dict[str, Any]] = []
        for score, rec, reasons in hits:
            item = to_memory_item(rec, score=score)
            if explain:
                item["reason"] = ("+" .join(reasons) if reasons
                                  else "similarity")
                item["verification"] = rec.get("verification", "unverified")
```

</details>

**依据 2 · 源码核查**：[mnemosyne/api/memory.py:810-827](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L810-L827)

至少一词重叠即可入回退。

<details>
<summary>查看原文（18行）</summary>

```text
        q_tokens = _tokens_for(query)
        if not q_tokens:
            return []
        scored: List[Tuple[float, Dict[str, Any], List[str]]] = []
        for rec in ctx.brain.store.iter_records():
            if rec.get("status") == "deleted":
                continue
            if not predicate(rec):
                continue
            surface = " ".join([str(rec.get("content") or ""),
                                " ".join(str(e) for e in (rec.get("entities") or []))])
            shared = q_tokens & _tokens_for(surface)
            if not shared:
                continue
            scored.append((len(shared) / float(len(q_tokens)), rec,
                           ["lexical_fallback"]))
        scored.sort(key=lambda h: h[0], reverse=True)
        return scored[:top_k] if top_k else scored
```

</details>

#### 缺口

- 未实测默认数据上的触发分布。
  **影响**：未知多少调用者会误把低分结果视为满足阈值。
  **进一步探讨**：用多词查询和单词重叠样本验证 threshold=1 与 explain。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎么评估本地记忆的采用条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在独立目录用合成偏好验证 add、search 和 explain，记录词面与同义改写的成功标准。作者给出内置本地路径和可选远端后端；在云端嵌入前应确认可共享的数据和账户条件。若出现跨范围、阈值语义不合预期或无法回溯内容，停止用结果驱动动作并回到原记录查找。

#### 证据与依据

**依据 1 · 作者声明**：[README_CN.md:77-109](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/README_CN.md#L77-L109)

本地及可选外部后端作者示例。

<details>
<summary>查看原文（33行）</summary>

````text
### 安装

```bash
pip install mnemosyne-os          # 核心：零三方依赖
```

### 零配置就能记住和想起

```python
from mnemosyne import Memory

m = Memory()                       # 内置嵌入器 + 规则式抽取器
m.add("I prefer dark mode and use vim keybindings. My name is Alice.",
      user_id="alice")

for hit in m.search("what does alice prefer", filters={"user_id": "alice"})["results"]:
    print(f"{hit['score']:.3f}  {hit['memory']}")
```

离线、无 API Key、不下载模型、不装数据库就能跑。也正因为如此，才有下一节。

### 需要更强召回时，再接真实模型

```python
from mnemosyne import Memory

m = Memory.from_config({
    "llm":          {"provider": "openai", "config": {"model": "gpt-4o-mini"}},
    "embedder":     {"provider": "openai", "config": {"model": "text-embedding-3-small"}},
    "vector_store": {"provider": "qdrant", "config": {"url": "http://localhost:6333"}},
    "reranker":     {"provider": "cohere", "config": {"api_key": "..."}},
    "graph_store":  {"provider": "builtin"},
})
````

</details>

**依据 2 · 源码核查**：[mnemosyne/api/memory.py:762-771](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L762-L771)

解释与验证状态。

<details>
<summary>查看原文（10行）</summary>

```text
        hits = hits[: int(top_k)]
        results: List[Dict[str, Any]] = []
        for score, rec, reasons in hits:
            item = to_memory_item(rec, score=score)
            if explain:
                item["reason"] = ("+" .join(reasons) if reasons
                                  else "similarity")
                item["verification"] = rec.get("verification", "unverified")
            results.append(item)
        return {"results": results}
```

</details>

#### 缺口

- 实际 Python 环境、模型费用和规模影响未测。
  **影响**：不能估算每次合格召回的资源。
  **进一步探讨**：比较独立语料的查询延迟与人工验证时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把词面回退单独标成候选能减少误用吗？

**研究主题**：新假设与验证

#### 完整回答

可在产品入口显示回退路径、词覆盖与主路阈值，把回退条目标为需复查。现有 reason 可供利用。对比默认结果与标记结果，用多词查询里部分重叠的测试集衡量误采纳和找回率；若用户更少采用但合格召回也明显下降，应调整展示而非隐藏所有回退。

#### 证据与依据

**依据 1 · 源码核查**：[mnemosyne/api/memory.py:744-769](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L744-L769)

回退与可选解释。

<details>
<summary>查看原文（26行）</summary>

```text
        if not hits:
            # Lexical fallback. The fused retriever returns *nothing* on a query
            # with zero token overlap — the built-in embedder is a Johnson-
            # Lindenstrauss projection of TF-IDF, which is deterministic and free
            # but has no cross-word generalisation. That is exactly the capability
            # a configured embedding provider buys, so the miss is working as
            # designed; what is not acceptable is that it is indistinguishable
            # from "no such memory exists".
            #
            # The fallback is narrow on purpose: it runs only when the primary
            # pass is empty, requires at least one shared token, and tags its
            # results so `explain=True` reveals that they are token matches rather
            # than semantic ones.
            hits = self._lexical_fallback(ctx, query, predicate, int(top_k))

        if rerank and ctx.reranker is not None and hits:
            hits = self._apply_rerank(ctx.reranker, query, hits)

        hits = hits[: int(top_k)]
        results: List[Dict[str, Any]] = []
        for score, rec, reasons in hits:
            item = to_memory_item(rec, score=score)
            if explain:
                item["reason"] = ("+" .join(reasons) if reasons
                                  else "similarity")
                item["verification"] = rec.get("verification", "unverified")
```

</details>

**依据 2 · 源码核查**：[mnemosyne/api/memory.py:819-827](https://github.com/MnemosyneOS/mnemosyne/blob/250ee905b7f0154c1bb1f03144a1cf1d483eea59/mnemosyne/api/memory.py#L819-L827)

词覆盖分的实际构成。

```text
            surface = " ".join([str(rec.get("content") or ""),
                                " ".join(str(e) for e in (rec.get("entities") or []))])
            shared = q_tokens & _tokens_for(surface)
            if not shared:
                continue
            scored.append((len(shared) / float(len(q_tokens)), rec,
                           ["lexical_fallback"]))
        scored.sort(key=lambda h: h[0], reverse=True)
        return scored[:top_k] if top_k else scored
```

#### 缺口

- 没有用户试验。
  **影响**：标记对准确性的实际影响未知。
  **进一步探讨**：在合成记录下比较核对时间和误采纳。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
