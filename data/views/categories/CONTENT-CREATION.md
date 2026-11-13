# 内容生产

[全部分类](INDEX.md) · [返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

<a id="category-index"></a>

**同类比较**

> 比较表与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [@a9i5k4/dsh-ark9canvas](#plugin-1352959121-root) | 提供Harness生图与改图工作台、Agent生图工具、人工审批、多渠道和生成记录。 | 建议观察，先在低余额独立渠道评估审批对象、长提示词、渠道切换和超时查询。 |
| [Adult Tension](#plugin-1339714338-root) | 面向成年人的中文互动叙事 Skill，用本地 Python 运行时管理剧情状态、时间、边界与存档。 | 只用中性合成内容和隔离项目验证存档恢复。 |
| [AI Novel Writer for DeepSeek Harness](#plugin-1275436512-plugins-dsh-ai-novel-writer) | 在DSH Web管理本地小说项目，通过V1单资产审批或V2人审提案协作写作。 | 新用户观察冻结版本，先核兼容/备份恢复；已有用户在独立副本核read-propose-human apply-read，逐item核状态，不以Git替代DB备份。 |
| [Answer me with HTML](#plugin-1401476500-root) | 将 Agent 的短 Markdown 草稿与图关系渲染为单页 HTML，DSH bundle 安装文件系统 Skill。 | [Q04](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q04) 先用非敏感项目对比原流程，按合格交付计事实差错、用时、输入及输出 token。 |
| [Atlas Cloud Skills](#plugin-1175716983-root) | 提供 Atlas Cloud 多媒体生成指南、视频提示技能和示例工作流。 | [Q04](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q04) 建议先核素材许可、服务政策和预算，使用非敏感小样；任务状态未知时保留 ID 回查，不盲目新提交。 |
| [Awesome GPT-Image2](#plugin-1220744720-root) | 收录 GPT-Image2 画廊案例和工业提示词模板，并提供辅助选择模板与风格的 Skill。 | [Q04](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q04) 先用一份商品海报简报对比两种写法，再按文案、比例、构图和返工次数决定是否继续参考。 |
| [DeepBlend Studio Bundle](#plugin-1368481604-packages-deepblend-bundle) | 组合 DSH 中的 Blender runtime、业务 host 与工作台。 | [Q03](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md#research-q03) 固定 DSH、Node、Blender 和视频工具版本，使用独立工作目录与最小场景。 |
| [DeepSeek Design 分发与贡献入口](#plugin-1335095892-root) | 组织面向 DSH 的 Design、PPT 和 Video 可视化创作插件与上游源码。 | 核对完整许可和具体包版本，先在隔离样例验收，异常时回原设计工具。 |
| [DeepSeek iDesign](#plugin-1335095892-packages-deepseek-idesign) | 在 DSH 对话中提供 iPolloWork Design Studio 可视化设计视图。 | 核对宿主与许可，用测试工作区验证草稿及并发保存；异常回原工具。 |
| [deepseek-ivideo](#plugin-1335095892-packages-deepseek-ivideo) | 在 DeepSeek Harness 对话中编辑、预览和导出视频。 | [Q04](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q04) 确认 peer 范围后在隔离工作区备份并试一段视频；审查成片再使用，失败时手动核对恢复。 |
| [DirectorX视频生产插件](#plugin-1335058602-root) | 将DSH Agent接到分镜/生成提案、外部媒体模型、可重渲染时间线及技术质检与画布交付。 | [Q06](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q06)观察；可丢弃项目先mock+小额代表provider，人工查账/创作验收，企业无人值守需先补授权恢复实证。 |
| [DrawAI](#plugin-1371788896-root) | 在 DSH 右侧栏编辑工作区画布，并用语义工具读写原生 .drawai 或兼容 .drawio 的插件。 | [Q01](../../plugins/fourzkw--dsh-drawai/INSIGHT.md#research-q01) 有独立原稿的维护者可在副本上先改一条流程标签，再从右侧栏核对节点和页面。 |
| [DSH × Blender](#plugin-1368569221-root) | 将 Blender 场景操作、观察、验证与渲染作业接入 DeepSeek Harness。 | [Q03](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q03) 仅在独立场景试一次渲染并验证过门与结果。 |
| [DSH ComfyUI](#plugin-1340918386-root) | 从 DSH 调用本地或远程 ComfyUI，管理工作流参数和生成媒体。 | [Q04](../../plugins/fandc520--dsh-comfyui/INSIGHT.md#research-q04) 先同步试一次并检查真实队列。 |
| [DSH ImageGen](#plugin-1335287012-root) | 在 DSH 使用多渠道生成和编辑图片，管理画布、历史与画廊。 | [Q04](../../plugins/dickpy--dsh-imagegen/INSIGHT.md#research-q04) 先只配一条测试渠道并保持同步关闭。 |
| [DSH OpenMAIC](#plugin-1333147218-root) | 将完整课堂生成与会话内教学卡片接入 DSH | [Q04](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md#research-q04) 先试无敏卡片，再用模拟服务验证课堂提交。 |
| [DSH OpenPencil](#plugin-1332212466-root) | 把 OpenPencil 的 .op 文档预览、画布检查、编辑与受控草稿生成流程接入 DSH 对话。 | [Q03](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md#research-q03) 用固定版本和独立副本试用，最后亲自看画布、保存稿与需求逐项对应。 |
| [DSH Qwen Studio](#plugin-1422133477-root) | 把本地 MLX 或自托管图像服务接入 DSH 对话，记录生成任务并按 ID 取回状态与附件。 | [Q01](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md#research-q01) 已有推理设备并能隔离图库的创作者，可先提交一张无敏感输入的配图再按 ID 取回。 |
| [DSH Raw HTML](#plugin-1341430062-root) | 以宿主前端补丁呈现 HTML 卡片并注入视觉设计规范 | [Q04](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md#research-q04) 静态卡起步，在测试 bundle 验证关闭和恢复。 |
| [DSH Short Video Studio](#plugin-1345883186-root) | 在 DSH 会话中连接 ComfyUI，生成、整理和后处理短视频素材。 | 先在一次性工作区做一镜，核查文件、规格及后端状态。 |
| [DSH to Figma](#plugin-1424114133-root) | 将本地Figma companion或官方MCP接入DSH，读取设计上下文并编辑原生画布与资源。 | 可丢弃Figma文件受限试用，先明确后端/file/page与能力，再做少量原生节点并核结构变量/截图。 |
| [dsh-blend-preview](#plugin-1427791087-root) | 在DSH侧栏预览Blender文件，展示静态三维几何和场景信息。 | 此旧包建议观察；已有环境仅在隔离范围用已知尺寸静态场景对照验证，先确认改名后的入口，纹理动画交由Blender验收。 |
| [dsh-blender](#plugin-1334049596-root) | 在 DSH 中调用本地 Blender 建模、检查场景、渲染、导出模型并回读验证。 | 建议先观察。 |
| [dsh-brewreel](#plugin-1388372309-integrations-deepseek-harness) | 让 DSH 模型生成分镜 JSON，通过模板渲染竖版宣传片并检查交付。 | [Q03](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md#research-q03) 先核对兼容性并用无敏感样本验证。 |
| [dsh-douyin-publish](#plugin-1422396858-root) | 把本地视频交给抖音或B站投稿页并填字段，默认草稿停手，可选配乐和显式发布分支。 | 先观察，仅受控草稿核有效配置/账号与字段，补授权和受理收据后再评估采用。 |
| [dsh-game-material-master](#plugin-1377645668-root) | 在 DSH 中生成和加工游戏素材，提供地图编辑、检查与导出工作台。 | [Q03](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md#research-q03) 先验证本地地图编辑，再单独评估外部生成和素材传输。 |
| [dsh-hyperframes](#plugin-1334554606-root) | 在 DeepSeek Harness 中编辑 HTML 视频工程，管理素材并预览、导出 MP4。 | [Q03](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md#research-q03) 用公开短片试用。 |
| [dsh-image-gen](#plugin-1336998801-root) | 将多种图像供应商接入 DSH 对话，支持逐张批量生成、附件呈现和可选工作区保存。 | [Q01](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md#research-q01) 已有可信渠道的创作者可先用两到三条不同主题的无敏感内容提示词，核对每张附件与文件是否符合任务。 |
| [dsh-image2-plugin](#plugin-1422216012-root) | 通过 OpenAI 兼容中继生成或编辑图片，并把结果保存到会话。 | 可用公开图片和硬性单次预算试用；不要上传客户素材，先验证失败重试只计一次、文件落在会话目录且能完整删除。 |
| [dsh-imagegen-video](#plugin-1420747575-root) | 在 DSH 中提供图片与视频生成、编辑、画布节点和本地片段拼接。 | [Q04](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q04) 先保留观察结论，核对异步任务账本和可终止渲染，再考虑付费工作流。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 | 先观察。 |
| [dsh-markdown-live](#plugin-1426477683-root) | 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。 | 经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。 |
| [dsh-media-studio](#plugin-1399694663-root) | 在 DSH 会话生成或发送图片与视频，并提供内联预览和后台推送。 | [Q03](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q03) 先用可披露素材和测试模型核对同步，再检查后台是否可追踪。 |
| [dsh-mimotts](#plugin-1397477851-root) | 为 DSH 助手回复合成语音，提供内联播放器、语音历史和工作区 WAV 工具。 | [Q03](../../plugins/1497105876--dsh-mimotts/INSIGHT.md#research-q03) 先用可披露文本，核对音频、索引和失败再扩大使用。 |
| [dsh-novel-forge 小说锻炉](#plugin-1366449702-root) | 为 DeepSeek Harness 提供中文长篇写作的细纲、设定账本、章节检查与版本管理。 | [Q04](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md#research-q04) 从隔离项目的一章对照开始，能解释拒绝与版本结果后再考虑扩大。 |
| [dsh-oil-creator](#plugin-1339110580-root) | 为 DSH Desktop 提供本地内容工作台，组织选题脚本、录屏工程、字幕封面、视觉审查与发布状态。 | [Q03](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q03)复制小库仅核心片库/脚本/自有会话trial，先预览不批量整理。 |
| [dsh-pet 素材制作工程](#plugin-1333652151-root) | 将自动绿幕或手工抠像片段对齐并编码为桌宠动画，另提供 Safari 兼容素材派生。 | [Q04](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q04) 用隔离样片做第一段，保存旧产物并记录工具和人工成本。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为模型翻译提供切段、术语抽取、规则质检、语体指引与工作区翻译/术语记忆。 | 建议单用户明确cwd、有词表备份的辅助试用；不自动放行高风险翻译，高分语义错、覆盖或路径不明时停写库。 |
| [dsh-postiz](#plugin-1157659618-plugins-dsh-postiz) | 连接 Postiz MCP，辅助 DSH 创建、排期和发布社媒内容。 | [Q04](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md#research-q04) 优先隔离账号和草稿，提交前核对目标、内容、时间及授权。 |
| [dsh-ppt](#plugin-1335302697-root) | 在 DSH 从大纲或结构化资料生成 HTML、可编辑 PPTX 与工程文件，并维护修订和分享。 | [Q04](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q04) 先从四页合成稿试用，按 [Q02](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q02) 验证外部编辑后拒绝覆盖，按 [Q03](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q03) 比对目标软件字体和版式。 |
| [dsh-redstone-music](#plugin-1401037852-root) | 把 MIDI 与 SoundFont 渲染结果编排成 Minecraft 红石音乐数据包。 | 建议试用，但只限本地世界和测试服。 |
| [dsh-remotion](#plugin-1334554520-root) | 在 DSH 内使用 Remotion 技能与模板管理视频工程、预览并导出 MP4。 | [Q04](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q04) 在私人隔离 Host 用公开素材测试极短片头，先核对修订与成品。 |
| [dsh-share](#plugin-1332051085-root) | 在 DSH Web 选择单轮或多轮问答，导出 PNG、Markdown 或 HTML，并支持分页图片打包。 | 先在独立 Web profile 用合成会话验证 Markdown 和 HTML，再试长图分页。 |
| [dsh-sticker-pack](#plugin-1418769012-root) | 为DSH回复提供远端图册/概率选图、Web链接与微信文件副本；真正显示/发送及总等待需验。 | 观察，先修/验设置/预算/字段与可信图册Web显示，再决定是否值得试用；任何误图、慢回复、误改或停不住下载先查在途后退回简单方式，见[Q06](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q06)。 |
| [dsh-stl-preview](#plugin-1427978231-root) | 在DSH侧栏查看STL网格，并显示尺寸、面积、体积及边拓扑检查。 | 建议观察旧包入口；已有用户只把小型STL当初筛，先确认新包入口与单位，最终打印验证交给切片器。 |
| [dsh-tavern](#plugin-1335599084-root) | 管理角色卡、世界书和预设，在 DSH 会话中组织角色扮演与故事续写。 | [Q04](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q04) 先用虚构材料比较原生预设。 |
| [dsh-tongflow](#plugin-1204369117-packages-dsh-tongflow) | 将 TongFlow Studio 的工具、技能和界面接入 DSH 会话。 | 从免费非敏感样例和首消息触发开始，付费前核对实际账单与确认。 |
| [dsh-tool-markdown](#plugin-1327795364-packages-dsh-tool-markdown) | 在 DeepSeek Harness 中转换 HTML 和 Markdown、整理表格并生成目录。 | [Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md#research-q03) 可对公开片段试用，按 [Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md#research-q02) 独立检查链接和目录。 |
| [dsh-video-pipeline](#plugin-1414936636-root) | 以 DSH skill provider 提供 19 个视频制作、核验和多平台发布技能与脚本。 | 先只启用无外部发布的生成/核验技能，用测试素材逐环节验证；不要把真实 ARK_API_KEY 注入技能正文。 |
| [dsh-vision](#plugin-1333755444-root) | 原生视觉透传，文本主模型经云或OCR观察桥接图片。 | [Q03](../../plugins/oil-oil--dsh-vision/INSIGHT.md#research-q03) 固定测试图对照两阶段结果再日用。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 为 DSH 提供本地媒体探测、音轨与缩略图提取、PDF、转写、文档转换、OCR 和元数据工具。 | 优先只读小样本，配置独立根目录，空目标写入；条件不明时回本地工具。 |
| [dsh-zh-ui](#plugin-1427300390-root) | 提供中文UI设计Skill、项目设计规范注入和静态zh_design_lint检查工具。 | 中文界面团队可在源码审查阶段试用，并以真实渲染和可访问性测试复核静态结果。 |
| [EduWork Knowledge Studio](#plugin-1369398336-packages-dsh-knowledge-studio) | 在 DSH 工作区使用资料与模型创建、管理和学习多种内容成果。 | [Q05](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md#research-q05) 建议先用公开短资料小批试作并逐题核对；来源、答案、权限或成本不符时停止并回人工制卡。 |
| [ff-toolkit](#plugin-1205593265-root) | 将 FFmpeg 媒体处理操作封装为 Python 和模型可调用工具。 | [Q04](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q04) 先在隔离副本中关闭覆盖、使用新路径并检查结果；不接受权限或恢复边界时停止。 |
| [gzhflow](#plugin-1339888505-root) | 把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 | 先观察。 |
| [HTML Studio](#plugin-1237969184-root) | 独立的本地 HTML 与 Markdown 文档浏览、编辑和版本恢复工作台。 | 仅观察隔离副本上的写范围与恢复，继续用原编辑器管理真实文件。 |
| [humanizer-ru](#plugin-1139128402-root) | 俄语编辑技能，减少模板腔并以事实锚点与可选本地脚本复核数字、名称、条件和语义强弱。 | [Q03](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q03) 仅俄语、非敏感短文副本，先只分析再定点改，保留原文；核所有数字/归属/模态和checks，失真即回退，不适用语言不自动翻译。 |
| [Jacky Creator](#plugin-1345649791-root) | 在 DSH 内管理本地内容项目和运营工作台，按需接入字幕、封面与发布能力。 | [Q03](../../plugins/jackywxsz--dsh-creator/INSIGHT.md#research-q03) 无真实素材和外部凭据试跑。 |
| [lightroom-py](#plugin-1225248471-root) | 通过 Python、MCP 和 DSH 接口控制 Lightroom Classic 图库及编辑。 | [Q03](../../plugins/drshy-org--lightroom-py/INSIGHT.md#research-q03) 在备份图库副本上先核依赖、选区与单项操作；结果或恢复不明确时停止写入。 |
| [MuseAI](#plugin-1200521020-root) | 本地角色对话、文字冒险与故事世界资料管理应用。 | [Q04](../../plugins/yejiming--museai/INSIGHT.md#research-q04) 仅在可信环境用非敏感资料观察并备份；[Q03](../../plugins/yejiming--museai/INSIGHT.md#research-q03) 的状态暴露未修复核实前不启用 LAN。 |
| [Next AI Draw.io DSH](#plugin-953521037-packages-dsh-plugin) | 在 DSH 接入 draw.io MCP 工具和可手工编辑、带版本与撤销的侧栏画布。 | 先固定实际运行的 MCP 和预览来源，用隔离 profile 试一张小图。 |
| [NextTavern](#plugin-1366204745-root) | 为 DSH 提供角色扮演工作区，支持角色卡、世界线、记忆和小说导出。 | [Q04](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md#research-q04) 先独立工作区核对原文出稿，再决定是否启用整理。 |
| [No AI Style](#plugin-1418493685-root) | 为学术和专业写作提供检查、润色和起草 Skill，以及 DSH 输入栏模式按钮。 | [Q04](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q04) 先做只审阅并复核原文。 |
| [Notes](#plugin-1182135360-root) | 提供便签编辑、主题排版与图片、Markdown 和网站导出。 | [Q04](../../plugins/zhaoolee--notes/INSIGHT.md#research-q04) 先以单活动编辑端和非敏感稿件试用，保留源稿并核对导出；多端状态不明时停止云写入并比较副本。 |
| [Oh Story DSH](#plugin-1339737707-root) | 在 DSH 原生会话中提供小说、短剧、互动游戏和视频解说的文件创作工作台。 | [Q05](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md#research-q05) 先用文本副本检验改稿、保存与冲突恢复，不把付费媒体纳入已支持试用范围；草稿或状态失配就保全文件回原流程。 |
| [OpenPencil](#plugin-1159938129-root) | 独立桌面与 Web 设计应用，支持通过 MCP 读写可编辑 .op 文档和导出代码。 | [Q05](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q05) 单写者在可销毁文件副本上试一个节点。 |
| [OpenStory](#plugin-1197966970-root) | 基于 Agent-Kernel 的多智能体故事推演框架，含 WorldKernel 世界生成示例 | [Q04](../../plugins/zju-llms--openstory/INSIGHT.md#research-q04) 有Python/Redis/Ray能力者可在独立目录按固定小预算试世界与少量tick；角色失步或语义生成报错时暂停并回手工配置/单模型基线。 |
| [OpenWrite](#plugin-1171186947-root) | 为 DeepSeek Harness 提供长篇小说写作预设、创作工作台与 Core 桥接。 | [Q03](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q03) 有备份才试单章，先验证工作区与模型目的地，异常以原任务和文件对账。 |
| [PicGo](#plugin-113965016-root) | 桌面图片上传与管理工具，支持多图床配置、剪贴板和外部工具接入，并返回可粘贴链接。 | 反复上传文档配图且已有可信图床的创作者可先用非敏感图片试用。 |
| [PicGo-Core](#plugin-149085734-root) | 提供CLI、API和本地服务图片上传流程，支持多图床配置、剪贴板及插件扩展。 | 高频文档图片用户可在测试图床和小批次试用；先核对目标配置、权限与每项URL内容，发生部分失败先对账；若只偶发上传或不能处理远端重名，就继续图床网页。 |
| [PPT Design Skill](#plugin-1294612352-root) | 为演示作者提供需求、视觉方向和主题锁定到 PPTX 生成、逐页 PNG 审阅返工及交付记录的方法，生成依赖外部 pptx-designer。 | 观察优先；熟悉Python/审稿者可隔离repo/venv先核安装schema/库/字体/render，再小样，缺环境/模板冲突/MUST不达停止正式交付，保旧版和源稿修后重渲染。 |
| [Superdesign Skill](#plugin-1139329853-root) | 为编码Agent提供UI、演示稿和图形设计流程，并通过CLI连接Superdesign画布。 | 有设计迭代需求者可先用可公开UI片段试用，核对发送文件、费用和目标草稿后再生成；私密源码或确定性小修优先本地直接修改，不把缓存状态当持续上传许可。 |
| [TavernWeave X DSH](#plugin-1308599537-host-adapters-dsh-plugin) | 把 TavernWeave Skill、角色卡工程预设与世界书管理面板打包接入 DSH。 | [Q04](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md#research-q04)非商业独立profile/副本小改，核备份与重开；异常停写回编辑器。 |
| [TongFlow](#plugin-1204369117-root) | 提供跨文本、图像、音频和视频的生成式工作流平台。 | 明确预算并以短样例逐节点验证；未知结果先查询供应商。 |
| [Vox Director](#plugin-1296647613-root) | 以主题和 beats 配置编排拼贴视频的图像、运动、旁白、音乐和字幕，并用 ffmpeg 合成。 | 先观察编排和回执边界，付费试验需先有明确预算/逐任务对账；源码检查不授权生成。 |
| [书童 Pagekin](#plugin-1275436512-root) | 本地优先的长篇小说桌面写作工作区，覆盖设定、蓝图、写稿、审稿、修稿和定稿。 | 长篇作者先用非敏感一章及独立备份试用，核候选/合并/定稿待发布/导出完整链。 |
| [催更姬](#plugin-1389035449-root) | 在 DSH 中编辑小说正文、规划情节并管理人物世界设定，支持按需查阅、版本历史与作品数据管理。 | 已有DSH且愿意维护人物和规划资料的长篇作者，可在新建副本库先试修订一章：核对维护ready、作品ID和revision，用唯一patch保存后回读正文及历史，再检查关联资料。 |
| [大肥鱼的小说工坊](#plugin-1337043852-root) | 用阶段门禁、设定注入和版本归档管理连载小说 | [Q04](../../plugins/akira399--dsh-novel-writer/INSIGHT.md#research-q04) 先用虚构三章验证门禁、预算与导出。 |
| [无限画布（Infinite Canvas）](#plugin-1412882758-root) | 在 DSH 中用节点画布组织短剧剧本、分镜、图像与视频生成，并衔接后期交付。 | 保留观察。 |

<a id="plugin-1352959121-root"></a>

## [@a9i5k4/dsh-ark9canvas](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

> **用途**：供需要在Harness里反复生图/改图并人工控制付费请求的内容制作者使用。交付为保存的图片及参数记录；批准是一道调用前门，不是预算核算或图片质量验收。

> **亮点**：把图片生成的Agent意图与实际付费提交拆开，用面板批准再生成，辅以路径式改图和部分成功批次，改变人机交接位置；图片模型与API能力来自外部渠道。参见[Q01](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q01)、[Q02](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q02)。

> **思考**：审批不是持久预算账本。prompt在createApproval截到500字符后用截断值生成，批准时startGeneration读取当前渠道而非冻结创建时渠道；任务落盘和审批/通知内存又不对称。源码支持这些状态限制，未复现实际错图或错账。参见[Q03](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q03)。

> **建议**：可将批准对象改为持久不可变请求摘要，绑定完整prompt、渠道标识、参数及价格上限，输出显式未知账单状态；重启与渠道切换对照中，若批准后实际提交参数不一致或重复计费未减少则否定。会增加状态迁移与上游幂等适配成本，假设未验证。参见[Q05](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339714338-root"></a>

## [Adult Tension](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md)

[![GitHub ★ 484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/daha1216/dsh-adult-tension)

> **用途**：希望跨会话续写互动故事的成年用户，可以重新读取引擎保存的已提交状态。

> **亮点**：把会话状态从纯文本中分离，在写事务绑定幂等记录和修订检查，令已提交的进度可单独核对。见 [Q01](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md#research-q01)、[Q02](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md#research-q02)。

> **思考**：普通回合会先展示正文后批量落盘；退出时可能只保留已提交状态。诊断日志和模型传输也有独立的数据路径。见 [Q02](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md#research-q02)、[Q03](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md#research-q03)。

> **建议**：分别在提交前后中断同一故事，比较纯摘要与状态引擎能否恢复最后确认的事件。见 [Q04](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/daha1216--dsh-adult-tension/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1275436512-plugins-dsh-ai-novel-writer"></a>

## [AI Novel Writer for DeepSeek Harness](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md)

[![GitHub ★ 2,371](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C371&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Pagekin) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer) [![最新发布 2026-08-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ethanyoq/dsh-ai-novel-writer)

> **用途**：用户是已有兼容DSH Web、希望在同一会话围绕本地小说设定、架构、人物、蓝图和单章正文协作的作者。相对聊天后手工存文件，V1提供单资产审批保存，V2以结构化提案收件箱将模型建议与作者应用分开；合格结果是用户接受的项目状态与可回读receipt，而非生成文字。相对根桌面，本插件没有其批量流程或自动审稿，也无项目导出。

> **亮点**：[Q01](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md#research-q01)、[Q02](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md#research-q02)支持有限小说工具面、V1单资产审批和V2持久非权威提案；以人审应用明确项目事实，增量是协作变更边界。依赖DSH既有loop/审批，不证明文学质量。

> **思考**：[Q03](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md#research-q03)、[Q04](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md#research-q04)表明逐item事务可能partial，提案/表单非保存，迁移发布后失败仍可能有DB；Git忽略DB且无导出、冻结旧rc兼容未验，新用户不能从根桌面成熟度推可用。

> **建议**：[Q05](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md#research-q05)提出未验证的基线差异/叙事约束冲突预览加应用后回读；同章对照错误接受、返工与人审成本，不改善就放弃，不能借用桌面审稿或算当前贡献。

[查看完整分析](../../plugins/ethanyoq--ai-novel-writer--plugins-dsh-ai-novel-writer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401476500-root"></a>

## [Answer me with HTML](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md)

[![GitHub ★ 6,062](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C062&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)

> **用途**：[Q01](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q01) 架构与因果解释可按面板阅读，原办法是 Markdown 或直接生成 HTML。

> **亮点**：[Q01](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q01) 与 [Q02](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q02) 把坐标与页面框架交给可复用 CLI，量化收益仍只有作者样本。

> **思考**：[Q03](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q03) 解析与 CSP 各约束局部行为，事实正确性、文件嵌入和交付后的暴露仍需分别验收。

> **建议**：[Q05](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q05) 在重要边旁显示证据位置和人工核对状态，可能降低方向误写及审阅定位时间。以当前分离的图和代码块作对照。

[查看完整分析](../../plugins/qingyuna--answer-me-with-html/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1175716983-root"></a>

## [Atlas Cloud Skills](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md)

[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AtlasCloudAI/atlas-cloud-skills)

> **用途**：使用云端生成模型的创作者或开发者可参考多媒体 API、视频规划和提示规范。

> **亮点**：[Q01](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q01) 与 [Q02](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q02) 显示项目组合多份技能和可恢复视频任务脚本；模型生成能力来自外部服务，不归因于本集合。

> **思考**：[Q03](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q03) 的素材和凭据会进入外部路径；[Q02](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q02) 直接脚本的音轨重试可能产生额外生成，不应将托管连接器报价机制假定适用。

> **建议**：[Q05](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md#research-q05) 提出覆盖直接脚本提交与重试的预算和恢复状态提示；若不能改善决策或代价过高则否定。

[查看完整分析](../../plugins/atlascloudai--atlas-cloud-skills/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1220744720-root"></a>

## [Awesome GPT-Image2](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md)

[![GitHub ★ 35,670](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C670&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/freestylefly/awesome-gpt-image-2)

> **用途**：经常制作商品海报和活动视觉的编辑可以查找模板、保留案例号并交接一份待审阅的提示词。

> **亮点**：[Q01](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q01) 将按类别选例、提示词分块和案例号交接连成一条可查路径，便于编辑复用构图与文案约束。

> **思考**：[Q02](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q02) 专题的复刻只给出单次结果，原图条件和工具返回模型 ID 缺失限制了模型归因。

> **建议**：[Q04](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md#research-q04) 图片旁直接标出未知模型与原图条件，可能减少将复刻误读为版本排名的情况，需用归因题和提示词查找任务验证。

[查看完整分析](../../plugins/freestylefly--awesome-gpt-image-2/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1368481604-packages-deepblend-bundle"></a>

## [DeepBlend Studio Bundle](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md)

[![GitHub ★ 101](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=101&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pearjelly/deep-blend) [![npm 30d 6,813](https://img.shields.io/static/v1?label=npm+30d&message=6%2C813&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepblend/dsh-blender-bundle) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepblend/dsh-blender-bundle)

> **用途**：需要 Agent 辅助三维创作的 DSH 用户。

> **亮点**：[Q01](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md#research-q01) 想在 DSH 进行场景编辑与渲染的用户通过 bundle 一次挂载 runtime、host 和 UI。lib 入口转出 UI，patch 明确将模型工具留给 agent preset，避免进程级组合给所有会话注册。相比手配多个插件，bundle 提供统一分发与配置。

> **思考**：[Q02](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md#research-q02) bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

> **建议**：[Q04](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md#research-q04) 对照当前 host 审批和任务流程，试验用任务 ID、执行代和落盘帧读回确认取消。延迟结果及取消后恢复对照重复帧和误完成，若没有改善则撤回。

[查看完整分析](../../plugins/pearjelly--deep-blend--packages-deepblend-bundle/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335095892-root"></a>

## [DeepSeek Design 分发与贡献入口](../../plugins/devin-axis--deepseek-design/INSIGHT.md)

[![GitHub ★ 1,661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design)

> **用途**：需要在 DSH 对话和视觉界面之间交接设计文件的创作者及贡献者。[Q01](../../plugins/devin-axis--deepseek-design/INSIGHT.md#research-q01)

> **亮点**：根仓整合三个包的发现、来源和贡献路径；具体交互能力归各子组件，待分别验收。[Q01](../../plugins/devin-axis--deepseek-design/INSIGHT.md#research-q01) [Q02](../../plugins/devin-axis--deepseek-design/INSIGHT.md#research-q02)

> **思考**：作者描述的可编辑与导出流程尚未在子包及宿主验证，source-available 许可也限制部分使用范围。[Q03](../../plugins/devin-axis--deepseek-design/INSIGHT.md#research-q03)

> **建议**：未验证假设：AI 与人工交接时展示受影响文件和基线，可减少覆盖；须对照已有选区与撤销功能验证。[Q05](../../plugins/devin-axis--deepseek-design/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/devin-axis--deepseek-design/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335095892-packages-deepseek-idesign"></a>

## [DeepSeek iDesign](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md)

[![GitHub ★ 1,661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design) [![npm 30d 2,432](https://img.shields.io/static/v1?label=npm+30d&message=2%2C432&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-idesign) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-idesign)

> **用途**：需要在 DSH 对话旁手动精调设计的用户；基线是直接改文件或独立工具。[Q01](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md#research-q01)

> **亮点**：将选区编辑和对话草稿接到 DSH；PPT/Video 属其他包。[Q01](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md#research-q01) [Q02](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md#research-q02)

> **思考**：冲突检查依赖非 force、基线与现存文件，不能保证所有并发写入不覆盖。[Q03](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md#research-q03)

> **建议**：未验证假设：显示文件基线和选区影响可减少误覆盖；须对照现有保护与实际保存。[Q05](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/devin-axis--deepseek-design--packages-deepseek-idesign/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335095892-packages-deepseek-ivideo"></a>

## [deepseek-ivideo](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md)

[![GitHub ★ 1,661](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C661&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design) [![npm 30d 1,023](https://img.shields.io/static/v1?label=npm+30d&message=1%2C023&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-ivideo) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-ivideo)

> **用途**：DSH 用户希望在对话和视频时间线之间迭代短视频。

> **亮点**：[Q01](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q01) 会话中提供视频视图；[Q02](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q02) 工作区绑定和模型校验为可解释接线，编辑渲染继承打包运行时。

> **思考**：[Q03](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q03) 失败回滚是尽力操作，[Q04](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q04) 0.2.x 超出 peer 上界；视频效果未验收。

> **建议**：[Q05](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md#research-q05) 假设将检查范围、项目和成片绑定为收据帮助决定是否审片；尚未验证。

[查看完整分析](../../plugins/devin-axis--deepseek-design--packages-deepseek-ivideo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335058602-root"></a>

## [DirectorX视频生产插件](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md)

[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LaplaceYoung/dsh-directorx)

> **用途**：DirectorX0.2.0是原生DSH垂直视频生产插件，含模型工具、分镜画布客户端、bundled Skills/知识配方及媒体管线，不是另一个独立Agent runtime。它面向在DSH把brief转脚本/镜头、生成素材、人工审阅并交付视频的创作者；Agent loop/提问审批/会话由宿主提供，生成质量来自外部模型，媒体处理来自FFmpeg。成功是符合brief且素材/剪辑/声音/字幕可核的可用成片和可继续修订的项目，不是命令多/画布有节点。

> **亮点**：[Q01](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q01)视频垂直工具/知识接线；[Q02](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q02)项目/参考/提案与代表生成链；[Q04](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q04)可改时间线、本地编辑和技术QC反馈。

> **思考**：[Q03](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q03)proposal可自批、inBudget常量true/批准非单次能力，cancel仅本地账本；[Q04](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q04)QC不验创作发布质量；[Q05](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q05)数据/资源/费用和恢复仍待验证。

> **建议**：[Q06](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md#research-q06)不可自批单次生成能力/费用任务回执与技术+创作+来源分层签收，故障对照验重复费用和净成本，未实现。

[查看完整分析](../../plugins/laplaceyoung--dsh-directorx/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1371788896-root"></a>

## [DrawAI](../../plugins/fourzkw--dsh-drawai/INSIGHT.md)

[![GitHub ★ 280](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=280&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fourzkw/dsh-drawai) [![npm 30d 6,816](https://img.shields.io/static/v1?label=npm+30d&message=6%2C816&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-drawai) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-drawai)

> **用途**：软件维护者在 DSH 讨论发布或故障流程，需要把讨论整理成可复核并能继续人工调整的工作区流程图。

> **亮点**：[Q01](../../plugins/fourzkw--dsh-drawai/INSIGHT.md#research-q01) 与 [Q02](../../plugins/fourzkw--dsh-drawai/INSIGHT.md#research-q02) 显示，工作区文件可在 DSH 右侧栏手动调整，模型也能按节点与边的结构读取和更新同一份文档。

> **思考**：[Q03](../../plugins/fourzkw--dsh-drawai/INSIGHT.md#research-q03) 普通版本检查与撤销保护并不对称。撤销遇到版本变化仍可把旧文本整份写回，只在后台任务节点变化时停下。

> **建议**：[Q05](../../plugins/fourzkw--dsh-drawai/INSIGHT.md#research-q05) 对小图做迁移、带指纹写入及外部编辑后的撤销对照，可以区分语义可编辑与往返保真。

[查看完整分析](../../plugins/fourzkw--dsh-drawai/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1368569221-root"></a>

## [DSH × Blender](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md)

[![GitHub ★ 2,017](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C017&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sixtysevenlf/dsh-blender-plugin) [![npm 30d 7,466](https://img.shields.io/static/v1?label=npm+30d&message=7%2C466&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender-plugin) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender-plugin)

> **用途**：能独立审查 3D 场景的创作者，在 DSH 中希望跟踪一项 Blender 工作从执行到验收。

> **亮点**：[Q01](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q01) 将宿主工具、长作业和观察路径衔接；[Q03](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q03) 将机器验收的跳过及失败显式区分。Blender 渲染本身来自上游。

> **思考**：[Q02](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q02) 队列取消先改变状态，底层进程未必已停。[Q03](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q03) 不强制过门时，导出回执也不能作为验收记录。

> **建议**：[Q03](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md#research-q03) 以进程实际退出和输出静止补足取消后的作业核对，对照当前回执后再判断增量。尚未验证。

[查看完整分析](../../plugins/sixtysevenlf--dsh-blender-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1340918386-root"></a>

## [DSH ComfyUI](../../plugins/fandc520--dsh-comfyui/INSIGHT.md)

[![GitHub ★ 161](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=161&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fandc520/dsh-comfyui) [![npm 30d 6,235](https://img.shields.io/static/v1?label=npm+30d&message=6%2C235&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-comfyui) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-comfyui)

> **用途**：在 DSH 调用已有 ComfyUI 工作流的创作者可减少操作切换。

> **亮点**：[Q01](../../plugins/fandc520--dsh-comfyui/INSIGHT.md#research-q01) 把参数和媒体结果连到会话。

> **思考**：[Q03](../../plugins/fandc520--dsh-comfyui/INSIGHT.md#research-q03) 背景作业检查可能发生在远端提交之后。

> **建议**：[Q05](../../plugins/fandc520--dsh-comfyui/INSIGHT.md#research-q05) 验证预检能否减少失败重试时的重复。

[查看完整分析](../../plugins/fandc520--dsh-comfyui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335287012-root"></a>

## [DSH ImageGen](../../plugins/dickpy--dsh-imagegen/INSIGHT.md)

[![GitHub ★ 168](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=168&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dickpy/dsh-imagegen) [![npm 30d 12,287](https://img.shields.io/static/v1?label=npm+30d&message=12%2C287&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dickpy/dsh-imagegen) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dickpy/dsh-imagegen)

> **用途**：在 DSH 做图的用户可评估一体化生成和历史。

> **亮点**：[Q01](../../plugins/dickpy--dsh-imagegen/INSIGHT.md#research-q01) 把渠道生成和作品记录串起来。

> **思考**：[Q03](../../plugins/dickpy--dsh-imagegen/INSIGHT.md#research-q03) 指定渠道缺失会回退，对象同步是独立出站路径。

> **建议**：[Q05](../../plugins/dickpy--dsh-imagegen/INSIGHT.md#research-q05) 核查显式渠道缺失提示能否减少错发。

[查看完整分析](../../plugins/dickpy--dsh-imagegen/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333147218-root"></a>

## [DSH OpenMAIC](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md)

[![GitHub ★ 113](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=113&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/THU-MAIC/dsh-openmaic)

> **用途**：教师需在 DSH 会话解释抽象概念并让学生操作。

> **亮点**：[Q01](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md#research-q01) 提供课堂链接和会话中可操作的教学材料。

> **思考**：[Q03](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md#research-q03) 外部 API、浏览器资源和教学正确性应分别核对。

> **建议**：[Q05](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md#research-q05) 小型交互演示能减少备课切换并维持可复核性。

[查看完整分析](../../plugins/thu-maic--dsh-openmaic/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332212466-root"></a>

## [DSH OpenPencil](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md)

[![GitHub ★ 204](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=204&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-openpencil) [![npm 30d 2,827](https://img.shields.io/static/v1?label=npm+30d&message=2%2C827&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-openpencil) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-openpencil)

> **用途**：需要在DSH对话里生成并继续人工修改设计稿的团队，可以交付.op文档及对应预览。

> **亮点**：[Q01](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md#research-q01)、[Q02](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md#research-q02) 将可编辑画布、对话预览和owner隔离草稿串成可核查交付链，版本与预览绑定避免把旧截图当当前结果。尚不能证明设计任务质量或工时改善。

> **思考**：[Q02](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md#research-q02) exact代表渲染/文档一致，不代表设计符合需求；模型自审收到有界结构digest而非该通道的PNG像素，再finish可接受发布。结构gate和受控修正不能等同用户视觉验收。

> **建议**：[Q04](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md#research-q04) 可把brief中的可观察验收项绑定最终图像/节点，经独立审阅与当前digest自审做同预算对照，计误发布和人工修改；这项收益未验证。

[查看完整分析](../../plugins/zseven-w--dsh-openpencil/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422133477-root"></a>

## [DSH Qwen Studio](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md)

[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-qwen-studio)

> **用途**：已部署可用本地或自托管生图服务的 DSH 创作者，希望在对话中发起一张测试图，等候或切页后按任务取回结果。

> **亮点**：[Q01](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md#research-q01) 和 [Q02](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md#research-q02) 显示，会话生成、任务记录和成图附件可用同一 ID 回查，减少在工具之间搬运文件。

> **思考**：[Q03](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md#research-q03) 对话取消、提交回执丢失、本地终态和远端终态不同。能查本地 ID 的机制不足以证实上游没有继续执行。

> **建议**：[Q05](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md#research-q05) 通过提交、轮询和取消三个故障点比较同 ID 两端状态，可验证何时安全恢复和避免重复出图。

[查看完整分析](../../plugins/kingcharleslzy-ai--dsh-qwen-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1341430062-root"></a>

## [DSH Raw HTML](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md)

[![GitHub ★ 94](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/plolpl789/dsh-raw-html)

> **用途**：用户希望会话中的 HTML 成为可阅读卡片。

> **亮点**：[Q01](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md#research-q01) 整合 HTML 图表公式与风格约束。

> **思考**：[Q03](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md#research-q03) 可信模式及宿主 bundle 修改要求独立检验。

> **建议**：[Q05](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md#research-q05) 可减少外部预览切换。

[查看完整分析](../../plugins/plolpl789--dsh-raw-html/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1345883186-root"></a>

## [DSH Short Video Studio](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md)

[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fengyungithub/dsh-short-video-studio) [![npm 30d 4,437](https://img.shields.io/static/v1?label=npm+30d&message=4%2C437&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-short-video-studio) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-short-video-studio)

> **用途**：适合已维护 ComfyUI 并反复整理短镜头的创作者，见 [Q01](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q01)。

> **亮点**：用能力与档位组织已安装工作流，并关联会话画布及结果文件，见 [Q01](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q01) 与 [Q02](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q02)。

> **思考**：本地中断不能证明远端已停止。工具批准监听异常放行，HTTP 生成也有独立路径，见 [Q02](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q02) 与 [Q03](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q03)。

> **建议**：让任务先绑定后端 ID，重开时核对状态，测试能否避免重派生成，见 [Q05](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/fengyungithub--dsh-short-video-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1424114133-root"></a>

## [DSH to Figma](../../plugins/duoasa--dsh-to-figma/INSIGHT.md)

[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Duoasa/DSH-to-Figma)

> **用途**：dsh-to-figma0.4.0是原生DSH工具/Skill插件，另含CLI与Figma companion。目标是让Agent读取设计上下文并在目标文件产出设计师可继续编辑的原生图层/组件/布局，而非只给静态截图/建议。成功须目标文件与页面正确、结构/变量和视觉符合需求，截图可核且设计师接手成本合理，不是脚本返回节点ID。

> **亮点**：[Q01](../../plugins/duoasa--dsh-to-figma/INSIGHT.md#research-q01)、[Q02](../../plugins/duoasa--dsh-to-figma/INSIGHT.md#research-q02)本地可写原生画布、上下文/截图/资源与Work绑定、三后端分离和串行失败门禁，产物可继续编辑而非只给图。

> **思考**：[Q03](../../plugins/duoasa--dsh-to-figma/INSIGHT.md#research-q03)任意脚本开始后可部分变更、取消不撤执行，读取解除uncertain不等视觉验收；配对副本含token/同信任域，文档对不等页面对。[Q04](../../plugins/duoasa--dsh-to-figma/INSIGHT.md#research-q04)设计质量/平台条件与总成本仍需真实验收。

> **建议**：[Q05](../../plugins/duoasa--dsh-to-figma/INSIGHT.md#research-q05)提出未验证的目标/节点变量变更与视觉结构验收回执，用故障对照测错目标/重复和设计师返工，不把inspect当验收。

[查看完整分析](../../plugins/duoasa--dsh-to-figma/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1427791087-root"></a>

## [dsh-blend-preview](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md)

[![npm 30d 44](https://img.shields.io/static/v1?label=npm+30d&message=44&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blend-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blend-preview)

> **用途**：适合已有Blender环境、在DSH工作区反复检查静态几何和尺寸的人；纹理动画与最终渲染须回到Blender，旧包迁移需先核对。[Q01](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q01)

> **亮点**：相对手工导出GLB或切换Blender，增量是工作区文件触发、本地转换缓存与侧栏检查的一体流程；Blender导出和glTF本身不是本项目原创。[Q01](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q01)

> **思考**：缓存以大小和mtime识别版本，且查看器省略纹理动画；显示成功不等于当前内容或最终视觉验收成立。认证也不等同项目文件沙箱。[Q02](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q02) [Q04](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q04)

> **建议**：未验证假设是把内容新鲜度及表示缺口作为预览交付的一部分，以减少旧缓存和视觉误验；对照同元数据改写、纹理模型与Blender直接打开，若误验不降或复核更慢则否定。[Q05](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/439436269-ctrl--dsh-blend-preview/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334049596-root"></a>

## [dsh-blender](../../plugins/cheshirejcat--blender/INSIGHT.md)

[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/CheshireJCat/blender) [![npm 30d 5,667](https://img.shields.io/static/v1?label=npm+30d&message=5%2C667&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender)

> **用途**：面向已有 Blender 环境的 DSH 用户，将小型三维资产制作、场景检查和模型交接放进对话工具流程，保留可编辑 .blend、便携模型及预览证据。具体流程与合格结果见 [Q01](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q01)。

> **亮点**：插件把Blender操作、结构报告、导出回读和上游领域知识接到DSH，提供可调用的制作与诊断入口，这是宿主集成增量。回读虽独立启动进程，却没有显式清场或默认绑定新增对象，不能将其描述为空场景资产验收；建模算法和知识配方也不归为本插件原创。[Q01](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q01) [Q03](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q03)

> **思考**：最影响当前采用的是报告验证的对象是否真来自目标资产。导入没有清场，回读默认验证整个场景，初始网格在特定条件下可能掩盖资产未增加网格；该后果是源码推断，未复现。passed又仅表示profile没有硬错误，导出不依赖该报告；加上任意Python本机权限，当前不足以凭报告信任完整交付。[Q02](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q02) [Q03](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q03)

> **建议**：优先研究导入来源范围：记录并核对新增对象，验证只作用目标集合，拒绝空集合并绑定输入摘要/profile，避免把启动场景对象当目标资产。用无新增网格、仅非网格、正常网格对照误通过、误拒和人工核对量；若仍借用启动网格或正常资产损失抵消改善，应否定该方向。模型摘要和人工视觉交接应在来源范围明确后再研究，均未验证或实现。[Q05](../../plugins/cheshirejcat--blender/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/cheshirejcat--blender/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1388372309-integrations-deepseek-harness"></a>

## [dsh-brewreel](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md)

[![GitHub ★ 179](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=179&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Finderchangchang/brewreel) [![npm 30d 1,432](https://img.shields.io/static/v1?label=npm+30d&message=1%2C432&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-brewreel) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-brewreel)

> **用途**：需要从固定模板制作短竖版宣传片的开发者和内容人员。

> **亮点**：[Q01](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md#research-q01) 把分镜、渲染和可交付文件回执连接为宿主工具路径。

> **思考**：[Q02](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md#research-q02) 路径、环境和哈希约束有各自范围，成片仍需人审核。[Q03](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md#research-q03) 渲染依赖较重且有明确宿主边界。

> **建议**：[Q04](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md#research-q04) 标记最终产物来自当前渲染还是已有文件复核，检验能否减少错交。

[查看完整分析](../../plugins/finderchangchang--brewreel--integrations-deepseek-harness/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422396858-root"></a>

## [dsh-douyin-publish](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7gzgn/dsh-douyin-publish) [![npm 30d 1,677](https://img.shields.io/static/v1?label=npm+30d&message=1%2C677&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-douyin-publish) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-douyin-publish)

> **用途**：已有本地视频的创作者减少上传填表劳动，需人工核账号/素材/字段和平台受理。

> **亮点**：把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q01)与[Q02](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q02)。

> **思考**：cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q02)。

> **建议**：可探讨账号/素材/字段绑定和发布受理收据，逐次授权、页锁及unknown查询恢复，平台维护成本未验证。详见[Q05](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1377645668-root"></a>

## [dsh-game-material-master](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md)

[![GitHub ★ 142](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=142&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/universe-st/dsh-game-material-master) [![npm 30d 5,626](https://img.shields.io/static/v1?label=npm+30d&message=5%2C626&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-game-material-master) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-game-material-master)

> **用途**：小团队从参考图制作可导入游戏项目的资产并检查小地图。

> **亮点**：[Q01](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md#research-q01) 将图像任务、阶段状态与地图检查工具带到同一工作台。

> **思考**：[Q02](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md#research-q02) 外部生成和本地处理须分开看，地图版本检查也不保证并发原子性。

> **建议**：[Q03](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md#research-q03) 强制版本绑定并串行修改，比较协作编辑的丢更新与负担。

[查看完整分析](../../plugins/universe-st--dsh-game-material-master/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334554606-root"></a>

## [dsh-hyperframes](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md)

[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-hyperframes) [![npm 30d 12,879](https://img.shields.io/static/v1?label=npm+30d&message=12%2C879&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hyperframes) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hyperframes)

> **用途**：反复制作短标题卡或产品介绍的人，可从模板建立保留修订的可编辑工程。

> **亮点**：[Q01](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md#research-q01) 的工作台将编辑工程、准备环境、任务回执和 MP4 记录集中在 DSH。

> **思考**：[Q02](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md#research-q02) 的文件检查只到大小和 ftyp，出品仍需播放与修订复核。进程环境限制无法替代系统沙箱。

> **建议**：[Q03](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md#research-q03) 提出下载前显式展示导出修订并增加可选媒体探测，检验能否减少错交旧成片。

[查看完整分析](../../plugins/stardustlc666--dsh-hyperframes/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336998801-root"></a>

## [dsh-image-gen](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md)

[![GitHub ★ 1,178](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C178&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/dsh-image-gen) [![npm 30d 69,270](https://img.shields.io/static/v1?label=npm+30d&message=69%2C270&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image-gen)

> **用途**：在 DSH 写文章或准备项目材料的创作者，需要为一组已确定的主题逐张生成、验收和保存配图。

> **亮点**：[Q01](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md#research-q01) 与 [Q02](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md#research-q02) 确认有从多提示词到多附件的顺序工具入口，已配置渠道可把配图生成和会话呈现接在一起。

> **思考**：[Q03](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md#research-q03) 批量成功、附件存在和文件可读是不同条件。取消可能发生在外部生成或附件保存之后，重跑前需要核对已有成果和上游状态。

> **建议**：[Q05](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md#research-q05) 逐项记录供应商响应、附件和工作区状态可能减少整批重跑，需与故障注入对照。

[查看完整分析](../../plugins/shanliuling--dsh-image-gen/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1422216012-root"></a>

## [dsh-image2-plugin](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/544244857/dsh-image2-plugin) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image2-tool) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-image2-tool)

> **用途**：适合从对话生成草图或编辑非敏感图片并直接预览；已有图像应用时可用其原生历史、费用和内容控制。 详见[Q01](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q01)。

> **亮点**：工具、文件落盘和内联预览接通了会话交付；竞争力取决于中继模型/价格，而非协议兼容本身。 详见[Q03](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q03)。

> **思考**：下载 URL 不带 API key 是好边界，但 read_image 检查与重试预算主要靠提示文字，非强制运行时策略；中继隐私与内容政策未知。 详见[Q04](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q04)。

> **建议**：增加 per-request 预算、下载 allowlist 和结果 manifest（prompt、模型、费用、哈希），可把生成图从临时附件升级为可追溯产物。 详见[Q08](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1420747575-root"></a>

## [dsh-imagegen-video](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md)

[![GitHub ★ 90](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/q253595422/dsh-imagegen-video) [![npm 30d 8,815](https://img.shields.io/static/v1?label=npm+30d&message=8%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@q253595422/dsh-imagegen-video)

> **用途**：反复在 DSH 创作短片的用户可观察统一规划、提交、恢复和历史路径，成片仍需逐条验收。

> **亮点**：[Q01](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q01) 把镜头规划、渠道模型和任务历史接成同一工作流，[Q02](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q02) 保存远端 ID 供恢复轮询。

> **思考**：[Q02](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q02) 本地取消无法确认远端停止，pending 写入有异步窗口。[Q03](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q03) 同步帧函数不能由前置预算检查抢占。

> **建议**：[Q04](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md#research-q04) 远端操作账本与可终止的独立渲染进程分别接受故障验收，可能减少重复提交和宿主阻塞。

[查看完整分析](../../plugins/q253595422--dsh-imagegen-video/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lorebookmd)

> **用途**：面向已有Tavern/SillyTavern角色卡或世界书、希望在DSH中复用设定写小说或互动推演的用户。输入是自己提供的PNG/JSON和场景要求，输出是可查看的设定文档、可激活提示词以及模型生成的正文。插件不自带小说素材，也没有独立生成模型。

> **亮点**：将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q02)。

> **思考**：实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q03)、[Q04](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q04)。

> **建议**：可探索按会话绑定的版本化权威文档与预算注入收据，比较串用、遗漏、token和编辑传播；未实现。详见[Q06](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1426477683-root"></a>

## [dsh-markdown-live](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9426Haruka/dsh-markdown-live)

> **用途**：经常在 DSH 输入长 Markdown 的作者希望发送前看到标题、列表、引用和行内格式，同时提交原始文本不变；基线是纯文本输入后再看消息渲染。合格结果是输入、粘贴、中文 IME、撤销、光标和发送字节均正确，长草稿不阻塞，禁用后格式与监听清理。 详见[Q01](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q01)。

> **亮点**：相对纯文本 composer，它在不改变提交字符串的前提下提供接近 WYSIWYG 的输入反馈，并保留 mention/skill等非文本节点。贡献主要是 Lexical 适配与交互细节；表格、图片预览和代码语法高亮未覆盖，且依赖宿主内部节点结构。 详见[Q03](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q03)。

> **思考**：关键质疑是“显示层不改文本”能否在所有编辑操作成立。节点切分、格式位、软换行归一、IME 与粘贴互相作用可能造成光标跳动、撤销历史异常或隐藏标记误导；覆盖宿主 text renderer 的 priority 约定升级后可能失效。长文暂停也造成体验不一致。 详见[Q04](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q04)。

> **建议**：未验证假设是把“文本投影恒等”做成基于属性的编辑序列测试，可在宿主升级时自动发现光标/撤销/字节漂移。最小生成1000条含IME、粘贴、列表退格和围栏的操作序列，比较插件前后最终纯文本、selection与undo；任一字节差异即否定安全启用。 详见[Q08](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/9426haruka--dsh-markdown-live/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1399694663-root"></a>

## [dsh-media-studio](../../plugins/1497105876--dsh-media-studio/INSIGHT.md)



> **用途**：内容创作者需要生成媒体并在当前聊天审阅。

> **亮点**：[Q01](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q01) 将生成、保存和查看媒体接到同一会话。

> **思考**：[Q02](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q02) 后台可在无 jobId 时继续，结果送达和远端取消需独立核对，文件读取沿用宿主权限。

> **建议**：[Q03](../../plugins/1497105876--dsh-media-studio/INSIGHT.md#research-q03) 收费请求前要求可追踪任务或明确同步回退，测重复提交。

[查看完整分析](../../plugins/1497105876--dsh-media-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1397477851-root"></a>

## [dsh-mimotts](../../plugins/1497105876--dsh-mimotts/INSIGHT.md)



> **用途**：需要听取助手回复或为后续渠道制作语音文件。

> **亮点**：[Q01](../../plugins/1497105876--dsh-mimotts/INSIGHT.md#research-q01) 将回复朗读、播放与版本回听连接到 DSH 会话。

> **思考**：[Q02](../../plugins/1497105876--dsh-mimotts/INSIGHT.md#research-q02) 请求会传文本和配置的声音样本，历史索引并发写入与失败仍需核对。

> **建议**：[Q03](../../plugins/1497105876--dsh-mimotts/INSIGHT.md#research-q03) 让历史更新可串行提交，并区分上游成功和保存失败。

[查看完整分析](../../plugins/1497105876--dsh-mimotts/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366449702-root"></a>

## [dsh-novel-forge 小说锻炉](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huangziyuan-general/dsh-novel-forge) [![npm 30d 9,896](https://img.shields.io/static/v1?label=npm+30d&message=9%2C896&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-novel-forge) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-novel-forge)

> **用途**：连载作者可用一章样稿验证细纲、角色状态、章节冲突和版本回读。

> **亮点**：[Q01](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md#research-q01) 把细纲、账本和文本规则放在新版本前判定，拒绝原因可以独立核对。

> **思考**：[Q02](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md#research-q02) 人工与模型入口规则不同，[Q03](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md#research-q03) 正文和进度分开落盘，不能用一项成功确认全章。

> **建议**：[Q05](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md#research-q05) 为每次写章记录可回查提交状态，可能减少部分完成后盲目续跑。

[查看完整分析](../../plugins/huangziyuan-general--dsh-novel-forge/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339110580-root"></a>

## [dsh-oil-creator](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md)

[![GitHub ★ 207](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=207&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/oil-oil/dsh-oil-creator)

> **用途**：重复制作录屏短视频的创作者希望在一内容目录中跟进脚本、视频、字幕、封面与发布状态。原办法普通目录+剪辑软件+独立Skill；合格结果需材料可核、下一步明确且最终表达／发布由人确认。

> **亮点**：[Q01](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q01) 与 [Q02](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q02) 把开放本地文件、Desktop自有会话、Harness jobs和三图附件审查放进同一内容上下文，减少跨工具找材料的组织摩擦。上游媒体Skill与宿主会话能力不归插件原创，最终剪辑／视觉／发表仍人工负责。

> **思考**：[Q02](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q02) 文件存在驱动阶段不等质量，save review不核prepare/真实看图/图片版本，job killed不证进程树停止；[Q03](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q03) apply确认依赖调用方且整理回退非全事务，目录丢失还有作者明确宿主恢复失败。不能把片库完整性外观当无人值守内容验收。

> **建议**：[Q04](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md#research-q04)由附件与保存脱节推导三图digest+prepare receipt并在重生成后标stale，可能减少旧PASS沿用。四类复制素材对照陈旧通过、误阻断和复核投入；无改善或成本过高即否定，尚未实现不计贡献。

[查看完整分析](../../plugins/oil-oil--dsh-oil-creator/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333652151-root"></a>

## [dsh-pet 素材制作工程](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md)

[![GitHub ★ 5,847](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C847&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet)

> **用途**：[Q01](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q01) 为 DSH 桌宠新角色或新增动作制作片段，需核对连续片段的透明、站姿和脚底。

> **亮点**：[Q01](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q01) 与 [Q02](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q02) 把两类输入、可复用站姿归一化与编码串起，减少重复手工步骤的实际人时待测。

> **思考**：[Q03](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q03) 的抽帧失败会计入 OK，workflow 只取样且打印流信息。发布可用性和目标端透明播放需独立验收。

> **建议**：[Q05](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md#research-q05) 假设对抽帧失败拒绝发布，并结合多帧、对齐和目标播放复核，可降低漏检。对照当前单帧规则，计入误拒和复核成本。

[查看完整分析](../../plugins/pc2005-cloud--dsh-pet/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-translation)

> **用途**：长文及技术翻译用户需要一致术语和形式核查，合格译文仍以独立语义正确为准。详见[Q01](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q01)。

> **亮点**：把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q01)。

> **思考**：quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q03)。

> **建议**：可研究规则命中位置与独立语义验收分层，以及确认译对的来源/失效关系，以否定翻反等固定反例比较错误放行。当前未验证。详见[Q05](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1157659618-plugins-dsh-postiz"></a>

## [dsh-postiz](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md)

[![GitHub ★ 562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gitroomhq/postiz-agent) [![npm 30d 1,009](https://img.shields.io/static/v1?label=npm+30d&message=1%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz)

> **用途**：需要在 DSH 中准备和排期多渠道内容的社媒运营者。

> **亮点**：[Q02](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md#research-q02) 将连接配置和平台工作流整合进 DSH。

> **思考**：[Q03](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md#research-q03) skill 中的授权与草稿指示不是插件内强制执行。

> **建议**：[Q05](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md#research-q05) 在已有草稿和列表外对照提交前明细，验证误发布和重复率。

[查看完整分析](../../plugins/gitroomhq--postiz-agent--plugins-dsh-postiz/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335302697-root"></a>

## [dsh-ppt](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-ppt) [![npm 30d 29,827](https://img.shields.io/static/v1?label=npm+30d&message=29%2C827&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ppt) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ppt)

> **用途**：需要在 DSH 会话中把周报、方案或答辩材料交付为可放映网页与可编辑演示。

> **亮点**：[Q01](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q01) 以工程快照生成浏览器和 Office 两种交付。[Q02](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q02) 用修订、哈希和另存限制误覆盖。

> **思考**：[Q02](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q02) 外部编辑无法合并回 JSON，逐文件提交的失败恢复也有边界。[Q03](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q03) 实际版式受渲染器和字体影响。[Q04](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q04) 分享包保留绑定摘录。

> **建议**：[Q04](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md#research-q04) 在下载前列出各文件携带的来源摘录并允许选择移除项，检验是否减少误发和返工。

[查看完整分析](../../plugins/stardustlc666--dsh-ppt/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)



> **用途**：面向把 MIDI/SoundFont 音乐移植进 Minecraft 的创作者。输入是 MIDI、SF2、速度、采样和世界参数；合格结果是 WAV、事件/车道计划与 mcfunction 数据包在 tick 和声部预算内完整播放。替代是手写命令或分别使用 DAW、脚本和 RCON。

> **亮点**：它把成熟的 MIDI、SoundFont 与 Minecraft 命令收束成带陷阱提示和中间工件的 DSH 流水线。独立增量是领域约束编排，不是新合成器；相对手写命令减少音符到 tick、样本和 lane 的重复转换。 参见[Q03](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q03)。

> **思考**：生成成功不等于听感正确：tick 量化、lane 和同 tick 命令预算会改变密集段，SoundFont onset 与游戏衰减会改变音色。RCON 又扩大为服务器写操作，reload 失败可能留下半部署。 参见[Q04](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q04)。

> **建议**：增加听感预算门，计算 onset 偏差、丢弃音符、同 tick 峰值和声部覆盖，超阈值拒绝部署。若指标不能预测盲听缺陷则否定。 参见[Q08](../../plugins/19north--dsh-redstone-music/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/19north--dsh-redstone-music/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1334554520-root"></a>

## [dsh-remotion](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md)

[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/STARDUSTLC666/dsh-remotion) [![npm 30d 14,086](https://img.shields.io/static/v1?label=npm+30d&message=14%2C086&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remotion) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remotion)

> **用途**：想用公开素材制作短片的 DSH 用户需要可保存修订、预览和输出。

> **亮点**：[Q01](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q01) 将短片模板与实际 Remotion 预览、导出串联。[Q02](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q02) 任务绑定保存修订并隔离生成目录。

> **思考**：[Q03](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q03) 准备环境涉及下载与本机进程，Range 仍读整份视频。[Q02](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q02) 取消回执不能直接证明所有子进程及缓存已清理。

> **建议**：[Q04](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md#research-q04) 绑定修订、素材、环境和成品验收记录，测试能否减少错版交付。

[查看完整分析](../../plugins/stardustlc666--dsh-remotion/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1332051085-root"></a>

## [dsh-share](../../plugins/hellodigua--dsh-share/INSIGHT.md)

[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellodigua/dsh-share) [![npm 30d 2,310](https://img.shields.io/static/v1?label=npm+30d&message=2%2C310&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-share) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-share)

> **用途**：需要定期向同事转交会话证据的 DSH Web 用户，希望把多轮不连续问答整理成一个可读附件。[Q01](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q01)

> **亮点**：将可选择的问答快照、顺序、间隔提示和三个文件格式接入宿主界面，减少人工组装。[Q01](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q01) [Q03](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q03)

> **思考**：隐藏过程按结构标记过滤。内容和文件名可能含敏感信息，生成 HTML 还可能请求消息图片 URL。导出或转发的副本需要在目的地处理。[Q02](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q02) [Q04](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q04)

> **建议**：对比可确认的导出清单与现有操作，测错误披露、误删和人工时间。如果无净改善即放弃。[Q05](../../plugins/hellodigua--dsh-share/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/hellodigua--dsh-share/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1418769012-root"></a>

## [dsh-sticker-pack](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/5V1A-afk/dsh-sticker-pack)

> **用途**：对话中适度用合适表情图的偏好便利，以目标端真实显示/收到和可接受等待验收；图片数、id、路径和Markdown不是交付。见[Q01](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q01)。

> **亮点**：把远端图册、宿主coin/工具和HTTP/本地路径组合成可用选图入口；具体增量是资源供给与正常caller下的概率门禁，不是硬输出频率、已发送或已验证语义推荐。见[Q02](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q02)。

> **思考**：非POST查询可写设置且本组件无准入；15秒只清单race不含后续懒图，gif与.gif字段不匹配，.wechat只是原字节副本/发送提示。源更新/撤图也不等缓存同步，源码条件未冒充实机失败，见[Q02](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q02)、[Q03](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q03)。

> **建议**：先修准入/字段/总预算与缓存语义，再验证最小可显示主图和目标端结果反馈是否胜过预热/手工图/纯文本；只有真实展示、偏好和延迟净改善才提炼方向，不先建跨渠道平台。未实现/验证，见[Q05](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1427978231-root"></a>

## [dsh-stl-preview](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md)

[![npm 30d 45](https://img.shields.io/static/v1?label=npm+30d&message=45&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stl-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-stl-preview)

> **用途**：适合在DSH内做STL打印前几何初筛的人；尺寸依赖明确单位，最终制造与切片仍需专业工具。[Q01](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q01)

> **亮点**：相对切片器直开或普通3D查看器，增量是工作区内的STL解析、几何测量与边拓扑初筛；三角网格公式属于标准机制，未证明打印成功率提升。[Q01](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q01)

> **思考**：无向边计数及容差焊接不足以排除自交、反向面和制造问题；Host分块传输仍对应浏览器全量缓冲，不能据此承诺大网格低内存。[Q02](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q02) [Q03](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q03)

> **建议**：未验证假设是显式标注单位与算法覆盖，并将统计移入可取消worker，减少误验及界面阻塞；对照自交/单位错误/大网格任务，若误判或总成本不改善则否定。[Q05](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/439436269-ctrl--dsh-stl-preview/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1335599084-root"></a>

## [dsh-tavern](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md)

[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chen731215-dev/dsh-tavern) [![npm 30d 10,619](https://img.shields.io/static/v1?label=npm+30d&message=10%2C619&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern)

> **用途**：在 DSH 写连载故事的用户，需要跨会话保持角色设定和世界规则，并可核对历史。

> **亮点**：[Q01](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q01) 提供按会话装配角色与世界书的入口，并支持关键词条件减少无关词条。[Q02](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q02) 的总结和关系记录可辅助续写，需另确认会话与外发范围。

> **思考**：[Q02](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q02) 的自动总结跨异步使用可变会话状态，[Q03](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q03) 的主动编辑会重写宿主历史且备份失败后仍写入。真实项目采用前应分别验证。

> **建议**：[Q04](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md#research-q04) 提出显示本轮词条、触发词和会话来源，与当前配置比较提示长度、错配和排障成本。

[查看完整分析](../../plugins/chen731215-dev--dsh-tavern/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1204369117-packages-dsh-tongflow"></a>

## [dsh-tongflow](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md)

[![GitHub ★ 1,049](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C049&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow) [![npm 30d 1,981](https://img.shields.io/static/v1?label=npm+30d&message=1%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow)

> **用途**：在 DSH 中组织多模态项目和生成流程的用户；基线是普通聊天或自行切换 Studio。[Q01](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md#research-q01)

> **亮点**：为 Studio 注入适配宿主服务、技能与界面，不等同 TongFlow 根执行引擎。[Q01](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md#research-q01)

> **思考**：异步初始化可能失败；付费确认仅为作者声明，未核验依赖实现。[Q03](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md#research-q03)

> **建议**：未验证假设：共享 Host 激活状态可降低 UI 和工具状态不一致，需对照恢复与延迟场景。[Q05](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tong-io--tongflow--packages-dsh-tongflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1327795364-packages-dsh-tool-markdown"></a>

## [dsh-tool-markdown](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md)

[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)

> **用途**：撰写技术笔记的人可把公开页面片段转成可编辑的 Markdown、表格或目录草案。

> **亮点**：[Q01](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md#research-q01) 确认四种常用文档动作直接在会话执行，输出可核对的文本。

> **思考**：[Q02](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md#research-q02) 的基址拼接、协议相对链接和围栏状态会改变链接或目录，发布前需要独立复核。

> **建议**：[Q03](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md#research-q03) 提出按标准解析基址并分开判定跨站策略，用固定链接样本验证是否减少错误。

[查看完整分析](../../plugins/omdsh-dev--dsh-toolkit--packages-dsh-tool-markdown/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1414936636-root"></a>

## [dsh-video-pipeline](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/439436269-ctrl/dsh-video-pipeline)

> **用途**：已有短视频/AI 短剧素材生产需求，希望把多工具环节、质量门与发布回写串成可发现技能。

> **亮点**：把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q01)、[Q02](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q02)。

> **思考**：环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q03)。

> **建议**：采用秘密引用/受控工具而非正文替换，并维护平台版本/费用/发布门端到端回归，可降低迁移风险；现版未实现。详见[Q04](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1333755444-root"></a>

## [dsh-vision](../../plugins/oil-oil--dsh-vision/INSIGHT.md)

[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/oil-oil/dsh-vision)

> **用途**：希望保留文本主模型同时处理少量图片的DSH用户。

> **亮点**：[Q01](../../plugins/oil-oil--dsh-vision/INSIGHT.md#research-q01) 保留主模型并提供附件观察路径。

> **思考**：[Q02](../../plugins/oil-oil--dsh-vision/INSIGHT.md#research-q02) 观察替代原图有损，pending共享取消及system注入需验。

> **建议**：[Q03](../../plugins/oil-oil--dsh-vision/INSIGHT.md#research-q03) 对照两阶段错误、费用与延迟。

[查看完整分析](../../plugins/oil-oil--dsh-vision/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-media)

> **用途**：对本地音视频、PDF 和图像执行常见探测或转换。

> **亮点**：把多种本地转换及探测带入同一代理工作流，产物可回指原路径。[Q01](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q01) [Q02](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q02)

> **思考**：默认范围较广，新目标没有解析祖先链接，ffmpeg 允许覆盖；失败也可能留下输出。[Q03](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q03)

> **建议**：窄路径与无覆盖临时交接可降低原件风险，用相同故障夹具验证。尚未验证。[Q04](../../plugins/173787247--dsh-wsl-media/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/173787247--dsh-wsl-media/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1427300390-root"></a>

## [dsh-zh-ui](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md)



> **用途**：使用 DSH 生成或审查中文 Web 界面的设计与前端团队可用它将中文排版设计 Skill、项目 DESIGN.md/token 注入和 HTML/CSS/组件源码静态检查组合到 DSH；合格结果是设计方向与项目 token 被正确带入任务，静态检查定位中文排版和样式问题，并由渲染审查补足视觉结论。详见[Q01](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q01)。

> **亮点**：把中文设计知识、项目级约束和可执行静态规则连成同一工作流，并明确静态与渲染边界。它相对“单独维护设计提示词、手工加载项目规范，再用通用 lint 与截图人工检查”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q03)。

> **思考**：CSS 解析基于正则且不渲染，无法判断真实对比度、字号、布局、字体加载和交互可用性。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q04)。

> **建议**：未来可探索：可让静态 finding 生成最小渲染探针和截图检查计划，把规则违规与实际视觉影响分层验证。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md#research-q08)。

[查看完整分析](../../plugins/1186258278--dsh-zh-ui/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1369398336-packages-dsh-knowledge-studio"></a>

## [EduWork Knowledge Studio](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md)

[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 2,243](https://img.shields.io/static/v1?label=npm+30d&message=2%2C243&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-knowledge-studio)

> **用途**：教师或培训资料维护者可在兼容 DSH 工作区，用允许发送给模型的资料制作并审核测验或卡片草稿。

> **亮点**：[Q01](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md#research-q01) 与 [Q02](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md#research-q02) 显示工作区资料、模型生成、来源快照和学习交互连成同会话的成果流程；共享能力属于配套服务，未证明净节时。

> **思考**：[Q03](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md#research-q03) 显示题目校验只检查结构和引用 ID，索引型 fresh 不重读文件；用户仍须核对活源与每个答案，不能把标记当事实保证。

> **建议**：[Q06](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md#research-q06) 提出把实时源比对和教师逐题确认绑定成果版本的未验证假设，需与普通人工审校对照成本与误通过率。

[查看完整分析](../../plugins/ecnu--eduwork--packages-dsh-knowledge-studio/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1205593265-root"></a>

## [ff-toolkit](../../plugins/inthepond--ff-toolkit/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/inthepond/ff-toolkit)

> **用途**：需要将媒体处理接入 Agent 或 Python 流水线的开发者。

> **亮点**：[Q01](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q01) 和 [Q02](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q02) 提供统一操作和宿主桥接；编码能力由 FFmpeg 提供。

> **思考**：[Q03](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q03) 默认覆盖已存在输出，concat 清单可能残留；[Q04](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q04) 取消和恢复未验。

> **建议**：[Q05](../../plugins/inthepond--ff-toolkit/INSIGHT.md#research-q05) 假设显式覆盖确认和清理临时清单能减少损失，需实测。

[查看完整分析](../../plugins/inthepond--ff-toolkit/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andiii208/gzhflow)

> **用途**：面向经常用Agent写微信公众号内容、希望保留素材/文风并减少排版和推草稿重复操作的个人作者。输入为主题、用户真实素材和风格/主题配置，输出从Markdown到排版HTML、图片和公众号草稿，再复盘回写个人知识库。它不是无人值守新闻真实性系统，也不直接完成读者可见的最终发布。

> **亮点**：结合可替换风格/主题、静态脚本门、LLM清单与人工停靠点，并以七工具和一个bundled Skill接入DSH，减少重复流程说明；方法借鉴归属以NOTICE作者说明为界。详见[Q02](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q02)。

> **思考**：reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q03)。

> **建议**：可探索按产物hash绑定质检/审阅、按attempt保存图生/上传/草稿远端ID收据，比较错版/重复与恢复人工；未实现。详见[Q06](../../plugins/andiii208--gzhflow/INSIGHT.md#research-q06)。

[查看完整分析](../../plugins/andiii208--gzhflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1237969184-root"></a>

## [HTML Studio](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md)

[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/louisecxqiu-glitch/html-doc-center)

> **用途**：经常处理多个生成文档的维护者可在一个工作区查看和编辑。

> **亮点**：文件树和版本恢复同处一套入口，可在恢复前创建当前版本备份。见 [Q01](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md#research-q01)、[Q02](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md#research-q02)。

> **思考**：另存处理没有普通保存的扫描根检查，备份失败也不总阻止覆盖。见 [Q02](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md#research-q02)。

> **建议**：用无敏感文档比较恢复哈希、时间和误写，覆盖备份失败。见 [Q04](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/louisecxqiu-glitch--html-doc-center/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1139128402-root"></a>

## [humanizer-ru](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md)

[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vladimir-Human/humanizer-ru)

> **用途**：[Q01](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q01) 能读俄语的作者/编辑希望把生成稿改成符合自身体裁和文风的文字，合格结果须保留事实与作者观点。

> **亮点**：[Q01](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q01)、[Q02](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q02) 将俄语文风规则与数字、归属、模态守恒流程结合，提供errors/checks两层复核和可回退粘贴清理，而非仅删模板词。

> **思考**：[Q02](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q02) exit0只表示未发现规则errors，checks仍需人读；模型提示不保证语义不变，单一bak非历史，作者小样本模型裁判不能外推当前版本真实编辑效果。

> **建议**：[Q03](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md#research-q03) 未验证锚点审阅视图对照已有锚点/checks，测否定、归属与模态漏判和审阅时间；无改善或负担增加即否定。

[查看完整分析](../../plugins/vladimir-human--humanizer-ru/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1345649791-root"></a>

## [Jacky Creator](../../plugins/jackywxsz--dsh-creator/INSIGHT.md)

[![GitHub ★ 125](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=125&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jackywxsz/DSH-Creator) [![npm 30d 1,510](https://img.shields.io/static/v1?label=npm+30d&message=1%2C510&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/jacky-creator) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/jacky-creator)

> **用途**：希望用 Agent 操作本地创作目录的个人创作者。

> **亮点**：[Q01](../../plugins/jackywxsz--dsh-creator/INSIGHT.md#research-q01) 把目录结构和运营操作接到同一 DSH 工作流。

> **思考**：[Q02](../../plugins/jackywxsz--dsh-creator/INSIGHT.md#research-q02) 配置确认和图片预览都需要额外验证宿主权限边界。

> **建议**：[Q04](../../plugins/jackywxsz--dsh-creator/INSIGHT.md#research-q04) 预览按实际路径和短期权限约束可阻止越界读取。

[查看完整分析](../../plugins/jackywxsz--dsh-creator/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1225248471-root"></a>

## [lightroom-py](../../plugins/drshy-org--lightroom-py/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drshy-org/lightroom-py)

> **用途**：希望用 Agent 组织 Lightroom Classic 图库和批处理编辑的摄影用户。

> **亮点**：[Q01](../../plugins/drshy-org--lightroom-py/INSIGHT.md#research-q01) 与 [Q02](../../plugins/drshy-org--lightroom-py/INSIGHT.md#research-q02) 将已有 Lightroom 操作暴露为 MCP 工具，并由 DSH 纯配置挂载。

> **思考**：[Q03](../../plugins/drshy-org--lightroom-py/INSIGHT.md#research-q03) MCP 可选依赖和默认桥接路径须核对，写操作可能修改真实图库。

> **建议**：[Q04](../../plugins/drshy-org--lightroom-py/INSIGHT.md#research-q04) 假设写前绑定目标与确认可减少误改，尚未验证。

[查看完整分析](../../plugins/drshy-org--lightroom-py/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1200521020-root"></a>

## [MuseAI](../../plugins/yejiming--museai/INSIGHT.md)

[![GitHub ★ 682](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=682&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yejiming/MuseAI)

> **用途**：希望长期整理角色卡、世界观和对话的角色互动与文字冒险用户。

> **亮点**：[Q01](../../plugins/yejiming--museai/INSIGHT.md#research-q01) 和 [Q02](../../plugins/yejiming--museai/INSIGHT.md#research-q02) 显示角色资料与人工确认归档结合；长期质量未对照。

> **思考**：[Q03](../../plugins/yejiming--museai/INSIGHT.md#research-q03) 显示公开 LAN 状态返回含 token 的结构；[Q02](../../plugins/yejiming--museai/INSIGHT.md#research-q02) 归档多步写入无显式回滚。

> **建议**：[Q05](../../plugins/yejiming--museai/INSIGHT.md#research-q05) 提出隐藏公开状态凭据及协调归档恢复，需测试配对与故障。

[查看完整分析](../../plugins/yejiming--museai/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-953521037-packages-dsh-plugin"></a>

## [Next AI Draw.io DSH](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md)

[![GitHub ★ 36,815](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C815&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DayuanJiang/next-ai-draw-io) [![npm 30d 925](https://img.shields.io/static/v1?label=npm+30d&message=925&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@next-ai-drawio/dsh) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@next-ai-drawio/dsh)

> **用途**：在 DSH 讨论架构或流程的开发者，可让模型起草 draw.io 图，在同一画布手动修订并导出。

> **亮点**：把模型工具和可编辑画布接到 DSH 对话，同提交服务检查过期编辑并保留部分冲突版本。相对手工接入，同一侧栏便于继续编辑。见 [Q01](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md#research-q01) 与 [Q02](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md#research-q02)。

> **思考**：子包固定版本仍会解析 @latest。图已更新、图与历史已落盘、导出含最新手工内容分别有不同结果。见 [Q01](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md#research-q01) 与 [Q03](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md#research-q03)。

> **建议**：给画布版本、磁盘保存和实际导出各留一条可回读结果，可能减少漏改图被当成合格交付。以故障注入和重开文件验证。见 [Q05](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/dayuanjiang--next-ai-draw-io--packages-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1366204745-root"></a>

## [NextTavern](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md)

[![GitHub ★ 224](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=224&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/a86582751/dsh-nexttavern) [![npm 30d 1,937](https://img.shields.io/static/v1?label=npm+30d&message=1%2C937&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nexttavern) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nexttavern)

> **用途**：需要把角色扮演会话整理成可读稿件的玩家可以评估分支导出。

> **亮点**：[Q01](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md#research-q01) 让分支故事可进入原文或模型整理的导出任务，避免逐段搬运。

> **思考**：[Q03](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md#research-q03) 固定树版本与 README 发行线不同，稿件不能替代会话备份。

> **建议**：[Q05](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md#research-q05) 给整理稿增加来源定位，验证作者能否更快核对事实。

[查看完整分析](../../plugins/a86582751--dsh-nexttavern/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1418493685-root"></a>

## [No AI Style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01NGVI-QINGYI/no-ai-style)

> **用途**：要审校学术或专业文字的人可先选择允许的操作模式。

> **亮点**：[Q01](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q01) 让编辑范围和事实约束更明确。

> **思考**：[Q03](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q03) 提示词不能强制保证模型保持事实。

> **建议**：[Q05](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q05) 对照只检查模式的越权改写率。

[查看完整分析](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1182135360-root"></a>

## [Notes](../../plugins/zhaoolee--notes/INSIGHT.md)

[![GitHub ★ 324](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=324&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes)

> **用途**：个人内容作者用 Markdown 编辑便签并生成分享材料。

> **亮点**：[Q01](../../plugins/zhaoolee--notes/INSIGHT.md#research-q01) 与 [Q03](../../plugins/zhaoolee--notes/INSIGHT.md#research-q03) 将编辑、主题截图和网站包组织在一个应用中；效果未对照。

> **思考**：[Q02](../../plugins/zhaoolee--notes/INSIGHT.md#research-q02) Web 写入未带服务端可选版本，整工作区并发保存可能覆盖。

> **建议**：[Q05](../../plugins/zhaoolee--notes/INSIGHT.md#research-q05) 假设客户端强制前置版本并保留冲突副本能降低无提示丢稿，尚未验证。

[查看完整分析](../../plugins/zhaoolee--notes/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1339737707-root"></a>

## [Oh Story DSH](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md)

[![GitHub ★ 665](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=665&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zenstory-ai/oh-story-dsh)

> **用途**：已有DSH和文件创作习惯的作者，可在会话旁编辑项目、运行随包上游Skill并查看产物。

> **亮点**：[Q01](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md#research-q01) 与 [Q02](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md#research-q02) 支持把上游资源接入原生服务，并以版本条件保存和冲突交互连接人工/Agent写入；未将上游内容或宿主原子写计作本插件原创。

> **思考**：[Q03](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md#research-q03) 核实任务板成功只代表发现关联输出，生产工具不构成付费确认；脚本虽有精确内容闸门和句柄恢复，仍不能独立证明人类授权、供应商状态或最终质量。

> **建议**：[Q05](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md#research-q05) 提议把已有run/fingerprint/句柄与任务板投影并列，帮助区分有文件、可收集、输入过时和已验收；先排查同等能力，若错误决策或追查成本不降就否定。

[查看完整分析](../../plugins/zenstory-ai--oh-story-dsh/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1159938129-root"></a>

## [OpenPencil](../../plugins/zseven-w--openpencil/INSIGHT.md)

[![GitHub ★ 7,134](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C134&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/openpencil)

> **用途**：需要将生成的界面稿继续交给设计者修改节点的团队，可在可销毁的 .op 副本里试用本机 MCP。交付要能重新打开、修改并核对所选节点。[Q01](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q01)

> **亮点**：[Q01](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q01) [Q02](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q02) 的增量是将 MCP 调用接到编辑器节点命令和可重新打开的 .op 文档。导出代码走独立工具，DSH 配置项指向 HTTP MCP 客户端。

> **思考**：[Q03](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q03) 保存报错前内存可能已修改，单个进程的文档修订记录也无法证明多个进程之间有协调。文件路径参数允许另开文档，启动时选定副本本身不能限制进程可访问的文件范围。

> **建议**：[Q05](../../plugins/zseven-w--openpencil/INSIGHT.md#research-q05) 先在副本应用命令，再用文件协调和预期摘要提交，可能减少失败后的内存与文件分歧和并行覆盖。以有意触发的写入失败和双客户端争用对照验证。

[查看完整分析](../../plugins/zseven-w--openpencil/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1197966970-root"></a>

## [OpenStory](../../plugins/zju-llms--openstory/INSIGHT.md)

[![GitHub ★ 436](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=436&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZJU-LLMs/OpenStory)

> **用途**：面向创作者与多Agent研究者生成并推进角色/地点/规则组成的故事世界；根是独立框架。

> **亮点**：[Q02](../../plugins/zju-llms--openstory/INSIGHT.md#research-q02) 把结构化世界产物与多角色状态循环组合成可继续探索的交互流程，而非只生成一篇文本。

> **思考**：[Q03](../../plugins/zju-llms--openstory/INSIGHT.md#research-q03) 单角色计划异常只记日志，tick完成不等于每个角色成功；schema/生成状态也不证明叙事质量或模拟有效。

> **建议**：[Q04](../../plugins/zju-llms--openstory/INSIGHT.md#research-q04) 推导逐角色回合健康回执与推进门禁的未验证策略；同预算测无声失步、剧情可继续率和修复成本，频繁阻塞却不改善则推翻。

[查看完整分析](../../plugins/zju-llms--openstory/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1171186947-root"></a>

## [OpenWrite](../../plugins/lipu-jpg--openwrite/INSIGHT.md)

[![GitHub ★ 948](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=948&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiPu-jpg/Openwrite) [![npm 30d 9,011](https://img.shields.io/static/v1?label=npm+30d&message=9%2C011&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite)

> **用途**：长篇作者希望在 DSH 管理稿件、资料和审稿任务，并能独立复核单章修订。

> **亮点**：[Q01](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q01) 把作品、原会话和写作 Core 连入同一宿主，[Q02](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q02) 按固定产物管理本地运行环境。

> **思考**：[Q02](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q02) 运行环境恢复与 [Q03](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q03) 的稿件、任务和模型状态需要分别核对。

> **建议**：[Q03](../../plugins/lipu-jpg--openwrite/INSIGHT.md#research-q03) 测试只读恢复预览能否降低盲目重试，对照现有任务和版本页。

[查看完整分析](../../plugins/lipu-jpg--openwrite/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-113965016-root"></a>

## [PicGo](../../plugins/molunerfinn--picgo/INSIGHT.md)

[![GitHub ★ 27,409](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=27%2C409&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Molunerfinn/PicGo)

> **用途**：面向写博客、文档和笔记的创作者，将本地或剪贴板图片上传到已配置图床并返回可粘贴链接。该仓库是 Electron 桌面客户端，DSH 插件是 README 另行指向的独立项目，不能把两者的能力或验收合并。

> **亮点**：相对浏览器逐次上传和复制链接，桌面入口把配置复用、上传上下文与链接交接集中到创作流程。源码中每次任务捕获调用窗口和 uploader 配置，再通过 PicGo Core 上传，避免全局配置切换造成相册归属混淆。上传协议和图床扩展主要来自独立 picgo 核心依赖，本仓库贡献是桌面编排与任务隔离。[Q02](../../plugins/molunerfinn--picgo/INSIGHT.md#research-q02)

> **思考**：收到 imgUrl 仅证明核心返回了链接，不证明链接在发布环境可访问、权限合适或长期有效；本层还会过滤没有 imgUrl 的项，不能把非空结果视为整批全部成功。创作交付需要逐项检查实际可读性，失败重试还要考虑重复远端对象。这里未做上传实验，不把边界写成已复现事故。[Q03](../../plugins/molunerfinn--picgo/INSIGHT.md#research-q03)

> **建议**：未验证假设是给每次上传保存本地输入摘要、目标配置 ID、远端返回和独立可读性检查的结果清单，将“已上传”与“发布可读”分开。由配置快照与 URL 过滤边界推导；对10组混合成功/失败图片，对比仅返回 URL 和清单复核的漏图、重复上传、人工修正时间。若多余检查延迟超过节省或错误访问了私密对象，应停止。[Q05](../../plugins/molunerfinn--picgo/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/molunerfinn--picgo/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-149085734-root"></a>

## [PicGo-Core](../../plugins/picgo--picgo-core/INSIGHT.md)

[![GitHub ★ 992](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=992&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PicGo/PicGo-Core) [![npm 30d 3,192](https://img.shields.io/static/v1?label=npm+30d&message=3%2C192&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picgo) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picgo)

> **用途**：供持续写文档与Markdown的用户，把本地或剪贴板图片转成可引用URL。

> **亮点**：把路径与剪贴板输入、图床目标配置和URL输出组成可嵌入编辑器与脚本的上传管道，贡献在流程集成而非新存储算法。[Q01](../../plugins/picgo--picgo-core/INSIGHT.md#research-q01)

> **思考**：GitHub uploader把422直接按重名生成链接，未核对远端内容；普通生命周期捕获后返回也不代表整批全部成功，发布调用方必须逐项核验。[Q02](../../plugins/picgo--picgo-core/INSIGHT.md#research-q02)

> **建议**：为每资产绑定内容摘要与远端标识，在重复提交前对账，同摘要复用、不同摘要报冲突；用同名差异与中断批次检验误链接和处理成本，尚未验证。[Q04](../../plugins/picgo--picgo-core/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/picgo--picgo-core/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1294612352-root"></a>

## [PPT Design Skill](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md)

[![GitHub ★ 399](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=399&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sunchaokun/PPT-Design-Skill)

> **用途**：为愿确认方向并验收稿件的演示作者，把brief、逐页规划、生成和PNG返工组织成可交付流程。见[Q01](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q01)。

> **亮点**：方向/主题/双门返工和清旧渲染/状态记录增强可复核过程，非自动视觉评分或新PPT渲染算法。见[Q02](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q02)、[Q03](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q03)。

> **思考**：默认安装把skill内容直接复制，但validator仍repo/skill路径假设，安装后schema找错；pip/import检测不保证render/版本，PASS记录非视觉/用户确认。见[Q02](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q02)、[Q03](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q03)。

> **建议**：未验证方向在现trace上绑定当前build/主题/字体/实际产物摘要与验收失效，测陈旧误交付/返工，先修路径；见[Q05](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md#research-q05)。

[查看完整分析](../../plugins/sunchaokun--ppt-design-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1139329853-root"></a>

## [Superdesign Skill](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md)

[![GitHub ★ 904](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=904&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/superdesigndev/superdesign-skill)

> **用途**：面向在已有代码库持续迭代UI与视觉草稿的开发者和设计者。

> **亮点**：把现状、设计系统、目标草稿和预算化上下文接到可继续的设计流程，贡献在方法与包装，不能算外部设计模型原创。[Q01](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md#research-q01) [Q02](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md#research-q02)

> **思考**：缓存路径检查与上传限制是文本协议，未见本仓库强制验证器；CLI和云端实现不在此处，不能把要求写成已实现隔离或效果保证。[Q02](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md#research-q02)

> **建议**：比较依赖感知的定向刷新与全量发现，检查共享视觉依赖变化时陈旧草稿和人工修正；先核对现有规则，尚未验证。[Q04](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/superdesigndev--superdesign-skill/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1308599537-host-adapters-dsh-plugin"></a>

## [TavernWeave X DSH](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md)

[![GitHub ★ 201](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=201&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiarMTTT/TavernWeave)

> **用途**：DSH用户维护SillyTavern角色卡、世界书和前端资料。

> **亮点**：[Q01](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md#research-q01)以同包资源基址、前门路由、preset和面板减少多处安装维护。

> **思考**：[Q02](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md#research-q02)备份/atomic不防旧读覆盖且根非会话绑定；[Q03](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md#research-q03)静态MVU不是运行验证，未挂接函数不算能力。

> **建议**：[Q04](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md#research-q04)save绑定读hash/选根generation可探索，对照现有备份/单窗口，误拒负担抵消即否定。

[查看完整分析](../../plugins/liarmttt--tavernweave--host-adapters-dsh-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1204369117-root"></a>

## [TongFlow](../../plugins/tong-io--tongflow/INSIGHT.md)

[![GitHub ★ 1,049](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C049&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow)

> **用途**：制作多阶段媒体的创作者；基线是分别调用供应商并手工传递素材。[Q01](../../plugins/tong-io--tongflow/INSIGHT.md#research-q01)

> **亮点**：组织多模态素材与统一执行接口；DSH 接入属于独立子组件。[Q01](../../plugins/tong-io--tongflow/INSIGHT.md#research-q01) [Q02](../../plugins/tong-io--tongflow/INSIGHT.md#research-q02)

> **思考**：slot 可映射不保证外部供应商成功、费用或幂等；未知结果需对账。[Q03](../../plugins/tong-io--tongflow/INSIGHT.md#research-q03)

> **建议**：未验证假设：展示节点供应商、估价和失败补偿边界可减少费用误判；需对照现有元数据。[Q05](../../plugins/tong-io--tongflow/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/tong-io--tongflow/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1296647613-root"></a>

## [Vox Director](../../plugins/alisa0808--vox-director/INSIGHT.md)

[![GitHub ★ 2,469](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C469&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alisa0808/vox-director)

> **用途**：有媒体制作经验的创作者研究短解说/广告的多阶段拼贴视频流水线。

> **亮点**：以beat/shot身份联接多模态阶段和本地音画组装，减少手工交接；生成模型贡献归服务提供方。见[Q01](../../plugins/alisa0808--vox-director/INSIGHT.md#research-q01)。

> **思考**：底层POST不重试但上层pending超时会submit新ID，且批末才落成品URL；未知任务不能当失败安全重跑。见[Q03](../../plugins/alisa0808--vox-director/INSIGHT.md#research-q03)。

> **建议**：未验证方向是持久shot指纹和预测回执，pending先对账再新建；延迟/中断模拟无重复收益则重新评估。见[Q04](../../plugins/alisa0808--vox-director/INSIGHT.md#research-q04)。

[查看完整分析](../../plugins/alisa0808--vox-director/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1275436512-root"></a>

## [书童 Pagekin](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md)

[![GitHub ★ 2,371](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C371&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/Pagekin)

> **用途**：适合愿意维护设定、架构、角色、蓝图和章节版本的长篇作者。原办法是聊天生成后在文档中手工复制、审核修订和整理连续性；这里将草稿、审稿、修稿、差异确认、定稿和版本放进作品上下文。合格交付应是作者接受且能回读/导出的章节与来源版本，不是模型生成长度、UI状态或一篇审稿报告。相对普通编辑器+聊天，增量是作品状态和章节交接；底层LLM、SQLite、编辑器和outbox不是独创。

> **亮点**：[Q01](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md#research-q01)、[Q02](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md#research-q02)支持围绕作品组织规划到定稿的状态交接，并以源校验、revision裁决和定稿outbox区分生成与交付。可解释增量是作者掌控版本与恢复，不是已证明文学质量或全球首创。

> **思考**：[Q02](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md#research-q02)至[Q04](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md#research-q04)表明数据库已定稿、实体稿待发布、生成候选和未存尾段必须区分；本地优先仍会向配置模型和可选WebDAV外发。未验恢复和人审收益，不能用版本/文件存在当生产验收。

> **建议**：[Q05](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md#research-q05)推导未验证的章节交付核对视图，围绕权威版本/发布/候选统一可回查行动；同故障对照识别准确率、恢复耗时和维护负担，无改善则放弃，不计已有贡献。

[查看完整分析](../../plugins/ethanyoq--ai-novel-writer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1389035449-root"></a>

## [催更姬](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md)

[![GitHub ★ 69](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=69&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mistnest/dsh-cuigengji-plugin) [![npm 30d 3,725](https://img.shields.io/static/v1?label=npm+30d&message=3%2C725&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cuigengji-plugin) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cuigengji-plugin)

> **用途**：面向持续写长篇的 DSH 用户，在聊天旁维护正文、情节画布和人物世界资料，Agent围绕相同对象读取、续写和修订，保留版本供作者核对。[Q01](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q01)

> **亮点**：可核查的贡献是把作者工作台和Agent动作接到同一作品对象及版本历史，结合正文来源引用、设定失效标记和恢复日志，形成比聊天记录更明确的写作交接。它整合成熟的版本检查与日志提交方法，不证明文学质量或创作速度提高。[Q01](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q01) [Q03](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q03)

> **思考**：资料可查询、修改可落盘，不等于模型已正确落实人物和情节。stale只沿已登记引用传播，正文、规划和设定又分别保存；写入后审计失败或等待超时可能留下已提交正文。作者要回读实际版本并处理关联待办，不能靠一次成功/失败响应判断整章任务完整性。[Q02](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q02) [Q03](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q03)

> **建议**：由按需资料读取和分模块提交可推导一种待验证交接回执，记录实际读取的revision及保存后关联待处理对象，而不强制每轮重读全库。可在设定并发变化、后续维护失败等任务中比较漏报、误报、人工修正和上下文量；若不能改善净负担，或把已读误当理解正确，应否定该方向。这不是当前已有能力。[Q05](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md#research-q05)

[查看完整分析](../../plugins/mistnest--dsh-cuigengji-plugin/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1337043852-root"></a>

## [大肥鱼的小说工坊](../../plugins/akira399--dsh-novel-writer/INSIGHT.md)

[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/akira399/dsh-novel-writer)

> **用途**：连载作者需要维持多章设定和修订历史。

> **亮点**：[Q01](../../plugins/akira399--dsh-novel-writer/INSIGHT.md#research-q01) 把阶段、版本与设定集中到 DSH 创作界面。

> **思考**：[Q03](../../plugins/akira399--dsh-novel-writer/INSIGHT.md#research-q03) 有限裁剪和规则无法保证长文一致性。

> **建议**：[Q05](../../plugins/akira399--dsh-novel-writer/INSIGHT.md#research-q05) 在同一连载样本上可减少查找设定和回退时间。

[查看完整分析](../../plugins/akira399--dsh-novel-writer/INSIGHT.md) · [返回表格](#category-index)

<a id="plugin-1412882758-root"></a>

## [无限画布（Infinite Canvas）](../../plugins/ninkch--dsh-infinite_canvas/INSIGHT.md)

[![GitHub ★ 143](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=143&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NINKCH/dsh-infinite_canvas) [![npm 30d 11,413](https://img.shields.io/static/v1?label=npm+30d&message=11%2C413&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas)

> **用途**：反复制作多个场次、需要复用角色和场景设定的 DSH 用户，可以在画布上同时检查分镜、生成节点及上游关系。

> **亮点**：把项目设定、可见节点和分镜检查接入宿主动作，使拆场、重做一段及人工核查共享同一份可检查的图。当前证据支持工作流结构，成片质量需单独验证。[Q01](../../plugins/ninkch--dsh-infinite_canvas/INSIGHT.md#research-q01)

> **思考**：报价只要见到任意相连视频就把该场计为零新增调用，实际续跑仍可补缺段。批准也不绑定单价，无法用预算指纹证明请求与金额都受控。[Q02](../../plugins/ninkch--dsh-infinite_canvas/INSIGHT.md#research-q02)

> **建议**：将具体剩余段、模型和价格写入审批依据，由生成器执行同一清单，并将超时未知作为待查。用部分完成和上游已受理的故障对照，若报价外或重复请求不降且正常续跑变差，就撤回。[Q04](../../plugins/ninkch--dsh-infinite_canvas/INSIGHT.md#research-q04)

[查看完整分析](../../plugins/ninkch--dsh-infinite_canvas/INSIGHT.md) · [返回表格](#category-index)

[全部分类](INDEX.md) · [返回首页](../../../README.md)

## 更新时间

2026-11-13
