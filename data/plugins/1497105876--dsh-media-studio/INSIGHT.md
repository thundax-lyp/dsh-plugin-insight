# Media Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[aca58b9](https://github.com/1497105876/dsh-media-studio/tree/aca58b93e30ad7cb92a54b98ac67f071674ce52f)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：把图片/视频生成接到DSH工具、命令及媒体卡片；后台启动、作品保存和会话取用须分开核。

> **亮点**：集成价值是让生成资产沿canonical/meta及命令payload进入宿主文件/附件和实际视图，减少另接服务与手动搬运；模型、jobs与浏览器能力继承上游，见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：后台缺句柄降级/无交回确认且需模型再执行工具，取消/超时不代表远端终止；协议字段、无副本卡片与key引用还有实际条件反例，不能从started或文件存在推已交付，见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 作品交付相对网页/API脚本增加什么，研究的是哪个组件？](#detail-section-11)
  - [Q02 · 实际工具和命令如何到生成、文件及画廊？](#detail-section-12)
  - [Q03 · started、取消与完成通知能保证交付吗？](#detail-section-13)
  - [Q04 · 参数、素材、配置和本地视图还有什么具体反例？](#detail-section-14)
  - [Q05 · 生成一件合格作品的依赖、操作与全部成本是什么？](#detail-section-15)
  - [Q06 · 不重复已有后台框架，下一步怎样验证价值？](#detail-section-16)
  - [Q07 · 当前怎样限定采用与退出？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复在DSH内由Agent/命令创作并回交图片或短视频、愿意核端点与素材范围的用户；结果是合格且可找回/可取用的作品，摩擦及替代见[Q01](#research-q01)。

服务商网页下载后回传或简单API脚本已能产同类作品；应固定模型/提示/预算比较合格率、搬运/恢复人工及全费，不能把统一入口当质量领先，见[Q05](#research-q05)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图片生成/编辑 | 提示/参考素材换作品 | 两类具体HTTP协议；OpenAI分辨率仅固定方向档，外发与文件权限需核 |
| 视频任务 | 提交/轮询/下载 | 非Agnes不送mode/帧/参考/画幅，content下载鉴权另验；取消非供应商终态 |
| 本地媒体交回 | 路径文件→附件/卡片 | process.cwd/会话cwd不同；无path图片卡片被跳过，Host文件读取另验 |
| 后台与完成接续 | 避免本次工具长等待 | 句柄可缺；notice→模型→send_media不是直接用户回执 |
| 配置与富视图 | 模型目录、凭据、图库/打开 | 最终引用可碰撞、配置/key非原子；通用图片槽及原生通道需回归 |

**流程与依赖**

宿主服务/文件通道、外部后端/凭据、素材/输出和live owner分别约束不同阶段；无jobs主入口不会正常加载，不能把catch脱管叫完整无服务兼容。条件及缺失后果集中见[Q05](#research-q05)。

先用固定后端的低预算同步图核参数/文件/视图，再验默认后台和逐阶段失败；未知结果先查原ID/目录而非再生成。完整日常/恢复/退出操作表见[Q05](#research-q05)。

**效果与成本**

除生成与存储外，完成通知还可能引出模型/图像输入和再次工具交接；本地超时或隐藏卡片均不撤销远端费用。四阶段现金/资源、人时与未知项统一见[Q05](#research-q05)。

少搬运有具体实现，但收益要扣除协议不匹配、重复生成及人工对账；作品质量、视图可取用和后台交回分别核验。效果边界仅列于[Q05](#research-q05)，不以免费标签或工具数量代替净收益。

> **思考**：后台缺句柄降级/无交回确认且需模型再执行工具，取消/超时不代表远端终止；协议字段、无副本卡片与key引用还有实际条件反例，不能从started或文件存在推已交付，见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集成价值是让生成资产沿canonical/meta及命令payload进入宿主文件/附件和实际视图，减少另接服务与手动搬运；模型、jobs与浏览器能力继承上游，见[Q01](#research-q01)、[Q02](#research-q02)。

结构化值/meta/命令payload与provider/媒体职责分层可复用，需连同path-only视图、live配置/凭据两阶段与signal截止位置迁移。工程统计含src/编译副本，启发式扩展范围非独立原创量/完整发布包大小，不能按复杂度算贡献。

<a id="detail-section-5"></a>

### 1.4 主要限制

后台缺句柄降级/无交回确认且需模型再执行工具，取消/超时不代表远端终止；协议字段、无副本卡片与key引用还有实际条件反例，不能从started或文件存在推已交付，见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先确认当前Host/API合同与选定后端的一次同步作品闭环，再讨论有限后台试用；出现未知远端状态/路径权限或文件恢复异常时停止新生成并保全已生成资产，见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定compiled关键链及边界可核；当前Host/所选后端/真实作品与恢复未验，观察；最小阶段关联仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/commands.js、lib/config.js、lib/index.js、lib/jobs.js、lib/media.js、lib/presets.js、lib/profile-dir.js、lib/providers.js、lib/tools.js、lib/types.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根manifest/patch/README、实际lib/index.js所有业务import，以及client factory的工具/命令/普通图库、附件与path显示、原生打开与配置/凭据caller；完整追工具/命令同步及后台、jobs结果/owner/notice、所有provider HTTP分支与下载、素材/输出/profile、附件/文件提交。src作对照，未全审每个样式/预设文案/构建器或Host源码，未执行目标/安装/构建/生成/API/故障实验。
- 下一步：四准备摘要/HEAD、固定原件与题绑定核对；实际compiled主链/分支静态阅读，不执行目标/构建/安装/服务/生成/故障测试。未核Host对工具/job/Agent notice/附件/file route及remote.session返回契约；把当前源码条件和已复现事故分开。后续矩阵与净收益验证见[Q06](#research-q06)、[Q07](#research-q07)。

**分析版本**

- **仓库**：[1497105876/dsh-media-studio](https://github.com/1497105876/dsh-media-studio)
- **版本号**：2.1.2004（[固定提交 aca58b9](https://github.com/1497105876/dsh-media-studio/tree/aca58b93e30ad7cb92a54b98ac67f071674ce52f)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用现有job/远端ID/已存文件做最小分阶段关联，未知先查原任务，再对照实际send_media/视图读取；不是再造后台框架，若现有日志+目录已够用则否定独立层，见[Q06](#research-q06)。

四准备摘要/HEAD、固定原件与题绑定核对；实际compiled主链/分支静态阅读，不执行目标/构建/安装/服务/生成/故障测试。未核Host对工具/job/Agent notice/附件/file route及remote.session返回契约；把当前源码条件和已复现事故分开。后续矩阵与净收益验证见[Q06](#research-q06)、[Q07](#research-q07)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 2794 | 2656 | 258 | — |
| .md | source | 1 | 151 | — | — | 1641 |
| .mjs | source | 1 | 50 | 33 | 13 | — |
| .tsx | source | 5 | 1303 | 1095 | 140 | — |
| .ts | source | 12 | 1850 | 1465 | 279 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/1497105876/dsh-media-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：媒体生成后台化能否从DSH创作请求走到正确作品、可恢复文件和实际会话取用；started、远端生成、保存与模型再展示的边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 作品交付相对网页/API脚本增加什么，研究的是哪个组件？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根@gw/dsh-media-studio2.1.2004/MIT是DSH插件，实际main=lib/index.js、Web=lib/client.js，patch插入media-studio。Node>=22.19、DSH>=0.2.1-rc.2 <0.3.0为声明；lib已提交且在package.files中，不等于已核npm发布包或当前宿主可加载。Host强依赖tools/jobs/commands/attachments/credentials；客户端还要slots/remote.session/remote.credentials/configForms。具体API返回形态、agent registry/notice、Host文件/原生打开能力未做同版本验收。

面向已经在DSH里反复生成/修改图片或短视频、希望由Agent接续创作和回交作品的人。原流程往往要去服务商网页选择模型/上传素材、等生成、下载/找文件、再放回会话；API脚本可少点网页，但仍要接下载、文件和展示。本插件统一三个模型工具、两个命令、素材/输出与富视图，后台可腾出当前工具等待；合格结果必须是内容符合要求、保存可找回、在正确会话可取用，并能说明远端未决任务，而非started/jobId。

这是服务适配和交付编排增量：图像/视频模型、宿主jobs/附件/Agent循环与浏览器播放不是原创。对偶尔单张图或要求精细编辑的人，供应商网页/现成脚本可能更省维护；没有同提示/同模型/同预算的可用作品率和返工比较。默认Agnes及UI列出的其他厂商、模型名和“免费”标签只是固定材料中的配置/作者主张，不证明当前服务可用、费用为零或任意OpenAI兼容协议都成功。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-39](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/package.json#L1-L39)

根版本、engine、双入口与分发范围。

<details>
<summary>查看原文（39行）</summary>

```text
{
  "name": "@gw/dsh-media-studio",
  "version": "2.1.2004",
  "description": "DeepSeek Harness plugin: generate and send images/videos directly in the chat. Agnes / OpenAI-compatible providers, preset models, custom API models, background generation with chat push, inline preview with download and native open.",
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "image-generation",
    "video-generation",
    "agnes"
  ],
  "license": "MIT",
  "type": "module",
  "engines": {
    "node": ">=22.19.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1497105876/dsh-media-studio.git"
  },
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib/*.js",
    "lib/types/**/*.d.ts",
    "cordis.patch.yml",
    "icon.svg",
    "README.md"
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-10](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/index.js#L1-L10)

强依赖及真实工具/命令入口。

<details>
<summary>查看原文（10行）</summary>

```text
import { Config } from './config.js';
import { registerMediaCommands } from './commands.js';
import { registerMediaTools } from './tools.js';
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-16](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/cordis.patch.yml#L1-L16)

根profile挂载与默认配置。

<details>
<summary>查看原文（16行）</summary>

```text
# @gw/dsh-media-studio — DSH media generation bundle
# 挂载插件行：所有配置项的默认值由插件 Config schema 提供（见 README）。
# 想覆盖默认值时在 config: 下按整行替换（patch 语义是整值替换，不做深合并）。
- insert:
    - id: media-studio
      name: '@gw/dsh-media-studio'
      config:
        defaultImageModel: agnes-image
        defaultVideoModel: agnes-video
        outputDir: '~/.dsh/media-studio'
        autoSave: true
        imageResolution: 2K
        imageAspectRatio: '16:9'
        videoSeconds: 5
        videoSize: 720P
        videoAspectRatio: '16:9'
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1410-1434](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1410-L1434)

真实factory注入服务、工具/命令/通用图库和配置卡。

<details>
<summary>查看原文（25行）</summary>

```text
// Z:/dsh/@gw/dsh-media-studio/src/client/index.ts
var inject = ["slots", "remote", "remote.session", "remote.credentials", "configForms"];
function apply(ctx) {
  bindNativeOpen(ctx["remote.session"] ?? ctx.remote?.session);
  for (const key of ["generate_image", "generate_video", "send_media"]) {
    ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
      { name: "tool.call.toolview", key },
      MediaToolRow
    ));
  }
  for (const key of ["image", "video"]) {
    ctx.slots.inject("conversation.chat.commandview", () => ctx.slots.register(
      { name: "conversation.chat.commandview", key },
      MediaCommandRow
    ));
  }
  for (const name of ["conversation.chat.message.images", "conversation.chat.user.images"]) {
    ctx.slots.inject(name, () => ctx.slots.register(
      { name, priority: -1 },
      MessageMediaImages
    ));
  }
  registerConfigCard(ctx);
}
;Object.defineProperty(module.exports,Symbol.toStringTag,{value:"Module"});return module.exports}});
```

</details>

**依据 5 · 作者声明**：[lib/presets.js:1-22](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/presets.js#L1-L22)

默认Agnes配置/免费标签仅声明。

<details>
<summary>查看原文（22行）</summary>

```text
/** 默认图片模型。 */
export const PRESET_IMAGE_MODELS = [
    {
        id: 'agnes-image',
        label: 'Agnes 生图（免费，支持图生图/多图）',
        provider: 'agnes',
        model: 'agnes-image-2.5-flash',
        baseURL: 'https://apihub.agnes-ai.com/v1',
        apiKeyEnv: 'AGNES_API_KEY',
    },
];
/** 默认视频模型。 */
export const PRESET_VIDEO_MODELS = [
    {
        id: 'agnes-video',
        label: 'Agnes 生视频（免费）',
        provider: 'agnes',
        model: 'agnes-video-2.5-flash',
        baseURL: 'https://apihub.agnes-ai.com/v1',
        apiKeyEnv: 'AGNES_API_KEY',
    },
];
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际工具和命令如何到生成、文件及画廊？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

真正Host入口注册generate_image/generate_video/send_media及/image、/video；工具默认后台，run_in_background=false同步，命令仅识别输入开头--wait。解析model条目后先宿主credential-ref，再回退环境变量；工具的参考素材先readReferenceImage。entry/key/大部分输入、输出目录与autoSave在开始时捕获，gc仍持live config，timeout/poll在执行内部get，不是全配置事务快照。命令/image从已提交image附件经宿主readImage取素材；工具本地相对参考图/发送路径则受进程cwd影响，见Q04。

图片按Agnes或OpenAI风格调/images/generations，有参考图的OpenAI分支调multipart /images/edits；只检查响应data[0]/images[0]中的非空b64或URL并下载。视频POST /videos拿远端ID，Agnes按origin/agnesapi带video_id/model_name查，另一分支按/videos/id轮询再取URL或/content。signal组合调用取消与整体timeout，具体字段/鉴权限制见Q04。

图片先attachments.saveImage，再在autoSave=true时写副本；视频始终写本地文件。图片结果含attachmentId/尺寸/字节和可选path，视频含path；工具canonical JSON的items再投影为presentationMeta，render还输出文字/图片块。/--wait命令将同一类items放入有版本标记的JSON payload，客户端从命令结果解码；不是靠模型从普通自然语言猜文件。

实际lib/client.js的tool/command card最终使用MediaItemGrid，视频/图片文件URL经宿主api/file?path构造，灯箱/下载/视频controls与可用性探测后的remote.session原生打开是浏览器侧。已有普通消息附件图库另经loadImage/attachment显示。后台则先返回started空items，后续通过notice唤醒Agent再send_media；这条间接链和同步结果须分别验收，不能称保存即用户已看到。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:61-85](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L61-L85)

真实模型目录与凭据/env回退。

<details>
<summary>查看原文（25行）</summary>

```text
export function resolveModel(entries, defaultId, requested, kind) {
    const id = (requested === undefined || requested.trim() === '') ? defaultId : requested.trim();
    const found = entries.find(entry => entry.id === id);
    if (found !== undefined)
        return found;
    const known = entries.map(entry => entry.id).join(', ') || '(none)';
    throw new Error(`unknown ${kind} model "${id}"; configured entries: ${known}`);
}
/** Resolve the API key through the credential seam, then plain environment. */
export async function resolveApiKey(ctx, entry) {
    const envName = entry.apiKeyEnv.trim();
    if (envName === '')
        throw new Error(`model "${entry.id}" has no apiKeyEnv configured`);
    try {
        const resolved = await ctx.credentials.resolve(credentialRef(envName));
        if (resolved?.value !== undefined && resolved.value !== '')
            return resolved.value;
    }
    catch {
        // Fall through to the plain environment below.
    }
    const fromEnv = process.env[envName];
    if (fromEnv !== undefined && fromEnv !== '')
        return fromEnv;
    throw new Error(`missing API key: set the ${envName} environment variable (model "${entry.id}")`);
```

</details>

**依据 2 · 源码核查**：[lib/tools.js:236-288](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L236-L288)

图片实际参数/caller、同步与默认后台结果。

<details>
<summary>查看原文（53行）</summary>

```text
            presentationMeta: (_args, value) => {
                const data = value;
                return JSON.parse(JSON.stringify({ items: data.images }));
            },
        },
        presentCall: args => ({
            card: 'generic',
            title: `生成图片：${String(args.prompt ?? '').slice(0, 60)}`,
        }),
        async execute(args, exec) {
            const entry = resolveModel(config.imageModels.get(), config.defaultImageModel.get(), args.model, 'image');
            const apiKey = await resolveApiKey(ctx, entry);
            const referenceImages = await Promise.all((args.reference_images ?? []).map(readReferenceImage));
            const gc = generationContext(ctx, config, sessionCwd(exec.agent));
            const params = {
                prompt: args.prompt,
                resolution: args.resolution ?? config.imageResolution.get(),
                aspectRatio: args.aspect_ratio ?? config.imageAspectRatio.get(),
                referenceImages,
            };
            const base = {
                kind: 'image-generation',
                prompt: params.prompt,
                model: entry.id,
                provider: entry.provider,
            };
            if (args.run_in_background === false) {
                const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal: exec.signal });
                return { ...base, status: 'completed', images };
            }
            const owner = exec.agent?.id;
            const jobId = startMediaJob(ctx, {
                kind: 'media-image',
                label: params.prompt,
                owner,
                work: async (job, signal) => {
                    job.updateProgress(`generating image with ${entry.id}…`);
                    const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal });
                    const summary = formatImageSummary(images);
                    const agent = lookupAgent(ctx, owner);
                    if (agent !== undefined) {
                        deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`);
                    }
                    return { summary };
                },
            });
            return {
                ...base,
                status: 'started',
                ...(jobId === undefined ? {} : { jobId }),
                images: [],
            };
        },
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:163-195](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L163-L195)

视频caller与live timeout/poll、捕获目录/autoSave。

<details>
<summary>查看原文（33行）</summary>

```text
async function runVideoGeneration(gc, entry, apiKey, params) {
    const generated = await generateVideo(entry, apiKey, {
        prompt: params.prompt,
        seconds: params.seconds,
        size: params.size,
        aspectRatio: params.aspectRatio,
        mode: params.mode,
        ...(params.firstFrame === undefined ? {} : { firstFrame: params.firstFrame }),
        ...(params.lastFrame === undefined ? {} : { lastFrame: params.lastFrame }),
        referenceImages: params.referenceImages,
        signal: params.signal,
        timeoutMs: gc.config.requestTimeoutSec.get() * 1000,
        pollIntervalMs: gc.config.videoPollIntervalSec.get() * 1000,
        pollTimeoutMs: gc.config.videoPollTimeoutSec.get() * 1000,
        ...(params.onProgress === undefined ? {} : { onProgress: params.onProgress }),
    });
    const now = new Date();
    const item = await commitVideo({
        name: `video-${entry.id}-${formatDateStamp(now)}-${now.getTime()}.mp4`,
        bytes: generated.bytes,
        outputDir: gc.outputDir,
        autoSave: true,
    });
    return [item];
}
function generationContext(ctx, config, cwd) {
    return {
        ctx,
        config,
        outputDir: resolveOutputDir(config.outputDir.get(), cwd),
        autoSave: config.autoSave.get(),
    };
}
```

</details>

**依据 4 · 源码核查**：[lib/commands.js:12-32](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/commands.js#L12-L32)

--wait解析与命令附件readImage。

<details>
<summary>查看原文（21行）</summary>

```text
function stripWaitFlag(rawInput) {
    const trimmed = rawInput.trim();
    if (trimmed === WAIT_FLAG)
        return { prompt: '', wait: true };
    if (trimmed.startsWith(`${WAIT_FLAG} `))
        return { prompt: trimmed.slice(WAIT_FLAG.length + 1).trim(), wait: true };
    return { prompt: trimmed, wait: false };
}
function itemLine(item) {
    return item.path === undefined ? `- ${item.name}` : `- \`${item.path}\``;
}
/** Turn the command's submitted attachments into reference-image inputs. */
async function referencesFromAttachments(ctx, invocation) {
    const refs = [];
    for (const block of invocation.attachments) {
        if (block.type !== 'image')
            continue;
        const stored = await ctx.attachments.readImage(block.attachment, invocation.signal);
        refs.push({ dataUri: toDataUri(stored.data, stored.ref.mediaType) });
    }
    return refs;
```

</details>

**依据 5 · 源码核查**：[lib/commands.js:56-100](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/commands.js#L56-L100)

同步图片payload与后台命令实际链。

<details>
<summary>查看原文（45行）</summary>

```text
                if (wait) {
                    const generated = await generateImage(entry, apiKey, {
                        ...params,
                        signal: invocation.signal,
                        timeoutMs: config.requestTimeoutSec.get() * 1000,
                    });
                    const now = new Date();
                    const name = `image-${entry.id}-${formatDateStamp(now)}-${now.getTime()}.${imageExtension(generated.mediaType)}`;
                    const item = await commitImage(ctx.attachments, {
                        name,
                        bytes: generated.bytes,
                        mediaType: generated.mediaType,
                        outputDir,
                        autoSave: config.autoSave.get(),
                    });
                    const text = `✅ 图片生成完成（${entry.label || entry.id}）：\n${itemLine(item)}`;
                    return {
                        kind: 'success',
                        text: `${text}\n${encodeCommandPayload(mediaPayload('image', text, [item]))}`,
                    };
                }
                const agent = invocation.agent;
                startMediaJob(ctx, {
                    kind: 'media-image',
                    label: prompt,
                    owner: agent.id,
                    work: async (job, signal) => {
                        job.updateProgress(`generating image with ${entry.id}…`);
                        const generated = await generateImage(entry, apiKey, { ...params, signal, timeoutMs: config.requestTimeoutSec.get() * 1000 });
                        const now = new Date();
                        const name = `image-${entry.id}-${formatDateStamp(now)}-${now.getTime()}.${imageExtension(generated.mediaType)}`;
                        const item = await commitImage(ctx.attachments, {
                            name,
                            bytes: generated.bytes,
                            mediaType: generated.mediaType,
                            outputDir,
                            autoSave: config.autoSave.get(),
                        });
                        deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, [item]), `图片生成完成（${entry.label || entry.id}）`);
                        return { summary: `image generated: ${item.path ?? item.name}` };
                    },
                });
                return { kind: 'success', text: `⏳ 图片生成已开始（${entry.label || entry.id}），完成后会推送到会话。` };
            }
            catch (error) {
```

</details>

**依据 6 · 源码核查**：[lib/providers.js:104-178](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L104-L178)

真实两类图像HTTP适配/结果选择。

<details>
<summary>查看原文（75行）</summary>

```text
export async function generateImage(entry, apiKey, params) {
    const { signal, dispose } = linkSignal(params.signal, params.timeoutMs);
    try {
        if (entry.provider === 'agnes')
            return await agnesImage(entry, apiKey, params, signal);
        return await openAiImage(entry, apiKey, params, signal);
    }
    finally {
        dispose();
    }
}
async function agnesImage(entry, apiKey, params, signal) {
    const extraBody = { response_format: 'url' };
    if (params.referenceImages.length > 0) {
        extraBody.image = params.referenceImages.map(referenceImageToApi);
    }
    const body = await requestJson(`${entry.baseURL}/images/generations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            size: params.resolution,
            ratio: params.aspectRatio,
            extra_body: extraBody,
        }),
    }, signal);
    const result = extractImageResult(body);
    if (result.b64 !== undefined)
        return decodeBase64Image(result.b64);
    const downloaded = await fetchBytes(result.url, signal, entry.model);
    return { bytes: downloaded.bytes, mediaType: mediaTypeFromContentType(downloaded.mediaType) };
}
async function openAiImage(entry, apiKey, params, signal) {
    const headers = { Authorization: `Bearer ${apiKey}` };
    let body;
    if (params.referenceImages.length === 0) {
        body = await requestJson(`${entry.baseURL}/images/generations`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: entry.model,
                prompt: params.prompt,
                size: openAiSizeFor(params.aspectRatio),
                n: 1,
            }),
        }, signal);
    }
    else {
        // Image-to-image goes through the multipart /images/edits endpoint.
        const form = new FormData();
        form.set('model', entry.model);
        form.set('prompt', params.prompt);
        form.set('size', openAiSizeFor(params.aspectRatio));
        form.set('n', '1');
        let index = 0;
        for (const ref of params.referenceImages) {
            index += 1;
            const { bytes, mediaType } = ref.dataUri !== undefined
                ? decodeDataUri(ref.dataUri)
                : await fetchBytes(ref.url, signal, `reference ${index}`);
            form.append('image[]', new Blob([bytes], { type: mediaType }), `reference-${index}.png`);
        }
        body = await requestJson(`${entry.baseURL}/images/edits`, {
            method: 'POST',
            headers,
            body: form,
        }, signal);
    }
    const result = extractImageResult(body);
    if (result.b64 !== undefined)
        return decodeBase64Image(result.b64);
    const downloaded = await fetchBytes(result.url, signal, entry.model);
    return { bytes: downloaded.bytes, mediaType: mediaTypeFromContentType(downloaded.mediaType) };
}
```

</details>

**依据 7 · 源码核查**：[lib/providers.js:202-312](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L202-L312)

视频提交/轮询/下载完整callee。

<details>
<summary>查看原文（111行）</summary>

```text
export async function generateVideo(entry, apiKey, params) {
    const { signal, dispose } = linkSignal(params.signal, params.timeoutMs);
    const pollDeadline = Date.now() + params.pollTimeoutMs;
    try {
        return entry.provider === 'agnes'
            ? await agnesVideo(entry, apiKey, params, signal, pollDeadline)
            : await openAiVideo(entry, apiKey, params, signal, pollDeadline);
    }
    finally {
        dispose();
    }
}
async function agnesVideo(entry, apiKey, params, signal, pollDeadline) {
    const payload = {
        model: entry.model,
        prompt: params.prompt,
        mode: params.mode,
        // Agnes requires seconds as a STRING ("4"–"12").
        seconds: String(params.seconds),
        size: params.size,
        aspect_ratio: params.aspectRatio,
    };
    if (params.mode === 'keyframe') {
        if (params.firstFrame !== undefined)
            payload.first_frame = referenceImageToApi(params.firstFrame);
        if (params.lastFrame !== undefined)
            payload.last_frame = referenceImageToApi(params.lastFrame);
        if (payload.first_frame === undefined && payload.last_frame === undefined) {
            throw new Error('keyframe mode needs at least one of first_frame / last_frame');
        }
    }
    if (params.mode === 'reference') {
        const images = params.referenceImages.map(referenceImageToApi);
        if (images.length === 0)
            throw new Error('reference mode needs at least one reference image');
        payload.images = images;
    }
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }, signal);
    const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
        : typeof submitted.id === 'string' ? submitted.id : undefined;
    if (videoId === undefined)
        throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${videoId}`);
    // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
    const queryBase = new URL(entry.baseURL).origin;
    const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`;
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(queryUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            if (url === undefined)
                throw new Error(`video task completed without a url: ${JSON.stringify(status).slice(0, 500)}`);
            const downloaded = await fetchBytes(url, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed') {
            const error = status.error;
            throw new Error(`video task failed: ${error?.message ?? JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${videoId}: ${state || 'queued'} ${typeof status.progress === 'number' ? `${status.progress}%` : ''}`.trim());
    }
}
async function openAiVideo(entry, apiKey, params, signal, pollDeadline) {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            seconds: String(params.seconds),
            size: params.size,
        }),
    }, signal);
    const id = typeof submitted.id === 'string' ? submitted.id : undefined;
    if (id === undefined)
        throw new Error(`video submit returned no id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${id}`);
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${id} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(`${entry.baseURL}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            const downloaded = url !== undefined
                ? await fetchBytes(url, signal, entry.model)
                : await fetchBytes(`${entry.baseURL}/videos/${encodeURIComponent(id)}/content`, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed' || state === 'error') {
            throw new Error(`video task failed: ${JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${id}: ${state || 'queued'}`);
    }
}
```

</details>

**依据 8 · 源码核查**：[lib/media.js:101-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L101-L142)

附件先行、可选图片副本/视频始终落盘。

<details>
<summary>查看原文（42行）</summary>

```text
async function writeOutputFile(outputDir, name, bytes) {
    await mkdir(outputDir, { recursive: true });
    const path = join(outputDir, name);
    await writeFile(path, bytes);
    return path;
}
/**
 * Commit one generated image: optional auto-save copy plus a durable image
 * attachment (the inline display currency of the chat UI).
 */
export async function commitImage(attachments, options) {
    const ref = await attachments.saveImage({
        data: options.bytes,
        mediaType: options.mediaType,
        name: basename(options.name),
    });
    let path;
    if (options.autoSave) {
        path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    }
    return {
        kind: 'image',
        name: ref.name ?? basename(options.name),
        ...(path === undefined ? {} : { path }),
        bytes: ref.bytes,
        mediaType: ref.mediaType,
        width: ref.width,
        height: ref.height,
        attachmentId: ref.attachmentId,
    };
}
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options) {
    const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    return {
        kind: 'video',
        name: basename(options.name),
        path,
        bytes: options.bytes.byteLength,
        mediaType: 'video/mp4',
    };
}
```

</details>

**依据 9 · 源码核查**：[lib/types.js:8-28](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/types.js#L8-L28)

命令payload编码/版本解码。

<details>
<summary>查看原文（21行）</summary>

```text
export const COMMAND_PAYLOAD_OPEN = '⟨media-studio⟩';
/** Marker framing the command payload inside `CommandResult.text`. */
export const COMMAND_PAYLOAD_CLOSE = '⟨/media-studio⟩';
/** Frame one payload for `CommandResult.text`. */
export function encodeCommandPayload(payload) {
    return `${COMMAND_PAYLOAD_OPEN}${JSON.stringify(payload)}${COMMAND_PAYLOAD_CLOSE}`;
}
/** Recover the payload from a recorded `CommandNode.outcome.text`, if present. */
export function decodeCommandPayload(text) {
    if (text === undefined)
        return undefined;
    const start = text.indexOf(COMMAND_PAYLOAD_OPEN);
    const end = text.indexOf(COMMAND_PAYLOAD_CLOSE);
    if (start < 0 || end < start)
        return undefined;
    try {
        const parsed = JSON.parse(text.slice(start + COMMAND_PAYLOAD_OPEN.length, end));
        return parsed !== null && typeof parsed === 'object' && parsed.v === 1 ? parsed : undefined;
    }
    catch {
        return undefined;
```

</details>

**依据 10 · 源码核查**：[lib/client.js:471-490](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L471-L490)

实际命令卡解码items。

<details>
<summary>查看原文（20行）</summary>

```text
function MediaCommandRow(props) {
  const { node } = props;
  const title = node.name === "video" ? "\u{1F3AC} /video" : "\u{1F5BC}\uFE0F /image";
  const args = node.args?.trim() ?? "";
  const outcome = node.outcome;
  const payload = decodeCommandPayload(outcome?.text);
  const plain = stripCommandPayload(outcome?.text).trim();
  const failed = outcome?.kind === "error";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: containerStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, opacity: 0.85 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { opacity: 0.75 }, children: args.slice(0, 120) }),
      outcome === null ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { opacity: 0.7 }, children: "\u751F\u6210\u4E2D\u2026" }) : null,
      failed ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { style: { color: "#d9534f" }, children: "\u5931\u8D25" }) : null
    ] }),
    failed && plain !== "" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, color: "#d9534f", whiteSpace: "pre-wrap" }, children: plain }) : null,
    payload !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(MediaItemGrid, { items: payload.items }) : null,
    !failed && plain !== "" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontSize: 12, opacity: 0.75, whiteSpace: "pre-wrap" }, children: plain }) : null
  ] });
}
```

</details>

**依据 11 · 源码核查**：[lib/client.js:1383-1408](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1383-L1408)

实际工具卡从meta读取items。

<details>
<summary>查看原文（26行）</summary>

```text
function MediaToolRow(props) {
  const { phase, block, toolName } = props;
  const title = toolName === "generate_image" ? "\u{1F5BC}\uFE0F \u751F\u6210\u56FE\u7247" : toolName === "generate_video" ? "\u{1F3AC} \u751F\u6210\u89C6\u9891" : "\u{1F4CE} \u53D1\u9001\u5A92\u4F53\u6587\u4EF6";
  if (phase !== "result") {
    const prompt = promptFromArgs(block.argsRaw ?? block.call?.argsRaw);
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: containerStyle2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: headStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: title }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { opacity: 0.7 }, children: "\u751F\u6210\u4E2D\u2026" })
      ] }),
      prompt === "" ? null : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 12, opacity: 0.75 }, children: prompt })
    ] });
  }
  const meta = parseMediaMeta(block.meta);
  const text = firstText(block).trim();
  const failed = block.isError === true;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: containerStyle2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: headStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: failed ? "\u26A0\uFE0F" : title }),
      failed ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { style: { color: "#d9534f" }, children: "\u5931\u8D25" }) : null
    ] }),
    failed && text !== "" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 12, color: "#d9534f", whiteSpace: "pre-wrap" }, children: text }) : null,
    meta !== void 0 && meta.items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(MediaItemGrid, { items: meta.items }) : null,
    !failed && text !== "" ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { fontSize: 12, opacity: 0.75, whiteSpace: "pre-wrap" }, children: text }) : null
  ] });
}
```

</details>

**依据 12 · 源码核查**：[lib/client.js:355-408](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L355-L408)

视频URL与图片path门槛。

<details>
<summary>查看原文（54行）</summary>

```text
function MediaVideoCard({ item }) {
  const url = apiFileUrl(item.path);
  const name = fileLabel(item);
  if (url === void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontSize: 12, opacity: 0.75 }, children: [
      name,
      "\uFF08\u6587\u4EF6\u672A\u843D\u76D8\uFF0C\u65E0\u6CD5\u5185\u8054\u64AD\u653E\uFF09"
    ] });
  }
  const sizeText = formatBytes(item.bytes);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "video",
      {
        controls: true,
        preload: "metadata",
        src: url,
        style: {
          width: "min(520px, 100%)",
          maxHeight: "70vh",
          borderRadius: 10,
          background: "#000",
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          display: "block"
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 10, alignItems: "center", maxWidth: "min(520px, 100%)" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 12, opacity: 0.7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        "\u{1F3AC} ",
        name,
        sizeText === "" ? "" : ` \xB7 ${sizeText}`
      ] }),
      item.path === void 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenSystemButton, { path: item.path, style: { marginLeft: "auto", flexShrink: 0 } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DownloadButton, { url, name, style: { flexShrink: 0, ...item.path === void 0 ? { marginLeft: "auto" } : {} } })
    ] })
  ] });
}
function MediaItemGrid({ items }) {
  const [opened, setOpened] = (0, import_react.useState)(void 0);
  const images = items.filter((item) => item.kind === "image");
  const videos = items.filter((item) => item.kind === "video");
  const others = items.filter((item) => item.kind !== "image" && item.kind !== "video");
  const many = images.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
    images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: images.map((item) => {
      const url = apiFileUrl(item.path);
      const name = fileLabel(item);
      if (url === void 0) return null;
      const sizeText = formatBytes(item.bytes);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: "100%" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · started、取消与完成通知能保证交付吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。主入口把jobs列为强依赖，因此“没有jobs也正常加载”不是成立的兼容承诺；但startMediaJob调用jobs.start一旦同步抛错，会新建controller并void runWork，返回undefined。工具仍返回started但无jobId，两个后台命令即使start成功也不将返回jobId写入命令结果。detached的失败会被runWork捕获成failed结果再丢弃，没有自己的错误notice/可查询句柄；正常注册的失败则把状态交Host jobs，实际持久/显示能力仍依赖Host。

成功work先生成/保存，再工具按owner查live agents（命令则捕获原agent），只有拿到对象才调用deliverMediaMessage。idle用followup、忙用inject；catch只处理同步抛错，重试inject再吞，既无用户送达/渲染确认也未等待send_media结果。通知source正确标为media-studio notice，但其内容明确要求Agent“立即调用send_media”；原started工具值没有本插件的终态重写。故还依赖活会话、继续模型调用、正确工具执行与文件视图，模型未接续/会话处置时文件保存不等用户收到。

取消确实abort传给fetch/sleep的信号，但没有远端cancel请求；不能据本地killed断言供应商停止或退款。附件/文件保存及notice阶段没消费该signal，也无成功前的最终aborted检查，取消若落在这些阶段仍可能保存/投递并返回completed。生成返回后图片先保存附件再写副本，后一步失败不会撤销前一步；已生成但下载/存储失败也没有远端费用回滚。

视频远端ID确实会出现在onProgress的“submitted”及后续进度，不能称从未记录任何ID；后台工具将它投给job.updateProgress。可是本组件没有持久“远端ID/文件/附件/会话结果”的对账记录或接受既有ID续查的入口，Host是否保存进度/重启恢复另未知。requestTimeoutSec是整个provider链信号，pollDeadline从提交前计时；超时不是远端任务终态。未知结果应先核原ID/Host job和磁盘，不盲发另一个生成。这些是静态分支与未验边界，不是已复现丢作品/重复扣费。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4-10](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/index.js#L4-L10)

jobs真实强依赖，不能拿fallback注释代替主caller。

```text
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

**依据 2 · 源码核查**：[lib/jobs.js:43-81](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/jobs.js#L43-L81)

受控任务signal/结果与detached fallback，完成分支不再检查abort。

<details>
<summary>查看原文（39行）</summary>

```text
export function startMediaJob(ctx, request) {
    const runWork = (job, controller) => (async () => {
        try {
            const { summary } = await request.work(job, controller.signal);
            return { status: 'completed', detail: 'media generated', result: summary };
        }
        catch (error) {
            return {
                status: controller.signal.aborted ? 'killed' : 'failed',
                detail: error instanceof Error ? error.message : String(error),
            };
        }
    })();
    try {
        const jobId = ctx.jobs.start({
            kind: request.kind,
            label: request.label.slice(0, 120),
            owner: request.owner,
            run: (job) => {
                const controller = new AbortController();
                const done = runWork({
                    append: text => job.append(text),
                    updateProgress: line => job.updateProgress(line),
                }, controller);
                return {
                    cancel: () => controller.abort(),
                    done,
                };
            },
        });
        return jobId;
    }
    catch {
        // No attached job controller (or the registry refused): run detached.
        const controller = new AbortController();
        void runWork({ append: () => undefined, updateProgress: () => undefined }, controller);
        return undefined;
    }
}
```

</details>

**依据 3 · 源码核查**：[lib/tools.js:256-288](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L256-L288)

owner查找、notice调用和started可无jobId。

<details>
<summary>查看原文（33行）</summary>

```text
            const base = {
                kind: 'image-generation',
                prompt: params.prompt,
                model: entry.id,
                provider: entry.provider,
            };
            if (args.run_in_background === false) {
                const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal: exec.signal });
                return { ...base, status: 'completed', images };
            }
            const owner = exec.agent?.id;
            const jobId = startMediaJob(ctx, {
                kind: 'media-image',
                label: params.prompt,
                owner,
                work: async (job, signal) => {
                    job.updateProgress(`generating image with ${entry.id}…`);
                    const images = await runImageGeneration(gc, entry, apiKey, { ...params, signal });
                    const summary = formatImageSummary(images);
                    const agent = lookupAgent(ctx, owner);
                    if (agent !== undefined) {
                        deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, images), `图片生成完成（${entry.label || entry.id}）`);
                    }
                    return { summary };
                },
            });
            return {
                ...base,
                status: 'started',
                ...(jobId === undefined ? {} : { jobId }),
                images: [],
            };
        },
```

</details>

**依据 4 · 源码核查**：[lib/commands.js:74-99](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/commands.js#L74-L99)

命令忽略start返回值而只报开始。

<details>
<summary>查看原文（26行）</summary>

```text
                        text: `${text}\n${encodeCommandPayload(mediaPayload('image', text, [item]))}`,
                    };
                }
                const agent = invocation.agent;
                startMediaJob(ctx, {
                    kind: 'media-image',
                    label: prompt,
                    owner: agent.id,
                    work: async (job, signal) => {
                        job.updateProgress(`generating image with ${entry.id}…`);
                        const generated = await generateImage(entry, apiKey, { ...params, signal, timeoutMs: config.requestTimeoutSec.get() * 1000 });
                        const now = new Date();
                        const name = `image-${entry.id}-${formatDateStamp(now)}-${now.getTime()}.${imageExtension(generated.mediaType)}`;
                        const item = await commitImage(ctx.attachments, {
                            name,
                            bytes: generated.bytes,
                            mediaType: generated.mediaType,
                            outputDir,
                            autoSave: config.autoSave.get(),
                        });
                        deliverMediaMessage(agent, buildImagePushContent(`🖼️ 图片生成完成（${entry.label || entry.id}）`, [item]), `图片生成完成（${entry.label || entry.id}）`);
                        return { summary: `image generated: ${item.path ?? item.name}` };
                    },
                });
                return { kind: 'success', text: `⏳ 图片生成已开始（${entry.label || entry.id}），完成后会推送到会话。` };
            }
```

</details>

**依据 5 · 源码核查**：[lib/jobs.js:3-37](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/jobs.js#L3-L37)

live registry、notice来源与仅同步异常处理，无送达回执。

<details>
<summary>查看原文（35行）</summary>

```text
export function lookupAgent(ctx, sessionId) {
    if (sessionId === undefined)
        return undefined;
    const registry = ctx.get('agents');
    return registry?.get(sessionId);
}
/**
 * Deliver finished media into the owning conversation as a completion notice.
 *
 * The message source declares this plugin's own producer kind with
 * `form: 'notice'` — exactly like `dsh-tool-jobs` completion notices — so the
 * UI renders it as a task notice (not a user bubble) and the model reads it as
 * a job outcome instead of something the user said. Image blocks render as an
 * inline gallery; text carries the auto-saved paths.
 */
export function deliverMediaMessage(agent, content, summary) {
    const message = createUserMessage({
        content,
        source: { kind: 'media-studio', form: 'notice', summary: boundContextSummary(summary) },
    });
    try {
        if (agent.status === 'idle')
            agent.followup(message);
        else
            agent.inject(message);
    }
    catch {
        try {
            agent.inject(message);
        }
        catch {
            // The agent may already be disposed; nothing else to deliver to.
        }
    }
}
```

</details>

**依据 6 · 源码核查**：[lib/tools.js:113-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L113-L142)

通知明确要求Agent再send_media，不是直接用户完成凭据。

<details>
<summary>查看原文（30行）</summary>

```text
}
/** Build the chat push content for finished images. The trailing instruction
 *  makes the woken agent surface the files itself: completion notices ride the
 *  followup/inject channel, which feeds the model but renders no content, so
 *  the only way media shows up in the conversation is a tool row (send_media). */
export function buildImagePushContent(headline, images) {
    const blocks = [{
            type: 'text',
            text: `${headline}\n${images.map(itemLine).join('\n')}\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
    for (const item of images) {
        const block = imageBlockFor(item);
        if (block !== undefined)
            blocks.push(block);
    }
    return blocks;
}
/** Build the chat push content for a finished video. */
export function buildVideoPushContent(headline, videos) {
    const lines = videos.map(item => {
        const sizeMb = (item.bytes / (1024 * 1024)).toFixed(1);
        return item.path === undefined
            ? `- ${item.name}（${sizeMb} MB）`
            : `- \`${item.path}\`（${sizeMb} MB）`;
    });
    return [{
            type: 'text',
            text: `${headline}\n${lines.join('\n')}\n文件已保存到输出目录。\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
}
```

</details>

**依据 7 · 源码核查**：[lib/tools.js:355-386](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L355-L386)

视频work/进度、保存后再lookup/通知。

<details>
<summary>查看原文（32行）</summary>

```text
            };
            if (args.run_in_background === false) {
                const videos = await runVideoGeneration(gc, entry, apiKey, { ...params, signal: exec.signal });
                return { ...base, status: 'completed', videos };
            }
            const owner = exec.agent?.id;
            const jobId = startMediaJob(ctx, {
                kind: 'media-video',
                label: params.prompt,
                owner,
                work: async (job, signal) => {
                    job.updateProgress(`generating video with ${entry.id}…`);
                    const videos = await runVideoGeneration(gc, entry, apiKey, {
                        ...params,
                        signal,
                        onProgress: line => job.updateProgress(line),
                    });
                    const summary = formatVideoSummary(videos);
                    const agent = lookupAgent(ctx, owner);
                    if (agent !== undefined) {
                        deliverMediaMessage(agent, buildVideoPushContent(`🎬 视频生成完成（${entry.label || entry.id}）`, videos), `视频生成完成（${entry.label || entry.id}）`);
                    }
                    return { summary };
                },
            });
            return {
                ...base,
                status: 'started',
                ...(jobId === undefined ? {} : { jobId }),
                videos: [],
            };
        },
```

</details>

**依据 8 · 源码核查**：[lib/providers.js:202-213](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L202-L213)

全链信号与提交前轮询deadline。

<details>
<summary>查看原文（12行）</summary>

```text
export async function generateVideo(entry, apiKey, params) {
    const { signal, dispose } = linkSignal(params.signal, params.timeoutMs);
    const pollDeadline = Date.now() + params.pollTimeoutMs;
    try {
        return entry.provider === 'agnes'
            ? await agnesVideo(entry, apiKey, params, signal, pollDeadline)
            : await openAiVideo(entry, apiKey, params, signal, pollDeadline);
    }
    finally {
        dispose();
    }
}
```

</details>

**依据 9 · 源码核查**：[lib/providers.js:238-273](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L238-L273)

Agnes远端ID出现在进度及轮询。

<details>
<summary>查看原文（36行）</summary>

```text
    }
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }, signal);
    const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
        : typeof submitted.id === 'string' ? submitted.id : undefined;
    if (videoId === undefined)
        throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${videoId}`);
    // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
    const queryBase = new URL(entry.baseURL).origin;
    const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`;
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(queryUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            if (url === undefined)
                throw new Error(`video task completed without a url: ${JSON.stringify(status).slice(0, 500)}`);
            const downloaded = await fetchBytes(url, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed') {
            const error = status.error;
            throw new Error(`video task failed: ${error?.message ?? JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${videoId}: ${state || 'queued'} ${typeof status.progress === 'number' ? `${status.progress}%` : ''}`.trim());
    }
```

</details>

**依据 10 · 源码核查**：[lib/providers.js:275-312](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L275-L312)

另一视频适配的ID/进度/超时及无cancel请求。

<details>
<summary>查看原文（38行）</summary>

```text
async function openAiVideo(entry, apiKey, params, signal, pollDeadline) {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            seconds: String(params.seconds),
            size: params.size,
        }),
    }, signal);
    const id = typeof submitted.id === 'string' ? submitted.id : undefined;
    if (id === undefined)
        throw new Error(`video submit returned no id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${id}`);
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${id} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(`${entry.baseURL}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            const downloaded = url !== undefined
                ? await fetchBytes(url, signal, entry.model)
                : await fetchBytes(`${entry.baseURL}/videos/${encodeURIComponent(id)}/content`, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed' || state === 'error') {
            throw new Error(`video task failed: ${JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${id}: ${state || 'queued'}`);
    }
}
```

</details>

**依据 11 · 源码核查**：[lib/media.js:111-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L111-L142)

本地提交无signal、附件和文件非一事务。

<details>
<summary>查看原文（32行）</summary>

```text
export async function commitImage(attachments, options) {
    const ref = await attachments.saveImage({
        data: options.bytes,
        mediaType: options.mediaType,
        name: basename(options.name),
    });
    let path;
    if (options.autoSave) {
        path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    }
    return {
        kind: 'image',
        name: ref.name ?? basename(options.name),
        ...(path === undefined ? {} : { path }),
        bytes: ref.bytes,
        mediaType: ref.mediaType,
        width: ref.width,
        height: ref.height,
        attachmentId: ref.attachmentId,
    };
}
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options) {
    const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    return {
        kind: 'video',
        name: basename(options.name),
        path,
        bytes: options.bytes.byteLength,
        mediaType: 'video/mp4',
    };
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 参数、素材、配置和本地视图还有什么具体反例？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

协议名不能替代逐后端能力。OpenAI图片分支size只从aspect_ratio取横/竖/方固定档，不使用resolution，设置4K不能据此称该分支发4K；Agnes才原样传resolution/ratio。非Agnes视频payload仅model/prompt/seconds/size，mode、首尾帧、参考图和aspect_ratio即使被工具接受/读取也没有进入该请求，不能称所有视频后端支持图生/关键帧。OpenAI视频无URL时下载/videos/id/content，fetchBytes只传signal不带前面提交/查询使用的Authorization，私人content和签名URL需分开验。结果和参考图URL下载均整arrayBuffer，未设置长度/来源上限；这些是当前适配行为，不是供应商现状判断。

工具参考图的http(s)/data直接接受，本地路径按process.cwd解析，输出相对目录却用会话cwd；send_media亦直接读所给路径（先describe还会整读、图片再读一次）。没有组件内文件/URL来源沙箱或大小限额，素材可被转dataURI外发；宿主工具权限/授权是否限制需独立核，不等已绕过权限。输出文件名用basename、默认目录会传moduleUrl做profile探测，此处不同于没有传参的回落实现；profile未识别仍回家目录，profile不是租户隔离。

autoSave=false只停图片副本，不停attachment持久保存，视频仍落盘。自定义MediaItemGrid的图片没有path就return null，并不按attachmentId加载；后台通知又要求只接受本地paths的send_media，因此name-only附件不能直接走这条工具桥接。原始工具render确有image块，通用消息图库也能loadImage，故不说整个宿主一定不可见；应分别核实际卡片/宿主附件呈现和后台交回。file URL对绝对路径、控制字/双斜杠有过滤，但Host api/file实际权限、视频编解码和远程Web路径位置仍待验。原生打开先probe再按钮调用、失败返回false且onclick丢结果，不等文件已打开；通用消息/用户图片槽注册没有本插件producer过滤，启用/禁用也要回归普通图片。

配置卡已有id格式/重复/必填校验和scope.mutate(ops,snap.revision)，不能说没有并发检查；revision取于保存时，非草稿开始时，并且先写配置后逐条写凭据，不是一个事务。自动deriveRef会大写并把非[A-Z0-9_]替成下划线，合法且不同的a-b/a_b都会映成MEDIA_STUDIO_A_B；seenIds只查原id，不去重最终引用，若各填不同key后者可写同一引用。应显式确认/区分引用，不能假定每模型独占key；这是源码条件，未执行覆盖实验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/providers.js:13-24](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L13-L24)

OpenAI图片只有方向档及组合信号。

<details>
<summary>查看原文（12行）</summary>

```text
function openAiSizeFor(aspectRatio) {
    const table = AGNES_SIZE_TABLE[aspectRatio] ?? AGNES_SIZE_TABLE['1:1'];
    const [w, h] = table['1K'];
    if (w === h)
        return '1024x1024';
    return w > h ? '1536x1024' : '1024x1536';
}
/** Combine our timeout budget with the caller's cancellation signal. */
function linkSignal(signal, timeoutMs) {
    const timeout = AbortSignal.timeout(timeoutMs);
    const combined = AbortSignal.any([signal, timeout]);
    return { signal: combined, dispose: () => undefined };
```

</details>

**依据 2 · 源码核查**：[lib/providers.js:115-178](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L115-L178)

Agnes传resolution/ratio而OpenAI图片resolution不入OpenAI负载，参考图下载/multipart。

<details>
<summary>查看原文（64行）</summary>

```text
async function agnesImage(entry, apiKey, params, signal) {
    const extraBody = { response_format: 'url' };
    if (params.referenceImages.length > 0) {
        extraBody.image = params.referenceImages.map(referenceImageToApi);
    }
    const body = await requestJson(`${entry.baseURL}/images/generations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            size: params.resolution,
            ratio: params.aspectRatio,
            extra_body: extraBody,
        }),
    }, signal);
    const result = extractImageResult(body);
    if (result.b64 !== undefined)
        return decodeBase64Image(result.b64);
    const downloaded = await fetchBytes(result.url, signal, entry.model);
    return { bytes: downloaded.bytes, mediaType: mediaTypeFromContentType(downloaded.mediaType) };
}
async function openAiImage(entry, apiKey, params, signal) {
    const headers = { Authorization: `Bearer ${apiKey}` };
    let body;
    if (params.referenceImages.length === 0) {
        body = await requestJson(`${entry.baseURL}/images/generations`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: entry.model,
                prompt: params.prompt,
                size: openAiSizeFor(params.aspectRatio),
                n: 1,
            }),
        }, signal);
    }
    else {
        // Image-to-image goes through the multipart /images/edits endpoint.
        const form = new FormData();
        form.set('model', entry.model);
        form.set('prompt', params.prompt);
        form.set('size', openAiSizeFor(params.aspectRatio));
        form.set('n', '1');
        let index = 0;
        for (const ref of params.referenceImages) {
            index += 1;
            const { bytes, mediaType } = ref.dataUri !== undefined
                ? decodeDataUri(ref.dataUri)
                : await fetchBytes(ref.url, signal, `reference ${index}`);
            form.append('image[]', new Blob([bytes], { type: mediaType }), `reference-${index}.png`);
        }
        body = await requestJson(`${entry.baseURL}/images/edits`, {
            method: 'POST',
            headers,
            body: form,
        }, signal);
    }
    const result = extractImageResult(body);
    if (result.b64 !== undefined)
        return decodeBase64Image(result.b64);
    const downloaded = await fetchBytes(result.url, signal, entry.model);
    return { bytes: downloaded.bytes, mediaType: mediaTypeFromContentType(downloaded.mediaType) };
}
```

</details>

**依据 3 · 源码核查**：[lib/providers.js:275-312](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L275-L312)

视频payload遗漏模式/帧/参考/画幅，content下载调用。

<details>
<summary>查看原文（38行）</summary>

```text
async function openAiVideo(entry, apiKey, params, signal, pollDeadline) {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            seconds: String(params.seconds),
            size: params.size,
        }),
    }, signal);
    const id = typeof submitted.id === 'string' ? submitted.id : undefined;
    if (id === undefined)
        throw new Error(`video submit returned no id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${id}`);
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${id} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(`${entry.baseURL}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            const downloaded = url !== undefined
                ? await fetchBytes(url, signal, entry.model)
                : await fetchBytes(`${entry.baseURL}/videos/${encodeURIComponent(id)}/content`, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed' || state === 'error') {
            throw new Error(`video task failed: ${JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${id}: ${state || 'queued'}`);
    }
}
```

</details>

**依据 4 · 源码核查**：[lib/providers.js:34-45](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L34-L45)

fetchBytes无Authorization/长度或来源检查，整buffer。

<details>
<summary>查看原文（12行）</summary>

```text
async function requestJson(url, init, signal) {
    const response = await fetch(url, { ...init, signal });
    if (!response.ok)
        throw new Error(`${init.method ?? 'GET'} ${url} failed — ${await readError(response)}`);
    return await response.json();
}
async function fetchBytes(url, signal, hint) {
    const response = await fetch(url, { signal });
    if (!response.ok)
        throw new Error(`downloading result failed (${hint}) — ${await readError(response)}`);
    const buffer = new Uint8Array(await response.arrayBuffer());
    return { bytes: buffer, mediaType: response.headers.get('content-type')?.split(';')[0] ?? '' };
```

</details>

**依据 5 · 源码核查**：[lib/media.js:65-75](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L65-L75)

参考图本地路径取进程cwd并外发格式。

<details>
<summary>查看原文（11行）</summary>

```text
export async function readReferenceImage(input) {
    const trimmed = input.trim();
    if (/^https?:\/\//i.test(trimmed))
        return { url: trimmed };
    if (/^data:/i.test(trimmed))
        return { dataUri: trimmed };
    const path = isAbsolute(trimmed) ? trimmed : resolve(process.cwd(), trimmed);
    const bytes = new Uint8Array(await readFile(path));
    const mediaType = imageMediaTypeForPath(path) ?? sniffImageMediaType(bytes) ?? 'image/png';
    return { dataUri: toDataUri(bytes, mediaType) };
}
```

</details>

**依据 6 · 源码核查**：[lib/tools.js:418-442](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L418-L442)

send_media直接描述/再读图片。

<details>
<summary>查看原文（25行）</summary>

```text
        async execute(args) {
            const paths = args.paths;
            if (paths.length === 0)
                throw new Error('paths must not be empty');
            const files = [];
            for (const rawPath of paths) {
                const described = await describeLocalFile(rawPath);
                if (described.kind === 'image') {
                    const { readFile } = await import('node:fs/promises');
                    const bytes = new Uint8Array(await readFile(described.path));
                    const mediaType = imageMediaTypeForPath(described.path) ?? sniffImageMediaType(bytes) ?? 'image/png';
                    const ref = await ctx.attachments.saveImage({ data: bytes, mediaType, name: described.name });
                    files.push({
                        ...described,
                        bytes: ref.bytes,
                        mediaType: ref.mediaType,
                        width: ref.width,
                        height: ref.height,
                        attachmentId: ref.attachmentId,
                    });
                }
                else {
                    files.push(described);
                }
            }
```

</details>

**依据 7 · 源码核查**：[lib/profile-dir.js:57-86](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/profile-dir.js#L57-L86)

profile探测只接收存在目录，DSH_HOME与回退边界。

<details>
<summary>查看原文（30行）</summary>

```text
 */
export function detectProfileName(options = {}) {
    const base = String(process.env.DSH_HOME ?? '').trim() || join(os.homedir(), '.dsh');
    const profilesDir = join(base, 'profiles');
    const valid = (name) => {
        const n = sanitizeProfileName(name);
        return n && fs.existsSync(join(profilesDir, n)) ? n : '';
    };
    const fromEnv = valid(process.env.DSH_PROFILE);
    if (fromEnv)
        return fromEnv;
    const fromArgv = valid(profileNameFromArgv(process.argv.slice(2)));
    if (fromArgv)
        return fromArgv;
    if (options.moduleUrl)
        return valid(profileNameFromModuleUrl(options.moduleUrl, profilesDir));
    return '';
}
/**
 * The profile-scoped default for one data directory:
 * `<home>/profiles/<profile>/<dir>`, or `undefined` when no profile is active
 * (the caller keeps its legacy default).
 */
export function profileScopedDefault(dir, options = {}) {
    const profile = detectProfileName(options);
    if (!profile)
        return undefined;
    const base = String(process.env.DSH_HOME ?? '').trim() || join(os.homedir(), '.dsh');
    return join(base, 'profiles', profile, dir);
}
```

</details>

**依据 8 · 源码核查**：[lib/media.js:91-98](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L91-L98)

输出会话cwd及profile moduleUrl真实caller。

```text
export function resolveOutputDir(outputDir, cwd) {
    const raw = outputDir.trim();
    const effective = raw === LEGACY_DEFAULT_OUTPUT_DIR
        ? profileScopedDefault('media-studio', { moduleUrl: import.meta.url }) ?? raw
        : raw;
    const expanded = effective === '~' || effective.startsWith('~/') || effective.startsWith('~\\')
        ? join(homedir(), effective.slice(1))
        : effective;
```

**依据 9 · 源码核查**：[lib/media.js:111-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L111-L142)

autoSave仅图片副本，视频始终存盘。

<details>
<summary>查看原文（32行）</summary>

```text
export async function commitImage(attachments, options) {
    const ref = await attachments.saveImage({
        data: options.bytes,
        mediaType: options.mediaType,
        name: basename(options.name),
    });
    let path;
    if (options.autoSave) {
        path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    }
    return {
        kind: 'image',
        name: ref.name ?? basename(options.name),
        ...(path === undefined ? {} : { path }),
        bytes: ref.bytes,
        mediaType: ref.mediaType,
        width: ref.width,
        height: ref.height,
        attachmentId: ref.attachmentId,
    };
}
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options) {
    const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    return {
        kind: 'video',
        name: basename(options.name),
        path,
        bytes: options.bytes.byteLength,
        mediaType: 'video/mp4',
    };
}
```

</details>

**依据 10 · 源码核查**：[lib/client.js:393-408](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L393-L408)

图片卡片必须有path。

<details>
<summary>查看原文（16行）</summary>

```text
function MediaItemGrid({ items }) {
  const [opened, setOpened] = (0, import_react.useState)(void 0);
  const images = items.filter((item) => item.kind === "image");
  const videos = items.filter((item) => item.kind === "video");
  const others = items.filter((item) => item.kind !== "image" && item.kind !== "video");
  const many = images.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
    images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: images.map((item) => {
      const url = apiFileUrl(item.path);
      const name = fileLabel(item);
      if (url === void 0) return null;
      const sizeText = formatBytes(item.bytes);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: "100%" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
```

</details>

**依据 11 · 源码核查**：[lib/tools.js:113-129](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L113-L129)

后台桥接用文件名/可选path和image块。

<details>
<summary>查看原文（17行）</summary>

```text
}
/** Build the chat push content for finished images. The trailing instruction
 *  makes the woken agent surface the files itself: completion notices ride the
 *  followup/inject channel, which feeds the model but renders no content, so
 *  the only way media shows up in the conversation is a tool row (send_media). */
export function buildImagePushContent(headline, images) {
    const blocks = [{
            type: 'text',
            text: `${headline}\n${images.map(itemLine).join('\n')}\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
    for (const item of images) {
        const block = imageBlockFor(item);
        if (block !== undefined)
            blocks.push(block);
    }
    return blocks;
}
```

</details>

**依据 12 · 源码核查**：[lib/client.js:58-145](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L58-L145)

native probe/调用与file URL过滤，非成功打开回执。

<details>
<summary>查看原文（88行）</summary>

```text
function bindNativeOpen(sessionRemote) {
  const candidate = sessionRemote;
  session = candidate !== void 0 && typeof candidate.openWorkspacePath === "function" ? candidate : void 0;
}
function probeNativeOpen() {
  availability ??= (async () => {
    if (session === void 0 || session.canOpenWorkspacePath === void 0) return false;
    try {
      const result = await session.canOpenWorkspacePath();
      return result.ok === true && result.value === true;
    } catch {
      return false;
    }
  })();
  return availability;
}
async function nativeOpenPath(path) {
  if (session === void 0 || session.openWorkspacePath === void 0) return false;
  try {
    const result = await session.openWorkspacePath({ path });
    return result.ok === true;
  } catch {
    return false;
  }
}

// Z:/dsh/@gw/dsh-media-studio/src/client/media.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ABSOLUTE_PATH = /^(?:\/|[A-Za-z]:[\\/])/;
function apiFileUrl(path) {
  if (path === void 0 || !ABSOLUTE_PATH.test(path) || path.startsWith("//")) return void 0;
  if (/[\u0000-\u001f\u007f]/.test(path)) return void 0;
  try {
    return new URL(`api/file?path=${encodeURIComponent(path)}`, document.baseURI).href;
  } catch {
    return void 0;
  }
}
function fileLabel(item) {
  return item.name;
}
function formatBytes(bytes) {
  if (bytes === void 0 || !Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
function DownloadButton({ url, name, style }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "a",
    {
      href: url,
      download: name,
      style: { fontSize: 12, color: "#4a90d9", textDecoration: "none", cursor: "pointer", ...style },
      children: "\u2B07 \u4E0B\u8F7D"
    }
  );
}
function OpenSystemButton({ path, style }) {
  const [available, setAvailable] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    let cancelled = false;
    void probeNativeOpen().then((ok) => {
      if (!cancelled) setAvailable(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!available) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      title: "\u7528\u7CFB\u7EDF\u9ED8\u8BA4\u5E94\u7528\u6253\u5F00",
      onClick: () => void nativeOpenPath(path),
      style: {
        fontSize: 12,
        color: "#4a90d9",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        ...style
      },
      children: "\u{1F5A5} \u6253\u5F00"
    }
  );
```

</details>

**依据 13 · 源码核查**：[lib/client.js:1410-1434](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1410-L1434)

通用图片槽贡献未按自身producer过滤。

<details>
<summary>查看原文（25行）</summary>

```text
// Z:/dsh/@gw/dsh-media-studio/src/client/index.ts
var inject = ["slots", "remote", "remote.session", "remote.credentials", "configForms"];
function apply(ctx) {
  bindNativeOpen(ctx["remote.session"] ?? ctx.remote?.session);
  for (const key of ["generate_image", "generate_video", "send_media"]) {
    ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
      { name: "tool.call.toolview", key },
      MediaToolRow
    ));
  }
  for (const key of ["image", "video"]) {
    ctx.slots.inject("conversation.chat.commandview", () => ctx.slots.register(
      { name: "conversation.chat.commandview", key },
      MediaCommandRow
    ));
  }
  for (const name of ["conversation.chat.message.images", "conversation.chat.user.images"]) {
    ctx.slots.inject(name, () => ctx.slots.register(
      { name, priority: -1 },
      MessageMediaImages
    ));
  }
  registerConfigCard(ctx);
}
;Object.defineProperty(module.exports,Symbol.toStringTag,{value:"Module"});return module.exports}});
```

</details>

**依据 14 · 源码核查**：[lib/client.js:513-514](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L513-L514)

id/引用名格式。

```text
var ID_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*$/;
var ENV_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
```

**依据 15 · 源码核查**：[lib/client.js:681-683](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L681-L683)

deriveRef归一映射。

```text
function deriveRef(id) {
  return `MEDIA_STUDIO_${id.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_")}`;
}
```

**依据 16 · 源码核查**：[lib/client.js:1010-1080](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1010-L1080)

已有id去重、保存时revision、先配置后按引用写key。

<details>
<summary>查看原文（71行）</summary>

```text
      if (!ID_PATTERN.test(d.id.trim())) {
        setError(`\u6761\u76EE id\u300C${d.id || "(\u7A7A)"}\u300D\u8981\u4EE5\u5B57\u6BCD\u6216\u4E0B\u5212\u7EBF\u5F00\u5934\uFF0C\u53EA\u80FD\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u3001\u8FDE\u5B57\u7B26`);
        return;
      }
      if (seenIds.has(d.id.trim())) {
        setError(`\u6761\u76EE id\u300C${d.id}\u300D\u91CD\u590D\u4E86\uFF0C\u6539\u4E00\u4E2A\u4E0D\u4E00\u6837\u7684`);
        return;
      }
      seenIds.add(d.id.trim());
      if (d.model.trim() === "") {
        setError(`\u6761\u76EE\u300C${d.id}\u300D\u7684\u6A21\u578B\u540D\u4E0D\u80FD\u4E3A\u7A7A`);
        return;
      }
      if (d.baseURL.trim() === "") {
        setError(`\u6761\u76EE\u300C${d.id}\u300D\u7684\u63A5\u53E3\u5730\u5740\u4E0D\u80FD\u4E3A\u7A7A`);
        return;
      }
      if (d.apiKeyEnv.trim() !== "" && !ENV_PATTERN.test(d.apiKeyEnv.trim())) {
        setError(`\u6761\u76EE\u300C${d.id}\u300D\u7684\u51ED\u636E\u540D\u5FC5\u987B\u662F\u5408\u6CD5\u73AF\u5883\u53D8\u91CF\u540D\uFF08\u4E0D\u80FD\u5E26\u8FDE\u5B57\u7B26\uFF09`);
        return;
      }
    }
    for (const [key, label] of Object.entries(REQUIRED_PARAMS)) {
      if (String(params[key] ?? "").trim() === "") {
        setError(`\u300C${label}\u300D\u4E0D\u80FD\u4E3A\u7A7A`);
        return;
      }
    }
    setBusy(true);
    setError("");
    setSaveFailed(false);
    try {
      const fillRef = (d) => d.apiKeyEnv.trim() === "" ? { ...d, apiKeyEnv: deriveRef(d.id) } : d;
      const imageDraftsFilled = imageDrafts.map(fillRef);
      const videoDraftsFilled = videoDrafts.map(fillRef);
      setImageDrafts(imageDraftsFilled);
      setVideoDrafts(videoDraftsFilled);
      const paramsToWrite = { ...params };
      const imageIds = imageDraftsFilled.map((d) => d.id.trim());
      const videoIds = videoDraftsFilled.map((d) => d.id.trim());
      if (imageIds.length > 0 && !imageIds.includes(String(params.defaultImageModel ?? "").trim())) {
        paramsToWrite.defaultImageModel = imageIds[0];
      }
      if (videoIds.length > 0 && !videoIds.includes(String(params.defaultVideoModel ?? "").trim())) {
        paramsToWrite.defaultVideoModel = videoIds[0];
      }
      const snap = scope.getSnapshot();
      const strip = ({ draftUid: _u, keyDraft: _k, providerKey: _p, ...rest }) => rest;
      const ops = [
        { op: "set", path: ["imageModels"], value: imageDraftsFilled.map(strip) },
        { op: "set", path: ["videoModels"], value: videoDraftsFilled.map(strip) },
        ...Object.entries(paramsToWrite).filter(([k]) => !MODEL_KEYS.has(k)).map(([k, v]) => ({ op: "set", path: [k], value: v }))
      ];
      const landed = await scope.mutate(ops, snap.revision);
      if (landed !== true) {
        setSaveFailed(true);
        setError("\u4FDD\u5B58\u88AB\u62D2\u7EDD\uFF1A\u914D\u7F6E\u5DF2\u5728\u522B\u5904\u4FEE\u6539\uFF0C\u8BF7\u70B9\u300C\u91CD\u65B0\u52A0\u8F7D\u300D\u540E\u91CD\u8BD5");
        return;
      }
      for (const d of [...imageDraftsFilled, ...videoDraftsFilled]) {
        if (d.keyDraft.trim() !== "" && d.apiKeyEnv.trim() !== "") {
          const res = await ctx.remote.credentials.set(d.apiKeyEnv.trim(), d.keyDraft.trim());
          if (!res.ok) {
            setSaveFailed(true);
            setError(`\u300C${d.id}\u300D\u7684 Key \u5199\u5165\u51ED\u636E\u5E93\u5931\u8D25`);
            return;
          }
        }
      }
      const status = await loadAll();
      const missing = [...imageDraftsFilled, ...videoDraftsFilled].filter((d) => d.keyDraft.trim() === "" && status[d.apiKeyEnv.trim()] !== true).map((d) => d.id);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 生成一件合格作品的依赖、操作与全部成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

以可取用且符合需求的作品为分母，费用由配置key的持有人、算力/磁盘由宿主操作者承担；后台并不消除远端生成费或后续Agent费用。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明DSH0.2.1/Node>=22.19、tools/jobs/commands/attachments/credentials | Host必需 | 注册执行、任务、附件与凭据 | 缺jobs主入口不加载；start抛错会无句柄detached而非可靠降级 |
| slots/configForms/remotes与Host api/file/附件通道 | Web展示/配置必需 | 配置、画廊/视频、下载/原生打开 | 方法/权限/路径或codec不符时已存文件仍不等可交付 |
| provider端点/模型/key/网络、匹配的字段/响应协议 | 生成必需 | 提示/素材外发、生成/轮询/下载 | 预设/免费标签非可用或零费证明；key存在不等余额/协议验收 |
| 可读素材、可写输出/附件、足够磁盘/内存 | 素材/交付必需 | 全量读取、下载、持久化 | 素材cwd需核，下载/本地提交失败可能在远端已成功之后 |
| live owner、可继续Agent/工具执行 | 后台会话交回必需 | notice再驱动send_media | 无owner/接续失败或丢notice时没有本组件送达确认 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首次 | 管理者固定Host/后端、核key引用及独占目录；用户用获准素材和低预算/image --wait小样本 | 参数/服务/文件/实际卡片一一对应，不能以配置已保存作验收 |
| 日常 | 用户或Agent选模型/素材，选择同步或后台并记录本地job/远端ID | 作品合格且文件/附件与正确会话可取；后台还核send_media真实结果 |
| 未决/恢复 | 操作者先查原ID/Host job/磁盘/附件，再决定重新展示、续查或新生成 | 优先重用已生成文件，不把再次生成当对账；无ID则明确未知 |
| 退出 | 停发并对账远端未决、停止可控本地job，保全作品/引用后禁用，按需迁移/删文件与撤key | 本地abort/禁用不代表供应商cancel或抹除；附件、图片副本、视频分别核 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 环境/凭据与协议小样本、素材/存储资源 | 核字段/模式/下载鉴权/路径与Host卡片 | 未查现价、未生成，不以Agnes免费标签填0 |
| 持续使用 | 生成/轮询/下载、整buffer内存、附件及副本/视频增长；notice可能唤醒额外LLM/图像输入与工具 | 选图/看片/校内容、整理路径、追后台交回 | 没有作品合格率、真实费率/等待/存储和模型接续金额 |
| 失败恢复 | 可能已成功的远端任务/下载/再次生成、孤立附件/文件 | 按ID对账、重展示、修目录/key、核部分配置 | 无幂等/持久阶段对账；signal不保证远端停止，重试费用未知 |
| 退出或替换 | 未决远端费用、媒体迁移/残留、撤key影响其他共享引用模型 | 停发/对账、导出路径及附件、恢复UI贡献、删/留媒体 | autoSave=false仍有附件/视频；无统一删除/远端撤回承诺 |

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少搬运作品 | 工具/命令整合生成、附件/文件及卡片 | 对网页/脚本净节时与可用作品率 |
| 后台不占本次工具等待 | 独立job controller、progress与notice接续 | 受控句柄/远端恢复、实际会话送达和额外LLM成本 |
| 图片/视频留存 | attachment、可选图副本和必存视频 | 阶段失败下的一致恢复、autoSave=false视图闭环 |
| 后端可替换 | 配置目录+凭据与两类HTTP拼装 | 每厂商/模式兼容、真实价格/质量/原生打开 |

没有同条件业务任务或现价采集，单位作品金额/净节省/ROI都未知；材料指标未知不构成源码受阻，来源和金额未知也不等资源成本0。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4-10](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/index.js#L4-L10)

Host服务强依赖。

```text
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

**依据 2 · 源码核查**：[lib/client.js:1410-1434](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1410-L1434)

真实Web/remote服务与席位。

<details>
<summary>查看原文（25行）</summary>

```text
// Z:/dsh/@gw/dsh-media-studio/src/client/index.ts
var inject = ["slots", "remote", "remote.session", "remote.credentials", "configForms"];
function apply(ctx) {
  bindNativeOpen(ctx["remote.session"] ?? ctx.remote?.session);
  for (const key of ["generate_image", "generate_video", "send_media"]) {
    ctx.slots.inject("tool.call.toolview", () => ctx.slots.register(
      { name: "tool.call.toolview", key },
      MediaToolRow
    ));
  }
  for (const key of ["image", "video"]) {
    ctx.slots.inject("conversation.chat.commandview", () => ctx.slots.register(
      { name: "conversation.chat.commandview", key },
      MediaCommandRow
    ));
  }
  for (const name of ["conversation.chat.message.images", "conversation.chat.user.images"]) {
    ctx.slots.inject(name, () => ctx.slots.register(
      { name, priority: -1 },
      MessageMediaImages
    ));
  }
  registerConfigCard(ctx);
}
;Object.defineProperty(module.exports,Symbol.toStringTag,{value:"Module"});return module.exports}});
```

</details>

**依据 3 · 源码核查**：[lib/config.js:12-29](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/config.js#L12-L29)

目录/autoSave与超时轮询等默认。

<details>
<summary>查看原文（18行）</summary>

```text
export const Config = Schema.object({
    imageModels: Schema.array(modelEntrySchema).default([...PRESET_IMAGE_MODELS]).volatile(),
    videoModels: Schema.array(modelEntrySchema).default([...PRESET_VIDEO_MODELS]).volatile(),
    defaultImageModel: Schema.string().default('agnes-image').volatile(),
    defaultVideoModel: Schema.string().default('agnes-video').volatile(),
    outputDir: Schema.string().default('~/.dsh/media-studio').volatile(),
    autoSave: Schema.boolean().default(true).volatile(),
    // 分辨率/尺寸/画幅放开成自由字符串：设置卡片是可下拉的输入框，常见档位点选，
    // 服务商支持的其他档位（如具体像素）也允许手输。
    imageResolution: Schema.string().default('2K').volatile(),
    imageAspectRatio: Schema.string().default('16:9').volatile(),
    videoSeconds: Schema.number().step(1).min(4).max(12).default(5).volatile(),
    videoSize: Schema.string().default('720P').volatile(),
    videoAspectRatio: Schema.string().default('16:9').volatile(),
    requestTimeoutSec: Schema.number().default(300).volatile(),
    videoPollIntervalSec: Schema.number().default(30).volatile(),
    videoPollTimeoutSec: Schema.number().default(300).volatile(),
});
```

</details>

**依据 4 · 源码核查**：[lib/tools.js:113-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L113-L142)

notice驱动模型再调用工具，非零接续资源证明。

<details>
<summary>查看原文（30行）</summary>

```text
}
/** Build the chat push content for finished images. The trailing instruction
 *  makes the woken agent surface the files itself: completion notices ride the
 *  followup/inject channel, which feeds the model but renders no content, so
 *  the only way media shows up in the conversation is a tool row (send_media). */
export function buildImagePushContent(headline, images) {
    const blocks = [{
            type: 'text',
            text: `${headline}\n${images.map(itemLine).join('\n')}\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
    for (const item of images) {
        const block = imageBlockFor(item);
        if (block !== undefined)
            blocks.push(block);
    }
    return blocks;
}
/** Build the chat push content for a finished video. */
export function buildVideoPushContent(headline, videos) {
    const lines = videos.map(item => {
        const sizeMb = (item.bytes / (1024 * 1024)).toFixed(1);
        return item.path === undefined
            ? `- ${item.name}（${sizeMb} MB）`
            : `- \`${item.path}\`（${sizeMb} MB）`;
    });
    return [{
            type: 'text',
            text: `${headline}\n${lines.join('\n')}\n文件已保存到输出目录。\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
}
```

</details>

**依据 5 · 源码核查**：[lib/providers.js:238-312](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L238-L312)

远端ID/轮询/下载与局部signal。

<details>
<summary>查看原文（75行）</summary>

```text
    }
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }, signal);
    const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
        : typeof submitted.id === 'string' ? submitted.id : undefined;
    if (videoId === undefined)
        throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${videoId}`);
    // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
    const queryBase = new URL(entry.baseURL).origin;
    const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`;
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(queryUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            if (url === undefined)
                throw new Error(`video task completed without a url: ${JSON.stringify(status).slice(0, 500)}`);
            const downloaded = await fetchBytes(url, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed') {
            const error = status.error;
            throw new Error(`video task failed: ${error?.message ?? JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${videoId}: ${state || 'queued'} ${typeof status.progress === 'number' ? `${status.progress}%` : ''}`.trim());
    }
}
async function openAiVideo(entry, apiKey, params, signal, pollDeadline) {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            seconds: String(params.seconds),
            size: params.size,
        }),
    }, signal);
    const id = typeof submitted.id === 'string' ? submitted.id : undefined;
    if (id === undefined)
        throw new Error(`video submit returned no id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${id}`);
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${id} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(`${entry.baseURL}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            const downloaded = url !== undefined
                ? await fetchBytes(url, signal, entry.model)
                : await fetchBytes(`${entry.baseURL}/videos/${encodeURIComponent(id)}/content`, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed' || state === 'error') {
            throw new Error(`video task failed: ${JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${id}: ${state || 'queued'}`);
    }
}
```

</details>

**依据 6 · 源码核查**：[lib/media.js:101-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L101-L142)

实际持久化路径/阶段。

<details>
<summary>查看原文（42行）</summary>

```text
async function writeOutputFile(outputDir, name, bytes) {
    await mkdir(outputDir, { recursive: true });
    const path = join(outputDir, name);
    await writeFile(path, bytes);
    return path;
}
/**
 * Commit one generated image: optional auto-save copy plus a durable image
 * attachment (the inline display currency of the chat UI).
 */
export async function commitImage(attachments, options) {
    const ref = await attachments.saveImage({
        data: options.bytes,
        mediaType: options.mediaType,
        name: basename(options.name),
    });
    let path;
    if (options.autoSave) {
        path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    }
    return {
        kind: 'image',
        name: ref.name ?? basename(options.name),
        ...(path === undefined ? {} : { path }),
        bytes: ref.bytes,
        mediaType: ref.mediaType,
        width: ref.width,
        height: ref.height,
        attachmentId: ref.attachmentId,
    };
}
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options) {
    const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    return {
        kind: 'video',
        name: basename(options.name),
        path,
        bytes: options.bytes.byteLength,
        mediaType: 'video/mp4',
    };
}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 不重复已有后台框架，下一步怎样验证价值？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

jobs/start、进度中的远端ID、canonical items/meta、命令payload、已保存文件、图库/下载/原生打开都已存在，不能把“做后台/加画廊/回传ID”本身当新设计。先修/显式暴露无句柄降级、模式参数忽略、附件无path显示桥接与凭据引用冲突，再谈可采用性。

未验证候选是复用已有Host job记录（若其契约可用），让远端已提交ID、下载/附件/副本结果和实际send_media工具结果逐阶段关联；状态不明先查既有ID/文件，不自动再生成，也不以模型收到notice充作用户已收。send_media成功也只记会话提交，实际视图读取/加载或人工验收另列，不称用户已看。最小持久记录只留恢复必要的ID/路径/摘要和状态，不重复收集全部提示/素材；不另造平行任务调度器，若Host现有result/progress足以人工恢复，先复用。

用同一后端/素材/预算，比较当前job日志+输出目录人工对账、最小映射回执及服务商网页/脚本。在提交成功后失联、下载后、附件保存后副本失败、owner处置/notice失败/未send_media时注入故障，并加入取消落在保存期、无jobId与autoSave=false。数重复远端生成、已存未展示、无效重做/未决及人工恢复时间，分摊额外模型唤醒和元数据维护成本。若仅改善漂亮状态而不减少重复任务/恢复劳动，或现有日志/目录同样够用，否定独立交付层；作品质量变化需控制模型/提示，不归因回执。

#### 证据与依据

**依据 1 · 源码核查**：[lib/jobs.js:43-81](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/jobs.js#L43-L81)

可复用Host job与当前脱管分支。

<details>
<summary>查看原文（39行）</summary>

```text
export function startMediaJob(ctx, request) {
    const runWork = (job, controller) => (async () => {
        try {
            const { summary } = await request.work(job, controller.signal);
            return { status: 'completed', detail: 'media generated', result: summary };
        }
        catch (error) {
            return {
                status: controller.signal.aborted ? 'killed' : 'failed',
                detail: error instanceof Error ? error.message : String(error),
            };
        }
    })();
    try {
        const jobId = ctx.jobs.start({
            kind: request.kind,
            label: request.label.slice(0, 120),
            owner: request.owner,
            run: (job) => {
                const controller = new AbortController();
                const done = runWork({
                    append: text => job.append(text),
                    updateProgress: line => job.updateProgress(line),
                }, controller);
                return {
                    cancel: () => controller.abort(),
                    done,
                };
            },
        });
        return jobId;
    }
    catch {
        // No attached job controller (or the registry refused): run detached.
        const controller = new AbortController();
        void runWork({ append: () => undefined, updateProgress: () => undefined }, controller);
        return undefined;
    }
}
```

</details>

**依据 2 · 源码核查**：[lib/providers.js:238-273](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L238-L273)

已有远端ID/progress，对账应复用而非称从无。

<details>
<summary>查看原文（36行）</summary>

```text
    }
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }, signal);
    const videoId = typeof submitted.video_id === 'string' ? submitted.video_id
        : typeof submitted.id === 'string' ? submitted.id : undefined;
    if (videoId === undefined)
        throw new Error(`video submit returned no video_id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${videoId}`);
    // The query endpoint lives OUTSIDE /v1 and requires model_name for every mode.
    const queryBase = new URL(entry.baseURL).origin;
    const queryUrl = `${queryBase}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(entry.model)}`;
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${videoId} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(queryUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            if (url === undefined)
                throw new Error(`video task completed without a url: ${JSON.stringify(status).slice(0, 500)}`);
            const downloaded = await fetchBytes(url, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed') {
            const error = status.error;
            throw new Error(`video task failed: ${error?.message ?? JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${videoId}: ${state || 'queued'} ${typeof status.progress === 'number' ? `${status.progress}%` : ''}`.trim());
    }
```

</details>

**依据 3 · 源码核查**：[lib/media.js:111-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/media.js#L111-L142)

附件/副本/视频阶段确实分离。

<details>
<summary>查看原文（32行）</summary>

```text
export async function commitImage(attachments, options) {
    const ref = await attachments.saveImage({
        data: options.bytes,
        mediaType: options.mediaType,
        name: basename(options.name),
    });
    let path;
    if (options.autoSave) {
        path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    }
    return {
        kind: 'image',
        name: ref.name ?? basename(options.name),
        ...(path === undefined ? {} : { path }),
        bytes: ref.bytes,
        mediaType: ref.mediaType,
        width: ref.width,
        height: ref.height,
        attachmentId: ref.attachmentId,
    };
}
/** Commit one generated video: always written to disk (the chat player streams it from the path). */
export async function commitVideo(options) {
    const path = await writeOutputFile(options.outputDir, basename(options.name), options.bytes);
    return {
        kind: 'video',
        name: basename(options.name),
        path,
        bytes: options.bytes.byteLength,
        mediaType: 'video/mp4',
    };
}
```

</details>

**依据 4 · 源码核查**：[lib/tools.js:113-142](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L113-L142)

已有notice但要求模型再send_media。

<details>
<summary>查看原文（30行）</summary>

```text
}
/** Build the chat push content for finished images. The trailing instruction
 *  makes the woken agent surface the files itself: completion notices ride the
 *  followup/inject channel, which feeds the model but renders no content, so
 *  the only way media shows up in the conversation is a tool row (send_media). */
export function buildImagePushContent(headline, images) {
    const blocks = [{
            type: 'text',
            text: `${headline}\n${images.map(itemLine).join('\n')}\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
    for (const item of images) {
        const block = imageBlockFor(item);
        if (block !== undefined)
            blocks.push(block);
    }
    return blocks;
}
/** Build the chat push content for a finished video. */
export function buildVideoPushContent(headline, videos) {
    const lines = videos.map(item => {
        const sizeMb = (item.bytes / (1024 * 1024)).toFixed(1);
        return item.path === undefined
            ? `- ${item.name}（${sizeMb} MB）`
            : `- \`${item.path}\`（${sizeMb} MB）`;
    });
    return [{
            type: 'text',
            text: `${headline}\n${lines.join('\n')}\n文件已保存到输出目录。\n\n请立即调用 send_media 工具，把上述文件展示给用户。`,
        }];
}
```

</details>

**依据 5 · 源码核查**：[lib/tools.js:418-449](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/tools.js#L418-L449)

实际send_media与统一items，不是最终送达回执。

<details>
<summary>查看原文（32行）</summary>

```text
        async execute(args) {
            const paths = args.paths;
            if (paths.length === 0)
                throw new Error('paths must not be empty');
            const files = [];
            for (const rawPath of paths) {
                const described = await describeLocalFile(rawPath);
                if (described.kind === 'image') {
                    const { readFile } = await import('node:fs/promises');
                    const bytes = new Uint8Array(await readFile(described.path));
                    const mediaType = imageMediaTypeForPath(described.path) ?? sniffImageMediaType(bytes) ?? 'image/png';
                    const ref = await ctx.attachments.saveImage({ data: bytes, mediaType, name: described.name });
                    files.push({
                        ...described,
                        bytes: ref.bytes,
                        mediaType: ref.mediaType,
                        width: ref.width,
                        height: ref.height,
                        attachmentId: ref.attachmentId,
                    });
                }
                else {
                    files.push(described);
                }
            }
            return { kind: 'media-send', ...(args.caption === undefined ? {} : { caption: args.caption }), files };
        },
    }));
}
/** Payload projection shared with the slash commands. */
export function mediaPayload(kind, text, items) {
    return { v: 1, kind, text, items: [...items] };
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前怎样限定采用与退出？

**研究主题**：采用判断、工程质量与复用

#### 完整回答

当前观察，未把固定代码可读当可靠创作后台。只有明确需要DSH内Agent创作/回交的人，才值得先花成本核当前Host服务/权限、所选后端真实协议与一次低预算同步图的完整文件/会话闭环。前台小样本成功也不自动证明默认后台、关键帧/参考视频、取消或原生打开可用。

升级有限试用前应核：实际key引用和目录、绝对素材路径、生成参数确实入后端、私有下载鉴权、图片附件/副本/视频可回找、autoSave=false视图，以及有/无jobId、owner消失/notice失败/模型未接续时如何对账原任务；还应回归被注册的普通图片槽。后台出现未知远端结果先停止新生成，保全ID/文件并查供应商/Host job，能重展示就不重生成；权限/路径不符、作品不可找回或人工/费用高于网页/脚本就退出。禁用/撤key前核共享引用影响与远端未决，分别处置附件/副本/视频，不许取消/抹除退款保证。

可借鉴的是模型输出与展示元数据的结构化接缝、命令payload、媒体/协议分层和明确notice来源；要连同path-only卡片、signal截止位置、非事务文件/凭据及后台完成依赖一起迁移。未执行目标、生成、安装或故障测试，也未拿活跃度/预设数量当真实采用和质量效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4-10](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/index.js#L4-L10)

强依赖为启用门槛。

```text
export const name = 'media-studio';
export const inject = ['tools', 'jobs', 'commands', 'attachments', 'credentials'];
export { Config };
export function apply(ctx, config) {
    registerMediaTools(ctx, config);
    registerMediaCommands(ctx, config);
}
```

**依据 2 · 源码核查**：[lib/jobs.js:43-81](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/jobs.js#L43-L81)

句柄与取消/失败边界。

<details>
<summary>查看原文（39行）</summary>

```text
export function startMediaJob(ctx, request) {
    const runWork = (job, controller) => (async () => {
        try {
            const { summary } = await request.work(job, controller.signal);
            return { status: 'completed', detail: 'media generated', result: summary };
        }
        catch (error) {
            return {
                status: controller.signal.aborted ? 'killed' : 'failed',
                detail: error instanceof Error ? error.message : String(error),
            };
        }
    })();
    try {
        const jobId = ctx.jobs.start({
            kind: request.kind,
            label: request.label.slice(0, 120),
            owner: request.owner,
            run: (job) => {
                const controller = new AbortController();
                const done = runWork({
                    append: text => job.append(text),
                    updateProgress: line => job.updateProgress(line),
                }, controller);
                return {
                    cancel: () => controller.abort(),
                    done,
                };
            },
        });
        return jobId;
    }
    catch {
        // No attached job controller (or the registry refused): run detached.
        const controller = new AbortController();
        void runWork({ append: () => undefined, updateProgress: () => undefined }, controller);
        return undefined;
    }
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:393-408](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L393-L408)

图片path-only卡片实际条件。

<details>
<summary>查看原文（16行）</summary>

```text
function MediaItemGrid({ items }) {
  const [opened, setOpened] = (0, import_react.useState)(void 0);
  const images = items.filter((item) => item.kind === "image");
  const videos = items.filter((item) => item.kind === "video");
  const others = items.filter((item) => item.kind !== "image" && item.kind !== "video");
  const many = images.length > 1;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
    images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: images.map((item) => {
      const url = apiFileUrl(item.path);
      const name = fileLabel(item);
      if (url === void 0) return null;
      const sizeText = formatBytes(item.bytes);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexDirection: "column", gap: 4, maxWidth: "100%" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1052-1080](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/client.js#L1052-L1080)

配置/凭据分开落地与共享引用责任。

<details>
<summary>查看原文（29行）</summary>

```text
      }
      if (videoIds.length > 0 && !videoIds.includes(String(params.defaultVideoModel ?? "").trim())) {
        paramsToWrite.defaultVideoModel = videoIds[0];
      }
      const snap = scope.getSnapshot();
      const strip = ({ draftUid: _u, keyDraft: _k, providerKey: _p, ...rest }) => rest;
      const ops = [
        { op: "set", path: ["imageModels"], value: imageDraftsFilled.map(strip) },
        { op: "set", path: ["videoModels"], value: videoDraftsFilled.map(strip) },
        ...Object.entries(paramsToWrite).filter(([k]) => !MODEL_KEYS.has(k)).map(([k, v]) => ({ op: "set", path: [k], value: v }))
      ];
      const landed = await scope.mutate(ops, snap.revision);
      if (landed !== true) {
        setSaveFailed(true);
        setError("\u4FDD\u5B58\u88AB\u62D2\u7EDD\uFF1A\u914D\u7F6E\u5DF2\u5728\u522B\u5904\u4FEE\u6539\uFF0C\u8BF7\u70B9\u300C\u91CD\u65B0\u52A0\u8F7D\u300D\u540E\u91CD\u8BD5");
        return;
      }
      for (const d of [...imageDraftsFilled, ...videoDraftsFilled]) {
        if (d.keyDraft.trim() !== "" && d.apiKeyEnv.trim() !== "") {
          const res = await ctx.remote.credentials.set(d.apiKeyEnv.trim(), d.keyDraft.trim());
          if (!res.ok) {
            setSaveFailed(true);
            setError(`\u300C${d.id}\u300D\u7684 Key \u5199\u5165\u51ED\u636E\u5E93\u5931\u8D25`);
            return;
          }
        }
      }
      const status = await loadAll();
      const missing = [...imageDraftsFilled, ...videoDraftsFilled].filter((d) => d.keyDraft.trim() === "" && status[d.apiKeyEnv.trim()] !== true).map((d) => d.id);
```

</details>

**依据 5 · 源码核查**：[lib/providers.js:275-312](https://github.com/1497105876/dsh-media-studio/blob/aca58b93e30ad7cb92a54b98ac67f071674ce52f/lib/providers.js#L275-L312)

特定协议/下载契约不能泛化。

<details>
<summary>查看原文（38行）</summary>

```text
async function openAiVideo(entry, apiKey, params, signal, pollDeadline) {
    const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    const submitted = await requestJson(`${entry.baseURL}/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: entry.model,
            prompt: params.prompt,
            seconds: String(params.seconds),
            size: params.size,
        }),
    }, signal);
    const id = typeof submitted.id === 'string' ? submitted.id : undefined;
    if (id === undefined)
        throw new Error(`video submit returned no id: ${JSON.stringify(submitted).slice(0, 500)}`);
    params.onProgress?.(`video task submitted: ${id}`);
    for (;;) {
        if (Date.now() > pollDeadline)
            throw new Error(`video task ${id} exceeded poll budget (${params.pollTimeoutMs} ms)`);
        await sleep(params.pollIntervalMs, signal);
        const status = await requestJson(`${entry.baseURL}/videos/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${apiKey}` },
        }, signal);
        const state = typeof status.status === 'string' ? status.status : '';
        if (state === 'completed') {
            const url = typeof status.url === 'string' && status.url.length > 0 ? status.url : undefined;
            const downloaded = url !== undefined
                ? await fetchBytes(url, signal, entry.model)
                : await fetchBytes(`${entry.baseURL}/videos/${encodeURIComponent(id)}/content`, signal, entry.model);
            return { bytes: downloaded.bytes, mediaType: 'video/mp4' };
        }
        if (state === 'failed' || state === 'error') {
            throw new Error(`video task failed: ${JSON.stringify(status).slice(0, 500)}`);
        }
        params.onProgress?.(`video task ${id}: ${state || 'queued'}`);
    }
}
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
