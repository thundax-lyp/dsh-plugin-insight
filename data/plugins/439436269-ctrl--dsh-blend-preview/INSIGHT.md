# dsh-blend-preview

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[5623a61](https://github.com/439436269-ctrl/dsh-blend-preview/tree/5623a616f3d97051f04074862614ab6135e316f2)

<!-- BEGIN META -->
[![npm 30d 44](https://img.shields.io/static/v1?label=npm+30d&message=44&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blend-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blend-preview)
<!-- END META -->

> **实现功能**：在DSH侧栏预览Blender文件，展示静态三维几何和场景信息。

> **核心亮点**：相对手工导出GLB或切换Blender，增量是工作区文件触发、本地转换缓存与侧栏检查的一体流程；Blender导出和glTF本身不是本项目原创。[Q01](#research-q01)

> **风险与缺陷**：缓存以大小和mtime识别版本，且查看器省略纹理动画；显示成功不等于当前内容或最终视觉验收成立。认证也不等同项目文件沙箱。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 旧版预览适用于什么任务，相对直接打开Blender增加什么？](#detail-section-11)
  - [Q02 · 转换、并发与缓存如何工作，预览正确性有什么边界？](#detail-section-12)
  - [Q03 · 启动、持续使用与失败恢复分别承担什么成本？](#detail-section-13)
  - [Q04 · 可借鉴的设计与鉴权承诺分别到哪里？](#detail-section-14)
  - [Q05 · 应如何决定采用，并检验更安全的预览流程假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有Blender环境、在DSH工作区反复检查静态几何和尺寸的人；纹理动画与最终渲染须回到Blender，旧包迁移需先核对。[Q01](#research-q01)

简单基线是直接在Blender打开源文件，或手工导出GLB；功能更完整但有切换及导出操作。本轮没有同条件计时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|Blender侧栏预览|工作区内检查几何|本地Blender、WebGL；纹理动画不覆盖|
|缓存转换|复用同版本GLB|大小mtime键，跨进程未验证|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|DSH connection与WebGL|必需|API及侧栏显示|核对宿主或改为Blender直开|
|本地Blender、源文件权限|必需|后台转换|配置程序路径并检查权限|
|可写缓存|必需|保存GLB与信息|检查空间与权限后重试|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|确认旧包迁移及兼容|用户核对官方入口|暂缓新安装|
|配置Blender并重启|用户确认可找到程序|显式配置路径|
|打开已知尺寸模型|用户对照Blender确认几何|查日志或直接打开|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|条件及未知|
|---|---|---|---|
|首次|Blender安装、CPU/GPU和磁盘|安装路径与已知尺寸校对|耗时未知|
|持续|版本转换、GLB缓存与GPU|打开与几何复核|实际峰值未知|
|失败恢复|重复转换和缓存清理|查日志、简化场景、重试|重试计入总任务|

#### 效果

|效果项|当前支持|未知|
|---|---|---|
|工作区内几何检查|Host转换及侧栏设计|真实节时与保真|
|转换复用|磁盘缓存和同key合并|跨进程及极端元数据一致性|

> **思考**：缓存以大小和mtime识别版本，且查看器省略纹理动画；显示成功不等于当前内容或最终视觉验收成立。认证也不等同项目文件沙箱。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工导出GLB或切换Blender，增量是工作区文件触发、本地转换缓存与侧栏检查的一体流程；Blender导出和glTF本身不是本项目原创。[Q01](#research-q01)

相对手工导出GLB或切换Blender，增量是工作区文件触发、本地转换缓存与侧栏检查的一体流程；Blender导出和glTF本身不是本项目原创。[Q01](#research-q01)

Host与查看器分工、共享任务取消和生命周期清理值得借鉴；复用需接入宿主认证、文件权限及转换器失败回收。认证不能独立证明项目沙箱。[Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存以大小和mtime识别版本，且查看器省略纹理动画；显示成功不等于当前内容或最终视觉验收成立。认证也不等同项目文件沙箱。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

此旧包建议观察；已有环境仅在隔离范围用已知尺寸静态场景对照验证，先确认改名后的入口，纹理动画交由Blender验收。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有集成机制有源码支持；节时、保真与宿主兼容未执行验证；设计假设未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/route.js、lib/blender.js、lib/config.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码级读取转换、缓存、配置与Host路由；未逐行审计全部Python导出和WebGL着色代码，未安装执行。
- 下一步：后续授权后在隔离宿主记录安装、打开、禁用、缓存更新与异常恢复；包含纹理/动画误验和同元数据改写反例。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-blend-preview](https://github.com/439436269-ctrl/dsh-blend-preview)
- **版本号**：0.1.0（[固定提交 5623a61](https://github.com/439436269-ctrl/dsh-blend-preview/tree/5623a616f3d97051f04074862614ab6135e316f2)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把内容新鲜度及表示缺口作为预览交付的一部分，以减少旧缓存和视觉误验；对照同元数据改写、纹理模型与Blender直接打开，若误验不降或复核更慢则否定。[Q05](#research-q05)

后续授权后在隔离宿主记录安装、打开、禁用、缓存更新与异常恢复；包含纹理/动画误验和同元数据改写反例。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 349 | — | — | 3372 |
| .js | source | 8 | 4218 | 3671 | 301 | — |
| .mjs | source | 4 | 424 | 339 | 61 | — |
| .js | test | 5 | 569 | 519 | 19 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-blend-preview/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：旧版Blender预览能否降低工作区几何检查负担，成立条件与采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 旧版预览适用于什么任务，相对直接打开Blender增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是在DSH工作区生成或检查 .blend 的建模用户，合格结果是识别静态几何、尺寸和场景结构，再决定是否进入Blender细查。作者提出以侧栏WebGL替代二进制空白；Host入口实际建立转换服务与路由，支持这一集成增量。相对直接打开Blender，少一次应用切换和手工导出；相对手工GLB预览，增加按文件版本的导出缓存。但它继承Blender导出能力，不能把glTF或后台转换归为原创算法。README首行已声明改名，新用户不应将此旧0.1.x仓库视为持续维护入口；本研究不推断新仓库质量。纹理、动画及最终渲染不属于此合格任务，因而任务节时仍待实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/README.md#L1-L20)

作者界定旧包身份、目标与依赖

<details>
<summary>查看原文（20行）</summary>

```text
> **Renamed:** the canonical package is now [`dsh-preview-blender`](https://github.com/439436269-ctrl/dsh-preview-blender). This repository is kept as the legacy 0.1.x home.

﻿# dsh-blend-preview

Preview Blender **`.blend`** files inside [DeepSeek Harness](https://github.com/deepseek-ai): the right-Sidebar document preview turns the scene into an interactive 3D viewport (orbit / zoom / wireframe) with a scene-information panel, instead of the built-in “binary file, no preview” empty state.

![The preview inside the DSH right Sidebar](https://raw.githubusercontent.com/439436269-ctrl/dsh-blend-preview/main/docs/blender-preview.png)

## What it does

- Registers a document-preview renderer for `.blend` files, so clicking one in **Workspace files** opens it in the right Sidebar.
- Runs `blender --background` once per file version to export a **GLB** plus a scene JSON (objects, triangles, materials, real-world size in mm, units, cameras, lights, collections).
- Draws the GLB with a small **dependency-free WebGL viewer** written for this plugin: orbit, pan, wheel zoom, double-click reset, wireframe mode, auto-rotate, a soft contact shadow and an axis triad. No CDN, no three.js.
- Caches conversions under `~/.dsh/cache/blend-preview`; the second open is instant (a few milliseconds).
- Shows the scene facts that matter for CAD/3D-printing work: per-object triangle counts and bounding-box sizes in millimetres, material swatches, scene units.

## Requirements

- DeepSeek Harness 0.2.x (declared compatible with `0.2.0-rc.2` and `0.2.1-rc.2`).
- **Blender 3.6 / 4.x / 5.x** installed. The plugin auto-detects `DSH_BLENDER`, `BLENDER_PATH`, `blender` on `PATH`, the Steam library, and `C:\Program Files\Blender Foundation\Blender*`. Set `blenderPath` if your install lives elsewhere.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:16-49](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/index.js#L16-L49)

Host接线支持文档到转换服务的集成

<details>
<summary>查看原文（34行）</summary>

```text
import { BlendExporter } from "./blender.js";
import { resolveConfig } from "./config.js";
import { Config } from "./schema.js";
import { registerBlendRoute } from "./route.js";

/** Plugin name, also the settings-page namespace through the bundle patch. */
export const name = "blend-preview";

/** Host service the route needs: the authenticated `/api` fence. */
export const inject = ["connection"];

export { Config };

/**
 * Mount the conversion route and expose its path to the browser half.
 * @param ctx - host context carrying `connection`.
 * @param config - loader-supplied configuration.
 */
export function apply(ctx, config) {
  const settings = resolveConfig(config);
  if (!settings.enabled) return;
  const exporter = new BlendExporter(settings, { logger: ctx.logger });

  ctx.effect(() => registerBlendRoute(ctx, exporter, settings), "blend-preview: conversion route");
  ctx.effect(() => () => exporter.dispose(), "blend-preview: blender processes");

  // The client reads its route from the served page, so a configured path and
  // the client's URL can never drift apart.
  ctx.on("webserver/index-inject", (table) => {
    table.push({
      kind: "global",
      name: "__DSH_BLEND_PREVIEW_CONFIG__",
      value: { routePath: settings.routePath, extensions: settings.extensions },
    });
```

</details>

#### 缺口

- 缺少同任务基线的端到端收益结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 转换、并发与缓存如何工作，预览正确性有什么边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

一次请求先检查绝对路径、后缀和普通文件，再交给exporter。export按realpath、大小、mtime和修改器设置生成key，先读磁盘缓存，同key未命中任务在pending Map中合并，单个请求取消通过raceAbort脱离共享任务。后台启动Blender并禁用autoexec，输出GLB及scene JSON，非零退出、超时、空产物和GLB魔数有错误分支。该机制能避免同一进程内重复启动，不证明跨进程互斥。更关键的是缓存不是内容寻址；同大小同mtime内容替换可能复用旧结果，属于实现推导风险，未复现。自写查看器明确只渲染glTF子集，不显示纹理/蒙皮/动画，即使转换成功也不能用于最终视觉验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/route.js:45-71](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/route.js#L45-L71)

路由检查并调用转换

<details>
<summary>查看原文（27行）</summary>

```text
async function serve(request, exporter, config) {
  if (!config.enabled) return errorResponse(503, "BLEND_DISABLED", "Blender preview is disabled.");
  const method = request.method === "HEAD" ? "HEAD" : "GET";
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  const kind = url.searchParams.get("kind") ?? "info";
  if (path === null || path === "") return errorResponse(400, "BLEND_PATH_REQUIRED", "Missing `path`.");
  if (path.includes("\0") || !isAbsolutePath(path)) {
    return errorResponse(400, "BLEND_PATH_INVALID", "An absolute path is required.");
  }
  if (kind !== "info" && kind !== "glb") {
    return errorResponse(400, "BLEND_KIND_INVALID", "`kind` must be `info` or `glb`.");
  }
  const suffix = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (!config.extensions.includes(suffix)) {
    return errorResponse(400, "BLEND_SUFFIX_INVALID", `Only ${config.extensions.map((item) => `.${item}`).join(", ")} files are previewed.`);
  }

  try {
    const fileInfo = await stat(path);
    if (!fileInfo.isFile()) return errorResponse(403, "BLEND_NOT_A_FILE", "This path is not a regular file.");
    const entry = await exporter.export(path, { signal: request.signal });
    if (kind === "info") return infoResponse(entry, method);
    return glbResponse(entry, method);
  } catch (error) {
    return failure(error);
  }
```

</details>

**依据 2 · 源码核查**：[lib/blender.js:150-176](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/blender.js#L150-L176)

元数据缓存键与pending去重

<details>
<summary>查看原文（27行）</summary>

```text
  async export(blendPath, options = {}) {
    if (this.disposed) throw new BlendPreviewError("The Blender preview plugin has been unloaded.", "BLEND_UNLOADED");
    const signal = options.signal;
    throwIfAborted(signal);

    const info = await stat(blendPath);
    if (!info.isFile()) throw new BlendPreviewError("This path is not a regular file.", "BLEND_NOT_A_FILE");
    if (info.size === 0) throw new BlendPreviewError("This .blend file is empty.", "BLEND_EMPTY");
    if (info.size > this.config.maxBytes) {
      throw new BlendPreviewError(
        `The scene is larger than the configured ${formatBytes(this.config.maxBytes)} limit.`,
        "BLEND_TOO_LARGE"
      );
    }
    const resolved = await realpath(blendPath).catch(() => blendPath);
    const key = cacheKey(resolved, info.size, info.mtimeMs, this.config.applyModifiers);
    const directory = join(this.config.cacheDir, key);

    const cached = await readCacheEntry(directory, key);
    if (cached !== null) return cached;

    let job = this.pending.get(key);
    if (job === undefined) {
      job = this.convert(resolved, info, key, directory).finally(() => this.pending.delete(key));
      this.pending.set(key, job);
    }
    return raceAbort(job, signal);
```

</details>

**依据 3 · 源码核查**：[lib/blender.js:197-240](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/blender.js#L197-L240)

后台参数和错误判定

<details>
<summary>查看原文（44行）</summary>

```text
    const result = await runProcess(
      binary,
      [
        "--background",
        "--disable-autoexec",
        "--python-exit-code",
        "1",
        blendPath,
        "--python",
        this.scriptPath,
        "--",
        glbPath,
        infoPath,
        this.config.applyModifiers ? "1" : "0",
      ],
      { timeoutMs: this.config.timeoutMs, children: this.children }
    );

    if (result.aborted) throw new BlendPreviewError("The conversion was cancelled.", "BLEND_ABORTED");
    if (result.timedOut) {
      throw new BlendPreviewError(
        `Blender did not finish within ${Math.round(this.config.timeoutMs / 1000)}s.`,
        "BLEND_TIMEOUT",
        { hint: "Raise `timeoutMs` in the plugin settings, or simplify the scene.", detail: tail(result.stderr, 4000) }
      );
    }
    if (result.code !== 0) {
      throw new BlendPreviewError(
        `Blender exited with code ${String(result.code)} while exporting this scene.`,
        "BLEND_EXPORT_FAILED",
        { hint: "The Blender log tail is shown in the preview under Details.", detail: tail(result.stderr || result.stdout, 6000) }
      );
    }

    const glb = await stat(glbPath).catch(() => undefined);
    const sceneInfo = await readJson(infoPath).catch(() => undefined);
    if (glb === undefined || glb.size === 0 || sceneInfo === undefined) {
      throw new BlendPreviewError("Blender reported success but produced no preview files.", "BLEND_OUTPUT_INVALID", {
        detail: tail(result.stderr || result.stdout, 4000),
      });
    }
    const magic = await readHead(glbPath, 4);
    if (magic !== "glTF") {
      throw new BlendPreviewError("The exported GLB is not a valid glTF binary.", "BLEND_OUTPUT_INVALID");
```

</details>

**依据 4 · 作者声明**：[README.md:70-72](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/README.md#L70-L72)

渲染表示范围由作者明确限定

```text
- `lib/scene.py` exports with `export_apply`, `use_visible`, **Y-up**, no cameras/lights, and writes the scene description (world-space AABBs through the evaluated depsgraph, Principled base colours converted to sRGB swatches).
- The route lives under `/api`, so the connection service authenticates every request (Host/Origin fence + session cookie). Arbitrary local files are not exposed.
- The viewer is a hand-written glTF 2.0 subset renderer (POSITION + NORMAL, indexed triangles, PBR factors, node TRS/matrix). Textures, skinning and animation are out of scope; the Host only exports still scenes.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、持续使用与失败恢复分别承担什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

必须有兼容DSH的connection服务、本地Blender可执行文件、WebGL以及读取源文件和写缓存权限。Blender查找接受显式配置、环境变量和平台路径，找不到会返回可解释错误；配置默认180秒超时、1GiB输入及24条缓存。启动流程由用户装包与重启、检查路径、打开已知尺寸文件、对照Blender确认；每次文件版本变化触发CPU转换，查看则占GPU和缓存磁盘。首次安装人工时间与实际资源峰值未知，不能把本地处理称为免费。失败时应检查缺失路径/权限、超时和导出日志，必要时简化场景，恢复后对照原文件；重试与复核计入任务总成本。README的2–10秒冷转换是作者描述，不能作为本轮测量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/config.js:16-40](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/config.js#L16-L40)

资源、超时与缓存默认值

<details>
<summary>查看原文（25行）</summary>

```text
/** Largest scene the route agrees to convert, in bytes (1 GiB). */
export const DEFAULT_MAX_BYTES = 1024 * 1024 * 1024;

/** A cold conversion is one Blender process; this is its wall-clock ceiling. */
export const DEFAULT_TIMEOUT_MS = 180_000;

/** Cached conversions kept on disk before the oldest are pruned. */
export const DEFAULT_CACHE_ENTRIES = 24;

/** Where conversions live when no cache directory is configured. */
export function defaultCacheDir() {
  return join(homedir(), ".dsh", "cache", "blend-preview");
}

/** Fallback when the loader supplies no config object at all. */
export const DEFAULTS = Object.freeze({
  enabled: true,
  routePath: "/api/blend-preview",
  extensions: DEFAULT_EXTENSIONS,
  blenderPath: "",
  cacheDir: "",
  timeoutMs: DEFAULT_TIMEOUT_MS,
  maxBytes: DEFAULT_MAX_BYTES,
  applyModifiers: true,
  cacheEntries: DEFAULT_CACHE_ENTRIES,
```

</details>

**依据 2 · 源码核查**：[lib/blender.js:49-94](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/blender.js#L49-L94)

可执行文件定位机制

<details>
<summary>查看原文（46行）</summary>

```text
export function findBlender(config, env = process.env) {
  for (const candidate of blenderCandidates(config, env)) {
    if (candidate !== "" && existsSync(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Every location worth probing, in priority order.
 * @param config - resolved plugin config.
 * @param env - environment to read overrides from.
 * @returns absolute candidate paths (may not exist).
 */
export function blenderCandidates(config, env = process.env) {
  const candidates = [];
  const configured = config !== null && typeof config === "object" ? config.blenderPath : "";
  if (typeof configured === "string" && configured !== "") candidates.push(configured);
  for (const name of ["DSH_BLENDER", "BLENDER_PATH"]) {
    const value = env[name];
    if (typeof value === "string" && value.trim() !== "") candidates.push(value.trim());
  }
  const pathValue = typeof env.PATH === "string" ? env.PATH : typeof env.Path === "string" ? env.Path : "";
  for (const dir of pathValue.split(process.platform === "win32" ? ";" : ":")) {
    if (dir.trim() === "") continue;
    candidates.push(join(dir.trim(), process.platform === "win32" ? "blender.exe" : "blender"));
  }
  if (process.platform === "win32") {
    candidates.push(
      "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Blender\\blender.exe",
      "C:\\Program Files\\Steam\\steamapps\\common\\Blender\\blender.exe",
      "C:\\Program Files\\Blender Foundation\\Blender\\blender.exe"
    );
    // Steam libraries are commonly moved to a second drive; probe the usual
    // <drive>:\SteamLibrary and <drive>:\Steam layouts instead of hard-coding
    // one machine's drive letter.
    for (const drive of ["C", "D", "E", "F"]) {
      candidates.push(`${drive}:\\SteamLibrary\\steamapps\\common\\Blender\\blender.exe`);
      candidates.push(`${drive}:\\Steam\\steamapps\\common\\Blender\\blender.exe`);
    }
    for (const versioned of versionedBlenderInstalls("C:\\Program Files\\Blender Foundation")) candidates.push(versioned);
  } else if (process.platform === "darwin") {
    candidates.push("/Applications/Blender.app/Contents/MacOS/Blender", "/Applications/Blender/Blender.app/Contents/MacOS/Blender");
  } else {
    candidates.push("/usr/bin/blender", "/usr/local/bin/blender", "/snap/bin/blender", "/var/lib/flatpak/exports/bin/org.blender.Blender");
  }
  return [...new Set(candidates)];
```

</details>

**依据 3 · 作者声明**：[README.md:87-92](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/README.md#L87-L92)

作者给出性能与表示限制

```text
## Notes and limits

- A cold conversion takes roughly 2–10 s for a small scene (Blender startup dominates); it is cached per file version, so rotating/zooming never re-runs Blender.
- Very large scenes (millions of triangles) export slowly and may exceed `timeoutMs`.
- Textures are not shown in the viewport (base colours only); the Blender renders next to the file are still the reference.
- Nothing is uploaded: Blender runs locally and the GLB stays in the local cache.
```

#### 缺口

- 缺少实际资源峰值、失败恢复时间与单位合格任务成本
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可借鉴的设计与鉴权承诺分别到哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

可借鉴的是Host/浏览器职责拆分、按key共享任务、配置路径注入及生命周期释放。index将route disposer和exporter.dispose纳入ctx.effect，使卸载具有释放子进程的设计入口，实际卸载行为仍需宿主验收。route的no-store与nosniff降低代理缓存和内容类型混淆，配置把路径固定在/api前缀；这些属于正面设计。认证依赖宿主connection，而路由自身接受任意绝对路径后stat，不含项目目录约束。因此只能说宿主认证前提下提供本地文件转换，不能从README“arbitrary local files are not exposed”推出工作区沙箱已经成立。部署者必须核对宿主文件权限与会话隔离；本轮未审计整个宿主，也未确认越权漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:24-49](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/index.js#L24-L49)

服务依赖、释放与客户端配置注入

<details>
<summary>查看原文（26行）</summary>

```text
/** Host service the route needs: the authenticated `/api` fence. */
export const inject = ["connection"];

export { Config };

/**
 * Mount the conversion route and expose its path to the browser half.
 * @param ctx - host context carrying `connection`.
 * @param config - loader-supplied configuration.
 */
export function apply(ctx, config) {
  const settings = resolveConfig(config);
  if (!settings.enabled) return;
  const exporter = new BlendExporter(settings, { logger: ctx.logger });

  ctx.effect(() => registerBlendRoute(ctx, exporter, settings), "blend-preview: conversion route");
  ctx.effect(() => () => exporter.dispose(), "blend-preview: blender processes");

  // The client reads its route from the served page, so a configured path and
  // the client's URL can never drift apart.
  ctx.on("webserver/index-inject", (table) => {
    table.push({
      kind: "global",
      name: "__DSH_BLEND_PREVIEW_CONFIG__",
      value: { routePath: settings.routePath, extensions: settings.extensions },
    });
```

</details>

**依据 2 · 源码核查**：[lib/route.js:16-35](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/route.js#L16-L35)

缓存头与Host route接线

<details>
<summary>查看原文（20行）</summary>

```text
/** Headers shared by every answer; user data is never cached by a proxy. */
const BASE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

/**
 * Register the route for the plugin's lifetime.
 * @param ctx - host context carrying `connection`.
 * @param exporter - the conversion service.
 * @param config - resolved configuration.
 * @returns the disposer removing the route.
 */
export function registerBlendRoute(ctx, exporter, config) {
  return ctx.connection.fetch.register({
    path: config.routePath,
    methods: ["GET", "HEAD"],
    requestBody: "buffered",
    fetch: (request) => serve(request, exporter, config),
  });
```

</details>

**依据 3 · 源码核查**：[lib/route.js:49-66](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/route.js#L49-L66)

路径检查没有组件内工作区授权逻辑

<details>
<summary>查看原文（18行）</summary>

```text
  const path = url.searchParams.get("path");
  const kind = url.searchParams.get("kind") ?? "info";
  if (path === null || path === "") return errorResponse(400, "BLEND_PATH_REQUIRED", "Missing `path`.");
  if (path.includes("\0") || !isAbsolutePath(path)) {
    return errorResponse(400, "BLEND_PATH_INVALID", "An absolute path is required.");
  }
  if (kind !== "info" && kind !== "glb") {
    return errorResponse(400, "BLEND_KIND_INVALID", "`kind` must be `info` or `glb`.");
  }
  const suffix = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (!config.extensions.includes(suffix)) {
    return errorResponse(400, "BLEND_SUFFIX_INVALID", `Only ${config.extensions.map((item) => `.${item}`).join(", ")} files are previewed.`);
  }

  try {
    const fileInfo = await stat(path);
    if (!fileInfo.isFile()) return errorResponse(403, "BLEND_NOT_A_FILE", "This path is not a regular file.");
    const entry = await exporter.export(path, { signal: request.signal });
```

</details>

**依据 4 · 源码核查**：[lib/config.js:84-90](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/config.js#L84-L90)

限制API路径前缀

```text
/** Keep the route under /api; anything else would skip the authenticated fence. */
function normalizeRoutePath(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  const candidate = raw === "" ? DEFAULTS.routePath : raw;
  const withSlash = candidate.startsWith("/") ? candidate : `/${candidate}`;
  if (!withSlash.startsWith("/api/")) return DEFAULTS.routePath;
  return withSlash.replace(/\/+$/, "");
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何决定采用，并检验更安全的预览流程假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

对仍使用旧包的用户，可保留小场景几何检查这一用途，但新用户应先确认改名后的官方入口及兼容性，当前建议观察此旧包，不能以源码存在推荐持续安装。未验证假设是将缓存新鲜度提示和“仅几何、无纹理动画”缺口提示放到预览交付物上，可减少错误验收。推导来自元数据key与渲染子集两个具体边界，新增负担是摘要计算与界面信息。最小验证用同大小同mtime改写、纹理/动画场景与普通静态模型，对照现有预览和直接Blender检查，记录旧内容误判、视觉误验、冷启动、人工复核时间。若无误验改善或摘要代价超过切换收益，否定这一方向；这不是已实现贡献，也未证明存在独立付费需求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/README.md#L1-L5)

旧包迁移声明改变新采用判断

```text
> **Renamed:** the canonical package is now [`dsh-preview-blender`](https://github.com/439436269-ctrl/dsh-preview-blender). This repository is kept as the legacy 0.1.x home.

﻿# dsh-blend-preview

Preview Blender **`.blend`** files inside [DeepSeek Harness](https://github.com/deepseek-ai): the right-Sidebar document preview turns the scene into an interactive 3D viewport (orbit / zoom / wireframe) with a scene-information panel, instead of the built-in “binary file, no preview” empty state.
```

**依据 2 · 源码核查**：[lib/blender.js:164-176](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/lib/blender.js#L164-L176)

缓存策略构成假设推导依据

<details>
<summary>查看原文（13行）</summary>

```text
    const resolved = await realpath(blendPath).catch(() => blendPath);
    const key = cacheKey(resolved, info.size, info.mtimeMs, this.config.applyModifiers);
    const directory = join(this.config.cacheDir, key);

    const cached = await readCacheEntry(directory, key);
    if (cached !== null) return cached;

    let job = this.pending.get(key);
    if (job === undefined) {
      job = this.convert(resolved, info, key, directory).finally(() => this.pending.delete(key));
      this.pending.set(key, job);
    }
    return raceAbort(job, signal);
```

</details>

**依据 3 · 作者声明**：[README.md:70-72](https://github.com/439436269-ctrl/dsh-blend-preview/blob/5623a616f3d97051f04074862614ab6135e316f2/README.md#L70-L72)

表示缺口构成用户提示假设依据

```text
- `lib/scene.py` exports with `export_apply`, `use_visible`, **Y-up**, no cameras/lights, and writes the scene description (world-space AABBs through the evaluated depsgraph, Principled base colours converted to sRGB swatches).
- The route lives under `/api`, so the connection service authenticates every request (Host/Origin fence + session cookie). Arbitrary local files are not exposed.
- The viewer is a hand-written glTF 2.0 subset renderer (POSITION + NORMAL, indexed triangles, PBR factors, node TRS/matrix). Textures, skinning and animation are out of scope; the Host only exports still scenes.
```

#### 缺口

- 未来设计假设的对照实验尚无结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
