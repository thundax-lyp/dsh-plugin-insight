# dsh-tool-explorer

> 在DSH设置页浏览管理Skills与MCP，支持安装、编辑、开关、连接测试及跨工具配置导入。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[63ea4c8](https://github.com/6pofx/dsh-tool-explorer/tree/63ea4c8192f715c3157af69e71fef67915db8af1)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer) [![npm 30d 673](https://img.shields.io/static/v1?label=npm+30d&message=673&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer) [![首次发布 2026-08-31](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-31&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tool-explorer)
<!-- END META -->

**使用建议**：适合经常管理多套Skills与MCP且能备份profile的用户试用。先在临时profile验证导入、并发改配置、删除恢复与失败更新，升级DSH后检查本地补丁状态。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：维护多个Skill和MCP的DSH用户需要从配置文件转向统一管理，合格交付是配置正确生效、变更冲突被发现、删除可恢复，而非仅列表显示成功。

- **建议**：由磁盘Skill、lock与宿主热加载分阶段更新推导，可增加带预期哈希的变更计划与事务日志，先暂存完整目录再原子切换，并在重启时完成/回滚lock。相对当前异常捕获，它覆盖进程终止窗口；未验证。对复制后、目录切换后、lock写入前注入终止，若无法恢复一致版本则不成立。

适合经常管理多套Skills与MCP且能备份profile的用户试用。先在临时profile验证导入、并发改配置、删除恢复与失败更新，升级DSH后检查本地补丁状态。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

直接编辑Skill文件与MCP patch避免额外界面依赖，但缺少集中预览与恢复入口；已有管理插件被README列为设计参照，本轮不做效果排名。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：Skills与MCP管理设置页。
- **Host 路由**：同源管理API接口。

**流程与依赖**

依赖宿主skills、loader与settings/配置层，GitHub网络用于安装，MCP测试需对应程序或HTTP端点；本地补丁触及宿主已安装文件。

浏览来源与状态，预览远程Skill或导入其他工具MCP配置，确认后写profile并热加载；失败查看连接测试、备份或垃圾箱，人工确认工具能完成目标任务。

**效果与成本**

首次要核查Skill来源、MCP命令与密钥配置；日常有升级补丁和配置复核成本。网络下载及MCP/模型服务费用沿用所选服务，未实测节省工时。

统一管理可减少跨文件定位和误删后的人工重建；仍需区分配置已写、服务已连与业务任务完成，未提供实际任务合格率。

- **思考**：界面中的“可恢复管理”能否覆盖全部失败？更新路径先复制备份、删除本地目录，再复制新内容；只有新内容复制异常分支回滚，备份阶段及后续lock写入不在同一事务，不能推断任意中断均原子恢复。MCP expectedHash在undefined时跳过围栏，也不能将可选冲突检测解释为所有写入都受保护。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手工编辑多个配置、复制Skill目录，增量是将发现、编辑、生效与恢复组织到一处，并对模型/用户调用开关分轴管理。README承认参考已有Skill管理插件，垃圾箱与配置管理是成熟机制的场景组合，不是新的分布式配置算法。

相对手工编辑多个配置、复制Skill目录，增量是将发现、编辑、生效与恢复组织到一处，并对模型/用户调用开关分轴管理。README承认参考已有Skill管理插件，垃圾箱与配置管理是成熟机制的场景组合，不是新的分布式配置算法。

同源写入检查、哈希围栏、垃圾箱放在Skill根外均值得借鉴，避免watcher误发现删除项。维护代价是跨宿主设置API和配置方言，以及非事务目录/lock更新；复用时应明确恢复边界。 源码依据：[src/routes.ts](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/routes.ts)、[src/mcp.ts](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/mcp.ts)、[src/skills-install.ts](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-install.ts)、[src/skills-trash.ts](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/skills-trash.ts)、[src/patch-text.ts](https://github.com/6pofx/dsh-tool-explorer/blob/63ea4c8192f715c3157af69e71fef67915db8af1/src/patch-text.ts)。

<a id="detail-section-5"></a>

### 主要限制

界面中的“可恢复管理”能否覆盖全部失败？更新路径先复制备份、删除本地目录，再复制新内容；只有新内容复制异常分支回滚，备份阶段及后续lock写入不在同一事务，不能推断任意中断均原子恢复。MCP expectedHash在undefined时跳过围栏，也不能将可选冲突检测解释为所有写入都受保护。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[6pofx/dsh-tool-explorer](https://github.com/6pofx/dsh-tool-explorer)
- **版本号**：0.4.4（[固定提交 63ea4c81](https://github.com/6pofx/dsh-tool-explorer/tree/63ea4c8192f715c3157af69e71fef67915db8af1)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/routes.ts、src/mcp.ts、src/skills-install.ts、src/skills-trash.ts、src/patch-text.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：隔离profile执行同源拒绝、过期哈希拒绝、目录更新中断恢复、删除还原与真实MCP连接对照；记录配置一致性和人工恢复时间。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由磁盘Skill、lock与宿主热加载分阶段更新推导，可增加带预期哈希的变更计划与事务日志，先暂存完整目录再原子切换，并在重启时完成/回滚lock。相对当前异常捕获，它覆盖进程终止窗口；未验证。对复制后、目录切换后、lock写入前注入终止，若无法恢复一致版本则不成立。

隔离profile执行同源拒绝、过期哈希拒绝、目录更新中断恢复、删除还原与真实MCP连接对照；记录配置一致性和人工恢复时间。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：682ff248a5ee24e75f93c21d1c36d368b7570188f8fb50f6ee9107c3de8a7988。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1034 | — | — | 12909 |
| .mjs | source | 8 | 1248 | 892 | 256 | — |
| .ts | source | 13 | 3823 | 3058 | 520 | — |
| .tsx | source | 3 | 1472 | 1332 | 47 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/6pofx/dsh-tool-explorer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
