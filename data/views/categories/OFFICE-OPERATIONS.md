# 办公与运营

[返回首页](../../../README.md)

工作记录、日程、团队用量与日常运营。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [AI 残渣清运](#plugin-1406611614-root) | 按规则把会话副产物移入可还原回收站，并提供项目结项归类、归档与清理清单。 | 先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。 |
| [chicheng-cron](#plugin-1335807482-root) | 在 DSH Web 配置 cron 定时脚本、Skill 与 Agent 任务，查看历史并发送完成通知。 | 适合可重复、可撤销的个人定时任务；先用不改文件的任务检查时间、工作目录、超时、输出与通知，再尝试写操作，关键任务另配完成检查。 |
| [chicheng-push](#plugin-1335382133-root) | 在 DSH 配置多种推送渠道，并通过进程内服务或 HTTP 接口发送通知。 | 有多个任务插件要发通知时可先接一个非敏感测试渠道；检查每渠道结果、令牌文件权限和远程接口范围，再发正式任务摘要，避免把秘密内容直接推到群里。 |
| [dock-spreadsheet](#plugin-1400109121-root) | 在Dock只读预览工作簿及UTF-8分隔文本，保持表格坐标。 | 用于小表快速阅读；需编辑、计算或完整报表时另用表格软件。 |
| [dsh-awiki](#plugin-1334428397-root) | 把AWiki身份、设备加入/恢复、消息和邮件接入DSH，区分Host管理与模型可用操作。 | 适合已有AWiki体系者在测试身份验证设备撤销与发送审批。 |
| [dsh-crypto-portfolio](#plugin-1342742812-root) | 以 DSH 插件启动 Python 资产看板，汇集链上钱包和交易所账户数据。 | 先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。 |
| [dsh-cua-pre](#plugin-1346533795-root) | 以Windows无障碍树优先的工具、Python worker和可视面板，为DSH提供桌面观察与操作。 | 先在可丢弃窗口、明确PID范围验证观察/动作/停止；高影响任务保留人工确认和结果核对，不能将提示纪律当已实现审批。 |
| [dsh-desktop-uia](#plugin-1381221232-root) | 通过 Windows UI Automation 为 DSH 提供桌面控件读取、操作与审计面板。 | 适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。 |
| [dsh-device-bridge](#plugin-1384810806-root) | 把实现Companion协议的手机或设备接入DSH，提供设备列表、健康查询和动作调用。 | 先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。 |
| [dsh-feishu-bot](#plugin-1346023250-root) | 通过飞书应用机器人长连接操作 DSH 项目与会话，支持扫码绑定、审批与完成通知。 | 远程控制需求明确时在专用profile试用，先固定允许chat、验证拒绝/取消/断连恢复；普通消息具有该DSH profile的实际权限。 |
| [dsh-feishu（2048lr）](#plugin-1418842530-root) | 为 DSH 提供飞书与 Lark 文档、表格、多维表格、消息和授权工具及操作面板。 | 先在测试租户明确选user身份，创建一份可丢弃文档并确认实际落点和权限，再验证token过期及超时重试；正式写入前要检查重复创建，避免把auto降级警告忽略。 |
| [dsh-invoice-tools](#plugin-1344714819-root) | 在本地解析电子发票字段，核对金额并汇总生成报销单资料。 | 先用脱敏且有XML/文本层的发票做汇总草稿；逐张核票号、买卖方与金额，确认缓存会话和.xlsx.b64解码后再交财务。 |
| [dsh-mac-companion](#plugin-1384810483-root) | 从DSH经HTTP调用Mac端Companion，支持通知、快捷指令和剪贴板读写。 | 先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。 |
| [dsh-msg-hub](#plugin-1335387524-root) | 把微信、QQ、飞书消息接到 DSH 会话，并提供主动推送与远程审批。 | 可先作为渠道桥源码候选；当前远程批准归属不足，不建议让它承担真实高影响工具的批准。 |
| [dsh-plugin-finance-data](#plugin-1336663504-root) | 对调用者提供的财务数字执行格式化、收益、比率、风险和组合计算。 | 当前仅作源码和计算接口参考。 |
| [dsh-plugin-nlbi](#plugin-1343622602-root) | 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。 | 适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。 |
| [dsh-team-cost](#plugin-1364961230-root) | 按工作区归属成员统计模型用量，提供团队报表、预算告警和可选请求拦截。 | 先只监测不拦截，对照实际账单和子代理用量，补全模型价格并检查相似工作区前缀；金额可信后再考虑预算阻断。 |
| [dsh-toolbox-web](#plugin-1335244607-root) | 在 Web 管理会话、回收站、搜索与配置，并提供后台定时心跳。 | 可按只读搜索和会话整理需求分功能评估；在线编辑/截断原会话需要先解决代际与并发一致性，不能仅因带回收站就视为全程可逆。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 通过本地khal读取日历列表、今日日程和未来指定天数的安排。 | 适合已配置khal的人，先核对本地日期、时区与日历数量；空输出先确认同步与过滤，不直接判断没有安排。 |
| [dsh-wsl-mail](#plugin-1381860693-root) | 通过notmuch或himalaya读取邮件列表、未读统计与搜索结果。 | 先核对返回backend和note；使用himalaya时把结果理解为最近收件箱列表。 |
| [dsh-wsl-rclone](#plugin-1381859181-root) | 通过rclone列出远程存储配置、文件名及配额信息。 | 适合已配rclone的只读盘点，先限定allowedRemotes和目录规模；需要传输、删除或完整清单验收时另选流程。 |
| [dsh-wsl-uia](#plugin-1391141792-root) | 从 WSL 枚举 Windows 窗口并读取有深度限制的 UI Automation 元素树。 | 适合有可访问性控件的 Windows 应用观察；先以少量元素验证名称和覆盖，找不到不能直接判控件不存在，动作前重新定位。 |
| [dsh-wsl-winctl](#plugin-1391143632-root) | 从 WSL 枚举 Windows 顶层窗口并调整窗口状态、位置和大小。 | 适合整理明确单窗口的桌面；先枚举并核对目标，多窗口和关闭操作保留人工确认，返回ok后重新读取实际状态。 |
| [dsh-wsl-wininput](#plugin-1391142149-root) | 从 WSL 按名称调用 Windows 控件，或向指定窗口发送文本、按键与点击。 | 适合有人看护的Windows自动化；优先具备唯一名称的invoke，打字/点击会干扰焦点和鼠标，执行前暂停其他桌面操作并检查结果。 |
| [dsh-wsl-winshot](#plugin-1391140767-root) | 把指定 Windows 窗口或控件区域截图保存为 WSL 文件。 | 适合前台可见窗口的图片观察；先把窗口完整露出并核对PNG，避免用它收集被遮挡窗口的权威证据，截图会还原最小化窗口。 |
| [feishu-dsh-plugin（2286893544）](#plugin-1364766828-root) | 通过企业自建飞书应用为 DSH 提供消息、云文档、多维表格、表格与权限操作工具。 | 已有自建机器人且权限清楚的团队可在测试群和可丢弃文档先试；确认创建后目标人可打开再扩展。 |
| [Forge 工作报告](#plugin-1363429979-plugin-daily-log) | 汇集 Git 提交和本地智能体对话，按模板生成并保存日报、周报或月报。 | 先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。 |
| [Markdown 批注器](#plugin-1335286261-root) | 在 Better Sidebar 中预览和编辑 Markdown，把批注整理为会话草稿。 | 适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。 |
| [峰谷价任务执行器](#plugin-1417227361-root) | 根据配置的峰谷时段排队执行模型任务，提供队列查询与取消。 | 适合无硬期限的文本批任务做模拟日程与测试额度验证；修正峰前窗口和路由绑定之前，不依赖其保证避峰节费。 |

<a id="plugin-1406611614-root"></a>

## [AI 残渣清运](../../plugins/1344738825--ai-residue-cleaner/INSIGHT.md)



> **用途**：AI生成的探测、草稿和缓存污染工作区，用户需要减少整理负担并能恢复误收文件。

> **亮点**：Host在turn/end后台派生Python清运；cleanup.py按规则移动文件并写manifest，项目open时跳过自动清理，结项时分类与归档。

> **思考**：可逆移动及清单降低首次误收损失；规则覆盖面广且会过期真删，不应替代项目引用和保留策略。

> **建议**：先在完整副本执行dry-run，核对日志和backup类文件是否仍需保留，再启用自动清理并设置合适保留期。

<a id="plugin-1335807482-root"></a>

## [chicheng-cron](../../plugins/534119219--chicheng-cron/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)

> **用途**：需要周期性本机脚本或Agent任务的人，在GUI配置时间、cwd、超时与通知，交付任务输出和运行记录；适用于允许错过时点且宿主持久在线的自动化。

> **亮点**：相对系统cron加独立日志脚本，增量是把DSH Skill/Agent与普通脚本放进一个有历史、输出查看和通知的界面，并整理headless会话。cron语法、进程执行与推送服务为既有机制；贡献是统一任务生命周期和DSH交接，而非新调度算法。

> **思考**：进程退出0能否代表Agent任务成功？executeRun以退出码和timeout状态结算并触发成功归档，缺少业务产物断言；attach/archive通过开始时间定位会话的路径还需并发验证。超时直接child.kill不能证明整棵后代进程停止，且Web停机错过时点不补跑，关键任务不能只靠绿色历史。

> **建议**：待验证假设：每次调度生成显式runId并贯穿headless会话、产物与通知，增加任务定义中的输出断言，可减少误归档和“exit0但未交付”。由当前runId记录与基于时间找会话之间的缺口推导。对照并发两次同类Agent、exit0不写产物、超时生成子进程三类任务，验证归属准确率、漏交付率与残留；需要用户定义合格产物，不能自动猜验收。

<a id="plugin-1335382133-root"></a>

## [chicheng-push](../../plugins/534119219--chicheng-push/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-push)

> **用途**：其他DSH插件或脚本在任务结束时向个人设备/群组发送标题与内容，交付每渠道发送结果，用户仍需确认消息被接收与处理。

> **亮点**：相对每个定时任务内各写Webhook脚本，贡献是集中管理DSH通知配置，用进程内服务和HTTP复用同一发送入口与每渠道错误结果。渠道实现明确参考qinglong notify，不能把成熟渠道协议算作原创；插件增量是DSH配置、服务与调用者接线。

> **思考**：返回ok是否等于用户可靠收到？sender多以HTTP和渠道业务码判断接受，并无统一送达回执或持久重试；串行多渠道可能累积12秒超时。publicChannel返回完整config，令牌还明文存channels.json，fence信任边界必须与远程访问配置一起检查，不能因“只在本机”就省略敏感字段范围。

> **建议**：待验证假设：为调用方提供幂等通知ID与持久发送账本，按“已提交/平台接受/确认收到”分层，允许失败渠道重试，可减少任务重试引发的重复提醒。由每渠道results但无持久投递状态推导，当前未实现。用成功后连接断开、部分渠道失败和调用方重放对照，测重复率、漏发与等待时间；不支持回执的平台必须保持unknown，不能伪造已读。

<a id="plugin-1400109121-root"></a>

## [dock-spreadsheet](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)

> **用途**：快速查看模型产出或工作区表格，不承担编辑和公式重新计算。

> **亮点**：首行保留为数据而非猜标题、范围偏移保留为真实行列坐标，避免常见预览歧义；解析和虚拟表格来自上游。

> **思考**：行列上限在工作簿解析之后才应用，20MiB压缩文件不代表展开内存有界；公式显示依赖缓存/格式化值，不能用预览判断计算正确。只读不意味着文件内容可当可靠业务报表。

> **建议**：未验证假设：解析隔离到worker并提供取消/复杂度预算和公式缓存提示，可使大表失败可控。比较高压缩XLSX、大范围和陈旧公式缓存样例的峰值内存、可取消性及误判。

<a id="plugin-1334428397-root"></a>

## [dsh-awiki](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,584](https://img.shields.io/static/v1?label=npm+30d&message=1%2C584&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

> **用途**：Agent需以稳定身份参与通信，设备丢失/切换仍可明确账户和消息归属；必须将发送和身份控制区分。

> **亮点**：增量是身份/设备/恢复和DSH Agent生命周期的边界整合，不只是消息转发。DID密钥与文档归独立ANP Identity，协议与数据库/恢复实现大量来自IM Core。

> **思考**：界面确认是否覆盖所有身份与外部写入？工具层ask是可读证据，但真实宿主策略与Core的租约、设备撤销/恢复一致性未验证；大量本地状态和网络边界不能凭测试目录认定端到端成功。

> **建议**：由Host lease与可见操作分离推导，可为恢复/发送提供跨层收据，绑定身份代次、设备和请求结果，遇未知结果只核查不重放。未验证；丢响应、撤设备、切身份时应不会由旧会话继续签发或重复发送。

<a id="plugin-1342742812-root"></a>

## [dsh-crypto-portfolio](../../plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)

> **用途**：同时管理多个钱包与交易所账户的人需要统一查看持仓，而非在多个页面手工汇总。

> **亮点**：Node 入口初始化配置模板并启动 run.py 子进程，默认绑定回环地址，卸载时发送 SIGTERM。

> **思考**：多来源汇总有明确便利，但看板属于数据呈现，不能提供资产真实性或收益保证。

> **建议**：先使用公开钱包和无资金操作权限的测试账户，对照账户原始持仓再考虑正式使用。

<a id="plugin-1346533795-root"></a>

## [dsh-cua-pre](../../plugins/aik358--dsh-cua-pre/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-cua-pre) [![npm 30d 381](https://img.shields.io/static/v1?label=npm+30d&message=381&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-cua-pre) [![最新发布 2026-09-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-cua-pre)

> **用途**：Windows桌面任务需先观察、定位后动作，并区分未执行与可能已执行，尤其不能重复发送/支付等副作用。

> **亮点**：将观察失效、目标校验、未知动作结果和持久停止纳入同一工具协议，比裸pyautogui坐标脚本更可治理；UIA/SendInput及视觉模型本身来自系统与上游。

> **思考**：安全语义是否等于实际动作保证？RuntimeId不支持时会降级，矩形容差也不能保证同语义控件；timeout只是等待结果结束，noop不能撤销已发原生动作。付款/删除/外发确认主要是GUIDANCE措辞，不是通用Host硬审批。

> **建议**：由epoch和观察状态推导，可对高影响动作增加Host授权令牌和动作后可核查收据，未知结果冻结同业务动作直到人工或只读对账。未验证；注入worker迟响应/崩溃与UI漂移时应不重放、不误点，确认不可仅靠模型守提示。

<a id="plugin-1381221232-root"></a>

## [dsh-desktop-uia](../../plugins/1jiegejiayouxuewangan1--dsh-desktop-uia/INSIGHT.md)

[![npm 30d 516](https://img.shields.io/static/v1?label=npm+30d&message=516&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia)

> **用途**：Windows用户希望模型操作普通桌面应用；验收是找对窗口控件、按策略执行并核对操作后状态。

> **亮点**：相对坐标截图操作，UIA树提供控件语义与Invoke/Value/Selection能力；插件的增量是把Windows原生UIA与DSH策略、日志、面板统一。控件可访问性来自Windows/应用，并非插件发明。

> **思考**：“每次写操作审批”须按模式解释。approval.js 的 ask 跟随宿主never政策，这是文档已声明的设计；此外在无approval服务、缺agent、request抛错或无明确回答时，ask也会放行，always则拒绝。属于具体配置边界，不据此断言全插件缺陷；UIA不存在的控件也不能靠语义保证。

> **建议**：适合控件可访问性良好的Windows应用；先对照审批模式检查实际放行条件，在无敏感数据的应用里验证动作和后置状态。

<a id="plugin-1384810806-root"></a>

## [dsh-device-bridge](../../plugins/173787247--dsh-device-bridge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-device-bridge)

> **用途**：用户希望从会话触发已知设备动作，合格交付是正确设备实际完成动作并能报告失败。

> **亮点**：index.js注册三个工具，按配置选择设备和允许动作，再委托dsh-wsl-common的Companion客户端发送HTTP请求。

> **思考**：统一轻量协议能降低多设备接入重复工作；动作名白名单并不证明动作本身无副作用。

> **建议**：先只开放ping/status等无副作用动作，在隔离网络核对设备身份；固定共享依赖与设备端实现后再启用实际控制。

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

<a id="plugin-1384810483-root"></a>

## [dsh-mac-companion](../../plugins/173787247--dsh-mac-companion/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion)

> **用途**：主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。

> **亮点**：index.js注册Mac专用工具，将通知、shortcut和剪贴板动作交给共享Companion客户端；Mac侧Python服务调用系统能力。

> **思考**：为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。

> **建议**：先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。

<a id="plugin-1335387524-root"></a>

## [dsh-msg-hub](../../plugins/abcdefgxw--dsh-msg-hub/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-msg-hub) [![npm 30d 1,207](https://img.shields.io/static/v1?label=npm+30d&message=1%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-msg-hub) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-msg-hub)

> **用途**：离开电脑的操作者从IM发任务、收结果并处理绑定会话的审批；交付物是渠道消息与可关联的Agent结果，必须保留批准人的身份和具体请求归属。

> **亮点**：把不同IM接入、稳定会话和可复用push/task服务合在一个桥，使其他定时插件也能复用消息回传；相较每渠道独立机器人减少会话管理重复。渠道协议与上游vendored代码不算全仓原创；远程审批新增业务控制入口，其正确性不能由消息收发成功推定。

> **思考**：“批准”是否绑定到收到该请求的那个人和那次调用？remote.pending只存resolve/timer，不存session或peer；handleCommand收到任何匹配文本就取pending第一个resolve，没有检查channel/peer/session/callId。多个会话并发或无关peer发yes都可能批准错误请求，五分钟拒绝不能弥补归属缺失。/bind也直接持久化输入sid，未在此路径见所有者验证。

> **建议**：每次审批加入一次性挑战码并绑定request ID、channel、peer、session、操作摘要与到期时间，可能避免串审批。用两个peer两请求交叉答复、过期/重放和未绑定peer答复案例，要求仅匹配请求可一次结算；若平台身份不能可靠绑定，应保留原宿主审批而只做通知。

<a id="plugin-1336663504-root"></a>

## [dsh-plugin-finance-data](../../plugins/863683348--dsh-plugin-finance-data/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data) [![npm 30d 1,049](https://img.shields.io/static/v1?label=npm+30d&message=1%2C049&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-finance-data) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-finance-data)

> **用途**：适合需要可检查的财务算术草稿，不提供行情抓取、实际交易或投资判断。

> **亮点**：作者希望把财务算术从模型自由生成中分离；实际增量是提供确定函数与结构返回，便于检查输入输出。相比让模型心算，方向合理；但当前工具壳与计算函数单位契约和长期投影存在明确源码问题，不能承诺算术正确。

> **思考**：computeRatio的roe/roa/利润率已乘100，index再以percent=true调用formatNumber乘100；例如10/100应表达10%，这条路径会显示1000%。projectPlan默认steps=12并令total=min(periods,steps)，years>1的月度计划仍只累计12期却标完整年数；index未暴露steps覆盖。portfolio targets/values声明additionalProperties:false却无已声明资产键，也需宿主schema验收。

> **建议**：待验证假设：把量纲、小数/百分数和投影期数写进可校验类型契约，可比增加更多指标更有效地减少财务工具错误。用10/100比率和五年月度零收益定投等可手算样本，先验证各层单位及60期累计一致，再评估实际数据任务。

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

<a id="plugin-1381860693-root"></a>

## [dsh-wsl-mail](../../plugins/173787247--dsh-wsl-mail/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-mail)

> **用途**：Agent需要查看本地邮件索引或收件箱摘要，减少手工搬运主题与发件人。

> **亮点**：把两个邮件CLI整合到DSH的只读接口，降低检索入口切换；不提供发送或完整邮件工作流。

> **思考**：himalaya回退没有未读过滤，count来自最近收件箱样本；不能把mail_unread工具名当作未读总数语义。

> **建议**：本次未形成新的创新假设；优先显式区分未读总量与最近邮件样本，避免错误摘要影响优先级。

<a id="plugin-1381859181-root"></a>

## [dsh-wsl-rclone](../../plugins/173787247--dsh-wsl-rclone/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-rclone)

> **用途**：已配置云存储的用户让Agent确认文件位置或空间，避免给出任意同步命令。

> **亮点**：以有限命令集合复用rclone多后端能力，缩小误触复制删除的工具面；存储协议与账户能力属于上游。

> **思考**：maxEntries是在命令完成后裁剪，不限制远程扫描工作量；about不一定受后端支持，读取文件名也会出网且可能暴露业务结构，不能把只读等同无成本或全域隔离。

> **建议**：待验证假设：将服务端遍历预算和结果条数分别限制，可降低大目录超时与费用；依赖各后端列举能力，尚未实现。

<a id="plugin-1391141792-root"></a>

## [dsh-wsl-uia](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-uia)

> **用途**：需要理解 Windows 应用控件而非只看像素的 WSL Agent，交付窗口、控件名称、类型、可用 pattern 和路径，供人工或输入工具决策。

> **亮点**：相对截图 OCR，源码可见增量是提供语义控件属性和命名路径，同时把观察与输入分成插件；UIAutomation 遍历来自 Windows 平台，epoch 只是观察标签，不是稳定控件身份。

> **思考**：关键质疑是有界观察是否真的限制工作量。treeScript 用输出条数限制循环，过滤不命中的节点仍可继续遍历，maxElements 不是访问节点上限；truncated 根据输出数推断。稀疏匹配树仍可能耗时，UIA 覆盖还取决于应用可访问性。

> **建议**：适合有可访问性控件的 Windows 应用观察；先以少量元素验证名称和覆盖，找不到不能直接判控件不存在，动作前重新定位。

<a id="plugin-1391143632-root"></a>

## [dsh-wsl-winctl](../../plugins/173787247--dsh-wsl-winctl/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winctl)

> **用途**：WSL 内 Agent 需要先整理 Windows 应用窗口再观察/输入；交付是指定窗口的状态与布局，不是应用任务完成。

> **亮点**：相对人工拖动和临时 PowerShell，贡献是统一窗口选择、完整移动参数和状态回读；窗口管理能力来自 user32/UIA，不是新的桌面控制算法。

> **思考**：关键质疑是动作是否确实作用于唯一目标并得到验证。Dsh-Find 返回首个匹配，未拒绝多窗口歧义；原生调用返回值被忽略，activate仅ShowWindow而不调用SetForegroundWindow，报告ok不等于获得焦点。

> **建议**：适合整理明确单窗口的桌面；先枚举并核对目标，多窗口和关闭操作保留人工确认，返回ok后重新读取实际状态。

<a id="plugin-1391142149-root"></a>

## [dsh-wsl-wininput](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput)

> **用途**：需要操作Windows表单/按钮的WSL Agent，以目标应用实际状态变化为交付；不接受单纯API成功作为任务完成。

> **亮点**：相对重用上次树的元素index，按名称重查并拒绝0/多匹配能消除位置漂移的一类误操作。该具体增量有源码支持；不是稳定对象句柄协议，也不意味着输入隔离。

> **思考**：作者简介声称不抢焦点，实际type/key明确SetForegroundWindow+SendWait，click移动系统光标，且不校验前台切换是否成功；这直接限制“后台定向输入”。invoke遍历受限时也只能证明已访问范围唯一。

> **建议**：适合有人看护的Windows自动化；优先具备唯一名称的invoke，打字/点击会干扰焦点和鼠标，执行前暂停其他桌面操作并检查结果。

<a id="plugin-1391140767-root"></a>

## [dsh-wsl-winshot](../../plugins/173787247--dsh-wsl-winshot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-winshot)

> **用途**：WSL Agent需要查看图像形式的Windows应用状态，以可读取PNG作为交付，再交由模型/人工分析。

> **亮点**：相对手动截图再传文件，贡献是窗口选择、裁剪与跨系统文件交接；图像来自桌面屏幕区域采样，并非独立窗口渲染，截图算法属System.Drawing。

> **思考**：最重要的限制是被遮挡窗口是否仍能正确截图。CopyFromScreen只读取屏幕像素，不保证目标窗口内容；还原最小化窗口也改变桌面。按名裁剪取第一个匹配而非拒绝歧义，因此PNG存在不等于正确目标。

> **建议**：适合前台可见窗口的图片观察；先把窗口完整露出并核对PNG，避免用它收集被遮挡窗口的权威证据，截图会还原最小化窗口。

<a id="plugin-1364766828-root"></a>

## [feishu-dsh-plugin（2286893544）](../../plugins/2286893544--feishu-dsh-plugin/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin)

> **用途**：面向用自建机器人管理文档和群消息的团队，合格交付需内容写入、目标人员可见，图表标签与原数据一致。

> **亮点**：相对通用HTTP工具加人工分享，本项把常用飞书任务及创建后授权联结，并以零外部依赖PNG生成补上图表插入。核心是应用机器人工作流的便利，而不是新的认证协议或原生图表引擎；“纯Node”避免Python部署但不自动证明端到端低成本。

> **思考**：创建成功是否意味着操作者拥有可用结果？autoGrantOwner失败返回auto-grant failed文本，仍保留创建成果，且grantOpenId可为空。它避免授权失败丢失文档，却把可访问性复核交给模型/用户；应用身份共享权限也不等同于个人原生所有权。群权限和文档归属是采用前必须实际核对的边界。

> **建议**：已有自建机器人且权限清楚的团队可在测试群和可丢弃文档先试；确认创建后目标人可打开再扩展。中文图表先用外部可核对图片，不直接依赖当前ASCII字库输出。

<a id="plugin-1363429979-plugin-daily-log"></a>

## [Forge 工作报告](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,976](https://img.shields.io/static/v1?label=npm+30d&message=1%2C976&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

> **用途**：面向需要定期汇报工作的个人或团队，从实际活动记录生成报告，并支持回查来源。

> **亮点**：入口按 agent 作用域启用报告工具，/report 转发用户需求，扫描索引和模板为后续生成提供材料。

> **思考**：按需启用工具可减少常驻上下文；提交与对话是活动证据，不自动证明业务成果。

> **建议**：先只接一个仓库和一种会话来源，对照手写周报检查作者过滤、遗漏与错误归功。

<a id="plugin-1335286261-root"></a>

## [Markdown 批注器](../../plugins/3361805598-gif--dsh-md-annotator/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-md-annotator)

> **用途**：审阅AI生成Markdown的作者，按段落或选区给修改要求；交付带引用的批注报告与保存后的源码，发送前由人确认。

> **亮点**：相对复制段落到聊天，贡献在于把批注位置、类型和原文绑定，并整理为当前文件所属会话草稿；多视图共用文档避免各自编辑。主工作台与文件路由归Better Sidebar，批注重锚定和报告是本组件增量。

> **思考**：核心问题是重生成后引用是否仍指向正确原文。重复段落、结构变化和非完整Markdown子集会削弱锚定；插件不持久化批注，刷新/重启可能丢审阅劳动。报告进入草稿也不等于修改已执行或被验收。

> **建议**：适合短期人工审阅中等大小Markdown；接受批注不持久化且能按次导出时再试用，不用于未经保存的跨日批注存档。

<a id="plugin-1417227361-root"></a>

## [峰谷价任务执行器](../../plugins/439436269-ctrl--dsh-peak-runner/INSIGHT.md)

[![npm 30d 24](https://img.shields.io/static/v1?label=npm+30d&message=24&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-peak-runner) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-peak-runner)

> **用途**：可等待的摘要/翻译批任务，用户接受推迟执行换取预期低价；合格交付是指定模型完成的文本和可靠任务状态，而非仅到时触发。

> **亮点**：相对用户手动等低价，贡献是价格日程与可查队列、取消、模型调用的组合。存储和LLM流来自宿主；插件按时间表改变执行时机，并未读取实时账单确认价格。

> **思考**：最影响节费主张的是日程是否真正约束所用模型和任务启动。scheduler.shouldRunNow在“当前非峰段”直接run=true，未检查即将进入峰段，因此README承诺的峰前leadMinutes不成立；runner指定模型失败会发现任意可用模型，其价格不一定对应同日程。

> **建议**：适合无硬期限的文本批任务做模拟日程与测试额度验证；修正峰前窗口和路由绑定之前，不依赖其保证避峰节费。

## 更新时间

2026-10-21
