# KRouter

> 以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[e934696](https://github.com/398894496-arch/KRouter/tree/e9346963eca848a5012406ea5cb2f0cacc55fbb6)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)
<!-- END META -->

**使用建议**：有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：跨Claude Code、Codex、Cursor和DSH维护决策的用户，需优先引用仍有效页面，未知时不硬凑相近答案。

采用建议：有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。

参照普通BM25加同样过期排除/阈值规则；不把对未加规则基线的优势误归为算法。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：DSH只读知识路由工具
- **后台**：本地FTS5索引、状态过滤与匹配阈值拒答

**流程与依赖**

查询需Python3、可用SQLite FTS5、本地vault和路由脚本；可选Obsidian仅查看器，蒸馏另需CLI或API。

用户问决策→只读工具路由→本地全文召回与有效状态过滤→阈值/来源收据→Agent引用或拒答；写入和蒸馏属于独立授权流程。

**效果与成本**

首次建库和导入需人工确认，查询本地无模型账单；可选蒸馏/夜间维护发送文本到模型并产生费用，错误纠正与备份持续耗时。

纠错页替代旧页可减少重复解释，但效果由页面状态与query分布决定；作者基准为作者证据，非本轮独立验证。

- **思考**：作者基准改善是否说明算法领先？作者报告200题及错误引用率，但同规则BM25差异区间跨零；默认策略、拒答覆盖率和数据构造均可解释部分差异。源码阈值可见，真实知识库写作质量和纠错标注决定有效性，未独立复跑。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对普通全文检索，实质贡献是默认启用过期页排除和低置信拒答、带出处收据的组合；作者README承认匹配同样规则的全文基线无显著差异，因此不归因为新检索算法。跨Agent共享可编辑Markdown是明确流程增量。

相对普通全文检索，实质贡献是默认启用过期页排除和低置信拒答、带出处收据的组合；作者README承认匹配同样规则的全文基线无显著差异，因此不归因为新检索算法。跨Agent共享可编辑Markdown是明确流程增量。

缓存位于vault外并按路径摘要隔离，Markdown可重建；DSH ALLOWED拒绝写路由，spawnSync固定argv有超时但会阻塞宿主线程至完成。 [固定源码](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L1)。

<a id="detail-section-5"></a>

### 主要限制

[核查分支](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L404)。

作者基准改善是否说明算法领先？作者报告200题及错误引用率，但同规则BM25差异区间跨零；默认策略、拒答覆盖率和数据构造均可解释部分差异。源码阈值可见，真实知识库写作质量和纠错标注决定有效性，未独立复跑。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 skill/krouter-obsidian/scripts/recall_index.py、extras/dsh/lib/route.js、extras/dsh/lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：固定不同规模中英知识库和未见人工问题，匹配覆盖率比较同规则BM25与当前路由，统计错误引用与纠错题；若收益只来自更高拒答则否定算法增益假设。

**分析版本**

- **仓库**：[398894496-arch/KRouter](https://github.com/398894496-arch/KRouter)
- **版本号**：1.2.1（[固定提交 e9346963](https://github.com/398894496-arch/KRouter/tree/e9346963eca848a5012406ea5cb2f0cacc55fbb6)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：按拒答覆盖率匹配的评估，再按纠错/邻近误召回分层，可分离拒答策略与检索能力增量；新增负担是独立标注及未见真实查询采样。

固定不同规模中英知识库和未见人工问题，匹配覆盖率比较同规则BM25与当前路由，统计错误引用与纠错题；若收益只来自更高拒答则否定算法增益假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 261 | 5945 | — | — | 69028 |
| .js | source | 3 | 309 | 284 | 3 | — |
| .mjs | source | 2 | 157 | 131 | 6 | — |
| .md | example | 8 | 79 | — | — | 394 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/398894496-arch/KRouter/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
