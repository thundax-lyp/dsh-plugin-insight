# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 120 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 31 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 72 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 102 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 11 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 14 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 2 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)
- **[dsh-fullscreen-input](data/plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 · [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)
- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 · [![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)
- **[dsh-wsl-browser](data/plugins/173787247--dsh-wsl-browser/INSIGHT.md)**：从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [dsh-trellis](data/plugins/1264459640--dsh-trellis/INSIGHT.md) · 为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,515](https://img.shields.io/static/v1?label=npm+30d&message=1%2C515&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
- [oh-my-dsh](data/plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md) · 为 DSH 提供多智能体编排、角色资产、状态工具、团队运行时与恢复机制。 · [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,166](https://img.shields.io/static/v1?label=npm+30d&message=2%2C166&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)
- [dsh-context-guard](data/plugins/2jumpsina--dsh-context-guard/INSIGHT.md) · 基于DSH上下文占用投影显示提醒，生成机器事实交接草稿，并记录压缩前读数台账。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)
- [@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md) · 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)
- [dsh-obsidian-board](data/plugins/2026heshao--dsh-obsidian-board/INSIGHT.md) · 在DSH三栏面板以本地BM25检索Obsidian笔记，复用宿主模型流式回答、点引用读源并保存回答。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。 · [![GitHub ★ 201](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=201&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
- [dsh-update-checker](data/plugins/airmetro--dsh-update-checker/INSIGHT.md) · 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)
- [dsh-diff-approval](data/plugins/9087--dsh-diff-approval/INSIGHT.md) · 在DSH web集中审阅工具写入与VCS本地变更，提供文件/块级保留、回退及评论。 · [![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)
- [@240xu/dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为DSH注册unified搜索服务，聚合11后端，支持并发容错、去重、可选重排、多查询及缓存历史。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)
- [dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md) · 为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（120）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。 [![GitHub ★ 201](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=201&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 [![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：为 DSH Web/可选桌面层提供随会话状态变化的 Live2D 宠物、装扮、提示音和共享设置。 [![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d)

<a id="plugin-1387205322-root"></a>

- **[dsh-whale-girl-live2d](data/plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)**：将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。 [![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 [![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-research-knowledge"></a>

### [研究与知识（31）](data/views/categories/RESEARCH-KNOWLEDGE.md)

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

### [基础设施（72）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1387227102-root"></a>

- **[DSH RotaKit](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

<a id="plugin-1343420855-root"></a>

- **[dsh-ui-auth](data/plugins/0qwq0--dsh-ui-auth/INSIGHT.md)**：为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。 [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) [![npm 30d 1,561](https://img.shields.io/static/v1?label=npm+30d&message=1%2C561&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（102）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1334304098-packages-helmd"></a>

- **[@adwmc/helm-d](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：为安全分析任务提供知识路由、参考资料、工具门控、案例记录和多类分析脚本。 [![GitHub ★ 431](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=431&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

<a id="plugin-1340906871-dsh"></a>

- **[dsh-codex-guard](data/plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)**：DSH 单工具包装 codex-guard CLI，执行提交前本地 diff hygiene 扫描。 [![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

<a id="plugin-1334205011-root"></a>

- **[dsh-wsl-workspace](data/plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)**：从DSH界面创建WSL工作区，使会话命令、文件操作和搜索在选定发行版中协同运行。 [![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

- **[dsh-agentdebugx](data/plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)**：连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

<a id="plugin-1339316901-root"></a>

- **[dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md)**：为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（11）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1339888505-root"></a>

- **[gzhflow](data/plugins/andiii208--gzhflow/INSIGHT.md)**：把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

<a id="plugin-1418493685-root"></a>

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1336663562-root"></a>

- **[dsh-plugin-translation](data/plugins/863683348--dsh-plugin-translation/INSIGHT.md)**：为模型翻译提供切段、术语抽取、规则质检、语体指引与工作区翻译/术语记忆。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

<a id="plugin-1418769012-root"></a>

- **[dsh-sticker-pack](data/plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md)**：订阅远端表情包清单，镜像图片，向 agent 提供选图工具和 Web/微信渠道贴图提示。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/5V1A-afk/dsh-sticker-pack)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-office-operations"></a>

### [办公与运营（14）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1334428397-root"></a>

- **[@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

- **[dsh-anet](data/plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)**：通过本地AgentNetwork节点发现远端Agent、发送加密任务、跟踪执行并处理有价格的技能。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

<a id="plugin-1335725068-root"></a>

- **[chicheng-stats](data/plugins/534119219--chicheng-stats/INSIGHT.md)**：DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

<a id="plugin-1335382133-root"></a>

- **[赤诚推送 chicheng-push](data/plugins/534119219--chicheng-push/INSIGHT.md)**：统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

<a id="plugin-1335387524-root"></a>

- **[dsh-msg-hub](data/plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)**：把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-other"></a>

### [其他（2）](data/views/categories/OTHER.md)

<a id="plugin-1409096911-root"></a>

- **[dsh-armor-switch](data/plugins/571242--dsh-armor-switch/INSIGHT.md)**：向 DSH 提示词插入覆盖性规则并暴露运行时开关和显式权限预设；当前版禁止新磁盘清洗。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。

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
