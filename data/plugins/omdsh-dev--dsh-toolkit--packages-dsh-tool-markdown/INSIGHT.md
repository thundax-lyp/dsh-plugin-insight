# dsh-tool-markdown

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中转换 HTML 和 Markdown、整理表格并生成目录。

> **亮点**：[Q01](#research-q01) 确认四种常用文档动作直接在会话执行，输出可核对的文本。

> **主要限制**：[Q02](#research-q02) 的基址拼接、协议相对链接和围栏状态会改变链接或目录，发布前需要独立复核。

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
  - [Q01 · 从公开 HTML 片段如何得到可编辑文本？](#detail-section-11)
  - [Q02 · 链接白名单与目录生成何时会留下需要修订的结果？](#detail-section-12)
  - [Q03 · 如何试用并检验更准确的链接恢复是否值得？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：撰写技术笔记的人可把公开页面片段转成可编辑的 Markdown、表格或目录草案。

现有文档转换器可离线保留更完整的格式，人工复制适合少量内容和页面正文筛选。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| HTML/Markdown 转换 | 整理公开片段 | 链接需要复核 |
| 表格规范化 | 生成可编辑的 GFM | 适合小型片段 |
| 目录 | 给标题生成锚点 | 围栏及最终渲染需检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Cordis 与 tools | 是 | 挂载转换器 | 保留已有工具 |
| 可记录的公开小样本 | 本建议要求 | 限制会话数据暴露 | 在本地转换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离 profile 核对 markdown | 确认工具出现 |
| 转换 | Agent 传入公开片段 | 返回可编辑结果 |
| 验收 | 用户检查链接、表格及目录 | 偏差影响交付时换转换器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和包，费用未知 | 核对 profile 与数据范围 | 固定包加载待验 |
| 持续 | 模型传参与进程内转换，金额未知 | 人工抽查链接与锚点 | 修订耗时待对照 |
| 失败恢复 | 重新转换，金额未知 | 保留原片段转离线工具 | 宿主退出待核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文本转写 | 四种动作有具体实现 | 真实保真率与节时 |
| 链接与目录 | 过滤部分协议并生成锚点 | 与目标渲染器是否一致 |

> **思考**：[Q02](#research-q02) 的基址拼接、协议相对链接和围栏状态会改变链接或目录，发布前需要独立复核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 确认四种常用文档动作直接在会话执行，输出可核对的文本。

[Q02](#research-q02) 的 HTML 转义与协议过滤可独立审查，但简单 URL 拼接不具备标准基址语义，目录围栏无类型匹配。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的基址拼接、协议相对链接和围栏状态会改变链接或目录，发布前需要独立复核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 可对公开片段试用，按 [Q02](#research-q02) 独立检查链接和目录。正式发布或含私密材料时沿用本地流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持转换分支与文本结果。链接反例来自固定源码推断，真实渲染及任务收益待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-markdown/package.json、packages/dsh-tool-markdown/cordis.patch.yml、packages/dsh-tool-markdown/lib/index.js、packages/dsh-tool-markdown/README.md、packages/dsh-tool-markdown/lib/md2html.js、packages/dsh-tool-markdown/lib/toc.js 及固定范围 inventory；组件：packages/dsh-tool-markdown。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读固定子包的挂载、动作分发、链接输出和目录处理；未执行插件、测试或宿主。
- 下一步：在隔离 profile 对照文件型与目录型基址、跨站链接、混合围栏及普通表格，并验证禁用后的工具列表。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出按标准解析基址并分开判定跨站策略，用固定链接样本验证是否减少错误。

在隔离 profile 对照文件型与目录型基址、跨站链接、混合围栏及普通表格，并验证禁用后的工具列表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1115 | 961 | 167 | — |
| .md | source | 2 | 284 | — | — | 2354 |
| .ts | source | 8 | 1126 | 873 | 174 | — |
| .ts | test | 5 | 437 | 362 | 19 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：将公开网页片段整理成团队 Markdown 笔记时，会话工具能保留哪些结构，哪些链接和目录要人工复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从公开 HTML 片段如何得到可编辑文本？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

准备技术笔记的用户可把公开 HTML 片段交给 markdown。注册接收 html2md、md2html、table 与 toc 等动作。分发器先检查对应文本的字节大小，进入各自函数；工具以字符串返回结果，取到的是可编辑的片段而非已部署网页。作者说明 html2md 不做正文识别，网页的导航与页脚可能仍需手工删选。对同一片段反复转换时，确定规则减少让模型自行拼表和实体的变量；已有 Pandoc 等程序可做更丰富的格式转换，插件增量是会话直接使用有限文本函数。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-markdown/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/package.json#L21-L38)

声明 Cordis、tools 与 invariants peer，bundle 指向补丁，默认导出指向 lib/index.js。

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-markdown/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/cordis.patch.yml#L1-L4)

按固定包名插入 tool-markdown。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-markdown
      name: '@deepseek-ai/dsh-tool-markdown'
```

**依据 3 · 源码核查**：[packages/dsh-tool-markdown/lib/index.js:66-77](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/index.js#L66-L77)

注入 tools 并注册 markdown。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'markdown',
        description: 'Markdown utilities over text (zero-dependency, pure functions). ' +
            'Actions: html2md (HTML to GFM Markdown: main content, tables, links; ' +
            'script/style/iframe content stripped), md2html (Markdown to whitelisted ' +
            'safe HTML: only p/h1-h6/ul/ol/li/blockquote/pre/code/a/img/strong/em/br/hr/table; ' +
            'all text is HTML-escaped, javascript:/data: links degrade to plain text), ' +
            'table (normalize HTML <table> or pipe-delimited text to a GFM table), ' +
            'toc (generate a nested TOC with anchors from Markdown headings). ' +
            'Inputs over maxBytes (default 256000, ceiling 1000000) are rejected. ' +
            'Do not pass HTML containing secrets (tool arguments are recorded in session logs).',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-markdown/lib/index.js:106-113](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/index.js#L106-L113)

注册回调进入本包实际执行逻辑并呈现回执。

```text
        output: {
            schema: { type: 'string' },
            render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: args => Promise.resolve(runAction(args)),
        timeoutMs: 2000,
    }));
}
```

**依据 5 · 源码核查**：[packages/dsh-tool-markdown/lib/index.js:21-64](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/index.js#L21-L64)

输入门槛及四种动作的实际分发。

<details>
<summary>查看原文（44行）</summary>

```text
const DEFAULT_MAX_BYTES = 256_000;
const HARD_MAX_BYTES = 1_000_000;
function normalizeMaxBytes(maxBytes) {
    if (typeof maxBytes !== 'number' || !Number.isFinite(maxBytes) || maxBytes < 1) {
        return DEFAULT_MAX_BYTES;
    }
    const n = Math.floor(maxBytes);
    if (n > HARD_MAX_BYTES) {
        throw new Error(`markdown: maxBytes cannot exceed ${HARD_MAX_BYTES}`);
    }
    return n;
}
function assertSize(input, maxBytes, label) {
    if (typeof input !== 'string') {
        throw new Error(`markdown: ${label} must be a string`);
    }
    const bytes = utf8ByteLength(input);
    if (bytes > maxBytes) {
        throw new Error(`markdown: ${label} exceeds ${maxBytes} bytes (got ${bytes})`);
    }
}
function runAction(args) {
    const maxBytes = normalizeMaxBytes(args.maxBytes);
    const baseUrl = typeof args.baseUrl === 'string' && args.baseUrl !== '' ? args.baseUrl : undefined;
    switch (args.action) {
        case 'html2md': {
            assertSize(args.html, maxBytes, 'html');
            return html2md(args.html, { baseUrl });
        }
        case 'md2html': {
            assertSize(args.markdown, maxBytes, 'markdown');
            return md2html(args.markdown, { baseUrl });
        }
        case 'table': {
            assertSize(args.text, maxBytes, 'text');
            return normalizeTable(args.text, { baseUrl });
        }
        case 'toc': {
            assertSize(args.markdown, maxBytes, 'markdown');
            return toc(args.markdown);
        }
        default:
            throw new Error(`markdown: unknown action "${args.action}"`);
    }
```

</details>

**依据 6 · 作者声明**：[packages/dsh-tool-markdown/README.md:9-21](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/README.md#L9-L21)

作者说明文档任务和范围。

<details>
<summary>查看原文（13行）</summary>

```text
## 动机

模型最常见的文档场景：用户贴一段 HTML（网页源码、邮件、导出文件）、贴表格要求整理、或要求"转成 markdown"。没有工具时模型只能硬编码处理——HTML 实体会错、表格会乱、网页噪音（导航/脚本/广告）会混入。本插件提供确定性转换，与 `dsh-tool-csv` 互补：**csv 管结构化表格，markdown 管文档/网页**。

## 安全模型

- **零依赖**：手写递归下降 HTML 解析器（不引入 cheerio/jsdom——净增数十 MB 且是攻击面）
- **零执行面**：不 eval、不 new Function、不加载远程资源、不解析 CSS 布局
- **内容剥离**：script/style/iframe/object/noscript 内容整体剥离（安全 + 噪音）
- **md2html 白名单**：只输出 `p h1-h6 ul ol li blockquote pre code a img strong em br hr table thead tbody tr th td`；文本一律 HTML 转义——markdown 内嵌 `<script>` 只会显示为文本
- **链接 scheme 白名单**：`http/https/mailto`；`javascript:`/`data:` 链接降级为纯文本
- **资源上限**：嵌套深度 64 层报错（防栈溢出）；输入 `maxBytes` 默认 256KB、硬顶 1MB（超限报错不截断）
- 工具参数会记入会话日志，**不要传入含密钥/会话数据的 HTML**
```

</details>

**依据 7 · 作者声明**：[packages/dsh-tool-markdown/README.md:38-43](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/README.md#L38-L43)

正文识别、表格和目录的作者边界。

```text
| action | 功能 |
|---|---|
| `html2md` | HTML → GFM Markdown：块级/行内全映射、表格转 GFM（colspan 占位补齐）、实体解码、script/style 剥离、链接 scheme 过滤（**不做 readability 正文选择**，nav/header/footer 默认透传） |
| `md2html` | Markdown → 白名单安全 HTML：全文本转义，无标签可逃逸 |
| `table` | HTML `<table>` 或**含未转义 `\|`** 的管道分隔文本 → GFM 表格（列补齐、`\|` 转义、分隔行识别；无管道输入报错） |
| `toc` | Markdown 标题 → 嵌套目录列表（简化 GitHub 风格锚点：重复标题自动 -1/-2 后缀、跳过代码围栏内伪标题） |
```

#### 缺口

- 真实文档任务的表格保真率和修订时间
  **影响**：不能判定实际节时
  **进一步探讨**：以同批公开片段对比人工整理与已有转换器

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 链接白名单与目录生成何时会留下需要修订的结果？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

HTML 输出路径会转义文本和属性，允许 http、https、mailto 和无协议的链接。提供 baseUrl 时，代码将基址末尾斜杠去掉后直接拼接。对基址 https://example.test/docs/a.html 和相对 b.html，静态推断输出路径落在 a.html/b.html，而浏览器按文档基址解析会落在 /docs/b.html。没有 baseUrl 时协议相对链接也被放行，方案白名单不等于同站限制。目录另用布尔值翻转围栏状态，正则不区分开启与关闭的围栏种类及长度，含嵌套示例时可能漏标题或收进伪标题。转换结果可做文稿草案，不能视为发布前链接或导航验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-markdown/lib/md2html.js:16-45](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/md2html.js#L16-L45)

scheme 白名单、直接拼接与属性转义。

<details>
<summary>查看原文（30行）</summary>

```text
function normalizeUrl(raw) {
    return raw.replace(/[\u0000-\u001f\u007f]/g, '').trim();
}
/** scheme 白名单（大小写不敏感，审查 MD-02）；无 scheme 视为相对路径。 */
function safeScheme(rawUrl) {
    const url = normalizeUrl(rawUrl);
    if (url === '')
        return false;
    const m = SCHEME_RE.exec(url);
    if (!m)
        return true; // 相对路径（无 scheme；协议相对 //host 属此类）
    const scheme = m[1].toLowerCase();
    return scheme === 'http' || scheme === 'https' || scheme === 'mailto';
}
function resolveUrl(href, baseUrl) {
    const h = normalizeUrl(href);
    if (baseUrl === undefined || h === '' || SCHEME_RE.test(h))
        return h;
    const base = baseUrl.replace(/\/+$/, '');
    if (h.startsWith('/'))
        return base + h;
    return `${base}/${h}`;
}
export function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-markdown/lib/md2html.js:117-131](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/md2html.js#L117-L131)

拼接结果进入 href。

<details>
<summary>查看原文（15行）</summary>

```text
        // 链接 [text](url)
        if (c === '[') {
            const close = input.indexOf('](', i + 1);
            if (close !== -1) {
                const closeEnd = scanUrlEnd(input, close + 2);
                if (closeEnd !== -1) {
                    const text = input.slice(i + 1, close);
                    const url = resolveUrl(input.slice(close + 2, closeEnd).split(/\s+/)[0] ?? '', options.baseUrl);
                    i = closeEnd + 1;
                    if (url !== '' && safeScheme(url)) {
                        out += `<a href="${escapeHtml(url)}">${escapeHtml(text)}</a>`;
                    }
                    else {
                        out += escapeHtml(text);
                    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-markdown/lib/toc.js:27-51](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/toc.js#L27-L51)

围栏翻转及标题提取。

<details>
<summary>查看原文（25行）</summary>

````text
const FENCE_RE = /^```|^~~~/;
/** 从 Markdown 提取标题序列（跳过 fenced code 内的伪标题；重复锚点递增）。 */
export function extractHeadings(markdown) {
    const entries = [];
    const seen = new Map();
    let inFence = false;
    for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
        if (FENCE_RE.test(line.trimStart())) {
            inFence = !inFence;
            continue;
        }
        if (inFence)
            continue;
        // 尾部闭合井号仅在前有空白时剥离（`# C#` → 文本 "C#"）
        const m = /^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/.exec(line);
        if (m) {
            const text = m[2].trim();
            if (text === '')
                continue;
            const base = slugify(text);
            const count = seen.get(base) ?? 0;
            seen.set(base, count + 1);
            const anchor = count === 0 ? base : `${base}-${count}`;
            entries.push({ level: m[1].length, text, anchor });
        }
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并检验更准确的链接恢复是否值得？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

兼容 Cordis/tools 且目标 profile 能解析 bundle 后，可用公开片段先转换成草案，逐个比对链接目的地、表格列和目录锚点。参数进入会话记录是作者警示，源 HTML 中的密钥、cookie 与个人材料不进入试用。若要发布或做大规模转换，保留原件并使用现成渲染器和链接检查。可验证的改动是按标准 URL 解析相对引用，并显式选择是否接受跨站目标；用同一组文件型基址与协议相对链接比较错误链接数量、可解释的拒绝和任务耗时。若结果与目标渲染器一致性没有提高，则维持现有人工检查。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-markdown/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/package.json#L2-L11)

私有子包及 Node 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-markdown",
  "description": "DSH Markdown tool: HTML-to-Markdown conversion, whitelisted Markdown-to-HTML, GFM table normalization, TOC generation. Zero-dependency lightweight parsers.",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-markdown/lib/index.js:66-77](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/index.js#L66-L77)

工具输入范围和参数记录提醒。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'markdown',
        description: 'Markdown utilities over text (zero-dependency, pure functions). ' +
            'Actions: html2md (HTML to GFM Markdown: main content, tables, links; ' +
            'script/style/iframe content stripped), md2html (Markdown to whitelisted ' +
            'safe HTML: only p/h1-h6/ul/ol/li/blockquote/pre/code/a/img/strong/em/br/hr/table; ' +
            'all text is HTML-escaped, javascript:/data: links degrade to plain text), ' +
            'table (normalize HTML <table> or pipe-delimited text to a GFM table), ' +
            'toc (generate a nested TOC with anchors from Markdown headings). ' +
            'Inputs over maxBytes (default 256000, ceiling 1000000) are rejected. ' +
            'Do not pass HTML containing secrets (tool arguments are recorded in session logs).',
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-markdown/README.md:76-92](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/README.md#L76-L92)

作者兼容与安装声明。

<details>
<summary>查看原文（17行）</summary>

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis@^4.0.1` + `@deepseek-ai/dsh-tools@>=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants@>=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）


## 安装

插件源码仓库：`https://github.com/omdsh-dev/dsh-tool-markdown`（public）。

### Profile Bundle（推荐）

将本插件作为独立 bundle 安装到 profile（DSH 0.1.5-rc.1，npm）：
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-markdown/lib/md2html.js:24-37](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-markdown/lib/md2html.js#L24-L37)

接受无协议链接，当前拼接规则。

<details>
<summary>查看原文（14行）</summary>

```text
    const m = SCHEME_RE.exec(url);
    if (!m)
        return true; // 相对路径（无 scheme；协议相对 //host 属此类）
    const scheme = m[1].toLowerCase();
    return scheme === 'http' || scheme === 'https' || scheme === 'mailto';
}
function resolveUrl(href, baseUrl) {
    const h = normalizeUrl(href);
    if (baseUrl === undefined || h === '' || SCHEME_RE.test(h))
        return h;
    const base = baseUrl.replace(/\/+$/, '');
    if (h.startsWith('/'))
        return base + h;
    return `${base}/${h}`;
```

</details>

#### 缺口

- 固定子包的装载、真实宿主记录和退出尚待核对
  **影响**：限制采用及数据范围
  **进一步探讨**：用隔离 profile 核对工具、回执和禁用后清单

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
