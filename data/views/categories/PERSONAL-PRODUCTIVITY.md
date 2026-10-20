# 个人效率

[返回首页](../../../README.md)

## 分类导航

- [api-balance](#plugin-1334899834-root)：使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。
- [DPH 任务看板](#plugin-1336994666-root)：同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。
- [dsh-about](#plugin-1354283280-root)：需要确认实际运行版本及更新内容的用户不必另外打开终端和发布页。
- [dsh-composer-expand](#plugin-1334850903-root)：经常编辑长提示词的用户需要在发送前查看和修改更多草稿内容。
- [dsh-discord-richpresence](#plugin-1342915339-root)：希望向 Discord 联系人展示工作状态的桌面用户，而非需要团队任务追踪的部署。
- [dsh-neo-skin](#plugin-1335557891-root)：长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。
- [dsh-perlica-ding](#plugin-1335704653-root)：后台运行智能体时，用户希望听到需要关注的状态而不盯住窗口。
- [dsh-prompt-ErrorNotes-desk](#plugin-1418691015-root)：反复纠正相同模型行为的用户，希望把确认过的教训转成后续提醒。
- [dsh-side-session](#plugin-1355639507-root)：主任务运行时，用户需要另外讨论独立问题，同时保留主会话上下文。
- [dsh-spotlight](#plugin-1333136466-root)：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。
- [dsh-status-rotator](#plugin-1333328839-root)：希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。
- [dsh-voice-input-web](#plugin-1335558973-root)：偏好口述输入的用户，希望先得到可编辑草稿再发送消息。
- [dsh-workspace-menu](#plugin-1339803365-root)：经常整理多个工作区和会话的用户，希望减少查找管理入口的步骤。
- [Forge 便签](#plugin-1363429979-plugin-notes)：需要从临时想法转为任务的用户，希望在聊天旁管理笔记及执行状态。
- [蓝毛小女仆桌宠](#plugin-1409724830-src)：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。

### 个人效率（15）

<a id="plugin-1334899834-root"></a>

#### [api-balance](../../plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)

- **用途**：使用 DeepSeek API 的用户希望在工作界面看到账户余额，减少切换控制台。
- **亮点**：Host 每次解析凭据并通过 curl 请求余额，客户端持久化刷新偏好并保留失败前的数据。
- **思考**：余额就近可见减少切换，但旧读数可能掩盖故障，必须保留更新时间和失败提示。
- **建议**：先用手动刷新核对官方控制台；检查凭据暴露和日志后，再按需要开启较低频率轮询。

<a id="plugin-1336994666-root"></a>

#### [DPH 任务看板](../../plugins/1070296335-create--dph-taskboard/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/commits)

- **用途**：同时推进多个会话的用户希望按待办、进行中、评审和完成整理任务。
- **亮点**：浏览器以 localStorage 管理分类，宿主路由接收快照原子落盘，恢复归档优先走 workspaceRegistry。
- **思考**：卡片直接对应会话可减少重复建账；浏览器状态与落盘镜像仍可能出现不同步。
- **建议**：用可丢弃 profile 测试归档与恢复，先验证备份导入再放入重要任务。

<a id="plugin-1354283280-root"></a>

#### [dsh-about](../../plugins/1010n111--dsh-about/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1010n111/dsh-about/commits)

- **用途**：需要确认实际运行版本及更新内容的用户不必另外打开终端和发布页。
- **亮点**：宿主从 clientModules 路径反推包版本，注册只读 version/releases 路由，对 GitHub 响应缓存五分钟。
- **思考**：能把当前版本与发布说明放在一起，但不会执行更新，也不证明新版本适合当前插件组合。
- **建议**：与实际 dsh --version 对照后使用，路径识别失败时保留未知而不据此判断升级成功。

<a id="plugin-1334850903-root"></a>

#### [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 1011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/commits)

- **用途**：经常编辑长提示词的用户需要在发送前查看和修改更多草稿内容。
- **亮点**：客户端插槽按钮切换 CSS class 并保存浏览器偏好，DOM observer 修复重建后的样式，捕获普通 Enter 避免发送。
- **思考**：可逆且范围小的界面增量容易评估；收益取决于长文本频率，不应夸大为通用生产力提升。
- **建议**：先以长草稿测试中文输入法、斜杠菜单和 Ctrl/Cmd+Enter，确认关闭后恢复原生行为。

<a id="plugin-1342915339-root"></a>

#### [dsh-discord-richpresence](../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/commits)

- **用途**：希望向 Discord 联系人展示工作状态的桌面用户，而非需要团队任务追踪的部署。
- **亮点**：Host 聚合活动信号，通过本地 Discord RPC 更新文案；丰富模式按最短展示间隔轮换数据。
- **思考**：减少手动改状态，但不能证明专注度或工作产出；企业环境应先确认活动公开政策。
- **建议**：先只开模糊状态，检查实际 Discord 展示内容和断线重连，再考虑丰富模式。

<a id="plugin-1335557891-root"></a>

#### [dsh-neo-skin](../../plugins/0nt-one--dsh-neo-skin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) · [![npm 30d 113](https://img.shields.io/static/v1?label=npm+30d&message=113&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/commits)

- **用途**：长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。
- **亮点**：客户端调用 theme.overrideTokens，设置插槽控制开关与方案，偏好保存在 localStorage。
- **思考**：叠加覆盖比替换原生主题更容易回退；个性化审美价值不能写成工作效率提升。
- **建议**：先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。

<a id="plugin-1335704653-root"></a>

#### [dsh-perlica-ding](../../plugins/117bs--dsh-perlica-ding/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) · [![npm 30d 333](https://img.shields.io/static/v1?label=npm+30d&message=333&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding) · [![最后更新 13天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=13%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding/commits)

- **用途**：后台运行智能体时，用户希望听到需要关注的状态而不盯住窗口。
- **亮点**：监听主会话事件和执行类工具，按类别去抖，通过 subprocess 调用系统播放程序；PCM 音量副本有内容缓存。
- **思考**：主会话限定与普通问答静音可减少噪声；有效性取决于事件分类是否符合使用者期待。
- **建议**：先用测试音和短任务核查四种状态，调整音量及去抖，不将完成音当验收。

<a id="plugin-1418691015-root"></a>

#### [dsh-prompt-ErrorNotes-desk](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/commits)

- **用途**：反复纠正相同模型行为的用户，希望把确认过的教训转成后续提醒。
- **亮点**：Host 原子写入本地状态和全局提示，通过同源路由供面板编辑，近期经验按限制注入系统提示。
- **思考**：把候选与确认分开有助于保留人工判断；自动沉淀不等于持续改善。
- **建议**：只确认能复现的经验，先限少量条目，并检查删除后是否停止影响回答。

<a id="plugin-1355639507-root"></a>

#### [dsh-side-session](../../plugins/123dbl--dsh-side-session/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session/commits)

- **用途**：主任务运行时，用户需要另外讨论独立问题，同时保留主会话上下文。
- **亮点**：/side-chat 调用 startContinuable 创建子会话，客户端在成功事件后比较子目录并打开新会话。
- **思考**：复用原生聊天视图避免维护第二套面板；便利不代表资源或权限完全隔离。
- **建议**：先测试主会话忙碌、双击和连续创建，确认旁会话可恢复且不会跳错子会话。

<a id="plugin-1333136466-root"></a>

#### [dsh-spotlight](../../plugins/0xsline--dsh-spotlight/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 667](https://img.shields.io/static/v1?label=npm+30d&message=667&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/commits)

- **用途**：大量使用快捷键的 DSH Web 用户需要减少在会话与设置之间寻找入口的操作。
- **亮点**：客户端注入 sessions、commands 和 pluginInventory，挂载面板并通过原生 commandUi 注册 /spotlight。
- **思考**：复用原生命令注册表可降低双份清单漂移；命令数量增加并不自动提升检索体验。
- **建议**：先用常用的十条命令与十个会话检查搜索命中和导航，再决定是否替代原生入口。

<a id="plugin-1333328839-root"></a>

#### [dsh-status-rotator](../../plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 183](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=183&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/commits)

- **用途**：希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。
- **亮点**：Host 保存并提供配置，客户端按阶段和偏好选择文案，支持持久化覆盖与扩展词库。
- **思考**：配置持久化使个性化可重复；状态文案不是实际进度，不能拿它判断任务是否完成。
- **建议**：先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。

<a id="plugin-1335558973-root"></a>

#### [dsh-voice-input-web](../../plugins/0nt-one--dsh-voice-input/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) · [![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/commits)

- **用途**：偏好口述输入的用户，希望先得到可编辑草稿再发送消息。
- **亮点**：客户端检测 SpeechRecognition/webkitSpeechRecognition，将最终结果追加到输入区，自动发送由本地开关控制。
- **思考**：转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。
- **建议**：先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。

<a id="plugin-1339803365-root"></a>

#### [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/commits)

- **用途**：经常整理多个工作区和会话的用户，希望减少查找管理入口的步骤。
- **亮点**：客户端用 DOM/React fiber 定位行，Host 执行文件管理器调用；危险删除与归档管理器协作。
- **思考**：就地管理减少界面跳转，但把磁盘删除与日常菜单放在一起增加误操作后果。
- **建议**：先只开启置顶、复制路径和归档，对测试目录验证删除确认后再决定是否启用删除功能。

<a id="plugin-1363429979-plugin-notes"></a>

#### [Forge 便签](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2563](https://img.shields.io/static/v1?label=npm+30d&message=2%2C563&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：需要从临时想法转为任务的用户，希望在聊天旁管理笔记及执行状态。
- **亮点**：便签 CRUD 通过 storage-domain 持久化；日程与任务泳道状态关联，工具就绪后再挂 agent 桥。
- **思考**：把输入、任务和状态放在同一处可减少转录；自动执行却会引入授权和重复副作用风险。
- **建议**：先只用便签与归档，再用无副作用任务检查定时运行和失败恢复。

<a id="plugin-1409724830-src"></a>

#### [蓝毛小女仆桌宠](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/commits)

- **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。
- **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。
- **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。
- **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

## 更新时间

2026-10-20
