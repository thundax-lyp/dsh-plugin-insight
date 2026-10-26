# dsh-about

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[febf7b0](https://github.com/1010n111/dsh-about/tree/febf7b0da6a2255ddfd84028c624ad9e4953dd83)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about)
<!-- END META -->

> **实现功能**：在 DSH Web 设置页展示推断的运行版本、插件版本和 GitHub Releases 摘要。

> **核心亮点**：把本地版本与远端 Release 信息集中到 Web 设置页，降低查找步骤。详见[Q02](#research-q02)。

> **风险与缺陷**：通过 clientModules bundle 路径拼 node_modules 候选无法保证与实际 dsh --version 一致；路由统一 200 且未限 GET。详见[Q03](#research-q03)。

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
  - [Q01 · “关于”页给用户什么可核的信息？](#detail-section-11)
  - [Q02 · 版本解析和更新日志代理如何实现？](#detail-section-12)
  - [Q03 · 版本和只读 HTTP 的声明有哪些边界？](#detail-section-13)
  - [Q04 · 使用所需依赖及运行成本有多大？](#detail-section-14)
  - [Q05 · 怎样让版本展示更适合故障诊断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户排障或核版本时，在界面内快速获得版本与更新日志。

CLI dsh --version 与 GitHub Releases；插件只提供界面整合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地版本 | 排障 | 路径启发式 |
| Release | 看变更 | 远端可用性/匹配 |
| Web 页面 | 降查找成本 | 当前宿主槽位兼容待验 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| clientModules/fs/webServer | 包版本与路由 | 版本未知 |
| Web 设置槽/React | About 界面 | 无页面 |
| GitHub API | 日志 | 外链兜底 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 打开 | 设置页查看版本 | 能加载 |
| 对照 | dsh --version/包路径 | 信息一致 |
| 故障 | 断网/缺包 | 错误清楚 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | Web profile | 槽位兼容 |
| 使用 | 本地文件读取/GitHub 请求 | 断网表现 |
| 维护 | 路径布局和语言正文解析 | 未来版本兼容 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 版本页 | 读包路径并显示 | 与运行 CLI 恒一致 |
| 更新日志 | GitHub API 缓存/双语拆分 | tag/安装版本匹配 |

> **思考**：通过 clientModules bundle 路径拼 node_modules 候选无法保证与实际 dsh --version 一致；路由统一 200 且未限 GET。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地版本与远端 Release 信息集中到 Web 设置页，降低查找步骤。详见[Q02](#research-q02)。

把本地版本与远端 Release 信息集中到 Web 设置页，降低查找步骤。详见[Q02](#research-q02)。

Host 不检查请求方法，JSON 失败仍 HTTP 200；版本从 client bundle 路径推断，Releases 固定远端代理缓存。

<a id="detail-section-5"></a>

### 1.4 主要限制

通过 clientModules bundle 路径拼 node_modules 候选无法保证与实际 dsh --version 一致；路由统一 200 且未限 GET。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅作排障辅助，报告版本同时附 CLI 输出；试点核多安装布局和离线回退。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持只读展示，但版本路径启发式并非直接运行进程真相，CLI 一致性未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包、Host 和 Client；未运行 DSH Web 或查询 GitHub。
- 下一步：多安装布局和版本对照 CLI；断网/Release 错误核状态与界面，确认 Host 真正读取运行包。

**分析版本**

- **仓库**：[1010n111/dsh-about](https://github.com/1010n111/dsh-about)
- **版本号**：0.0.4（[固定提交 febf7b0](https://github.com/1010n111/dsh-about/tree/febf7b0da6a2255ddfd84028c624ad9e4953dd83)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

由宿主提供进程版本/commit 与安装来源，并为 Release 标记时间/tag，可提高诊断可信度；尚未实现。详见[Q05](#research-q05)。

多安装布局和版本对照 CLI；断网/Release 错误核状态与界面，确认 Host 真正读取运行包。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1199 | 1004 | 131 | — |
| .md | source | 1 | 96 | — | — | 928 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1010n111/dsh-about/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1010n111/dsh-about/issues?q=is%3Aissue+created%3A2026-09-22T05%3A48%3A43.694Z..2026-10-22T05%3A48%3A43.694Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1010n111/dsh-about/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A48%3A43.694Z..2026-10-22T05%3A48%3A43.694Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 DSH 版本/更新日志可视化的来源可靠性与诊断价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · “关于”页给用户什么可核的信息？

**研究主题**：场景与需求

#### 完整回答

插件把 DSH 运行包版本、插件版本、项目链接和 GitHub Releases 摘要放进 Web 设置页，可帮助报告故障时确认所见版本。合格结果应与实际运行进程及 CLI 一致，更新日志也需标明远端来源与获取时间。它不是安装/升级器。基线是 dsh --version、package.json、GitHub Releases 页面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/README.md#L1-L19)

作者界面功能。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-about

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面添加一个 **“关于”** 设置页,展示当前运行的 DSH 版本、插件自身版本、项目主页与版本来源。UI 完全复用设置面板的设计规范(`--dsw-alias-*` 主题 token,深浅主题自适应)。

## 特性

- 设置弹窗左侧导航新增 **“关于”** 菜单项,固定在导航**最后一项**(`order: 9999`,其他插件新增菜单也不会排在它后面)
- 界面**中英双语**:跟随 DSH 设置面板语言(通用设置 → Language,切换即时生效),无需语言服务时按浏览器语言兜底
- “关于”页展示:
  | 行 | 内容 |
  |---|---|
  | 版本 | 当前运行的 DSH 版本(与 `dsh --version` 一致) |
  | 插件版本 | `dsh-about · v0.0.4`(与 package.json 同步) |
  | 插件仓库 | `github.com/1010n111/dsh-about` 外链 |
  | 项目主页 | deepseek-harness 仓库外链 |
  | 版本来源 | `@deepseek-ai/dsh` |
  | 更新日志 | 拉取 deepseek-harness 的 **GitHub Releases**(默认显示最近 5 条),当前运行版本置顶高亮,单条可展开/收起;失败时给出外链兜底 |
- 加载中显示 `…`,读取失败显示 `—` 并给出具体错误文本,便于诊断
- 纯前端 + 一个只读 HTTP 端点,不写任何配置、不改动持久化数据
```

</details>

**依据 2 · 源码核查**：[lib/index.js:72-90](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L72-L90)

版本响应载荷。

<details>
<summary>查看原文（19行）</summary>

```text
/** 组装 GET /dsh-about/version 的响应载荷。 */
async function versionPayload(ctx) {
  try {
    const version = await readDshVersion(ctx);
    if (version === undefined) {
      // 稳定错误码(不随语言变化),由 client 侧 about 字典翻译展示。
      return { ok: false, error: "unable to resolve dsh version" };
    }
    return {
      ok: true,
      version,
      product: "DeepSeek Harness",
      homepage: "https://github.com/deepseek-ai/deepseek-harness",
      plugin: { name: "dsh-about", version: PLUGIN_VERSION, repo: "https://github.com/1010n111/dsh-about" },
    };
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:188-200](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/client.js#L188-L200)

前端读取两个端点。

<details>
<summary>查看原文（13行）</summary>

```text
    /** 读取 Host 提供的版本信息(失败时页面显示错误文本)。 */
    function fetchVersion() {
      return fetch("/dsh-about/version", { headers: { accept: "application/json" } }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      });
    }

    /** 读取 deepseek-harness 的更新日志(Host 半区代理 GitHub Releases)。 */
    function fetchReleases() {
      return fetch("/dsh-about/releases", { headers: { accept: "application/json" } }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
```

</details>

#### 缺口

- 未在实际 DSH Web 与 CLI 对照。
  **影响**：显示是否等于运行版本未知。
  **进一步探讨**：同进程核版本、包解析路径和 UI。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本解析和更新日志代理如何实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 从 clientModules.clientPath 多个官方 Web bundle 拿路径，遍历 node_modules 片段拼候选 @deepseek-ai/dsh/package.json，经 fs.resolve/readText 并检查 name/version；前端请求 /version。另一 Host 端点请求固定 GitHub Releases API、过滤草稿、拆中英正文、5 分钟缓存；Client 在设置槽显示列表。增量是将版本与更新日志放到 DSH 内部统一界面，核心信息均来自安装包和 GitHub。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-69](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L25-L69)

客户端 bundle 反推包路径。

<details>
<summary>查看原文（45行）</summary>

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
  const anchors = [
    "@deepseek-ai/dsh-client-modules",
    "@deepseek-ai/dsh-client-runtime",
    "@deepseek-ai/dsh-client-connection",
    "@deepseek-ai/dsh-client-ui-theme",
  ];
  for (const anchor of anchors) {
    const bundle = clientModules.clientPath(anchor);
    if (typeof bundle !== "string" || bundle.length === 0) continue;
    const path = normalize(bundle);
    const candidates = [];
    let from = 0;
    for (;;) {
      const marker = path.indexOf("node_modules", from);
      if (marker < 0) break;
      candidates.push(`${path.slice(0, marker)}node_modules/@deepseek-ai/dsh/package.json`);
      from = marker + 1;
    }
    const tail = path.lastIndexOf("node_modules");
    if (tail >= 0) {
      candidates.push(`${path.slice(0, tail)}@deepseek-ai/dsh/package.json`);
    }
    for (const candidate of candidates) {
      try {
        const target = await fs.resolve(candidate);
        const text = await fs.readText(target);
        const manifest = JSON.parse(text);
        if (
          manifest &&
          manifest.name === "@deepseek-ai/dsh" &&
          typeof manifest.version === "string" &&
          manifest.version.length > 0
        ) {
          return manifest.version;
        }
      } catch (_) {
        // try the next candidate
      }
    }
  }
  return undefined;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:92-145](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L92-L145)

固定 GitHub Releases 代理与缓存。

<details>
<summary>查看原文（54行）</summary>

```text
/** GitHub Releases 精简字段,供"更新日志"使用。 */
const RELEASES_URL = "https://api.github.com/repos/deepseek-ai/deepseek-harness/releases?per_page=20";

/**
 * 把 GitHub Release 的双语正文拆成中/英两段,由 client 按界面语言选取。
 * 正文结构:中文段(导航行 + 前言 + `<h3 id="cn-…">` 各节)+ 整行 `---` 分隔线
 * + 英文段(前言 + `<h3 id="en-…">` 各节)。以首个整行 `---` 为界:
 * 英文前言在英文锚点之前,不能用锚点切(会把英文段混入中文)。
 * 无分隔线时整段视为单语,原样返回。
 */
function splitBody(body) {
  const text = String(body || "");
  const match = text.match(/\r?\n---\r?\n/);
  if (!match) return { zh: text, en: text };
  const index = match.index;
  const sepEnd = index + match[0].length;
  return { zh: text.slice(0, index), en: text.slice(sepEnd) };
}

/** 内存缓存:5 分钟内不重复请求 GitHub。 */
let releasesCache = { at: 0, payload: null };
const CACHE_TTL_MS = 5 * 60 * 1000;

async function releasesPayload() {
  const now = Date.now();
  if (releasesCache.payload && now - releasesCache.at < CACHE_TTL_MS) {
    return releasesCache.payload;
  }
  try {
    const res = await fetch(RELEASES_URL, {
      headers: { accept: "application/vnd.github+json", "user-agent": "dsh-about" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`github http ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error("bad github payload");
    const releases = list
      .filter((r) => r && !r.draft && typeof r.tag_name === "string")
      .map((r) => {
        const parts = splitBody(String(r.body || ""));
        return {
          tag: r.tag_name,
          name: String(r.name || r.tag_name),
          date: String(r.published_at || "").slice(0, 10),
          url: String(r.html_url || ""),
          bodyZh: parts.zh,
          bodyEn: parts.en,
        };
      });
    releasesCache = { at: now, payload: { ok: true, releases } };
    return releasesCache.payload;
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:152-174](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L152-L174)

两路由注册。

<details>
<summary>查看原文（23行）</summary>

```text
function apply(ctx) {
  ctx.inject(["webServer"], (webCtx) => {
    const sendJson = (res, body) => {
      const text = JSON.stringify(body);
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(text);
    };
    const routes = [
      { path: "/dsh-about/version", handler: async () => versionPayload(webCtx) },
      { path: "/dsh-about/releases", handler: async () => releasesPayload() },
    ];
    for (const route of routes) {
      webCtx.webServer.register({
        kind: "exact",
        path: route.path,
        handler: async (req, res) => sendJson(res, await route.handler()),
      });
    }
  });
}
```

</details>

**依据 4 · 作者声明**：[README.md:21-37](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/README.md#L21-L37)

作者机制概述。

<details>
<summary>查看原文（17行）</summary>

````text
## 工作原理

```
浏览器 "关于" 页
   │  fetch GET /dsh-about/version
   ▼
Host 半区 (lib/index.js)
   │  1. clientModules.clientPath('<任意官方插件>') → bundle 绝对路径
   │  2. 遍历路径中每一层 node_modules,反推 dsh 安装根目录
   │  3. fs 读取 @deepseek-ai/dsh/package.json,校验 name 后取 version
   ▼
JSON { ok, version, product, homepage, plugin }
```

版本号直接读取运行中安装的 `dsh` 包,因此**不需要硬编码路径**,且与 `dsh --version` 的输出保持一致。

“更新日志”块由浏览器请求 Host 半区的 `GET /dsh-about/releases`(Host 侧代理 GitHub Releases API,带 5 分钟缓存),默认展示最近 **5 条**,内容随界面语言显示中文/英文段;GitHub 不可达时显示“无法获取更新日志”并附 Releases 外链兜底。
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本和只读 HTTP 的声明有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

版本路径是启发式反推，并非查询运行中 dsh CLI 进程；多版本/打包布局不同可能找不到或读到非实际版本，源码不能证明 README 所称始终与 dsh --version 一致。两个路由 handler 未检查 req.method，POST 等也会返回只读数据，所谓 GET 端点只是约定；所有响应均 HTTP 200，失败放 JSON ok:false，前端不能只靠状态码识别。Releases 正文由第三方 API 提供，源码没有绑定到安装版本对应提交；过滤 draft 后也未限制最新 5 条在 Host，而是返回最多 20 项。无写配置副作用，但 GitHub 网络请求有隐私/可用性边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-69](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L25-L69)

路径候选启发式。

<details>
<summary>查看原文（45行）</summary>

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
  const anchors = [
    "@deepseek-ai/dsh-client-modules",
    "@deepseek-ai/dsh-client-runtime",
    "@deepseek-ai/dsh-client-connection",
    "@deepseek-ai/dsh-client-ui-theme",
  ];
  for (const anchor of anchors) {
    const bundle = clientModules.clientPath(anchor);
    if (typeof bundle !== "string" || bundle.length === 0) continue;
    const path = normalize(bundle);
    const candidates = [];
    let from = 0;
    for (;;) {
      const marker = path.indexOf("node_modules", from);
      if (marker < 0) break;
      candidates.push(`${path.slice(0, marker)}node_modules/@deepseek-ai/dsh/package.json`);
      from = marker + 1;
    }
    const tail = path.lastIndexOf("node_modules");
    if (tail >= 0) {
      candidates.push(`${path.slice(0, tail)}@deepseek-ai/dsh/package.json`);
    }
    for (const candidate of candidates) {
      try {
        const target = await fs.resolve(candidate);
        const text = await fs.readText(target);
        const manifest = JSON.parse(text);
        if (
          manifest &&
          manifest.name === "@deepseek-ai/dsh" &&
          typeof manifest.version === "string" &&
          manifest.version.length > 0
        ) {
          return manifest.version;
        }
      } catch (_) {
        // try the next candidate
      }
    }
  }
  return undefined;
```

</details>

**依据 2 · 作者声明**：[README.md:35-37](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/README.md#L35-L37)

作者一致性声明。

```text
版本号直接读取运行中安装的 `dsh` 包,因此**不需要硬编码路径**,且与 `dsh --version` 的输出保持一致。

“更新日志”块由浏览器请求 Host 半区的 `GET /dsh-about/releases`(Host 侧代理 GitHub Releases API,带 5 分钟缓存),默认展示最近 **5 条**,内容随界面语言显示中文/英文段;GitHub 不可达时显示“无法获取更新日志”并附 Releases 外链兜底。
```

**依据 3 · 源码核查**：[lib/index.js:111-145](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L111-L145)

远端 release 缓存和数量。

<details>
<summary>查看原文（35行）</summary>

```text
/** 内存缓存:5 分钟内不重复请求 GitHub。 */
let releasesCache = { at: 0, payload: null };
const CACHE_TTL_MS = 5 * 60 * 1000;

async function releasesPayload() {
  const now = Date.now();
  if (releasesCache.payload && now - releasesCache.at < CACHE_TTL_MS) {
    return releasesCache.payload;
  }
  try {
    const res = await fetch(RELEASES_URL, {
      headers: { accept: "application/vnd.github+json", "user-agent": "dsh-about" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`github http ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error("bad github payload");
    const releases = list
      .filter((r) => r && !r.draft && typeof r.tag_name === "string")
      .map((r) => {
        const parts = splitBody(String(r.body || ""));
        return {
          tag: r.tag_name,
          name: String(r.name || r.tag_name),
          date: String(r.published_at || "").slice(0, 10),
          url: String(r.html_url || ""),
          bodyZh: parts.zh,
          bodyEn: parts.en,
        };
      });
    releasesCache = { at: now, payload: { ok: true, releases } };
    return releasesCache.payload;
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:152-174](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L152-L174)

固定 200、无 method 判断。

<details>
<summary>查看原文（23行）</summary>

```text
function apply(ctx) {
  ctx.inject(["webServer"], (webCtx) => {
    const sendJson = (res, body) => {
      const text = JSON.stringify(body);
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(text);
    };
    const routes = [
      { path: "/dsh-about/version", handler: async () => versionPayload(webCtx) },
      { path: "/dsh-about/releases", handler: async () => releasesPayload() },
    ];
    for (const route of routes) {
      webCtx.webServer.register({
        kind: "exact",
        path: route.path,
        handler: async (req, res) => sendJson(res, await route.handler()),
      });
    }
  });
}
```

</details>

#### 缺口

- 未试多安装布局或宿主方法路由。
  **影响**：版本误读/错误响应的实际频率未知。
  **进一步探讨**：pnpm、全局、link 和多版本布局矩阵对照 CLI。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用所需依赖及运行成本有多大？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.0.4 MIT，Web profile、React/旧 Cordis peer；Host 需 clientModules/fs/webServer，浏览器需设置槽和 GitHub Releases 代理可达。版本读取是在本机寻找 package.json，日志请求最多 10 秒并缓存 5 分钟，显示失败有页面兜底。无持久存储，但每个实例访问设置页仍可能触发远端查询。README 的最低 DSH 版本是作者兼容说明，未在本轮运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-44](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/package.json#L1-L44)

包、Web 声明与 peer。

<details>
<summary>查看原文（44行）</summary>

```text
{
  "name": "dsh-about",
  "version": "0.0.4",
  "description": "为 DeepSeek Harness Web 设置面板添加“关于”页，展示当前运行的 DSH 版本、插件版本与项目主页。",
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "web",
    "about",
    "settings"
  ],
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [],
      "immediately": false
    }
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "react": "^18.2.0"
  }
```

</details>

**依据 2 · 作者声明**：[README.md:39-63](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/README.md#L39-L63)

作者安装门槛。

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

> 前置:DSH Web profile(`dsh web` / `--profile web`),dsh ≥ 0.1.1-rc.x

### 1. 一条命令安装 + 挂载

包内声明了 `dsh.bundle.patch`,CLI 会把它自动追加进 profile 的 bundle 堆栈,一次命令即可完成安装与挂载,**无需手工编辑任何 profile 文件**:

```bash
# 已发布到 npm 时:
dsh plugin --profile web add dsh-about

# 或直接从 GitHub 安装(未发布 npm 时):
dsh plugin --profile web add 'github:1010n111/dsh-about'
```

该命令等价于在 `$DSH_HOME/profiles/web` 目录执行 `pnpm add`,并同步
`dsh.profile.bundles`。

> 旧方法(手动挂载)不再需要:`dsh plugin add` 之后,请确认
> `$DSH_HOME/profiles/web/cordis.patch.yml` 中没有遗留的 dsh-about 挂载行。

### 2. 重启并查看

重启 `dsh web`,打开设置弹窗 → 左侧导航末尾的 **“关于”**,即可看到版本信息。
````

</details>

**依据 3 · 源码核查**：[lib/index.js:25-29](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L25-L29)

服务依赖。

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
  const anchors = [
```

**依据 4 · 源码核查**：[lib/index.js:111-145](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L111-L145)

网络超时/缓存。

<details>
<summary>查看原文（35行）</summary>

```text
/** 内存缓存:5 分钟内不重复请求 GitHub。 */
let releasesCache = { at: 0, payload: null };
const CACHE_TTL_MS = 5 * 60 * 1000;

async function releasesPayload() {
  const now = Date.now();
  if (releasesCache.payload && now - releasesCache.at < CACHE_TTL_MS) {
    return releasesCache.payload;
  }
  try {
    const res = await fetch(RELEASES_URL, {
      headers: { accept: "application/vnd.github+json", "user-agent": "dsh-about" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`github http ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error("bad github payload");
    const releases = list
      .filter((r) => r && !r.draft && typeof r.tag_name === "string")
      .map((r) => {
        const parts = splitBody(String(r.body || ""));
        return {
          tag: r.tag_name,
          name: String(r.name || r.tag_name),
          date: String(r.published_at || "").slice(0, 10),
          url: String(r.html_url || ""),
          bodyZh: parts.zh,
          bodyEn: parts.en,
        };
      });
    releasesCache = { at: now, payload: { ok: true, releases } };
    return releasesCache.payload;
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
```

</details>

#### 缺口

- 未运行目标 UI。
  **影响**：宿主槽位和代理成功率未知。
  **进一步探讨**：隔离 DSH Web 断网与版本矩阵验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让版本展示更适合故障诊断？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前可作为便利入口，但报告问题时仍附 dsh --version 和安装包路径。未实现的改进是假设由宿主直接暴露运行进程的包版本与 commit/来源，而不是从客户端 bundle 路径猜；对 Releases 加 fetch 时间、tag 匹配和明确错误 HTTP 状态。用多布局、离线、旧版/开发版样本测显示与运行版本一致率、诊断耗时和错误提示可理解性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-69](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L25-L69)

现行版本推断。

<details>
<summary>查看原文（45行）</summary>

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
  const anchors = [
    "@deepseek-ai/dsh-client-modules",
    "@deepseek-ai/dsh-client-runtime",
    "@deepseek-ai/dsh-client-connection",
    "@deepseek-ai/dsh-client-ui-theme",
  ];
  for (const anchor of anchors) {
    const bundle = clientModules.clientPath(anchor);
    if (typeof bundle !== "string" || bundle.length === 0) continue;
    const path = normalize(bundle);
    const candidates = [];
    let from = 0;
    for (;;) {
      const marker = path.indexOf("node_modules", from);
      if (marker < 0) break;
      candidates.push(`${path.slice(0, marker)}node_modules/@deepseek-ai/dsh/package.json`);
      from = marker + 1;
    }
    const tail = path.lastIndexOf("node_modules");
    if (tail >= 0) {
      candidates.push(`${path.slice(0, tail)}@deepseek-ai/dsh/package.json`);
    }
    for (const candidate of candidates) {
      try {
        const target = await fs.resolve(candidate);
        const text = await fs.readText(target);
        const manifest = JSON.parse(text);
        if (
          manifest &&
          manifest.name === "@deepseek-ai/dsh" &&
          typeof manifest.version === "string" &&
          manifest.version.length > 0
        ) {
          return manifest.version;
        }
      } catch (_) {
        // try the next candidate
      }
    }
  }
  return undefined;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:72-90](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L72-L90)

载荷缺安装路径/commit。

<details>
<summary>查看原文（19行）</summary>

```text
/** 组装 GET /dsh-about/version 的响应载荷。 */
async function versionPayload(ctx) {
  try {
    const version = await readDshVersion(ctx);
    if (version === undefined) {
      // 稳定错误码(不随语言变化),由 client 侧 about 字典翻译展示。
      return { ok: false, error: "unable to resolve dsh version" };
    }
    return {
      ok: true,
      version,
      product: "DeepSeek Harness",
      homepage: "https://github.com/deepseek-ai/deepseek-harness",
      plugin: { name: "dsh-about", version: PLUGIN_VERSION, repo: "https://github.com/1010n111/dsh-about" },
    };
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:111-174](https://github.com/1010n111/dsh-about/blob/febf7b0da6a2255ddfd84028c624ad9e4953dd83/lib/index.js#L111-L174)

远端代理与错误响应。

<details>
<summary>查看原文（64行）</summary>

```text
/** 内存缓存:5 分钟内不重复请求 GitHub。 */
let releasesCache = { at: 0, payload: null };
const CACHE_TTL_MS = 5 * 60 * 1000;

async function releasesPayload() {
  const now = Date.now();
  if (releasesCache.payload && now - releasesCache.at < CACHE_TTL_MS) {
    return releasesCache.payload;
  }
  try {
    const res = await fetch(RELEASES_URL, {
      headers: { accept: "application/vnd.github+json", "user-agent": "dsh-about" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`github http ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list)) throw new Error("bad github payload");
    const releases = list
      .filter((r) => r && !r.draft && typeof r.tag_name === "string")
      .map((r) => {
        const parts = splitBody(String(r.body || ""));
        return {
          tag: r.tag_name,
          name: String(r.name || r.tag_name),
          date: String(r.published_at || "").slice(0, 10),
          url: String(r.html_url || ""),
          bodyZh: parts.zh,
          bodyEn: parts.en,
        };
      });
    releasesCache = { at: now, payload: { ok: true, releases } };
    return releasesCache.payload;
  } catch (error) {
    return { ok: false, error: String((error && error.message) || error) };
  }
}

/**
 * 插件主体:等待 webServer 就绪后注册只读版本端点。
 * @param ctx - Host cordis 上下文。
 */
function apply(ctx) {
  ctx.inject(["webServer"], (webCtx) => {
    const sendJson = (res, body) => {
      const text = JSON.stringify(body);
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(text);
    };
    const routes = [
      { path: "/dsh-about/version", handler: async () => versionPayload(webCtx) },
      { path: "/dsh-about/releases", handler: async () => releasesPayload() },
    ];
    for (const route of routes) {
      webCtx.webServer.register({
        kind: "exact",
        path: route.path,
        handler: async (req, res) => sendJson(res, await route.handler()),
      });
    }
  });
}
```

</details>

#### 缺口

- 宿主直接版本源/状态码改进未实现。
  **影响**：不能算现有能力。
  **进一步探讨**：设计后对照真实版本矩阵。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
