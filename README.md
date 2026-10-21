# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 101 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 29 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 37 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 86 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 90 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 11 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 3 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 根据适用场景、使用价值与验证证据人工选择；待复核项暂停推荐。

- **[dsh-folderwatch](data/plugins/11111353535--dsh-folderwatch/INSIGHT.md)**：监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 适合外部文件交接频繁的任务，先用 queue 模式和小目录验证漏报、回声与扫描成本；未做宿主验收。 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch)
- **[dsh-which](data/plugins/11111353535--dsh-which/INSIGHT.md)**：解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 适合经常排查多版本命令冲突的开发者，先关闭探测并对照实际 shell；未覆盖全部别名与函数语义。 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which)
- **[dsh-composer-expand](data/plugins/13071301808--dsh-composer-expand/INSIGHT.md)**：为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。 长提示词编辑者可试用，先验证输入法、候选菜单和发送快捷键，确认禁用可恢复；未做真实宿主验收。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 979](https://img.shields.io/static/v1?label=npm+30d&message=979&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)
- **[dsh-session-diff](data/plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)**：在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 适合用常规 write/edit 工具改代码、想快速查看本会话差异的用户试用；已检查源码，尚未做宿主验证。先用两会话修改同文件和 shell 改动检查覆盖边界，完整审查仍以 Git 变更为准。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

## [最新](data/views/columns/LATEST.md)

> 最近30天已核实的新发布；重要更新待完成版本差异核查后纳入，不按仓库推送排名。

- [dsh-language-guard](data/plugins/58fly--dsh-language-guard/INSIGHT.md) · 以可配置提示片段、语言命令和周期提醒约束 DSH 输出语言。 · 新发布：2026-10-20 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-language-guard)
- [dsh-vercel](data/plugins/adenxie--dsh-vercel/INSIGHT.md) · 将Vercel官方MCP接入DSH，提供OAuth、按Agent限额加载工具及结果检索与管理界面。 · 新发布：2026-10-19 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/AdenXie/dsh-vercel) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)
- [dsh-domain-bridge](data/plugins/1lany2a--dsh-domain-role--plugins-dsh-domain-bridge/INSIGHT.md) · 为 DSH 顶层会话提供域寻址、消息投递、分级暂停与模型分派。 · 新发布：2026-10-18 · [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1Lany2a/dsh-domain-role) · [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-domain-bridge)
- [dsh-plugin-namecards](data/plugins/3tiga3--dsh-plugin-namecards/INSIGHT.md) · 为 DSH 插件列表添加本地名片、中文备注、图标、文件夹和收藏。 · 新发布：2026-10-18 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) · [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)
- [dsh-search](data/plugins/439436269-ctrl--dsh-search/INSIGHT.md) · 把 DeepSeek Search/Fetch 接口接入 DSH，支持结构化搜索与正文抓取。 · 新发布：2026-10-17 · [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-search) · [![npm 30d 239](https://img.shields.io/static/v1?label=npm+30d&message=239&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-search)

## [最热](data/views/columns/HOT.md)

> 按已采集的近30天 npm 下载量降序，同量按稳定ID；每个 npm 包仅占一席，共用包不代表各组件独立下载量。未发布或下载数据缺失、失败的条目不排名。各项标明统计窗口，下载量不等于用户数；GitHub Star 仅表示技术关注度，不参与排序。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 · [![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11337](https://img.shields.io/static/v1?label=npm+30d&message=11%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)（dsh-status-rotator；2026-09-21～2026-10-20 UTC）
- [dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md) · 在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。 · [![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) · [![npm 30d 7358](https://img.shields.io/static/v1?label=npm+30d&message=7%2C358&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)（dsh-pet-live2d；2026-09-21～2026-10-20 UTC）
- [dsh-diff-approval](data/plugins/9087--dsh-diff-approval/INSIGHT.md) · 汇总Agent成功文件改动供逐文件或逐块保留、回退，并支持导入本地版本控制差异。 · [![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) · [![npm 30d 5714](https://img.shields.io/static/v1?label=npm+30d&message=5%2C714&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)（dsh-diff-approval；2026-09-21～2026-10-20 UTC）
- [dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 · [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) · [![npm 30d 4802](https://img.shields.io/static/v1?label=npm+30d&message=4%2C802&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)（@240xu/dsh-websearch；2026-09-21～2026-10-20 UTC）
- [dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md) · 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4533](https://img.shields.io/static/v1?label=npm+30d&message=4%2C533&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)（@yolk_vat-y/dsh-project-memory；2026-09-21～2026-10-20 UTC）

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（101）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 [![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11337](https://img.shields.io/static/v1?label=npm+30d&message=11%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为 DSH 提供桌面观察、元素或坐标操作、虚拟光标及应用管理工具。 [![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) · [![npm 30d 3633](https://img.shields.io/static/v1?label=npm+30d&message=3%2C633&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。 [![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) · [![npm 30d 7358](https://img.shields.io/static/v1?label=npm+30d&message=7%2C358&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)

<a id="plugin-1333136466-root"></a>

- **[dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)**：以键盘命令面板统一查找原生命令、近期会话和插件入口。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 634](https://img.shields.io/static/v1?label=npm+30d&message=634&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

<a id="plugin-1335766616-root"></a>

- **[dsh-effort-slider](data/plugins/2768651338--dsh-effort-slider/INSIGHT.md)**：为 DSH 模型菜单增加推理强度滑块，并向第三方模型供给方言配置。 [![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) · [![npm 30d 1403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（29）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1334428397-root"></a>

- **[dsh-awiki](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：把AWiki身份、设备加入/恢复、消息和邮件接入DSH，区分Host管理与模型可用操作。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) · [![npm 30d 1584](https://img.shields.io/static/v1?label=npm+30d&message=1%2C584&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

<a id="plugin-1363429979-plugin-daily-log"></a>

- **[Forge 工作报告](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)**：汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1976](https://img.shields.io/static/v1?label=npm+30d&message=1%2C976&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

<a id="plugin-1335807482-root"></a>

- **[chicheng-cron](data/plugins/534119219--chicheng-cron/INSIGHT.md)**：在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)

<a id="plugin-1335382133-root"></a>

- **[chicheng-push](data/plugins/534119219--chicheng-push/INSIGHT.md)**：在 DSH 配置多种推送渠道，并通过进程内服务或 HTTP 接口发送通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

<a id="plugin-1335387524-root"></a>

- **[dsh-msg-hub](data/plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)**：把微信、QQ、飞书消息接到 DSH 会话，并提供主动推送与远程审批。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) · [![npm 30d 1207](https://img.shields.io/static/v1?label=npm+30d&message=1%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（37）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1341648244-root"></a>

- **[KRouter](data/plugins/398894496-arch--krouter/INSIGHT.md)**：以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。 [![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

<a id="plugin-1335219884-root"></a>

- **[dsh-web-tools](data/plugins/a3boy--dsh-web-tools/INSIGHT.md)**：将多个Web搜索和提取服务以及社交平台接到DSH标准搜索接口，提供路由和故障切换。 [![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

<a id="plugin-1335047324-root"></a>

- **[URL 正文阅读器](data/plugins/2672243194--dsh-read-url/INSIGHT.md)**：读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 [![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) · [![npm 30d 2642](https://img.shields.io/static/v1?label=npm+30d&message=2%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url)

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

- **[dsh-cortex](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)**：按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1342524723-root"></a>

- **[dsh-plugin-roundtable 圆桌会议](data/plugins/9931666--dsh-plugin-roundtable/INSIGHT.md)**：在 DSH 以拓扑视图组织多角色专家协作、讨论、汇聚与用户决策。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/9931666/dsh-plugin-roundtable) · [![npm 30d 1464](https://img.shields.io/static/v1?label=npm+30d&message=1%2C464&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@y9931666/dsh-plugin-roundtable)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### [基础设施（86）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：让DSH网页监听全部网卡，并为局域网页面提供Host能力声明与地址信任配置。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) · [![npm 30d 1548](https://img.shields.io/static/v1?label=npm+30d&message=1%2C548&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) · [![npm 30d 4179](https://img.shields.io/static/v1?label=npm+30d&message=4%2C179&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) · [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory)

<a id="plugin-1387227102-root"></a>

- **[DSH-Official-WorkBuddy-Credit-Proxy](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：将本机 WorkBuddy、CodeBuddy 账号接入 DSH 模型池，并提供多协议代理与积分面板。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) · [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（90）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1334304098-packages-helmd"></a>

- **[helmd](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：提供安全分析预设、领域工具和按需参考，并将Case证据与结论保存在磁盘。 [![GitHub ★ 289](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=289&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) · [![npm 30d 391](https://img.shields.io/static/v1?label=npm+30d&message=391&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

<a id="plugin-1334205011-root"></a>

- **[dsh-wsl-workspace](data/plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)**：在DSH界面添加WSL工作区，让会话的命令和文件工具使用Linux路径与发行版环境。 [![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) · [![npm 30d 3340](https://img.shields.io/static/v1?label=npm+30d&message=3%2C340&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

- **[AgentDebugX](data/plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)**：按需将DSH当前或选定历史会话接入AgentDebugX诊断，并保存可关联的轨迹与报告。 [![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) · [![npm 30d 792](https://img.shields.io/static/v1?label=npm+30d&message=792&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

<a id="plugin-1339316901-root"></a>

- **[dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md)**：为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4533](https://img.shields.io/static/v1?label=npm+30d&message=4%2C533&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

<a id="plugin-1333258432-root"></a>

- **[dsh-hdc-bridge](data/plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)**：在 DSH 中连接鸿蒙设备，构建调试应用并查询版本化开发知识。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) · [![npm 30d 1740](https://img.shields.io/static/v1?label=npm+30d&message=1%2C740&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（11）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 [![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) · [![npm 30d 705](https://img.shields.io/static/v1?label=npm+30d&message=705&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1418493685-root"></a>

- **[No AI Style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1352959121-root"></a>

- **[dsh-ark9canvas](data/plugins/aik358--dsh-ark9canvas/INSIGHT.md)**：为DSH提供多渠道图片工作台、批量任务和Agent生图审批队列，生成结果保存为本地路径。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) · [![npm 30d 877](https://img.shields.io/static/v1?label=npm+30d&message=877&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

<a id="plugin-1422216012-root"></a>

- **[dsh-image2-tool](data/plugins/544244857--dsh-image2-plugin/INSIGHT.md)**：通过兼容图片接口生成或编辑图片，将结果保存到会话目录并支持内联预览。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/544244857/dsh-image2-plugin) · [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-image2-tool)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-other"></a>

### [其他（3）](data/views/categories/OTHER.md)

<a id="plugin-1409889533-root"></a>

- **[dsh-codefall](data/plugins/4444hao--dsh-codefall/INSIGHT.md)**：为 DSH 添加数字雨启动动画、矩形光门转场和可调绿色主题。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall) · [![npm 30d 407](https://img.shields.io/static/v1?label=npm+30d&message=407&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codefall)

<a id="plugin-1413897334-root"></a>

- **[dsh-ai-arcade](data/plugins/439436269-ctrl--dsh-ai-arcade/INSIGHT.md)**：在 DSH 中提供双脑贪吃蛇和中国象棋，结合本地规则引擎与模型策略解说。 [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-ai-arcade) · [![npm 30d 299](https://img.shields.io/static/v1?label=npm+30d&message=299&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH 浮动面板中用 Web Audio 合成钢琴音并支持滑动刮奏。 [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-piano) · [![npm 30d 560](https://img.shields.io/static/v1?label=npm+30d&message=560&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-piano)

[更多 其他 →](data/views/categories/OTHER.md)

<a id="category-customer-service"></a>

### [客户服务（1）](data/views/categories/CUSTOMER-SERVICE.md)

<a id="plugin-1374055714-root"></a>

- **[3Chat 私域客户运营](data/plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)**：连接 3Chat 客户和会话，准备跟进消息并经确认发送及查询批次结果。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

[更多 客户服务 →](data/views/categories/CUSTOMER-SERVICE.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-21
