# dsh-deep-whale · 鲸鱼娘皮肤合集

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7029aaa](https://github.com/Small-tailqwq/dsh-deep-whale/tree/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1)

<!-- BEGIN META -->
[![GitHub ★ 2,989](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C989&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale)
<!-- END META -->

> **功能**：汇集两套 DSH 鲸鱼娘主题与皮肤管理器，提供选包、互斥切换和个性化设置入口。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的贡献是把多主题选包、互斥配置、精确版本放行及官方默认退路组织到一套配合使用的组件中。根是合集资源，不是第四个可安装插件，不增加模型任务能力。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) 单文件rename与逐写补偿不能保证两层配置和实际界面同时完成；客户端已有标记确认，但标记出现也不证明输入可用。版本豁免仅接受风险，不能替代主题/宿主组合的交互验证。

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
  - [Q01 · 合集交付什么，谁需要它，实际安装单位是什么？](#detail-section-11)
  - [Q02 · 管理器如何保证互斥，写入失败会怎样？](#detail-section-12)
  - [Q03 · 版本放行和退出承担什么兼容及成本？](#detail-section-13)
  - [Q04 · 能否把配置成功与界面可用分开验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向喜欢角色主题、需要在 DSH Web/桌面界面切换多套皮肤的个人用户，根仓库提供选包导航，实际能力由独立主题和管理器子包交付。

默认界面无需主题维护；手工两层配置能实现互斥，但需理解覆盖顺序。合集把选包与管理入口集中，不能因此认定每个人需要多主题。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题选包导航 | 找到两主题和管理器 | 根是资源合集，安装按子包 |
| 互斥主题切换 | 使目标主题开启、其他关闭 | 依赖两层配置写入与宿主消费 |
| 多启用初态处理 | 冲突时尝试返回官方 | 启动写失败只记错，不保证强制互斥 |
| 精确版本风险放行 | 对指定皮肤/宿主组合接受风险 | 需宿主服务，放行不等于兼容验收 |
| 主题标记等待 | 处理配置异步应用 | 不检查完整用户任务可用性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 独立主题子包 | 主题展示必需 | 实际外观与交互 | 根目录不能替代安装包 |
| skin-manager | 多套主题必需，单套可选 | 设置、互斥及图形化放行 | 多套同时开启可能叠加；已安装后应保持启用 |
| 正确 profile 与两配置层写权限 | 切换必需 | 持久化 disabled 状态 | 写入异常返回错误，可能需人工恢复 |
| DSH/React/Cordis | 按子包声明 | 宿主、界面与生命周期 | 不能用管理器范围代替主题范围 |
| 宿主 pluginManager 服务 | 版本豁免必需 | 精确版本风险授权 | 服务缺失则放行失败 |
| 素材使用条件及正确发行 | 按主题核对 | 美术使用与样式契约 | 不叠装dsh-web适配版与standalone |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选包 | 用户核对 profile/发行，选择主题与是否需要管理器 | 根仅作导航，保存默认退路 |
| 安装 | 按子包说明安装并首次重启 | 多套保持管理器启用 |
| 切换 | 管理器写两层配置，宿主消费，客户端观察标记 | 还需用户核对输入/阅读/设置，不仅看响应ok |
| 失败退出 | 选官方默认，设置不可达则备份后按README修两层配置 | 回读配置并重开默认界面，未知状态不继续叠主题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多包及图片下载，金额/资源量未知 | 选包、profile/发行/素材核对和重启，耗时未知 | 根不提供一键整体包 |
| 持续使用 | 绘制、缓存与管理器活动，资源量未知 | 多包版本维护及交互复查，耗时未知 | 无任务提效对照 |
| 失败恢复 | 重新加载/重装的资源未知 | 回默认、回读两配置及排查冲突 | 补偿不涵盖所有崩溃/并发情况 |
| 退出 | 关闭主题，可能另处理图标/配置 | 保存并恢复原配置，工作量未知 | 真实还原未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一选包 | 根包表和安装路径明确 | 实际采用需求强度 |
| 多主题互斥 | 状态合成、安全初态及两层写入 | 崩溃/并发/宿主运行结果 |
| 版本风险说明 | 精确版本豁免入口及409拒绝 | 豁免后视觉与交互兼容 |
| 异步切换确认 | body标记等待和超时退路 | 输入、阅读与全部资源可用 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 单文件rename与逐写补偿不能保证两层配置和实际界面同时完成；客户端已有标记确认，但标记出现也不证明输入可用。版本豁免仅接受风险，不能替代主题/宿主组合的交互验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的贡献是把多主题选包、互斥配置、精确版本放行及官方默认退路组织到一套配合使用的组件中。根是合集资源，不是第四个可安装插件，不增加模型任务能力。

[Q02](#research-q02) 原件读取、单文件落盘、逐写补偿及官方默认目标有明确职责；客户端用标记等待处理异步配置消费，比固定延时更可解释。跨文件崩溃一致性和外部并发不由该补偿保证，移植须重新核对配置覆盖顺序、锁和宿主图更新。完整inventory含源/打包产物及两主题，不等于根独立代码规模。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 单文件rename与逐写补偿不能保证两层配置和实际界面同时完成；客户端已有标记确认，但标记出现也不证明输入可用。版本豁免仅接受风险，不能替代主题/宿主组合的交互验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 根合集用于观察和选包，先以一套具体主题试用，不把根URL当整体插件安装。多套必须保持管理器启用；切换后核对输入、阅读与设置，叠加或失配时回官方默认，不能把版本放行当验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持选包入口、互斥写入、补偿、版本风险确认及主题标记等待；未执行真实宿主切换或中断恢复。任务可用性确认是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、skin-manager/src/index.ts、skin-manager/package.json、skin-manager/src/compatibility.ts、skin-manager/src/client/SkinManager.tsx、skin-manager/src/client/switch-settle.ts、skin-manager/tests/switch-settle.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根合集、skin-manager切换/兼容/客户端确认代表链路及README；主题美术与全部交互未穷尽，不执行目标，不将根集合统计当单一插件。
- 下一步：按 [Q04](#research-q04) 在备份隔离profile对照现有标记确认与任务确认，记录错误成功提示、恢复时间和人工负担；另外演练两文件之间中断与补偿失败。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：未声明（[固定提交 7029aaa](https://github.com/Small-tailqwq/dsh-deep-whale/tree/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是在现有异步标记确认后，用明确用户任务区分“配置已写”与“界面可用”，重点覆盖版本豁免和失败恢复。若未降低错误成功提示，或额外操作超过恢复收益，应保留现状。

按 [Q04](#research-q04) 在备份隔离profile对照现有标记确认与任务确认，记录错误成功提示、恢复时间和人工负担；另外演练两文件之间中断与补偿失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 156 | 138 | 4 | — |
| .md | source | 19 | 1909 | — | — | 33654 |
| .js | source | 7 | 12837 | 11565 | 1562 | — |
| .ts | source | 77 | 12374 | 9726 | 1847 | — |
| .ts | test | 54 | 12883 | 10784 | 870 | — |
| .md | example | 1 | 19 | — | — | 160 |
| .tsx | source | 2 | 1170 | 1024 | 81 | — |
| .tsx | example | 1 | 48 | 41 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：合集如何支持主题选择和可退出切换，哪些配置与兼容边界使整体安装承诺不成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 合集交付什么，谁需要它，实际安装单位是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根仓库是两套鲸鱼娘主题与一个皮肤管理器的合集入口，实际安装单位是 maid-atelier、orca-link 和 skin-manager 子目录对应的包。固定仓库根没有 package.json，不应把根 URL 当作第四个原生插件。本研究的根条目类型为 resource，子包的插件形态不自动变成根包的类型。主题面向视觉偏好用户，管理器面向已经需要切换多套皮肤或调整主题选项的人。

默认 DSH 界面已完成模型任务，单主题也不一定需要独立管理器；README 明确单套时管理器可选，多套时须保持管理器启用。对照手工修改两层 disabled 配置，合集贡献在于提供一处选包导航和配套互斥治理，而非新增模型能力。管理器按已安装主题的 wiring ID 管理启停，官方默认作为不启用任何主题的目标。其价值条件是用户确实需要换主题，否则额外包和配置并不必需。

合格结果是选择某套主题后只有该主题生效，同时还能返回默认界面并继续输入阅读。作者预览可说明外观目标，不能证明个人舒适度、采用人数或任务效率。根条目的推荐也应针对读者选包，而不能写成已经安装了一个整体产品。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-22](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/README.md#L16-L22)

根列出两个主题与独立管理器包，支持合集定位。

```text
## 住户

| 皮肤 | 包名 | 说明 | 许可 |
|---|---|---|---|
| [maid-atelier](maid-atelier/) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` | 深海女仆工坊：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [orca-link](orca-link/) | `@smalltailqwq/dsh-client-ui-skin-orca-link` | 虎鲸链路：酷酷的小黑鲸操作员，全直角界面加用直线重绘的图标；亮色机能，暗色治愈 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [skin-manager](skin-manager/) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` | 皮肤管理器：切换已安装的皮肤，调整各皮肤自带的选项，在「设置 → 皮肤管理」中打开 | MIT |
```

**依据 2 · 作者声明**：[README.md:40-61](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/README.md#L40-L61)

安装按子包进行，单套/多套条件及桌面 profile 区分。

<details>
<summary>查看原文（22行）</summary>

````text
1. 按需选择一套或多套皮肤。打开侧栏「插件」，点击「添加插件」，逐个填入下面对应的 npm 包名并安装。

   | 插件 | npm 包名 |
   |---|---|
   | [maid-atelier](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` |
   | [orca-link](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-orca-link) | `@smalltailqwq/dsh-client-ui-skin-orca-link` |
   | [皮肤管理器](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-deep-whale-manager) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` |

2. **只装一套皮肤**时，管理器可选；不装就无法使用配置面板、图形化版本兼容放行和自动多皮肤互斥管理。**同时装多套皮肤必须安装并保持管理器启用**，否则皮肤同时启用会让界面错乱。管理器一旦安装，即使只用一套皮肤也应保持启用。安装完成后按提示启用插件，然后**重启一次 DSH**。
3. 如果安装了皮肤管理器，重启后打开「设置 → 皮肤管理」。首次启动若仍显示官方界面，到这里选择要启用的皮肤即可。

想用 `main` 上的最新代码，也可以按所选皮肤和管理器，在同一个安装框里逐个填入对应的 GitHub 地址（只填地址，不加 `dsh plugin add`）：

```text
github:Small-tailqwq/dsh-deep-whale#main&path:/skin-manager
github:Small-tailqwq/dsh-deep-whale#main&path:/maid-atelier
github:Small-tailqwq/dsh-deep-whale#main&path:/orca-link
```

在默认配置下，DSH 捆绑的 pnpm 11.7.0 优先选择发布满 24 小时的 npm 版本。想立即安装某个刚发布的新版，可以在同一个「添加插件」框里填入 `包名@^版本号`，例如 `@smalltailqwq/dsh-client-ui-skin-orca-link@^0.1.9`（不加命令前缀）。这次显式 `add` 会安装新版，并把具体版本写入 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`，依赖仍保持 caret 范围。此行为对应捆绑版本及默认配置，其他 pnpm 版本或自定义策略可能不同。GitHub 来源不受这项 npm 包龄检查影响。

桌面版通过应用管理自己的 `desktop` profile，不需要先配置 `dsh` 命令。下面的 `web` 命令不会给桌面版安装皮肤。
````

</details>

**依据 3 · 源码核查**：[skin-manager/src/index.ts:883-901](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L883-L901)

实际有效状态读取和多主题初态回官方，支持主题治理增量。

<details>
<summary>查看原文（19行）</summary>

```text
/** Return installed skins that are effectively enabled after profile then home overrides. */
export function enabledSkins(sources: string[], catalog: SkinCatalogEntry[]): SkinCatalogEntry[] {
  const states = new Map<string, boolean>()
  for (const source of sources) {
    for (const [id, disabled] of readSkinStates(source, catalog)) states.set(id, disabled)
  }
  return catalog.filter(skin => states.get(skin.wiringId) !== true)
}

/** Fail safe when a direct marketplace install would otherwise activate multiple skins. */
export function ensureSafeInitialState(
  patchPaths = resolvePatchTargets(),
  catalog = discoverInstalledSkins(patchPaths[0]),
): boolean {
  if (catalog.length < 2) return false
  const sources = patchPaths.map(path => existsSync(path) ? readFileSync(path, 'utf8') : '')
  if (enabledSkins(sources, catalog).length < 2) return false
  useSkin('official', patchPaths, catalog)
  return true
```

</details>

#### 缺口

- 缺少独立使用者切换频率与结果材料
  **影响**：不能把合集数量或外观预览当需求强度与效率收益
  **进一步探讨**：向明确需要多主题的用户比较手工配置与管理器，记录切换错误、恢复时间和视觉偏好。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 管理器如何保证互斥，写入失败会怎样？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

管理器宿主入口取得当前 profile 的配置路径及 home 覆盖层，扫描已安装皮肤；启动时如果两层有效状态合成后同时启用至少两套主题，就调用 useSkin(official) 关闭主题。这个检查有 try/catch，失败会记录错误但继续注册路由，因此它是尝试建立安全初态，不是启动失败也能保证互斥。路由检查同源请求，POST 目标只能是 official 或已发现主题；调用 useSkin 后返回 ok，不能将这个响应解释为渲染已完成。

useSkin 读取两份原件，计算带管理标记的下一状态，逐文件用临时文件、fsync 和 rename 替换。如果后一次写入抛错，会逆序尝试恢复已经写过的原件。这是有价值的补偿设计，避免普通异常直接留下第一层新状态，但不是跨文件原子事务。源码所查写入链没有跨进程比较版本或持久恢复日志；进程在两次写之间退出、外部编辑者并发修改或补偿自身失败的结果尚不能保证。不能从单文件 rename 推出两层和界面都同时成功。

客户端没有单纯固定延时当成功。requestSkinSwitch 先观察 body 上已安装皮肤的标记，再 POST；桌面等待精确目标出现，Web 在标记首次变化后重载，12秒没有变化也会走重载退路。此机制覆盖宿主配置观察与客户端图的异步延迟，却只代表主题标记变化。输入框可点击、图片全部就绪、默认图标恢复和长期视觉可用不是该谓词判断的内容。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/src/index.ts:790-847](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L790-L847)

单文件原子替换与多文件逐次写入/补偿的具体范围。

<details>
<summary>查看原文（58行）</summary>

```text
export function switchPatch(source: string, target: SkinTarget, catalog: SkinCatalogEntry[]): string {
  const owned = new Set(catalog.map(skin => skin.wiringId))
  const stripped = stripManagedBlock(source, owned).replace(/\s+$/, '')
  /* A top-level empty sequence (`[]`) can never coexist with the rows appended below. */
  const emptySequence = /^\[\]\s*(?:#.*)?$/
  const lines = stripped.split(/\r?\n/)
  const unmanaged = lines.some(line => emptySequence.test(line))
    ? lines.filter(line => !emptySequence.test(line)).join('\n').replace(/\s+$/, '')
    : stripped
  return `${unmanaged === '' ? '' : `${unmanaged}\n\n`}${renderManagedBlock(target, catalog)}\n`
}

/** Atomically replace a single profile patch, leaving the original intact on failure. */
function atomicWrite(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true })
  const temporary = joinPath(dirname(path), `.${basename(path)}.${process.pid}.${Date.now()}.tmp`)
  let fd: number | undefined
  try {
    fd = openSync(temporary, 'wx', 0o600)
    writeFileSync(fd, text, 'utf8')
    fsyncSync(fd)
    closeSync(fd)
    fd = undefined
    renameSync(temporary, path)
  } finally {
    if (fd !== undefined) closeSync(fd)
    if (existsSync(temporary)) rmSync(temporary, { force: true })
  }
}

/** Persist one discovered target in both live layers. */
export function useSkin(
  target: SkinTarget,
  patchPaths = resolvePatchTargets(),
  catalog = discoverInstalledSkins(patchPaths[0]),
): void {
  if (target !== 'official' && !catalog.some(skin => skin.id === target)) {
    throw new Error(`skin-not-installed: ${target}`)
  }
  const originals = patchPaths.map(path => ({
    path,
    existed: existsSync(path),
    source: existsSync(path) ? readFileSync(path, 'utf8') : '',
  }))
  const next = originals.map(original => switchPatch(original.source, target, catalog))
  const written: typeof originals = []
  try {
    originals.forEach((original, index) => {
      atomicWrite(original.path, next[index]!)
      written.push(original)
    })
  } catch (error) {
    for (const original of written.reverse()) {
      if (original.existed) atomicWrite(original.path, original.source)
      else rmSync(original.path, { force: true })
    }
    throw error
  }
```

</details>

**依据 2 · 源码核查**：[skin-manager/src/index.ts:883-901](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L883-L901)

按两层状态决定多启用初态是否切官方。

<details>
<summary>查看原文（19行）</summary>

```text
/** Return installed skins that are effectively enabled after profile then home overrides. */
export function enabledSkins(sources: string[], catalog: SkinCatalogEntry[]): SkinCatalogEntry[] {
  const states = new Map<string, boolean>()
  for (const source of sources) {
    for (const [id, disabled] of readSkinStates(source, catalog)) states.set(id, disabled)
  }
  return catalog.filter(skin => states.get(skin.wiringId) !== true)
}

/** Fail safe when a direct marketplace install would otherwise activate multiple skins. */
export function ensureSafeInitialState(
  patchPaths = resolvePatchTargets(),
  catalog = discoverInstalledSkins(patchPaths[0]),
): boolean {
  if (catalog.length < 2) return false
  const sources = patchPaths.map(path => existsSync(path) ? readFileSync(path, 'utf8') : '')
  if (enabledSkins(sources, catalog).length < 2) return false
  useSkin('official', patchPaths, catalog)
  return true
```

</details>

**依据 3 · 源码核查**：[skin-manager/src/index.ts:1041-1062](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L1041-L1062)

目标验证、写入调用与返回状态，未等待真实渲染完成。

<details>
<summary>查看原文（22行）</summary>

```text
        const target = typeof body === 'object' && body !== null
          ? (body as { target?: unknown }).target
          : undefined
        if (target !== 'official' && !catalog.some(skin => skin.id === target)) {
          throw new Error('invalid-skin-target')
        }
        // The host keeps an out-of-range skin disabled whatever the patch says,
        // so switching to it needs the user's explicit, exact-version grant.
        const compatibility = catalog.find(skin => skin.id === target)?.compatibility
        if (compatibility !== undefined && !compatibility.exempted) {
          if ((body as { acceptRisk?: unknown }).acceptRisk !== true) {
            json(res, 409, { ok: false, error: 'incompatible-version', compatibility })
            return
          }
          await grantExemption(compatibility)
        }
        applyTarget(target as SkinTarget, catalog)
        desktopIcon?.follow(target as SkinTarget)
        json(res, 200, { ok: true, target })
      } catch (error) {
        json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
      }
```

</details>

**依据 4 · 源码核查**：[skin-manager/src/index.ts:1068-1089](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L1068-L1089)

启动互斥异常仅记录，并继续注册服务。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: HostContext): void {
  const profilePatch = resolveRuntimeProfilePatch(ctx.baseUrl)
  const patchPaths = patchTargetsForProfile(profilePatch)
  const catalog = (): SkinCatalogEntry[] => discoverInstalledSkins(profilePatch)
  ctx.effect(() => {
    try {
      ensureSafeInitialState(patchPaths, catalog())
    } catch (error) {
      console.error('[skin-manager] failed to enforce startup mutual exclusion', error)
    }
    const desktopIcon = desktopIconControl(profilePatch, patchPaths, catalog)
    const unregister = ctx.webServer.register(makeSkinManagerRoute(
      catalog,
      (target, installed) => useSkin(target, patchPaths, installed),
      () => discoverSkinDirectories(profilePatch),
      compatibility => grantThroughHost(ctx, compatibility),
      desktopIcon?.control,
    ))
    return () => {
      unregister()
      desktopIcon?.dispose()
    }
```

</details>

**依据 5 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:1059-1085](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/client/SkinManager.tsx#L1059-L1085)

客户端观察、POST、桌面精确目标和Web重载行为。

<details>
<summary>查看原文（27行）</summary>

```text
export async function requestSkinSwitch(target: SkinTarget, acceptRisk = false): Promise<void> {
  const catalog = await fetchSkinCatalog()
  const desktop = isDesktopShell()
  const before = activeSkins(catalog, document.body).join(',')
  const isTarget = (active: string[]): boolean => target === 'official'
    ? active.length === 0
    : active.length === 1 && active[0] === target
  const cancel = new AbortController()
  // Web reloads at the first change (old skin removed or new one added); the
  // desktop shell waits until the requested skin is mounted in place.
  const settled = waitForSkins(catalog, desktop ? isTarget : active => active.join(',') !== before, document, undefined, cancel.signal)
  try {
    const response = await fetch(SKIN_MANAGER_ROUTE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(acceptRisk ? { target, acceptRisk: true } : { target }),
    })
    const result = await response.json() as { ok?: boolean, error?: string }
    if (!response.ok || result.ok !== true) throw new Error(result.error ?? `HTTP ${response.status}`)
  } catch (error) {
    cancel.abort()
    throw error
  }
  // A switch that never starts applying still falls back to a reload.
  if (await settled && desktop) return
  window.location.reload()
```

</details>

**依据 6 · 源码核查**：[skin-manager/src/client/switch-settle.ts:16-56](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/client/switch-settle.ts#L16-L56)

只观察主题 body 属性并在超时/中止时返回 false。

<details>
<summary>查看原文（41行）</summary>

```text
/** Upper bound for the Host to start applying the patch. */
export const SWITCH_SETTLE_TIMEOUT_MS = 12_000

/** Desktop-shell pages receive their boot graph through this preload bridge. */
export function isDesktopShell(target: object = window): boolean {
  return 'dshDesktopBoot' in target
}

/** Ids of the skins whose body attribute is currently present, in catalog order. */
export function activeSkins(catalog: readonly SkinCatalogEntry[], body: HTMLElement): string[] {
  return catalog.filter(skin => body.hasAttribute(skin.bodyAttr)).map(skin => skin.id)
}

/**
 * Resolve once the mounted skins satisfy `done`, checked on every change of
 * a catalog body attribute.
 * @returns false when that did not happen within the timeout.
 */
export function waitForSkins(
  catalog: readonly SkinCatalogEntry[],
  done: (active: string[]) => boolean,
  doc: Document = document,
  timeoutMs = SWITCH_SETTLE_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<boolean> {
  return new Promise((resolve) => {
    let timer: number | undefined
    const observer = new MutationObserver(() => {
      if (done(activeSkins(catalog, doc.body))) finish(true)
    })
    const abort = (): void => { finish(false) }
    const finish = (settled: boolean): void => {
      observer.disconnect()
      if (timer !== undefined) window.clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      resolve(settled)
    }
    observer.observe(doc.body, { attributes: true, attributeFilter: catalog.map(skin => skin.bodyAttr) })
    timer = window.setTimeout(() => finish(false), timeoutMs)
    signal?.addEventListener('abort', abort, { once: true })
  })
```

</details>

#### 缺口

- 未验证跨进程并发、两文件之间中断及补偿失败
  **影响**：不能承诺配置原子切换或故障后自行恢复
  **进一步探讨**：在备份 profile 的隔离实例注入第二次写失败、进程中断和并发修改，回读两层配置与实际主题状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 版本放行和退出承担什么兼容及成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

皮肤与管理器的版本声明必须分开看，管理器 peer 为 Cordis ^4.0.1、React >=18、DSH >=0.1.7-rc.1，而皮肤各有自己的支持范围。版本评估模块读取宿主启动包版本，并把不满足 peer 的皮肤标为待豁免；无法解析宿主布局时返回未知而不猜版本。路由对未豁免的皮肤先返回 409，只有 acceptRisk=true 才通过宿主 pluginManager 的精确包版本与宿主版本豁免入口放行；管理器不自行写 compatibility.json。

这个机制避免把界面显示“启用”误当宿主实际准入，但豁免只是用户接受版本风险，不是已通过交互验收。对稳定工作环境，合理流程是先选正确发行和 profile、只装需要的子包，首次重启后选主题；多套必须保持管理器启用，升级后重核输入与弹窗，不把放行按钮当默认升级办法。若选中主题没有生效、两个主题叠加或输入阅读受影响，应先返回官方默认；设置入口不可达时按 README 的两层配置方法恢复，操作前保存原件。

成本包括首次下载多包与图片、核对素材条件和 profile、持续绘制与版本维护、失败后回读两层配置及可能重装。金额、CPU/内存和人工耗时未知，不能以无模型调用写成免费或零负担。作者给出不同桌面/Web 更新说明，本次仅按固定说明记录，不将其中宿主行为宣称为已独立验证。

因此根入口作观察与选包参考；真正试用应落在一套具体主题，按该主题的条件检查。合集层没有一份能覆盖全部主题、管理器及宿主组合的运行结果，不应将根整体升级为已验证安装建议。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/package.json:48-56](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/package.json#L48-L56)

管理器自己的 peer 范围与主题的范围不同。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "react": ">=18",
    "@deepseek-ai/dsh": ">=0.1.7-rc.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": {
      "optional": true
    }
```

**依据 2 · 源码核查**：[skin-manager/src/compatibility.ts:24-44](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/compatibility.ts#L24-L44)

未知宿主布局不猜运行版本。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * The running DSH version, read from the launcher's own `dsh-app-boot`
 * manifest, which is what the host compares against. Resolved from the
 * process entry, so it holds for npm and linked installations; hosts laid out
 * differently (for example a packaged desktop runtime) yield undefined, and
 * callers then make no compatibility claim.
 */
export function readDshRuntimeVersion(entry: string | undefined = process.argv[1]): string | undefined {
  if (cachedRuntime !== undefined && cachedRuntime.entry === entry) return cachedRuntime.version
  let version: string | undefined
  try {
    if (entry !== undefined && entry !== '') {
      const manifest = createRequire(entry).resolve('@deepseek-ai/dsh-app-boot/package.json')
      const value = (JSON.parse(readFileSync(manifest, 'utf8')) as { version?: unknown }).version
      if (typeof value === 'string' && valid(value) !== null) version = value
    }
  } catch {
    // Unknown layout: no claim rather than a guess.
  }
  cachedRuntime = { entry, version }
  return version
```

</details>

**依据 3 · 源码核查**：[skin-manager/src/compatibility.ts:69-94](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/compatibility.ts#L69-L94)

按 peer 范围和精确版本豁免评估。

<details>
<summary>查看原文（26行）</summary>

```text
export function evaluateSkinCompatibility(
  manifest: unknown,
  runtimeVersion: string,
  exemptions: Readonly<Record<string, readonly string[]>>,
): SkinCompatibility | undefined {
  if (manifest === null || typeof manifest !== 'object') return undefined
  const { name, version, peerDependencies } = manifest as { name?: unknown, version?: unknown, peerDependencies?: unknown }
  if (peerDependencies === null || typeof peerDependencies !== 'object' || Array.isArray(peerDependencies)) return undefined
  const peers: Record<string, string> = {}
  for (const [peer, range] of Object.entries(peerDependencies as Record<string, unknown>)) {
    if (peer !== '@deepseek-ai/dsh' && !peer.startsWith('@deepseek-ai/dsh-')) continue
    if (typeof range !== 'string') {
      peers[peer] = String(range)
      continue
    }
    const requirement = ['workspace:^', 'workspace:~', 'workspace:*'].includes(range) ? runtimeVersion : range
    if (requirement.trim() === '' || !satisfies(runtimeVersion, requirement, { includePrerelease: true })) peers[peer] = range
  }
  if (Object.keys(peers).length === 0 || typeof name !== 'string' || typeof version !== 'string') return undefined
  const key = `${name}@${version}`
  return {
    package: key,
    runtimeVersion,
    peers,
    exempted: exemptions[key]?.includes(runtimeVersion) === true,
  }
```

</details>

**依据 4 · 源码核查**：[skin-manager/src/index.ts:44-53](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L44-L53)

豁免经宿主服务，结果失败继续抛错。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Grant through the host so its file lock, validation and reload apply; the
 * manager never writes `compatibility.json` itself.
 */
async function grantThroughHost(ctx: HostContext, compatibility: SkinCompatibility): Promise<void> {
  const service = (ctx as unknown as { get(name: string): unknown }).get('pluginManager') as VersionExemptionService | undefined
  if (service === undefined || typeof service.setVersionExemption !== 'function') throw new Error('exemption-unavailable')
  const result = await service.setVersionExemption(compatibility.package, compatibility.runtimeVersion, true, true)
  if (result.error !== undefined) throw new Error(result.error.diagnostic || result.error.code)
  if (result.application === 'failed') throw new Error('exemption-failed')
```

</details>

**依据 5 · 源码核查**：[skin-manager/src/index.ts:1047-1055](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/index.ts#L1047-L1055)

未确认风险时409，明确 acceptRisk 才授予。

```text
        // The host keeps an out-of-range skin disabled whatever the patch says,
        // so switching to it needs the user's explicit, exact-version grant.
        const compatibility = catalog.find(skin => skin.id === target)?.compatibility
        if (compatibility !== undefined && !compatibility.exempted) {
          if ((body as { acceptRisk?: unknown }).acceptRisk !== true) {
            json(res, 409, { ok: false, error: 'incompatible-version', compatibility })
            return
          }
          await grantExemption(compatibility)
```

**依据 6 · 作者声明**：[README.md:103-115](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/README.md#L103-L115)

单主题、管理器持续启用和作者更新操作边界。

<details>
<summary>查看原文（13行）</summary>

````text
装好后**重启一次 DSH**。如果装了管理器，打开「设置 → 皮肤管理」，在想用的皮肤上点「切换」。之后换皮肤都是即时生效，不用再重启。

- 只装一套皮肤时，可以删掉另一套皮肤和管理器的 `add`；不装管理器就无法使用配置面板、图形化版本兼容放行和自动多皮肤互斥管理。管理器一旦安装就应保持启用；同时装多套皮肤必须安装并保持管理器启用，避免皮肤同时启用。
- 两套都装了的话，首次重启后界面还是官方默认的样子，这是正常的：两套皮肤同时启用会互相打架，管理器会先把它们都关掉，等你来选。
- 不想自己敲命令，可以把这句话发给任意 AI（或 DSH 本身），它会按 [INSTALL.md](INSTALL.md) 帮你装好：

  ```
  读取 https://github.com/Small-tailqwq/dsh-deep-whale/INSTALL.md 并按其中的指引安装本仓库皮肤
  ```

## 更新

**桌面版：**截至 DSH 0.2.0-rc.2，插件页没有升级入口，也不会自动更新第三方插件。在「插件」列表卸载要更新的插件，再按上面的步骤重新安装并启用，完成后重启 DSH。
````

</details>

**依据 7 · 作者声明**：[README.md:208-217](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/README.md#L208-L217)

两配置层与手动恢复的作者说明。

<details>
<summary>查看原文（10行）</summary>

```text
同一时间只能启用一套皮肤；皮肤管理器本身不算皮肤，安装后需要一直开着。同时安装多套皮肤时，必须安装并保持管理器启用来管理互斥。

每套皮肤的开关记录在两个配置文件里：`~/.dsh/profiles/<profile>/cordis.patch.yml`（profile 层，`<profile>` 为 `web` 或桌面版的 `desktop` 等实际名称）和 `~/.dsh/cordis.patch.yml`（home 层，优先级更高）。文件里没有写某套皮肤时，它默认是**开启**的，所以一次装两套又从没切换过，它们就会同时运行，导致界面错乱。

皮肤管理器会处理这件事：

- 每次启动时，如果发现有两套以上皮肤同时开着，会把它们全部关掉、回到官方默认，已经选好的单套皮肤不受影响；
- 在「设置 → 皮肤管理」里切换时，会自动把开关写进两个配置文件并即时生效。

管理器用不了时，可以手动修改。把下面的内容**同时**加到上面两个文件里，想启用哪套，就把哪套设为 `false`，另一套设为 `true`：
```

</details>

#### 缺口

- 各皮肤/管理器/宿主组合的真实切换、退出和资源成本未测
  **影响**：不能对合集给全组合兼容或低负担保证
  **进一步探讨**：先在备份实例只装一套主题，再逐步增加第二套并记录冲突、恢复与维护投入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否把配置成功与界面可用分开验证？

**研究主题**：新假设与验证

#### 完整回答

可检验的假设是把管理器已存在的“配置请求成功”和“主题标记出现”之后，再增加以用户任务为单位的可用性确认，尤其用于用户主动豁免版本的情形。现有 switch-settle 与 jsdom 测试已经检查开始切换、忽略官方中间态、目标出现、超时和请求失败中止；不能把它描述为完全没有异步确认。本假设的增量是确认输入、设置与表格阅读真正能完成，而不是再次等待一个属性。

最小实验在相同备份 profile、相同对话和宿主版本上比较当前切换提示与附加任务确认。场景包含正常切换、配置未被宿主消费、标记出现但输入区域被样式遮挡，以及两层写入中断。记录错误成功提示、任务完成率、恢复到默认所需时间和额外操作次数；故障只在隔离副本注入。检测到任务受损时建议用户回默认，不应未经授权自动覆盖未知配置。

若新增确认仅重复已有标记检测、未降低错误成功提示，或操作负担明显抵消恢复收益，就否定该方案。没有当前实验结果，不能把任务确认计为已有功能或主张用户会愿意额外点击。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/src/client/switch-settle.ts:24-56](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/client/switch-settle.ts#L24-L56)

现有机制只使用body属性和谓词判断。

<details>
<summary>查看原文（33行）</summary>

```text
/** Ids of the skins whose body attribute is currently present, in catalog order. */
export function activeSkins(catalog: readonly SkinCatalogEntry[], body: HTMLElement): string[] {
  return catalog.filter(skin => body.hasAttribute(skin.bodyAttr)).map(skin => skin.id)
}

/**
 * Resolve once the mounted skins satisfy `done`, checked on every change of
 * a catalog body attribute.
 * @returns false when that did not happen within the timeout.
 */
export function waitForSkins(
  catalog: readonly SkinCatalogEntry[],
  done: (active: string[]) => boolean,
  doc: Document = document,
  timeoutMs = SWITCH_SETTLE_TIMEOUT_MS,
  signal?: AbortSignal,
): Promise<boolean> {
  return new Promise((resolve) => {
    let timer: number | undefined
    const observer = new MutationObserver(() => {
      if (done(activeSkins(catalog, doc.body))) finish(true)
    })
    const abort = (): void => { finish(false) }
    const finish = (settled: boolean): void => {
      observer.disconnect()
      if (timer !== undefined) window.clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      resolve(settled)
    }
    observer.observe(doc.body, { attributes: true, attributeFilter: catalog.map(skin => skin.bodyAttr) })
    timer = window.setTimeout(() => finish(false), timeoutMs)
    signal?.addEventListener('abort', abort, { once: true })
  })
```

</details>

**依据 2 · 源码核查**：[skin-manager/tests/switch-settle.spec.ts:16-52](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/tests/switch-settle.spec.ts#L16-L52)

已有测试含开始、目标、超时与中止，限定新假设的实际增量。

<details>
<summary>查看原文（37行）</summary>

```text
describe('skin switch settling', () => {
  it('notices the first change once the Host starts applying a switch', async () => {
    document.body.setAttribute('data-maid', '')
    const before = activeSkins(catalog, document.body).join(',')
    const started = waitForSkins(catalog, active => active.join(',') !== before)
    // Unrelated body attributes are not a switch.
    document.body.setAttribute('data-other', '')
    document.body.removeAttribute('data-maid')
    await expect(started).resolves.toBe(true)
  })

  it('ignores the intermediate official frame when waiting for the requested skin', async () => {
    document.body.setAttribute('data-maid', '')
    const seen: string[][] = []
    const mounted = waitForSkins(catalog, (active) => {
      seen.push(active)
      return active.length === 1 && active[0] === 'deepcel'
    })
    document.body.removeAttribute('data-maid')
    await Promise.resolve()
    document.body.setAttribute('data-deepcel', '')
    await expect(mounted).resolves.toBe(true)
    expect(seen).toEqual([[], ['deepcel']])
  })

  it('reports a switch that never starts within the timeout', async () => {
    vi.useFakeTimers()
    const started = waitForSkins(catalog, () => true, document, 1000)
    vi.advanceTimersByTime(1000)
    await expect(started).resolves.toBe(false)
  })

  it('stops waiting when the switch request fails', async () => {
    const cancel = new AbortController()
    const started = waitForSkins(catalog, () => true, document, 60_000, cancel.signal)
    cancel.abort()
    await expect(started).resolves.toBe(false)
```

</details>

**依据 3 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:1063-1085](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/skin-manager/src/client/SkinManager.tsx#L1063-L1085)

Web/桌面不同确认条件，解释为什么标记变化不等于完整任务可用。

<details>
<summary>查看原文（23行）</summary>

```text
  const isTarget = (active: string[]): boolean => target === 'official'
    ? active.length === 0
    : active.length === 1 && active[0] === target
  const cancel = new AbortController()
  // Web reloads at the first change (old skin removed or new one added); the
  // desktop shell waits until the requested skin is mounted in place.
  const settled = waitForSkins(catalog, desktop ? isTarget : active => active.join(',') !== before, document, undefined, cancel.signal)
  try {
    const response = await fetch(SKIN_MANAGER_ROUTE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(acceptRisk ? { target, acceptRisk: true } : { target }),
    })
    const result = await response.json() as { ok?: boolean, error?: string }
    if (!response.ok || result.ok !== true) throw new Error(result.error ?? `HTTP ${response.status}`)
  } catch (error) {
    cancel.abort()
    throw error
  }
  // A switch that never starts applying still falls back to a reload.
  if (await settled && desktop) return
  window.location.reload()
```

</details>

#### 缺口

- 无任务确认的用户收益和额外负担对照
  **影响**：不能确认应加新确认步骤或自动回退
  **进一步探讨**：比较错误成功提示和恢复投入，若无净改善就保留现有流程。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
