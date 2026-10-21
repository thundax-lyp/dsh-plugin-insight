# 个人效率

[返回首页](../../../README.md)

输入、会话、快捷操作与个人工作体验。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [api-balance](#plugin-1334899834-root) | 在 DSH Web 输入区显示 DeepSeek 账户余额，支持手动和定时刷新。 | 先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。 |
| [DPH 任务看板](#plugin-1336994666-root) | 把真实会话归入任务状态列，并保存备注和可供智能体读取的看板快照。 | 用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。 |
| [dsh-about](#plugin-1354283280-root) | 在设置中显示当前 DSH 版本，并代理读取官方 GitHub 发布说明。 | 与实际 dsh --version 对照后使用，路径识别失败时保留未知而不据此判断升级成功。 |
| [dsh-activity-heatmap](#plugin-1334318461-root) | 在 DSH 侧栏展示活动热力图、Token 用量、缓存命中和估算花费。 | 适合个人趋势观察；先与少量原始usage和实际账单核对，不用于财务结算或绩效评价。 |
| [dsh-at-skill](#plugin-1346023186-root) | 为 DSH 增加 @name 技能候选和发送前确定性技能加载。 | Skill命名清晰的用户可评估；与插件或子代理重名时谨慎使用，发送前确认文本，加载不代表任务执行验收。 |
| [dsh-chatgpt-style](#plugin-1421963463-root) | 调整DSH聊天排版与语义标注，并在发送框旁提供思考或快速档位切换。 | 先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。 |
| [dsh-commandcode-usage-inline](#plugin-1358821276-root) | 在 DSH 输入栏内联展示 Command Code 账户窗口用量和剩余 credits。 | 已用对应Command Code provider的用户可评估；多账户轮换时核对active标记，勿据首账户默认值作预算决定。 |
| [dsh-composer-expand](#plugin-1334850903-root) | 为输入框增加展开按钮，切换到较高书写区域并调整展开时回车行为。 | 先以长草稿测试中文输入法、斜杠菜单和 Ctrl/Cmd+Enter，确认关闭后恢复原生行为。 |
| [dsh-discord-richpresence](#plugin-1342915339-root) | 把 DSH 的粗粒度活动或可选丰富状态同步到本地 Discord Rich Presence。 | 先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。 |
| [dsh-draft-attachments](#plugin-1414492607-root) | 将 DSH 输入框未发送的附件保存到 IndexedDB，并在会话输入区重挂载时恢复。 | 可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。 |
| [dsh-effort-slider](#plugin-1335766616-root) | 为 DSH 模型菜单增加推理强度滑块，并向第三方模型供给方言配置。 | 适合了解自定义路由协议的用户；用实际请求日志确认档位参数与服务端行为后再据此控制成本。 |
| [dsh-forget-session](#plugin-1413882487-root) | 在 DSH 会话菜单中遗忘会话，清理活动会话、日志目录与投影缓存并复查残留。 | 只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。 |
| [dsh-harness-chat-control](#plugin-1357066651-root) | 为 DSH 会话提供引用、侧聊、会话编辑及侧聊模型与历史控制。 | 适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。 |
| [dsh-inline-images](#plugin-1334134226-root) | 把助手消息中的本地图片路径改写成可在对话正文展示的图片，并提供灯箱与尺寸设置。 | 限同机 Web 环境小范围试用，先检查图片展示、重启后历史链接和文件服务权限；敏感图片或远程访问需先明确可读范围。 |
| [dsh-mimotts](#plugin-1397477851-root) | 把定稿助手回复交给MiMo TTS合成语音，提供消息播放按钮、内联播放器与语音历史。 | 先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。 |
| [dsh-neo-skin](#plugin-1335557891-root) | 通过主题覆盖层为 DSH Web 提供新粗野主义配色和可切换外观方案。 | 先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。 |
| [dsh-perlica-ding](#plugin-1335704653-root) | 根据计划、执行、等待回应和错误状态播放分级提示音，普通问答保持安静。 | 先用测试音和短任务核查四种状态，调整音量及去抖，不将完成音当验收。 |
| [dsh-pinned-sessions](#plugin-1407379611-root) | 在侧栏集中展示跨工作区的置顶会话，提供搜索、状态与取消置顶操作。 | 已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。 |
| [dsh-plugin-crypto-ticker](#plugin-1389061748-root) | 在 DSH 侧栏显示加密货币价格、涨跌与走势图，支持多来源降级。 | 适合参考性看盘；先检查当前来源和逐币 stale 状态，遇到来源切换时到交易平台复核价格。 |
| [dsh-plugin-namecards](#plugin-1424219088-root) | 为 DSH 插件列表添加本地名片、中文备注、图标、文件夹和收藏。 | 插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。 |
| [dsh-prompt-polish](#plugin-1336538202-root) | 在输入栏调用宿主模型重写草稿，支持策略、语言、上下文与人工确认采纳。 | 先不带历史改写普通草稿，对照检查否定、数字和交付限制；需要上下文时再开启，并人工决定是否采用。 |
| [dsh-session-path](#plugin-1412141303-root) | 定位 DSH 会话日志并导出可读 Markdown 或 JSONL 交接文件。 | 需要接续时优先检查Markdown导出及截断；JSONL预算语义与长日志内存问题确认前，不用作有界最新上下文保证。 |
| [dsh-side-session](#plugin-1355639507-root) | 从命令菜单创建可继续的旁会话，并跳转到原生子会话聊天视图。 | 先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。 |
| [dsh-spotlight](#plugin-1333136466-root) | 以键盘命令面板统一查找原生命令、近期会话和插件入口。 | 先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。 |
| [dsh-status-rotator](#plugin-1333328839-root) | 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。 | 先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。 |
| [dsh-text-inject](#plugin-1389458393-root) | 从独立Markdown文件加载系统提示和上下文块，提供设置页编辑、热加载与历史备份。 | 先用少量无冲突规则验证每轮实际上下文，并确认删除与恢复生效；需要关键词门控时先核实当前版本，不能仅照README。 |
| [dsh-tokenrhythm-bill](#plugin-1351903192-root) | 集中展示基元律动等平台的余额、用量、模型与密钥，并提供账号切换和连通探测。 | 先只接入常用平台，对照控制台核验当前账号和限时额度，按需启用模型探测；敏感凭据留在受控宿主。 |
| [dsh-tts-flash](#plugin-1363291561-root) | 为 DSH 流式回复提供语音朗读、字幕浮条及等待短语，支持 Edge 与 OpenAI 兼容语音服务。 | 需要听当前回复的用户可先用非敏感短文试用，确认窗口切换、停止和自动播放正常；长回复必须对照文字检查是否跳句，不适合直接当完整有声文稿导出器。 |
| [dsh-usage-analytics](#plugin-1356960582-root) | 在 DSH 设置页展示本机 Token、模型分布和技能调用状态。 | 适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。 |
| [dsh-vision](#plugin-1335070045-packages-vision-route) | 给纯文本模型路由添加图片附件转译旁路，使用智谱视觉模型生成文字证据。 | 需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。 |
| [dsh-vision-fallback](#plugin-1333993743-root) | 将 DSH 图片交给独立视觉模型，并把观察结果返回当前主模型。 | 适合确需保留纯文本主模型的图片任务；先核对视觉服务的数据范围和难图准确率，重要文字回看原图。 |
| [dsh-voice](#plugin-1334554745-root) | 通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。 | 先用非敏感内容核对生效引擎及识别质量；有严格本地要求时需核查回退行为，重要指令提交前复核文字。 |
| [dsh-voice-input-web](#plugin-1335558973-root) | 在输入框旁增加麦克风入口，使用浏览器语音识别把文字写入草稿。 | 先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。 |
| [dsh-workspace-menu](#plugin-1339803365-root) | 在 DSH 工作区与会话行增加右键操作、置顶、归档及文件管理器入口。 | 先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。 |
| [dsh-wsl-browser](#plugin-1350379388-root) | 从WSL调用Windows默认浏览器打开HTTP或HTTPS地址，并给出localhost排障提示。 | 适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。 |
| [dsh-wsl-clipboard](#plugin-1350378372-root) | 从WSL读取或写入Windows文本剪贴板，支持长度限制与Unicode编码转换。 | 先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。 |
| [dsh-wsl-download](#plugin-1351854499-root) | 列出Windows下载目录中的文件并复制到WSL，另提供本地模型文件管理提示。 | 先列文件和检查目标是否已有同名内容，复制后核对大小与哈希；大模型先确认磁盘余量和是否可直接复用共享路径。 |
| [dsh-wsl-im](#plugin-1370460115-root) | 把多种即时通信平台接入DSH Agent，支持按聊天会话转发消息与媒体。 | 先限制允许用户并在测试群核查共享上下文，确认停止插件后连接和会话被回收。 |
| [dsh-wsl-launch](#plugin-1350378498-root) | 从WSL启动允许列表中的Windows应用，并传递启动参数。 | 使用明确的应用路径和小范围允许列表，先验证含空格的文件参数。 |
| [dsh-wsl-notify](#plugin-1350379268-root) | 从WSL向Windows显示消息框或托盘气泡通知。 | 优先短消息与低频提醒，确认锁屏和消息框超时表现，不发送秘密内容。 |
| [dsh-wsl-open](#plugin-1347958944-root) | 把聊天中的Linux文件路径转为可从Windows打开的文件入口。 | 先用一个非敏感文件测试中文和空格路径，确认目标文件而非只看应用启动。 |
| [dsh-wsl-path](#plugin-1350378631-root) | 转换Windows与WSL路径，附带挂载盘、换行和工作区位置提示。 | 单发行版先测试往返；多发行版必须核对distro，不直接使用转换出的同名Linux路径。 |
| [dsh-wsl-picker](#plugin-1351853863-root) | 在DSH中浏览WSL目录与挂载盘，支持名称过滤和工作区快捷入口。 | 适合小中目录导航；先确认返回路径，敏感目录仍受进程权限而非插件白名单控制。 |
| [dsh-wsl-shot](#plugin-1351854253-root) | 把Windows剪贴板中的图片保存为WSL文件供多模态聊天使用。 | 先用非敏感截图确认保存和模型读取链路；及时检查Windows临时文件残留。 |
| [Forge 便签](#plugin-1363429979-plugin-notes) | 提供 Markdown 便签板、搜索归档和任务泳道，可把便签交给智能体或定时执行。 | 先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。 |
| [Prompt Desk](#plugin-1418691015-root) | 在对话标题栏编辑全局与会话提示词，并把模型自报错误收为待确认经验草稿。 | 已有用户应重点检查先引用标记再真正认错的消息，先只保留少量能复现的教训，并确认禁用或删除后的注入变化。 |
| [上下文交接提醒](#plugin-1396768359-root) | 消费上下文占用投影，显示提醒并在工作目录生成机器事实交接草稿。 | 适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。 |
| [滚动钢琴与消息小地图](#plugin-1412162067-root) | 在聊天区边缘按鼠标位置演奏钢琴音，并预览和跳转用户消息。 | 作为趣味和用户消息回看辅助试用；长会话和侧栏布局先核对刻度覆盖，办公环境先调低音量，不替代正式搜索。 |
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

<a id="plugin-1334318461-root"></a>

## [dsh-activity-heatmap](../../plugins/283gawin--dsh-heatmap/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap)

- **用途**：希望回顾本机使用节奏的开发者将会话用量与Git提交按日查看；交付是观测面板而非财务账单或生产力排名。
- **亮点**：相对分别查看日志和Git记录，增量是将模型用量、缓存与开发活动聚合到常驻侧栏；纯聚合与宿主扫描分离，重复turn/step记录替换而非累加。
- **思考**：README仍称90天，但stats-service的WINDOW_DAYS为365，实际范围需以源码为准；模型定价和usage字段口径决定估算准确性，最近模型名归因与缺失字段补0不能证明财务完整。提交量也不能代表交付价值。 pricing.ts对未知模型使用DEFAULT_PRICE而非未知值，因此新模型也会显示貌似精确的估算。
- **建议**：适合个人趋势观察；先与少量原始usage和实际账单核对，不用于财务结算或绩效评价。

<a id="plugin-1346023186-root"></a>

## [dsh-at-skill](../../plugins/452926826--dsh-at-skill/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/452926826/dsh-at-skill)

- **用途**：用户在输入框选择可调用Skill并确保模型开始前加载其指令，减少记忆斜杠命令或依赖模型自行判断。
- **亮点**：相对只给输入补全，将匹配token的Skill在模型步骤前确定性加载；同时遵循next拒绝决定、用户可调用过滤与会话cwd/scope查找，保持宿主作用域。
- **思考**：文本token不携带来源身份。与subagent/plugin同名或用户仅讨论@名称时，宿主仍可加载匹配Skill。客户端会话缓存只在connection/reset清理，Skill变更后候选与宿主即时查找可能不同；“确定性”不等于用户意图准确。
- **建议**：Skill命名清晰的用户可评估；与插件或子代理重名时谨慎使用，发送前确认文本，加载不代表任务执行验收。

<a id="plugin-1421963463-root"></a>

## [dsh-chatgpt-style](../../plugins/137--dsh-chatgpt-style/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/137/dsh-chatgpt-style)

- **用途**：习惯居中聊天版式的用户希望改善长文本阅读和切换模型思考档位，验收是内容不丢失、输入操作正常。
- **亮点**：client.js注入CSS并用MutationObserver装饰完成后的文本，检测data-streaming避免修改流中节点；档位通过宿主modelDirectories读取和提交。
- **思考**：复用宿主模型目录比维护另一套配置可靠，但视觉强调不构成事实已验证，绿色结论仍需读者核实。
- **建议**：先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。

<a id="plugin-1358821276-root"></a>

## [dsh-commandcode-usage-inline](../../plugins/345420242--dsh-commandcode-usage-inline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/345420242/dsh-commandcode-usage-inline)

- **用途**：Command Code用户在发起请求前查看额度和重置窗口，避免切到单独账户页面。
- **亮点**：相对作者指出的侧栏用量面板，增量是把额度缩到模型选择旁的徽章，详情按需展开；复用provider认证与report接口，避免重复实现账户API。主要是界面适配贡献。
- **思考**：active账户缺失时选首个configured账户，可能与实际请求轮换账户不同；“剩余”是report快照，不是本次请求额度承诺。外部provider Remote形状或挂载顺序变化也会让纯界面插件失效。
- **建议**：已用对应Command Code provider的用户可评估；多账户轮换时核对active标记，勿据首账户默认值作预算决定。

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

<a id="plugin-1414492607-root"></a>

## [dsh-draft-attachments](../../plugins/2026heshao--dsh-draft-attachments/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-draft-attachments) · [![npm 30d 23](https://img.shields.io/static/v1?label=npm+30d&message=23&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-draft-attachments)

- **用途**：适合经常带图片或文件准备问题、期间切换会话的用户；合格结果是未发送附件按原顺序恢复且发送后不再出现。
- **亮点**：相对宿主仅内存附件和用户手动重新上传，插件把字节与元数据按 sessionId 保存，在重新挂载时通过官方入口重建草稿而不是 patch 核心函数。这是有针对性的流程修补，价值在减少中断后的准备重做，不是新的数据库或上传协议。
- **思考**：决定贡献成立的是“恢复”和“空集合清除”是否有一致的顺序。源码中恢复 effect 异步 loadDraft，另一个 effect 同时观察当前空 attachmentIds 并安排删除；恢复仅看 liveInputRef 和 restored 标记，未发现跨两个操作的持久化代次协议。常规快速读盘可能正常，浏览器慢存储和快速切换应作为证伪场景，当前不能直接断言必丢。
- **建议**：可先用可丢弃附件验证切换、重启、发送后不复活及超限行为，再用于常用流程；敏感附件要把浏览器持久保存纳入清理习惯，不能把它当跨设备草稿同步。

<a id="plugin-1335766616-root"></a>

## [dsh-effort-slider](../../plugins/2768651338--dsh-effort-slider/INSIGHT.md)

[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) · [![npm 30d 1403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)

- **用途**：使用第三方模型路由的用户在发送前调整推理档位，希望请求参数与所选档位一致。
- **亮点**：相对内置档位菜单，主要增量不是火焰视觉，而是为缺少推理元数据的第三方路由补齐映射，并在写前重读防止覆盖并发用户编辑；将界面控制和线上协议适配联结。
- **思考**：界面存在五档不证明端点接受或区别处理五档。wireFor仅在openai-completions注入compat，其余依赖pi-ai；off多数映射null即不发参数，不能保证服务端关闭思考。resolveModelInfo失败视为无原生推理也可能造成不必要供给。
- **建议**：适合了解自定义路由协议的用户；用实际请求日志确认档位参数与服务端行为后再据此控制成本。

<a id="plugin-1413882487-root"></a>

## [dsh-forget-session](../../plugins/2026heshao--dsh-forget-session/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2026heshao/dsh-forget-session) · [![npm 30d 283](https://img.shields.io/static/v1?label=npm+30d&message=283&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-forget-session)

- **用途**：面向明确需要删除本地会话痕迹的用户；交付物是会话不再出现在列表且对应本地工件已清理的可核查结果。
- **亮点**：相对归档仅改变可见性及手工删日志，贡献在把会话活体、工作区记账、日志和投影几个所有权串起来，先释放写句柄再删盘并观察迟到重建。该恢复编排适合解释“列表消失却重启复活”的问题，不是通用安全擦除。
- **思考**：调用返回ok:true能否作为彻底遗忘证明？host多步骤失败收集warnings后继续，并在未来守卫中补删；投影总表采用读改写而非与宿主共用事务。支持正常占用恢复不代表每一步必成功，客户端摘要也只反映当前结果。验证需跨守卫窗口与重启，不能只看行消失。
- **建议**：只在备份过的可丢弃会话上先验证删除后刷新、重启和守卫结束状态；需要可恢复整理时优先归档。保留告警并核对工件清理，不把成功提示当数据全部擦除证明。

<a id="plugin-1357066651-root"></a>

## [dsh-harness-chat-control](../../plugins/1985899182--dsh-harness-chat-control/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/1985899182/dsh-harness-chat-control)

- **用途**：开发者需要从主会话引用一段内容发起侧聊，并把局部问题与主线区分；合格交付是可追溯引用和保留身份的会话交互。
- **亮点**：作者提供会话操作集合。相对手工复制文本再开子会话，增量在于引用、侧聊和模型选择贯通；源码明确借助 Better Sidebar，并在 vendor 保存来源声明，不能把上游侧栏归为原创。自己补的是宿主未暴露的地址化侧聊与编辑接缝。
- **思考**：核心质疑是界面中的“编辑”能否与模型看到的 surface 一致。原生历史与投影视图分离，插件为 replacement 做专门处理，说明不是普通文本编辑；多次编辑、重载后引用及图片附件一致性仍需真实宿主验证。
- **建议**：适合经常引用局部问题开侧聊的用户；先验证编辑与重载后的引用一致性，再将其纳入重要讨论记录。

<a id="plugin-1334134226-root"></a>

## [dsh-inline-images](../../plugins/3403473060--dsh-inline-images/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/3403473060/dsh-inline-images)

- **用途**：本机 DSH Web 用户查看截图或生成图，原先需复制路径开文件，现在希望直接在消息中检查并放大。
- **亮点**：相对手动打开本地路径，贡献是把路径识别、文件读取和正文展示串成低操作成本流程；复用宿主文件服务与 Markdown 渲染，属于界面集成而非图像理解机制。反向区间替换避免前一次修改扰乱后续位置。
- **思考**：回环链接是否在所有使用环境中可靠？代码固定 http://127.0.0.1:port，因此远程浏览器会访问浏览器自己的机器；重启激活 token 变化也会使历史链接失效。对同机短时查看可成立，不能据此承诺远程和持久分享；扩展名判定也不等于图片内容核验。
- **建议**：限同机 Web 环境小范围试用，先检查图片展示、重启后历史链接和文件服务权限；敏感图片或远程访问需先明确可读范围。

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

<a id="plugin-1407379611-root"></a>

## [dsh-pinned-sessions](../../plugins/439436269-ctrl--dsh-pinned-sessions/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-pinned-sessions) · [![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)

- **用途**：经常跨多个工作区切换会话的DSH用户，需从一个平面入口快速找到已置顶会话。
- **亮点**：相对原生只在各工作区内部重排置顶，会话集合跨工作区聚合有明确导航价值；重用原生状态避免第二套置顶真相。DOM锚点portal是宿主缺少扩展槽位时的适配，不是新状态模型。
- **思考**：原生样式一致是否等于长期兼容？代码依赖data-slot及具体侧栏列表结构，找不到时隐藏，降低破坏性但功能仍消失；README前后对挂载位置和是否共享滚动有不同叙述，应该以当前源码和宿主实测为准。
- **建议**：已有跨工作区置顶需求时可试用；先验证搜索、归档过滤与取消置顶，宿主升级后检查入口是否仍在。

<a id="plugin-1389061748-root"></a>

## [dsh-plugin-crypto-ticker](../../plugins/18569663yz-web--dsh-plugin-crypto-ticker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/18569663yz-web/dsh-plugin-crypto-ticker)

- **用途**：希望在 DSH 工作时顺手看常用代币行情的个人用户；合格输出是标明来源、新旧状态的参考报价。
- **亮点**：作者主张免密钥行情卡片。相对浏览器行情标签页，增量是宿主集中获取、侧栏呈现与来源降级，减少重复切页；index.js 明确把趋势缓存与头部报价分开，是实用集成而非行情算法创新。
- **思考**：“多标签共享请求”只在缓存命中后成立：apply 的 fetch 路由在缓存过期时直接 await build，没有共享 in-flight Promise；同时到来的标签可能重复请求。collect 只需至少一个有效币就接受来源，因此不能把一次源成功理解为所有币均刷新；逐币 stale 才是边界。
- **建议**：适合参考性看盘；先检查当前来源和逐币 stale 状态，遇到来源切换时到交易平台复核价格。

<a id="plugin-1424219088-root"></a>

## [dsh-plugin-namecards](../../plugins/3tiga3--dsh-plugin-namecards/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) · [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)

- **用途**：安装插件较多的用户按自己的用途命名分组、查找并启停插件，交付是可迁移的个人管理布局。
- **亮点**：相对官方平铺列表，将个人解释与上游包元数据分离，允许用户本地维护备注和分组；导出含图标与布局便于迁移，不需要修改每个插件源文件。
- **思考**：名片覆盖可能遮蔽上游身份和说明，特别是同名备注；启停不是单纯展示操作，实际效果仍由官方manager与重启决定。HTTP仅检查loopback不能等同完整浏览器来源隔离，仍需核查部署代理的边界。
- **建议**：插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。

<a id="plugin-1336538202-root"></a>

## [dsh-prompt-polish](../../plugins/1321928757--dsh-prompt-polish/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-prompt-polish) · [![npm 30d 368](https://img.shields.io/static/v1?label=npm+30d&message=368&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-prompt-polish)

- **用途**：用户反复组织复杂请求，希望提交前改善表达并保留原意；验收标准是约束无遗漏，而非文字更长。
- **亮点**：lib/index.js 收集启用的目标、任务和历史，在字符预算内构建请求，调用宿主llm.stream；客户端展示结果，采纳由用户决定。
- **思考**：确认式采纳比自动替换更可控；同一模型改写并不保证比直接发送原请求更好。
- **建议**：先不带历史改写普通草稿，对照检查否定、数字和交付限制；需要上下文时再开启，并人工决定是否采用。

<a id="plugin-1412141303-root"></a>

## [dsh-session-path](../../plugins/439436269-ctrl--dsh-session-path/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-session-path) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-session-path)

- **用途**：需要让另一个Agent接续已完成会话的用户，合格交付是可读、有会话身份和截断说明的记录。
- **亮点**：相对只复制不可直接read的压缩日志路径，把日志转成可读交接文件是实质工作流增量；Markdown保留最近条目能适配接续。Zstd解压及路径工具是现成机制组合，不证明语义交接完整。
- **思考**：是否真的按预算保留最近上下文且内存有界？renderEntries倒序保留尾部，但renderJsonl正序累积直到预算耗尽，保留的是头部；writeHandoff先收集全部records/entries，逐帧解压不能推出整个导出内存有界。该源码反例影响长会话接续主张，尚未运行复现。
- **建议**：需要接续时优先检查Markdown导出及截断；JSONL预算语义与长日志内存问题确认前，不用作有界最新上下文保证。

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

<a id="plugin-1363291561-root"></a>

## [dsh-tts-flash](../../plugins/2021heei--dsh-tts-flash/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2021Heei/dsh-tts-flash)

- **用途**：适合希望边听边看长回复的桌面用户；交付物是与当前会话对应的可中止音频及字幕，而非离线音频档案。
- **亮点**：作者强调边生成边朗读与多引擎；README 和 speak-queue.ts 明示分句及队列改编自 MIT 的 dsh-voice，因此不把继承的流式朗读认作原创。本项增量在统一 TtsProvider、引擎声明与缓存等待音频的衔接：等待反馈和正文共享播放通道，正文入队后停止等待循环，减少维护多套语音状态的负担。
- **思考**：最关键的问题是追赶速度是否牺牲用户必须听到的内容。SpeakQueue 的 MAX_PENDING=12，积压时 pending.shift() 丢弃最旧句；这保护内存、贴近当前输出，却意味着 README 的“无损”只能理解为不阻断模型流，不能理解为全文朗读无遗漏。相反，短回复或快引擎可能从不触发丢句，因此不能据此否定日常可用性。
- **建议**：需要听当前回复的用户可先用非敏感短文试用，确认窗口切换、停止和自动播放正常；长回复必须对照文字检查是否跳句，不适合直接当完整有声文稿导出器。

<a id="plugin-1356960582-root"></a>

## [dsh-usage-analytics](../../plugins/3361805598-gif--dsh-usage-analytics/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)

- **用途**：用户按日周月回顾模型使用和技能调用，发现用量异常并追溯统计覆盖；交付是可重建的个人分析视图。
- **亮点**：相对直接把实时事件累加，设计增量在以持久日志为真相重建派生索引，并对stream终止usage与assembled message去重；reasoning作为output子集不再加总，减少重复计费口径误读。
- **思考**：统计成功不等于技能任务成功。显式skill-invocation一出现就记success，自动skill结果只检查工具错误，这些是调用状态而非业务完成质量。usage缺失虽保留known标记，字段缺失仍补0；比较总量需要同时看覆盖。
- **建议**：适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。

<a id="plugin-1335070045-packages-vision-route"></a>

## [dsh-vision](../../plugins/314857493--dsh-vision--packages-vision-route/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) · [![npm 30d 1264](https://img.shields.io/static/v1?label=npm+30d&message=1%2C264&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route)

- **用途**：希望继续使用已有纯文本provider、偶尔询问GUI图片的DSH用户，交付为可供下游推理的视觉描述。
- **亮点**：相对切换整个会话到原生视觉模型，增量在视觉前处理与主模型解耦，以及基于本轮追问重新解析近期历史图；依赖现成视觉API，非新视觉算法。只研究vision-route，磁盘vision工具是另一组件。
- **思考**：转译文字是否保存足够细节？代码按问题生成并可复看旧图，这是强支持；但JSON结果默认只展平value而不保留key，表格关系和细节可能丢失。追问选择最多近期8轮/6张图，是有限范围的指代启发式，不能承诺任意历史理解。
- **建议**：需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。

<a id="plugin-1333993743-root"></a>

## [dsh-vision-fallback](../../plugins/1helloman1--dsh-vision-fallback/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1HelloMan1/dsh-vision-fallback) · [![npm 30d 932](https://img.shields.io/static/v1?label=npm+30d&message=932&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-fallback)

- **用途**：偏好纯文本主模型的用户仍需处理截图或图片；交付物是主模型基于视觉观察形成的回答。
- **亮点**：相对手动切换视觉模型并复制描述，增量是把视觉作为受限预处理并保留主模型工作流；lib/index.js 的压缩旁路复用避免摘要请求再反复发图。视觉识别能力属于外部模型，不是插件原创。
- **思考**：观察文本会成为主模型看到的替代输入，关键是视觉误读是否被主模型当成图像事实。近期上下文能改善问题相关性，也增加向外部 API 暴露文本的范围；缓存隔离了会话与消息，但不证明观察准确。
- **建议**：适合确需保留纯文本主模型的图片任务；先核对视觉服务的数据范围和难图准确率，重要文字回看原图。

<a id="plugin-1334554745-root"></a>

## [dsh-voice](../../plugins/3274375092--dsh-voice/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) · [![npm 30d 607](https://img.shields.io/static/v1?label=npm+30d&message=607&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)

- **用途**：不便持续键盘输入的用户口述需求，期望最终文字准确提交到当前会话，并保留普通预设行为。
- **亮点**：相对单一浏览器语音输入，提供本地离线模型与浏览器回退的统一输入路径，且不通过修改persona承接语音；模型真正加载后才声明native可用，避免仅目录存在就虚报能力。
- **思考**：即使显式engine=native，resolveEngine在能力不足时也返回browser，隐私预期与实际引擎可能不同。Web Speech是否联网受浏览器实现影响，不能把自动回退概括为始终离线。LRU上限4会驱逐仍在说话的会话，导致一句话拆断。
- **建议**：先用非敏感内容核对生效引擎及识别质量；有严格本地要求时需核查回退行为，重要指令提交前复核文字。

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

<a id="plugin-1370460115-root"></a>

## [dsh-wsl-im](../../plugins/173787247--dsh-wsl-im/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-im)

- **用途**：用户希望从已有IM入口驱动本地Agent，并把回复送回原聊天。
- **亮点**：源码注明模式改编自MIT的dsh-im-hub；增量是WSL套件接线、平台工作区与媒体处理组合，不将多平台桥接范式计为原创。
- **思考**：isAllowed在平台allowedUserIds为空时允许所有用户；requireAllowlist只阻止缺少允许列表的已启用真实适配器启动，mock例外。同一platform/chatId共享Agent上下文，授权用户之间不按userId隔离。
- **建议**：待验证假设：把发送者权限与会话共享策略显式组合，可以降低群聊中的越界继承；与默认按用户隔离相比需衡量协作损失。

<a id="plugin-1350378498-root"></a>

## [dsh-wsl-launch](../../plugins/173787247--dsh-wsl-launch/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-launch)

- **用途**：Agent需要把文件或任务转交给Windows编辑器、浏览器等桌面应用。
- **亮点**：把跨系统启动收敛到允许目标，减少手工切换终端；这是桌面桥接而非应用操作或任务验收机制。
- **思考**：允许列表支持后缀与通配前缀，匹配程序名不等于固定可信可执行文件；Start-Process成功也不证明窗口打开了正确文件。
- **建议**：本次未形成新的创新假设；先固定可执行文件身份并验证参数往返，比扩大可启动程序范围更有价值。

<a id="plugin-1350379268-root"></a>

## [dsh-wsl-notify](../../plugins/173787247--dsh-wsl-notify/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-notify)

- **用途**：长任务结束后，需要让离开聊天界面的用户看到简短提醒。
- **亮点**：为Agent输出增加桌面提醒通道，减少手动盯聊天；通知到达和用户理解并没有由返回成功证明。
- **思考**：MessageBox会等待交互，气泡依赖桌面策略且未提供用户已读回执；重试可能造成重复或阻塞提醒。
- **建议**：本次未形成新创新假设；先明确展示、关闭和用户确认三种状态，比较提醒是否降低漏看而不增加打扰。

<a id="plugin-1347958944-root"></a>

## [dsh-wsl-open](../../plugins/173787247--dsh-wsl-open/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-open)

- **用途**：WSL工具生成文件后，用户希望直接用Windows默认应用查看。
- **亮点**：把跨系统文件交接融入聊天阅读路径；增量是路径呈现和桌面打开集成，不提供文件内容编辑或正确性验证。
- **思考**：客户端正则识别会跳过含空格等路径，服务端会拒绝不存在或范围外文件，因此识别失败主要影响可用性；openOnWindows把Explorer任意数字退出码当成功，是对Explorer复用窗口的宽松兼容，返回ok仍不能证明目标文件确实打开。
- **建议**：待验证假设：将识别文本与已确认存在的产物分开显示，可减少自然语言中的伪路径被误点；需比较额外文件探测成本。

<a id="plugin-1350378631-root"></a>

## [dsh-wsl-path](../../plugins/173787247--dsh-wsl-path/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-path)

- **用途**：用户在Windows界面与WSL工具之间交接路径时，避免把盘符直接交给Linux命令。
- **亮点**：将路径语法转换与工作区提示组合，降低重复说明；映射规则不是新的文件系统访问机制。
- **思考**：UNC解析可返回另一个发行版名称，但生成的Linux绝对路径本身不携带发行版身份；转换不代表当前发行版能读到同一文件。
- **建议**：待验证假设：把发行版身份作为路径对象的一部分保留到消费端，可降低跨发行版错读；若用户仅单发行版则价值有限。

<a id="plugin-1351853863-root"></a>

## [dsh-wsl-picker](../../plugins/173787247--dsh-wsl-picker/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-picker)

- **用途**：用户需要向Agent提供WSL或Windows挂载目录，减少反复复制目录列表。
- **亮点**：把目录浏览和套件工作区入口组合成可消费结果；相对ls主要增量是结构化导航，不是图形文件选择器或访问隔离。
- **思考**：maxEntries只限制输出，readdirSync仍读取整个目录且stat跟随符号链接；无根目录白名单，不能把快捷入口理解为受限工作区。
- **建议**：本次未形成新创新假设；优先验证大目录延迟和路径边界，再决定是否需要分页或根范围约束。

<a id="plugin-1351854253-root"></a>

## [dsh-wsl-shot](../../plugins/173787247--dsh-wsl-shot/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-shot)

- **用途**：用户截屏后，需要把现有剪贴板图片交给运行在WSL的Agent。
- **亮点**：把剪贴板到WSL文件的跨系统搬运封装为一步；它读取已有剪贴板图片而非主动屏幕截图，也未直接附加模型图片块。
- **思考**：临时文件位于Users/Public且复制失败时保留；固定名称输出可能覆盖，Date.now临时名在并发下存在碰撞可能，isConcurrencySafe声明需用并发用例核对。
- **建议**：待验证假设：唯一临时目录、受限权限和finally清理可减少失败时图片残留；需要保留可恢复性，避免复制失败时删除唯一原件。

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

<a id="plugin-1396768359-root"></a>

## [上下文交接提醒](../../plugins/2jumpsina--dsh-context-guard/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) · [![npm 30d 1388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)

- **用途**：长期进行代码或研究会话的用户，在上下文过长前交接任务；交付物是占用提醒与仍需补全的HANDOVER草稿，而不是自动完整迁移的会话。
- **亮点**：相对盯着token数字，新增“判断状态→提醒→交接草稿”的动作链；纯fold与只读UI让提示策略有单一所有者。token计量来自官方meter，非插件自行测量；零额外模型请求可由接线支持，但“零总成本”不能由此推出。
- **思考**：核心质疑是提前换会话是否真的降低合格任务总成本。作者单机账本是反事实估算，重新解释任务和修复交接遗漏也耗token与人时。README顶部称轮末提醒，后文明示在投影变化时判定，不能承诺绝不在轮中。默认写HANDOVER还可能把敏感片段带入仓库。
- **建议**：适合愿意主动交接的长会话用户先用临时目录验证；先决定是否允许默认写入，再评估提醒阈值，不能将草稿当作已办结交接。

<a id="plugin-1412162067-root"></a>

## [滚动钢琴与消息小地图](../../plugins/439436269-ctrl--dsh-scroll-piano/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-scroll-piano) · [![npm 30d 1565](https://img.shields.io/static/v1?label=npm+30d&message=1%2C565&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scroll-piano)

- **用途**：希望长聊天浏览更有趣、快速回看自己消息的桌面用户；交付可定位的消息刻度和本地声音反馈，不能以趣味推导生产率提升。
- **亮点**：相对普通滚动条，增量是用户消息小地图和声音反馈在同一边缘交互组合；音色来自Web Audio合成而非模型。用稳定data属性避开hash类名使DOM接线更明确，但仍依赖宿主内部布局契约。
- **思考**：最强质疑是附加反馈是否帮助导航还是打断阅读。实现确有刻度跳转和用户消息过滤，但只依赖当前DOM，虚拟化/长会话可能没有全部历史消息元素；音频浏览器权限、误触和全局监听开销也影响采用价值。
- **建议**：作为趣味和用户消息回看辅助试用；长会话和侧栏布局先核对刻度覆盖，办公环境先调低音量，不替代正式搜索。

<a id="plugin-1409724830-src"></a>

## [蓝毛小女仆桌宠](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet)

- **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。
- **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。
- **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。
- **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

## 更新时间

2026-10-21
