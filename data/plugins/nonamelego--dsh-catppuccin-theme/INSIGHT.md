# DSH Catppuccin Theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[bbe4d38](https://github.com/NoNameLeGo/dsh-catppuccin-theme/tree/bbe4d380029f915aa2b81c9f91c5e765810d6128)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NoNameLeGo/dsh-catppuccin-theme) [![npm 30d 9,333](https://img.shields.io/static/v1?label=npm+30d&message=9%2C333&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nonamelego/dsh-catppuccin) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@nonamelego/dsh-catppuccin)
<!-- END META -->

> **功能**：为 DSH Web 提供 Catppuccin 配色、玻璃外观及TUI主题同步。

> **亮点**：[Q01](#research-q01) 将主题注册、用户覆盖与首帧恢复相连。

> **主要限制**：[Q02](#research-q02) 本地可见不等于宿主持久化成功，TUI只有单代备份且失败可被忽略。

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
  - [Q01 · 主题如何从设置恢复到页面？](#detail-section-11)
  - [Q02 · 持久化和TUI同步如何处理冲突？](#detail-section-12)
  - [Q03 · 怎样在可退回范围内试用？](#detail-section-13)
  - [Q04 · TUI单备份是否足以支持用户恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在DSH和已有TUI保持偏好配色的用户。

手工覆盖CSS与分别复制TUI主题。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题 | 配色高亮与玻璃 | 宿主兼容和可读性 |
| 恢复 | 同步宿主设置 | 冲突需读回 |
| TUI主题 | 已有目录同步 | 同名文件及单代备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH主题与settings服务 | Web必需 | 注册及持久恢复 | 可能仅本地缓存 |
| 已有TUI目录 | TUI同步需要 | 写同名主题 | 不存在时不创建 |
| npm网络 | 更新检查可选 | 查询版本 | 关闭检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份设置及TUI同名文件 | 独立备份同名文件；无法备份则停用 |
| 应用 | 选风味和玻璃 | 检查代码菜单 |
| 恢复 | 刷新与双标签修改 | 检查stale及持久选择 |
| 退出 | 恢复默认并禁用 | 按备份处理TUI文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器磁盘资源未知 | 备份和调主题 | 未实测 |
| 持续使用 | 玻璃渲染及版本请求未知 | 检查兼容与保存冲突 | 按宿主 |
| 失败恢复 | 文件副本开销未知 | 查单bak与缓存 | 二次漂移覆盖旧bak |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配色恢复 | 宿主注册及首帧注入 | 实际视觉 |
| 状态冲突 | revision守卫和拒写结果 | UI冲突体验 |
| TUI同步 | 已有目录写入及备份 | 真实恢复 |

> **思考**：[Q02](#research-q02) 本地可见不等于宿主持久化成功，TUI只有单代备份且失败可被忽略。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将主题注册、用户覆盖与首帧恢复相连。

[Q02](#research-q02) 版本拒写是明确设计，不能掩盖尽力同步和备份代限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 本地可见不等于宿主持久化成功，TUI只有单代备份且失败可被忽略。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 小范围验证刷新与文件后再用玻璃。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

主题、持久化与同步静态核查，视觉和恢复未实测。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/client/index.ts、src/client/state-sync.ts、src/index.ts、src/state.ts、src/tui-themes.ts、src/update-check/host.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Web主题、状态持久化、更新请求与TUI同步。
- 下一步：对照文字可读性、revision冲突和连续漂移恢复。

**分析版本**

- **仓库**：[NoNameLeGo/dsh-catppuccin-theme](https://github.com/NoNameLeGo/dsh-catppuccin-theme)
- **版本号**：0.7.0（[固定提交 bbe4d38](https://github.com/NoNameLeGo/dsh-catppuccin-theme/tree/bbe4d380029f915aa2b81c9f91c5e765810d6128)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 多代备份的恢复收益需要对照，当前已有单代。

对照文字可读性、revision冲突和连续漂移恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 9770 | — | — | 185609 |
| .cjs | source | 4 | 1347 | 963 | 309 | — |
| .mjs | source | 4 | 1009 | 590 | 360 | — |
| .ts | source | 25 | 7525 | 4436 | 2800 | — |
| .tsx | source | 7 | 1370 | 923 | 411 | — |
| .ts | test | 22 | 7480 | 5412 | 1520 | — |
| .tsx | test | 2 | 946 | 721 | 149 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/NoNameLeGo/dsh-catppuccin-theme/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Catppuccin如何注册与恢复主题，持久状态和TUI同步有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题如何从设置恢复到页面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

偏好Catppuccin配色的DSH用户可选风味、代码高亮和玻璃效果。客户端通过宿主theme.register提交语义token，叠加当前宿主菜单形状与用户覆盖，并保存每个注册的释放函数。host在webserver/index-inject事件中读取持久配色生成首帧数据，减少浏览器加载时默认主题与已选主题之间的切换。相比手工CSS覆盖，这把主题选择和恢复接到宿主契约，实际可读性仍需按代码、弹层和深浅模式核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:487-518](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/client/index.ts#L487-L518)

主题注册及释放与玻璃层

<details>
<summary>查看原文（32行）</summary>

```text
    const disposer = tolerantRegistration(() => theme.register({
      id: flavor.themeId,
      colorScheme: flavor.colorScheme,
      tokens: {
        ...flavor.tokens,
        ...shiki,
        // Host-shape patch (0.1.7 vs the 0.1.5 latest line): keep the menu
        // surface readable on hosts without the menu blur. Below the user
        // overrides on purpose — see menuSurfaceFor().
        ...menuSurfaceFor(hostHasMenuBlur()),
        ...readOverrides(),
      } as ThemeTokens,
    }))
    themeDisposers.set(flavor.themeId, disposer)
  }
  const ensureThemeRegistered = (themeId: string): void => {
    const flavor = flavorInfo(themeId)
    if (flavor !== undefined) registerThemeFor(flavor)
  }
  const disposeThemeRegistrations = (): void => {
    for (const dispose of themeDisposers.values()) dispose()
    themeDisposers.clear()
  }
  ctx.effect(() => disposeThemeRegistrations, 'catppuccin: flavour theme disposers')

  // The glass layer: a toggleable glassmorphism skin on top of the Catppuccin
  // themes. It owns its lifecycle (enable flag + knobs persist in
  // localStorage as the in-browser cache; the durable copy is the settings
  // document hydrated/pushed below; every effect is released with this fiber).
  // It is created before the boot-restore effect so hydration can overlay the
  // persisted glass state onto the layer.
  const glass = new GlassLayer(ctx)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:129-143](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/index.ts#L129-L143)

首帧配色注入

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx: Context, config?: BootPaletteConfig): void {
  registerUpdateCheckRoute(ctx)

  // Pre-paint palette (issue #30 补充, 2026-10-27): the index HTML ships the
  // persisted flavour's own token table, so the first frame is Catppuccin
  // instead of the official dark the theme bootstrap paints. The listener reads
  // the durable value on every render, so a page load always reflects the
  // document as it stands then.
  //
  // `config` is the Loader-validated plugin config; on DSH >= 0.1.7 its fields
  // are volatile refs, which is the only shape `bootPaletteRows` accepts (see
  // its module header for why a plain value must NOT be painted).
  ctx.on('webserver/index-inject', (table) => {
    table.push(...bootPaletteRows(config))
  })
```

</details>

**依据 3 · 作者声明**：[README.md:62-81](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/README.md#L62-L81)

作者功能描述

<details>
<summary>查看原文（20行）</summary>

```text
Catppuccin 主题。

## 特性

- 🎨 四个主题：Latte（浅色）、Frappé / Macchiato / Mocha（深色）
- 🧩 接入官方主题系统，与内置浅色 / 深色 / 跟随系统主题平级
- 🎯 全界面配色覆盖，不只是一两个强调色
- ⚙️ 设置页独立分区一键切换，选择自动保存、重启自动恢复
- 🔧 **自定义 token 覆盖**：按「`--dsw-* 变量: 值`」逐条覆盖单个配色 token（例如把注释色换成蓝色），与所选风味一起持久保存
- 🖍️ **代码块高亮风格**：默认 / 注释斜体（italic-comments）两套 shiki 风格可选
- 🌐 中 / 英 / 日 / 韩 / 西 / 法 / 德七语文案（跟随系统语言）
- 🪟 **玻璃质感**（云母模式）：顶栏 / 侧边栏 / 输入框 / 轨迹视图 / 聊天气泡 /
  新会话按钮磨砂玻璃效果，设置里一键开关；云母 / 兼容双模式（兼容模式保持原版排版，
  只给输入框卡片与浮层上玻璃），模糊度、磨砂度、
  背景亮度自由调节（交互参考 [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin)）
- 🌫️ **玻璃拟态细节**：页面上下边缘渐变模糊、折叠侧边栏悬浮玻璃、
  随主题的氛围地面（同色系渐变；两枚柔光斑是**可选开关、默认关**）——内容滚入视口边缘时柔化穿过，
  玻璃透着地面的明暗，层次更立体
- 🎨 玻璃配色自动跟随当前 Catppuccin 主题
- 🔄 **检查 Catppuccin 插件更新**：设置页一键检测本插件（dsh-catppuccin）在 npm 上的最新版本，发现新版直接给出可复制的升级命令；**默认开启自动检查**（启动后一次 + 每 6 小时），更新渠道可选稳定版 / Beta
```

</details>

#### 缺口

- 目标宿主视觉覆盖和首帧效果未实测
  **影响**：不能宣称所有界面可读或无闪烁
  **进一步探讨**：合成页面对照首帧、代码和菜单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久化和TUI同步如何处理冲突？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

persistStateToScope先比远端与本地内容，相同返回noop；本地基准revision落后且不属自身回声时返回stale；写入被拒也作为stale交调用方重读，其他失败返回error。它依赖宿主scope的版本语义，不能仅凭本地缓存证明已保存。固定入口id改变可能退化到localStorage，跨端口恢复也因此不同。

另一个bundle行会同步到已存在TUI目录。默认backup遇到漂移先复制到单个.bak再覆盖主文件，第二次冲突会刷新同一备份，不保留多代；preserve仅为导出的函数参数分支；实际Cordis apply不接收配置，只传communityDir，因此宿主激活始终采用默认backup。package.json没有bin或用户CLI，patch也没有冲突参数，不能将preserve当可用设置推荐。community主题仅缺失才写。同步失败按作者说明尽力忽略，因此Web启动成功不代表TUI文件同步成功，退出要分别检查浏览器设置与TUI文件。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/state-sync.ts:382-420](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/client/state-sync.ts#L382-L420)

版本守卫与写入结果

<details>
<summary>查看原文（39行）</summary>

```text
export async function persistStateToScope(
  scope: DurableScope<CatppuccinSettingsSection>,
  state: CatppuccinState,
  options: {
    /** Snapshot revision the local state was derived from (captured at
     *  schedule time). Omit to skip the read-side guard entirely. */
    baseRevision?: number | undefined
    /** Section of the last successfully issued write (our own echo
     *  fingerprint — revision movement matching it is not a conflict). */
    lastWrittenSection?: CatppuccinSettingsSection | undefined
  } = {},
): Promise<PersistOutcome> {
  const snapshot = scope.getSnapshot()
  if (!isScopeUsable(snapshot)) return 'error'
  const remote = durableStateFromSnapshot(snapshot)
  const localSection = settingsSectionFromState(state)
  if (remote !== null && settingsSectionsEqual(settingsSectionFromState(remote), localSection)) {
    return 'noop'
  }
  const { baseRevision, lastWrittenSection } = options
  if (baseRevision !== undefined && snapshot.revision !== undefined && snapshot.revision !== baseRevision) {
    const ourOwnEcho = lastWrittenSection !== undefined
      && remote !== null
      && settingsSectionsEqual(settingsSectionFromState(remote), lastWrittenSection)
    if (!ourOwnEcho) return 'stale'
  }
  // No fence: the channel resolves `pendingRevision ?? snapshot.revision` when
  // the write actually goes out, which is both fresher than our captured base
  // and aware of our own superseded/in-flight writes (difference 2 in the
  // module header). The Host still validates it against the document, so an
  // external edit the mirror has not seen yet is still refused.
  const outcome = await scope.write(stateToMutateOps(state))
  if (outcome === 'accepted') return 'written'
  // A refusal means the Host's document moved past what this state was derived
  // from — the same condition the read-side guard above reports. The channel
  // has already re-read the Host state, so the caller can adopt it and tell
  // the row about the conflict.
  if (outcome === 'refused') return 'stale'
  return 'error'
```

</details>

**依据 2 · 源码核查**：[src/state.ts:56-68](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/state.ts#L56-L68)

入口id和遗留文件

<details>
<summary>查看原文（13行）</summary>

```text
 *
 * It is a CONTRACT with `cordis.patch.yml`: the `insert` row whose `name` is
 * `@nonamelego/dsh-catppuccin` must keep `id: dsh-catppuccin`, because the
 * Client can only address the form by that id (asserted by
 * `tests/settings-seam.spec.ts`). A user who renames the entry loses the new
 * seam and degrades to localStorage-only — the legacy seam is unaffected,
 * since that namespace is registered by the plugin itself.
 */
export const CATPPUCCIN_ENTRY_ID = 'dsh-catppuccin'

/** State file name under the DSH home (kept next to the Desktop-managed
 *  `cordis.patch.yml` so it survives the Desktop's per-launch port churn). */
export const STATE_FILENAME = 'catppuccin-state.json'
```

</details>

**依据 3 · 源码核查**：[src/tui-themes.ts:86-134](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/tui-themes.ts#L86-L134)

默认backup和漂移备份及community写入

<details>
<summary>查看原文（49行）</summary>

```text
export function syncTuiThemes(
  bundledDir: string,
  tuiHome: string,
  options: SyncTuiThemesOptions = {},
): string[] {
  if (!existsSync(tuiHome) || !statSync(tuiHome).isDirectory()) return []
  const { onConflict = 'backup', dryRun = false, communityDir } = options
  const written: string[] = []
  let targetReady = false
  const ensureTarget = (): void => {
    if (!targetReady) {
      mkdirSync(join(tuiHome, 'themes'), { recursive: true })
      targetReady = true
    }
  }
  for (const file of readdirSync(bundledDir).sort()) {
    if (!isOwnedTheme(file)) continue
    const source = readFileSync(join(bundledDir, file))
    const dest = join(tuiHome, 'themes', file)
    let identical = false
    try {
      identical = readFileSync(dest).equals(source)
    } catch {
      identical = false // missing or unreadable target → (re)write it
    }
    if (identical) continue
    if (onConflict === 'preserve' && existsSync(dest)) continue
    if (!dryRun) {
      ensureTarget()
      if (onConflict === 'backup' && existsSync(dest) && statSync(dest).isFile()) {
        // One .bak per theme, refreshed on every conflict (the user's
        // customization is never lost, only rolled forward).
        copyFileSync(dest, `${dest}.bak`)
      }
      writeFileSync(dest, source)
    }
    written.push(file)
  }
  if (communityDir !== undefined && existsSync(communityDir) && statSync(communityDir).isDirectory()) {
    for (const file of readdirSync(communityDir).sort()) {
      if (!file.endsWith('.json')) continue
      const dest = join(tuiHome, 'themes', file)
      if (existsSync(dest)) continue // never overwrite an existing theme
      if (!dryRun) {
        ensureTarget()
        writeFileSync(dest, readFileSync(join(communityDir, file)))
      }
      written.push(file)
    }
```

</details>

**依据 4 · 源码核查**：[src/tui-themes.ts:139-153](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/tui-themes.ts#L139-L153)

实际激活只传communityDir

<details>
<summary>查看原文（15行）</summary>

```text
/** Cordis entry: sync once at activation. No inject — must activate in any
 *  profile (dsh-tui has no webServer; the main half waits there instead). */
export function apply(): void {
  try {
    // lib/tui-themes.js -> <package root>/themes (shipped via package.json
    // "files"; same layout under a link: dev install).
    const bundledDir = fileURLToPath(new URL('../themes', import.meta.url))
    const tuiHome = join(homedir(), '.dsh-tui')
    syncTuiThemes(bundledDir, tuiHome, {
      // Community themes: ~/.dsh-tui/themes/catppuccin-community/ (item T).
      communityDir: join(tuiHome, 'themes', 'catppuccin-community'),
    })
  } catch {
    // Best-effort: never disturb profile startup for a theme copy.
  }
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:1-16](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/cordis.patch.yml#L1-L16)

bundle无冲突参数

<details>
<summary>查看原文（16行）</summary>

```text
# dsh-catppuccin bundle patch: inserts its dsh.client row into the web plugin
# roster. The bundle is the official dsh plugin shape — install it with
# `dsh plugin --profile <name> add <path-or-git-url>`.
- insert:
    - id: dsh-catppuccin
      name: '@nonamelego/dsh-catppuccin'
    # TUI theme sync: idempotently copies the four Catppuccin theme JSONs into
    # ~/.dsh-tui/themes/ on activation. No inject, so it activates in EVERY
    # profile — in a dsh-tui profile this is what makes the one-command
    # install work (dsh-TUI reads themes only from that directory; there is
    # no registration API); in a web/desktop profile it keeps themes in sync
    # for users who also run dsh-TUI; with no ~/.dsh-tui on disk it is a
    # strict no-op. The main row above stays pending on webServer there,
    # same benign state as headless profiles.
    - id: dsh-catppuccin-tui-themes
      name: '@nonamelego/dsh-catppuccin/tui-themes'
```

</details>

**依据 6 · 源码核查**：[src/tui-themes.ts:15-31](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/tui-themes.ts#L15-L31)

存在目录条件和失败策略

<details>
<summary>查看原文（17行）</summary>

```text
 *   - installed into a web/desktop profile of a user who also runs dsh-TUI:
 *     themes stay in sync on every web start, no second install needed;
 *   - no `~/.dsh-tui` on disk (web-only user, headless): strict no-op — the
 *     directory is never created by this plugin.
 *
 * The `catppuccin-*.json` namespace is plugin-owned but user-visible:
 * syncing a DRIFTED owned file backs it up to `<name>.json.bak` before
 * writing the shipped copy (item R — the user's customization is never
 * silently swallowed), `preserve` leaves it alone, `overwrite` restores the
 * historical force-sync behavior; other files in the themes directory are
 * never touched. Community/third-party themes (item T) live in the
 * `catppuccin-community/` subdirectory and are synced write-if-missing —
 * existing themes are never overwritten.
 *
 * Best-effort by contract: any failure is swallowed silently — theme sync
 * must never drag down profile startup (stdout stays quiet during TUI
 * sessions, so no logging here either).
```

</details>

#### 缺口

- 真实宿主拒绝回写时UI表现及文件权限失败未验证
  **影响**：可能仅缓存生效或丢较早备份代
  **进一步探讨**：双页面改设置并用测试TUI目录制造两次漂移

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样在可退回范围内试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在兼容DSH profile选一款风味，先备份主题配置与已存在TUI同名文件，检查刷新和另一个标签的选择同步。已有TUI同名定制文件的用户必须先在插件管理范围之外独立备份；不能依赖未暴露的preserve设置，Web-only不应为此主动创建TUI目录。更新检查由host向固定npm registry请求，默认自动检查是额外网络行为，试用时可关闭。现金费没有模型调用路径，但浏览器玻璃渲染和TUI文件运维开销未测，人工要检查文字可读性。退出恢复宿主默认主题、禁玻璃并移除插件，TUI已复制文件与.bak需按备份逐个处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/update-check/host.ts:124-134](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/update-check/host.ts#L124-L134)

registry请求与超时

<details>
<summary>查看原文（11行）</summary>

```text
  const timer = setTimeout(() => controller.abort(), UPDATE_FETCH_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch(REGISTRY_PACKUMENT_URL, {
      signal: controller.signal,
      headers: {
        accept: 'application/vnd.npm.install-v1+json',
        // Item W: conditional request — a 304 answer revalidates the cached
        // verdict without pulling the full packument again.
        ...(options.etag !== undefined ? { 'if-none-match': options.etag } : {}),
      },
```

</details>

**依据 2 · 作者声明**：[README.md:69-83](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/README.md#L69-L83)

持久化、玻璃、更新及TUI说明

<details>
<summary>查看原文（15行）</summary>

```text
- ⚙️ 设置页独立分区一键切换，选择自动保存、重启自动恢复
- 🔧 **自定义 token 覆盖**：按「`--dsw-* 变量: 值`」逐条覆盖单个配色 token（例如把注释色换成蓝色），与所选风味一起持久保存
- 🖍️ **代码块高亮风格**：默认 / 注释斜体（italic-comments）两套 shiki 风格可选
- 🌐 中 / 英 / 日 / 韩 / 西 / 法 / 德七语文案（跟随系统语言）
- 🪟 **玻璃质感**（云母模式）：顶栏 / 侧边栏 / 输入框 / 轨迹视图 / 聊天气泡 /
  新会话按钮磨砂玻璃效果，设置里一键开关；云母 / 兼容双模式（兼容模式保持原版排版，
  只给输入框卡片与浮层上玻璃），模糊度、磨砂度、
  背景亮度自由调节（交互参考 [DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin)）
- 🌫️ **玻璃拟态细节**：页面上下边缘渐变模糊、折叠侧边栏悬浮玻璃、
  随主题的氛围地面（同色系渐变；两枚柔光斑是**可选开关、默认关**）——内容滚入视口边缘时柔化穿过，
  玻璃透着地面的明暗，层次更立体
- 🎨 玻璃配色自动跟随当前 Catppuccin 主题
- 🔄 **检查 Catppuccin 插件更新**：设置页一键检测本插件（dsh-catppuccin）在 npm 上的最新版本，发现新版直接给出可复制的升级命令；**默认开启自动检查**（启动后一次 + 每 6 小时），更新渠道可选稳定版 / Beta
- 💬 **反馈与支持**：设置区底部与插件详情页附 GitHub 链接——遇到问题可提 Issue，喜欢就点个 Star ⭐
- 💻 **[dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) 终端主题**：一条安装命令装进 dsh-TUI，四套主题自动同步到 `~/.dsh-tui/themes/`，见[安装 · dsh-TUI](#dsh-tui终端版主题)
```

</details>

**依据 3 · 源码核查**：[src/tui-themes.ts:15-31](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/tui-themes.ts#L15-L31)

Web-only无目录时不创建

<details>
<summary>查看原文（17行）</summary>

```text
 *   - installed into a web/desktop profile of a user who also runs dsh-TUI:
 *     themes stay in sync on every web start, no second install needed;
 *   - no `~/.dsh-tui` on disk (web-only user, headless): strict no-op — the
 *     directory is never created by this plugin.
 *
 * The `catppuccin-*.json` namespace is plugin-owned but user-visible:
 * syncing a DRIFTED owned file backs it up to `<name>.json.bak` before
 * writing the shipped copy (item R — the user's customization is never
 * silently swallowed), `preserve` leaves it alone, `overwrite` restores the
 * historical force-sync behavior; other files in the themes directory are
 * never touched. Community/third-party themes (item T) live in the
 * `catppuccin-community/` subdirectory and are synced write-if-missing —
 * existing themes are never overwritten.
 *
 * Best-effort by contract: any failure is swallowed silently — theme sync
 * must never drag down profile startup (stdout stays quiet during TUI
 * sessions, so no logging here either).
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:506-518](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/client/index.ts#L506-L518)

注册释放

<details>
<summary>查看原文（13行）</summary>

```text
  const disposeThemeRegistrations = (): void => {
    for (const dispose of themeDisposers.values()) dispose()
    themeDisposers.clear()
  }
  ctx.effect(() => disposeThemeRegistrations, 'catppuccin: flavour theme disposers')

  // The glass layer: a toggleable glassmorphism skin on top of the Catppuccin
  // themes. It owns its lifecycle (enable flag + knobs persist in
  // localStorage as the in-browser cache; the durable copy is the settings
  // document hydrated/pushed below; every effect is released with this fiber).
  // It is created before the boot-restore effect so hydration can overlay the
  // persisted glass state onto the layer.
  const glass = new GlassLayer(ctx)
```

</details>

#### 缺口

- 安装兼容、自动更新周期及禁用恢复未在宿主执行
  **影响**：长期资源和退出效果未知
  **进一步探讨**：先记录配置及文件清单，禁用后读回默认界面

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · TUI单备份是否足以支持用户恢复？

**研究主题**：新假设与验证

#### 完整回答

当前实现已备份漂移，不应把新增备份说成未来能力。可检验的方向是连续自定义两次后，带时间或内容哈希的备份是否比单.bak更容易找回原改动。对照实际入口的首次漂移、二次漂移和写入失败；preserve只作为函数级实验对照，不是宿主设置，比较可恢复版本与清理负担。若单备份已满足目标用户，或多代造成混淆和空间浪费，则保留现有策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/tui-themes.ts:112-120](https://github.com/NoNameLeGo/dsh-catppuccin-theme/blob/bbe4d380029f915aa2b81c9f91c5e765810d6128/src/tui-themes.ts#L112-L120)

单bak每次覆盖

```text
    if (onConflict === 'preserve' && existsSync(dest)) continue
    if (!dryRun) {
      ensureTarget()
      if (onConflict === 'backup' && existsSync(dest) && statSync(dest).isFile()) {
        // One .bak per theme, refreshed on every conflict (the user's
        // customization is never lost, only rolled forward).
        copyFileSync(dest, `${dest}.bak`)
      }
      writeFileSync(dest, source)
```

#### 缺口

- 真实用户需要保留几代及收益未知
  **影响**：新增复杂度未必值得
  **进一步探讨**：用测试目录和恢复任务比较

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
