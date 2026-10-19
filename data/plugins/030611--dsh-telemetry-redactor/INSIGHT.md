# DSH Telemetry Redactor

> 在 DSH 遥测副本导出前遮盖支持的敏感键和凭证模式，保留原始会话日志。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) · [![npm 30d 1248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor/commits)
<!-- END META -->

## 版本

固定提交 [811b0b1abf424e57045ab5a5eaa203660ca43908](https://github.com/030611/dsh-telemetry-redactor/tree/811b0b1abf424e57045ab5a5eaa203660ca43908)

## 采用点评

- **用途**：运维希望保留可观测性又降低遥测后端收到凭证的概率。合格结果是支持的假密钥在导出副本被替换、计量字段保留且原始记录不变；基线是不开遥测或后端事后清洗。
- **亮点**：在 DSH 遥测副本导出前遮盖支持的敏感键和凭证模式，保留原始会话日志。
- **思考**：不新增模型调用；每条副本同步遍历，成本随内容大小增长。首次成本是规则矩阵与出口盘点，持续成本是格式变化、监听顺序与性能回归；不在本轮编造吞吐或延迟。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合已有遥测导出的部署先做合成凭证试用，同时检查完整监听链和本地日志权限。

## 场景、原有办法与合格交付

目标场景是：运维希望保留可观测性又降低遥测后端收到凭证的概率。合格结果是支持的假密钥在导出副本被替换、计量字段保留且原始记录不变；基线是不开遥测或后端事后清洗。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-telemetry-redactor@0.1.0`。
- 声明依赖：`@deepseek-ai/schemastery`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-session-telemetry`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 8 | 393 | — | — | — | 4906 |
| source | .mjs | 4 | 110 | 102 | 0 | 8 | — |
| source | .ts | 4 | 313 | 273 | 15 | 25 | — |
| test | .ts | 3 | 408 | 363 | 3 | 45 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **事件监听**：session-telemetry/record

- events：`session-telemetry/record`（[src/index.ts:180](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts#L180)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 19 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 3 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/030611/dsh-telemetry-redactor/blob/811b0b1abf424e57045ab5a5eaa203660ca43908/src/index.ts)。


src/index.ts 通过 prepend 的 session-telemetry/record waterfall 对 next() 的结果递归复制脱敏。keyWords 拆分键名并保留 token counters；深度上限64，对循环和访问器拒绝。插件本身不启用后端，也不向模型增加提示。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 0 · 近30天：新建 0／关闭 0／更新 暂未获取

统计日期：2026-10-19。
