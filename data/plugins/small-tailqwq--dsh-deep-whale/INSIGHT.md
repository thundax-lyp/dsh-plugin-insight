# dsh-deep-whale 皮肤合集

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[dc56112](https://github.com/Small-tailqwq/dsh-deep-whale/tree/dc561129f3bb3bc94c4a7c3e4007eaa274650d31)

<!-- BEGIN META -->
[![GitHub ★ 2,879](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C879&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale)
<!-- END META -->

> **功能**：为DSH提供鲸鱼娘主题皮肤合集和已安装皮肤的切换管理器。

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 以稳定wiring、互斥管理和官方退路减少手工主题冲突，贡献在主题治理；根不独立增加模型能力或第四个主题。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) 配置写入补偿不等于视觉事务，兼容豁免不等于输入与布局已验；DOM变化和并发配置仍可能破坏切换。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 根合集如何选择，谁需要管理器？](#detail-section-15)
  - [Q02 · 互斥切换与安全初态怎样实现？](#detail-section-16)
  - [Q03 · 合集治理贡献与升级放行有什么边界？](#detail-section-17)
  - [Q04 · 版本绑定交互验收能否改进兼容放行？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢角色主题、需要按场景切换多套DSH皮肤的人从合集选择独立包。

只用官方主题或手工启停一套皮肤为基线；不宣称提高模型或工程效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 合集路由 | 选择主题与管理器 | 根非单一安装包 |
| 互斥切换 | 避免样式叠加 | 配置补偿非视觉事务 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 匹配DSH与独立皮肤 | 实际展示 | 版本未知先官方 |
| 多皮肤管理器 | 互斥选择 | 保持启用不混发行 |
| 正确profile | 写入目标配置 | 出错先回读配置层 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 选发行与profile | 用户核对无叠装 | 停止重复安装 |
| 安装子包并选择 | 用户确认仅一主题 | 多启用回官方 |
| 核对核心交互与退路 | 用户验证输入/工作台 | 遮挡立即切回 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 主题和管理器下载，未知 | profile/版本/发行核对，未知 |
| 持续 | 绘制与素材缓存，未知 | 多包升级兼容复查，未知 |
| 失败恢复 | 重载与重装资源，未知 | 切官方、配置回读和冲突排查，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 避免多皮肤同时启用 | 安全初态与互斥配置 | 宿主实际切换与并发恢复 |
| 统一主题选择 | 根包表和管理器 | 不证明审美/效率收益 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 配置写入补偿不等于视觉事务，兼容豁免不等于输入与布局已验；DOM变化和并发配置仍可能破坏切换。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 以稳定wiring、互斥管理和官方退路减少手工主题冲突，贡献在主题治理；根不独立增加模型能力或第四个主题。

可借鉴原件保存、逐写补偿和显式官方默认；移植需核对配置层优先级与外部并发，不能把rename当多文件事务。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 配置写入补偿不等于视觉事务，兼容豁免不等于输入与布局已验；DOM变化和并发配置仍可能破坏切换。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 根观察用于选包，单皮肤从最小配置试；多皮肤保持管理器启用，出问题优先官方默认，不默认跨版本放行。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查管理器配置切换与回退；未运行，交互验收清单为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、skin-manager/src/index.ts、maid-atelier/skin.json、skin-manager/package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根合集及manager代表机制，maid/orca艺术与交互未全量运行验收，不把根当单一安装插件。
- 下一步：隔离profile做多启用、写失败及回滚失败注入，并核对各宽度的核心交互，尚未执行。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：未声明（[固定提交 dc56112](https://github.com/Small-tailqwq/dsh-deep-whale/tree/dc561129f3bb3bc94c4a7c3e4007eaa274650d31)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是对皮肤/宿主版本绑定核心交互验收，以遮挡注入比较放行漏检和回退时间；负担过高或无改善即停止。

隔离profile做多启用、写失败及回滚失败注入，并核对各宽度的核心交互，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 156 | 138 | 4 | — |
| .md | source | 19 | 1909 | — | — | 33654 |
| .js | source | 7 | 12824 | 11552 | 1562 | — |
| .ts | source | 77 | 12346 | 9713 | 1835 | — |
| .ts | test | 54 | 12883 | 10784 | 870 | — |
| .md | example | 1 | 19 | — | — | 160 |
| .tsx | source | 2 | 1170 | 1024 | 81 | — |
| .tsx | example | 1 | 48 | 41 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 38](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=38&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A28.705Z..2026-10-27T02%3A07%3A28.705Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A28.705Z..2026-10-27T02%3A07%3A28.705Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查皮肤合集的分包、互斥切换和兼容放行治理。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 根合集如何选择，谁需要管理器？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

根仓库是两套主题与skin-manager的合集和安装路由，不是第四个可装根包。面向喜欢角色主题并可能切换多套皮肤的DSH用户，合格结果是同一时刻一套主题生效、核心输入阅读正常并能回官方界面。简单办法是只装一套或手工禁启插件。作者明确单皮肤管理器可选、多皮肤必须保持管理器启用，并禁止与dsh-web适配发行方式叠装；这些约束来自宿主样式契约而非模型任务能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-22](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L16-L22)

合集列主题和管理器三个独立包。

```text
## 住户

| 皮肤 | 包名 | 说明 | 许可 |
|---|---|---|---|
| [maid-atelier](maid-atelier/) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` | 深海女仆工坊：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [orca-link](orca-link/) | `@smalltailqwq/dsh-client-ui-skin-orca-link` | 虎鲸链路：酷酷的小黑鲸操作员，全直角界面加用直线重绘的图标；亮色机能，暗色治愈 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [skin-manager](skin-manager/) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` | 皮肤管理器：切换已安装的皮肤，调整各皮肤自带的选项，在「设置 → 皮肤管理」中打开 | MIT |
```

**依据 2 · 作者声明**：[README.md:36-49](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L36-L49)

发行方式和多皮肤管理前提。

<details>
<summary>查看原文（14行）</summary>

```text
> 如果你用的是 dsh-web（装过 `@linxin666/dsh-web-all`），请直接在 dsh-web 自带的皮肤中心里安装 `maid-atelier` 和 `orca-link`，不要再运行下面的命令。两边的皮肤是分别适配的，装在同一个 profile 里会让界面显示错乱。

### 官方桌面版

1. 按需选择一套或多套皮肤。打开侧栏「插件」，点击「添加插件」，逐个填入下面对应的 npm 包名并安装。

   | 插件 | npm 包名 |
   |---|---|
   | [maid-atelier](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` |
   | [orca-link](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-orca-link) | `@smalltailqwq/dsh-client-ui-skin-orca-link` |
   | [皮肤管理器](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-deep-whale-manager) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` |

2. **只装一套皮肤**时，管理器可选；不装就无法使用配置面板、图形化版本兼容放行和自动多皮肤互斥管理。**同时装多套皮肤必须安装并保持管理器启用**，否则皮肤同时启用会让界面错乱。管理器一旦安装，即使只用一套皮肤也应保持启用。安装完成后按提示启用插件，然后**重启一次 DSH**。
3. 如果安装了皮肤管理器，重启后打开「设置 → 皮肤管理」。首次启动若仍显示官方界面，到这里选择要启用的皮肤即可。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 互斥切换与安全初态怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

manager从配置层读各wiringId的disabled，后层覆盖前层，再找有效启用皮肤。ensureSafeInitialState发现已装至少两套且有效启用至少两套时调用useSkin(official)，先回官方避免叠加。useSkin检查目标已安装，读取各patch原件、计算switchPatch后逐文件atomicWrite，任一失败按已写列表逆序恢复或删新文件。这是配置层补偿，不是浏览器视觉效果的原子事务；回滚自身再次写入失败的情况和并发外部配置修改仍须验证。可借鉴先固定原件与明确官方退路，但不应把源码分支当多皮肤实际切换验收。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/src/index.ts:821-847](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/skin-manager/src/index.ts#L821-L847)

目标校验、原件、逐文件写入和逆序补偿。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 2 · 源码核查**：[skin-manager/src/index.ts:883-901](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/skin-manager/src/index.ts#L883-L901)

配置层覆盖与多启用回官方。

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

- 没有并发配置写和写入/回滚失败实验
  **影响**：不能称多文件切换事务或零残留
  **进一步探讨**：隔离profile注入第二写失败、回滚失败与外部配置变更，回读所有层

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 合集治理贡献与升级放行有什么边界？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

相对自己拼主题CSS，合集提供相同wiring身份、统一选项和互斥切换，主要增量是降低同时启用冲突，而不是增加工作产物或模型能力。根作为路由不再重复计两套主题艺术设计为第三项功能。兼容放行只说明用户选择继续加载，不证明DOM、输入器和工作台可用；宿主升级后选择器变化仍可能影响界面。首次需选对profile与发行方式、匹配宿主版本，持续要维护管理器及各皮肤版本，失败先切官方，必要时按profile禁用。代码与美术许可不同，所查根表明确MIT代码与CC BY-NC-SA美术，重用需分别核对。金额、资源和人工时间无实测。根建议观察用于选包，实际试用在子包和隔离profile完成，不把兼容豁免当无风险安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-22](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L18-L22)

分包与许可范围。

```text
| 皮肤 | 包名 | 说明 | 许可 |
|---|---|---|---|
| [maid-atelier](maid-atelier/) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` | 深海女仆工坊：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [orca-link](orca-link/) | `@smalltailqwq/dsh-client-ui-skin-orca-link` | 虎鲸链路：酷酷的小黑鲸操作员，全直角界面加用直线重绘的图标；亮色机能，暗色治愈 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [skin-manager](skin-manager/) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` | 皮肤管理器：切换已安装的皮肤，调整各皮肤自带的选项，在「设置 → 皮肤管理」中打开 | MIT |
```

**依据 2 · 作者声明**：[README.md:141-147](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L141-L147)

版本不符回默认与版本绑定的用户放行。

```text
**升级 DSH 后皮肤不见了**

每套皮肤只声明支持自己适配过的 DSH 版本（目前是 0.2 系列，从 0.2.0-rc.2 起）。DSH 升级到更新的版本而皮肤还没跟上时，DSH 会自动停用皮肤、恢复官方界面，免得皮肤把输入框之类的控件挡住。

先按上面的更新说明更新皮肤。如果还没有新版，又想先用着旧皮肤，可以打开「设置 → 皮肤管理」：被停用的皮肤会显示「未声明支持当前的 DSH x.y.z，已被自动停用」，点「切换」并确认即可。这个放行只针对当前的皮肤版本和 DSH 版本，任意一方升级后会重新检查；用得不顺手随时切回「官方默认」。

<details>
```

**依据 3 · 源码核查**：[skin-manager/src/index.ts:892-901](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/skin-manager/src/index.ts#L892-L901)

安全初态支撑互斥治理增量。

<details>
<summary>查看原文（10行）</summary>

```text
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

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 版本绑定交互验收能否改进兼容放行？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在皮肤与宿主版本对上记录最小交互验收，检查输入/发送/侧栏/工作台，再允许继续使用，而不是仅显示兼容警告。推导来自Q02安全初态与Q03豁免不保证布局；新增负担是检查维护与用户确认，不能让一次验收永久跨版本继承。最小验证两个宿主版本与三种宽度注入遮挡，对比只确认放行和交互清单的漏检、回退时间；无漏检改善或成本过高就停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:141-147](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L141-L147)

皮肤/宿主版本变化会重新检查，为验收绑定提供依据。

```text
**升级 DSH 后皮肤不见了**

每套皮肤只声明支持自己适配过的 DSH 版本（目前是 0.2 系列，从 0.2.0-rc.2 起）。DSH 升级到更新的版本而皮肤还没跟上时，DSH 会自动停用皮肤、恢复官方界面，免得皮肤把输入框之类的控件挡住。

先按上面的更新说明更新皮肤。如果还没有新版，又想先用着旧皮肤，可以打开「设置 → 皮肤管理」：被停用的皮肤会显示「未声明支持当前的 DSH x.y.z，已被自动停用」，点「切换」并确认即可。这个放行只针对当前的皮肤版本和 DSH 版本，任意一方升级后会重新检查；用得不顺手随时切回「官方默认」。

<details>
```

**依据 2 · 源码核查**：[skin-manager/src/index.ts:892-901](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/skin-manager/src/index.ts#L892-L901)

官方回退是可用的恢复参照。

<details>
<summary>查看原文（10行）</summary>

```text
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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
