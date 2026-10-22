# dsh-wsl-download

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[8b1db94](https://github.com/173787247/dsh-wsl-download/tree/8b1db94ca8658004ebc304e9678bbdd54a491133)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download)
<!-- END META -->

> **实现功能**：列出Windows下载目录中的文件并复制到WSL，另提供本地模型文件管理提示。

> **核心亮点**：lib/download.js从WINDOWS_USER或PATH推断Downloads，列最近文件；copy限制源为basename并创建目标目录后copyFileSync，hint仅输出固定建议。

> **风险与缺陷**：避免重复联网下载有价值，但名为download不代表下载器；固定模型提示可能随工具版本变化而过期。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：用户已在Windows下载大模型或资料，希望复用现有文件而非在WSL重复下载，合格结果是正确文件完整复制。

此前未入档；cp/rsync及共享挂载更灵活，本项便利在Windows Downloads发现和会话入口。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：win_download的list、copy与hint。

**流程与依赖**

需要Windows用户识别、挂载权限和可写目标目录；提示中的模型兼容建议要按实际加载器版本另查。

list找到现有文件，核对名称和目标，copy后验大小/哈希；空间不足或中断时检查部分目标，不直接覆盖唯一成品。

**兼容条件**

0.2.0，Node>=18，依赖WSL的/mnt/c/Users映射；自定义Windows下载目录与其他盘符不一定可识别。

**效果与成本**

大文件复制占IO、空间和人工核验时间；重复副本可能比直接共享路径更贵，未测吞吐或节省下载量。

> **思考**：避免重复联网下载有价值，但名为download不代表下载器；固定模型提示可能随工具版本变化而过期。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/download.js从WINDOWS_USER或PATH推断Downloads，列最近文件；copy限制源为basename并创建目标目录后copyFileSync，hint仅输出固定建议。

源名限制和输出列表限额降低误选范围，业务逻辑易复用；缺少拒绝覆盖、哈希及真实路径边界是采用前需补的检查。

<a id="detail-section-4"></a>

## 4 使用建议

先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工具不发起下载、不校验内容哈希；copyFileSync默认可能覆盖同名目标，basename校验也不保证源不是指向外部的符号链接。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在副本目录测试同名目标、符号链接、大文件中断与空间不足，确认源不变并用哈希验证合格复制。

**分析版本**

固定提交 [8b1db94](https://github.com/173787247/dsh-wsl-download/tree/8b1db94ca8658004ebc304e9678bbdd54a491133)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 93 | — | — | 553 |
| .js | source | 3 | 238 | 213 | 2 | — |
| .js | test | 1 | 26 | 23 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
