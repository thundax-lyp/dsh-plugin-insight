# vlln's DSH plugins

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b237efd](https://github.com/vlln/plugin-registry/tree/b237efdfd8227b71c385d36b62e323de08a9848f)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/vlln/plugin-registry)
<!-- END META -->

> **功能**：供 DSH 发现页消费的插件市场索引，自动探测 npm 版本或 Git 提交并生成版本条目。

> **亮点**：贡献是把小范围插件展示事实与真实版本探测分开，给现有宿主发现页提供集中版本入口；已绑定Git提交不等于被收录插件运行通过，见 [Q01](#research-q01)与 [Q02](#research-q02)。

> **主要限制**：npm顺序按字符串而非语义版本，兼容仅取engines.dsh，单源失败会阻止整批刷新；用户需核实际版本与快照，不能把索引当验收，见 [Q03](#research-q03)。

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
  - [Q01 · 当前条目到底是什么，谁需要它？](#detail-section-11)
  - [Q02 · 版本怎样取得、验证和发布？](#detail-section-12)
  - [Q03 · 版本与兼容筛选有哪些局限？](#detail-section-13)
  - [Q04 · 添加索引的成本与采用条件是什么？](#detail-section-14)
  - [Q05 · 什么改进值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向常找该维护者插件的 DSH 用户，集中展示目标与安装版本，便于回原仓库核对；已经知道 spec 时可直接使用原入口，见 [Q01](#research-q01)。

宿主发现/安装来自 DSH；原办法是逐仓库找spec。此仓库只提供索引，不继承被收录项目的运行能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 市场索引文档 | 给发现页集中展示版本 | 消费URL，不提供被收录插件运行能力 |
| npm/Git版本探测 | 减少手填发布定位 | 字符串排序、兼容字段位置有限 |
| 格式校验与刷新 | 合格文档有变更再发布 | 非安装验收，单源失败阻整批 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持format1的DSH发现页 | 读者必需 | 消费index URL | 不表示仓库可作为Host插件加载 |
| 可达索引URL与目标仓库/npm | 发现必需 | 展示与版本核对 | 保留原spec退路 |
| Node>=22及市场校验器0.2.1-rc.2 | 仅维护生成必需 | 探测/验证/写盘 | 任一失败阻止刷新 |
| GitHub/npm网络与CI写权限 | 维护刷新必需 | 版本探测及推送 | 定时定义不等于本次成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 添加 | 用户在发现页添加URL | 可读目标条目，不安装目标 |
| 核对 | 检查来源/commit/稳定版本与兼容 | 不明则回原项目/spec |
| 决定 | 单独研究目标能力与权限 | 索引不替代验收 |
| 退出 | 移除索引源 | 已装插件另行管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | URL访问和宿主资源，金额未知 | 添加源/核版本 | 耗时未测 |
| 持续 | 读者网络；维护者CI/API/依赖资源 | 核新鲜度与目标可信度 | 无净节时测量 |
| 失败恢复 | 重试和构建资源未知 | 定位单源失败/旧索引 | 整批不更新，无部分成功发布 |
| 退出 | 既有插件资源由各插件决定 | 移除源并分别管已装目标 | 不回滚目标副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中发现 | 描述与版本集中为format1 | 比手填spec省时多少 |
| 版本可追 | Git条目完整commit | 目标安装/运行是否有效 |
| 刷新 | 校验后CI推送定义 | 本次远端成功与宿主排序 |

> **思考**：npm顺序按字符串而非语义版本，兼容仅取engines.dsh，单源失败会阻止整批刷新；用户需核实际版本与快照，不能把索引当验收，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是把小范围插件展示事实与真实版本探测分开，给现有宿主发现页提供集中版本入口；已绑定Git提交不等于被收录插件运行通过，见 [Q01](#research-q01)与 [Q02](#research-q02)。

展示/探测分离与Git sha绑定值得借鉴。字符串排序、仅单位置兼容与整批失败降低“真实版本”可直接消费程度；格式校验不等于安装校验，见 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

npm顺序按字符串而非语义版本，兼容仅取engines.dsh，单源失败会阻止整批刷新；用户需核实际版本与快照，不能把索引当验收，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

常查这个集合的用户可先只添加索引并核版本，不自动装目标。版本/兼容不明或索引过旧时回原仓库spec；移除索引不处理已装插件，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

市场索引生成与CI定义已查源码，非原生插件。宿主消费/远端刷新和用户选版效果未测；新状态设计未验证。

- 已检查：作者 README、包清单、源码路径 .github/workflows/index.yml、README.md、index.json、package.json、scripts/build-index.mjs、plugins/dsh-share-link.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整阅读唯一生成脚本、package、索引样本、一个手写条目、README和刷新workflow；未审上游校验器/宿主发现页及被收录插件，不把这些外部能力归本组件。
- 下一步：- 已检查固定源码和索引原件。
- 未运行生成器、请求外部接口、添加索引或安装目标。
- 字典序/兼容/失败边界为静态推导，宿主实际排序未知。

**分析版本**

- **仓库**：[vlln/plugin-registry](https://github.com/vlln/plugin-registry)
- **版本号**：0.1.0（[固定提交 b237efd](https://github.com/vlln/plugin-registry/tree/b237efdfd8227b71c385d36b62e323de08a9848f)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是核清宿主已有排序后，再用语义版本/稳定标签与逐源探测状态减少选版误判；须比较收益和格式维护负担，见 [Q05](#research-q05)。

- 已检查固定源码和索引原件。
- 未运行生成器、请求外部接口、添加索引或安装目标。
- 字典序/兼容/失败边界为静态推导，宿主实际排序未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 510 | — | — | 10539 |
| .mjs | source | 1 | 175 | 136 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/vlln/plugin-registry/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/vlln/plugin-registry/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/vlln/plugin-registry/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该仓库如何帮助发现和选择可安装版本，发布探测和失败边界能否支持添加索引源？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前条目到底是什么，谁需要它？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

当前仓库是插件市场索引及生成工具，归为基础设施，不是可挂载的 DSH 原生插件。package 为 private，没有 Host apply/client 导出；实际消费对象是 format 1 的 index.json。用户要浏览这个维护者的小范围插件集合、选择发布版本时，可以把索引 URL 加到宿主发现页；不需要为了“安装索引”运行仓库脚本。

相比逐个访问仓库并手填安装 spec，它把展示描述、类别和版本定位集中起来，版本探测避免每条都手写。宿主的发现、选择和安装仍来自 DSH，本仓库不实现安装器、插件权限检查或被收录的聊天分享/桌宠能力。README 的功能表是被收录项目自述，不能把那些功能记成本索引能力。已经有明确 spec 的用户可直接安装目标，索引增加的主要是查找便利，不保证生态完整或所列插件可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/package.json#L1-L16)

private生成包，无插件运行导出。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "vlln-dsh-plugin-index",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Index of vlln's DeepSeek Harness (dsh) plugins, in the plugin market index format 1.",
  "scripts": {
    "build": "node scripts/build-index.mjs"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-plugin-market-index": "0.2.1-rc.2"
  },
  "engines": {
    "node": ">=22"
  },
  "license": "MIT"
```

</details>

**依据 2 · 作者声明**：[README.md:8-23](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/README.md#L8-L23)

添加URL与直接spec替代。

<details>
<summary>查看原文（16行）</summary>

````text
## Use it as an index source

1. **Plugins → Discover → Manage index sources**
2. Add:

   ```
   https://raw.githubusercontent.com/vlln/plugin-registry/main/index.json
   ```

3. Search, pick a version, install.

Or install by hand with the same specs the index lists:

```sh
dsh plugin --profile web add github:vlln/dsh-share-link
```
````

</details>

**依据 3 · 作者声明**：[README.md:47-55](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/README.md#L47-L55)

手写条目、生成器与唯一客户端消费文件。

```text

## How this repo works

| Path | Role |
|---|---|
| `plugins/*.json` | Hand-written display facts only: title, description, category, keywords, icon |
| `scripts/build-index.mjs` | Probes the real facts (npm versions + publish times, or the default-branch HEAD commit and its manifest), merges, validates with `@deepseek-ai/dsh-plugin-market-index`, writes `index.json` |
| `index.json` | The generated index — the only file a client reads |
| `.github/workflows/index.yml` | Daily rebuild; commits only when `index.json` actually changed |
```

**依据 4 · 源码核查**：[index.json:1-12](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/index.json#L1-L12)

实际format1索引。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "format": 1,
  "title": {
    "en": "vlln's DSH plugins",
    "zh": "vlln 的 dsh 插件"
  },
  "description": {
    "en": "DeepSeek Harness plugins by vlln. Add this file as an index source under Plugins → Discover.",
    "zh": "vlln 开发的 DeepSeek Harness 插件。把本文件加成 Plugins → Discover 里的索引源即可浏览。"
  },
  "metadata": {
    "categories": {
```

</details>

#### 缺口

- 没有发现任务的实际用户对照。
  **影响**：无法确认集中入口是否显著减少找错版本。
  **进一步探讨**：用同一批目标比较直接仓库与发现页的正确定位和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本怎样取得、验证和发布？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

生成脚本读取 plugins/*.json，只把标题/描述等展示事实并入条目；npm 源查 registry 各版本发布时间与 engines，Git 源查默认分支最新提交，再在该 sha 上读 package.json，并将 commit 写进安装来源。这支持在一次索引快照内固定 Git 版本，而不是安装时继续追随浮动 HEAD。

所有条目串行探测，任一错误抛出便终止整份构建；全部完成后调用外部 parseMarketIndex 校验，才直接 writeFile index.json。固定源码只核到调用，未独立审查上游校验器接受哪些内容，不能把格式验证当可安装性、安全性或实际宿主验收。GitHub workflow 每日03:00 UTC与手动触发，npm ci 后运行脚本，差异存在才提交推送 index；自动化定义不证明本轮远端任务成功。作者提供市场URL的可达性也未现场请求。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:42-78](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L42-L78)

网络与sha/manifest探测。

<details>
<summary>查看原文（37行）</summary>

```text
/** @param {string} url @param {Record<string, string>} [init] */
async function getJson(url, init) {
  let response
  try {
    response = await fetch(url, { headers: { ...headers, ...init } })
  } catch (error) {
    throw new Error(`fetch ${url} failed: ${error?.cause?.message ?? error?.message ?? String(error)}`)
  }
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
  return response.json()
}

/** GitHub 默认分支 HEAD：commit sha + committer 时间（秒）。 */
async function headOf(repo) {
  const commits = await getJson(`https://api.github.com/repos/${repo}/commits?per_page=1`)
  const head = Array.isArray(commits) ? commits[0] : undefined
  if (head === undefined) throw new Error(`${repo}: no commits`)
  return {
    sha: head.sha,
    timestamp: Math.floor(Date.parse(head.commit.committer.date) / 1000),
  }
}

/**
 * 某个 commit 上的 package.json。走 api.github.com（raw.githubusercontent.com 在
 * 部分网络下会单个 15 分钟级超时，见 AGENTS.local.md），用 raw 媒体类型取正文。
 */
async function manifestAt(repo, sha) {
  const url = `https://api.github.com/repos/${repo}/contents/package.json?ref=${sha}`
  let response
  try {
    response = await fetch(url, { headers: { ...headers, accept: 'application/vnd.github.raw+json' } })
  } catch (error) {
    throw new Error(`fetch ${url} failed: ${error?.cause?.message ?? error?.message ?? String(error)}`)
  }
  if (!response.ok) throw new Error(`${repo}@${sha.slice(0, 7)} package.json → HTTP ${response.status}`)
  return response.json()
```

</details>

**依据 2 · 源码核查**：[scripts/build-index.mjs:82-94](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L82-L94)

npm发布事实来源。

<details>
<summary>查看原文（13行）</summary>

```text
async function npmVersions(name) {
  const encoded = name.replace('/', '%2F')
  const registry = await getJson(`https://registry.npmjs.org/${encoded}`)
  const versions = Object.keys(registry.versions ?? {})
    .filter(version => registry.time?.[version] !== undefined)
    .map(version => ({
      version,
      publishTimestamp: Math.floor(Date.parse(registry.time[version]) / 1000),
      engines: registry.versions[version].engines ?? {},
    }))
  if (versions.length === 0) throw new Error(`${name}: npm has no version with a publish time`)
  return versions.sort((left, right) => (left.version === right.version ? 0 : left.version < right.version ? 1 : -1))
}
```

</details>

**依据 3 · 源码核查**：[scripts/build-index.mjs:97-136](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L97-L136)

构造npm和Git安装来源。

<details>
<summary>查看原文（40行）</summary>

```text
async function buildPlugin(entry) {
  const plugin = {
    name: entry.name,
    ...(entry.title === undefined ? {} : { title: entry.title }),
    ...(entry.description === undefined ? {} : { description: entry.description }),
    ...(entry.icon === undefined ? {} : { icon: entry.icon }),
    ...(entry.author === undefined ? {} : { author: entry.author }),
    ...(entry.homepage === undefined ? {} : { homepage: entry.homepage }),
    repository: { url: `https://github.com/${entry.repo}` },
    metadata: {
      category: entry.category,
      keywords: entry.keywords ?? [],
      labels: [],
      sortKeys: {},
    },
  }

  if (entry.source === 'npm') {
    const versions = await npmVersions(entry.name)
    plugin.versions = versions.map(({ version, publishTimestamp, engines }) => ({
      version,
      publishTimestamp,
      source: { type: 'npm' },
      ...(typeof engines.dsh === 'string' ? { engines: { dsh: engines.dsh } } : {}),
    }))
    return plugin
  }

  const head = await headOf(entry.repo)
  const manifest = await manifestAt(entry.repo, head.sha)
  const dshRange = manifest.engines?.dsh
  plugin.versions = [
    {
      version: manifest.version,
      publishTimestamp: head.timestamp,
      source: { type: 'git', url: `https://github.com/${entry.repo}`, commit: head.sha },
      ...(typeof dshRange === 'string' ? { engines: { dsh: dshRange } } : {}),
    },
  ]
  return plugin
```

</details>

**依据 4 · 源码核查**：[scripts/build-index.mjs:139-168](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L139-L168)

串行失败终止、校验后写盘。

<details>
<summary>查看原文（30行）</summary>

```text
const files = (await readdir(join(ROOT, 'plugins'))).filter(file => file.endsWith('.json')).sort()
const entries = []
for (const file of files) {
  const entry = JSON.parse(await readFile(join(ROOT, 'plugins', file), 'utf8'))
  if (entry.category !== undefined && !Object.hasOwn(CATEGORIES, entry.category)) {
    throw new Error(`${file}: category ${JSON.stringify(entry.category)} is not declared in CATEGORIES`)
  }
  entries.push({ file, entry })
}

const document = {
  format: 1,
  title: TITLE,
  description: DESCRIPTION,
  metadata: { categories: CATEGORIES, labels: {}, sortKeys: {} },
  plugins: [],
}

for (const { file, entry } of entries) {
  try {
    document.plugins.push(await buildPlugin(entry))
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 官方校验器是唯一裁判：任何一条规则不过就抛（带 JSON 路径），绝不写盘。
const validated = parseMarketIndex(document, INDEX_URL)

await writeFile(join(ROOT, 'index.json'), `${JSON.stringify(document, null, 2)}\n`)
```

</details>

**依据 5 · 源码核查**：[.github/workflows/index.yml:5-45](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/.github/workflows/index.yml#L5-L45)

定时/手动构建及有差异提交。

<details>
<summary>查看原文（41行）</summary>

```text
on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: index
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci --no-audit --no-fund

      # 生成器自带校验：parseMarketIndex 不过就非零退出，不会写出坏索引。
      - run: node scripts/build-index.mjs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit a changed index
        run: |
          if git diff --quiet -- index.json; then
            echo "index.json is unchanged"
            exit 0
          fi
          git config user.name 'github-actions[bot]'
          git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
          git add index.json
          git commit -m 'chore(index): refresh from npm and git'
          git push
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本与兼容筛选有哪些局限？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

npmVersions 的注释称新到旧，实际按版本字符串字典序倒排，未用语义版本或发布时间；例如版本跨到 0.10 时，字典序不保证比 0.9 靠前。这是代码比较规则的静态推导，未运行目标，也未证明当前客户端一定装错，因为宿主是否再次排序未审查。生成器不读取 dist-tags 选择 stable，也会保留有时间的预发布版；“已发布”不能直接当推荐最新版。

兼容字段只取 manifest.engines.dsh，不读取其它位置的宿主约束；如果插件只把范围写在 dsh.engines 或 peerDependencies，这份生成结果不会带出，缺少范围不是已兼容。Git publishTimestamp实际用提交者时间而非npm发布日。另 getJson/manifestAt没有显式请求超时，单源慢可拖整次构建；有一源失败便保留远端旧索引，不会发布部分新结果，用户需区分旧快照与无更新。末尾直接覆盖文件并非原子rename，CI推送门槛可挡脚本失败，但本地中断写盘仍可能损坏文件；不将其泛化成已发生线上故障。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:54-62](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L54-L62)

Git时间取committer。

```text
/** GitHub 默认分支 HEAD：commit sha + committer 时间（秒）。 */
async function headOf(repo) {
  const commits = await getJson(`https://api.github.com/repos/${repo}/commits?per_page=1`)
  const head = Array.isArray(commits) ? commits[0] : undefined
  if (head === undefined) throw new Error(`${repo}: no commits`)
  return {
    sha: head.sha,
    timestamp: Math.floor(Date.parse(head.commit.committer.date) / 1000),
  }
```

**依据 2 · 源码核查**：[scripts/build-index.mjs:42-51](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L42-L51)

fetch无显式超时。

<details>
<summary>查看原文（10行）</summary>

```text
/** @param {string} url @param {Record<string, string>} [init] */
async function getJson(url, init) {
  let response
  try {
    response = await fetch(url, { headers: { ...headers, ...init } })
  } catch (error) {
    throw new Error(`fetch ${url} failed: ${error?.cause?.message ?? error?.message ?? String(error)}`)
  }
  if (!response.ok) throw new Error(`${url} → HTTP ${response.status}`)
  return response.json()
```

</details>

**依据 3 · 源码核查**：[scripts/build-index.mjs:82-94](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L82-L94)

字典排序且不按dist-tags过滤。

<details>
<summary>查看原文（13行）</summary>

```text
async function npmVersions(name) {
  const encoded = name.replace('/', '%2F')
  const registry = await getJson(`https://registry.npmjs.org/${encoded}`)
  const versions = Object.keys(registry.versions ?? {})
    .filter(version => registry.time?.[version] !== undefined)
    .map(version => ({
      version,
      publishTimestamp: Math.floor(Date.parse(registry.time[version]) / 1000),
      engines: registry.versions[version].engines ?? {},
    }))
  if (versions.length === 0) throw new Error(`${name}: npm has no version with a publish time`)
  return versions.sort((left, right) => (left.version === right.version ? 0 : left.version < right.version ? 1 : -1))
}
```

</details>

**依据 4 · 源码核查**：[scripts/build-index.mjs:114-134](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L114-L134)

仅透传engines.dsh。

<details>
<summary>查看原文（21行）</summary>

```text
  if (entry.source === 'npm') {
    const versions = await npmVersions(entry.name)
    plugin.versions = versions.map(({ version, publishTimestamp, engines }) => ({
      version,
      publishTimestamp,
      source: { type: 'npm' },
      ...(typeof engines.dsh === 'string' ? { engines: { dsh: engines.dsh } } : {}),
    }))
    return plugin
  }

  const head = await headOf(entry.repo)
  const manifest = await manifestAt(entry.repo, head.sha)
  const dshRange = manifest.engines?.dsh
  plugin.versions = [
    {
      version: manifest.version,
      publishTimestamp: head.timestamp,
      source: { type: 'git', url: `https://github.com/${entry.repo}`, commit: head.sha },
      ...(typeof dshRange === 'string' ? { engines: { dsh: dshRange } } : {}),
    },
```

</details>

**依据 5 · 源码核查**：[scripts/build-index.mjs:157-168](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L157-L168)

整批抛错和直接writeFile。

<details>
<summary>查看原文（12行）</summary>

```text
for (const { file, entry } of entries) {
  try {
    document.plugins.push(await buildPlugin(entry))
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 官方校验器是唯一裁判：任何一条规则不过就抛（带 JSON 路径），绝不写盘。
const validated = parseMarketIndex(document, INDEX_URL)

await writeFile(join(ROOT, 'index.json'), `${JSON.stringify(document, null, 2)}\n`)
```

</details>

#### 缺口

- 未核宿主版本排序与兼容字段解析。
  **影响**：不能据生成顺序断言最终安装选择错误。
  **进一步探讨**：在受控索引样本检查0.9/0.10、预发布及不同兼容位置，观察宿主实际选择。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 添加索引的成本与采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

经常寻找该维护者插件的 DSH 用户，可以只添加索引源并核对目标版本与仓库，不自动安装任何被收录包。先确认Git项有完整commit、npm项对应期望稳定版本，再回目标项目研究其权限和使用条件；发现条目不等于插件验收。关键版本顺序、兼容约束或目标URL不清时，退回明确的原仓库/spec，删除该索引源即可停止从此源发现，已装插件仍需分别管理。

读者首次负担是添加URL和辨认版本，持续需核快照新鲜度与目标可信度；维护者另承担GitHub/npm请求、依赖安装和失败排查。没有本索引专用模型或付费API调用的源码，但网络、CI、人工与被安装插件的费用不能填0。索引自己不向用户运行Host能力，移除源不撤销已装目标也不回滚它的副作用。未测真实任务耗时、宿主加载和远端刷新成功，本轮建议有条件试用发现入口，不能升级安装推荐。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-23](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/README.md#L8-L23)

索引入口与spec退路。

<details>
<summary>查看原文（16行）</summary>

````text
## Use it as an index source

1. **Plugins → Discover → Manage index sources**
2. Add:

   ```
   https://raw.githubusercontent.com/vlln/plugin-registry/main/index.json
   ```

3. Search, pick a version, install.

Or install by hand with the same specs the index lists:

```sh
dsh plugin --profile web add github:vlln/dsh-share-link
```
````

</details>

**依据 2 · 源码核查**：[scripts/build-index.mjs:114-134](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L114-L134)

用户需区分npm/git来源。

<details>
<summary>查看原文（21行）</summary>

```text
  if (entry.source === 'npm') {
    const versions = await npmVersions(entry.name)
    plugin.versions = versions.map(({ version, publishTimestamp, engines }) => ({
      version,
      publishTimestamp,
      source: { type: 'npm' },
      ...(typeof engines.dsh === 'string' ? { engines: { dsh: engines.dsh } } : {}),
    }))
    return plugin
  }

  const head = await headOf(entry.repo)
  const manifest = await manifestAt(entry.repo, head.sha)
  const dshRange = manifest.engines?.dsh
  plugin.versions = [
    {
      version: manifest.version,
      publishTimestamp: head.timestamp,
      source: { type: 'git', url: `https://github.com/${entry.repo}`, commit: head.sha },
      ...(typeof dshRange === 'string' ? { engines: { dsh: dshRange } } : {}),
    },
```

</details>

**依据 3 · 源码核查**：[.github/workflows/index.yml:17-45](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/.github/workflows/index.yml#L17-L45)

维护者构建和发布成本链。

<details>
<summary>查看原文（29行）</summary>

```text
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci --no-audit --no-fund

      # 生成器自带校验：parseMarketIndex 不过就非零退出，不会写出坏索引。
      - run: node scripts/build-index.mjs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit a changed index
        run: |
          if git diff --quiet -- index.json; then
            echo "index.json is unchanged"
            exit 0
          fi
          git config user.name 'github-actions[bot]'
          git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
          git add index.json
          git commit -m 'chore(index): refresh from npm and git'
          git push
```

</details>

#### 缺口

- 未取得真实发现页加载与正确版本选择效果。
  **影响**：只能支持浏览/核对的小范围试用。
  **进一步探讨**：用测试配置添加URL并核目标，再比较原spec方式的错误/耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进值得验证？

**研究主题**：新假设与验证

#### 完整回答

未验证设计是按语义版本与稳定标签组织npm条目，并在生成快照记录每源探测时间及失败来源；保持一次快照要么完整发布要么维持旧版，但让用户能看出“旧”与“无变化”的区别。它来自版本字符串排序与整批失败两个已核取舍，不需要另造宿主安装器。

先用合成0.9/0.10、prerelease、缺兼容字段和单源超时样本，比较当前索引与候选索引的正确选版、维护者定位失败耗时及读者误判；宿主可能已有排序，因此改排序不一定有用户收益。新增探测状态需要兼容format1可接受字段或独立维护状态页，不能未经校验塞新字段。若宿主已正确处理所有版本而额外状态只增加维护，则不做。未实现或运行，不认定为商业机会。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:82-94](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L82-L94)

当前版本组织。

<details>
<summary>查看原文（13行）</summary>

```text
async function npmVersions(name) {
  const encoded = name.replace('/', '%2F')
  const registry = await getJson(`https://registry.npmjs.org/${encoded}`)
  const versions = Object.keys(registry.versions ?? {})
    .filter(version => registry.time?.[version] !== undefined)
    .map(version => ({
      version,
      publishTimestamp: Math.floor(Date.parse(registry.time[version]) / 1000),
      engines: registry.versions[version].engines ?? {},
    }))
  if (versions.length === 0) throw new Error(`${name}: npm has no version with a publish time`)
  return versions.sort((left, right) => (left.version === right.version ? 0 : left.version < right.version ? 1 : -1))
}
```

</details>

**依据 2 · 源码核查**：[scripts/build-index.mjs:157-168](https://github.com/vlln/plugin-registry/blob/b237efdfd8227b71c385d36b62e323de08a9848f/scripts/build-index.mjs#L157-L168)

当前失败和校验边界。

<details>
<summary>查看原文（12行）</summary>

```text
for (const { file, entry } of entries) {
  try {
    document.plugins.push(await buildPlugin(entry))
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// 官方校验器是唯一裁判：任何一条规则不过就抛（带 JSON 路径），绝不写盘。
const validated = parseMarketIndex(document, INDEX_URL)

await writeFile(join(ROOT, 'index.json'), `${JSON.stringify(document, null, 2)}\n`)
```

</details>

#### 缺口

- 未核宿主已有排序/状态展示，未做候选对照。
  **影响**：新增机制可能重复宿主。
  **进一步探讨**：先核宿主消费逻辑，再按上述样本验证是否有额外价值。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
