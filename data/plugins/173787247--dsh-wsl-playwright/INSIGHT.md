# WSL Playwright 页面读取

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ce0063a](https://github.com/173787247/dsh-wsl-playwright/tree/ce0063af6d5bf485e47cf0f666c529b7ef0821bc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-playwright)
<!-- END META -->

> **功能**：在 DSH 中通过无头 Chromium 读取网页标题、状态或正文。

> **亮点**：[Q01](#research-q01) 将浏览器标题和正文结果变成专用会话工具输出。

> **主要限制**：[Q03](#research-q03) HTTP/HTTPS 校验不限制目标主机，状态检查也不能证明 Chromium 可用。

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
  - [Q01 · 何时值得用无头浏览读取页面？](#detail-section-11)
  - [Q02 · 一次调用如何启动浏览器并退出？](#detail-section-12)
  - [Q03 · http(s) 校验能隔离内网和重定向吗？](#detail-section-13)
  - [Q04 · 怎样核对可用性与退路？](#detail-section-14)
  - [Q05 · 要先确认标题还是直接读取正文？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 WSL 内需要给 DSH 查看网页标题或正文的人可评估无头读取工具。

HTTP 拉取适合静态内容，人工浏览可处理交互，但结果需自行复制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 标题查询 | 快速看状态和最终 URL | 需浏览器启动 |
| 正文读取 | 返回限量的页面文本 | 动态内容可能还未出现 |
| 状态探测 | 看 Node 与 npx 路径 | 不检查浏览器可用性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| WSL 的 bash、node、npx | 必需 | 定位及启动子脚本 | 不返回网页结果 |
| Playwright 与 Chromium | 必需 | 无头导航 | 启动失败 |
| 受控网络出口 | 按部署需要 | 限定访问 | 协议校验本身无法隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 检查依赖和网络权限 | 只用受控页面 |
| 核对 | 分别调用标题和正文 | 检查空正文、状态及最终地址 |
| 退出 | 禁用工具 | 保留原读网页路径 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和浏览器资源未知 | 解析与准备时间未知 | npx 依赖未固定 |
| 持续 | 浏览器启动和网络消耗未知 | 复核正文耗时未知 | 每次新开浏览器 |
| 恢复 | 重新运行资源未知 | 清理和排查耗时未知 | 超时不证明进程树已结束 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 标题读取 | 有状态和最终 URL | 实测启动与目标识别 |
| 正文提取 | innerText 截断 | 动态页面完整性 |

> **思考**：[Q03](#research-q03) HTTP/HTTPS 校验不限制目标主机，状态检查也不能证明 Chromium 可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将浏览器标题和正文结果变成专用会话工具输出。

临时脚本与输出边界明确，超时只定位到直接子进程。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) HTTP/HTTPS 校验不限制目标主机，状态检查也不能证明 Chromium 可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离环境核对依赖、出站和正文，之后再决定是否纳入会话工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持工具接线与临时脚本。依赖、实际网页与网络隔离未运行。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/pw.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定注册与 Playwright 脚本，未执行浏览器、WSL、外部网页或依赖。
- 下一步：测试受控空正文、重定向、浏览器缺失及超时进程。

**分析版本**

- **仓库**：[173787247/dsh-wsl-playwright](https://github.com/173787247/dsh-wsl-playwright)
- **版本号**：0.1.1（[固定提交 ce0063a](https://github.com/173787247/dsh-wsl-playwright/tree/ce0063af6d5bf485e47cf0f666c529b7ef0821bc)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较先看标题再按需取正文和直接抓全文的成本及效果。

测试受控空正文、重定向、浏览器缺失及超时进程。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 114 | — | — | 481 |
| .js | source | 2 | 292 | 275 | 4 | — |
| .js | test | 1 | 7 | 7 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查一次性浏览的提取范围、动态依赖和访问边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时值得用无头浏览读取页面？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 WSL 里需要给 DSH 查看网页标题或正文的使用者，可以按任务选择 pw_title 或 pw_fetch。标题路径返回状态与最终 URL，正文路径取 body 的 innerText 后限量。相较手工浏览再复制，结果直接进会话；相较简单 HTTP 客户端，它会加载浏览器页面，但不保留交互工作流。只等待 DOMContentLoaded，正文可能仍未加载。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-33](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/README.md#L22-L33)

作者区分只读抓取和交互浏览

<details>
<summary>查看原文（12行）</summary>

```text
## 工具

| 工具 | 作用 |
|------|------|
| `pw_status` | npx/node 是否可用 |
| `pw_fetch` | 无头打开 URL |

## 配置要点

`timeoutMs / maxChars`

交互浏览优先 `dsh-wsl-browser`（Windows）。同一任务不要双轨驱动。首次可能经 npx 下载浏览器。
```

</details>

**依据 2 · 源码核查**：[index.js:35-59](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/index.js#L35-L59)

标题工具实际注册

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.tools.register({
    name: "pw_title",
    description: "Headless open http(s) URL; return title + HTTP status + final URL (no body). High-frequency read-only probe.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["url"],
      properties: { url: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        {
          type: "text",
          text: v.ok === false ? v.error : `title=${v.title}\nstatus=${v.status}\nfinalUrl=${v.finalUrl}`,
        },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await pwTitle({ url: args.url, timeoutMs });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 3 · 源码核查**：[index.js:66-87](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/index.js#L66-L87)

正文工具实际注册

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register({
    name: "pw_fetch",
    description: "Headless open an http(s) URL; return title + body text (capped). Slow; may download browsers once.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["url"],
      properties: { url: { type: "string" } },
    },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : `title=${v.title}\n\n${v.text || ""}` },
      ],
    },
    timeoutMs,
    isConcurrencySafe: () => true,
    async execute(args) {
      try {
        return await pwFetch({ url: args.url, timeoutMs, maxChars });
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
```

</details>

**依据 4 · 源码核查**：[lib/pw.js:148-159](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L148-L159)

提取范围与等待条件

<details>
<summary>查看原文（12行）</summary>

```text
import { chromium } from 'playwright';
const url = process.argv[2];
const max = Number(process.argv[3] || 30000);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  let text = '';
  try { text = await page.locator('body').innerText({ timeout: 10000 }); } catch {}
  text = String(text || '').slice(0, max);
  process.stdout.write(JSON.stringify({ ok: true, url, title, chars: text.length, text }));
```

</details>

#### 缺口

- 未比较静态和动态网站覆盖
  **影响**：无法确定何时比 HTTP 拉取更好
  **进一步探讨**：用受控静态和延迟渲染页面对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次调用如何启动浏览器并退出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具创建临时脚本，用 npx --yes -p playwright 调用 node，脚本启动新 Chromium 页面并从 stdout 返回 JSON，正常路径在 finally 关闭浏览器，调用方再尝试删除临时目录。超时杀掉启动的直接子进程，代码没有等待整个浏览器进程组退出的证据。正文读取异常被吞掉后仍可能返回 ok 和空文本，成功状态不能代表正文完整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pw.js:30-56](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L30-L56)

子进程、超时和输出控制

<details>
<summary>查看原文（27行）</summary>

```text
export function run(bin, args, { timeoutMs = 90_000, maxOut = 120_000 } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const t = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("timeout"));
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      stdout += d;
      if (stdout.length > maxOut * 2) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => (stderr += d));
    child.on("close", (code) => {
      clearTimeout(t);
      resolvePromise({
        code,
        stdout: stdout.slice(0, maxOut),
        stderr: stderr.slice(0, 8000),
        truncated: stdout.length > maxOut,
      });
    });
    child.on("error", (e) => {
      clearTimeout(t);
      reject(e);
    });
```

</details>

**依据 2 · 源码核查**：[lib/pw.js:82-130](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L82-L130)

临时脚本、npx 入口和清理

<details>
<summary>查看原文（49行）</summary>

```text
export async function pwTitle({ url, timeoutMs = 60_000 } = {}) {
  const u = assertUrl(url);
  const npx = (await which("npx")) || "npx";
  const dir = mkdtempSync(join(tmpdir(), "dsh-pw-"));
  const script = join(dir, "title.mjs");
  writeFileSync(
    script,
    `
import { chromium } from 'playwright';
const url = process.argv[2];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  process.stdout.write(JSON.stringify({
    ok: true,
    url,
    finalUrl: page.url(),
    title,
    status: resp ? resp.status() : null,
  }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
`,
  );
  try {
    const r = await run(npx, ["--yes", "-p", "playwright", "node", script, u], {
      timeoutMs,
      maxOut: 8_000,
    });
    const line = r.stdout.trim();
    if (!line) throw new Error(`playwright empty output: ${r.stderr || r.code}`);
    let json;
    try {
      json = JSON.parse(line);
    } catch {
      throw new Error(`playwright non-JSON: ${line.slice(0, 200)} ${r.stderr}`);
    }
    if (json.ok === false) throw new Error(json.error || "playwright failed");
    return json;
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
```

</details>

**依据 3 · 源码核查**：[lib/pw.js:148-180](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L148-L180)

正文容错、输出与异常处理

<details>
<summary>查看原文（33行）</summary>

```text
import { chromium } from 'playwright';
const url = process.argv[2];
const max = Number(process.argv[3] || 30000);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  let text = '';
  try { text = await page.locator('body').innerText({ timeout: 10000 }); } catch {}
  text = String(text || '').slice(0, max);
  process.stdout.write(JSON.stringify({ ok: true, url, title, chars: text.length, text }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
`,
  );
  try {
    const r = await run(npx, ["--yes", "-p", "playwright", "node", script, u, String(maxChars)], {
      timeoutMs,
      maxOut: maxChars + 8000,
    });
    const line = r.stdout.trim();
    if (!line) throw new Error(`playwright empty output: ${r.stderr || r.code}`);
    let json;
    try {
      json = JSON.parse(line);
    } catch {
      throw new Error(`playwright non-JSON: ${line.slice(0, 200)} ${r.stderr}`);
    }
```

</details>

#### 缺口

- 未运行超时与子进程树
  **影响**：无法确认无残留或可用正文
  **进一步探讨**：用超时页面和空 body 分别核对返回与进程

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · http(s) 校验能隔离内网和重定向吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

输入只校验 URL 长度、可解析及 HTTP/HTTPS 协议，没有检查目标主机。页面直接交给 Chromium 导航，没有在这条路径按实际请求拦截本机地址、子资源或重定向。因而网络权限取决于执行环境，不能把协议校验等同于只可访问公开站点。工具内容会进入模型上下文，应当作外部数据。另一个边界是 npx 使用未固定版本的 playwright，并且这段代码没有安装 Chromium 的独立步骤。README 的首次可能下载说明不能证明当前环境会自动准备浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pw.js:17-27](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L17-L27)

仅检查协议和长度

<details>
<summary>查看原文（11行）</summary>

```text
export function assertUrl(url) {
  const u = String(url || "").trim();
  if (!u || u.length > 2000) throw new Error("invalid url");
  let parsed;
  try {
    parsed = new URL(u);
  } catch {
    throw new Error("invalid url");
  }
  if (!/^https?:$/i.test(parsed.protocol)) throw new Error("only http(s) urls");
  return u;
```

</details>

**依据 2 · 源码核查**：[lib/pw.js:90-108](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L90-L108)

直接导航并关闭

<details>
<summary>查看原文（19行）</summary>

```text
import { chromium } from 'playwright';
const url = process.argv[2];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  process.stdout.write(JSON.stringify({
    ok: true,
    url,
    finalUrl: page.url(),
    title,
    status: resp ? resp.status() : null,
  }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
  process.exitCode = 1;
} finally {
  await browser.close();
```

</details>

**依据 3 · 源码核查**：[lib/pw.js:148-171](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L148-L171)

浏览器请求和 npx 未固定依赖

<details>
<summary>查看原文（24行）</summary>

```text
import { chromium } from 'playwright';
const url = process.argv[2];
const max = Number(process.argv[3] || 30000);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  let text = '';
  try { text = await page.locator('body').innerText({ timeout: 10000 }); } catch {}
  text = String(text || '').slice(0, max);
  process.stdout.write(JSON.stringify({ ok: true, url, title, chars: text.length, text }));
} catch (e) {
  process.stdout.write(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
  process.exitCode = 1;
} finally {
  await browser.close();
}
`,
  );
  try {
    const r = await run(npx, ["--yes", "-p", "playwright", "node", script, u, String(maxChars)], {
      timeoutMs,
      maxOut: maxChars + 8000,
```

</details>

**依据 4 · 作者声明**：[README.md:29-42](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/README.md#L29-L42)

作者的兼容与下载描述

<details>
<summary>查看原文（14行）</summary>

```text
## 配置要点

`timeoutMs / maxChars`

交互浏览优先 `dsh-wsl-browser`（Windows）。同一任务不要双轨驱动。首次可能经 npx 下载浏览器。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-playwright` **0.1.1** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.2-alpha.3`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

</details>

#### 缺口

- 未验证运行环境的网络出口和依赖解析
  **影响**：不能认定内网隔离或首次运行成功
  **进一步探讨**：隔离网络下核对重定向和缺浏览器报错

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样核对可用性与退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、WSL 内可找到 bash、node、npx，以及可解析的 Playwright 包和已可启动的 Chromium。pw_status 只检查可执行文件路径与 Node 版本，因此还要用受控公开页面确认 title/fetch。依赖安装、运行时间和出站访问均无本轮测量。若环境不允许临时依赖或开放网络，禁用该插件，保留原有网页读取方式。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-20](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/README.md#L12-L20)

可选独立安装

````text
## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-playwright
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-playwright
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`
````

**依据 2 · 源码核查**：[lib/pw.js:60-78](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L60-L78)

状态工具只检查命令和版本

<details>
<summary>查看原文（19行）</summary>

```text
export async function pwStatus() {
  const npx = (await which("npx")) || null;
  const node = (await which("node")) || null;
  let nodeVersion = null;
  if (node) {
    try {
      const r = await run(node, ["--version"], { timeoutMs: 5_000, maxOut: 200 });
      nodeVersion = (r.stdout || r.stderr || "").trim() || null;
    } catch {
      /* ignore */
    }
  }
  return {
    ok: true,
    npx,
    node,
    nodeVersion,
    note: "Headless Chromium via npx -p playwright. First run may download browsers. Prefer Windows dsh-wsl-browser for GUI; use this for WSL-side automation only.",
  };
```

</details>

**依据 3 · 源码核查**：[index.js:6-18](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/index.js#L6-L18)

启用、限时和字符配置

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-playwright] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 90_000);
  const maxChars = positive(config.maxChars, 30_000);
  console.log("[dsh-wsl-playwright] headless fetch only");

  ctx.systemPrompt.section({
    name: "tool:playwright-wsl",
    order: 138,
    text: "dsh-wsl-playwright does headless Chromium fetch in WSL (pw_title for quick title/status, pw_fetch for body text). For interactive Windows browsing prefer dsh-wsl-browser. Do not drive both on the same task. First run may download Playwright browsers via npx.",
```

</details>

#### 缺口

- 未运行 WSL 或浏览器
  **影响**：无法认定首次准备成本和稳定性
  **进一步探讨**：对无缓存与有缓存的隔离环境比较

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 要先确认标题还是直接读取正文？

**研究主题**：新假设与验证

#### 完整回答

已有标题模式返回状态和最终 URL，正文模式才返回文本。可验证针对同一批站点先读标题并按任务选择正文，是否减少无用上下文与误读。对照直接抓正文，记录总进程启动数、任务准确性、响应时间和失败。如果额外进程成本抵消了内容收益或漏掉关键页面，放弃该策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pw.js:95-103](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L95-L103)

标题和状态输出

```text
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  process.stdout.write(JSON.stringify({
    ok: true,
    url,
    finalUrl: page.url(),
    title,
    status: resp ? resp.status() : null,
  }));
```

**依据 2 · 源码核查**：[lib/pw.js:153-159](https://github.com/173787247/dsh-wsl-playwright/blob/ce0063af6d5bf485e47cf0f666c529b7ef0821bc/lib/pw.js#L153-L159)

正文输出范围

```text
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  const title = await page.title();
  let text = '';
  try { text = await page.locator('body').innerText({ timeout: 10000 }); } catch {}
  text = String(text || '').slice(0, max);
  process.stdout.write(JSON.stringify({ ok: true, url, title, chars: text.length, text }));
```

#### 缺口

- 没有任务负载对照
  **影响**：不能声称两阶段更快
  **进一步探讨**：固定网页集合比较两种策略

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
