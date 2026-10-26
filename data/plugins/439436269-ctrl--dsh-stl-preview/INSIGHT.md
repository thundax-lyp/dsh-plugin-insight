# dsh-stl-preview

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[7f85985](https://github.com/439436269-ctrl/dsh-stl-preview/tree/7f8598583529962a6778320bc6185b6ea4168c63)

<!-- BEGIN META -->
[![npm 30d 45](https://img.shields.io/static/v1?label=npm+30d&message=45&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-stl-preview) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-stl-preview)
<!-- END META -->

> **实现功能**：在DSH侧栏查看STL网格，并显示尺寸、面积、体积及边拓扑检查。

> **核心亮点**：相对切片器直开或普通3D查看器，增量是工作区内的STL解析、几何测量与边拓扑初筛；三角网格公式属于标准机制，未证明打印成功率提升。[Q01](#research-q01)

> **风险与缺陷**：无向边计数及容差焊接不足以排除自交、反向面和制造问题；Host分块传输仍对应浏览器全量缓冲，不能据此承诺大网格低内存。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 侧栏STL检查增加什么交付能力？](#detail-section-11)
  - [Q02 · “水密”和体积是否足以证明可打印？](#detail-section-12)
  - [Q03 · Host流式传输是否消除了大模型成本？](#detail-section-13)
  - [Q04 · 哪些工程机制值得借鉴，旧包应如何采用？](#detail-section-14)
  - [Q05 · 怎样减少几何指标造成的错误验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在DSH内做STL打印前几何初筛的人；尺寸依赖明确单位，最终制造与切片仍需专业工具。[Q01](#research-q01)

直接用切片器打开STL是简单基线，具备打印配置与进一步验证；本项只比较实现流程，没有同任务效果实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|STL预览|初筛网格形态|WebGL、浏览器全量缓冲|
|几何统计|尺寸面积体积|unitScale正确，非打印验收|
|边拓扑检查|提示开边和非流形|容差焊接，超阈值跳过|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|DSH fs/connection|必需|文件读取与认证|核对权限或专业工具直开|
|WebGL与浏览器内存|必需|显示、全量解析|降低模型复杂度|
|正确unitScale|物理量判断必需|尺寸面积体积|对照已知尺寸样件|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|核对迁移与兼容|用户确认目标包入口|暂缓新装旧包|
|配置单位并打开样件|用户确认尺寸|改unitScale|
|检查边拓扑和跳过提示|用户以切片器复核|不将水密作为最终放行|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|DSH、WebGL环境|安装并确认STL单位|兼容与耗时|
|持续|浏览器全量字节、顶点数组和GPU|查看并在切片器复核|峰值与节时|
|失败恢复|重新读取解析网格|查权限、降低网格复杂度|重试次数与恢复时间|

#### 效果

|效果项|支持|未知|
|---|---|---|
|几何初筛|STL解析及统计源码|准确率和节时|
|Host读取有界|分块readByteRange|浏览器/GPU峰值|
|水密检查|容差焊接及边计数|自交、方向和打印成功|

> **思考**：无向边计数及容差焊接不足以排除自交、反向面和制造问题；Host分块传输仍对应浏览器全量缓冲，不能据此承诺大网格低内存。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对切片器直开或普通3D查看器，增量是工作区内的STL解析、几何测量与边拓扑初筛；三角网格公式属于标准机制，未证明打印成功率提升。[Q01](#research-q01)

相对切片器直开或普通3D查看器，增量是工作区内的STL解析、几何测量与边拓扑初筛；三角网格公式属于标准机制，未证明打印成功率提升。[Q01](#research-q01)

宿主文件服务、effect路由释放与统一参数注入可复用；浏览器内存、算法覆盖及旧包迁移仍需验收。[Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

无向边计数及容差焊接不足以排除自交、反向面和制造问题；Host分块传输仍对应浏览器全量缓冲，不能据此承诺大网格低内存。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察旧包入口；已有用户只把小型STL当初筛，先确认新包入口与单位，最终打印验证交给切片器。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有集成机制有源码支持；节时、保真与宿主兼容未执行验证；设计假设未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/route.js、dev/client-body.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码级检查Host路由、宿主接线和浏览器解析/统计；未逐行审计WebGL查看器，未执行。
- 下一步：授权后以已知单位、开边、自交、反向面和超阈值网格对照切片器，测误验、响应与禁用恢复。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-stl-preview](https://github.com/439436269-ctrl/dsh-stl-preview)
- **版本号**：0.1.0（[固定提交 7f85985](https://github.com/439436269-ctrl/dsh-stl-preview/tree/7f8598583529962a6778320bc6185b6ea4168c63)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是显式标注单位与算法覆盖，并将统计移入可取消worker，减少误验及界面阻塞；对照自交/单位错误/大网格任务，若误判或总成本不改善则否定。[Q05](#research-q05)

授权后以已知单位、开边、自交、反向面和超阈值网格对照切片器，测误验、响应与禁用恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 296 | — | — | 2547 |
| .js | source | 7 | 3516 | 3093 | 225 | — |
| .mjs | source | 3 | 279 | 229 | 32 | — |
| .js | test | 4 | 497 | 455 | 17 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-stl-preview/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：STL侧栏测量对打印前筛查提供什么增量，其几何和成本边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏STL检查增加什么交付能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是对工作区产生的STL做打印前初筛，合格结果是识别外形、尺寸及明显拓扑异常，再交给切片器。作者声明二进制/ASCII解析、体积面积和水密检查，index实际注册Host字节路由并向浏览器注入单位与阈值。相对切片器直接打开，增量是保持DSH上下文且不需Blender后台转换；相对普通3D查看器增加几何统计。算法是标准三角形面积、四面体体积及边计数，不能视为新几何理论。README明确此库是旧0.1.x，新包已迁往dsh-preview-stl；新入口未在本项验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/README.md#L1-L20)

作者声明目标、迁移及无Blender依赖

<details>
<summary>查看原文（20行）</summary>

```text
> **Renamed:** the canonical package is now [`dsh-preview-stl`](https://github.com/439436269-ctrl/dsh-preview-stl). This repository is kept as the legacy 0.1.x home.

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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:31-49](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/lib/index.js#L31-L49)

Host接线及参数注入

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

#### 缺口

- 缺少同任务基线的端到端收益结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “水密”和体积是否足以证明可打印？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能。解析器按84字节头、面数及50字节每面判定二进制，否则回退ASCII；统计遍历顶点累积包围盒、叉积面积和有向体积，最后对体积取绝对值。网格焊接以模型对角线乘1e-5形成容差，将坐标取整映射顶点，再以无向边使用次数判断边界/非流形/退化面。该检查能发现部分开边与拓扑问题，但未检查自交、法向全局一致或薄壁可制造性；闭合且自交模型可能仍通过，体积也受面方向抵消影响。这是算法范围推导，不是已复现实例。unitScale错误会使长度、面积和体积按不同幂次失真。大于analysisMaxTriangles跳过水密，但仍全量解析和基础统计，不能把跳过解释成已通过。

#### 证据与依据

**依据 1 · 源码核查**：[dev/client-body.js:266-276](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L266-L276)

格式判定

<details>
<summary>查看原文（11行）</summary>

```text
    function parseStl(buffer) {
      const bytes = new Uint8Array(buffer);
      if (bytes.byteLength === 0) throw Object.assign(new Error("empty file"), { code: "STL_EMPTY" });
      if (bytes.byteLength >= 84) {
        const view = new DataView(buffer);
        const count = view.getUint32(80, true);
        if (count > 0 && 84 + count * 50 <= bytes.byteLength && count <= 50_000_000) {
          return parseBinaryStl(view, count, bytes);
        }
      }
      return parseAsciiStl(new TextDecoder().decode(bytes));
```

</details>

**依据 2 · 源码核查**：[dev/client-body.js:368-414](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L368-L414)

面积体积、单位及阈值

<details>
<summary>查看原文（47行）</summary>

```text
    function analyzeStl(parsed, options) {
      const positions = parsed.positions;
      const count = parsed.triangleCount;
      const min = [Infinity, Infinity, Infinity];
      const max = [-Infinity, -Infinity, -Infinity];
      let areaRaw = 0;
      let volumeRaw = 0;
      for (let triangle = 0; triangle < count; triangle += 1) {
        const base = triangle * 9;
        const ax = positions[base], ay = positions[base + 1], az = positions[base + 2];
        const bx = positions[base + 3], by = positions[base + 4], bz = positions[base + 5];
        const cx = positions[base + 6], cy = positions[base + 7], cz = positions[base + 8];
        for (const [x, y, z] of [[ax, ay, az], [bx, by, bz], [cx, cy, cz]]) {
          if (x < min[0]) min[0] = x;
          if (y < min[1]) min[1] = y;
          if (z < min[2]) min[2] = z;
          if (x > max[0]) max[0] = x;
          if (y > max[1]) max[1] = y;
          if (z > max[2]) max[2] = z;
        }
        const ux = bx - ax, uy = by - ay, uz = bz - az;
        const vx = cx - ax, vy = cy - ay, vz = cz - az;
        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        areaRaw += 0.5 * Math.hypot(nx, ny, nz);
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

**依据 3 · 源码核查**：[dev/client-body.js:419-453](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L419-L453)

网格焊接与无向边判定

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Host流式传输是否消除了大模型成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Host通过ctx.fs.resolve/stat及readByteRange逐块发送数据，避免Host一次性读全文件，且请求取消停止后续块。但浏览器仍await response.arrayBuffer，再分配positions/normals并在主线程解析和分析；所以内存压力被分配到浏览器，不能宣称端到端恒定内存。首次需要DSH插件配置和WebGL，STL单位必须由用户明确；无需外部Blender不等于没有GPU、内存和复核成本。持续使用每次下载/解析网格，失败恢复需检查大小限制、权限和GPU，并退回切片器。512MiB默认仅是输入大小限制，不是浏览器占用上限；本轮没有资源峰值、现金或人工耗时数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/route.js:51-92](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/lib/route.js#L51-L92)

文件服务分块与取消

<details>
<summary>查看原文（42行）</summary>

```text
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
  } catch (error) {
    return fail(statusOf(error), codeOf(error));
  }
}

/**
 * Yield the file in fixed-size windows.
 * @param fs - composed filesystem provider.
 * @param target - resolved file target.
 * @param size - total byte count.
 * @param chunkBytes - largest single read.
 * @param signal - aborts on a closed connection.
 * @returns the byte stream handed to the response.
 */
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

**依据 2 · 源码核查**：[dev/client-body.js:531-548](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L531-L548)

浏览器整包缓冲与主线程解析

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 3 · 作者声明**：[README.md:34-43](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/README.md#L34-L43)

默认容量和分析阈值

<details>
<summary>查看原文（10行）</summary>

```text
| Key | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Register the renderer and the byte route. |
| `routePath` | `/api/stl-preview` | Authenticated mesh route. Must stay under `/api`; otherwise it falls back to the default. |
| `extensions` | `["stl"]` | Suffixes that open in the 3D preview. |
| `maxBytes` | `536870912` | Largest STL streamed (512 MiB). |
| `chunkBytes` | `1048576` | Bytes per ranged read on the host. |
| `unitScale` | `1` | Millimetres per STL unit; drives size, volume and area. |
| `color` | `#c7d2e2` | Viewport colour (STL carries no materials). |
| `analysisMaxTriangles` | `400000` | Above this, skip the watertightness pass instead of freezing the tab. |
```

</details>

#### 缺口

- 缺少实际资源峰值、失败恢复时间与单位合格任务成本
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些工程机制值得借鉴，旧包应如何采用？

**研究主题**：工程质量与复用、采用判断

#### 完整回答

正面设计是用宿主ctx.fs承担文件访问而不是绕过文件服务，用effect管理路由，使用统一注入使客户端路由、单位和阈值不漂移。权限仍依赖具体宿主fs与connection实现，本组件不能独立证明多用户隔离。旧包已改名，加上水密算法不是可打印性验证，当前建议观察此入口；已有用户可将其用作小模型几何初筛，交付必须在切片器检查。试用先取已知单位的立方体、开边、非流形和大网格，检查尺寸、统计跳过提示及禁用恢复；若误报“可打印”或界面长期阻塞则停止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:21-49](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/lib/index.js#L21-L49)

fs依赖、生命周期和参数接线

<details>
<summary>查看原文（29行）</summary>

```text
/** Host services the route needs: the filesystem and the authenticated fence. */
export const inject = ["fs", "connection"];

export { Config };

/**
 * Mount the byte route and expose its path to the browser half.
 * @param ctx - host context carrying `fs` and `connection`.
 * @param config - loader-supplied configuration.
 */
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
```

</details>

**依据 2 · 源码核查**：[lib/route.js:25-31](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/lib/route.js#L25-L31)

文件读取交接给宿主

```text
export function registerStlRoute(ctx, config) {
  return ctx.connection.fetch.register({
    path: config.routePath,
    methods: ["GET", "HEAD"],
    requestBody: "buffered",
    fetch: (request) => serve(request, ctx.fs, config),
  });
```

**依据 3 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/README.md#L1-L5)

旧包身份约束采用

```text
> **Renamed:** the canonical package is now [`dsh-preview-stl`](https://github.com/439436269-ctrl/dsh-preview-stl). This repository is kept as the legacy 0.1.x home.

# dsh-stl-preview

Preview **STL** meshes inside [DeepSeek Harness](https://github.com/deepseek-ai): the right-Sidebar document preview renders the triangles in an interactive 3D viewport and reports the numbers that matter for 3D printing — size, volume, surface area and watertightness.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样减少几何指标造成的错误验收？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把拓扑结果标为“边连通检查”，同时显示单位来源、分析跳过与自交未覆盖，再将重统计移入可取消worker，可降低打印前误判并改善大网格响应。推导来自无向边判定和主线程全量缓冲；新增负担为worker复制/转移、结果版本绑定和提示理解。最小验证用闭合自交、反向面、微小间隙及超阈值网格，对照切片器检查和现有界面，测假阳性、单位错误、输入响应及人工复核时间。若误判无减少或提示/worker提高总检查时间，则否定；这不是项目当前实现，也未获得用户需求或付费证据。

#### 证据与依据

**依据 1 · 源码核查**：[dev/client-body.js:419-453](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L419-L453)

现有拓扑检查边界

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

**依据 2 · 源码核查**：[dev/client-body.js:540-548](https://github.com/439436269-ctrl/dsh-stl-preview/blob/7f8598583529962a6778320bc6185b6ea4168c63/dev/client-body.js#L540-L548)

主线程分析构成性能假设依据

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
```

#### 缺口

- 未来设计假设的对照实验尚无结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
