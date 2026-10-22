# 办公与运营

[返回首页](../../../README.md)

工作记录、日程、团队用量与日常运营。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把会话副产物移入可还原回收站，并提供项目结项归类、归档与清理清单。 | 先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。 |
| [chicheng-push](#plugin-1335382133-root) | 在 DSH 配置多种推送渠道，并通过进程内服务或 HTTP 接口发送通知。 | 有多个任务插件要发通知时可先接一个非敏感测试渠道；检查每渠道结果、令牌文件权限和远程接口范围，再发正式任务摘要，避免把秘密内容直接推到群里。 |
| [dsh-desktop-uia](#plugin-1381221232-root) | 通过 Windows UI Automation 为 DSH 提供桌面控件读取、操作与审计面板。 | 适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。 |
| [dsh-feishu-bot](#plugin-1346023250-root) | 通过飞书应用机器人长连接操作 DSH 项目与会话，支持扫码绑定、审批与完成通知。 | 远程控制需求明确时在专用profile试用，先固定允许chat、验证拒绝/取消/断连恢复；普通消息具有该DSH profile的实际权限。 |
| [dsh-feishu（2048lr）](#plugin-1418842530-root) | 为 DSH 提供飞书与 Lark 文档、表格、多维表格、消息和授权工具及操作面板。 | 先在测试租户明确选user身份，创建一份可丢弃文档并确认实际落点和权限，再验证token过期及超时重试；正式写入前要检查重复创建，避免把auto降级警告忽略。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 在本地解析电子发票字段，核对金额并汇总生成报销单资料。 | 先用脱敏且有XML/文本层的发票做汇总草稿；逐张核票号、买卖方与金额，确认缓存会话和.xlsx.b64解码后再交财务。 |
| [dsh-msg-hub](#plugin-1335387524-root) | 把微信、QQ、飞书消息接到 DSH 会话，并提供主动推送与远程审批。 | 可先作为渠道桥源码候选；当前远程批准归属不足，不建议让它承担真实高影响工具的批准。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 | 适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。 |
| [dsh-team-cost](#plugin-1364961230-root) | 按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。 | 先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。 |
| [dsh-toolbox-web](#plugin-1335244607-root) | 在 Web 管理会话、回收站、搜索与配置，并提供后台定时心跳。 | 可按只读搜索和会话整理需求分功能评估；在线编辑/截断原会话需要先解决代际与并发一致性，不能仅因带回收站就视为全程可逆。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 通过本地khal读取日历列表、今日日程和未来指定天数的安排。 | 适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。 |
| [dsh-wsl-wininput](#plugin-1391142149-root) | 从 WSL 按名称调用 Windows 控件，或向指定窗口发送文本、按键与点击。 | 适合有人看护的Windows自动化；优先具备唯一名称的invoke，打字/点击会干扰焦点和鼠标，执行前暂停其他桌面操作并检查结果。 |
| [Markdown 批注器](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。 | 适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。 |

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



> **用途**：AI生成的探测、草稿和缓存污染工作区，用户需要减少整理负担并能恢复误收文件。

> **亮点**：Host在turn/end后台派生Python清运；cleanup.py按规则移动文件并写manifest，项目open时跳过自动清理，结项时分类与归档。

> **思考**：可逆移动及清单降低首次误收损失；规则覆盖面广且会过期真删，不应替代项目引用和保留策略。

> **建议**：先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。

<a id="plugin-1335382133-root"></a>

## [chicheng-push](../../plugins/534119219--chicheng-push/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

> **用途**：其他DSH插件或脚本在任务结束时向个人设备/群组发送标题与内容，交付每渠道发送结果，用户仍需确认消息被接收与处理。

> **亮点**：相对每个定时任务内各写Webhook脚本，贡献是集中管理DSH通知配置，用进程内服务和HTTP复用同一发送入口与每渠道错误结果。渠道实现明确参考qinglong notify，不能把成熟渠道协议算作原创；插件增量是DSH配置、服务与调用者接线。

> **思考**：返回ok是否等于用户可靠收到？sender多以HTTP和渠道业务码判断接受，并无统一送达回执或持久重试；串行多渠道可能累积12秒超时。publicChannel返回完整config，令牌还明文存channels.json，fence信任边界必须与远程访问配置一起检查，不能因“只在本机”就省略敏感字段范围。

> **建议**：待验证假设：为调用方提供幂等通知ID与持久发送账本，按“已提交/平台接受/确认收到”分层，允许失败渠道重试，可减少任务重试引发的重复提醒。由每渠道results但无持久投递状态推导，当前未实现。用成功后连接断开、部分渠道失败和调用方重放对照，测重复率、漏发与等待时间；不支持回执的平台必须保持unknown，不能伪造已读。

<a id="plugin-1381221232-root"></a>

## [dsh-desktop-uia](../../plugins/1jiegejiayouxuewangan1--dsh-desktop-uia/INSIGHT.md)

[![npm 30d 516](https://img.shields.io/static/v1?label=npm+30d&message=516&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia)

> **用途**：Windows用户希望模型操作普通桌面应用；验收是找对窗口控件、按策略执行并核对操作后状态。

> **亮点**：相对坐标截图操作，UIA树提供控件语义与Invoke/Value/Selection能力；插件的增量是把Windows原生UIA与DSH策略、日志、面板统一。控件可访问性来自Windows/应用，并非插件发明。

> **思考**：“每次写操作审批”须按模式解释。approval.js 的 ask 跟随宿主never政策，这是文档已声明的设计；此外在无approval服务、缺agent、request抛错或无明确回答时，ask也会放行，always则拒绝。属于具体配置边界，不据此断言全插件缺陷；UIA不存在的控件也不能靠语义保证。

> **建议**：适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。

<a id="plugin-1346023250-root"></a>

## [dsh-feishu-bot](../../plugins/452926826--dsh-feishu-bot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-feishu-bot) [![npm 30d 919](https://img.shields.io/static/v1?label=npm+30d&message=919&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu-bot)

> **用途**：需要离开本机仍在飞书发起或接续DSH任务的个人/团队用户，交付是宿主会话最终回复与审批回路。

> **亮点**：相对只转发聊天文本，贡献为扫码建应用、持久化chat上下文和同源chat审批闭环；复用飞书Device Grant和SDK，不把这些上游能力算原创。

> **思考**：远程入口是否保持正确授权与任务上下文？审批绑定发起chat是强支持；同一chat多个待审只能有一个，其他回退next。手工凭据未含扫码owner时默认允许集合可能为空，必须检查实际白名单；状态写队列在一次persist拒绝后未catch，后续then可能继续拒绝，恢复需另验。

> **建议**：远程控制需求明确时在专用profile试用，先固定允许chat、验证拒绝/取消/断连恢复；普通消息具有该DSH profile的实际权限。

<a id="plugin-1418842530-root"></a>

## [dsh-feishu（2048lr）](../../plugins/2048lr--dsh-feishu/INSIGHT.md)

[![npm 30d 75](https://img.shields.io/static/v1?label=npm+30d&message=75&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-feishu) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-feishu)

> **用途**：面向需要把分析写成飞书文档/表格、并由实际操作者取得所有权的团队；成功标准包括内容正确、落在目标身份空间且可供用户访问。

> **亮点**：相对手工导出并上传、通用原始API或应用身份机器人，增量在把个人OAuth身份与创建落点明确连接，auto降级应用身份时返回warnings；领域工具还能组织多维表格图表和聚合。REST/OAuth本身不是原创，贡献是避免“创建成功但人看不到”的流程断裂。

> **思考**：可重试传输是否确保写操作只发生一次？httpRequest对超时/临时状态重试，没有按HTTP方法区分；网络超时后服务端可能已成功创建文档或发送消息，重试可能产生重复副作用。现有结构化身份警告解决落点，不解决未知结果。需端到端验证，不能因存在retry就认定可靠办结。

> **建议**：先在测试租户明确选user身份，创建一份可丢弃文档并确认实际落点和权限，再验证token过期及超时重试；正式写入前要检查重复创建，避免把auto降级警告忽略。

<a id="plugin-1344714819-root"></a>

## [dsh-invoice-tools](../../plugins/988hj7tczd-oss--dsh-invoice-tools/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 437](https://img.shields.io/static/v1?label=npm+30d&message=437&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools)

> **用途**：个人整理含结构化XML或文本层的电子发票，交付字段核对表和报销汇总草稿；不替代真伪查验或财务审批。

> **亮点**：相对手抄票面进表格，增量是XML优先、字段缺失/金额核对与重复票汇总接入DSH，并保留来源置信标记。PDF/XML与OOXML为既有格式，本插件不是税务查验服务；“搜索0结果”不证明生态首创。

> **思考**：解析高置信和xlsx输出是否等于合格报销件？XML存在不证明票真，正则可能取错编号，勾稽只检金额关系；无OCR的扫描件会跳过。xlsx实际保存为.xlsx.b64还需解码，缺session时global缓存可跨调用共享，不能把本地处理概括为严格会话隐私隔离。

> **建议**：待验证假设：每字段保存原文位置/方法及人工确认，汇总只纳入确认字段且缓存缺session时拒绝，可减少错字段和跨会话混入。由置信度只按解析方法与global回退推导，未实现。对照错序文本、同号不同主体、扫描件和缺session，测错汇总/漏票与复核时间；不能用勾稽通过代替原票核对。

<a id="plugin-1335387524-root"></a>

## [dsh-msg-hub](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,207](https://img.shields.io/static/v1?label=npm+30d&message=1%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

> **用途**：离开电脑的操作者从IM发任务、收结果并处理绑定会话的审批；交付物是渠道消息与可关联的Agent结果，必须保留批准人的身份和具体请求归属。

> **亮点**：把不同IM接入、稳定会话和可复用push/task服务合在一个桥，使其他定时插件也能复用消息回传；相较每渠道独立机器人减少会话管理重复。渠道协议与上游vendored代码不算全仓原创；远程审批新增业务控制入口，其正确性不能由消息收发成功推定。

> **思考**：“批准”是否绑定到收到该请求的那个人和那次调用？remote.pending只存resolve/timer，不存session或peer；handleCommand收到任何匹配文本就取pending第一个resolve，没有检查channel/peer/session/callId。多个会话并发或无关peer发yes都可能批准错误请求，五分钟拒绝不能弥补归属缺失。/bind也直接持久化输入sid，未在此路径见所有者验证。

> **建议**：每次审批加入一次性挑战码并绑定request ID、channel、peer、session、操作摘要与到期时间，可能避免串审批。用两个peer两请求交叉答复、过期/重放和未绑定peer答复案例，要求仅匹配请求可一次结算；若平台身份不能可靠绑定，应保留原宿主审批而只做通知。

<a id="plugin-1343622602-root"></a>

## [dsh-plugin-nlbi](../../plugins/1byteone--dsh-plugin-nlbi/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 906](https://img.shields.io/static/v1?label=npm+30d&message=906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)

> **用途**：业务分析人员想把问题转为 MySQL 查询和可重跑报表；合格交付是业务口径正确、权限允许且可复核的SQL结果。

> **亮点**：作者明确继承 dsh-mysql v0.1.4，数据库连接和原有 mysql 工具不算本插件原创；新增贡献是 Text2SQL、AST护栏、BI与报表复用串联，相对裸SQL对话提高可检查性。

> **思考**：最影响贡献成立的是语法安全与指标正确的区别：text2sql.js 校验后直接 pool.query，AST能限制语句和表，却不能验证“活跃用户”时间窗、重复JOIN和统计口径。空allowlist意味着不限制，不能把默认配置理解为最小授权。

> **建议**：适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

<a id="plugin-1364961230-root"></a>

## [dsh-team-cost](../../plugins/1569126506-sudo--dsh-team-cost/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1569126506-sudo/dsh-team-cost)

> **用途**：共用宿主的团队需要把用量归到成员并管预算，验收应对齐账单与身份，不能只看报表有数字。

> **亮点**：src/index.ts监听assistant/message用量，按cwd最长前缀归因，写JSONL及汇总；agent/request可按团队或成员预算拒绝新请求。

> **思考**：把团队汇总接到请求门禁有管理价值；若归属或单价缺失，报表精确显示也会掩盖错误。

> **建议**：先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。

<a id="plugin-1335244607-root"></a>

## [dsh-toolbox-web](../../plugins/abcdefgxw--dsh-toolbox-web/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web) [![npm 30d 1,058](https://img.shields.io/static/v1?label=npm+30d&message=1%2C058&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web) [![最新发布 2026-09-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web)

> **用途**：DSH操作者集中整理大量会话、恢复误删内容或定时唤醒任务；管理结果应可恢复且与宿主持久状态一致。

> **亮点**：把会话整理、可恢复删除与定时任务入口集中到一个Web工具箱；回收站比直接rm多恢复路径，逐帧搜索避免长期保留整份解压文本。业务增量在运维操作的集中化，不是新会话存储引擎；原生索引/fork能力归宿主。

> **思考**：管理操作是否与正在运行的宿主持久化一致？messages列表使用resolveSessionLog最高代，编辑/截断却硬编码session.jsonl.zstd，可能改旧代；backup失败返回null仍继续写原文件，写入非rename且无expected revision/live会话锁。回收站先移动后写meta也有中途失败窗口；UI默认关闭某功能不等于后端授权，RPC方法自身只作参数校验。

> **建议**：将编辑/截断迁到宿主版本化事务接口，先确认目标代和快照摘要、可靠备份成功再写，并让恢复成为同事务操作，可能减少旧代修改和并发丢事件。用v3日志、运行中追加、备份失败和进程中断案例要求不写错代且原事件完整；若宿主无事务接口，应限制为离线导出编辑而非在线覆盖。

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)

> **用途**：已有khal日历的用户希望在会话内查询近期安排，交付应与本地日历一致，不误以为已创建事件。

> **亮点**：lib/cal.js查找khal，分别调用printcalendars和list，限制未来天数、超时与输出长度；Host注册状态、日历与日程工具。

> **思考**：把已有日历读取接入会话有便利，安装它不能自动把企业日历同步进来。

> **建议**：适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。

<a id="plugin-1391142149-root"></a>

## [dsh-wsl-wininput](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput)

> **用途**：需要操作Windows表单/按钮的WSL Agent，以目标应用实际状态变化为交付；不接受单纯API成功作为任务完成。

> **亮点**：相对重用上次树的元素index，按名称重查并拒绝0/多匹配能消除位置漂移的一类误操作。该具体增量有源码支持；不是稳定对象句柄协议，也不意味着输入隔离。

> **思考**：作者简介声称不抢焦点，实际type/key明确SetForegroundWindow+SendWait，click移动系统光标，且不校验前台切换是否成功；这直接限制“后台定向输入”。invoke遍历受限时也只能证明已访问范围唯一。

> **建议**：适合有人看护的Windows自动化；优先具备唯一名称的invoke，打字/点击会干扰焦点和鼠标，执行前暂停其他桌面操作并检查结果。

<a id="plugin-1335286261-root"></a>

## [Markdown 批注器](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

> **用途**：审阅AI生成Markdown的作者，按段落或选区给修改要求；交付带引用的批注报告与保存后的源码，发送前由人确认。

> **亮点**：相对复制段落到聊天，贡献在于把批注位置、类型和原文绑定，并整理为当前文件所属会话草稿；多视图共用文档避免各自编辑。主工作台与文件路由归Better Sidebar，批注重锚定和报告是本组件增量。

> **思考**：核心问题是重生成后引用是否仍指向正确原文。重复段落、结构变化和非完整Markdown子集会削弱锚定；插件不持久化批注，刷新/重启可能丢审阅劳动。报告进入草稿也不等于修改已执行或被验收。

> **建议**：适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。

## 更新时间

2026-10-22
