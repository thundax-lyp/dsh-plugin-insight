# dsh-wsl-power

> 从WSL查询Windows电源计划、电池与睡眠配置。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7a37a8c](https://github.com/173787247/dsh-wsl-power/tree/7a37a8c91d47bf69e630ca59db4740a5d7451d77)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power)
<!-- END META -->

**使用建议**：仅作状态参考；中文系统和休眠可用性必须先对照原始结果，不据工具返回直接承诺任务不中断。

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

已有贡献：将Windows电源只读查询放进Agent上下文，减少切换设置页；不修改计划，也未建立任务防中断机制。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：运行长任务前，用户希望查看宿主电源策略和电池状态以评估中断可能。

- **建议**：本次未形成新创新假设；先验证语言无关查询与休眠可用性语义，避免据错误状态推演调度。

采用建议：仅作状态参考；中文系统和休眠可用性必须先对照原始结果，不据工具返回直接承诺任务不中断。

Windows设置、电池面板和直接powercfg查询。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：win_power：查询计划、电池和睡眠状态。

**流程与依赖**

需要WSL互操作、Windows PowerShell、powercfg与CIM；系统策略和设备能力影响可查询项。

查询后人工核对系统设置，必要时由用户另行调整；插件不切换计划、不阻止睡眠。

**效果与成本**

跨进程查询和人工核对为主要成本；未测长任务失败减少量或电力收益。

将Windows电源只读查询放进Agent上下文，减少切换设置页；不修改计划，也未建立任务防中断机制。 计划与睡眠解析匹配英文输出，本地化Windows可能漏报；Hibernate子串判断不区分可用与不可用列表，不能把该布尔值当可靠能力验收。

- **思考**：计划与睡眠解析匹配英文输出，本地化Windows可能漏报；Hibernate子串判断不区分可用与不可用列表，不能把该布尔值当可靠能力验收。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将Windows电源只读查询放进Agent上下文，减少切换设置页；不修改计划，也未建立任务防中断机制。

将Windows电源只读查询放进Agent上下文，减少切换设置页；不修改计划，也未建立任务防中断机制。

执行与归一化分离便于跨平台单测；静默catch保留null较好，但文本解析和英文状态词需要更强语义边界。

<a id="detail-section-5"></a>

### 主要限制

计划与睡眠解析匹配英文输出，本地化Windows可能漏报；Hibernate子串判断不区分可用与不可用列表，不能把该布尔值当可靠能力验收。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/power-exec.js、lib/power.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查查询脚本及归一化，未读取或修改电源设置。
- 下一步：在中英文系统对照powercfg原始输出与设置页，覆盖无电池、禁用休眠和睡眠从不；检查unknown是否被误判false。

**分析版本**

- **仓库**：[173787247/dsh-wsl-power](https://github.com/173787247/dsh-wsl-power)
- **版本号**：0.1.0（[固定提交 7a37a8c](https://github.com/173787247/dsh-wsl-power/tree/7a37a8c91d47bf69e630ca59db4740a5d7451d77)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新创新假设；先验证语言无关查询与休眠可用性语义，避免据错误状态推演调度。

在中英文系统对照powercfg原始输出与设置页，覆盖无电池、禁用休眠和睡眠从不；检查unknown是否被误判false。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 113 | — | — | 401 |
| .js | source | 4 | 215 | 181 | 12 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-power/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
