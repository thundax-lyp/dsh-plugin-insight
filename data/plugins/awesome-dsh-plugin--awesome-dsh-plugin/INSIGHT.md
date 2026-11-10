# Awesome DSH Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[55f70e0](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e)

<!-- BEGIN META -->
[![GitHub ★ 23,963](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23%2C963&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) [![npm 30d 1,974](https://img.shields.io/static/v1?label=npm+30d&message=1%2C974&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin) [![最新发布 2026-08-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/awesome-dsh-plugin)
<!-- END META -->

> **功能**：整理 DSH 社区插件条目，生成双语目录、网站与插件市场索引。

> **亮点**：把条目维护、双语发现和市场索引接到同一数据链。读者能从类别入口找到实际组件位置，维护者可针对根与子包区分门禁问题。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：目录检查、市场索引和能力扫描各自使用不同输入。扫描失败会保留旧记录，公开时间与当前版本不能直接绑定，子包还可能在工件内找不到原仓库路径。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 一条提交如何进入生成目录，门禁能确认哪些事情？](#detail-section-11)
  - [Q02 · 网站数据和 DSH 市场索引分别表达哪些条目？](#detail-section-12)
  - [Q03 · 能力披露在哪个工件上运行，失败怎样显示？](#detail-section-13)
  - [Q04 · 读者和维护者分别怎样采用，付出什么代价？](#detail-section-14)
  - [Q05 · 如何验证版本标识是否减少旧扫描误读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要按类别寻找 DSH 扩展的读者，可用目录找候选、前置条件和上游链接。维护者则可从分散的条目文件生成多种展示。

直接在 GitHub 搜索时，用户需要逐仓归类、核对路径和整理候选。静态列表可以手工维护，站点从同一组条目生成多种输出，并按单独条件补充包和能力信息。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 候选目录 | 按类别定位项目和组件 | 条目说明需回源核查 |
| 市场索引 | 在 DSH 内检索 npm 候选 | 缺包、版本或发布时间会被过滤 |
| 能力披露 | 提供静态权限线索 | 失败可能沿用旧记录，须核对扫描工件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可访问目录或 README | 发现必需 | 找候选与上游 | 改走仓库搜索 |
| DSH 兼容市场格式 | 宿主内索引需用 | 读取 format 1 | 回网站找条目 |
| GitHub、npm、扫描器和构建缓存 | 维护需用 | 补齐工件、指标和能力 | 记录可能缺失或沿用上次结果 |
| 候选实际版本和宿主条件 | 安装前核查需用 | 确认路径、权限及兼容 | 暂停使用目录命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 读者按类选候选 | 找到仓库和准确组件路径 |
| 2 | 读者回上游固定工件 | 核对版本、前置服务和脚本，缺失则暂停 |
| 3 | 维护者核对扫描绑定 | 实际工件与记录一致，失败或旧版本明确标识 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 发现 | 访问目录需网络，金额未知 | 筛选类别、回源确认 | 每份有效候选耗时未知 |
| 维护 | API、下载、扫描与构建资源，金额未知 | 查失败、缺项与翻译 | 缓存有助于控制重跑，节省量未知 |
| 失败恢复 | 重跑资源成本未知 | 读者切回仓库，维护者复核旧记录 | 实际失败频率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双语发现 | 条目按类别生成 README 与站点 | 实际覆盖完整度 |
| 宿主内索引 | 按 npm 信息筛选并解析 | 当前远端可用性及安装成功率 |
| 权限线索 | 收集静态扫描披露 | 漏检、匹配安装工件与真正权限行为 |

> **思考**：目录检查、市场索引和能力扫描各自使用不同输入。扫描失败会保留旧记录，公开时间与当前版本不能直接绑定，子包还可能在工件内找不到原仓库路径。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把条目维护、双语发现和市场索引接到同一数据链。读者能从类别入口找到实际组件位置，维护者可针对根与子包区分门禁问题。见 [Q01](#research-q01) 与 [Q02](#research-q02)。

目录数据、格式化输出、准入判定和扫描分别有实现路径。门禁显式区分不完整和拒绝，扫描按版本或时间增量更新。后者缺少工件身份与公开字段的完整绑定。见 [Q01](#research-q01) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

目录检查、市场索引和能力扫描各自使用不同输入。扫描失败会保留旧记录，公开时间与当前版本不能直接绑定，子包还可能在工件内找不到原仓库路径。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

把目录当候选清单。先定位上游和组件，再核对准备使用的版本、安装脚本和权限。如果索引缺条目，可回网站寻找。如果扫描工件不明，应独立读所选版本。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持目录生成、投稿门禁、索引筛选和能力披露的实现判断。现网部署、实际扫描精度与候选安装效果待核验。

- 已检查：作者 README、包清单、源码路径 .github/workflows/build-site.yml、.github/workflows/pr-gate.yml、README.zh.md、contributing.md、data/plugins/01men__DeptAI-UI-DSH.yml、package.json、scripts/build-site.mjs、scripts/check-submission.mjs、scripts/generate-readme.mjs、scripts/lib/capabilities.mjs、scripts/lib/market-index.mjs、scripts/probe-capabilities.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查生成、提交门禁、市场索引、扫描包装和公开字段。候选包、扫描器内部、线上部署及消费者未执行验证。
- 下一步：分别抽取 Git-only、npm 子包和扫描失败样本，对比条目、公开数据和实际工件。再按同类发现任务记录识别错误与时间。

**分析版本**

- **仓库**：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- **版本号**：0.1.0（[固定提交 55f70e0](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/tree/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用实际扫描的版本、最近成功时间和本次失败状态一起标注能力记录，可能减少旧披露被误读成当前事实。可用同一组候选比较识别错误与维护时间。见 [Q05](#research-q05)。

分别抽取 Git-only、npm 子包和扫描失败样本，对比条目、公开数据和实际工件。再按同类发现任务记录识别错误与时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 21197 | — | — | 1220766 |
| .mjs | test | 8 | 623 | 503 | 93 | — |
| .mjs | source | 32 | 6629 | 4085 | 2231 | — |

</details>

**活跃度**

[![近30天新建 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=30&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：读者如何用目录选择候选，哪些目录、索引与扫描记录必须回到真实安装工件核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一条提交如何进入生成目录，门禁能确认哪些事情？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对想按类别发现 DSH 候选的用户，目录提供集中检索和源链接。对维护者，它把条目写入分散的 YAML，再生成中英文 README。代码在生成时逐项按分类和语言取描述，缺翻译时回退。投稿门禁使用基线仓库的脚本，取 PR 的条目数据检查。它读取目标路径的 package.json，对子目录要求有 bundle；根没有 bundle 而发现子包时会提示改到具体路径。该 contents 请求没有传 ref，故只能说明默认视图下目标路径的声明检查，不能据此确认条目 URL 所写分支或后续安装工件。API 不足而无法检查的结果可在工作流回报为 neutral，与成功区分，也与明确不合格区分。贡献指南描述人工复核分类、真实行为和重复条目，这是一种维护规范，不能据此推断每条已收录项都逐项审计过。项目自身包只列 README 分发，没有 DSH bundle 字段，实际用途是目录资源。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-29](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/package.json#L1-L29)

自身包元数据和发布文件指向目录，不注册 DSH bundle。

<details>
<summary>查看原文（29行）</summary>

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
    "deepseek-harness",
    "deepseek"
  ],
  "devDependencies": {
    "@deepseek-ai/dsh-plugin-market-index": "^0.2.1-alpha.4",
    "dsh-trust-check": "^0.2.1",
    "js-yaml": "^5.3.0",
    "marked": "^18.0.9",
    "semver": "^7.8.5"
  }
```

</details>

**依据 2 · 作者声明**：[contributing.md:90-103](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/contributing.md#L90-L103)

维护者声明的人工复核范围。

<details>
<summary>查看原文（14行）</summary>

```text
### How submissions are reviewed / 收录如何评审

A green CI run is the **precondition**, not the decision. CI verifies the shape of a submission — manifest, repo age, formatting, that the READMEs regenerate. It cannot tell whether a plugin does what its entry says, whether the category fits, or whether an entry duplicates one already on the list. A maintainer reads the target repository before merging.

CI 通过是**前置条件**，不是结论。CI 校验的是提交的形式——manifest、仓库年龄、格式、README 能否重新生成；它无法判断插件是否名副其实、分类是否贴切、是否与已有条目重复。合并前维护者会实际阅读目标仓库。

What that review looks at / 评审会看：

1. **Does the code do what the entry claims** — including any numbers or API names in the description. / 代码是否与条目声明一致，包括描述里的数字与 API 名称。
2. **Is the category reasonable.** Nobody gets sent back over a category — if a better one fits, a maintainer just changes it. The taxonomy itself keeps moving: categories get split as they grow — `usage` and `vision` came from that, and so did `security`, `browser`, `git`, `docs`, `remote` and `voice`, all split out of `tools`, `ui` and `dev` once those had grown past the point where anyone could scan them — and categories get renamed or merged when they stop being useful. Today's best fit may be re-filed later; that is maintenance, not a correction of your judgement. Pick the closest one and don't agonise. / 分类是否合理。**不会有人因为分类被打回**——如果有更贴切的，维护者直接改。分类体系本身也在变：某一类长大了就会拆分——`usage` 与 `vision` 就是这么来的，`security`、`browser`、`git`、`docs`、`remote`、`voice` 也是，它们都是在 `tools`、`ui`、`dev` 大到没人能扫完之后从中拆出来的——不再有用的分类则会改名或合并。今天最贴切的归类以后也可能被重新归档，那是维护，不是在纠正你的判断。挑最接近的一个即可，不必纠结。
3. **Is it real, working code** rather than a placeholder or a wrapper around nothing. / 是否是真实可用的代码，而非占位或空壳。
4. **Is it already covered** by an entry on the list. Where two plugins do the same thing, whoever got here first keeps the slot — but that is a tiebreaker, not tenure. Being listed is not permanent: entries that stop being maintained, behave badly, or carry obvious defects get removed. So a fork *is* added when it is the better-kept one, or when it genuinely adds something. The rule is not first-come; the rule is whichever is better. / 是否已被现有条目覆盖。两个插件做同一件事时，先来者保留位置——但这只是平局时的排序依据，不是既得利益。收录不是永久的：停止维护、有恶意行为、存在明显缺陷的条目会被移除。所以一个分叉**是可以**被收录的——只要它维护得更好，或者确实做了新东西。规则不是先来后到，规则是谁更好。
5. **Anything alarming in the source** — obfuscated code, credential exfiltration, surprising install-time behaviour. Being listed is still **not** a security review (see the warning at the top of the README); this is a sanity check, not an audit. / 源码中是否有可疑之处——混淆代码、凭据外传、异常的安装期行为。收录仍**不等于**做过安全审查（见 README 顶部警告），这只是常识性检查，不是审计。
6. **Does the PR touch entries it has no business touching.** A PR updating one plugin should not rewrite another's description. This slipped through twice ([#1348](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues/1348)) because every mechanical check passed — the YAML was valid, the READMEs regenerated, lint was clean. The gate now lists every existing entry a PR modifies so it can be questioned. / PR 是否动了与它无关的条目。更新某个插件的 PR 不该改写另一个插件的描述。这类问题曾两次蒙混过关（[#1348](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/issues/1348)）——因为所有机械检查都通过了：YAML 合法、README 能生成、lint 干净。现在 gate 会列出 PR 修改的每一个既有条目，以便被追问。
```

</details>

**依据 3 · 源码核查**：[scripts/generate-readme.mjs:140-166](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/generate-readme.mjs#L140-L166)

按分类写出条目，并处理缺翻译。

<details>
<summary>查看原文（27行）</summary>

```text
  const plugins = used
    .map((id) => {
      const lines = ordered
        .filter((e) => e.category === id)
        .map((e) => {
          // Untranslated entries render their English text rather than blocking
          // the build — an honest gap a maintainer closes later.
          const d = e.description[loc.code] ?? e.description[BASE_LOCALE]
          if (e.description[loc.code] === undefined) untranslated.push(`${loc.readme}: ${e.url}`)
          return `- [${e.name}](${e.url}) ${loc.sep} ${escapeRefs(d)}`
        })
      return `### ${headingFor(loc, id)}\n\n${lines.join('\n')}`
    })
    .join('\n\n')

  const before = normalizeNewlines(fs.readFileSync(loc.readme, 'utf8'))
  let after = replaceBlock(before, MARKERS.toc, toc, loc.readme)
  after = replaceBlock(after, MARKERS.plugins, plugins, loc.readme)

  if (before !== after) {
    if (CHECK) {
      console.error(`${loc.readme} is out of sync with data/plugins/`)
      stale = true
      continue
    }
    fs.writeFileSync(loc.readme, after)
    console.log(`${loc.readme}: regenerated (${ordered.length} entries)`)
```

</details>

**依据 4 · 源码核查**：[.github/workflows/pr-gate.yml:87-96](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/.github/workflows/pr-gate.yml#L87-L96)

门禁工作流在基线执行工具。

<details>
<summary>查看原文（10行）</summary>

```text
      # Trusted code only: the base repo's default branch, never the PR's.
      - uses: actions/checkout@v4
        if: steps.pr.outputs.found == 'true'
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        if: steps.pr.outputs.found == 'true'
        with:
          node-version: 22
      - run: npm ci
```

</details>

**依据 5 · 源码核查**：[.github/workflows/pr-gate.yml:146-153](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/.github/workflows/pr-gate.yml#L146-L153)

通过归档取得 PR 的条目数据。

```text
          printf 'changed entry files: %s\n' "${#FILES[@]}"
          if [ "${#FILES[@]}" -eq 0 ]; then
            echo "none=true" >> "$GITHUB_OUTPUT"
            exit 0
          fi
          # git archive writes the blobs without running anything from the PR.
          git archive pr-head -- data/plugins | tar -x -C /tmp/prdata
          printf '%s\n' "${FILES[@]}" | sed 's|^data/plugins/||' > /tmp/prdata/changed.txt
```

**依据 6 · 源码核查**：[scripts/check-submission.mjs:280-292](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/check-submission.mjs#L280-L292)

实际请求未传 ref，读取直接目标的 manifest。

<details>
<summary>查看原文（13行）</summary>

```text
async function hasBundle(repo, sub) {
  // The entry may point straight at a subpackage — that manifest is
  // authoritative, and it is per-entry rather than per-repository, so it stays
  // outside the memoised tree scan below.
  const direct = await api(`repos/${repo}/contents/${sub ? `${sub}/` : ''}package.json`)
  if (direct.status === 200 && direct.body?.content) {
    const pkg = parsePkg(direct.body.content)
    // An unparseable manifest must not fall through to "looks fine" — it is
    // exactly as uninstallable as a missing one.
    if (!pkg) return { ok: false, why: `\`${sub ? `${sub}/` : ''}package.json\` is not valid JSON` }
    const dsh = pkg.dsh ?? {}
    if (dsh.bundle) return { ok: true }
    if (sub) return { ok: false, why: dsh.client ? 'declares only `dsh.client` — that alone is not installable' : `\`${sub}/package.json\` has no \`dsh.bundle\`` }
```

</details>

**依据 7 · 源码核查**：[scripts/check-submission.mjs:318-343](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/check-submission.mjs#L318-L343)

根路径与子包的纠错路径。

<details>
<summary>查看原文（26行）</summary>

```text
  // The entry points at the repository root and the root does not declare a
  // bundle. The tree scan below may still find one in a subdirectory — and for
  // a long time that counted as a pass, which is the bug: the site builds the
  // install command from the entry's URL, so `dsh plugin add github:owner/repo`
  // targets the root, not wherever the manifest happens to live. The gate was
  // verifying something other than what it publishes.
  //
  // Found by auditing the 1,302 root-pointing entries on 2026-08-18: 48 of them
  // are listed and cannot be installed from the URL beside their name. #1701
  // was merged that morning and was one of them.
  //
  // The submission is not rejected outright — the plugin is usually real and
  // only the URL is wrong — so the failure names the exact replacement.
  const scanned = await scanTree(repo)
  if (scanned.ok === true && scanned.at) {
    const dir = scanned.at.replace(/\/package\.json$/, '')
    if (dir && dir !== 'package.json') {
      const branch = await once(`branch:${repo}`, async () => (await api(`repos/${repo}`)).body?.default_branch ?? 'main')
      return {
        ok: false,
        why: [
          `the entry points at the repository root, but the root \`package.json\` declares no \`dsh.bundle\` — `,
          `\`dsh plugin --profile web add github:${repo}\` would install nothing. The manifest is at \`${scanned.at}\`, `,
          'so point the entry at that subpackage instead:\n',
          `  url: https://github.com/${repo}/tree/${branch}/${dir}\n`,
          `  name: ${repo}#${dir.split('/').pop()}\n`,
```

</details>

**依据 8 · 源码核查**：[.github/workflows/pr-gate.yml:360-374](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/.github/workflows/pr-gate.yml#L360-L374)

不完整为 neutral，明确问题为 failure。

<details>
<summary>查看原文（15行）</summary>

```text
              const partial = result.incomplete ?? []
              if (partial.length) {
                const detail = partial.map((c) => `- **${c.url}** — ${c.unverified.join('; ')}`).join('\n')
                await post('neutral', `${partial.length} entry/entries could not be fully checked`,
                  `${result.checked - partial.length} of ${result.checked} submitted entr${result.checked === 1 ? 'y' : 'ies'} pass. The rest were let through unchecked rather than rejected, but nothing here vouches for them:\n\n${detail}\n\nRe-run the workflow to check them properly.${modifiedNote}`)
                return
              }
              await post('success', 'Entries look good',
                `All ${result.checked} submitted entr${result.checked === 1 ? 'y passes' : 'ies pass'}: \`dsh.bundle\` declared, repo old enough, enough commits.${modifiedNote}`)
              return
            }
            const body = result.failures.flatMap((f) => [`**${f.url}**`, ...f.problems.map((p) => `- ${p}`), '']).join('\n')
            const contrib = `https://github.com/${owner}/${repo}/blob/main/contributing.md`
            await post('failure', `${result.failures.length} entry/entries need changes`,
              `${body}\nSee [contributing.md](${contrib}) for the bundle manifest example and the full rules.`)
```

</details>

#### 缺口

- 没有逐条复盘已合并 PR 的人工复核证据。
  **影响**：对具体候选的描述和支持状态仍要回源。
  **进一步探讨**：抽查修改描述、普通新仓库及单仓多子包的已合并记录，核对评审和最终内容。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 网站数据和 DSH 市场索引分别表达哪些条目？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

网站从同一条目生成源链接以及面向 Web profile 的安装命令，带子路径时加 path 参数。公开 plugins.json 优先给 npm 命令，其次给预构建包链接，否则给 Git 命令，显示命令通常不携带固定版本。Format 1 市场索引则要求已识别 npm 包、明确版本和整数发布时间，Git-only 或元数据缺失会被跳过，成功构建后还经过 format 1 解析器。无效 DSH semver 范围被省略，描述每语言裁到约 160 字符，因此索引里没有兼容限制或前置条件不代表原条目未写。条目样例在 YAML 里写了 profile 冲突和宿主版本，属于维护记录的提示，仍要检查候选本身。读者用市场发现不到 Git-only 时，可回到网页或 README；从网站复制命令前应把目标固定为已审查的版本。依靠索引结构通过无法证明发布包能安装。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-site.mjs:446-459](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/build-site.mjs#L446-L459)

Git 与预构建包命令的实际派生。

<details>
<summary>查看原文（14行）</summary>

```text
// derive repo/subdir install specs and the detail-page slug once
for (const e of ordered) {
  const repoPath = e.url.replace('https://github.com/', '')
  e.repo = repoPath.split('/').slice(0, 2).join('/')
  e.sub = repoPath.includes('/tree/') ? repoPath.split('/tree/')[1].replace(/^[^/]+\//, '') : null
  e.cmdGit = e.sub
    ? `dsh plugin --profile web add github:${e.repo}#path:/${e.sub}`
    : `dsh plugin --profile web add github:${e.repo}`
  e.npm = npmMap[e.url]?.npm ?? null
  // Optional author-declared prebuilt release tarball (data/plugins/*.yml).
  // Some plugins ship only a built tarball and are not installable from
  // source at all, so `github:owner/repo` would hand users a broken command.
  e.tarball = tarballMap[e.url] ?? null
  e.cmdTarball = e.tarball ? `dsh plugin --profile web add "${e.tarball}"` : null
```

</details>

**依据 2 · 源码核查**：[scripts/build-site.mjs:1157-1166](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/build-site.mjs#L1157-L1166)

公开数据中的能力字段与命令优先级。

<details>
<summary>查看原文（10行）</summary>

```text
      // Capability disclosure (#401). Omitted entirely when the entry was not
      // scanned, so a consumer cannot read "absent" as "empty" — the market
      // renders a missing pair as 未检出 / not checked.
      ...(capabilitiesMap[e.url] === undefined ? {} : {
        capabilities: capabilitiesMap[e.url].capabilities,
        capabilityRedLines: capabilitiesMap[e.url].redLines,
        capabilityCheckedAt: capabilitiesMap[e.url].scannedAt,
      }),
      install: e.npm ? `dsh plugin --profile web add ${e.npm}` : (e.cmdTarball ?? e.cmdGit),
      added: e.added,
```

</details>

**依据 3 · 源码核查**：[scripts/lib/market-index.mjs:57-89](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/market-index.mjs#L57-L89)

索引描述裁短与本地化回退。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * How much of a description the index carries, per language.
 *
 * The host fetches the whole document inside a fixed 15 s budget (dsh 0.2.1
 * `fetchTimeoutMs`), and the list's descriptions run to 4,480 characters —
 * 1.5 MB of the file for text no card renders past the first few lines.
 * 160 characters keeps the sentence that says what a plugin does and drops
 * the rest; the full text stays on the plugin's own page.
 */
const DESCRIPTION_LIMIT = 160

/** Cut at a word boundary where one is close enough, else exactly at the limit. */
function truncate(text) {
  if (text.length <= DESCRIPTION_LIMIT) return text
  const cut = text.slice(0, DESCRIPTION_LIMIT)
  const space = cut.lastIndexOf(' ')
  // A CJK description has no spaces at all; cutting mid-character is correct
  // there, so only use the word boundary when it is not leaving a stump.
  return `${space > DESCRIPTION_LIMIT - 24 ? cut.slice(0, space) : cut}…`
}

/** A LocalizedText value, or undefined when the entry has no usable text. */
function localized(description) {
  if (typeof description === 'string' && description.trim() !== '') return truncate(description.trim())
  if (typeof description !== 'object' || description === null) return undefined
  const text = {}
  for (const [language, value] of Object.entries(description)) {
    if (typeof value === 'string' && value.trim() !== '') text[language] = truncate(value.trim())
  }
  // The format requires `en` in an object form; a lone translation stays usable
  // as a plain string instead of dropping the description entirely.
  if (typeof text.en === 'string') return text
  return Object.values(text)[0]
```

</details>

**依据 4 · 源码核查**：[scripts/lib/market-index.mjs:111-150](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/market-index.mjs#L111-L150)

按 npm 元数据过滤、单条格式校验和引擎字段。

<details>
<summary>查看原文（40行）</summary>

```text
  const indexUrl = `${origin}/index.json`
  const skipped = { noNpm: 0, noVersion: 0, noPublishTime: 0, refused: 0 }
  const refused = []

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
```

</details>

**依据 5 · 源码核查**：[scripts/lib/market-index.mjs:153-155](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/market-index.mjs#L153-L155)

整份索引再解析。

```text
  // The document as a whole, which is what a host actually parses.
  const index = parseMarketIndex(spec, indexUrl)
  return { index, skipped, refused }
```

**依据 6 · 源码核查**：[data/plugins/01men__DeptAI-UI-DSH.yml:1-6](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/data/plugins/01men__DeptAI-UI-DSH.yml#L1-L6)

目录数据包含 profile 冲突及宿主范围，这是条目内容。

```text
url: https://github.com/01men/DeptAI-UI-DSH
name: 01men/DeptAI-UI-DSH
category: ui
description:
  en: "A collaboration front-office for AI agents and humans — department boards, tickets, approvals and industry calculations run inside the DSH conversation and panel, so agents do the work in chat while humans stay accountable in the panel. It calls the 01men/ybkkasi governance base over existing contracts (asset ledger, IAM, OIDC SSO, RBAC and scene-level authorization) instead of re-implementing governance. Ships as a Cordis bundle and mounts at /gate01; the selftest suite is green on every push. Do not install this and 01men/ybkkasi as dsh bundles in the same profile: both register the ops-platform-core / ops-iam / ops-authn rows. Requires DSH >=0.1.0-rc.7 <0.2.0."
  zh: "AI 代理与人类的协作前台——部门看板、工单、审批与行业计算都在 DSH 会话与面板里完成，代理在对话里干活，人在面板里负责。它通过既有契约调用 01men/ybkkasi 治理底座（资产台账、IAM、OIDC SSO、RBAC 与场景级授权），不重复实现治理。以 Cordis bundle 形式安装，挂载在 /gate01；自测套件每次推送全绿。请勿在同一 profile 同时安装本插件与 01men/ybkkasi 的 dsh bundle：两者都会注册 ops-platform-core / ops-iam / ops-authn 行。要求 DSH >=0.1.0-rc.7 <0.2.0。"
```

#### 缺口

- 未核查线上页面与已发布索引此刻是否对应此提交。
  **影响**：本研究只描述构建规则，覆盖率与访问性未知。
  **进一步探讨**：把本地构建输入的条目计数与公开两种输出分别对齐，抽查缺包名、缺版本与纯 Git 条目。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能力披露在哪个工件上运行，失败怎样显示？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

扫描脚本优先取映射到的 npm tarball，其次预构建包，再用仓库 HEAD 的压缩包。在临时目录解压，把选择的目录传给独立 scanner 并读取其 JSON，站点保留能力、红线和扫描时间。映射有精确版本时以版本决定复扫，其他来源按扫描时间过期。旧记录先复制进 next，只有扫描成功才覆盖，失败累加日志。公开 plugins.json 对缺记录项不写能力字段，有旧记录时仍取旧能力列表和时间，但没有把记录中的 spec、version 和扫描错误同时给出。由此不能把当前展示的 npm 版本当成实际扫描版本。源码还有明确的错配条件：扫描器在选中 npm 后仍从原 Git URL 拿子路径并拼到包目录，若 npm 工件已把子包展平，可能直接报目录不存在。仓库压缩包选择 HEAD，也不传条目中的分支。这些风险来自实际选择路径，发生比例和 scanner 本身的漏检率仍未知。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/capabilities.mjs:55-60](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/capabilities.mjs#L55-L60)

子路径从原条目 URL 提取。

```text
export function subdirOf(url) {
  const path = url.replace('https://github.com/', '')
  if (!path.includes('/tree/')) return null
  const tail = path.split('/tree/')[1] ?? ''
  const parts = tail.split('/')
  return parts.length > 1 ? parts.slice(1).join('/') : null
```

**依据 2 · 源码核查**：[scripts/lib/capabilities.mjs:75-100](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/capabilities.mjs#L75-L100)

npm、预构建包和 HEAD 选择顺序。

<details>
<summary>查看原文（26行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[scripts/lib/capabilities.mjs:114-120](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/capabilities.mjs#L114-L120)

版本或时间控制是否重扫。

```text
export function shouldRescan(stored, source, now, recheckDays) {
  if (stored === undefined) return true
  if (source.version !== null) return stored.version !== source.version
  const scannedAt = Date.parse(stored.scannedAt)
  if (!Number.isFinite(scannedAt)) return true
  return now - scannedAt > recheckDays * 86_400_000
}
```

**依据 4 · 源码核查**：[scripts/lib/capabilities.mjs:167-186](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/capabilities.mjs#L167-L186)

记录 scanner 输出的事实与内部 spec/version。

<details>
<summary>查看原文（20行）</summary>

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
  }
  const provenance = copyProvenance(payload.provenance)
  if (provenance !== undefined) record.provenance = provenance
  return record
```

</details>

**依据 5 · 源码核查**：[scripts/probe-capabilities.mjs:108-127](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/probe-capabilities.mjs#L108-L127)

先复用旧记录，后写缓存。

<details>
<summary>查看原文（20行）</summary>

```text
const readJson = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}
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

**依据 6 · 源码核查**：[scripts/probe-capabilities.mjs:146-173](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/probe-capabilities.mjs#L146-L173)

工件下载、解压、目录定位与扫描进程。

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

**依据 7 · 源码核查**：[scripts/probe-capabilities.mjs:187-202](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/probe-capabilities.mjs#L187-L202)

成功替换与失败日志的不同路径。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 8 · 源码核查**：[scripts/build-site.mjs:1157-1165](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/build-site.mjs#L1157-L1165)

公开 API 投影不包含扫描工件版本和失败状态。

```text
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

#### 缺口

- 未取得准确的扫描错配比例与扫描器覆盖率。
  **影响**：无法根据披露内容判断一个包的权限是否全部识别。
  **进一步探讨**：从固定 npm 包、发布 tarball 和带子路径的 Git 条目抽样，核对工件目录及扫描输出所用版本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 读者和维护者分别怎样采用，付出什么代价？

**研究主题**：采用判断、效果与总成本

#### 完整回答

读者适合用目录生成一份待核查清单，特别是要找某类扩展、需要源链接和初步前置条件时。先选分类，确认组件路径和目标版本，再阅读实际 manifest、入口和安装脚本，检查宿主版本、插件权限与外部依赖。若只能找到跟随最新版的命令，或能力披露没有记录、无法对应目标工件，应停止按该记录作安装判断，回到上游固定版本。维护者维护结构化条目后可复用同一生成链，但需要复核扫描缓存过期与失败。工作流将部分元数据探测放在定时、手动或缺缓存时，tarball、截图与能力探测在构建主路径调用。日志和依赖失效增加维护工作，缓存避免反复请求但有时效差。该仓库自身按目录资源采用，用户可直接阅读，无需安装目录仓库。现金、请求和每份合格候选的人工耗时均无对照记录。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:11-15](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/README.zh.md#L11-L15)

作者说明列表、市场入口及 GitHub-only 的区别。

```text
本列表收录可通过 `dsh plugin add` 安装的社区插件（均声明了 `dsh.bundle` manifest）。欢迎 [PR](#贡献)。

> 📡 **这份列表也可以当作插件市场索引。** dsh 0.2.1 起，打开 **插件 → 发现（Discover）→ 索引源（Index sources）**，添加 `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`。它就是这份列表的 format 1 索引，放在 npm 上分发，所以在哪里都快：dsh 给索引源的时间只有 15 秒，而同一份文档的 GitHub Pages 地址——`https://awesome-dsh-plugin.com/index.json` 及其镜像 `https://dshmarket.com/index.json`——在部分网络下会超过这个时间。官方的发现页和 `plugin_market` 智能体工具就能搜索同一份条目。索引收录在 npm 上发布、有明确版本的插件；仅 GitHub 的条目仍可用每个插件旁边的命令安装。

> 🛒 **推荐安装 [dsh-market](https://github.com/dsh-market/dsh-market#readme)**（可选）——DeepSeek Harness 里的插件市场，本列表的插件都在里面。界面简单好上手，一键安装、升级插件，一键切换主题：
```

**依据 2 · 源码核查**：[scripts/build-site.mjs:446-459](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/build-site.mjs#L446-L459)

实际给读者的安装来源线索。

<details>
<summary>查看原文（14行）</summary>

```text
// derive repo/subdir install specs and the detail-page slug once
for (const e of ordered) {
  const repoPath = e.url.replace('https://github.com/', '')
  e.repo = repoPath.split('/').slice(0, 2).join('/')
  e.sub = repoPath.includes('/tree/') ? repoPath.split('/tree/')[1].replace(/^[^/]+\//, '') : null
  e.cmdGit = e.sub
    ? `dsh plugin --profile web add github:${e.repo}#path:/${e.sub}`
    : `dsh plugin --profile web add github:${e.repo}`
  e.npm = npmMap[e.url]?.npm ?? null
  // Optional author-declared prebuilt release tarball (data/plugins/*.yml).
  // Some plugins ship only a built tarball and are not installable from
  // source at all, so `github:owner/repo` would hand users a broken command.
  e.tarball = tarballMap[e.url] ?? null
  e.cmdTarball = e.tarball ? `dsh plugin --profile web add "${e.tarball}"` : null
```

</details>

**依据 3 · 源码核查**：[.github/workflows/build-site.yml:175-198](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/.github/workflows/build-site.yml#L175-L198)

部分探测依定时与缓存条件触发。

<details>
<summary>查看原文（24行）</summary>

```text
          # above and the publish conditions below were already written as an
          # allowlist; this was the only denylist left.
          case "${{ github.event_name }}" in
            schedule) full_probe=1 ;;
            workflow_dispatch)
              # A manual run is normally a full re-probe, but the deploy-only
              # path has to exist: it is how a fix reaches the site without
              # waiting out an hour of probes (2026-10-18, when the index
              # needed to ship while users were already adding it).
              if [ "${{ inputs.skip_probes }}" = "true" ]; then full_probe=''; else full_probe=1; fi ;;
            *) full_probe='' ;;
          esac
          if [ -n "$full_probe" ] || [ ! -s data/npm-map.json ]; then
            node scripts/probe-npm.mjs
            # After probe-npm.mjs, never before: this reads data/npm-map.json
            # to know which entries HAVE a package to probe. Reads and writes
            # data/downloads.json, which is committed AND now has its own cache
            # entry above. It stays out of the shared `path:` list so that
            # caching it cannot invalidate the other probes' cache; the
            # committed copy remains the cold-start floor, and the cache is
            # what carries a nightly refresh across the next push build.
            node scripts/probe-downloads.mjs
            node scripts/probe-stars.mjs
            node scripts/probe-readmes.mjs
```

</details>

**依据 4 · 源码核查**：[.github/workflows/build-site.yml:215-233](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/.github/workflows/build-site.yml#L215-L233)

发布前调用辅助探测并构建。

<details>
<summary>查看原文（19行）</summary>

```text
          # submission can 404 later without anyone touching the entry, and the
          # set is small enough that there is no reason to sample it (#1619).
          node scripts/probe-tarballs.mjs
          # Same reasoning, same shape, for screenshots. The PR check validates
          # that an image URL is well-formed and on GitHub's hosting, never that
          # it resolves — so a dead link merged clean and published as a broken
          # picture in the storefront. 41 of 773 were dead the first time anyone
          # asked. Neither probe blocks the build: a dead URL is dropped from
          # the published data, not turned into a failure.
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
```

</details>

**依据 5 · 源码核查**：[scripts/lib/market-index.mjs:115-139](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/market-index.mjs#L115-L139)

从市场找不到的几种实际输入条件。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

#### 缺口

- 没有发现时间或安装失败率的使用者比较。
  **影响**：目录可缩小搜索范围，不能量化节省的工作。
  **进一步探讨**：让使用者用同样的任务和验收条件，分别用目录及直接仓库搜索，计时到找到一个可追溯工件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证版本标识是否减少旧扫描误读？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可以比较一个窄假设：同时显示能力扫描实际工件版本、最近成功时间和本次失败状态，能减少把旧记录当成当前版本。代码内部已有部分字段，公开数据只投影时间、能力与红线，扫描失败保留旧记录。把相同任务随机分给两组，一组用现有记录，一组看额外绑定。用公开版本领先、npm 子目录错配、Git 分支不一致、没有扫描记录和确实同版本这些样本，让用户判断当前记录是否覆盖准备安装的工件。每份合格判断统计误信旧扫描、误判未检出、耗时和维护者为保存额外字段付出的人工时间。若错误率没有减少或显著增加排查成本，继续保留现有展示和独立审查流程。此方案尚无实现和受试结果。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/capabilities.mjs:167-186](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/lib/capabilities.mjs#L167-L186)

内部记录已有版本、spec 和时间。

<details>
<summary>查看原文（20行）</summary>

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
  }
  const provenance = copyProvenance(payload.provenance)
  if (provenance !== undefined) record.provenance = provenance
  return record
```

</details>

**依据 2 · 源码核查**：[scripts/build-site.mjs:1150-1165](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/build-site.mjs#L1150-L1165)

公开当前版本和扫描时间却未绑定两者。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 3 · 源码核查**：[scripts/probe-capabilities.mjs:187-202](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/55f70e08a80e7b4b6c469ce38d0fd186b6f3c40e/scripts/probe-capabilities.mjs#L187-L202)

失败时只记录错误，不更新条目记录。

<details>
<summary>查看原文（16行）</summary>

```text
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

#### 缺口

- 缺少读者对现有标识的理解和错误基线。
  **影响**：无法断言增加字段会改善行为。
  **进一步探讨**：设置相同工件清单，抽样比较读者判读和两种展示的维护负担。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
