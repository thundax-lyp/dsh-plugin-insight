# dsh-wsl-launch

> 从WSL启动允许列表中的Windows应用，并传递启动参数。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2090dc0](https://github.com/173787247/dsh-wsl-launch/tree/2090dc095654c22ccf93b26d0a2ff0050bc4e380)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch)
<!-- END META -->

**使用建议**：使用明确的应用路径和小范围允许列表，先验证含空格的文件参数。

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

已有贡献：把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Agent需要把文件或任务转交给Windows编辑器、浏览器等桌面应用。

- **建议**：本次未形成新的创新假设；先固定可执行文件身份并验证参数往返，比扩大可启动程序范围更有价值。

采用建议：使用明确的应用路径和小范围允许列表，先验证含空格的文件参数。

Windows快捷方式、explorer或手工Start-Process；插件提供Agent入口但不增加应用内控制能力。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：win_launch：启动允许的Windows应用。

**流程与依赖**

需要WSL互操作、Windows应用和PowerShell；启动参数语义由应用决定。

确认目标应用和参数，调用启动后人工核对窗口与文件；失败时回到原生启动命令。

**效果与成本**

桌面启动与人工确认是主要成本，没有任务交接耗时实测。

把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。 允许列表支持后缀与通配前缀，匹配程序名不等于固定可信可执行文件；Start-Process成功也不证明窗口打开了正确文件。

- **思考**：允许列表支持后缀与通配前缀，匹配程序名不等于固定可信可执行文件；Start-Process成功也不证明窗口打开了正确文件。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。

把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。

参数序列化与目标校验分离，禁止并发启动的声明有助于减少重复窗口。

<a id="detail-section-5"></a>

### 主要限制

允许列表支持后缀与通配前缀，匹配程序名不等于固定可信可执行文件；Start-Process成功也不证明窗口打开了正确文件。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/launch.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口和允许列表/脚本构造，未启动任何Windows应用。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：用同名程序、空格和中文参数核查匹配目标与启动内容；拒绝列表外目标，人工确认实际窗口。

**分析版本**

- **仓库**：[173787247/dsh-wsl-launch](https://github.com/173787247/dsh-wsl-launch)
- **版本号**：0.1.0（[固定提交 2090dc0](https://github.com/173787247/dsh-wsl-launch/tree/2090dc095654c22ccf93b26d0a2ff0050bc4e380)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新的创新假设；先固定可执行文件身份并验证参数往返，比扩大可启动程序范围更有价值。

用同名程序、空格和中文参数核查匹配目标与启动内容；拒绝列表外目标，人工确认实际窗口。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 177 | — | — | 899 |
| .js | source | 3 | 199 | 180 | 2 | — |
| .js | test | 1 | 19 | 16 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-launch/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
