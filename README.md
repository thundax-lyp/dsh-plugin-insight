# DSH Plugin Insight

![DSH Plugin Insight](assets/dsh-plugin-insight-banner.png)

按使用场景整理 DSH 插件，提供功能介绍、源码分析、使用建议与证据边界。

## 分类导航

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 30 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 9 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 9 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 38 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 29 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 4 |

## [推荐](data/views/columns/RECOMMENDED.md)

> 根据适用场景、使用价值与验证证据人工选择；待复核项暂停推荐。

- **[dsh-folderwatch](data/plugins/11111353535--dsh-folderwatch/INSIGHT.md)**：监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。 适合外部文件交接频繁的任务，先用 queue 模式和小目录验证漏报、回声与扫描成本；未做宿主验收。
- **[dsh-which](data/plugins/11111353535--dsh-which/INSIGHT.md)**：解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 适合经常排查多版本命令冲突的开发者，先关闭探测并对照实际 shell；未覆盖全部别名与函数语义。
- **[dsh-composer-expand](data/plugins/13071301808--dsh-composer-expand/INSIGHT.md)**：为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。 长提示词编辑者可试用，先验证输入法、候选菜单和发送快捷键，确认禁用可恢复；未做真实宿主验收。

## [最新](data/views/columns/LATEST.md)

> 最近30天已核实的新发布；重要更新待完成版本差异核查后纳入，不按仓库推送排名。

- [agent-clinic](data/plugins/1687210989--agent-clinic/INSIGHT.md) · 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 · 新发布：2026-10-15
- [dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md) · 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 · 新发布：2026-09-25
- [Forge 用量计费](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md) · 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 · 新发布：2026-09-22
- [oh-my-dsh](data/plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md) · 为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 · 新发布：2026-09-21

## [最热](data/views/columns/HOT.md)

> 当前按累计 Star 展示关注度；尚无完整30天增量基线。每仓库仅占一席，指标不代表质量或实际用户数。

- [dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md) · 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 · [![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator)
- [dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md) · 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 · [![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts)
- [dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md) · 以键盘命令面板统一查找原生命令、近期会话和插件入口。 · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight)
- [dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md) · 为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 · [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory)
- [dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md) · 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 · [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard)

## 分类精选

> 各分类按 GitHub Star 降序展示最多 5 项；完整分类页按插件名字母顺序排列。

<a id="category-personal-productivity"></a>

### [个人效率（30）](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="plugin-1333328839-root"></a>

- **[dsh-status-rotator](data/plugins/01virex--dsh-status-rotator/INSIGHT.md)**：为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 [![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator)

<a id="plugin-1333136466-root"></a>

- **[dsh-spotlight](data/plugins/0xsline--dsh-spotlight/INSIGHT.md)**：以键盘命令面板统一查找原生命令、近期会话和插件入口。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight)

<a id="plugin-1334899834-root"></a>

- **[api-balance](data/plugins/02muller25--dsh-api-balance/INSIGHT.md)**：在 DSH Web 输入区显示 DeepSeek 账户余额，支持手动和定时刷新。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance)

<a id="plugin-1409724830-src"></a>

- **[蓝毛小女仆桌宠](data/plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)**：以透明动画桌宠提供陪伴聊天，可选本地模型、在线模型与屏幕观察。 [![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

<a id="plugin-1363429979-plugin-notes"></a>

- **[Forge 便签](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)**：提供 Markdown 便签板、搜索归档和任务泳道，可把便签交给智能体或定时执行。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio)

[更多 个人效率 →](data/views/categories/PERSONAL-PRODUCTIVITY.md)

<a id="category-office-operations"></a>

### [办公与运营（9）](data/views/categories/OFFICE-OPERATIONS.md)

<a id="plugin-1363429979-plugin-daily-log"></a>

- **[Forge 工作报告](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)**：汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio)

<a id="plugin-1342742812-root"></a>

- **[dsh-crypto-portfolio](data/plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)**：以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)

<a id="plugin-1364961230-root"></a>

- **[dsh-team-cost](data/plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)**：按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)

<a id="plugin-1384810806-root"></a>

- **[dsh-device-bridge](data/plugins/173787247--dsh-device-bridge/INSIGHT.md)**：把实现Companion协议的手机或设备接入DSH，提供设备列表、健康查询和动作调用。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)

<a id="plugin-1384810483-root"></a>

- **[dsh-mac-companion](data/plugins/173787247--dsh-mac-companion/INSIGHT.md)**：从DSH经HTTP调用Mac端Companion，支持通知、快捷指令和剪贴板读写。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion)

[更多 办公与运营 →](data/views/categories/OFFICE-OPERATIONS.md)

<a id="category-research-knowledge"></a>

### [研究与知识（9）](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

- **[dsh-cortex](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)**：按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1334269686-root"></a>

- **[dsh-scrape-webpage](data/plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)**：抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 [![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage)

<a id="plugin-1363429979-plugin-memory"></a>

- **[Forge 记忆](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)**：为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio)

<a id="plugin-1334654243-root"></a>

- **[dsh-plugin-tavily](data/plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)**：把Tavily搜索与页面提取接入宿主web服务，提供参数设置、额度状态与引擎切换。 [![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)

<a id="plugin-1359423472-root"></a>

- **[dsh-codevault](data/plugins/1014029855--dsh-codevault/INSIGHT.md)**：把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。 [![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)

[更多 研究与知识 →](data/views/categories/RESEARCH-KNOWLEDGE.md)

<a id="category-infrastructure"></a>

### [基础设施（38）](data/views/categories/INFRASTRUCTURE.md)

<a id="plugin-1366089972-workspace-plugins-dsh-anatomy-panel"></a>

- **[dsh-anatomy-panel](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-anatomy-panel/INSIGHT.md)**：读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1346196699-root"></a>

- **[dsh-api-dashboard](data/plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)**：在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard)

<a id="plugin-1366089972-workspace-plugins-dsh-organism"></a>

- **[dsh-organism](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-organism/INSIGHT.md)**：把插件组织为可观测器官，提供心跳、反射、自愈账本和工具schema按需门控。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1343420855-root"></a>

- **[dsh-ui-auth](data/plugins/0qwq0--dsh-ui-auth/INSIGHT.md)**：为 DSH Web 提供登录、用户管理和认证网关，并支持 TOTP、Passkey 与会话隔离。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth)

<a id="plugin-1363429979-plugin-usage-billing"></a>

- **[Forge 用量计费](data/plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)**：从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio)

[更多 基础设施 →](data/views/categories/INFRASTRUCTURE.md)

<a id="category-software-delivery"></a>

### [软件交付（29）](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="plugin-1339316901-root"></a>

- **[dsh-project-memory](data/plugins/00080000--dsh-project-memory/INSIGHT.md)**：为项目保存任务、文档、代码符号与经验记录，支持跨会话检索和按条件注入。 [![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory)

<a id="plugin-1366089972-workspace-plugins-dsh-zero-residence"></a>

- **[dsh-zero-residence](data/plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-zero-residence/INSIGHT.md)**：把长会话内容压缩为可回查指针，提供账本、召回、强制压缩和异步命令入口。 [![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

<a id="plugin-1379204512-root"></a>

- **[oh-my-dsh](data/plugins/1225sakura--oh-my-deepseekharness/INSIGHT.md)**：为 DSH 提供角色、Skill 与多智能体协调协议，支持自动推进和显式团队流程。 [![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness)

<a id="plugin-1335559646-root"></a>

- **[dsh-trellis](data/plugins/1264459640--dsh-trellis/INSIGHT.md)**：以任务步骤和阶段约束开发流程，提供验收门禁与可选规划期写工具过滤。 [![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis)

<a id="plugin-1337916824-root"></a>

- **[dsh-mysql](data/plugins/1321928757--dsh-mysql/INSIGHT.md)**：管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。 [![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql)

[更多 软件交付 →](data/views/categories/SOFTWARE-DELIVERY.md)

<a id="category-content-creation"></a>

### [内容生产（4）](data/views/categories/CONTENT-CREATION.md)

<a id="plugin-1334773156-root"></a>

- **[dsh-plugin-tts](data/plugins/1624318455--dsh-plugin-tts/INSIGHT.md)**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 [![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts)

<a id="plugin-1418493685-root"></a>

- **[No AI Style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**：以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 [![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

<a id="plugin-1381725238-root"></a>

- **[dsh-wsl-media](data/plugins/173787247--dsh-wsl-media/INSIGHT.md)**：在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 [![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

<a id="plugin-1399694663-root"></a>

- **[dsh-media-studio](data/plugins/1497105876--dsh-media-studio/INSIGHT.md)**：在DSH聊天中生成图片与视频，发送本地媒体，并提供后台任务与内联展示。 [![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio)

[更多 内容生产 →](data/views/categories/CONTENT-CREATION.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-20
