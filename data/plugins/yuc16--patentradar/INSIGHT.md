# PatentRadar

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0980562](https://github.com/yuc16/PatentRadar/tree/09805624bbd53d4acf58f51ef2c96822a436b2c5)

<!-- BEGIN META -->
[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yuc16/PatentRadar)
<!-- END META -->

> **功能**：从公开专利号组织竞品候选、技术特征对照和公开证据线索，供人工复核。

> **亮点**：把查找候选、逐项映射和报告拆成可回查的阶段，明确还缺什么来源。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：已知竞品召回和链接含产品标识均无法证明具体特征。内部机制缺乏公开证据时，应保留缺口。见 [Q02](#research-q02)。

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
  - [Q01 · 给定公开专利号，根项目如何生成可审阅的线索？](#detail-section-11)
  - [Q02 · 作者的 Hit@5 和 URL 指标能支持什么？](#detail-section-12)
  - [Q03 · 怎样把试用限制在可人工回源的范围？](#detail-section-13)
  - [Q04 · 报告能否减少人工定位缺口的时间？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：处理公开专利资料的研究人员，可先拿到一份待逐项核查的特征与竞品表。

对照人工搜索竞品手册并维护特征证据表。已有完整产品资料时，直接人工整理可能更简单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 公开资料编排 | 生成可审阅线索 | 依赖检索和模型 |
| 阶段日志 | 定位异常 | 不证明候选正确 |
| 特征表 | 列出可核证据 | 需人工逐项判断 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| Python 3.14、uv | 独立模式 | 按根清单准备 |
| 模型和搜索工具 | 查找和组织材料 | 独立模式用凭据，Skill 用宿主能力 |
| 人工审阅 | 复核特征 | 须能查原始页面 |

| 步骤 | 操作 | 边界 |
| --- | --- | --- |
| 取样 | 选一个公开案例 | 预设预算 |
| 生成 | 保留各阶段文件 | 失败时读日志 |
| 核对 | 逐特征回源 | 不一致改回人工 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 准备环境和案例 | 搭建人时 |
| 持续 | 搜索、模型和复核 | API 和人工分记 |
| 恢复 | 补查或手工重做 | 按一份合格线索表 |

| 结果 | 判据 | 限制 |
| --- | --- | --- |
| 候选线索 | 可定位公开材料 | 召回不是认定 |
| 缺口清单 | 可说明欠缺的特征证据 | 公开证据可能不存在 |

> **思考**：已知竞品召回和链接含产品标识均无法证明具体特征。内部机制缺乏公开证据时，应保留缺口。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把查找候选、逐项映射和报告拆成可回查的阶段，明确还缺什么来源。见 [Q01](#research-q01)、[Q02](#research-q02)。

逐阶段子进程输出日志，失败记录对应模块。MCP 有自己的工具入口，根未见原生 DSH 插件注册。

<a id="detail-section-5"></a>

### 1.4 主要限制

已知竞品召回和链接含产品标识均无法证明具体特征。内部机制缺乏公开证据时，应保留缺口。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅用公开、可回源案例验证一份线索表；不能支持具体特征时回到人工检索。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持阶段编排与失败日志。作者指标按其样本和分母记录，未复跑，合格报告和耗时仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/patentradar/server/runner.py、mcp/src/patentradar_mcp/app.py、evaluate/EVALUATION.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根分发、独立 runner、MCP 注册片段与项目评估口径。未运行流程或核查全部案例。
- 下一步：先复盘一个独立公开案例和失败日志，再做盲审比较。未执行目标代码。

**分析版本**

- **仓库**：[yuc16/PatentRadar](https://github.com/yuc16/PatentRadar)
- **版本号**：未声明（[固定提交 0980562](https://github.com/yuc16/PatentRadar/tree/09805624bbd53d4acf58f51ef2c96822a436b2c5)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用盲审比较自动初稿与人工表格在特征支持率和复核时间上的差异。见 [Q04](#research-q04)。

先复盘一个独立公开案例和失败日志，再做盲审比较。未执行目标代码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 55 | 24260 | — | — | 1202645 |
| .md | example | 4 | 1960 | — | — | 81185 |
| .js | source | 2 | 1022 | 880 | 76 | — |
| .md | test | 6 | 2556 | — | — | 103569 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/yuc16/PatentRadar/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：PatentRadar 如何辅助从公开专利号生成可人工核查的竞品线索，评估数据能支持哪一层判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 给定公开专利号，根项目如何生成可审阅的线索？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

面向需要整理公开竞品资料的研究人员，根项目交付 Python 工具，输入公开编号，输出可逐项回查的候选和证据报告。项目脚本注册 patentradar CLI，独立部署的运行器以子进程执行模块并等待返回，输出进入步骤日志，非零退出追加失败事件。根 README 还介绍 Skill 模式，它依赖宿主模型、搜索和子 Agent；MCP 子目录提供自己的工具注册。两种接入是不同入口，不能把它们都算作根 DSH 插件。相对手工把权项和产品手册整理进电子表格，增量在四个阶段与中间材料可回查，不能据此推断作者提出的耗时收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-39](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/README.md#L29-L39)

两种调度与工具责任

<details>
<summary>查看原文（11行）</summary>

```text
## 🚀 快速开始

### 部署：两种模式

| 维度 | 模式A：独立部署（高性能） | 模式B：skill 嵌入（最简单，推荐） |
|---|---|---|
| **所需依赖** | **1、至少一个搜索工具（Tavily/Bocha/Exa/Brave）2、大模型的api** | **零额外依赖，只需要codex或其他agent** |
| 调度 | [`server/runner.py`](src/patentradar/server/runner.py) 串 4 个 CLI subprocess | 主 agent spawn 4 个 subagent |
| LLM 调用 | 项目内的 [`llm/provider.py`](src/patentradar/llm/provider.py) 统一发包 | 由宿主 agent（Claude Code / Codex）的对话能力直接调用 |
| 搜索 / 抓页 | 项目内的 [`search/`](src/patentradar/search/) + [`fetcher/`](src/patentradar/fetcher/) 模块 | 由宿主 agent 的 WebSearch / WebFetch 工具直接调用 |
| 可观测追溯 | Web Dashboard + 4 个 module log 文件 | 宿主 agent 的对话窗口 + 落盘 JSON |
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:1-8](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/pyproject.toml#L1-L8)

根 Python 项目与解释器要求

```text
[project]
name = "patentradar"
version = "2.0"
description = "专利侵权线索挖掘系统 v2"
readme = "README.md"
requires-python = ">=3.14"
dependencies = [
    "beautifulsoup4>=4.14.3",
```

**依据 3 · 源码核查**：[pyproject.toml:27-35](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/pyproject.toml#L27-L35)

命令入口与根分发目录

```text
[project.scripts]
patentradar = "patentradar.cli:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/patentradar"]
```

**依据 4 · 源码核查**：[src/patentradar/server/runner.py:249-282](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/src/patentradar/server/runner.py#L249-L282)

子进程、日志与失败事件

<details>
<summary>查看原文（34行）</summary>

```text

        try:
            with step_log.open("a", encoding="utf-8") as logf:
                logf.write(f"$ {' '.join(shlex.quote(c) for c in cmd)}\n")
                logf.flush()
                process = subprocess.Popen(
                    cmd,
                    stdout=logf,
                    stderr=subprocess.STDOUT,
                    env=_env_for_step(step, stream_log),
                    cwd=str(ROOT),
                )
                rc = process.wait()
            elapsed = time.time() - started
            if rc != 0:
                _append_event(
                    run_log,
                    {
                        "module": step.n,
                        "label": step.label,
                        "event": "error",
                        "elapsed": round(elapsed, 2),
                        "exit_code": rc,
                        "message": _tail_message(step_log),
                        "log_path": str(step_log.relative_to(ROOT)),
                    },
                )
                _append_event(
                    run_log,
                    {
                        "event": "pipeline_end",
                        "status": "failed",
                        "failed_at_module": step.n,
                        "elapsed": round(time.time() - pipeline_started, 2),
```

</details>

**依据 5 · 源码核查**：[mcp/src/patentradar_mcp/app.py:113-145](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/mcp/src/patentradar_mcp/app.py#L113-L145)

MCP 的独立工具入口

<details>
<summary>查看原文（33行）</summary>

```text
    @server.tool(
        title="开始专利分析",
        description="用户给出专利公开号并要求开始分析时调用。搜索策略会根据当前工作区的 Key 自动选择。",
        annotations=ToolAnnotations(readOnlyHint=False, destructiveHint=False, idempotentHint=False, openWorldHint=False),
    )
    async def analysis_start(publication_no: str) -> dict[str, Any]:
        workspace_id = _workspace_id()
        try:
            data = StartAnalysisInput(publication_no=publication_no)
            case = store.create_case(workspace_id, data.publication_no)
            has_keys = any(store.key_status(workspace_id).values())
            return {
                "case_id": case["id"],
                "publication_no": case["publication_no"],
                "search_strategy": effective_search_strategy(case, provider_keys_available=has_keys),
                "next": current_work_item(case, provider_keys_available=has_keys),
            }
        except (ValidationError, ValueError) as exc:
            raise _tool_error(exc) from exc

    @server.tool(
        title="获取下一项分析任务",
        description="开始案件后反复调用，获取当前阶段及输入材料；不会返回搜索 Key。",
        annotations=ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=False),
    )
    async def analysis_next(case_id: str) -> dict[str, Any]:
        try:
            workspace_id = _workspace_id()
            case = store.get_case(workspace_id, case_id)
            has_keys = any(store.key_status(workspace_id).values())
            return current_work_item(case, provider_keys_available=has_keys)
        except KeyError as exc:
            raise _tool_error(exc) from exc
```

</details>

#### 缺口

- 未独立运行三个入口
  **影响**：DSH 或其他宿主接入兼容和耗时未知
  **进一步探讨**：先用已公开案例完成一次独立流水线并逐项回读中间材料

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 作者的 Hit@5 和 URL 指标能支持什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

固定评估报告把 26 件已知目标专利作为样本，任一已知竞品进入前五计命中，报告 25/26；首位为 17/26。命中组中得分达到作者证据阈值的仅 11/25。URL 准确口径是页面含品牌或型号，不等于页面证明每个技术特征。由于样本围绕已知目标，结果不能外推到真实未知案件或错误阳性率，也不能把候选和分数写作认定。其贡献是把缺失证据定位在具体特征与公开来源，仍须由专业人员查原件，尤其内部结构和控制机制未必公开。

#### 证据与依据

**依据 1 · 作者声明**：[evaluate/EVALUATION.md:17-35](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/evaluate/EVALUATION.md#L17-L35)

作者样本、命中与证据阈值

<details>
<summary>查看原文（19行）</summary>

```text
- **黄金集**：[`测试集.xlsx`](测试集.xlsx)，已跑共计**26 个专利** → 已认定侵权竞品。
- **口径**：以专利为单位，命中该专利**任一**真竞品即算命中；位次按 `total_score` 并列排名（同分并列）。

## 评估指标

| 维度 | 指标 | 数值 | 含义 |
|---|---|:---:|---|
| **召回** | Hit@5 | **96.2%** (25/26) | 真竞品进入系统 Top-5 的专利占比 |
| | Hit@3 | 80.8% (21/26) | 真竞品分数排名进前 3 |
| | Hit@1 | 65.4% (17/26) | 真竞品分数排名第 1 |
| | MRR | **0.749** | 平均倒数排名，综合"命中且靠前" |
| **判定** | 证据充足率 | **44.0%** (11/25) | 命中专利中，得分 ≥ 80（竞品证据已充足）的占比 |
| **证据** | URL 可达率 | **95.8%** (454/474) | 报告引用的证据链接有效比例 |
| | URL 准确率 | **93.8%** (380/405) | 链接页面正文确实含对应竞品型号/品牌，非模型编造 |

## 结论

- **召回强**：Hit@5 96.2%，能稳定找出已知侵权方。
- **证据充足率低的原因**：召回到真竞品后只有 44% 的得分 >=80 —— 公司提供的测试集中大部分专利保护的是**内部结构、控制器逻辑等技术要求**，这类特征需要电路图、内部结构图才能证明，公开资料极少、大多存在于公司内部数据库；公开渠道无法凑齐逐特征证据，是当前真竞品证据不足的主要限制（并非系统判定能力本身的缺陷）。这也是拖累Hit@1的主要原因。
```

</details>

**依据 2 · 作者声明**：[evaluate/EVALUATION.md:42-50](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/evaluate/EVALUATION.md#L42-L50)

明确 URL 指标和分母

```text
<sub>1) **各指标分子 / 分母**（召回类分母统一为 26 = 黄金集专利数（全部已跑）；命中位次按 `total_score` 并列排名）</sub>

<sub>**Hit@5** = 命中专利 / 已跑专利 = 25 / 26（命中 = 该专利任一真竞品进入 Top-5）</sub><br>
<sub>**Hit@3** = 最佳命中位次 ≤ 3 的专利 / 26 = 21 / 26</sub><br>
<sub>**Hit@1** = 最佳命中位次 = 1 的专利 / 26 = 17 / 26</sub><br>
<sub>**MRR** = Σ(每个专利的 1 / 最佳命中位次) / 26，未命中记 0 = 0.749</sub><br>
<sub>**证据充足率** = 得分 ≥ 80 的专利 / 命中真竞品的专利 = 11 / 25（分母 25 而非 26：未命中专利系统未找到真竞品，无从评判，不计入）</sub><br>
<sub>**URL 可达率** = HTTP 可访问 URL / 全部唯一证据 URL = 454 / 474</sub><br>
<sub>**URL 准确率** = 页面正文含对应竞品标识的 URL / 可判定 URL = 380 / 405（排除 52 个 PDF / 动态渲染 / 抓取失败的 URL）</sub>
```

**依据 3 · 作者声明**：[README.md:3-7](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/README.md#L3-L7)

作者给出的输出格式

```text
# PatentRadar

**专利侵权竞品分析**

输入一个专利公开号，输出一份竞品侵权分析报告——内容包括：逐项技术特征对比表、可点击的公开证据 URL、以及“还缺什么证据 / 下一步去哪查”的可执行建议。
```

#### 缺口

- 未重跑评估，样本与固定版本对应关系未独立验证
  **影响**：不能给未知案件中的召回、误判率或合格报告时间
  **进一步探讨**：用未参与样本构建的公开案件盲审核对特征与链接

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样把试用限制在可人工回源的范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先选一个公开专利和已有可复查手册的产品，限定预算并让专业审阅者复查原始材料。独立模式需 Python 3.14、搜索和模型凭据；PDF 额外依赖系统图形库，作者说明缺失时可只产 Markdown。Skill 模式省去单独服务部署，但把模型、搜索和调度转给宿主。首次成本是准备环境和样本，持续成本含 API 请求、核对网页及补缺；失败后用阶段日志定位，无法回源时保留人工表格。每件合格可复核线索表独立计人工工时和现金支出。这个试用只做事实线索整理，输出中的结论语言不能当作对外判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-49](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/README.md#L31-L49)

搜索、模型与宿主依赖

<details>
<summary>查看原文（19行）</summary>

```text
### 部署：两种模式

| 维度 | 模式A：独立部署（高性能） | 模式B：skill 嵌入（最简单，推荐） |
|---|---|---|
| **所需依赖** | **1、至少一个搜索工具（Tavily/Bocha/Exa/Brave）2、大模型的api** | **零额外依赖，只需要codex或其他agent** |
| 调度 | [`server/runner.py`](src/patentradar/server/runner.py) 串 4 个 CLI subprocess | 主 agent spawn 4 个 subagent |
| LLM 调用 | 项目内的 [`llm/provider.py`](src/patentradar/llm/provider.py) 统一发包 | 由宿主 agent（Claude Code / Codex）的对话能力直接调用 |
| 搜索 / 抓页 | 项目内的 [`search/`](src/patentradar/search/) + [`fetcher/`](src/patentradar/fetcher/) 模块 | 由宿主 agent 的 WebSearch / WebFetch 工具直接调用 |
| 可观测追溯 | Web Dashboard + 4 个 module log 文件 | 宿主 agent 的对话窗口 + 落盘 JSON |

#### 注：关于模式A的所需依赖说明
- **搜索工具**：**推荐四个搜索工具全部连接，性能最强**，模式A综合使用四个搜索工具，将不同工具的搜索性能极致发挥，其中tavily是主力搜索工具，消耗额度较高，所以.env中可配置多个tavily的api-key轮换使用。（如需大量低价api-key，可前往闲鱼购买）
    - [Tavily](https://www.tavily.com/)
    - [博查 API](https://open.bochaai.com/)
    - [Exa](https://exa.ai/)
    - [Brave Search API](https://brave.com/search/api/)
- **大模型**：模式A需要自己配置大模型的api-key，支持两种大模型的配置方式（推荐**chatgpt auth**，便宜、模型强、额度多）：
  - **chatgpt auth**（ChatGPT plus以上订阅可用，需本机安装codex cli后在终端运行 `codex login` 完成 OAuth）
  - **其他OpenAI 兼容格式**（aihubmix / DeepSeek / 自建网关）——请参考 [`.env.example`](.env.example)
```

</details>

**依据 2 · 作者声明**：[README.md:55-65](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/README.md#L55-L65)

环境和 PDF 降级说明

<details>
<summary>查看原文（11行）</summary>

````text
#### 方式 （1） · 本地 uv（推荐）

```bash
git clone https://github.com/yuc16/PatentRadar.git
cd PatentRadar
uv sync                              # 装全部依赖
cp .env.example .env                 # 在.env中填入你的所有API keys
```

> **PDF 渲染的系统层依赖** —— `uv sync` 只装 Python 包；WeasyPrint 另需系统级图形库（Pango / Cairo 等），Linux 还需中文字体（macOS / Windows 系统自带中文字体，无需另装）。缺图形库 → 只产出 md、无 PDF；缺中文字体 → PDF 中文乱码。按平台装一次即可（可以让AI帮你装）

````

</details>

**依据 3 · 源码核查**：[src/patentradar/server/runner.py:263-282](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/src/patentradar/server/runner.py#L263-L282)

失败阶段和日志位置

<details>
<summary>查看原文（20行）</summary>

```text
            if rc != 0:
                _append_event(
                    run_log,
                    {
                        "module": step.n,
                        "label": step.label,
                        "event": "error",
                        "elapsed": round(elapsed, 2),
                        "exit_code": rc,
                        "message": _tail_message(step_log),
                        "log_path": str(step_log.relative_to(ROOT)),
                    },
                )
                _append_event(
                    run_log,
                    {
                        "event": "pipeline_end",
                        "status": "failed",
                        "failed_at_module": step.n,
                        "elapsed": round(time.time() - pipeline_started, 2),
```

</details>

#### 缺口

- 未测真实 API 成本、凭据或停止恢复
  **影响**：不能量化作者的时间主张
  **进一步探讨**：用一个公开样本记录调用开销、人工复核时间和中断点

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 报告能否减少人工定位缺口的时间？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是阶段化的特征表和原始 URL 可减少审阅者定位缺失证据的时间。用相同的公开文档和未进入作者样本的案例比较人工表格与工具流程，让另一位审阅者盲查每个链接是否真正支持对应特征。记录可核对的单元格比例、错配数、补查用时和 API 支出。若有效证据比例不升、错配增加，或复核成本抵消整理时间，就保留人工流程。作者的 URL 命中口径可作补充观察，不能作为本对照的成功判据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/README.md#L3-L7)

特征表和公开链接是可对照产物

```text
# PatentRadar

**专利侵权竞品分析**

输入一个专利公开号，输出一份竞品侵权分析报告——内容包括：逐项技术特征对比表、可点击的公开证据 URL、以及“还缺什么证据 / 下一步去哪查”的可执行建议。
```

**依据 2 · 作者声明**：[evaluate/EVALUATION.md:42-50](https://github.com/yuc16/PatentRadar/blob/09805624bbd53d4acf58f51ef2c96822a436b2c5/evaluate/EVALUATION.md#L42-L50)

原 URL 指标不足以代表证据匹配

```text
<sub>1) **各指标分子 / 分母**（召回类分母统一为 26 = 黄金集专利数（全部已跑）；命中位次按 `total_score` 并列排名）</sub>

<sub>**Hit@5** = 命中专利 / 已跑专利 = 25 / 26（命中 = 该专利任一真竞品进入 Top-5）</sub><br>
<sub>**Hit@3** = 最佳命中位次 ≤ 3 的专利 / 26 = 21 / 26</sub><br>
<sub>**Hit@1** = 最佳命中位次 = 1 的专利 / 26 = 17 / 26</sub><br>
<sub>**MRR** = Σ(每个专利的 1 / 最佳命中位次) / 26，未命中记 0 = 0.749</sub><br>
<sub>**证据充足率** = 得分 ≥ 80 的专利 / 命中真竞品的专利 = 11 / 25（分母 25 而非 26：未命中专利系统未找到真竞品，无从评判，不计入）</sub><br>
<sub>**URL 可达率** = HTTP 可访问 URL / 全部唯一证据 URL = 454 / 474</sub><br>
<sub>**URL 准确率** = 页面正文含对应竞品标识的 URL / 可判定 URL = 380 / 405（排除 52 个 PDF / 动态渲染 / 抓取失败的 URL）</sub>
```

#### 缺口

- 未执行盲审对照
  **影响**：不能给效率收益
  **进一步探讨**：固定样本、预算和特征支持标准后预登记比较

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
