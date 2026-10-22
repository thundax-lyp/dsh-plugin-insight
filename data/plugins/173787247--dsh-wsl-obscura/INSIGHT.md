# dsh-wsl-obscura

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[f1dfad4](https://github.com/173787247/dsh-wsl-obscura/tree/f1dfad47dd78722babc61633805caade6557dc68)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-obscura)
<!-- END META -->

> **实现功能**：从 WSL 调用 Obscura 无头浏览器的 status/fetch 工具，并提供 MCP 接线提示。

> **核心亮点**：将无头抓取接到 DSH Agent 工具面并明确 MCP/CDP 升级路径。详见[Q01](#research-q01)。

> **风险与缺陷**：isSafeHttpUrl 仅限协议，不能证明 SSRF 阻断；CLI 与外层超时/缓冲区可能影响结果。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 与 GUI 浏览器或完整 MCP 工具有何区别？](#detail-section-11)
  - [Q02 · 二进制与 fetch 参数如何组装？](#detail-section-12)
  - [Q03 · 私网访问防线是否由插件实现？](#detail-section-13)
  - [Q04 · 默认 stealth、超时和输出有何容易误解处？](#detail-section-14)
  - [Q05 · 怎样试用和评估可迁移价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL 环境下定点抓取或渲染网页正文，复杂交互转原生 MCP。详见[Q01](#research-q01)。

原生 Obscura CLI/MCP 可直接使用；插件主要省 DSH Agent 与 CLI 之间的接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| status | 验 CLI | 需 WSL |
| fetch | 定点抓取 | 外部引擎安全 |
| hint | 接 MCP | 不启动服务 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| WSL | 必需 | 插件运行 | 返回错误 |
| Obscura 构建 | 必需 | 网页渲染 | status 失败 |
| Windows interop/本机 Linux binary | 二选一 | 执行 CLI | 无法抓取 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 定位 | 配 binaryPath | status --version |
| 试取 | 公开页面 fetch | 核 stdout/stderr |
| 扩展 | MCP hint | 另配服务 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 在 WSL 准备 Obscura 可执行文件及浏览器依赖，设 binaryPath | 构建/下载磁盘与 CPU；许可/网络现金成本未知 | 架构/interop/版本校验工时未知 | status 失败需重建或修路径 |
| 持续 | 每次启动 CLI 浏览器、页面加载、dump/eval | CPU/内存/站点带宽；每次费用未知 | 核抓取结果与许可、处理超时，工时未知 | 站点成功率和启动耗时未知 |
| 失败恢复 | 处理私网策略漂移、大输出 maxBuffer/导航超时 | 重抓与浏览器进程资源，金额未知 | 锁定/回退二进制、审请求目的地、改采集流程，工时未知 | DNS/重定向防线依外部版本 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 抓取 | CLI dump/eval | 站点成功率 |
| 安全 | http(s) 过滤 | DNS/重定向私网保护 |
| 交互 | MCP 接线提示 | MCP 实际连接 |

> **思考**：isSafeHttpUrl 仅限协议，不能证明 SSRF 阻断；CLI 与外层超时/缓冲区可能影响结果。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将无头抓取接到 DSH Agent 工具面并明确 MCP/CDP 升级路径。详见[Q01](#research-q01)。

将无头抓取接到 DSH Agent 工具面并明确 MCP/CDP 升级路径。详见[Q01](#research-q01)。

argv 运行避免 shell 拼接、双层超时与输出限制；安全和可用性仍依赖外部二进制。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

isSafeHttpUrl 仅限协议，不能证明 SSRF 阻断；CLI 与外层超时/缓冲区可能影响结果。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先 status 后公开 URL 样本 fetch，私网防线按 Obscura 版本独立验；交互用 MCP。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核三工具和 CLI 包装；私网防线委托外部二进制，默认 stealth 实为 false；目标 WSL/Obscura 未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、index.js、lib/obscura.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、index.js、lib/obscura.js、lib/wsl-host.js；不运行目标插件或 Obscura。旧 META 复用。
- 下一步：目标 WSL 中核 exe/native 版本、私网/DNS/重定向、stealth 默认、超大输出和超时。

**分析版本**

- **仓库**：[173787247/dsh-wsl-obscura](https://github.com/173787247/dsh-wsl-obscura)
- **版本号**：0.1.0（[固定提交 f1dfad4](https://github.com/173787247/dsh-wsl-obscura/tree/f1dfad47dd78722babc61633805caade6557dc68)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为固定二进制版本的私网回归矩阵、显式默认 stealth 与输出流式处理。详见[Q05](#research-q05)。

目标 WSL 中核 exe/native 版本、私网/DNS/重定向、stealth 默认、超大输出和超时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 206 | — | — | 1095 |
| .js | source | 3 | 517 | 467 | 19 | — |
| .js | test | 1 | 89 | 82 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-obscura/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**WSL 到 Obscura 的浏览器抓取桥有哪些真实能力与安全依赖？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与 GUI 浏览器或完整 MCP 工具有何区别？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

obscura_status 检二进制/版本，obscura_fetch 经 CLI 抓页并支持 dump/eval/stealth，obscura_mcp_hint 仅输出 MCP/CDP 接线文字，不启动服务。它是一次性无头抓取桥，不提供导航、点击、截图交互工具；README 把高级交互交给原生 MCP。适合 WSL 有 Obscura 构建的定点抓取，不应误当 GUI 或完整浏览器代理。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:4-12](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/README.zh.md#L4-L12)

作者三工具描述

```text
DeepSeek Harness 工具：从 **WSL** 调用 **[Obscura](https://github.com/h4ckf0r0day/obscura)**（Rust 无头浏览器）：

| 工具 | 作用 |
|------|------|
| `obscura_status` | 解析二进制并跑 `--version` |
| `obscura_fetch` | `obscura fetch`（dump / eval / stealth） |
| `obscura_mcp_hint` | MCP / CDP 接线说明（不启动服务） |

**不是** [`dsh-wsl-browser`](https://github.com/173787247/dsh-wsl-browser)（`win_open_url` 只打开 Windows **默认 GUI** 浏览器）。
```

**依据 2 · 作者声明**：[README.zh.md:42-46](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/README.zh.md#L42-L46)

GUI/MCP 边界

```text
## 为什么需要

要抓正文、跑页面 JS、或 stealth 抓取时，应用无头引擎。本机 Windows 已可编出 `obscura.exe`；插件经 WSL interop（`/mnt/c/.../obscura.exe`）调用。

更完整的 Agent 工具面（导航 / 点击 / 截图 MCP）优先用 **Obscura MCP**（`obscura mcp`），见 `obscura_mcp_hint`。
```

**依据 3 · 源码核查**：[index.js:38-64](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L38-L64)

status 注册

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register({
    name: "obscura_status",
    description: "Resolve the Obscura binary and report --version (WSL → Windows .exe via interop).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          bin: { type: "string" },
          winPath: { type: "string" },
          version: { type: "string" },
          error: { type: "string" },
          tried: { type: "array", items: { type: "string" } },
          note: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatStatusResult(value) }],
    },
    timeoutMs: Math.min(timeoutMs, 20_000),
    isConcurrencySafe: () => true,
    async execute() {
```

</details>

**依据 4 · 源码核查**：[index.js:93-143](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L93-L143)

fetch 注册

<details>
<summary>查看原文（51行）</summary>

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
        timeoutSec: {
          type: "number",
          description: "Navigation timeout in seconds (passed to obscura --timeout).",
        },
        allowPrivateNetwork: {
          type: "boolean",
          description: "Allow private/LAN hosts (SSRF guard off). Default false.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          href: { type: "string" },
          bin: { type: "string" },
          stdout: { type: "string" },
          stderr: { type: "string" },
          truncated: { type: "boolean" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatFetchResult(value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
```

</details>

**依据 5 · 源码核查**：[index.js:192-220](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L192-L220)

hint 不启动

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.tools.register({
    name: "obscura_mcp_hint",
    description: "Print how to wire Obscura MCP / CDP for DSH (does not start a server).",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {},
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          bin: { type: "string" },
          winPath: { type: "string" },
          hint: { type: "string" },
          note: { type: "string" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: value.hint || formatMcpHint(value) }],
    },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      if (!wsl) return { ok: false, error: "not running in WSL", hint: formatMcpHint({}) };
      const resolved = resolveObscuraBin({ binaryPath, candidates });
      const payload = {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 二进制与 fetch 参数如何组装？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

仅 WSL 运行；路径优先 config.binaryPath、OBSCURA_BIN/OBSCURA_PATH、候选本机构建，需文件存在，没有实际 PATH 查找。Windows C:\ 路径映射成 /mnt/c。URL 检查只限制 http(s)，dump 值白名单；eval 文本作为 execFile 数组参数传递而非 shell 拼接。CLI 执行有 timeout/maxBuffer 16MiB，返回 stdout 截断 maxOutputChars，错误还保留 stderr。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-26](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L17-L26)

初始化与 WSL 判定

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const maxOutputChars = positive(config.maxOutputChars, 32_000);
  const candidates = Array.isArray(config.candidates) && config.candidates.length
    ? config.candidates.map(String)
    : DEFAULT_CANDIDATES;
  const binaryPath = config.binaryPath ? String(config.binaryPath) : "";
  const defaultStealth = Boolean(config.defaultStealth);
  const wsl = detectWsl();
  console.log(`[dsh-wsl-obscura] loaded wsl=${wsl} defaultStealth=${defaultStealth}`);
```

</details>

**依据 2 · 源码核查**：[lib/obscura.js:67-99](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L67-L99)

路径决议

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Resolve obscura binary for WSL interop or native Linux.
 * Priority: config.binaryPath → OBSCURA_BIN → candidates → `obscura` on PATH (checked as file only if absolute).
 */
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
}
```

</details>

**依据 3 · 源码核查**：[lib/obscura.js:101-132](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L101-L132)

参数构造

<details>
<summary>查看原文（32行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[lib/obscura.js:143-167](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L143-L167)

execFile 限制

<details>
<summary>查看原文（25行）</summary>

```text
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
  }
```

</details>

#### 缺口

- 目标 Windows interop 与二进制架构未验
  **影响：**配置存在不代表可执行
  **进一步探讨：**WSL 内对 native/.exe 各验 --version 与 fetch

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 私网访问防线是否由插件实现？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具描述称 allowPrivateNetwork 默认 false 可保护 SSRF，但插件的 isSafeHttpUrl 仅校验 URL 语法与 http(s)，没有解析 DNS、主机 IP 或重定向；allowPrivateNetwork=true 只是增加 Obscura 的 --allow-private-network。默认私网拦截完全依赖外部 Obscura 二进制的版本与行为，插件源码本身不能证明阻断内网或重定向。eval 执行页面 JS，需视目标网页为不可信。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:115-122](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L115-L122)

参数宣称 SSRF guard

```text
        timeoutSec: {
          type: "number",
          description: "Navigation timeout in seconds (passed to obscura --timeout).",
        },
        allowPrivateNetwork: {
          type: "boolean",
          description: "Allow private/LAN hosts (SSRF guard off). Default false.",
        },
```

**依据 2 · 源码核查**：[lib/obscura.js:31-42](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L31-L42)

实际只检协议

<details>
<summary>查看原文（12行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[lib/obscura.js:101-114](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L101-L114)

私网开关委托 CLI

<details>
<summary>查看原文（14行）</summary>

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

```

</details>

**依据 4 · 源码核查**：[index.js:143-163](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L143-L163)

fetch 真正调用

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

#### 缺口

- Obscura 私网/DNS/重定向规则未核
  **影响：**不能把插件 URL 过滤当完整 SSRF 保护
  **进一步探讨：**固定 Obscura 版本测 localhost、LAN、DNS/重定向

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认 stealth、超时和输出有何容易误解处？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

README 示例把 defaultStealth 设 true，但插件无 schema 默认值，Boolean(config.defaultStealth) 在未配置时为 false；仅显式配置才默认开启。timeoutSec 是 CLI 导航参数，可超过或不同于外层 timeoutMs；execFile 的 16MiB maxBuffer 先于 maxOutputChars 截断，超大输出可能报错而不是成功截断。status 最大 20 秒、fetch 默认 60 秒，性能取决于浏览器启动与站点。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:73-83](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/README.zh.md#L73-L83)

示例 defaultStealth true

<details>
<summary>查看原文（11行）</summary>

````text
## 配置

```yaml
- id: dsh-wsl-obscura
  name: dsh-wsl-obscura
  config:
    timeoutMs: 60000
    maxOutputChars: 32000
    defaultStealth: true
    binaryPath: <obscura-checkout>/target/release/obscura.exe
```
````

</details>

**依据 2 · 源码核查**：[index.js:17-25](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L17-L25)

缺省 defaultStealth false

```text
export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 60_000);
  const maxOutputChars = positive(config.maxOutputChars, 32_000);
  const candidates = Array.isArray(config.candidates) && config.candidates.length
    ? config.candidates.map(String)
    : DEFAULT_CANDIDATES;
  const binaryPath = config.binaryPath ? String(config.binaryPath) : "";
  const defaultStealth = Boolean(config.defaultStealth);
  const wsl = detectWsl();
```

**依据 3 · 源码核查**：[index.js:141-163](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L141-L163)

外层 timeout 与输出截断

<details>
<summary>查看原文（23行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
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

**依据 4 · 源码核查**：[lib/obscura.js:123-149](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L123-L149)

CLI timeout 与 maxBuffer

<details>
<summary>查看原文（27行）</summary>

```text
    args.push("--eval", String(evalExpr));
  }
  if (timeoutSec != null && Number(timeoutSec) > 0) {
    args.push("--timeout", String(Math.floor(Number(timeoutSec))));
  }
  if (screenshot != null && String(screenshot).trim()) {
    args.push("--screenshot", String(screenshot));
  }
  return { ok: true, args };
}

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

- 目标网页耗时/大输出未测
  **影响：**预期 stealth 或截断与实际不同
  **进一步探讨：**目标大小页/超时矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用和评估可迁移价值？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

先在 WSL 用 status 验真实二进制，再只对许可的公开 URL 做 fetch，核 dump/eval 输出与截断；私网访问必须在 Obscura 版本层独立验证，必要时禁止 allowPrivateNetwork。复杂导航转原生 MCP。插件设计可迁移的是安全的 argv 执行和双层超时，但本仓库没有独立站点成功率基准；部署需 Windows/WSL 构建、interop 和可能的浏览器依赖，成本未知。 假设推导：插件本身只校验 http(s)，私网/DNS/重定向限制完全委托二进制，且 16MiB maxBuffer 可能在文本截断前失败。相对固定版，若在插件层对初始和每跳重定向做 DNS/IP 私网拒绝并把 fetch 输出流式限额，同时把依赖版本写入可复核矩阵，理论上能减少外部二进制版本变化导致的安全漂移和大页失败。条件是插件能观测浏览器实际连接地址及全部跳转，DNS 重绑定需要在连接时复核；代价是额外解析/代理、延迟及与 CLI 行为重复。以固定 Obscura 版本和 localhost、LAN、域名映射、301/302 跳私网、超大公开页样本对照固定版/原型，记录是否触达私网、失败类型、截断标志和耗时。若重定向仍触达私网或大页仍在预设输出限制前抛错，该假设被证伪；若无法观测实际连接，只能收窄为版本级回归测试，不宣称插件已具独立 SSRF 防线。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:48-71](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/README.zh.md#L48-L71)

前置安装

<details>
<summary>查看原文（24行）</summary>

````text
## 前置

1. Windows 上编好 Obscura（`render,stealth`）。
2. 指定二进制路径（任选）：
   - cordis `config.binaryPath`
   - 环境变量 `OBSCURA_BIN` / `OBSCURA_PATH`
   - 默认候选（本机脚手架路径）：
     `<obscura-checkout>/target/release/obscura.exe`

## 安装

本地仓（未发 GitHub 时）：

```sh
dsh plugin --profile web add /path/to/dsh-wsl-obscura
```

发布后：

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-obscura
```

装完重启 dsh web（kit：`scripts/restart-dsh-web.sh`）。
````

</details>

**依据 2 · 源码核查**：[index.js:64-83](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L64-L83)

status 能力

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

**依据 3 · 源码核查**：[index.js:143-183](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/index.js#L143-L183)

fetch 行为

<details>
<summary>查看原文（41行）</summary>

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
          truncated: out.truncated,
          error: run.error || "fetch failed",
        };
      }
      return {
        ok: true,
        href: checked.href,
        bin: resolved.bin,
        stdout: out.text,
        stderr: run.stderr,
        truncated: out.truncated,
      };
    },
```

</details>

**依据 4 · 源码核查**：[lib/obscura.js:143-167](https://github.com/173787247/dsh-wsl-obscura/blob/f1dfad47dd78722babc61633805caade6557dc68/lib/obscura.js#L143-L167)

执行边界

<details>
<summary>查看原文（25行）</summary>

```text
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
  }
```

</details>

#### 缺口

- 站点兼容与维护成本未知
  **影响：**不能仅凭静态代码投入批量网页工作流
  **进一步探讨：**许可站点样本集与二进制矩阵

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
