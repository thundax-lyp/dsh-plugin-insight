# dsh-wsl-editor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[0bc7619](https://github.com/173787247/dsh-wsl-editor/tree/0bc7619da7b473a622ae9e498d19fd0360162261)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor)
<!-- END META -->

> **实现功能**：把WSL文件路径转换为Windows路径，在Cursor、VS Code或记事本中打开并可定位行列。

> **核心亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。

> **风险与缺陷**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：用户希望从Agent定位的源码快速跳到Windows编辑器，验收是正确文件和行号实际可见。

此前未入档；原生code/cursor CLI也能完成，本项统一状态探测与自动回退，适合不想记跨系统参数的人。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：win_editor、win_editor_status。

**流程与依赖**

需要可读Linux路径、正确Windows映射和编辑器可执行文件；远程窗口、发行版与用户会话必须匹配。

先查编辑器状态，提交绝对路径及行列，用户确认目标；失败时区分路径映射、编辑器发现和GUI会话，不重复启动多个实例。

**兼容条件**

0.1.1，Node>=18，要求WSL互操作、wslpath及Windows编辑器可发现；不提供编辑器安装或代码修改功能。

**效果与成本**

无额外云服务，主要是路径转换与进程启动延迟；编辑器配置、UNC访问和失败排查占人工，未测省时幅度。

> **思考**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。

realpath后转换和PowerShell单引号转义便于复用，status探测与打开分开；进程启动成功和GUI可见性需要额外验收。

<a id="detail-section-4"></a>

## 4 使用建议

适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：启动器返回成功不证明编辑器已打开或文件可读；自动模式回退记事本时不支持行列定位，不能声称同等导航结果。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试符号链接、不同发行版、Unicode路径、行列和只装记事本的环境，记录实际GUI打开结果与工具回报是否一致。

**分析版本**

固定提交 [0bc7619](https://github.com/173787247/dsh-wsl-editor/tree/0bc7619da7b473a622ae9e498d19fd0360162261)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 126 | — | — | 773 |
| .js | source | 3 | 295 | 263 | 4 | — |
| .js | test | 1 | 23 | 20 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
