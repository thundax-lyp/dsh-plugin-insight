# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 121 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 29 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 43 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 93 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 102 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 12 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 3 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

- **[dsh-repeat-stop](data/plugins/173787247--dsh-repeat-stop/INSIGHT.md)**：拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。 适合遭遇同工具同参数反复重试的任务，先核对触发计数与正常轮询排除规则；不能识别全部循环，尚未进行真实宿主验证。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)
- **[dsh-session-diff](data/plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)**：在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 适合快速查看当前会话常规write/edit的改动；先核对双会话同文件和shell改动的覆盖边界，完整审查仍以Git为准，尚未进行真实宿主验证。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)
- **[dsh-sidebar-git-graph](data/plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)**：在DSH右侧栏显示当前会话仓库的分支提交图、工作树和暂存区差异。 适合在会话旁只读查看Git历史、工作树和暂存区；先确认仓库、扫描截断及刷新时点，不把图谱当CI或完整审查，尚未进行真实宿主验证。 · [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)
- **[dsh-which](data/plugins/11111353535--dsh-which/INSIGHT.md)**：解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 适合排查PATH遮蔽与多版本命令冲突，先只查询并与当前shell对照；对可信二进制再启用版本探测，尚未进行真实宿主验证。
- **[URL 正文阅读器](data/plugins/2672243194--dsh-read-url/INSIGHT.md)**：读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 适合抓取结果噪声多、常需中文编码和续读的资料阅读，先与原生抓取对照；表格、动态页和关键事实回读原文，尚未进行真实宿主验证。 · [![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

## [最新](data/views/columns/LATEST.md)

> 发现最近发布或更新的插件，看看有没有你需要的。

- [dsh-model](data/plugins/aicivilization--dsh-model/INSIGHT.md) · 聚合多种模型来源为统一鉴权端点，提供模型目录、来源登录、组合切换与DSH管理页。 · [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-model) [![npm 30d 2,009](https://img.shields.io/static/v1?label=npm+30d&message=2%2C009&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-model) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-model)
- [dsh-obsidian-board](data/plugins/2026heshao--dsh-obsidian-board/INSIGHT.md) · 将本地 Obsidian 笔记库接入 DSH 三栏问答面板，提供本地关键词检索和可点击引用。 · [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-obsidian-board) [![npm 30d 133](https://img.shields.io/static/v1?label=npm+30d&message=133&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-obsidian-board)
- [dsh-websearch](data/plugins/240xu--dsh-websearch/INSIGHT.md) · 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 · [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)
- [helmd](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md) · 提供安全分析预设、领域工具和按需参考，并将Case证据与结论保存在磁盘。 · [![GitHub ★ 380](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=380&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)
- [dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md) · 在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 · [![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory)

## [最热](data/views/columns/HOT.md)

> 看看近期热门的插件，找到适合自己的工具。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 · [![GitHub ★ 195](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=195&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
- [dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md) · 在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。 · [![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 7,237](https://img.shields.io/static/v1?label=npm+30d&message=7%2C237&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)
- [dsh-update-checker](data/plugins/airmetro--dsh-update-checker/INSIGHT.md) · 检查 DSH 与插件版本，提供备份、更新、回滚及重启入口。 · [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)
- [dsh-calendar](data/plugins/alonefu--dsh-calendar-plugin/INSIGHT.md) · 在 DSH 右侧栏读 Obsidian 日记与待办，并受控写回 Markdown。 · [![npm 30d 5,884](https://img.shields.io/static/v1?label=npm+30d&message=5%2C884&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-calendar)
- [dsh-diff-approval](data/plugins/9087--dsh-diff-approval/INSIGHT.md) · 汇总Agent成功文件改动供逐文件或逐块保留、回退，并支持导入本地版本控制差异。 · [![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项，条目同时展示 Star 与已核实的 npm 近30天下载量；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（121）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 [![GitHub ★ 195](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=195&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · **脚本有更新，待重新洞察**

<a id="plugin-1335236592-root"></a>

- **[dsh-computer-use](data/plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)**：为 DSH 提供桌面观察、元素或坐标操作、虚拟光标及应用管理工具。 [![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

<a id="plugin-1378097401-dsh-live2d-pet"></a>

- **[dsh-pet-live2d](data/plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)**：在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。 [![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 7,237](https://img.shields.io/static/v1?label=npm+30d&message=7%2C237&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)

<a id="plugin-1387205322-root"></a>

- **[dsh-whale-girl-live2d](data/plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)**：将DSH会话事件映射为Live2D桌宠动作与状态，并提供输入、钱包和可选桌面外壳。 [![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

<a id="plugin-1333136466-root"></a>

- **[dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)**：以键盘命令面板统一查找原生命令、近期会话和插件入口。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) [![npm 30d 599](https://img.shields.io/static/v1?label=npm+30d&message=599&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（29）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1334428397-root"></a>

- **[dsh-awiki](data/plugins/agentconnect--dsh-awiki/INSIGHT.md)**：把AWiki身份、设备加入/恢复、消息和邮件接入DSH，区分Host管理与模型可用操作。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

<a id="plugin-1363429979-plugin-daily-log"></a>

- **[Forge 工作报告](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)**：汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,971](https://img.shields.io/static/v1?label=npm+30d&message=1%2C971&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

<a id="plugin-1335807482-root"></a>

- **[chicheng-cron](data/plugins/534119219--chicheng-cron/INSIGHT.md)**：在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)

<a id="plugin-1335382133-root"></a>

- **[chicheng-push](data/plugins/534119219--chicheng-push/INSIGHT.md)**：在 DSH 配置多种推送渠道，并通过进程内服务或 HTTP 接口发送通知。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

<a id="plugin-1335387524-root"></a>

- **[dsh-msg-hub](data/plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)**：把微信、QQ、飞书消息接到 DSH 会话，并提供主动推送与远程审批。 [![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,164](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（43）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1341648244-root"></a>

- **[KRouter](data/plugins/398894496-arch--krouter/INSIGHT.md)**：以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。 [![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

<a id="plugin-1335219884-root"></a>

- **[dsh-web-tools](data/plugins/a3boy--dsh-web-tools/INSIGHT.md)**：将多个Web搜索和提取服务以及社交平台接到DSH标准搜索接口，提供路由和故障切换。 [![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

<a id="plugin-1337487779-root"></a>

- **[dsh-ultramath](data/plugins/andiii208--dsh-ultramath/INSIGHT.md)**：向DSH同步数学建模竞赛预设、模型库和论文模板，组织推导、编码、验算及评审流程。 [![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/dsh-ultramath) [![npm 30d 1,438](https://img.shields.io/static/v1?label=npm+30d&message=1%2C438&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ultramath) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ultramath)

<a id="plugin-1335047324-root"></a>

- **[URL 正文阅读器](data/plugins/2672243194--dsh-read-url/INSIGHT.md)**：读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 [![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

<a id="plugin-1331846104-root"></a>

- **[dsh-stock-market](data/plugins/anacondakc--dsh-stock-market/INSIGHT.md)**：为DSH提供沪深A股行情侧栏与股票数据工具，按会话控制工具访问并标注多源回退口径。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### [基础设施（93）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1334255288-root"></a>

- **[dsh-web-lan-access](data/plugins/acidgr--dsh-web-lan-access/INSIGHT.md)**：让DSH网页监听全部网卡，并为局域网页面提供Host能力声明与地址信任配置。 [![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)

<a id="plugin-1413052822-root"></a>

- **[dsh-armory](data/plugins/2026heshao--dsh-armory/INSIGHT.md)**：在 DSH 中管理 MCP、技能、专家、插件市场及工具账本，支持项目作用域与授权引导。 [![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-armory) [![npm 30d 261](https://img.shields.io/static/v1?label=npm+30d&message=261&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-armory) · **脚本有更新，待重新洞察**

<a id="plugin-1387227102-root"></a>

- **[DSH-Official-WorkBuddy-Credit-Proxy](data/plugins/2861292267--dsh-official-workbuddy-credit-proxy/INSIGHT.md)**：将本机 WorkBuddy、CodeBuddy 账号接入 DSH 模型池，并提供多协议代理与积分面板。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/2861292267/DSH-Official-WorkBuddy-Credit-Proxy) [![npm 30d 577](https://img.shields.io/static/v1?label=npm+30d&message=577&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-rotakit) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-rotakit)

<a id="plugin-1334836615-root"></a>

- **[dsh-update-checker](data/plugins/airmetro--dsh-update-checker/INSIGHT.md)**：检查 DSH 与插件版本，提供备份、更新、回滚及重启入口。 [![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,106](https://img.shields.io/static/v1?label=npm+30d&message=7%2C106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（102）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1336092482-01-content"></a>

- **[dsh-worktable（01_content）](data/plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)**：在侧栏提供项目抽屉、分栏窗格、会话绑定与项目产物挂载。 [![GitHub ★ 778](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=778&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)

<a id="plugin-1334304098-packages-helmd"></a>

- **[helmd](data/plugins/adwmc--helm-d--packages-helmd/INSIGHT.md)**：提供安全分析预设、领域工具和按需参考，并将Case证据与结论保存在磁盘。 [![GitHub ★ 380](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=380&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) · **脚本有更新，待重新洞察**

<a id="plugin-1340906871-dsh"></a>

- **[dsh-codex-guard](data/plugins/akimiya-z--codex-guard--dsh/INSIGHT.md)**：在DSH中调用codex-guard CLI，返回提交前卫生检查报告。 [![GitHub ★ 133](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=133&color=yellow&logo=github&style=flat)](https://github.com/Akimiya-z/codex-guard)

<a id="plugin-1334205011-root"></a>

- **[dsh-wsl-workspace](data/plugins/dsh-wsl-workspace-maintainers--dsh-wsl-workspace/INSIGHT.md)**：在DSH界面添加WSL工作区，让会话的命令和文件工具使用Linux路径与发行版环境。 [![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) · **脚本有更新，待重新洞察**

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

- **[AgentDebugX](data/plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)**：按需将DSH当前或选定历史会话接入AgentDebugX诊断，并保存可关联的轨迹与报告。 [![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（12）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 [![GitHub ★ 29](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=29&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

<a id="plugin-1334395883-root"></a>

- **[dsh-LorebookMD](data/plugins/609476965--dsh-lorebookmd/INSIGHT.md)**：管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

<a id="plugin-1339888505-root"></a>

- **[gzhflow](data/plugins/andiii208--gzhflow/INSIGHT.md)**：为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。 [![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

<a id="plugin-1418493685-root"></a>

- **[No AI Style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1352959121-root"></a>

- **[dsh-ark9canvas](data/plugins/aik358--dsh-ark9canvas/INSIGHT.md)**：为DSH提供多渠道图片工作台、批量任务和Agent生图审批队列，生成结果保存为本地路径。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 864](https://img.shields.io/static/v1?label=npm+30d&message=864&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

<a id="category-other"></a>

### [其他（3）](data/views/categories/OTHER.md)

<a id="plugin-1409889533-root"></a>

- **[dsh-codefall](data/plugins/4444hao--dsh-codefall/INSIGHT.md)**：为 DSH 添加数字雨启动动画、矩形光门转场和可调绿色主题。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall) [![npm 30d 407](https://img.shields.io/static/v1?label=npm+30d&message=407&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codefall) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-codefall)

<a id="plugin-1413897334-root"></a>

- **[dsh-ai-arcade](data/plugins/439436269-ctrl--dsh-ai-arcade/INSIGHT.md)**：在 DSH 中提供双脑贪吃蛇和中国象棋，结合本地规则引擎与模型策略解说。 [![npm 30d 299](https://img.shields.io/static/v1?label=npm+30d&message=299&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade)

<a id="plugin-1412161923-root"></a>

- **[dsh-piano](data/plugins/439436269-ctrl--dsh-piano/INSIGHT.md)**：在 DSH 浮动面板中用 Web Audio 合成钢琴音并支持滑动刮奏。 [![npm 30d 560](https://img.shields.io/static/v1?label=npm+30d&message=560&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-piano) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-piano)

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

2026-10-22
