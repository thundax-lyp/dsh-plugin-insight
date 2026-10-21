# dsh-msg-hub

> 把微信、QQ、飞书消息接到 DSH 会话，并提供主动推送与远程审批。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[0fd11c3](https://github.com/AbcdefgXW/dsh-msg-hub/tree/0fd11c38fa21d5639ea53f067a221d8ff7d8675c)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) · [![npm 30d 1207](https://img.shields.io/static/v1?label=npm+30d&message=1%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)
<!-- END META -->

**使用建议**：可先作为渠道桥源码候选；当前远程批准归属不足，不建议让它承担真实高影响工具的批准。消息通知与授权执行应分别评估。

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

- **用途**：离开电脑的操作者从IM发任务、收结果并处理绑定会话的审批；交付物是渠道消息与可关联的Agent结果，必须保留批准人的身份和具体请求归属。

- **建议**：每次审批加入一次性挑战码并绑定request ID、channel、peer、session、操作摘要与到期时间，可能避免串审批。用两个peer两请求交叉答复、过期/重放和未绑定peer答复案例，要求仅匹配请求可一次结算；若平台身份不能可靠绑定，应保留原宿主审批而只做通知。

可先作为渠道桥源码候选；当前远程批准归属不足，不建议让它承担真实高影响工具的批准。消息通知与授权执行应分别评估。

核查状态：会话桥、推送与远程审批路径源码可确认；平台可用性、端到端消息可靠性及审批授权未实测。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

单渠道机器人或手动回Web审批；本项统一三渠道与可调用推送服务，但不能牺牲逐请求授权。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：渠道入站与approval/request/Agent状态桥接。
- **后台**：三渠道连接、会话队列与dsh-channels-push服务，含远程审批等待。

**流程与依赖**

入口启动三渠道适配器并将消息先交remote命令处理，再送bridge；bridge按channel+peer映射稳定session ID，串行队列复用/恢复/创建Agent。push服务供其他插件主动发消息或唤醒任务，remote持久化绑定并把approval/request推送给绑定peer，等待答复或五分钟拒绝。

DSH agents/sessions/默认模型、微信/QQ/飞书凭证与网络；图片文件系统、语音ASR及转码依赖按渠道启用，非零外部成本。

平台入站→remote命令/审批优先→普通消息进入channel-peer会话→Agent回传；外部插件push/task复用适配器；绑定审批请求发IM→首个匹配词结算pending→超时拒绝。

MIT Node插件，需渠道凭证/微信登录，含协议与打包产物；Node>=22.13，平台账号能力与第三方上游归属另行管理。

**效果与成本**

现金是宿主模型、可选ASR及渠道/网络服务；人工是账号开通、密钥轮换、平台协议维护、消息失败与审批核对。媒体/日志保存与轮转另占磁盘，处理敏感命令推送需明确数据去向。

远程发任务和统一推送可能缩短等待；结果正确性、送达与授权真实性仍需端到端证据。

- **思考**：“批准”是否绑定到收到该请求的那个人和那次调用？remote.pending只存resolve/timer，不存session或peer；handleCommand收到任何匹配文本就取pending第一个resolve，没有检查channel/peer/session/callId。多个会话并发或无关peer发yes都可能批准错误请求，五分钟拒绝不能弥补归属缺失。/bind也直接持久化输入sid，未在此路径见所有者验证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把不同IM接入、稳定会话和可复用push/task服务合在一个桥，使其他定时插件也能复用消息回传；相较每渠道独立机器人减少会话管理重复。渠道协议与上游vendored代码不算全仓原创；远程审批新增业务控制入口，其正确性不能由消息收发成功推定。

把不同IM接入、稳定会话和可复用push/task服务合在一个桥，使其他定时插件也能复用消息回传；相较每渠道独立机器人减少会话管理重复。渠道协议与上游vendored代码不算全仓原创；远程审批新增业务控制入口，其正确性不能由消息收发成功推定。

bridge按session串行、复用live Agent避免重复create，媒体与日志有生命周期策略；remote错误超时拒绝是有益默认，但pending关联键和应答归属不充分是主要实现缺口。

固定源码依据：[index.js](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/index.js)、[lib/bridge.js](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/bridge.js)、[lib/remote.js](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/lib/remote.js)、[package.json](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/package.json)、[cordis.patch.yml](https://github.com/AbcdefgXW/dsh-msg-hub/blob/0fd11c38fa21d5639ea53f067a221d8ff7d8675c/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

“批准”是否绑定到收到该请求的那个人和那次调用？remote.pending只存resolve/timer，不存session或peer；handleCommand收到任何匹配文本就取pending第一个resolve，没有检查channel/peer/session/callId。多个会话并发或无关peer发yes都可能批准错误请求，五分钟拒绝不能弥补归属缺失。/bind也直接持久化输入sid，未在此路径见所有者验证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.11；版本日期：2026-09-19（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[0fd11c38](https://github.com/AbcdefgXW/dsh-msg-hub/tree/0fd11c38fa21d5639ea53f067a221d8ff7d8675c)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根入口、bridge会话生命周期、remote绑定/审批核心路径及README；未逐行审计所有媒体协议或vendored微信实现，不把作者全渠道支持当真实运行证明。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

每次审批加入一次性挑战码并绑定request ID、channel、peer、session、操作摘要与到期时间，可能避免串审批。用两个peer两请求交叉答复、过期/重放和未绑定peer答复案例，要求仅匹配请求可一次结算；若平台身份不能可靠绑定，应保留原宿主审批而只做通知。

本轮未发送IM消息、登录账号或触发审批；提出隔离桩测试并发/交叉peer/重放，真实渠道可靠性和媒体隐私另需验证。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 19 | 2940 | 2252 | 542 | — |
| .ts | source | 9 | 1892 | 1403 | 304 | — |
| .md | source | 2 | 322 | — | — | 2816 |
| .mjs | source | 5 | 449 | 344 | 75 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A17.143Z..2026-10-21T05%3A34%3A17.143Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A34%3A17.143Z..2026-10-21T05%3A34%3A17.143Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
