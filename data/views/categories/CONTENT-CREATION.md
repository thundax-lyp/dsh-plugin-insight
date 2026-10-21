# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-media-studio](#plugin-1399694663-root) | 在DSH聊天中生成图片与视频，发送本地媒体，并提供后台任务与内联展示。 | 先在低预算测试环境核对一个模型、后台完成和重开会话后附件；不把预设列表等同逐家验收，不对未知结果自动重复生成。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 | 先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。 |
| [dsh-redstone-music](#plugin-1401037852-root) | 在 DSH 中渲染音乐采样并生成、部署 Minecraft 红石音乐数据包。 | 适合已有 Minecraft 音乐环境的创作者；先用短片段验证采样、时序和世界备份恢复，再构建长曲。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 | 先配置小范围目录，逐项确认依赖；把OCR和ASR文本与原件抽查，避免复用同名输出。 |
| [No AI Style](#plugin-1418493685-root) | 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 | 先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。 |
| [短视频 Skill 流水线](#plugin-1414936636-root) | 将选题、配音、生图、合成、核验和多平台发布 Skill 打包接入 DSH。 | 适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。 |

<a id="plugin-1399694663-root"></a>

## [dsh-media-studio](../../plugins/1497105876--dsh-media-studio/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio)

- **用途**：内容创作者在同一聊天中提出需求、等待生成、查看与保存媒体，避免在生成网站和文件系统间重复搬运。
- **亮点**：相对只返回URL的HTTP工具，把生成、附件持久化、任务通知及富媒体展示接成流程；模型生成能力来自服务商，客户端与后台闭环是插件主要工程与交付增量。
- **思考**：后台任务完成不等于用户已看到：Agent不存在时没有投递，投递异常被吞掉；无jobs时退为不可见句柄的detached工作。取消本地轮询也不证明供应商停止计费；参考图本地相对路径以process.cwd解析而输出目录可基于会话cwd，两者需核对。
- **建议**：待验证假设：持久保存供应商任务ID、产物提交状态和可重投通知，可在宿主重启或Agent失效后恢复交付而不重复付费；若供应商缺乏幂等查询则仍不能保证恰好一次生成。

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

- **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。
- **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。
- **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。
- **建议**：先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

<a id="plugin-1401037852-root"></a>

## [dsh-redstone-music](../../plugins/19north--dsh-redstone-music/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/19north/dsh-redstone-music)

- **用途**：Minecraft 音乐创作者需要把谱面和乐器配置转成可播放世界；验收是音高、起音和轨道时序正确的成品。
- **亮点**：相对逐格 RCON 和手工调音，实际增量是采样起音对齐、显式 sample 音高与轨道延迟补偿组成生产管线；tool-render 的 RMS 判据使采样检查可重复。作者速度数字是自报，本次只确认分片和串行队列机制。
- **思考**：文件级起音断言与生成命令不能保证游戏中的齐奏：模组 sound_event、服务器 tick 和区块加载会改变播放结果；rm_build 的几何延迟补偿需放到相同服务器负载下检验，不能将离线自验证等同于音乐成品验收。
- **建议**：适合已有 Minecraft 音乐环境的创作者；先用短片段验证采样、时序和世界备份恢复，再构建长曲。

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

- **用途**：Agent需要从媒体或文档取得可分析文本与衍生文件，同时限制可访问目录。
- **亮点**：将多个成熟CLI收敛为有输出上限的宿主接口；增量在工具组织和路径控制，识别与转换算法归于外部工具。
- **思考**：转换程序退出成功不能证明转写/OCR忠实；extractAudio和thumbnail显式使用ffmpeg -y写入调用者给定路径，同名输出会允许覆盖，因此并发安全声明不能保证文件级不覆盖。
- **建议**：待验证假设：以输入指纹和独立输出目录绑定转换结果，可减少并发覆盖和错配；需与现有文件命名策略比较额外负担。

<a id="plugin-1418493685-root"></a>

## [No AI Style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

- **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。
- **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。
- **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。
- **建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

<a id="plugin-1414936636-root"></a>

## [短视频 Skill 流水线](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline) · [![npm 30d 465](https://img.shields.io/static/v1?label=npm+30d&message=465&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-video-pipeline)

- **用途**：已有短视频制作与平台账号的创作者，按工序组织一集从选题到发布的素材和结果；交付成片、核验记录及平台链接，不能把Skill注册成功当生产链跑通。
- **亮点**：相对散落复制Skill，贡献是统一目录、资源基址和环境占位符，使一条制作流程可随包分发。核心生成、剪辑和平台上传依赖现有API/ffmpeg/脚本，第三方小红书代码有独立归属；不是新的媒体生成算法。
- **思考**：“核验后才发布”在入口主要是Skill规程，不是工具层强制门禁；另一批量编排路径文档承认没有确认门。包内quad-platform-publish同时留“四平台/三平台”和4个/3个Agent的历史环境指令，移植者可能继承原作者账号风控与时序假设。
- **建议**：适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。

## 更新时间

2026-10-21
