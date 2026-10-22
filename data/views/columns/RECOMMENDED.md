[返回首页](../../../README.md)

# 推荐

> 从这些值得尝试的插件开始，找到能帮你解决实际问题的工具。

<a id="column-index"></a>

**快速比较**

> 表格与下方说明按相同顺序排列；点击插件名跳转到本页说明。

| 插件 | 主要用途 | 为什么值得推荐 |
| --- | --- | --- |
| [dsh-repeat-stop](#plugin-1339262076-root) | 拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。 | 适合遭遇同工具同参数反复重试的任务，先核对触发计数与正常轮询排除规则；不能识别全部循环，尚未进行真实宿主验证。 |
| [dsh-session-diff](#plugin-1372976273-root) | 在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。 | 适合快速查看当前会话常规write/edit的改动；先核对双会话同文件和shell改动的覆盖边界，完整审查仍以Git为准，尚未进行真实宿主验证。 |
| [dsh-sidebar-git-graph](#plugin-1393980674-root) | 在DSH右侧栏显示当前会话仓库的分支提交图、工作树和暂存区差异。 | 适合在会话旁只读查看Git历史、工作树和暂存区；先确认仓库、扫描截断及刷新时点，不把图谱当CI或完整审查，尚未进行真实宿主验证。 |
| [dsh-which](#plugin-1423215529-root) | 解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。 | 适合排查PATH遮蔽与多版本命令冲突，先只查询并与当前shell对照；对可信二进制再启用版本探测，尚未进行真实宿主验证。 |
| [URL 正文阅读器](#plugin-1335047324-root) | 读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。 | 适合抓取结果噪声多、常需中文编码和续读的资料阅读，先与原生抓取对照；表格、动态页和关键事实回读原文，尚未进行真实宿主验证。 |
| [dsh-tool-budget](#plugin-1350325873-root) | 按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。 | 适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。 |
| [dsh-agent-recycle-guard](#plugin-1414323673-root) | 检查DSH的Shell工具调用，将识别到的删除改写为回收站操作，无法安全处理时拒绝。 | 需常见误删保护者可先在可丢弃目录验真实回收与恢复；继续保留宿主沙箱和备份，核依赖来源及动态脚本漏检。 |
| [DSH Telemetry Redactor](#plugin-1333368566-root) | 在遥测记录瀑布中递归脱敏支持的凭据模式，保留原始会话日志。 | 已有遥测出口的部署者可用假密钥试验脱敏，先核对漏删、误删及原始日志保留。 |
| [dsh-thumb](#plugin-1341694685-root) | 为窄屏DSH提供覆盖式会话抽屉、单列设置与紧凑阅读样式。 | 手机窄屏用户可试自动收侧栏；先核设置和相邻trace视图，24px按钮较小，重视触达者调密度或停用。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 把聊天中的Linux文件路径转为可从Windows打开的文件入口。 | WSL同机文件交接者可先用非敏感文件试用；当前路径识别会跳过含空格等路径，需人工核对目标，返回ok不证明已正确打开。 |
| [dsh-wsl-hostsvc](#plugin-1351854010-root) | 从WSL探测Windows端本地模型服务，并生成连接与上下文配置建议。 | Windows本地模型用户可试TCP/API分层探测，先核IP、模型ID与实际小生成，再采用配置片段。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在 DSH 设置页展示本机 Token、模型分布和技能调用状态。 | 个人用量复盘可试用可重建索引；先对少量原始日志核对重试和技能结果，不将调用成功率当业务质量。 |
| [dsh-cache-bricks](#plugin-1386463441-root) | 可视化 DSH 模型请求、缓存命中率、活动与历史请求对比。 | 有缓存波动排查问题者可试用请求砖图；先核对三桶usage与采集范围，颜色变化只作定位线索。 |
| [上下文交接提醒](#plugin-1396768359-root) | 消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。 | 愿主动交接的长会话用户可先在临时目录试用；明确HANDOVER写入、保留和分享范围，补齐草稿后比较真实接续成本。 |
| [mac-notify](#plugin-1402940561-root) | 把 DSH 完成、提问、审批与报错转为 macOS 原生通知。 | macOS后台任务用户可试完成与问题提醒；先限制敏感摘要和声音，验通知权限，点击后仍手动定位具体会话。 |
| [dsh-pinned-sessions](#plugin-1407379611-root) | 在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。 | 适合跨多个工作区找置顶会话，先验证搜索、归档过滤与取消置顶；宿主升级后核对侧栏入口，尚未进行真实宿主验证。 |
| [dsh-draft-attachments](#plugin-1414492607-root) | 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。 | 频繁切换带附件草稿者可用可丢弃文件试用；验证慢存储恢复、发送后不复活及超限，并定期清理敏感字节。 |
| [agent-clinic](#plugin-1417442557-root) | 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。 | Agent排障者可离线扫少量会话试证据定位，先回读原行并检查指纹隐私，配置处方另行备份验证。 |
| [AgentDebugX](#plugin-1296792947-integrations-dsh-agentdebugx) | 按需将DSH当前或选定历史会话接入AgentDebugX诊断，并保存可关联的轨迹与报告。 | Agent开发者可在脱敏历史会话试诊断；先核轨迹映射并保留原文，deep意见须用独立事实确认根因。 |
| [dsh-autocompact](#plugin-1324229194-dsh-autocompact) | 为会话与模型设置自动压缩阈值，保留近期上下文并调用宿主压缩后端。 | 了解模型窗口的长会话用户可先试提前压缩；核对阈值、工具配对与重启覆盖，用依赖早期信息的任务验接续。 |
| [dsh-stock-market](#plugin-1331846104-root) | 为DSH提供沪深A股行情侧栏与股票数据工具，按会话控制工具访问并标注多源回退口径。 | 公开市场资料研究者可先做只读交叉核对；核报价时点、成交量口径和degraded来源，商业复用另查授权。 |
| [dsh-hdc-bridge](#plugin-1333258432-root) | 在 DSH 中连接鸿蒙设备，构建调试应用并查询版本化开发知识。 | 已有鸿蒙环境者仅在人工固定测试设备并核验产物时试用；devecocli可带stale成功、默认会回退首设备，不能以ok认定本次代码部署正确。 |
| [dsh-vision-fallback](#plugin-1333993743-root) | 将 DSH 图片交给独立视觉模型，并把观察结果返回当前主模型。 | 必须保留纯文本主模型的用户可试用图像旁路；先检查外发上下文范围与难图误读，关键文字回看原图。 |
| [dsh-plugin-manager](#plugin-1334267268-root) | 给 DSH 插件提供中文目录说明、启停、备注编辑及配置备份管理界面。 | 维护多插件者可在独立profile试用中文目录与启停；先验系统保护、表达式拒绝、备份恢复和真实fiber状态。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 | 已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。 |
| [dsh-voice](#plugin-1334554745-root) | 通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。 | 不便键盘输入者可用非敏感口述试用；确认生效引擎与Web Speech回退，重要指令提交前核对文字。 |
| [dsh-mermaid](#plugin-1334569498-root) | 按视口延迟渲染已完成Mermaid代码块，并提供缩放与错误报告入口。 | 需读流程图者可先只用渲染；修复按钮已知会覆盖草稿并模拟Enter，未保留草稿时不要使用该按钮。 |
| [model-usage-plugin](#plugin-1334569518-root) | 聚合模型用量、工具活动及按可配置单价估算的费用趋势。 | 需消费结构线索者可试估算面板；先校价格、provider和套餐，再对供应商账单，工具最近模型归因不作因果或财务凭证。 |
| [dsh-youreyes](#plugin-1335045545-root) | 为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。 | 已有多视觉端点或本地Ollama者可显式通道试用；先设允许目录并核对auto云端回退，关键内容回看原图。 |
| [dsh-plugin-mall](#plugin-1335098475-root) | 在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。 | 维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。 |
| [dsh-token-billing](#plugin-1335139860-root) | 为 DSH 提供按供应商、模型、时段与用量计算的实时费用与账本统计。 | 多供应商用户可试用路由费用参考；先核对最终usage回补、缓存桶和币种，账本不能直接结算。 |
| [Markdown 批注器](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。 | 审阅中等Markdown者可按次试用定位批注；重生成后核对重复段落锚点并及时导出，不用于跨日未保存档案。 |
| [messaging-core](#plugin-1335798113-packages-messaging-core) | 将多种消息渠道接入 DSH，统一授权、聊天会话映射、命令与回复路由。 | 已有机器人经验者可先以单平台私人聊天试用；收紧白名单，验证重连长消息及群共享上下文，不能凭渠道数量认定可靠。 |
| [chicheng-cron](#plugin-1335807482-root) | 在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。 | 可重复可撤销的个人任务可先用只读日程试用；核对cwd、时区、超时和输出，关键产物另加完成检查。 |
| [dsh-verify](#plugin-1335843750-root) | 通过 JSON 清单执行浏览器断言，提供 CLI、MCP 与 HTML 检查报告。 | 已有明确网页验收规范的团队可试用声明式浏览器断言；独立审查清单与首建截图基线，PASS仅覆盖写入的步骤。 |
| [dsh-diff-approval](#plugin-1335980444-root) | 汇总Agent成功文件改动供逐文件或逐块保留、回退，并支持导入本地版本控制差异。 | 逐块审Agent改动者可在临时仓库试用事后diff；核外部变化及回退权限，新文件revert会删除，保留VCS备份。 |
| [dsh-plugin-focus](#plugin-1336084195-root) | 将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。 | 可明确单任务板所有权的工作区可试焦点注入；早期硬约束会被裁、set实际追加，需核保留范围；npm不含附带发布Skill。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。 | 持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。 |
| [dsh-plugin-console](#plugin-1336720864-root) | 在设置页浏览目录与已装插件，规划变更并执行官方CLI和隔离profile启动检查。 | Web profile维护者可在测试profile试安装计划与回滚；核空间和canary结果，临时HOME非OS沙箱，只用可信插件并另验重启UI。 |
| [dsh-mysql](#plugin-1337916824-root) | 管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。 | 数据库分析者可限脱敏测试库及数据库只读账号试用，先核对选库、SQL与结果，写入另验。 |
| [dsh-wsl-net](#plugin-1338965593-root) | 检查WSL代理、DSH进程环境与常见服务连通性，并给出修复建议。 | WSL联网排障者可试多进程代理汇总，先核选中PID是否当前宿主，修复后在实际会话验证。 |
| [dsh-ui-enhancer](#plugin-1339034478-root) | 组合工作区文件引用、壁纸和可自定义形象的桌面宠物。 | 需@文件引用者可先核工作区realpath和宿主输入接口；娱乐层另验隐私与去背景，不把宠物星星当交付指标。 |
| [dsh-github-router](#plugin-1339462797-root) | 为DSH提供只读GitHub工具，在API、gh、git、页面和可选镜像之间路由并汇报分段来源。 | 常遇GitHub连接失败的只读分析者可禁镜像试多路读取；核token范围、分段版本和缺块，不能把拼接结果当同一完整快照。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。 | 多工作区用户可先试置顶和复制路径，删除功能待测试目录确认路径与确认流程后启用。 |
| [gzhflow](#plugin-1339888505-root) | 为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。 | 已有公众号编辑流程者可先试本地质检和排版；分数非事实质量，推草稿需逐次授权核远端结果，未知响应不要直接重试。 |
| [dsh-websearch](#plugin-1340340493-root) | 为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。 | 多源研究用户可先选少量可用后端试用；用中文及时效题核对原文、尾延迟与全部调用预算，再增加独立有益来源。 |
| [dock](#plugin-1340492184-root) | 向扩展提供活动栏、浮窗、编辑视图、状态和设置注册服务的客户端工作台。 | 需要聊天旁多面板者和扩展作者可先接少量扩展；验打开关闭重载及版本契约，布局持久化不能代替文件保存。 |
| [KRouter](#plugin-1341648244-root) | 以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。 | 愿维护决策库者可先只读试用有效页检索；核对拒答和来源，导入蒸馏及夜间写作另立流程。 |
| [dsh-question-nav](#plugin-1341946801-root) | 以会话提问索引与圆点导航跳转历史用户提问。 | 长会话用户可限定普通单文本提问、保持同一会话试导航；已知仅索引首块会漏多块或首块图片提问，跳转时不核原session，不能当完整历史。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 | 有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。 |

<a id="plugin-1339262076-root"></a>

## [dsh-repeat-stop](../../plugins/173787247--dsh-repeat-stop/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)

**主要用途：**拦截同一Agent连续出现的同工具同参数调用，提供可配置阈值与排除规则。

**推荐理由：**适合遭遇同工具同参数反复重试的任务，先核对触发计数与正常轮询排除规则；不能识别全部循环，尚未进行真实宿主验证。

**使用条件：**先在短任务记录触发次数，按轮询工具配置排除；被拦后检查输入和错误原因，不通过无意义改参数规避限制。

[返回表格](#column-index)

<a id="plugin-1372976273-root"></a>

## [dsh-session-diff](../../plugins/2002xiaoyu--dsh-session-diff/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2002XiaoYu/dsh-session-diff)

**主要用途：**在 DSH 右侧栏显示当前会话修改文件的行级差异和变更列表。

**推荐理由：**适合快速查看当前会话常规write/edit的改动；先核对双会话同文件和shell改动的覆盖边界，完整审查仍以Git为准，尚未进行真实宿主验证。

**使用条件：**适合快速检查当前会话的常规write/edit；跨会话、shell改动和大文件仍用Git或专门差异工具复核。

[返回表格](#column-index)

<a id="plugin-1393980674-root"></a>

## [dsh-sidebar-git-graph](../../plugins/afundog--dsh-sidebar-git-graph/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AFunDog/dsh-sidebar-git-graph)

**主要用途：**在DSH右侧栏显示当前会话仓库的分支提交图、工作树和暂存区差异。

**推荐理由：**适合在会话旁只读查看Git历史、工作树和暂存区；先确认仓库、扫描截断及刷新时点，不把图谱当CI或完整审查，尚未进行真实宿主验证。

**使用条件：**适合会话内只读查看Git。先确认选中仓库、扫描范围和刷新，再作提交判断；图谱不是CI或代码正确性验收。

[返回表格](#column-index)

<a id="plugin-1423215529-root"></a>

## [dsh-which](../../plugins/11111353535--dsh-which/INSIGHT.md)



**主要用途：**解释命令的 PATH 解析结果、被遮蔽副本及环境异常，可选探测版本。

**推荐理由：**适合排查PATH遮蔽与多版本命令冲突，先只查询并与当前shell对照；对可信二进制再启用版本探测，尚未进行真实宿主验证。

**使用条件：**先只查询并对照当前 shell 的解析结果，必要时对可信二进制启用版本探测。

[返回表格](#column-index)

<a id="plugin-1335047324-root"></a>

## [URL 正文阅读器](../../plugins/2672243194--dsh-read-url/INSIGHT.md)

[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=yellow&logo=github&style=flat)](https://github.com/2672243194/dsh-read-url) [![npm 30d 2,587](https://img.shields.io/static/v1?label=npm+30d&message=2%2C587&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-read-url) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-read-url)

**主要用途：**读取网页、JSON 与订阅源，清理正文并提供分页续读和批量读取。

**推荐理由：**适合抓取结果噪声多、常需中文编码和续读的资料阅读，先与原生抓取对照；表格、动态页和关键事实回读原文，尚未进行真实宿主验证。

**使用条件：**适合已有抓取结果噪声多、常需中文编码和续读的场景先对照使用；答案依赖表格或动态页面时核对原文与截断标记。

[返回表格](#column-index)

<a id="plugin-1350325873-root"></a>

## [dsh-tool-budget](../../plugins/173787247--dsh-tool-budget/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)

**主要用途：**按运行中的Agent限制工具调用总次数，支持包含与排除规则并在超额时拦截。

**推荐理由：**适合需要明确工具调用停止点的长任务，先观察同类任务调用量再设阈值；只限制每Agent调用次数，不是团队现金预算，尚未进行真实宿主验证。

**使用条件：**先按一类任务观察正常调用分布，再设阈值；长后台任务查询可排除，但排除列表应保持有限。

[返回表格](#column-index)

<a id="plugin-1414323673-root"></a>

## [dsh-agent-recycle-guard](../../plugins/ahyi8--dsh-agent-recycle-guard/INSIGHT.md)

[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard)

**主要用途：**检查DSH的Shell工具调用，将识别到的删除改写为回收站操作，无法安全处理时拒绝。

**推荐理由：**需常见误删保护者可先在可丢弃目录验真实回收与恢复；继续保留宿主沙箱和备份，核依赖来源及动态脚本漏检。

**使用条件：**在可丢弃目录验证平台真实回收和恢复后采用。作为常见误删防护，继续保留宿主沙箱、备份和重要路径权限。

[返回表格](#column-index)

<a id="plugin-1333368566-root"></a>

## [DSH Telemetry Redactor](../../plugins/030611--dsh-telemetry-redactor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-telemetry-redactor) [![npm 30d 1,162](https://img.shields.io/static/v1?label=npm+30d&message=1%2C162&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-telemetry-redactor)

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

<a id="plugin-1386463441-root"></a>

## [dsh-cache-bricks](../../plugins/3289192-bot--dsh-cache-bricks/INSIGHT.md)



**主要用途：**可视化 DSH 模型请求、缓存命中率、活动与历史请求对比。

**推荐理由：**有缓存波动排查问题者可试用请求砖图；先核对三桶usage与采集范围，颜色变化只作定位线索。

**使用条件：**适合有明确缓存排查问题的用户试用，先核对provider usage口径与采集完整度，不据颜色直接删工具或归责某个提示改动。

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

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

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

<a id="plugin-1296792947-integrations-dsh-agentdebugx"></a>

## [AgentDebugX](../../plugins/agentdebugx--agentdebugx--integrations-dsh-agentdebugx/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agentdebugx)

**主要用途：**按需将DSH当前或选定历史会话接入AgentDebugX诊断，并保存可关联的轨迹与报告。

**推荐理由：**Agent开发者可在脱敏历史会话试诊断；先核轨迹映射并保留原文，deep意见须用独立事实确认根因。

**使用条件：**先在脱敏历史会话验证映射和诊断准确性；保留原始轨迹并审查持久化范围，deep结论需独立证据。

[返回表格](#column-index)

<a id="plugin-1324229194-dsh-autocompact"></a>

## [dsh-autocompact](../../plugins/5aaee9--pi-agent-extensions--dsh-autocompact/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/5aaee9/pi-agent-extensions) [![npm 30d 735](https://img.shields.io/static/v1?label=npm+30d&message=735&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@indexyz/dsh-autocompact)

**主要用途：**为会话与模型设置自动压缩阈值，保留近期上下文并调用宿主压缩后端。

**推荐理由：**了解模型窗口的长会话用户可先试提前压缩；核对阈值、工具配对与重启覆盖，用依赖早期信息的任务验接续。

**使用条件：**长会话且了解模型窗口时可试。先确认阈值、保留尾部和重启行为，用含工具结果的任务检查压缩后能否继续。

[返回表格](#column-index)

<a id="plugin-1331846104-root"></a>

## [dsh-stock-market](../../plugins/anacondakc--dsh-stock-market/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-stock-market)

**主要用途：**为DSH提供沪深A股行情侧栏与股票数据工具，按会话控制工具访问并标注多源回退口径。

**推荐理由：**公开市场资料研究者可先做只读交叉核对；核报价时点、成交量口径和degraded来源，商业复用另查授权。

**使用条件：**适合只读资料研究，先交叉核对报价时点和来源，降级结果分开用。商业或高频场景先确认数据授权与服务条件。

[返回表格](#column-index)

<a id="plugin-1333258432-root"></a>

## [dsh-hdc-bridge](../../plugins/1na-ko--dsh-hdc-bridge/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) [![npm 30d 1,689](https://img.shields.io/static/v1?label=npm+30d&message=1%2C689&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)

**主要用途：**在 DSH 中连接鸿蒙设备，构建调试应用并查询版本化开发知识。

**推荐理由：**已有鸿蒙环境者仅在人工固定测试设备并核验产物时试用；devecocli可带stale成功、默认会回退首设备，不能以ok认定本次代码部署正确。

**使用条件：**已有鸿蒙环境的开发者可在测试设备评估；先验证构建产物与设备身份，再评价闭环是否省时。

[返回表格](#column-index)

<a id="plugin-1333993743-root"></a>

## [dsh-vision-fallback](../../plugins/1helloman1--dsh-vision-fallback/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-vision-fallback) [![npm 30d 909](https://img.shields.io/static/v1?label=npm+30d&message=909&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback)

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

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

**主要用途：**管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。

**推荐理由：**已有酒馆角色资料的作者可导入副本试用；核对占位符丢语义和世界书命中，外部卡注入前审内容。

**使用条件：**已有酒馆资料的写作者可先导入副本。检查占位符、世界书命中与激活预设，别直接把原平台效果视为DSH已复现。

[返回表格](#column-index)

<a id="plugin-1334554745-root"></a>

## [dsh-voice](../../plugins/3274375092--dsh-voice/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) [![npm 30d 578](https://img.shields.io/static/v1?label=npm+30d&message=578&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)

**主要用途：**通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。

**推荐理由：**不便键盘输入者可用非敏感口述试用；确认生效引擎与Web Speech回退，重要指令提交前核对文字。

**使用条件：**先用非敏感内容核对生效引擎及识别质量；有严格本地要求时需核查回退行为，重要指令提交前复核文字。

[返回表格](#column-index)

<a id="plugin-1334569498-root"></a>

## [dsh-mermaid](../../plugins/aks1st--dsh-mermaid/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)

**主要用途：**按视口延迟渲染已完成Mermaid代码块，并提供缩放与错误报告入口。

**推荐理由：**需读流程图者可先只用渲染；修复按钮已知会覆盖草稿并模拟Enter，未保留草稿时不要使用该按钮。

**使用条件：**先核宿主代码块兼容；错误修复按钮会尝试发送消息，使用前保留已有草稿。

[返回表格](#column-index)

<a id="plugin-1334569518-root"></a>

## [model-usage-plugin](../../plugins/aks1st--model-usage-plugin/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/model-usage-plugin) [![npm 30d 972](https://img.shields.io/static/v1?label=npm+30d&message=972&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/model-usage-plugin) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/model-usage-plugin)

**主要用途：**聚合模型用量、工具活动及按可配置单价估算的费用趋势。

**推荐理由：**需消费结构线索者可试估算面板；先校价格、provider和套餐，再对供应商账单，工具最近模型归因不作因果或财务凭证。

**使用条件：**作为估算面板使用，先校准provider、套餐和单价口径；正式费用以供应商账单核对。

[返回表格](#column-index)

<a id="plugin-1335045545-root"></a>

## [dsh-youreyes](../../plugins/54xkeee--dsh-youreyes/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,096](https://img.shields.io/static/v1?label=npm+30d&message=1%2C096&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)

**主要用途：**为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。

**推荐理由：**已有多视觉端点或本地Ollama者可显式通道试用；先设允许目录并核对auto云端回退，关键内容回看原图。

**使用条件：**需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。

[返回表格](#column-index)

<a id="plugin-1335098475-root"></a>

## [dsh-plugin-mall](../../plugins/1e0zj--dsh-plugin-mall/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1e0zj/dsh-plugin-mall) [![npm 30d 1,485](https://img.shields.io/static/v1?label=npm+30d&message=1%2C485&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@1e0zj/dsh-plugin-mall)

**主要用途：**在 DSH 中搜索 GitHub 插件并提供安装、更新、冲突预检与启动恢复。

**推荐理由：**维护多插件环境可在隔离profile试用冲突预检与恢复；先注入加载失败并核对备份，不把进程稳定视作功能验收。

**使用条件：**适合维护多个插件的DSH环境；先在隔离profile验证冲突提示和回滚，再用于日常安装，重要环境保留独立备份。

[返回表格](#column-index)

<a id="plugin-1335139860-root"></a>

## [dsh-token-billing](../../plugins/2006spy--dsh-token-billing/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/2006spy/dsh-token-billing)

**主要用途：**为 DSH 提供按供应商、模型、时段与用量计算的实时费用与账本统计。

**推荐理由：**多供应商用户可试用路由费用参考；先核对最终usage回补、缓存桶和币种，账本不能直接结算。

**使用条件：**适合需要多路由费用参考的用户；先对照供应商账单核实缓存、峰谷和币种口径，再据看板调整预算。

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

**主要用途：**通过 JSON 清单执行浏览器断言，提供 CLI、MCP 与 HTML 检查报告。

**推荐理由：**已有明确网页验收规范的团队可试用声明式浏览器断言；独立审查清单与首建截图基线，PASS仅覆盖写入的步骤。

**使用条件：**适合已有明确浏览器验收条件的网页团队先试用；分别审查规范、首次基线和运行错误，保留结构化结果，不用 PASS 代表完整需求或独立审计。

[返回表格](#column-index)

<a id="plugin-1335980444-root"></a>

## [dsh-diff-approval](../../plugins/9087--dsh-diff-approval/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,357](https://img.shields.io/static/v1?label=npm+30d&message=5%2C357&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)

**主要用途：**汇总Agent成功文件改动供逐文件或逐块保留、回退，并支持导入本地版本控制差异。

**推荐理由：**逐块审Agent改动者可在临时仓库试用事后diff；核外部变化及回退权限，新文件revert会删除，保留VCS备份。

**使用条件：**适合经常逐块审阅Agent改动的开发者在临时仓库试用。先核对已写入后的审阅语义、外部改动提示与回退权限，重要工作保留版本控制备份。

[返回表格](#column-index)

<a id="plugin-1336084195-root"></a>

## [dsh-plugin-focus](../../plugins/863683348--dsh-plugin-focus/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) [![npm 30d 867](https://img.shields.io/static/v1?label=npm+30d&message=867&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)

**主要用途：**将任务目标、约束与决策保存为工作区焦点板，并注入会话及展示面板。

**推荐理由：**可明确单任务板所有权的工作区可试焦点注入；早期硬约束会被裁、set实际追加，需核保留范围；npm不含附带发布Skill。

**使用条件：**适合单任务工作区先试。重要约束保持简短并检查是否被条目上限裁掉，多会话共用目录时先明确所有权；不要自动执行附带发布Skill。

[返回表格](#column-index)

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

**主要用途：**为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。

**推荐理由：**持续技术翻译者可试分段术语记忆与数字检查；以否定和主客体样例验规则，高分仍需语义校译，词表先审后存。

**使用条件：**适合技术文档翻译先检查数字与术语一致。先用正反译和否定样例验证规则，quality高分后仍人工核对意义；不要将词表自动积累当正确性保证。

[返回表格](#column-index)

<a id="plugin-1336720864-root"></a>

## [dsh-plugin-console](../../plugins/alexyin-tongji--dsh-plugin-console/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-plugin-console) [![npm 30d 1,111](https://img.shields.io/static/v1?label=npm+30d&message=1%2C111&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-console) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-console)

**主要用途：**在设置页浏览目录与已装插件，规划变更并执行官方CLI和隔离profile启动检查。

**推荐理由：**Web profile维护者可在测试profile试安装计划与回滚；核空间和canary结果，临时HOME非OS沙箱，只用可信插件并另验重启UI。

**使用条件：**适合维护测试profile；先核备份空间、canary与回滚，生产环境重启后的UI必须另验。

[返回表格](#column-index)

<a id="plugin-1337916824-root"></a>

## [dsh-mysql](../../plugins/1321928757--dsh-mysql/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) [![npm 30d 35](https://img.shields.io/static/v1?label=npm+30d&message=35&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mysql)

**主要用途：**管理多套MySQL连接，为会话提供选库入口及查询、表结构、数据写入和DDL工具。

**推荐理由：**数据库分析者可限脱敏测试库及数据库只读账号试用，先核对选库、SQL与结果，写入另验。

**使用条件：**先连接脱敏测试库和数据库端只读账号，核对选库与结果；确需写入时分别启用行写和DDL，并准备备份与人工复核。

[返回表格](#column-index)

<a id="plugin-1338965593-root"></a>

## [dsh-wsl-net](../../plugins/173787247--dsh-wsl-net/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-net)

**主要用途：**检查WSL代理、DSH进程环境与常见服务连通性，并给出修复建议。

**推荐理由：**WSL联网排障者可试多进程代理汇总，先核选中PID是否当前宿主，修复后在实际会话验证。

**使用条件：**先核对报告中的进程和代理地址，修复后在实际DSH会话验证；不要只重开Shell就认为宿主已更新。

[返回表格](#column-index)

<a id="plugin-1339034478-root"></a>

## [dsh-ui-enhancer](../../plugins/alexyin-tongji--dsh-ui-enhancer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer) [![npm 30d 1,212](https://img.shields.io/static/v1?label=npm+30d&message=1%2C212&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer)

**主要用途：**组合工作区文件引用、壁纸和可自定义形象的桌面宠物。

**推荐理由：**需@文件引用者可先核工作区realpath和宿主输入接口；娱乐层另验隐私与去背景，不把宠物星星当交付指标。

**使用条件：**先核自己宿主的@引用、工作区范围和宠物隐私片段；不需要娱乐层时单独评估依赖面板。

[返回表格](#column-index)

<a id="plugin-1339462797-root"></a>

## [dsh-github-router](../../plugins/angeloszou--dsh-github-router/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-github-router) [![npm 30d 1,602](https://img.shields.io/static/v1?label=npm+30d&message=1%2C602&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-github-router) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-github-router)

**主要用途：**为DSH提供只读GitHub工具，在API、gh、git、页面和可选镜像之间路由并汇报分段来源。

**推荐理由：**常遇GitHub连接失败的只读分析者可禁镜像试多路读取；核token范围、分段版本和缺块，不能把拼接结果当同一完整快照。

**使用条件：**适合经常遇连接失败的只读仓库分析，先禁镜像并核对token范围和分段版本；缺块不能当不存在讨论或变更。

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

<a id="plugin-1340340493-root"></a>

## [dsh-websearch](../../plugins/240xu--dsh-websearch/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/240xu/dsh-websearch) [![npm 30d 4,731](https://img.shields.io/static/v1?label=npm+30d&message=4%2C731&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-websearch)

**主要用途：**为 DSH 提供聚合网页搜索 provider，合并多个后端结果并支持过滤、缓存和故障降级。

**推荐理由：**多源研究用户可先选少量可用后端试用；用中文及时效题核对原文、尾延迟与全部调用预算，再增加独立有益来源。

**使用条件：**先选少量可访问后端，用常见中文与时效问题核对出处、耗时和全部调用预算；逐步增加有独立增益的服务。重要研究仍应打开原文核查，不能把聚合排序当事实验证。

[返回表格](#column-index)

<a id="plugin-1340492184-root"></a>

## [dock](../../plugins/aks1st--dock/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-base)

**主要用途：**向扩展提供活动栏、浮窗、编辑视图、状态和设置注册服务的客户端工作台。

**推荐理由：**需要聊天旁多面板者和扩展作者可先接少量扩展；验打开关闭重载及版本契约，布局持久化不能代替文件保存。

**使用条件：**先与少量扩展验证打开、关闭和重载；将布局持久化与文件保存分别验收。

[返回表格](#column-index)

<a id="plugin-1341648244-root"></a>

## [KRouter](../../plugins/398894496-arch--krouter/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)

**主要用途：**以本地 Markdown 知识库为多种 Agent 提供带出处的记忆查询、纠错与拒答机制。

**推荐理由：**愿维护决策库者可先只读试用有效页检索；核对拒答和来源，导入蒸馏及夜间写作另立流程。

**使用条件：**有决策知识库且愿维护状态时可先只读试用，核查来源页与拒答；不要把默认检索成功等同于记忆正确，导入与夜间写作应单独设置。

[返回表格](#column-index)

<a id="plugin-1341946801-root"></a>

## [dsh-question-nav](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,224](https://img.shields.io/static/v1?label=npm+30d&message=1%2C224&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)

**主要用途：**以会话提问索引与圆点导航跳转历史用户提问。

**推荐理由：**长会话用户可限定普通单文本提问、保持同一会话试导航；已知仅索引首块会漏多块或首块图片提问，跳转时不核原session，不能当完整历史。

**使用条件：**经常回看长会话者可列为导航候选；多模态/多文本块提问需核对索引完整性，不把圆点缺失理解为没有历史问题。

[返回表格](#column-index)

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 899](https://img.shields.io/static/v1?label=npm+30d&message=899&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

**主要用途：**在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。

**推荐理由：**有只读MySQL环境的分析者可用标准答案试SQL报表，先核业务口径与数据权限，重跑仍验Schema。

**使用条件：**适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

[返回表格](#column-index)

## 更新时间

2026-10-22
