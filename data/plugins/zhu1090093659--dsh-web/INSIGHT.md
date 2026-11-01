# dsh-web

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web)
<!-- END META -->

> **功能**：面向 DeepSeek Harness Web GUI 的模块化插件与主题集合。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示根载具及生成器集中组织多包配置和维护；子包本身的功能不能归为根包独立实现。

> **主要限制**：[Q03](#research-q03) 与 [Q04](#research-q04) 表明固定根提交不锁定 profile 实际 registry 闭包，插入行也不等于启用、运行或故障隔离。

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
  - [Q01 · 谁需要根载具，相对独立安装聚合包有什么增量？](#detail-section-11)
  - [Q02 · 根 bundle 如何接线，生成器如何组织组件？](#detail-section-12)
  - [Q03 · 固定根 SHA 是否固定实际运行闭包？](#detail-section-13)
  - [Q04 · 根包承诺的功能和安全隔离能否归给根组件？](#detail-section-14)
  - [Q05 · 安装、持续维护和恢复的代价及采用条件是什么？](#detail-section-15)
  - [Q06 · 能否增加运行闭包核验以减少安装漂移？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要多项 DSH Web 功能的用户和维护多包组件的贡献者。

直接安装聚合包或按需安装独立插件也能获得功能；根包增加 Git 来源和同仓维护入口，未证明节省时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 聚合载具 | 用根 Git 来源组合 Web 插件 | 实际功能由子包及宿主提供 |
| 生成与一致性检查 | 展开组件配置并比较生成结果 | 本轮未执行，外部包解析会影响生成 |
| 按行配置 | 为具体功能生成独立行 | 插入不等于启用或成功运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Web 宿主 | 使用界面必需 | 加载 bundle 与客户端 | 可能无法挂载 |
| @linxin666/dsh-web-all 及其依赖 | 聚合功能必需 | 提供组合和各功能行 | 部分或全部功能不可用 |
| 各组件权限、数据与外部服务 | 仅对应功能需要 | 支持具体任务 | 需停用该行或恢复配置 |
| pnpm 与仓库依赖 | 仓内开发需要 | 构建与生成检查 | 无法进行对应维护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile，记录宿主与安装来源 | 能恢复原配置 |
| 安装与解析 | 用户在隔离宿主安装并检查实际依赖 | 版本、patch 和包来源可核对 |
| 启用与验收 | 用户仅启用所需行并检查权限 | 对每项功能独立验收 |
| 失败恢复 | 用户停用问题行并恢复备份 | 核实服务及数据状态，必要时按需安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载、存储及外部服务费用未知 | 核对宿主和实际包版本 | Git SHA 不锁 registry 闭包 |
| 持续 | 各子包及相关服务资源未知 | 维护版本、配置与权限 | 节省的操作时间未测 |
| 故障恢复 | 备份和重装资源未知 | 定位问题行、回退配置并复验 | 外部状态和耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一装配 | 根包 patch 与生成器组织子包行 | 实际宿主加载成功率 |
| 开发一致性 | 生成器有递归检查和 check 模式 | 未运行检查，不知当前环境是否通过 |
| 按需启用 | 部分行默认 disabled | 依赖是否卸载或所有行完全隔离 |

> **思考**：[Q03](#research-q03) 与 [Q04](#research-q04) 表明固定根提交不锁定 profile 实际 registry 闭包，插入行也不等于启用、运行或故障隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示根载具及生成器集中组织多包配置和维护；子包本身的功能不能归为根包独立实现。

[Q02](#research-q02) 的递归展开、命名空间和失败退出为多包维护提供具体检查；[Q04](#research-q04) 的真实包直挂带来独立加载和隔离取舍，不能由源码推断宿主执行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 与 [Q04](#research-q04) 表明固定根提交不锁定 profile 实际 registry 闭包，插入行也不等于启用、运行或故障隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议备份并在隔离 profile 先核实来源和所需行；版本、权限或恢复状态不明时暂停并改用按需安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本根载具和代表聚合接线已核查；实际安装、宿主兼容、用户收益与新方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、pnpm-workspace.yaml、pnpm-lock.yaml、scripts/aggregate.mjs、packages/dsh-web-all/package.json、packages/dsh-web-all/cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定根清单、README、工作区锁、聚合生成器及 web-all 的代表性清单和 patch；上轮同提交子组件研究仅用来确认源码身份，不冒充运行闭包或复验所有子包。未安装、运行目标、构建、宿主或网络请求。
- 下一步：固定宿主、安装来源和 profile，先核对实际解析与启用行，再用 [Q06](#research-q06) 的夹具对照 lock+人工核查；还需逐项测缺包、权限和恢复。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设在用户同意下只读对照实际运行闭包与安装记录，可补充开发 lock 的运行状态盲区；方案、兼容和收益均未验证。

固定宿主、安装来源和 profile，先核对实际解析与启用行，再用 [Q06](#research-q06) 的夹具对照 lock+人工核查；还需逐项测缺包、权限和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1331 | 76590 | — | — | 1740135 |
| .mjs | source | 70 | 17513 | 12356 | 4041 | — |
| .tsx | source | 141 | 36498 | 27542 | 7178 | — |
| .ts | source | 796 | 180342 | 111222 | 57897 | — |
| .js | source | 27 | 13815 | 11377 | 2370 | — |
| .ts | test | 478 | 122042 | 89282 | 22472 | — |
| .tsx | test | 91 | 24791 | 17855 | 4200 | — |
| .md | example | 1 | 64 | — | — | 473 |
| .ts | example | 4 | 52 | 22 | 27 | — |
| .mjs | test | 40 | 9495 | 7655 | 1243 | — |
| .cjs | source | 2 | 146 | 79 | 87 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 169](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=169&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 169](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=169&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根 bundle 的组合维护贡献、运行闭包与子组件边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要根载具，相对独立安装聚合包有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要维护多个 DSH Web 插件的用户或仓库贡献者可使用根仓库作为源码和 Git bundle 入口。README.md:1-5 作者将其描述为任务看板、远程、SSH 和 Git 等生态；package.json:1-17 的根包 private，bundle 引用 web-all 的 patch，并依赖 @linxin666/dsh-web-all 的 ^0.4.13。直接安装该聚合包也提供集中入口，因此根载具的增量是同仓开发和 Git 来源的组织方式，不能把子包运行能力或一键安装效果归为根包独立实现。用户数、重复需求和相对安装时间未有独立对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/README.md#L1-L5)

作者描述插件生态和使用场景。

```text
# dsh-web · DeepSeek Harness (DSH) Web GUI 插件与主题全家桶

中文 | [English](README.en.md)

dsh-web 是面向 DeepSeek Harness（DSH）Web GUI、DeepSeek 网页版与官方桌面客户端（DeepSeek Desktop）的模块化插件生态与 AI 智能体开发工作台。全面支持 DeepSeek-V3 与 DeepSeek-R1 等前沿推理模型，为开发者与重度用户提供自主任务自动化看板（Cron 定时后台执行）、手机 App 远程访问、Web SSH 终端与 Linux 集群运维、Git 可视化提交图谱与多 Agent Worktree 隔离开发、全量会话检索与归档管理、Token 用量与成本监控（含 Token 银行），以及一站式主题皮肤与桌面宠物工坊。用户既可以通过官方 profile 机制将插件全家桶一键挂载至已有的 `dsh web` 实例，也可以直接在官方 DeepSeek Harness 桌面客户端中开箱即用。
```

**依据 2 · 源码核查**：[package.json:1-17](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/package.json#L1-L17)

私有根包、bundle patch 和聚合依赖。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "dsh-web",
  "version": "0.4.13",
  "private": true,
  "description": "DeepSeek Harness Web GUI 插件全家桶。皮肤、宠物与社区插件索引已拆分为独立仓库（dsh-skins / dsh-pet / dsh-community-plugins），本仓通过 npm 包内置它们。",
  "dsh": {
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml",
    "locale"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.13"
```

</details>

#### 缺口

- 用户实际频率和直接安装对照未知
  **影响**：无法量化根载具的收益
  **进一步探讨**：以相同宿主比较 Git 根载具和直接聚合包的安装与验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根 bundle 如何接线，生成器如何组织组件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 package.json:6-17 将 DSH bundle 指向 packages/dsh-web-all/cordis.patch.yml，并声明聚合依赖。生成器 scripts/aggregate.mjs:510-518 扫描子包 manifest，735-765 递归展开 patch 并检查循环、缺文件与空行，120-123 为子行添加命名空间；1181-1222 形成 patch 与包清单，1244-1252 遇错误退出，--check 的磁盘比较见 1255-1279。聚合 patch:8-21 有 compat 与真实插件行，32-55 有看板和 Git 行。它说明静态装配及一致性检查设计，不证明当前环境执行检查通过，也不证明 Loader 成功挂载。真实行而非根包实现具体功能；包版本与外部依赖仍须另查。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-17](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/package.json#L6-L17)

根 bundle 和依赖。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml",
    "locale"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.13"
```

</details>

**依据 2 · 源码核查**：[scripts/aggregate.mjs:114-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/scripts/aggregate.mjs#L114-L123)

为行 ID 生成命名空间。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Namespace one child row id for the aggregate patch. The bundle prefix
 * (web-ui-) keeps every aggregate row distinct from its standalone package's
 * own id, so installing both no longer trips the loader's duplicate-entry
 * check. Idempotent for ids that already carry the prefix.
 */
function namespaceId(id) {
  if (id.startsWith('web-ui-')) return id
  return `web-ui-${id.replace(/^(ui-|web-ui-)+/, '')}`
}
```

</details>

**依据 3 · 源码核查**：[scripts/aggregate.mjs:735-765](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/scripts/aggregate.mjs#L735-L765)

递归展开和错误分支。

<details>
<summary>查看原文（31行）</summary>

```text
function collectRows(pkgDir, entry, via, visited, errors, blocks) {
  const manifestPath = join(pkgDir, 'aggregate.yml')
  if (existsSync(manifestPath)) {
    if (visited.has(pkgDir)) {
      errors.push(`aggregate cycle: ${[...visited, pkgDir].join(' -> ')}`)
      return
    }
    visited.add(pkgDir)
    const manifest = parseManifest(manifestPath, errors)
    for (const sub of manifest.patchFrom) {
      const subDir = resolvePath(pkgDir, sub)
      if (!existsSync(subDir)) {
        errors.push(`patchFrom target not found: ${manifestPath} -> ${sub} (${subDir})`)
        continue
      }
      collectRows(subDir, sub, [...via, entry], visited, errors, blocks)
    }
    visited.delete(pkgDir)
    return
  }
  const patchPath = join(pkgDir, 'cordis.patch.yml')
  if (!existsSync(patchPath)) {
    errors.push(`patchFrom target has no cordis.patch.yml: ${pkgDir} (via ${[...via, entry].join(' -> ')})`)
    return
  }
  const rows = parsePatchBlocks(patchPath, errors)
  if (rows.length === 0) {
    errors.push(`no plugin rows parsed from ${patchPath}`)
    return
  }
  blocks.push({ entry, via, rows })
```

</details>

**依据 4 · 源码核查**：[scripts/aggregate.mjs:1181-1222](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/scripts/aggregate.mjs#L1181-L1222)

生成 patch 与依赖清单。

<details>
<summary>查看原文（42行）</summary>

```text
const errors = []
const results = []
for (const { pkgDir, ymlPath } of aggregates) {
  const rel = relative(REPO_ROOT, pkgDir)
  const manifest = parseManifest(ymlPath, errors)
  const blocks = []
  const visited = new Set()
  for (const entry of manifest.patchFrom) {
    const target = resolvePath(pkgDir, entry)
    if (!existsSync(target)) {
      errors.push(`patchFrom target not found: ${ymlPath} -> ${entry} (${target})`)
      continue
    }
    collectRows(target, entry, [], visited, errors, blocks)
  }
  if (manifest.self) {
    // self: the aggregate package loads ITS OWN plugin (host + client half)
    // through one patch row, e.g. the compat shim living inside web-ui-all.
    // unshift keeps the self block FIRST in the rendered patch so its ordering
    // does not drift when the patchFrom entries change.
    if (!/^[a-z0-9-]+$/.test(manifest.self)) {
      errors.push(`invalid self entry '${manifest.self}' (must match ^[a-z0-9-]+$); skipping self block`)
    } else {
      let selfName
      try {
        selfName = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')).name
      } catch (e) {
        errors.push(`cannot read self package name: ${e.message}`)
      }
      if (selfName) blocks.unshift({ entry: 'self', via: [], rows: [{ kind: 'insert', id: manifest.self, name: selfName, configLines: [] }] })
    }
  }
  if (manifest.patchFrom.length === 0 && !manifest.self) {
    console.log(`[aggregate] WARN ${rel}: aggregate.yml has no patchFrom entries (patch would be empty)`)
  }
  const shellSubpaths = collectShellSubpaths(manifest.tombstones)
  if (shellSubpaths.length > 0) validateShellFiles(pkgDir, rel, errors)
  const shellNotes = resolveShellNotes(manifest.shellNotes, shellSubpaths, rel, errors)
  const patch = renderPatch(blocks, manifest.rows, manifest.patches ?? [], manifest.inactive ?? [], manifest.retire ?? [], manifest.familyIds, errors, rel, pkgDir)
  const resolvedDeps = resolveEntries(pkgDir, manifest.deps, 'deps', errors)
  const retiredPlugins = resolveRetiredPlugins(manifest.retiredPlugins, manifest.tombstones, resolvedDeps, rel, errors)
  const pkgJson = renderPackageJson(join(pkgDir, 'package.json'), resolvedDeps, shellSubpaths)
```

</details>

**依据 5 · 源码核查**：[scripts/aggregate.mjs:1244-1279](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/scripts/aggregate.mjs#L1244-L1279)

错误退出和 check 比较。

<details>
<summary>查看原文（36行）</summary>

```text
let failed = false
if (errors.length) {
  for (const e of errors) console.error(`[aggregate] ERROR ${e}`)
  failed = true
}

if (failed) {
  console.error(CHECK ? '[aggregate] check FAILED: generated content differs from disk' : '[aggregate] FAILED: see errors above; no files written')
  process.exit(1)
}

for (const r of results) {
  const patchPath = join(REPO_ROOT, r.rel, 'cordis.patch.yml')
  const pkgPath = join(REPO_ROOT, r.rel, 'package.json')
  const metadataFiles = r.shellMetadata.map(({ path, content }) => [relative(REPO_ROOT, path), path, content])
  const retiredFile = r.retiredPluginsModule === undefined
    ? []
    : [['retired-plugins.generated.ts', join(REPO_ROOT, r.rel, 'src', 'retired-plugins.generated.ts'), r.retiredPluginsModule]]
  if (CHECK) {
    const diffs = []
    if (!existsSync(patchPath) || readFileSync(patchPath, 'utf8') !== r.patch) diffs.push(relative(REPO_ROOT, patchPath))
    if (!existsSync(pkgPath) || readFileSync(pkgPath, 'utf8') !== r.pkgJson) diffs.push(relative(REPO_ROOT, pkgPath))
    for (const [, filePath, content] of [...metadataFiles, ...retiredFile]) {
      if (!existsSync(filePath) || readFileSync(filePath, 'utf8') !== content) diffs.push(relative(REPO_ROOT, filePath))
    }
    // Symmetry with write mode: pruneShellMetadata deletes shell-metadata
    // entries the manifest no longer owns, so check mode has to report them as
    // drift — otherwise a family that lost its row keeps its directory (and
    // its exports) forever and `--check` stays green.
    const strays = strayShellMetadata(resolvePath(REPO_ROOT, r.rel), r.shellSubpaths)
    if (diffs.length || strays.length) {
      for (const d of diffs) console.log(`[aggregate] check: ${d} differs from generated content`)
      for (const stray of strays) console.log(`[aggregate] check: ${relative(REPO_ROOT, stray)} is not owned by the manifest (run without --check to prune it)`)
      failed = true
    } else {
      const rows = r.blocks.reduce((n, b) => n + b.rows.length, 0)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-21](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L8-L21)

compat 与真实插件行。

<details>
<summary>查看原文（14行）</summary>

```text
# from self
- insert:
    - id: web-ui-compat
      name: '@linxin666/dsh-web-all'

# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'
```

</details>

#### 缺口

- 未运行生成器、Loader 或子组件
  **影响**：静态接线不能保证实际装载
  **进一步探讨**：隔离宿主比较生成检查、安装记录和逐行加载结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定根 SHA 是否固定实际运行闭包？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

不是。package.json:16-17 将聚合包指定为 ^0.4.13；pnpm-workspace.yaml:1-11 和 pnpm-lock.yaml:9-15 显示仓内开发解析指向 link:packages/dsh-web-all，而 workspace 注释说明 profile 的 Git 安装走 registry。仓内同一提交的 web-all package.json:2-4 为 0.4.13；上轮 web-all、Git graph、task-board 和 SSH 已研究快照都固定 68a78d05a6c8c27305671cfc42c30cbbec8014f5，但它们只证明各仓内研究对象的源码身份，不能证明用户安装时实际 npm 包、传递依赖和启用状态与其一致。聚合包还声明 DSH >=0.2.1-rc.3；范围是兼容声明而非所有版本通过验收。实际 npm 解析、宿主 peer 和 lock 未采集。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-17](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/package.json#L11-L17)

根包列入文件及聚合范围。

```text
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml",
    "locale"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.13"
```

**依据 2 · 源码核查**：[pnpm-workspace.yaml:1-11](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-workspace.yaml#L1-L11)

工作区链接及 profile registry 的声明。

<details>
<summary>查看原文（11行）</summary>

```text
packages:
  - 'shared'
  - 'packages/*'

# SDK peers 不自动安装，运行时由 DSH profile 树解析
# （原 true 只为聚合包发布时解析 peers，现已不需要）。
autoInstallPeers: false

# 根包作为可安装 bundle（dsh.bundle）依赖聚合包；仓库内开发时把该 range
# 链接到 workspace 工程（版本同源），profile 里的 git 安装仍走 npm registry。
linkWorkspacePackages: true
```

</details>

**依据 3 · 源码核查**：[pnpm-lock.yaml:9-15](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-lock.yaml#L9-L15)

仓内 lock 根 importer 链接聚合子包。

```text
importers:

  .:
    dependencies:
      '@linxin666/dsh-web-all':
        specifier: ^0.4.13
        version: link:packages/dsh-web-all
```

**依据 4 · 源码核查**：[packages/dsh-web-all/package.json:1-4](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L1-L4)

同仓聚合版本。

```text
{
  "name": "@linxin666/dsh-web-all",
  "description": "DSH Web UI 全家桶聚合插件：一键安装全部功能插件（task-board / git-graph / pet / web-ui-settings / skin-center / community-plugins / compat shim）。compat 桥接层已并入本包（src/client），无需独立 compat npm 包。",
  "version": "0.4.13",
```

**依据 5 · 源码核查**：[packages/dsh-web-all/package.json:107-112](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L107-L112)

聚合包的 DSH 引擎与 patch。

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
```

#### 缺口

- 没有用户 profile 的实际解析和锁
  **影响**：无法断言实际包版本、加载状态及兼容性
  **进一步探讨**：在用户授权的隔离环境记录安装解析、host 版本和有效行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 根包承诺的功能和安全隔离能否归给根组件？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

不能笼统归因。README.md:65-78 按任务列出看板、SSH、Git 等作者主张；实际 patch 在 packages/dsh-web-all/cordis.patch.yml:32-55、72-85 分别插入真实子包行，而 118-123 将 SSH 和 Skill Explorer 标为默认 disabled。scripts/aggregate.mjs:145-160 的维护说明还明确，过去按家族壳加载可隔离部分导入失败，但当前直挂真实包以装载各自浏览器半区，存在隔离取舍。已安装依赖、插入行、默认启用和运行成功是不同状态；既不能由 README 功能表推断全家族可用，也不能把旧壳当现行每行故障隔离的证明。没有逐个验收各行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-78](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/README.md#L65-L78)

作者按任务列出功能和入口。

<details>
<summary>查看原文（14行）</summary>

```text
### 按使用场景快速选择扩展方案

| 核心使用场景与用户需求 | 推荐解决方案与能力 | 快速入口 |
| --- | --- | --- |
| 打造 24/7 无人值守 AI 研发流水线，通过 Cron 定时巡检、多 Agent 团队级联协作、Issue 自动修复提 PR 或长程目标闭环 | 任务看板：Host 权威后台调度、多 Agent 级联/Teams 编排、对抗式裁判验收质检、GitHub Issue-to-PR 闭环、防休眠电源守护 | [任务看板与 cron 定时执行](packages/dsh-task-board/README.zh.md) |
| 追求极致编码推理效率与超低上下文开销，需要极简 Prompt、程序化工具调用（PTC）与严苛 Agent 调度/工作纪律 | 梁神模式：极简 Persona、run_code 程序化传输、MCP 温和分页、关键事实登记簿与老虎机拨杆开关 | [梁神模式预设与 PTC 传输](packages/dsh-liangshen/README.zh.md) |
| 在手机上通过协议 v1 远程访问与控制 DeepSeek Harness | 手机 App 远程访问：协议 v1 WebSocket、会话流式响应、入站网关与公网/局域网接入 | [手机 App 远程访问](packages/dsh-remote-bridge/README.zh.md) |
| 委派 AI 智能体执行远程 Linux 服务器运维、SFTP 文件传输、SSH 终端交互或排查线上服务 | SSH 运维面板：Web 终端 (xterm.js)、可视化 SFTP 传输、端口转发隧道、集群批量命令 | [SSH 终端、文件传输与隧道](packages/dsh-ssh/README.zh.md) |
| 监控 DeepSeek API 及主流大模型 Token 消耗明细、查询供应商账户余额预警或套餐进度 | 使用统计：每日消耗明细、余额查询、账单估算、套餐追踪与 Token 银行鲸元券 | [用量统计与 Token 银行](packages/dsh-usage/README.zh.md) |
| 多 AI Agent 并行编码容易产生代码覆盖冲突，需要分支与物理工作区彻底隔离 | Git 图谱与 Worktree：可视化提交图谱、自动为会话创建专属 worktree 分支与物理目录 | [Git 可视化与 Worktree 隔离](packages/dsh-git-graph/README.zh.md) |
| 历史会话堆积难以快速定位，需要全量多维搜索过滤、批量归档、级联清理或数据备份 | 会话归档管理器：多维搜索过滤、批量归档与级联清理、自动化生命周期策略 | [全量会话归档管理](packages/dsh-session-archive/README.zh.md) |
| 打造个性化界面外观，更换深色护眼主题、Wallpaper Engine 动态壁纸或互动桌面宠物 | 创意工坊与皮肤中心：Blue Fantasy 经典暗色内置，海量皮肤、动态壁纸与桌宠 | [浏览 DSH 创意工坊](https://dsh-market.com) |
| 在官方桌面客户端（DeepSeek Harness Desktop）中开箱即用本扩展生态 | 官方桌面客户端：支持直接通过客户端内置插件管理一键安装本全家桶 | [官方桌面客户端安装说明](#官方桌面客户端) |
| 为已有的 DeepSeek Harness CLI / Web 环境一键安装插件全家桶 | 快速上手：一行命令通过 npm 或 GitHub 仓库地址直接安装 | [插件安装快速上手](#快速上手) |
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:32-55](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L32-L55)

看板和 Git 行指向独立包。

<details>
<summary>查看原文（24行）</summary>

```text
# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'

# from ../dsh-task-board-github
- insert:
    - id: web-ui-task-board-github
      name: '@linxin666/dsh-client-ui-task-board-github'

# from ../dsh-task-board-team
- insert:
    - id: web-ui-task-board-team
      name: '@linxin666/dsh-client-ui-task-board-team'

# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-git-graph
- insert:
    - id: web-ui-git-graph
      name: '@linxin666/dsh-client-ui-git-graph'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:72-85](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L72-L85)

SSH 与技能浏览行指向独立包。

<details>
<summary>查看原文（14行）</summary>

```text
# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'

# from ../dsh-liangshen
- insert:
    - id: web-ui-liangshen
      name: '@linxin666/dsh-liangshen'

# from ../dsh-skill-explorer
- insert:
    - id: web-ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:118-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L118-L123)

两个功能行默认 disabled。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 5 · 源码核查**：[scripts/aggregate.mjs:145-160](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/scripts/aggregate.mjs#L145-L160)

旧壳与当前直接挂载的维护说明。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * This package's own name. It is still the row the compat shim mounts (the
 * `self` manifest entry) and the package the retirement registry and the
 * family subpaths belong to, but it is no longer the mount point of the
 * family rows themselves: those name their real packages (issue #1901).
 *
 * History that still explains the shell code: family rows used to mount a
 * per-family subpath of this package and carry the real package in
 * `config.plugin`, so that a family plugin failing to import could not roll
 * back the whole boot group. That bought fault isolation at the cost of the
 * family browser halves: the official client module scanner only mounts a
 * client face on the entry whose name equals the package, so every family UI
 * had to be inlined into this package's own ./client bundle — 13 plugins,
 * 2.9 MB served to every page before any family surface could render. The
 * rows now mount the real packages and the browser halves come from their
 * own loader entries; the isolation trade is recorded in
```

</details>

#### 缺口

- 未逐行执行宿主加载和故障注入
  **影响**：无法确认各能力或故障隔离
  **进一步探讨**：在隔离宿主比较各行启用、启动和缺包失败表现。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、持续维护和恢复的代价及采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

对确需多项功能且能管理 profile 的用户，可先备份配置，在隔离环境核对根 Git 来源、registry 实际版本和默认行，再逐一启用有明确用途的组件；必要时改用独立聚合包或按需安装。package.json:20-27 的递归构建、测试和 aggregate:check 是维护入口，pnpm-workspace.yaml:5-11 对宿主 peers 和仓内链接作区分。首次需要核对宿主、包闭包和权限，持续需要跟踪多个包升级，失败时需要定位行并恢复 profile；网络、存储、人工和服务成本均未知。若解析来源、权限、还原状态或子包安全不明，应暂停启用，不能把 disabled 行当作依赖未安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:19-27](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/package.json#L19-L27)

维护和生成一致性命令。

```text
  "scripts": {
    "build": "pnpm -r build",
    "dev:watch": "node scripts/dev-watch.mjs",
    "test": "pnpm -r test",
    "test:standards": "node scripts/test-standards.mjs --check",
    "test:standards:write": "node scripts/test-standards.mjs --write-baseline",
    "typecheck": "pnpm -r typecheck",
    "aggregate:check": "node scripts/aggregate.mjs --check",
    "runtime-deps:check": "node scripts/runtime-deps-check.mjs",
```

**依据 2 · 源码核查**：[pnpm-workspace.yaml:5-11](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-workspace.yaml#L5-L11)

peer 及工作区链接约定。

```text
# SDK peers 不自动安装，运行时由 DSH profile 树解析
# （原 true 只为聚合包发布时解析 peers，现已不需要）。
autoInstallPeers: false

# 根包作为可安装 bundle（dsh.bundle）依赖聚合包；仓库内开发时把该 range
# 链接到 workspace 工程（版本同源），profile 里的 git 安装仍走 npm registry。
linkWorkspacePackages: true
```

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:118-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L118-L123)

默认禁用的是具体行。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

#### 缺口

- 实际用户的维护、恢复时间和服务费用未测
  **影响**：不能估计总成本或节省
  **进一步探讨**：记录隔离试用的安装、维护、故障恢复与逐项验收时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否增加运行闭包核验以减少安装漂移？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有仓内 pnpm-lock.yaml:9-15 已记录开发环境根依赖指向 workspace，不能把“写锁文件”当新增；根 package.json:16-17 仍是范围，profile 实际 registry 解析及启用行不能由该开发锁直接证明。未验证方案：增加只读闭包核验器，在用户同意下读取运行 profile 已解析包版本及内容摘要、宿主版本和实际启用行，对照 Git patch 与部署时保存的安装记录，给出缺失、差异、无法读取三类结果；不自行安装或修改 profile。缺少宿主稳定读取接口、registry 完整性证明或写权限边界时应显示 unknown，且敏感路径应隐藏。对照现有 lock+人工核查，在相同固定夹具中注入包版本漂移、未启用、缺包和故障状态；比较差异识别的漏报/误报、核验时间与收集开销。若不能减少漏报、错误宣称 unknown 为通过、需要过宽权限、泄露敏感配置或维护成本超过收益，应否定方案；未实现或运行，不证明实际故障率。

#### 证据与依据

**依据 1 · 源码核查**：[pnpm-lock.yaml:9-15](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-lock.yaml#L9-L15)

现有开发锁和 workspace 链接是直接反证。

```text
importers:

  .:
    dependencies:
      '@linxin666/dsh-web-all':
        specifier: ^0.4.13
        version: link:packages/dsh-web-all
```

**依据 2 · 源码核查**：[package.json:6-17](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/package.json#L6-L17)

根 patch 与版本范围。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml",
    "locale"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.13"
```

</details>

**依据 3 · 源码核查**：[pnpm-workspace.yaml:5-11](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-workspace.yaml#L5-L11)

profile registry 与 workspace 分离。

```text
# SDK peers 不自动安装，运行时由 DSH profile 树解析
# （原 true 只为聚合包发布时解析 peers，现已不需要）。
autoInstallPeers: false

# 根包作为可安装 bundle（dsh.bundle）依赖聚合包；仓库内开发时把该 range
# 链接到 workspace 工程（版本同源），profile 里的 git 安装仍走 npm registry。
linkWorkspacePackages: true
```

#### 缺口

- 尚无宿主闭包读取协议、使用频率或对照实验
  **影响**：无法判断方案可行性、收益及负担
  **进一步探讨**：以伪造 profile 夹具比较人工核查并测试缺失、隐私和失败情况。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
