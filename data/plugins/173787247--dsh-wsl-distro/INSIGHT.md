# dsh-wsl-distro

> 识别当前WSL发行版、Windows默认发行版与系统信息，并提示跨发行版路径差异。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/commits)
<!-- END META -->

## 版本

固定提交 [5a6f71031271a53d6e16abd267c59fbc69685a92](https://github.com/173787247/dsh-wsl-distro/tree/5a6f71031271a53d6e16abd267c59fbc69685a92)

## 用途与采用点评

- **用途**：安装多个发行版的用户容易把Windows默认WSL与当前会话混淆，希望先确认目录属于哪一个系统。
- **亮点**：lib/distro.js读取WSL_DISTRO_NAME和os-release，执行wsl.exe -l -v并解析表格，比较当前与默认发行版。
- **思考**：提醒默认发行版不等于当前会话能避免路径误用；发行版名字本身不能证明用户、挂载和权限一致。
- **建议**：适合多发行版开发者，先核对current/default与UNC路径，再在目标发行版确认文件存在。

## 场景与替代办法

此前未入档；手工echo环境变量及wsl -l -v已足够，本项把分散结果整理成路径提示。

## 依赖与流程

依赖正确WSL环境变量、Windows互操作与输出编码，路径能否访问还取决于发行版运行和用户权限。

运行distro_info，确认当前和默认发行版，再转换所需路径；解析无结果时回读原始wsl列表，不据此切换或删除环境。

## 成本与效果

无模型外额外服务，主要是进程探测和人工确认；不直接修改系统，错误路径判断的后续恢复成本仍需考虑。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d38b8e9a7dbefa21ed3349e764095236d204ae19d8424d5ad19afdb07079d9ff。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 549 |
| .js | source | 3 | 238 | 211 | 5 | — |
| .js | test | 1 | 56 | 53 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：distro_info。

## 工程亮点

os-release读取与表格解析分离，解析失败保留raw输出方便核对；状态字段的英文Running检测有本地化边界。

## 分发与兼容

0.2.0，Node>=18，需WSL环境和可用wsl.exe互操作；语言与Windows版本兼容未执行验证。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只报告信息，不切换发行版或迁移文件；表格解析依赖列形态与编码，未知状态不能当作无发行版。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试多发行版、非默认会话、停止状态和不同语言输出，检查UNC建议指向当前发行版而非默认。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-distro/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
