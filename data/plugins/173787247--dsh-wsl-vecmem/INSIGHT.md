# dsh-wsl-vecmem

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[c092a92](https://github.com/173787247/dsh-wsl-vecmem/tree/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem)
<!-- END META -->

> **实现功能**：使用 Ollama 嵌入在本地存储短文本，并按工作区进行语义检索。

> **核心亮点**：相对 JSON 内嵌浮点向量，sidecar 降低文本解析/存储负担；相对单阶段相似度，增加可降级 rerank 和显式阶段信息。算法本身继承成熟向量检索，作者注释中的体积/命中实例不是本次独立实测。

> **风险与缺陷**：关键是返回 confidence 能否代表可相信的事实。源码对 embedding 和 rerank 分数用同一0.15/0.45阈值，未见校准；仅检维数不足以识别同维度换模型。JSON 解析失败回空库，双文件非事务，不能当可靠长期存储。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地模型的个人开发者保存项目碎片，期望跨会话查到正确事实；交付是带原文和检索阶段的候选片段，不是权威知识库。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：vecmem_status、vecmem_add、vecmem_search、vecmem_clear

**流程与依赖**

Node≥18、DSH、Ollama 与已下载 embedding 模型必要；reranker HTTP 服务可选，失败降级；本地 ~/.dsh/vecmem 状态跨项目共用，workspace 是过滤而非访问控制。

配置模型/目录→add 嵌入并双文件落盘→search 嵌入/筛工作区/全扫描/rerank→人工确认原文；损坏需恢复备份或重索引，clear 无撤销。

**效果与成本**

现金为既有本地计算和模型存储；首次部署 Ollama/可选 reranker，持续需备份、清理、重建及误召回复核，全扫描随条目/维数增长，未测单位成本。

阶段显式化有助诊断降级，但返回片段不证明事实正确；小型、可恢复碎片比高可靠企业记忆更匹配当前设计。

> **思考**：关键是返回 confidence 能否代表可相信的事实。源码对 embedding 和 rerank 分数用同一0.15/0.45阈值，未见校准；仅检维数不足以识别同维度换模型。JSON 解析失败回空库，双文件非事务，不能当可靠长期存储。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对 JSON 内嵌浮点向量，sidecar 降低文本解析/存储负担；相对单阶段相似度，增加可降级 rerank 和显式阶段信息。算法本身继承成熟向量检索，作者注释中的体积/命中实例不是本次独立实测。

相对 JSON 内嵌浮点向量，sidecar 降低文本解析/存储负担；相对单阶段相似度，增加可降级 rerank 和显式阶段信息。算法本身继承成熟向量检索，作者注释中的体积/命中实例不是本次独立实测。

lib/store.js 的二进制矩阵和显式 stage 可借鉴；add 先追加向量再覆盖JSON，无锁/事务，index.js 把 add 标为并发安全仍需并发验证；read mismatch 主要在status警告，搜索不统一拒绝损坏。 源码：[index.js](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/index.js)、[lib/store.js](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/lib/store.js)、[test/vecmem.test.js](https://github.com/173787247/dsh-wsl-vecmem/blob/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29/test/vecmem.test.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键是返回 confidence 能否代表可相信的事实。源码对 embedding 和 rerank 分数用同一0.15/0.45阈值，未见校准；仅检维数不足以识别同维度换模型。JSON 解析失败回空库，双文件非事务，不能当可靠长期存储。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合可丢弃的项目碎片试用；保留独立原始笔记和双文件备份，固定嵌入模型，不按 strong 自动采信，不用作唯一记录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 index.js、lib/store.js、test/vecmem.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：固定含否定/近义/无答案的查询集，对照 embedding/rerank 的召回与误接受；切换同维模型、截断 sidecar 和并发 add，检查是否明确失败并能恢复原数据。

**分析版本**

- **仓库**：[173787247/dsh-wsl-vecmem](https://github.com/173787247/dsh-wsl-vecmem)
- **版本号**：0.2.0（[固定提交 c092a92](https://github.com/173787247/dsh-wsl-vecmem/tree/c092a92892fa63aab5e4a18f0cd2cd4b1eb81d29)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把模型标识与校准版本绑定每条向量，并按检索阶段标定拒答阈值，可减少同维换模型和分数体系切换造成的误信；需重建索引和标注查询集，尚未实现。

固定含否定/近义/无答案的查询集，对照 embedding/rerank 的召回与误接受；切换同维模型、截断 sidecar 和并发 add，检查是否明确失败并能恢复原数据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 568 |
| .js | source | 2 | 464 | 371 | 70 | — |
| .js | test | 1 | 56 | 50 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-vecmem/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
