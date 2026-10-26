# DSH Plugin Insight [![已研究 511](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=511&color=blue&style=flat)](data/views/categories/INDEX.md)

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 179 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 21 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 49 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 148 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 20 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 91 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 2 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)
- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 · [![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)
- **[dsh-markdown-live](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md)**：在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9426Haruka/dsh-markdown-live)
- **[dsh-nav-history](data/plugins/ahacrazy--dsh-nav-history/INSIGHT.md)**：为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。 适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。
- **[dsh-wsl-browser](data/plugins/173787247--dsh-wsl-browser/INSIGHT.md)**：从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [Ruflo](data/plugins/ruvnet--ruflo/INSIGHT.md) · 面向Claude Code、Codex等客户端的Agent元宿主，提供任务、路由、状态与协调工具。 · [![GitHub ★ 79,217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=79%2C217&color=yellow&logo=github&style=flat)](https://github.com/ruvnet/ruflo) [![npm 30d 49,674](https://img.shields.io/static/v1?label=npm+30d&message=49%2C674&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/claude-flow)
- [dsh-language-guard](data/plugins/58fly--dsh-language-guard/INSIGHT.md) · 用多位置系统提示、周期提醒和界面/命令配置设置DSH目标输出语言。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-language-guard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)
- [dsh-custom-plugin](data/plugins/alexpeng07--dsh-custom-plugin/INSIGHT.md) · DSH Web 多功能便利套件，集外观、会话/提示词、用量预算、Mermaid 和备份于一体。 · [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,235](https://img.shields.io/static/v1?label=npm+30d&message=2%2C235&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)
- [dsh-model](data/plugins/aicivilization--dsh-model/INSIGHT.md) · 整合模型来源、统一API中转、组合切换和每日签到，并提供DSH管理界面与命令行。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,481](https://img.shields.io/static/v1?label=npm+30d&message=2%2C481&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
- [CI Diet](data/plugins/0disoft--dsh-ci-diet/INSIGHT.md) · 发现 GitHub Actions 潜在浪费，保留证据并预览供人工审查的小幅工作流补丁。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 208](https://img.shields.io/static/v1?label=npm+30d&message=208&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ci-diet)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [REA](data/plugins/morluto--rea/INSIGHT.md) · 独立CLI和MCP服务器，为应用、二进制及运行行为逆向分析返回证据和限制。 · [![GitHub ★ 383,061](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383%2C061&color=yellow&logo=github&style=flat)](https://github.com/morluto/rea) [![npm 30d 634,260](https://img.shields.io/static/v1?label=npm+30d&message=634%2C260&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/rea-agents)
- [dsh-skill-explorer](data/plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md) · 在 DSH 中按来源浏览、创建、编辑和导入 Skill，并提供文件启用标记与回收站管理。 · [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 116,190](https://img.shields.io/static/v1?label=npm+30d&message=116%2C190&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)
- [dsh-remote-web-ui](data/plugins/zhu1090093659--dsh-web--packages-dsh-remote-web-ui/INSIGHT.md) · 通过扫码配对让自有手机或电脑访问同一 DSH Web 界面，并管理设备会话、LAN与可选隧道。 · [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 101,443](https://img.shields.io/static/v1?label=npm+30d&message=101%2C443&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
- [dsh-git-graph](data/plugins/zhu1090093659--dsh-web--packages-dsh-git-graph/INSIGHT.md) · 在 DSH 界面显示 Git 分支与提交图，并管理独立 worktree 和新会话工作区。 · [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,671](https://img.shields.io/static/v1?label=npm+30d&message=94%2C671&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)
- [dsh-ssh](data/plugins/zhu1090093659--dsh-web--packages-dsh-ssh/INSIGHT.md) · 在 DSH 中管理 SSH 主机，提供远端命令、Web 终端、文件传输、隧道和集群工具。 · [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 85,040](https://img.shields.io/static/v1?label=npm+30d&message=85%2C040&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-ssh)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（179）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1069943001-root"></a>

- **[Voyager](data/plugins/voyager-crew--voyager/INSIGHT.md)**：浏览器聊天增强扩展，提供跨AI网页的提示、组织、阅读与导出功能，并支持声明式JSON插件。 [![GitHub ★ 20,463](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C463&color=yellow&logo=github&style=flat)](https://github.com/voyager-crew/voyager) [![npm 30d 1,566](https://img.shields.io/static/v1?label=npm+30d&message=1%2C566&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/voyager) [![最新发布 2015-02-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2015-02-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/voyager)

<a id="plugin-1331636953-packages-dsh-remote-web-ui"></a>

- **[dsh-remote-web-ui](data/plugins/zhu1090093659--dsh-web--packages-dsh-remote-web-ui/INSIGHT.md)**：通过扫码配对让自有手机或电脑访问同一 DSH Web 界面，并管理设备会话、LAN与可选隧道。 [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 101,443](https://img.shields.io/static/v1?label=npm+30d&message=101%2C443&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)

<a id="plugin-1331636953-packages-dsh-skill-explorer"></a>

- **[dsh-skill-explorer](data/plugins/zhu1090093659--dsh-web--packages-dsh-skill-explorer/INSIGHT.md)**：在 DSH 中按来源浏览、创建、编辑和导入 Skill，并提供文件启用标记与回收站管理。 [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 116,190](https://img.shields.io/static/v1?label=npm+30d&message=116%2C190&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skill-explorer)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：定制DSH运行状态文案、主题、弹幕与鲸尾动画，并提供设置和词库更新。 [![GitHub ★ 208](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=208&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 9,207](https://img.shields.io/static/v1?label=npm+30d&message=9%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

<a id="plugin-1333116579-root"></a>

- **[DSH Computer Use](data/plugins/anionex--dsh-computer-use/INSIGHT.md)**：为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（21）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-249995750-root"></a>

- **[Reactive Resume](data/plugins/reactive-resume--reactive-resume/INSIGHT.md)**：开源简历与求职应用，组织编辑、导出、内容检查、AI建议及投递记录。 [![GitHub ★ 44,843](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44%2C843&color=yellow&logo=github&style=flat)](https://github.com/reactive-resume/reactive-resume)

<a id="plugin-306829688-root"></a>

- **[NocoBase](data/plugins/nocobase--nocobase/INSIGHT.md)**：AI与可视化无代码业务平台，将数据模型、页面、权限、工作流及Agent工具组合。 [![GitHub ★ 24,708](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C708&color=yellow&logo=github&style=flat)](https://github.com/nocobase/nocobase)

<a id="plugin-1276665883-root"></a>

- **[BrowserSkill](data/plugins/tencent--browserskill/INSIGHT.md)**：通过 CLI 和浏览器扩展，让智能体使用现有 Chrome 或 Edge 登录状态执行网页任务。 [![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill)

<a id="plugin-1276665883-packages-dsh-plugin-browserskill"></a>

- **[BrowserSkill DSH 插件](data/plugins/tencent--browserskill--packages-dsh-plugin-browserskill/INSIGHT.md)**：为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。 [![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=yellow&logo=github&style=flat)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)

<a id="plugin-1334428397-root"></a>

- **[@awiki/dsh-plugin](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（49）](data/views/categories/RESEARCH-KNOWLEDGE.md)

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

### [软件交付（148）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1209966933-root"></a>

- **[REA](data/plugins/morluto--rea/INSIGHT.md)**：独立CLI和MCP服务器，为应用、二进制及运行行为逆向分析返回证据和限制。 [![GitHub ★ 383,061](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383%2C061&color=yellow&logo=github&style=flat)](https://github.com/morluto/rea) [![npm 30d 634,260](https://img.shields.io/static/v1?label=npm+30d&message=634%2C260&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/rea-agents)

<a id="plugin-1211139949-integrations-deepseek-harness"></a>

- **[Archify DSH Skill适配器](data/plugins/tt-a1i--archify--integrations-deepseek-harness/INSIGHT.md)**：将固定版本 Archify Skill 作为文件系统 Skill provider 接入 DeepSeek Harness。 [![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify) [![npm 30d 31,404](https://img.shields.io/static/v1?label=npm+30d&message=31%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@tt-a1i/archify-dsh)

<a id="plugin-995029641-root"></a>

- **[Ruflo](data/plugins/ruvnet--ruflo/INSIGHT.md)**：面向Claude Code、Codex等客户端的Agent元宿主，提供任务、路由、状态与协调工具。 [![GitHub ★ 79,217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=79%2C217&color=yellow&logo=github&style=flat)](https://github.com/ruvnet/ruflo) [![npm 30d 49,674](https://img.shields.io/static/v1?label=npm+30d&message=49%2C674&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/claude-flow)

<a id="plugin-1086419061-hindsight-integrations-coding-agents"></a>

- **[Hindsight Coding Agents](data/plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)**：为编码 Agent 提供跨会话项目记忆、知识页工具和后台历史及对话摄取。 [![GitHub ★ 53,255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53%2C255&color=yellow&logo=github&style=flat)](https://github.com/vectorize-io/hindsight) [![npm 30d 55,816](https://img.shields.io/static/v1?label=npm+30d&message=55%2C816&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

<a id="plugin-1216785679-root"></a>

- **[Reasonix](data/plugins/esengine--deepseek-reasonix/INSIGHT.md)**：独立开源编码Agent，提供终端、Studio、Web及ACP入口，可由DSH委派任务。 [![GitHub ★ 35,959](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C959&color=yellow&logo=github&style=flat)](https://github.com/esengine/DeepSeek-Reasonix)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（20）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1223170290-root"></a>

- **[OpenDesign](data/plugins/nexu-io--open-design/INSIGHT.md)**：协作AI设计工作区，把设计系统、Agent生成、预览与团队反馈组织在同一项目。 [![GitHub ★ 103,910](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103%2C910&color=yellow&logo=github&style=flat)](https://github.com/nexu-io/open-design)

<a id="plugin-1220744720-root"></a>

- **[awesome-gpt-image-2](data/plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md)**：社区图像案例与结构化提示词模板库，附Agent风格选择Skill和在线画廊。 [![GitHub ★ 35,006](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C006&color=yellow&logo=github&style=flat)](https://github.com/freestylefly/awesome-gpt-image-2)

<a id="plugin-113965016-root"></a>

- **[PicGo](data/plugins/molunerfinn--picgo/INSIGHT.md)**：桌面图片上传与管理工具，支持多图床配置、剪贴板和外部工具接入，并返回可粘贴链接。 [![GitHub ★ 27,409](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=27%2C409&color=yellow&logo=github&style=flat)](https://github.com/Molunerfinn/PicGo)

<a id="plugin-1333100071-root"></a>

- **[DSH Vision Toolkit](data/plugins/anionex--dsh-vision-toolkit/INSIGHT.md)**：为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 [![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-customer-service"></a>

### [客户服务（1）](data/views/categories/CUSTOMER-SERVICE.md)

<a id="plugin-1374055714-root"></a>

- **[3chat-customer-growth](data/plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

[更多 客户服务 →](data/views/categories/CUSTOMER-SERVICE.md)

<a id="category-infrastructure"></a>

### [基础设施（91）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1333065091-root"></a>

- **[DeepSeek Harness](data/plugins/deepseek-ai--deepseek-harness/INSIGHT.md)**：基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。 [![GitHub ★ 261,276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=261%2C276&color=yellow&logo=github&style=flat)](https://github.com/deepseek-ai/deepseek-harness)

<a id="plugin-1385896447-root"></a>

- **[Our Free Model](data/plugins/ebony-vinyl--dsh-our-free-model/INSIGHT.md)**：为 DSH 聚合多渠道模型，提供模型选择、本地兼容网关、用量看板与降级路由。 [![GitHub ★ 40,083](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C083&color=yellow&logo=github&style=flat)](https://github.com/Ebony-Vinyl/dsh-our-free-model)

<a id="plugin-1333321333-root"></a>

- **[DSH Desktop](data/plugins/anywhere-labs--dsh-desktop/INSIGHT.md)**：独立社区Windows/macOS桌面客户端，将固定DeepSeek Harness运行时与窗口、配置及更新组合。 [![GitHub ★ 33,082](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33%2C082&color=yellow&logo=github&style=flat)](https://github.com/anywhere-labs/dsh-desktop)

<a id="plugin-1333175049-root"></a>

- **[Awesome DSH Plugin](data/plugins/awesome-dsh-plugin--awesome-dsh-plugin/INSIGHT.md)**：维护 DSH 社区插件目录，并生成多语言网站和宿主可读取的市场索引。 [![GitHub ★ 20,675](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C675&color=yellow&logo=github&style=flat)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,048](https://img.shields.io/static/v1?label=npm+30d&message=1%2C048&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/awesome-dsh-plugin)

<a id="plugin-1331636953-packages-dsh-plugin-manager"></a>

- **[dsh-plugin-manager](data/plugins/zhu1090093659--dsh-web--packages-dsh-plugin-manager/INSIGHT.md)**：在 DSH 官方插件页检查更新与宿主兼容，并通过官方通道或本机网关管理插件生命周期。 [![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 78,704](https://img.shields.io/static/v1?label=npm+30d&message=78%2C704&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)

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
