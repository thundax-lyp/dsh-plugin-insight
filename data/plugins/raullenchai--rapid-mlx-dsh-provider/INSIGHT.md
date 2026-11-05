# Rapid-MLX DSH Provider

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[88f98e7](https://github.com/raullenchai/rapid-mlx-dsh-provider/tree/88f98e7835989c3a05813e475ada4ce0b3c94267)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/raullenchai/rapid-mlx-dsh-provider) [![npm 30d 100](https://img.shields.io/static/v1?label=npm+30d&message=100&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@raullenchai/dsh-provider) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@raullenchai/dsh-provider)
<!-- END META -->

> **功能**：为 DSH 接入本地 Rapid-MLX，读取模型容量与推理信息，并提供模型缓存管理工具。

> **亮点**：[Q01](#research-q01) 表明，已有贡献是把容量取值优先级显式绑定服务端 max_model_len/context_window，并在缺失时保留未知；[Q03](#research-q03) 表明，HTTP事实与CLI磁盘操作被组织进同一宿主入口。相较手写配置与终端切换，这是可解释的集成增量，不是新推理算法，也尚无同条件节时或压缩正确性结果。

> **主要限制**：[Q02](#research-q02) 的工具流只有单个累加器，未按工具index分流，交错续片可能归错；[Q03](#research-q03) 的元数据去重与缓存回退会丢失身份或失败信息。核心质疑是自动展示是否足以让用户识别真实模型和完整结果。静态路径已可说明触发条件，但发生频率及真实服务序列未知，故不能把这些机制写成可靠控制面。

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
  - [Q01 · 服务端模型事实如何进入 DSH，较手写通用路由具体增加什么？](#detail-section-11)
  - [Q02 · 请求和流式响应转换保留哪些语义，哪里会失真？](#detail-section-12)
  - [Q03 · 五项管理工具怎样执行，失败和状态判断有哪些限制？](#detail-section-13)
  - [Q04 · 接入、持续使用和退出要承担什么成本，现有结果证明到哪里？](#detail-section-14)
  - [Q05 · 能由已查限制推出什么可证伪设计，当前应如何选择？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向维护 Apple Silicon 本地模型服务、经常切换模型及长会话的 DSH 开发者，提供模型事实发现和会话内缓存管理。合格结果包括选中模型容量正确、请求语义完整、管理失败可辨；仅能发起聊天并不足够。实际需求频率与用户收益尚无独立记录，详见 [Q01](#research-q01) 和 [Q04](#research-q04)。

对比基线是作者列出的通用 openai-completions 路由配合手写容量与命令行管理。该上游路由源码本次未检查，因此只比较本组件可见的自动发现、字段映射及管理入口，不宣称通用路由没有任何模型发现能力，也不作性能排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| rapid-mlx 适配器 | DSH 文本生成与模型事实查询 | 服务端开放兼容API；图像拒绝，多工具交错需补证 |
| rapid_mlx_serving | 查看服务模型及事实 | HTTP可达；同事实模型可能被合并 |
| rapid_mlx_cached | 查看本地模型缓存 | CLI可执行；文本回退可能混淆失败与空缓存 |
| rapid_mlx_pull | 下载模型到缓存 | 宿主子进程可用；无固定截止，取消后须核对状态 |
| rapid_mlx_remove | 删除缓存模型 | CLI支持rm -y；无插件内二次确认，删除不自动恢复 |
| rapid_mlx_health | 分别探测API与CLI | 健康不等于实际生成或管理操作可用 |
| rapid-mlx 命令 | 汇总健康、服务模型和缓存 | 必须阅读正文状态，命令success不代表各项健康 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH与Cordis服务 | 启动必需 | 提供llm/tools/commands/subprocess；包声明rc.8系列 | 不能据声明保证其他宿主版本兼容 |
| Node至少22.15 | 作者声明启动条件 | README指向宿主Zstd接口要求 | 本次未核验各Node版本运行 |
| 本地Rapid-MLX及可用模型资源 | 生成与事实读取必需 | 提供/models和/chat/completions | 发现返回未知，生成报传输或HTTP错误 |
| rapid-mlx CLI | 缓存/下载/删除必需 | 通过PATH或绝对路径定位 | HTTP仍可能可用，CLI管理失败 |
| 独占rapid-mlx路由配置 | 使用时必需 | 避免与已有通用供应商同名争用 | 用户须去除重复路由或选择原供应商 |
| 模型下载来源与磁盘空间 | 下载时必需 | 取得模型缓存 | 失败/取消后须重新查询缓存，费用和时间未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认本地服务、宿主包和独占路由，安装profile层 | 只在隔离配置核对加载，不用健康代替任务验收 |
| 读取 | 适配器获取模型事实，用户核对原始模型id与容量 | 与服务器不符时退回明确手写配置 |
| 执行 | DSH发送文本和顺序工具请求；管理工具调用HTTP或CLI | 核对完整结果；并行工具、图像不作为当前可靠路径 |
| 恢复与退出 | 用户检查缓存实际状态，将agent provider切回原路由并停用bundle | 停用不回滚下载/删除；需要时从原来源恢复模型 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地机器、模型内存/磁盘及下载资源；金额未知 | 安装profile、CLI路径和路由配置、字段核对；耗时未知 | 已有服务者无需由插件新建服务，但不能推为零成本 |
| 持续使用 | 推理计算、缓存空间、服务运维；单位成本未知 | 模型切换核对、宿主/服务接口适配；频率未知 | 自动读字段不能保证任务质量或压缩收益 |
| 失败恢复 | 下载残留、重新下载和重跑任务消耗；量未知 | 区分空缓存与失败、核对工具结果、恢复被删模型 | 无插件内状态回滚，取消后结果须核对 |
| 退出 | 保留或清理现有模型资源；金额未知 | 切回原provider并停用bundle | 已删除缓存不会随停用自动恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型配置 | 源码优先读取服务端容量及推理parser | 服务端数值准确性和宿主压缩实际效果 |
| 会话内管理 | 五项工具与概览命令已接线 | 真实CLI兼容、误合并频率和恢复工时 |
| 工具生成 | 系统提示、工具关联与usage顺序有显式映射 | 多工具交错和截短流的任务正确性 |
| 任务收益 | 作者报告rc.7/M3 Ultra一次36秒修复任务 | 本次未复现，无同条件合格率、节时或ROI证据 |

> **思考**：[Q02](#research-q02) 的工具流只有单个累加器，未按工具index分流，交错续片可能归错；[Q03](#research-q03) 的元数据去重与缓存回退会丢失身份或失败信息。核心质疑是自动展示是否足以让用户识别真实模型和完整结果。静态路径已可说明触发条件，但发生频率及真实服务序列未知，故不能把这些机制写成可靠控制面。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 表明，已有贡献是把容量取值优先级显式绑定服务端 max_model_len/context_window，并在缺失时保留未知；[Q03](#research-q03) 表明，HTTP事实与CLI磁盘操作被组织进同一宿主入口。相较手写配置与终端切换，这是可解释的集成增量，不是新推理算法，也尚无同条件节时或压缩正确性结果。

纯请求转换与宿主适配分层，错误码、图像拒绝、usage缓冲和HTTP/CLI独立健康信号便于审阅，可借鉴到其他供应商适配器；移植仍须覆盖宿主字段与内容块契约。[Q02](#research-q02) 的单工具状态及流尾处理、[Q03](#research-q03) 的指纹去重和错误通道是具体可靠性缺口，不能用模块分层或测试文件存在抵消。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的工具流只有单个累加器，未按工具index分流，交错续片可能归错；[Q03](#research-q03) 的元数据去重与缓存回退会丢失身份或失败信息。核心质疑是自动展示是否足以让用户识别真实模型和完整结果。静态路径已可说明触发条件，但发生频率及真实服务序列未知，故不能把这些机制写成可靠控制面。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。[Q02](#research-q02) 和 [Q03](#research-q03) 的状态边界直接影响工具任务与管理结果，先核对这些异常序列，再在隔离profile选择单一文本任务研究模型容量发现。发现模型id混淆、缓存查询失败被当空或工具参数异常时停止，并切回原通用provider；删除缓存前人工核对具体名称和重新取得来源。不得由源码检查升级为持续安装建议。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持服务端容量发现、纯请求映射与宿主管理接线；作者端到端记录未作为本次运行证据。交错流与管理状态边界限制采用，改进方向仅是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/request.js、lib/tools.js、lib/cli.js、lib/management.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交的README、package及五个生产JS模块，另抽读patch和部分测试源码以理解入口与覆盖线索；统计使用完整组件INVENTORY，源码论证范围按上述文件说明。没有检查Rapid-MLX服务端或DSH上游通用路由实现。
- 下一步：本次仅源码检查，未安装、未运行目标代码、未执行其测试或真实宿主验收。作者README的验证与CI徽章不作为本次执行结果；未来实验为建议而非已安排任务。

**分析版本**

- **仓库**：[raullenchai/rapid-mlx-dsh-provider](https://github.com/raullenchai/rapid-mlx-dsh-provider)
- **版本号**：0.3.0（[固定提交 88f98e7](https://github.com/raullenchai/rapid-mlx-dsh-provider/tree/88f98e7835989c3a05813e475ada4ce0b3c94267)）
- **版本日期**：2026-08-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出未验证假设：保留模型身份、工具流index和命令/解析结果状态，可能比依靠相同元数据与空数组降低误判。最小验证覆盖同事实不同模型、缓存双重失败、工具交错及缺尾帧；以身份与参数无损、空/失败区分、异常不报明确成功为判据。新增状态维护负担必须同时观察，若仍误合并或产生不可解释未知则推翻其充分性。

本次仅源码检查，未安装、未运行目标代码、未执行其测试或真实宿主验收。作者README的验证与CI徽章不作为本次执行结果；未来实验为建议而非已安排任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 42 | 27 | 16 | — |
| .js | source | 5 | 1090 | 722 | 300 | — |
| .md | source | 1 | 225 | — | — | 1623 |
| .js | test | 4 | 819 | 658 | 98 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/raullenchai/rapid-mlx-dsh-provider/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/raullenchai/rapid-mlx-dsh-provider/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/raullenchai/rapid-mlx-dsh-provider/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对已运行 Rapid-MLX 的 DSH 用户，自动读取模型事实及会话内模型管理能否带来可解释的增量，哪些协议与状态边界限制试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 服务端模型事实如何进入 DSH，较手写通用路由具体增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向已有 Apple Silicon 本地 Rapid-MLX 服务、会在多个模型间切换并运行长会话的 DSH 用户，本组件把容量与推理能力的配置来源从用户手写值移到服务端模型列表。合格结果应是当前所选模型的容量和可用推理档位与服务端事实一致，而非仅能发送聊天请求。README 将通用 openai-completions 路由列为原办法；本次没有检查该上游路由实现，所以“通用路由会丢弃全部扩展字段”仍属于作者对比声明。可直接确认的增量是本组件 apply 注册 rapid-mlx 适配器，resolveModel 请求 /models，优先取正整数 max_model_len，其次取 context_window，均缺失时不制造容量值；reasoning_parser 为非空字符串才提供四档推理选项。多模型时按 id 精确匹配，只有一条记录才容许以该条作为回退。

这把模型配置的维护责任部分转移给服务端，但不等于已经证明压缩时机更准确。DSH 的压缩插件如何消费该容量，以及服务端内存适配值是否可信，本次未在它们的源码或运行环境核实。README 前部已说明 max_model_len，后部“尚未完成”仍称只返回 advertised context，存在同版本文档矛盾；就当前实现应以实际优先级为准，不能把旧待办当成能力缺失。场景需求来自作者流程说明而非独立用户调查，收益仅可表述为配置机制增量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-58](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/README.md#L21-L58)

作者给出手写通用路由配置与容量选择的比较场景，支撑目标任务，不能独立证明节时或压缩效果。

<details>
<summary>查看原文（38行）</summary>

````text
DSH can already talk to a local Rapid-MLX server through its generic
`openai-completions` provider. That route works — but it knows nothing about
your model beyond what you hand-wrote:

```yaml
# what the generic route makes you maintain, by hand, per model
llm-pi-ai:
  providers:
    rapid-mlx:
      baseURL: http://localhost:8000/v1
      defaultContextWindow: 262144      # you looked this up. is it still right?
      models:
        - id: qwen3.6-35b-8bit
          contextWindow: 262144
          reasoningEfforts: {off: none, low: low, medium: medium, high: high}
```

Rapid-MLX's `/v1/models` already publishes all of that and more. This adapter
reads it, so:

**1. Nothing to hand-write, and nothing to re-write when you switch models.**
Swap what `rapid-mlx serve` is running and `dsh` follows. No re-running setup,
no stale numbers.

**2. The reasoning control tells the truth.** Rapid-MLX reports whether a model
actually has a reasoning parser. A model that can't reason no longer shows an
off/low/medium/high selector that does nothing.

**3. Compaction is timed with the capacity that actually fits this Mac, not a
number that drifted.** This is the one that quietly costs you.
`dsh-compaction-basic` asks the provider for the route's capacity and compacts
at `thresholdRatio × capacity` (0.8 by default). The provider prefers the
server's **`max_model_len`** — Rapid-MLX's memory-fitted ceiling (what fits in
unified memory: weights + KV cache), in the vLLM/SGLang-standard field — over
the native `context_window`, and falls back to `context_window` on an older
server that doesn't report it. So compaction is timed to what the machine can
actually hold, not the model's advertised window (which it may not have room
for) and not a hand-written number copied from another model.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:94-111](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L94-L111)

模型发现失败返回空数组，多模型优先精确id，单记录才回退。

<details>
<summary>查看原文（18行）</summary>

```text
  /** GET /v1/models, or [] — never throw a discovery failure at the loop. */
  async #entries(signal) {
    try {
      const res = await fetch(`${this.#baseURL}/models`, { signal })
      if (!res.ok) return []
      const body = await res.json()
      return Array.isArray(body?.data) ? body.data.filter((e) => e && typeof e === 'object') : []
    } catch {
      return []
    }
  }

  #find(entries, model) {
    // Exact match only when several models are served: describing some
    // OTHER model's capacity is worse than admitting we do not know.
    const exact = entries.find((e) => e.id === model)
    if (exact) return exact
    return entries.length === 1 ? entries[0] : undefined
```

</details>

**依据 3 · 源码核查**：[lib/index.js:136-171](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L136-L171)

容量优先max_model_len，缺失才使用context_window；推理档位仅根据非空parser声明。

<details>
<summary>查看原文（36行）</summary>

```text
  async resolveModel(provider, model, signal) {
    const entry = this.#find(await this.#entries(signal), model)
    const info = { provider, id: model, name: model }
    if (!entry) return info

    // Prefer `max_model_len` — the server's MEMORY-FITTED ceiling (what
    // actually fits on this Mac's unified memory, weights + KV cache) — over
    // the native `context_window`. `dsh-compaction-basic` multiplies whatever
    // we return by its threshold ratio, so timing it to the memory-fit is the
    // whole point: a native window the machine can't hold would compact too
    // late. An older server sends only `context_window`; the fallback keeps
    // those working, and a server that answers neither leaves context unknown
    // (never fabricated). See rapid-mlx's max_model_len (vLLM/SGLang-style).
    const memFit = entry.max_model_len
    const native = entry.context_window
    const capacity =
      Number.isInteger(memFit) && memFit > 0
        ? memFit
        : Number.isInteger(native) && native > 0
          ? native
          : undefined
    if (capacity !== undefined) {
      info.context = { contextWindow: capacity }
    }

    // Reasoning is advertised only when the runtime actually bound a
    // reasoning parser for this model. `reasoning_parser: null` is a
    // definite no; a MISSING key means an older server that cannot
    // answer, which must not be read as either yes or no.
    if ('reasoning_parser' in entry) {
      const parser = entry.reasoning_parser
      if (typeof parser === 'string' && parser.trim()) {
        info.reasoning = { efforts: EFFORTS.map(({ id, name }) => ({ id, name })) }
      }
    }
    return info
```

</details>

**依据 4 · 源码核查**：[lib/index.js:345-359](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L345-L359)

apply实际注册rapid-mlx适配器并挂载管理工具。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx, config) {
  const baseURL = String(config?.baseURL || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const cliCommand = config?.cliCommand || 'rapid-mlx'

  const adapter = new RapidMlxAdapter(config, ctx.logger)
  ctx.llm.registerAdapter([PROVIDER], adapter)

  // Management tools + `/rapid-mlx` overview. Lazily-bound fetch so a test can
  // stub globalThis.fetch before the first call.
  registerManagement(ctx, {
    baseURL,
    cliCommand,
    subprocess: ctx.subprocess,
    fetchImpl: (input, init) => globalThis.fetch(input, init),
  })
```

</details>

**依据 5 · 作者声明**：[README.md:126-144](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/README.md#L126-L144)

旧待办对容量的描述与已实现优先级不一致，图像和路由冲突限制仍须分别核对。

<details>
<summary>查看原文（19行）</summary>

```text
## Not done yet

Being explicit, because the point of the adapter is to *use* what the server
says and some of it is still only read:

- `recommended_sampling` — should be applied automatically per model.
- `tool_call_parser` — should let `dsh` fail fast on a model that cannot emit
  `tool_calls`, instead of looping.
- `is_hybrid` / `is_moe` / `capabilities` — read, not yet acted on.
- **Memory-aware capacity.** Today `resolveModel()` reports the model's
  *advertised* context window. On a Mac the real ceiling is unified memory, and
  reporting that instead is the biggest remaining win — it needs Rapid-MLX to
  expose a usable-capacity figure first.
- Images are not carried through `stream()` — but they now **refuse** with
  `LlmError(..., 'UNSUPPORTED')` rather than being dropped, per the cookbook.
  Text, reasoning and tool calls are carried.
- The route is registered as `rapid-mlx`. If your `settings.yaml` also declares
  a `rapid-mlx` provider under `llm-pi-ai`, the two compete for one route name
  (`registerAdapter` owns provider exclusivity). Use one or rename ours.
```

</details>

#### 缺口

- 服务端容量是否适合实际内存、宿主压缩是否按该值生效，尚无本次直接结果。
  **影响**：自动读值不等于长会话不会内存溢出或压缩更合适，限制效果判断。
  **进一步探讨**：在相同模型和任务下记录服务端字段、宿主实际阈值、压缩次数及内存峰值，并与手写路由对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求和流式响应转换保留哪些语义，哪里会失真？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

请求转换显式前置 system 消息，将 DSH 工具结果映射为带 tool_call_id 的 OpenAI tool 消息，将 assistant 工具调用保留为 tool_calls；推理片段不回传，图像块直接抛出 UNSUPPORTED，而非静默转成空文本。temperature=0 通过类型判断保留。流式回复按 reasoning_content、content 和 tool_calls 产生内容块，缓存 usage 以保证先于 finish，HTTP失败映射为明确错误码，完全空响应抛 EMPTY_RESPONSE。这些是实现可见的语义保护，不是本次协议测试结果。

最关键的边界是多工具交错。stream 只有一个 call 累加器，以新出现的不同 id 关闭旧块，却没有读取 tool_calls 的 index。若一个响应先收到 index0/idA、index1/idB，再收到不带 id 的 index0 参数续片，当前累加器已经是 B，该续片会被拼到 B。此结论来自控制流推演，未执行复现；不能据此断言当前 Rapid-MLX 服务一定产生这种序列，但不能把实现称为任意并行工具流无损转换。

另有流结束边界：SSE读取器仅处理以换行结束的 data 行，未冲刷最后 buffer；只要已产生过内容，连接正常迭代结束而无 DONE/finish_reason 时仍会以默认 stop 完成。它并未验证“供应商明确正常结束”，故截短响应可能需要上层或人工识别。本组件优先适用于文本及顺序工具路径，视觉和依赖多工具交错的工作流应等待补证或使用原通用路由。

#### 证据与依据

**依据 1 · 源码核查**：[lib/request.js:62-85](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/request.js#L62-L85)

系统提示前置、温度0保留及输出字段映射可见。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildRequestBody(options) {
  const messages = toOpenAiMessages(options.messages)
  // DSH carries the system prompt OUTSIDE the message list (`system?:
  // string`, "adapters map to the provider's system slot"). Dropping it
  // costs the model its persona, working directory and agent
  // instructions — and nothing errors when you do.
  if (typeof options.system === 'string' && options.system) {
    messages.unshift({ role: 'system', content: options.system })
  }
  const effort = reasoningWire(options.reasoningEffort)
  return {
    model: options.model,
    messages,
    ...(options.tools?.length ? { tools: toOpenAiTools(options.tools) } : {}),
    // `typeof`, not truthiness: temperature 0 is a meaningful request for
    // greedy decoding and must not be dropped as falsy.
    ...(typeof options.temperature === 'number'
      ? { temperature: options.temperature }
      : {}),
    ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
    ...(options.stop?.length ? { stop: options.stop } : {}),
    ...(effort ? { reasoning_effort: effort } : {}),
    stream: true,
    stream_options: { include_usage: true },
```

</details>

**依据 2 · 源码核查**：[lib/request.js:132-144](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/request.js#L132-L144)

图像明确拒绝而非丢弃。

<details>
<summary>查看原文（13行）</summary>

```text
function blocksToText(blocks) {
  const out = []
  for (const b of blocks ?? []) {
    if (b?.type === 'text') out.push(b.text)
    else if (b?.type === 'image') {
      throw new UnsupportedContentError(
        'rapid-mlx provider cannot send image content yet; use the generic ' +
          'openai-completions provider for a vision model',
      )
    }
    // reasoning / tool-call / tool-result are handled by the caller.
  }
  return out.join('')
```

</details>

**依据 3 · 源码核查**：[lib/request.js:163-203](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/request.js#L163-L203)

工具结果和调用分别转换，callId关联得以保留。

<details>
<summary>查看原文（41行）</summary>

```text
export function toOpenAiMessages(messages) {
  const out = []
  for (const m of messages ?? []) {
    if (typeof m.content === 'string') {
      out.push({ role: m.role, content: m.content })
      continue
    }
    const blocks = m.content ?? []

    // Tool results: one OpenAI `tool` message per result block.
    const results = blocks.filter((b) => b?.type === 'tool-result')
    if (results.length) {
      for (const r of results) {
        out.push({
          role: 'tool',
          tool_call_id: r.toolCallId ?? m.source?.callId,
          content: blocksToText(r.content) || (r.isError ? 'error' : ''),
        })
      }
      continue
    }

    // Assistant turns that issued calls must carry them as `tool_calls`,
    // or the following tool message has nothing to correlate against.
    const calls = blocks.filter((b) => b?.type === 'tool-call')
    if (m.role === 'assistant' && calls.length) {
      out.push({
        role: 'assistant',
        content: blocksToText(blocks) || null,
        tool_calls: calls.map((c) => ({
          id: c.id,
          type: 'function',
          function: { name: c.name, arguments: c.arguments ?? '{}' },
        })),
      })
      continue
    }

    out.push({ role: m.role, content: blocksToText(blocks) })
  }
  return out
```

</details>

**依据 4 · 源码核查**：[lib/index.js:220-254](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L220-L254)

全流仅有单个call对象和当前open块。

<details>
<summary>查看原文（35行）</summary>

```text
    let index = -1
    let open = null // 'text' | 'reasoning' | 'tool-call'
    let text = ''
    // A tool call arrives as deltas; `block-end` has to hand back the
    // ASSEMBLED ToolCallBlock (id + name + raw argument JSON). Emitting a
    // bare {type:'tool-call'} makes the session log fail to serialize with
    // `session event "tool/call" carries non-JSON-serializable data`, which
    // names the symptom and not the cause — so accumulate it here.
    let call = null
    let finish = 'stop'
    let usage = null
    // Tracks whether the response produced ANY content block. A stop with
    // zero output is a degenerate completion; the contract has a canonical
    // code for it precisely because yielding an empty assistant message
    // ends the turn with nothing for the user or the loop to act on.
    let produced = false

    const openBlock = function* (blockType) {
      index += 1
      open = blockType
      text = ''
      call = blockType === 'tool-call' ? { id: '', name: '', arguments: '' } : null
      produced = true
      yield { type: 'block-start', index, blockType }
    }
    const closeBlock = function* () {
      if (open === null) return
      const block =
        open === 'tool-call'
          ? { type: 'tool-call', id: call.id, name: call.name, arguments: call.arguments }
          : { type: open, text }
      yield { type: 'block-end', index, block }
      open = null
      call = null
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:299-329](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L299-L329)

按不同id切换工具块，未依据tc.index保存多路状态，支持交错续片归错的静态推演。

<details>
<summary>查看原文（31行）</summary>

```text
      for (const tc of delta.tool_calls ?? []) {
        // A NEW id mid-stream means a second call in the same response;
        // close the previous block so each one ends up its own tool-call
        // block rather than two calls' arguments concatenated into one.
        if (open === 'tool-call' && tc.id && call.id && tc.id !== call.id) {
          yield* closeBlock()
        }
        if (open !== 'tool-call') {
          yield* closeBlock()
          yield* openBlock('tool-call')
        }
        if (tc.id) call.id = tc.id
        if (tc.function?.name) call.name = tc.function.name
        const argsDelta = tc.function?.arguments ?? ''
        call.arguments += argsDelta
        yield {
          type: 'tool-call-delta',
          index,
          id: call.id || `call_${index}`,
          ...(tc.function?.name ? { name: tc.function.name } : {}),
          argumentsDelta: argsDelta,
        }
      }
      if (choice.finish_reason) {
        finish =
          choice.finish_reason === 'tool_calls'
            ? 'tool-calls'
            : choice.finish_reason === 'length'
              ? 'max-tokens'
              : 'stop'
      }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:331-341](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L331-L341)

产生内容后无论是否见明确结束帧均输出finish，默认原因来自初始化。

<details>
<summary>查看原文（11行）</summary>

```text
    yield* closeBlock()

    if (!produced) {
      throw new LlmError(
        'rapid-mlx completed the request with no content blocks',
        EMPTY_RESPONSE_CODE,
      )
    }
    // usage strictly before finish, and nothing at all after it.
    if (usage) yield { type: 'usage', usage }
    yield { type: 'finish', reason: { kind: finish } }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:367-380](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L367-L380)

SSE按换行提取data，迭代结束不处理残余buffer。

<details>
<summary>查看原文（14行）</summary>

```text
/** Minimal SSE reader: yields each `data:` payload as a string. */
async function* sseEvents(body, signal) {
  const decoder = new TextDecoder()
  let buffer = ''
  for await (const chunk of body) {
    if (signal?.aborted) return
    buffer += decoder.decode(chunk, { stream: true })
    let nl
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl).trim()
      buffer = buffer.slice(nl + 1)
      if (line.startsWith('data:')) yield line.slice(5).trim()
    }
  }
```

</details>

#### 缺口

- 目标服务是否会发出上述交错工具片段或缺尾帧序列，尚未取得版本绑定的真实协议记录。
  **影响**：缺陷触发范围未知，无法保证多工具任务与异常断连下的结果完整性。
  **进一步探讨**：保存目标服务原始流，覆盖两工具交错、片段无id和缺少结尾帧的输入，核对工具名、id、参数和完成状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 五项管理工具怎样执行，失败和状态判断有哪些限制？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

五项工具分别读取已服务模型、列缓存、下载、删除和健康；一个 rapid-mlx 命令组合健康、服务模型和缓存概览。已服务模型由HTTP读取，磁盘缓存与pull/rm由宿主subprocess执行，参数以argv数组传入，没有拼接shell命令。子进程在系统临时目录运行，stdout和stderr各有1MiB上限；下载无固定截止但传递执行信号，删除有60秒上限且使用rm -y，插件本身不再向人确认删除。取消信号交给宿主，不能据此证明下载停止或缓存没有部分写入。

HTTP与CLI健康分开报告，是可借鉴的故障定位设计，但概览命令始终返回kind=success，使用者应读正文的API/CLI状态，不能只看命令状态。缓存工具优先JSON，不支持或解析失败时回退文本；第二次文本命令只读取stdout、不检查code，因此非零退出且没有可解析表格可能呈现空模型列表。正常空缓存与失败空输出不能仅依靠返回models=[]区分。

服务模型去重同样有明确条件。fingerprint只含context_window、reasoning_parser、tool_call_parser、modality、capabilities，没有模型身份、max_model_len、MoE等字段；如果两个真实模型这些事实相同，它们会归为一组并采用第一条的其他字段。源码可证明这一合并规则，实际是否发生误合并取决于服务器返回。管理工具展示不能替代直接读取原始模型列表或CLI退出码；删除前应以人工核对的精确模型名称及可重新下载来源为准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:124-157](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/tools.js#L124-L157)

已服务模型HTTP读取，缓存先JSON后文本；文本回退未检查退出码。

<details>
<summary>查看原文（34行）</summary>

```text
  jsonTool(
    'rapid_mlx_serving',
    'Show the model(s) rapid-mlx is currently serving and their facts: context window, whether they can reason or call tools, MoE/hybrid architecture, and modalities.',
    {},
    async (_args, exec) => ({ models: await fetchServed(baseURL, fetchImpl, exec.signal) }),
  )

  jsonTool(
    'rapid_mlx_cached',
    'List models downloaded to the local Hugging Face cache with their on-disk size — what `rapid-mlx pull` has fetched, independent of what is being served.',
    {},
    async (_args, exec) => {
      const sp = exec.subprocess ?? deps.subprocess
      const executable = await resolveCli(sp, cliCommand)
      // Prefer structured `--json` (rapid-mlx new enough to emit it); fall
      // back to scraping the text table for older servers, where `--json` is
      // an unknown flag and argparse exits non-zero.
      const jsonRun = await runCli(sp, executable, ['models', '--cached', '--json'], {
        signal: exec.signal,
        timeoutMs: 30_000,
      })
      if (jsonRun.code === 0) {
        try {
          return normalizeCachedJson(JSON.parse(jsonRun.stdout))
        } catch {
          // Malformed JSON — fall through to the text parser.
        }
      }
      const { stdout } = await runCli(sp, executable, ['models', '--cached'], {
        signal: exec.signal,
        timeoutMs: 30_000,
      })
      return parseCached(stdout)
    },
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:160-192](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/tools.js#L160-L192)

下载和删除的argv、信号、无固定下载时限及rm -y都在实际执行链。

<details>
<summary>查看原文（33行）</summary>

```text
  jsonTool(
    'rapid_mlx_pull',
    'Download a model into the local cache via `rapid-mlx pull`. Accepts an alias (e.g. qwen3.5-9b-4bit) or a Hugging Face repo id. Large models can take a while; the download is cancellable.',
    { name: { type: 'string', required: true, description: 'Model alias or Hugging Face repo id to download.' } },
    async (args, exec) => {
      const name = String(args.name)
      const executable = await resolveCli(exec.subprocess ?? deps.subprocess, cliCommand)
      // No timeout: a multi-GB download outlives any fixed deadline; the user
      // cancels through the tool's own signal instead.
      const { code, stderr } = await runCli(exec.subprocess ?? deps.subprocess, executable, ['pull', name], {
        signal: exec.signal,
        timeoutMs: Infinity,
      })
      if (code === 0) return { op: 'pull', name, ok: true }
      return { op: 'pull', name, ok: false, error: (stderr.trim().split('\n').pop() || `exit ${code}`).slice(0, 500) }
    },
  )

  jsonTool(
    'rapid_mlx_remove',
    'Delete a downloaded model from the local cache via `rapid-mlx rm` to free disk space. Accepts an alias or a Hugging Face repo id.',
    { name: { type: 'string', required: true, description: 'Model alias or Hugging Face repo id to remove.' } },
    async (args, exec) => {
      const name = String(args.name)
      const executable = await resolveCli(exec.subprocess ?? deps.subprocess, cliCommand)
      // `-y`: the CLI prompts for confirmation by default, but the subprocess
      // seam ignores stdin — without this the removal would hang on the prompt.
      const { code, stderr } = await runCli(exec.subprocess ?? deps.subprocess, executable, ['rm', '-y', name], {
        signal: exec.signal,
        timeoutMs: 60_000,
      })
      if (code === 0) return { op: 'remove', name, removed: true }
      return { op: 'remove', name, ok: false, error: (stderr.trim().split('\n').pop() || `exit ${code}`).slice(0, 500) }
```

</details>

**依据 3 · 源码核查**：[lib/cli.js:37-54](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/cli.js#L37-L54)

子进程使用宿主服务，固定cwd、输出上限，返回exitCode及文本，不自动恢复。

<details>
<summary>查看原文（18行）</summary>

```text
export async function runCli(subprocess, executable, args, options = {}) {
  const { timeoutMs = 120_000, graceMs = 10_000, signal } = options
  const handle = subprocess.spawn({
    argv: [executable, ...args],
    cwd: tmpdir(),
    stdio: {
      stdin: 'ignore',
      stdout: { maxBytes: OUTPUT_CAP },
      stderr: { maxBytes: OUTPUT_CAP },
    },
    graceMs,
    ...(signal ? { signal } : {}),
    ...(Number.isFinite(timeoutMs) ? { timeoutMs } : {}),
  })
  const outcome = await handle.done
  const stdout = handle.collected.stdout?.readFrom(0).text ?? ''
  const stderr = handle.collected.stderr?.readFrom(0).text ?? ''
  return { code: outcome.exitCode ?? null, stdout, stderr }
```

</details>

**依据 4 · 源码核查**：[lib/management.js:21-65](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/management.js#L21-L65)

按元数据指纹分组，没有身份和max_model_len，组内取第一条。

<details>
<summary>查看原文（45行）</summary>

```text
/** A stable fingerprint of a model's facts, to group its duplicate id entries. */
function fingerprint(e) {
  return JSON.stringify([
    e.context_window ?? null,
    e.reasoning_parser ?? null,
    e.tool_call_parser ?? null,
    e.modality ?? null,
    Array.isArray(e.capabilities) ? [...e.capabilities].sort() : null,
  ])
}

/**
 * The models the server is serving right now, deduplicated, with the rich
 * facts the generic OpenAI route discards.
 */
export async function fetchServed(baseURL, fetchImpl, signal) {
  const entries = await modelEntries(baseURL, fetchImpl, signal)
  const groups = new Map()
  for (const e of entries) {
    const key = fingerprint(e)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(e)
  }
  return [...groups.values()].map((group) => {
    const ids = group.map((e) => String(e.id))
    const repo = ids.find((id) => id.includes('/'))
    const alias = ids.find((id) => !id.includes('/'))
    const e = group[0]
    return {
      ids,
      alias: alias ?? repo ?? ids[0],
      repo: repo ?? null,
      contextWindow: Number.isInteger(e.context_window) ? e.context_window : undefined,
      maxModelLen:
        Number.isInteger(e.max_model_len) && e.max_model_len > 0
          ? e.max_model_len
          : undefined,
      reasoningParser: typeof e.reasoning_parser === 'string' ? e.reasoning_parser : null,
      toolCallParser: typeof e.tool_call_parser === 'string' ? e.tool_call_parser : null,
      isMoe: e.is_moe === true,
      isHybrid: e.is_hybrid === true,
      modality: typeof e.modality === 'string' ? e.modality : undefined,
      capabilities: Array.isArray(e.capabilities) ? e.capabilities.map(String) : [],
      recommendedSampling: e.recommended_sampling ?? null,
    }
```

</details>

**依据 5 · 源码核查**：[lib/tools.js:204-223](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/tools.js#L204-L223)

概览组合健康和缓存，最终返回success，正文仍可能报告API down。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.commands.register({
    name: 'rapid-mlx',
    description: 'One-shot rapid-mlx overview: server/CLI health, the served model and its facts, and cache disk usage.',
    async handler() {
      const health = await checkHealth(baseURL, fetchImpl, deps.subprocess, cliCommand)
      const lines = ['rapid-mlx status:', `- ${renderHealth(health).split('\n').join('\n- ')}`]
      if (health.api.ok && (health.api.served?.length ?? 0) > 0) {
        lines.push('', renderServed({ models: health.api.served }))
      }
      if (health.cli.present) {
        try {
          const executable = await resolveCli(deps.subprocess, cliCommand)
          const { stdout } = await runCli(deps.subprocess, executable, ['models', '--cached'], { timeoutMs: 30_000 })
          const cached = parseCached(stdout)
          lines.push('', `Cache: ${cached.models.length} model(s), ${formatBytes(cached.totalBytes ?? 0)} on disk`)
        } catch {
          // best-effort; health already reported CLI reachability
        }
      }
      return { kind: 'success', text: lines.join('\n') }
```

</details>

#### 缺口

- 服务端多模型返回的身份关系与缓存失败时CLI输出形态尚无本次真实记录。
  **影响**：无法量化误合并或误报空缓存的频率，不能用管理概览作为删除前唯一依据。
  **进一步探讨**：对照原始/models与模型清单，注入缓存命令失败并核对错误是否与空缓存区分。
- 取消、超时后下载临时文件和删除后状态由外部CLI及宿主执行语义决定。
  **影响**：返回失败不能证明没有磁盘副作用，重试前须重新查询。
  **进一步探讨**：对受控可丢弃模型记录取消前后缓存状态和子进程结果，再决定重试或清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入、持续使用和退出要承担什么成本，现有结果证明到哪里？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

安装元数据声明Cordis、dsh-llm/tools/subprocess/commands的rc.8系列与schemastery依赖，bundle插入本适配器；README要求Node至少22.15与运行中的Rapid-MLX。目标人群已经承担本地模型服务的内存、磁盘和硬件条件，插件并不消除这些资源负担。baseURL可通过环境配置，CLI路径另有配置；HTTP可达不代表CLI在宿主PATH中。作者记录rc.7下M3 Ultra的一次36秒修复任务，这只支持作者曾报告该结果，本次未取得同版本可重放运行原件，不升级为local_test或host_acceptance，也不能从一个成功例子计算节时、合格率或单位成本。

首次成本在安装profile层、配置独占路由与核对服务字段；持续成本在本地服务运维、模型资源与宿主接口适配；失败成本包括分辨CLI失败与空缓存、检查下载残留、重试受损工具任务。金额、耗时、频率均无可靠记录，不能写免费或低成本。退出时把agent provider切回原通用路由并停用本bundle是可理解退路，但它不会撤销已下载或删除的模型，删除的缓存要靠重新取得模型恢复。README也提醒已有llm-pi-ai的同名rapid-mlx路由会争用，需先消除重复配置。

因此当前可解释配置增量，尚不能判断端到端收益是否足以覆盖维护负担。合格任务应至少验证选中模型容量、文本及工具调用语义和失败可辨认；仅安装或健康命令返回success不满足该标准。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-22](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/package.json#L11-L22)

bundle及所需宿主包版本声明，属于安装契约而非运行证明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-commands": "^0.1.0-rc.8",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.8",
    "@deepseek-ai/dsh-subprocess": "^0.1.0-rc.8",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.8",
    "@deepseek-ai/schemastery": "^3.18.1"
```

</details>

**依据 2 · 作者声明**：[README.md:60-86](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/README.md#L60-L86)

作者提供Node要求、profile安装和agent路由配置。

<details>
<summary>查看原文（27行）</summary>

````text
## Install

Needs Node ≥ 22.15 (dsh imports Node's Zstd stream API without declaring it)
and a running Rapid-MLX server.

```sh
# From npm:
dsh plugin --profile web add @raullenchai/dsh-provider

# …or straight from source — the package ships plain JS with no build step:
dsh plugin --profile web add github:raullenchai/rapid-mlx-dsh-provider

export RAPID_MLX_BASE_URL=http://localhost:8000/v1     # optional; this is the default
dsh web
```

Then point the agent at the route:

```yaml
# $DSH_HOME/settings.yaml
agent-default-model:
  provider: rapid-mlx
  model: qwen3.6-35b-8bit
```

Verified: that command installs and activates as a profile layer against
`dsh 0.1.0-rc.7`. To hack on it locally instead, see
````

</details>

**依据 3 · 作者声明**：[README.md:115-144](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/README.md#L115-L144)

36秒任务属于作者自报；同名路由冲突、图像限制被明确披露。

<details>
<summary>查看原文（30行）</summary>

```text
## Verified

Against `dsh 0.1.0-rc.7` on an M3 Ultra:

- Installs and **activates as a profile layer** (no "declares no `dsh.bundle`"
  warning; the entry shows up in `dsh --profile headless --dump-config`).
- Registers the `rapid-mlx` route with `ctx.llm` and serves real queries.
- Plain chat, a single tool call, and the multi-step bug-fix task that gates
  Rapid-MLX releases — the last one fixed the bug and made the target repo's own
  test pass, verified independently, in 36 s on `qwen3.6-35b-8bit`.

## Not done yet

Being explicit, because the point of the adapter is to *use* what the server
says and some of it is still only read:

- `recommended_sampling` — should be applied automatically per model.
- `tool_call_parser` — should let `dsh` fail fast on a model that cannot emit
  `tool_calls`, instead of looping.
- `is_hybrid` / `is_moe` / `capabilities` — read, not yet acted on.
- **Memory-aware capacity.** Today `resolveModel()` reports the model's
  *advertised* context window. On a Mac the real ceiling is unified memory, and
  reporting that instead is the biggest remaining win — it needs Rapid-MLX to
  expose a usable-capacity figure first.
- Images are not carried through `stream()` — but they now **refuse** with
  `LlmError(..., 'UNSUPPORTED')` rather than being dropped, per the cookbook.
  Text, reasoning and tool calls are carried.
- The route is registered as `rapid-mlx`. If your `settings.yaml` also declares
  a `rapid-mlx` provider under `llm-pi-ai`, the two compete for one route name
  (`registerAdapter` owns provider exclusivity). Use one or rename ours.
```

</details>

**依据 4 · 源码核查**：[lib/tools.js:160-192](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/tools.js#L160-L192)

下载删除直接修改缓存，停用插件不补偿这些副作用。

<details>
<summary>查看原文（33行）</summary>

```text
  jsonTool(
    'rapid_mlx_pull',
    'Download a model into the local cache via `rapid-mlx pull`. Accepts an alias (e.g. qwen3.5-9b-4bit) or a Hugging Face repo id. Large models can take a while; the download is cancellable.',
    { name: { type: 'string', required: true, description: 'Model alias or Hugging Face repo id to download.' } },
    async (args, exec) => {
      const name = String(args.name)
      const executable = await resolveCli(exec.subprocess ?? deps.subprocess, cliCommand)
      // No timeout: a multi-GB download outlives any fixed deadline; the user
      // cancels through the tool's own signal instead.
      const { code, stderr } = await runCli(exec.subprocess ?? deps.subprocess, executable, ['pull', name], {
        signal: exec.signal,
        timeoutMs: Infinity,
      })
      if (code === 0) return { op: 'pull', name, ok: true }
      return { op: 'pull', name, ok: false, error: (stderr.trim().split('\n').pop() || `exit ${code}`).slice(0, 500) }
    },
  )

  jsonTool(
    'rapid_mlx_remove',
    'Delete a downloaded model from the local cache via `rapid-mlx rm` to free disk space. Accepts an alias or a Hugging Face repo id.',
    { name: { type: 'string', required: true, description: 'Model alias or Hugging Face repo id to remove.' } },
    async (args, exec) => {
      const name = String(args.name)
      const executable = await resolveCli(exec.subprocess ?? deps.subprocess, cliCommand)
      // `-y`: the CLI prompts for confirmation by default, but the subprocess
      // seam ignores stdin — without this the removal would hang on the prompt.
      const { code, stderr } = await runCli(exec.subprocess ?? deps.subprocess, executable, ['rm', '-y', name], {
        signal: exec.signal,
        timeoutMs: 60_000,
      })
      if (code === 0) return { op: 'remove', name, removed: true }
      return { op: 'remove', name, ok: false, error: (stderr.trim().split('\n').pop() || `exit ${code}`).slice(0, 500) }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:67-75](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L67-L75)

HTTP地址与CLI命令是实际可配置条件。

```text
export const Config = z.object({
  baseURL: z
    .string()
    .default('http://localhost:8000/v1')
    .description('Base URL of the Rapid-MLX OpenAI-compatible API.'),
  cliCommand: z
    .string()
    .default('rapid-mlx')
    .description('The rapid-mlx CLI to invoke for pull/remove/cached (name on PATH or absolute path).'),
```

#### 缺口

- 没有相同模型、任务及资源的通用路由对照和全周期人工投入记录。
  **影响**：无法声称成功率、节时或总成本改善；采用价值只作有条件分析。
  **进一步探讨**：以固定任务集记录所有尝试、人工核对和恢复时间，统计合格结果后再比较总资源与人工投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能由已查限制推出什么可证伪设计，当前应如何选择？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议观察，适用于已有Rapid-MLX运维能力、希望研究模型事实接入的DSH开发者；不建议把这一固定版本直接作为并行工具或缓存删除的可靠控制面。理由并非仅“未运行”，而是Q02的单累加器和缺尾帧识别、Q03的元数据合并及缓存回退错误通道，都会影响使用者判断结果是否完整。开发者仍可阅读容量优先级和纯请求映射来学习接口设计，但这不自动形成安装推荐。

可证伪的设计假设是将“模型身份”和“执行结果是否确定”都保留到展示层：服务列表先凭服务端明确身份/别名关系归并，不以相同容量推断同一模型；缓存查询同时返回命令结果与解析状态，非零或无法解析不伪装成空缓存；流工具按index保存独立状态并要求明确结束信号。它不是本组件已有能力，而是由具体信息丢失推导的改进方向。新增负担是状态对象与错误分支，需要跟宿主输出契约对接。

最小验证可使用不触碰真实缓存的记录/桩输入，包含两个事实相同而id不同的模型、JSON失败后文本非零的缓存查询、两工具交错碎片和截短SSE。成功判据是模型身份不混淆、空与失败可区分、工具id/参数逐字保留、缺尾帧不被当明确成功；若增加状态后仍错误合并，或正常输入产生大量无法解释的未知结果，则削弱该方案。真实收益还需后续同任务对照，不从桩输入通过推断业务节时。

#### 证据与依据

**依据 1 · 源码核查**：[lib/management.js:21-48](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/management.js#L21-L48)

身份缺失的事实指纹直接支撑身份保留假设。

<details>
<summary>查看原文（28行）</summary>

```text
/** A stable fingerprint of a model's facts, to group its duplicate id entries. */
function fingerprint(e) {
  return JSON.stringify([
    e.context_window ?? null,
    e.reasoning_parser ?? null,
    e.tool_call_parser ?? null,
    e.modality ?? null,
    Array.isArray(e.capabilities) ? [...e.capabilities].sort() : null,
  ])
}

/**
 * The models the server is serving right now, deduplicated, with the rich
 * facts the generic OpenAI route discards.
 */
export async function fetchServed(baseURL, fetchImpl, signal) {
  const entries = await modelEntries(baseURL, fetchImpl, signal)
  const groups = new Map()
  for (const e of entries) {
    const key = fingerprint(e)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(e)
  }
  return [...groups.values()].map((group) => {
    const ids = group.map((e) => String(e.id))
    const repo = ids.find((id) => id.includes('/'))
    const alias = ids.find((id) => !id.includes('/'))
    const e = group[0]
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:141-156](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/tools.js#L141-L156)

两次查询的结果状态没有完整传播，支持显式区分空与失败。

<details>
<summary>查看原文（16行）</summary>

```text
      const jsonRun = await runCli(sp, executable, ['models', '--cached', '--json'], {
        signal: exec.signal,
        timeoutMs: 30_000,
      })
      if (jsonRun.code === 0) {
        try {
          return normalizeCachedJson(JSON.parse(jsonRun.stdout))
        } catch {
          // Malformed JSON — fall through to the text parser.
        }
      }
      const { stdout } = await runCli(sp, executable, ['models', '--cached'], {
        signal: exec.signal,
        timeoutMs: 30_000,
      })
      return parseCached(stdout)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:299-341](https://github.com/raullenchai/rapid-mlx-dsh-provider/blob/88f98e7835989c3a05813e475ada4ce0b3c94267/lib/index.js#L299-L341)

当前工具块和结束逻辑是按index保留状态及明确终止假设的依据。

<details>
<summary>查看原文（43行）</summary>

```text
      for (const tc of delta.tool_calls ?? []) {
        // A NEW id mid-stream means a second call in the same response;
        // close the previous block so each one ends up its own tool-call
        // block rather than two calls' arguments concatenated into one.
        if (open === 'tool-call' && tc.id && call.id && tc.id !== call.id) {
          yield* closeBlock()
        }
        if (open !== 'tool-call') {
          yield* closeBlock()
          yield* openBlock('tool-call')
        }
        if (tc.id) call.id = tc.id
        if (tc.function?.name) call.name = tc.function.name
        const argsDelta = tc.function?.arguments ?? ''
        call.arguments += argsDelta
        yield {
          type: 'tool-call-delta',
          index,
          id: call.id || `call_${index}`,
          ...(tc.function?.name ? { name: tc.function.name } : {}),
          argumentsDelta: argsDelta,
        }
      }
      if (choice.finish_reason) {
        finish =
          choice.finish_reason === 'tool_calls'
            ? 'tool-calls'
            : choice.finish_reason === 'length'
              ? 'max-tokens'
              : 'stop'
      }
    }
    yield* closeBlock()

    if (!produced) {
      throw new LlmError(
        'rapid-mlx completed the request with no content blocks',
        EMPTY_RESPONSE_CODE,
      )
    }
    // usage strictly before finish, and nothing at all after it.
    if (usage) yield { type: 'usage', usage }
    yield { type: 'finish', reason: { kind: finish } }
```

</details>

#### 缺口

- 上述改进尚未实现或比较，宿主如何呈现unknown结果仍需具体接口设计。
  **影响**：只能作为待验证假设，不能计入当前贡献或创新评分。
  **进一步探讨**：用固定异常序列检查正确性，再观察额外状态和人工确认是否引入更高负担。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
