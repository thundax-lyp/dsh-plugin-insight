# dsh-wsl-im

> 把多种即时通信平台接入DSH Agent，支持按聊天会话转发消息与媒体。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c36e7cc](https://github.com/173787247/dsh-wsl-im/tree/c36e7cc4ae651756c7d81ff100401de10c10440a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-im)
<!-- END META -->

**使用建议**：先限制允许用户并在测试群核查共享上下文，确认停止插件后连接和会话被回收。

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

已有贡献：源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：用户希望从已有IM入口驱动本地Agent，并把回复送回原聊天。

- **建议**：待验证假设：把发送者权限与会话共享策略显式组合，可以降低群聊中的越界继承；与默认按用户隔离相比需衡量协作损失。

采用建议：先限制允许用户并在测试群核查共享上下文，确认停止插件后连接和会话被回收。

人工复制消息或已有IM桥接；本插件减少入口搬运，但增加身份、会话与媒体生命周期维护。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：im_status：桥接状态查询。
- **后台**：IM适配器监听、按聊天会话排队与回复转发。

**流程与依赖**

依赖各平台凭据与适配器、DSH agents及模型、网络连接；语音转写还依赖本地ASR。

先配置平台和允许用户，启用requireAllowlist，在私人测试聊天验证回复与reset，再评估群聊。

**效果与成本**

持续模型调用、平台连接、媒体落盘及ASR带来现金或算力成本；跨平台配置和恢复需要人工。

源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。 isAllowed在平台allowedUserIds为空时允许所有用户；requireAllowlist只阻止缺少允许列表的已启用真实适配器启动，mock例外。同一platform/chatId共享Agent上下文，授权用户之间不按userId隔离。

- **思考**：isAllowed在平台allowedUserIds为空时允许所有用户；requireAllowlist只阻止缺少允许列表的已启用真实适配器启动，mock例外。同一platform/chatId共享Agent上下文，授权用户之间不按userId隔离。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。

源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。

入站适配、会话队列与出站格式分离可复用；进程内chats与pending映射不等于持久消息幂等。

<a id="detail-section-5"></a>

### 主要限制

isAllowed在平台allowedUserIds为空时允许所有用户；requireAllowlist只阻止缺少允许列表的已启用真实适配器启动，mock例外。同一platform/chatId共享Agent上下文，授权用户之间不按userId隔离。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/bridge.js、lib/config.js、lib/inbound-media.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读桥接核心、配置和入口；未逐个平台审计适配器，未发送消息或运行ASR。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：用两个授权用户、一个未授权用户和同群并发消息，检查会话归属、阻断、重启恢复与重复投递；若隔离收益不足不扩大协议。

**分析版本**

- **仓库**：[173787247/dsh-wsl-im](https://github.com/173787247/dsh-wsl-im)
- **版本号**：0.3.8（[固定提交 c36e7cc](https://github.com/173787247/dsh-wsl-im/tree/c36e7cc4ae651756c7d81ff100401de10c10440a)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把发送者权限与会话共享策略显式组合，可以降低群聊中的越界继承；与默认按用户隔离相比需衡量协作损失。

用两个授权用户、一个未授权用户和同群并发消息，检查会话归属、阻断、重启恢复与重复投递；若隔离收益不足不扩大协议。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 369 | — | — | 2838 |
| .js | source | 22 | 4203 | 3681 | 259 | — |
| .js | test | 1 | 482 | 460 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-im/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
