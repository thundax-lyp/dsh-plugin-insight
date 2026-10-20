# Plan Lattice

> 从原生会话事实恢复长任务连续性，并提供显式启用的递归工作图控制。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/commits)
<!-- END META -->

## 版本

固定提交 [ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)

## 用途与采用点评

- **用途**：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。
- **亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。
- **思考**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。
- **建议**：先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。

## 场景与替代办法

跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。

原生计划/Todo 是必须对照；本轮只核查源码和作者材料，没有复跑任何基准。

## 依赖与流程

依赖 DSH 会话、工具及生命周期契约；真正收益取决于模型、任务和压缩路径。

默认连续性路径观察宿主事实，完整模式显式建立契约；恢复异常时回查事件和依据摘要。

## 成本与效果

完整控制需要状态和验收维护；作者实验中存在超预算，不能宣称普遍减少 token。

从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f5f553f8b7f8a68cd48321dbb7daeb5e81172cba2b45b8611688d3ea2a13ccd8。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 72 | 8122 | — | — | 62377 |
| .mjs | source | 285 | 65400 | 61299 | 240 | — |
| .ts | example | 1 | 130 | 121 | 0 | — |
| .js | example | 5 | 42 | 35 | 0 | — |
| .md | example | 17 | 90 | — | — | 584 |
| .mjs | example | 64 | 3814 | 3179 | 330 | — |
| .js | source | 98 | 6842 | 6273 | 0 | — |
| .mjs | test | 24 | 3271 | 3085 | 11 | — |
| .ts | source | 23 | 12113 | 11013 | 400 | — |
| .ts | test | 79 | 19850 | 18373 | 84 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：原生会话连续性恢复。
- **模型工具**：显式完整模式的 Lattice 控制工具。

## 工程亮点

机械执行凭证不冒充语义完成、负面实验保留门槛值得借鉴；宿主事件与权限耦合较深。

## 分发与兼容

package 0.4.0-rc.8，作者说明稳定版仍为 0.3.0，候选源码与公开发行物必须区分。

## 历史对照

前次代码指纹为 ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3；本轮固定为 ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3。原生计划/Todo 是必须对照；本轮只核查源码和作者材料，没有复跑任何基准。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本检出为未发布 rc.8 工作，作者保留多次负面/超预算试验；不能把机制压力测试推广为编码收益。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用相同任务和预算对照原生，覆盖压缩、冷恢复、委派与中断，预注册质量和成本门槛。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
