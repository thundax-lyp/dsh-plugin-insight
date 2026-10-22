# Plan Lattice

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ea4d4f7](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)
<!-- END META -->

> **实现功能**：从原生会话事实恢复长任务连续性，并提供显式启用的递归工作图控制。

> **核心亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。

> **风险与缺陷**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：跨压缩和重启的长任务需要恢复已批准计划、待办及委派结果，减少依据丢失。

原生计划/Todo 是必须对照；本轮只核查源码和作者材料，没有复跑任何基准。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **后台**：原生会话连续性恢复。
- **模型工具**：显式完整模式的 Lattice 控制工具。

**流程与依赖**

依赖 DSH 会话、工具及生命周期契约；真正收益取决于模型、任务和压缩路径。

默认连续性路径观察宿主事实，完整模式显式建立契约；恢复异常时回查事件和依据摘要。

**兼容条件**

package 0.4.0-rc.8，作者说明稳定版仍为 0.3.0，候选源码与公开发行物必须区分。

**效果与成本**

完整控制需要状态和验收维护；作者实验中存在超预算，不能宣称普遍减少 token。

> **思考**：从宿主已有事实恢复比模型重写计划更易追溯；恢复正确也不等于任务产出质量提升。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：native-continuity 从会话事件折叠计划、当回合 Todo 和最近委派结果；完整 Lattice 另有契约与行动依据控制。

机械执行凭证不冒充语义完成、负面实验保留门槛值得借鉴；宿主事件与权限耦合较深。

<a id="detail-section-4"></a>

## 4 使用建议

先对照原生行为测试压缩和重启恢复，再单独评估显式完整控制，避免将两模式效果混为一谈。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本检出为未发布 rc.8 工作，作者保留多次负面/超预算试验；不能把机制压力测试推广为编码收益。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用相同任务和预算对照原生，覆盖压缩、冷恢复、委派与中断，预注册质量和成本门槛。

**分析版本**

固定提交 [ea4d4f7](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)

<details>
<summary>工程统计与口径</summary>

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

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1052326311/dsh-plan-lattice/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
