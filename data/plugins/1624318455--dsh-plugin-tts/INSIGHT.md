# dsh-plugin-tts

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

> 为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。

<!-- BEGIN META -->
[![GitHub ★ 26](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=26&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) · [![npm 30d 2693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)
<!-- END META -->

## 版本

固定提交 [5b094011dfba35a1d30d44a18d2b411654e8fff8](https://github.com/1624318455/dsh-plugin-tts/tree/5b094011dfba35a1d30d44a18d2b411654e8fff8)

## 用途与采用点评

- **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。
- **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。
- **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。
- **建议**：先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

## 场景与替代办法

此前未入档；系统TTS更轻，独立本地TTS更容易隔离资源。本项集成价值取决于会话朗读频率及音色需求。

## 依赖与流程

默认Edge需网络和兼容WebSocket协议，其他后端需key或本地推理服务、模型文件；宿主应保护语音和音色管理路由。

选后端/音色，分块合成并播放，遇到错误查看具体后端；服务未启动先修服务，不反复下载或重复提交长文本。

## 成本与效果

Edge联网、Cloud请求以及本地模型算力各有成本；下载音色包、部署服务、长音频重试和人工试听均需计入。没有可比单位费用。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：9520933e92e1ee480a695ceb40f4f22a3f393e9b59c2cd89f1f0aabf7de29454。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3403 | — | — | 44199 |
| .js | source | 1 | 7165 | 6548 | 659 | — |
| .mjs | source | 3 | 3703 | 3154 | 479 | — |
| .mjs | test | 9 | 2486 | 2043 | 360 | — |
| .md | test | 1 | 45 | — | — | 626 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：语音合成、音色服务和音色包管理接口。
- **界面**：长文分块播放器与音色配置。

## 工程亮点

后端注册与故障分类、音色包sha256核验值得参考；主文件同时包含协议、下载与多路由，升级需避免跨后端回归。

## 分发与兼容

0.6.7，Node>=22，Host+Client；本地RVC、Index-TTS2、CosyVoice与付费Cloud需各自配置和运行时，不能按默认Edge的负担概括。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：多后端不是单一安装条件；本地模型、显存和声音样本未核验，Edge非正式接入协议可能随上游变化。未执行任何后端。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：分别对每后端测试首段延迟、长文无缝、停止与重试，检查音色包损坏和服务离线；同时记录算力、费用与人工部署时间。

## 活跃度

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1624318455/dsh-plugin-tts/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
