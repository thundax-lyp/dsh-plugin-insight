# 个人效率

[返回首页](../../../README.md)

输入、会话、快捷操作与个人工作体验。

**快速比较**

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [api-balance](#plugin-1334899834-root) | 在 DSH Web 输入区显示 DeepSeek 账户余额，支持手动和定时刷新。 | 先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。 |
| [DPH 任务看板](#plugin-1336994666-root) | 把真实会话归入任务状态列，并保存备注和可供智能体读取的看板快照。 | 用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。 |
| [dsh-about](#plugin-1354283280-root) | 在设置中显示当前 DSH 版本，并代理读取官方 GitHub 发布说明。 | 与实际 dsh --version 对照后使用，路径识别失败时保留未知而不据此判断升级成功。 |
| [dsh-chatgpt-style](#plugin-1421963463-root) | 调整DSH聊天排版与语义标注，并在发送框旁提供思考或快速档位切换。 | 先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。 | 先以长草稿测试中文输入法、斜杠菜单和 Ctrl/Cmd+Enter，确认关闭后恢复原生行为。 |
| [dsh-discord-richpresence](#plugin-1342915339-root) | 把 DSH 的粗粒度活动或可选丰富状态同步到本地 Discord Rich Presence。 | 先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。 |
| [dsh-mimotts](#plugin-1397477851-root) | 把定稿助手回复交给MiMo TTS合成语音，提供消息播放按钮、内联播放器与语音历史。 | 先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。 |
| [dsh-neo-skin](#plugin-1335557891-root) | 通过主题覆盖层为 DSH Web 提供新粗野主义配色和可切换外观方案。 | 先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。 |
| [dsh-perlica-ding](#plugin-1335704653-root) | 根据计划、执行、等待回应和错误状态播放分级提示音，普通问答保持安静。 | 先用测试音和短任务核查四种状态，调整音量及去抖，不将完成音当验收。 |
| [dsh-prompt-polish](#plugin-1336538202-root) | 在输入栏调用宿主模型重写草稿，支持策略、语言、上下文与人工确认采纳。 | 先不带历史改写普通草稿，对照检查否定、数字和交付限制；需要上下文时再开启，并人工决定是否采用。 |
| [dsh-side-session](#plugin-1355639507-root) | 从命令菜单创建可继续的旁会话，并跳转到原生子会话聊天视图。 | 先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。 |
| [dsh-spotlight](#plugin-1333136466-root) | 以键盘命令面板统一查找原生命令、近期会话和插件入口。 | 先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。 |
| [dsh-status-rotator](#plugin-1333328839-root) | 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 | 先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。 |
| [dsh-text-inject](#plugin-1389458393-root) | 从独立Markdown文件加载系统提示和上下文块，提供设置页编辑、热加载与历史备份。 | 先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。 |
| [dsh-tokenrhythm-bill](#plugin-1351903192-root) | 集中展示基元律动等平台的余额、用量、模型与密钥，并提供账号切换和连通探测。 | 先只接入常用平台，对照控制台核验当前账号和限时额度，按需启用模型探测；敏感凭据留在受控宿主。 |
| [dsh-voice-input-web](#plugin-1335558973-root) | 在输入框旁增加麦克风入口，使用浏览器语音识别把文字写入草稿。 | 先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。 | 先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从WSL调用Windows默认浏览器打开HTTP或HTTPS地址，并给出localhost排障提示。 | 适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。 |
| [dsh-wsl-clipboard](#plugin-1350378372-root) | 从WSL读取或写入Windows文本剪贴板，支持长度限制与Unicode编码转换。 | 先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。 |
| [dsh-wsl-download](#plugin-1351854499-root) | 列出Windows下载目录中的文件并复制到WSL，另提供本地模型文件管理提示。 | 先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。 |
| [Forge 便签](#plugin-1363429979-plugin-notes) | 提供 Markdown 便签板、搜索归档和任务泳道，可把便签交给智能体或定时执行。 | 先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。 |
| [Prompt Desk](#plugin-1418691015-root) | 在对话标题栏编辑全局与会话提示词，并把模型自报错误收为待确认经验草稿。 | 已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。 |
| [蓝毛小女仆桌宠](#plugin-1409724830-src) | 以透明动画桌宠提供陪伴聊天，可选本地模型、在线模型与屏幕观察。 | 先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。 |

<a id="plugin-1334899834-root"></a>

## [api-balance](../../plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance)

- **用途**：使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。
- **亮点**：Host 每次解析凭据并通过 curl 请求余额，客户端持久化刷新偏好并保留失败前的数据。
- **思考**：余额就近可见减少切换，但旧读数可能掩盖故障，必须保留更新时间和失败提示。
- **建议**：先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。

<a id="plugin-1336994666-root"></a>

## [DPH 任务看板](../../plugins/1070296335-create--dph-taskboard/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard)

- **用途**：同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。
- **亮点**：浏览器以 localStorage 管理分类，宿主路由接收快照原子落盘，恢复归档优先走 workspaceRegistry。
- **思考**：卡片直接对应会话可减少重复建账；浏览器状态与落盘镜像仍可能出现不同步。
- **建议**：用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。

<a id="plugin-1354283280-root"></a>

## [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about)

- **用途**：需要确认实际运行版本及更新内容的用户不必另外打开终端和发布页。
- **亮点**：宿主从 clientModules 路径反推包版本，注册只读 version/releases 路由，对 GitHub 响应缓存五分钟。
- **思考**：能把当前版本与发布说明放在一起，但不会执行更新，也不证明新版本适合当前插件组合。
- **建议**：与实际 dsh --version 对照后使用，路径识别失败时保留未知而不据此判断升级成功。

<a id="plugin-1421963463-root"></a>

## [dsh-chatgpt-style](../../plugins/137--dsh-chatgpt-style/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/137/dsh-chatgpt-style)

- **用途**：习惯居中聊天版式的用户希望改善长文本阅读和切换模型思考档位，验收是内容不丢失、输入操作正常。
- **亮点**：client.js注入CSS并用MutationObserver装饰完成后的文本，检测data-streaming避免修改流中节点；档位通过宿主modelDirectories读取和提交。
- **思考**：复用宿主模型目录比维护另一套配置可靠，但视觉强调不构成事实已验证，绿色结论仍需读者核实。
- **建议**：先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。

<a id="plugin-1334850903-root"></a>

## [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 1011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand)

- **用途**：经常编辑长提示词的用户需要在发送前查看和修改更多草稿内容。
- **亮点**：客户端插槽按钮切换 CSS class 并保存浏览器偏好，DOM observer 修复重建后的样式，捕获普通 Enter 避免发送。
- **思考**：可逆且范围小的界面增量容易评估；收益取决于长文本频率，不应夸大为通用生产力提升。
- **建议**：先以长草稿测试中文输入法、斜杠菜单和 Ctrl/Cmd+Enter，确认关闭后恢复原生行为。

<a id="plugin-1342915339-root"></a>

## [dsh-discord-richpresence](../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence)

- **用途**：希望向 Discord 联系人展示工作状态的桌面用户，而非需要团队任务追踪的部署。
- **亮点**：Host 聚合活动信号，通过本地 Discord RPC 更新文案；丰富模式按最短展示间隔轮换数据。
- **思考**：减少手动改状态，但不能证明专注度或工作产出；企业环境应先确认活动公开政策。
- **建议**：先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。

<a id="plugin-1397477851-root"></a>

## [dsh-mimotts](../../plugins/1497105876--dsh-mimotts/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts)

- **用途**：希望听回复的用户需要可重放音频和便捷控制，验收包括文字读音、播放完成与敏感文本发送范围。
- **亮点**：Host合成路由先过connection.requestRejection，读取有限文本并调用TTS端点；客户端提交消息文本并接收WAV，语音记录独立保存。
- **思考**：消息动作行和历史让朗读更连贯；声音自然不代表文本正确，模型回复内容仍可能有误。
- **建议**：先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。

<a id="plugin-1335557891-root"></a>

## [dsh-neo-skin](../../plugins/0nt-one--dsh-neo-skin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) · [![npm 30d 113](https://img.shields.io/static/v1?label=npm+30d&message=113&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin)

- **用途**：长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。
- **亮点**：客户端调用 theme.overrideTokens，设置插槽控制开关与方案，偏好保存在 localStorage。
- **思考**：叠加覆盖比替换原生主题更容易回退；个性化审美价值不能写成工作效率提升。
- **建议**：先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。

<a id="plugin-1335704653-root"></a>

## [dsh-perlica-ding](../../plugins/117bs--dsh-perlica-ding/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) · [![npm 30d 333](https://img.shields.io/static/v1?label=npm+30d&message=333&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding)

- **用途**：后台运行智能体时，用户希望听到需要关注的状态而不盯住窗口。
- **亮点**：监听主会话事件和执行类工具，按类别去抖，通过 subprocess 调用系统播放程序；PCM 音量副本有内容缓存。
- **思考**：主会话限定与普通问答静音可减少噪声；有效性取决于事件分类是否符合使用者期待。
- **建议**：先用测试音和短任务核查四种状态，调整音量及去抖，不将完成音当验收。

<a id="plugin-1336538202-root"></a>

## [dsh-prompt-polish](../../plugins/1321928757--dsh-prompt-polish/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) · [![npm 30d 368](https://img.shields.io/static/v1?label=npm+30d&message=368&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)

- **用途**：用户反复组织复杂请求，希望提交前改善表达并保留原意；验收标准是约束无遗漏，而非文字更长。
- **亮点**：lib/index.js 收集启用的目标、任务和历史，在字符预算内构建请求，调用宿主llm.stream；客户端展示结果，采纳由用户决定。
- **思考**：确认式采纳比自动替换更可控；同一模型改写并不保证比直接发送原请求更好。
- **建议**：先不带历史改写普通草稿，对照检查否定、数字和交付限制；需要上下文时再开启，并人工决定是否采用。

<a id="plugin-1355639507-root"></a>

## [dsh-side-session](../../plugins/123dbl--dsh-side-session/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session)

- **用途**：主任务运行时，用户需要另外讨论独立问题，同时保留主会话上下文。
- **亮点**：/side-chat 调用 startContinuable 创建子会话，客户端在成功事件后比较子目录并打开新会话。
- **思考**：复用原生聊天视图避免维护第二套面板；便利不代表资源或权限完全隔离。
- **建议**：先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。

<a id="plugin-1333136466-root"></a>

## [dsh-spotlight](../../plugins/0xsline--dsh-spotlight/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight)

- **用途**：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。
- **亮点**：客户端注入 sessions、commands 和 pluginInventory，挂载面板并通过原生 commandUi 注册 /spotlight。
- **思考**：复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。
- **建议**：先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。

<a id="plugin-1333328839-root"></a>

## [dsh-status-rotator](../../plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)

- **用途**：希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。
- **亮点**：Host 保存并提供配置，客户端按阶段和偏好选择文案，支持持久化覆盖与扩展词库。
- **思考**：配置持久化使个性化可重复；状态文案不是实际进度，不能拿它判断任务是否完成。
- **建议**：先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。

<a id="plugin-1389458393-root"></a>

## [dsh-text-inject](../../plugins/1497105876--dsh-text-inject/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-text-inject)

- **用途**：用户需要维护独立于宿主配置的常驻规则，并能查看或恢复旧文本，成功标准是实际注入与文件一致。
- **亮点**：lib/index.js解析块后先释放旧注册，再用systemPrompt.section/context注册；监听目录处理原子保存，路由保存与恢复历史。
- **思考**：独立文件与历史便于回退；注入入口更方便也可能让过期规则长期影响不同任务。
- **建议**：先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。

<a id="plugin-1351903192-root"></a>

## [dsh-tokenrhythm-bill](../../plugins/162568316--dsh-tokenrhythm-bill/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill) · [![npm 30d 1681](https://img.shields.io/static/v1?label=npm+30d&message=1%2C681&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill)

- **用途**：多个中转或套餐用户需要对齐账户额度与模型清单，验收是当前账号的真实数据和明确的有效期。
- **亮点**：Host读取配置/凭据并代理平台账户接口，状态文件保存会话Cookie和账号信息；模型探测会发真实小请求，Client展示分平台面板。
- **思考**：同屏对齐到期额度和用量减少切换；平台金额聚合只有在身份、币种和冻结/限时口径一致时才有意义。
- **建议**：先只接入常用平台，对照控制台核验当前账号和限时额度，按需启用模型探测；敏感凭据留在受控宿主。

<a id="plugin-1335558973-root"></a>

## [dsh-voice-input-web](../../plugins/0nt-one--dsh-voice-input/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) · [![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web)

- **用途**：偏好口述输入的用户，希望先得到可编辑草稿再发送消息。
- **亮点**：客户端检测 SpeechRecognition/webkitSpeechRecognition，将最终结果追加到输入区，自动发送由本地开关控制。
- **思考**：转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。
- **建议**：先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。

<a id="plugin-1339803365-root"></a>

## [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu)

- **用途**：经常整理多个工作区和会话的用户，希望减少查找管理入口的步骤。
- **亮点**：客户端用 DOM/React fiber 定位行，Host 执行文件管理器调用；危险删除与归档管理器协作。
- **思考**：就地管理减少界面跳转，但把磁盘删除与日常菜单放在一起增加误操作后果。
- **建议**：先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。

<a id="plugin-1350379388-root"></a>

## [dsh-wsl-browser](../../plugins/173787247--dsh-wsl-browser/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser)

- **用途**：Agent在WSL得到报告或服务地址后，用户希望在Windows浏览器直接查看，验收是实际页面可达。
- **亮点**：lib/browser.js只接受http/https URL并转义PowerShell单引号，入口通过wsl-host调用Start-Process；localhost仅给替代地址提示。
- **思考**：消除复制地址的微小重复操作，收益来自入口便利；HTTP协议允许不等于目标可信。
- **建议**：适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。

<a id="plugin-1350378372-root"></a>

## [dsh-wsl-clipboard](../../plugins/173787247--dsh-wsl-clipboard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard)

- **用途**：WSL开发者需要在模型输出和Windows应用间传递文本，合格结果是文本完整且没有覆盖错误内容。
- **亮点**：lib/clipboard.js用PowerShell Forms Clipboard读写，写入文本先UTF-8编码为base64，输出携带字符数及截断标记。
- **思考**：base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。
- **建议**：先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。

<a id="plugin-1351854499-root"></a>

## [dsh-wsl-download](../../plugins/173787247--dsh-wsl-download/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-download)

- **用途**：用户已在Windows下载大模型或资料，希望复用现有文件而非在WSL重复下载，合格结果是正确文件完整复制。
- **亮点**：lib/download.js从WINDOWS_USER或PATH推断Downloads，列最近文件；copy限制源为basename并创建目标目录后copyFileSync，hint仅输出固定建议。
- **思考**：避免重复联网下载有价值，但名为download不代表下载器；固定模型提示可能随工具版本变化而过期。
- **建议**：先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。

<a id="plugin-1363429979-plugin-notes"></a>

## [Forge 便签](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes)

- **用途**：需要从临时想法转为任务的用户，希望在聊天旁管理笔记及执行状态。
- **亮点**：便签 CRUD 通过 storage-domain 持久化；日程与任务泳道状态关联，工具就绪后再挂 agent 桥。
- **思考**：把输入、任务和状态放在同一处可减少转录；自动执行却会引入授权和重复副作用风险。
- **建议**：先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。

<a id="plugin-1418691015-root"></a>

## [Prompt Desk](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk)

- **用途**：经常纠正同类行为的用户需要维护少量可复用教训，合格结果是正确经验被下轮读取且可撤回。
- **亮点**：index.js 逐个尝试认错标记，跳过不合法的首次出现，要求同一行按错误经过、教训顺序解析；结果先入待确认队列，采纳后才注入。
- **思考**：跳过无效早期标记能修正漏采路径，但采集更多草稿未必改善后续任务；经验质量仍依赖人工取舍。
- **建议**：已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。

<a id="plugin-1409724830-src"></a>

## [蓝毛小女仆桌宠](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

- **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。
- **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。
- **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。
- **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

## 更新时间

2026-10-20
