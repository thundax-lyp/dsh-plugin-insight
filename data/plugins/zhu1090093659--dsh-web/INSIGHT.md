# DSH Web 根聚合载具

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0af7b23](https://github.com/zhu1090093659/dsh-web/tree/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b)

<!-- BEGIN META -->
[![GitHub ★ 10,404](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C404&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web)
<!-- END META -->

> **功能**：通过 Git 根清单为 DeepSeek Harness 装配 Web 界面组件和兼容层。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，清单把同一家族的 Loader 行和独立组件放到一个安装入口，并保留配置中的启停条件。

> **主要限制**：[Q02](#research-q02) 显示固定根提交仍留下 npm 解析差异，[Q03](#research-q03) 的壳诊断范围也不能覆盖所有直挂组件。

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
  - [Q01 · 挂根包和直接使用聚合包有何实际差别？](#detail-section-11)
  - [Q02 · 同一固定提交所见组件为何可能装成不同组合？](#detail-section-12)
  - [Q03 · 退役行和诊断路由怎样处理旧配置与加载失败？](#detail-section-13)
  - [Q04 · 代表性子包有哪些可观察的新版行为？](#detail-section-14)
  - [Q05 · 部署和退出的成本、建议及装配预检怎么验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在已有 DSH Web profile 统一安装设置、市场和任务看板的维护者，可以先在隔离 profile 检查根载具。

原办法是直接安装 npm 聚合包或按需添加独立组件。只需要一个功能时可以核对更少的依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 聚合 patch | 挂载家族设置、市场与任务 | 依赖包解析与开关 |
| 旧壳兼容 | 让常见退役行静默退出 | 适用于经过兼容壳的部署 |
| 本地诊断 | 查看部分挂载失败 | 路由按 socket 限制回环 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 及 npm 聚合依赖 | 常规部署必需 | 补丁装载 | 入口未挂载或组件缺失 |
| 可解析子包 | 对应组件必需 | 提供真实 Host 与客户端 | 对应能力不可用 |
| 用户 profile 配置 | 保持实际入口一致 | 开关和环境解析 | 可能冲突或依赖未就绪 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者选定一个入口和隔离 profile | 对齐宿主与依赖图 |
| 验收 | 重启后检查设置与看板 | 入口和实际操作出现 |
| 退出 | 切回原 profile | 核对原功能，再单独处置样例资料 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包和依赖下载 | 对照 profile 与组件 | 实际安装耗时未知 |
| 持续使用 | 功能组件按需占用资源 | 排查版本及独立能力 | 日常负担未测 |
| 失败恢复 | 可能重复下载安装 | 切回原 profile 与核对入口 | 复原时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 装配 | 家族行与真实组件挂载 | 实际 npm 解析版本 |
| 兼容 | 识别退役项目和部分错误 | 全部组件故障隔离能力 |
| 使用 | 有明确代表组件入口 | 实机配置和任务可用性 |

> **思考**：[Q02](#research-q02) 显示固定根提交仍留下 npm 解析差异，[Q03](#research-q03) 的壳诊断范围也不能覆盖所有直挂组件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，清单把同一家族的 Loader 行和独立组件放到一个安装入口，并保留配置中的启停条件。

[Q01](#research-q01) 将生成行、命名和开关同步维护。[Q03](#research-q03) 将退役处理与记录原因分开，直挂组件仍受宿主管理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示固定根提交仍留下 npm 解析差异，[Q03](#research-q03) 的壳诊断范围也不能覆盖所有直挂组件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 把观察限定在固定入口和隔离 profile。发现重复行或挂载失败时退回原环境。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已追踪根装配、部分兼容行为与代表性子包更新。实际安装、子包解析、重启与跨版本运行仍待验证。

- 已检查：作者 README、包清单、源码路径 package.json、packages/dsh-web-all/aggregate.yml、scripts/aggregate.mjs、packages/dsh-web-all/cordis.patch.yml、README.md、packages/dsh-web-all/package.json、packages/dsh-web-all/src/retired-plugins.generated.ts、packages/dsh-web-all/src/shell.ts、packages/dsh-web-all/src/client/index.ts、packages/dsh-browser-view/src/host/service.ts、packages/dsh-skill-explorer/src/routes.ts、packages/dsh-usage/src/core/adapters.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 Git 载具、生成清单、代表子包固定源码及旧壳兼容。资产、全部家族组件和实际部署未逐一审计；未执行宿主或组件。
- 下一步：用两个隔离 profile 对照根和 npm 后的锁、挂载 ID 与实际窗口。对 [Q05](#research-q05) 的预检假设加入重复行、无组件与旧退役行。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.18（[固定提交 0af7b23](https://github.com/zhu1090093659/dsh-web/tree/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出安装前用实际 profile 检查组件解析、重复行及退役映射，比较能否减少装到一半才出现的错误。

用两个隔离 profile 对照根和 npm 后的锁、挂载 ID 与实际窗口。对 [Q05](#research-q05) 的预检假设加入重复行、无组件与旧退役行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1386 | 80446 | — | — | 1861359 |
| .mjs | source | 73 | 18646 | 12971 | 4505 | — |
| .tsx | source | 134 | 35647 | 26725 | 7211 | — |
| .ts | source | 753 | 173860 | 106179 | 56872 | — |
| .js | source | 32 | 17104 | 13816 | 3208 | — |
| .ts | test | 474 | 123820 | 89945 | 23689 | — |
| .tsx | test | 88 | 23451 | 16757 | 4103 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |
| .mjs | test | 45 | 11564 | 9022 | 1786 | — |
| .cjs | source | 2 | 146 | 79 | 87 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-14），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在已有 DSH Web profile 中使用聚合配置时，怎样确认预期组件、真实挂载和故障退出条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 挂根包和直接使用聚合包有何实际差别？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

已有 DSH Web profile、想在同一实例准备设置、市场与任务看板的人，可以选择根仓库 bundle 入口，相比逐个管理包可复用一致的装配表。根 package private，files 仅包括包清单、聚合补丁和语言资源，运行依赖 npm @linxin666/dsh-web-all。当前生成器将各组件的 patch 行统一为 web-ui 命名空间，检查重复 ID，保留原包名及平台字段。实际补丁中除兼容行之外，市场、管理器、看板都直接挂真实组件名，浏览器入口由实际包映射。根 Git 和直接 npm 安装都以同类聚合表为目标；同一 profile 同时加载两者可能重复 ID。若只用一个功能，单独组件可减少依赖和排障范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/package.json#L1-L18)

Git 根为私有 bundle 载具，依赖 npm 聚合包。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-web",
  "version": "0.4.18",
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
    "@linxin666/dsh-web-all": "^0.4.18"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/aggregate.yml:15-35](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/aggregate.yml#L15-L35)

生成器输入含家族顺序和旧 Git 图谱处理。

<details>
<summary>查看原文（21行）</summary>

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
  # dsh-agents 紧跟在看板这一对之后：它也是「定义 + 真实会话执行」的家族面，用户在同
  # 一处找它们。这只是阅读上的归类，没有装载顺序依赖——它只用官方服务（宿主半区
  # systemPrompt / typertGateway / webServer，浏览器半区 locale / renderer / sidebar /
  # slots），自己的侧栏行与主区页面经 slots.inject 声明（行 order 30），不占任何家族
  # 行的席位，因此前后挪动不会改变谁先就位。
  - ../dsh-agents
  # dsh-git-graph 已彻底移除（包目录删除）：Git 变更视图由官方 workspace-changes 插件
  # 承接，聚合不再挂载它的行、也不再依赖它；子路径导出按 tombstones 段留作退役空壳。
```

</details>

**依据 3 · 源码核查**：[scripts/aggregate.mjs:808-832](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/scripts/aggregate.mjs#L808-L832)

生成行使用真实包名、去重和保留参数。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-45](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/cordis.patch.yml#L8-L45)

固定版本的实际提供方及禁用原设置插件行。

<details>
<summary>查看原文（38行）</summary>

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

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

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

**依据 5 · 作者声明**：[README.md:223-245](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/README.md#L223-L245)

作者列明两个安装入口与冲突条件。

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

#### 缺口

- 未对照安装两种制品的实际界面集合
  **影响**：只能说明根包意图和当前源码行
  **进一步探讨**：在两个隔离 profile 对照解析表、真实包与首个代表性应用入口

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 同一固定提交所见组件为何可能装成不同组合？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

根的 ^0.4.18 允许解析同主、次版本的后续补丁，聚合清单还包含 workspace 依赖和多个外部 ^0.4.18 包，固定 Git 只决定根补丁字节及依赖范围。安装结果还取决于锁和发布物转换；当前聚合包声明宿主 >=0.2.2-rc.3，不能以源码依赖替代实际宿主版本和 API。补丁根据平台禁用 Windows Bash，并有 SSH、Skill Explorer 的默认关闭覆盖。README 将 pnpm 隔离链接、构建脚本限制及新安装后重启列为部署条件；未核实当前实际运行。完整对照要同时确认解析后的包版本、profile 中启停和入口是否提供应有功能，看到锁文件或挂载行各自只覆盖一层。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-18](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/package.json#L11-L18)

文件范围及 npm 半开依赖。

```text
  "files": [
    "package.json",
    "packages/dsh-web-all/cordis.patch.yml",
    "locale"
  ],
  "dependencies": {
    "@linxin666/dsh-web-all": "^0.4.18"
  },
```

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:119-128](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/package.json#L119-L128)

聚合宿主最低版本及构建脚本。

<details>
<summary>查看原文（10行）</summary>

```text
  "scripts": {
    "build": "tsdown",
    "test": "vitest run",
    "prepare": "tsdown",
    "typecheck": "tsgo --noEmit",
    "watch": "tsdown --watch"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.3"
  },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/package.json#L162-L185)

本地工作区与外部 semver 依赖。

<details>
<summary>查看原文（24行）</summary>

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-team": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
    "@linxin666/dsh-remote-bridge": "workspace:*",
    "@linxin666/dsh-task-board-remote": "workspace:*",
    "@linxin666/dsh-ssh": "workspace:*",
    "@linxin666/dsh-liangshen": "workspace:*",
    "@linxin666/dsh-client-ui-skill-explorer": "workspace:*",
    "@linxin666/dsh-usage": "workspace:*",
    "@linxin666/dsh-session-archive": "workspace:*",
    "@linxin666/dsh-client-ui-message-edit": "workspace:*",
    "@linxin666/dsh-win-bash": "workspace:*",
    "@linxin666/dsh-client-ui-web-ui-settings": "workspace:*",
    "@linxin666/dsh-i18n": "workspace:*",
    "@linxin666/dsh-client-ui-diagrams": "workspace:*",
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.18",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.18",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.18",
    "@linxin666/dsh-pet": "^0.4.18"
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:92-118](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/cordis.patch.yml#L92-L118)

平台限制与 opt-in 覆盖。

<details>
<summary>查看原文（27行）</summary>

```text
# from ../dsh-win-bash
- insert:
    - id: web-ui-win-bash
      name: '@linxin666/dsh-win-bash'
      disabled: !!js process.platform !== 'win32'

# from ../dsh-i18n
- insert:
    - id: web-ui-i18n
      name: '@linxin666/dsh-i18n'

# from ../dsh-diagrams
- insert:
    - id: web-ui-diagrams
      name: '@linxin666/dsh-client-ui-diagrams'

# from ../dsh-browser-view
- insert:
    - id: web-ui-browser-view
      name: '@linxin666/dsh-client-ui-browser-view'

# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

</details>

**依据 5 · 作者声明**：[README.md:348-359](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/README.md#L348-L359)

作者说明依赖可达及构建权限。

<details>
<summary>查看原文（12行）</summary>

````text

<br>

> **pnpm 严格依赖隔离导致模块找不到**：pnpm 的 isolated 模式默认仅将聚合包放置在顶层，部分子包可能被嵌套收敛，导致 `dsh web` 启动时报错 `Cannot find package '@linxin666/dsh-...'`。若遇到此情况，可在 profile 目录的 `pnpm-workspace.yaml` 中添加配置 `nodeLinker: hoisted`（或 `public-hoist-pattern: ['@linxin666/*']`）后重新安装。

> **构建脚本被拦截 (ERR_PNPM_IGNORED_BUILDS)**：这三项审批必须在首次 add 之前就位。正确顺序是重置 profile（官方 `--from-default-profile web`）或换新 profile，在 `<profile>/pnpm-workspace.yaml` 里把三项写成映射，再执行 add：
>
> ```yaml
> allowBuilds:
>   cloudflared: true
>   cpu-features: true
>   ssh2: true
````

</details>

#### 缺口

- 未获取 npm 包转换和固定宿主运行环境的字节与结果
  **影响**：不能保证同版图或任何制品可安装
  **进一步探讨**：比对发布物实际依赖与 profile 锁，再逐条核对代表组件可加载

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 退役行和诊断路由怎样处理旧配置与加载失败？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

旧 profile 若加载保留的 git-graph 子路径且 config.plugin 命中生成的 retired 列表，shell 跳过导入并保持空行。新生成补丁不带活跃图谱行，说明旧能力不再由根载具提供。对通过旧 shell 包裹的其他行，导入失败、入口形状不对和启动失败会记入 degraded，后续延迟启动还可从纤程状态记录。新版生成的其他组件直接挂真实包，不能借旧 shell 代码推断错误全部有隔离和诊断。更新增加 degraded 路由 auth anonymous，内部仍限制直接 socket 为回环，外部直连返回 403，代理转发是否保留边界要看部署。兼容移动侧栏也在发现 data-mobile-nav 时让出事件处理，减少已有移动插件的抽屉冲突。故障报告和这一 DOM 兼容改动均待真实宿主对照。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:7-19](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/package.json#L7-L19)

git-graph 子路径仍可解析。

<details>
<summary>查看原文（13行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./shell": "./lib/shell.js",
    "./degraded": "./lib/degraded.js",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json",
    "./community-plugins": "./lib/shells/shell.js",
    "./git-graph": "./lib/shells/shell.js",
    "./plugin-manager": "./lib/shells/shell.js",
    "./skill-explorer": "./lib/shells/shell.js",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/retired-plugins.generated.ts:14-25](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/retired-plugins.generated.ts#L14-L25)

退役子路径与包名的登记。

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

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:409-449](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/shell.ts#L409-L449)

已退役静默跳过及旧 shell 的导入/挂载处理。

<details>
<summary>查看原文（41行）</summary>

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
    const plugin = (mod as { default?: unknown; apply?: unknown })?.default ?? mod
    if (typeof plugin !== 'function' && !(typeof plugin === 'object' && plugin !== null && typeof (plugin as { apply?: unknown }).apply === 'function')) {
      recordDegraded(spec, 'shape', new Error(`module has no usable plugin shape (expected a function or { apply })`))
      return
    }
    try {
      // Sync application errors (invalid config, throwing apply) escape the
      // ctx.plugin() call itself; async ones settle on the returned fiber.
      // Both paths are captured here so the shell fiber never fails.
      const fiber = ctx.plugin(plugin as Parameters<Context['plugin']>[0], family)
      mounted = { spec, config: family, dispose: fiber.dispose, fiber: watchable(fiber) }
      void Promise.resolve(fiber).then(
        () => {},
        error => recordDegraded(spec, 'start', error),
      )
    } catch (error) {
      recordDegraded(spec, 'start', error)
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shell.ts:462-475](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/shell.ts#L462-L475)

延迟失败的纤程检查。

<details>
<summary>查看原文（14行）</summary>

```text
  // A settings edit on this entry commits the new config into the reference
  // and reaches the family plugin through this listener, not through a remount.
  ctx.on('loader/volatile-update', () => { void schedule() })
  ctx.on('internal/status', (fiber: unknown) => {
    const current = mounted
    if (current?.fiber === undefined || !isNestedFiber(current.fiber, fiber)) return
    recordDeferredStartFailure(current.spec, current.fiber)
  })
  // A plugin that injects services starts LATER than this mount call: cordis
  // creates its fiber PENDING and runs the body only once every injected
  // service exists. A failure in that body therefore lands after the promise
  // above has already resolved, so the fiber's own lifecycle transitions are
  // watched as well. Transitions are rare and `await()` settles without
  // throwing for a fiber that is still waiting, so a healthy row costs nothing.
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/src/shell.ts:131-150](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/shell.ts#L131-L150)

新版授权声明与 socket 回环判断。

<details>
<summary>查看原文（20行）</summary>

```text
function makeDegradedRoute(): WebRoute {
  const route: AuthAwareWebRoute = {
    kind: 'exact',
    path: '/api/dsh-web-all/degraded',
    // Self-fenced strictly by loopback socket address (127.0.0.1 / ::1); keep
    // reachable on hosts whose webServer defaults unspecified routes to auth: 'required'.
    auth: 'anonymous',
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
  return route
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:409-422](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/client/index.ts#L409-L422)

移动导航已有标记时让出处理。

<details>
<summary>查看原文（14行）</summary>

```text
function installMobileSidebarDismiss(frame: HTMLElement): () => void {
  let raf = 0
  const onClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 768px)').matches) return
    const sidebar = frame.querySelector<HTMLElement>('[data-pane="sidebar"]')
    if (sidebar !== null && sidebar.closest('[data-mobile-nav]') !== null) return
    const toggle = frame.querySelector<HTMLElement>('[data-dsh-responsive-part="sidebar-toggle"]')
    if (!frame.hasAttribute('data-sidebar-collapsed') && sidebar !== null && !sidebar.contains(target)) {
      event.preventDefault()
      event.stopPropagation()
      toggle?.click()
      return
```

</details>

**依据 7 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:13-35](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/cordis.patch.yml#L13-L35)

新聚合行直接加载真实组件。

<details>
<summary>查看原文（23行）</summary>

```text
# from ../dsh-web-settings
- insert:
    - id: web-ui-settings
      name: '@linxin666/dsh-client-ui-web-ui-settings'

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'

# from ../dsh-plugin-manager (patch row ui-settings-plugins)
- id: ui-settings-plugins
  disabled: true

# from ../dsh-market
- insert:
    - id: web-ui-market
      name: '@linxin666/dsh-client-ui-market'

# from ../dsh-task-board
- insert:
    - id: web-ui-task-board
      name: '@linxin666/dsh-client-ui-task-board'
```

</details>

#### 缺口

- 未测试旧 profile、缺失直挂包及回环反向代理组合
  **影响**：无实际整个宿主容错或对外诊断范围承诺
  **进一步探讨**：在隔离宿主中分别模拟旧退役行、缺少的正常行和代理访问

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 代表性子包有哪些可观察的新版行为？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

代表性子包和根包应分别验收。Browser View 的会话方法遇到底层传输已关闭且服务未 dispose 时尝试重建并再调用一次；如果第一次可能已有页面副作用，回放仍需查状态。Skill Explorer 的启停路径要求重新扫描解析同一技能身份后才修改 frontmatter，成功再试着失效缓存并发出管理器变化；刷新失败被吞，写成功不能证明客户端菜单已更新。用量适配 MiniMax 从 general 记录的 remaining 百分比换算已用百分比，只在周状态开启且字段合法时拼周窗口。字段可读与实时账户额度、计费准确性要靠服务实测。上述是固定子包入口能追到的变化，不能保证 npm 解析必定装到相同子包源码。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:72-80](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/cordis.patch.yml#L72-L80)

技能和用量在聚合中的真实入口。

```text
# from ../dsh-skill-explorer
- insert:
    - id: web-ui-skill-explorer
      name: '@linxin666/dsh-client-ui-skill-explorer'

# from ../dsh-usage
- insert:
    - id: web-ui-usage
      name: '@linxin666/dsh-usage'
```

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:108-118](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/cordis.patch.yml#L108-L118)

浏览器观察入口及组件默认开关。

<details>
<summary>查看原文（11行）</summary>

```text
# from ../dsh-browser-view
- insert:
    - id: web-ui-browser-view
      name: '@linxin666/dsh-client-ui-browser-view'

# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-browser-view/src/host/service.ts:1067-1079](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-browser-view/src/host/service.ts#L1067-L1079)

断开后只重试一次的回路。

<details>
<summary>查看原文（13行）</summary>

```text
   * Run one operation against a live session; if a reused transport closes
   * mid-command, recycle the dead session and replay once so transient socket
   * drops self-heal in-flight (#2051).
   */
  private async runWithSession<T>(operation: () => Promise<T>): Promise<T> {
    const session = await this.requireSession()
    try {
      return await operation()
    } catch (error) {
      if (!session.transport.closed || this.disposed) throw error
      await this.requireSession()
      return await operation()
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:355-370](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-skill-explorer/src/routes.ts#L355-L370)

作用身份重核、写入及缓存变化。

<details>
<summary>查看原文（16行）</summary>

```text
          const payload = body as Record<string, unknown>
          const { name, path, enabled } = payload
          if (typeof name !== 'string' || !isSkillName(name) || typeof path !== 'string' || path.trim() === '' || typeof enabled !== 'boolean') {
            writeJson(res, 400, { error: 'expected { name, path, enabled }' })
            return
          }
          // The client path is only an identity claim: a fresh scan must
          // resolve the same effective skill before any file is touched.
          const skill = await resolveScannedSkill(name, path, panelCwd(), res)
          if (skill === undefined) return
          // Disabled = disable-model-invocation: true; enabled = false.
          const frontmatter = setFrontmatterField(skill.path, 'disable-model-invocation', !enabled)
          notifySkillCatalogChanged()
          writeJson(res, 200, {
            name,
            enabled: frontmatter.disableModelInvocation !== true,
```

</details>

**依据 5 · 源码核查**：[packages/dsh-skill-explorer/src/routes.ts:236-249](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-skill-explorer/src/routes.ts#L236-L249)

缓存失效和事件发送按尽力完成。

<details>
<summary>查看原文（14行）</summary>

```text
    for (const target of skillTargets) {
      try {
        ;(target as { invalidateCache?(): void }).invalidateCache?.()
      } catch {
        // Cache invalidation stays best-effort after the skill file mutation succeeded.
      }
    }
    try {
      ;(ctx as unknown as {
        emit?(event: string, payload: { reason: 'plugin' }): void
      }).emit?.('plugin-manager/changed', { reason: 'plugin' })
    } catch {
      // Client refresh signals must never turn a committed write into a 500.
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-usage/src/core/adapters.ts:344-371](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-usage/src/core/adapters.ts#L344-L371)

配额来源与归一化字段。

<details>
<summary>查看原文（28行）</summary>

```text
/** MiniMax coding-plan remains: remaining-percent semantics, `general` model entry. */
function minimaxPlan(host: string, ids: readonly string[]): ProviderAdapter {
  return {
    ids,
    displayName: 'MiniMax Coding Plan',
    plan: {
      build: ({ apiKey }) => ({ url: `https://${host}/v1/api/openplatform/coding_plan/remains`, headers: bearer(apiKey) }),
      parse: (status, body) => {
        if (status !== 200 || typeof body !== 'object' || body === null) return undefined
        const remains = (body as Record<string, unknown>).model_remains
        if (!Array.isArray(remains)) return undefined
        const general = remains.find((entry) => typeof entry === 'object' && entry !== null
          && (entry as Record<string, unknown>).model_name === 'general')
        if (typeof general !== 'object' || general === null) return undefined
        const row = general as Record<string, unknown>
        const windows: PlanWindowView[] = []
        const intervalRemaining = toNum(row.current_interval_remaining_percent)
        if (intervalRemaining !== undefined) {
          windows.push({ key: '5h', percent: Math.max(0, Math.min(100, 100 - intervalRemaining)), resetsAt: toIso(row.end_time) })
        }
        if (row.current_weekly_status === 1) {
          const weeklyRemaining = toNum(row.current_weekly_remaining_percent)
          if (weeklyRemaining !== undefined) {
            windows.push({ key: 'week', percent: Math.max(0, Math.min(100, 100 - weeklyRemaining)), resetsAt: toIso(row.weekly_end_time) })
          }
        }
        if (windows.length === 0) return undefined
        return { windows }
```

</details>

#### 缺口

- 未运行以上子包、Chrome 或余额端点
  **影响**：不能把分支逻辑写成任务成功或外部接口当前可用
  **进一步探讨**：在隔离宿主验证重复动作、写入后菜单状态，并用无凭据固定配额数据核对归一化

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署和退出的成本、建议及装配预检怎么验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用新 profile 核对固定入口、目标依赖图及挂载，任选一个设置和一个看板操作观察。首次有下载、重启和解析依赖负担，持续使用涉及组件排障、额外网络能力和配置迁移，失败后需比对旧 profile 与运行状态。若首启出现入口重名、包解析失败或某功能只见配置不见实际窗口，应停用并回到原 profile；旧的用户配置和组件数据要独立确认，不能由关闭聚合推出已复原。建议保留观察，先核对根配置、真实子包和宿主版本。可以试验装配预检，在安装前以指定 profile 解析 patch id、可解析的组件、锁中 npm 版本及退役映射，输出差异后再作进一步操作。用缺依赖、重复行与两版本不同的样例核对能否减少后续排障，不把预检通过当作实机可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:220-245](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/README.md#L220-L245)

作者说明入口、环境及重启。

<details>
<summary>查看原文（26行）</summary>

````text
- 已安装 DeepSeek Harness 且 `dsh web` 可正常启动。
- npm 安装方式无需额外环境；若从源码仓库构建，需要 Node.js >= 24.9 与 pnpm 环境。

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

**依据 2 · 作者声明**：[README.md:348-359](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/README.md#L348-L359)

作者记录安装限制和依赖解析条件。

<details>
<summary>查看原文（12行）</summary>

````text

<br>

> **pnpm 严格依赖隔离导致模块找不到**：pnpm 的 isolated 模式默认仅将聚合包放置在顶层，部分子包可能被嵌套收敛，导致 `dsh web` 启动时报错 `Cannot find package '@linxin666/dsh-...'`。若遇到此情况，可在 profile 目录的 `pnpm-workspace.yaml` 中添加配置 `nodeLinker: hoisted`（或 `public-hoist-pattern: ['@linxin666/*']`）后重新安装。

> **构建脚本被拦截 (ERR_PNPM_IGNORED_BUILDS)**：这三项审批必须在首次 add 之前就位。正确顺序是重置 profile（官方 `--from-default-profile web`）或换新 profile，在 `<profile>/pnpm-workspace.yaml` 里把三项写成映射，再执行 add：
>
> ```yaml
> allowBuilds:
>   cloudflared: true
>   cpu-features: true
>   ssh2: true
````

</details>

**依据 3 · 源码核查**：[scripts/aggregate.mjs:808-832](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/scripts/aggregate.mjs#L808-L832)

重复 ID 及生成类型是可预检的依据。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shell.ts:383-435](https://github.com/zhu1090093659/dsh-web/blob/0af7b234f79e386634fbbfc7e99fd2ebd3ec0d7b/packages/dsh-web-all/src/shell.ts#L383-L435)

旧行覆盖、退役与导入失败会有不同结果。

<details>
<summary>查看原文（53行）</summary>

```text
  const sync = async (): Promise<void> => {
    const raw = liveRowConfig(config)
    const row = isRowConfig(raw) ? raw : undefined
    if (row === undefined) {
      if (raw === undefined) return
      recordDegraded('(no plugin)', 'shape', new Error(`shell row config is not a mapping (row config: ${describeConfig(raw)}); the entry mounted empty`))
      return
    }
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
    const plugin = (mod as { default?: unknown; apply?: unknown })?.default ?? mod
    if (typeof plugin !== 'function' && !(typeof plugin === 'object' && plugin !== null && typeof (plugin as { apply?: unknown }).apply === 'function')) {
      recordDegraded(spec, 'shape', new Error(`module has no usable plugin shape (expected a function or { apply })`))
      return
```

</details>

#### 缺口

- 没有同时验证 Git 根、npm 和独立子包的复原成本
  **影响**：仅可提出流程验证，实际导入与退出仍待确认
  **进一步探讨**：用同样 profile 条件测预检的误放、误报、恢复时间和实际可用行

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
