# DSH Save Token

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[eb85c42](https://github.com/vibe-any/dsh-plugin-save-token/tree/eb85c421758e56d6a1ae8c87dd10f0d38e621559)

<!-- BEGIN META -->
[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vibe-any/dsh-plugin-save-token) [![npm 30d 15,588](https://img.shields.io/static/v1?label=npm+30d&message=15%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-save-token) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-save-token)
<!-- END META -->

> **功能**：在 DSH 中压缩与去重工具文本，保存原文定位，提供展开工具和 token 用量仪表。

> **亮点**：[Q01](#research-q01) 支持将结构化压缩、保存成功才替换、展开及真实usage观察组合进DSH工具流程；[Q02](#research-q02) 的原件路径仍为失败恢复提供依据。这是可解释的集成贡献。所谓无损和完整恢复有具体边界，[Q04](#research-q04) 的作者小样本全量r2总token反而增加，不能把局部字节减少升级为已兑现费用节省。

> **主要限制**：[Q02](#research-q02) 显示标量类型可丢、超长expand会截短且内存索引不跨重启；[Q03](#research-q03) 显示门控未覆盖追加notice后的最终文本，摘要相同也不等于全文相同。核心质疑是节省计数能否对应完整、正确且总成本较低的任务结果；当前代码与作者全量数据均不足以支持普遍“不损智能且省钱”。

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
  - [Q01 · 哪类任务触发，宿主真正接入哪些机制？](#detail-section-11)
  - [Q02 · “无损、可逆、一次取回原文”在何种边界成立？](#detail-section-12)
  - [Q03 · “最终更小”和“字节相同去重”是否由代码保证？](#detail-section-13)
  - [Q04 · 作者对照与原始数据能支持什么效果结论？](#detail-section-14)
  - [Q05 · 接入、持续和恢复代价如何影响采用？](#detail-section-15)
  - [Q06 · 从限制能提出什么可证伪设计？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向冗长工具输出直接进入上下文的DSH任务，替换部分大文本并保留原件定位。[Q01](#research-q01) 说明read与嵌套工具绕过，写文件再精读未必受益。合格结果应是任务质量、全部调用成本和恢复负担共同可接受，不能只看单段字节。

参照保留全部输出和先写文件再精读；TOON风格编码、CCR与去重模式由作者明确列出先例。本组件的增量是DSH内组合、门控与可视计量，不宣称这些方法原创，也不把同仓Codex子工程能力算作DSH入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 结构化/行窗口文本压缩 | 减少部分顶层工具文本 | 仅纯text、排除read/expand/嵌套；最终notice未重新门控 |
| 会话内工具输出去重 | 用引用桩代替重复大文本 | 基于FNV摘要而非全文复核；仍先保存本次原文 |
| 原文保存与定位 | 给替换文本附恢复路径 | 依赖宿主spillStore成功和后续保留 |
| save_token_expand | 按短id读取原文或返回locator | 内存正文可能截短，重启后需从notice找原路径 |
| 模型用量计量 | 区分usage分桶与avoided估计 | avoided不是实际账单节省 |
| 可选压缩辅助 | 超水位请求宿主压缩 | 默认关闭，宿主可拒绝；不承诺省钱 |
| GUI仪表与开关 | 查看计数并临时切换策略 | reset不还原历史文本或清理spill文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web profile的tools/webServer | 启动必需 | hook、工具与仪表HTTP | package未绑定明确DSH范围，需另核兼容 |
| React与客户端slot | GUI必需 | 设置仪表/输入区状态条 | 宿主未提供时不能由后端加载推断UI可用 |
| spillStore及保留空间 | 替换必需 | 保存原件并提供locator | 保存失败则不压缩，已存原件的权限/寿命未查 |
| 原生compaction服务 | 辅助压缩时必需 | 超水位调用宿主策略 | 默认关闭；宿主无服务或拒绝则不执行 |
| 大段顶层纯文本结果 | 效果触发条件 | 提供可替换文本 | read、嵌套及先写文件模式可能不触发 |
| 原件读取能力 | 恢复时必需 | 按locator读取被省略信息 | 短id不保证跨重启可解析，需保留notice |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装重启并核对宿主服务及原件读取 | 无spill则保持原文本，不误认为已节省 |
| 变换 | 插件处理可接入工具结果，保存原文后返回候选加notice | 同时核对最终文本与原件，不只看计数 |
| 检索 | 模型或用户按id/locator读缺失细节 | 超长截短、淘汰或重启时转读原notice路径 |
| 对照 | 用户记录合格任务、所有调用与恢复动作 | 真实账单/质量变差即停，不用avoided抵消 |
| 退出 | 用户关闭策略或移除bundle，保留需恢复原件 | 历史替换不自动还原，原件按宿主策略后续清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 现有宿主及磁盘，具体金额未知 | 安装重启、兼容与类型/长原文恢复检查，工时未知 | 不因纯JS或无额外模型调用断言零成本 |
| 持续 | 扫描/哈希CPU、spill磁盘、notice与展开调用 | 核对质量、用量及宿主接口变化 | 金额、频率与净token效应依负载未知 |
| 失败恢复 | 重读原件、重跑任务及残留磁盘 | 找notice、识别截短与类型失真、核对原件 | 文件可逆不等于任务推理与费用可回滚 |
| 退出 | 历史原件仍占存储 | 停策略、恢复所需历史信息后再清理 | reset仅清仪表/缓存，不删原文或还原会话 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 单段候选压缩 | 候选通过字节与启发式token门槛 | 完整notice后是否实际更小 |
| 恢复 | spill成功才替换并附locator | 超长一次expand、跨重启id及宿主保留 |
| 作者r2总体 | 12对记录success字段均1，总token+38% | 样本真实性、质量泛化与因果 |
| 事后离群敏感性 | 同删一对后的算术约+2%，而非单删-0.6% | 不能据此选择更有利效果估计 |
| 费用收益 | usage和avoided估计分开保存 | 无本次实际货币账单、节时或ROI |

> **思考**：[Q02](#research-q02) 显示标量类型可丢、超长expand会截短且内存索引不跨重启；[Q03](#research-q03) 显示门控未覆盖追加notice后的最终文本，摘要相同也不等于全文相同。核心质疑是节省计数能否对应完整、正确且总成本较低的任务结果；当前代码与作者全量数据均不足以支持普遍“不损智能且省钱”。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 支持将结构化压缩、保存成功才替换、展开及真实usage观察组合进DSH工具流程；[Q02](#research-q02) 的原件路径仍为失败恢复提供依据。这是可解释的集成贡献。所谓无损和完整恢复有具体边界，[Q04](#research-q04) 的作者小样本全量r2总token反而增加，不能把局部字节减少升级为已兑现费用节省。

[Q01](#research-q01) 的纯压缩模块与宿主编排分离、保存成功才替换以及usage分桶和估计分开值得借鉴；移植需要宿主原件/授权与工具内容契约。[Q02](#research-q02) 的标量类型和截短渲染、[Q03](#research-q03) 的最终门控和摘要等价则说明命名不等于不变量。已查lib与src的关键链一致，不能把问题归为仅开发源码未发布；未运行build或测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示标量类型可丢、超长expand会截短且内存索引不跨重启；[Q03](#research-q03) 显示门控未覆盖追加notice后的最终文本，摘要相同也不等于全文相同。核心质疑是节省计数能否对应完整、正确且总成本较低的任务结果；当前代码与作者全量数据均不足以支持普遍“不损智能且省钱”。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。[Q02](#research-q02) 与 [Q03](#research-q03) 的完整恢复和最终门控先于节省率判断。可保留原文的DSH开发者先在可丢弃会话核对类型、长文本与重启后检索；发现数字/字符串混淆、expand缺尾或全部账单上升时关闭压缩去重并直接读原件。不要用仪表avoided估计替代合格任务净成本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持DSH工具文本变换、spill前置与计量接线；无损、最终门控及完整取回承诺存在可定位边界。作者r2全量记录只经本次算术核对，未独立复现；未来恢复契约是待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、build.mjs、src/index.js、src/compress.js、lib/index.js、src/client/index.js、bench/report_2026-09-03.md、bench/results/summary-r2.md、bench/results/raw2/gaia-gaia-l2-arxiv-regulation-baseline-r1.json、bench/results/raw2/gaia-gaia-l2-arxiv-regulation-baseline-r2.json、bench/results/raw2/gaia-gaia-l2-arxiv-regulation-treatment-r1.json、bench/results/raw2/gaia-gaia-l2-arxiv-regulation-treatment-r2.json、bench/results/raw2/gaia-gaia-l2-locomotives-baseline-r1.json、bench/results/raw2/gaia-gaia-l2-locomotives-baseline-r2.json、bench/results/raw2/gaia-gaia-l2-locomotives-treatment-r1.json、bench/results/raw2/gaia-gaia-l2-locomotives-treatment-r2.json、bench/results/raw2/swe-swe-django-16595-baseline-r1.json、bench/results/raw2/swe-swe-django-16595-baseline-r2.json、bench/results/raw2/swe-swe-django-16595-treatment-r1.json、bench/results/raw2/swe-swe-django-16595-treatment-r2.json、bench/results/raw2/swe-swe-sympy-24562-baseline-r1.json、bench/results/raw2/swe-swe-sympy-24562-baseline-r2.json、bench/results/raw2/swe-swe-sympy-24562-treatment-r1.json、bench/results/raw2/swe-swe-sympy-24562-treatment-r2.json、bench/results/raw2/tb-tb-access-logs-baseline-r1.json、bench/results/raw2/tb-tb-access-logs-baseline-r2.json、bench/results/raw2/tb-tb-access-logs-treatment-r1.json、bench/results/raw2/tb-tb-access-logs-treatment-r2.json、bench/results/raw2/tb-tb-jsonl-aggregator-baseline-r1.json、bench/results/raw2/tb-tb-jsonl-aggregator-baseline-r2.json、bench/results/raw2/tb-tb-jsonl-aggregator-treatment-r1.json、bench/results/raw2/tb-tb-jsonl-aggregator-treatment-r2.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根DSH入口、完整src/index与定向compress编码/门控/窗口、已发布lib对应链、客户端挂载及r2作者报告；24份raw2 JSON仅读取字段做求和核对，不执行目标分析脚本。完整根目录INVENTORY包含同仓Codex子树，其统计不解释为DSH运行能力；该子工程不作独立采用判断。未查宿主spillStore实现或真实服务费用。
- 下一步：仅源码与固定文件记录核对；未安装、运行目标代码、构建、执行插件测试或基准。作者A/B记录保持作者证据，独立求和只是算术复核，不升级为本次local_test或host_acceptance。

**分析版本**

- **仓库**：[vibe-any/dsh-plugin-save-token](https://github.com/vibe-any/dsh-plugin-save-token)
- **版本号**：2.4.1（[固定提交 eb85c42](https://github.com/vibe-any/dsh-plugin-save-token/tree/eb85c421758e56d6a1ae8c87dd10f0d38e621559)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出未验证的最终消息恢复契约：对完整替换做真实token/字节门控、类型往返验证、原件可达检查及去重全文核对，并明确展开是否完整。以长locator、类型冲突、长原文、淘汰/重启和假摘要命中为最小反例集；仍需全任务账单和质量配对实验，任一不变量或总任务结果变差都削弱充分性。

仅源码与固定文件记录核对；未安装、运行目标代码、构建、执行插件测试或基准。作者A/B记录保持作者证据，独立求和只是算术复核，不升级为本次local_test或host_acceptance。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 5 | 462 | 357 | 71 | — |
| .md | source | 13 | 1399 | — | — | 17543 |
| .js | source | 11 | 4705 | 3870 | 686 | — |
| .mjs | test | 14 | 1774 | 1503 | 136 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/vibe-any/dsh-plugin-save-token/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对大量工具输出直入上下文的 DSH 任务，压缩、原文检索和计量是否足以支持“省 token 且不损害任务”的采用主张？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类任务触发，宿主真正接入哪些机制？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本组件面向大段工具文本直接进入后续模型上下文的任务，例如冗长测试日志或结构化API结果。原办法是保留全部输出，或主动先写文件再按需读取；插件在工具执行结果进入会话时替换部分文本，并附原文定位。合格结果必须兼顾任务答案与可恢复性、全部模型调用成本，不能只看单段输出字节减少。README把方法归因于既有TOON表格编码与压缩后存储检索模式，源码支持的是这些方法与DSH接线的组合，不是原创压缩理论。

package 的bundle、lib宿主入口和客户端声明说明它确为DSH插件。宿主注入tools/webServer，tools/post-execute只处理accept且没有value覆盖的顶层结果，纯text内容才继续；嵌套调用、read和save_token_expand均绕过。先尝试去重，再按门槛构建压缩候选，spill成功才替换。llm/stream跟踪真实usage并另算avoided估计；agent/pre-step可触发宿主原生压缩，但默认关闭。设置页和输入区仪表通过客户端slot挂载。写文件再精读或大量嵌套工具的工作负载因此可能根本不触发，不能把全生态工具输出都当可省部分。仓库另有Codex子工程，本次没有将其MCP/Skill能力归入根DSH插件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-31](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/package.json#L7-L31)

实际lib入口、bundle与web客户端声明。

<details>
<summary>查看原文（25行）</summary>

```text
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md"
  ],
  "scripts": {
    "build": "node build.mjs",
    "test": "node --test"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[src/index.js:244-266](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L244-L266)

接入tools/post-execute并排除嵌套、read、expand及非纯文本。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('tools/post-execute', async function (exec, result, next) {
    var decision = await next()
    if (!decision || decision.kind !== 'accept') return decision
    if (Object.prototype.hasOwnProperty.call(decision, 'value')) return decision
    // surface metrics (E4): how much of the call volume is nested inside
    // another tool / a subagent? The nesting exemption skips compression for
    // those calls — this counter quantifies that unexploited surface before
    // anyone flips the exemption.
    if (exec.parent !== undefined) comp.nestedCalls++
    else comp.topLevelCalls++
    if (exec.parent !== undefined) return decision
    // `read` stays exempt by design (write-file-then-read-precisely is a
    // verified information path). `save_token_expand` must stay exempt too:
    // its whole point is handing back the FULL original, so re-compressing it
    // would return the same elided preview the model just asked to unfold and
    // invite an expand loop.
    if (exec.name === 'read') return decision
    if (exec.name === 'save_token_expand') return decision
    var content = decision.content !== undefined ? decision.content : result.content
    var text = flattenPlainText(content)
    if (text === undefined) return decision
    var isError = result.isError === true
    var sessionId = ownerSessionId(exec)
```

</details>

**依据 3 · 源码核查**：[src/index.js:301-330](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L301-L330)

候选、spill和返回替换的真实链。

<details>
<summary>查看原文（30行）</summary>

```text
    // compress arm
    if (!cfg.compressEnabled) return decision
    var threshold = effectiveMinBytes(isError ? cfg.errorMinBytes : cfg.minBytes, cfg.minSavingBytes, cfg.keepRatioMax)
    if (utf8Bytes(text) <= threshold) return decision
    var cand = buildCandidate(text, cfg)
    if (cand === null) return decision
    var ref = await spillOriginal(text, sessionId, exec.name, exec.callId)
    if (ref === undefined) { noteRecent('skip', exec.name, lastSkip, 0); return decision }
    var id = shortId('c')
    // counters count ADOPTED compressions now (v2.1.x counted attempts the
    // gates later rejected)
    if (cand.lossless) comp.losslessEncodes++
    if (cand.strategy === 'lines-strided') comp.tabularWindows++
    comp.count++; comp.bytesBefore += cand.before; comp.bytesAfter += cand.after
    var verbose = comp.count <= cfg.noticeFullTrailerCount
    var finalText = buildNotice({
      body: cand.text,
      id: id,
      before: cand.before,
      after: cand.after,
      lossless: cand.lossless,
      stats: cand.stats,
      locator: ref.locator,
      retrievalHint: ref.retrievalHint || '',
      verbose: verbose
    })
    rememberOriginal(id, text, ref.locator)
    rememberCompressed(id, text, finalText, exec.name)
    noteRecent(cand.lossless ? 'lossless' : 'compress', exec.name, fmtInt(cand.before) + 'B -> ' + fmtInt(cand.after) + 'B (-' + Math.round((1 - cand.after / cand.before) * 100) + '%)', estTokens(text) - estTokens(finalText))
    return { kind: 'accept', content: [{ type: 'text', text: finalText }] }
```

</details>

**依据 4 · 源码核查**：[src/index.js:431-455](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L431-L455)

宿主压缩辅助只在开关启用及超水位时调用。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.on('agent/pre-step', async function (payload, next) {
    try {
      var sid = payload.agent && payload.agent.session ? String(payload.agent.session.header.id) : undefined
      if (sid !== undefined && cfg.compactAssistEnabled) {
        // real billed input is the truth; the heuristic estimate only covers
        // the very first request of a session
        var actual = lastBilledBySession.get(sid) || 0
        var est = lastEstBySession.get(sid) || 0
        var level = actual > 0 ? actual : est
        var watermark = compactWatermark()
        var lastAt = lastCompactAt.get(sid) || 0
        var now = Date.now()
        if (watermark > 0 && level > watermark && now - lastAt > cfg.compactCooldownMs) {
          var cs = ctx.get('compaction')
          if (cs !== undefined && typeof cs.compactIfNeeded === 'function') {
            lastCompactAt.set(sid, now)
            compactStats.attempts++
            var res = await cs.compactIfNeeded(payload.agent, 'pressure', payload.signal)
            if (res !== undefined && res !== null) { compactStats.done++; noteRecent('compact', payload.agent.options && payload.agent.options.model ? payload.agent.options.model : 'session', 'context ~' + fmtInt(level) + ' tok > watermark ' + fmtInt(watermark) + ' -> compaction applied', 0) }
            else { compactStats.skipped++; noteRecent('compact', 'policy', 'pressure reported at ~' + fmtInt(level) + ' tok; engine declined (no-op)', 0) }
          }
        }
      }
    } catch (e) { console.error('save-token: compaction assist failed (non-fatal)', e) }
    return next()
```

</details>

**依据 5 · 源码核查**：[src/client/index.js:417-425](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/client/index.js#L417-L425)

设置页和输入区slot实际挂载。

```text
  ctx.slots.inject('settings.section', function () {
    ctx.slots.register(
      { name: 'settings.section', id: 'save-token', order: 430, label: 'Token Saver' },
      function () { return h(Dashboard) })
  })
  ctx.slots.inject('conversation.composer.dock', function () {
    ctx.slots.register(
      { name: 'conversation.composer.dock', id: 'save-token-strip', order: 85 },
      function () { return h(Strip) })
```

**依据 6 · 作者声明**：[README.md:23-37](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/README.md#L23-L37)

作者对既有TOON/CCR与去重方法的归属说明。

<details>
<summary>查看原文（15行）</summary>

```text
### 1. Structure-aware compression: no more blind table slicing
Detects pipe-delimited high-density table rows (≥70% of lines sharing the same separator profile). When matched, instead of a blind head/tail window it does: keep the first 60 rows verbatim + stride-sample the middle section every N rows with original line numbers annotated (`L61: ...`) + keep the last 40 rows verbatim. The model receives a "map with coordinates" — any segment can be fetched precisely by line number.
> Reference: [rtk](https://github.com/rtk-ai/rtk)'s never-worse guard and error-line retention policy; the stride sampling is this plugin's improvement over rtk's head/tail window.

### 2. TOON-style lossless encoding first
Uniform JSON arrays (e.g. API responses with 300 homogeneous objects) first go through deterministic tabular re-encoding: `prices[300]{model,input,output}:` — one schema header line + CSV data rows. Keys are written once, zero information loss, and the notice explicitly says *"zero information loss"*. Lossy paths are only used when the lossless route is unavailable.
> Reference: [TOON — Token-Oriented Object Notation](https://github.com/toon-format/toon); measured savings of 30–60% tokens on uniform arrays.

### 3. Compress means spill (CCR): never burn the bridge
Before every replacement, the original text is written to disk via the dsh `spillStore`; the replacement embeds two retrieval paths: the dynamic tool `save_token_expand` (one-call fetch by marker id) plus a file locator for the original (readable directly with read/grep). If spilling fails, compression is abandoned — **reversibility is a hard precondition, not an option**.
> Reference: [headroom](https://github.com/headroomlabs-ai/headroom)'s CCR (Compress-Cache-Retrieve) pattern.

### 4. Cross-turn dedup
Tool-call results byte-identical within a 90-second window (rerunning the same command, etc.) are replaced by one stub: "This output is identical to N seconds ago, refer to earlier context." Prevents the same large output from appearing twice in the context.
> Reference: [headroom](https://github.com/headroomlabs-ai/headroom)'s cross-turn dedup.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “无损、可逆、一次取回原文”在何种边界成立？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

应区分“压缩表示本身无损”和“另存原件可恢复”。spillOriginal在宿主spillStore.saveText成功返回locator后才允许替换，失败保留原输出，这为恢复留下直接文件路径，是有价值的设计。但TOON风格单元格调用String(v)，仅遇逗号、引号或换行时加引号；字符串"1"与数字1、字符串"null"与null会产生相同单元格文本。uniformTabular只限制非对象标量，不保存列类型。因此在允许的JSON输入上，该表示不保证可逆还原类型，不能继承notice的“zero information loss”；原件仍可能通过spill找回，不能由表格类型丢失反推原件已丢。

取回工具也有明确边界。rememberOriginal把内存正文截到262144个JavaScript字符单元，execute遇到缓存命中直接返回截短文本和truncated标记；render只输出text，未把截短标记或locator告知模型。故超长原文不能保证“一次expand取得完整内容”。正文被淘汰而locator仍在时，才尝试宿主readText或返回路径。locatorIndex本身只是apply内new Map，没有文件写入或启动加载；进程重启后id索引丢失，工具只能提示回原notice寻找路径。README声称id索引跨重启持久化与该实现不符，不能把原文文件仍在和短id仍可解析混为一谈。

当前仍可借鉴“保存成功才替换”，但完整恢复依赖宿主原件保留、notice中locator可见和模型主动读取；这三项未由内存工具统一保证。涉及类型精确计算或很长原文的任务应保留人工核对和直接读原件的路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:226-240](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L226-L240)

保存原文失败时不提供ref，从而不替换。

<details>
<summary>查看原文（15行）</summary>

```text
  async function spillOriginal(text, sessionId, toolName, callId) {
    var store = ctx.get('spillStore')
    spillAvailable = store !== undefined
    if (store === undefined) { lastSkip = 'no spillStore backend: reversibility guaranteed, so compression stays off'; return undefined }
    if (sessionId === undefined) { lastSkip = 'no owning session'; return undefined }
    try {
      var ref = await store.saveText({
        owner: { sessionId: sessionId },
        source: { toolName: toolName, callId: callId, label: 'result' },
        suggestedName: toolName + '.txt',
        content: text
      })
      if (!ref || typeof ref.locator !== 'string') { lastSkip = 'spill ref had no locator'; return undefined }
      return ref
    } catch (e) { lastSkip = 'spill save failed: ' + String(e); return undefined }
```

</details>

**依据 2 · 源码核查**：[src/compress.js:63-66](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L63-L66)

String(v)加CSV转义未保留标量类型。

```text
export function csvCell(v) {
  var s = String(v)
  if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"'
  return s
```

**依据 3 · 源码核查**：[src/compress.js:128-139](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L128-L139)

标量列未要求固定类型也没有类型标签。

<details>
<summary>查看原文（12行）</summary>

```text
  for (var ki = 0; ki < keys.length; ki++) {
    var k = keys[ki]
    var first = arr[0][k]
    if (Array.isArray(first)) return null
    if (first === null || typeof first !== 'object') {
      for (var r1 = 1; r1 < arr.length; r1++) {
        var v1 = arr[r1][k]
        if (v1 !== null && typeof v1 === 'object') return null
      }
      groups.push({ header: k, get: (function (key) { return function (row) { return [row[key]] } })(k) })
      width++
      continue
```

</details>

**依据 4 · 源码核查**：[src/compress.js:175-186](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L175-L186)

所有标量按csvCell写入表格，支持类型不可区分的静态推导。

<details>
<summary>查看原文（12行）</summary>

```text
export function toonEncodeCols(arr, tab, nameArg) {
  var out = []
  out.push(nameArg + '[' + arr.length + ']{' + tab.groups.map(function (g) { return g.header }).join(',') + '}:')
  for (var i = 0; i < arr.length; i++) {
    var cells = []
    for (var k = 0; k < tab.groups.length; k++) {
      var vals = tab.groups[k].get(arr[i])
      for (var v = 0; v < vals.length; v++) cells.push(csvCell(vals[v]))
    }
    out.push(cells.join(','))
  }
  return out.join('\n')
```

</details>

**依据 5 · 源码核查**：[src/index.js:116-123](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L116-L123)

正文及locator索引都在apply内存Map。

```text
  var compressedIndex = new Map()
  var dedupeCache = new Map()
  var originals = new Map()
  var locatorIndex = new Map()
  var lastEstBySession = new Map()
  var lastBilledBySession = new Map()
  var lastCompactAt = new Map()
  var calibration = new Map()
```

**依据 6 · 源码核查**：[src/index.js:195-208](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L195-L208)

正文字符上限与内存索引淘汰。

<details>
<summary>查看原文（14行）</summary>

```text
  function rememberOriginal(id, text, locator) {
    var truncated = text.length > 262144
    originals.set(id, { text: truncated ? text.slice(0, 262144) : text, locator: locator, truncated: truncated, ts: Date.now() })
    // small side index: id -> locator survives original-text eviction, so the
    // expand tool can still point at the spill file after a restart window
    locatorIndex.set(id, { locator: locator, ts: Date.now() })
    if (locatorIndex.size > 4000) {
      var dropL = locatorIndex.keys()
      while (locatorIndex.size > 3200) { var lx = dropL.next(); if (lx.done) break; locatorIndex.delete(lx.value) }
    }
    if (originals.size > 160) {
      var it = originals.keys()
      while (originals.size > 120) { var nx = it.next(); if (nx.done) break; originals.delete(nx.value) }
    }
```

</details>

**依据 7 · 源码核查**：[src/index.js:465-494](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L465-L494)

命中截短正文直接返回，渲染只输出text；未命中才找locator或提示原notice。

<details>
<summary>查看原文（30行）</summary>

```text
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: function (args, value) {
        var t = value && typeof value.text === 'string' && value.text.length > 0 ? value.text : String((value && value.error) || 'not found')
        return [{ type: 'text', text: t }]
      }
    },
    execute: function (args) {
      var key = args && typeof args.id === 'string' ? args.id.trim() : ''
      var ent = originals.get(key)
      if (ent) return Promise.resolve({ text: ent.text, locator: ent.locator, truncated: ent.truncated === true })
      // miss: the id expired from the text cache (eviction or restart) but
      // the spill file persists — hand back the locator instead of a dead
      // end, and use a spillStore read API transparently when one exists
      var loc = locatorIndex.get(key)
      function locatorFallback() {
        return { error: 'expired id. The FULL ORIGINAL is still stored at: ' + loc.locator + '. Use the read tool on that path.', locator: loc.locator }
      }
      if (loc) {
        var store = ctx.get('spillStore')
        if (store && typeof store.readText === 'function') {
          return store.readText({ locator: loc.locator }).then(function (out) {
            var t = out && (typeof out.text === 'string' && out.text.length > 0 ? out.text : (typeof out === 'string' && out.length > 0 ? out : null))
            if (t) return { text: t, locator: loc.locator, truncated: false }
            return locatorFallback()
          }, function () { return locatorFallback() })
        }
        return Promise.resolve(locatorFallback())
      }
      return Promise.resolve({ error: 'unknown or expired id. Find the FULL ORIGINAL path printed inside the original [save-token #...] notice and use the read tool on that path.' })
```

</details>

**依据 8 · 作者声明**：[README.md:169-172](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/README.md#L169-L172)

作者声称跨重启保留id索引，须与源码实际内存实现区分。

```text
- Dedupe TTL default 90s → 600s with per-tool overrides (`dedupeTtlOverrides`, `0` opts a tool out entirely).
- Error-line protection in plain-text windows widened to **±1 context line** (25 anchors, adjacent anchors merged): a bare assertion line rarely explains itself; the neighboring test name / stack header is what saves a re-run.
- `save_token_expand` survives eviction and restarts: an id→locator side index outlives the text cache, so a miss returns the spill locator (with a transparent `spillStore.readText` attempt when the host offers one) instead of a dead end.
- Top-level vs nested tool calls are counted on the panel — the nesting exemption currently skips compression for subagent-internal calls, and this counter finally quantifies that unexploited surface before anyone flips it.
```

#### 缺口

- 宿主spillStore保留期、读取授权与清理策略未查。
  **影响**：不能保证notice长期可读或跨会话安全，原件恢复要依赖宿主契约。
  **进一步探讨**：核对固定宿主的saveText/readText与清理语义，再记录淘汰、重启和长文本展开结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “最终更小”和“字节相同去重”是否由代码保证？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

普通压缩候选先经过字节比例、绝对节省和启发式token减少门槛，但gate只检查route.text。之后宿主才追加含id、locator和retrievalHint的notice，最终返回finalText前没有再次检查。因此候选更小不保证模型实际收到的完整替换更小；特别是较长locator或提示会吃掉候选节省。已发布lib构建里同样先buildCandidate再buildNotice，并非仅未构建src问题。估计器按字符类别近似而非供应商tokenizer，连候选token门槛也不能写成实际计费必减。

去重分支与宣传的双门槛不同：它只要求stub较原文节省超过minSavingBytes，未检查keepRatioMax和估计token减少。指纹含sessionId、工具名及参数/内容的FNV-1a摘要，作用域隔离是实质改善；但FNV只有32位，代码没有在摘要命中后比较原参数和全文，故“BYTE-IDENTICAL”只是摘要相等推断，不能称严格字节相同。本文不声称已经发生碰撞，风险在可接受输入不同而摘要同值时触发；spill仍保留本次原件，但stub会错误指向先前上下文。

计量也要与账单区分。真实usage按输入、缓存读写、输出、推理分桶记录；avoided来自历史marker在内存compressedIndex中的估计差，再乘每模型校准比例。其结果是假设未替换文本会重放的反事实估计，不是账单差，也不包含恢复调用引起的全任务行为变化。面板reset清除计数、正文和去重Map，不删除spill文件，也不证明旧上下文不再带notice。

#### 证据与依据

**依据 1 · 源码核查**：[src/compress.js:22-31](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L22-L31)

token按字符类别启发估计，非供应商分词。

<details>
<summary>查看原文（10行）</summary>

```text
export function estTokens(s) {
  if (!s) return 0
  var cjk = 0, other = 0
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i)
    if (c >= 0x2e80 && c <= 0x9fff) cjk++
    else if (c >= 0xd800 && c <= 0xdfff) { cjk++; i++ }
    else other++
  }
  return Math.ceil(other / 3.8 + cjk * 0.75)
```

</details>

**依据 2 · 源码核查**：[src/compress.js:564-572](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L564-L572)

双门槛只检查候选route.text。

```text
function gate(route, text, cfg) {
  if (!route) return null
  var candidate = route.text
  if (!candidate || candidate.length < 20) return null
  var before = utf8Bytes(text), after = utf8Bytes(candidate)
  if (after > before * cfg.keepRatioMax) return null
  if (before - after < cfg.minSavingBytes) return null
  if (estTokens(candidate) >= estTokens(text)) return null
  return { text: candidate, before: before, after: after, lossless: route.lossless === true, strategy: route.strategy, stats: route.stats }
```

**依据 3 · 源码核查**：[lib/index.js:773-801](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/lib/index.js#L773-L801)

实际lib最终拼notice后直接返回，没有二次门控。

<details>
<summary>查看原文（29行）</summary>

```text
    var cand = buildCandidate(text, cfg);
    if (cand === null) return decision;
    var ref = await spillOriginal(text, sessionId, exec.name, exec.callId);
    if (ref === void 0) {
      noteRecent("skip", exec.name, lastSkip, 0);
      return decision;
    }
    var id = shortId("c");
    if (cand.lossless) comp.losslessEncodes++;
    if (cand.strategy === "lines-strided") comp.tabularWindows++;
    comp.count++;
    comp.bytesBefore += cand.before;
    comp.bytesAfter += cand.after;
    var verbose = comp.count <= cfg.noticeFullTrailerCount;
    var finalText = buildNotice({
      body: cand.text,
      id,
      before: cand.before,
      after: cand.after,
      lossless: cand.lossless,
      stats: cand.stats,
      locator: ref.locator,
      retrievalHint: ref.retrievalHint || "",
      verbose
    });
    rememberOriginal(id, text, ref.locator);
    rememberCompressed(id, text, finalText, exec.name);
    noteRecent(cand.lossless ? "lossless" : "compress", exec.name, fmtInt(cand.before) + "B -> " + fmtInt(cand.after) + "B (-" + Math.round((1 - cand.after / cand.before) * 100) + "%)", estTokens(text) - estTokens(finalText));
    return { kind: "accept", content: [{ type: "text", text: finalText }] };
```

</details>

**依据 4 · 源码核查**：[src/index.js:271-289](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L271-L289)

去重分支只检查节省字节，不做相同比例/token门槛。

<details>
<summary>查看原文（19行）</summary>

```text
    if (cfg.dedupeEnabled && !isError) {
      var ttl = Object.prototype.hasOwnProperty.call(cfg.dedupeTtlOverrides, exec.name) ? cfg.dedupeTtlOverrides[exec.name] : cfg.dedupeTtlMs
      if (ttl > 0) {
        var fp = dedupeFingerprint(sessionId, exec.name, argsToString(exec.arguments), text)
        var prev = dedupeCache.get(fp)
        var now = Date.now()
        if (prev && now - prev.ts <= ttl) {
          var ref2 = await spillOriginal(text, sessionId, exec.name, exec.callId)
          if (ref2 !== undefined) {
            var did = shortId('d')
            var agoSec = Math.round((now - prev.ts) / 1000)
            var stub = '[save-token #' + did + ' deduped: this ' + exec.name + ' call returned BYTE-IDENTICAL output to a call ' + agoSec + 's ago, which remains in context above. Do not answer from this stub alone; retrieve the earlier message, or re-run if freshness matters. Full copy of THIS call stored at: ' + ref2.locator + '. ' + (ref2.retrievalHint || '') + ']'
            var savedB = utf8Bytes(text) - utf8Bytes(stub)
            if (savedB > cfg.minSavingBytes) {
              rememberOriginal(did, text, ref2.locator)
              comp.dedupeHits++; comp.dedupeSavedBytes += savedB
              rememberCompressed(did, text, stub, exec.name)
              noteRecent('dedupe', exec.name, 'identical output within ' + agoSec + 's -> stubbed', estTokens(text) - estTokens(stub))
              return { kind: 'accept', content: [{ type: 'text', text: stub }] }
```

</details>

**依据 5 · 源码核查**：[src/compress.js:34-37](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L34-L37)

FNV-1a以32位状态输出8位十六进制摘要。

```text
export function fnv1a(s) {
  var h = 0x811c9dc5
  for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0 }
  return ('0000000' + h.toString(16)).slice(-8)
```

**依据 6 · 源码核查**：[src/compress.js:58-60](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L58-L60)

去重键只用摘要不保存全文相等比较。

```text
export function dedupeFingerprint(sessionId, toolName, argsString, content) {
  return (sessionId === undefined ? '(none)' : String(sessionId)) + '|' + toolName + '|' + fnv1a(argsString || '') + '|' + fnv1a(content)
}
```

**依据 7 · 源码核查**：[src/index.js:345-357](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L345-L357)

avoided根据marker对应内存估计相减累计。

<details>
<summary>查看原文（13行）</summary>

```text
  function computeAvoided(messages) {
    var texts = []
    collectTexts(messages, texts, 0)
    var avoided = 0, hits = 0
    for (var i = 0; i < texts.length; i++) {
      MARKER_RE.lastIndex = 0
      var m
      while ((m = MARKER_RE.exec(texts[i])) !== null) {
        var ent = compressedIndex.get(m[1])
        if (ent) { avoided += Math.max(0, ent.o - ent.k); hits++ }
      }
    }
    return { avoided: avoided, hits: hits }
```

</details>

**依据 8 · 源码核查**：[src/index.js:381-414](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L381-L414)

真实usage与校准avoided分别累计，不能直接当净账单收益。

<details>
<summary>查看原文（34行）</summary>

```text
    function observe(chunk) {
      if (chunk && chunk.type === 'usage' && chunk.usage) {
        rec.input += chunk.usage.inputTokens || 0
        var cr = chunk.usage.cacheReadTokens || 0
        var cw = chunk.usage.cacheWriteTokens || 0
        // keep the split visible (cache health sentinel) alongside the sum
        rec.cacheRead += cr; rec.cacheWrite += cw
        rec.cached += cr + cw
        rec.output += chunk.usage.outputTokens || 0
        rec.reasoning += chunk.usage.reasoningTokens || 0
      } else if (chunk && chunk.type === 'finish' && chunk.reason) {
        rec.finish = String(chunk.reason.kind || '')
      }
    }
    function closeRecord() {
      if (rec.closed) return
      rec.closed = true
      rec.ms = Date.now() - rec.ts
      if (fullSid !== undefined) {
        lastEstBySession.set(fullSid, rec.estPrompt)
        // real billed input for the session (main requests only — aux calls
        // see a different context)
        if (rec.kind !== 'aux' && rec.input + rec.cached > 0) lastBilledBySession.set(fullSid, rec.input + rec.cached)
      }
      observeRatio(rec.model, rec.input + rec.cached, rec.estPrompt)
      var ratio = ratioFor(rec.model)
      if (rec.kind === 'aux') totals.auxRequests++; else totals.requests++
      totals.inputTokens += rec.input; totals.cachedTokens += rec.cached
      totals.cacheReadTokens += rec.cacheRead; totals.cacheWriteTokens += rec.cacheWrite
      totals.outputTokens += rec.output; totals.reasoningTokens += rec.reasoning
      // avoided accounting is calibrated by the model's observed est/actual ratio
      totals.avoidedTokens += Math.round(rec.avoided * ratio)
      totals.estPromptTokens += rec.estPrompt
      comp.replays += rec.replayHits
```

</details>

**依据 9 · 源码核查**：[src/index.js:581-590](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L581-L590)

reset清内存统计/正文/去重，不是原件清理。

<details>
<summary>查看原文（10行）</summary>

```text
  function resetAll() {
    totals.requests = 0; totals.auxRequests = 0; totals.inputTokens = 0; totals.cachedTokens = 0
    totals.cacheReadTokens = 0; totals.cacheWriteTokens = 0
    totals.outputTokens = 0; totals.reasoningTokens = 0; totals.avoidedTokens = 0; totals.estPromptTokens = 0
    comp.count = 0; comp.bytesBefore = 0; comp.bytesAfter = 0; comp.dedupeHits = 0; comp.dedupeSavedBytes = 0; comp.replays = 0; comp.losslessEncodes = 0; comp.tabularWindows = 0
    comp.topLevelCalls = 0; comp.nestedCalls = 0
    compactStats.attempts = 0; compactStats.done = 0; compactStats.skipped = 0
    records.length = 0; recent.length = 0; byTool.clear(); compressedIndex.clear(); dedupeCache.clear(); originals.clear()
    startedAt = Date.now()
    return { ok: true }
```

</details>

#### 缺口

- 真实locator长度、模型tokenizer和目标负载的最终替换净量未实测。
  **影响**：不能量化门控失效频率或净费用影响。
  **进一步探讨**：对每次完整finalText记录真实token数、notice开销与后续expand调用，并与原文对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者对照与原始数据能支持什么效果结论？

**研究主题**：效果与总成本、贡献与相对优势、缺陷与关键质疑

#### 完整回答

仓库保存作者两轮小样本A/B记录。本次只读取文件并用独立JSON求和核对第二轮24份记录，没有运行插件、基准或作者分析脚本。r2数据两臂各12集、success字段各12；总token为baseline 4,832,174、treatment 6,669,489，整体增加约38.0%，与作者汇总一致。这个样本没有出现成功率下降，不能提升为“压缩不降低智力”或所有任务无损。每格仅n=2且任务被要求大输出直入上下文，无法外推日常先写文件再读的模式。

报告称删去单个treatment日志离群集后为4,804,927对4,832,174，约-0.6%；这保留baseline全部12集而只留treatment11集，不是同序配对比较。根据summary的对应baseline=123,119和treatment=1,864,562，同删该对后应为baseline 4,709,055与treatment 4,804,927，约+2.0%。这只是删除规则的敏感性算术，不是更正确的效果估计；主结果仍应保留全量。将离群归因于Agent策略也不能靠这组事后观察证明，与压缩预览、展开循环或任务随机性的关系还需实验。

SWE sympy任务报告-19.7%，但压缩事件为0，不能把减少归因到压缩代码；django有触发，仍无足够重复分离机制与策略。r2无损TOON和去重均0触发，因此此实验不能验证这些分支。avoided 560,442是插件估计旁证，不能抵消实际总token上升。缓存命中率接近只说明该样本中统计相近，缺少同价、同时间的实际货币结算，不推导费用一定下降。报告与原件均属作者记录，本次算术核对不验证记录真实性、判定器结果或版本绑定的真实运行。

#### 证据与依据

**依据 1 · 作者声明**：[bench/report_2026-09-03.md:14-33](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/report_2026-09-03.md#L14-L33)

作者同时报告全量+38%、单删离群及小样本策略方差，本文不继承因果和零损伤外推。

<details>
<summary>查看原文（20行）</summary>

```text
6 任务 × 2 臂 × n=2，**24/24 集有效，成功率两臂均 100%（24/24），零无效集**：

- **成功率零损伤再次成立**（两轮合计 48/48 全成功）——这是两轮 A/B 中最稳健的结论。
- **总 Token：treatment 比 baseline 高 +38.0%**（6,669,489 vs 4,832,174）。但该差额被
  **单个离群集主导**：tb-access-logs treatment r1 的 agent 选择了「反复全量打印日志」
  策略（18 步、48 次 marker 回放），单集 1,864,562 tok，占 treatment 臂总量的 28%。
  **剔除这一个集后，treatment = 4,804,927 vs baseline = 4,832,174（−0.6%，基本持平）**。
- **稳定省 Token 的任务**：swe-sympy **−19.7%**（两重复 −10.4%/−28.2% 同向）、
  swe-django **−18.0%**（−21.0%/−13.2% 同向）——长上下文 + 大测试输出场景。
- **缓存命中率（本轮一等指标）：treatment 90.7% vs baseline 90.0%（+0.7pp）**，
  两臂基本一致；最重的 dump 集在反复展开下仍保持 91.1% 命中率（uncached 仅占 8.9%），
  证明 v2.4.1 的 cache-aware marker 回放层在高压场景下**守住了缓存**而非提升缓存。
- **压缩触发 11 次，覆盖 6/12 个 treatment 集**，avoided 估计合计 560,442
  （占触发集 Token 的 13.8%）；无损 TOON 编码触发 0 次（本负载未命中其触发面）。

**给使用者的判据（两轮合并后修正）**：插件的单输出压缩机制有效且零成功率代价，
但 **n=2 下 agent 策略方差可达 ±3~15 倍，远大于压缩收益本身**；聚合 Δ 由策略方差
主导（round-1 的 −17.6% 与本轮的 +38.0% 都是同一噪声的两面）。可靠信号是：
① 成功率不受损；② 长上下文 SWE 型任务两轮平均有小幅净收益；
③ 缓存命中率不受插件影响（±1pp 内）。
```

</details>

**依据 2 · 作者声明**：[bench/report_2026-09-03.md:39-56](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/report_2026-09-03.md#L39-L56)

作者说明6任务、两臂n=2、串行及直出硬约束，限定泛化范围。

<details>
<summary>查看原文（18行）</summary>

```text
- **任务集**（6 任务锁定，同 round-1）：
  - GAIA L2 `54612da3`（locomotives，xlsx 附件，金标 60）
  - GAIA L2 `c61d22de`（arxiv-regulation，多跳 web，金标 egalitarian）
  - Terminal-Bench `analyze-access-logs`（300KB 日志直出）
  - Terminal-Bench `jsonl-aggregator`（5×200k 记录聚合）
  - SWE-bench-Verified `sympy__sympy-24562`（base `b1cb676`）
  - SWE-bench-Verified `django__django-16595`（base `f9fe062`）
- **臂**：baseline = compress/dedupe/compactAssist 全关；treatment = 全开。
  expand 工具两臂恒注册（对称）。每格 n=2，**完全串行**，每集发射前
  POST /reset（清仪表与去重缓存）。
- **行为条件**：两臂对称施加与 round-1 相同的 HARD CONSTRAINTS
  （禁文件重定向、禁 read 批量查看、测试输出必须可见），保持「大输出直出」区间。
- **计量**：每集独立会话（projcache 键 = subagent id，发射时验证），
  四桶真值 + 本轮新增缓存命中率（ΣcacheRead / Σ输入三桶）；
  插件侧 ce/dedupe/lossless/replays/avoided 作为触发面旁证。
- **缓存命中率口径（本轮新增）**：按臂聚合 = ΣcacheRead / Σ(uncachedInput+cacheRead+cacheWrite)，
  与 DSH 原生计费一致；单集命中率另列。v2.4.1 的 cache-aware 层（P3）以「提高缓存命中、
  降低 uncached 重放」为优化假设之一，本指标直接检验该假设。
```

</details>

**依据 3 · 作者声明**：[bench/results/summary-r2.md:30-35](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/results/summary-r2.md#L30-L35)

固定汇总给出两臂总量与成功字段，独立读取24份JSON求和与其一致。

```text
## 二、总体

- **baseline**: n=12, SR=100.0% (12/12), 总Token=4,832,174 (in=4,740,223, out=91,951), **命中率=90.0%**, P50=216,110, P90=1,027,606, ceΣ=0, avoidedΣ=0, replaysΣ=0, losslessΣ=0, 触发集=0/12
- **treatment**: n=12, SR=100.0% (12/12), 总Token=6,669,489 (in=6,572,096, out=97,393), **命中率=90.7%**, P50=488,134, P90=940,733, ceΣ=11, avoidedΣ=560,442, replaysΣ=106, losslessΣ=0, 触发集=6/12

**Δ总Token(treatment−baseline): +1,837,315 (+38.0%); ΔSR: +0.0pp; Δ命中率: +0.7pp**
```

**依据 4 · 作者声明**：[bench/results/summary-r2.md:44-58](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/results/summary-r2.md#L44-L58)

同序配对表给出离群集对应baseline与treatment，支撑对称删除算术。

<details>
<summary>查看原文（15行）</summary>

```text
| 任务 | r | baseline | treatment | Δ | Δ% | baseline命中率 | treatment命中率 |
|---|---|---|---|---|---|---|---|
| gaia-l2-locomotives | 1 | 135,636 | 78,346 | -57,290 | -42.2% | 71.9% | 60.7% |
| gaia-l2-locomotives | 2 | 148,133 | 494,058 | +345,925 | +233.5% | 89.6% | 92.2% |
| gaia-l2-arxiv-regulation | 1 | 400,359 | 482,209 | +81,850 | +20.4% | 83.7% | 93.0% |
| gaia-l2-arxiv-regulation | 2 | 284,086 | 505,236 | +221,150 | +77.8% | 84.7% | 87.8% |
| tb-access-logs | 1 | 123,119 | 1,864,562 | +1,741,443 | +1414.4% | 73.8% | 91.1% |
| tb-access-logs | 2 | 120,957 | 262,806 | +141,849 | +117.3% | 73.8% | 80.5% |
| tb-jsonl-aggregator | 1 | 123,758 | 150,519 | +26,761 | +21.6% | 75.0% | 77.1% |
| tb-jsonl-aggregator | 2 | 129,379 | 107,479 | -21,900 | -16.9% | 72.8% | 67.4% |
| swe-sympy-24562 | 1 | 1,063,509 | 953,202 | -110,307 | -10.4% | 95.3% | 94.8% |
| swe-sympy-24562 | 2 | 1,154,017 | 828,510 | -325,507 | -28.2% | 95.6% | 93.8% |
| swe-django-16595 | 1 | 704,481 | 556,564 | -147,917 | -21.0% | 93.0% | 92.9% |
| swe-django-16595 | 2 | 444,740 | 385,998 | -58,742 | -13.2% | 90.0% | 91.7% |
| **Σ** | — | **4,832,174** | **6,669,489** | **+1,837,315** | **+38.0%** | — | — |
```

</details>

**依据 5 · 作者声明**：[bench/results/raw2/tb-tb-access-logs-baseline-r1.json:7-21](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/results/raw2/tb-tb-access-logs-baseline-r1.json#L7-L21)

该对baseline原记录token=123119。

<details>
<summary>查看原文（15行）</summary>

```text
 "usage": {
  "uncachedInputTokens": 31664,
  "outputTokens": 2047,
  "cacheReadTokens": 89408,
  "cacheWriteTokens": 0
 },
 "steps": 6,
 "turns": 1,
 "llmMs": 73377,
 "toolMs": 126,
 "settledMs": 73708,
 "success": 1,
 "note": "official TB tests",
 "missing_fields": [],
 "usageTotalTokens": 123119,
```

</details>

**依据 6 · 作者声明**：[bench/results/raw2/tb-tb-access-logs-treatment-r1.json:7-28](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/results/raw2/tb-tb-access-logs-treatment-r1.json#L7-L28)

该对treatment原记录token=1864562、18步及4次压缩。

<details>
<summary>查看原文（22行）</summary>

```text
 "usage": {
  "uncachedInputTokens": 165165,
  "outputTokens": 7045,
  "cacheReadTokens": 1692352,
  "cacheWriteTokens": 0
 },
 "steps": 18,
 "turns": 1,
 "llmMs": 247750,
 "toolMs": 485,
 "settledMs": 248674,
 "success": 1,
 "note": "official TB tests; dump-heavy strategy, replays=48",
 "missing_fields": [],
 "usageTotalTokens": 1864562,
 "plugin": {
  "compressionEvents": 4,
  "dedupeHits": 0,
  "dedupeSavedBytes": 0,
  "losslessEncodes": 0,
  "tabularWindows": 0,
  "replays": 48,
```

</details>

**依据 7 · 作者声明**：[bench/report_2026-09-03.md:105-130](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/report_2026-09-03.md#L105-L130)

sympy没有压缩事件，TOON和去重也未触发，不能由该A/B验证这些分支。

<details>
<summary>查看原文（26行）</summary>

```text
| 任务 | baseline | treatment | Δ | ce | 解读 |
|---|---|---|---|---|---|
| swe-sympy-24562 | 2,217,526 | 1,781,712 | **−19.7%** | 0 | 两重复同向节省（−10.4%/−28.2%）；pytest 摘要输出未过 1400B 阈值，ce=0，节省来自更少的重复读取步 |
| swe-django-16595 | 1,149,221 | 942,562 | **−18.0%** | 2 | 两重复同向（−21.0%/−13.2%）；大迁移测试输出被压，avoided 49,987 |
| tb-jsonl-aggregator | 253,137 | 257,998 | +1.9% | 0 | 校验输出天然小于阈值，未触发（与 round-1 一致） |
| gaia-l2-locomotives | 283,769 | 572,404 | +101.7% | 0 | r1 省 42%，r2 因 agent 联网核对 GAIA 答案键多花 3.3 倍——纯策略方差 |
| gaia-l2-arxiv-regulation | 684,445 | 987,445 | +44.3% | 4 | treatment 集做了更深的验证（e-print 图 PDF 解码等），avoided 31,680 被方差淹没 |
| tb-access-logs | 244,076 | 2,127,368 | +771.6% | 5 | r1 离群集（反复全量 dump + 48 次回放）占差额的 92%；r2 紧凑路径 +117% |

### 缓存命中率（本轮新增口径）

- **按臂聚合：baseline 90.0% vs treatment 90.7%** —— 插件对缓存命中整体中性（+0.7pp）。
- 分层看：压缩触发集命中率 90.6%，未触发集 90.8%，baseline 90.0% —— 三者几乎重合。
- 最重压场景（tb-access-logs r1，1.86M tok，48 次 marker 回放）仍保持 **91.1%** 命中率，
  uncached 输入仅 8.9% —— cache-aware 回放层把「压缩桩跨请求重注入」做成了缓存友好的
  稳定前缀，避免了无压缩时可能出现的 uncached 放大。
- SWE 长上下文任务两臂都在 92–95.6% 区间，插件未改变其缓存行为。
- 跨轮对比：round-1 baseline 86.9% / treatment 91.2%；本轮 90.0% / 90.7% ——
  两轮、两臂全部落在 87–91% 窄带内，**缓存命中率是该插件影响最小的指标**。

### 触发分层（treatment 臂内）

- 触发集（ce>0）：n=6，总 4,057,375 tok，avoided 560,442（占其 13.8%），命中率 90.6%
- 未触发集（ce=0）：n=6，总 2,612,114 tok，命中率 90.8%
- 无损 TOON 编码：**0 次触发**（本组负载无满足其触发面的输出形态——与实现侧确认的
  触发条件一致，非缺陷）；去重命中：0 次（串行 + 每集 reset 清指纹，符合预期）。
```

</details>

#### 缺口

- 作者记录没有被本次独立重放，且少量重复不能确定收益因果及质量代价。
  **影响**：只能报告样本结果与算术一致性，不能给出生产节省率或可靠性承诺。
  **进一步探讨**：预先固定全量与配对分析方法，在更多同类任务中记录质量、真实分桶账单和恢复动作，再做独立复现。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 接入、持续和恢复代价如何影响采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

启动需要DSH web profile提供tools、webServer、客户端React及slot；package未绑定明确DSH版本，宿主接口兼容要单独核对。spillStore缺失或不能保存则压缩保持关闭，不意味着没有插件计量/界面开销；compaction可选且默认关闭，不能照旧段落把120k触发视为默认持续功能。配置窗口可选contextWindowTokens×ratio，未知时才用绝对水位。默认去重600秒，read/expand/嵌套工具绕过，目标负载必须先确认。

首次投入是安装重启、检查原件可读、类型与长输出恢复；持续投入是额外CPU扫描/哈希、原件磁盘存储、模型读notice与展开调用、宿主兼容维护；失败时要定位原件、重建丢失的id映射及重做受误导任务。现金与人工时间没有本次计量，避免把工具输出字节或avoided估计折算成费用节省。通知/长locator门控和恢复限制可能抵消局部节省。

当前建议观察。熟悉DSH且可保留原文者可研究大输出压缩行为，但应先验证Q02和Q03的核心不变量；类型精确数据或无法承担缺失细节的任务不应默认开启。退出可关闭压缩/去重/压缩辅助开关并重启或移除bundle；这不会还原会话里已替换的历史文本，也不清理spill原件。先保留notice和文件定位完成必要恢复，再按宿主保留策略清理，不把仪表reset当删除或回滚。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:66-75](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L66-L75)

宿主tools模块与两项注入服务是实际依赖。

<details>
<summary>查看原文（10行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools'
import {
  utf8Bytes, estTokens, fmtInt,
  argsToString, dedupeFingerprint,
  buildCandidate, buildNotice, effectiveMinBytes
} from './compress.js'

export const name = 'save-token'

export const inject = ['tools', 'webServer']
```

</details>

**依据 2 · 源码核查**：[src/index.js:79-107](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L79-L107)

默认开关、水位、600秒去重与配置覆盖。

<details>
<summary>查看原文（29行）</summary>

```text
  var cfg = {
    compressEnabled: true,
    dedupeEnabled: true,
    minBytes: 1400,
    errorMinBytes: 6000,
    minSavingBytes: 500,
    keepRatioMax: 0.72,
    maxLines: 240,
    headLines: 140,
    tailLines: 80,
    tabularHeadRows: 60,
    tabularTailRows: 40,
    tabularStrideSamples: 50,
    longLineChars: 420,
    jsonMaxParseBytes: 524288,
    jsonlMinLines: 8,
    noticeFullTrailerCount: 3,
    dedupeTtlMs: 600000,
    dedupeTtlOverrides: {},
    compactAssistEnabled: false,
    compactBudgetTokens: 120000,
    compactCooldownMs: 600000,
    contextWindowTokens: 0,
    compactWatermarkRatio: 0.85
  }
  if (config && typeof config === 'object') {
    for (var ck in cfg) {
      if (Object.prototype.hasOwnProperty.call(config, ck) && config[ck] !== undefined) cfg[ck] = config[ck]
    }
```

</details>

**依据 3 · 源码核查**：[src/index.js:226-240](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L226-L240)

缺spill或存储失败不压缩，但非卸载插件。

<details>
<summary>查看原文（15行）</summary>

```text
  async function spillOriginal(text, sessionId, toolName, callId) {
    var store = ctx.get('spillStore')
    spillAvailable = store !== undefined
    if (store === undefined) { lastSkip = 'no spillStore backend: reversibility guaranteed, so compression stays off'; return undefined }
    if (sessionId === undefined) { lastSkip = 'no owning session'; return undefined }
    try {
      var ref = await store.saveText({
        owner: { sessionId: sessionId },
        source: { toolName: toolName, callId: callId, label: 'result' },
        suggestedName: toolName + '.txt',
        content: text
      })
      if (!ref || typeof ref.locator !== 'string') { lastSkip = 'spill ref had no locator'; return undefined }
      return ref
    } catch (e) { lastSkip = 'spill save failed: ' + String(e); return undefined }
```

</details>

**依据 4 · 源码核查**：[src/index.js:431-455](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L431-L455)

原生压缩辅助实际调用及开关条件。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.on('agent/pre-step', async function (payload, next) {
    try {
      var sid = payload.agent && payload.agent.session ? String(payload.agent.session.header.id) : undefined
      if (sid !== undefined && cfg.compactAssistEnabled) {
        // real billed input is the truth; the heuristic estimate only covers
        // the very first request of a session
        var actual = lastBilledBySession.get(sid) || 0
        var est = lastEstBySession.get(sid) || 0
        var level = actual > 0 ? actual : est
        var watermark = compactWatermark()
        var lastAt = lastCompactAt.get(sid) || 0
        var now = Date.now()
        if (watermark > 0 && level > watermark && now - lastAt > cfg.compactCooldownMs) {
          var cs = ctx.get('compaction')
          if (cs !== undefined && typeof cs.compactIfNeeded === 'function') {
            lastCompactAt.set(sid, now)
            compactStats.attempts++
            var res = await cs.compactIfNeeded(payload.agent, 'pressure', payload.signal)
            if (res !== undefined && res !== null) { compactStats.done++; noteRecent('compact', payload.agent.options && payload.agent.options.model ? payload.agent.options.model : 'session', 'context ~' + fmtInt(level) + ' tok > watermark ' + fmtInt(watermark) + ' -> compaction applied', 0) }
            else { compactStats.skipped++; noteRecent('compact', 'policy', 'pressure reported at ~' + fmtInt(level) + ' tok; engine declined (no-op)', 0) }
          }
        }
      }
    } catch (e) { console.error('save-token: compaction assist failed (non-fatal)', e) }
    return next()
```

</details>

**依据 5 · 源码核查**：[src/index.js:571-590](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L571-L590)

开关与reset只改内存，不能撤销历史文本或清spill。

<details>
<summary>查看原文（20行）</summary>

```text
  function setEnabled(args) {
    var a = args || {}
    if (a.key === 'compress') cfg.compressEnabled = !!a.value
    else if (a.key === 'dedupe') cfg.dedupeEnabled = !!a.value
    else if (a.key === 'compactAssist') cfg.compactAssistEnabled = !!a.value
    else return { ok: false }
    noteRecent('config', a.key, (a.value ? 'enabled' : 'disabled'), 0)
    return { ok: true, flags: { compress: cfg.compressEnabled, dedupe: cfg.dedupeEnabled, expandTool: true } }
  }

  function resetAll() {
    totals.requests = 0; totals.auxRequests = 0; totals.inputTokens = 0; totals.cachedTokens = 0
    totals.cacheReadTokens = 0; totals.cacheWriteTokens = 0
    totals.outputTokens = 0; totals.reasoningTokens = 0; totals.avoidedTokens = 0; totals.estPromptTokens = 0
    comp.count = 0; comp.bytesBefore = 0; comp.bytesAfter = 0; comp.dedupeHits = 0; comp.dedupeSavedBytes = 0; comp.replays = 0; comp.losslessEncodes = 0; comp.tabularWindows = 0
    comp.topLevelCalls = 0; comp.nestedCalls = 0
    compactStats.attempts = 0; compactStats.done = 0; compactStats.skipped = 0
    records.length = 0; recent.length = 0; byTool.clear(); compressedIndex.clear(); dedupeCache.clear(); originals.clear()
    startedAt = Date.now()
    return { ok: true }
```

</details>

**依据 6 · 作者声明**：[README.md:108-132](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/README.md#L108-L132)

作者安装、重启、移除与GUI使用说明，非本次验收。

<details>
<summary>查看原文（25行）</summary>

````text
## Installation & usage

**Requirements**: a running DeepSeek Harness (dsh) with its Web GUI, and `pnpm` on PATH. The web profile provides everything else the plugin needs (`tools`, `webServer`, React for the dashboard; `spillStore` is included in standard deployments — if it is ever missing, compression stays off by design).

### Install

Run **one** of these commands — `dsh plugin` installs the package into the profile and activates its bundle layer automatically:

```bash
# from the npm registry
dsh plugin --profile web add dsh-plugin-save-token

# or straight from GitHub
dsh plugin --profile web add github:vibe-any/dsh-plugin-save-token

# or from a local checkout
dsh plugin --profile web add /absolute/path/to/dsh-plugin-save-token
```

That's the whole installation: no prompts to paste into the GUI, no dynamic-code authorization dialogs. Verify it's in the roster with `dsh --profile web --dump-config | grep save-token`, then restart the running dsh instance (ESM caches are per-process).

Removal: `dsh plugin --profile web remove dsh-plugin-save-token`.

### Using it

````

</details>

#### 缺口

- 宿主原件保留、兼容、全周期恢复工时和真实费用未核实。
  **影响**：无法确认总负担能被净收益覆盖，不支持持续采用推荐。
  **进一步探讨**：在可丢弃会话记录首次配置、正常使用、索引淘汰、重启和退出的全部投入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 从限制能提出什么可证伪设计？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02类型与恢复缺口、Q03最终门控及Q04净效果不稳，可提出未验证设计假设：把压缩视为带恢复契约的最终消息变换，只有完整message（含notice和locator）通过真实token与字节门控、无损编码通过类型往返校验、原件读取可达才替换；去重命中后再核对原文，展开只在确实完整时声称FULL ORIGINAL。短id索引如需跨重启，应由宿主持久保存并带会话授权，而非内存Map冒充持久。

最小验证先用固定资料而非真实敏感输出：数值/数字字符串/null/同名字符串的往返、很长locator、超过262144字符的原文、索引淘汰和进程重启、摘要命中但全文不同。成功判据是最终消息实际更小、类型完全一致、完整原文一次可取或明确返回非完整状态、假去重不成立。任何一项失败就不满足替换条件。之后再用预注册同任务配对实验，计入检索与恢复调用以及质量损失；若局部门控通过但全任务账单或合格率变差，则不能宣称该设计足以提高采用价值。该方案是未来假设，不计入当前创新或能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/compress.js:63-66](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L63-L66)

类型丢失是往返类型验证的直接线索。

```text
export function csvCell(v) {
  var s = String(v)
  if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"'
  return s
```

**依据 2 · 源码核查**：[src/compress.js:564-572](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/compress.js#L564-L572)

候选门控需要扩展到最终消息的依据。

```text
function gate(route, text, cfg) {
  if (!route) return null
  var candidate = route.text
  if (!candidate || candidate.length < 20) return null
  var before = utf8Bytes(text), after = utf8Bytes(candidate)
  if (after > before * cfg.keepRatioMax) return null
  if (before - after < cfg.minSavingBytes) return null
  if (estTokens(candidate) >= estTokens(text)) return null
  return { text: candidate, before: before, after: after, lossless: route.lossless === true, strategy: route.strategy, stats: route.stats }
```

**依据 3 · 源码核查**：[src/index.js:195-208](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L195-L208)

缓存正文截断与内存索引为持久完整恢复假设的推导材料。

<details>
<summary>查看原文（14行）</summary>

```text
  function rememberOriginal(id, text, locator) {
    var truncated = text.length > 262144
    originals.set(id, { text: truncated ? text.slice(0, 262144) : text, locator: locator, truncated: truncated, ts: Date.now() })
    // small side index: id -> locator survives original-text eviction, so the
    // expand tool can still point at the spill file after a restart window
    locatorIndex.set(id, { locator: locator, ts: Date.now() })
    if (locatorIndex.size > 4000) {
      var dropL = locatorIndex.keys()
      while (locatorIndex.size > 3200) { var lx = dropL.next(); if (lx.done) break; locatorIndex.delete(lx.value) }
    }
    if (originals.size > 160) {
      var it = originals.keys()
      while (originals.size > 120) { var nx = it.next(); if (nx.done) break; originals.delete(nx.value) }
    }
```

</details>

**依据 4 · 源码核查**：[src/index.js:465-494](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/src/index.js#L465-L494)

展开成功正文与截短状态的显示未闭合。

<details>
<summary>查看原文（30行）</summary>

```text
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: function (args, value) {
        var t = value && typeof value.text === 'string' && value.text.length > 0 ? value.text : String((value && value.error) || 'not found')
        return [{ type: 'text', text: t }]
      }
    },
    execute: function (args) {
      var key = args && typeof args.id === 'string' ? args.id.trim() : ''
      var ent = originals.get(key)
      if (ent) return Promise.resolve({ text: ent.text, locator: ent.locator, truncated: ent.truncated === true })
      // miss: the id expired from the text cache (eviction or restart) but
      // the spill file persists — hand back the locator instead of a dead
      // end, and use a spillStore read API transparently when one exists
      var loc = locatorIndex.get(key)
      function locatorFallback() {
        return { error: 'expired id. The FULL ORIGINAL is still stored at: ' + loc.locator + '. Use the read tool on that path.', locator: loc.locator }
      }
      if (loc) {
        var store = ctx.get('spillStore')
        if (store && typeof store.readText === 'function') {
          return store.readText({ locator: loc.locator }).then(function (out) {
            var t = out && (typeof out.text === 'string' && out.text.length > 0 ? out.text : (typeof out === 'string' && out.length > 0 ? out : null))
            if (t) return { text: t, locator: loc.locator, truncated: false }
            return locatorFallback()
          }, function () { return locatorFallback() })
        }
        return Promise.resolve(locatorFallback())
      }
      return Promise.resolve({ error: 'unknown or expired id. Find the FULL ORIGINAL path printed inside the original [save-token #...] notice and use the read tool on that path.' })
```

</details>

**依据 5 · 作者声明**：[bench/results/summary-r2.md:30-35](https://github.com/vibe-any/dsh-plugin-save-token/blob/eb85c421758e56d6a1ae8c87dd10f0d38e621559/bench/results/summary-r2.md#L30-L35)

全量总量上升说明局部avoided不够，需要全任务对照。

```text
## 二、总体

- **baseline**: n=12, SR=100.0% (12/12), 总Token=4,832,174 (in=4,740,223, out=91,951), **命中率=90.0%**, P50=216,110, P90=1,027,606, ceΣ=0, avoidedΣ=0, replaysΣ=0, losslessΣ=0, 触发集=0/12
- **treatment**: n=12, SR=100.0% (12/12), 总Token=6,669,489 (in=6,572,096, out=97,393), **命中率=90.7%**, P50=488,134, P90=940,733, ceΣ=11, avoidedΣ=560,442, replaysΣ=106, losslessΣ=0, 触发集=6/12

**Δ总Token(treatment−baseline): +1,837,315 (+38.0%); ΔSR: +0.0pp; Δ命中率: +0.7pp**
```

#### 缺口

- 该契约尚未实现，真实token计数、持久索引及授权会增加资源和维护成本。
  **影响**：正确性修补不自动等于净成本更低，仍需任务层结果。
  **进一步探讨**：先验证变换不变量，再比较全任务质量、费用和恢复投入，并检查新增开销是否抵消节省。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
