# dsh-wsl-media

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[c7fea75](https://github.com/173787247/dsh-wsl-media/tree/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-media)
<!-- END META -->

> **功能**：为 DSH 提供本地媒体探测、音轨与缩略图提取、PDF、转写、文档转换、OCR 和元数据工具。

> **亮点**：把多种本地转换及探测带入同一代理工作流，产物可回指原路径。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认范围较广，新目标没有解析祖先链接，ffmpeg 允许覆盖；失败也可能留下输出。[Q03](#research-q03)

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
  - [Q01 · 何种媒体处理任务能减少手动操作？](#detail-section-11)
  - [Q02 · 路径如何进入本地命令，结果怎样返回？](#detail-section-12)
  - [Q03 · 路径约束与文件失败在哪些条件下不足？](#detail-section-13)
  - [Q04 · 如何试用并验证改进的交接？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对本地音视频、PDF 和图像执行常见探测或转换。

直接调用 ffmpeg、pdftotext 和其他 CLI 可完成同样的转换，插件负责把步骤接入 DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 媒体工具 | 读写文档和媒体 | 相应 CLI 和窄根目录 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| 本地 CLI | 解析与转换 | 核对版本与语言模型 |
| 窄目录 | 读写媒体 | 隔离原件 |

| 阶段 | 操作 | 检查 |
| --- | --- | --- |
| 探测 | 先检查 PATH 与小样本 | 识别输入 |
| 转换 | 空目标试一项 | 人工校验输出 |

**效果与成本**

| 阶段 | 资源 | 限制 |
| --- | --- | --- |
| 转换 | CPU、模型及临时空间 | 时长和清理未测 |

| 结果 | 支持 | 待测 |
| --- | --- | --- |
| 本地文本或文件 | 实际命令调用 | 质量与失败恢复 |

> **思考**：默认范围较广，新目标没有解析祖先链接，ffmpeg 允许覆盖；失败也可能留下输出。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多种本地转换及探测带入同一代理工作流，产物可回指原路径。[Q01](#research-q01) [Q02](#research-q02)

调用层与命令层分离，退出码可定位故障；路径校验和输出完成存在时序及覆盖边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认范围较广，新目标没有解析祖先链接，ffmpeg 允许覆盖；失败也可能留下输出。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

优先只读小样本，配置独立根目录，空目标写入；条件不明时回本地工具。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认固定入口和命令参数；真实媒体质量、平台兼容和文件边界待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/media.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码检查注册、路径与命令调用，未执行媒体工具或质量验收。
- 下一步：测试新目标父路径、同名、缺 CLI 与进程退出后残留。

**分析版本**

- **仓库**：[173787247/dsh-wsl-media](https://github.com/173787247/dsh-wsl-media)
- **版本号**：0.2.1（[固定提交 c7fea75](https://github.com/173787247/dsh-wsl-media/tree/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

窄路径与无覆盖临时交接可降低原件风险，用相同故障夹具验证。尚未验证。[Q04](#research-q04)

测试新目标父路径、同名、缺 CLI 与进程退出后残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 134 | — | — | 573 |
| .js | source | 2 | 485 | 456 | 1 | — |
| .js | test | 1 | 28 | 26 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-media/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：代理能否把受控目录中的媒体或文档转为可检查的文本和文件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种媒体处理任务能减少手动操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

处理会议录音、视频和扫描资料的 DSH 用户可在同一会话内先探测，再抽一帧、读 PDF 文本或 OCR。合格结果是正确的文件、页或帧，调用者知道它来自哪个输入并可人工抽检。相比自己调用 ffmpeg、pdftotext 和 tesseract，新增 DSH 工具命名、路径检查与统一返回值；转换算法沿用外部程序。要高质量版面还原或自动批量生产时，仅有命令包裹无法保证结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-38](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/README.md#L25-L38)

作者列出本地处理项。

<details>
<summary>查看原文（14行）</summary>

```text
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

## 配置要点

`allowRoots / timeoutMs / maxPdfChars`
```

</details>

**依据 2 · 源码核查**：[index.js:48-66](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/index.js#L48-L66)

媒体探测工具将路径交给核心。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register({
    name: "media_probe",
    description: "ffprobe JSON for a local audio/video/image file.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: { path: { type: "string" } },
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: v.ok === false ? v.error : JSON.stringify(v.probe?.format || v, null, 2) }] },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await ffprobeFile(args.path, opts);
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
```

</details>

**依据 3 · 源码核查**：[lib/media.js:114-127](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L114-L127)

PDF 文本读取返回路径和内容。

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

#### 缺口

- 未与手工 CLI 流程做对照。
  **影响**：无法估计节省的步骤或人工。
  **进一步探讨**：在同一公开样本核对转换产物和排障耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径如何进入本地命令，结果怎样返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Profile 启用工具，并传超时和根目录。status 逐个查询 PATH，不表示实际可运行。核心把路径规范化并检查根目录，对既存路径做 realpath。命令以 spawn 参数数组启动，常规文件路径无需 shell 拼接。ffprobe 解析 JSON，OCR 读文本，截图和抽音轨写目标并报告路径。进程超时 kill；stdout 超出阈值时 kill，stderr 持续累积，到退出后才截断返回。固定接口便于查错误，但命令版本和编解码器的错误仍需单独排查。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/cordis.patch.yml#L1-L8)

Profile 配置与默认。

```text
- insert:
    - id: dsh-wsl-media
      name: dsh-wsl-media
      config:
        enabled: true
        timeoutMs: 120000
        maxPdfChars: 100000
        allowRoots: []
```

**依据 2 · 源码核查**：[lib/media.js:15-37](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L15-L37)

输入与输出路径统一检查。

<details>
<summary>查看原文（23行）</summary>

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
}

function isUnderRoot(real, root) {
  const r = root.replace(/[/\\]+$/, "");
  if (process.platform === "win32") {
    const a = real.toLowerCase();
    const b = r.toLowerCase();
    return a === b || a.startsWith(b + "\\") || a.startsWith(b + "/");
  }
  return real === r || real.startsWith(r + "/");
```

</details>

**依据 3 · 源码核查**：[lib/media.js:53-79](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L53-L79)

超时、流与退出。

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

**依据 4 · 源码核查**：[lib/media.js:84-111](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L84-L111)

status 和探测执行。

<details>
<summary>查看原文（28行）</summary>

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
}

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
```

</details>

**依据 5 · 源码核查**：[lib/media.js:164-176](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L164-L176)

截图实际写入目标。

<details>
<summary>查看原文（13行）</summary>

```text
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

#### 缺口

- 未跑媒体 CLI。
  **影响**：不能确认不同版本输出或正确关闭。
  **进一步探讨**：用固定样本覆盖缺工具、损坏文件和超长 stderr。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径约束与文件失败在哪些条件下不足？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

默认 roots 涵盖整个 HOME、/tmp 和存在的 /mnt/c、/mnt/d，因此默认不是专用素材目录。新输出不存在时使用词法绝对路径，未检查符号链接父目录，可能写到根外；同时 ffmpeg 写入参数含 -y，会覆盖同名路径，失败也未见临时文件交付。ASR 限输入 100 MiB，whisper 分支写 /tmp，却返回 stdout，不能把它当成读取了生成的 .txt；较长录音还有模型与磁盘负担。成本应按通过人工验收的文件计；工具探测、缺语言包、转写模型和失败清理都需操作者承担。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:15-27](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L15-L27)

不存在的输出未 realpath。

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

**依据 2 · 源码核查**：[lib/media.js:40-50](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L40-L50)

默认根范围。

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

**依据 3 · 源码核查**：[lib/media.js:130-147](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L130-L147)

ASR 临时路径、容量和返回。

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

**依据 4 · 源码核查**：[lib/media.js:150-175](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L150-L175)

覆盖参数及直接写路径。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

#### 缺口

- 未执行链接祖先或同名输出测试。
  **影响**：不能确认实际宿主额外约束和部分产物。
  **进一步探讨**：在隔离目录用空目标与链接目标，核对退出码和文件摘要。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用并验证改进的交接？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先只允许一个隔离素材目录，选公开小样本从只读探测开始；写入用空目录且人工核对。若命令缺失、输出路径不明或只读原件无法保证，改用受控的原生工具。可试验输出父目录真实路径检查、禁止覆盖与临时落盘后提交，比较旧流程和改进流程的越界、覆盖、部分输出和成功率。若不能阻止逃逸或正常转换大量失败，就不应采用该方案。尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:19-27](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L19-L27)

当前路径处理可作为对照。

```text
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

**依据 2 · 源码核查**：[lib/media.js:150-176](https://github.com/173787247/dsh-wsl-media/blob/c7fea75d2b637eb0a4fb0a29057cf00cf9481ada/lib/media.js#L150-L176)

当前直接写入及失败点。

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

#### 缺口

- 缺写入隔离对照。
  **影响**：只能试用窄范围。
  **进一步探讨**：故障夹具加目录链接和进程中断。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
