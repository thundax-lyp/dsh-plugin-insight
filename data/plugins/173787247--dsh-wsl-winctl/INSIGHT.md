# dsh-wsl-winctl

> 从 WSL 枚举 Windows 顶层窗口并调整窗口状态、位置和大小。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[2e22c81](https://github.com/173787247/dsh-wsl-winctl/tree/2e22c81fb6375a17d387226f0dfe359ba5dc3954)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winctl)
<!-- END META -->

**使用建议**：适合整理明确单窗口的桌面；先枚举并核对目标，多窗口和关闭操作保留人工确认，返回ok后重新读取实际状态。

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

- **用途**：WSL 内 Agent 需要先整理 Windows 应用窗口再观察/输入；交付是指定窗口的状态与布局，不是应用任务完成。

采用建议：适合整理明确单窗口的桌面；先枚举并核对目标，多窗口和关闭操作保留人工确认，返回ok后重新读取实际状态。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：win_windows

**流程与依赖**

Node≥18、DSH、WSL可达Windows PowerShell、UIA与user32必要；进程完整性等级、窗口权限和系统焦点策略影响效果。

列窗口→明确pid/标题→发动作→状态回读/人工看桌面；关闭是WM_CLOSE异步请求，应用保存对话框仍需处理。

**效果与成本**

无订阅；人工成本为消除窗口歧义、复核焦点/布局和处理保存提示，未测批量布局时间。

经常跨Windows/WSL整理桌面的人可受益；不适合作为无监督业务事务完成证明。

- **思考**：关键质疑是动作是否确实作用于唯一目标并得到验证。Dsh-Find 返回首个匹配，未拒绝多窗口歧义；原生调用返回值被忽略，activate仅ShowWindow而不调用SetForegroundWindow，报告ok不等于获得焦点。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对人工拖动和临时 PowerShell，贡献是统一窗口选择、完整移动参数和状态回读；窗口管理能力来自 user32/UIA，不是新的桌面控制算法。

相对人工拖动和临时 PowerShell，贡献是统一窗口选择、完整移动参数和状态回读；窗口管理能力来自 user32/UIA，不是新的桌面控制算法。

normalizeMove拒绝半指定矩形值得复用；状态采集与动作同模块方便审查，但原生调用结果丢失、foreground使用操作前句柄，需独立后验检查。 源码：[index.js](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/index.js)、[lib/winctl.js](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl.js)、[lib/winctl-exec.js](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/lib/winctl-exec.js)、[test/winctl.test.js](https://github.com/173787247/dsh-wsl-winctl/blob/2e22c81fb6375a17d387226f0dfe359ba5dc3954/test/winctl.test.js)。

<a id="detail-section-5"></a>

### 主要限制

关键质疑是动作是否确实作用于唯一目标并得到验证。Dsh-Find 返回首个匹配，未拒绝多窗口歧义；原生调用返回值被忽略，activate仅ShowWindow而不调用SetForegroundWindow，报告ok不等于获得焦点。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/winctl.js、lib/winctl-exec.js、test/winctl.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 2e22c81fb6375a17d387226f0dfe359ba5dc3954，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在同进程多个窗口、同名窗口和受限制前台切换场景，比较期望句柄与实际状态；任何ok但目标未改变应归未知/失败，close需确认保存提示而非假定已关。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winctl](https://github.com/173787247/dsh-wsl-winctl)
- **版本号**：0.1.0（[固定提交 2e22c81](https://github.com/173787247/dsh-wsl-winctl/tree/2e22c81fb6375a17d387226f0dfe359ba5dc3954)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：选择器要求唯一窗口并返回操作前后句柄/状态差值，可降低多窗口误操作；拒绝歧义会增加用户指定目标成本，需比较误操作减少是否抵消该负担。

在同进程多个窗口、同名窗口和受限制前台切换场景，比较期望句柄与实际状态；任何ok但目标未改变应归未知/失败，close需确认保存提示而非假定已关。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 121 | — | — | 491 |
| .js | source | 4 | 296 | 259 | 13 | — |
| .js | test | 1 | 70 | 63 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-winctl/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
