# dsh-blend-preview

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[13329cb](https://github.com/439436269-ctrl/dsh-blend-preview/tree/13329cb254373de94a2ccbbf6222401228a9c81e)

<!-- BEGIN META -->
[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-blend-preview)
<!-- END META -->

> **实现功能**：在 DSH 右侧栏把 Blender 文件转换为 GLB，并展示可交互三维预览与场景信息。

> **核心亮点**：相对切换Blender或手工导出GLB，贡献是工作区文件到本地缓存预览的一体链路和同版本任务复用；WebGL子集换取零CDN依赖，牺牲完整材质与动画表达。[Q01](#research-q01)

> **风险与缺陷**：预览只覆盖静态几何和底色，不能据此验收纹理、动画或最终渲染；缓存依赖大小mtime而非内容摘要，极端同大小同时间改写可能复用旧结果，尚未复现。[Q03](#research-q03)

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
  - [Q01 · 内嵌blend预览解决什么任务且牺牲什么？](#detail-section-11)
  - [Q02 · 转换如何复用且怎样处理取消？](#detail-section-12)
  - [Q03 · 缓存与视口边界怎样影响验收？](#detail-section-13)
  - [Q04 · 什么用户能够以可控成本试用？](#detail-section-14)
  - [Q05 · 内容摘要与缺口提示能否降低误验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH工作区生成或检查Blender模型的用户，合格结果是能核对几何、尺寸和场景结构，而不是纹理最终渲染。

直接打开Blender最完整但切换成本高；人工导出GLB再打开通用查看器可替代，但需要自己管理文件版本和缓存。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 三维视口 | 旋转、缩放、线框查看 | WebGL静态子集，不含纹理动画 |
| 场景信息 | 核对对象、三角面和尺寸 | 单位与修改器需用已知场景复核 |
| 缓存转换 | 同文件版本复用导出 | 依赖本地Blender、大小mtime缓存键 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH connection与文档预览接口 | 必需 | 认证API与面板 | 无对应接口不能展示 |
| 本地Blender 3.6/4.x/5.x | 转换必需，作者声明 | 后台导出静态GLB | 缺失返回503并提示配置路径 |
| WebGL及磁盘缓存 | 预览必需 | 本地渲染和复用 | 显卡/磁盘不满足无法完整显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装插件、配置Blender并重启 | 转换器可找到二进制 |
| 2 | 从工作区打开blend文件 | 首次生成GLB与场景JSON |
| 3 | 核对几何与尺寸，复杂材质回Blender | 超时或缺失依赖按错误提示处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Blender安装、CPU/GPU和磁盘资源 | 安装和路径检查，耗时未知 | 作者冷转换2–10秒未独立复测 |
| 持续使用 | 每文件版本转换及GLB缓存 | 打开、旋转、核对尺寸 | 大场景内存和GPU峰值未知 |
| 失败恢复 | 超时重试与缓存空间 | 缩小场景、排查Blender | 请求取消不一定结束共享转换 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作区内几何检查 | 转换路由与WebGL链路 | 实际建模任务节时 |
| 热缓存复用 | 同key任务合并与磁盘缓存 | 修改器、极端时间戳和大场景一致性 |

> **思考**：预览只覆盖静态几何和底色，不能据此验收纹理、动画或最终渲染；缓存依赖大小mtime而非内容摘要，极端同大小同时间改写可能复用旧结果，尚未复现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对切换Blender或手工导出GLB，贡献是工作区文件到本地缓存预览的一体链路和同版本任务复用；WebGL子集换取零CDN依赖，牺牲完整材质与动画表达。[Q01](#research-q01)

相对切换Blender或手工导出GLB，贡献是工作区文件到本地缓存预览的一体链路和同版本任务复用；WebGL子集换取零CDN依赖，牺牲完整材质与动画表达。[Q01](#research-q01)

按缓存键合并pending任务，单个请求取消不杀其他观察者需要的转换，是可复用的共享任务设计；禁用Blender自动脚本执行和有界超时是正面边界。路由接受认证用户的绝对路径，不能把认证等同工作区沙箱，部署时需理解宿主权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

预览只覆盖静态几何和底色，不能据此验收纹理、动画或最终渲染；缓存依赖大小mtime而非内容摘要，极端同大小同时间改写可能复用旧结果，尚未复现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有Blender环境且只需几何预览的用户可隔离试用；先用已知尺寸小模型核对结果，纹理、动画和最终渲染仍到Blender验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的设计解释，效果未独立验证；未来设计假设尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、README.md、lib/index.js、lib/route.js、lib/blender.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查认证路由、转换缓存、启动参数和客户端设计；Python场景导出及WebGL全部着色实现未逐行审计。
- 下一步：用已知几何、修改器、纹理及同大小同mtime改写场景核对缓存与视口；记录冷/热耗时、三角面与尺寸误差，当前未执行。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-blend-preview](https://github.com/439436269-ctrl/dsh-blend-preview)
- **版本号**：0.1.0（[固定提交 13329cb](https://github.com/439436269-ctrl/dsh-blend-preview/tree/13329cb254373de94a2ccbbf6222401228a9c81e)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是对保存事件增量计算内容摘要并标出预览能力缺口，降低旧缓存误用和视觉误验；对照同大小改写与纹理场景，若延迟增大却不改善误验则否定。[Q05](#research-q05)

用已知几何、修改器、纹理及同大小同mtime改写场景核对缓存与视口；记录冷/热耗时、三角面与尺寸误差，当前未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 347 | — | — | 3349 |
| .js | source | 8 | 4218 | 3671 | 301 | — |
| .mjs | source | 4 | 424 | 339 | 61 | — |
| .js | test | 5 | 569 | 519 | 19 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-blend-preview/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：439436269-ctrl/dsh-blend-preview 固定组件如何完成目标任务，贡献在何种边界成立，是否适合可控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 内嵌blend预览解决什么任务且牺牲什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标任务是工作区里快速检查生成模型的形状、尺寸与对象结构。相对手工导出GLB，插件把文件点击、后台转换、缓存和视口连起来；相对Blender本体则减少切换而不替代专业验收。作者明确查看器不支持纹理、蒙皮和动画，所以合格结果必须限定静态几何，不能用截图相似就宣布渲染正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-15](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/README.zh.md#L3-L15)

作者声明的预览范围与场景信息。

<details>
<summary>查看原文（13行）</summary>

```text
在 DeepSeek Harness 的右侧栏文档预览里直接打开 Blender **`.blend`** 文件：用 Blender 后台导出一份 GLB，再用插件自带的 WebGL 视口做可旋转、可缩放的 3D 预览，并列出场景信息。

![右侧栏里的预览](https://raw.githubusercontent.com/439436269-ctrl/dsh-blend-preview/main/docs/blender-preview.png)

## 它做什么

- 给 `.blend` 注册文档预览渲染器：在工作区文件树里点一下，右侧栏就打开 3D 预览，而不是「二进制文件无法预览」。
- 每个文件版本只跑一次 `blender --background`，导出 **GLB** + 场景 JSON（对象、三角面、材质、真实尺寸 mm、单位、相机、灯光、集合）。
- 插件自带一个零依赖的 **WebGL 查看器**：拖动旋转、右键平移、滚轮缩放、双击复位、线框模式、自动旋转、接触阴影、坐标轴。不依赖 three.js，不走 CDN。
- 转换结果缓存在 `~/.dsh/cache/blend-preview`，第二次打开是毫秒级。
- 面板直接给建模/打印关心的数：每个对象的三角面数与包围盒尺寸（mm）、材质色块、场景单位。

## 依赖
```

</details>

**依据 2 · 作者声明**：[README.zh.md:64-76](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/README.zh.md#L64-L76)

导出与WebGL子集边界。

<details>
<summary>查看原文（13行）</summary>

````text
- `lib/scene.py` 以 `export_apply`、`use_visible`、**Y-up** 导出，不带相机/灯光；场景描述里的世界包围盒走 evaluated depsgraph（含修改器），材质底色从线性色转成 sRGB 色块。
- 路由挂在 `/api` 下，请求先经过 connection 服务的鉴权（Host/Origin + 会话 cookie），不会把任意本地文件暴露成裸接口。
- 查看器是手写的 glTF 2.0 子集渲染（POSITION + NORMAL、索引三角形、PBR 因子、节点 TRS/矩阵）。纹理、蒙皮、动画不在范围内——Host 只导出静帧场景。

## 开发

```
dev/client-body.js   客户端 UI（DSH 模块加载器要求的单个 CJS 工厂）
dev/viewer.js        WebGL 渲染器，构建时拼进 bundle
scripts/build-client.mjs   由上面两个文件生成 lib/client.js
scripts/e2e-browser.mjs    针对临时 DSH 实例的 Playwright 端到端
scripts/live-selftest.mjs  真实 .blend 的冷/热/并发转换自检
node --test test/*.test.js
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 转换如何复用且怎样处理取消？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

路由要求绝对路径和允许后缀，读取文件后调用exporter；同一文件状态由缓存键定位。exporter先读缓存，未命中才在pending Map共享转换Promise。单调用取消通过raceAbort退出而不取消共享任务，避免影响另一个观察者。后台spawn带disable-autoexec、Python退出码和超时，依赖本地Blender和可写缓存。

#### 证据与依据

**依据 1 · 源码核查**：[lib/route.js:45-70](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/route.js#L45-L70)

输入检查与转换路由。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/blender.js:150-176](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/blender.js#L150-L176)

缓存命中和同key共享任务。

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

**依据 3 · 源码核查**：[lib/blender.js:187-212](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/blender.js#L187-L212)

后台二进制参数及超时。

<details>
<summary>查看原文（26行）</summary>

```text
  async convert(blendPath, fileInfo, key, directory) {
    const binary = findBlender(this.config);
    if (binary === undefined) throw missingBlenderError(this.config);
    await mkdir(directory, { recursive: true });
    const glbTemp = join(directory, "model.part.glb");
    const infoTemp = join(directory, "scene.part.json");
    const glbPath = join(directory, "model.glb");
    const infoPath = join(directory, "scene.json");
    const startedAt = Date.now();

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 缓存与视口边界怎样影响验收？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

文件缓存键使用realpath、大小、mtime、配方与修改器，没有读取完整内容摘要。通常保存会改变mtime，但同大小同时间写入可能保持旧key，这是源码推断的边界，未复现。视口又只有glTF子集，缺失纹理不能判文件损坏。API认证保护访问者身份，serve未显式限定工作区根，应由可信本地部署理解其文件读取范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/blender.js:311-316](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/blender.js#L311-L316)

缓存键的具体组成。

```text
/** The cache key for one file version and export recipe. */
function cacheKey(realPath, size, mtimeMs, applyModifiers) {
  return createHash("sha1")
    .update(`${realPath}\0${String(size)}\0${String(Math.round(mtimeMs))}\0${String(RECIPE)}\0${applyModifiers ? "1" : "0"}`)
    .digest("hex")
    .slice(0, 24);
```

**依据 2 · 源码核查**：[lib/route.js:49-66](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/route.js#L49-L66)

绝对路径和文件检查并非工作区根约束。

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

**依据 3 · 作者声明**：[README.zh.md:71-76](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/README.zh.md#L71-L76)

显示子集由作者说明。

```text
dev/client-body.js   客户端 UI（DSH 模块加载器要求的单个 CJS 工厂）
dev/viewer.js        WebGL 渲染器，构建时拼进 bundle
scripts/build-client.mjs   由上面两个文件生成 lib/client.js
scripts/e2e-browser.mjs    针对临时 DSH 实例的 Playwright 端到端
scripts/live-selftest.mjs  真实 .blend 的冷/热/并发转换自检
node --test test/*.test.js
```

#### 缺口

- 缓存极端改写和场景视觉一致性未测试
  **影响**：限制自动以预览代替源文件验收
  **进一步探讨**：对照内容摘要、已知尺寸和纹理场景核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么用户能够以可控成本试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已安装Blender且经常检查静态几何的人最合适；只看偶发文件的用户可能直接用Blender更省。资源包括每次新版本的Blender进程、GLB磁盘和WebGL内存，缓存减少重复转换但不能消除首次导出。失败时可按missing/timeout/too-large错误区分处理，增大超时会扩大资源等待，不能当普遍修复。作者2–10秒是声明，没有本轮测量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/route.js:130-147](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/route.js#L130-L147)

缺依赖、超时与大小错误分开。

<details>
<summary>查看原文（18行）</summary>

```text
/** HTTP status for one typed failure. */
function statusOf(code) {
  switch (code) {
    case "BLENDER_MISSING":
      return 503;
    case "BLEND_TIMEOUT":
      return 504;
    case "BLEND_TOO_LARGE":
      return 413;
    case "BLEND_ABORTED":
      return 499;
    case "BLEND_EXPORT_FAILED":
      return 422;
    case "BLEND_OUTPUT_INVALID":
    case "BLEND_UNLOADED":
      return 503;
    case "BLEND_NOT_A_FILE":
    case "BLEND_EMPTY":
```

</details>

**依据 2 · 源码核查**：[lib/blender.js:150-176](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/blender.js#L150-L176)

首次与缓存成本不同。

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

#### 缺口

- 大场景峰值资源与端到端耗时未知
  **影响**：无法量化单位检查成本
  **进一步探讨**：用固定场景记录冷/热耗时、缓存大小及人工切换时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 内容摘要与缺口提示能否降低误验？

**研究主题**：新假设与验证

#### 完整回答

未验证方案以保存事件触发内容摘要，保留小文件快速路径，并向视口标注未表达材质/动画。推导分别来自缓存键和渲染子集的可见限制。比较当前方案和原型对同大小改写、纹理场景的误判与延迟；若摘要扫描显著增时而误验无改善，不值得默认启用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/blender.js:311-316](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/lib/blender.js#L311-L316)

元数据key是摘要设计的直接参照。

```text
/** The cache key for one file version and export recipe. */
function cacheKey(realPath, size, mtimeMs, applyModifiers) {
  return createHash("sha1")
    .update(`${realPath}\0${String(size)}\0${String(Math.round(mtimeMs))}\0${String(RECIPE)}\0${applyModifiers ? "1" : "0"}`)
    .digest("hex")
    .slice(0, 24);
```

**依据 2 · 作者声明**：[README.zh.md:71-76](https://github.com/439436269-ctrl/dsh-blend-preview/blob/13329cb254373de94a2ccbbf6222401228a9c81e/README.zh.md#L71-L76)

静态子集限制支持显式提示。

```text
dev/client-body.js   客户端 UI（DSH 模块加载器要求的单个 CJS 工厂）
dev/viewer.js        WebGL 渲染器，构建时拼进 bundle
scripts/build-client.mjs   由上面两个文件生成 lib/client.js
scripts/e2e-browser.mjs    针对临时 DSH 实例的 Playwright 端到端
scripts/live-selftest.mjs  真实 .blend 的冷/热/并发转换自检
node --test test/*.test.js
```

#### 缺口

- 原型收益未验证
  **影响**：不得作为现有功能或评分依据
  **进一步探讨**：小规模故意制造元数据碰撞并观察用户验收。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
