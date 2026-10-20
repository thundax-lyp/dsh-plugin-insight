# Qiushi Evidence Audit

> 被动观察 DSH 会话事件与工具结果，将内容摘要写入本地哈希链收据，供后续核对。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1241](https://img.shields.io/static/v1?label=npm+30d&message=1%2C241&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/commits)
<!-- END META -->

## 版本

固定提交 [94fae130b2845309e1dcabac14696fddb18f8f3a](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

## 采用点评

- **用途**：操作者需要核对一批已保存事件或工具结果是否与收据一致。合格结果是能发现未重算链的改动并解释检测不了的情形；基线是原始日志加独立签名／外部存证，而非靠本地哈希满足可信审计。
- **亮点**：被动观察 DSH 会话事件与工具结果，将内容摘要写入本地哈希链收据，供后续核对。
- **思考**：每次观察做规范化、SHA-256和同步I/O，启动校验随历史文件长度增长；需要日志轮转与外部锚点运维。无额外模型调用，但全量内容哈希仍有CPU和磁盘成本，未实测延迟。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合单进程、私有目录内的取证流程试验；有合规或多进程诉求时先补外部锚定与写入协调。

## 场景、原有办法与合格交付

目标场景是：操作者需要核对一批已保存事件或工具结果是否与收据一致。合格结果是能发现未重算链的改动并解释检测不了的情形；基线是原始日志加独立签名／外部存证，而非靠本地哈希满足可信审计。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`qiushi-dsh-evidence-audit@0.1.0`。
- 声明依赖：`@deepseek-ai/schemastery`、`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 4 | 323 | — | — | — | 4549 |
| source | .mjs | 5 | 212 | 196 | 0 | 16 | — |
| source | .ts | 4 | 481 | 404 | 35 | 42 | — |
| test | .ts | 5 | 467 | 428 | 0 | 39 | — |
| example | .mjs | 1 | 27 | 24 | 0 | 3 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **事件监听**：session/event、tools/result

- events：`session/event`（[src/index.ts:166](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L166)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`tools/result`（[src/index.ts:169](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L169)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 19 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 2 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts)。


src/index.ts 分别观察 session/event 和 tools/result，将标识／参数／结果转为哈希；receipt.ts 做规范化JSON、序号／前链hash和同步追加。启动先验证既有文件，运行追加失败隔离于主事件流程。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 0 · 近30天：新建 0／关闭 0／更新 暂未获取

统计日期：2026-10-19。
