# dsh-plugin-balance

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[96bb159](https://github.com/Andrew111888/dsh-plugin-balance/tree/96bb1592c949456aa37ccc3a296085f59df2ee9c)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/Andrew111888/dsh-plugin-balance) [![npm 30d 1,245](https://img.shields.io/static/v1?label=npm+30d&message=1%2C245&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance)
<!-- END META -->

> **实现功能**：在DSH输入框附近显示多供应商余额/套餐用量，并持久统计会话token及估算费用。

> **核心亮点**：增量是额度查询与持久会话用量同页展示，并处理流中多次usage样本覆盖；余额数据来自供应商，估价表不是计费真相。

> **风险与缺陷**：密钥不回浏览器是否等于不会发错目的地？custom请求允许客户端baseUrl/path，凭据由providerId对应设置解析，handler未见将地址绑定已注册provider或独立信任校验；可能把现有key发到自定义目标。账目重放与静态价格亦不能保证实际费用准确。

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

> **用途**：多模型用户希望区分账户额度、会话消耗与预计费用，合格账目应可与实际服务账单对照。

供应商原始账单权威但分散；宿主token视图更直接，插件聚合历史与额度并增加代理责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：余额代理、provider列表与用量统计。
- **事件监听**：会话usage折叠。
- **后台**：统计持久化与历史重放。
- **界面**：余额/用量浮窗。

**流程与依赖**

DSH credentials/llm/settings/sessions/webServer、供应商接口和可选HTTP代理；实际账单需完整计价和费用单位。

同步provider→服务端解析key查余额→事件折叠/重放用量→落本地统计→按价格表估算→浮窗显示/人工对账。

**效果与成本**

首次配置额度接口/代理，持续网络查询、重放存储和账目复核；无已证省费，人民币换算非实际结算。

提高消耗可见性，未证明降低支出或跨供应商费用准确可比。

> **思考**：密钥不回浏览器是否等于不会发错目的地？custom请求允许客户端baseUrl/path，凭据由providerId对应设置解析，handler未见将地址绑定已注册provider或独立信任校验；可能把现有key发到自定义目标。账目重放与静态价格亦不能保证实际费用准确。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：增量是额度查询与持久会话用量同页展示，并处理流中多次usage样本覆盖；余额数据来自供应商，估价表不是计费真相。

增量是额度查询与持久会话用量同页展示，并处理流中多次usage样本覆盖；余额数据来自供应商，估价表不是计费真相。

usage游标/请求样本替换、迁移备份和有界缓存有用；通用凭据代理需要目标约束，价格/汇率需显式版本。 源码依据：[lib/index.js](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js)、[lib/client.js](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/client.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

密钥不回浏览器是否等于不会发错目的地？custom请求允许客户端baseUrl/path，凭据由providerId对应设置解析，handler未见将地址绑定已注册provider或独立信任校验；可能把现有key发到自定义目标。账目重放与静态价格亦不能保证实际费用准确。

<a id="detail-section-6"></a>

### 1.5 使用建议

先使用固定可信端点，并核对自定义目标与凭据绑定。以服务账单验算统计，金额仅作估算，不直接用于报销或财务结算。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Andrew111888/dsh-plugin-balance](https://github.com/Andrew111888/dsh-plugin-balance)
- **版本号**：1.4.4（[固定提交 96bb1592](https://github.com/Andrew111888/dsh-plugin-balance/tree/96bb1592c949456aa37ccc3a296085f59df2ee9c)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/client.js；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：模拟供应商和密钥，用伪造目标/重定向核对无泄露；对流式多usage、重启重放、价格变化和多进程统计测去重与账单误差。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由服务端凭据代理推导，可把可用provider、目标origin和凭据ref绑定在Host配置，浏览器只传稳定ID，返回账单来源与价格版本。未验证；伪造baseUrl/重定向必须拒绝且不带key，账单样本误差应可解释。

模拟供应商和密钥，用伪造目标/重定向核对无泄露；对流式多usage、重启重放、价格变化和多进程统计测去重与账单误差。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ea916802b73d2e822f50bb4d1d2034dbf677dad0acc39cd1194681d6437e373e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 934 | — | — | 9558 |
| .js | source | 2 | 3835 | 3512 | 216 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/Andrew111888/dsh-plugin-balance/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
