# dsh-crypto-portfolio

> 以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio) · [![最后更新 14天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=14%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/commits)
<!-- END META -->

## 版本

固定提交 [c615eeb9e76d9a91bffb0171ef349532e794eb3c](https://github.com/0xRabit/dsh-crypto-portfolio/tree/c615eeb9e76d9a91bffb0171ef349532e794eb3c)

## 用途与采用点评

- **用途**：同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。
- **亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。
- **思考**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。
- **建议**：先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。

## 场景与替代办法

同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。

交易所账单和钱包原生查询更接近原始事实；聚合后仍需按来源对账。

## 依赖与流程

依赖 Python、链上和交易所接口；本地部署不代表外部查询或账户信息完全不出网。

配置数据目录和账户来源，启动看板刷新；异常时从 Python 进程、接口和来源配置逐层排查。

## 成本与效果

外部 API、Python 依赖和密钥维护增加运维负担，未测刷新耗时或人工对账节省。

多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f2e8ad07b64803c9dddcf762f6e166f5e2fb6c23a219291b158336b7325d6936。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 652 | — | — | 7190 |
| .js | source | 2 | 3094 | 2702 | 324 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：生命周期内启动并停止 Python 看板进程。

## 工程亮点

把用户配置移出 node_modules 可避免升级覆盖；子进程退出、端口占用和备份恢复需补充验收。

## 分发与兼容

包版本 0.2.0，除了 Node 还需 Python 环境及其依赖；源码安装不能替代完整部署验收。

## 历史对照

前次代码指纹为 c615eeb9e76d9a91bffb0171ef349532e794eb3c；本轮固定为 c615eeb9e76d9a91bffb0171ef349532e794eb3c。交易所账单和钱包原生查询更接近原始事实；聚合后仍需按来源对账。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查启动和数据目录边界，未验证交易所适配、金额准确性、API 权限或投资收益。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试首次启动、升级、端口占用、接口失效与配置恢复，并核对同一时刻各账户数值。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+created%3A2026-09-20T02%3A56%3A59.073Z..2026-10-20T02%3A56%3A59.073Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A56%3A59.073Z..2026-10-20T02%3A56%3A59.073Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A56%3A59.073Z..2026-10-20T02%3A56%3A59.073Z)

统计日期：2026-10-20。
