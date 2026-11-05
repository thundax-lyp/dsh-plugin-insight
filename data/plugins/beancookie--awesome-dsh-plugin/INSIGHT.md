# Awesome DSH Plugin 目录

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[6cdd62f](https://github.com/beancookie/awesome-dsh-plugin/tree/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85)

<!-- BEGIN META -->
[![GitHub ★ 188](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=188&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/beancookie/awesome-dsh-plugin) [![npm 30d 1,643](https://img.shields.io/static/v1?label=npm+30d&message=1%2C643&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)
<!-- END META -->

> **功能**：从双语 README 生成 DSH 插件分类站点、订阅源与机器可读索引。

> **亮点**：[Q01](#research-q01) 将人工条目和分类同时提供给读者与索引消费者。

> **主要限制**：[Q03](#research-q03) 安装命令是缓存和字符串匹配生成的入口，真实包及兼容仍需单独核对。

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
  - [Q01 · 找插件的人可从这份目录获得什么？](#detail-section-11)
  - [Q02 · 双语条目怎样进入站点和注册表？](#detail-section-12)
  - [Q03 · 有 npm 安装命令是否代表可安装？](#detail-section-13)
  - [Q04 · 这份目录可以如何采用？](#detail-section-14)
  - [Q05 · 区分未发现与未核实能否减少错误安装？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：找 DSH 插件的读者可以从双语分类目录建立候选名单。

GitHub 主题搜索覆盖不同来源，但缺目录维护者的双语分类与 JSON 形式。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 双语目录 | 发现插件候选 | 缺翻译可能被排除 |
| 注册表 | 供其他客户端读取 | 收录并无宿主兼容保证 |
| 安装线索 | 定位 npm 或 GitHub | 需要独立核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定 README 或生成页面 | 浏览必需 | 发现候选 | 改查另一目录 |
| Node 与外部 API | 维护刷新需要 | 探测包与仓库 | 保留未知或已有缓存 |
| 目标组件审阅 | 采用条目前 | 核对包和宿主版本 | 不要仅凭命令安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 查找 | 按类别选候选 | 记录完整 URL |
| 核实 | 查看固定入口和包来源 | 不匹配就跳过 |
| 退出 | 保留候选或换来源 | 无需更改宿主 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览资源开销未知 | 查找耗时未知 | 固定目录可独立读 |
| 持续 | 站点与请求消耗未知 | 核对缓存和条目耗时未知 | 缓存可能延期 |
| 失败 | 重新探测开销未知 | 比对来源耗时未知 | 无需变更宿主 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一目录 | 双语条目与 JSON 可生成 | 实际覆盖与省时 |
| 安装线索 | 按 npm 缓存生成入口 | 可安装性与版本匹配 |

> **思考**：[Q03](#research-q03) 安装命令是缓存和字符串匹配生成的入口，真实包及兼容仍需单独核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将人工条目和分类同时提供给读者与索引消费者。

双语按 URL 做连接，保留空指标而不当成已核实。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 安装命令是缓存和字符串匹配生成的入口，真实包及兼容仍需单独核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用作候选列表，安装前重新确认目标仓库与包。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持解析、双语合并及生成逻辑；未运行站点或安装任何条目。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/build-site.mjs、scripts/readme.mjs、scripts/probe-npm.mjs、.github/workflows/build-site.yml、scripts/probe-stars.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定目录、生成和探测源码，未运行目标脚本或插件。
- 下一步：以缺翻译、子路径和网络失败的样本检查覆盖与生成命令。

**分析版本**

- **仓库**：[beancookie/awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin)
- **版本号**：0.1.0（[固定提交 6cdd62f](https://github.com/beancookie/awesome-dsh-plugin/tree/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 显示缺包与未核实的区别，测试是否减少选错来源。

以缺翻译、子路径和网络失败的样本检查覆盖与生成命令。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1413 | — | — | 40425 |
| .mjs | source | 6 | 755 | 607 | 125 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/beancookie/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查目录覆盖和生成的安装入口如何受双语合并及缓存影响。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 找插件的人可从这份目录获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

读者可按双语类别浏览条目，程序可消费 plugins.json 的描述、地址、指标和安装命令。与手查 GitHub 主题相比，目录提供作者维护的分类和统一数据。README 中的会话内检索安装由另一个仓库提供；根包只声明 README 打包，因此它是资源目录。目录里条目数不能直接当成可用插件数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-35](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/README.md#L18-L35)

目录定位及独立市场链接

<details>
<summary>查看原文（18行）</summary>

```text
> [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）插件精选列表。

DeepSeek Harness 是 DeepSeek 开源的 agent harness——既是可直接运行的 Coding Agent（提供 Web 与 headless 两种形式），底层又是一套「一切皆插件」的框架：模型、工具、沙箱、会话存储、UI、乃至 Agent Loop 本身都是插件。插件既可以扩展官方 Coding Agent，也可以替换其核心部件，甚至组装出完全不同的东西。

<p align="center">
  推荐使用 <a href="https://github.com/beancookie/dsh-plugin-registry">dsh-plugin-registry</a> —— 会话内检索并一键安装本列表插件，Web 设置页带「插件市场」面板。
</p>

<details>
<summary align="center">📸 点击查看演示截图</summary>

<p align="center">
  <img src="images/dsh-plugin-registry.png" alt="dsh-plugin-registry" width="600">
</p>

</details>

**504** 个插件 · 欢迎 [PR](#贡献)
```

</details>

**依据 2 · 源码核查**：[package.json:1-12](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/package.json#L1-L12)

包只声明 README 发布内容

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "awesome-dsh-plugin",
  "version": "0.1.0",
  "description": "A curated list of DeepSeek Harness (dsh) plugins · DeepSeek Harness 插件精选列表",
  "homepage": "https://beancookie.github.io/awesome-dsh-plugin",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/awesome-dsh-plugin/awesome-dsh-plugin.git"
  },
  "license": "CC0-1.0",
  "files": ["README.md", "README.en.md"],
  "keywords": ["awesome", "awesome-list", "dsh", "dsh-plugin", "deepseek-harness", "deepseek"]
```

</details>

**依据 3 · 源码核查**：[scripts/build-site.mjs:281-312](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/build-site.mjs#L281-L312)

生成公开 JSON 注册表

<details>
<summary>查看原文（32行）</summary>

```text
// Public registry API: /plugins.json — deterministic; consumed by the find
// plugin, the site, and any third-party storefront (Pages serves CORS *).
const registry = {
  name: 'awesome-dsh-plugin',
  url: ORIGIN,
  source: 'https://github.com/beancookie/awesome-dsh-plugin',
  updated: [...ordered].map((e) => e.added).sort().pop(),
  count: N,
  categories: Object.fromEntries(CAT_IDS.map((id) => [id, Object.fromEntries(LOCALES.map((l) => [l.code, l.categories[id]]))])),
  plugins: ordered.map((e) => {
    // Registry installs beat full-repo GitHub tarballs (smaller, prebuilt, CDN);
    // the probe (scripts/probe-npm.mjs) only maps packages whose repository
    // field points back at the listed repo.
    const npm = npmMap[e.url]?.npm ?? null
    return {
      // READMEs render "owner/name" for human disambiguation; machine
      // consumers (find-plugin, dsh-market) match on the bare plugin name,
      // with `owner` as its own field.
      name: e.name.includes('/') ? e.name.slice(e.name.indexOf('/') + 1) : e.name,
      owner: e.owner,
      url: e.url,
      category: e.cat,
      description: Object.fromEntries(LOCALES.map((l) => [l.code, e.descs[l.code]])),
      npm,
      stars: e.stars ?? null,
      createdAt: e.createdAt ?? null,
      install: installCmd(e),
      added: e.added,
    }
  }),
}
fs.writeFileSync('docs/plugins.json', JSON.stringify(registry, null, 1) + '\n')
```

</details>

#### 缺口

- 缺独立目录查全对照
  **影响**：不能推断代表整个生态
  **进一步探讨**：抽取同一任务的候选与其他来源比较

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 双语条目怎样进入站点和注册表？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

解析器只读取匹配格式的 GitHub 项和已知分类；用原始 URL 作键，同一 URL 后写覆盖前写。站点以默认语言为候选主表，再逐个语言按 URL 查找，缺翻译时写错误并不加入 entries。排序把树路径归到仓库名，仍以完整 URL 作同仓库排序补充。结果生成站点、订阅及注册表，显示日期来自加入日期账本。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/readme.mjs:12-37](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/readme.mjs#L12-L37)

解析和 URL 键

<details>
<summary>查看原文（26行）</summary>

```text
export const CAT_IDS = ['ui', 'theme', 'session', 'memory', 'tools', 'skill', 'workflow', 'notify', 'model', 'dev', 'fun']

// repo identifier for alphabetical ordering; monorepo /tree/ paths fold into
// their owner/repo, with the full path as the deterministic tie-break.
export const sortKey = (url) => url.replace(/^https:\/\/github\.com\//, '').replace(/\/tree\/.*$/, '').toLowerCase()

export const cmpByKey = (aUrl, bUrl) =>
  sortKey(aUrl).localeCompare(sortKey(bUrl), 'en') || aUrl.toLowerCase().localeCompare(bUrl.toLowerCase(), 'en')

// url -> {name, url, desc, cat, line} for every parseable plugin line.
export function parseReadme(readmePath, categories) {
  const text = fs.readFileSync(readmePath, 'utf8')
  const out = new Map()
  let cat = null
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h = line.match(/^#{2,3} (.+)$/)
    if (h) {
      cat = CAT_IDS.find((id) => h[1].includes(categories[id])) ?? null
      continue
    }
    const m = line.match(/^- \[(.+?)\]\((https:\/\/github\.com\/[^)]+)\) [—-] (.+)$/)
    if (m && cat) out.set(m[2], { name: m[1], url: m[2], desc: m[3], cat, line: i + 1 })
  }
  return out
```

</details>

**依据 2 · 源码核查**：[scripts/build-site.mjs:29-57](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/build-site.mjs#L29-L57)

双语合并、排除、排序与日期

<details>
<summary>查看原文（29行）</summary>

```text
// Join all locales on plugin URL; the default locale defines the roster.
const parsed = LOCALES.map((loc) => ({ loc, entries: parseReadme(loc.readme, loc.categories) }))
const [base, ...others] = parsed
const starsMap = fs.existsSync(STARS_FILE) ? JSON.parse(fs.readFileSync(STARS_FILE, 'utf8')) : {}
const entries = []
for (const [url, e] of base.entries) {
  const descs = { [base.loc.code]: e.desc }
  let ok = true
  for (const { loc, entries: map } of others) {
    const t = map.get(url)
    if (!t) { console.error(`${loc.readme} missing: ${url}`); ok = false; break }
    descs[loc.code] = t.desc
  }
  if (ok) entries.push({ name: e.name, url: e.url, cat: e.cat, owner: url.split('/')[3], stars: starsMap[e.url]?.stars ?? null, createdAt: starsMap[e.url]?.createdAt ?? null, descs })
}
console.log(`${entries.length} entries parsed across ${LOCALES.length} locales`)

// Category order preserved; within each category sort by owner/repo so the
// site default listing matches the normalized READMEs.
const ordered = CAT_IDS.flatMap((id) => entries.filter((e) => e.cat === id).sort((a, b) => cmpByKey(a.url, b.url)))
const N = ordered.length

// added-date ledger: existing URLs keep their date, new URLs are stamped today
const dates = fs.existsSync(DATES_FILE) ? JSON.parse(fs.readFileSync(DATES_FILE, 'utf8')) : {}
const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}
const today0 = new Date().toISOString().slice(0, 10)
for (const e of ordered) if (!dates[e.url]) dates[e.url] = today0
fs.writeFileSync(DATES_FILE, JSON.stringify(Object.fromEntries(Object.entries(dates).sort()), null, 1))
for (const e of ordered) e.added = dates[e.url]
```

</details>

**依据 3 · 源码核查**：[scripts/build-site.mjs:281-312](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/build-site.mjs#L281-L312)

站点共享数据的注册表输出

<details>
<summary>查看原文（32行）</summary>

```text
// Public registry API: /plugins.json — deterministic; consumed by the find
// plugin, the site, and any third-party storefront (Pages serves CORS *).
const registry = {
  name: 'awesome-dsh-plugin',
  url: ORIGIN,
  source: 'https://github.com/beancookie/awesome-dsh-plugin',
  updated: [...ordered].map((e) => e.added).sort().pop(),
  count: N,
  categories: Object.fromEntries(CAT_IDS.map((id) => [id, Object.fromEntries(LOCALES.map((l) => [l.code, l.categories[id]]))])),
  plugins: ordered.map((e) => {
    // Registry installs beat full-repo GitHub tarballs (smaller, prebuilt, CDN);
    // the probe (scripts/probe-npm.mjs) only maps packages whose repository
    // field points back at the listed repo.
    const npm = npmMap[e.url]?.npm ?? null
    return {
      // READMEs render "owner/name" for human disambiguation; machine
      // consumers (find-plugin, dsh-market) match on the bare plugin name,
      // with `owner` as its own field.
      name: e.name.includes('/') ? e.name.slice(e.name.indexOf('/') + 1) : e.name,
      owner: e.owner,
      url: e.url,
      category: e.cat,
      description: Object.fromEntries(LOCALES.map((l) => [l.code, e.descs[l.code]])),
      npm,
      stars: e.stars ?? null,
      createdAt: e.createdAt ?? null,
      install: installCmd(e),
      added: e.added,
    }
  }),
}
fs.writeFileSync('docs/plugins.json', JSON.stringify(registry, null, 1) + '\n')
```

</details>

#### 缺口

- 未做实际生成比对
  **影响**：不能确认固定产物与输入完全一致
  **进一步探讨**：在隔离环境比对相同提交的两份 README 和注册表

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有 npm 安装命令是否代表可安装？

**研究主题**：缺陷与关键质疑

#### 完整回答

探测用 URL 推导默认分支的 package.json，再读取注册表并检查仓库字符串是否包含路径。匹配表示弱关联线索，没有确认包文件、组件入口、签名或 DSH 兼容。已确定 npm 的缓存没有同样的定期复查；首次网络失败能写 npm null，之后会延迟再查。生成安装命令在无包名时直接回退 GitHub 地址，因此同一候选可能因缓存结果走不同的安装供应链。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/probe-npm.mjs:27-38](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/probe-npm.mjs#L27-L38)

已识别 npm 和 null 的复查条件

<details>
<summary>查看原文（12行）</summary>

```text
const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {}

const readme = fs.readFileSync(LOCALES[0].readme, 'utf8')
const urls = [...readme.matchAll(/^- \[.+?\]\((https:\/\/github\.com\/[^)]+)\) [—-] /gm)].map((m) => m[1])

const today = new Date().toISOString().slice(0, 10)
const stale = (entry) =>
  entry === undefined
  || (entry.npm === null
    && (Date.now() - new Date(entry.checkedAt).getTime()) / 86400000 > RECHECK_DAYS)

const pending = urls.filter((url) => stale(map[url]))
```

</details>

**依据 2 · 源码核查**：[scripts/probe-npm.mjs:50-72](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/probe-npm.mjs#L50-L72)

字符串匹配及首次失败缓存

<details>
<summary>查看原文（23行）</summary>

```text
async function probe(url) {
  const repoPath = url.replace('https://github.com/', '').replace(/\/$/, '')
  try {
    const pkg = await fetchJson(`https://raw.githubusercontent.com/${repoPath}/HEAD/package.json`)
    const name = typeof pkg.name === 'string' ? pkg.name : null
    if (name === null) return { npm: null, checkedAt: today }
    const meta = await fetchJson(`https://registry.npmjs.org/${encodeURIComponent(name)}`)
    const repoField = typeof meta.repository === 'string' ? meta.repository : meta.repository?.url ?? ''
    const linked = repoField.toLowerCase().includes(repoPath.toLowerCase())
    return { npm: linked ? name : null, checkedAt: today }
  } catch {
    return null // network failure or 404 chain — keep whatever we had
  }
}

let done = 0
for (let i = 0; i < pending.length; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(async (url) => [url, await probe(url)]))
  for (const [url, result] of results) {
    if (result !== null) map[url] = result
    else if (map[url] === undefined) map[url] = { npm: null, checkedAt: today }
  }
```

</details>

**依据 3 · 源码核查**：[scripts/build-site.mjs:154-159](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/build-site.mjs#L154-L159)

根据缓存拼接安装命令

```text
// Frontend data source: same roster + install logic as the JSON registry
// below, but flattened to the current locale so the page re-renders client-side.
const installCmd = (e) => {
  const npm = npmMap[e.url]?.npm ?? null
  return `dsh plugin --profile web add ${npm ?? `github:${e.url.replace('https://github.com/', '')}`}`
}
```

#### 缺口

- 未核对任何包的真实发布与兼容
  **影响**：不能从存在命令推断安装成功
  **进一步探讨**：对候选核对精确仓库、组件、版本和包内容

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 这份目录可以如何采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

读者把它作为发现入口，通过站点或固定 README 获得候选，再单独查阅目标源码与兼容范围。维护者的生成链使用 Node 和网络 API，CI 可定期更新缓存并提交；星标探测遇限流会停止后续批次，缓存可能过时。目录无需装进宿主。比较来源、复核入口和失败排查均需人工时间，本轮无测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:598-616](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/README.md#L598-L616)

贡献格式及目录责任边界

<details>
<summary>查看原文（19行）</summary>

````text
## 贡献

欢迎提 PR 收录你的插件：在 `README.md` 和 `README.en.md` 的对应分类下各加一行，格式 `- [名称](链接) — 一句话描述`。

也请为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic，方便大家发现。

## 徽章

插件已被收录？欢迎在你的 README 里挂上徽章：

[![Awesome DSH Plugin](https://beancookie.github.io/awesome-dsh-plugin/badge.svg)](https://beancookie.github.io/awesome-dsh-plugin)

```markdown
[![Awesome DSH Plugin](https://beancookie.github.io/awesome-dsh-plugin/badge.svg)](https://beancookie.github.io/awesome-dsh-plugin)
```

## 免责声明

本项目是社区维护的索引。插件由各自作者开发与维护，收录不构成背书，亦不对任何插件的安全性、质量或维护状态作出保证。安装插件即在你的机器上运行第三方代码——请自行审阅源码、风险自担。本项目与 DeepSeek 无隶属关系。
````

</details>

**依据 2 · 源码核查**：[.github/workflows/build-site.yml:14-37](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/.github/workflows/build-site.yml#L14-L37)

探测、生成与提交的 CI 路径

<details>
<summary>查看原文（24行）</summary>

```text
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Probe npm packages + GitHub stars
        run: |
          node scripts/probe-npm.mjs
          node scripts/probe-stars.mjs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Build site rows from READMEs
        run: node scripts/build-site.mjs
      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs README.md README.en.md data
          git diff --cached --quiet && echo "no changes" && exit 0
          git commit -m "chore: rebuild site from README"
          git push
```

</details>

**依据 3 · 源码核查**：[scripts/probe-stars.mjs:60-90](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/probe-stars.mjs#L60-L90)

缓存保留和限流停止

<details>
<summary>查看原文（31行）</summary>

```text
  let res
  try {
    res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    return { defer: true }
  }
  if (res.status === 304) return { entry: { stars: prev.stars, createdAt: prev.createdAt, etag: prev.etag, checkedAt: today } }
  if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') return { rate: true }
  if (res.status === 429) return { rate: true }
  if (!res.ok) return { defer: true }
  const body = await res.json().catch(() => null)
  if (!body) return { defer: true }
  const createdAt = typeof body.created_at === 'string' ? body.created_at.slice(0, 10) : null
  return { entry: { stars: body.stargazers_count ?? 0, createdAt, etag: res.headers.get('etag'), checkedAt: today } }
}

let done = 0
let stopped = false
for (let i = 0; i < pending.length && !stopped; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(async (url) => [url, await fetchRepo(url)]))
  for (const [url, result] of results) {
    if (result.rate) { stopped = true; continue }
    if (result.defer) {
      if (cache[url] === undefined) cache[url] = { stars: null, checkedAt: today }
      continue
    }
    cache[url] = result.entry
```

</details>

#### 缺口

- 未验证站点、缓存刷新和安装
  **影响**：不能评估当前更新延迟
  **进一步探讨**：对所关心条目核对固定源码及缓存采集时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 区分未发现与未核实能否减少错误安装？

**研究主题**：新假设与验证

#### 完整回答

当前生成器把 npm null 转换为 GitHub 安装命令。可验证显示未核实、确实未发包和确认匹配三种状态，在固定资料上比较读者选择正确来源的比例。用超时、子路径和相似仓库名模拟错误分类，记录误复制命令与完成耗时。若状态细分无法减少错误或增加明显负担，则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/probe-npm.mjs:50-72](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/probe-npm.mjs#L50-L72)

缓存可合并网络失败与缺包

<details>
<summary>查看原文（23行）</summary>

```text
async function probe(url) {
  const repoPath = url.replace('https://github.com/', '').replace(/\/$/, '')
  try {
    const pkg = await fetchJson(`https://raw.githubusercontent.com/${repoPath}/HEAD/package.json`)
    const name = typeof pkg.name === 'string' ? pkg.name : null
    if (name === null) return { npm: null, checkedAt: today }
    const meta = await fetchJson(`https://registry.npmjs.org/${encodeURIComponent(name)}`)
    const repoField = typeof meta.repository === 'string' ? meta.repository : meta.repository?.url ?? ''
    const linked = repoField.toLowerCase().includes(repoPath.toLowerCase())
    return { npm: linked ? name : null, checkedAt: today }
  } catch {
    return null // network failure or 404 chain — keep whatever we had
  }
}

let done = 0
for (let i = 0; i < pending.length; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY)
  const results = await Promise.all(batch.map(async (url) => [url, await probe(url)]))
  for (const [url, result] of results) {
    if (result !== null) map[url] = result
    else if (map[url] === undefined) map[url] = { npm: null, checkedAt: today }
  }
```

</details>

**依据 2 · 源码核查**：[scripts/build-site.mjs:154-159](https://github.com/beancookie/awesome-dsh-plugin/blob/6cdd62f67005d26fc8e4d0a0c7307e5f9a715f85/scripts/build-site.mjs#L154-L159)

null 使用统一的来源回退

```text
// Frontend data source: same roster + install logic as the JSON registry
// below, but flattened to the current locale so the page re-renders client-side.
const installCmd = (e) => {
  const npm = npmMap[e.url]?.npm ?? null
  return `dsh plugin --profile web add ${npm ?? `github:${e.url.replace('https://github.com/', '')}`}`
}
```

#### 缺口

- 没有用户决策数据
  **影响**：状态细分的收益未知
  **进一步探讨**：对相同候选做来源识别对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
