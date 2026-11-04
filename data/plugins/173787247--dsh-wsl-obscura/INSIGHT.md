# dsh-wsl-obscura

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4cae840](https://github.com/173787247/dsh-wsl-obscura/tree/4cae840ea00a1c1c9653cea31d3475e288ce7fee)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-obscura)
<!-- END META -->

> **功能**：在 WSL 中为 DSH 接入 Obscura 无头页面抓取、版本检查和 MCP 接线提示。

> **亮点**：让 WSL 代理把无头浏览器结果作为 DSH 工具结果读取，不必手动执行或搬运文本。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：包装层仅检查 URL 协议，私网选项可由工具参数启用；实际网络隔离交由外部二进制。[Q03](#research-q03)

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
  - [Q01 · 何时无头接口比静态请求或 GUI 有增量？](#detail-section-11)
  - [Q02 · 从工具调用到页面内容和错误经历哪些步骤？](#detail-section-12)
  - [Q03 · 二进制和网络边界由谁承担？](#detail-section-13)
  - [Q04 · 可如何试读页面，并验证更窄的访问设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：从 WSL 获取需要页面渲染的公开文本或链接，并返回给 DSH 模型工具。

静态网页可直接请求，GUI 用于人工操作；页面执行来自上游引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 无头抓取 | 获取正文、链接或表达式结果 | 依赖可信二进制与网络边界 |
| 状态和提示 | 定位安装或阅读接线 | 不启动 MCP |

**流程与依赖**

| 依赖 | 用途 | 边界 |
|---|---|---|
| WSL 与 DSH | 挂载工具 | Windows EXE 需要互操作 |
| Obscura 二进制 | 页面读取 | 以明确可信路径固定 |

| 阶段 | 操作 | 验收 |
|---|---|---|
| 配置 | 固定路径后检查 status | 版本可读 |
| 抓取 | 读取公开夹具 | 内容、错误与截断可辨 |

**效果与成本**

| 阶段 | 资源 | 人工 |
|---|---|---|
| 使用 | 额外进程及缓冲 | 核对网络、构建与输出 |

| 效果 | 当前支持 | 待测 |
|---|---|---|
| 动态文本交付 | 参数和进程输出 | 站点成功率和时延 |

> **思考**：包装层仅检查 URL 协议，私网选项可由工具参数启用；实际网络隔离交由外部二进制。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：让 WSL 代理把无头浏览器结果作为 DSH 工具结果读取，不必手动执行或搬运文本。[Q01](#research-q01) [Q02](#research-q02)

参数数组与注入 exec 适合隔离核查；输出裁剪发生在进程返回后，网络规则需要上游兑现。

<a id="detail-section-5"></a>

### 1.4 主要限制

包装层仅检查 URL 协议，私网选项可由工具参数启用；实际网络隔离交由外部二进制。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离环境试非敏感公开网页，禁用私网和 eval；用静态请求或受控浏览器退出。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具注册、参数适配和文本结果。实机互操作、下游网络防护和效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、cordis.patch.yml、lib/obscura.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定根包的注册和 CLI 包装。未审阅或执行引擎、网络请求与 MCP。
- 下一步：固定引擎后检查正常文本、非 HTTP、长输出、超时和隔离网重定向。

**分析版本**

- **仓库**：[173787247/dsh-wsl-obscura](https://github.com/173787247/dsh-wsl-obscura)
- **版本号**：0.1.0（[固定提交 4cae840](https://github.com/173787247/dsh-wsl-obscura/tree/4cae840ea00a1c1c9653cea31d3475e288ce7fee)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将私网权限限定给操作者，再对主导航、跳转及子资源做同一验证；用公开夹具通过率与私网访问是否被拒绝检验。尚未验证。[Q04](#research-q04)

固定引擎后检查正常文本、非 HTTP、长输出、超时和隔离网重定向。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 206 | — | — | 1095 |
| .js | source | 3 | 517 | 467 | 19 | — |
| .js | test | 1 | 89 | 82 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-obscura/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-obscura/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-obscura/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WSL 中的 DSH 能否用一项受控操作取得公开动态页面的可用内容？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时无头接口比静态请求或 GUI 有增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 WSL 中反复读取有脚本渲染的公开网页时，研究者可以要求 DSH 调用 Obscura 返回正文、链接或页面表达式结果。合格结果是目标内容在输出里出现，并能区分失败或截断。静态网页用普通 HTTP 已够，打开系统浏览器则方便人工阅读但并不把正文作为模型工具结果交还。该项目贡献是把现有无头引擎接到 DSH 工具参数和输出，页面执行能力来自 Obscura；导航、点按和截图工具应独立接上游 MCP。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:4-12](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/README.md#L4-L12)

作者分开版本检查、页面获取及说明工具。

```text
DeepSeek Harness tools for **[Obscura](https://github.com/h4ckf0r0day/obscura)** — a Rust headless browser — from **WSL**:

| Tool | Purpose |
|------|---------|
| `obscura_status` | Resolve binary + `--version` |
| `obscura_fetch` | `obscura fetch` with dump / eval / stealth |
| `obscura_mcp_hint` | How to wire MCP / CDP (does not start a server) |

**Not** the same as [`dsh-wsl-browser`](https://github.com/173787247/dsh-wsl-browser) (`win_open_url` opens the Windows **default GUI** browser).
```

**依据 2 · 作者声明**：[README.md:31-35](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/README.md#L31-L35)

作者给出无头及完整 MCP 的不同场景。

```text
## Why

Agent work that needs page text, JS eval, or stealth fetch should hit a headless engine. Obscura already builds on Windows (`obscura.exe`). This plugin runs it from WSL via interop (`/mnt/c/.../obscura.exe`).

For richer agent tools (navigate / click / screenshot as MCP tools), prefer **Obscura MCP** (`obscura mcp`) — use `obscura_mcp_hint` for the wiring.
```

**依据 3 · 源码核查**：[index.js:93-114](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L93-L114)

注册的模型工具可提供 dump 与 eval。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register({
    name: "obscura_fetch",
    description:
      "Fetch/render a page with Obscura (optional --dump / --eval / --stealth). Not for opening the GUI browser.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["url"],
      properties: {
        url: { type: "string", description: "http or https URL." },
        dump: {
          type: "string",
          description: "html | text | links | markdown | assets | original",
        },
        eval: {
          type: "string",
          description: "JavaScript expression to evaluate on the page.",
        },
        stealth: {
          type: "boolean",
          description: "Enable Obscura stealth transport/fingerprint (requires stealth-built binary).",
        },
```

</details>

#### 缺口

- 没有同页面静态与动态结果对照。
  **影响**：不能推断目标站点成功率或节省时间。
  **进一步探讨**：用自建公开测试页比较静态请求与两种输出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从工具调用到页面内容和错误经历哪些步骤？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Profile patch 注册包并打开默认 stealth，apply 注入提示和三项工具。状态调用先核查 WSL 和二进制，再运行 --version；可定位找到的路径，但版本输出不能证明 fetch 功能兼容。fetch 验 URL、找二进制、把 dump 枚举与 eval 原样转换为参数数组，经 execFile 启动，无 shell 插值。CLI 进程有超时和 16 MiB 缓冲上限，插件取 stdout 后再做字符裁剪，不能由裁剪限额推断子进程内存上限。MCP 提示只组装文本，既不启动也不配置服务。core 参数器可接 screenshot 字段，但当前 fetch 注册与调用未传递该字段。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/cordis.patch.yml#L1-L9)

默认参数通过 Profile patch 生效。

```text
- insert:
    - id: dsh-wsl-obscura
      name: dsh-wsl-obscura
      config:
        timeoutMs: 60000
        maxOutputChars: 32000
        defaultStealth: true
        # WSL path or Windows path to obscura.exe (optional if OBSCURA_BIN / default candidates hit)
        # binaryPath: /path/to/obscura/target/release/obscura.exe
```

**依据 2 · 源码核查**：[index.js:64-83](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L64-L83)

status 实际运行 --version。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute() {
      if (!wsl) return { ok: false, error: "not running in WSL (plugin targets WSL → Windows Obscura)" };
      const resolved = resolveObscuraBin({ binaryPath, candidates });
      if (!resolved.ok) return resolved;
      const run = await runObscura(resolved.bin, ["--version"], { timeoutMs: 15_000 });
      if (!run.ok) {
        return {
          ok: false,
          bin: resolved.bin,
          winPath: resolved.winPath,
          error: run.error || run.stderr || "version failed",
        };
      }
      return {
        ok: true,
        bin: resolved.bin,
        winPath: resolved.winPath,
        version: (run.stdout || run.stderr || "").trim().split(/\r?\n/)[0] || "",
        note: "CLI ready; for agent tools prefer MCP (obscura_mcp_hint) when available.",
      };
```

</details>

**依据 3 · 源码核查**：[index.js:143-170](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L143-L170)

工具使用 URL、引擎、参数与结果裁剪。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const checked = isSafeHttpUrl(args?.url);
      if (!checked.ok) return checked;

      const resolved = resolveObscuraBin({ binaryPath, candidates });
      if (!resolved.ok) return { ok: false, error: resolved.error, href: checked.href };

      const stealth = args?.stealth == null ? defaultStealth : Boolean(args.stealth);
      const built = buildFetchArgs({
        url: checked.href,
        dump: args?.dump,
        evalExpr: args?.eval,
        stealth,
        timeoutSec: args?.timeoutSec,
        allowPrivateNetwork: Boolean(args?.allowPrivateNetwork),
      });
      if (!built.ok) return { ok: false, error: built.error, href: checked.href };

      const run = await runObscura(resolved.bin, built.args, { timeoutMs });
      const out = truncateOutput(run.stdout, maxOutputChars);
      if (!run.ok) {
        return {
          ok: false,
          href: checked.href,
          bin: resolved.bin,
          stdout: out.text,
          stderr: run.stderr,
```

</details>

**依据 4 · 源码核查**：[lib/obscura.js:101-131](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L101-L131)

参数器限定 dump，截图支路存在于 core。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildFetchArgs({
  url,
  dump,
  evalExpr,
  stealth,
  timeoutSec,
  allowPrivateNetwork,
  screenshot,
} = {}) {
  const args = [];
  if (stealth) args.push("--stealth");
  if (allowPrivateNetwork) args.push("--allow-private-network");
  args.push("fetch", url);

  if (dump != null && dump !== "") {
    const d = String(dump).toLowerCase();
    if (!ALLOWED_DUMPS.has(d)) {
      return { ok: false, error: `invalid dump (allowed: ${[...ALLOWED_DUMPS].join(", ")})` };
    }
    args.push("--dump", d);
  }
  if (evalExpr != null && String(evalExpr).trim()) {
    args.push("--eval", String(evalExpr));
  }
  if (timeoutSec != null && Number(timeoutSec) > 0) {
    args.push("--timeout", String(Math.floor(Number(timeoutSec))));
  }
  if (screenshot != null && String(screenshot).trim()) {
    args.push("--screenshot", String(screenshot));
  }
  return { ok: true, args };
```

</details>

**依据 5 · 源码核查**：[lib/obscura.js:134-166](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L134-L166)

进程缓冲和事后裁剪是两层限制。

<details>
<summary>查看原文（33行）</summary>

```text
export function truncateOutput(text, maxChars = 32_000) {
  const s = String(text ?? "");
  if (s.length <= maxChars) return { text: s, truncated: false };
  return {
    text: `${s.slice(0, maxChars)}\n…[truncated ${s.length - maxChars} chars]`,
    truncated: true,
  };
}

export async function runObscura(bin, args, { timeoutMs = 60_000, exec = execFileAsync } = {}) {
  try {
    const { stdout, stderr } = await exec(bin, args, {
      timeout: timeoutMs,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      windowsHide: true,
    });
    return {
      ok: true,
      stdout: String(stdout ?? ""),
      stderr: String(stderr ?? ""),
    };
  } catch (err) {
    const e = err instanceof Error ? err : new Error(String(err));
    const stdout = String(e.stdout ?? "");
    const stderr = String(e.stderr ?? e.message ?? "");
    return {
      ok: false,
      stdout,
      stderr,
      error: e.message || String(err),
      code: e.code,
    };
```

</details>

**依据 6 · 源码核查**：[index.js:217-230](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L217-L230)

提示构造 payload 并返回，不启动 MCP。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute() {
      if (!wsl) return { ok: false, error: "not running in WSL", hint: formatMcpHint({}) };
      const resolved = resolveObscuraBin({ binaryPath, candidates });
      const payload = {
        ok: resolved.ok,
        bin: resolved.bin || "",
        winPath: resolved.winPath || "",
        note: resolved.ok
          ? ""
          : "Binary missing — still showing generic MCP commands; set binaryPath / OBSCURA_BIN.",
        error: resolved.ok ? undefined : resolved.error,
      };
      payload.hint = formatMcpHint(payload);
      return payload;
```

</details>

#### 缺口

- 未运行匹配二进制。
  **影响**：无法验证 stdout 格式或超时后的子进程清理。
  **进一步探讨**：用固定版本的可信二进制验证缺失、长输出和超时。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 二进制和网络边界由谁承担？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

需要可执行的本地引擎。候选来源是 config、环境或探测位置，代码只以 exists 选择首个路径，没有 PATH 搜索回退；位于 Windows 的候选还需挂载及互操作。建议操作者固定可信路径并用 status 核对，默认 stealth 要匹配支持该特性的构建。HTTP/HTTPS 是包装层的唯一 URL 校验，未检查 DNS、重定向或子资源；allowPrivateNetwork 可由工具调用传入并映射关闭引擎 guard 的标志。默认不传开关只是将判断留给二进制，不能声称包装层隔离内网。eval 与页面内容也会进入进程或模型上下文。安装、维护和失败排查跨两侧，重复启动和输出缓存消耗未测；无界面并不等于低开销。

#### 证据与依据

**依据 1 · 源码核查**：[lib/obscura.js:31-41](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L31-L41)

包装层只限制 URL 协议。

<details>
<summary>查看原文（11行）</summary>

```text
export function isSafeHttpUrl(raw) {
  let u;
  try {
    u = new URL(String(raw ?? "").trim());
  } catch {
    return { ok: false, error: "invalid URL" };
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    return { ok: false, error: "only http/https allowed" };
  }
  return { ok: true, href: u.href };
```

</details>

**依据 2 · 源码核查**：[lib/obscura.js:71-98](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L71-L98)

路径优先级，未执行 PATH 搜索。

<details>
<summary>查看原文（28行）</summary>

```text
export function resolveObscuraBin({
  binaryPath,
  candidates = DEFAULT_CANDIDATES,
  env = process.env,
  exists = existsSync,
} = {}) {
  const list = [
    binaryPath,
    env.OBSCURA_BIN,
    env.OBSCURA_PATH,
    ...(Array.isArray(candidates) ? candidates : []),
  ]
    .map((p) => (p == null ? "" : String(p).trim()))
    .filter(Boolean)
    .map(toWslPath);

  const seen = new Set();
  for (const p of list) {
    if (seen.has(p)) continue;
    seen.add(p);
    if (exists(p)) return { ok: true, bin: p, winPath: toWinPath(p) };
  }
  return {
    ok: false,
    error:
      "obscura binary not found; set config.binaryPath or OBSCURA_BIN to the WSL path of obscura.exe (or a Linux build)",
    tried: [...seen],
  };
```

</details>

**依据 3 · 源码核查**：[index.js:151-162](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L151-L162)

工具可传私网开关及 eval。

<details>
<summary>查看原文（12行）</summary>

```text
      const stealth = args?.stealth == null ? defaultStealth : Boolean(args.stealth);
      const built = buildFetchArgs({
        url: checked.href,
        dump: args?.dump,
        evalExpr: args?.eval,
        stealth,
        timeoutSec: args?.timeoutSec,
        allowPrivateNetwork: Boolean(args?.allowPrivateNetwork),
      });
      if (!built.ok) return { ok: false, error: built.error, href: checked.href };

      const run = await runObscura(resolved.bin, built.args, { timeoutMs });
```

</details>

**依据 4 · 源码核查**：[lib/obscura.js:109-124](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L109-L124)

这些选项交给下游引擎。

<details>
<summary>查看原文（16行）</summary>

```text
} = {}) {
  const args = [];
  if (stealth) args.push("--stealth");
  if (allowPrivateNetwork) args.push("--allow-private-network");
  args.push("fetch", url);

  if (dump != null && dump !== "") {
    const d = String(dump).toLowerCase();
    if (!ALLOWED_DUMPS.has(d)) {
      return { ok: false, error: `invalid dump (allowed: ${[...ALLOWED_DUMPS].join(", ")})` };
    }
    args.push("--dump", d);
  }
  if (evalExpr != null && String(evalExpr).trim()) {
    args.push("--eval", String(evalExpr));
  }
```

</details>

#### 缺口

- 未核对引擎的私网防护实现和实机行为。
  **影响**：无法确认重定向、DNS 或子资源会被拦截。
  **进一步探讨**：在隔离网用受控地址、重定向与子资源核查，外部路由保持封闭。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可如何试读页面，并验证更窄的访问设计？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先在隔离 Profile 用可信的固定二进制跑 status，再仅取非敏感公开测试页文字，不开启私网、stealth 或 eval。若状态正常而 fetch 失败，先核查二进制构建和网络；静态内容用直接请求即可，复杂交互另用单独评估的浏览器连接。若要支持组织默认使用，可试将私网权限改由操作者固定并对导航重定向和子资源统一限制，避免模型参数打开它。对照检查合法公开页与私网回环目标的通过率、绕过及排障耗时；若私网仍可达或合法页面大面积失效，不能接受。此改进尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:143-163](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/index.js#L143-L163)

当前调用区分状态、私网选项与进程请求。

<details>
<summary>查看原文（21行）</summary>

```text
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const checked = isSafeHttpUrl(args?.url);
      if (!checked.ok) return checked;

      const resolved = resolveObscuraBin({ binaryPath, candidates });
      if (!resolved.ok) return { ok: false, error: resolved.error, href: checked.href };

      const stealth = args?.stealth == null ? defaultStealth : Boolean(args.stealth);
      const built = buildFetchArgs({
        url: checked.href,
        dump: args?.dump,
        evalExpr: args?.eval,
        stealth,
        timeoutSec: args?.timeoutSec,
        allowPrivateNetwork: Boolean(args?.allowPrivateNetwork),
      });
      if (!built.ok) return { ok: false, error: built.error, href: checked.href };

      const run = await runObscura(resolved.bin, built.args, { timeoutMs });
      const out = truncateOutput(run.stdout, maxOutputChars);
```

</details>

**依据 2 · 源码核查**：[lib/obscura.js:134-149](https://github.com/173787247/dsh-wsl-obscura/blob/4cae840ea00a1c1c9653cea31d3475e288ce7fee/lib/obscura.js#L134-L149)

输出截断与退出条件可作为实验观察点。

<details>
<summary>查看原文（16行）</summary>

```text
export function truncateOutput(text, maxChars = 32_000) {
  const s = String(text ?? "");
  if (s.length <= maxChars) return { text: s, truncated: false };
  return {
    text: `${s.slice(0, maxChars)}\n…[truncated ${s.length - maxChars} chars]`,
    truncated: true,
  };
}

export async function runObscura(bin, args, { timeoutMs = 60_000, exec = execFileAsync } = {}) {
  try {
    const { stdout, stderr } = await exec(bin, args, {
      timeout: timeoutMs,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      windowsHide: true,
```

</details>

#### 缺口

- 没有目标场景的允许列表对照。
  **影响**：只能支持公开夹具的小范围试用。
  **进一步探讨**：先验证合法任务，再对网络边界做隔离故障试验。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
