# dsh-deep-whale 鲸鱼娘皮肤合集

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d9bb498](https://github.com/Small-tailqwq/dsh-deep-whale/tree/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b)

<!-- BEGIN META -->
[![GitHub ★ 3,086](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C086&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web 提供鲸鱼娘主题皮肤及已安装皮肤的切换和配置管理入口。

> **亮点**：[Q01](#research-q01) 根资源组织两套主题与管理器的选包条件，[Q02](#research-q02) 管理器使多套主题围绕明确目标互斥切换。

> **主要限制**：[Q02](#research-q02) 配置分层写入和主题挂载标记仍未证明界面输入与阅读可用，版本豁免也只登记用户接受风险。

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
  - [Q01 · 根合集交付什么，用户需要选择哪个包及宿主？](#detail-section-11)
  - [Q02 · 切换如何写配置、处理版本和确认生效？](#detail-section-12)
  - [Q03 · 从首次试用到退出需要承担什么？](#detail-section-13)
  - [Q04 · 如何验证可操作性反馈是否补足挂载标记？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢角色主题的 DSH 用户可以在根文档选择具体主题和适配入口，管理器帮助切换已安装的皮肤。

官方默认外观已经可完成工作。这里主要增加主题偏好、独立选包和切换，实际输入与阅读必须在目标宿主核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题选包 | 按偏好选择独立外观 | 发行版入口与素材条件需核对 |
| 互斥切换 | 在已安装主题和官方默认间选目标 | 写配置后还需宿主消费 |
| 版本放行 | 对确切主题与宿主版本接受风险 | 无法证明操作兼容 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 正确发行版与具体主题子包 | 主题使用必需 | 安装目标外观 | 根目录仅作选择入口 |
| 管理器 | 多套主题必需 | 互斥、配置及放行 | 单套可不用配置面板，多套应停用冲突项 |
| 目标宿主版本和适用素材条件 | 试用前需要 | 判断配置及使用范围 | 继续默认外观 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 用户按发行版选一套主题 | 包和 profile 一致 |
| 试用 | 输入短文字、滚动长代码、开设置 | 文字与操作可见 |
| 退出 | 回默认外观或从宿主停主题 | 输入和阅读恢复，配置读回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 代码和图片下载资源未测 | 选包、备份 profile、重启 | 宿主实际兼容未验 |
| 持续 | 绘制与缓存开销未知 | 维护主题和管理器版本 | 视觉偏好收益未量化 |
| 失败恢复 | 备份空间未知 | 检查两层配置并回默认 | 崩溃和并发恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 选包和主题管理 | 根入口、互斥写与默认目标 | 个人偏好和长期收益 |
| 切换状态 | 客户端观察 body 属性 | 实际输入及阅读可用 |
| 版本处理 | 精确版本豁免通过宿主 | 放行后的界面兼容 |

> **思考**：[Q02](#research-q02) 配置分层写入和主题挂载标记仍未证明界面输入与阅读可用，版本豁免也只登记用户接受风险。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 根资源组织两套主题与管理器的选包条件，[Q02](#research-q02) 管理器使多套主题围绕明确目标互斥切换。

每文件原子替换和同步错误补偿职责清楚，跨层崩溃仍需恢复机制。桌面与 Web 分别按各自启动图消费方式等待。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 配置分层写入和主题挂载标记仍未证明界面输入与阅读可用，版本豁免也只登记用户接受风险。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从一套主题的隔离 profile 试用开始，确认输入、代码阅读和回默认，再考虑多套。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交已核查根选包、管理器互斥配置、版本放行及客户端等待链路。美术效果、真实兼容和故障恢复未运行验收。

- 已检查：作者 README、包清单、源码路径 skin-manager/src/index.ts、skin-manager/src/compatibility.ts、skin-manager/src/client/switch-settle.ts、skin-manager/src/client/SkinManager.tsx、skin-manager/package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根合集与管理器关键流程静态核查，未全面审计两套主题的所有组件、打包一致性、美术资源或真实宿主效果。
- 下一步：在单独 profile 检查切换、输入、阅读和回默认，另外比较精确版本放行与已兼容版本的失败反馈。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：未声明（[固定提交 d9bb498](https://github.com/Small-tailqwq/dsh-deep-whale/tree/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 挂载标记之后补一次可见任务检查并保留回默认入口，可能减少版本放行后的错误完成提示。

在单独 profile 检查切换、输入、阅读和回默认，另外比较精确版本放行与已兼容版本的失败反馈。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 936 | 868 | 26 | — |
| .md | source | 28 | 2033 | — | — | 36235 |
| .js | source | 7 | 13456 | 12199 | 1568 | — |
| .ts | source | 79 | 12896 | 10214 | 1903 | — |
| .ts | test | 61 | 14121 | 11899 | 907 | — |
| .md | example | 1 | 62 | — | — | 525 |
| .tsx | source | 2 | 1174 | 1028 | 81 | — |
| .tsx | example | 1 | 48 | 41 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=24&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=31&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：喜欢鲸鱼娘主题的 DSH 用户如何选对安装入口、切换一套可用外观，并在配置或宿主不匹配时回到可操作界面？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根合集交付什么，用户需要选择哪个包及宿主？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是两套角色主题和一个管理器的选包资源。喜欢角色化工作界面、且愿意检查阅读与输入效果的个人 DSH 用户，可以从根文档选 maid-atelier 或 orca-link；管理器提供选中已安装主题的入口。官方桌面版、CLI profile 与 dsh-web 的安装入口各有要求，作者特别要求 dsh-web 使用其自带皮肤中心。单套可不装管理器，但配置面板和兼容放行等能力随之缺失，多套则要保持管理器启用避免叠加。相比官方默认外观，主要价值是偏好的视觉组织和主题切换，源码无法证明专注或工作效率提高。根目录本身没有整体安装包，需要按子目录与包名分别选择。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-22](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/README.md#L16-L22)

根文档列出两个主题及管理器。

```text
## 住户

| 皮肤 | 包名 | 说明 | 许可 |
|---|---|---|---|
| [maid-atelier](maid-atelier/) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` | 深海女仆工坊：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [orca-link](orca-link/) | `@smalltailqwq/dsh-client-ui-skin-orca-link` | 虎鲸链路：酷酷的小黑鲸操作员，全直角界面加用直线重绘的图标；亮色机能，暗色治愈 | MIT (code) / CC BY-NC-SA 4.0 (artwork) |
| [skin-manager](skin-manager/) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` | 皮肤管理器：切换已安装的皮肤，调整各皮肤自带的选项，在「设置 → 皮肤管理」中打开 | MIT |
```

**依据 2 · 作者声明**：[README.md:33-61](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/README.md#L33-L61)

作者说明发行版入口、单套和多套条件。

<details>
<summary>查看原文（29行）</summary>

````text
## 安装

> [!NOTE]
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

想用 `main` 上的最新代码，也可以按所选皮肤和管理器，在同一个安装框里逐个填入对应的 GitHub 地址（只填地址，不加 `dsh plugin add`）：

```text
github:Small-tailqwq/dsh-deep-whale#main&path:/skin-manager
github:Small-tailqwq/dsh-deep-whale#main&path:/maid-atelier
github:Small-tailqwq/dsh-deep-whale#main&path:/orca-link
```

在默认配置下，DSH 捆绑的 pnpm 11.7.0 优先选择发布满 24 小时的 npm 版本。想立即安装某个刚发布的新版，可以在同一个「添加插件」框里填入 `包名@^版本号`，例如 `@smalltailqwq/dsh-client-ui-skin-orca-link@^0.1.10`（不加命令前缀）。这次显式 `add` 会安装新版，并把具体版本写入 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`，依赖仍保持 caret 范围。此行为对应捆绑版本及默认配置，其他 pnpm 版本或自定义策略可能不同。GitHub 来源不受这项 npm 包龄检查影响。

桌面版通过应用管理自己的 `desktop` profile，不需要先配置 `dsh` 命令。下面的 `web` 命令不会给桌面版安装皮肤。
````

</details>

**依据 3 · 源码核查**：[skin-manager/package.json:19-28](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/package.json#L19-L28)

管理器声明独立 Web 客户端与 bundle。

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
```

</details>

#### 缺口

- 未核对目标发行版和这些主题的实际阅读与输入。
  **影响**：偏好和可操作性不能从预览图推断。
  **进一步探讨**：在备份后的单独 profile 选择一套主题，完成输入、代码阅读及设置操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切换如何写配置、处理版本和确认生效？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

管理器解析当前 profile，并将其配置和更高优先级的 home 配置都作为写目标，按发现的主题生成一套互斥配置。单个文件通过临时文件、fsync 和 rename 替换；第二次写失败会逆序尝试恢复已写层。这说明同步异常时有补偿，两个文件间崩溃或其他进程写入仍可能留下不一致，所查函数没有跨文件锁。版本判断比较主题清单的 DSH peer 范围和宿主版本，豁免按精确主题版本与运行版本匹配。用户明确接受风险后由宿主服务授予豁免，配置可写不代表外观已可用。前端在发请求前监听 body 标记，桌面等待只剩目标主题，超时要求重启；Web 等第一次标记变化后刷新，但超时也继续刷新。标记用来观察挂载进度，输入、滚动和阅读仍需用户验收。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/src/index.ts:88-115](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/index.ts#L88-L115)

当前 loader 优先定位 profile，两层配置参与切换。

<details>
<summary>查看原文（28行）</summary>

```text
/** Resolve the running profile from the root Loader base before using process-level fallbacks. */
export function resolveRuntimeProfilePatch(
  baseUrl: string | undefined,
  env: NodeJS.ProcessEnv = process.env,
  cwd = process.cwd(),
): string {
  if (baseUrl !== undefined) {
    try {
      const baseDir = resolvePath(fileURLToPath(baseUrl))
      if (basename(dirname(baseDir)) === 'profiles') {
        const profile = basename(baseDir)
        if (!/^[a-zA-Z0-9._-]+$/.test(profile)) throw new Error('invalid-profile-name')
        return joinPath(baseDir, 'cordis.patch.yml')
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid-profile-name') throw error
    }
  }
  return resolveProfilePatch(env, cwd)
}

function patchTargetsForProfile(profilePatch: string): string[] {
  return [profilePatch, joinPath(dirname(dirname(dirname(profilePatch))), 'cordis.patch.yml')]
}

/** Both live user layers must agree because the home layer has higher priority. */
export function resolvePatchTargets(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): string[] {
  return patchTargetsForProfile(resolveProfilePatch(env, cwd))
```

</details>

**依据 2 · 源码核查**：[skin-manager/src/index.ts:804-848](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/index.ts#L804-L848)

逐文件原子替换和已写文件的逆向补偿。

<details>
<summary>查看原文（45行）</summary>

```text
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

**依据 3 · 源码核查**：[skin-manager/src/compatibility.ts:69-94](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/compatibility.ts#L69-L94)

清单范围比较与精确版本豁免。

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

**依据 4 · 源码核查**：[skin-manager/src/index.ts:45-54](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/index.ts#L45-L54)

豁免通过宿主服务写入。

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

**依据 5 · 源码核查**：[skin-manager/src/index.ts:1055-1069](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/index.ts#L1055-L1069)

版本不支持时 409，接受风险后放行再写目标。

<details>
<summary>查看原文（15行）</summary>

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
        }
        applyTarget(target as SkinTarget, catalog)
        desktopIcon?.follow(target as SkinTarget)
        json(res, 200, { ok: true, target })
      } catch (error) {
        json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 6 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:1059-1089](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/SkinManager.tsx#L1059-L1089)

监听、HTTP 结果、桌面与 Web 的等待策略。

<details>
<summary>查看原文（31行）</summary>

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
  const completed = await settled
  if (desktop) {
    // A renderer reload replays the shell's startup graph, including disabled skins.
    if (!completed) throw new Error(skinManagerCopy(currentUiLang()).switchRestartRequired)
    return
  }
  window.location.reload()
```

</details>

**依据 7 · 源码核查**：[skin-manager/src/client/switch-settle.ts:35-57](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/switch-settle.ts#L35-L57)

MutationObserver、超时和取消的实际实现。

<details>
<summary>查看原文（23行）</summary>

```text
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

- 未在并发或进程终止下验证两层配置。
  **影响**：同步补偿无法证明崩溃后整体一致。
  **进一步探讨**：在隔离配置目录于两次写之间终止，重启后核对两层与实际挂载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 从首次试用到退出需要承担什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需要选择正确发行版入口、包和 profile，下载美术及代码并可能重启。继续使用需要同时维护主题和管理器版本，宿主升级后核对版本约束和真实交互。若只是看界面变化，一套主题足以判断偏好；增加第二套要额外检查互斥。作者对代码与美术给出不同的许可说明，准备用于商业场景的人需要读对应素材说明后再判断适用范围。失败时优先选择官方外观，观察两套主题标记消失后再测输入框、长代码和设置；管理器不可用时要沿宿主插件界面停用具体主题并核对 profile。主题切换不撤销已经写入的其他用户配置，退出操作应以实际文件和界面读回为准。时间、下载体积、内存、首次与恢复次数均没有同条件测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-61](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/README.md#L40-L61)

包选择、管理器启用和重启由作者声明。

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

在默认配置下，DSH 捆绑的 pnpm 11.7.0 优先选择发布满 24 小时的 npm 版本。想立即安装某个刚发布的新版，可以在同一个「添加插件」框里填入 `包名@^版本号`，例如 `@smalltailqwq/dsh-client-ui-skin-orca-link@^0.1.10`（不加命令前缀）。这次显式 `add` 会安装新版，并把具体版本写入 `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude`，依赖仍保持 caret 范围。此行为对应捆绑版本及默认配置，其他 pnpm 版本或自定义策略可能不同。GitHub 来源不受这项 npm 包龄检查影响。

桌面版通过应用管理自己的 `desktop` profile，不需要先配置 `dsh` 命令。下面的 `web` 命令不会给桌面版安装皮肤。
````

</details>

**依据 2 · 作者声明**：[README.md:289-293](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/README.md#L289-L293)

作者明确区分代码与美术的使用条款和归属。

```text
## 许可

项目自有代码采用 **MIT**，许可范围见 [LICENSE](LICENSE)。美术资源保留原作者版权与既有授权：两套皮肤的全部美术（包括 AI 生成及加工的图片）按 CC BY-NC-SA 4.0 使用，**禁止商业性使用**，署名链见各自 `NOTICE`，许可正文见 `LICENSE-ARTWORK`。图片即使嵌入源码、CSS 或构建产物，也不属于 MIT 授权范围。第三方材料保留其适用许可；历史版本已授出的权限不因本说明而撤销。

皮肤工程脚手架来自 [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)，本仓库仅分发皮肤成品，不包含脚手架。
```

**依据 3 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:688-697](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/SkinManager.tsx#L688-L697)

官方默认入口可作为界面退路。

<details>
<summary>查看原文（10行）</summary>

```text
          className={current === 'official' ? css.defaultActive : css.defaultButton}
          disabled={loading || switching !== null || current === 'official'}
          onClick={() => choose('official')}
        >
          <span>
            <span>{copy.officialName}</span>
            <small>{copy.officialDescription}</small>
          </span>
          <small className={css.defaultState}>
            {current === 'official' ? copy.stateCurrent : switching === 'official' ? copy.stateSwitching : copy.stateSwitch}
```

</details>

**依据 4 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:1059-1089](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/SkinManager.tsx#L1059-L1089)

客户端按官方目标无活动主题进行判断。

<details>
<summary>查看原文（31行）</summary>

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
  const completed = await settled
  if (desktop) {
    // A renderer reload replays the shell's startup graph, including disabled skins.
    if (!completed) throw new Error(skinManagerCopy(currentUiLang()).switchRestartRequired)
    return
  }
  window.location.reload()
```

</details>

#### 缺口

- 未验收从皮肤失配状态回到输入可用界面的恢复。
  **影响**：无法保证所有显示错误都能在管理器中修复。
  **进一步探讨**：用单独 profile 验证默认切回与宿主停用两条路径，并读回保留的用户配置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证可操作性反馈是否补足挂载标记？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前等待能区分配置写入和主题标记变化，仍未检测输入及阅读。可提出待验证的补充是在已观察到目标主题后，让用户做一次短文字输入和一屏代码滚动，并提供同处回默认入口。选一个刚放行的主题版本与已兼容组合，对照现有挂载标记提示，记录切换后不可输入、文字被遮挡、误报完成和回到默认的耗时。若额外步骤没有减少错误成功或频繁打断切换，就不应普遍增加检查。当前适合一套主题的小范围个人试用；需要稳定长时任务或不愿维护多包的人可以继续官方外观。

#### 证据与依据

**依据 1 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:1063-1089](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/SkinManager.tsx#L1063-L1089)

现有成功条件是活动主题及 HTTP，而无具体可操作性任务。

<details>
<summary>查看原文（27行）</summary>

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
  const completed = await settled
  if (desktop) {
    // A renderer reload replays the shell's startup graph, including disabled skins.
    if (!completed) throw new Error(skinManagerCopy(currentUiLang()).switchRestartRequired)
    return
  }
  window.location.reload()
```

</details>

**依据 2 · 源码核查**：[skin-manager/src/client/switch-settle.ts:25-27](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/switch-settle.ts#L25-L27)

活动状态来自 body 属性。

```text
/** Ids of the skins whose body attribute is currently present, in catalog order. */
export function activeSkins(catalog: readonly SkinCatalogEntry[], body: HTMLElement): string[] {
  return catalog.filter(skin => body.hasAttribute(skin.bodyAttr)).map(skin => skin.id)
```

**依据 3 · 源码核查**：[skin-manager/src/client/SkinManager.tsx:688-697](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/skin-manager/src/client/SkinManager.tsx#L688-L697)

已有同处默认外观按钮。

<details>
<summary>查看原文（10行）</summary>

```text
          className={current === 'official' ? css.defaultActive : css.defaultButton}
          disabled={loading || switching !== null || current === 'official'}
          onClick={() => choose('official')}
        >
          <span>
            <span>{copy.officialName}</span>
            <small>{copy.officialDescription}</small>
          </span>
          <small className={css.defaultState}>
            {current === 'official' ? copy.stateCurrent : switching === 'official' ? copy.stateSwitching : copy.stateSwitch}
```

</details>

#### 缺口

- 没有可操作性反馈的实现或用户实验。
  **影响**：无法量化恢复收益与额外操作负担。
  **进一步探讨**：在兼容和版本放行两组条件比较真实任务检查和错误成功率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
