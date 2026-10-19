# DSH Verification Receipt

> 在每轮会话结束后生成隐私最小化的工具活动与验证信号摘要，并保存为本地 JSONL 收据。

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) · [![npm 30d 908](https://img.shields.io/static/v1?label=npm+30d&message=908&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/commits)
<!-- END META -->

## 版本

固定提交 [87f3fb0198090f0f26a37a52840db150609db748](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)

## 采用点评

- **用途**：开发者需要快速发现代理似乎没做验证的回合；合格结果是摘要与原始事件一致、不会把回显文本当验收结论。基线是查看工具日志和真实测试报告。
- **亮点**：在每轮会话结束后生成隐私最小化的工具活动与验证信号摘要，并保存为本地 JSONL 收据。
- **思考**：不新增模型调用，增加每轮事件投影、哈希和异步磁盘写入；长期有文件保留与分析成本。首次需确认宿主窄版本支持，升级迁移需重验事件结构。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合排查“这一轮记录了什么”的开发者试用，不能替代 CI、测试产物或审计放行。

## 场景、原有办法与合格交付

目标场景是：开发者需要快速发现代理似乎没做验证的回合；合格结果是摘要与原始事件一致、不会把回显文本当验收结论。基线是查看工具日志和真实测试报告。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-verification-receipt@0.1.1`。
- 声明依赖：`@deepseek-ai/schemastery`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-session`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 5 | 482 | — | — | — | 4515 |
| source | .mjs | 2 | 131 | 124 | 0 | 7 | — |
| source | .ts | 3 | 424 | 327 | 56 | 41 | — |
| test | .ts | 3 | 391 | 361 | 0 | 30 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **事件监听**：session/event

- events：`session/event`（[src/index.ts:95](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L95)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 13 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 3 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts)。


src/index.ts 在 session/event 的 turn/end 回调 snapshotEvents，交给 receipt.ts 做该轮投影；工具名称／command词法分类测试、lint、build等。JSONL writer 用 promise链串行追加，dispose 时先关gate、取消监听再drain。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 2／已关闭 0 · 近30天：新建 0／关闭 0／更新 暂未获取

统计日期：2026-10-19。
