# Skills Management

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[795876b](https://github.com/weibaohui/skills-management/tree/795876ba7ce54338b5e1fb7effc2605354ba230e)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/weibaohui/skills-management) [![npm 30d 11,111](https://img.shields.io/static/v1?label=npm+30d&message=11%2C111&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weibaohui/skills-management) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@weibaohui/skills-management)
<!-- END META -->

> **功能**：在 DSH 浏览本机与市场技能、复制到执行器，并管理模型可调用状态的宿主插件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示统一来源、复制与注册入口可集中管理多执行器。市场候选和已安装模型目录分开。

> **主要限制**：[Q03](#research-q03) DSH 覆盖直接删旧版，复制会跟随链接，模型开关成功回包也可能与实际文件不同。[Q04](#research-q04) 需要独立副本和直接复查。

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
  - [Q01 · 技能统一视图比手工复制增加什么？](#detail-section-11)
  - [Q02 · 技能从来源进入哪个目录？](#detail-section-12)
  - [Q03 · 来源信任、覆盖与可见性怎样约束？](#detail-section-13)
  - [Q04 · 怎样试用、回退和复核？](#detail-section-14)
  - [Q05 · 能否验证一次安装对应可控曝光？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有多个本机 coding agent 的 DSH 维护者，需要从熟悉的目录引入一个技能并核对模型可见性。

人工检查来源与文件，把可信技能复制到 DSH 原生库，再编辑元数据和复查宿主目录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：Web 技能管理、浏览和安装入口
- **Host 路由**：技能安装、可见性及回收站操作
- **模型工具**：通过宿主技能 provider 提供候选供 skill 工具使用

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| manifest 的 Node 和 DSH | 启动必需 | 加载 Host provider 与界面 | 插件或入口不可用 |
| 可读的来源与可写目标 | 导入必需 | 读取技能并复制 | 不能安装或部分写入 |
| Git 与市场仓库 | 市场同步必需 | 更新可浏览候选 | 本地技能仍可使用 |
| 隔离目录和独立备份 | 观察所需 | 核对文件及恢复 | 应停在只读浏览 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者选可信本地技能和空目录 | 已审来源及链接 |
| 加载 | Host 启用插件，用户打开设置 | 识别目标来源 |
| 执行 | 用户复制单项，不选覆盖 | 文件及路径符合预期 |
| 验收 | 用户核对注册与模型候选 | 不一致则停止并回原生库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容 Host、目录与市场可选存储 | 审来源、确认权限和目标 | 同步、配置时长未知 |
| 持续使用 | 技能资源、模型上下文及网络 | 复查同步与注册候选 | 频率、实际计费和人时未测 |
| 失败恢复 | 原技能备份与隔离 profile | 检查复制文件、恢复旧版、复查候选 | DSH 覆盖恢复由用户承担 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨来源管理 | 源码显示目录扫描与真实复制 | 同任务节时与维护负担 |
| 模型候选控制 | 有注册过滤和前置字段写入 | 宿主最终曝光、兼容与调用 |
| 恢复 | 有部分回收站路径，DSH 覆盖直接删旧版 | 异常后的可恢复率与人时 |

> **思考**：[Q03](#research-q03) DSH 覆盖直接删旧版，复制会跟随链接，模型开关成功回包也可能与实际文件不同。[Q04](#research-q04) 需要独立副本和直接复查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示统一来源、复制与注册入口可集中管理多执行器。市场候选和已安装模型目录分开。

复制、源文件信任、模型候选和退出属于不同层。市场分支同步和注册可观察，配置 token 进入首次克隆参数后应以实际 Git 配置核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) DSH 覆盖直接删旧版，复制会跟随链接，模型开关成功回包也可能与实际文件不同。[Q04](#research-q04) 需要独立副本和直接复查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 多执行器维护者可先在独立目录观察一项已审本地技能。[Q03](#research-q03) 核对链接、最终文件和模型目录，出现异常立即停止加载。[Q04](#research-q04) 不依赖 DSH 覆盖的自动恢复，必要时用独立备份回原生库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认根插件、实际复制、模型候选及恢复边界。市场内容、宿主权限及真实安装效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的 Host 注册、技能导入与可见性，市场同步仅审与入库有关的主链。全部市场技能内容与真实 Host 未执行。
- 下一步：固定源码。下一步在隔离目录用正常和畸形技能、一个受控符号链接及一次复制中断，对照目录文件、安装回包、候选及恢复结果。

**分析版本**

- **仓库**：[weibaohui/skills-management](https://github.com/weibaohui/skills-management)
- **版本号**：0.9.3（[固定提交 795876b](https://github.com/weibaohui/skills-management/tree/795876ba7ce54338b5e1fb7effc2605354ba230e)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用链接、复制失败和畸形前置字段的成对样本，可验证界面显示与实际文件、模型候选是否一致。

固定源码。下一步在隔离目录用正常和畸形技能、一个受控符号链接及一次复制中断，对照目录文件、安装回包、候选及恢复结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 6852 | 5688 | 876 | — |
| .ts | source | 5 | 482 | 390 | 32 | — |
| .md | source | 1 | 60 | — | — | 1627 |
| .mjs | source | 1 | 65 | 37 | 21 | — |
| .mjs | test | 2 | 2250 | 1868 | 221 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/weibaohui/skills-management/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/weibaohui/skills-management/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/weibaohui/skills-management/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 DSH 维护者能否从本机执行器或市场导入一项技能，区分目录存在、模型可见和来源可信，并可恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 技能统一视图比手工复制增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

有多个 coding agent 的维护者，可以把已有技能目录和市场收在 DSH 一个设置入口。作者描述本地发现、预览、安装和治理，根包组合以及 Host provider 真实接线。与手工找 `SKILL.md`、复制目录再刷新相比，工具能提供统一来源、复制和可见性入口。合格结果要看实际文件、宿主注册项以及模型能否发现。只有一两个固定可信技能时，人工复制仍可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-22](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/README.md#L12-L22)

作者说明来源与使用方式

<details>
<summary>查看原文（11行）</summary>

```text
- **全来源扫描**：自动扫描本机各 coding agent 的技能目录，统一在一个页面查看、查看详情、单文件预览
- **约定式自动发现**：任何遵循 `~/.xxx/skills` 约定的技能目录（家目录下点前缀目录内含 `skills/` 子目录）都会被自动识别为执行器来源，key 与显示名由目录名派生（如 `.mobile-coder` → `mobile-coder` / Mobile Coder），新工具零配置接入；Windows 下对应 `%USERPROFILE%\.xxx\skills`（如 `C:\Users\Alice\.agent\skills`）。内置清单只保留规则覆盖不到的部分：dsh 安装库与 mimo/zhanlu 的 `~/.local/share/…` 显式路径。自动发现的来源在「执行器目录」设置面板中可改目录、可一键停用
- **一键收编**：任意执行器的技能可一键复制进 DSH 用户库，供模型的 `skill` 工具直接调用
- **回收站**：删除的技能移入回收站暂存（默认保留 30 天，可配置/关闭），可随时恢复到原位置（含目录名≠技能名的布局与软链技能）、彻底删除或一键清空；恢复时原位置被占用会拒绝并提示
- **一键迁至共享池**：详情弹窗可把任意可写来源的实体技能迁入 `~/.agents/skills` 共享池，原位置自动留链接（Windows 建 junction，免管理员权限），各来源照常可用；已是链接/已在池中/池内同名/只读来源都会被守卫拒绝，建链失败自动回滚
- **反向链接可视化**：Agents 池钻取视图里，每张技能卡片底部显示「数字 + 链接来源头像排」——一眼看出哪些执行器链了这个技能（悬停列出名称）
- **技能市场**：内置 ntd 技能合集（6600+ 条），按来源分组浏览、搜索筛选、详情预览、一键安装
- **注入开销统计**：每张技能卡片和详情显示「≈N token · M 字符」（按名称+描述全文、cl100k_base 词表估算，与 tiktokenizer 同词表同值），支持按 token/字符排序，一眼看出哪些技能最占上下文
- **模型可见性治理**：每个已装技能都有「模型可调用」开关，不想暴露给模型的技能一键隐藏/恢复
- **输入框 技能**：composer 工具行新增「技能」按钮（扳手图标，无边框静默样式），弹出带搜索框的技能候选浮层（候选 = 宿主技能注册表，与 `/` 菜单同源；支持键盘 ↑/↓/Enter/Esc），选中即把 `/技能名` 写入草稿，发送时技能内容注入该条消息
- **市场自动同步**：市场仓库自动克隆与每日更新（可关），支持 GitCode 私有仓库 access token
```

</details>

**依据 2 · 源码核查**：[package.json:16-32](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/package.json#L16-L32)

包导出、运行条件与 DSH 客户端

<details>
<summary>查看原文（17行）</summary>

```text
  "main": "src/index.js",
  "exports": {
    ".": "./src/index.js",
    "./client": "./client/bundle.js",
    "./package.json": "./package.json"
  },
  "engines": {
    "node": ">=22.5",
    "dsh": ">=0.1.7-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:10-12](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/cordis.patch.yml#L10-L12)

根宿主组合

```text
- insert:
    - id: skills-management
      name: '@weibaohui/skills-management'
```

**依据 4 · 源码核查**：[src/index.js:1416-1443](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1416-L1443)

实际技能 provider 与候选过滤

<details>
<summary>查看原文（28行）</summary>

```text
    ctx.skills.registerProvider((control) => {
      providerControl = control
      control.signal.addEventListener('abort', () => { if (providerControl === control) providerControl = undefined }, { once: true })
      return {
        name: providerName,
        async list() {
          const { market, installed } = await discoverAll()
          const candidates = []
          // Fail-soft: the registry throws — and kills the requesting session's
          // turn — on candidates that fail harness validation (empty
          // description, non-kebab-case name). Market checkouts with malformed
          // frontmatter trigger both routinely, so pre-filter here.
          const isValid = (row) => {
            if (!row.name || !KEBAB_NAME_RE.test(row.name)) return `invalid name '${row.name}'`
            if (!row.description || row.description.trim() === '') return 'empty description'
            return undefined
          }
          for (const row of installed) {
            const why = isValid(row)
            if (why !== undefined) {
              ctx.logger.warn(`skills-management: skipping installed skill '${row.name}' (${row.entry.dir}): ${why}`)
              continue
            }
            candidates.push(toCandidate(row, 'user-installed', RANK_INSTALLED))
          }
          // 市场货架默认不进宿主注册表（publishMarket: false）：数千条候选会把
          // `/` 菜单刷爆，且它们本就不该进模型目录。设置页浏览/安装不受影响。
          if (marketSettings().publishMarket !== false) {
```

</details>

#### 缺口

- 没有日常多执行器维护的同任务对照。
  **影响**：不能估计来源核对和持续维护是否节时。
  **进一步探讨**：用同一项含资源文件的技能比较手动与界面安装。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能从来源进入哪个目录？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 路由先委托连接服务拒绝不合格请求，再按来源从市场或执行器找目录。市场 checkout 的分支可配置，默认在启动和按期同步，可稀疏检出。DSH 目标默认是 DSH_HOME 的 skills，否则为用户的 DSH 库。安装根据来源名末段生成目录，复制资源后刷新 provider。市场列表默认只在界面浏览，已装技能仍需通过名称和描述校验，安装响应成功不表示已被模型列出。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:679-715](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L679-L715)

市场克隆、更新和默认设置

<details>
<summary>查看原文（37行）</summary>

```text
async function gitSyncRepo(binary, url, branch, repoDir, token, sparsePaths) {
  const remote = authedUrl(url, token)
  const sparse = Array.isArray(sparsePaths) && sparsePaths.length > 0 ? sparsePaths : undefined
  let repoExists = false
  try { await fsP.access(join(repoDir, '.git')); repoExists = true } catch { repoExists = false }
  if (!repoExists) {
    await fsP.rm(repoDir, { recursive: true, force: true })
    await fsP.mkdir(join(repoDir, '..'), { recursive: true })
    if (sparse) {
      await gitExec(binary, ['clone', '-b', branch, '--depth', '1', '--filter=blob:none', '--sparse', remote, repoDir])
      await gitExec(binary, ['sparse-checkout', 'set', '--cone', ...sparse], repoDir)
    } else {
      await gitExec(binary, ['clone', '-b', branch, '--depth', '1', remote, repoDir])
    }
    return { isFirstClone: true, hasUpdates: true, before: undefined, after: await gitCurrentCommit(binary, repoDir) }
  }
  // Migrate a pre-sparse full checkout in place (idempotent no-op once sparse).
  if (sparse) {
    try { await gitExec(binary, ['sparse-checkout', 'set', '--cone', ...sparse], repoDir) }
    catch (e) { console.warn(`skills-management: sparse-checkout conversion failed, continuing full: ${e && e.message}`) }
  }
  const before = await gitCurrentCommit(binary, repoDir)
  await gitExec(binary, ['fetch', remote, branch], repoDir)
  await gitExec(binary, ['reset', '--hard', 'FETCH_HEAD'], repoDir)
  const after = await gitCurrentCommit(binary, repoDir)
  return { isFirstClone: false, hasUpdates: before !== after, before, after }
}

const DEFAULT_MARKET_SYNC = {
  url: 'https://gitcode.com/weibaohui/ntd-resource.git',
  branch: 'main',
  gitBinary: 'git',
  autoSync: true,        // periodic: sync when lastSyncAt is older than a day
  syncOnStartup: true,
  // 市场货架默认只进设置页浏览/安装，不进宿主 `/` 技能注册表——数千条
  // 「仅用户」候选会把 slash 菜单刷爆。false = 只保留已安装技能。
  publishMarket: false,
```

</details>

**依据 2 · 源码核查**：[src/index.js:795-813](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L795-L813)

实际目标与市场源配置

<details>
<summary>查看原文（19行）</summary>

```text
    const effectiveRepoDir = () => {
      const eff = marketSettings()
      return resolve(expandTilde(
        typeof eff.repoDir === 'string' && eff.repoDir !== '' ? eff.repoDir
          : config.marketRepoDir !== undefined ? config.marketRepoDir
          : join(dshHome(), 'skills-management', 'market')))
    }
    const marketRoots = () => configMarketDirs !== undefined ? configMarketDirs : [join(effectiveRepoDir(), 'skills')]
    const marketDirs = marketRoots  // scan/install/locate call sites read through this
    // 稀疏检出子树：ntd-resource 仓库同时携带 experts/templates，只检 skills 一份省一半以上
    // 流量与磁盘。config.marketSparsePaths: null 关闭；自定义数组换目标子树。
    const marketSparsePaths = () => config.marketSparsePaths === null
      ? undefined
      : (Array.isArray(config.marketSparsePaths) && config.marketSparsePaths.length > 0 ? config.marketSparsePaths.map(String) : ['skills'])
    const installedDir = resolve(expandTilde(config.installedDir !== undefined ? config.installedDir : process.env.DSH_HOME ? join(process.env.DSH_HOME, 'skills') : join(homedir(), '.dsh', 'skills')))
    const providerName = config.providerName !== undefined ? config.providerName : 'ntd-skills'
    // 市场库存（数几千条）默认不进模型目录 available_skills —— 只作为可浏览/可安装的货架。
    // 装到用户库（installedDir）后才对模型可见。config.marketModelInvocable: true 可恢复旧行为。
    const marketModelInvocable = config.marketModelInvocable === true
```

</details>

**依据 3 · 源码核查**：[src/index.js:1076-1103](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1076-L1103)

来源到目标复制与刷新

<details>
<summary>查看原文（28行）</summary>

```text
    /** Copy any source skill dir into the dsh user library and refresh. */
    async function copyIntoLibrary(sourceDir, shortName, overwrite) {
      const target = join(installedDir, shortName)
      if (!overwrite) {
        try { await fsP.access(target); throw new Error(`skill '${shortName}' already installed`) }
        catch (e) { if (e.code !== 'ENOENT') throw e }
      } else { await fsP.rm(target, { recursive: true, force: true }) }
      await copyDir(sourceDir, target)
      invalidate()
      return { name: shortName, path: target }
    }

    async function installMarketSkill(fullName, overwrite) {
      let sourceDir
      for (const root of marketDirs()) {
        try { sourceDir = await resolveSkillDir(root, fullName); break }
        catch (e) { if (!String(e && e.message).includes('not found')) throw e }
      }
      if (sourceDir === undefined) throw new Error(`skill '${fullName}' not found in market`)
      return copyIntoLibrary(sourceDir, installDirName(fullName), overwrite)
    }

    async function installFromExecutor(executorKey, fullName, overwrite) {
      const row = findExecutorRow(executorKey)
      if (row === undefined) throw new Error(`unknown executor '${executorKey}'`)
      const sourceDir = await findDirUnderRoot(row.root, fullName, `${row.label} (${row.key})`)
      return copyIntoLibrary(sourceDir, installDirName(fullName), overwrite)
    }
```

</details>

**依据 4 · 源码核查**：[src/index.js:1416-1454](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1416-L1454)

实际注册区分市场与用户库

<details>
<summary>查看原文（39行）</summary>

```text
    ctx.skills.registerProvider((control) => {
      providerControl = control
      control.signal.addEventListener('abort', () => { if (providerControl === control) providerControl = undefined }, { once: true })
      return {
        name: providerName,
        async list() {
          const { market, installed } = await discoverAll()
          const candidates = []
          // Fail-soft: the registry throws — and kills the requesting session's
          // turn — on candidates that fail harness validation (empty
          // description, non-kebab-case name). Market checkouts with malformed
          // frontmatter trigger both routinely, so pre-filter here.
          const isValid = (row) => {
            if (!row.name || !KEBAB_NAME_RE.test(row.name)) return `invalid name '${row.name}'`
            if (!row.description || row.description.trim() === '') return 'empty description'
            return undefined
          }
          for (const row of installed) {
            const why = isValid(row)
            if (why !== undefined) {
              ctx.logger.warn(`skills-management: skipping installed skill '${row.name}' (${row.entry.dir}): ${why}`)
              continue
            }
            candidates.push(toCandidate(row, 'user-installed', RANK_INSTALLED))
          }
          // 市场货架默认不进宿主注册表（publishMarket: false）：数千条候选会把
          // `/` 菜单刷爆，且它们本就不该进模型目录。设置页浏览/安装不受影响。
          if (marketSettings().publishMarket !== false) {
            for (const row of market) {
              const why = isValid(row)
              if (why !== undefined) {
                ctx.logger.warn(`skills-management: skipping market skill '${row.entry.relPath}': ${why}`)
                continue
              }
              const shortName = row.name.includes('/') ? row.name.split('/').pop() : row.name
              if (installed.some((e) => e.name === shortName)) continue
              candidates.push(toCandidate(row, 'market', RANK_MARKET, { modelInvocable: marketModelInvocable }))
            }
          }
```

</details>

**依据 5 · 源码核查**：[src/index.js:1478-1489](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1478-L1489)

宿主路由前置连接检查

<details>
<summary>查看原文（12行）</summary>

```text
    ctx.effect(() => ctx.webServer.register({
      kind: 'prefix',
      path: '/skills-management/api',
      handler: async (req, res) => {
        try {
          // 与其它 host 路由一致的信任栅栏：connection 服务的 Host/Origin 检查
          // 加浏览器认证。缺了它，下面每个路由都能被任意网页跨站调用。
          const rejection = ctx.connection.requestRejection(req)
          if (rejection !== undefined) {
            res.writeHead(rejection)
            res.end()
            return
```

</details>

**依据 6 · 源码核查**：[src/index.js:1735-1744](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1735-L1744)

实际安装调用和成功返回

<details>
<summary>查看原文（10行）</summary>

```text
          // POST /skills-management/api/install {name, from?, overwrite?}
          if (req.method === 'POST' && apiPath.endsWith('/skills-management/api/install')) {
            const body = await readJsonBody(req)
            await refreshAutoRows()
            if (typeof body.name !== 'string' || body.name === '') { sendJson(res, 400, { error: 'body must provide name' }); return }
            const result = typeof body.from === 'string' && body.from !== '' && body.from !== 'market'
              ? await installFromExecutor(body.from, body.name, body.overwrite === true)
              : await installMarketSkill(body.name, body.overwrite === true)
            sendJson(res, 201, { installed: { ...result, from: typeof body.from === 'string' && body.from !== '' && body.from !== 'market' ? body.from : 'market' } })
            return
```

</details>

#### 缺口

- 未在真实宿主检查 provider 与原生文件扫描的最终合并。
  **影响**：无法从返回路径推断模型加载的是哪个候选。
  **进一步探讨**：装一个命名明确的样本，分别核对文件和模型目录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源信任、覆盖与可见性怎样约束？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源路径先做字面范围检查及存在 SKILL.md 的检查，递归复制会沿符号链接物化目标，没有相同的真实路径限制或扫描时的访问去重，因此链接可将外部内容带入，且坏链接可被跳过。DSH 覆盖先直接删除旧目录再复制，复制失败可能留下半安装。其他执行器覆盖仅在开启回收站时先移动旧版。模型开关修改前置字段并刷新；若文件开头有分隔线但缺结束线，写函数可原样返回，而路由仍报告请求的目标值。切换只改变候选策略，不验证技能内容可信。若为市场配置 token，第一次 clone 将带凭据 URL 交给 Git，源码未随后清理 remote 配置，失败消息也从 Git stderr 取尾段。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:191-217](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L191-L217)

扫描的链接与 visited 限制

<details>
<summary>查看原文（27行）</summary>

```text
async function scanSkillDirs(root, current, out, visited) {
  let entries
  try { entries = await fsP.readdir(current, { withFileTypes: true }) }
  catch { return }
  for (const entry of entries) {
    if (MARKET_SCAN_SKIP.has(entry.name)) continue
    const dir = join(current, entry.name)
    // Follow symlinks: executor skills dirs routinely symlink entries from a
    // shared pool (~/.agents/skills); Dirent.isDirectory() would miss them.
    // lstat first so the entry can carry its linked-ness (UI marks such skills
    // as virtual); non-links reuse the lstat result and skip the second stat.
    let lst
    try { lst = await fsP.lstat(dir) } catch { continue }
    const linked = lst.isSymbolicLink()
    let dirStat = lst
    if (linked) {
      try { dirStat = await fsP.stat(dir) } catch { continue }
    }
    if (!dirStat.isDirectory()) continue
    let real
    try { real = await fsP.realpath(dir) } catch { continue }
    if (visited.has(real)) continue // symlink cycle guard
    visited.add(real)
    let hasSkillMd = false, skillMdStat
    try { skillMdStat = await fsP.stat(join(dir, 'SKILL.md')); hasSkillMd = skillMdStat.isFile() } catch { hasSkillMd = false }
    if (hasSkillMd) { out.push(buildEntry(root, dir, skillMdStat, linked ? real : undefined)) }
    else { await scanSkillDirs(root, dir, out, visited) }
```

</details>

**依据 2 · 源码核查**：[src/index.js:267-295](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L267-L295)

复制会物化链接和路径字面检查

<details>
<summary>查看原文（29行）</summary>

```text
async function copyDir(from, to) {
  await fsP.mkdir(to, { recursive: true })
  const entries = await fsP.readdir(from, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === '.git') continue
    const source = join(from, entry.name), target = join(to, entry.name)
    // Follow symlinks and materialize their targets: installs must be
    // self-contained (a linked references/ dir cannot dangle later).
    let stat
    try { stat = await fsP.stat(source) } catch { continue }
    if (stat.isDirectory()) { await copyDir(source, target) }
    else if (stat.isFile()) { await fsP.copyFile(source, target) }
  }
}

async function resolveSkillDir(root, fullName) {
  if (fullName === '' || fullName.includes('..') || fullName.includes('\\') || fullName.startsWith('/')) {
    throw new Error('invalid skill name')
  }
  const dir = resolve(root, fullName)
  if (!dir.startsWith(resolve(root) + sep)) throw new Error('invalid skill name: escapes root')
  let stat
  try { stat = await fsP.stat(join(dir, 'SKILL.md')) }
  catch (e) {
    if (e.code === 'ENOENT' || e.code === 'ENOTDIR') throw new Error(`skill '${fullName}' not found`)
    throw e
  }
  if (!stat.isFile()) throw new Error('not a skill directory')
  return dir
```

</details>

**依据 3 · 源码核查**：[src/index.js:1076-1085](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1076-L1085)

DSH 覆盖先删除

<details>
<summary>查看原文（10行）</summary>

```text
    /** Copy any source skill dir into the dsh user library and refresh. */
    async function copyIntoLibrary(sourceDir, shortName, overwrite) {
      const target = join(installedDir, shortName)
      if (!overwrite) {
        try { await fsP.access(target); throw new Error(`skill '${shortName}' already installed`) }
        catch (e) { if (e.code !== 'ENOENT') throw e }
      } else { await fsP.rm(target, { recursive: true, force: true }) }
      await copyDir(sourceDir, target)
      invalidate()
      return { name: shortName, path: target }
```

</details>

**依据 4 · 源码核查**：[src/index.js:1138-1152](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1138-L1152)

其他执行器覆盖及逐目标结果

<details>
<summary>查看原文（15行）</summary>

```text
        if (row.readOnly) { results.push({ key, ok: false, error: 'read-only source' }); continue }
        if (!(await pathExists(row.root))) { results.push({ key, ok: false, error: `directory not found: ${displayPath(row.root)}` }); continue }
        const target = join(row.root, shortName)
        if (await pathExists(target)) {
          if (!overwrite) { results.push({ key, ok: false, error: `already exists: ${displayPath(target)}` }); continue }
          // 覆盖 = 旧版进回收站再放新版（与删除语义一致，可恢复）
          if (trashEnabled) await moveToTrash(trashDir, target, shortName, row.key)
          else await fsP.rm(target, { recursive: true, force: true })
        }
        try {
          await copyDir(sourceDir, target)
          results.push({ key, ok: true, path: displayPath(target) })
        } catch (e) { results.push({ key, ok: false, error: String(e && e.message || e) }) }
      }
      return results
```

</details>

**依据 5 · 源码核查**：[src/index.js:462-482](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L462-L482)

畸形 frontmatter 与写入

<details>
<summary>查看原文（21行）</summary>

```text
function setModelInvocable(content, modelInvocable) {
  const lines = String(content || '').split(/\r?\n/)
  if (lines[0] === undefined || lines[0].trim() !== '---') {
    return modelInvocable ? content : `---\ndisable-model-invocation: true\n---\n\n${content}`
  }
  let closer = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { closer = i; break }
  }
  if (closer === -1) return content
  let kept = lines.slice(1, closer).filter((l) => !/^disable-model-invocation\s*:/.test(l.trim()))
  if (!modelInvocable) kept = [...kept, 'disable-model-invocation: true']
  return [...lines.slice(0, 1), ...kept, ...lines.slice(closer)].join('\n')
}

async function atomicWriteJs(file, content) {
  await fsP.mkdir(join(file, '..'), { recursive: true })
  const temp = join(join(file, '..'), `.${randomUUID()}.tmp`)
  await fsP.writeFile(temp, content, 'utf8')
  await fsP.rename(temp, file)
}
```

</details>

**依据 6 · 源码核查**：[src/index.js:1818-1835](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1818-L1835)

路由返回请求值并刷新

<details>
<summary>查看原文（18行）</summary>

```text
          if (req.method === 'PUT' && apiPath.endsWith('/skills-management/api/invocation')) {
            const body = await readJsonBody(req)
            if (typeof body.name !== 'string' || body.name === '') { sendJson(res, 400, { error: 'body must provide name' }); return }
            if (typeof body.modelInvocable !== 'boolean') { sendJson(res, 400, { error: 'body must provide modelInvocable boolean' }); return }
            // 与 dsh skill-filesystem 的 user-agents 根同款解析
            const agentsSkillsRoot = process.env.DSH_AGENTS_HOME !== undefined && process.env.DSH_AGENTS_HOME !== ''
              ? join(resolve(expandTilde(process.env.DSH_AGENTS_HOME)), 'skills')
              : join(homedir(), '.agents', 'skills')
            let skillDir
            let rootKey = 'dsh'
            try { skillDir = await resolveSkillDir(installedDir, body.name) }
            catch { skillDir = await resolveSkillDir(agentsSkillsRoot, body.name); rootKey = 'agents' }
            const file = join(skillDir, 'SKILL.md')
            const updated = setModelInvocable(await fsP.readFile(file, 'utf8'), body.modelInvocable)
            await atomicWriteJs(file, updated)
            invalidate()
            sendJson(res, 200, { name: body.name, modelInvocable: body.modelInvocable, root: rootKey })
            return
```

</details>

**依据 7 · 源码核查**：[src/index.js:635-644](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L635-L644)

错误保留 stderr 尾段

<details>
<summary>查看原文（10行）</summary>

```text
function gitExec(binary, args, cwd) {
  return new Promise((fulfil, reject) => {
    execFile(binary, args, { cwd, timeout: 10 * 60 * 1000, maxBuffer: 16 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const tail = String(stderr || error.message || '').split(/\r?\n/).filter(Boolean).slice(-3).join(' ')
        reject(new Error(`git ${args[0]}: ${tail || error.message}`))
        return
      }
      fulfil(String(stdout).trim())
    })
```

</details>

**依据 8 · 源码核查**：[src/index.js:663-693](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L663-L693)

URL 带 token 首次克隆

<details>
<summary>查看原文（31行）</summary>

```text
/** Embed an access token in an https remote URL (gitcode/oauth2 style).
 *  Credentials stay out of .git/config — every remote-touching command
 *  receives the authed URL directly and nothing is persisted. */
function authedUrl(url, token) {
  if (!token) return url
  return String(url).replace(/^(https?:\/\/)([^@/]+@)?/, `$1oauth2:${encodeURIComponent(token)}@`)
}

/** Clone (first time) or fetch+reset (update); remote branch is truth.
 *  `sparsePaths` (e.g. ['skills']) switches the checkout to sparse mode: fresh
 *  clones pass --filter=blob:none --sparse so only those subtrees download
 *  (the ntd-resource monorepo also carries experts/ + templates/, ~2x the
 *  skills payload); servers without filter support just warn and fall back to
 *  a full clone, which sparse-checkout still prunes. An existing full checkout
 *  is converted in place — the worktree prunes immediately, already-packed
 *  blobs stay (reachable from HEAD), so the big win is on fresh clones. */
async function gitSyncRepo(binary, url, branch, repoDir, token, sparsePaths) {
  const remote = authedUrl(url, token)
  const sparse = Array.isArray(sparsePaths) && sparsePaths.length > 0 ? sparsePaths : undefined
  let repoExists = false
  try { await fsP.access(join(repoDir, '.git')); repoExists = true } catch { repoExists = false }
  if (!repoExists) {
    await fsP.rm(repoDir, { recursive: true, force: true })
    await fsP.mkdir(join(repoDir, '..'), { recursive: true })
    if (sparse) {
      await gitExec(binary, ['clone', '-b', branch, '--depth', '1', '--filter=blob:none', '--sparse', remote, repoDir])
      await gitExec(binary, ['sparse-checkout', 'set', '--cone', ...sparse], repoDir)
    } else {
      await gitExec(binary, ['clone', '-b', branch, '--depth', '1', remote, repoDir])
    }
    return { isFirstClone: true, hasUpdates: true, before: undefined, after: await gitCurrentCommit(binary, repoDir) }
```

</details>

#### 缺口

- 缺链接越界、覆盖中断和私有市场克隆的宿主对照。
  **影响**：实际泄露、原目录恢复及最终模型可见性未知。
  **进一步探讨**：使用无敏感内容的链接和假市场凭据，核对复制文件、失败状态和本地 Git 配置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用、回退和复核？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

manifest 声明 Node、DSH 和插件库版本，市场同步还要 Git、网络和选择的仓库。先用有良好 frontmatter 的可信本地技能、独立 DSH_HOME 和空目标，核对资源路径与模型候选。只需要单条技能的用户可继续人工复制。出现路径意外、候选不一致或复制失败时停止加载，先保留证据再从备份恢复；普通回收站能在原位置空缺时还原，其退路与 DSH 覆盖直接删除不同。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-32](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/package.json#L22-L32)

运行条件

<details>
<summary>查看原文（11行）</summary>

```text
  "engines": {
    "node": ">=22.5",
    "dsh": ">=0.1.7-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[package.json:45-49](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/package.json#L45-L49)

运行依赖

```text
  "dependencies": {
    "@weibaohui/dsh-plugin-kit": "^0.2.0",
    "js-tiktoken": "^1.0.21",
    "yaml": "^2.9.0"
  },
```

**依据 3 · 源码核查**：[src/index.js:648-659](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L648-L659)

Git 可用性与远程版本检查

<details>
<summary>查看原文（12行）</summary>

```text
async function gitAvailable(binary) {
  try { await gitExec(binary, ['--version']); return true } catch { return false }
}

async function gitCurrentCommit(binary, repo) {
  try { return await gitExec(binary, ['rev-parse', 'HEAD'], repo) } catch { return undefined }
}

async function gitRemoteCommit(binary, repo, remote, branch) {
  try {
    const out = await gitExec(binary, ['ls-remote', '--heads', remote, branch], repo)
    return out.split(/\s+/)[0] || undefined
```

</details>

**依据 4 · 源码核查**：[src/index.js:580-590](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L580-L590)

回收站恢复及冲突拒绝

<details>
<summary>查看原文（11行）</summary>

```text
async function restoreTrashEntry(trashDir, id) {
  if (!validTrashId(id)) throw new Error('invalid trash id')
  const meta = await readTrashMeta(trashDir, id)
  if (meta === null) throw new Error(`trash entry '${id}' has no metadata; it cannot be restored`)
  if (typeof meta.originalDir !== 'string' || meta.originalDir === '') throw new Error('trash metadata missing originalDir')
  if (!(await pathExists(join(trashDir, id)))) throw new Error(`trash entry '${id}' not found`)
  if (await pathExists(meta.originalDir)) throw new Error(`restore target already exists: ${displayPath(meta.originalDir)}`)
  await fsP.mkdir(join(meta.originalDir, '..'), { recursive: true })
  await movePath(join(trashDir, id), meta.originalDir)
  await fsP.rm(join(trashDir, id + '.json'), { force: true })
  return { id, name: meta.name, executorKey: meta.executorKey, dir: meta.originalDir }
```

</details>

**依据 5 · 源码核查**：[src/index.js:1076-1085](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1076-L1085)

DSH 覆盖边界

<details>
<summary>查看原文（10行）</summary>

```text
    /** Copy any source skill dir into the dsh user library and refresh. */
    async function copyIntoLibrary(sourceDir, shortName, overwrite) {
      const target = join(installedDir, shortName)
      if (!overwrite) {
        try { await fsP.access(target); throw new Error(`skill '${shortName}' already installed`) }
        catch (e) { if (e.code !== 'ENOENT') throw e }
      } else { await fsP.rm(target, { recursive: true, force: true }) }
      await copyDir(sourceDir, target)
      invalidate()
      return { name: shortName, path: target }
```

</details>

#### 缺口

- 真实宿主禁用后是否撤出同名候选未知。
  **影响**：当前不能估计恢复人时或信任校验成本。
  **进一步探讨**：保留空白 profile 与原目录，撤出后逐项重查候选来源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否验证一次安装对应可控曝光？

**研究主题**：新假设与验证

#### 完整回答

在独立 DSH_HOME 安装一份带正常前置字段的样本和一份缺结束分隔线的样本，分别核对文件列表、返回状态、用户可调用和模型目录。加入指向测试目录外模拟文件的符号链接及一次覆盖复制失败，观察是否保留旧文件与回收站入口。若有外来资源、返回成功与实际曝光不一致或旧版无恢复点，就否定这一条件下可控曝光的假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:267-279](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L267-L279)

链接物化测试点

<details>
<summary>查看原文（13行）</summary>

```text
async function copyDir(from, to) {
  await fsP.mkdir(to, { recursive: true })
  const entries = await fsP.readdir(from, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === '.git') continue
    const source = join(from, entry.name), target = join(to, entry.name)
    // Follow symlinks and materialize their targets: installs must be
    // self-contained (a linked references/ dir cannot dangle later).
    let stat
    try { stat = await fsP.stat(source) } catch { continue }
    if (stat.isDirectory()) { await copyDir(source, target) }
    else if (stat.isFile()) { await fsP.copyFile(source, target) }
  }
```

</details>

**依据 2 · 源码核查**：[src/index.js:1077-1085](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1077-L1085)

覆盖失败测试点

```text
    async function copyIntoLibrary(sourceDir, shortName, overwrite) {
      const target = join(installedDir, shortName)
      if (!overwrite) {
        try { await fsP.access(target); throw new Error(`skill '${shortName}' already installed`) }
        catch (e) { if (e.code !== 'ENOENT') throw e }
      } else { await fsP.rm(target, { recursive: true, force: true }) }
      await copyDir(sourceDir, target)
      invalidate()
      return { name: shortName, path: target }
```

**依据 3 · 源码核查**：[src/index.js:462-474](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L462-L474)

前置字段测试点

<details>
<summary>查看原文（13行）</summary>

```text
function setModelInvocable(content, modelInvocable) {
  const lines = String(content || '').split(/\r?\n/)
  if (lines[0] === undefined || lines[0].trim() !== '---') {
    return modelInvocable ? content : `---\ndisable-model-invocation: true\n---\n\n${content}`
  }
  let closer = -1
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { closer = i; break }
  }
  if (closer === -1) return content
  let kept = lines.slice(1, closer).filter((l) => !/^disable-model-invocation\s*:/.test(l.trim()))
  if (!modelInvocable) kept = [...kept, 'disable-model-invocation: true']
  return [...lines.slice(0, 1), ...kept, ...lines.slice(closer)].join('\n')
```

</details>

**依据 4 · 源码核查**：[src/index.js:1416-1455](https://github.com/weibaohui/skills-management/blob/795876ba7ce54338b5e1fb7effc2605354ba230e/src/index.js#L1416-L1455)

候选和安装目录的边界

<details>
<summary>查看原文（40行）</summary>

```text
    ctx.skills.registerProvider((control) => {
      providerControl = control
      control.signal.addEventListener('abort', () => { if (providerControl === control) providerControl = undefined }, { once: true })
      return {
        name: providerName,
        async list() {
          const { market, installed } = await discoverAll()
          const candidates = []
          // Fail-soft: the registry throws — and kills the requesting session's
          // turn — on candidates that fail harness validation (empty
          // description, non-kebab-case name). Market checkouts with malformed
          // frontmatter trigger both routinely, so pre-filter here.
          const isValid = (row) => {
            if (!row.name || !KEBAB_NAME_RE.test(row.name)) return `invalid name '${row.name}'`
            if (!row.description || row.description.trim() === '') return 'empty description'
            return undefined
          }
          for (const row of installed) {
            const why = isValid(row)
            if (why !== undefined) {
              ctx.logger.warn(`skills-management: skipping installed skill '${row.name}' (${row.entry.dir}): ${why}`)
              continue
            }
            candidates.push(toCandidate(row, 'user-installed', RANK_INSTALLED))
          }
          // 市场货架默认不进宿主注册表（publishMarket: false）：数千条候选会把
          // `/` 菜单刷爆，且它们本就不该进模型目录。设置页浏览/安装不受影响。
          if (marketSettings().publishMarket !== false) {
            for (const row of market) {
              const why = isValid(row)
              if (why !== undefined) {
                ctx.logger.warn(`skills-management: skipping market skill '${row.entry.relPath}': ${why}`)
                continue
              }
              const shortName = row.name.includes('/') ? row.name.split('/').pop() : row.name
              if (installed.some((e) => e.name === shortName)) continue
              candidates.push(toCandidate(row, 'market', RANK_MARKET, { modelInvocable: marketModelInvocable }))
            }
          }
          return candidates
```

</details>

#### 缺口

- 对照尚未运行。
  **影响**：仅能指出源码中状态分离与可能副作用。
  **进一步探讨**：先在隔离目录核对一个正常样本和一个畸形前置字段样本的实际候选。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
