# 推荐尝试

[返回首页](../../../README.md)

> 看看插件能解决什么问题，以及试用前需要确认什么。

<a id="column-index"></a>

**快速比较**

> 点击插件名查看详细说明。

| 插件 | 主要用途 | 推荐理由 |
| --- | --- | --- |
| [no-ai-style](#plugin-1418493685-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [dsh-markdown-live](#plugin-1426477683-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。 |
| [dsh-wsl-cal](#plugin-1381860995-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 已稳定使用 khal 且只需只读日程的 WSL 用户可试用；必须验证时区和同步陈旧边界。 |
| [dsh Browser Control](#plugin-1324996099-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 通过Chrome或Firefox扩展和DSH侧栏，使用结构化文本读取并操作已有登录网页。 | 有重复登录网页任务的DSH用户可先用非敏感测试站点试用。 |
| [dsh-stock-market](#plugin-1331846104-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
| [DSH Vision Toolkit](#plugin-1333100071-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH会话中接入图像问答、OCR、定位、截图差异和视觉产物。 | 使用文字模型的DSH开发者可先拿非敏感截图做定位或差异检查。 |
| [DSH Turn Rewind](#plugin-1333100390-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。 | 反复让Agent修改同一工作目录的开发者可在副本试用消息锚定文件恢复。 |
| [Qiushi DSH Evidence Audit](#plugin-1333357514-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。 | 需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 |
| [DSH Taskboard](#plugin-1333732838-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为 DSH 提供本地 SQLite 项目看板、Agent 任务工具、原生会话执行与自动化。 | 已有本地 DSH 项目且愿意人工验收的操作者可以在独立测试库中试用 Taskboard 管理多会话任务。 |
| [@awiki/dsh-plugin](#plugin-1334428397-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 将AWiki身份、私信、群聊与邮件接入DSH，提供Web界面和通信工具。 | 已有AWiki需求者可在关闭入站监听的前提下试用收发工具，先固定身份、审批和失败重放边界。 |
| [dsh-mermaid](#plugin-1334569498-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。 | 经常在DSH阅读流程图的用户可保持严格模式和大小限制试用小型Mermaid就地渲染。 |
| [dsh-plugin-tts](#plugin-1334773156-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 | 需要听取助手回答的DSH Web用户可先用单一Edge后端试用非敏感消息朗读。 |
| [dsh-read-url](#plugin-1335047324-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 读取网页、JSON和RSS等内容，提取正文并输出紧凑文本或Markdown，支持批量读取与站点爬取。 | 经常读取公开网页资料且能核对原文的DSH用户，可在网络权限明确的profile中试用批次正文提取。 |
| [dsh-plugin-mall](#plugin-1335098475-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在DSH中搜索GitHub插件、查看兼容预检，并通过后台任务安装、更新或移除profile插件。 | 开放发现和预检有明确价值，能备份并使用guard路径的维护者可在可丢弃profile试用；早commit与运行验收缺口不支持持续安装结论。 |
| [dsh-web-tools](#plugin-1335219884-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 为DSH提供多供应商网页搜索与抓取，以及小红书和X浏览器来源接入。 | 公开资料检索有具体价值和小范围试用路径；需核来源、全文/截断和真实支出，不能把可用性当完整性保证。 |
| [dsh-md-annotator](#plugin-1335286261-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 在 Better Sidebar 中预览和编辑 Markdown，添加块/选区批注并整理到所属会话草稿。 | 适合已有Better Sidebar且文稿有备份的用户试用；保存源码、导出批注并核对报告所属会话，刷新前防丢稿。 |
| [dsh-permissions](#plugin-1335349535-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在工具执行前应用 hard、deny、ask、allow 四级规则，并提供 workspace/global 草稿式权限编辑器。 | 需要细粒度工具门禁的团队可在保留宿主沙箱前提下试用，并先验证路径旁路与规则回滚。 |
| [dsh-openai-oauth](#plugin-1335992154-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-plugin-console](#plugin-1336720864-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。 |
| [dsh-message-copy-enhance](#plugin-1337978261-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。 | 经常将技术回答片段摘入Markdown的Web用户可在常用编辑器先试单条消息内的链接、公式和代码，并核对源文；不用于逐字原稿归档或跨消息选区。 |
| [KRouter](#plugin-1341648244-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-thumb](#plugin-1341694685-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 适合愿意自行维护的个人窄屏DSH用户受控试用，先核对列定位、设置与轨迹交互并保留关闭重载路径；不把免hash当免维护。 |
| [dsh-api-dashboard](#plugin-1346196699-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在DSH界面汇聚多平台余额/额度、会话及子代理用量估算，支持刷新告警、自定义端点与手动确认更新。 | 使用多平台API的单用户可在审阅密钥接收方后试用余额与会话估算看板。 |
| [dsh-cap-profile](#plugin-1349267122-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。 | 适合将其作为本地日志排查索引试用，先核对真实数据和模型归因，不据错误率直接做能力排名。 |
| [OrcaReplay](#plugin-1350419329-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。 | 能隔离工具副作用的 Agent 开发者，可用无真实秘密的复制项目试用故障录制与严格模型响应回放。 |
| [dsh-capmap-viz](#plugin-1356896576-dsh-capmap-viz)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 解析 CapMap 文档并在 DSH 侧栏展示能力图、状态、前沿和校验门。 | 对已有 CapMap 文档的团队有清晰只读导航价值，但必须把图视为声明并回查原文。 |
| [dsh-usage-analytics](#plugin-1356960582-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 适合本机个人用户对小样本受控试用并核对用量字段和索引状态；不作账单、技能成果成功率或多人权限保证。 |
| [dsh-model-channel-manager](#plugin-1358316691-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 管理 DSH 模型渠道和轮询组，提供故障转移、模型测试、测速及健康统计界面。 | 已维护多个可替代文本渠道的用户，可在人工可核查任务中试用首内容输出前的自动切换。 |
| [dsh-eteams](#plugin-1372993989-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |
| [3chat-customer-growth](#plugin-1374055714-root)<br>[![分类：客户服务](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%AE%A2%E6%88%B7%E6%9C%8D%E5%8A%A1&color=b45309)](../categories/CUSTOMER-SERVICE.md) | 连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。 | 适合已有3Chat组织团队用测试组织先只读再极小授权发送；动态契约、单次防重放和unknown收据具体，仍须核完整确认/权限和跨调用幂等。 |
| [@240xu/dsh-session-lazy-view](#plugin-1377185339-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。 | 本机只读尾部排查有明确可控试用路径，全文资源与投影完整性限制必须保留。 |
| [dsh-plugin-preflight](#plugin-1378350155-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 以 CLI 和模型工具预检 DSH 插件清单、patch、客户端包和预发布 peer 范围。 | 供反复发布或提交 DSH 插件的作者／维护者作为额外只读预检试用；先选择匹配宿主的目录，对已知正确和已知错误样本核对CLI报告及strict策略，确认工具存在或使用CLI。 |
| [dsh-cache-bricks](#plugin-1386463441-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。 | 适合本地单用户维护者试用缓存诊断；先核对usage口径、隐私访问和记录淘汰，不把颜色当优化效果。 |
| [dock-spreadsheet](#plugin-1400109121-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。 | 同屏五格式与坐标/文本细节实用，可信私有Host普通文件可试；先核授权/资源和缓存/排序边界。 |
| [dsh-redstone-music](#plugin-1401037852-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。 | 本地工件可控，但远程前必须证明听感和回滚。 |
| [AI 残渣清运](#plugin-1406611614-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 按规则把代理副产物移入可恢复回收站，并支持项目结项归档。 | 规则稳定且有版本控制的项目可先 dry-run 后试用；正式产物零误收和可恢复是硬门槛。 |
| [dsh-fullscreen-input](#plugin-1407166868-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 仅建议在固定宿主、单会话、无敏感且另有副本的纯文本长草稿范围试用：先核主框同步，关闭面板后在宿主主框核对并发送；初期不在面板内新增附件或编辑引用，不以关闭面板当发送回执。 |
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
| [Learn Harness Engineering](#plugin-1195243030-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。 | 已有跨会话或提前报完成问题的开发者，可在项目副本上只改一个环节，并用同任务比较真实结果。 |
| [Awesome DeepSeek Harness（资源目录）](#plugin-1333173677-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 按用途汇集DSH扩展候选的双语目录，附近期、星标、精选链接和独立示例。 | 需要先找DSH扩展候选的用户，可把此资源目录作为分类入口使用。 |
| [dsh-composer-expand](#plugin-1334850903-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 功能窄且无额外外部数据面，长稿单composer场景可控试用；先核IME/菜单/撤销和收起，广兼容表不等于操作验证。 |
| [dsh-archived-conversations](#plugin-1335060115-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。 | 可信本地HTTP单用户辨认归档可试用，知晓不能恢复/全文且快切要核标题正文。 |
| [dsh-recipe](#plugin-1336583700-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。 | 适合作场景清单与命令草案，逐组件检查并补profile、版本和配置后使用；不能按一行命令假定整套可靠。 |
| [dsh-plugin-education](#plugin-1336663611-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。 | 适合教师审阅下做模板、转换和常规算表，先校数值域与知识答案；正式成绩和能力定级不宜直接自动发布。 |
| [dock-base](#plugin-1340492184-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。 | 基座职责和复用接口清楚，适合多视图组合；异步关闭/业务缓冲由功能方共同保证，仍需限范围核对。 |
| [@luziyang2026/dsh-question-nav](#plugin-1341946801-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH会话侧边以圆点和悬停卡片索引用户提问，点击按需加载历史并跳转到对应轮次。 | 匹配stable SDK的个人长会话可试用，留意敏感悬停文字、多块缺失与并发跳转，保留手工回看路径。 |
| [dsh-turn-outline](#plugin-1356219122-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 不调用模型，把DSH事件按用户轮次折叠为输入、工具与输出轨迹，并用seq定位回原文。 | 结构化轨迹和跳转有用，限宿主授权明确的本地回看，摘要/缓存与多用户边界需核对。 |
| [dsh-callout](#plugin-1359145352-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH Web将首行五类GitHub式提示标记呈现为主题卡片，监听流式DOM更新并在卸载时有条件恢复标记。 | 重点卡片与保正文/精确卸载路径实用，兼容Web可控试用；先核来源/转义/主题和编辑，颜色不替代判断。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH右侧栏查看当前会话仓库的提交关系、工作树改动和文件差异。 | 适合本地单用户DSH开发者受控试用会话内Git查阅，先核对访问控制、仓库选择和CLI结果，不把只读视图当授权或原子状态保证。 |
| [dsh-client-ui-font-scale](#plugin-1403442165-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为 DSH 对话字号提供输入区步进器、快捷键和 Ctrl 滚轮控制。 | 适合频繁调整对话字号并接受 Ctrl 滚轮语义变化的人先检查快捷键冲突后试用。 |
| [dsh-pinned-sessions](#plugin-1407379611-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 为 DSH 侧栏提供跨工作区置顶会话分组，支持组内搜索、状态显示、打开与取消置顶。 | 适合多工作区用户小范围试用置顶聚合；先核对宿主DOM、状态和unpin，保留原生导航退路。 |
| [dsh-rtl-chat](#plugin-1410794267-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 给会话消息区提供RTL/LTR切换和本地偏好，代码保持LTR，适合阿拉伯语阅读。 | 阿拉伯语为主的匹配Web宿主可本地试用，先核混排与代码，理解全局偏好；热卸载后留意残按钮样式。 |
| [dsh-pick](#plugin-1423941835-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 从插件目录搜索、比较和排行 DSH 插件，并提供下载指标与宿主安装入口。 | 去噪与候选对照适合辅助选型，需独立核查适用性和安装权限。 |
| [dsh-language-guard](#plugin-1424475406-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 用多位置系统提示、周期提醒和界面/命令配置设置DSH目标输出语言。 | 频繁语言漂移用户可从B/C小范围试用，按可见答复验收，临时命令不作多会话隔离保证。 |
| [dsh-my-plugins](#plugin-1429766953-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在顶栏提供可搜索插件清单，显示所选 profile 的包名、版本、说明和分类。 | 适合明确profile的多插件用户作清单阅读辅助，先逐项核对包与描述来源；不要将数量和版本fallback当运行激活证明。 |
| [dsh-trellis](#plugin-1335559646-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。 | 任务/会话恢复适配有实际价值，可在人工复核下试用；须审同名Skill覆盖，不把自填验证与名单过滤当强授权。 |
| [dsh-ultramath](#plugin-1337487779-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 同步数模竞赛主控/角色预设、模型库与论文模板。 | 仅在隔离 profile/备份同名目录后用于辅助建模试点；结果必须人工独立核。 |
| [DSH Cost Tracker](#plugin-1338230382-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 在DSH中记录模型调用用量与估算费用，提供账本、可视化、余额和可选云同步。 | 需要会话费用线索且能准备可丢弃宿主副本的用户，可在副本仅试本地账本。 |
| [dsh-cua-pre](#plugin-1346533795-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | Windows UI Automation 优先的 DSH 桌面控制插件，包含 Python worker、30 工具和 Web 面板。 | 仅在隔离 Windows 桌面、明确目标应用、保留人工确认的低风险任务试点；故障后重观察。 |
| [dsh-model-manager](#plugin-1349266980-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。 | 仅建议有本地推理运维经验者在隔离端口先试登记、Profile与测速，核对目标身份后才评估停止功能。 |
| [DSH Model Router](#plugin-1353534254-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在DSH中规划任务、比较模型路由，并通过模型API或厂商CLI执行依赖工作包。 | 已有多模型配置的开发者可在小额只读任务里试用依赖工作包路由。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。 | 适合有独立备份的DSH维护者在可丢弃目录试用常见删除缓冲；须接受有限脚本覆盖并核对权限重入和回收结果。 |
| [HelloAGENTS](#plugin-1064776002-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。 | 有多阶段跨轮编码任务的CLI用户可在一个副本项目试用。 |
| [Hindsight 编码 Agent 记忆集成](#plugin-1086419061-hindsight-integrations-coding-agents)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为 DSH 编码会话自动召回并后台保存项目记忆。 | 长期维护同一项目且已有 Hindsight 服务的 DSH 用户可在独立 bank 试用历史决策召回。 |
| [Tingly Box](#plugin-1100971867-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 独立统一模型网关，为多客户端和团队提供协议转换、模型选路、凭据与团队 key 管理，以及请求路径和用量观察。 | 需要集中多个模型和客户端、能管理凭据与规则的个人或团队管理员，可先在 localhost 和独立副本配置中接模拟上游或无价值单 provider 小样。 |
| [CC Safety Net](#plugin-1122873619-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 在编码 Agent 的工具调用前检查危险命令和敏感文件访问。 | 能核对规则和工具覆盖的 DSH 用户可以在隔离环境用非破坏样本试用命令检查。 |
| [Ouroboros 规格先行引擎](#plugin-1133901637-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过访谈、固定规格、执行与多阶段评估组织 AI 软件开发任务。 | 能够审查验证命令和验收标准的开发者可在可丢弃项目副本中试一项小任务。 |
| [PicGo](#plugin-113965016-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 桌面图片上传与管理工具，支持多图床配置、剪贴板和外部工具接入，并返回可粘贴链接。 | 重复处理文档配图且已有可信图床的创作者可用非敏感样本试用，先验证链接权限与混合失败恢复。 |
| [MemSearch](#plugin-1153190876-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 面向 Markdown 知识库提供增量索引和语义加关键词混合搜索。 | 需要跨文件回查且能核对来源的用户可在隔离 collection 用备份语料做小规模试用。 |
| [EchoBird](#plugin-1158472225-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 桌面 AI 工具管理应用，提供模型配置、账号管理和本地多候选路由。 | 可授权多个供应方接收同一输入且愿意核查输出的用户，可在隔离配置先对比一项受控任务。 |
| [InvoiceFlowAI 发票整理工具](#plugin-1170373459-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 从邮箱收集电子发票和下载链接，识别分类并生成 Excel 汇总 | 每月批量收集 QQ 或 163 邮箱票据的用户可用 InvoiceFlowAI 桌面工具试做有真值的小批次。 |
| [Graph Memory](#plugin-1178312395-root)<br>[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md) | 为 DSH 和 OpenClaw 压缩历史上下文，以图与向量导航召回原始问答并持久保存记忆。 | 长会话的个人 DSH 用户可以在副本数据库和非敏感任务中试用 Graph Memory。 |
| [HarmonyOS NEXT Skills](#plugin-1179983747-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。 | 固定版本资料检索和无外部副作用设备测试页有清晰小样本入口，值得有HarmonyOS环境的开发者有限试用。 |
| [开源版锤子便签（根应用）](#plugin-1182135360-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | Web 便签应用，支持 Markdown 编辑、多便签管理、主题图片导出、账号同步和文章资源输出。 | 以单人和单活动编辑端为主的 Markdown 作者可保留原稿后试用主题便签图片导出。 |
| [ANOLISA](#plugin-1195873793-root)<br>[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md) | 为 Agent 环境提供上下文优化、技能、工作区恢复、安全和观测组件的系统软件栈。 | 已经维护 DSH 环境且能保留原文的开发者，可以在任务副本中试用 Tokenless 输出优化这一链路。 |
| [Tencent Meeting CLI](#plugin-1203725733-root)<br>[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md) | 基于 OAuth2 的腾讯会议命令行工具，支持会议、录制、纪要、报告及事件操作。 | 有会议权限的个人或团队，可用测试账号试用小范围只读会议和录制查询。 |
| [awesome-gpt-image-2](#plugin-1220744720-root)<br>[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md) | 社区图像案例与结构化提示词模板库，附Agent风格选择Skill和在线画廊。 | 先作为资源用授权素材手工单模板试用，固定参数核验质量，安装须备份范围，商业和模型比较不作保证。 |
| [Aegis Method Pack](#plugin-1225840521-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为编码 Agent 提供按需技能路由、基线读取、变更治理与完成证据流程，含 DSH 适配。 | 能恢复profile且有项目规则的开发者可在一个非敏感中等修改任务试用Aegis的基线与完成证据流程。 |
| [WeSight](#plugin-1232030145-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。 | 已有多个本地编码CLI的开发者可先在副本仓库接入一个引擎试用。 |
| [agent-qa](#plugin-1232322871-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 用自然语言描述用户旅程，在 Web、Android 或 iOS 上执行测试并保留可检查证据的 QA 工具。 | 已有 QA 能力并能提供测试副本的团队可用 agent-qa 补充自然语言旅程回归和失败证据检查。 |
| [Caliper](#plugin-1237259189-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 真实安装 Agent Skill，重复运行任务并分别评估激活、执行检查与有无 Skill 的差异。 | 能提供独立测试环境的 Skill 维护者可先关闭用户自定义工具，用 Caliper 对自有非敏感 Skill 做小规模激活与断言回归。 |
| [Flowix](#plugin-1248774202-root)<br>[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md) | 本地 Markdown 笔记客户端，让人工写作与多个 Agent 共用可持续读写的上下文。 | 以 Markdown 维护项目知识的用户，可用副本笔记本试用人工与 Agent 共用上下文。 |
| [Embedded Workbench](#plugin-1276714299-root)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 分发嵌入式 C/C++ 开发与逐声称核查 Skills，并在 DSH 首步注入可关闭的计划核查提醒。 | 有明确固件现场的 DSH 开发者可先手动试用 Embedded Workbench 的一个匹配领域 Skill。 |
| [DSH Graphlint](#plugin-1285824983-integrations-dsh)<br>[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md) | 为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。 | 已有静态分析经验的开发者可在分支核对告警后试用，不能自动删代码。 |

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

<a id="plugin-1333732838-root"></a>

## [DSH Taskboard](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shengsheng90/DSH-taskboard) [![npm 30d 1,230](https://img.shields.io/static/v1?label=npm+30d&message=1%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@shengsheng/dsh-taskboard)

**主要用途**：为 DSH 提供本地 SQLite 项目看板、Agent 任务工具、原生会话执行与自动化。

**建议**：试用

**推荐理由**：已有本地 DSH 项目且愿意人工验收的操作者可以在独立测试库中试用 Taskboard 管理多会话任务。它较聊天清单增加事务认领、版本检查和原生会话关联，但没有证明自动任务质量或外部副作用可安全重放。出现重复执行、claim与会话不符或权限预算不明时，用户应暂停规则并保留数据库和附件，回到人工分派与对账。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q03](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md#research-q03) 用独立测试库和可丢弃目录从手动闭环试起，再显式开少量自动规则。出现重复执行、claim与会话不符或权限/预算不明，就暂停规则并对账外部副作用，保留数据库与附件。

[查看完整分析 →](../../plugins/shengsheng90--dsh-taskboard/INSIGHT.md)

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

<a id="plugin-1407379611-root"></a>

## [dsh-pinned-sessions](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)

**主要用途**：为 DSH 侧栏提供跨工作区置顶会话分组，支持组内搜索、状态显示、打开与取消置顶。

**建议**：试用

**推荐理由**：适合多工作区用户小范围试用置顶聚合；先核对宿主DOM、状态和unpin，保留原生导航退路。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议多工作区少量重点会话用户试用，核对顺序、状态和取消置顶；DOM变更、双挂载或操作失败不清时停用，回到原生导航。详见[Q05](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1410794267-root"></a>

## [dsh-rtl-chat](../../plugins/adilalmahmoud--dsh-rtl-chat/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdilAlmahmoud/dsh-RTL-chat)

**主要用途**：给会话消息区提供RTL/LTR切换和本地偏好，代码保持LTR，适合阿拉伯语阅读。

**建议**：试用

**推荐理由**：阿拉伯语为主的匹配Web宿主可本地试用，先核混排与代码，理解全局偏好；热卸载后留意残按钮样式。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：RTL读者本地试用，混排不合适随时切回。详见[Q05](../../plugins/adilalmahmoud--dsh-rtl-chat/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/adilalmahmoud--dsh-rtl-chat/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1423941835-root"></a>

## [dsh-pick](../../plugins/aicivilization--dsh-pick/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pick)

**主要用途**：从插件目录搜索、比较和排行 DSH 插件，并提供下载指标与宿主安装入口。

**建议**：试用

**推荐理由**：去噪与候选对照适合辅助选型，需独立核查适用性和安装权限。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可把它当候选搜索和数字比较工具试用；先核对日期与兼容，再读目标插件权限和源码。安装前自行确认，不能把健康分当安全或推荐结论。[Q04](../../plugins/aicivilization--dsh-pick/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/aicivilization--dsh-pick/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1424475406-root"></a>

## [dsh-language-guard](../../plugins/58fly--dsh-language-guard/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/58fly/dsh-language-guard) [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-language-guard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-language-guard)

**主要用途**：用多位置系统提示、周期提醒和界面/命令配置设置DSH目标输出语言。

**建议**：试用

**推荐理由**：频繁语言漂移用户可从B/C小范围试用，按可见答复验收，临时命令不作多会话隔离保证。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先与原生单句提示对照，从B/C检查可见答复和代码；只有长会话确有漂移才试D。多会话不要依赖/language隔离。[Q06](../../plugins/58fly--dsh-language-guard/INSIGHT.md#research-q06)

[查看完整分析 →](../../plugins/58fly--dsh-language-guard/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1429766953-root"></a>

## [dsh-my-plugins](../../plugins/7gzgn--dsh-my-plugins/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![npm 30d 519](https://img.shields.io/static/v1?label=npm+30d&message=519&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins)

**主要用途**：在顶栏提供可搜索插件清单，显示所选 profile 的包名、版本、说明和分类。

**建议**：试用

**推荐理由**：适合明确profile的多插件用户作清单阅读辅助，先逐项核对包与描述来源；不要将数量和版本fallback当运行激活证明。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：明确设置DSH_PROFILE并仅把它当包清单阅读辅助的人可受控试用。首次检查profile名称、声明bundle和实装版本一致，再搜索一个已知插件并强刷；持续有同步文件读取、面板渲染、市场HTTP与缓存写，未调用模型但不能标零成本。包缺失、市场不可用可降级描述，人工需核对未知而不是信任数量。成功是清单逐项对应所选profile，描述来源不误认作者，禁用后overlay移除；若误选profile或把声明版本/启发式入口当运行状态，应停止依赖这些字段排障。真实节时和大规模插件延迟无数据。 [Q04](../../plugins/7gzgn--dsh-my-plugins/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/7gzgn--dsh-my-plugins/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1335559646-root"></a>

## [dsh-trellis](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,504](https://img.shields.io/static/v1?label=npm+30d&message=1%2C504&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)

**主要用途**：为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。

**建议**：试用

**推荐理由**：任务/会话恢复适配有实际价值，可在人工复核下试用；须审同名Skill覆盖，不把自填验证与名单过滤当强授权。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可试用为人工复核开发任务辅助，先备份同名Skill并核自动覆盖；独立保存批准/验证与固定代码版本，不以标签或只读过滤代授权。详见[Q05](../../plugins/1264459640--dsh-trellis/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/1264459640--dsh-trellis/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1337487779-root"></a>

## [dsh-ultramath](../../plugins/andiii208--dsh-ultramath/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andiii208/dsh-ultramath)

**主要用途**：同步数模竞赛主控/角色预设、模型库与论文模板。

**建议**：试用

**推荐理由**：仅在隔离 profile/备份同名目录后用于辅助建模试点；结果必须人工独立核。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：只在备份同名 DSH 目录的隔离 profile 试点；按题目核数据、模型、数值和论文，不以提示门禁代替独立验收。详见[Q05](../../plugins/andiii208--dsh-ultramath/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/andiii208--dsh-ultramath/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1338230382-root"></a>

## [DSH Cost Tracker](../../plugins/angelyeye--dsh-cost-tracker/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Angelyeye/dsh-cost-tracker) [![npm 30d 1,601](https://img.shields.io/static/v1?label=npm+30d&message=1%2C601&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@angelyeye/dsh-cost-tracker)

**主要用途**：在DSH中记录模型调用用量与估算费用，提供账本、可视化、余额和可选云同步。

**建议**：试用

**推荐理由**：需要会话费用线索且能准备可丢弃宿主副本的用户，可在副本仅试本地账本。相比分别查厂商账单，源码支持会话与计价时代联查，但金额未对账且本地模式仍会修补宿主UI产物。若计价差额或补丁退出残留无法解释，应停用并从独立原件恢复宿主，退回厂商账单与CSV核对。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：只建议需要会话级费用线索且能准备可丢弃宿主副本的用户，先在该副本仅启本地账本，对正常、缓存、取消三类调用与厂商账单核对。启动ensureNavIconPatch无条件执行，仅本地不能隔离宿主产物写入；试用前要保留宿主原文件和插件自己的备份，并比较修改范围。若usage、价格或订阅口径解释不了差额，停止预算/结算用途；若补丁或退出残留不能核清，停插件并从独立原件恢复宿主，退回厂商账单与CSV对账。不能把停插件等同产物自动还原。 依据 [Q09](../../plugins/angelyeye--dsh-cost-tracker/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/angelyeye--dsh-cost-tracker/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1346533795-root"></a>

## [dsh-cua-pre](../../plugins/aik358--dsh-cua-pre/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-cua-pre)

**主要用途**：Windows UI Automation 优先的 DSH 桌面控制插件，包含 Python worker、30 工具和 Web 面板。

**建议**：试用

**推荐理由**：仅在隔离 Windows 桌面、明确目标应用、保留人工确认的低风险任务试点；故障后重观察。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：隔离 Windows profile 开始，以最小目标 PID 配白名单并检查日志可写；非幂等动作结果不明时先重观察/人工核，避免自动重放。详见[Q04](../../plugins/aik358--dsh-cua-pre/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/aik358--dsh-cua-pre/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1349266980-root"></a>

## [dsh-model-manager](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![npm 30d 311](https://img.shields.io/static/v1?label=npm+30d&message=311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-manager) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-manager)

**主要用途**：在 DSH 管理本地推理服务、参数 Profile、GPU 检测和性能测试。

**建议**：试用

**推荐理由**：仅建议有本地推理运维经验者在隔离端口先试登记、Profile与测速，核对目标身份后才评估停止功能。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先在隔离端口登记已有服务、保存参数并核对测速口径。停止前独立检查 PID 和端口当前占用者，关键共享推理服务先用原生运维流程。[Q03](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/ansonfishing--dsh-model-manager/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1353534254-root"></a>

## [DSH Model Router](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 383](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,234](https://img.shields.io/static/v1?label=npm+30d&message=4%2C234&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)

**主要用途**：在DSH中规划任务、比较模型路由，并通过模型API或厂商CLI执行依赖工作包。

**建议**：试用

**推荐理由**：已有多模型配置的开发者可在小额只读任务里试用依赖工作包路由。相比手工搬运，它把路由、依赖和预算预留连在一起，但省钱与质量改善仍待同条件验证。遇到未决预留或输出不达标时停止自动路由，保留记录对账并退回手工指定模型。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可供已有多路模型配置的开发者先在只读、小额、可人工验收的依赖任务里试用；先检查价格缺失、quality来源和执行权限，验收每包结果及通道回执。遇到未知费用、遗留预留或输出质量持续弱于固定模型时停止自动路由，保留历史与工作树，返回手工指定模型并对账。尚不支持把当前源码检查升级为日常自动编辑或持续安装验收。 依据[Q09](../../plugins/alice-marx--dsh-model-router/INSIGHT.md#research-q09)。

[查看完整分析 →](../../plugins/alice-marx--dsh-model-router/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1414323673-root"></a>

## [dsh-agent-recycle-guard](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-recycle-guard)

**主要用途**：将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。

**建议**：试用

**推荐理由**：适合有独立备份的DSH维护者在可丢弃目录试用常见删除缓冲；须接受有限脚本覆盖并核对权限重入和回收结果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。详见[Q07](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md#research-q07)。

[查看完整分析 →](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1064776002-root"></a>

## [HelloAGENTS](../../plugins/hellowind777--helloagents/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 709](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=709&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellowind777/helloagents) [![npm 30d 829](https://img.shields.io/static/v1?label=npm+30d&message=829&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents) [![最新发布 2026-07-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-07-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/helloagents)

**主要用途**：为AI编码CLI提供任务路由、质量Skill、项目知识、会话恢复和交付检查脚本。

**建议**：试用

**推荐理由**：有多阶段跨轮编码任务的CLI用户可在一个副本项目试用。相比分散的提示和任务清单，它把计划、状态与交付检查接在一起，便于看到遗漏。若真实验证仍无法核对、规则冲突或填表成本超过返工收益，就保留原有AGENTS与CI流程。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：有跨轮编码任务且愿维护计划的用户可在单宿主副本试用，先备份配置并核对真实验证日志；与项目规则冲突或只增加填表负担时退回原有AGENTS和CI。[Q03](../../plugins/hellowind777--helloagents/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/hellowind777--helloagents/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1086419061-hindsight-integrations-coding-agents"></a>

## [Hindsight 编码 Agent 记忆集成](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 57,033](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57%2C033&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vectorize-io/hindsight) [![npm 30d 62,152](https://img.shields.io/static/v1?label=npm+30d&message=62%2C152&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vectorize-io/hindsight-coding-agents)

**主要用途**：为 DSH 编码会话自动召回并后台保存项目记忆。

**建议**：试用

**推荐理由**：长期维护同一项目且已有 Hindsight 服务的 DSH 用户可在独立 bank 试用历史决策召回。相比反复粘贴摘要，该包自动绑定工作区并切除 fork 继承部分，但质量尚未对照。若停止后记忆未确认、项目串记忆或旧决策误导，应暂停自动依赖并改用人工摘要。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md#research-q05) 用独立 bank 和虚构项目试用，写回未确认或项目不符时暂停并手工核查。

[查看完整分析 →](../../plugins/vectorize-io--hindsight--hindsight-integrations-coding-agents/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1100971867-root"></a>

## [Tingly Box](../../plugins/tingly-dev--tingly-box/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 370](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=370&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tingly-dev/tingly-box)

**主要用途**：独立统一模型网关，为多客户端和团队提供协议转换、模型选路、凭据与团队 key 管理，以及请求路径和用量观察。

**建议**：试用

**推荐理由**：需要集中多个模型和客户端、能管理凭据与规则的个人或团队管理员，可先在 localhost 和独立副本配置中接模拟上游或无价值单 provider 小样。它比逐客户端直连多统一协议、scope、选路与请求观察，但兼容和团队全路径隔离仍需验收，重试与 quota 观察也不保证费用硬上限。身份、协议或规则不符以及 DSH 两文件部分写入无法核恢复时，应停扩流和自动配置，查看实际尝试与文件后退回原 endpoint 或副本。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：熟悉凭据/规则的管理员可localhost隔离渐进小样；身份/协议/规则不符、scope或DSH部分写不明时停扩流/自动配置，核attempt和文件、退原endpoint/副本。见[Q05](../../plugins/tingly-dev--tingly-box/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/tingly-dev--tingly-box/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1122873619-root"></a>

## [CC Safety Net](../../plugins/kenryu42--cc-safety-net/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,877](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C877&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kenryu42/cc-safety-net) [![npm 30d 89,094](https://img.shields.io/static/v1?label=npm+30d&message=89%2C094&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/cc-safety-net)

**主要用途**：在编码 Agent 的工具调用前检查危险命令和敏感文件访问。

**建议**：试用

**推荐理由**：能核对规则和工具覆盖的 DSH 用户可以在隔离环境用非破坏样本试用命令检查。相比仅靠提示词，它对接入的工具调用提供执行前判断，但不能替代宿主沙箱和审批。若出现误拦或未检查工具提示，用户应停止依赖该门槛并回到原生审批和人工核查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/kenryu42--cc-safety-net/INSIGHT.md#research-q05) 建议保留宿主审批并用非破坏样本核查工具覆盖；误拦或未检查提示出现时停止依赖并人工复核。

[查看完整分析 →](../../plugins/kenryu42--cc-safety-net/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1133901637-root"></a>

## [Ouroboros 规格先行引擎](../../plugins/q00--ouroboros/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 6,299](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C299&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)

**主要用途**：通过访谈、固定规格、执行与多阶段评估组织 AI 软件开发任务。

**建议**：试用

**推荐理由**：能够审查验证命令和验收标准的开发者可在可丢弃项目副本中试一项小任务。相比人工清单，它将规格、机械证据与建议性审阅串联，但并未证明降低返工或覆盖全部需求。若无有效执行证据、检查不能对应需求或外部状态不明，应停止循环并回人工清单核对。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/q00--ouroboros/INSIGHT.md#research-q05) 仅在可丢弃副本试小任务并检查命令与各项验收；无有效证据或状态不明时暂停并回人工核对。

[查看完整分析 →](../../plugins/q00--ouroboros/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-113965016-root"></a>

## [PicGo](../../plugins/molunerfinn--picgo/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 27,409](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=27%2C409&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Molunerfinn/PicGo)

**主要用途**：桌面图片上传与管理工具，支持多图床配置、剪贴板和外部工具接入，并返回可粘贴链接。

**建议**：试用

**推荐理由**：重复处理文档配图且已有可信图床的创作者可用非敏感样本试用，先验证链接权限与混合失败恢复。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：反复上传文档配图且已有可信图床的创作者可先用非敏感图片试用。检查目标配置、公开范围、链接可读性和一批混合失败的恢复，再接入编辑器；仅偶尔上传少量图片时手工网页流程可能更省配置。不要因 README 另有 DSH 插件链接，就假定本仓库本身可通过 dsh plugin add 安装。[Q05](../../plugins/molunerfinn--picgo/INSIGHT.md#research-q05)

[查看完整分析 →](../../plugins/molunerfinn--picgo/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1153190876-root"></a>

## [MemSearch](../../plugins/zilliztech--memsearch/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 2,814](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C814&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)

**主要用途**：面向 Markdown 知识库提供增量索引和语义加关键词混合搜索。

**建议**：试用

**推荐理由**：需要跨文件回查且能核对来源的用户可在隔离 collection 用备份语料做小规模试用。相比 grep，它增加语义候选但依赖模型、后端和人工复核，实际收益未知。若 failed_files 非空、数据不能交给选定模型或结果无法追溯，就暂停索引并回原文检索。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/zilliztech--memsearch/INSIGHT.md#research-q05) 在隔离 collection 先验报告并对照 grep；有失败或不能核对来源时回原文件。

[查看完整分析 →](../../plugins/zilliztech--memsearch/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1158472225-root"></a>

## [EchoBird](../../plugins/edison7009--echobird/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 3,472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)

**主要用途**：桌面 AI 工具管理应用，提供模型配置、账号管理和本地多候选路由。

**建议**：试用

**推荐理由**：可授权多个供应方接收同一输入且愿意核查输出的用户，可在隔离配置先对比一项受控任务。相比直接配置，它减少手工切换，但不同模型行为、成本和协议不保证等价。若数据不能发给备选方、续接不能提供完整输入或有副作用未核实，就恢复直连并人工处理。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q05](../../plugins/edison7009--echobird/INSIGHT.md#research-q05) 在独立配置使用受控任务比较直连，数据或续接边界不清时回退。

[查看完整分析 →](../../plugins/edison7009--echobird/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1170373459-root"></a>

## [InvoiceFlowAI 发票整理工具](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![GitHub ★ 526](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=526&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Invoice-Downloader)

**主要用途**：从邮箱收集电子发票和下载链接，识别分类并生成 Excel 汇总

**建议**：试用

**推荐理由**：每月批量收集 QQ 或 163 邮箱票据的用户可用 InvoiceFlowAI 桌面工具试做有真值的小批次。相比逐邮件下载再填表，工具组织收票、识别、归档和未解决项，但漏票与净工时尚未实测。若原件缺失、关键字段错误或邮箱范围不完整，用户应暂停扩大批次并保留原件人工补齐。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：用测试邮箱与混合票据真值批次试用，按原件、关键字段、邮箱范围和可用导出验收；不合格先人工补齐，再决定是否继续。[Q04](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/ethanyoq--invoice-downloader/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1178312395-root"></a>

## [Graph Memory](../../plugins/adoresever--graph-memory/INSIGHT.md)

[![分类：研究与知识](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E7%A0%94%E7%A9%B6%E4%B8%8E%E7%9F%A5%E8%AF%86&color=7c3aed)](../categories/RESEARCH-KNOWLEDGE.md)

[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/adoresever/graph-memory) [![npm 30d 346](https://img.shields.io/static/v1?label=npm+30d&message=346&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory) [![最新发布 2026-04-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/graph-memory)

**主要用途**：为 DSH 和 OpenClaw 压缩历史上下文，以图与向量导航召回原始问答并持久保存记忆。

**建议**：试用

**推荐理由**：长会话的个人 DSH 用户可以在副本数据库和非敏感任务中试用 Graph Memory。相比完整历史或仅摘要，它约束模型可见历史并召回原始问答，但总费用和证据完整性需按任务比较。若召回错项目、缺少纠错所需来源或总开销反增，用户应停用接管并恢复原历史与数据库备份。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/adoresever--graph-memory/INSIGHT.md#research-q04) 个人非敏感任务用副本库对照；审计或多租户任务先保留原历史并验证隔离。

[查看完整分析 →](../../plugins/adoresever--graph-memory/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1179983747-root"></a>

## [HarmonyOS NEXT Skills](../../plugins/linhay--harmony-next.skills/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 366](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=366&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linhay/harmony-next.skills)

**主要用途**：通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。

**建议**：试用

**推荐理由**：固定版本资料检索和无外部副作用设备测试页有清晰小样本入口，值得有HarmonyOS环境的开发者有限试用。应确认实际provider/SDK版本并回读页面、编译或业务结果；API26声明和脚本completed都不等于任务正确。路径/版本不明、敏感采集不可控或动作结果未知时停止自动链，回官方资料和手工读回。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：可先试固定版本普通参考，自动化仅在无外部副作用测试页确认before/after；版本不明、敏感采集不可控或动作状态未知时停止，回官方资料/IDE与手工读回。见[Q04](../../plugins/linhay--harmony-next.skills/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/linhay--harmony-next.skills/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1182135360-root"></a>

## [开源版锤子便签（根应用）](../../plugins/zhaoolee--notes/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 315](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=315&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes)

**主要用途**：Web 便签应用，支持 Markdown 编辑、多便签管理、主题图片导出、账号同步和文章资源输出。

**建议**：试用

**推荐理由**：以单人和单活动编辑端为主的 Markdown 作者可保留原稿后试用主题便签图片导出。相较手动排版再截图，源码把主题核对、资源等待和图片输出接为一条链，但节时与视觉合格率尚未实测。用户若发现云端覆盖、导出主题不符或图片缺失，应停止分享并退回本地源稿与手动排版，多设备并发编辑暂缓。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先以单人、单活动编辑端和非敏感稿件试用，保留Markdown原稿，核对主题、图片和全文后再分享；多端并发编辑暂缓。云保存异常或导出缺失时退回本地稿与手工排版，外部草稿另行核对结果，见 [Q05](../../plugins/zhaoolee--notes/INSIGHT.md#research-q05)。

[查看完整分析 →](../../plugins/zhaoolee--notes/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1195873793-root"></a>

## [ANOLISA](../../plugins/agentic-os-org--anolisa/INSIGHT.md)

[![分类：基础设施](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD&color=4338ca)](../categories/INFRASTRUCTURE.md)

[![GitHub ★ 650](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=650&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentic-os-org/ANOLISA)

**主要用途**：为 Agent 环境提供上下文优化、技能、工作区恢复、安全和观测组件的系统软件栈。

**建议**：试用

**推荐理由**：已经维护 DSH 环境且能保留原文的开发者，可以在任务副本中试用 Tokenless 输出优化这一链路。相比手工裁剪，它统一处理工具结果并为部分压缩保留取回条件，但尚未证明真实任务更省钱。用户若发现关键内容丢失、原文取回失败或全周期负担上升，应关闭压缩并回到原结果。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/agentic-os-org--anolisa/INSIGHT.md#research-q04) 仅对已能维护运行环境和保留原文的开发者，建议以任务副本小范围试用所查压缩链路；内容丢失、取回失败或净成本不降就停用。

[查看完整分析 →](../../plugins/agentic-os-org--anolisa/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1203725733-root"></a>

## [Tencent Meeting CLI](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md)

[![分类：办公与运营](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%8A%9E%E5%85%AC%E4%B8%8E%E8%BF%90%E8%90%A5&color=0f766e)](../categories/OFFICE-OPERATIONS.md)

[![GitHub ★ 248](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=248&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloud/tencentmeeting-cli) [![npm 30d 10,141](https://img.shields.io/static/v1?label=npm+30d&message=10%2C141&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencentcloud/tmeet)

**主要用途**：基于 OAuth2 的腾讯会议命令行工具，支持会议、录制、纪要、报告及事件操作。

**建议**：试用

**推荐理由**：有会议权限的个人或团队，可用测试账号试用小范围只读会议和录制查询。它把 GUI 操作与开放 API 对接变成结构化命令，但权限、原文范围和远程结果仍需核实。若范围不明或写结果未知，应停止扩大查询并回 GUI 对账，未经具体授权不做邀请、分享或上传。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md#research-q04) 小范围只读核身份/分页/原文，写和上传须具体授权；状态不明停并回GUI。

[查看完整分析 →](../../plugins/tencentcloud--tencentmeeting-cli/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1220744720-root"></a>

## [awesome-gpt-image-2](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md)

[![分类：内容生产](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E5%86%85%E5%AE%B9%E7%94%9F%E4%BA%A7&color=be185d)](../categories/CONTENT-CREATION.md)

[![GitHub ★ 35,006](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C006&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/awesome-gpt-image-2)

**主要用途**：社区图像案例与结构化提示词模板库，附Agent风格选择Skill和在线画廊。

**建议**：试用

**推荐理由**：先作为资源用授权素材手工单模板试用，固定参数核验质量，安装须备份范围，商业和模型比较不作保证。[Q04](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q04)

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：作为资源先手工选单模板，以有权素材和固定模型小批试用；安装前选目标备份，不把案例或广告当成片/收费保证。[Q04](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q04)

[查看完整分析 →](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1225840521-root"></a>

## [Aegis Method Pack](../../plugins/ganyuanran--aegis/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 1,386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GanyuanRan/Aegis)

**主要用途**：为编码 Agent 提供按需技能路由、基线读取、变更治理与完成证据流程，含 DSH 适配。

**建议**：试用

**推荐理由**：能恢复profile且有项目规则的开发者可在一个非敏感中等修改任务试用Aegis的基线与完成证据流程。相比反复手写提醒，它提供DSH生命周期入口和按需技能，但返工改善不能从旧基准外推。若简单任务流程膨胀或仍无当前完成证据，切explicit或移除后退回项目AGENTS与手动核验。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先在单个中等任务核当前证据与实际路由，保留项目规则优先；流程过载就改explicit或退回原工作法。见[Q04](../../plugins/ganyuanran--aegis/INSIGHT.md#research-q04)。

[查看完整分析 →](../../plugins/ganyuanran--aegis/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1232030145-root"></a>

## [WeSight](../../plugins/freestylefly--wesight/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 961](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=961&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/wesight)

**主要用途**：为多种本地编码Agent提供桌面聊天、文件变化、配置与运行指标工作区。

**建议**：试用

**推荐理由**：已有多个本地编码CLI的开发者可先在副本仓库接入一个引擎试用。相比分散终端和配置文件，它把会话、文件变化与运行信息放在同一工作区。若跨引擎权限差异难以确认或资源维护负担过高，就退回原CLI和编辑器。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：已有多CLI需求的开发者可先用一个已有引擎在副本仓库试用，核对权限、文件与中断状态；若配置资源负担高于切换便利，或要求各引擎同等审批而未证实，就退回原CLI与编辑器。[Q03](../../plugins/freestylefly--wesight/INSIGHT.md#research-q03)

[查看完整分析 →](../../plugins/freestylefly--wesight/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1232322871-root"></a>

## [agent-qa](../../plugins/vostride--agent-qa/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 915](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=915&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vostride/agent-qa)

**主要用途**：用自然语言描述用户旅程，在 Web、Android 或 iOS 上执行测试并保留可检查证据的 QA 工具。

**建议**：试用

**推荐理由**：已有 QA 能力并能提供测试副本的团队可用 agent-qa 补充自然语言旅程回归和失败证据检查。相比仅由执行模型自报完成，它把条件与引用交给运行器核查，但真实检出率和记忆收益尚未验证。若关键后台状态无法独立确认或模型误判与恢复成本持续增加，团队应缩小试用范围并保留原有确定性放行检查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q03](../../plugins/vostride--agent-qa/INSIGHT.md#research-q03) 先选可重置且不影响生产的少量旅程，把它作为探索补充并保留确定性断言。重要结果只能由后台证明时另查原有验收；误判频繁或恢复对账过重便缩小范围。

[查看完整分析 →](../../plugins/vostride--agent-qa/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1237259189-root"></a>

## [Caliper](../../plugins/edonadei--caliper/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 229](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=229&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edonadei/caliper)

**主要用途**：真实安装 Agent Skill，重复运行任务并分别评估激活、执行检查与有无 Skill 的差异。

**建议**：试用

**推荐理由**：能提供独立测试环境的 Skill 维护者可先关闭用户自定义工具，用 Caliper 对自有非敏感 Skill 做小规模激活与断言回归。相比单次手试，它区分自然加载、任务结果和基础设施失败，但缺判与环境漂移仍需逐项核对。若隔离不足、检查无判或双臂条件不一致，就停止归因并回到固定环境的原 CLI 与人工验收。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q03](../../plugins/edonadei--caliper/INSIGHT.md#research-q03)仅在独立环境对可信spec小试，先关闭user customizations并查实际工具清单。比较时审全部verdict和usable分母、同名任务语义；不一致先修实验，无法控制权限则退回原CLI手动核验。

[查看完整分析 →](../../plugins/edonadei--caliper/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1248774202-root"></a>

## [Flowix](../../plugins/text2future--flowix/INSIGHT.md)

[![分类：个人效率](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E4%B8%AA%E4%BA%BA%E6%95%88%E7%8E%87&color=2563eb)](../categories/PERSONAL-PRODUCTIVITY.md)

[![GitHub ★ 493](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=493&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/text2future/flowix)

**主要用途**：本地 Markdown 笔记客户端，让人工写作与多个 Agent 共用可持续读写的上下文。

**建议**：试用

**推荐理由**：以 Markdown 维护项目知识的用户，可用副本笔记本试用人工与 Agent 共用上下文。它减少重复传递并已有保存冲突保护，但正文写好不等索引追平或语义不被覆盖。若出现过期写回或无法解释的检索结果，应停 Agent 写入并查原文备份，回原编辑器或 CLI。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：[Q04](../../plugins/text2future--flowix/INSIGHT.md#research-q04) 副本核人工编辑/检索/小范围写回/重开，异常停Agent写并回原文/备份。

[查看完整分析 →](../../plugins/text2future--flowix/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1276714299-root"></a>

## [Embedded Workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 25](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=25&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 3,501](https://img.shields.io/static/v1?label=npm+30d&message=3%2C501&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-embedded-workbench)

**主要用途**：分发嵌入式 C/C++ 开发与逐声称核查 Skills，并在 DSH 首步注入可关闭的计划核查提醒。

**建议**：试用

**推荐理由**：有明确固件现场的 DSH 开发者可先手动试用 Embedded Workbench 的一个匹配领域 Skill。源码支持按需方法与首步提醒的去重，但 Gate 不核验计划，静态 fact-check 也不能代替编译、行为验证和硬件测试。只在可回滚分支以真实结果验修复，出现无依据的已核查宣称或过度流程负担时，关闭提醒并回原工具链与人工检查。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：先手动选匹配Skill，在可回滚固件分支核实际编译/测试，再决定提醒开关；只有核查格式而无证据时停用结论，见 [Q03](../../plugins/amethystluna--embedded-workbench/INSIGHT.md#research-q03)。

[查看完整分析 →](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[返回表格](#column-index)

<a id="plugin-1285824983-integrations-dsh"></a>

## [DSH Graphlint](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md)

[![分类：软件交付](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=&message=%E8%BD%AF%E4%BB%B6%E4%BA%A4%E4%BB%98&color=334155)](../categories/SOFTWARE-DELIVERY.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AngelosZou/graphlint) [![npm 30d 1,244](https://img.shields.io/static/v1?label=npm+30d&message=1%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-graphlint) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-graphlint)

**主要用途**：为DSH提供graphlint依赖图查询、索引构建、配置工具和使用Skill。

**建议**：试用

**推荐理由**：已有静态分析经验的开发者可在分支核对告警后试用，不能自动删代码。

**核查情况**：已核查固定版本源码；无同版本宿主验收记录。

**试用条件**：已有graphlint使用经验且愿意逐项核对告警的开发者可先在分支试用。固定CLI版本、明确root与入口规则，再挑一个小模块查询，不自动删除动态入口；核对配置副作用、job取消及重新索引。不能把告警数量减少当业务交付，也不能把本插件推荐解释为其上游所有语言分析已通过验收。 [Q09](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md#research-q09)

[查看完整分析 →](../../plugins/angeloszou--graphlint--integrations-dsh/INSIGHT.md)

[返回表格](#column-index)

[返回首页](../../../README.md)

## 更新时间

2026-11-03
