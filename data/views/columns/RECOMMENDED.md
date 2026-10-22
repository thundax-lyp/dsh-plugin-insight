[返回首页](../../../README.md)

# 推荐

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 为什么值得推荐 |
| --- | --- | --- |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。 |
| [DSH Telemetry Redactor](#plugin-1333368566-root) | 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。 | 已有遥测出口的部署者可用假密钥试验脱敏，先核对漏删、误删及原始日志保留。 |
| [dsh-thumb](#plugin-1341694685-root) | 为窄屏DSH提供覆盖式会话抽屉、单列设置与紧凑阅读样式。 | 手机窄屏用户可试自动收侧栏；先核设置和相邻trace视图，24px按钮较小，重视触达者调密度或停用。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 把聊天中的Linux文件路径转为可从Windows打开的文件入口。 | WSL同机文件交接者可先用非敏感文件试用；当前路径识别会跳过含空格等路径，需人工核对目标，返回ok不证明已正确打开。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。 | Windows本地模型用户可试TCP/API分层探测，先核IP、模型ID与实际小生成，再采用配置片段。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在 DSH 设置页展示本机 Token、模型分布和技能调用状态。 | 个人用量复盘可试用可重建索引；先对少量原始日志核对重试和技能结果，不将调用成功率当业务质量。 |
| [上下文交接提醒](#plugin-1396768359-root) | 消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。 | 愿主动交接的长会话用户可先在临时目录试用；明确HANDOVER写入、保留和分享范围，补齐草稿后比较真实接续成本。 |
| [mac-notify](#plugin-1402940561-root) | 把 DSH 完成、提问、审批与报错转为 macOS 原生通知。 | macOS后台任务用户可试完成与问题提醒；先限制敏感摘要和声音，验通知权限，点击后仍手动定位具体会话。 |
| [dsh-pinned-sessions](#plugin-1407379611-root) | 在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。 | 适合跨多个工作区找置顶会话，先验证搜索、归档过滤与取消置顶；宿主升级后核对侧栏入口，尚未进行真实宿主验证。 |
| [dsh-draft-attachments](#plugin-1414492607-root) | 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。 | 频繁切换带附件草稿者可用可丢弃文件试用；验证慢存储恢复、发送后不复活及超限，并定期清理敏感字节。 |
| [agent-clinic](#plugin-1417442557-root) | 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 | Agent排障者可离线扫少量会话试证据定位，先回读原行并检查指纹隐私，配置处方另行备份验证。 |
| [dsh-plugin-veriscope](#plugin-1422943787-root) | 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。 | 已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。 |
| [embedded-workbench](#plugin-1276714299-root) | 为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。 | 可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。 |
| [dsh-anet](#plugin-1302597978-deploy-plugins-dist-dsh) | 将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。 | 统一节点/MCP/Skill接线实用，适合能管理身份/daemon/支出的技术用户，先核真实节点和安装信任，不把指南当隔离。 |
| [dsh-stock-market](#plugin-1331846104-root) | 在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。 | 适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。 |
| [dsh-verification-receipt](#plugin-1333370288-root) | 被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。 | 被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。 |
| [dsh-vision-fallback](#plugin-1333993743-root) | 将 DSH 图片交给独立视觉模型，并把观察结果返回当前主模型。 | 必须保留纯文本主模型的用户可试用图像旁路；先检查外发上下文范围与难图误读，关键文字回看原图。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。 | 维护多插件者可在独立profile试用中文目录与启停；先验系统保护、表达式拒绝、备份恢复和真实fiber状态。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 | 已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。 |
| [dsh-voice](#plugin-1334554745-root) | 通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。 | 不便键盘输入者可用非敏感口述试用；确认生效引擎与Web Speech回退，重要指令提交前核对文字。 |
| [dsh-youreyes](#plugin-1335045545-root) | 为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。 | 已有多视觉端点或本地Ollama者可显式通道试用；先设允许目录并核对auto云端回退，关键内容回看原图。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。 | 维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。 |
| [dsh-web-tools](#plugin-1335219884-root) | 为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。 | 适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。 |
| [Markdown 批注器](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。 | 审阅中等Markdown者可按次试用定位批注；重生成后核对重复段落锚点并及时导出，不用于跨日未保存档案。 |
| [messaging-core](#plugin-1335798113-packages-messaging-core) | 将多种消息渠道接入 DSH，统一授权、聊天会话映射、命令与回复路由。 | 已有机器人经验者可先以单平台私人聊天试用；收紧白名单，验证重连长消息及群共享上下文，不能凭渠道数量认定可靠。 |
| [chicheng-cron](#plugin-1335807482-root) | 在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。 | 可重复可撤销的个人任务可先用只读日程试用；核对cwd、时区、超时和输出，关键产物另加完成检查。 |
| [dsh-verify](#plugin-1335843750-root) | 执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。 | 适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。 |
| [dsh-openai-oauth](#plugin-1335992154-root) | 为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。 | 本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。 |
| [dsh-plugin-focus](#plugin-1336084195-root) | 将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。 | 可明确单任务板所有权的工作区可试焦点注入；早期硬约束会被裁、set实际追加，需核保留范围；npm不含附带发布Skill。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。 | 持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。 | 维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见[Q06](#research-q06)。 |
| [dsh-ui-enhancer](#plugin-1339034478-root) | 组合工作区文件引用、壁纸和可自定义形象的桌面宠物。 | 需@文件引用者可先核工作区realpath和宿主输入接口；娱乐层另验隐私与去背景，不把宠物星星当交付指标。 |
| [dsh-project-memory](#plugin-1339316901-root) | 为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。 | 分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。 | 多工作区用户可先试置顶和复制路径，删除功能待测试目录确认路径与确认流程后启用。 |
| [gzhflow](#plugin-1339888505-root) | 为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。 | 已有公众号编辑流程者可先试本地质检和排版；分数非事实质量，推草稿需逐次授权核远端结果，未知响应不要直接重试。 |
| [KRouter](#plugin-1341648244-root) | 让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。 | lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。 |
| [dsh-question-nav](#plugin-1341946801-root) | 以会话提问索引与圆点导航跳转历史用户提问。 | 长会话用户可限定普通单文本提问、保持同一会话试导航；已知仅索引首块会漏多块或首块图片提问，跳转时不核原session，不能当完整历史。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 | 有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 在本地解析电子发票字段，核对金额并汇总生成报销单资料。 | 个人可用脱敏XML或文本票试汇总草稿；逐张核票号金额与买卖方，显式会话，xlsx.b64解码后再交财务，不支持OCR真伪查验。 |
| [dsh-api-dashboard](#plugin-1346196699-root) | 在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。 | 多供应商用户可限可查询平台试额度看板，先对账和核对币种，自更新单独验备份回滚。 |
| [dsh-wsl-tray](#plugin-1351853903-root) | 为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。 | 已有dsh-wsl-kit者可显式kitPath试桌面恢复入口，先从快捷方式真实启动，核token去向与回退。 |
| [dsh-soul](#plugin-1352089397-root) | 管理分层人设配置、提示词注入、变更历史及带确认的人设修改。 | 需显式风格管理者可试全局/工作区/会话配置；核首轮实际注入与下一轮覆盖，审计回滚非全作用域事务。 |
| [dsh-turn-outline](#plugin-1356219122-root) | 把DSH会话事件折叠为轮次轨迹，并在better-sidebar侧栏定位回聊天或轨迹视图。 | 已用better-sidebar的长会话用户可试轮次大纲；核压缩前历史和并行工具锚点，摘要预览不替代完整审计日志。 |
| [dsh-harness-chat-control](#plugin-1357066651-root) | 为 DSH 会话提供引用、侧聊、会话编辑及侧聊模型与历史控制。 | 频繁引用局部问题侧聊者可试交互，先验编辑重载后的引用与模型输入一致，保留正式原记录。 |
| [模型信息补全](#plugin-1358816037-root) | 从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。 | 维护多模型者可备份后试单供应商填充，核对官方能力及同名端点，未匹配项保留人工确认。 |
| [Forge 工作报告](#plugin-1363429979-plugin-daily-log) | 汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 | 定期汇报者可先接单仓库单日志来源，对照手写报告检查作者过滤、遗漏和错误归功。 |
| [Forge 用量计费](#plugin-1363429979-plugin-usage-billing) | 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。 | 需核对模型支出的用户可先选单模型一天账单，检查缓存计价、币种及未知金额。 |
| [dsh-llm-balance-siderbar](#plugin-1366370702-root) | 按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。 | 多provider用户可在每类仅一个账户路由时试额度面板；同provider多key会共用首路由缓存，不能当当前各账户余额。 |
| [dsh-reasoning-tiers](#plugin-1367305514-root) | 按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。 | 自定义模型用户可备份profile后试单模型档位修补，先核对真实请求和撤销结果。 |
| [dsh-eteams](#plugin-1372993989-root) | 为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。 | 可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。 |

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

**主要用途：**按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。

**推荐理由：**适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。

**使用条件：**先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

[返回表格](#column-index)

<a id="plugin-1333368566-root"></a>

## [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,182](https://img.shields.io/static/v1?label=npm+30d&message=1%2C182&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

**主要用途：**在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。

**推荐理由：**已有遥测出口的部署者可用假密钥试验脱敏，先核对漏删、误删及原始日志保留。

**使用条件：**先在测试遥测里放入假密钥、普通文本和 token 计量字段，核对脱敏与保真后再接后端。

[返回表格](#column-index)

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)

**主要用途：**为窄屏DSH提供覆盖式会话抽屉、单列设置与紧凑阅读样式。

**推荐理由：**手机窄屏用户可试自动收侧栏；先核设置和相邻trace视图，24px按钮较小，重视触达者调密度或停用。

**使用条件：**手机用户可先核会话切换、设置和相邻trace视图；需要更大点击目标时调整密度。

[返回表格](#column-index)

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

**主要用途：**把聊天中的Linux文件路径转为可从Windows打开的文件入口。

**推荐理由：**WSL同机文件交接者可先用非敏感文件试用；当前路径识别会跳过含空格等路径，需人工核对目标，返回ok不证明已正确打开。

**使用条件：**先用一个非敏感文件测试中文和空格路径，确认目标文件而非只看应用启动。

[返回表格](#column-index)

<a id="plugin-1351854010-root"></a>

## [dsh-wsl-hostsvc](../../plugins/173787247--dsh-wsl-hostsvc/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-hostsvc)

**主要用途：**从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。

**推荐理由：**Windows本地模型用户可试TCP/API分层探测，先核IP、模型ID与实际小生成，再采用配置片段。

**使用条件：**优先核对apiReady而非仅TCP，再确认模型ID和真实上下文上限。

[返回表格](#column-index)

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)

**主要用途：**在 DSH 设置页展示本机 Token、模型分布和技能调用状态。

**推荐理由：**个人用量复盘可试用可重建索引；先对少量原始日志核对重试和技能结果，不将调用成功率当业务质量。

**使用条件：**适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。

[返回表格](#column-index)

<a id="plugin-1396768359-root"></a>

## [上下文交接提醒](../../plugins/2jumpsina--dsh-context-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)

**主要用途：**消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。

**推荐理由：**愿主动交接的长会话用户可先在临时目录试用；明确HANDOVER写入、保留和分享范围，补齐草稿后比较真实接续成本。

**使用条件：**适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。

[返回表格](#column-index)

<a id="plugin-1402940561-root"></a>

## [mac-notify](../../plugins/ak-blank--dsh-plugin-mac-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify)

**主要用途：**把 DSH 完成、提问、审批与报错转为 macOS 原生通知。

**推荐理由：**macOS后台任务用户可试完成与问题提醒；先限制敏感摘要和声音，验通知权限，点击后仍手动定位具体会话。

**使用条件：**有后台任务提醒需求的 macOS 用户可将其列入候选；涉及敏感输出时先限制摘要与声音，是否适用取决于通知权限和多会话定位要求。

[返回表格](#column-index)

<a id="plugin-1407379611-root"></a>

## [dsh-pinned-sessions](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)

**主要用途：**在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。

**推荐理由：**适合跨多个工作区找置顶会话，先验证搜索、归档过滤与取消置顶；宿主升级后核对侧栏入口，尚未进行真实宿主验证。

**使用条件：**已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。

[返回表格](#column-index)

<a id="plugin-1414492607-root"></a>

## [dsh-draft-attachments](../../plugins/2026heshao--dsh-draft-attachments/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

**主要用途：**将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。

**推荐理由：**频繁切换带附件草稿者可用可丢弃文件试用；验证慢存储恢复、发送后不复活及超限，并定期清理敏感字节。

**使用条件：**可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。

[返回表格](#column-index)

<a id="plugin-1417442557-root"></a>

## [agent-clinic](../../plugins/1687210989--agent-clinic/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/agent-clinic)

**主要用途：**读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。

**推荐理由：**Agent排障者可离线扫少量会话试证据定位，先回读原行并检查指纹隐私，配置处方另行备份验证。

**使用条件：**先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。

[返回表格](#column-index)

<a id="plugin-1422943787-root"></a>

## [dsh-plugin-veriscope](../../plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)

**主要用途：**重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

**推荐理由：**已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

**使用条件：**可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1276714299-root"></a>

## [embedded-workbench](../../plugins/amethystluna--embedded-workbench/INSIGHT.md)

[![GitHub ★ 21](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/embedded-workbench) [![npm 30d 2,906](https://img.shields.io/static/v1?label=npm+30d&message=2%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-embedded-workbench)

**主要用途：**为嵌入式固件开发提供八份 Skill，并在 DSH 会话首个模型步骤注入短验证提示。

**推荐理由：**可小规模验证八 Skill 与门禁，并以专家样例评估专业正确性。

**使用条件：**先验证安装与注入，再以专家任务检行为；保留关闭门禁开关并单独考察 Skill 效果。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1302597978-deploy-plugins-dist-dsh"></a>

## [dsh-anet](../../plugins/anetresearch--anet--deploy-plugins-dist-dsh/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)

**主要用途：**将DSH接入本地anet节点，装配stdio MCP和委派、设置、状态三Skill，以统一执行路径/身份发现和跟踪跨智能体任务。

**推荐理由：**统一节点/MCP/Skill接线实用，适合能管理身份/daemon/支出的技术用户，先核真实节点和安装信任，不把指南当隔离。

**使用条件：**有条件试用，明确跨节点需求并能管理身份/daemon/hub/支出者先核实际节点和对端；普通本地任务不必增加复杂度。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途：**在DSH侧栏显示行情，并提供沪深A股快照、走势、排行、资金流、基本面、事件、研报和资讯工具。

**推荐理由：**适合个人DSH用户受控试用公开资料查询，核对源、行情时间、口径和关闭策略；不作为交易依据或稳定数据服务保证。

**使用条件：**资料查阅者可先限定小样本受控试用，与原来源核对时间和口径，检查会话关闭；降级无法解释或旧数据误导时停止依赖，不作为交易依据。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1333370288-root"></a>

## [dsh-verification-receipt](../../plugins/030611--dsh-verification-receipt/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)

**主要用途：**被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

**推荐理由：**被动最小字段与边界文档清楚，适合精确宿主私有单进程路径观察；词法/可重算hash与无界queue不适合验证门禁或强审计。

**使用条件：**有条件试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1333993743-root"></a>

## [dsh-vision-fallback](../../plugins/1helloman1--dsh-vision-fallback/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-vision-fallback) [![npm 30d 919](https://img.shields.io/static/v1?label=npm+30d&message=919&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback)

**主要用途：**将 DSH 图片交给独立视觉模型，并把观察结果返回当前主模型。

**推荐理由：**必须保留纯文本主模型的用户可试用图像旁路；先检查外发上下文范围与难图误读，关键文字回看原图。

**使用条件：**适合确需保留纯文本主模型的图片任务；先核对视觉服务的数据范围和难图准确率，重要文字回看原图。

[返回表格](#column-index)

<a id="plugin-1334267268-root"></a>

## [dsh-plugin-manager](../../plugins/2768651338--dsh-plugin-manager/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-plugin-manager) [![npm 30d 923](https://img.shields.io/static/v1?label=npm+30d&message=923&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-plugin-manager)

**主要用途：**给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。

**推荐理由：**维护多插件者可在独立profile试用中文目录与启停；先验系统保护、表达式拒绝、备份恢复和真实fiber状态。

**使用条件：**需要批量辨认和启停时先在独立profile试用，核对系统保护、表达式拒绝、备份恢复及实际fiber状态后扩用。

[返回表格](#column-index)

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 705](https://img.shields.io/static/v1?label=npm+30d&message=705&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

**主要用途：**管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。

**推荐理由：**已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。

**使用条件：**已有酒馆资料的写作者可先导入副本。检查占位符、世界书命中与激活预设，别直接把原平台效果视为DSH已复现。

[返回表格](#column-index)

<a id="plugin-1334554745-root"></a>

## [dsh-voice](../../plugins/3274375092--dsh-voice/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) [![npm 30d 607](https://img.shields.io/static/v1?label=npm+30d&message=607&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)

**主要用途：**通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。

**推荐理由：**不便键盘输入者可用非敏感口述试用；确认生效引擎与Web Speech回退，重要指令提交前核对文字。

**使用条件：**先用非敏感内容核对生效引擎及识别质量；有严格本地要求时需核查回退行为，重要指令提交前复核文字。

[返回表格](#column-index)

<a id="plugin-1335045545-root"></a>

## [dsh-youreyes](../../plugins/54xkeee--dsh-youreyes/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,126](https://img.shields.io/static/v1?label=npm+30d&message=1%2C126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)

**主要用途：**为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。

**推荐理由：**已有多视觉端点或本地Ollama者可显式通道试用；先设允许目录并核对auto云端回退，关键内容回看原图。

**使用条件：**需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。

[返回表格](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,526](https://img.shields.io/static/v1?label=npm+30d&message=1%2C526&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

**主要用途：**在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。

**推荐理由：**维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。

**使用条件：**适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

[返回表格](#column-index)

<a id="plugin-1335219884-root"></a>

## [dsh-web-tools](../../plugins/a3boy--dsh-web-tools/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=yellow&logo=github&style=flat)](https://github.com/A3Boy/dsh-web-tools)

**主要用途：**为DSH统一搜索与抓取接口适配多Provider、自定义JSON源及X/小红书原生浏览器检索。

**推荐理由：**适合可信本机公开资料检索的小范围试用，需核原来源/全文和实际支出；不可把off、required或false截断标记当全局保证。

**使用条件：**可信本机公开任务试用并核原始来源/预算，严格隔离/全量内容要求先核具体缺口。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1335286261-root"></a>

## [Markdown 批注器](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

**主要用途：**在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。

**推荐理由：**审阅中等Markdown者可按次试用定位批注；重生成后核对重复段落锚点并及时导出，不用于跨日未保存档案。

**使用条件：**适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。

[返回表格](#column-index)

<a id="plugin-1335798113-packages-messaging-core"></a>

## [messaging-core](../../plugins/534119219--dsh-messaging--packages-messaging-core/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/534119219/dsh-messaging)

**主要用途：**将多种消息渠道接入 DSH，统一授权、聊天会话映射、命令与回复路由。

**推荐理由：**已有机器人经验者可先以单平台私人聊天试用；收紧白名单，验证重连长消息及群共享上下文，不能凭渠道数量认定可靠。

**使用条件：**已有机器人接入经验的人可先用一个平台的私人聊天测试；固定版本、收紧白名单，核对重连和长消息，再开放群聊，群成员的共享上下文要提前明确。

[返回表格](#column-index)

<a id="plugin-1335807482-root"></a>

## [chicheng-cron](../../plugins/534119219--chicheng-cron/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)

**主要用途：**在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。

**推荐理由：**可重复可撤销的个人任务可先用只读日程试用；核对cwd、时区、超时和输出，关键产物另加完成检查。

**使用条件：**适合可重复、可撤销的个人定时任务；先用不改文件的任务检查时间、工作目录、超时、输出与通知，再尝试写操作，关键任务另配完成检查。

[返回表格](#column-index)

<a id="plugin-1335843750-root"></a>

## [dsh-verify](../../plugins/263311487-ux--dsh-verify/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/263311487-ux/dsh-verify) [![npm 30d 2,385](https://img.shields.io/static/v1?label=npm+30d&message=2%2C385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verify) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verify)

**主要用途：**执行 JSON 浏览器步骤并生成断言、截图和视觉差异报告，提供 CLI、MCP 与 DSH 工具入口。

**推荐理由：**适合可信本地应用的有限浏览器验收试用；独立审读spec和批准基线，不把新基线或runner错误当交付通过。

**使用条件：**建议可信本地有限spec试用，故意缺陷应失败、合法实现应通过；空覆盖、新基线和ERROR不放行，host阻塞或范围不清时停止。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1335992154-root"></a>

## [dsh-openai-oauth](../../plugins/adonissheldon--dsh-openai-oauth/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AdonisSheldon/dsh-openai-oauth) [![npm 30d 770](https://img.shields.io/static/v1?label=npm+30d&message=770&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth)

**主要用途：**为DSH接入ChatGPT OAuth的Codex模型provider，含PKCE/设备码登录、本机凭据刷新、设置页和headless命令。

**推荐理由：**本机认证/凭据/provider适配完整，可保留替代路由试用；注意协议、明文凭据和消息/退出边界，不拓展远程多用户。

**使用条件：**可试用为本机独立模型provider，保护明文凭据与真实工具审批，保留替代路由；不外推远程部署/静态模型全部可用/免费。详见Q05(#research-q05)。

[返回表格](#column-index)

<a id="plugin-1336084195-root"></a>

## [dsh-plugin-focus](../../plugins/863683348--dsh-plugin-focus/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) [![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)

**主要用途：**将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。

**推荐理由：**可明确单任务板所有权的工作区可试焦点注入；早期硬约束会被裁、set实际追加，需核保留范围；npm不含附带发布Skill。

**使用条件：**适合单任务工作区先试。重要约束保持简短并检查是否被条目上限裁掉，多会话共用目录时先明确所有权；不要自动执行附带发布Skill。

[返回表格](#column-index)

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,042](https://img.shields.io/static/v1?label=npm+30d&message=1%2C042&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

**主要用途：**为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。

**推荐理由：**持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。

**使用条件：**适合技术文档翻译先检查数字与术语一致。先用正反译和否定样例验证规则，quality高分后仍人工核对意义；不要将词表自动积累当正确性保证。

[返回表格](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

**主要用途：**在DSH web核对社区插件、管理活动profile并通过确认计划执行安装、更新、暂停和Harness升级。

**推荐理由：**维护闭环清楚且确认/恢复有实际源码，但真实代码执行、环境继承和全局升级需限可信本地范围。详见Q06(#research-q06)。

**使用条件：**本地单人维护者可试用，先核对可信代码、精确宿主和备份；canary仅作为兼容线索，异常先盘点实际状态。详见Q06(#research-q06)。

[返回表格](#column-index)

<a id="plugin-1339034478-root"></a>

## [dsh-ui-enhancer](../../plugins/alexyin-tongji--dsh-ui-enhancer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer) [![npm 30d 1,235](https://img.shields.io/static/v1?label=npm+30d&message=1%2C235&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer)

**主要用途：**组合工作区文件引用、壁纸和可自定义形象的桌面宠物。

**推荐理由：**需@文件引用者可先核工作区realpath和宿主输入接口；娱乐层另验隐私与去背景，不把宠物星星当交付指标。

**使用条件：**先核自己宿主的@引用、工作区范围和宠物隐私片段；不需要娱乐层时单独评估依赖面板。

[返回表格](#column-index)

<a id="plugin-1339316901-root"></a>

## [dsh-project-memory](../../plugins/00080000--dsh-project-memory/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) [![npm 30d 4,399](https://img.shields.io/static/v1?label=npm+30d&message=4%2C399&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory)

**主要用途：**为DSH索引项目文档和代码符号，分层召回带来源的内容，保存任务与经验，并按动作和查询门控注入相关记忆。

**推荐理由：**分层召回、项目根护栏与注入审计有明确试用价值；先单项目非敏感语料、审核引用和global，反思默认关闭，不能依近邻/曝光认定知识正确。

**使用条件：**有条件试用。先非敏感单项目/少量人工经验，核对引用和注入日志；反思/扩展保持默认关，global知识与近邻覆盖先审核，重要规范保留权威原件。详见Q09(#research-q09)。

[返回表格](#column-index)

<a id="plugin-1339803365-root"></a>

## [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)

**主要用途：**在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。

**推荐理由：**多工作区用户可先试置顶和复制路径，删除功能待测试目录确认路径与确认流程后启用。

**使用条件：**先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。

[返回表格](#column-index)

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

**主要用途：**为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。

**推荐理由：**已有公众号编辑流程者可先试本地质检和排版；分数非事实质量，推草稿需逐次授权核远端结果，未知响应不要直接重试。

**使用条件：**适合已有公众号编辑流程者先只做本地质检/排版；事实审阅和正式发布仍由人确认，API权限与账户条件另核。

[返回表格](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

**主要用途：**让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

**推荐理由：**lookup-only的共享笔记、拒答和来源收据值得非敏感单用户试用；审核当前状态与ranked旧页，nightly/导入/CLI另评，不能把canonical当事实认证。

**使用条件：**有条件试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见Q07(#research-q07)。

[返回表格](#column-index)

<a id="plugin-1341946801-root"></a>

## [dsh-question-nav](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,247](https://img.shields.io/static/v1?label=npm+30d&message=1%2C247&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)

**主要用途：**以会话提问索引与圆点导航跳转历史用户提问。

**推荐理由：**长会话用户可限定普通单文本提问、保持同一会话试导航；已知仅索引首块会漏多块或首块图片提问，跳转时不核原session，不能当完整历史。

**使用条件：**经常回看长会话者可列为导航候选；多模态/多文本块提问需核对索引完整性，不把圆点缺失理解为没有历史问题。

[返回表格](#column-index)

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 906](https://img.shields.io/static/v1?label=npm+30d&message=906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

**主要用途：**在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。

**推荐理由：**有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。

**使用条件：**适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

[返回表格](#column-index)

<a id="plugin-1344714819-root"></a>

## [dsh-invoice-tools](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 437](https://img.shields.io/static/v1?label=npm+30d&message=437&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools)

**主要用途：**在本地解析电子发票字段，核对金额并汇总生成报销单资料。

**推荐理由：**个人可用脱敏XML或文本票试汇总草稿；逐张核票号金额与买卖方，显式会话，xlsx.b64解码后再交财务，不支持OCR真伪查验。

**使用条件：**先用脱敏且有XML/文本层的发票做汇总草稿；逐张核票号、买卖方与金额，确认缓存会话和.xlsx.b64解码后再交财务。

[返回表格](#column-index)

<a id="plugin-1346196699-root"></a>

## [dsh-api-dashboard](../../plugins/133563825as-ai--dsh-api-dashboard/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/133563825as-ai/dsh-api-dashboard) [![npm 30d 4,179](https://img.shields.io/static/v1?label=npm+30d&message=4%2C179&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-api-dashboard)

**主要用途：**在DSH输入框旁展示多平台API余额、会话与子代理估算消耗，并提供配置看板。

**推荐理由：**多供应商用户可限可查询平台试额度看板，先对账和核对币种，自更新单独验备份回滚。

**使用条件：**先选择实际可查询的平台，对照控制台账单和混合币种；把看板作为预警与估算入口，自更新前保留配置和回退。

[返回表格](#column-index)

<a id="plugin-1351853903-root"></a>

## [dsh-wsl-tray](../../plugins/173787247--dsh-wsl-tray/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tray)

**主要用途：**为 WSL 内的 DSH Web 安装或报告 Windows 托盘与快捷方式启动入口。

**推荐理由：**已有dsh-wsl-kit者可显式kitPath试桌面恢复入口，先从快捷方式真实启动，核token去向与回退。

**使用条件：**适合已使用 dsh-wsl-kit 的 Windows 用户；显式设置 kitPath，先从快捷方式实际启动一次，再依赖托盘恢复，不把生成脚本成功当启动成功。

[返回表格](#column-index)

<a id="plugin-1352089397-root"></a>

## [dsh-soul](../../plugins/aliuyanfeng--dsh-soul/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,373](https://img.shields.io/static/v1?label=npm+30d&message=2%2C373&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)

**主要用途：**管理分层人设配置、提示词注入、变更历史及带确认的人设修改。

**推荐理由：**需显式风格管理者可试全局/工作区/会话配置；核首轮实际注入与下一轮覆盖，审计回滚非全作用域事务。

**使用条件：**适合显式风格管理；先核作用域和实际注入，重要规则仍由宿主权限和验收保障。

[返回表格](#column-index)

<a id="plugin-1356219122-root"></a>

## [dsh-turn-outline](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,546](https://img.shields.io/static/v1?label=npm+30d&message=1%2C546&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-turn-outline)

**主要用途：**把DSH会话事件折叠为轮次轨迹，并在better-sidebar侧栏定位回聊天或轨迹视图。

**推荐理由：**已用better-sidebar的长会话用户可试轮次大纲；核压缩前历史和并行工具锚点，摘要预览不替代完整审计日志。

**使用条件：**适合已用better-sidebar的长会话用户先试，核对压缩前历史和并行工具的定位；重大追溯仍查看完整日志。

[返回表格](#column-index)

<a id="plugin-1357066651-root"></a>

## [dsh-harness-chat-control](../../plugins/1985899182--dsh-harness-chat-control/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)

**主要用途：**为 DSH 会话提供引用、侧聊、会话编辑及侧聊模型与历史控制。

**推荐理由：**频繁引用局部问题侧聊者可试交互，先验编辑重载后的引用与模型输入一致，保留正式原记录。

**使用条件：**适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。

[返回表格](#column-index)

<a id="plugin-1358816037-root"></a>

## [模型信息补全](../../plugins/11zld22--dsh-model-info-fill/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/11zld22/dsh-model-info-fill)

**主要用途：**从 models.dev 为自定义模型补齐缺失能力，并保留人工确认与未声明状态。

**推荐理由：**维护多模型者可备份后试单供应商填充，核对官方能力及同名端点，未匹配项保留人工确认。

**使用条件：**先核对一个提供商的官方能力，备份配置再补齐，未匹配模型保持显式人工确认。

[返回表格](#column-index)

<a id="plugin-1363429979-plugin-daily-log"></a>

## [Forge 工作报告](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,976](https://img.shields.io/static/v1?label=npm+30d&message=1%2C976&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

**主要用途：**汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。

**推荐理由：**定期汇报者可先接单仓库单日志来源，对照手写报告检查作者过滤、遗漏和错误归功。

**使用条件：**先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。

[返回表格](#column-index)

<a id="plugin-1363429979-plugin-usage-billing"></a>

## [Forge 用量计费](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-usage-billing/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)

**主要用途：**从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。

**推荐理由：**需核对模型支出的用户可先选单模型一天账单，检查缓存计价、币种及未知金额。

**使用条件：**先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

[返回表格](#column-index)

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance-siderbar](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 859](https://img.shields.io/static/v1?label=npm+30d&message=859&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)

**主要用途：**按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。

**推荐理由：**多provider用户可在每类仅一个账户路由时试额度面板；同provider多key会共用首路由缓存，不能当当前各账户余额。

**使用条件：**适合路由较多且有额度查询接口者；先核账户匹配、来源新鲜度和外层路由授权。

[返回表格](#column-index)

<a id="plugin-1367305514-root"></a>

## [dsh-reasoning-tiers](../../plugins/1069137617--dsh-reasoning-tiers/INSIGHT.md)

[![npm 30d 1,044](https://img.shields.io/static/v1?label=npm+30d&message=1%2C044&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-reasoning-tiers)

**主要用途：**按规则补齐第三方模型推理档位，并在设置页编辑模型能力声明。

**推荐理由：**自定义模型用户可备份profile后试单模型档位修补，先核对真实请求和撤销结果。

**使用条件：**先备份 profile，对单个模型检查实际请求与撤销结果，再考虑批量补齐。

[返回表格](#column-index)

<a id="plugin-1372993989-root"></a>

## [dsh-eteams](../../plugins/2507483326--dsh-eteams/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2507483326/dsh-eteams) [![npm 30d 1,404](https://img.shields.io/static/v1?label=npm+30d&message=1%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-eteams) [![最新发布 2026-09-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-eteams)

**主要用途：**为DSH提供领队主导的多会话团队、任务执行链、成员对话与SQLite持久状态。

**推荐理由：**可在备份和明确人工验收的任务中试用真实多会话协作；先修正个人状态路径、限定Web管理面并处理近期重启对账缺口。

**使用条件：**试用，备份/可信管理面/明确人工验收，completed按成员报告解读，不能当全自动业务验收。详见Q08(#research-q08)。

[返回表格](#column-index)

## 更新时间

2026-10-22
