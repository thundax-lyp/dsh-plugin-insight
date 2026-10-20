# dsh-wsl-registry

> 从WSL只读查询Windows注册表值和子键，并限制可访问键前缀。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ec36b50](https://github.com/173787247/dsh-wsl-registry/tree/ec36b50ceab4f15549c2b2ac7f97033084a3eb56)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-registry)
<!-- END META -->

**使用建议**：从已知非敏感键试读，避免把白名单与截断承诺视为已验证安全边界。

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

已有贡献：把Get-Item/Get-ItemProperty接成受限只读工具；增量是跨系统接线和输出约束，注册表查询能力来自Windows。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：WSL中的Agent排查Windows安装和配置，输出可追溯键值而非让用户反复复制注册表信息。

- **建议**：待验证假设：按注册表规范化路径段校验并统一所有输出分支预算，可保留配置诊断便利而减少越界和过大结果；规则复杂度可能抵消便利。

采用建议：从已知非敏感键试读，避免把白名单与截断承诺视为已验证安全边界。

直接PowerShell或注册表编辑器；本插件把已有查询变成Agent工具，不能替代配置正确性判断。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：win_reg：只读注册表值及子键查询。

**流程与依赖**

需要WSL互操作、Windows PowerShell和当前账户的注册表读取权限；只读不等于内容无敏感信息。

先指定非敏感键读少量值，再按name或subkeys深入；失败核对权限和实际键名，不自动修改配置。

**效果与成本**

主要为PowerShell启动、输出上下文和人工核对成本；未测节省时间，外部服务费用不适用。

把Get-Item/Get-ItemProperty接成受限只读工具；增量是跨系统接线和输出约束，注册表查询能力来自Windows。 白名单用startsWith而非路径段边界匹配，不能仅凭前缀断言严密隔离；指定name的查询没有像批量值分支一样在脚本内截断400字符，作者笼统截断说明需限定。

- **思考**：白名单用startsWith而非路径段边界匹配，不能仅凭前缀断言严密隔离；指定name的查询没有像批量值分支一样在脚本内截断400字符，作者笼统截断说明需限定。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把Get-Item/Get-ItemProperty接成受限只读工具；增量是跨系统接线和输出约束，注册表查询能力来自Windows。

把Get-Item/Get-ItemProperty接成受限只读工具；增量是跨系统接线和输出约束，注册表查询能力来自Windows。

纯规范化与执行分离便于审查，统一路径规范化和结果预算应贯穿各分支。

<a id="detail-section-5"></a>

### 主要限制

白名单用startsWith而非路径段边界匹配，不能仅凭前缀断言严密隔离；指定name的查询没有像批量值分支一样在脚本内截断400字符，作者笼统截断说明需限定。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/registry-exec.js、lib/registry.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口、路径断言、查询脚本及格式化；未访问注册表、运行目标测试或进行宿主验收。
- 下一步：用相似前缀、Run/RunOnce、长命名值与不存在键构造隔离样例；比较原生查询一致性与返回长度，越界仍被接受则否定边界改善。

**分析版本**

- **仓库**：[173787247/dsh-wsl-registry](https://github.com/173787247/dsh-wsl-registry)
- **版本号**：0.1.0（[固定提交 ec36b50](https://github.com/173787247/dsh-wsl-registry/tree/ec36b50ceab4f15549c2b2ac7f97033084a3eb56)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：按注册表规范化路径段校验并统一所有输出分支预算，可保留配置诊断便利而减少越界和过大结果；规则复杂度可能抵消便利。

用相似前缀、Run/RunOnce、长命名值与不存在键构造隔离样例；比较原生查询一致性与返回长度，越界仍被接受则否定边界改善。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 481 |
| .js | source | 4 | 252 | 214 | 15 | — |
| .js | test | 1 | 33 | 29 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-registry/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
