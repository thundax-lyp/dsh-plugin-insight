# DSH Plugin Insight [![已研究 490](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=490&color=blue&style=flat)](data/views/categories/INDEX.md)

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 176 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 19 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 45 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 144 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 17 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 86 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 2 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)**：抓取网页并在静态解析、curl 与浏览器路径间选择，返回适合模型消费的内容。 公开静态正文抓取可小范围试用；必须逐页回查来源，动态或登录页面直接切浏览器。 · [![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,067](https://img.shields.io/static/v1?label=npm+30d&message=1%2C067&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)
- **[dsh-message-copy-enhance](data/plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)**：将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。 适合常摘录技术回答的Web用户，先在目标编辑器核对公式、链接和代码；逐字原稿归档应另保留源文。 · [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Asianfleet/dsh-message-copy-enhance) [![npm 30d 1,109](https://img.shields.io/static/v1?label=npm+30d&message=1%2C109&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-message-copy-enhance) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-message-copy-enhance)
- **[@dsh-lsp-packs/dsh-lsp-cpp](data/plugins/988hj7tczd-oss--dsh-lsp-packs--dsh-lsp-cpp/INSIGHT.md)**：把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。 具备 clangd 与编译数据库的 C/C++ 项目可先试用只读导航，并用 rg/编译器结果交叉核对。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **[dsh-plugin-preflight](data/plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)**：以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 适合插件作者作为额外提交前检查试用，明确宿主解析环境，并保留打包、审阅和宿主验证。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AphyTOT/dsh-plugin-preflight)
- **[dsh-fullscreen-input](data/plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 固定宿主长文输入可试用，先核多引用/附件/发送状态；不依赖其独立草稿归档或绝对IME安全保证。 · [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [dsh-language-guard](data/plugins/58fly--dsh-language-guard/INSIGHT.md) · 用多位置系统提示、周期提醒和界面/命令配置设置DSH目标输出语言。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-language-guard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)
- [dsh-custom-plugin](data/plugins/alexpeng07--dsh-custom-plugin/INSIGHT.md) · DSH Web 多功能便利套件，集外观、会话/提示词、用量预算、Mermaid 和备份于一体。 · [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,235](https://img.shields.io/static/v1?label=npm+30d&message=2%2C235&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
- [dsh-model](data/plugins/aicivilization--dsh-model/INSIGHT.md) · 整合模型来源、统一API中转、组合切换和每日签到，并提供DSH管理界面与命令行。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,481](https://img.shields.io/static/v1?label=npm+30d&message=2%2C481&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
- [CI Diet](data/plugins/0disoft--dsh-ci-diet/INSIGHT.md) · 发现 GitHub Actions 潜在浪费，保留证据并预览供人工审查的小幅工作流补丁。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 208](https://img.shields.io/static/v1?label=npm+30d&message=208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ci-diet)
- [dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md) · 为DSH网页挂载Live2D桌宠，支持鼠标互动、换装和会话事件驱动的动作表情。 · [![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 6,432](https://img.shields.io/static/v1?label=npm+30d&message=6%2C432&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [Hindsight Coding Agents](data/plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md) · 为编码 Agent 提供跨会话项目记忆、知识页工具和后台历史及对话摄取。 · [![GitHub ★ 53,255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53%2C255&color=yellow&logo=github&style=flat)](https://github.com/vectorize-io/hindsight) [![npm 30d 55,816](https://img.shields.io/static/v1?label=npm+30d&message=55%2C816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)
- [OpenViking DSH Memory](data/plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md) · 为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。 · [![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=yellow&logo=github&style=flat)](https://github.com/volcengine/OpenViking) [![npm 30d 34,730](https://img.shields.io/static/v1?label=npm+30d&message=34%2C730&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)
- [Archify DSH Skill适配器](data/plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md) · 将固定版本 Archify Skill 作为文件系统 Skill provider 接入 DeepSeek Harness。 · [![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify) [![npm 30d 31,404](https://img.shields.io/static/v1?label=npm+30d&message=31%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)
- [BrowserSkill DSH 插件](data/plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md) · 为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。 · [![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)
- [DSH Vision Toolkit](data/plugins/anionex--dsh-vision-toolkit/INSIGHT.md) · 为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 · [![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（176）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：定制DSH运行状态文案、主题、弹幕与鲸尾动画，并提供设置和词库更新。 [![GitHub ★ 208](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=208&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 9,207](https://img.shields.io/static/v1?label=npm+30d&message=9%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1333116579-root"></a>

- **[DSH Computer Use](data/plugins/anionex--dsh-computer-use/INSIGHT.md)**：为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 [![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：为DSH网页挂载Live2D桌宠，支持鼠标互动、换装和会话事件驱动的动作表情。 [![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 6,432](https://img.shields.io/static/v1?label=npm+30d&message=6%2C432&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)

<a id="plugin-1387205322-root"></a>

- **[dsh-whale-girl-live2d](data/plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)**：将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。 [![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（19）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1276665883-root"></a>

- **[BrowserSkill](data/plugins/tencent--browserskill/INSIGHT.md)**：通过 CLI 和浏览器扩展，让智能体使用现有 Chrome 或 Edge 登录状态执行网页任务。 [![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill)

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

- **[BrowserSkill DSH 插件](data/plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)**：为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。 [![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

<a id="plugin-1334428397-root"></a>

- **[@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

<a id="plugin-1333954586-root"></a>

- **[dsh-usage-billing](data/plugins/940842546--dsh-usage-billing/INSIGHT.md)**：监听本机 LLM 流量并按峰谷价持久化 token/费用，提供面板、预算告警、导出和余额查询。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,051](https://img.shields.io/static/v1?label=npm+30d&message=1%2C051&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)

<a id="plugin-1335725068-root"></a>

- **[chicheng-stats](data/plugins/534119219--chicheng-stats/INSIGHT.md)**：DSH Web 全局用量统计、历史会话回填和可配置侧栏面板，附 DeepSeek 平台余额提示。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-stats)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（45）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1211139949-root"></a>

- **[Archify](data/plugins/tt-a1i--archify/INSIGHT.md)**：将需求、代码关系和解释内容组织成交互式图表及单页 HTML。 [![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify)

<a id="plugin-1128123594-root"></a>

- **[OpenViking](data/plugins/volcengine--openviking/INSIGHT.md)**：以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。 [![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=yellow&logo=github&style=flat)](https://github.com/volcengine/OpenViking)

<a id="plugin-1128123594-examples-dsh-memory-plugin"></a>

- **[OpenViking DSH Memory](data/plugins/volcengine--openviking--examples-dsh-memory-plugin/INSIGHT.md)**：为 DeepSeek Harness 接入 OpenViking 的跨会话记忆、上下文检索和技能访问。 [![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=yellow&logo=github&style=flat)](https://github.com/volcengine/OpenViking) [![npm 30d 34,730](https://img.shields.io/static/v1?label=npm+30d&message=34%2C730&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@openviking/dsh-memory-plugin)

<a id="plugin-1024118326-root"></a>

- **[WeKnora](data/plugins/tencent--weknora/INSIGHT.md)**：面向企业文档理解、混合检索和推理的知识框架，提供问答、智能体与知识整理入口。 [![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=yellow&logo=github&style=flat)](https://github.com/Tencent/WeKnora)

<a id="plugin-1024118326-packages-dsh-weknora"></a>

- **[WeKnora DSH 插件](data/plugins/tencent--weknora--packages-dsh-weknora/INSIGHT.md)**：为 DeepSeek Harness 提供 WeKnora 知识库检索、文档阅读及带引用的问答。 [![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=yellow&logo=github&style=flat)](https://github.com/Tencent/WeKnora) [![npm 30d 4,785](https://img.shields.io/static/v1?label=npm+30d&message=4%2C785&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-software-delivery"></a>

### [软件交付（144）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1211139949-integrations-deepseek-harness"></a>

- **[Archify DSH Skill适配器](data/plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md)**：将固定版本 Archify Skill 作为文件系统 Skill provider 接入 DeepSeek Harness。 [![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify) [![npm 30d 31,404](https://img.shields.io/static/v1?label=npm+30d&message=31%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)

<a id="plugin-1086419061-hindsight-integrations-coding-agents"></a>

- **[Hindsight Coding Agents](data/plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)**：为编码 Agent 提供跨会话项目记忆、知识页工具和后台历史及对话摄取。 [![GitHub ★ 53,255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53%2C255&color=yellow&logo=github&style=flat)](https://github.com/vectorize-io/hindsight) [![npm 30d 55,816](https://img.shields.io/static/v1?label=npm+30d&message=55%2C816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

<a id="plugin-1336092482-01-content"></a>

- **[dsh-worktable](data/plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)**：在Harness侧栏提供项目容器、分栏窗口、会话绑定与控制室，挂载文件、终端和任务产物。 [![GitHub ★ 781](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=781&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

<a id="plugin-1334304098-packages-helmd"></a>

- **[@adwmc/helm-d](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：为安全分析提供案例证据记录、参考路由与多领域分析工具。 [![GitHub ★ 616](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=616&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)

<a id="plugin-1353534254-root"></a>

- **[DSH Model Router](data/plugins/alice-marx--dsh-model-router/INSIGHT.md)**：在DSH工作台规划任务、比较模型路由并通过API或官方CLI执行依赖工作包。 [![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=yellow&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,168](https://img.shields.io/static/v1?label=npm+30d&message=4%2C168&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（17）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1333100071-root"></a>

- **[DSH Vision Toolkit](data/plugins/anionex--dsh-vision-toolkit/INSIGHT.md)**：为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 [![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1418493685-root"></a>

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1339888505-root"></a>

- **[gzhflow](data/plugins/andiii208--gzhflow/INSIGHT.md)**：把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

<a id="plugin-1352959121-root"></a>

- **[@a9i5k4/dsh-ark9canvas](data/plugins/aik358--dsh-ark9canvas/INSIGHT.md)**：提供Harness生图与改图工作台、Agent生图工具、人工审批、多渠道和生成记录。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-customer-service"></a>

### [客户服务（1）](data/views/categories/CUSTOMER-SERVICE.md)

<a id="plugin-1374055714-root"></a>

- **[3chat-customer-growth](data/plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

[更多 客户服务 →](data/views/categories/CUSTOMER-SERVICE.md)

<a id="category-infrastructure"></a>

### [基础设施（86）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1385896447-root"></a>

- **[Our Free Model](data/plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md)**：为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。 [![GitHub ★ 40,083](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C083&color=yellow&logo=github&style=flat)](https://github.com/Ebony-Vinyl/dsh-our-free-model)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：整合DSH的MCP、Skill、专家和插件管理，提供市场入口、安装来源与工具使用账本。 [![GitHub ★ 24](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 459](https://img.shields.io/static/v1?label=npm+30d&message=459&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)

<a id="plugin-1387227102-root"></a>

- **[DSH RotaKit](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：把本机 WorkBuddy/CodeBuddy 账号组成模型池，提供 Chat、Responses、Messages 本地代理与积分状态。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：从 Agent-Body 运行时文件实时展示器官体征、心跳和脉冲的宿主网页。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-other"></a>

### [其他（2）](data/views/categories/OTHER.md)

<a id="plugin-1409096911-root"></a>

- **[dsh-armor-switch](data/plugins/571242--dsh-armor-switch/INSIGHT.md)**：向DSH注册可切换交付规则与普通偏好，提供显式权限预设和既有改动诊断恢复。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。

[更多 其他 →](data/views/categories/OTHER.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-26
