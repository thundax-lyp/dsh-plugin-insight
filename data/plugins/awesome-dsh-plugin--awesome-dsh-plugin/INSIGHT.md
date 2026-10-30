# Awesome DSH Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cef4c68](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/cef4c68878a028cee20f00fd7ded35d3f520b3b0)

<!-- BEGIN META -->
[![GitHub ★ 21,335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,288](https://img.shields.io/static/v1?label=npm+30d&message=1%2C288&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)
<!-- END META -->

> **功能**：把社区插件条目生成多语言目录、网页和官方格式市场索引，并公开工件能力披露数据，供用户查找候选后自行复核。

> **亮点**：统一多语言条目/官方format与npm目录分发，已有静态能力披露及失败保旧机制；不按收录数计质量，见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：--check仅验证已有索引格式；能力探测失败可保旧，但公开版本/能力字段无扫描版本绑定，且均非安装/安全通过，见 [Q03](#research-q03)。

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
  - [Q01 · 这是插件、市场运行时还是候选资源入口？](#detail-section-11)
  - [Q02 · 索引如何处理元数据缺口，验证覆盖哪一层？](#detail-section-12)
  - [Q03 · 能力披露数据如何产生，失败保留会导致什么边界？](#detail-section-13)
  - [Q04 · 如何采用目录而不把未知转成安装背书，下一步增量是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户查候选与来源，维护者从统一条目生成可读/机器目录；它是资源入口，见 [Q01](#research-q01)。

逐仓README/awesome列表、手工维护Host源与自行审计工件；目录统一发现不替代候选安装和授权判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多语言资源目录 | 找候选与命令 | 简介/命令不是实际通过 |
| format1市场索引 | Host发现npm子集 | 精确元数据/schema；非GitHub全量 |
| 公开能力数据 | 提示工件接触面 | 静态/可保旧/缺版本传播 |
| 发布工具 | Pages与npm目录分发 | 维护权限和外部写入需另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| YAML条目/locale/npm元数据 | 生成必需 | 目录与可表达npm子集 | 缺值跳过/解析失败 |
| 官方市场parser | 索引必需 | 按共享format验证 | 不是所有Host/安装已验 |
| 目标Host与可读源 | 加源时 | 发现候选 | CDN/Host兼容另核 |
| registry/GitHub/扫描器 | 维护披露时 | 工件/元数据/静态发现 | 失败可能保旧，不能当最新 |
| Node/发布令牌与权限 | 维护时 | 生成/Pages/npm分发 | 用户查看无需拥有发布权 |
| 候选运行时/权限 | 安装具体项时 | 真正功能 | 不由资源目录替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 维护输入 | 维护者写条目并探测元数据 | 缺失/拒条目明确 |
| 生成 | 共享builder/站点/scanner | 格式有效与披露来源分别核 |
| 分发 | workflow部署/另包发布 | 声明接线不等本轮线上成功 |
| 用户发现 | 按任务查候选/固定来源 | 版本与扫描事实对应 |
| 采用/退出 | 独立核具体功能和撤销 | 目录/健康字段不判安装通过 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 查看/加源资源低，金额未测；维护Node/API | 查候选/核来源；维护授权配置 | 候选安装另算 |
| 持续使用 | 探测下载/runner/临时空间未知 | 版本/披露/目录适配和人工核验 | 无净节时对照 |
| 失败恢复 | 重探/旧披露/缓存未知 | 分版本失败/格式/Host网络，防误采 | 保旧不等最新通过 |
| 退出 | 已装候选/下载/远端副本另计 | 删源/书签；插件与令牌独立撤 | 目录不统一清理目标 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选发现 | 条目到网页/格式索引 | 当前远端可读/正确选中 |
| 格式复用 | 单项/整文共用parser | 数据同步/全Host安装 |
| 能力披露 | 真实扫描/失败保旧/公开字段 | 外部规则覆盖/最新版本绑定 |
| 工程降重复 | HTML与目录共享输入 | 用户净节时/维护收益 |

> **思考**：--check仅验证已有索引格式；能力探测失败可保旧，但公开版本/能力字段无扫描版本绑定，且均非安装/安全通过，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一多语言条目/官方format与npm目录分发，已有静态能力披露及失败保旧机制；不按收录数计质量，见 [Q01](#research-q01) 至 [Q03](#research-q03)。

[Q02](#research-q02) 共享官方规则和逐项拒绝可借鉴；[Q03](#research-q03) 失败保旧必须把事实版本/状态带给消费者。

<a id="detail-section-5"></a>

### 1.4 主要限制

--check仅验证已有索引格式；能力探测失败可保旧，但公开版本/能力字段无扫描版本绑定，且均非安装/安全通过，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为查候选的有限入口，先核版本与工件，不把披露当安全背书；安装不合任务或版本不明即退原仓独立核，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的条目→索引/HTML与能力披露生产链可核，未构建/发布/访问线上或安装候选。只建议有限发现用途。

- 已检查：作者 README、包清单、源码路径 .github/workflows/build-site.yml、README.zh.md、package.json、scripts/build-index.mjs、scripts/build-site.mjs、scripts/check-submission.mjs、scripts/lib/capabilities.mjs、scripts/lib/entries.mjs、scripts/lib/market-index.mjs、scripts/probe-capabilities.mjs、scripts/publish-catalog.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核四材料摘要/固定身份；读条目读入、市场builder与真实站点/工作流/发布调用、安装命令输出、能力探测的工件/失败保留/临时清理与公开字段。未运行、构建、访问线上、安装候选或审外部scanner/parser/所有工作流，不把声明测试当通过。
- 下一步：两个版本+重扫失败复核公开绑定，目标Host固定少数候选核最小功能/授权/退出，再比较查找/复核和维护总时间。

**分析版本**

- **仓库**：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- **版本号**：0.1.0（[固定提交 cef4c68](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/cef4c68878a028cee20f00fd7ded35d3f520b3b0)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

传播扫描版本与失败状态，再用少量固定候选/Host最小任务和撤销残留证据补采用门槛，测误采/工时并可否定，见 [Q04](#research-q04)。

两个版本+重扫失败复核公开绑定，目标Host固定少数候选核最小功能/授权/退出，再比较查找/复核和维护总时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 16385 | — | — | 878585 |
| .mjs | test | 8 | 623 | 503 | 93 | — |
| .mjs | source | 32 | 6629 | 4085 | 2231 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录/索引与能力披露实际能支持哪些候选采用判断，哪里仍缺当前版本和安装结果证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是插件、市场运行时还是候选资源入口？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是社区插件资源目录及其静态站/索引生成工程，不是可安装DSH bundle或市场客户端。根包0.1.0的files只有两份README，不能把安装同名npm包当取得目录内插件功能。面向DSH用户查候选、比较简介/分发入口，也供维护者从一份结构数据生成多语言列表、网页与机器索引。原始awesome列表、逐仓README和手工维护Host索引是参照；增量是统一候选数据和可消费分发，条目数量、下载/星数都不是需求或插件质量。

实际readEntries按文件名排序解析data/plugins YAML，build-site取同源条目和npm映射；卡片按npm优先、否则作者Release、否则GitHub给安装命令，并写详情HTML。market-index把满足条件的npm子集转成官方format 1；构建站实际调用而非只提供helper，GitHub workflow按探测→构建→Pages部署声明接线。下游Host读取/安装及本轮远端成功未验证，网页命令是建议入口，不能等同已装或最小功能通过。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-14](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/package.json#L1-L14)

资源包只发README，没有dsh.bundle。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[scripts/lib/entries.mjs:77-107](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/entries.mjs#L77-L107)

源文件排序读取和YAML错误。

<details>
<summary>查看原文（31行）</summary>

```text
export function readEntries(dir = PLUGINS_DIR) {
  if (!fs.existsSync(dir)) return []
  const out = []
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith('.yml')) continue
    const full = path.join(dir, f)
    const text = fs.readFileSync(full, 'utf8')
    let doc
    try {
      doc = yamlLoad(text)
    } catch (e) {
      // By far the most common way a hand-written entry breaks: a description
      // like `en: Foo bar: baz` — an unquoted scalar containing ": " is a
      // mapping to YAML. Say so, because the parser's own message ("bad
      // indentation of a mapping entry") points nowhere useful.
      const loc = LOCALE_CODES.join('|')
      const head = new RegExp(`^\\s+(${loc}):\\s`)
      const culprit = text
        .split('\n')
        .find((l) => head.test(l) && /:\s/.test(l.replace(head, '')) && !new RegExp(`^\\s+(${loc}):\\s*['"]`).test(l))
      const hint = culprit
        ? `\n\n  A description containing ": " must be quoted:\n` +
          `    ${culprit.trim()}\n` +
          `  becomes\n` +
          `    ${culprit.trim().replace(new RegExp(`^((${loc}):\\s*)(.*)$`), (_, p, __, v) => `${p}'${v.replaceAll("'", "''")}'`)}`
        : ''
      throw new Error(`${full}: invalid YAML — ${e.reason ?? e.message}${hint}`)
    }
    out.push({ ...doc, file: toPosix(full) })
  }
  return out
```

</details>

**依据 3 · 源码核查**：[scripts/build-site.mjs:180-192](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L180-L192)

真实索引构建/写入。

<details>
<summary>查看原文（13行）</summary>

```text
const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}

// The plugin market index (format 1) that hosts read as a market source.
// Built here rather than in a second pass so the page can tell whether THIS
// deploy actually carries one: a push build restores the probe cache, and a
// cache from before the publish-time field existed lists nothing — in that
// case the panel is left out instead of advertising a URL that 404s.
const builtIndex = buildMarketIndex({ entries: readEntries(), npmMap, locales: LOCALES, origin: ORIGIN })
const indexBuilt = builtIndex.index.plugins.length > 0
// Minified, not pretty: the host that reads this has a fixed 15 s fetch
// timeout (dsh 0.2.1 `fetchTimeoutMs`), and one-space indentation added 25%
// to a document already close to that budget on slow networks.
if (indexBuilt) fs.writeFileSync('docs/index.json', JSON.stringify(builtIndex.index) + '\n')
```

</details>

**依据 4 · 源码核查**：[scripts/build-site.mjs:454-459](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L454-L459)

分发来源数据。

```text
  e.npm = npmMap[e.url]?.npm ?? null
  // Optional author-declared prebuilt release tarball (data/plugins/*.yml).
  // Some plugins ship only a built tarball and are not installable from
  // source at all, so `github:owner/repo` would hand users a broken command.
  e.tarball = tarballMap[e.url] ?? null
  e.cmdTarball = e.tarball ? `dsh plugin --profile web add "${e.tarball}"` : null
```

**依据 5 · 源码核查**：[scripts/build-site.mjs:534-535](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L534-L535)

安装命令优先级。

```text
function cardCmd(e) {
  return e.npm ? `dsh plugin --profile web add ${e.npm}` : (e.cmdTarball ?? e.cmdGit)
```

**依据 6 · 源码核查**：[scripts/build-site.mjs:558-574](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L558-L574)

卡片实际输出候选与命令。

<details>
<summary>查看原文（17行）</summary>

```text
    return `    <li class="card" ${attrs}>
      <div class="top">
        <h3><a href="${loc.urlPath}p/${e.slug}/" translate="no"><span class="owner">${esc(e.owner)}/</span>${esc(short)}</a></h3>
        ${e.stars != null ? `<span class="stars" translate="no">${e.stars}</span>` : ''}
        ${e.downloads != null ? `<span class="dl" translate="no" title="${loc.strings.P_DOWNLOADS}">${fmtNum(e.downloads)}</span>` : ''}
      </div>
      <a class="desc-link" href="${loc.urlPath}p/${e.slug}/" tabindex="-1"><p>${esc(e.descs[loc.code])}</p></a>
      <div class="foot">
        <a class="tag" href="${loc.urlPath}${e.cat}/">${loc.categories[e.cat]}</a>
        <details class="inst">
          <summary aria-haspopup="menu">${loc.strings.INSTALL_BTN} ▾</summary>
          <div class="menu" role="menu">
            <button type="button" role="menuitem" data-cmd="dsh plugin --profile web add dshmarket"><b>${loc.strings.MENU_MARKET}</b><small>${loc.strings.MENU_MARKET_HINT}</small></button>
            <div class="mi-cli">
              <b>${loc.strings.MENU_CLI}</b>
              <span class="cli" translate="no"><input readonly value="${esc(cmd)}" aria-label="${loc.COPY_LABEL}" spellcheck="false"><button class="copy" type="button" data-cmd="${esc(cmd)}" aria-label="${loc.COPY_LABEL}">${loc.COPY_TEXT}</button></span>
            </div>
```

</details>

**依据 7 · 源码核查**：[scripts/build-site.mjs:1067-1069](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L1067-L1069)

详情HTML真正写出。

```text
    const outDir = `${loc.out.replace(/index\.html$/, '')}p/${e.slug}`
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(`${outDir}/index.html`, page)
```

**依据 8 · 源码核查**：[.github/workflows/build-site.yml:224-238](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/.github/workflows/build-site.yml#L224-L238)

实际声明探测/构建/Pages发布。

<details>
<summary>查看原文（15行）</summary>

```text
          node scripts/probe-screenshots.mjs
          # Capability disclosure (#401): what each plugin touches — files,
          # network, shell, credentials — scanned from the artifact a user
          # would install. Runs every time, like the two probes above: it is
          # incremental by RELEASE (a new npm version invalidates that entry's
          # record) and by AGE for branch-sourced entries, so a normal push
          # re-scans a handful. The scanner is pinned inside the script; it
          # executes nothing from the scanned package and opens no sockets.
          node scripts/probe-capabilities.mjs
          node scripts/build-site.mjs
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs
      - id: deployment
        uses: actions/deploy-pages@v4
```

</details>

#### 缺口

- 未访问线上部署/下游Host或安装候选。
  **影响**：不能把固定源码接线解释为当前CDN及时可读、源启用成功或任何候选可用。
  **进一步探讨**：在用户目标Host核一个索引查询和一项固定版本来源，再在隔离配置核最小行为/退出，线上访问另标时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引如何处理元数据缺口，验证覆盖哪一层？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

build-index与build-site均用buildMarketIndex；输入是条目、npm-map和locale，不在此构建函数实时问npm。每项需要npm名、记录版本及整数发布时间，否则分别计缺失并跳过；仅GitHub条目不在该format1子集，不能把漏收录当不安全。版本行含npm source/发布时间及可解析的dsh engine，类别与多语言简介转换后先逐项交官方parseMarketIndex，失败只拒该项并给原因，末尾整文再解析。强项是共享官方规则降低自己维护schema的漂移，不能从注释“host不会拒”推所有Host版本接受或包真能安装。

build-index --check虽然先计算候选结果，但最后只parse已有docs/index.json；没有与新结果逐字或语义比较，不是新源数据已同步的证明。正常build-site确从当前数据重写非空索引，空索引分支不写且隐藏索引面板，不能把独立--check替代真实生成。发布脚本把docs/plugins.json和index.json组合哈希，未变不重发，暂存目录打包为另一个dsh-plugin-catalog，npm publish确实是外部写入，不能把root0.1.0当此目录发行版本。缩短简介/压缩JSON是体积设计，15秒预算来自作者指向的Host约束，本轮未核全Host或网络时延。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-index.mjs:19-29](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-index.mjs#L19-L29)

真实调用共享builder。

<details>
<summary>查看原文（11行）</summary>

```text
import { parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index'
import LOCALES from '../site/locales.mjs'
import { readEntries } from './lib/entries.mjs'
import { buildMarketIndex } from './lib/market-index.mjs'

const NPM_MAP_FILE = 'data/npm-map.json'
const OUT_FILE = 'docs/index.json'
const checkOnly = process.argv.includes('--check')

const npmMap = fs.existsSync(NPM_MAP_FILE) ? JSON.parse(fs.readFileSync(NPM_MAP_FILE, 'utf8')) : {}
const entries = readEntries()
```

</details>

**依据 2 · 源码核查**：[scripts/lib/market-index.mjs:115-140](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/market-index.mjs#L115-L140)

元数据条件/精确版本/来源/可选engine。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[scripts/lib/market-index.mjs:142-155](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/market-index.mjs#L142-L155)

逐条与整文官方parser。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 4 · 源码核查**：[scripts/build-index.mjs:46-54](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-index.mjs#L46-L54)

check只解析现有产物不比新结果。

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

**依据 5 · 源码核查**：[scripts/build-site.mjs:182-192](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L182-L192)

正常构建实际调用与空分支。

<details>
<summary>查看原文（11行）</summary>

```text
// The plugin market index (format 1) that hosts read as a market source.
// Built here rather than in a second pass so the page can tell whether THIS
// deploy actually carries one: a push build restores the probe cache, and a
// cache from before the publish-time field existed lists nothing — in that
// case the panel is left out instead of advertising a URL that 404s.
const builtIndex = buildMarketIndex({ entries: readEntries(), npmMap, locales: LOCALES, origin: ORIGIN })
const indexBuilt = builtIndex.index.plugins.length > 0
// Minified, not pretty: the host that reads this has a fixed 15 s fetch
// timeout (dsh 0.2.1 `fetchTimeoutMs`), and one-space indentation added 25%
// to a document already close to that budget on slow networks.
if (indexBuilt) fs.writeFileSync('docs/index.json', JSON.stringify(builtIndex.index) + '\n')
```

</details>

**依据 6 · 源码核查**：[scripts/publish-catalog.mjs:129-143](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/publish-catalog.mjs#L129-L143)

两产物哈希/去重/写暂存目录。

<details>
<summary>查看原文（15行）</summary>

```text
const built = fs.readFileSync(BUILT)
const index = fs.readFileSync(INDEX_BUILT)
// Both files, so a day that moves only the index still earns a version —
// the hash is what tells tomorrow's run there is nothing new to publish.
const hash = sha256(Buffer.concat([built, index]))
if (hash === await publishedHash()) {
  console.log(`catalog unchanged (${hash.slice(0, 12)}) — nothing to publish`)
  process.exit(0)
}

const entries = JSON.parse(built.toString()).plugins.length
const version = catalogVersion(new Date(), process.env.GITHUB_RUN_NUMBER ?? '0')
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-catalog-'))
fs.writeFileSync(path.join(stage, 'plugins.json'), built)
fs.writeFileSync(path.join(stage, 'index.json'), index)
```

</details>

**依据 7 · 源码核查**：[scripts/publish-catalog.mjs:155-169](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/publish-catalog.mjs#L155-L169)

不同目录包与真实publish副作用。

<details>
<summary>查看原文（15行）</summary>

```text
  license: 'CC0-1.0',
  keywords: ['dsh', 'dsh-plugin', 'deepseek-harness', 'deepseek', 'catalog', 'registry'],
  // The validator a consumer reads back on its next check, and what stops
  // this script republishing an identical catalog tomorrow.
  catalogSha: hash,
  exports: { './plugins.json': './plugins.json', './index.json': './index.json' },
  files: ['plugins.json', 'index.json'],
}, null, 2) + '\n')

console.log(`publishing ${PKG}@${version} — ${entries} entries, sha ${hash.slice(0, 12)}`)
// `DRY_RUN=1` runs everything up to and including npm's own packing checks
// without publishing, so the whole path can be exercised by hand.
const args = ['publish', '--access', 'public']
if (process.env.DRY_RUN === '1') args.push('--dry-run')
execFileSync('npm', args, { stdio: 'inherit', cwd: stage })
```

</details>

#### 缺口

- 未检查外部parser所有规则/Host实现或运行生成与发布；源数据与线上字节是否一致未知。
  **影响**：不能保证最新输入在当前源中可见、所有Host兼容或任何索引版本可安装。
  **进一步探讨**：只读比较当前输入生成预期与固定产物，再以目标Host固定版本核解析/查询和安装；发布前应另审外部写入范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能力披露数据如何产生，失败保留会导致什么边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

当前已存在能力披露，不能把未来方向仅写成加安全扫描。workflow先probe-capabilities再build-site；scanSourceFor优先npm映射的版本工件，否则作者tarball、否则GitHub HEAD，后两种version可为null。probe下载、解压到临时目录/子目录，调用本地scanner或npx回退，解析payload并记facts；外部dsh-trust-check的具体分析规则本轮未核，不借注释宣称覆盖完整或无漏洞。

事实带spec/version/scannedAt，按版本改变或无版本年龄重扫，失败保留旧record而非写空；临时扫描目录finally删除。有来源/更新时间是优点，但构建plugins.json按URL直接取capabilities/redLines/scannedAt，同时version用当前npm-map，未输出扫描spec/version或先要求与当前版本匹配。因此npm版本更新而本次扫描失败时，旧能力事实可能与当前安装入口并列，不能称当前版本已核，也不声称本轮实际线上发生。没有record时字段缺省，缺省、空发现、保留旧发现三种情况都不能读成安全通过。公开字段接线已核，不把它冒充本站每一处UI已显示。

收录检查另有仓库/清单/目录条件，不等安装运行审计；依赖官方市场parser、registry/GitHub数据、外部扫描器及发布权限。披露只宜提示用户核shell/网络/凭据等表面，尚未证明最小功能、账号隔离、用户同意或卸载无残留。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/capabilities.mjs:75-99](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/capabilities.mjs#L75-L99)

真实工件选择优先级与无版本HEAD。

<details>
<summary>查看原文（25行）</summary>

```text
export function scanSourceFor(entry, npmMap = {}, tarballs = {}) {
  const mapped = npmMap[entry.url]
  const npmName = mapped?.npm ?? (typeof entry.npm === 'string' && entry.npm !== '' ? entry.npm : null)
  const npmVersion = mapped?.version ?? null
  if (npmName !== null && npmName !== undefined) {
    // The packument's own tarball URL shape; the version comes from the same
    // map the rest of the build reads, so this costs no extra request.
    const file = npmName.startsWith('@') ? npmName.split('/')[1] : npmName
    return {
      kind: 'npm',
      url: npmVersion === null
        ? `https://registry.npmjs.org/${npmName}`
        : `https://registry.npmjs.org/${npmName}/-/${file}-${npmVersion}.tgz`,
      spec: `npm:${npmName}${npmVersion === null ? '' : `@${npmVersion}`}`,
      version: npmVersion,
    }
  }
  const declared = tarballs[entry.url]
  const tarball = typeof declared === 'string' ? declared : declared?.tarball ?? null
  if (typeof tarball === 'string' && tarball !== '') {
    return { kind: 'tarball', url: tarball, spec: `tarball:${entry.url}`, version: null }
  }
  const repo = repoOf(entry.url)
  if (repo === null) return null
  return { kind: 'github', url: `https://codeload.github.com/${repo}/tar.gz/HEAD`, spec: `github:${repo}`, version: null }
```

</details>

**依据 2 · 源码核查**：[scripts/lib/capabilities.mjs:114-119](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/capabilities.mjs#L114-L119)

重扫规则。

```text
export function shouldRescan(stored, source, now, recheckDays) {
  if (stored === undefined) return true
  if (source.version !== null) return stored.version !== source.version
  const scannedAt = Date.parse(stored.scannedAt)
  if (!Number.isFinite(scannedAt)) return true
  return now - scannedAt > recheckDays * 86_400_000
```

**依据 3 · 源码核查**：[scripts/probe-capabilities.mjs:53-71](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L53-L71)

scanner命令与npx回退。

<details>
<summary>查看原文（19行）</summary>

```text
 * the lockfile rather than in this string, and a bump is a reviewed diff), and
 * the local binary is what a normal run uses. `npx` remains the fallback so a
 * checkout without node_modules still works — it costs about a second per
 * entry, which over four thousand entries is the difference between a nightly
 * pass and an hour.
 */
function scannerCommand() {
  if (process.env.CAPABILITY_SCANNER !== undefined && process.env.CAPABILITY_SCANNER !== '') return process.env.CAPABILITY_SCANNER
  return fs.existsSync('node_modules/.bin/dsh-trust-check') ? 'node_modules/.bin/dsh-trust-check' : 'npx'
}

function scannerArgs(packageDir, spec) {
  return scannerCommand() === 'npx'
    ? ['--yes', TOOL, '--dir', packageDir, '--spec', spec, '--json']
    : ['--dir', packageDir, '--spec', spec, '--json']
}
/** `npm:@scope/name@1.2.3` or `npm:name@1.2.3` → the package name. */
function npmNameOf(spec) {
  const raw = spec.startsWith('npm:') ? spec.slice(4) : spec
```

</details>

**依据 4 · 源码核查**：[scripts/probe-capabilities.mjs:109-127](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L109-L127)

next保留旧记录/flush。

<details>
<summary>查看原文（19行）</summary>

```text
const stored = readJson(OUT_FILE)
const npmMap = readJson(NPM_MAP_FILE)
const tarballs = readJson(TARBALLS_FILE)
const entries = await readEntries('data/plugins')
const now = Date.now()

const next = { ...stored }

/**
 * Persist what has been scanned so far.
 *
 * A full pass is hours of downloads, and it used to write the file ONLY at the
 * end — so a runner that hit its job timeout, or a laptop that slept, threw
 * away every scan it had paid for. Flushing periodically makes the work
 * resumable: the next run skips whatever is already current.
 */
function flush() {
  const sorted = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)))
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(sorted, null, 1)}\n`)
```

</details>

**依据 5 · 源码核查**：[scripts/probe-capabilities.mjs:146-173](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L146-L173)

下载/解压/子目录/真实scanner调用。

<details>
<summary>查看原文（28行）</summary>

```text
async function scanEntry(entry) {
  const source = scanSourceFor(entry, npmMap, tarballs)
  if (source === null) { skipped += 1; return }
  if (!PROBE_ALL && !shouldRescan(stored[entry.url], source, now, RECHECK_DAYS)) { kept += 1; return }
  const dir = fs.mkdtempSync(join(os.tmpdir(), 'dshm-cap-'))
  try {
    const file = join(dir, 'package.tgz')
    await download(source.url, file)
    const extracted = join(dir, 'x')
    fs.mkdirSync(extracted)
    await run('tar', ['xzf', file, '-C', extracted], { maxBuffer: 1024 * 1024 })
    // Both npm tarballs and codeload archives wrap everything in one top-level
    // directory; a subdirectory entry starts one level further in.
    const top = fs.readdirSync(extracted).filter(name => !name.startsWith('.'))[0]
    if (top === undefined) throw new Error('empty archive')
    const sub = subdirOf(entry.url)
    const packageDir = sub === null ? join(extracted, top) : join(extracted, top, sub)
    if (!fs.existsSync(packageDir)) throw new Error(`no such subdirectory: ${sub}`)
    const { stdout: raw } = await run(scannerCommand(), scannerArgs(packageDir, source.spec),
      { encoding: 'utf8', timeout: SCAN_TIMEOUT_MS, maxBuffer: 8 * 1024 * 1024 })
    const payload = JSON.parse(raw)
    if (source.kind === 'npm' && source.version !== null) {
      const provenance = await lookupProvenance(source.spec, source.version, payload)
      if (provenance !== undefined) payload.provenance = provenance
    }
    const facts = rememberPrevious(stored[entry.url], factsFromScan(payload, {
      spec: source.spec, version: source.version, tool: TOOL, now: new Date(now).toISOString(),
    }))
```

</details>

**依据 6 · 源码核查**：[scripts/probe-capabilities.mjs:174-202](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L174-L202)

无事实/异常保旧与临时目录清理。

<details>
<summary>查看原文（29行）</summary>

```text
    if (facts === null) {
      // Say WHICH nothing this was. Most of these are a package whose entry
      // file is a build product the repository does not ship — the scanner
      // answers `primary entry unreadable or missing: lib/index.js`, which is
      // exactly the case an npm-sourced scan avoids (measured: 957 of them on
      // the first full pass, when a missing data/npm-map.json sent every entry
      // down the GitHub branch). That sentence is the difference between a
      // count and something a maintainer can act on.
      const why = Array.isArray(payload.errors) && typeof payload.errors[0]?.message === 'string'
        ? payload.errors[0].message
        : `no plugin record (schemaVersion ${String(payload.schemaVersion)})`
      throw new Error(why)
    }
    next[entry.url] = facts
    scanned += 1
    sinceFlush += 1
    if (sinceFlush >= FLUSH_EVERY) {
      sinceFlush = 0
      // Progress, because a full pass is hours and a silent log cannot be told
      // apart from a hung one.
      console.log(`  … ${scanned} scanned, ${failed} failed, ${kept} current (${flush()} records)`)
    }
  } catch (error) {
    failed += 1
    const message = error instanceof Error ? error.message.slice(0, 120) : String(error)
    failures.set(message, (failures.get(message) ?? 0) + 1)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
```

</details>

**依据 7 · 源码核查**：[scripts/lib/capabilities.mjs:167-182](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/lib/capabilities.mjs#L167-L182)

payload形状与版本/spec/时间入库。

<details>
<summary>查看原文（16行）</summary>

```text
export function factsFromScan(payload, fallback) {
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) return null
  if (!READABLE_SCHEMAS.has(payload.schemaVersion)) return null
  const plugins = Array.isArray(payload.plugins) ? payload.plugins : []
  const first = plugins.find(plugin => plugin !== null && typeof plugin === 'object')
  if (first === undefined) return null
  const strings = (value) => Array.isArray(value)
    ? [...new Set(value.filter(item => typeof item === 'string' && item !== ''))]
    : []
  const record = {
    version: typeof first.version === 'string' && first.version !== '' ? first.version : fallback.version,
    spec: typeof first.spec === 'string' && first.spec !== '' ? first.spec : fallback.spec,
    capabilities: strings(first.capabilities),
    redLines: dropCompareOnlyIpRedLines(strings(first.redLines), first.destinations),
    scannedAt: fallback.now,
    tool: fallback.tool,
```

</details>

**依据 8 · 源码核查**：[scripts/build-site.mjs:1136-1165](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L1136-L1165)

当前版本及能力事实发布字段，未带扫描版本绑定。

<details>
<summary>查看原文（30行）</summary>

```text
      url: e.url,
      page: `${ORIGIN}/p/${e.slug}/`,
      category: e.cat,
      description: Object.fromEntries(LOCALES.map((l) => [l.code, e.descs[l.code]])),
      npm: e.npm,
      // The author-declared release asset, when there is one. `install` folds
      // it into a display string, but a consumer that only reads `npm` sees
      // null and falls back to `github:owner/repo` — a different artifact from
      // the one the listing tells a human to install, and for a plugin that
      // ships no built output, one that does not install at all. Recovering it
      // by parsing the command string is not a contract worth offering, so the
      // field is published directly. Omitted when absent, like `screenshots`.
      tarball: e.tarball ?? undefined,
      // Current npm `latest` when known. null = github-only (`npm` null) or
      // probed with no latest tag. Not the same signal as `downloads`.
      version: e.version,
      stars: e.stars,
      downloads: e.downloads,
      downloadsStart: downloadsMap[e.url]?.start ?? null,
      downloadsEnd: downloadsMap[e.url]?.end ?? null,
      downloadsCheckedAt: downloadsMap[e.url]?.checkedAt ?? null,
      // Capability disclosure (#401). Omitted entirely when the entry was not
      // scanned, so a consumer cannot read "absent" as "empty" — the market
      // renders a missing pair as 未检出 / not checked.
      ...(capabilitiesMap[e.url] === undefined ? {} : {
        capabilities: capabilitiesMap[e.url].capabilities,
        capabilityRedLines: capabilitiesMap[e.url].redLines,
        capabilityCheckedAt: capabilitiesMap[e.url].scannedAt,
      }),
      install: e.npm ? `dsh plugin --profile web add ${e.npm}` : (e.cmdTarball ?? e.cmdGit),
```

</details>

**依据 9 · 源码核查**：[scripts/check-submission.mjs:1-15](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/check-submission.mjs#L1-L15)

仓库/清单收录门槛边界。

<details>
<summary>查看原文（15行）</summary>

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
//
//   node scripts/check-submission.mjs --base <sha> [--pr-created <iso>] [--json out.json]
```

</details>

**依据 10 · 源码核查**：[.github/workflows/build-site.yml:225-233](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/.github/workflows/build-site.yml#L225-L233)

扫描真实生产接线。

```text
          # Capability disclosure (#401): what each plugin touches — files,
          # network, shell, credentials — scanned from the artifact a user
          # would install. Runs every time, like the two probes above: it is
          # incremental by RELEASE (a new npm version invalidates that entry's
          # record) and by AGE for branch-sourced entries, so a normal push
          # re-scans a handful. The scanner is pinned inside the script; it
          # executes nothing from the scanned package and opens no sockets.
          node scripts/probe-capabilities.mjs
          node scripts/build-site.mjs
```

#### 缺口

- 未审外部扫描器覆盖/漏洞，未测版本更新+重扫失败的公共字段/消费端表现，也未装候选。
  **影响**：目录可信提示不能替代当前工件审计，且消费端可能把旧发现套给最新入口，影响是否应授权或安装。
  **进一步探讨**：用固定两版本和强制扫描失败样本比较存储/发布，核扫描版本与安装来源是否绑定；随后独立核少数候选的权限/最小行为/退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用目录而不把未知转成安装背书，下一步增量是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

DSH用户可先把它作查候选的资源，用简介缩小范围后固定仓库/版本/分发物复查；是否添加源由目标Host验证，是否装某插件另作决定。首次查看/复制索引门槛低，但安装、账户、模型费用、shell权限及退出成本属于候选，不在目录控制。维护者另需Node/npm依赖、GitHub API配额/令牌、探测和Pages/npm发布权限，扫描下载/子进程/临时空间与失败重探都有费用和人工，不能以静态列表推维护免费。

持续要看源更新时间和本项扫描版本，不因npm latest就默认对应能力事实；失败先撤去有问题源或回原仓核包，不反复安装覆盖已有效配置。退出查看可删除书签/索引源，已装插件、下载物和令牌/远端资料需单独核撤销，目录没有替用户统一清理的运行时。

未来先把已有扫描的版本/spec及失败保留状态传播到消费者，再为少数固定候选/Host版本记录最小安装、具体功能和撤销残留证据；相对现有schema/静态披露增加可执行采用证据，不把“加字段”独立当高创新。未知项仍可发现但显示未验证。比较当前目录+人工核与证据版在错包/过期事实误用/安装残留、正确候选率及核验与维护总时间；若不能降低误采或证据维护过重，停止扩大，只保留版本绑定的局部修复。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh.md:11-14](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/README.zh.md#L11-L14)

作者给具体查找/加源方式，未作本轮线上验证。

```text
本列表收录可通过 `dsh plugin add` 安装的社区插件（均声明了 `dsh.bundle` manifest）。欢迎 [PR](#贡献)。

> 📡 **这份列表也可以当作插件市场索引。** dsh 0.2.1 起，打开 **插件 → 发现（Discover）→ 索引源（Index sources）**，添加 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`。它就是这份列表的 format 1 索引，放在 npm 上分发，所以在哪里都快：dsh 给索引源的时间只有 15 秒，而同一份文档的 GitHub Pages 地址——`https://awesome-dsh-plugin.com/index.json` 及其镜像 `https://dshmarket.com/index.json`——在部分网络下会超过这个时间。官方的发现页和 `plugin_market` 智能体工具就能搜索同一份条目。索引收录在 npm 上发布、有明确版本的插件；仅 GitHub 的条目仍可用每个插件旁边的命令安装。

```

**依据 2 · 源码核查**：[package.json:23-30](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/package.json#L23-L30)

维护依赖而非用户运行时。

```text
  "devDependencies": {
    "@deepseek-ai/dsh-plugin-market-index": "^0.2.1-alpha.4",
    "dsh-trust-check": "^0.2.1",
    "js-yaml": "^5.3.0",
    "marked": "^18.0.9",
    "semver": "^7.8.5"
  }
}
```

**依据 3 · 源码核查**：[.github/workflows/build-site.yml:88-94](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/.github/workflows/build-site.yml#L88-L94)

维护安装与网络失败背景。

```text
      - run: npm ci
        env:
          # The lockfile pins registry.npmmirror.com URLs. On GitHub runners that CDN
          # has repeatedly returned 503/504 and hung `npm ci` for tens of minutes
          # (2026-10-19). Fetch from npmjs in CI; local installs keep their own registry.
          npm_config_registry: https://registry.npmjs.org/
          npm_config_replace_registry_host: always
```

**依据 4 · 源码核查**：[.github/workflows/build-site.yml:145-149](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/.github/workflows/build-site.yml#L145-L149)

探测权限条件。

```text
          restore-keys: updates-v1-
      - name: Build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # The nightly run is the authoritative refresh: it re-checks every
```

**依据 5 · 源码核查**：[scripts/probe-capabilities.mjs:146-165](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L146-L165)

扫描资源与临时空间。

<details>
<summary>查看原文（20行）</summary>

```text
async function scanEntry(entry) {
  const source = scanSourceFor(entry, npmMap, tarballs)
  if (source === null) { skipped += 1; return }
  if (!PROBE_ALL && !shouldRescan(stored[entry.url], source, now, RECHECK_DAYS)) { kept += 1; return }
  const dir = fs.mkdtempSync(join(os.tmpdir(), 'dshm-cap-'))
  try {
    const file = join(dir, 'package.tgz')
    await download(source.url, file)
    const extracted = join(dir, 'x')
    fs.mkdirSync(extracted)
    await run('tar', ['xzf', file, '-C', extracted], { maxBuffer: 1024 * 1024 })
    // Both npm tarballs and codeload archives wrap everything in one top-level
    // directory; a subdirectory entry starts one level further in.
    const top = fs.readdirSync(extracted).filter(name => !name.startsWith('.'))[0]
    if (top === undefined) throw new Error('empty archive')
    const sub = subdirOf(entry.url)
    const packageDir = sub === null ? join(extracted, top) : join(extracted, top, sub)
    if (!fs.existsSync(packageDir)) throw new Error(`no such subdirectory: ${sub}`)
    const { stdout: raw } = await run(scannerCommand(), scannerArgs(packageDir, source.spec),
      { encoding: 'utf8', timeout: SCAN_TIMEOUT_MS, maxBuffer: 8 * 1024 * 1024 })
```

</details>

**依据 6 · 源码核查**：[scripts/probe-capabilities.mjs:196-202](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/probe-capabilities.mjs#L196-L202)

失败和临时目录退出。

```text
  } catch (error) {
    failed += 1
    const message = error instanceof Error ? error.message.slice(0, 120) : String(error)
    failures.set(message, (failures.get(message) ?? 0) + 1)
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
```

**依据 7 · 源码核查**：[scripts/build-site.mjs:1136-1165](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/build-site.mjs#L1136-L1165)

版本/披露传播缺口与下一步增量。

<details>
<summary>查看原文（30行）</summary>

```text
      url: e.url,
      page: `${ORIGIN}/p/${e.slug}/`,
      category: e.cat,
      description: Object.fromEntries(LOCALES.map((l) => [l.code, e.descs[l.code]])),
      npm: e.npm,
      // The author-declared release asset, when there is one. `install` folds
      // it into a display string, but a consumer that only reads `npm` sees
      // null and falls back to `github:owner/repo` — a different artifact from
      // the one the listing tells a human to install, and for a plugin that
      // ships no built output, one that does not install at all. Recovering it
      // by parsing the command string is not a contract worth offering, so the
      // field is published directly. Omitted when absent, like `screenshots`.
      tarball: e.tarball ?? undefined,
      // Current npm `latest` when known. null = github-only (`npm` null) or
      // probed with no latest tag. Not the same signal as `downloads`.
      version: e.version,
      stars: e.stars,
      downloads: e.downloads,
      downloadsStart: downloadsMap[e.url]?.start ?? null,
      downloadsEnd: downloadsMap[e.url]?.end ?? null,
      downloadsCheckedAt: downloadsMap[e.url]?.checkedAt ?? null,
      // Capability disclosure (#401). Omitted entirely when the entry was not
      // scanned, so a consumer cannot read "absent" as "empty" — the market
      // renders a missing pair as 未检出 / not checked.
      ...(capabilitiesMap[e.url] === undefined ? {} : {
        capabilities: capabilitiesMap[e.url].capabilities,
        capabilityRedLines: capabilitiesMap[e.url].redLines,
        capabilityCheckedAt: capabilitiesMap[e.url].scannedAt,
      }),
      install: e.npm ? `dsh plugin --profile web add ${e.npm}` : (e.cmdTarball ?? e.cmdGit),
```

</details>

**依据 8 · 源码核查**：[scripts/publish-catalog.mjs:164-169](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/cef4c68878a028cee20f00fd7ded35d3f520b3b0/scripts/publish-catalog.mjs#L164-L169)

维护发布外部副作用。

```text
console.log(`publishing ${PKG}@${version} — ${entries} entries, sha ${hash.slice(0, 12)}`)
// `DRY_RUN=1` runs everything up to and including npm's own packing checks
// without publishing, so the whole path can be exercised by hand.
const args = ['publish', '--access', 'public']
if (process.env.DRY_RUN === '1') args.push('--dry-run')
execFileSync('npm', args, { stdio: 'inherit', cwd: stage })
```

#### 缺口

- 没有用户查找/正确安装/退出的对照，也未测新增证据维护成本和消费端误读频率。
  **影响**：可推荐有限发现用途，不能推荐目录内任意插件或宣称安装证据产品已验证值钱。
  **进一步探讨**：先两版本失败样本验证绑定，再做少量固定Host候选的具体最小任务/撤销，测正确率/残留/总工时，缺收益则停。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
