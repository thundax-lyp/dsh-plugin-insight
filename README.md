# DSH Plugin Insight [![已研究 1410](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=1410&color=766494&style=flat&labelColor=555555&logoColor=white)](data/views/categories/INDEX.md)

按 DSH 使用场景查找插件与相关工具，了解用途、使用条件和核查结果。

[推荐尝试](data/views/columns/RECOMMENDED.md) · [最近发布](data/views/columns/LATEST.md) · [下载热门](data/views/columns/HOT.md) · [按场景查找](data/views/categories/INDEX.md)

<img src="assets/dsh-plugin-insight-banner.svg" alt="DSH Plugin Insight：从源码与证据中识别贡献、限制与创新方向" width="960">

## [推荐尝试](data/views/columns/RECOMMENDED.md)

> 展示最近 15 天有仓库推送或已核实 npm 发版的推荐，详情列出试用或安装条件。

- **[CC Safety Net](data/plugins/kenryu42--cc-safety-net/INSIGHT.md)** ｜ 为 DSH 等编码工具提供执行前规则，检查危险命令和敏感文件访问。

    **推荐理由**：经常让 DSH 调用 shell 的工程师，可以在一次性工作区试验工具前置规则。它能在人工核查之外给已覆盖的工具提供可回查的拒绝理由。如果未声明工具仍被当作已保护或合法操作频繁误拦，就回到原有审批并停止扩大使用。

    **试用条件**：[Q03](data/plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q03) 先核固定 profile、工具名单和工作目录。用假工具而非破坏性命令试验，出现覆盖或误拦问题时恢复原审批。

    [查看完整分析](data/plugins/kenryu42--cc-safety-net/INSIGHT.md)

- **[OpenBitFun Agent 工作区](data/plugins/gcwing--openbitfun/INSIGHT.md)** ｜ 独立 Agent 工作区，支持跨设备控制、远程工作区与可选 DSH 会话。

    **推荐理由**：有常开开发主机的开发者可以用测试账号从手机观察隔离仓库里的一次长任务并处理低风险审批。相比登录 SSH 再找对应终端，会话投影与审批入口能让操作者在同一界面确认任务进度。若无法确认目标主机、工作目录或一次写入是否已经生效，操作者应暂停后续操作并回主机核对。

    **试用条件**：用测试账号和可回滚仓库先跑一次短任务，再从第二设备核对任务 ID 与审批。断开后回主机确认文件结果，状态未知时暂停后续写入。见 [Q04](data/plugins/gcwing--openbitfun/INSIGHT.md#research-q04)。

    [查看完整分析](data/plugins/gcwing--openbitfun/INSIGHT.md)

- **[ModSearch](data/plugins/liustack--modsearch/INSIGHT.md)** ｜ 为 DSH 提供多引擎网页搜索、X 搜索和页面读取。

    **推荐理由**：在 DSH 中反复核对公开资料的用户，可以在可信出网配置下用无敏感查询试用 ModSearch。相比单引擎搜索，它可以按预算切换引擎，并在 X 查询改由网页回答时保留二手语料标记。若无法打开原始来源、无法确认查询发往何处或管理路由可被未授权访问，用户应停止试用并切回原有工具。

    **试用条件**：先用公开查询核对目标引擎、输出和引用，再检查代理与管理权限。来源无法核对或请求不应外发时回原生工具。见 [Q04](data/plugins/liustack--modsearch/INSIGHT.md#research-q04)。

    [查看完整分析](data/plugins/liustack--modsearch/INSIGHT.md)

## [最近发布](data/views/columns/LATEST.md)

> 查看最近发布的版本，了解用途和使用条件。

- [Polymarket Proxy](data/plugins/dennisyang1986--polymarket-proxy/INSIGHT.md) · 在 DSH 内查看 Polymarket 市场与账户，提供本地交易面板和两个只读模型工具。 · [![最新发布 2026-11-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-polymarket-proxy)
- [DSH Plugin Hub](data/plugins/dshplugin--dsh-plugin-hub/INSIGHT.md) · 在 DeepSeek Harness 设置中浏览社区插件，管理安装、更新、卸载和任务日志。 · [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)
- [DSH Super Kanban](data/plugins/topmindspace--dsh-super-kanban/INSIGHT.md) · 把 DeepSeek Harness 会话整理成任务卡，集中查看进展、待处理和待验收交付。 · [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-kanban)

## [下载热门](data/views/columns/HOT.md)

> 从近期下载较多的插件中，寻找适合自己任务的工具。

- [Billion Context](data/plugins/ranxianglei--billion-context/INSIGHT.md) · 面向长会话的上下文压缩工具，可按范围生成摘要、检索并回读内容。 · [![npm 30d 3,582,530](https://img.shields.io/static/v1?label=npm+30d&message=3%2C582%2C530&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
- [REA](data/plugins/morluto--rea/INSIGHT.md) · 通过终端或 MCP 调查原生二进制、JavaScript、Electron、.NET 与网站，输出分析证据及限制。 · [![npm 30d 1,944,247](https://img.shields.io/static/v1?label=npm+30d&message=1%2C944%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
- [DSH Market](data/plugins/dsh-market--dsh-market/INSIGHT.md) · 在 DeepSeek Harness 中浏览、搜索、安装和管理社区插件。 · [![npm 30d 1,289,262](https://img.shields.io/static/v1?label=npm+30d&message=1%2C289%2C262&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

## 按场景查找

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 424 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 57 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 172 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 443 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 82 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 226 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 5 |

[浏览全部分类](data/views/categories/INDEX.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-11-19
