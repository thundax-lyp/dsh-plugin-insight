# dsh-wsl-struct

> 在 DSH 中调用 jq、yq 和只读 SQLite 查询本地结构化数据。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6133450](https://github.com/173787247/dsh-wsl-struct/tree/6133450a091e0fbb1f8d02a10f371e30e8d56f7b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct)
<!-- END META -->

**使用建议**：适合有固定配置查询的开发者先在副本中试用；显式缩小 allowRoots，核实 yq 版本及表达式权限，不把它当不可信查询隔离器。

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

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

[重点创新推演与最小验证](#innovation)

- **用途**：需要从本地 JSON/YAML 配置和 SQLite 缓存提取字段的开发者，以查询结果而非完整文件作为交付物。

采用建议：适合有固定配置查询的开发者先在副本中试用；显式缩小 allowRoots，核实 yq 版本及表达式权限，不把它当不可信查询隔离器。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：struct_status、struct_jq、struct_yq、struct_sqlite

**流程与依赖**

Node≥18、DSH tools/systemPrompt、PATH 内 jq/yq/sqlite3 必要；yq 方言是额外兼容条件，缺命令时无法查询；无需云账号。

先探测 CLI，设置根目录，提交过滤表达式或 SQL，读取结果及 truncated；错误由工具返回，复杂查询由用户改写复核。

**效果与成本**

现金主要是既有计算与模型调用；首次需装 CLI/确认方言，持续需复核截断与 SQL 误拒，未测任务耗时。

可交付是受限结构化查询结果，未测相对 bash 的合格率或人工时间，低频简单查询未必值得另配工具。

- **思考**：最关键的条件是文件 allowRoots 是否等于表达式的全部读边界。源码仅检查主文件，yq 表达式原样交给外部程序；不同 yq 实现可能带额外文件/环境读取功能，不能据此宣称完整沙箱。SQL 黑名单也会误拒字符串中的 UPDATE 等词。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者称为沙箱化查询；相对直接让模型拼 bash，已实现的增量是统一文件入口、SQL 只读开关和截断标记，而 jq/yq/SQLite 的查询算法来自外部 CLI。能减少常见命令拼接，但不构成操作系统沙箱。

作者称为沙箱化查询；相对直接让模型拼 bash，已实现的增量是统一文件入口、SQL 只读开关和截断标记，而 jq/yq/SQLite 的查询算法来自外部 CLI。能减少常见命令拼接，但不构成操作系统沙箱。

lib/struct.js 的 realpath 与路径前缀检查、sqlite -readonly 值得复用；表达式执行与文件门禁职责分离也暴露了“主路径校验不等于全进程隔离”的维护边界。test/struct.test.js 仅覆盖基础 SQL 允许/拒绝，不是表达式安全证明。 源码：[index.js](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/index.js)、[lib/struct.js](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/lib/struct.js)、[test/struct.test.js](https://github.com/173787247/dsh-wsl-struct/blob/6133450a091e0fbb1f8d02a10f371e30e8d56f7b/test/struct.test.js)。

<a id="detail-section-5"></a>

### 主要限制

最关键的条件是文件 allowRoots 是否等于表达式的全部读边界。源码仅检查主文件，yq 表达式原样交给外部程序；不同 yq 实现可能带额外文件/环境读取功能，不能据此宣称完整沙箱。SQL 黑名单也会误拒字符串中的 UPDATE 等词。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/struct.js、test/struct.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 6133450a091e0fbb1f8d02a10f371e30e8d56f7b，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在临时非敏感目录对同一批 JSON/YAML/SQLite 查询比较原 CLI 与插件；加入符号链接、越界表达式、含关键字的合法字符串，检查允许率、越界读和截断。若仍能读取根外文件则推翻沙箱假设。

**分析版本**

- **仓库**：[173787247/dsh-wsl-struct](https://github.com/173787247/dsh-wsl-struct)
- **版本号**：0.1.0（[固定提交 6133450](https://github.com/173787247/dsh-wsl-struct/tree/6133450a091e0fbb1f8d02a10f371e30e8d56f7b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：固定 yq 实现并把表达式能力分为纯查询与外部读操作，能保留常用配置查询而缩小越界面；新增的是可解释的表达式策略，当前插件未实现。

在临时非敏感目录对同一批 JSON/YAML/SQLite 查询比较原 CLI 与插件；加入符号链接、越界表达式、含关键字的合法字符串，检查允许率、越界读和截断。若仍能读取根外文件则推翻沙箱假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 113 | — | — | 449 |
| .js | source | 2 | 252 | 234 | 1 | — |
| .js | test | 1 | 15 | 14 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+created%3A2026-09-20T10%3A43%3A49.702Z..2026-10-20T10%3A43%3A49.702Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-struct/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T10%3A43%3A49.702Z..2026-10-20T10%3A43%3A49.702Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
