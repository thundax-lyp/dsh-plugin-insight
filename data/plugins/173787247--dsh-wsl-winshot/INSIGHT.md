# dsh-wsl-winshot

> 把指定 Windows 窗口或控件区域截图保存为 WSL 文件。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[e7963e2](https://github.com/173787247/dsh-wsl-winshot/tree/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winshot)
<!-- END META -->

**使用建议**：适合前台可见窗口的图片观察；先把窗口完整露出并核对PNG，避免用它收集被遮挡窗口的权威证据，截图会还原最小化窗口。

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

- **用途**：WSL Agent需要查看图像形式的Windows应用状态，以可读取PNG作为交付，再交由模型/人工分析。

采用建议：适合前台可见窗口的图片观察；先把窗口完整露出并核对PNG，避免用它收集被遮挡窗口的权威证据，截图会还原最小化窗口。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：win_shot_window

**流程与依赖**

Node≥18、DSH、Windows交互桌面、PowerShell/UIA/System.Drawing必要；C盘Public临时目录与WSL挂载可读写，最终默认 ~/.dsh/shots。

选窗口/控件→必要时还原→桌面采样→写Public临时PNG→复制WSL并尽力删除临时文件→人工/模型查看；失败可能留临时文件。

**效果与成本**

无订阅；人工需保证可见与核对画面，PNG占存储，重试/清理也有负担，未测图片交接时间。

跨系统图像交接清楚，但截图正确性受桌面状态支配，不能把文件成功保存当应用验证通过。

- **思考**：最重要的限制是被遮挡窗口是否仍能正确截图。CopyFromScreen只读取屏幕像素，不保证目标窗口内容；还原最小化窗口也改变桌面。按名裁剪取第一个匹配而非拒绝歧义，因此PNG存在不等于正确目标。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手动截图再传文件，贡献是窗口选择、裁剪与跨系统文件交接；图像来自桌面屏幕区域采样，并非独立窗口渲染，截图算法属System.Drawing。

相对手动截图再传文件，贡献是窗口选择、裁剪与跨系统文件交接；图像来自桌面屏幕区域采样，并非独立窗口渲染，截图算法属System.Drawing。

裁剪坐标在Windows侧计算可减少WSL坐标换算负担；复制后清理清楚，异常路径仍需清理保障；源码没有PrintWindow式独立渲染，需避免超出承诺。 源码：[index.js](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/index.js)、[lib/shot-exec.js](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot-exec.js)、[lib/shot.js](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/lib/shot.js)、[test/winshot.test.js](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/test/winshot.test.js)、[test/shot.test.js](https://github.com/173787247/dsh-wsl-winshot/blob/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b/test/shot.test.js)。

<a id="detail-section-5"></a>

### 主要限制

最重要的限制是被遮挡窗口是否仍能正确截图。CopyFromScreen只读取屏幕像素，不保证目标窗口内容；还原最小化窗口也改变桌面。按名裁剪取第一个匹配而非拒绝歧义，因此PNG存在不等于正确目标。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/shot-exec.js、lib/shot.js、test/winshot.test.js、test/shot.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：同一测试窗口前台/遮挡/最小化与双屏DPI场景截图，对照已知图像和目标矩形；若遮挡时仍返回ok但图片是别窗，必须标非目标可信截图。

**分析版本**

- **仓库**：[173787247/dsh-wsl-winshot](https://github.com/173787247/dsh-wsl-winshot)
- **版本号**：0.1.0（[固定提交 e7963e2](https://github.com/173787247/dsh-wsl-winshot/tree/e7963e21a06611d7fdfb01e9d34c7a7f0d04d32b)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：截图结果附可见性/遮挡检查和明确目标句柄，使上层在遮挡时请求用户调整而非误分析图片；当前未实现可靠遮挡判断。

同一测试窗口前台/遮挡/最小化与双屏DPI场景截图，对照已知图像和目标矩形；若遮挡时仍返回ok但图片是别窗，必须标非目标可信截图。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 119 | — | — | 472 |
| .js | source | 4 | 319 | 273 | 18 | — |
| .js | test | 2 | 118 | 105 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-winshot/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
