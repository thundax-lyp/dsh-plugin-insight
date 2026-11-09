# dsh-web

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ae4a35e](https://github.com/zhu1090093659/dsh-web/tree/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981)

<!-- BEGIN META -->
[![GitHub ★ 10,215](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C215&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web GUI 提供可组合安装的插件与主题聚合配置。

> **亮点**：[Q02](#research-q02) 将多项 Web 扩展的默认行和依赖集中维护。[Q04](#research-q04) 的旧路径导出与退役 guard 让特定历史行能静默装载空壳。这个增量属于装配和兼容，具体业务功能由各插件提供。

> **主要限制**：[Q03](#research-q03) 显示固定 Git 提交锁住根补丁，实际用户 profile 的依赖闭包仍可能不同。[Q04](#research-q04) 中的旧行能解析也不足以判定能力仍在。

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
  - [Q01 · 哪类用户适合用 Git 根载具，和直接安装聚合包有何差别？](#detail-section-11)
  - [Q02 · 一个组件如何进入生成 patch 并被宿主看到？](#detail-section-12)
  - [Q03 · 为什么固定 Git 提交不能保证部署得到同一组能力？](#detail-section-13)
  - [Q04 · 旧 profile 中退役 Git 图谱行会怎样，能否据此推断故障隔离？](#detail-section-14)
  - [Q05 · 怎样度量试用与退出成本，哪些情况应暂缓 Git 根安装？](#detail-section-15)
  - [Q06 · 装配预检能否降低 profile 错配排障成本？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH Web 的用户可通过根载具为 profile 装配一组家族插件，再分别核查所需功能。[Q01](#research-q01)

同样的功能可单装所需子包，或直接安装 npm 聚合包。根入口采用仓内补丁，聚合本身的功能由所解析子包提供。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 根 bundle 装配 | 给已有 DSH profile 提供多包配置 | 依赖与实际行需要回读 |
| 清单生成与漂移检查 | 维护聚合补丁和展示资源 | 比较仓内文件，宿主运行另查 |
| 旧子路径兼容 | 让特定退役旧行仍可解析 | 退役 guard 不恢复已删除能力 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 已运行的 DSH Web 与可管理 profile | 组合安装需要 | 解析补丁并加载各插件 | 核对聚合包声明的宿主版本，其他环境单独验收 |
| profile 能解析的聚合与子包 | 家族行使用需要 | 为生成行提供真实代码 | 从安装树和组合配置排查缺包 |
| 对应子包的服务与权限 | 具体能力需要 | 运行对应任务 | 仅验收实际使用的行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份 profile，记录版本、预期能力和权限 | 明确要核对的两项任务 |
| 装配 | 在隔离配置采用一个安装入口 | 依赖树和组合行均与预期相符 |
| 验收 | 重启后查行状态，再执行只读任务 | 入口可见且实际读取成功，退役空壳另行标记 |
| 恢复 | 保留业务文件，按配置备份回退 | 核查移除和必要状态，而非只看退出码 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- |
| 首次 | 多包下载、安装存储，金额未知 | 核对安装闭包与权限 | 仓内 lock 不等于用户 profile |
| 持续 | 子包模型、后台和服务用量待量化 | 维护版本和逐项验收 | 净节时未知 |
| 故障恢复 | 重装、备份及重试资源未知 | 比对实际依赖、配置和运行结果 | 不假定回退可自动撤销业务副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 统一装配 | 生成器统一组织子包行和默认状态 | 实际宿主加载与用户安装差异 |
| 兼容旧 profile | 特定旧子路径可解析且按退役表跳过导入 | 历史用户覆盖组合的全部结果 |
| 排障 | 生成差异、缺包和部分降级状态有不同入口 | 排查速度和恢复率 |

> **思考**：[Q03](#research-q03) 显示固定 Git 提交锁住根补丁，实际用户 profile 的依赖闭包仍可能不同。[Q04](#research-q04) 中的旧行能解析也不足以判定能力仍在。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将多项 Web 扩展的默认行和依赖集中维护。[Q04](#research-q04) 的旧路径导出与退役 guard 让特定历史行能静默装载空壳。这个增量属于装配和兼容，具体业务功能由各插件提供。

[Q02](#research-q02) 从清单生成补丁和依赖，对漂移设置显式检查。[Q04](#research-q04) 将退役名与旧导出配对，可以兼容历史配置，同时保留直接加载的能力边界。移植这一做法需要等价的 loader 名称解析、配置层语义与历史版本约定。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示固定 Git 提交锁住根补丁，实际用户 profile 的依赖闭包仍可能不同。[Q04](#research-q04) 中的旧行能解析也不足以判定能力仍在。

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 先记下实际包版本、profile 权限及需要的功能行。使用 Git 入口前在隔离配置对照直接装聚合包的结果。实际安装闭包或旧行状态不能确认时先暂停，保留备份并按需要选装子包。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

生成装配和退役空壳有固定源码支持。用户 profile 的实际安装闭包和各子包运行未验收。只读装配检查是待验证方向。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/aggregate.yml、scripts/aggregate.mjs、pnpm-lock.yaml、packages/dsh-web-all/package.json、packages/dsh-web-all/src/shells/shell.ts、packages/dsh-web-all/src/retired-plugins.generated.ts、packages/dsh-web-all/src/shell.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计是固定根仓树内指定 Markdown 和 JS/TS 文件，不代表单一功能的实现规模。实际核查集中在根清单、仓内锁、聚合生成、实际补丁和旧壳。未安装、运行、查询发布包或验证真实宿主，不覆盖各独立子包或外部服务。
- 下一步：隔离复现 Git 与 npm 两条入口，记录安装闭包、组合行、退役旧行与只读任务。拟议诊断另按 [Q06](#research-q06) 比较误报和人时。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 ae4a35e](https://github.com/zhu1090093659/dsh-web/tree/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出只读对照实际安装树、组合行和退役状态，目标是加快缺包、禁用、退役和启动失败的区分。需要和现有配置、日志检查进行盲测。

隔离复现 Git 与 npm 两条入口，记录安装闭包、组合行、退役旧行与只读任务。拟议诊断另按 [Q06](#research-q06) 比较误报和人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1369 | 79679 | — | — | 1834861 |
| .mjs | source | 73 | 18601 | 12950 | 4478 | — |
| .tsx | source | 135 | 36150 | 27163 | 7265 | — |
| .ts | source | 774 | 179025 | 109710 | 58203 | — |
| .js | source | 31 | 15895 | 12780 | 3022 | — |
| .ts | test | 482 | 125570 | 91202 | 23899 | — |
| .tsx | test | 90 | 24020 | 17160 | 4207 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |
| .mjs | test | 45 | 11569 | 9029 | 1784 | — |
| .cjs | source | 2 | 146 | 79 | 87 | — |

</details>

**活跃度**

[![近30天新建 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 DSH 的用户通过仓库根安装一组 Web 扩展时，哪些组合和兼容性由源码约束，哪些结果必须回读实际 profile？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类用户适合用 Git 根载具，和直接安装聚合包有何差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 DSH Web 并需要同时使用多个家族组件的团队，可以通过一个 bundle 给 profile 配出一致的初始行。比如希望在同一配置中打开任务看板和用量视图，验收时要确认两条对应行都以预期版本和权限加载，并各完成一次读取。根 package.json 私有，提供 Git 安装的 bundle patch 并依赖聚合 npm 包。它不是 DSH Web 宿主，功能主体来自独立子包。相对逐个安装，组合的增量是预先组织行、顺序与默认状态。作者也提供直接 npm 安装聚合包的办法，并称两者效果等价；Git 根安装特有的收益以及与同版本聚合包的实际闭包是否一致，目前没有验证。若只用一项能力，单装对应子包能缩小需核查的范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/package.json#L1-L18)

根清单为私有 bundle，指向仓内聚合补丁，并声明 npm 依赖。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-web",
  "version": "0.4.16",
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
    "@linxin666/dsh-web-all": "^0.4.16"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:224-246](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/README.md#L224-L246)

作者分别给出 npm 与 Git 安装入口并提醒不要叠装。

<details>
<summary>查看原文（23行）</summary>

````text
### 三步上手（npm 安装，推荐）

- **DSH Web CLI（现有浏览器服务）**：
  1. 先完成三项构建脚本审批（见“安装排障”），再安装聚合包：`dsh plugin --profile web add @linxin666/dsh-web-all@latest`
  2. 重启 `dsh web` 服务，侧边栏将自动呈现各插件入口
  3. 打开“设置 > 插件配置”按需开关插件，或在皮肤面板选用主题
- **官方桌面客户端（DeepSeek Harness Desktop）**：
  1. 打开官方桌面客户端，进入“设置 → 插件”页面
  2. 在插件安装框中输入 `@linxin666/dsh-web-all` 并确认安装
  3. 重启客户端，即可在侧边栏与“设置”中使用各插件功能

> 若仅需要皮肤功能，可单独安装 `@linxin666/dsh-client-ui-skin-center`。若因包管理器门禁安装到旧版本，请参阅后文“安装排障”。

### 从 GitHub 仓库直接安装

仓库根目录声明了标准 `dsh.bundle` 装配清单，支持直接通过仓库地址安装，无需手动克隆代码与构建：

```sh
dsh plugin --profile web add github:zhu1090093659/dsh-web
# 或使用完整 git 地址：dsh plugin --profile web add git+https://github.com/zhu1090093659/dsh-web.git
```

该方式与直接从 npm 安装聚合包效果等价，二者择其一即可。请勿同时通过两种方式安装，以免出现 entry id 冲突。
````

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:32-45](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L32-L45)

实际生成补丁为任务看板和集成写出独立行。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:77-80](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L77-L80)

用量由自己的包行加载。

```text
# from ../dsh-usage
- insert:
    - id: web-ui-usage
      name: '@linxin666/dsh-usage'
```

#### 缺口

- 未取得根安装与直接装聚合包的同条件记录
  **影响**：无法判断 Git 入口对使用者的独立收益
  **进一步探讨**：同一 DSH Web 版本下比较两条安装路径实际版本、行和一组任务结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一个组件如何进入生成 patch 并被宿主看到？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

聚合清单把要展开的 patchFrom 和依赖 deps 分开。生成器递归走子聚合，检查循环和缺失路径，叶包取各自补丁中的行。生成的插入行用家族 id，名称指向真实插件包，保留子包的行配置和附加字段。例如同一生成补丁给任务看板与其提供方各自留行。随后生成器还处理关闭默认行及配置覆盖。已列入依赖与已启用是不同状态，SSH 和 Skill 浏览器仍有包行且被后续 disabled: true 覆盖。生成器从同一清单生成 patch、包清单和退役表，检查模式比较磁盘字节与应有的展示文件，不跑目标宿主。真实宿主解析到子包后才可能挂载其运行与浏览器部分，生成通过无法证明子包能跑。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/aggregate.yml:15-27](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/aggregate.yml#L15-L27)

任务看板及扩展列在 patchFrom，并保留装配顺序。

<details>
<summary>查看原文（13行）</summary>

```text
patchFrom:
  - ../dsh-web-settings
  - ../dsh-plugin-manager
  - ../dsh-market
  - ../dsh-task-board
  # dsh-task-board-github 必须紧跟看板之后：它是看板的外部提供方扩展
  # （GitHub Issues 同步），聚合展开的行序就是浏览器半区与宿主半区的装载
  # 顺序，扩展向看板的提供方席位登记之前看板必须先就位。
  - ../dsh-task-board-github
  # dsh-task-board-team 是看板的第二个外部提供方（团队协作 / team-hub），同样
  # 必须排在 `../dsh-task-board` 之后：它向看板的提供方席位与能力面登记，装载顺序
  # 反了只是多等一次服务，但两份清单保持「提供方紧跟看板」的同一读法。
  - ../dsh-task-board-team
```

</details>

**依据 2 · 源码核查**：[scripts/aggregate.mjs:735-765](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/scripts/aggregate.mjs#L735-L765)

递归展开，循环与缺失输入有显式失败。

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

**依据 3 · 源码核查**：[scripts/aggregate.mjs:827-855](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/scripts/aggregate.mjs#L827-L855)

写真实包名、家族 id、子包配置和附加字段。

<details>
<summary>查看原文（29行）</summary>

```text
    const insertRows = block.rows.filter((row) => row.kind !== 'patch')
    const patchRows = block.rows.filter((row) => row.kind === 'patch')
    if (insertRows.length > 0) {
      lines.push('', sourceHeader, '- insert:')
      for (const row of insertRows) {
        const id = familyIdOf(row.id, familyIds)
        if (seen.has(id)) errors.push(`${rel}: duplicate aggregate row id after namespacing: ${id} (${row.name})`)
        seen.add(id)
        lines.push(`    - id: ${id}`)
        // Every family row mounts its child's REAL package name. That is what
        // puts the child's browser half on the page: the official client module
        // scanner only mounts a client face on the loader entry whose name equals
        // the package, so a subpath-spelled row left the browser half to this
        // package's own ./client bundle - one copy of every family UI inside a
        // single 2.9 MB bundle that had to download in full before any family
        // surface could render (issue #1901, remote/high-RTT forwarders). A real
        // row also makes the row's own switch honest: the loader's `disabled` now
        // decides the family, where it used to gate only a shell whose client half
        // was then re-gated in the browser. The row id stays web-ui-* so profile
        // overrides written before this change keep applying.
        lines.push(`      name: '${row.name}'`)
        pushConfig(lines, row.configLines ?? [], 6)
        // The child's own row options, verbatim and AFTER the name/config pair:
        // a host-only child ships a platform guard this way
        // (`disabled: !!js process.platform !== 'win32'`), and dropping it would
        // mount that row on a host the package refuses. Emitting last keeps the
        // "`name:` then `config:`" adjacency every row parser in this repository
        // (and the settings surface's config-root contract) already relies on.
        for (const extra of row.extraLines ?? []) lines.push(extra)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:32-45](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L32-L45)

固定补丁中各包有自己的行。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L113-L118)

两条已装配行默认禁用。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 6 · 源码核查**：[scripts/aggregate.mjs:1216-1222](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/scripts/aggregate.mjs#L1216-L1222)

同一清单用于依赖、补丁与退役映射的生成。

```text
  const shellSubpaths = collectShellSubpaths(manifest.tombstones)
  if (shellSubpaths.length > 0) validateShellFiles(pkgDir, rel, errors)
  const shellNotes = resolveShellNotes(manifest.shellNotes, shellSubpaths, rel, errors)
  const patch = renderPatch(blocks, manifest.rows, manifest.patches ?? [], manifest.inactive ?? [], manifest.retire ?? [], manifest.familyIds, errors, rel, pkgDir)
  const resolvedDeps = resolveEntries(pkgDir, manifest.deps, 'deps', errors)
  const retiredPlugins = resolveRetiredPlugins(manifest.retiredPlugins, manifest.tombstones, resolvedDeps, rel, errors)
  const pkgJson = renderPackageJson(join(pkgDir, 'package.json'), resolvedDeps, shellSubpaths)
```

**依据 7 · 源码核查**：[scripts/aggregate.mjs:1255-1277](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/scripts/aggregate.mjs#L1255-L1277)

检查模式比较生成文本及多余展示文件。

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

#### 缺口

- 未检查所有子包所需服务及客户端扫描结果
  **影响**：不能把根装配完整理解为所有子能力都启动
  **进一步探讨**：核实一个已启用行与一个默认关闭行的宿主装载和浏览器面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么固定 Git 提交不能保证部署得到同一组能力？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

根提交固定 package.json 和其指向的补丁，但根依赖声明的是 @linxin666/dsh-web-all 的 ^0.4.16 范围。仓内 pnpm 锁将其解析成本地 link:packages/dsh-web-all，说明开发工作区取本地聚合包；独立用户 profile 的实际包版本和解析树不能由这条锁推断。聚合清单中还存在外部卫星的版本范围。它声明 DSH peer >=0.2.2-rc.1，属于清单声明而非兼容测试结果。作者记录严格隔离的 pnpm 布局可能让宿主从 profile 顶层找不到子包，构建审批缺失还可能导致安装重跑返回成功却缺 bundle 行。使用者应分别核对依赖版本、真实 profile 的 bundle 层、组合行和最小任务，避免为了得到输出而放宽未知构建或网络权限。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-18](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/package.json#L6-L18)

固定源码补丁，但聚合依赖为版本范围。

<details>
<summary>查看原文（13行）</summary>

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
    "@linxin666/dsh-web-all": "^0.4.16"
  },
```

</details>

**依据 2 · 源码核查**：[pnpm-lock.yaml:14-20](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/pnpm-lock.yaml#L14-L20)

仓内 importer 明确是工作区链接。

```text
importers:

  .:
    dependencies:
      '@linxin666/dsh-web-all':
        specifier: ^0.4.16
        version: link:packages/dsh-web-all
```

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:126-128](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/package.json#L126-L128)

聚合包的宿主 peer 声明。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1"
  },
```

**依据 4 · 源码核查**：[packages/dsh-web-all/package.json:182-186](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/package.json#L182-L186)

外部卫星仍从范围依赖取得。

```text
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.16",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.16",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.16",
    "@linxin666/dsh-pet": "^0.4.16"
  }
```

**依据 5 · 作者声明**：[README.md:352-365](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/README.md#L352-L365)

作者描述 profile 解析、构建审批与版本门禁问题。

<details>
<summary>查看原文（14行）</summary>

````text
> **pnpm 严格依赖隔离导致模块找不到**：pnpm 的 isolated 模式默认仅将聚合包放置在顶层，部分子包可能被嵌套收敛，导致 `dsh web` 启动时报错 `Cannot find package '@linxin666/dsh-...'`。若遇到此情况，可在 profile 目录的 `pnpm-workspace.yaml` 中添加配置 `nodeLinker: hoisted`（或 `public-hoist-pattern: ['@linxin666/*']`）后重新安装。

> **构建脚本被拦截 (ERR_PNPM_IGNORED_BUILDS)**：这三项审批必须在首次 add 之前就位。正确顺序是重置 profile（官方 `--from-default-profile web`）或换新 profile，在 `<profile>/pnpm-workspace.yaml` 里把三项写成映射，再执行 add：
>
> ```yaml
> allowBuilds:
>   cloudflared: true
>   cpu-features: true
>   ssh2: true
> ```
>
> 必须写成上面的映射形式：列表形式会被 pnpm 改写成 `'0': cloudflared` 之类的占位条目，重跑时还会回退已解析的包（`Packages: -10`）。装失败后补审批重跑会 exit 0，但 `dsh.profile.bundles` 仍无该行：静默半挂载，重跑修不回来，需要先 remove 再 add。已带审批的存量 profile 升级不受影响。

> **pnpm 11 发布时间门禁问题**：在包版本发布后的短时间内，pnpm 11 的默认安全策略（`minimumReleaseAge`）可能会尝试回退拉取旧版本。建议在 profile 目录的 `pnpm-workspace.yaml` 中排除相关命名空间以确保获取最新版本：
````

</details>

#### 缺口

- 未读取用户 profile 安装闭包、发布 tarball 或宿主结果
  **影响**：无法判断实际解析的版本、文件和构建结果
  **进一步探讨**：在隔离 profile 对照 package 安装树、组合配置和功能回读，再确认是否有残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 旧 profile 中退役 Git 图谱行会怎样，能否据此推断故障隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

旧 profile 可能仍用 @linxin666/dsh-web-all/git-graph 命名。聚合包为这一子路径保留共享 shell 导出，退役表还将 git-graph 映射到以前的真实包名。当旧行走该导出且 config.plugin 对上退役表时，shell 在动态 import 前直接返回，不会为这条退役分支记一条降级记录。这个条件只让已知旧行保留可解析性，不提供原 Git 图谱能力，也不清除旧配置。共享导出源码头注释称退役表为空，与本提交的生成表内容冲突，应依据真实导入和判断。未登记的旧行仍可能进入 import 失败分支，当前直挂真实包名的家族行也不通过这条空壳 guard，不能将空壳机制外推为所有子包都在统一隔离层中。作者的退役记录将独立老 npm 包与本次移除分开，未在此核对老包。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/aggregate.yml:227-231](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/aggregate.yml#L227-L231)

清单为 Git 图谱保留旧子路径，说明独立包退役。

```text
  # git-graph 已彻底移除（包目录删除；npm 包仍在 registry 上，供单独安装它的老用户
  # 继续使用）：聚合不再挂载它的行、也不再依赖它，但子路径导出必须留着，否则老
  # profile 里记录的行名在 import 阶段硬报错。壳按 retiredPlugins 的登记把它当
  # 静默 no-op，不 import、不记 degraded。
  - git-graph
```

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:14-18](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/package.json#L14-L18)

旧子路径仍指向共享 shell。

```text
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json",
    "./community-plugins": "./lib/shells/shell.js",
    "./git-graph": "./lib/shells/shell.js",
    "./plugin-manager": "./lib/shells/shell.js",
```

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shells/shell.ts:11-19](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shells/shell.ts#L11-L19)

注释声称名单为空，与生成表实际内容不一致。

```text
 * 2. Retirement registry: aggregate.yml's retiredPlugins section renders into
 *    ./retired-plugins.generated.ts. A stale row for a registered family
 *    carries the real package name in `config.plugin`, and this module skips
 *    the import for it, so a normal retirement stays a silent no-op instead of
 *    a degraded plugin on the health route. That list is empty today — every
 *    family it carried has since been removed outright — but the section, the
 *    generated module and the skip branch stay: they are what a future
 *    retirement needs, and the generated module is the only thing the branch
 *    reads.
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shells/shell.ts:25-33](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shells/shell.ts#L25-L33)

共享子路径模块将 apply 交给父级 shell。

```text
 * This file MUST live under shells/: the client module scanner resolves a
 * row's module URL and walks up to the nearest package.json, and the marker
 * manifest beside this file (src/shells/package.json, copied to lib/shells/)
 * stops that walk before it reaches the package root — whose dsh.client face
 * belongs to the compat row alone. A second scanner source for the same
 * package is a hard reconcile error ("resolves from multiple active Loader
 * sources").
 */
export { apply, inject, Config } from '../shell.ts'
```

**依据 5 · 源码核查**：[packages/dsh-web-all/src/retired-plugins.generated.ts:14-25](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/retired-plugins.generated.ts#L14-L25)

生成表有 Git 图谱及其他两个退役项。

<details>
<summary>查看原文（12行）</summary>

```text
/** Retired family subpath -> real package name of the plugin that used to mount there. */
export const RETIRED_FAMILIES: Readonly<Record<string, string>> = {
  'git-graph': '@linxin666/dsh-client-ui-git-graph',
  'remote-web-ui': '@linxin666/dsh-remote-web-ui',
  'update': '@linxin666/dsh-update',
}

/** Every retired package name, sorted: what the shell skips without importing. Derived from
 *  RETIRED_FAMILIES so the two can never disagree. */
export const RETIRED_PLUGINS: readonly string[] = Object.freeze(
  Object.values(RETIRED_FAMILIES).sort(),
)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/src/shell.ts:287-300](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shell.ts#L287-L300)

实际 guard 集合来自生成表。

<details>
<summary>查看原文（14行）</summary>

```text
 * Known retired family plugins: stale rows from older user profiles mount as
 * silent no-ops so upgrading the aggregate package never breaks the host boot.
 *
 * The list is generated from the aggregate.yml `retiredPlugins` section
 * (src/retired-plugins.generated.ts) and is therefore the single source for
 * this behavior: adding a retired family edits the manifest and reruns
 * `node scripts/aggregate.mjs`. It used to be a hand-written literal here,
 * and it drifted — the 2026-09-23 removal of dsh-doctor and
 * dsh-tool-describe-image never added its two package names, so their leftover
 * profile rows fell through to the import below and recorded a normal
 * retirement as a degraded plugin. The semantics are unchanged: a row naming a
 * retired plugin mounts empty and records nothing.
 */
const RETIRED_PLUGINS = new Set(RETIRED_PLUGINS_GENERATED)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-web-all/src/shell.ts:385-425](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shell.ts#L385-L425)

对 config.plugin 检查退役表并在 import 前返回，其他 import 失败可记降级。

<details>
<summary>查看原文（41行）</summary>

```text
    const spec = row.plugin
    if (typeof spec !== 'string' || spec === '') {
      // Two legitimate shapes land here and must mount QUIETLY (no degraded
      // record, no throw — an async apply's rejection escapes the loader
      // lifecycle as an unhandled rejection and the host's fail-loud guard
      // kills the whole process):
      // - the SELF row (web-ui-compat): no config at all (undefined or {}).
      //   The compat shim's host half has no host behavior; its browser half
      //   rides the package's ./client face.
      // - a USER bare-row override (`- id: <row>` + `config:` in a patch
      //   layer): patch overrides REPLACE the row config wholesale, so a
      //   hand-written tuning that drops the `plugin` key leaves this row
      //   with nothing to mount. Silence is the documented behavior for that
      //   shape; anything else still lands in the ledger for visibility.
      if (isOverrideShape(row)) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is missing the "plugin" package name (row config: ${describeConfig(row)}); the entry mounted empty`))
      return
    }
    if (RETIRED_PLUGINS.has(spec)) {
      // Stale row from an older profile whose plugin has been retired. Mount empty quietly.
      return
    }
    const family = familyConfigOf(row)
    if (mounted !== undefined && mounted.spec === spec && sameFamilyConfig(mounted.config, family)) return
    if (mounted !== undefined) {
      const previous = mounted
      mounted = undefined
      try {
        await previous.dispose?.()
      } catch (error) {
        // A failed unmount must never keep the new config from mounting.
        console.warn('[dsh-web-all] unmounting the previous family plugin failed:', error)
      }
    }
    let mod: unknown
    try {
      mod = await import(/* @vite-ignore */ spec)
    } catch (error) {
      recordDegraded(spec, 'import', error)
      return
    }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:1-16](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L1-L16)

当前真实包名挂载与旧子路径区分。

<details>
<summary>查看原文（16行）</summary>

```text
# AUTO-GENERATED by scripts/aggregate.mjs — do not edit
# This file is derived from the aggregate.yml manifest in this package;
# edit aggregate.yml and rerun `node scripts/aggregate.mjs`.
# Rows are namespaced web-ui-* so the bundle can coexist with standalone installs.
# Family rows mount the real plugin package: the loader then serves that package's
# own browser half, and one family switch is one loader switch.

# from self
- insert:
    - id: web-ui-compat
      name: '@linxin666/dsh-web-all'

# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'
```

</details>

#### 缺口

- 未启动历史 profile 或注入实际宿主加载故障
  **影响**：未验证各种历史覆盖项与新宿主是否都正常
  **进一步探讨**：用含旧子路径和旧 id 覆盖项的隔离 profile 分别核对加载与诊断。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样度量试用与退出成本，哪些情况应暂缓 Git 根安装？

**研究主题**：效果与总成本、采用判断

#### 完整回答

以一次隔离 profile 中两项功能成功交付计量，例如打开任务看板读取已有卡片并确认用量面板能读当前会话。首次资源包括包下载和宿主存储，人工先核对实际依赖版本、备份 profile、确认所需行和权限，时间和现金未知。持续使用要为各功能的模型、后台进程和外部服务单独核算，并在更新后复核行、配置和功能。失败时先区分缺包、被禁用、旧兼容空壳和真启动失败。若安装后版本与预期不符、不能确认包权限或旧行的功能已退役，保留备份与业务文件，退出测试 profile 或按记录恢复。作者示例给出聚合包卸载与重启，不据此推断移除根载具会自动撤销子包执行或外部副作用。只需一项能力时可先按需安装，功能与权限更易逐一验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:224-246](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/README.md#L224-L246)

两类安装不宜叠加，作者建议按需选包。

<details>
<summary>查看原文（23行）</summary>

````text
### 三步上手（npm 安装，推荐）

- **DSH Web CLI（现有浏览器服务）**：
  1. 先完成三项构建脚本审批（见“安装排障”），再安装聚合包：`dsh plugin --profile web add @linxin666/dsh-web-all@latest`
  2. 重启 `dsh web` 服务，侧边栏将自动呈现各插件入口
  3. 打开“设置 > 插件配置”按需开关插件，或在皮肤面板选用主题
- **官方桌面客户端（DeepSeek Harness Desktop）**：
  1. 打开官方桌面客户端，进入“设置 → 插件”页面
  2. 在插件安装框中输入 `@linxin666/dsh-web-all` 并确认安装
  3. 重启客户端，即可在侧边栏与“设置”中使用各插件功能

> 若仅需要皮肤功能，可单独安装 `@linxin666/dsh-client-ui-skin-center`。若因包管理器门禁安装到旧版本，请参阅后文“安装排障”。

### 从 GitHub 仓库直接安装

仓库根目录声明了标准 `dsh.bundle` 装配清单，支持直接通过仓库地址安装，无需手动克隆代码与构建：

```sh
dsh plugin --profile web add github:zhu1090093659/dsh-web
# 或使用完整 git 地址：dsh plugin --profile web add git+https://github.com/zhu1090093659/dsh-web.git
```

该方式与直接从 npm 安装聚合包效果等价，二者择其一即可。请勿同时通过两种方式安装，以免出现 entry id 冲突。
````

</details>

**依据 2 · 作者声明**：[README.md:337-352](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/README.md#L337-L352)

作者区分组合配置、重启、聚合包卸载和包布局错误。

<details>
<summary>查看原文（16行）</summary>

```text
### 验证与卸载

安装后重启 `dsh web` 服务，侧边栏出现对应功能图标即代表加载成功；亦可通过执行 `dsh --profile web --dump-config` 检查配置层挂载状态。若侧边栏未刷新出入口，请确认服务进程已彻底重启。

卸载聚合包：`dsh plugin --profile web remove @linxin666/dsh-web-all`，完成后重启 `dsh web` 即可恢复纯净状态。

技术实现细节与挂载原理解析见 [docs/plugins.md](docs/plugins.md)。

### 安装排障

<details>
<summary><strong>展开查看常见安装与构建排障方案</strong></summary>

<br>

> **pnpm 严格依赖隔离导致模块找不到**：pnpm 的 isolated 模式默认仅将聚合包放置在顶层，部分子包可能被嵌套收敛，导致 `dsh web` 启动时报错 `Cannot find package '@linxin666/dsh-...'`。若遇到此情况，可在 profile 目录的 `pnpm-workspace.yaml` 中添加配置 `nodeLinker: hoisted`（或 `public-hoist-pattern: ['@linxin666/*']`）后重新安装。
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:113-118](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/cordis.patch.yml#L113-L118)

有包行不等于功能当前启用。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shell.ts:403-425](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shell.ts#L403-L425)

退役静默与真实 import 失败走不同分支。

<details>
<summary>查看原文（23行）</summary>

```text
    if (RETIRED_PLUGINS.has(spec)) {
      // Stale row from an older profile whose plugin has been retired. Mount empty quietly.
      return
    }
    const family = familyConfigOf(row)
    if (mounted !== undefined && mounted.spec === spec && sameFamilyConfig(mounted.config, family)) return
    if (mounted !== undefined) {
      const previous = mounted
      mounted = undefined
      try {
        await previous.dispose?.()
      } catch (error) {
        // A failed unmount must never keep the new config from mounting.
        console.warn('[dsh-web-all] unmounting the previous family plugin failed:', error)
      }
    }
    let mod: unknown
    try {
      mod = await import(/* @vite-ignore */ spec)
    } catch (error) {
      recordDegraded(spec, 'import', error)
      return
    }
```

</details>

#### 缺口

- 未测首次、持续与恢复成本
  **影响**：无法判断预组合是否减少每次合格交付总成本
  **进一步探讨**：在同一宿主和配置复制上记录配置时间、包与存储用量、功能成功数和回退后的状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 装配预检能否降低 profile 错配排障成本？

**研究主题**：新假设与验证

#### 完整回答

生成器能检查本仓装配产物漂移。shell 的本地健康路由可以显示它记录的部分降级，已知退役分支本身不写降级。因此可试一个只读的 profile 装配检查，读取实际版本、组合行和退役映射，对照维护者预期的配置，分开报告缺包、关闭、已退役和加载失败。它需要用户指定目标 profile，有权限才读配置和运行状态；每个判据独立，不根据缺健康记录推断正常。最小验证让相同使用者随机排查四类带已知真值的隔离配置，与现有生成校验、dump-config 和日志做对照，比较正确归因、人工分钟和误报。准确率没提高、产生误启用建议或维护成本超过约定投入时不继续。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/aggregate.mjs:1262-1277](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/scripts/aggregate.mjs#L1262-L1277)

现有生成检查关注固定文件和生成结果。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/shell.ts:129-145](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shell.ts#L129-L145)

现有路由只返回已记录的降级且检查 loopback 来源。

<details>
<summary>查看原文（17行）</summary>

```text
function makeDegradedRoute(): WebRoute {
  return {
    kind: 'exact',
    path: '/api/dsh-web-all/degraded',
    handler: async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      let remote = req.socket.remoteAddress ?? ''
      if (remote.startsWith('::ffff:')) remote = remote.slice(7)
      if (remote !== '127.0.0.1' && remote !== '::1') {
        res.writeHead(403, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'forbidden: loopback-only' }))
        return
      }
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ ok: true, degraded: listDegraded() }))
    },
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:403-405](https://github.com/zhu1090093659/dsh-web/blob/ae4a35e1a7c4f3e27bbe6fe82d8e827d2909b981/packages/dsh-web-all/src/shell.ts#L403-L405)

退役路径提前返回，不应把无降级误读成功能正常。

```text
    if (RETIRED_PLUGINS.has(spec)) {
      // Stale row from an older profile whose plugin has been retired. Mount empty quietly.
      return
```

#### 缺口

- 该预检未实现也未做用户对照
  **影响**：不能将假设作为已有故障诊断能力
  **进一步探讨**：先用四类隔离配置做只读表格实验并记录误报。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
