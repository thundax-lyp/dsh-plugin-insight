# dsh-feishu-bot

> 通过飞书应用机器人长连接操作 DSH 项目与会话，支持扫码绑定、审批与完成通知。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[f4d5216](https://github.com/452926826/dsh-feishu-bot/tree/f4d521615a9ca7ff7cbe2953a2a84074a7768091)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot) · [![npm 30d 919](https://img.shields.io/static/v1?label=npm+30d&message=919&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot)
<!-- END META -->

**使用建议**：远程控制需求明确时在专用profile试用，先固定允许chat、验证拒绝/取消/断连恢复；普通消息具有该DSH profile的实际权限。

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

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：需要离开本机仍在飞书发起或接续DSH任务的个人/团队用户，交付是宿主会话最终回复与审批回路。

采用建议：远程控制需求明确时在专用profile试用，先固定允许chat、验证拒绝/取消/断连恢复；普通消息具有该DSH profile的实际权限。

参照本机GUI或简单IM转发；此项目把身份接入、会话选择和审批串成远程流程，不能自动扩大授权。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **用户命令**：飞书/lp、/up、/np、/lc、/uc、/nc、/approve、/reject
- **后台**：飞书长连接、chat会话选择与审批桥接
- **Host 路由**：飞书绑定状态接口

**流程与依赖**

必要为飞书应用账号与权限、SDK长连接、宿主agents/sessions/approval与持久化；扫码owner权限和手工凭据路径不同。

扫码或读凭据→建立WS→白名单过滤→chat选择会话→提交消息→必要时同chat审批→最终回复与通知；停用abort并断连。

**效果与成本**

首次需租户建应用权限、扫码发布及白名单；持续飞书网络和DSH模型调用费用、断连排查与凭据轮换成本，人工审批时间另计。

免公开回调地址降低接入配置负担，移动审批有流程价值；安全授权、通知可靠性与办结率未本轮实测。

- **思考**：远程入口是否保持正确授权与任务上下文？审批绑定发起chat是强支持；同一chat多个待审只能有一个，其他回退next。手工凭据未含扫码owner时默认允许集合可能为空，必须检查实际白名单；状态写队列在一次persist拒绝后未catch，后续then可能继续拒绝，恢复需另验。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对只转发聊天文本，贡献为扫码建应用、持久化chat上下文和同源chat审批闭环；复用飞书Device Grant和SDK，不把这些上游能力算原创。

相对只转发聊天文本，贡献为扫码建应用、持久化chat上下文和同源chat审批闭环；复用飞书Device Grant和SDK，不把这些上游能力算原创。

审批发送失败返回undefined交给其他通道，abort清理pending；选择状态按chat隔离并临时文件rename，写队列缺失败恢复需检验。 [固定源码](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/src/index.ts#L1)。

<a id="detail-section-5"></a>

### 主要限制

[核查分支](https://github.com/452926826/dsh-feishu-bot/blob/f4d521615a9ca7ff7cbe2953a2a84074a7768091/src/state.ts#L23)。

远程入口是否保持正确授权与任务上下文？审批绑定发起chat是强支持；同一chat多个待审只能有一个，其他回退next。手工凭据未含扫码owner时默认允许集合可能为空，必须检查实际白名单；状态写队列在一次persist拒绝后未catch，后续then可能继续拒绝，恢复需另验。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/approval.ts、src/controller.ts、src/state.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：两个chat并发选择不同项目，注入一次state写盘失败并发起两个审批；核对后续状态可保存且只有发起chat批准匹配操作，否则否定假设。

**分析版本**

- **仓库**：[452926826/dsh-feishu-bot](https://github.com/452926826/dsh-feishu-bot)
- **版本号**：0.1.4（[固定提交 f4d52161](https://github.com/452926826/dsh-feishu-bot/tree/f4d521615a9ca7ff7cbe2953a2a84074a7768091)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将chat选择版本与任务审批ID绑定，并让持久化队列从单次失败恢复，可减少并发会话串线和故障后的长期不可写；新增状态机与过期审批处理。

两个chat并发选择不同项目，注入一次state写盘失败并发起两个审批；核对后续状态可保存且只有发起chat批准匹配操作，否则否定假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 535 | — | — | 7372 |
| .js | source | 11 | 1192 | 1174 | 10 | — |
| .mjs | source | 3 | 80 | 72 | 0 | — |
| .ts | source | 9 | 1218 | 1105 | 1 | — |
| .js | test | 10 | 560 | 509 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/452926826/dsh-feishu-bot/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
