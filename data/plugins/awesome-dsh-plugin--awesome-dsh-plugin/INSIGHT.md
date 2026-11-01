# Awesome DSH Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[920d6e8](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/920d6e8d993eae977c4946e776667e790f500258)

<!-- BEGIN META -->
[![GitHub ★ 21,705](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C705&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,467](https://img.shields.io/static/v1?label=npm+30d&message=1%2C467&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)
<!-- END META -->

> **功能**：整理 DSH 插件候选并生成可读目录与市场索引。

> **亮点**：将人工条目、可读清单、机器索引及能力披露组织到统一发现入口，不是候选插件运行时。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：索引跳过缺元数据及 Git-only 项；扫描失败保留旧结果，收录和未检出都不是安全或完整性证明。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 这是插件运行时还是候选资源入口？](#detail-section-11)
  - [Q02 · 机器索引如何处理无法表达或缺失元数据？](#detail-section-12)
  - [Q03 · 能力披露的缺失和旧记录说明什么？](#detail-section-13)
  - [Q04 · 如何使用目录而不把收录变成安装背书？](#detail-section-14)
  - [Q05 · 如何检验版本与能力披露可否减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：寻找 DSH 插件的用户和维护候选目录的维护者；基线是逐仓搜索及人工审计。[Q01](#research-q01)

逐仓 README、其他列表和手工维护来源；逐项核查权限与版本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 候选列表 | 按类别发现资源 | 收录非背书 |
| 机器索引 | 供兼容市场读取 | 缺元数据与 Git-only 被跳过 |
| 能力披露 | 提示工件触及能力 | 扫描失败可能保留旧记录 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 列表与条目 | 发现必需 | 选择候选 | 使用其他来源 |
| 网络与探测凭据 | 维护需要 | 更新元数据 | 记录可能滞后 |
| 固定版本及独立审查 | 安装前必需 | 确认权限和兼容 | 不安装 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 发现 | 在目录选择候选 | 保留来源与组件身份 |
| 核查 | 固定工件并审权限 | 信息不足停止 |
| 验证 | 独立环境验证 | 失败回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 访问和检索成本低 | 筛选与审查 | 收录非背书 |
| 维护 | 网络与 API 成本 | 检查过期和失败 | 旧记录可能保留 |
| 安装 | 候选自身费用未知 | 单独核验与恢复 | 未运行候选 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现 | 汇总条目与索引 | 列表全面或最新 |
| 披露 | 静态扫描与失败保留 | 候选安全和可运行 |

> **思考**：索引跳过缺元数据及 Git-only 项；扫描失败保留旧结果，收录和未检出都不是安全或完整性证明。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将人工条目、可读清单、机器索引及能力披露组织到统一发现入口，不是候选插件运行时。[Q01](#research-q01) [Q02](#research-q02)

缺 npm、版本或发布时间计数跳过，能力探测失败保留旧记录；格式验证不等于生成一致性或安全审计。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

索引跳过缺元数据及 Git-only 项；扫描失败保留旧结果，收录和未检出都不是安全或完整性证明。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先发现，再固定候选版本、独立核验权限与宿主兼容；不要把目录收录当安装背书。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持索引跳过、格式检查及失败保留设计；未执行探测或候选。

- 已检查：作者 README、包清单、源码路径 package.json、scripts/build-index.mjs、scripts/lib/market-index.mjs、scripts/probe-capabilities.mjs、scripts/check-submission.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 48 个指定扩展名文件、无排除或解析错误；静态核查索引和披露机制，本轮未运行探测，也不据单一来源判断队列完整。
- 下一步：固定候选和实际工件，核对索引缺失、扫描时间、权限及宿主行为。

**分析版本**

- **仓库**：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- **版本号**：0.1.0（[固定提交 920d6e8](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/920d6e8d993eae977c4946e776667e790f500258)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示实际扫描版本、最近成功时间和失败原因可减少旧记录误读；须测识别、误报及维护成本。[Q05](#research-q05)

固定候选和实际工件，核对索引缺失、扫描时间、权限及宿主行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 17485 | — | — | 958620 |
| .mjs | test | 8 | 623 | 503 | 93 | — |
| .mjs | source | 32 | 6629 | 4085 | 2231 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 资源列表如何生成索引与能力披露，其缺失和新鲜度边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是插件运行时还是候选资源入口？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

本仓为 DSH 用户和维护者提供插件候选列表、结构化目录及市场索引生成，不是实现所有候选功能的运行时。相较逐仓搜索和手工维护来源，统一条目可减少发现成本；安装、身份、权限及维护情况仍需逐项核实。npm 包 files 只包括两份 README；仓库的构建和探测脚本不可据此视为随 npm 包分发。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/package.json#L1-L13)

包身份及发布文件。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "awesome-dsh-plugin",
  "version": "0.1.0",
  "description": "A curated list of DeepSeek Harness (dsh) plugins · DeepSeek Harness 插件精选列表",
  "homepage": "https://awesome-dsh-plugin.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/awesome-dsh-plugin/awesome-dsh-plugin.git"
  },
  "license": "CC0-1.0",
  "files": [
    "README.md",
    "README.zh.md"
```

</details>

**依据 2 · 源码核查**：[scripts/build-index.mjs:1-16](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/build-index.mjs#L1-L16)

目录转市场索引与排除。

<details>
<summary>查看原文（16行）</summary>

```text
#!/usr/bin/env node
/**
 * Write docs/index.json — this list as a DSH plugin market index (format 1).
 *
 * Hosts read it as a market source: dsh 0.2.1's Plugins → Discover tab, and the
 * `plugin_market` agent tool, both take a URL. Publishing it here means users
 * add one address instead of copying the list by hand.
 *
 * Reads the same inputs as build-site.mjs (data/plugins, data/npm-map.json and
 * the locale files) and never touches the network: publish times come from
 * probe-npm.mjs, which records them from the packument it already fetches.
 * Entries it cannot express — no npm package, no version, or no publish time
 * yet — are counted and left out rather than guessed at.
 *
 * Usage: node scripts/build-index.mjs [--check]
 *   --check   validate the current docs/index.json without writing (CI gate).
```

</details>

**依据 3 · 源码核查**：[scripts/check-submission.mjs:1-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/check-submission.mjs#L1-L13)

提交门槛范围。

<details>
<summary>查看原文（13行）</summary>

```text
// Validate the repos behind the entries a PR adds or changes:
//
//   1. package.json declares `dsh.bundle` (anywhere in the repo — monorepos
//      put it in packages/, plugins/, extensions/, bundle/, npm/, ... so the
//      whole tree is enumerated rather than a guessed list of directories)
//   2. the repo is at least MIN_AGE_DAYS old (no commit floor — see below)
//   3. the repo exists and isn't archived
//   4. the repo is not DSH itself (it declares `dsh.bundle` and would pass 1-3)
//
// Needs GITHUB_TOKEN: the git-tree enumeration is API calls, and
// unauthenticated (60/hr per IP) is nowhere near enough. That is
// why this runs from pr-gate.yml via workflow_run rather than the fork-safe
// pull_request job.
```

</details>

#### 缺口

- 本轮未执行探测、构建、宿主或第三方插件
  **影响**：不能证明目录最新、来源完整或候选可安全安装
  **进一步探讨**：固定候选版本并独立核查清单、权限和目标宿主

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机器索引如何处理无法表达或缺失元数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

build-index 读取结构化条目和 npm 映射，缺 npm、版本、发布时间以及格式拒绝的条目计数并跳过，避免猜测；Git-only 条目由于缺逐版本 commit 不可在当前 format 1 表达。--check 对已发布文档执行格式解析，但该路径不比较生成文档与磁盘内容是否一致，格式通过不等于来源齐全、最新或候选安全。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:9-16](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/build-index.mjs#L9-L16)

缺元数据跳过。

```text
 * Reads the same inputs as build-site.mjs (data/plugins, data/npm-map.json and
 * the locale files) and never touches the network: publish times come from
 * probe-npm.mjs, which records them from the packument it already fetches.
 * Entries it cannot express — no npm package, no version, or no publish time
 * yet — are counted and left out rather than guessed at.
 *
 * Usage: node scripts/build-index.mjs [--check]
 *   --check   validate the current docs/index.json without writing (CI gate).
```

**依据 2 · 源码核查**：[scripts/build-index.mjs:28-49](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/build-index.mjs#L28-L49)

统计及 check 对已发布文档解析。

<details>
<summary>查看原文（22行）</summary>

```text
const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}
const entries = readEntries()
const { index, skipped, refused } = buildMarketIndex({ entries, npmMap, locales: LOCALES })

const listable = entries.length - skipped.noNpm - skipped.noVersion - skipped.noPublishTime - skipped.refused
console.log(`index: ${index.plugins.length} of ${entries.length} entries listed`)
console.log(`  no npm package: ${skipped.noNpm}`)
console.log(`  npm but no version recorded: ${skipped.noVersion}`)
console.log(`  npm version without a publish time yet (next probe fills it): ${skipped.noPublishTime}`)
if (skipped.refused > 0) {
  console.log(`  refused by the format: ${skipped.refused}`)
  for (const line of refused.slice(0, 10)) console.log(`    ${line}`)
  if (refused.length > 10) console.log(`    … ${refused.length - 10} more`)
}
if (index.plugins.length !== listable) {
  throw new Error(`internal: listed ${index.plugins.length} but expected ${listable}`)
}

if (checkOnly) {
  if (!fs.existsSync(OUT_FILE)) throw new Error(`${OUT_FILE} does not exist`)
  const published = parseMarketIndex(JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')), 'https://awesome-dsh-plugin.com/index.json')
  console.log(`check: ${OUT_FILE} is a valid format-1 index (${published.plugins.length} plugins)`)
```

</details>

**依据 3 · 源码核查**：[scripts/lib/market-index.mjs:1-14](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/lib/market-index.mjs#L1-L14)

Git-only 不可表达原因。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Build the DSH plugin market index (format 1) from this list's own data.
 *
 * dsh 0.2.1 added "plugin market indexes": a JSON document a host can read as
 * a market source, browsed in the official Plugins → Discover tab and by the
 * `plugin_market` agent tool. The format is defined and validated by
 * @deepseek-ai/dsh-plugin-market-index, which this module uses as the single
 * rule set — an index is built, then validated with the same parser every
 * host uses, so a document that leaves here cannot be one DSH rejects.
 *
 * What can be listed: an entry needs an npm package, an exact version, and
 * that version's publish time. The GitHub-only half of the list cannot be
 * expressed yet — format 1 wants a commit SHA per Git version, and this
 * repository records none.
```

</details>

#### 缺口

- 本轮未执行探测、构建、宿主或第三方插件
  **影响**：不能证明目录最新、来源完整或候选可安全安装
  **进一步探讨**：固定候选版本并独立核查清单、权限和目标宿主

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能力披露的缺失和旧记录说明什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

能力扫描设计为静态披露而非安全裁决：按安装分发形式取 tarball、release 或仓库，并针对子目录扫描；下载或扫描失败保留旧记录而不写空列表。由此未检出不是安全证明，保留结果也可能滞后当前版本；本轮未实际运行网络或扫描，不能判断某候选当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/probe-capabilities.mjs:1-25](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/probe-capabilities.mjs#L1-L25)

静态披露、来源与失败保留。

<details>
<summary>查看原文（25行）</summary>

```text
#!/usr/bin/env node
/**
 * Scan every listed plugin for the capabilities it touches, into
 * data/capabilities.json, consumed by build-site.mjs so plugins.json carries
 * `capabilities` / `redLines` per entry.
 *
 * The facts are DISCLOSURE, never a verdict (#209): nothing here writes
 * "safe", an entry that could not be scanned is simply absent from the file,
 * and the surfaces print that absence as 未检出. The scanner itself
 * (`dsh-trust-check`, MIT) executes no code, opens no sockets and needs no
 * model — it reads the extracted tree and reports `文件:行号` for each hit.
 *
 * Where the tree comes from follows what a user would install (see
 * lib/capabilities.mjs): the npm tarball when the entry is published there,
 * the author's prebuilt release when that is the only distribution, and the
 * repository's own codeload artifact otherwise. Subdirectory entries
 * (`/tree/<ref>/<sub>`) are scanned at the subdirectory, because that is the
 * package the user gets — the monorepo root would report its siblings.
 *
 * Incremental by release, then by age: a new npm version invalidates the
 * record, a branch tarball (which can change under the same URL) expires
 * after RECHECK_DAYS. A failed download or a scanner crash KEEPS the previous
 * record on disk and is reported in the summary; it never writes an empty
 * capability list, because "we could not look" and "we looked and saw
 * nothing" are different sentences and only one of them is true.
```

</details>

**依据 2 · 源码核查**：[scripts/check-submission.mjs:1-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/check-submission.mjs#L1-L13)

提交检查聚焦 bundle、年龄与仓库状态。

<details>
<summary>查看原文（13行）</summary>

```text
// Validate the repos behind the entries a PR adds or changes:
//
//   1. package.json declares `dsh.bundle` (anywhere in the repo — monorepos
//      put it in packages/, plugins/, extensions/, bundle/, npm/, ... so the
//      whole tree is enumerated rather than a guessed list of directories)
//   2. the repo is at least MIN_AGE_DAYS old (no commit floor — see below)
//   3. the repo exists and isn't archived
//   4. the repo is not DSH itself (it declares `dsh.bundle` and would pass 1-3)
//
// Needs GITHUB_TOKEN: the git-tree enumeration is API calls, and
// unauthenticated (60/hr per IP) is nowhere near enough. That is
// why this runs from pr-gate.yml via workflow_run rather than the fork-safe
// pull_request job.
```

</details>

#### 缺口

- 本轮未执行探测、构建、宿主或第三方插件
  **影响**：不能证明目录最新、来源完整或候选可安全安装
  **进一步探讨**：固定候选版本并独立核查清单、权限和目标宿主

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何使用目录而不把收录变成安装背书？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

用户可先按场景筛候选，核对独立仓库、固定提交、实际分发和兼容性，再评估权限、凭据及维护状态；发现元数据缺失、旧扫描或权限无法核清时停止安装。维护者需网络、GitHub/API、定时探测及处理失败保留，目录筛选与市场索引覆盖不同。此列表是本轮固定来源之一，不单独证明本轮来源或候选完整。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:28-40](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/build-index.mjs#L28-L40)

索引明确统计跳过条目。

<details>
<summary>查看原文（13行）</summary>

```text
const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}
const entries = readEntries()
const { index, skipped, refused } = buildMarketIndex({ entries, npmMap, locales: LOCALES })

const listable = entries.length - skipped.noNpm - skipped.noVersion - skipped.noPublishTime - skipped.refused
console.log(`index: ${index.plugins.length} of ${entries.length} entries listed`)
console.log(`  no npm package: ${skipped.noNpm}`)
console.log(`  npm but no version recorded: ${skipped.noVersion}`)
console.log(`  npm version without a publish time yet (next probe fills it): ${skipped.noPublishTime}`)
if (skipped.refused > 0) {
  console.log(`  refused by the format: ${skipped.refused}`)
  for (const line of refused.slice(0, 10)) console.log(`    ${line}`)
  if (refused.length > 10) console.log(`    … ${refused.length - 10} more`)
```

</details>

**依据 2 · 源码核查**：[scripts/probe-capabilities.mjs:13-25](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/probe-capabilities.mjs#L13-L25)

来源和失败保留。

<details>
<summary>查看原文（13行）</summary>

```text
 * Where the tree comes from follows what a user would install (see
 * lib/capabilities.mjs): the npm tarball when the entry is published there,
 * the author's prebuilt release when that is the only distribution, and the
 * repository's own codeload artifact otherwise. Subdirectory entries
 * (`/tree/<ref>/<sub>`) are scanned at the subdirectory, because that is the
 * package the user gets — the monorepo root would report its siblings.
 *
 * Incremental by release, then by age: a new npm version invalidates the
 * record, a branch tarball (which can change under the same URL) expires
 * after RECHECK_DAYS. A failed download or a scanner crash KEEPS the previous
 * record on disk and is reported in the summary; it never writes an empty
 * capability list, because "we could not look" and "we looked and saw
 * nothing" are different sentences and only one of them is true.
```

</details>

**依据 3 · 源码核查**：[scripts/check-submission.mjs:1-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/check-submission.mjs#L1-L13)

有限提交门槛。

<details>
<summary>查看原文（13行）</summary>

```text
// Validate the repos behind the entries a PR adds or changes:
//
//   1. package.json declares `dsh.bundle` (anywhere in the repo — monorepos
//      put it in packages/, plugins/, extensions/, bundle/, npm/, ... so the
//      whole tree is enumerated rather than a guessed list of directories)
//   2. the repo is at least MIN_AGE_DAYS old (no commit floor — see below)
//   3. the repo exists and isn't archived
//   4. the repo is not DSH itself (it declares `dsh.bundle` and would pass 1-3)
//
// Needs GITHUB_TOKEN: the git-tree enumeration is API calls, and
// unauthenticated (60/hr per IP) is nowhere near enough. That is
// why this runs from pr-gate.yml via workflow_run rather than the fork-safe
// pull_request job.
```

</details>

#### 缺口

- 本轮未执行探测、构建、宿主或第三方插件
  **影响**：不能证明目录最新、来源完整或候选可安全安装
  **进一步探讨**：固定候选版本并独立核查清单、权限和目标宿主

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验版本与能力披露可否减少误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：对每个条目展示来源类型、实际扫描工件的版本或提交、最近成功时间及失败原因，可能减少旧能力记录被当成现状。现有失败保留和缺失披露是反证；更详的状态仍不能证明插件无风险，且可能滞后。对照现有目录，在发布变化、探测失败、子目录变动及无 npm 的样本上测识别率、误报、更新延迟和维护成本；若不能改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/probe-capabilities.mjs:13-25](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/probe-capabilities.mjs#L13-L25)

已有工件优先和失败保留。

<details>
<summary>查看原文（13行）</summary>

```text
 * Where the tree comes from follows what a user would install (see
 * lib/capabilities.mjs): the npm tarball when the entry is published there,
 * the author's prebuilt release when that is the only distribution, and the
 * repository's own codeload artifact otherwise. Subdirectory entries
 * (`/tree/<ref>/<sub>`) are scanned at the subdirectory, because that is the
 * package the user gets — the monorepo root would report its siblings.
 *
 * Incremental by release, then by age: a new npm version invalidates the
 * record, a branch tarball (which can change under the same URL) expires
 * after RECHECK_DAYS. A failed download or a scanner crash KEEPS the previous
 * record on disk and is reported in the summary; it never writes an empty
 * capability list, because "we could not look" and "we looked and saw
 * nothing" are different sentences and only one of them is true.
```

</details>

**依据 2 · 源码核查**：[scripts/build-index.mjs:28-40](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/build-index.mjs#L28-L40)

已有缺失计数。

<details>
<summary>查看原文（13行）</summary>

```text
const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}
const entries = readEntries()
const { index, skipped, refused } = buildMarketIndex({ entries, npmMap, locales: LOCALES })

const listable = entries.length - skipped.noNpm - skipped.noVersion - skipped.noPublishTime - skipped.refused
console.log(`index: ${index.plugins.length} of ${entries.length} entries listed`)
console.log(`  no npm package: ${skipped.noNpm}`)
console.log(`  npm but no version recorded: ${skipped.noVersion}`)
console.log(`  npm version without a publish time yet (next probe fills it): ${skipped.noPublishTime}`)
if (skipped.refused > 0) {
  console.log(`  refused by the format: ${skipped.refused}`)
  for (const line of refused.slice(0, 10)) console.log(`    ${line}`)
  if (refused.length > 10) console.log(`    … ${refused.length - 10} more`)
```

</details>

**依据 3 · 源码核查**：[scripts/lib/market-index.mjs:11-14](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/920d6e8d993eae977c4946e776667e790f500258/scripts/lib/market-index.mjs#L11-L14)

Git-only 无法表达。

```text
 * What can be listed: an entry needs an npm package, an exact version, and
 * that version's publish time. The GitHub-only half of the list cannot be
 * expressed yet — format 1 wants a commit SHA per Git version, and this
 * repository records none.
```

#### 缺口

- 本轮未执行探测、构建、宿主或第三方插件
  **影响**：不能证明目录最新、来源完整或候选可安全安装
  **进一步探讨**：固定候选版本并独立核查清单、权限和目标宿主

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
