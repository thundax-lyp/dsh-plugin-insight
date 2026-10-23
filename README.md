# DSH Plugin Insight [![已研究 439](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=439&color=blue&style=flat)](data/views/categories/INDEX.md)

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 152 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 15 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 37 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 132 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 17 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 83 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 2 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)
- **[@dsh-lsp-packs/dsh-lsp-cpp](data/plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)**：把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **[dsh-fullscreen-input](data/plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 · [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)
- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 · [![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [dsh-model](data/plugins/aicivilization--dsh-model/INSIGHT.md) · 整合模型中转、来源登录与管理、组合切换、设备密钥及每日签到，并同步到DSH。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
- [dsh-ci-diet](data/plugins/0disoft--dsh-ci-diet/INSIGHT.md) · 分析GitHub Actions运行与工作流，标注浪费候选并生成需明确审批的本地YAML补丁。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/0disoft/dsh-ci-diet) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ci-diet)
- [DSH Model Everything](data/plugins/amethystluna--dsh-model-everything/INSIGHT.md) · 为设计与代码断言提供建模Skill、有限模型验证、UML/依赖审查及可复算报告工具。 · [![npm 30d 415](https://img.shields.io/static/v1?label=npm+30d&message=415&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model-everything) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model-everything)
- [dsh-restart-planner](data/plugins/7gzgn--dsh-restart-planner/INSIGHT.md) · 让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。 · [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-restart-planner)
- [dsh-slipway](data/plugins/7gzgn--dsh-slipway/INSIGHT.md) · 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 · [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-slipway)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [DSH Vision Toolkit](data/plugins/anionex--dsh-vision-toolkit/INSIGHT.md) · 为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 · [![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)
- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · 为 DSH 运行状态提供轮换文案、主题、弹幕与鲸尾动画，并保存词库与配置。 · [![GitHub ★ 203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=203&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,169](https://img.shields.io/static/v1?label=npm+30d&message=10%2C169&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
- [dsh-update-checker](data/plugins/airmetro--dsh-update-checker/INSIGHT.md) · 在DSH GUI检查主程序和第三方插件版本，提供备份更新回退与Web重启流程，Desktop主程序转原生更新。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)
- [DSH Calendar](data/plugins/alonefu--dsh-calendar-plugin/INSIGHT.md) · 在DSH侧栏展示Obsidian日记、月历、时间块与待办，并将局部编辑写回Markdown。 · [![npm 30d 5,639](https://img.shields.io/static/v1?label=npm+30d&message=5%2C639&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-calendar)
- [dsh-message-ops](data/plugins/240xu--dsh-message-ops/INSIGHT.md) · 为 DSH 提供消息回撤、删除显示与恢复操作及对应模型工具。 · [![npm 30d 5,119](https://img.shields.io/static/v1?label=npm+30d&message=5%2C119&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（152）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：为 DSH 运行状态提供轮换文案、主题、弹幕与鲸尾动画，并保存词库与配置。 [![GitHub ★ 203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=203&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,169](https://img.shields.io/static/v1?label=npm+30d&message=10%2C169&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1333116579-root"></a>

- **[DSH Computer Use](data/plugins/anionex--dsh-computer-use/INSIGHT.md)**：为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 [![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：为 DSH Web/可选桌面层提供随会话状态变化的 Live2D 宠物、装扮、提示音和共享设置。 [![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d)

<a id="plugin-1387205322-root"></a>

- **[dsh-whale-girl-live2d](data/plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)**：将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。 [![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（15）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1334428397-root"></a>

- **[@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

<a id="plugin-1333954586-root"></a>

- **[dsh-usage-billing](data/plugins/940842546--dsh-usage-billing/INSIGHT.md)**：监听本机 LLM 流量并按峰谷价持久化 token/费用，提供面板、预算告警、导出和余额查询。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,051](https://img.shields.io/static/v1?label=npm+30d&message=1%2C051&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)

<a id="plugin-1335725068-root"></a>

- **[chicheng-stats](data/plugins/534119219--chicheng-stats/INSIGHT.md)**：DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

<a id="plugin-1335382133-root"></a>

- **[赤诚推送 chicheng-push](data/plugins/534119219--chicheng-push/INSIGHT.md)**：统一管理多种推送渠道，通过设置页、pushNotifier服务和HTTP API发送任务通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

<a id="plugin-1335387524-root"></a>

- **[dsh-msg-hub](data/plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)**：把微信、QQ、飞书消息接入 DSH 会话，并提供主动推送与远程审批/状态功能。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（37）](data/views/categories/RESEARCH-KNOWLEDGE.md)

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

<a id="category-software-delivery"></a>

### [软件交付（132）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1336092482-01-content"></a>

- **[dsh-worktable](data/plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)**：在Harness侧栏提供项目容器、分栏窗口、会话绑定与控制室，挂载文件、终端和任务产物。 [![GitHub ★ 781](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=781&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

<a id="plugin-1334304098-packages-helmd"></a>

- **[@adwmc/helm-d](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：为安全分析任务提供知识路由、参考资料、工具门控、案例记录和多类分析脚本。 [![GitHub ★ 431](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=431&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

<a id="plugin-1353534254-root"></a>

- **[DSH Model Router](data/plugins/alice-marx--dsh-model-router/INSIGHT.md)**：在DSH工作台规划任务、比较模型路由并通过API或官方CLI执行依赖工作包。 [![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=yellow&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,168](https://img.shields.io/static/v1?label=npm+30d&message=4%2C168&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

<a id="plugin-1333100390-root"></a>

- **[DSH Turn Rewind](data/plugins/anionex--dsh-turn-rewind/INSIGHT.md)**：按用户消息关联检查点恢复项目文件，并可独立或同时创建回退后的新会话。 [![GitHub ★ 135](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=135&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,574](https://img.shields.io/static/v1?label=npm+30d&message=4%2C574&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

<a id="plugin-1340906871-dsh"></a>

- **[dsh-codex-guard](data/plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)**：在 DSH 中调用 codex-guard，对 Git 变更进行提交前卫生检查。 [![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（17）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1333100071-root"></a>

- **[DSH Vision Toolkit](data/plugins/anionex--dsh-vision-toolkit/INSIGHT.md)**：为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 [![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1339888505-root"></a>

- **[gzhflow](data/plugins/andiii208--gzhflow/INSIGHT.md)**：把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

<a id="plugin-1418493685-root"></a>

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1352959121-root"></a>

- **[@a9i5k4/dsh-ark9canvas](data/plugins/aik358--dsh-ark9canvas/INSIGHT.md)**：提供Harness生图与改图工作台、Agent生图工具、人工审批、多渠道和生成记录。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-customer-service"></a>

### [客户服务（1）](data/views/categories/CUSTOMER-SERVICE.md)

<a id="plugin-1374055714-root"></a>

- **[3chat-customer-growth](data/plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

[更多 客户服务 →](data/views/categories/CUSTOMER-SERVICE.md)

<a id="category-infrastructure"></a>

### [基础设施（83）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：统一管理 MCP、工具账本、专家、Skill 与插件市场入口。 [![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)

<a id="plugin-1387227102-root"></a>

- **[DSH RotaKit](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-other"></a>

### [其他（2）](data/views/categories/OTHER.md)

<a id="plugin-1409096911-root"></a>

- **[dsh-armor-switch](data/plugins/571242--dsh-armor-switch/INSIGHT.md)**：向 DSH 提示词插入覆盖性规则并暴露运行时开关和显式权限预设；当前版禁止新磁盘清洗。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。

[更多 其他 →](data/views/categories/OTHER.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-23
