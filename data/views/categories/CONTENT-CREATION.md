# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-ark9canvas](#plugin-1352959121-root) | 为DSH提供多渠道图片工作台、批量任务和Agent生图审批队列，生成结果保存为本地路径。 | 先用无付费的模拟接口检查审批和路径范围，再以明确预算少量试用。 |
| [dsh-douyin-publish](#plugin-1422396858-root) | 把本地视频上传到抖音或B站投稿页并填写内容，默认私密且停在发布前。 | 适合固定抖音/B站工作流的创作者在非公开测试稿先检查。 |
| [dsh-image2-tool](#plugin-1422216012-root) | 通过兼容图片接口生成或编辑图片，将结果保存到会话目录并支持内联预览。 | 适合已能确认中转服务支持的图片任务。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 管理提示词预设并导入酒馆角色卡、世界书及正则资料，按需注入对话上下文。 | 已有酒馆资料的写作者可先导入副本。 |
| [dsh-media-studio](#plugin-1399694663-root) | 在DSH聊天中生成图片与视频，发送本地媒体，并提供后台任务与内联展示。 | 先在低预算测试环境核对一个模型、后台完成和重开会话后附件；不把预设列表等同逐家验收，不对未知结果自动重复生成。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为Agent翻译提供分段、术语提取、一致性检查、风格指南及工作区翻译记忆。 | 适合技术文档翻译先检查数字与术语一致。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 | 先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。 |
| [dsh-redstone-music](#plugin-1401037852-root) | 在 DSH 中渲染音乐采样并生成、部署 Minecraft 红石音乐数据包。 | 适合已有 Minecraft 音乐环境的创作者；先用短片段验证采样、时序和世界备份恢复，再构建长曲。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 | 先配置小范围目录，逐项确认依赖；把OCR和ASR文本与原件抽查，避免复用同名输出。 |
| [gzhflow](#plugin-1339888505-root) | 为公众号内容提供素材、写作、风格质检、配图、排版和推草稿箱的技能及工具流程。 | 适合已有公众号编辑流程者先只做本地质检/排版；事实审阅和正式发布仍由人确认，API权限与账户条件另核。 |
| [No AI Style](#plugin-1418493685-root) | 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 | 先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。 |
| [短视频 Skill 流水线](#plugin-1414936636-root) | 将选题、配音、生图、合成、核验和多平台发布 Skill 打包接入 DSH。 | 适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。 |

<a id="plugin-1352959121-root"></a>

## [dsh-ark9canvas](../../plugins/aik358--dsh-ark9canvas/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-ark9canvas) [![npm 30d 877](https://img.shields.io/static/v1?label=npm+30d&message=877&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas) [![最新发布 2026-09-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-03&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-ark9canvas)

> **用途**：按调用计费的图片任务需要人在生成前核对提示与参数，并跟踪部分成功和超时后台任务。

> **亮点**：把Agent审批、人工工作台、批量结果和文件路径交付串联；图片模型与参考工作台尺寸公式归上游/参照设计。增量是流程接线和任务账目，非生成算法。

> **思考**：“没有人点头就不计费”覆盖哪条路径？仅Agent工具走队列，面板generate路由loopback检查后直接执行，未见在handler另校验用户决策；loopback不等于用户身份。超时也可能后台继续生成；参考路径读取可能将本机文件发渠道。

> **建议**：由审批与独立generate入口推导，可用Host端一次性授权绑定提示摘要、渠道、参考文件白名单及最大预算，每条付费路径均验证。未验证；改变参数/换渠道/重放授权/绕过UI直接调用都应拒绝，计费任务和授权一一对应。

<a id="plugin-1422396858-root"></a>

## [dsh-douyin-publish](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md)



> **用途**：已有成片和文案的创作者需要自动完成投稿准备，合格交付是正确视频、标题、话题和可见性均可回读；最终发布是独立且不可随意重试的动作。

> **亮点**：相对逐次系统对话框与手填表单，增量是将交文件、版式探测、填写和状态回执组成投稿准备链，并把默认终点设为人工发布前。文件注入和浏览器自动化是成熟手段，主要贡献在保守终点与分阶段验证的流程组合。

> **思考**：“待发布”与“已发布”回执能否可靠区分？源码有draft与private保护、平台不支持的可见性会拒绝，这是有力支持；但页面选择器与成功迹象仍是外站可变信号，发布后超时不代表没发布，重新跑pipeline也不是既有草稿的事务提交。作者真机记录不能替代当前宿主验收。

> **建议**：由草稿终点与发布未知结果推导，可把准备结果固定为带内容摘要和平台草稿ID的回执，最终发布只引用该回执并先查询状态；相对重新跑整条上传链，可减少重复稿件。未验证。模拟点击发布后网络断开，要求恢复只查询而不重传；若不能准确绑定同一草稿则方案不成立。

<a id="plugin-1422216012-root"></a>

## [dsh-image2-tool](../../plugins/544244857--dsh-image2-plugin/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/544244857/dsh-image2-plugin) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-image2-tool) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-image2-tool)

> **用途**：适合已有图片中转服务的开发者制作插图；交付物是本地可检查图片，而非接口成功提示。

> **亮点**：作者主张一句话生图；源码可确认的增量是把兼容图片接口、参考图上传、会话内落盘和视觉复查提示连接起来。相对手写curl与另存图片，减少路径整理和接回对话的步骤；模型能力归属远端服务，内联显示归属依赖的Wisdoverse插件。

> **思考**：自动生成开关和最多六次请求预算只写在工具描述中，execute没有任务级计数或授权判断，因此不是费用硬闸门。输出目录检查realpath，但参考图可读绝对路径，二者权限边界不同。视觉自检同样只是要求模型调用read_image，不能证明生成质量。

> **建议**：待验证假设：将任务预算与视觉验收状态保存为独立记录，可把提示纪律变成可审计流程。对照同一素材任务的提示版与持久计数版，测超额请求、漏验收和人工确认时间；若代价大于费用与漏验收改善则否定。

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 705](https://img.shields.io/static/v1?label=npm+30d&message=705&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

> **用途**：适合已有角色卡与世界设定、需要在DSH管理写作或角色扮演上下文的作者。

> **亮点**：作者主张集中预设管理；可确认增量是将SillyTavern资料格式转换、热切换预设与关键词世界书带到DSH。相对复制整份设定到系统提示，可减少重复整理；角色卡格式和世界书思想来自酒馆生态，未证明与原运行时语义等价。

> **思考**：角色卡占位符被清理后能避免宿主unknown variable，却可能丢失原模板语义；关键词触发也不等价完整SillyTavern规则。外部资料被注入systemPrompt会影响模型行为，应把导入内容当用户选择的配置核对，不能因PNG格式就认为可信。

> **建议**：待验证假设：导入时输出逐字段转换损失清单并允许预览本轮命中世界条目，可减少作者排查角色偏差。用相同角色卡在两种运行时比较触发和占位符覆盖；若仍难解释输出偏差，不宣称兼容。

<a id="plugin-1399694663-root"></a>

## [dsh-media-studio](../../plugins/1497105876--dsh-media-studio/INSIGHT.md)



> **用途**：内容创作者在同一聊天中提出需求、等待生成、查看与保存媒体，避免在生成网站和文件系统间重复搬运。

> **亮点**：相对只返回URL的HTTP工具，把生成、附件持久化、任务通知及富媒体展示接成流程；模型生成能力来自服务商，客户端与后台闭环是插件主要工程与交付增量。

> **思考**：后台任务完成不等于用户已看到：Agent不存在时没有投递，投递异常被吞掉；无jobs时退为不可见句柄的detached工作。取消本地轮询也不证明供应商停止计费；参考图本地相对路径以process.cwd解析而输出目录可基于会话cwd，两者需核对。

> **建议**：待验证假设：持久保存供应商任务ID、产物提交状态和可重投通知，可在宿主重启或Agent失效后恢复交付而不重复付费；若供应商缺乏幂等查询则仍不能保证恰好一次生成。

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,042](https://img.shields.io/static/v1?label=npm+30d&message=1%2C042&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

> **用途**：持续翻译技术材料的用户需要跨段术语与格式一致，合格交付须同时保留数字、术语和语义；模型承担翻译，插件辅助组织与检查。

> **亮点**：相对模型单次直译，增量是将分段、术语约束和持久记忆纳入可重复流程，降低规则性漏项。不是新翻译模型，也未证明启发式分数与人类忠实度一致；真正贡献是检查与知识积累的组合。

> **思考**：quality中的fidelity是否测到了忠实度？scoreQuality从60+40开始按数字、术语、长度、标点等扣分，不能检测主客体颠倒或否定丢失；源文含中文而译文出现连续英文会扣“未翻译”分，也可能误伤正常中译英。高分只表示规则少触发，不能作语义验收。

> **建议**：由规则检查与语义缺口推导，可输出“可确定违规/需人工语义核对”两层证据而非单一质量总分，把否定、数量关系和实体角色标为复核点。未验证假设是降低高分误放行。构造规则均通过但意义反转的译对，若新流程仍不能降低漏检与复核成本则否定。

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

> **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。

> **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。

> **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。

> **建议**：先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)



> **用途**：Minecraft 音乐创作者需要把谱面和乐器配置转成可播放世界；验收是音高、起音和轨道时序正确的成品。

> **亮点**：相对逐格 RCON 和手工调音，实际增量是采样起音对齐、显式 sample 音高与轨道延迟补偿组成生产管线；tool-render 的 RMS 判据使采样检查可重复。作者速度数字是自报，本次只确认分片和串行队列机制。

> **思考**：文件级起音断言与生成命令不能保证游戏中的齐奏：模组 sound_event、服务器 tick 和区块加载会改变播放结果；rm_build 的几何延迟补偿需放到相同服务器负载下检验，不能将离线自验证等同于音乐成品验收。

> **建议**：适合已有 Minecraft 音乐环境的创作者；先用短片段验证采样、时序和世界备份恢复，再构建长曲。

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

> **用途**：Agent需要从媒体或文档取得可分析文本与衍生文件，同时限制可访问目录。

> **亮点**：将多个成熟CLI收敛为有输出上限的宿主接口；增量在工具组织和路径控制，识别与转换算法归于外部工具。

> **思考**：转换程序退出成功不能证明转写/OCR忠实；extractAudio和thumbnail显式使用ffmpeg -y写入调用者给定路径，同名输出会允许覆盖，因此并发安全声明不能保证文件级不覆盖。

> **建议**：待验证假设：以输入指纹和独立输出目录绑定转换结果，可减少并发覆盖和错配；需与现有文件命名策略比较额外负担。

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

> **用途**：内容作者反复产稿并复用风格/经验，合格产物需事实准确、版权清楚、排版可读并经人发布。

> **亮点**：相对单次写作提示，增量是四库沉淀、阶段产物与确定性/自检/人工三种检查分工；方法源自作者旧工作流和外部风格研究，非原创内容质量算法。

> **思考**：去AI味分数能否代表好文章？词汇/标点规则不验证事实和论证，也可能误伤个人风格，作者注释已记录误杀与阈值收窄。推草稿链多次外部写入，dry-run不验证API权限，未知结果重试可能重传素材或建重复草稿。

> **建议**：由三种检查与四库推导，可把风格规则改为可解释建议，并将事实/版权审阅与发布收据独立；草稿任务用内容摘要识别未知结果。未验证；作者盲选样本测可读性/保真度，断网后对账不得重复建稿。

<a id="plugin-1418493685-root"></a>

## [No AI Style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

> **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。

> **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。

> **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。

> **建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

<a id="plugin-1414936636-root"></a>

## [短视频 Skill 流水线](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline) [![npm 30d 465](https://img.shields.io/static/v1?label=npm+30d&message=465&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-video-pipeline) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-video-pipeline)

> **用途**：已有短视频制作与平台账号的创作者，按工序组织一集从选题到发布的素材和结果；交付成片、核验记录及平台链接，不能把Skill注册成功当生产链跑通。

> **亮点**：相对散落复制Skill，贡献是统一目录、资源基址和环境占位符，使一条制作流程可随包分发。核心生成、剪辑和平台上传依赖现有API/ffmpeg/脚本，第三方小红书代码有独立归属；不是新的媒体生成算法。

> **思考**：“核验后才发布”在入口主要是Skill规程，不是工具层强制门禁；另一批量编排路径文档承认没有确认门。包内quad-platform-publish同时留“四平台/三平台”和4个/3个Agent的历史环境指令，移植者可能继承原作者账号风控与时序假设。

> **建议**：适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。

## 更新时间

2026-10-21
