# dsh-plugin-tts

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[5b09401](https://github.com/1624318455/dsh-plugin-tts/tree/5b094011dfba35a1d30d44a18d2b411654e8fff8)

<!-- BEGIN META -->
[![GitHub ★ 28](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=28&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)
<!-- END META -->

> **实现功能**：为DSH提供Edge、云端及本地语音后端，支持长文分块播放和自定义音色管理。

> **核心亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。

> **风险与缺陷**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：需要长文朗读或本地音色的用户希望在会话内播放，不想逐段复制到外部软件。

此前未入档；系统TTS更轻，独立本地TTS更容易隔离资源。本项集成价值取决于会话朗读频率及音色需求。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **Host 路由**：语音合成、音色服务和音色包管理接口。
- **界面**：长文分块播放器与音色配置。

**流程与依赖**

默认Edge需网络和兼容WebSocket协议，其他后端需key或本地推理服务、模型文件；宿主应保护语音和音色管理路由。

选后端/音色，分块合成并播放，遇到错误查看具体后端；服务未启动先修服务，不反复下载或重复提交长文本。

**兼容条件**

0.6.7，Node>=22，Host+Client；本地RVC、Index-TTS2、CosyVoice与付费Cloud需各自配置和运行时，不能按默认Edge的负担概括。

**效果与成本**

Edge联网、Cloud请求以及本地模型算力各有成本；下载音色包、部署服务、长音频重试和人工试听均需计入。没有可比单位费用。

> **思考**：统一播放器与分块流程减少切换；免费在线朗读不等于离线，音色包校验也不证明效果或服务可信。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/index.mjs注册语音及音色包路由，Edge由Node子进程完成WebSocket合成，RVC等经本地HTTP服务处理，客户端分块播放。

后端注册与故障分类、音色包sha256核验值得参考；主文件同时包含协议、下载与多路由，升级需避免跨后端回归。

<a id="detail-section-4"></a>

## 4 使用建议

先选一个后端，用短文本和长文检查播放与取消，再引入本地音色服务；需要离线或隐私边界时逐条确认所选后端数据流。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：多后端不是单一安装条件；本地模型、显存和声音样本未核验，Edge非正式接入协议可能随上游变化。未执行任何后端。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：分别对每后端测试首段延迟、长文无缝、停止与重试，检查音色包损坏和服务离线；同时记录算力、费用与人工部署时间。

**分析版本**

固定提交 [5b09401](https://github.com/1624318455/dsh-plugin-tts/tree/5b094011dfba35a1d30d44a18d2b411654e8fff8)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3403 | — | — | 44199 |
| .js | source | 1 | 7165 | 6548 | 659 | — |
| .mjs | source | 3 | 3703 | 3154 | 479 | — |
| .mjs | test | 9 | 2486 | 2043 | 360 | — |
| .md | test | 1 | 45 | — | — | 626 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1624318455/dsh-plugin-tts/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
