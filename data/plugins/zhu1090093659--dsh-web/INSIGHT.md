# dsh-web 根工程

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303)

<!-- BEGIN META -->
[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web)
<!-- END META -->

> **实现功能**：维护 dsh-web 家族的多包工程，并通过根 bundle 入口转接聚合插件安装。

> **核心亮点**：根工程集中维护聚合生成和多包一致性，Git入口转接而不另实现子功能；相对直接聚合安装仅局部来源便利。见[Q01](#research-q01)。

> **风险与缺陷**：根Git SHA不等于所有加载包的版本，^范围和registry解析需另存实际锁；全仓能力不能重复归为根插件。见[Q03](#research-q03)。

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
  - [Q01 · 根工程与聚合包和子插件如何分工？](#detail-section-11)
  - [Q02 · 根manifest与生成工具如何转交责任？](#detail-section-12)
  - [Q03 · 固定Git根与npm范围混合有什么复现和恢复代价？](#detail-section-13)
  - [Q04 · 根入口怎样采用，能推导什么来源证明方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：贡献者维护多包和生成规则，用户通过载具转接聚合安装。

直接装固定版本@linxin666/dsh-web-all或所需独立包，避免无必要增加Git载具层。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 根bundle载具 | 转接聚合安装 | 不另提供任务板/SSH实现 |
| 聚合生成工具 | 维护patch/依赖一致性 | 开发工具，不是用户运行验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 已工作DSH/profile管理者 | 用户安装必需 | 加载bundle | Desktop不混用web |
| npm聚合及其依赖 | 运行必需 | 真实功能 | 根Git无法替代 |
| Node>=22/pnpm | 源码开发需要 | 构建和生成 | 不强加给普通npm用户 |
| 实际profile lock | 复现判断需要 | 说明闭包版本 | 不用根SHA冒充全锁定 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选入口 | 用户判断源码贡献或普通使用 | 普通使用优先聚合/单包 |
| 固定来源 | 维护者保存Git与实际npm锁 | 所有加载身份可解释 |
| 核查 | 对应组件验证功能 | 根check不替代子组件验收 |
| 回退 | 用户按profile管理器移除/回退 | 恢复锁及配置而非修改源码猜测 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Git载具和npm闭包；金额未知 | 核profile、来源及实际锁 | Git固定不固定全部npm |
| 持续使用 | 子包更新及源码开发资源 | 管多层版本，贡献者维护生成 | 总工时未知 |
| 失败恢复 | 回退包与profile资源 | 先核实际来源，恢复锁/配置 | 不据根源码猜运行状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 根安装路由 | 指向聚合patch及npm依赖 | 实际安装闭包 |
| 工程一致性 | aggregate生成/check规则 | 全部组合运行正确 |
| 用户增量 | Git来源入口 | 相对直接npm的净收益 |

> **思考**：根Git SHA不等于所有加载包的版本，^范围和registry解析需另存实际锁；全仓能力不能重复归为根插件。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：根工程集中维护聚合生成和多包一致性，Git入口转接而不另实现子功能；相对直接聚合安装仅局部来源便利。见[Q01](#research-q01)。

根工程集中维护聚合生成和多包一致性，Git入口转接而不另实现子功能；相对直接聚合安装仅局部来源便利。见[Q01](#research-q01)。

manifest驱动递归展开、命名空间和生成检查值得参考；根开发workspace与profile registry是两条路径，移植需明确发布闭包，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

根Git SHA不等于所有加载包的版本，^范围和registry解析需另存实际锁；全仓能力不能重复归为根插件。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

普通使用先选明确身份的聚合/单包，根保留为源码贡献和来源研究入口。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根载具和生成规则有源码支持；固定Git不固定整个npm闭包，普通用户额外收益不足，来源证明为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、pnpm-workspace.yaml、scripts/aggregate.mjs、packages/dsh-web-all/cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根载具与生成规则源码范围，不将monorepo全部功能当根运行验收；不执行构建或安装。
- 下一步：对同一根SHA的实际profile闭包做只读来源回读，分别核根/聚合/子包版本和启用行，不运行目标代码推断结果。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.11（[固定提交 dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是只读输出Git/npm/子包/启用行的来源闭包证明；若现有lock已足够且无真实维护收益则不另建。见[Q04](#research-q04)。

对同一根SHA的实际profile闭包做只读来源回读，分别核根/聚合/子包版本和启用行，不运行目标代码推断结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1277 | 71105 | — | — | 1616736 |
| .mjs | source | 70 | 17320 | 12283 | 3927 | — |
| .tsx | source | 131 | 32801 | 24912 | 6270 | — |
| .ts | source | 739 | 160906 | 99666 | 51156 | — |
| .js | source | 27 | 13689 | 11340 | 2289 | — |
| .ts | test | 422 | 103884 | 76249 | 18479 | — |
| .tsx | test | 82 | 20863 | 15058 | 3545 | — |
| .md | example | 1 | 64 | — | — | 473 |
| .ts | example | 4 | 52 | 22 | 27 | — |
| .mjs | test | 37 | 8478 | 6846 | 1097 | — |
| .cjs | source | 2 | 146 | 79 | 87 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 192](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=192&color=grey&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-27T02%3A11%3A55.442Z..2026-10-27T02%3A11%3A55.442Z) [![近30天关闭 195](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=195&color=grey&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A11%3A55.442Z..2026-10-27T02%3A11%3A55.442Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根工程作为Git载具和monorepo的边界，不重复子包贡献

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工程与聚合包和子插件如何分工？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-web根是维护多个DSH插件及聚合生成工具的monorepo，同时保留可Git安装的载具入口。目标读者分两类：开发者维护共享代码/发版规则，普通用户要装聚合或某个具体功能。根manifest private=true且files只声明自身package和聚合patch，依赖npm的@linxin666/dsh-web-all范围；因此根没有另一个任务板或SSH实现，README全家桶功能属于组件集合。相对直接装聚合npm，Git根入口主要是来源和路由便利，不能声称有额外运行能力；源码开发则有多包统一构建与一致性检查价值。合格交付是明确实际加载的组件和版本，不是将仓库Stars或全仓LOC当一个插件能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/package.json#L1-L18)

private根载具、patch与npm依赖

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-web",
  "version": "0.4.11",
  "private": true,
  "description": "DeepSeek Harness Web GUI 插件全家桶。皮肤、宠物与社区插件索引已拆分为独立仓库（dsh-skins / dsh-pet / dsh-community-plugins），本仓通过 npm 包内置它们。",
  "dsh": {
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.11"
  },
  "scripts": {
```

</details>

**依据 2 · 作者声明**：[README.md:42-49](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/README.md#L42-L49)

模块化和聚合/独立安装的作者分工

```text
## 是什么

原生 DeepSeek Harness Web 提供了核心的对话交互与工具调用能力，但在多任务并发调度、长程后台执行、移动端协同以及工程化开发运维方面仍有扩展空间。

dsh-web 通过官方 profile 机制挂载到 `dsh web`，零修改侵入官方源码，为用户提供完整的模块化扩展体系：
- **工程运维与协同插件**：涵盖长程自动化任务看板（多 Agent 级联/Teams 编排、对抗验收质检与定时调度）、梁神模式（极简 Persona、PTC 代码运行传输与敏捷调度纪律）、移动端与跨设备远程控制、SSH 终端传输、Git 图谱与 worktree 隔离、全量会话归档管理以及模型能力声明编辑器；
- **视觉主题与资产解耦**：功能插件与样式资产完全分离。皮肤插件负责底层渲染，多样化的主题皮肤（含样式、贴图与动态特效）以及桌面宠物可通过 [DSH 创意工坊](#创意工坊dsh-marketcom)自由安装；
- **全家桶聚合与按需组合**：既支持通过 `@linxin666/dsh-web-all` 聚合包一键安装完整功能，也支持按需单独安装特定插件。聚合包预集成家族全部功能插件，详见[插件全家桶使用指南](packages/dsh-web-all/README.zh.md)。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根manifest与生成工具如何转交责任？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根dsh.bundle指向packages/dsh-web-all/cordis.patch.yml，其行直接加载真实npm组件。scripts/aggregate.mjs读取手写aggregate.yml，将patchFrom组件insert行递归展开并统一web-ui命名空间，把deps解析到包名，外部bundle也按行展开，再输出默认禁用/配置覆盖。脚本提供--check检生成漂移，根package有aggregate/runtime-deps/libs等检查；这是维护生成一致性，不能证明宿主运行或子功能效果。workspace配置linkWorkspacePackages=true只保证开发时将根范围链到同源工程，注释明确profile Git安装仍走npm registry，因此源码工作区和用户Git安装不是同一个解析路径。值得借鉴的是身份/依赖由实际子manifest读取，代价是需同时维护发布转换和运行布局。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/aggregate.mjs:5-38](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/scripts/aggregate.mjs#L5-L38)

聚合规则、递归展开和检查模式

<details>
<summary>查看原文（34行）</summary>

```text
 * An aggregate bundle is a plain carrier package whose cordis.patch.yml is the
 * concatenation of its child plugins' insert rows and whose package.json
 * dependencies pull in every child with "workspace:*". The DSH loader
 * resolves patch rows from the profile root, so the children are installed as
 * normal dependencies (pnpm hoists them to the top level in the default
 * hoisted layout); the README documents the hoist setting for strict-layout
 * profiles.
 *
 * Usage:
 *   node scripts/aggregate.mjs            # regenerate + write everything
 *   node scripts/aggregate.mjs --check    # verify only; exit 1 on any drift
 *
 * Each aggregate package carries a hand-written aggregate.yml manifest:
 *
 *   patchFrom:
 *     - ../skins/skin-center
 *   deps:
 *     - ../skins/skin-center
 *     - ../skins/xp
 *   rows:
 *     - {"id": "external-id", "name": "some-external-plugin"}
 *
 *   - patchFrom entries contribute their child's cordis.patch.yml insert rows
 *     to the aggregate patch (nested aggregates expand recursively, in
 *     patchFrom order, with per-source comment headers);
 *   - deps entries are resolved to each child's package.json "name" and
 *     written into the aggregate's dependencies as "workspace:*";
 *   - rows entries (single-line JSON flow mappings) are EXTERNAL plugin rows
 *     for npm packages outside this repo (the row's `name` resolves from the
 *     profile root like any child); they are emitted after the patchFrom
 *     blocks, with their id namespaced like every other row. A row whose
 *     package declares `dsh.bundle` is expanded: its cordis.patch.yml is
 *     parsed with the same row rules, insert rows are emitted under their
 *     namespaced aggregate id (their `name` is a real importable plugin
```

</details>

**依据 2 · 源码核查**：[pnpm-workspace.yaml:1-11](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/pnpm-workspace.yaml#L1-L11)

开发workspace链接与profile registry差别

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

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:5-29](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-web-all/cordis.patch.yml#L5-L29)

根转发的实际真实包行

<details>
<summary>查看原文（25行）</summary>

```text
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

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
```

</details>

#### 缺口

- 生成规则与发布转换在所有组件组合中的语义一致性未全面审计
  **影响**：不能把check脚本存在当运行正确
  **进一步探讨**：对固定发布集回读根/聚合/子包manifest和patch，逐项确认实际解析身份

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定Git根与npm范围混合有什么复现和恢复代价？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

固定根提交只固定根manifest和patch文本，^0.4.11仍允许registry选择相容范围内的后续聚合版本，其子依赖又有自己的解析。因此不能把研究的Git提交当整个安装闭包的版本证明；要保存profile lock与实际npm tarball身份。首次需要已工作DSH和正确profile管理者，源码开发另需Node>=22/pnpm及平台构建依赖；普通安装不应执行整个monorepo开发命令。持续需判断用Git入口、聚合npm或独立包哪条升级链，重复来源可能引起配置归属与共存困惑；故障需先核profile实际依赖而非改源码猜测，退出应通过同一profile管理器移除/回退载具与保留状态备份。现金、构建时长和迁移工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-18](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/package.json#L7-L18)

patch固定但聚合依赖为semver范围

<details>
<summary>查看原文（12行）</summary>

```text
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.11"
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[pnpm-workspace.yaml:9-20](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/pnpm-workspace.yaml#L9-L20)

registry路径与允许构建项

<details>
<summary>查看原文（12行）</summary>

```text
# 根包作为可安装 bundle（dsh.bundle）依赖聚合包；仓库内开发时把该 range
# 链接到 workspace 工程（版本同源），profile 里的 git 安装仍走 npm registry。
linkWorkspacePackages: true

allowBuilds:
  # The cloudflared postinstall downloads the platform binary (the auto-tunnel
  # feature ships its own tunnel client — users install nothing).
  cloudflared: true
  cpu-features: true
  esbuild: true
  node-pty: true
  ssh2: true
```

</details>

**依据 3 · 作者声明**：[README.md:209-225](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/README.md#L209-L225)

系统、npm和Desktop安装边界

<details>
<summary>查看原文（17行）</summary>

```text
### 系统要求

- 已安装 DeepSeek Harness 且 `dsh web` 可正常启动。
- npm 安装方式无需额外环境；若从源码仓库构建，需要 Node.js >= 22 与 pnpm 环境。

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
```

</details>

#### 缺口

- 当前实际Git安装闭包未采集
  **影响**：不能确认Git入口复现当前所审子包提交
  **进一步探讨**：在临时profile保存lock、解析包版本及来源，再决定是否采用Git载具

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 根入口怎样采用，能推导什么来源证明方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

对普通使用者，本轮先观察根Git载具；已有明确需求时直接选择有自己身份的聚合包或独立组件更容易核版本。根源码适合研究贡献者阅读生成与多包治理，但不把运行能力重新计入根。相对聚合npm，Git载具未证明额外用户收益，且固定Git却动态解析npm容易造成复现误解。由此可推导未验证方向：安装完成输出来源闭包证明，列根Git、聚合版本、子包tarball与启用行，让用户知道固定了哪一层。最小验证以相同根提交在两次不同registry状态下安装，只读比较锁和来源摘要是否准确揭示差异；若已有锁文件已能满足目标维护者且新报告无人使用，则不另建入口或产品。出现实际加载版本无法解释时停止以根SHA作验收依据，退回固定版本npm组件与profile锁。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-18](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/package.json#L7-L18)

Git与npm多层身份边界

<details>
<summary>查看原文（12行）</summary>

```text
    "bundle": {
      "patch": "./packages/dsh-web-all/cordis.patch.yml"
    }
  },
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.11"
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[pnpm-workspace.yaml:9-11](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/pnpm-workspace.yaml#L9-L11)

开发同源不等于用户安装同源

```text
# 根包作为可安装 bundle（dsh.bundle）依赖聚合包；仓库内开发时把该 range
# 链接到 workspace 工程（版本同源），profile 里的 git 安装仍走 npm registry。
linkWorkspacePackages: true
```

#### 缺口

- 来源闭包说明是否解决真实维护需求未知
  **影响**：不据技术差异直接认定插件机会
  **进一步探讨**：先用真实安装事故手工出一份来源清单，对比现有lockfile解释成本

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
