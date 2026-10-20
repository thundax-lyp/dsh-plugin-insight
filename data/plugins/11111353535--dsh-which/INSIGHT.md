# dsh-which

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

> 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-which/commits)
<!-- END META -->

## 版本

固定提交 [7894da833582b46526b251348cd8993b70a5ce85](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)

## 用途与采用点评

- **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。
- **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。
- **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。
- **建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

## 场景与替代办法

command -v、type 和 where 是必需对照；本插件增加跨平台结构化解释与副本比较。

## 依赖与流程

需要读取当前进程 PATH、文件权限与工作区；宿主进程环境可能不同于用户交互终端。

查询命令与 PATH 异常，按需探测版本，再由用户修复环境；插件自身不重写 PATH。

## 成本与效果

静态查询开销较低，探测多个副本会增加进程启动，未测故障排查总耗时改善。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e43dbaa9b6955e14c1a11c6730d02040dea282de406709fa04be9a936034e393。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 1776 | 1003 | 641 | — |
| .md | source | 2 | 508 | — | — | 4302 |
| .mjs | source | 1 | 155 | 88 | 51 | — |
| .mjs | test | 4 | 1425 | 1091 | 197 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：命令解析、PATH 分析与可选版本探测。

## 工程亮点

纯解析逻辑与宿主文件及探测分离可借鉴；要保留 shell 语义差异而非宣传通吃。

## 分发与兼容

版本 0.1.0，Host tools/commands 注入，默认不开版本探测且不修改 PATH。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证全部 shell 函数、别名与初始化脚本；版本探测仍会执行目标程序，不等同纯文件读取。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两个版本、不可执行文件、Windows shim 和 shell alias 比较实际执行与报告。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-which/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
