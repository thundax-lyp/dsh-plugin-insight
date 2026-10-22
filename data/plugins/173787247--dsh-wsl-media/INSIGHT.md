# dsh-wsl-media

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[0ead0f6](https://github.com/173787247/dsh-wsl-media/tree/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)
<!-- END META -->

> **实现功能**：把ffprobe、ffmpeg、PDF文本、Whisper、Pandoc、OCR和ExifTool接为DSH本地文件工具，按允许目录读取或生成产物。

> **核心亮点**：将常用媒体/文档CLI封装成结构化参数、路径检查和统一错误/截断结果，减少手写命令。详见[Q02](#research-q02)。

> **风险与缺陷**：不存在输出不核父realpath，ffmpeg-y覆盖且写工具并发安全标记；Whisper写/tmp txt但返回stdout，stderr内存无上限、宿主取消未接child。默认roots较宽。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 什么文件任务适合这个管线？](#detail-section-11)
  - [Q02 · 封装CLI的方式有哪些具体价值？](#detail-section-12)
  - [Q03 · 路径和输出有没有足够围栏，产物契约有哪些疑点？](#detail-section-13)
  - [Q04 · 启动条件和读者使用流程是什么？](#detail-section-14)
  - [Q05 · 资源预算、取消和失败收据有什么边界？](#detail-section-15)
  - [Q06 · 成本效果、推荐与创新怎么评价？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在WSL/类Linux环境用DSH处理本地媒体和文档的人。九工具覆盖CLI状态、媒体信息、抽音轨、缩略图、PDF文本、Whisper转录、Pandoc转换、OCR与Exif，不提供远程素材下载、专业编辑时间线或模型自动理解全部媒体。

合格结果要记录输入、工具版本/参数、输出文件或文本、截断与错误，并对媒体可读、音频内容、转录/OCR准确率人工检查。CLI退出0只说明程序未以错误码退出，不证明生成内容正确。PDF扫描件可能没有文字，OCR/ASR的空结果不能当没有内容。

人工命令行是基线。插件减少拼参数并给固定结构结果，适合非敏感单文件的小规模任务；不能因“本地CLI”认为内容不会进入模型或处理器不会读外部资源。

人工直接用同套ffmpeg/Poppler/Whisper/Pandoc等CLI；插件省接线，准确率/格式支持由后端承担，不能把范围检查当沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| probe/exif | 媒体/元信息JSON | 不证明文件可信/可安全解析 |
| PDF/OCR | 文本读取 | 空内容/截断需核，依后端语言包 |
| 音轨/缩略图 | 固定ffmpeg产物 | 覆盖/新输出父路径/格式需核 |
| ASR | Whisper转录 | txt产物与stdout契约未统一 |
| Pandoc | 白名单格式转换 | -f auto兼容性与输出需核 |
| 运行预算 | timeout/stdout kill | stderr/取消树/半成品未统一治理 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18及DSH tools/systemPrompt | 必需 | ESM工具注册 | 作者宣称宿主版本不是本轮验收 |
| bash及PATH | 状态/which | command -v探测 | 缺bash的error未处理，不能只看Node声明 |
| ffprobe/ffmpeg | 对应媒体动作 | 信息/音轨/帧 | 不自动安装 |
| pdftotext/Pandoc/Tesseract/ExifTool | 对应文档动作 | 提取/转换/元信息 | CLI版本/语言包/格式支持需核 |
| Whisper或whisper-cpp及模型 | ASR | 转录 | 模型下载、CPU/GPU、输出契约需核 |
| 狭窄允许根与独立输出目录 | 使用前提 | 限定文件读写 | 默认home/Windows盘范围过宽 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立无敏感输入/输出、显式roots | 核物理父路径与不覆盖策略 |
| 状态 | 查询CLI并记录版本 | PATH存在不代表格式/模型可用 |
| 小样 | 按任务读probe/PDF或生成单产物 | 核真实正文/文件可打开 |
| 正式 | 预算timeout/大小并避免同名并发 | 输出路径与原件分离 |
| 检查 | 核截断、OCR/ASR与媒体质量 | ok不当内容准确保证 |
| 恢复 | 清临时文件/失败半成品，核进程 | 取消不当自动回滚 |

kit可选，包无npm依赖自动装CLI；本轮不运行作者测试、转换器或宿主。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | CLI/语言包/ASR模型下载与存储 | 安装CLI、核WSL路径和roots | 下载体积/GPU需求与兼容时间未知 |
| 持续使用 | 媒体解码/OCR/ASR CPU/GPU/IO，提取内容进入模型 | 核输出质量与隐私范围 | 文件大小/格式决定耗时，金额未知 |
| 失败恢复 | 半成品/tmp文本/同名覆盖恢复资源 | 排CLI错误/超时与临时输出 | 无自动rollback/取消链，宜独立输出；时间金额未知 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 减拼命令 | 九个固定工具接DSH | 未测操作耗时 |
| 统一提取 | 常用CLI返回文本/JSON/路径 | 算法质量/产物兼容依后端 |
| 限范围 | 已有文件realpath+roots | 新文件父链接/宽默认未解决 |
| 控输出 | PDF等truncated与stdout预算 | stderr内存和取消链未有界 |

> **思考**：不存在输出不核父realpath，ffmpeg-y覆盖且写工具并发安全标记；Whisper写/tmp txt但返回stdout，stderr内存无上限、宿主取消未接child。默认roots较宽。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将常用媒体/文档CLI封装成结构化参数、路径检查和统一错误/截断结果，减少手写命令。详见[Q02](#research-q02)。

将常用媒体/文档CLI封装成结构化参数、路径检查和统一错误/截断结果，减少手写命令。详见[Q02](#research-q02)。

runCmd stdout超maxOut只kill后由close返回code，没有专门输出超限状态；通常包装报CLI失败而不是正常partial。stderr一直Buffer.concat，返回时才slice4000，故显示裁剪不限制内存；大错误流可能在timeout前持续增长。PDF也先收stdout再按maxChars切，展示字符数和执行字节预算是两层。

没有exec.signal传给子进程，宿主调用取消不自然连接到CLI kill；timeout仅杀直接child，不追踪进程树或清半成品。asr工具宿主timeout至少300秒，但opts传timeoutMs120秒，lib用传入值优先，因此默认子进程预算仍120秒，两个timeout并不等价。

which单独spawn bash，只监听close没有error/timeout，bash缺失或异常可能产生未处理error/悬挂。status不try/catch，其他execute将库异常转ok:false，返回结果也没有输出hash/大小校验或统一run ID。作者测试只核defaultRoots和简单路径形状，不能用来覆盖转换/符号链接/取消正确性。

<a id="detail-section-5"></a>

### 1.4 主要限制

不存在输出不核父realpath，ffmpeg-y覆盖且写工具并发安全标记；Whisper写/tmp txt但返回stdout，stderr内存无上限、宿主取消未接child。默认roots较宽。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先显式窄roots和无敏感独立输出，核真实产物/覆盖/取消，避免唯一原件与批量并发。详见[Q06](#research-q06)。

合格结果要记录输入、工具版本/参数、输出文件或文本、截断与错误，并对媒体可读、音频内容、转录/OCR准确率人工检查。CLI退出0只说明程序未以错误码退出，不证明生成内容正确。PDF扫描件可能没有文字，OCR/ASR的空结果不能当没有内容。

人工命令行是基线。插件减少拼参数并给固定结构结果，适合非敏感单文件的小规模任务；不能因“本地CLI”认为内容不会进入模型或处理器不会读外部资源。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。固定argv工具面有便利，输出父链接/覆盖并发、ASR正文来源与错误流预算/取消存在明确边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/media.js、test/media.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取index九工具和lib媒体函数、包/bundle/README及作者路径测试结构，不运行目标CLI/测试/宿主。
- 下一步：可继续从未创建文件父链接、同名并发、0秒帧、Whisper文本产物和大stderr/取消受控序列入手，比较任务收据、产物正确与资源残留。

**分析版本**

- **仓库**：[173787247/dsh-wsl-media](https://github.com/173787247/dsh-wsl-media)
- **版本号**：0.2.1（[固定提交 0ead0f6](https://github.com/173787247/dsh-wsl-media/tree/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索物理父路径/文件身份绑定、临时产物验收后原子不覆盖、显式后端收据及stderr/signal树治理；未实现。详见[Q06](#research-q06)。

可继续从未创建文件父链接、同名并发、0秒帧、Whisper文本产物和大stderr/取消受控序列入手，比较任务收据、产物正确与资源残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 134 | — | — | 573 |
| .js | source | 2 | 485 | 456 | 1 | — |
| .js | test | 1 | 28 | 26 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+created%3A2026-09-22T06%3A32%3A37.988Z..2026-10-22T06%3A32%3A37.988Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A32%3A37.988Z..2026-10-22T06%3A32%3A37.988Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本核媒体/文档CLI接线，区分已有路径与新输出围栏、产物契约与退出0、展示截断与真实资源预算。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么文件任务适合这个管线？

**研究主题**：场景与需求

#### 完整回答

面向在WSL/类Linux环境用DSH处理本地媒体和文档的人。九工具覆盖CLI状态、媒体信息、抽音轨、缩略图、PDF文本、Whisper转录、Pandoc转换、OCR与Exif，不提供远程素材下载、专业编辑时间线或模型自动理解全部媒体。

合格结果要记录输入、工具版本/参数、输出文件或文本、截断与错误，并对媒体可读、音频内容、转录/OCR准确率人工检查。CLI退出0只说明程序未以错误码退出，不证明生成内容正确。PDF扫描件可能没有文字，OCR/ASR的空结果不能当没有内容。

人工命令行是基线。插件减少拼参数并给固定结构结果，适合非敏感单文件的小规模任务；不能因“本地CLI”认为内容不会进入模型或处理器不会读外部资源。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-5](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/README.md#L5-L5)

本地管线作者定位。

```text
本地媒体/文档管线：ffprobe、抽音轨、缩略图、PDF、ASR、pandoc、OCR、exif。
```

**依据 2 · 作者声明**：[README.md:23-35](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/README.md#L23-L35)

九工具列表。

<details>
<summary>查看原文（13行）</summary>

```text

| 工具 | 作用 |
|------|------|
| `media_status` | CLI 探测 |
| `media_probe` | ffprobe |
| `media_extract_audio` | 抽音轨 |
| `media_thumbnail` | 缩略图 |
| `media_pdf_text` | PDF 文本 |
| `media_asr` | whisper ASR |
| `media_pandoc` | 格式转换 |
| `media_ocr` | tesseract OCR |
| `media_exif` | exiftool |

```

</details>

**依据 3 · 源码核查**：[lib/media.js:102-127](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L102-L127)

probe/PDF实际返回与截断。

<details>
<summary>查看原文（26行）</summary>

```text
export async function ffprobeFile(path, { allowRoots, timeoutMs } = {}) {
  const file = assertSafePath(path, allowRoots);
  const bin = (await which("ffprobe")) || "ffprobe";
  const { code, stdout, stderr } = await runCmd(
    bin,
    ["-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", file],
    { timeoutMs },
  );
  if (code !== 0) throw new Error(`ffprobe failed: ${stderr || code}`);
  return { ok: true, path: file, probe: JSON.parse(stdout || "{}") };
}

export async function pdfText(path, { allowRoots, timeoutMs, maxChars = 100_000 } = {}) {
  const file = assertSafePath(path, allowRoots);
  if (!/\.pdf$/i.test(file)) throw new Error("pdf_text: expect .pdf");
  const bin = (await which("pdftotext")) || "pdftotext";
  const { code, stdout, stderr } = await runCmd(bin, ["-layout", "-nopgbrk", file, "-"], { timeoutMs });
  if (code !== 0) throw new Error(`pdftotext failed: ${stderr || code}`);
  const text = String(stdout || "");
  return {
    ok: true,
    path: file,
    chars: text.length,
    truncated: text.length > maxChars,
    text: text.slice(0, maxChars),
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 封装CLI的方式有哪些具体价值？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host注入tools/systemPrompt并注册九工具，配置timeout默认120秒/maxPdfChars10万/allowRoots。lib先assertSafePath，选择PATH上的固定二进制，主要执行用spawn(bin,args)而非拼shell；OCR语言过滤为字母数字+_，Pandoc目标格式白名单，缩略图时间数值化。动态文件路径不是shell命令片段，避免一类拼接注入。

runCmd收stdout/stderr、timer超时SIGKILL，CLI非0由各包装抛出，工具层转ok:false。PDF有chars/truncated，OCR/Pandoc文本有截断标记，probe/exif尝试JSON。输出写动作与只读动作都用同一allowRoots，没有按动作/会话拆权限。

贡献是常用本机程序接DSH、参数/输出/错误格式统一；算法和质量来自ffmpeg/Poppler/Whisper/Pandoc/Tesseract/ExifTool。没有新识别模型或媒体算法，也没有自动安装这些CLI。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:14-32](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/index.js#L14-L32)

配置/提示/服务注入。

<details>
<summary>查看原文（19行）</summary>

```text
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-media] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 120_000);
  const maxPdfChars = positive(config.maxPdfChars, 100_000);
  const allowRoots = Array.isArray(config.allowRoots) ? config.allowRoots.map(String) : [];
  console.log(`[dsh-wsl-media] timeoutMs=${timeoutMs} allowRoots=${allowRoots.length || "defaults"}`);

  ctx.systemPrompt.section({
    name: "tool:media",
    order: 129,
    text: "dsh-wsl-media inspects/converts local media under allowlisted roots. Tools: probe, extract_audio, thumbnail, pdf_text, asr, pandoc, tesseract, exif. Prefer absolute Linux paths. Check media_status for CLIs.",
  });

  const opts = { allowRoots, timeoutMs, maxChars: maxPdfChars };
```

</details>

**依据 2 · 源码核查**：[lib/media.js:53-81](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L53-L81)

spawn argv/timeout和结果。

<details>
<summary>查看原文（29行）</summary>

```text
export function runCmd(bin, args, { timeoutMs = 60_000, maxOut = 2_000_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`timeout ${timeoutMs}ms: ${bin}`));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout = Buffer.concat([stdout, d]);
      if (stdout.length > maxOut) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => {
      stderr = Buffer.concat([stderr, d]);
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({
        code,
        stdout: stdout.toString("utf8"),
        stderr: stderr.toString("utf8").slice(0, 4000),
      });
    });
  });
```

</details>

**依据 3 · 源码核查**：[lib/media.js:114-127](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L114-L127)

PDF结构化截断。

<details>
<summary>查看原文（14行）</summary>

```text
export async function pdfText(path, { allowRoots, timeoutMs, maxChars = 100_000 } = {}) {
  const file = assertSafePath(path, allowRoots);
  if (!/\.pdf$/i.test(file)) throw new Error("pdf_text: expect .pdf");
  const bin = (await which("pdftotext")) || "pdftotext";
  const { code, stdout, stderr } = await runCmd(bin, ["-layout", "-nopgbrk", file, "-"], { timeoutMs });
  if (code !== 0) throw new Error(`pdftotext failed: ${stderr || code}`);
  const text = String(stdout || "");
  return {
    ok: true,
    path: file,
    chars: text.length,
    truncated: text.length > maxChars,
    text: text.slice(0, maxChars),
  };
```

</details>

**依据 4 · 源码核查**：[lib/media.js:179-208](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L179-L208)

格式/语言参数限制和文本结果。

<details>
<summary>查看原文（30行）</summary>

```text
export async function pandocConvert(path, to, outPath, { allowRoots, timeoutMs, maxOut = 200_000 } = {}) {
  const file = assertSafePath(path, allowRoots);
  const fmt = String(to || "").trim().toLowerCase();
  if (!/^(markdown|md|html|docx|plain|gfm)$/.test(fmt)) throw new Error("pandoc: unsupported to format");
  const bin = (await which("pandoc")) || "pandoc";
  if (outPath) {
    const out = assertSafePath(outPath, allowRoots);
    const { code, stderr } = await runCmd(bin, ["-f", "auto", "-t", fmt === "md" ? "markdown" : fmt, "-o", out, file], {
      timeoutMs,
    });
    if (code !== 0) throw new Error(`pandoc failed: ${stderr || code}`);
    return { ok: true, path: file, out, to: fmt };
  }
  const { code, stdout, stderr } = await runCmd(bin, ["-f", "auto", "-t", fmt === "md" ? "markdown" : fmt, file], {
    timeoutMs,
    maxOut,
  });
  if (code !== 0) throw new Error(`pandoc failed: ${stderr || code}`);
  const text = String(stdout || "");
  return { ok: true, path: file, to: fmt, truncated: text.length >= maxOut, text: text.slice(0, maxOut) };
}

export async function tesseractOcr(path, { allowRoots, timeoutMs, lang = "eng", maxOut = 100_000 } = {}) {
  const file = assertSafePath(path, allowRoots);
  const bin = (await which("tesseract")) || "tesseract";
  const langSafe = String(lang || "eng").replace(/[^a-zA-Z0-9+_]/g, "");
  const { code, stdout, stderr } = await runCmd(bin, [file, "stdout", "-l", langSafe], { timeoutMs, maxOut });
  if (code !== 0) throw new Error(`tesseract failed: ${stderr || code}`);
  const text = String(stdout || "");
  return { ok: true, path: file, lang: langSafe, truncated: text.length >= maxOut, text: text.slice(0, maxOut) };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径和输出有没有足够围栏，产物契约有哪些疑点？

**研究主题**：缺陷与关键质疑

#### 完整回答

已有输入或输出存在时realpath核物理目标，比单纯词法路径更保守。但尚不存在的输出只resolve，未向上找现有父目录realpath。允许根内若有符号链接父目录指向外部，新的文件本身不存在时仍可词法通过，实际CLI跟随父链接；check到use间也有竞态。默认根包括整个home、/tmp及存在的/mnt/c、/mnt/d，很宽，allowRoots空数组回默认而非拒绝全部。

ffmpeg用-y覆盖现有产物，所有工具注册isConcurrencySafe:true，包括同outPath的写操作，未见锁/原子临时输出/不覆盖确认。输出只能验证扩展名，extract固定pcm_s16le但接受wav/mp3/m4a/flac/ogg，容器兼容性需逐一核，不能据扩展名保证编码有效。thumbnail timeSec=0会因Number(...)||1变成1，明确指定0秒取帧不生效。

ASR若找whisper，要求--output_format txt --output_dir /tmp，却只返回stdout不读生成txt，可能得到进度/空串而非正文；还会在固定/tmp写以输入stem命名的文本，不受自定义输出根检查。不同输入同名/并发可能冲突。Pandoc显式-f auto，真实安装版本是否接受这种reader名字需核；源码未做格式探测或兼容fallback，本轮不将未经运行的CLI兼容猜测写成确定失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:15-27](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L15-L27)

不存在路径不核父realpath。

<details>
<summary>查看原文（13行）</summary>

```text
export function assertSafePath(filePath, allowRoots = []) {
  const raw = String(filePath || "").trim();
  if (!raw) throw new Error("path required");
  if (raw.includes("\0")) throw new Error("invalid path");
  const abs = resolve(raw);
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => isUnderRoot(real, root));
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 2 · 源码核查**：[lib/media.js:40-50](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L40-L50)

宽默认roots与空配置回默认。

<details>
<summary>查看原文（11行）</summary>

```text
/** Default path allowlist. Exported for tests. Always includes ~/.dsh/im-workspace when present. */
export function defaultRoots() {
  const home = homedir();
  return [
    home,
    resolve(home, ".dsh"),
    resolve(home, ".dsh", "im-workspace"),
    "/tmp",
    "/mnt/c",
    "/mnt/d",
  ].filter((p) => existsSync(p));
```

</details>

**依据 3 · 源码核查**：[lib/media.js:130-147](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L130-L147)

Whisper固定/tmp产物而返回stdout。

<details>
<summary>查看原文（18行）</summary>

```text
export async function asrTranscribe(path, { allowRoots, timeoutMs, language } = {}) {
  const file = assertSafePath(path, allowRoots);
  const st = statSync(file);
  if (st.size > 100 * 1024 * 1024) throw new Error("asr: file > 100MB refused");
  let bin = await which("whisper");
  let args;
  if (bin) {
    args = [file, "--output_format", "txt", "--output_dir", "/tmp"];
    if (language) args.push("--language", language);
  } else {
    bin = (await which("whisper-cpp")) || (await which("whisper.cpp"));
    if (!bin) throw new Error("asr: no whisper / whisper-cpp on PATH");
    args = ["-f", file];
    if (language) args.push("-l", language);
  }
  const { code, stdout, stderr } = await runCmd(bin, args, { timeoutMs: timeoutMs || 300_000, maxOut: 5_000_000 });
  if (code !== 0) throw new Error(`asr failed: ${stderr || code}`);
  return { ok: true, path: file, text: String(stdout || "").trim(), stderr: stderr.slice(0, 500) };
```

</details>

**依据 4 · 源码核查**：[lib/media.js:150-176](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L150-L176)

ffmpeg覆盖/固定codec与零秒变1。

<details>
<summary>查看原文（27行）</summary>

```text
export async function extractAudio(path, outPath, { allowRoots, timeoutMs } = {}) {
  const file = assertSafePath(path, allowRoots);
  const out = assertSafePath(outPath, allowRoots);
  if (!/\.(wav|mp3|m4a|flac|ogg)$/i.test(out)) throw new Error("extract_audio: out must be audio extension");
  const bin = (await which("ffmpeg")) || "ffmpeg";
  const { code, stderr } = await runCmd(
    bin,
    ["-y", "-i", file, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", out],
    { timeoutMs: timeoutMs || 120_000 },
  );
  if (code !== 0) throw new Error(`ffmpeg extract failed: ${stderr || code}`);
  return { ok: true, path: file, out };
}

export async function thumbnail(path, outPath, { allowRoots, timeoutMs, timeSec = 1 } = {}) {
  const file = assertSafePath(path, allowRoots);
  const out = assertSafePath(outPath, allowRoots);
  if (!/\.(jpg|jpeg|png|webp)$/i.test(out)) throw new Error("thumbnail: out must be image extension");
  const bin = (await which("ffmpeg")) || "ffmpeg";
  const ss = Math.max(0, Number(timeSec) || 1);
  const { code, stderr } = await runCmd(
    bin,
    ["-y", "-ss", String(ss), "-i", file, "-frames:v", "1", "-q:v", "2", out],
    { timeoutMs: timeoutMs || 60_000 },
  );
  if (code !== 0) throw new Error(`ffmpeg thumbnail failed: ${stderr || code}`);
  return { ok: true, path: file, out, timeSec: ss };
```

</details>

**依据 5 · 源码核查**：[index.js:129-137](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/index.js#L129-L137)

写工具仍concurrencySafe。

```text
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : `ok out=${v.out}` }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await extractAudio(args.path, args.outPath, opts);
```

**依据 6 · 源码核查**：[lib/media.js:179-198](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L179-L198)

Pandoc -f auto与输出路径。

<details>
<summary>查看原文（20行）</summary>

```text
export async function pandocConvert(path, to, outPath, { allowRoots, timeoutMs, maxOut = 200_000 } = {}) {
  const file = assertSafePath(path, allowRoots);
  const fmt = String(to || "").trim().toLowerCase();
  if (!/^(markdown|md|html|docx|plain|gfm)$/.test(fmt)) throw new Error("pandoc: unsupported to format");
  const bin = (await which("pandoc")) || "pandoc";
  if (outPath) {
    const out = assertSafePath(outPath, allowRoots);
    const { code, stderr } = await runCmd(bin, ["-f", "auto", "-t", fmt === "md" ? "markdown" : fmt, "-o", out, file], {
      timeoutMs,
    });
    if (code !== 0) throw new Error(`pandoc failed: ${stderr || code}`);
    return { ok: true, path: file, out, to: fmt };
  }
  const { code, stdout, stderr } = await runCmd(bin, ["-f", "auto", "-t", fmt === "md" ? "markdown" : fmt, file], {
    timeoutMs,
    maxOut,
  });
  if (code !== 0) throw new Error(`pandoc failed: ${stderr || code}`);
  const text = String(stdout || "");
  return { ok: true, path: file, to: fmt, truncated: text.length >= maxOut, text: text.slice(0, maxOut) };
```

</details>

#### 缺口

- 输出父链接、同名覆盖/并发和CLI容器/reader兼容未受控复现。
  **影响**：静态条件提示范围/产物风险，不称已有越界或所有格式失败。
  **进一步探讨**：可用可丢弃目录核根内父链接新文件、同名并发、0秒帧和各格式退出/可读结果。
- 不同Whisper CLI版本的stdout与txt文件正文没有对照。
  **影响**：不能保证ASR工具返回真正转录文本。
  **进一步探讨**：固定短无敏感音频，逐后端比较stdout、生成文件、返回内容及命名冲突。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动条件和读者使用流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18及DSH tools/systemPrompt | 必需 | ESM工具注册 | 作者宣称宿主版本不是本轮验收 |
| bash及PATH | 状态/which | command -v探测 | 缺bash的error未处理，不能只看Node声明 |
| ffprobe/ffmpeg | 对应媒体动作 | 信息/音轨/帧 | 不自动安装 |
| pdftotext/Pandoc/Tesseract/ExifTool | 对应文档动作 | 提取/转换/元信息 | CLI版本/语言包/格式支持需核 |
| Whisper或whisper-cpp及模型 | ASR | 转录 | 模型下载、CPU/GPU、输出契约需核 |
| 狭窄允许根与独立输出目录 | 使用前提 | 限定文件读写 | 默认home/Windows盘范围过宽 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立无敏感输入/输出、显式roots | 核物理父路径与不覆盖策略 |
| 状态 | 查询CLI并记录版本 | PATH存在不代表格式/模型可用 |
| 小样 | 按任务读probe/PDF或生成单产物 | 核真实正文/文件可打开 |
| 正式 | 预算timeout/大小并避免同名并发 | 输出路径与原件分离 |
| 检查 | 核截断、OCR/ASR与媒体质量 | ok不当内容准确保证 |
| 恢复 | 清临时文件/失败半成品，核进程 | 取消不当自动回滚 |

kit可选，包无npm依赖自动装CLI；本轮不运行作者测试、转换器或宿主。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/package.json#L1-L13)

Node/包与bundle。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-wsl-media",
  "version": "0.2.1",
  "description": "DeepSeek Harness WSL plugin: ffprobe, ffmpeg extract/thumbnail, PDF, whisper, pandoc, tesseract, exiftool.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-media.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "ffmpeg", "pdf", "whisper", "pandoc"],
  "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
```

</details>

**依据 2 · 源码核查**：[lib/media.js:6-12](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L6-L12)

bash探测。

```text
export function which(cmd) {
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${cmd}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (code) => resolvePromise(code === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[lib/media.js:84-99](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L84-L99)

CLI列表。

<details>
<summary>查看原文（16行）</summary>

```text
export async function mediaStatus() {
  const bins = {};
  for (const b of [
    "ffprobe",
    "ffmpeg",
    "pdftotext",
    "whisper",
    "whisper-cpp",
    "whisper.cpp",
    "pandoc",
    "tesseract",
    "exiftool",
  ]) {
    bins[b] = (await which(b)) || null;
  }
  return { ok: true, bins };
```

</details>

**依据 4 · 源码核查**：[lib/media.js:130-145](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L130-L145)

ASR大小/后端/模型运行。

<details>
<summary>查看原文（16行）</summary>

```text
export async function asrTranscribe(path, { allowRoots, timeoutMs, language } = {}) {
  const file = assertSafePath(path, allowRoots);
  const st = statSync(file);
  if (st.size > 100 * 1024 * 1024) throw new Error("asr: file > 100MB refused");
  let bin = await which("whisper");
  let args;
  if (bin) {
    args = [file, "--output_format", "txt", "--output_dir", "/tmp"];
    if (language) args.push("--language", language);
  } else {
    bin = (await which("whisper-cpp")) || (await which("whisper.cpp"));
    if (!bin) throw new Error("asr: no whisper / whisper-cpp on PATH");
    args = ["-f", file];
    if (language) args.push("-l", language);
  }
  const { code, stdout, stderr } = await runCmd(bin, args, { timeoutMs: timeoutMs || 300_000, maxOut: 5_000_000 });
```

</details>

**依据 5 · 作者声明**：[README.md:38-43](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/README.md#L38-L43)

作者配置roots说明。

```text
`allowRoots / timeoutMs / maxPdfChars`

路径必须在 allowRoots（默认含家目录、`~/.dsh`、`~/.dsh/im-workspace`、`/tmp`、`/mnt/c|d`）。

## 兼容性

```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 资源预算、取消和失败收据有什么边界？

**研究主题**：工程质量与复用

#### 完整回答

runCmd stdout超maxOut只kill后由close返回code，没有专门输出超限状态；通常包装报CLI失败而不是正常partial。stderr一直Buffer.concat，返回时才slice4000，故显示裁剪不限制内存；大错误流可能在timeout前持续增长。PDF也先收stdout再按maxChars切，展示字符数和执行字节预算是两层。

没有exec.signal传给子进程，宿主调用取消不自然连接到CLI kill；timeout仅杀直接child，不追踪进程树或清半成品。asr工具宿主timeout至少300秒，但opts传timeoutMs120秒，lib用传入值优先，因此默认子进程预算仍120秒，两个timeout并不等价。

which单独spawn bash，只监听close没有error/timeout，bash缺失或异常可能产生未处理error/悬挂。status不try/catch，其他execute将库异常转ok:false，返回结果也没有输出hash/大小校验或统一run ID。作者测试只核defaultRoots和简单路径形状，不能用来覆盖转换/符号链接/取消正确性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:53-79](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L53-L79)

stdout kill、stderr无限收集、直接child timeout。

<details>
<summary>查看原文（27行）</summary>

```text
export function runCmd(bin, args, { timeoutMs = 60_000, maxOut = 2_000_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`timeout ${timeoutMs}ms: ${bin}`));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout = Buffer.concat([stdout, d]);
      if (stdout.length > maxOut) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => {
      stderr = Buffer.concat([stderr, d]);
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({
        code,
        stdout: stdout.toString("utf8"),
        stderr: stderr.toString("utf8").slice(0, 4000),
      });
```

</details>

**依据 2 · 源码核查**：[lib/media.js:6-12](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L6-L12)

which缺error/timeout。

```text
export function which(cmd) {
  return new Promise((resolvePromise) => {
    const child = spawn("bash", ["-lc", `command -v ${cmd}`], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.on("close", (code) => resolvePromise(code === 0 ? out.trim() : ""));
  });
```

**依据 3 · 源码核查**：[index.js:94-111](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/index.js#L94-L111)

ASR宿主预算和传opts。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.tools.register({
    name: "media_asr",
    description: "Transcribe local audio with whisper CLI if installed (slow; large files refused).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: { type: "string" },
        language: { type: "string" },
      },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : v.text || "" }] },
    timeoutMs: Math.max(timeoutMs, 300_000),
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await asrTranscribe(args.path, { ...opts, language: args.language });
```

</details>

**依据 4 · 源码核查**：[lib/media.js:145-147](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L145-L147)

实际ASR预算优先传入120s。

```text
  const { code, stdout, stderr } = await runCmd(bin, args, { timeoutMs: timeoutMs || 300_000, maxOut: 5_000_000 });
  if (code !== 0) throw new Error(`asr failed: ${stderr || code}`);
  return { ok: true, path: file, text: String(stdout || "").trim(), stderr: stderr.slice(0, 500) };
```

**依据 5 · 源码核查**：[test/media.test.js:8-28](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/test/media.test.js#L8-L28)

作者测试只路径基础。

<details>
<summary>查看原文（21行）</summary>

```text
describe("defaultRoots", () => {
  it("lists home and .dsh paths; includes im-workspace when present", () => {
    const roots = defaultRoots();
    assert.ok(roots.includes(homedir()) || roots.some((r) => r.endsWith(homedir())));
    const im = join(homedir(), ".dsh", "im-workspace");
    if (existsSync(im)) {
      assert.ok(roots.some((r) => r === im || r.endsWith(join(".dsh", "im-workspace"))));
    }
  });
});

describe("assertSafePath", () => {
  it("allows home file path shape", () => {
    const p = join(homedir(), "no-such-but-under-home.txt");
    const out = assertSafePath(p, [homedir()]);
    assert.ok(out.includes(homedir()) || out.startsWith("/"));
  });
  it("rejects outside roots", () => {
    assert.throws(() => assertSafePath("/etc/passwd", [homedir()]), /outside/);
  });
});
```

</details>

#### 缺口

- 取消/超限/大stderr与子进程树的资源释放没有受控记录。
  **影响**：不能保证输出预算完整或取消后无副作用。
  **进一步探讨**：受控假CLI持续stderr、派生进程和写半成品，记录峰值内存/剩余进程/错误分类。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本效果、推荐与创新怎么评价？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | CLI/语言包/ASR模型下载与存储 | 安装CLI、核WSL路径和roots | 下载体积/GPU需求与兼容时间未知 |
| 持续使用 | 媒体解码/OCR/ASR CPU/GPU/IO，提取内容进入模型 | 核输出质量与隐私范围 | 文件大小/格式决定耗时，金额未知 |
| 失败恢复 | 半成品/tmp文本/同名覆盖恢复资源 | 排CLI错误/超时与临时输出 | 无自动rollback/取消链，宜独立输出；时间金额未知 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 减拼命令 | 九个固定工具接DSH | 未测操作耗时 |
| 统一提取 | 常用CLI返回文本/JSON/路径 | 算法质量/产物兼容依后端 |
| 限范围 | 已有文件realpath+roots | 新文件父链接/宽默认未解决 |
| 控输出 | PDF等truncated与stdout预算 | stderr内存和取消链未有界 |

先观察。适合用无敏感小样评估，但默认广根、未创建输出父链接、覆盖并发、ASR产物/stdout分离和资源预算问题，影响安全写入与结果可靠性；不建议直接处理唯一原件或大批任务。

可继续探讨“可验收的文件任务收据”。输入/现有父目录物理路径与身份绑定，独立临时输出、完成校验后原子不覆盖提交；每个后端显式定义产物/stdout/格式并回读，统一stdout/stderr预算、signal进程树取消和清理。未实现。

最小对照覆盖父链接新文件、同名并发、0秒帧、Whisper txt/ stdout、慢CLI/大stderr/取消，比较错误目标、产物hash/可读、峰值内存、残留和人工步骤。若通用收据过重，可优先只开放只读提取和WAV/PNG窄产物，而非扩大格式宣称。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:15-27](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L15-L27)

物理父路径方案基线。

<details>
<summary>查看原文（13行）</summary>

```text
export function assertSafePath(filePath, allowRoots = []) {
  const raw = String(filePath || "").trim();
  if (!raw) throw new Error("path required");
  if (raw.includes("\0")) throw new Error("invalid path");
  const abs = resolve(raw);
  const real = existsSync(abs) ? realpathSync(abs) : abs;
  const roots = (allowRoots.length ? allowRoots : defaultRoots()).map((r) => {
    const a = resolve(r);
    return existsSync(a) ? realpathSync(a) : a;
  });
  const ok = roots.some((root) => isUnderRoot(real, root));
  if (!ok) throw new Error(`path outside allowRoots: ${real}`);
  return real;
```

</details>

**依据 2 · 源码核查**：[lib/media.js:130-176](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L130-L176)

显式ASR/ffmpeg产物契约基线。

<details>
<summary>查看原文（47行）</summary>

```text
export async function asrTranscribe(path, { allowRoots, timeoutMs, language } = {}) {
  const file = assertSafePath(path, allowRoots);
  const st = statSync(file);
  if (st.size > 100 * 1024 * 1024) throw new Error("asr: file > 100MB refused");
  let bin = await which("whisper");
  let args;
  if (bin) {
    args = [file, "--output_format", "txt", "--output_dir", "/tmp"];
    if (language) args.push("--language", language);
  } else {
    bin = (await which("whisper-cpp")) || (await which("whisper.cpp"));
    if (!bin) throw new Error("asr: no whisper / whisper-cpp on PATH");
    args = ["-f", file];
    if (language) args.push("-l", language);
  }
  const { code, stdout, stderr } = await runCmd(bin, args, { timeoutMs: timeoutMs || 300_000, maxOut: 5_000_000 });
  if (code !== 0) throw new Error(`asr failed: ${stderr || code}`);
  return { ok: true, path: file, text: String(stdout || "").trim(), stderr: stderr.slice(0, 500) };
}

export async function extractAudio(path, outPath, { allowRoots, timeoutMs } = {}) {
  const file = assertSafePath(path, allowRoots);
  const out = assertSafePath(outPath, allowRoots);
  if (!/\.(wav|mp3|m4a|flac|ogg)$/i.test(out)) throw new Error("extract_audio: out must be audio extension");
  const bin = (await which("ffmpeg")) || "ffmpeg";
  const { code, stderr } = await runCmd(
    bin,
    ["-y", "-i", file, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", out],
    { timeoutMs: timeoutMs || 120_000 },
  );
  if (code !== 0) throw new Error(`ffmpeg extract failed: ${stderr || code}`);
  return { ok: true, path: file, out };
}

export async function thumbnail(path, outPath, { allowRoots, timeoutMs, timeSec = 1 } = {}) {
  const file = assertSafePath(path, allowRoots);
  const out = assertSafePath(outPath, allowRoots);
  if (!/\.(jpg|jpeg|png|webp)$/i.test(out)) throw new Error("thumbnail: out must be image extension");
  const bin = (await which("ffmpeg")) || "ffmpeg";
  const ss = Math.max(0, Number(timeSec) || 1);
  const { code, stderr } = await runCmd(
    bin,
    ["-y", "-ss", String(ss), "-i", file, "-frames:v", "1", "-q:v", "2", out],
    { timeoutMs: timeoutMs || 60_000 },
  );
  if (code !== 0) throw new Error(`ffmpeg thumbnail failed: ${stderr || code}`);
  return { ok: true, path: file, out, timeSec: ss };
```

</details>

**依据 3 · 源码核查**：[lib/media.js:53-81](https://github.com/173787247/dsh-wsl-media/blob/0ead0f6535a5f3b8bdbfb18927c66a5e7976b7fe/lib/media.js#L53-L81)

预算/取消/任务收据基线。

<details>
<summary>查看原文（29行）</summary>

```text
export function runCmd(bin, args, { timeoutMs = 60_000, maxOut = 2_000_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`timeout ${timeoutMs}ms: ${bin}`));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout = Buffer.concat([stdout, d]);
      if (stdout.length > maxOut) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => {
      stderr = Buffer.concat([stderr, d]);
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({
        code,
        stdout: stdout.toString("utf8"),
        stderr: stderr.toString("utf8").slice(0, 4000),
      });
    });
  });
```

</details>

#### 缺口

- 与手工同CLI流程的耗时、识别质量、资源和出错率无同文件对照。
  **影响**：不能量化效率/准确率收益。
  **进一步探讨**：固定匿名样本/参数比较文本质量、文件可读、操作数与CPU/IO。
- 原子不覆盖输出和显式后端收据方案未实现。
  **影响**：不计当前范围或质量保证。
  **进一步探讨**：先窄后端假CLI故障对照，再按需增加格式。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
