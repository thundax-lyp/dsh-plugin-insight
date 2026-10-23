# dsh-stl-preview

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[fd1ad27](https://github.com/439436269-ctrl/dsh-stl-preview/tree/fd1ad275dd93c3a3766a0924f34309df85ade782)

<!-- BEGIN META -->
[![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-stl-preview)
<!-- END META -->

> **实现功能**：在Harness文档预览中查看STL三维网格，显示尺寸、体积、表面积与水密性检查。

> **核心亮点**：把轻量WebGL、浏览器STL解析和Host权限文件流接入文档预览，减少看形状时切换工具；查看器沿用blend-preview思路，几何公式和边计数不声称原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：水密标记仅检查量化焊接后的无向边使用数与退化顶点，不检查自交、面朝向或可打印性；大三角数只跳过边表，解析和面积体积仍走主线程。不能从绿色标记推断打印成功或内存有界。参见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要STL模型预览，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 文件路径、解析与浏览器渲染如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使STL模型预览的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从文件路径、解析与浏览器渲染的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用STL模型预览，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为在Harness工作区生成或检查STL的开发者提供就地旋转查看与几何摘要；合格输出是确认形状和尺寸假设，再交切片器验证打印，不是出具可制造证明。

系统3D查看器和切片器提供直接替代；插件的独立价值是Harness上下文内的快速初看，不是新增制造能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| STL三维视图 | 就地查看binary/ASCII网格 | WebGL与浏览器内存必需 |
| 尺寸/体积/面积 | 快速几何摘要 | STL无单位，体积依赖有效闭合与绕序 |
| 水密性子集检查 | 边界/非流形/退化提示 | 量化焊接，超阈值跳过，非打印保证 |
| 鉴权字节路由 | Host文件到浏览器 | 依赖connection fence与ctx.fs权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=22、Cordis ^4.0.1及DSH预览API | 必需 | 加载Host和客户端渲染器 | 兼容表只声明0.2.0-rc.2/0.2.1-rc.2 |
| connection与fs权限 | 必需 | 鉴权与文件读取 | 类型化文件错误转403/404等 |
| WebGL浏览器及内存 | 必需 | 解析与绘制 | WebGL缺失会失败；大文件可占多份内存 |
| 正确unitScale | 尺寸判断必需 | 解释无单位STL | 默认毫米可能使尺寸/体积失真 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装对应profile并重启 | 预览器注册且鉴权路由可用 |
| 2 | 设置单位和文件/三角数上限 | 单位与建模来源一致 |
| 3 | 点开STL并旋转查看 | ready且尺寸/跳过标记明确 |
| 4 | 在切片器独立复核 | 拓扑与打印参数通过后才生产 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地Host、浏览器/GPU资源，金额未知 | 安装、核对单位和权限，时间未知 | 无需Blender服务链 |
| 持续使用 | 完整文件buffer、顶点/法线/GPU及边表内存 | 查看几何并送切片器复核 | 512MiB文件上限不等于浏览器内存上限 |
| 失败恢复 | 重新拉取/解析资源，量未知 | 降低上限、关闭预览、换专业工具 | 主线程解析难以即时打断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 就地预览 | 渲染器注册、二进制/ASCII解析 | 真实设备交互延迟 |
| 几何摘要 | 尺寸/面积/有符号体积及边计数公式 | 模型朝向、自交与误焊下正确性 |
| 传输边界 | Host按chunk读取并no-store | 浏览器峰值内存与大文件响应性 |

> **思考**：水密标记仅检查量化焊接后的无向边使用数与退化顶点，不检查自交、面朝向或可打印性；大三角数只跳过边表，解析和面积体积仍走主线程。不能从绿色标记推断打印成功或内存有界。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把轻量WebGL、浏览器STL解析和Host权限文件流接入文档预览，减少看形状时切换工具；查看器沿用blend-preview思路，几何公式和边计数不声称原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

把轻量WebGL、浏览器STL解析和Host权限文件流接入文档预览，减少看形状时切换工具；查看器沿用blend-preview思路，几何公式和边计数不声称原创。参见[Q01](#research-q01)、[Q02](#research-q02)。

Host配置注入保证两端路由一致，ctx.fs保持宿主权限；大小限制与三角统计门槛分离值得借鉴。复用需区分端侧峰值内存、算法诊断范围和UI绿色信号的含义。

<a id="detail-section-5"></a>

### 1.4 主要限制

水密标记仅检查量化焊接后的无向边使用数与退化顶点，不检查自交、面朝向或可打印性；大三角数只跳过边表，解析和面积体积仍走主线程。不能从绿色标记推断打印成功或内存有界。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有STL检查需求者先用小网格试用，明确单位并保留切片器复核；内存紧张、要求制造质量或不可信超大文件时暂缓。发生单位不明、分析跳过或视口卡顿就切专业工具。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持就地预览与有限几何检查；打印质量、性能和worker假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、lib/index.js、lib/route.js、lib/config.js、dev/client-body.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host入口/route/config及客户端原始解析、分析和注册链；viewer沿用归属依作者说明，未执行目标脚本。
- 下一步：以已知尺寸、开口、自交、反向面及大文件做专业工具对照，分别记录正确性、取消响应和内存。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-stl-preview](https://github.com/439436269-ctrl/dsh-stl-preview)
- **版本号**：0.1.0（[固定提交 fd1ad27](https://github.com/439436269-ctrl/dsh-stl-preview/tree/fd1ad275dd93c3a3766a0924f34309df85ade782)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将解析与拓扑分析移到worker并分阶段给出“形状可见／单位确认／拓扑部分检查”收据；用相反绕序、自交壳、极近顶点和大网格对照专业检查器，若取消无效或误导标记未降则否定。代价是worker传输和版本化诊断，假设未验证。参见[Q05](#research-q05)。

以已知尺寸、开口、自交、反向面及大文件做专业工具对照，分别记录正确性、取消响应和内存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 294 | — | — | 2524 |
| .js | source | 7 | 3516 | 3093 | 225 | — |
| .mjs | source | 3 | 279 | 229 | 32 | — |
| .js | test | 4 | 497 | 455 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-stl-preview/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 fd1ad275dd93c3a3766a0924f34309df85ade782 和截止 2026-10-23T01:41:11Z 范围内，STL模型预览能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要STL模型预览，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在Harness里生成STL的开发者可就地确认形状及尺寸假设；合格交付是可读预览和可解释几何摘要，再由切片器核查制造条件。相比下载后打开外部查看器，它减少初看切换，浏览器STL/WebGL算法与上游查看器能力不算原创。

作者的“不上传”具体指文件从Host直接到本会话浏览器，无额外云转换。简单替代是下载后用系统查看器/切片器，优势主要在工作区连续性；若本来就需切片，该插件只节省初看一步而不替代制造流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-24](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/README.md#L1-L24)

作者定位STL工作区预览

<details>
<summary>查看原文（24行）</summary>

````text
# dsh-stl-preview

Preview **STL** meshes inside [DeepSeek Harness](https://github.com/deepseek-ai): the right-Sidebar document preview renders the triangles in an interactive 3D viewport and reports the numbers that matter for 3D printing — size, volume, surface area and watertightness.

![The STL preview inside the DSH right Sidebar](https://raw.githubusercontent.com/439436269-ctrl/dsh-stl-preview/main/docs/stl-preview.png)

## What it does

- Registers a document-preview renderer for `.stl` files, so clicking one in **Workspace files** opens it in the right Sidebar.
- Streams the file through an authenticated `/api/stl-preview` route and parses **binary and ASCII STL in the browser** — nothing is uploaded, nothing is converted on the host.
- Draws the mesh with the same dependency-free WebGL viewer used by `dsh-blend-preview`: orbit, pan, wheel zoom, double-click reset, wireframe, auto-rotate, contact shadow, axis triad. STL is Z-up, so the mesh is rotated into the Y-up viewport before drawing.
- Reports: format (binary/ASCII + header), file size, triangle count, welded vertex count, bounding box in millimetres, volume in cm³, surface area in cm², and **watertightness** (boundary edges / non-manifold edges / degenerate facets), computed by welding vertices on a grid and counting edge uses.
- Handles unitless STL with a configurable `unitScale` (1 = millimetres, 10 = centimetres, 25.4 = inches).

## Requirements

- DeepSeek Harness 0.2.x (declared compatible with `0.2.0-rc.2` and `0.2.1-rc.2`).
- A browser/GPU with WebGL (the desktop app always has it). No Blender, no slicer, no network.

## Install

```sh
dsh plugin --profile <profile> add dsh-stl-preview
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:31-50](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/lib/index.js#L31-L50)

路由和客户端配置的接线

<details>
<summary>查看原文（20行）</summary>

```text
export function apply(ctx, config) {
  const settings = resolveConfig(config);
  if (!settings.enabled) return;

  ctx.effect(() => registerStlRoute(ctx, settings), "stl-preview: mesh route");

  // The client reads its route and display settings from the served page, so a
  // configured path and the client's URL can never drift apart.
  ctx.on("webserver/index-inject", (table) => {
    table.push({
      kind: "global",
      name: "__DSH_STL_PREVIEW_CONFIG__",
      value: {
        routePath: settings.routePath,
        extensions: settings.extensions,
        unitScale: settings.unitScale,
        color: settings.color,
        analysisMaxTriangles: settings.analysisMaxTriangles,
      },
    });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件路径、解析与浏览器渲染如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host注册鉴权/api字节路由，ctx.fs解析权限后分块读取；客户端预览器fetch完整buffer，解析binary/ASCII、计算指标、变换坐标并上传WebGL。需Node22、宿主预览/connection/fs、WebGL和内存；用户先安装重启及确认unitScale，再打开小模型，失败转专业工具。

文件绝对路径经过宿主fs.resolve及stat，不在插件中另建沙箱；鉴权依赖connection的/api fence。浏览器收到完整字节后产生triangle soup和GPU数据，Host流式不能等价为端到端流式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/route.js:41-67](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/lib/route.js#L41-L67)

路径、类型、大小和HEAD/GET处理

<details>
<summary>查看原文（27行）</summary>

```text
async function serve(request, fs, config) {
  if (!config.enabled) return fail(503, "STL preview is disabled.");
  const method = request.method === "HEAD" ? "HEAD" : "GET";
  const url = new URL(request.url);
  const path = url.searchParams.get("path");
  if (path === null || path === "") return fail(400, "Missing `path`.");
  if (path.includes("\0") || !isAbsolutePath(path)) return fail(400, "An absolute path is required.");
  const suffix = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  if (!config.extensions.includes(suffix)) return fail(400, `Only ${config.extensions.map((item) => `.${item}`).join(", ")} files are previewed.`);

  const signal = request.signal;
  try {
    const target = await fs.resolve(path, { signal });
    const info = await fs.stat(target, signal);
    if (info === undefined) return fail(404, "not found");
    if (info.type !== "file") return fail(403, "not a regular file");
    const size = typeof info.size === "number" ? info.size : 0;
    if (size === 0) return fail(416, "empty file");
    if (size > config.maxBytes) return fail(413, `file exceeds the ${config.maxBytes}-byte limit`);

    const headers = {
      ...BASE_HEADERS,
      "Content-Type": "model/stl",
      "Content-Length": String(size),
    };
    if (method === "HEAD") return new Response(null, { status: 200, headers });
    return new Response(streamMesh(fs, target, size, config.chunkBytes, signal), { status: 200, headers });
```

</details>

**依据 2 · 源码核查**：[lib/route.js:82-92](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/lib/route.js#L82-L92)

分块读取并传递AbortSignal

<details>
<summary>查看原文（11行）</summary>

```text
function streamMesh(fs, target, size, chunkBytes, signal) {
  const source = (async function* readChunks() {
    for (let offset = 0; offset < size; offset += chunkBytes) {
      if (signal.aborted) return;
      const length = Math.min(chunkBytes, size - offset);
      const bytes = await fs.readByteRange(target, { offset, length }, signal);
      if (signal.aborted) return;
      if (bytes.byteLength > 0) yield bytes;
    }
  })();
  return Readable.toWeb(Readable.from(source));
```

</details>

**依据 3 · 源码核查**：[dev/client-body.js:524-563](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L524-L563)

完整buffer、同步解析分析与上传GPU

<details>
<summary>查看原文（40行）</summary>

```text
      React.useEffect(() => {
        if (absolutePath === undefined) return undefined;
        const controller = new AbortController();
        setState("loading");
        setFailure(null);
        setStats(null);

        (async () => {
          const response = await fetch(assetUrl(routePath, absolutePath, version), {
            signal: controller.signal,
            credentials: "same-origin",
          });
          if (!response.ok) {
            const detail = await response.text().catch(() => "");
            throw { message: detail || tRef.current("readFailed"), code: "HTTP_" + String(response.status) };
          }
          const bytes = await response.arrayBuffer();
          if (controller.signal.aborted) return;
          setState("parsing");
          await new Promise((resolve) => setTimeout(resolve, 30));
          const parsed = parseStl(bytes);
          if (controller.signal.aborted) return;
          setState("analyzing");
          await new Promise((resolve) => setTimeout(resolve, 20));
          const analysis = analyzeStl(parsed, { unitScale, analysisMaxTriangles });
          if (controller.signal.aborted) return;
          const viewer = viewerRef.current;
          if (viewer === null) {
            throw {
              message: tRef.current("invalid") + (viewerErrorRef.current === "" ? "" : " " + viewerErrorRef.current),
              code: "WEBGL_MISSING",
            };
          }
          const modelStats = viewer.setGeometry({
            positions: toYUp(parsed.positions),
            normals: toYUp(parsed.normals),
            color: hexToLinear(color),
          });
          setStats({ ...analysis, ...modelStats, sizeMm: analysis.sizeMm, bytes: bytes.byteLength });
          setState("ready");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使STL模型预览的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

水密结论只来自焊接后无向边使用数和退化计数，不覆盖自交、面绕序和可打印性，绿色状态容易被过度解释。边表阈值也不免去主线程解析与面积体积循环。配置注入和权限文件流可复用，几何诊断必须说明覆盖。

边表按包围盒对角线比例生成epsilon并四舍五入焊接，因此近邻顶点可能合并、量化边界又可能分开；有符号体积取绝对和，对非闭合/绕序不一致网格不保证实体体积。工程上配置注入、AbortController和no-store很清楚，移植须保留宿主权限与状态收据。

#### 证据与依据

**依据 1 · 源码核查**：[dev/client-body.js:394-414](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L394-L414)

体积公式和随几何尺度变化的焊接epsilon

<details>
<summary>查看原文（21行）</summary>

```text
        volumeRaw += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
      }
      const scale = options.unitScale;
      const sizeMm = [0, 1, 2].map((axis) => (max[axis] - min[axis]) * scale);
      const result = {
        format: parsed.format,
        header: parsed.header,
        triangles: count,
        sizeMm,
        volumeCm3: (Math.abs(volumeRaw) * scale ** 3) / 1000,
        areaCm2: (areaRaw * scale ** 2) / 100,
        watertight: null,
        weldedVertices: count * 3,
        boundaryEdges: 0,
        nonManifoldEdges: 0,
        degenerateTriangles: 0,
        analysisSkipped: count > options.analysisMaxTriangles,
      };
      if (!result.analysisSkipped) {
        const diagonal = Math.max(Math.hypot(max[0] - min[0], max[1] - min[1], max[2] - min[2]), 1e-9);
        const epsilon = Math.max(diagonal * 1e-5, 1e-6);
```

</details>

**依据 2 · 源码核查**：[dev/client-body.js:419-453](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L419-L453)

无向边计数为水密判据

<details>
<summary>查看原文（35行）</summary>

```text
        const index = (x, y, z) => {
          const key = `${Math.round(x / epsilon)}:${Math.round(y / epsilon)}:${Math.round(z / epsilon)}`;
          let value = welded.get(key);
          if (value === undefined) {
            value = weldedVertices;
            weldedVertices += 1;
            welded.set(key, value);
          }
          return value;
        };
        for (let triangle = 0; triangle < count; triangle += 1) {
          const base = triangle * 9;
          const a = index(positions[base], positions[base + 1], positions[base + 2]);
          const b = index(positions[base + 3], positions[base + 4], positions[base + 5]);
          const c = index(positions[base + 6], positions[base + 7], positions[base + 8]);
          if (a === b || b === c || c === a) {
            degenerate += 1;
            continue;
          }
          for (const [from, to] of [[a, b], [b, c], [c, a]]) {
            const key = from < to ? `${from}:${to}` : `${to}:${from}`;
            edges.set(key, (edges.get(key) ?? 0) + 1);
          }
        }
        let boundary = 0;
        let nonManifold = 0;
        for (const uses of edges.values()) {
          if (uses === 1) boundary += 1;
          else if (uses > 2) nonManifold += 1;
        }
        result.weldedVertices = weldedVertices;
        result.boundaryEdges = boundary;
        result.nonManifoldEdges = nonManifold;
        result.degenerateTriangles = degenerate;
        result.watertight = boundary === 0 && nonManifold === 0 && degenerate === 0;
```

</details>

**依据 3 · 源码核查**：[dev/client-body.js:540-549](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L540-L549)

同步解析和分析不能中途响应abort

<details>
<summary>查看原文（10行）</summary>

```text
          const bytes = await response.arrayBuffer();
          if (controller.signal.aborted) return;
          setState("parsing");
          await new Promise((resolve) => setTimeout(resolve, 30));
          const parsed = parseStl(bytes);
          if (controller.signal.aborted) return;
          setState("analyzing");
          await new Promise((resolve) => setTimeout(resolve, 20));
          const analysis = analyzeStl(parsed, { unitScale, analysisMaxTriangles });
          if (controller.signal.aborted) return;
```

</details>

#### 缺口

- 与专业拓扑检查及真实设备的对照缺失
  **影响**：无法评价错误标记率和最大可用规模
  **进一步探讨**：固定一组已知缺陷网格逐项对照切片器并记录峰值内存

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次付出安装、权限与单位核对；持续付出完整输入buffer、CPU顶点数组/GPU副本和审形人工；失败需关闭预览、降规模或改用切片器。金额、峰值内存和时间未知；机制支持就地查看，不能承诺大文件安全或打印质量提高。

单位任务是正确确认一个模型形状及单位，不是成功显示画布。应把下载buffer、CPU数组、GPU副本与失败重试都计入，专业复核人工不能因预览便利省略。

#### 证据与依据

**依据 1 · 源码核查**：[dev/client-body.js:540-562](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L540-L562)

客户端内存和计算链

<details>
<summary>查看原文（23行）</summary>

```text
          const bytes = await response.arrayBuffer();
          if (controller.signal.aborted) return;
          setState("parsing");
          await new Promise((resolve) => setTimeout(resolve, 30));
          const parsed = parseStl(bytes);
          if (controller.signal.aborted) return;
          setState("analyzing");
          await new Promise((resolve) => setTimeout(resolve, 20));
          const analysis = analyzeStl(parsed, { unitScale, analysisMaxTriangles });
          if (controller.signal.aborted) return;
          const viewer = viewerRef.current;
          if (viewer === null) {
            throw {
              message: tRef.current("invalid") + (viewerErrorRef.current === "" ? "" : " " + viewerErrorRef.current),
              code: "WEBGL_MISSING",
            };
          }
          const modelStats = viewer.setGeometry({
            positions: toYUp(parsed.positions),
            normals: toYUp(parsed.normals),
            color: hexToLinear(color),
          });
          setStats({ ...analysis, ...modelStats, sizeMm: analysis.sizeMm, bytes: bytes.byteLength });
```

</details>

**依据 2 · 源码核查**：[lib/route.js:57-67](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/lib/route.js#L57-L67)

文件上限只约束输入字节

<details>
<summary>查看原文（11行）</summary>

```text
    const size = typeof info.size === "number" ? info.size : 0;
    if (size === 0) return fail(416, "empty file");
    if (size > config.maxBytes) return fail(413, `file exceeds the ${config.maxBytes}-byte limit`);

    const headers = {
      ...BASE_HEADERS,
      "Content-Type": "model/stl",
      "Content-Length": String(size),
    };
    if (method === "HEAD") return new Response(null, { status: 200, headers });
    return new Response(streamMesh(fs, target, size, config.chunkBytes, signal), { status: 200, headers });
```

</details>

#### 缺口

- 端到端耗时、GPU/内存和人工切换节省未测
  **影响**：不能量化ROI或大文件安全阈值
  **进一步探讨**：相同设备和模型对照就地预览与外部查看器

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从文件路径、解析与浏览器渲染的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是worker分阶段解析/分析并返回单位与拓扑覆盖收据。对照当前主线程实现和专业检查器，用反绕序、自交、极近顶点与大网格检查响应性和误导标记；不能取消、内存不降或错误诊断不减则否定，worker传输开销须计入。

推导来自可取消传输与不可中断同步分析的边界，以及单一水密布尔值承载过多含义。先显示形状、再声明已检查的拓扑子集，可保留交互便利并减少误读；worker并不自动修复几何算法，须分别验证响应性和正确性。

#### 证据与依据

**依据 1 · 源码核查**：[dev/client-body.js:524-578](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L524-L578)

传输取消与计算阶段分离的切入点

<details>
<summary>查看原文（55行）</summary>

```text
      React.useEffect(() => {
        if (absolutePath === undefined) return undefined;
        const controller = new AbortController();
        setState("loading");
        setFailure(null);
        setStats(null);

        (async () => {
          const response = await fetch(assetUrl(routePath, absolutePath, version), {
            signal: controller.signal,
            credentials: "same-origin",
          });
          if (!response.ok) {
            const detail = await response.text().catch(() => "");
            throw { message: detail || tRef.current("readFailed"), code: "HTTP_" + String(response.status) };
          }
          const bytes = await response.arrayBuffer();
          if (controller.signal.aborted) return;
          setState("parsing");
          await new Promise((resolve) => setTimeout(resolve, 30));
          const parsed = parseStl(bytes);
          if (controller.signal.aborted) return;
          setState("analyzing");
          await new Promise((resolve) => setTimeout(resolve, 20));
          const analysis = analyzeStl(parsed, { unitScale, analysisMaxTriangles });
          if (controller.signal.aborted) return;
          const viewer = viewerRef.current;
          if (viewer === null) {
            throw {
              message: tRef.current("invalid") + (viewerErrorRef.current === "" ? "" : " " + viewerErrorRef.current),
              code: "WEBGL_MISSING",
            };
          }
          const modelStats = viewer.setGeometry({
            positions: toYUp(parsed.positions),
            normals: toYUp(parsed.normals),
            color: hexToLinear(color),
          });
          setStats({ ...analysis, ...modelStats, sizeMm: analysis.sizeMm, bytes: bytes.byteLength });
          setState("ready");
          settleRef.current(true, version);
        })().catch((error) => {
          if (controller.signal.aborted) return;
          setFailure({
            code: typeof error?.code === "string" ? error.code : "UNKNOWN",
            message: error instanceof Error ? error.message : String(error?.message ?? error),
          });
          setState("failed");
          settleRef.current(false, version);
        });

        return () => {
          controller.abort();
        };
      }, [absolutePath, version, attempt, routePath, unitScale, color, analysisMaxTriangles]);
```

</details>

**依据 2 · 源码核查**：[dev/client-body.js:405-410](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L405-L410)

现有analysisSkipped状态可扩展为诊断覆盖

```text
        watertight: null,
        weldedVertices: count * 3,
        boundaryEdges: 0,
        nonManifoldEdges: 0,
        degenerateTriangles: 0,
        analysisSkipped: count > options.analysisMaxTriangles,
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用STL模型预览，何时应停止？

**研究主题**：采用判断

#### 完整回答

有STL初看需求的开发者可以小模型试用，先核对已知尺寸和unitScale，再用切片器确认打印条件。制造质量验收、不可信超大文件和内存受限设备应暂缓；单位不明、分析跳过或卡顿时停止并外部复核。

源码证据支持受控试用，不支持持续安装验收。使用可复制的小文件确认单位、尺寸与已知开口网格；显示不一致、分析被跳过或页面无响应时停止，关闭预览并用专业软件复核，不能靠重试掩盖错误。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:75-81](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/README.zh.md#L75-L81)

作者列出无单位和主线程大模型限制

```text

## 已知边界

- STL 无单位，面板里的毫米值按 `unitScale` 解释（默认 1）；按厘米建模的文件要把它设成 10。
- 超大网格（数百万三角面）在主线程解析，会有一小段等待；水密性统计到 `analysisMaxTriangles` 为止。
- ASCII STL 只解释标准语法里的顶点与法线，不处理顶点色等扩展。
- 不上传任何文件：字节从 Host 经鉴权路由到浏览器，在页面内解析。
```

**依据 2 · 源码核查**：[dev/client-body.js:565-576](https://github.com/439436269-ctrl/dsh-stl-preview/blob/fd1ad275dd93c3a3766a0924f34309df85ade782/dev/client-body.js#L565-L576)

失败状态和关闭时abort

<details>
<summary>查看原文（12行）</summary>

```text
        })().catch((error) => {
          if (controller.signal.aborted) return;
          setFailure({
            code: typeof error?.code === "string" ? error.code : "UNKNOWN",
            message: error instanceof Error ? error.message : String(error?.message ?? error),
          });
          setState("failed");
          settleRef.current(false, version);
        });

        return () => {
          controller.abort();
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
