# dsh-wsl-playwright

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[a451fef](https://github.com/173787247/dsh-wsl-playwright/tree/a451fefa0d3dc7454cc0c08c58110c392c64611a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright)
<!-- END META -->

> **实现功能**：在 WSL 经 npx 启动无头 Chromium，读取 URL 标题、状态或正文。

> **核心亮点**：把无头网页标题/正文读取接入模型工具，减少手工复制，并为 JS 渲染页面提供潜在增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：临时目录 ESM 导入与 npx 包解析关系未验证，现有单测不覆盖启动；URL 无内网/重定向边界，fetch 不呈现最终 URL/HTTP 状态。详见[Q03](#research-q03)。

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
  - [Q01 · 谁会用，交付哪些网页信息？](#detail-section-11)
  - [Q02 · Playwright 如何启动、提取和裁剪输出？](#detail-section-12)
  - [Q03 · URL 和包解析是否限制可访问范围、能否可靠启动？](#detail-section-13)
  - [Q04 · 采用成本和最小验证是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户需要读取公开、可能经 JavaScript 渲染的网页内容。

手工浏览器复制或普通 HTTP 请求；本组件提供浏览器渲染后正文工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 工具 | 用途 | 边界 |
| --- | --- | --- |
| pw_status | node/npx 探测 | 不验证 Chromium 可运行 |
| pw_title | 标题/状态/最终 URL | 单次新浏览器 |
| pw_fetch | 正文文本 | 不呈现状态/最终 URL，截断 |

**流程与依赖**

#### 运行条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| Node/npx | 启动脚本 | 工具失败 |
| Playwright/Chromium | 页面渲染 | 下载或启动失败 |
| 网络与站点权限 | 请求目标 | 超时、拒绝或敏感读取风险 |
| DSH tools/systemPrompt | 注册工具 | 不可用 |


#### 运行步骤

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 探测 | pw_status | node/npx 存在，尚不证明 Playwright 可用 |
| 标题 | pw_title(URL) | title/status/finalUrl 可核 |
| 正文 | pw_fetch(URL) | 截断正文并由人核来源 |
| 复核 | 对重定向和关键事实检查 | 避免网页文本当指令 |

**效果与成本**

#### 成本

| 阶段 | 资源与时间 | 人工事项 | 未知 |
| --- | --- | --- | --- |
| 首次 | Node/npx、Playwright 与 Chromium 下载 | 装包、配置隔离网络 | 下载与安装成功率 |
| 每次 | 新浏览器/脚本、页面导航 | 核目标/重定向和正文 | 延迟、内存、页面质量 |
| 故障 | 超时/解析/浏览器错误 | 排查包解析与站点访问 | 孙进程与日志上限 |


#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 标题/状态 | pw_title 返回 JSON | 真实浏览器成功率 |
| 正文 | body.innerText 截断 | 动态/登录页面质量 |
| URL 范围 | http/https 限制 | 内网、跳转、凭据隔离 |

> **思考**：临时目录 ESM 导入与 npx 包解析关系未验证，现有单测不覆盖启动；URL 无内网/重定向边界，fetch 不呈现最终 URL/HTTP 状态。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把无头网页标题/正文读取接入模型工具，减少手工复制，并为 JS 渲染页面提供潜在增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

把无头网页标题/正文读取接入模型工具，减少手工复制，并为 JS 渲染页面提供潜在增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

独立 argv 降低 shell 注入风险，临时脚本导入依赖的解析路径需验证；stdout 超阈值杀直接进程，stderr 收集无界；每次启动新 Chromium。

<a id="detail-section-5"></a>

### 1.4 主要限制

临时目录 ESM 导入与 npx 包解析关系未验证，现有单测不覆盖启动；URL 无内网/重定向边界，fetch 不呈现最终 URL/HTTP 状态。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察。只在无凭据隔离环境先测试公开页面；若真实启动/地址边界不稳，则不作无监督网页抓取。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

入口与源码范围已核；Playwright 包解析、浏览器运行、网络范围与抓取质量未验证，URL 只限协议不限制目的地。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/pw.js、test/playwright.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查 README、package、入口、lib/pw.js 与 URL 单测；未运行目标代码、浏览器或目标站点。
- 下一步：在隔离 WSL 对静态、JS 渲染、重定向、错误、内网模拟页做同条件对照，检查包解析、结果、资源与边界。

**分析版本**

- **仓库**：[173787247/dsh-wsl-playwright](https://github.com/173787247/dsh-wsl-playwright)
- **版本号**：0.1.1（[固定提交 a451fef](https://github.com/173787247/dsh-wsl-playwright/tree/a451fefa0d3dc7454cc0c08c58110c392c64611a)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

固定可解析的 Playwright 环境并添加目标地址门控、最终 URL/状态审计；在隔离站点矩阵比较成功率/延迟/误访问后再采用，本版未实现。详见[Q04](#research-q04)。

在隔离 WSL 对静态、JS 渲染、重定向、错误、内网模拟页做同条件对照，检查包解析、结果、资源与边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 114 | — | — | 481 |
| .js | source | 2 | 292 | 275 | 4 | — |
| .js | test | 1 | 7 | 7 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+created%3A2026-09-22T05%3A27%3A14.154Z..2026-10-22T05%3A27%3A14.154Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-playwright/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A27%3A14.154Z..2026-10-22T05%3A27%3A14.154Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 WSL 无头浏览器读取工具、运行依赖与 URL 风险，确定采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用，交付哪些网页信息？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要在 DSH/WSL 中无头读取网页标题、HTTP 状态和正文的自动化用户。实际注册 pw_status（检查 npx/node 路径与 Node 版本）、pw_title（标题/状态/最终 URL）和 pw_fetch（标题/正文）三个模型工具，并在系统提示中建议交互式 Windows 浏览另用 dsh-wsl-browser。相对手工开浏览器复制内容，它把浏览器渲染后的可见正文送入模型回合；但并未提供点击、表单、多页会话，也没有网页可靠性或事实验证。README 工具表只列 status/fetch，入口另有 title，固定 package 版本 0.1.1 而 README 页首仍列 0.1.0；应按实际源码与包版本理解。合格结果需显示目标 URL、最终 URL、响应状态和正文来源，不能把网页文本当可信指令。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-33](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/README.md#L1-L33)

作者称 WSL 无头抓取、可选 kit 与浏览器分工；版本/工具表未与入口完全同步。

<details>
<summary>查看原文（33行）</summary>

````text
# dsh-wsl-playwright

> **语言：** **中文**（本页） · [English](./README.en.md)

WSL 无头 Playwright 抓取页面标题与正文。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-playwright
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-playwright
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`

## 工具

| 工具 | 作用 |
|------|------|
| `pw_status` | npx/node 是否可用 |
| `pw_fetch` | 无头打开 URL |

## 配置要点

`timeoutMs / maxChars`

交互浏览优先 `dsh-wsl-browser`（Windows）。同一任务不要双轨驱动。首次可能经 npx 下载浏览器。
````

</details>

**依据 2 · 源码核查**：[index.js:15-92](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/index.js#L15-L92)

系统提示和三个工具参数、响应范围。

<details>
<summary>查看原文（78行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:playwright-wsl",
    order: 138,
    text: "dsh-wsl-playwright does headless Chromium fetch in WSL (pw_title for quick title/status, pw_fetch for body text). For interactive Windows browsing prefer dsh-wsl-browser. Do not drive both on the same task. First run may download Playwright browsers via npx.",
  });

  ctx.tools.register({
    name: "pw_status",
    description: "Whether npx/node available for Playwright headless runs; node version.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 8_000,
    isConcurrencySafe: () => true,
    async execute() {
      return pwStatus();
    },
    presentCall: () => ({ card: "generic", title: "pw status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pw status", content: r.content }),
  });

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
      }
    },
    presentCall: () => ({ card: "generic", title: "pw title" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pw title", content: r.content }),
  });

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
      }
    },
    presentCall: () => ({ card: "generic", title: "pw fetch" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pw fetch", content: r.content }),
  });
```

</details>

**依据 3 · 源码核查**：[package.json:1-12](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/package.json#L1-L12)

固定包版本0.1.1、Node>=18及分发文件。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-wsl-playwright",
  "version": "0.1.1",
  "description": "DeepSeek Harness WSL plugin: headless Playwright URL fetch in WSL.",
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/173787247/dsh-wsl-playwright.git" },
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
  "scripts": { "test": "node --test test/*.test.js" },
  "files": ["index.js", "lib", "cordis.patch.yml", "README.md", "README.en.md", "README.zh.md", "LICENSE", "CHANGELOG.md"],
  "keywords": ["dsh-plugin", "wsl", "playwright"],
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Playwright 如何启动、提取和裁剪输出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每次 title/fetch 在系统临时目录写一个 ESM 脚本，再以 npx --yes -p playwright node <临时脚本> <URL> 启动。脚本导入 chromium，headless 启动新浏览器、打开新页面，等待 DOMContentLoaded；title 返回页面 title、最终 URL 和 response.status，fetch 取 body.innerText 并按 maxChars 截断。外层把 stdout JSON 解析为工具结果；默认总超时90秒，页面导航内部45秒。run 用 spawn 独立 argv，不拼用户 URL 为 shell 文本；stdout 过 maxOut*2 杀子进程，完成后裁剪；stderr 仅结束时切到8000字符，中途累积不设限。仅 kill npx 直接子进程，浏览器后代退出行为未由代码证明。浏览器脚本和临时目录在 finally 中删除。title 不返回网页 body，fetch 不返回 HTTP 状态/最终 URL，调用者需分别调用才能把跳转与状态并入正文记录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pw.js:30-57](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L30-L57)

spawn、超时、stdout/stderr 收集与裁剪实现。

<details>
<summary>查看原文（28行）</summary>

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
  });
```

</details>

**依据 2 · 源码核查**：[lib/pw.js:81-138](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L81-L138)

title 临时脚本、新 Chromium/页面、导航和 JSON 解析。

<details>
<summary>查看原文（58行）</summary>

```text
/** Fast high-freq probe: open URL and return title + final URL only. */
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
      try {
        unlinkSync(script);
      } catch {
        /* ignore */
      }
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/pw.js:140-194](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L140-L194)

fetch 的正文提取、字符截断及清理。

<details>
<summary>查看原文（55行）</summary>

```text
export async function pwFetch({ url, timeoutMs = 90_000, maxChars = 30_000 } = {}) {
  const u = assertUrl(url);
  const npx = (await which("npx")) || "npx";
  const dir = mkdtempSync(join(tmpdir(), "dsh-pw-"));
  const script = join(dir, "fetch.mjs");
  writeFileSync(
    script,
    `
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
    if (json.ok === false) throw new Error(json.error || "playwright failed");
    return json;
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      try {
        unlinkSync(script);
      } catch {
        /* ignore */
      }
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[index.js:66-92](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/index.js#L66-L92)

工具只显示 title 与正文，不呈现最终 URL/HTTP 状态。

<details>
<summary>查看原文（27行）</summary>

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
      }
    },
    presentCall: () => ({ card: "generic", title: "pw fetch" }),
    presentResult: (_a, r) => ({ card: "generic", title: "pw fetch", content: r.content }),
  });
```

</details>

#### 缺口

- 无真实浏览器和高输出页面压力对照。
  **影响**：无法量化每请求启动成本、子进程退出、长 stderr 内存与正文正确率。
  **进一步探讨**：用本地测试站点覆盖重定向、错误状态、长文本、长 stderr、超时与重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · URL 和包解析是否限制可访问范围、能否可靠启动？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

assertUrl 只检查字符串非空、<=2000字符、URL 解析及 http/https 协议；没有域名、内网/回环地址、重定向最终地址、DNS 解析或认证范围门控。因此模型给出的 URL 若指向可达内网 HTTP 服务，浏览器原则上可能读取其正文；真实网络策略仍由宿主决定，不能据此断言已泄露。另一个启动疑点是脚本写在系统临时目录却从脚本内部以 ESM import 'playwright'；npx -p playwright 为 node 命令提供临时包环境，不必然使该临时脚本的 ESM 包解析路径包含 Playwright，代码没有把包安装到脚本祖先目录或显式定位模块。现有单测只覆盖 http URL 和 file 拒绝，不覆盖浏览器启动、内网/重定向或解析。该依赖失败路径是静态风险，应通过隔离运行证实，不能宣称必然失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pw.js:17-28](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L17-L28)

只校验协议和长度，没有主机/IP/重定向限制。

<details>
<summary>查看原文（12行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/pw.js:83-115](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L83-L115)

临时目录中的 ESM import 与 npx -p playwright 启动方式。

<details>
<summary>查看原文（33行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/pw.js:140-171](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L140-L171)

fetch 同样使用临时脚本及 npx 包解析方式。

<details>
<summary>查看原文（32行）</summary>

```text
export async function pwFetch({ url, timeoutMs = 90_000, maxChars = 30_000 } = {}) {
  const u = assertUrl(url);
  const npx = (await which("npx")) || "npx";
  const dir = mkdtempSync(join(tmpdir(), "dsh-pw-"));
  const script = join(dir, "fetch.mjs");
  writeFileSync(
    script,
    `
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

**依据 4 · 源码核查**：[test/playwright.test.js:1-7](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/test/playwright.test.js#L1-L7)

现有测试只检查 URL 校验两条路径。

```text
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assertUrl } from "../lib/pw.js";
describe("pw", () => {
  it("url", () => assert.ok(assertUrl("https://example.com")));
  it("bad", () => assert.throws(() => assertUrl("file:///x"), /http/));
});
```

#### 缺口

- 未执行隔离 npx/Playwright import 与内网地址实验。
  **影响**：运行可用性和内网实际暴露程度未证实。
  **进一步探讨**：在离线缓存且无敏感网络的临时 WSL 环境验证 ESM 包解析；用本地回环页测 URL/重定向策略。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用成本和最小验证是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需 Node/npx、Playwright 包及 Chromium 浏览器，可触发下载；每次调用重新创建浏览器和临时脚本，网络/CPU/内存与等待时间可能高于普通 HTTP 获取。浏览器可执行脚本并访问其可达网络，页面正文进入模型上下文，需限定可信站点或隔离网络及凭据。当前建议观察：对公开、需要 JS 渲染的页面才有明确相对纯 HTTP 抓取的价值；网页正文仍需证据核对。未实现的改进是假设：固定可解析的 Playwright 运行环境、复用受控浏览器、限制可访问地址及最终跳转，并在 fetch 同时记录最终 URL/HTTP 状态。最小对照用静态页、JS 渲染页、重定向、内网模拟页和错误状态页，测成功率、延迟、资源、目标边界以及与原手工/HTTP 方法相比的额外信息。若无法稳定启动或误读受限地址，就不宜用于无监督抓取。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-42](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/README.md#L29-L42)

配置、首次 npx 下载和套件兼容性声明。

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
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.0-rc.2`**）— 套件唯一真源 |
| **套件档位** | 可选（默认不在 `install.sh` / `KIT_SET=daily`） |
```

</details>

**依据 2 · 源码核查**：[lib/pw.js:81-115](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L81-L115)

每次 title 新临时脚本与浏览器。

<details>
<summary>查看原文（35行）</summary>

```text
/** Fast high-freq probe: open URL and return title + final URL only. */
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
```

</details>

**依据 3 · 源码核查**：[lib/pw.js:140-171](https://github.com/173787247/dsh-wsl-playwright/blob/a451fefa0d3dc7454cc0c08c58110c392c64611a/lib/pw.js#L140-L171)

每次 fetch 新临时脚本与浏览器，未共享会话。

<details>
<summary>查看原文（32行）</summary>

```text
export async function pwFetch({ url, timeoutMs = 90_000, maxChars = 30_000 } = {}) {
  const u = assertUrl(url);
  const npx = (await which("npx")) || "npx";
  const dir = mkdtempSync(join(tmpdir(), "dsh-pw-"));
  const script = join(dir, "fetch.mjs");
  writeFileSync(
    script,
    `
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

#### 缺口

- 无本轮安装、下载、延迟、内存或抓取质量测量。
  **影响**：无法证明相对普通 HTTP 抓取的收益或投入产出。
  **进一步探讨**：在隔离 WSL 实测上述站点矩阵，记录下载/启动成本、成功率与渲染增益。
- 地址门控、受控浏览器复用尚未实现。
  **影响**：只属改进假设，不计入本版能力。
  **进一步探讨**：原型化后与现版对比安全边界和性能。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
