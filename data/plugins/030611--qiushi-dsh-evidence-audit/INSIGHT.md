# Qiushi DSH Evidence Audit

> 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) · [![npm 30d 1208](https://img.shields.io/static/v1?label=npm+30d&message=1%2C208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/commits)
<!-- END META -->

## 版本

固定提交 [94fae130b2845309e1dcabac14696fddb18f8f3a](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

## 用途与采用点评

- **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。
- **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。
- **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。
- **建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

## 场景与替代办法

需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。

常规审计日志可解释性更强但保留更多敏感内容；本插件选择最小明文暴露的另一取舍。

## 依赖与流程

依赖 Node 文件系统、Cordis 与 tools/result、session/event 契约，哈希材料需持续保存。

后台观察追加，异常时检查链验证错误与写盘情况；恢复前保留损坏文件供核对。

## 成本与效果

无需额外模型，但需保存链文件、检查完整性和处理损坏；没有恢复时间实测。

不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4cf91c80b937c0b128144cc45e02e428f85fcfacab4bbfd808e029529a551e8f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 323 | — | — | 4549 |
| .mjs | source | 5 | 212 | 196 | 0 | — |
| .ts | source | 4 | 481 | 404 | 35 | — |
| .ts | test | 5 | 467 | 428 | 0 | — |
| .mjs | example | 1 | 27 | 24 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **事件监听**：观察 tools/result 与 session/event 并写入证据链。

## 工程亮点

打开文件前校验已有链并维护链头值得借鉴；跨进程并发与可信时间仍需独立设计。

## 分发与兼容

包版本 0.1.0，主入口是 lib，源码为 TypeScript；发布产物一致性与真实宿主未验收。

## 历史对照

前次代码指纹为 94fae130b2845309e1dcabac14696fddb18f8f3a；本轮固定为 94fae130b2845309e1dcabac14696fddb18f8f3a。常规审计日志可解释性更强但保留更多敏感内容；本插件选择最小明文暴露的另一取舍。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：哈希链只检查已观察数据的连续性，不证明观察源真实、覆盖完整或业务结论成立。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在副本中删行、改字段和重启追加，核对链检查；另测试遗漏事件不能被误说成完整执行证明。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
