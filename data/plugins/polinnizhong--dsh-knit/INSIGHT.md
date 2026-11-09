# Knit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6c8c91a](https://github.com/PolinniZhong/dsh-knit/tree/6c8c91a198efbcce1f4fae034e24f0b575f0b034)

<!-- BEGIN META -->
[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PolinniZhong/dsh-knit) [![npm 30d 3,757](https://img.shields.io/static/v1?label=npm+30d&message=3%2C757&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knit) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knit)
<!-- END META -->

> **功能**：为 DSH 提供按任务检索工作区文档与代码、展示命中理由和来源的侧栏及模型工具。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 把文档与代码的任务检索、分层和行号接入 DSH，让结果可按理由回到原文。

> **主要限制**：[Q03](#research-q03) 缺失可能由扫描预算或类型造成。混合可发送原查询和摘要，且纯语义项只能追加在相关层。面板的预览词法范围不足以证明符号链接边界。

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
  - [Q01 · 哪类项目检索需要 Knit？](#detail-section-11)
  - [Q02 · 工具怎样定位范围、召回和返回文档？](#detail-section-12)
  - [Q03 · 命中、缺失和可选语义外发边界是什么？](#detail-section-13)
  - [Q04 · 启动、存储、索引和服务依赖是什么？](#detail-section-14)
  - [Q05 · 怎样对照文件检索的实际收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个文档与源码的 DSH 用户需要为当前任务定位可回读的关键文件和行号。[Q01](#research-q01)

rg 适用于已知标识符，文件树适用于已知路径，宽泛任务通常要手工组合若干查询和文档。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地词法 | 任务文档与代码排序 | 支持类型及预算有限 |
| Context Pack | 分层、理由和行号 | 需回读验证 |
| 可选混合 | 补充少量相关候选 | 有查询与摘要外发 |
| 面板预览 | 打开文件和配置 | 回环和路径边界须核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容 DSH 与 Node | 插件需要 | 挂模型工具与 UI | 手工检索 |
| 有效会话 cwd 与支持的项目文件 | 工具需要 | 候选排序 | 报错或无结果 |
| Web 和 sessions | 面板需要 | 预览与范围 | 使用受控模型工具 |
| 批准的向量服务 | 混合模式才需 | 额外候选 | 默认词法 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者用合成工作区标参考 | 默认词法并检查路径 |
| 检索 | 比较 Knit 与手工搜索 | 原文行号和理由可回读 |
| 负向 | 验证缺工作区、预算、排除和链接 | 确认范围及退出条件 |
| 退出 | 停用并核对存储 | 回到 rg 或原生树 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 相容宿主和本地项目副本 | 配置工具和参考 | 安装未测 |
| 持续 | 扫描、缓存和可选向量服务 | 检查引用 | 实际耗时未知 |
| 失败恢复 | 索引、日志与重新检索 | 回查文件和可能的网络 | 回退仍可能已经出站 |
| 退出 | 保留必要配置和对照 | 停用并检查索引 | 存储与网络状态需另查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 任务文件定位 | 工作区、排序、分层和片段 | 真实召回和省时 |
| 混合模式 | 有界候选、失败退词法 | 真实提供商收益 |
| 存储 | 可独立持久化索引及配置 | 真实更新与清理 |

> **思考**：[Q03](#research-q03) 缺失可能由扫描预算或类型造成。混合可发送原查询和摘要，且纯语义项只能追加在相关层。面板的预览词法范围不足以证明符号链接边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 把文档与代码的任务检索、分层和行号接入 DSH，让结果可按理由回到原文。

[Q02](#research-q02) 可信会话 cwd、扫描、排序和分层分离。[Q03](#research-q03) 语义补充、回退及直接预览边界分别可检验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 缺失可能由扫描预算或类型造成。混合可发送原查询和摘要，且纯语义项只能追加在相关层。面板的预览词法范围不足以证明符号链接边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 只在可信合成目录做词法试用。核对候选、来源、原文和负向路径；实际输出越界即停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地检索、分层、路径片段和可选混合外发。真实召回、性能和预览访问边界未验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.js、src/client/client.js、src/host/tool.js、src/host/semantic.js、src/host/context.js、docs/evaluations/hybrid-retrieval.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次固定根 DSH 插件源码，聚焦 knit_docs、代表 Web 预览及混合。未运行目标和真实服务，未审计全部 Git、媒体及文件入口。
- 下一步：[Q05](#research-q05) 固定目标文件与行号，测检索前列、失效、排除、出界链接及混合报文。

**分析版本**

- **仓库**：[PolinniZhong/dsh-knit](https://github.com/PolinniZhong/dsh-knit)
- **版本号**：0.25.0（[固定提交 6c8c91a](https://github.com/PolinniZhong/dsh-knit/tree/6c8c91a198efbcce1f4fae034e24f0b575f0b034)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用预先标注的任务比较有理由的结果与手工搜索，若减少打开次数并维持原文可核对性，才说明交接有增量。

[Q05](#research-q05) 固定目标文件与行号，测检索前列、失效、排除、出界链接及混合报文。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 7967 | — | — | 140030 |
| .js | source | 16 | 17790 | 9668 | 7229 | — |
| .mjs | test | 45 | 23812 | 17605 | 4000 | — |
| .mjs | source | 20 | 6141 | 4135 | 1586 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-knit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-knit/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PolinniZhong/dsh-knit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何用 DSH 工具检索项目上下文，索引、引用与可选外发怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类项目检索需要 Knit？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护文档和代码较多的项目时，开发者与 Agent 可按当前任务找最相关几篇，验收要能按路径、理由和行号回读。rg 可以快速命中明确标识符，原生树适合已知路径；Knit 把较松散任务、文档和代码放在同一候选排序，并生成分层 Context Pack。根包实际提供 DSH Host 工具和可选浏览器侧栏。小项目或已知文件时手工搜索更直接。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-85](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/README.md#L69-L85)

作者陈述使用场景和排序动机。

<details>
<summary>查看原文（17行）</summary>

```text
## 为什么需要它

> Agent 一天产出 20 篇文档，你找不到刚才那篇。

这是它最开始要解决的问题：**产出速度超过了人翻目录的速度**。
DSH 自带的「最近文件」只记你点开过什么；一轮对话结束，前面那几篇就沉下去了。

Knit 换了个问法：**不看「谁新」，看「和现在这件事有多相关」**。
它扫的是**整个工作区**（不是这一轮生成的那几篇），按你正在聊的内容排序 ——
重启 DSH、换会话、跨天回来，它都还在。

后来问题往前长了一步：真要动一个功能时，最该先看的往往不是文档，而是**那几行源码**。
v0.19 起代码进了同一条链路。再往后，「排在前面」也不够用了 ——
**排出来的那些，agent 到底读了没有？读完改过没有？** v0.15–v0.18 补的就是这一层。

三句话：**找到**（扫全工作区、按当前任务排序）→ **组织**（主要 / 辅助 / 相关三层 + 每条的理由）
→ **追踪**（读了没有、读完变了没有）。
```

</details>

**依据 2 · 作者声明**：[README.md:438-450](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/README.md#L438-L450)

作者描述工具、分层及关系。

<details>
<summary>查看原文（13行）</summary>

```text
## 也给 agent 用：`knit_docs` 工具

同一份排序，除了给你看，也开了一个口子给模型。

装好之后，agent 的工具列表里会多一个 `knit_docs`：它可以问
「这个项目里跟当前话题最相关的文档是哪几篇」，拿回**同一个 Context Pack** ——
`primary` / `supporting` / `related` 三层，每项带路径 + 标题 + 摘要 +
**结构化理由**（`direct` / `summaryMatch` / `bodyMatch` / `linkTarget` / `linkSource` / `related`）
+ **项目角色**（`impl` / `test` / `config` / `design` / `doc`）+
+ **来源三值**（`provenance`：`retrieval` / `relation` / `manual`）+ **最多 2 条关系**
（`relations: references ← docs/x.md:12; imports → src/y.js:3`，`←` 是对方提到本条目）+ 被固定的条目在
`pinned` 分区里、被排除的条目完全不出现（v0.21）+
命中的那一小段原文**和它的行号区间**（`match: lines 147–163 — …`），再用它自己的 `read` 打开其中一篇。
```

</details>

**依据 3 · 源码核查**：[package.json:2-11](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/package.json#L2-L11)

实际 Host 和客户端导出。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "dsh-knit",
  "version": "0.25.0",
  "type": "module",
  "description": "Context retrieval for DeepSeek Harness: ranks docs, code and media by relevance into a sidebar Context Pack. Lexical and fully local by default. Hybrid is off until you configure a provider; it sends your query and file titles/summaries, not bodies.",
  "main": "./src/host/index.js",
  "exports": {
    ".": "./src/host/index.js",
    "./client": "./src/client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 4 · 源码核查**：[src/host/index.js:3354-3362](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L3354-L3362)

实际注册工具入口。

```text
  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.effect(
      // v0.15：多注入一个 `auditBridge` —— `knit_docs` 的 `audit: true` 走它拿
      // 「上一份包之后发生了什么」，并把这次交出的包记成新快照。
      () => registerKnitDocsTool(toolCtx, scan, readDocument, buildContextFor, auditBridge),
      'dsh-knit: knit_docs tool',
    )
    console.log(`[${name}] agent tool ready: knit_docs`)
  })
```

**依据 5 · 源码核查**：[src/client/client.js:7466-7475](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/client/client.js#L7466-L7475)

侧栏插槽接线。

<details>
<summary>查看原文（10行）</summary>

```text
        srCtx.effect(() => srCtx.slots.inject('sidebar.right.pane.tab', () => srCtx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: TAB_ID,
        }, OfficialTabBody)), 'dsh-knit: sidebar-right body')

        srCtx.effect(() => srCtx.slots.inject('sidebar.right.pane.tab.title', () => srCtx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: TAB_ID,
        }, KnitTitle)), 'dsh-knit: sidebar.right title')

```

</details>

#### 缺口

- 实际项目命中率与节时未知。
  **影响**：排序可能增加不相关项。
  **进一步探讨**：固定一个任务集合与 rg/原生树比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具怎样定位范围、召回和返回文档？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host apply 在 tools 服务下注册 `knit_docs`。执行只从 Agent session header 读取 cwd 和 id，缺 cwd 拒绝。读取显式查询或会话关键词，默认词法，合并 Markdown 与支持的代码，不纳入媒体。先扫描再去掉用户排除项，相关排序前补正文并以 BM25 排序，为有限的前排条目抽命中片段。工具用完整排序装配三层并裁剪关系、返回行号；没有有效词时会回最近修改列表。审计只在显式启用时尝试记上下文，失败不阻断。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tool.js:928-930](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L928-L930)

工具真正挂入注册表。

```text
export function registerKnitDocsTool(ctx, scan, read, contextFor, audit) {
  return ctx.tools.register(knitDocsDefinition(scan, read, contextFor, audit))
}
```

**依据 2 · 源码核查**：[src/host/tool.js:350-355](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L350-L355)

范围来自可信调用 Agent header。

```text
export function agentScope(exec) {
  const session = exec && exec.agent ? exec.agent.session : undefined
  const header = session && session.header ? session.header : undefined
  const root = header && typeof header.cwd === 'string' ? header.cwd : ''
  const sessionId = header && typeof header.id === 'string' ? header.id : ''
  return { root, sessionId, session }
```

**依据 3 · 源码核查**：[src/host/tool.js:738-766](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L738-L766)

无工作区错误，默认词法与工具候选档。

<details>
<summary>查看原文（29行）</summary>

```text
    async execute(args, exec) {
      const { root, sessionId, session } = agentScope(exec)

      // 拿不到会话就**报错，不兜底**。HTTP 路由那条路会兜底 process.cwd()，
      // 因为它要兼容不带 sessionId 的老客户端；工具没有这个包袱 ——
      // 兜底到「DSH 进程的 cwd」只会扫到一个不相干的项目并返回它的文档。
      // 宁可报错，也不要返回错的东西。
      if (!root) throw new Error(`${TOOL_NAME} requires an owning agent session with a workspace root`)

      const query = typeof (args && args.query) === 'string' ? args.query.trim() : ''
      const limit = clampLimit(args && args.limit)
      // v0.15：审计是**显式**的（默认 false）。不传它就完全不走 feedback 那条路。
      const auditRequested = !!(args && args.audit === true)

      // v0.23：`retrieval` 默认 `lexical`（老调用方一个字都不用改）。
      const retrieval = args && args.retrieval === 'hybrid' ? 'hybrid' : 'lexical'

      const payload = await scan(root, limit, {
        session,
        sessionId,
        sort: 'relevance',
        query,
        retrieval,
        // v0.19：工具的语料是**文档 + 代码**（不给 HTTP 的 `context` 档）。
        // 这一条正是本次版本的核心主张：代码和 Markdown 在**同一套 BM25、同一套分层**
        // 里竞争，谁进 Primary 只由任务检索决定，没人给代码留座位。
        // 媒体不进 —— 图片/视频没有可检索的正文，进上下文只会稀释（v0.18 起如此）。
        kind: 'context',
      })
```

</details>

**依据 4 · 源码核查**：[src/host/index.js:1713-1729](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L1713-L1729)

按查询或会话回退时间序。

<details>
<summary>查看原文（17行）</summary>

```text
    const explicitQuery = typeof options.query === 'string' ? options.query.trim() : ''
    if (explicitQuery) {
      keywords = extractKeywords([explicitQuery], 30)
      // v0.23：语义那一层要的是**原话**，不是抽完的碎片（见 `semanticPassFor()` 的注释）。
      queryText = explicitQuery
    } else {
      const conv = conversationFor(options.session, sessionId)
      keywords = conv.keywords
      task = conv.task
      queryText = conv.task
    }
    // 没有对话可依据时老实退回时间序，而不是假装排了个序
    mode = keywords.length > 0 ? 'relevance' : 'time'
  }


  const collected = await collectDocs(hostRoot, { index: mode !== 'relevance' })
```

</details>

**依据 5 · 源码核查**：[src/host/index.js:1769-1786](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L1769-L1786)

用户排除在排序前。

<details>
<summary>查看原文（18行）</summary>

```text
  const excluded = options.excluded instanceof Set
    ? options.excluded
    : excludedSet(controlRegistry.controlOf(root))
  let controlSkipped = 0
  /** 被排除的 rel 里，**工作区里真的还有**的那些（面板据此决定给不给「恢复」）。
   *  按 `collected`（**尚未按 kind 过滤**）判：切到代码档时那篇被排除的 Markdown
   *  只是不在本档语料里，文件并没有消失，不该把「恢复」也一起收掉。
   *  面板要的是「这一篇我还能不能找回来」，不是「它在这档里吗」。 */
  let controlAlive = null
  if (excluded.size > 0) {
    const before = pool.length
    pool = pool.filter((doc) => !excluded.has(doc.rel))
    controlSkipped = before - pool.length
    controlAlive = new Set()
    for (const doc of collected.docs.concat(collected.code, collected.media)) {
      if (excluded.has(doc.rel)) controlAlive.add(doc.rel)
    }
  }
```

</details>

**依据 6 · 源码核查**：[src/host/index.js:1824-1847](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L1824-L1847)

补正文、排序及有界片段。

<details>
<summary>查看原文（24行）</summary>

```text
    await hydrateBodies(pool, hostRoot)
    // 一个 `now` 贯到底（打分与片段用同一个时间基准）—— 同一批输入两次跑出的
    // 结果因此逐字相同（§20 的确定性要求）。
    const now = Date.now()
    const ranked = rankByRelevance(pool, keywords, now)
    ordered = ranked.docs
    // v0.20（D5）：给每条命中记录附上逐词的「单窗口内最大字频」。
    // 分层闸门 `isDocHit` 原来用**整篇**字频，而整篇字频会随文件变长而虚高 ——
    // 窗口一开，29000 字的 CHANGELOG 就能对**每个**任务满足闸门（需求 §9 明令禁止）。
    // 这一步只算「正文真的命中」的词，成本是几次 `indexOf`，不改名次、也不进 payload。
    for (const doc of ordered) {
      const tf = passageTfOf(doc)
      if (tf) doc.passageTf = tf
    }
    // v0.20：给排名最前的 `PASSAGE_WINDOW` 条挂上命中片段（§11）。
    // ⚠️ 这一步**不改名次**：片段是文件名的投影（实现说明 D3）。
    // 窗口之外的记录只是「没有片段」，不是「不相关」—— `limit` 才管分页，
    // 这里是宿主侧的成本上限（切段是 O(全文)，不该为 400 篇文件各做一遍）。
    // `rankByRelevance` 返回的是浅拷贝，所以挂 `matches` 不会污染 `pool`。
    const stop = Math.min(ordered.length, PASSAGE_WINDOW)
    for (let i = 0; i < stop; i++) {
      const matches = passageMatchesFor(ordered[i], keywords, now)
      if (matches.length > 0) ordered[i].matches = matches
    }
```

</details>

**依据 7 · 源码核查**：[src/host/tool.js:788-818](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L788-L818)

时间序 fallback 和分层输入。

<details>
<summary>查看原文（31行）</summary>

```text
      // 时间序（没有对话可依据）：退回一列「最近改动的」，**不硬凑三层**。
      if (payload.mode !== 'relevance') {
        const recent = await Promise.all((payload.docs || []).map(async (doc) => {
          const row = {
            rel: String(doc.rel || ''),
            title: String(doc.title || ''),
            summary: doc.summary == null ? '' : String(doc.summary),
            mtimeMs: Number.isFinite(doc.mtimeMs) ? Math.trunc(doc.mtimeMs) : 0,
          }
          const snippet = await snippetFor(root, row.rel, terms, row.title)
          if (snippet) row.snippet = snippet
          return row
        }))
        return {
          mode: 'time',
          topic: '',
          total: Number.isInteger(payload.total) ? payload.total : 0,
          ...(retrievalLine ? { retrieval: retrievalLine } : {}),
          primary: [],
          supporting: [],
          related: [],
          docs: recent,
        }
      }

      const pack = typeof contextFor === 'function'
        ? await contextFor(root, {
          // ⚠️ 用 `payload.ranked`（全量、未切片）而不是 `payload.docs`（已切到 limit）——
          // 分层要在完整名次上做，否则「Primary 3 篇 + Supporting 5 篇」会把
          // 本该是 Supporting 的文档因为切片而挤掉（它会掉进 Related，或整个消失）。
          ranked: Array.isArray(payload.ranked) ? payload.ranked : [],
```

</details>

**依据 8 · 源码核查**：[src/host/tool.js:842-870](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L842-L870)

返回关系和命中片段的边界。

<details>
<summary>查看原文（29行）</summary>

```text
      const project = (item) => {
        const row = {
          ...item,
          mtimeMs: Number.isFinite(item.mtimeMs) ? Math.trunc(item.mtimeMs) : 0,
        }
        if (Array.isArray(row.relations) && row.relations.length > MAX_TOOL_RELATIONS_PER_ITEM) {
          row.relationsTotal = Number.isInteger(row.relationsTotal) ? row.relationsTotal : row.relations.length
          row.relations = row.relations.slice(0, MAX_TOOL_RELATIONS_PER_ITEM)
        }
        return row
      }

      // v0.20：命中片段**在 `scan()` 里就算好了**（`payload.ranked[].matches`，带行号），
      // 键是 `rel`。有片段就不再读盘 —— 这是顺带拿到的性能收益：v0.19 为了抽 200 字，
      // 每一条都要把整篇文件再读一遍（`readDocument` → `pickSnippet`）。
      const matchesByRel = new Map()
      for (const doc of (Array.isArray(payload.ranked) ? payload.ranked : [])) {
        if (Array.isArray(doc.matches) && doc.matches.length > 0) {
          matchesByRel.set(String(doc.rel || ''), doc.matches)
        }
      }

      // 逐个抽命中段落 —— **只对真正要返回的条目做 I/O**，不在全量名次上读盘。
      const withSnippets = async (items) => Promise.all(items.map(async (raw) => {
        const item = project(raw)
        const matches = matchesByRel.get(String(item.rel || ''))
        if (matches) {
          // 单段也照旧填 `snippet` —— 渲染与老调用方都只认它。
          const first = matches.find((m) => m && typeof m.snippet === 'string' && m.snippet)
```

</details>

**依据 9 · 源码核查**：[src/host/tool.js:878-888](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L878-L888)

显式审计及非阻断失败。

<details>
<summary>查看原文（11行）</summary>

```text
      // 顺序是刻意的：先取「**上一份**包之后发生了什么」（usage 是回过头看的），
      // 再把这一份包记成新的 Context Snapshot —— 从下一次调用起，它才是「上一份」。
      // 两步都只是记账，任何失败都只让摘要少一行，绝不让整次工具调用失败。
      const usage = auditRequested ? auditSummary(audit, sessionId) : ''
      if (auditRequested && audit && typeof audit.note === 'function' && sessionId) {
        try {
          audit.note(sessionId, pack)
        } catch {
          // 记账失败不影响排序结果 —— 这是「Knit 坏了也不许影响 Agent」那条纪律
        }
      }
```

</details>

#### 缺口

- 没有目标 Host 或大目录实跑。
  **影响**：无法确认模型是否引用命中、真实性能及变化后的刷新。
  **进一步探讨**：以合成工作区核对命中、返回片段和审计。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 命中、缺失和可选语义外发边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

扫描预算限制层深、目录数、文件和时间，结果缺失可能因为预算、扩展名和排除。混合只在显式请求且有相关排序时运行，向配置端发送最多 2000 字查询，以及缓存未命中候选的标题和摘要，摘要可能来自 Markdown 正文或代码相对目录。失败会显式降级词法；无词法命中的语义项只追加在相关层余位。作者早期报告没有真 provider 的召回结果，本次也未测。面板 HTTP 只查 socket 回环并限制方法，但这不等于独立会话授权。其文本预览实际用 resolve 的词法前缀过滤，随后 stat/readFile 会跟链接，未见在此读取点按真实目标再校验。扫描按 Dirent 不接符号链接与明确给预览路径是两条路线，需用隔离外部样本核对，不能把侧栏当文件沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.js:83-104](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L83-L104)

目录、文件和时间预算。

<details>
<summary>查看原文（22行）</summary>

```text
/* ── 扫描预算：宁可少列几条，也不能把宿主卡住 ───────────────── */
const MAX_DEPTH = 6
const MAX_DIRS = 500
const MAX_DOCS = 400
/** 图片/视频等媒体产物的扫描上限（与文档分开计数，避免截图刷爆文档列表）。 */
const MAX_MEDIA = 400
/**
 * 代码产物的扫描上限（v0.19）。
 *
 * ⚠️ 这个数字是**审计真实工作区之后定的**，不是拍的：
 * 拿 `DeepSeek Harness Native` 这一级真实工作区数过一遍，根下有 635 篇 Markdown、
 * 773 个代码文件（`.mjs` 270 / `.js` 173 / `.json` 122 / `.py` 105 / `.html` 74 /
 * `.yml` 13 / `.css` 10 / `.sh` 5），代码比文档多约 1.2 倍。
 *
 * 所以取 **300**（≈ 0.75 × `MAX_DOCS`）而不是和文档齐平 400：
 * 「支持代码」不该让代码把原有的 Markdown 上下文挤出去（需求 §15），
 * 同一批语料里代码的准入名额略小于文档，是这条要求最直接的落实。
 * 另外它在面板里也不与文档竞争 —— 文档档的语料只有 Markdown（见 `scan()`）。
 */
const MAX_CODE = 300
const SCAN_BUDGET_MS = 4000
const HEAD_BYTES = 16 * 1024
```

</details>

**依据 2 · 源码核查**：[src/host/index.js:746-754](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L746-L754)

扫描接目录与文件类型。

```text
    for (const entry of entries) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (depth >= MAX_DEPTH) continue
        if (SKIP_DIRS.has(entry.name)) continue
        if (entry.name.startsWith('.')) continue
        if (mtimeMs !== null) local.dirs.push(abs)
        queue.push({ dir: abs, depth: depth + 1 })
      } else if (entry.isFile()) {
```

**依据 3 · 源码核查**：[src/host/index.js:1619-1649](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L1619-L1649)

显式混合、仅相关模式及失败反馈。

<details>
<summary>查看原文（31行）</summary>

```text
  if (requested === 'hybrid' && input.applies !== true) {
    return {
      mode: 'lexical', requested, configured: status.configured, available: null,
      reason: 'not-applicable', candidates: 0, provider: status.provider, rels: [],
    }
  }
  if (requested !== 'hybrid') {
    return {
      mode: 'lexical', requested, configured: status.configured, available: null,
      reason: null, candidates: 0, provider: status.provider, rels: [],
    }
  }
  // ⚠️ 2026-10-11（Phase C 量尺发现）：查询文本必须是**用户原话**。
  // 原来的顺序是 `task || keywords.join(' ')` —— 显式 `query` 路径（`knit_docs(query=…)`）下
  // `task` 是空的，于是拿去做嵌入的是 `extractKeywords()` **去重叠后的 3-gram 碎片**
  // （实测 `失效策略怎么定` → `["失效策","效策略"]`），语义那条路的质量因此明显更差。
  // 现在由调用方按「原话优先」传 `queryText`：显式 query > 会话原话 > 关键词（最后兜底）。
  const query = (input.queryText && String(input.queryText).trim())
    || (input.task && String(input.task).trim())
    || (Array.isArray(input.keywords) ? input.keywords.join(' ') : '')
  try {
    const result = await semanticEngine.pass({ root, query, docs: input.docs })
    // ⚠️ `mode` 报的是**实际生效**的模式，不是「你要的那个」：
    // 只有语义那一轮真的跑成功（`available === true`）才算 `hybrid`；
    // 没配置 / 探测失败 / 超时 / 形状不对一律**如实回 `lexical`** 并带上 `reason`
    // —— 判据 5 的「不许伪装成混合成功」在宿主这一侧就是这一行。
    const ok = result.available === true
    return {
      mode: ok ? 'hybrid' : 'lexical',
      requested,
      configured: !!result.provider,
```

</details>

**依据 4 · 源码核查**：[src/host/semantic.js:108-112](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L108-L112)

发送标题和摘要。

```text
export function embedTextOf(doc) {
  const title = typeof doc.title === 'string' ? doc.title : ''
  const summary = typeof doc.summary === 'string' ? doc.summary : ''
  const text = `${title}\n${summary}`.trim()
  return text.length > 0 ? text.slice(0, 2000) : null
```

**依据 5 · 源码核查**：[src/host/semantic.js:404-413](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L404-L413)

有提供商和查询才做嵌入，裁剪查询。

<details>
<summary>查看原文（10行）</summary>

```text
      if (!config) return { ...base, reason: 'no-provider' }
      if (!query) return { ...base, reason: 'no-query' }
      const health = await probeCached()
      base.calls = 1
      if (!health.ok) return { ...base, reason: health.reason || 'probe-failed' }

      const provider = providerOf()
      const queryVector = await provider.embed([query.slice(0, 2000)])
      base.calls += 1
      if (!queryVector.ok) return { ...base, reason: queryVector.reason || 'bad-response' }
```

</details>

**依据 6 · 源码核查**：[src/host/semantic.js:419-451](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L419-L451)

缓存与有限新候选及失败。

<details>
<summary>查看原文（33行）</summary>

```text
      for (const doc of docs) {
        const text = embedTextOf(doc)
        if (!text || typeof doc.rel !== 'string') continue
        const key = `${root}\u0000${doc.rel}\u0000${headHashOf(text)}\u0000${provider.id}\u0000${provider.schemaVersion}`
        const hit = vectorCache.get(key)
        if (hit) {
          base.cacheHits += 1
          scored.push({ rel: doc.rel, sim: cosine(q, hit) })
        } else if (pending.length < embedPerPass) {
          pending.push({ key, rel: doc.rel, text })
        }
      }
      if (pending.length > 0) {
        const embedded = await provider.embed(pending.map((item) => item.text))
        base.calls += 1
        if (embedded.ok) {
          for (let i = 0; i < pending.length; i++) {
            const vec = embedded.vectors[i]
            vectorCache.set(pending[i].key, vec)
            base.embedded += 1
            scored.push({ rel: pending[i].rel, sim: cosine(q, vec) })
          }
          // 有界缓存：超上限就丢最早的（Map 保持插入序）。
          while (vectorCache.size > SEM_CACHE_MAX) {
            const oldest = vectorCache.keys().next()
            if (oldest.done) break
            vectorCache.delete(oldest.value)
          }
        } else {
          // 嵌入失败 ⇒ 明着回退（但缓存命中那部分仍然如实计数：它们不花新钱）。
          base.reason = embedded.reason || 'bad-response'
          base.available = false
          return { ...base, candidates: 0, rels: [] }
```

</details>

**依据 7 · 源码核查**：[src/host/context.js:593-600](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/context.js#L593-L600)

语义候选只使用剩余相关名额。

```text
  // v0.23：**最后**才轮到语义条目（词法 → 关系 → 语义），而且只吃剩下的名额。
  // 顺序在这里是语义的一部分：capRelated 满的时候，被挤掉的必须是语义条目，不能是既有条目。
  for (const record of semanticOnly) {
    if (related.length >= capRelated) break
    if (seenRelated.has(record.rel)) continue
    seenRelated.add(record.rel)
    related.push({ record, linkTarget: false, linkSource: false, semantic: true })
  }
```

**依据 8 · 源码核查**：[src/host/index.js:2988-3014](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L2988-L3014)

面板回环和 session 参数。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.inject(['webServer', 'sessions'], (webCtx) => {
    // v0.17 修订：工具那条路（`knit_docs audit:true`）也要能回填，所以留一份引用。
    sessionsRef = webCtx.sessions
    const handler = async (req, res) => {
      if (!isLoopback(req.socket?.remoteAddress)) {
        sendJson(res, 403, { ok: false, code: ERROR_CODES.loopbackOnly })
        return
      }
      // v0.21：整个 HTTP 面**仍然只读**，只有一条写动作 —— 固定 / 排除。
      // 它改的也只是 Knit 自己的控制状态，从不碰工作区里的任何文件。
      const path = (req.url || '/').split('?')[0]
      const isControl = path === `${ROUTE_PREFIX}/api/control`
      // v0.23：第二条（也是最后一条）写通道 —— 只写 Knit 自己的语义 provider 配置。
      // 它同样**只认 POST**（`GET /api/semantic` 一律 405，与 `GET /api/control` 一致）。
      const isSemantic = path === `${ROUTE_PREFIX}/api/semantic`
      const isWrite = isControl || isSemantic
      // 写通道**只认 POST**：别的路由仍然是纯 GET。
      // （写成「非 GET 一律 405，除非是写路由的 POST」会让 `GET /api/control`
      // 掉进写分支里报 400 —— 那是「方法不对」不是「请求不对」。）
      if (req.method !== (isWrite ? 'POST' : 'GET')) {
        sendJson(res, 405, { ok: false, code: ERROR_CODES.methodNotAllowed })
        return
      }

      const url = new URL(req.url || '/', 'http://localhost')
      const sessionId = url.searchParams.get('sessionId') || ''
      const root = workspaceRootOf(webCtx, sessionId)
```

</details>

**依据 9 · 源码核查**：[src/host/index.js:3208-3216](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L3208-L3216)

实际浏览器预览读入 rel。

```text
        if (url.pathname === `${ROUTE_PREFIX}/api/doc`) {
          const rel = url.searchParams.get('rel') || ''
          if (!rel) {
            sendJson(res, 400, { ok: false, code: ERROR_CODES.missingRel })
            return
          }
          const payload = await readDocument(root, rel)
          sendJson(res, payload.ok ? 200 : 404, payload)
          return
```

**依据 10 · 源码核查**：[src/host/index.js:2274-2295](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L2274-L2295)

文件读取只有词法范围检查。

<details>
<summary>查看原文（22行）</summary>

```text
export async function readDocument(root, rel) {
  // root 由调用方给出，这里自己归一化，不假设它已经 resolve 过
  const base = resolve(root)
  const abs = resolve(base, rel)
  if (abs !== base && !abs.startsWith(base + sep)) {
    return { ok: false, code: ERROR_CODES.outsideWorkspace }
  }
  const name = abs.split(sep).pop() || abs
  const info = classifyFile(name)
  if (!isPreviewKind(info.kind)) return { ok: false, code: ERROR_CODES.notPreviewable }

  let st
  try {
    st = await stat(abs)
  } catch {
    return { ok: false, code: ERROR_CODES.notFound }
  }
  if (!st.isFile()) return { ok: false, code: ERROR_CODES.notAFile }

  const buf = await readFile(abs)
  const truncated = buf.length > DOC_MAX_BYTES
  const text = buf.subarray(0, DOC_MAX_BYTES).toString('utf8')
```

</details>

**依据 11 · 作者声明**：[docs/evaluations/hybrid-retrieval.md:9-15](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/docs/evaluations/hybrid-retrieval.md#L9-L15)

作者旧版报告的真服务缺口。

```text
> | | |
> |---|---|
> | 代码版本 | `knit/package.json` = **0.23.1**；`git rev-parse --short HEAD` = **`b164d8e`**；分支 `main`、工作区干净（开工时） |
> | npm 实际 latest | **0.23.1**（`dist-tags.latest`，发布于 2026-10-12T23:35Z，`gitHead` = `2925ad3`） |
> | 测试基线 | `cd knit && npm test` → **775 / 775 通过**（33 个测试文件）；净室闸门 `node tools/clean-room-test.mjs` → 解包目录里同样 **775/0** |
> | 真 provider | **本机没有**（`127.0.0.1:11434` 无响应、无 `ollama` 可执行文件）⇒ **H1 未跑，语义收益仍为 `pending`** |
> | 结论一句话 | **机制成立、默认路径一分钱不花、回退诚实；但「语义检索有价值」这件事本轮依然没有证据 —— 继续投入的前提是先把真 provider 那一跑做出来。** |
```

#### 缺口

- 未测当前版本语义召回、OS 符号链接和回环部署。
  **影响**：会影响收益、数据外发及真实文件范围。
  **进一步探讨**：在隔离副本用捕获端点和无敏感链接检查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、存储、索引和服务依赖是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.25.0 声明 Node >=22.19。宿主 tools 为模型入口所需，Web 和 sessions 给侧栏读接口。宿主 storage 有时可挂控制、增量索引和语义配置，缺失时进程内状态可失；向量留有界内存。默认词法，混合另需批准的 Ollama 或 OpenAI 兼容端，按查询与未缓存候选产生额外成本，回退也可能已经发请求。工作区扫描和人工验证仍消耗本机与人力。退出时处理索引、配置和可选服务，真实时延未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-42](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/package.json#L29-L42)

Web 与 Node 声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
  },
  "engines": {
    "node": ">=22.19"
  },
```

</details>

**依据 2 · 源码核查**：[src/host/index.js:3324-3361](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L3324-L3361)

存储选择及独立工具挂载。

<details>
<summary>查看原文（38行）</summary>

```text
    // 变量被最后一次加载覆盖 ⇒ 活跃实例恰恰是 `persisted: false` 的那个。
    const shared = sharedControlRegistry(backend)
    if (shared) controlRegistry = shared
    console.log(`[${name}] control storage: ${shared ? 'json backend attached' : 'memory-only'}`)

    // ── v0.22：增量索引的持久化 ─────────────────────────────────────
    //
    // 与上面共用**一个** `ctx.storage` 后端，但**各开各的 kv 单元**（`knit_index`）：
    // 索引的写量与形状和控制状态完全不同（`per-record` + 每条一个文件），混在一个单元里
    // 会让「改一个文件」变成重写整份控制状态。同一条 `sharedIndexStore()` 理由，
    // 见 `index-store.js`。
    const store = sharedIndexStore(backend)
    if (store) setIndexRegistry(store)
    console.log(`[${name}] index storage: ${store ? 'attached' : 'memory-only'}`)

    // ── v0.23：可选混合检索的**配置**持久化 ──────────────────────────
    //
    // 第三个 kv 单元（`knit_semantic`）。**只存配置**（一条全局记录，`single` 布局）；
    // 向量活在进程内缓存里 —— 持久化向量是 Phase B 的事（方案 §6）。
    // 拿不到存储时引擎照样工作，只是配置活不过这次进程（面板会如实说）。
    const semanticStore = sharedSemanticStore(backend)
    if (semanticStore) semanticEngine = createSemanticEngine({ store: semanticStore })
    console.log(`[${name}] semantic storage: ${semanticStore ? 'attached' : 'memory-only'}`)
  })

  // ── v0.7：把同一个排序结果也交给模型 ──────────────────────────────
  //
  // 独立的一次 `ctx.inject`，**不是**把 'tools' 加进上面那个数组。
  // 加进去的话 `tools` 缺席时整个回调都不跑 —— 连面板路由都起不来。
  // 两条路互不依赖：没有 tools 服务时，浏览器那半边照常工作。
  ctx.inject(['tools'], (toolCtx) => {
    toolCtx.effect(
      // v0.15：多注入一个 `auditBridge` —— `knit_docs` 的 `audit: true` 走它拿
      // 「上一份包之后发生了什么」，并把这次交出的包记成新快照。
      () => registerKnitDocsTool(toolCtx, scan, readDocument, buildContextFor, auditBridge),
      'dsh-knit: knit_docs tool',
    )
    console.log(`[${name}] agent tool ready: knit_docs`)
```

</details>

**依据 3 · 源码核查**：[src/host/semantic.js:181-195](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L181-L195)

兼容提供商实际端点和请求。

<details>
<summary>查看原文（15行）</summary>

```text
    const url = cfg.kind === 'ollama' ? `${cfg.base}/api/embed` : `${cfg.base}/v1/embeddings`
    const body = cfg.kind === 'ollama'
      ? { model: cfg.model, input }
      : { model: cfg.model, input }
    const res = await fetchJson(fetchImpl, url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }, embedTimeoutMs)
    if (!res.ok) return { ok: false, reason: res.reason }
    const vectors = cfg.kind === 'ollama'
      ? (Array.isArray(res.json.embeddings) ? res.json.embeddings : null)
      : (Array.isArray(res.json.data) ? res.json.data.map((row) => row && row.embedding) : null)
    if (!vectors || vectors.length !== input.length) return { ok: false, reason: 'bad-response' }
    for (const vector of vectors) {
```

</details>

**依据 4 · 源码核查**：[src/host/semantic.js:367-380](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L367-L380)

配置持久与重探测。

<details>
<summary>查看原文（14行）</summary>

```text
    async configure(value) {
      const cfg = normalizeProviderConfig(value)
      config = cfg
      loaded = true
      probe = null
      clearVectors()
      if (store) await store.write(cfg)
      return this.status()
    },
    /** 显式探测一次（只有 `POST /api/semantic` 与混合模式会走到这里）。 */
    async check() {
      await load()
      const result = await probeCached()
      return { configured: !!config, provider: config || null, available: result.ok, reason: result.ok ? null : (result.reason || 'probe-failed') }
```

</details>

**依据 5 · 源码核查**：[src/host/semantic.js:419-451](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L419-L451)

内存缓存和候选开销。

<details>
<summary>查看原文（33行）</summary>

```text
      for (const doc of docs) {
        const text = embedTextOf(doc)
        if (!text || typeof doc.rel !== 'string') continue
        const key = `${root}\u0000${doc.rel}\u0000${headHashOf(text)}\u0000${provider.id}\u0000${provider.schemaVersion}`
        const hit = vectorCache.get(key)
        if (hit) {
          base.cacheHits += 1
          scored.push({ rel: doc.rel, sim: cosine(q, hit) })
        } else if (pending.length < embedPerPass) {
          pending.push({ key, rel: doc.rel, text })
        }
      }
      if (pending.length > 0) {
        const embedded = await provider.embed(pending.map((item) => item.text))
        base.calls += 1
        if (embedded.ok) {
          for (let i = 0; i < pending.length; i++) {
            const vec = embedded.vectors[i]
            vectorCache.set(pending[i].key, vec)
            base.embedded += 1
            scored.push({ rel: pending[i].rel, sim: cosine(q, vec) })
          }
          // 有界缓存：超上限就丢最早的（Map 保持插入序）。
          while (vectorCache.size > SEM_CACHE_MAX) {
            const oldest = vectorCache.keys().next()
            if (oldest.done) break
            vectorCache.delete(oldest.value)
          }
        } else {
          // 嵌入失败 ⇒ 明着回退（但缓存命中那部分仍然如实计数：它们不花新钱）。
          base.reason = embedded.reason || 'bad-response'
          base.available = false
          return { ...base, candidates: 0, rels: [] }
```

</details>

#### 缺口

- 未测用户安装时间、扫描压力及混合服务费用。
  **影响**：工具节约与实际成本未知。
  **进一步探讨**：固定环境记录扫描、重启、网络和人工核对。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样对照文件检索的实际收益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

仅用可信合成工作区和词法模式试用。为同一问题预先标关键文件和行号，对比 rg、原生树及 Knit 的前列命中、打开次数和人工验证。加入无匹配、排除、预算用完与链接样本。可选混合在独立请求捕获端验收，预期收益是用路径、行号和证据层解释搜索，减少点击但不增加误引。若路径出界、敏感摘要被发送或结果无法回读，停止并转手工。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tool.js:738-766](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/tool.js#L738-L766)

词法模式与工作区拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
    async execute(args, exec) {
      const { root, sessionId, session } = agentScope(exec)

      // 拿不到会话就**报错，不兜底**。HTTP 路由那条路会兜底 process.cwd()，
      // 因为它要兼容不带 sessionId 的老客户端；工具没有这个包袱 ——
      // 兜底到「DSH 进程的 cwd」只会扫到一个不相干的项目并返回它的文档。
      // 宁可报错，也不要返回错的东西。
      if (!root) throw new Error(`${TOOL_NAME} requires an owning agent session with a workspace root`)

      const query = typeof (args && args.query) === 'string' ? args.query.trim() : ''
      const limit = clampLimit(args && args.limit)
      // v0.15：审计是**显式**的（默认 false）。不传它就完全不走 feedback 那条路。
      const auditRequested = !!(args && args.audit === true)

      // v0.23：`retrieval` 默认 `lexical`（老调用方一个字都不用改）。
      const retrieval = args && args.retrieval === 'hybrid' ? 'hybrid' : 'lexical'

      const payload = await scan(root, limit, {
        session,
        sessionId,
        sort: 'relevance',
        query,
        retrieval,
        // v0.19：工具的语料是**文档 + 代码**（不给 HTTP 的 `context` 档）。
        // 这一条正是本次版本的核心主张：代码和 Markdown 在**同一套 BM25、同一套分层**
        // 里竞争，谁进 Primary 只由任务检索决定，没人给代码留座位。
        // 媒体不进 —— 图片/视频没有可检索的正文，进上下文只会稀释（v0.18 起如此）。
        kind: 'context',
      })
```

</details>

**依据 2 · 源码核查**：[src/host/index.js:1824-1847](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L1824-L1847)

命中和片段可核对。

<details>
<summary>查看原文（24行）</summary>

```text
    await hydrateBodies(pool, hostRoot)
    // 一个 `now` 贯到底（打分与片段用同一个时间基准）—— 同一批输入两次跑出的
    // 结果因此逐字相同（§20 的确定性要求）。
    const now = Date.now()
    const ranked = rankByRelevance(pool, keywords, now)
    ordered = ranked.docs
    // v0.20（D5）：给每条命中记录附上逐词的「单窗口内最大字频」。
    // 分层闸门 `isDocHit` 原来用**整篇**字频，而整篇字频会随文件变长而虚高 ——
    // 窗口一开，29000 字的 CHANGELOG 就能对**每个**任务满足闸门（需求 §9 明令禁止）。
    // 这一步只算「正文真的命中」的词，成本是几次 `indexOf`，不改名次、也不进 payload。
    for (const doc of ordered) {
      const tf = passageTfOf(doc)
      if (tf) doc.passageTf = tf
    }
    // v0.20：给排名最前的 `PASSAGE_WINDOW` 条挂上命中片段（§11）。
    // ⚠️ 这一步**不改名次**：片段是文件名的投影（实现说明 D3）。
    // 窗口之外的记录只是「没有片段」，不是「不相关」—— `limit` 才管分页，
    // 这里是宿主侧的成本上限（切段是 O(全文)，不该为 400 篇文件各做一遍）。
    // `rankByRelevance` 返回的是浅拷贝，所以挂 `matches` 不会污染 `pool`。
    const stop = Math.min(ordered.length, PASSAGE_WINDOW)
    for (let i = 0; i < stop; i++) {
      const matches = passageMatchesFor(ordered[i], keywords, now)
      if (matches.length > 0) ordered[i].matches = matches
    }
```

</details>

**依据 3 · 源码核查**：[src/host/index.js:2274-2295](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/index.js#L2274-L2295)

预览链接边界需要负向验证。

<details>
<summary>查看原文（22行）</summary>

```text
export async function readDocument(root, rel) {
  // root 由调用方给出，这里自己归一化，不假设它已经 resolve 过
  const base = resolve(root)
  const abs = resolve(base, rel)
  if (abs !== base && !abs.startsWith(base + sep)) {
    return { ok: false, code: ERROR_CODES.outsideWorkspace }
  }
  const name = abs.split(sep).pop() || abs
  const info = classifyFile(name)
  if (!isPreviewKind(info.kind)) return { ok: false, code: ERROR_CODES.notPreviewable }

  let st
  try {
    st = await stat(abs)
  } catch {
    return { ok: false, code: ERROR_CODES.notFound }
  }
  if (!st.isFile()) return { ok: false, code: ERROR_CODES.notAFile }

  const buf = await readFile(abs)
  const truncated = buf.length > DOC_MAX_BYTES
  const text = buf.subarray(0, DOC_MAX_BYTES).toString('utf8')
```

</details>

**依据 4 · 源码核查**：[src/host/semantic.js:404-451](https://github.com/PolinniZhong/dsh-knit/blob/6c8c91a198efbcce1f4fae034e24f0b575f0b034/src/host/semantic.js#L404-L451)

混合可以独立验收。

<details>
<summary>查看原文（48行）</summary>

```text
      if (!config) return { ...base, reason: 'no-provider' }
      if (!query) return { ...base, reason: 'no-query' }
      const health = await probeCached()
      base.calls = 1
      if (!health.ok) return { ...base, reason: health.reason || 'probe-failed' }

      const provider = providerOf()
      const queryVector = await provider.embed([query.slice(0, 2000)])
      base.calls += 1
      if (!queryVector.ok) return { ...base, reason: queryVector.reason || 'bad-response' }
      const q = queryVector.vectors[0]

      // 有界：先复用缓存，再对「还没缓存」的那批做**有上限**的一轮嵌入（按池子顺序，确定性）。
      const pending = []
      const scored = []
      for (const doc of docs) {
        const text = embedTextOf(doc)
        if (!text || typeof doc.rel !== 'string') continue
        const key = `${root}\u0000${doc.rel}\u0000${headHashOf(text)}\u0000${provider.id}\u0000${provider.schemaVersion}`
        const hit = vectorCache.get(key)
        if (hit) {
          base.cacheHits += 1
          scored.push({ rel: doc.rel, sim: cosine(q, hit) })
        } else if (pending.length < embedPerPass) {
          pending.push({ key, rel: doc.rel, text })
        }
      }
      if (pending.length > 0) {
        const embedded = await provider.embed(pending.map((item) => item.text))
        base.calls += 1
        if (embedded.ok) {
          for (let i = 0; i < pending.length; i++) {
            const vec = embedded.vectors[i]
            vectorCache.set(pending[i].key, vec)
            base.embedded += 1
            scored.push({ rel: pending[i].rel, sim: cosine(q, vec) })
          }
          // 有界缓存：超上限就丢最早的（Map 保持插入序）。
          while (vectorCache.size > SEM_CACHE_MAX) {
            const oldest = vectorCache.keys().next()
            if (oldest.done) break
            vectorCache.delete(oldest.value)
          }
        } else {
          // 嵌入失败 ⇒ 明着回退（但缓存命中那部分仍然如实计数：它们不花新钱）。
          base.reason = embedded.reason || 'bad-response'
          base.available = false
          return { ...base, candidates: 0, rels: [] }
```

</details>

#### 缺口

- 没有本轮对照结果。
  **影响**：不能承诺检索提升或安全隔离。
  **进一步探讨**：先测词法命中及范围，再单独审查混合。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
