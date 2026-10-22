# dsh-subagent-role-router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e606490](https://github.com/643048695/dsh-subagent-role-router/tree/e6064904e116910c4c1aa403d40505304653ee23)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/643048695/dsh-subagent-role-router)
<!-- END META -->

> **实现功能**：按角色为子代理分配模型候补池，提供故障切换、路由可见性及fork窗口裁剪。

> **核心亮点**：作者提供角色路由与故障切换；更具体的增量是将派发时候补工位、运行中sticky切换及可见路由结合，并通过prepareContinuable包装减少fork种子体积。相对手动指定模型，减少并行管理；轮次裁剪是上下文取舍，不是无损压缩算法。

> **风险与缺陷**：候补工位不是并发上限，全部忙时会共享最少占用路由，全部冷却也会继续派发。切掉早期完整轮次即使事件协议合法，仍可能丢失未总结目标或授权；测试通过结构不变量也不证明任务语义保留。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

替代是显式为每个子代理选模型或单一默认模型；项目增加自动分配与故障恢复，同时增加路由状态和裁剪复杂度。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js包装子代理派发，按角色候补池负载和冷却选择模型，监听request-error有限切换并注入真实路由；fork-window.js重映射最近完整轮次事件及先前摘要，无法保持引用时回退。

- **事件监听**：子代理派发、请求故障与路由上下文注入
- **界面**：候补池设置及实际路由显示
- **后台**：角色工位、冷却及fork种子窗口

Schemastery、子代理派发及agent/request-error等宿主接口；多供应商凭据独立，fork需prepareContinuable后端，团队标识影响豁免。

识别角色→候补负载/冷却选择→派发占工位→请求失败有限切换→注入并显示实际路由→完成释放；fork另构造窗口种子。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次按角色配置模型与供应商、检查故障码；持续成本含失败切换token、并发溢出、冷却和漏上下文返工，人工需查路由日志，维护受宿主内部接口影响。

有助于额度分配与路由可见性；作者体积改善不能外推业务成功率，未有独立实测。

<a id="detail-section-5"></a>

### 1.4 工程亮点

租约释放兼顾同步抛错与result promise完成；故障切换限定子代理并豁免团队。事件seq、replace及sourceEventSeqs重映射失败回退值得借鉴，但包装宿主对象带来版本耦合。

源码依据：[lib/index.js](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/index.js)、[lib/fork-window.js](https://github.com/643048695/dsh-subagent-role-router/blob/e6064904e116910c4c1aa403d40505304653ee23/lib/fork-window.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合多供应商并行子代理任务，需要区分角色、分摊额度及排查实际模型路由的开发者。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **事件监听**：子代理派发、请求故障与路由上下文注入
- **界面**：候补池设置及实际路由显示
- **后台**：角色工位、冷却及fork种子窗口

> **思考**：候补工位不是并发上限，全部忙时会共享最少占用路由，全部冷却也会继续派发。切掉早期完整轮次即使事件协议合法，仍可能丢失未总结目标或授权；测试通过结构不变量也不证明任务语义保留。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者提供角色路由与故障切换；更具体的增量是将派发时候补工位、运行中sticky切换及可见路由结合，并通过prepareContinuable包装减少fork种子体积。相对手动指定模型，减少并行管理；轮次裁剪是上下文取舍，不是无损压缩算法。

<a id="detail-section-9"></a>

### 1.8 使用建议

多模型子代理场景可先在隔离任务试。核对候补池不是排队限流，并用依赖早期信息的任务检查fork裁剪；遇到语义缺失先关闭裁剪。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[643048695/dsh-subagent-role-router](https://github.com/643048695/dsh-subagent-role-router)
- **版本号**：4.0.0（[固定提交 e6064904](https://github.com/643048695/dsh-subagent-role-router/tree/e6064904e116910c4c1aa403d40505304653ee23)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/fork-window.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：验证同时派发释放、全冷却、认证失败、无效请求不切换、团队豁免以及跨窗口工具引用和早期目标保留；本轮未运行。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：fork窗口同时保留可追溯的任务目标与未完成依赖，可在降低种子体积时减少任务偏移。对相同长会话比较完整历史、最近N轮和目标依赖窗口的启动延迟、任务成功及信息遗漏；不将未测结果计作贡献。

验证同时派发释放、全冷却、认证失败、无效请求不切换、团队豁免以及跨窗口工具引用和早期目标保留；本轮未运行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：de571bff19dc349a434f472075415e0c7ceb8e0d2a7beb44e23252f2b308d2e4。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1316 | — | — | 32758 |
| .js | source | 3 | 3729 | 2470 | 1110 | — |
| .mjs | test | 4 | 1153 | 927 | 93 | — |
| .mjs | source | 1 | 110 | 60 | 38 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/643048695/dsh-subagent-role-router/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
