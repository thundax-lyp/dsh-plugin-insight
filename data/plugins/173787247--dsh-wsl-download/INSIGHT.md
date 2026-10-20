# dsh-wsl-download

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

> 列出Windows下载目录中的文件并复制到WSL，另提供本地模型文件管理提示。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/commits)
<!-- END META -->

## 版本

固定提交 [8b1db94ca8658004ebc304e9678bbdd54a491133](https://github.com/173787247/dsh-wsl-download/tree/8b1db94ca8658004ebc304e9678bbdd54a491133)

## 用途与采用点评

- **用途**：用户已在Windows下载大模型或资料，希望复用现有文件而非在WSL重复下载，合格结果是正确文件完整复制。
- **亮点**：lib/download.js从WINDOWS_USER或PATH推断Downloads，列最近文件；copy限制源为basename并创建目标目录后copyFileSync，hint仅输出固定建议。
- **思考**：避免重复联网下载有价值，但名为download不代表下载器；固定模型提示可能随工具版本变化而过期。
- **建议**：先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。

## 场景与替代办法

此前未入档；cp/rsync及共享挂载更灵活，本项便利在Windows Downloads发现和会话入口。

## 依赖与流程

需要Windows用户识别、挂载权限和可写目标目录；提示中的模型兼容建议要按实际加载器版本另查。

list找到现有文件，核对名称和目标，copy后验大小/哈希；空间不足或中断时检查部分目标，不直接覆盖唯一成品。

## 成本与效果

大文件复制占IO、空间和人工核验时间；重复副本可能比直接共享路径更贵，未测吞吐或节省下载量。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：08d9c9652e07a359d00facff47e9f2e968e526f1b7bad4531fa5dc14ed62a7eb。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 93 | — | — | 553 |
| .js | source | 3 | 238 | 213 | 2 | — |
| .js | test | 1 | 26 | 23 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：win_download的list、copy与hint。

## 工程亮点

源名限制和输出列表限额降低误选范围，业务逻辑易复用；缺少拒绝覆盖、哈希及真实路径边界是采用前需补的检查。

## 分发与兼容

0.2.0，Node>=18，依赖WSL的/mnt/c/Users映射；自定义Windows下载目录与其他盘符不一定可识别。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工具不发起下载、不校验内容哈希；copyFileSync默认可能覆盖同名目标，basename校验也不保证源不是指向外部的符号链接。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在副本目录测试同名目标、符号链接、大文件中断与空间不足，确认源不变并用哈希验证合格复制。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
