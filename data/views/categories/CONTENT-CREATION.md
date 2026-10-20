# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-media-studio](#plugin-1399694663-root) | 在聊天中生成或发送图片、视频，支持多后端、后台生成和结果媒体卡片。 | 先用一个已授权后端生成小图，核对输出路径和取消，再试视频；对敏感参考图先确认发送对象与保留条件。 |
| [dsh-plugin-tts](#plugin-1334773156-root) | 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。 | 先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。 |
| [No AI Style](#plugin-1418493685-root) | 以写作 Skill 和输入框入口帮助润色中英日专业文本，保留事实、引文与不确定性。 | 先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。 |

<a id="plugin-1399694663-root"></a>

## [dsh-media-studio](../../plugins/1497105876--dsh-media-studio/INSIGHT.md)

[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio) · **脚本有更新，待重新洞察**

- **用途**：内容创作者希望从同一对话发起生成、取回成品并预览，交付是可用媒体文件和可追踪任务结果。
- **亮点**：src/tools.ts解析模型与凭据，providers对接生成后端；jobs.ts启动官方后台任务，结果保存后投递会话，注册失败时退为脱离任务控制的执行。
- **思考**：同一会话内的任务与媒体展示减少手动下载转存；免费额度或异步机制本身不能证明更便宜或更稳定。
- **建议**：先用一个已授权后端生成小图，核对输出路径和取消，再试视频；对敏感参考图先确认发送对象与保留条件。

<a id="plugin-1334773156-root"></a>

## [dsh-plugin-tts](../../plugins/1624318455--dsh-plugin-tts/INSIGHT.md)

[![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)

- **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。
- **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。
- **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。
- **建议**：先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

<a id="plugin-1418493685-root"></a>

## [No AI Style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

- **用途**：论文与专业文档作者需要减少机械表达，同时保留事实承诺和引用。
- **亮点**：filesystem provider 暴露内嵌 Skill；审阅与改写模式区分权限，真相边界优先于文风。
- **思考**：权限模式与事实优先级值得采用；提示词约束不是保真保证，仍由作者承担复核。
- **建议**：先用带数字和引用的旧稿试改，逐项对照事实与限定词，不把文风自然当作内容可靠。

## 更新时间

2026-10-20
