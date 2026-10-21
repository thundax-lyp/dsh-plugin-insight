# dsh-awiki

> 把AWiki身份、设备加入/恢复、消息和邮件接入DSH，区分Host管理与模型可用操作。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[60db12b](https://github.com/AgentConnect/dsh-awiki/tree/60db12b72181668b8ea1a270bddb279bb0f50ed7)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,584](https://img.shields.io/static/v1?label=npm+30d&message=1%2C584&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![首次发布 2026-08-17](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)
<!-- END META -->

**使用建议**：适合已有AWiki体系者在测试身份验证设备撤销与发送审批。恢复、转移和清本地数据须按明确操作边界验收后再用于重要身份。

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

- **用途**：Agent需以稳定身份参与通信，设备丢失/切换仍可明确账户和消息归属；必须将发送和身份控制区分。

- **建议**：由Host lease与可见操作分离推导，可为恢复/发送提供跨层收据，绑定身份代次、设备和请求结果，遇未知结果只核查不重放。未验证；丢响应、撤设备、切身份时应不会由旧会话继续签发或重复发送。

适合已有AWiki体系者在测试身份验证设备撤销与发送审批。恢复、转移和清本地数据须按明确操作边界验收后再用于重要身份。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

独立AWiki客户端可通信，插件使Agent共享身份但必须额外治理机器发送及恢复权限。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：AWiki消息/邮件读取与申请发送。
- **界面**：身份、设备、恢复及收件管理。
- **后台**：Core连接与身份状态服务。
- **事件监听**：发送等变更的pre-execute ask。

**流程与依赖**

DSH服务/tools/Remote与客户端，ANP Identity、AWiki IM Core SDK/租户网络、文件数据库；部分管理动作依赖原生系统认证。

取得Host身份lease→Core建立/加入身份→接收消息→Agent读或申请发送；设备与恢复由前台管理流程，注销保留本地身份以恢复。

**效果与成本**

账户验证、设备加入和持久状态首次配置；持续消息网络、磁盘/缓存、身份备份与恢复运维成本，未有独立采用收益。

将通信与身份管理接入任务界面，潜在减少切换；网络服务和恢复运维使采用成本显著。

- **思考**：界面确认是否覆盖所有身份与外部写入？工具层ask是可读证据，但真实宿主策略与Core的租约、设备撤销/恢复一致性未验证；大量本地状态和网络边界不能凭测试目录认定端到端成功。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：增量是身份/设备/恢复和DSH Agent生命周期的边界整合，不只是消息转发。DID密钥与文档归独立ANP Identity，协议与数据库/恢复实现大量来自IM Core。

增量是身份/设备/恢复和DSH Agent生命周期的边界整合，不只是消息转发。DID密钥与文档归独立ANP Identity，协议与数据库/恢复实现大量来自IM Core。

Host-only lease、脱敏固定错误、可重放体限制与发送ask钩子有清晰边界；SDK/Core与宿主确认仍需联合验收。 源码依据：[src/index.ts](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/src/index.ts)、[src/provider.ts](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/src/provider.ts)、[src/tools.ts](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/src/tools.ts)、[src/external-http-auth.ts](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/src/external-http-auth.ts)、[src/settings-rpc.ts](https://github.com/AgentConnect/dsh-awiki/blob/60db12b72181668b8ea1a270bddb279bb0f50ed7/src/settings-rpc.ts)。

<a id="detail-section-5"></a>

### 主要限制

界面确认是否覆盖所有身份与外部写入？工具层ask是可读证据，但真实宿主策略与Core的租约、设备撤销/恢复一致性未验证；大量本地状态和网络边界不能凭测试目录认定端到端成功。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AgentConnect/dsh-awiki](https://github.com/AgentConnect/dsh-awiki)
- **版本号**：0.3.18（[固定提交 60db12b7](https://github.com/AgentConnect/dsh-awiki/tree/60db12b72181668b8ea1a270bddb279bb0f50ed7)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/provider.ts、src/tools.ts、src/external-http-auth.ts、src/settings-rpc.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/provider.ts、src/tools.ts、src/external-http-auth.ts、src/settings-rpc.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：测试身份切换/撤销竞态、丢响应恢复、重复发送、邮件标读审批和Host密钥不可出Remote；不对真实联系人发消息。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由Host lease与可见操作分离推导，可为恢复/发送提供跨层收据，绑定身份代次、设备和请求结果，遇未知结果只核查不重放。未验证；丢响应、撤设备、切身份时应不会由旧会话继续签发或重复发送。

测试身份切换/撤销竞态、丢响应恢复、重复发送、邮件标读审批和Host密钥不可出Remote；不对真实联系人发消息。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：431a29da652702272f821825842f47369a04db1ce0a2dd5a2610f8987c51eb0d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 3753 | — | — | 54860 |
| .js | source | 99 | 70466 | 67949 | 2945 | — |
| .mjs | source | 21 | 3045 | 2903 | 55 | — |
| .tsx | source | 22 | 6863 | 6423 | 72 | — |
| .ts | source | 73 | 20845 | 18413 | 1061 | — |
| .tsx | test | 20 | 6368 | 5817 | 54 | — |
| .ts | test | 102 | 21558 | 19925 | 361 | — |
| .mjs | test | 3 | 231 | 223 | 3 | — |
| .ts | example | 10 | 2536 | 2385 | 33 | — |
| .md | test | 1 | 7 | — | — | 266 |

排除 94 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AgentConnect/dsh-awiki/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
