# dsh-media-studio

> 在聊天中生成或发送图片、视频，支持多后端、后台生成和结果媒体卡片。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[4b78ebc](https://github.com/1497105876/dsh-media-studio/tree/4b78ebc9da8b2b7a88b5aa93c714817a2db64cc8)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-media-studio) · **脚本有更新，待重新洞察**
<!-- END META -->

**使用建议**：先用一个已授权后端生成小图，核对输出路径和取消，再试视频；对敏感参考图先确认发送对象与保留条件。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：内容创作者希望从同一对话发起生成、取回成品并预览，交付是可用媒体文件和可追踪任务结果。

此前未入档；供应商网页和独立生成工具是对照，本项把生成与会话交付接起来，未测作品质量增益。

## 能力与限制

- **模型工具**：generate_image、generate_video、send_media。
- **用户命令**：image与video。
- **后台**：生成任务及完成通知。

**流程与依赖**

需要生成服务账号、网络与凭据解析，视频预览依赖本地文件和客户端支持；结果能否长期访问取决于输出目录保留。

选模型与参数，提交生成，查看任务，收到卡片后核对并保存；失败先检查后台实际状态及文件，再决定是否重试。

**兼容条件**

0.5.5，要求DSH 0.2.0-rc.2和Node>=22.19，Host依赖tools/jobs/commands/attachments/credentials及Client富渲染。

**效果与成本**

图片或视频后端按实际服务计费，失败重试、参考图上传与存储另计；首次key与参数配置、挑选成品占人工，未实测单位合格作品成本。

- **思考**：同一会话内的任务与媒体展示减少手动下载转存；免费额度或异步机制本身不能证明更便宜或更稳定。

## 工程分析

- **亮点**：src/tools.ts解析模型与凭据，providers对接生成后端；jobs.ts启动官方后台任务，结果保存后投递会话，注册失败时退为脱离任务控制的执行。

生成适配、媒体落盘与任务投递拆分可复用；jobs.start失败后静默转为脱离任务控制的路径需重点核对，避免用户误以为没有发起计费。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：服务商预设不证明当前端点可用或质量一致；后台任务句柄不等于生成成功，降级执行的取消和完成可见性需实测。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试取消、远端超时、jobs拒绝、投递失败和重启，比较只发起一次任务时是否重复计费或丢失成品。

**分析版本**

固定提交 [4b78ebc](https://github.com/1497105876/dsh-media-studio/tree/4b78ebc9da8b2b7a88b5aa93c714817a2db64cc8)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 2672 | 2568 | 224 | — |
| .md | source | 1 | 151 | — | — | 1655 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1301 | 1095 | 138 | — |
| .ts | source | 11 | 1728 | 1388 | 241 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1497105876/dsh-media-studio/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
