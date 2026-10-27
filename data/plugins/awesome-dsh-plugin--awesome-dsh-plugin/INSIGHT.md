# Awesome DSH Plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a7ae7b2](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/a7ae7b2a1295e96b2a84268ed0443f1aead14f33)

<!-- BEGIN META -->
[![GitHub ★ 20,675](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20%2C675&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,048](https://img.shields.io/static/v1?label=npm+30d&message=1%2C048&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)
<!-- END META -->

> **功能**：维护 DSH 社区插件目录，并生成多语言网站和宿主可读取的市场索引。

> **亮点**：相对 README 人工复制，该项目把每个条目拆成独立 YAML，再从同一输入生成多语言页面与宿主 format-1 市场索引，减少条目提交冲突并复用官方解析器限制输出。贡献在发现和交接链路，而不是插件执行或安全保证。[Q02](#research-q02)

> **主要限制**：市场索引只纳入已记录 npm 名、精确版本与发布时间的子集，格式通过也不证明对应包在某个宿主中可用；README 明确声明收录不是安全审查。因此“同一目录能搜索”不能推导为“全部条目均可一键安装且可信”。[Q03](#research-q03)

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
  - [Q01 · 谁需要目录，合格交付是什么，是否是可安装插件？](#detail-section-11)
  - [Q02 · 独立条目如何进入宿主索引，哪些是本项目增量？](#detail-section-12)
  - [Q03 · 目录格式通过能证明多少，哪些限制影响发现贡献？](#detail-section-13)
  - [Q04 · 启动、维护和失败恢复由谁承担，收益怎样计量？](#detail-section-14)
  - [Q05 · 如何验证证据附着索引的假设，什么用户值得先用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为寻找 DSH 扩展的用户和维护插件入口的社区提供结构化目录、网站与市场索引。合格产物是能追溯仓库及安装来源的候选集合；它不是某一业务任务的执行插件。

简单替代是 GitHub 列表、仓库搜索和手工安装。当前机制降低入口复制和目录多端维护，不证明目标插件质量或端到端收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 社区目录生成 | 维护独立 YAML 并输出网站与 README | 是目录工程，不是 DSH 功能插件 |
| format-1 索引输出 | 供宿主 Discover 与 agent tool 发现候选 | 仅有已记录 npm 包、版本与发布时间的子集 |
| 投稿检查 | 枚举仓库并检查协议入口 | 需要 GitHub Token；不等于安全审查 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.1+ 与市场源配置 | 宿主发现功能必需 | 读取 format-1 索引 | 可退回网页目录和逐项命令 |
| npm 映射的包名、版本、发布时间 | 纳入市场索引必需 | 确定可表达的发布来源 | 跳过并计数，不猜测 |
| Node 与 js-yaml、semver、官方解析器 | 自行构建必需 | 读取条目和校验索引 | 不能生成候选索引 |
| GitHub Token | 投稿自动核查必需 | 枚举仓库文件树 | 提交检查直接失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户将 README 提供的索引地址加入 Discover | 宿主获取并显示条目；超时改用可达来源 |
| 2 | 用户根据用途选择条目并核查对应源码 | 区分 npm 索引条目与 GitHub-only 条目 |
| 3 | 用户按目标插件自己的条件安装及验收 | 目录收录不能代替目标插件的加载和卸载验证 |
| 维护 | 维护者更新 YAML 与 npm 映射后生成索引 | 被跳过和拒绝的条目数可见；逐行格式错误不阻断其余索引 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络与宿主资源；金额未知 | 配置索引、阅读候选来源 | 未实测连通性与首次核查时间 |
| 持续使用 | 索引下载、目标插件各自成本 | 核查变化、维护映射与翻译 | 索引生成不包含目标插件收益核验 |
| 失败恢复 | 重拉索引与 API 请求 | 排查来源超时、过期发布记录与安装失败 | 失败频率及恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一发现入口 | 同一 YAML 输入导出官方市场格式 | 相比网页搜索节约多少时间 |
| 错误隔离 | 单条格式错误捕获并计数 | 真实坏包、恶意代码与宿主冲突检出率 |
| 降低提交冲突 | 独立文件避免共同 README 锚点 | 并发投稿合并冲突的量化变化 |

> **思考**：市场索引只纳入已记录 npm 名、精确版本与发布时间的子集，格式通过也不证明对应包在某个宿主中可用；README 明确声明收录不是安全审查。因此“同一目录能搜索”不能推导为“全部条目均可一键安装且可信”。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对 README 人工复制，该项目把每个条目拆成独立 YAML，再从同一输入生成多语言页面与宿主 format-1 市场索引，减少条目提交冲突并复用官方解析器限制输出。贡献在发现和交接链路，而不是插件执行或安全保证。[Q02](#research-q02)

可借鉴的是 YAML 单条目降低冲突、逐条解析隔离坏记录和输出整体再验证。需保留缺项与拒绝计数，移植时适配官方协议与身份映射；--check 的格式有效语义应与一致性校验分开。引用见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

市场索引只纳入已记录 npm 名、精确版本与发布时间的子集，格式通过也不证明对应包在某个宿主中可用；README 明确声明收录不是安全审查。因此“同一目录能搜索”不能推导为“全部条目均可一键安装且可信”。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有 DSH 环境、希望有组织地筛选扩展的用户试用索引；先确认候选包身份与目标插件自己的条件，再在不含敏感凭据的环境验收加载、核心功能和禁用。若只需要少量已知插件，直接查仓库更省维护；索引超时或版本缺项时退回人工目录，不据目录名誉免做源码核查。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查目录与索引生成机制；发现和交接贡献有源码支持，运行可用性、安全与使用收益未验证；新假设保持未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/lib/entries.mjs、scripts/lib/market-index.mjs、scripts/build-index.mjs、scripts/check-submission.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查目录及生成器的固定版本，不审计全量被收录插件，不执行网络探针或目标代码。
- 下一步：取固定20条记录同时核对 YAML、线上索引和宿主显示，再完成受控候选安装与禁用；分开统计发现耗时、错误选择与维护成本。

**分析版本**

- **仓库**：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- **版本号**：0.1.0（[固定提交 a7ae7b2](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/a7ae7b2a1295e96b2a84268ed0443f1aead14f33)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是让每条索引附带按固定插件版本、宿主版本及验收时间绑定的最小结果证明，同时保留无证明条目。由当前格式校验与实际可用性之间的缺口推导，增量是帮助用户判断证据新鲜度而非给出安全认证。先取20个不同来源条目，对比普通索引和证据索引的选错率、核查耗时及维护时间；若核查节省不足以覆盖证明维护，或用户将证明误当安全背书，则停止扩展。[Q05](#research-q05)

取固定20条记录同时核对 YAML、线上索引和宿主显示，再完成受控候选安装与禁用；分开统计发现耗时、错误选择与维护成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：4b7d5a3dfe4d99f334212bb29c4ce25c8971905e9d058049b54588167c9bc1f4。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 7086 | — | — | 306424 |
| .mjs | source | 4 | 1076 | 640 | 385 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+created%3A2026-09-26T03%3A39%3A21.784Z..2026-10-26T03%3A39%3A21.784Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A39%3A21.784Z..2026-10-26T03%3A39%3A21.784Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查社区目录如何转为宿主机器发现能力，以及覆盖、安全和维护边界是否影响采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要目录，合格交付是什么，是否是可安装插件？

**研究主题**：场景与需求

#### 完整回答

它服务两个角色：用户发现候选，维护者接受与发布条目。README 把自身定位为 curated list，随后给出 Discover 的索引地址；package.json 的 files 只有 README，并未声明 dsh.bundle。因此研究对象应视为目录和构建工程，不能把 npm 包自身当作功能插件。简单替代是浏览 GitHub 列表并逐个复制命令。成功判据是条目与来源可追溯、适用范围明确，以及宿主能读取索引，而非候选插件均通过验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/README.md#L7-L13)

作者明确目录定位及宿主发现使用方式

```text
> A curated list of plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`).

DeepSeek Harness is DeepSeek's open-source agent harness — a runnable coding agent (Web and headless), built on a framework where everything is a plugin: models, tools, sandboxes, session storage, UI, even the agent loop itself. Plugins can extend the official coding agent, swap out its core parts, or assemble something entirely different.

This list collects community plugins that are installable via `dsh plugin add` (each declares a `dsh.bundle` manifest). [PRs welcome](#contributing).

> 📡 **This list is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere: dsh gives a source 15 seconds, and the GitHub Pages copies of the same document — `https://awesome-dsh-plugin.com/index.json` and its mirror `https://dshmarket.com/index.json` — can exceed that from some networks. The Discover tab and the `plugin_market` agent tool then search the same entries. The index covers plugins published on npm with a known version; GitHub-only entries still install with the command beside them.
```

**依据 2 · 源码核查**：[package.json:1-19](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/package.json#L1-L19)

根包是列表文档包，不含 dsh.bundle

<details>
<summary>查看原文（19行）</summary>

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
  ],
  "keywords": [
    "awesome",
    "awesome-list",
    "dsh",
    "dsh-plugin",
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立条目如何进入宿主索引，哪些是本项目增量？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

entries.mjs 从 data/plugins 读取排序后的 YAML，每项独立文件，解决共同 README 编辑锚点的冲突面。build-index 把条目、npm 映射和 locale 交给 buildMarketIndex；后者要求已知包名、精确版本和整数发布时间，设置 category 和 npm 来源，逐条及整体调用官方 parseMarketIndex。官方格式及验证归属上游库；本工程贡献是把社区策展数据接入该协议并处理局部数据缺失。这让网页清单转为机器发现输入，但没有实现新的安装执行器，也未证明优于现有市场的真实发现效率。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/entries.mjs:1-18](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/lib/entries.mjs#L1-L18)

逐文件真相源与翻译回退的设计动机

<details>
<summary>查看原文（18行）</summary>

```text
// Shared entry model: the data/plugins/*.yml source of truth.
//
// One file per entry, keyed by slug, so two submissions never touch the same
// file — that is what removes the merge-conflict cascade the README-as-database
// layout produced (every submission appended at the same anchor).
import fs from 'node:fs'
import path from 'node:path'
import { load as yamlLoad, dump as yamlDump } from 'js-yaml'

export const PLUGINS_DIR = 'data/plugins'

// Locales the list publishes, in sync with site/locales.mjs.
//
// Only BASE_LOCALE is a contributor's responsibility. Asking submitters for
// every translation just filters for bilingual authors, not for good plugins,
// and it bounced a steady stream of otherwise-fine PRs. A missing translation
// is maintenance work for us, not a defect in their submission — so entries
// validate on English alone and generation falls back to it, leaving a
```

</details>

**依据 2 · 源码核查**：[scripts/lib/market-index.mjs:115-155](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/lib/market-index.mjs#L115-L155)

必需数据过滤、单项与整体官方解析

<details>
<summary>查看原文（41行）</summary>

```text
  for (const entry of entries) {
    const record = npmMap[entry.url]
    if (typeof record?.npm !== 'string' || record.npm === '') { skipped.noNpm += 1; continue }
    if (typeof record.version !== 'string' || record.version === '') { skipped.noVersion += 1; continue }
    if (!Number.isInteger(record.publishedAt)) { skipped.noPublishTime += 1; continue }

    const dsh = typeof record.enginesDsh === 'string' && semver.validRange(record.enginesDsh) !== null
      ? record.enginesDsh
      : undefined
    const description = localized(entry.description)
    const plugin = {
      name: record.npm,
      title: entry.name,
      ...(description === undefined ? {} : { description }),
      homepage: `${origin}/p/${slugOf(entry.url)}/`,
      repository: repositoryOf(entry.url),
      // Everything the format defaults is left out: `keywords: []` and
      // `engines: {}` cost bytes in every one of ~3,000 entries and say
      // nothing. The parser fills both back in.
      metadata: { category: entry.category },
      versions: [{
        version: record.version,
        publishTimestamp: record.publishedAt,
        source: { type: 'npm' },
        ...(dsh === undefined ? {} : { engines: { dsh } }),
      }],
    }
    // Validate one plugin at a time so a single bad row costs that row, not
    // the whole index; the caller sees exactly which entry and why.
    try {
      parseMarketIndex({ ...spec, plugins: [plugin] }, indexUrl)
      spec.plugins.push(plugin)
    } catch (error) {
      skipped.refused += 1
      refused.push(`${entry.url}: ${error.message}`)
    }
  }

  // The document as a whole, which is what a host actually parses.
  const index = parseMarketIndex(spec, indexUrl)
  return { index, skipped, refused }
```

</details>

**依据 3 · 源码核查**：[scripts/build-index.mjs:28-54](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/build-index.mjs#L28-L54)

装配及输出链路

<details>
<summary>查看原文（27行）</summary>

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
} else {
  // Minified: the host that reads this has a fixed 15 s fetch timeout, and
  // indentation is pure overhead on the wire.
  fs.writeFileSync(OUT_FILE, JSON.stringify(index) + '\n')
  console.log(`wrote ${OUT_FILE}`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目录格式通过能证明多少，哪些限制影响发现贡献？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是单项及整体官方解析器减少格式漂移，且对缺失 npm 元数据逐类计数，不把未知拼成有效记录。关键限制有两层。其一是 GitHub-only 条目因缺提交版本映射不进入 format-1 索引，网页全量和宿主索引覆盖不同。其二是 --check 分支仅解析已有 docs/index.json，不把它与新生成对象逐字比较，故该检查表达格式有效，不独立证明与当前 YAML 同步。README 又明确安装会以用户权限执行代码，目录不是安全审查。不能将这些限制写成已发生的安装事故。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/market-index.mjs:11-14](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/lib/market-index.mjs#L11-L14)

GitHub-only 覆盖边界

```text
 * What can be listed: an entry needs an npm package, an exact version, and
 * that version's publish time. The GitHub-only half of the list cannot be
 * expressed yet — format 1 wants a commit SHA per Git version, and this
 * repository records none.
```

**依据 2 · 源码核查**：[scripts/build-index.mjs:46-54](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/build-index.mjs#L46-L54)

check 只验证既有文件格式

```text
if (checkOnly) {
  if (!fs.existsSync(OUT_FILE)) throw new Error(`${OUT_FILE} does not exist`)
  const published = parseMarketIndex(JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')), 'https://awesome-dsh-plugin.com/index.json')
  console.log(`check: ${OUT_FILE} is a valid format-1 index (${published.plugins.length} plugins)`)
} else {
  // Minified: the host that reads this has a fixed 15 s fetch timeout, and
  // indentation is pure overhead on the wire.
  fs.writeFileSync(OUT_FILE, JSON.stringify(index) + '\n')
  console.log(`wrote ${OUT_FILE}`)
```

**依据 3 · 作者声明**：[README.md:28-42](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/README.md#L28-L42)

作者区分协议收录与安全或质量背书

<details>
<summary>查看原文（15行）</summary>

```text
> ℹ️ **On desktop clients.** This list is client-agnostic. A plugin is listed because it follows the official protocol — it declares a `dsh.bundle` manifest and installs with `dsh plugin add` — not because it adapts to any particular client.
>
> Clients worth a look: [dsh-desktop](https://github.com/dataelement/dsh-desktop), [deepseek-harness-desktop](https://github.com/hairyf/deepseek-harness-desktop), and [deepseek-harness-desktop](https://github.com/anywhere-labs/deepseek-harness-desktop) by anywhere-labs — all ship dsh-market built in, so everything on this list is one click away. Any other good third-party client works too.

> [!WARNING]
> Installing a plugin runs third-party code on your machine with your own permissions — it can read your files, use your credentials, and reach the network. Tool approvals don't sandbox plugin code. Being on this list is not a security review: check the source before you install, and try unfamiliar plugins somewhere that doesn't hold your keys. See the full disclaimer at the bottom of this page.

<details>
<summary><b>What it takes to be listed here</b></summary>

An entry is added when the plugin installs with `dsh plugin add`, does what its one-line description says, sits in the right category, and is maintained. Every submission is checked against its own source before merging — if a description claims "46 tools", someone counts them.

That is the whole bar. **This list doesn't rank plugins or judge their quality, and we don't want to.** Plenty of good software will never appear here, and a slot here proves nothing beyond meeting those rules. They exist so that whatever you pick installs and behaves the way the line said it would.

A listing isn't permanent either: entries whose repos go away, stop being maintained, or turn out to be broken get removed. Full criteria and the review checklist: [how submissions are reviewed](contributing.md#how-submissions-are-reviewed--收录如何评审).
```

</details>

#### 缺口

- 没有同版本宿主加载和目录同步效果测量
  **影响**：不能确认线上索引时效或安装成功率
  **进一步探讨**：抽样固定条目对比 YAML、发布索引与宿主显示，并分别记录加载和安装结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、维护和失败恢复由谁承担，收益怎样计量？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

普通用户只需可达索引与满足版本的 DSH；维护者才需要 Node、依赖和 GitHub Token。check-submission 在缺 Token 时退出，并限制枚举仓库包数，说明自动维护有 API 与覆盖预算。README 给出 npm CDN 来源是为应对宿主15秒获取窗口，不能据此宣称本次已测可达。应以一次找到并验证符合任务的插件为单位计量，而不是一次索引获取。首次配置、日常核查和恢复投入如下，目标插件自己的 API、服务与权限负担另计。

首次是配置索引和核对候选，持续是维护映射与复核版本，失败需要排查超时、过期记录和实际安装状态；索引的少量配置不能覆盖目标插件费用与权限负担。单位合格发现的现金和人工样本尚缺。分阶段表见[成本与效果](#cost-and-value)，来源和宿主条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-13](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/README.md#L11-L13)

作者解释索引来源及获取窗口

```text
This list collects community plugins that are installable via `dsh plugin add` (each declares a `dsh.bundle` manifest). [PRs welcome](#contributing).

> 📡 **This list is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere: dsh gives a source 15 seconds, and the GitHub Pages copies of the same document — `https://awesome-dsh-plugin.com/index.json` and its mirror `https://dshmarket.com/index.json` — can exceed that from some networks. The Discover tab and the `plugin_market` agent tool then search the same entries. The index covers plugins published on npm with a known version; GitHub-only entries still install with the command beside them.
```

**依据 2 · 源码核查**：[scripts/check-submission.mjs:21-32](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/check-submission.mjs#L21-L32)

API 检查的资源界限

<details>
<summary>查看原文（12行）</summary>

```text
const MIN_AGE_DAYS = 1
// There is deliberately no commit-count floor any more (dropped 2026-09-03,
// #4196). The old MIN_COMMITS = 10 filtered by a number that measures
// development HABIT, not quality: squash-merge repositories with years of
// real changes show a short main history, while `git commit --allow-empty`
// clears the bar in ten seconds. In practice it never rejected anything —
// every blocked submission either padded commits or waited, so its whole
// effect was delay plus a red X that primed the human review against clean
// histories. The age floor stays: it is the part that actually blocks
// hours-old throwaway repositories, and time cannot be counterfeited.
const CONCURRENCY = 6
const MAX_TREE_PKGS = 40
```

</details>

**依据 3 · 源码核查**：[scripts/check-submission.mjs:92-97](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/check-submission.mjs#L92-L97)

Token 是投稿检查必需条件

```text
const TOKEN = process.env.GITHUB_TOKEN
if (!TOKEN) {
  console.error('GITHUB_TOKEN is required (tree enumeration exceeds the anonymous quota)')
  process.exit(1)
}
const HEADERS = { accept: 'application/vnd.github+json', authorization: `Bearer ${TOKEN}`, 'user-agent': 'awesome-dsh-plugin-ci' }
```

#### 缺口

- 没有合格发现任务的时间与现金样本
  **影响**：不能给出单位合格发现成本或 ROI
  **进一步探讨**：用同一批需求对比直接仓库搜索与索引搜索，统计核查、修正及失败时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证证据附着索引的假设，什么用户值得先用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

现有实现解决格式与发现交接，但没有让特定版本运行证据成为条目的一部分。由这个明确缺口提出证据附着索引，并非认定当前目录有安全缺陷或已存在付费需求。采用上，已有 DSH 的用户可限定一个候选集试用，记录来源可达、找到合适条目及最终加载结果；普通网页用户仍可不配置宿主。改进实验应固定20条候选、同一任务提示及允许时间，比较普通索引和带验收范围的索引。只有选错率降低且维护总时间可接受才继续；如证明被误读为安全认证，需重新设计文案并停止扩展。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-42](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/README.md#L32-L42)

目录主动声明证据与安全边界

<details>
<summary>查看原文（11行）</summary>

```text
> [!WARNING]
> Installing a plugin runs third-party code on your machine with your own permissions — it can read your files, use your credentials, and reach the network. Tool approvals don't sandbox plugin code. Being on this list is not a security review: check the source before you install, and try unfamiliar plugins somewhere that doesn't hold your keys. See the full disclaimer at the bottom of this page.

<details>
<summary><b>What it takes to be listed here</b></summary>

An entry is added when the plugin installs with `dsh plugin add`, does what its one-line description says, sits in the right category, and is maintained. Every submission is checked against its own source before merging — if a description claims "46 tools", someone counts them.

That is the whole bar. **This list doesn't rank plugins or judge their quality, and we don't want to.** Plenty of good software will never appear here, and a slot here proves nothing beyond meeting those rules. They exist so that whatever you pick installs and behaves the way the line said it would.

A listing isn't permanent either: entries whose repos go away, stop being maintained, or turn out to be broken get removed. Full criteria and the review checklist: [how submissions are reviewed](contributing.md#how-submissions-are-reviewed--收录如何评审).
```

</details>

**依据 2 · 源码核查**：[scripts/lib/market-index.mjs:125-140](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/a7ae7b2a1295e96b2a84268ed0443f1aead14f33/scripts/lib/market-index.mjs#L125-L140)

当前输出字段围绕发布与分类，推导新增证明需独立协议与维护

<details>
<summary>查看原文（16行）</summary>

```text
    const plugin = {
      name: record.npm,
      title: entry.name,
      ...(description === undefined ? {} : { description }),
      homepage: `${origin}/p/${slugOf(entry.url)}/`,
      repository: repositoryOf(entry.url),
      // Everything the format defaults is left out: `keywords: []` and
      // `engines: {}` cost bytes in every one of ~3,000 entries and say
      // nothing. The parser fills both back in.
      metadata: { category: entry.category },
      versions: [{
        version: record.version,
        publishTimestamp: record.publishedAt,
        source: { type: 'npm' },
        ...(dsh === undefined ? {} : { engines: { dsh } }),
      }],
```

</details>

#### 缺口

- 用户核查负担和证据维护收益尚无实测
  **影响**：新方向仍是可证伪假设，不是已确认产品需求
  **进一步探讨**：邀请实际发现插件的用户在同条件任务中比较，并记录后续是否继续使用

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
