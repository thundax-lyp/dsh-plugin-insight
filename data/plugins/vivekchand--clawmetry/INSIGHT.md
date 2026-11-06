# ClawMetry

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[46d18ff](https://github.com/vivekchand/clawmetry/tree/46d18ffe35c361bb40b35782fd53db699636321f)

<!-- BEGIN META -->
[![GitHub ★ 436](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=436&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vivekchand/clawmetry)
<!-- END META -->

> **功能**：读取多种Agent运行时会话日志，统一展示轨迹、工具调用、token和可用成本数据。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持统一adapter/capability和可定位轨迹视图，公开样例有文件到API实现；不能由32目录或开源协议推出DSH读取器已审/可用，暂无独立诊断收益。

> **主要限制**：[Q01](#research-q01)至[Q04](#research-q04)最影响DSH采用的是reader在闭源companion、核心解析/控制不可核；观测不等事前阻断，估算零不总能证明免费，本地无sync也有条件外发。不能把所有保证从共享看板泛化。

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
  - [Q01 · 它为谁提供什么观测价值，DSH读取器是否在开源包中？](#detail-section-11)
  - [Q02 · 统一会话、成本与轨迹信号如何接通，能否证明进展？](#detail-section-12)
  - [Q03 · 看见风险动作是否意味着它能提前阻断？](#detail-section-13)
  - [Q04 · 本地默认、闭源授权、外发与退出带来什么负担？](#detail-section-14)
  - [Q05 · 怎样把观测面转为可证伪的诊断增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：ClawMetry是独立Python/Web观测基础设施，读取编码Agent既有会话文件/日志，在统一看板回放会话、工具与运行时暴露的token/cost，帮助开发者或多Agent操作者分辨长运行与疑似卡住。它不是安装进DSH的原生插件，不提供DSH推理loop。合格结果应是找到准确原始事件、标明缺字段并减少诊断误判；活动量、重复调用或看板亮起都不证明任务有业务进展。

逐个runtime原生会话回放和JSONL/账单人工诊断；统一观测/事件/估算是成熟方法，DSH自身loop与权限未由本项目提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 跨runtime观测 | 会话/工具回放 | 4个免费开源，目录总数非逐个验收 |
| DSH Beta reader | 声称读取sessions/zstd | 闭源companion，核心不可在本库审 |
| 成本/轨迹信号 | 辅助发现异常 | 缺数/估算非账单，信号非进展验收 |
| 控制/审批 | 按runtime能力处理风险 | 观察/事后kill非执行前gate |
| 本地/云可选通道 | 观察或同步/助手 | 不connect非离线，出口与留存分别核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python/Flask/DuckDB包 | 必需 | 本地服务与索引 | 固定源码声明Python>=3.8，目标环境未验 |
| 原runtime日志与权限 | 必需 | 会话/事件来源 | 检测/读取缺失不代表Agent没运行 |
| clawmetry-pro与合法权益 | DSH必需 | 闭源Beta读取器 | grace不提供缺失模块，到期可停用 |
| zstandard | DSH压缩数据条件需 | 作者称懒装读取 | 安装/解压链本次不可核 |
| connect/模型/控制hook | 可选 | 云同步/助手/阻断 | 分别增加外发、费用或设置修改 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选无敏感日志与隔离环境，核reader归属 | DSH合法companion/版本实际存在 |
| 观察 | 保持no connect/no hook，核OFFLINE及网络 | 菜单出现不算读取通过 |
| 对照 | 从看板逐事件回原文件与账单 | 标未知/估算/缺数，信号非任务结论 |
| 退出 | 停daemon/撤connect授权/卸各自hook | 索引DB和云留存按归属单独处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python依赖/closed授权金额未知 | 日志权限、reader/网络核查 | 不把免费OSS等同DSH免费 |
| 持续 | 读盘、索引存储、套餐/可选推理未知 | 格式升级、误报人审与保留策略 | 未证明节省诊断时间 |
| 失败 | 重建索引/坏文件排查未知 | 检查跳过数据/到期/companion加载 | 看板有数据不等全量 |
| 退出 | 本地/云留存资源未知 | 停daemon、撤权、卸hook/清归属数据 | pip卸载不等恢复设置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一观察 | 通用接口/公开adapter/API | DSHreader实际解析与兼容 |
| token/cost | 未知字段/估算逻辑可查 | 账单准确和异常零触达 |
| 轨迹信号 | 启发式可定位turn | 真卡住/任务质量与误报 |
| 风险控制 | reactive与pre-tool seam分开 | DSH实际事前阻断 |

> **思考**：[Q01](#research-q01)至[Q04](#research-q04)最影响DSH采用的是reader在闭源companion、核心解析/控制不可核；观测不等事前阻断，估算零不总能证明免费，本地无sync也有条件外发。不能把所有保证从共享看板泛化。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持统一adapter/capability和可定位轨迹视图，公开样例有文件到API实现；不能由32目录或开源协议推出DSH读取器已审/可用，暂无独立诊断收益。

capability/unknown、公共adapter失败隔离与扩展加载诊断可借鉴；DSHreader闭源、估算错误零/行为启发式和reactive控制限制要求结论绑定具体runtime。未全审巨大Python/Web应用或crypto。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01)至[Q04](#research-q04)最影响DSH采用的是reader在闭源companion、核心解析/控制不可核；观测不等事前阻断，估算零不总能证明免费，本地无sync也有条件外发。不能把所有保证从共享看板泛化。

<a id="detail-section-6"></a>

### 1.5 使用建议

DSH先观察：核合法reader和无敏感样本、逐事件覆盖及网络/控制/退出。缺核心闭源材料或验收时保留原生回放，不把一般开源样例当DSH试用完成。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

版本依据为 `dashboard.py:381` 的Python产品版本；根 `package.json` 的0.0.1仅属landing部署脚本包，不能当ClawMetry版本。

开源公共适配/成本/抑制与控制边界有固定源码，DSH核心reader属闭源依赖，本次未安装或验收。覆盖卡为未验证推演，不声称32适配均通过。

- 已检查：作者 README、包清单、源码路径 README.md、clawmetry/adapters/base.py、clawmetry/adapters/cost.py、clawmetry/adapters/qwen_code.py、clawmetry/adapters/registry.py、clawmetry/approvals.py、clawmetry/behaviour_signals.py、clawmetry/endpoints.py、clawmetry/entitlements.py、clawmetry/providers_pricing.py、clawmetry/sync.py、clawmetry/telemetry.py、dashboard.py、docs/APPROVALS.md、docs/EGRESS.md、docs/compatibility.md、routes/agents.py、setup.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读根README/setup、entitlements、DSH module specs/import、dashboard登记、公共base/registry/Qwen/API、cost helper/pricing、behaviour、approvals、telemetry/endpoints及egress docs；不包含闭源DSHreader/全部LocalStore/crypto/服务安装和全部控制器。
- 下一步：未安装pip/companion、运行目标代码/测试、采集真实会话、调用模型/云、安装hooks或故障注入。文档wire capture/资格/支持矩阵不当独立验收。

**分析版本**

- **仓库**：[vivekchand/clawmetry](https://github.com/vivekchand/clawmetry)
- **版本号**：0.12.939（[固定提交 46d18ff](https://github.com/vivekchand/clawmetry/tree/46d18ffe35c361bb40b35782fd53db699636321f)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的结论级覆盖/反证卡，将源缺失、跳过、成本性质和控制边界绑定结论；同轨迹测误判/诊断耗时，无收益则放弃，不计已有贡献。

未安装pip/companion、运行目标代码/测试、采集真实会话、调用模型/云、安装hooks或故障注入。文档wire capture/资格/支持矩阵不当独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 211 | 36072 | — | — | 422234 |
| .mjs | source | 2 | 573 | 359 | 185 | — |
| .ts | source | 8 | 518 | 386 | 76 | — |
| .js | source | 28 | 48071 | 39322 | 6759 | — |
| .md | example | 10 | 465 | — | — | 2792 |
| .tsx | source | 25 | 5309 | 4831 | 247 | — |
| .mjs | test | 8 | 2758 | 2030 | 544 | — |
| .md | test | 3 | 145 | — | — | 1105 |
| .js | test | 21 | 6217 | 4946 | 810 | — |
| .cjs | test | 1 | 23 | 23 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 74](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=74&color=737b86&logo=github)](https://github.com/vivekchand/clawmetry/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/vivekchand/clawmetry/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/vivekchand/clawmetry/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立跨runtime观测基础设施、DSH闭源接入、成本与控制及数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁提供什么观测价值，DSH读取器是否在开源包中？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ClawMetry是独立Python/Web观测基础设施，读取编码Agent既有会话文件/日志，在统一看板回放会话、工具与运行时暴露的token/cost，帮助开发者或多Agent操作者分辨长运行与疑似卡住。它不是安装进DSH的原生插件，不提供DSH推理loop。合格结果应是找到准确原始事件、标明缺字段并减少诊断误判；活动量、重复调用或看板亮起都不证明任务有业务进展。

相对逐个终端翻原生JSONL，增量是统一适配、capability面板与跨运行时定位，原生会话文件与成本字段来自被观测者。README称支持32运行时，但免费开源只带OpenClaw、NemoClaw、Goose和Qwen Code；DSH属于clawmetry-pro闭源companion。sync规格明确导入clawmetry_pro.adapters.deepseek_harness，缺失/坏模块被跳过，所以目录宣称和grace允许都不会凭空提供读取器。

DSH兼容矩阵标Beta、默认zstd会话、转录/model/tool calls和检测后懒装zstandard，这是作者声明与导入注释，本次无法核闭源解析实现、DSH cost或全数据覆盖。不能把开源MIT或32目录数写成32个独立验证适配。只用单一运行时且原生回放足够的用户未必值得加守护进程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-27](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/README.md#L11-L27)

作者定位既有日志观测和默认本地服务。

<details>
<summary>查看原文（17行）</summary>

````text
**An agent can make a hundred tool calls without making progress.** ClawMetry
reads the session files your coding agents already write, and puts the timeline,
the tool calls and whatever token and cost data the runtime exposes into one
view — so you can tell a long run that is working from one that is stuck.

Works with **32 AI agent runtimes** — Claude Code, OpenAI Codex, Hermes, OpenClaw & 28 more. One dashboard for your whole agent fleet. ([the full list](SUPPORTED_RUNTIMES.txt), generated from the catalogue.)

> 🌐 **Read this in:** [English](README.md) · [简体中文](docs/i18n/zh-CN/README.md) · [日本語](docs/i18n/ja/README.md) · [한국어](docs/i18n/ko/README.md) · [Español](docs/i18n/es/README.md) · [Português (BR)](docs/i18n/pt-BR/README.md) · [Français](docs/i18n/fr/README.md) · [Deutsch](docs/i18n/de/README.md) · [हिन्दी](docs/i18n/hi/README.md) · [العربية](docs/i18n/ar/README.md) · [Русский](docs/i18n/ru/README.md) · [more →](docs/i18n/)

One command. Zero config. Auto-detects everything.

```bash
pip install clawmetry && clawmetry
```

Opens at **http://localhost:8900**. Zero config: it finds the agent runtimes
you already have, reads them read-only, and changes nothing about how they run.
````

</details>

**依据 2 · 作者声明**：[README.md:33-44](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/README.md#L33-L44)

开源/paid与外发作者说明。

<details>
<summary>查看原文（12行）</summary>

```text
| | |
|---|---|
| **What it does** | Reads the session files and logs your agents already write. No SDK, no code change, no instrumentation in your app. |
| **What you see** | Session timeline, tool-by-tool replay, token and cost breakdown, and trajectory signals (looping, repeated failures) — per runtime. |
| **What's free** | `pip install clawmetry` reads **OpenClaw, NVIDIA NemoClaw, Goose and Qwen Code** with no account, no key and no network call. The other 28 — Claude Code, Codex, Cursor and the rest — are read by the closed-source `clawmetry-pro` companion, which arrives with the 7-day trial or a plan — see [docs/ENTITLEMENTS.md](docs/ENTITLEMENTS.md) for the exact split. |
| **How to start** | `pip install clawmetry && clawmetry`, then open localhost:8900. No agents on this machine yet? `clawmetry --sample` opens on three labelled synthetic sessions. |
| **What leaves your machine** | No session data, unless you run `clawmetry connect`. Two things do run by default, both opt-out and neither carrying session content: an anonymous install ping and a PyPI version check. Every destination is inventoried in [docs/EGRESS.md](docs/EGRESS.md), rebuilt from a wire capture rather than from reading comments. |

Two limits worth knowing before you judge the output: runtimes expose very
different data (some publish no cost at all — [the matrix](docs/compatibility.md)
says which, per runtime), and observing an action is not the same as being able
to block it ([which controls are real, per runtime](docs/APPROVALS.md)).
```

</details>

**依据 3 · 源码核查**：[clawmetry/entitlements.py:108-135](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/entitlements.py#L108-L135)

免费4运行时与DSH paid分类。

<details>
<summary>查看原文（28行）</summary>

```text
FREE_RUNTIMES = frozenset({"openclaw", "nemoclaw", "goose", "qwen_code"})

# PAID: every other agent runtime ClawMetry can observe. These ship in the
# closed-source ``clawmetry-pro`` package, not here — listed so the UI can
# render locked rows + an upgrade CTA, and so the gate has a known universe.
PAID_RUNTIMES = frozenset(
    {
        "claude_code",
        "codex",
        "cursor",
        "aider",
        "opencode",
        "hermes",
        "picoclaw",
        "nanoclaw",
        "pi",
        "deepagents",
        "n8n",
        "antigravity",
        "copilot",
        "grok",
        "grok_bot",
        "qm",
        "deepseek_harness",
        "exo",
        "kimi",
        "devin",
        "gemini_cli",
```

</details>

**依据 4 · 源码核查**：[clawmetry/sync.py:15240-15245](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/sync.py#L15240-L15245)

DSH实际模块规格为闭源companion。

```text
    # DeepSeek Harness (github.com/deepseek-ai/deepseek-harness) — JSONL
    # session logs under $DSH_HOME/sessions (default ~/.dsh/sessions),
    # zstd-compressed by default; the adapter lazily installs `zstandard`
    # only after compressed dsh data is positively detected.
    ("clawmetry_pro.adapters.deepseek_harness", "DeepSeekHarnessAdapter"),
    # Exo harness (github.com/exoharness/exo) — one pretty-printed JSON file
```

**依据 5 · 源码核查**：[clawmetry/sync.py:15493-15502](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/sync.py#L15493-L15502)

缺失/坏模块跳过，不生成适配器。

<details>
<summary>查看原文（10行）</summary>

```text
def _family_adapter_classes():
    """Return the importable non-OpenClaw runtime adapter classes."""
    classes = []
    for mod_name, cls_name in _FAMILY_ADAPTER_SPECS:
        try:
            mod = __import__(mod_name, fromlist=[cls_name])
            classes.append(getattr(mod, cls_name))
        except Exception as exc:  # missing/broken adapter never blocks the rest
            log.debug(f"family adapter {mod_name}.{cls_name} unavailable: {exc}")
    return classes
```

</details>

**依据 6 · 作者声明**：[docs/compatibility.md:40-40](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/docs/compatibility.md#L40-L40)

DSH Beta与zstd/字段范围作者说明。

```text
| DeepSeek Harness | Beta adapter | JSONL under `$DSH_HOME/sessions` (default `~/.dsh/sessions`), zstd-compressed by default | Transcripts, model, tool calls. `zstandard` is installed lazily, only once compressed dsh data is detected. |
```

#### 缺口

- 固定仓库不含DSH闭源reader，未装companion或核其签名/解析。
  **影响**：无法对DSH完整接入、准确性和费用闭环给源码验收结论。
  **进一步探讨**：先取得合法可审查同版本reader或同版本真实无敏感DSH样本验收，逐事件对照原日志，不能只验runtime菜单。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一会话、成本与轨迹信号如何接通，能否证明进展？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

adapter registry按name注册并允许后注册替换，detect异常只把该适配器标未检出；dashboard只对实际importable且detect成功者登记。公共Session/Event superset与capabilities决定UI面板，未知cost=None和phase=None可以保留，token默认0则必须结合覆盖说明，不能把未暴露当真实零。agents API先尝试LocalStore快路，未命中才经registry.list_sessions。

开源Qwen样例实际枚举会话文件、解析、坏文件跳过、按活动时间排序，并将thinking/message/tool_call/tool_result映射统一事件。这能证明公共观察管线有实现，不证明DSH reader也用相同细节。坏文件跳过保证其他会话可看，却可能造成缺数，列表非空不等全量覆盖。

成本helper无model或无可计费tokens返None，按provider/model/cache估算；底层pricing异常返0.0，而helper会把其float原样当零保留，因此不是所有零都能据此证明真实免费。本次未复现正常输入触发该错误，不称DSH已存在误计费，只指出不能将估算当账单。behaviour signals用正则/局部结构检测拒绝、懒惰、失败和重复，不是任务验收或心理状态事实；必须回查上下文。

#### 证据与依据

**依据 1 · 源码核查**：[clawmetry/adapters/registry.py:21-35](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/registry.py#L21-L35)

name替换式注册。

<details>
<summary>查看原文（15行）</summary>

```text
def register(adapter: AgentAdapter) -> None:
    """Register an adapter instance. Idempotent on ``adapter.name``.

    Later registrations for the same name overwrite — lets plugin
    packages override the built-in adapter if they want.
    """
    if not adapter.name:
        raise ValueError(f"Adapter {adapter!r} missing .name")
    with _lock:
        for i, existing in enumerate(_adapters):
            if existing.name == adapter.name:
                _adapters[i] = adapter
                logger.debug(f"Replaced adapter {adapter.name!r}")
                return
        _adapters.append(adapter)
```

</details>

**依据 2 · 源码核查**：[dashboard.py:6776-6803](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/dashboard.py#L6776-L6803)

import/detect后注册且隔离单适配器错误。

<details>
<summary>查看原文（28行）</summary>

```text
    # (Hermes, Claude Code, Codex, Cursor, PicoClaw, NanoClaw, ...). Each uses
    # its own native session format. Register each only when its own cheap,
    # never-raising detect() reports the runtime present on this host, so an
    # absent runtime never clutters the multi-agent view. The single source of
    # truth for which runtimes exist is sync._family_adapter_classes().
    try:
        from clawmetry.sync import _family_adapter_classes as _fam_classes
        for _family_cls in _fam_classes():
            try:
                _inst = _family_cls()
                # A licensed install's clawmetry-pro plugin registers its own
                # (closed) adapter for some runtimes at import time, before this
                # loop runs. Don't clobber it — the registry intentionally lets
                # plugins override the bundled adapter. Free installs have no
                # plugin, so this is a no-op and OSS registers its own.
                if _adapter_registry.get(_inst.name) is not None:
                    continue
                if _inst.detect().detected:
                    _adapter_registry.register(_inst)
            except Exception as _fam_err:  # pragma: no cover - defensive
                import logging as _logging
                _logging.getLogger(__name__).debug(
                    "Skipped %s registration: %s", _family_cls.__name__, _fam_err
                )
    except Exception as _fam_import_err:  # pragma: no cover - defensive
        import logging as _logging
        _logging.getLogger(__name__).debug(
            "Family-runtime adapters unavailable: %s", _fam_import_err
```

</details>

**依据 3 · 源码核查**：[clawmetry/adapters/base.py:101-145](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/base.py#L101-L145)

Session未知成本、默认tokens与phase语义。

<details>
<summary>查看原文（45行）</summary>

```text

    ``agent`` identifies which adapter produced this row. ``id`` is the
    native session identifier (UUID, timestamp-hash, etc.) — opaque to
    the platform. Token breakdown fields default to 0 for adapters that
    do not compute them; ``cost_usd=None`` means "unknown / not tracked".
    """

    agent: str
    id: str
    display_name: str = ""
    title: str = ""
    model: str = ""
    source: str = ""
    started_at: float = 0.0
    ended_at: float | None = None
    parent_id: str | None = None
    message_count: int = 0
    total_tokens: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    reasoning_tokens: int = 0
    cost_usd: float | None = None
    cost_status: str = ""
    # Why the session ended, in the RUNTIME's own words where it has any
    # (``user_stopped``, ``max_turns``, ``turn_aborted:interrupted``). Where a
    # runtime states none, ``resolve_phase`` fills one of the shared reasons in
    # ``clawmetry.adapters.phase.END_REASONS``; an adapter's own account of
    # what happened is never overwritten.
    end_reason: str = ""
    # Working directory the session ran in ("" when the runtime hides it).
    # First-class because kill/pause pid resolution keys on it
    # (process_control.resolve_by_cwd); adapters should ALSO mirror it into
    # extra["cwd"] while older OSS wheels without this field are in the
    # fleet (a pro adapter passing cwd= against an old wheel would crash).
    cwd: str = ""

    # ── Phase model (see clawmetry/adapters/phase.py) ─────────────────────
    # An adapter that can see its runtime's state sets ``phase`` (and
    # ``status`` where it can see more) directly. One that cannot leaves both
    # empty and ``resolve_phase`` derives what it can from the timestamps.
    # ``None`` after resolution means the observed data could not establish a
    # phase. That is an answer, and it is deliberately not ``idle``.
    phase: str | None = None
```

</details>

**依据 4 · 源码核查**：[routes/agents.py:252-278](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/routes/agents.py#L252-L278)

LocalStore快路与registry会话读取。

<details>
<summary>查看原文（27行）</summary>

```text

@bp_agents.route("/api/agents/<name>/sessions")
def api_agent_sessions(name: str):
    blocked = require_runtime(name)
    if blocked is not None:
        return blocked
    try:
        limit = max(1, min(1000, int(request.args.get("limit", 100))))
    except (TypeError, ValueError):
        limit = 100
    if is_local_store_read_enabled():
        fast = _try_local_store_agent_sessions(name, limit)
        if fast is not None:
            return jsonify(fast)
    adapter = registry.get(name)
    if adapter is None:
        return jsonify({"error": f"Unknown agent: {name}"}), 404
    try:
        sessions = adapter.list_sessions(limit=limit)
    except Exception as exc:
        return jsonify({"error": f"list_sessions() failed: {exc}"}), 500
    # Every adapter's session gets a phase here, whether or not the adapter set
    # one: ``resolve_phase`` keeps an asserted phase and derives one from the
    # timestamps otherwise. An adapter that genuinely cannot say leaves it
    # ``None``, which is the honest answer and deliberately not ``idle``.
    now = time.time()
    for s in sessions:
```

</details>

**依据 5 · 源码核查**：[clawmetry/adapters/qwen_code.py:1024-1072](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/qwen_code.py#L1024-L1072)

开源文件枚举、坏文件跳过和事件种类。

<details>
<summary>查看原文（49行）</summary>

```text
    def list_sessions(self, limit: int = 100) -> list[Session]:
        """Return recent sessions, newest first. Never raises on a bad file."""
        files = self._session_files()
        if not files:
            return []

        # Read settings.json once (global to the Qwen home) and stamp the
        # active-provider / telemetry-target summary onto every session.
        settings_extra = _settings_extra()

        sessions: list[Session] = []
        for path in files:
            session_id = os.path.basename(path)[:-6]  # strip ".jsonl"
            try:
                sess = _session_from_file(path, session_id, settings_extra)
            except Exception as exc:
                # Never let one bad session sink the whole list.
                logger.warning("QwenCodeAdapter: skipping bad session %s: %s", path, exc)
                continue
            if sess is not None:
                sessions.append(sess)

        # Sort by logical activity time, newest first. We sort on the parsed
        # timestamp (last record / mtime fallback), NOT raw file mtime, so the
        # ordering is deterministic across a git checkout or file copy in CI.
        sessions.sort(key=lambda s: s.ended_at or s.started_at or 0.0, reverse=True)
        parents = sessions[:limit]
        # Sub-agent fan-out rides after the parent slice so a fanned-out
        # session can't starve others out of the limit budget.
        children: list[Session] = []
        for sess in parents:
            path = self._find_session_path(sess.id)
            if path:
                children.extend(self._list_subagent_sessions(
                    path, sess.id, settings_extra))
        return parents + children

    def list_events(self, session_id: str, limit: int = 500) -> list[Event]:
        """Parse one session's chat recording into unified events.

        Records are already chronological on disk (one append per turn). We
        emit, per record: a ``thinking`` event for any reasoning part, a
        ``message`` event for visible text, a ``tool_call`` event per
        functionCall, and a ``tool_result`` event for a tool-result record.
        """
        path = self._find_session_path(session_id)
        if not path:
            return []

```

</details>

**依据 6 · 源码核查**：[clawmetry/adapters/cost.py:72-105](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/cost.py#L72-L105)

None与估算float返回。

<details>
<summary>查看原文（34行）</summary>

```text

    model = (model or "").strip()
    if not model:
        return None

    in_tok = _coerce_int(input_tokens)
    out_tok = _coerce_int(output_tokens)
    cr_tok = _coerce_int(cache_read)
    cw_tok = _coerce_int(cache_write)

    # Nothing to price -- keep the adapter's honest "unknown" (None); don't
    # fabricate a 0.0 that would read as "this turn was free".
    if not (in_tok or out_tok or cr_tok or cw_tok):
        return None

    try:
        cost = estimate_event_cost_usd(
            model,
            input_tokens=in_tok,
            output_tokens=out_tok,
            cache_read_tokens=cr_tok,
            cache_write_tokens=cw_tok,
            provider=provider or "",
        )
    except Exception:
        return None

    # estimate_event_cost_usd never raises and returns a float; 0.0 here is a
    # *real* cost (local model, or a known provider with a zero-rate model),
    # so return it as-is rather than collapsing it to None.
    try:
        return float(cost)
    except (TypeError, ValueError):
        return None
```

</details>

**依据 7 · 源码核查**：[clawmetry/providers_pricing.py:637-696](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/providers_pricing.py#L637-L696)

按provider/cache算费，except返回0。

<details>
<summary>查看原文（60行）</summary>

```text
def estimate_event_cost_usd(
    model: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
    cache_read_tokens: int = 0,
    cache_write_tokens: int = 0,
    provider: str = "",
) -> float:
    """Cache-aware per-event cost in USD (#2049).

    Infers the provider from the model when not supplied — important because
    ``_get_rates`` needs the right provider (an empty provider falls through to
    the conservative unknown default and mis-prices). Anthropic cache counts
    are additional to input_tokens. OpenAI cache counts are INCLUDED in total
    input_tokens, so replace their ordinary input charge with the published
    cache rate. Unknown OpenAI models retain the provider baseline estimate.
    Local / self-hosted models resolve to 0. Never raises.
    """
    try:
        prov = (provider or provider_for_model(model)).lower()
        input_rate, output_rate = _get_rates(prov, model)
        if input_rate == 0 and output_rate == 0:
            return 0.0
        cost = (
            (max(0, int(input_tokens)) / 1_000_000) * input_rate
            + (max(0, int(output_tokens)) / 1_000_000) * output_rate
        )
        if prov == "anthropic":
            cost += (max(0, int(cache_read_tokens)) / 1_000_000) * input_rate * _CACHE_READ_MULT
            cost += (max(0, int(cache_write_tokens)) / 1_000_000) * input_rate * _CACHE_WRITE_MULT
        elif prov == "meta":
            # Cached tokens are inside input_tokens (verified, see
            # _META_CACHED_RATES): swap the cached slice onto the cached rate.
            cached_rate = _meta_cached_rate(model)
            if cached_rate is not None:
                total_input = max(0, int(input_tokens))
                cached = min(total_input, max(0, int(cache_read_tokens)))
                cost += cached / 1_000_000 * (cached_rate - input_rate)
        elif prov in ("openai", "azure-openai"):
            prices = _openai_prices(model)
            if prices is not None:
                total_input = max(0, int(input_tokens))
                # Astra's full-request long-context rates begin above 272K
                # input tokens. Callers must price per response, not a
                # session-wide sum that would cross this threshold falsely.
                astra = re.sub(r"-\d{4}-\d{2}-\d{2}$", "", (model or "").lower().split("/", 1)[-1]) == "gpt-6-astra"
                if astra and total_input > 272000:
                    input_rate *= 2
                    output_rate *= 1.5
                    prices = (input_rate, output_rate, prices[2] * 2, prices[3] * 2)
                    cost = (total_input * input_rate + max(0, int(output_tokens)) * output_rate) / 1_000_000
                cached = min(total_input, max(0, int(cache_read_tokens)))
                written = min(total_input - cached, max(0, int(cache_write_tokens)))
                if prices[2] is not None:
                    cost += cached / 1_000_000 * (prices[2] - input_rate)
                if prices[3] is not None:
                    cost += written / 1_000_000 * (prices[3] - input_rate)
        return round(cost, 8)
    except Exception:
        return 0.0
```

</details>

**依据 8 · 源码核查**：[clawmetry/behaviour_signals.py:1-34](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/behaviour_signals.py#L1-L34)

正则/结构信号与覆盖限制。

<details>
<summary>查看原文（34行）</summary>

```text
"""Behaviour Signals: what people and agents *say* about a run (WO-58).

Guard reads the tool stream to ask "is the agent stuck?". This module reads
the words in the same transcripts to ask "is the agent frustrating the person
using it, and is it giving up on them?". Six preset signals, each a binary
match against ONE turn of a session:

  user_frustration    the person swears at or corrects the agent
  user_praise         the person says thanks / perfect / nice
  assistant_refusal   the agent declines ("I can't help with", "as an AI")
  assistant_laziness  the agent hands the work back ("you can do this
                      manually", "left as an exercise", TODO placeholders)
  task_failure        the agent says it could not finish
  user_retry          the person re-sends substantially the same request

Rules this module enforces:

* **Judge-free.** Every matcher is a precompiled regular expression or a
  small structural check (token Jaccard between consecutive user turns).
  There is no LLM on this path and there never will be on the hot path.
* **The matched text is never stored.** A match record carries the signal
  name, the turn reference, the matcher that fired and a short category.
  A stored "this sucks" next to a developer's name is a privacy problem, so
  matches point at the turn and the transcript viewer shows it under the
  existing access rules.
* **Bounded per tick.** The daemon scans at most ``MAX_EVENTS_PER_TICK``
  turn events per pass, reads at most ``SCAN_CAP_CHARS`` of each turn, and
  advances a watermark on ``events.created_at`` so a turn is evaluated once.
* **Coverage is stated, never implied.** A runtime that does not write user
  prompts to disk reports ``user_text: false`` and the surface says "not
  exposed by this runtime" rather than 0%.
* **Precision over recall.** Word boundaries everywhere, a negation guard
  ("not bad", "this doesn't suck") and a positive-context guard ("pretty
  damn good") on the profanity group. "kill the process" matches nothing.
```

</details>

#### 缺口

- 未验DSH解析、全部LocalStore去重和实际账单对齐，未复现价格异常路径。
  **影响**：不能把统一字段或估算零当数据完整/成本准确，也不能把信号当卡住事实。
  **进一步探讨**：对每支持样本逐事件和用量账单核对，注入坏文件、未知模型和价格错误，确认UI能看缺数/未知。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 看见风险动作是否意味着它能提前阻断？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

观察与控制属于不同能力。base capability把GATEWAY_RPC与SESSIONS/EVENTS分开，只有适配器声明的控制面才提供相应入口。approvals源码明确reactive watcher读取已进入DuckDB的tool事件，拒绝后通过gateway或pid kill；这在动作发生后，不可能撤销已删文件或已发送请求。实时看板不等执行前权限边界。

预执行阻断需要运行时原生gate/hook。文档示范Claude Code PreToolUse并会改~/.claude/settings.json；approvals另有register pre-tool handlers与runtime-specific kill seam，外部插件可实现具体控制，但本次没有DSH reader/gate源，不能把Claude的hook或跨runtime风险评分推成DSH执行前审批。停止整个会话与拒绝单工具也不同，用户要看实际控制receipt。

“读取既有会话不改Agent”只适合基本观测路径，不包括可选hooks、远控、同步或自动策略。若目标只是诊断先保持观察，不安装控制hook；需要阻止DSH危险操作应依赖真实Host原生权限链并单独验收。

#### 证据与依据

**依据 1 · 源码核查**：[clawmetry/adapters/base.py:24-43](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/base.py#L24-L43)

界面数据与gateway控制capability分开。

<details>
<summary>查看原文（20行）</summary>

```text

class Capability(str, Enum):
    """UI/data capabilities an adapter may expose.

    The dashboard gates panels by these. An adapter that returns
    ``{SESSIONS, EVENTS}`` gets only the Sessions tab; one that adds
    ``BRAIN`` unlocks the live event stream; adding ``GATEWAY_RPC``
    enables control-plane actions (pause/resume, cron CRUD).
    """

    SESSIONS = "sessions"
    EVENTS = "events"
    COST = "cost"
    SUBAGENTS = "subagents"
    CRONS = "crons"
    SKILLS = "skills"
    MEMORY = "memory"
    BRAIN = "brain"
    LOGS = "logs"
    GATEWAY_RPC = "gateway_rpc"
```

</details>

**依据 2 · 源码核查**：[clawmetry/approvals.py:1-17](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/approvals.py#L1-L17)

reactive事件后审批/kill工作方式。

<details>
<summary>查看原文（17行）</summary>

```text
"""clawmetry/approvals.py — cloud-mediated approval policy engine.

Watches the unified DuckDB event store (``clawmetry/local_store.py``) for
tool calls that match a user-defined approval policy. When a match fires:

  1. POST the request to ClawMetry cloud (`/api/approvals/request`)
  2. Notify a human (cloud handles delivery — Slack/email/browser link)
  3. Poll cloud (`/api/approvals/<id>`) every 3 s up to policy.timeout
  4. On `denied` → abort the agent: gateway `sessions_kill(session_id)` for
     OpenClaw sessions, the pid-based `process_control.kill_session` engine
     (same one the Stop button uses) for family runtimes
     (claude_code/codex/goose/opencode/aider — ids like `claude_code:UUID`)
  5. On `timeout` → apply policy.on_timeout (default: deny → kill)
  6. On `approved` → no-op, the action proceeds

Policies live in `~/.clawmetry/policies.yml`. See README + the in-app
Policies tab for the YAML format.
```

</details>

**依据 3 · 源码核查**：[clawmetry/approvals.py:67-104](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/approvals.py#L67-L104)

runtime kill/pretool seam和after-fact界限。

<details>
<summary>查看原文（38行）</summary>

```text
# Extension seam for closed-source runtimes (clawmetry-pro packages a handful
# of them — nanoclaw, picoclaw, hermes …). Each runtime whose "stop a session"
# story doesn't match the openclaw gateway RPC or the family-runtime pid-based
# ``process_control.kill_session`` can register a callable here at import
# time; ``_kill_session`` looks it up by the ``"<runtime>:<id>"`` prefix and
# calls it BEFORE falling through to the built-in gateway/process paths.
#
# The callable takes the FULL session_id (e.g. ``"nanoclaw:sess-abc"``) and
# returns True when the kill was carried out. Anything raised inside the
# callable is logged and swallowed — a broken handler must NEVER escape into
# the daemon loop, so a bad third-party plugin degrades to "kill returned
# False" instead of crashing the approvals watcher thread.
KILL_HANDLERS: dict[str, Callable[[str], bool]] = {}


def register_kill_handler(runtime: str, fn: Callable[[str], bool]) -> None:
    """Register a runtime-specific kill callable. Idempotent overwrite.

    ``runtime`` is the lowercase prefix of a session id
    (e.g. ``"nanoclaw"``, ``"picoclaw"``). ``fn(session_id) -> bool``
    returns True when the kill actually landed. Exceptions raised by ``fn``
    are logged + swallowed by ``_kill_session``, never propagated."""
    KILL_HANDLERS[(runtime or "").strip().lower()] = fn


# ── Pre-tool gate-handler registry ──────────────────────────────────────────
#
# Mirror of KILL_HANDLERS for the PRE-execution side. A "gate" is a
# runtime-native mechanism that pauses a tool call BEFORE it runs (OpenClaw's
# `exec-policy preset cautious`, Claude Code's PreToolUse hook, …) — the
# reactive watcher below can only detect-and-kill AFTER the fact.
#
# Each handler is ``fn(want_gate: bool, policies: list[dict]) -> None`` and
# MUST be:
#   * idempotent — the watcher calls it every ~2 s with the current posture;
#   * conservative — only undo what IT installed (state-file pattern, see
#     _EXEC_POLICY_STATE / claude_code_gate._STATE_PATH), never clobbering a
#     posture or hook the operator set by hand.
```

</details>

**依据 4 · 作者声明**：[docs/APPROVALS.md:9-24](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/docs/APPROVALS.md#L9-L24)

作者Claude hook写设置及单工具效果。

<details>
<summary>查看原文（16行）</summary>

````text
**Pre-execution blocking for Claude Code** — one command installs a
PreToolUse hook that pauses matching tool calls *before* they run and waits
for your decision (one tap from your phone with
[cloud push notifications](https://app.clawmetry.com/push) enabled):

```bash
clawmetry hooks install     # writes ~/.claude/settings.json (idempotent)
clawmetry hooks status      # what's wired + how many policies are active
clawmetry hooks uninstall   # removes only ClawMetry's entries
```

A deny blocks just that one tool call — the agent keeps its session and can
try another approach. Approving on your phone skips Claude Code's own
permission prompt (you already answered). Unmatched tools cost ~40ms and
fall through to Claude Code's normal permission flow. You also get a phone
push when Claude Code itself is waiting on you (`permission_prompt` /
````

</details>

#### 缺口

- 本次无法确认DSH专用控制、停会话和预执行gate。
  **影响**：不能按跨runtime口号授权DSH安全阻断或恢复，不能推荐依赖其防危险副作用。
  **进一步探讨**：针对实际runtime用可丢弃操作检查是否在副作用前暂停、超时/失联默认及原生审批是否保留，分别核单工具与会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地默认、闭源授权、外发与退出带来什么负担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

开源包由pip分发、Python>=3.8、Flask和DuckDB等依赖，在本机提供服务并留下缓存/索引；源码版本0.12.939。DSH还要合法companion/试用或license及潜在zstandard，不能把pip免费安装当DSH免费可读。ENTITLEMENTS顶部说grace所有check允许，但allows_runtime源码特别排除expired付费权益，试用到期仍可能停用，宽限不是永久免费。当前真实计划价目本次未查，金额未知。

不connect只关会话同步不等离线。文档披露默认安装ping、PyPI检查，故障报告及有ANTHROPIC_API_KEY时告警narrator等条件外发；telemetry源码发送随机install_id、系统/Python/版本/检测runtime等，非会话正文，并有DO_NOT_TRACK/marker与默认URL拒绝策略。endpoints suppression覆盖OFFLINE/self-hosted/custom端点的discretionary calls，但明确配置的自托管ingest不属其范围，因此环境变量不是通用网络防火墙。

connect同步按文档含密封内容及明文metadata，hosted ingest推送则不密封；可选Assistant会把问题、schema与受限查询结果交给选定模型。这些本次仅审文档与部分通用抑制链，未审完整E2E crypto/浏览器bootstrap/relay/companion，不能保证运营商绝看不到数据或全出口已封。首次只用无敏感日志、隔离环境、OFFLINE且不connect/不开Assistant/hooks，核真实网络与实际DSHreader；当前DSH采用建议观察。

持续需读盘/存储/索引、适配格式升级、数据保留、人审误报与付费授权维护。退出应停daemon/后台服务、断connect并撤授权、单独卸hooks、按归属处理本地DB和云留存；pip uninstall不等自动清除索引或恢复Agent设置，具体退出未执行。

#### 证据与依据

**依据 1 · 源码核查**：[setup.py:94-100](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/setup.py#L94-L100)

Python与Flask安装条件。

```text
    python_requires=">=3.8",
    install_requires=[
        "flask>=2.0,<4",
        "waitress>=2.0",
        "psutil>=7.2.2",  # portable bounded node observation
        # AES-256-GCM for the cloud-sync snapshot envelope, so it is on the
        # data path. The floor was >=3.0, which accepts 42 releases carrying
```

**依据 2 · 源码核查**：[setup.py:148-157](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/setup.py#L148-L157)

本地DuckDB及依赖条件。

<details>
<summary>查看原文（10行）</summary>

```text
        # Local store at ~/.clawmetry/clawmetry.duckdb. Holds events,
        # sessions, memory, heartbeats, system snapshots, traces. ~14 MB
        # wheel; columnar storage gives 10-100x speed vs SQLite for the
        # dashboard's GROUP BY/time-window workloads (epic #964).
        # duckdb 1.4.5 introduced a Python 3.9 regression that causes a
        # SIGSEGV during `clawmetry --help` (Click eager-loads subcommands
        # which trigger DuckDB C-extension init on py3.9). Exclude 1.4.5
        # until DuckDB ships a fix. See clawmetry#5317 / heartbeat run
        # #33214123048. Same class of bug as the cffi<2 pin above.
        "duckdb>=0.10,!=1.4.5",
```

</details>

**依据 3 · 源码核查**：[dashboard.py:381-381](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/dashboard.py#L381-L381)

固定源码版本。

```text
__version__ = "0.12.939"
```

**依据 4 · 源码核查**：[clawmetry/entitlements.py:864-883](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/entitlements.py#L864-L883)

grace不覆盖expired付费权益。

<details>
<summary>查看原文（20行）</summary>

```text
    def allows_runtime(self, runtime: str) -> bool:
        # Grace-mode permissiveness exists so the enforce-day rollout cannot
        # break installs that never opted into anything. An EXPIRED paid
        # entitlement is the opposite case: the user took a trial (or let a
        # license lapse) and the deal is that it stops working — otherwise a
        # 7-day trial is a permanent unlock while grace lasts (founder
        # directive 2026-07-28: "it should stop working after the trial
        # period"). Free runtimes/features stay allowed either way via the
        # membership checks below.
        if self.grace and not self.expired:
            return True
        return self.entitled_runtime(runtime)

    def entitled_runtime(self, runtime: str) -> bool:
        rt = (runtime or "").lower()
        if rt in FREE_RUNTIMES:
            return True
        if self.expired:
            return False
        return rt in self.runtimes
```

</details>

**依据 5 · 源码核查**：[clawmetry/telemetry.py:90-105](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/telemetry.py#L90-L105)

telemetry opt-out条件。

<details>
<summary>查看原文（16行）</summary>

```text
def _is_optout() -> bool:
    """Honour both the env var and the file marker. Either disables.

    DO_NOT_TRACK is the W3C-style cross-tool convention; we honour it
    out of respect even though it's not a perfect fit for OSS install
    counters.
    """
    if os.environ.get("CLAWMETRY_NO_TELEMETRY", "").strip() not in ("", "0", "false", "False"):
        return True
    if os.environ.get("DO_NOT_TRACK", "").strip() not in ("", "0", "false", "False"):
        return True
    if OPTOUT_MARKER.exists():
        return True
    return False


```

</details>

**依据 6 · 源码核查**：[clawmetry/telemetry.py:155-176](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/telemetry.py#L155-L176)

默认payload实际字段。

<details>
<summary>查看原文（22行）</summary>

```text
def _build_payload(version: str, event: str = "install", extra: dict | None = None) -> dict:
    """Assemble the JSON body. Pure function — no I/O — so tests can
    stub the small helpers and assert the shape independently."""
    is_ci, ci_provider = _detect_ci()
    payload = {
        "install_id":  _ensure_install_id() or "",
        "event":       event,
        "version":     version,
        "os":          platform.system() or "unknown",
        "os_version":  platform.release() or "",
        "python":      platform.python_version(),
        "agent":       _detect_agent(),
        "is_ci":       is_ci,
        "ci_provider": ci_provider,
    }
    if extra:
        payload.update(extra)
    return payload


_SSL_CTX = None

```

</details>

**依据 7 · 源码核查**：[clawmetry/telemetry.py:320-343](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/telemetry.py#L320-L343)

默认telemetry URL抑制与异常拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
    """Telemetry URL to post to, or "" when pings must not fire.

    A custom endpoint (self-hosted / enterprise, see clawmetry.endpoints)
    means data stays inside the deployment: skip the managed-cloud install
    pings entirely unless CLAWMETRY_TELEMETRY_URL is explicitly set."""
    url = os.environ.get("CLAWMETRY_TELEMETRY_URL", "")
    if url:
        return url
    try:
        # egress_suppressed(), not is_custom_endpoint(): a self-hosted SERVER
        # container does not necessarily set CLAWMETRY_ENDPOINT, because it IS
        # the endpoint. Keying only off the endpoint left that process pinging
        # the managed cloud on startup even with SELF_HOSTED=true. Also covers
        # CLAWMETRY_OFFLINE (air-gapped), where the call can only ever hang.
        from clawmetry.endpoints import egress_suppressed
        if egress_suppressed():
            return ""
    except Exception:
        # Fail closed. A missing or older endpoints module must not result in
        # an unexpected phone-home from a customer's network.
        return ""
    return TELEMETRY_URL_DEFAULT


```

</details>

**依据 8 · 源码核查**：[clawmetry/endpoints.py:109-132](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/endpoints.py#L109-L132)

discretionary suppression范围及开关。

<details>
<summary>查看原文（24行）</summary>

```text
def egress_suppressed() -> bool:
    """True when this install must not make discretionary outbound calls.

    "Discretionary" means anything that is not the deployment's own configured
    ingest endpoint: install telemetry, anonymous funnel analytics, public-IP
    lookup, update checks. The deliberate, configured push to a self-hosted
    ingest URL is unaffected — that traffic is the product.

    True when ANY of these hold:

    * ``is_custom_endpoint()`` — traffic is repointed at a customer-run server.
    * ``SELF_HOSTED`` / ``CLAWMETRY_SELF_HOSTED`` — this process IS the
      customer's server. Checked separately because a self-hosted server
      container does not necessarily set ``CLAWMETRY_ENDPOINT`` (it *is* the
      endpoint), so keying only off the endpoint left the server itself
      phoning home.
    * ``CLAWMETRY_OFFLINE`` — explicit air-gapped operation.

    Callers must treat this as binding: check before the call and degrade
    quietly rather than erroring. Every destination governed by this function
    is listed in docs/EGRESS.md.
    """
    if _env("CLAWMETRY_OFFLINE").lower() in _TRUTHY:
        return True
```

</details>

**依据 9 · 作者声明**：[docs/EGRESS.md:27-58](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/docs/EGRESS.md#L27-L58)

作者默认/可选网络边界。

<details>
<summary>查看原文（32行）</summary>

````text
```

---

## The short version

| Deployment | Contacts ClawMetry servers? | Contacts any third party? |
|---|---|---|
| **Self-hosted** (`SELF_HOSTED=true`) | No | No |
| **Air-gapped** (`CLAWMETRY_OFFLINE=1`) | No | No |
| **Local only / cloud sync off** (no `clawmetry connect`, `clawmetry onboard --local`, or `CLAWMETRY_NO_CLOUD=1`) | One install ping, plus a field-failure report if the daemon stops working | PyPI version check |
| **Managed cloud** (`clawmetry connect`) | Yes: sealed content plus plaintext metadata (table below) | PyPI version check |
| **Hosted ingest push** (a ClawMetry Cloud ingest key, OTLP/JSON) | Yes: the pushed telemetry, which is **not sealed** and is readable by ClawMetry, because the sender holds no encryption key | None added |

**Data-boundary contract version: 1** (2026-09-14). Cloud sync off is **not offline**: it stops uploads and nothing else. `DO_NOT_TRACK=1` stops the install ping and the failure report but not the PyPI check; `CLAWMETRY_OFFLINE=1` stops every discretionary request. Public pages that describe these modes must agree with this table; `tests/test_data_boundary_contract.py` pins the behaviour it describes.

No ClawMetry deployment loads a CDN, font, analytics script, error tracker or
tracking pixel. Web assets are vendored into the package and served from the
local process; CI fails on any absolute `http(s)` asset reference in a served
page.

Other optional features can contact a **model provider** with your own API key.
Two are **off** until you turn them on: transcript quality scoring
(`CLAWMETRY_EVALS_ENABLED=1`) and the Claude rate-limit probe
(`CLAWMETRY_CLAUDE_LIMIT_PROBE=1`). One is on when an `ANTHROPIC_API_KEY` is
present: the alert narrator, which sends the alert's own one-line message and
rule id, never session content (`CLAWMETRY_NARRATOR_ENABLED=0` to stop it).

Destinations belonging to *your* agents (`api.anthropic.com`, `api.openai.com`
and similar) also appear as strings used to attribute costs and parse pricing.
Outside the optional inference features described here, ClawMetry observes
those calls rather than making them.
````

</details>

**依据 10 · 作者声明**：[docs/EGRESS.md:68-90](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/docs/EGRESS.md#L68-L90)

Assistant推理不是密封同步。

<details>
<summary>查看原文（23行）</summary>

```text

Sending a question in Assistant explicitly invokes the selected AI connection.
The planner receives the question, recent conversation and table/column schema.
The answer step also receives bounded, credential-scrubbed query-result previews.
Raw event payloads, raw memory bodies and file reads are excluded from its SQL
surface. The page discloses this inference boundary before sending. Conversations
and saved panel definitions remain in local DuckDB.

The supported connections are the installed Claude CLI (which contacts its
configured Anthropic service with tools and project customization disabled), a
request-scoped Anthropic API key (`api.anthropic.com/v1/messages`), and an optional
authenticated Builder connection (`build.clawmetry.com/api/assistant/*`).
Builder availability and balance checks require a configured account key; no
anonymous balance or credit grant is assumed. Starting checkout requires an
explicit top-up action. The API key typed into the dashboard is never persisted.
Offline and self-hosted suppression also disable this external inference path.

These are user-requested inference calls, separate from encrypted cloud sync.
Do not interpret the Assistant's data notice as a claim that an AI provider
cannot read the prompt or the selected query results it processes.

---

```

</details>

#### 缺口

- 未核闭源授权包、当前价格、全部网络/密码链及卸载恢复。
  **影响**：无法推荐DSH生产接入或把本地默认/密封主张当全面隐私验收。
  **进一步探讨**：在授权无敏感环境核DSH样本/到期/全部出口/停止与卸hook；复核索引/云留存和总成本后再考虑采用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把观测面转为可证伪的诊断增量？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可复用设计是按runtime声明capability、统一事件接口并保留unknown，不把没有数据的运行时填成同一全面看板。registry单适配失败隔离有助继续观察其他runtime；但observer信号与动作结果、估算成本与账单之间仍需可见的证据边界。复杂度和目录适配数不计创新。

未验证方向为每个诊断结论携带“覆盖与反证卡”：列原始事件锚点、哪些源未读/被跳过、字段缺失、风险信号是否仅启发式，以及能否执行前阻断。相对已有capability与兼容表的增量是把证据缺口绑定到具体结论而非通用文档；代价是数据血缘、隐私与UI负担。它不能替代闭源DSHreader审查。

最小验证用同一批合法无敏感轨迹，包含正常长任务、循环失败、坏文件、未知成本与已发生危险动作，对照现看板和覆盖卡。测操作者把缺数当零、长运行当卡住和观察当阻断的误判，以及诊断耗时；不下降或更多噪声则收窄/放弃。本次未实现，未来功能不计当前贡献，也不宣称已有生产需求。

#### 证据与依据

**依据 1 · 源码核查**：[clawmetry/adapters/base.py:101-145](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/base.py#L101-L145)

未知成本和phase已有契约。

<details>
<summary>查看原文（45行）</summary>

```text

    ``agent`` identifies which adapter produced this row. ``id`` is the
    native session identifier (UUID, timestamp-hash, etc.) — opaque to
    the platform. Token breakdown fields default to 0 for adapters that
    do not compute them; ``cost_usd=None`` means "unknown / not tracked".
    """

    agent: str
    id: str
    display_name: str = ""
    title: str = ""
    model: str = ""
    source: str = ""
    started_at: float = 0.0
    ended_at: float | None = None
    parent_id: str | None = None
    message_count: int = 0
    total_tokens: int = 0
    input_tokens: int = 0
    output_tokens: int = 0
    cache_read_tokens: int = 0
    cache_write_tokens: int = 0
    reasoning_tokens: int = 0
    cost_usd: float | None = None
    cost_status: str = ""
    # Why the session ended, in the RUNTIME's own words where it has any
    # (``user_stopped``, ``max_turns``, ``turn_aborted:interrupted``). Where a
    # runtime states none, ``resolve_phase`` fills one of the shared reasons in
    # ``clawmetry.adapters.phase.END_REASONS``; an adapter's own account of
    # what happened is never overwritten.
    end_reason: str = ""
    # Working directory the session ran in ("" when the runtime hides it).
    # First-class because kill/pause pid resolution keys on it
    # (process_control.resolve_by_cwd); adapters should ALSO mirror it into
    # extra["cwd"] while older OSS wheels without this field are in the
    # fleet (a pro adapter passing cwd= against an old wheel would crash).
    cwd: str = ""

    # ── Phase model (see clawmetry/adapters/phase.py) ─────────────────────
    # An adapter that can see its runtime's state sets ``phase`` (and
    # ``status`` where it can see more) directly. One that cannot leaves both
    # empty and ``resolve_phase`` derives what it can from the timestamps.
    # ``None`` after resolution means the observed data could not establish a
    # phase. That is an answer, and it is deliberately not ``idle``.
    phase: str | None = None
```

</details>

**依据 2 · 源码核查**：[clawmetry/adapters/qwen_code.py:1024-1044](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/adapters/qwen_code.py#L1024-L1044)

坏会话跳过产生结论覆盖问题。

<details>
<summary>查看原文（21行）</summary>

```text
    def list_sessions(self, limit: int = 100) -> list[Session]:
        """Return recent sessions, newest first. Never raises on a bad file."""
        files = self._session_files()
        if not files:
            return []

        # Read settings.json once (global to the Qwen home) and stamp the
        # active-provider / telemetry-target summary onto every session.
        settings_extra = _settings_extra()

        sessions: list[Session] = []
        for path in files:
            session_id = os.path.basename(path)[:-6]  # strip ".jsonl"
            try:
                sess = _session_from_file(path, session_id, settings_extra)
            except Exception as exc:
                # Never let one bad session sink the whole list.
                logger.warning("QwenCodeAdapter: skipping bad session %s: %s", path, exc)
                continue
            if sess is not None:
                sessions.append(sess)
```

</details>

**依据 3 · 源码核查**：[clawmetry/approvals.py:95-104](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/approvals.py#L95-L104)

观察与预执行边界。

<details>
<summary>查看原文（10行）</summary>

```text
# runtime-native mechanism that pauses a tool call BEFORE it runs (OpenClaw's
# `exec-policy preset cautious`, Claude Code's PreToolUse hook, …) — the
# reactive watcher below can only detect-and-kill AFTER the fact.
#
# Each handler is ``fn(want_gate: bool, policies: list[dict]) -> None`` and
# MUST be:
#   * idempotent — the watcher calls it every ~2 s with the current posture;
#   * conservative — only undo what IT installed (state-file pattern, see
#     _EXEC_POLICY_STATE / claude_code_gate._STATE_PATH), never clobbering a
#     posture or hook the operator set by hand.
```

</details>

**依据 4 · 源码核查**：[clawmetry/providers_pricing.py:690-696](https://github.com/vivekchand/clawmetry/blob/46d18ffe35c361bb40b35782fd53db699636321f/clawmetry/providers_pricing.py#L690-L696)

估算异常零需要证据说明。

```text
                if prices[2] is not None:
                    cost += cached / 1_000_000 * (prices[2] - input_rate)
                if prices[3] is not None:
                    cost += written / 1_000_000 * (prices[3] - input_rate)
        return round(cost, 8)
    except Exception:
        return 0.0
```

#### 缺口

- 结论级覆盖卡是否降低误判和净诊断成本未知。
  **影响**：不能称为已经实现的准确性改善或已验证机会。
  **进一步探讨**：预设误判/耗时/隐私阈值，同轨迹盲测；无收益停止。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
