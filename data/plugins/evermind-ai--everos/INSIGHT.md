# EverOS

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[782815a](https://github.com/EverMind-AI/EverOS/tree/782815a60f1fbe1324dd2ec6343221acef1c046c)

<!-- BEGIN META -->
[![GitHub ★ 13,823](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C823&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)
<!-- END META -->

> **功能**：面向 Agent 和应用的本地 Markdown 记忆运行时，提供提取、后台索引、检索与删除接口。

> **亮点**：[Q02](#research-q02)到[Q05](#research-q05)确认真实模型/文件/索引接线，session顺序、owner/path锁与源存活检查、可重发删除和同进程cascade双fence给具体局部正确性措施。增量是本地可读源与自动提取/检索组合及状态治理，不能把DSH插件、外部算法/模型质量或数据库归为根项目原创。

> **主要限制**：[Q02](#research-q02)202/task success不覆盖所有后台策略与索引；[Q05](#research-q05)删除成功可伴索引清理失败待追平，owner-only也非全源/所有副本遗忘；[Q04](#research-q04)owner过滤不是认证。若调用者误认为已可查、已忘记或已租户隔离，记忆质量/维护收益不足以抵消错用。

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
  - [Q01 · 根项目是什么，DSH 接入与直接替代有什么界限？](#detail-section-11)
  - [Q02 · add、flush、队列成功到实际文件写入经历什么？](#detail-section-12)
  - [Q03 · 索引与检索实际调用什么，何时可见、依赖哪些模型？](#detail-section-13)
  - [Q04 · owner 字段是否授权，文件与模型数据边界是什么？](#detail-section-14)
  - [Q05 · 删除究竟删什么，失败、并发与取消后会怎样？](#detail-section-15)
  - [Q06 · 首次、持续、失败和退出怎样控制负担？](#detail-section-16)
  - [Q07 · 已有贡献与逐记忆可见性/遗忘对账方向如何证伪？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 为Agent/应用做跨会话记忆的开发者，需要将低敏源内容转可读记录、按正确scope检索并能恢复/删除；DSH接入是另一仓库组件。

[Q01](#research-q01) 人工Markdown+grep/SQLite索引或自组LLM与向量库能完成基本保存/查找；本仓组合分轨提取、可编辑源与派生索引/后台状态，底层算法与数据库继承依赖，未证净收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| add/flush | 对话/轨迹分轨提取 | LLM/精确依赖；202仅接收，partial可已写 |
| Markdown源 | 可读编辑与持久记忆 | root/path门，非跨SQLite/索引事务 |
| cascade/检索 | 文件派生索引、keyword/vector等 | provider分层，scope非ACL，追平异步 |
| 删除 | session/owner/episode-ID不同范围 | shield继续，索引失败可成功待修复 |
| 后台演化 | 事件式case及后续策略框架 | 根代表链已核，不承诺每skill/profile完成 |

**流程与依赖**

| 依赖或条件 | 版本/作用 | 缺失/边界 |
|---|---|---|
| EverOS | Python包1.6.0，Apache-2.0，Python>=3.12 | 根为基础设施，非DSH插件 |
| 存储 | LanceDB>=0.34,<0.35，PyArrow>=25.0.1，SQLite/aiosqlite>=0.20 | 版本线与磁盘/备份需核 |
| 算法包 | user-memory0.9.0rc4、agent-memory0.6.0rc3、rank0.5.0rc3等精确固定 | 提取算法非本仓独立原创，安装未验 |
| 模型 | LLM提取必需；embedding/rerank按方法 | keyword不需额外embedding，非全离线 |
| HTTP与OS | 默认127.0.0.1:8000、可信调用/明文权限 | 无内建认证，网络暴露需网关 |
| DSH桥接 | EverMind-AI/plugins独立组件 | 未在本固定根证明兼容接入 |

| 步骤 | 操作 | 成功与失败处理 |
|---|---|---|
| 准备 | 固定Python/算法版本与临时低敏根、provider预算 | 只loopback、不导生产历史 |
| 写入 | 小样本add/flush，202保request_id | 跟task与原文/Markdown，部分失败不盲重放 |
| 检索 | keyword读回固定答案，按需加provider | 等cascade并核scope/召回，不只看success |
| 删除 | 停导入，明确session/owner/ID范围 | 503等忙，500对账重发；成功另核索引/副本 |
| 退出 | 记积压/失败，备份原文配置后关服务 | 有界退出/重启replay，文件与provider不自动遗忘 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | Python/本地磁盘、模型配额费用未知 | 配版本、数据根、权限/备份分钟未知 |
| 持续 | 提取/反思模型、向量/rerank及索引存储未知 | 核生成错误/索引状态和修订，净节时未测 |
| 失败恢复 | partial/replay追加调用、队列/trash/重建未知 | 文件/SQLite/索引对账与恢复分钟未知 |
| 退出/删除 | provider/备份/残留资源未量化 | 停导入、核多scope/副本，不能仅看HTTP成功 |

| 效果项 | 当前支持 | 尚不能证明 |
|---|---|---|
| 持久记忆 | 实际模型→Markdown/temp替换 | 内容准确/提取全完成 |
| 检索 | 真实scope全文查询与provider门 | 召回优势/读后即查/租户授权 |
| 删除 | 源/文件/索引局部门与重发 | 全副本立即消失/永久不复生 |
| 恢复 | 状态/reconcile/fence/有界退出 | 崩溃无重复、成本更低 |
| 生产方向 | 逐记忆状态可提出实验 | 无原型/用户对照，不计既有收益 |

> **思考**：[Q02](#research-q02)202/task success不覆盖所有后台策略与索引；[Q05](#research-q05)删除成功可伴索引清理失败待追平，owner-only也非全源/所有副本遗忘；[Q04](#research-q04)owner过滤不是认证。若调用者误认为已可查、已忘记或已租户隔离，记忆质量/维护收益不足以抵消错用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)到[Q05](#research-q05)确认真实模型/文件/索引接线，session顺序、owner/path锁与源存活检查、可重发删除和同进程cascade双fence给具体局部正确性措施。增量是本地可读源与自动提取/检索组合及状态治理，不能把DSH插件、外部算法/模型质量或数据库归为根项目原创。

[Q02](#research-q02)真实session/owner/path锁、源存活/atomic文件与partial失败；[Q03](#research-q03)lsn/cascade和[Q05](#research-q05)双fence/重发删除有局部价值。多系统非事务、索引删除吞失败、API身份与范围分离必须保留，不从测试规模或作者表推可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)202/task success不覆盖所有后台策略与索引；[Q05](#research-q05)删除成功可伴索引清理失败待追平，owner-only也非全源/所有副本遗忘；[Q04](#research-q04)owner过滤不是认证。若调用者误认为已可查、已忘记或已租户隔离，记忆质量/维护收益不足以抵消错用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 独立临时根与虚构低敏对话，固定1.6.0/算法版本，loopback+预算先add/flush→task→文件→keyword核，别把owner当ACL。删除按[Q05](#research-q05)分scope并查陈旧索引/副本；不一致先停导入、保原文回简单文件，DSH接入另验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Python项目版本为1.6.0、类型为记忆基础设施，非原生DSH插件。源码支持代表写入/检索/删除及失败链，限独立临时低敏数据根试用；未运行目标、模型、DSH桥接或恢复，不能承诺准确召回/立即全忘记/多租户隔离。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、pyproject.toml、src/everos/config/settings.py、src/everos/entrypoints/api/app.py、src/everos/entrypoints/api/dependencies.py、src/everos/entrypoints/api/routes/delete.py、src/everos/entrypoints/api/routes/memorize.py、src/everos/entrypoints/api/routes/search.py、src/everos/entrypoints/api/routes/tasks.py、src/everos/entrypoints/api/schemas/delete.py、src/everos/infra/cascade/_eraser.py、src/everos/infra/cascade/_fence.py、src/everos/infra/cascade/_projections/_daily_log_base.py、src/everos/infra/cascade/_worker/_worker.py、src/everos/infra/cascade/orchestrator.py、src/everos/infra/persistence/index/adapters.py、src/everos/infra/persistence/lancedb/_base/repository.py、src/everos/infra/persistence/lancedb/_repos/_contract.py、src/everos/infra/persistence/markdown/_base/writer.py、src/everos/infra/persistence/markdown/_writers/base.py、src/everos/infra/persistence/markdown/owner_dir.py、src/everos/infra/persistence/markdown/stores.py、src/everos/infra/persistence/sqlite/_repos/memcell.py、src/everos/infra/persistence/sqlite/_repos/memorize_inbox.py、src/everos/infra/persistence/sqlite/_repos/session_purge.py、src/everos/memory/extract/boundary/detection.py、src/everos/memory/extract/pipeline/agent_memory.py、src/everos/memory/extract/pipeline/user_memory.py、src/everos/memory/reflection/orchestrator.py、src/everos/memory/search/filters.py、src/everos/memory/search/manager.py、src/everos/memory/search/recall/episode.py、src/everos/memory/strategies/extract_agent_case.py、src/everos/service/bootstrap.py、src/everos/service/memory/__init__.py、src/everos/service/memory/_delete.py、src/everos/service/memory/_extraction.py、src/everos/service/memory/_memorize.py、src/everos/service/memory/_queue.py、src/everos/service/memory/_queue_steps.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根项目代表add/flush/队列/SQLite memcell、user episode实际LLM/Markdown、事件case、keyword实际索引调用与cascade、HTTP准入/root路径门、scope/ID删除到SQLite/rename-trash/rmtree/index及fence、启动/退出。前稿五题/12findings全部复核；不全审知识Wiki、多模态/全部反思搜索/存储后端、外部DSH和所有provider观测路径，统计未含Python。
- 下一步：仅只读固定源码及自有研究装配/结构校验；未安装/运行目标测试/服务/demo/模型/DSH或真实资料。真实召回/费用/并发删除/恢复/退出均未测，未来只在授权隔离根逐层对账。

**分析版本**

- **仓库**：[EverMind-AI/EverOS](https://github.com/EverMind-AI/EverOS)
- **版本号**：Python 1.6.0（[固定提交 782815a](https://github.com/EverMind-AI/EverOS/tree/782815a60f1fbe1324dd2ec6343221acef1c046c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07)在具体记忆引用上给提交/索引版本及删除待清理状态，区分未控制副本；对照现有task/health/文件读回及简单等待，在部分提取/索引故障和删除并发中测误判、残留窗口与维护分钟。现有fence/lsn不冒充新发明；无改进或状态假阳性就推翻，尚无原型。

仅只读固定源码及自有研究装配/结构校验；未安装/运行目标测试/服务/demo/模型/DSH或真实资料。真实召回/费用/并发删除/恢复/退出均未测，未来只在授权隔离根逐层对账。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 67 | 15559 | — | — | 92049 |
| .mjs | source | 1 | 199 | 179 | 1 | — |
| .mjs | test | 1 | 197 | 175 | 14 | — |
| .md | example | 3 | 196 | — | — | 1293 |
| .js | source | 17 | 2832 | 1862 | 585 | — |
| .cjs | source | 2 | 35 | 35 | 0 | — |
| .ts | source | 17 | 3332 | 2621 | 316 | — |
| .tsx | source | 9 | 1032 | 918 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核EverOS根记忆服务的真实写入、查询、删除和失败边界，独立判断隔离采用及生产方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么，DSH 接入与直接替代有什么界限？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

本条根项目是EverOS Python库和本地记忆运行时/HTTP服务，pyproject声明1.6.0、Python>=3.12、Apache-2.0，真实类型infrastructure。不是原生DSH插件；README的DeepSeek Harness入口链接到EverMind-AI/plugins另一仓库，本固定根不能证明那份插件的Host兼容、自动采集或DSH工作流。

面向维护Agent/应用跨会话记忆的开发者，合格任务是将原对话/轨迹转为可读文件，之后按正确owner/app/project检索并能删改恢复。基线是人工Markdown+grep/SQLite全文索引，或自行把提取与向量库接起来。本仓增加用户episode/profile与Agent case/skill的分轨提取、索引与事件/后台演化组合；模型算法很多来自everalgo依赖，SQLite/LanceDB与LLM不归本仓原创。

README宣称Markdown真相源+SQLite/LanceDB索引、可编辑与反思，是待核主张；实际FastAPI生命周期build_application/start/aclose，v1/v2挂同路由，CLI入口也由pyproject指定。本文代表链核add/flush/队列→episode落盘、事件式Agent case、keyword检索/索引、删除及权限；不全审知识Wiki、全部反思策略/多模态/搜索算法/存储后端、外部DSH集成。材料统计不含Python不代表根只有少量JS/TS。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-7](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L1-L7)

Python库版本/许可证/最低Python。

```text
[project]
name = "everos"
version = "1.6.0"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
```

**依据 2 · 源码核查**：[pyproject.toml:23-45](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L23-L45)

SQLite/LanceDB依赖与版本限制。

<details>
<summary>查看原文（23行）</summary>

```text
dependencies = [
    # Core data validation & config
    "pydantic>=2.7.1",
    "pydantic-settings>=2.0.0",

    # Storage stack (md-first three-piece set)
    # Upper bound: 0.35.0 embeds lance-rust v9 (large storage/encoding jump, not
    # yet stable-released). 0.32-0.34 carry a compaction offset-overflow regression
    # (lance-format/lance#7653); we run 0.34.0 safely via the with_position=False
    # FTS workaround. Do not float past 0.34.x until 0.35 has been validated under
    # sustained churn (bounded + reclaimable index dir, no compaction crash) — see
    # docs/cascade_runbook.md. Never widen this floor back below 0.34 (older lance
    # cannot read v8 data). Before raising the ceiling, re-check that a
    # merge_insert cancelled by asyncio.timeout never lands after the
    # TimeoutError (0.34.0: 0 of 41 did); memory deletion's index fence
    # assumes it.
    "lancedb>=0.34.0,<0.35.0",    # Vector + BM25 + scalar filter (Arrow-based)
    # Floor, not a new package: lancedb pulls pyarrow in anyway. 25.0.1 stops
    # the per-value `import pytz` attempt in to_pylist() (24 walked sys.path
    # for every tz-aware timestamp) and materialises rows without a Scalar
    # per element; 25.0.0 lacks the latter and has a mimalloc exit crash.
    "pyarrow>=25.0.1",
    "aiosqlite>=0.20.0",          # Async SQLite driver (used by SA async engine)
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:98-112](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L98-L112)

everalgo精确版本依赖。

<details>
<summary>查看原文（15行）</summary>

```text
    # 0.6.0's `LLMClient.achat` contract. The packages declare loose ranges on
    # one another, so a fresh `pip install everos` would otherwise mix lines
    # the suite has never run together. Pin every one with `==` and raise them
    # together, with a run of the release smoke against a PyPI-resolved install.
    "everalgo-user-memory==0.9.0rc4",
    "everalgo-agent-memory==0.6.0rc3",
    "everalgo-rank==0.5.0rc3",
    "everalgo-knowledge==0.3.0rc2",
    "everalgo-boundary==0.4.1",
    "everalgo-core==0.6.0",
    "everalgo-clustering==0.3.0rc2",
]

[project.optional-dependencies]
multimodal = ["everalgo-parser[svg]==0.3.0rc2"]  # [svg] bundles cairosvg → SVG works by default
```

</details>

**依据 4 · 作者声明**：[README.md:37-43](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/README.md#L37-L43)

作者本地Markdown记忆定位。

```text
## Why EverOS

EverOS is a Python library and local-first memory runtime for agents and
makers. It gives one portable memory layer across coding assistants, apps,
devices, and workflows from day one. It stores conversations, files, and agent
trajectories as readable Markdown, then syncs local SQLite and LanceDB indexes
for fast retrieval and self-evolving reuse.
```

**依据 5 · 作者声明**：[README.md:92-100](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/README.md#L92-L100)

DSH链接指另一个plugins仓库。

```text
EverOS adds durable memory to the agent and workflow platforms below—and comes
built into Raven. Choose an integration to open its setup guide.

<table width="100%">
<tr>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/dsh"><img src="https://avatars.githubusercontent.com/u/148330874?s=200&amp;v=4" alt="DeepSeek Harness" width="72"><br><strong>DeepSeek Harness</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/hermes"><img src="https://github.com/user-attachments/assets/477eebc4-e615-4425-921e-368d7667e491" alt="Hermes" width="72"><br><strong>Hermes</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/openclaw"><img src="https://github.com/user-attachments/assets/01d948fe-1e2b-48e8-9b32-b8057cb3f336" alt="OpenClaw" width="72"><br><strong>OpenClaw</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/Raven"><img src="https://github.com/user-attachments/assets/27e1ea63-69d4-48b3-a884-7f0355926907" alt="Raven" width="72"><br><strong>Raven</strong></a></td>
```

**依据 6 · 源码核查**：[src/everos/entrypoints/api/app.py:83-103](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/app.py#L83-L103)

真实应用生命周期和FastAPI入口。

<details>
<summary>查看原文（21行）</summary>

```text
    @asynccontextmanager
    async def lifespan(fastapi_app: FastAPI) -> AsyncIterator[None]:
        built = application or build_application(settings or load_settings())
        fastapi_app.state.application = built
        try:
            await built.start()
            yield
        finally:
            await built.aclose()

    from everos import __version__

    app = FastAPI(
        title="everos",
        version=__version__,
        description="md-first memory extraction framework",
        lifespan=lifespan,
        docs_url="/docs" if enable_docs else None,
        redoc_url="/redoc" if enable_docs else None,
        openapi_url="/openapi.json" if enable_docs else None,
    )
```

</details>

**依据 7 · 源码核查**：[src/everos/entrypoints/api/app.py:137-155](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/app.py#L137-L155)

v1/v2同路由挂载。

<details>
<summary>查看原文（19行）</summary>

```text
    app.include_router(memorize.router, prefix="/api/v1")
    app.include_router(search.router, prefix="/api/v1")
    app.include_router(get.router, prefix="/api/v1")
    app.include_router(delete.router, prefix="/api/v1")
    app.include_router(ome.router, prefix="/api/v1")
    app.include_router(knowledge.router, prefix="/api/v1")
    # Operational, not a memory API: it stops a background subsystem. Mounted on
    # both prefixes so a caller does not have to know which one this build serves.
    app.include_router(cascade.router, prefix="/api/v1")
    app.include_router(tasks.router, prefix="/api/v1")
    # v2 — cloud-aligned name, same routers.
    app.include_router(memorize.router, prefix="/api/v2")
    app.include_router(search.router, prefix="/api/v2")
    app.include_router(get.router, prefix="/api/v2")
    app.include_router(delete.router, prefix="/api/v2")
    app.include_router(ome.router, prefix="/api/v2")
    app.include_router(knowledge.router, prefix="/api/v2")
    app.include_router(cascade.router, prefix="/api/v2")
    app.include_router(tasks.router, prefix="/api/v2")
```

</details>

#### 缺口

- 未核固定外部DSH插件、同用户需求与人工文件/简单索引对照。
  **影响**：不能承诺DSH接入可用、生成记忆实用或维护净节省。
  **进一步探讨**：将主服务与独立插件分别固定后在低敏任务比内容正确性、可查率与恢复人时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · add、flush、队列成功到实际文件写入经历什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

API /memory/add将DTO交MemoryService，async_mode且队列接纳或同app/project/session有积压时排队，flush无独立async选项，只在积压后排队；202携request_id/pending表示已接收，不是提取或索引可查。encode/admit在inbox写前检查UTF8/4MiB及每session50/全局200默认上限，检查和插入非同锁，不是严格并发容量保证；超限413/429须保留原请求。worker排除busy session、按id处理同scope，默认4并发；claim SQLite status processing commit，交付后mark success并清body，任务过7天可404不等于从未处理。

默认max_attempts=1，并非一失败就自动多次重试；配置提高才按backoff重试，因为memorize非原子，重跑可重复memcell或缺episode。进程死时processing启动requeue，最多3次replay，仍是at-least-once，不保证exactly-once。提取后的status写还可丢失，write_status有界重试失败由worker记录并reap；success只覆盖deliver返回，不覆盖所有后台演化和索引。

Memorizer按(app,project,session)持session锁做ingest/boundary，defer仅buffer，不提取；boundary将memcell批量SQLite提交，之后replace tail另调用，不能看成跨存储事务。产生cell后锁外supervise+shield实际提取，请求取消会继续，退出仅有界等待。user pipeline为每cell提取一份episode结果（不可用输出可重试LLM），按不同user sender写多个副本，owner锁内only_if memcell仍存在才writer append；writer按文件锁分配entry、临时文件fsync+replace落Markdown，失败清temp，不等于SQLite/Markdown/索引原子提交。

Agent pipeline本身只发布AgentPipelineStarted，不直接写case/skill；bootstrap注册Immediate策略，extract_agent_case实际调用依赖提取器、有gate拒绝或无assistant sender可skip，成功按agent写case，之后才发后续事件。Memorizer尽量尝试所有cells/pipelines并发布成功者事件，最后重抛首个失败，所以失败可伴部分文件已写；supervisor只日志不重新提取，不能按“extracted”或task success保证所有profile/skill已生成。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/routes/memorize.py:31-56](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/memorize.py#L31-L56)

202/413/429响应语义。

<details>
<summary>查看原文（26行）</summary>

```text
def _accepted(
    response: Response, request_id: str, queued: Queued
) -> SuccessEnvelope[AcceptedResponseData]:
    response.status_code = HTTP_202_ACCEPTED
    return SuccessEnvelope(
        request_id=request_id,
        data=AcceptedResponseData(
            message_count=queued.message_count, pending=queued.pending
        ),
    )


_ADD_RESPONSES: dict[int | str, dict[str, Any]] = {
    202: {
        "model": SuccessEnvelope[AcceptedResponseData],
        "description": "Queued: async_mode, or the session already had a backlog",
    },
    413: {"description": "Body over memorize.async_queue.max_payload_bytes"},
    429: {"description": "Queue at its per-session or global cap"},
}
_FLUSH_RESPONSES: dict[int | str, dict[str, Any]] = {
    202: {
        "model": SuccessEnvelope[AcceptedResponseData],
        "description": "Queued behind the session's backlog, how a flush is queued",
    },
    429: {"description": "Queue at its per-session or global cap"},
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/routes/memorize.py:60-108](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/memorize.py#L60-L108)

add/flush实际交服务及返回。

<details>
<summary>查看原文（49行）</summary>

```text
@router.post("/add", responses=_ADD_RESPONSES)
async def add_memory(
    req: Annotated[MemorizeAddRequest, ...],
    response: Response,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[AddResponseData] | SuccessEnvelope[AcceptedResponseData]:
    """Add messages into the user-memory + agent-memory pipelines."""
    result = await app.memory.add(
        req.model_dump(exclude={"async_mode", "defer_extraction"}),
        request_id=request_id,
        async_mode=req.async_mode,
        defer_extraction=req.defer_extraction,
    )
    if isinstance(result, Queued):
        return _accepted(response, request_id, result)
    return SuccessEnvelope(
        request_id=request_id,
        data=AddResponseData(
            message_count=result.message_count,
            status=result.status,
        ),
    )


@router.post("/flush", responses=_FLUSH_RESPONSES)
async def flush_memory(
    req: Annotated[MemorizeFlushRequest, ...],
    response: Response,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[FlushResponseData] | SuccessEnvelope[AcceptedResponseData]:
    """Force boundary detection over the current ``session_id`` buffer.

    Runs inline unless the session still has queued batches, in which case
    the flush joins the queue behind them and answers 202.
    """
    result = await app.memory.flush(
        session_id=req.session_id,
        request_id=request_id,
        app_id=req.app_id,
        project_id=req.project_id,
    )
    if isinstance(result, Queued):
        return _accepted(response, request_id, result)
    return SuccessEnvelope(
        request_id=request_id,
        data=FlushResponseData(status=result.status),
    )
```

</details>

**依据 3 · 源码核查**：[src/everos/service/memory/__init__.py:275-325](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/__init__.py#L275-L325)

inline/queue积压决策。

<details>
<summary>查看原文（51行）</summary>

```text
    async def add(
        self,
        payload: dict[str, Any],
        *,
        request_id: str,
        async_mode: bool,
        defer_extraction: bool,
    ) -> MemorizeResult | Queued:
        """Run one ``/add`` inline, or queue it.

        Queued when the caller asked for ``async_mode`` and the queue takes
        async work, **or** the session already has queued requests: running
        inline then would overtake requests the client was told are
        accepted.

        Raises:
            PayloadTooLargeError: Queued, and the body is over the limit.
            QueueSaturatedError: Queued, and the session or queue is full.
        """
        if (async_mode and self.accepts_async) or await self._has_backlog(payload):
            return await self._queue_request(
                payload,
                request_id=request_id,
                is_final=False,
                defer_extraction=defer_extraction,
            )
        return await self._memorize(payload, defer_extraction=defer_extraction)

    async def flush(
        self,
        *,
        session_id: str,
        request_id: str,
        app_id: str = "default",
        project_id: str = "default",
    ) -> FlushResult | Queued:
        """Run one ``/flush`` inline, or queue it behind the session's backlog.

        A flush has no ``async_mode`` (the Cloud API has none either); it is
        queued only when earlier requests of the session still are.

        Raises:
            QueueSaturatedError: Queued, and the session or queue is full.
        """
        payload = flush_payload(session_id, app_id, project_id)
        if await self._has_backlog(payload):
            return await self._queue_request(
                payload, request_id=request_id, is_final=True, defer_extraction=False
            )
        return await self._flush_inline(
            session_id=session_id, app_id=app_id, project_id=project_id
```

</details>

**依据 4 · 源码核查**：[src/everos/service/memory/_queue.py:126-178](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_queue.py#L126-L178)

限额/实际inbox入队与启动恢复。

<details>
<summary>查看原文（53行）</summary>

```text
    async def enqueue(
        self,
        payload: dict[str, Any],
        *,
        request_id: str,
        is_final: bool,
        defer_extraction: bool,
    ) -> int:
        """Persist one request as a ``queued`` row and wake the worker.

        Returns the session's unfinished row count, this row included.
        Raises :class:`PayloadTooLargeError` (413) or
        :class:`QueueSaturatedError` (429) **before** inserting; a rejected
        batch was never accepted and the caller must keep it.
        """
        body = encode_payload(payload, max_bytes=self._cfg.max_payload_bytes)
        session = SessionKey(
            app_id=str(payload.get("app_id", "default")),
            project_id=str(payload.get("project_id", "default")),
            session_id=str(payload["session_id"]),
        )
        pending = await admit(self._inbox, session, self._cfg)
        row = await self._inbox.enqueue(
            session,
            request_id=request_id,
            is_final=is_final,
            defer_extraction=defer_extraction,
            payload_json=body,
            message_count=len(payload.get("messages") or []),
        )
        self._wake.set()
        if self._task is not None and self._task.done():
            await self.ensure_running()  # a dead loop heals on the next use
        logger.info(
            "memorize_queue_enqueued",
            row_id=row.id,
            session_id=session.session_id,
            is_final=is_final,
            pending=pending + 1,
        )
        return pending + 1

    # ── lifecycle ──────────────────────────────────────────────────────────

    async def start(self) -> None:
        """Recover ``processing`` rows, purge expired ones, launch the loop."""
        if self._task is not None:
            return
        await recover_processing(self._inbox, max_replays=self._cfg.max_replays)
        await self._sweep()
        self._stopping = False
        self._wake.set()  # deliver whatever survived the restart right away
        self._task = asyncio.create_task(self._run(), name="memorize-queue-worker")
```

</details>

**依据 5 · 源码核查**：[src/everos/service/memory/_queue.py:275-316](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_queue.py#L275-L316)

忙会话排除/并发调度及退出中断。

<details>
<summary>查看原文（42行）</summary>

```text
    async def drain_once(self) -> int:
        """Deliver every ``queued`` row; return how many were started.

        Up to ``max_concurrency`` rows run at once, never two of one session:
        a session's rows go in ``id`` order, sessions run side by side.
        Returns once nothing is queued and nothing is in flight (after
        ``stop()``: once the rows in flight finished). One scheduler at a
        time: not for use while the loop is running.
        """
        started = 0
        try:
            while True:
                if self._status_write_lost:
                    await self._reap_lost()  # before the next claim, not after
                while (
                    not self._stopping
                    and len(self._in_flight) < self._cfg.max_concurrency
                ):
                    row = await self._inbox.claim_next(
                        exclude_sessions=self._busy_sessions()
                    )
                    if row is None:
                        break
                    task = asyncio.create_task(
                        self._process(row), name=f"memorize-queue-row-{row.id}"
                    )
                    self._in_flight[row.id] = (row, task)
                    started += 1
                    logger.info(
                        "memorize_queue_claimed",
                        row_id=row.id,
                        request_id=row.request_id,
                        session_id=row.session_id,
                        in_flight=len(self._in_flight),
                    )
                if not self._in_flight:
                    break
                await self._wait_for_progress()
        except asyncio.CancelledError:
            # stop() ran out of grace: abandon the rows in flight; the next
            # start() requeues them.
            await self._abandon_in_flight()
```

</details>

**依据 6 · 源码核查**：[src/everos/service/memory/_queue_steps.py:195-251](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_queue_steps.py#L195-L251)

实际attempt重试/failed/success清body。

<details>
<summary>查看原文（57行）</summary>

```text
async def _deliver_with_retries(
    row: MemorizeTask,
    *,
    deliver: Deliver,
    mark: Callable[..., Awaitable[None]],
    cfg: AsyncQueueSettings,
) -> None:
    assert row.id is not None
    for attempt in range(1, cfg.max_attempts + 1):
        try:
            # Inside the try: a row whose body was hand-edited into
            # garbage fails with that reason, not the whole pass.
            payload = json.loads(row.payload_json)
            await deliver(
                payload,
                is_final=row.is_final,
                defer_extraction=row.defer_extraction,
            )
        except Exception as exc:
            error = error_summary(exc)
            if attempt < cfg.max_attempts:
                await mark(
                    row.id,
                    status="processing",
                    attempt=attempt,
                    last_error=error,
                )
                logger.warning(
                    "memorize_queue_retry",
                    row_id=row.id,
                    session_id=row.session_id,
                    attempt=attempt,
                    error=error,
                )
                await asyncio.sleep(cfg.retry_backoff_seconds)
                continue
            # One write: a lost second write would let the sweep overwrite
            # a known failure with "outcome unknown".
            await mark(row.id, status="failed", attempt=attempt, last_error=error)
            logger.error(
                "memorize_queue_failed",
                row_id=row.id,
                session_id=row.session_id,
                attempts=attempt,
                message_count=row.message_count,
                error=error,
            )
            return
        # Drop the body: nothing reads a delivered row's payload, and
        # keeping it would hold seven days of request bodies on disk.
        await mark(row.id, status="success", attempt=attempt, payload_json="")
        logger.info(
            "memorize_queue_delivered",
            row_id=row.id,
            session_id=row.session_id,
            attempt=attempt,
        )
```

</details>

**依据 7 · 源码核查**：[src/everos/config/settings.py:495-538](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/config/settings.py#L495-L538)

非原子/并发软上限/默认attempt1/replay3/保留7天。

<details>
<summary>查看原文（44行）</summary>

```text
    rejects new rows with 429, and a body over ``max_payload_bytes`` with
    413. A delivered row drops its body at once, so pending and delivered rows
    stay around ``max_pending_total * max_payload_bytes``; failed rows keep
    their bodies for the retention period and are not capped, and SQLite does
    not shrink the file after a purge. The caps are checked without a lock,
    so concurrent requests overshoot a little.

    A row that fails ``max_attempts`` times (``retry_backoff_seconds``
    apart) is marked ``failed`` and skipped so one bad batch cannot hold
    up its session. The default is a single attempt: ``memorize()`` is
    not atomic (boundary detection writes memcells and consumes the
    session buffer before extraction runs), so re-running a batch after a
    partial failure duplicates memcells or reports success with the
    episode missing. Raise it only where that is acceptable. A row that was
    in flight when the process died is requeued and replayed on the next
    start (at-least-once); one that has been replayed ``max_replays`` times
    without ever finishing is marked ``failed`` instead, so a batch that
    kills the process cannot crash-loop it forever. Every row, whatever its
    status, is deleted ``row_retention_hours`` (default seven days) after
    it was created.

    Env binding:
        EVEROS_MEMORIZE__ASYNC_QUEUE__ENABLED
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_CONCURRENCY
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PENDING_PER_SESSION
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PENDING_TOTAL
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PAYLOAD_BYTES
        EVEROS_MEMORIZE__ASYNC_QUEUE__SCAN_INTERVAL_SECONDS
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_ATTEMPTS
        EVEROS_MEMORIZE__ASYNC_QUEUE__RETRY_BACKOFF_SECONDS
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_REPLAYS
        EVEROS_MEMORIZE__ASYNC_QUEUE__ROW_RETENTION_HOURS
    """

    enabled: bool = True
    max_concurrency: int = Field(default=4, ge=1)
    max_pending_per_session: int = Field(default=50, ge=1)
    max_pending_total: int = Field(default=200, ge=1)
    max_payload_bytes: int = Field(default=4 * 1024 * 1024, ge=1)
    scan_interval_seconds: float = Field(default=5.0, gt=0)
    max_attempts: int = Field(default=1, ge=1)
    retry_backoff_seconds: float = Field(default=2.0, ge=0)
    max_replays: int = Field(default=3, ge=1)
    row_retention_hours: float = Field(default=7 * 24.0, gt=0, le=366 * 24.0)
```

</details>

**依据 8 · 源码核查**：[src/everos/entrypoints/api/routes/tasks.py:51-65](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/tasks.py#L51-L65)

task请求状态与过期404。

<details>
<summary>查看原文（15行）</summary>

```text
@router.get("/{task_id}")
async def task_status(
    task_id: str,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[TaskItem]:
    """One accepted request's outcome.

    ``404`` once it has aged out of ``memorize.async_queue.row_retention_hours``
    (or never existed).
    """
    item = await app.ops.get_task(task_id)
    if item is None:
        raise NotFoundError(f"task {task_id} not found or expired")
    return SuccessEnvelope(request_id=request_id, data=item)
```

</details>

**依据 9 · 源码核查**：[src/everos/service/memory/_memorize.py:147-180](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_memorize.py#L147-L180)

实际session锁切分和shield继续提取。

<details>
<summary>查看原文（34行）</summary>

```text
            lock_key = session_key(
                payload.get("app_id", "default"),
                payload.get("project_id", "default"),
                session_id,
            )
            timeout_s = self._settings.memorize.session_lock_timeout_seconds
            async with LOCKS.hold("session", lock_key, max_wait=timeout_s):
                prepared = await self._cut(
                    payload,
                    mode=mode,
                    is_final=is_final,
                    defer_extraction=defer_extraction,
                )
            if isinstance(prepared, MemorizeResult):
                return prepared
            ingested, boundary = prepared
            # The cells exist, so their extraction must not die with a
            # cancelled request (a client that went away). The task is owned
            # by the supervisor, which keeps it, retrieves its outcome and
            # waits for it at shutdown; the request only shields it.
            extraction = self._extractions.supervise(
                self._extract(payload, ingested, boundary, mode=mode),
                session_id=session_id,
                memcell_ids=boundary.memcell_ids,
            )
            try:
                return await asyncio.shield(extraction)
            except asyncio.CancelledError:
                logger.warning(
                    "memorize_extraction_continues_after_cancel",
                    session_id=session_id,
                    memcell_ids=boundary.memcell_ids,
                )
                raise
```

</details>

**依据 10 · 源码核查**：[src/everos/memory/extract/boundary/detection.py:243-283](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/boundary/detection.py#L243-L283)

memcell先insert再tail替换。

<details>
<summary>查看原文（41行）</summary>

```text
    async def _commit_cells(
        self,
        session: SessionKey,
        merged: list[CanonicalMessage],
        result: DetectionResult,
        *,
        mode: Mode,
        message_count: int,
    ) -> BoundaryOutcome:
        """Record one memcell row per cell, then keep only the tail buffered."""
        memcell_ids = [_mint_memcell_id() for _ in result.cells]
        message_ids = split_message_ids(merged, result.cells)
        senders = [unique_senders(cell) for cell in result.cells]
        raw_type = _RAW_TYPE_BY_MODE[mode]
        await self._memcells.insert_many(
            session,
            [
                MemcellRecord(
                    memcell_id=memcell_id,
                    cell=cell,
                    raw_type=raw_type,
                    message_ids=ids,
                    sender_ids=cell_senders,
                )
                for memcell_id, cell, ids, cell_senders in zip(
                    memcell_ids, result.cells, message_ids, senders, strict=True
                )
            ],
        )
        last_cell_ts = max(cell.timestamp for cell in result.cells)
        if last_cell_ts:
            await self._session_buffer.touch_last_memcell(
                session, from_timestamp(last_cell_ts)
            )
        await self._session_buffer.replace(session, slice_tail(merged, result.tail))
        return BoundaryOutcome(
            cells=list(result.cells),
            memcell_ids=memcell_ids,
            per_cell_message_ids=message_ids,
            per_cell_all_senders=senders,
            status="extracted",
```

</details>

**依据 11 · 源码核查**：[src/everos/infra/persistence/sqlite/_repos/memcell.py:36-43](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/sqlite/_repos/memcell.py#L36-L43)

memcell实际SQLite commit。

```text
    async def insert_many(self, rows: list[Memcell]) -> list[Memcell]:
        """Insert MemCell rows in one transaction; rows are constructed by caller."""
        async with session_scope(self._factory) as s:
            s.add_all(rows)
            await s.commit()
            for r in rows:
                await s.refresh(r)
        return rows
```

**依据 12 · 源码核查**：[src/everos/memory/extract/pipeline/user_memory.py:79-111](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/user_memory.py#L79-L111)

每sender落盘后返回事件。

<details>
<summary>查看原文（33行）</summary>

```text
        user_senders = _unique_user_senders(cell)
        if user_senders:
            algo_ep = await self._extract(ingested, prepared)
            # The model writes in the conversation's language; what it chose
            # pins every extraction downstream of this episode.
            language = detect_output_language(algo_ep.episode)
            for sender_id in user_senders:
                ep = Episode.from_algo(
                    algo_ep,
                    owner_id=sender_id,
                    session_id=ingested.session_id,
                    sender_ids=list(prepared.sender_ids),
                    parent_id=memcell_id,
                    language=language,
                )
                ref = await self._persist(ingested, ep, memcell_id)
                if ref is None:
                    continue
                md_paths.append(ref.md_path)
                events.append(
                    EpisodeExtracted(
                        memcell_id=memcell_id,
                        episode_entry_id=ref.entry_id,
                        episode_text=ep.episode,
                        episode_timestamp_ms=ep.timestamp,
                        owner_id=ep.owner_id,
                        session_id=ingested.session_id,
                        app_id=ingested.app_id,
                        project_id=ingested.project_id,
                        source="pipeline",
                        language=language,
                    )
                )
```

</details>

**依据 13 · 源码核查**：[src/everos/memory/extract/pipeline/user_memory.py:127-150](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/user_memory.py#L127-L150)

实际调用依赖LLM提取器。

<details>
<summary>查看原文（24行）</summary>

```text
        extractor = self._ep_ext
        custom_instructions = self._instructions.load("episode_extract")

        async def attempt() -> AlgoEpisode:
            return await extractor.aextract(
                prepared.cell,
                sender_id=None,
                custom_instructions=custom_instructions,
            )

        with memory_span(
            "everos.extract",
            observation_type="generation",
            session_id=ingested.session_id,
            metadata={
                "app_id": ingested.app_id,
                "project_id": ingested.project_id,
                "memcell_id": prepared.memcell_id,
            },
        ) as extract_span:
            # The LLM client records token usage onto this span.
            algo_ep = await retry_llm_output(
                attempt, operator="episode", memcell_id=prepared.memcell_id
            )
```

</details>

**依据 14 · 源码核查**：[src/everos/memory/extract/pipeline/user_memory.py:163-185](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/user_memory.py#L163-L185)

only_if memcell存活后append。

<details>
<summary>查看原文（23行）</summary>

```text
        async def memcell_alive() -> bool:
            return bool(await self._memcell_store.find_by_ids([memcell_id]))

        with memory_span(
            "everos.persist.markdown",
            observation_type="span",
            session_id=ingested.session_id,
            metadata={
                "owner_id": ep.owner_id,
                "app_id": ingested.app_id,
                "project_id": ingested.project_id,
            },
        ) as persist_span:
            ref = await self._episode_store.append(
                Scope(
                    app_id=ingested.app_id,
                    project_id=ingested.project_id,
                    owner_id=ep.owner_id,
                    owner_type="user",
                ),
                ep,
                only_if=memcell_alive,
            )
```

</details>

**依据 15 · 源码核查**：[src/everos/infra/persistence/markdown/stores.py:104-121](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/stores.py#L104-L121)

owner锁内源检查到writer。

<details>
<summary>查看原文（18行）</summary>

```text
    async def _append_many(
        self,
        scope: Scope,
        items: Sequence[T],
        only_if: SourceCheck | NoSourceCheck,
    ) -> list[MemoryRef]:
        if not items:
            return []
        async with LOCKS.hold("owner", owner_lock(scope)):
            if not await self._sources_alive(scope, only_if, len(items)):
                return []
            eids = await self._writer.append_entries(
                scope.owner_id,
                [self._to_entry(item) for item in items],
                app_id=scope.app_id,
                project_id=scope.project_id,
            )
        return [self._ref(scope, eid) for eid in eids]
```

</details>

**依据 16 · 源码核查**：[src/everos/infra/persistence/markdown/_writers/base.py:161-191](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/_writers/base.py#L161-L191)

文件锁/entry编号/真实append。

<details>
<summary>查看原文（31行）</summary>

```text
        bucket = date or today_with_timezone()
        path = self._resolve_path(scope_id, bucket, app_id, project_id)
        if not items:
            return []

        async with self._writer.locked(path):
            base_count = await self._current_count(path)
            eids = [
                EntryId.next_for(self.schema.ENTRY_ID_PREFIX, bucket, base_count + i)
                for i in range(len(items))
            ]
            rendered = [
                (
                    render_structured_entry(
                        header=eid.format(),
                        inline=inline,
                        sections=sections,
                    ),
                    eid,
                )
                for eid, (inline, sections) in zip(eids, items, strict=True)
            ]
            frontmatter_updates = self._frontmatter_updates(
                scope_id, bucket, next_count=base_count + len(items)
            )
            await self._writer._append_entries_unlocked(
                path,
                rendered,
                frontmatter_updates=frontmatter_updates,
            )
            return eids
```

</details>

**依据 17 · 源码核查**：[src/everos/infra/persistence/markdown/_base/writer.py:150-176](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/_base/writer.py#L150-L176)

temp/fsync/replace实际落盘。

<details>
<summary>查看原文（27行）</summary>

```text
    async def write(self, path: Path, content: str) -> Path:
        """Atomically write ``content`` to ``path``.

        Steps:
            1. Assert the target resolves inside the memory root.
            2. ``mkdir -p`` the parent directory.
            3. Write to ``<parent>/.<name>.tmp.<uuid>``.
            4. ``flush`` + ``fsync`` the temp file.
            5. ``os.replace`` the temp file onto ``path`` (atomic on POSIX).

        Returns:
            ``path`` (resolved as written).

        Raises:
            PathTraversalError: If ``path`` resolves outside the memory root.
        """
        target = Path(path)
        self._ensure_within_root(target)
        await anyio.Path(target.parent).mkdir(parents=True, exist_ok=True)
        tmp = target.parent / f".{target.name}.tmp.{uuid.uuid4().hex}"
        try:
            await anyio.to_thread.run_sync(_write_and_fsync, tmp, content)
            await anyio.to_thread.run_sync(_replace_with_retry, tmp, target)
        except Exception:
            # Best-effort cleanup of the staging file on failure.
            await _unlink_quiet(tmp)
            raise
```

</details>

**依据 18 · 源码核查**：[src/everos/memory/extract/pipeline/agent_memory.py:20-38](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/agent_memory.py#L20-L38)

Agent pipeline只出事件。

<details>
<summary>查看原文（19行）</summary>

```text
class AgentMemoryPipeline:
    """Announce each cell to the agent-side strategies."""

    async def run_cell(
        self, ingested: IngestResult, prepared: PreparedCell
    ) -> CellOutcome:
        """Return the cell's ``AgentPipelineStarted``."""
        return CellOutcome(
            message_count=len(prepared.cell.items),
            events=[
                AgentPipelineStarted(
                    memcell_id=prepared.memcell_id,
                    session_id=ingested.session_id,
                    app_id=ingested.app_id,
                    project_id=ingested.project_id,
                    memcell=prepared.cell,
                )
            ],
        )
```

</details>

**依据 19 · 源码核查**：[src/everos/memory/strategies/extract_agent_case.py:66-110](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/strategies/extract_agent_case.py#L66-L110)

实际case提取及skip gate。

<details>
<summary>查看原文（45行）</summary>

```text
async def extract_agent_case(
    event: AgentPipelineStarted, deps: MemoryDeps
) -> list[Event]:
    """Distil one case from the memcell and file it under every agent sender."""
    # 1. Find the distinct assistant senders in this memcell; bail if none.
    agent_ids = _collect_agent_ids(event.memcell)
    if not agent_ids:
        logger.warning(
            "agent_case_skipped_no_assistant",
            memcell_id=event.memcell_id,
            session_id=event.session_id,
        )
        await deps.stores.memcell.mark_case_extracted(
            event.memcell_id, skip_reason=_NO_AGENT_SENDER, skip_detail={}
        )
        return []

    # 2. Run the extractor once; algo returns no case with the gate that
    #    rejected the memcell, or a single case.
    extractor = AgentCaseExtractor(llm=deps.llm, gate=_case_gate(deps))
    result = await extractor.aextract_with_reason(event.memcell)
    if not result.cases:
        logger.info(
            "agent_case_skipped",
            memcell_id=event.memcell_id,
            session_id=event.session_id,
            reason=result.reason,
            detail=result.detail,
        )
        await deps.stores.memcell.mark_case_extracted(
            event.memcell_id,
            skip_reason=str(result.reason),
            skip_detail=result.detail,
        )
        return []

    # 3. File the same case under every agent sender and announce each copy
    #    → downstream trigger_skill_clustering.
    (algo_case,) = result.cases
    filed = [
        await _file_case(algo_case, agent_id, event, deps) for agent_id in agent_ids
    ]
    extracted: list[Event] = [case for case in filed if case is not None]
    await deps.stores.memcell.mark_case_extracted(
        event.memcell_id, skip_reason=None, skip_detail={}
```

</details>

**依据 20 · 源码核查**：[src/everos/memory/strategies/extract_agent_case.py:140-158](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/strategies/extract_agent_case.py#L140-L158)

case落store与源存活门。

<details>
<summary>查看原文（19行）</summary>

```text
    case = agent_case_mapper.from_algo(
        algo_case,
        owner_id=agent_id,
        session_id=event.session_id,
        parent_id=event.memcell_id,
    )
    scope = Scope(
        app_id=event.app_id,
        project_id=event.project_id,
        owner_id=agent_id,
        owner_type="agent",
    )

    async def memcell_alive() -> bool:  # a session deletion removes it first
        return bool(await deps.stores.memcell.find_by_ids([event.memcell_id]))

    ref = await deps.stores.agent_case.append(scope, case, only_if=memcell_alive)
    if ref is None:
        return None
```

</details>

**依据 21 · 源码核查**：[src/everos/service/bootstrap.py:450-460](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/bootstrap.py#L450-L460)

实际注册全部策略。

<details>
<summary>查看原文（11行）</summary>

```text
    engine = OfflineEngine(
        config=OMEConfig(
            jobstore_path=root.ome_db,
            config_path=root.ome_config,
            max_concurrent_runs=ome.max_concurrent_runs,
            run_timeout_seconds=ome.run_timeout_seconds,
        )
    )
    for spec in STRATEGY_SPECS:
        engine.register(to_ome_strategy(spec, deps))
    return engine
```

</details>

**依据 22 · 源码核查**：[src/everos/service/memory/_memorize.py:237-265](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_memorize.py#L237-L265)

多cell成功事件继续/失败最后重抛。

<details>
<summary>查看原文（29行）</summary>

```text
        pipelines: dict[str, Pipeline] = {"user_memory": self._user_pipeline}
        if mode == "agent":
            pipelines["agent_memory"] = self._agent_pipeline
        outcomes: dict[str, list[CellOutcome]] = {track: [] for track in pipelines}
        first_error: BaseException | None = None
        for prepared in _prepared_cells(boundary):
            results = await asyncio.gather(
                *(p.run_cell(ingested, prepared) for p in pipelines.values()),
                return_exceptions=True,
            )
            for track, result in zip(pipelines, results, strict=True):
                if isinstance(result, BaseException):
                    _log_cell_failure(ingested, prepared, track, result)
                    first_error = first_error or result
                    continue
                outcomes[track].append(result)
                await self._bus.publish(result.events)
        if first_error is not None:
            raise first_error

        user = PipelineOutcome.from_cells("user_memory", outcomes["user_memory"])
        agent_status: TrackStatus = (
            PipelineOutcome.from_cells("agent_memory", outcomes["agent_memory"]).status
            if mode == "agent"
            else "skipped"
        )
        return MemorizeResult(
            message_count=len(payload.get("messages", [])),
            status=_merge_status(user.status, agent_status),
```

</details>

**依据 23 · 源码核查**：[src/everos/service/memory/_extraction.py:51-73](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_extraction.py#L51-L73)

supervisor持task/取失败日志非重试。

<details>
<summary>查看原文（23行）</summary>

```text
        task: asyncio.Task[T] = asyncio.ensure_future(coro)
        self._tasks.add(task)

        def _done(t: asyncio.Task[T]) -> None:
            self._tasks.discard(t)
            if t.cancelled():
                logger.error(
                    f"{label}_cancelled",
                    session_id=session_id,
                    memcell_ids=memcell_ids,
                )
                return
            exc = t.exception()
            if exc is not None and not isinstance(exc, expected):
                logger.error(
                    f"{label}_failed",
                    session_id=session_id,
                    memcell_ids=memcell_ids,
                    error=f"{type(exc).__name__}: {exc}",
                )

        task.add_done_callback(_done)
        return task
```

</details>

**依据 24 · 源码核查**：[src/everos/infra/persistence/sqlite/_repos/memorize_inbox.py:71-76](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/sqlite/_repos/memorize_inbox.py#L71-L76)

claim实际SQLite processing commit。

```text
            row = (await s.execute(stmt)).scalars().first()
            if row is None:
                return None
            row.status = "processing"
            await s.commit()
            await s.refresh(row)
```

**依据 25 · 源码核查**：[src/everos/service/memory/_queue_steps.py:104-120](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_queue_steps.py#L104-L120)

状态写有界重试与失败返回。

<details>
<summary>查看原文（17行）</summary>

```text
async def write_status(
    inbox: MemorizeInboxStore, row_id: int, *, retry_seconds: float, **values: Any
) -> bool:
    """Write a row's status, retrying a failing write; ``False`` when it was lost."""
    for attempt in range(1, _MARK_ATTEMPTS + 1):
        try:
            await inbox.mark(row_id, **values)
            return True
        except Exception:
            if attempt == _MARK_ATTEMPTS:
                logger.exception(
                    "memorize_queue_status_write_lost",
                    row_id=row_id,
                    status=values.get("status"),
                )
                return False
            await asyncio.sleep(retry_seconds)
```

</details>

#### 缺口

- 未核真实模型质量、磁盘中断、队列重放与文件/索引追平分布。
  **影响**：接收/提取完成与业务记忆正确可查是不同状态；部分失败需人工对账。
  **进一步探讨**：隔离数据根注入LLM/落盘/状态写故障及重启，逐个核memcell、Markdown、任务和搜索结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 索引与检索实际调用什么，何时可见、依赖哪些模型？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

search路由直接调用memory.search→SearchManager，先compile_filters固定owner_id/type/app/project并拒DSL重设保留字段，再校验provider，用户并行取episode/profile/buffer，Agent取cases/skills/buffer。keyword路径tokenize后sparse_search，经IndexAdapter转LanceIndexContract，对字段建OR全文query、附where、limit并to_list，再整形结果；不是每次grep当前Markdown，文件刚写/删除而索引未追平会有可见性窗口。过滤条件由请求顶层owner等提供，不证明调用者就是该owner。

向量、hybrid、agentic、llm_multiround都要求embedding；Agent hybrid默认cross-encoder lane还要rerank，可opt-in LLM lane，agentic也需要rerank；缺provider显式422，Agent llm_multiround当前不支持。keyword不要求embedding不等于整个应用无需LLM：提取/build仍有LLM条件，进一步检索可能发query到provider、引入额外费用。不能将关键词、混合和多轮质量合并成一个“记忆召回好”。

bootstrap真正给cascade和删除eraser共享DeleteFence，orchestrator启动时recover/reconcile后启watcher、scanner、worker；worker按新增/删除调用handler，文件消失转delete，只有当前lsn仍属于自己才mark_done，旧claim要重排修复。代表daily-log handler读Markdown、读已有索引diff、embedding变更项后upsert/delete；实际Lance upsert是PRIMARY_KEY merge_insert update/insert，delete执行table.delete。改变Markdown、提取完成、事件已交付、索引done和某查询命中是不同阶段。

DeleteFence在run开始注册、写前剔除fenced行，upsert后再删期间新fence命中的行，结束prune；是同进程cascade防旧读回写的局部机制，非持久跨进程墓碑或搜索时权限过滤。索引/模型失败与停止会延长窗口，当前不能对读后立即可查、准确率或所有后台反思完成作承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/routes/search.py:19-22](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/search.py#L19-L22)

API真实委派search。

```text
@router.post("/search", response_model=SearchResponse)
async def post_search(req: SearchRequest, app: ApplicationDep) -> SearchResponse:
    """Hybrid retrieval across the configured memory backends."""
    return await app.memory.search(req)
```

**依据 2 · 源码核查**：[src/everos/service/memory/__init__.py:146-152](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/__init__.py#L146-L152)

service转SearchManager。

```text
    async def search(self, req: SearchRequest) -> SearchResponse:
        """Hybrid retrieval across the configured memory backends."""
        return await self._search_manager.search(req)

    async def get(self, req: GetRequest) -> GetResponse:
        """Paginated listing over the requested ``memory_type``."""
        return await self._get_manager.get(req)
```

**依据 3 · 源码核查**：[src/everos/memory/search/manager.py:221-253](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/manager.py#L221-L253)

实际过滤/校验/分轨调用。

<details>
<summary>查看原文（33行）</summary>

```text
            # Compile filters first: a malformed `filters` payload is a user
            # input error (422) and should surface before the server-side
            # component guard (500). The two steps are independent.
            where = compile_filters(
                req.filters,
                owner_id=req.owner_id,
                owner_type=req.owner_type,
                app_id=req.app_id,
                project_id=req.project_id,
            )
            self._validate_components(req)

            if req.owner_type == "user":
                episodes, profiles, unprocessed = await asyncio.gather(
                    self._search_episodes(req, where),
                    self._fetch_profile(req),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    episodes=episodes,
                    profiles=profiles,
                    unprocessed_messages=unprocessed,
                )
            else:  # "agent"
                (cases, skills), unprocessed = await asyncio.gather(
                    self._search_cases_and_skills(req, where),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    agent_cases=cases,
                    agent_skills=skills,
                    unprocessed_messages=unprocessed,
                )
```

</details>

**依据 4 · 源码核查**：[src/everos/memory/search/filters.py:51-72](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/filters.py#L51-L72)

固定owner/app/project与deprecated过滤。

<details>
<summary>查看原文（22行）</summary>

```text
def compile_filters(
    node: FilterNode | None,
    *,
    owner_id: str,
    owner_type: str,
    app_id: str = "default",
    project_id: str = "default",
) -> Filter:
    """Validate request filters and return one normalized predicate tree."""
    base: list[Filter] = [
        eq("owner_id", owner_id),
        eq("owner_type", owner_type),
        eq("app_id", app_id),
        eq("project_id", project_id),
    ]
    if owner_type == "user":
        base.append(is_null("deprecated_by"))
    if node is not None:
        compiled = _compile_node(node.model_dump(exclude_none=True))
        if compiled is not None:
            base.append(compiled)
    return all_of(*base)
```

</details>

**依据 5 · 源码核查**：[src/everos/memory/search/filters.py:88-95](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/filters.py#L88-L95)

保留字段不可DSL覆盖。

```text
    for field, value in raw.items():
        if field in RESERVED_FIELDS:
            raise FilterError(
                f"filter field {field!r} is reserved; pass it at the top of the request"
            )
        if field not in ALLOWED_FIELDS:
            raise FilterError(f"unsupported filter field: {field!r}")
        parts.append(compile_predicate(field, value))
```

**依据 6 · 源码核查**：[src/everos/memory/search/manager.py:411-429](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/manager.py#L411-L429)

keyword实际sparse召回到结果。

<details>
<summary>查看原文（19行）</summary>

```text
        # ── KEYWORD / VECTOR: single-route recall ──
        if fusion_mode is None:
            with memory_span(
                "everos.search.recall",
                observation_type="retriever",
                metadata={"phase": "single_route", "method": req.method.value},
            ):
                if req.method == SearchMethod.KEYWORD:
                    recalled = await self._ep.sparse_recall(
                        req.query, where, limit=self._recall_limit(req.top_k)
                    )
                else:
                    recalled = await self._maxsim_atomic_recall(req, where, top_k)
            # ``atomic_facts`` stays empty: facts come back only when the HYBRID
            # pipeline surfaces them with a score (see ``reshape_hybrid_output``).
            # Single-route recall has no per-fact score against the query, so
            # we do not back-fill — that would emit ``score=0.0`` facts whose
            # semantics are ambiguous.
            return shape_episodes(recalled.candidates[:top_k], recalled.stored_by_id)
```

</details>

**依据 7 · 源码核查**：[src/everos/memory/search/recall/episode.py:29-44](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/recall/episode.py#L29-L44)

tokenize和index.sparse_search。

<details>
<summary>查看原文（16行）</summary>

```text
    async def sparse_recall(
        self, query: str, where: Filter, *, limit: int
    ) -> RecallResult[Episode]:
        """BM25 recall via OR-mode BooleanQuery.

        Each tokenised term becomes a ``SHOULD`` clause so a single
        IDF≈0 token (typically the partition owner's own name on
        owner-scoped corpora) cannot poison the entire query.
        Mirrors enterprise's ``bool.should + minimum_should_match=1``
        ES design.
        """
        terms = [term for term in self._deps.tokenizer.tokenize(query) if term]
        if not terms:
            return RecallResult.empty()
        hits = await self._index.sparse_search(terms, where, limit=limit)
        return from_hits(hits, source="keyword")
```

</details>

**依据 8 · 源码核查**：[src/everos/infra/persistence/index/adapters.py:79-91](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/index/adapters.py#L79-L91)

adapter真实repo调用。

<details>
<summary>查看原文（13行）</summary>

```text
    async def sparse_search(
        self, terms: Sequence[str], where: Filter, *, limit: int
    ) -> list[SearchHit[T]]:
        rows = await self._repo.sparse_search(
            terms, where, columns=self._repo.schema.BM25_FIELDS, limit=limit
        )
        return [self._hit(row, _bm25_score(row)) for row in rows]

    async def dense_search(
        self, vector: Sequence[float], where: Filter, *, limit: int
    ) -> list[SearchHit[T]]:
        rows = await self._repo.dense_search(vector, where, limit=limit)
        return [self._hit(row, _cosine_similarity(row)) for row in rows]
```

</details>

**依据 9 · 源码核查**：[src/everos/infra/persistence/lancedb/_repos/_contract.py:183-206](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/lancedb/_repos/_contract.py#L183-L206)

实际where全文query和to_list。

<details>
<summary>查看原文（24行）</summary>

```text
    async def sparse_search(
        self,
        query_terms: Sequence[str],
        where: Filter | str | None,
        *,
        columns: Sequence[str] | None = None,
        limit: int,
    ) -> list[dict[str, Any]]:
        fields = list(columns or getattr(self.schema, "BM25_FIELDS", ()))
        clean_terms = [term for term in query_terms if term]
        if not clean_terms or not fields:
            return []
        table = await self._table()
        expression = where if isinstance(where, str) else _render_optional(where)

        async def _query_one(field: str) -> list[dict[str, Any]]:
            query = build_or_query(clean_terms, field)
            assert query is not None
            builder = table.query().nearest_to_text(query)
            if expression:
                builder = builder.where(expression)
            return await builder.limit(limit).to_list()

        per_column = await asyncio.gather(*(_query_one(field) for field in fields))
```

</details>

**依据 10 · 源码核查**：[src/everos/memory/search/manager.py:761-800](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/manager.py#L761-L800)

具体provider与不支持分支。

<details>
<summary>查看原文（40行）</summary>

```text
        method = req.method
        is_agent_hybrid = method == SearchMethod.HYBRID and req.owner_type == "agent"

        needs_embedding = method in (
            SearchMethod.VECTOR,
            SearchMethod.HYBRID,
            SearchMethod.AGENTIC,
            SearchMethod.LLM_MULTIROUND,
        )
        if needs_embedding and self._embedding is None:
            raise ProviderNotConfiguredError(
                provider="embedding",
                feature=_feature_name(method, req.owner_type),
            )

        if method == SearchMethod.LLM_MULTIROUND and req.owner_type == "agent":
            raise RuntimeError(
                "method='llm_multiround' is only supported for user memory; "
                "provide user_id instead of agent_id"
            )

        # agent HYBRID cross-encoder lane (enable_llm_rerank=False, the
        # default) reaches ``search_agent_skills_hybrid``, which needs a
        # real rerank provider; the LLM lane reranks via the LLM instead
        # and is exempt.
        if is_agent_hybrid and not req.enable_llm_rerank and self._reranker is None:
            raise ProviderNotConfiguredError(
                provider="rerank",
                feature="agent_hybrid",
                alternative_hint=(
                    "Set enable_llm_rerank=true to route through the "
                    "LLM rerank lane instead of the cross-encoder "
                    "provider."
                ),
            )

        if method == SearchMethod.AGENTIC and self._reranker is None:
            raise ProviderNotConfiguredError(
                provider="rerank", feature="agentic_search"
            )
```

</details>

**依据 11 · 源码核查**：[src/everos/service/bootstrap.py:321-334](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/bootstrap.py#L321-L334)

cascade/eraser共享fence与服务接线。

<details>
<summary>查看原文（14行）</summary>

```text
    fence = DeleteFence(warn_entries=settings.cascade.delete_fence_warn_entries)
    cascade = CascadeOrchestrator(
        memory_root=root,
        tokenizer=tokenizer,
        embedding=providers.embedding,
        index=index,
        sqlite=sqlite,
        watcher_enabled=settings.cascade.watcher_enabled,
        fence=fence,
    )
    eraser = FencedIndexEraser(index.repositories, fence, sqlite.md_change_state)
    memory = _build_memory_service(
        settings, providers, deps, tokenizer, OmeEventBus(engine), eraser
    )
```

</details>

**依据 12 · 源码核查**：[src/everos/infra/cascade/orchestrator.py:294-309](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/orchestrator.py#L294-L309)

真实recover/reconcile及三后台启动。

<details>
<summary>查看原文（16行）</summary>

```text
        if self._started:
            return
        orphans = await self._ledger.recover_orphan_processing()
        if orphans:
            logger.info("cascade_recovered_orphan_processing", count=orphans)
        await reconcile_index_once(self._memory_root, self._ledger)
        await self._snapshot_index_rows()
        if self._watcher_enabled:
            loop = asyncio.get_running_loop()
            self._watcher = CascadeWatcher(self._memory_root, loop, self._ledger)
            self._watcher.start()
        else:
            logger.info("cascade_watcher_disabled")
        await self._scanner.start()
        await self._worker.start()
        self._started = True
```

</details>

**依据 13 · 源码核查**：[src/everos/infra/cascade/_worker/_worker.py:418-436](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_worker/_worker.py#L418-L436)

真实handler分发与文件消失转delete。

<details>
<summary>查看原文（19行）</summary>

```text
        retry_count = row.retry_count
        last_error: str = ""
        applied: ChangeType = row.change_type  # type: ignore[assignment]  # str column
        for attempt in range(self._max_retry + 1):
            try:
                if row.change_type == "deleted":
                    outcome = await handler.handle_deleted(row.md_path)
                else:
                    try:
                        outcome = await handler.handle_added_or_modified(row.md_path)
                    except FileNotFoundError:
                        # The md disappeared between scanner enqueue and here
                        # (delete/modify race — cascade delete event may not
                        # arrive if it fires while the row is already in
                        # ``processing``). Fold into a deletion so the row
                        # completes with ``mark_done`` instead of failing, and
                        # record the fold: the row must describe the index.
                        outcome = await handler.handle_deleted(row.md_path)
                        applied = "deleted"
```

</details>

**依据 14 · 源码核查**：[src/everos/infra/cascade/_worker/_worker.py:512-527](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_worker/_worker.py#L512-L527)

当前lsn才done。

<details>
<summary>查看原文（16行）</summary>

```text
            # The handler may have run long enough for another drainer to
            # claim a newer version of this path. Its index write is already
            # applied at this point, so re-enqueue the current row instead of
            # marking the old claim done; the next drain repairs the index
            # from the latest md (#545). A same-lsn processing row is still
            # ours and follows the normal mark_done path.
            current = await self._ledger.read_one(row.md_path)
            if current is None:
                return None
            if current.lsn == row.lsn and current.status == "processing":
                await self._write_terminal(
                    self._ledger.mark_done,
                    row.md_path,
                    kind=row.kind,
                    change_type=applied,
                )
```

</details>

**依据 15 · 源码核查**：[src/everos/infra/cascade/_projections/_daily_log_base.py:105-168](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_projections/_daily_log_base.py#L105-L168)

读文件/diff/embed与写前fence。

<details>
<summary>查看原文（64行）</summary>

```text
    async def handle_added_or_modified(self, md_path: str) -> HandlerOutcome:
        # Registered before the file is read, ended however the run ends:
        # a deletion that fences rows while this run is going keeps them out
        # of this run's upsert (``_apply_lance_changes``).
        fence = self._deps.fence
        token = fence.register_run() if fence is not None else None
        try:
            return await self._project(md_path)
        finally:
            if fence is not None and token is not None:
                fence.end_run(token)

    async def _project(self, md_path: str) -> HandlerOutcome:
        absolute = self._deps.memory_root.root / md_path
        parsed = await MarkdownReader.read(absolute)
        new_entries = [
            ParsedEntry(
                entry_id=entry.id,
                structured=entry.as_structured(),
                content_sha256=self._content_sha256(entry.as_structured()),
            )
            for entry in parsed.entries
        ]

        existing = await self.index_repo.find_where(
            eq("md_path", md_path),
            limit=10_000,
            skip_vectors=True,
        )
        owner_id, owner_type = resolve_owner(parsed.frontmatter, md_path)
        app_id, project_id = resolve_scope(md_path)

        to_build, skipped = self._diff_entries(new_entries, existing)
        to_upsert = await self._embed_entries(
            to_build,
            owner_id,
            owner_type,
            app_id,
            project_id,
            md_path,
        )
        # Rows a memory deletion fenced while this run was going stay out.
        fence = self._deps.fence
        if fence is not None:
            to_upsert = [row for row in to_upsert if not fence.blocks(row)]
        new_by_id = {e.entry_id for e in new_entries}
        to_delete_ids = [
            row.entry_id for row in existing if row.entry_id not in new_by_id
        ]

        await self._apply_lance_changes(to_upsert, to_delete_ids, md_path)
        await self._propagate_deprecations(
            parsed.frontmatter,
            owner_id,
            app_id,
            project_id,
        )
        return HandlerOutcome(
            md_path=md_path,
            kind=self.kind,
            upserted=len(to_upsert),
            deleted=len(to_delete_ids),
            skipped=skipped,
        )
```

</details>

**依据 16 · 源码核查**：[src/everos/infra/cascade/_projections/_daily_log_base.py:239-269](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_projections/_daily_log_base.py#L239-L269)

真实upsert后再次fence清理及delete。

<details>
<summary>查看原文（31行）</summary>

```text
    async def _apply_lance_changes(
        self,
        to_upsert: list[Any],
        to_delete_ids: list[str],
        md_path: str,
    ) -> None:
        """Flush upserts and deletes to LanceDB.

        The fence is checked again once the upsert returned: a deletion that
        fenced a row after this run filtered it relied on this run to delete
        it (the two share no lock).
        """
        fence = self._deps.fence
        if to_upsert:
            await self.index_repo.upsert(to_upsert)
            late = [r for r in to_upsert if fence.blocks(r)] if fence else []
            if late:
                await self.index_repo.delete(fence.filter_for(late))
        if to_delete_ids:
            await self.index_repo.delete(
                all_of(eq("md_path", md_path), one_of("entry_id", to_delete_ids))
            )

    async def handle_deleted(self, md_path: str) -> HandlerOutcome:
        deleted = await self.index_repo.delete_by_md_path(md_path)
        return HandlerOutcome(
            md_path=md_path,
            kind=self.kind,
            upserted=0,
            deleted=deleted,
            skipped=0,
```

</details>

**依据 17 · 源码核查**：[src/everos/infra/persistence/lancedb/_base/repository.py:566-578](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/lancedb/_base/repository.py#L566-L578)

真实merge_insert。

<details>
<summary>查看原文（13行）</summary>

```text
        key = getattr(self.schema, "PRIMARY_KEY", None)
        if not key:
            raise ValueError(
                f"derived-index model {self.schema.__name__} has no PRIMARY_KEY"
            )
        async with self._locked(self._timeouts.write, "upsert"):
            table = await self._table()
            await (
                table.merge_insert(list(key))
                .when_matched_update_all()
                .when_not_matched_insert_all()
                .execute(self._to_arrow(records))
            )
```

</details>

**依据 18 · 源码核查**：[src/everos/infra/persistence/lancedb/_base/repository.py:1001-1005](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/lancedb/_base/repository.py#L1001-L1005)

实际table.delete。

```text
    async def delete(self, predicate: str) -> None:
        """Delete rows matching a SQL-like predicate."""
        async with self._locked(self._timeouts.write, "delete"):
            table = await self._table()
            await table.delete(predicate)
```

**依据 19 · 源码核查**：[src/everos/infra/cascade/_fence.py:67-98](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_fence.py#L67-L98)

进程内run/fence成员。

<details>
<summary>查看原文（32行）</summary>

```text
    def register_run(self) -> int:
        """A cascade run starts (before it reads its file); returns its token."""
        self._seq += 1
        self._runs.add(self._seq)
        self._publish()
        return self._seq

    def end_run(self, token: int) -> None:
        """A cascade run ended, however it ended."""
        self._runs.discard(token)
        self._prune()

    def add(self, keys: Iterable[RowKey]) -> None:
        """Fence the rows a deletion is about to delete from the index."""
        if not self._runs:
            return  # every later run reads the rewritten file
        self._seq += 1
        before = len(self._entries)
        for key in keys:
            self._entries[key] = self._seq
        self._prune()
        if before <= self._warn_entries < len(self._entries):
            logger.warning(
                "memory_delete_fence_large",
                entries=len(self._entries),
                runs=len(self._runs),
                threshold=self._warn_entries,
            )

    def blocks(self, row: Any) -> bool:
        """Whether ``row`` (an index record) was fenced by a deletion."""
        return (row.app_id, row.project_id, row.id) in self._entries
```

</details>

**依据 20 · 源码核查**：[src/everos/infra/cascade/_fence.py:112-119](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_fence.py#L112-L119)

旧run结束后prune非永久墓碑。

```text
    def _prune(self) -> None:
        """Drop the entries no run in flight could have read past."""
        oldest = min(self._runs, default=None)
        if oldest is None:
            self._entries.clear()
        else:
            self._entries = {k: s for k, s in self._entries.items() if s > oldest}
        self._publish()
```

#### 缺口

- 未验证已标注召回质量、索引滞后、故障恢复及跨进程/多账户隔离。
  **影响**：只能确认静态链路，不能保证读后立即可见或删除后查询立即无结果。
  **进一步探讨**：按相同低敏已标注资料，分keyword/hybrid测准确率、追平延迟和故障后的Markdown/索引一致性。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · owner 字段是否授权，文件与模型数据边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

HTTP应用注册CORS、metrics/profile/request-ID与业务router，依赖只取application/request_id；配置明确不带内置认证，默认127.0.0.1:8000。可信本机调用是威胁模型，改0.0.0.0前需自有认证网关；CORS和user_id/app_id/project_id是浏览器与检索范围机制，不是将调用者身份绑定owner的ACL。持该API能力的可信调用者可指定其他scope查询/删除；不能把正交检索描述为已验租户隔离。

记忆是明文Markdown，SQLite有原始memcell/buffer/inbox，失败queue body保留默认七天；仅成功队列清body不清所有日志/备份/provider数据。模型提取实际把cell交配置LLM，hybrid等额外embedding/rerank；local-first描述的是落盘和索引组织，不是全离线或内容绝不出机。API key、.env、磁盘权限、provider保留期和追踪content开关需部署者核，未运行真实模型/资料。

文件writer有实际root.resolve包含检查，临时同级fsync/replace与每path锁；owner删除又要求target名与resolved路径准确位于users/agents下，确实有路径门；与请求身份授权仍须分开。路径门与认证不同，也不是免疫所有文件系统竞态/恶意导入：本轮未全审多模态parser、所有wiki/upload或所有provider/观测外发，不能以代表writer覆盖整仓安全。SECURITY仍写1.4.x current，与pyproject1.6.0不同，作为维护文档滞后，不推实际不受支持或已存在漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/app.py:108-124](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/app.py#L108-L124)

实际middleware未认证。

<details>
<summary>查看原文（17行）</summary>

```text
    # Exception handlers
    register_handlers(app)

    # Middleware order: earlier `add_middleware` calls become inner, later ones outer.
    # CORS innermost (matches base_app.py legacy pattern).
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins or DEFAULT_CORS_ORIGINS,
        allow_credentials=cors_allow_credentials,
        allow_methods=cors_allow_methods or DEFAULT_CORS_ALLOW_METHODS,
        allow_headers=cors_allow_headers or DEFAULT_CORS_ALLOW_HEADERS,
    )
    app.add_middleware(PrometheusMiddleware)
    app.add_middleware(ProfileMiddleware)
    # Outermost: every request gets a request id before any other middleware
    # or handler runs, so all logs + the response header carry it.
    app.add_middleware(RequestIdMiddleware)
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/dependencies.py:18-33](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/dependencies.py#L18-L33)

依赖只提供app和request-ID。

<details>
<summary>查看原文（16行）</summary>

```text
def extract_request_id(request: Request) -> str:
    """Return the request_id set by middleware, or mint a fresh fallback."""
    rid = getattr(request.state, "request_id", None)
    return str(rid) if rid else gen_request_id()


def application(request: Request) -> Application:
    """The :class:`Application` the app's lifespan (or ``create_app``) installed."""
    return request.app.state.application


ApplicationDep = Annotated[Application, Depends(application)]
"""Route parameter type for the installed :class:`Application`."""

RequestIdDep = Annotated[str, Depends(extract_request_id)]
"""Route parameter type for the request id."""
```

</details>

**依据 3 · 源码核查**：[src/everos/config/settings.py:95-107](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/config/settings.py#L95-L107)

无认证与默认loopback具体声明/值。

<details>
<summary>查看原文（13行）</summary>

```text
    Default ``host = "127.0.0.1"`` keeps the server on loopback only,
    matching the threat model in ``SECURITY.md``: EverOS ships **no
    built-in authentication**, so binding to a routable interface
    (``0.0.0.0`` etc.) without your own gateway / auth layer in front
    is unsupported.

    Env binding:
        EVEROS_API__HOST
        EVEROS_API__PORT
    """

    host: str = "127.0.0.1"
    port: int = Field(default=8000, ge=1, le=65535)
```

</details>

**依据 4 · 源码核查**：[src/everos/memory/search/filters.py:51-72](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/search/filters.py#L51-L72)

范围基于请求字段，不是身份认证。

<details>
<summary>查看原文（22行）</summary>

```text
def compile_filters(
    node: FilterNode | None,
    *,
    owner_id: str,
    owner_type: str,
    app_id: str = "default",
    project_id: str = "default",
) -> Filter:
    """Validate request filters and return one normalized predicate tree."""
    base: list[Filter] = [
        eq("owner_id", owner_id),
        eq("owner_type", owner_type),
        eq("app_id", app_id),
        eq("project_id", project_id),
    ]
    if owner_type == "user":
        base.append(is_null("deprecated_by"))
    if node is not None:
        compiled = _compile_node(node.model_dump(exclude_none=True))
        if compiled is not None:
            base.append(compiled)
    return all_of(*base)
```

</details>

**依据 5 · 源码核查**：[src/everos/memory/extract/pipeline/user_memory.py:127-150](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/user_memory.py#L127-L150)

实际模型提取接口。

<details>
<summary>查看原文（24行）</summary>

```text
        extractor = self._ep_ext
        custom_instructions = self._instructions.load("episode_extract")

        async def attempt() -> AlgoEpisode:
            return await extractor.aextract(
                prepared.cell,
                sender_id=None,
                custom_instructions=custom_instructions,
            )

        with memory_span(
            "everos.extract",
            observation_type="generation",
            session_id=ingested.session_id,
            metadata={
                "app_id": ingested.app_id,
                "project_id": ingested.project_id,
                "memcell_id": prepared.memcell_id,
            },
        ) as extract_span:
            # The LLM client records token usage onto this span.
            algo_ep = await retry_llm_output(
                attempt, operator="episode", memcell_id=prepared.memcell_id
            )
```

</details>

**依据 6 · 源码核查**：[src/everos/config/settings.py:495-514](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/config/settings.py#L495-L514)

失败payload保留和重放/保留边界。

<details>
<summary>查看原文（20行）</summary>

```text
    rejects new rows with 429, and a body over ``max_payload_bytes`` with
    413. A delivered row drops its body at once, so pending and delivered rows
    stay around ``max_pending_total * max_payload_bytes``; failed rows keep
    their bodies for the retention period and are not capped, and SQLite does
    not shrink the file after a purge. The caps are checked without a lock,
    so concurrent requests overshoot a little.

    A row that fails ``max_attempts`` times (``retry_backoff_seconds``
    apart) is marked ``failed`` and skipped so one bad batch cannot hold
    up its session. The default is a single attempt: ``memorize()`` is
    not atomic (boundary detection writes memcells and consumes the
    session buffer before extraction runs), so re-running a batch after a
    partial failure duplicates memcells or reports success with the
    episode missing. Raise it only where that is acceptable. A row that was
    in flight when the process died is requeued and replayed on the next
    start (at-least-once); one that has been replayed ``max_replays`` times
    without ever finishing is marked ``failed`` instead, so a batch that
    kills the process cannot crash-loop it forever. Every row, whatever its
    status, is deleted ``row_retention_hours`` (default seven days) after
    it was created.
```

</details>

**依据 7 · 源码核查**：[src/everos/infra/persistence/markdown/_base/writer.py:142-176](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/_base/writer.py#L142-L176)

真实root解析/包含检查与temp写。

<details>
<summary>查看原文（35行）</summary>

```text
        root = self._memory_root.root  # already absolute + resolved
        resolved = target.resolve()
        if not resolved.is_relative_to(root):
            raise PathTraversalError(
                f"write target escapes the memory root: {resolved} not under {root}"
            )
        return resolved

    async def write(self, path: Path, content: str) -> Path:
        """Atomically write ``content`` to ``path``.

        Steps:
            1. Assert the target resolves inside the memory root.
            2. ``mkdir -p`` the parent directory.
            3. Write to ``<parent>/.<name>.tmp.<uuid>``.
            4. ``flush`` + ``fsync`` the temp file.
            5. ``os.replace`` the temp file onto ``path`` (atomic on POSIX).

        Returns:
            ``path`` (resolved as written).

        Raises:
            PathTraversalError: If ``path`` resolves outside the memory root.
        """
        target = Path(path)
        self._ensure_within_root(target)
        await anyio.Path(target.parent).mkdir(parents=True, exist_ok=True)
        tmp = target.parent / f".{target.name}.tmp.{uuid.uuid4().hex}"
        try:
            await anyio.to_thread.run_sync(_write_and_fsync, tmp, content)
            await anyio.to_thread.run_sync(_replace_with_retry, tmp, target)
        except Exception:
            # Best-effort cleanup of the staging file on failure.
            await _unlink_quiet(tmp)
            raise
```

</details>

**依据 8 · 源码核查**：[src/everos/infra/persistence/markdown/owner_dir.py:193-211](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/owner_dir.py#L193-L211)

owner删除物理路径门。

<details>
<summary>查看原文（19行）</summary>

```text
    def _owner_dir(self, scope: Scope) -> Path:
        """The owner's directory; refuses one that resolves anywhere else.

        The routes already reject ids with a path separator or ``..``; this
        is the second line: the directory must be exactly the owner's entry
        under ``users/`` or ``agents/`` of the request's app and project.
        """
        base = self._base(scope.owner_type, scope.app_id, scope.project_id)
        target = base / scope.owner_id
        # ``base / "."`` (or ``""``) is ``base`` itself: the name check refuses
        # it before anything could move the whole users/ or agents/ folder.
        if (
            target.name != scope.owner_id
            or target.resolve() != base.resolve() / scope.owner_id
        ):
            raise PathTraversalError(
                f"owner directory escapes {base}: {scope.owner_id!r}"
            )
        return target
```

</details>

**依据 9 · 作者声明**：[SECURITY.md:5-12](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/SECURITY.md#L5-L12)

维护支持版本表仍1.4.x。

```text
Security fixes are applied to the latest release line only; older minor lines do
not receive backports.

| Version | Supported |
|---------|-----------|
| `1.4.x` (current) | ✅ |
| `1.3.x` and older | ❌ — upgrade to the current line |

```

**依据 10 · 作者声明**：[SECURITY.md:42-61](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/SECURITY.md#L42-L61)

可信本机与明文/凭据模型。

<details>
<summary>查看原文（20行）</summary>

```text
EverOS runs as a **local-first service** for single users or small teams
(Markdown + SQLite + LanceDB on the local filesystem). Please keep the
following in mind:

- Exposing the HTTP API (`everos server`) to an untrusted network is **outside
  the supported threat model** — it assumes a trusted local caller. The server
  binds to `127.0.0.1` by default (env `EVEROS_API__HOST`) so a fresh install
  is loopback-only. Only set the bind to `0.0.0.0` (or any routable interface)
  after you have placed your own gateway / auth layer in front;
  `everos server start` will log a warning when you bind to `0.0.0.0`.
- **Documents you ingest are untrusted input.** Filenames, metadata, and
  content that originate outside your control are parsed, indexed, and written
  to disk. An instance that ingests third-party documents is processing
  untrusted data even when the API itself is reachable only from loopback.
- Secrets (LLM / embedding API keys) live in your local `.env`; protect that
  file as you would any credential. EverOS never transmits them anywhere except
  the providers you configure.
- Memory content is stored as plaintext `.md` files; apply OS-level file
  permissions or disk encryption if your data is sensitive.
- **What counts as a vulnerability.** An issue qualifies for a security
```

</details>

#### 缺口

- 未审全部输入parser/写路径、provider和追踪外发或网关/OS权限部署。
  **影响**：不对生产隔离、隐私合规或全仓安全作结论；低敏试用仍需权限配置。
  **进一步探讨**：分别核网关身份到scope绑定、数据根权限、provider合同及具体导入路径，再授权隔离验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 删除究竟删什么，失败、并发与取消后会怎样？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

delete DTO要求owner或session至少一个，user/agent互斥。路由将scope直接交service；service为delete和delete_by_ids建supervised task并shield，请求取消只是调用者退出，删除仍继续，不是撤销按钮。返回count是文件记忆条数，不是所有副本/远端/备份擦除证明。

仅session删除在同session锁前后都检查queued/processing，有积压/锁等待超时503且未删；随后SQLite purge事务删除该app/project/session的Memcell/UnprocessedBuffer/ConversationStatus，清failed inbox body，找sender owners去相应Markdown session entries，最后索引。owner+session只去该owner的episode/atomic_fact/foresight或agent_case，保留原对话；owner整删将目录在owner锁内rename到带manifest的trash，保今日空计数以免entry ID复用，再inventory+rmtree并删clusters/用户reflection报告，失败重发会找同scope trash续清。它不是“删除账户所有数据”，原对话ledger、外部输入/备份和模型端数据不由这些路径全清。

User episode/case落盘前在owner锁里only_if memcell还在，可防session删掉源后正在提取的旧结果再写；owner-only删源仍在，不可因此宣称所有后续提取/反思永不生成。owner delete_count与Reflection另有局部代际门，未全审所有策略的永久遗忘；需先停止导入/后台并按实际scope对账。

delete_by_ids目前只支持episode，按owner+entry拆ID，删目标并按merge标记求传递closure，删其atomic facts、cluster成员，最后清merge标记和索引；不匹配ID跳过，非任意记忆类型统一删除。已开始后的文件/后续步骤失败报DeletionIncomplete 500，重发用于完成，不回滚先前删除。文件变更与索引清理非统一事务。

FencedIndexEraser真实先add fence后按scope/id删表，每表15秒；delete异常/timeout日志后返回false，具体refs requeue，owner额外表依赖cascade删除扫描而不单独requeue。失败不会令HTTP删除失败，所以成功响应仍可有暂时陈旧索引；keyword实际读索引而非文件，未发现本路径搜索时逐hit检查文件存在。cascade写前/后双fence只防已注册旧run回写，并非保证清理完成或跨进程墓碑，不能把API成功叫全局遗忘。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/schemas/delete.py:29-47](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/schemas/delete.py#L29-L47)

实际scope校验。

<details>
<summary>查看原文（19行）</summary>

```text
    model_config = ConfigDict(extra="forbid")

    app_id: AppScopeId = Field(
        default="default", min_length=1, max_length=128, pattern=PATH_SAFE_CHARSET
    )
    project_id: ProjectScopeId = Field(
        default="default", min_length=1, max_length=128, pattern=PATH_SAFE_CHARSET
    )
    user_id: PathSafeId | None = Field(default=None, min_length=1, max_length=128)
    agent_id: PathSafeId | None = Field(default=None, min_length=1, max_length=128)
    session_id: SessionId | None = Field(default=None, min_length=1, max_length=128)

    @model_validator(mode="after")
    def _one_scope(self) -> DeleteRequest:
        if self.user_id is None and self.agent_id is None and self.session_id is None:
            raise ValueError("set at least one of user_id, agent_id, session_id")
        if self.user_id is not None and self.agent_id is not None:
            raise ValueError("user_id and agent_id are mutually exclusive")
        return self
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/routes/delete.py:33-68](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/delete.py#L33-L68)

真实路由委派及count/ID响应。

<details>
<summary>查看原文（36行）</summary>

```text
@router.post("/delete", responses=_RESPONSES)
async def delete_memory(
    req: DeleteRequest, app: ApplicationDep, request_id: RequestIdDep
) -> SuccessEnvelope[DeleteResponseData]:
    """Delete one owner's memories, one session's, or one owner's of a session."""
    result = await app.memory.delete(
        app_id=req.app_id,
        project_id=req.project_id,
        user_id=req.user_id,
        agent_id=req.agent_id,
        session_id=req.session_id,
    )
    return SuccessEnvelope(
        request_id=request_id,
        data=DeleteResponseData(filters=result.filters, count=result.count),
    )


@router.post("/delete_by_ids", responses={500: _RESPONSES[500]})
async def delete_memories_by_ids(
    req: DeleteByIdsRequest, app: ApplicationDep, request_id: RequestIdDep
) -> SuccessEnvelope[DeleteByIdsResponseData]:
    """Delete episodes by id, with what was merged into them and their facts.

    Ids that match nothing are skipped (not 404); sending the same request
    again is harmless.
    """
    await app.memory.delete_by_ids(
        app_id=req.app_id,
        project_id=req.project_id,
        memory_type=req.memory_type,
        ids=req.memory_ids,
        reason_code=req.reason.code if req.reason else None,
        note=req.reason.note if req.reason else None,
    )
    return SuccessEnvelope(request_id=request_id, data=DeleteByIdsResponseData())
```

</details>

**依据 3 · 源码核查**：[src/everos/service/memory/__init__.py:156-219](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/__init__.py#L156-L219)

实际监督shield取消继续。

<details>
<summary>查看原文（64行）</summary>

```text
    async def delete(
        self,
        *,
        app_id: str,
        project_id: str,
        user_id: str | None,
        agent_id: str | None,
        session_id: str | None,
    ) -> DeleteResult:
        """Delete one scope of memories (``/delete``).

        Runs to completion even if the caller goes away: a deletion cut in
        half would leave the scope half deleted.
        """
        task = self._extractions.supervise(
            self._deleter.delete(
                app_id=app_id,
                project_id=project_id,
                user_id=user_id,
                agent_id=agent_id,
                session_id=session_id,
            ),
            session_id=session_id,
            memcell_ids=[],
            label="memory_delete",
            expected=(SessionBusyError, PathTraversalError),
        )
        try:
            return await asyncio.shield(task)
        except asyncio.CancelledError:
            logger.warning(
                "memory_delete_continues_after_cancel", session_id=session_id
            )
            raise

    async def delete_by_ids(
        self,
        *,
        app_id: str,
        project_id: str,
        memory_type: str,
        ids: list[str],
        reason_code: str | None,
        note: str | None,
    ) -> None:
        """Delete single memories by id (``/delete_by_ids``), shielded like
        :meth:`delete`."""
        task = self._extractions.supervise(
            self._deleter.delete_by_ids(
                app_id=app_id,
                project_id=project_id,
                memory_type=memory_type,
                ids=ids,
                reason_code=reason_code,
                note=note,
            ),
            session_id=None,
            memcell_ids=[],
            label="memory_delete_by_ids",
        )
        try:
            await asyncio.shield(task)
        except asyncio.CancelledError:
            logger.warning("memory_delete_by_ids_continues_after_cancel")
```

</details>

**依据 4 · 源码核查**：[src/everos/service/memory/_delete.py:95-140](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_delete.py#L95-L140)

scope分支/索引count。

<details>
<summary>查看原文（46行）</summary>

```text
    async def delete(
        self,
        *,
        app_id: str,
        project_id: str,
        user_id: str | None,
        agent_id: str | None,
        session_id: str | None,
    ) -> DeleteResult:
        """Delete one scope; at least one of the three ids is set."""
        if user_id is None and agent_id is None:
            if session_id is None:
                raise ValueError("a deletion needs user_id, agent_id or session_id")
            session = SessionKey(app_id, project_id, session_id)
            count = await self._erase(await self._session(session))
            filters = ["session_id"]
        else:
            owner_type: OwnerType = "user" if user_id is not None else "agent"
            scope = Scope(
                app_id=app_id,
                project_id=project_id,
                owner_id=user_id or agent_id or "",
                owner_type=owner_type,
            )
            filters = [f"{owner_type}_id"]
            if session_id is None:
                count = await self._owner(scope)
            else:
                removed = await _incomplete(self._remove_session(scope, session_id))
                count = await self._erase([(scope, removed)])
                filters.append("session_id")
        logger.info(
            "memory_deleted",
            app_id=app_id,
            project_id=project_id,
            filters=filters,
            count=count,
        )
        return DeleteResult(filters=filters, count=count)

    async def _erase(self, deleted: Sequence[tuple[Scope, Removed]]) -> int:
        """Remove the deleted entries' index rows; how many entries."""
        failpoint("delete.before_index_erase")
        for scope, removed in deleted:
            await self._eraser.erase(scope, removed)
        return sum(len(refs) for _, removed in deleted for refs in removed.values())
```

</details>

**依据 5 · 源码核查**：[src/everos/service/memory/_delete.py:142-180](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_delete.py#L142-L180)

pending/锁双门和purge/各owner。

<details>
<summary>查看原文（39行）</summary>

```text
    async def _session(self, session: SessionKey) -> list[tuple[Scope, Removed]]:
        """Delete one conversation everywhere, under its memorize lock."""
        inbox = self._stores.memorize_inbox
        if await inbox.count_pending(session):
            raise SessionBusyError(_QUEUED)
        key = session_key(session.app_id, session.project_id, session.session_id)
        try:
            async with LOCKS.hold("session", key, max_wait=self._wait):
                # A request queued while this one waited for the lock.
                if await inbox.count_pending(session):
                    raise SessionBusyError(_QUEUED)
                return await _incomplete(self._purge_session(session))
        except TimeoutError:  # only the wait for the lock raises it here
            raise SessionBusyError(_LOCKED) from None

    async def _purge_session(self, session: SessionKey) -> list[tuple[Scope, Removed]]:
        records = await self._stores.session_purge.purge(session)
        failpoint("delete.after_sqlite")
        senders = dict.fromkeys(s for record in records for s in record.sender_ids)
        # A sender's memories live under users/ or agents/ (the assistant side
        # of an agent trajectory); trying both costs a scan of a missing dir.
        owners = [
            Scope(
                app_id=session.app_id,
                project_id=session.project_id,
                owner_id=sender,
                owner_type=owner_type,
            )
            for sender in senders
            for owner_type in ("user", "agent")
        ] or await self._stores.owner_dir.owners_with_session(
            session.app_id, session.project_id, session.session_id
        )
        deleted: list[tuple[Scope, Removed]] = []
        for scope in owners:
            deleted.append(
                (scope, await self._remove_session(scope, session.session_id))
            )
            failpoint("delete.after_first_rewrite")
```

</details>

**依据 6 · 源码核查**：[src/everos/infra/persistence/sqlite/_repos/session_purge.py:25-58](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/sqlite/_repos/session_purge.py#L25-L58)

实际SQLite删除/failed body清理事务。

<details>
<summary>查看原文（34行）</summary>

```text
    async def purge(
        self, *, app_id: str, project_id: str, session_id: str
    ) -> list[Memcell]:
        """Delete the session's rows; return its memcells as they were."""
        async with session_scope(self._factory) as s:
            memcells = list(
                (
                    await s.execute(
                        select(Memcell)
                        .where(Memcell.app_id == app_id)
                        .where(Memcell.project_id == project_id)
                        .where(Memcell.session_id == session_id)
                    )
                )
                .scalars()
                .all()
            )
            for table in (Memcell, UnprocessedBuffer, ConversationStatus):
                await s.execute(
                    delete(table)
                    .where(table.app_id == app_id)
                    .where(table.project_id == project_id)
                    .where(table.session_id == session_id)
                )
            await s.execute(
                update(MemorizeInbox)
                .where(MemorizeInbox.app_id == app_id)
                .where(MemorizeInbox.project_id == project_id)
                .where(MemorizeInbox.session_id == session_id)
                .where(MemorizeInbox.status == "failed")
                .values(payload_json="")
            )
            await s.commit()
        return memcells
```

</details>

**依据 7 · 源码核查**：[src/everos/service/memory/_delete.py:183-217](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_delete.py#L183-L217)

session局部及owner附加清理。

<details>
<summary>查看原文（35行）</summary>

```text
    async def _remove_session(self, scope: Scope, session_id: str) -> Removed:
        stores = self._stores
        if scope.owner_type == "agent":
            return {
                "agent_case": await stores.agent_case.remove_session(scope, session_id)
            }
        return {
            "episode": await stores.episode.remove_session(scope, session_id),
            "atomic_fact": await stores.atomic_fact.remove_session(scope, session_id),
            "foresight": await stores.foresight.remove_session(scope, session_id),
        }

    async def _owner(self, scope: Scope) -> int:
        """Delete the owner's directory, clusters and reports; the count."""
        stores = self._stores
        try:
            deletion = await stores.owner_dir.delete(scope)
        except PathTraversalError:
            raise  # refused before anything moved
        except Exception as exc:
            raise DeletionIncompleteError(str(exc)) from exc
        if scope.owner_type == "user":
            async with user_cluster_lock(
                scope.app_id, scope.project_id, scope.owner_id
            ):
                await _incomplete(stores.cluster.delete_for_owner(scope, "user_memory"))
                await _incomplete(stores.reflection_report.delete_for_owner(scope))
            tables = ["user_profile"]
        else:
            await _incomplete(stores.cluster.delete_for_owner(scope, "agent_case"))
            tables = ["agent_skill"]
        failpoint("delete.before_index_erase")
        await self._eraser.erase(scope, deletion.refs)
        await self._eraser.erase_owner(scope, tables)
        return deletion.count
```

</details>

**依据 8 · 源码核查**：[src/everos/infra/persistence/markdown/owner_dir.py:74-128](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/owner_dir.py#L74-L128)

rename trash/manifest/rmtree及重发续清。

<details>
<summary>查看原文（55行）</summary>

```text
    async def delete(self, scope: Scope) -> OwnerDirDeletion:
        owner_dir = self._owner_dir(scope)
        key = owner_lock(scope)
        trash = self._root.tmp_dir / f"{_TRASH_PREFIX}{uuid.uuid4().hex}"
        async with LOCKS.hold("owner", key):
            # An attempt that failed after its rename left the directory in
            # the trash: this one, the same request again, finishes it.
            moved = [
                t
                for t, held in self._trash_folders()
                if held == scope and t not in self._emptying
            ]
            for earlier in moved:
                await self._keep_today_counters(scope, earlier / _MOVED)
            if await anyio.Path(owner_dir).is_dir():
                await self._move(scope, owner_dir, trash)
                moved.append(trash)
            if not moved:
                return OwnerDirDeletion(refs={}, count=0)
            LOCKS.bump_delete_count(key)
            self._emptying.update(moved)
        return await self._empty(scope, moved)

    async def _move(self, scope: Scope, owner_dir: Path, trash: Path) -> None:
        """Move the owner's directory into ``trash``; today's counters stay."""
        await anyio.Path(trash).mkdir(parents=True)
        await anyio.Path(trash / _MANIFEST).write_text(
            json.dumps(
                {
                    "app_id": scope.app_id,
                    "project_id": scope.project_id,
                    "owner_type": scope.owner_type,
                    "owner_id": scope.owner_id,
                }
            ),
            encoding="utf-8",
        )
        await anyio.Path(owner_dir).rename(trash / _MOVED)
        failpoint("delete_owner.after_rename")
        await self._keep_today_counters(scope, trash / _MOVED)
        failpoint("delete_owner.after_restore")

    async def _empty(self, scope: Scope, moved: Sequence[Path]) -> OwnerDirDeletion:
        """Inventory the trash folders, then remove them."""
        try:
            parts = [await self._inventory(scope, t / _MOVED) for t in moved]
            for trash in moved:
                await anyio.to_thread.run_sync(shutil.rmtree, trash)
        finally:
            self._emptying.difference_update(moved)
        refs: dict[str, list[MemoryRef]] = {}
        for part in parts:
            for table, found in part.refs.items():
                refs.setdefault(table, []).extend(found)
        return OwnerDirDeletion(refs=refs, count=sum(p.count for p in parts))
```

</details>

**依据 9 · 源码核查**：[src/everos/infra/persistence/markdown/owner_dir.py:235-257](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/owner_dir.py#L235-L257)

恢复今日空计数，不是还原旧内容。

<details>
<summary>查看原文（23行）</summary>

```text
        today = today_with_timezone()
        for writer in self._logs[scope.owner_type].values():
            live = writer.path_for(
                scope.owner_id, today, app_id=scope.app_id, project_id=scope.project_id
            )
            old = moved / live.relative_to(owner_dir)
            if not old.is_file():
                continue
            parsed = await MarkdownReader.read(old)
            count = _counter(parsed.frontmatter.get("entry_count"), parsed.entries)
            if live.is_file():  # written to since (only after a crash)
                current = await MarkdownReader.read(live)
                if (
                    _counter(current.frontmatter.get("entry_count"), current.entries)
                    < count
                ):
                    await self._md.patch_frontmatter(live, {"entry_count": count})
                continue
            frontmatter = {
                k: v for k, v in parsed.frontmatter.items() if k != "deprecated_entries"
            }
            frontmatter["entry_count"] = count
            await self._md.write_markdown(live, frontmatter=frontmatter, body="")
```

</details>

**依据 10 · 源码核查**：[src/everos/memory/extract/pipeline/user_memory.py:163-185](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/extract/pipeline/user_memory.py#L163-L185)

session source存活门。

<details>
<summary>查看原文（23行）</summary>

```text
        async def memcell_alive() -> bool:
            return bool(await self._memcell_store.find_by_ids([memcell_id]))

        with memory_span(
            "everos.persist.markdown",
            observation_type="span",
            session_id=ingested.session_id,
            metadata={
                "owner_id": ep.owner_id,
                "app_id": ingested.app_id,
                "project_id": ingested.project_id,
            },
        ) as persist_span:
            ref = await self._episode_store.append(
                Scope(
                    app_id=ingested.app_id,
                    project_id=ingested.project_id,
                    owner_id=ep.owner_id,
                    owner_type="user",
                ),
                ep,
                only_if=memcell_alive,
            )
```

</details>

**依据 11 · 源码核查**：[src/everos/infra/persistence/markdown/stores.py:112-121](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/persistence/markdown/stores.py#L112-L121)

实际owner锁内校验再写。

<details>
<summary>查看原文（10行）</summary>

```text
        async with LOCKS.hold("owner", owner_lock(scope)):
            if not await self._sources_alive(scope, only_if, len(items)):
                return []
            eids = await self._writer.append_entries(
                scope.owner_id,
                [self._to_entry(item) for item in items],
                app_id=scope.app_id,
                project_id=scope.project_id,
            )
        return [self._ref(scope, eid) for eid in eids]
```

</details>

**依据 12 · 源码核查**：[src/everos/service/memory/_delete.py:248-292](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_delete.py#L248-L292)

episode-only/closure/关联facts与索引。

<details>
<summary>查看原文（45行）</summary>

```text
        if memory_type != "episode":
            raise ValueError(f"unsupported memory_type {memory_type!r}")
        by_owner: dict[str, list[str]] = {}
        for memory_id in dict.fromkeys(ids):
            owner_id, entry_id = _split_memory_id(memory_id)
            by_owner.setdefault(owner_id, []).append(entry_id)
        hit: list[str] = []
        for owner_id, entry_ids in by_owner.items():
            scope = Scope(
                app_id=app_id,
                project_id=project_id,
                owner_id=owner_id,
                owner_type="user",
            )
            removed = await _incomplete(self._delete_episodes(scope, entry_ids))
            hit += [f"{owner_id}_{e}" for e in removed]
        logger.info(
            "memory_delete_by_ids",
            app_id=app_id,
            project_id=project_id,
            reason=reason_code,
            hit=hit,
            skipped=[m for m in dict.fromkeys(ids) if m not in set(hit)],
        )

    async def _delete_episodes(self, scope: Scope, targets: Sequence[str]) -> list[str]:
        """Steps 1-6 for one owner; the requested entries that were in md."""
        episodes, facts = self._stores.episode, self._stores.atomic_fact
        requested = set(targets)
        first = await episodes.remove(scope, requested)
        failpoint("by_ids.after_step1")
        closure = set(requested)
        frontier = set(requested)
        while frontier:
            frontier = await episodes.merged_into(scope, frontier) - closure
            closure |= frontier
        merged = await episodes.remove(scope, closure - requested)
        fact_refs = await facts.remove_by_parents(scope, closure)
        failpoint("by_ids.after_step3")
        await self._detach_from_clusters(scope, closure)
        await episodes.clear_deprecations(scope, closure)
        failpoint("by_ids.after_step5")
        await self._eraser.erase(
            scope, {"episode": [*first, *merged], "atomic_fact": fact_refs}
        )
```

</details>

**依据 13 · 源码核查**：[src/everos/service/memory/_delete.py:358-365](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_delete.py#L358-L365)

后续异常报incomplete。

```text
async def _incomplete[T](step: Awaitable[T]) -> T:
    """Await a step taken after the deletion began; a failure is incomplete."""
    try:
        return await step
    except (SessionBusyError, DeletionIncompleteError):
        raise
    except Exception as exc:
        raise DeletionIncompleteError(str(exc)) from exc
```

**依据 14 · 源码核查**：[src/everos/infra/cascade/_eraser.py:44-105](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_eraser.py#L44-L105)

15秒索引失败日志/requeue且不抛。

<details>
<summary>查看原文（62行）</summary>

```text
        timeout_s: float = 15.0,
    ) -> None:
        self._index = index
        self._fence = fence
        self._ledger = ledger
        self._timeout_s = timeout_s

    async def erase(
        self, scope: Scope, removed: Mapping[str, Sequence[MemoryRef]]
    ) -> None:
        self._fence.add(
            (scope.app_id, scope.project_id, ref.id)
            for refs in removed.values()
            for ref in refs
        )
        for table, refs in removed.items():
            if not refs:
                continue
            where = all_of(
                eq("app_id", scope.app_id),
                eq("project_id", scope.project_id),
                one_of("id", [ref.id for ref in refs]),
            )
            if not await self._delete(table, where, rows=len(refs)):
                await self._requeue(table, {ref.md_path for ref in refs})

    async def erase_owner(self, scope: Scope, kinds: Collection[str]) -> None:
        # ponytail: no requeue on failure; the owner's files are gone, so the
        # cascade's deletion pass over them removes the rows when it runs.
        where = all_of(
            eq("owner_id", scope.owner_id),
            eq("app_id", scope.app_id),
            eq("project_id", scope.project_id),
        )
        for table in kinds:
            await self._delete(table, where, rows=None)

    async def _delete(self, table: str, where: Filter, *, rows: int | None) -> bool:
        try:
            async with asyncio.timeout(self._timeout_s):
                await getattr(self._index, table).delete(where)
        except Exception as exc:
            logger.warning(
                "memory_delete_index_erase_failed",
                table=table,
                rows=rows,
                error=repr(exc)[:200],
            )
            return False
        return True

    async def _requeue(self, kind: str, md_paths: Collection[str]) -> None:
        for md_path in sorted(md_paths):
            try:
                await self._ledger.force_enqueue(md_path, kind)
            except Exception as exc:  # the scanner still finds the rewrite
                logger.warning(
                    "memory_delete_requeue_failed",
                    md_path=md_path,
                    kind=kind,
                    error=repr(exc)[:200],
                )
```

</details>

**依据 15 · 源码核查**：[src/everos/infra/cascade/_projections/_daily_log_base.py:239-269](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_projections/_daily_log_base.py#L239-L269)

写后fence和最终删除。

<details>
<summary>查看原文（31行）</summary>

```text
    async def _apply_lance_changes(
        self,
        to_upsert: list[Any],
        to_delete_ids: list[str],
        md_path: str,
    ) -> None:
        """Flush upserts and deletes to LanceDB.

        The fence is checked again once the upsert returned: a deletion that
        fenced a row after this run filtered it relied on this run to delete
        it (the two share no lock).
        """
        fence = self._deps.fence
        if to_upsert:
            await self.index_repo.upsert(to_upsert)
            late = [r for r in to_upsert if fence.blocks(r)] if fence else []
            if late:
                await self.index_repo.delete(fence.filter_for(late))
        if to_delete_ids:
            await self.index_repo.delete(
                all_of(eq("md_path", md_path), one_of("entry_id", to_delete_ids))
            )

    async def handle_deleted(self, md_path: str) -> HandlerOutcome:
        deleted = await self.index_repo.delete_by_md_path(md_path)
        return HandlerOutcome(
            md_path=md_path,
            kind=self.kind,
            upserted=0,
            deleted=deleted,
            skipped=0,
```

</details>

**依据 16 · 源码核查**：[src/everos/memory/reflection/orchestrator.py:362-379](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/memory/reflection/orchestrator.py#L362-L379)

Reflection源/代际检查是局部门，不是所有策略永久遗忘。

<details>
<summary>查看原文（18行）</summary>

```text
        key = owner_key(
            scope.app_id, scope.project_id, scope.owner_type, scope.owner_id
        )
        seen = LOCKS.delete_count(key)
        entry_ids = {ep.ref.entry_id for ep in episodes}
        if await self._episode_store.exists(scope, entry_ids) != entry_ids:
            return None
        memcell_ids = sorted(
            {ep.item.parent_id for ep in episodes if ep.item.parent_type == "memcell"}
        )
        found = await self._memcell_store.find_by_ids(memcell_ids)
        if len(found) != len(memcell_ids):
            return None

        async def unchanged() -> bool:
            return LOCKS.delete_count(key) == seen

        return unchanged
```

</details>

#### 缺口

- 未做删除中断/重发、owner-only并发新写、陈旧索引消退、备份与provider遗忘验收。
  **影响**：不能保证API成功后所有查询或副本立即消失；取消请求不能终止删除。
  **进一步探讨**：隔离数据根逐scope记录原文/SQLite/Markdown/索引和trash，延迟索引删及并发提取后独立检索，明确永久遗忘需另设计。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续、失败和退出怎样控制负担？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

真实提取部署需要Python3.12+、兼容精确everalgo版本线、本地Markdown/SQLite/LanceDB空间及LLM配置；keyword可作为最低检索路线，embedding/rerank再按能力加。README无key standalone demo是独立体验，不证明真实提取链无需provider；未运行该demo，也不把示例可启动当实际业务完成。服务本地默认loopback，先用独立临时数据根与虚构低敏对话，不直接导入生产历史或暴露网卡，DSH桥接另固定验收。

持续成本分现金与人工：LLM边界/episode/case、后台策略/反思及embedding/rerank可能多次调用，磁盘含原文、SQLite队列、派生索引和trash；金额、tokens、人时、净收益均未知。writer per-file atomic并非多系统原子，部分提取失败、队列重放、index滞后/删除重排需人工核，不将本地化或少维护一个服务就推经济收益。

启动实际先warm token counter、建schema/补未完成owner删除、启动index/cascade/OME再queue；正常关闭反向stack，memory先等队列并有界等提取，再停OME/index/SQLite。队列grace超时会cancel，重启可能replay；shield不防进程被强杀，关闭服务也不删除明文、备份、failed payload或provider侧内容。退出先停止新导入、记录task与cascade失败/积压、导出可读原文/模型配置并独立备份，确认不需的后台与网络已停；删除另按scope核而不是直接删一个DB当全忘记。

适合愿意核生成记忆、索引状态和恢复的开发者在临时根做小规模add/flush→task→文件→keyword读回；不要从202或delete成功跨到准确/全忘记。质量无增量、权限/费用不明、文件与检索不一致或恢复不能完成就暂停导入，保留源文件并回手写Markdown/简单索引；生产采用前另测重启、失败与恢复成本。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-7](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L1-L7)

Python/版本与许可。

```text
[project]
name = "everos"
version = "1.6.0"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
```

**依据 2 · 源码核查**：[pyproject.toml:23-45](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L23-L45)

本地索引依赖约束。

<details>
<summary>查看原文（23行）</summary>

```text
dependencies = [
    # Core data validation & config
    "pydantic>=2.7.1",
    "pydantic-settings>=2.0.0",

    # Storage stack (md-first three-piece set)
    # Upper bound: 0.35.0 embeds lance-rust v9 (large storage/encoding jump, not
    # yet stable-released). 0.32-0.34 carry a compaction offset-overflow regression
    # (lance-format/lance#7653); we run 0.34.0 safely via the with_position=False
    # FTS workaround. Do not float past 0.34.x until 0.35 has been validated under
    # sustained churn (bounded + reclaimable index dir, no compaction crash) — see
    # docs/cascade_runbook.md. Never widen this floor back below 0.34 (older lance
    # cannot read v8 data). Before raising the ceiling, re-check that a
    # merge_insert cancelled by asyncio.timeout never lands after the
    # TimeoutError (0.34.0: 0 of 41 did); memory deletion's index fence
    # assumes it.
    "lancedb>=0.34.0,<0.35.0",    # Vector + BM25 + scalar filter (Arrow-based)
    # Floor, not a new package: lancedb pulls pyarrow in anyway. 25.0.1 stops
    # the per-value `import pytz` attempt in to_pylist() (24 walked sys.path
    # for every tz-aware timestamp) and materialises rows without a Scalar
    # per element; 25.0.0 lacks the latter and has a mimalloc exit crash.
    "pyarrow>=25.0.1",
    "aiosqlite>=0.20.0",          # Async SQLite driver (used by SA async engine)
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:102-108](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/pyproject.toml#L102-L108)

算法依赖固定契约线。

```text
    "everalgo-user-memory==0.9.0rc4",
    "everalgo-agent-memory==0.6.0rc3",
    "everalgo-rank==0.5.0rc3",
    "everalgo-knowledge==0.3.0rc2",
    "everalgo-boundary==0.4.1",
    "everalgo-core==0.6.0",
    "everalgo-clustering==0.3.0rc2",
```

**依据 4 · 作者声明**：[README.md:109-138](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/README.md#L109-L138)

最小真实示例与无key独立demo的区分。

<details>
<summary>查看原文（30行）</summary>

````text
> One OpenRouter API key is enough to start EverOS, write durable memories,
> and retrieve them with keyword search.

### Prerequisites

- Python 3.12+
- One [OpenRouter API key](https://openrouter.ai/keys)

### 1. Install

```bash
uv pip install everos
# or: pip install everos
```

### 2. Try the standalone demo — no key required

No API key or server setup required—run one command to quickly experience how
EverOS stores and recalls memory:

```bash
# If you installed EverOS as a package:
everos demo

# If you cloned or forked this repository and have not activated .venv:
uv run everos demo
```

Enter something EverOS should remember, then ask a related question to watch
the memory move through ingest -> extract -> index -> recall.
````

</details>

**依据 5 · 作者声明**：[README.md:245-257](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/README.md#L245-L257)

provider能力分层是作者声明。

<details>
<summary>查看原文（13行）</summary>

```text
The OpenRouter one-key setup is EverOS Tier 1. It supports server startup,
memory add and flush, durable Markdown storage, cascade indexing, and keyword
search. Add optional providers only when you need the features below:

| Configuration | Adds |
| --- | --- |
| `[llm]` only | Core memory flow and keyword search |
| Add `[embedding]` | Vector/user hybrid search, reflection, and skill extraction |
| Add `[rerank]` too | Agentic search, default agent hybrid search, and Knowledge Wiki |
| Add `[multimodal]` and parser extra | Image, PDF, audio, and office-file ingestion |

Missing optional capabilities are reported by `/health` and return a clear
HTTP 422 if you request a feature that needs them.
```

</details>

**依据 6 · 源码核查**：[src/everos/service/bootstrap.py:204-242](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/bootstrap.py#L204-L242)

真实启动/恢复/关闭顺序。

<details>
<summary>查看原文（39行）</summary>

```text
        await warm_token_counter()

        self._root.ensure()
        tables = await self._admin.create_schema()
        logger.info("sqlite_schema_ready", tables=tables)
        # Before anything writes: a whole-owner deletion a crash cut short
        # still has today's id counters to put back.
        await self.memory.finish_interrupted_deletions()

        await self._admin.start_index()
        if self._admin.backend == "lancedb":
            await _log_unbackfilled_hint(self._admin)
        logger.info("derived_index_ready", backend=self._admin.backend)

        await self.ops.start()
        self._stack.push_async_callback(_shielded("cascade", self.ops.aclose))

        self._root.ome_db.parent.mkdir(parents=True, exist_ok=True)
        await self._engine.start()
        self._stack.push_async_callback(_shielded("ome", self._engine.stop))
        logger.info("ome_engine_started")

        await self.memory.start()
        self._stack.push_async_callback(_shielded("memory", self.memory.aclose))
        logger.info("application_started")

    async def aclose(self) -> None:
        """Stop what :meth:`start` started, close the storage, shut tracing down.

        Idempotent: a second call does nothing.
        """
        if self._lifecycle.closed:
            return
        self._lifecycle.closed = True
        await self._stack.aclose()
        await _shielded("index", self._admin.close_index)()
        await _shielded("sqlite", self._admin.dispose)()
        shutdown_tracing()
        logger.info("application_closed")
```

</details>

**依据 7 · 源码核查**：[src/everos/service/memory/_queue.py:186-207](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_queue.py#L186-L207)

有界队列关闭与超时cancel。

<details>
<summary>查看原文（22行）</summary>

```text
    async def stop(self) -> None:
        """Finish the rows in flight (bounded), then exit the loop.

        Cancelling mid-``memorize()`` would leave rows ``processing`` after
        their memcells may already be written; the restart would then replay
        them. Waiting keeps a normal restart exactly-once for rows that finish
        within the grace period; a longer row is replayed like a crash.
        """
        if self._task is None:
            return
        self._stopping = True
        self._wake.set()
        try:
            async with asyncio.timeout(self._stop_grace):
                await self._task
        except TimeoutError:
            logger.warning("memorize_queue_stop_grace_exceeded")
            self._task.cancel()
            with contextlib.suppress(asyncio.CancelledError):
                await self._task
        self._task = None
        logger.info("memorize_queue_stopped")
```

</details>

**依据 8 · 源码核查**：[src/everos/service/memory/__init__.py:139-142](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/__init__.py#L139-L142)

关闭队列后有界等提取。

```text
    async def aclose(self) -> None:
        """Stop the queue, then wait (bounded) for extractions still running."""
        await self._queue.stop()
        await self._extractions.shutdown(_DRAIN_TIMEOUT_SECONDS)
```

**依据 9 · 源码核查**：[src/everos/service/memory/_extraction.py:79-98](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/_extraction.py#L79-L98)

有界drain后abandoned日志。

<details>
<summary>查看原文（20行）</summary>

```text
    async def drain(self, wait_seconds: float) -> int:
        """Wait up to ``wait_seconds`` for running extractions; return what is left."""
        pending = {t for t in self._tasks if not t.done()}
        if pending:
            await asyncio.wait(pending, timeout=wait_seconds)
        return sum(1 for t in self._tasks if not t.done())

    async def shutdown(self, wait_seconds: float) -> None:
        """:meth:`drain` for shutdown: log what runs, and what is abandoned."""
        running = self.in_flight
        if not running:
            return
        logger.info("memorize_extractions_draining", in_flight=running)
        left = await self.drain(wait_seconds)
        if left:
            logger.error(
                "memorize_extractions_abandoned",
                in_flight=left,
                waited_seconds=wait_seconds,
            )
```

</details>

**依据 10 · 源码核查**：[src/everos/config/settings.py:495-538](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/config/settings.py#L495-L538)

失败body/软上限/重放/保留时间。

<details>
<summary>查看原文（44行）</summary>

```text
    rejects new rows with 429, and a body over ``max_payload_bytes`` with
    413. A delivered row drops its body at once, so pending and delivered rows
    stay around ``max_pending_total * max_payload_bytes``; failed rows keep
    their bodies for the retention period and are not capped, and SQLite does
    not shrink the file after a purge. The caps are checked without a lock,
    so concurrent requests overshoot a little.

    A row that fails ``max_attempts`` times (``retry_backoff_seconds``
    apart) is marked ``failed`` and skipped so one bad batch cannot hold
    up its session. The default is a single attempt: ``memorize()`` is
    not atomic (boundary detection writes memcells and consumes the
    session buffer before extraction runs), so re-running a batch after a
    partial failure duplicates memcells or reports success with the
    episode missing. Raise it only where that is acceptable. A row that was
    in flight when the process died is requeued and replayed on the next
    start (at-least-once); one that has been replayed ``max_replays`` times
    without ever finishing is marked ``failed`` instead, so a batch that
    kills the process cannot crash-loop it forever. Every row, whatever its
    status, is deleted ``row_retention_hours`` (default seven days) after
    it was created.

    Env binding:
        EVEROS_MEMORIZE__ASYNC_QUEUE__ENABLED
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_CONCURRENCY
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PENDING_PER_SESSION
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PENDING_TOTAL
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_PAYLOAD_BYTES
        EVEROS_MEMORIZE__ASYNC_QUEUE__SCAN_INTERVAL_SECONDS
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_ATTEMPTS
        EVEROS_MEMORIZE__ASYNC_QUEUE__RETRY_BACKOFF_SECONDS
        EVEROS_MEMORIZE__ASYNC_QUEUE__MAX_REPLAYS
        EVEROS_MEMORIZE__ASYNC_QUEUE__ROW_RETENTION_HOURS
    """

    enabled: bool = True
    max_concurrency: int = Field(default=4, ge=1)
    max_pending_per_session: int = Field(default=50, ge=1)
    max_pending_total: int = Field(default=200, ge=1)
    max_payload_bytes: int = Field(default=4 * 1024 * 1024, ge=1)
    scan_interval_seconds: float = Field(default=5.0, gt=0)
    max_attempts: int = Field(default=1, ge=1)
    retry_backoff_seconds: float = Field(default=2.0, ge=0)
    max_replays: int = Field(default=3, ge=1)
    row_retention_hours: float = Field(default=7 * 24.0, gt=0, le=366 * 24.0)
```

</details>

#### 缺口

- 没有费用、人工维护/恢复分钟、真实效果、备份重建和完整退出实测。
  **影响**：不能证明净收益或数据已全删/闭环恢复，建议限临时低敏试点。
  **进一步探讨**：对同一低敏任务记录生成错误、检索误判、tokens/费用、索引占用及恢复分钟，和手写Markdown+简单索引比较。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 已有贡献与逐记忆可见性/遗忘对账方向如何证伪？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

可归因增量是把用户/Agent提取、可编辑Markdown、按scope索引检索与后台状态组织成一个本地服务，并加入真实路径门、源存活检查和同进程删除fence；这些不是仅接口清单。SQLite/LanceDB、算法包和模型质量继承外部依赖，DSH插件亦另仓；不能据作者与其他记忆库的对比表宣称全生态唯一或获得实际用户效率优势。

关键缺口是接收→源写→提取→派生索引→可检索/已遗忘跨多个状态，task success和delete count没有包含某记忆所有索引/副本完成证明。已有task/health/逐文件cascade lsn、fence/requeue已解决部分观察与旧回写，不应再把这些已有机制包装成候选发明。

候选是在具体记忆引用上提供提交/索引版本与删除待清理状态，可查询哪些后端已处理、何时仍unknown；不把provider/备份等未控制副本混为已忘记。对照现有task+health+文件读回和简单延长等待，在隔离根注入提取部分失败、写后kill、索引delayed/erase失败、owner-only与session删除，记录“以为可查/已忘记”的误判、残留窗口和维护负担。若现有接口已能同样解释、状态仍假阳性或新增后台成本更高，则放弃，当前没有原型或收益证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/service/memory/__init__.py:294-325](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/service/memory/__init__.py#L294-L325)

当前接收/flush队列状态不是索引完成。

<details>
<summary>查看原文（32行）</summary>

```text
        if (async_mode and self.accepts_async) or await self._has_backlog(payload):
            return await self._queue_request(
                payload,
                request_id=request_id,
                is_final=False,
                defer_extraction=defer_extraction,
            )
        return await self._memorize(payload, defer_extraction=defer_extraction)

    async def flush(
        self,
        *,
        session_id: str,
        request_id: str,
        app_id: str = "default",
        project_id: str = "default",
    ) -> FlushResult | Queued:
        """Run one ``/flush`` inline, or queue it behind the session's backlog.

        A flush has no ``async_mode`` (the Cloud API has none either); it is
        queued only when earlier requests of the session still are.

        Raises:
            QueueSaturatedError: Queued, and the session or queue is full.
        """
        payload = flush_payload(session_id, app_id, project_id)
        if await self._has_backlog(payload):
            return await self._queue_request(
                payload, request_id=request_id, is_final=True, defer_extraction=False
            )
        return await self._flush_inline(
            session_id=session_id, app_id=app_id, project_id=project_id
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/routes/tasks.py:51-65](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/entrypoints/api/routes/tasks.py#L51-L65)

现有task结果及过期。

<details>
<summary>查看原文（15行）</summary>

```text
@router.get("/{task_id}")
async def task_status(
    task_id: str,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[TaskItem]:
    """One accepted request's outcome.

    ``404`` once it has aged out of ``memorize.async_queue.row_retention_hours``
    (or never existed).
    """
    item = await app.ops.get_task(task_id)
    if item is None:
        raise NotFoundError(f"task {task_id} not found or expired")
    return SuccessEnvelope(request_id=request_id, data=item)
```

</details>

**依据 3 · 源码核查**：[src/everos/infra/cascade/_worker/_worker.py:512-527](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_worker/_worker.py#L512-L527)

已有lsn当前claim后done。

<details>
<summary>查看原文（16行）</summary>

```text
            # The handler may have run long enough for another drainer to
            # claim a newer version of this path. Its index write is already
            # applied at this point, so re-enqueue the current row instead of
            # marking the old claim done; the next drain repairs the index
            # from the latest md (#545). A same-lsn processing row is still
            # ours and follows the normal mark_done path.
            current = await self._ledger.read_one(row.md_path)
            if current is None:
                return None
            if current.lsn == row.lsn and current.status == "processing":
                await self._write_terminal(
                    self._ledger.mark_done,
                    row.md_path,
                    kind=row.kind,
                    change_type=applied,
                )
```

</details>

**依据 4 · 源码核查**：[src/everos/infra/cascade/_eraser.py:51-105](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_eraser.py#L51-L105)

已有删除fence/requeue及失败吞日志。

<details>
<summary>查看原文（55行）</summary>

```text
    async def erase(
        self, scope: Scope, removed: Mapping[str, Sequence[MemoryRef]]
    ) -> None:
        self._fence.add(
            (scope.app_id, scope.project_id, ref.id)
            for refs in removed.values()
            for ref in refs
        )
        for table, refs in removed.items():
            if not refs:
                continue
            where = all_of(
                eq("app_id", scope.app_id),
                eq("project_id", scope.project_id),
                one_of("id", [ref.id for ref in refs]),
            )
            if not await self._delete(table, where, rows=len(refs)):
                await self._requeue(table, {ref.md_path for ref in refs})

    async def erase_owner(self, scope: Scope, kinds: Collection[str]) -> None:
        # ponytail: no requeue on failure; the owner's files are gone, so the
        # cascade's deletion pass over them removes the rows when it runs.
        where = all_of(
            eq("owner_id", scope.owner_id),
            eq("app_id", scope.app_id),
            eq("project_id", scope.project_id),
        )
        for table in kinds:
            await self._delete(table, where, rows=None)

    async def _delete(self, table: str, where: Filter, *, rows: int | None) -> bool:
        try:
            async with asyncio.timeout(self._timeout_s):
                await getattr(self._index, table).delete(where)
        except Exception as exc:
            logger.warning(
                "memory_delete_index_erase_failed",
                table=table,
                rows=rows,
                error=repr(exc)[:200],
            )
            return False
        return True

    async def _requeue(self, kind: str, md_paths: Collection[str]) -> None:
        for md_path in sorted(md_paths):
            try:
                await self._ledger.force_enqueue(md_path, kind)
            except Exception as exc:  # the scanner still finds the rewrite
                logger.warning(
                    "memory_delete_requeue_failed",
                    md_path=md_path,
                    kind=kind,
                    error=repr(exc)[:200],
                )
```

</details>

**依据 5 · 源码核查**：[src/everos/infra/cascade/_projections/_daily_log_base.py:239-269](https://github.com/EverMind-AI/EverOS/blob/782815a60f1fbe1324dd2ec6343221acef1c046c/src/everos/infra/cascade/_projections/_daily_log_base.py#L239-L269)

已有写后fence校正，不当未来发明。

<details>
<summary>查看原文（31行）</summary>

```text
    async def _apply_lance_changes(
        self,
        to_upsert: list[Any],
        to_delete_ids: list[str],
        md_path: str,
    ) -> None:
        """Flush upserts and deletes to LanceDB.

        The fence is checked again once the upsert returned: a deletion that
        fenced a row after this run filtered it relied on this run to delete
        it (the two share no lock).
        """
        fence = self._deps.fence
        if to_upsert:
            await self.index_repo.upsert(to_upsert)
            late = [r for r in to_upsert if fence.blocks(r)] if fence else []
            if late:
                await self.index_repo.delete(fence.filter_for(late))
        if to_delete_ids:
            await self.index_repo.delete(
                all_of(eq("md_path", md_path), one_of("entry_id", to_delete_ids))
            )

    async def handle_deleted(self, md_path: str) -> HandlerOutcome:
        deleted = await self.index_repo.delete_by_md_path(md_path)
        return HandlerOutcome(
            md_path=md_path,
            kind=self.kind,
            upserted=0,
            deleted=deleted,
            skipped=0,
```

</details>

#### 缺口

- 逐记忆索引/遗忘状态候选没有原型、用户误判数据或与现有状态接口对照。
  **影响**：不能推断实际减少错用/遗忘误判或值得新增系统。
  **进一步探讨**：先以小故障矩阵比较当前task/health+读回与最小版本状态，状态假阳性或负担更大即推翻。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
