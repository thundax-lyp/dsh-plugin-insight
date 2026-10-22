# messaging-core

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f1c3399](https://github.com/534119219/dsh-messaging/tree/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/534119219/dsh-messaging)
<!-- END META -->

> **实现功能**：将多种消息渠道接入 DSH，统一授权、聊天会话映射、命令与回复路由。

> **核心亮点**：相对逐平台各部署Agent机器人，贡献是把授权、会话生命周期、工作区和流式回复做成DSH共享核心，并将平台差异放入适配器。README明确归属hermes-agent消息体系移植，协议与交互语义不应算作原创；增量是DSH agents/sessions/settings接线及单插件配置。

> **风险与缺陷**：统一核心是否意味着所有渠道都有相同可靠性与隔离？白名单主要核对平台userId，平台适配器负责身份真实性；群聊仍按chatKey映射会话，授权用户间上下文可能共享。session-map直接writeFileSync且写失败只warn，外发buffer/消息ID在内存，进程故障可能丢映射或重复/漏回复；27个导入不能替代每平台的签名、重连与送达验证。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、流程与依赖](#detail-section-3)
  - [1.3 效果、成本与限制](#detail-section-4)
  - [1.4 核心贡献与工程亮点](#detail-section-5)
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

希望从已有即时通讯客户端访问自用DSH的人，将平台聊天映射到会话并接收模型回复；接入人须设置用户白名单与本机工作区权限。

参照hermes-agent消息体系与逐平台机器人；本次仅检查移植归属与DSH增量，不对上游现版本做比较实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

packages/messaging-core/lib/index.js注册适配器并在handleInbound核对allowAll/allowedUsers，再处理命令和Agent followup/steer；session-map持久化chat/session历史，outbound订阅事件按能力流式编辑或分段发送。

- **模型工具**：send_message与messaging_status定义。
- **用户命令**：渠道内new/resume/title/status/stop/compress。
- **事件监听**：session/event到平台出站路由。
- **Host 路由**：消息配置/状态与共享Webhook监听。
- **界面**：平台配置与连接入口。
- **后台**：适配器注册、授权和聊天会话管理。

DSH agents/sessions/settings/tools与各平台SDK/凭据，部分平台Webhook需可达监听；每平台工作区目录只组织任务，不构成完整权限沙箱。

平台适配器归一事件→核心白名单→命令或chat/session映射→创建恢复Agent→运行中steer否则followup→session/event收集→流式预览/最终分段回渠道；故障结果需逐平台追踪。

packages/messaging-core子包，依赖多个平台SDK与DSH rc接口；root README给出file:子包安装，不能视为根仓库bundle直接可装。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少换客户端和逐平台配置Agent的工作，但聊天可达不等于任务获授权或交付可靠；收益受平台协议与故障恢复约束。

首次逐平台申请机器人/凭据、白名单与网络；持续承担SDK更新、重连、日志、模型调用和重复消息复核。现金按模型/平台，人工移植维护未测，单插件不等于低维护。

统一核心是否意味着所有渠道都有相同可靠性与隔离？白名单主要核对平台userId，平台适配器负责身份真实性；群聊仍按chatKey映射会话，授权用户间上下文可能共享。session-map直接writeFileSync且写失败只warn，外发buffer/消息ID在内存，进程故障可能丢映射或重复/漏回复；27个导入不能替代每平台的签名、重连与送达验证。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对逐平台各部署Agent机器人，贡献是把授权、会话生命周期、工作区和流式回复做成DSH共享核心，并将平台差异放入适配器。README明确归属hermes-agent消息体系移植，协议与交互语义不应算作原创；增量是DSH agents/sessions/settings接线及单插件配置。

平台配置目录共用、核心授权在命令前执行、按capability路由回复且长文最终分段而非简单截断值得借鉴；映射直写和内存出站状态是提升恢复可靠性前的重点。

源码依据：[packages/messaging-core/lib/index.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/index.js)、[packages/messaging-core/lib/session-map.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/session-map.js)、[packages/messaging-core/lib/agents.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/agents.js)、[packages/messaging-core/lib/outbound.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/outbound.js)、[packages/messaging-core/lib/tools.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/tools.js)、[packages/messaging-core/lib/platforms/telegram.js](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/platforms/telegram.js)、[packages/messaging-core/package.json](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/package.json)、[NOTICE](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/NOTICE)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：希望从已有即时通讯客户端访问自用DSH的人，将平台聊天映射到会话并接收模型回复；接入人须设置用户白名单与本机工作区权限。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：send_message与messaging_status定义。
- **用户命令**：渠道内new/resume/title/status/stop/compress。
- **事件监听**：session/event到平台出站路由。
- **Host 路由**：消息配置/状态与共享Webhook监听。
- **界面**：平台配置与连接入口。
- **后台**：适配器注册、授权和聊天会话管理。

> **思考**：统一核心是否意味着所有渠道都有相同可靠性与隔离？白名单主要核对平台userId，平台适配器负责身份真实性；群聊仍按chatKey映射会话，授权用户间上下文可能共享。session-map直接writeFileSync且写失败只warn，外发buffer/消息ID在内存，进程故障可能丢映射或重复/漏回复；27个导入不能替代每平台的签名、重连与送达验证。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对逐平台各部署Agent机器人，贡献是把授权、会话生命周期、工作区和流式回复做成DSH共享核心，并将平台差异放入适配器。README明确归属hermes-agent消息体系移植，协议与交互语义不应算作原创；增量是DSH agents/sessions/settings接线及单插件配置。

<a id="detail-section-9"></a>

### 1.8 使用建议

已有机器人接入经验的人可先用一个平台的私人聊天测试；固定版本、收紧白名单，核对重连和长消息，再开放群聊，群成员的共享上下文要提前明确。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认统一适配器、授权和双向会话路由；作者27渠道是实现目录范围，不等于本轮验证27平台连通。未来投递账本为未验证假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.0；版本日期：2026-08-17（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[f1c3399e](https://github.com/534119219/dsh-messaging/tree/f1c3399ef40e3f419161d153e997d6f30576a627)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读核心授权、会话映射、Agent接线、出站路由、工具及Telegram代表适配器；未实连任何平台，其他平台只核对注册/配置范围。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：packages/messaging-core；内容摘要：39b69573102d44f9bc29c5c7525ebbc7e3fade4c2b8cd31145f620c8216e0583。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 39 | 9547 | 7882 | 1047 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：以平台事件ID建立持久收件箱/发件箱，并将映射更新与待回复状态做可恢复提交，可让跨渠道重连后按同一任务身份去重。依据是当前共享sessionMap与内存出站状态之间的缺口，当前未实现。用重复Webhook、外发成功后断线和会话映射写失败三类对照，量化重复执行/回复与恢复时间；无平台幂等键时保留未知结果，不能无条件重放。

隔离单平台验证未授权/群聊共享、重复事件、重连、长消息格式、映射写失败和跨重启；其他平台需分别验收，本轮未发送消息。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/534119219/dsh-messaging/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
