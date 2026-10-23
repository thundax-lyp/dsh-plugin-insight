# 个人效率

[返回首页](../../../README.md)

输入、会话、快捷操作与个人工作体验。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@luziyang2026/dsh-question-nav](#plugin-1341946801-root) | 在DSH会话侧边以圆点和悬停卡片索引用户提问，点击按需加载历史并跳转到对应轮次。 | 个人匹配SDK长会话试用；单文本之外不保证完整卡片，重要上下文保留手工回看，切会话避免连点旧任务。 |
| [@zzerx/dsh-plugin-daily-log](#plugin-1363429979-plugin-daily-log) | 聚合Git提交和本地Claude、Codex、DSH对话，按项目与时间下钻活动，由会话模型按模板撰写并保存或导出工作报告。 | 先观察，优先保留渠道截断/失败收据并加确认/安全导出，再以个人匿名语料核事实与漏项。 |
| [agent-clinic](#plugin-1417442557-root) | 只读扫描本地DSH会话，生成带证据定位的使用问题诊断、配置处方与插件候选，并提供面板和CLI。 | 先观察。 |
| [AIR-pixel Liquid Glass](#plugin-1414238544-root) | 为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。 | 重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 |
| [Amoji for DSH](#plugin-1378933589-adapters-dsh) | 向 DSH 添加固定语义表情、库管理、表情包与市场发布入口。 | 目前建议观察。 |
| [anan-thermal-monitor](#plugin-1335381015-root) | Windows WPF 温度桌宠，利用 PowerShell 与随包 LibreHardwareMonitor 采集传感器，DSH Host 负责启动/停止。 | 在隔离 VM 核包内容、二进制来源和 UAC；测试传感器缺失、启动误报、停止/卸载及任务计划残留。 |
| [chicheng-cron](#plugin-1335807482-root) | 在DSH Web侧栏管理cron任务，定时执行脚本、Skill或Agent，保存输出并提供推送、会话分组和归档选项。 | 先观察。 |
| [chicheng-peak](#plugin-1336366824-root) | 按配置峰谷时窗显示页面/输入框光效与角标，并由Host提前调度模板提醒到可选消息渠道。 | 先观察，先核真实适用规则、统一转折/投递收据/热重载，提醒仅辅助不直接作省钱依据。 |
| [chicheng-vault](#plugin-1337038478-root) | 在输入区管理加密私密片段、普通片段与 WebDAV 备份。 | 保持观察；只存可撤销的测试 token，关闭直接发送并在空会话演练锁定/恢复，长期秘密继续交给专用密码管理器。 |
| [cute-fat-fish-pet / src](#plugin-1409724830-src) | DSH 插件半侧的动画桌宠，提供 Web/桌面宠物、文字对话和可选屏幕能力；独立 Windows 版另有语音等功能。 | 先观察；仅可信本机、明确模型及附件目的地的无敏感环境可小样评估，屏幕观察与自动 Electron 下载需分别明确配置及残留清理。 |
| [Cutout Pet · 抠图桌宠](#plugin-1427089201-root) | 将图片在浏览器本地抠图、描边并显示为 Harness 网页桌宠，附带账户余额气泡。 | 有条件试用。 |
| [deepseek-harness-hello-kitty-suite](#plugin-1343679449-root) | 粉色 Hello Kitty 皮肤加每轮结束/提问提醒插件，皮肤独立安装。 | 个人测试 profile 分开安装两组件，先跑多会话/失败故障矩阵。 |
| [dock-files](#plugin-1340492214-root) | 为 DSH Dock 添加当前会话工作目录浏览、文件打开及上传下载和文件管理入口。 | 当前建议观察，先确认本地访问边界和当前会话cwd。 |
| [dock-images](#plugin-1340492378-root) | 在dock工作台打开本地图片，整文件经Host转base64给浏览器img显示，支持缩放/旋转/拖动。 | 先观察，核原始API文件授权/非图片拒绝和资源/解码状态后再评估小图试用。 |
| [dock-markdown](#plugin-1340492424-root) | dock 体系的 Markdown Web 查看器，支持 GFM、消毒 HTML、大纲与相对资源解析/编辑切换。 | 当前不要在含敏感文件的 profile 中采用；先修路由文件授权和 traversal，再隔离测试功能。 |
| [dock-spreadsheet](#plugin-1400109121-root) | 在DSH dock-files中只读预览XLSX、XLS、ODS、CSV与TSV，支持切表、搜索筛选、坐标检查和显式链接导航。 | 可信私有Host普通文件可条件试用，先核三方加载/路径权限、缓存与字符串排序；公开Host/恶意大书/验算不宜直接依赖。 |
| [DPH 任务看板](#plugin-1336994666-root) | 把真实DSH会话组织为四列任务看板，支持建会话、拖拽状态、备注、回收站和导入导出。 | 多会话用户可观察，试用前先验证localStorage与宿主快照冲突、补丁卸载和导入覆盖恢复。 |
| [DSH Computer Use](#plugin-1333116579-root) | 为DSH提供macOS原生应用观察、元素操作、定向输入、截图与权限诊断。 | 有明确原生应用任务的macOS用户可在可撤销夹具上试用。 |
| [dsh-ai-arcade](#plugin-1413897334-root) | DSH 内的双脑贪吃蛇和中国象棋，游戏规则本地运行，模型提供策略或解说。 | 假 LLM 先验规则/性能；授权少额试用前封住付费路由的身份与预算。 |
| [dsh-alive](#plugin-1335661970-root) | 在会话头部显示本地 DSH 插件端点的 15 秒轮询可达状态。 | 仅以“本地 DSH Web 端点可达”解释，并在固定版本上做故障矩阵。 |
| [dsh-api-balance](#plugin-1334899834-root) | 在 DSH Web 输入框旁轮询显示 DeepSeek API 余额与可用状态。 | 先在隔离环境核凭证执行与路由权限，使用低频或手动刷新，再评估真实账户接入。 |
| [dsh-archived-conversations](#plugin-1335060115-root) | 在DSH设置页列归档会话并只读预览最近六条用户/助手文本，不切换或恢复会话。 | 本地HTTP单用户只读辨认可试用。 |
| [dsh-at-skill](#plugin-1346023186-root) | 给Web输入框增加@Skill候选，并在host模型步骤前加载匹配且可用户调用的Skill。 | 命名清楚且宿主匹配时试用，轨迹核加载来源。 |
| [dsh-audiobook](#plugin-1426914549-root) | 搜索或导入读物并分段朗读，保存收听进度、位置心得，支持语音记录和AI讨论。 | 可让有授权低敏感读物的个人先试用浏览器语音与单本书，抽查提取和断点再启AI/云语音。 |
| [dsh-auto-shutdown](#plugin-1425073734-root) | Windows 专用设置开关，在根对话结束时安排一次性关机并弹出取消倒计时。 | 仅建议在隔离 Windows 测试机以 dry-run 和可保存任务观察；关键工作或无人值守场景待一致性故障修正和实测后再评估。 |
| [dsh-balance-chip](#plugin-1347136944-root) | 在 DSH web 侧栏与右下角显示经主机查询的 DeepSeek API 余额状态。 | 建议观察；若试用，应使用隔离 Key 与可核账户余额，先测非美元/错误值、route 访问和停用后请求是否停止。 |
| [dsh-boo550wt-animation](#plugin-1422328385-root) | 为DSH启动增加视频、图片、网页或内置游戏遮罩，支持素材上传与跳过。 | 先观察；有明确需求者仅本地图像短时长隔离验Esc/按钮/错误与禁用，不先用不可信HTML/远程/重3D。 |
| [dsh-butler-memory](#plugin-1335928912-root) | 历史 DSH Bundle：接 Butler Memory MCP agent 工具及 Web 用户记忆审阅面板，作者已停止维护。 | 只作为历史参考；存量实例先隔离验权限、修订、崩溃/超时恢复和当前 DSH 契约。 |
| [dsh-callout](#plugin-1359145352-root) | 在DSH Web将首行五类GitHub式提示标记呈现为主题卡片，监听流式DOM更新并在卸载时有条件恢复标记。 | 有条件试用，兼容Web/偏好重点卡片用户先核流式/主题/卸载与非标记拒绝；不将视觉类型当内容审查。 |
| [dsh-capability-index](#plugin-1335594781-root) | 在每步系统上下文中注入候选工具提示，用规则、向量召回与 not_for 过滤预审插件库。 | 不建议作为当前生产依赖：仓库已归档且作者承认 16 样本不足。 |
| [dsh-chat-width](#plugin-1339332869-root) | 为旧版 DSH web 扩大聊天内容列并提供拖拽调宽，检测到新版原生把手时让位。 | 当前组件推荐观察。 |
| [dsh-chatgpt-style](#plugin-1421963463-root) | 调整 DSH 对话与侧栏样式、标注语义文字，并添加思考/快速模型档位切换。 | 限本机非关键 UI 观察，选档仍核宿主当前模型与计费；待可逆卸载和同名模型修正后再扩大使用。 |
| [dsh-client-ui-aqua-patched](#plugin-1378742722-root) | Aqua 玻璃主题的非官方修补分支，针对 DSH 0.1.2-rc.1 修三处加载/设置入口问题。 | 固定版本的隔离 profile 装入、核哈希、重跑 CDP 与人工视觉/开关测试，确认许可再部署。 |
| [dsh-codefall](#plugin-1409889533-root) | DSH Web/桌面首帧数字雨与绿色主题插件，支持光门、画质和播放时机设置。 | 非关键 profile 先试，实机核启动/窗口恢复/减少动态/卸载；卡顿时先关闭动画。 |
| [dsh-codex-cua](#plugin-1426892789-root) | 把 Codex 桌面端的本地 computer-use 运行时以 DSH Skill 形式安装并复用。 | 仅适合已经配置并信任 Codex CUA、Chrome 扩展和 macOS AX 权限的技术用户观察；不应把它用于不可逆提交、付款或敏感应用。 |
| [dsh-commandcode-usage-inline](#plugin-1358821276-root) | 在对话输入区旁显示 Command Code 五小时、周额度和 credits。 | 可在单账户非关键 profile 试用，先断开 provider、切换账户并等待两个轮询周期；不能把徽标当账单最终依据。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 在DSH会话输入工具行增加展开按钮，切换70vh长稿视图、记忆浏览器状态，并在展开时调整普通Enter行为。 | 有条件试用，长草稿/单composer用户先核Enter、IME、菜单与收起行为；不作为草稿备份。 |
| [dsh-computer-use](#plugin-1335236592-root) | 为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。 | 先观察，仅研究者可丢弃无秘密环境评估，先修元素TTL/会话/图像变换与效果状态，不直接启日常桌面全权。 |
| [dsh-context-guard](#plugin-1396768359-root) | 基于DSH上下文占用投影显示提醒，生成机器事实交接草稿，并记录压缩前读数台账。 | 适合有长会话交接需求的人在私有路径和非敏感任务上试用，先了解草稿和台账两种写入；人工补充约束再迁移，意外落盘、丢块或迁移负担过高时停用。 |
| [dsh-cortex](#plugin-1366089972-workspace-plugins-dsh-cortex) | 按会话静默相位巩固工具经历成长期记忆卡，跨会话召回并对重复告警降噪。 | 在个人隔离目录试验，先检查错误消息是否可持久化，关闭或限制召回并追踪误命中。 |
| [dsh-crypto-portfolio](#plugin-1342742812-root) | 通过 DSH 启动 Python 本地资产仪表盘，聚合链上/CEX 余额、历史、来源和健康视图。 | 仅作辅助观察；先限制 API 可达性、验证密钥保护并用自己的账本对账，关键财务判断暂不依赖单一总额。 |
| [dsh-cua-pre](#plugin-1346533795-root) | Windows UI Automation 优先的 DSH 桌面控制插件，包含 Python worker、30 工具和 Web 面板。 | 隔离 Windows profile 开始，以最小目标 PID 配白名单并检查日志可写；非幂等动作结果不明时先重观察/人工核，避免自动重放。 |
| [dsh-custom-plugin](#plugin-1342948215-root) | DSH Web 多功能便利套件，集外观、会话/提示词、用量预算、Mermaid 和备份于一体。 | 隔离 profile、备份状态，先测最需要的 2-3 项，再验来源围栏、并发保存与账单对照。 |
| [dsh-cyber-particle](#plugin-1334274281-root) | DSH Web Canvas 粒子网络背景，提供设置页与本地持久化。 | 作为个人装饰观察；减动效用户和低性能设备建议先关闭或等修复/性能验证。 |
| [dsh-desktop-uia](#plugin-1381221232-root) | 通过 Windows UI Automation 暴露桌面观察、动作与审批。 | 建议观察。 |
| [dsh-dictation-hotkey](#plugin-1414017637-root) | 给 DSH Web 输入框增加按住或切换式语音热键，复用宿主转写并填入/可选发送。 | 建议观察，先关闭自动发送，在测试会话和慢转写场景核落点；敏感语音先核 provider 处理位置。 |
| [dsh-discord-richpresence](#plugin-1342915339-root) | 将 DSH 粗粒度活动经本地 Discord IPC 发布为 Rich Presence，丰富模式可附步骤/tokens/思考时长。 | 用隔离 Discord 账号核状态可见范围与断连行为，再决定是否配置文案/丰富模式；详见[Q02](#research-q02)、[Q03](#research-q03)。 |
| [dsh-douyin-webview](#plugin-1423040689-root) | 在 DSH 桌面页脚打开可拖拽的抖音 Electron webview，使用桌面浏览器租约。 | 仅在桌面、允许个人娱乐且愿核第三方账户/资源风险的非关键环境观察。 |
| [dsh-draft-attachments](#plugin-1414492607-root) | 把DSH输入框未发送的图片和文件保存到IndexedDB，在会话输入区重新挂载时恢复附件。 | 先观察，暂不把它当日常附件保护。 |
| [dsh-drag-and-drop](#plugin-1333975935-root) | 为 DSH Web 拖入文件/文件夹生成可删除路径 chip，并在发送时插入会话草稿。 | 建议观察，继续可从可信本机Host、明确session归属及合成同名/异步切换场景研究来源匹配；不作原件身份保证或远端文件上传工具。 |
| [dsh-draw-gacha](#plugin-1335791040-root) | DSH Web 拉杆发送与流式信号驱动的 3D 娱乐抽卡演出。 | 限个人娱乐试用；不能用稀有度评价模型。 |
| [dsh-edit-question](#plugin-1426619074-root) | 在 DSH Web 编辑轮首提问、保留图片并 fork 新会话重发，可选择归档原会话。 | 保留原会话，先以非敏感文本/图片小任务试用，核对首轮与中间轮前缀；含文件、删除敏感历史或切点不明时停止。 |
| [dsh-effort-slider](#plugin-1335766616-root) | 给DSH模型思考档位提供滑块反馈，并向pi-ai缺失声明的模型补写reasoningEfforts与方言配置。 | 备份后单route试用，核实际请求及最后选择。 |
| [dsh-eye-comfort](#plugin-1426448931-root) | 为 DSH 提供主题、字体字号、内容宽度、对比度、纸张纹理与动态效果设置。 | 单主题小范围试用，核代码/中文/链接、重启保存与禁用恢复；不把名称推为健康效果。 |
| [dsh-forget-session](#plugin-1413882487-root) | 永久删除会话多层状态并防止幽灵复活。 | 建议观察。 |
| [dsh-fullscreen-input](#plugin-1407166868-root) | 为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。 | 固定宿主长文编辑可试用，先小草稿检查引用附件。 |
| [dsh-gotify-notify](#plugin-1412623357-root) | 按 DSH 轮次结束和可选提问事件向自管 Gotify 推送通知，并提供设置页测试入口。 | 先用测试按钮核凭据与服务，再逐类事件矩阵验证；关键告警不能仅依赖此尽力推送。 |
| [dsh-gui-guard](#plugin-1422121370-root) | 为 Windows 窗口提供状态检查、前台准备及带坐标口径的点击与输入工具。 | 真实业务桌面当前建议观察；隔离试用先以 PID 定位和 probe 核查，若 isForeground=false、点位越界或光标不匹配就停止人工接管。 |
| [dsh-harness-chat-control](#plugin-1357066651-root) | 为 DSH 对话提供原生引用胶囊、侧栏追问、原位编辑和侧栏标签批量关闭。 | 建议观察。 |
| [dsh-heatmap](#plugin-1334318461-root) | 从全部DSH会话usage和工作区Git历史生成侧栏热力图、今日token/cache及模型费用估值。 | 先观察，先核usage/价格/缺数和禁用授权再评估趋势面板，不能作精确支出核算。 |
| [dsh-im-qq](#plugin-1335806472-root) | 将QQ私聊、群和频道文本接入DSH完整Agent，提供会话恢复、回复分段与审批桥。 | 观察，继续从严格单人身份、最小Agent权限和可审计任务/回复入手。 |
| [dsh-inline-images](#plugin-1334134226-root) | 将助手文本中的绝对图片路径改写成可加载的本地路由，并提供灯箱和尺寸设置。 | 仅在可信隔离环境试用，先核 Host 外围访问边界与远程客户端，再评估稳定性和资源。 |
| [dsh-inpage-translator](#plugin-1422488467-root) | 在DSH浏览器页面注入翻译按钮，按文本去重分块调用宿主模型，缓存译文并提供翻译、还原与状态工具。 | 观察，先修文本节点/还原、宿主许可和文档版本边界，再考虑非敏感小页试用。 |
| [dsh-keyboard-manager](#plugin-1359145374-root) | 在 DSH Web 用可配置 Ctrl 快捷键切换左右栏与设置。 | 观察，优先避免默认 Ctrl+S 或仅隔离试用；在编辑界面核保存键后再常用。 |
| [dsh-language-guard](#plugin-1424475406-root) | 在系统提示、周期提醒和界面快捷入口中锁定模型输出语言。 | 可在非关键会话试用 Basic，并从 session log 验证 section 数和实际语言；清理 dsh-context 重复约束后再评估 Strong/Periodic。 |
| [dsh-mac-companion](#plugin-1384810483-root) | DSH 经 HTTP 调用 macOS Companion 的通知、Shortcuts 和剪贴板工具。 | 先健康/通知在可信隧道内试用；剪贴板/Shortcuts 须有独立用户审批与服务端约束。 |
| [dsh-memory-setup](#plugin-1337350700-root) | 提供工作区JSON偏好、规范、工作流与教训记忆，含DSH工具、提示注入、知识检索及备份恢复接口。 | 当前不推荐直接启为真实高信任记忆层。 |
| [dsh-message-ops](#plugin-1389945615-root) | 为 DSH 提供消息回撤、删除显示与恢复操作及对应模型工具。 | 可在备份后的非关键会话试用。 |
| [dsh-monitor](#plugin-1333440937-root) | 通过文件或命令轮询监听新内容，空闲时唤醒所属Agent，并提供查看和停止工具。 | 观察，可信单用户file场景可继续探讨，但保外部日志补读，避免唯一通知链。 |
| [dsh-need-finder](#plugin-1336571882-root) | 用本地固定插件目录做中英文词法加权检索，返回命中理由和命令文本，并给出社区套装有序安装计划。 | 观察，先补真实描述/来源/版本与约束，作为探索入口而非可信安装名单或环境求解。 |
| [dsh-neo-skin](#plugin-1335557891-root) | 为 DSH Web UI 叠加两套新粗野主义配色和结构样式。 | 个人隔离 profile 先做浅/深/系统、双方案与开关的视觉回归。 |
| [dsh-notification-desktop](#plugin-1428147033-root) | 在 DSH 0.2.x 轮次结束时按原因与后台状态触发桌面或浏览器通知。 | 先观察并核制品/路由，Windows非敏感任务以实际toast验收后再试用；Mac/Linux桌面不依当前路径。 |
| [dsh-peak-runner](#plugin-1417227361-root) | 按配置峰谷时段排队模型文本任务，提供执行、状态查询和取消工具。 | 自动节费/按时交付主诉求暂不推荐；可用模拟任务观察队列，但必须人工再触发并核实际模型/账单。 |
| [dsh-perlica-ding](#plugin-1335704653-root) | 按DSH计划、执行回合收尾、待回应与错误事件播放四类本地音效，提供PCM音量缩放、设置保存和试听界面。 | 有条件试用，可信本机小PCM/低音量先核事件和设备；声音不是任务验收，远端和严格隔离提醒先观察。 |
| [dsh-pet-live2d](#plugin-1378097401-dsh-live2d-pet) | 为 DSH Web/可选桌面层提供随会话状态变化的 Live2D 宠物、装扮、提示音和共享设置。 | 个人隔离安装可试用；先备份 pets 和设置，用改资源不改 manifest 的升级副本测覆盖。 |
| [dsh-pick](#plugin-1423941835-root) | 从插件目录搜索、比较和排行 DSH 插件，并提供下载指标与宿主安装入口。 | 可把它当候选搜索和数字比较工具试用；先核对日期与兼容，再读目标插件权限和源码。 |
| [dsh-pinned-sessions](#plugin-1407379611-root) | 为 DSH 侧栏提供跨工作区置顶会话分组，支持组内搜索、状态显示、打开与取消置顶。 | 建议多工作区少量重点会话用户试用，核对顺序、状态和取消置顶；DOM变更、双挂载或操作失败不清时停用，回到原生导航。 |
| [dsh-plugin-auto-answer](#plugin-1423966960-root) | 无人值守时为 DSH 用户问题设倒计时，超时由 Host 代选推荐项或默认项。 | 隔离低影响任务试用，配置 fallback:none/freeText:block/planReview:ignore，核 timed 工具窗口。 |
| [dsh-plugin-crypto-ticker](#plugin-1389061748-root) | 在 DSH Web/Desktop 侧栏显示多源加密货币价格、24 小时涨跌与迷你走势。 | 只作为个人参考并核交易所官方报价；不用于下单、风控或自动策略的唯一价格。 |
| [dsh-plugin-focus](#plugin-1336084195-root) | 为DSH提供工作区内的持久焦点板，模型可记录目标、约束和决定，按标签汇总，并在每轮或内容变化时自动注入上下文。 | 先观察。 |
| [dsh-plugin-local-life](#plugin-1336663652-root) | 提供本地生活算术工具，含预算、分摊、比价、折扣、换算、贷款与清单。 | 仅在低风险、同单位且人工复核的算术任务观察；跨单位比价和贷款勿直接用于资金决策。 |
| [dsh-plugin-mac-notify](#plugin-1402940561-root) | 在macOS通知中心提醒DSH回合结束、等待回答、等待批准与错误，并可点击返回DSH页面。 | Mac个人用户可先在非敏感任务试用需要的提醒，核对多会话和返回归属；通知漏掉关键事件时回DSH直接观察，不当作审批执行或业务完成证明。 |
| [dsh-plugin-notes](#plugin-1363429979-plugin-notes) | 把 Markdown 便签、任务泳道、新会话执行、定时调度与 WebDAV 备份组合在 DSH 中。 | 先小规模个人便签试用；任务派发用隔离工作区，定时执行须监控；删除后手动备份并验证远端。 |
| [dsh-plugin-offpeak-badge](#plugin-1402828137-root) | 在 DSH Web 显示 DeepSeek API 模型价格空闲/高峰时段徽章与切换提示。 | 观察试用。 |
| [dsh-plugin-recommend](#plugin-1336684098-root) | 从内置市场目录做需求词法排序、分类详情与相似候选搜索，可显式从固定HTTPS README刷新目录。 | 观察，先加刷新来源/字段质量门，将结果当相关候选而非安全/安装推荐。 |
| [dsh-plugin-session-colors](#plugin-1394188597-root) | 通过侧栏悬停palette为会话设置颜色，host保存id颜色映射并以浏览器镜像加快显示。 | 先观察；独立本机/唯一标题与备份下核持久结果后再评估。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。 | 建议先小范围试用。 |
| [dsh-profile-stylist](#plugin-1422500224-root) | 用宿主 LLM 起草 GitHub/Gitee 个人资料，默认 dry-run，确认后经浏览器填文本/头像并点击保存。 | 先在测试账号观察；直接 apply 统一校验与 Gitee 头像确认修复、远端回读之后才扩大使用。 |
| [dsh-prompt-optimizer](#plugin-1403959948-root) | 先澄清需求再用Harness或Codex生成可编辑预览，确认后填入草稿并由读者自己发送。 | 兼容Web/桌面Harness无工具路径可试用，Codex/TUI先核权限/回执，人工审稿并自己发送。 |
| [dsh-prompt-polish](#plugin-1336538202-root) | DSH Web 输入栏提示词重写 UI；经 Typert RPC 调用宿主已配置模型，先展示结果再人工采用。 | 先在隔离 Web profile 用非敏感草稿、关闭历史试用；再按需开上下文并确认 provider 与工作区路径。 |
| [dsh-receipts](#plugin-1344714660-root) | 汇总本地 DSH 会话与工具痕迹，生成 Markdown 和离线 HTML 报告，可选本地 Git 提交核对。 | 建议观察，先复制日志并关闭 Git 核对，审阅原始会话与输出；对外分享须人工脱敏，不能把活动跨度或提交数当绩效证明。 |
| [dsh-right-click-menu](#plugin-1404720276-root) | 在 DSH Web 的文件树、聊天路径和链接上提供上下文菜单与文件操作。 | 建议观察，在隔离目录先做预览、复制和小文件保存；写入前核目标及覆盖，敏感/大文件暂不依赖菜单保证。 |
| [dsh-rtl-chat](#plugin-1410794267-root) | 给会话消息区提供RTL/LTR切换和本地偏好，代码保持LTR，适合阿拉伯语阅读。 | RTL读者本地试用，混排不合适随时切回。 |
| [dsh-scroll-piano](#plugin-1412162067-root) | 把对话滚动位置映射为音高，并用消息刻度提供跳转导航。 | 保持观察；仅对明确喜欢听觉反馈的个人用户，在长会话和读屏环境先核 CPU、焦点、静音及 DOM 升级回退。 |
| [dsh-session-path](#plugin-1412141303-root) | 复制DSH会话日志位置，或把压缩日志导出为可读交接文件，便于另一个会话阅读接续。 | 先观察，继续核真实路径授权、导出完整性与JSONL最新语义，再对受控日志研究接续效果。 |
| [dsh-session-rename](#plugin-1368115538-root) | 向模型提供 rename_session 工具，显式设置当前或已加载会话标题。 | 先仅省略 session_id 命名当前会话；多用户前核宿主权限。 |
| [dsh-session-turn-eta](#plugin-1368581082-root) | 按会话步长历史估计回合剩余时间，在输入框下显示时间型进度和中断状态。 | 作为等待提示试用，不据百分比承诺交付。 |
| [dsh-side-session](#plugin-1355639507-root) | 从命令菜单创建可继续的旁会话，并在Web自动打开对应子会话视图。 | 先观察，核/修创建ID关联、目录时序与恢复凭据后再评估试用。 |
| [dsh-sidebar-panel-fold](#plugin-1426455774-root) | 把 DSH 左侧全局面板列表收成一行，并通过浮层切换面板和保存折叠状态。 | 可在面板很多的独立profile试用，先逐个核对浮层切换和展开恢复。 |
| [dsh-skill-manager](#plugin-1336106328-root) | 在Harness设置页分层浏览、编辑技能，支持zip导入导出、删除与启停。 | 建议观察；有编辑需求者可先只读浏览并备份后改单文件，不应依赖当前zip导入迁移复杂技能。 |
| [dsh-soul](#plugin-1352089397-root) | 为DSH提供可切换人格、会话与工作区范围绑定、提示注入和个性化界面。 | 频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 |
| [dsh-sound](#plugin-1335332435-root) | 按完成、审批、提问、计划评审、受阻和失败播放独立声音，并区分主Agent/子Agent来源。 | 可试用作辅助通知，先内置低音量核主子频道/原UI，保留视觉提醒，不当唯一可靠通道。 |
| [dsh-speak](#plugin-1334493734-root) | 为DSH提供最终回复、审批与提问的语音播报、消息重播和设置界面。 | 观察。 |
| [dsh-spotlight](#plugin-1333136466-root) | 在DSH Web用一个快捷键面板搜索会话、slash命令、可见界面动作与插件设置入口。 | 兼容Web可有限试用，先备份/清空草稿并试无副作用导航，目标/回执未知就停止。 |
| [dsh-starter-zh](#plugin-1336658798-root) | 在会话中提供欢迎、五阶段入门路线、四组固定插件建议和十项自查清单。 | 先观察，资料可读参考但先修profile断链和版本/推荐来源，再评估安装必要性。 |
| [dsh-status-rotator](#plugin-1333328839-root) | 为 DSH 运行状态提供轮换文案、主题、弹幕与鲸尾动画，并保存词库与配置。 | 可在独立profile试用，先关闭额外动画确认状态与保存正常；依赖稳定运行状态的工作应保留原生显示和禁用入口。 |
| [dsh-stock-quotes](#plugin-1425208683-root) | 在 DSH 中展示股票观察列表和行情，并向模型提供 stock_quote 查询工具。 | 可当公开行情参考面板试用，优先使用明确市场代码。 |
| [dsh-study-coach](#plugin-1400498179-root) | 以学习预设、21个档案工具和网页面板管理目标、知识地图、练习证据、错题与每日任务。 | 先观察；可信本地非唯一档案，独立备份并用真实题目核掌握。 |
| [dsh-temptask](#plugin-1390600932-root) | 一键创建临时目录、工作区与会话，支持清理和搬迁转正，并以已完成事件前缀复刻对话。 | 先观察；单host可丢弃数据、独立备份、默认关自动清理可作对照。 |
| [dsh-text-inject](#plugin-1389458393-root) | 通过独立 Markdown 文件与设置页管理 DSH 系统提示词和运行时上下文的热加载插件。 | 只在受控 profile 观察试用；先删示例、核预览和路由权限，敏感提示词不直接放入。 |
| [dsh-think-bounce-pet](#plugin-1343882273-root) | 在 DSH Web 叠加常驻与思考弹球，可调整物理参数并交互。 | 仅当个人偏好装饰且可接受资源/遮挡时观察；勿把球当真实推理计时，低性能或减动效需求先关闭。 |
| [dsh-thumb](#plugin-1341694685-root) | 将DSH窄屏侧栏改为覆盖式抽屉，切换会话后关闭，并调整设置布局和对话密度。 | 个人窄屏用户可受控试用，先检查会话切换、设置与轨迹，保留?thumb=0后重载的退出路径；定位或触控出现影响任务的问题就停用。 |
| [dsh-tingdong](#plugin-1426519329-root) | 把英文音频或文档制成逐句听力课，提供翻译讲解、音轨、练习、间隔复习与导出。 | 可让能核对英文与译文的个人用短篇低敏感材料试用，先修ASR/翻译再练习；考试成绩承诺、无能力审校或要求原文严格保真的任务先观察。 |
| [dsh-toolbox-web](#plugin-1335244607-root) | 为 DSH Web 提供会话、目录、搜索、回收站、配置与预设等管理面板。 | 当前建议观察。 |
| [dsh-turn-outline](#plugin-1356219122-root) | 不调用模型，把DSH事件按用户轮次折叠为输入、工具与输出轨迹，并用seq定位回原文。 | 宿主授权明确的一人本地长会话可试用作导航摘要，远程/多用户先核会话授权。 |
| [dsh-type-tune](#plugin-1388463793-root) | 为 DSH Web 提供对比度/字体/内容样式与预览调节，Host 状态和浏览器本地缓存协同。 | 仅回环、单人 Web 可审慎试用，留默认恢复路径；LAN/多人环境先补认证与错误反馈。 |
| [dsh-typing-studio](#plugin-1428515480-root) | 在 DSH Web 提供中英文计时打字练习、中文拼音、IME友好计分与本地记录。 | 本机自我练习可试用，先核IME回改与重启；长期纪录/认证需求改独立受控测评。 |
| [dsh-ui-enhancer](#plugin-1339034478-root) | 组合右侧文件预览、@文件引用、本地壁纸和活动宠物，增强DSH web桌面体验。 | 先观察，优先核对活动路由授权与上游预览，明确边界后再评估个人本地小范围试用。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在DSH设置中展示本机1、7、30天Token图表、模型分布和技能调用状态，并支持重建派生缓存。 | 个人本机用户可用少量可人工核对的会话试用；先确认宿主依赖与访问控制，遇到用量无法对账、索引持续失败即停止依赖图表。 |
| [dsh-vision-fallback](#plugin-1333993743-root) | 保持原主模型选择，把聊天与工具图片交给固定视觉模型转成文字观察，并保留界面原图。 | 适合明确接受外部图片和上下文传输的人，以auto和非敏感单图试用，重要结论回图核对并管理本地观察日志；漏读、陈旧观察或退出失效时停用。 |
| [dsh-vision-free-eyes](#plugin-1335070045-packages-vision-tool) | 以智谱 GLM API 为后端的 DSH 单图 vision/OCR 模型工具。 | 取得用户对特定图片出站授权，检查 Key/额度，再在非敏感图片上验证失败/成功；详见[Q03](#research-q03)。 |
| [dsh-vision-route](#plugin-1335070045-packages-vision-route) | 把图片先交给智谱视觉转写，再把文本证据送入目标文本模型。 | 暂不用于含客户、凭证或内部截图的会话；仅在脱敏样本上观察转写丢失率，若已有原生视觉则不增加此路由。 |
| [dsh-vision-web](#plugin-1335664137-root) | 以豆包网页桥接、多类 API/CLI 通道为纯文本模型提供结构化视觉证据。 | 保持观察；不要以主 Chrome profile 或敏感截图试用，先用专用账号/临时 profile 固定一个通道，验证后再增加降级链。 |
| [dsh-voice](#plugin-1334554745-root) | 在 DSH 网页用麦克风或快捷键语音输入，支持本机 ASR 与浏览器识别并作为正常消息提交。 | 建议非敏感普通对话小范围试用，确认会话、真实引擎和停麦自动提交；误发、回退不透明或截断频繁时停止。 |
| [dsh-voice-input-web](#plugin-1335558973-root) | 为 DSH Web 输入栏增加浏览器 Web Speech 麦克风转写按钮，把识别最终文本写入草稿。 | 默认保持 autoSend 关闭，先用非敏感语音验证识别和草稿编辑；转写后人工检查再发送。 |
| [dsh-web-mobile-fix](#plugin-1334255250-root) | 为Harness网页提供窄屏布局修复，并适配悬浮窗口中的会话和输入交互。 | 建议观察。 |
| [dsh-web-url-view](#plugin-1366583376-root) | 给 DSH Web GUI 展示一次性 URL，并以默认全接口绑定的固定端口代理提供跨设备入口。 | 仅在可信 LAN 小范围试用，按需限制 bind/firewall；验证重启、WebSocket 和 401 写入。 |
| [dsh-whale-girl-live2d](#plugin-1387205322-root) | 将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。 | 个人非关键娱乐可观察；在开放敏感会话/余额前先验证并修正路由信任栅栏，商业复用须单独核素材授权。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 为DSH工作区和会话行增加右键/双击菜单，集中置顶、复制、归档及目录打开/删除操作。 | 先观察，优先核查/修正Host目标授权与分步恢复；UI关闭危险项不能替代Host控制。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从 WSL 调用 Windows 默认浏览器打开经过协议校验的网页地址。 | 适合频繁从 WSL 打开文档或本地服务、且只需要“打开”而非抓取/交互的用户试用。 |
| [dsh-wsl-cal](#plugin-1381860995-root) | 把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。 | 适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。 |
| [dsh-wsl-clipboard](#plugin-1350378372-root) | 在WSL内通过PowerShell读取或设置Windows文本剪贴板，带字符裁剪与结构化结果。 | 明确授权非敏感短文本可试用，保留原内容并核Windows实际文本，异常未知先停。 |
| [dsh-wsl-download](#plugin-1351854499-root) | 在 WSL 中列举或复制 Windows Downloads 单文件，并给出模型下载静态提示。 | 先 list、核源路径与目标目录，在空目录试单文件；大分片用有校验和断点机制的工具；详见[Q03](#research-q03)。 |
| [dsh-wsl-launch](#plugin-1350378498-root) | 从 WSL 通过受配置名单约束的 win_launch 工具启动 Windows 应用。 | 仅在需要 WSL 启动固定 Windows 应用时试用；先用精确名称/路径并审各应用 args，详见[Q03](#research-q03)。 |
| [dsh-wsl-notify](#plugin-1350379268-root) | 从WSL调用Windows MessageBox或NotifyIcon气泡显示短文本，气泡抛错时回退阻塞消息框。 | 明确授权非敏感短消息可试用，接受阻塞/fallback并保留原UI，不当唯一可靠通道。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。 | 建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。 |
| [dsh-wsl-shot](#plugin-1351854253-root) | 将 Windows 剪贴板图片经 PowerShell 临时 PNG 复制为 WSL 文件，供后续多模态使用。 | 仅用非敏感图片在隔离 WSL 试用，先核 Public 权限、失败清理、输出目录和后续多模态接续；详见[Q03](#research-q03)。 |
| [dsh-wsl-uia](#plugin-1391141792-root) | 从WSL读取Windows顶层窗口和UI Automation控件树，提供过滤查找、按名等待和祖先路径，并给元素标注观测内句柄。 | 先观察，可用无敏感测试窗口纯观察，先解决目标/预算/隐私与动作消费者契约，不直接当安全自动操作基础。 |
| [dsh-wsl-wininput](#plugin-1391142149-root) | 让 WSL 中的 DSH 按窗口和 UI Automation 元素定向发送 Windows 输入。 | 建议观察。 |
| [dsh-youreyes](#plugin-1335045545-root) | 将图片交给视觉模型生成文字记录，供 DSH 文本模型调用，支持 OCR、区域、多图与记忆复用。 | 建议观察，先补发布物和数据边界，以不敏感有标签图片验证；不把auto或结构化记录当隐私/准确保证。 |
| [dsh-yukimi-theme](#plugin-1335281982-root) | DSH Web 佐城雪美主题与 Windows desktop profile 桌宠通知，素材从外部 wiki URL 加载。 | 先在隔离 Web 看可读性，再完整打包桌面副本、核通知/回滚和素材权利。 |
| [feiyu-memory](#plugin-1415822787-root) | 为Harness保存人格内核、判断和情景日记，并在后续会话按相关性召回记忆。 | 建议观察，不用于正式工作、多人或敏感会话。 |
| [harness-memory](#plugin-1333716755-plugins-harness-memory) | 通过 DSH 存储域保存、删除长期记忆，并按标签注入后续会话系统提示。 | 可在单项目或隔离profile保存少量非敏感偏好试用。 |
| [hover-glossary](#plugin-1374454334-root) | 在DSH聊天正文悬停显示本地词库的一到多条释义，支持大小写/全角归一化与中文最长词匹配。 | 先观察，非敏感个人环境按诊断策略可限定试用；保密/键盘优先需求应先处理日志与交互边界。 |
| [ikun-theme-skin](#plugin-1335144603-root) | 给 DSH Web 添加三套 IKUN 配色、壁纸、音乐、发送音效与娱乐化 UI。 | 个人隔离试用，需能关闭音效并核原外观偏好；共享环境先经用户选择。 |
| [messaging-core](#plugin-1335798113-packages-messaging-core) | 把多种消息平台接入DSH，共享聊天会话映射、流式出站路由、白名单配置和消息工具。 | 先观察，继续核查可用无账号adapter桩验证出站权限和投递状态，再按明确授权评估单平台单用户；暂不把整套作默认多人远程入口。 |
| [oil-dsh-title](#plugin-1374149009-root) | 按最近用户消息异步维护DSH会话标题，采用emoji与对象/持续目标格式并调用官方rename。 | 先观察；敏感/重要会话应先有人工命名保护与最小输入策略。 |
| [Prompt Desk](#plugin-1418691015-root) | 在对话标题栏编辑全局及共享会话提示，并管理可注入的错误教训库。 | 个人隔离 profile 验证路由权限和多会话行为；只采纳人工核实的教训。 |
| [插件名片](#plugin-1424219088-root) | 为DSH插件换图标、中文备注和说明，支持文件夹、收藏、排序、导入导出及启停卸载。 | 先观察，继续研究从授权边界、可信图标和可恢复备份着手。 |

<a id="plugin-1341946801-root"></a>

## [@luziyang2026/dsh-question-nav](../../plugins/abelkeithsun--dsh-question-nav/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,224](https://img.shields.io/static/v1?label=npm+30d&message=1%2C224&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)

> **用途**：DSH Web长会话用户需要回看早先问题和时间。详见[Q01](#research-q01)。

> **亮点**：将完整问题投影与轻量条带、按需历史加载联结，减少长会话手工翻找。详见[Q01](#research-q01)。

> **思考**：只索引首内容块，异步分页没有取消/强制截止，所谓nearest回退实际取最早行，跨会话点击可能陈旧滚动。详见[Q03](#research-q03)。

> **建议**：可研究带会话/代次的取消导航和多块文字索引，以切会话、双点击和挂起反例比较误跳与延迟。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1363429979-plugin-daily-log"></a>

## [@zzerx/dsh-plugin-daily-log](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-daily-log/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,971](https://img.shields.io/static/v1?label=npm+30d&message=1%2C971&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-daily-log)

> **用途**：面向有Git提交或本地Claude/Codex/DSH对话的知识工作者，按日期/项目整理日报周报月报。Git提供提交活动，对话提供提问与模型回答，模板给业务章节；无需每个项目都有Git。历史报告本地管理、导出Markdown，适合先由本人校对再用于工作汇报。

> **亮点**：将Git和三类本地日志归一为项目活动，按agent启用工具并用组索引下钻，再由模型按模板成文。详见[Q02](#research-q02)。

> **思考**：Git超过500条无截断收据，agent scan丢service partial/错误；提示确认没有状态token，approval缺失/never放行，任意输出目录可同名覆盖。活动不等于业务完成。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索渠道覆盖收据、活动ID事实链接、正文hash确认和版本/批准根导出，比较召回/误报与额外成本；未实现。详见[Q07](#research-q07)。

<a id="plugin-1417442557-root"></a>

## [agent-clinic](../../plugins/1687210989--agent-clinic/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/agent-clinic)

> **用途**：个人维护者排查失败、Token和资产使用线索，逐条查原日志后决定是否调整；合格交付是可复核候选解释和动作，非自动因果诊断。

> **亮点**：把本地事件定位、真实profile当前值和可执行处方联结，撤掉已不弱于建议的动作并保留实例证据，比泛化优化建议更具体；仍属启发式调查流程。详见[Q03](#research-q03)。

> **思考**：E1按整会话同参数组筛布尔错误，没有比较错误内容或连续性，却输出连续同错；高输出和跨会话复问也不证明浪费或失忆。web访问控制和默认抄录需独立核对。详见[Q04](#research-q04)。

> **建议**：可探索反例优先的处方评估收据，用固定任务与源摘要同时比较指标、交付质量及人工/费用，避免把不命中当问题解决；未实现。详见[Q08](#research-q08)。

<a id="plugin-1414238544-root"></a>

## [AIR-pixel Liquid Glass](../../plugins/air-pixel--air-pixel-liquid-glass/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)

> **用途**：希望统一调整 DSH 桌面/Web 视觉外观并保留可配置入口的用户可用它通过客户端样式和宿主配置接口为 DSH 增加磨砂表面、壁纸、透明度、光标与点击反馈；合格结果是主题在目标宿主正确加载、关键文字可读、交互区域不被遮挡且可以安全恢复默认。详见[Q01](#research-q01)。

> **亮点**：把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担。它相对“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可把关键表面与对比度探针纳入主题配置预览，在应用前给出宿主版本和可访问性回归报告。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1378933589-adapters-dsh"></a>

## [Amoji for DSH](../../plugins/5101good--amoji--adapters-dsh/INSIGHT.md)



> **用途**：面向希望以图形表达固定意图、同时让模型读取明确语义的用户；合格交付包含指定版本表情、对应语义与独立的消息和显示状态。

> **亮点**：相对粘贴图片或普通emoji，关键增量是固定语义、版本化库与原生消息回执组合，使图像、语义和操作身份可核对；核心能力属于共享库，DSH组件贡献在宿主桥接。[Q01](#research-q01)

> **思考**：宿主接受、消息落盘与图片渲染是不同事实，不能用accepted宣布完整送达；本地共享服务、宿主版本及不同提供方工具续答仍约束可用性。[Q03](#research-q03)

> **建议**：未验证假设是将同一操作的消息观察与渲染回执做成统一核对页，减少未知结果后的重复发送；以断连、刷新和重启下的重复数与人工核对时间检验，若回执缺失仍无法归因则不成立。[Q05](#research-q05)

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

## [chicheng-vault](../../plugins/534119219--chicheng-quickinput/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/534119219/chicheng-quickinput)

> **用途**：适合重复填入服务器地址、手机号、URL 或受控秘密；密码管理器或只填不发送的剪贴板工具有更成熟的安全边界。 详见[Q01](#research-q01)。

> **亮点**：私密/非私密分层、自动锁定、模式建议和 WebDAV 备份形成完整输入工作流；创新不等于适合把秘密交给模型。 详见[Q03](#research-q03)。

> **思考**：Ctrl 点击可直接发送，解锁后明文位于浏览器内存；安全短语相当于第二凭据，XSS、同 profile 插件和 WebDAV 恢复链均需考虑。 详见[Q04](#research-q04)。

> **建议**：将“填入”与“发送”彻底分权，私密项永不自动发送且显示目标模型/会话确认，可显著减少秘密进入上下文。 详见[Q08](#research-q08)。

<a id="plugin-1409724830-src"></a>

## [cute-fat-fish-pet / src](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

> **用途**：想在 DSH Web 或桌面显示动画宠物，并与当前模型或本地桌面模型互动。

> **亮点**：把 VP9-alpha 动画、桌面交互和 DSH 会话模型对话组合成宠物插件。详见[Q01](#research-q01)。

> **思考**：发布 lib 与 TS 的能力不同；可选屏幕观察会保存截图/附件并交宿主模型，local 标签不单独保证目的地，关闭不取消在途且路由准入依外层。详见[Q04](#research-q04)、[Q05](#research-q05)、[Q06](#research-q06)。

> **建议**：首次外部下载、在线记忆发送与屏幕能力单独显式提示并作出站测试，可提高可理解性；待实机。详见[Q03](#research-q03)。

<a id="plugin-1427089201-root"></a>

## [Cutout Pet · 抠图桌宠](../../plugins/alannerfranklin--dsh-cutout-pet/INSIGHT.md)



> **用途**：面向希望在 Harness 网页展示个人形象并顺手查看余额的用户；只作用于网页，合格结果是可接受图像、持久显示、位置可恢复和正确账户状态。

> **亮点**：在 DSH 中串起本地抠图预览、Host持久化、比例拖动锚点和余额气泡，较外部编辑加贴图减少跨工具交接；增量在宿主集成而非新分割算法，尚无效果排名或首创证据。见[Q03](#research-q03)。

> **思考**：核心质疑是“任意图片”和“每profile一宠/不离本机”是否被实际边界支持。颜色键会受素材限制，短边约束前后不一致；文件和缓存未显式按profile/账户分区，远端Host部署时PNG会跨机器。以上是源码条件与风险，未声称已复现泄漏。见[Q02](#research-q02)、[Q04](#research-q04)。

> **建议**：未验证假设是以共享图像资格契约和可解释删除/尺寸警示替代仅靠视觉预览，可减少误删及保存返工；以20张分层素材比较最终合格率、拒绝、调整次数与耗时，警示无收益或误拒增加即否定。该方案未实现，不计为现有贡献。见[Q08](#research-q08)。

<a id="plugin-1343679449-root"></a>

## [deepseek-harness-hello-kitty-suite](../../plugins/angel2518975237--deepseek-harness-hello-kitty-suite/INSIGHT.md)

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite)

> **用途**：个人 DSH 用户希望个性化 UI 并在回合结束时获提醒。

> **亮点**：将皮肤和轻量结束提醒打包；提醒无需外部服务。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：全局 seq 无会话/结果，当前 DOM 问号判提问；隐藏页没有提示音，README 与实现不一致。素材公开再分发需权利审查。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：带会话/结果 ID 的事件推送可减少误提醒与轮询；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1340492214-root"></a>

## [dock-files](../../plugins/aks1st--dock-files/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-files) [![npm 30d 1,336](https://img.shields.io/static/v1?label=npm+30d&message=1%2C336&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-files) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-files)

> **用途**：面向已有dock-base工作区、希望在会话旁查看与整理文件的用户；合格结果是打开正确会话目录并在明确范围内完成文件操作。

> **亮点**：相对系统文件管理器，贡献在当前会话上下文与Dock查看器衔接；基础文件及信任围栏代码注明来自dsh-better-sidebar，主要是集成适配，不宣称原创文件安全机制。[Q01](#research-q01)

> **思考**：浏览器Host/Origin围栏明确不是身份认证；普通操作缺sessionId时回退process.cwd，probe又刻意不做工作区限制，不能把“会话范围”宣传当统一强隔离保证。[Q03](#research-q03)

> **建议**：未验证假设是将写操作统一要求有效sessionId，并复用宿主认证通道，减少错目录及裸本地请求；用缺失、失效会话和符号链接任务比较拒绝正确性与操作负担，若破坏合法恢复且收益不足则否定。[Q05](#research-q05)

<a id="plugin-1340492378-root"></a>

## [dock-images](../../plugins/aks1st--dock-images/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-images) [![npm 30d 1,028](https://img.shields.io/static/v1?label=npm+30d&message=1%2C028&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-images) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-images)

> **用途**：已用dock/files的用户内嵌看授权图片，不编辑原图。

> **亮点**：把成熟图片解码和视图操作接入dock，减少切应用；非新图像技术或通用文件授权。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：Host不限制图片类型/工作区，fence通过可取进程可读绝对文件；stat/read分离和像素/解码错误缺口使体积cap不足。详见[Q02](#research-q02)。

> **建议**：可探讨特定文件能力/同句柄字节与像素限制及解码状态收据，授权/格式解析成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1340492424-root"></a>

## [dock-markdown](../../plugins/aks1st--dock-markdown/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-markdown) [![npm 30d 878](https://img.shields.io/static/v1?label=npm+30d&message=878&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-markdown) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-markdown)

> **用途**：在 DSH dock 工作台阅读 README/文档并跳转编辑或相对资源。

> **亮点**：在 dock 文件域提供一体化 Markdown 阅读、大纲、相对资源与编辑切换。详见[Q01](#research-q01)。

> **思考**：受信 Host/Origin 调用方可传任意 basePath+相对 ref，在宿主可读且≤20MiB时取回文件；路由缺文件级授权，详见[Q02](#research-q02)。

> **建议**：将解析授权绑定会话中真实打开文件及允许根、禁止 traversal 并限制资源类型，可保留体验且收紧读权限；待验证。详见[Q02](#research-q02)。

<a id="plugin-1400109121-root"></a>

## [dock-spreadsheet](../../plugins/aks1st--dock-spreadsheet/INSIGHT.md)

[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)

> **用途**：适合在DSH dock-files工作流查看本地XLSX/XLS/ODS/CSV/TSV数据、按当前工作表查找/筛选并引用单元格坐标的用户。基线下载/另开桌面电子表格，或文本预览CSV；这里把同文件只读网格嵌回dock，不需上传第三方服务。

> **亮点**：整合成熟解析/网格库到dock文件查看协议，保偏移行列坐标、预览受限标记与安全文本/生命周期，减少外开表格切换。详见[Q02](#research-q02)。

> **思考**：只读和同源不等授权隔离，允许工作区外绝对路径；20MiB/5000行256列不限制全书主线程解析，显示字符串排序也非数值计算。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索授权文件快照、有限读取/Worker解析预算与明确缓存/排序口径的预览收据，以资源和坐标语义共同证伪；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336994666-root"></a>

## [DPH 任务看板](../../plugins/1070296335-create--dph-taskboard/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard)

> **用途**：同时推进多个 DSH 会话、需要可视化归类和复盘的个人或小团队可用它把真实 DSH 会话作为看板卡片，提供状态拖拽、新建会话、回收站、备注、搜索和导入导出；合格结果是看板状态与真实会话一致，删除可恢复，导出导入不丢关联，Agent快照不泄漏或误覆盖状态。详见[Q01](#research-q01)。

> **亮点**：把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转。它相对“使用宿主会话列表、命名约定和外部看板手工同步会话进度”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可把状态变更设计为带版本的单一事件日志，由浏览器和宿主快照共同投影并对冲突提供显式选择。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1333116579-root"></a>

## [DSH Computer Use](../../plugins/anionex--dsh-computer-use/INSIGHT.md)

[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-computer-use) [![npm 30d 3,269](https://img.shields.io/static/v1?label=npm+30d&message=3%2C269&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-computer-use)

> **用途**：目标是必须跨入macOS原生应用、缺少更窄API的Agent任务，例如读取窗口、修改控件后核查状态。合格交付是目标应用内业务结果正确，且用户前台工作未受到非预期干扰。能用应用API、CLI或浏览器DOM完成时应先用它们；本插件不负责像素语义/OCR，也不把截图或点击成功当最终任务完成。

> **亮点**：将观察绑定、精确进程窗口输入、应用授权和动作后状态组织为原生动作层，较盲目桌面脚本有可解释控制边界。[Q03](#research-q03)

> **思考**：默认键盘会激活应用，敏感确认依赖调用方正确设置sensitive；不能把定向路由当成全场景无干扰或自动识别高影响保证。[Q04](#research-q04)

> **建议**：未验证假设是把动作风险声明与激活后输入目标摘要一起纳入确认计划，对发送、删除等明确应用语义加入可配置分类器，能减少仅依赖模型sensitive标记的漏判。推导自确认消费条件与键盘激活后焦点变化。最小验证在不真实提交的夹具中构造改标签、按钮重排和激活后焦点切换，比较漏确认率、误拒绝及人工次数；分类器若不能识别或授权负担高于收益，应只收缩可操作应用范围。 [Q08](#research-q08)

<a id="plugin-1413897334-root"></a>

## [dsh-ai-arcade](../../plugins/439436269-ctrl--dsh-ai-arcade/INSIGHT.md)

[![npm 30d 299](https://img.shields.io/static/v1?label=npm+30d&message=299&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade) [![最新发布 2026-10-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ai-arcade)

> **用途**：用户在 DSH 界面玩游戏并希望 AI 对手有策略/台词且不阻塞帧率。

> **亮点**：用本地规则兜底并仅让模型做高层意图，游戏页与长期缓存壳分开。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：模型付费路由仅 Host/Origin 栅栏，接受 GET 和自定义 system，未见独立鉴权或频控；README 推理 effort 说明与默认代码不符。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：给付费路由加入认证/预算与 POST-only 后，可把游戏与模型建议分离用于更广娱乐场景；尚未实现。详见[Q05](#research-q05)。

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

> **用途**：希望用@菜单发现并明确调用已有Skill的DSH0.1系用户。详见[Q01](#research-q01)。

> **亮点**：将Skill菜单发现与host确定加载接合，省去模型自行决定读Skill。详见[Q01](#research-q01)。

> **思考**：普通文本不携带对象身份，示例/同名对象可触发，缓存没有更新事件与transport拒绝删除。详见[Q03](#research-q03)。

> **建议**：研究有身份的输入chip和版本化可重试目录缓存，比较误加载与恢复成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1426914549-root"></a>

## [dsh-audiobook](../../plugins/aicivilization--dsh-audiobook/INSIGHT.md)

[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-audiobook)

> **用途**：给希望在Harness中听书并随读记录想法的人，将有授权文本变成分段朗读、进度和位置关联心得；合格交付应保留原文顺序及笔记归属，AI读后感仍需用户审核。

> **亮点**：把听书、断点、位置心得和可导出的读后感连成一个读书流程，原话与AI整理分离是可借鉴交接；TTS/ASR和书源能力来自上游。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：本地存储不等于全部本地处理，Edge文本和AI材料会外发；默认启动自动安装Edge组件。书源同ID重新导入会覆盖段落但保留进度，位置索引可能漂移；防剧透靠裁剪与提示，history/模型知识不能硬隔离。参见[Q03](#research-q03)。

> **建议**：可给进度和笔记绑定原文段摘要及导入版本，更新时显式对齐或标为待重定位，同时将防剧透上下文与历史按阅读位置过滤。对照修改前段/回退进度/允许过剧透的历史，若锚点错位或泄露不降则否定；假设未验证，新增版本和人工对齐负担。参见[Q05](#research-q05)。

<a id="plugin-1425073734-root"></a>

## [dsh-auto-shutdown](../../plugins/873360545--dsh-auto-shutdown/INSIGHT.md)



> **用途**：供 Windows 用户长对话结束后离开电脑时使用；合格结果是按根回合完成排关机、可撤销且不丢数据。详见[Q01](#research-q01)。

> **亮点**：将宿主对话边界、Settings 开关和 Windows 系统关机/撤销做成低操作负担的个人流程；增量在连接和一次性 UX，不在关机命令本身。详见[Q01](#research-q01)。

> **思考**：Settings disarm 写失败仍排关机，重启可能保留 enabled；shutdown 异步启动错误后仍可拉起取消弹窗。作者一次性与可取消承诺因此依赖未保证的路径。详见[Q03](#research-q03)。

> **建议**：未验证方向是持久 request id/状态机，确认复位和 OS 排程结果后给出真实 UI 状态，故障注入验证重复触发、错误提示与取消一致性。详见[Q05](#research-q05)。

<a id="plugin-1347136944-root"></a>

## [dsh-balance-chip](../../plugins/akush99--dsh-balance-chip/INSIGHT.md)



> **用途**：已有 DeepSeek API Key、希望就近看到账户余额提示的 DSH web 个人用户。

> **亮点**：把官方余额查询经宿主凭据与缓存 route 接入 DSH web 两处界面，减少用户跳转查账户余额的步骤；不增加会话级计价或消费控制。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：仅取首条余额、坏金额转 0、主显示固定 $；主机 timer 未随 route effect 清理且轮询不串行，可能导致误读或额外请求，均为源码风险而非本轮复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：可将币种/金额校验和串行可取消轮询绑定同一生命周期，用多币种、坏值、慢响应与热重载对照检验真值和请求数；当前未实现。详见[Q05](#research-q05)。

<a id="plugin-1422328385-root"></a>

## [dsh-boo550wt-animation](../../plugins/456erddgr--dsh-boo550wt-animation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)

> **用途**：重视启动展示的桌面用户定制开场；合格结果须可可靠跳过并交还工作，不视为启动加速。

> **亮点**：提前注入并整合素材管理、四模式与跳过交接，减少定制启动内容的接线；3D基础明确来自上游。参见[Q01](#research-q01)。

> **思考**：视频metadata会清初始maxSeconds并改按媒体时长；同源HTML允许脚本且消息不核来源，不能据硬上限/sandbox字样承诺隔离和交还。参见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证假设为统一绝对deadline与可信frame来源，按长素材/延迟/错误/假消息/低帧率对照交还。参见[Q04](#research-q04)。

<a id="plugin-1335928912-root"></a>

## [dsh-butler-memory](../../plugins/andyyang12345--dsh-butler-memory/INSIGHT.md)



> **用途**：让 agent 跨会话记忆，并让用户查看/决定候选及修订。

> **亮点**：相对仅模型工具示例，增加 DSH Web 记忆/候选可视界面和 RPC 桥；记忆存储与策略归上游。详见[Q02](#research-q02)。

> **思考**：桥 Promise.race 超时不清 pending，dispose 回调未绑定 this，候选操作无显式 owner/revision；真实影响需宿主验证。详见[Q03](#research-q03)。

> **建议**：共享受监督桥、超时清理和带版本候选决策可改善生命周期及审核闭环；未实现。详见[Q05](#research-q05)。

<a id="plugin-1359145352-root"></a>

## [dsh-callout](../../plugins/aafff623--dsh-callout/INSIGHT.md)



> **用途**：面向在DSH Web阅读长回复、想更快看到前提/要点/建议/风险的用户。插件把符合首行[!NOTE/TIP/IMPORTANT/WARNING/CAUTION]的blockquote升级成五类主题卡片，源消息仍是可读Markdown，不改存储session内容。

> **亮点**：结合规范Markdown/首Text保正文、own mutation与增量dirty树、条件卸载恢复，提供五类主题重点卡片而不改session存储。详见[Q02](#research-q02)。

> **思考**：assistant范围依chat-flow/markdown DOM而非role，无flow退document；解析后转义歧义，属性恢复只核source，视觉/伪元素不等内容或可达认证。详见[Q03](#research-q03)。

> **建议**：可探索来源作用域/AST或role适配与完整属性恢复，保未知源语法原文，对照误改/漏标/CPU；未实现。详见[Q05](#research-q05)。

<a id="plugin-1335594781-root"></a>

## [dsh-capability-index](../../plugins/777-zen--dsh-capability-index/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/777-Zen/dsh-capability-index)

> **用途**：工具较多的 DSH 环境里，模型可能漏用已安装能力；基线是依靠工具 schema 和模型自行浏览。插件希望每个用户消息先得到 Top-K 提示，合格结果应是目标工具召回提高，同时无关工具提示、上下文 token 和错误调用不增加。 详见[Q01](#research-q01)。

> **亮点**：贡献是把“是否值得展示工具”和“模型是否最终调用”分开，并将负向 not_for 守门放在 Top-K 截断前；相比简单列全量工具，减少无关上下文。但作者已明确归档，16 条样本不足以证明利用率收益，且官方同类能力可能消解独立价值。 详见[Q03](#research-q03)。

> **思考**：核心质疑是提示本身是否比原生 schema 更有净收益。启发式触发表可能漏掉隐含任务或把普通请求判成复杂任务，向量模型也会引入延迟；若仅提高工具曝光却增加错误调用和 token，则贡献不成立。项目归档意味着未来 DSH 接口漂移无人维护。 详见[Q04](#research-q04)。

> **建议**：未验证假设是只在原生工具选择出现高熵时注入候选，而不是每步预审，可减少上下文成本同时保留召回。最小 A/B 用 100 个含/不含工具需求的盲测任务，比原生、现插件、熵门控三组的正确工具调用率、无关调用率、提示 token 和端到端合格率；净收益不超过原生即否定。 详见[Q08](#research-q08)。

<a id="plugin-1339332869-root"></a>

## [dsh-chat-width](../../plugins/764475881--dsh-chat-width/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/764475881/dsh-chat-width)

> **用途**：仍用 DSH 0.1.7 前 web 版本、希望在宽屏调节正文宽度的用户。

> **亮点**：旧版把一个宽度变量、右缘拖拽和持久化组成协调调宽路径；相对用户手工改 CSS 有便利。新版原生实现不属于插件增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：原生检测依赖 DOM 特征；cleanup 移除 style 与把手，却未撤销旧版路径写在 root 上的内联变量，热禁用后可能残留宽度。未在本轮复现。详见[Q03](#research-q03)。

> **建议**：可用宿主版本/公开能力与 DOM 双门控，并在卸载时仅撤销本实例内联变量；以旧版、新版和冲突 DOM 比较误让位、重复 UI 与残留。当前未实现。详见[Q05](#research-q05)。

<a id="plugin-1421963463-root"></a>

## [dsh-chatgpt-style](../../plugins/137--dsh-chatgpt-style/INSIGHT.md)



> **用途**：供偏好更明显消息层级和快捷档位切换的 DSH Web 用户；合格交付需内容与模型状态正确。详见[Q01](#research-q01)。

> **亮点**：组合 CSS 视觉层级、语义标记和宿主模型目录快捷入口，使阅读及选档操作更集中；底层模型档位仍属宿主/provider。详见[Q01](#research-q01)。

> **思考**：标注会替换文本节点并移除标记/表情，但 dispose 不恢复；模型档位按 id 匹配未限制 provider，作者“关闭即原样”与快捷选择精度均有边界。详见[Q03](#research-q03)。

> **建议**：未验证方向是可逆/宿主化标注、provider+model 定位和多档位真实状态提示；用卸载不刷新与同名多 provider 夹具核对。详见[Q05](#research-q05)。

<a id="plugin-1378742722-root"></a>

## [dsh-client-ui-aqua-patched](../../plugins/aliww2468--dsh-client-ui-aqua-patched/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched)

> **用途**：用户在固定 DSH 0.1.2-rc.1 Web profile 使用玻璃主题与壁纸。

> **亮点**：修复旧 Aqua 主题在 DSH 0.1.2 的三处接口断裂，延续原有外观能力。详见[Q01](#research-q01)。

> **思考**：交付 lib 是手工修补的预构建产物，src 未类型检查；只验证一个宿主版本，不能从源码镜像推断更广兼容。详见[Q02](#research-q02)。

> **建议**：把补丁重建和固定宿主视觉回归自动化，可降低后续适配负担；该分支目前未实现。详见[Q03](#research-q03)。

<a id="plugin-1409889533-root"></a>

## [dsh-codefall](../../plugins/4444hao--dsh-codefall/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall) [![npm 30d 407](https://img.shields.io/static/v1?label=npm+30d&message=407&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codefall) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-codefall)

> **用途**：用户个性化开屏与主题，仍需快速可靠地进入可交互界面。

> **亮点**：将视觉动画嵌进 DSH 首帧并避免重复注入，提供设置与主题映射。详见[Q02](#research-q02)。

> **思考**：恢复重播/跨平台实机未验，主题只覆盖宿主 token；loopback 诊断路由返回本机路径，外层代理访问边界待核。详见[Q03](#research-q03)。

> **建议**：增加首帧进出时延预算、可用性验收与按权限裁剪诊断，可提高视觉定制的可靠性；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1426892789-root"></a>

## [dsh-codex-cua](../../plugins/16601134718--dsh-codex-cua/INSIGHT.md)



> **用途**：面向 macOS 上需要从 DSH 操作 Chrome 或原生应用的用户，复用已有 Codex CUA 环境完成浏览器与 AX 自动化。 [Q01](#research-q01)

> **亮点**：相对每次启动 CUA 进程，它用常驻会话显著减少握手并保留变量，同时把操作规范随 Skill 分发；增量集中在运行时桥接与安装封装。 [Q03](#research-q03)

> **思考**：它依赖未随插件交付的桌面运行时、Chrome 扩展和 macOS AX 权限，且卸载不移除写入的 Skill；本轮未验证这些外部组件的当前协议和安全边界。 [Q04](#research-q04)

> **建议**：可为写操作增加请求级幂等键和观察前置条件，让超时后的“结果未知”自动转为只读复核，减少重复点击或重复提交。 [Q08](#research-q08)

<a id="plugin-1358821276-root"></a>

## [dsh-commandcode-usage-inline](../../plugins/345420242--dsh-commandcode-usage-inline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/345420242/dsh-commandcode-usage-inline)

> **用途**：适合频繁使用 Command Code、需要发消息前查看短窗/周限额与 credits 的用户；偶尔查看可直接用 provider 报告。 详见[Q01](#research-q01)。

> **亮点**：把额度决策放到发送动作旁，优势是位置和一眼可见，不改变 provider 的计量、刷新或账户语义。 详见[Q03](#research-q03)。

> **思考**：完全依赖另一插件的 Remote 契约；一分钟轮询可能显示旧值，账户切换、返回字段漂移和离线恢复未证实。 详见[Q04](#research-q04)。

> **建议**：若徽标显示 last-updated 与账户标识，并在页面隐藏时停止轮询，可降低陈旧额度导致的错误决策。 详见[Q08](#research-q08)。

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

<a id="plugin-1396768359-root"></a>

## [dsh-context-guard](../../plugins/2jumpsina--dsh-context-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)

> **用途**：帮助长会话用户决定收尾并保留交接线索，合格交接还需人工补充目标、约束和未决事项。

> **亮点**：把原生token投影转成收尾提示、自动机器事实草稿和压缩读数台账，较手工记录减少重复摘抄；上游计量与压缩不属插件原创，也不等于交接已完成。详见[Q03](#research-q03)。

> **思考**：默认草稿可能把路径和问答片段带入工作目录，关闭草稿仍会写压缩台账；进程内队列与短ID去重不能证明完整审计，压缩点可能只是估计。以上为静态边界，未复现竞态。详见[Q04](#research-q04)。

> **建议**：可探讨交接完整性门槛，把明确目标、未决约束和来源与新会话核对结合，检验是否减少遗漏；新增人时或模型调用，与当前零新增请求不同，尚未验证。详见[Q07](#research-q07)。

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

## [dsh-cortex](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

> **用途**：长期运行的 DSH Agent 想复用过去工具调用中的失败、成功链路和告警模式。

> **亮点**：将会话间的工具事件压缩为可复用提示，且无巩固模型调用。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：统一 DSH_HOME 记忆库无项目/会话作用域，错误文本可持久化；写失败静默且非原子，全局召回可能跨任务误导。详见[Q03](#research-q03)。

> **建议**：加入作用域与脱敏、可靠写盘和按任务效果评估，可把启发式记忆变为可信辅助；现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1342742812-root"></a>

## [dsh-crypto-portfolio](../../plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio)

> **用途**：多钱包/CEX 用户在本机观察资产估值与趋势；需对账，不能替代财务账本。详见[Q01](#research-q01)。

> **亮点**：把多链、CEX 与历史视图接入一个自托管 DSH 插件，支持 profile 和来源切换；具体准确性仍受上游数据影响。详见[Q01](#research-q01)。

> **思考**：HTTP 敏感 GET 未鉴权，非回环绑定可扩大暴露；CEX 黑名单过滤后的 tokens 与 raw total 求值来源不同。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证方向是认证敏感读、限定绑定、统一过滤后数值并记录来源完整度，以安全矩阵与资产对账验收。详见[Q06](#research-q06)。

<a id="plugin-1346533795-root"></a>

## [dsh-cua-pre](../../plugins/aik358--dsh-cua-pre/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-cua-pre)

> **用途**：让 DSH 在 Windows 桌面观察 UI 元素并执行有状态的鼠标键盘操作。

> **亮点**：把UIA元素目标/坐标后备、状态失效及部分未知效果提示封装为DSH工具，并附可视面板；未知效果提示不等统一收据或硬重放阻断。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：作者强调完整安全治理，但默认 allowedPids 空、审计落盘失败静默、急停写盘失败不保证重启后持续；真实安全性须在配置与故障下验收。详见[Q03](#research-q03)。

> **建议**：既有默认范围开放和审计/急停故障分支，若启用时强制绑定目标并使审计与急停持久化 fail-closed，可减少越界/无记录动作；依赖稳定 PID 与可写存储，会增加阻断与延迟。比较越界、漏审计、重启恢复和正常任务，若缺口不降或阻断超阈值则证伪。详见[Q05](#research-q05)。

<a id="plugin-1342948215-root"></a>

## [dsh-custom-plugin](../../plugins/alexpeng07--dsh-custom-plugin/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AlexPeng07/dsh-custom-plugin) [![npm 30d 2,207](https://img.shields.io/static/v1?label=npm+30d&message=2%2C207&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@alexpeng/dsh-custom-plugin)

> **用途**：希望在一个插件中集中管理 Web 外观、会话操作和本地用量的用户。

> **亮点**：多项 Web 效率功能共用一套设置、状态、备份与宿主路由。详见[Q01](#research-q01)。

> **思考**：Web/Desktop 共享状态虽有三方合并，但跨进程读合并写无共同锁，极端交错仍可能覆盖；需故障注入。详见[Q02](#research-q02)。

> **建议**：加入跨进程版本/CAS 协议并持续核价，可降低同步与费用误导；现版未验证。详见[Q04](#research-q04)。

<a id="plugin-1334274281-root"></a>

## [dsh-cyber-particle](../../plugins/aks1st--dsh-cyber-particle/INSIGHT.md)

[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-cyber-particle)

> **用途**：个人用户美化 Web 界面；纯装饰，不改变模型或业务流程。详见[Q01](#research-q01)。

> **亮点**：无需 Host 路由即可提供双语可调的穿透式粒子背景。详见[Q01](#research-q01)。

> **思考**：prefers-reduced-motion 命中后初次不启动，但页面可见性恢复无条件 start；损坏本地配置直接入计算。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证方向是持续减动效监听、恢复配置校验和低帧率/静态模式，以真实帧耗和后台恢复验收。详见[Q05](#research-q05)。

<a id="plugin-1381221232-root"></a>

## [dsh-desktop-uia](../../plugins/1jiegejiayouxuewangan1--dsh-desktop-uia/INSIGHT.md)

[![npm 30d 516](https://img.shields.io/static/v1?label=npm+30d&message=516&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-desktop-uia)

> **用途**：面向操作无 API Windows 应用的用户。输入是窗口/元素、动作和文本；合格结果是身份明确、写动作获批、后置快照证明变化且日志可追。替代是人工、PowerShell 或专用 API。

> **亮点**：把 UIA 的观察、选择、审批、执行和反馈接入 DSH，而非裸坐标点击；增量是工具契约、风险分类和日志，平台 UIA 非原创。 参见[Q03](#research-q03)。

> **思考**：自绘控件、焦点、DPI、多屏、UIPI 和选择器漂移会错目标。审批后目标仍可变化；剪贴板/发送/删除有不可逆副作用，后置快照不能撤销。 参见[Q04](#research-q04)。

> **建议**：写动作绑定窗口句柄、元素指纹、前置哈希和撤销策略；条件变化即拒绝并显示差分。若动态 UI 假拒绝过高则否定。 参见[Q08](#research-q08)。

<a id="plugin-1414017637-root"></a>

## [dsh-dictation-hotkey](../../plugins/andyyang12345--dsh-dictation-hotkey/INSIGHT.md)

[![npm 30d 97](https://img.shields.io/static/v1?label=npm+30d&message=97&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dictation-hotkey) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dictation-hotkey)

> **用途**：适合希望少点麦克风按钮的 Web 用户；合格结果须落入预期会话并可校对。详见[Q01](#research-q01)。

> **亮点**：相对宿主麦克风按钮，增量是热键录音状态机、草稿原生插入与诊断；识别引擎归 DSH 语音 bundle，不能把识别性能算本包贡献。详见[Q01](#research-q01)。

> **思考**：转写前后多次取当前 active seat，旧 span 冲突会向当前 seat 重试；取消没有保存转写的 AbortController 或结果代次，可能跨会话插入/误发。详见[Q03](#research-q03)。

> **建议**：未验证方向是绑定录音开始的 session/seat/草稿代次，目标变化则待确认，并持有 abort token 与结果代次；慢转写切会话等夹具评估误发和确认成本。详见[Q05](#research-q05)。

<a id="plugin-1342915339-root"></a>

## [dsh-discord-richpresence](../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence)

> **用途**：希望在 Discord 个人资料显示自己正在使用 DSH 的个人用户。

> **亮点**：把 DSH 生命周期映射到可自定义的 Discord 状态，减少手工更新资料。详见[Q01](#research-q01)。

> **思考**：richMode 关只取消标量，不取消基础 Presence；全局 workflow/start 与未设活跃会话时工具事件可能让阶段文案不精确。详见[Q02](#research-q02)。

> **建议**：添加独立的基础 Presence 启用开关与严格会话过滤，可改进隐私和准确性；待实际客户端验证。详见[Q03](#research-q03)。

<a id="plugin-1423040689-root"></a>

## [dsh-douyin-webview](../../plugins/535408248-oss--dsh-douyin-webview/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/535408248-oss/dsh-douyin-webview)

> **用途**：桌面 DSH 同屏观看抖音；Web 页签只有不支持提示。详见[Q01](#research-q01)。

> **亮点**：把桌面浏览器租约接成可常驻拖动的站点窗口，而 Host 半无服务逻辑；价值在娱乐便利。详见[Q01](#research-q01)。

> **思考**：失败提示称可点“⟳ 重试”，标题栏没有该按钮；main/preload 安全契约由作者描述而本仓库未提供，不能独立确认。详见[Q04](#research-q04)与[Q02](#research-q02)。

> **建议**：未验证方向是补齐可执行恢复控件、绑定宿主安全契约版本并测导航/登录/全屏及资源成本。详见[Q06](#research-q06)。

<a id="plugin-1414492607-root"></a>

## [dsh-draft-attachments](../../plugins/2026heshao--dsh-draft-attachments/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

> **用途**：帮助切页或重启前已选择附件的用户减少手工重选，合格结果需正确恢复且不复活已发送内容。

> **亮点**：用会话级slot观察输入并经官方附件intake恢复，减少切页后手工重选且不patch官方函数；持久化技术本身成熟，收益依赖正确保存时序。详见[Q02](#research-q02)。

> **思考**：核心持久化缺少提交序号和明确失败状态，旧异步捕获可能覆盖新删除；单会话120MB常量未执行，超限单附件还可能使整集合不更新。均为源码条件风险，未复现。详见[Q02](#research-q02)。

> **建议**：可探讨每会话版本化保存收据，以generation、串行提交、明确状态与实际字节预算约束保存，核对双标签及关闭页边界；尚未验证。详见[Q05](#research-q05)。

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

<a id="plugin-1426619074-root"></a>

## [dsh-edit-question](../../plugins/akiccat--dsh-edit-question/INSIGHT.md)



> **用途**：面向修正多轮旧提问的Web用户；合格结果是保留有效前缀、改文与原图成为新轮，后续不进入新上下文。仅适合允许保留历史的任务，不满足彻底删除敏感内容的要求。

> **亮点**：把前缀fork、文本编辑、原图搬运和会话导航组合为一个修正入口，减少人工重组上下文；底层fork归属宿主。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：prompt失败后新分支未暴露为恢复状态，再试可能再fork；非首轮缺end直接退0也可能缩掉应保留前缀。参见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证假设为持久化分支操作收据并复用childId重试，同时非首轮缺切点显式阻断；以故障注入比较重复分支和前缀保真。参见[Q04](#research-q04)。

<a id="plugin-1335766616-root"></a>

## [dsh-effort-slider](../../plugins/2768651338--dsh-effort-slider/INSIGHT.md)

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) [![npm 30d 1,403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)

> **用途**：频繁调档且需要自定义模型在目录显示思考选项。详见[Q01](#research-q01)。

> **亮点**：把可视滑块和宿主模型方言声明接合，少手动改配置。详见[Q01](#research-q01)。

> **思考**：显示五档不证明端点支持，供给持久配置无卸载恢复，值等推归属与快速选择乱序需核。详见[Q03](#research-q03)。

> **建议**：研究注入所有权/原值比较恢复、端点能力契约及最后意图选择队列，比较错档与恢复成本。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1426448931-root"></a>

## [dsh-eye-comfort](../../plugins/aaronkate--dsh-codex-appearance/INSIGHT.md)



> **用途**：面向默认外观不满足阅读偏好的桌面用户，以可读布局和可恢复设置为验收，不把护眼名称当健康疗效。

> **亮点**：将配色、字体、内容与动画设置整合到宿主token层，本机字体枚举减少手写CSS与候选遗漏；属集成便利。参见[Q01](#research-q01)。

> **思考**：lazy保存的旧快照可在后续即时更新后写回，且保存失败被旁路；本地外观正确不等于下次启动保留最新参数。参见[Q02](#research-q02)。

> **建议**：未验证假设为修订号持久化与可回退对照预览，先用快速调参重载验证状态保留，再独立检验阅读收益。参见[Q04](#research-q04)。

<a id="plugin-1413882487-root"></a>

## [dsh-forget-session](../../plugins/2026heshao--dsh-forget-session/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-forget-session) [![npm 30d 283](https://img.shields.io/static/v1?label=npm+30d&message=283&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-forget-session) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-forget-session)

> **用途**：面向彻底移除敏感、误建或无价值会话的用户。输入是 session id 与二次确认；合格结果是侧栏、日志、投影、workspace、archive/pin、搜索和 attachment 都消失，重启后不复活。替代是归档/隐藏。

> **亮点**：把持久文件、投影、侧栏元数据和内存 attachment 视为同一删除生命周期，并处理幽灵复活；不是介质级安全擦除。 参见[Q03](#research-q03)。

> **思考**：多层删除不原子，中途失败可留残片；搜索索引、备份、同步和外部数据未必覆盖。guard 可能只在进程内，删除文件也非安全擦除。 参见[Q04](#research-q04)。

> **建议**：先写带清单/摘要的墓碑并移隔离区，经历重启静默窗口后物理清除；若不能消除复活并100%恢复误删则否定。 参见[Q08](#research-q08)。

<a id="plugin-1407166868-root"></a>

## [dsh-fullscreen-input](../../plugins/al-yichen--dsh-fullscreen-input/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fullscreen-input)

> **用途**：长提示词和多行中文输入需要更大编辑空间。详见[Q01](#research-q01)。

> **亮点**：大编辑区与共享草稿接线，减少窄框滚动和普通Enter发送入口。详见[Q01](#research-q01)。

> **思考**：引用恢复可无声放弃，文件选择依赖首个DOM input，submit未等待异步结果即关闭面板。详见[Q03](#research-q03)。

> **建议**：研究语义原子草稿/文件API、revision事务和异步发送收据，比较误发与引用丢失。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1412623357-root"></a>

## [dsh-gotify-notify](../../plugins/ahyi8--dsh-gotify-notify/INSIGHT.md)

[![npm 30d 398](https://img.shields.io/static/v1?label=npm+30d&message=398&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify)

> **用途**：适合自管 Gotify 的单用户桌面消息提醒；对关键告警须另有可靠链路。详见[Q01](#research-q01)。

> **亮点**：将 DSH 回合状态/待答问题推给 Gotify，提供 UI 配置与测试。详见[Q01](#research-q01)。

> **思考**：凭据换人但 URL 不变时缓存旧 token；提问推送失败后去重抑制再试；测试路由信同机进程。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：未实现的改进为按凭据身份重建缓存、持久送达队列与同机路由身份授权。详见[Q05](#research-q05)。

<a id="plugin-1422121370-root"></a>

## [dsh-gui-guard](../../plugins/7gzgn--dsh-gui-guard/INSIGHT.md)



> **用途**：用 DSH 在 Windows 桌面根据截图/OCR 坐标点击或输入的个人用户。

> **亮点**：把窗口探测、还原、坐标口径换算和输入前激活集中在一个工具，并回显请求与应用坐标；减少调用方分别处理 Windows 状态的步骤。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：Ensure-Foreground 的 isForeground 没有成为 click/type 的执行门槛，ok 与 cursorMatches 也不能证明事件进了目标窗口；失败时仍发全局事件是源码可见的误操作风险。详见[Q03](#research-q03)。

> **建议**：可在全局事件发送前加入前台与点位范围门控，并以拒绝前台、重名窗口及跨屏 DPI 输入对照误点和误拒；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1357066651-root"></a>

## [dsh-harness-chat-control](../../plugins/1985899182--dsh-harness-chat-control/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)

> **用途**：面向在 DSH Desktop 长对话里频繁引用局部回答、另开支线追问或修正已发问题的用户。输入是选中文本、整条回答或待编辑消息；合格结果是引用仍为可删除胶囊、侧栏标签互不串线、发送由用户确认、编辑只改变目标可见分支。简单替代是复制文本到主对话或新会话，但要人工补上下文并管理窗口。

> **亮点**：相对手工复制，它把原生注释、用户确认发送、带历史的独立侧栏和 surface 替换放进同一交互，并复用宿主模型、停止与权限 UI。增量主要是会话与界面接线，不是新的模型推理能力；标签批量关闭改善多支线收尾，但不撤销已经发生的工具副作用。 参见[Q03](#research-q03)。

> **思考**：最关键前提是“侧栏独立”容易被误解为权限或数据隔离。源码仍复制父历史、cwd 与 options，自然语言边界不能限制工具；多条 Host 路由对目标身份的核验若不一致，知道会话 ID 的请求可能越过预期父子关系。内置 Sidebar 和多个内部 slot 还把兼容性绑定在精确宿主版本。 参见[Q04](#research-q04)。

> **建议**：可探索给每个父子会话发放带父 ID、能力范围和过期时间的句柄，同时让用户显式选择继承“片段／本轮／全部历史”；编辑再携带意图 nonce 与预期 surface 版本。它可能同时降低越界请求、上下文泄露和错编辑，但会增加一次选择和兼容层。 参见[Q08](#research-q08)。

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

<a id="plugin-1422488467-root"></a>

## [dsh-inpage-translator](../../plugins/7gzgn--dsh-inpage-translator/INSIGHT.md)



> **用途**：面向在DSH内置浏览器阅读外语网页、已有可用模型路线的用户。浮动按钮允许在页面直接翻译/还原，工具translate_page也能显式选会话与语言。不是独立浏览器扩展、OCR或通用网页内容安全隔离器。

> **亮点**：将页面按钮、宿主模型、原文去重缓存和预算/部分失败回执接在一起，减少复制接线。详见[Q02](#research-q02)。

> **思考**：父元素textContent覆盖会丢子结构，restore只返扁平文本；未严格过滤可见内容，页面DOM请求不是可信人工许可，异步回填缺文档版本。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索宿主许可/文档版本绑定的独立Text补丁和逆操作，核拒绝未授权与过期回填、结构还原及成本；未实现。详见[Q07](#research-q07)。

<a id="plugin-1359145374-root"></a>

## [dsh-keyboard-manager](../../plugins/aafff623--dsh-keyboard-manager/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager)

> **用途**：键盘用户快速切换 DSH Web 面板。

> **亮点**：把常用布局/设置动作合并成三个可配置快捷键，降低鼠标点击。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：Ctrl+S 除 better-sidebar panelHost 外全局先 preventDefault，即便动作 no-op 也吞原有保存行为；模拟单测对此有确认。详见[Q03](#research-q03)。

> **建议**：先判断焦点/目标有效再拦截，并让可编辑目标保存键优先；以多页面矩阵检验误拦截，现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1424475406-root"></a>

## [dsh-language-guard](../../plugins/58fly--dsh-language-guard/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-language-guard)

> **用途**：适合希望推理、回答和工具描述长期保持同一语言的会话；只需翻译已显示推理时官方 cot-translation 更直接。 详见[Q01](#research-q01)。

> **亮点**：生成层约束、自动跟随界面语言、热更新与可验证 session log 形成闭环，且不外发对话内容。 详见[Q03](#research-q03)。

> **思考**：本质仍是提示约束，不能改写 tools schema 或保证模型服从；与 dsh-context 同位提示会重复耗 token，周期 notice 在 UI 可见。 详见[Q04](#research-q04)。

> **建议**：按模型服从率自适应从 Basic 升 Strong、连续合格后降级，比固定三档更省 token，但必须避免用模型自评作为唯一判据。 详见[Q08](#research-q08)。

<a id="plugin-1384810483-root"></a>

## [dsh-mac-companion](../../plugins/173787247--dsh-mac-companion/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion)

> **用途**：WSL/远程 DSH 需有限操作用户 Mac，必须绑定正确设备与明确授权。

> **亮点**：将共享设备协议包装为 DSH 工具并附轻量 Mac 服务，省去手工命令。详见[Q02](#research-q02)。

> **思考**：Mac 服务空 token 即免鉴权、跨机示例为明文 HTTP，confirm 不等于人在场审批；剪贴板读无 confirm。详见[Q03](#research-q03)。

> **建议**：服务端一次性授权、动作 allowlist、可信隧道与 Shortcut 超时可将远程动作变得可审；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1337350700-root"></a>

## [dsh-memory-setup](../../plugins/863683348--dsh-memory-setup/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-memory-setup) [![npm 30d 155](https://img.shields.io/static/v1?label=npm+30d&message=155&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-memory-setup) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-memory-setup)

> **用途**：面向DSH用户保留偏好、项目规范、工作流和错误教训，原有办法是手工README/CLAUDE.md及每次重新提示。插件用工作区JSON、工具、changelog/备份/快照与systemPrompt可变context接线，另有知识条目BM25和可选向量检索。合格结果应是正确工作区、当前且有依据的记忆帮助真实任务，条目数/hits不是改善效果。

> **亮点**：把可读工作区记忆、工具/提示注入、规则提取和检索/快照组合，减少每次重述的接线；Jaccard/BM25/cosine非新算法。详见[Q01](#research-q01)。

> **思考**：冷KB调用未定义emptyKnowledge，通用更新可沿原型链；注入全局共享、分离revision非原子CAS，错误fix可晋升、脱敏/冷层未接线，限制高信任记忆主张。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：可探索按工作区的不可变版本快照、typed patch与锁内事务、效果确认晋升及统一隐私策略，用假fs交错矩阵证伪；未实现。详见[Q06](#research-q06)。

<a id="plugin-1389945615-root"></a>

## [dsh-message-ops](../../plugins/240xu--dsh-message-ops/INSIGHT.md)

[![npm 30d 5,119](https://img.shields.io/static/v1?label=npm+30d&message=5%2C119&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-message-ops)

> **用途**：面向需要纠正对话分支或隐藏错误轮次的DSH用户；合格结果是可见上下文按预期变化且原日志仍可追溯。

> **亮点**：相对直接截断压缩日志，主要增量是利用宿主provenance与surface语义保留原事件，并按原seq核对恢复；这提供可追溯纠错流程，不能等同撤销外部工具副作用。[Q01](#research-q01)

> **思考**：回撤改变模型可见上下文，不撤回此前工具已写文件或调用外部服务；恢复含重放语义且依赖宿主事件格式，用户必须核对上下文与现实状态是否分叉。[Q03](#research-q03)

> **建议**：未验证假设是回撤前列出该范围包含的工具副作用摘要并要求复核，可减少上下文回退后重复执行；比较故障任务的重复写入和人工核对时间，若无法可靠归因则否定。[Q05](#research-q05)

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

<a id="plugin-1428147033-root"></a>

## [dsh-notification-desktop](../../plugins/adingo001--dsh-notification-desktop/INSIGHT.md)



> **用途**：后台长轮次用户需要完成提醒；验收为及时且不重复地知道返回查看，不把结束事件当任务质量验收。

> **亮点**：在上游通知逻辑上适配0.2.x快照/retention并提供Windows宿主WinRT通路，区分权限与呈现。参见[Q01](#research-q01)。

> **思考**：Electron不分OS均POST，Host却只支持Windows；投递失败不重试且提前记成功，npm files又不含运行脚本，故不能以日志成功认定系统提醒生效。参见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证假设为分层回执、session/turn幂等键与OS能力探测；只重试明确未投递，故障对照实际显示和重复。参见[Q04](#research-q04)。

<a id="plugin-1417227361-root"></a>

## [dsh-peak-runner](../../plugins/439436269-ctrl--dsh-peak-runner/INSIGHT.md)

[![npm 30d 24](https://img.shields.io/static/v1?label=npm+30d&message=24&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-peak-runner) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-peak-runner)

> **用途**：供可等待的文本批任务试算峰谷调度；合格交付是任务按目标模型完成且费用可核。详见[Q01](#research-q01)。

> **亮点**：把时段判断、持久队列和模型工具接为一个可查询/取消的延时工作流，比手工等时更系统；但核心“自动低价执行”当前源码未闭环，不能将作者预期节费写成已实现效果。详见[Q01](#research-q01)。

> **思考**：timer 到点只 log，schedule 仅读状态；leadMinutes 没有在非峰临峰时阻止启动，目标失效会回退任意模型。任务可能滞留或不按适用价格规则执行。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证方向是持久调度器主动领取、单任务租约/版本提交，任务绑定模型与价格规则，峰前按预计运行时长判断；固定时钟和模型失败夹具测执行/费用正确性。详见[Q05](#research-q05)。

<a id="plugin-1335704653-root"></a>

## [dsh-perlica-ding](../../plugins/117bs--dsh-perlica-ding/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) [![npm 30d 320](https://img.shields.io/static/v1?label=npm+30d&message=320&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding)

> **用途**：适合在本机运行DSH、工作中切到别的窗口但希望听见计划/回合收尾/待回应/错误的用户。四个本地音效与音量设置是注意力提示，普通纯查询拟保持静音。角色主题是呈现偏好，不是技术或业务效果证据。

> **亮点**：把四档Agent事件、平台音频argv、PCM音量与可持久设置接在一起，减少切回窗口看状态。详见[Q02](#research-q02)。

> **思考**：done仅事件启发式，缺起点0比较/失败结果与root降级可误响；试听无cwd、即回不等可听；大/畸形WAV与无界播放/缓存及桥认证边界需核。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索agent-turn原因与音源一致、播放器阶段明确的有界通知收据，核误响/漏响/资源；进程成功仍非人已听到，未实现。详见[Q06](#research-q06)。

<a id="plugin-1378097401-dsh-live2d-pet"></a>

## [dsh-pet-live2d](../../plugins/a8chann--dsh-pet-live2d--dsh-live2d-pet/INSIGHT.md)

[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d)

> **用途**：希望通过可视宠物感知 Agent 运行/等待/完成状态，并自定义模型动作与外观。

> **亮点**：把 Agent 状态映射到可配置的 Live2D 动作与声画提醒，降低查看状态的切换成本假设。详见[Q01](#research-q01)。

> **思考**：升级只看 pet.json 是否改动，对自改纹理/动作但未改 manifest 的同名文件仍可能 cpSync 覆盖；作者的“任何自改不覆盖”表述过宽。详见[Q02](#research-q02)。

> **建议**：按完整目录资源指纹保护用户文件，固定 Core 版本/哈希并统一写路由校验，可提升可靠性；现版未实现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="plugin-1423941835-root"></a>

## [dsh-pick](../../plugins/aicivilization--dsh-pick/INSIGHT.md)

[![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pick) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pick)

> **用途**：面向需要缩小插件候选集的DSH用户；合格结果是带统计口径和兼容提醒的候选，不是以下载量替代源码或真实任务评估。

> **亮点**：相对只看周下载或Star，增量在显式的去发布日指标、候选对照和安装前提醒；它改善信息组织，不能据统计指标推出安全、活跃用户或任务适用性。[Q01](#research-q01)

> **思考**：所谓健康分仍由下载与发版代理指标构成，频繁发版会同时影响去噪基线和节奏加分；被排除样本不足又回退原始中位数，不支持“最值得安装”的因果结论。[Q03](#research-q03)

> **建议**：未验证假设是把指标结论与源码/兼容证据分成独立维度，并为基线提供敏感性区间，可减少高热度误推荐；用已知任务盲选比较合格率与核查成本，没有提升则否定。[Q05](#research-q05)

<a id="plugin-1407379611-root"></a>

## [dsh-pinned-sessions](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)

> **用途**：多工作区用户需要快速返回重点会话，聚合组以正确打开既有会话和同步原生pin为合格结果。详见[Q01](#research-q01)。

> **亮点**：复用宿主pin关系，增加跨工作区平面组与局部搜索，减少展开查找步骤；贡献是导航聚合，不是新增置顶存储或任务流程。详见[Q01](#research-q01)。

> **思考**：最影响长期便利的是内部DOM耦合，class或层级变化会隐藏分组；取消置顶失败仅console提示，且浏览器偏好是新增本地状态。源码和README部分挂载叙述不同，以源码为准。详见[Q03](#research-q03)。

> **建议**：可探讨宿主专用组slot来替代scoped DOM查找，用相同布局与升级样例比较挂载正确性和维护改动量；需宿主配合，当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1423966960-root"></a>

## [dsh-plugin-auto-answer](../../plugins/ak-blank--dsh-plugin-auto-answer/INSIGHT.md)



> **用途**：长时 DSH 任务因 ask_user_question 无人回答而停住。

> **亮点**：在不改 Client 的 Host 插件中代理问答，并处理迟到拒绝、取消和重新 apply。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **思考**：默认首项/空选项自动回答可能跨越真实用户决策边界，plan-review 保护只覆盖显式 intent；卡片状态可能滞后。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **建议**：按 intent allowlist 自动回答且向 Client 广播结算，可降低擅自选择和残留卡片；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1389061748-root"></a>

## [dsh-plugin-crypto-ticker](../../plugins/18569663yz-web--dsh-plugin-crypto-ticker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)

> **用途**：个人在 DSH 侧栏快速参考 USDT 现货行情；合格信息须含来源、逐币采集时间和陈旧标识。详见[Q01](#research-q01)。

> **亮点**：将公开行情源接入 DSH Web/Desktop GUI，整合代理、降级与宿主侧缓存，缩短离开工作台查看行情的操作；行情本身由交易所提供。详见[Q01](#research-q01)。

> **思考**：collect 只需一个币有价就选源，缺价币可沿用无逐币时间的 lastGood；updatedAt 却为当前，另 schedule 写 ref 不重建计时器，可能误示新鲜和实际刷新频率。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：未验证方向是逐币 quoteAt/source/staleReason、并发 single-flight、按当前配置递归调度，模拟部分缺价/多标签与真实官方报价对照。详见[Q04](#research-q04)。

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

<a id="plugin-1402940561-root"></a>

## [dsh-plugin-mac-notify](../../plugins/ak-blank--dsh-plugin-mac-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify)

> **用途**：Mac个人用户让长会话自行运行后收到人工接手提醒，合格结果须能识别事件并返回处理，不把idle当业务成功。

> **亮点**：把回合、问题、批准和错误转成可配置Mac通知，并用argv传正文、公开可注入runtime及可选点击返回形成完整接线；贡献属于成熟系统能力的事件集成。详见[Q02](#research-q02)。

> **思考**：去重key不含会话，紧急事件也先受同正文去重；点击按URL前缀只保证尝试返回页面。默认正文及trace含任务内容，均需隐私和多会话判断，未做漏报或误聚焦复现。详见[Q03](#research-q03)。

> **建议**：可探索按会话/请求身份去重与分层发送收据，在双会话同问和失败重试中比较覆盖、重复噪声与敏感留存；未实现，不冒称用户已读。详见[Q06](#research-q06)。

<a id="plugin-1363429979-plugin-notes"></a>

## [dsh-plugin-notes](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,413](https://img.shields.io/static/v1?label=npm+30d&message=2%2C413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

> **用途**：个人记录、待办和可派发 Agent 任务的统一面板；需要明确自动执行与备份恢复成本。详见[Q01](#research-q01)。

> **亮点**：将便签编辑、任务 AI 执行和日程以及远端备份整合为 DSH 用户工作流。详见[Q01](#research-q01)。

> **思考**：删除后远端快照不更新是明确的判定缺口；恢复和任务派发有部分副作用，需故障验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

> **建议**：改进可用持久变更序号/墓碑判备份、事务恢复、派发失败清理会话。详见[Q03](#research-q03)和[Q05](#research-q05)。

<a id="plugin-1402828137-root"></a>

## [dsh-plugin-offpeak-badge](../../plugins/ak-blank--dsh-plugin-offpeak-badge/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge)

> **用途**：API 用户希望识别可延后任务的较低费率时段。

> **亮点**：把公开计价规则放到 DSH 常驻 UI，使人工排程更快看到时段；不读取真实账单或调度请求。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：硬编码年历仅到2026，未覆盖年退化为周一至五可高峰；slot 与 DOM 类名集成也可能随宿主变化。详见[Q03](#research-q03)。

> **建议**：加入有来源和核查日期的规则/假期更新与过期告警，在边界、跨年和真实账单对照中降低误导；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1336684098-root"></a>

## [dsh-plugin-recommend](../../plugins/863683348--dsh-plugin-recommend/INSIGHT.md)

[![npm 30d 733](https://img.shields.io/static/v1?label=npm+30d&message=733&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-recommend)

> **用途**：面向只知道能力需求、希望在DSH内搜目录/找近邻替代/看分类详情的用户。工具recommend支持search/categories/detail/similar/refresh；只返回目录事实/词重合分，不执行安装、不研究源码或核候选安全/兼容。

> **亮点**：将1135条描述/tag目录的解释性词法、分类与相似探索接到模型工具，并提供显式固定源刷新。详见[Q02](#research-q02)。

> **思考**：live非空即全替换且无tag/版本，失败仍保旧live却提示embedded；解析类别子串/格式漂移可不完整，去重先保首项，分数不代表安全/值得安装。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索源版本/字段质量与差异可审的候选快照、按身份取高分与完整解释，比较错更新/召回/审查成本；未实现。详见[Q06](#research-q06)。

<a id="plugin-1394188597-root"></a>

## [dsh-plugin-session-colors](../../plugins/7vw58n3ftvq7cn89v--dsh-plugin-session-colors/INSIGHT.md)



> **用途**：多会话用户用自定颜色辨认项目和分组。详见[Q01](#research-q01)。

> **亮点**：把ID持久颜色、即时镜像与不打开会话的picker组合，减少手动标题/CSS整理。详见[Q01](#research-q01)。

> **思考**：DOM同名顺序误配可不只错画还写错ID，离线/持久失败只warn，HTTP写入无本层身份校验。详见[Q03](#research-q03)。

> **建议**：研究稳定ID行契约、带版本持久确认和按主体镜像，对照乱序/离线/同名/多实例错标恢复，未验证。详见[Q05](#research-q05)。

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

> **用途**：面向需要在 DSH Web 中听取回答、无障碍访问或减少盯屏时间的用户，将消息、选中文本和可选审批事件转为可控音频；合格结果需完整、可停止且失败不阻塞会话。详见[Q01](#research-q01)。

> **亮点**：把宿主消息生命周期、可取消渐进式长读、多本地/云后端和分层设置组合为同一工作流；贡献在交互与恢复接线，不在语音模型本身。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **思考**：零配置 Edge 与自动回退会外发文本，本地音色又转移模型、端口和资源维护；端点、Host slot 或服务方言变化都可能破坏核心体验。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：可探索逐任务“数据流向收据”，按敏感级别确认本地故障后的外部回退，并记录延迟、失败与取消；先做影子记录比较误路由和确认负担。未实现。详见[Q08](#research-q08)。

<a id="plugin-1422500224-root"></a>

## [dsh-profile-stylist](../../plugins/7gzgn--dsh-profile-stylist/INSIGHT.md)



> **用途**：维护自己的 GitHub/Gitee 资料、文案和头像；需已登录浏览器及人工审阅。详见[Q01](#research-q01)。

> **亮点**：把文案生成、头像模板和 GitHub/Gitee 浏览器写入接成资料编辑流程，并有默认体检视图。详见[Q01](#research-q01)。

> **思考**：直接 apply 不执行作者宣称的 URL/长度收敛，且 Gitee 头像确认选择器与脚本 DOM 搜索类型不匹配。详见[Q03](#research-q03)与[Q04](#research-q04)。

> **建议**：未验证方向是统一归一化、一次性摘要确认、按档案 selector 处理头像并提交后回读。详见[Q06](#research-q06)。

<a id="plugin-1403959948-root"></a>

## [dsh-prompt-optimizer](../../plugins/alive114514awa--dsh-prompt-optimizer/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ALIve114514awa/dsh-prompt-optimizer) [![npm 30d 1,527](https://img.shields.io/static/v1?label=npm+30d&message=1%2C527&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-optimizer)

> **用途**：发送复杂需求前审阅并改写，保留事实/约束及旧稿，需确认后端和context范围。

> **亮点**：将问答/生成/预览/取消与Web草稿CAS接成显式流程，增量在用户控制与接线而非新改写算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：Codex继承provider权限不等Harness无工具只读，TUI无接收ACK/同等CAS；生成成功不证明最终任务更好。详见[Q02](#research-q02)。

> **建议**：可探讨受限改写与应用收据，绑定原稿/context/provider能力并回读目标版本/hash；公开接口/隐私维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1336538202-root"></a>

## [dsh-prompt-polish](../../plugins/1321928757--dsh-prompt-polish/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) [![npm 30d 347](https://img.shields.io/static/v1?label=npm+30d&message=347&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)

> **用途**：已有 DSH Web 模型配置、希望改写草稿且保留人工审阅的用户。

> **亮点**：在输入栏直接提供六模式重写、上下文与人工采用保护；详见[Q01](#research-q01)。

> **思考**：上下文发往选定 provider；工作区映射缺失时设置回退到最近/首个工作区，且超时未显式 abort 流。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **建议**：增加发送前 provider/上下文预览、只写确定关联工作区、超时主动 abort，可降低隐私与资源风险；待运行验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="plugin-1344714660-root"></a>

## [dsh-receipts](../../plugins/988hj7tczd-oss--dsh-receipts/INSIGHT.md)

[![npm 30d 77](https://img.shields.io/static/v1?label=npm+30d&message=77&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-receipts) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-receipts)

> **用途**：供个人回顾本地 DSH 会话与项目活动；它整理可见痕迹，不能直接证明工时、生产率或业务影响。详见[Q01](#research-q01)。

> **亮点**：把会话、工具、跳过日志和本地 Git 痕迹组织成可离线复核的个人报告，比手动翻日志易查；活动指标与业务成果之间没有因果证明。详见[Q01](#research-q01)。

> **思考**：Git 核对会忽略预标记的越界状态、未继承报告时间窗；开启路径脱敏又先改写 cwd。默认不脱敏的 HTML 还可能含会话敏感内容，不能把报告称作可信计费依据。详见[Q03](#research-q03)。

> **建议**：未验证方向是把已授权 Git 目标和报告时间窗一起传入纯核对接口，完成后才脱敏展示副本，并把活动跨度与人工确认的成果分栏；用越界/窗外/长空闲夹具证伪。详见[Q05](#research-q05)。

<a id="plugin-1404720276-root"></a>

## [dsh-right-click-menu](../../plugins/al1ghtm3ter--dsh-right-click-menu/INSIGHT.md)



> **用途**：用户从已识别文件/链接快速预览、复制、系统打开或另存；目标正确与覆盖处理是合格条件。详见[Q01](#research-q01)。

> **亮点**：把文件树与聊天路径映射为同一操作菜单，利用既有宿主预览/打开能力，减少手工复制路径；增量在目标识别与 UI 接线，不是新文件协议。详见[Q01](#research-q01)。

> **思考**：host 仅要求绝对路径，save-as/write-text 可写任意宿主可达目标且覆盖；read/raw 全量读入后才裁剪或返回，展示限长不等于内存限长。请求授权不是资源授权。详见[Q03](#research-q03)。

> **建议**：未验证方向是每项动作绑定会话文件授权与 realpath，写入做覆盖确认/独占创建，读取流式限量；跨根/软链/已有目标/大文件夹具核安全和可用性。详见[Q05](#research-q05)。

<a id="plugin-1410794267-root"></a>

## [dsh-rtl-chat](../../plugins/adilalmahmoud--dsh-rtl-chat/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat)

> **用途**：RTL语言为主的DSH Web阅读者。详见[Q01](#research-q01)。

> **亮点**：将局部RTL样式和可见开关封装，少反复改浏览器CSS。详见[Q01](#research-q01)。

> **思考**：统一消息区RTL影响混排，偏好共享origin且不同tab不实时同步，按钮样式disposer未保存。详见[Q03](#research-q03)。

> **建议**：研究逐段方向/隔离和完整style生命周期、明确辅助状态，比较误读与残样式，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1412162067-root"></a>

## [dsh-scroll-piano](../../plugins/439436269-ctrl--dsh-scroll-piano/INSIGHT.md)

[![npm 30d 1,565](https://img.shields.io/static/v1?label=npm+30d&message=1%2C565&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scroll-piano) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scroll-piano)

> **用途**：适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览；不需要声音时浏览器查找/原生滚动足够。 详见[Q01](#research-q01)。

> **亮点**：把空间位置编码为声音并叠加导航刻度，是交互组合创新；它不改善模型回答或搜索语义。 详见[Q03](#research-q03)。

> **思考**：依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM；自动播放需用户手势，声音也可能干扰读屏或共享办公。 详见[Q04](#research-q04)。

> **建议**：将刻度导航与声音分别开关，并以消息语义 API 取代 DOM 猜测，可能保留导航价值而减少维护和感官负担。 详见[Q08](#research-q08)。

<a id="plugin-1412141303-root"></a>

## [dsh-session-path](../../plugins/439436269-ctrl--dsh-session-path/INSIGHT.md)

[![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-session-path) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-session-path)

> **用途**：用户明确授权读取已有会话并交接，需核来源/遗漏和真实路径。

> **亮点**：集中日志定位、多帧解压和交接入口，减少手写接线；增量在流程整合而非新隔离或接续算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：ID未限制单路径组件/真实根，JSONL保留前缀而非最新尾部，裁剪与解码失败不足以说明完整性；同名明文可覆盖。详见[Q02](#research-q02)。

> **建议**：可探讨真实路径授权与可核交接收据，绑定源/输出hash、保留范围和裁剪原因并原子版本写出，资源/快照成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1368115538-root"></a>

## [dsh-session-rename](../../plugins/9ashwin--dsh-session-rename/INSIGHT.md)



> **用途**：按需求编号为 DSH 会话命名，便于在历史列表定位。

> **亮点**：用零运行时包依赖的 Host 工具把宿主改名 API 暴露给模型。详见[Q01](#research-q01)、[Q04](#research-q04)。

> **思考**：可指定任一已加载 session_id，而插件只校验非空，目标授权依赖未审宿主。详见[Q03](#research-q03)。

> **建议**：默认仅当前会话、跨会话改名显式授权能缩小误操作面；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1368581082-root"></a>

## [dsh-session-turn-eta](../../plugins/778672151--dsh-session-turn-eta/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/778672151/dsh-session-turn-eta)

> **用途**：长回合等待时了解估计耗时与运行状态。详见[Q01](#research-q01)。

> **亮点**：可重放事件预测与输入框时间提示接合，改善等待可见性。详见[Q01](#research-q01)。

> **思考**：finishing只是估计耗尽，事件空档/时钟/任务变化可偏差，interval未校准，全历史反复排序。详见[Q03](#research-q03)。

> **建议**：研究分组有界历史/删失信息和误差校准，对照错估与内存，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1355639507-root"></a>

## [dsh-side-session](../../plugins/123dbl--dsh-side-session/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session)

> **用途**：主会话工作时另开问题分支，由读者接管可继续子会话；不承担成果合并或隔离保证。

> **亮点**：在既有continuable spawn和官方会话视图上补一键菜单/跳转接线，不另造聊天系统；底层并行与持久化归上游。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：Host不返回childID，事后目录差集在目录先到、冷缓存和并发时不能证明本次归属；错误跳转可能使问题错投。均为静态时序推演。详见[Q02](#research-q02)。

> **建议**：可探讨请求关联的child/parent精确收据与可查询幂等恢复，配合活动视图/取消检查。错开或重复创建反例可推翻实现，尚未验证。详见[Q05](#research-q05)。

<a id="plugin-1426455774-root"></a>

## [dsh-sidebar-panel-fold](../../plugins/acgsu--dsh-sidebar-panel-fold/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/ACGsu/dsh-sidebar-panel-fold)

> **用途**：适合面板较多、希望给会话列表留空间的用户；合格结果是收起后仍能访问所有原生面板并可恢复展开。

> **亮点**：相比修改内置文件或简单display:none，增量在保留面板切换、活动状态和跨重启偏好；这是局部界面便利，没有改变Agent或任务交付流程。[Q01](#research-q01)

> **思考**：实现没有官方整列表包裹槽，因而依赖nav结构和DOM观察；上游侧栏变化可能让控件无法定位。动态导入schema仅缓解包解析，不能保证所有旧schemastery版本支持volatile。[Q03](#research-q03)

> **建议**：未验证假设是增加官方面板列表容器槽与状态接口后，可取消DOM扫描并保持一致可访问性；比较宿主布局变化下的失效数和维护改动，未改善则不成立。[Q05](#research-q05)

<a id="plugin-1336106328-root"></a>

## [dsh-skill-manager](../../plugins/aks1st--dsh-skill-manager/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-skill-manager) [![npm 30d 994](https://img.shields.io/static/v1?label=npm+30d&message=994&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-skill-manager) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-skill-manager)

> **用途**：为不愿手工操作技能目录的Harness维护者提供分层浏览与编辑入口，交付应是技能及附属资源可用、系统目录保持只读，而非仅出现导入成功提示。

> **亮点**：用宿主分层registry和可写目录边界组织图形技能管理，把格式校验放在保存前，减少“编辑器能显示但宿主不加载”的差异；属于管理流程与校验集成。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：zip导入的归属映射仅为SKILL.md及顶层Markdown登记，但提取循环要求每个entry都在该映射中，scripts/references等附属文件会被continue跳过。静态代码支持完整性缺陷，尚未执行归档复现；这直接削弱技能搬迁承诺。参见[Q03](#research-q03)。

> **建议**：可先构造按顶层skill归属的完整文件清单，严格校验并在暂存目录完成后原子rename，返回文件摘要与未导入原因；用含scripts/references及名称冲突的zip往返比对，若缺文件、覆盖不可回滚或目录越界即否定。假设未验证且增加暂存/备份空间。参见[Q05](#research-q05)。

<a id="plugin-1352089397-root"></a>

## [dsh-soul](../../plugins/aliuyanfeng--dsh-soul/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,337](https://img.shields.io/static/v1?label=npm+30d&message=2%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)

> **用途**：需要在不同项目或会话中稳定切换角色提示和个性设置的用户可用它管理人格配置并按全局、工作区或会话范围绑定，在提示装配时注入且提供命令、工具和界面入口；合格结果是当前人格和作用域可见、变更即时且可撤销，不在错误项目泄漏提示或历史。详见[Q01](#research-q01)。

> **亮点**：把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层。它相对“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **思考**：多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

> **建议**：未来可探索：可用显式优先级图展示每次提示的来源与覆盖关系，并为人格切换提供可回放的差异和撤销事务。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

<a id="plugin-1335332435-root"></a>

## [dsh-sound](../../plugins/ai-galaxy-gpu--dsh-sound/INSIGHT.md)

[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/AI-Galaxy-GPU/dsh-sound) [![npm 30d 920](https://img.shields.io/static/v1?label=npm+30d&message=920&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound) [![最新发布 2026-09-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ai-galaxy/dsh-sound)

> **用途**：离开聊天视线时辅助感知进展/待办，仍以原UI状态为准。

> **亮点**：将多事件/来源/音源与回放和跨tab干扰处理接成配置流程，非可靠通知队列或业务确认。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：snapshot无结束reason可误响完成，跨tab与静默播放失败不保证恰好一次/实际听到，子Agent默认和文档不一致。详见[Q02](#research-q02)。

> **建议**：可探讨事件/播放状态收据和短租约、弱语义提示与模块清理，仍不能以API证明用户听到。详见[Q05](#research-q05)。

<a id="plugin-1334493734-root"></a>

## [dsh-speak](../../plugins/alan2z--dsh-speak/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/Alan2Z/dsh-speak) [![npm 30d 1,635](https://img.shields.io/static/v1?label=npm+30d&message=1%2C635&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-speak) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-speak)

> **用途**：面向本机等待长任务、需要从屏幕之外获知结果或审批请求的个人使用者，交付可识别且可停止的声音提醒。[Q01](#research-q01)

> **亮点**：相对手工复制文本调用系统TTS，增量是把最终回复筛选、审批/提问、FIFO重播和配置整合到DSH注意力交接流程。合成能力继承操作系统，队列与重播上游归属PR #2，不主张原创TTS或生态唯一。[Q02](#research-q02) [Q03](#research-q03)

> **思考**：可靠提醒是否真受用户控制？默认assistant/message定时器不检查automaticSpeech，关闭自动朗读仍可能入队；全插件共享lastText/timer缺少会话隔离，可被另一会话开始事件取消或错配。此为源码推导而非运行复现，足以收窄采用范围。[Q04](#research-q04)

> **建议**：未验证假设：以session+turn分区待播状态，审批/提问优先并在播放前再次检查开关，可减少错配和关键请求等待。用两会话交错20组事件比较错配、漏播、饥饿和停止延迟；若错配不归零或最终回复饥饿则否定方案，不计入当前插件贡献。[Q08](#research-q08)

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

[![GitHub ★ 203](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=203&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,169](https://img.shields.io/static/v1?label=npm+30d&message=10%2C169&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

> **用途**：适合经常等待长任务、希望区分运行阶段的 DSH Web 用户；合格结果是状态文案可读且原生进度仍可识别。

> **亮点**：相对手改宿主文案，贡献在升级独立配置与条件词库形成的可维护定制入口，不能把动画或词条数量当生产率收益。[Q01](#research-q01)

> **思考**：状态 DOM 与选择器是实际兼容契约，复杂观察器、动画及周期扫描可能增加浏览器负担；持久配置改善不证明新宿主上仍准确识别运行状态。[Q03](#research-q03)

> **建议**：未验证假设是把状态来源抽成宿主事件适配层，DOM 扫描只兜底，可减少误判和空扫；用相同长任务记录事件与DOM路径的状态延迟、漏判及主线程时间，若事件覆盖不足或负担未降则否定。[Q05](#research-q05)

<a id="plugin-1425208683-root"></a>

## [dsh-stock-quotes](../../plugins/ahacrazy--dsh-stock-quotes/INSIGHT.md)



> **用途**：面向希望在DSH旁查看公开行情的用户；合格结果是代码、市场、字段和时间含义清楚的参考报价，而非交易执行或投资结论。

> **亮点**：相对让模型凭记忆报价，增量在结构化公共数据工具和面板，明确缺失项、市场和参考时间；主要是成熟行情接口集成，没有独立数据源或准确性验证贡献。[Q01](#research-q01)

> **思考**：asOf在请求发起前取本机时间，不是交易所行情时间；裸六位代码尝试多个市场且首个命中即用，可能选中与用户意图不同标的，不能据显示时间和数字判断实时准确。[Q03](#research-q03)

> **建议**：未验证假设是对歧义代码要求显式市场确认，并分开请求时间与来源报价时间，可减少错标的和新鲜度误解；比较查询集的错配与确认负担，若误配不降则否定。[Q05](#research-q05)

<a id="plugin-1400498179-root"></a>

## [dsh-study-coach](../../plugins/ame-choo--dsh-study-coach/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/Ame-Choo/dsh-study-coach) [![npm 30d 353](https://img.shields.io/static/v1?label=npm+30d&message=353&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-study-coach) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-study-coach)

> **用途**：单人持续课程学习，目标/材料/证据需要跨会话回访。详见[Q01](#research-q01)。

> **亮点**：把学习目标、材料页、做题证据与面板回访接合，减少重复整理。详见[Q01](#research-q01)。

> **思考**：双HTTP入口本地无身份准入，坏JSON默认回落可被后写覆盖，无投影时学习会话筛选降级。详见[Q04](#research-q04)、[Q05](#research-q05)。

> **建议**：研究证据去重与延迟测验、每会话profile绑定、统一准入及读错拒写/CAS恢复，比较效果和误归属。当前未验证。详见[Q07](#research-q07)。

<a id="plugin-1390600932-root"></a>

## [dsh-temptask](../../plugins/aeroscis--dsh-temptask/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aeroscis/dsh-temptask) [![npm 30d 1,309](https://img.shields.io/static/v1?label=npm+30d&message=1%2C309&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@aeroscis/dsh-temptask)

> **用途**：一次性探索不污染长期工作区，有价值成果再转正。详见[Q01](#research-q01)。

> **亮点**：串起临时到保留的目录/会话流程，少做手工接线。详见[Q01](#research-q01)。

> **思考**：目录未独占预留，实例队列不能防多进程覆盖，转正非事务且取消失败仍可删除。详见[Q04](#research-q04)。

> **建议**：研究独占目录租约、跨进程CAS与持久化阶段日志，把删除/转正做成可恢复状态机。当前未验证。详见[Q06](#research-q06)。

<a id="plugin-1389458393-root"></a>

## [dsh-text-inject](../../plugins/1497105876--dsh-text-inject/INSIGHT.md)



> **用途**：个人用户维护常驻约束与背景文本；初始示例会自动注册，应先处理。详见[Q01](#research-q01)。

> **亮点**：把提示词文本从官方配置独立出来，提供设置页、预览、历史备份与热加载。详见[Q01](#research-q01)。

> **思考**：[context] 不按 README 的 trigger 条件门控；GET/POST 路由可读改完整提示词，必须核宿主外层权限。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未验证改进为门控文档/实现对齐、路由授权、文件版本冲突与敏感历史管理。详见[Q05](#research-q05)。

<a id="plugin-1343882273-root"></a>

## [dsh-think-bounce-pet](../../plugins/9livewolf--dsh-think-bounce-pet/INSIGHT.md)

[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/9livewolf/dsh-think-bounce-pet)

> **用途**：纯娱乐 Web UI 装饰，适合愿接受持续动画的个人用户；不代表模型思考质量。详见[Q01](#research-q01)。

> **亮点**：把 DSH 可见推理文本变化映射为可交互的装饰弹球，配置和动画生命周期集中在客户端；贡献在趣味交互，不在模型能力。详见[Q01](#research-q01)。

> **思考**：reasoning 文本不等于真实推理生命周期，空块/切会话可错过或提前结束动画；默认常驻球无推理时也持续 rAF，性能/遮挡需实测。详见[Q03](#research-q03)。

> **建议**：未验证方向是宿主生命周期驱动的明确标注反馈、默认减动效和空闲暂停，以事件对齐、帧耗与操作遮挡夹具验收。详见[Q05](#research-q05)。

<a id="plugin-1341694685-root"></a>

## [dsh-thumb](../../plugins/aliceljy--dsh-thumb/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AliceLJY/dsh-thumb)

> **用途**：个人手机或平板用户在窄屏DSH web切会话、阅读与改设置；需要抽屉能关且轨迹与桌面不受误伤。

> **亮点**：集中语义定位、自有样式标记和公共layout关闭接口，把成熟抽屉模式接到DSH；以未被自身CSS覆盖的上游意图判断展开是可借鉴处，免hash不等于免DOM耦合。详见[Q02](#research-q02)。

> **思考**：定位只取首个匹配且逐节点打标，没有唯一性和整体健康门控；语义后缀会改名，热卸载清理还存在静态边界。未复现误匹配或残留，不能据此称升级安全。详见[Q03](#research-q03)。

> **建议**：可探索定位器组合完整性与唯一性检查，通过故障输入比较部分样式污染、误伤和探测开销；当前未实现，不把这个设想计入现有贡献。详见[Q06](#research-q06)。

<a id="plugin-1426519329-root"></a>

## [dsh-tingdong](../../plugins/aicivilization--dsh-tingdong/INSIGHT.md)

[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tingdong)

> **用途**：面向用自己英文音频/文档练听力的中文学习者，交付为可校订句子、时间轴、双语讲解与复习队列；学习记录中的“掌握”是软件规则，不是语言能力测评。

> **亮点**：将本地识别、逐句讲解、音轨和复习状态组织成可校订的自有材料听力课，贡献在制课到练习的流程衔接；ASR/TTS/LLM与莱特纳方法不是本项目原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：“原文一个字不改”主要是提示词与数量门，cleanup只要求英文词数至少60%，不能证明语义保持；“掌握”只是box>=4的自评状态。材料整理和练习活动都不能直接证明真实听力收益。参见[Q03](#research-q03)。

> **建议**：可在文档整理加入逐段文本对齐收据，把删除/替换交人工确认，学习效果另用未见音频盲测与延迟复测。对照同词数但语义改写样本及相同学习时长，若保真错误或迁移成绩不改善则否定；假设未验证且增加审校成本。参见[Q05](#research-q05)。

<a id="plugin-1335244607-root"></a>

## [dsh-toolbox-web](../../plugins/abcdefgxw--dsh-toolbox-web/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web) [![npm 30d 977](https://img.shields.io/static/v1?label=npm+30d&message=977&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web) [![最新发布 2026-09-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web)

> **用途**：面向大量会话与工作目录的DSH用户；合格结果是能找到、整理和恢复目标资料，并保持宿主可见状态与磁盘一致。

> **亮点**：相对分散终端脚本，贡献是统一管理入口及回收站/搜索组织；部分功能直接改宿主日志而非调用原生会话控制，便利与数据格式维护成本绑定。[Q01](#research-q01)

> **思考**：消息读取尾部已适配最高代日志，但truncate/edit仍固定session.jsonl.zstd，且备份失败返回null后仍写入；这使新代日志与失败恢复成为实质源码边界，未做宿主复现。[Q03](#research-q03)

> **建议**：未验证假设是将会话写操作迁到宿主控制API或至少统一最高代解析并强制备份成功，再核对内存/落盘一致性；比较迁移会话的误改和恢复率，若兼容负担不降则否定。[Q05](#research-q05)

<a id="plugin-1356219122-root"></a>

## [dsh-turn-outline](../../plugins/andor-z--dsh-turn-outline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-turn-outline)

> **用途**：授权的长会话读者快速回看工具步骤，需把导航摘要与完整记录区分。

> **亮点**：复用结构化事件生成可追踪轨迹并跳回原文，省LLM接线且有live/冷路径优化，未证明秒开或零资源。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：Host围栏不是会话授权，任意非空sessionId进入读取链；摘要截断、lastSeq缓存及单大项预算例外也限制审计/性能承诺。详见[Q02](#research-q02)。

> **建议**：可探讨授权且有版本的轨迹投影，校验主体/session并携带日志版本重建缓存；有授权适配与重建成本，未验证。详见[Q04](#research-q04)。

<a id="plugin-1388463793-root"></a>

## [dsh-type-tune](../../plugins/awl-mc2--dsh-plugin_awl/INSIGHT.md)



> **用途**：壁纸让次级文本难读，用户希望低成本调字体和 Markdown 样式。

> **亮点**：把 CSS/字体调整集成到 DSH 设置与聊天命令，避免手工改主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：无认证状态 POST 接受无 Origin 请求；若 Web 暴露 LAN 可被网络客户端改写。写盘错误被吞、并发状态无版本保护。详见[Q03](#research-q03)。

> **建议**：加入 Host 身份验证、明确写失败和 CAS/临时文件唯一名，再做真实对比度/性能测量可提高多人部署可靠性；现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1428515480-root"></a>

## [dsh-typing-studio](../../plugins/654970--dsh-typing-studio/INSIGHT.md)



> **用途**：适合在工作间隙做本机双语自我练习；以清楚口径的练习记录验收，不作正式认证或健康/效率承诺。

> **亮点**：将中文拼音、IME提交感知和双语计时整合到DSH面板，减少切换且避免候选编辑直接误计。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：best只来自最近16条且按JS位置计字，不能当永久纪录或任意Unicode一致测量；熟题变快也不证明陌生任务改善。参见[Q02](#research-q02)。

> **建议**：未验证假设是独立保存永久最佳、字素计量并用陌生文本基准区分背诵与迁移；需跨IME对照。参见[Q03](#research-q03)。

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

> **用途**：个人用户按本地时区回顾模型用量与技能活动，合格结果需同时解释覆盖率和索引状态，不能直接当账单或业务绩效。

> **亮点**：把持久会话修订、流式去重、fork继承排除和本地时区图表组合成可重建的个人统计链，比简单累加消息更明确处理重复来源；不等同供应商计费协议。详见[Q02](#research-q02)。

> **思考**：known只代表响应有任一有效用量字段，其余缺失可归零；显式技能success也不证明任务成功。请求围栏不是身份鉴权，重建期间结果要结合索引状态解释。详见[Q03](#research-q03)。

> **建议**：可探索字段级覆盖与源修订对账收据，用真实缺字段和重复事件样本比较是否减少误判及解释时间；当前未实现，不计为插件已有创新。详见[Q06](#research-q06)。

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

<a id="plugin-1335070045-packages-vision-route"></a>

## [dsh-vision-route](../../plugins/314857493--dsh-vision--packages-vision-route/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,252](https://img.shields.io/static/v1?label=npm+30d&message=1%2C252&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route)

> **用途**：适合现有文本模型必须处理截图或历史附件、又没有原生视觉入口的场景；已有原生多模态模型时直接调用更短且保真。 详见[Q01](#research-q01)。

> **亮点**：支持针对用户问题重新转写历史附件，并用进程缓存避免同图重复调用；贡献是路由层兼容，不是新的识图模型。 详见[Q03](#research-q03)。

> **思考**：图片会离开本机，文字中间层会丢布局和细节；标签只能降低提示注入混淆，不能证明视觉服务不会误读。 详见[Q04](#research-q04)。

> **建议**：按附件敏感等级决定是否外发，并比较“原图直送”与“转写再送”的答案一致率，才能决定这层路由的净收益。 详见[Q08](#research-q08)。

<a id="plugin-1335664137-root"></a>

## [dsh-vision-web](../../plugins/54xkeee--dsh-vision/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision) [![npm 30d 1,391](https://img.shields.io/static/v1?label=npm+30d&message=1%2C391&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-web) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-web)

> **用途**：适合纯文本 DeepSeek 需要 OCR、区域、比较和跨轮视觉证据；可直接使用原生视觉模型时链路明显更短。 详见[Q01](#research-q01)。

> **亮点**：多通道降级、证据记忆和任务模式组合完整，尤其豆包网页队列把已登录浏览器额度接入 Host。 详见[Q03](#research-q03)。

> **思考**：默认零 API key 不等于零成本或低风险：需 Windows bridge、调试 Chrome 和豆包登录，网页 DOM 自动化及第三方留存都可能变化。 详见[Q04](#research-q04)。

> **建议**：按敏感等级和任务类型做显式通道路由，并把每次升级/缓存/供应商写入证据，可验证“自动降级”是否真的省钱且不串数据。 详见[Q08](#research-q08)。

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

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-mobile-fix) [![npm 30d 1,715](https://img.shields.io/static/v1?label=npm+30d&message=1%2C715&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-mobile-fix)

> **用途**：面向通过手机浏览Harness Web、频繁在设置、会话列表和对话输入间切换的人。合格结果是窄屏能选会话、配置及发送信息而不遮挡；简单替代是宿主原生响应式布局或用户样式。该版还包含Android悬浮窗口行为，不应仅按CSS补丁理解。

> **亮点**：相对手改产品源码，插件封装了可随profile加载的窄屏布局及悬浮窗口交互，集中处理导航、输入与会话切换；增量为宿主界面适配，未识别新布局算法。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：README的纯CSS与完全可逆描述不覆盖真实实现。overlay分支全局替换focus且清理未恢复，pointer/touch/mousedown与侧栏监听也未全部移除；这是静态可见的清理遗漏，实际干扰尚未复现。参见[Q03](#research-q03)。

> **建议**：可把悬浮焦点策略改为有所有者的可撤销适配器，保存原focus、统一登记监听和计时器，停用时逐项恢复。对照当前分支反复加载/停用、键盘导航及两个插件并存，若焦点和监听未恢复或触控体验变差则否定方案；仍是未验证设计。参见[Q05](#research-q05)。

<a id="plugin-1366583376-root"></a>

## [dsh-web-url-view](../../plugins/1032740078--dsh-web-url-view/INSIGHT.md)



> **用途**：可信局域网中从手机等设备访问 DSH GUI；使用者需接受同网设备无额外口令的权限边界。详见[Q01](#research-q01)。

> **亮点**：以稳定书签地址连接每次重启变化的 DSH Web 实例。详见[Q01](#research-q01)。

> **思考**：LAN 无密码即认证代理的核心代价；异常日志中 token URL 和有体请求 401 重放可能带来风险。详见[Q03](#research-q03)和[Q04](#research-q04)。

> **建议**：未实现的改进是绑定来源授权/TLS、日志脱敏和不可重放请求的安全续期。详见[Q05](#research-q05)。

<a id="plugin-1387205322-root"></a>

## [dsh-whale-girl-live2d](../../plugins/andersen216--dsh-whale-girl-live2d/INSIGHT.md)

[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=yellow&logo=github&style=flat)](https://github.com/Andersen216/dsh-whale-girl-live2d)

> **用途**：个人用户在 DSH 看角色反馈、与会话交互；可选 macOS 桌面外壳。详见[Q01](#research-q01)。

> **亮点**：把 Live2D 动作、会话可见事件与输入控件合为一套桌宠界面；娱乐/UI 集成而非模型能力。详见[Q01](#research-q01)。

> **思考**：信任栅栏缺失/异常时 fail-open 使 say/cancel/control/HUD 等路由失守；素材非商业许可与代码 MIT 分层。详见[Q03](#research-q03)及[Q05](#research-q05)。

> **建议**：未验证方向是路由默认拒绝、通行证权限/轮换和 HUD 明确估算标识，配目标宿主安全与资源矩阵验收。详见[Q06](#research-q06)。

<a id="plugin-1339803365-root"></a>

## [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)

> **用途**：需要频繁管理DSH主页会话与工作区的读者，正确目标与分步结果比菜单数量更重要。

> **亮点**：集中常见行操作并提供跨平台文件管理器接线，依赖宿主与archive-manager完成多数业务动作。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：Host递归删除接受绝对path而不绑定注册workspace/确认计划，UI双确认与功能开关不能约束接口；会话清理失败还会继续删目录。详见[Q02](#research-q02)。

> **建议**：可探讨workspace/物理路径绑定的一次性恢复删除计划，按步留收据并提供回收位置；有存储和跨插件协作成本，未验证。详见[Q04](#research-q04)。

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

> **用途**：面向在 WSL 中运行 DSH、但日常使用 Windows 浏览器的开发者，快速打开本地服务或文档链接。 [Q01](#research-q01)

> **亮点**：相对手工复制 URL，它提供模型可调用、带协议限制和失败提示的 WSL→Windows 桥接，贡献小而明确。 [Q03](#research-q03)

> **思考**：工具只发起打开动作，不确认浏览器是否可达或页面是否正确加载；localhost 提示也不能替代端口转发诊断。 [Q04](#research-q04)

> **建议**：可增加只读可达性预检与回执，把“进程已启动”和“Windows 侧页面可访问”分开报告，但不应扩大到任意 URI。 [Q08](#research-q08)

<a id="plugin-1381860995-root"></a>

## [dsh-wsl-cal](../../plugins/173787247--dsh-wsl-cal/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)

> **用途**：面向已在 WSL 使用 khal 管理日历的用户，让代理在每日检查和计划任务时读取现有安排。 [Q01](#research-q01)

> **亮点**：相对终端执行 khal，它把只读日历查询接入模型工具并限制日期范围，增量是低风险接线而非新的日历能力。 [Q03](#research-q03)

> **思考**：输出依赖用户自行维护的 khal 配置、时区与同步状态，且插件不创建或修改事件；读取成功不能证明日历已同步或计划可执行。 [Q04](#research-q04)

> **建议**：可在保持只读的前提下增加“计划冲突解释”，明确引用事件来源和时区，并让任何写入建议仍由用户确认到外部日历工具。 [Q08](#research-q08)

<a id="plugin-1350378372-root"></a>

## [dsh-wsl-clipboard](../../plugins/173787247--dsh-wsl-clipboard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard)

> **用途**：明确授权复制非敏感短路径/命令/片段到Windows应用，或读取指定共享剪贴板文本。

> **亮点**：把常见跨WSL脚本接线变为工具，base64分离数据与脚本，非新剪贴板隔离技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：进程成功非剪贴板回读，PowerShell非终止错误/stderr未核；set截断展示不明，base64 argv不保密且全局状态无CAS。详见[Q02](#research-q02)。

> **建议**：可探讨stdin/安全通道和错误/编码协议、写后hash收据与显式截断，跨interop/隐私成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1351854499-root"></a>

## [dsh-wsl-download](../../plugins/173787247--dsh-wsl-download/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download)

> **用途**：把 Windows 已下载文件搬入 WSL，或查询模型文件获取建议。

> **亮点**：提供 Windows Downloads 到 WSL 的简单模型工具入口，详见[Q01](#research-q01)。

> **思考**：destDir 任意、默认覆盖同名文件，源 stat 跟随符号链接；详见[Q02](#research-q02)。 copy前先stat整目录且同步不接signal，30/15秒不等总IO或取消保证。

> **建议**：可探索授权realpath、默认no-clobber与分片清单/hash、有限可取消临时复制和明确组状态；有IO/空间/维护代价，尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1350378498-root"></a>

## [dsh-wsl-launch](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch)

> **用途**：让 DSH Agent 从 WSL 启动 VS Code、Explorer 或浏览器等 Windows 应用。

> **亮点**：把 Windows 应用启动封装成 DSH 工具，并对目标名设默认 allowlist；详见[Q01](#research-q01)。

> **思考**：allowlist 只核 target 字符串，args 与最终应用行为未限，前缀通配扩大范围；详见[Q02](#research-q02)。

> **建议**：绝对路径与逐应用参数策略可能收窄启动授权，但需兼容验证；详见[Q03](#research-q03)。

<a id="plugin-1350379268-root"></a>

## [dsh-wsl-notify](../../plugins/173787247--dsh-wsl-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify)

> **用途**：明确允许在Windows桌面显示非敏感任务提示，真实业务状态另核。

> **亮点**：把跨WSL桌面脚本接成工具/两分支，非自动事件通知或可靠投递。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：进程ok非实际显示，非终止错误可能不fallback；默认阻塞与分支总等待/取消未统一，裁剪不明且argv不保密。详见[Q02](#research-q02)。

> **建议**：可探讨明确通知状态/稳定ID与总deadline、错误/取消协议和截断说明，仍不证明人已阅读。详见[Q05](#research-q05)。

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

> **用途**：WSL中的Agent生成办公文件后，用户需要在Windows阅读编辑；快捷打开应以正确文件真正显示为合格结果。详见[Q01](#research-q01)。

> **亮点**：把手工复制路径、wslpath转换和默认应用打开接成聊天点击流程，并以CSS Highlight避免替换React文本DOM；已有价值是跨系统工作流集成。详见[Q01](#research-q01)。

> **思考**：API成功不等于正确窗口显示，Explorer数字退出码会被接受；来源规则也只限定localhost主机而不严格比较端口，实际权限依赖宿主。均为静态核查边界，未做漏洞或故障复现。详见[Q03](#research-q03)。

> **建议**：可研究把点击范围限定为消息交付物，并展示真实路径及可见失败状态，再以长会话和复杂路径对照漏检、误点与正确显示结果。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1351854253-root"></a>

## [dsh-wsl-shot](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot)

> **用途**：在 WSL 中把 Windows 截图/复制的图片存成本地文件以便后续引用。

> **亮点**：提供 win_shot 工具完成跨 Windows/WSL 剪贴板图片落盘；详见[Q01](#research-q01)。

> **思考**：Public 临时图片在失败分支可能残留，时间戳命名与并发标记有碰撞风险；详见[Q02](#research-q02)。

> **建议**：独占临时目录、唯一命名和 finally 清理或可减少碰撞/残留；需隔离测试，详见[Q03](#research-q03)。

<a id="plugin-1391141792-root"></a>

## [dsh-wsl-uia](../../plugins/173787247--dsh-wsl-uia/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-uia)

> **用途**：面向在WSL运行DSH、需要理解Windows应用当前窗口/控件的人。uia_tree一个工具含windows/tree/find/wait/path五动作，获取顶层窗口、控件名字/类型/状态/矩形/可用pattern，或等命名元素/追溯祖先，帮助模型说明界面和准备后续操作。

> **亮点**：将Windows UIA语义、PowerShell互操作、按名等待/path与DSH观察工具连接，减少纯视觉定位负担。详见[Q02](#research-q02)。

> **思考**：windowHandle声明未用，pid取首窗、tree默认前台而wait/path默认首窗；epoch.index未持久绑定窗口或动作。tree限返回数非visited，Name/title无秘密过滤，总wait预算/取消未贯穿。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：可探索随机观测ID绑定会话/PID/HWND/时间与动作前重核、visited/省略收据、敏感策略和总signal预算；未实现。详见[Q06](#research-q06)。

<a id="plugin-1391142149-root"></a>

## [dsh-wsl-wininput](../../plugins/173787247--dsh-wsl-wininput/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-wininput)

> **用途**：面向 DSH 运行在 WSL、但需要操作明确 Windows 窗口或控件的用户。输入是窗口选择器、UIA 属性或按键/点击动作；合格结果是目标窗口被唯一识别，动作落在预期元素，最好不抢前台焦点，并返回足够信息确认执行。简单替代是手动操作、普通 SendKeys 或桌面自动化框架。

> **亮点**：相对全局键鼠模拟，它强调先选窗口/元素再执行，可在部分路径避免抢焦点；相对完整 RPA，它是单工具、零长期服务的轻量桥。贡献是 WSL 到 Windows UIA/输入的窄接口与结构化回执，不是新的 UI Automation 算法。 参见[Q03](#research-q03)。

> **思考**：最关键风险是目标解析错误后仍产生真实输入。窗口标题可能重复，元素树会变化，坐标受 DPI/多屏影响；非前台输入并非所有应用都支持，管理员窗口还受权限边界。源码级参数检查不能证明真实应用收到动作，也未看到统一的用户审批或动作后结构差异验证。 参见[Q04](#research-q04)。

> **建议**：可为写动作增加先读后写协议：返回目标窗口/元素指纹，用户或代理提交带短期 nonce 的动作，执行后再次读取属性并比对预期；重复 nonce 拒绝。它可能减少错窗口和盲重试，但会增加一次往返并依赖可观察状态。 参见[Q08](#research-q08)。

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

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AirPineApplea/feiyu-memory)

> **用途**：面向接受个人陪伴式记忆、愿意人工检查本地日记的低敏感娱乐用户；交付应区分人格规则、自发判断与事件转述，不将模型推断当作用户事实或生产知识库。

> **亮点**：以三声部区分人格、判断和事件，结合本地派生索引与预算召回塑造连续感；贡献是记忆叙事与管理安排，不是事实准确或隐私保证。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：隐私门未覆盖全部额外模型请求：session/event将原文赋lastUserText，judgeWorthKeeping直接buildJudgeInput并llm.stream；scrub只在后续consolidate。固定版面板也明确不自加鉴权，不能用“无CORS”替代访问控制。静态可核，未发送真实秘密复现。参见[Q03](#research-q03)。

> **建议**：可把隐私策略放到所有模型出站共用门，并以来源/事实-推断/敏感级/确认状态控制召回，面板走宿主认证。用合成凭据追踪judge、固化、手记与日志，任何未脱敏出站或确认前误召回即否定；假设未验证，可能降低自然感并增复核。参见[Q05](#research-q05)。

<a id="plugin-1333716755-plugins-harness-memory"></a>

## [harness-memory](../../plugins/988hj7tczd-oss--harness-desktop--plugins-harness-memory/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-desktop) [![npm 30d 187](https://img.shields.io/static/v1?label=npm+30d&message=187&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-memory) [![最新发布 2026-04-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-memory)

> **用途**：面向单用户持续使用DSH、需要跨会话保留偏好和约定的人；合格结果是准确、可删的少量长期记忆，而非自动知识库检索。

> **亮点**：相比每次复制个人偏好，增量是宿主存储域与系统提示的轻量闭环；采用全表近期选择而非检索，适合少量资料，不应归为语义记忆系统。[Q01](#research-q01)

> **思考**：表记录没有项目字段，注入函数也没有会话过滤，project标签只负责显示分类；多项目混用可能交叉污染。按文本完全相等去重不能处理改写、矛盾和过期事实。[Q03](#research-q03)

> **建议**：未验证假设是增加workspace作用域和显式失效时间，在召回前过滤，减少跨项目误用；用同名不同约定的项目对照错误引用率和人工维护时间，无改善则否定。[Q05](#research-q05)

<a id="plugin-1374454334-root"></a>

## [hover-glossary](../../plugins/alycestocking--hover-glossary/INSIGHT.md)

[![npm 30d 48](https://img.shields.io/static/v1?label=npm+30d&message=48&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/hover-glossary) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/hover-glossary)

> **用途**：适合在DSH浏览器聊天中阅读技术术语/缩写、想少复制跳转词典的用户。鼠标停在已发送用户/助手正文，显示静态词库的1到多条解释。合格结果是取到光标真实字符、命中正确词边界、列出登记释义并保留正文，不能把最长词或最高权重当作上下文语义判定。

> **亮点**：把本地多义词库、真实字形定位、消息/控件范围与归一化最长匹配组合到同屏浮层，减少手工查词切换；不做语境消歧。详见[Q02](#research-q02)。

> **思考**：启动自检先取Text并记录前24字符/完整token，再报告范围判定；无模型调用不能推出无内容诊断。鼠标单通道和长token候选预算也有限制。详见[Q03](#research-q03)。

> **建议**：可探索无文本诊断、显式词域/键盘锁定浮层与候选预算，比较日志最小化/正确率/延时，未实现。详见[Q05](#research-q05)。

<a id="plugin-1335144603-root"></a>

## [ikun-theme-skin](../../plugins/aks1st--ikun-theme-skin/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin)

> **用途**：个人用户在 DSH Web 中自愿使用娱乐主题。

> **亮点**：把主题、媒体和互动彩蛋打包为 Web 主题体验，而非模型或工作流能力提升。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：启用时主动 setTheme('ikun-day')，清理未恢复先前偏好；远程媒体部分追踪 main/master，长期可用性不固定。详见[Q03](#research-q03)。

> **建议**：改为显式选择、可恢复原偏好并固定/降级素材，比较启停状态保持和加载/性能；本版未实现。详见[Q04](#research-q04)。

<a id="plugin-1335798113-packages-messaging-core"></a>

## [messaging-core](../../plugins/534119219--dsh-messaging--packages-messaging-core/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/534119219/dsh-messaging)

> **用途**：给需从消息渠道访问DSH的人统一会话入口，合格回复需身份、目标聊天及投递状态正确。

> **亮点**：统一平台adapter、DSH会话/命令和事件驱动出站，减少逐平台机器人重复接线；上游hermes/SDK/DSH能力不属原创，注册数量不代表效果。详见[Q02](#research-q02)。

> **思考**：入站白名单不等出站授权，send_message可直接指定已连接平台/chat，status列全部聊天；平台workspace共享且map非原子写，不能承诺多用户隔离与恰好一次投递。为静态核查未真实发送。详见[Q02](#research-q02)。

> **建议**：可探讨授权目标投递收据，绑定主体/会话/允许chat及操作ID，按调用者过滤状态并保存ACK/未知结果；平台差异和策略维护增加成本，未验证。详见[Q05](#research-q05)。

<a id="plugin-1374149009-root"></a>

## [oil-dsh-title](../../plugins/598829314--oil-dsh-title/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title)

> **用途**：长会话与多会话主线变化后，减少手工改标题。详见[Q01](#research-q01)。

> **亮点**：继承oil-codex-title命名政策，新增DSH官方事件/rename适配和有界消息抽取。详见[Q01](#research-q01)。

> **思考**：生成中缺用户seq和标题CAS，新意图可能被丢/覆盖；Windows hint与隐私校验仅有限模式。详见[Q03](#research-q03)。

> **建议**：从丢弃式互斥推导版本化最小上下文、最后意图单飞与人工让权，按具体竞争/隐私反例比较误改和成本；未验证。详见[Q05](#research-q05)。

<a id="plugin-1418691015-root"></a>

## [Prompt Desk](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)

> **用途**：个人 DSH 使用中维护全局指令与人工确认的错误教训。

> **亮点**：把提示编辑、教训条目、注入预览和自述草稿审核整合到对话标题栏。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：sessionPrompt 存于单个全局状态文件，且 POST 路由可改全局 AGENTS；宿主授权未证实。详见[Q01](#research-q01)、[Q04](#research-q04)。

> **建议**：按会话隔离状态并验证路由权限、采集流，可降低跨会话串扰和误采；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1424219088-root"></a>

## [插件名片](../../plugins/3tiga3--dsh-plugin-namecards/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)

> **用途**：插件多且需本地中文备注与分组查找的单用户场景。详见[Q01](#research-q01)。

> **亮点**：以稳定包/子行键把本地显示覆盖、整理与可搬运名片交付接入官方页和独立管理页，减少手改元数据。详见[Q01](#research-q01)。

> **思考**：只显示的定位遗漏真实卸载路由；回环peer不等用户授权，图标内容和整包恢复边界尚不闭合。详见[Q02](#research-q02)。

> **建议**：分离显示与管理授权，并用按profile的hash manifest和事务导入确保备份可恢复；按越权/坏图/超预算/竞争反例证伪，未验证。详见[Q05](#research-q05)。

## 更新时间

2026-10-23
