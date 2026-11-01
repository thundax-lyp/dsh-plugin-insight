# dsh-web-all

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,608](https://img.shields.io/static/v1?label=npm+30d&message=94%2C608&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
<!-- END META -->

> **功能**：将 DSH Web 家族插件组合为可按行配置的聚合安装包。

> **亮点**：[Q02](#research-q02) 将多个插件依赖和行集中到一个 bundle，提供统一组合和可选兼容层；具体功能仍由对应子包实现。

> **主要限制**：[Q03](#research-q03) 当前 patch 直挂子包，旧隔离壳代码不能证明所有行都具故障隔离；默认停用和依赖包含也需分开核对。

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
  - [Q01 · 组件类型、受众和依赖是什么？](#detail-section-11)
  - [Q02 · 装载如何到实际功能入口？](#detail-section-12)
  - [Q03 · 冲突、覆盖、安全和故障边界是什么？](#detail-section-13)
  - [Q04 · 全周期成本与假设是什么？](#detail-section-14)
  - [Q05 · 何人试用及停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要多项家族功能且能管理 profile 的 DSH 用户。

用户也可按需安装独立插件并配置 profile；本次未实测安装或维护成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 聚合 profile | 集中声明插件依赖和 Loader 行 | 各子包实际加载与权限须逐行核查 |
| compat 界面 | 为家族界面补布局钩子和样式 | 不包含子插件客户端实现 |
| 默认停用行 | 保留 SSH 和 Skill Explorer 的按需入口 | 包含依赖不代表已加载 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 和 Web 客户端 | 必需 | 加载 profile bundle 与界面 | 行或界面无法正确挂载 |
| 家族依赖包 | 对应功能必需 | 实际提供各功能 | 聚合配置本身不能代替子包 |
| 各子包权限和数据服务 | 特定功能需要 | Git、远程、存储等 | 功能可能失败或产生各自副作用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile 并列出所需功能 | 明确权限与默认状态 |
| 安装 | 用户在隔离 profile 安装并重启 | 核对实际包版本和 Loader 行 |
| 验收 | 用户逐行检查需要的功能 | 不需要或不明的行保持停用 |
| 恢复 | 用户停用问题行并核对状态 | 必要时恢复 profile 并按需安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多依赖、宿主和存储资源 | 检查功能、权限和配置 | 时间未知 |
| 持续使用 | 子包及可能外部服务资源 | 更新和核对实际启用状态 | 成本与节时未知 |
| 失败恢复 | 备份和重装资源 | 定位问题行、回退配置 | 耗时和恢复效果未知 |
| 退出 | 保留备份空间 | 检查残留配置和数据 | 停用并不删除依赖或数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合配置 | 包依赖和真实插件行 | 用户宿主是否逐行加载成功 |
| 按行控制 | patch 含关闭行，作者描述配置覆盖 | 故障隔离和所有子包停用效果 |

> **思考**：[Q03](#research-q03) 当前 patch 直挂子包，旧隔离壳代码不能证明所有行都具故障隔离；默认停用和依赖包含也需分开核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将多个插件依赖和行集中到一个 bundle，提供统一组合和可选兼容层；具体功能仍由对应子包实现。

[Q02](#research-q02) 当前行指向真实子包而非将全部 UI 内联；[Q03](#research-q03) 旧兼容壳与直接挂载须分别判断，不能凭壳代码推断整体隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 当前 patch 直挂子包，旧隔离壳代码不能证明所有行都具故障隔离；默认停用和依赖包含也需分开核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议备份并在隔离 profile 核对所需行和权限；版本或副作用不明时停止并恢复或改按需安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持聚合组装及兼容层；实际加载、故障隔离与各子功能效果未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-all/README.md、packages/dsh-web-all/README.zh.md、packages/dsh-web-all/package.json、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/src/index.ts、packages/dsh-web-all/src/client/index.ts、packages/dsh-web-all/src/shell.ts、packages/dsh-git-graph/src/index.ts 及固定范围 inventory；组件：packages/dsh-web-all。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查聚合包声明、当前 patch、兼容层及同仓 Git 行代表接线；不审计所有依赖、远程能力或真实安装。 跨组件样本 git-graph 以稳定组件 ID 和相同固定代码指纹登记；其他家族子包未逐个核查。
- 下一步：固定 DSH、聚合与依赖版本，在隔离 profile 检查行配置、代表功能、单行失败、重复挂载及回退。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设安装前逐行展示权限和默认状态可减少多余启用，需以相同需求对照正确率和配置时间，尚未验证。

固定 DSH、聚合与依赖版本，在隔离 profile 检查行配置、代表功能、单行失败、重复挂载及回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 272 | — | — | 5372 |
| .js | source | 7 | 3076 | 2610 | 498 | — |
| .ts | source | 9 | 1372 | 756 | 560 | — |
| .ts | test | 10 | 2017 | 1326 | 542 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查聚合 bundle 如何组合 DSH Web 功能、安装与禁用的边界及各项共享依赖。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组件类型、受众和依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

它是 DSH Web 家族插件的聚合 profile bundle，面向同时需要多个界面和管理功能的用户，不是单一 Skill 或所有子能力的独立实现。子包声明 DSH >=0.2.1-rc.3、Web 客户端和多个插件依赖；固定源码 patch 直接插入各插件行。合格结果是用户明确需要并核查已启用的功能，同时能恢复原 profile；一次安装不表示每一功能均运行。SSH 和 Skill Explorer 在当前 patch 默认关闭，故 README 中“各子插件随本包一起激活”的概括不能作为当前启用清单。未安装或运行宿主。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:1-10](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L1-L10)

聚合包身份和版本。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@linxin666/dsh-web-all",
  "description": "DSH Web UI 全家桶聚合插件：一键安装全部功能插件（task-board / git-graph / pet / web-ui-settings / skin-center / community-plugins / compat shim）。compat 桥接层已并入本包（src/client），无需独立 compat npm 包。",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:107-117](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L107-L117)

宿主版本、bundle 与 Web 入口。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:162-186](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L162-L186)

聚合依赖。

<details>
<summary>查看原文（25行）</summary>

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-team": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
    "@linxin666/dsh-client-ui-git-graph": "workspace:*",
    "@linxin666/dsh-update": "workspace:*",
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
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.13",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.13",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.13",
    "@linxin666/dsh-pet": "^0.4.13"
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:118-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L118-L123)

两个功能默认关闭。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 5 · 作者声明**：[packages/dsh-web-all/README.zh.md:24-33](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L24-L33)

作者描述直挂和按行启停。

<details>
<summary>查看原文（10行）</summary>

```text
## 是什么

- **一次安装、全部到位**：其 dependencies 引入家族的全部子插件包（任务看板 / Git 图谱 / 宠物 / 移动端远程 / 远程桥接 / SSH / 皮肤 / 设置区 / 社区插件 等，完整清单以 `aggregate.yml` 为准），且本分支不内置任何外部 npm 插件。`@mlgbnb/dsh-archive-manager`（社区归档管理：按项目分组、搜索筛选、预览对话、一键恢复与删除）未内置——其上游构建仍 import 已移除的 `@deepseek-ai/dsh-client-runtime` 面。
- **聚合载具**：`cordis.patch.yml` 汇总各子插件的 `insert` 行与外部插件行，经 dsh 插件 profile 机制挂载。外部 profile bundle 由生成器展开：其 patch 行变成可导入的聚合行，bundle 自身的 harness-row patch 原样保留；标记了 `"inactive": true` 的外部行会在产物之后统一追加 `disabled: true` 覆盖行，未主动启用前不会挂载。
- **家族行直挂真实包**：每个家族插件的行 `name` 就是它自己的 npm 包名，官方 `dsh-client-modules` 因此直接下发该包的浏览器半区——装哪个插件就只下载哪个插件的界面，不必为了一块面板承担一份整份副本（issue #1901：旧做法把 13 个家族界面内联进本包 `lib/client.js`，单文件 2.9 MB）。行 id 仍是 `web-ui-*`，老 profile 里的行级开关照样命中；行的 `disabled` 直接由 loader 决定该家族装不装，开关不再需要浏览器端二次门控。旧 profile 里记录的子路径行名（`@linxin666/dsh-web-all/<family>`）仍保留导出空壳，升级后照常解析。
- **compat 是可选补丁层**：`web-ui-compat` 行现在只提供兼容补丁——给当前 shell 打上插件与皮肤依赖的 `data-pane` / `data-dsh-frame` 语义钩子、响应式契约与启动遮罩，不含任何家族插件代码。需要这些补丁时保持开启，不需要时可以在插件管理里按行关掉。
- **插件列表里的自有图标**：本包内置 `icon.svg` 并在 `package.json` 顶层声明 `icon`——官方插件列表（设置 → 插件列表）读取的展示元信息字段，因此已安装卡片与详情页在明暗两种主题下都显示家族鲸鱼，而不是默认插画；家族每个包都带同一份素材，单独安装某一个也会显示。DSH 0.2.1 起子路径元信息经导出资源读取，因此聚合的每个家族行导出 `<family>/icon` 与本地化 `locale/*.json`，家族行显示该家族自己的本地化标题与用途说明，并显示同一份家族图标。
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

</details>

**依据 6 · 作者声明**：[packages/dsh-web-all/README.zh.md:81-84](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L81-L84)

旧概括与实际关闭行需区分。

```text
## 已知限制

- 各子插件随本包一起激活；若只需要其中一部分，请直接安装对应子插件包。
- 聚合行 id 统一带 `web-ui-` 命名空间，本包可与同名独立插件包共存：loader 不再拒绝重复 id，host 半区只注册一次（第二个来源为空操作），浏览器半区按包名去重。两个来源并存没有额外收益，建议只保留一个。插件来自本包时，profile 里按 id 写的配置行要改用 `web-ui-` 前缀（如 remote-web-ui 的 `autoTunnel` 配置行写成 `web-ui-remote-web-ui`）；独立安装时仍用插件原 id。聚合行的配置里 `plugin` 是壳自己的键（该行加载哪个模块），插件自身字段与它平级；设置卡片写出的就是这一形态，手写覆盖必须保留 `plugin`，否则该行什么都不挂载。
```

#### 缺口

- 实际发布包、DSH 版本和 profile 中哪些行已启用
  **影响**：影响功能覆盖和副作用
  **进一步探讨**：隔离 profile 检查解析后的行及实际加载状态

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 装载如何到实际功能入口？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

包清单声明 bundle patch，patch 将 web-ui-git-graph 等行直接指向各自真实插件包，并为 SSH 与 Skill Explorer 追加 disabled。以 Git 图谱行为例，该行指向 Git 插件包；同仓组件 github:1331636953:packages-dsh-git-graph 在固定提交 68a78d05a6c8c27305671cfc42c30cbbec8014f5 的源码中，其 apply 构造 GitService 并注册 /git 路由，因此聚合包负责依赖与组装，实际 Git 行为属于子包。自身浏览器入口只运行 compat 补丁，给 shell 标记布局钩子和响应式样式，并不包含各家族功能的客户端实现。与逐个安装配置相比，它集中依赖和行定义，但真实 Loader 是否解析或运行各包未在本轮验证；源码静态组装不能证明功能可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:107-117](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L107-L117)

bundle patch 声明。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-21](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L8-L21)

compat 与功能行插入。

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

**依据 3 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:52-55](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L52-L55)

Git 图谱行指向真实包。

```text
# from ../dsh-git-graph
- insert:
    - id: web-ui-git-graph
      name: '@linxin666/dsh-client-ui-git-graph'
```

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/index.ts:81-85](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L81-L85)

被插入的 Git 包构造 Git 服务。

```text
export const apply = mountOnce('@linxin666/dsh-client-ui-git-graph', applyImpl)

function applyImpl(ctx: Context, config?: Config): void {
  const service = new GitService(subprocessRunner(ctx), createWorkspaceGate(ctx))

```

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/index.ts:124-132](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L124-L132)

Git 子包注册自身路由和工具。

```text
  ctx.effect(() => {
    syncTool()
    const disposeRoutes = registerGitRoutes(ctx, service, featureConfig)
    return () => {
      disposeRoutes()
      toolFiber?.dispose()
      toolFiber = undefined
    }
  }, 'dsh-git-graph: /git routes + tool')
```

**依据 6 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:507-516](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/src/client/index.ts#L507-L516)

聚合客户端只做 compat，执行标记和样式。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: Context): void {
  // This half is the compat layer only. Every family plugin mounts through its
  // own loader row and brings its own browser half, so nothing is imported or
  // mounted here: the bundle used to carry an inlined copy of all 13 family
  // clients, which made the page download and evaluate 2.9 MB before any
  // family surface could render (issue #1901).
  ctx.effect(() => {
    const responsiveStyle = ensureResponsiveStyle()
    const bootShield = installBootShield()
    applyShims()
```

</details>

#### 缺口

- Loader 对真实依赖的解析和目标宿主中的有效运行
  **影响**：决定各行是否真的提供功能
  **进一步探讨**：固定 DSH 和包版本逐行核查安装、加载和代表功能

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 冲突、覆盖、安全和故障边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

当前 patch 直接指向真实家族包，而 shell.ts 保留基于 config.plugin 动态导入和记录降级的兼容路径；旧源码顶部对每一行都经过隔离壳的描述不能覆盖当前直挂 patch，不能据此宣称所有子包故障都被隔离。聚合关闭一行不等于卸载依赖，升级后还需确认实际解析版本。并装独立包的去重依赖子包的 mountOnce 等机制，必须逐个核对；Git 包确实使用该 guard，但不代表所有家族都已验证。聚合会包含 Git、远程桥等具有各自权限和写副作用的子包；必须以各子包实际配置和宿主授权为准，本次没有安全审计或复现冲突。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-75](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L47-L75)

当前行直接指向真实 Git、更新、远程和 SSH 包。

<details>
<summary>查看原文（29行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-git-graph
- insert:
    - id: web-ui-git-graph
      name: '@linxin666/dsh-client-ui-git-graph'

# from ../dsh-update
- insert:
    - id: web-ui-update
      name: '@linxin666/dsh-update'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

# from ../dsh-ssh
- insert:
    - id: web-ui-ssh
      name: '@linxin666/dsh-ssh'
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/shell.ts:370-400](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/src/shell.ts#L370-L400)

旧壳自有 compat 空配置与 config.plugin 分支。

<details>
<summary>查看原文（31行）</summary>

```text
export async function apply(ctx: Context, config: ShellConfigInput): Promise<void> {
  holdHealthRoutes(ctx)
  let mounted: MountedFamily | undefined
  /** Serializes config syncs: an update may land while a mount is still running. */
  let tail: Promise<void> = Promise.resolve()

  /** Mount the real plugin the current row config names, replacing any previous mount. */
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:419-443](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/src/shell.ts#L419-L443)

旧壳动态导入和记录失败的局部逻辑。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shell.ts:49-52](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/src/shell.ts#L49-L52)

当前家族直挂，Loader 行状态为准。

```text
 * The shell no longer has a row-state surface. Family rows mount their real
 * packages now (issue #1901), so the loader's own entry state is the answer to
 * "is this family mounted", and the browser half has no inlined children left
 * to gate: /api/dsh-web-all/rows and its ledger were removed with the
```

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/index.ts:74-85](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L74-L85)

Git 子包使用 mountOnce，不证明其他包同样正确。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Mount the git service, its routes, and the opt-in tool. The settings page
 * is the Host's own generation from {@link Config}: this half registers no
 * settings section.
 * @param ctx - context carrying webServer, subprocess, and workspaceRegistry.
 * @param config - the row's config as the Host resolved it (live references).
 */
export const apply = mountOnce('@linxin666/dsh-client-ui-git-graph', applyImpl)

function applyImpl(ctx: Context, config?: Config): void {
  const service = new GitService(subprocessRunner(ctx), createWorkspaceGate(ctx))

```

</details>

**依据 6 · 作者声明**：[packages/dsh-web-all/README.zh.md:31-33](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L31-L33)

作者描述默认关闭与按行停用仍随包更新。

```text
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

#### 缺口

- 直接挂载下单个子包失败是否影响整个宿主及并装去重
  **影响**：决定故障隔离和恢复行为
  **进一步探讨**：隔离 profile 构造单行失败与重复安装并检查 Loader 结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期成本与假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

初次聚合可减少逐包选择与依赖配置，但同时引入较广依赖、权限和升级核查；持续成本是检查启用行、实际版本和每项权限，失败时需定位子包、回退 profile。未测同样功能范围下的安装时间、资源占用、故障率和维护成本，不能宣称整体更省。可提出未验证假设：安装前按行展示默认启用状态、数据与权限，并允许选择集合，可能减少多余能力暴露；增加配置步骤与信息维护成本。以同一需求集合比较聚合默认安装与逐包选择，记录用户识别正确率、配置时间和多余启用行；若无改善或信息与实际配置不一致则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/package.json:162-186](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/package.json#L162-L186)

依赖集合。

<details>
<summary>查看原文（25行）</summary>

```text
  "dependencies": {
    "@linxin666/dsh-client-ui-plugin-manager": "workspace:*",
    "@linxin666/dsh-client-ui-market": "workspace:*",
    "@linxin666/dsh-client-ui-task-board": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-github": "workspace:*",
    "@linxin666/dsh-client-ui-task-board-team": "workspace:*",
    "@linxin666/dsh-agents": "workspace:*",
    "@linxin666/dsh-client-ui-git-graph": "workspace:*",
    "@linxin666/dsh-update": "workspace:*",
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
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.13",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.13",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.13",
    "@linxin666/dsh-pet": "^0.4.13"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:118-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L118-L123)

需区分默认关闭与包含在依赖中。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 3 · 作者声明**：[packages/dsh-web-all/README.zh.md:31-33](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L31-L33)

启停及升级负担。

```text
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

#### 缺口

- 同范围安装、更新和故障排查总成本
  **影响**：不能判断聚合是否节时或经济
  **进一步探讨**：在隔离 profile 对照逐包和聚合，记录全部维护时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何人试用及停止？

**研究主题**：采用判断

#### 完整回答

明确需要多个家族功能、能备份 profile 并逐行核权限的 DSH 用户，可在隔离 profile 试聚合包，先确认版本、默认行与各功能的数据去向。集中依赖和配置比逐一组合更方便，但多出的功能不自动等于需求或安全。发现重复挂载、依赖解析不一致、某行停用后仍有作用或无法解释网络和文件副作用时，应停用问题组合，核查 Loader 状态及实际文件，恢复 profile 备份并按需退回固定版本独立包。仅需一项功能的用户可先考察单独安装。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:47-85](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L47-L85)

不同功能行及真实包。

<details>
<summary>查看原文（39行）</summary>

```text
# from ../dsh-agents
- insert:
    - id: web-ui-agents
      name: '@linxin666/dsh-agents'

# from ../dsh-git-graph
- insert:
    - id: web-ui-git-graph
      name: '@linxin666/dsh-client-ui-git-graph'

# from ../dsh-update
- insert:
    - id: web-ui-update
      name: '@linxin666/dsh-update'

# from ../dsh-remote-bridge
- insert:
    - id: web-ui-remote-bridge
      name: '@linxin666/dsh-remote-bridge'

# from ../dsh-task-board-remote
- insert:
    - id: web-ui-task-board-remote
      name: '@linxin666/dsh-task-board-remote'

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

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:118-123](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/cordis.patch.yml#L118-L123)

默认关闭的行。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 3 · 作者声明**：[packages/dsh-web-all/README.zh.md:31-33](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L31-L33)

启停与独立包维护说明。

```text
- **host-only 子插件**：Windows 私有 shell 插件（`dsh-win-bash`，行 `web-ui-win-bash`）不带浏览器半区，并把它自己的平台守卫一路带进聚合 patch，因此在任何非 Windows 宿主上该行都是 disabled、不产生任何开销。它的可用性还跟随梁神预设的声明：`liangshen` 行停用时，工具不注册并如实记录原因。
- **按需开启行**：低频家族插件在聚合包中出厂默认关闭（目前是 SSH、skill-explorer，即 `aggregate.yml` 的 `inactive` 清单；liangshen 不在该清单内，梁神模式拨杆在新装环境即在位）。它们不加载、设置入口也不出现，需要时在 设置 → 插件 → 插件管理 中按行开启；独立包安装不受影响。聚合行还可携带与独立包默认值不同的播种配置（`patches` 清单），用户改动设置后以设置为准。
- **逐行管理**：每个家族插件都可单独启停——设置 → 插件 → 插件管理 中本包行展开为子插件列表，逐行开关即时写入 profile 覆盖层。停用的行由 loader 直接跳过：它既不挂载，也不再向浏览器下发自己的界面。停用即不再加载，代码仍随全家桶更新；需要独立版本管理的插件可另行安装独立包（双挂载保护下独立安装优先）。
```

**依据 4 · 作者声明**：[packages/dsh-web-all/README.zh.md:63-65](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-web-all/README.zh.md#L63-L65)

升级时解析链接核查提示。

```text
### 手工升级

在 profile 的 `package.json` 中改版本后执行 `pnpm install`，顶层 `node_modules/@linxin666/*` 条目不会总是被刷新：它们可能仍链接到旧版本的 store 目录，直到手动重建。升级后请确认这些链接已指向新版本目录（Windows 下：先 `cmd /c rmdir <链接>` 再 `cmd /c mklink /J <链接> <目标>`），然后重启 `dsh web`。
```

#### 缺口

- 隔离 profile 的安装、停用和恢复是否符合预期
  **影响**：决定能否进入正式使用
  **进一步探讨**：执行具体版本的逐行加载、停用及回退验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
