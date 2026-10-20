# dsh-media-studio

> 在聊天中生成或发送图片、视频，支持多后端、后台生成和结果媒体卡片。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/commits) · **脚本有更新，待重新洞察**
<!-- END META -->

## 版本

固定提交 [4b78ebc9da8b2b7a88b5aa93c714817a2db64cc8](https://github.com/1497105876/dsh-media-studio/tree/4b78ebc9da8b2b7a88b5aa93c714817a2db64cc8)

## 用途与采用点评

- **用途**：内容创作者希望从同一对话发起生成、取回成品并预览，交付是可用媒体文件和可追踪任务结果。
- **亮点**：src/tools.ts解析模型与凭据，providers对接生成后端；jobs.ts启动官方后台任务，结果保存后投递会话，注册失败时退为脱离任务控制的执行。
- **思考**：同一会话内的任务与媒体展示减少手动下载转存；免费额度或异步机制本身不能证明更便宜或更稳定。
- **建议**：先用一个已授权后端生成小图，核对输出路径和取消，再试视频；对敏感参考图先确认发送对象与保留条件。

## 场景与替代办法

内容创作者希望从同一对话发起生成、取回成品并预览，交付是可用媒体文件和可追踪任务结果。

此前未入档；供应商网页和独立生成工具是对照，本项把生成与会话交付接起来，未测作品质量增益。

## 依赖与流程

需要生成服务账号、网络与凭据解析，视频预览依赖本地文件和客户端支持；结果能否长期访问取决于输出目录保留。

选模型与参数，提交生成，查看任务，收到卡片后核对并保存；失败先检查后台实际状态及文件，再决定是否重试。

## 成本与效果

图片或视频后端按实际服务计费，失败重试、参考图上传与存储另计；首次key与参数配置、挑选成品占人工，未实测单位合格作品成本。

同一会话内的任务与媒体展示减少手动下载转存；免费额度或异步机制本身不能证明更便宜或更稳定。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：20a529a9ecb36f8eb8b009f44144bd701a871650e0b52da0cde9c13ecc391aec。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 2672 | 2568 | 224 | — |
| .md | source | 1 | 151 | — | — | 1655 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1301 | 1095 | 138 | — |
| .ts | source | 11 | 1728 | 1388 | 241 | — |

排除 9 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：generate_image、generate_video、send_media。
- **用户命令**：image与video。
- **后台**：生成任务及完成通知。

## 工程亮点

生成适配、媒体落盘与任务投递拆分可复用；jobs.start失败后静默转为脱离任务控制的路径需重点核对，避免用户误以为没有发起计费。

## 分发与兼容

0.5.5，要求DSH 0.2.0-rc.2和Node>=22.19，Host依赖tools/jobs/commands/attachments/credentials及Client富渲染。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；供应商网页和独立生成工具是对照，本项把生成与会话交付接起来，未测作品质量增益。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：服务商预设不证明当前端点可用或质量一致；后台任务句柄不等于生成成功，降级执行的取消和完成可见性需实测。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试取消、远端超时、jobs拒绝、投递失败和重启，比较只发起一次任务时是否重复计费或丢失成品。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
