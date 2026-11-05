# dsh-game-material-master

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[97b9f50](https://github.com/universe-st/dsh-game-material-master/tree/97b9f50cf74d3076365501022e370a5e609d8e02)

<!-- BEGIN META -->
[![GitHub ★ 142](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=142&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/universe-st/dsh-game-material-master) [![npm 30d 5,626](https://img.shields.io/static/v1?label=npm+30d&message=5%2C626&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-game-material-master) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-game-material-master)
<!-- END META -->

> **功能**：在 DSH 中生成和加工游戏素材，提供地图编辑、检查与导出工作台。

> **亮点**：[Q01](#research-q01) 将图像任务、阶段状态与地图检查工具带到同一工作台。

> **主要限制**：[Q02](#research-q02) 外部生成和本地处理须分开看，地图版本检查也不保证并发原子性。

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
  - [Q01 · 游戏素材制作的哪些步骤能在工作台交接？](#detail-section-11)
  - [Q02 · 本地处理与外部素材生成的边界在哪里？](#detail-section-12)
  - [Q03 · 如何试用本地地图，再判断是否接入外部生成？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：小团队从参考图制作可导入游戏项目的资产并检查小地图。

分别使用生成服务、图像处理和地图编辑器，并手工管理阶段文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图像任务 | 生成并处理素材 | 外部后端会接收所需输入 |
| 地图编辑 | 检查、预演及写入操作 | 需核对版本与导出 |
| 资产预览 | 回查生成和编辑结果 | 目标引擎导入需独立测试 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 及 Typert、Web Server | 必需 | 挂载工作台和资产路由 | 组合不符时不可用 |
| 隔离测试素材与目录 | 验收必需 | 编辑和核对导出 | 需要备份实际项目 |
| 生成后端及测试凭据 | 外部生成时必需 | 生成图像或其他素材 | 拒绝或费用未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选可弃用地图和测试图 | 不含敏感素材 |
| 编辑 | 用户预演并明确版本提交 | 核对区域、变更和导出 |
| 退出 | 用户回原编辑器和备份 | 不重复提交未知生成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型和资源未知 | 配置 Host 与隔离素材 | 外部后端按需 |
| 持续 | 生成与本地处理成本未知 | 审查质量和版本 | 不同模块需分别验收 |
| 失败 | 重做和恢复耗时未知 | 检查任务状态与已有文件 | 未知结果先核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 图像任务 | 生成并保存阶段状态 | 真实成品质量与费用 |
| 地图检查 | 预演并按版本拒绝旧修改 | 并发和引擎导入效果 |

> **思考**：[Q02](#research-q02) 外部生成和本地处理须分开看，地图版本检查也不保证并发原子性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将图像任务、阶段状态与地图检查工具带到同一工作台。

[Q02](#research-q02) dryRun 和 ifRevision 提供显式验收入口，仍需将版本检查和写入作为并发边界测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 外部生成和本地处理须分开看，地图版本检查也不保证并发原子性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先验证本地地图编辑，再单独评估外部生成和素材传输。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持代表性图像和地图路径。资产质量、运行兼容、权限与费用未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/imagegen.ts、src/mapgen.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 接线与代表性图像、俯视地图路径。未运行目标、DSH、模型、ffmpeg 或其他模块。
- 下一步：对照合成图、地图预演、旧版本和并发写入，另测导入与外部费用。

**分析版本**

- **仓库**：[universe-st/dsh-game-material-master](https://github.com/universe-st/dsh-game-material-master)
- **版本号**：0.11.2（[固定提交 97b9f50](https://github.com/universe-st/dsh-game-material-master/tree/97b9f50cf74d3076365501022e370a5e609d8e02)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 强制版本绑定并串行修改，比较协作编辑的丢更新与负担。

对照合成图、地图预演、旧版本和并发写入，另测导入与外部费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 9630 | — | — | 166632 |
| .js | source | 65 | 62739 | 52888 | 9757 | — |
| .mjs | source | 61 | 26458 | 21699 | 3379 | — |
| .ts | source | 65 | 75406 | 59176 | 12254 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/universe-st/dsh-game-material-master/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立游戏开发者能否在 DSH 生成、核对和修改可验收的图像与地图资产？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 游戏素材制作的哪些步骤能在工作台交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

独立游戏开发者可用参考图建立生图任务，逐项查看、抠像与重做，再在地图编辑器导入素材、检查地图并导出。相比在生成服务、后处理和地图编辑器间手工传文件，插件用同一 DSH 项目和工具入口保存中间状态。这里只检查单图生成与俯视地图的代表性路径，其他音频、骨骼和等距模块的质量仍需另测。合格成果应在目标项目中确认尺寸、透明边缘、地图通行与导入，而非仅凭生成状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-61](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/README.md#L43-L61)

作者定位及模块交付。

<details>
<summary>查看原文（19行）</summary>

```text
> **30 秒上手**：`dsh plugin --profile web add dsh-game-material-master` → 重启 DSH →
> 侧栏点「游戏素材大师」→ 设置里填好要用的 API Key（生图 / 视频；音效另填语音 Key）→ 新建项目、上传设定图 → 点「生成转圈视频」
>（默认路径：角色原地匀速转一圈，再自动截出八个方向；要逐方向生图就在阶段①切一下方式）。
>
> 侧栏那个入口上还有一个**小折角菜单按钮**：点它直接弹出八个功能，一步跳进要用的那个；
> 不用的功能可以在设置里关掉（见「功能管理」）。

八个模块共用同一套「生成 → 验收 → 重跑」工作台。每个阶段都能**单独重做**，每份产物都能
**逐项打「通过」**；「审核模式」可以选 agent 自动审完就往下走，也可以选每一步停下来等你点头。

| 模块 | 做什么 | 走完能拿到 |
|---|---|---|
| **① 八方向图生成** | 一张设定图 → 8 方位 × 8 帧（默认「转圈截帧」：一段转圈视频截出八个方向；两处视频都能**自己选本地文件**顶替生成） | 可用 WASD 操控预览的行走精灵图（中间每一张图都能单独存或整包 zip） |
| **② 图片生成** | 提示词（可带参考图）→ 出图 → 抠绿幕 | 干净透明的 PNG 立绘 / 道具 |
| **③ 序列帧生成** | 首尾帧或参考视频 → 生成视频 → 抽帧 → 抠像 | 横向排布、可循环播放的序列帧 |
| **⑤ 45°地图编辑器**（**全本地零计费**） | 导入自己的 45° 菱形素材（或用内置素材）→ 2:1 等距画布上画地面 / 自动连接 / 多格物件 / 标记 → 导出。素材属性在导入时一次定死（物件大小可在「新增素材」里按地格实时预览并自己调），之后只能改名字 / 播放速度 / 循环方式；内置草地、泥土、石地、水面、水岸自动连接与树 / 石 / 灌木 / 木桶 / 石屋 | PNG + 存档 JSON（等距网格、自动连接、动画地块、多格物件、标记点、通行性）；勾几项导几项，多个产物自动打成 ZIP |
| **⑥ 俯视地图编辑器**（**全本地零计费**） | 选一张素材图 → 直接画（参照 AsLib 的 RPG Map Maker 重做：一屏、纯图标、零术语；默认「地理层 / 装饰层 / 建筑层」三层且可改名换序；**标记层**：每格放一个可命名的标记，画成圆圈里的数字；素材窗口里还有 **AI 生成素材**：填提示词 / 名字 / 帧数 / 方式 / 用法，插件会**自动开一个新对话**去生成 —— 用哪种素材（普通 / 整格 / 拼块）由它按提示词自动判断，只让模型画**一块无缝的砖**，16 种接法 / 5 种形状与断口收口都由插件用代码拼出来（这样拼到地图上才不会有缝）。会动的素材走「拼块」（帧数 = 变体，会自动连接）或「普通」（翻页图），每张素材还能在「新增素材」里单独设自己的播放速度（不设就跟设置里的全局速度走）、**清晰度**（2K 大图缩到 32px 格子时用面积平均 / 最近邻 / 平均+锐化，细节差很多）、**循环方式**（正放 / 倒放 / 来回）；另有**整图**（一张画一次占 N×M 格：雕像 / 壁画 / 地毯，右键转 90°、绿幕自动抠成透明、导入时逐格点通行区域）；新建项目还能选**一格多大**（16 / 32 / 48 / 64，想让 AI 素材更清楚就用 48 / 64），模型在四周留的白框会被自动裁掉；整格只有 16 种接法、没有动画，界面里会把帧数与视频模型锁住，回来点链接这张图与用法就填在「新增素材」里） | PNG + 存档 JSON（地图四周环绕、自动连接、动画地块、标记点）；勾几项就导几项，多个产物自动打成一个 ZIP 下载 | 
| **⑦ 音乐生成编辑**（谱乐 AI） | 灵感提示词或完整歌词 → 自动开一个**不挂靠项目**的新对话；对话里的 agent 读内置创作指南、扩写提示词、选 Suno / Mureka / MiniMax / ACE-Step 与模式并生成 → 回界面裁剪 / 调音量 / 淡入淡出 / 标准化 → 保存版本与导出。另有**谱曲模式**：先分析想法、给出曲风/调性/段落/配器方案，再用 scoremill 写 MIDI、本地渲染试听、逐版修改，满意后可选交给 Suno 生成正式版 | MP3 / WAV / M4A（多产物可打 zip）；谱曲模式另有 MIDI / 试听 / 方案 / compose.py 的乐谱包。原曲保留，编辑与谱曲结果都是新版本 |
| **⑧ 音效生成**（火山引擎 Seed-Audio） | 一句话描述声源 / 环境 / 强度 / 时长 → 生成音效、环境音、UI 声、生物吼叫或角色配音；可带 1 张参考图或最多 3 条参考音频（两者互斥）；每次生成新增一条 take，旧 take 不覆盖 | WAV / MP3 / Ogg Opus；可单条导出或全部打 zip。单次最长 120 秒；每次生成真实计费 |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:3134-3155](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/index.ts#L3134-L3155)

Host 网关与工具注册。

<details>
<summary>查看原文（22行）</summary>

```text
  const gateway = new GameStudioGateway(ctx);
  gateway.assertSurface();
  ctx.effect(() => ctx.typert.register(MANIFEST), "dsh-8dir-sprites: typert manifest");
  /**
   * 对话调用面：把网关的全部方法 + 多步流程编排注册成模型工具，
   * 并加一段系统提示词说明「怎么推进、怎么把验收链接贴给用户」。
   *
   * `tools` / `systemPrompt` 都是可选服务：最小化的测试组合里可能没有，
   * 缺了就只是没有对话调用面，插件本体照常工作。
   */
  ctx.effect(() => {
    const disposers = registerStudioTools(
      { tools: ctx.get("tools"), systemPrompt: ctx.get("systemPrompt") },
      gateway
    );
    return () => {
      for (const dispose of disposers) dispose();
    };
  }, "dsh-game-material-master: 对话调用面");
  const webServer = ctx.get("webServer");
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({ kind: "prefix", path: ROUTE_PREFIX, handler: handleAsset }), "dsh-8dir-sprites: asset route");
```

</details>

**依据 3 · 源码核查**：[src/imagegen.ts:288-340](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/imagegen.ts#L288-L340)

任务生成、文件和抠像。

<details>
<summary>查看原文（53行）</summary>

```text
export async function generateImageItem(jobId: string, index: number): Promise<void> {
  const job = await readImageJob(jobId);
  if (job === undefined) throw new Error(`任务不存在：${jobId}`);
  const config = await loadConfig();
  const prompt = buildPrompt(job);
  if (prompt === "") throw new Error("提示词为空，请先填写");
  assertImageProviderReady(config);

  // 生图模型同样是全局设置（设置 → 游戏素材大师 → 生图后端），任务只跟随、不覆盖。
  job.settings.model = imageModelOf(config);
  /**
   * 尺寸只在「跟随全局」时取全局值；用户显式把任务改成「自定义」后，
   * 任务自己的 size 才是权威 —— 否则又会回到「改任务尺寸不生效」的老 bug。
   */
  if (job.settings.sizeMode !== "custom") {
    job.settings.sizeMode = "global";
    job.settings.size = imageSizeOf(config);
  }

  const item: ImageItem = job.items[index] ?? { index, status: "empty", source: "generated" };
  job.items[index] = { ...item, status: "running", error: undefined };
  appendJobLog(job.log, "info", `开始生成第 ${index + 1} 张（尺寸 ${job.settings.size}）`);
  await writeImageJob(job);

  try {
    const refs = await Promise.all(job.refs.map((ref) => toDataUri(imageAssetPath(jobId, ref.file), mimeOf(ref.file))));
    const result = await generateImageWithProvider({
      prompt,
      images: refs,
      size: job.settings.size || imageSizeOf(config),
      // 水印是火山方舟特有的参数（自定义后端忽略它）。任务上那份是旧版本留下的
      // 覆盖位，仍然尊重；与全局设置取或，两种写法都不会让水印「突然消失」。
      watermark: imageWatermarkOf(config) || job.settings.watermark === true
    });

    const relative = `out/img-${String(index).padStart(2, "0")}.${result.ext}`;
    await writeFile(imageAssetPath(jobId, relative), result.bytes);

    const fresh = await readImageJob(jobId);
    if (fresh === undefined) return;
    const next = fresh.items[index] ?? { index, status: "empty" as ItemStatus, source: "generated" as const };
    next.status = "ready";
    next.file = relative;
    next.source = "generated";
    next.error = undefined;
    next.updatedAt = Date.now();
    next.keyedFile = undefined;
    next.backgroundFraction = undefined;
    fresh.items[index] = next;
    appendJobLog(fresh.log, "info", `第 ${index + 1} 张生成完成（${(result.bytes.length / 1024).toFixed(0)} KB）`);

    if (fresh.keying.enabled) await keyItem(fresh, index);
    await writeImageJob(fresh);
```

</details>

**依据 4 · 源码核查**：[src/mapgen.ts:730-762](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/mapgen.ts#L730-L762)

地图修改及结果。

<details>
<summary>查看原文（33行）</summary>

```text
export async function applyMapOps(
  projectId: string,
  ops: readonly unknown[],
  opts: { stroke?: string; have?: readonly string[]; dryRun?: boolean; ifRevision?: string } = {}
): Promise<ApplyOpsOutcome> {
  const project = await readProjectOrThrow(projectId);
  const doc = await theDocOrFresh(projectId);
  const currentRevision = await mapRevision(project, doc);
  if (opts.ifRevision !== undefined && opts.ifRevision !== "" && opts.ifRevision !== currentRevision) {
    throw new Error(`版本不一致：当前 ${currentRevision}，请求 ${opts.ifRevision}；请重新 mapInspect 后再改。`);
  }
  const target = opts.dryRun === true ? cloneDoc(doc) : doc;
  const layout = layoutOf(project.grid, target.cols, target.rows);
  const result = applyOps(target, ops, layout, { stampSpecOf: stampSpecResolver(project) });
  // `touched`（标记改名这类不占格的改动）也要记一步撤销 —— 只看 `changed > 0` 的话，
  // 改名会「生效了但撤不回来」。
  if (opts.dryRun !== true && (result.changed > 0 || result.touched === true)) {
    pushHistory(projectId, { undo: result.undo, redo: ops as MapOp[], stroke: opts.stroke }, doc);
    scheduleDocWrite(projectId, doc);
  }
  const summary = {
    cells: result.changed,
    markers: ops.filter((op) => (op as any)?.kind === "marker").length,
    stamps: result.stamps,
    objects: 0
  };
  const revision = opts.dryRun === true ? currentRevision : await mapRevision(project, doc);
  return {
    ...outcomeOf(projectId, result.changed, result.skipped, layout, result.dirty, opts.have, target, result.stamps),
    revision,
    ...(opts.dryRun === true ? { dryRun: true } : {}),
    summary
  };
```

</details>

#### 缺口

- 未执行素材生成或引擎导入
  **影响**：不能确认符合项目资产规范或节时
  **进一步探讨**：以一个角色素材和小图对照手工工作流

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地处理与外部素材生成的边界在哪里？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

生图任务从全局配置选择模型，尺寸仅当任务未定制时取全局。参考文件被转为 data URI 并传入 provider 适配器，因此使用外部后端时需要按实际请求核查披露范围；本地抠像不等于素材从未发给上游。地图 applyMapOps 先读项目和 revision，传入非空 ifRevision 不匹配时拒绝；dryRun 克隆文档并跳过历史和写入。ifRevision 可省略，检查和写入分开，因此不能把它当作跨并发写入的原子锁。

#### 证据与依据

**依据 1 · 源码核查**：[src/imagegen.ts:288-324](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/imagegen.ts#L288-L324)

全局配置及参考图请求。

<details>
<summary>查看原文（37行）</summary>

```text
export async function generateImageItem(jobId: string, index: number): Promise<void> {
  const job = await readImageJob(jobId);
  if (job === undefined) throw new Error(`任务不存在：${jobId}`);
  const config = await loadConfig();
  const prompt = buildPrompt(job);
  if (prompt === "") throw new Error("提示词为空，请先填写");
  assertImageProviderReady(config);

  // 生图模型同样是全局设置（设置 → 游戏素材大师 → 生图后端），任务只跟随、不覆盖。
  job.settings.model = imageModelOf(config);
  /**
   * 尺寸只在「跟随全局」时取全局值；用户显式把任务改成「自定义」后，
   * 任务自己的 size 才是权威 —— 否则又会回到「改任务尺寸不生效」的老 bug。
   */
  if (job.settings.sizeMode !== "custom") {
    job.settings.sizeMode = "global";
    job.settings.size = imageSizeOf(config);
  }

  const item: ImageItem = job.items[index] ?? { index, status: "empty", source: "generated" };
  job.items[index] = { ...item, status: "running", error: undefined };
  appendJobLog(job.log, "info", `开始生成第 ${index + 1} 张（尺寸 ${job.settings.size}）`);
  await writeImageJob(job);

  try {
    const refs = await Promise.all(job.refs.map((ref) => toDataUri(imageAssetPath(jobId, ref.file), mimeOf(ref.file))));
    const result = await generateImageWithProvider({
      prompt,
      images: refs,
      size: job.settings.size || imageSizeOf(config),
      // 水印是火山方舟特有的参数（自定义后端忽略它）。任务上那份是旧版本留下的
      // 覆盖位，仍然尊重；与全局设置取或，两种写法都不会让水印「突然消失」。
      watermark: imageWatermarkOf(config) || job.settings.watermark === true
    });

    const relative = `out/img-${String(index).padStart(2, "0")}.${result.ext}`;
    await writeFile(imageAssetPath(jobId, relative), result.bytes);
```

</details>

**依据 2 · 源码核查**：[src/imagegen.ts:326-351](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/imagegen.ts#L326-L351)

文件、抠像与失败。

<details>
<summary>查看原文（26行）</summary>

```text
    const fresh = await readImageJob(jobId);
    if (fresh === undefined) return;
    const next = fresh.items[index] ?? { index, status: "empty" as ItemStatus, source: "generated" as const };
    next.status = "ready";
    next.file = relative;
    next.source = "generated";
    next.error = undefined;
    next.updatedAt = Date.now();
    next.keyedFile = undefined;
    next.backgroundFraction = undefined;
    fresh.items[index] = next;
    appendJobLog(fresh.log, "info", `第 ${index + 1} 张生成完成（${(result.bytes.length / 1024).toFixed(0)} KB）`);

    if (fresh.keying.enabled) await keyItem(fresh, index);
    await writeImageJob(fresh);
  } catch (error) {
    const fresh = await readImageJob(jobId);
    if (fresh === undefined) return;
    const target = fresh.items[index] ?? { index, status: "empty" as ItemStatus, source: "generated" as const };
    target.status = "error";
    target.error = messageOf(error);
    target.updatedAt = Date.now();
    fresh.items[index] = target;
    appendJobLog(fresh.log, "error", `第 ${index + 1} 张生成失败：${target.error}`);
    await writeImageJob(fresh);
    throw error;
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1353-1361](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/index.ts#L1353-L1361)

客户端输入传递。

```text
  async applyMapOps(payload: any) {
    const input = asRecord(payload);
    return mapgen.applyMapOps(asString(input.projectId), Array.isArray(input.ops) ? (input.ops as unknown[]) : [], {
      stroke: typeof input.stroke === "string" && input.stroke !== "" ? input.stroke : undefined,
      have: mapHave(input.have),
      dryRun: input.dryRun === true,
      ifRevision: typeof input.ifRevision === "string" ? input.ifRevision : undefined
    });
  }
```

**依据 4 · 源码核查**：[src/mapgen.ts:730-762](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/mapgen.ts#L730-L762)

版本检查、克隆和保存。

<details>
<summary>查看原文（33行）</summary>

```text
export async function applyMapOps(
  projectId: string,
  ops: readonly unknown[],
  opts: { stroke?: string; have?: readonly string[]; dryRun?: boolean; ifRevision?: string } = {}
): Promise<ApplyOpsOutcome> {
  const project = await readProjectOrThrow(projectId);
  const doc = await theDocOrFresh(projectId);
  const currentRevision = await mapRevision(project, doc);
  if (opts.ifRevision !== undefined && opts.ifRevision !== "" && opts.ifRevision !== currentRevision) {
    throw new Error(`版本不一致：当前 ${currentRevision}，请求 ${opts.ifRevision}；请重新 mapInspect 后再改。`);
  }
  const target = opts.dryRun === true ? cloneDoc(doc) : doc;
  const layout = layoutOf(project.grid, target.cols, target.rows);
  const result = applyOps(target, ops, layout, { stampSpecOf: stampSpecResolver(project) });
  // `touched`（标记改名这类不占格的改动）也要记一步撤销 —— 只看 `changed > 0` 的话，
  // 改名会「生效了但撤不回来」。
  if (opts.dryRun !== true && (result.changed > 0 || result.touched === true)) {
    pushHistory(projectId, { undo: result.undo, redo: ops as MapOp[], stroke: opts.stroke }, doc);
    scheduleDocWrite(projectId, doc);
  }
  const summary = {
    cells: result.changed,
    markers: ops.filter((op) => (op as any)?.kind === "marker").length,
    stamps: result.stamps,
    objects: 0
  };
  const revision = opts.dryRun === true ? currentRevision : await mapRevision(project, doc);
  return {
    ...outcomeOf(projectId, result.changed, result.skipped, layout, result.dirty, opts.have, target, result.stamps),
    revision,
    ...(opts.dryRun === true ? { dryRun: true } : {}),
    summary
  };
```

</details>

#### 缺口

- 未测真实 provider 传输或同时编辑
  **影响**：无法保证素材保密、重做幂等或并发正确性
  **进一步探讨**：以合成图和两个编辑器副本检查 provider 请求、旧 revision 及并发写

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用本地地图，再判断是否接入外部生成？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

用隔离 DSH profile 和可弃用素材先验收本地地图的预演、明确 revision 提交和检查图；外部生成另核对凭据、素材授权、计费和人工审查，失败先看任务日志和已有产物而非直接重发。可比较把 ifRevision 设为批量工具写入必填并串行提交版本检查，测两个编辑者更新时的覆盖、误拒绝和额外耗时。若仍丢更新或人工成本抵消收益，则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/mapgen.ts:730-762](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/mapgen.ts#L730-L762)

已有地图预演、版本和落盘入口。

<details>
<summary>查看原文（33行）</summary>

```text
export async function applyMapOps(
  projectId: string,
  ops: readonly unknown[],
  opts: { stroke?: string; have?: readonly string[]; dryRun?: boolean; ifRevision?: string } = {}
): Promise<ApplyOpsOutcome> {
  const project = await readProjectOrThrow(projectId);
  const doc = await theDocOrFresh(projectId);
  const currentRevision = await mapRevision(project, doc);
  if (opts.ifRevision !== undefined && opts.ifRevision !== "" && opts.ifRevision !== currentRevision) {
    throw new Error(`版本不一致：当前 ${currentRevision}，请求 ${opts.ifRevision}；请重新 mapInspect 后再改。`);
  }
  const target = opts.dryRun === true ? cloneDoc(doc) : doc;
  const layout = layoutOf(project.grid, target.cols, target.rows);
  const result = applyOps(target, ops, layout, { stampSpecOf: stampSpecResolver(project) });
  // `touched`（标记改名这类不占格的改动）也要记一步撤销 —— 只看 `changed > 0` 的话，
  // 改名会「生效了但撤不回来」。
  if (opts.dryRun !== true && (result.changed > 0 || result.touched === true)) {
    pushHistory(projectId, { undo: result.undo, redo: ops as MapOp[], stroke: opts.stroke }, doc);
    scheduleDocWrite(projectId, doc);
  }
  const summary = {
    cells: result.changed,
    markers: ops.filter((op) => (op as any)?.kind === "marker").length,
    stamps: result.stamps,
    objects: 0
  };
  const revision = opts.dryRun === true ? currentRevision : await mapRevision(project, doc);
  return {
    ...outcomeOf(projectId, result.changed, result.skipped, layout, result.dirty, opts.have, target, result.stamps),
    revision,
    ...(opts.dryRun === true ? { dryRun: true } : {}),
    summary
  };
```

</details>

**依据 2 · 源码核查**：[src/imagegen.ts:309-351](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/imagegen.ts#L309-L351)

图像状态与失败记录。

<details>
<summary>查看原文（43行）</summary>

```text
  appendJobLog(job.log, "info", `开始生成第 ${index + 1} 张（尺寸 ${job.settings.size}）`);
  await writeImageJob(job);

  try {
    const refs = await Promise.all(job.refs.map((ref) => toDataUri(imageAssetPath(jobId, ref.file), mimeOf(ref.file))));
    const result = await generateImageWithProvider({
      prompt,
      images: refs,
      size: job.settings.size || imageSizeOf(config),
      // 水印是火山方舟特有的参数（自定义后端忽略它）。任务上那份是旧版本留下的
      // 覆盖位，仍然尊重；与全局设置取或，两种写法都不会让水印「突然消失」。
      watermark: imageWatermarkOf(config) || job.settings.watermark === true
    });

    const relative = `out/img-${String(index).padStart(2, "0")}.${result.ext}`;
    await writeFile(imageAssetPath(jobId, relative), result.bytes);

    const fresh = await readImageJob(jobId);
    if (fresh === undefined) return;
    const next = fresh.items[index] ?? { index, status: "empty" as ItemStatus, source: "generated" as const };
    next.status = "ready";
    next.file = relative;
    next.source = "generated";
    next.error = undefined;
    next.updatedAt = Date.now();
    next.keyedFile = undefined;
    next.backgroundFraction = undefined;
    fresh.items[index] = next;
    appendJobLog(fresh.log, "info", `第 ${index + 1} 张生成完成（${(result.bytes.length / 1024).toFixed(0)} KB）`);

    if (fresh.keying.enabled) await keyItem(fresh, index);
    await writeImageJob(fresh);
  } catch (error) {
    const fresh = await readImageJob(jobId);
    if (fresh === undefined) return;
    const target = fresh.items[index] ?? { index, status: "empty" as ItemStatus, source: "generated" as const };
    target.status = "error";
    target.error = messageOf(error);
    target.updatedAt = Date.now();
    fresh.items[index] = target;
    appendJobLog(fresh.log, "error", `第 ${index + 1} 张生成失败：${target.error}`);
    await writeImageJob(fresh);
    throw error;
```

</details>

**依据 3 · 源码核查**：[src/index.ts:3118-3155](https://github.com/universe-st/dsh-game-material-master/blob/97b9f50cf74d3076365501022e370a5e609d8e02/src/index.ts#L3118-L3155)

运行时组件与工具挂载。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx) {
  // 插件被重载时，模块缓存会把上一次的 disposed 标记原样留下来，于是所有生成类调用都
  // 静默变成「任务已在进行中」——每次 apply 都要把三个后台任务表复位。
  activatePipeline();
  seqgen.activateSequence();
  riggen.activateRig();
  musicgen.activateMusic();
  sfxgen.activateSfx();

  // 旧版本的数据目录叫 8dir-sprites，插件改名后搬一次，已有项目无缝接上。
  void migrateLegacyDataRoot()
    .then((moved) => {
      if (moved) process.stderr.write("[game-material-master] 已把旧数据目录 8dir-sprites 迁移到 game-material-master\n");
    })
    .catch(() => undefined);

  const gateway = new GameStudioGateway(ctx);
  gateway.assertSurface();
  ctx.effect(() => ctx.typert.register(MANIFEST), "dsh-8dir-sprites: typert manifest");
  /**
   * 对话调用面：把网关的全部方法 + 多步流程编排注册成模型工具，
   * 并加一段系统提示词说明「怎么推进、怎么把验收链接贴给用户」。
   *
   * `tools` / `systemPrompt` 都是可选服务：最小化的测试组合里可能没有，
   * 缺了就只是没有对话调用面，插件本体照常工作。
   */
  ctx.effect(() => {
    const disposers = registerStudioTools(
      { tools: ctx.get("tools"), systemPrompt: ctx.get("systemPrompt") },
      gateway
    );
    return () => {
      for (const dispose of disposers) dispose();
    };
  }, "dsh-game-material-master: 对话调用面");
  const webServer = ctx.get("webServer");
  if (webServer !== undefined) {
    ctx.effect(() => webServer.register({ kind: "prefix", path: ROUTE_PREFIX, handler: handleAsset }), "dsh-8dir-sprites: asset route");
```

</details>

#### 缺口

- 没有目标 DSH、文件资产或实际生成费用
  **影响**：无法评估真实接入、验收和重跑成本
  **进一步探讨**：以隔离地图测 stale 拒绝和恢复，再用合成测试图核对外部请求

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
