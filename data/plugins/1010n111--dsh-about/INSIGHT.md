# dsh-about

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[22b3a79](https://github.com/1010n111/dsh-about/tree/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1010n111/dsh-about)
<!-- END META -->

> **功能**：为 DSH Web 设置页展示版本及上游更新日志。

> **亮点**：[Q02](#research-q02) 将包版本和 Release 聚合到设置页。

> **主要限制**：[Q03](#research-q03) 路径推导和缓存不证明实际进程、兼容或更新安全。

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
  - [Q01 · 关于页相比 CLI 帮用户做什么？](#detail-section-11)
  - [Q02 · 当前版本和更新日志从哪里取得？](#detail-section-12)
  - [Q03 · 展示版本和 Release 是否等于自动更新或安全判断？](#detail-section-13)
  - [Q04 · 使用和失败时需要什么条件？](#detail-section-14)
  - [Q05 · 如何帮助用户判断版本是否可信？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 设置页查看运行版本与更新日志的用户。

CLI 查看版本并在官方仓库查更新。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 版本定位 | 展示包版本 | 首个匹配不一定证明进程 |
| 更新日志 | 显示上游发布 | 成功结果缓存，网络依赖 |
| 错误提示 | 指出读取失败 | 可回 CLI 核实 |
| 更新判断 | 用户人工决策 | 不自动验证兼容性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web 及服务 | 必需 | 设置页和版本解析 | 返回错误或不可用 |
| 可读取包清单 | 版本必需 | 查 version | 无匹配时返回未知 |
| GitHub 网络 | 更新日志必需 | 拉取 Release | 失败并回外链 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在兼容 Web 宿主启用插件 | 设置页出现 |
| 查看 | 页面读取包版本与日志 | 错误时显示提示 |
| 核对 | 用户与 CLI 及官方信息对照 | 路径不一致时继续排查 |
| 决策 | 用户决定是否更新 | 不以列表单独证明兼容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 资源费用未知 | 安装配置时间未知 | 需兼容 Web 宿主 |
| 持续使用 | 网络请求与资源费用未知 | 版本核对时间未知 | 成功日志缓存五分钟 |
| 失败恢复 | 重试费用未知 | 核查进程和网络时间未知 | 多安装环境未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 版本显示 | 从候选包清单读取 | 多副本时是否对应进程 |
| 更新日志 | 请求并缓存 Release | 实时性和兼容性 |
| 错误提示 | 源码处理失败状态 | 实机可读性与用户决策改善 |

> **思考**：[Q03](#research-q03) 路径推导和缓存不证明实际进程、兼容或更新安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将包版本和 Release 聚合到设置页。

[Q02](#research-q02) 包名校验和缓存有限；首个候选不是完整运行验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 路径推导和缓存不证明实际进程、兼容或更新安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 版本异常时与 CLI、进程路径和官方资料核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行宿主或访问 GitHub。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态核查；未运行目标或访问网络。
- 下一步：隔离多安装、离线与缓存过期场景并对照实际进程。

**分析版本**

- **仓库**：[1010n111/dsh-about](https://github.com/1010n111/dsh-about)
- **版本号**：0.0.5（[固定提交 22b3a79](https://github.com/1010n111/dsh-about/tree/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照现有错误及来源标签验证路径与时间展示。

隔离多安装、离线与缓存过期场景并对照实际进程。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1207 | 1011 | 131 | — |
| .md | source | 1 | 96 | — | — | 930 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1010n111/dsh-about/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1010n111/dsh-about/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查版本定位、Release 代理和诊断边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 关于页相比 CLI 帮用户做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH Web 用户可在设置页查看推导的包版本及 Release 列表；CLI 版本命令和仓库 Release 页面已有同类信息。免切换的收益未测，版本显示不等于升级成功或兼容性保证。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-18](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/README.md#L1-L18)

作者描述版本、更新日志和错误显示。

<details>
<summary>查看原文（18行）</summary>

```text
# dsh-about

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面添加一个 **“关于”** 设置页,展示当前运行的 DSH 版本、插件自身版本、项目主页与版本来源。UI 完全复用设置面板的设计规范(`--dsw-alias-*` 主题 token,深浅主题自适应)。

## 特性

- 设置弹窗左侧导航新增 **“关于”** 菜单项,固定在导航**最后一项**(`order: Number.POSITIVE_INFINITY`,其他插件新增菜单也不会排在它后面)
- 界面**中英双语**:跟随 DSH 设置面板语言(通用设置 → Language,切换即时生效),无需语言服务时按浏览器语言兜底
- “关于”页展示:
  | 行 | 内容 |
  |---|---|
  | 版本 | 当前运行的 DSH 版本(与 `dsh --version` 一致) |
  | 插件版本 | `dsh-about · v0.0.5`(与 package.json 同步) |
  | 插件仓库 | `github.com/1010n111/dsh-about` 外链 |
  | 项目主页 | deepseek-harness 仓库外链 |
  | 版本来源 | `@deepseek-ai/dsh` |
  | 更新日志 | 拉取 deepseek-harness 的 **GitHub Releases**(默认显示最近 5 条),当前运行版本置顶高亮,单条可展开/收起;失败时给出外链兜底 |
- 加载中显示 `…`,读取失败显示 `—` 并给出具体错误文本,便于诊断
```

</details>

#### 缺口

- 无用户对照
  **影响**：无法量化节时
  **进一步探讨**：比较 CLI/网页与设置页的定位时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前版本和更新日志从哪里取得？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host 通过多个 client bundle 路径遍历 node_modules 候选，读取 package.json 并校验包名和非空 version，首个匹配即返回，所有候选失败返回未知；这是一种路径推导，不是对运行二进制的独立证明。Release 代理请求 GitHub 并将成功结果缓存五分钟，错误返回错误对象。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-28](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L25-L28)

依赖 host 服务。

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
```

**依据 2 · 源码核查**：[lib/index.js:35-69](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L35-L69)

候选与包名校验及回退。

<details>
<summary>查看原文（35行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/index.js:111-144](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L111-L144)

Release 缓存和失败。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

#### 缺口

- 未运行不同安装布局
  **影响**：不能保证候选恒指向实际运行包
  **进一步探讨**：在多层 node_modules、缺服务及链接安装环境对照真实进程。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 展示版本和 Release 是否等于自动更新或安全判断？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

该路径返回包清单版本和 GitHub release 信息，客户端错误时显示失败及外链；未见安装、版本兼容性或安全判断。首个匹配候选在多副本安装时可能不同于实际进程，缓存可短时过期。不能仅凭最新发布条目判断应升级。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:51-69](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L51-L69)

首个合法包清单返回。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:111-144](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L111-L144)

缓存及远程错误。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:265-277](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/client.js#L265-L277)

Release 客户端错误。

<details>
<summary>查看原文（13行）</summary>

```text
      React.useEffect(function () {
        var cancelled = false;
        fetchReleases()
          .then(function (data) {
            if (cancelled) return;
            if (!data || data.ok === false) throw new Error((data && data.error) || "bad response");
            var releases = data.releases;
            if (!Array.isArray(releases)) throw new Error("bad response");
            setState({ phase: "ready", releases: releases, expanded: {} });
          })
          .catch(function (err) {
            if (cancelled) return;
            setState({ phase: "error", error: String((err && err.message) || err) });
```

</details>

#### 缺口

- 未核查所有安装布局及 Release 内容真实性
  **影响**：不能保证版本对应或更新适配
  **进一步探讨**：核对进程与包路径，再检查官方兼容说明。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用和失败时需要什么条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 的 webServer、clientModules 和 fs 服务；更新日志需要 host 可访问 GitHub。失败时界面给错误和外链，可回 CLI 与官方 Release 核查，网络、隐私及多安装路径行为未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-28](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L25-L28)

定位依赖。

```text
async function readDshVersion(ctx) {
  const clientModules = ctx.get("clientModules");
  const fs = ctx.get("fs");
  if (clientModules === undefined || fs === undefined) return undefined;
```

**依据 2 · 源码核查**：[lib/index.js:72-89](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L72-L89)

版本失败返回错误。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:377-389](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/client.js#L377-L389)

客户端呈现错误。

<details>
<summary>查看原文（13行）</summary>

```text
      React.useEffect(function () {
        var cancelled = false;
        fetchVersion()
          .then(function (data) {
            if (cancelled) return;
            if (!data || data.ok === false) {
              setState({ phase: "error", error: (data && data.error) || t("error.unknown") });
              return;
            }
            setState({ phase: "ready", version: data.version, product: data.product || "", homepage: data.homepage || "", plugin: data.plugin || null });
          })
          .catch(function (err) {
            if (!cancelled) setState({ phase: "error", error: String((err && err.message) || err) });
```

</details>

#### 缺口

- 未运行宿主或网络
  **影响**：不能证明兼容性和实时性
  **进一步探讨**：对照 CLI、运行进程路径和离线行为。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户判断版本是否可信？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有页面已有失败文本、Release 外链和版本来源标签，是直接反证；假设可显示所匹配 manifest 路径及读取时间以辅助用户决定是否回 CLI 核对。对照现有界面，在单安装、多副本、缺失及旧缓存下测错误版本判断、误报、定位时间及路径泄露风险；无改善、误导或隐私成本抵消收益则否定。未穷尽宿主其他诊断入口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:51-69](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L51-L69)

候选命中路径不随版本返回。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:72-89](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/lib/index.js#L72-L89)

失败状态。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[README.md:12-18](https://github.com/1010n111/dsh-about/blob/22b3a795d9ee08e86b5ab9d2c79c18437c3706e6/README.md#L12-L18)

已有版本来源及错误展示。

```text
  | 版本 | 当前运行的 DSH 版本(与 `dsh --version` 一致) |
  | 插件版本 | `dsh-about · v0.0.5`(与 package.json 同步) |
  | 插件仓库 | `github.com/1010n111/dsh-about` 外链 |
  | 项目主页 | deepseek-harness 仓库外链 |
  | 版本来源 | `@deepseek-ai/dsh` |
  | 更新日志 | 拉取 deepseek-harness 的 **GitHub Releases**(默认显示最近 5 条),当前运行版本置顶高亮,单条可展开/收起;失败时给出外链兜底 |
- 加载中显示 `…`,读取失败显示 `—` 并给出具体错误文本,便于诊断
```

#### 缺口

- 未实测多副本和用户决策
  **影响**：无法证明该展示有收益
  **进一步探讨**：隔离安装对照现有页面与路径提示。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
