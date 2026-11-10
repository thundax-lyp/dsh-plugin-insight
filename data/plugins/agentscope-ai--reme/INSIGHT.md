# ReMe 记忆工具

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[887a406](https://github.com/agentscope-ai/ReMe/tree/887a406f8d75bc3ce199114662af574b2bad806b)

<!-- BEGIN META -->
[![GitHub ★ 3,774](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C774&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe)
<!-- END META -->

> **功能**：以可读 Markdown 文件、检索与自动整理为 Agent 提供可共享的长期记忆。

> **亮点**：[Q02](#research-q02) 将可读文件、关键词、可选语义索引及链接定位组织在同一工作区。

> **主要限制**：[Q03](#research-q03) 自动记忆先写会话和记忆再记录成功回执，崩溃期间不能仅靠请求 ID 判断是否已经写入。

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
  - [Q01 · 根项目是什么，谁适合用它处理跨会话记忆？](#detail-section-11)
  - [Q02 · 可读文件与索引怎样配合，排序分数能说明什么？](#detail-section-12)
  - [Q03 · 自动记忆与 Dream 如何留痕，哪里仍有重试风险？](#detail-section-13)
  - [Q04 · 怎样做可退出的试用，并验证冲突提示是否值得加入？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个 Agent 处理同一项目的开发者，可跨会话查找已有约定与原始记录。

Markdown 与 grep 可以解决少量已知文件的查找。共享索引和自动整理扩展候选范围，同时增加复核和配置成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 可读文件 | 查找、维护和导出项目约定 | 内容和来源需要复核 |
| 混合搜索 | 补充关键词召回 | 向量后端可选，分数尺度不同 |
| 自动整理 | 更新会话记忆及 digest | 配置模型，崩溃后先核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python 与独立工作区 | 必需 | 保存文件及索引 | 直接维护文本 |
| 模型配置 | 自动整理需要 | 从会话提取记忆 | 保留手工写入 |
| embedding 后端 | 可选 | 语义召回 | 沿用关键词 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户写少量可纠正约定 | 保持可回读和备份 |
| 检索 | Agent 查找并复查出处 | 能区分新旧事实 |
| 退出 | 用户暂停自动作业 | 保留文件并回原有搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python 与本地存储 | 准备目录和来源规则 | 安装成本未测 |
| 持续 | 索引及可选模型费用 | 核对来源和过期内容 | 合格任务成本未知 |
| 恢复 | 重建与可能的重试 | 检查文件、回执和冲突 | 未测恢复工时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件记忆 | 可读文件及写入反馈 | 来源事实准确 |
| 检索 | 默认关键词及可选融合 | 当前规则命中率 |
| 自动整理 | 回执重放与 Dream 检查点 | 全部中断和并发路径 |

> **思考**：[Q03](#research-q03) 自动记忆先写会话和记忆再记录成功回执，崩溃期间不能仅靠请求 ID 判断是否已经写入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将可读文件、关键词、可选语义索引及链接定位组织在同一工作区。

检索返回原文定位，Dream 用处理结果和扫描时间记录检查点。自动记忆回执与文件写入分开，跨进程写入需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自动记忆先写会话和记忆再记录成功回执，崩溃期间不能仅靠请求 ID 判断是否已经写入。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从隔离目录和少量可纠正事实开始，回读原文。出现状态不明或版本冲突时暂停整理，回到原文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持根工具身份、默认检索、写入和回执边界。作者基准不覆盖本研究的冲突场景，实际模型、部署和恢复未独立验证。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、reme/__init__.py、integrations/dsh/package.json、README_ZH.md、reme/constants.py、reme/components/service/http_service.py、reme/config/default.yaml、reme/steps/file_io/write.py、reme/steps/index/search.py、reme/steps/evolve/auto_memory.py、reme/steps/evolve/dream/integrate.py、reme/steps/evolve/dream/finish.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中的根 Python 记忆工具。pyproject 由 reme.__version__ 取得 0.4.2.3，页面版本栏按 npm 装配器口径取不到。未运行服务、模型、基准或 DSH 子包。
- 下一步：在隔离目录对照手工 grep 和默认索引，再模拟回执前中断与两个进程写入，逐次检查事实命中和文件变化。

**分析版本**

- **仓库**：[agentscope-ai/ReMe](https://github.com/agentscope-ai/ReMe)
- **版本号**：未声明（[固定提交 887a406](https://github.com/agentscope-ai/ReMe/tree/887a406f8d75bc3ce199114662af574b2bad806b)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在使用记忆前展示近期冲突及来源，可能减少采纳过期信息。

在隔离目录对照手工 grep 和默认索引，再模拟回执前中断与两个进程写入，逐次检查事实命中和文件变化。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 167 | 26835 | — | — | 236507 |
| .mts | source | 1 | 400 | 381 | 6 | — |
| .mjs | source | 12 | 926 | 858 | 23 | — |
| .ts | source | 81 | 12280 | 10369 | 1255 | — |
| .mjs | test | 51 | 13301 | 12033 | 797 | — |
| .js | source | 1 | 251 | 244 | 2 | — |
| .tsx | source | 26 | 8013 | 7377 | 372 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=31&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=26&color=737b86&logo=github)](https://github.com/agentscope-ai/ReMe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨会话 Agent 能否用 ReMe 根工具保存可核对的长期记忆，在检索、自动整理和中断恢复时保留来源与写入边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么，谁适合用它处理跨会话记忆？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

ReMe 根目录是 Python 项目 reme-ai，要求 Python 3.11 以上并提供 reme CLI。固定源码动态版本来自 Python 属性，值为 0.4.2.3。仓库内 integrations/dsh 有另外的 npm 包和 Web bundle 声明，根项研究的对象是记忆工具和服务。根工具通过 CLI、HTTP、MCP 或 Python 接入其他宿主，不能把 DSH 子包的记忆钩子当成根入口能力。

适合的场景是一个用户使用多个 Agent 处理同一个项目，想在下一会话找到变更后的约定和来源。合格结果能命中当前版本、定位原文、保留纠正记录。若文件少且路径已知，直接编辑 Markdown 并 grep 往往已足够。HTTP 服务把启用的 Job 注册成路由并可提供 MCP。默认监听地址为回环，所查 JSON 路由把请求参数直接交给 Job，FastAPI 在构建时允许任意 CORS 来源。工作区路径检查和远端主体认证是不同层次，因此此次采用范围限定本机隔离目录。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-11](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/pyproject.toml#L1-L11)

根项目标识与 Python 要求。

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

**依据 2 · 源码核查**：[pyproject.toml:104-118](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/pyproject.toml#L104-L118)

CLI 入口和 Python 动态版本来源。

<details>
<summary>查看原文（15行）</summary>

```text
[project.scripts]
reme = "reme.reme:main"

[tool.setuptools]
packages = { find = { where = ["."], include = ["reme", "reme.*", "deploy", "deploy.*"], exclude = ["reme_studio*"] } }
include-package-data = true

[tool.setuptools.package-data]
"*" = ["py.typed", "**/*.yaml", "**/*.json"]
"reme.components.tokenizer" = ["stopwords"]
"deploy.benchmark_docker" = ["Dockerfile.*", "README.md"]

[tool.setuptools.dynamic]
version = { attr = "reme.__version__" }

```

</details>

**依据 3 · 源码核查**：[reme/__init__.py:1-3](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/__init__.py#L1-L3)

固定 Python 版本 0.4.2.3。

```text
"""ReMe CLI package."""

__version__ = "0.4.2.3"
```

**依据 4 · 源码核查**：[integrations/dsh/package.json:1-16](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/integrations/dsh/package.json#L1-L16)

DSH 插件是同库内另一独立 npm 包。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "@agentscope-ai/reme-dsh-plugin",
  "version": "0.1.3",
  "description": "ReMe memory and context integration for DeepSeek Harness",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "default": "./dist/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 5 · 作者声明**：[README_ZH.md:32-44](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/README_ZH.md#L32-L44)

作者描述多 Agent、可编辑 Markdown 与接口范围。

<details>
<summary>查看原文（13行）</summary>

```text
🧠 ReMe 将对话和资料持续沉淀为可读、可编辑、可检索、相互链接的 Markdown 记忆。QwenPaw、DeepSeek Harness 等 Agent
可以共享同一个 workspace，共同检索、维护和演化知识，而持久文件始终由用户掌控。

- **Memory as File, File as Memory**：ReMe 使用带 frontmatter 和 wikilink 的普通 Markdown 保存持久记忆。用户和 Agent
  都可以使用熟悉的工具查看、编辑、移动、同步和备份；索引及生成的元数据均可重建。
- **自进化知识库**：ReMe 将对话和资料逐步加工为 daily note 与长期知识，在保留来源的同时，持续提炼事实、偏好、
  流程经验及其关系。
- **精准召回所需上下文。** ReMe 结合 BM25、可选 embedding 和 wikilink 展开，召回带行号的相关片段及其关系，无需把整个知识库塞入
  Agent 上下文。
- **一个 workspace，可供不同 Agent 共同使用。** 个人助理、coding agent 和其他 Agent runtime 可以通过原生集成、SKILL.md、CLI、
  HTTP、MCP 或 Python API 共享同一个本地记忆空间。

<p align="center">
```

</details>

**依据 6 · 源码核查**：[reme/constants.py:4-10](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/constants.py#L4-L10)

默认监听地址为 IPv4 回环。

```text

# Loopback address used by services and clients unless a host is configured.
REME_DEFAULT_HOST = "127.0.0.1"

# Wildcard address accepted when a service is explicitly configured to listen
# on every IPv4 interface.
REME_WILDCARD_BIND_HOST = "0.0.0.0"
```

**依据 7 · 源码核查**：[reme/components/service/http_service.py:88-106](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/components/service/http_service.py#L88-L106)

FastAPI 构建和 CORS。

<details>
<summary>查看原文（19行）</summary>

```text
        self.service = FastAPI(
            title=app.config.app_name,
            lifespan=lifespan,
        )
        for server in servers.values():
            gateway = server.jobs_mcp
            self.service.router.lifespan_context = combine_lifespans(
                gateway.app.lifespan,
                self.service.router.lifespan_context,
            )
            self.service.router.routes.append(Route(gateway.path, endpoint=gateway, methods=["GET", "POST", "DELETE"]))
        cors_origins = ["*"]
        self.service.add_middleware(
            CORSMiddleware,  # type: ignore[arg-type]
            allow_origins=cors_origins,
            allow_credentials="*" not in cors_origins,
            allow_methods=["*"],
            allow_headers=["*"],
        )
```

</details>

**依据 8 · 源码核查**：[reme/components/service/http_service.py:231-241](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/components/service/http_service.py#L231-L241)

JSON Job 路由执行边界。

<details>
<summary>查看原文（11行）</summary>

```text
    def _add_json_job(self, job: BaseJob) -> None:
        """Register a job as POST /{job.name} returning a JSON Response."""

        async def endpoint(request: Request) -> Response:
            return await job(**request.model_dump(exclude_none=True))

        self.service.post(
            f"/{job.name}",
            response_model=Response,
            description=job.description,
        )(endpoint)
```

</details>

#### 缺口

- 未运行目标依赖与外部网关
  **影响**：无法判断当前发行物及部署侧准入配置
  **进一步探讨**：隔离工作区核对 CLI 和本地服务，单独检查远端入口的身份授权

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 可读文件与索引怎样配合，排序分数能说明什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

根配置默认使用本地文件仓、BM25、标签索引和文件关系，embedding_store 为空。写入 Job 解析工作区相对路径与允许范围，在进程内按路径加锁写文件；已有文件会覆盖并反馈，不提供事实验证。相对 grep，索引让不同 Agent 可以共用查询和候选范围，同时返回片段路径、行号与链接关系，不必逐个猜文件名。向量只有配置并得到候选时才贡献召回。

检索将查询及路径等过滤条件交给后端；两路都有结果才按 RRF 融合，仅一路有命中时保留原分。再按阈值过滤、按工具上下文去重或裁至 limit、可选扩展关联链接。固定默认 min_score=0。单路原分与 RRF 的约 0.01639 上限不在同一个尺度，设统一阈值可能仅把双路查询全滤掉。检索输出能帮用户回读；排序及链接不能确认事实真伪或哪个版本最新。

#### 证据与依据

**依据 1 · 源码核查**：[reme/config/default.yaml:502-542](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/config/default.yaml#L502-L542)

默认查询参数及阈值尺度说明。

<details>
<summary>查看原文（41行）</summary>

```text
  search:
    backend: base
    description: "Hybrid workspace search (vector + BM25, RRF-fused)."
    parameters:
      type: object
      properties:
        query:
          type: string
          description: "search query"
        limit:
          type: integer
          description: "max results"
          default: 5
        min_score:
          type: number
          description: >-
            Minimum returned score; 0 disables filtering (recommended).
            Uses native vector or BM25 scores when only one branch has hits,
            and rank-based RRF scores (at most 1/61, about 0.01639) when both have hits.
            The scale can change per query; this is not a normalized relevance threshold.
          default: 0.0
        tags:
          type: array
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
      required:
        - query
    steps:
      - backend: search_step
        vector_weight: 0.7
        candidate_multiplier: 5.0
        expand_links: true
        max_links_per_direction: 10
```

</details>

**依据 2 · 源码核查**：[reme/config/default.yaml:1091-1112](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/config/default.yaml#L1091-L1112)

本地文件仓、关键词、图和标签，向量后端未启用。

<details>
<summary>查看原文（22行）</summary>

```text
  keyword_index:
    default:
      backend: bm25
      tokenizer: default

  tag_index:
    default:
      backend: local
      tag_key: memory_tags
      max_tags_per_file: 3
      max_tag_length: 64

  file_store:
    default:
      backend: local
      # backend: faiss
      store_name: local
#      embedding_store: default
      embedding_store: ""
      keyword_index: default
      file_graph: default
      tag_index: default
```

</details>

**依据 3 · 源码核查**：[reme/steps/file_io/write.py:29-45](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/file_io/write.py#L29-L45)

工作区路径及允许路径检查。

<details>
<summary>查看原文（17行）</summary>

```text
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
            return None
```

</details>

**依据 4 · 源码核查**：[reme/steps/file_io/write.py:79-106](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/file_io/write.py#L79-L106)

路径锁、写入与覆盖回执。

<details>
<summary>查看原文（28行）</summary>

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
        if not is_md:
            answer = f"{answer} [system notice: {NON_MD_WARNING}]"
        self.context.response.answer = answer
        self.logger.info(
            f"[{self.name}] wrote path={target} bytes={nbytes} encoding={encoding} "
            f"overwritten={existed} is_md={is_md}",
        )
```

</details>

**依据 5 · 源码核查**：[reme/steps/index/search.py:305-344](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/index/search.py#L305-L344)

两路召回及阈值随命中模式变化。

<details>
<summary>查看原文（40行）</summary>

```text
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

        if min_score > 0.0:
            max_rrf_score = 1.0 / (_RRF_K + 1)
            if hybrid and min_score > max_rrf_score:
                self.logger.warning(
                    f"[{self.name}] min_score={min_score:g} exceeds the hybrid RRF maximum "
                    f"{max_rrf_score:.8g}; all hybrid results will be filtered out. "
                    "RRF scores are rank-based, not vector similarities or BM25 scores. "
                    "Keep min_score=0 to disable filtering; single-branch queries use native scores.",
                )
            fused = [c for c in fused if c.score >= min_score]
```

</details>

**依据 6 · 源码核查**：[reme/steps/index/search.py:346-375](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/index/search.py#L346-L375)

去重、裁剪与来源显示。

<details>
<summary>查看原文（30行）</summary>

```text
        pre_dedup_count = len(fused)
        dedup: dict | None = None
        if tool_context_id:
            fused, dedup = self._dedupe_tool_context(fused, tool_context_id, limit)
        else:
            fused = fused[:limit]

        unique_paths = list(dict.fromkeys(c.path for c in fused))
        link_expansion: dict[str, dict] = (
            await expand_links(self.file_store, unique_paths, max_links_per_direction) if expand_links_enabled else {}
        )

        answer_lines: list[str] = []
        for c in fused:
            answer_lines.append(
                f"========== {c.path}:{c.start_line}-{c.end_line} "
                f"[{self._format_scores(c.scores, hybrid)}] ==========\n{c.text}",
            )
            answer_lines.extend(render_expansion_lines(link_expansion.get(c.path, {})))

        self.context.response.answer = "\n".join(answer_lines)
        if not fused:
            self.context.response.metadata["empty_result"] = {
                "reason": "all_returned" if pre_dedup_count else "no_results",
                "message": ALL_RETURNED_MESSAGE if pre_dedup_count else NO_RESULTS_MESSAGE,
            }
        self.context.response.metadata["results"] = [
            c.model_dump(exclude_none=True, exclude={"embedding"}) for c in fused
        ]
        self.context.response.metadata["link_expansion"] = link_expansion
```

</details>

#### 缺口

- 缺少同工作区与 grep 的交叉验证
  **影响**：无法量化新增召回及错误旧记忆比例
  **进一步探讨**：用已知事实与修订记录对照 grep、默认 BM25 和双路检索

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动记忆与 Dream 如何留痕，哪里仍有重试风险？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Auto Memory 请求 ID 为可选。存在时按会话和请求 ID 定位回执，锁内比较稳定输入指纹。相同请求已完成就重放返回，异内容复用同 ID 被拒。首次执行先保存会话消息并继续自动记忆，成功后把回执写临时文件再替换。两者之间如果进程终止，工作区可能已有修改且回执尚未存在，重试仍会进入执行。单进程路径锁对同一进程有效，跨进程并发没有从该锁得到保护。根配置还允许显式纳入会话图像，默认关闭，使用前需核对材料、模型和留存范围。

Dream 会把扫描所得的日记交给模型形成 digest。单元返回异常或结构化回执无效时，整合步骤检查文件变化，唯一且目标合格的变化可作为恢复；无法恢复时允许再试一次，再失败留下记录。完成步骤仅对实际处理且非失败来源建立检查点，并用扫描时的 mtime，使之后的编辑仍有机会被下轮发现。这个流程区分失败、延后和恢复，但文件变动可用来推断写入发生，不能证明语义正确或所有副作用唯一。

#### 证据与依据

**依据 1 · 源码核查**：[reme/config/default.yaml:155-188](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/config/default.yaml#L155-L188)

自动记忆入参、图像默认关闭及步骤接线。

<details>
<summary>查看原文（34行）</summary>

```text
  auto_memory:
    backend: base
    description: "Auto-memory: record conversation facts into a daily note"
    parameters:
      type: object
      properties:
        request_id:
          type: string
          description: "Optional stable batch ID (1-128 characters); replay completed requests without rerunning the memory agent"
        messages:
          type: array
          description: "messages"
          items:
            type: object
        session_id:
          type: string
          description: "source conversation session identifier"
          default: ""
        memory_hint:
          type: string
          description: "optional hint"
        include_images:
          type: boolean
          description: "Use session images with a vision-capable AgentScope model; save Base64 originals and cite sources"
          default: false
        date:
          type: string
          description: "YYYY-MM-DD daily note date; empty = infer from message timestamps or today"
          default: ""
      required:
        - messages
    steps:
      - backend: auto_memory_step
      - backend: auto_tag_step
```

</details>

**依据 2 · 源码核查**：[reme/steps/evolve/auto_memory.py:510-546](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/auto_memory.py#L510-L546)

请求指纹及复用 ID 冲突处理。

<details>
<summary>查看原文（37行）</summary>

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
        session_key = hashlib.sha256(str(payload["session_id"]).encode()).hexdigest()
        request_key = hashlib.sha256(request_id.encode()).hexdigest()
        directory = f"{self.config_value('metadata_dir')}/auto_memory_requests/{session_key}"
        workspace = self.file_store.workspace_path
        allowed = self.context.get("_allowed_paths")
        lock_path = _checked_write_path(workspace, f"{directory}/.lock", allowed)
        async with await get_path_lock(lock_path):
            path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
            if path.exists():
                record = json.loads(path.read_text(encoding="utf-8"))
                if record["fingerprint"] != fingerprint:
                    self.context.response.success = False
                    self.context.response.answer = "Error: request_id was already used for different input"
                    return
```

</details>

**依据 3 · 源码核查**：[reme/steps/evolve/auto_memory.py:547-568](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/auto_memory.py#L547-L568)

执行在成功回执之前，回执用临时文件替换。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 4 · 源码核查**：[reme/steps/evolve/auto_memory.py:598-625](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/auto_memory.py#L598-L625)

保存会话消息发生在后续生成与回执前。

<details>
<summary>查看原文（28行）</summary>

```text
        day = (
            parse_daily_date(raw_date) if raw_date else self._messages_day(messages, tz) or current.strftime("%Y-%m-%d")
        )
        if raw_date and day is None:
            self.context.response.success = False
            self.context.response.answer = "Error: date must be YYYY-MM-DD"
            self.context.response.metadata.update({"date": raw_date, "modified": False, "n_messages": len(messages)})
            self.logger.warning(f"[{self.name}] invalid date={raw_date!r}")
            return

        history_messages, images, reply_kwargs = self._prepare_image_history(messages, day)
        await self._save_session_messages(session_id, messages)

        if not messages:
            self.context.response.success = True
            self.context.response.answer = "Skipped: no messages"
            self.context.response.metadata.update({"date": day, "modified": False, "n_messages": 0})
            self.logger.info(f"[{self.name}] Skipped: no messages session_id={session_id!r} modified=False")
            return

        try:
            note = await self._list_session_note(day, session_id)
        except RuntimeError as exc:
            self.context.response.success = False
            self.context.response.answer = str(exc)
            self.context.response.metadata.update({"date": day, "modified": False, "n_messages": len(messages)})
            self.logger.info(f"[{self.name}] list failed session_id={session_id!r} answer={str(exc)!r}")
            return
```

</details>

**依据 5 · 源码核查**：[reme/steps/file_io/write.py:21-26](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/file_io/write.py#L21-L26)

路径锁作用域是进程内。

```text
    Permission: honors the request-scoped ``_allowed_paths`` constraint
    injected by the server into the RuntimeContext.

    Concurrency: in-process per-path ``asyncio.Lock`` serializes concurrent
    writes to the same file (multi-worker / multi-process safety is out of
    scope).
```

**依据 6 · 源码核查**：[reme/steps/evolve/dream/integrate.py:150-178](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/dream/integrate.py#L150-L178)

错误后对照实际写入，条件不足才重试。

<details>
<summary>查看原文（29行）</summary>

```text
            except Exception as e:  # noqa: BLE001
                after = _snapshot_digest(workspace, digest_dir)
                changed = _changed_digest_paths(before, after)
                _record_modified_paths(state, changed)
                created = len(changed) == 1 and changed[0] not in unit_before
                if len(changed) == 1 and self._valid_target(
                    workspace,
                    digest_dir,
                    bucket,
                    changed[0],
                    action="CREATE" if created else "UPDATED",
                    existed_before=changed[0] in unit_before,
                ):
                    self._record_recovered(state, unit, bucket, paths, changed[0], created, e)
                    self.logger.warning(
                        f"[{self.name}] unit {index}/{len(state.units)} recovered from file change "
                        f"after agent error target_path={changed[0]} error={type(e).__name__}: {e}",
                    )
                    return
                if attempt == 0:
                    self.logger.warning(
                        f"[{self.name}] unit {index}/{len(state.units)} attempt 1 had no recoverable file change; "
                        f"retrying once: {type(e).__name__}: {e}",
                    )
                    before = after
                    continue
                self._record_failure(state, unit, paths, e)
                self.logger.error(f"[{self.name}] unit {index}/{len(state.units)} failed: {type(e).__name__}: {e}")
                return
```

</details>

**依据 7 · 源码核查**：[reme/steps/evolve/dream/integrate.py:180-222](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/dream/integrate.py#L180-L222)

无效回执触发恢复判断和失败记录。

<details>
<summary>查看原文（43行）</summary>

```text
            try:
                outcome = IntegrateOutcome.model_validate(parse_structured_reply(raw_result))
                if not self._valid_target(
                    workspace,
                    digest_dir,
                    bucket,
                    outcome.target_path,
                    action=outcome.action,
                    existed_before=outcome.target_path in unit_before,
                ):
                    raise ValueError(f"invalid or missing digest target_path: {outcome.target_path!r}")
            except Exception as e:  # noqa: BLE001
                after = _snapshot_digest(workspace, digest_dir)
                changed = _changed_digest_paths(before, after)
                _record_modified_paths(state, changed)
                created = len(changed) == 1 and changed[0] not in unit_before
                if len(changed) == 1 and self._valid_target(
                    workspace,
                    digest_dir,
                    bucket,
                    changed[0],
                    action="CREATE" if created else "UPDATED",
                    existed_before=changed[0] in unit_before,
                ):
                    self._record_recovered(state, unit, bucket, paths, changed[0], created, e)
                    self.logger.warning(
                        f"[{self.name}] unit {index}/{len(state.units)} accepted file change with invalid receipt "
                        f"target_path={changed[0]} error={type(e).__name__}: {e}",
                    )
                    return
                if attempt == 0:
                    self.logger.warning(
                        f"[{self.name}] unit {index}/{len(state.units)} attempt 1 returned an invalid receipt; "
                        "retrying once",
                    )
                    before = after
                    continue
                # Without a valid receipt or recoverable write, keep sources eligible for retry.
                self._record_failure(state, unit, paths, e)
                self.logger.error(
                    f"[{self.name}] unit {index}/{len(state.units)} failed invalid receipt after retry: "
                    f"{type(e).__name__}: {e}",
                )
```

</details>

**依据 8 · 源码核查**：[reme/steps/evolve/dream/finish.py:26-47](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/dream/finish.py#L26-L47)

失败及延后文件不作已处理检查点。

<details>
<summary>查看原文（22行）</summary>

```text
        failed_paths = set(state.failed_paths)
        processed_paths = None if state.processed_paths is None else set(state.processed_paths)
        if processed_paths is None:
            # State written before processed paths were tracked: keep the old
            # behaviour rather than leaving everything uncheckpointed.
            checkpoint = [p for p in state.changed_paths if p not in failed_paths]
            state.deferred_paths = []
        else:
            checkpoint = [p for p in state.changed_paths if p in processed_paths and p not in failed_paths]
            state.deferred_paths = [p for p in state.changed_paths if p not in processed_paths]
        day_index_paths = [f"{state.daily_dir}/{day}.md" for day in (state.dates or [state.date]) if day]
        deferred = set(state.deferred_paths)
        supplemental = []
        for index_path in day_index_paths:
            if index_path in failed_paths or index_path in deferred:
                continue
            day_prefix = f"{state.daily_dir}/{Path(index_path).stem}/"
            if any(path.startswith(day_prefix) for path in deferred):
                # The day's notes were never sent to the model, so its index
                # must stay out of the catalog and be retried later.
                continue
            supplemental.append(index_path)
```

</details>

**依据 9 · 源码核查**：[reme/steps/evolve/dream/finish.py:80-90](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/dream/finish.py#L80-L90)

检查点记录扫描时版本。

<details>
<summary>查看原文（11行）</summary>

```text
    @staticmethod
    def _nodes(workspace: Path, paths: list[str], observed: dict[str, float]) -> list[FileNode]:
        """Checkpoint scanned versions, leaving later edits eligible for another run."""
        out: list[FileNode] = []
        for rel in paths:
            try:
                if rel in observed and (workspace / rel).is_file():
                    out.append(FileNode(path=rel, st_mtime=observed[rel]))
            except OSError:
                continue
        return out
```

</details>

#### 缺口

- 没有进程故障注入及跨进程写入试验
  **影响**：无法量化重试重复更改或错误恢复
  **进一步探讨**：在受控模型下写完后终止进程，重放同 ID 并对照文本、元数据和回执

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样做可退出的试用，并验证冲突提示是否值得加入？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

已有 Agent 的开发者可以先在独立目录写入少量可纠正项目约定，关闭自动捕获与整理，跑默认关键词检索并直接回读带行号原文。若命中废弃版本或写入状态不明，暂停自动更新，检查目录和索引，使用原 Markdown 和 grep 回退。首次成本是 Python、隔离工作区及来源约定；持续成本包括索引、可选 embedding 和模型整理，以及人工核对；失败恢复可能重建索引、处理重复写入和对照会话原件。单位应为一次准确找回并使用当前事实的任务，模型费用、存储和人工时间分别记录。

未验证假设是在采用一条记忆前并排显示最近冲突的来源和变更时间，让用户能在高影响修改前确认。当前路径、标签和日期过滤可以定位来源，混合排序没有对互相矛盾的事实建立采用决议。设计三组旧规则与新规则交错的材料，分别测纯搜索和加冲突提示后找对当前规则的比例、误采纳旧规则数与人工核对时间。如果提示只增加审阅时间而没有减少误采纳，或者高频误报削弱用户判断，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[reme/steps/index/search.py:353-375](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/index/search.py#L353-L375)

已有路径、行号和关联关系，作为溯源基线。

<details>
<summary>查看原文（23行）</summary>

```text
        unique_paths = list(dict.fromkeys(c.path for c in fused))
        link_expansion: dict[str, dict] = (
            await expand_links(self.file_store, unique_paths, max_links_per_direction) if expand_links_enabled else {}
        )

        answer_lines: list[str] = []
        for c in fused:
            answer_lines.append(
                f"========== {c.path}:{c.start_line}-{c.end_line} "
                f"[{self._format_scores(c.scores, hybrid)}] ==========\n{c.text}",
            )
            answer_lines.extend(render_expansion_lines(link_expansion.get(c.path, {})))

        self.context.response.answer = "\n".join(answer_lines)
        if not fused:
            self.context.response.metadata["empty_result"] = {
                "reason": "all_returned" if pre_dedup_count else "no_results",
                "message": ALL_RETURNED_MESSAGE if pre_dedup_count else NO_RESULTS_MESSAGE,
            }
        self.context.response.metadata["results"] = [
            c.model_dump(exclude_none=True, exclude={"embedding"}) for c in fused
        ]
        self.context.response.metadata["link_expansion"] = link_expansion
```

</details>

**依据 2 · 源码核查**：[reme/config/default.yaml:529-542](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/config/default.yaml#L529-L542)

现有按日期过滤和链接扩展。

<details>
<summary>查看原文（14行）</summary>

```text
        start_date:
          type: string
          description: "optional inclusive start date filter (YYYY-MM-DD); results earlier than this date are excluded"
        end_date:
          type: string
          description: "optional inclusive end date filter (YYYY-MM-DD); results later than this date are excluded"
      required:
        - query
    steps:
      - backend: search_step
        vector_weight: 0.7
        candidate_multiplier: 5.0
        expand_links: true
        max_links_per_direction: 10
```

</details>

**依据 3 · 源码核查**：[reme/steps/evolve/auto_memory.py:547-568](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/reme/steps/evolve/auto_memory.py#L547-L568)

重试前应核对文件变化与回执状态。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 4 · 作者声明**：[README_ZH.md:352-360](https://github.com/agentscope-ai/ReMe/blob/887a406f8d75bc3ce199114662af574b2bad806b/README_ZH.md#L352-L360)

作者基准为特定数据集结果，未覆盖本试用的冲突和恢复条件。

```text
ReMe 通过 Agent 多轮搜索与读取的方式，评测多会话和超长上下文中的记忆能力。下表为仓库中已公开的参考实验结果；模型、prompt、数据集和评判细节见各评测文档。

| 基准                                                                        | 设置        |            样本量 | Agentic 得分 | 主要检验内容                   |
| --------------------------------------------------------------------------- | ----------- | ----------------: | -----------: | ------------------------------ |
| **[LongMemEval cleaned-s](https://reme.agentscope.io/zh/benchmarks/longmemeval)** | **整体**    |        **500 题** |    **89.4%** | 跨会话检索、知识更新与时间推理 |
| [BEAM](https://reme.agentscope.io/zh/benchmarks/beam)                             | 100K 上下文 | 20 cases / 400 题 |        66.1% | 十类长上下文记忆任务           |
| [BEAM](https://reme.agentscope.io/zh/benchmarks/beam)                             | 1M 上下文   | 35 cases / 700 题 |        65.0% | 超长对话设置                   |

在仓库的 [π-Bench 评测](https://reme.agentscope.io/zh/benchmarks/pibench)中，ReMe Agent 在 5 种用户角色上的平均 **PROC 得分为 0.580**
```

#### 缺口

- 缺少相同语料上的人工与自动对照
  **影响**：不能用作者整体基准替代用户净收益
  **进一步探讨**：在相同模型和问题下复测当前事实命中、人工时间和实际模型费用

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
