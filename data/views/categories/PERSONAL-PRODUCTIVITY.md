# 个人效率

[返回首页](../../../README.md)

输入、会话、快捷操作与个人工作体验。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@awiki/dsh-plugin](#plugin-1334428397-root) | 将AWiki身份、私信群聊与邮件接入DSH，提供Web界面和十个通信工具，支持用户摘要及可选白名单来信到Agent。 | 有条件试用，已有AWiki需求者先固定依赖与身份/发送审批，listener保持关闭直到独立评估效果重试。 |
| [air-pixel-liquid-glass](#plugin-1414238544-root) | 为DSH提供可配置半透明玻璃主题、壁纸、光标和点击效果，并可选适配桌面窗口透明。 | 先试CSS主题并保留足够消息对比度。 |
| [Amoji for dsh](#plugin-1378933589-adapters-dsh) | 在人与模型之间传递带固定文字语义的表情，并管理版本、表情包和市场发布。 | 想用图像表达协作意图且能固定DSH版本的人，可先在隔离profile试基础表情；按release说明装成品包，逐条核对原生消息与图片状态，遇到未知结果查原请求，不重复发送。 |
| [anan-thermal-monitor](#plugin-1335381015-root) | Windows WPF 温度桌宠，利用 PowerShell 与随包 LibreHardwareMonitor 采集传感器，DSH Host 负责启动/停止。 | 在隔离 VM 核包内容、二进制来源和 UAC；测试传感器缺失、启动误报、停止/卸载及任务计划残留。 |
| [chicheng-cron](#plugin-1335807482-root) | 在DSH Web侧栏管理cron任务，定时执行脚本、Skill或Agent，保存输出并提供推送、会话分组和归档选项。 | 先观察。 |
| [chicheng-peak](#plugin-1336366824-root) | 按配置峰谷时窗显示页面/输入框光效与角标，并由Host提前调度模板提醒到可选消息渠道。 | 先观察，先核真实适用规则、统一转折/投递收据/热重载，提醒仅辅助不直接作省钱依据。 |
| [chicheng-quickinput（vault）](#plugin-1337038478-root) | 在 DSH 输入区管理常用信息与私密记录，支持自动识别建议和 WebDAV 备份。 | 先只存非敏感常用片段；在建议明文写盘问题修正并验证前，关闭自动识别且不要把它当安全凭据库。 |
| [deepseek-harness-hello-kitty-suite](#plugin-1343679449-root) | 为DSH提供粉色Hello Kitty皮肤资源，并在轮次结束时显示卡片、声音或系统提醒。 | 偏好主题时先查素材授权并验证对比度；提醒只作回看提示，不当作成功或当前会话等待你的保证。 |
| [dock-images](#plugin-1340492378-root) | 通过受限文件读取在Dock缩放、旋转和拖动图片。 | 用于普通小图片预览；大图先核资源占用，别把视图旋转当文件编辑。 |
| [DPH 任务看板](#plugin-1336994666-root) | 把真实会话归入任务状态列，并保存备注和可供智能体读取的看板快照。 | 用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。 |
| [dsh-alive](#plugin-1335661970-root) | 在会话头部显示本地 DSH 插件端点的 15 秒轮询可达状态。 | 仅以“本地 DSH Web 端点可达”解释，并在固定版本上做故障矩阵。 |
| [dsh-api-balance](#plugin-1334899834-root) | 在 DSH Web 输入框旁轮询显示 DeepSeek API 余额与可用状态。 | 先在隔离环境核凭证执行与路由权限，使用低频或手动刷新，再评估真实账户接入。 |
| [dsh-archived-conversations](#plugin-1335060115-root) | 在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。 | 本地HTTP单用户只读辨认可试用。 |
| [dsh-at-skill](#plugin-1346023186-root) | 为 DSH 增加 @name 技能候选和发送前确定性技能加载。 | Skill命名清晰的用户可评估；与插件或子代理重名时谨慎使用，发送前确认文本，加载不代表任务执行验收。 |
| [dsh-auto-shutdown](#plugin-1425073734-root) | 在Windows设置中启用一次性触发，在根会话轮次结束后安排关机并提供取消倒计时。 | 先用作者提供的dryrun路径在临时环境检查事件和复位，不直接在有未保存任务的主机启用。 |
| [dsh-balance-chip](#plugin-1347136944-root) | 从凭据服务查询DeepSeek余额并显示页脚状态。 | 先修核轮询释放、货币与外层授权；不能作为预算闸门。 |
| [dsh-boo550wt-animation](#plugin-1422328385-root) | 在 DSH 启动时覆盖播放视频，提供跳过、淡出和同源媒体读取。 | 只想个性化启动画面的人可在可恢复profile试用；先验证Esc和坏视频退出，尤其检查超长或无效时长素材，别把maxSeconds当已验证硬限。 |
| [dsh-butler-memory](#plugin-1335928912-root) | 历史 DSH Bundle：接 Butler Memory MCP agent 工具及 Web 用户记忆审阅面板，作者已停止维护。 | 只作为历史参考；存量实例先隔离验权限、修订、崩溃/超时恢复和当前 DSH 契约。 |
| [dsh-calendar](#plugin-1376880747-root) | 在 DSH 右侧栏读 Obsidian 日记与待办，并受控写回 Markdown。 | 已有Markdown任务日记者可评估；先备份并核外部编辑冲突策略，别把可选expect当强制版本事务。 |
| [dsh-callout](#plugin-1359145352-root) | 将助手 Markdown 的 GitHub 风格提示标记呈现为语义卡片。 | 希望技术回答更易扫描者可作为展示插件候选；不能将是否出现警告卡片作为执行高影响操作的批准依据。 |
| [dsh-chat-width](#plugin-1339332869-root) | 为旧版 DSH web 扩大聊天内容列并提供拖拽调宽，检测到新版原生把手时让位。 | 当前组件推荐观察。 |
| [dsh-chatgpt-style](#plugin-1421963463-root) | 调整DSH聊天排版与语义标注，并在发送框旁提供思考或快速档位切换。 | 先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。 |
| [dsh-clean-desktop-shell-pro](#plugin-1389469406-root) | 以Electron封装DSH网页，并增强本地后端自动启动、托盘退出选择与故障恢复。 | 适合偏好桌面入口者在单独profile验证启动与退出；先移除冲突原版，确认仅退出不会误停共享后端。 |
| [dsh-client-ui-aqua-patched](#plugin-1378742722-root) | 为特定DSH版本修补Aqua玻璃主题的加载与设置入口兼容。 | 只在匹配版本先核设置开关与卸载恢复；别用同名npm上游包替代该fork。 |
| [dsh-commandcode-usage-inline](#plugin-1358821276-root) | 在 DSH 输入栏内联展示 Command Code 账户窗口用量和剩余 credits。 | 已用对应Command Code provider的用户可评估；多账户轮换时核对active标记，勿据首账户默认值作预算决定。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 有条件试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。 |
| [dsh-computer-use](#plugin-1335236592-root) | 为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 | 先观察，仅研究者可丢弃无秘密环境评估，先修元素TTL/会话/图像变换与效果状态，不直接启日常桌面全权。 |
| [dsh-custom-plugin](#plugin-1342948215-root) | 组合外观、项目文件夹、提示库、会话导出、搜索与用量观察。 | 按实际需要启用，先核备份恢复、密钥存储来源与导出内容；用量/余额提示不替代账单。 |
| [dsh-cyber-particle](#plugin-1334274281-root) | DSH Web Canvas 粒子网络背景，提供设置页与本地持久化。 | 作为个人装饰观察；减动效用户和低性能设备建议先关闭或等修复/性能验证。 |
| [dsh-dictation-hotkey](#plugin-1414017637-root) | 为DSH网页输入框提供按住或切换式语音热键，复用宿主转写并可选择填入或发送。 | 建议先关闭自动发送，用慢转写和会话切换样例验证落点。 |
| [dsh-discord-richpresence](#plugin-1342915339-root) | 把 DSH 的粗粒度活动或可选丰富状态同步到本地 Discord Rich Presence。 | 先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。 |
| [dsh-douyin](#plugin-1332642596-root) | 在DSH内提供短视频浮动播放器，支持内置随机源解析、直链历史回放和自定义视频/网页源。 | 有嵌入媒体需求时先核对来源与网络流量，测试关闭停止及直链过期；不据内置源数量判断内容稳定或适用。 |
| [dsh-douyin-webview](#plugin-1423040689-root) | 在 DSH Desktop 侧栏挂载可移动和缩放的抖音 webview 视频窗口。 | 只适合DSH Desktop里需要小窗观看的人先试；确认关闭后释放资源、重启登录是否保留、网页改版后全屏能退出，浏览器版无需按可播放功能期待。 |
| [dsh-draft-attachments](#plugin-1414492607-root) | 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。 | 可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。 |
| [dsh-drag-and-drop](#plugin-1333975935-root) | 为 DSH Web 拖入文件/文件夹生成可删除路径 chip，并在发送时插入会话草稿。 | 建议观察，继续可从可信本机Host、明确session归属及合成同名/异步切换场景研究来源匹配；不作原件身份保证或远端文件上传工具。 |
| [dsh-draw-gacha](#plugin-1335791040-root) | DSH Web 拉杆发送与流式信号驱动的 3D 娱乐抽卡演出。 | 限个人娱乐试用；不能用稀有度评价模型。 |
| [dsh-effort-slider](#plugin-1335766616-root) | 给DSH模型思考档位提供滑块反馈，并向pi-ai缺失声明的模型补写reasoningEfforts与方言配置。 | 备份后单route试用，核实际请求及最后选择。 |
| [dsh-file-handover](#plugin-1422380986-root) | 将显式指定的本地文件填入Windows原生文件对话框，逐项回读后再确认。 | 适合单一明确文件对话框的Windows任务先试用。 |
| [dsh-forget-session](#plugin-1413882487-root) | 在 DSH 会话菜单中遗忘会话，清理活动会话、日志目录与投影缓存并复查残留。 | 只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。 |
| [dsh-fullscreen-input](#plugin-1407166868-root) | 为同一会话草稿提供可拖动的大输入面板与明确发送手势。 | 先核自己的宿主版本、输入法与引用附件保留，再替代主要输入入口。 |
| [dsh-gotify-notify](#plugin-1412623357-root) | 将DSH轮次结束和部分等待用户输入事件推送至Gotify，并提供原因过滤、优先级与凭据设置。 | 先确认Gotify目的地址与正文，再用测试通知和测试会话验证；勿依靠它接收权限审批或判业务完成。 |
| [dsh-gui-guard](#plugin-1422121370-root) | 在Windows窗口点击或输入前检查并准备前台状态，换算坐标口径并返回动作诊断。 | 适合已有可靠目标坐标的Windows用户在无破坏性窗口先检查。 |
| [dsh-harness-chat-control](#plugin-1357066651-root) | 为 DSH 会话提供引用、侧聊、会话编辑及侧聊模型与历史控制。 | 适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。 |
| [dsh-heatmap](#plugin-1334318461-root) | 从全部DSH会话usage和工作区Git历史生成侧栏热力图、今日token/cache及模型费用估值。 | 先观察，先核usage/价格/缺数和禁用授权再评估趋势面板，不能作精确支出核算。 |
| [dsh-im-qq](#plugin-1335806472-root) | 将QQ私聊、群和频道文本接入DSH完整Agent，提供会话恢复、回复分段与审批桥。 | 观察，继续从严格单人身份、最小Agent权限和可审计任务/回复入手。 |
| [dsh-inline-images](#plugin-1334134226-root) | 将助手文本中的绝对图片路径改写成可加载的本地路由，并提供灯箱和尺寸设置。 | 仅在可信隔离环境试用，先核 Host 外围访问边界与远程客户端，再评估稳定性和资源。 |
| [dsh-keyboard-manager](#plugin-1359145374-root) | 以可配置 Ctrl 快捷键切换 DSH 侧栏、右面板和设置。 | 键盘操作频繁者可列为小型界面增强候选；如有编辑器快捷键或自定义布局，先核对事件消费与目标按钮契约。 |
| [dsh-language-guard](#plugin-1424475406-root) | 以可配置提示片段、语言命令和周期提醒约束 DSH 输出语言。 | 有固定输出语言需求者可评估；多会话不同语言或任务需按项目规范切换语言时，先明确模块级临时覆盖与强制文案是否符合要求。 |
| [dsh-llm-balance-siderbar](#plugin-1366370702-root) | 按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。 | 适合路由较多且有额度查询接口者；先核账户匹配、来源新鲜度和外层路由授权。 |
| [dsh-memory-setup](#plugin-1337350700-root) | 提供工作区JSON偏好、规范、工作流与教训记忆，含DSH工具、提示注入、知识检索及备份恢复接口。 | 当前不推荐直接启为真实高信任记忆层。 |
| [dsh-mimotts](#plugin-1397477851-root) | 把定稿助手回复交给MiMo TTS合成语音，提供消息播放按钮、内联播放器与语音历史。 | 先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。 |
| [dsh-monitor](#plugin-1333440937-root) | 通过文件或命令轮询监听新内容，空闲时唤醒所属Agent，并提供查看和停止工具。 | 观察，可信单用户file场景可继续探讨，但保外部日志补读，避免唯一通知链。 |
| [dsh-need-finder](#plugin-1336571882-root) | 用本地固定插件目录做中英文词法加权检索，返回命中理由和命令文本，并给出社区套装有序安装计划。 | 观察，先补真实描述/来源/版本与约束，作为探索入口而非可信安装名单或环境求解。 |
| [dsh-neo-skin](#plugin-1335557891-root) | 为 DSH Web UI 叠加两套新粗野主义配色和结构样式。 | 个人隔离 profile 先做浅/深/系统、双方案与开关的视觉回归。 |
| [dsh-perlica-ding](#plugin-1335704653-root) | 按DSH计划、执行回合收尾、待回应与错误事件播放四类本地音效，提供PCM音量缩放、设置保存和试听界面。 | 有条件试用，可信本机小PCM/低音量先核事件和设备；声音不是任务验收，远端和严格隔离提醒先观察。 |
| [dsh-pet-live2d](#plugin-1378097401-dsh-live2d-pet) | 在DSH中显示可拖动Live2D宠物，并随会话状态切换动作、气泡与表情。 | 适合个人会话提示先试用。 |
| [dsh-pinned-sessions](#plugin-1407379611-root) | 在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。 | 已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。 |
| [dsh-plugin-auto-answer](#plugin-1423966960-root) | 在DSH用户问题超时后自动选择提问方标为推荐的选项，并允许配置回退与计划评审策略。 | 仅在明确允许机器默认的低风险偏好任务先试用。 |
| [dsh-plugin-crypto-ticker](#plugin-1389061748-root) | 在 DSH 侧栏显示加密货币价格、涨跌与走势图，支持多来源降级。 | 适合参考性看盘；先检查当前来源和逐币 stale 状态，遇到来源切换时到交易平台复核价格。 |
| [dsh-plugin-focus](#plugin-1336084195-root) | 为DSH提供工作区内的持久焦点板，模型可记录目标、约束和决定，按标签汇总，并在每轮或内容变化时自动注入上下文。 | 先观察。 |
| [dsh-plugin-local-life](#plugin-1336663652-root) | 提供本地生活算术工具，含预算、分摊、比价、折扣、换算、贷款与清单。 | 仅在低风险、同单位且人工复核的算术任务观察；跨单位比价和贷款勿直接用于资金决策。 |
| [dsh-plugin-namecards](#plugin-1424219088-root) | 为 DSH 插件列表添加本地名片、中文备注、图标、文件夹和收藏。 | 插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。 |
| [dsh-plugin-recommend](#plugin-1336684098-root) | 从内置市场目录做需求词法排序、分类详情与相似候选搜索，可显式从固定HTTPS README刷新目录。 | 观察，先加刷新来源/字段质量门，将结果当相关候选而非安全/安装推荐。 |
| [dsh-plugin-session-colors](#plugin-1394188597-root) | 在 DSH 侧栏为会话选择颜色，并将颜色映射保存到宿主。 | 会话多的人可先给独名会话少量标色；刷新后确认持久保存，同名或离线改色要核对，别用颜色承载关键任务状态。 |
| [dsh-profile-stylist](#plugin-1422500224-root) | 借助宿主模型生成资料草稿，并通过浏览器填写 GitHub 或 Gitee 个人资料。 | 要修改GitHub或Gitee自己资料的人先生成草稿并检查账号；小范围填一个字段后重新打开资料页确认，头像和批量字段待验证后再用。 |
| [dsh-prompt-polish](#plugin-1336538202-root) | DSH Web 输入栏提示词重写 UI；经 Typert RPC 调用宿主已配置模型，先展示结果再人工采用。 | 先在隔离 Web profile 用非敏感草稿、关闭历史试用；再按需开上下文并确认 provider 与工作区路径。 |
| [dsh-question-nav](#plugin-1341946801-root) | 以会话提问索引与圆点导航跳转历史用户提问。 | 经常回看长会话者可列为导航候选；多模态/多文本块提问需核对索引完整性，不把圆点缺失理解为没有历史问题。 |
| [dsh-receipts](#plugin-1344714660-root) | 从本地DSH会话日志汇总使用记录，结合Git信息生成Markdown和离线HTML报告。 | 当前先在复制日志和Git关闭模式审阅。 |
| [dsh-right-click-menu](#plugin-1404720276-root) | 为文件树与聊天路径增加上下文菜单，衔接预览、系统打开、复制与另存为。 | 先在隔离目录核保存目标、覆盖和权限；菜单便利不代表按会话受限文件能力。 |
| [dsh-RTL-chat](#plugin-1410794267-root) | 为DSH对话阅读区提供可持久化的RTL/LTR切换，并保持代码块从左向右。 | 有RTL阅读需求时可先用混排样例核查；检查代码复制、链接及卸载样式残留。 |
| [dsh-session-path](#plugin-1412141303-root) | 定位 DSH 会话日志并导出可读 Markdown 或 JSONL 交接文件。 | 需要接续时优先检查Markdown导出及截断；JSONL预算语义与长日志内存问题确认前，不用作有界最新上下文保证。 |
| [dsh-session-rename](#plugin-1368115538-root) | 给 DSH 模型提供 rename_session 工具，设置当前或已加载会话的显式标题。 | 先用当前会话改成简短需求ID；指定别的会话前确认目标已加载且确需修改，记住显式标题会取代自动生成。 |
| [dsh-session-turn-eta](#plugin-1368581082-root) | 根据DSH会话的轮次与步骤历史估计当前轮剩余时间，并在输入框下显示进度。 | 适合把进度当粗略等待提示的用户先试用。 |
| [dsh-side-session](#plugin-1355639507-root) | 从命令菜单创建可继续的旁会话，并跳转到原生子会话聊天视图。 | 先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。 |
| [dsh-soul](#plugin-1352089397-root) | 管理分层人设配置、提示词注入、变更历史及带确认的人设修改。 | 适合显式风格管理；先核作用域和实际注入，重要规则仍由宿主权限和验收保障。 |
| [dsh-sound](#plugin-1335332435-root) | 按完成、审批、提问、计划评审、受阻和失败播放独立声音，并区分主Agent/子Agent来源。 | 可试用作辅助通知，先内置低音量核主子频道/原UI，保留视觉提醒，不当唯一可靠通道。 |
| [dsh-speak](#plugin-1334493734-root) | 将助手回复与可选事件交给本机语音引擎播报，提供队列状态与重播。 | 适合本机听取提醒；先核播报范围、隐私、停止与长文策略，不依赖声音代替审批原文。 |
| [dsh-spotlight](#plugin-1333136466-root) | 在DSH Web用一个快捷键面板搜索会话、slash命令、可见界面动作与插件设置入口。 | 兼容Web可有限试用，先备份/清空草稿并试无副作用导航，目标/回执未知就停止。 |
| [dsh-starter-zh](#plugin-1336658798-root) | 在会话中提供欢迎、五阶段入门路线、四组固定插件建议和十项自查清单。 | 先观察，资料可读参考但先修profile断链和版本/推荐来源，再评估安装必要性。 |
| [dsh-status-rotator](#plugin-1333328839-root) | DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。 | 测试 profile 先静态文案，再逐项开启更新与动画，核读屏和性能。 |
| [dsh-sticker-pack](#plugin-1418769012-root) | 订阅远端表情包清单，按上下文挑选图片，提供缓存、贴图概率与会话显示适配。 | 需要共用表情素材时可先在非工作关键会话试。 |
| [dsh-temptask](#plugin-1390600932-root) | 为临时任务创建独立目录和DSH工作区，提供清理、转正搬迁与会话历史重建。 | 先在可丢弃目录验证清理和转正，保留重要文件备份。 |
| [dsh-text-inject](#plugin-1389458393-root) | 从独立Markdown文件加载系统提示和上下文块，提供设置页编辑、热加载与历史备份。 | 先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。 |
| [dsh-think-bounce-pet](#plugin-1343882273-root) | 在 DSH Web 显示常驻和随 reasoning 文本变化的弹球宠物，可调整物理效果。 | 喜欢界面装饰的人可先调低速度/大小；遇到遮挡或干扰关闭，不把思考球当可靠运行状态。 |
| [dsh-thumb](#plugin-1341694685-root) | 为窄屏DSH提供覆盖式会话抽屉、单列设置与紧凑阅读样式。 | 手机用户可先核会话切换、设置和相邻trace视图；需要更大点击目标时调整密度。 |
| [dsh-tts-flash](#plugin-1363291561-root) | 为 DSH 流式回复提供语音朗读、字幕浮条及等待短语，支持 Edge 与 OpenAI 兼容语音服务。 | 需要听当前回复的用户可先用非敏感短文试用，确认窗口切换、停止和自动播放正常；长回复必须对照文字检查是否跳句，不适合直接当完整有声文稿导出器。 |
| [dsh-turn-outline](#plugin-1356219122-root) | 把DSH会话事件折叠为轮次轨迹，并在better-sidebar侧栏定位回聊天或轨迹视图。 | 适合已用better-sidebar的长会话用户先试，核对压缩前历史和并行工具的定位；重大追溯仍查看完整日志。 |
| [dsh-ui-enhancer](#plugin-1339034478-root) | 组合右侧文件预览、@文件引用、本地壁纸和活动宠物，增强DSH web桌面体验。 | 先观察，优先核对活动路由授权与上游预览，明确边界后再评估个人本地小范围试用。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在 DSH 设置页展示本机 Token、模型分布和技能调用状态。 | 适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。 |
| [dsh-vision](#plugin-1335070045-packages-vision-route) | 给纯文本模型路由添加图片附件转译旁路，使用智谱视觉模型生成文字证据。 | 需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。 |
| [dsh-vision-fallback](#plugin-1333993743-root) | 保持原主模型选择，把聊天与工具图片交给固定视觉模型转成文字观察，并保留界面原图。 | 适合明确接受外部图片和上下文传输的人，以auto和非敏感单图试用，重要结论回图核对并管理本地观察日志；漏读、陈旧观察或退出失效时停用。 |
| [dsh-vision-free-eyes](#plugin-1335070045-packages-vision-tool) | 以智谱 GLM API 为后端的 DSH 单图 vision/OCR 模型工具。 | 取得用户对特定图片出站授权，检查 Key/额度，再在非敏感图片上验证失败/成功；详见[Q03](#research-q03)。 |
| [dsh-voice](#plugin-1334554745-root) | 在 DSH 网页用麦克风或快捷键语音输入，支持本机 ASR 与浏览器识别并作为正常消息提交。 | 建议非敏感普通对话小范围试用，确认会话、真实引擎和停麦自动提交；误发、回退不透明或截断频繁时停止。 |
| [dsh-voice-input-web](#plugin-1335558973-root) | 为 DSH Web 输入栏增加浏览器 Web Speech 麦克风转写按钮，把识别最终文本写入草稿。 | 默认保持 autoSend 关闭，先用非敏感语音验证识别和草稿编辑；转写后人工检查再发送。 |
| [dsh-web-mobile-fix](#plugin-1334255250-root) | 调整DSH窄屏布局，并为悬浮窗模式提供会话导航、桥接按钮与软键盘滚动适配。 | 先用代表性手机和临时网页profile验证输入与导航。 |
| [dsh-whale-girl-live2d](#plugin-1387205322-root) | 将DSH会话事件映射为Live2D桌宠动作与状态，并提供输入、钱包和可选桌面外壳。 | 偏好桌宠时先确认美术非商业条款与宿主版本；在临时profile核对多会话状态和输入路由保护，费用仍以服务账单为准。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。 | 先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。 |
| [dsh-workspace-tools](#plugin-1363511446-root) | 为工作区保存Agent和权限默认预设，并在新根会话创建时自动应用。 | 适合工作区信任稳定的用户先用保守权限测试。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从WSL调用Windows默认浏览器打开HTTP或HTTPS地址，并给出localhost排障提示。 | 适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。 |
| [dsh-wsl-clipboard](#plugin-1350378372-root) | 从WSL读取或写入Windows文本剪贴板，支持长度限制与Unicode编码转换。 | 先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。 |
| [dsh-wsl-download](#plugin-1351854499-root) | 列出Windows下载目录中的文件并复制到WSL，另提供本地模型文件管理提示。 | 先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。 |
| [dsh-wsl-im](#plugin-1370460115-root) | 把多种即时通信平台接入DSH Agent，支持按聊天会话转发消息与媒体。 | 先限制允许用户并在测试群核查共享上下文，确认停止插件后连接和会话被回收。 |
| [dsh-wsl-launch](#plugin-1350378498-root) | 从WSL启动允许列表中的Windows应用，并传递启动参数。 | 使用明确的应用路径和小范围允许列表，先验证含空格的文件参数。 |
| [dsh-wsl-notify](#plugin-1350379268-root) | 从WSL向Windows显示消息框或托盘气泡通知。 | 优先短消息与低频提醒，确认锁屏和消息框超时表现，不发送秘密内容。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 把聊天中的Linux文件路径转为可从Windows打开的文件入口。 | 先用一个非敏感文件测试中文和空格路径，确认目标文件而非只看应用启动。 |
| [dsh-wsl-picker](#plugin-1351853863-root) | 在DSH中浏览WSL目录与挂载盘，支持名称过滤和工作区快捷入口。 | 适合小中目录导航；先确认返回路径，敏感目录仍受进程权限而非插件白名单控制。 |
| [dsh-wsl-shot](#plugin-1351854253-root) | 把Windows剪贴板中的图片保存为WSL文件供多模态聊天使用。 | 先用非敏感截图确认保存和模型读取链路；及时检查Windows临时文件残留。 |
| [dsh-youreyes](#plugin-1335045545-root) | 将图片交给视觉模型生成文字记录，供 DSH 文本模型调用，支持 OCR、区域、多图与记忆复用。 | 建议观察，先补发布物和数据边界，以不敏感有标签图片验证；不把auto或结构化记录当隐私/准确保证。 |
| [dsh-yukimi-theme](#plugin-1335281982-root) | DSH Web 佐城雪美主题与 Windows desktop profile 桌宠通知，素材从外部 wiki URL 加载。 | 先在隔离 Web 看可读性，再完整打包桌面副本、核通知/回滚和素材权利。 |
| [feiyu-memory](#plugin-1415822787-root) | 以分层日记、印象与检索记忆延续 DSH 对话中的角色体验。 | 仅面向愿意审阅记忆的小型娱乐对话；私密内容、工作事实和多用户隔离场景不依赖其正则保护与共享日记。 |
| [Forge 便签](#plugin-1363429979-plugin-notes) | 提供 Markdown 便签板、搜索归档和任务泳道，可把便签交给智能体或定时执行。 | 先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。 |
| [harness-memory](#plugin-1333716755-plugins-harness-memory) | 为 DSH 保存长期记忆，并在后续会话的系统提示中分类注入。 | 个人先保存少量非敏感稳定偏好；跨项目使用前核对适用范围，重要约定保留文档真相，定期清理错误记忆。 |
| [hover-glossary](#plugin-1374454334-root) | 在已发送聊天正文中悬停词语，显示内置的一对多释义。 | 固定术语查阅需求可评估；需要权威领域解释或上下文消歧时仍回原来源，不以首条释义作唯一结论。 |
| [ikun-theme-skin](#plugin-1335144603-root) | 给 DSH Web 添加三套 IKUN 配色、壁纸、音乐、发送音效与娱乐化 UI。 | 个人隔离试用，需能关闭音效并核原外观偏好；共享环境先经用户选择。 |
| [mac-notify](#plugin-1402940561-root) | 把 DSH 完成、提问、审批与报错转为 macOS 原生通知。 | 有后台任务提醒需求的 macOS 用户可将其列入候选；涉及敏感输出时先限制摘要与声音，是否适用取决于通知权限和多会话定位要求。 |
| [messaging-core](#plugin-1335798113-packages-messaging-core) | 把多种消息平台接入DSH，共享聊天会话映射、流式出站路由、白名单配置和消息工具。 | 先观察，继续核查可用无账号adapter桩验证出站权限和投递状态，再按明确授权评估单平台单用户；暂不把整套作默认多人远程入口。 |
| [offpeak-badge](#plugin-1402828137-root) | 在 DSH Web 侧栏显示按内置规则计算的高峰/空闲时段。 | 仅在确认自己的服务确实适用该内置规则时，把它当作时间提示；不依据徽标单独做费用承诺或自动延迟紧急任务。 |
| [oil-dsh-title](#plugin-1374149009-root) | 根据近期用户消息生成和维护带类别标识的会话标题。 | 会话多时可在非敏感任务先检查标题质量。 |
| [Prompt Desk](#plugin-1418691015-root) | 在对话标题栏编辑全局与会话提示词，并把模型自报错误收为待确认经验草稿。 | 已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。 |
| [prompt-optimizer](#plugin-1403959948-root) | 用当前 Harness 模型或 Codex 澄清、改写提示词，预览后填回草稿。 | 需要先整理需求且愿意审阅改写者可列为候选；直接明确的小任务收益有限，TUI应用回执不能当作已落地保证。 |
| [type-tune（DSH-Plugin_awl）](#plugin-1388463793-root) | 调节 DSH Web 字体、文字对比度、光晕与内容特效。 | 需要修复主题文字可读性者可评估静态阅读预设；先确认本地状态可持久，特效是否有利于阅读应按实际长文测量。 |
| [zcode-usage-stats](#plugin-1368192539-root) | 扫描历史会话用量并在设置页展示趋势、模型分布与活跃热力图。 | 适合本地用量回顾；先核事件口径、缓存新鲜度和扫描warning，勿把token活动当生产成果。 |
| [上下文交接提醒](#plugin-1396768359-root) | 消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。 | 适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。 |
| [滚动钢琴与消息小地图](#plugin-1412162067-root) | 在聊天区边缘按鼠标位置演奏钢琴音，并预览和跳转用户消息。 | 作为趣味和用户消息回看辅助试用；长会话和侧栏布局先核对刻度覆盖，办公环境先调低音量，不替代正式搜索。 |
| [蓝毛小女仆桌宠](#plugin-1409724830-src) | 以透明动画桌宠提供陪伴聊天，可选本地模型、在线模型与屏幕观察。 | 先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。 |

<a id="plugin-1334428397-root"></a>

## [@awiki/dsh-plugin](../../plugins/agentconnect--dsh-awiki/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AgentConnect/dsh-awiki) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@awiki/dsh-plugin)

> **用途**：适合已使用AWiki身份/私信群聊/邮件、希望在DSH内查看和经明确授权发送，或从允许联系人进入Agent会话的用户。基线独立通信客户端+手工把消息交模型/复制结果；插件把身份状态、Host服务、工具、Web overlay与Core本地数据接入DSH，减少跨应用拼接。

> **亮点**：整合独立身份/Rust Core、Host公共DTO、十通信工具与Web界面，加入会话/租户fence和有来源范围的有限摘要，减少跨应用接线。详见[Q01](#research-q01)、[Q05](#research-q05)。

> **思考**：可选listener在Agent效果后才回复并提交水位，失败重启可能重驱Agent；回复幂等不等工具效果一次。Core密钥/恢复与Host审批链需分层核，摘要schema不证语义。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索绑定incomingID/identity/tenant的执行阶段记录，unknown不盲重放，失败turn不伪成功，以假效果矩阵证伪；未实现。详见[Q07](#research-q07)。

<a id="plugin-1414238544-root"></a>

## [air-pixel-liquid-glass](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)

> **用途**：希望定制界面且保持可读性的DSH用户，合格体验需对比度和性能可接受、禁用可恢复；桌面透明与网页CSS是不同能力。

> **亮点**：相对单一换色，增量是玻璃强度与双侧消息对比度一起可配，并显式区分窗口材质与CSS。Electron窗口效果归平台机制，插件实现主题和接线。

> **思考**：是否“装主题”就得到桌面透明？README明确需主进程patch，运行宿主本身不能直接调BrowserWindow；更新替换asar后需重新核对。截图是stand-in shell渲染而非真实透明截图，不能据示例认定当前目标机器效果或性能。

> **建议**：由patch外部通道推导，可通过宿主正式窗口材质API和可达性能力声明替代归档修改，同时按实测对比度限制强度。未验证；不同背景/主题/升级下测文本可读与恢复，若仍需不可追踪patch则不成立。

<a id="plugin-1378933589-adapters-dsh"></a>

## [Amoji for dsh](../../plugins/5101good--amoji--adapters-dsh/INSIGHT.md)



> **用途**：在DSH对话里用图像表达感受或协作意图的人看表情图，模型读取精确版本固定文字语义；交付可追溯的表情消息与状态，不能把表情当进度或授权凭据。

> **亮点**：相对把普通表情图片交给视觉模型猜测，贡献是把人看的视觉与模型读的不可变版本语义分开，并让消息绑定真实会话/回合与选择令牌；accepted与observed、图像rendered分层避免把排队当落盘或可见。DSH提供原生消息与会话控制接口，共享核心提供库与资产；适配器增量是可靠投递关联与原生界面/工具接线，不将整个共享库规模算入本组件。

> **思考**：固定语义是否足以防止错误理解与重复执行？expressionMessageText明确把语义视为数据、要求既有授权内理解意图，tool描述还要求核对主体对象，说明固定文字仍可能被模型反向使用或夸大成完成事实。宿主accepted并非落盘，unknown不得盲重试；任意新版DSH/模型组合也未保证兼容。跟踪源码中的runtime/client生成物不在adapter目录里，直接装源码子目录不等同于作者release tgz。

> **建议**：待验证假设：在版本语义之外增加发送者角色、目标对象与允许意图的结构化契约，并在投递前后做同一会话断言，可减少“用户催进度”被AI当“已完成”的反向表达。依据是现有工具描述依赖模型自检主体对象，未实现通用语义角色验证。用同一批询问/澄清/暂停/反馈表情，在用户→AI与AI→用户两方向对照，统计方向误读、越权推断和自然回复成功率；语义结构可能增加创作门槛，不能牺牲可表达性强行通过。

<a id="plugin-1335381015-root"></a>

## [anan-thermal-monitor](../../plugins/amekrance--anan-thermal-monitor/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor)

> **用途**：希望常驻桌面查看 CPU/内存/GPU/NVMe 温度的 Windows 用户。

> **亮点**：把硬件传感器以桌面悬浮卡片呈现，并可由 DSH 启停。详见[Q01](#research-q01)。

> **思考**：管理员提权与二进制依赖较重；Host 启动立即回 running:true，GUI 卡片承诺缺直接实现，npm files 不含独立启动/自启入口。详见[Q01](#research-q01)至[Q03](#research-q03)。

> **建议**：核实 PID/数据心跳后再报告运行、明确源码与 npm 安装差异，可减少误导；待 Windows 实测。详见[Q03](#research-q03)。

<a id="plugin-1335807482-root"></a>

## [chicheng-cron](../../plugins/534119219--chicheng-cron/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-cron)

> **用途**：面向DSH Web长期运行、希望定时执行本地小脚本或已有Skill/Agent任务的个人用户。可用于重复采集、整理和提醒，但合格结果必须是预期时点只运行预期次数、正确工作目录、结果能核查、异常不留下失控子进程，而非仅在历史表出现done。

> **亮点**：将脚本、headless Agent/Skill、运行历史和多渠道通知汇入同一Web任务管理界面，减少手工接线；不是新调度算法或隔离执行器。详见[Q02](#research-q02)。

> **思考**：每次唤醒回看一分钟而不记录occurrence，高频任务可让已触发任务重复due；会话按mtime猜测再归档，timeout只杀直接child，均未运行复现。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：可探索持久occurrence claim、重叠策略与稳定run→session收据，再触发通知/归档，比较重复、漏跑和错误归属；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336366824-root"></a>

## [chicheng-peak](../../plugins/534119219--chicheng-peak/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-peak)

> **用途**：人工按确认的时段安排任务/接提醒，不自动验证费率或调整请求。

> **亮点**：把阶段可视和页面关闭后的多渠道调度集中，减少计时发信接线，非新计价/可靠消息算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：重叠窗/override显示与提醒可不一致，先标fired失败不重试且持久化延迟可重复，本地仍称已发；热重载tearDown未重置。详见[Q02](#research-q02)。

> **建议**：可探讨规则版本/有效转折与持久投递状态收据，统一unknown/查询恢复和实例隔离，渠道维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1337038478-root"></a>

## [chicheng-quickinput（vault）](../../plugins/534119219--chicheng-quickinput/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-quickinput)

> **用途**：频繁在DSH输入地址、服务器或凭据的人保存常用片段并填入草稿；含私密内容时需要同时核对加密库、建议缓存与会话记录。

> **亮点**：相对通用剪贴板或手工复制，增量是直接接DSH会话识别和输入动作，把待收录建议、常用字段与私密库整合；密码派生与AES-GCM来自WebCrypto。随机K分别由主密码/安全词包裹使重置不必重加密每条记录，是成熟信封加密在此流程的应用。

> **思考**：私密明文是否只存在解锁后的浏览器内存？queueSuggestions把item.value保存在pending，flushSuggestions将pending写入suggestions.json，覆盖密钥/JWT等识别候选；hash用于去重并未去掉value。这与README明确承诺冲突，库记录加密不能补偿前置建议明文副本。点击私密记录填入/直接发送后还会进入会话和模型请求，库锁定也不能撤回这些副本。

> **建议**：待验证假设：自动识别只在内存保留短时候选，用户明确收录后立即经浏览器加密，再持久化密文与hash，可消除建议文件的敏感旁路。依据是现有识别与加密路径分离，当前未实现。以已知测试密钥触发建议、重启、收录、拒绝和锁定，扫描所有插件文件及备份确认无明文；同时测重启后丢建议的可接受性，不能把丢失提示作为无损设计。

<a id="plugin-1343679449-root"></a>

## [deepseek-harness-hello-kitty-suite](../../plugins/angel2518975237--deepseek-harness-hello-kitty-suite/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite)

> **用途**：喜欢角色主题且希望离屏提醒的用户；轮次停止与任务成功、等待人答是不同事实。

> **亮点**：相对单独皮肤，增量是主题化通知组合和适配语义锚点；底层皮肤中心/浏览器通知属于宿主与平台。角色商标/美术权利不应由代码license替代。

> **思考**：全局结束事件能否说明当前会话完成？seq无session/result归属，其他Agent停止也可能触发当前DOM判断；问号只是文本启发，非ask_user_question或成功验收。多个浏览器标签可各响，后台轮询/音频权限还会漏提醒。

> **建议**：由全局seq与DOM启发推导，可用session/turn/callId事件分类，明确完成/提问/失败并跨标签选单一通知者。未验证；并行会话、非问号提问和失败停止时测误报/重复，正确事件归属应改善。

<a id="plugin-1340492378-root"></a>

## [dock-images](../../plugins/aks1st--dock-images/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-images) [![npm 30d 1,046](https://img.shields.io/static/v1?label=npm+30d&message=1%2C046&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-images) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-images)

> **用途**：查看聊天相关本地截图或素材，保持在工作台中。

> **亮点**：在统一资源入口提供无需外部应用的图片预览，缩放限制0.1至8倍、加载切换时丢弃旧响应；不是图像处理或模型识别。

> **思考**：20MiB文件限制和扩展名MIME映射不限制解码像素与内存，base64还放大传输；路径允许任意绝对文件，不能宣称工作区读隔离。旋转不产生可保存的新图。

> **建议**：未验证假设：读取前核像素与格式、对大图返回缩略图可降低峰值内存。用小压缩高像素、误扩展及普通截图比较内存、首屏延迟和拒绝提示。

<a id="plugin-1336994666-root"></a>

## [DPH 任务看板](../../plugins/1070296335-create--dph-taskboard/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard)

> **用途**：同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。

> **亮点**：浏览器以 localStorage 管理分类，宿主路由接收快照原子落盘，恢复归档优先走 workspaceRegistry。

> **思考**：卡片直接对应会话可减少重复建账；浏览器状态与落盘镜像仍可能出现不同步。

> **建议**：用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。

<a id="plugin-1335661970-root"></a>

## [dsh-alive](../../plugins/aikenfra--dsh-alive/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AikenFra/dsh-alive) [![npm 30d 832](https://img.shields.io/static/v1?label=npm+30d&message=832&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-alive) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-alive)

> **用途**：用户想知道浏览器是否还能连本地 DSH Web 进程。

> **亮点**：极简本地可达性显示，初次加载即测、卸载清轮询。详见[Q02](#research-q02)。

> **思考**：标题称“DeepSeek 服务状态”，实际仅测本地路由；无超时/响应体验证且兼容范围止于 <0.2.0。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **建议**：分层健康标签与超时/响应校验可减少误报；未实现。详见[Q05](#research-q05)。

<a id="plugin-1334899834-root"></a>

## [dsh-api-balance](../../plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance)

> **用途**：操作者在发起对话前快速查看指定 DeepSeek key 的余额状态。详见[Q01](#research-q01)。

> **亮点**：把账户余额置于会话输入附近并可配置刷新频率。详见[Q01](#research-q01)。

> **思考**：凭证作为外部命令字符串参数、无路由内身份检查及重叠轮询可能影响安全/新鲜度；外围与真实利用待测。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：Host 内部 HTTP、共享短缓存与响应序号可能减少凭证暴露和乱序覆盖；以假 key/多窗口对照证伪。详见[Q05](#research-q05)。

<a id="plugin-1335060115-root"></a>

## [dsh-archived-conversations](../../plugins/aks1st--dsh-archived-conversations/INSIGHT.md)

[![npm 30d 804](https://img.shields.io/static/v1?label=npm+30d&message=804&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations)

> **用途**：本地用户辨认归档曾讨论内容。详见[Q01](#research-q01)。

> **亮点**：不绕domain状态owner增加归档辨认入口。详见[Q01](#research-q01)。

> **思考**：小预览仍全读日志，归档成员只读前核，客户端无请求序号可错配标题/正文，限本地HTTP。详见[Q03](#research-q03)。

> **建议**：研究有限倒序读取、成员版本与请求序号/abort，比较错配与读取峰值。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1346023186-root"></a>

## [dsh-at-skill](../../plugins/452926826--dsh-at-skill/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-at-skill)

> **用途**：用户在输入框选择可调用Skill并确保模型开始前加载其指令，减少记忆斜杠命令或依赖模型自行判断。

> **亮点**：相对只给输入补全，将匹配token的Skill在模型步骤前确定性加载；同时遵循next拒绝决定、用户可调用过滤与会话cwd/scope查找，保持宿主作用域。

> **思考**：文本token不携带来源身份。与subagent/plugin同名或用户仅讨论@名称时，宿主仍可加载匹配Skill。客户端会话缓存只在connection/reset清理，Skill变更后候选与宿主即时查找可能不同；“确定性”不等于用户意图准确。

> **建议**：Skill命名清晰的用户可评估；与插件或子代理重名时谨慎使用，发送前确认文本，加载不代表任务执行验收。

<a id="plugin-1425073734-root"></a>

## [dsh-auto-shutdown](../../plugins/873360545--dsh-auto-shutdown/INSIGHT.md)



> **用途**：Windows用户让Agent运行任务后离开，希望结束时关机；合格行为是仅在授权会话真正到达合适终点、其它工作可保存时安排一次，并能可靠取消。

> **亮点**：相对人工守候后关机，增量是将root轮次边界、单次锁存和原生取消窗口组合为可配置交接；系统关机命令是既有能力，插件贡献在触发条件与用户干预入口。

> **思考**：“一次且重启不再触发”是否保证？disarm捕获settings写入错误后仍继续scheduleShutdown，持久开关可能仍为true；turn-stopping也不证明业务任务成功或待保存数据完成。fired只在当前进程防重复，不能把它当跨重启事务锁。

> **建议**：由持久复位与外部关机分离推导，可在复位失败时停止安排关机，并将触发限定为用户选定会话与显式完成标记，保留可观察的计划ID。未验证假设是减少错误时机关机；模拟设置写失败、失败轮、其它应用未保存和重启，若仍出现未经条件满足的计划则否定。

<a id="plugin-1347136944-root"></a>

## [dsh-balance-chip](../../plugins/akush99--dsh-balance-chip/INSIGHT.md)



> **用途**：使用单个DeepSeek API账户时快速看到余额线索。

> **亮点**：把凭据留在主机、仅返回余额状态给前端，减少手工打开控制台；没有新的预算控制或计费机制。

> **思考**：主机setInterval未保存到disposer且没有clearInterval、超时或重叠锁，卸载/热重载可能留下轮询；路由仅限GET而无本项来源检查，依赖宿主外层授权。只取首币种但前端总加$且固定5阈值，货币语义不稳。

> **建议**：未验证假设：生命周期清理、带超时串行轮询及币种感知显示可使余额提示可信。用卸载重载、慢请求、多币种及过期key核请求数、资源释放和显示一致性。

<a id="plugin-1422328385-root"></a>

## [dsh-boo550wt-animation](../../plugins/456erddgr--dsh-boo550wt-animation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)

> **用途**：希望定制DSH启动视觉的人在应用加载时播放本地视频；交付启动体验，不改变模型任务或业务成果。

> **亮点**：相对客户端加载后再显示动画，本插件使用更早的webserver注入行，尝试在宿主启动就绪之前覆盖首帧，并把视频Range服务与DOM清理集中为host-only组件。时机与接线是DSH适配增量，媒体解码由浏览器完成，不是新视频技术。

> **思考**：maxSeconds是否真是永远不会锁窗的硬上限？onMetadata先清除初始guard，再用video.duration+graceMs重设；时长超过maxSeconds会延长等待，非有限或无效时长直接return且没有新guard，违背README对硬上限的强表述。Esc仍提供人工退出，但不能拿它替代自动上限；首帧也取决于宿主消费注入行的实际时序。

> **建议**：待验证假设：保留独立且不重置的绝对启动deadline，再用较短的媒体时长计时辅助退出，可使失败视频不延迟交接。由onMetadata覆盖guard的缺口推导，尚未实现。用无元数据、无效时长、超长视频与正常视频四组对照检查遮罩关闭时间、Esc和监听清理；要求任何状态不超过固定deadline，代价是长片被截断。

<a id="plugin-1335928912-root"></a>

## [dsh-butler-memory](../../plugins/andyyang12345--dsh-butler-memory/INSIGHT.md)



> **用途**：让 agent 跨会话记忆，并让用户查看/决定候选及修订。

> **亮点**：相对仅模型工具示例，增加 DSH Web 记忆/候选可视界面和 RPC 桥；记忆存储与策略归上游。详见[Q02](#research-q02)。

> **思考**：桥 Promise.race 超时不清 pending，dispose 回调未绑定 this，候选操作无显式 owner/revision；真实影响需宿主验证。详见[Q03](#research-q03)。

> **建议**：共享受监督桥、超时清理和带版本候选决策可改善生命周期及审核闭环；未实现。详见[Q05](#research-q05)。

<a id="plugin-1376880747-root"></a>

## [dsh-calendar](../../plugins/alonefu--dsh-calendar-plugin/INSIGHT.md)

[![npm 30d 6,032](https://img.shields.io/static/v1?label=npm+30d&message=6%2C032&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-calendar)

> **用途**：已有Markdown日记/Tasks语法的用户在会话旁查看日历、时间块和待办，减少切换编辑器；合格交付是原文件正确更新且其他编辑不被覆盖。

> **亮点**：以同一Markdown为真源将日历操作和DSH上下文连接，避免导入副本；写回保留行尾/BOM/任务元数据，比直接重写整篇更有针对性。日历/Tasks语法来自既有生态，业务角色仍是原用户。

> **思考**：乐观并发保护是否强制覆盖所有写者？mutateTaskLine仅当body.expect为string才检查，未提供expect仍可写；锁只约束本插件请求，Obsidian等外部编辑不共锁，从读到rename存在覆盖窗口。日期isIsoDate只限月1–12/日1–31，2月31等可被接受。回读本行正确不证明文件其他行没有丢失。

> **建议**：强制文件摘要/原行版本凭据并在写前再核整个文件，冲突返回差异而不覆盖，可能减少多编辑器丢更新。用缺expect、外部插行/改其他行和非法日期反例，要求拒绝冲突且合法任务元数据不变；若仅同插件串行通过不算外部并发保证。

<a id="plugin-1359145352-root"></a>

## [dsh-callout](../../plugins/aafff623--dsh-callout/INSIGHT.md)



> **用途**：长技术回答中让警告、前提和关键结论更容易被读到；交付物是展示增强，原会话Markdown保持可读。

> **亮点**：使用可移植Markdown标记而非修改存储格式，补上宿主普通引用块的语义可见性；Host格式约定与展示识别对齐。核心是受控展示升级与可逆DOM所有权，不能视为风险检测或业务安全能力。

> **思考**：彩色warning来自谁的判断？类型由模型输出，渲染器不判断命令危险性，也不强制每回复最多一个卡片；漏标危险操作仍普通显示。DOM识别依赖助手/Markdown结构，重渲染或其他插件共同改文本时必须避免恢复旧内容；源码做所有权条件判断但未真实宿主验证。

> **建议**：为高影响提示附可展开的“触发依据/影响对象”而保持原Markdown可读，可能比仅颜色提高读者定位损失对象的正确率。用相同危险命令说明做盲测，比较理解正确率与阅读时间；若只增加醒目程度而未减少误解，不成立。

<a id="plugin-1339332869-root"></a>

## [dsh-chat-width](../../plugins/764475881--dsh-chat-width/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/764475881/dsh-chat-width)

> **用途**：仍用 DSH 0.1.7 前 web 版本、希望在宽屏调节正文宽度的用户。

> **亮点**：旧版把一个宽度变量、右缘拖拽和持久化组成协调调宽路径；相对用户手工改 CSS 有便利。新版原生实现不属于插件增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：原生检测依赖 DOM 特征；cleanup 移除 style 与把手，却未撤销旧版路径写在 root 上的内联变量，热禁用后可能残留宽度。未在本轮复现。详见[Q03](#research-q03)。

> **建议**：可用宿主版本/公开能力与 DOM 双门控，并在卸载时仅撤销本实例内联变量；以旧版、新版和冲突 DOM 比较误让位、重复 UI 与残留。当前未实现。详见[Q05](#research-q05)。

<a id="plugin-1421963463-root"></a>

## [dsh-chatgpt-style](../../plugins/137--dsh-chatgpt-style/INSIGHT.md)



> **用途**：习惯居中聊天版式的用户希望改善长文本阅读和切换模型思考档位，验收是内容不丢失、输入操作正常。

> **亮点**：client.js注入CSS并用MutationObserver装饰完成后的文本，检测data-streaming避免修改流中节点；档位通过宿主modelDirectories读取和提交。

> **思考**：复用宿主模型目录比维护另一套配置可靠，但视觉强调不构成事实已验证，绿色结论仍需读者核实。

> **建议**：先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。

<a id="plugin-1389469406-root"></a>

## [dsh-clean-desktop-shell-pro](../../plugins/aicksion--dsh-clean-desktop-shell-pro/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aicksion/dsh-clean-desktop-shell-pro)

> **用途**：用户希望双击进入原生窗口并清楚区分窗口退出、本地服务停止与短暂网络不可达。

> **亮点**：明确fork原版，增量集中在后端自动启动、退出生命周期和并行启动；Electron外壳与大量恢复机制来自原版，不能把整套桌面封装全计原创。

> **思考**：端口响应能否认定目标后端可用？probeState把<500视alive、非401视authenticated，不能证明页面/版本/会话可用；外部既有进程的所有权与停止边界需实际验。README冷启动更快未有本轮测量。

> **建议**：由cause分离推导，可增加宿主版本/实例ID的ready握手及后端所有权凭证，只允许停止自己启动的实例。未验证；错误服务占端口、外部后端、短断网和真实子进程退出应呈不同状态且不误停。

<a id="plugin-1378742722-root"></a>

## [dsh-client-ui-aqua-patched](../../plugins/aliww2468--dsh-client-ui-aqua-patched/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched) [![npm 30d 1,116](https://img.shields.io/static/v1?label=npm+30d&message=1%2C116&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-client-ui-aqua) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-client-ui-aqua)

> **用途**：使用DSH0.1.2-rc.1并希望沿用Aqua外观的用户。

> **亮点**：fork增量是恢复已有视觉能力可加载/可关闭，并明确源/产物修补归属；不将上游完整主题体量或视觉机制算本fork创新。

> **思考**：REPAIR明确lib手工补、src仅镜像且未在独立工具链typecheck，固定src阅读不自动证明与所有发布bundle行为一致。对0.1.2-rc.1的作者验收不能外推0.2.x，旧settings.register接口尤其需另核。

> **建议**：未验证假设：给模块表、keyed slot和settings namespace写声明式版本适配探针，并生成src/lib一致性材料，可减少手补漂移。以目标/新宿主和重建bundle核开关可达、释放和差异；无法重建时保留产物修补限定。

<a id="plugin-1358821276-root"></a>

## [dsh-commandcode-usage-inline](../../plugins/345420242--dsh-commandcode-usage-inline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/345420242/dsh-commandcode-usage-inline)

> **用途**：Command Code用户在发起请求前查看额度和重置窗口，避免切到单独账户页面。

> **亮点**：相对作者指出的侧栏用量面板，增量是把额度缩到模型选择旁的徽章，详情按需展开；复用provider认证与report接口，避免重复实现账户API。主要是界面适配贡献。

> **思考**：active账户缺失时选首个configured账户，可能与实际请求轮换账户不同；“剩余”是report快照，不是本次请求额度承诺。外部provider Remote形状或挂载顺序变化也会让纯界面插件失效。

> **建议**：已用对应Command Code provider的用户可评估；多账户轮换时核对active标记，勿据首账户默认值作预算决定。

<a id="plugin-1334850903-root"></a>

## [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)

> **用途**：面向在DSH Web会话写长prompt/多行草稿、觉得默认输入框过矮的用户。插件只在conversation.input.right放展开按钮，70vh书写视图、最小300px区域并切换普通Enter为换行；不是新编辑器、草稿备份或Agent工作流能力。

> **亮点**：借官方slot/data属性调整高度和Enter，并在DOM重建后恢复展开；只存布尔状态，host无功能/外部请求。详见[Q02](#research-q02)。

> **思考**：样式只第一root却键盘绑所有seat，菜单仅seat内检测；Lexical原生换行/撤销依宿主；全局observer与强Set旧seat可能累积。兼容表非操作验收。详见[Q03](#research-q03)。

> **建议**：可探索slot实例root一致绑定/失效seat清理与视口高度clamp，以多root/菜单/IME和重建对照行为与资源；未实现。详见[Q06](#research-q06)。

<a id="plugin-1335236592-root"></a>

## [dsh-computer-use](../../plugins/988hj7tczd-oss--dsh-computer-use/INSIGHT.md)

[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)

> **用途**：适合没有稳定业务API、需要观察原生/Canvas应用后用鼠标键盘完成明确任务的DSH用户。基线手工桌面操作或裸cua-driver命令；插件把AX/截图观察、动作目标与可见虚拟光标、按需视觉模型接成12个模型工具。合格结果应重新观察并核业务变化，driver返回delivered/插件ok不是业务成功证明。

> **亮点**：把原生driver接入DSH十二工具与附件/视觉路由，提供局部目标/时效/前台单次审批和可见轨迹；不是新桌面引擎。详见[Q01](#research-q01)。

> **思考**：元素click路径忽略ttlMs、snapshot与driver session全局共享，compact/zoom图像无完整变换绑定，密码/危险词仅有限element标签；ok不能当安全业务完成。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：可探索逐Agent绑定捕获时刻/窗口/scale的动作凭据及统一拒绝/unknown效果，按假driver交错矩阵证伪；未实现。详见[Q06](#research-q06)。

<a id="plugin-1342948215-root"></a>

## [dsh-custom-plugin](../../plugins/alexpeng07--dsh-custom-plugin/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,238](https://img.shields.io/static/v1?label=npm+30d&message=2%2C238&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)

> **用途**：希望集中管理本地会话资料和个性化设置的DSH用户。

> **亮点**：将用户便利数据归为统一可备份状态，并把凭据从公开state投影剥离；价值在本地操作一致性，Mermaid/计价/外观来自成熟方法，不视为新的交付机制。

> **思考**：credentialStore.set失败时明确退回state.apiKey明文，saveStateFile普通JSON写入未显式0600；“备份无密钥/前端不返回”不等于磁盘不落密钥。扫描/计价依赖宿主usage与价格，不能把消费数字当项目真实成本或成果。

> **建议**：未验证假设：凭据写失败默认拒绝持久化并给可选明确本地权限方案，可避免用户误以为已用系统密钥库。以凭据不可用、只读状态、备份/导出及重启核秘密落点和恢复行为；发现秘密进入备份即否定。

<a id="plugin-1334274281-root"></a>

## [dsh-cyber-particle](../../plugins/aks1st--dsh-cyber-particle/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-cyber-particle)

> **用途**：个人用户美化 Web 界面；纯装饰，不改变模型或业务流程。详见[Q01](#research-q01)。

> **亮点**：无需 Host 路由即可提供双语可调的穿透式粒子背景。详见[Q01](#research-q01)。

> **思考**：prefers-reduced-motion 命中后初次不启动，但页面可见性恢复无条件 start；损坏本地配置直接入计算。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证方向是持续减动效监听、恢复配置校验和低帧率/静态模式，以真实帧耗和后台恢复验收。详见[Q05](#research-q05)。

<a id="plugin-1414017637-root"></a>

## [dsh-dictation-hotkey](../../plugins/andyyang12345--dsh-dictation-hotkey/INSIGHT.md)

[![npm 30d 97](https://img.shields.io/static/v1?label=npm+30d&message=97&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dictation-hotkey) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dictation-hotkey)

> **用途**：需要快捷语音输入的用户，合格结果是文字进入预期会话且可在发送前检查。

> **亮点**：相对点麦克风，增量是热键录音状态机、原生draft插入与诊断；识别引擎归DSH语音bundle，无独立模型能力增量。

> **思考**：异步识别文字归属是否稳定？返回后取this.active()可能是新挂载会话，旧span冲突又以当前span回退；切会话期间可能插到新目标。cancel处理capture但转写传新AbortController未保存，不能据取消录音声称已取消推理。

> **建议**：由录音seat与异步结果分离推导，可将transcript绑定录音开始时会话/draft代次，目标变更则先入待确认缓冲，持有abort token。未验证；识别延迟期间切会话/改草稿/失焦应不误发，允许用户选择落点。

<a id="plugin-1342915339-root"></a>

## [dsh-discord-richpresence](../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence)

> **用途**：希望向 Discord 联系人展示工作状态的桌面用户，而非需要团队任务追踪的部署。

> **亮点**：Host 聚合活动信号，通过本地 Discord RPC 更新文案；丰富模式按最短展示间隔轮换数据。

> **思考**：减少手动改状态，但不能证明专注度或工作产出；企业环境应先确认活动公开政策。

> **建议**：先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。

<a id="plugin-1332642596-root"></a>

## [dsh-douyin](../../plugins/anacondakc--dsh-douyin/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AnacondaKC/dsh-douyin)

> **用途**：用户在聊天界面内观看视频；合格体验是可控播放、回放同一内容且关闭后停止下载。

> **亮点**：相对iframe随机流，增量是host解决重定向不可见与客户端同URL回放、按需挂载；视频供给和内容来自第三方，不是抖音官方账号集成。

> **思考**：同URL是否保证可持续回放？签名/过期链接、内容替换与浏览器解码会影响重播；解析器检查首跳和DNS不能保证浏览器后续跳转链/内容安全。自定义web源允许嵌入还受对方CSP约束。

> **建议**：由直链历史推导，可给历史记录添加解析时间、到期/内容标识并在失效时明确提示，不用重新随机内容冒充重播。未验证；过期URL与同URL换内容时应识别失败，比较回放一致率和额外请求数。

<a id="plugin-1423040689-root"></a>

## [dsh-douyin-webview](../../plugins/535408248-oss--dsh-douyin-webview/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/535408248-oss/dsh-douyin-webview)

> **用途**：想在DSH Desktop内查看抖音网页的人，将视频窗口与当前工作界面并排；不是内容采集、自动剪辑或模型工具。

> **亮点**：相对普通iframe，本插件复用Desktop现有浏览器guest租约承载站点，把可拖动缩放与面板内全屏组合到DSH侧栏。guest安全策略属于宿主主进程，视频与登录属于网站，本插件增量是租约生命周期、布局与Fullscreen模拟。

> **思考**：manifest标web是否意味着浏览器版可用？实际依赖dshDesktop.browser bridge，普通Web只有说明；主进程租约、partition和允许导航规则未包含在本仓库，不能从注释认定隔离。固定Chrome/131 UA和注入Fullscreen shim还会受站点改版影响；同一guest处理弹窗导航，离开抖音后的行为需宿主约束核对。

> **建议**：待验证假设：建立仅报告能力的guest兼容探针，在加载前检查bridge版本、租约约束与Fullscreen支持，可提前解释宿主升级后的失败。依据是当前桥能力检查与重挂最多3次的恢复路径，未实现完整探针。跨两个DSH版本和浏览器版对照加载/关闭/重载，测残留lease、错误定位与恢复次数；探针不能主动放宽主进程策略。

<a id="plugin-1414492607-root"></a>

## [dsh-draft-attachments](../../plugins/2026heshao--dsh-draft-attachments/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

> **用途**：适合经常带图片或文件准备问题、期间切换会话的用户；合格结果是未发送附件按原顺序恢复且发送后不再出现。

> **亮点**：相对宿主仅内存附件和用户手动重新上传，插件把字节与元数据按 sessionId 保存，在重新挂载时通过官方入口重建草稿而不是 patch 核心函数。这是有针对性的流程修补，价值在减少中断后的准备重做，不是新的数据库或上传协议。

> **思考**：决定贡献成立的是“恢复”和“空集合清除”是否有一致的顺序。源码中恢复 effect 异步 loadDraft，另一个 effect 同时观察当前空 attachmentIds 并安排删除；恢复仅看 liveInputRef 和 restored 标记，未发现跨两个操作的持久化代次协议。常规快速读盘可能正常，浏览器慢存储和快速切换应作为证伪场景，当前不能直接断言必丢。

> **建议**：可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。

<a id="plugin-1333975935-root"></a>

## [dsh-drag-and-drop](../../plugins/akiracod--dsh-drag-and-drop/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKIRACOD/dsh-drag-and-drop)

> **用途**：在 DSH Web 拖入本地文件或目录，以原路径交给后续 Agent 工具。

> **亮点**：兼顾非图片路径 chip 和图片原生附件，免手输路径；详见[Q01](#research-q01)。

> **思考**：隐藏路径唯一元数据候选可静默选错；pending不绑定拖入session，切会话可能把路径放入新会话；Host搜索根/候选需外围授权而局部遍历上限不是总IO预算。均为静态控制流核查，未作越权或错投复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：可探索绑定拖入session与Host授权根的来源确认交接，统一候选/摘要IO预算；同名诱饵、异步切换与取消反例若仍错路径/错会话则反证。未实现。详见[Q05](#research-q05)。

<a id="plugin-1335791040-root"></a>

## [dsh-draw-gacha](../../plugins/aik358--dsh-draw-gacha/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-draw-gacha) [![npm 30d 857](https://img.shields.io/static/v1?label=npm+30d&message=857&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-draw-gacha) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-draw-gacha)

> **用途**：个人用户用抽卡动画消解模型回答等待；结果不代表模型质量。详见[Q01](#research-q01)。

> **亮点**：将消息发送、流式文本特征和动画游戏化结合，且不保存完整 reasoning。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：落地延迟回调未捕获当前 attempt，关掉旧局后立即开新局可能提前揭示；词面分数不可当能力度量。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证修正包括 attempt 捕获、过期状态清理、档位文案对齐和轮询节流；需真实宿主计时/性能验证。详见[Q05](#research-q05)。

<a id="plugin-1335766616-root"></a>

## [dsh-effort-slider](../../plugins/2768651338--dsh-effort-slider/INSIGHT.md)

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) [![npm 30d 1,403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)

> **用途**：频繁调档且需要自定义模型在目录显示思考选项。详见[Q01](#research-q01)。

> **亮点**：把可视滑块和宿主模型方言声明接合，少手动改配置。详见[Q01](#research-q01)。

> **思考**：显示五档不证明端点支持，供给持久配置无卸载恢复，值等推归属与快速选择乱序需核。详见[Q03](#research-q03)。

> **建议**：研究注入所有权/原值比较恢复、端点能力契约及最后意图选择队列，比较错档与恢复成本。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1422380986-root"></a>

## [dsh-file-handover](../../plugins/7gzgn--dsh-file-handover/INSIGHT.md)



> **用途**：浏览器上传或桌面应用打开文件时，Agent已触发系统对话框，需要可靠递交指定文件；合格结果还要由应用回读实际收到的文件，不能只看对话框关闭。

> **亮点**：相对盲打路径和Enter，增量是将等窗口、结构识别、输入、逐字回读与确认组成可诊断调用，绕过中文输入法污染。Win32/UIA与剪贴板均为系统能力，插件贡献在前置校验与失败保留现场。

> **思考**：显式文件路径是否也意味着显式目标窗口？源码在所有#32770窗口中选择第一个含文件名控件者，expectTitle仅可选且不绑定调用方PID/句柄；记录pid不等于校验归属。因此单窗口场景有力，多文件对话框并存时仍可能递给错误应用，不能把“只点选中对话框”泛化为“选中了正确对话框”。

> **建议**：由候选窗口诊断与目标归属缺口推导，可要求触发方先给PID/句柄与创建时间，递文件只接受该窗口，候选不唯一时停下。未验证假设是减少跨应用误投，而不显著增加单窗流程成本。并行打开两个同标题对话框，若仍不能稳定绑定触发窗口则否定。

<a id="plugin-1413882487-root"></a>

## [dsh-forget-session](../../plugins/2026heshao--dsh-forget-session/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-forget-session) [![npm 30d 283](https://img.shields.io/static/v1?label=npm+30d&message=283&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-forget-session) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-forget-session)

> **用途**：面向明确需要删除本地会话痕迹的用户；交付物是会话不再出现在列表且对应本地工件已清理的可核查结果。

> **亮点**：相对归档仅改变可见性及手工删日志，贡献在把会话活体、工作区记账、日志和投影几个所有权串起来，先释放写句柄再删盘并观察迟到重建。该恢复编排适合解释“列表消失却重启复活”的问题，不是通用安全擦除。

> **思考**：调用返回ok:true能否作为彻底遗忘证明？host多步骤失败收集warnings后继续，并在未来守卫中补删；投影总表采用读改写而非与宿主共用事务。支持正常占用恢复不代表每一步必成功，客户端摘要也只反映当前结果。验证需跨守卫窗口与重启，不能只看行消失。

> **建议**：只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。保留告警并核对工件清理，不把成功提示当数据全部擦除证明。

<a id="plugin-1407166868-root"></a>

## [dsh-fullscreen-input](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)

> **用途**：长文本、中文输入法和附件引用混合输入，希望Enter始终换行的用户。

> **亮点**：避免另存一份草稿的同步分叉，直接沿用宿主队列与提交；针对引用投影损失做带版本的恢复。不是新调度器或发送协议。

> **思考**：textarea是富文本的较贫乏投影，恢复依赖insertReference、范围及draftRev；缺能力时静默降级可能保留文本却丢引用语义。submit无返回确认后便关闭面板，动作未抛异常不等于消息已接受。

> **建议**：未验证假设：提供宿主原生富草稿编辑事务与引用恢复状态，可减少长文本引用丢失。以多引用编辑、附件上传、会话切换、IME和锁定样例比较引用身份及队列实际结果。

<a id="plugin-1412623357-root"></a>

## [dsh-gotify-notify](../../plugins/ahyi8--dsh-gotify-notify/INSIGHT.md)

[![npm 30d 398](https://img.shields.io/static/v1?label=npm+30d&message=398&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify)

> **用途**：用户离开DSH窗口仍需知道何时查看结果或回答问题，成功推送不等于人已读或任务验收。

> **亮点**：相对单一完成通知，增量是用户介入提问和结束原因分流，复用DSH凭据引用与Gotify分发。并未覆盖宿主权限审批或建立送达确认。

> **思考**：等待输入是否可靠送达？问题在发送前登记去重，失败仍不再推同一调用，重启/500上限清空又可重复；turn/end未见同类去重。默认服务地址和正文含会话标题/目录需用户核对数据去向。

> **建议**：由发送前去重取舍推导，可区分待发送/已接受/已读，并用有界持久outbox提供可见重试。未验证；网络断开/恢复、宿主重启后对同事件测漏重报和端侧可见次数。

<a id="plugin-1422121370-root"></a>

## [dsh-gui-guard](../../plugins/7gzgn--dsh-gui-guard/INSIGHT.md)



> **用途**：已从截图/OCR取得坐标的Agent需要在Windows应用准确执行点击或输入；合格结果是目标控件产生预期状态变化，而不是鼠标移动到请求坐标。

> **亮点**：相对直接mouse_event与SendKeys，增量是把最小化、激活、坐标口径和诊断统一封装，给调用方保留requested/applied证据。它是输入可靠性适配层，不提供OCR或业务验收。

> **思考**：“可靠性层”会否把失败前提继续执行为ok？Ensure-Foreground返回isForeground，但click/type不以false阻断；click的ok=true也不取决于cursorMatches，更没有控件效果回读。全局坐标直接除以目标窗口scale在混合DPI多屏布局是否正确亦需验证。因此诊断比盲点有增量，但不是原子成功保证。

> **建议**：由前台诊断已存在而未作门禁推导，可把动作拆为prepare令牌与执行后条件：前台不成立拒绝发送，坐标绑定截图时刻/窗口矩形，动作后由调用者检查控件状态。未验证假设是降低误点而非只增日志。用焦点抢占与混合DPI双屏对照，若错误动作率不降则否定。

<a id="plugin-1357066651-root"></a>

## [dsh-harness-chat-control](../../plugins/1985899182--dsh-harness-chat-control/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)

> **用途**：开发者需要从主会话引用一段内容发起侧聊，并把局部问题与主线区分；合格交付是可追溯引用和保留身份的会话交互。

> **亮点**：作者提供会话操作集合。相对手工复制文本再开子会话，增量在于引用、侧聊和模型选择贯通；源码明确借助 Better Sidebar，并在 vendor 保存来源声明，不能把上游侧栏归为原创。自己补的是宿主未暴露的地址化侧聊与编辑接缝。

> **思考**：核心质疑是界面中的“编辑”能否与模型看到的 surface 一致。原生历史与投影视图分离，插件为 replacement 做专门处理，说明不是普通文本编辑；多次编辑、重载后引用及图片附件一致性仍需真实宿主验证。

> **建议**：适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。

<a id="plugin-1334318461-root"></a>

## [dsh-heatmap](../../plugins/283gawin--dsh-heatmap/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap)

> **用途**：个人观察使用/提交趋势，需明确统计范围和估价，不能当产出或账单证明。

> **亮点**：统一usage/model、Git和常驻趋势入口，纯聚合可核，增量在可见性/接线而非计费或生产力算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：未知模型默认估价且后缀override可能失效，失败/重复仓库缺覆盖说明；enabled不停止路由/扫描，估值非账单。详见[Q02](#research-q02)。

> **建议**：可探讨覆盖/价格版本收据，规范化仓库和模型/计费时间、未知分级及明确禁用/清理，维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1335806472-root"></a>

## [dsh-im-qq](../../plugins/988hj7tczd-oss--dsh-im-qq/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq) [![npm 30d 280](https://img.shields.io/static/v1?label=npm+30d&message=280&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-im-qq) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-im-qq)

> **用途**：受权QQ用户远程请求宿主Agent，群/频道共享会话，不是逐成员隔离。详见[Q01](#research-q01)。

> **亮点**：把QQ文本与原Agent/preset、会话持久映射、回复/审批生命周期组合，降低自写远程桥成本。详见[Q01](#research-q01)。

> **思考**：默认白名单通配、群级ACL、缺身份按钮放行和群slash无作者核对削弱仅发起者审批；恢复/回复不等恰好一次。详见[Q02](#research-q02)。

> **建议**：bot/chat/event/author/turn绑定的远程任务收据，统一审批/去重/原子generation和可取消outbox；以群越权/重放/未知送达反例检验，未验证。详见[Q07](#research-q07)。

<a id="plugin-1334134226-root"></a>

## [dsh-inline-images](../../plugins/3403473060--dsh-inline-images/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/3403473060/dsh-inline-images)

> **用途**：需要在 DSH 对话正文预览本机截图或生成图片时自动展示，省去手动打开文件。详见[Q01](#research-q01)。

> **亮点**：对话正文图片、尺寸面板和灯箱一体化。详见[Q01](#research-q01)。

> **思考**：URL 中 token 可见且请求 p 未绑定已确认文件；回环地址对异机浏览器可能失效。详见[Q02](#research-q02)和[Q03](#research-q03)。

> **建议**：用会话/路径绑定的短期标识与相对 URL，同时改善访问边界和远程客户端可用性；以改路径/重放/本机异机对照证伪。详见[Q05](#research-q05)。

<a id="plugin-1359145374-root"></a>

## [dsh-keyboard-manager](../../plugins/aafff623--dsh-keyboard-manager/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager)

> **用途**：偏好键盘操作的DSH Web用户快速切换布局，保留better-sidebar编辑器的保存操作；交付物是界面开关。

> **亮点**：把原生layout服务与可选better-sidebar按钮放在同一键盘动作路由，避开对React内部状态的直接修改；物理键码冲突时回默认表。增量是输入便利与兼容适配，不是新的会话或业务工作流。

> **思考**：缺标记是否总是安全无动作？右栏找不到带right语义按钮会取最后一个按钮，插件DOM变化时可能点错。即使action找不到目标，外层已preventDefault，原浏览器行为仍被消费；严格Ctrl也未对一般文本输入框让路。配置只启动时拉一次，失联静默默认可能与用户预期不同。

> **建议**：以稳定的具名动作服务取代“最后按钮”回退，并只在动作被确认处理后消费键盘事件，可能减少兼容误触。对按钮顺序变化、目标消失、编辑器焦点和配置请求失败的固定DOM样例检查不误点/不吞键；若服务不可用应显式禁用该动作。

<a id="plugin-1424475406-root"></a>

## [dsh-language-guard](../../plugins/58fly--dsh-language-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)

> **用途**：长对话含英文工具说明与代码时，用户希望固定回答语言；合格交付是保留原始代码/引用而让说明遵循目标语言。

> **亮点**：把重复的“用某语言回答”组织成可热配置的宿主提示策略；稳定section、纯语言解析和未设置哨兵让迁移不覆盖老用户语言。增量是配置/装配机制，不是模型语言能力，也不能因文案声称最高优先级就获得更高指令权限。

> **思考**：约束是否作用在正确会话与正确层级？state.js的languageOverride为模块单值，/language处理器不接session ID，所谓“本会话”临时切换可能影响同进程其他会话。mapPreference把所有zh映成zh-CN；head还要求覆盖AGENTS/用户语言并不解释冲突。D档虽标notice而非冒充真实用户，仍额外进入模型上下文；无法证明不可见推理遵守。

> **建议**：将临时覆盖改为session作用域、提示只约束用户可见输出且显式保留任务语言例外，可能在减少跨会话串扰的同时保持语言稳定。用两个会话分别设ja/zh-TW并交错提问，加入多语引文与用户要求翻译的反例，统计串扰和错误改写；若只隔离设置但输出漂移不变，应分别报告配置收益和模型效果。

<a id="plugin-1366370702-root"></a>

## [dsh-llm-balance-siderbar](../../plugins/aliengene--dsh-llm-balance-siderbar/INSIGHT.md)

[![npm 30d 859](https://img.shields.io/static/v1?label=npm+30d&message=859&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)

> **用途**：多供应商用户判断当前模型路由的余额/额度状态，不能据此核算账单。

> **亮点**：把异构余额/额度统一成可解释状态，并按宿主实际路由而非所有机器凭据探测，减少无关查询。不是通用计费或消费限制器。

> **思考**：cache按probe.id而非route/credential身份，hostFor只选首个匹配route；多个相同provider不同key可能被同一快照标成都覆盖。凭据或route改动后TTL内还可显示旧账户值，影响“当前账户”判断。

> **建议**：未验证假设：缓存键绑定route与非秘密账户指纹，凭据变更使快照失效，可避免多账户误归属。以两条同厂商不同key、换key、失败重试核每行来源与新鲜度；无法区分时明确单账户合并。

<a id="plugin-1337350700-root"></a>

## [dsh-memory-setup](../../plugins/863683348--dsh-memory-setup/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup) [![npm 30d 155](https://img.shields.io/static/v1?label=npm+30d&message=155&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-memory-setup) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-memory-setup)

> **用途**：面向DSH用户保留偏好、项目规范、工作流和错误教训，原有办法是手工README/CLAUDE.md及每次重新提示。插件用工作区JSON、工具、changelog/备份/快照与systemPrompt可变context接线，另有知识条目BM25和可选向量检索。合格结果应是正确工作区、当前且有依据的记忆帮助真实任务，条目数/hits不是改善效果。

> **亮点**：把可读工作区记忆、工具/提示注入、规则提取和检索/快照组合，减少每次重述的接线；Jaccard/BM25/cosine非新算法。详见[Q01](#research-q01)。

> **思考**：冷KB调用未定义emptyKnowledge，通用更新可沿原型链；注入全局共享、分离revision非原子CAS，错误fix可晋升、脱敏/冷层未接线，限制高信任记忆主张。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：可探索按工作区的不可变版本快照、typed patch与锁内事务、效果确认晋升及统一隐私策略，用假fs交错矩阵证伪；未实现。详见[Q06](#research-q06)。

<a id="plugin-1397477851-root"></a>

## [dsh-mimotts](../../plugins/1497105876--dsh-mimotts/INSIGHT.md)



> **用途**：希望听回复的用户需要可重放音频和便捷控制，验收包括文字读音、播放完成与敏感文本发送范围。

> **亮点**：Host合成路由先过connection.requestRejection，读取有限文本并调用TTS端点；客户端提交消息文本并接收WAV，语音记录独立保存。

> **思考**：消息动作行和历史让朗读更连贯；声音自然不代表文本正确，模型回复内容仍可能有误。

> **建议**：先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。

<a id="plugin-1333440937-root"></a>

## [dsh-monitor](../../plugins/abnerai--dsh-monitor/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AbnerAI/dsh-monitor) [![npm 30d 823](https://img.shields.io/static/v1?label=npm+30d&message=823&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-monitor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-monitor)

> **用途**：已有本地消息源，希望Agent空闲仍响应的场景。详见[Q01](#research-q01)。

> **亮点**：用宿主Agent状态选择followup/inject，把无需模型忙轮询的源监听与显式解除接在工具中。详见[Q01](#research-q01)。

> **思考**：半行/轮换与命令重叠会误判增量，list/stop不核owner、shell直接用宿主权限，前移cursor与delivered不能证明收妥。详见[Q02](#research-q02)。

> **建议**：owner能力+完整行世代+单flight/ack游标/outbox的watcher，以拆行/乱序/跨会话/拒收/重启反例检验，未验证。详见[Q05](#research-q05)。

<a id="plugin-1336571882-root"></a>

## [dsh-need-finder](../../plugins/863683348--dsh-need-finder/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder) [![npm 30d 841](https://img.shields.io/static/v1?label=npm+30d&message=841&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-need-finder) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-need-finder)

> **用途**：面向只知道“想提醒/远程看/补记忆”等能力需求、不了解插件名的DSH用户。两个工具搜索内置84候选与8配方，返回词法分、理由、安装命令文本；不会安装、不扫描本机已装插件，也不动态检查候选安全/兼容/版本。

> **亮点**：将本地双语词法/标签过滤、多样化与有序配方初稿接入两模型工具，返回命中字段供进一步探索。详见[Q02](#research-q02)。

> **思考**：84条英文描述都只是name、中文描述全空，分数是词重合非值得安装；固定采样无全量保证，配方只排序文本不安装/解依赖，明细截断。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索有版本/来源的用途与硬约束元数据、完整评分解释及保目标的配方计划，对照误漏荐/维护成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1335557891-root"></a>

## [dsh-neo-skin](../../plugins/0nt-one--dsh-neo-skin/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) [![npm 30d 101](https://img.shields.io/static/v1?label=npm+30d&message=101&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-neo-skin)

> **用途**：用户想在保留系统浅深主题切换下自选更高对比、更硬朗的视觉皮肤。

> **亮点**：复用主题 token 服务与设置插槽，而非覆盖整个原生主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：大量 !important 与后缀类名选择器易随宿主结构变化或其他插件样式冲突；缺本轮视觉验收。详见[Q03](#research-q03)。

> **建议**：改用稳定语义 token/插槽并接入宿主设置可降低样式耦合、跨端设置漂移；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1335704653-root"></a>

## [dsh-perlica-ding](../../plugins/117bs--dsh-perlica-ding/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) [![npm 30d 320](https://img.shields.io/static/v1?label=npm+30d&message=320&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding)

> **用途**：适合在本机运行DSH、工作中切到别的窗口但希望听见计划/回合收尾/待回应/错误的用户。四个本地音效与音量设置是注意力提示，普通纯查询拟保持静音。角色主题是呈现偏好，不是技术或业务效果证据。

> **亮点**：把四档Agent事件、平台音频argv、PCM音量与可持久设置接在一起，减少切回窗口看状态。详见[Q02](#research-q02)。

> **思考**：done仅事件启发式，缺起点0比较/失败结果与root降级可误响；试听无cwd、即回不等可听；大/畸形WAV与无界播放/缓存及桥认证边界需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索agent-turn原因与音源一致、播放器阶段明确的有界通知收据，核误响/漏响/资源；进程成功仍非人已听到，未实现。详见[Q06](#research-q06)。

<a id="plugin-1378097401-dsh-live2d-pet"></a>

## [dsh-pet-live2d](../../plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)

[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 7,358](https://img.shields.io/static/v1?label=npm+30d&message=7%2C358&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pet-live2d)

> **用途**：希望获得会话状态提示与桌面陪伴的用户，合格表现是状态一致、透明画布不挡操作且自定义资源升级不丢失。

> **亮点**：相对纯静态桌宠，增量是会话相位与动作池、用户互动和可保存配置结合。渲染依赖Cubism/Pixi，随包角色是独立授权资产，不能归为插件原创。

> **思考**：“自改目录一个字不碰”是否由指纹保证？同步判断只比较pet.json，后续cpSync逐文件覆盖；用户只改同名贴图而manifest未变时未必受保护。Core下载仅长度与标记检查不是固定摘要验证，离线首次安装也需要外部运行时。

> **建议**：由manifest级判定推导，可保存每个随包文件摘要并做逐文件三方更新，冲突保留用户版本并给预览。未验证；分别只改贴图/音频/manifest再升级，若仍覆盖用户同名资源则否定。

<a id="plugin-1407379611-root"></a>

## [dsh-pinned-sessions](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)

> **用途**：经常跨多个工作区切换会话的DSH用户，需从一个平面入口快速找到已置顶会话。

> **亮点**：相对原生只在各工作区内部重排置顶，会话集合跨工作区聚合有明确导航价值；重用原生状态避免第二套置顶真相。DOM锚点portal是宿主缺少扩展槽位时的适配，不是新状态模型。

> **思考**：原生样式一致是否等于长期兼容？代码依赖data-slot及具体侧栏列表结构，找不到时隐藏，降低破坏性但功能仍消失；README前后对挂载位置和是否共享滚动有不同叙述，应该以当前源码和宿主实测为准。

> **建议**：已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。

<a id="plugin-1423966960-root"></a>

## [dsh-plugin-auto-answer](../../plugins/ak-blank--dsh-plugin-auto-answer/INSIGHT.md)



> **用途**：无人值守长任务不希望被低风险偏好问题卡住；合格行为要保留人工及时回答、取消与真实授权，不应把无回应变成所有决策同意。

> **亮点**：相对永远等待，增量是把超时与缺客户端情况转为明确可配置的答案流程，保留及时人答和取消。它不生成领域判断，推荐依据完全来自提问方标签。

> **思考**：推荐标签是否足以代表用户偏好或授权？普通问题不一定低风险，默认first/skip可能丢失必要信息；模型自己给推荐标签不是独立批准。auto-answer还不能关闭已有浏览器问题卡，界面仍像待答，人工后续输入与真实已继续状态可能混淆。

> **建议**：由协议plan-review分流推导，可只对白名单偏好类型自动答，并附machine-default来源及可撤销收据；授权/缺必需信息一律留人。未验证；用标签诱导、授权伪装普通问题、批量部分不可答与临界人答竞态测试，若错误同意未降则否定。

<a id="plugin-1389061748-root"></a>

## [dsh-plugin-crypto-ticker](../../plugins/18569663yz-web--dsh-plugin-crypto-ticker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)

> **用途**：希望在 DSH 工作时顺手看常用代币行情的个人用户；合格输出是标明来源、新旧状态的参考报价。

> **亮点**：作者主张免密钥行情卡片。相对浏览器行情标签页，增量是宿主集中获取、侧栏呈现与来源降级，减少重复切页；index.js 明确把趋势缓存与头部报价分开，是实用集成而非行情算法创新。

> **思考**：“多标签共享请求”只在缓存命中后成立：apply 的 fetch 路由在缓存过期时直接 await build，没有共享 in-flight Promise；同时到来的标签可能重复请求。collect 只需至少一个有效币就接受来源，因此不能把一次源成功理解为所有币均刷新；逐币 stale 才是边界。

> **建议**：适合参考性看盘；先检查当前来源和逐币 stale 状态，遇到来源切换时到交易平台复核价格。

<a id="plugin-1336084195-root"></a>

## [dsh-plugin-focus](../../plugins/863683348--dsh-plugin-focus/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-focus) [![npm 30d 867](https://img.shields.io/static/v1?label=npm+30d&message=867&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-focus)

> **用途**：面向在DSH里持续完成长任务、经历上下文压缩和跨会话交接的用户。普通todo记录下一步，focus板记录目标、硬约束和决定，以工作区内的MD让后续Agent能重新读取。它按工作区共享，不是每个会话私有或跨设备云记忆。

> **亮点**：以透明MD和标签把工作区笔记接到focus工具、会话投影及pre-step快照，减少压缩后手工提醒；不提供真相判断或新检索算法。详见[Q02](#research-q02)。

> **思考**：新增后裁剪到同条数，changed=false便跳过保存，默认60条满额后新增不持久化；无版本写入、无cwd跳过contains也限制承诺，未运行复现。详见[Q03](#research-q03)。

> **建议**：可探索稳定item ID、supersedes/CAS和约束优先注入收据，比较保全、违约、token与维护开销；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336663652-root"></a>

## [dsh-plugin-local-life](../../plugins/863683348--dsh-plugin-local-life/INSIGHT.md)

[![npm 30d 857](https://img.shields.io/static/v1?label=npm+30d&message=857&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-local-life) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-local-life)

> **用途**：对话中快速生成可复算的个人算术草稿；需明确币种、单位和实际交易条款。详见[Q01](#research-q01)。

> **亮点**：把常见日常算术的确定性 helper 接入 Agent，减少口算并统一提示假设；增量主要在工具化和工作流组合，非新算法。详见[Q01](#research-q01)。

> **思考**：loan 执行读取 schema 未声明的本金/利率/期限；compareUnitPrices 用数值数量直接比较 kg/g 等不同单位，可能错误标出最低价。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证方向是 action 判别式 schema 与维度单位契约，输出换算步骤和舍入差额，使用异单位、缺参数与负利率夹具做端到端对照。详见[Q05](#research-q05)。

<a id="plugin-1424219088-root"></a>

## [dsh-plugin-namecards](../../plugins/3tiga3--dsh-plugin-namecards/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)

> **用途**：安装插件较多的用户按自己的用途命名分组、查找并启停插件，交付是可迁移的个人管理布局。

> **亮点**：相对官方平铺列表，将个人解释与上游包元数据分离，允许用户本地维护备注和分组；导出含图标与布局便于迁移，不需要修改每个插件源文件。

> **思考**：名片覆盖可能遮蔽上游身份和说明，特别是同名备注；启停不是单纯展示操作，实际效果仍由官方manager与重启决定。HTTP仅检查loopback不能等同完整浏览器来源隔离，仍需核查部署代理的边界。

> **建议**：插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。

<a id="plugin-1336684098-root"></a>

## [dsh-plugin-recommend](../../plugins/863683348--dsh-plugin-recommend/INSIGHT.md)

[![npm 30d 733](https://img.shields.io/static/v1?label=npm+30d&message=733&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend)

> **用途**：面向只知道能力需求、希望在DSH内搜目录/找近邻替代/看分类详情的用户。工具recommend支持search/categories/detail/similar/refresh；只返回目录事实/词重合分，不执行安装、不研究源码或核候选安全/兼容。

> **亮点**：将1135条描述/tag目录的解释性词法、分类与相似探索接到模型工具，并提供显式固定源刷新。详见[Q02](#research-q02)。

> **思考**：live非空即全替换且无tag/版本，失败仍保旧live却提示embedded；解析类别子串/格式漂移可不完整，去重先保首项，分数不代表安全/值得安装。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索源版本/字段质量与差异可审的候选快照、按身份取高分与完整解释，比较错更新/召回/审查成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1394188597-root"></a>

## [dsh-plugin-session-colors](../../plugins/7vw58n3ftvq7cn89v--dsh-plugin-session-colors/INSIGHT.md)



> **用途**：并行处理多个会话的用户用颜色辅助定位；颜色是个人标记，不是任务状态或授权证明。

> **亮点**：相对仅凭标题找会话，贡献是持久颜色映射与低干扰悬停入口，宿主存储让多个浏览器共享读取。配色标签与乐观UI是常规设计，DSH增量是没有会话行slot时的DOM匹配与写入接线。

> **思考**：看到的颜色是否一定属于那一会话且已保存？同名会话按DOM序消费，排序/虚拟列表变化可错配；set先publish本地再PUT，失败只warn，没有待写队列重放，后续sync读宿主可能覆盖未保存颜色。因此“离线查看”和“离线修改可靠同步”不能混为一谈。

> **建议**：待验证假设：使用宿主稳定sessionId行标记代替标题，并为本地修改保存带版本的pending队列，可减少同名错色与断线丢修改。由标题序匹配和只warn失败推导，未实现。以同名排序、虚拟滚动、断网修改和两浏览器竞争对照，测错绑/丢写与冲突；宿主无稳定slot时应明确有限保证而非偷偷推断。

<a id="plugin-1422500224-root"></a>

## [dsh-profile-stylist](../../plugins/7gzgn--dsh-profile-stylist/INSIGHT.md)



> **用途**：用户修改自己代码托管账号的昵称、简介、链接与头像，先审草稿再填表，交付站点保存结果需回读确认。

> **亮点**：相对通用浏览器Agent临时猜选择器，增量是显式两站字段档案、先草稿后应用和头像素材/Canvas路径，把资料编辑组织成较窄操作。模型文案、浏览器登录与站点保存为上游能力，不能算插件独有保证。

> **思考**：点击保存是否等于正确账号资料已保存？confirm仅工具布尔参数，不是用户批准事件；脚本btn.click后置saved=true，未独立回读站点持久字段。浏览器当前登录谁就写谁，缺少预期账号绑定；DOM选择器验证注释也不能保证站点改版后行为。

> **建议**：待验证假设：应用计划绑定预期账号ID与字段/头像摘要，写后重新读取资料并逐字段核对，可减少错账号和点击成功但保存失败。由当前登录态依赖与saved点击标记推导，未实现。用切换账号、站点校验拒绝、部分字段成功三类对照，测误报成功和回滚负担；账号身份不可验证时应停在草稿。

<a id="plugin-1336538202-root"></a>

## [dsh-prompt-polish](../../plugins/1321928757--dsh-prompt-polish/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) [![npm 30d 347](https://img.shields.io/static/v1?label=npm+30d&message=347&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)

> **用途**：已有 DSH Web 模型配置、希望改写草稿且保留人工审阅的用户。

> **亮点**：在输入栏直接提供六模式重写、上下文与人工采用保护；详见[Q01](#research-q01)。

> **思考**：上下文发往选定 provider；工作区映射缺失时设置回退到最近/首个工作区，且超时未显式 abort 流。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：增加发送前 provider/上下文预览、只写确定关联工作区、超时主动 abort，可降低隐私与资源风险；待运行验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1341946801-root"></a>

## [dsh-question-nav](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,247](https://img.shields.io/static/v1?label=npm+30d&message=1%2C247&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)

> **用途**：长会话用户回看先前问题、定位对应轮次；交付物是问题导航和定位结果，不进行内容总结或问答。

> **亮点**：相比扫描当前DOM找问题，先建立独立于渲染窗口的事件投影，保持完整问题导航而不预先扩展聊天窗口；纯数据变换与注入式jump ports方便迁移。宿主缓存/分页能力归上游，圆点导航本身不是新业务流程。

> **思考**：“完整历史/全文”是否等于所有提问完整可达？projection的messageText只取content第一个块，后续文本块或首块为图片会丢提问；索引questions数组无上限，长会话每次追加复制。jump的deadline在await loadOlder之外检查，单次挂住仍可能超预算；isViewActive仅检查任意chat flow，不确认仍是原session。

> **建议**：为索引保留全部文本块但分页传输，并将跳转绑定session与绝对deadline，可能同时保持完整性和长会话响应。用首块图片+后续文本、多文本块、万轮历史、加载挂住和中途切会话案例，要求文本完整且不跨会话滚动；如内存或延迟未改善，应区分数据完整性与性能收益。

<a id="plugin-1344714660-root"></a>

## [dsh-receipts](../../plugins/988hj7tczd-oss--dsh-receipts/INSIGHT.md)

[![npm 30d 77](https://img.shields.io/static/v1?label=npm+30d&message=77&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-receipts) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-receipts)

> **用途**：适合个人回顾会话和工具活动；会话痕迹不能直接作为生产率、节省工时或业务影响证明。

> **亮点**：实际增量是将本地会话、工具调用和Git痕迹组织成可离线审阅的个人报告，支持压缩日志与失败跳过材料。相对手工翻日志更便于自省；这不是工时计费系统，Git提交与模型工作不能建立因果归属。

> **思考**：根约束接线有缺口：工具把越界project标unavailable却保留cwd，随后attachGitCrossCheck不检查状态，对所有非空cwd执行git -C log，可能仍读越界Git信息。工具调用也未传since/until，函数默认since=0/until=now，Git计数可能覆盖全历史。活动时长用首尾事件跨度，不等于连续劳动；redactPaths默认关且只去路径，不等于会话文本脱敏。

> **建议**：未验证假设：把日志时间窗和允许Git目标明确传给纯交叉核对接口，并区分活动跨度与可归因产出，可减少报告误导。用窗外提交、越界cwd、长空闲及并发会话夹具比较是否误读和重复计时；不推断节省工时。

<a id="plugin-1404720276-root"></a>

## [dsh-right-click-menu](../../plugins/al1ghtm3ter--dsh-right-click-menu/INSIGHT.md)



> **用途**：从聊天中的有效路径快速操作文件，保留非文件位置的浏览器原菜单。

> **亮点**：把文本路径转为实际文件动作并按能力降级，减少复制路径再找文件的步骤；不实现新的文件系统或系统应用协议。

> **思考**：主机只要求绝对路径，save-as可任意目标mkdir/copyFile覆盖，write-text同样无工作区realpath约束；信任栅栏是请求授权而非每个文件的能力限制。readTextFile先readFile全文件再截到1MiB，raw完全读取，显示限长不是内存限长。

> **建议**：未验证假设：每项操作携带会话资源授权、覆盖确认和流式限长读取，可减少越范围写入与大文件内存峰值。用跨工作区/软链接/已有目标/大文件核目标与权限、覆盖和峰值。

<a id="plugin-1410794267-root"></a>

## [dsh-RTL-chat](../../plugins/adilalmahmoud--dsh-rtl-chat/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat)

> **用途**：阿拉伯语等RTL文本阅读者希望调整答案方向同时不扰动侧栏与代码。

> **亮点**：贡献是窄作用域方向控制与代码例外，复用CSS双向排版和宿主slot；不是翻译或整套阿拉伯语本地化。

> **思考**：容器级RTL能否正确处理混合语言、表格与引用？CSS direction无法识别每段语义，可能改变标点和布局；BTN_CSS插入返回的disposer未登记，卸载RTL样式与按钮样式清理不同。

> **建议**：由容器方向例外推导，可按段落dir=auto并允许用户覆盖，代码仍显式LTR。未验证；混合数字/URL/列表对照人工阅读，错误顺序与切换次数应低于整容器RTL。

<a id="plugin-1412141303-root"></a>

## [dsh-session-path](../../plugins/439436269-ctrl--dsh-session-path/INSIGHT.md)

[![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-session-path) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-session-path)

> **用途**：需要让另一个Agent接续已完成会话的用户，合格交付是可读、有会话身份和截断说明的记录。

> **亮点**：相对只复制不可直接read的压缩日志路径，把日志转成可读交接文件是实质工作流增量；Markdown保留最近条目能适配接续。Zstd解压及路径工具是现成机制组合，不证明语义交接完整。

> **思考**：是否真的按预算保留最近上下文且内存有界？renderEntries倒序保留尾部，但renderJsonl正序累积直到预算耗尽，保留的是头部；writeHandoff先收集全部records/entries，逐帧解压不能推出整个导出内存有界。该源码反例影响长会话接续主张，尚未运行复现。

> **建议**：需要接续时优先检查Markdown导出及截断；JSONL预算语义与长日志内存问题确认前，不用作有界最新上下文保证。

<a id="plugin-1368115538-root"></a>

## [dsh-session-rename](../../plugins/9ashwin--dsh-session-rename/INSIGHT.md)



> **用途**：用户希望用需求ID或任务名定位会话，由Agent组织标题并调用工具；不做自动总结或业务状态管理。

> **亮点**：相对只有host API或人手标题入口，增量是把sessionTitle.rename暴露为模型工具，支持当前会话默认，零官方包import减少链接路径冲突。标题持久语义由宿主提供，不是插件新存储机制。

> **思考**：模型显式标题与用户手工标题是否应同等钉住？宿主rename会生成user来源标题并覆盖自动生成，插件不区分模型与人工意图；指定任意已加载session_id可改别的会话，未做“仅当前会话”的工具层限制。调用返回事件seq也不证明持久化已完成。

> **建议**：待验证假设：默认只允许当前会话，并把模型建议标题与用户固定标题区分来源，可减少跨会话误改和自动标题永久被压制。由任意loaded目标与显式user语义推导，未实现。用双会话、自动标题在途和用户已有固定标题对照误覆盖与找回成本；跨会话改名需显式目标授权。

<a id="plugin-1368581082-root"></a>

## [dsh-session-turn-eta](../../plugins/778672151--dsh-session-turn-eta/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/778672151/dsh-session-turn-eta)

> **用途**：等待长Agent任务的用户需要知道是否继续等待；合格交付是可校准的剩余时间和清晰结束状态，百分比动画本身不代表任务完成比例。

> **亮点**：相对仅显示已耗时或固定假进度条，增量是用会话自身历史做稳健速率与长度估计，纯投影不改会话事实。中位数/分位数是成熟统计，贡献在适配可重放事件与不提前宣告完成的显示约束。

> **思考**：历史步骤能否预测未来步骤数量和耗时？predict.ts首次步数先验为10，长任务超出历史时增加runway，混合速率仍无法看到未知工具等待；README称中位历史时长，而实现RATE_PERCENTILE为0.4。故动态百分比是模型估计，不是业务里程碑，失败轮也混入历史可能改变分布。

> **建议**：由纯事件投影与现有区间输出推导，可按工具等待/模型生成等步骤类型分别估计，并在分布漂移时降低显示置信度或只显示区间。相对持续延长总时长，这可能降低过度确定感；未验证。用按时间留出的混合任务校准区间覆盖率与用户等待决策，若覆盖不改善则保留简单模型。

<a id="plugin-1355639507-root"></a>

## [dsh-side-session](../../plugins/123dbl--dsh-side-session/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session)

> **用途**：主任务运行时，用户需要另外讨论独立问题，同时保留主会话上下文。

> **亮点**：/side-chat 调用 startContinuable 创建子会话，客户端在成功事件后比较子目录并打开新会话。

> **思考**：复用原生聊天视图避免维护第二套面板；便利不代表资源或权限完全隔离。

> **建议**：先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。

<a id="plugin-1352089397-root"></a>

## [dsh-soul](../../plugins/aliuyanfeng--dsh-soul/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,373](https://img.shields.io/static/v1?label=npm+30d&message=2%2C373&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)

> **用途**：用户按全局、工作区或会话设置回复风格，并检查当前真正注入的配置。

> **亮点**：将人设从散落文本改为有来源、作用域、预览和变更历史的配置流程，工具变更区分批准/拒绝/不可用。贡献在状态管理与交接，不是可持续自演化人格。

> **思考**：会话覆盖缓存未命中时先按上层配置装配、后台读盘下一轮生效，首次实际人设可能不同于用户预期。审计在配置成功后独立写，workspaces不进字段审计/哈希，回滚不能称所有作用域完整事务恢复；送达也不等于模型遵守。

> **建议**：未验证假设：将首轮作用域加载作为明确就绪条件，并给每轮可审计配置摘要，可减少“保存了却没生效”的歧义。以新会话、冷缓存、工作区覆盖、审计失败核实际system文本及回滚范围；不能对齐则不标已生效。

<a id="plugin-1335332435-root"></a>

## [dsh-sound](../../plugins/ai-galaxy-gpu--dsh-sound/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/AI-Galaxy-GPU/dsh-sound) [![npm 30d 920](https://img.shields.io/static/v1?label=npm+30d&message=920&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound)

> **用途**：离开聊天视线时辅助感知进展/待办，仍以原UI状态为准。

> **亮点**：将多事件/来源/音源与回放和跨tab干扰处理接成配置流程，非可靠通知队列或业务确认。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：snapshot无结束reason可误响完成，跨tab与静默播放失败不保证恰好一次/实际听到，子Agent默认和文档不一致。详见[Q02](#research-q02)。

> **建议**：可探讨事件/播放状态收据和短租约、弱语义提示与模块清理，仍不能以API证明用户听到。详见[Q05](#research-q05)。

<a id="plugin-1334493734-root"></a>

## [dsh-speak](../../plugins/alan2z--dsh-speak/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/Alan2Z/dsh-speak) [![npm 30d 1,699](https://img.shields.io/static/v1?label=npm+30d&message=1%2C699&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-speak) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-speak)

> **用途**：离开屏幕时听回复和审批提醒，重要细节仍回到原文核查。

> **亮点**：将播报生命周期与会话消息身份关联，单进程队列比每消息直接spawn更一致；语音合成归系统引擎，PR队列机制明确归上游贡献。

> **思考**：队列全局且enqueue无容量/过期限制，多会话高频消息可能延迟播报过时提醒；控制/WS路由未在本包独立核来源，依赖宿主栅栏。日志含正文片段，不能把本地处理等同无留痕。

> **建议**：未验证假设：按会话/事件优先级和时效丢弃过期普通播报，并保留审批原文链接，可降低队列延迟而不漏重要提醒。用多会话长文/取消审批比较提醒时延、漏报和可追溯性；高优先级被饿死则否定。

<a id="plugin-1333136466-root"></a>

## [dsh-spotlight](../../plugins/0xsline--dsh-spotlight/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) [![npm 30d 599](https://img.shields.io/static/v1?label=npm+30d&message=599&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

> **用途**：频繁导航的键盘用户，需辨认目标/副作用并保留现有草稿。

> **亮点**：复用宿主目录把导航集中，避免独立命令表和模型阶段；非新语义检索。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：命令fallback按首输入覆写无CAS，目录与执行session可变化，广泛DOM动作不等安全白名单；未知执行不能当未执行。详见[Q02](#research-q02)。

> **建议**：可探讨session/稳定动作ID与草稿版本绑定、未知结果收据及异步保留选中，宿主适配成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1336658798-root"></a>

## [dsh-starter-zh](../../plugins/863683348--dsh-starter-zh/INSIGHT.md)

[![npm 30d 128](https://img.shields.io/static/v1?label=npm+30d&message=128&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-starter-zh) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-starter-zh)

> **用途**：DSH中文新手想知道profile/安装/写发布插件的学习步骤，需按实际版本实践。

> **亮点**：统一中文资料入口降低重复组织路径，非自动诊断或有证据的动态推荐。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：欢迎引导未实现profile action，固定推荐无版本/评分/核查来源，自查不验证或保存完成状态。详见[Q02](#research-q02)。

> **建议**：可探讨action/欢迎同源和版本化学习路线，推荐绑定研究证据、自评区分产物验证，维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1333328839-root"></a>

## [dsh-status-rotator](../../plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

> **用途**：用户希望长任务的运行状态更有辨识度且保留宿主时钟/读屏。

> **亮点**：把阶段短语、动画和跨升级配置组成可调状态体验。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：私有 DOM 结构易随宿主/其他插件 CSS 改变；默认自动拉 main 词库并有持续定时器。详见[Q04](#research-q04)。

> **建议**：宿主稳定状态槽位可减少 DOM 猜测与 CSS 协作负担，尚非本包能力。详见[Q05](#research-q05)。

<a id="plugin-1418769012-root"></a>

## [dsh-sticker-pack](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/5V1A-afk/dsh-sticker-pack)

> **用途**：适合需要在日常聊天中引用团队共用表情素材的DSH用户；交付物是可显示的Markdown图或特定通道文件。

> **亮点**：作者主张远端共用图册与正文贴图；可确认增量是把远端清单镜像、懒下载、按轮概率和重复规避连接到模型工具。相对模型手写随机图片路径，工具给出实际素材链接；宿主掷骰加工具第二道gate把是否提供图片从纯提示移到部分可执行控制，显示和微信传输仍依赖宿主及外部渠道。

> **思考**：素材匹配依赖标签和上下文规则，贴图频率不等于交流质量。等待上限可设任意正数，Promise.race到期只停止等待而不必取消全部同步工作；GET带参数可以写设置，宿主路由鉴权与浏览器请求行为必须核对。微信把扩展名加.wechat绕到文件通道只是适配，作者也承认未在手机端确认。

> **建议**：待验证假设：把概率决策、素材匹配理由、缓存命中和实际渲染结果记录到同一回合，可用失败显示率约束贴图而不只控制调用。固定一套回复比较纯概率与可见性反馈策略的显示成功、重复率、延迟和人工评价；若只增加日志而不改善交流，则否定。

<a id="plugin-1390600932-root"></a>

## [dsh-temptask](../../plugins/aeroscis--dsh-temptask/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aeroscis/dsh-temptask) [![npm 30d 1,309](https://img.shields.io/static/v1?label=npm+30d&message=1%2C309&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask)

> **用途**：一次性试验需快速开始，成果保留时目录和对话可追溯；隔离目录不是进程或权限沙箱。

> **亮点**：把临时到正式的目录、工作区和对话生命周期串起来，增量超出单一新会话按钮；会话seed及归档由宿主提供，插件不改旧日志。

> **思考**：转正是否原子保留全部工作？历史携带失败可继续完成搬迁；目录move失败前可能已取消会话，README“什么都没改”范围过宽。跨卷复制删除和工作区重建也存在部分失败/回滚失败分支。

> **建议**：由多阶段转正推导，可预生成迁移计划与持久化阶段日志，把目录成功、会话重建和旧节点归档分开确认并可恢复。未验证；逐阶段注入故障，所有产物应可定位且不重复取消/搬迁。

<a id="plugin-1389458393-root"></a>

## [dsh-text-inject](../../plugins/1497105876--dsh-text-inject/INSIGHT.md)



> **用途**：用户需要维护独立于宿主配置的常驻规则，并能查看或恢复旧文本，成功标准是实际注入与文件一致。

> **亮点**：lib/index.js解析块后先释放旧注册，再用systemPrompt.section/context注册；监听目录处理原子保存，路由保存与恢复历史。

> **思考**：独立文件与历史便于回退；注入入口更方便也可能让过期规则长期影响不同任务。

> **建议**：先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。

<a id="plugin-1343882273-root"></a>

## [dsh-think-bounce-pet](../../plugins/9livewolf--dsh-think-bounce-pet/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/9livewolf/dsh-think-bounce-pet)

> **用途**：用户希望界面有陪伴和思考状态视觉提示，交付本地动画，不代表真实推理进度或任务结果。

> **亮点**：相对固定装饰图，增量是可拍打拖扔的物理球和基于会话reasoning可见文本的状态响应，区分常驻与思考球。物理动画/React槽位为成熟方法，不是任务能力提升。

> **思考**：宠物出现能否说明Agent真在思考？仅检测legacy.partial.blocks含非空reasoning，隐藏推理/不同provider或宿主投影变化会无球，残留块也可能误提示；常驻动画与可交互球会占用注意力和指针区域，不能由pointer-events none概括为完全不干扰。

> **建议**：待验证假设：将宠物状态改为宿主明确运行/等待/结束事件，并给低动态或可访问模式，可减少伪进度和视觉干扰。由reasoning文本启发式与物理动画推导，未实现。对照无reasoning模型、历史回放、会话切换和减少动态设置，测状态误导、误触与帧耗时；不宣传提效。

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)

> **用途**：手机或窄平板切换会话后阅读聊天，避免侧栏持续挤压正文。

> **亮点**：针对窄屏侧栏挤占的明确失败路径，将覆盖抽屉、关闭动作与阅读密度组合，改善的是同一界面任务的可用空间。常见响应式设计，不构成新布局算法或业务分工。

> **思考**：定位依赖宿主内部语义类名，唯一匹配校验避免误写但不能保证升级兼容；紧凑按钮24px牺牲触达尺寸，更多正文空间不自动等于更好移动可用性。作者单设备测量不能外推所有手机。

> **建议**：未验证假设：以官方布局槽位承载抽屉，并按触控目标与正文空间双预算调密度，可减少兼容修补和误触。用多个窄屏、trace/设置、触屏任务比较误触、阅读与切会话耗时；空间增益若伴误触上升则停止缩小按钮。

<a id="plugin-1363291561-root"></a>

## [dsh-tts-flash](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2021Heei/dsh-tts-flash)

> **用途**：适合希望边听边看长回复的桌面用户；交付物是与当前会话对应的可中止音频及字幕，而非离线音频档案。

> **亮点**：作者强调边生成边朗读与多引擎；README 和 speak-queue.ts 明示分句及队列改编自 MIT 的 dsh-voice，因此不把继承的流式朗读认作原创。本项增量在统一 TtsProvider、引擎声明与缓存等待音频的衔接：等待反馈和正文共享播放通道，正文入队后停止等待循环，减少维护多套语音状态的负担。

> **思考**：最关键的问题是追赶速度是否牺牲用户必须听到的内容。SpeakQueue 的 MAX_PENDING=12，积压时 pending.shift() 丢弃最旧句；这保护内存、贴近当前输出，却意味着 README 的“无损”只能理解为不阻断模型流，不能理解为全文朗读无遗漏。相反，短回复或快引擎可能从不触发丢句，因此不能据此否定日常可用性。

> **建议**：需要听当前回复的用户可先用非敏感短文试用，确认窗口切换、停止和自动播放正常；长回复必须对照文字检查是否跳句，不适合直接当完整有声文稿导出器。

<a id="plugin-1356219122-root"></a>

## [dsh-turn-outline](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,546](https://img.shields.io/static/v1?label=npm+30d&message=1%2C546&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-turn-outline)

> **用途**：长会话用户回查某轮输入、工具与输出，合格导航应指向同一事件而非看似相似文本。

> **亮点**：相对LLM生成标题大纲，增量是无模型事件折叠及结构化seq跳转，降低摘要幻觉与调用费；原会话与视图索引由宿主提供。

> **思考**：零AI是否等于“无失败态/秒开”？历史分页、过期view、缺better-sidebar或路由拒绝都有条件；摘要只取末文本和工具预览，不能当完整审计。自建browser fence防跨站/DNS rebinding而非用户认证。

> **建议**：由seq定位与折叠推导，可在摘要显示覆盖范围/被折叠事件数，并验证点击目标seq与当前展示一致。未验证；压缩、steering、并行工具和加载旧页时测误跳及遗漏，错误不得默默跳近似位置。

<a id="plugin-1339034478-root"></a>

## [dsh-ui-enhancer](../../plugins/alexyin-tongji--dsh-ui-enhancer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer) [![npm 30d 1,212](https://img.shields.io/static/v1?label=npm+30d&message=1%2C212&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer)

> **用途**：在DSH web频繁查看/引用工作区文件并需要个性化布局的读者。

> **亮点**：保留官方槽位并组合上游右栏、受根限制文件引用与本地个性化，贡献在统一体验而非全部预览自实现。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：文件路由有loopback检查，独立活动GET却直接输出全局会话片段，未见同类检查/读者过滤；实际外层认证未知。详见[Q02](#research-q02)。

> **建议**：可探讨按读者授权的最小活动投影，默认只给phase/时间，详情显式选择并统一Host授权；会增加权限适配与总览成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)

> **用途**：用户按日周月回顾模型使用和技能调用，发现用量异常并追溯统计覆盖；交付是可重建的个人分析视图。

> **亮点**：相对直接把实时事件累加，设计增量在以持久日志为真相重建派生索引，并对stream终止usage与assembled message去重；reasoning作为output子集不再加总，减少重复计费口径误读。

> **思考**：统计成功不等于技能任务成功。显式skill-invocation一出现就记success，自动skill结果只检查工具错误，这些是调用状态而非业务完成质量。usage缺失虽保留known标记，字段缺失仍补0；比较总量需要同时看覆盖。

> **建议**：适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。

<a id="plugin-1335070045-packages-vision-route"></a>

## [dsh-vision](../../plugins/314857493--dsh-vision--packages-vision-route/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,264](https://img.shields.io/static/v1?label=npm+30d&message=1%2C264&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route)

> **用途**：希望继续使用已有纯文本provider、偶尔询问GUI图片的DSH用户，交付为可供下游推理的视觉描述。

> **亮点**：相对切换整个会话到原生视觉模型，增量在视觉前处理与主模型解耦，以及基于本轮追问重新解析近期历史图；依赖现成视觉API，非新视觉算法。只研究vision-route，磁盘vision工具是另一组件。

> **思考**：转译文字是否保存足够细节？代码按问题生成并可复看旧图，这是强支持；但JSON结果默认只展平value而不保留key，表格关系和细节可能丢失。追问选择最多近期8轮/6张图，是有限范围的指代启发式，不能承诺任意历史理解。

> **建议**：需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。

<a id="plugin-1333993743-root"></a>

## [dsh-vision-fallback](../../plugins/1helloman1--dsh-vision-fallback/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-vision-fallback) [![npm 30d 909](https://img.shields.io/static/v1?label=npm+30d&message=909&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback)

> **用途**：给偏好文本主模型但需要截图/图片辅助的用户自动提供视觉观察，重要事实须回原图核对。

> **亮点**：把聊天/工具持久图片接入固定视觉模型再给原主模型文字观察，保留UI原图并减少手工转存；视觉推理由外部模型提供，不是给文本模型原生视觉。详见[Q03](#research-q03)。

> **思考**：隐藏观察可能漏掉图像细节，默认还会把问题和近期对话发往另一endpoint；持久缓存未绑定prompt、超时未覆盖后续body解析，均为源码条件边界未复现。详见[Q03](#research-q03)。

> **建议**：可探讨意图绑定视觉观察收据，把图像/问题/prompt策略和不确定区绑定，检验陈旧复用和误确信是否减少；会增加状态与重识别成本，未验证。详见[Q06](#research-q06)。

<a id="plugin-1335070045-packages-vision-tool"></a>

## [dsh-vision-free-eyes](../../plugins/314857493--dsh-vision--packages-vision-tool/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,179](https://img.shields.io/static/v1?label=npm+30d&message=1%2C179&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes)

> **用途**：文本模型根据用户给出的本地图片绝对路径回答图片问题。

> **亮点**：无需另装 CLI 便给 DSH 提供单图视觉问答/转写；详见[Q01](#research-q01)。

> **思考**：错误回退不区分取消/凭据/服务故障，绝对路径访问依赖调用方纪律；详见[Q01](#research-q01)、[Q02](#research-q02)。

> **建议**：加入路径授权与按错误类别短路、预读大小限制及缓存作用域可改进安全和诊断；待验证，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1334554745-root"></a>

## [dsh-voice](../../plugins/3274375092--dsh-voice/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) [![npm 30d 578](https://img.shields.io/static/v1?label=npm+30d&message=578&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)

> **用途**：用户希望口述非敏感需求，合格结果是完整文本只发一次到正确会话，不把识别结果当无须复核的指令。详见[Q01](#research-q01)。

> **亮点**：把麦克风、热键、原生/浏览器识别和正常会话提交组合成preset无关输入通道；ASR模型和VAD来自既有组件。详见[Q01](#research-q01)。

> **思考**：auto回退不保证音频本地处理，stop会把partial也提交，识别错词可能直接触发Agent；四会话LRU还可能断句。静态核查不等声学/隐私验证。详见[Q03](#research-q03)。

> **建议**：可探讨停麦进入可编辑草稿并显示真实引擎/回退，以口述反例比较错误任务触发和修正总成本；当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1335558973-root"></a>

## [dsh-voice-input-web](../../plugins/0nt-one--dsh-voice-input/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) [![npm 30d 60](https://img.shields.io/static/v1?label=npm+30d&message=60&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web)

> **用途**：希望以语音输入聊天草稿、随后可编辑再发送的 Web 用户。

> **亮点**：无需额外 ASR key 即可把浏览器语音识别接入 DSH 草稿。详见[Q01](#research-q01)。

> **思考**：听写期间手工编辑可被后续 final 覆写，autoSend 在识别结束时无草稿确认；音频可能经浏览器网络服务处理。详见[Q02](#research-q02)。

> **建议**：用草稿版本合并而非会话开始快照覆盖，并在自动发送前人工确认/校验，会降低误发；待实测。详见[Q02](#research-q02)。

<a id="plugin-1334255250-root"></a>

## [dsh-web-mobile-fix](../../plugins/acidgr--dsh-web-mobile-fix/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-mobile-fix) [![npm 30d 1,787](https://img.shields.io/static/v1?label=npm+30d&message=1%2C787&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix)

> **用途**：手机窄屏与嵌入式悬浮窗操作，合格体验需输入、返回和会话切换不误触。

> **亮点**：增量是将窄屏、悬浮窗控制和软键盘处理接到现有界面；未改变模型任务流程。固定源码功能已超出包描述“纯CSS”。

> **思考**：禁用能否完整恢复？cleanup移除样式、部分按钮和监听，但未移除onSidebarItemClick监听，也未见撤销全局切换入口和全部延迟任务。DOM class片段匹配可能在宿主升级后误中。

> **建议**：由悬浮窗桥接与清理缺口推导，可把所有事件/全局入口纳入统一disposer，并以宿主语义动作替代DOM点击。未验证；反复启停后监听数与单击动作应保持一次，窄屏键盘切换无误退。

<a id="plugin-1387205322-root"></a>

## [dsh-whale-girl-live2d](../../plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)

[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

> **用途**：希望用角色反馈感知Agent活动的用户；动画状态是事件映射，不能代替任务成功或审批结果。

> **亮点**：相对纯装饰桌宠，增量是会话阶段、工具动作和人机输入反馈的配套接线；Live2D运行时与美术素材来自第三方，角色资产不是MIT代码授权范围。

> **思考**：跟着Agent动作是否可靠反映当前任务？主要会话选择和事件映射会简化并行任务；费用是固定价格估算。更关键的是requestRejection服务缺失或异常时return false放行，不能笼统称全部路由可靠受保护。

> **建议**：由事件映射与信任分支推导，可把角色状态附会话ID/事件新鲜度，并将写回输入与取消动作统一fail-closed认证，离线/旧状态明确显示。未验证；多会话切换、丢流和信任服务故障时不应误显示完成或放行写回。

<a id="plugin-1339803365-root"></a>

## [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)

> **用途**：经常整理多个工作区和会话的用户，希望减少查找管理入口的步骤。

> **亮点**：客户端用 DOM/React fiber 定位行，Host 执行文件管理器调用；危险删除与归档管理器协作。

> **思考**：就地管理减少界面跳转，但把磁盘删除与日常菜单放在一起增加误操作后果。

> **建议**：先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。

<a id="plugin-1363511446-root"></a>

## [dsh-workspace-tools](../../plugins/ahiosuz--dsh-workspace-tools/INSIGHT.md)



> **用途**：在不同项目间重复切换预设的用户，希望减少每次设置；合格结果是只影响正确新会话，人工选择优先且权限默认符合项目信任。

> **亮点**：相对全局同一默认值，增量是项目上下文默认化，采用官方服务并保留后续手动选择。不是新权限引擎，权限实际语义归宿主。

> **思考**：创建后异步切换是否必定先于第一轮和手选？监听void applyRule，Agent切换await后再改权限；源码检查已有turn发生在应用前，执行期间的首轮/用户选择存在时序待验。normalizePath还统一大小写，非Windows大小写敏感路径需检查，不能由ID主路径推断所有fallback正确。

> **建议**：由异步双预设应用推导，可让宿主创建时携带原子默认计划，应用前后版本检查并在人手选后取消自动任务。未验证；注入慢select与立即首轮/手选，若自动值仍覆盖选择则否定。

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

> **用途**：Agent在WSL得到报告或服务地址后，用户希望在Windows浏览器直接查看，验收是实际页面可达。

> **亮点**：lib/browser.js只接受http/https URL并转义PowerShell单引号，入口通过wsl-host调用Start-Process；localhost仅给替代地址提示。

> **思考**：消除复制地址的微小重复操作，收益来自入口便利；HTTP协议允许不等于目标可信。

> **建议**：适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。

<a id="plugin-1350378372-root"></a>

## [dsh-wsl-clipboard](../../plugins/173787247--dsh-wsl-clipboard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard)

> **用途**：WSL开发者需要在模型输出和Windows应用间传递文本，合格结果是文本完整且没有覆盖错误内容。

> **亮点**：lib/clipboard.js用PowerShell Forms Clipboard读写，写入文本先UTF-8编码为base64，输出携带字符数及截断标记。

> **思考**：base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。

> **建议**：先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。

<a id="plugin-1351854499-root"></a>

## [dsh-wsl-download](../../plugins/173787247--dsh-wsl-download/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download)

> **用途**：用户已在Windows下载大模型或资料，希望复用现有文件而非在WSL重复下载，合格结果是正确文件完整复制。

> **亮点**：lib/download.js从WINDOWS_USER或PATH推断Downloads，列最近文件；copy限制源为basename并创建目标目录后copyFileSync，hint仅输出固定建议。

> **思考**：避免重复联网下载有价值，但名为download不代表下载器；固定模型提示可能随工具版本变化而过期。

> **建议**：先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。

<a id="plugin-1370460115-root"></a>

## [dsh-wsl-im](../../plugins/173787247--dsh-wsl-im/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-im)

> **用途**：用户希望从已有IM入口驱动本地Agent，并把回复送回原聊天。

> **亮点**：源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。

> **思考**：isAllowed在平台allowedUserIds为空时允许所有用户；requireAllowlist只阻止缺少允许列表的已启用真实适配器启动，mock例外。同一platform/chatId共享Agent上下文，授权用户之间不按userId隔离。

> **建议**：待验证假设：把发送者权限与会话共享策略显式组合，可以降低群聊中的越界继承；与默认按用户隔离相比需衡量协作损失。

<a id="plugin-1350378498-root"></a>

## [dsh-wsl-launch](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch)

> **用途**：Agent需要把文件或任务转交给Windows编辑器、浏览器等桌面应用。

> **亮点**：把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。

> **思考**：允许列表支持后缀与通配前缀，匹配程序名不等于固定可信可执行文件；Start-Process成功也不证明窗口打开了正确文件。

> **建议**：本次未形成新的创新假设；先固定可执行文件身份并验证参数往返，比扩大可启动程序范围更有价值。

<a id="plugin-1350379268-root"></a>

## [dsh-wsl-notify](../../plugins/173787247--dsh-wsl-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify)

> **用途**：长任务结束后，需要让离开聊天界面的用户看到简短提醒。

> **亮点**：为Agent输出增加桌面提醒通道，减少手动盯聊天；通知到达和用户理解并没有由返回成功证明。

> **思考**：MessageBox会等待交互，气泡依赖桌面策略且未提供用户已读回执；重试可能造成重复或阻塞提醒。

> **建议**：本次未形成新创新假设；先明确展示、关闭和用户确认三种状态，比较提醒是否降低漏看而不增加打扰。

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

> **用途**：WSL工具生成文件后，用户希望直接用Windows默认应用查看。

> **亮点**：把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。

> **思考**：客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。

> **建议**：待验证假设：将识别文本与已确认存在的产物分开显示，可减少自然语言中的伪路径被误点；需比较额外文件探测成本。

<a id="plugin-1351853863-root"></a>

## [dsh-wsl-picker](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-picker)

> **用途**：用户需要向Agent提供WSL或Windows挂载目录，减少反复复制目录列表。

> **亮点**：把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。

> **思考**：maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。

> **建议**：本次未形成新创新假设；优先验证大目录延迟和路径边界，再决定是否需要分页或根范围约束。

<a id="plugin-1351854253-root"></a>

## [dsh-wsl-shot](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot)

> **用途**：用户截屏后，需要把现有剪贴板图片交给运行在WSL的Agent。

> **亮点**：把剪贴板到WSL文件的跨系统搬运封装为一步；它读取已有剪贴板图片而非主动屏幕截图，也未直接附加模型图片块。

> **思考**：临时文件位于Users/Public且复制失败时保留；固定名称输出可能覆盖，Date.now临时名在并发下存在碰撞可能，isConcurrencySafe声明需用并发用例核对。

> **建议**：待验证假设：唯一临时目录、受限权限和finally清理可减少失败时图片残留；需要保留可恢复性，避免复制失败时删除唯一原件。

<a id="plugin-1335045545-root"></a>

## [dsh-youreyes](../../plugins/54xkeee--dsh-youreyes/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,096](https://img.shields.io/static/v1?label=npm+30d&message=1%2C096&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)

> **用途**：文本模型用户需要解释图片和截图，合格结果是可追图的观察而非把VLM生成文字当已证事实。详见[Q01](#research-q01)。

> **亮点**：把VLM、图片占位、模型工具和会话记忆接成多轮流程；架构明确继承vision-toolkit，不能将模型识别能力或已有架构算新增原创。详见[Q01](#research-q01)。

> **思考**：生成性描述可能被缓存/压缩恢复持续复用，结构化不等正确；默认本地路径无目录限制，curl回退会临时落盘，固定Git树还缺main所指lib。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：可研究原图/区域定位与纠错失效绑定的视觉记录，用固定错误跨轮样例比较纠正效果、调用量和上下文代价。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1335281982-root"></a>

## [dsh-yukimi-theme](../../plugins/alycestocking--dsh-yukimi-theme/INSIGHT.md)



> **用途**：用户喜欢角色主题，并希望桌面可见根会话的询问、审批与本轮结果。

> **亮点**：主题加桌宠把会话等待与本轮完成事项带到桌面。详见[Q01](#research-q01)。

> **思考**：桌宠通知虽不传聊天正文，仍使用会话标题并主动置顶；素材为第三方角色外链，公开/商用使用需另核。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：提供隐藏/泛化标题选项与离线可授权素材集，可改善隐私和稳定性；本版本未证。详见[Q03](#research-q03)。

<a id="plugin-1415822787-root"></a>

## [feiyu-memory](../../plugins/airpineapplea--feiyu-memory/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)

> **用途**：娱乐陪伴对话用户希望新会话仍延续往事和称呼；交付是可查的日记记忆，不能当保管隐私的档案或工作事实真相。

> **亮点**：相较把全部历史塞入prompt，用本地启发式筛选、结构化固化和有限预算召回组织“经历”，并让手写人格/日记在持久化前参与合并。增量是陪伴记忆的取舍与维护机制；默认模型能力、BM25与摘要方法为已有技术，不能据此宣称真实人格连续。

> **思考**：“全本地/密钥硬拦”是否足以保护对话？consolidate经ctx.llm选择默认provider，若是远程API仍会发送正则清洗后的文本、近期日记和关系结构；规则只能覆盖已列密钥/格式。各会话共享同一archive目录，相关性召回不是项目/用户访问隔离；模型总结还可能把误解固化成后续“记忆”。

> **建议**：为记忆附可追溯原句/会话来源与可撤回确认，并按用途分区召回，可能降低错误印象反复强化和跨任务泄漏。以用户纠正旧事实、同主题不同会话和未命中格式的秘密样例比较污染率/误召回与人工负担；若更正后旧印象仍被注入，应否定保真改进。

<a id="plugin-1363429979-plugin-notes"></a>

## [Forge 便签](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

> **用途**：需要从临时想法转为任务的用户，希望在聊天旁管理笔记及执行状态。

> **亮点**：便签 CRUD 通过 storage-domain 持久化；日程与任务泳道状态关联，工具就绪后再挂 agent 桥。

> **思考**：把输入、任务和状态放在同一处可减少转录；自动执行却会引入授权和重复副作用风险。

> **建议**：先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。

<a id="plugin-1333716755-plugins-harness-memory"></a>

## [harness-memory](../../plugins/988hj7tczd-oss--harness-desktop--plugins-harness-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-desktop) [![npm 30d 224](https://img.shields.io/static/v1?label=npm+30d&message=224&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-memory) [![最新发布 2026-04-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-memory)

> **用途**：个人跨会话保留偏好、项目约定和成功做法，交付持久文本记忆；需自己管理过期和敏感信息。

> **亮点**：相对反复手贴偏好，增量是DSH存储域加工具和每次组装时分类注入，简单且透明；没有语义检索/自动事实验证，不将宿主整套桌面能力算入本组件。

> **思考**：长期记忆是否可靠且范围合适？表未按会话/项目/用户分区，所有记忆直接注入系统提示；最近50条排序会挤掉旧但重要约定，文本精确去重不处理矛盾。工具描述称ID可从提示获得，render实际只列text无ID，删除便利也需核对。

> **建议**：待验证假设：为记忆增加来源、适用项目/用户、有效期和冲突关系，并按当前任务检索，可减少陈旧/越域指令。由全表最近注入与精确文本去重推导，未实现。用双项目矛盾规则、超过50条和过期偏好对照误召回/漏重要约定与token成本；模型提炼不能自作真值。

<a id="plugin-1374454334-root"></a>

## [hover-glossary](../../plugins/alycestocking--hover-glossary/INSIGHT.md)

[![npm 30d 48](https://img.shields.io/static/v1?label=npm+30d&message=48&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/hover-glossary) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/hover-glossary)

> **用途**：读中英文技术聊天时快速查固定术语/缩写含义，保留上下文；交付是词库条目展示，不是上下文语义判断。

> **亮点**：把归一化、一对多释义和最长词查询封装到本地悬停，避免每次术语检索模型请求；复用相同纯Lexicon源码构建client减少漂移。增量是低成本阅读入口，词库覆盖与条目权威性不由算法保证。

> **思考**：多个释义怎样避免“最高weight就是当前意思”的误读？排序是静态weight而非上下文消歧；跨DOM样式节点拆词不匹配，英文短语只首词命中，可能漏词或给不适用义项。README把旧浏览器验证和Desktop入口检查分开，本轮不能将其升级为当前悬停已验收。legacy host-service/Skill文件存在也不等于当前注册能力。

> **建议**：为义项标注来源/适用领域与当前上下文不确定性，并对跨节点词用只读范围合并，可能在不调用模型下减少误解。固定同缩写不同领域和加粗拆词案例，比较用户选义正确率与误弹；若只多显示解释而选义不改善，则不能称语义辅助升级。

<a id="plugin-1335144603-root"></a>

## [ikun-theme-skin](../../plugins/aks1st--ikun-theme-skin/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin)

> **用途**：个人用户在 DSH Web 中自愿使用娱乐主题。

> **亮点**：把主题、媒体和互动彩蛋打包为 Web 主题体验，而非模型或工作流能力提升。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：启用时主动 setTheme('ikun-day')，清理未恢复先前偏好；远程媒体部分追踪 main/master，长期可用性不固定。详见[Q03](#research-q03)。

> **建议**：改为显式选择、可恢复原偏好并固定/降级素材，比较启停状态保持和加载/性能；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1402940561-root"></a>

## [mac-notify](../../plugins/ak-blank--dsh-plugin-mac-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify)

> **用途**：适合把长任务留在后台、需要被叫回处理问题或审批的 macOS 单人用户；交付物是可感知的提醒和返回 Web 的入口。

> **亮点**：相较盯着 Web 页或给每个任务写通知脚本，贡献在于把“完成”和“等待人介入”统一映射到宿主事件，并让通知失败不阻塞原审批/提问流水线。它改善人机交接的可见性，未改变审批规则或任务执行结果。

> **思考**：通知是否真正把人带回正确上下文？click.mjs 按 Web URL 前缀寻找浏览器标签，只指向站点而非具体 session；多会话同站点时仍需人工定位。成功启动通知进程也不能证明 Focus/通知权限下人已收到，摘要还会把助手文本展示到系统通知中心。

> **建议**：若在通知载荷中加入可验证的会话深链接，并对尚未解决的提问/审批进行状态合并，可能比站点级提醒缩短有效响应时间。以双会话并发和重复事件回放比较“点击后到正确问题”的操作数与误定位率；没有降低误定位则否定此增量。

<a id="plugin-1335798113-packages-messaging-core"></a>

## [messaging-core](../../plugins/534119219--dsh-messaging--packages-messaging-core/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/534119219/dsh-messaging)

> **用途**：给需从消息渠道访问DSH的人统一会话入口，合格回复需身份、目标聊天及投递状态正确。

> **亮点**：统一平台adapter、DSH会话/命令和事件驱动出站，减少逐平台机器人重复接线；上游hermes/SDK/DSH能力不属原创，注册数量不代表效果。详见[Q02](#research-q02)。

> **思考**：入站白名单不等出站授权，send_message可直接指定已连接平台/chat，status列全部聊天；平台workspace共享且map非原子写，不能承诺多用户隔离与恰好一次投递。为静态核查未真实发送。详见[Q02](#research-q02)。

> **建议**：可探讨授权目标投递收据，绑定主体/会话/允许chat及操作ID，按调用者过滤状态并保存ACK/未知结果；平台差异和策略维护增加成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1402828137-root"></a>

## [offpeak-badge](../../plugins/ak-blank--dsh-plugin-offpeak-badge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge)

> **用途**：面向需要手动安排非紧急 API 任务的用户，交付物是当前时段与下一切换时间提示。

> **亮点**：把分散的时间窗与节假日规则变为常驻决策提示，尤其显式说明缺失年份日历会降级，优于只有一个固定倒计时。贡献是规则可见性与界面集成，计费规则来自作者引用资料，不能算原创调度或节费机制。

> **思考**：用户看到绿色是否真的意味着该请求会被按较低单价计费？源码不读取账号、模型、网关或账单，只依赖本机时钟与2025/2026日历；政策变更、代理服务与未知年份都可能使提示偏离实际。因此只能解释为内置规则状态，不能承诺“半价”。

> **建议**：若将规则版本、适用服务及有效期作为可见数据，并用脱敏账单样本校验，可能降低把通用时段误当个人计费结果的概率。对不同模型/渠道的固定样本比较“可适用/未知”的判断准确率；若仍把不适用渠道判为适用，则不成立。

<a id="plugin-1374149009-root"></a>

## [oil-dsh-title](../../plugins/598829314--oil-dsh-title/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title)

> **用途**：适合并行会话较多、需要在侧栏快速识别任务主线的用户。

> **亮点**：作者提供会话标题编辑器；增量是将持续任务主线提示、keep/rename结构及本地格式校验接入sessionTitle，优于只截取首句。分类emoji和对象｜目标增加可扫读性，语义准确性仍来自所选模型。

> **思考**：本地格式校验不验证标题忠实于主线，最近五条每条600字符及16个冲突标题可能遗漏长期任务和重复；提示禁止邮箱电话等，而validateTitle只显式检查部分字符串，不能当完整脱敏器。

> **建议**：待验证假设：用用户确认的稳定任务锚点与近期消息共同输入，可减少收尾动作劫持标题。对长任务插入提交/截图等短指令，比较标题漂移和查找时间；若锚点阻止真实任务切换则需撤回。

<a id="plugin-1418691015-root"></a>

## [Prompt Desk](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)

> **用途**：经常纠正同类行为的用户需要维护少量可复用教训，合格结果是正确经验被下轮读取且可撤回。

> **亮点**：index.js 逐个尝试认错标记，跳过不合法的首次出现，要求同一行按错误经过、教训顺序解析；结果先入待确认队列，采纳后才注入。

> **思考**：跳过无效早期标记能修正漏采路径，但采集更多草稿未必改善后续任务；经验质量仍依赖人工取舍。

> **建议**：已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。

<a id="plugin-1403959948-root"></a>

## [prompt-optimizer](../../plugins/alive114514awa--dsh-prompt-optimizer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer) [![npm 30d 1,554](https://img.shields.io/static/v1?label=npm+30d&message=1%2C554&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer)

> **用途**：用户需求尚模糊，需要在发给执行Agent前澄清目标、扩写或精简；交付物是用户可编辑的提示草稿，不自动执行任务。

> **亮点**：相较直接让执行Agent边澄清边修改，把需求改写放在独立可编辑阶段，并在Web草稿回填时用版本校验避免覆盖新输入。增量在于人确认的交接协议与并发保护，而不是新的提示优化算法；模型能力复用宿主和外部provider。

> **思考**：优化后的文本是否更忠实而非擅自补需求？结构化解析与预览不能保证目标不漂移，也缺同条件下游任务实验。Web有draftRev保护，但TUI公开追加无回执，README承认已有原稿保留未完成实测；“已写出”不能认定草稿已落地。Codex取消仍依赖provider的实际清理语义。

> **建议**：在预览中逐条标注“用户已给事实/澄清答案/模型新增假设”，可能比单纯润色降低需求偷换。对相同模糊需求盲测原稿和标注稿，统计未授权新增约束与下游返工；若只是更长却没有降低新增假设错误，则否定收益。

<a id="plugin-1388463793-root"></a>

## [type-tune（DSH-Plugin_awl）](../../plugins/awl-mc2--dsh-plugin_awl/INSIGHT.md)

[![npm 30d 290](https://img.shields.io/static/v1?label=npm+30d&message=290&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-type-tune) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-type-tune)

> **用途**：壁纸或主题使次要文字难读的用户调整会话阅读样式；交付物是可恢复的个人排版配置，不是模型结果质量提升。

> **亮点**：相较手写CSS，把字体发现、阅读对比与预设调节做成双入口，并用present区分尚未配置和明确恢复默认，避免迁移抹掉旧偏好。它是可读性配置集成，不能由WCAG预览徽标推出壁纸背景上所有文字均达标。

> **思考**：共享状态是否真有持久确认？saveState写临时文件rename失败被吞掉，仍返回新revision；浏览器可把未落盘状态当成功且下一次重启丢失。全量配置POST没有expected revision，多标签并发可覆盖。字体/manifest读路由无认证，暴露网络的Host会扩大可读范围，不能用写同源检查代替访问授权。

> **建议**：把写入错误和expectedRevision纳入状态协议，浏览器只在持久成功后推进revision，可能减少假成功和双标签丢配置。对只读home、rename失败和两个标签同时更改不同字段验证不回成功且冲突可见；若配置仍静默覆盖，则协议未实现预期。

<a id="plugin-1368192539-root"></a>

## [zcode-usage-stats](../../plugins/amer-cn--zcode-usage-stats/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 157](https://img.shields.io/static/v1?label=npm+30d&message=157&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/zcode-usage-stats)

> **用途**：本地回顾各模型token使用与活跃天数，不用于核账或产出质量评价。

> **亮点**：把已有持久化事件变成多粒度可读视图，并用SWR缓解重复扫描等待。视觉与本地聚合为主要增量，模型用量语义归宿主。

> **思考**：去重只在turn/step都是数字时成立，同一步若多条usage不同将取首条；完整性依赖宿主事件契约。磁盘缓存固定web目录可能跨profile复用错误历史，空/部分扫描与真实低用量需看warnings。

> **建议**：未验证假设：缓存键绑定profile/事件契约并输出扫描覆盖与usage去重依据，可避免错范围趋势。用两profile、重复/修正usage、失败日志及大历史对比总量与coverage；不能对齐原事件则不作预算依据。

<a id="plugin-1396768359-root"></a>

## [上下文交接提醒](../../plugins/2jumpsina--dsh-context-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)

> **用途**：长期进行代码或研究会话的用户，在上下文过长前交接任务；交付物是占用提醒与仍需补全的HANDOVER草稿，而不是自动完整迁移的会话。

> **亮点**：相对盯着token数字，新增“判断状态→提醒→交接草稿”的动作链；纯fold与只读UI让提示策略有单一所有者。token计量来自官方meter，非插件自行测量；零额外模型请求可由接线支持，但“零总成本”不能由此推出。

> **思考**：核心质疑是提前换会话是否真的降低合格任务总成本。作者单机账本是反事实估算，重新解释任务和修复交接遗漏也耗token与人时。README顶部称轮末提醒，后文明示在投影变化时判定，不能承诺绝不在轮中。默认写HANDOVER还可能把敏感片段带入仓库。

> **建议**：适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。

<a id="plugin-1412162067-root"></a>

## [滚动钢琴与消息小地图](../../plugins/439436269-ctrl--dsh-scroll-piano/INSIGHT.md)

[![npm 30d 1,565](https://img.shields.io/static/v1?label=npm+30d&message=1%2C565&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scroll-piano) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scroll-piano)

> **用途**：希望长聊天浏览更有趣、快速回看自己消息的桌面用户；交付可定位的消息刻度和本地声音反馈，不能以趣味推导生产率提升。

> **亮点**：相对普通滚动条，增量是用户消息小地图和声音反馈在同一边缘交互组合；音色来自Web Audio合成而非模型。用稳定data属性避开hash类名使DOM接线更明确，但仍依赖宿主内部布局契约。

> **思考**：最强质疑是附加反馈是否帮助导航还是打断阅读。实现确有刻度跳转和用户消息过滤，但只依赖当前DOM，虚拟化/长会话可能没有全部历史消息元素；音频浏览器权限、误触和全局监听开销也影响采用价值。

> **建议**：作为趣味和用户消息回看辅助试用；长会话和侧栏布局先核对刻度覆盖，办公环境先调低音量，不替代正式搜索。

<a id="plugin-1409724830-src"></a>

## [蓝毛小女仆桌宠](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

> **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。

> **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。

> **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。

> **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

## 更新时间

2026-10-22
