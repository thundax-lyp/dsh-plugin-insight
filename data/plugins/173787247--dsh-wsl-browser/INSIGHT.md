# dsh-wsl-browser

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c9ea53c](https://github.com/173787247/dsh-wsl-browser/tree/c9ea53c6f08d64488a422c917eb7992057294ae0)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-browser)
<!-- END META -->

> **功能**：从WSL调用Windows默认浏览器打开http(s) URL，并提供localhost访问建议，不抓取页面或确认加载。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 模型可调用跨系统URL桥与协议限制，局部减少交接步骤；浏览器/服务可达来自外部环境。

> **主要限制**：[Q03](#research-q03) opened只进程级；localhost建议硬编码http且未验证首IP，不等端口修复，href/参数可能含敏感信息而未脱敏。

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
  - [Q01 · 浏览器交接比复制URL增加什么？](#detail-section-11)
  - [Q02 · URL怎样校验、执行并生成localhost建议？](#detail-section-12)
  - [Q03 · opened与localhost提示有什么误导风险？](#detail-section-13)
  - [Q04 · 怎样试用、退出并验证更准确的回执？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL开发者需在Windows浏览器看本地服务/文档，正确页面实际可见才是结果。

聊天原生链接、复制地址栏或手工Start-Process；插件增加Agent桥接，不是浏览器读取/交互。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| URL白名单 | 拒非HTTP协议 | 非隐私/内容安全清洗 |
| Windows浏览器启动 | 本地服务/文档交接 | 进程ok不证页面加载 |
| localhost建议 | 提供首IP备选线索 | 未探测、硬编码http，非端口工具 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/prompt、Node>=18 | 必需 | 工具注册 | 宿主兼容未验 |
| WSL/interop/PowerShell | 必需 | 跨系统启动 | 非WSL失败 |
| Windows浏览器关联/网络 | 必需 | 页面可见 | ok仍不证加载 |
| hostname -I | 可选提示 | 首IP建议 | 失败忽略，不证可达 |
| 可信无敏感URL | 采用前提 | 避免秘密/不可信页 | 不直接回传token URL |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核interop/默认浏览器与服务 | 可信测试URL无凭据 |
| 打开 | 调工具后看真实页 | opened不单独验收 |
| 排障 | 核Windows侧端口/证书 | HTTPS不照抄http提示 |
| 退出 | 停调用/禁用回复制 | 历史/已开页面另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/Windows环境 | 互操作与关联核验 | 无独立账户不等环境零费 |
| 持续 | hostname与PowerShell/模型结果 | 确认页面可见 | 延迟/净节时未知 |
| 失败恢复 | 重复标签与网络排障 | 查服务/端口/证书及URL隐私 | 不自动修复forwarding |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨系统打开 | Start-Process接线 | 正确页面可见率 |
| 协议范围 | 仅http/https | URL内容可信/隐私 |
| 本地建议 | 基于首IP生成提示 | HTTPS语义/Windows可达与实际恢复 |

> **思考**：[Q03](#research-q03) opened只进程级；localhost建议硬编码http且未验证首IP，不等端口修复，href/参数可能含敏感信息而未脱敏。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 模型可调用跨系统URL桥与协议限制，局部减少交接步骤；浏览器/服务可达来自外部环境。

[Q02](#research-q02) 白名单与固定参数边界可复用；[Q03](#research-q03) 建议保持原scheme与探测位置，进程级opened不该掩盖实际加载未知。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) opened只进程级；localhost建议硬编码http且未验证首IP，不等端口修复，href/参数可能含敏感信息而未脱敏。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可信无敏感URL个人小试，核真实页；HTTPS localhost建议先查协议/端口，不符或不可见则停并回复制链接及专门网络诊断。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

重读固定入口/browser/公共PowerShell函数并复核正式findings；未运行目标/浏览器/网络，真实可见率与恢复成本未知。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/browser.js、lib/wsl-host.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定88行入口、39行browser和公共PowerShell调用及README/package；不审浏览器内容/Windows端口体系/套件其他组件。
- 下一步：[Q04](#research-q04) 分HTTP/HTTPS localhost、首IP/端口故障及登录页面对照实际显示/误成功/总成本，尚未执行。

**分析版本**

- **仓库**：[173787247/dsh-wsl-browser](https://github.com/173787247/dsh-wsl-browser)
- **版本号**：0.1.0（[固定提交 c9ea53c](https://github.com/173787247/dsh-wsl-browser/tree/c9ea53c6f08d64488a422c917eb7992057294ae0)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证方向为requested与Windows侧可达分离、保留scheme的建议；探测位置/隐私成本须明确，不能把预检当内容正确。

[Q04](#research-q04) 分HTTP/HTTPS localhost、首IP/端口故障及登录页面对照实际显示/误成功/总成本，尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 161 | — | — | 838 |
| .js | source | 3 | 184 | 164 | 4 | — |
| .js | test | 1 | 16 | 14 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-browser/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)

暂未获取：近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：URL到Windows浏览器的交接和回执怎样支持可信个人试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 浏览器交接比复制URL增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向WSL跑DSH、日常用Windows浏览器的开发者，把本地服务或文档URL交给默认浏览器。相对手工复制到地址栏/PowerShell Start-Process，增量是Agent可调用且只允许http/https的桥，不读取页面、不抓取内容、不控制浏览器交互，也不包含套件端口诊断能力。

合格结果是用户见到正确且可达的目标页，模型工具只发起打开仍有价值，但不证明网页加载或服务健康。经常要从WSL交接页面的人可减少一小步，偶尔打开链接的人原生聊天链接/复制已足够，不能把命令入口便利说成完整浏览器自动化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-47](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/README.md#L39-L47)

作者本地服务场景和端口工具分工。

```text
Services started in WSL (`http://127.0.0.1:3080`, docs sites, etc.) should open on the Windows side where you already work. Only `http`/`https` are allowed (no `file:`).

If localhost forwarding fails, the result may include a hint using the current WSL IP—pair with [dsh-wsl-port](https://github.com/173787247/dsh-wsl-port) for deeper diagnosis.

## Tool

| Arg | Required | Meaning |
|-----|----------|---------|
| `url` | yes | `http://` or `https://` URL |
```

**依据 2 · 源码核查**：[index.js:20-35](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/index.js#L20-L35)

工具目标与URL输入。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.systemPrompt.section({
    name: "tool:win_open_url",
    order: 124,
    text: "Use win_open_url to open http(s) links in the Windows default browser (including 127.0.0.1 services started in WSL).",
  });

  ctx.tools.register({
    name: "win_open_url",
    description: "Open an http(s) URL in the Windows default browser from WSL.",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["url"],
      properties: {
        url: { type: "string", description: "http or https URL." },
      },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · URL怎样校验、执行并生成localhost建议？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口依tools/systemPrompt，WSL检测失败直接结构化拒绝；isSafeHttpUrl用URL规范化，明确拒绝非http:/https:。每次合法调用都先hostname -I三秒取首个地址，不只localhost；失败忽略。再用规范href的单引号转义构造固定Start-Process脚本，由公共runPowerShell以execFile、NoProfile/NonInteractive、timeout和4MiB上限运行。

工具isConcurrencySafe=false，无插件队列/稳定ID；未传execution signal，hostname与PowerShell分别timeout，不是共享总deadline。WSL/Windows interop、PowerShell、浏览器关联和目标网络是依赖；Node>=18是包声明，兼容矩阵为作者报告非本次运行。协议白名单、参数化进程与结构化错误可借鉴，保留原URL比自行静默改目标更可追。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:50-74](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/index.js#L50-L74)

WSL检查、hostname、执行和结果。

<details>
<summary>查看原文（25行）</summary>

```text
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      const checked = isSafeHttpUrl(args?.url);
      if (!checked.ok) return checked;
      let wslIp = "";
      try {
        const { stdout } = await execFileAsync("hostname", ["-I"], { encoding: "utf8", timeout: 3_000 });
        wslIp = String(stdout || "").trim().split(/\s+/)[0] || "";
      } catch {
        /* optional */
      }
      const hint = rewriteLocalhostHint(checked.href, wslIp);
      try {
        await runPowerShell(buildOpenUrlScript(checked.href), { timeoutMs });
        return { ok: true, href: checked.href, note: hint.note };
      } catch (err) {
        return {
          ok: false,
          href: checked.href,
          error: err instanceof Error ? err.message : String(err),
          note: hint.note,
        };
      }
```

</details>

**依据 2 · 源码核查**：[lib/browser.js:1-17](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/lib/browser.js#L1-L17)

URL允许协议与单引号处理。

<details>
<summary>查看原文（17行）</summary>

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

export function buildOpenUrlScript(href) {
  const safe = String(href).replace(/'/g, "''");
  return `Start-Process '${safe}'; 'ok'`;
}
```

</details>

**依据 3 · 源码核查**：[lib/wsl-host.js:34-42](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/lib/wsl-host.js#L34-L42)

公共进程函数。

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
```

**依据 4 · 源码核查**：[package.json:1-16](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/package.json#L1-L16)

固定版本和Node声明。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-wsl-browser",
  "version": "0.1.0",
  "description": "DeepSeek Harness tool: open http(s) URLs in the Windows default browser from WSL.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/173787247/dsh-wsl-browser.git"
  },
  "bugs": {
    "url": "https://github.com/173787247/dsh-wsl-browser/issues"
  },
  "homepage": "https://github.com/173787247/dsh-wsl-browser#readme",
  "type": "module",
  "main": "index.js",
  "engines": { "node": ">=18" },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · opened与localhost提示有什么误导风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

PowerShell无抛错就返回ok，脚本未强制非终止错误停止，亦不检查页面/进程启动结果；format叫opened，不能据此说正确网页已可见。失败回执只进程级，DNS/端口/服务/登录/页面内容都未探测。

localhost提示不是实际改写/自动重试，原checked.href照旧打开；但提示字符串无论原协议都硬编码http://，HTTPS原页可能给http的443或原端口，丢hash，也不检查WSL首IP能否Windows访问。照抄建议可能无法访问或改变传输/源语义，不能当修复端口转发。

URL校验仅限制协议，不限制用户信息、query token、host或可信页面；href原样回模型并经argv传Windows浏览器，带敏感查询/凭据可留聊天/历史/进程，协议白名单非隐私清洗。未用真实秘密或不可信站点测试，不声称已经泄漏或远端可利用；个人也应只开明确可信无敏感URL。

#### 证据与依据

**依据 1 · 源码核查**：[lib/browser.js:14-38](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/lib/browser.js#L14-L38)

脚本、硬编码http建议与opened文本。

<details>
<summary>查看原文（25行）</summary>

```text
export function buildOpenUrlScript(href) {
  const safe = String(href).replace(/'/g, "''");
  return `Start-Process '${safe}'; 'ok'`;
}

export function rewriteLocalhostHint(href, wslIp) {
  try {
    const u = new URL(href);
    if ((u.hostname === "127.0.0.1" || u.hostname === "localhost") && wslIp) {
      return {
        href,
        note: `If Windows browser fails on localhost, try http://${wslIp}:${u.port || (u.protocol === "https:" ? "443" : "80")}${u.pathname}${u.search}`,
      };
    }
  } catch {
    /* ignore */
  }
  return { href, note: "" };
}

export function formatBrowserResult(value) {
  if (!value.ok) return `win_open_url failed: ${value.error}`;
  const lines = [`opened: ${value.href}`];
  if (value.note) lines.push(value.note);
  return lines.join("\n");
```

</details>

**依据 2 · 源码核查**：[index.js:63-73](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/index.js#L63-L73)

原href照开及回传。

<details>
<summary>查看原文（11行）</summary>

```text
      const hint = rewriteLocalhostHint(checked.href, wslIp);
      try {
        await runPowerShell(buildOpenUrlScript(checked.href), { timeoutMs });
        return { ok: true, href: checked.href, note: hint.note };
      } catch (err) {
        return {
          ok: false,
          href: checked.href,
          error: err instanceof Error ? err.message : String(err),
          note: hint.note,
        };
```

</details>

**依据 3 · 源码核查**：[lib/browser.js:1-11](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/lib/browser.js#L1-L11)

仅协议校验无脱敏。

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用、退出并验证更准确的回执？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有个人WSL/Windows浏览器者可在可信无敏感HTTP文档或本地页面小试，先核interop/默认浏览器与服务地址，亲眼确认页面；涉及HTTPS localhost不直接套用http提示，转回端口/证书诊断。首次有环境准备，持续每次hostname+PowerShell、模型结果token和页面确认，失败会有重复标签/人工查网络；没有独立服务账户不等总成本0。停调用/禁用回复制链接，已开的页面/历史另清理；页面不可见或URL隐私不清停止。

未验证假设是在不扩大任意URI范围前提下，分开报告“已请求打开”和Windows侧可达性，保留scheme并说明hash/身份信息及探测位置。已有协议白名单/localhost提示不是空白；可达性预检本身会发请求，有隐私/副作用与延迟成本，需用户选择且不等页面内容正确。对照HTTP/HTTPS localhost、不同首IP、未监听端口和登录页测错误成功判断与总时间；无净收益或探测误导则不加，当前未实验。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:56-73](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/index.js#L56-L73)

额外hostname与执行成本。

<details>
<summary>查看原文（18行）</summary>

```text
      let wslIp = "";
      try {
        const { stdout } = await execFileAsync("hostname", ["-I"], { encoding: "utf8", timeout: 3_000 });
        wslIp = String(stdout || "").trim().split(/\s+/)[0] || "";
      } catch {
        /* optional */
      }
      const hint = rewriteLocalhostHint(checked.href, wslIp);
      try {
        await runPowerShell(buildOpenUrlScript(checked.href), { timeoutMs });
        return { ok: true, href: checked.href, note: hint.note };
      } catch (err) {
        return {
          ok: false,
          href: checked.href,
          error: err instanceof Error ? err.message : String(err),
          note: hint.note,
        };
```

</details>

**依据 2 · 源码核查**：[lib/browser.js:19-38](https://github.com/173787247/dsh-wsl-browser/blob/c9ea53c6f08d64488a422c917eb7992057294ae0/lib/browser.js#L19-L38)

现有建议/回执构成参照。

<details>
<summary>查看原文（20行）</summary>

```text
export function rewriteLocalhostHint(href, wslIp) {
  try {
    const u = new URL(href);
    if ((u.hostname === "127.0.0.1" || u.hostname === "localhost") && wslIp) {
      return {
        href,
        note: `If Windows browser fails on localhost, try http://${wslIp}:${u.port || (u.protocol === "https:" ? "443" : "80")}${u.pathname}${u.search}`,
      };
    }
  } catch {
    /* ignore */
  }
  return { href, note: "" };
}

export function formatBrowserResult(value) {
  if (!value.ok) return `win_open_url failed: ${value.error}`;
  const lines = [`opened: ${value.href}`];
  if (value.note) lines.push(value.note);
  return lines.join("\n");
```

</details>

#### 缺口

- 无真实浏览器/Windows侧连通/重复标签/耗时对照
  **影响**：不能证明可见率、localhost恢复或净节时
  **进一步探讨**：可信测试页面记录启动与真正显示；分别测HTTP/HTTPS，不将WSL探测当Windows可达。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
