# dsh-gotify-notify

> 将DSH轮次结束和部分等待用户输入事件推送至Gotify，并提供原因过滤、优先级与凭据设置。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6fe1631](https://github.com/AhYi8/dsh-gotify-notify/tree/6fe16310caa4233bb09086cd76c8dfb4b3e871c7)

<!-- BEGIN META -->
[![npm 30d 398](https://img.shields.io/static/v1?label=npm+30d&message=398&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify) [![首次发布 2026-10-10](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify)
<!-- END META -->

**使用建议**：先确认Gotify目的地址与正文，再用测试通知和测试会话验证；勿依靠它接收权限审批或判业务完成。

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

- **用途**：用户离开DSH窗口仍需知道何时查看结果或回答问题，成功推送不等于人已读或任务验收。

- **建议**：由发送前去重取舍推导，可区分待发送/已接受/已读，并用有界持久outbox提供可见重试。未验证；网络断开/恢复、宿主重启后对同事件测漏重报和端侧可见次数。

先确认Gotify目的地址与正文，再用测试通知和测试会话验证；勿依靠它接收权限审批或判业务完成。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

桌面通知不需远端服务但离机不可达；Gotify提供跨设备通道而增加外部数据路径。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：会话结束与特定提问调用通知。
- **界面**：配置与发送测试通知。
- **Host 路由**：测试通知接口。

**流程与依赖**

DSH session/event与可选凭据/webServer、Gotify HTTP服务和接收客户端；口令换应用token会创建/复用远端应用。

解析已保存配置与凭据，获取Gotify应用token，监听事件套模板推送；失败记录日志，测试接口另做同源/回环检查。

**效果与成本**

首次服务器与凭据设置，持续网络/通知噪声和服务运维；无模型费但未测省等待时间。

可能减少盯屏，受通知渠道可靠性和告警疲劳限制。

- **思考**：等待输入是否可靠送达？问题在发送前登记去重，失败仍不再推同一调用，重启/500上限清空又可重复；turn/end未见同类去重。默认服务地址和正文含会话标题/目录需用户核对数据去向。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对单一完成通知，增量是用户介入提问和结束原因分流，复用DSH凭据引用与Gotify分发。并未覆盖宿主权限审批或建立送达确认。

相对单一完成通知，增量是用户介入提问和结束原因分流，复用DSH凭据引用与Gotify分发。并未覆盖宿主权限审批或建立送达确认。

服务器绑定token缓存、固定脱敏错误码与可热改过滤有用；去重只在内存且先于发送，应明确尽力通知语义。 源码依据：[lib/index.js](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js)、[client/client.js](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/client/client.js)。

<a id="detail-section-5"></a>

### 主要限制

等待输入是否可靠送达？问题在发送前登记去重，失败仍不再推同一调用，重启/500上限清空又可重复；turn/end未见同类去重。默认服务地址和正文含会话标题/目录需用户核对数据去向。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AhYi8/dsh-gotify-notify](https://github.com/AhYi8/dsh-gotify-notify)
- **版本号**：2.4.0（[固定提交 6fe16310](https://github.com/AhYi8/dsh-gotify-notify/tree/6fe16310caa4233bb09086cd76c8dfb4b3e871c7)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、client/client.js；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：测试子Agent、原因过滤、重复问题、推送失败后恢复、服务器切换与无凭据；核对正文最小化和真实设备接收。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由发送前去重取舍推导，可区分待发送/已接受/已读，并用有界持久outbox提供可见重试。未验证；网络断开/恢复、宿主重启后对同事件测漏重报和端侧可见次数。

测试子Agent、原因过滤、重复问题、推送失败后恢复、服务器切换与无凭据；核对正文最小化和真实设备接收。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：6285aa39cab5674ff5ee3d1912e430603208339a7dd99e054851f9d4fcd4dd31。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1598 | 1044 | 457 | — |
| .md | source | 1 | 179 | — | — | 2656 |
| .mjs | source | 3 | 1350 | 1091 | 203 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AhYi8/dsh-gotify-notify/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
