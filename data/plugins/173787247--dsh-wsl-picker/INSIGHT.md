# dsh-wsl-picker

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0cd8861](https://github.com/173787247/dsh-wsl-picker/tree/0cd8861e4240635693cf152c9c7635433e5980c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-picker)
<!-- END META -->

> **实现功能**：在DSH中浏览WSL目录与挂载盘，支持名称过滤和工作区快捷入口。

> **核心亮点**：把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。

> **风险与缺陷**：maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。

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

> **用途**：用户需要向Agent提供WSL或Windows挂载目录，减少反复复制目录列表。

ls/find和人工复制路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：wsl_picker：目录列举、过滤与im快捷入口。

**流程与依赖**

依赖WSL检测与Node文件系统权限；im工作区为可选，不存在时返回空列表和提示。

选择目录或im入口，过滤并查看返回条目，再交由后续工具使用；不会设置宿主cwd。

**效果与成本**

输出上限降低上下文体积，但同步枚举及逐项stat仍有I/O与事件循环成本，未测性能。

把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。 maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。

> **思考**：maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。

把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。

解析、格式与执行在单模块内清楚分离；同步I/O与全量枚举限制规模，truncated是输出提示不是分页能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合小中目录导航；先确认返回路径，敏感目录仍受进程权限而非插件白名单控制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/picker.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口与目录解析实现，未浏览用户目录或验证界面交互。
- 下一步：覆盖大目录、无权限目录、符号链接、隐藏项与过滤；比较ls和工具结果的一致性及宿主响应延迟。

**分析版本**

- **仓库**：[173787247/dsh-wsl-picker](https://github.com/173787247/dsh-wsl-picker)
- **版本号**：0.1.1（[固定提交 0cd8861](https://github.com/173787247/dsh-wsl-picker/tree/0cd8861e4240635693cf152c9c7635433e5980c9)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新创新假设；优先验证大目录延迟和路径边界，再决定是否需要分页或根范围约束。

覆盖大目录、无权限目录、符号链接、隐藏项与过滤；比较ls和工具结果的一致性及宿主响应延迟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 127 | — | — | 741 |
| .js | source | 3 | 274 | 199 | 56 | — |
| .js | test | 1 | 27 | 23 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-picker/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
