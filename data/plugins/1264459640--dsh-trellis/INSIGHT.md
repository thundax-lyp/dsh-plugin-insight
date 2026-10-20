# dsh-trellis

> 以任务步骤和阶段约束开发流程，提供验收门禁与可选规划期写工具过滤。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7d2e5b6](https://github.com/1264459640/dsh-trellis/tree/7d2e5b69d2e744de511ac01632cf0865dfa79a85)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
<!-- END META -->

**使用建议**：先在测试项目检查任务创建、规划保护、批准和归档，再决定哪些项目启用。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：复杂开发任务需要明确计划批准、步骤验证与归档状态，避免直接把写完代码当完成。

人工计划加 Git/CI 更简单；只有统一阶段门槛能减少返工时才值得引入运行时层。

## 能力与限制

- **模型工具**：任务创建、更新、归档与诊断。
- **Skill**：向项目补充工作流 Skill。
- **后台**：阶段提示和可选写工具过滤。

**流程与依赖**

依赖项目 .trellis、Git 和宿主工具命名；与其他工作流插件同用可能出现规则冲突。

创建任务并规划、获得授权、推进步骤和验证，核查 Git 后归档；失败时标记阻塞并保留实际结果。

**兼容条件**

版本 0.3.7，依赖文件、Skill、工具、agent 和版本敏感的宿主契约；桌面安装有专属 CLI 条件。

**效果与成本**

任务文件、批准、步骤验证和 Git 检查增加流程负担；适合较大任务，简单修改可能不划算。

- **思考**：把完成门槛和执行清单显式化有利于协作；状态为 completed 仍需对应真实产物与验证依据。

## 工程分析

- **亮点**：Host 从项目 .trellis 状态注入阶段提示，复制缺失 Skill，工具管理任务；可选只读策略按授权状态过滤工具。

任务状态与会话绑定分开、局部 Git 校验值得借鉴；自动补回 Skill 会影响用户清理与升级策略。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工具过滤不是覆盖所有副作用的安全沙箱，其他工具和外部路径需额外核查；未跑真实任务验收。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试未批准写入、间接写工具、跳过授权、多会话绑定、无关脏文件与重启恢复。

**分析版本**

固定提交 [7d2e5b6](https://github.com/1264459640/dsh-trellis/tree/7d2e5b69d2e744de511ac01632cf0865dfa79a85)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 126 | 7451 | — | — | 110112 |
| .md | test | 2 | 279 | — | — | 5061 |
| .mjs | source | 3 | 728 | 571 | 106 | — |
| .js | source | 15 | 7822 | 5896 | 1584 | — |
| .js | test | 12 | 2906 | 2352 | 284 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
