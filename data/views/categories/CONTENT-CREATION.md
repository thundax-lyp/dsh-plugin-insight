# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@a9i5k4/dsh-ark9canvas](#plugin-1352959121-root) | 提供Harness生图与改图工作台、Agent生图工具、人工审批、多渠道和生成记录。 | 建议观察，先在低余额独立渠道评估审批对象、长提示词、渠道切换和超时查询。 |
| [DSH Vision Toolkit](#plugin-1333100071-root) | 为DSH文本模型接入图片问答、OCR、定位和本地图像处理工具，并提供粘贴图片与产物预览。 | 建议文本模型用户在非敏感截图和可撤销任务中先试用，核对真实图片请求、定位框与OCR边界；敏感数据、自动GUI及持续预算需先确认服务和兼容条件。 |
| [dsh-blend-preview](#plugin-1427791087-root) | 在DSH侧栏预览Blender文件，展示静态三维几何和场景信息。 | 此旧包建议观察；已有环境仅在隔离范围用已知尺寸静态场景对照验证，先确认改名后的入口，纹理动画交由Blender验收。 |
| [dsh-douyin-publish](#plugin-1422396858-root) | 把本地视频交给抖音或B站投稿页并填字段，默认草稿停手，可选配乐和显式发布分支。 | 先观察，仅受控草稿核有效配置/账号与字段，补授权和受理收据后再评估采用。 |
| [dsh-image2-plugin](#plugin-1422216012-root) | 通过 OpenAI 兼容中继生成或编辑图片，并把结果保存到会话。 | 可用公开图片和硬性单次预算试用；不要上传客户素材，先验证失败重试只计一次、文件落在会话目录且能完整删除。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 | 先观察。 |
| [dsh-markdown-live](#plugin-1426477683-root) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | 经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。 |
| [dsh-media-studio](#plugin-1399694663-root) | 在DSH对话生成图片和视频或发送本地媒体，提供后台任务、自动保存及富媒体展示。 | 观察；先验收远端提交后断连与job失败的可追溯恢复，再决定后台试用。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为模型翻译提供切段、术语抽取、规则质检、语体指引与工作区翻译/术语记忆。 | 建议单用户明确cwd、有词表备份的辅助试用；不自动放行高风险翻译，高分语义错、覆盖或路径不明时停写库。 |
| [dsh-redstone-music](#plugin-1401037852-root) | 把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。 | 建议试用，但只限本地世界和测试服。 |
| [dsh-sticker-pack](#plugin-1418769012-root) | 订阅远端表情包清单，镜像图片，向 agent 提供选图工具和 Web/微信渠道贴图提示。 | 仅可信图册试点，Web/微信均以收件端确认；限制等待时间并检查设置路由保护。 |
| [dsh-stl-preview](#plugin-1427978231-root) | 在DSH侧栏查看STL网格，并显示尺寸、面积、体积及边拓扑检查。 | 建议观察旧包入口；已有用户只把小型STL当初筛，先确认新包入口与单位，最终打印验证交给切片器。 |
| [dsh-video-pipeline](#plugin-1414936636-root) | 以 DSH skill provider 提供 19 个视频制作、核验和多平台发布技能与脚本。 | 先只启用无外部发布的生成/核验技能，用测试素材逐环节验证；不要把真实 ARK_API_KEY 注入技能正文。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 把ffprobe、ffmpeg、PDF文本、Whisper、Pandoc、OCR和ExifTool接为DSH本地文件工具，按允许目录读取或生成产物。 | 先观察，先显式窄roots和无敏感独立输出，核真实产物/覆盖/取消，避免唯一原件与批量并发。 |
| [dsh-zh-ui](#plugin-1427300390-root) | 提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。 | 中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 |
| [gzhflow](#plugin-1339888505-root) | 把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 | 先观察。 |
| [no-ai-style](#plugin-1418493685-root) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。 |

<a id="plugin-1352959121-root"></a>

## [@a9i5k4/dsh-ark9canvas](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

> **用途**：供需要在Harness里反复生图/改图并人工控制付费请求的内容制作者使用。交付为保存的图片及参数记录；批准是一道调用前门，不是预算核算或图片质量验收。

> **亮点**：把图片生成的Agent意图与实际付费提交拆开，用面板批准再生成，辅以路径式改图和部分成功批次，改变人机交接位置；图片模型与API能力来自外部渠道。参见[Q01](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q01)、[Q02](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q02)。

> **思考**：审批不是持久预算账本。prompt在createApproval截到500字符后用截断值生成，批准时startGeneration读取当前渠道而非冻结创建时渠道；任务落盘和审批/通知内存又不对称。源码支持这些状态限制，未复现实际错图或错账。参见[Q03](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q03)。

> **建议**：可将批准对象改为持久不可变请求摘要，绑定完整prompt、渠道标识、参数及价格上限，输出显式未知账单状态；重启与渠道切换对照中，若批准后实际提交参数不一致或重复计费未减少则否定。会增加状态迁移与上游幂等适配成本，假设未验证。参见[Q05](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q05)。

<a id="plugin-1333100071-root"></a>

## [DSH Vision Toolkit](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md)

[![GitHub ★ 905](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=905&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-vision-toolkit) [![npm 30d 10,948](https://img.shields.io/static/v1?label=npm+30d&message=10%2C948&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-vision-toolkit)

> **用途**：适合仍使用DSH文本模型、需要截图理解、长图OCR及UI还原验证的人群；按任务验收具体视觉证据和可编辑产物。

> **亮点**：把上游视觉工具变成可组合DSH工具、原生附件与产物流程，并加入准备后切换的运行时管理。[Q03](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q03) 上游算法和playbook归上游，不以适配宣称模型视觉能力胜出。

> **思考**：文本模型得到视觉转述而非原像素，范围合法的框也不证明定位正确；外部服务、路径允许根和队列分段期限都须明确。[Q04](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q04) 图片任务合格率不能由工具存在推断。

> **建议**：未验证假设是带区域和待核点的视觉证据对象配合按需局部复查，可减少转述丢失；用同预算图集比较最终合格率、误定位与总调用证伪。[Q07](../../plugins/anionex--dsh-vision-toolkit/INSIGHT.md#research-q07)

<a id="plugin-1427791087-root"></a>

## [dsh-blend-preview](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md)

[![npm 30d 44](https://img.shields.io/static/v1?label=npm+30d&message=44&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-blend-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-blend-preview)

> **用途**：适合已有Blender环境、在DSH工作区反复检查静态几何和尺寸的人；纹理动画与最终渲染须回到Blender，旧包迁移需先核对。[Q01](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q01)

> **亮点**：相对手工导出GLB或切换Blender，增量是工作区文件触发、本地转换缓存与侧栏检查的一体流程；Blender导出和glTF本身不是本项目原创。[Q01](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q01)

> **思考**：缓存以大小和mtime识别版本，且查看器省略纹理动画；显示成功不等于当前内容或最终视觉验收成立。认证也不等同项目文件沙箱。[Q02](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q02) [Q04](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q04)

> **建议**：未验证假设是把内容新鲜度及表示缺口作为预览交付的一部分，以减少旧缓存和视觉误验；对照同元数据改写、纹理模型与Blender直接打开，若误验不降或复核更慢则否定。[Q05](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q05)

<a id="plugin-1422396858-root"></a>

## [dsh-douyin-publish](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md)



> **用途**：已有本地视频的创作者减少上传填表劳动，需人工核账号/素材/字段和平台受理。

> **亮点**：把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q01)与[Q02](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q02)。

> **思考**：cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q02)。

> **建议**：可探讨账号/素材/字段绑定和发布受理收据，逐次授权、页锁及unknown查询恢复，平台维护成本未验证。详见[Q05](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q05)。

<a id="plugin-1422216012-root"></a>

## [dsh-image2-plugin](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/544244857/dsh-image2-plugin) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-image2-tool) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-image2-tool)

> **用途**：适合从对话生成草图或编辑非敏感图片并直接预览；已有图像应用时可用其原生历史、费用和内容控制。 详见[Q01](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q01)。

> **亮点**：工具、文件落盘和内联预览接通了会话交付；竞争力取决于中继模型/价格，而非协议兼容本身。 详见[Q03](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q03)。

> **思考**：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。 详见[Q04](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q04)。

> **建议**：增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。 详见[Q08](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q08)。

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

> **用途**：面向已有Tavern/SillyTavern角色卡或世界书、希望在DSH中复用设定写小说或互动推演的用户。输入是自己提供的PNG/JSON和场景要求，输出是可查看的设定文档、可激活提示词以及模型生成的正文。插件不自带小说素材，也没有独立生成模型。

> **亮点**：将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q02)。

> **思考**：实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q03)、[Q04](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q04)。

> **建议**：可探索按会话绑定的版本化权威文档与预算注入收据，比较串用、遗漏、token和编辑传播；未实现。详见[Q06](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q06)。

<a id="plugin-1426477683-root"></a>

## [dsh-markdown-live](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/9426Haruka/dsh-markdown-live)

> **用途**：经常在 DSH 输入长 Markdown 的作者希望发送前看到标题、列表、引用和行内格式，同时提交原始文本不变；基线是纯文本输入后再看消息渲染。合格结果是输入、粘贴、中文 IME、撤销、光标和发送字节均正确，长草稿不阻塞，禁用后格式与监听清理。 详见[Q01](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q01)。

> **亮点**：相对纯文本 composer，它在不改变提交字符串的前提下提供接近 WYSIWYG 的输入反馈，并保留 mention/skill等非文本节点。贡献主要是 Lexical 适配与交互细节；表格、图片预览和代码语法高亮未覆盖，且依赖宿主内部节点结构。 详见[Q03](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q03)。

> **思考**：关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。 详见[Q04](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把“文本投影恒等”做成基于属性的编辑序列测试，可在宿主升级时自动发现光标/撤销/字节漂移。最小生成1000条含IME、粘贴、列表退格和围栏的操作序列，比较插件前后最终纯文本、selection与undo；任一字节差异即否定安全启用。 详见[Q08](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q08)。

<a id="plugin-1399694663-root"></a>

## [dsh-media-studio](../../plugins/1497105876--dsh-media-studio/INSIGHT.md)



> **用途**：创作者在DSH内从提示到可找回图片/视频，验收内容、保存和会话呈现。

> **亮点**：将生成、媒体保存与会话展示结合，并将长任务转宿主jobs，减少网页下载上传步骤；生成模型能力继承服务商。见 [Q01](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q01)、[Q02](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q02)。

> **思考**：jobs注册失败会脱离控制器运行且无jobId；会话消失或推送失败不保证送达，远端ID恢复未见持久对账。见 [Q03](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q03)。

> **建议**：未验证的持久阶段回执与原远端ID核对，可能减少重复生成和丢交付；以四阶段故障矩阵测净收益。见 [Q05](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q05)。

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

> **用途**：长文及技术翻译用户需要一致术语和形式核查，合格译文仍以独立语义正确为准。详见[Q01](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q01)。

> **亮点**：把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q01)。

> **思考**：quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q03)。

> **建议**：可研究规则命中位置与独立语义验收分层，以及确认译对的来源/失效关系，以否定翻反等固定反例比较错误放行。当前未验证。详见[Q05](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q05)。

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)



> **用途**：面向把 MIDI/SoundFont 音乐移植进 Minecraft 的创作者。输入是 MIDI、SF2、速度、采样和世界参数；合格结果是 WAV、事件/车道计划与 mcfunction 数据包在 tick 和声部预算内完整播放。替代是手写命令或分别使用 DAW、脚本和 RCON。

> **亮点**：它把成熟的 MIDI、SoundFont 与 Minecraft 命令收束成带陷阱提示和中间工件的 DSH 流水线。独立增量是领域约束编排，不是新合成器；相对手写命令减少音符到 tick、样本和 lane 的重复转换。 参见[Q03](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q03)。

> **思考**：生成成功不等于听感正确：tick 量化、lane 和同 tick 命令预算会改变密集段，SoundFont onset 与游戏衰减会改变音色。RCON 又扩大为服务器写操作，reload 失败可能留下半部署。 参见[Q04](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q04)。

> **建议**：增加听感预算门，计算 onset 偏差、丢弃音符、同 tick 峰值和声部覆盖，超阈值拒绝部署。若指标不能预测盲听缺陷则否定。 参见[Q08](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q08)。

<a id="plugin-1418769012-root"></a>

## [dsh-sticker-pack](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/5V1A-afk/dsh-sticker-pack)

> **用途**：让 DSH 回复按语境适度使用授权图像，并在目标渠道实际显示。

> **亮点**：把远端图册与 DSH agent 工具、Web 地址及微信文件格式打通，并由插件决定贴图概率。详见[Q02](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q02)。

> **思考**：设置 GET 带参数即写盘，组件内无身份/CSRF 校验；等待上限可无限增大，实际外部保护需核。详见[Q03](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q03)。

> **建议**：受保护设置和交付回执能让“能选到图”升级为“已显示/送达”；尚未实现。详见[Q05](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q05)。

<a id="plugin-1427978231-root"></a>

## [dsh-stl-preview](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md)

[![npm 30d 45](https://img.shields.io/static/v1?label=npm+30d&message=45&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-stl-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-stl-preview)

> **用途**：适合在DSH内做STL打印前几何初筛的人；尺寸依赖明确单位，最终制造与切片仍需专业工具。[Q01](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q01)

> **亮点**：相对切片器直开或普通3D查看器，增量是工作区内的STL解析、几何测量与边拓扑初筛；三角网格公式属于标准机制，未证明打印成功率提升。[Q01](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q01)

> **思考**：无向边计数及容差焊接不足以排除自交、反向面和制造问题；Host分块传输仍对应浏览器全量缓冲，不能据此承诺大网格低内存。[Q02](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q02) [Q03](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q03)

> **建议**：未验证假设是显式标注单位与算法覆盖，并将统计移入可取消worker，减少误验及界面阻塞；对照自交/单位错误/大网格任务，若误判或总成本不改善则否定。[Q05](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q05)

<a id="plugin-1414936636-root"></a>

## [dsh-video-pipeline](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline)

> **用途**：已有短视频/AI 短剧素材生产需求，希望把多工具环节、质量门与发布回写串成可发现技能。

> **亮点**：把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q01)、[Q02](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q02)。

> **思考**：环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q03)。

> **建议**：采用秘密引用/受控工具而非正文替换，并维护平台版本/费用/发布门端到端回归，可降低迁移风险；现版未实现。详见[Q04](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q04)。

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

> **用途**：面向在WSL/类Linux环境用DSH处理本地媒体和文档的人。九工具覆盖CLI状态、媒体信息、抽音轨、缩略图、PDF文本、Whisper转录、Pandoc转换、OCR与Exif，不提供远程素材下载、专业编辑时间线或模型自动理解全部媒体。

> **亮点**：将常用媒体/文档CLI封装成结构化参数、路径检查和统一错误/截断结果，减少手写命令。详见[Q02](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q02)。

> **思考**：不存在输出不核父realpath，ffmpeg-y覆盖且写工具并发安全标记；Whisper写/tmp txt但返回stdout，stderr内存无上限、宿主取消未接child。默认roots较宽。详见[Q03](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q03)、[Q05](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q05)。

> **建议**：可探索物理父路径/文件身份绑定、临时产物验收后原子不覆盖、显式后端收据及stderr/signal树治理；未实现。详见[Q06](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q06)。

<a id="plugin-1427300390-root"></a>

## [dsh-zh-ui](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md)



> **用途**：使用 DSH 生成或审查中文 Web 界面的设计与前端团队可用它将中文排版设计 Skill、项目 DESIGN.md/token 注入和 HTML/CSS/组件源码静态检查组合到 DSH；合格结果是设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论。详见[Q01](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q01)。

> **亮点**：把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。它相对“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q03)。

> **思考**：CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可让静态 finding 生成最小渲染探针和截图检查计划，把规则违规与实际视觉影响分层验证。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q08)。

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

> **用途**：面向经常用Agent写微信公众号内容、希望保留素材/文风并减少排版和推草稿重复操作的个人作者。输入为主题、用户真实素材和风格/主题配置，输出从Markdown到排版HTML、图片和公众号草稿，再复盘回写个人知识库。它不是无人值守新闻真实性系统，也不直接完成读者可见的最终发布。

> **亮点**：结合可替换风格/主题、静态脚本门、LLM清单与人工停靠点，并以七工具和一个bundled Skill接入DSH，减少重复流程说明；方法借鉴归属以NOTICE作者说明为界。详见[Q02](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q02)。

> **思考**：reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q03)。

> **建议**：可探索按产物hash绑定质检/审阅、按attempt保存图生/上传/草稿远端ID收据，比较错版/重复与恢复人工；未实现。详见[Q06](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q06)。

<a id="plugin-1418493685-root"></a>

## [no-ai-style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

> **用途**：适合需保留学术事实、引用与不确定性的作者，在授权段落内审阅和轻改英中日文稿。验收对象是改写后的命题及证据边界，仍由作者复核。

> **亮点**：将阅读契约、事实边界、最小编辑和回查门槛与三模式交付接合，比单句润色提示更有审阅结构。详见[Q01](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q01)。

> **思考**：词法flags和数字multiset不能证明语义等价；按钮只是提示插入，自动执行与宿主引用保护有具体契约条件。详见[Q03](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q03)。

> **建议**：从锚点不保关系推导命题级变更收据，按换对象/因果升级/删null等反例比较误改和人工负担，未验证。详见[Q05](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q05)。

## 更新时间

2026-10-26
