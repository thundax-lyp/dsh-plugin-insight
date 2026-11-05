# dsh-gitbash-preset

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6e873bb](https://github.com/liceses/dsh-gitbash-preset/tree/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09)

<!-- BEGIN META -->
[![GitHub ★ 130](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=130&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liceses/dsh-gitbash-preset) [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@icelily/dsh-gitbash-preset) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@icelily/dsh-gitbash-preset)
<!-- END META -->

> **功能**：复制旧式用户预设文件并提供 Git Bash 执行器，已记录版本发现障碍。

> **亮点**：[Q01](#research-q01) 复用极简文件工具并替换命令解释器。

> **主要限制**：[Q02](#research-q02) 受限沙箱会拒绝，且每次命令重启 shell。

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
  - [Q01 · 插件如何交付 Windows 的 Bash 极简预设？](#detail-section-11)
  - [Q02 · 命令运行状态和权限如何变化？](#detail-section-12)
  - [Q03 · 是否值得改写为当前预设声明？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：原生 Windows 的 DSH 极简用户想用 Bash 语法。

官方 Windows 极简预设使用持久 PowerShell。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预设安装 | 保留极简工作流 | 依赖旧目录 |
| 命令工具 | 运行 MSYS Bash | 每次调用新 shell，受限模式拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows 与 Git for Windows | 执行必需 | 运行 Git Bash | 需核对探测路径 |
| 可发现旧目录的 DSH | 固定安装机制必需 | 加载预设 | 作者报告 0.1.7-rc.2 失效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确认 | 核对宿主机制 | 卡片缺失立即停止 |
| 隔离 | 测试可选会话 | 对照官方工具 |
| 验收 | 核对命令与权限 | 检查 shell 状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 确认兼容宿主及 Git Bash | 可能需改写入口 |
| 持续 | 工时未知 | 按调用管理权限和路径 | 无持久 shell |
| 失败 | 工时未知 | 恢复官方预设 | force 之前备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 命令兼容 | 沿用 Bash 命令 | 版本与权限代价 |

> **思考**：[Q02](#research-q02) 受限沙箱会拒绝，且每次命令重启 shell。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 复用极简文件工具并替换命令解释器。

[Q02](#research-q02) MSYS 使用新 shell，受限模式有明确门槛。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 受限沙箱会拒绝，且每次命令重启 shell。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先验收预设发现和权限，适配前维持官方入口。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

作者记录 0.1.7-rc.2 无预设卡片；本轮静态核对。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、agent-presets/minimal-gitbash/gitbash-executor.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定安装器和执行器源码，作者记录单列，未运行目标或 Windows。
- 下一步：隔离 profile 验证旧目录、新声明、权限和 cwd。

**分析版本**

- **仓库**：[liceses/dsh-gitbash-preset](https://github.com/liceses/dsh-gitbash-preset)
- **版本号**：0.1.3（[固定提交 6e873bb](https://github.com/liceses/dsh-gitbash-preset/tree/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09)）
- **版本日期**：2026-10-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较新声明预设和官方模式的兼容率及审批负担。

隔离 profile 验证旧目录、新声明、权限和 cwd。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 347 | 263 | 62 | — |
| .mjs | test | 1 | 138 | 96 | 24 | — |
| .js | source | 1 | 74 | 45 | 20 | — |
| .md | source | 1 | 388 | — | — | 4090 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/liceses/dsh-gitbash-preset/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/liceses/dsh-gitbash-preset/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/liceses/dsh-gitbash-preset/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 用户能否在保留极简工作流时使用 Git Bash？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件如何交付 Windows 的 Bash 极简预设？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Host 装载时把三份随包预设文件复制到 DSH_HOME 的旧用户预设根，已有文件默认保留。与官方持久 PowerShell 相比，这个变体供熟悉 Bash 的人沿用命令语法和文件工具，每次启动新 shell。作者在 0.1.7-rc.2 观察到插件组件运行但卡片缺失，因此挂载状态不能作为用户入口验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-23](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/README.md#L11-L23)

作者的场景和宿主观察。

<details>
<summary>查看原文（13行）</summary>

```text
DSH 的**极简模式**在 Windows 上不会给你 bash —— 官方按平台分叉，win32 那一支挂的是**持久 PowerShell**。
这个插件交付一个预设变体「**极简模式 (Git Bash)**」：persona 与 `str_replace_editor` 跟官方极简模式**逐字一致**，
只把命令工具换成 `bash`，每次调用真正跑在 **Git for Windows 的 bash（MSYS）** 上。

一句话：**Windows 上想要一个写 bash 的极简模式，装它。**

> [!IMPORTANT]
> **先看版本边界再动手。** 本插件用的是 DSH 早期的「用户预设目录」机制；在本次勘察所用的
> DSH `0.1.7-rc.2` 上，官方已把预设换成 bundle 声明行，**那个目录已不再被读取**。
> 详情与出处见 [已知限制 → DSH 版本边界](#limits-version)。旧版本上是否可用，**未在本机验证**。

![插件管理页里的 @icelily/dsh-gitbash-preset](docs/screenshots/plugin-page.png)
*本机实拍：插件**装上了、组件「运行中」**，但这一页上**没有出现可选的预设卡片** —— 这正是上面那条版本边界的现场表现。*
```

</details>

**依据 2 · 源码核查**：[lib/index.js:23-37](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/lib/index.js#L23-L37)

复制的文件和路径。

<details>
<summary>查看原文（15行）</summary>

```text
const PRESET_ID = 'minimal-gitbash'

/** The packaged preset files that define the preset. */
const PRESET_FILES = ['agent.cordis.yml', 'gitbash-executor.mjs', 'preset.yml']

/** Package-local preset source directory. */
const SOURCE_DIR = fileURLToPath(new URL('../agent-presets/minimal-gitbash/', import.meta.url))

/** The user preset root: ${DSH_HOME:-~/.dsh}/.agent-presets. */
function userPresetRoot() {
  const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  return join(home, '.agent-presets')
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:48-73](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/lib/index.js#L48-L73)

复制及覆盖。

<details>
<summary>查看原文（26行）</summary>

```text
/** Install the packaged preset (idempotent unless force). */
export function apply(ctx, config = {}) {
  const force = config.force === true
  const targetDir = join(userPresetRoot(), PRESET_ID)
  const alreadyInstalled = PRESET_FILES.every((file) => existsSync(join(targetDir, file)))

  if (alreadyInstalled && !force) {
    const outOfDate = PRESET_FILES.some((file) => !filesEqual(join(SOURCE_DIR, file), join(targetDir, file)))
    console.log(
      `[${name}] preset "${PRESET_ID}" already installed at ${targetDir}`
      + (outOfDate
        ? '; packaged files differ — set force: true in the plugin config to overwrite'
        : ''),
    )
    return
  }

  mkdirSync(targetDir, { recursive: true })
  for (const file of PRESET_FILES) {
    cpSync(join(SOURCE_DIR, file), join(targetDir, file), { force: true })
  }
  const testSource = join(SOURCE_DIR, 'test')
  if (existsSync(testSource)) {
    cpSync(testSource, join(targetDir, 'test'), { recursive: true, force: true })
  }
  console.log(`[${name}] installed preset "${PRESET_ID}" -> ${targetDir}`)
```

</details>

#### 缺口

- 未独立核实可用的旧版
  **影响**：当前固定设计无法保证用户可选
  **进一步探讨**：先核对版本预设发现及会话创建

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令运行状态和权限如何变化？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

执行器探测 Git Bash，跳过常见 WSL 启动器目录，可用配置覆盖。每次新 shell，跨调用 cd 或 export 不保留。显式受限模式被执行器拒绝，兼容运行需要完全访问或经审批的单次提升。这个权限成本对于只需要简单命令的工作可能超过语法收益。

#### 证据与依据

**依据 1 · 源码核查**：[agent-presets/minimal-gitbash/gitbash-executor.mjs:77-109](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/agent-presets/minimal-gitbash/gitbash-executor.mjs#L77-L109)

查找 Bash 的顺序。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * Candidates for the Git-for-Windows bash executable, in preference order:
 * the GIT_BASH environment variable, the standard install roots, this
 * machine's known install location, then every real `bash.exe` found on PATH
 * (WSL launcher directories under System32 are skipped).
 */
function shellPathCandidates(env) {
  const candidates = [
    env.GIT_BASH,
    env.ProgramFiles === undefined ? undefined : `${env.ProgramFiles}\\Git\\bin\\bash.exe`,
    env['ProgramFiles(x86)'] === undefined ? undefined : `${env['ProgramFiles(x86)']}\\Git\\bin\\bash.exe`,
    env.LOCALAPPDATA === undefined ? undefined : `${env.LOCALAPPDATA}\\Programs\\Git\\bin\\bash.exe`,
    'D:\\applications\\Git\\bin\\bash.exe',
  ]
  if (typeof env.PATH === 'string' && env.PATH.length > 0) {
    for (const dir of env.PATH.split(';')) {
      if (dir.length === 0) continue
      if (isWslBashDirectory(dir)) continue
      candidates.push(`${dir}\\bash.exe`)
    }
  }
  return candidates
}

/**
 * Resolve the shell executable to spawn. An explicit configuration wins; a
 * POSIX host always gets `bash`. On Windows the first existing candidate is
 * used (GIT_BASH → install roots → PATH), falling back to the bare `bash`
 * name when nothing exists so spawn reports a resolution error.
 */
export function detectShellPath(explicit, env = process.env) {
  if (process.platform !== 'win32') {
    return typeof explicit === 'string' && explicit.length > 0 ? explicit : 'bash'
```

</details>

**依据 2 · 源码核查**：[agent-presets/minimal-gitbash/gitbash-executor.mjs:249-272](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/agent-presets/minimal-gitbash/gitbash-executor.mjs#L249-L272)

执行路径的权限检查。

<details>
<summary>查看原文（24行）</summary>

```text
        ...request.dshEnv === undefined ? {} : { dshEnv: request.dshEnv },
        sandboxPolicy: request.sandboxPolicy ?? (sandboxPolicy?.resolve === undefined ? undefined : sandboxPolicy.resolve()),
      }
    },

    async run(spec) {
      const mode = spec.sandboxPolicy?.mode
      // `undefined` means the deployment carries no sandbox policy at all.
      if (mode !== undefined && mode !== 'danger-full-access') {
        throw new Error(gateMessage(mode))
      }
      const fused = timeoutSignal(spec.signal, spec.timeoutMs)
      try {
        const handle = spawnShell(spec, spec.stdoutMaxBytes, fused.signal)
        let outcome
        try {
          outcome = await handle.done
        } catch (error) {
          throw spawnError(resolved.shellPath, spec.workdir, error)
        }
        const stdout = finalOutput(handle.collected.stdout)
        const stderr = finalOutput(handle.collected.stderr)
        const timedOut = fused.timedOut()
        const aborted = spec.signal !== undefined && spec.signal.aborted && !timedOut
```

</details>

**依据 3 · 作者声明**：[README.md:68-79](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/README.md#L68-L79)

持久性和后台差异。

<details>
<summary>查看原文（12行）</summary>

```text
| | 官方极简模式（POSIX） | 官方极简模式（Windows） | **本预设**（Windows） |
| --- | --- | --- | --- |
| 命令工具名 | `bash` | `pwsh` | `bash` |
| 命令落点 | `bash -c` | PowerShell | `<git bash> -c`（MSYS） |
| 会话状态 | 持久（`cd` / `export` 保留） | 持久（`$env:` 保留） | **每次调用新 shell**（不保留） |
| 路径写法 | `/home/...` | `C:\...`、`$env:NAME` | `/d/...`、`$NAME` |
| 文件工具 | `str_replace_editor` | `str_replace_editor` | `str_replace_editor`（同） |
| persona | 固定一句，`complete: true` | 同 | **逐字相同** |
| 后台命令 | 有 | 有 | **未启用**（`enableRunInBackground: false`） |

「每次调用新 shell」不是偷懒：Windows 上官方把持久 bash 整条支路关掉了（上面那两行 `disabled`），
而本插件的执行器是直接 `spawn` 一个 `bash -c`（见 [工作原理](#how)）—— 这是替代设计，不是等价实现。
```

</details>

#### 缺口

- 未运行 MSYS 和宿主审批
  **影响**：无法确认实际 Windows 路径、权限与工具限制
  **进一步探讨**：测试默认受限拒绝、一次审批和状态清空

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否值得改写为当前预设声明？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议只在隔离的历史兼容环境研究这条路线。迁移实验用声明式预设对照官方 PowerShell，对同一工作区比较卡片可发现、命令成功率和权限升级次数。若可发现性失败，或频繁要求扩大权限，就继续官方工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-23](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/README.md#L17-L23)

当前研究环境卡片缺失。

```text
> [!IMPORTANT]
> **先看版本边界再动手。** 本插件用的是 DSH 早期的「用户预设目录」机制；在本次勘察所用的
> DSH `0.1.7-rc.2` 上，官方已把预设换成 bundle 声明行，**那个目录已不再被读取**。
> 详情与出处见 [已知限制 → DSH 版本边界](#limits-version)。旧版本上是否可用，**未在本机验证**。

![插件管理页里的 @icelily/dsh-gitbash-preset](docs/screenshots/plugin-page.png)
*本机实拍：插件**装上了、组件「运行中」**，但这一页上**没有出现可选的预设卡片** —— 这正是上面那条版本边界的现场表现。*
```

**依据 2 · 作者声明**：[README.md:86-102](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/README.md#L86-L102)

安装、重启及权限成本。

<details>
<summary>查看原文（17行）</summary>

````text
**前置条件**：Windows；装了 **Git for Windows**；DSH 的 Node ≥ 20。

```bash
dsh plugin --profile web add @icelily/dsh-gitbash-preset
```

装完 **重启 DSH**（插件行在启动时装配，重启时才会把预设文件写进用户预设根）。

> **注意包名**：安装命令必须用**包名** `@icelily/dsh-gitbash-preset`，
> 不能写仓库名 `dsh-gitbash-preset` —— 后者在 npm 上不是这个包，会装失败。

然后：**新建会话 → 选「极简模式 (Git Bash)」→ 把会话沙箱切到「完全访问」**，
之后所有 `bash` 调用直接走 Git Bash。想留在 workspace-write 也可以，让模型在第一次调用失败后
按提示用 `sandbox_permissions: "danger-full-access"` + justification 单次升级（走正常审批流程）。

> ⚠️ **先读 [已知限制](#limits)。** 本插件依赖的用户预设目录在当前 DSH 上已不再被读取，
> 装完**可能选不到这个预设**（[出处与核对方式](#limits-version)）。
````

</details>

**依据 3 · 源码核查**：[lib/index.js:48-73](https://github.com/liceses/dsh-gitbash-preset/blob/6e873bb6a1ee3add78f8e2ecce42dabaeb445e09/lib/index.js#L48-L73)

force 和本地覆写风险。

<details>
<summary>查看原文（26行）</summary>

```text
/** Install the packaged preset (idempotent unless force). */
export function apply(ctx, config = {}) {
  const force = config.force === true
  const targetDir = join(userPresetRoot(), PRESET_ID)
  const alreadyInstalled = PRESET_FILES.every((file) => existsSync(join(targetDir, file)))

  if (alreadyInstalled && !force) {
    const outOfDate = PRESET_FILES.some((file) => !filesEqual(join(SOURCE_DIR, file), join(targetDir, file)))
    console.log(
      `[${name}] preset "${PRESET_ID}" already installed at ${targetDir}`
      + (outOfDate
        ? '; packaged files differ — set force: true in the plugin config to overwrite'
        : ''),
    )
    return
  }

  mkdirSync(targetDir, { recursive: true })
  for (const file of PRESET_FILES) {
    cpSync(join(SOURCE_DIR, file), join(targetDir, file), { force: true })
  }
  const testSource = join(SOURCE_DIR, 'test')
  if (existsSync(testSource)) {
    cpSync(testSource, join(targetDir, 'test'), { recursive: true, force: true })
  }
  console.log(`[${name}] installed preset "${PRESET_ID}" -> ${targetDir}`)
```

</details>

#### 缺口

- 未提供新声明可工作的证据
  **影响**：迁移成本和成功率未知
  **进一步探讨**：在受控 profile 对照三个兼容步骤

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
