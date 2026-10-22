# dsh-crypto-portfolio

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[c615eeb](https://github.com/0xRabit/dsh-crypto-portfolio/tree/c615eeb9e76d9a91bffb0171ef349532e794eb3c)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio) · **脚本有更新，待重新洞察**
<!-- END META -->

> **实现功能**：以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。

> **核心亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。

> **风险与缺陷**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。

交易所账单和钱包原生查询更接近原始事实；聚合后仍需按来源对账。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **后台**：生命周期内启动并停止 Python 看板进程。

**流程与依赖**

依赖 Python、链上和交易所接口；本地部署不代表外部查询或账户信息完全不出网。

配置数据目录和账户来源，启动看板刷新；异常时从 Python 进程、接口和来源配置逐层排查。

**兼容条件**

包版本 0.2.0，除了 Node 还需 Python 环境及其依赖；源码安装不能替代完整部署验收。

**效果与成本**

外部 API、Python 依赖和密钥维护增加运维负担，未测刷新耗时或人工对账节省。

> **思考**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。

把用户配置移出 node_modules 可避免升级覆盖；子进程退出、端口占用和备份恢复需补充验收。

<a id="detail-section-4"></a>

## 4 使用建议

先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查启动和数据目录边界，未验证交易所适配、金额准确性、API 权限或投资收益。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试首次启动、升级、端口占用、接口失效与配置恢复，并核对同一时刻各账户数值。

**分析版本**

固定提交 [c615eeb](https://github.com/0xRabit/dsh-crypto-portfolio/tree/c615eeb9e76d9a91bffb0171ef349532e794eb3c)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 652 | — | — | 7190 |
| .js | source | 2 | 3094 | 2702 | 324 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/0xRabit/dsh-crypto-portfolio/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
