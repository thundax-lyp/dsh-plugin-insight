# 推荐尝试

[返回首页](../../../README.md)

> 看看插件能解决什么问题，以及试用前需要确认什么。

<a id="column-index"></a>

**快速比较**

> 点击插件名查看详细说明。

| 插件 | 主要用途 | 推荐理由 |
| --- | --- | --- |
| [Answer me with HTML](#plugin-1401476500-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。 | 需要交付协议解释或多维比较页面的Agent用户可用已核实短稿试生成单文件HTML。 |
| [no-ai-style](#plugin-1418493685-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [dsh-markdown-live](#plugin-1426477683-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 |
| [dsh-nav-history](#plugin-1429464857-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。 | 适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。 |
| [dsh-wsl-browser](#plugin-1350379388-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 | 频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。 |
| [dsh-wsl-cal](#plugin-1381860995-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。 |
| [EverOS](#plugin-1085086903-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。 | 单用户非敏感memory root先关闭reflection建立基线，验收纠错/索引/取消和恢复后再决定扩展。 |
| [OMA for DeepSeek Harness](#plugin-1145914675-integrations-dsh)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。 | 已有或愿意维护OMA项目规则的DSH开发者，可在项目副本试工具前检查桥。 |
| [OpenWrite](#plugin-1171186947-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 在 DSH 中规划、写作、审稿和管理长篇小说，作品保存在本地目录。 | 愿意备份作品并配置模型的长篇作者，可以在副本上试做一章规划、生成、修订和导出。 |
| [HOL Guard](#plugin-1194748811-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 为Agent动作提供本地策略审查、审批与证据记录，并提供插件和依赖扫描工具。 | 有策略维护能力的开发团队可在单一受支持宿主的副本环境试用。 |
| [Archify](#plugin-1211139949-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过结构化规格生成可交互图形与独立 HTML 说明页的 Agent Skill | 熟悉目标系统并能检查源码的开发者可以用 Archify 试做一条请求链的架构图。 |
| [agent-qa](#plugin-1232322871-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以自然语言运行Web、Android和iOS测试旅程，保存步骤观察、条件判断与知识材料。 | 有QA能力的团队可在测试副本用它补充探索回归。 |
| [Coding Tools MCP](#plugin-1245329241-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过 MCP 为编码客户端提供工作区文件、结构化修改、命令会话和 Git 工具。 | 缺少原生仓库工具的 MCP 客户端用户，可在可丢弃仓库以 safe 模式和本地 stdio 试用读搜与一次结构化修改。 |
| [deja-vu](#plugin-1300173275-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 本地索引多个编码 Agent 的历史会话，并向 DSH 提供检索工具和自动上下文。 | 在个人机器上使用多个编码 Agent 且有非敏感历史的开发者，可限定一个项目试用旧错误与决定检索。 |
| [dsh Browser Control](#plugin-1324996099-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 通过Chrome或Firefox扩展和DSH侧栏，使用结构化文本读取并操作已有登录网页。 | 有重复登录网页任务的DSH用户可先用非敏感测试站点试用。 |
| [dsh-mnemon](#plugin-1329424520-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 为 DSH 组合运行记忆、项目文档和长期记忆来源，并提供每回合查看与管理界面。 | 跨会话反复使用项目资料并愿意维护事实的 DSH 用户，可以用独立本地存储和虚构项目试用分层记忆。 |
| [dsh-stock-market](#plugin-1331846104-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
| [DeepSeek Harness](#plugin-1333065091-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。 | 隔离profile适合有扩展需求的开发者验证可替换契约，未证明生产安全或所有插件兼容。 |
| [DSH Vision Toolkit](#plugin-1333100071-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。 | 使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。 |
| [DSH Turn Rewind](#plugin-1333100390-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 反复让Agent修改同一工作目录的开发者可在副本试用消息锚定文件恢复。 |
| [DSH Computer Use](#plugin-1333116579-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH提供macOS原生应用观察、语义操作和定向输入能力。 | 需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [dsh-verification-receipt](#plugin-1333370288-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。 |
| [DSH Market](#plugin-1333807290-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。 | 维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。 |
| [dsh-context](#plugin-1333961389-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。 | 需要定位长会话上下文膨胀的DSH用户，可在匹配宿主并保持空提示前后缀时核对单个请求。 |
| [@awiki/dsh-plugin](#plugin-1334428397-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 |
| [dsh-mermaid](#plugin-1334569498-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 经常在DSH阅读流程图的用户可保持严格模式和大小限制试用小型Mermaid就地渲染。 |
| [dsh-plugin-tts](#plugin-1334773156-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 | 需要听取助手回答的DSH Web用户可先用单一Edge后端试用非敏感消息朗读。 |
| [DSH Mobile](#plugin-1334817483-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 让手机浏览器或 Android App 通过局域网或远程通道继续使用电脑中的 DSH | 已有 DSH 且需要离开电脑后继续同一会话的个人用户，可以先用完全受信任的手机在局域网试用 DSH Mobile。 |
| [DSH Skills Manager](#plugin-1334830521-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在 DSH 中浏览、启停和管理本地及项目技能，并从仓库安装、更新与恢复技能。 | 维护多个助手与项目技能目录、能保留文件备份的 DSH 用户，可在一个测试项目试用技能启停与仓库更新。 |
| [dsh-read-url](#plugin-1335047324-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 经常读取公开网页资料且能核对原文的DSH用户，可在网络权限明确的profile中试用批次正文提取。 |
| [dsh-plugin-mall](#plugin-1335098475-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。 |
| [dsh-web-tools](#plugin-1335219884-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。 | 公开资料检索有具体价值和小范围试用路径；需核来源、全文/截断和真实支出，不能把可用性当完整性保证。 |
| [DSH × Univer Office](#plugin-1335241492-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 在 DSH 中创建、编辑和审阅多种办公内容，并以隔离草稿管理变更与导出 | 已有 DSH 的个人用户，可以在原文件副本上试用 DSH × Univer Office 的简单表格或文档草稿编辑。 |
| [dsh-md-annotator](#plugin-1335286261-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。 |
| [dsh-permissions](#plugin-1335349535-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。 |
| [dsh-openai-oauth](#plugin-1335992154-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-worktable](#plugin-1336092482-01-content)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在 DSH 侧栏提供项目容器、分栏工作区和会话绑定的工作台插件 | 使用受支持 DSH 版本并愿意管理本地目录的 Windows 个人开发者可以用工作台试用两个低风险项目。 |
| [dsh-plugin-console](#plugin-1336720864-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。 |
| [dsh-message-copy-enhance](#plugin-1337978261-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。 | 经常将技术回答片段摘入Markdown的Web用户可在常用编辑器先试单条消息内的链接、公式和代码，并核对源文；不用于逐字原稿归档或跨消息选区。 |
| [KRouter](#plugin-1341648244-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-thumb](#plugin-1341694685-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 |
| [dsh-api-dashboard](#plugin-1346196699-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 使用多平台API的单用户可在审阅密钥接收方后试用余额与会话估算看板。 |
| [dsh-wsl-open](#plugin-1347958944-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。 |
| [dsh-cap-profile](#plugin-1349267122-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。 |
| [OrcaReplay](#plugin-1350419329-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。 | 能隔离工具副作用的 Agent 开发者，可用无真实秘密的复制项目试用故障录制与严格模型响应回放。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。 |
| [dsh-usage-analytics](#plugin-1356960582-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 |
| [dsh-model-channel-manager](#plugin-1358316691-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 已维护多个可替代文本渠道的用户，可在人工可核查任务中试用首内容输出前的自动切换。 |
| [dsh-super-code](#plugin-1367482095-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 提供编码 Agent 预设、需求绑定任务台账、分层记忆与本机 MCP 委派连接。 | 熟悉DSH且有项目验收流程的开发者可在独立分支试用需求绑定的跨文件任务委派。 |
| [dsh-eteams](#plugin-1372993989-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |
| [3chat-customer-growth](#plugin-1374055714-root)<br>[![分类：客户服务](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1&color=b45309)](../categories/CUSTOMER-SERVICE.md) | 连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 | 适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。 |
| [@240xu/dsh-session-lazy-view](#plugin-1377185339-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。 | 本机只读尾部排查有明确可控试用路径，全文资源与投影完整性限制必须保留。 |
| [dsh-jev-guard](#plugin-1378138611-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH工具执行前组合静态规则、Jev判据和人工升级，检查删除或覆盖风险。 | 在可恢复任务作为附加事故阀试用，核对降级和日志，保留宿主原生权限/审批。 |
| [dsh-plugin-preflight](#plugin-1378350155-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 供反复发布或提交 DSH 插件的作者／维护者作为额外只读预检试用；先选择匹配宿主的目录，对已知正确和已知错误样本核对CLI报告及strict策略，确认工具存在或使用CLI。 |
| [dsh-cache-bricks](#plugin-1386463441-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。 |
| [dock-spreadsheet](#plugin-1400109121-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。 | 同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。 |
| [dsh-redstone-music](#plugin-1401037852-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。 | 本地工件可控，但远程前必须证明听感和回滚。 |
| [AI 残渣清运](#plugin-1406611614-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 规则稳定且有版本控制的项目可先 dry-run 后试用；正式产物零误收和可恢复是硬门槛。 |
| [dsh-fullscreen-input](#plugin-1407166868-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 仅建议在固定宿主、单会话、无敏感且另有副本的纯文本长草稿范围试用：先核主框同步，关闭面板后在宿主主框核对并发送；初期不在面板内新增附件或编辑引用，不以关闭面板当发送回执。 |
| [AIR-pixel Liquid Glass](#plugin-1414238544-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。 | 重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 |
| [dsh-sciwork](#plugin-1416950630-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 提供科研Agent、文件资料库、文献期刊档案、绘图适配和投稿工作台。 | 可备份资料库可试用组织功能，引用/投稿须人工核验，写超时先回读文件而不直接重试。 |
| [dsh-backup-sync](#plugin-1418642133-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 按模块备份和恢复 DSH 技能、插件、配置与记忆，支持基线合并及 WebDAV 同步。 | 适合有备用数据副本的多机 DSH 用户先试技能模块恢复，并暂停同时写入；暂不依赖其作为唯一备份。 |
| [dsh-smart-prompt](#plugin-1419869951-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 发送前改写输入草稿，可追问缺失信息、参考会话并检查关键字面细节。 | 适合愿意逐字审阅草稿的用户先试Light与非关键需求，尤其核对否定、授权和猜测补充。 |
| [dsh-ark-coding-provider](#plugin-1421741516-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。 | 适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。 |
| [dsh-idle-compact](#plugin-1421755278-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在长会话空闲时预生成压缩摘要，并由用户确认后应用到会话。 | 适合经常返回长会话且能观察缓存账单的Web用户，先在非关键任务核对净费用和摘要遗漏。 |
| [dsh-slipway](#plugin-1422359117-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。 | GitHub 插件维护者可在测试仓以默认 dry-run/verify 试用，真实发布仍需逐次人工授权。 |
| [dsh-source-deck](#plugin-1422910686-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 在会话侧栏后台查找资料，筛选和对比候选，并把保留项的不可变快照引用到当前草稿。 | 适合固定0.2.1-rc.2环境中愿意复核原始资料的技术调研者试用，引用快照不替代许可证或代码核查。 |
| [dsh-which](#plugin-1423215529-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。 | 适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。 |
| [dsh-vercel](#plugin-1425044910-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。 | 匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。 |
| [dsh-ai-armor](#plugin-1425045401-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。 | 可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 |
| [dsh-better-workspace-file-manager](#plugin-1425087677-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为工作区文件页增加上传、下载、建目录、移动、删除、拖入聊天和文本编辑。 | 适合Web工作区用户先在有备份的独立目录试上传、下载与编辑，永久删除和批量失败需特别核对。 |
| [dsh-tingdong](#plugin-1426519329-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 把英文音频或文档制成逐句听力课，提供翻译讲解、音轨、练习、间隔复习与导出。 | 短篇低敏感材料可由能审英文者受控试用，先修教材再练，不能把自评掌握当效果。 |
| [dsh-audiobook](#plugin-1426914549-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 搜索或导入读物并分段朗读，保存收听进度、位置心得，支持语音记录和AI讨论。 | 个人低敏感授权读物可受控试用，须抽查提取/断点并明确云语音与AI外发。 |
| [dsh-roam-planner](#plugin-1427038024-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在 DSH 对话与地图中编辑旅行草稿、冻结候选、采用行程并接入地点路线和可选 MCP。 | 适合非交易行程规划小范围试用，逐项核实地点路线，并独立确认采用内容，不能把候选状态当严格人工审批。 |
| [dsh-zh-ui](#plugin-1427300390-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。 | 中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 |
| [dsh-codex-bridge](#plugin-1427331352-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。 | 已登录Codex且能验收产物者可先只读小任务试用，额度快照非硬预算，写任务超时须先核工作树。 |
| [dsh-curate](#plugin-1428582868-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 按消息标重要性、改写模型可见文本，并以备份和区间摘要整理 DSH 会话上下文。 | 能明确长会话关键约束、并愿意先复制非关键会话的 DSH 用户，可试用逐消息标注、纠错和区间整理。 |
| [Reactive Resume](#plugin-249995750-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 独立开源求职应用，支持履历和求职信编辑、文档检查、投递记录及可选AI与MCP接口。 | 需要按岗位反复修订履历并愿意核实事实和文件的用户，可先用虚构履历试用非AI编辑、保存与PDF导出。 |
| [CloudBase AI Toolkit](#plugin-988892963-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以 MCP、场景 Skill 和 IDE 插件把 CloudBase 数据库、存储、函数与部署接入 AI 编码工具。 | 已有 CloudBase 测试环境且能审核 IAM 的开发者，可固定 MCP 版本后试用环境、日志和表结构的只读查询。 |
| [Learn Harness Engineering](#plugin-1195243030-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。 | 已有跨会话或提前报完成问题的开发者，可在项目副本上只改一个环节，并用同任务比较真实结果。 |
| [DSH Plugin Radar](#plugin-1323404274-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 收集DSH插件候选、归并兼容性记录，提供分类目录、静态JSON和可浏览站点。 | 维护插件目录或市场的人，可将雷达静态数据作为只读候选发现输入。 |
| [Awesome DeepSeek Harness（资源目录）](#plugin-1333173677-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 按用途汇集DSH扩展候选的双语目录，附近期、星标、精选链接和独立示例。 | 需要先找DSH扩展候选的用户，可把此资源目录作为分类入口使用。 |
| [dsh-composer-expand](#plugin-1334850903-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。 |
| [dsh-archived-conversations](#plugin-1335060115-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。 | 可信本地HTTP单用户辨认归档可试用，知晓不能恢复/全文且快切要核标题正文。 |
| [dsh-recipe](#plugin-1336583700-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 适合作场景清单与命令草案，逐组件检查并补profile、版本和配置后使用；不能按一行命令假定整套可靠。 |
| [dsh-plugin-education](#plugin-1336663611-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。 | 适合教师审阅下做模板、转换和常规算表，先校数值域与知识答案；正式成绩和能力定级不宜直接自动发布。 |
| [dsh-wsl-env](#plugin-1338530482-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 检测WSL并给系统提示补发行版、路径映射和跨Windows操作指导，减少环境背景重复说明。 | 标准WSL挂载下可试用，检查新会话事实和配套工具；自定义挂载需修提示，不把软规则当执行隔离。 |
| [dock-base](#plugin-1340492184-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 基座职责和复用接口清楚，适合多视图组合；异步关闭/业务缓冲由功能方共同保证，仍需限范围核对。 |
| [@luziyang2026/dsh-question-nav](#plugin-1341946801-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH会话侧边以圆点和悬停卡片索引用户提问，点击按需加载历史并跳转到对应轮次。 | 匹配stable SDK的个人长会话可试用，留意敏感悬停文字、多块缺失与并发跳转，保留手工回看路径。 |
| [dsh-wsl-path](#plugin-1350378631-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在WSL中的DSH提供Linux盘符挂载和Windows/WSL UNC路径文本转换，并附文件系统使用提示。 | 默认挂载同发行版常规路径的小工具无目标写/执行，易核对；跨distro/挂载/特殊名与宿主注册先确认，ok不代表同物理文件。 |
| [dsh-wsl-gpu](#plugin-1350378777-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 汇总WSL的nvidia-smi显存数据和常见本地推理端口线索，给出静态排障提示。 | 适合收集GPU与本地监听线索，仍需核实际进程/GPU归属；别按ok或端口数直接断定可运行和显存独占。 |
| [dsh-wsl-workspace](#plugin-1351853812-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 列出 WSL 发行版并检查 Linux 工作区路径，提示避开 /mnt 性能与语义陷阱。 | 只读、窄范围且失败边界清楚，适合把它作为 WSL 工作区准备提示，但不能自动迁移或把路径标签当性能结论。 |
| [dsh-wsl-clock](#plugin-1351854066-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。 | 可在 WSL 开发环境只读试用，结果需与独立时间命令及故障现象核对。 |
| [dsh-turn-outline](#plugin-1356219122-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 不调用模型，把DSH事件按用户轮次折叠为输入、工具与输出轨迹，并用seq定位回原文。 | 结构化轨迹和跳转有用，限宿主授权明确的本地回看，摘要/缓存与多用户边界需核对。 |
| [dsh-callout](#plugin-1359145352-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH Web将首行五类GitHub式提示标记呈现为主题卡片，监听流式DOM更新并在卸载时有条件恢复标记。 | 重点卡片与保正文/精确卸载路径实用，兼容Web可控试用；先核来源/转义/主题和编辑，颜色不替代判断。 |
| [dsh-session-turn-eta](#plugin-1368581082-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 按会话步长历史估计回合剩余时间，在输入框下显示时间型进度和中断状态。 | 适合改善等待可见性，ETA和即将完成仅为估计；任务/模型变化及长会话需留意偏差与历史排序成本。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 适合本地单用户DSH开发者受控试用会话内Git查阅，先核对访问控制、仓库选择和CLI结果，不把只读视图当授权或原子状态保证。 |
| [dsh-client-ui-font-scale](#plugin-1403442165-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为 DSH 对话字号提供输入区步进器、快捷键和 Ctrl 滚轮控制。 | 适合频繁调整对话字号并接受 Ctrl 滚轮语义变化的人先检查快捷键冲突后试用。 |

<a id="plugin-1401476500-root"></a>

## [Answer me with HTML](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 4,422](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C422&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)

**主要用途**：将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。

**建议**：试用

**推荐理由**：需要交付协议解释或多维比较页面的Agent用户可用已核实短稿试生成单文件HTML。相比手写HTML，源码支持将布局和图坐标交给CLI，作者节时结果尚未在当前任务复现。若图形误导、渲染反复失败或纠错慢于Markdown，应关闭自动附页并退回原草稿。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。若组件错误、图形误导或纠错时间超过直接Markdown，停止自动附页并回到原草稿；敏感文件不因可内联就自动加入输出。视频仅在明确请求且成本可接受时另试。 依据 [Q09](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1418493685-root"></a>

## [no-ai-style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01NGVI-QINGYI/no-ai-style)

**主要用途**：提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。

**建议**：试用

**推荐理由**：适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。详见[Q05](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-veriscope)

**主要用途**：重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

**建议**：试用

**推荐理由**：已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见[Q06](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1426477683-root"></a>

## [dsh-markdown-live](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9426Haruka/dsh-markdown-live)

**主要用途**：在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

**建议**：试用

**推荐理由**：Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见[Q09](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1429464857-root"></a>

## [dsh-nav-history](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)



**主要用途**：为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。

**建议**：试用

**推荐理由**：适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先用普通会话和面板交错导航，检查后退后新访问的分支截断、重载和失效目标；只把它当主视图位置入口。记录不稳定时回侧栏手动查找。[Q03](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/ahacrazy--dsh-nav-history/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-browser)

**主要用途**：从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。

**建议**：试用

**推荐理由**：频繁从 WSL 打开网页的用户可试用；把浏览器页面可见而非 PowerShell 返回作为验收。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合频繁从 WSL 打开文档或本地服务、且只需要“打开”而非抓取/交互的用户试用。成功标准是 http(s) 非法输入全部拒绝、目标页在预定秒数内可见且 localhost 失败能按提示恢复；如果命令返回成功但页面不可见率高，应退回复制链接或专门端口工具。 [Q09](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md#research-q09)

[查看完整分析 →](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-cal)

**主要用途**：把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。

**建议**：试用

**推荐理由**：已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。成功标准是 status 能暴露配置问题、today/list 与 khal 在事件数和时间上一致、陈旧同步被用户识别；出现时区偏移或遗漏时应停止将输出用于自动计划。 [Q09](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md#research-q09)

[查看完整分析 →](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1085086903-root"></a>

## [EverOS](../../plugins/evermind-ai--everos/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 13,600](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C600&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)

**主要用途**：以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。

**建议**：试用

**推荐理由**：单用户非敏感memory root先关闭reflection建立基线，验收纠错/索引/取消和恢复后再决定扩展。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有限试用单用户非敏感记忆，先关reflection测人工笔记基线，再验证纠错、删除、重建与断连；DSH适配单独验收。见 [Q05](../../plugins/evermind-ai--everos/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/evermind-ai--everos/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1145914675-integrations-dsh"></a>

## [OMA for DeepSeek Harness](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,354](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C354&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/first-fluke/oh-my-agent)

**主要用途**：将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。

**建议**：试用

**推荐理由**：已有或愿意维护OMA项目规则的DSH开发者，可在项目副本试工具前检查桥。相比只读Skill再人工检查，它把规则接到真实工具决策，收益仍需统计误拒绝与任务结果。持续误拒绝、关键动作不覆盖或Stop结束被误当通过时，停用桥并回到人工运行检查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md#research-q04)建议规则维护者在项目副本固定版本，先用允许与拒绝两个工具检查，必要时先关autoSetup手工审查模板。把pre阻断、post反馈和有限Stop分开验收；误拒绝持续或未解决被误放行时，停用桥并回人工检查。

[查看完整分析 →](../../plugins/first-fluke--oh-my-agent--integrations-dsh/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1171186947-root"></a>

## [OpenWrite](../../plugins/lipu-jpg--openwrite/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 884](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=884&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiPu-jpg/Openwrite) [![npm 30d 6,332](https://img.shields.io/static/v1?label=npm+30d&message=6%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite)

**主要用途**：在 DSH 中规划、写作、审稿和管理长篇小说，作品保存在本地目录。

**建议**：试用

**推荐理由**：愿意备份作品并配置模型的长篇作者，可以在副本上试做一章规划、生成、修订和导出。相比通用对话加手工文件管理，它把作品上下文和领域操作接到同一工作台，但成稿质量与总成本仍需自己核对。如果出现作品串用、旧稿覆盖或恢复状态不清，应停止原作写入并退回备份编辑。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q04) 先备份作品，在副本完成单章从规划到导出，分别设定聊天、生成和评审预算。恢复后先核对已保存正文与任务状态；无法辨认写入范围、发生串作品或预算失控时停止并使用备份。只建议有条件试用，不把作者的旧版验收当成本轮宿主验证。

[查看完整分析 →](../../plugins/lipu-jpg--openwrite/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1194748811-root"></a>

## [HOL Guard](../../plugins/hashgraph-online--hol-guard/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 1,000](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C000&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hashgraph-online/hol-guard)

**主要用途**：为Agent动作提供本地策略审查、审批与证据记录，并提供插件和依赖扫描工具。

**建议**：试用

**推荐理由**：有策略维护能力的开发团队可在单一受支持宿主的副本环境试用。相比分散的宿主确认，它把动作策略、审批与本地记录连接起来，便于复查为何放行或阻断。若前置覆盖无法确认、误报无法恢复或维护负担过高，就停止扩大部署并保留原有确认。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有策略维护能力的团队可在单一受支持宿主副本试用，先核对前置覆盖、resident失效和误报恢复；若无法承担持续审批与兼容维护，先保留宿主原有确认及定向扫描，不扩大部署。[Q03](../../plugins/hashgraph-online--hol-guard/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/hashgraph-online--hol-guard/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1211139949-root"></a>

## [Archify](../../plugins/tt-a1i--archify/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 90,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90%2C283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)

**主要用途**：通过结构化规格生成可交互图形与独立 HTML 说明页的 Agent Skill

**建议**：试用

**推荐理由**：熟悉目标系统并能检查源码的开发者可以用 Archify 试做一条请求链的架构图。它比直接生成 Mermaid 多提供结构化规格、交互 HTML 和绑定实际文件的阶段证据，沟通收益仍需同任务检验。用户若发现关键关系没有事实支持或修复与复核负担更高，应停止扩展并退回简单图和人工清单。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：熟悉系统的人先对一条请求链做受控试用，以关系正确、读者理解和总人工分钟为验收；关键边无事实支持或修复负担更高时退回简单图。[Q05](../../plugins/tt-a1i--archify/INSIGHT.md#research-q05)

[查看完整分析 →](../../plugins/tt-a1i--archify/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1232322871-root"></a>

## [agent-qa](../../plugins/vostride--agent-qa/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vostride/agent-qa)

**主要用途**：以自然语言运行Web、Android和iOS测试旅程，保存步骤观察、条件判断与知识材料。

**建议**：试用

**推荐理由**：有QA能力的团队可在测试副本用它补充探索回归。相比Agent自报完成，它把步骤条件、屏幕依据和运行器判断连起来，方便复查失败。若后台状态无法独立核验或假通过频繁，就缩小范围并保留原有确定性放行测试。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有QA能力团队可在测试副本把它作为补充探索回归，保留确定性断言并审阅失败证据；关键后台状态或模型误判频繁时缩小范围，不替代既有放行检查。[Q03](../../plugins/vostride--agent-qa/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/vostride--agent-qa/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1245329241-root"></a>

## [Coding Tools MCP](../../plugins/xytom--coding-tools-mcp/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xyTom/coding-tools-mcp)

**主要用途**：通过 MCP 为编码客户端提供工作区文件、结构化修改、命令会话和 Git 工具。

**建议**：试用

**推荐理由**：缺少原生仓库工具的 MCP 客户端用户，可在可丢弃仓库以 safe 模式和本地 stdio 试用读搜与一次结构化修改。相比自建文件和执行工具，它提供统一权限与基线恢复机制，但平台隔离和强杀恢复尚未独立验证。若没有外部隔离却要运行不可信代码、出现无法判定的修改状态或原生工具已足够，应停止并退回原工具或容器方案。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议缺原生工具的MCP用户在可丢弃repo以safe/stdio试用，先读再做可审单改；不可信命令需外部容器，状态不明则停并回原工具。[Q04](../../plugins/xytom--coding-tools-mcp/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/xytom--coding-tools-mcp/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1300173275-root"></a>

## [deja-vu](../../plugins/vshulcz--deja-vu/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,310](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C310&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vshulcz/deja-vu)

**主要用途**：本地索引多个编码 Agent 的历史会话，并向 DSH 提供检索工具和自动上下文。

**建议**：试用

**推荐理由**：在个人机器上使用多个编码 Agent 且有非敏感历史的开发者，可限定一个项目试用旧错误与决定检索。相比逐个工具搜索日志，统一索引与会话上下文减少切换，但作者召回基准尚未独立验证。若出现跨项目敏感内容、引擎故障被当成无记录或旧决定覆盖当前约束，应关闭自动注入并退回原始会话检索。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议个人工作机限定非敏感项目试用，召回仅当线索、原会话与当前代码共同核对；隐私跨项目或错误无匹配出现时关闭自动注入并回原日志。[Q06](../../plugins/vshulcz--deja-vu/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/vshulcz--deja-vu/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1324996099-root"></a>

## [dsh Browser Control](../../plugins/omdsh-dev--dsh-browser/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 908](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=908&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-browser)

**主要用途**：通过Chrome或Firefox扩展和DSH侧栏，使用结构化文本读取并操作已有登录网页。

**建议**：试用

**推荐理由**：有重复登录网页任务的DSH用户可先用非敏感测试站点试用。相比独立无登录浏览器，它保留真实标签页并把编号操作与来源审批接到会话。若页面依赖画布、无法接受正文发送模型或不能核对真实提交结果，就退回人工浏览或隔离自动化。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有重复登录网页任务且接受页面文本发送模型的DSH用户可先在测试站点试用；保持明确共享与审批设置，检查换页和取消；画布任务或敏感正文无法发送时退回人工或隔离自动化。[Q03](../../plugins/omdsh-dev--dsh-browser/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/omdsh-dev--dsh-browser/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1329424520-root"></a>

## [dsh-mnemon](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 719](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=719&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 55,434](https://img.shields.io/static/v1?label=npm+30d&message=55%2C434&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)

**主要用途**：为 DSH 组合运行记忆、项目文档和长期记忆来源，并提供每回合查看与管理界面。

**建议**：试用

**推荐理由**：跨会话反复使用项目资料并愿意维护事实的 DSH 用户，可以用独立本地存储和虚构项目试用分层记忆。相比把所有资料塞进 MEMORY 文件，它固定每回合来源视图并分配常驻与按需读取，但召回和写入成功不保证答案正确。如果项目串记忆、旧错误持续注入或费用不可控，应禁用相关来源并回到手工文件，同时单独核对残留数据与备份。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md#research-q05) 只启用本地来源，用虚构项目验证保存、读取、纠错及禁用，保持手工文件参照；第三方Provider和Git同步先关闭。串项目、旧错持续或预算失控时停该来源，明确备份范围并核对残留，不把receipt当正确性。

[查看完整分析 →](../../plugins/omdsh-dev--dsh-mnemon/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途**：在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**建议**：试用

**推荐理由**：适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见[Q06](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333065091-root"></a>

## [DeepSeek Harness](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 261,276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=261%2C276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

**主要用途**：基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。

**建议**：试用

**推荐理由**：隔离profile适合有扩展需求的开发者验证可替换契约，未证明生产安全或所有插件兼容。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有Agent扩展需求的开发者可在隔离profile以同模型小任务试用，先验收权限、取消及重启，不以架构或semver替代实际功能验收。[Q04](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/deepseek-ai--deepseek-harness/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 907](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=907&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,773](https://img.shields.io/static/v1?label=npm+30d&message=10%2C773&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

**主要用途**：在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。

**建议**：试用

**推荐理由**：使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。相比另开视觉工具再搬运结果，插件把图像证据与产物带回同一会话，这项便利有源码支持但节时未实测。若图像不能出网或坐标核对不可靠，就停止自动动作并退回人工或原生应用接口。 依据 [Q01](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q01)、[Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03)、[Q04](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333100390-root"></a>

## [DSH Turn Rewind](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 138](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=138&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,502](https://img.shields.io/static/v1?label=npm+30d&message=4%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)

**主要用途**：为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。

**建议**：试用

**推荐理由**：反复让Agent修改同一工作目录的开发者可在副本试用消息锚定文件恢复。相比手工对齐Git恢复与新会话，源码支持把预览、救援点及重新开始串联，节时尚未实测。若预览漏掉目标路径、检查点缺失或回滚报错，应停止写回并保留救援材料，退回独立备份或手工Git恢复。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。只有预览范围、救援点和原有Git状态都符合预期才扩大使用；发现缺检查点、范围遗漏或回滚错误时停止写回，保留journal与rescue，以独立备份或手工Git恢复接管。不用于外部数据库或未纳管文件的整体事务回滚。 依据 [Q09](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/anionex--dsh-turn-rewind/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333116579-root"></a>

## [DSH Computer Use](../../plugins/anionex--dsh-computer-use/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,322](https://img.shields.io/static/v1?label=npm+30d&message=3%2C322&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

**主要用途**：为DSH提供macOS原生应用观察、语义操作和定向输入能力。

**建议**：试用

**推荐理由**：需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：需要操作无API原生应用的macOS开发者可先试可丢弃表单或编辑任务。相比临时坐标脚本，插件用观察、租约和确认约束动作，但办结率尚未实测。若应用状态无法可靠观察或操作不可逆，就停止自动重放并改用人工或专用接口。 依据 [Q01](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q01)、[Q03](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q03)、[Q04](../../plugins/anionex--dsh-computer-use/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/anionex--dsh-computer-use/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333357514-root"></a>

## [Qiushi DSH Evidence Audit](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)

**主要用途**：监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。

**建议**：试用

**推荐理由**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/030611--qiushi-dsh-evidence-audit/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt)

**主要用途**：被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

**建议**：试用

**推荐理由**：被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见[Q06](../../plugins/030611--dsh-verification-receipt/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333807290-root"></a>

## [DSH Market](../../plugins/dsh-market--dsh-market/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 8,811](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C811&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 538,384](https://img.shields.io/static/v1?label=npm+30d&message=538%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

**主要用途**：在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。

**建议**：试用

**推荐理由**：维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：维护多个社区插件的DSH用户可先在克隆profile中试用安装和备份流程。相比分散CLI操作，市场加入加载校验和状态对账，但维护节时与全故障恢复未实测。若无法备份恢复或宿主鉴权版本不明，就停止修改主profile并退回原生Discover与人工维护。 依据 [Q01](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q01)、[Q03](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q03)、[Q04](../../plugins/dsh-market--dsh-market/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/dsh-market--dsh-market/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333961389-root"></a>

## [dsh-context](../../plugins/bowenliang123--dsh-context/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 3,566](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C566&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 145,261](https://img.shields.io/static/v1?label=npm+30d&message=145%2C261&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)

**主要用途**：展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。

**建议**：试用

**推荐理由**：需要定位长会话上下文膨胀的DSH用户，可在匹配宿主并保持空提示前后缀时核对单个请求。相比原生token环或手查日志，源码支持从总量跳到请求组成和来源，诊断节时尚未实测。若出现版本fallback、冷读无数据或裁剪/估算无法解释，应停止完整审计用途并退回宿主日志和供应商usage。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：需要排查上下文膨胀的DSH用户，可在匹配宿主上保持prompt前后缀为空，从一个已知请求核对token环、Context Browser与原始日志。只有能回指具体来源才扩大到跨会话统计；遇版本fallback、压力无数据、历史裁剪或估算与账单不符，应停止把图表当完整审计，改看宿主日志/供应商usage。若不需细粒度来源，原生token环足够，无须增加观测层。 依据 [Q09](../../plugins/bowenliang123--dsh-context/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/bowenliang123--dsh-context/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@awiki/dsh-plugin)

**主要用途**：将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。

**建议**：试用

**推荐理由**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/agentconnect--dsh-awiki/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mermaid)

**主要用途**：在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。

**建议**：试用

**推荐理由**：经常在DSH阅读流程图的用户可保持严格模式和大小限制试用小型Mermaid就地渲染。相比复制到独立渲染器，源码支持同页展示、放大并保留源码，理解效率未测。出现页面卡顿、源码与图不符或需要AI修复时，应保留草稿并退回复制源码到独立工具，不直接点击自动发送。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。详见[Q06](../../plugins/aks1st--dsh-mermaid/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

**主要用途**：为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。

**建议**：试用

**推荐理由**：需要听取助手回答的DSH Web用户可先用单一Edge后端试用非敏感消息朗读。相比复制到独立TTS工具，源码把消息归属、播放和停止接在同一界面，完整朗读率与节时未测。发生未经确认的文本外发、持续漏段或停止失效时，应停用插件并退回系统朗读或单一受信语音服务。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议先小范围试用。用非敏感短文本核对按钮、停止、自动播放和错误提示，再单独验证长文本；纯本地场景关闭外部回退，逐一加入所需音色。出现未经确认外发、重复漏读、取消不释放或宿主入口失效时停用。详见[Q09](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334817483-root"></a>

## [DSH Mobile](../../plugins/saya-ch--dsh-mobile/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 637](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=637&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/saya-ch/dsh-mobile) [![npm 30d 17,588](https://img.shields.io/static/v1?label=npm+30d&message=17%2C588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile)

**主要用途**：让手机浏览器或 Android App 通过局域网或远程通道继续使用电脑中的 DSH

**建议**：试用

**推荐理由**：已有 DSH 且需要离开电脑后继续同一会话的个人用户，可以先用完全受信任的手机在局域网试用 DSH Mobile。相比自行拼装代理与配对，它集中提供设备认证、手机入口和撤销连接，但任务执行仍由电脑端 DSH 完成。若撤销后仍可操作或断线后任务状态不明，用户应停止手机操作，回到电脑原会话确认结果并撤销设备。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议已有 DSH、确有离开电脑后继续同一会话需要的个人用户在可信局域网试用。先保存电脑侧退路，以一个无重要副作用的任务配对手机，检查消息与待输入项，再从电脑撤销设备，确认手机新请求失败、已有连接结束。之后才考虑远程隧道，而不是一次启用所有连接方式。 试用成功应是同任务可继续且访问可撤销，不能只看二维码或页面能打开。若已撤销仍能操作、网络中断后任务状态不明却被提示重新提交，或所需第三方连接必须大幅放宽允许路径，应停止并回到电脑端，或已有的可信 VPN 网页流程。多人隔离需求不适合靠配对功能解决。该试用路径是源码支持的有条件判断，没有同版宿主验收，不升级为持续安装建议。 依据见 [Q05](../../plugins/saya-ch--dsh-mobile/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/saya-ch--dsh-mobile/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334830521-root"></a>

## [DSH Skills Manager](../../plugins/michengai--dsh-skills-manager/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 138,355](https://img.shields.io/static/v1?label=npm+30d&message=138%2C355&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)

**主要用途**：在 DSH 中浏览、启停和管理本地及项目技能，并从仓库安装、更新与恢复技能。

**建议**：试用

**推荐理由**：维护多个助手与项目技能目录、能保留文件备份的 DSH 用户，可在一个测试项目试用技能启停与仓库更新。相对手工复制，源码把实际调用来源、同名策略及本地修改检查连成可追溯流程，但技能正文仍须自行审阅。如果禁用后仍调用错误副本、预览后修改被覆盖或恢复报错，应停止更新并保留备份回到人工维护。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先在单个测试项目核对同名启停，再给一个有本地修改的仓库技能预览更新并验收回滚；不熟来源先停用。出现错误副本、未授权覆盖或恢复失败即停止并保留文件，见[Q06](../../plugins/michengai--dsh-skills-manager/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/michengai--dsh-skills-manager/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335047324-root"></a>

## [dsh-read-url](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-read-url)

**主要用途**：读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。

**建议**：试用

**推荐理由**：经常读取公开网页资料且能核对原文的DSH用户，可在网络权限明确的profile中试用批次正文提取。相对逐页fetch和手工清理HTML，源码分析支持统一去噪、分片续读与批次异常隔离，但未实测节时或信息完整率。出现关键事实缺失、分页不完整或网络回退不符合预期时停止使用该结果，退回原页面或受控浏览器核查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合用公开网页查资料并愿意核对原来源的人在独立profile试用，先明确提供方缺失时的网络回退权限，默认不加直连例外；缺页、政策误绕过或预算失控时停用。详见[Q09](../../plugins/2672243194--dsh-read-url/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

**主要用途**：在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。

**建议**：试用

**推荐理由**：开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。详见[Q07](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q07)。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：能备份profile并理解guard重启的维护者可在可丢弃环境小范围试用，先只读发现再评估已审查候选；报告/脚本不清或快照提前消失就停止后续安装。详见[Q07](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A3Boy/dsh-web-tools)

**主要用途**：为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。

**建议**：试用

**推荐理由**：公开资料检索有具体价值和小范围试用路径；需核来源、全文/截断和真实支出，不能把可用性当完整性保证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议在可信本机、公开材料和小预算下试用，逐项回原文验收并记录全部尝试成本。平台来源及停止条件见 [Q05](../../plugins/a3boy--dsh-web-tools/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335241492-root"></a>

## [DSH × Univer Office](../../plugins/dream-num--dsh-univer-office/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![GitHub ★ 612](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=612&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dream-num/dsh-univer-office) [![npm 30d 44,919](https://img.shields.io/static/v1?label=npm+30d&message=44%2C919&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-univer-office)

**主要用途**：在 DSH 中创建、编辑和审阅多种办公内容，并以隔离草稿管理变更与导出

**建议**：试用

**推荐理由**：已有 DSH 的个人用户，可以在原文件副本上试用 DSH × Univer Office 的简单表格或文档草稿编辑。相比脚本直接改文件，它先隔离变更并提供预览和合并审批，但公式业务正确性和 Office 导出保真仍需本人核对。若公式不符、导出丢格式或草稿版本冲突，用户应停止合并并回到原 Office 或 WPS 编辑保留的副本。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/dream-num--dsh-univer-office/INSIGHT.md#research-q04) 单人简单文件副本有限试用，审核后才合并并在原Office程序核对；复杂格式和不互信多用户部署不包含在建议内。

[查看完整分析 →](../../plugins/dream-num--dsh-univer-office/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335286261-root"></a>

## [dsh-md-annotator](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-md-annotator)

**主要用途**：在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。

**建议**：试用

**推荐理由**：适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议有备份文稿的小范围试用，先验块引用/归属和冲突，结束前保存源码导出批注；复杂语法或导出不可靠时回外部编辑器。详见[Q05](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335349535-root"></a>

## [dsh-permissions](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/940842546/dsh-permissions) [![npm 30d 588](https://img.shields.io/static/v1?label=npm+30d&message=588&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permissions)

**主要用途**：在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。

**建议**：试用

**推荐理由**：需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有明确威胁模型、能维护规则和保留宿主沙箱的团队可在非生产 profile 试用；先用只读/模拟工具跑对抗集，再启用 hard 保护真实路径。把它当唯一安全边界、规则无人维护或工具大量通过 shell 二次解释的环境不适合。 详见[Q09](../../plugins/940842546--dsh-permissions/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/940842546--dsh-permissions/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openai-oauth)

**主要用途**：为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

**建议**：试用

**推荐理由**：本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见[Q05](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1336092482-01-content"></a>

## [dsh-worktable](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 801](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=801&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)

**主要用途**：在 DSH 侧栏提供项目容器、分栏工作区和会话绑定的工作台插件

**建议**：试用

**推荐理由**：使用受支持 DSH 版本并愿意管理本地目录的 Windows 个人开发者可以用工作台试用两个低风险项目。它比独立窗口多提供显式结果归属和集中工作区，owner 鉴权及隔离预览也限定了部分页面权限。用户若遇到错挂、刷新后旧结果复活或终端撤权不符合要求，应停止自动挂载和终端并回到原生会话与独立窗口。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：Windows 个人用户在精确支持版本从两个低风险项目试用，先验绑定和文件、再验预览及终端；错挂、旧结果复活或权限撤销不符要求时停止并回到原生会话和独立窗口。[Q06](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/aisland-sjl--dsh-worktable--01-content/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-console)

**主要用途**：在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

**建议**：试用

**推荐理由**：维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q06)。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见[Q06](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1337978261-root"></a>

## [dsh-message-copy-enhance](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asianfleet/dsh-message-copy-enhance) [![npm 30d 1,109](https://img.shields.io/static/v1?label=npm+30d&message=1%2C109&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance)

**主要用途**：将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。

**建议**：试用

**推荐理由**：经常将技术回答片段摘入Markdown的Web用户可在常用编辑器先试单条消息内的链接、公式和代码，并核对源文；不用于逐字原稿归档或跨消息选区。若符号、URL或换行静默丢失，禁用并回原消息复制。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：经常摘录技术回答的人可先试，选取链接、公式和多行代码各一段，粘贴到常用编辑器并逐字核对URL、TeX和换行，再测试禁用后默认复制恢复。首次涉及客户端加载，持续在copy时遍历选区DOM，不调用模型；现金、延迟和人工复核时间没有实测值，不写为零。发布包和Git源码的构建路径不同，源码安装含prepare构建，需确认拿到可加载客户端。失败时可禁用并用原消息或手工复制；若静默丢掉代码符号、公式或链接目标，应停止自动依赖。它不适合要求逐字原始Markdown的归档流程。 [Q04](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/asianfleet--dsh-message-copy-enhance/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/398894496-arch/KRouter)

**主要用途**：让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

**建议**：试用

**推荐理由**：lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见[Q07](../../plugins/398894496-arch--krouter/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/398894496-arch--krouter/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AliceLJY/dsh-thumb)

**主要用途**：将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。

**建议**：试用

**推荐理由**：适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。详见[Q06](../../plugins/aliceljy--dsh-thumb/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,117](https://img.shields.io/static/v1?label=npm+30d&message=4%2C117&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-api-dashboard)

**主要用途**：在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。

**建议**：试用

**推荐理由**：使用多平台API的单用户可在审阅密钥接收方后试用余额与会话估算看板。相比切各平台控制台和手算token，源码支持同页汇总及旧数据提示，实际对账精度和节费未测。未知模型套默认价、旧余额被当实时或密钥去向不符时，应停止预算判断并回官方控制台，不用自更新修复账单问题。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可信单用户本地试用，限定Key接收方和刷新，未知模型先缺价核查，估算与官方账单分开，更新优先宿主管理器。详见[Q06](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-open)

**主要用途**：让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。

**建议**：试用

**推荐理由**：适合个人本地WSL办公文件流程试用；仅打开可信文件，核对宿主路由权限和真实窗口结果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。详见[Q06](../../plugins/173787247--dsh-wsl-open/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1349267122-root"></a>

## [dsh-cap-profile](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ansonfishing/dsh-cap-profile)

**主要用途**：扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。

**建议**：试用

**推荐理由**：适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。需要模型选型结论时补同任务结果对照。[Q03](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/ansonfishing--dsh-cap-profile/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1350419329-root"></a>

## [OrcaReplay](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 287](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=287&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Continuum-AI-Corp/OrcaReplay)

**主要用途**：外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。

**建议**：试用

**推荐理由**：能隔离工具副作用的 Agent 开发者，可用无真实秘密的复制项目试用故障录制与严格模型响应回放。相较只看终端日志，源码支持保存请求、匹配差异和文件检查点，便于区分原录制与新模型调用，但尚未证明质量或总成本改善。遇到未匹配请求、无法确认外部写入或敏感材料残留时，用户应停止回放并退回只读trace检查，生产账号和重要项目暂缓接入。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先用可丢弃、无真实秘密的项目做严格回放，只把匹配视为协议重现；分叉需另看真实任务质量与费用。生产工具或外部写入不明时退回只读trace；分享前检查MCP、文件快照和所有附属原件，见 [Q04](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/continuum-ai-corp--orcareplay/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1356896576-dsh-capmap-viz"></a>

## [dsh-capmap-viz](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1741505640/capmap-skills) [![npm 30d 640](https://img.shields.io/static/v1?label=npm+30d&message=640&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@chenjh12/dsh-capmap-viz)

**主要用途**：解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。

**建议**：试用

**推荐理由**：对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议试用。适合已经维护 CapMap 文档的小团队，只把图当导航并要求关键判断回到原文；先在单 workspace、小图验证 parse/watch/read 和错误展示。没有文档纪律的项目不应为了图而先引入整套格式。 参见[Q04](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q04)、[Q06](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q06)与[Q09](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/1741505640--capmap-skills--dsh-capmap-viz/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3361805598-gif/dsh-usage-analytics)

**主要用途**：在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。

**建议**：试用

**推荐理由**：适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。详见[Q06](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1358316691-root"></a>

## [dsh-model-channel-manager](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArcaneOrion/dsh-model-channel-manager) [![npm 30d 2,291](https://img.shields.io/static/v1?label=npm+30d&message=2%2C291&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@arcaneorion/dsh-model-channel-manager)

**主要用途**：管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。

**建议**：试用

**推荐理由**：已维护多个可替代文本渠道的用户，可在人工可核查任务中试用首内容输出前的自动切换。相对失败后手工换模型，源码分析支持候选过滤和提交后不拼接第二模型，但不保证业务答案合格或硬性总时限。输出中断、候选能力不等价或预算超出预期时停止自动重试，退回固定渠道并核对已有输出和费用。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：在固定RC和受控额度下先用等价候选试用，验收首内容前切换、内容后失败只终止一次、用户取消及重启不重放测试。核对实际上游费用和合格结果；长流不能只依赖totalBudgetMs作硬限额，必要时外加截止。[Q03](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/arcaneorion--dsh-model-channel-manager/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1367482095-root"></a>

## [dsh-super-code](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ArtlexYoung/dsh-super-code) [![npm 30d 2,783](https://img.shields.io/static/v1?label=npm+30d&message=2%2C783&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-super-code)

**主要用途**：提供编码 Agent 预设、需求绑定任务台账、分层记忆与本机 MCP 委派连接。

**建议**：试用

**推荐理由**：熟悉DSH且有项目验收流程的开发者可在独立分支试用需求绑定的跨文件任务委派。相比原生预设的松散交接，源码能拒绝旧版本或错owner的结果，合格补丁率和总费用改善未测。出现未经授权的范围扩展、pending状态不明或结果仅自报通过时，应停止委派并退回原预设及项目测试人工验收。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：熟悉DSH且已有代码验收流程的开发者可在独立分支试用。首次加载预设并确认安装所有权冲突、模型权限与删除模式；持续成本包括父子模型调用、上下文、压缩、检查和长期记忆维护，不能只看调用次数。可选storageDomain不可用会保留任务记忆但失去长期记忆。失败后检查pending持久化和旧binding，不盲重放写工具；以项目原测试、需求对照、总费用与人工时间共同验收。简单任务不应强建台账，未测到收益或出现未经确认的范围扩展就退回宿主原预设。 [Q04](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/artlexyoung--dsh-super-code/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-eteams)

**主要用途**：为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。

**建议**：试用

**推荐理由**：可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。详见[Q08](../../plugins/2507483326--dsh-eteams/INSIGHT.md#research-q08)。

[查看完整分析 →](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1374055714-root"></a>

## [3chat-customer-growth](../../plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)

[![分类：客户服务](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1&color=b45309)](../categories/CUSTOMER-SERVICE.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)

**主要用途**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。

**建议**：试用

**推荐理由**：适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用。已有3Chat组织团队先测试组织只读，再经完整内容/目标确认核极小授权发送、unknown与批次恢复。详见[Q07](../../plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/3chatai-nct--3chatai-deepseek-harness-plugin/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1377185339-root"></a>

## [@240xu/dsh-session-lazy-view](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![npm 30d 1,359](https://img.shields.io/static/v1?label=npm+30d&message=1%2C359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view)

**主要用途**：以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。

**建议**：试用

**推荐理由**：本机只读尾部排查有明确可控试用路径，全文资源与投影完整性限制必须保留。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合本机维护者先用只读小范围试用，默认tail或fast统计；搜索未命中和统计异常必须回原件复核。远程共享服务、任意符号链接目录或需完整审计时暂缓。参见[Q06](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/240xu--dsh-session-lazy-view/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1378138611-root"></a>

## [dsh-jev-guard](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,591](https://img.shields.io/static/v1?label=npm+30d&message=1%2C591&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard)

**主要用途**：在DSH工具执行前组合静态规则、Jev判据和人工升级，检查删除或覆盖风险。

**建议**：试用

**推荐理由**：在可恢复任务作为附加事故阀试用，核对降级和日志，保留宿主原生权限/审批。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先在可恢复目录验证良性、危险及断网样本，再把它作为附加事故阀；降级时看status，保留原生沙箱和审批，不依赖单一判据。[Q06](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/7starsseeker--dsh-jev-guard/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1378350155-root"></a>

## [dsh-plugin-preflight](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AphyTOT/dsh-plugin-preflight)

**主要用途**：以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。

**建议**：试用

**推荐理由**：供反复发布或提交 DSH 插件的作者／维护者作为额外只读预检试用；先选择匹配宿主的目录，对已知正确和已知错误样本核对CLI报告及strict策略，确认工具存在或使用CLI。无finding只代表可见环境内已实现规则未发现问题，不能替代打包、代码审阅和真实宿主验收；误报漏报、简化semver边界及当前宿主兼容尚未独立验证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先对已知正确和已知错误的插件各检查一次，核对规则是否符合当前宿主。把它加入提交前流程，保留真实打包和加载检查；本地链接导致工具缺席时确认CLI路径。[Q03](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/aphytot--dsh-plugin-preflight/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)



**主要用途**：用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。

**建议**：试用

**推荐理由**：适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。详见[Q07](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1400109121-root"></a>

## [dock-spreadsheet](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-spreadsheet)

**主要用途**：在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。

**建议**：试用

**推荐理由**：同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可信私有Host普通文件可条件试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。详见[Q06](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)



**主要用途**：把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。

**建议**：试用

**推荐理由**：本地工件可控，但远程前必须证明听感和回滚。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议试用，但只限本地世界和测试服。先短曲 render、审计划、build、离线试听，备份后再开 RCON；丢音、TPS 异常、凭据暴露或无法恢复旧包即停止。 参见[Q04](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q04)、[Q06](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q06)与[Q09](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/19north--dsh-redstone-music/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)



**主要用途**：按规则把代理副产物移入可恢复回收站，并支持项目结项归档。

**建议**：试用

**推荐理由**：规则稳定且有版本控制的项目可先 dry-run 后试用；正式产物零误收和可恢复是硬门槛。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。成功标准是目标残渣召回达到门槛、正式文件零误收、结项引用全部可打开且 restore latest 可恢复；出现一次无法恢复的误收或 detached 清理无清单即停止自动模式。 [Q09](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md#research-q09)

[查看完整分析 →](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1407166868-root"></a>

## [dsh-fullscreen-input](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fullscreen-input)

**主要用途**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。

**建议**：试用

**推荐理由**：仅建议在固定宿主、单会话、无敏感且另有副本的纯文本长草稿范围试用：先核主框同步，关闭面板后在宿主主框核对并发送；初期不在面板内新增附件或编辑引用，不以关闭面板当发送回执。多引用、附件选择和异步提交尚未实测，当前不能支持富文本日常主力编辑或独立草稿保全。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：固定宿主长文编辑可试用，先小草稿检查引用附件。详见[Q05](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1414238544-root"></a>

## [AIR-pixel Liquid Glass](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIR-pixel/air-pixel-liquid-glass)

**主要用途**：为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。

**建议**：试用

**推荐理由**：重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1416950630-root"></a>

## [dsh-sciwork](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58catmiao/dsh-sciwork)

**主要用途**：提供科研Agent、文件资料库、文献期刊档案、绘图适配和投稿工作台。

**建议**：试用

**推荐理由**：可备份资料库可试用组织功能，引用/投稿须人工核验，写超时先回读文件而不直接重试。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先用副本课题验收导入、计划确认和回执，组织功能限定试用；投稿包逐文件及逐引文复核，遇写超时先查实际状态。[Q06](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/58catmiao--dsh-sciwork/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1418642133-root"></a>

## [dsh-backup-sync](../../plugins/arlenman--dsh-backup-sync/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 361](https://img.shields.io/static/v1?label=npm+30d&message=361&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-backup-sync) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-backup-sync)

**主要用途**：按模块备份和恢复 DSH 技能、插件、配置与记忆，支持基线合并及 WebDAV 同步。

**建议**：试用

**推荐理由**：适合有备用数据副本的多机 DSH 用户先试技能模块恢复，并暂停同时写入；暂不依赖其作为唯一备份。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先从可丢弃技能目录创建包并异机导入，检查新增、本地修改和冲突各一项；确认未选模块不变，失败文件和基线可解释后扩大范围。遇到扫描后修改被覆盖、快照无法恢复或凭据误入包立即停止。[Q06](../../plugins/arlenman--dsh-backup-sync/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/arlenman--dsh-backup-sync/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1419869951-root"></a>

## [dsh-smart-prompt](../../plugins/arrosam--dsh-smart-prompt/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-smart-prompt) [![npm 30d 363](https://img.shields.io/static/v1?label=npm+30d&message=363&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt)

**主要用途**：发送前改写输入草稿，可追问缺失信息、参考会话并检查关键字面细节。

**建议**：试用

**推荐理由**：适合愿意逐字审阅草稿的用户先试Light与非关键需求，尤其核对否定、授权和猜测补充。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：愿意审阅发送前文本、经常写模糊需求的人可从Light和非关键任务试用；先关闭不必要搜索，检查模型与附件发送范围，再对照原稿看约束、否定和权限。成功是相同任务更少来回且总费用和确认时间可接受；出现新增授权、改变验收、长代码丢失或猜测被误当事实时恢复原稿。无需预改写的精确命令直接保持原输入。当前只支持受控试用，不能称无需猜测或自动安全。 [Q06](../../plugins/arrosam--dsh-smart-prompt/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/arrosam--dsh-smart-prompt/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1421741516-root"></a>

## [dsh-ark-coding-provider](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)

**主要用途**：为DSH注册Ark Coding Plan模型路由，适配流式和工具消息，管理API Key/CLI多账户，并展示官方目录与套餐额度。

**建议**：试用

**推荐理由**：适合已有Ark订阅的本机DSH先单账户小样；专用流式/失败轮换和最小CLI环境明确，多账号/额度需核身份/HOME/取消与平台口径。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用，已有订阅用户先可信本机单API Key小请求，确需额度/多账号再核CLI HOME/取消与身份。详见[Q07](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/akiyuki1130--dsh-ark-coding-provider/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1421755278-root"></a>

## [dsh-idle-compact](../../plugins/arrosam--dsh-idle-compact/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 880](https://img.shields.io/static/v1?label=npm+30d&message=880&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-idle-compact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-idle-compact)

**主要用途**：在长会话空闲时预生成压缩摘要，并由用户确认后应用到会话。

**建议**：试用

**推荐理由**：适合经常返回长会话且能观察缓存账单的Web用户，先在非关键任务核对净费用和摘要遗漏。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：经常在超长会话停顿后返回、能核查供应商缓存计费的Web用户可在非关键会话试用。先确认正常idle才准备、恢复活动后失效、应用只回放相同请求，随后用同任务检查摘要遗漏与下一轮费用。以总尝试账单和合格接续共同验收，不能只看应用时零新请求。频繁废弃会话、缓存不可观测或严格保留全部历史的用户先观察；若净费用增加、摘要漏掉关键约束或宿主升级导致匹配失常，应停用。 [Q06](../../plugins/arrosam--dsh-idle-compact/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/arrosam--dsh-idle-compact/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1422359117-root"></a>

## [dsh-slipway](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway)

**主要用途**：预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。

**建议**：试用

**推荐理由**：GitHub 插件维护者可在测试仓以默认 dry-run/verify 试用，真实发布仍需逐次人工授权。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。含大文件、需要 npm/GitLab、无法轮换 PAT 或不能接受部分远端状态的项目不适合。 详见[Q09](../../plugins/7gzgn--dsh-slipway/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/7gzgn--dsh-slipway/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1422910686-root"></a>

## [dsh-source-deck](../../plugins/archaofan--dsh-source-deck/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Archaofan/dsh-source-deck)

**主要用途**：在会话侧栏后台查找资料，筛选和对比候选，并把保留项的不可变快照引用到当前草稿。

**建议**：试用

**推荐理由**：适合固定0.2.1-rc.2环境中愿意复核原始资料的技术调研者试用，引用快照不替代许可证或代码核查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：在明确支持的RC环境用非敏感选型任务试用，先检查搜索/抓页/spawn可用，再核实候选URL和关键许可。成功需引用保留原草稿附件、改判不改旧快照、取消只停该轮；资料错误或预算超界就停止并回原始来源。[Q03](../../plugins/archaofan--dsh-source-deck/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/archaofan--dsh-source-deck/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)



**主要用途**：为 DSH 提供命令路径、同名遮蔽、PATH环境及目录脚本诊断，并可选执行版本探测。

**建议**：试用

**推荐理由**：适合多版本工具链维护者在可信环境试用只读诊断；关闭默认探测，并用真实shell查询核对关键结论。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议在可信工具链环境限定试用只读报告，关闭默认probe，关键决策用真实shell交叉核对；一旦builtin、别名或cwd不一致，停止据此修改环境。详见[Q09](../../plugins/11111353535--dsh-which/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/11111353535--dsh-which/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1425044910-root"></a>

## [dsh-vercel](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@adenxie/dsh-vercel)

**主要用途**：通过OAuth接入Vercel官方MCP，在DSH按Agent搜索加载工具、分页长结果并按需读取随包指南。

**建议**：试用

**推荐理由**：匹配宿主可信单profile可先只读工具试用，核账户/团队再写；多账户并发和强撤销需先补凭据版本契约。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可信单profile从只读工具试用，写操作核官方结果。详见[Q06](../../plugins/adenxie--dsh-vercel/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/adenxie--dsh-vercel/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1425045401-root"></a>

## [dsh-ai-armor](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)



**主要用途**：将Git回归、堆栈、配置、shell转义和MyBatis Plus静态审计工具合并分发。

**建议**：试用

**推荐理由**：可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可先试用静态只读工具；Git bisect只应在干净的可丢弃副本和审阅过的复现命令中运行。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/aaalenwow--dsh-ai-armor/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1425087677-root"></a>

## [dsh-better-workspace-file-manager](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)



**主要用途**：为工作区文件页增加上传、下载、建目录、移动、删除、拖入聊天和文本编辑。

**建议**：试用

**推荐理由**：适合Web工作区用户先在有备份的独立目录试上传、下载与编辑，永久删除和批量失败需特别核对。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合需要Web工作区文件交接的人在独立测试目录先试上传、下载和版本受保护编辑。成本含文件传输流量、ZIP压缩与内存、用户核对内容；没有吞吐或时间样本，不给金额和节时结论。首次需要Host本地fs与客户端插槽，持续承受DOM兼容维护。失败上传有清理，移动与删除需人工核对部分状态；永久删除的恢复依赖外部备份。成功判据是上传同名保留两份、旧版本保存被拒绝、下载字节一致和其他工作区不变；任何静默覆盖或边界外写入都应停止。 [Q04](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/arrosam--dsh-better-workspace-file-manager/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1426519329-root"></a>

## [dsh-tingdong](../../plugins/aicivilization--dsh-tingdong/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tingdong)

**主要用途**：把英文音频或文档制成逐句听力课，提供翻译讲解、音轨、练习、间隔复习与导出。

**建议**：试用

**推荐理由**：短篇低敏感材料可由能审英文者受控试用，先修教材再练，不能把自评掌握当效果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可让能核对英文与译文的个人用短篇低敏感材料试用，先修ASR/翻译再练习；考试成绩承诺、无能力审校或要求原文严格保真的任务先观察。课程错误、时间轴漂移或费用超预算即停止制课。参见[Q06](../../plugins/aicivilization--dsh-tingdong/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/aicivilization--dsh-tingdong/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1426914549-root"></a>

## [dsh-audiobook](../../plugins/aicivilization--dsh-audiobook/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-audiobook)

**主要用途**：搜索或导入读物并分段朗读，保存收听进度、位置心得，支持语音记录和AI讨论。

**建议**：试用

**推荐理由**：个人低敏感授权读物可受控试用，须抽查提取/断点并明确云语音与AI外发。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可让有授权低敏感读物的个人先试用浏览器语音与单本书，抽查提取和断点再启AI/云语音。高敏感笔记、严格无剧透或频繁更新原文时先观察；更新书源前备份并核对位置。参见[Q06](../../plugins/aicivilization--dsh-audiobook/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/aicivilization--dsh-audiobook/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1427038024-root"></a>

## [dsh-roam-planner](../../plugins/antonylang--dsh-roam-planner/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 88](https://img.shields.io/static/v1?label=npm+30d&message=88&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-roam-planner) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-roam-planner)

**主要用途**：在 DSH 对话与地图中编辑旅行草稿、冻结候选、采用行程并接入地点路线和可选 MCP。

**建议**：试用

**推荐理由**：适合非交易行程规划小范围试用，逐项核实地点路线，并独立确认采用内容，不能把候选状态当严格人工审批。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先用非交易测试行程检查地点、路线、候选与重开草稿，人工确认最终内容。订票、开放时间和现场可行性回官方来源核对；需要严格审批时先明确宿主授权配置。[Q03](../../plugins/antonylang--dsh-roam-planner/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/antonylang--dsh-roam-planner/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1427300390-root"></a>

## [dsh-zh-ui](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)



**主要用途**：提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。

**建议**：试用

**推荐理由**：中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1427331352-root"></a>

## [dsh-codex-bridge](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![npm 30d 47](https://img.shields.io/static/v1?label=npm+30d&message=47&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-bridge) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-bridge)

**主要用途**：通过Codex CLI读取账号额度与模型建议，并以可选模型和推理强度委派独立任务。

**建议**：试用

**推荐理由**：已登录Codex且能验收产物者可先只读小任务试用，额度快照非硬预算，写任务超时须先核工作树。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：单人已有账号先只读短任务，核模型/额度/结果；写任务用可恢复工作树，超时先验产物，高价/低额需真实用户接受。参见[Q04](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/ak-blank--dsh-codex-bridge/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1428582868-root"></a>

## [dsh-curate](../../plugins/111222cjyq--dsh-curate/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)



**主要用途**：按消息标重要性、改写模型可见文本，并以备份和区间摘要整理 DSH 会话上下文。

**建议**：试用

**推荐理由**：能明确长会话关键约束、并愿意先复制非关键会话的 DSH 用户，可试用逐消息标注、纠错和区间整理。相比阈值自动压缩，它让人决定哪些原文保留、哪些生成摘要及哪些直接丢弃，但额外人工和模型费用尚未证明能回本。若后续任务丢失约束、供应商拒绝改写历史或出现无法解释的部分提交，应停止压缩并保留原会话、从本地备份手工恢复。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先复制非关键会话，标明必须保留事实，少量应用与压缩后检查下一请求。练习从备份重建，清楚工具对和附件边界；无法承受手工恢复时保留原上下文。[Q04](../../plugins/111222cjyq--dsh-curate/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/111222cjyq--dsh-curate/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-249995750-root"></a>

## [Reactive Resume](../../plugins/reactive-resume--reactive-resume/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 45,009](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45%2C009&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/reactive-resume/reactive-resume)

**主要用途**：独立开源求职应用，支持履历和求职信编辑、文档检查、投递记录及可选AI与MCP接口。

**建议**：试用

**推荐理由**：需要按岗位反复修订履历并愿意核实事实和文件的用户，可先用虚构履历试用非AI编辑、保存与PDF导出。相对文档编辑器加岗位表，源码接好多种文档修改和检查接口，但尚未证明净节时或招聘收益。如果保存版本不明、出现虚构事实或PDF内容异常，应停止外部写入并退回已核实的独立文档。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先限定虚构履历、单标签、非AI编辑/导出，基础通过后再单独授予MCP写或模型访问；出现事实/保存/文件异常即撤权并回独立文档。验收和停止标准见[Q07](../../plugins/reactive-resume--reactive-resume/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/reactive-resume--reactive-resume/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-988892963-root"></a>

## [CloudBase AI Toolkit](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)

**主要用途**：以 MCP、场景 Skill 和 IDE 插件把 CloudBase 数据库、存储、函数与部署接入 AI 编码工具。

**建议**：试用

**推荐理由**：已有 CloudBase 测试环境且能审核 IAM 的开发者，可固定 MCP 版本后试用环境、日志和表结构的只读查询。相比只用 Skill 或切换控制台，它让编码客户端获得真实云操作入口，但敏感确认是与客户端能力有关的软护栏。若环境或权限不清、客户端不能提供所需审批或资源结果无法核实，应停止写入并回控制台处理。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议已有测试环境的开发者固定MCP后限定只读查询试用；未核客户端确认/IAM/环境前不生产删除，状态不明退控制台。[Q04](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/tencentcloudbase--cloudbase-ai-toolkit/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1195243030-root"></a>

## [Learn Harness Engineering](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 21,413](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C413&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/learn-harness-engineering)

**主要用途**：项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。

**建议**：试用

**推荐理由**：已有跨会话或提前报完成问题的开发者，可在项目副本上只改一个环节，并用同任务比较真实结果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：适合已经遇到跨会话丢状态或提前报完成的开发者，先选一个真实失败，在项目副本上加入最少文件，并用相同任务比较前后。已有成熟工程规范的仓库可只参考课程而不全套生成。若只是结构评分变高、实际错误和人工介入没有下降，应删减无效约定，不继续扩充模板。[Q05](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md#research-q05)

[查看完整分析 →](../../plugins/walkinglabs--learn-harness-engineering/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1323404274-root"></a>

## [DSH Plugin Radar](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 1,484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdamPlatin123/dsh-plugin-radar)

**主要用途**：收集DSH插件候选、归并兼容性记录，提供分类目录、静态JSON和可浏览站点。

**建议**：试用

**推荐理由**：维护插件目录或市场的人，可将雷达静态数据作为只读候选发现输入。相比手工聚合社区清单，它提供分类、归并状态和可缓存JSON，兼容性仍需逐项回原仓复查。数据陈旧、版本不匹配或日志无法定位时，停止用状态放行安装并回到上游核查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md#research-q05)建议目录维护者先作为只读发现数据试用，固定完整提交读取并校验，缓存失败保留旧版本日期。逐条版本或日志不匹配就回上游复查，不据历史状态自动安装；自建全量测试不属于公开仓已经可兑现的采用用途。

[查看完整分析 →](../../plugins/adamplatin123--dsh-plugin-radar/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1333173677-root"></a>

## [Awesome DeepSeek Harness（资源目录）](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 405](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=405&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Dominic789654/awesome-deepseek-harness)

**主要用途**：按用途汇集DSH扩展候选的双语目录，附近期、星标、精选链接和独立示例。

**建议**：试用

**推荐理由**：需要先找DSH扩展候选的用户，可把此资源目录作为分类入口使用。比逐仓搜索多了双语组织与近期/精选线索，但没有证明所列目标可安装或适配任务。如果链接失效、类型或版本不清，应停止把条目当推荐，回目标源码与发布信息核验。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有限采用作候选发现资源，无需安装根或执行脚本，目标另行验收。见[Q05](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/dominic789654--awesome-deepseek-harness/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1334850903-root"></a>

## [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/13071301808/dsh-composer-expand) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-expand) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-expand)

**主要用途**：在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。

**建议**：试用

**推荐理由**：功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。详见[Q06](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md#research-q06)。

[查看完整分析 →](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335060115-root"></a>

## [dsh-archived-conversations](../../plugins/aks1st--dsh-archived-conversations/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-archived-conversations) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-archived-conversations)

**主要用途**：在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。

**建议**：试用

**推荐理由**：可信本地HTTP单用户辨认归档可试用，知晓不能恢复/全文且快切要核标题正文。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：本地HTTP单用户只读辨认可试用。详见[Q05](../../plugins/aks1st--dsh-archived-conversations/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/aks1st--dsh-archived-conversations/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1336583700-root"></a>

## [dsh-recipe](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![npm 30d 123](https://img.shields.io/static/v1?label=npm+30d&message=123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recipe) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-recipe)

**主要用途**：把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。

**建议**：试用

**推荐理由**：适合作场景清单与命令草案，逐组件检查并补profile、版本和配置后使用；不能按一行命令假定整套可靠。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：作为选型草案试用，补齐profile/版本/配置再执行。详见[Q05](../../plugins/863683348--dsh-recipe/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/863683348--dsh-recipe/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1336663611-root"></a>

## [dsh-plugin-education](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![npm 30d 940](https://img.shields.io/static/v1?label=npm+30d&message=940&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-education)

**主要用途**：用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。

**建议**：试用

**推荐理由**：适合教师审阅下做模板、转换和常规算表，先校数值域与知识答案；正式成绩和能力定级不宜直接自动发布。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：教师审阅下试用模板/转换，数值与答案复核后使用。详见[Q05](../../plugins/863683348--dsh-plugin-education/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/863683348--dsh-plugin-education/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1338530482-root"></a>

## [dsh-wsl-env](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-env)

**主要用途**：检测WSL并给系统提示补发行版、路径映射和跨Windows操作指导，减少环境背景重复说明。

**建议**：试用

**推荐理由**：标准WSL挂载下可试用，检查新会话事实和配套工具；自定义挂载需修提示，不把软规则当执行隔离。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：标准WSL用户核提示后试用，特殊挂载明确纠正。详见[Q05](../../plugins/173787247--dsh-wsl-env/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-env/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1340492184-root"></a>

## [dock-base](../../plugins/aks1st--dock/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base)

**主要用途**：为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。

**建议**：试用

**推荐理由**：基座职责和复用接口清楚，适合多视图组合；异步关闭/业务缓冲由功能方共同保证，仍需限范围核对。详见[Q05](../../plugins/aks1st--dock/INSIGHT.md#research-q05)。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。详见[Q05](../../plugins/aks1st--dock/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/aks1st--dock/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1341946801-root"></a>

## [@luziyang2026/dsh-question-nav](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,224](https://img.shields.io/static/v1?label=npm+30d&message=1%2C224&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)

**主要用途**：在DSH会话侧边以圆点和悬停卡片索引用户提问，点击按需加载历史并跳转到对应轮次。

**建议**：试用

**推荐理由**：匹配stable SDK的个人长会话可试用，留意敏感悬停文字、多块缺失与并发跳转，保留手工回看路径。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：个人匹配SDK长会话试用；单文本之外不保证完整卡片，重要上下文保留手工回看，切会话避免连点旧任务。详见[Q05](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1350378631-root"></a>

## [dsh-wsl-path](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-path)

**主要用途**：在WSL中的DSH提供Linux盘符挂载和Windows/WSL UNC路径文本转换，并附文件系统使用提示。

**建议**：试用

**推荐理由**：默认挂载同发行版常规路径的小工具无目标写/执行，易核对；跨distro/挂载/特殊名与宿主注册先确认，ok不代表同物理文件。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用，仅默认挂载/同distro/常规绝对路径先人工核身份；多distro或特殊名先观察。详见[Q05](../../plugins/173787247--dsh-wsl-path/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1350378777-root"></a>

## [dsh-wsl-gpu](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-gpu)

**主要用途**：汇总WSL的nvidia-smi显存数据和常见本地推理端口线索，给出静态排障提示。

**建议**：试用

**推荐理由**：适合收集GPU与本地监听线索，仍需核实际进程/GPU归属；别按ok或端口数直接断定可运行和显存独占。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：作为排障线索试用，原始query/targets和进程归属优先。详见[Q05](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-gpu/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1351853812-root"></a>

## [dsh-wsl-workspace](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-workspace)

**主要用途**：列出 WSL 发行版并检查 Linux 工作区路径，提示避开 /mnt 性能与语义陷阱。

**建议**：试用

**推荐理由**：只读、窄范围且失败边界清楚，适合把它作为 WSL 工作区准备提示，但不能自动迁移或把路径标签当性能结论。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议试用。适合在 WSL 新建或排查开发工作区前做只读检查；把结果当提示，不自动迁移。若路径是自定义挂载或项目主要访问 Windows 工具，应先做实际构建/监听基准再决定。 参见[Q04](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q04)、[Q06](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q06)与[Q09](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-workspace/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1351854066-root"></a>

## [dsh-wsl-clock](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-clock)

**主要用途**：提供 clock_doctor 工具，诊断 WSL 与 Windows UTC 时间偏移。

**建议**：试用

**推荐理由**：可在 WSL 开发环境只读试用，结果需与独立时间命令及故障现象核对。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：只在 WSL/Windows 开发环境试用，交叉对照时间与 TLS/JWT 现象，不自动执行重启。详见[Q05](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/173787247--dsh-wsl-clock/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1356219122-root"></a>

## [dsh-turn-outline](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-turn-outline)

**主要用途**：不调用模型，把DSH事件按用户轮次折叠为输入、工具与输出轨迹，并用seq定位回原文。

**建议**：试用

**推荐理由**：结构化轨迹和跳转有用，限宿主授权明确的本地回看，摘要/缓存与多用户边界需核对。详见[Q05](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md#research-q05)。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：宿主授权明确的一人本地长会话可试用作导航摘要，远程/多用户先核会话授权。详见[Q05](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1359145352-root"></a>

## [dsh-callout](../../plugins/aafff623--dsh-callout/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)



**主要用途**：在DSH Web将首行五类GitHub式提示标记呈现为主题卡片，监听流式DOM更新并在卸载时有条件恢复标记。

**建议**：试用

**推荐理由**：重点卡片与保正文/精确卸载路径实用，兼容Web可控试用；先核来源/转义/主题和编辑，颜色不替代判断。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有条件试用，兼容Web/偏好重点卡片用户先核流式/主题/卸载与非标记拒绝；不将视觉类型当内容审查。详见[Q05](../../plugins/aafff623--dsh-callout/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/aafff623--dsh-callout/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1368581082-root"></a>

## [dsh-session-turn-eta](../../plugins/778672151--dsh-session-turn-eta/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/778672151/dsh-session-turn-eta)

**主要用途**：按会话步长历史估计回合剩余时间，在输入框下显示时间型进度和中断状态。

**建议**：试用

**推荐理由**：适合改善等待可见性，ETA和即将完成仅为估计；任务/模型变化及长会话需留意偏差与历史排序成本。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：作为等待提示试用，不据百分比承诺交付。详见[Q05](../../plugins/778672151--dsh-session-turn-eta/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/778672151--dsh-session-turn-eta/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1393980674-root"></a>

## [dsh-sidebar-git-graph](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AFunDog/dsh-sidebar-git-graph)

**主要用途**：在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。

**建议**：试用

**推荐理由**：适合本地单用户DSH开发者受控试用会话内Git查阅，先核对访问控制、仓库选择和CLI结果，不把只读视图当授权或原子状态保证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：本地单用户开发者可先用小仓库试用并与CLI核对；先审查webServer访问控制，出现静默换库、未说明截断或无法解释的差异即回到CLI。尚不足以推荐持续安装。详见[Q09](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1403442165-root"></a>

## [dsh-client-ui-font-scale](../../plugins/aprilcrystal--dsh-client-ui-font-scale/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)



**主要用途**：为 DSH 对话字号提供输入区步进器、快捷键和 Ctrl 滚轮控制。

**建议**：试用

**推荐理由**：适合频繁调整对话字号并接受 Ctrl 滚轮语义变化的人先检查快捷键冲突后试用。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先用步进器与原生设置交替修改，确认数值一致，再检查输入焦点下快捷键及 Ctrl 滚轮是否符合习惯。需要整页放大或出现冲突时保留原生设置路径。[Q03](../../plugins/aprilcrystal--dsh-client-ui-font-scale/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/aprilcrystal--dsh-client-ui-font-scale/INSIGHT.md)

[返回表格](#column-index)

[返回首页](../../../README.md)

## 更新时间

2026-10-29
