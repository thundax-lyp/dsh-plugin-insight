# dsh-feishu（2048lr）

> 为 DSH 提供飞书与 Lark 文档、表格、多维表格、消息和授权工具及操作面板。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[17ed9c0](https://github.com/2048lr/dsh-feishu/tree/17ed9c0dada4b40580dcf1e1b07918716a94f69d)

<!-- BEGIN META -->
[![npm 30d 75](https://img.shields.io/static/v1?label=npm+30d&message=75&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu) [![首次发布 2026-08-14](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu)
<!-- END META -->

**使用建议**：先在测试租户明确选user身份，创建一份可丢弃文档并确认实际落点和权限，再验证token过期及超时重试；正式写入前要检查重复创建，避免把auto降级警告忽略。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
  - [比较依赖](#detail-section-8)
- [未来设计假设（未验证）](#detail-section-9)
- [辅助信息](#detail-section-10)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

源码支持身份显式化和领域工具组合的集成贡献；README开头“eight tools”与实际十个builder不同，本文按代码核实能力但不声称运行已注册。飞书副作用结果及幂等性未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：面向需要把分析写成飞书文档/表格、并由实际操作者取得所有权的团队；成功标准包括内容正确、落在目标身份空间且可供用户访问。

采用建议：先在测试租户明确选user身份，创建一份可丢弃文档并确认实际落点和权限，再验证token过期及超时重试；正式写入前要检查重复创建，避免把auto降级警告忽略。

参照同轮2286893544应用身份+创建后授权的集成机制：本项选择在调用前确定用户身份，避免把共享授权等同于原生个人所有权；未对两者运行效果排序。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：飞书文档、表格、多维表格、图表、云盘、Wiki、消息与原始API工具定义

**流程与依赖**

必需飞书/Lark自建应用、发布scopes和网络；个人空间需OAuth用户授权与offline_access、宿主credentials服务负责存储；没有用户授权时auto落应用空间并警告，显式user则拒绝。

建立应用/发布权限→配置凭据→浏览器授权或手工换code→工具选身份→API调用/有界重试→返回数据及警告→人工验收目标资产。refresh/权限失败需重新授权，传输未知写应先查平台状态。

**效果与成本**

首次需创建自建应用、申请并发布scopes、配置回调和用户授权；持续有模型调用、API配额、refresh失败和权限变化排障。现金价格未核算，重复创建清理和身份复核属于人工成本。

可将分析直接变为用户可访问的飞书资产，减少复制与授权交接；业务价值取决于scope审批、身份正确和写入幂等，尚无节时或任务合格率对照。

- **思考**：可重试传输是否确保写操作只发生一次？httpRequest对超时/临时状态重试，没有按HTTP方法区分；网络超时后服务端可能已成功创建文档或发送消息，重试可能产生重复副作用。现有结构化身份警告解决落点，不解决未知结果。需端到端验证，不能因存在retry就认定可靠办结。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手工导出并上传、通用原始API或应用身份机器人，增量在把个人OAuth身份与创建落点明确连接，auto降级应用身份时返回warnings；领域工具还能组织多维表格图表和聚合。REST/OAuth本身不是原创，贡献是避免“创建成功但人看不到”的流程断裂。

相对手工导出并上传、通用原始API或应用身份机器人，增量在把个人OAuth身份与创建落点明确连接，auto降级应用身份时返回warnings；领域工具还能组织多维表格图表和聚合。REST/OAuth本身不是原创，贡献是避免“创建成功但人看不到”的流程断裂。

身份层将缓存、刷新、存储和resolveIdentity集中，单飞刷新可减少并发换token；工具工厂便于复用统一认证。http.js的8MB护栏先response.text再检查，实际并非流式硬内存上限，且按字符长度判断；适合作为维护注意点，未观察到真实内存故障。

<a id="detail-section-5"></a>

### 主要限制

可重试传输是否确保写操作只发生一次？httpRequest对超时/临时状态重试，没有按HTTP方法区分；网络超时后服务端可能已成功创建文档或发送消息，重试可能产生重复副作用。现有结构化身份警告解决落点，不解决未知结果。需端到端验证，不能因存在retry就认定可靠办结。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/tools/index.js、lib/identity.js、lib/http.js、lib/tools/raw.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读工具组装、身份选择、HTTP重试和raw路径校验；未登录飞书、未发消息/创建内容、未核实第三方接口当前兼容及独立采用。
- 下一步：测试租户同任务分别使用user、app、缺user的auto，核对空间与警告；注入服务端成功后客户端超时，对比当前retry和先查询策略，统计重复资产/消息、合格率及恢复人工。若无查询键或重复仍不可识别，收窄假设适用操作。

**分析版本**

- **仓库**：[2048lr/dsh-feishu](https://github.com/2048lr/dsh-feishu)
- **版本号**：0.1.0（[固定提交 17ed9c0d](https://github.com/2048lr/dsh-feishu/tree/17ed9c0dada4b40580dcf1e1b07918716a94f69d)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/index.js](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/index.js)
- [lib/tools/index.js](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/tools/index.js)
- [lib/identity.js](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js)
- [lib/http.js](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/http.js)
- [lib/tools/raw.js](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/tools/raw.js)

<a id="detail-section-8"></a>

### 比较依赖

本篇仅作固定机制比较，不继承对方运行结论，不增加档案循环依赖。

- `github:1418842530:root`，code `17ed9c0dada4b40580dcf1e1b07918716a94f69d`：[2048lr 身份选择实现](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js)，调用前选择用户/应用身份。
- `github:1364766828:root`，code `8cb7f88b0eed0b8c59932e381f52f096c7e56df9`：[2286893544 创建与授权实现](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js)，应用身份创建后按 grantOpenId 尝试授予访问。

<a id="detail-section-9"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：按操作划分幂等读、带请求键写、结果未知写，最后一类先查询确认再决定重试。它从统一重试层与有副作用领域工具的冲突推导，可将可靠性目标从HTTP成功转为唯一业务成果；代价是每类接口维护查询和幂等能力表。

测试租户同任务分别使用user、app、缺user的auto，核对空间与警告；注入服务端成功后客户端超时，对比当前retry和先查询策略，统计重复资产/消息、合格率及恢复人工。若无查询键或重复仍不可识别，收窄假设适用操作。

<a id="detail-section-10"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 23 | 6137 | 4398 | 1403 | — |
| .md | source | 3 | 899 | — | — | 7352 |
| .mjs | test | 1 | 1806 | 1626 | 183 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2048lr/dsh-feishu/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2048lr/dsh-feishu/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2048lr/dsh-feishu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
