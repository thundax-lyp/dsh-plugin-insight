# dsh-which

> 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7894da8](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which)
<!-- END META -->

**使用建议**：先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：命令在终端与智能体中表现不同的开发者需要定位实际可执行文件和版本来源。

command -v、type 和 where 是必需对照；本插件增加跨平台结构化解释与副本比较。

## 能力与限制

- **模型工具**：命令解析、PATH 分析与可选版本探测。

**流程与依赖**

需要读取当前进程 PATH、文件权限与工作区；宿主进程环境可能不同于用户交互终端。

查询命令与 PATH 异常，按需探测版本，再由用户修复环境；插件自身不重写 PATH。

**兼容条件**

版本 0.1.0，Host tools/commands 注入，默认不开版本探测且不修改 PATH。

**效果与成本**

静态查询开销较低，探测多个副本会增加进程启动，未测故障排查总耗时改善。

- **思考**：让遮蔽副本成为一等输出可解释版本冲突；只有解析规则与实际 shell 一致才可信。

## 工程分析

- **亮点**：自己按 PATH/PATHEXT 等规则解析候选，报告胜出与遮蔽项；版本探测使用解析后的路径、限定参数和超时。

纯解析逻辑与宿主文件及探测分离可借鉴；要保留 shell 语义差异而非宣传通吃。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证全部 shell 函数、别名与初始化脚本；版本探测仍会执行目标程序，不等同纯文件读取。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两个版本、不可执行文件、Windows shim 和 shell alias 比较实际执行与报告。

**分析版本**

固定提交 [7894da8](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 1776 | 1003 | 641 | — |
| .md | source | 2 | 508 | — | — | 4302 |
| .mjs | source | 1 | 155 | 88 | 51 | — |
| .mjs | test | 4 | 1425 | 1091 | 197 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/11111353535/dsh-which/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
