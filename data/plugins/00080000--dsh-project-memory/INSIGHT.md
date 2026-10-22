# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[70aa69b](https://github.com/00080000/dsh-project-memory/tree/70aa69b06af58b33f9de98f7e6cc085877063714)

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)
<!-- END META -->

> **实现功能**：为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。

> **核心亮点**：将索引材料召回和动手前须知分契约，结合TaskBridge、统一insight范围流转与候选/预算审计，减少重复上下文接线；不把文本近邻当独立知识验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **风险与缺陷**：reflection虽生成task草稿，近邻路径仍可覆盖已有project/global正文而保留其审批状态；全局提升依任务数，字符预算/曝光不等于硬token和验证。根护栏不是数据沙箱，未复现污染。详见[Q04](#research-q04)、[Q05](#research-q05)。

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
  - [Q01 · 项目记忆服务什么任务，效果如何判断？](#detail-section-11)
  - [Q02 · 文档/代码索引与增量召回怎样工作？](#detail-section-12)
  - [Q03 · insight与TaskBridge带来什么贡献？](#detail-section-13)
  - [Q04 · 自动注入怎样控制相关性、预算和副作用？](#detail-section-14)
  - [Q05 · 根目录、数据来源和跨层记忆边界在哪里？](#detail-section-15)
  - [Q06 · 启动与操作依赖什么？](#detail-section-16)
  - [Q07 · 工程恢复、缓存与审计怎样组织？](#detail-section-17)
  - [Q08 · 首次、持续与恢复成本，效果证据到哪层？](#detail-section-18)
  - [Q09 · 采用建议与未来假设怎样证伪？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在同一项目持续开发或读文档的DSH用户。项目代码符号、PDF/MD/text摘要和已形成的经验可以跨会话召回，TaskBridge保存任务/文件线索，自动注入在动手前提供相关提示。输入是本地项目材料、会话todo/工具动作与用户写的经验，不是外部权威知识库。

合格任务应能找到当前版本的相关文件/规则，正确引用并由Agent打开原文核对，再在实际代码/问题上交付合格结果。path:line只说明索引生成时的定位，不冻结仓库版本；文档summary、标签confidence和命中次数不证明内容真实或适用。真正收益需比较约束遗漏、答案正确与人工返工，不能由hit@k或注入次数代替。

参照为rg/IDE符号查找加手工项目笔记/AGENTS，插件减少重复索引和上下文接线，但维护更多持久状态。适合长期项目与可公开给模型的经验；一次性目录、多人隔离要求高或必须保留完整审计原文时，应先核对根解析、全局知识流转和删除/覆盖边界。

TaskBridge监听todo/write，把非空清单自动建任务/绑定会话，排除子代理自动建档；后续同步steps与文件热点，选择旧任务时可将其步骤反向推入宿主todo/write。/tasks集中驱动任务与记忆审核动作，减少模型工具和界面各维护一份任务的漂移，但模型todo仍不是独立任务验收。

经验、lesson、decision、procedure统一进入insight实体，支持task/project/global。相似标题的向量分或词法重叠决定覆盖/强化/新建，旧字段保留prev；两任务命中且confidence门槛可升project，多任务再升global。reflection默认关，开启后模型从任务快照产草稿。贡献是“检索材料”和“做事前须知”两条交付契约加任务绑定、范围流转与可观测门控，而非新embedding模型或自动正确的经验学习。

这些机制有实际可迁移的工程组合，尤其分层召回、自动注入与审计共用候选结构。然而相似度对应的是文本近邻，两个任务重复写同一错结论仍可能强化或扩大scope；自动提升不等于经过独立检验，必须结合Q05的草稿合并范围理解。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 项目索引 | 文档chunk/代码符号分片与增量 | 有扫描/体积上限，PDF不含OCR |
| 分层召回 | 词法+可选经验/insight语义 | 分数相对，引用需读当前原文 |
| 经验/知识 | task/project/global与近邻覆盖 | 相似/任务数不证明正确，跨域需审核 |
| 任务桥 | todo绑定、历史任务与反向同步 | 宿主task事实不等于业务验收 |
| 自动上下文 | trigger/hint、预算/冷却/熔断 | 字符近似token，关键项仍可能漏注 |
| 审计与UI | 候选/注入/范围变化可见 | 日志轮转/裁剪，不是完整永久历史 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18及DSH接口代际 | 包声明/host必需 | tools/llm、fs观察、pre-step与会话事件 | 声明范围不等于所有宿主实际兼容 |
| pdfjs-dist | 包运行依赖 | PDF文本抽取 | 扫描PDF图片无OCR文本层保障 |
| TypeScript | 可选peer | 代码类型/符号增强 | 关闭或缺失退弱提取，不等价结果 |
| leanvec | optional dependency | 经验/insight语义排序/写近邻 | 不可用退词法，准确率会变化 |
| 安全项目根与可写store | 索引/任务必需 | shards/tasks/insights与审计 | 危险根自动链停用，显式配置需慎核 |
| 模型路由 | 可选扩展/反思需要 | query expansion和draft生成 | 默认两功能关；无route降级 |
| Web客户端/commands | UI与/tasks需要 | 任务面板与审核卡 | host工具可用不等于所有面板就绪 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，备份现有project/global store | 明确工作区、秘密及全局范围 |
| 安装 | Web或目标profile挂载，核工具与cwd | 不在家目录/容器根盲开全扫 |
| 建索引 | 先少量已知文件或按读lazy，再看stats/截断 | 有引用且当前原文可核对 |
| 召回 | query_memory分层读结果，再打开来源 | 不以score当事实confidence |
| 任务知识 | 绑定任务，审核scope/draft/近邻覆盖 | 关闭反思不消除手动global写入 |
| 调整恢复 | 比较审计/影子候选与实际任务，备份后更改阈值 | 删除仅最近少量可回找，避免盲删 |

本轮不运行插件、PDF、模型调用、测试或普通宿主冒烟。最低版本仅按声明，作者benchmark不当本轮执行数据。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 文件/PDF抽取、符号/词项、optional向量资源 | 选根、去秘密、设置任务和知识范围 | 20000文件/12深度是局部扫描上限，不是常驻内存保证 |
| 持续使用 | watch/lazy IO、候选打分、近似400-token上下文、审计与向量缓存 | 核对引用、新鲜度、近邻覆盖和全局知识 | 索引期无LLM，扩展/反思另计模型成本 |
| 失败恢复 | shards/辅助文件/global原件和有限prev/deleted备份 | 查截断、根错位、误覆盖/提升与重建 | 不是完整历史版本库，恢复投入随语料变化 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 索引 | 哈希增量、分片、词项与可定位引用 | 任意语料完整/引用持续有效 |
| 检索 | 分层top-k、词法/向量融合和门控 | 真实用户相关性及知识适用性 |
| 工作流 | todo绑定/反向同步、记忆范围与自动提示 | 任务质量和减少返工 |
| 可观察性 | 注入/候选/预算留痕 | 永久完整日志或曝光即采纳 |

README和源码注释列出特定语料的大小/延迟/hit@k、向量包/RSS数据，这些是作者报告与标定，不是本轮重复测量，不外推所有项目。库越大、PDF越多与长标题/中文混合都会改变IO、内存与token。默认懒索引降低初始扫描负担，但并不免除持续检查资料有效性。

> **思考**：reflection虽生成task草稿，近邻路径仍可覆盖已有project/global正文而保留其审批状态；全局提升依任务数，字符预算/曝光不等于硬token和验证。根护栏不是数据沙箱，未复现污染。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将索引材料召回和动手前须知分契约，结合TaskBridge、统一insight范围流转与候选/预算审计，减少重复上下文接线；不把文本近邻当独立知识验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

将索引材料召回和动手前须知分契约，结合TaskBridge、统一insight范围流转与候选/预算审计，减少重复上下文接线；不把文本近邻当独立知识验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

分片按源文件保存，派生doc→symbol关系不持久化，脏分片写入减少整库重写；加载复用跨实例快照与版本，单文件更新用expectedHash避免同进程编排互相覆盖。writeJsonAtomic用带pid临时文件rename，失败清tmp并抛出；多文件save顺序写格式、shards、insights/tasks/binding，仍不是整库崩溃原子事务，也未构成跨进程锁。

watch递归setTimeout避免常态重叠，活动/空闲与变化调节轮询，stop后不再排下一轮；lazy按fs/observed去抖，卸载清timer。已经在跑的异步抽取/反思不因清timer自然取消，autoIndexOnFirstUse的cancelled仅控制日志，不能据此承诺卸载后绝无写入。

注入审计记真正注入，shadow记每步候选和拒绝原因，均有大小轮转与异常旁路。它们利于离线解释阈值，但16候选默认截断、日志会轮转，不是永久完整训练集；内容含query、工具动作/路径，需和源材料同等管理。vector指纹只哈希词表加向量文件字节数，相同词表/大小但向量内容改变会漏失效，这是作者明确近似取舍。

<a id="detail-section-5"></a>

### 1.4 主要限制

reflection虽生成task草稿，近邻路径仍可覆盖已有project/global正文而保留其审批状态；全局提升依任务数，字符预算/曝光不等于硬token和验证。根护栏不是数据沙箱，未复现污染。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用。先非敏感单项目/少量人工经验，核对引用和注入日志；反思/扩展保持默认关，global知识与近邻覆盖先审核，重要规范保留权威原件。详见[Q09](#research-q09)。

合格任务应能找到当前版本的相关文件/规则，正确引用并由Agent打开原文核对，再在实际代码/问题上交付合格结果。path:line只说明索引生成时的定位，不冻结仓库版本；文档summary、标签confidence和命中次数不证明内容真实或适用。真正收益需比较约束遗漏、答案正确与人工返工，不能由hit@k或注入次数代替。

参照为rg/IDE符号查找加手工项目笔记/AGENTS，插件减少重复索引和上下文接线，但维护更多持久状态。适合长期项目与可公开给模型的经验；一次性目录、多人隔离要求高或必须保留完整审计原文时，应先核对根解析、全局知识流转和删除/覆盖边界。

采用建议：有试用。先非敏感单项目/少量人工经验，核对引用和注入日志；反思/扩展保持默认关，global知识与近邻覆盖先审核，重要规范保留权威原件。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/recall.js、src/insight-store.js、src/index-pipeline.js、src/doc-pipeline.js、src/parsers/pdfjs-parser.js、src/store.js、src/util/fs.js、src/tools/query-memory.js、src/setup/taskbridge.js、src/index.js、src/reflection-pipeline.js、src/auto-inject.js、package.json、src/watch.js、src/lazy.js、src/audit.js、src/vector-index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查共享文件索引、doc抽取、shard/CAS、分层召回、autoInject门控/预算、TaskBridge、reflection到跨scope合并和global提升、root/scan及审计；未穷尽所有UI、解析器/符号语言或完整host契约，不运行目标。
- 下一步：进一步探讨分四步进行：

1. 固定中文、代码和长提示问题集，保存全部召回候选与遗漏真值，比较实际 token 和后续任务遵循。
2. 在非敏感独立项目根中放入确认知识与同标题反思草稿，追踪 scope、draft、prev 和实际注入内容。
3. 固定语料、任务、模型和压缩点，测召回错误、RSS、人工返工和恢复时间。
4. 用两个项目、冲突近邻和过期来源检验污染与漏注；若错误知识扩大或审核成本超过节省时间，则停止自动提升与反思。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.3（[固定提交 70aa69b](https://github.com/00080000/dsh-project-memory/tree/70aa69b06af58b33f9de98f7e6cc085877063714)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索来源版本/适用域/审批修订链，将草稿建议、相似、曝光和结果验证分开，比较跨scope错误、任务违约与审核负担；未实现。详见[Q09](#research-q09)。

进一步探讨分四步进行：

1. 固定中文、代码和长提示问题集，保存全部召回候选与遗漏真值，比较实际 token 和后续任务遵循。
2. 在非敏感独立项目根中放入确认知识与同标题反思草稿，追踪 scope、draft、prev 和实际注入内容。
3. 固定语料、任务、模型和压缩点，测召回错误、RSS、人工返工和恢复时间。
4. 用两个项目、冲突近邻和过期来源检验污染与漏注；若错误知识扩大或审核成本超过节省时间，则停止自动提升与反思。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2267 | — | — | 48660 |
| .js | source | 53 | 15393 | 11132 | 3711 | — |
| .mjs | source | 6 | 1458 | 1201 | 155 | — |
| .ts | source | 10 | 1449 | 1020 | 342 | — |
| .tsx | source | 5 | 1619 | 1370 | 166 | — |
| .mjs | test | 44 | 10431 | 8366 | 1291 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-22T15%3A11%3A49.244Z..2026-10-22T15%3A11%3A49.244Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A11%3A49.244Z..2026-10-22T15%3A11%3A49.244Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断项目索引/任务/insight与自动注入的贡献和边界，重点核查草稿跨scope、相关性/预算和持久化恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目记忆服务什么任务，效果如何判断？

**研究主题**：场景与需求

#### 完整回答

面向在同一项目持续开发或读文档的DSH用户。项目代码符号、PDF/MD/text摘要和已形成的经验可以跨会话召回，TaskBridge保存任务/文件线索，自动注入在动手前提供相关提示。输入是本地项目材料、会话todo/工具动作与用户写的经验，不是外部权威知识库。

合格任务应能找到当前版本的相关文件/规则，正确引用并由Agent打开原文核对，再在实际代码/问题上交付合格结果。path:line只说明索引生成时的定位，不冻结仓库版本；文档summary、标签confidence和命中次数不证明内容真实或适用。真正收益需比较约束遗漏、答案正确与人工返工，不能由hit@k或注入次数代替。

参照为rg/IDE符号查找加手工项目笔记/AGENTS，插件减少重复索引和上下文接线，但维护更多持久状态。适合长期项目与可公开给模型的经验；一次性目录、多人隔离要求高或必须保留完整审计原文时，应先核对根解析、全局知识流转和删除/覆盖边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/README.md#L1-L17)

当前固定版本复核。作者定义项目记忆及召回用途。

<details>
<summary>查看原文（17行）</summary>

```text
# dsh-project-memory

> 如果这个插件帮你省下 1 小时 Debug 时间，请点个 Star。

[English](README.md) | [简体中文](README.zh-CN.md)

[![ci](https://github.com/00080000/dsh-project-memory/actions/workflows/ci.yml/badge.svg)](https://github.com/00080000/dsh-project-memory/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![npm](https://img.shields.io/npm/v/@yolk_vat-y/dsh-project-memory)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![npm downloads](https://img.shields.io/npm/dm/%40yolk_vat-y%2Fdsh-project-memory?style=flat-square&color=orange)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/00080000/dsh-project-memory) [![Awesome](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)


A persistent **project development memory** for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) agents. Built specifically for project development, natively integrated with dsh's task system: task lists and files read during a session are automatically persisted as cross-session task records, with tasks ↔ files linked — workflows can be switched and resumed, no need to re-scope the whole project, solving context loss. Documents (PDF/Markdown/txt) and code symbols are stored separately per workspace; documents are automatically cross-linked to the code symbols they mention. Experience notes (problem → solution) are automatically deduplicated, preventing repeated mistakes. All data is stored per project on disk, survives session compaction and handover; recalls include `path:line` citations for source verification. No native builds, no vector database. A 79 MB local embedding table (`leanvec`) installs and runs by default; without it, recall falls back to pure lexical.

> The plugin keeps a compact project **memory** on disk, with every entry pointing to a concrete file and line — the agent can reorient quickly instead of re-reading the whole project.

![Task panel: task list, step progress, and involved files](docs/images/image.png)

## Features

```

</details>

**依据 2 · 源码核查**：[src/recall.js:1-18](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/recall.js#L1-L18)

当前固定版本复核。召回与动手前提示分契约，跨层分数不伪可比。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 统一召回核心（pull 侧）。
 *
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
 *
 * @module dsh-project-memory/recall
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:310-323](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L310-L323)

当前固定版本复核。曝光/命中并非实际采纳或验证。

<details>
<summary>查看原文（14行）</summary>

```text
    if (typeof v !== 'number' || !Number.isFinite(v)) continue
    n++
    sum += v
    sumSq += v * v
    if (v > top1) {
      top2 = top1
      top1 = v
      item = it
    } else if (v > top2) top2 = v
  }
  if (!item) return null
  // 分布必须**排除候选自己**：top1 本身就是待检验的那个值，把它算进 μ/σ 会把自己的极端值
  // 摊进方差里（稀疏池里一条 0.92 + 三条 0.2 会把 σ 抬到 0.33，阈值冲上 1 以上，于是永远不合并）。
  // 排除之后 μ/σ 描述的是"池子里随机一条与这段文本有多像"——那才是零假设。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档/代码索引与增量召回怎样工作？

**研究主题**：功能与机制

#### 完整回答

index_repo、watch与lazy共用planFileIndex，先检查后缀/体积，读取buffer哈希，未变且无需terms回填则跳过。代码提符号，文档按标题/长度切片，summary最多300字符用于注入，整chunk terms用于检索；PDF走pdfjs文本抽取，不含OCR。条目保存相对路径/行，doc→symbol链接读取时派生，避免存重复关系。

每源文件一个shard保存record与条目，commitFileUpdates按旧record哈希作CAS，再保存脏分片。它比较的是索引store记录是否被另一编排改过，不是重新读取源文件确认内容仍是plan时版本，因此源文件在抽取后改变时仍可能短暂陈旧，依后续watch修正。扫描截断/不可读标记truncated并不清未见条目，避免把没扫到当删除。

query_memory解析安全根、校验存在/非空查询，分层top-k召回，词法为主，experience/insight可用leanvec语义融合；doc/symbol仍词法。可选LLM query expansion默认关。分层展示与相对分帮助解释结果，但高分不是置信概率，路径也不自动证明当前原文仍一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/index-pipeline.js:45-67](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index-pipeline.js#L45-L67)

当前固定版本复核。共享哈希/抽取和不变跳过。

<details>
<summary>查看原文（23行）</summary>

```text
 */
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

**依据 2 · 源码核查**：[src/doc-pipeline.js:25-54](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/doc-pipeline.js#L25-L54)

当前固定版本复核。确定性summary/terms和chunk引用。

<details>
<summary>查看原文（30行）</summary>

```text

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
  if (looksLikeDump(text)) return null

  // Compute content hash for update detection
  const hash = createHash('sha256').update(text).digest('hex').slice(0, 16)

  const chunks = chunkText(text, opts.chunkChars, opts.maxChunks)
  return chunks.map((chunk, i) => ({
    id: `${entryIdPrefix(relPath)}#${i}`,
    sourcePath: relPath,
    sourceLine: chunk.line,
    type: 'doc',
    title: chunk.title || relPath,
    summary: summarizeText(chunk.text),
    keywords: extractKeywords(chunk.title, chunk.text),
    terms: extractTermText(chunk.text),
    hash,
  }))
}
```

</details>

**依据 3 · 源码核查**：[src/parsers/pdfjs-parser.js:60-80](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/parsers/pdfjs-parser.js#L60-L80)

当前固定版本复核。PDF文本抽取而非OCR。

<details>
<summary>查看原文（21行）</summary>

```text
  const data = new Uint8Array(await readFile(filePath))
  const { getDocument } = await loadPdfjs()
  const loadingTask = getDocument({ data, ...PDFJS_OPTIONS })
  try {
    const doc = await loadingTask.promise
    const total = doc.numPages
    if (total > maxPages) {
      throw new Error(`PDF has ${total} pages, over the maxPages limit of ${maxPages}`)
    }

    const pageList = []
    let imageCount = 0
    let sampledPages = 0
    for (let n = 1; n <= total; n++) {
      if (pages && !pages.has(n)) continue
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      pageList.push({ page: n, text: extractPageText(content.items) })

      if (collectLayoutStats && sampledPages < 5) {
        const { OPS } = await loadPdfjs()
```

</details>

**依据 4 · 源码核查**：[src/store.js:1011-1034](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/store.js#L1011-L1034)

当前固定版本复核。CAS比较store旧记录，不重新哈希源文件。

<details>
<summary>查看原文（24行）</summary>

```text
    this._idfCache = { version: this._entriesVersion, idf }
    return idf
  }

  _rebuildIdf() {
    const entries = this.allEntries()
    const N = entries.length
    if (N === 0) return {}
    const df = {}
    for (const entry of entries) {
      // 语料必须与**检索**同源：检索走 search.js 的 weightedFieldText = title×5 + keywords
      // + summary + **terms** + sourcePath。此前这里手抄了一份少了 `terms`/`sourcePath` 的
      // 副本，于是只出现在 `terms` 里的词 df=0 → 被当成极稀有词拿虚高 IDF（而 `terms` 正是
      // 0.5.x 为修"只有前 300 字符可检索"加的主检索面）。直接调 makeSearchText，权重自动对齐。
      const terms = tokenizeRaw(makeSearchText(entry))
      const seen = new Set(terms)
      for (const t of seen) {
        df[t] = (df[t] || 0) + 1
      }
    }
    const idf = {}
    for (const [t, df_t] of Object.entries(df)) {
      idf[t] = Math.log(1 + (N - df_t + 0.5) / (df_t + 0.5))
    }
```

</details>

**依据 5 · 源码核查**：[src/util/fs.js:232-268](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/util/fs.js#L232-L268)

当前固定版本复核。不可读/截断和遍历上限。

<details>
<summary>查看原文（37行）</summary>

```text
 *
 * 存在的理由：`walkDir()` 会跳过这些子树（父根不再重复保存它们的内容），于是"在父根下问子项目
 * 的事"必须换个 `root=` 再问一次。这个函数就是用来在**查询未命中时给模型指路**的，不是文件系统
 * 巡检：BFS、限深 3 层、最多列 8 个、最多看 300 个目录，且不往已知的子根里下探。
 */
export function nestedStoreRoots(root, memoryDirName, { maxDepth = 3, maxEntries = 8, maxVisited = 300 } = {}) {
  const found = []
  const queue = [[root, 0]]
  let visited = 0
  while (queue.length && found.length < maxEntries && visited < maxVisited) {
    const [dir, depth] = queue.shift()
    visited++
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (found.length >= maxEntries) break
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      if (DEFAULT_IGNORE.has(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (hasOwnStore(full, memoryDirName)) {
        found.push(full)
        continue // 已知的子根不再往里下探
      }
      if (depth + 1 <= maxDepth) queue.push([full, depth + 1])
    }
  }
  return found.sort()
}

export function walkDir(root, opts = {}) {
  const ignoreNames = opts.ignoreNames || DEFAULT_IGNORE
  const maxFiles = Number.isFinite(opts.maxFiles) && opts.maxFiles > 0 ? opts.maxFiles : Infinity
  const maxDepth = Number.isFinite(opts.maxDepth) && opts.maxDepth > 0 ? opts.maxDepth : Infinity
```

</details>

**依据 6 · 源码核查**：[src/tools/query-memory.js:68-119](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/tools/query-memory.js#L68-L119)

当前固定版本复核。根/非空/分层与可选扩展、向量。

<details>
<summary>查看原文（52行）</summary>

```text
        description: 'What to look for',
      },
      root: {
        type: 'string',
        description: '项目根（默认当前工作目录）',
      },
      type: {
        type: 'string',
        enum: ['all', 'doc', 'symbol', 'experience', 'insight', 'task'],
        description: 'all|doc|symbol|experience|insight|task；默认 all',
      },
      limit: {
        type: 'number',
        description: '最多返回条数，默认 8',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      const root = resolveSafeIndexRoot(exec, args.root, config)
      // 读路径也要验根存在。这条不是洁癖：可选的向量层（leanvec）在空 store 上会建
      // `<root>/.dsh-project-memory/vectors.json`，于是传错一个 root（拼写错误/旧路径）就能
      // 在任意可写位置造出目录和空 store，而回报是"No memory matches"——看起来像"这个项目
      // 没有记忆"，用户不会意识到自己查错了地方。与 index_repo/watch_repo 同一道护栏。
      assertIndexRoot(root, args.root || root)
      // 空查询不是"全部"：recallItems 会过滤空串，rankEntriesStreaming 随即返回
      // entries.slice(0, limit)（任意条目、分数 0），task 分支的 includes('') 更是命中所有任务。
      if (!String(args.query ?? '').trim()) {
        return 'query must not be empty. Use memory_stats to see what the store contains.'
      }
      const store = new ProjectMemoryStore(memoryRootFor(root, config.memoryDir)).load()
      const type = args.type || 'all'
      const limit = Math.max(1, Math.min(Number(args.limit) || 8, 20))

      const queries = config.llmQueryExpansion
        ? await expandQuery(ctx.llm, args.query, config.expansionCount, { route: resolveRoute(exec, config) })
        : [args.query]

      // 会话绑定决定 task 级 insight 的可见性；global 级始终可见。
      const sessionId = exec?.agent?.session?.id
      const boundTaskId = sessionId && typeof store.getBoundTaskId === 'function' ? store.getBoundTaskId(sessionId) : null
      const globalStore = new GlobalStore(cfgInsight(config).globalFile || defaultGlobalFile()).load()
      const wantMemory = type === 'all' || type === 'doc' || type === 'symbol'
      /** 本根记忆层（doc/symbol）的命中数：0 且存在子索引时，末尾要指路。 */
      let memHitCount = 0
      const wantInsight = type === 'all' || type === 'insight'
      // 可选向量层：**没装/没配就是 null**，此时 recallItems 拿到 rerank:null 与纯词法路径逐字段一致。
      // 只影响 experience/insight 两层的排序（doc/symbol 与返回条数都不变）。
      const cfg = cfgEngine(config)
      const rerank = await createVectorRerank({
```

</details>

#### 缺口

- 所有文件类型/字符编码及扫描时编辑的实际索引新鲜度未验证。
  **影响**：不能把引用路径当版本固定原文，也不承诺扫描完整。
  **进一步探讨**：可用已知符号/文档问题集，在plan后改文件、删文件和截断扫描对照引用与原文。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · insight与TaskBridge带来什么贡献？

**研究主题**：贡献与相对优势

#### 完整回答

TaskBridge监听todo/write，把非空清单自动建任务/绑定会话，排除子代理自动建档；后续同步steps与文件热点，选择旧任务时可将其步骤反向推入宿主todo/write。/tasks集中驱动任务与记忆审核动作，减少模型工具和界面各维护一份任务的漂移，但模型todo仍不是独立任务验收。

经验、lesson、decision、procedure统一进入insight实体，支持task/project/global。相似标题的向量分或词法重叠决定覆盖/强化/新建，旧字段保留prev；两任务命中且confidence门槛可升project，多任务再升global。reflection默认关，开启后模型从任务快照产草稿。贡献是“检索材料”和“做事前须知”两条交付契约加任务绑定、范围流转与可观测门控，而非新embedding模型或自动正确的经验学习。

这些机制有实际可迁移的工程组合，尤其分层召回、自动注入与审计共用候选结构。然而相似度对应的是文本近邻，两个任务重复写同一错结论仍可能强化或扩大scope；自动提升不等于经过独立检验，必须结合Q05的草稿合并范围理解。

#### 证据与依据

**依据 1 · 源码核查**：[src/setup/taskbridge.js:216-247](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/setup/taskbridge.js#L216-L247)

当前固定版本复核。todo自动建任务、绑定与子代理排除。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/setup/taskbridge.js:78-93](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/setup/taskbridge.js#L78-L93)

当前固定版本复核。任务步骤反向写宿主todo。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * 反向接管：任务成为某会话绑定后，把任务步骤推成宿主 todo/write 快照，
 * 让 dsh 渲染的任务清单（UI/投影）变成我们这套任务的步骤。
 * 规则：任务没有步骤时不推（避免误清模型手头正在用的宿主清单）。
 * @returns {boolean} 是否实际推送
 */
export function adoptStepsToSession(session, task) {
  if (!session || typeof session.append !== 'function') return false
  const steps = Array.isArray(task?.steps) ? task.steps : null
  if (!steps || steps.length === 0) return false
  const todos = steps.map((s) => ({ content: String(stepContent(s)), status: stepStatus(s) }))
  session.append('todo/write', { todos })
  return true
}

/** 是否开启“任务接管时同步宿主清单”（config.tasklist.syncHostOnAdopt 默认 true）。 */
```

</details>

**依据 3 · 源码核查**：[src/index.js:191-218](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index.js#L191-L218)

当前固定版本复核。集中工具/命令和自动注入接线。

<details>
<summary>查看原文（28行）</summary>

```text
    if (event?.type === 'request/header') rememberRoute(session)
    // 会话活跃信号：有人正在跑回合时把 watch 轮询压到最低，回合结束立刻补扫一次（见 watch.js）。
    // 这是"轮询只在空闲时发生"的落点 —— 交互期间把 I/O 全让给模型，停下那一刻才整理索引。
    const key = session?.id ?? 'unknown'
    if (event?.type === 'turn/start' || event?.type === 'step/start') watchManager.setSessionActive(key, true)
    else if (event?.type === 'turn/end') watchManager.setSessionActive(key, false)
  })
  // 会话被销毁时也要摘掉活跃标记：否则一个没有正常 turn/end 的会话会把轮询**永久**压在兜底节拍
  // （不会卡死，但"空闲时高速刷新"再也不会回来）。
  ctx.on('session/disposed', (session) => {
    watchManager.setSessionActive(session?.id ?? 'unknown', false)
  })
  ctx.tools.register(listTasksTool(config))
  ctx.tools.register(selectTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(archiveTaskTool(config, { llm: ctx.llm, ctx }))
  ctx.tools.register(showTaskPanelTool(config))

  // /tasks：唯一的用户命令（合并自原 /tasks、/task、/insight —— 宿主命令只要注册就会
  // 出现在 `/` 菜单的「指令」组里且无法隐藏，三条命令就是三行去不掉的原始行）。
  // 切换/归档/审核等动作作为子动词，由面板按钮经 remote.commands.execute 驱动。
  try {
    ctx.inject(['commands'], (commandsCtx) => {
      commandsCtx.commands.register(workflowCommandDefinition(config, ctx))
    })
  } catch (err) {
    console.error(`[dsh-project-memory] /tasks registration skipped: ${err.message}`)
  }

```

</details>

**依据 4 · 源码核查**：[src/insight-store.js:775-798](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L775-L798)

当前固定版本复核。向量/词法覆盖强化与新建。

<details>
<summary>查看原文（24行）</summary>

```text

/** 按 home 把条目从各自真相源里移除；删除前先把**完整条目**写进留痕文件。 */
function removeEntries({ store, globalStore }, entries) {
  // 传进来的 entries 是 at() 的摘要（只有 id/home/title），留痕要的是正文，
  // 所以这里按 id 回真相源取完整对象——顺序在 splice 之前，取不到就跳过留痕（不挡删除）。
  const full = []
  for (const e of entries) {
    if (e.home === 'project') {
      const it = (store.insightItems() || []).find((x) => x.id === e.id)
      if (it) full.push({ ...it, home: 'project' })
    } else if (e.home === 'global') {
      const it = (globalStore.items() || []).find((x) => x.id === e.id)
      if (it) full.push({ ...it, home: 'global' })
    } else if (e.home === 'task') {
      const task = store.getTask(e.taskId)
      const it = (task?.insights || []).find((x) => x.id === e.id)
      if (it) full.push({ ...it, home: 'task', taskId: e.taskId })
    }
  }
  const keptIn = recordDeleted({ store, globalStore }, full)

  const projectIds = new Set()
  const globalIds = new Set()
  const taskIds = new Map()
```

</details>

**依据 5 · 源码核查**：[src/insight-store.js:917-945](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L917-L945)

当前固定版本复核。两任务、confidence与提升非草稿。

<details>
<summary>查看原文（29行）</summary>

```text
  else if (res.action === 'reinforced') bits.push('近重复，已强化命中')
  else if (res.action === 'auto-merged') bits.push(`相似度 ${res.cos}，已自动覆盖既有条目`)
  if (Array.isArray(res.replaced) && res.replaced.length) {
    bits.push(`覆盖字段 ${res.replaced.join('/')}（旧值留在 prev：用同一个 id 再写一次即可写回）`)
  }
  if (res.near && res.near.id !== res.id) {
    bits.push(`近邻 ${res.near.id}（相似度 ${res.near.cos}：《${res.near.title}》）——若这是同一条知识，带 id=${res.near.id} 再写一次即可就地覆盖；确认过时的用 forget 删掉它`)
  }
  if (pruned && pruned.removed) bits.push(`容量清理 ${pruned.removed} 条`)
  if (promoted) bits.push(`自动提升 global ${promoted} 条`)
  return bits.length ? bits.join('；') : ''
}

// ---- scope = task ----

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
```

</details>

**依据 6 · 源码核查**：[src/reflection-pipeline.js:91-116](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/reflection-pipeline.js#L91-L116)

当前固定版本复核。反思产draft:true任务知识。

<details>
<summary>查看原文（26行）</summary>

```text
    const maxLessons = typeof rc.maxLessonsPerReflect === 'number' ? rc.maxLessonsPerReflect : 3
    const maxDecisions = typeof rc.maxDecisionsPerReflect === 'number' ? rc.maxDecisionsPerReflect : 2
    const written = []

    for (const l of normalizeList(parsed.lessons, maxLessons)) {
      if (!(l.pattern || l.title)) continue
      const res = store.commit((s) =>
        saveInsight({
          store: s,
          globalStore,
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
          source: 'reflect',
        }),
      )
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动注入怎样控制相关性、预算和副作用？

**研究主题**：缺陷与关键质疑

#### 完整回答

pre-step先交后继，缺cwd/session或危险根不注入，读取project/global及当前绑定任务。resident任务卡与items分开配额，items优先显式trigger，再走统计hint；procedure不走普通提示。hint结合coverage、query support、匹配数和相对最高分门槛，可选向量；候选门槛和预算结果分别留日志，有助于解释为什么没注入。

maxTokens实际乘3变字符预算，最终clamp也按字符，不是模型tokenizer的严格token上限。任务卡与省略说明/root notice等开销也要区分；同一次正文变化、会话级次数/字符熔断及cooldown让提示可静默。曝光更新hitCount/lastHitAt供衰减，不检测模型是否采用，更不评估任务质量。向量开关会改变词法最低命中门槛，不能把降级理解成相同召回准确率。

这种多重门控比每步塞全部记忆更审慎，但阈值依语料、语言与作者小样本标定，仍会漏掉关键约束或注入相似但不适用知识。snapshot是模型上下文材料，不是强制执行政策。一次检索命中/注入不是事实验证，也不使旧记忆获得更高证据等级。

#### 证据与依据

**依据 1 · 源码核查**：[src/auto-inject.js:704-731](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L704-L731)

当前固定版本复核。真实session cwd、危险根及store读入。

<details>
<summary>查看原文（28行）</summary>

```text

function warnUnsafeSessionRoot(root) {
  if (warnedUnsafeRoots.has(root)) return
  warnedUnsafeRoots.add(root)
  console.error(
    `[dsh-project-memory] session cwd ${root} is not a project root (home / system / package-manager prefix); ` +
      'project memory and its audit logs are disabled for this session. Start dsh inside a project directory to enable them.',
  )
}

/**
 * 一个 pre-step 的注入决策：解析会话 → 排程 → 必要时构造消息。
 * 返回 null 表示本步无事可做（交回原决策）。
 */
async function injectForStep({ payload, decision, config, cfg, audit, shadow, sessions }) {
  const session = payload && payload.agent && payload.agent.session
  // 与工具侧同一口径的「当前工作目录」：0.2.1+ 走 workingDirectory 投影（cd 后会变），
  // 老宿主回退 header.cwd。少了这一步，cd 之后审计与懒索引会落在两个不同的 store 里。
  const cwd = sessionWorkingDir(session, { agent: payload?.agent })
  const sessionId = session && session.id
  if (!cwd || !sessionId) return null
  // 会话 cwd 是家目录/系统目录时整条链路停在这里：不读 store（历史遗留的超大 store
  // 光是 load() 就能 OOM），也不写审计——`appendShadowAudit` 里的 mkdirSync 正是把
  // `.dsh-project-memory` 造进家目录、进而触发"目录自标记 → 家目录被锁成项目"的那一步。
  if (isUnsafeRoot(cwd)) {
    warnUnsafeSessionRoot(cwd)
    return null
  }
```

</details>

**依据 2 · 源码核查**：[src/auto-inject.js:481-518](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L481-L518)

当前固定版本复核。字符近似预算和两通道。

<details>
<summary>查看原文（38行）</summary>

```text
}

/**
 * 构建注入内容（不写盘、无副作用）。
 *
 * 交付契约：**authored trigger（所有 kind）= 确定性全文注入，优先级 1；统计信号 = 截断提示，
 * 优先级 2**。预算排程为：常驻任务卡 → trigger 命中 → 提示。每一步都记 `reasons`（为什么注入）
 * 与 `dropped`（为什么没注入），让"注入/未注入"可审计——而不是只有静默的门槛。
 * @param {object} opts { query, readiness, task, store, globalStore, projectTagsList, cfg, skipItem? }
 * @param {(it: object) => boolean} [opts.skipItem] 条目级去重：返回 true 的条目直接退出排程
 *   （本会话已注入过且正文未变）。在排程前过滤，省下的预算留给新条目。
 * @returns {{ text: string, labels: string[], reasons: object[], dropped: object[] }}
 */
export function buildInjection(opts) {
  const { query, task, globalStore, cfg } = opts
  const store = opts.store || null
  const tags = opts.projectTagsList || []
  const ctx = buildReadinessContext({ ...(opts.readiness || { humanText: query || '' }), tags })
  const labels = []
  const reasons = []
  const dropped = []
  const parts = []
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
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:534-591](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L534-L591)

当前固定版本复核。预算placement、丢弃原因与clamp。

<details>
<summary>查看原文（58行）</summary>

```text
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
  }

  // 预算层结局写回候选。`decision` 是**门槛层**的结论（support/coverage/thin/relative/cand），
  // `outcome` 是**预算层**的结论——两者正交。"过了全部门槛却没注入"必须能归因，
  // 否则日志只能证明门槛做了什么，证明不了预算拿走了什么。
  {
    const outcomeById = new Map()
    for (const r of reasons) outcomeById.set(`${r.channel}\u0000${r.id}`, 'injected')
    for (const d of dropped) {
      const key = `${d.channel}\u0000${d.id}`
      if (!outcomeById.has(key)) outcomeById.set(key, d.reason)
    }
    for (const c of candidates) {
      c.outcome = skipItems ? 'idle'
        : c.decision !== 'cand' ? 'gate'
          : outcomeById.get(`hint\u0000${c.id}`) || 'unscheduled'
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:810-829](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L810-L829)

当前固定版本复核。曝光记账不影响主流程。

<details>
<summary>查看原文（20行）</summary>

```text
  // 记忆根通告：根是**推定**的（会话工作目录，且该目录没有任何项目标记）时，
  // 第一次注入前告诉模型"记忆现在存在哪、怎么改"。它是状态声明（与常驻任务卡同类），
  // 只发一次、不占条目额度；否则模型只看到一条来自某处的记忆，却不知道那个根是怎么来的。
  const notice = rootNotice({ root, sessionId, sessions, config })

  const fp = built.text ? fingerprint(built.dedupeText ?? built.text) : fingerprint(notice || '')
  const injectedText = notice ? (built.text ? `${notice}\n${built.text}` : notice) : built.text
  if (!injectedText || fp === sessions.lastText.peek(sessionId)) return null
  sessions.lastText.set(sessionId, fp)
  const itemCount = built.reasons.length
  const summary = itemCount
    ? `memory inject: ${itemCount} item(s)${built.entry ? ' + task card' : ''}`
    : built.entry ? 'memory inject: task card' : 'memory root notice'

  // 只记真的进了上下文的那几条：dropped 的没被看到，不能记账（否则以后永远不再注入）。
  const seen = sessions.items.ensure(sessionId)
  for (const r of built.reasons) {
    if (r && r.id && r.hash) seen.set(r.id, { hash: r.hash, step: stepNo })
  }
  // 会话额度只被"条目"消耗；任务卡不算（否则任务一多就把记忆挤没了）。
```

</details>

**依据 5 · 源码核查**：[src/recall.js:44-66](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/recall.js#L44-L66)

当前固定版本复核。有无向量的匹配门槛差异。

<details>
<summary>查看原文（23行）</summary>

```text
 * （来自 `git commit --amend --no-edit`），于是单个片段就拿走了 3.13 分。提示通道早就有这条规则
 * （`hintMinMatched`，默认 min(2, 词数)），**工具路径与这两层一直漏着**。
 *
 * ⚠ **只对没有语义分的条目生效**，而且是**逐条**判——不是"有 rerank 就整条关掉"。这是同查询集
 * A/B 实测出来的（36 条、同一个 store）：
 *   · 纯词法下加闸门：BM25 的 hit@1/3/5/10 = 39/50/58/69% **完全不变**，只是不再对乱码查询出声；
 *   · 有向量时对**所有**条目加闸门：融合 hit@5/10 从 64/72% 掉到 58/64%，"完全没召回"从 10 涨到 13。
 * 原因是结构性的：**向量救回来的那批，恰恰就是词法弱到不足 2 个命中的**——用词法的尺子去筛，
 * 等于把向量的全部价值砍掉。所以：拿到语义分的条目豁免，没拿到的照旧过闸。
 *
 * 旧实现按 `Boolean(rerank)` 整条关闸，于是"装了 leanvec 但这一轮给不出余弦"（查询编码失败、
 * embed 抛异常、或者根本没有候选可编码）时，弱命中会漏进来——那不是降级，是**换了行为**：
 * 注释承诺的"逐字段退回纯词法"在那种情况下并不成立。
 *
 * 只作用于 experience / insight 两层：它们是短标题语料，单片段命中几乎没有证据力；
 * doc/symbol 层是代码与路径（`js` / `id` 这类单词查询本来就该命中），不动它。
 * 单词查询不受影响：need = min(2, 1) = 1，与"score>0 即命中"等价。
 */
function matchedFloor(scored, queries) {
  const qTokens = new Set()
  for (const q of queries) for (const t of tokenizeRaw(String(q ?? ''))) qTokens.add(t)
  const need = Math.min(2, qTokens.size)
  if (need <= 1) return scored
```

</details>

#### 缺口

- 门控在用户真实语料的漏注/误注、预算与实际token偏差未独立测量。
  **影响**：不能把配置400写成硬token预算，也不能承诺关键约束总会到达模型。
  **进一步探讨**：固定中文/代码/长提示问题集，保留所有候选与遗漏真值，比较实际token和后续任务遵循。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 根目录、数据来源和跨层记忆边界在哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

根优先显式root，再注册根/项目标记和安全会话cwd；家目录/系统路径精确排除是防误扫护栏，非访问授权或数据沙箱。工具显式root可指定任意可读安全目录；底层Node fs直接读写，walkDir把非目录项列入文件，包括符号链接文件，没有在该链逐文件realpath再核root。嵌套store跳过避免重复索引，也使父根问子项目可能不命中，工具会提示改root。

本地持久化不代表只在本项目使用。global知识对其它项目可见，自动去重/跨任务提升把任务数与confidence作为范围变化依据，并不检查知识有效地域。saveInsight有密钥形态拒绝，但这是格式启发，不能覆盖所有秘密；文档、经验和工具动作还可进入模型/审计文件。引用files做相对路径规范化，不冻结Git版本或验证每个文件真实支撑断言。

reflection的“draft-only at task level”也不是封闭写域。它确实传draft:true与scope:task，但saveTaskInsight先查既有project/global近邻并mergeInto；merge覆盖fix/choice等正文而保持原条目draft，已确认知识可被模型草稿更新。跨任务提升还显式draft=false。该路径默认reflection关闭，需近邻命中或后续提升才成立；本轮只指出静态条件，没有声称已发生污染。

#### 证据与依据

**依据 1 · 源码核查**：[src/util/fs.js:656-700](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/util/fs.js#L656-L700)

当前固定版本复核。根解析和显式root护栏，不作会话访问授权。

<details>
<summary>查看原文（45行）</summary>

```text
    this.name = 'UnsafeRootError'
    this.root = root
  }
}

/**
 * 校验「这个根可以当项目记忆根」。所有把目录当根写盘的入口都必须先过这一关：
 * 写盘前拒绝，比事后清理 `.dsh-project-memory` 便宜得多。
 */
export function assertSafeRoot(root, { requested = root, allowUnsafe = false } = {}) {
  if (allowUnsafe) return root
  if (!isUnsafeRoot(root)) return root
  throw new UnsafeRootError(root, requested)
}

export function resolveIndexRoot(exec, explicitRoot) {
  if (explicitRoot && explicitRoot.trim()) return path.resolve(explicitRoot)
  // 会话当前工作目录：0.2.1+ 读 workingDirectory 投影（cd 后会变），老宿主回退 header.cwd。
  const sessionCwd = sessionWorkingDir(exec?.agent?.session, { agent: exec?.agent })
  if (sessionCwd) return path.resolve(sessionCwd)
  return path.resolve(process.cwd())
}

// ---------------------------------------------------------------------------
// 项目根推导 —— 全插件唯一的策略实现。
//
// 顺序（前两者是"声明"，后两者是"推定"）：
//   1. 显式传入的 root（工具参数）；
//   2. 显式登记过的根（watch_repo / watchManager）；
//   3. 最近的、含 VCS 或构建/清单标记的祖先；
//   4. 会话工作目录本身 —— 只要它是安全目录。
// 都没有 → null（该文件不落任何记忆）。
//
// 第 4 条是刻意的：`cwd` 是**人明确选择的工作位置**（在那里启动了 dsh），和"模型顺手读到的
// 某个文件所在目录"完全不是一回事。旧实现把后者也当根（兜底 `path.dirname(file)`），
// 又让 `.dsh-project-memory` 自己当标记，才把家目录锁成了项目（issue #5）。
// ---------------------------------------------------------------------------

/** VCS 边界：最强的项目根信号（`.git` 在 worktree 里是文件，existsSync 同样命中）。 */
export const VCS_MARKERS = ['.git', '.hg', '.svn']

/**
 * 构建/清单标记。**刻意不含 `.dsh-project-memory`**：那个目录是插件自己创建的，
 * 一旦算作项目标记就会自我固化——审计日志在会话 cwd 建出它之后，读该目录下任意文件
 * 都会把根解析回该目录，于是家目录被永久锁成"项目"。
```

</details>

**依据 2 · 源码核查**：[src/util/fs.js:243-266](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/util/fs.js#L243-L266)

当前固定版本复核。非目录项加入列表，无逐文件realpath围栏。

<details>
<summary>查看原文（24行）</summary>

```text
    visited++
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (found.length >= maxEntries) break
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      if (DEFAULT_IGNORE.has(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (hasOwnStore(full, memoryDirName)) {
        found.push(full)
        continue // 已知的子根不再往里下探
      }
      if (depth + 1 <= maxDepth) queue.push([full, depth + 1])
    }
  }
  return found.sort()
}

export function walkDir(root, opts = {}) {
  const ignoreNames = opts.ignoreNames || DEFAULT_IGNORE
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:730-742](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L730-L742)

当前固定版本复核。密钥形态检查和统一写入口。

<details>
<summary>查看原文（13行）</summary>

```text
export function removeMemory({ store, globalStore, idOrQuery, maxMatches = 10 } = {}) {
  const query = String(idOrQuery ?? '').trim()
  if (!query) return { ok: false, removed: [], matches: [] }
  const at = (home, item, taskId) => ({
    id: item.id,
    home,
    taskId,
    title: String(item.title || item.problem || '(untitled)').slice(0, 60),
  })
  const pools = { project: [], global: [], task: [] }
  for (const it of (store && typeof store.insightItems === 'function' ? store.insightItems() : []) || []) pools.project.push(at('project', it))
  for (const it of (globalStore && typeof globalStore.items === 'function' ? globalStore.items() : []) || []) pools.global.push(at('global', it))
  for (const t of (store && typeof store.getTasks === 'function' ? store.getTasks() : []) || []) {
```

</details>

**依据 4 · 源码核查**：[src/reflection-pipeline.js:91-116](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/reflection-pipeline.js#L91-L116)

当前固定版本复核。草稿任务scope调用。

<details>
<summary>查看原文（26行）</summary>

```text
    const maxLessons = typeof rc.maxLessonsPerReflect === 'number' ? rc.maxLessonsPerReflect : 3
    const maxDecisions = typeof rc.maxDecisionsPerReflect === 'number' ? rc.maxDecisionsPerReflect : 2
    const written = []

    for (const l of normalizeList(parsed.lessons, maxLessons)) {
      if (!(l.pattern || l.title)) continue
      const res = store.commit((s) =>
        saveInsight({
          store: s,
          globalStore,
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
          source: 'reflect',
        }),
      )
```

</details>

**依据 5 · 源码核查**：[src/insight-store.js:830-866](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L830-L866)

当前固定版本复核。task写先匹配project/global并改内容。

<details>
<summary>查看原文（37行）</summary>

```text
  const now = nowIso || new Date().toISOString()
  const secretField = containsSecretFields(raw)
  if (secretField) {
    return { ok: false, error: `内容疑似包含密钥/token/私钥形态数据（字段: ${secretField}），已拒绝写入` }
  }
  if (raw && raw.id) {
    const found = findInsightAnywhere({ store, globalStore }, raw.id)
    if (!found) return { ok: false, error: `找不到要更新的条目: ${raw.id}（可能已被删除/提升；用 query_memory 重新确认 id）` }
    const wasDraft = found.item.draft === true
    const replaced = applyUpdate(found.item, raw, now)
    if (found.scope === 'global') globalStore.markDirty()
    else if (found.scope === 'task') store.markTasksDirty()
    else store.replaceInsightItems(store.insightItems())
    const hint = replaced.length
      ? `已就地更新（覆盖字段：${replaced.join('/')}，旧值在 prev）`
      : wasDraft ? '已确认草稿（draft=false）' : '没有字段变化'
    return {
      ok: true,
      action: 'updated',
      id: raw.id,
      scope: found.scope,
      replaced,
      hint: wasDraft && replaced.length ? `${hint}；草稿已确认` : hint,
    }
  }
  const s = scope || 'project'
  if (!INSIGHT_SCOPES.includes(s)) return { ok: false, error: `非法 scope: ${s}` }
  if (s === 'global') {
    if (!globalStore) return { ok: false, error: 'global 存储未初始化' }
    const res = upsertIntoPool(globalStore.items(), raw, cfg2, now, { source, scope: 'global', cosine })
    if (res.action === 'created') pruneItems(globalStore.items(), cfg2.maxGlobalProcedures, now)
    globalStore.markDirty()
    return { ok: true, ...res, scope: 'global', hint: res.hint || buildHint(res) }
  }
  if (s === 'task') {
    if (!store || !taskId) return { ok: false, error: 'task 级写入需要 taskId' }
    const task = store.getTask(taskId)
```

</details>

**依据 6 · 源码核查**：[src/insight-store.js:207-226](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L207-L226)

当前固定版本复核。merge正文并不传播draft隔离。

<details>
<summary>查看原文（20行）</summary>

```text
}

/** 自动合并会改写的正文字段（title 也在内：0.90 以上的两条标题本就近乎同一句）。 */
const MERGE_FIELDS = ['title', 'pattern', 'fix', 'choice', 'reason', 'problem', 'solution', 'body']

/**
 * 把 base 合并进既有条目：**正文取新值**（旧值进 `prev`），成员/文件/符号并集，置信取高，记命中。
 *
 * 与旧实现的区别就是那一个 `if (b && !existing[f])`：以前字段已有值就**静默丢掉新文本**，
 * 于是"我记错了，改成正确的"永远落不进去（只加 hitCount）。现在反过来——新值落地、旧值可还原。
 * 提升路径只传成员/文件/符号/置信，不传正文字段，所以它们的语义一字未变。
 * @returns {{item: object, replaced: string[]}} 被改动的字段名（供调用方回报）
 */
export function mergeInto(existing, base, cfg, nowIso) {
  const now = nowIso || new Date().toISOString()
  existing.sourceTaskIds = unionStrings(existing.sourceTaskIds, base.sourceTaskIds)
  existing.files = unionStrings(existing.files, base.files)
  existing.symbols = unionStrings(existing.symbols, base.symbols)
  existing.tags = unionStrings(existing.tags, base.tags)
  const replaced = []
```

</details>

**依据 7 · 源码核查**：[src/insight-store.js:960-982](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L960-L982)

当前固定版本复核。global提升条件与draft=false。

<details>
<summary>查看原文（23行）</summary>

```text
    }
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
    const poolNear = vectorNear(vectorText(base), pool, cosine)
    const poolTarget = autoMergeTarget(poolNear, cfg)
    if (poolTarget) {
```

</details>

#### 缺口

- 符号链接读取、跨scope反思更新与自动提升的真实影响未执行核查。
  **影响**：不能宣称数据绝不离开项目或所有反思只停草稿，更不推断现有知识已受污染。
  **进一步探讨**：可用非敏感独立根、已有确认知识与同标题反思草稿，追踪scope/draft/prev和实际注入内容。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启动与操作依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖或条件为Node>=18及DSH接口代际，是否必需为包声明/host必需，用途为tools/llm、fs观察、pre-step与会话事件，缺失或不满足时为声明范围不等于所有宿主实际兼容。
依赖或条件为pdfjs-dist，是否必需为包运行依赖，用途为PDF文本抽取，缺失或不满足时为扫描PDF图片无OCR文本层保障。
依赖或条件为TypeScript，是否必需为可选peer，用途为代码类型/符号增强，缺失或不满足时为关闭或缺失退弱提取，不等价结果。
依赖或条件为leanvec，是否必需为optional dependency，用途为经验/insight语义排序/写近邻，缺失或不满足时为不可用退词法，准确率会变化。
依赖或条件为安全项目根与可写store，是否必需为索引/任务必需，用途为shards/tasks/insights与审计，缺失或不满足时为危险根自动链停用，显式配置需慎核。
依赖或条件为模型路由，是否必需为可选扩展/反思需要，用途为query expansion和draft生成，缺失或不满足时为默认两功能关；无route降级。
依赖或条件为Web客户端/commands，是否必需为UI与/tasks需要，用途为任务面板与审核卡，缺失或不满足时为host工具可用不等于所有面板就绪。

步骤为准备，执行者与动作为固定包/宿主，备份现有project/global store，成功判据或失败处理为明确工作区、秘密及全局范围。
步骤为安装，执行者与动作为Web或目标profile挂载，核工具与cwd，成功判据或失败处理为不在家目录/容器根盲开全扫。
步骤为建索引，执行者与动作为先少量已知文件或按读lazy，再看stats/截断，成功判据或失败处理为有引用且当前原文可核对。
步骤为召回，执行者与动作为query_memory分层读结果，再打开来源，成功判据或失败处理为不以score当事实confidence。
步骤为任务知识，执行者与动作为绑定任务，审核scope/draft/近邻覆盖，成功判据或失败处理为关闭反思不消除手动global写入。
步骤为调整恢复，执行者与动作为比较审计/影子候选与实际任务，备份后更改阈值，成功判据或失败处理为删除仅最近少量可回找，避免盲删。

本轮不运行插件、PDF、模型调用、测试或普通宿主冒烟。最低版本仅按声明，作者benchmark不当本轮执行数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-60](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/package.json#L47-L60)

当前固定版本复核。Node与pdfjs声明。

<details>
<summary>查看原文（14行）</summary>

```text
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "pdfjs-dist": "^4.10.38"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
```

</details>

**依据 2 · 源码核查**：[package.json:70-91](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/package.json#L70-L91)

当前固定版本复核。宿主与TS peer及optional条件。

<details>
<summary>查看原文（22行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0 || >=0.1.1-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "typescript": "^5.0.0 || ^6.0.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-tools": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    },
    "@deepseek-ai/dsh-llm": {
      "optional": true
    },
    "typescript": {
      "optional": true
```

</details>

**依据 3 · 源码核查**：[package.json:112-114](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/package.json#L112-L114)

当前固定版本复核。leanvec optional。

```text
  },
  "optionalDependencies": {
    "leanvec": "^0.1.0"
```

**依据 4 · 源码核查**：[src/index.js:21-45](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index.js#L21-L45)

当前固定版本复核。硬依赖与默认关闭扩展/默认lazy。

<details>
<summary>查看原文（25行）</summary>

```text
export const inject = ['llm', 'tools']

export const Config = Schema.object({
  memoryDir: Schema.string().default('.dsh-project-memory'),
  chunkChars: Schema.number().default(3000),
  maxChunksPerFile: Schema.number().default(40),
  // 单文件内存闸门，不是磁盘设置：索引一个文件要先把它整个物化，峰值随文件大小线性走。
  // 实测边际系数（峰值 RSS / 磁盘 MB，见 bench/file-peak.mjs 与 README「单文件内存预算」）：
  // 典型源码 ~10×、符号密集代码 ~21×、文本型 PDF ~19×。10 把单文件增量压在 ~+300 MB。
  maxFileSizeMb: Schema.number().default(10),
  maxOutputChars: Schema.number().default(8000),
  maxPdfPages: Schema.number().default(1000),
  llmQueryExpansion: Schema.boolean().default(false),
  expansionCount: Schema.number().default(6),
  // 辅助 LLM 调用的路由覆写 —— **索引期零 LLM**，这里的路由只服务于召回期可选项
  // （llmQueryExpansion 查询扩展）与反思期（reflection.enabled）。
  // 未设置时：工具调用取当前会话 header 的 provider/model；后台路径取最近一次会话路由（request/header）。
  // 两者都拿不到时明确走回退并记录 degraded（不静默）。
  llm: Schema.object({
    provider: Schema.string(),
    model: Schema.string(),
  }).default({}),
  lazyIndexing: Schema.boolean().default(true),
  autoIndexOnFirstUse: Schema.boolean().default(false),
  watch: Schema.boolean().default(true),
```

</details>

**依据 5 · 源码核查**：[src/parsers/pdfjs-parser.js:60-80](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/parsers/pdfjs-parser.js#L60-L80)

当前固定版本复核。读取文本层条件。

<details>
<summary>查看原文（21行）</summary>

```text
  const data = new Uint8Array(await readFile(filePath))
  const { getDocument } = await loadPdfjs()
  const loadingTask = getDocument({ data, ...PDFJS_OPTIONS })
  try {
    const doc = await loadingTask.promise
    const total = doc.numPages
    if (total > maxPages) {
      throw new Error(`PDF has ${total} pages, over the maxPages limit of ${maxPages}`)
    }

    const pageList = []
    let imageCount = 0
    let sampledPages = 0
    for (let n = 1; n <= total; n++) {
      if (pages && !pages.has(n)) continue
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      pageList.push({ page: n, text: extractPageText(content.items) })

      if (collectLayoutStats && sampledPages < 5) {
        const { OPS } = await loadPdfjs()
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程恢复、缓存与审计怎样组织？

**研究主题**：工程质量与复用

#### 完整回答

分片按源文件保存，派生doc→symbol关系不持久化，脏分片写入减少整库重写；加载复用跨实例快照与版本，单文件更新用expectedHash避免同进程编排互相覆盖。writeJsonAtomic用带pid临时文件rename，失败清tmp并抛出；多文件save顺序写格式、shards、insights/tasks/binding，仍不是整库崩溃原子事务，也未构成跨进程锁。

watch递归setTimeout避免常态重叠，活动/空闲与变化调节轮询，stop后不再排下一轮；lazy按fs/observed去抖，卸载清timer。已经在跑的异步抽取/反思不因清timer自然取消，autoIndexOnFirstUse的cancelled仅控制日志，不能据此承诺卸载后绝无写入。

注入审计记真正注入，shadow记每步候选和拒绝原因，均有大小轮转与异常旁路。它们利于离线解释阈值，但16候选默认截断、日志会轮转，不是永久完整训练集；内容含query、工具动作/路径，需和源材料同等管理。vector指纹只哈希词表加向量文件字节数，相同词表/大小但向量内容改变会漏失效，这是作者明确近似取舍。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.js:690-746](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/store.js#L690-L746)

当前固定版本复核。脏分片顺序保存与单文件写粒度。

<details>
<summary>查看原文（57行）</summary>

```text

  replaceInsightItems(items) {
    const next = new Set((items || []).map((it) => it?.id).filter(Boolean))
    // 与上次落盘的基线比，而不是与当前数组比：调用方经常先原地 splice 再调用这里。
    for (const id of this._baseInsightIds) if (!next.has(id)) this._deletedInsightIds.add(id)
    for (const id of next) this._deletedInsightIds.delete(id)
    this.insights.items = items
    this._baseInsightIds = next
    this._dirtyInsights = true
    this._auxVersion++
  }

  /**
   * 调用方**直接改过** task 内容（包括 task 内的条目）后的标脏入口。任务树不在 `addTask` /
   * `updateTask` 那几条写口里，所以这里也要 bump 内容版本，否则精确估算停在前一水位。
   */
  markTasksDirty() {
    this._dirtyTasks = true
    this._auxVersion++
  }

  cleanStaleTmp() {
    const scanDirs = [this.dir, path.join(this.dir, SHARDS_DIR)]
    const now = Date.now()
    for (const dir of scanDirs) {
      let entries
      try {
        entries = readdirSync(dir)
      } catch {
        continue
      }
      for (const name of entries) {
        if (!name.endsWith('.tmp')) continue
        try {
          if (now - statSync(path.join(dir, name)).mtimeMs > 60000) unlinkSync(path.join(dir, name))
        } catch {
          // already gone or locked; skip
        }
      }
    }
  }

  /**
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
```

</details>

**依据 2 · 源码核查**：[src/util/fs.js:24-39](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/util/fs.js#L24-L39)

当前固定版本复核。pid tmp/rename失败抛出。

<details>
<summary>查看原文（16行）</summary>

```text
 */
export function writeJsonAtomic(file, data) {
  mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  try {
    writeFileSync(tmp, JSON.stringify(data))
    renameSync(tmp, file)
  } catch (err) {
    try {
      unlinkSync(tmp)
    } catch {
      // tmp 已不在（rename 其实成功了）或不可删；两种都无需处理
    }
    throw err
  }
}
```

</details>

**依据 3 · 源码核查**：[src/watch.js:154-180](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/watch.js#L154-L180)

当前固定版本复核。递归调度和stop检查。

<details>
<summary>查看原文（27行）</summary>

```text
  }

  _schedule(interval = this._interval) {
    this.timer = setTimeout(() => this._tick(), interval)
    if (this.timer.unref) this.timer.unref()
  }

  async _tick() {
    this.timer = null
    let changed = false
    try {
      changed = await this.poll()
    } catch {
      // poll() 内部已逐根兜底；这里保证无论发生什么都一定排下一轮，不会静默停掉 watch。
    }
    if (this._stopped) return // 轮询期间被 stop() 了，不要再排下一轮
    this._interval = this._active
      ? this._activeInterval
      : changed ? this._baseInterval : Math.min(this._interval * 2, this._maxInterval)
    this._schedule()
  }

  stop() {
    this._stopped = true
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }
```

</details>

**依据 4 · 源码核查**：[src/lazy.js:58-95](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/lazy.js#L58-L95)

当前固定版本复核。lazy队列和timer清理。

<details>
<summary>查看原文（38行）</summary>

```text

export function setupLazyIndexing(ctx, config, watchManager = null) {
  const pending = new Map()
  let timer = null

  const flush = async () => {
    timer = null
    const batch = codeFirst([...pending.keys()])
    const roots = new Map(pending)
    pending.clear()
    for (const filePath of batch) {
      try {
        await indexFile(ctx, config, filePath, watchManager, roots.get(filePath) || null)
      } catch (err) {
        console.error(`[dsh-project-memory] lazy index failed for ${filePath}: ${err.message}`)
      }
    }
  }

  const queue = (filePath, sessionRoot) => {
    pending.set(filePath, sessionRoot || null)
    if (!timer) {
      timer = setTimeout(flush, 300)
      if (timer.unref) timer.unref()
    }
  }

  // 第三个参数是宿主工具执行上下文（tool-fs / str-replace-editor 都以 `exec` 发射），
  // 取它的会话工作目录作为**本次读取所在会话**的工作目录——比 process.cwd() 精确
  // （web profile 下同一进程可能有多个会话/项目）。0.2.1+ 该目录由 workingDirectory
  // 投影决定（cd 后会变），见 util/session-dir.js。
  ctx.on('fs/observed', (target, observation, actor) => {
    if (!target || !observation || observation.kind !== 'present') return
    if (typeof target.displayPath !== 'string' || !target.displayPath) return
    queue(target.displayPath, sessionWorkingDir(actor?.agent?.session, { agent: actor?.agent }))
  })

  ctx.effect(() => () => {
```

</details>

**依据 5 · 源码核查**：[src/index.js:220-250](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index.js#L220-L250)

当前固定版本复核。auto-index cancelled只限制日志。

<details>
<summary>查看原文（31行）</summary>

```text
  ctx.tools.register(indexRepoTool(ctx, config))
  ctx.tools.register(queryMemoryTool(ctx, config))
  ctx.tools.register(rememberTool(config))
  ctx.tools.register(forgetTool(config))
  ctx.tools.register(lessonTool(config))
  ctx.tools.register(watchRepoTool(watchManager, config))
  ctx.tools.register(statsTool(config))

  // PR 2：注册 agent/pre-step 监听，向每步请求的 enter 决策追加记忆消息（默认开；
  // 任何异常/无会话 cwd → 交回默认决策，零副作用）
  installAutoInject(ctx, config)

  if (config.autoIndexOnFirstUse) {
    // effect 回调必须同步并返回 disposer；异步体独立执行，用 cancelled 标志避免卸载后再写日志
    ctx.effect(() => {
      let cancelled = false
      const run = async () => {
        const root = process.cwd()
        // 全量索引 cwd 是显式开启的行为，但"cwd 是家目录"几乎总是误用：拒绝并说明，
        // 而不是替用户把整棵树扫一遍（旧实现直接 indexRepository(ctx, config, cwd)，
        // 没有任何护栏——这正是 issue #5 里最直接的 OOM 入口）。
        if (isUnsafeRoot(root) && config.allowUnsafeRoots !== true) {
          if (!cancelled) {
            console.error(
              `[dsh-project-memory] autoIndexOnFirstUse skipped: cwd ${root} is not a project root ` +
                '(home / system / package-manager prefix). Start dsh inside a project directory, ' +
                'or set allowUnsafeRoots: true to override.',
            )
          }
          return
        }
```

</details>

**依据 6 · 源码核查**：[src/audit.js:18-56](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/audit.js#L18-L56)

当前固定版本复核。候选裁剪和日志配置。

<details>
<summary>查看原文（39行）</summary>

```text
// 影子记录：与主审计**分开一个文件**。主审计只记"真的注入了"的步，静默步（包括对照组那种
// "本该零注入"的步）完全不落痕，于是日志回答不了"换个阈值/换个判据会怎样"。影子记录每步都写，
// 带全部候选的特征与判据结果，用来 (a) 离线重放任一阈值、(b) 攒"特征 → 该不该注入"的训练样本。
export const SHADOW_FILE = 'admission-shadow.jsonl'
// 512KB 而不是 2MB：轮转只保留 `.1` 一代，所以单项目日志的硬上限是
// `2 × shadowMaxBytes + 2 × auditMaxBytes`，之前是 4.6MB（在小项目上比 store 本身还大，
// 实测本插件自己的 store 里 3.1M/4.2M 是日志）。512KB 下上限降到 ≈1.5MB，
// 而按每行 ~1.5KB 算仍有 ~680 步的历史窗口 —— 远超"离线重放最近的历史"所需。
const DEFAULT_SHADOW_MAX_BYTES = 512 * 1024

/**
 * 一行影子记录最多保留多少个候选。
 *
 * 影子日志 **90.6% 的体积是 `candidates`**（实测 210 行 / 965KB，候选占 875KB），而真实 store
 * 单步就能产生 40~60 条（中位 42）。候选按分数降序排列，`decision === 'cand'` 必然排在最前
 * （相对阈值就是分数比），所以「**全部 cand + 按排名补足**」既保住离线重放最需要的那批，
 * 又砍掉远处必然被 coverage/relative 拦掉的尾巴。截断量记在 `candidatesTotal`，不静默。
 */
const SHADOW_MAX_CANDIDATES = 16

/**
 * 两份 JSONL 旁路日志共用的配置归一。它们的差别只有「开关名 / 字节上限键 / 默认上限」，
 * 其余判定（默认开、非法上限退回默认）必须完全一致——抄成两份就等着一边补了 `> 0`、
 * 另一边忘了。语义刻意选择：
 *  - `!== false` 而不是 `=== true`：未配置 = 开（观测是这个插件唯一的仪表盘）；
 *  - `> 0` 而不是 `!= null`：0 / 负数 / NaN 都视为「没配」，退回默认上限，而不是禁用。
 */
function cfgSideLog(config, { enabledKey, maxKey, defaultMaxBytes }) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c[enabledKey] !== false,
    maxBytes: typeof c[maxKey] === 'number' && c[maxKey] > 0 ? c[maxKey] : defaultMaxBytes,
  }
}

/** 审计配置：默认开，显式 `auditLog: false` 才关。 */
export function cfgAudit(config) {
  return cfgSideLog(config, { enabledKey: 'auditLog', maxKey: 'auditMaxBytes', defaultMaxBytes: DEFAULT_MAX_BYTES })
}
```

</details>

**依据 7 · 源码核查**：[src/vector-index.js:34-50](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/vector-index.js#L34-L50)

当前固定版本复核。向量指纹近似。

<details>
<summary>查看原文（17行）</summary>

```text
  const t = it?.title || it?.pattern || it?.problem || it?.choice || it?.topic || it?.body
  return String(t ?? '').trim().slice(0, 200)
}

const hashOf = (text) => createHash('sha256').update(String(text)).digest('hex').slice(0, 16)
const keyOf = (it) => (it?.insightId ?? it?.id ?? null)

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
```

</details>

#### 缺口

- 跨进程同store、掉电中断、卸载时在途写入与完整迁移恢复未验证。
  **影响**：单文件原子不等于整库事务或取消保证。
  **进一步探讨**：从两个进程、分片/辅助文件写入故障和在途抽取卸载检查版本/日志及可恢复原件。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 首次、持续与恢复成本，效果证据到哪层？

**研究主题**：效果与总成本

#### 完整回答

阶段为首次使用，现金与资源成本为文件/PDF抽取、符号/词项、optional向量资源，人工与时间投入为选根、去秘密、设置任务和知识范围，已知条件与未知项为20000文件/12深度是局部扫描上限，不是常驻内存保证。
阶段为持续使用，现金与资源成本为watch/lazy IO、候选打分、近似400-token上下文、审计与向量缓存，人工与时间投入为核对引用、新鲜度、近邻覆盖和全局知识，已知条件与未知项为索引期无LLM，扩展/反思另计模型成本。
阶段为失败恢复，现金与资源成本为shards/辅助文件/global原件和有限prev/deleted备份，人工与时间投入为查截断、根错位、误覆盖/提升与重建，已知条件与未知项为不是完整历史版本库，恢复投入随语料变化。

效果项为索引，当前证据支持为哈希增量、分片、词项与可定位引用，尚不能确定为任意语料完整/引用持续有效。
效果项为检索，当前证据支持为分层top-k、词法/向量融合和门控，尚不能确定为真实用户相关性及知识适用性。
效果项为工作流，当前证据支持为todo绑定/反向同步、记忆范围与自动提示，尚不能确定为任务质量和减少返工。
效果项为可观察性，当前证据支持为注入/候选/预算留痕，尚不能确定为永久完整日志或曝光即采纳。

README和源码注释列出特定语料的大小/延迟/hit@k、向量包/RSS数据，这些是作者报告与标定，不是本轮重复测量，不外推所有项目。库越大、PDF越多与长标题/中文混合都会改变IO、内存与token。默认懒索引降低初始扫描负担，但并不免除持续检查资料有效性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index-pipeline.js:25-67](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index-pipeline.js#L25-L67)

当前固定版本复核。大小/哈希和无模型索引链。

<details>
<summary>查看原文（43行）</summary>

```text
/** 后缀 → 'code' | 'doc' | null。 */
export function fileKind(ext) {
  if (isSupportedCode(ext)) return 'code'
  if (isSupportedDoc(ext)) return 'doc'
  return null
}

function exceedsSizeCap(kind, size, config) {
  return kind === 'code' && !!config.maxFileSizeMb && size > config.maxFileSizeMb * 1024 * 1024
}

/**
 * 读取 + 判重 + 抽条目。抛出的异常（读盘失败、PDF 解析失败……）由调用方按各自策略处理：
 * index_repo 收进 failures 汇总，watch 去重打印并可重试，lazy 记一行日志。
 *
 * @returns {{key: string, hash?: string, size?: number, type?: string, entries?: object[]}}
 *   key 为 UNSUPPORTED / OVERSIZE / UNCHANGED / DROP / WRITE 之一。
 * @param {object} args
 * @param {number} [args.size] 调用方已 statSync 时传入，避免重复 stat。
 * @param {boolean} [args.force] index_repo 的 reindex：忽略哈希跳过。
 */
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

**依据 2 · 源码核查**：[src/auto-inject.js:493-504](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L493-L504)

当前固定版本复核。字符近似预算。

<details>
<summary>查看原文（12行）</summary>

```text
 */
export function buildInjection(opts) {
  const { query, task, globalStore, cfg } = opts
  const store = opts.store || null
  const tags = opts.projectTagsList || []
  const ctx = buildReadinessContext({ ...(opts.readiness || { humanText: query || '' }), tags })
  const labels = []
  const reasons = []
  const dropped = []
  const parts = []
  // 预算只能是上限，不是目标。两条额度分开：
  //   stepBudget —— 单轮（常驻块 + 条目）共享的 maxTokens；
```

</details>

**依据 3 · 源码核查**：[src/audit.js:18-56](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/audit.js#L18-L56)

当前固定版本复核。持续日志负载。

<details>
<summary>查看原文（39行）</summary>

```text
// 影子记录：与主审计**分开一个文件**。主审计只记"真的注入了"的步，静默步（包括对照组那种
// "本该零注入"的步）完全不落痕，于是日志回答不了"换个阈值/换个判据会怎样"。影子记录每步都写，
// 带全部候选的特征与判据结果，用来 (a) 离线重放任一阈值、(b) 攒"特征 → 该不该注入"的训练样本。
export const SHADOW_FILE = 'admission-shadow.jsonl'
// 512KB 而不是 2MB：轮转只保留 `.1` 一代，所以单项目日志的硬上限是
// `2 × shadowMaxBytes + 2 × auditMaxBytes`，之前是 4.6MB（在小项目上比 store 本身还大，
// 实测本插件自己的 store 里 3.1M/4.2M 是日志）。512KB 下上限降到 ≈1.5MB，
// 而按每行 ~1.5KB 算仍有 ~680 步的历史窗口 —— 远超"离线重放最近的历史"所需。
const DEFAULT_SHADOW_MAX_BYTES = 512 * 1024

/**
 * 一行影子记录最多保留多少个候选。
 *
 * 影子日志 **90.6% 的体积是 `candidates`**（实测 210 行 / 965KB，候选占 875KB），而真实 store
 * 单步就能产生 40~60 条（中位 42）。候选按分数降序排列，`decision === 'cand'` 必然排在最前
 * （相对阈值就是分数比），所以「**全部 cand + 按排名补足**」既保住离线重放最需要的那批，
 * 又砍掉远处必然被 coverage/relative 拦掉的尾巴。截断量记在 `candidatesTotal`，不静默。
 */
const SHADOW_MAX_CANDIDATES = 16

/**
 * 两份 JSONL 旁路日志共用的配置归一。它们的差别只有「开关名 / 字节上限键 / 默认上限」，
 * 其余判定（默认开、非法上限退回默认）必须完全一致——抄成两份就等着一边补了 `> 0`、
 * 另一边忘了。语义刻意选择：
 *  - `!== false` 而不是 `=== true`：未配置 = 开（观测是这个插件唯一的仪表盘）；
 *  - `> 0` 而不是 `!= null`：0 / 负数 / NaN 都视为「没配」，退回默认上限，而不是禁用。
 */
function cfgSideLog(config, { enabledKey, maxKey, defaultMaxBytes }) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c[enabledKey] !== false,
    maxBytes: typeof c[maxKey] === 'number' && c[maxKey] > 0 ? c[maxKey] : defaultMaxBytes,
  }
}

/** 审计配置：默认开，显式 `auditLog: false` 才关。 */
export function cfgAudit(config) {
  return cfgSideLog(config, { enabledKey: 'auditLog', maxKey: 'auditMaxBytes', defaultMaxBytes: DEFAULT_MAX_BYTES })
}
```

</details>

**依据 4 · 作者声明**：[src/vector-index.js:1-10](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/vector-index.js#L1-L10)

当前固定版本复核。作者特定规模/延迟报告。

<details>
<summary>查看原文（10行）</summary>

```text
// 经验/洞察层的**可选**向量索引（leanvec）：持久化 + 逐条失效 + 优雅降级。
//
// 为什么持久化：实测 103 条 × 256 维 = **105 KB**，全量编码要 ~0.4s；读盘 + base64 解码 ~20ms。
// 为什么只覆盖这两层：它们的池子小（实测真实 store ≤103 条）；doc/symbol 是 10⁴ 量级
// （某真实 TS 仓库 15.6k 条目），每查询全量编码要 60s，所以那一层继续纯词法。
//
// 失效分两级：
//   ① **模型指纹**（词表内容哈希 + 表字节数）变了 → 整个文件作废，全量重建；
//   ② **条目文本哈希**变了 → 只重算那一行（其余复用）。
// 降级：leanvec 不可用、文件损坏、embed 抛异常 —— 一律返回 null / 空 Map，
```

</details>

**依据 5 · 源码核查**：[src/index.js:30-49](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/index.js#L30-L49)

当前固定版本复核。扩展关闭、lazy与scan默认。

<details>
<summary>查看原文（20行）</summary>

```text
  maxFileSizeMb: Schema.number().default(10),
  maxOutputChars: Schema.number().default(8000),
  maxPdfPages: Schema.number().default(1000),
  llmQueryExpansion: Schema.boolean().default(false),
  expansionCount: Schema.number().default(6),
  // 辅助 LLM 调用的路由覆写 —— **索引期零 LLM**，这里的路由只服务于召回期可选项
  // （llmQueryExpansion 查询扩展）与反思期（reflection.enabled）。
  // 未设置时：工具调用取当前会话 header 的 provider/model；后台路径取最近一次会话路由（request/header）。
  // 两者都拿不到时明确走回退并记录 degraded（不静默）。
  llm: Schema.object({
    provider: Schema.string(),
    model: Schema.string(),
  }).default({}),
  lazyIndexing: Schema.boolean().default(true),
  autoIndexOnFirstUse: Schema.boolean().default(false),
  watch: Schema.boolean().default(true),
  watchInterval: Schema.number().default(30),
  // 危险根护栏（issue #5）：家目录 / 文件系统根 / 系统目录 / 包管理器前缀（/opt/homebrew …）
  // 整体扫描会吃满内存，默认一律拒绝。懒索引、会话审计、任务桥在这类目录里始终零副作用；
  // `autoIndexOnFirstUse` 不在此列——本开关同样放行它。其余只放开**显式**带 root 的工具调用。
```

</details>

#### 缺口

- 没有本轮同任务rg/手工笔记与插件的端到端质量、资源和人工对照。
  **影响**：不能把作者小样本hit率转为实际效率/成本承诺。
  **进一步探讨**：固定语料/任务/模型和压缩点，测召回、错误建议、真实token/RSS、人工返工和恢复。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用建议与未来假设怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可有条件试用，适合愿意审核项目知识和引用的维护者，先用非敏感单项目、少量人工记忆与默认关闭的反思/扩展。分层召回、根护栏和可解释注入比无条件全文回放更成熟，但需要明确global会跨项目、反思草稿可命中更广scope既有项、日志与内容会进入模型通道。长期重要规范不应仅存于自动去重/衰减记忆里。

继续探讨可先用现成项目问题验证引用，查看注入/影子记录的漏注误注，再用同标题反思草稿检验是否更新确认知识；启用向量/反思前后分别保留基线与原件。遇无法解释scope变化、关键约束遗漏或同store并发不一致时，应暂停依赖自动注入，回到人工来源核查。

未验证假设是建立带来源版本、适用域和审批状态的知识修订链，把“相似”“被曝光”“任务采用”“结果验证”分字段，草稿只能提出改动而不能覆盖确认项目/global项；注入附适用/过期收据。相较当前文本近邻和任务数提升，可能降低错知识扩大，但会增加人工审核/元数据成本。最小对照固定两项目、反向结论近邻、过期引用和反思草稿，比较错scope更新、任务违约、漏注、审核时间和token；若审核负担超过收益或漏掉有效经验，需收窄方案。未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/insight-store.js:207-226](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L207-L226)

当前固定版本复核。近邻覆盖正文和confidence强化。

<details>
<summary>查看原文（20行）</summary>

```text
}

/** 自动合并会改写的正文字段（title 也在内：0.90 以上的两条标题本就近乎同一句）。 */
const MERGE_FIELDS = ['title', 'pattern', 'fix', 'choice', 'reason', 'problem', 'solution', 'body']

/**
 * 把 base 合并进既有条目：**正文取新值**（旧值进 `prev`），成员/文件/符号并集，置信取高，记命中。
 *
 * 与旧实现的区别就是那一个 `if (b && !existing[f])`：以前字段已有值就**静默丢掉新文本**，
 * 于是"我记错了，改成正确的"永远落不进去（只加 hitCount）。现在反过来——新值落地、旧值可还原。
 * 提升路径只传成员/文件/符号/置信，不传正文字段，所以它们的语义一字未变。
 * @returns {{item: object, replaced: string[]}} 被改动的字段名（供调用方回报）
 */
export function mergeInto(existing, base, cfg, nowIso) {
  const now = nowIso || new Date().toISOString()
  existing.sourceTaskIds = unionStrings(existing.sourceTaskIds, base.sourceTaskIds)
  existing.files = unionStrings(existing.files, base.files)
  existing.symbols = unionStrings(existing.symbols, base.symbols)
  existing.tags = unionStrings(existing.tags, base.tags)
  const replaced = []
```

</details>

**依据 2 · 源码核查**：[src/insight-store.js:830-866](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L830-L866)

当前固定版本复核。任务scope写可合并更广知识。

<details>
<summary>查看原文（37行）</summary>

```text
  const now = nowIso || new Date().toISOString()
  const secretField = containsSecretFields(raw)
  if (secretField) {
    return { ok: false, error: `内容疑似包含密钥/token/私钥形态数据（字段: ${secretField}），已拒绝写入` }
  }
  if (raw && raw.id) {
    const found = findInsightAnywhere({ store, globalStore }, raw.id)
    if (!found) return { ok: false, error: `找不到要更新的条目: ${raw.id}（可能已被删除/提升；用 query_memory 重新确认 id）` }
    const wasDraft = found.item.draft === true
    const replaced = applyUpdate(found.item, raw, now)
    if (found.scope === 'global') globalStore.markDirty()
    else if (found.scope === 'task') store.markTasksDirty()
    else store.replaceInsightItems(store.insightItems())
    const hint = replaced.length
      ? `已就地更新（覆盖字段：${replaced.join('/')}，旧值在 prev）`
      : wasDraft ? '已确认草稿（draft=false）' : '没有字段变化'
    return {
      ok: true,
      action: 'updated',
      id: raw.id,
      scope: found.scope,
      replaced,
      hint: wasDraft && replaced.length ? `${hint}；草稿已确认` : hint,
    }
  }
  const s = scope || 'project'
  if (!INSIGHT_SCOPES.includes(s)) return { ok: false, error: `非法 scope: ${s}` }
  if (s === 'global') {
    if (!globalStore) return { ok: false, error: 'global 存储未初始化' }
    const res = upsertIntoPool(globalStore.items(), raw, cfg2, now, { source, scope: 'global', cosine })
    if (res.action === 'created') pruneItems(globalStore.items(), cfg2.maxGlobalProcedures, now)
    globalStore.markDirty()
    return { ok: true, ...res, scope: 'global', hint: res.hint || buildHint(res) }
  }
  if (s === 'task') {
    if (!store || !taskId) return { ok: false, error: 'task 级写入需要 taskId' }
    const task = store.getTask(taskId)
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:960-982](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/insight-store.js#L960-L982)

当前固定版本复核。按任务数扩大global。

<details>
<summary>查看原文（23行）</summary>

```text
    }
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
    const poolNear = vectorNear(vectorText(base), pool, cosine)
    const poolTarget = autoMergeTarget(poolNear, cfg)
    if (poolTarget) {
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:810-829](https://github.com/00080000/dsh-project-memory/blob/70aa69b06af58b33f9de98f7e6cc085877063714/src/auto-inject.js#L810-L829)

当前固定版本复核。曝光记账与注入分离，是证据状态分层起点。

<details>
<summary>查看原文（20行）</summary>

```text
  // 记忆根通告：根是**推定**的（会话工作目录，且该目录没有任何项目标记）时，
  // 第一次注入前告诉模型"记忆现在存在哪、怎么改"。它是状态声明（与常驻任务卡同类），
  // 只发一次、不占条目额度；否则模型只看到一条来自某处的记忆，却不知道那个根是怎么来的。
  const notice = rootNotice({ root, sessionId, sessions, config })

  const fp = built.text ? fingerprint(built.dedupeText ?? built.text) : fingerprint(notice || '')
  const injectedText = notice ? (built.text ? `${notice}\n${built.text}` : notice) : built.text
  if (!injectedText || fp === sessions.lastText.peek(sessionId)) return null
  sessions.lastText.set(sessionId, fp)
  const itemCount = built.reasons.length
  const summary = itemCount
    ? `memory inject: ${itemCount} item(s)${built.entry ? ' + task card' : ''}`
    : built.entry ? 'memory inject: task card' : 'memory root notice'

  // 只记真的进了上下文的那几条：dropped 的没被看到，不能记账（否则以后永远不再注入）。
  const seen = sessions.items.ensure(sessionId)
  for (const r of built.reasons) {
    if (r && r.id && r.hash) seen.set(r.id, { hash: r.hash, step: stepNo })
  }
  // 会话额度只被"条目"消耗；任务卡不算（否则任务一多就把记忆挤没了）。
```

</details>

#### 缺口

- 审批修订链/来源版本方案未实现或对照。
  **影响**：不提升当前知识可靠性和安全边界。
  **进一步探讨**：用两项目、冲突近邻、过期来源和草稿序列比较污染/漏注/任务质量及人工成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
