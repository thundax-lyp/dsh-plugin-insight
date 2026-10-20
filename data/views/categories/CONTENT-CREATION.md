# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-media-studio](#plugin-1399694663-root) | 在DSH聊天中生成图片与视频，发送本地媒体，并提供后台任务与内联展示。 | 先在低预算测试环境核对一个模型、后台完成和重开会话后附件；不把预设列表等同逐家验收，不对未知结果自动重复生成。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 | 先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 在DSH中调用本地媒体与文档CLI，进行探测、转写、OCR及格式处理。 | 先配置小范围目录，逐项确认依赖；把OCR和ASR文本与原件抽查，避免复用同名输出。 |
| [No AI Style](#plugin-1418493685-root) | 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 | 先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。 |

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

## 更新时间

2026-10-20
