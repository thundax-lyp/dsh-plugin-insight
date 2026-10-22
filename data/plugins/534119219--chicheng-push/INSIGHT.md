# chicheng-push

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[2aa2b82](https://github.com/534119219/chicheng-push/tree/2aa2b8273183bc91f4cf6d12b1f7121bbee751da)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)
<!-- END META -->

> **实现功能**：在 DSH 配置多种推送渠道，并通过进程内服务或 HTTP 接口发送通知。

> **核心亮点**：相对每个定时任务内各写Webhook脚本，贡献是集中管理DSH通知配置，用进程内服务和HTTP复用同一发送入口与每渠道错误结果。渠道实现明确参考qinglong notify，不能把成熟渠道协议算作原创；插件增量是DSH配置、服务与调用者接线。

> **风险与缺陷**：返回ok是否等于用户可靠收到？sender多以HTTP和渠道业务码判断接受，并无统一送达回执或持久重试；串行多渠道可能累积12秒超时。publicChannel返回完整config，令牌还明文存channels.json，fence信任边界必须与远程访问配置一起检查，不能因“只在本机”就省略敏感字段范围。

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

其他DSH插件或脚本在任务结束时向个人设备/群组发送标题与内容，交付每渠道发送结果，用户仍需确认消息被接收与处理。

参照qinglong notify和独立Webhook脚本；本次不把渠道数量当原创性或送达质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与依赖

lib/index.js以渠道类型目录驱动字段与sender分发，Node fetch提供12秒超时、按渠道解析响应；sendNotification串行发送，返回total/sent/results，pushNotifier与受fence保护HTTP共享实现。

- **Host 路由**：渠道配置和发送HTTP入口。
- **界面**：多渠道字段编辑、启停和测试入口。
- **后台**：pushNotifier服务与每渠道结果汇总。

DSH服务注册/HTTP carrier与外部渠道；SMTP额外需nodemailer，代理/自建域名由用户配置，凭据明文在DSH_HOME/push/channels.json。

配置并启用渠道→调用pushNotifier或HTTP→筛选目标→逐渠道发送与解析→返回独立结果；调用方决定失败处理，不能默认无损重试。

web bundle，HTTP渠道依赖Node内置fetch，email动态加载nodemailer；可配置自建接口，渠道仍各有授权和限额。

<a id="detail-section-4"></a>

### 1.3 效果、成本与限制

减少重复配置通知接口与错误分支，发送成功不能替代任务完成或人已处理；消息内容与可靠性需调用方定义。

首次申请渠道token、目标和权限；持续应对接口变更、配额、超时及重试。渠道费用按平台计，人工核对敏感配置与漏发另计；无端到端成本测量。

返回ok是否等于用户可靠收到？sender多以HTTP和渠道业务码判断接受，并无统一送达回执或持久重试；串行多渠道可能累积12秒超时。publicChannel返回完整config，令牌还明文存channels.json，fence信任边界必须与远程访问配置一起检查，不能因“只在本机”就省略敏感字段范围。

<a id="detail-section-5"></a>

### 1.4 核心贡献与工程亮点

相对每个定时任务内各写Webhook脚本，贡献是集中管理DSH通知配置，用进程内服务和HTTP复用同一发送入口与每渠道错误结果。渠道实现明确参考qinglong notify，不能把成熟渠道协议算作原创；插件增量是DSH配置、服务与调用者接线。

类型schema供UI与host共用、sendChannel捕获每渠道异常、服务和HTTP复用发送函数值得借鉴；串行分发、无持久幂等账本与config全量公开形状是复用边界。

源码依据：[lib/index.js](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/index.js)、[lib/client.js](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/lib/client.js)、[package.json](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/package.json)、[SECURITY.md](https://github.com/534119219/chicheng-push/blob/2aa2b8273183bc91f4cf6d12b1f7121bbee751da/SECURITY.md)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：其他DSH插件或脚本在任务结束时向个人设备/群组发送标题与内容，交付每渠道发送结果，用户仍需确认消息被接收与处理。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **Host 路由**：渠道配置和发送HTTP入口。
- **界面**：多渠道字段编辑、启停和测试入口。
- **后台**：pushNotifier服务与每渠道结果汇总。

> **思考**：返回ok是否等于用户可靠收到？sender多以HTTP和渠道业务码判断接受，并无统一送达回执或持久重试；串行多渠道可能累积12秒超时。publicChannel返回完整config，令牌还明文存channels.json，fence信任边界必须与远程访问配置一起检查，不能因“只在本机”就省略敏感字段范围。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：相对每个定时任务内各写Webhook脚本，贡献是集中管理DSH通知配置，用进程内服务和HTTP复用同一发送入口与每渠道错误结果。渠道实现明确参考qinglong notify，不能把成熟渠道协议算作原创；插件增量是DSH配置、服务与调用者接线。

<a id="detail-section-9"></a>

### 1.8 使用建议

有多个任务插件要发通知时可先接一个非敏感测试渠道；检查每渠道结果、令牌文件权限和远程接口范围，再发正式任务摘要，避免把秘密内容直接推到群里。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码确认配置、渠道分发与结果汇总；未发送消息、核验渠道协议现况或宿主fence，未来可靠通知账本是假设。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.0；版本日期：2026-08-16（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[2aa2b827](https://github.com/534119219/chicheng-push/tree/2aa2b8273183bc91f4cf6d12b1f7121bbee751da)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：抽读httpJson、渠道发送、目标解析、结果汇总、存储/API与客户端；只确认分发结构，未逐平台实发或保证所有协议仍兼容。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：b25d076e7267248a96d4717ec3aa662511917d4e2653267aa1096895271bb294。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 344 | — | — | 2637 |
| .md | example | 1 | 53 | — | — | 300 |
| .js | source | 2 | 1488 | 1312 | 87 | — |
| .mjs | test | 2 | 261 | 202 | 28 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：为调用方提供幂等通知ID与持久发送账本，按“已提交/平台接受/确认收到”分层，允许失败渠道重试，可减少任务重试引发的重复提醒。由每渠道results但无持久投递状态推导，当前未实现。用成功后连接断开、部分渠道失败和调用方重放对照，测重复率、漏发与等待时间；不支持回执的平台必须保持unknown，不能伪造已读。

隔离渠道验证平台拒绝、HTTP成功业务失败、部分超时、重放与令牌返回范围；本轮未执行真实发送。

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/534119219/chicheng-push/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
