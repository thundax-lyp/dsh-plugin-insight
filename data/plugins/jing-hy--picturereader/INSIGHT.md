# PictureReader

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[00a1db0](https://github.com/jing-hy/picturereader/tree/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jing-hy/picturereader) [![npm 30d 3,124](https://img.shields.io/static/v1?label=npm+30d&message=3%2C124&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picturereader) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picturereader)
<!-- END META -->

> **功能**：为 DSH 提供截图分析、OCR、视觉路由、文档转图和本地图像编辑。

> **亮点**：为文本模型接入图片入口，并将 OCR、视觉桥接及文档转换放在同一会话。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：privacy 对 vision_analyze 的 VLM 有硬门槛，孪生流在转换抛错时仍会传原消息；临时文件和输出路径需验证。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 文本模型如何收到截图，孪生能否保证原图不出站？](#detail-section-11)
  - [Q02 · 隐私、普通与严谨路径分别如何选择视觉服务？](#detail-section-12)
  - [Q03 · 文档转图和编辑如何读写本地文件，失败后会留下什么？](#detail-section-13)
  - [Q04 · 怎样检验图像转换失败时拒绝转发是否值得？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在文本模型的 DSH 会话中核对截图和文档的开发者。

原生多模态，或用独立 OCR/文档工具再将文本复制到会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 视觉孪生 | 用文本模型接收图片 | 转换失败可能保留原消息 |
| 图像及文档工具 | OCR、渲染和编辑 | 本地依赖及文件权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Host fs、llm、attachments | 宿主需要 | 图片与工具接线 | 独立 OCR |
| Python 及文档依赖 | 文档转换需要 | 渲染与处理 | 用外部文档工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择低敏图片和受控路径 | 核对实际模型和模式 |
| 退出 | 核对输出与临时文件 | 停止孪生并退回独立工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python 依赖和存储未知 | 安装和权限检查 | 真实耗时待测 |
| 持续 | OCR/VLM 和渲染开销 | 人工核对正确性 | 出站和费用未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文本模型读图 | 路径与工具引导 | 转换失败和真实准确率 |

> **思考**：privacy 对 vision_analyze 的 VLM 有硬门槛，孪生流在转换抛错时仍会传原消息；临时文件和输出路径需验证。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为文本模型接入图片入口，并将 OCR、视觉桥接及文档转换放在同一会话。[Q01](#research-q01) [Q02](#research-q02)

适配器包装和工具 privacy gate 是两个路径，文件读写跨宿主与本地 runner。

<a id="detail-section-5"></a>

### 1.4 主要限制

privacy 对 vision_analyze 的 VLM 有硬门槛，孪生流在转换抛错时仍会传原消息；临时文件和输出路径需验证。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察无敏感图片，若数据出站无法确认则使用原生手工或本地 OCR。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持路由与工具链，权限、真实图像转发和识别均待验。

- 已检查：作者 README、包清单、源码路径 src/picturereader-vision.mjs、src/vision-analyze.js、src/doc-tools.js、src/image-edit.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定图片入口、视觉工具、文档和编辑接线。未运行目标、安装依赖或真实出网。
- 下一步：模拟附件转换失败、未选模型与文档批量第二项失败，检查请求和残留。

**分析版本**

- **仓库**：[jing-hy/picturereader](https://github.com/jing-hy/picturereader)
- **版本号**：3.6.0（[固定提交 00a1db0](https://github.com/jing-hy/picturereader/tree/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为文本模型在附件转换失败时停住原图转发并明确给出补救，可能减少异常出站。[Q04](#research-q04)

模拟附件转换失败、未选模型与文档批量第二项失败，检查请求和残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 17 | 7369 | 5532 | 1429 | — |
| .md | source | 3 | 920 | — | — | 14373 |
| .mjs | source | 8 | 815 | 548 | 214 | — |
| .js | test | 14 | 2787 | 2344 | 212 | — |
| .mjs | test | 1 | 195 | 157 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jing-hy/picturereader/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/jing-hy/picturereader/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jing-hy/picturereader/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文本模型收到图片时，插件会如何转写为可用证据，隐私模式和本地工具输出有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文本模型如何收到截图，孪生能否保证原图不出站？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

针对需要在文本模型会话里看截图的人，插件为选定模型加 image 能力元数据，供宿主接收原生图块；provider 的 Proxy 包装准备与流调用，将含图的消息换成本地路径和要求调用 image_scan/OCR 的文本。图像字节经 attachments 读取后按内容散列保存，WebP 尝试转换；代码没有给该写入显示独立每会话目录。读取附件错误会返回文本提示，但落盘或其他转换抛出时，流包装会记录错误并继续发送原消息。因而不能将模型标记当作原生视觉能力，也不能仅凭配置 privacy 保证所有异常路径原图不上游。

#### 证据与依据

**依据 1 · 源码核查**：[src/picturereader-vision.mjs:72-107](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/picturereader-vision.mjs#L72-L107)

扩展模型元数据并保存固定散列图片。

<details>
<summary>查看原文（36行）</summary>

```text
/** 给被勾选模型注入视觉元数据（inputModalities / pi-ai 的 input）。 */
function applyVisionMeta(model, provider, getConfig) {
  if (!model || !isSelected(getConfig, provider, model.id)) return model;
  const note = noteOf(getConfig, provider, model.id);
  const suffix = note ? ` (${note})` : ' (视觉)';
  const out = { ...model, name: (model.name || model.id) + suffix, inputModalities: ['text', 'image'] };
  // pi-ai 系列用 `input` 数组；一并注入，保证 resolveModel 也通过。
  if ('input' in model) out.input = [...model.input, 'image'];
  return out;
}

/** 把图片字节落盘为临时文件，返回工具链可读的路径。 */
async function saveImageBytes(bytes, mediaType) {
  await mkdir(IMAGE_DIR, { recursive: true });
  const hash = createHash('sha1').update(bytes).digest('hex').slice(0, 24);
  const ext = mediaType === 'image/jpeg' ? '.jpg'
    : mediaType === 'image/webp' ? '.png'   // 工具链不支持 webp：落盘转 png
      : mediaType === 'image/gif' ? '.gif' : '.png';
  const path = join(IMAGE_DIR, hash + ext);
  // dsh 0.1.2 附件归一化常产出 webp（PNG 带 alpha → webp），而本地工具链
  // （image_scan/OCR）只读 png/jpg/gif/bmp。webp 需转 png 再落盘，否则分析链
  // 断在格式。用 libwebp→WASM（webp-wasm，纯字节码全平台一致）解码成 RGBA，
  // 再经项目已有依赖 pngjs 编码为 PNG——零额外原生依赖、零用户操作。
  if (mediaType === 'image/webp') {
    try {
      await loadWebpDecoder();
      const rgba = await decodeWebp(bytes);
      const png = new PNG({ width: rgba.width, height: rgba.height });
      Buffer.from(rgba.data).copy(png.data);
      await writeFile(path, PNG.sync.write(png), { flag: 'wx' }).catch((e) => { if (e?.code !== 'EEXIST') throw e; });
      return path;
    } catch (e) {
      console.error('[picturereader] webp decode failed, falling back to raw bytes:', e?.message || e);
    }
  }
  try { await writeFile(path, bytes, { flag: 'wx' }); } catch (e) { if (e?.code !== 'EEXIST') throw e; }
```

</details>

**依据 2 · 源码核查**：[src/picturereader-vision.mjs:111-138](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/picturereader-vision.mjs#L111-L138)

正常附件替换为文本与路径。

<details>
<summary>查看原文（28行）</summary>

```text
/** 读图（经 attachments）并做本地说明，返回一段文本证据（path 供工具续读）。 */
async function analyzeImage(block, attachments) {
  let data;
  let mediaType = block?.attachment?.mediaType;
  try {
    ({ data, mediaType } = await readAttachmentImage(attachments, block.attachment));
  } catch (e) {
    return `[图片]（读取失败：${e?.message || e}），请用 image_scan 分析附件`;
  }
  const path = await saveImageBytes(data, mediaType || block?.attachment?.mediaType);
  return `[用户粘贴了一张图片]\n图片已导出到：${path}\n请先用 image_scan 分析该图片（如含文字再用 image_ocr），结合内容回答。`;
}

/** 把消息里的 image block 替换成分析文本。 */
async function sanitizeImages(ctx, messages) {
  const attachments = ctx.get?.('attachments') ?? ctx.attachments;
  const next = [];
  for (const message of messages) {
    const content = message?.content;
    if (!Array.isArray(content) || !content.some((b) => b?.type === 'image')) { next.push(message); continue; }
    const blocks = [];
    for (const block of content) {
      if (block?.type !== 'image') { blocks.push(block); continue; }
      blocks.push({ type: 'text', text: await analyzeImage(block, attachments) });
    }
    next.push({ ...message, content: blocks });
  }
  return next;
```

</details>

**依据 3 · 源码核查**：[src/picturereader-vision.mjs:249-295](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/picturereader-vision.mjs#L249-L295)

包装两种流调用，转换异常后保留原消息。

<details>
<summary>查看原文（47行）</summary>

```text
  const twin = new Proxy(orig, {
    get(target, prop, receiver) {
      if (prop === '__picturereaderTwin') return true;
      if (prop === 'listModels') {
        return async (p) => (await origList(p)).map((m) => applyVisionMeta(m, p, getConfig));
      }
      if (prop === 'resolveModel') {
        return async (p, m, signal) => applyVisionMeta(await origResolve(p, m, signal), p, getConfig);
      }
      if (prop === 'prepareCall' && origPrepare) {
        // dsh-llm 的能力判定与流调度都走 prepareCall 返回的对象：
        //   model.inputModalities -> 图片能力判定（缺则图片被省略）
        //   stream               -> 实际流入口（缺图片拦截则 pi-ai 报
        //                            "does not support image input"）
        // 两个都必须包装：注入视觉元数据 + 拦截图片转本地分析文本。
        return async (p, m, signal) => {
          const result = await origPrepare(p, m, signal);
          if (result && result.model) result.model = applyVisionMeta(result.model, p, getConfig);
          if (result && typeof result.stream === 'function') {
            const preparedStream = result.stream.bind(result);
            // 必须是异步生成器：dsh-llm 对 stream() 的返回值做 for await
            // （要求 [Symbol.asyncIterator]）；async 函数返回 Promise 会崩。
            result.stream = async function* (options) {
              if (options?.messages?.some((msg) => contentHasImage(msg?.content))) {
                // 防御：图片分析失败时原样放行，绝不让流中断污染会话
                try {
                  options = { ...options, messages: await sanitizeImages(ctx, options.messages) };
                } catch (e) {
                  console.error('[picturereader] sanitizeImages failed, forwarding original messages:', e?.message || e);
                }
              }
              yield* preparedStream(options);
            };
          }
          return result;
        };
      }
      if (prop === 'stream') {
        return async function* (options) {
          if (options?.messages?.some((msg) => contentHasImage(msg?.content))) {
            try {
              options = { ...options, messages: await sanitizeImages(ctx, options.messages) };
            } catch (e) {
              console.error('[picturereader] sanitizeImages failed, forwarding original messages:', e?.message || e);
            }
          }
          yield* origStream(options);
```

</details>

#### 缺口

- 未真实测同一 provider 的未选择模型、落盘拒绝和实际出站
  **影响**：无法确定具体宿主如何处理原图和其他模型
  **进一步探讨**：受控模型服务下模拟普通、未选与落盘失败，检查请求体

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 隐私、普通与严谨路径分别如何选择视觉服务？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具读取经 DSH fs 的图片。privacy 会硬关 vision_analyze 的 VLM，即使调用要求 include_vlm；低信息量判断还可提前返回，默认不向 VLM 发空白图。启用 OCR 则交给所选本地引擎，启用且配置 VLM 时才由桥接发送 base64 和提示。不同块来自像素统计、OCR 或模型描述，后者不保证真实。privacy 对这个工具的 VLM 路径是硬限制，自动附件代理原消息回退仍需单独验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/vision-analyze.js:153-190](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/vision-analyze.js#L153-L190)

宿主读取与 privacy gate。

<details>
<summary>查看原文（38行）</summary>

```text
      const target = await ctx.fs.resolve(filePath, {
        ...(cwd !== undefined ? { cwd } : {}),
        signal: exec.signal
      });
      const info = await ctx.fs.stat(target, exec.signal);
      if (!info) {
        throw new Error(`vision_analyze: cannot read "${target.displayPath}": file not found`);
      }
      if (info.type !== 'file') {
        throw new Error(`vision_analyze: cannot read "${target.displayPath}": not a regular file`);
      }
      const data = await ctx.fs.readBytes(target, exec.signal, BYTE_CAP);
      const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      const image = core.decodeImage(buf, ext);
      if (image.width * image.height > MAX_PIXELS) {
        throw new Error(
          `vision_analyze: ${image.width}x${image.height} exceeds the ${MAX_PIXELS}-pixel decode limit — downscale or crop first`
        );
      }

      const rt = getRuntimeConfig();
      const mode = rt?.mode ?? 'smart';
      const defaults = visionAnalyzeDefaults(mode);
      const privacy = isPrivacy(mode);
      const includeScan = args.include_scan === undefined ? defaults.includeScan : boolArg(args.include_scan, true);
      const includeOcr = args.include_ocr === undefined ? defaults.includeOcr : boolArg(args.include_ocr, false);
      // privacy 硬 gate：不管 include_vlm 传什么、外部是否配置，一律不调用 VLM。
      const includeVlm = privacy ? false : (args.include_vlm === undefined ? defaults.includeVlm : boolArg(args.include_vlm, true));
      const allowLowInfo = boolArg(args.allow_low_info, false);
      const stopAfter = boolArg(args.stop_after, false);
      const prompt = args.prompt ?? 'Describe this image in detail.';

      // 当前模式的调用策略，注入到返回文本里给主模型做路由引导。
      const modePolicy = routePolicyText(mode, { vlmConfigured: isVlmConfigured() });

      // Check if VLM is configured (privacy 下恒不可用)
      const vlmAvailable = privacy ? false : isVlmConfigured();
      const shouldCallVlm = includeVlm && vlmAvailable;
```

</details>

**依据 2 · 源码核查**：[src/vision-analyze.js:192-219](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/vision-analyze.js#L192-L219)

低信息量直接回执及像素分析。

<details>
<summary>查看原文（28行）</summary>

```text
      const lowInfo = isLowInformationImage(image.data, image.width, image.height);
      const blocks = [];
      let ocrText = '';
      let scanText = '';
      let vlmText = '';

      if (lowInfo && !allowLowInfo) {
        const message =
          '[vision_analyze] 低信息量拦截：图片空白或内容极少，为避免 VLM 幻觉，未调用 VLM。' +
          '请检查截图是否空白/未渲染/窗口在屏幕外；如确需识别请设置 allow_low_info=true。';
        ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec);
        return { path: target.displayPath, lowInformation: true, message, combined: message };
      }

      if (includeScan) {
        const rtScan = rt?.scan || {};
        const analysis = core.analyzeImage(image.data, image.width, image.height, {
          size: rtScan.defaultSize || 32,
          mode: rtScan.mode || 'auto',
          region: undefined,
          palette: rtScan.palette || 'auto'
        });
        scanText = core.renderImageScan({
          path: target.displayPath,
          width: image.width,
          height: image.height,
          ...analysis
        });
```

</details>

**依据 3 · 源码核查**：[src/vision-analyze.js:223-250](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/vision-analyze.js#L223-L250)

OCR 分支和 VLM 实际请求。

<details>
<summary>查看原文（28行）</summary>

```text
      if (includeOcr) {
        // Engine default follows the plugin setting; explicit args.ocr_engine wins.
        const engine = args.ocr_engine ?? getRuntimeConfig().ocr?.engine ?? 'windows';
        const ocr = await core.ocrImage(buf, ext, { engine });
        ocrText = core.renderOcr({
          path: target.displayPath,
          width: ocr.width,
          height: ocr.height,
          region: 'full',
          engine: ocr.engine,
          lines: ocr.lines
        });
        blocks.push(`[ocr]\n${ocrText}`);
      }

      if (shouldCallVlm) {
        const config = defaultVlmConfig();
        let startedByUs = false;
        try {
          const child = await ensureServer(config);
          startedByUs = child !== null;
          const base64 = buf.toString('base64');
          const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : 'image/bmp';
          const safePrompt =
            prompt +
            '\n\n重要：只描述图中明确可见的内容。如果图中没有明显物体/文字/界面元素，请直接回答：画面空白或内容极少。不要推测、不要脑补不存在的角色/场景/文字。';
          vlmText = await sendVisionRequest(config, [{ mime, base64 }], safePrompt);
          blocks.push(`[vlm]\n${vlmText}`);
```

</details>

**依据 4 · 源码核查**：[src/picturereader-vision.mjs:271-280](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/picturereader-vision.mjs#L271-L280)

异常时直接保留原消息。

<details>
<summary>查看原文（10行）</summary>

```text
            result.stream = async function* (options) {
              if (options?.messages?.some((msg) => contentHasImage(msg?.content))) {
                // 防御：图片分析失败时原样放行，绝不让流中断污染会话
                try {
                  options = { ...options, messages: await sanitizeImages(ctx, options.messages) };
                } catch (e) {
                  console.error('[picturereader] sanitizeImages failed, forwarding original messages:', e?.message || e);
                }
              }
              yield* preparedStream(options);
```

</details>

#### 缺口

- 未核不同 OCR 引擎实效及 bridge 配置的出网范围
  **影响**：无法确定准确率及数据处理条件
  **进一步探讨**：用同一无敏感图片和空白图对照本地、privacy 和授权 VLM

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文档转图和编辑如何读写本地文件，失败后会留下什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本、依赖、兼容与流程

#### 完整回答

文档输入由宿主 fs 解析、检查类型和限额后落为本地临时文件，再以 PyMuPDF 或 LibreOffice 链转换，返回页路径和截断状态。转换后的 PNG 有意保留。源文件清理的 finally 位于物化循环之后，批量第二个文件在物化时抛错可能使第一个临时目录未清。图像编辑的明确输出路径用相对于 cwd 或绝对路径直接解析，由 Python 处理，须核对宿主写入许可与覆盖行为；与输入使用宿主 fs 不同。首次需准备对应 Python 依赖，渲染页数、CPU 和磁盘影响收益。

#### 证据与依据

**依据 1 · 作者声明**：[src/doc-tools.js:130-142](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/doc-tools.js#L130-L142)

作者代码内的工具说明列出转换与依赖。

<details>
<summary>查看原文（13行）</summary>

```text
    description: [
      'Convert a local Office/PDF document (pdf / docx / doc / xlsx / xls / pptx / ppt) into a list of per-page PNG image paths, ' +
        'so the pages can then be inspected with the existing image_scan / image_ocr / image_sample / vision_analyze tools. Purely local (no network).',
      'Parameters: file_path (required, a single document) — or file_paths (array) to convert several documents in one call; ' +
        'out_dir (optional, output directory; defaults to a temp dir under the system temp); ' +
        'dpi (optional 72..300, default 150 — higher = sharper but larger PNGs); ' +
        'max_pages (optional 1..500, default 50 — render only the first N pages of multi-page docs).',
      'Returns, per document: input (original name), page_count (total page count), ' +
        'pages: [{ index, path, width, height, bytes }], out_dir (where the PNGs live), and a summary.',
      'The PNGs remain on disk in out_dir so subsequent image_scan / image_ocr calls can read them by path.',
      'PDFs render directly with PyMuPDF; other Office formats are first converted to PDF via headless LibreOffice. ' +
        'Requires the doc_venv Python (pymupdf) and LibreOffice — if either is missing the tool returns a clear setup hint.'
    ].join(' '),
```

</details>

**依据 2 · 源码核查**：[src/doc-tools.js:242-303](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/doc-tools.js#L242-L303)

物化、转换、部分失败与清理范围。

<details>
<summary>查看原文（62行）</summary>

```text
      const cwd = exec.agent?.session?.header?.cwd;
      const fingerprint = (exec.agent?.session?.id) || 'anon';
      const outDir = resolveOutDir(args.out_dir, fingerprint, cwd);

      // 预解析目标：解析路径、校验扩展名、读字节并落盘到临时目录（python 需真实本地路径）。
      const materialized = []; // { ext, localPath, displayPath }
      for (const rawPath of targets) {
        throwIfAborted(exec.signal);
        const target = await ctx.fs.resolve(rawPath, {
          ...(cwd !== undefined ? { cwd } : {}),
          signal: exec.signal
        });
        const display = target.displayPath;
        const ext = extname(display).toLowerCase();
        if (!SUPPORTED_EXTS.has(ext)) {
          throw new Error(
            `document_to_image: 不支持的文件类型 "${ext}"（支持: pdf / docx / doc / xlsx / xls / pptx / ppt）: ${display}`
          );
        }
        const info = await ctx.fs.stat(target, exec.signal);
        if (!info) throw new Error(`document_to_image: 找不到文件: ${display}`);
        if (info.type !== 'file') throw new Error(`document_to_image: 不是普通文件: ${display}`);
        const bytes = await ctx.fs.readBytes(target, exec.signal, MAX_INPUT_BYTES);
        // 落盘：临时目录 + 保留原扩展名（python 靠扩展名判断链路）。
        const tmpDir = mkdtempSync(join(tmpdir(), 'picturereader-src-'));
        const localPath = join(tmpDir, `${pathBasename(display) || 'doc'}${Date.now()}-${randomBytes(2).toString('hex')}${ext}`);
        writeFileSync(localPath, bytes);
        materialized.push({ ext, localPath, displayPath: display, tmpDir });
      }

      const documents = [];
      // 可注入 seam：测试可传 ctx._docRunner 替换真实 spawn（与 image-batch 的 ctx.ocrImage 注入一致）。
      const runner = (typeof ctx._docRunner === 'function') ? ctx._docRunner : runDocPython;
      try {
        for (let i = 0; i < materialized.length; i += 1) {
          throwIfAborted(exec.signal);
          const { ext, localPath, displayPath } = materialized[i];
          const prefix = `page_${i + 1}`; // 每文档一个独立前缀，批量时同 base 名互不覆盖
          const summary = runner(localPath, outDir, prefix, dpi, maxPages, 120_000, exec.signal);
          if (summary.error) {
            throw new Error(`document_to_image: ${summary.error}`);
          }
          documents.push({
            input: pathBasename(displayPath),
            page_count: summary.page_count ?? 0,
            rendered: (summary.pages || []).length,
            truncated: !!summary.truncated,
            pages: (summary.pages || []).map((p) => ({
              index: p.index,
              path: p.path,
              width: p.width,
              height: p.height,
              bytes: p.bytes
            }))
          });
        }
      } finally {
        // 清理源文件的临时落盘（PNG 输出保留在 out_dir 供后续工具读）。
        for (const m of materialized) {
          try {
            rmSync(m.tmpDir, { recursive: true, force: true });
          } catch { /* best effort */ }
```

</details>

**依据 3 · 源码核查**：[src/image-edit.js:66-88](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/image-edit.js#L66-L88)

输出路径选择和同步 Python runner。

<details>
<summary>查看原文（23行）</summary>

```text
/** Resolve a writable output path: explicit out, or a generated path under out_dir/temp. */
function resolveOutPath(rawOut, rawDir, fingerprint, cwd) {
  const stamp = (fingerprint && fingerprint !== 'anon' ? fingerprint : 'anon');
  const base = rawDir !== undefined && rawDir !== null && String(rawDir).trim().length > 0
    ? (cwd ? pathResolve(cwd, String(rawDir).trim()) : pathResolve(String(rawDir).trim()))
    : join(tmpdir(), 'picturereader-edit', stamp);
  if (rawOut !== undefined && rawOut !== null && String(rawOut).trim().length > 0) {
    const p = String(rawOut).trim();
    return { out: (cwd ? pathResolve(cwd, p) : pathResolve(p)), base };
  }
  return { out: join(base, `edit_${Date.now()}-${randomBytes(4).toString('hex')}.png`), base };
}

/**
 * Run image-edit.py for a materialized request. Returns the parsed JSON result.
 */
function runImageEditPython(reqPath, timeoutMs, signal) {
  throwIfAborted(signal);
  const res = spawnSync(IMAGE_VENV_PY, [SCRIPT_PATH, reqPath], {
    encoding: 'utf8',
    timeout: timeoutMs,
    maxBuffer: 64 * 1024 * 1024,
    ...(signal ? { signal } : {}),
```

</details>

**依据 4 · 源码核查**：[src/image-edit.js:225-249](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/image-edit.js#L225-L249)

编辑输入走宿主 fs，输出另行解析。

<details>
<summary>查看原文（25行）</summary>

```text
      // ---- 材料化所有输入文件 ----
      const rawMain = typeof args.file_path === 'string' ? args.file_path.trim() : '';
      if (!rawMain) {
        throw new Error('image_edit: 需要 file_path（输入图片路径）。');
      }
      const raws = [rawMain];
      if (Array.isArray(args.file_paths)) {
        for (const p of args.file_paths) {
          if (typeof p === 'string' && p.trim().length > 0) raws.push(p.trim());
        }
      }

      const cwd = exec.agent?.session?.header?.cwd;
      const fingerprint = exec.agent?.session?.id || 'anon';
      const { out, base } = resolveOutPath(args.out, args.out_dir, fingerprint, cwd);

      const tmpDir = mkdtempSync(join(tmpdir(), 'picturereader-edit-src-'));
      const materialized = []; // { localPath }
      try {
        for (const raw of raws) {
          throwIfAborted(exec.signal);
          const target = await ctx.fs.resolve(raw, {
            ...(cwd !== undefined ? { cwd } : {}),
            signal: exec.signal
          });
```

</details>

#### 缺口

- 未执行文件系统权限及批量失败
  **影响**：残留范围和默认覆盖行为待验
  **进一步探讨**：用临时目录对照第二输入不存在、限额与同名输出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样检验图像转换失败时拒绝转发是否值得？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用非敏感截图，优先明确模型和工具路径，配合人工核对像素、OCR 或预览。对照手动独立 OCR 和当前孪生方案，记录模型工具往返、渲染耗时、清理与出站。可检验一个改动：孪生图片转换失败时阻断原消息并返回可核恢复提示；如果没有避免误发，或者已有原生视觉用户被无故阻断且没有明确选择，则方案需要缩小到文本模型。出现路由不明、输出位置异常或识别错误时停止，回到本地独立 OCR。

#### 证据与依据

**依据 1 · 源码核查**：[src/picturereader-vision.mjs:268-295](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/picturereader-vision.mjs#L268-L295)

原消息回退是待验证对照。

<details>
<summary>查看原文（28行）</summary>

```text
            const preparedStream = result.stream.bind(result);
            // 必须是异步生成器：dsh-llm 对 stream() 的返回值做 for await
            // （要求 [Symbol.asyncIterator]）；async 函数返回 Promise 会崩。
            result.stream = async function* (options) {
              if (options?.messages?.some((msg) => contentHasImage(msg?.content))) {
                // 防御：图片分析失败时原样放行，绝不让流中断污染会话
                try {
                  options = { ...options, messages: await sanitizeImages(ctx, options.messages) };
                } catch (e) {
                  console.error('[picturereader] sanitizeImages failed, forwarding original messages:', e?.message || e);
                }
              }
              yield* preparedStream(options);
            };
          }
          return result;
        };
      }
      if (prop === 'stream') {
        return async function* (options) {
          if (options?.messages?.some((msg) => contentHasImage(msg?.content))) {
            try {
              options = { ...options, messages: await sanitizeImages(ctx, options.messages) };
            } catch (e) {
              console.error('[picturereader] sanitizeImages failed, forwarding original messages:', e?.message || e);
            }
          }
          yield* origStream(options);
```

</details>

**依据 2 · 源码核查**：[src/doc-tools.js:284-303](https://github.com/jing-hy/picturereader/blob/00a1db0a36ac83b2b73ce0c6dbd50776cfd13b95/src/doc-tools.js#L284-L303)

页输出和临时清理边界。

<details>
<summary>查看原文（20行）</summary>

```text
          documents.push({
            input: pathBasename(displayPath),
            page_count: summary.page_count ?? 0,
            rendered: (summary.pages || []).length,
            truncated: !!summary.truncated,
            pages: (summary.pages || []).map((p) => ({
              index: p.index,
              path: p.path,
              width: p.width,
              height: p.height,
              bytes: p.bytes
            }))
          });
        }
      } finally {
        // 清理源文件的临时落盘（PNG 输出保留在 out_dir 供后续工具读）。
        for (const m of materialized) {
          try {
            rmSync(m.tmpDir, { recursive: true, force: true });
          } catch { /* best effort */ }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
