# dsh-project-memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[21fc69e](https://github.com/00080000/dsh-project-memory/tree/21fc69e3e98f3864677e091477b7d543a0e54939)

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

rg/IDE符号查询、手工项目笔记/AGENTS与宿主任务列表；增量是分层持久索引和有界提示，不是自动可信记忆。

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

固定源码支持分片增量、分层召回、TaskBridge与可解释注入；相关性不是验证，草稿跨scope合并、来源/根边界和事务粒度需明确。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/index-pipeline.js、src/doc-pipeline.js、src/parsers/pdfjs-parser.js、src/store.js、src/recall.js、src/tools/query-memory.js、src/setup/taskbridge.js、src/insight-store.js、src/reflection-pipeline.js、src/auto-inject.js、src/util/fs.js、src/lazy.js、src/watch.js、src/audit.js、src/vector-index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查共享文件索引、doc抽取、shard/CAS、分层召回、autoInject门控/预算、TaskBridge、reflection到跨scope合并和global提升、root/scan及审计；未穷尽所有UI、解析器/符号语言或完整host契约，不运行目标。
- 下一步：进一步探讨可固定两项目与冲突知识/过期引用/反思草稿，记录真实任务质量、漏注误注、scope变化、token/RSS和审核工时，与手工检索基线比较。

**分析版本**

- **仓库**：[00080000/dsh-project-memory](https://github.com/00080000/dsh-project-memory)
- **版本号**：0.6.3（[固定提交 21fc69e](https://github.com/00080000/dsh-project-memory/tree/21fc69e3e98f3864677e091477b7d543a0e54939)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索来源版本/适用域/审批修订链，将草稿建议、相似、曝光和结果验证分开，比较跨scope错误、任务违约与审核负担；未实现。详见[Q09](#research-q09)。

进一步探讨可固定两项目与冲突知识/过期引用/反思草稿，记录真实任务质量、漏注误注、scope变化、token/RSS和审核工时，与手工检索基线比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2263 | — | — | 48510 |
| .js | source | 53 | 14366 | 10430 | 3414 | — |
| .mjs | source | 6 | 1447 | 1189 | 156 | — |
| .ts | source | 9 | 1343 | 937 | 324 | — |
| .tsx | source | 5 | 1563 | 1333 | 151 | — |
| .mjs | test | 41 | 9671 | 7738 | 1204 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+created%3A2026-09-22T05%3A37%3A38.810Z..2026-10-22T05%3A37%3A38.810Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A37%3A38.810Z..2026-10-22T05%3A37%3A38.810Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断项目索引/任务/insight与自动注入的贡献和边界，重点核查草稿跨scope、相关性/预算和持久化恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目记忆服务什么任务，效果如何判断？

**研究主题：**场景与需求

#### 完整回答

面向在同一项目持续开发或读文档的DSH用户。项目代码符号、PDF/MD/text摘要和已形成的经验可以跨会话召回，TaskBridge保存任务/文件线索，自动注入在动手前提供相关提示。输入是本地项目材料、会话todo/工具动作与用户写的经验，不是外部权威知识库。

合格任务应能找到当前版本的相关文件/规则，正确引用并由Agent打开原文核对，再在实际代码/问题上交付合格结果。path:line只说明索引生成时的定位，不冻结仓库版本；文档summary、标签confidence和命中次数不证明内容真实或适用。真正收益需比较约束遗漏、答案正确与人工返工，不能由hit@k或注入次数代替。

参照为rg/IDE符号查找加手工项目笔记/AGENTS，插件减少重复索引和上下文接线，但维护更多持久状态。适合长期项目与可公开给模型的经验；一次性目录、多人隔离要求高或必须保留完整审计原文时，应先核对根解析、全局知识流转和删除/覆盖边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/README.md#L1-L17)

作者定义项目记忆及召回用途。

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

**依据 2 · 源码核查**：[src/recall.js:1-18](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/recall.js#L1-L18)

召回与动手前提示分契约，跨层分数不伪可比。

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

**依据 3 · 源码核查**：[src/insight-store.js:310-323](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L310-L323)

曝光/命中并非实际采纳或验证。

<details>
<summary>查看原文（14行）</summary>

```text
  if (near.top1 - near.top2 < cfg.autoMergeMargin) return null
  return near
}

/**
 * 使用记账：条目被**真正用到**时更新活跃度——注入进了上下文，或被 `query_memory` 命中。
 *
 * 为什么必须有：`applyDecay` / `pruneItems` 判活跃度只看 `lastHitAt || updatedAt || createdAt`，
 * 而 `lastHitAt` 此前只由 merge/reinforce 写（= 模型又写了一条相近的知识）。于是一条天天被注入、
 * 但从没人重写它的教训，`decayDays`（默认 90）之后会被自动归档、再也不会被推送——**用得最多的
 * 反而等于没人用过**。这是行为缺陷，不是调优问题。
 *
 * 记账**不参与任何注入判据**：它只影响活跃度/衰减，以及离线训练样本的标签。
 * 语义是"曝光次数"而非"被采纳次数"——更强的信号（模型是否真的照着做了）需要另外的回路。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档/代码索引与增量召回怎样工作？

**研究主题：**功能与机制

#### 完整回答

index_repo、watch与lazy共用planFileIndex，先检查后缀/体积，读取buffer哈希，未变且无需terms回填则跳过。代码提符号，文档按标题/长度切片，summary最多300字符用于注入，整chunk terms用于检索；PDF走pdfjs文本抽取，不含OCR。条目保存相对路径/行，doc→symbol链接读取时派生，避免存重复关系。

每源文件一个shard保存record与条目，commitFileUpdates按旧record哈希作CAS，再保存脏分片。它比较的是索引store记录是否被另一编排改过，不是重新读取源文件确认内容仍是plan时版本，因此源文件在抽取后改变时仍可能短暂陈旧，依后续watch修正。扫描截断/不可读标记truncated并不清未见条目，避免把没扫到当删除。

query_memory解析安全根、校验存在/非空查询，分层top-k召回，词法为主，experience/insight可用leanvec语义融合；doc/symbol仍词法。可选LLM query expansion默认关。分层展示与相对分帮助解释结果，但高分不是置信概率，路径也不自动证明当前原文仍一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/index-pipeline.js:45-67](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index-pipeline.js#L45-L67)

共享哈希/抽取和不变跳过。

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

**依据 2 · 源码核查**：[src/doc-pipeline.js:25-54](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/doc-pipeline.js#L25-L54)

确定性summary/terms和chunk引用。

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

**依据 3 · 源码核查**：[src/parsers/pdfjs-parser.js:60-80](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/parsers/pdfjs-parser.js#L60-L80)

PDF文本抽取而非OCR。

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

**依据 4 · 源码核查**：[src/store.js:1011-1034](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/store.js#L1011-L1034)

CAS比较store旧记录，不重新哈希源文件。

<details>
<summary>查看原文（24行）</summary>

```text
  commit(fn) {
    const result = fn(this)
    this.pruneTasks()
    this.save()
    return result
  }

  /**
   * 写入一条文件更新，以 expectedHash 做 CAS。
   * @returns {boolean} true = 已写入；false = 文件自扫描后又被改动，本次拒绝
   *   （调用方让该条目保持未落快照，下一轮重试）。
   * 移除条目不经过这里：调用方在 commit 里直接 removeFile（见 index-pipeline.js）。
   */
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
  }
```

</details>

**依据 5 · 源码核查**：[src/util/fs.js:232-268](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/util/fs.js#L232-L268)

不可读/截断和遍历上限。

<details>
<summary>查看原文（37行）</summary>

```text
  let hitFileCap = false
  while (stack.length) {
    const [dir, depth] = stack.pop()
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      // 读不到 ≠ 不存在。旧实现直接 continue，于是这片子树被当成"已删除"（调用方拿
      // seen 去清 unseen），而且失败是静默的。置 truncated 让调用方跳过清理。
      unreadable.push(dir)
      truncated = true
      continue
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoreNames.has(entry.name)) continue
        if (nestedStoreName && hasOwnStore(full, nestedStoreName)) {
          skipped.push(full)
          continue
        }
        if (depth + 1 > maxDepth) {
          truncated = true
          capped = true
          continue
        }
        stack.push([full, depth + 1])
      } else {
        if (out.length >= maxFiles) {
          truncated = true
          capped = true
          hitFileCap = true
          break
        }
        out.push(full)
      }
```

</details>

**依据 6 · 源码核查**：[src/tools/query-memory.js:68-119](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/tools/query-memory.js#L68-L119)

根/非空/分层与可选扩展、向量。

<details>
<summary>查看原文（52行）</summary>

```text
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
        storeDir: memoryRootFor(root, config.memoryDir),
        items: vectorItemsFrom(store, globalStore),
        vectorDir: cfg.vectorDir,
        alpha: cfg.vectorAlpha,
      })
      // 一次 recall 覆盖全部层：doc/symbol/experience/insight 共用同一个检索核心（src/recall.js）。
      const recalled = recallItems({
        store,
        globalStore,
        queries,
        boundTaskId,
        limit,
        rerank,
        layers: [
          ...(wantMemory ? (type === 'symbol' ? ['symbol'] : type === 'doc' ? ['doc'] : ['doc', 'symbol']) : []),
          ...(wantInsight ? ['insight'] : []),
          ...(type === 'all' || type === 'experience' ? ['experience'] : []),
        ],
      })

      const lines = []
```

</details>

#### 缺口

- 所有文件类型/字符编码及扫描时编辑的实际索引新鲜度未验证。
  **影响：**不能把引用路径当版本固定原文，也不承诺扫描完整。
  **进一步探讨：**可用已知符号/文档问题集，在plan后改文件、删文件和截断扫描对照引用与原文。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · insight与TaskBridge带来什么贡献？

**研究主题：**贡献与相对优势

#### 完整回答

TaskBridge监听todo/write，把非空清单自动建任务/绑定会话，排除子代理自动建档；后续同步steps与文件热点，选择旧任务时可将其步骤反向推入宿主todo/write。/tasks集中驱动任务与记忆审核动作，减少模型工具和界面各维护一份任务的漂移，但模型todo仍不是独立任务验收。

经验、lesson、decision、procedure统一进入insight实体，支持task/project/global。相似标题的向量分或词法重叠决定覆盖/强化/新建，旧字段保留prev；两任务命中且confidence门槛可升project，多任务再升global。reflection默认关，开启后模型从任务快照产草稿。贡献是“检索材料”和“做事前须知”两条交付契约加任务绑定、范围流转与可观测门控，而非新embedding模型或自动正确的经验学习。

这些机制有实际可迁移的工程组合，尤其分层召回、自动注入与审计共用候选结构。然而相似度对应的是文本近邻，两个任务重复写同一错结论仍可能强化或扩大scope；自动提升不等于经过独立检验，必须结合Q05的草稿合并范围理解。

#### 证据与依据

**依据 1 · 源码核查**：[src/setup/taskbridge.js:216-247](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/setup/taskbridge.js#L216-L247)

todo自动建任务、绑定与子代理排除。

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
      task.lastActiveAt = now
```

</details>

**依据 2 · 源码核查**：[src/setup/taskbridge.js:78-93](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/setup/taskbridge.js#L78-L93)

任务步骤反向写宿主todo。

<details>
<summary>查看原文（16行）</summary>

```text
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
export function shouldAdoptToHost(config) {
```

</details>

**依据 3 · 源码核查**：[src/index.js:191-218](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index.js#L191-L218)

集中工具/命令和自动注入接线。

<details>
<summary>查看原文（28行）</summary>

```text
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

  ctx.tools.register(indexDocTool(ctx, config))
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
```

</details>

**依据 4 · 源码核查**：[src/insight-store.js:775-798](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L775-L798)

向量/词法覆盖强化与新建。

<details>
<summary>查看原文（24行）</summary>

```text
function upsertIntoPool(items, raw, cfg, nowIso, extra = {}) {
  const base = { ...raw, source: extra.source, sourceTaskIds: extra.sourceTaskIds || raw.sourceTaskIds }
  const text = insightMatchText(base)
  const near = vectorNear(vectorText(base), items, extra.cosine)
  const target = autoMergeTarget(near, cfg)
  if (target) {
    const { replaced } = mergeInto(target.item, base, cfg, nowIso)
    return { action: 'auto-merged', id: target.item.id, replaced, cos: Number(target.top1.toFixed(3)) }
  }
  const hit = findBestOverlapMatch(text, items)
  if (hit && hit.score >= cfg.dedupOverlap) {
    const { replaced } = mergeInto(hit.item, base, cfg, nowIso)
    return { action: 'merged', id: hit.item.id, replaced }
  }
  if (hit && hit.score >= cfg.reinforceBand) {
    reinforceOnly(hit.item, base, nowIso)
    return { action: 'reinforced', id: hit.item.id }
  }
  const ins = normalizeInsight(base, { scope: extra.scope || 'project', source: extra.source, nowIso })
  items.push(ins)
  const hint = hintOf(near, cfg)
  return hint ? { action: 'created', id: ins.id, near: hint } : { action: 'created', id: ins.id }
}

```

</details>

**依据 5 · 源码核查**：[src/insight-store.js:917-945](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L917-L945)

两任务、confidence与提升非草稿。

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
      moved.movedFrom = { scope: 'task', id: ins.id, at: now }
      pjItems.push(moved)
```

</details>

**依据 6 · 源码核查**：[src/reflection-pipeline.js:91-116](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/reflection-pipeline.js#L91-L116)

反思产draft:true任务知识。

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

**研究主题：**缺陷与关键质疑

#### 完整回答

pre-step先交后继，缺cwd/session或危险根不注入，读取project/global及当前绑定任务。resident任务卡与items分开配额，items优先显式trigger，再走统计hint；procedure不走普通提示。hint结合coverage、query support、匹配数和相对最高分门槛，可选向量；候选门槛和预算结果分别留日志，有助于解释为什么没注入。

maxTokens实际乘3变字符预算，最终clamp也按字符，不是模型tokenizer的严格token上限。任务卡与省略说明/root notice等开销也要区分；同一次正文变化、会话级次数/字符熔断及cooldown让提示可静默。曝光更新hitCount/lastHitAt供衰减，不检测模型是否采用，更不评估任务质量。向量开关会改变词法最低命中门槛，不能把降级理解成相同召回准确率。

这种多重门控比每步塞全部记忆更审慎，但阈值依语料、语言与作者小样本标定，仍会漏掉关键约束或注入相似但不适用知识。snapshot是模型上下文材料，不是强制执行政策。一次检索命中/注入不是事实验证，也不使旧记忆获得更高证据等级。

#### 证据与依据

**依据 1 · 源码核查**：[src/auto-inject.js:704-731](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L704-L731)

真实session cwd、危险根及store读入。

<details>
<summary>查看原文（28行）</summary>

```text
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
  // 记忆根与懒索引/工具侧同一套解析：项目标记优先，其次是安全的会话工作目录。
  // 少了这一步，同一个会话的审计日志与懒索引会落在两个不同的 store 里。
  const root = resolveProjectMemoryRoot(cwd)
  if (!root) return null

  const query = lastUserText(decision.messages)
  const memoryRoot = memoryRootFor(root, config.memoryDir)
  const store = new ProjectMemoryStore(memoryRoot).load()
  const globalStore = new GlobalStore(cfg.globalFile || defaultGlobalFile()).load()
  const boundTaskId = store.getBoundTaskId(sessionId)
  const task = boundTaskId ? store.getTask(boundTaskId) : null

  // 两个窗口合并进同一个就绪上下文：人类消息（先发）+ 已观察动作（反应）。
  // 动作平面（S1）：把"最近做过什么"解析成 op / 写目标 / 主机——不再把原始参数当文本搜。
```

</details>

**依据 2 · 源码核查**：[src/auto-inject.js:481-518](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L481-L518)

字符近似预算和两通道。

<details>
<summary>查看原文（38行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/auto-inject.js:534-591](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L534-L591)

预算placement、丢弃原因与clamp。

<details>
<summary>查看原文（58行）</summary>

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
    }
  }

  const total = [entry, ...parts].filter(Boolean)
  // 早退也必须带上 candidates/scoreQuery：空块不等于"没有候选"（无任务卡 + 全部被预算挤掉
  // 就是这种形状），此前这里把两者一起丢了。
  if (!total.length) {
    return { text: '', entry, labels, reasons, dropped, candidates, scoreQuery, itemChars: itemUsed }
  }
  // 整块只受单轮预算（maxTokens）约束；会话条目额度已在 place() 里单独扣过。
  const clamp = (t) => (t.length > stepBudget ? `${t.slice(0, stepBudget)}\n…(截断)` : t)
  const dedupeText = clamp([entryStable, ...parts].filter(Boolean).join('\n'))
  return { text: clamp(total.join('\n')), entry, entryStable, labels, reasons, dropped, candidates, scoreQuery, dedupeText, itemChars: itemUsed }
}
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:810-829](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L810-L829)

曝光记账不影响主流程。

<details>
<summary>查看原文（20行）</summary>

```text
    quota.items += built.reasons.length
    quota.chars += typeof built.itemChars === 'number' ? built.itemChars : 0
    quota.lastStep = stepNo
  }

  // 使用记账：注入进上下文 = 这条记忆被用到了。必须在这里显式落盘——注入路径不会走到
  // 任何其它 save()，只标脏等于进程退出就丢。记账失败绝不影响注入（与审计同约定）。
  if (built.reasons.length) {
    try {
      if (recordHit({ store, globalStore, ids: built.reasons.map((r) => r.id) })) {
        // 只有这个根里真有东西才落盘。否则一次**全局** insight 的命中就会为一个从没被
        // 索引过的容器目录建出整个 store（`save()` 会 mkdir）。审计侧同样不建，见 audit.js。
        if (store.hasContent) store.save()
        globalStore.commit()
      }
    } catch {
      /* ignore：记账是旁路，不能拖累注入 */
    }
  }

```

</details>

**依据 5 · 源码核查**：[src/recall.js:44-66](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/recall.js#L44-L66)

有无向量的匹配门槛差异。

<details>
<summary>查看原文（23行）</summary>

```text
 * （来自 `git commit --amend --no-edit`），于是单个片段就拿走了 3.13 分。提示通道早就有这条规则
 * （`hintMinMatched`，默认 min(2, 词数)），**工具路径与这两层一直漏着**。
 *
 * ⚠ **只在没有向量层时生效**（`rerank` 为空）。这是同查询集 A/B 实测出来的（36 条、同一个 store）：
 *   · 纯词法下加闸门：BM25 的 hit@1/3/5/10 = 39/50/58/69% **完全不变**，只是不再对乱码查询出声；
 *   · 有向量时加闸门：融合 hit@5/10 从 64/72% 掉到 58/64%，"完全没召回"从 10 涨到 13。
 * 原因是结构性的：**向量救回来的那批，恰恰就是词法弱到不足 2 个命中的**——用词法的尺子去筛，
 * 等于把向量的全部价值砍掉。有语义分时就该让语义分判质量，词法闸门不要越权。
 *
 * 只作用于 experience / insight 两层：它们是短标题语料，单片段命中几乎没有证据力；
 * doc/symbol 层是代码与路径（`js` / `id` 这类单词查询本来就该命中），不动它。
 * 单词查询不受影响：need = min(2, 1) = 1，与"score>0 即命中"等价。
 */
function matchedFloor(scored, queries, hasVector) {
  if (hasVector) return scored // 有语义分 → 不用词法的"命中词数"判质量
  const qTokens = new Set()
  for (const q of queries) for (const t of tokenizeRaw(String(q ?? ''))) qTokens.add(t)
  const need = Math.min(2, qTokens.size)
  if (need <= 1) return scored
  return scored.filter((r) => (r.matched ?? 0) >= need)
}

/** 各层先验：insight 是"踩过的坑"，略高于普通文档；经验笔记（同库、kind 区分）留痕价值略低。 */
```

</details>

#### 缺口

- 门控在用户真实语料的漏注/误注、预算与实际token偏差未独立测量。
  **影响：**不能把配置400写成硬token预算，也不能承诺关键约束总会到达模型。
  **进一步探讨：**固定中文/代码/长提示问题集，保留所有候选与遗漏真值，比较实际token和后续任务遵循。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 根目录、数据来源和跨层记忆边界在哪里？

**研究主题：**缺陷与关键质疑

#### 完整回答

根优先显式root，再注册根/项目标记和安全会话cwd；家目录/系统路径精确排除是防误扫护栏，非访问授权或数据沙箱。工具显式root可指定任意可读安全目录；底层Node fs直接读写，walkDir把非目录项列入文件，包括符号链接文件，没有在该链逐文件realpath再核root。嵌套store跳过避免重复索引，也使父根问子项目可能不命中，工具会提示改root。

本地持久化不代表只在本项目使用。global知识对其它项目可见，自动去重/跨任务提升把任务数与confidence作为范围变化依据，并不检查知识有效地域。saveInsight有密钥形态拒绝，但这是格式启发，不能覆盖所有秘密；文档、经验和工具动作还可进入模型/审计文件。引用files做相对路径规范化，不冻结Git版本或验证每个文件真实支撑断言。

reflection的“draft-only at task level”也不是封闭写域。它确实传draft:true与scope:task，但saveTaskInsight先查既有project/global近邻并mergeInto；merge覆盖fix/choice等正文而保持原条目draft，已确认知识可被模型草稿更新。跨任务提升还显式draft=false。该路径默认reflection关闭，需近邻命中或后续提升才成立；本轮只指出静态条件，没有声称已发生污染。

#### 证据与依据

**依据 1 · 源码核查**：[src/util/fs.js:656-700](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/util/fs.js#L656-L700)

根解析和显式root护栏，不作会话访问授权。

<details>
<summary>查看原文（45行）</summary>

```text
export function findProjectRoot(filePath, opts = {}) {
  if (typeof filePath !== 'string' || !filePath) return null
  const isUnsafe = typeof opts.isUnsafe === 'function' ? opts.isUnsafe : isUnsafeRoot
  let abs
  try {
    abs = path.resolve(filePath)
  } catch {
    return null
  }
  const explicit = longestRootContaining(opts.extraRoots || [], abs)
  if (explicit) return isUnsafe(explicit) ? null : explicit

  const byMarker = nearestMarker(abs, VCS_MARKERS, isUnsafe) || nearestMarker(abs, PROJECT_MARKERS, isUnsafe)
  if (byMarker) return byMarker

  const session = resolveDir(opts.sessionRoot)
  if (session && !isUnsafe(session) && isInside(session, abs)) return session
  return null
}

/**
 * **会话记忆根**：本插件所有"这个会话的记忆放哪"的唯一答案。
 * 声明优先（标记）→ 会话工作目录（安全时）→ null（家目录/系统目录，且没有标记）。
 */
export function resolveProjectMemoryRoot(cwd) {
  const base = resolveDir(cwd) || resolveDir(process.cwd())
  if (!base) return null
  return findProjectRoot(path.join(base, PROJECT_PROBE), { sessionRoot: base })
}

/**
 * 工具侧的根解析：显式 root 优先（并校验安全），否则取会话记忆根。
 * 会话 cwd 是家目录且没有标记时抛 `UnsafeRootError`——旧代码会在那里建
 * `.dsh-project-memory` 并把它当成项目标记，进而把整个家目录锁成"项目"（issue #5）。
 */
export function resolveSafeIndexRoot(exec, explicitRoot, config) {
  const allowUnsafe = config?.allowUnsafeRoots === true
  const explicit = explicitRoot && String(explicitRoot).trim() ? String(explicitRoot) : null
  if (explicit) {
    return assertSafeRoot(path.resolve(explicit), { requested: explicit, allowUnsafe })
  }
  const cwd = resolveIndexRoot(exec)
  const root = resolveProjectMemoryRoot(cwd)
  if (root) return root
  if (allowUnsafe) return cwd
```

</details>

**依据 2 · 源码核查**：[src/util/fs.js:243-266](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/util/fs.js#L243-L266)

非目录项加入列表，无逐文件realpath围栏。

<details>
<summary>查看原文（24行）</summary>

```text
      continue
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (ignoreNames.has(entry.name)) continue
        if (nestedStoreName && hasOwnStore(full, nestedStoreName)) {
          skipped.push(full)
          continue
        }
        if (depth + 1 > maxDepth) {
          truncated = true
          capped = true
          continue
        }
        stack.push([full, depth + 1])
      } else {
        if (out.length >= maxFiles) {
          truncated = true
          capped = true
          hitFileCap = true
          break
        }
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:730-742](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L730-L742)

密钥形态检查和统一写入口。

<details>
<summary>查看原文（13行）</summary>

```text
export function saveInsight({ store, globalStore, raw, scope, taskId, cfg, source = 'agent', nowIso, cosine = null }) {
  const cfg2 = cfg || cfgInsight({})
  const now = nowIso || new Date().toISOString()
  const secretField = containsSecretFields(raw)
  if (secretField) {
    return { ok: false, error: `内容疑似包含密钥/token/私钥形态数据（字段: ${secretField}），已拒绝写入` }
  }
  if (raw && raw.id) {
    const found = findInsightAnywhere({ store, globalStore }, raw.id)
    if (!found) return { ok: false, error: `找不到要更新的条目: ${raw.id}（可能已被删除/提升；用 query_memory 重新确认 id）` }
    const replaced = applyUpdate(found.item, raw, now)
    if (found.scope === 'global') globalStore.markDirty()
    else if (found.scope === 'task') store.markTasksDirty()
```

</details>

**依据 4 · 源码核查**：[src/reflection-pipeline.js:91-116](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/reflection-pipeline.js#L91-L116)

草稿任务scope调用。

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

**依据 5 · 源码核查**：[src/insight-store.js:830-866](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L830-L866)

task写先匹配project/global并改内容。

<details>
<summary>查看原文（37行）</summary>

```text
function saveTaskInsight(store, globalStore, task, raw, cfg, now, source, cosine) {
  // 1) 已有 project 级知识 → 挂成员/命中，不再在 task 层重复存
  const pjItems = store.insightItems()
  const base = { ...raw, source, sourceTaskIds: [task.id] }
  const text = insightMatchText(base)
  const pjNear = vectorNear(vectorText(base), pjItems, cosine)
  const pjTarget = autoMergeTarget(pjNear, cfg)
  if (pjTarget) {
    const { replaced } = mergeInto(pjTarget.item, base, cfg, now)
    store.replaceInsightItems(pjItems)
    applyDecay(pjItems, cfg, now)
    pruneItems(pjItems, cfg.maxProject, now)
    const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
    return { ok: true, action: 'auto-merged', id: pjTarget.item.id, scope: 'project', replaced, cos: Number(pjTarget.top1.toFixed(3)), hint: `相似度 ${pjTarget.top1.toFixed(3)}，已自动覆盖 project 级既有条目${replaced.length ? `（覆盖字段 ${replaced.join('/')}）` : ''}${promoted ? '；已自动提升 global' : ''}` }
  }
  const pjHit = findBestOverlapMatch(text, pjItems)
  if (pjHit && pjHit.score >= cfg.dedupOverlap) {
    const { replaced } = mergeInto(pjHit.item, base, cfg, now)
    store.replaceInsightItems(pjItems)
    applyDecay(pjItems, cfg, now)
    pruneItems(pjItems, cfg.maxProject, now)
    const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
    return { ok: true, action: 'linked-project', id: pjHit.item.id, scope: 'project', replaced, hint: `该知识已在 project 级，累计第 ${(pjHit.item.sourceTaskIds || []).length} 个任务命中${promoted ? '；已自动提升 global' : ''}` }
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
```

</details>

**依据 6 · 源码核查**：[src/insight-store.js:207-226](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L207-L226)

merge正文并不传播draft隔离。

<details>
<summary>查看原文（20行）</summary>

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
  return { item: existing, replaced }
```

</details>

**依据 7 · 源码核查**：[src/insight-store.js:960-982](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L960-L982)

global提升条件与draft=false。

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
      glItems.push(movedIns)
```

</details>

#### 缺口

- 符号链接读取、跨scope反思更新与自动提升的真实影响未执行核查。
  **影响：**不能宣称数据绝不离开项目或所有反思只停草稿，更不推断现有知识已受污染。
  **进一步探讨：**可用非敏感独立根、已有确认知识与同标题反思草稿，追踪scope/draft/prev和实际注入内容。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启动与操作依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

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

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-60](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/package.json#L47-L60)

Node与pdfjs声明。

<details>
<summary>查看原文（14行）</summary>

```text
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
    "@deepseek-ai/dsh-tools": "0.2.1-rc.2",
```

</details>

**依据 2 · 源码核查**：[package.json:70-91](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/package.json#L70-L91)

宿主与TS peer及optional条件。

<details>
<summary>查看原文（22行）</summary>

```text
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
    }
```

</details>

**依据 3 · 源码核查**：[package.json:112-114](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/package.json#L112-L114)

leanvec optional。

```text
  "optionalDependencies": {
    "leanvec": "^0.1.0"
  }
```

**依据 4 · 源码核查**：[src/index.js:21-45](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index.js#L21-L45)

硬依赖与默认关闭扩展/默认lazy。

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

**依据 5 · 源码核查**：[src/parsers/pdfjs-parser.js:60-80](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/parsers/pdfjs-parser.js#L60-L80)

读取文本层条件。

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

**研究主题：**工程质量与复用

#### 完整回答

分片按源文件保存，派生doc→symbol关系不持久化，脏分片写入减少整库重写；加载复用跨实例快照与版本，单文件更新用expectedHash避免同进程编排互相覆盖。writeJsonAtomic用带pid临时文件rename，失败清tmp并抛出；多文件save顺序写格式、shards、insights/tasks/binding，仍不是整库崩溃原子事务，也未构成跨进程锁。

watch递归setTimeout避免常态重叠，活动/空闲与变化调节轮询，stop后不再排下一轮；lazy按fs/observed去抖，卸载清timer。已经在跑的异步抽取/反思不因清timer自然取消，autoIndexOnFirstUse的cancelled仅控制日志，不能据此承诺卸载后绝无写入。

注入审计记真正注入，shadow记每步候选和拒绝原因，均有大小轮转与异常旁路。它们利于离线解释阈值，但16候选默认截断、日志会轮转，不是永久完整训练集；内容含query、工具动作/路径，需和源材料同等管理。vector指纹只哈希词表加向量文件字节数，相同词表/大小但向量内容改变会漏失效，这是作者明确近似取舍。

#### 证据与依据

**依据 1 · 源码核查**：[src/store.js:690-746](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/store.js#L690-L746)

脏分片顺序保存与单文件写粒度。

<details>
<summary>查看原文（57行）</summary>

```text
  save() {
    // 没有脏数据就不落盘。watch 每轮对每个根都无条件 commit → save；照旧执行的话，
    // 末尾的 ID 缓存失效会打在跨实例共享的 store 上，等于每轮清空一次 IDF 复用（v0.3.4 的 20x）。
    // 待压实队列不算"脏数据"，但它需要有界推进，所以也走这条落盘路径。
    const compacting = this._compactQueue.size > 0
    const dirty =
      compacting ||
      this._dirtyShards.size > 0 ||
      this._removedShards.size > 0 ||
      this._dirtyInsights ||
      this._dirtyTasks ||
      this._dirtyBinding ||
      this._dirtyWatch ||
      !this._formatWritten
    if (dirty) mkdirSync(this.dir, { recursive: true })
    // 崩溃遗留的 *.tmp 无论有没有脏数据都顺手清掉（两次 readdir，自带 try/catch）
    this.cleanStaleTmp()
    // 自我忽略也在无脏数据时执行：老版本建出来的 store 会在下一次 save 时补上。
    this.ensureSelfIgnore()
    if (!dirty) return
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
        // 父目录由 writeJsonAtomic 保证
        writeJsonAtomic(shardRelPath(this.dir, rel), { relPath: rel, record: this.files[rel], entries: (this.entries[rel] || []).map(withoutPersistedDerived) })
      } else {
        this._removedShards.add(rel)
      }
    }
    this._dirtyShards.clear()
    for (const rel of this._removedShards) {
      try {
        unlinkSync(shardRelPath(this.dir, rel))
      } catch {
        // shard file already gone; nothing to do
      }
    }
    this._removedShards.clear()
    if (this._dirtyInsights) {
      // v2 → v3 是纯语义升级（`kind:'experience'` 从"影子副本"变成一等实体），形状不变；
      // 落盘即把版本推上去，老版本读到 v3 也照样按 v2 的字段解析（它只是排除 experience 影子）。
      if (this.insights && this.insights.version !== 3) this.insights.version = 3
      writeJsonAtomic(path.join(this.dir, INSIGHTS_FILE), this.insights)
      this._dirtyInsights = false
```

</details>

**依据 2 · 源码核查**：[src/util/fs.js:24-39](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/util/fs.js#L24-L39)

pid tmp/rename失败抛出。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 3 · 源码核查**：[src/watch.js:154-180](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/watch.js#L154-L180)

递归调度和stop检查。

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

**依据 4 · 源码核查**：[src/lazy.js:58-95](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/lazy.js#L58-L95)

lazy队列和timer清理。

<details>
<summary>查看原文（38行）</summary>

```text
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
    if (timer) clearTimeout(timer)
  })
```

</details>

**依据 5 · 源码核查**：[src/index.js:220-250](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index.js#L220-L250)

auto-index cancelled只限制日志。

<details>
<summary>查看原文（31行）</summary>

```text
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
        try {
          watchManager.addRoot(root)
          const report = await indexRepository(ctx, config, root, { allowUnsafe: config.allowUnsafeRoots === true })
          if (!cancelled) console.log(`[dsh-project-memory] ${report}`)
        } catch (err) {
          if (!cancelled) console.error(`[dsh-project-memory] auto-index failed for ${root}: ${err.message}`)
        }
      }
      run()
      return () => {
        cancelled = true
      }
```

</details>

**依据 6 · 源码核查**：[src/audit.js:18-56](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/audit.js#L18-L56)

候选裁剪和日志配置。

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

/** 审计配置：默认开（观测是这个插件唯一的仪表盘），显式 `auditLog: false` 才关。 */
export function cfgAudit(config) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c.auditLog !== false,
    maxBytes: typeof c.auditMaxBytes === 'number' && c.auditMaxBytes > 0 ? c.auditMaxBytes : DEFAULT_MAX_BYTES,
  }
}

export function auditFileFor(memoryDir) {
  return path.join(memoryDir, AUDIT_FILE)
}

/** 影子记录配置：默认开（它只写盘、不进 prompt、不花 token），显式 `shadowLog: false` 才关。 */
export function cfgShadow(config) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c.shadowLog !== false,
    maxBytes: typeof c.shadowMaxBytes === 'number' && c.shadowMaxBytes > 0 ? c.shadowMaxBytes : DEFAULT_SHADOW_MAX_BYTES,
```

</details>

**依据 7 · 源码核查**：[src/vector-index.js:34-50](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/vector-index.js#L34-L50)

向量指纹近似。

<details>
<summary>查看原文（17行）</summary>

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
}
```

</details>

#### 缺口

- 跨进程同store、掉电中断、卸载时在途写入与完整迁移恢复未验证。
  **影响：**单文件原子不等于整库事务或取消保证。
  **进一步探讨：**从两个进程、分片/辅助文件写入故障和在途抽取卸载检查版本/日志及可恢复原件。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 首次、持续与恢复成本，效果证据到哪层？

**研究主题：**效果与总成本

#### 完整回答

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

#### 证据与依据

**依据 1 · 源码核查**：[src/index-pipeline.js:25-67](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index-pipeline.js#L25-L67)

大小/哈希和无模型索引链。

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

**依据 2 · 源码核查**：[src/auto-inject.js:493-504](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L493-L504)

字符近似预算。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/audit.js:18-56](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/audit.js#L18-L56)

持续日志负载。

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

/** 审计配置：默认开（观测是这个插件唯一的仪表盘），显式 `auditLog: false` 才关。 */
export function cfgAudit(config) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c.auditLog !== false,
    maxBytes: typeof c.auditMaxBytes === 'number' && c.auditMaxBytes > 0 ? c.auditMaxBytes : DEFAULT_MAX_BYTES,
  }
}

export function auditFileFor(memoryDir) {
  return path.join(memoryDir, AUDIT_FILE)
}

/** 影子记录配置：默认开（它只写盘、不进 prompt、不花 token），显式 `shadowLog: false` 才关。 */
export function cfgShadow(config) {
  const c = (config && config.autoContext) || {}
  return {
    enabled: c.shadowLog !== false,
    maxBytes: typeof c.shadowMaxBytes === 'number' && c.shadowMaxBytes > 0 ? c.shadowMaxBytes : DEFAULT_SHADOW_MAX_BYTES,
```

</details>

**依据 4 · 作者声明**：[src/vector-index.js:1-10](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/vector-index.js#L1-L10)

作者特定规模/延迟报告。

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

**依据 5 · 源码核查**：[src/index.js:30-49](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/index.js#L30-L49)

扩展关闭、lazy与scan默认。

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
  **影响：**不能把作者小样本hit率转为实际效率/成本承诺。
  **进一步探讨：**固定语料/任务/模型和压缩点，测召回、错误建议、真实token/RSS、人工返工和恢复。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用建议与未来假设怎样证伪？

**研究主题：**采用判断、新假设与验证

#### 完整回答

可有条件试用，适合愿意审核项目知识和引用的维护者，先用非敏感单项目、少量人工记忆与默认关闭的反思/扩展。分层召回、根护栏和可解释注入比无条件全文回放更成熟，但需要明确global会跨项目、反思草稿可命中更广scope既有项、日志与内容会进入模型通道。长期重要规范不应仅存于自动去重/衰减记忆里。

继续探讨可先用现成项目问题验证引用，查看注入/影子记录的漏注误注，再用同标题反思草稿检验是否更新确认知识；启用向量/反思前后分别保留基线与原件。遇无法解释scope变化、关键约束遗漏或同store并发不一致时，应暂停依赖自动注入，回到人工来源核查。

未验证假设是建立带来源版本、适用域和审批状态的知识修订链，把“相似”“被曝光”“任务采用”“结果验证”分字段，草稿只能提出改动而不能覆盖确认项目/global项；注入附适用/过期收据。相较当前文本近邻和任务数提升，可能降低错知识扩大，但会增加人工审核/元数据成本。最小对照固定两项目、反向结论近邻、过期引用和反思草稿，比较错scope更新、任务违约、漏注、审核时间和token；若审核负担超过收益或漏掉有效经验，需收窄方案。未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/insight-store.js:207-226](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L207-L226)

近邻覆盖正文和confidence强化。

<details>
<summary>查看原文（20行）</summary>

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
  return { item: existing, replaced }
```

</details>

**依据 2 · 源码核查**：[src/insight-store.js:830-866](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L830-L866)

任务scope写可合并更广知识。

<details>
<summary>查看原文（37行）</summary>

```text
function saveTaskInsight(store, globalStore, task, raw, cfg, now, source, cosine) {
  // 1) 已有 project 级知识 → 挂成员/命中，不再在 task 层重复存
  const pjItems = store.insightItems()
  const base = { ...raw, source, sourceTaskIds: [task.id] }
  const text = insightMatchText(base)
  const pjNear = vectorNear(vectorText(base), pjItems, cosine)
  const pjTarget = autoMergeTarget(pjNear, cfg)
  if (pjTarget) {
    const { replaced } = mergeInto(pjTarget.item, base, cfg, now)
    store.replaceInsightItems(pjItems)
    applyDecay(pjItems, cfg, now)
    pruneItems(pjItems, cfg.maxProject, now)
    const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
    return { ok: true, action: 'auto-merged', id: pjTarget.item.id, scope: 'project', replaced, cos: Number(pjTarget.top1.toFixed(3)), hint: `相似度 ${pjTarget.top1.toFixed(3)}，已自动覆盖 project 级既有条目${replaced.length ? `（覆盖字段 ${replaced.join('/')}）` : ''}${promoted ? '；已自动提升 global' : ''}` }
  }
  const pjHit = findBestOverlapMatch(text, pjItems)
  if (pjHit && pjHit.score >= cfg.dedupOverlap) {
    const { replaced } = mergeInto(pjHit.item, base, cfg, now)
    store.replaceInsightItems(pjItems)
    applyDecay(pjItems, cfg, now)
    pruneItems(pjItems, cfg.maxProject, now)
    const promoted = promoteProjectToGlobal(store, globalStore, cfg, now)
    return { ok: true, action: 'linked-project', id: pjHit.item.id, scope: 'project', replaced, hint: `该知识已在 project 级，累计第 ${(pjHit.item.sourceTaskIds || []).length} 个任务命中${promoted ? '；已自动提升 global' : ''}` }
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
```

</details>

**依据 3 · 源码核查**：[src/insight-store.js:960-982](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/insight-store.js#L960-L982)

按任务数扩大global。

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
      glItems.push(movedIns)
```

</details>

**依据 4 · 源码核查**：[src/auto-inject.js:810-829](https://github.com/00080000/dsh-project-memory/blob/21fc69e3e98f3864677e091477b7d543a0e54939/src/auto-inject.js#L810-L829)

曝光记账与注入分离，是证据状态分层起点。

<details>
<summary>查看原文（20行）</summary>

```text
    quota.items += built.reasons.length
    quota.chars += typeof built.itemChars === 'number' ? built.itemChars : 0
    quota.lastStep = stepNo
  }

  // 使用记账：注入进上下文 = 这条记忆被用到了。必须在这里显式落盘——注入路径不会走到
  // 任何其它 save()，只标脏等于进程退出就丢。记账失败绝不影响注入（与审计同约定）。
  if (built.reasons.length) {
    try {
      if (recordHit({ store, globalStore, ids: built.reasons.map((r) => r.id) })) {
        // 只有这个根里真有东西才落盘。否则一次**全局** insight 的命中就会为一个从没被
        // 索引过的容器目录建出整个 store（`save()` 会 mkdir）。审计侧同样不建，见 audit.js。
        if (store.hasContent) store.save()
        globalStore.commit()
      }
    } catch {
      /* ignore：记账是旁路，不能拖累注入 */
    }
  }

```

</details>

#### 缺口

- 审批修订链/来源版本方案未实现或对照。
  **影响：**不提升当前知识可靠性和安全边界。
  **进一步探讨：**用两项目、冲突近邻、过期来源和草稿序列比较污染/漏注/任务质量及人工成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
