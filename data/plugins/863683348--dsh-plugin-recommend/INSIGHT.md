# dsh-plugin-recommend

> 按需求、分类和标签搜索插件目录，提供相似项及在线目录刷新。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e553b1a](https://github.com/863683348/dsh-plugin-recommend/tree/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b)

<!-- BEGIN META -->
[![npm 30d 739](https://img.shields.io/static/v1?label=npm+30d&message=739&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend) [![首次发布 2026-08-19](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend)
<!-- END META -->

**使用建议**：适合找候选和同类线索。刷新后核对条目数量及来源结构，别把匹配分当质量分；同仓多组件分别确认是否被去重。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是直接目录搜索、语义检索或模型猜测；项目提供透明低成本词面排序，未替代源码研究。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册recommend；recommend.js做中英文token、名称/标签/描述加权、类别多样化和相似度；refresh从awesome README解析列表替换进程内目录，失败回退内嵌数据。

- **模型工具**：recommend搜索、分类、详情、相似项及刷新

宿主tools/systemPrompt、Schemastery；包内catalog.json以及可选GitHub raw README网络，来源文本不是插件运行证据。

本地词面搜索/类别/详情/相似项→可选刷新目录→返回理由与仓库→人工检查固定版本→另行扫描安装；不执行安装。

<a id="detail-section-4"></a>

### 成本与效果

首次依赖内嵌目录即可；刷新需网络，持续成本在目录结构兼容、标签维护和候选核实。现金主要是宿主模型token，排序分高不表示省下真实选型成本。

可减少翻目录步骤，无需求标注评测或真实替代成功数据。

<a id="detail-section-5"></a>

### 工程亮点

检索纯逻辑与宿主封装分离，details揭示权重、termMatches避免只靠类别加分返回无关项；结构化刷新与组件身份比更多排序开关更值得补齐。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/index.js)、[lib/recommend.js](https://github.com/863683348/dsh-plugin-recommend/blob/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b/lib/recommend.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合从广泛目录获取插件候选与替代项，之后还需检查源码与宿主条件。

- **建议**：待验证假设：采用结构化目录源并对刷新前后覆盖及标签变化做显式审计，比只要parsed非空就成功更可靠。用README改版、部分解析和同仓多组件需求比较漏项与候选质量；无法确认完整时保留旧目录并标未知。

适合找候选和同类线索。刷新后核对条目数量及来源结构，别把匹配分当质量分；同仓多组件分别确认是否被去重。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：recommend搜索、分类、详情、相似项及刷新

- **思考**：在线解析依赖###标题和特定Markdown列表形式，来源改版可能少量成功却漏项。刷新得到的条目没有内嵌目录自动标签，排序条件与静态结果不完全相同；去重在排序前保留首个同仓项，可能丢掉更匹配组件。刷新在进程内生效不等于持久档案或固定版本研究。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者主张按需推荐；实际增量是将大目录的可解释关键词检索、相似项、去重和分类多样化封成工具。相对模型凭记忆猜名，输出对应条目与命中理由；相似度仅是共享标签/描述词，不能证明可替代性或效果。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-recommend](https://github.com/863683348/dsh-plugin-recommend)
- **版本号**：1.1.2（[固定提交 e553b1a6](https://github.com/863683348/dsh-plugin-recommend/tree/e553b1a6b6da777694bf6094e5c9b5ba5f51cd8b)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/recommend.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用来源标题/列表改版、只解析一类、同仓多组件、无标签刷新与同义词查询检查覆盖和排序；本轮未执行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：采用结构化目录源并对刷新前后覆盖及标签变化做显式审计，比只要parsed非空就成功更可靠。用README改版、部分解析和同仓多组件需求比较漏项与候选质量；无法确认完整时保留旧目录并标未知。

用来源标题/列表改版、只解析一类、同仓多组件、无标签刷新与同义词查询检查覆盖和排序；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d5af2bb4d43a5e11a437b62b88138f87898e5347e479bc44703354c69a2ad970。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 166 | — | — | 1219 |
| .js | source | 2 | 523 | 418 | 76 | — |
| .mjs | source | 2 | 195 | 169 | 14 | — |
| .mjs | test | 1 | 172 | 157 | 14 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-recommend/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
