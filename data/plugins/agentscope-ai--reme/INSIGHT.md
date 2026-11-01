# ReMe

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1e51e0d](https://github.com/agentscope-ai/ReMe/tree/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9)

<!-- BEGIN META -->
[![GitHub ★ 3,730](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C730&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe)
<!-- END META -->

> **功能**：以文件记忆、搜索与模型演化为 Agent 提供可读长期记忆。

> **亮点**：[Q02](#research-q02) 组合可读文件、关键词和可选向量检索；成熟 RRF 和 BM25 不是新算法。

> **主要限制**：[Q03](#research-q03) 成功回执在执行后写入，崩溃窗口可能重复更改；排名和来源链接不验证事实。

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
  - [Q01 · 谁需要根平台，与普通笔记相比有什么变化？](#detail-section-11)
  - [Q02 · 根 CLI 的写入与检索如何接线？](#detail-section-12)
  - [Q03 · 自动记忆与索引恢复有什么缺口？](#detail-section-13)
  - [Q04 · 默认和可选模型的成本及回退是什么？](#detail-section-14)
  - [Q05 · 怎样判断比简单文件检索更有价值？](#detail-section-15)
  - [Q06 · 能否降低过期或冲突记忆被引用的概率？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要跨会话查找和维护资料的 Agent 开发者。

普通 Markdown、grep 与人工摘要已经能实现文件记忆；平台增加索引、搜索和自动整理，也增加模型与维护成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件记忆 | 读写可编辑内容 | 覆盖已有文件需核对 |
| 混合搜索 | 关键词与可选向量召回 | 默认向量未配置，排序不判事实 |
| 自动整理 | 按会话提炼记忆 | 需要模型，结果需复核 |
| 请求回放 | 避免已记录成功请求重复执行 | 执行到回执之间有中断窗口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.11+ 与根服务 | 必需 | 文件与搜索 | 无法运行 |
| 可写隔离工作区 | 必需 | 保存文件和索引 | 无法写入 |
| LLM 凭据 | 自动演化需要 | 生成与整理记忆 | 基础检索可按配置使用 |
| embedding 后端 | 语义检索可选 | 向量召回 | 默认不启用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立隔离目录并备份 | 检查文件访问范围 |
| 写入 | 客户端提交少量可纠正事实 | 核查覆盖提示与原文件 |
| 检索 | Agent 查询并回读来源 | 区分排序与事实可信 |
| 维护 | 用户处理更正与冲突 | 回执不明先核对再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Python、存储和配置 | 准备工作区与备份 | 兼容未测 |
| 持续 | 索引及可选模型费用 | 复核错误和过期资料 | 总成本未知 |
| 失败 | 重建与重试资源 | 检查文件和回执 | 不能假定 exactly-once |
| 退出 | 保留文件与备份 | 导出、核对和人工迁移 | 索引不保证自动迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件记忆 | 根写入为可读文件 | 内容事实正确 |
| 检索 | BM25 与可选向量按 RRF 排序 | 对任务的正确召回 |
| 自动记忆 | 已成功请求可回放回执 | 崩溃窗口 exactly-once |

> **思考**：[Q03](#research-q03) 成功回执在执行后写入，崩溃窗口可能重复更改；排名和来源链接不验证事实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 组合可读文件、关键词和可选向量检索；成熟 RRF 和 BM25 不是新算法。

[Q02](#research-q02) 将根配置映射到写入和检索；[Q03](#research-q03) 成功回执与外部修改非原子，索引重建不等于事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 成功回执在执行后写入，崩溃窗口可能重复更改；排名和来源链接不验证事实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 以少量可纠正资料试默认检索和回读；冲突或回执不明时暂停演化。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅静态核查固定根平台配置与代表性文件、检索和记忆路径；未运行服务或模型。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、reme/config/default.yaml、reme/steps/file_io/write.py、reme/steps/index/search.py、reme/steps/evolve/auto_memory.py、reme/components/file_store/local_file_store.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查根平台 CLI、配置、代表性文件写入、搜索、自动记忆和本地索引；未研究其他集成组件、运行模型或故障注入。inventory 的 JS/TS 统计不代表 Python 核心总代码量。
- 下一步：隔离目录对照原生 grep、写入及回读，模拟回执前中断和索引不一致，测准确率、恢复和人工时。

**分析版本**

- **仓库**：[agentscope-ai/ReMe](https://github.com/agentscope-ai/ReMe)
- **版本号**：未声明（[固定提交 1e51e0d](https://github.com/agentscope-ai/ReMe/tree/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议在采用记忆前显示近期冲突及来源，高影响事项要求用户判断；须对照已有筛选和溯源验证。

隔离目录对照原生 grep、写入及回读，模拟回执前中断和索引不一致，测准确率、恢复和人工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 163 | 23818 | — | — | 202361 |
| .mts | source | 1 | 400 | 381 | 6 | — |
| .mjs | source | 12 | 884 | 826 | 15 | — |
| .ts | source | 58 | 6097 | 5586 | 136 | — |
| .mjs | test | 35 | 4424 | 4182 | 101 | — |
| .js | source | 1 | 251 | 244 | 2 | — |
| .tsx | source | 19 | 4780 | 4609 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=34&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 ReMe 根平台文件写入、检索、自动记忆及恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要根平台，与普通笔记相比有什么变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ReMe 根平台面向希望让 Agent 跨会话保存和检索资料的开发者。直接维护 Markdown、用 grep 或人工摘要已经能保存记忆；本项目把文件写入、索引、关键词/可选向量检索和模型提炼组合为服务及 CLI。可读文件便于人工纠错和迁移，但自动整理、分块、图链接与检索引入依赖、索引和事实维护负担。BM25、向量与 RRF 是已有方法，工程集成不等于新算法或证明模型长期记忆正确。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-11](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/pyproject.toml#L1-L11)

根 Python 包身份和版本条件。

<details>
<summary>查看原文（11行）</summary>

```text
[project]
name = "reme-ai"
dynamic = ["version"]
description = "Remember Me, Refine Me."
readme = "README.md"
authors = [
    { name = "EconML team of Alibaba Tongyi Lab", email = "jinli.yl@alibaba-inc.com" },
]
license = "Apache-2.0"
requires-python = ">=3.11"
keywords = ["llm", "memory", "agent", "agentscope", "ai", "mcp", "reme"]
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:100-103](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/pyproject.toml#L100-L103)

根 CLI 入口。

```text
Repository = "https://github.com/agentscope-ai/ReMe"

[project.scripts]
reme = "reme.reme:main"
```

**依据 3 · 作者声明**：[README.md:197-213](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/README.md#L197-L213)

作者演示写入、检索和回读 Markdown。

<details>
<summary>查看原文（17行）</summary>

````text
### 5-Minute Memory Demo

With the service running, write a memory node, let ReMe index it, then retrieve it:

```bash
reme write \
  path=digest/wiki/quick-start-demo \
  name="Quick Start Demo" \
  description="A first ReMe memory node" \
  content="# Quick Start Demo

ReMe stores agent memory as readable Markdown.

Related: [[digest/wiki/memory-as-file.md]]"

reme search query="agent memory markdown" limit=5
reme read path=digest/wiki/quick-start-demo start_line=1 end_line=20
````

</details>

**依据 4 · 源码核查**：[reme/steps/index/search.py:39-41](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L39-L41)

检索步骤定位。

```text
@R.register("search_step")
class SearchStep(_ToolContextMixin, BaseStep):
    """Hybrid search: run vector + keyword in parallel, fuse via RRF, filter, truncate."""
```

#### 缺口

- 缺少同任务的 grep、人工精选和平台对照
  **影响**：不能证明改善长期任务质量或净节省时间
  **进一步探讨**：固定含更正和过期事实的会话集，比较正确召回、误召回和维护时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根 CLI 的写入与检索如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

pyproject 暴露 reme 命令，默认配置将 write 映射 write_step，将 search 映射 search_step；写入路径解析和权限检查后，以进程内路径锁写文件，若已存在会覆盖并给出通知。检索按权重选择向量与关键词并可并行调用，再以 chunk ID 的 RRF 排名融合；默认配置 embedding_store 为空，因此不能把可选向量检索当作默认已启用。文件索引与原文件并非同一份数据，查询结果和链接扩展有助回查，但分数只表示检索排序而非事实可信度。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:100-103](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/pyproject.toml#L100-L103)

CLI 入口。

```text
Repository = "https://github.com/agentscope-ai/ReMe"

[project.scripts]
reme = "reme.reme:main"
```

**依据 2 · 源码核查**：[reme/config/default.yaml:490-497](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/config/default.yaml#L490-L497)

search job 到 search_step 的映射。

```text
      required:
        - query
    steps:
      - backend: search_step
        vector_weight: 0.7
        candidate_multiplier: 5.0
        expand_links: true
        max_links_per_direction: 10
```

**依据 3 · 源码核查**：[reme/config/default.yaml:775-782](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/config/default.yaml#L775-L782)

write job 到 write_step 的映射。

```text
          description: "Optional extra frontmatter fields (md only)."
      required:
        - path
        - name
        - description
        - content
    steps:
      - backend: write_step
```

**依据 4 · 源码核查**：[reme/steps/file_io/write.py:20-44](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/file_io/write.py#L20-L44)

进程内锁的边界及路径权限检查。

<details>
<summary>查看原文（25行）</summary>

```text

    Permission: honors the request-scoped ``_allowed_paths`` constraint
    injected by the server into the RuntimeContext.

    Concurrency: in-process per-path ``asyncio.Lock`` serializes concurrent
    writes to the same file (multi-worker / multi-process safety is out of
    scope).
    """

    async def execute(self):  # pylint: disable=too-many-return-statements
        assert self.context is not None
        raw = str(self.context.get("path") or "")
        content = self.context.get("content")
        content = "" if content is None else str(content)
        metadata_raw = self.context.get("metadata")

        target, err = resolve_path(self.workspace_path, raw)
        if err:
            self._fail(err)
            return None

        target, is_md = gate_md(target)

        if not _check_path_permission(self.workspace_path, target, self.context.get("_allowed_paths")):
            self._fail("no permission to write this file", path=str(target))
```

</details>

**依据 5 · 源码核查**：[reme/steps/file_io/write.py:79-99](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/file_io/write.py#L79-L99)

写入、覆盖和通知。

<details>
<summary>查看原文（21行）</summary>

```text
        lock = await get_path_lock(target)
        async with lock:
            existed = target.exists()
            # Preserve the existing file's encoding when overwriting (e.g. GBK
            # CSV stays GBK). New files are written as UTF-8.
            encoding = await detect_file_encoding(target) if existed else "utf-8"
            try:
                await write_file_safe(target, body, encoding=encoding)
            except Exception as e:  # pylint: disable=broad-except
                self._fail(f"write failed: {e}", path=str(target))
                return None

        try:
            nbytes = len(body.encode(encoding))
        except (UnicodeEncodeError, LookupError):
            nbytes = len(body.encode("utf-8"))
        self.context.response.success = True
        if existed:
            answer = f"Wrote {target} ({nbytes} bytes) [system notice: target already existed and was overwritten]"
        else:
            answer = f"Wrote {target} ({nbytes} bytes)"
```

</details>

**依据 6 · 源码核查**：[reme/steps/index/search.py:54-86](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L54-L86)

按 chunk ID 和权重计算 RRF。

<details>
<summary>查看原文（33行）</summary>

```text
    @staticmethod
    def _rrf_merge(
        vector: list[FileChunk],
        keyword: list[FileChunk],
        vector_weight: float,
    ) -> list[FileChunk]:
        """Fuse two ranked lists with Reciprocal Rank Fusion, keyed by chunk.id."""
        text_weight = 1.0 - vector_weight
        merged: dict[str, FileChunk] = {}

        for rank, chunk in enumerate(vector, start=1):
            contrib = vector_weight / (_RRF_K + rank)
            c = chunk.model_copy(deep=False)
            c.scores = {**chunk.scores, "vector": chunk.scores.get("vector", chunk.score), "score": contrib}
            merged[c.id] = c

        for rank, chunk in enumerate(keyword, start=1):
            contrib = text_weight / (_RRF_K + rank)
            existing = merged.get(chunk.id)
            if existing is not None:
                existing.scores = {
                    **existing.scores,
                    "keyword": chunk.scores.get("keyword", chunk.score),
                    "score": existing.scores["score"] + contrib,
                }
            else:
                c = chunk.model_copy(deep=False)
                c.scores = {**chunk.scores, "keyword": chunk.scores.get("keyword", chunk.score), "score": contrib}
                merged[c.id] = c

        results = list(merged.values())
        results.sort(key=lambda r: r.score, reverse=True)
        return results
```

</details>

**依据 7 · 源码核查**：[reme/steps/index/search.py:304-333](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L304-L333)

检索分支调用与融合。

<details>
<summary>查看原文（30行）</summary>

```text
        text_weight = 1.0 - vector_weight
        use_vector = vector_weight > 0.0
        use_keyword = text_weight > 0.0

        if use_vector and use_keyword:
            vector_results, keyword_results = await asyncio.gather(
                self.file_store.vector_search(query, candidates, search_filter),
                self.file_store.keyword_search(query, candidates, search_filter),
            )
        elif use_vector:
            vector_results = await self.file_store.vector_search(query, candidates, search_filter)
            keyword_results = []
        else:
            vector_results = []
            keyword_results = await self.file_store.keyword_search(query, candidates, search_filter)

        self.logger.info(
            f"[{self.name}] query={query!r} candidates={candidates} "
            f"vector_hits={len(vector_results)} keyword_hits={len(keyword_results)}",
        )

        hybrid = bool(vector_results) and bool(keyword_results)
        if not vector_results and not keyword_results:
            fused: list[FileChunk] = []
        elif not keyword_results:
            fused = vector_results
        elif not vector_results:
            fused = keyword_results
        else:
            fused = self._rrf_merge(vector_results, keyword_results, vector_weight)
```

</details>

**依据 8 · 源码核查**：[reme/config/default.yaml:988-996](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/config/default.yaml#L988-L996)

默认 embedding_store 为空。

```text
  file_store:
    default:
      backend: local
      # backend: faiss
      store_name: local
#      embedding_store: default
      embedding_store: ""
      keyword_index: default
      file_graph: default
```

#### 缺口

- 未运行根服务、索引或模型
  **影响**：无法验证目标部署中的搜索一致性和跨进程安全
  **进一步探讨**：隔离工作区实际写入、重启、修改并对照检索结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动记忆与索引恢复有什么缺口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

auto_memory 若有 request_id，会按 session 和请求哈希读取已有回执，输入指纹不同则拒绝；否则先 _execute，再在成功时写临时回执并替换，因此修改已经发生但成功回执尚未落盘时中断，重试仍可能再次执行，不能称完全 exactly-once。LocalFileStore 的本地状态在关闭时持久化；启动检查图和 chunk 不一致时清理衍生状态并依赖后续文件扫描重建，不能把重建机制说成与文件修改的原子提交。模型可能提炼错误或过期偏好，来源链接和 RRF 不检验事实；错误传播须对照原始材料纠正。

#### 证据与依据

**依据 1 · 源码核查**：[reme/steps/evolve/auto_memory.py:464-486](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/evolve/auto_memory.py#L464-L486)

request_id 和输入指纹。

<details>
<summary>查看原文（23行）</summary>

```text
    async def execute(self):
        """Replay completed request IDs without repeating the memory agent."""
        assert self.context is not None
        request_id = self.context.get("request_id")
        if request_id is None:
            return await self._execute()
        if not isinstance(request_id, str) or not 1 <= len(request_id) <= 128:
            self.context.response.success = False
            self.context.response.answer = "Error: request_id must be a string of 1 to 128 characters"
            return

        payload = {
            key: self.context.get(key) for key in ("session_id", "messages", "date", "memory_hint", "include_images")
        }
        if payload["messages"]:
            # Keep caller-provided IDs/timestamps; parsing dictionaries would generate defaults on every retry.
            payload["messages"] = [
                message.model_dump(mode="json") if isinstance(message, Msg) else message
                for message in payload["messages"]
            ]
        fingerprint = hashlib.sha256(
            json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode(),
        ).hexdigest()
```

</details>

**依据 2 · 源码核查**：[reme/steps/evolve/auto_memory.py:493-522](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/evolve/auto_memory.py#L493-L522)

命中回放、不同指纹拒绝和成功后写回执。

<details>
<summary>查看原文（30行）</summary>

```text
        async with await get_path_lock(lock_path):
            path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
            if path.exists():
                record = json.loads(path.read_text(encoding="utf-8"))
                if record["fingerprint"] != fingerprint:
                    self.context.response.success = False
                    self.context.response.answer = "Error: request_id was already used for different input"
                    return
                response = Response.model_validate(record["response"])
                self.context.response.answer = response.answer
                self.context.response.success = response.success
                self.context.response.metadata.update(response.metadata)
                self.context["changes"] = record["changes"]
                return
            await self._execute()
            if self.context.response.success:
                path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
                path.parent.mkdir(parents=True, exist_ok=True)
                temporary = _checked_write_path(workspace, f"{directory}/{request_key}.tmp", allowed)
                await write_file_safe(
                    temporary,
                    json.dumps(
                        {
                            "fingerprint": fingerprint,
                            "response": self.context.response.model_dump(mode="json"),
                            "changes": self.context.get("changes") or [],
                        },
                    ),
                )
                temporary.replace(path)
```

</details>

**依据 3 · 源码核查**：[reme/components/file_store/local_file_store.py:183-197](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/components/file_store/local_file_store.py#L183-L197)

关闭时持久化本地状态。

<details>
<summary>查看原文（15行）</summary>

```text
    async def _close(self) -> None:
        self._closing = True
        await self._cancel_embedding_backfill()
        # Dependencies are closed separately by Application (reverse
        # topological order) or BaseComponent (owned standalone dependencies).
        # Persist only this store's local state here so each component writes
        # exactly once during shutdown. Preserve the historical dump() hook for
        # third-party subclasses that override it to write additional state.
        if self.is_started:
            if type(self).dump is LocalFileStore.dump:
                await self._dump_owned_state()
            else:
                await self.dump()
        self.file_chunks.clear()
        await super()._close()
```

</details>

**依据 4 · 源码核查**：[reme/components/file_store/local_file_store.py:341-367](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/components/file_store/local_file_store.py#L341-L367)

图/chunk 不一致清理并交由扫描重建。

<details>
<summary>查看原文（27行）</summary>

```text
    async def _repair_graph_chunk_consistency(self) -> bool:
        """Clear torn graph/chunk state so the filesystem scan rebuilds it.

        ``InitChangesStep`` uses file-graph nodes as the indexed-file snapshot.
        A graph that survives a missing, truncated, or stale chunk store would
        otherwise make the source files look up to date and permanently hide
        the broken search index.
        """
        assert self.file_graph is not None
        nodes = await self.file_graph.get_nodes()
        graph_chunk_ids = {chunk_id for node in nodes for chunk_id in node.chunk_ids}
        stored_chunk_ids = set(self.file_chunks)
        missing = graph_chunk_ids - stored_chunk_ids
        orphaned = stored_chunk_ids - graph_chunk_ids
        if not missing and not orphaned:
            return False

        self.logger.warning(
            f"{self.name}: graph/chunk mismatch: nodes={len(nodes)}, graph_chunks={len(graph_chunk_ids)}, "
            f"stored_chunks={len(stored_chunk_ids)}, missing={len(missing)}, orphaned={len(orphaned)}; "
            "clearing derived index state for automatic rebuild",
        )
        # Clearing graph nodes is required: the next InitChangesStep scan will
        # then classify every watched source file as added and rebuild graph,
        # chunks, and search indexes from the user-owned files.
        await self.clear()
        return True
```

</details>

**依据 5 · 源码核查**：[reme/steps/index/search.py:54-86](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L54-L86)

融合按排序而非验证事实。

<details>
<summary>查看原文（33行）</summary>

```text
    @staticmethod
    def _rrf_merge(
        vector: list[FileChunk],
        keyword: list[FileChunk],
        vector_weight: float,
    ) -> list[FileChunk]:
        """Fuse two ranked lists with Reciprocal Rank Fusion, keyed by chunk.id."""
        text_weight = 1.0 - vector_weight
        merged: dict[str, FileChunk] = {}

        for rank, chunk in enumerate(vector, start=1):
            contrib = vector_weight / (_RRF_K + rank)
            c = chunk.model_copy(deep=False)
            c.scores = {**chunk.scores, "vector": chunk.scores.get("vector", chunk.score), "score": contrib}
            merged[c.id] = c

        for rank, chunk in enumerate(keyword, start=1):
            contrib = text_weight / (_RRF_K + rank)
            existing = merged.get(chunk.id)
            if existing is not None:
                existing.scores = {
                    **existing.scores,
                    "keyword": chunk.scores.get("keyword", chunk.score),
                    "score": existing.scores["score"] + contrib,
                }
            else:
                c = chunk.model_copy(deep=False)
                c.scores = {**chunk.scores, "keyword": chunk.scores.get("keyword", chunk.score), "score": contrib}
                merged[c.id] = c

        results = list(merged.values())
        results.sort(key=lambda r: r.score, reverse=True)
        return results
```

</details>

#### 缺口

- 未做中断和并发故障注入
  **影响**：无法量化重复更改和索引恢复完整性
  **进一步探讨**：隔离任务在执行后写回执前模拟崩溃，核对原文件、回执与重建结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认和可选模型的成本及回退是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根 Python 包要求 3.11 以上；根 CLI 和服务需环境、可写工作区与配置。默认配置没有启用 embedding_store，作者称基础文件、BM25 和链接遍历无需 LLM 凭据；自动记忆和演化需要模型凭据，启用语义检索另需 embedding 及服务。持续成本是存储、模型调用、索引维护与人工核对；文件可在受控备份后由普通编辑器检查，但离开平台后的索引及宿主行为不能假定自动迁移。失败或回执不明时应先核对已有文件与调用状态，避免盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-10](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/pyproject.toml#L1-L10)

Python 版本。

<details>
<summary>查看原文（10行）</summary>

```text
[project]
name = "reme-ai"
dynamic = ["version"]
description = "Remember Me, Refine Me."
readme = "README.md"
authors = [
    { name = "EconML team of Alibaba Tongyi Lab", email = "jinli.yl@alibaba-inc.com" },
]
license = "Apache-2.0"
requires-python = ">=3.11"
```

</details>

**依据 2 · 作者声明**：[README.md:147-169](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/README.md#L147-L169)

作者区分默认 embedding、基础查询和模型凭据。

<details>
<summary>查看原文（23行）</summary>

````text
### Environment Variables

Configure environment variables when you want LLM-powered memory evolution or embedding retrieval. Embeddings are
disabled by default, so the default setup does not start an embedding model or require an embedding API key.

```bash
cat > .env <<'EOF'
# Optional: used only after embedding components are explicitly enabled in the config.
# EMBEDDING_API_KEY=sk-xxx
# EMBEDDING_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# Required for auto_memory, auto_resource, auto_dream, and proactive refresh.
LLM_API_KEY=sk-xxx
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
EOF
```

Basic file operations, BM25 search, wikilink traversal, and reading proactive topics can run without LLM credentials.

> [!NOTE]
> To enable embedding-based semantic retrieval, uncomment `components.as_embedding` and
> `components.embedding_store` in [`reme/config/default.yaml`](reme/config/default.yaml), then change
> `components.file_store.default.embedding_store` from `""` to `default`. See the
````

</details>

**依据 3 · 源码核查**：[reme/config/default.yaml:988-996](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/config/default.yaml#L988-L996)

默认不配置 embedding store。

```text
  file_store:
    default:
      backend: local
      # backend: faiss
      store_name: local
#      embedding_store: default
      embedding_store: ""
      keyword_index: default
      file_graph: default
```

**依据 4 · 源码核查**：[reme/steps/evolve/auto_memory.py:493-522](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/evolve/auto_memory.py#L493-L522)

成功回执之后才可复用及写入窗口。

<details>
<summary>查看原文（30行）</summary>

```text
        async with await get_path_lock(lock_path):
            path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
            if path.exists():
                record = json.loads(path.read_text(encoding="utf-8"))
                if record["fingerprint"] != fingerprint:
                    self.context.response.success = False
                    self.context.response.answer = "Error: request_id was already used for different input"
                    return
                response = Response.model_validate(record["response"])
                self.context.response.answer = response.answer
                self.context.response.success = response.success
                self.context.response.metadata.update(response.metadata)
                self.context["changes"] = record["changes"]
                return
            await self._execute()
            if self.context.response.success:
                path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
                path.parent.mkdir(parents=True, exist_ok=True)
                temporary = _checked_write_path(workspace, f"{directory}/{request_key}.tmp", allowed)
                await write_file_safe(
                    temporary,
                    json.dumps(
                        {
                            "fingerprint": fingerprint,
                            "response": self.context.response.model_dump(mode="json"),
                            "changes": self.context.get("changes") or [],
                        },
                    ),
                )
                temporary.replace(path)
```

</details>

#### 缺口

- 未测安装、资源消耗、收费与迁移
  **影响**：无法估算总拥有成本或成功迁移
  **进一步探讨**：先用独立工作区备份文件，测首次启动、模型账单、重建及人工纠错耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断比简单文件检索更有价值？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

当任务确有跨会话复用且用户愿意复核来源，可先保存少量不敏感且可纠正的资料，仅用默认检索与原文件回读，观察是否比 grep 和人工精选更快更准；若需求只是少量固定笔记、无检索闭环或无法承担纠错，直接 Markdown 更合适。项目的关键词、可选向量和 RRF 是明确技术机制，不能只因有更多检索手段就认定它产生更好的答案。建议同时测遗漏、误召回、陈旧条目被采用率和核对时间，再决定是否启用自动演化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:197-213](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/README.md#L197-L213)

作者的写入、搜索和回读流程。

<details>
<summary>查看原文（17行）</summary>

````text
### 5-Minute Memory Demo

With the service running, write a memory node, let ReMe index it, then retrieve it:

```bash
reme write \
  path=digest/wiki/quick-start-demo \
  name="Quick Start Demo" \
  description="A first ReMe memory node" \
  content="# Quick Start Demo

ReMe stores agent memory as readable Markdown.

Related: [[digest/wiki/memory-as-file.md]]"

reme search query="agent memory markdown" limit=5
reme read path=digest/wiki/quick-start-demo start_line=1 end_line=20
````

</details>

**依据 2 · 源码核查**：[reme/steps/index/search.py:54-86](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L54-L86)

RRF 排名机制。

<details>
<summary>查看原文（33行）</summary>

```text
    @staticmethod
    def _rrf_merge(
        vector: list[FileChunk],
        keyword: list[FileChunk],
        vector_weight: float,
    ) -> list[FileChunk]:
        """Fuse two ranked lists with Reciprocal Rank Fusion, keyed by chunk.id."""
        text_weight = 1.0 - vector_weight
        merged: dict[str, FileChunk] = {}

        for rank, chunk in enumerate(vector, start=1):
            contrib = vector_weight / (_RRF_K + rank)
            c = chunk.model_copy(deep=False)
            c.scores = {**chunk.scores, "vector": chunk.scores.get("vector", chunk.score), "score": contrib}
            merged[c.id] = c

        for rank, chunk in enumerate(keyword, start=1):
            contrib = text_weight / (_RRF_K + rank)
            existing = merged.get(chunk.id)
            if existing is not None:
                existing.scores = {
                    **existing.scores,
                    "keyword": chunk.scores.get("keyword", chunk.score),
                    "score": existing.scores["score"] + contrib,
                }
            else:
                c = chunk.model_copy(deep=False)
                c.scores = {**chunk.scores, "keyword": chunk.scores.get("keyword", chunk.score), "score": contrib}
                merged[c.id] = c

        results = list(merged.values())
        results.sort(key=lambda r: r.score, reverse=True)
        return results
```

</details>

**依据 3 · 源码核查**：[reme/steps/file_io/write.py:79-99](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/file_io/write.py#L79-L99)

覆盖风险和通知。

<details>
<summary>查看原文（21行）</summary>

```text
        lock = await get_path_lock(target)
        async with lock:
            existed = target.exists()
            # Preserve the existing file's encoding when overwriting (e.g. GBK
            # CSV stays GBK). New files are written as UTF-8.
            encoding = await detect_file_encoding(target) if existed else "utf-8"
            try:
                await write_file_safe(target, body, encoding=encoding)
            except Exception as e:  # pylint: disable=broad-except
                self._fail(f"write failed: {e}", path=str(target))
                return None

        try:
            nbytes = len(body.encode(encoding))
        except (UnicodeEncodeError, LookupError):
            nbytes = len(body.encode("utf-8"))
        self.context.response.success = True
        if existed:
            answer = f"Wrote {target} ({nbytes} bytes) [system notice: target already existed and was overwritten]"
        else:
            answer = f"Wrote {target} ({nbytes} bytes)"
```

</details>

#### 缺口

- 尚无真实用户对照、召回质量和纠错数据
  **影响**：无法证实相对 grep 的收益
  **进一步探讨**：用同一份标注问题集盲评两种流程和人工成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否降低过期或冲突记忆被引用的概率？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 Markdown frontmatter、来源链接、图遍历、按日期过滤和自动演化已提供部分溯源和整理手段；简单添加时间戳或来源链接不是新增机制。未验证方案是在回答采用某记忆之前，显式展示与其冲突的近期条目及引用来源，并让用户对高影响结论确认；没有充分来源则标未知而不是自动裁决。与现有检索直接返回方案在含更正、矛盾和无来源样本上对照，测过时事实被采用率、正确新事实被误拦率、人工时间和模型费用；若误拦和人工成本大于错用减少则否定。

#### 证据与依据

**依据 1 · 源码核查**：[reme/steps/index/search.py:54-86](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/index/search.py#L54-L86)

已有排序融合，不判断事实。

<details>
<summary>查看原文（33行）</summary>

```text
    @staticmethod
    def _rrf_merge(
        vector: list[FileChunk],
        keyword: list[FileChunk],
        vector_weight: float,
    ) -> list[FileChunk]:
        """Fuse two ranked lists with Reciprocal Rank Fusion, keyed by chunk.id."""
        text_weight = 1.0 - vector_weight
        merged: dict[str, FileChunk] = {}

        for rank, chunk in enumerate(vector, start=1):
            contrib = vector_weight / (_RRF_K + rank)
            c = chunk.model_copy(deep=False)
            c.scores = {**chunk.scores, "vector": chunk.scores.get("vector", chunk.score), "score": contrib}
            merged[c.id] = c

        for rank, chunk in enumerate(keyword, start=1):
            contrib = text_weight / (_RRF_K + rank)
            existing = merged.get(chunk.id)
            if existing is not None:
                existing.scores = {
                    **existing.scores,
                    "keyword": chunk.scores.get("keyword", chunk.score),
                    "score": existing.scores["score"] + contrib,
                }
            else:
                c = chunk.model_copy(deep=False)
                c.scores = {**chunk.scores, "keyword": chunk.scores.get("keyword", chunk.score), "score": contrib}
                merged[c.id] = c

        results = list(merged.values())
        results.sort(key=lambda r: r.score, reverse=True)
        return results
```

</details>

**依据 2 · 源码核查**：[reme/config/default.yaml:480-489](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/config/default.yaml#L480-L489)

已有标签及日期筛选。

<details>
<summary>查看原文（10行）</summary>

```text
          items:
            type: string
          description: "optional tags filter; a file matches when it contains at least one valid tag"
          default: []
        start_date:
          type: string
          description: "optional inclusive start date filter (YYYY-MM-DD); results earlier than this date are excluded"
        end_date:
          type: string
          description: "optional inclusive end date filter (YYYY-MM-DD); results later than this date are excluded"
```

</details>

**依据 3 · 源码核查**：[reme/steps/file_io/write.py:50-71](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/file_io/write.py#L50-L71)

Markdown frontmatter 可保存元数据。

<details>
<summary>查看原文（22行）</summary>

```text
            meta: dict = {}
            # Expand `metadata` dict first, skipping the two reserved keys.
            if isinstance(metadata_raw, dict):
                for k, v in metadata_raw.items():
                    if k in ("name", "description"):
                        continue
                    if v is None:
                        continue
                    meta[str(k)] = v
            # Layer explicit name/description on top (always wins).
            for key in ("name", "description"):
                value = self.context.get(key)
                if value is None:
                    continue
                s = str(value).strip()
                if not s:
                    continue
                meta[key] = s

            if meta:
                post = frontmatter.Post(content, **meta)
                body = frontmatter.dumps(post)
```

</details>

**依据 4 · 源码核查**：[reme/steps/evolve/auto_memory.py:185-189](https://github.com/agentscope-ai/ReMe/blob/1e51e0dc1b1effe60f7ee425298f3b6f8ef4cbd9/reme/steps/evolve/auto_memory.py#L185-L189)

已有 session 来源链接机制。

```text
    def _session_source_path(self, session_id: str) -> str:
        return normalize_posix_path(f"{self._session_dir()}/dialog/{session_id}.jsonl")

    def _session_link(self, session_id: str) -> str:
        return f"[[{self._session_source_path(session_id)}]]"
```

#### 缺口

- 冲突提示方案和实验尚不存在
  **影响**：不能声称其减少错误或可作为自动裁决
  **进一步探讨**：构造含时序更正、冲突与缺源的标注集，盲测遗漏和误拦。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
