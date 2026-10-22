# dsh-capmap-viz

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[49228e5](https://github.com/1741505640/capmap-skills/tree/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)
<!-- END META -->

> **实现功能**：解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。

> **核心亮点**：相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](#research-q03)。

> **风险与缺陷**：关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 能力文档可视化适合什么项目治理任务？](#detail-section-11)
  - [Q02 · 文档解析、派生查询、文件监听和图形面板如何协作？](#detail-section-12)
  - [Q03 · dsh-capmap-viz 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 图谱是否会把过时文档误当真实能力状态？](#detail-section-14)
  - [Q05 · dsh-capmap-viz 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 维护 CapMap 文档和可视化的总成本是什么？](#detail-section-16)
  - [Q07 · 解析器、revision 监听和面板分层是否可复用？](#detail-section-17)
  - [Q08 · 能否把文档图升级为带来源与验证状态的决策图？](#detail-section-18)
  - [Q09 · dsh-capmap-viz 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已经用 CapMap 结构化文档维护能力、主题和依赖的项目成员。输入是 docs root 下的 YAML/Markdown；合格结果是图节点、边、状态颜色、能力面板和派生查询与文件内容一致，工作区切换不串状态，变更后 revision 更新。简单替代是目录浏览、Markdown 搜索或通用图工具。

参见[Q01](#research-q01)。

基线是 Markdown 目录、rg 和通用 Mermaid/Graphviz；基线维护简单但缺交互、workspace 状态和领域查询。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 能力图 | 按类型、状态展示节点与关系 | 图反映文档，不等于运行事实 |
| 详情与原文 | 查看能力说明并读取源文档 | 依赖路径栅栏和 docs root |
| 派生查询 | 展示前沿、校验门等项目视图 | 正确性取决于文档语义 |
| 实时更新 | 监听 docs root 并递增 revision | 高频/大规模行为未实测 |
| bootstrap | 缺结构时安装 Skill/脚手架 | 会写项目文件，需先审范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| CapMap 约定文档与 docs root | 必需 | 提供节点、关系和能力真值候选 | 缺失时只能 bootstrap/scaffold |
| fs/invariants/Remote 与客户端 slots | 必需 | Host 解析、通信和侧栏入口 | 宿主服务缺失则无法加载 |
| chokidar/js-yaml/d3-force/React | 必需 | 监听、解析和图形渲染 | 版本/性能问题会导致旧图或卡顿 |
| 团队文档纪律 | 效果必需 | 保持图与实现一致 | 没有维护责任时图会迅速陈旧 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在项目建立 CapMap docs root 或 bootstrap | 解析无错误 |
| 打开 | 侧栏选择 workspace 并加载图 | 节点/边/状态与原文一致 |
| 探索 | 筛选、hover、1-hop、详情并读原文 | 关键判断可追溯到文档 |
| 更新/恢复 | 修改文档触发 revision；错误时明确显示并修复 | 不静默保留旧图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 依赖安装和文档存储 | 建立/迁移 CapMap 结构 | 项目规模决定工时 |
| 持续使用 | watch、解析、布局 CPU/内存 | 同步实现、状态和文档 | 节点陈旧率未知 |
| 失败恢复 | 旧图可能导致决策代价 | 修 YAML/关系、重载和复核 | 大图恢复时延未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 关系导航 | 解析为节点/边并可回读详情 | 未证明缩短真实任务 |
| 变化反馈 | 按 workspace watch 与 revision | 高频变更丢事件率未知 |
| 治理查询 | 派生 frontier/validation gate 等视图 | 结果只和文档一样可信 |

> **思考**：关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](#research-q03)。

相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。 参见[Q03](#research-q03)。

服务按 projectRoot 隔离 watcher、用 revision 通知客户端，并在 dispose 关闭 watcher；parser 与派生查询独立于 React，可单测和复用。可借鉴的是图节点能读回原文而非只保留视觉摘要。风险是源码与编译 lib 并存、复杂 UI 状态和文件监听都需保持发布一致性。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议试用。适合已经维护 CapMap 文档的小团队，只把图当导航并要求关键判断回到原文；先在单 workspace、小图验证 parse/watch/read 和错误展示。没有文档纪律的项目不应为了图而先引入整套格式。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证明 CapMap 解析、派生查询、按 workspace 监听和侧栏图形入口；大图布局、revision 丢失和文档陈旧率未运行测量，证据化决策图仍是待验证扩展，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 dsh-capmap-viz/README.md、dsh-capmap-viz/package.json、dsh-capmap-viz/src/index.ts、dsh-capmap-viz/src/parser/parse.ts、dsh-capmap-viz/src/parser/queries.ts、dsh-capmap-viz/src/client/index.tsx 及固定范围 inventory；组件：dsh-capmap-viz。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、Host service、parser/query、watch 与客户端主要入口；不运行 GUI 或性能测试。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：从十个真实依赖问题开始，要求图答案可追溯、文档变更后无旧状态、解析错误显式；任何把无证据声明显示成已验证的设计都应先修正。

**分析版本**

- **仓库**：[1741505640/capmap-skills](https://github.com/1741505640/capmap-skills)
- **版本号**：0.2.4（[固定提交 49228e5](https://github.com/1741505640/capmap-skills/tree/49228e54a6a536ddbbb0adca85bd016334cbf4cc)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可让每个能力/关系附 Git blob、代码/测试证据、负责人和 checked_at，把节点状态分成‘声明／实现／验证／过期’，并让 validation gate 只基于有效证据。它可能把漂亮图升级为可审计决策图，但会增加维护字段与证据采集成本。 参见[Q08](#research-q08)。

从十个真实依赖问题开始，要求图答案可追溯、文档变更后无旧状态、解析错误显式；任何把无证据声明显示成已验证的设计都应先修正。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 5818 | 5587 | 335 | — |
| .md | source | 1 | 119 | — | — | 740 |
| .mjs | source | 1 | 34 | 28 | 1 | — |
| .ts | source | 21 | 2713 | 2332 | 122 | — |
| .ts | test | 8 | 667 | 631 | 4 | — |
| .tsx | source | 9 | 2921 | 2747 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1741505640/capmap-skills/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 49228e54a6a536ddbbb0adca85bd016334cbf4cc 上判断 dsh-capmap-viz 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 能力文档可视化适合什么项目治理任务？

**研究主题**：场景与需求

#### 完整回答

面向已经用 CapMap 结构化文档维护能力、主题和依赖的项目成员。输入是 docs root 下的 YAML/Markdown；合格结果是图节点、边、状态颜色、能力面板和派生查询与文件内容一致，工作区切换不串状态，变更后 revision 更新。简单替代是目录浏览、Markdown 搜索或通用图工具。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档解析、派生查询、文件监听和图形面板如何协作？

**研究主题**：功能与机制

#### 完整回答

Host CapMapService 解析项目 docs root，按 root 建 chokidar watcher 和 revision，提供 parse/watch/read/bootstrap 等远程端点；parser 把文档头和正文转成节点、能力与关系，并派生 frontier、validation gate 等查询。客户端侧栏选择 workspace，用 d3-force 渲染图和详情面板。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/index.ts:22-25](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/index.ts#L22-L25)

Host service 管理解析、watch 和远程端点。

```text
export class CapMapService extends Service {
  static inject = ['connection'];

  private readonly watches = new Map<string, WatchEntry>();
```

**依据 2 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-capmap-viz 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对 Markdown 搜索，它把同一 CapMap 规范直接转为可交互图、状态描边和项目级派生问题，并能在文档变化后刷新。核心增量是领域文档模型与宿主侧栏的结合；d3-force 和 YAML 解析属于成熟组件，图形本身不证明文档代表真实实现。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/index.ts:22-25](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/index.ts#L22-L25)

Host service 管理解析、watch 和远程端点。

```text
export class CapMapService extends Service {
  static inject = ['connection'];

  private readonly watches = new Map<string, WatchEntry>();
```

**依据 2 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 图谱是否会把过时文档误当真实能力状态？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键前提是文档持续、准确且有明确来源。解析成功只能证明格式满足规则，不能证明能力已实现、验证门已通过或依赖仍有效；图的视觉权威感可能放大陈旧文档。大图的布局稳定性、可访问性、watch 风暴和多 workspace 内存也未验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

**依据 2 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

#### 缺口

- 大型、多 workspace 和频繁文件变更下图谱陈旧、watch 丢事件与布局可用性
  **影响**：用户可能依据旧图作出错误依赖或验证判断
  **进一步探讨**：生成 1k/5k 节点、并发改文件和切换 workspace，测 revision 丢失、解析 P95、内存、布局稳定和旧状态标记

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-capmap-viz 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 DSH Client/Remote、fs/invariants、React、d3-force、chokidar、js-yaml 以及符合约定的 docs root；缺目录时可 bootstrap/scaffold。持续使用要求团队维护文档与状态。失败恢复要区分解析错误、docs root 缺失、watch 失效和客户端旧 revision，不能静默展示旧图。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/index.ts:22-25](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/index.ts#L22-L25)

Host service 管理解析、watch 和远程端点。

```text
export class CapMapService extends Service {
  static inject = ['connection'];

  private readonly watches = new Map<string, WatchEntry>();
```

**依据 2 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 维护 CapMap 文档和可视化的总成本是什么？

**研究主题**：效果与总成本

#### 完整回答

合格任务是用户从图中找到一个真实能力关系或验证阻塞，且能回到原文确认。首次成本是建立/迁移 CapMap 文档；持续成本是同步实现与文档、watch/布局资源和人工审阅；失败恢复是修 YAML/链接和清旧视图。没有大型项目的节点规模、解析时延、找信息节时或陈旧率。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

**依据 2 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

#### 缺口

- 文档维护分钟、节点陈旧率、用户查找依赖耗时和错误决策率
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：用十个真实查询对比 rg/目录与图界面，记录正确答案、回原文次数、耗时和文档修正工作

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 解析器、revision 监听和面板分层是否可复用？

**研究主题**：工程质量与复用

#### 完整回答

服务按 projectRoot 隔离 watcher、用 revision 通知客户端，并在 dispose 关闭 watcher；parser 与派生查询独立于 React，可单测和复用。可借鉴的是图节点能读回原文而非只保留视觉摘要。风险是源码与编译 lib 并存、复杂 UI 状态和文件监听都需保持发布一致性。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/index.ts:22-25](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/index.ts#L22-L25)

Host service 管理解析、watch 和远程端点。

```text
export class CapMapService extends Service {
  static inject = ['connection'];

  private readonly watches = new Map<string, WatchEntry>();
```

**依据 2 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否把文档图升级为带来源与验证状态的决策图？

**研究主题**：新假设与验证

#### 完整回答

可让每个能力/关系附 Git blob、代码/测试证据、负责人和 checked_at，把节点状态分成‘声明／实现／验证／过期’，并让 validation gate 只基于有效证据。它可能把漂亮图升级为可审计决策图，但会增加维护字段与证据采集成本。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

**依据 2 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

#### 缺口

- 证据状态能否显著减少把声明当实现而不让维护成本失控
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：给 50 个节点补证据字段，盲测用户判断准确率；若每周维护超过节省时间或过期率不降则否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-capmap-viz 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议试用。适合已经维护 CapMap 文档的小团队，只把图当导航并要求关键判断回到原文；先在单 workspace、小图验证 parse/watch/read 和错误展示。没有文档纪律的项目不应为了图而先引入整套格式。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-capmap-viz/README.md:68-71](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/README.md#L68-L71)

作者说明侧栏工作区选择和图交互。

```text
## 使用

1. `dsh web` 后侧栏可见「能力底图」入口（宽栏文字 / 折叠轨图标）。
2. 点入口 → 选 Workspace → 图谱加载；类型填色、状态描边；hover / 1-hop / 缩放平移 / Fit。
```

**依据 2 · 源码核查**：[dsh-capmap-viz/src/parser/parse.ts:303-306](https://github.com/1741505640/capmap-skills/blob/49228e54a6a536ddbbb0adca85bd016334cbf4cc/dsh-capmap-viz/src/parser/parse.ts#L303-L306)

解析器从项目文档生成图结构。

```text
export function parseGraph(projectRoot: string): CapMapGraph {
  const docsRoot = resolveDocsRoot(projectRoot);
  const files = listMdFiles(docsRoot);
  const allDocs: FmDoc[] = [];
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
