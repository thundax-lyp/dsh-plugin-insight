# oh-my-dsh

> 为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/commits)
<!-- END META -->

## 版本

固定提交 [f38d8a6cffca4d2beb97e3cdd53208794163b92f](https://github.com/1225Sakura/oh-my-deepseekharness/tree/f38d8a6cffca4d2beb97e3cdd53208794163b92f)

## 用途与采用点评

- **用途**：复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。
- **亮点**：入口注入协议并注册资产、命令和 MCP，team 模块维护阶段、队员身份与邮箱；实际派发与合并仍由领队模型驱动。
- **思考**：统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。
- **建议**：先验装探测与取消，再对单仓库小任务比较原生单 agent 和一条显式 team 流程。

## 场景与替代办法

复杂开发任务需要规划、委派与验证分工，用户希望复用一套宿主适配的编排约定。

原生单 agent 与有限手工委派是对照；只有复杂可拆分任务才值得增加协调层。

## 依赖与流程

依赖 DSH 核心服务、subagents、storage 与模型；MCP、代码智能和工作树路径各有失败边界。

确认模式并规划、派发、收集结果、验证和整合；停滞时先看探测与阶段状态，必要时取消接管。

## 成本与效果

多角色和多轮评审增加模型、上下文与状态维护成本，不能以并行数量推断更快更省。

统一委派与恢复数据面可降低自建成本；多代理可能放大误解、冲突和预算超支。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：9938d986c1c18f783810771a7ef3df1251b41a3b9fbd0808e8f6487f7609fa33。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 170 | 21855 | — | — | 256566 |
| .mjs | source | 17 | 2619 | 2171 | 300 | — |
| .js | source | 29 | 5996 | 4382 | 1280 | — |
| .js | test | 45 | 10002 | 8560 | 899 | — |
| .mjs | example | 1 | 83 | 74 | 5 | — |
| .mjs | test | 1 | 63 | 41 | 15 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Skill**：编排和角色资产注册。
- **后台**：能力探测、团队心跳与内置 MCP server 接入。

## 工程亮点

能力探测、降级公告、终态限制和心跳只报告不自动杀有可借鉴性；集成面大意味着持续适配负担。

## 分发与兼容

版本 0.4.9，要求较新的 DSH 服务组合，可选 AST/LSP 能力缺失时降级；不是零依赖协议包。

## 历史对照

前次代码指纹为 f38d8a6cffca4d2beb97e3cdd53208794163b92f；本轮固定为 f38d8a6cffca4d2beb97e3cdd53208794163b92f。原生单 agent 与有限手工委派是对照；只有复杂可拆分任务才值得增加协调层。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：作者报告的测试数未在本轮复跑；状态机与心跳不证明团队产出质量或自动协调收敛。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定任务和预算，测试派发失败、心跳过期、取消、冲突合并和重复恢复，核对合格交付率及总费用。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-20。
