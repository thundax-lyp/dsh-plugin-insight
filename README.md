# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 131 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 36 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 86 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 118 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 13 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 18 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 1 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[dsh-fullscreen-input](data/plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 · [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)
- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 · [![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)
- **[embedded-workbench](data/plugins/amethystluna--embedded-workbench/INSIGHT.md)**：为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。 · [![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)
- **[dsh-anet](data/plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)**：将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。 统一节点/MCP/Skill接线实用，适合能管理身份/daemon/支出的技术用户，先核真实节点和安装信任，不把指南当隔离。 · [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md) · 将AWiki身份、私信群聊与邮件接入DSH，提供Web界面和十个通信工具，支持用户摘要及可选白名单来信到Agent。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)
- [dsh-obsidian-board](data/plugins/2026heshao--dsh-obsidian-board/INSIGHT.md) · 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)
- [@240xu/dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)
- [@adwmc/helm-d](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md) · 为DSH提供安全分析工作台，组织case、参考资料、领域工具输出、证据编号和结论记录。 · [![GitHub ★ 380](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=380&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)
- [dsh-jev-guard](data/plugins/7starsseeker--dsh-jev-guard/INSIGHT.md) · 在DSH shell执行前组合静态规则与Jev语义风险判定，提供人工出口、降级与审计。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。 · [![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
- [dsh-update-checker](data/plugins/airmetro--dsh-update-checker/INSIGHT.md) · 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)
- [dsh-calendar](data/plugins/alonefu--dsh-calendar-plugin/INSIGHT.md) · 在 DSH 右侧栏读 Obsidian 日记与待办，并受控写回 Markdown。 · [![npm 30d 6,032](https://img.shields.io/static/v1?label=npm+30d&message=6%2C032&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-calendar)
- [dsh-diff-approval](data/plugins/9087--dsh-diff-approval/INSIGHT.md) · 在DSH web集中审阅工具写入与VCS本地变更，提供文件/块级保留、回退及评论。 · [![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)
- [@240xu/dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（131）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。 [![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 [![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：为 DSH Web/可选桌面层提供随会话状态变化的 Live2D 宠物、装扮、提示音和共享设置。 [![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d)

<a id="plugin-1387205322-root"></a>

- **[dsh-whale-girl-live2d](data/plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)**：将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。 [![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

<a id="plugin-1333136466-root"></a>

- **[dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)**：在DSH Web用一个快捷键面板搜索会话、slash命令、可见界面动作与插件设置入口。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) [![npm 30d 599](https://img.shields.io/static/v1?label=npm+30d&message=599&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-research-knowledge"></a>

### [研究与知识（36）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1341648244-root"></a>

- **[KRouter](data/plugins/398894496-arch--krouter/INSIGHT.md)**：让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 [![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

<a id="plugin-1335219884-root"></a>

- **[dsh-web-tools](data/plugins/a3boy--dsh-web-tools/INSIGHT.md)**：为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 [![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

<a id="plugin-1337487779-root"></a>

- **[dsh-ultramath](data/plugins/andiii208--dsh-ultramath/INSIGHT.md)**：同步数模竞赛主控/角色预设、模型库与论文模板。 [![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath)

<a id="plugin-1335047324-root"></a>

- **[dsh-read-url](data/plugins/2672243194--dsh-read-url/INSIGHT.md)**：读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 [![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

<a id="plugin-1331846104-root"></a>

- **[dsh-stock-market](data/plugins/anacondakc--dsh-stock-market/INSIGHT.md)**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### [基础设施（86）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1387227102-root"></a>

- **[DSH RotaKit](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（118）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1336092482-01-content"></a>

- **[dsh-worktable（01_content）](data/plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)**：在侧栏提供项目抽屉、分栏窗格、会话绑定与项目产物挂载。 [![GitHub ★ 772](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=772&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

<a id="plugin-1334304098-packages-helmd"></a>

- **[@adwmc/helm-d](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：为DSH提供安全分析工作台，组织case、参考资料、领域工具输出、证据编号和结论记录。 [![GitHub ★ 380](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=380&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

<a id="plugin-1340906871-dsh"></a>

- **[dsh-codex-guard](data/plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)**：DSH 单工具包装 codex-guard CLI，执行提交前本地 diff hygiene 扫描。 [![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

<a id="plugin-1334205011-root"></a>

- **[dsh-wsl-workspace](data/plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)**：从DSH界面添加WSL工作区，将会话命令、文件工具和模式接到选定发行版，并提供交互终端与作业接线。 [![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

- **[dsh-agentdebugx](data/plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)**：连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（13）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 [![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1339888505-root"></a>

- **[gzhflow](data/plugins/andiii208--gzhflow/INSIGHT.md)**：把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

<a id="plugin-1418493685-root"></a>

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1352959121-root"></a>

- **[dsh-ark9canvas](data/plugins/aik358--dsh-ark9canvas/INSIGHT.md)**：为DSH提供多渠道图片工作台、批量任务和Agent生图审批队列，生成结果保存为本地路径。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 877](https://img.shields.io/static/v1?label=npm+30d&message=877&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-office-operations"></a>

### [办公与运营（18）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1335725068-root"></a>

- **[chicheng-stats](data/plugins/534119219--chicheng-stats/INSIGHT.md)**：DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

<a id="plugin-1335382133-root"></a>

- **[赤诚推送 chicheng-push](data/plugins/534119219--chicheng-push/INSIGHT.md)**：统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

<a id="plugin-1335387524-root"></a>

- **[dsh-msg-hub](data/plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)**：把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

<a id="plugin-1340280087-root"></a>

- **[dsh-plugin-balance](data/plugins/andrew111888--dsh-plugin-balance/INSIGHT.md)**：DSH Web 额度悬浮窗，整合多供应商查询、会话 token 统计与费用估算。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/Andrew111888/dsh-plugin-balance) [![npm 30d 1,245](https://img.shields.io/static/v1?label=npm+30d&message=1%2C245&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-balance)

<a id="plugin-1335244607-root"></a>

- **[dsh-toolbox-web](data/plugins/abcdefgxw--dsh-toolbox-web/INSIGHT.md)**：在 Web 管理会话、回收站、搜索与配置，并提供后台定时心跳。 [![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web) [![npm 30d 1,058](https://img.shields.io/static/v1?label=npm+30d&message=1%2C058&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web) [![最新发布 2026-09-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-other"></a>

### [其他（1）](data/views/categories/OTHER.md)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH 浮动面板中用 Web Audio 合成钢琴音并支持滑动刮奏。 [![npm 30d 560](https://img.shields.io/static/v1?label=npm+30d&message=560&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-piano) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-piano)

[更多 其他 →](data/views/categories/OTHER.md)

<a id="category-customer-service"></a>

### [客户服务（1）](data/views/categories/CUSTOMER-SERVICE.md)

<a id="plugin-1374055714-root"></a>

- **[3chat-customer-growth](data/plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

[更多 客户服务 →](data/views/categories/CUSTOMER-SERVICE.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-22
