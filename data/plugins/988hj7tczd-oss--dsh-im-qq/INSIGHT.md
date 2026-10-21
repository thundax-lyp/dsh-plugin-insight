# dsh-im-qq

> 通过 QQ 官方机器人接入 DSH 会话，支持文本、命令、白名单和审批桥。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d1ae124](https://github.com/988hj7tczd-oss/dsh-im-qq/tree/d1ae12486264359f9c516bb2cf0ed5e75e811d37)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq) · [![npm 30d 293](https://img.shields.io/static/v1?label=npm+30d&message=293&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-im-qq)
<!-- END META -->

**使用建议**：熟悉QQ机器人者先用私聊沙箱和非敏感目录；收紧白名单，核对审批点击身份与never含义，再考虑群聊，不在缺身份路径使用高影响授权。

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

- **用途**：用户从QQ私聊或群@访问完整DSH Agent，交付对话回复与审批交接；本机文件/工具权限随挂载preset进入。

- **建议**：待验证假设：审批令牌绑定发起人、聊天、请求摘要及有效期，身份缺失拒绝且长期授权限能力范围，可减少群内冒批和过宽授权。由当前缺身份放行/全会话never推导，未实现。对照缺clicker、异人按钮、过期重放及群中不同用户，测错批与正常审批成功；需要平台可靠身份支持。

熟悉QQ机器人者先用私聊沙箱和非敏感目录；收紧白名单，核对审批点击身份与never含义，再考虑群聊，不在缺身份路径使用高影响授权。

核查状态：源码确认收发、ACL与审批桥；未连接QQ、发送消息或验收宿主，作者验证未复现。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照普通QQ聊天机器人和DSH Web Agent；未证明与其他IM插件同等可靠。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：QQ事件/凭据更新与session输出。
- **后台**：WS连接、会话映射和审批桥。
- **界面**：QQ配置客户端入口。

**流程与依赖**

WS归一QQ事件，经ACL/命令/会话映射创建或恢复Agent并mount preset；outbound合并分段回复，approval用pending请求桥接QQ按钮到宿主审批，凭据更新可启动。

DSH agents/presets/approval/credentials、QQ开放平台WS与API、模型及工作区；版本rc接口敏感。

收到QQ事件→ACL→命令或会话Agent→工具执行需审批→QQ按钮答复→合并/分段回复；重连/限流失败须核对原消息避免重复。

官方QQ bot需AppID/Secret、沙箱人员与公域能力；WebSocket实现，Webhook/图像/流式等规划不算当前能力。

**效果与成本**

首次申请/审核机器人和配置白名单，持续维护token、重连、限流与模型费用；人工授权核查/故障重试未量化。

让移动通讯端访问完整Agent；便利扩大控制面，不能把聊天隔离当OS权限沙箱。

- **思考**：群聊审批是否真正绑定发起人？approval.onInteraction只有initiator和clicker同时存在且不同才拒绝，任一缺失放行；“始终允许”会把整会话policy设never，并非只授权一个动作。群白名单授权群不等于所有成员都可批准高影响操作，缺身份不能作为防误伤而默认放行。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对只转发LLM文本的机器人，增量是接DSH完整preset、持久会话和原生审批链，平台无关core与QQ transport分层；QQ协议和DSH Agent能力归上游，非插件独创。

相对只转发LLM文本的机器人，增量是接DSH完整preset、持久会话和原生审批链，平台无关core与QQ transport分层；QQ协议和DSH Agent能力归上游，非插件独创。

ACL空拒绝、session工作区组织与超时审批拒绝可借鉴；审批身份须失败关闭，群会话权限变化需独立审计。

固定源码依据：[index.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js)、[core/acl.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/acl.js)、[core/approval.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/approval.js)、[core/session-map.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js)、[core/outbound.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/outbound.js)、[platform/router.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/router.js)、[platform/qqapi.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/qqapi.js)、[platform/transport/websocket.js](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/transport/websocket.js)、[package.json](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/package.json)。

<a id="detail-section-5"></a>

### 主要限制

群聊审批是否真正绑定发起人？approval.onInteraction只有initiator和clicker同时存在且不同才拒绝，任一缺失放行；“始终允许”会把整会话policy设never，并非只授权一个动作。群白名单授权群不等于所有成员都可批准高影响操作，缺身份不能作为防误伤而默认放行。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.1；版本日期：2026-08-22（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[d1ae1248](https://github.com/988hj7tczd-oss/dsh-im-qq/tree/d1ae12486264359f9c516bb2cf0ed5e75e811d37)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index、ACL、approval、session-map、outbound与QQ router/API/WS；未实连平台或验证全协议。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：审批令牌绑定发起人、聊天、请求摘要及有效期，身份缺失拒绝且长期授权限能力范围，可减少群内冒批和过宽授权。由当前缺身份放行/全会话never推导，未实现。对照缺clicker、异人按钮、过期重放及群中不同用户，测错批与正常审批成功；需要平台可靠身份支持。

隔离平台测试群/私聊ACL、缺点击身份、按钮重放、永许撤销、断线重连与分段限额；本轮不发消息。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 654 | — | — | 9475 |
| .js | source | 11 | 2147 | 1567 | 473 | — |
| .mjs | source | 1 | 345 | 279 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+created%3A2026-09-21T04%3A10%3A31.627Z..2026-10-21T04%3A10%3A31.627Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T04%3A10%3A31.627Z..2026-10-21T04%3A10%3A31.627Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
