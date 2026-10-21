# 短视频 Skill 流水线

> 将选题、配音、生图、合成、核验和多平台发布 Skill 打包接入 DSH。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[82a85d2](https://github.com/439436269-ctrl/dsh-video-pipeline/tree/82a85d20b67d1d398d49009462d61a741f5a8d51)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline) · [![npm 30d 465](https://img.shields.io/static/v1?label=npm+30d&message=465&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-video-pipeline)
<!-- END META -->

**使用建议**：适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：已有短视频制作与平台账号的创作者，按工序组织一集从选题到发布的素材和结果；交付成片、核验记录及平台链接，不能把Skill注册成功当生产链跑通。

适合已有视频生产工具和账号、愿意逐工序适配的创作者；先落地本地合成与核验，发布步骤单独确认且回读，不能依照总入口一句话跳过配置。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工拷贝原子Skill和脚本串联；主张的真实生产链来自作者，当前只静态核查provider与代表Skill，不核实全部账号流程。

插件在ctx.skills注册bundled provider，扫描SKILL.md/frontmatter，以rank600和resourceBase提供技能；加载正文替换占位符，enabledSkills限制暴露范围。业务编排通过文字规程指派原子Skill和确认门。


插件入口只有Node内建模块和宿主skills接口；实际生产另需ffmpeg、Python/numpy/Pillow、API key和额度、平台登录/浏览器及飞书权限。正文占位符替换不改脚本文件中的占位符，首轮仍需手工配置。

总入口选择编排→用户确认预算→生成配音/图片/视频→合成→媒体核验→确认平台和文案→分平台执行→回读链接/表格。作者生产记录是单环境报告，迁移时应重验每个外部环节。

首次迁移账号、路径、工具环境和脚本占位符成本高；持续为模型/API额度、媒体计算、上传失败和人工审片。原始运营数据被剔除，无法复现作者产能或收益倍率。

可复用的是生产知识、交接产物和失败经验；市场播放/成交收益没有独立验证，打包完整不代表端到端可迁移。

- **Skill**：bundled provider提供包内技能目录，代表入口video-pipeline、media-verify、quad-platform-publish已核查。

- **思考**：“核验后才发布”在入口主要是Skill规程，不是工具层强制门禁；另一批量编排路径文档承认没有确认门。包内quad-platform-publish同时留“四平台/三平台”和4个/3个Agent的历史环境指令，移植者可能继承原作者账号风控与时序假设。

<a id="detail-section-4"></a>

### 工程贡献

provider保留resourceBase并尊重本地Skill优先级，便于版本化分发；frontmatter自写子集需要持续对齐宿主。移植应把原作者历史账号指令改成用户自己的明确配置，不能当普遍规则。

无runtime npm依赖只描述provider，不覆盖19项Skill执行依赖；同名本地Skill优先。第三方许可及导入/脱敏报告是作者材料，未执行隐私门。

固定源码依据：[lib/provider.js L120–192](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/lib/provider.js#L120-L192)；[skills/video-pipeline/SKILL.md L41–60](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/skills/video-pipeline/SKILL.md#L41-L60)；[skills/quad-platform-publish/SKILL.md L10–40](https://github.com/439436269-ctrl/dsh-video-pipeline/blob/82a85d20b67d1d398d49009462d61a741f5a8d51/skills/quad-platform-publish/SKILL.md#L10-L40)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

- **亮点**：相对散落复制Skill，贡献是统一目录、资源基址和环境占位符，使一条制作流程可随包分发。核心生成、剪辑和平台上传依赖现有API/ffmpeg/脚本，第三方小红书代码有独立归属；不是新的媒体生成算法。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- 版本依据：仓库：[439436269-ctrl/dsh-video-pipeline](https://github.com/439436269-ctrl/dsh-video-pipeline)；固定提交：[82a85d20](https://github.com/439436269-ctrl/dsh-video-pipeline/tree/82a85d20b67d1d398d49009462d61a741f5a8d51)；版本号：0.1.1；版本日期：2026-10-16（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查provider与三个代表Skill，未完整审计19项生产脚本或执行隐私门；正文含作者特定环境历史指令。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：把成片哈希、核验状态、用户批准平台集合和实际上传结果整理成一份manifest，并令发布适配器校验，可能把文字质量门变成可审计约束。由现有产物流和素材一致性要求推导；各平台脚本必须统一状态所有权，增加迁移成本。

最小验证与否定条件：在自有素材/测试账号先只生成到本地成片，对照手工Skill复制；要求占位符已落地、每步输入输出可定位、核验失败时所有发布路径停止。随后仅经明确授权测试发布；若替代入口绕过门或上传旧副本，则不成立完整流水线质量保证。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 49 | 6103 | — | — | 100616 |
| .js | source | 5 | 631 | 399 | 192 | — |
| .mjs | source | 25 | 3975 | 3185 | 561 | — |
| .mjs | test | 2 | 368 | 290 | 42 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-video-pipeline/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
