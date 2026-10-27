# Awesome DeepSeek Harness Plugins

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[6b31166](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/tree/6b31166a8fb7648ed882cbd91ff2875080e0b39b)

<!-- BEGIN META -->
[![GitHub ★ 560](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=560&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins)
<!-- END META -->

> **功能**：按能力分类整理 DSH 公开插件与扩展，并提供仓库、Star 与引用网页链接

> **亮点**：[Q01](#research-q01) 将分散仓库按统一分类和列组织，并补充引用线索；贡献是发现资源整理，非模型工具或安装验证。

> **主要限制**：[Q02](#research-q02) 动态Star与引用网页数无法证明任务效果或独立性，固定README也没有保存排名输入。不能把893条文档行误写为893个可用插件。

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
  - [Q01 · 分类目录如何帮助寻找候选，相比GitHub搜索多什么？](#detail-section-11)
  - [Q02 · 独立引用和Star排序能支持什么，不能证明什么？](#detail-section-12)
  - [Q03 · 维护和使用有什么成本，适合哪种采用？](#detail-section-13)
  - [Q04 · 能否把发现目录扩展为任务失败证据索引？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：不知道具体仓库名称的DSH用户，可按能力分类建立待核查候选清单。

GitHub关键词/主题搜索和官方文档；目录减少候选组织步骤，不能替代目标版本审查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分类目录 | 发现公开候选仓库 | 非去重可用性清单 |
| 引用列 | 提供进一步核查线索 | 链接存在不等于独立验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Markdown阅读器 | 必需 | 浏览分类和描述 | 可直接读取固定README |
| GitHub及引用网页访问 | 复核必需 | 找目标原件 | 访问失败保留未知不安装 |
| DSH宿主或模型 | 浏览无需 | 仅候选实际使用才需要 | 目录自身不是运行插件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 定题 | 用户明确任务和简单替代 | 不是按Star直接安装 |
| 找候选 | 用户按分类选少量仓库 | 描述与任务相符 |
| 核实 | 用户查固定源码、入口和权限 | 引用仅线索，失效回官方 |
| 验证 | 用户在授权范围试任务 | 目录收录不代替任务验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- |--- |
| 首次使用 | 阅读与网络资源，金额未知 | 选分类和任务候选 | 无需宿主安装 |
| 持续使用 | 获取链接页面 | 逐仓库复核版本与权限 | 没有找全率和节时数据 |
| 失败恢复 | 再搜索和页面访问 | 查旧名、归档和断链 | 暂无自动验证脚本可审 |
| 退出 | 保留链接清单 | 回官方和目标仓库 | 不改变DSH环境 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 候选组织 | 统一分类和链接列 | 真实搜索任务找全率 |
| 引用线索 | 部分项目有文档/报道链接 | 独立性和目标效果 |
| 维护 | 作者称每日公开来源审查 | 调度实现、覆盖与时效 |

> **思考**：[Q02](#research-q02) 动态Star与引用网页数无法证明任务效果或独立性，固定README也没有保存排名输入。不能把893条文档行误写为893个可用插件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将分散仓库按统一分类和列组织，并补充引用线索；贡献是发现资源整理，非模型工具或安装验证。

[Q01](#research-q01)树仅两README与LICENSE，文档资源不适用工具注册、取消或卸载代码评价。[Q02](#research-q02)动态徽章与无采集元数据限制可复现排名，维护脚本不在本树，不能声称自动校验通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 动态Star与引用网页数无法证明任务效果或独立性，固定README也没有保存排名输入。不能把893条文档行误写为893个可用插件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只读试用候选发现；目录条目必须回目标固定源码核实，无法核实时停止将该项当推荐。

最小验证选五个用户实际遇到的任务，将当前目录搜索与带失败证据的候选卡盲比，记录找到能解决问题的候选数、复核错误和耗时。如果详细证据过期快、维护成本高但用户仍须完全重查，或简单README链接已足够，就停止扩展。缺少真实任务和采用意愿时不能把这一方向称为已确认插件市场。 见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

目录内容、列结构与固定树可直接检查；逐目标运行和独立引用未验证。任务失败证据索引为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、LICENSE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定6b31166a8fb7648ed882cbd91ff2875080e0b39b，检查完整文件树、README结构、表格计数和部分实际引用；不是逐项研究其中所有目标。
- 下一步：实际固定文档核查与确定性行结构统计，未安装目标条目，未逐项访问引用网页或执行外部项目。

**分析版本**

- **仓库**：[Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins)
- **版本号**：未声明（[固定提交 6b31166](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/tree/6b31166a8fb7648ed882cbd91ff2875080e0b39b)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以推导未验证的任务索引，在候选旁保存其解决的具体失败、固定版本证据、简单替代和一项最小验证结果，并把“链接存在”与“作者声明/源码/真实运行”分开。相对Star和网页数，增量是帮助读者决定哪一项值得进入复核，而不是暗示高热度就可靠。

最小验证选五个用户实际遇到的任务，将当前目录搜索与带失败证据的候选卡盲比，记录找到能解决问题的候选数、复核错误和耗时。如果详细证据过期快、维护成本高但用户仍须完全重查，或简单README链接已足够，就停止扩展。缺少真实任务和采用意愿时不能把这一方向称为已确认插件市场。 见 [Q04](#research-q04)。

实际固定文档核查与确定性行结构统计，未安装目标条目，未逐项访问引用网页或执行外部项目。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1934 | — | — | 120694 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：静态分类目录能否支持候选发现，而不把Star和引用当安装或效果验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分类目录如何帮助寻找候选，相比GitHub搜索多什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是公开插件与扩展的静态文档目录，面向知道任务大类但不知道仓库名称的DSH用户。与手工GitHub关键词搜索相比，目录把描述、规范仓库链接、Star徽章及外部引用放到统一分类表中，适合建立候选清单。固定Git树只有两种语言README与许可证，没有package、运行入口或MCP服务，不能安装成提供模型工具的插件。

对这类资源的“机制”就是人工/自动维护的Markdown链接组织，不应伪造源码调用链。已检查文档声明八个能力分类并按Star和引用页数排序；本轮程序按固定README的表格语法数得893条项目行、861行标明暂无引用，其余32行有引用展示。这是文档行数，不是去重仓库数、可安装插件数或独立验收数。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-24](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L5-L24)

描述、收录标准、分类及排序在文档中明确。

<details>
<summary>查看原文（20行）</summary>

```text
A concise, daily-curated directory of public plugins and extensions for [DeepSeek Harness](https://www.deepseek.com/en/harness/) (DSH), the open-source DeepSeek agent harness. Explore tools, skills, model providers, memory, automation, runtimes, desktop clients, browser integrations, and developer utilities.

Every entry links to its canonical GitHub repository, current star count, and independently verified references.

> Inclusion: public, useful, inspectable, and clearly built for DSH. Archived entries are retained and labeled. Review a plugin's code and permissions before installing it.

## Core

| Project | Description | Stars | Referenced by |
| --- | --- | --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | A preview agent harness with desktop and Web interfaces built from swappable, composable Cordis plugins. | [![GitHub stars](https://img.shields.io/github/stars/deepseek-ai/deepseek-harness?style=flat&label=stars)](https://github.com/deepseek-ai/deepseek-harness/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://www.deepseek.com/en/harness/">DeepSeek Harness official overview</a> · <sub>Docs</sub></li></ul></details> |
| [DeepSeek Harness Handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Provides source-backed operator guides for DeepSeek Harness architecture, plugins, MCP, sessions, sandboxing, evaluation, and troubleshooting. | [![GitHub stars](https://img.shields.io/github/stars/sandbaseai/deepseek-harness-handbook?style=flat&label=stars)](https://github.com/sandbaseai/deepseek-harness-handbook/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://sandbaseai.github.io/deepseek-harness-handbook/">DeepSeek Harness Handbook</a> · <sub>Docs</sub></li></ul></details> |

**Taxonomy:** Models & Providers · Tools & Skills · Sessions & Storage · Loops & Scheduling · Runtime & Sandboxes · UI & Clients · Integrations · Developer & Operations

**Browse:** [Models & Providers](#models--providers) · [Tools & Skills](#tools--skills) · [Sessions & Storage](#sessions--storage) · [Loops & Scheduling](#loops--scheduling) · [Runtime & Sandboxes](#runtime--sandboxes) · [UI & Clients](#ui--clients) · [Integrations](#integrations) · [Developer & Operations](#developer--operations)

The taxonomy follows the capability seams defined by the [official Harness overview](https://www.deepseek.com/en/harness/).

Projects in each section are ranked by GitHub stars, then by verified reference count.
```

</details>

**依据 2 · 源码核查**：[README.md:13-16](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L13-L16)

核心条目实际包含仓库、描述、Star和引用列。

```text
| Project | Description | Stars | Referenced by |
| --- | --- | --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | A preview agent harness with desktop and Web interfaces built from swappable, composable Cordis plugins. | [![GitHub stars](https://img.shields.io/github/stars/deepseek-ai/deepseek-harness?style=flat&label=stars)](https://github.com/deepseek-ai/deepseek-harness/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://www.deepseek.com/en/harness/">DeepSeek Harness official overview</a> · <sub>Docs</sub></li></ul></details> |
| [DeepSeek Harness Handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Provides source-backed operator guides for DeepSeek Harness architecture, plugins, MCP, sessions, sandboxing, evaluation, and troubleshooting. | [![GitHub stars](https://img.shields.io/github/stars/sandbaseai/deepseek-harness-handbook?style=flat&label=stars)](https://github.com/sandbaseai/deepseek-harness-handbook/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://sandbaseai.github.io/deepseek-harness-handbook/">DeepSeek Harness Handbook</a> · <sub>Docs</sub></li></ul></details> |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立引用和Star排序能支持什么，不能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

引用列证明目录给出了可点击网页，不自动证明网页作者独立、内容正确、当前版本可用或完成同任务比较。核心两项引用是官方说明或项目手册，部分项目引用也是自身文档；所以“independently verified references”应理解为维护者核查链接的主张，不能等同第三方验收。861个暂无引用的项目行也不能据此判为无价值或无人使用。

Star徽章随远端动态返回，固定README提交没有保存当时Star数值、采集时刻或完整排序输入，因此固定文档可追溯链接，却不能独立重放历史排名。仓库代码、权限和版本需到目标原件核查，目录已经明确提醒。分类和大量条目可降低发现成本，但不能据列表多寡推导市场空白、热度或生产可靠性。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:7-9](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L7-L9)

独立引用主张与安装前核代码提醒。

```text
Every entry links to its canonical GitHub repository, current star count, and independently verified references.

> Inclusion: public, useful, inspectable, and clearly built for DSH. Archived entries are retained and labeled. Review a plugin's code and permissions before installing it.
```

**依据 2 · 源码核查**：[README.md:15-16](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L15-L16)

引用实例包含官方页和项目手册。

```text
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | A preview agent harness with desktop and Web interfaces built from swappable, composable Cordis plugins. | [![GitHub stars](https://img.shields.io/github/stars/deepseek-ai/deepseek-harness?style=flat&label=stars)](https://github.com/deepseek-ai/deepseek-harness/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://www.deepseek.com/en/harness/">DeepSeek Harness official overview</a> · <sub>Docs</sub></li></ul></details> |
| [DeepSeek Harness Handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Provides source-backed operator guides for DeepSeek Harness architecture, plugins, MCP, sessions, sandboxing, evaluation, and troubleshooting. | [![GitHub stars](https://img.shields.io/github/stars/sandbaseai/deepseek-harness-handbook?style=flat&label=stars)](https://github.com/sandbaseai/deepseek-harness-handbook/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://sandbaseai.github.io/deepseek-harness-handbook/">DeepSeek Harness Handbook</a> · <sub>Docs</sub></li></ul></details> |
```

**依据 3 · 源码核查**：[README.md:24-30](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L24-L30)

排序声明与动态Star徽章、暂无引用实例。

```text
Projects in each section are ranked by GitHub stars, then by verified reference count.

## Models & Providers

| Project | Description | Stars | Referenced by |
| --- | --- | --- | --- |
| [dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model) | Adds model-provider routing to DSH with catalog discovery, availability probes, usage views, and a local OpenAI-compatible gateway. | [![GitHub stars](https://img.shields.io/github/stars/Ebony-Vinyl/dsh-our-free-model?style=flat&label=stars)](https://github.com/Ebony-Vinyl/dsh-our-free-model/stargazers) | <details><summary>0 pages</summary><sub>No verified references yet.</sub></details> |
```

#### 缺口

- 引用网页是否逐条可访问、独立及对应当前目标版本未全面核查。
  **影响**：不能据引用页数排序得出质量或采用结论。
  **进一步探讨**：选实际候选逐页保存访问时间、发布者关系和所支持主张，再回固定目标源码核对。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 维护和使用有什么成本，适合哪种采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用只需要能读取Markdown与到达目标GitHub，浏览资源不需要模型密钥或宿主安装。维护者声称由本地Codex定时任务每日审查公开来源，但固定树未提供调度、抓取、去重和验证脚本；因此更新频率是作者报告，不能核实全自动覆盖或维护成本。双语文档和链接需要持续修正，旧名称、归档与权限变化也会把检查负担交给使用者。

建议把它作为只读候选发现资源试用，选一个真实需求、记录三到五个候选，再核查目标仓库的固定版本、入口、权限和失败边界。相对自行搜名称可减少组织步骤，但没有找全率、误荐率或耗时对照，不量化节省。若条目过时、引用只重复宣传或找不到安装入口，停止将该项当推荐，回官方文档和目标源码；这不需要删除原有DSH环境。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:957-967](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L957-L967)

贡献方式、每日定时维护主张和MIT链接。

<details>
<summary>查看原文（11行）</summary>

```text
## Contributing

Open a pull request, or add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your repository so the curator can find it.

## Maintenance

This list is reviewed daily by a local Codex scheduled task using public sources only.

## License

[MIT](LICENSE)
```

</details>

**依据 2 · 源码核查**：[README.md:9-9](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L9-L9)

目录明确要求安装前检查代码与权限。

```text
> Inclusion: public, useful, inspectable, and clearly built for DSH. Archived entries are retained and labeled. Review a plugin's code and permissions before installing it.
```

#### 缺口

- 维护任务实现和真实发现耗时、误荐率没有材料。
  **影响**：不能以每日维护主张保证最新或零成本。
  **进一步探讨**：固定一批用户任务比较目录与直接GitHub搜索，记录有效候选率、失效链接和复核时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否把发现目录扩展为任务失败证据索引？

**研究主题**：新假设与验证

#### 完整回答

可以推导未验证的任务索引，在候选旁保存其解决的具体失败、固定版本证据、简单替代和一项最小验证结果，并把“链接存在”与“作者声明/源码/真实运行”分开。相对Star和网页数，增量是帮助读者决定哪一项值得进入复核，而不是暗示高热度就可靠。

最小验证选五个用户实际遇到的任务，将当前目录搜索与带失败证据的候选卡盲比，记录找到能解决问题的候选数、复核错误和耗时。如果详细证据过期快、维护成本高但用户仍须完全重查，或简单README链接已足够，就停止扩展。缺少真实任务和采用意愿时不能把这一方向称为已确认插件市场。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:7-24](https://github.com/Zhiyuan-Fan/Awesome-DeepSeek-Harness-Plugins/blob/6b31166a8fb7648ed882cbd91ff2875080e0b39b/README.md#L7-L24)

当前引用/Star排序及源码复核提示，是任务证据索引的比较基线。

<details>
<summary>查看原文（18行）</summary>

```text
Every entry links to its canonical GitHub repository, current star count, and independently verified references.

> Inclusion: public, useful, inspectable, and clearly built for DSH. Archived entries are retained and labeled. Review a plugin's code and permissions before installing it.

## Core

| Project | Description | Stars | Referenced by |
| --- | --- | --- | --- |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | A preview agent harness with desktop and Web interfaces built from swappable, composable Cordis plugins. | [![GitHub stars](https://img.shields.io/github/stars/deepseek-ai/deepseek-harness?style=flat&label=stars)](https://github.com/deepseek-ai/deepseek-harness/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://www.deepseek.com/en/harness/">DeepSeek Harness official overview</a> · <sub>Docs</sub></li></ul></details> |
| [DeepSeek Harness Handbook](https://github.com/sandbaseai/deepseek-harness-handbook) | Provides source-backed operator guides for DeepSeek Harness architecture, plugins, MCP, sessions, sandboxing, evaluation, and troubleshooting. | [![GitHub stars](https://img.shields.io/github/stars/sandbaseai/deepseek-harness-handbook?style=flat&label=stars)](https://github.com/sandbaseai/deepseek-harness-handbook/stargazers) | <details><summary>1 page</summary><ul><li><a href="https://sandbaseai.github.io/deepseek-harness-handbook/">DeepSeek Harness Handbook</a> · <sub>Docs</sub></li></ul></details> |

**Taxonomy:** Models & Providers · Tools & Skills · Sessions & Storage · Loops & Scheduling · Runtime & Sandboxes · UI & Clients · Integrations · Developer & Operations

**Browse:** [Models & Providers](#models--providers) · [Tools & Skills](#tools--skills) · [Sessions & Storage](#sessions--storage) · [Loops & Scheduling](#loops--scheduling) · [Runtime & Sandboxes](#runtime--sandboxes) · [UI & Clients](#ui--clients) · [Integrations](#integrations) · [Developer & Operations](#developer--operations)

The taxonomy follows the capability seams defined by the [official Harness overview](https://www.deepseek.com/en/harness/).

Projects in each section are ranked by GitHub stars, then by verified reference count.
```

</details>

#### 缺口

- 用户是否重复遇到难以筛选的相同任务及愿意承担证据维护。
  **影响**：供给很多或暂无引用不是需求证明。
  **进一步探讨**：先收集五个真实选择失败案例，与当前直接搜索同条件比较。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
