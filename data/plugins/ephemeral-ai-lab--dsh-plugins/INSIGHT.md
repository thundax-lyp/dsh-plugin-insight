# Mayfly / DSH Plugin Marketplace

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[cb9ea00](https://github.com/Ephemeral-AI-Lab/dsh-plugins/tree/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ephemeral-AI-Lab/dsh-plugins)
<!-- END META -->

> **功能**：以分层清单、来源检查和生成索引，为 Mayfly 与 DSH 提供插件发现及安装元数据。

> **亮点**：把来源、前端贡献、安装行/激活与验证包版本规范化并提供实际产物检查；不将metadata/安装绿灯当真实任务验收，见 [Q01](#research-q01)至 [Q03](#research-q03)。

> **主要限制**：capabilities非运行权限，main/动态npm可漂移；npm只比元数据hash、变版本仅warn，offline跳过也可成功文字；scratch会执行安装而非只读安全审计，见 [Q03](#research-q03)。

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
  - [Q01 · 根市场给谁什么价值，是否等于所有插件能力？](#detail-section-11)
  - [Q02 · 清单如何变成可消费索引，失败和漂移在哪？](#detail-section-12)
  - [Q03 · 所谓验证真的验证了什么，权限/完整性边界怎样？](#detail-section-13)
  - [Q04 · 如何具体使用这个市场，完整负担是什么？](#detail-section-14)
  - [Q05 · 有什么可证伪的根市场改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Mayfly/DSH用户和插件作者可按前端/安装组合找一个明确缺口的候选；不把目录当所有插件能力，见 [Q01](#research-q01)。

直接查散落仓库的包/安装文档；此根集中披露/激活组合，不实现Mayfly或收录插件的全部功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 市场清单 | 按前端/安装行发现 | 非runtime权限 |
| 来源检查 | npm包/Git产物 | 不验所有业务/安全 |
| 两索引生成 | 客户端/网站消费 | 动态元数据/非双文件事务 |
| 发布工作流 | 生成PR/自动合并请求 | 未确认当前CI结果 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| 清单/schema/生成索引 | 发现入口 | 统一来源与前端 | 不等runtime准入 |
| Node22与pnpm | 维护验证 | npm/Git产物检查 | offline会跳远端 |
| 网络/registry/Git分支 | 动态生成 | 版本/README/依赖 | 主富化失败抛错 |
| Mayfly或DSH安装器/profile | 真安装条件 | 挂包/patch行 | 本根未审实现 |
| 单包权限/服务/许可证 | 下游条件 | 真任务 | 市场披露非授权 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 选缺口 | 读一条manifest | 前端/行/版本明确 |
| 核证据 | 分verified日期/源/模式 | 不只看stable/下载量 |
| 决定安装前 | 固定具体包/备份profile | 单包另验权限 |
| 激活/任务 | 若后续授权，单包核 | 不用市场绿灯替代 |
| 退出 | 只读可直接停止 | 已装各行/数据另清 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 发现 | JSON/文档 | 选择/前端匹配 | 未测省时 |
| 维护 | registry/Git/CI安装构建 | 版本/许可/审阅 | 零依赖非零资源 |
| 失败 | 安装生命周期/产物 | 分富化/安装/激活 | 重建index不修runtime |
| 退出 | 下游数据/进程 | 成组撤行另核 | 根不统一回滚 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 发现/组合 | 规范字段与索引 | 选择效率/需求 |
| 来源验证 | 包产物/patch检查 | 全字节/安全/runtime |
| 发布 | CI建PR链 | 当前已成功合并 |
| 下游能力 | 清单描述 | 各插件真实业务 |

> **思考**：capabilities非运行权限，main/动态npm可漂移；npm只比元数据hash、变版本仅warn，offline跳过也可成功文字；scratch会执行安装而非只读安全审计，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把来源、前端贡献、安装行/激活与验证包版本规范化并提供实际产物检查；不将metadata/安装绿灯当真实任务验收，见 [Q01](#research-q01)至 [Q03](#research-q03)。

形状/来源/产物检查有可迁移价值，但元数据hash、动态版本、offline成功与双文件非原子发布必须如实解释，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

capabilities非运行权限，main/动态npm可漂移；npm只比元数据hash、变版本仅warn，offline跳过也可成功文字；scratch会执行安装而非只读安全审计，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用作只读发现：挑一明确缺口条目，核前端/行/固定来源与验证模式；不直接据收录授权安装运行。解释不清就停在阅读并回直接仓库说明，单包后续另验，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根三个脚本、CI/发布和代表manifest/协议已查；未运行安装/宿主或子插件。可只读发现候选试用，分层证据仅候选。

- 已检查：作者 README、包清单、源码路径 .github/workflows/index-publish.yml、.github/workflows/registry-validate.yml、README.md、docs/market.md、registry/official/sidechat.json、scripts/build-index.mjs、scripts/validate-manifests.mjs、scripts/verify-packages.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根README/docs、build-index197行、validate295行关键语义、verify299行实际路径与两CI、sidechat/terminal代表清单；未研究各子插件、Mayfly消费安装器/Host权限，未执行检查脚本。
- 下一步：- 固定源码，不跑verify/安装/CI/Host/模型。
- metadata/产物与运行/业务证据分开。
- 根基础设施，子插件能力不累加归根。

**分析版本**

- **仓库**：[Ephemeral-AI-Lab/dsh-plugins](https://github.com/Ephemeral-AI-Lab/dsh-plugins)
- **版本号**：未声明（[固定提交 cb9ea00](https://github.com/Ephemeral-AI-Lab/dsh-plugins/tree/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是源hash/验证模式与五层证据分开呈现，以四漂移/跳过/激活样本测误装和维护负担，见 [Q05](#research-q05)。

- 固定源码，不跑verify/安装/CI/Host/模型。
- metadata/产物与运行/业务证据分开。
- 根基础设施，子插件能力不累加归根。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 61 | 16166 | — | — | 93877 |
| .js | source | 66 | 8054 | 7553 | 665 | — |
| .ts | source | 81 | 8504 | 7249 | 471 | — |
| .ts | test | 58 | 8611 | 7587 | 13 | — |
| .mjs | example | 1 | 41 | 40 | 0 | — |
| .mjs | source | 5 | 865 | 740 | 71 | — |
| .tsx | source | 5 | 809 | 735 | 2 | — |
| .md | test | 10 | 106 | — | — | 849 |
| .tsx | test | 4 | 444 | 383 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Ephemeral-AI-Lab/dsh-plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Ephemeral-AI-Lab/dsh-plugins/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ephemeral-AI-Lab/dsh-plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：市场根如何生成/验证候选来源，哪些证据足以选型而不是冒认runtime权限和功能？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根市场给谁什么价值，是否等于所有插件能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根是Mayfly/DSH市场registry、索引生成/验证工具和自家插件源码的集合，登记infrastructure，不是一个原生插件，也不是Mayfly客户端本体。面向维护组合的用户/插件作者，参照是从散落仓库找安装指令：本库把来源、双语描述、server/web/tui贡献面、成组安装行、verified包版本和激活方法放进统一入口。它自己的贡献是发现/安装元数据治理，不把收录的terminal/MCP/loop等功能全算根已实现或已验收。

manifest只在发现/安装阶段使用，不参与runtime权限准入；capabilities是审阅披露，surfaces/provides是显示和兼容线索。实际运行由包和profile patch决定，TUI不能直接使用Web-only面板。合格结果是选对前端、依赖/激活行与具体包版本，再对一个任务验收；“official”在这里是Ephemeral团队自家来源层，不能混成所有条目均DSH官方背书。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-23](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/README.md#L18-L23)

作者区分源码与市场索引。

```text
Two things live here:

1. **`plugins/`** — the source of Ephemeral AI Lab's official plugins.
2. **`registry/`** — the marketplace: one JSON manifest per listing. CI
   aggregates them into [`dist/index.json`](./dist/index.json), the document
   Mayfly's `/plugin` command and the website catalog consume.
```

**依据 2 · 源码核查**：[docs/market.md:6-18](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L6-L18)

发现安装与运行边界。

<details>
<summary>查看原文（13行）</summary>

```text
## Boundaries

The manifest is **discovery- and install-time metadata only**. It never
participates in runtime loading, capability negotiation, or admission — the
runtime contract of every plugin remains:

1. an installable package (npm or GitHub) understood by
   `dsh plugin --profile <name> add <spec>`, which forwards verbatim to pnpm;
2. the package's own `cordis.patch.yml`, declared via the `dsh.bundle.patch`
   field in its `package.json` — or rows the installer inserts into the
   profile's `cordis.patch.yml` (see [Activation](#activation)).

Mayfly intentionally has no runtime manifest; nothing here changes that.
```

</details>

**依据 3 · 源码核查**：[docs/market.md:25-42](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L25-L42)

字段含义和capabilities非运行权限。

<details>
<summary>查看原文（18行）</summary>

```text
| field | required | meaning |
| --- | --- | --- |
| `schemaVersion` | ✓ | currently `1` |
| `id` | ✓ | unique slug; `/plugin install <id>` |
| `source` | ✓ | `official` \| `dsh` \| `community` — must match the directory under `registry/` |
| `displayName` | ✓ | shown in lists |
| `description` / `descriptionZh` | ✓ | one-liners, English and Chinese |
| `author` | ✓ | `{ name, url? }` |
| `links` | ✓ | `{ repo, docs, npm }` |
| `license` | ✓ | SPDX string |
| `category` | ✓ | `tools` `ui` `provider` `workflow` `testing` `integration` |
| `status` | ✓ | `stable` `beta` `unstable` `deprecated` `removed`; `deprecated`/`removed` require `statusNote` |
| `surfaces` | ✓ | what the plugin **contributes** — see below |
| `provides` |  | `{ tools: [...], commands: ["/..."] }` for display and search |
| `install.rows[]` | ✓ | ordered install units — see below |
| `engines` |  | `{ dsh, mayfly, node }` ranges; `mayfly` required with `surfaces.tui` |
| `capabilities` |  | review disclosure (`shell`, `network`, `credentials`, …) — not a runtime permission |
| `verified` | ✓ | `{ at, packages: [{ name, version, integrity? }] }` recorded at review time |
```

</details>

**依据 4 · 源码核查**：[docs/market.md:54-57](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L54-L57)

前端贡献范围。

```text
The manifest declares what a plugin *contributes*. Value in a given frontend
is derived: **useful in frontend X = has `server` OR has X's own
contribution**. A `server + web` plugin in Mayfly shows "tools work, panel is
dsh-Web-only"; a `web`-only plugin warns on install from a TUI.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 清单如何变成可消费索引，失败和漂移在哪？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

validate脚本核tier/source、唯一id、安装行/名字/verified覆盖，CI再跑JSON Schema；这约束形状与语义一致，不证明verified日期发生过实测或工具真的可用。build自己读三tier清单按tier再id排序，npm来源串行取packument最新tag/价外下载量/README，download统计失败容忍、主要npm enrichment失败抛错。网络fetch未设本地Abort/timeout，运行时间依环境。

索引保留清单并追加npm最新版本、integrity/时间和updateAvailable；普通版本不等仅用字符串是否相同判断，不是semver“可升级”裁决。GitHub本仓条目读取当前checkout包版本/README，不证明manifest所指main在别人安装时与这个checkout相同。sidechat条目两行ref=main、verified仅版本；根固定版本不固定未来安装Git分支。removed墓碑仍进index总条目，跳过npm enrichment不代表彻底删除。

index和catalog分别直接writeFileSync，单文件/双文件发布不具备共同原子提交；enrichment已完成后才写，避免部分富化先发布，但第二文件写失败仍可能分叉。CI按验证→来源检查→构建→创建自动合并PR，推送/每周/手动触发，不据工作流文本宣称本提交CI已成功或PR已落地。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validate-manifests.mjs:103-121](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/validate-manifests.mjs#L103-L121)

tier/唯一id与状态。

<details>
<summary>查看原文（19行）</summary>

```text
function checkManifest (file, manifest, tier) {
  if (manifest.schemaVersion !== 1) fail(file, 'schemaVersion must be 1')
  if (manifest.source !== tier) fail(file, `source ${JSON.stringify(manifest.source)} must be "${tier}" (matches directory)`)

  const id = checkString(file, manifest, 'id', { pattern: /^[a-z0-9][a-z0-9-]*$/, max: 64 })
  if (id !== null) {
    if (seenIds.has(id)) fail(file, `duplicate id "${id}" (also in ${seenIds.get(id)})`)
    else seenIds.set(id, file)
  }

  checkString(file, manifest, 'displayName', { max: 64 })
  checkString(file, manifest, 'description', { min: 10, max: 300 })
  checkString(file, manifest, 'descriptionZh', { min: 10, max: 300 })
  checkString(file, manifest, 'license', { max: 32 })

  if (!CATEGORIES.includes(manifest.category)) fail(file, `category must be one of ${CATEGORIES.join(', ')}`)
  if (!STATUSES.includes(manifest.status)) fail(file, `status must be one of ${STATUSES.join(', ')}`)
  if ((manifest.status === 'deprecated' || manifest.status === 'removed') &&
      (typeof manifest.statusNote !== 'string' || manifest.statusNote.length === 0)) {
```

</details>

**依据 2 · 源码核查**：[scripts/validate-manifests.mjs:187-214](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/validate-manifests.mjs#L187-L214)

安装行重复/allowBuilds形状。

<details>
<summary>查看原文（28行）</summary>

```text
  const rows = manifest.install?.rows
  if (!Array.isArray(rows) || rows.length === 0) {
    fail(file, 'install.rows must be a non-empty array')
  } else {
    const rowIds = new Set()
    const rowNames = new Set()
    for (const row of rows) {
      if (typeof row !== 'object' || row === null || Array.isArray(row)) {
        fail(file, 'install row must be an object')
      } else {
        checkRow(file, row)
        if (typeof row.name === 'string') {
          if (rowNames.has(row.name)) fail(file, `duplicate install row name "${row.name}"`)
          rowNames.add(row.name)
        }
        if (typeof row.id === 'string') {
          if (rowIds.has(row.id)) fail(file, `duplicate install row id "${row.id}"`)
          rowIds.add(row.id)
        }
      }
    }
  }
  const allowBuilds = manifest.install?.allowBuilds
  if (allowBuilds !== undefined &&
      (!Array.isArray(allowBuilds) || allowBuilds.length === 0 ||
       !allowBuilds.every(n => typeof n === 'string' && n.length > 0) ||
       new Set(allowBuilds).size !== allowBuilds.length)) {
    fail(file, 'install.allowBuilds must be a non-empty array of unique package names')
```

</details>

**依据 3 · 源码核查**：[scripts/validate-manifests.mjs:223-260](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/validate-manifests.mjs#L223-L260)

verified与install行覆盖是形状/对应。

<details>
<summary>查看原文（38行）</summary>

```text
  const verified = manifest.verified
  if (verified === undefined) {
    fail(file, 'verified is required')
  } else if (typeof verified !== 'object' || verified === null || Array.isArray(verified)) {
    fail(file, 'verified must be an object')
  } else {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(verified.at ?? '')) fail(file, 'verified.at must be YYYY-MM-DD')
    if (!Array.isArray(verified.packages) || verified.packages.length === 0) {
      fail(file, 'verified.packages must be a non-empty array')
    } else {
      const verifiedNames = new Set()
      for (const pkg of verified.packages) {
        if (typeof pkg?.name !== 'string' || pkg.name.length === 0 ||
            typeof pkg?.version !== 'string' || pkg.version.length === 0) {
          fail(file, 'verified.packages entries need name and version')
        }
        if (typeof pkg?.name === 'string') {
          if (verifiedNames.has(pkg.name)) fail(file, `duplicate verified package "${pkg.name}"`)
          verifiedNames.add(pkg.name)
        }
        if (pkg?.integrity !== undefined && !/^sha512-[a-z0-9+/=]+$/i.test(pkg.integrity)) {
          fail(file, 'verified.packages integrity must be an sha512 value')
        }
      }
    }
  }

  // Cross-check: verified package records must cover exactly the install rows.
  const rowNames = new Set((rows ?? []).map(row => row?.name))
  for (const pkg of verified?.packages ?? []) {
    if (pkg?.name !== undefined && !rowNames.has(pkg.name)) {
      fail(file, `verified package "${pkg.name}" is not an install row name`)
    }
  }
  const verifiedNames = new Set((verified?.packages ?? []).map(pkg => pkg?.name))
  for (const rowName of rowNames) {
    if (typeof rowName === 'string' && !verifiedNames.has(rowName)) {
      fail(file, `install row "${rowName}" has no verified package record`)
```

</details>

**依据 4 · 源码核查**：[scripts/build-index.mjs:33-89](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/build-index.mjs#L33-L89)

fetch/排序/npm富化与失败。

<details>
<summary>查看原文（57行）</summary>

```text

async function fetchJson (url) {
  const response = await fetch(url, { headers: { accept: 'application/json' } })
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`)
  return await response.json()
}

async function fetchText (url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`)
  return await response.text()
}

function loadManifests () {
  const manifests = []
  for (const tier of TIERS) {
    const dir = join(registryRoot, tier)
    if (!existsSync(dir)) continue
    for (const name of readdirSync(dir).filter(n => n.endsWith('.json'))) {
      const path = join(dir, name)
      const manifest = JSON.parse(readFileSync(path, 'utf8'))
      manifests.push({ manifest, tier, path: relative(root, path).replaceAll('\\', '/') })
    }
  }
  manifests.sort((a, b) =>
    (TIER_ORDER[a.tier] - TIER_ORDER[b.tier]) || a.manifest.id.localeCompare(b.manifest.id))
  return manifests
}

/** npm registry enrichment, keyed by package name. */
async function npmInfoFor (names) {
  const info = new Map()
  for (const name of names) {
    const encoded = encodeURIComponent(name)
    try {
      const packument = await fetchJson(`https://registry.npmjs.org/${encoded}`)
      const latestTag = packument['dist-tags']?.latest
      if (!latestTag) throw new Error('no dist-tags.latest (package unpublished?)')
      const version = packument.versions?.[latestTag]
      let downloadsMonth = null
      try {
        const downloads = await fetchJson(`https://api.npmjs.org/downloads/point/last-month/${encoded}`)
        downloadsMonth = downloads.downloads ?? null
      } catch {
        // Downloads are cosmetic; tolerate failure.
      }
      info.set(name, {
        latestVersion: latestTag,
        integrity: version?.dist?.integrity ?? null,
        publishedAt: packument.time?.[latestTag] ?? null,
        downloadsMonth,
        readme: (packument.readme ?? version?.readme ?? '').slice(0, README_FULL_CAP) || null
      })
    } catch (error) {
      throw new Error(`npm enrichment failed for ${name}: ${error.message}`)
    }
  }
```

</details>

**依据 5 · 源码核查**：[scripts/build-index.mjs:103-118](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/build-index.mjs#L103-L118)

本仓Git包读当前本地版本。

<details>
<summary>查看原文（16行）</summary>

```text

function localPackageInfoFor (manifest, row) {
  if (row.github?.repo !== 'Ephemeral-AI-Lab/dsh-plugins' || !row.github.subdir) {
    return emptyNpmInfo()
  }
  const packagePath = join(root, row.github.subdir, 'package.json')
  if (!existsSync(packagePath)) return emptyNpmInfo()
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  const verifiedVersion = verifiedVersionFor(manifest, row.name)
  return {
    ...emptyNpmInfo(),
    latestVersion: typeof packageJson.version === 'string' ? packageJson.version : null,
    updateAvailable: verifiedVersion !== null && typeof packageJson.version === 'string' &&
      packageJson.version !== verifiedVersion,
    readme: localReadmeFor(manifest)
  }
```

</details>

**依据 6 · 源码核查**：[scripts/build-index.mjs:142-197](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/build-index.mjs#L142-L197)

removed富化跳过、字符串差异、两文件写。

<details>
<summary>查看原文（56行）</summary>

```text
const npmNames = new Set()
for (const { manifest } of records) {
  if (manifest.status === 'removed') continue
  for (const row of manifest.install.rows) {
    if (row.npm) npmNames.add(row.name)
  }
}

const npmInfo = offline ? new Map() : await npmInfoFor([...npmNames].sort())

const entries = []
for (const { manifest, tier, path } of records) {
  const entry = { ...manifest, registryPath: path }
  const packages = {}
  let readme = null
  for (const row of manifest.install.rows) {
    if (row.npm) {
      const info = npmInfo.get(row.name) ?? emptyNpmInfo()
      const verifiedVersion = verifiedVersionFor(manifest, row.name)
      packages[row.name] = {
        ...info,
        updateAvailable: !offline && verifiedVersion !== null &&
          info.latestVersion !== null && info.latestVersion !== verifiedVersion
      }
      if (readme === null) readme = info.readme
    } else if (row.github) {
      packages[row.name] = localPackageInfoFor(manifest, row)
      if (readme === null) readme = packages[row.name].readme
    }
  }
  entry.npm = packages
  entry.updateAvailable = Object.values(packages).some(pkg => pkg.updateAvailable === true)
  entry.readmeExcerpt = plainExcerpt(readme)
  entry.readme = readme
  entries.push(entry)
}

const generatedAt = new Date().toISOString()
const base = {
  schemaVersion: 1,
  generatedAt,
  counts: {
    total: entries.length,
    bySource: Object.fromEntries(TIERS.map(tier => [tier, entries.filter(e => e.source === tier).length]))
  }
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'index.json'), JSON.stringify({
  ...base,
  entries: entries.map(({ readme, ...entry }) => entry)
}, null, 2) + '\n')
writeFileSync(join(outDir, 'catalog.json'), JSON.stringify({ ...base, entries }, null, 2) + '\n')

console.log(`OK: wrote ${join(relative(root, outDir) || '.', 'index.json')} and catalog.json ` +
  `(${entries.length} entries: ${TIERS.map(t => `${entries.filter(e => e.source === t).length} ${t}`).join(', ')}).`)
```

</details>

**依据 7 · 源码核查**：[registry/official/sidechat.json:18-38](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/registry/official/sidechat.json#L18-L38)

两行main与verified版本。

<details>
<summary>查看原文（21行）</summary>

```text
  "install": {
    "rows": [
      {
        "id": "workbench-ui",
        "name": "dsh-workbench-ui",
        "github": { "repo": "Ephemeral-AI-Lab/dsh-plugins", "ref": "main", "subdir": "plugins/work-bench-ui" }
      },
      {
        "id": "sidechat",
        "name": "dsh-sidechat",
        "github": { "repo": "Ephemeral-AI-Lab/dsh-plugins", "ref": "main", "subdir": "plugins/sidechat" }
      }
    ]
  },
  "capabilities": ["session-write"],
  "verified": {
    "at": "2026-09-04",
    "packages": [
      { "name": "dsh-workbench-ui", "version": "0.1.0" },
      { "name": "dsh-sidechat", "version": "0.1.0" }
    ]
```

</details>

**依据 8 · 源码核查**：[.github/workflows/index-publish.yml:7-66](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/.github/workflows/index-publish.yml#L7-L66)

触发、校验构建和自动合并PR。

<details>
<summary>查看原文（60行）</summary>

```text
on:
  push:
    branches: [main]
    paths:
      - 'registry/**'
      - 'plugins/**'
      - 'scripts/**'
  schedule:
    - cron: '23 4 * * 1'
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: index-publish
  cancel-in-progress: true

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Enable pnpm
        run: corepack enable && corepack prepare pnpm@11.21.0 --activate
      - name: Validate manifests
        run: node scripts/validate-manifests.mjs
      - name: Re-verify install sources (fails on unpublished/removed packages)
        run: node scripts/verify-packages.mjs
      - name: Build index
        run: node scripts/build-index.mjs
      - name: Open auto-merge PR when dist changed
        id: dist_pr
        uses: peter-evans/create-pull-request@v6
        with:
          title: 'chore(market): rebuild dist index'
          commit-message: 'chore(market): rebuild dist index'
          branch: auto/market-index
          delete-branch: true
          body: |
            Automated rebuild of `dist/index.json` + `dist/catalog.json`.

            - Triggered by: ${{ github.event_name }}
            - Source commit: ${{ github.sha }}

            Auto-generated by the index-publish workflow. Do not edit by hand.
          labels: automation
      - name: Auto-merge when checks pass
        if: steps.dist_pr.outputs.pull-request-number != ''
        run: gh pr merge --auto --squash "$PR"
        env:
          GH_TOKEN: ${{ github.token }}
          PR: ${{ steps.dist_pr.outputs.pull-request-number }}
      - name: Notify the Mayfly website
        if: steps.dist_pr.outputs.pull-request-number != '' && env.MARKET_NOTIFY_TOKEN != ''
        run: |
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 所谓验证真的验证了什么，权限/完整性边界怎样？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

npm验证真实下载tarball并检查package名、bundle patch存在/相对路径、verified版本对应；integrity只比较清单与registry元数据字符串，没有对下载字节计算sha512。只在verified版本等请求版本时比完整性，版本不同只warn继续；所以“来源verified”不等于当前包与历史验收同字节。安装脚本/native.node也只是warning，不因其存在阻止。profile-patch激活的包允许自己不带bundle，仍需消费方插入配置行。

GitHub验证确实会在临时profile写allowBuilds并pnpm add所有行，最长240秒，检查装出包/patch安全相对位置与lib目录；finally删临时目录。它不会启动DSH、核工具注册/权限/业务任务。允许的构建脚本可真实执行，scratch不等于OS沙箱；脚本仅源码审阅，本轮不运行或下载它们。运行消耗网络/磁盘/依赖生命周期权限，不能把“零依赖脚本”当只读安全扫描。

--offline会跳两类远端验证，--skip-install只跳GitHub；脚本最后仍可输出all install sources verified，读结果必须保留skip明细。PR工作流把GitHub源换为PR head sha/repo，能覆盖本次提交产物，但npm取动态registry，整体绿灯不能外推跨版本部署。实际Mayfly安装器、Host权限与子插件代码未在本根审计，不作全市场供应链安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/verify-packages.mjs:109-177](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L109-L177)

npm取版本/下载/元数据integrity比较与warning。

<details>
<summary>查看原文（69行）</summary>

```text
  const selector = parsed.selector
  const requestedVersion = selector === null
    ? latest
    : (packument['dist-tags']?.[selector] ?? selector)
  const version = packument.versions?.[requestedVersion]
  const tarballUrl = version?.dist?.tarball
  if (!version) {
    errors.push(`${id}: npm package ${name}@${requestedVersion} does not exist`)
    return
  }
  if (!tarballUrl) {
    errors.push(`${id}: npm package ${name}@${requestedVersion} has no tarball URL`)
    return
  }
  if (selector !== null && requestedVersion !== latest) {
    warnings.push(`${id}: ${name} pinned to ${requestedVersion} but registry latest is ${latest}`)
  }
  const response = await fetch(tarballUrl)
  if (!response.ok) {
    errors.push(`${id}: tarball download failed for ${name}@${requestedVersion}: HTTP ${response.status}`)
    return
  }
  const entries = tarEntries(Buffer.from(await response.arrayBuffer()))
  const names = entries.filter(e => e.regular).map(e => e.name)
  const has = (file) => names.includes(`package/${file}`)
  if (!has('package.json')) {
    errors.push(`${id}: ${name}@${requestedVersion} tarball has no package.json`)
    return
  }
  const inner = JSON.parse(String.fromCharCode(...entries.find(e => e.name === 'package/package.json').data))
  if (inner.name !== name) {
    errors.push(`${id}: npm tarball declares package name ${JSON.stringify(inner.name)}, expected ${name}`)
  }
  const verified = manifest.verified?.packages?.find(pkg => pkg.name === name)
  if (verified === undefined) {
    errors.push(`${id}: no verified package record for ${name}`)
  } else if (verified.version !== requestedVersion) {
    warnings.push(`${id}: ${name}@${requestedVersion} differs from verified ${verified.version} (updateAvailable)`)
  } else if (verified.integrity !== undefined && verified.integrity !== version.dist?.integrity) {
    errors.push(`${id}: ${name}@${requestedVersion} integrity differs from verified metadata`)
  }
  if (row.activation === 'profile-patch') {
    // Activated by an installer-inserted profile patch row; the tarball is not
    // expected to self-declare.
    console.log(`ok: ${id} npm ${name}@${requestedVersion} (activation=profile-patch)`)
  } else {
    const patch = inner.dsh?.bundle?.patch
    if (typeof patch !== 'string' || patch.length === 0) {
      errors.push(`${id}: ${name}@${requestedVersion} declares no dsh.bundle.patch — dsh would install it as a plain dependency`)
    } else {
      const normalizedPatch = patch.replace(/^\.\/+/, '')
      if (normalizedPatch.startsWith('../') || normalizedPatch.includes('/../') ||
          !names.includes(`package/${normalizedPatch}`)) {
        errors.push(`${id}: ${name}@${requestedVersion} dsh.bundle.patch ${JSON.stringify(patch)} is not in the tarball`)
      }
    }
    if (!has('cordis.patch.yml')) {
      errors.push(`${id}: ${name}@${requestedVersion} tarball ships no cordis.patch.yml`)
    }
  }
  for (const script of ['preinstall', 'postinstall', 'prepare']) {
    if (inner.scripts?.[script] !== undefined) {
      warnings.push(`${id}: ${name}@${requestedVersion} runs a ${script} script on install`)
    }
  }
  if (names.some(n => n.endsWith('.node'))) {
    warnings.push(`${id}: ${name}@${requestedVersion} ships native binaries`)
  }
  console.log(`ok: ${id} npm ${name}@${requestedVersion}`)
```

</details>

**依据 2 · 源码核查**：[scripts/verify-packages.mjs:197-250](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L197-L250)

真实pnpm scratch安装、allowBuilds和产物检查。

<details>
<summary>查看原文（54行）</summary>

```text
function verifyGithubEntry (id, manifest) {
  const rows = manifest.install.rows.filter(row => row.github)
  const specs = rows.map(githubSpec)
  const dir = mkdtempSync(join(tmpdir(), 'market-verify-'))
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'market-verify', private: true }, null, 2))
    const allowBuilds = manifest.install.allowBuilds ?? []
    const allowYaml = allowBuilds.length > 0
      ? 'allowBuilds:\n' + allowBuilds.map(name => `  ${JSON.stringify(name)}: true`).join('\n') + '\n'
      : ''
    // Mirrors the /plugin installer: allowBuilds from the manifest go into
    // the workspace before pnpm add.
    writeFileSync(join(dir, 'pnpm-workspace.yaml'),
      'packages:\n  - .\nnodeLinker: hoisted\nautoInstallPeers: false\n' + allowYaml)
    // All rows install together — exactly what the /plugin installer does, and
    // the only way sibling packages satisfy each other's peer dependencies.
    const result = spawnSync('pnpm', ['add', ...specs], { cwd: dir, encoding: 'utf8', timeout: 240_000 })
    if (result.status !== 0) {
      const tail = `${result.stdout ?? ''}${result.stderr ?? ''}`.split('\n').filter(Boolean).slice(-5).join(' | ')
      errors.push(`${id}: github scratch install failed for ${specs.join(' ')}: ${tail}`)
      return
    }
    for (const row of rows) {
      const installedPath = join(dir, 'node_modules', row.name, 'package.json')
      if (!existsSync(installedPath)) {
        errors.push(`${id}: github install produced no node_modules/${row.name}`)
        continue
      }
      const packageDir = join(dir, 'node_modules', row.name)
      const installed = JSON.parse(readFileSync(installedPath, 'utf8'))
      const verified = manifest.verified?.packages?.find(pkg => pkg.name === row.name)
      if (verified === undefined) {
        errors.push(`${id}: no verified package record for ${row.name}`)
      } else if (verified.version !== installed.version) {
        warnings.push(`${id}: ${row.name}@${installed.version} differs from verified ${verified.version} (updateAvailable)`)
      }
      const patch = installed.dsh?.bundle?.patch
      if (typeof patch !== 'string' || patch.length === 0) {
        errors.push(`${id}: github-installed ${row.name}@${installed.version} declares no dsh.bundle.patch`)
        continue
      }
      const packageRoot = resolve(packageDir)
      const patchPath = resolve(packageDir, patch)
      if (patchPath !== packageRoot && !patchPath.startsWith(`${packageRoot}${sep}`)) {
        errors.push(`${id}: github-installed ${row.name}@${installed.version} has an unsafe dsh.bundle.patch path`)
        continue
      }
      if (!existsSync(patchPath)) {
        errors.push(`${id}: github-installed ${row.name}@${installed.version} ships no ${patch}`)
        continue
      }
      if ((installed.main !== undefined || installed.exports !== undefined) &&
          !existsSync(join(packageDir, 'lib'))) {
        errors.push(`${id}: github-installed ${row.name}@${installed.version} exposes lib but ships no lib/ (commit build output)`)
```

</details>

**依据 3 · 源码核查**：[scripts/verify-packages.mjs:253-257](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L253-L257)

临时目录清理。

```text
      console.log(`ok: ${id} github ${githubRepo(row)}#${githubRef(row)}${row.github.subdir ? `&path:${row.github.subdir}` : ''} -> ${row.name}@${installed.version}`)
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
```

**依据 4 · 源码核查**：[scripts/verify-packages.mjs:269-299](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L269-L299)

offline/skip-install分支与最终成功文字。

<details>
<summary>查看原文（31行）</summary>

```text
for (const manifest of records) {
  if (onlyId && manifest.id !== onlyId) continue
  if (manifest.status === 'removed') {
    console.log(`skip: ${manifest.id} (removed tombstone)`)
    continue
  }
  const githubRows = []
  for (const row of manifest.install.rows) {
    if (row.npm) {
      if (offline) console.log(`skip: ${manifest.id} npm ${row.name} (--offline)`)
      else await verifyNpmRow(manifest.id, row, manifest)
    }
    if (row.github) githubRows.push(row)
  }
  if (githubRows.length > 0) {
    if (offline || skipInstall) {
      const reason = offline ? '--offline' : '--skip-install'
      for (const row of githubRows) console.log(`skip: ${manifest.id} github ${githubSpec(row)} (${reason})`)
    } else {
      verifyGithubEntry(manifest.id, manifest)
    }
  }
}

for (const warning of warnings) console.warn(`warn: ${warning}`)
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`)
  console.error(`\n${errors.length} error(s).`)
  process.exit(1)
}
console.log('OK: all install sources verified.')
```

</details>

**依据 5 · 源码核查**：[.github/workflows/registry-validate.yml:20-38](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/.github/workflows/registry-validate.yml#L20-L38)

PRhead安装检查与Schema。

<details>
<summary>查看原文（19行）</summary>

```text
        with:
          node-version: 22
      - name: Enable pnpm
        run: corepack enable && corepack prepare pnpm@11.21.0 --activate
      - name: Validate manifests (fast local gate)
        run: node scripts/validate-manifests.mjs
      - name: Validate manifests (JSON Schema via ajv)
        run: |
          npx --yes ajv-cli@5 validate \
            -s registry/schema/plugin-manifest.v1.json \
            -d 'registry/official/*.json' -d 'registry/dsh/*.json' -d 'registry/community/*.json' \
            --spec=draft7
      - name: Verify install sources (npm tarballs + GitHub scratch installs)
        run: >-
          node scripts/verify-packages.mjs
          --github-ref "${{ github.event.pull_request.head.sha || 'main' }}"
          --github-repo "${{ github.event.pull_request.head.repo.full_name || 'Ephemeral-AI-Lab/dsh-plugins' }}"
      - name: Smoke-build the index
        run: node scripts/build-index.mjs --out /tmp/dist-smoke
```

</details>

**依据 6 · 源码核查**：[docs/market.md:76-92](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L76-L92)

源/构建许可约定。

<details>
<summary>查看原文（17行）</summary>

```text
- At least one of `npm` / `github` per row. `npm` is preferred when the
  package is published; `github` covers unpublished packages and monorepo
  subdirectories.
- pnpm spec grammar (dsh forwards verbatim):
  - npm: `name`, `name@version`, `name@tag`
  - GitHub: `github:<owner>/<repo>#<ref>` and, for monorepos,
    `github:<owner>/<repo>#<ref>&path:<subdir>`
- Community entries should pin `ref` to a commit SHA. Git installs fetch
  **sources**, so the referenced tree must contain build output (committed
  `lib/`) — CI scratch-installs every row and fails otherwise.
- All rows of an entry install together (`dsh plugin add a b ...`) and are
  removed together.
- `install.allowBuilds: ["node-pty"]` names packages whose install scripts
  pnpm may run. pnpm >= 10 blocks dependency build scripts by default; the
  installer writes these into the profile's `pnpm-workspace.yaml` before
  `pnpm add` (native addons like `node-pty` need this). Declare only what the
  plugin genuinely needs — reviewers scrutinize this list.
```

</details>

#### 缺口

- 未执行验证CI、Mayfly安装器、DSH加载或逐插件运行/权限。
  **影响**：不支持市场条目可直接信任/全功能可用结论。
  **进一步探讨**：先选择固定具体包，审脚本/权限并隔离核激活与一条任务；保留验证模式/源hash。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何具体使用这个市场，完整负担是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可试用作发现入口：已有Mayfly/DSH用户先浏览一个明确缺口的条目，核server/web/tui、安装行顺序、bundle或profile-patch激活和verified日期/版本；保留原profile，之后若另决定安装，固定Git commit或npm版本，并单独核实际加载与一条非关键任务。新包是否值得采用是下一次研究，不因市场收录直接授权执行。这里只推荐读取筛选，不推荐运行全库verify来证明自身环境安全。

首次浏览只需读JSON/文档，维护市场需Node22/pnpm/网络、Schema工具和CI权限；持续有npm漂移/分支漂移、周期安装/构建/PR、人审和许可证来源维护。下载量/verified日期不代效果或费用；包模型、网络、凭据/进程成本继承各子项，本根无直接模型费也不意味着下游免费。失败需分富化网络失败、包产物缺失、安装生命周期失败和运行激活失败，不能只重建index。退出浏览无运行态，若已装则按整个install.rows撤包/patch、另处理各插件数据/活进程，根registry不会统一回滚。来源/激活/权限解释不清时停止于条目阅读，回直接仓库/官方安装说明。

#### 证据与依据

**依据 1 · 源码核查**：[docs/market.md:6-18](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L6-L18)

发现/安装与runtime分离。

<details>
<summary>查看原文（13行）</summary>

```text
## Boundaries

The manifest is **discovery- and install-time metadata only**. It never
participates in runtime loading, capability negotiation, or admission — the
runtime contract of every plugin remains:

1. an installable package (npm or GitHub) understood by
   `dsh plugin --profile <name> add <spec>`, which forwards verbatim to pnpm;
2. the package's own `cordis.patch.yml`, declared via the `dsh.bundle.patch`
   field in its `package.json` — or rows the installer inserts into the
   profile's `cordis.patch.yml` (see [Activation](#activation)).

Mayfly intentionally has no runtime manifest; nothing here changes that.
```

</details>

**依据 2 · 源码核查**：[docs/market.md:76-103](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L76-L103)

固定源/成组行/激活条件。

<details>
<summary>查看原文（28行）</summary>

```text
- At least one of `npm` / `github` per row. `npm` is preferred when the
  package is published; `github` covers unpublished packages and monorepo
  subdirectories.
- pnpm spec grammar (dsh forwards verbatim):
  - npm: `name`, `name@version`, `name@tag`
  - GitHub: `github:<owner>/<repo>#<ref>` and, for monorepos,
    `github:<owner>/<repo>#<ref>&path:<subdir>`
- Community entries should pin `ref` to a commit SHA. Git installs fetch
  **sources**, so the referenced tree must contain build output (committed
  `lib/`) — CI scratch-installs every row and fails otherwise.
- All rows of an entry install together (`dsh plugin add a b ...`) and are
  removed together.
- `install.allowBuilds: ["node-pty"]` names packages whose install scripts
  pnpm may run. pnpm >= 10 blocks dependency build scripts by default; the
  installer writes these into the profile's `pnpm-workspace.yaml` before
  `pnpm add` (native addons like `node-pty` need this). Declare only what the
  plugin genuinely needs — reviewers scrutinize this list.

### Activation

Two ways an installed package becomes part of a profile:

1. **`bundle` (default)** — the package's `package.json` declares
   `dsh.bundle.patch`; dsh appends it to `dsh.profile.bundles` automatically
   after `pnpm add`. Nothing else to do.
2. **`profile-patch`** — used by `@deepseek-ai` optional plugins that ship no
   patch of their own. The installer must additionally append a row to the
   profile's `cordis.patch.yml` after installation:
```

</details>

**依据 3 · 作者声明**：[README.md:34-47](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/README.md#L34-L47)

作者安装后重启和profile-patch说明。

<details>
<summary>查看原文（14行）</summary>

````text
Or with the dsh CLI directly (works for any profile):

```sh
# npm source
dsh plugin --profile mayfly add @deepseek-ai/dsh-terminal-bash @deepseek-ai/dsh-tool-terminal

# GitHub source (monorepo subdirectories work; pinned refs preferred)
dsh plugin --profile mayfly add 'github:Ephemeral-AI-Lab/dsh-plugins#main&path:plugins/loop'
```

Restart the profile and start a new session after installing. Entries with
`activation: profile-patch` additionally need their rows in the profile's
`cordis.patch.yml` — the `/plugin` command does this for you; see
[docs/market.md](./docs/market.md#activation) for the manual path.
````

</details>

**依据 4 · 源码核查**：[.github/workflows/index-publish.yml:29-42](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/.github/workflows/index-publish.yml#L29-L42)

维护依赖与周期验证调用。

<details>
<summary>查看原文（14行）</summary>

```text
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Enable pnpm
        run: corepack enable && corepack prepare pnpm@11.21.0 --activate
      - name: Validate manifests
        run: node scripts/validate-manifests.mjs
      - name: Re-verify install sources (fails on unpublished/removed packages)
        run: node scripts/verify-packages.mjs
      - name: Build index
        run: node scripts/build-index.mjs
      - name: Open auto-merge PR when dist changed
```

</details>

#### 缺口

- 没有筛选效率、实际采用/维护时间或下游费用对照。
  **影响**：仅支持读取市场挑候选，不给子插件使用背书。
  **进一步探讨**：记录选择错误/前端错配/安装步骤与直接仓库对照，再决定是否继续。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 有什么可证伪的根市场改进？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是按条目公开“形状已校验/来源字节已核/装出产物/宿主激活/业务任务”分层证据，并把当前安装源hash与verified记录绑定；不要把所有层压成一个verified词。当前已有日期/版本/可选integrity与scratch产物检查，增量是让使用者知道哪层仍未知，不把目录变成新的权限执行平台。

最小对照用main漂移但同包版本、npm版本变更仅warn、offline全部skip和profile-patch漏激活四样本，比较读者能否选出还需核的步骤、减少误装与排障时间。代价是运行样本与证据保鲜、额外CI和维护；若分层标签未改善选择却长期失真，则只做最小源hash/验证模式而不扩展。未实现/验证，不计已有创新或商业需求。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/verify-packages.mjs:142-148](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L142-L148)

版本变更只warn与元数据hash比较。

```text
  const verified = manifest.verified?.packages?.find(pkg => pkg.name === name)
  if (verified === undefined) {
    errors.push(`${id}: no verified package record for ${name}`)
  } else if (verified.version !== requestedVersion) {
    warnings.push(`${id}: ${name}@${requestedVersion} differs from verified ${verified.version} (updateAvailable)`)
  } else if (verified.integrity !== undefined && verified.integrity !== version.dist?.integrity) {
    errors.push(`${id}: ${name}@${requestedVersion} integrity differs from verified metadata`)
```

**依据 2 · 源码核查**：[scripts/verify-packages.mjs:269-299](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/scripts/verify-packages.mjs#L269-L299)

跳过与成功输出。

<details>
<summary>查看原文（31行）</summary>

```text
for (const manifest of records) {
  if (onlyId && manifest.id !== onlyId) continue
  if (manifest.status === 'removed') {
    console.log(`skip: ${manifest.id} (removed tombstone)`)
    continue
  }
  const githubRows = []
  for (const row of manifest.install.rows) {
    if (row.npm) {
      if (offline) console.log(`skip: ${manifest.id} npm ${row.name} (--offline)`)
      else await verifyNpmRow(manifest.id, row, manifest)
    }
    if (row.github) githubRows.push(row)
  }
  if (githubRows.length > 0) {
    if (offline || skipInstall) {
      const reason = offline ? '--offline' : '--skip-install'
      for (const row of githubRows) console.log(`skip: ${manifest.id} github ${githubSpec(row)} (${reason})`)
    } else {
      verifyGithubEntry(manifest.id, manifest)
    }
  }
}

for (const warning of warnings) console.warn(`warn: ${warning}`)
if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`)
  console.error(`\n${errors.length} error(s).`)
  process.exit(1)
}
console.log('OK: all install sources verified.')
```

</details>

**依据 3 · 源码核查**：[registry/official/sidechat.json:18-38](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/registry/official/sidechat.json#L18-L38)

main漂移和版本记录样本。

<details>
<summary>查看原文（21行）</summary>

```text
  "install": {
    "rows": [
      {
        "id": "workbench-ui",
        "name": "dsh-workbench-ui",
        "github": { "repo": "Ephemeral-AI-Lab/dsh-plugins", "ref": "main", "subdir": "plugins/work-bench-ui" }
      },
      {
        "id": "sidechat",
        "name": "dsh-sidechat",
        "github": { "repo": "Ephemeral-AI-Lab/dsh-plugins", "ref": "main", "subdir": "plugins/sidechat" }
      }
    ]
  },
  "capabilities": ["session-write"],
  "verified": {
    "at": "2026-09-04",
    "packages": [
      { "name": "dsh-workbench-ui", "version": "0.1.0" },
      { "name": "dsh-sidechat", "version": "0.1.0" }
    ]
```

</details>

**依据 4 · 源码核查**：[docs/market.md:98-103](https://github.com/Ephemeral-AI-Lab/dsh-plugins/blob/cb9ea007a6b41da06b65f9ed9a86e028eee9e60e/docs/market.md#L98-L103)

需要消费者激活patch。

```text
1. **`bundle` (default)** — the package's `package.json` declares
   `dsh.bundle.patch`; dsh appends it to `dsh.profile.bundles` automatically
   after `pnpm add`. Nothing else to do.
2. **`profile-patch`** — used by `@deepseek-ai` optional plugins that ship no
   patch of their own. The installer must additionally append a row to the
   profile's `cordis.patch.yml` after installation:
```

#### 缺口

- 未证明分层证据的使用需求/净收益。
  **影响**：仅候选，不能作已完成可信市场能力。
  **进一步探讨**：用四样本盲读选择/排障对照后定范围。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
