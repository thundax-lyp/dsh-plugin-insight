# Qiushi DSH Evidence Audit

> 监听工具结果和会话事件，生成不保存观察明文的哈希链 JSONL 证据回执。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[94fae13](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,173](https://img.shields.io/static/v1?label=npm+30d&message=1%2C173&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![首次发布 2026-08-14](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
<!-- END META -->

**使用建议**：用非敏感任务先验证链的追加、手工篡改检测和重启检查，再决定审计留存周期。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：需要排查执行记录是否缺失或被改动的本地部署者，关注观察链的一致性。

常规审计日志可解释性更强但保留更多敏感内容；本插件选择最小明文暴露的另一取舍。

## 能力与限制

- **事件监听**：观察 tools/result 与 session/event 并写入证据链。

**流程与依赖**

依赖 Node 文件系统、Cordis 与 tools/result、session/event 契约，哈希材料需持续保存。

后台观察追加，异常时检查链验证错误与写盘情况；恢复前保留损坏文件供核对。

**兼容条件**

包版本 0.1.0，主入口是 lib，源码为 TypeScript；发布产物一致性与真实宿主未验收。

**效果与成本**

无需额外模型，但需保存链文件、检查完整性和处理损坏；没有恢复时间实测。

- **思考**：不记录参数明文可减少隐私暴露，但也限制事后解释；不能把不可读哈希当成充分审计证据。

## 工程分析

- **亮点**：工具结果和事件被规范化、哈希化，再以 previousRecordHash 连接到追加记录。

打开文件前校验已有链并维护链头值得借鉴；跨进程并发与可信时间仍需独立设计。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：哈希链只检查已观察数据的连续性，不证明观察源真实、覆盖完整或业务结论成立。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在副本中删行、改字段和重启追加，核对链检查；另测试遗漏事件不能被误说成完整执行证明。

**分析版本**

固定提交 [94fae13](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 323 | — | — | 4549 |
| .mjs | source | 5 | 212 | 196 | 0 | — |
| .ts | source | 4 | 481 | 404 | 35 | — |
| .ts | test | 5 | 467 | 428 | 0 | — |
| .mjs | example | 1 | 27 | 24 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
