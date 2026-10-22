# dsh-wsl-tray

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7ad45d3](https://github.com/173787247/dsh-wsl-tray/tree/7ad45d3db6672fb07ab909135c3c479ee5dee72a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray)
<!-- END META -->

> **实现功能**：为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。

> **核心亮点**：相对记忆 WSL 命令，贡献是把恢复入口放在宿主 UI 外、保留 token URL 并处理 UNC/引号/BOM 互操作；实际重启和中继仍由 dsh-wsl-kit 实现，不应归为本插件的服务恢复算法。

> **风险与缺陷**：关键是故障时外部恢复链是否可用。kit 仅以 restart 脚本存在确认，启动后固定等12秒、只检查 URL 含 token=；不保证令牌新鲜或服务健康。FALLBACK_KIT_PATHS 调用未导入的 readdirSync，被 catch 吞掉，Windows fallback 自动发现不会执行成功。

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

> **用途**：Windows 使用者希望在 DSH Web 不可达时从桌面启动、重启或查看健康，以能打开当前令牌 URL 为交付。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：wsl_tray

**流程与依赖**

Node≥18、DSH、WSL/Windows PowerShell、可用 kit checkout 必要；托盘另需 AutoHotkey v2，桌面快捷方式依赖 COM/UNC 可达。

status→核对 kit→install_scripts 或 install_tray 写 ~/.dsh/tray 及 Windows 快捷方式→用户启动→外部脚本恢复并打开 token；失败需手动查 kit。

**效果与成本**

无订阅依赖；首次维护 kit/AHK/路径，持续承担脚本与宿主版本适配，token 进入剪贴板与启动输出需用户理解，未测故障恢复时间。

脱离故障 Web UI 的入口有实际流程价值；仅生成入口不证明恢复率，也未发现独立采用数据。

> **思考**：关键是故障时外部恢复链是否可用。kit 仅以 restart 脚本存在确认，启动后固定等12秒、只检查 URL 含 token=；不保证令牌新鲜或服务健康。FALLBACK_KIT_PATHS 调用未导入的 readdirSync，被 catch 吞掉，Windows fallback 自动发现不会执行成功。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对记忆 WSL 命令，贡献是把恢复入口放在宿主 UI 外、保留 token URL 并处理 UNC/引号/BOM 互操作；实际重启和中继仍由 dsh-wsl-kit 实现，不应归为本插件的服务恢复算法。

相对记忆 WSL 命令，贡献是把恢复入口放在宿主 UI 外、保留 token URL 并处理 UNC/引号/BOM 互操作；实际重启和中继仍由 dsh-wsl-kit 实现，不应归为本插件的服务恢复算法。

lib/tray.js psQuote、UTF-8 BOM 和 UNC 转换体现具体跨系统经验，值得复用并配真实 Windows 端验证；文件探测与恢复结果应分层，静默 catch 隐藏了 fallback 缺陷。 源码：[index.js](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/index.js)、[lib/tray.js](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/tray.js)、[lib/wsl-host.js](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/lib/wsl-host.js)、[test/tray.test.js](https://github.com/173787247/dsh-wsl-tray/blob/7ad45d3db6672fb07ab909135c3c479ee5dee72a/test/tray.test.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键是故障时外部恢复链是否可用。kit 仅以 restart 脚本存在确认，启动后固定等12秒、只检查 URL 含 token=；不保证令牌新鲜或服务健康。FALLBACK_KIT_PATHS 调用未导入的 readdirSync，被 catch 吞掉，Windows fallback 自动发现不会执行成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已使用 dsh-wsl-kit 的 Windows 用户；显式设置 kitPath，先从快捷方式实际启动一次，再依赖托盘恢复，不把生成脚本成功当启动成功。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 index.js、lib/tray.js、lib/wsl-host.js、test/tray.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 7ad45d3db6672fb07ab909135c3c479ee5dee72a，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在 WSL 测试冷启动、慢启动、残留旧 URL、kit 缺失和含空格路径；以实际浏览器成功进入为准，并核对启动失败时是否误开旧页。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tray](https://github.com/173787247/dsh-wsl-tray)
- **版本号**：0.2.4（[固定提交 7ad45d3](https://github.com/173787247/dsh-wsl-tray/tree/7ad45d3db6672fb07ab909135c3c479ee5dee72a)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：让 kit 提供带进程身份和健康结果的原子 launch descriptor，托盘等该结果再打开，可替代固定等待与旧 token 文件；这是外部协议改造，当前未实现。

在 WSL 测试冷启动、慢启动、残留旧 URL、kit 缺失和含空格路径；以实际浏览器成功进入为准，并核对启动失败时是否误开旧页。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 164 | — | — | 1162 |
| .js | source | 3 | 574 | 401 | 146 | — |
| .js | test | 1 | 116 | 82 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
