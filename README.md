# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 36 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 17 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 13 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 50 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 38 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 5 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 根据适用场景、使用价值与验证证据人工选择；待复核项暂停推荐。

- **[dsh-folderwatch](data/plugins/11111353535--dsh-folderwatch/INSIGHT.md)**：监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 适合外部文件交接频繁的任务，先用 queue 模式和小目录验证漏报、回声与扫描成本；未做宿主验收。 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch)
- **[dsh-which](data/plugins/11111353535--dsh-which/INSIGHT.md)**：解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 适合经常排查多版本命令冲突的开发者，先关闭探测并对照实际 shell；未覆盖全部别名与函数语义。 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which)
- **[dsh-composer-expand](data/plugins/13071301808--dsh-composer-expand/INSIGHT.md)**：为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。 长提示词编辑者可试用，先验证输入法、候选菜单和发送快捷键，确认禁用可恢复；未做真实宿主验收。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 1011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)
- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：在 DSH 中管理 MCP、技能、专家、市场和工具使用账本，支持全局与项目作用域。 适合已有多个 MCP、需要按项目隔离的用户试用；已检查源码，尚未做宿主验证。先在独立项目测试导入重名、慢重连和实际工具可见性，保存成功后仍核对运行状态。 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)
- **[dsh-session-diff](data/plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)**：在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 适合用常规 write/edit 工具改代码、想快速查看本会话差异的用户试用；已检查源码，尚未做宿主验证。先用两会话修改同文件和 shell 改动检查覆盖边界，完整审查仍以 Git 变更为准。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

## [最新](data/views/columns/LATEST.md)

> 最近30天已核实的新发布；重要更新待完成版本差异核查后纳入，不按仓库推送排名。

- [dsh-domain-bridge](data/plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md) · 为 DSH 顶层会话提供域寻址、消息投递、分级暂停与模型分派。 · 新发布：2026-10-18 · [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) · [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)
- [agent-clinic](data/plugins/1687210989--agent-clinic/INSIGHT.md) · 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 · 新发布：2026-10-15 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) · [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic)
- [dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md) · 在 DSH 中管理 MCP、技能、专家、市场和工具使用账本，支持全局与项目作用域。 · 新发布：2026-10-13 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)
- [dsh-obsidian-board](data/plugins/2026heshao--dsh-obsidian-board/INSIGHT.md) · 将本地 Obsidian 笔记库接入 DSH 三栏问答面板，提供本地关键词检索和可点击引用。 · 新发布：2026-10-13 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) · [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)
- [dsh-draft-attachments](data/plugins/2026heshao--dsh-draft-attachments/INSIGHT.md) · 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。 · 新发布：2026-10-13 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) · [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

## [最热](data/views/columns/HOT.md)

> 按已采集的近30天 npm 下载量降序，同量按稳定ID；每个 npm 包仅占一席，共用包不代表各组件独立下载量。未发布或下载数据缺失、失败的条目不排名。各项标明统计窗口，下载量不等于用户数；GitHub Star 仅表示技术关注度，不参与排序。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 · [![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)（dsh-status-rotator；2026-09-20～2026-10-19 UTC）
- [dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 · [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) · [![npm 30d 4850](https://img.shields.io/static/v1?label=npm+30d&message=4%2C850&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)（@240xu/dsh-websearch；2026-09-20～2026-10-19 UTC）
- [dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md) · 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)（@yolk_vat-y/dsh-project-memory；2026-09-20～2026-10-19 UTC）
- [dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md) · 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 · [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4246](https://img.shields.io/static/v1?label=npm+30d&message=4%2C246&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)（dsh-api-dashboard；2026-09-20～2026-10-19 UTC）
- [dsh-ledger-memory](data/plugins/18477514055--dsh-ledger-memory/INSIGHT.md) · 为 DSH 项目维护台账、活动日志、上下文压缩与跨会话交接。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/18477514055/dsh-ledger-memory) · [![npm 30d 3016](https://img.shields.io/static/v1?label=npm+30d&message=3%2C016&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ledger-memory)（dsh-ledger-memory；2026-09-20～2026-10-19 UTC）

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（36）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 [![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1333136466-root"></a>

- **[dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)**：以键盘命令面板统一查找原生命令、近期会话和插件入口。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

<a id="plugin-1334899834-root"></a>

- **[api-balance](data/plugins/02muller25--dsh-api-balance/INSIGHT.md)**：在 DSH Web 输入区显示 DeepSeek 账户余额，支持手动和定时刷新。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance)

<a id="plugin-1409724830-src"></a>

- **[蓝毛小女仆桌宠](data/plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)**：以透明动画桌宠提供陪伴聊天，可选本地模型、在线模型与屏幕观察。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

<a id="plugin-1363429979-plugin-notes"></a>

- **[Forge 便签](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)**：提供 Markdown 便签板、搜索归档和任务泳道，可把便签交给智能体或定时执行。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（17）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1363429979-plugin-daily-log"></a>

- **[Forge 工作报告](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)**：汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1980](https://img.shields.io/static/v1?label=npm+30d&message=1%2C980&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

<a id="plugin-1342742812-root"></a>

- **[dsh-crypto-portfolio](data/plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)**：以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)

<a id="plugin-1343622602-root"></a>

- **[dsh-plugin-nlbi](data/plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)**：在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) · [![npm 30d 917](https://img.shields.io/static/v1?label=npm+30d&message=917&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

<a id="plugin-1364961230-root"></a>

- **[dsh-team-cost](data/plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)**：按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)

<a id="plugin-1364766828-root"></a>

- **[feishu-dsh-plugin（2286893544）](data/plugins/2286893544--feishu-dsh-plugin/INSIGHT.md)**：通过企业自建飞书应用为 DSH 提供消息、云文档、多维表格、表格与权限操作工具。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（13）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

- **[dsh-cortex](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)**：按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1334269686-root"></a>

- **[dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)**：抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) · [![npm 30d 1151](https://img.shields.io/static/v1?label=npm+30d&message=1%2C151&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

<a id="plugin-1363429979-plugin-memory"></a>

- **[Forge 记忆](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)**：为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2404](https://img.shields.io/static/v1?label=npm+30d&message=2%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

<a id="plugin-1340340493-root"></a>

- **[dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md)**：为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) · [![npm 30d 4850](https://img.shields.io/static/v1?label=npm+30d&message=4%2C850&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

<a id="plugin-1334654243-root"></a>

- **[dsh-plugin-tavily](data/plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)**：把Tavily搜索与页面提取接入宿主web服务，提供参数设置、额度状态与引擎切换。 [![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### [基础设施（50）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4246](https://img.shields.io/static/v1?label=npm+30d&message=4%2C246&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

- **[dsh-organism](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)**：把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：在 DSH 中管理 MCP、技能、专家、市场和工具使用账本，支持全局与项目作用域。 [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)

<a id="plugin-1343420855-root"></a>

- **[dsh-ui-auth](data/plugins/0qwq0--dsh-ui-auth/INSIGHT.md)**：为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) · [![npm 30d 1608](https://img.shields.io/static/v1?label=npm+30d&message=1%2C608&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（38）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1339316901-root"></a>

- **[dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md)**：为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4717](https://img.shields.io/static/v1?label=npm+30d&message=4%2C717&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

<a id="plugin-1333258432-root"></a>

- **[dsh-hdc-bridge](data/plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)**：在 DSH 中连接鸿蒙设备、构建调试应用并查询版本化开发知识。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) · [![npm 30d 1769](https://img.shields.io/static/v1?label=npm+30d&message=1%2C769&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

- **[dsh-zero-residence](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)**：把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1379204512-root"></a>

- **[oh-my-dsh](data/plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)**：为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 [![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)

<a id="plugin-1335559646-root"></a>

- **[dsh-trellis](data/plugins/1264459640--dsh-trellis/INSIGHT.md)**：以任务步骤和阶段约束开发流程，提供验收门禁与可选规划期写工具过滤。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1576](https://img.shields.io/static/v1?label=npm+30d&message=1%2C576&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（5）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 [![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

<a id="plugin-1418493685-root"></a>

- **[No AI Style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1381725238-root"></a>

- **[dsh-wsl-media](data/plugins/173787247--dsh-wsl-media/INSIGHT.md)**：在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

<a id="plugin-1399694663-root"></a>

- **[dsh-media-studio](data/plugins/1497105876--dsh-media-studio/INSIGHT.md)**：在DSH聊天中生成图片与视频，发送本地媒体，并提供后台任务与内联展示。 [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio)

<a id="plugin-1401037852-root"></a>

- **[dsh-redstone-music](data/plugins/19north--dsh-redstone-music/INSIGHT.md)**：在 DSH 中渲染音乐采样并生成、部署 Minecraft 红石音乐数据包。 [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/19north/dsh-redstone-music)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-20
