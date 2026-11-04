# dsh-wsl-fetch

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a9b8686](https://github.com/173787247/dsh-wsl-fetch/tree/a9b8686ccce9122f1d28bece692d4d571d38af0d)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-fetch)
<!-- END META -->

> **功能**：让 WSL 中 DSH 的 web_fetch 通过 Windows HTTP 代理读取公开网页。

> **亮点**：保留原 web_fetch 工具调用，在宿主 provider 层将 GET 转给已配置代理，用户无需改用 shell 抓取。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：私网过滤只检查 URL 字面值，代理如何解析与连接需要独立验证。已保留自定义 provider 时，提示文本也可能误报路线。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 什么任务值得保持原 web_fetch 工具入口？](#detail-section-11)
  - [Q02 · 何时接管，异常和响应如何返回？](#detail-section-12)
  - [Q03 · 代理网络边界由谁保证，失败成本是什么？](#detail-section-13)
  - [Q04 · 怎样试用，如何验证更明确的路由约束？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有可用代理、但原 web_fetch 直连公开站点失败的 WSL 用户。

直接可用时保留默认 provider。子进程代理或手动请求不会自动替换宿主内的 web_fetch。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| wsl-proxy | 保持 web_fetch 原入口并改用代理 | 已有可信 HTTP 代理，实际路由另核 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
|---|---|---|
| DSH web 与 systemPrompt | 注册及选用 provider | 保留已有自定义 provider |
| HTTP(S) 代理及 undici | 请求路由 | 代理配置和 DNS 需要核对 |

| 阶段 | 操作 | 判断 |
|---|---|---|
| 接入 | 独立 Profile 配可信代理 | 确认实际 provider |
| 核查 | 请求公开文本页 | 看到状态、结果与截断 |
| 退出 | 停用并恢复默认 | 重启回查路线 |

**效果与成本**

| 阶段 | 资源 | 边界 |
|---|---|---|
| 使用 | 代理连接、重试及内存缓冲 | 排查 TLS、路由和站点返回 |

| 结果 | 当前材料 | 待验证 |
|---|---|---|
| web_fetch 走代理 | provider 与实际派发 | 站点、网络成功率和私网防护 |

> **思考**：私网过滤只检查 URL 字面值，代理如何解析与连接需要独立验证。已保留自定义 provider 时，提示文本也可能误报路线。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：保留原 web_fetch 工具调用，在宿主 provider 层将 GET 转给已配置代理，用户无需改用 shell 抓取。[Q01](#research-q01) [Q02](#research-q02)

共享 ProxyAgent 减少反复创建，组合超时及响应裁剪缩小资源范围；选用条件与提示文案需要区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

私网过滤只检查 URL 字面值，代理如何解析与连接需要独立验证。已保留自定义 provider 时，提示文本也可能误报路线。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用无敏感 URL 的公开文本页确认 provider 和结果。无法验证代理边界或默认已通时切回原 provider。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 provider、请求与 URL 限制；当前宿主及实际网络路线待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/fetch.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定包的 provider 注册、undici 派发、URL 检查、重试与响应限制。未运行代理、Host 或外网。
- 下一步：对照同 URL 直连和代理，检查自定义 provider 保留、字节限制、超时和隔离网内最终路由。

**分析版本**

- **仓库**：[173787247/dsh-wsl-fetch](https://github.com/173787247/dsh-wsl-fetch)
- **版本号**：0.1.2（[固定提交 a9b8686](https://github.com/173787247/dsh-wsl-fetch/tree/a9b8686ccce9122f1d28bece692d4d571d38af0d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

代理侧核查最终连接并给操作者提供明确选用与拒绝信息，对照公开网页通过率和私网访问结果。假设未验证。[Q04](#research-q04)

对照同 URL 直连和代理，检查自定义 provider 保留、字节限制、超时和隔离网内最终路由。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 238 | — | — | 1459 |
| .js | source | 2 | 405 | 371 | 6 | — |
| .mjs | source | 1 | 113 | 98 | 14 | — |
| .js | test | 1 | 191 | 177 | 16 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-fetch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-fetch/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-fetch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已配置 Windows 代理的 WSL 用户，能否在不更换工具调用的情况下取得公开网页内容，并明确其网络约束？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务值得保持原 web_fetch 工具入口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已将 Windows HTTP 代理配置给 WSL 进程，仍遇到 DSH 内置 web_fetch 不能访问某个公开文本网页时，可用这个 provider 保留原工具调用。合格结果是原工作流取得可读取的公开响应，状态码及截断可见。作者将问题归因于官方实现直接连解析出的 IP，子进程注入代理不能改进程内的请求。这里可独立核实的是本组件向现有 web 服务注册 provider 后，将实际 GET 交给 ProxyAgent。直接访问已经通畅时，切换路线没有必然增益；需要 JavaScript 渲染时，本实现的 GET 也不能替代浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-44](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/README.md#L36-L44)

作者给出直连与进程内代理的问题背景。

```text
**Scope:** in-process official `web_fetch` via undici `ProxyAgent`. Requires `HTTP(S)_PROXY`. Cloudflare 403/1010 through Clash needs a **DIRECT** rule — outside this plugin.

## Why

Official `dsh-web-fetch-http` resolves DNS in WSL, then connects **directly** to that public IP with a custom undici `Agent`. That bypasses `NODE_USE_ENV_PROXY`. DeepSeek API can work (global `fetch` + proxy) while Mattermost/docs `web_fetch` fails with `TypeError: fetch failed`.

`dsh-wsl-net` only injects proxy env into **child** bash/npm. It cannot fix in-process `web_fetch`.

This plugin registers fetch provider `wsl-proxy` and, when `HTTPS_PROXY` / `HTTP_PROXY` is set, selects it so `web_fetch` uses undici `ProxyAgent`.
```

**依据 2 · 源码核查**：[index.js:19-28](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/index.js#L19-L28)

实际注册与选用位置。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.web.registerFetchProvider(provider);

  if (provider.available() && shouldPinFetchProvider(ctx.web.fetchProviderId)) {
    ctx.web.fetchProviderId = PROVIDER_ID;
    console.log(`[dsh-wsl-fetch] web_fetch via proxy (${redactProxy(proxyUrl)}) provider=${PROVIDER_ID}`);
  } else if (!provider.available()) {
    console.log("[dsh-wsl-fetch] no HTTP(S)_PROXY; official http fetch stays selected");
  } else {
    console.log(`[dsh-wsl-fetch] registered ${PROVIDER_ID} but left fetchProvider=${ctx.web.fetchProviderId}`);
  }
```

</details>

**依据 3 · 源码核查**：[lib/fetch.js:331-346](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L331-L346)

调用的是 undici GET 而非浏览器。

<details>
<summary>查看原文（16行）</summary>

```text
async function defaultRequest(url, { proxyUrl, userAgent, signal }) {
  const { fetch } = await import("undici");
  const dispatcher = await getSharedProxyAgent(proxyUrl);
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml,text/*;q=0.9,application/json;q=0.8,*/*;q=0.1",
      "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
    },
    signal,
    dispatcher,
  });
  // Shared ProxyAgent — do not close per request.
  return { response, close: async () => {} };
```

</details>

#### 缺口

- 没有本轮同环境直接请求和代理请求对照。
  **影响**：不能确认代理改善特定站点。
  **进一步探讨**：对同一无敏感数据 URL 对照默认与 wsl-proxy 结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 何时接管，异常和响应如何返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 读取进程代理变量，注册 wsl-proxy，只有可用且当前 provider 是空值或官方 http 才主动选用。已配置自定义 provider 保留，但提示文字按 available 生成，存在提示称使用代理、实际上自定义 provider 未切换的情况。请求通过共享 ProxyAgent 发 GET；一个组合信号覆盖请求期限和调用取消。捕获带顶层 code 的错误直接抛出，只有部分无代码请求失败按次数延迟重试；不是 HTTP 状态或所有 TLS 错误都自动重试。响应手动处理重定向；非支持内容类型取消读取。声明长度超限报错，流式跨过字节限制则截断，解码后还有字符上限。返回最终 URL、状态、内容和截断位；可读错误与结果都有证据，但宿主如何展示尚待验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-35](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/index.js#L19-L35)

注册条件与提示条件不同。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.web.registerFetchProvider(provider);

  if (provider.available() && shouldPinFetchProvider(ctx.web.fetchProviderId)) {
    ctx.web.fetchProviderId = PROVIDER_ID;
    console.log(`[dsh-wsl-fetch] web_fetch via proxy (${redactProxy(proxyUrl)}) provider=${PROVIDER_ID}`);
  } else if (!provider.available()) {
    console.log("[dsh-wsl-fetch] no HTTP(S)_PROXY; official http fetch stays selected");
  } else {
    console.log(`[dsh-wsl-fetch] registered ${PROVIDER_ID} but left fetchProvider=${ctx.web.fetchProviderId}`);
  }

  ctx.systemPrompt.section({
    name: "runtime:wsl-web-fetch",
    order: 117,
    text: provider.available()
      ? "web_fetch goes through the Windows HTTP proxy (Clash/V2Ray) instead of connecting from WSL to a pinned public IP. Keep using web_fetch for public https pages. Do not fetch localhost or private addresses. If a fetch fails or reports a cross-origin redirect, retry the Location URL directly or switch to another public source; do not loop the same failing URL."
      : "No HTTP(S)_PROXY is set, so web_fetch uses the official direct provider. On Windows+WSL that often fails; set HTTPS_PROXY and restart dsh web, or install dsh-wsl-net and run net_doctor.",
```

</details>

**依据 2 · 源码核查**：[lib/fetch.js:104-110](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L104-L110)

只有官方 http 或空 provider 可被替换。

```text
export function shouldFollowRedirect(from, to) {
  return isSameOrigin(from, to) || isWwwHostAlias(from, to);
}

export function shouldPinFetchProvider(existingId) {
  return existingId == null || existingId === "" || existingId === "http";
}
```

**依据 3 · 源码核查**：[lib/fetch.js:165-183](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L165-L183)

代理池复用及声明长度分支。

<details>
<summary>查看原文（19行）</summary>

```text
const proxyAgents = new Map();

async function getSharedProxyAgent(proxyUrl) {
  const { ProxyAgent } = await import("undici");
  let agent = proxyAgents.get(proxyUrl);
  if (!agent) {
    agent = new ProxyAgent(proxyUrl);
    proxyAgents.set(proxyUrl, agent);
  }
  return agent;
}

export async function readCapped(response, maxBytes, signal) {
  const declared = response.headers.get("content-length");
  if (declared !== null) {
    const length = Number(declared);
    if (Number.isFinite(length) && length > maxBytes) {
      await response.body?.cancel();
      throw Object.assign(new Error(`response exceeds the maximum of ${maxBytes} bytes`), { code: "WEB_FETCH_TOO_LARGE" });
```

</details>

**依据 4 · 源码核查**：[lib/fetch.js:250-278](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L250-L278)

组合期限及有限重试。

<details>
<summary>查看原文（29行）</summary>

```text
    async fetch(request, signal) {
      if (signal?.aborted) {
        throw Object.assign(new Error("web fetch aborted"), { code: "WEB_ABORTED" });
      }
      const deadline = AbortSignal.any([
        signal ?? new AbortController().signal,
        AbortSignal.timeout(timeoutMs),
      ]);
      let current = parseFetchUrl(request?.url);
      let redirects = 0;
      let networkAttempt = 0;
      for (;;) {
        let handled;
        try {
          handled = await requestFn(current, {
            proxyUrl,
            userAgent,
            signal: deadline,
          });
          networkAttempt = 0;
        } catch (error) {
          if (error && typeof error === "object" && "code" in error && error.code) throw error;
          if (networkAttempt < retries && !deadline.aborted) {
            networkAttempt += 1;
            await sleep(retryDelayMs * networkAttempt);
            continue;
          }
          throw translateNetwork(error, deadline);
        }
```

</details>

**依据 5 · 源码核查**：[lib/fetch.js:190-209](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L190-L209)

流式限制和取消 reader。

<details>
<summary>查看原文（20行）</summary>

```text
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = maxBytes - total;
      if (value.byteLength > remaining) {
        chunks.push(value.subarray(0, remaining));
        total += remaining;
        truncatedByBytes = true;
        break;
      }
      chunks.push(value);
      total += value.byteLength;
    }
  } catch (error) {
    throw translateNetwork(error, signal);
  } finally {
    await reader.cancel().catch(() => {});
  }
```

</details>

**依据 6 · 源码核查**：[lib/fetch.js:310-325](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L310-L325)

最终输出包含状态和截断。

<details>
<summary>查看原文（16行）</summary>

```text
          const kind = classifyContentType(response.headers.get("content-type"));
          if (kind === undefined) {
            await response.body?.cancel();
            throw Object.assign(new Error(`unsupported content type "${response.headers.get("content-type") ?? "unknown"}"`), { code: "WEB_UNSUPPORTED_CONTENT_TYPE" });
          }
          const { bytes, truncatedByBytes } = await readCapped(response, maxResponseBytes, deadline);
          const decoded = decodeBody(bytes, response.headers.get("content-type"), maxBodyChars);
          return {
            url: current.toString(),
            statusCode: response.status,
            body: { kind, content: decoded.content },
            truncated: truncatedByBytes || decoded.truncatedByChars,
          };
        } finally {
          await handled.close?.();
        }
```

</details>

#### 缺口

- 未测宿主切换、定时及中止。
  **影响**：不能保证状态在 UI 中易定位，或代理握手不会迟于预期。
  **进一步探讨**：检查自定义 provider、无代理、慢响应和取消后日志及输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 代理网络边界由谁保证，失败成本是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

包装层过滤非 HTTP(S)、含用户名或密码、若干本地域名和私网字面 IP。每次跳转重新解析目标，只放行同源或相同协议与端口的 www 和裸域互跳。保护适用于 URL 字面层；实际 GET 交给 ProxyAgent，源码没有在包装层解析并固定最终地址。能否到达代理网络的私网取决于该代理的 DNS 与路由配置，不能从过滤函数推导完整隔离。依赖是含 web 和 systemPrompt 的 DSH、可工作的进程代理变量、undici 及代理路线。代理有时会因策略、认证或站点拒绝而失败；路由改动、重启、TLS 诊断和重试都由操作者承担。网页返回体进入宿主，公开试验也应考虑敏感 URL 参数和服务日志。

#### 证据与依据

**依据 1 · 源码核查**：[lib/fetch.js:33-46](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L33-L46)

字面主机与后缀过滤。

<details>
<summary>查看原文（14行）</summary>

```text
export function isBlockedHostname(hostname) {
  const host = String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
  if (!host) return true;
  if (host === "localhost" || host === "0.0.0.0") return true;
  if (
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan")
  ) {
    return true;
  }
  if (isIP(host)) return isPrivateIp(host);
  return false;
```

</details>

**依据 2 · 源码核查**：[lib/fetch.js:75-84](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L75-L84)

协议、用户信息与主机检查。

<details>
<summary>查看原文（10行）</summary>

```text
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw Object.assign(new Error(`unsupported URL protocol "${url.protocol}"`), { code: "WEB_INVALID_URL" });
  }
  if (url.username || url.password) {
    throw Object.assign(new Error("URLs with credentials are blocked"), { code: "WEB_BLOCKED_URL" });
  }
  if (isBlockedHostname(url.hostname)) {
    throw Object.assign(new Error(`URL hostname "${url.hostname}" is not a public destination`), { code: "WEB_BLOCKED_URL" });
  }
  return url;
```

</details>

**依据 3 · 源码核查**：[lib/fetch.js:291-307](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L291-L307)

重定向重新检查并限制跨源。

<details>
<summary>查看原文（17行）</summary>

```text
            let next;
            try {
              next = parseFetchUrl(new URL(location, current).toString());
            } catch (error) {
              await response.body?.cancel();
              throw error;
            }
            if (!shouldFollowRedirect(current, next)) {
              await response.body?.cancel();
              throw Object.assign(
                new Error(`cross-origin redirect to ${next.origin} is not followed automatically; retry against that URL directly`),
                { code: "WEB_REDIRECT_BLOCKED" },
              );
            }
            await response.body?.cancel();
            current = next;
            redirects += 1;
```

</details>

**依据 4 · 源码核查**：[lib/fetch.js:331-346](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L331-L346)

由 ProxyAgent 实际派发。

<details>
<summary>查看原文（16行）</summary>

```text
async function defaultRequest(url, { proxyUrl, userAgent, signal }) {
  const { fetch } = await import("undici");
  const dispatcher = await getSharedProxyAgent(proxyUrl);
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml,text/*;q=0.9,application/json;q=0.8,*/*;q=0.1",
      "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
    },
    signal,
    dispatcher,
  });
  // Shared ProxyAgent — do not close per request.
  return { response, close: async () => {} };
```

</details>

#### 缺口

- 未检查代理的 DNS 和连接决策。
  **影响**：不能断言特定域名、别名或重新解析下的最终网络边界。
  **进一步探讨**：在隔离代理下用受控主机核查私网解析与同源跳转的最终请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用，如何验证更明确的路由约束？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先在可退出 Profile 配置可信代理，只请求一个公开非敏感文本测试 URL，确认实际选用 provider，并检查输出状态、内容和来源。代理不通、原生已经可用或 URL 需要私网时恢复默认 provider 并重启验证。可研究在代理侧引入最终连接审计与禁止私网解析策略，再让插件在结果暴露受约束路线而非仅凭 available 提示。用同一公开和私网解析对照样本比较成功率、拒绝原因与排障耗时；若合法网页明显受损或私网仍可连接，假设不成立。现版本未验证这项设计。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-35](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/index.js#L19-L35)

有选择状态与提示分离，可作为观察对象。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.web.registerFetchProvider(provider);

  if (provider.available() && shouldPinFetchProvider(ctx.web.fetchProviderId)) {
    ctx.web.fetchProviderId = PROVIDER_ID;
    console.log(`[dsh-wsl-fetch] web_fetch via proxy (${redactProxy(proxyUrl)}) provider=${PROVIDER_ID}`);
  } else if (!provider.available()) {
    console.log("[dsh-wsl-fetch] no HTTP(S)_PROXY; official http fetch stays selected");
  } else {
    console.log(`[dsh-wsl-fetch] registered ${PROVIDER_ID} but left fetchProvider=${ctx.web.fetchProviderId}`);
  }

  ctx.systemPrompt.section({
    name: "runtime:wsl-web-fetch",
    order: 117,
    text: provider.available()
      ? "web_fetch goes through the Windows HTTP proxy (Clash/V2Ray) instead of connecting from WSL to a pinned public IP. Keep using web_fetch for public https pages. Do not fetch localhost or private addresses. If a fetch fails or reports a cross-origin redirect, retry the Location URL directly or switch to another public source; do not loop the same failing URL."
      : "No HTTP(S)_PROXY is set, so web_fetch uses the official direct provider. On Windows+WSL that often fails; set HTTPS_PROXY and restart dsh web, or install dsh-wsl-net and run net_doctor.",
```

</details>

**依据 2 · 源码核查**：[lib/fetch.js:331-346](https://github.com/173787247/dsh-wsl-fetch/blob/a9b8686ccce9122f1d28bece692d4d571d38af0d/lib/fetch.js#L331-L346)

最终派发边界可由代理策略补充验证。

<details>
<summary>查看原文（16行）</summary>

```text
async function defaultRequest(url, { proxyUrl, userAgent, signal }) {
  const { fetch } = await import("undici");
  const dispatcher = await getSharedProxyAgent(proxyUrl);
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: {
      "user-agent": userAgent,
      accept: "text/html,application/xhtml+xml,text/*;q=0.9,application/json;q=0.8,*/*;q=0.1",
      "accept-language": "zh-TW,zh;q=0.9,en;q=0.8",
    },
    signal,
    dispatcher,
  });
  // Shared ProxyAgent — do not close per request.
  return { response, close: async () => {} };
```

</details>

#### 缺口

- 尚无代理策略对照数据。
  **影响**：仅适合受控试用。
  **进一步探讨**：先记录公开成功与不支持类型，再查隔离网拦截。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
