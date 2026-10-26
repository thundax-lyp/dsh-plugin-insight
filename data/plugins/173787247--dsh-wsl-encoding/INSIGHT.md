# dsh-wsl-encoding

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[029c5b6](https://github.com/173787247/dsh-wsl-encoding/tree/029c5b6d2b99b78444084383686a4da8ed87be50)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding)
<!-- END META -->

> **实现功能**：WSL 编码诊断工具，读取 Windows PowerShell/chcp 状态并可选检查脚本开头的 CRLF。

> **核心亮点**：以一工具汇合 Windows/WSL 编码和 CRLF 初诊，给出修复提示。详见[Q01](#research-q01)。

> **风险与缺陷**：所谓 8192 字节采样先完整读文件；任意路径/大文件成本和采样失败仍 ok=true 易误导。详见[Q02](#research-q02)。

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
  - [Q01 · encoding_doctor 真正检查哪些信号？](#detail-section-11)
  - [Q02 · 8192 字节采样是否真的限制读取成本？](#detail-section-12)
  - [Q03 · 三端UTF-8/CRLF判断和运行依赖如何理解？](#detail-section-13)
  - [Q04 · 分期成本与诊断效果怎样比较？](#detail-section-14)
  - [Q05 · 采用条件与分端诊断收据假设是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 调 Windows 命令时汉字路径乱码，或 /mnt/c 脚本因 CRLF 在 bash 中失败。

手工在 WSL 调 powershell.exe/cmd.exe 与 file/od 检查编码和换行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Windows 编码 | chcp/PowerShell | 任一端判 UTF8 |
| CRLF | 前段采样 | 全量读取/后段漏检 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| WSL + Windows 互操作 | 执行 chcp/PS | not running in WSL |
| 可读文件 | CRLF 样本 | sampleError |
| 系统 locale | LANG | 建议可能不足 |

#### 排障

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 无 path | 看 CHCP/PS/LANG | 信号一致 |
| 小脚本 | 检查 CRLF | 文件可读 |
| 修复 | 重跑失败命令 | 故障消失 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有DSH/Node及WSL/Windows互操作环境 | 确认实际失败命令、编码端点与可信小文件，工时未知 | 不需新云服务/独立模型；宿主费用另计 |
| 持续使用 | 两Windows进程各10秒/4MiB局部预算，可选整文件同步读取 | 比对chcp/PowerShell/LANG与真实故障，不只看ok | 总耗时/峰值/诊断准确率未知，外层15秒不是全链取消 |
| 失败恢复 | 重复查询、读取和人工修复资源 | 保留原文件、核失败原因再修编码/换行，工时未知 | 工具不自动改文件；不可读仍可能ok，修改文件的恢复靠外部备份 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| code page | chcp/PowerShell | 跨端一致性 |
| CRLF | 前 8192 字节 | 后段情况 |
| 诊断建议 | 规则文案 | 修复有效性 |

> **思考**：所谓 8192 字节采样先完整读文件；任意路径/大文件成本和采样失败仍 ok=true 易误导。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以一工具汇合 Windows/WSL 编码和 CRLF 初诊，给出修复提示。详见[Q01](#research-q01)。

以一工具汇合 Windows/WSL 编码和 CRLF 初诊，给出修复提示。详见[Q01](#research-q01)。

Cordis 注册 encoding_doctor，WSL gating；execFile 固定命令；可选路径经 Node 读取。

<a id="detail-section-5"></a>

### 1.4 主要限制

所谓 8192 字节采样先完整读文件；任意路径/大文件成本和采样失败仍 ok=true 易误导。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在可信小脚本路径上附加 path；结合具体乱码/CRLF 命令复核三端编码，不把未采样当成功。详见[Q02](#research-q02)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。固定查询与样本诊断成立；OR判定、整文件读取及采样失败仍ok限制可信范围，分端收据假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/encoding.js、lib/wsl-host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、入口、encoding 与 wsl-host；未调用 Windows 命令或读取用户文件。
- 下一步：真实 WSL 下测冲突 code page、非 UTF8 LANG、采样错误、大文件及末尾 CRLF。

**分析版本**

- **仓库**：[173787247/dsh-wsl-encoding](https://github.com/173787247/dsh-wsl-encoding)
- **版本号**：0.2.0（[固定提交 029c5b6](https://github.com/173787247/dsh-wsl-encoding/tree/029c5b6d2b99b78444084383686a4da8ed87be50)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索分端observed/error/unknown、有界fd样本和总deadline收据，以冲突/不可读/后段CRLF/取消反例核查；未实现。详见[Q05](#research-q05)。

真实 WSL 下测冲突 code page、非 UTF8 LANG、采样错误、大文件及末尾 CRLF。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 88 | — | — | 528 |
| .js | source | 3 | 262 | 232 | 6 | — |
| .js | test | 1 | 57 | 52 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding/issues?q=is%3Aissue+created%3A2026-09-22T06%3A50%3A12.014Z..2026-10-22T06%3A50%3A12.014Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-encoding/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A50%3A12.014Z..2026-10-22T06%3A50%3A12.014Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 WSL 字符编码诊断的采样范围、判定语义及任意文件读取/大文件成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · encoding_doctor 真正检查哪些信号？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

插件始终注册工具，execute依据apply时保存的WSL检测结果决定执行诊断或返回not running in WSL：用固定 PowerShell 命令读取 Console.OutputEncoding.WebName，用 cmd /c chcp 查询 Windows code page，读取当前进程 LANG（或 LC_ALL 回退），并可选检查指定文件前 8192 字节内是否有 CRLF。它不会自动改编码或改文件；返回修复建议。检测结果偏诊断信息，不证明某条跨 Windows/WSL 命令的实际字节传输必然正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:4-10](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/README.md#L4-L10)

作者定位 UTF-8/chcp/CRLF 诊断。

```text
Tool **`encoding_doctor`**: UTF-8 / chcp check; optional `path=` CRLF sample (fixes bash `pipefail` breakage on `/mnt/c`).

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Flags UTF-8 versus the Windows code page, and can sample CRLF in scripts the agent is about to run.
```

**依据 2 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/index.js#L7-L30)

WSL 检测与工具注册。

<details>
<summary>查看原文（24行）</summary>

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
    },
```

</details>

**依据 3 · 源码核查**：[lib/encoding.js:115-161](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L115-L161)

固定检查与输出字段。

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

**依据 4 · 源码核查**：[lib/wsl-host.js:34-53](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/wsl-host.js#L34-L53)

无 shell 拼接的固定命令启动。

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

#### 缺口

- 不同系统语言的chcp输出/PowerShell报错文本是否被启发式解析成有效数值，缺少独立真值对照。
  **影响**：不能把跨平台编码字段当实际传输字节一致性保证。
  **进一步探讨**：可用合成多语言输出和错误字符串对照解析语义，实际失败命令的字节另核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 8192 字节采样是否真的限制读取成本？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

sampleLineEndings 先 readFileSync(filePath) 把整个文件读进内存，然后才 subarray(0,maxBytes)。所以“只采样前 8192 字节”描述的是分析范围，不是 IO/内存上限；用户/Agent 传一个很大的文件，会完整读取并有内存开销。路径是任意字符串，没有限制为 .sh 或工作区内，也没有文件类型检查；工具不回传内容，但会回传路径和读取错误。进一步地，sampleError 非空时 sampleCrlf=false，最终 ok 只取 utf8Console && !sampleCrlf，因此采样失败仍可能 ok=true，应将“未采样”与 LF 检查通过区分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:54-79](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L54-L79)

完整 readFile 后截取前 maxBytes。

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

**依据 2 · 源码核查**：[lib/encoding.js:135-161](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L135-L161)

sampleError 被保留但不计入 ok。

<details>
<summary>查看原文（27行）</summary>

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
    advice,
  };
```

</details>

**依据 3 · 源码核查**：[lib/encoding.js:8-18](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L8-L18)

path 未限定目录或扩展名。

<details>
<summary>查看原文（11行）</summary>

```text
export function parameters() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      path: {
        type: "string",
        description: "Optional file to sample for CRLF (e.g. a .sh under /mnt/c).",
      },
    },
  };
```

</details>

#### 缺口

- 全文件读取的实际峰值、不可读文件绿灯对使用决策的影响未知。
  **影响**：实际内存峰值、错误提示对用户的误导程度待测。
  **进一步探讨**：隔离 1GB 稀疏文件/不可读文件，改为 fd 限量读取且失败时 ok=false 或 unknown。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 三端UTF-8/CRLF判断和运行依赖如何理解？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

isUtf8Console 只要 chcp=65001 或 PowerShell 输出编码为 utf-8 就判 true，属于“任一端看似 UTF-8”的启发式；另对 LANG 非 UTF-8 仅给建议，最终 ok 不纳入 LANG。若两端不一致或未指定文件存在混合换行，工具可能仍返回 ok=true。采样只看前 8192 字节，后段 CRLF 不能发现。适用在 WSL 启动脚本、Windows 控制台汉字路径等故障初诊，采用时应结合实际失败命令、完整脚本换行/locale 检查，不把 ok 当全链路保证。

运行依赖WSL/Windows互操作、cmd.exe和PowerShell及Node/DSH工具与systemPrompt。两固定Windows命令通过execFile参数数组，不拼用户命令；各10秒/4MiB是局部预算，外层默认15秒工具timeout并未向core传signal，两串行命令加同步文件读取不构成全链15秒保证。文件读取没有工作区/普通文件检查，可信小文件是明确采用前提。LANG优先LC_ALL回退是本实现读取顺序，不能视为完整shell locale优先级解析。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:39-49](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L39-L49)

Windows 两端 OR 判定。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/encoding.js:59-70](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L59-L70)

只分析前 8192 字节。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/encoding.js:82-113](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L82-L113)

LANG 与 CRLF 仅建议。

<details>
<summary>查看原文（32行）</summary>

```text
export function buildEncodingAdvice({
  utf8Console,
  codePage,
  lang,
  sampleCrlf,
  samplePath,
  sampleError,
} = {}) {
  const tips = [];
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
  return tips;
}
```

</details>

**依据 4 · 源码核查**：[lib/encoding.js:149-161](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L149-L161)

ok 未含 LANG/sampleError。

<details>
<summary>查看原文（13行）</summary>

```text
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

#### 缺口

- 未跨 code page 与混合换行环境做实际故障重放。
  **影响**：误报/漏报边界未量化。
  **进一步探讨**：构造 PowerShell/CHCP 冲突、后段 CRLF 和非 UTF-8 LANG 对照实际执行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分期成本与诊断效果怎样比较？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现有DSH/Node及WSL/Windows互操作环境 | 确认实际失败命令、编码端点与可信小文件，工时未知 | 不需新云服务/独立模型；宿主费用另计 |
| 持续使用 | 两Windows进程各10秒/4MiB局部预算，可选整文件同步读取 | 比对chcp/PowerShell/LANG与真实故障，不只看ok | 总耗时/峰值/诊断准确率未知，外层15秒不是全链取消 |
| 失败恢复 | 重复查询、读取和人工修复资源 | 保留原文件、核失败原因再修编码/换行，工时未知 | 工具不自动改文件；不可读仍可能ok，修改文件的恢复靠外部备份 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| code page | chcp/PowerShell | 跨端一致性 |
| CRLF | 前 8192 字节 | 后段情况 |
| 诊断建议 | 规则文案 | 修复有效性 |

基线是手动分别查chcp/PowerShell、locale并读取脚本字节。单工具汇总减少接线，但并不修故障；每次两进程和大文件全读也有负担。应以定位真实编码端点和恢复脚本所需总人时比较，而不是ok比例。没有同条件错误定位率、净工时或现金数据，均不补零。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:115-161](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L115-L161)

顺序查询和可选文件读取、汇总返回。

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

**依据 2 · 源码核查**：[lib/wsl-host.js:34-55](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/wsl-host.js#L34-L55)

Windows命令局部预算/缓冲。

<details>
<summary>查看原文（22行）</summary>

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

function readOsRelease() {
```

</details>

**依据 3 · 源码核查**：[index.js:7-30](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/index.js#L7-L30)

外层timeout与未传signal。

<details>
<summary>查看原文（24行）</summary>

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
    },
```

</details>

#### 缺口

- 实际诊断正确率、资源峰值及比手工节省的人时无对照。
  **影响**：无法承诺修复收益或总响应时间。
  **进一步探讨**：可从固定合成输出/小文件、冲突状态和采样失败，比较正确定位及失败恢复总成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件与分端诊断收据假设是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。只在可信WSL本地，先无path核各原始字段；可选path限已确认的小普通文件，手工保留并检查全文件换行，不能让ok自动驱动修复或放行。工具只查询给建议，无新增外部服务，范围可控；任意/大文件、跨端链路证明不在试用保证内。

由OR把两个端点压成一个UTF8布尔、采样错误仍绿灯和整读后切片，可推导“分端有界诊断收据”。参照当前汇总，分别标chcp/PowerShell/LANG observed/error/unknown和一致性，先核文件类型/授权，再fd限量读，明确样本范围/文件身份；总deadline及signal串到子进程。代价是更多状态解释、平台适配与剩余文件覆盖仍需人工。未实现，不作为现有贡献。

最小反例包括65001与非UTF8 PowerShell冲突、错误文本含数字、LANG与LC_ALL冲突、文件不可读/特殊文件、前段LF后段CRLF、文件增长和取消。若未知仍变通过或限量读仍读完整文件，正确性/资源假设失败；若字段更严却增加定位错误/人工工时，则不支持业务改进。

#### 证据与依据

**依据 1 · 源码核查**：[lib/encoding.js:39-79](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L39-L79)

OR及整文件读取后采样的推导基线。

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

**依据 2 · 源码核查**：[lib/encoding.js:115-161](https://github.com/173787247/dsh-wsl-encoding/blob/029c5b6d2b99b78444084383686a4da8ed87be50/lib/encoding.js#L115-L161)

分端错误/总结果的推导基线。

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

#### 缺口

- 分端有界收据方案未实现。
  **影响**：不把预期资源/正确性效果计入当前插件。
  **进一步探讨**：可先对合成冲突、失败、范围和取消序列验收，再考虑具体系统故障。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
