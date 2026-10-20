# dsh-wsl-editor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

> 把WSL文件路径转换为Windows路径，在Cursor、VS Code或记事本中打开并可定位行列。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/commits)
<!-- END META -->

## 版本

固定提交 [0bc7619da7b473a622ae9e498d19fd0360162261](https://github.com/173787247/dsh-wsl-editor/tree/0bc7619da7b473a622ae9e498d19fd0360162261)

## 用途与采用点评

- **用途**：用户希望从Agent定位的源码快速跳到Windows编辑器，验收是正确文件和行号实际可见。
- **亮点**：lib/editor.js检查路径存在并realpath，调用wslpath -w转换，依序用PowerShell Start-Process启动编辑器，支持code/cursor的-g目标。
- **思考**：减少复制路径和手工跳行的步骤；自动打开入口不意味着文件修改或任务已完成。
- **建议**：适合Windows+WSL开发，先测试当前发行版路径、中文空格和行号；自动回退后人工确认文件与定位。

## 场景与替代办法

此前未入档；原生code/cursor CLI也能完成，本项统一状态探测与自动回退，适合不想记跨系统参数的人。

## 依赖与流程

需要可读Linux路径、正确Windows映射和编辑器可执行文件；远程窗口、发行版与用户会话必须匹配。

先查编辑器状态，提交绝对路径及行列，用户确认目标；失败时区分路径映射、编辑器发现和GUI会话，不重复启动多个实例。

## 成本与效果

无额外云服务，主要是路径转换与进程启动延迟；编辑器配置、UNC访问和失败排查占人工，未测省时幅度。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：eba725c773570c597721b59adb53a1dcc0cab9b5cb6ef094b30305f2f0f1bf48。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 126 | — | — | 773 |
| .js | source | 3 | 295 | 263 | 4 | — |
| .js | test | 1 | 23 | 20 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：win_editor、win_editor_status。

## 工程亮点

realpath后转换和PowerShell单引号转义便于复用，status探测与打开分开；进程启动成功和GUI可见性需要额外验收。

## 分发与兼容

0.1.1，Node>=18，要求WSL互操作、wslpath及Windows编辑器可发现；不提供编辑器安装或代码修改功能。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：启动器返回成功不证明编辑器已打开或文件可读；自动模式回退记事本时不支持行列定位，不能声称同等导航结果。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试符号链接、不同发行版、Unicode路径、行列和只装记事本的环境，记录实际GUI打开结果与工具回报是否一致。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-editor/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
