# dsh-api-dashboard

> 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b57f953](https://github.com/133563825as-ai/dsh-api-dashboard/tree/b57f9535c55aa39026931813e09834fa9f4f4d82)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,179](https://img.shields.io/static/v1?label=npm+30d&message=4%2C179&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![首次发布 2026-08-28](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-28&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)
<!-- END META -->

**使用建议**：先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：同时使用多个供应商的用户需要观察额度和花费趋势，合格输出应能区分实际余额、估算与无法查询。

此前未入档；厂商控制台是账务对照，插件减少切换多个页面。现有余额插件也需用同账号和刷新频率比较，未做效果排名。

## 能力与限制

- **界面**：余额条、平台详情与子代理费用展示。
- **后台**：配置持久化和兼容检查后的自更新流程。

**流程与依赖**

依赖宿主credentials、Web UI、供应商余额API及准确usage/价格；自更新另依赖GitHub、tar与可写安装目录。

识别凭据与平台，读取余额，展示会话估算，用户核对并设置预警；查询失败应保留未知，更新失败检查备份而非盲目重复覆盖。

**兼容条件**

1.7.0，声明DSH 0.1及0.2部分范围，作者报告Android DSHA验收；桌面和旧宿主不能据此当作已验证。

**效果与成本**

频繁刷新增加接口请求与电量/网络负担；首次配置及维护价格表、核对对账占人工时间。未量化可节省费用。

- **思考**：集中显示和明确未知值有实用价值；估算若被当成收费真相，会把价格漂移和缓存差异隐藏起来。

## 工程分析

- **亮点**：src/index.js 从凭据及平台接口取余额，以内置或自定义单价计算会话消耗，混合币种分别显示；客户端定时刷新看板。

更新流程校验manifest、版本与兼容，备份替换并尝试回滚；一体化主模块同时承担计价与更新，后续维护面较大。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：余额接口与参考价不等于最终账单，部分单价注释本身标明未核实；本轮未复跑作者Android验收或更新流程。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在少量脱敏账号上对账，覆盖缓存命中、子代理、未知价格和接口失败，确认货币未混算，并单独验证更新回滚。

**分析版本**

固定提交 [b57f953](https://github.com/133563825as-ai/dsh-api-dashboard/tree/b57f9535c55aa39026931813e09834fa9f4f4d82)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1783 | — | — | 41793 |
| .js | source | 3 | 7736 | 5617 | 2095 | — |
| .mjs | test | 35 | 4043 | 3098 | 782 | — |
| .mjs | source | 2 | 356 | 263 | 65 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/133563825as-ai/dsh-api-dashboard/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
