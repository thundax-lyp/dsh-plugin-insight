# dsh-wsl-uia

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[43e5b42](https://github.com/173787247/dsh-wsl-uia/tree/43e5b42c013a3170c318217889eb1c9504d9f6c4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-uia)
<!-- END META -->

> **实现功能**：从 WSL 枚举 Windows 窗口并读取有深度限制的 UI Automation 元素树。

> **核心亮点**：相对截图 OCR，源码可见增量是提供语义控件属性和命名路径，同时把观察与输入分成插件；UIAutomation 遍历来自 Windows 平台，epoch 只是观察标签，不是稳定控件身份。

> **风险与缺陷**：关键质疑是有界观察是否真的限制工作量。treeScript 用输出条数限制循环，过滤不命中的节点仍可继续遍历，maxElements 不是访问节点上限；truncated 根据输出数推断。稀疏匹配树仍可能耗时，UIA 覆盖还取决于应用可访问性。

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

> **用途**：需要理解 Windows 应用控件而非只看像素的 WSL Agent，交付窗口、控件名称、类型、可用 pattern 和路径，供人工或输入工具决策。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：uia_tree

**流程与依赖**

Node≥18、DSH、WSL 可运行 Windows PowerShell 与 UIAutomationClient 必要；目标进程权限与 accessibility provider 决定可见性，无云服务依赖。

枚举窗口→按 pid 读树/find→必要时 wait/path→人工核对→另行输入；跨观察的 index 不复用，超时需缩小范围。

**效果与成本**

主要成本是进程启动/树遍历和模型读树，界面频变会增加重复观察与人工复核；未测同任务相对截图的合格率。

语义属性可能减少像素猜测，但不可访问的自绘 UI 仍需图像路径，未验证能端到端完成办公任务。

> **思考**：关键质疑是有界观察是否真的限制工作量。treeScript 用输出条数限制循环，过滤不命中的节点仍可继续遍历，maxElements 不是访问节点上限；truncated 根据输出数推断。稀疏匹配树仍可能耗时，UIA 覆盖还取决于应用可访问性。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对截图 OCR，源码可见增量是提供语义控件属性和命名路径，同时把观察与输入分成插件；UIAutomation 遍历来自 Windows 平台，epoch 只是观察标签，不是稳定控件身份。

相对截图 OCR，源码可见增量是提供语义控件属性和命名路径，同时把观察与输入分成插件；UIAutomation 遍历来自 Windows 平台，epoch 只是观察标签，不是稳定控件身份。

uia-locate.js 把按名定位拆为独立模块、歧义路径拒绝返回，值得借鉴；uia-exec.js 的过滤与预算耦合需修正，不能据参数名推断硬工作量边界。 源码：[index.js](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/index.js)、[lib/uia-exec.js](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-exec.js)、[lib/uia-locate.js](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia-locate.js)、[lib/uia.js](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/lib/uia.js)、[test/uia.test.js](https://github.com/173787247/dsh-wsl-uia/blob/43e5b42c013a3170c318217889eb1c9504d9f6c4/test/uia.test.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是有界观察是否真的限制工作量。treeScript 用输出条数限制循环，过滤不命中的节点仍可继续遍历，maxElements 不是访问节点上限；truncated 根据输出数推断。稀疏匹配树仍可能耗时，UIA 覆盖还取决于应用可访问性。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有可访问性控件的 Windows 应用观察；先以少量元素验证名称和覆盖，找不到不能直接判控件不存在，动作前重新定位。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

- 已检查：作者 README、包清单、源码路径 index.js、lib/uia-exec.js、lib/uia-locate.js、lib/uia.js、test/uia.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 43e5b42c013a3170c318217889eb1c9504d9f6c4，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在深层且多数节点不匹配的 UIA fixture 对照遍历耗时与实际访问数；检查预算触顶时返回不完整状态。另在 Win32/Electron 各核对控件名与截图。

**分析版本**

- **仓库**：[173787247/dsh-wsl-uia](https://github.com/173787247/dsh-wsl-uia)
- **版本号**：0.1.0（[固定提交 43e5b42](https://github.com/173787247/dsh-wsl-uia/tree/43e5b42c013a3170c318217889eb1c9504d9f6c4)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：同时返回 visited、matched、queueRemaining 并按 visited 预算停止，可使“未找到”与“尚未遍历到”分开；该统计尚未实现。

在深层且多数节点不匹配的 UIA fixture 对照遍历耗时与实际访问数；检查预算触顶时返回不完整状态。另在 Win32/Electron 各核对控件名与截图。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 123 | — | — | 559 |
| .js | source | 5 | 583 | 507 | 32 | — |
| .js | test | 1 | 203 | 181 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-uia/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
