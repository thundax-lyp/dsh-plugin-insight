# DSH Web All

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all)

<!-- BEGIN META -->
[![GitHub ★ 10,524](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C524&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 96,508](https://img.shields.io/static/v1?label=npm+30d&message=96%2C508&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
<!-- END META -->

> **功能**：在 DSH Web 与桌面 profile 聚合安装家族插件，并提供界面兼容层。

> **亮点**：[Q01](#research-q01) 与 [Q05](#research-q05) 表明，聚合把依赖及稳定行 ID 集中管理，同时让实际成员沿独立包出口加载，兼容客户端只承担公共布局适配。它减少重复拼装配置的步骤，不替成员完成业务验收。

> **主要限制**：[Q02](#research-q02) 显示当前成员直挂不受旧壳的错误捕获保护；[Q03](#research-q03) 显示可用界面还依赖宿主 DOM 与平台条件。旧消息编辑路径没有退役壳，升级前应核对残留覆盖。

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
  - [Q01 · 一个聚合安装到底固定了哪些成员和开关？](#detail-section-11)
  - [Q02 · 当前成员是否经过壳隔离，旧配置怎样失败？](#detail-section-12)
  - [Q03 · 兼容层什么时候改变布局，又什么时候必须让位？](#detail-section-13)
  - [Q04 · 聚合升级和失败恢复的工作是否小于逐包管理？](#detail-section-14)
  - [Q05 · 哪些工程机制可以借鉴，迁移成本是什么？](#detail-section-15)
  - [Q06 · 挂载预览应怎样避免把“已安装”写成“已可用”？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多个 profile 需要同组家族扩展的管理员可集中维护依赖和挂载行；合格结果须是所需能力加载且可退回原配置。[Q01](#research-q01) 区分安装与启用。

原办法是按需逐包安装并独立固定版本。只需要少量成员或要错峰升级时，单包保留更小的联动范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 成员组合配置 | 集中声明家族依赖及挂载行 | 当前成员直挂，部分默认停用 |
| 界面兼容层 | 公共布局、语义标记及启动提示 | 依赖宿主DOM，窄屏排除Windows标题栏 |
| 历史壳路径 | 旧子路径动态挂载及记录降级 | 只保护进入壳的模块，已移除路径不适用 |
| 本机降级查询 | 查看壳记录的错误 | 仅socket回环检查，不表示所有成员健康 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.3 与对应 Web/桌面 profile | 必需 | 应用bundle和客户端 | 不能视为兼容加载 |
| 成员依赖可解析 | 启用该成员时 | 真实包host/client | 由宿主处理直挂失败 |
| DOM语义及平台标记 | 兼容层所需 | 布局与导航适配 | 可能局部失配 |
| 原profile与版本备份 | 试用所需 | 恢复和退出 | 故障时难以回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员复制profile并列所需成员 | 原配置和版本可恢复 |
| 加载 | 走对应宿主安装渠道后重启 | 核对真实包行和禁用条件 |
| 验收 | 逐项打开面板并完成代表任务 | 不以安装成功代替能力可用 |
| 恢复 | 先查直挂、壳或删除路径再还原 | 重启后核对剩余成员与界面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖下载和运行资源，费用未知 | 核对成员与profile | 安装和验证耗时未测 |
| 持续 | 整组升级及联网资源未知 | 对账版本、禁用与DOM | 净维护节省未知 |
| 失败恢复 | 重新安装资源未知 | 恢复配置和版本并重启 | 成员数据副作用另行处理 |
| 退出 | 保留所需独立包 | 移除聚合及残留覆盖 | 不自动撤回成员写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 组合配置 | 依赖和真实包挂载集中声明 | 端到端维护节时 |
| 独立开关 | patch支持禁用及平台条件 | 所有成员任务可用性 |
| 公共布局 | 幂等打标与条件CSS | 跨宿主和主题真实兼容 |

> **思考**：[Q02](#research-q02) 显示当前成员直挂不受旧壳的错误捕获保护；[Q03](#research-q03) 显示可用界面还依赖宿主 DOM 与平台条件。旧消息编辑路径没有退役壳，升级前应核对残留覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q05](#research-q05) 表明，聚合把依赖及稳定行 ID 集中管理，同时让实际成员沿独立包出口加载，兼容客户端只承担公共布局适配。它减少重复拼装配置的步骤，不替成员完成业务验收。

[Q05](#research-q05) 可借鉴声明与生成补丁对应、真实包出口、DOM幂等适配和生命周期清理。壳降级账本只说明壳路径状态，迁移必须接入真实加载器且重新验证CSS条件。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示当前成员直挂不受旧壳的错误捕获保护；[Q03](#research-q03) 显示可用界面还依赖宿主 DOM 与平台条件。旧消息编辑路径没有退役壳，升级前应核对残留覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 的单profile试用适合确需同组扩展者。先确认可回退，再核对启用和代表任务；异常时恢复配置并用单包，不靠反复安装掩盖加载失败。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码的聚合与兼容接线；成员运行效果、真实宿主兼容和净维护收益未验证。配置预览是待验证设计。

- 已检查：作者 README、包清单、源码路径 packages/dsh-web-all/package.json、packages/dsh-web-all/README.md、packages/dsh-web-all/cordis.patch.yml、packages/dsh-web-all/aggregate.yml、packages/dsh-web-all/tsdown.config.ts、packages/dsh-web-all/src/index.ts、packages/dsh-web-all/src/shell.ts、packages/dsh-web-all/src/client/index.ts 及固定范围 inventory；组件：packages/dsh-web-all。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定0.4.19组件；核对配置、主/客户端入口、旧壳、实际CSS条件、移除路径与构建映射。逐题证据是定向源码核查，不是全部成员审计。
- 下一步：未执行目标插件、测试或真实宿主；没有把作者性能说明当实测。建议在可重建profile对直挂失败、旧壳和767/768px条件分别对照。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议把依赖、启用、路径和宿主加载结果分列为配置预览，比较它能否减少误诊与重复安装。直挂结果缺失时必须写未知；诊断错误增加或用时不降即否定设计。

未执行目标插件、测试或真实宿主；没有把作者性能说明当实测。建议在可重建profile对直挂失败、旧壳和767/768px条件分别对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 279 | — | — | 5589 |
| .js | source | 10 | 6750 | 5726 | 1095 | — |
| .ts | source | 9 | 1422 | 764 | 601 | — |
| .ts | test | 10 | 2217 | 1457 | 593 | — |
| .ts | example | 4 | 52 | 22 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 141](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=141&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 143](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=143&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同组扩展跨多个profile部署时，聚合安装、实际挂载和界面兼容各能保证到哪一步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一个聚合安装到底固定了哪些成员和开关？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

聚合包适合在多个 DSH Web 或桌面 profile 维护同组家族扩展的管理员。原办法是逐包安装、补挂载行和核对版本；本包把依赖与稳定的 web-ui-* 行放进一个 bundle patch，安装者仍要决定哪些成员启用。当前成员按真实包名直接挂载，SSH 与 Skill Explorer 默认 disabled，Windows Bash 由平台条件跳过非 Windows。因而“依赖已装”“行已启用”和“任务可用”是三件事，作者的“一装全开”应结合可选项阅读。

清单要求 DSH >=0.2.2-rc.3，版本为 0.4.19；主仓成员用 workspace 关联，四个卫星成员使用 ^0.4.19 范围，所以一次安装不等于对所有分发字节做不可变锁定。当前 patch 和依赖均没有消息编辑组件；aggregate 清单明确已删除该包，也不保留对应旧子路径空壳。旧 profile 若仍手写该路径，不能期待退役壳自动吞掉错误。只需一两个插件或要独立固定成员版本时，逐包安装依然更容易控制。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.md:26-33](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/README.md#L26-L33)

作者给出聚合目的、直挂、可选项与独立版本取舍。

```text
- **One install, everything on**: its dependencies pull in the 18 in-repository sub-plugin packages and the 4 satellite repository packages (`aggregate.yml` is the complete list), while bundling no external third-party npm plugins. `@mlgbnb/dsh-archive-manager` (the community archive manager) is not bundled because its upstream build still imports the removed `@deepseek-ai/dsh-client-runtime` surface.
- **Aggregation carrier**: `cordis.patch.yml` aggregates the `insert` lines of each sub-plugin plus the external plugin rows, mounted through the dsh plugin profile mechanism. External profile bundles are expanded by the generator: their patch rows become importable aggregate rows, the bundle's own harness-row patches are preserved, and an external row marked `"inactive": true` gains trailing `disabled: true` overrides so nothing mounts until you opt in.
- **Family rows mount the real packages**: each family row's `name` is the plugin's own npm package, so the official `dsh-client-modules` serves that package's browser half directly — enabling one panel downloads one panel, instead of one copy of every family UI (issue #1901: the old shape inlined 13 family clients into this package's `lib/client.js`, a single 2.9 MB file). Row ids stay `web-ui-*`, so per-row switches recorded in an existing profile keep applying, and the row's own `disabled` now decides the family at the loader — no browser-side gate is needed. Subpath row names an older profile recorded (`@linxin666/dsh-web-all/<family>`) still resolve to a compat shell export after the upgrade.
- **Compat is the optional patch layer**: the `web-ui-compat` row now only ships compatibility patches — the `data-pane` / `data-dsh-frame` semantic hooks plugins and skins rely on, the responsive contract, and the boot splash — and no family plugin code. Keep it on when you need those patches; it can be switched off per row in the plugin manager.
- **Its own icon in the plugin list**: the package ships `icon.svg` and declares it as the top-level `package.json.icon`, the display-metadata field the official Plugins list (Settings → Plugins) reads, so the installed card and detail page show the family whale in both themes instead of the default artwork. Every family package ships the same asset, so a standalone install of one shows it too. DSH 0.2.1 reads subpath metadata through exported resources instead of a nested package.json, so each aggregate family row exports `<family>/icon` plus localized `locale/*.json` metadata, displaying each family's own localized title and purpose description alongside the family icon.
- **Host-only child**: the Windows private-shell plugin (`dsh-win-bash`, row `web-ui-win-bash`) ships no browser half and carries its own platform guard into the aggregate patch, so its row is disabled on every non-Windows host and costs nothing there. Its availability follows the platform guard and the shipped payload verification only: once that payload verifies, the tool registers on a supported Windows x64 host whether or not the LiangShen preset is enabled.
- **Opt-in rows**: low-usage family plugins ship disabled by default in the aggregate (currently SSH and skill-explorer — the `inactive` list in `aggregate.yml`; liangshen stays out of it, so the LiangShen mode lever is present on a fresh install). They never load and their settings entries stay hidden until you enable the row under Settings → Plugins → Plugin manager; the standalone packages are unaffected. Bundle rows can also ship a seed config that differs from the standalone default (the `patches` list); a settings edit wins once made.
- **Per-row management**: every family plugin toggles individually — under Settings → Plugins → Plugin manager this package's row expands into a child list with one switch per family plugin, written to the profile override layer. A disabled row is skipped by the loader itself: it neither mounts nor serves its browser half to the page. A disabled child is never loaded while its code still updates with the bundle; install the standalone package when a plugin needs independent versioning (a standalone install wins over the aggregate row).
```

**依据 2 · 源码核查**：[packages/dsh-web-all/package.json:107-127](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/package.json#L107-L127)

最低宿主版本与bundle/client绑定。

<details>
<summary>查看原文（21行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "tsdown",
    "test": "vitest run",
    "prepare": "tsdown",
    "typecheck": "tsgo --noEmit",
    "watch": "tsdown --watch"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.3"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/package.json:162-185](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/package.json#L162-L185)

主仓与卫星依赖范围。

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
    "@linxin666/dsh-win-bash": "workspace:*",
    "@linxin666/dsh-client-ui-web-ui-settings": "workspace:*",
    "@linxin666/dsh-i18n": "workspace:*",
    "@linxin666/dsh-client-ui-diagrams": "workspace:*",
    "@linxin666/dsh-client-ui-browser-view": "workspace:*",
    "@linxin666/dsh-client-ui-community-plugins": "^0.4.19",
    "@linxin666/dsh-client-ui-preset-center": "^0.4.19",
    "@linxin666/dsh-client-ui-skin-center": "^0.4.19",
    "@linxin666/dsh-pet": "^0.4.19"
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:87-113](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/cordis.patch.yml#L87-L113)

平台条件和默认禁用行。

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

**依据 5 · 源码核查**：[packages/dsh-web-all/aggregate.yml:55-65](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/aggregate.yml#L55-L65)

消息编辑移除且不保留空壳的明确范围。

<details>
<summary>查看原文（11行）</summary>

```text
  - ../dsh-ssh
  - ../dsh-liangshen
  - ../dsh-skill-explorer
  - ../dsh-usage
  - ../dsh-session-archive
  # dsh-message-edit 已彻底移除（包目录删除，消息编辑并重发不再提供）：聚合不再挂载它
  # 的行、也不再依赖它；它没有 tombstones 子路径与 shell-metadata 展示资源，因此不留
  # 退役空壳，老 profile 里残留的行名在 import 阶段硬报错。
  # dsh-win-bash 是 host-only 包（无 src/client/）：win_bash 的可用性只跟随平台与随包
  # 载荷，与是否启用梁神预设无关，注册在 apply 内同步完成。
  - ../dsh-win-bash
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 当前成员是否经过壳隔离，旧配置怎样失败？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

当前生成 patch 的成员行直接命名独立包，宿主加载器因此加载成员自己的 host 和 client；没有 config.plugin，也不经聚合 shell 的动态 import。自带 web-ui-compat 行才命名聚合包，其 host 主入口转交 shell，并以空配置安静返回；这个入口仍维持降级诊断路由。不能因为文件头写“fault-isolation shell”就认定全部成员独立失败隔离。

历史的 /<family> 导出仍指向共享 shell。真正进入该路径时，shell 区分空配置、退役成员和无效配置；有有效 plugin 才动态 import，再检查导出形状并 ctx.plugin 挂载，捕获导入、同步及延后启动失败。配置更新按 Promise 链串行重挂，先释放旧实例。该局部防护不能接住宿主对当前直挂行的导入失败，也不能挽救已不再导出的消息编辑旧路径。

降级端点明确 auth: anonymous，由自己的 socket 地址检查只允许 127.0.0.1/::1；无 webServer 时嵌套注入不启动。它是壳账本的可读入口，不是所有成员健康检查，也不对同机进程建立用户身份隔离。若前置代理把远端请求转成回环，仍需部署层控制诊断信息可见性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:8-21](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/cordis.patch.yml#L8-L21)

自身行与真实成员包并列，不设置shell plugin配置。

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

**依据 2 · 源码核查**：[packages/dsh-web-all/src/index.ts:13-21](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/index.ts#L13-L21)

主入口转交shell。

```text
import type { ShellConfigInput } from './shell.ts'

/** Required services: none — the shell must activate before anything else. */
export const inject = [] as const

/** Host plugin body: mount the configured real plugin behind the shell boundary. */
export function apply(ctx: Context, config: ShellConfigInput): Promise<void> {
  return shellApply(ctx, config)
}
```

**依据 3 · 源码核查**：[packages/dsh-web-all/src/shell.ts:376-411](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L376-L411)

空配置、缺包名与退役分支。

<details>
<summary>查看原文（36行）</summary>

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
      return
    }
    if (RETIRED_PLUGINS.has(spec)) {
      // Stale row from an older profile whose plugin has been retired. Mount empty quietly.
      return
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/shell.ts:413-449](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L413-L449)

实际动态加载和局部失败捕获。

<details>
<summary>查看原文（37行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-web-all/src/shell.ts:462-476](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L462-L476)

延后启动失败监听与串行调度。

<details>
<summary>查看原文（15行）</summary>

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
  await schedule()
```

</details>

**依据 6 · 源码核查**：[packages/dsh-web-all/src/shell.ts:131-150](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L131-L150)

匿名端点执行自己的回环地址检查。

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

**依据 7 · 源码核查**：[packages/dsh-web-all/src/shell.ts:177-198](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L177-L198)

webServer就绪后才注册诊断路由。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Hold the health route (degraded) for this shell entry's lifetime. Every
 * shell entry calls this — including the config-less self row — so the route
 * stays up even when every family row is disabled.
 *
 * The shell applies with inject=[] (it must activate before anything else),
 * which means it usually runs BEFORE the web app provides webServer. A direct
 * read at apply time therefore misses the service and the routes would never
 * register — registration instead rides a nested inject fiber that starts
 * when webServer appears and disposes with this entry. Hosts without
 * webServer (some minimal profiles) simply never start the fiber: no routes,
 * no error.
 */
function holdHealthRoutes(ctx: Context): void {
  ctx.inject(['webServer'], (scoped) => {
    const webServer = (scoped as { webServer?: { register(route: WebRoute): () => void } }).webServer
    if (webServer === undefined) return
    const routes = shellState().healthRoutes
    if (routes.count === 0) {
      try {
        const unregisterDegraded = webServer.register(makeDegradedRoute())
        routes.unregister = () => {
```

</details>

#### 缺口

- 固定宿主对直挂导入失败的传播范围未运行核对
  **影响**：不能承诺坏成员不影响宿主或其他成员
  **进一步探讨**：在可重建profile分别构造直挂导入失败与旧壳加载失败，对照宿主日志及剩余界面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容层什么时候改变布局，又什么时候必须让位？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

聚合客户端本身不再内联成员 UI，而是注入响应式 CSS、启动遮罩和 data-pane/data-dsh-frame 语义标记。applyShims 用现有 class 选择器找到侧栏及父框架，幂等写标记；页面结构变化后从共享失效订阅重新检查。框架消失时清掉根上的视口锁标记，避免不存在的布局仍锁住页面。释放阶段退订、移除样式与启动遮罩、移除移动点击监听。

移动规则严格低于 768 CSS px，并排除带 data-windows-titlebar 的桌面壳；恰为 768 px 不进入该移动媒体条件。对带 data-mobile-nav 的框架，兼容层让出抽屉层和遮罩；点击折叠处理也在 Windows 标题栏、非窄屏或专有移动导航存在时返回。这些条件减少两套导航控制器同时决定抽屉的机会，却不等于证明真实页面没有冲突。

采用前仍需核对宿主实际 DOM 和标记来源，样式会使用 !important 与 :has()。选择器失配时可能只标出部分界面；源码不能证明桌面缩放、窄屏、对话框和第三方主题组合都可靠。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:91-107](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L91-L107)

窄屏阈值与Windows标题栏排除。

<details>
<summary>查看原文（17行）</summary>

```text
/* Mobile eligibility mirrors the official layout (ui-layout AppFrame: drawer =
   viewport < SIDEBAR_DRAWER_BREAKPOINT && !windowsTitlebar, breakpoint 768).
   Two guards keep the mobile contract off the Windows desktop shell (#2054):
   the query is strictly below 768 (767.98px, the sub-pixel-safe spelling within
   this sheet's :has() browser floor), so a 125%-scaling split window at exactly
   768 CSS px keeps the official three-column grid; and every rule in both mobile
   blocks carries the zero-specificity :where(html:not([data-windows-titlebar]))
   prefix, because the desktop titlebar shell never enters drawer mode at ANY
   width. :where() adds no specificity, so the 0-3-0 ceiling below is intact. */
@media (max-width: 767.98px) {
  :where(html:not([data-windows-titlebar])) [data-dsh-frame] [data-dsh-responsive-part="sidebar-toggle"] { min-width: 44px; min-height: 44px; }
  :where(html:not([data-windows-titlebar])) [data-dsh-frame] {
    box-sizing: border-box;
    height: 100dvh;
    min-height: 100dvh;
    max-height: 100dvh;
    grid-template-columns: minmax(0, 1fr) !important;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:154-177](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L154-L177)

带移动导航标记时让出抽屉层和遮罩。

<details>
<summary>查看原文（24行）</summary>

```text
  /* When dsh-web-mobile mounts its own navigation controller on the frame
     (marked with data-mobile-nav), yield the compat drawer layer and mask
     without raising specificity above 0-3-0 via zero-specificity :where(). */
  :where(html:not([data-windows-titlebar])) [data-dsh-frame]:where(:not([data-mobile-nav])) [data-pane="sidebar"]:is([data-pane="sidebar"]) {
    position: absolute !important;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: 1100 !important;
    width: min(88vw, 320px) !important;
    max-width: 100%;
    box-shadow: 0 12px 32px rgb(0 0 0 / 24%);
    transform: translateX(0);
    transition: transform 160ms ease;
  }
  /* The mask is the drawer's dimming, never its hit surface. At 1050 with the
     default pointer-events it is a full-frame hit layer, and a pseudo-element's
     hit reports its originating element - so a tap anywhere on the frame
     answered "the frame", which is the shape #2013 reported from inside the
     drawer (every row resolving to the frame) and how a tap meant for the
     conversation under the dimming was swallowed. Dismissal keeps two owners
     and both stay: the official drawer mask the layout paints under its own
     drawer (it closes the drawer through the app), and the capture-phase click
     handler that folds the drawer on any click outside the sidebar. */
  :where(html:not([data-windows-titlebar])) [data-dsh-frame]:where(:not([data-mobile-nav])):not([data-sidebar-collapsed])::after {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:420-438](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L420-L438)

点击处理实际应用相同边界。

<details>
<summary>查看原文（19行）</summary>

```text
function installMobileSidebarDismiss(frame: HTMLElement): () => void {
  let raf = 0
  const onClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return
    // Mirror the official drawer eligibility (ui-layout AppFrame: viewport < 768
    // && !windowsTitlebar). The Windows desktop shell keeps the three-column
    // layout at every width, so the compat drawer must never fold it (#2054).
    if (document.documentElement.hasAttribute('data-windows-titlebar')) return
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 767.98px)').matches) return
    const sidebar = frame.querySelector<HTMLElement>('[data-pane="sidebar"]')
    if (sidebar !== null && sidebar.closest('[data-mobile-nav]') !== null) return
    const toggle = frame.querySelector<HTMLElement>('[data-dsh-responsive-part="sidebar-toggle"]')
    if (!frame.hasAttribute('data-sidebar-collapsed') && sidebar !== null && !sidebar.contains(target)) {
      event.preventDefault()
      event.stopPropagation()
      toggle?.click()
      return
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:472-510](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L472-L510)

DOM打标与根视口锁同步。

<details>
<summary>查看原文（39行）</summary>

```text
function applyShims(): boolean {
  let changed = false
  for (const [selector, attribute] of COLUMN_SHIMS) {
    const el = document.querySelector(selector)
    const eq = attribute.indexOf('=')
    const name = attribute.slice(0, eq)
    const value = attribute.slice(eq + 1).replace(/^"|"$/g, '')
    if (el !== null && el.getAttribute(name) !== value) {
      el.setAttribute(name, value)
      changed = true
    }
  }
  // The frame is the grid item that parents the sidebar column.
  const frame = document.querySelector('[class*="sidebarCol"]')?.parentElement ?? null
  if (frame !== null && frame.getAttribute('data-dsh-frame') !== '') {
    frame.setAttribute('data-dsh-frame', '')
    changed = true
  }
  if (frame !== null) changed = stampSemanticParts(frame) || changed
  // The viewport lock is scoped to this root attribute rather than to
  // `html:has([data-dsh-frame])`; see RESPONSIVE_CSS. It mirrors the frame's
  // presence, so it is cleared again when React replaces the shell and the
  // next pass finds no frame (the lock must never outlive the frame it locks).
  if (syncFrameLock(frame !== null)) changed = true
  return changed
}

/**
 * Mirror the shell frame's presence onto the document root.
 * @param present - whether a stamped frame is currently in the document.
 * @returns whether the root attribute changed.
 */
function syncFrameLock(present: boolean): boolean {
  const root = document.documentElement
  if (root === null) return false
  if (root.hasAttribute(FRAME_LOCK_ATTRIBUTE) === present) return false
  if (present) root.setAttribute(FRAME_LOCK_ATTRIBUTE, '')
  else root.removeAttribute(FRAME_LOCK_ATTRIBUTE)
  return true
```

</details>

**依据 5 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:549-592](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L549-L592)

客户端apply与生命周期清理。

<details>
<summary>查看原文（44行）</summary>

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
    let removeMobileDismiss = (): void => {}
    let dismissFrame: HTMLElement | null = null
    let resolvedFrame: HTMLElement | null = null
    const ensureMobileDismiss = (): void => {
      // The frame element is stable for the page lifetime; re-query only when
      // the cached one is gone. A document.querySelector per mutation batch
      // was paid for every streaming commit even though the answer never
      // changed.
      if (resolvedFrame !== null && !resolvedFrame.isConnected) resolvedFrame = null
      const frame = resolvedFrame ?? document.querySelector<HTMLElement>('[data-dsh-frame]')
      resolvedFrame = frame
      if (frame === null) return
      bootShield.dismiss()
      if (frame === dismissFrame) return
      removeMobileDismiss()
      removeMobileDismiss = installMobileSidebarDismiss(frame)
      dismissFrame = frame
    }
    ensureMobileDismiss()
    // The shell renders after boot settlement and React can re-create the
    // columns on re-render. The hub already coalesces callbacks per frame;
    // scheduling another frame here would delay hooks and leave work alive
    // after this effect is disposed. Attribute writes remain idempotent.
    const unsubscribeBody = subscribeBodyInvalidations(() => {
      applyShims()
      ensureMobileDismiss()
    })
    return () => {
      unsubscribeBody()
      bootShield.remove()
      responsiveStyle.remove()
      removeMobileDismiss()
    }
  })
```

</details>

#### 缺口

- 跨宿主、主题和缩放条件下的实际DOM兼容性未知
  **影响**：挂载成功仍可能没有可用导航或局部布局错乱
  **进一步探讨**：比较同一会话在767/768px、Windows标题栏、有无移动导航控制器下的点击、对话框与退出结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 聚合升级和失败恢复的工作是否小于逐包管理？

**研究主题**：效果与总成本、采用判断

#### 完整回答

对于多个 profile 需要相同成员集合的操作者，聚合减少重复写依赖和挂载行的工作；它同时把版本联动、默认禁用项和布局兼容核对带给维护者。应把一次“合格配置”定义为所需行实际启用、目标功能可完成、宿主可重新启动且能退回原配置，而不是安装命令退出成功。

试用前保留 profile、锁文件和所需成员表，先在可重建副本加载，再逐项确认面板与后台能力。Web CLI 安装后重启；应用内管理的桌面 profile 按作者指引在桌面客户端安装并完整退出重开。失败后先识别真实成员行、旧壳与已移除路径，恢复原配置及版本，再重启回读。只停用兼容行能撤掉该客户端样式，但不撤回成员各自产生的数据或任务副作用，已写入文件也不会因卸载聚合自动恢复。

没有同等成员清单、同一宿主下的端到端维护用时和失败样本，不能断言净节时或启动资源更少。若要独立锁某个成员、旧覆盖无法解析、或导航和宿主启动异常，应停止扩大聚合并退回逐包装配。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-web-all/README.md:35-61](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/README.md#L35-L61)

Web与桌面安装、重启和开发安装条件。

<details>
<summary>查看原文（27行）</summary>

````text
## Install

### From npm (recommended)

**DSH Web CLI (Browser)**:
```sh
dsh plugin --profile web add @linxin666/dsh-web-all@latest
# Restart dsh web
dsh web
```

**Official Desktop Client (DeepSeek Harness Desktop)**:
- Open the official desktop client and navigate to "Settings > Plugins" (or the sidebar plugins view)
- Enter `@linxin666/dsh-web-all` into the install input field and click Install
- Fully quit and restart the desktop client once installation completes

### From the repository (development)

```sh
git clone https://github.com/zhu1090093659/dsh-web.git
cd dsh-web
pnpm run deps:install && pnpm build
node scripts/link-profile.mjs
dsh plugin --profile web add link:$(pwd)/packages/dsh-web-all
```

Restart `dsh web` (or the official desktop client) for the plugins to take effect.
````

</details>

**依据 2 · 作者声明**：[packages/dsh-web-all/README.md:32-33](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/README.md#L32-L33)

默认禁用项与独立版本取舍。

```text
- **Opt-in rows**: low-usage family plugins ship disabled by default in the aggregate (currently SSH and skill-explorer — the `inactive` list in `aggregate.yml`; liangshen stays out of it, so the LiangShen mode lever is present on a fresh install). They never load and their settings entries stay hidden until you enable the row under Settings → Plugins → Plugin manager; the standalone packages are unaffected. Bundle rows can also ship a seed config that differs from the standalone default (the `patches` list); a settings edit wins once made.
- **Per-row management**: every family plugin toggles individually — under Settings → Plugins → Plugin manager this package's row expands into a child list with one switch per family plugin, written to the profile override layer. A disabled row is skipped by the loader itself: it neither mounts nor serves its browser half to the page. A disabled child is never loaded while its code still updates with the bundle; install the standalone package when a plugin needs independent versioning (a standalone install wins over the aggregate row).
```

**依据 3 · 源码核查**：[packages/dsh-web-all/aggregate.yml:59-65](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/aggregate.yml#L59-L65)

移除成员影响旧配置的条件。

```text
  - ../dsh-session-archive
  # dsh-message-edit 已彻底移除（包目录删除，消息编辑并重发不再提供）：聚合不再挂载它
  # 的行、也不再依赖它；它没有 tombstones 子路径与 shell-metadata 展示资源，因此不留
  # 退役空壳，老 profile 里残留的行名在 import 阶段硬报错。
  # dsh-win-bash 是 host-only 包（无 src/client/）：win_bash 的可用性只跟随平台与随包
  # 载荷，与是否启用梁神预设无关，注册在 apply 内同步完成。
  - ../dsh-win-bash
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:582-591](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L582-L591)

兼容层能清理的具体资源边界。

<details>
<summary>查看原文（10行）</summary>

```text
    const unsubscribeBody = subscribeBodyInvalidations(() => {
      applyShims()
      ensureMobileDismiss()
    })
    return () => {
      unsubscribeBody()
      bootShield.remove()
      responsiveStyle.remove()
      removeMobileDismiss()
    }
```

</details>

#### 缺口

- 同等成员负载下的维护时间、资源和恢复时间未测
  **影响**：无法量化聚合相对逐包装配的净收益
  **进一步探讨**：以同样成员在两套profile完成安装、升级、故障恢复和退出，分别记录人工分钟、等待与资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程机制可以借鉴，迁移成本是什么？

**研究主题**：工程质量与复用、贡献与相对优势

#### 完整回答

可借鉴的是把成员声明、生成的宿主补丁、稳定行 ID 和各包自己的浏览器出口对应起来。这样成员的启用由宿主行控制，兼容层只维护共同布局，不把所有成员代码捆进一个浏览器入口。构建配置为兼容主客户端和历史 shell 导出分别产物化，并用 marker 阻止旧壳子路径被客户端扫描器误认作完整客户端。

另一个有限可复用点是基于生命周期的 DOM 适配：幂等打标、框架替换后重新找、集中退订和样式清理。迁移它需要目标宿主的DOM语义、CSS优先级及失效订阅机制，不能直接把选择器当跨宿主协议。shell的降级账本与异步启动监听只适用于真正由shell挂载的模块；把它移植到当前直挂成员，需要先接入宿主加载器的状态，而不是只复制 try/catch。

这些是实现取舍而非全球原创证明。实际体积和启动收益需以相同成员及构建产物对照，作者叙述的历史2.9MB不能当作本次测量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/tsdown.config.ts:1-39](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/tsdown.config.ts#L1-L39)

构建将客户端兼容层与历史shell出口分开。

<details>
<summary>查看原文（39行）</summary>

```text
/**
 * Build config for the dsh-web-all aggregate: node-half lib/ plus the
 * browser bundle lib/client.js (the compat shim alone), same client-bundle
 * preset the family packages keep (shared/tsdown.client.ts). The browser
 * bundle carries no family code: every family row mounts its real package,
 * so its browser half comes from that package's own loader entry (issue
 * #1901). The fault-isolation shell (src/shell.ts + its degraded ledger)
 * ships as additional node-half entries beside lib/index.js — it still backs
 * the compat row and the per-family subpath exports a pre-#1901 profile may
 * record (they resolve to the shared shell re-export lib/shells/shell.js) —
 * and the main entry forwards to the shell, while the standalone
 * `@linxin666/dsh-web-all/shell` subpath stays importable for tests and
 * tooling. The shells marker manifest (src/shells/package.json) is copied
 * next to the re-export: the client module scanner's nearest-package walk
 * must stop there instead of reaching the package root's dsh.client face.
 */
import { clientBundle } from '../../shared/tsdown.client.ts'

export default clientBundle('@linxin666/dsh-web-all', ['src/index.ts'], {
  companions: [
    {
      name: '@linxin666/dsh-web-all/shell',
      // Object entries pin the output paths: the shells re-export must land
      // exactly at lib/shells/shell.js (the exports map and the scanner
      // marker both depend on that location).
      entry: { shell: 'src/shell.ts', degraded: 'src/degraded.ts', 'shells/shell': 'src/shells/shell.ts' },
      outDir: 'lib',
      format: ['esm'],
      platform: 'node',
      target: 'es2024',
      fixedExtension: false,
      dts: false,
      clean: false,
      sourcemap: true,
      external: ['@deepseek-ai/cordis'],
      // copy 'to' is a destination DIRECTORY: this lands the marker exactly
      // at lib/shells/package.json.
      copy: [{ from: 'src/shells/package.json', to: 'lib/shells' }],
    },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:1-21](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/cordis.patch.yml#L1-L21)

声明来源、稳定行ID和真实包名。

<details>
<summary>查看原文（21行）</summary>

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

# from ../dsh-plugin-manager
- insert:
    - id: web-ui-plugin-manager
      name: '@linxin666/dsh-client-ui-plugin-manager'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:472-510](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L472-L510)

幂等打标与视口锁生命周期。

<details>
<summary>查看原文（39行）</summary>

```text
function applyShims(): boolean {
  let changed = false
  for (const [selector, attribute] of COLUMN_SHIMS) {
    const el = document.querySelector(selector)
    const eq = attribute.indexOf('=')
    const name = attribute.slice(0, eq)
    const value = attribute.slice(eq + 1).replace(/^"|"$/g, '')
    if (el !== null && el.getAttribute(name) !== value) {
      el.setAttribute(name, value)
      changed = true
    }
  }
  // The frame is the grid item that parents the sidebar column.
  const frame = document.querySelector('[class*="sidebarCol"]')?.parentElement ?? null
  if (frame !== null && frame.getAttribute('data-dsh-frame') !== '') {
    frame.setAttribute('data-dsh-frame', '')
    changed = true
  }
  if (frame !== null) changed = stampSemanticParts(frame) || changed
  // The viewport lock is scoped to this root attribute rather than to
  // `html:has([data-dsh-frame])`; see RESPONSIVE_CSS. It mirrors the frame's
  // presence, so it is cleared again when React replaces the shell and the
  // next pass finds no frame (the lock must never outlive the frame it locks).
  if (syncFrameLock(frame !== null)) changed = true
  return changed
}

/**
 * Mirror the shell frame's presence onto the document root.
 * @param present - whether a stamped frame is currently in the document.
 * @returns whether the root attribute changed.
 */
function syncFrameLock(present: boolean): boolean {
  const root = document.documentElement
  if (root === null) return false
  if (root.hasAttribute(FRAME_LOCK_ATTRIBUTE) === present) return false
  if (present) root.setAttribute(FRAME_LOCK_ATTRIBUTE, '')
  else root.removeAttribute(FRAME_LOCK_ATTRIBUTE)
  return true
```

</details>

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:549-592](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L549-L592)

共享失效订阅与清理。

<details>
<summary>查看原文（44行）</summary>

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
    let removeMobileDismiss = (): void => {}
    let dismissFrame: HTMLElement | null = null
    let resolvedFrame: HTMLElement | null = null
    const ensureMobileDismiss = (): void => {
      // The frame element is stable for the page lifetime; re-query only when
      // the cached one is gone. A document.querySelector per mutation batch
      // was paid for every streaming commit even though the answer never
      // changed.
      if (resolvedFrame !== null && !resolvedFrame.isConnected) resolvedFrame = null
      const frame = resolvedFrame ?? document.querySelector<HTMLElement>('[data-dsh-frame]')
      resolvedFrame = frame
      if (frame === null) return
      bootShield.dismiss()
      if (frame === dismissFrame) return
      removeMobileDismiss()
      removeMobileDismiss = installMobileSidebarDismiss(frame)
      dismissFrame = frame
    }
    ensureMobileDismiss()
    // The shell renders after boot settlement and React can re-create the
    // columns on re-render. The hub already coalesces callbacks per frame;
    // scheduling another frame here would delay hooks and leave work alive
    // after this effect is disposed. Attribute writes remain idempotent.
    const unsubscribeBody = subscribeBodyInvalidations(() => {
      applyShims()
      ensureMobileDismiss()
    })
    return () => {
      unsubscribeBody()
      bootShield.remove()
      responsiveStyle.remove()
      removeMobileDismiss()
    }
  })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 挂载预览应怎样避免把“已安装”写成“已可用”？

**研究主题**：新假设与验证、采用判断

#### 完整回答

本次形成的待验证假设是，聚合配置预览若逐项显示依赖、有效行、禁用条件、真实加载路径和最后宿主结果，能减少用户把“装了却没界面”误诊成重新安装的问题。这个增量来自三个可见断点：默认禁用、旧壳的空挂载以及已移除路径，并加入兼容层自己的平台条件。它不是本包已经实现的功能。

最小验证可以在同一固定宿主和可重建profile设置四类情况：默认禁用SSH、旧壳漏plugin、直挂包导入失败、旧消息编辑路径已移除。对照现有管理列表与预览，让操作者辨别原因、恢复到可加载配置，记录诊断正确率、人工用时和重复安装次数。界面兼容另需显示宿主DOM条件是否满足，而不能把有包名作为“界面可用”的依据。

若拿不到直挂加载器的真实状态，预览必须写未知；若它增加错误提示或诊断时间没有下降，就放弃扩大该设计。当前采用仍限定为确需同组扩展的管理员在单个可重建profile试用，不把预览假设或聚合依赖视为业务能力验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-web-all/cordis.patch.yml:108-113](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/cordis.patch.yml#L108-L113)

默认禁用提供可重现配置状态。

```text
# inactive by default (opt-in rows): these ship disabled; each is enabled per row in the
# plugin manager, whose enable writes a user-layer "disabled: false" override that wins.
- id: web-ui-ssh
  disabled: true
- id: web-ui-skill-explorer
  disabled: true
```

**依据 2 · 源码核查**：[packages/dsh-web-all/src/shell.ts:384-411](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/shell.ts#L384-L411)

旧壳可能空挂载，不能用存在行推定功能。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-web-all/aggregate.yml:59-65](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/aggregate.yml#L59-L65)

被删除路径不能靠退役空壳恢复。

```text
  - ../dsh-session-archive
  # dsh-message-edit 已彻底移除（包目录删除，消息编辑并重发不再提供）：聚合不再挂载它
  # 的行、也不再依赖它；它没有 tombstones 子路径与 shell-metadata 展示资源，因此不留
  # 退役空壳，老 profile 里残留的行名在 import 阶段硬报错。
  # dsh-win-bash 是 host-only 包（无 src/client/）：win_bash 的可用性只跟随平台与随包
  # 载荷，与是否启用梁神预设无关，注册在 apply 内同步完成。
  - ../dsh-win-bash
```

**依据 4 · 源码核查**：[packages/dsh-web-all/src/client/index.ts:420-431](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-web-all/src/client/index.ts#L420-L431)

平台与导航控制器条件独立于包安装。

<details>
<summary>查看原文（12行）</summary>

```text
function installMobileSidebarDismiss(frame: HTMLElement): () => void {
  let raf = 0
  const onClick = (event: Event): void => {
    const target = event.target
    if (!(target instanceof Element)) return
    // Mirror the official drawer eligibility (ui-layout AppFrame: viewport < 768
    // && !windowsTitlebar). The Windows desktop shell keeps the three-column
    // layout at every width, so the compat drawer must never fold it (#2054).
    if (document.documentElement.hasAttribute('data-windows-titlebar')) return
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(max-width: 767.98px)').matches) return
    const sidebar = frame.querySelector<HTMLElement>('[data-pane="sidebar"]')
    if (sidebar !== null && sidebar.closest('[data-mobile-nav]') !== null) return
```

</details>

#### 缺口

- 预览能否取得真实宿主加载状态及改善诊断尚未知
  **影响**：该设计可能增加新的错误状态而非减少维护负担
  **进一步探讨**：先对四类固定配置作盲测，缺状态明确未知，并比较正确率与恢复用时。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
