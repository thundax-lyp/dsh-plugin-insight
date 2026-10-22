# DSH-Official-WorkBuddy-Credit-Proxy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[17a02c0](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/tree/17a02c085af35ab08ceb3075b003a981afa76d5c)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)
<!-- END META -->

> **实现功能**：将本机 WorkBuddy、CodeBuddy 账号接入 DSH 模型池，并提供多协议代理与积分面板。

> **核心亮点**：作者明确基于XDTrees账号池及其他MIT代码，不能把凭据解密和原池轮转归为新贡献。可识别增量是三协议共用调度及针对工具调用/流事件的兼容投影，隔离协议错误与选号逻辑。

> **风险与缺陷**：协议翻译是否语义无损？inputToMessages对工具call/result重排和补缺失结果，有利于上游接受；但input_image变成文本占位，数组输出抽文本，toolsToChat仅过滤function类型，自由格式工具声明未因此完整支持。HTTP200和模型正文不代表完整工具闭环兼容。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本人账号、希望在兼容客户端复用接入和故障转移的用户，交付为经过同一调度器的模型响应。

参照项目声明的MIT上游账号池和单协议代理；贡献限定在已核查兼容层与调度组合，不主张全球首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：多账号调度、冷却和在途租约
- **Host 路由**：Chat、Responses和Messages兼容代理

**流程与依赖**

依赖本机账号凭据、上游网关与政策、宿主llm接口及兼容协议子集；不同地区凭据和模型能力需匹配。

发现账号→过滤额度/冷却→粘性或权重选取→占租约→请求上游→错误分类和换号→流回译→记录用量。

**效果与成本**

首次要已有账号登录和宿主配置；持续上游积分、模型调用、协议维护与失败重试成本，自动化奖励不等于可持续免费成本。

共享池减少人工切号与重复调度实现有机制依据；缓存收益和可用率未本轮实测，账号数和积分不能推出经济收益。

> **思考**：协议翻译是否语义无损？inputToMessages对工具call/result重排和补缺失结果，有利于上游接受；但input_image变成文本占位，数组输出抽文本，toolsToChat仅过滤function类型，自由格式工具声明未因此完整支持。HTTP200和模型正文不代表完整工具闭环兼容。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者明确基于XDTrees账号池及其他MIT代码，不能把凭据解密和原池轮转归为新贡献。可识别增量是三协议共用调度及针对工具调用/流事件的兼容投影，隔离协议错误与选号逻辑。

作者明确基于XDTrees账号池及其他MIT代码，不能把凭据解密和原池轮转归为新贡献。可识别增量是三协议共用调度及针对工具调用/流事件的兼容投影，隔离协议错误与选号逻辑。

会话key从system与首个user内容推导，可在截断或相同开头会话中产生绑定边界；粘性有TTL与容量上限，在途租约控制并发。协议层独立有助于定位错误。 [固定源码](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L1)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[核查分支](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/blob/17a02c085af35ab08ceb3075b003a981afa76d5c/lib/protocol-compat.js#L148)。

协议翻译是否语义无损？inputToMessages对工具call/result重排和补缺失结果，有利于上游接受；但input_image变成文本占位，数组输出抽文本，toolsToChat仅过滤function类型，自由格式工具声明未因此完整支持。HTTP200和模型正文不代表完整工具闭环兼容。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在本人账号和明确上游使用条件下隔离试用，先验证真实客户端工具闭环与协议降级；不要只凭响应200扩大使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

- 已检查：作者 README、包清单、源码路径 lib/protocol-compat.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：用图像、自定义工具、乱序结果、截断SSE构造协议契约样例，比较输入输出保真；若unsupported仍静默丢失或可支持路径被过度拒绝则否定假设。

**分析版本**

- **仓库**：[2861292267/DSH-Official-WorkBuddy-Credit-Proxy](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy)
- **版本号**：2.4.2（[固定提交 17a02c08](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/tree/17a02c085af35ab08ceb3075b003a981afa76d5c)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：给转换器增加能力协商与不可表示字段的显式拒绝，可减少静默降级；新增负担为客户端兼容矩阵及拒绝后的替代路径。

用图像、自定义工具、乱序结果、截断SSE构造协议契约样例，比较输入输出保真；若unsupported仍静默丢失或可支持路径被过度拒绝则否定假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 3290 | — | — | 43510 |
| .js | source | 8 | 24593 | 15501 | 8786 | — |
| .mjs | source | 8 | 1168 | 792 | 294 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
