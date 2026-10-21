# dsh-mysql

> 管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7848bba](https://github.com/1321928757/dsh-mysql/tree/7848bba53cccfe9e365a8fd46baa6d6883a29b78)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) · [![npm 30d 35](https://img.shields.io/static/v1?label=npm+30d&message=35&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql) · [![首次发布 2026-08-19](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mysql)
<!-- END META -->

**使用建议**：先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：开发者在数据库排障与分析时需要先看结构再查数据，交付应是可复核SQL和正确结果，而非仅返回成功。

此前本工程未研究此项；原生数据库客户端更适合权限管理与事务检查，插件减少在聊天与数据库间搬运结构的步骤。

## 能力与限制

- **模型工具**：mysql_query、mysql_tables、mysql_execute、mysql_ddl。
- **界面**：连接配置及会话多选数据源。

**流程与依赖**

需要可达MySQL、账号与DSH tools/storage/UI；配置密码留在宿主，结构和结果会作为工具输出送往模型。重启后会话选库不恢复。

配置并测试连接，选择会话数据源，先取表结构再生成查询，人工核对目标与写入风险；失败后检查连接及事务实际状态再重试。

**兼容条件**

0.3.1，声明DSH >=0.2.0-rc.2 <0.3.0、Node>=20，依赖mysql2与zod；服务与Web入口需共同适配。

**效果与成本**

首次创建低权限账号和连接白名单有运维成本；日常查询消耗数据库及模型额度，误写恢复另计。未测单位合格任务费用。

- **思考**：显式选库和拆分读写权限能减少误路由；应用层检查不能替代数据库授权，模型也会看到查询结果。

## 工程分析

- **亮点**：Host 注册四个全局工具；会话选择连接后逐调用确定目标，shared.js 分类SQL并检查表范围，写入与DDL分别开关。

safeConnection 隐藏密码，session-selection 独立管理运行期选择；SQL分类与DDL目标提取可读，但白名单正则需复杂查询反例验证。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：正则提取表名不是完整SQL解析器，不宜当数据库权限边界；未验证复杂语法、账号隔离或实际写入恢复。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用两个测试库覆盖错选连接、CTE/子查询、跨库语法、白名单与DDL；以只读账号作为独立约束，比较结果正确率和人工复核时间。

**分析版本**

固定提交 [7848bba](https://github.com/1321928757/dsh-mysql/tree/7848bba53cccfe9e365a8fd46baa6d6883a29b78)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 701 | — | — | 10475 |
| .js | source | 5 | 3005 | 2600 | 265 | — |
| .mjs | source | 2 | 401 | 328 | 53 | — |
| .mjs | test | 5 | 893 | 770 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
