# dsh-sidebar-git-graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[4dfefb3](https://github.com/AFunDog/dsh-sidebar-git-graph/tree/4dfefb3cc465be189fa1806f0bc9a33d30006a95)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)
<!-- END META -->

> **实现功能**：在DSH右侧栏显示当前会话仓库的分支提交图、工作树和暂存区差异。

> **核心亮点**：相对切换CLI或IDE，增量是将仓库身份、工作树/暂存区与历史图放到会话旁；Git事实仍来自Git，本插件不管理版本操作。

> **风险与缺陷**：“当前会话仓库”与图完整性是否清楚？扫描会截断并排除目录，多个只读命令并发返回也可能跨越新的提交/暂存操作。无写入避免修改仓库，却不保证一组数据来自同一时点；读图仍需看truncated与仓库选项。

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

> **用途**：开发者在会话中确认分支与改动归属，合格展示需明确仓库、分页和刷新时点，不能把图形完整误认作所有历史。

git log --graph与IDE成熟；插件的增量是会话关联和就近查看，不提供新Git语义。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：Git泳道图与工作树/暂存区差异。

**流程与依赖**

Git CLI、DSH会话cwd与侧栏；结果取决于本机仓库状态，无远端刷新自动真实性。

解析会话目录，扫描/选择仓库，读status/refs/log/diff并绘图；用户查看提交与工作区差异，变化时刷新。

**效果与成本**

初始安装与仓库识别，日常大型仓库log/diff/扫描成本与人工刷新；无性能/审阅节时实测。

减少上下文切换，不能替代版本控制备份或审查。

> **思考**：“当前会话仓库”与图完整性是否清楚？扫描会截断并排除目录，多个只读命令并发返回也可能跨越新的提交/暂存操作。无写入避免修改仓库，却不保证一组数据来自同一时点；读图仍需看truncated与仓库选项。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对切换CLI或IDE，增量是将仓库身份、工作树/暂存区与历史图放到会话旁；Git事实仍来自Git，本插件不管理版本操作。

相对切换CLI或IDE，增量是将仓库身份、工作树/暂存区与历史图放到会话旁；Git事实仍来自Git，本插件不管理版本操作。

分隔符解析与有界无符号链接扫描可借鉴；将读取与展示拆分便于验证，复用需补统一时点和异常/截断可见性。 源码依据：[lib/git-read.js](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/git-read.js)、[lib/repos.js](https://github.com/AFunDog/dsh-sidebar-git-graph/blob/4dfefb3cc465be189fa1806f0bc9a33d30006a95/lib/repos.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“当前会话仓库”与图完整性是否清楚？扫描会截断并排除目录，多个只读命令并发返回也可能跨越新的提交/暂存操作。无写入避免修改仓库，却不保证一组数据来自同一时点；读图仍需看truncated与仓库选项。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合会话内只读查看Git。先确认选中仓库、扫描范围和刷新，再作提交判断；图谱不是CI或代码正确性验收。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AFunDog/dsh-sidebar-git-graph](https://github.com/AFunDog/dsh-sidebar-git-graph)
- **版本号**：0.5.0（[固定提交 4dfefb3c](https://github.com/AFunDog/dsh-sidebar-git-graph/tree/4dfefb3cc465be189fa1806f0bc9a33d30006a95)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/git-read.js、lib/repos.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/git-read.js、lib/repos.js、lib/index.js；未覆盖全部参考/界面分支与真实并发宿主行为，未运行目标代码、外部工具或安装验收。
- 下一步：临时多仓库/linked-worktree、大历史分页、奇异文件名与并发提交测试，核对Git原始结果和truncated提示。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由多命令快照推导，可每次加载前后读取HEAD/索引标识，不一致时标明刷新并避免拼接旧新图。未验证；高频提交/切仓库时检查视图是否混用，若不能区分则否定。

临时多仓库/linked-worktree、大历史分页、奇异文件名与并发提交测试，核对Git原始结果和truncated提示。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：8bf04fb84dd1a7f63a64e2763b3a297d4dd7f437d166148ec0482251baa828aa。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1002 | — | — | 14207 |
| .js | source | 8 | 5448 | 3463 | 1718 | — |
| .mjs | source | 2 | 170 | 124 | 31 | — |
| .cjs | test | 19 | 5248 | 3821 | 960 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AFunDog/dsh-sidebar-git-graph/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
