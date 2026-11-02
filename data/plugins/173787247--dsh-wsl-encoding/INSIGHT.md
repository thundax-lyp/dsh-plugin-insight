# dsh-wsl-encoding

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c445658](https://github.com/173787247/dsh-wsl-encoding/tree/c4456580c4e34400ff984fa632603acd4aabbd4e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-encoding)
<!-- END META -->

> **功能**：汇总WSL与Windows控制台编码并可查文件前段CRLF，只读不转换；样本范围与查询失败需单独核对。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 一工具汇合三端编码线索/换行样本，固定参数和纯core分层减少接线，不新增编码算法。

> **主要限制**：[Q03](#research-q03) 采样先整读、任意大路径无读限，失败false可让ok真；OR能力与前段无CRLF非全链通过，不能仅看主布尔。

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
  - [Q01 · 编码/换行初诊比手工检查增加什么？](#detail-section-11)
  - [Q02 · 两端命令、可选文件和错误怎样形成ok？](#detail-section-12)
  - [Q03 · 不可读、后段CRLF与编码冲突会否误绿灯？](#detail-section-13)
  - [Q04 · 怎样限定小试，并验证有界分层收据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL调Windows中文路径乱码或脚本CRLF故障，以实际命令/编码端与样本观测为准。

手工PS/chcp/LANG和文件换行检查；集中提示非编码转换器/自动修复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| PS/chcp/LANG | 定位跨端乱码线索 | OR能力非各端一致，错误混值 |
| CRLF前段 | 查脚本换行风险 | 先完整读，未采/失败不证干净 |
| 修复提示 | 用户另处理 | 无转换/备份执行，需原件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18/WSL | 必需 | 注册诊断 | 兼容未验/非WSL拒绝 |
| Windows interop/PS/cmd | 查询必需 | 两编码端 | 失败混结果字符串，需分看 |
| 可信小文件副本 | 可选path前提 | CRLF样本 | 不输入大/敏感/慢设备路径 |
| 原文件备份 | 后续修复前提 | 用户sed/dos2unix恢复 | 工具不自动修改 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定故障 | 明确命令与编码端 | 不仅看总ok |
| 小样本 | 可信小副本显式path | 核sampleError/覆盖范围 |
| 修复另办 | 备份后人工改并核字节 | 工具没替你执行 |
| 退出 | 异常停止回针对性原生查 | 保留原件，避免整大文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/WSL/Windows | 核命令端和文件可信性 | 费用/工时未知 |
| 持续 | 两10秒进程/4MiB上限与整文件读/结果token | 冲突/样本错误复核 | 15秒外层非总取消 |
| 失败恢复 | 重查/人工转换资源 | 保原文件核字节与编码 | 无自动写，后续恢复外部备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 控制台线索 | PS/chcp/LANG | 实际故障链一致/解码正确 |
| CRLF样本 | 前8192字节 | 后段/UTF16/二进制/不可读通过 |
| 建议 | 错误及换行提示 | 实际修复与净省时 |

> **思考**：[Q03](#research-q03) 采样先整读、任意大路径无读限，失败false可让ok真；OR能力与前段无CRLF非全链通过，不能仅看主布尔。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 一工具汇合三端编码线索/换行样本，固定参数和纯core分层减少接线，不新增编码算法。

[Q02](#research-q02) 固定exec/core分离可复用；[Q03](#research-q03) 真正有界读取与unknown状态应进入ok语义，采样分析上限非内存上限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 采样先整读、任意大路径无读限，失败false可让ok真；OR能力与前段无CRLF非全链通过，不能仅看主布尔。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可信小脚本只读初筛并逐端核对，未采样/失败不当成功；大敏感文件不读，后续修复先备份，异常回本地原生针对性检查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整重核固定入口/162行encoding/公共host函数和正式findings；未运行Windows命令、读用户文件或目标测试，不写自动转换能力。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/encoding.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定encoding完整/入口/host执行与检测及README/package；不执行转换、不读真实用户文件、不全面检测所有编码。
- 下一步：[Q04](#research-q04) 冲突/不可读/后段跨界/格式/取消矩阵比假ok、读取量/人工，未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-encoding](https://github.com/173787247/dsh-wsl-encoding)
- **版本号**：0.2.0（[固定提交 c445658](https://github.com/173787247/dsh-wsl-encoding/tree/c4456580c4e34400ff984fa632603acd4aabbd4e)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证分端观测/error、fd有界样本覆盖和统一deadline，以冲突/不可读/后段CRLF/取消测假绿灯与总代价。

[Q04](#research-q04) 冲突/不可读/后段跨界/格式/取消矩阵比假ok、读取量/人工，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 88 | — | — | 528 |
| .js | source | 3 | 262 | 232 | 6 | — |
| .js | test | 1 | 57 | 52 | 0 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-encoding/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-encoding/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编码/CRLF初诊的观察范围与错误是否足以避免误认已修复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 编码/换行初诊比手工检查增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用于WSL调用Windows命令中文路径乱码，或/mnt脚本CRLF导致bash shebang/pipefail异常时初诊。工具把PowerShell OutputEncoding、cmd chcp、Host LANG与可选文件换行样本汇一报告；基线是手工查编码和file/dos2unix等。实际不转换编码/BOM、不写文件或改变控制台，修复提示不是已执行。

合格结果是分清实际失败命令经过哪个编码端、样本是否已观测及换行情况，而非报告ok就修好。集成是局部诊断便利，不是检测所有文本编码或全文件/跨端一致性保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:4-10](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/README.md#L4-L10)

作者初诊范围。

```text
Tool **`encoding_doctor`**: UTF-8 / chcp check; optional `path=` CRLF sample (fixes bash `pipefail` breakage on `/mnt/c`).

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Flags UTF-8 versus the Windows code page, and can sample CRLF in scripts the agent is about to run.
```

**依据 2 · 源码核查**：[index.js:11-29](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/index.js#L11-L29)

实际注册和只调用core。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:encoding_doctor",
    order: 122,
    text: "Use encoding_doctor for UTF-8 vs Windows code-page issues, and optionally sample a .sh path for CRLF (breaks set -o pipefail in WSL). Pair with mnt_doctor when scripts live on /mnt/c.",
  });

  ctx.tools.register({
    name: "encoding_doctor",
    description: "Diagnose UTF-8/chcp and optionally sample a file for CRLF line endings that break bash under WSL.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

**依据 3 · 源码核查**：[lib/encoding.js:115-161](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L115-L161)

只读查询/返回，无转换。

<details>
<summary>查看原文（47行）</summary>

```text
export async function execute(args, _config = {}, deps = {}) {
  const runPs = deps.runPowerShell || runPowerShell;
  const runCommand = deps.runCmd || runCmd;
  const readFile = deps.readFile || readFileSync;

  let psOutputEncoding = "";
  let chcp = "";
  try {
    const { stdout } = await runPs("[Console]::OutputEncoding.WebName", { timeoutMs: 10_000 });
    psOutputEncoding = stdout.trim();
  } catch (err) {
    psOutputEncoding = err instanceof Error ? err.message : String(err);
  }
  try {
    const { stdout } = await runCommand(["/c", "chcp"], { timeoutMs: 10_000 });
    chcp = stdout.trim();
  } catch (err) {
    chcp = err instanceof Error ? err.message : String(err);
  }

  const codePage = parseChcp(chcp);
  const utf8Console = isUtf8Console(codePage, psOutputEncoding);
  const lang = process.env.LANG || process.env.LC_ALL || "";
  const samplePath = typeof args?.path === "string" && args.path.trim() ? args.path.trim() : "";
  const sample = sampleLineEndings(samplePath, { readFile });
  const advice = buildEncodingAdvice({
    utf8Console,
    codePage,
    lang,
    sampleCrlf: sample.sampleCrlf,
    samplePath: sample.samplePath,
    sampleError: sample.sampleError,
  });

  return {
    ok: utf8Console && !sample.sampleCrlf,
    psOutputEncoding,
    chcp,
    codePage: codePage == null ? 0 : codePage,
    utf8Console,
    lang,
    samplePath: sample.samplePath || "",
    sampleCrlf: Boolean(sample.sampleCrlf),
    sampleLfOnly: Boolean(sample.sampleLfOnly),
    sampleError: sample.sampleError || "",
    advice,
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 两端命令、可选文件和错误怎样形成ok？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

WSL门控后顺序PowerShell [Console]::OutputEncoding.WebName和cmd /c chcp，各10秒，公共execFile固定argv、UTF8解码、4MiB；失败把error.message放同名结果字符串，缺分离observed/error标志。parseChcp抓首3到5位数字，utf8Console是codePage65001或PS utf8任一满足，不要求两端一致；LANG优先于LC_ALL（与实际locale优先级不能等同）。

可选path原样传readFileSync，先完整读文件再subarray前8192字节，用binary字符串查CRLF/LF，返回sampleError或布尔。ok仅utf8Console && !sampleCrlf，不看sampleError、LANG或两端冲突。pure helper/Host分离和固定脚本有可复用性，但“采样”只限分析长度不限制读取资源。入口15秒不共享两10秒/同步读总预算、无exec.signal，不能宣称及时取消。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:39-79](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L39-L79)

解析/OR判据/整文件读样本。

<details>
<summary>查看原文（41行）</summary>

```text
/** Parse `Active code page: 65001` style chcp output. */
export function parseChcp(text) {
  const m = String(text || "").match(/(\d{3,5})/);
  return m ? Number(m[1]) : null;
}

export function isUtf8Console(codePage, psWebName) {
  if (codePage === 65001) return true;
  const name = String(psWebName || "").toLowerCase();
  return name === "utf-8" || name === "utf8";
}

/**
 * Sample a file for CRLF vs LF. Returns null fields when unreadable.
 */
export function sampleLineEndings(filePath, { readFile = readFileSync, maxBytes = 8192 } = {}) {
  if (!filePath) {
    return { samplePath: "", sampleCrlf: false, sampleLfOnly: false, sampleError: "" };
  }
  try {
    const buf = readFile(filePath);
    const slice = Buffer.isBuffer(buf) ? buf.subarray(0, maxBytes) : Buffer.from(String(buf)).subarray(0, maxBytes);
    const text = slice.toString("binary");
    const hasCrLf = text.includes("\r\n");
    const hasLf = text.includes("\n");
    const crlf = hasCrLf;
    const lfOnly = hasLf && !hasCrLf && !text.includes("\r");
    return {
      samplePath: filePath,
      sampleCrlf: crlf,
      sampleLfOnly: lfOnly,
      sampleError: "",
    };
  } catch (err) {
    return {
      samplePath: filePath,
      sampleCrlf: false,
      sampleLfOnly: false,
      sampleError: err instanceof Error ? err.message : String(err),
    };
  }
```

</details>

**依据 2 · 源码核查**：[lib/encoding.js:120-159](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L120-L159)

失败字符串、LANG优先和ok。

<details>
<summary>查看原文（40行）</summary>

```text
  let psOutputEncoding = "";
  let chcp = "";
  try {
    const { stdout } = await runPs("[Console]::OutputEncoding.WebName", { timeoutMs: 10_000 });
    psOutputEncoding = stdout.trim();
  } catch (err) {
    psOutputEncoding = err instanceof Error ? err.message : String(err);
  }
  try {
    const { stdout } = await runCommand(["/c", "chcp"], { timeoutMs: 10_000 });
    chcp = stdout.trim();
  } catch (err) {
    chcp = err instanceof Error ? err.message : String(err);
  }

  const codePage = parseChcp(chcp);
  const utf8Console = isUtf8Console(codePage, psOutputEncoding);
  const lang = process.env.LANG || process.env.LC_ALL || "";
  const samplePath = typeof args?.path === "string" && args.path.trim() ? args.path.trim() : "";
  const sample = sampleLineEndings(samplePath, { readFile });
  const advice = buildEncodingAdvice({
    utf8Console,
    codePage,
    lang,
    sampleCrlf: sample.sampleCrlf,
    samplePath: sample.samplePath,
    sampleError: sample.sampleError,
  });

  return {
    ok: utf8Console && !sample.sampleCrlf,
    psOutputEncoding,
    chcp,
    codePage: codePage == null ? 0 : codePage,
    utf8Console,
    lang,
    samplePath: sample.samplePath || "",
    sampleCrlf: Boolean(sample.sampleCrlf),
    sampleLfOnly: Boolean(sample.sampleLfOnly),
    sampleError: sample.sampleError || "",
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-53](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/wsl-host.js#L34-L53)

进程固定参数/预算。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runPowerShell(script, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("powershell.exe");
  const { stdout, stderr } = await execFileAsync(
    bin,
    ["-NoProfile", "-NonInteractive", "-Command", script],
    { timeout: timeoutMs, windowsHide: true, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
  );
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}

export async function runCmd(args, { timeoutMs = 15_000 } = {}) {
  const bin = windowsBin("cmd.exe");
  const { stdout, stderr } = await execFileAsync(bin, args, {
    timeout: timeoutMs,
    windowsHide: true,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024,
  });
  return { stdout: String(stdout ?? ""), stderr: String(stderr ?? "") };
}
```

</details>

**依据 4 · 源码核查**：[index.js:7-29](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/index.js#L7-L29)

工具预算不传取消。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:encoding_doctor",
    order: 122,
    text: "Use encoding_doctor for UTF-8 vs Windows code-page issues, and optionally sample a .sh path for CRLF (breaks set -o pipefail in WSL). Pair with mnt_doctor when scripts live on /mnt/c.",
  });

  ctx.tools.register({
    name: "encoding_doctor",
    description: "Diagnose UTF-8/chcp and optionally sample a file for CRLF line endings that break bash under WSL.",
    parameters: core.parameters(config),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return core.notWsl ? core.notWsl() : { ok: false, error: "not running in WSL" };
      return core.execute(args, config);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不可读、后段CRLF与编码冲突会否误绿灯？

**研究主题**：缺陷与关键质疑

#### 完整回答

会。文件不可读catch返回false/false并sampleError，utf8Console为true时顶层ok仍true；advice确实展示错误，是积极反证，但用户/模型只看ok会误认已通过。未给path返回false不是“已证无CRLF”，前8192无CRLF也不覆盖后段；跨采样边界的
可能漏。它按字节搜换行不识别UTF16/二进制/真实文本编码，不能把lfOnly当完整编码判断。

任意可读path无项目根/类型/大小/realpath限制，完整同步readFile可能读大文件或慢设备，样本正文不回模型降低内容披露，但路径/错误与系统编码仍进上下文，内存/阻塞未限。两控制台OR只表有一端UTF8能力，并非实际命令乱码链完整通过；错误字符串含数字还可能被parseChcp当codePage。没有执行真实文件/命令，不夸大真实泄露/卡死。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:54-79](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L54-L79)

sample错误false与前8192机制。

<details>
<summary>查看原文（26行）</summary>

```text
export function sampleLineEndings(filePath, { readFile = readFileSync, maxBytes = 8192 } = {}) {
  if (!filePath) {
    return { samplePath: "", sampleCrlf: false, sampleLfOnly: false, sampleError: "" };
  }
  try {
    const buf = readFile(filePath);
    const slice = Buffer.isBuffer(buf) ? buf.subarray(0, maxBytes) : Buffer.from(String(buf)).subarray(0, maxBytes);
    const text = slice.toString("binary");
    const hasCrLf = text.includes("\r\n");
    const hasLf = text.includes("\n");
    const crlf = hasCrLf;
    const lfOnly = hasLf && !hasCrLf && !text.includes("\r");
    return {
      samplePath: filePath,
      sampleCrlf: crlf,
      sampleLfOnly: lfOnly,
      sampleError: "",
    };
  } catch (err) {
    return {
      samplePath: filePath,
      sampleCrlf: false,
      sampleLfOnly: false,
      sampleError: err instanceof Error ? err.message : String(err),
    };
  }
```

</details>

**依据 2 · 源码核查**：[lib/encoding.js:101-108](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L101-L108)

样本失败advice有披露反证。

```text
  if (sampleError) {
    tips.push(`Could not sample ${samplePath}: ${sampleError}`);
  } else if (samplePath && sampleCrlf) {
    tips.push(
      `${samplePath} contains CRLF. Bash in WSL will mis-parse shebangs / set -o pipefail — run sed -i 's/\\r$//' or dos2unix on scripts under /mnt/c.`,
    );
  } else if (samplePath && !sampleCrlf) {
    tips.push(`${samplePath}: no CRLF detected in the sampled bytes.`);
```

**依据 3 · 源码核查**：[lib/encoding.js:135-159](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L135-L159)

ok忽略错误/冲突。

<details>
<summary>查看原文（25行）</summary>

```text
  const codePage = parseChcp(chcp);
  const utf8Console = isUtf8Console(codePage, psOutputEncoding);
  const lang = process.env.LANG || process.env.LC_ALL || "";
  const samplePath = typeof args?.path === "string" && args.path.trim() ? args.path.trim() : "";
  const sample = sampleLineEndings(samplePath, { readFile });
  const advice = buildEncodingAdvice({
    utf8Console,
    codePage,
    lang,
    sampleCrlf: sample.sampleCrlf,
    samplePath: sample.samplePath,
    sampleError: sample.sampleError,
  });

  return {
    ok: utf8Console && !sample.sampleCrlf,
    psOutputEncoding,
    chcp,
    codePage: codePage == null ? 0 : codePage,
    utf8Console,
    lang,
    samplePath: sample.samplePath || "",
    sampleCrlf: Boolean(sample.sampleCrlf),
    sampleLfOnly: Boolean(sample.sampleLfOnly),
    sampleError: sample.sampleError || "",
```

</details>

**依据 4 · 源码核查**：[lib/encoding.js:39-48](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L39-L48)

数字解析和OR能力。

<details>
<summary>查看原文（10行）</summary>

```text
/** Parse `Active code page: 65001` style chcp output. */
export function parseChcp(text) {
  const m = String(text || "").match(/(\d{3,5})/);
  return m ? Number(m[1]) : null;
}

export function isUtf8Console(codePage, psWebName) {
  if (codePage === 65001) return true;
  const name = String(psWebName || "").toLowerCase();
  return name === "utf-8" || name === "utf8";
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定小试，并验证有界分层收据？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可信个人WSL可只读初筛，小脚本副本才显式加path；先知道实际失败命令/目标编码端，逐字段看PS/chcp/LANG与sampleError，不把未采样、不可读或ok当修复。首次核Windows互操作/Host版本/路径敏感性，持续两进程与整文件读取/结果token/人工复核，时间与峰值未知。工具无自动写回滚；若采纳sed/dos2unix建议，先备份原文件并核字节差异，修复恢复属于后续人工。大/慢/敏感文件不用，异常停止回本地针对性检查。

未验证假设是按端返回observed/error/unknown，fd限量读样本并说明覆盖边界，整链共享deadline/取消；不是再加已有sampleError文本。对照PS与chcp冲突、权限拒绝、后段/跨边界CRLF、UTF16/二进制和取消，测假ok、读取量/峰值和总排障时间。若原报告足够或探针复杂度增加但误判断未减则否定，不自动运行转换或目标测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:54-79](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L54-L79)

有界读取/状态假设源。

<details>
<summary>查看原文（26行）</summary>

```text
export function sampleLineEndings(filePath, { readFile = readFileSync, maxBytes = 8192 } = {}) {
  if (!filePath) {
    return { samplePath: "", sampleCrlf: false, sampleLfOnly: false, sampleError: "" };
  }
  try {
    const buf = readFile(filePath);
    const slice = Buffer.isBuffer(buf) ? buf.subarray(0, maxBytes) : Buffer.from(String(buf)).subarray(0, maxBytes);
    const text = slice.toString("binary");
    const hasCrLf = text.includes("\r\n");
    const hasLf = text.includes("\n");
    const crlf = hasCrLf;
    const lfOnly = hasLf && !hasCrLf && !text.includes("\r");
    return {
      samplePath: filePath,
      sampleCrlf: crlf,
      sampleLfOnly: lfOnly,
      sampleError: "",
    };
  } catch (err) {
    return {
      samplePath: filePath,
      sampleCrlf: false,
      sampleLfOnly: false,
      sampleError: err instanceof Error ? err.message : String(err),
    };
  }
```

</details>

**依据 2 · 源码核查**：[lib/encoding.js:91-111](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/lib/encoding.js#L91-L111)

建议需用户另执行。

<details>
<summary>查看原文（21行）</summary>

```text
  if (!utf8Console) {
    tips.push(
      `Console is not UTF-8 (chcp=${codePage ?? "?"}). Prefer chcp 65001 and [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8 before bridging Chinese paths.`,
    );
  } else {
    tips.push("Console looks UTF-8-capable (chcp 65001 and/or PowerShell utf-8).");
  }
  if (lang && !/utf-?8/i.test(lang)) {
    tips.push(`WSL LANG=${lang} is not UTF-8 — export LANG=C.UTF-8 (or en_US.UTF-8) in the shell that starts dsh.`);
  }
  if (sampleError) {
    tips.push(`Could not sample ${samplePath}: ${sampleError}`);
  } else if (samplePath && sampleCrlf) {
    tips.push(
      `${samplePath} contains CRLF. Bash in WSL will mis-parse shebangs / set -o pipefail — run sed -i 's/\\r$//' or dos2unix on scripts under /mnt/c.`,
    );
  } else if (samplePath && !sampleCrlf) {
    tips.push(`${samplePath}: no CRLF detected in the sampled bytes.`);
  }
  tips.push("Pass Windows paths via wslpath / path_convert rather than embedding CJK in fragile code pages.");
  tips.push("Kit shell scripts should stay LF (see dsh-wsl-kit .gitattributes).");
```

</details>

**依据 3 · 源码核查**：[package.json:1-18](https://github.com/173787247/dsh-wsl-encoding/blob/c4456580c4e34400ff984fa632603acd4aabbd4e/package.json#L1-L18)

固定版本/Node。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-wsl-encoding",
  "version": "0.2.0",
  "description": "encoding_doctor: UTF-8 vs Windows code page, optional CRLF file sample for WSL scripts.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-encoding.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-encoding/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-encoding#readme",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
```

</details>

#### 缺口

- 未真实Windows链/文件格式/大文件与有界版本对照
  **影响**：不能保证根因诊断、及时取消或净省时
  **进一步探讨**：假依赖/非敏感小副本比假绿灯/读取资源和全成本，后续修复先备份核字节。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
