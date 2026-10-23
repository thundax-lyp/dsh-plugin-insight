# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[cd6c2c3](https://github.com/00080000/dsh-project-memory/tree/cd6c2c38cffe989e155b54662786850b83366f7f)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,202](https://img.shields.io/static/v1?label=npm+30d&message=4%2C202&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **实现功能**：索引项目文档与代码符号，分层召回经验和insight，并将任务记录跨会话保存。

> **核心亮点**：将材料召回和行动前须知分契约，结合任务绑定、git语料/分片锁与注入审计减少重复接线，不把相关性当真值。参见[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

> **风险与缺陷**：反思草稿已有隔离，但非草稿近邻仍可继承高confidence覆盖全局，任务数提升非适用域验证；trigger也会截断、索引CAS不读源。参见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 项目记忆为谁交付什么，相对rg/项目笔记增加什么？](#detail-section-11)
  - [Q02 · 索引、文件清单与分片CAS保证到什么程度？](#detail-section-12)
  - [Q03 · 召回与触发注入如何约束，是否全文/硬token保证？](#detail-section-13)
  - [Q04 · 反思草稿、近邻合并与scope提升怎样保留信任边界？](#detail-section-14)
  - [Q05 · TaskBridge、向量和维护各承担什么成本？](#detail-section-15)
  - [Q06 · 何时试用，如何证伪来源/审批修订链假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期项目跨会话复用已读材料/经验与任务，命中须回源确认适用版本，合格交付以真实代码/问题完成衡量。

rg/IDE符号加AGENTS/项目笔记为简单参照；插件省上下文/任务接线但增加状态、向量和知识审核，不以hit@k当质量胜出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| index_doc | 显式索引一个PDF/MD/txt | 核根与大小；PDF文本非OCR，引用需回源 |
| index_repo | 增量索引项目文档/符号 | 安全根、git清单或遍历；截断/失败有覆盖边界 |
| watch_repo | 开启或停止项目轮询刷新 | watch=false停止；不是实时源版本锁 |
| memory_stats | 查看统计与逐文件索引 | 统计不是质量；根须存在，可选向量可写缓存 |
| query_memory | 按层召回引用和记忆 | 词法/可选语义，分数非真值，扩展可调用模型 |
| remember | 保存问题到解法经验 | 同insight去重；近邻可覆盖，关联文件限项目内 |
| save_lesson | 保存或按id编辑教训/决策/流程 | task/project/global；draft先审，非草稿合并需核 |
| forget | 按id或关键词删除跨层记忆 | 真删除无undo；超上限不删，最近5条有限留痕 |
| list_tasks | 查看含归档的项目任务 | 当前项目根，输出有截断上限 |
| select_task | 绑定/新建/解归档任务并续接 | 精确id或标题；同名多项需选，步骤写回需核 |
| archive_task | 归档任务并停止默认续接 | 精确id；select可恢复，可选反思默认关 |
| show_task_panel | 请求浏览器打开任务面板 | 需客户端结果节点渲染，Host仅返回请求 |
| /tasks | 用户直接驱动任务与记忆子动作 | commands和Web卡片就绪，不经模型工具决策 |
| 自动注入与审计 | when/guard提示及候选解释 | 非执行前强制，字符预算可能截正文 |
| TaskBridge | 同步todo与文件关系 | 子代理不自动建档，模型步骤不等业务验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH匹配tools/事件/LLM等接口 | 对应能力必需 | 注册/任务/可选模型 | 降级或停用相应面 |
| 可读项目/可写store、pdfjs | 核心/PDF必需 | 索引持久与文档提取 | 报失败/保旧，查引用 |
| leanvec/TypeScript | 可选增强 | 语义重排/符号增强 | 词法/基础符号回退 |
| 人工知识审核和源有效性 | 收益必需 | 避免陈旧与误合并 | 暂缓global，保权威原件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户选非敏感项目根/固定宿主 | 路径与索引范围正确 |
| 2 | Agent正常读/索引并query | 引用可回源，失败/截断可见 |
| 3 | 用户绑定任务/审核insight | 步骤与适用域一致，draft先审 |
| 4 | 用户核global与备份/退出 | 误合并能追原文，恢复逐文件核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 文件/PDF/符号抽取、可选向量资源 | 选根、去秘密、定任务与知识范围 | 作者79MB为依赖声明，实机峰值/金额未知 |
| 持续使用 | lazy/watch IO、检索、上下文/日志、可选LLM | 核引用、触发截断、近邻与global | 索引无LLM不等总成本零 |
| 失败恢复 | 分片/辅助/global原件与有限备份 | 查锁/源竞态、误合并提升、纠错重建 | 多文件非整库事务，恢复人时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 索引维护 | 哈希增量、分片锁、git语料与定位 | 抽取/源修改竞态及完整覆盖 |
| 召回/提示 | 分层top-k、when/guard与审计 | 相关性/适用真值、长规则完整 |
| 知识治理 | draft隔离、有限prev/删除备份 | 非草稿近邻/全局普适性 |
| 任务续接 | todo/文件绑定和反向同步 | 真实合格率/返工节省 |

> **思考**：反思草稿已有隔离，但非草稿近邻仍可继承高confidence覆盖全局，任务数提升非适用域验证；trigger也会截断、索引CAS不读源。参见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将材料召回和行动前须知分契约，结合任务绑定、git语料/分片锁与注入审计减少重复接线，不把相关性当真值。参见[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

将材料召回和行动前须知分契约，结合任务绑定、git语料/分片锁与注入审计减少重复接线，不把相关性当真值。参见[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

共享pipeline、派生链接、目录锁/冲突合并与草稿分支隔离可借鉴；CAS对象是store记录，字符预算与近似向量指纹要明确，勿把原子分片等同整库事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

反思草稿已有隔离，但非草稿近邻仍可继承高confidence覆盖全局，任务数提升非适用域验证；trigger也会截断、索引CAS不读源。参见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先单项目非敏感语料和少量人工经验试用，反思/扩展保持默认关；核原文、trigger正文和global，重要规则保权威原件。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

索引/召回/任务接线与草稿隔离有源码支持；源新鲜、非草稿信任合并/提升与截断边界未实测，来源审批链是假设。

- 已检查：作者 README、包清单、源码路径 src/index.js、src/index-pipeline.js、src/tools/index-repo.js、src/doc-pipeline.js、src/parsers/pdfjs-parser.js、src/store.js、src/util/fs.js、src/recall.js、src/readiness.js、src/auto-inject.js、src/audit.js、src/insight-store.js、src/reflection-pipeline.js、src/setup/taskbridge.js、src/vector-index.js、README.zh-CN.md、package.json、src/tools/index-doc.js、src/tools/watch-repo.js、src/tools/stats.js、src/tools/query-memory.js、src/tools/remember.js、src/tools/lesson-tools.js、src/tools/forget.js、src/tools/task-tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核共享索引/git清单/分片锁、召回、触发预算、insight草稿/合并/提升、TaskBridge与向量指纹；未穷尽所有UI/符号语言/根解析组合，不运行目标。
- 下一步：未运行目标。固定同项目/模型/预算，对照互斥规则、跨项目近邻、长procedure和并发改源，记录违约/陈旧/质量、RSS/IO/费用及审核人时。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.4（[固定提交 cd6c2c3](https://github.com/00080000/dsh-project-memory/tree/cd6c2c38cffe989e155b54662786850b83366f7f)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为来源版本/适用域/审批修订链与完整触发引用，先验互斥知识污染和长procedure约束，再比较合格任务及审核负担。参见[Q06](#research-q06)。

未运行目标。固定同项目/模型/预算，对照互斥规则、跨项目近邻、长procedure和并发改源，记录违约/陈旧/质量、RSS/IO/费用及审核人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 2362 | — | — | 51822 |
| .js | source | 53 | 15393 | 11132 | 3711 | — |
| .mjs | source | 6 | 1458 | 1201 | 155 | — |
| .ts | source | 10 | 1449 | 1020 | 342 | — |
| .tsx | source | 5 | 1619 | 1370 | 166 | — |
| .mjs | test | 44 | 10431 | 8366 | 1291 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-23T01%3A49%3A28.393Z..2026-10-23T01%3A49%3A28.393Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A49%3A28.393Z..2026-10-23T01%3A49%3A28.393Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：项目记忆的贡献、引用新鲜度、触发与知识scope信任能否支撑可控采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目记忆为谁交付什么，相对rg/项目笔记增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一项目跨会话开发、需要复用已读文档、符号和经验的DSH用户是主要人群。合格结果是召回当前适用的文件/规则，以路径行号回源核实，续接正确任务并完成合格修改；不是单看命中数或注入数。输入是项目代码/PDF/Markdown与任务/人工经验，权威性仍来自原件。

相对rg/IDE符号查找和AGENTS/手工笔记，插件将懒索引、文件分片、分层召回、TaskBridge与行动前提示整合，减少重复接线；规范标题提权和分层top-k避免大文档层淹没少量insight。贡献在状态/检索/流程组合而非知识真值证明。路径行号是抽取时定位，不是源版本冻结；作者规模、RSS、hit@k数据属于作者标定，不能外推任务质量。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh-CN.md:9-28](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/README.zh-CN.md#L9-L28)

作者项目开发与分层功能主张。

<details>
<summary>查看原文（20行）</summary>

```text
为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）agent 提供持久化的 **项目开发记忆**。专门针对项目开发，原生融合 dsh 任务系统，会话内任务清单与读过的文件自动沉淀为跨会话任务记录，任务↔文件自动关联——开发工作流可切换、可续接，无需重复梳理整个项目，解决上下文失效；文档（PDF/Markdown/txt）与代码符号写入工作区独立存储，文档自动交叉链接至所提及的代码符号；经验笔记（问题 → 方案）自动去重，避免重复踩坑。所有数据按项目落盘，跨会话压缩与交接保留，召回附带 `路径:行号` 可回源核实。无原生构建、无向量数据库。79 MB 的本地嵌入表 `leanvec` 随安装默认启用；它不在时自动退回纯词法。


> 插件在磁盘上维护一份精简的项目**记忆**，每条记录指向具体的文件与行号；agent 需要快速了解项目时先查**记忆**，无需重读整个项目。
![任务面板：任务清单、步骤进度与涉及文件](docs/images/image.png)

## 特性

- **TaskBridge：跨会话开发任务** — 会话内的任务清单与触碰过的文件持久化为项目任务实体，工作流可以随时切走再续接，不必重新界定项目范围。关联文件按最近活跃排序（读取永远不越过写过的文件），续接时一眼看到该先看哪些。新会话通过 `list_tasks` → `select_task` 续接。委派给子代理的工作不会建档。旧宿主下降级为纯记录。
- **任务面板与编辑** — 卡片可拖拽，展示任务步骤与涉及文件，可折叠为迷你条或彻底隐藏；标题、步骤与状态支持行内编辑，与模型更新走同一条写回路径；四档外观风格只改材质、几何、字型与密度，颜色跟随宿主。面板默认隐藏，仅在显式唤起后出现；会话切换只后台同步，刷新页面不会自行打开；渲染错误有边界兜底，面板崩溃不会拖垮宿主。
- **文档记忆** — PDF、Markdown 与纯文本按块切分并生成摘要，索引期不调用模型。每条保留一段简短摘要供注入、一个有界的检索词集合，以及回源引用。
- **代码符号记忆** — 零依赖扫描器提取函数、类、方法、接口与类型别名及其完整签名，覆盖 8 种语言。项目装了 `typescript` 时，可选第二层补推导返回类型、泛型与接口，后台执行、不阻塞索引。
- **读到即记忆、变更即刷新** — 文件在模型实际读取的瞬间被记忆，记忆是正常工作的副产品，而不是额外的一次全量扫描；从未读过的文件不会被记忆。后台轮询只重记变更过的文件。
- **文档 ↔ 代码交叉链接** — 文档提及的符号，在查询该符号时一并带出。链接按**当前**符号表解算，不会过期。
- **混合召回** — 对文档、符号、经验笔记与 insight 排序召回，可选 LLM 查询扩展。`leanvec` 是 optionalDependency：默认装上并按余弦重排经验/洞察两层，没装或 `vectorDir: 'off'` 则退回纯词法。针对 CJK 增强：短语加分、同义词表，以及文档↔符号链接的词边界处理。
- **经验笔记** — 记录问题 → 方案；相似问题覆盖而不重复，数量随项目规模有界，与教训走同一条注入通道：检索与自动注入都能带出。
- **分层 insight 记忆（教训 / 决策 / 流程）** — 同一实体贯穿任务、项目、全局三级。近重复合并或强化；提升是更换归属而非复制。被使用会记账，因此衰减与容量按活跃度排序，而不是只按时间。面板提供分级的记忆视图用于审核与编辑；列表按新→旧排列并增量加载——每页 30 条，滚到底前就预取下一页，离屏行不参与渲染，记忆变多也不卡。
- **触发式注入** — insight 可携带 authored trigger：只有 `when` 能触发，`guard` 只能收窄，`prevents` 记下没有它会坏在哪。语料正文永远不能触发注入；统计通道另有独立门槛，默认沉默。

## 安装
```

</details>

**依据 2 · 源码核查**：[src/recall.js:4-16](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/recall.js#L4-L16)

pull/push契约与分层top-k。

<details>
<summary>查看原文（13行）</summary>

```text
 * 设计口径：「一个记忆，两种交付契约」——recall 回答"记忆里有什么和这件事有关"，
 * readiness 回答"动手之前必须知道什么"（PR2）。本模块只做前者，且是 pull/push 共用
 * 的检索核心，避免第二次为 insight 层另写一个更弱的匹配器。
 *
 * 三条不变量：
 *   1. 每层一个适配器：把该层条目映射到同一个检索条目契约
 *      （{ title, keywords, summary, terms, sourcePath }，见 util/search.js:weightedFieldText）。
 *   2. 每层各自 top-k 后再合并：20k doc 条目不能把十几条 insight 挤出结果。
 *   3. 跨层不给"伪可比"的单一分数：桶内先按层内 top 归一为 rel，再乘层先验；
 *      该分数只用于提示级排序，pull 的展示始终按层分节。
 *
 * 规范段提权：标题命中"必须遵守 / 禁止 / rules / must"等词集的 doc chunk 在召回中提权。
 * 确定性、零模型、零依赖——不违反「零依赖、零后台、零 LLM 索引期」。
```

</details>

**依据 3 · 源码核查**：[src/recall.js:79-92](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/recall.js#L79-L92)

规范标题提权仅启发式。

<details>
<summary>查看原文（14行）</summary>

```text
/** 规范段词集（多语言、确定性）：标题命中即视为"规约/清单"段。 */
export const NORMATIVE_HEADING =
  /(必须|禁止|不得|不要|铁律|规约|规范|规则|约定|清单|检查表|checklist|rules?|requirements?|must|must not|do not|don't|never)/i

/** 规范段提权倍数。取 1.5 与 CJK 短语加成同量级：足以翻转词频差，不足以压过强命中。 */
export const NORMATIVE_PRIOR = 1.5

/**
 * 规范段先验：doc 条目标题命中规范词集时提权，其余条目恒为 1。
 * @param {{ title?: string }} entry - 任意检索条目（通常是 doc chunk）。
 * @returns {number} 1 或 {@link NORMATIVE_PRIOR}。
 */
export function normativePrior(entry) {
  return NORMATIVE_HEADING.test(String(entry?.title || '')) ? NORMATIVE_PRIOR : 1
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引、文件清单与分片CAS保证到什么程度？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index_repo先核根安全，再按git ls-files tracked+unignored或普通遍历取清单，每200项提交，超限/截断不把未见当删除。共享pipeline读取字节哈希，代码同buffer扫符号，文档重走buildDocEntries按标题/长度抽取summary与完整chunk有界terms，PDF为文本提取非OCR。分片每文件保存，doc→symbol链接读取时派生；store.save有目录锁、辅助文件合并与磁盘分片冲突选择，不应把它说成无跨进程保护。

CAS实际比较store.fileRecord旧hash而非重新读源文件，能挡索引store编排竞争，不能保证源内容从抽取到提交没变。文档路径还先hash一次buffer、后extractTextFromFile再次读，读间修改可让记录hash与entries不同。git清单分支stat失败直接continue却只把capped作为truncated，unreadable为空；原先已索引但暂时stat失败可能在完整标志下被unseen清理。目录锁与逐JSON原子写也不构成整库多文件崩溃事务。上述为静态边界，未复现陈旧/丢索引。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/index-repo.js:34-85](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/tools/index-repo.js#L34-L85)

批提交、seen与截断清理。

<details>
<summary>查看原文（52行）</summary>

```text
  const flushBatch = () => {
    if (!batch.length) return
    // 中间批次不做 unseen 清理（最后一批统一做）——否则每批都要遍历整个 store。
    commitFileUpdates(store, { updates: batch })
    batch = []
  }

  const { files, truncated, capped, skipped: nestedRoots, unreadable } = listProjectFiles(root, {
    ...scanLimits(config),
    nestedStoreName: memoryDirName(config),
  })
  for (const filePath of files) {
    const rel = storeKey(relativePath(root, filePath))
    seen.add(rel)
    const kind = fileKind(path.extname(filePath).toLowerCase())
    if (!kind) continue

    try {
      const size = statSync(filePath).size
      const record = store.fileRecord(rel)
      const plan = await planFileIndex({ rel, filePath, kind, config, record, existingEntries: store.entries[rel], size, force: reindex })
      if (plan.key === UNCHANGED) {
        skipped++
        continue
      }
      if (plan.key === OVERSIZE) {
        // 体积超限的代码文件：旧记录一律清掉，避免检索命中一个已经不索引的文件。
        batch.push({ rel, drop: true })
        skipped++
        if (batch.length >= COMMIT_BATCH) flushBatch()
        continue
      }
      batch.push(toFileUpdate(rel, plan, record))
      if (plan.key === DROP) skipped++
      else if (plan.type === 'code') {
        updated++
        if (isTypeScriptFile(filePath)) tsFiles.push([rel, filePath])
      } else {
        indexed++
      }
      if (batch.length >= COMMIT_BATCH) flushBatch()
    } catch {
      failures.push(rel)
    }
  }

  // 收尾：写完最后一批 + 清理本轮未见到的旧条目。
  // 截断时**不做 unseen 清理**：没扫到的文件不等于被删了（`truncated` 同时覆盖"读不到的
  // 目录"——那种情况下清理会静默删掉派生索引，见 src/util/fs.js walkDir）。
  const { removed } = commitFileUpdates(store, {
    updates: batch,
    unseen: truncated ? null : seen,
```

</details>

**依据 2 · 源码核查**：[src/index-pipeline.js:46-67](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/index-pipeline.js#L46-L67)

代码复用buffer，文档另调抽取。

<details>
<summary>查看原文（22行）</summary>

```text
export async function planFileIndex({ rel, filePath, kind, config, record, existingEntries = [], size, force = false }) {
  if (!kind) return { key: UNSUPPORTED }
  const fileSize = typeof size === 'number' ? size : statSync(filePath).size
  if (exceedsSizeCap(kind, fileSize, config)) return { key: OVERSIZE }

  // 单次读盘：同一 buffer 供内容哈希与正文解码使用（未变更的文件不解码）。
  const { hash, buffer } = readFileForIndex(filePath)
  // 旧 store 的 doc 条目缺 terms → 即使哈希未变也重抽一次（一次性回填）。
  const backfill = kind === 'doc' && docEntriesNeedBackfill(existingEntries)
  if (!force && record && record.sha256 === hash && !backfill) return { key: UNCHANGED }

  if (kind === 'code') {
    return { key: WRITE, hash, size: fileSize, type: 'code', entries: scanSymbols(rel, filePath, buffer.toString('utf8')) }
  }
  // dump 判定在 buildDocEntries 内部（唯一真源）：不可索引的文档返回 null。
  const entries = await buildDocEntries(rel, filePath, {
    chunkChars: config.chunkChars,
    maxChunks: config.maxChunksPerFile,
    maxFileSizeMb: config.maxFileSizeMb,
    maxPdfPages: config.maxPdfPages,
  })
  return entries === null ? { key: DROP } : { key: WRITE, hash, size: fileSize, type: 'doc', entries }
```

</details>

**依据 3 · 源码核查**：[src/doc-pipeline.js:11-36](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/doc-pipeline.js#L11-L36)

文档重新读原件。

<details>
<summary>查看原文（26行）</summary>

```text
export async function extractTextFromFile(filePath, { maxFileSizeMb = 10, maxPdfPages = 1000 } = {}) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.pdf') {
    if (maxFileSizeMb) {
      const stats = await stat(filePath)
      if (stats.size > maxFileSizeMb * 1024 * 1024) {
        throw new Error(`File too large to index (${(stats.size / 1024 / 1024).toFixed(1)} MB), limit is ${maxFileSizeMb} MB`)
      }
    }
    const result = await parsePdf(filePath, { maxPages: maxPdfPages })
    return result.markdown
  }
  return readTextFile(filePath, maxFileSizeMb ? maxFileSizeMb * 1024 * 1024 : Infinity)
}

/**
 * 文档分片 → 记忆条目（索引期不调用任何模型：纯规则、确定性、可重放）。
 *
 * 注入用 summary 与检索用 terms 分离：
 *   - summary：≤300 字符，进上下文，保持小预算；
 *   - terms：整个 chunk 的字面词项，只进 BM25 检索文本，不进注入。
 * 于是「chunk 只有前 300 字符可检索」的旧限制被移除，且没有任何 LLM 调用。
 * 函数签名里刻意没有 llm —— 索引期零 LLM 由构造保证，而不是靠 catch。
 */
export async function buildDocEntries(relPath, filePath, opts = {}) {
  const text = await extractTextFromFile(filePath, opts)
```

</details>

**依据 4 · 源码核查**：[src/store.js:1295-1304](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/store.js#L1295-L1304)

CAS比较store record。

<details>
<summary>查看原文（10行）</summary>

```text
  applyFileUpdate(relPath, { expectedHash, hash, entries, type, size }) {
    if ((this.fileRecord(relPath)?.sha256 ?? null) !== (expectedHash ?? null)) return false
    this.markFile(relPath, {
      sha256: hash,
      size,
      type,
      indexedAt: new Date().toISOString(),
    })
    this.setEntries(relPath, entries)
    return true
```

</details>

**依据 5 · 源码核查**：[src/util/fs.js:378-391](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/util/fs.js#L378-L391)

git分支stat失败忽略且unreadable空。

<details>
<summary>查看原文（14行）</summary>

```text
    if (files.length >= maxFiles) {
      capped = true
      break
    }
    const abs = path.join(root, rel)
    try {
      if (!statSync(abs).isFile()) continue
    } catch {
      continue
    }
    files.push(abs)
  }
  files.sort()
  return { files, truncated: capped, capped, skipped: [...skipped].sort(), unreadable: [] }
```

</details>

**依据 6 · 源码核查**：[src/store.js:785-832](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/store.js#L785-L832)

目录锁/冲突合并。

<details>
<summary>查看原文（48行）</summary>

```text
    // 跨进程：整段读改写放进目录锁；拿不到锁就保持脏状态，等下一次写重试（不静默丢数据）。
    const release = acquireDirLock(this.dir)
    if (!release) {
      if (!this._lockWarned) {
        this._lockWarned = true
        console.error(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this save was skipped and will retry shortly.`)
      }
      this._scheduleSaveRetry()
      return
    }
    try {
      // 先合并另一进程已落盘的小文档，再写；分片按“加载时 hash”做冲突检测。
      this._mergeAuxFromDisk()
      if (!this._formatWritten) {
        writeJsonAtomic(path.join(this.dir, FORMAT_FILE), { version: 2, layout: 'sharded' })
        this._formatWritten = true
      }
      // 存量压实：≤0.5.10 的分片带着派生字段，而那些字段只在分片被重写时才会从磁盘消失。
      // 每轮最多补写 COMPACT_BATCH 个，让升级后的 store 在后续任意一次 save（watch 轮询、
      // 索引、写入）里自动收敛，而不是永远停在旧体积。
      let compactBudget = COMPACT_BATCH
      for (const rel of this._compactQueue) {
        if (compactBudget <= 0) break
        compactBudget--
        this._compactQueue.delete(rel)
        if (this.files[rel]) this._dirtyShards.add(rel)
      }
      for (const rel of this._dirtyShards) {
        if (this.files[rel]) {
          const nextSha = this.files[rel].sha256 ?? null
          const base = this._baseFileSha.get(rel) ?? null
          const disk = this._shardDiskRecord(rel)
          // 磁盘分片在加载后被别的进程改过，且不是我们这一版：按 indexedAt 收敛，
          // 本地更新则覆盖（否则显式 index 的结果会静默丢掉），对方更新则把对方读回内存。
          if (disk.exists && disk.sha !== base && disk.sha !== nextSha) {
            const localAt = Date.parse(this.files[rel].indexedAt || '') || 0
            const diskAt = Date.parse(disk.record?.indexedAt || '') || 0
            if (localAt > diskAt) {
              writeJsonAtomic(shardRelPath(this.dir, rel), { relPath: rel, record: this.files[rel], entries: (this.entries[rel] || []).map(withoutPersistedDerived) })
              this._baseFileSha.set(rel, nextSha)
              continue
            }
            this._adoptDiskShard(rel, disk)
            this._warnConflict(rel)
            continue
          }
          // 父目录由 writeJsonAtomic 保证
          writeJsonAtomic(shardRelPath(this.dir, rel), { relPath: rel, record: this.files[rel], entries: (this.entries[rel] || []).map(withoutPersistedDerived) })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 召回与触发注入如何约束，是否全文/硬token保证？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

recall逐层top-k并分别归一，经验/insight词法闸门要求不同查询词，真实向量分可豁免；doc/symbol保留短标识符。它是相关性启发式，不是置信概率。触发式准入仅when.ops/writes/intents按OR，guard收窄，无when不触发，draft/archived排除；正文不被当确定性trigger条件，这是把“相关”与“必须知道”分契约的明确设计。

但动作来自已观察结构化调用与人类路径意图，源码说明没有执行前拦截钩子，所以不能宣称严格事前强制规范。注入预算用maxTokens*3字符近似，任务卡优先、trigger后hint；两条通道都调用fitBody，因此“trigger全文”注释被字符预算截断收窄，关键procedure后半可能省略。审计记录reasons/dropped和shadow有助解释，但候选默认最多16、日志轮转，不能当永久完整样本。曝光也不证明Agent采纳或正确执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/recall.js:62-68](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/recall.js#L62-L68)

词法/向量逐条闸门。

```text
function matchedFloor(scored, queries) {
  const qTokens = new Set()
  for (const q of queries) for (const t of tokenizeRaw(String(q ?? ''))) qTokens.add(t)
  const need = Math.min(2, qTokens.size)
  if (need <= 1) return scored
  // `typeof vector === 'number'` 只在融合真给出了有限余弦时为真（见 fuseVectorHits）。
  return scored.filter((r) => typeof r.vector === 'number' || (r.matched ?? 0) >= need)
```

**依据 2 · 源码核查**：[src/readiness.js:295-324](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/readiness.js#L295-L324)

OR触发及无执行前钩子。

<details>
<summary>查看原文（30行）</summary>

```text
 * `when` 是唯一的触发面，三个成员按 OR：`ops`（动作）／`writes`（本次要写的文件）／
 * `intents`（人类消息里剥离引用后的意图词）。`guard` 只能收窄。
 * **没有 `when` 的条目不再触发任何东西**（降级为可发现 + 按需拉取）。
 *
 * @param {object|null} trigger
 * @param {object} ctx - {@link buildReadinessContext} 的结果
 * @returns {string|null} 命中原因（`op:…` / `write:…` / `intent:…`），未命中为 null
 */
export function matchTrigger(trigger, ctx) {
  if (!trigger || typeof trigger !== 'object') return null
  const when = trigger.when
  if (!when || typeof when !== 'object') return null
  if (!guardPass(trigger.guard, ctx)) return null
  for (const op of when.ops || []) {
    if (op && (ctx?.ops || []).includes(String(op))) return `op:${op}`
  }
  // 写目标 = 已观察到的结构化写调用 ∪ 人类消息里提到的路径（动手前的写意图）。
  // DSH 没有工具执行前拦截钩子，动手前唯一能拿到的写意图就是人类消息里的路径；
  // 但动作文本里的**读**路径不算（`read README.md` 不是"即将写 README.md"）。
  const writeTargets = [...(ctx?.targets || []), ...(ctx?.humanPaths || [])]
  for (const w of when.writes || []) {
    // 扩展名/泛名 glob 在这里被硬性忽略：`*.pptx` 这类条件只能撒谎，不能收窄。
    if (!w || isDroppableGlob(w)) continue
    if (matchAnyPath(w, writeTargets)) return `write:${w}`
  }
  const intent = ctx?.intent ?? ctx?.humanText ?? ''
  for (const it of when.intents || []) {
    if (it && matchIntent(it, intent)) return `intent:${it}`
  }
  return null
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:244-257](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/auto-inject.js#L244-L257)

候选过滤draft/archived。

<details>
<summary>查看原文（14行）</summary>

```text
 * 候选在进入匹配前统一走旧 trigger → 新 schema 的归一（幂等，纯内存，不落盘）。 */
function insightCandidates(store, globalStore, task, opts) {
  const out = []
  const seen = new Set()
  const push = (it) => {
    if (!it || it.archived || it.draft) return
    const key = it.id || `${it.kind}:${it.title}`
    if (seen.has(key)) return
    seen.add(key)
    out.push(normalizeTrigger(it, { legacyScope: opts?.legacyScope }))
  }
  for (const it of (store ? store.insightItems() : []) || []) push(it)
  for (const it of (globalStore ? globalStore.items() : []) || []) push(it)
  for (const it of (task && task.insights) || []) push(it)
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:273-277](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/auto-inject.js#L273-L277)

fitBody截断。

```text
/** 把正文塞进剩余预算：放不下就截断；连"有用前缀"都留不下就返回 null（由调用方记 dropped）。 */
export function fitBody(body, remaining, min = MIN_BODY_CHARS.hint) {
  if (remaining < min) return null
  if (body.length <= remaining) return body
  return `${body.slice(0, remaining - 1)}…`
```

**依据 5 · 源码核查**：[src/auto-inject.js:503-575](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/auto-inject.js#L503-L575)

字符近似和两通道共用place。

<details>
<summary>查看原文（73行）</summary>

```text
  // 预算只能是上限，不是目标。两条额度分开：
  //   stepBudget —— 单轮（常驻块 + 条目）共享的 maxTokens；
  //   itemBudget —— 条目还受会话字符额度约束；**常驻块不占这条**（它是状态快照，文档明说不受限）。
  // 旧实现把两者取小成同一个 budgetChars，会话额度用尽后连任务卡都被截成 `…(截断)`。
  const quotaChars = typeof opts.maxChars === 'number' ? opts.maxChars : Infinity
  const maxItems = typeof opts.maxItems === 'number' ? opts.maxItems : Infinity
  const skipItems = opts.skipItems === true
  const stepBudget = Math.max(0, (cfg.maxTokens || 400) * 3)
  const itemBudget = Math.max(0, Math.min(stepBudget, quotaChars))

  const skipItem = typeof opts.skipItem === 'function' ? opts.skipItem : null
  const cands = insightCandidates(store, globalStore, task, cfg).filter((it) => !(skipItem && skipItem(it)))

  // 两条通道：authored trigger（确定性、全文、优先级 1）→ 统计信号提示（优先级 2）。
  const triggered = collectTriggered(cands, ctx)
  if (skipItems) {
    // 会话级限流命中：条目通道本轮整体沉默，但把"本该注入什么"记进 dropped——不做静默降级。
    for (const { it } of triggered) dropped.push({ id: it.id, channel: 'trigger', reason: opts.silenceReason || 'cooldown' })
  }
  // procedure 不进提示通道：它要过 trigger.scope（见 scoreHints 注释）。
  const consumed = new Set(triggered.map((t) => t.it.id))
  // 限流命中时**照旧评分**（只算不注入，`place()` 仍按 skipItems 跳过）：影子记录要能回答
  // "这一步如果不限流会注入什么"——那正是限流期间最需要回答的问题。此前这里直接置空，
  // 实测 1420 个静默步一个候选都没留下。
  const hintCands = cands.filter((it) => !consumed.has(it.id) && it.kind !== 'procedure')
  const { hints, candidates, scoreQuery } = scoreHints({
    cands: hintCands,
    query,
    humanText: ctx.humanText,
    hintQuery: [ctx.intent || ctx.humanText || '', ...(ctx.targets || [])].filter(Boolean).join(' '),
    cfg,
    dropped,
    rerank: opts.rerank || null,
  })

  // 常驻块文本。去重指纹包含“编辑中”行：否则这条常驻状态只会在别的条目变化时顺带更新，
  // 模型会一直看到旧文件列表。editedFiles 只返回文件名（不含时间戳），所以同一个文件
  // 反复写不会改变指纹；只有热点文件集合/顺序变化时才重发整块。
  const echo = cfg.entryOn !== false && shouldEchoTaskCard(task, cfg)
  const entry = echo ? buildEntryContent(task, cfg) : ''
  const entryStable = entry
  let used = entry.length
  let itemUsed = 0
  let itemCount = 0

  /** 把一组候选按优先级放进剩余预算：放不下的进 dropped（quota / budget），不静默。 */
  const place = (channel, list, minChars, labelOf) => {
    for (const { it, why } of list) {
      if (itemCount >= maxItems) {
        dropped.push({ id: it.id, channel, reason: 'quota' })
        continue
      }
      // 条目同时受"单轮剩余"与"会话字符剩余"约束；常驻块只占前者。
      const remaining = Math.min(stepBudget - used, itemBudget - itemUsed)
      const body = fitBody(insightBody(it), remaining, minChars)
      if (body === null) {
        // 带出数字：旧的 `budget` 没有量纲，"还剩 38 字符、这条最少要 120" 与"根本没预算"
        // 在日志里长得一样 —— 配额逼近上限时那条永久静默的细缝因此完全不可诊断。
        dropped.push({ id: it.id, channel, reason: 'budget', remaining, need: minChars })
        continue
      }
      used += body.length + 1
      itemUsed += body.length + 1
      itemCount++
      parts.push(body)
      labels.push(labelOf(it))
      reasons.push({ id: it.id, channel, why, hash: insightItemHash(it), chars: body.length })
    }
  }
  // 限流命中时条目通道整体沉默：triggered 已在上方记进 dropped，这里不再重复排程。
  if (!skipItems) {
    place('trigger', triggered, MIN_BODY_CHARS.trigger, (it) => it.kind)
    place('hint', hints, MIN_BODY_CHARS.hint, () => 'hint')
```

</details>

**依据 6 · 源码核查**：[src/audit.js:95-112](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/audit.js#L95-L112)

shadow候选预算与查询记录。

<details>
<summary>查看原文（18行）</summary>

```text
  const bounded = slim.length <= SHADOW_MAX_CANDIDATES ? slim : (() => {
    const keep = new Set()
    for (const c of slim) if (c.decision === 'cand') keep.add(c.id)
    for (const c of slim) {
      if (keep.size >= SHADOW_MAX_CANDIDATES) break
      keep.add(c.id)
    }
    return slim.filter((c) => keep.has(c.id))
  })()
  return {
    at: new Date().toISOString(),
    session: input.sessionId || null,
    root: input.root || null,
    step: typeof input.step === 'number' ? input.step : null,
    // 人类消息截断保存：没有它就判不了"这次注入该不该"——标签要能回放到当时的场景。
    query: typeof input.query === 'string' ? input.query.slice(0, 300) : '',
    // **实际用于评分**的查询文本（intent + 写目标的拼合）。它和 `query` 不是一回事：
    // 写目标驱动的那些步 `query` 是空的、候选却非空。少了这一栏，判据无法离线重放。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 反思草稿、近邻合并与scope提升怎样保留信任边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

reflection产出task级draft，saveTaskInsight明确draftOnly禁止进入project/global/跨任务自动合并，只在本任务草稿内去重；提升也跳过draft。这能避免未经确认的反思直接污染共享知识。显式编辑或confirm才清draft，不能再把当前版本说成草稿可直接覆盖已确认全局。

剩余关键边界是非草稿写入仍可按向量/词法近邻自动覆盖project/global正文，mergeInto取confidence最大并增加hit/sourceTaskIds；内容相似不等语义等价或适用域相同，错误修订可能继承高confidence。task到project靠两个任务成员加confidence，project到global靠成员数阈值；多个任务可来自同一项目，并没有独立项目/结果正确性证据要求。scope迁移是存储归属变化，不能当知识被验证普适。prev/有限deleted备份有助人工恢复，却不是完整审计版本链。

#### 证据与依据

**依据 1 · 源码核查**：[src/reflection-pipeline.js:101-113](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/reflection-pipeline.js#L101-L113)

反思task草稿。

<details>
<summary>查看原文（13行）</summary>

```text
          raw: {
            title: l.title || l.pattern,
            kind: 'lesson',
            pattern: l.pattern,
            fix: l.fix,
            files: l.files,
            symbols: l.symbols,
            confidence: typeof l.confidence === 'number' ? l.confidence : 0.7,
            draft: true,
          },
          scope: 'task',
          taskId,
          cfg,
```

</details>

**依据 2 · 源码核查**：[src/insight-store.js:932-950](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L932-L950)

draft分支隔离与非草稿project近邻。

<details>
<summary>查看原文（19行）</summary>

```text
function saveTaskInsight(store, globalStore, task, raw, cfg, now, source, cosine) {
  // 反思产出是**待确认草稿**：只落在当前任务，绝不参与 project/global/跨任务的自动合并或
  // 自动提升。否则一条 LLM 生成的 draft 可以覆盖作者手写的 project 级知识，草稿审核也就
  // 失去意义。确认走显式编辑（applyUpdate 会清 draft）或面板的 confirm。
  const draftOnly = raw.draft === true || source === 'reflect'
  const base = { ...raw, source, sourceTaskIds: [task.id] }
  const text = insightMatchText(base)
  if (!draftOnly) {
    // 1) 已有 project 级知识 → 挂成员/命中，不再在 task 层重复存
    const pjItems = store.insightItems()
    const pjNear = vectorNear(vectorText(base), pjItems, cosine)
    const pjTarget = autoMergeTarget(pjNear, cfg)
    if (pjTarget) {
      const { replaced } = mergeInto(pjTarget.item, base, cfg, now)
      store.replaceInsightItems(pjItems)
      applyDecay(pjItems, cfg, now)
      pruneItems(pjItems, cfg.maxProject, now)
      const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
      return { ok: true, action: 'auto-merged', id: pjTarget.item.id, scope: 'project', replaced, cos: Number(pjTarget.top1.toFixed(3)), hint: `相似度 ${pjTarget.top1.toFixed(3)}，已自动覆盖 project 级既有条目${replaced.length ? `（覆盖字段 ${replaced.join('/')}）` : ''}${promoted ? '；已自动提升 global' : ''}` }
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:961-979](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L961-L979)

非草稿global合并。

<details>
<summary>查看原文（19行）</summary>

```text
    // 2) 已有 global 级知识 → 同样只挂命中
    if (globalStore) {
      const glNear = vectorNear(vectorText(base), globalStore.items(), cosine)
      const glTarget = autoMergeTarget(glNear, cfg)
      if (glTarget) {
        const { replaced } = mergeInto(glTarget.item, base, cfg, now)
        globalStore.markDirty()
        return { ok: true, action: 'auto-merged', id: glTarget.item.id, scope: 'global', replaced, cos: Number(glTarget.top1.toFixed(3)), hint: `相似度 ${glTarget.top1.toFixed(3)}，已自动覆盖 global 级既有条目${replaced.length ? `（覆盖字段 ${replaced.join('/')}）` : ''}` }
      }
      const glHit = findBestOverlapMatch(text, globalStore.items())
      if (glHit && glHit.score >= cfg.dedupOverlap) {
        const { replaced } = mergeInto(glHit.item, base, cfg, now)
        globalStore.markDirty()
        return { ok: true, action: 'linked-global', id: glHit.item.id, scope: 'global', replaced, hint: `该知识已在 global 级，累计第 ${(glHit.item.sourceTaskIds || []).length} 个任务命中` }
      }
    }
    // 3) 跨任务池去重合并（同一坑只留一份，sourceTaskIds 累积）。
    // 草稿不是已确认知识：非草稿写入不得把正文并进一条 draft（那会让新知识永远停在待审状态）。
    const pool = allTaskInsights(store).filter((it) => it.draft !== true)
```

</details>

**依据 4 · 源码核查**：[src/insight-store.js:220-238](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L220-L238)

正文覆盖/最高confidence/成员累积。

<details>
<summary>查看原文（19行）</summary>

```text
export function mergeInto(existing, base, cfg, nowIso) {
  const now = nowIso || new Date().toISOString()
  existing.sourceTaskIds = unionStrings(existing.sourceTaskIds, base.sourceTaskIds)
  existing.files = unionStrings(existing.files, base.files)
  existing.symbols = unionStrings(existing.symbols, base.symbols)
  existing.tags = unionStrings(existing.tags, base.tags)
  const replaced = []
  for (const f of MERGE_FIELDS) {
    const b = base[f]
    if (b === undefined || b === null || b === '') continue
    putField(existing, f, String(b), replaced)
  }
  if (Array.isArray(base.steps) && base.steps.length) putField(existing, 'steps', base.steps.map(String), replaced)
  if (base.trigger && typeof base.trigger === 'object') putField(existing, 'trigger', base.trigger, replaced)
  existing.confidence = Math.max(num(existing.confidence, 0.5), num(base.confidence, 0.5))
  existing.hitCount = (existing.hitCount || 0) + 1
  existing.lastHitAt = now
  existing.updatedAt = now
  if (existing.archived) existing.archived = false // 重新被使用 → 复活
```

</details>

**依据 5 · 源码核查**：[src/insight-store.js:1036-1064](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L1036-L1064)

task提升跳过draft。

<details>
<summary>查看原文（29行）</summary>

```text
export function promoteAllTasksToProject(store, globalStore, cfg, now) {
  const tasks = store.getTasks() || []
  let promoted = 0
  for (const task of tasks) {
    const list = task.insights || []
    for (const ins of [...list]) {
      if (ins.scope && ins.scope !== 'task') continue
      // 草稿必须先被确认；自动提升绕过审核就等于把 reflection 的猜测变成项目资产。
      if (ins.draft === true) continue
      const members = new Set(ins.sourceTaskIds || [])
      if (members.size < 2) continue
      if (num(ins.confidence, 0) < cfg.promoteConfidence) continue
      // 与 project 已有资产去重：重复 → 并成员，删 task 副本
      const pjItems = store.insightItems()
      const pjHit = findBestOverlapMatch(insightMatchText(ins), pjItems)
      if (pjHit && pjHit.score >= cfg.dedupOverlap) {
        mergeInto(pjHit.item, { sourceTaskIds: ins.sourceTaskIds, files: ins.files, symbols: ins.symbols, tags: ins.tags, confidence: ins.confidence }, cfg, now)
        store.replaceInsightItems(pjItems)
        removeFromTask(store, ins.id)
        promoted++
        continue
      }
      const moved = carryUsageFields(
        normalizeInsight(ins, { scope: 'project', source: ins.source, nowIso: now }),
        ins,
      )
      moved.id = ins.id
      moved.draft = false
      moved.confidence = num(ins.confidence, cfg.promoteConfidence)
```

</details>

**依据 6 · 源码核查**：[src/insight-store.js:1081-1103](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L1081-L1103)

global提升看任务成员数。

<details>
<summary>查看原文（23行）</summary>

```text
/** project 扫描：sourceTaskIds ≥ globalPromoteTasks → 升 global。返回移动条数。 */
export function promoteProjectToGlobal(store, globalStore, cfg, now) {
  if (!globalStore) return 0
  const items = store.insightItems()
  let moved = 0
  for (const ins of [...items]) {
    if (ins.scope && ins.scope !== 'project') continue
    if (ins.draft === true) continue
    const members = new Set(ins.sourceTaskIds || [])
    if (members.size < cfg.globalPromoteTasks) continue
    const glItems = globalStore.items()
    const glHit = findBestOverlapMatch(insightMatchText(ins), glItems)
    if (glHit && glHit.score >= cfg.dedupOverlap) {
      mergeInto(glHit.item, { sourceTaskIds: ins.sourceTaskIds, files: ins.files, symbols: ins.symbols, tags: ins.tags, confidence: ins.confidence }, cfg, now)
    } else {
      const movedIns = carryUsageFields(
        normalizeInsight(ins, { scope: 'global', source: ins.source, nowIso: now }),
        ins,
      )
      movedIns.id = ins.id
      movedIns.draft = false
      movedIns.confidence = num(ins.confidence, cfg.promoteConfidence)
      movedIns.movedFrom = { scope: 'project', id: ins.id, at: now }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · TaskBridge、向量和维护各承担什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

TaskBridge监听todo/write，把非子代理首次非空清单建为任务并绑定，后续步骤覆盖；子代理通过origin/delegationDepth识别，不将普通fork血缘误判为子代理。反向接管写todo快照，能减少手工续接，但步骤更新与模型业务是否完成不同；共享同任务并发写仍需用户核最新任务。

启动需DSH公开tools/llm/skills等匹配接口、pdfjs文本解析与Node条件；leanvec是optional依赖、作者称79MB默认启用，不是外部向量数据库。词表hash+向量字节数近似指纹会漏同尺寸内容变更。索引不调用LLM，但可选query expansion/reflection会消耗模型，reflection默认关；watch/lazy、向量/RSS和日志仍有资源与隐私成本。

首次选根、排秘密并核引用，持续审核知识/跨scope与前缀截断，失败要查分片/辅助文件/锁/有限备份、重建和纠错。目录锁拿不到保持dirty有限延迟重试，并非调用完成即耐久。自我gitignore减少误提交但已tracked/强制add不受忽略保护；忘记/清缓存与敏感材料退出需分开。现金、人时、同规模质量收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/setup/taskbridge.js:100-107](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/setup/taskbridge.js#L100-L107)

子代理判别。

```text
 * `origin: 'subagent'` 与 `delegationDepth`（parent depth + 1）。
 * 刻意不看 parentSession —— 那是 fork/seed 血缘，用户 fork 出来的顶层会话同样带它。
 */
export function isSubagentSession(session) {
  const header = session?.header
  if (!header) return false
  if (header.origin === 'subagent') return true
  return typeof header.delegationDepth === 'number' && header.delegationDepth > 0
```

**依据 2 · 源码核查**：[src/setup/taskbridge.js:217-250](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/setup/taskbridge.js#L217-L250)

todo建档/覆盖。

<details>
<summary>查看原文（34行）</summary>

```text
  if (type === 'todo/write') {
    const todos = event.data?.todos
    if (!Array.isArray(todos)) return
    store.commit((s) => {
      let task = s.getBoundTaskId(sessionId) ? s.getTask(s.getBoundTaskId(sessionId)) : null
      if (!task || task.archived) {
        // 空写 = 清空清单：不自动建档（避免"未绑定会话清空 todo"误建垃圾任务）
        if (todos.length === 0) return
        // 子代理会话不建档：否则每个子代理都铸一条项目任务（子代理任务融合另行设计）
        if (isSubagentSession(session)) return
        const title = pickTitle(meta.get(sessionId), todos)
        task = {
          id: genTaskId(root, title),
          projectHash: hash8(root),
          projectRoot: root,
          title,
          steps: null,
          files: [],
          fileMeta: {},
          archived: false,
          lastSessionId: sessionId,
          createdAt: now,
          updatedAt: now,
          lastActiveAt: now,
        }
        s.addTask(task)
        s.setBinding(sessionId, task.id)
      }
      task.steps = todos
      task.lastTodoAt = now // 模型/todo 最近一次自维护时刻
      task.updatedAt = now
      task.lastActiveAt = now
      task.lastSessionId = sessionId
      s.markTasksDirty()
```

</details>

**依据 3 · 源码核查**：[src/index.js:84-95](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/index.js#L84-L95)

反思默认关与注入预算。

<details>
<summary>查看原文（12行）</summary>

```text
  // 反思管线（召回期可选 LLM 消费点，默认关）。产出只写 task 级草稿。
  reflection: Schema.object({
    enabled: Schema.boolean().default(false),
    cooldownMs: Schema.number().default(1800000),
    maxLessonsPerReflect: Schema.number().default(3),
    maxDecisionsPerReflect: Schema.number().default(2),
  }).default({}),
  // PR 2：静默注入（entry 常驻块 + relevance 门控）。无项目 root 可解析时零副作用
  autoContext: Schema.object({
    enabled: Schema.boolean().default(true),
    entryOn: Schema.boolean().default(true),
    maxTokens: Schema.number().default(400),
```

</details>

**依据 4 · 源码核查**：[src/vector-index.js:41-55](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/vector-index.js#L41-L55)

近似模型指纹。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * leanvec 的模型指纹：词表内容 sha256 + 向量表字节数。
 *
 * 词表决定 token id、向量表按同一 id 排布，任一变化都必须让旧向量作废。
 * 表全文哈希要 ~0.2s，与省下的 0.4s 相抵，所以用"内容哈希 + 字节数"近似——
 * 只有"表内容变了但字节数恰好相同且词表没变"这种极罕见情形会漏判，日后再加密实指纹。
 * @returns {string|null} null = 这个目录不是一份可用的 leanvec
 */
export function leanvecFingerprint(modelDir) {
  if (!modelDir) return null
  const tj = join(modelDir, 'dist', 'leanvec.tokenizer.json')
  const tb = join(modelDir, 'dist', 'leanvec.f32')
  if (!existsSync(tj) || !existsSync(tb)) return null
  const h = createHash('sha256').update(readFileSync(tj)).digest('hex').slice(0, 16)
  return `l1:${h}:${statSync(tb).size}`
```

</details>

**依据 5 · 源码核查**：[src/store.js:785-793](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/store.js#L785-L793)

锁竞争保dirty。

```text
    // 跨进程：整段读改写放进目录锁；拿不到锁就保持脏状态，等下一次写重试（不静默丢数据）。
    const release = acquireDirLock(this.dir)
    if (!release) {
      if (!this._lockWarned) {
        this._lockWarned = true
        console.error(`[dsh-project-memory] store ${this.dir} is busy (another dsh process is writing); this save was skipped and will retry shortly.`)
      }
      this._scheduleSaveRetry()
      return
```

**依据 6 · 源码核查**：[src/store.js:913-925](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/store.js#L913-L925)

有限延迟重试。

<details>
<summary>查看原文（13行）</summary>

```text
  /** 锁竞争后的有限次延迟重试；失败仍保持脏状态，下一次写继续尝试。 */
  _scheduleSaveRetry() {
    if (this._saveRetryTimer || this._saveRetryAttempts >= 3) return
    this._saveRetryAttempts++
    this._saveRetryTimer = setTimeout(() => {
      this._saveRetryTimer = null
      try {
        this.save()
      } catch (err) {
        console.error(`[dsh-project-memory] deferred save failed: ${err?.message || err}`)
      }
    }, 100)
    this._saveRetryTimer.unref?.()
```

</details>

**依据 7 · 源码核查**：[src/store.js:733-748](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/store.js#L733-L748)

自我忽略与强制跟踪边界。

<details>
<summary>查看原文（16行）</summary>

```text
   * store 目录**自我忽略**：在目录里放一个内容为 `*` 的 `.gitignore`。
   *
   * 为什么不写进用户的 `.gitignore`：那是用户的文件，插件不该改；而且"忘了加"的代价
   * 是一次误提交。为什么这样就够：git 会读取工作区里**任意**目录下的 `.gitignore`，
   * 而 `*` 连这个 `.gitignore` 自己一起命中，于是 `git status` / `git add -A` 里整棵树
   * 都不出现，用户一个字都不用写（`git check-ignore -v` 可复核）。
   *
   * 顺带的好处：被忽略的文件不会被 `git clean -fd` 删除（未跟踪且未忽略的会被删）。
   * 想把记忆跟着仓库提交：`git add -f .dsh-project-memory`——已跟踪的文件不受忽略规则影响。
   */
  ensureSelfIgnore() {
    if (!existsSafe(this.dir)) return
    const file = path.join(this.dir, GITIGNORE_FILE)
    if (existsSafe(file)) return
    try {
      writeFileSync(file, '# dsh-project-memory: local by default. `git add -f` to commit it.\n*\n')
```

</details>

#### 缺口

- 真实宿主任务同步、检索质量、资源与退出恢复未测
  **影响**：不能承诺节省时间或全场景引用新鲜
  **进一步探讨**：固定项目/模型比较rg+笔记与插件，核合格任务、返工、RSS/IO/模型费及锁冲突恢复

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 何时试用，如何证伪来源/审批修订链假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

长期单项目非敏感资料可试用，先少量索引/人工经验，核路径行号、触发全文是否被截与全局提升，保留权威原件；反思/扩展默认关闭，避免把相似或命中当正确。跨项目严隔离、高审计或敏感材料场景应先观察。验收以同任务合格交付与人工返工，而不是hit@k或注入曝光。

未验证假设为给insight修订绑定来源版本、适用项目/条件和审批摘要：正文自动合并只生成待审修订，只有结果验证或显式确认才更新已确认版本；global提升按独立适用域/成功任务证据而非单纯任务数。trigger提供完整内容所需长度，放不下则给可拉取引用并明确缺正文。由非草稿近邻继承信任、统计提升和预算截断推导，可能降低知识污染而保持续接价值，代价是审核/存储和少自动化。最小对照同项目三个相似但互斥规则、跨项目近邻、长procedure与并发改文档，比较约束违背、陈旧引用、合格率及审核分钟；若污染不降或审核超过人工笔记则否定收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/insight-store.js:220-238](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L220-L238)

覆盖与信任保留推导依据。

<details>
<summary>查看原文（19行）</summary>

```text
export function mergeInto(existing, base, cfg, nowIso) {
  const now = nowIso || new Date().toISOString()
  existing.sourceTaskIds = unionStrings(existing.sourceTaskIds, base.sourceTaskIds)
  existing.files = unionStrings(existing.files, base.files)
  existing.symbols = unionStrings(existing.symbols, base.symbols)
  existing.tags = unionStrings(existing.tags, base.tags)
  const replaced = []
  for (const f of MERGE_FIELDS) {
    const b = base[f]
    if (b === undefined || b === null || b === '') continue
    putField(existing, f, String(b), replaced)
  }
  if (Array.isArray(base.steps) && base.steps.length) putField(existing, 'steps', base.steps.map(String), replaced)
  if (base.trigger && typeof base.trigger === 'object') putField(existing, 'trigger', base.trigger, replaced)
  existing.confidence = Math.max(num(existing.confidence, 0.5), num(base.confidence, 0.5))
  existing.hitCount = (existing.hitCount || 0) + 1
  existing.lastHitAt = now
  existing.updatedAt = now
  if (existing.archived) existing.archived = false // 重新被使用 → 复活
```

</details>

**依据 2 · 源码核查**：[src/insight-store.js:1081-1103](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/insight-store.js#L1081-L1103)

任务数提升依据。

<details>
<summary>查看原文（23行）</summary>

```text
/** project 扫描：sourceTaskIds ≥ globalPromoteTasks → 升 global。返回移动条数。 */
export function promoteProjectToGlobal(store, globalStore, cfg, now) {
  if (!globalStore) return 0
  const items = store.insightItems()
  let moved = 0
  for (const ins of [...items]) {
    if (ins.scope && ins.scope !== 'project') continue
    if (ins.draft === true) continue
    const members = new Set(ins.sourceTaskIds || [])
    if (members.size < cfg.globalPromoteTasks) continue
    const glItems = globalStore.items()
    const glHit = findBestOverlapMatch(insightMatchText(ins), glItems)
    if (glHit && glHit.score >= cfg.dedupOverlap) {
      mergeInto(glHit.item, { sourceTaskIds: ins.sourceTaskIds, files: ins.files, symbols: ins.symbols, tags: ins.tags, confidence: ins.confidence }, cfg, now)
    } else {
      const movedIns = carryUsageFields(
        normalizeInsight(ins, { scope: 'global', source: ins.source, nowIso: now }),
        ins,
      )
      movedIns.id = ins.id
      movedIns.draft = false
      movedIns.confidence = num(ins.confidence, cfg.promoteConfidence)
      movedIns.movedFrom = { scope: 'project', id: ins.id, at: now }
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:548-575](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/auto-inject.js#L548-L575)

触发同样预算截断。

<details>
<summary>查看原文（28行）</summary>

```text
  /** 把一组候选按优先级放进剩余预算：放不下的进 dropped（quota / budget），不静默。 */
  const place = (channel, list, minChars, labelOf) => {
    for (const { it, why } of list) {
      if (itemCount >= maxItems) {
        dropped.push({ id: it.id, channel, reason: 'quota' })
        continue
      }
      // 条目同时受"单轮剩余"与"会话字符剩余"约束；常驻块只占前者。
      const remaining = Math.min(stepBudget - used, itemBudget - itemUsed)
      const body = fitBody(insightBody(it), remaining, minChars)
      if (body === null) {
        // 带出数字：旧的 `budget` 没有量纲，"还剩 38 字符、这条最少要 120" 与"根本没预算"
        // 在日志里长得一样 —— 配额逼近上限时那条永久静默的细缝因此完全不可诊断。
        dropped.push({ id: it.id, channel, reason: 'budget', remaining, need: minChars })
        continue
      }
      used += body.length + 1
      itemUsed += body.length + 1
      itemCount++
      parts.push(body)
      labels.push(labelOf(it))
      reasons.push({ id: it.id, channel, why, hash: insightItemHash(it), chars: body.length })
    }
  }
  // 限流命中时条目通道整体沉默：triggered 已在上方记进 dropped，这里不再重复排程。
  if (!skipItems) {
    place('trigger', triggered, MIN_BODY_CHARS.trigger, (it) => it.kind)
    place('hint', hints, MIN_BODY_CHARS.hint, () => 'hint')
```

</details>

**依据 4 · 源码核查**：[src/index-pipeline.js:46-67](https://github.com/00080000/dsh-project-memory/blob/cd6c2c38cffe989e155b54662786850b83366f7f/src/index-pipeline.js#L46-L67)

索引源版本竞态。

<details>
<summary>查看原文（22行）</summary>

```text
export async function planFileIndex({ rel, filePath, kind, config, record, existingEntries = [], size, force = false }) {
  if (!kind) return { key: UNSUPPORTED }
  const fileSize = typeof size === 'number' ? size : statSync(filePath).size
  if (exceedsSizeCap(kind, fileSize, config)) return { key: OVERSIZE }

  // 单次读盘：同一 buffer 供内容哈希与正文解码使用（未变更的文件不解码）。
  const { hash, buffer } = readFileForIndex(filePath)
  // 旧 store 的 doc 条目缺 terms → 即使哈希未变也重抽一次（一次性回填）。
  const backfill = kind === 'doc' && docEntriesNeedBackfill(existingEntries)
  if (!force && record && record.sha256 === hash && !backfill) return { key: UNCHANGED }

  if (kind === 'code') {
    return { key: WRITE, hash, size: fileSize, type: 'code', entries: scanSymbols(rel, filePath, buffer.toString('utf8')) }
  }
  // dump 判定在 buildDocEntries 内部（唯一真源）：不可索引的文档返回 null。
  const entries = await buildDocEntries(rel, filePath, {
    chunkChars: config.chunkChars,
    maxChunks: config.maxChunksPerFile,
    maxFileSizeMb: config.maxFileSizeMb,
    maxPdfPages: config.maxPdfPages,
  })
  return entries === null ? { key: DROP } : { key: WRITE, hash, size: fileSize, type: 'doc', entries }
```

</details>

#### 缺口

- 来源/审批链与合格任务收益未实现验证
  **影响**：只能列未验证设计，不能记当前能力
  **进一步探讨**：按互斥规则/跨项目/长procedure/并发改文档固定对照约束违背、陈旧、质量和人工

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
