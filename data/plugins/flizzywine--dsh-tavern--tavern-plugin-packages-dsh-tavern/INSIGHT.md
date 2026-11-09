# dsh-tavern 启动器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3ed20ef](https://github.com/flizzywine/dsh-tavern/tree/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern)

<!-- BEGIN META -->
[![GitHub ★ 1,520](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C520&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flizzywine/dsh-tavern) [![npm 30d 10,991](https://img.shields.io/static/v1?label=npm+30d&message=10%2C991&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tavern)
<!-- END META -->

> **功能**：在官方 DSH 桌面和 DSH NEXT 安装、切换和管理酒馆 Profile，提供进程退出与失败恢复状态。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将桌面切换、启动偏好及安装状态纳入同一面板。迁移、卸载和故障退让有单独边界。

> **主要限制**：[Q03](#research-q03) 固定源码下载可变分支安装脚本，换入失败可能进入人工恢复。[Q02](#research-q02) HTTP 备用路由依赖宿主栅栏和绑定，需核对真实环境。

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
  - [Q01 · 启动器解决哪类桌面操作，和手工 Profile 有何增量？](#detail-section-11)
  - [Q02 · 页面请求怎样进入宿主，安装与切换如何真正执行？](#detail-section-12)
  - [Q03 · 下载、进程与目录切换失败时，哪些恢复可依赖？](#detail-section-13)
  - [Q04 · 环境、权限、空间和退出成本如何盘点？](#detail-section-14)
  - [Q05 · 中断后给出阶段收据能否降低恢复风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需同时用原版 DSH 和酒馆的桌面用户。CLI 可手动指定 profile，官方 GUI 用户需要处理固定入口和回原版。

[Q01](#research-q01) 对照 CLI 手选 profile、官方桌面手工备份与目录链接，以及 NEXT 原生切换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| Profile 切换 | 往返原版与酒馆 | 官方桌面改入口，NEXT 原生切换 |
| 下载安装与更新 | 准备运行环境 | 远程脚本文本当前内容未知 |
| 迁移、卸载与恢复 | 处理安装目录 | 有备份，异常仍可能需人工 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20+ 与兼容 DSH 桌面 | 桌面安装需要 | 加载和宿主命令 | 不安排首次安装 |
| Windows 或 macOS 的 Electron 与 IPC | 首次安装需要 | 确认宿主和重启 | 使用支持的宿主入口 |
| 网络及 PowerShell 或 Bash | 下载安装需要 | 取回和运行脚本 | 下载或执行失败 |
| 足够空间及空目标 | 迁移需要 | 校验副本与保留备份 | 延后迁移 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对当前 Profile、工作与备份 | 已确认活动进程及回退位置 |
| 执行 | 宿主排队等待退出，或 NEXT 发原生切换 | 查看任务状态，pending 仍待完成 |
| 验收 | 用户核对重启后的实际入口和数据 | 需恢复时停下并检查旧入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 网络与安装空间，金额未知 | 校对宿主、Profile、确认及退出 | 下载来源与版本需核对 |
| 持续使用 | 更新下载和临时文件大小未知 | 保存任务、退出并核对重启 | 实际停机和频次未知 |
| 失败恢复 | 旧新副本和重新复制空间 | 核对锁、备份、入口和日志 | 部分故障需人工恢复 |
| 退出 | 保留的数据和备份占用未测 | 盘点数据、验证原版可启动 | 卸载隔离代码与 Profile |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面切换 | 官方目录切换和 NEXT 原生调用 | 实际成功率、耗时和工作中断 |
| 迁移与保留 | 分步复制校验及保留备份 | 各平台容量和故障恢复成本 |
| 恢复提示 | 失联未知与恢复失败门禁 | 崩溃后现场可恢复率 |

> **思考**：[Q03](#research-q03) 固定源码下载可变分支安装脚本，换入失败可能进入人工恢复。[Q02](#research-q02) HTTP 备用路由依赖宿主栅栏和绑定，需核对真实环境。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将桌面切换、启动偏好及安装状态纳入同一面板。迁移、卸载和故障退让有单独边界。

[Q02](#research-q02) 分开原生切换与目录变更。[Q03](#research-q03) 用进程身份而非路径授权清理，并在需要恢复时停重启。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 固定源码下载可变分支安装脚本，换入失败可能进入人工恢复。[Q02](#research-q02) HTTP 备用路由依赖宿主栅栏和绑定，需核对真实环境。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在单宿主和专用目录试一次来回切换，核对恢复路径和留存。若失联、下载或路径校验异常，检查备份再安排后续操作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持两种桌面接线、安装和回退路径。实际下载、宿主兼容、切换与恢复时长未验证。

- 已检查：作者 README、包清单、源码路径 tavern-plugin/packages/dsh-tavern/README.md、tavern-plugin/packages/dsh-tavern/index.js、tavern-plugin/packages/dsh-tavern/client.js、tavern-plugin/packages/dsh-tavern/lib/startup-profile.mjs、tavern-plugin/packages/dsh-tavern/package.json、tavern-plugin/packages/dsh-tavern/cordis.patch.yml、tavern-plugin/packages/dsh-tavern/lib/helper.mjs、tavern-plugin/packages/dsh-tavern/lib/worker.mjs、tavern-plugin/packages/dsh-tavern/lib/installer-download.mjs、tavern-plugin/packages/dsh-tavern/lib/processes.mjs、tavern-plugin/packages/dsh-tavern/lib/installation-processes.mjs、tavern-plugin/packages/dsh-tavern/lib/state.mjs、tavern-plugin/packages/dsh-tavern/lib/installation.mjs 及固定范围 inventory；组件：tavern-plugin/packages/dsh-tavern。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包 Host、Web 客户端、代表下载、Profile 切换、迁移和恢复。未执行目标或远程脚本，也未研究酒馆应用、角色卡质量、模型表现或完整更新器。
- 下一步：[Q05](#research-q05) 以实际入口、备份和读取用户数据为验收，注入两次 rename 前后的故障，测恢复时间、误重启及重复变更。

**分析版本**

- **仓库**：[flizzywine/dsh-tavern](https://github.com/flizzywine/dsh-tavern)
- **版本号**：1.5.2（[固定提交 3ed20ef](https://github.com/flizzywine/dsh-tavern/tree/3ed20efa2a276635e6c22a9c4c80658d118818d0)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 给普通链接切换增加阶段收据与实际路径复核，可能缩短中断恢复。应与已有 pending、journal 和人工检查对照。

[Q05](#research-q05) 以实际入口、备份和读取用户数据为验收，注入两次 rename 前后的故障，测恢复时间、误重启及重复变更。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 962 | 856 | 80 | — |
| .mjs | source | 12 | 2079 | 1795 | 191 | — |
| .md | source | 1 | 269 | — | — | 4409 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 119](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=119&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 117](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=117&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面用户安装或切换酒馆 Profile 时，启动器如何授权、修改入口并恢复失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动器解决哪类桌面操作，和手工 Profile 有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在原版 DSH 与酒馆之间切换的桌面用户，可从设置页进入同一套安装、启动、更新和状态核对。现有 CLI 用户可直接以 --profile 选择，官方 GUI 固定 desktop 入口时才需要链接切换。NEXT 切换交给宿主命令，官方桌面区分本次切换和下次冷启动默认值。包里的 README 从宿主根生成，角色卡、模型提速和缓存指标归宿主应用。

#### 证据与依据

**依据 1 · 作者声明**：[tavern-plugin/packages/dsh-tavern/README.md:139-156](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/README.md#L139-L156)

作者给出官方桌面启动器场景。

<details>
<summary>查看原文（18行）</summary>

````text
### 桌面版（Windows / macOS）

先安装官方 [DeepSeek Harness](https://deepseek.com/harness/)，打开并完成初始设置。推荐使用 **0.2.2-rc.1 或更新的 0.2.x** DSH 内核。然后在下方 **任选一种** 安装方式。

#### 方式一：手动安装（在 DSH 界面操作）

1. **安装酒馆启动器。** 打开左侧的 **插件 → 添加插件**，粘贴下面的地址，点 **安装**，再按提示启用 **dsh-tavern**。

   ```text
   https://cdn.jsdelivr.net/gh/flizzywine/dsh-tavern@launcher-cdn-v1.5.1/dsh-tavern-1.5.1.tgz
   ```

   已安装旧版启动器时，先在插件页移除旧启动器，再添加新版。

   如果 CDN 地址无法访问，可以粘贴 [GitHub Release 的下载地址](https://github.com/flizzywine/dsh-tavern/releases/download/launcher-current/dsh-tavern.tgz)。

2. **安装酒馆。** 打开 **设置 → 酒馆启动器**，点 **安装酒馆** 并确认。已有兼容的酒馆安装可直接切换。
3. **打开酒馆。** 点击 **重启并切换到 DSH 酒馆**。下次启动时打开哪个配置，可以在同一页单独设置。
````

</details>

**依据 2 · 作者声明**：[tavern-plugin/packages/dsh-tavern/README.md:176-195](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/README.md#L176-L195)

作者区分 NEXT 原生 profile 与共享 DSH_HOME。

<details>
<summary>查看原文（20行）</summary>

````text
### DSH NEXT（Windows / macOS）

先打开 DSH NEXT 完成初始设置。推荐使用内核为 **0.2.2-rc.1 或更新的 0.2.x** 的版本。酒馆安装在独立的 `tavern` Profile 中，NEXT 使用自己的 Profile 切换功能。

如果 NEXT 和官方桌面共用同一个 `DSH_HOME`，且官方桌面当前在酒馆中，请先在官方桌面的 **设置 → 酒馆启动器** 切回原版 DSH，再退出官方桌面。这样会恢复真实的 `profiles/desktop` 目录，NEXT 才能切回原版 Profile。

#### 通过插件界面安装

1. 在 NEXT 的 **桌面设置 → Profile** 选择 `desktop`。打开 **插件 → 添加插件**，粘贴下方地址并启用 `dsh-tavern`。如果该 Profile 里装了旧版酒馆启动器，先从插件页移除旧启动器。

   ```text
   https://cdn.jsdelivr.net/gh/flizzywine/dsh-tavern@launcher-cdn-v1.5.1/dsh-tavern-1.5.1.tgz
   ```

   CDN 无法访问时，可以使用 [GitHub Release 下载地址](https://github.com/flizzywine/dsh-tavern/releases/download/launcher-current/dsh-tavern.tgz)。

2. 打开 **设置 → 酒馆启动器**，点 **安装酒馆** 并确认。按提示从应用菜单或托盘退出 NEXT，安装完成后 NEXT 会重新打开。已有兼容安装时可以直接切换。
3. 点 **重启并切换到 DSH 酒馆**。想回到日常配置时，在同一页点 **重启并切换到原版 DSH**。

更新时可在酒馆内打开 **设置 → 酒馆启动器 → 酒馆版本与更新**，检查后点 **准备更新**。准备期间可以继续使用酒馆。等页面提示新版已准备好，点 **重启并应用更新**，NEXT 会重新打开酒馆。
````

</details>

**依据 3 · 源码核查**：[tavern-plugin/packages/dsh-tavern/index.js:74-92](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/index.js#L74-L92)

宿主拒绝 NEXT 链接路径，CLI 已可自行选 profile。

<details>
<summary>查看原文（19行）</summary>

```text
async function runSwitch(mode, paths, payload, updateInstallation) {
  const request = typeof payload === 'object' && payload !== null ? payload : {}
  const next = paths.host === 'next'
  if (next && ['link', 'unlink', 'relocate'].includes(mode)) fail('unsupported', 'NEXT 使用原生 Profile 切换，酒馆 Profile 必须保留为独立目录。')
  if (mode === 'install' && (request.confirmed !== true || (!updateInstallation && !canInstallTavern(paths)))) {
    fail('install-unavailable', '请在桌面的原版配置中确认首次安装。')
  }
  if (mode === 'link' && basename(paths.activeDir) !== 'desktop') {
    fail(
      'not-desktop',
      `This Harness is running profile "${paths.activeName}" (${paths.activeDir}), which you already chose by hand. `
      + 'The profile link exists only for the Desktop app, which hardcodes profiles/desktop; start the app, or run `dsh --profile <name>` instead.',
    )
  }
  const management = ['relocate', 'uninstall'].includes(mode)
    ? validateInstallationRequest(paths, mode, request) : undefined
  const target = mode === 'link' ? validateTarget(paths, request.target) : undefined
  const relaunch = mode === 'install' ? process.execPath : detectAppExe()
  if (!process.versions.electron || !process.send || process.ppid <= 1) {
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/packages/dsh-tavern/client.js:398-413](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/client.js#L398-L413)

NEXT 调原生命令，官方桌面进 RPC。

<details>
<summary>查看原文（16行）</summary>

```text
      async function apply(target) {
        if (actionInFlight.current || busy || pending || updateInProgress(update?.phase) || lastFailure?.recoveryRequired) return
        actionInFlight.current = true
        setBusy(true)
        setFailure(null)
        try {
          if (next) {
            if (typeof window.desktopNext?.command !== 'function') throw new Error(t('nextExplain'))
            await window.desktopNext.command({ type: 'switch', name: target })
            return
          }
          const result = target === 'desktop' ? await call('unlink', {}) : await call('link', { target })
          if (result?.ok === true) {
            setApplied(result.value ?? {})
            setStatus(previous => ({ ...previous, lastResult: { status: 'pending', stamp: result.value?.stamp } }))
          }
```

</details>

**依据 5 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/startup-profile.mjs:26-54](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/startup-profile.mjs#L26-L54)

默认值独立持久化，重启时可续本次切换。

<details>
<summary>查看原文（29行）</summary>

```text
export function setDefaultProfile(home, profile) {
  if (![null, 'tavern'].includes(profile)) throw new Error('默认配置只能设为酒馆或取消设置')
  const file = preferenceFile(home)
  mkdirSync(join(home, 'profile-bridge'), { recursive: true })
  const temporary = file + '.' + randomUUID() + '.tmp'
  writeFileSync(temporary, JSON.stringify({ schemaVersion: 1, defaultProfile: profile }) + '\n', { flag: 'wx', mode: 0o600 })
  renameSync(temporary, file)
  return { defaultProfile: profile }
}

export function initializeDefaultProfile(home, currentProfile) {
  // Preserve the explicitly selected default from older launcher releases once.
  // Thereafter switching never writes this setting.
  if (!existsSync(preferenceFile(home))) setDefaultProfile(home, currentProfile === 'tavern' ? 'tavern' : null)
  return readDefaultProfile(home)
}

export function startupSwitchMode(currentProfile, defaultProfile, env = process.env) {
  if (env[SESSION_SWITCH_ENV] === '1' || !['desktop', 'tavern'].includes(currentProfile)) return undefined
  const desired = defaultProfile || 'desktop'
  if (desired === currentProfile) return undefined
  return desired === 'tavern' ? 'link' : 'unlink'
}

export function relaunchEnvironment(env, continueProfile = false) {
  const result = { ...env }
  delete result.ELECTRON_RUN_AS_NODE
  delete result[SESSION_SWITCH_ENV]
  if (continueProfile) result[SESSION_SWITCH_ENV] = '1'
```

</details>

#### 缺口

- 未比较两种宿主的实际切换用时、成功比例和任务打断。
  **影响**：可判断宿主集成方式，无法据此判断酒馆内容质量或实际节时。
  **进一步探讨**：在同版本、同样本 profile 下比较人工切换、插件切换、返回原版及下次冷启动。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面请求怎样进入宿主，安装与切换如何真正执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH bundle 挂 Host，manifest 声明 Web 客户端。首选 Connection RPC；不能注册时用独立 HTTP 路由，先调用宿主 requestRejection，缺服务或抛错才依 Host 头 localhost 形式。备用路由限制 POST、JSON 大小和方法名匹配，但 Host 头无法独立证明传输来源或会话身份。管理请求验证确认、宿主和路径，排队并启动脱离主进程的助手。官方链接切换等桌面退出后保存旧入口，再放入 junction 或链接；首次官方安装是独立分支，安装脚本先准备非活跃 profile。NEXT 更新准备以 stamp 验证，确认且退出后才开启发布闸。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/packages/dsh-tavern/package.json:44-59](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/package.json#L44-L59)

bundle、客户端与 Node 约束。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
  },
  "engines": {
    "node": ">=20.0.0"
  }
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/packages/dsh-tavern/cordis.patch.yml:1-5](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/cordis.patch.yml#L1-L5)

Host 插入接线。

```text
# Tavern launcher bundle patch: one Host+Client plugin row.
# The browser half is discovered through the package.json dsh.client declaration.
- insert:
    - id: profile-bridge
      name: 'dsh-tavern'
```

**依据 3 · 源码核查**：[tavern-plugin/packages/dsh-tavern/index.js:164-173](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/index.js#L164-L173)

宿主栅栏与 Host 头退让。

<details>
<summary>查看原文（10行）</summary>

```text
function rejectRequest(ctx, req) {
  try {
    const rejection = ctx.connection?.requestRejection?.({ headers: req.headers })
    if (rejection !== undefined) return rejection
    if (typeof ctx.connection?.requestRejection === 'function') return undefined
  } catch {
    /* fall through to the local rule */
  }
  const host = String(req.headers.host ?? '').replace(/:\d+$/u, '').replace(/^\[|\]$/gu, '')
  return host === '127.0.0.1' || host === 'localhost' || host === '::1' ? undefined : 403
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/packages/dsh-tavern/index.js:181-194](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/index.js#L181-L194)

备用路由限制请求体。

<details>
<summary>查看原文（14行）</summary>

```text
async function readJsonBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > BODY_LIMIT_BYTES) fail('payload-too-large', 'Request body is too large for this channel.')
    chunks.push(chunk)
  }
  if (size === 0) return undefined
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    fail('bad-request', 'Request body must be JSON.')
  }
```

</details>

**依据 5 · 源码核查**：[tavern-plugin/packages/dsh-tavern/index.js:229-268](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/index.js#L229-L268)

RPC 优先及备用路由实际顺序。

<details>
<summary>查看原文（40行）</summary>

```text
  // Preferred: the Connection service's own channel registry (it also applies the
  // browser-trust fence and session authentication).
  try {
    const disposer = ctx.connection.rpc.handle(CHANNEL, async (endpoint, payload) => handleCall(ctx, endpoint, payload))
    ctx.effect(() => disposer, 'profile-bridge: shared rpc channel')
    return
  } catch (error) {
    ctx.logger?.debug?.(`profile-bridge: connection.rpc.handle unavailable (${String(error?.message ?? error)}); serving the channel directly`)
  }

  // Fallback: the same envelope on our own Web route, guarded by the same fence.
  const route = {
    kind: 'prefix',
    path: CHANNEL,
    handler: async (req, res) => {
      try {
        const rejection = rejectRequest(ctx, req)
        if (rejection !== undefined) {
          res.writeHead(rejection, { 'content-type': 'text/plain; charset=utf-8' })
          res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
          return
        }
        if (req.method !== 'POST') {
          res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' })
          res.end('method not allowed')
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const endpoint = decodeURIComponent(pathname.slice(CHANNEL.length).replace(/^\/+/u, ''))
        const message = await readJsonBody(req)
        const rpcId = typeof message?.rpcId === 'string' ? message.rpcId : 'invalid-request'
        if (message?.type !== 'client-request' || typeof message.method !== 'string' || message.method !== endpoint) {
          sendJson(res, 400, {
            type: 'server-response',
            rpcId,
            result: { ok: false, error: { code: 'bad-request', message: 'the client-request envelope must name this endpoint' } },
          })
          return
        }
        sendJson(res, 200, { type: 'server-response', rpcId, result: await handleCall(ctx, endpoint, message.payload) })
```

</details>

**依据 6 · 源码核查**：[tavern-plugin/packages/dsh-tavern/index.js:74-108](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/index.js#L74-L108)

桌面限定、授权、排队和退出分支。

<details>
<summary>查看原文（35行）</summary>

```text
async function runSwitch(mode, paths, payload, updateInstallation) {
  const request = typeof payload === 'object' && payload !== null ? payload : {}
  const next = paths.host === 'next'
  if (next && ['link', 'unlink', 'relocate'].includes(mode)) fail('unsupported', 'NEXT 使用原生 Profile 切换，酒馆 Profile 必须保留为独立目录。')
  if (mode === 'install' && (request.confirmed !== true || (!updateInstallation && !canInstallTavern(paths)))) {
    fail('install-unavailable', '请在桌面的原版配置中确认首次安装。')
  }
  if (mode === 'link' && basename(paths.activeDir) !== 'desktop') {
    fail(
      'not-desktop',
      `This Harness is running profile "${paths.activeName}" (${paths.activeDir}), which you already chose by hand. `
      + 'The profile link exists only for the Desktop app, which hardcodes profiles/desktop; start the app, or run `dsh --profile <name>` instead.',
    )
  }
  const management = ['relocate', 'uninstall'].includes(mode)
    ? validateInstallationRequest(paths, mode, request) : undefined
  const target = mode === 'link' ? validateTarget(paths, request.target) : undefined
  const relaunch = mode === 'install' ? process.execPath : detectAppExe()
  if (!process.versions.electron || !process.send || process.ppid <= 1) {
    fail('not-desktop', '请在 DSH 桌面中执行此操作。')
  }
  // Snapshot before quitting: detached children lose a trustworthy parent once it exits.
  const ownership = await captureOwnedProcesses([process.pid, process.ppid])
  const result = scheduleSwitch({ ...management, mode, host: paths.host, appDir: updateInstallation?.logicalAppDir,
    home: paths.home, profilesRoot: paths.profilesDir, liveDir: paths.activeDir,
    activeName: paths.activeName, targetDir: target?.dir, stateDir: paths.stateDir,
    stamp: new Date().toISOString().replace(/[:.]/g, '-') + '-' + process.pid,
    pids: [process.pid, process.ppid], ownership, relaunch })
  if (mode === 'install' && !next) return { ...result, mode, warnings: [], reopensApp: true }
  const closesApp = !next && await requestDesktopQuit({ pid: process.ppid, executable: relaunch }, {
    onError: error => {
      try { appendFileSync(result.logPath, new Date().toISOString() + ' 自动退出失败，可从托盘退出：' + error.message + '\n') } catch {}
    },
  })
  return { ...result, mode, target: target?.name, warnings: target?.warnings ?? [], closesApp, reopensApp: true }
```

</details>

**依据 7 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:349-379](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L349-L379)

先拿锁写请求，再启动 detached helper。

<details>
<summary>查看原文（31行）</summary>

```text
export function scheduleSwitch(request, options = {}) {
  assertManagementJournalComplete(request.stateDir)
  const last = readLastResult(request.stateDir, options)
  if (last?.recoveryRequired) {
    throw Object.assign(new Error(`上次切换需要检查入口与备份，未安排新切换：${last.message} 日志：${last.logPath}`), { code: 'recovery-required' })
  }
  const { lock, reclaimed } = acquirePendingLock(request.stateDir, { ...options, installing: request.mode === 'install' })
  const job = join(lock, 'request.json')
  let worker = fileURLToPath(new URL('./worker.mjs', import.meta.url))
  try {
    if (['install', 'relocate', 'uninstall'].includes(request.mode)) {
      // Run from state storage: the transaction may quarantine the source that
      // originally loaded this plugin. All imports must survive that operation.
      const runtime = join(lock, 'runtime')
      mkdirSync(runtime)
      const library = dirname(fileURLToPath(import.meta.url))
      for (const name of readdirSync(library).filter(name => /\.(mjs|ps1)$/.test(name))) {
        copyFileSync(join(library, name), join(runtime, name))
      }
      if (request.mode !== 'install') copyFileSync(join(request.installation.appDir, 'bin', 'installation-state.cjs'), join(runtime, 'installation-state.cjs'))
      worker = join(runtime, 'worker.mjs')
    }
    writeFileSync(job, JSON.stringify(request), { flag: 'wx', mode: 0o600 })
    writeFileSync(join(request.stateDir, 'last-result.json'), JSON.stringify({ status: 'pending', mode: request.mode, stamp: request.stamp }), { mode: 0o600 })
    const child = spawn(process.execPath, [worker, job], { detached: true, stdio: 'ignore', cwd: request.stateDir, env: { ...process.env, ...(process.versions.electron ? { ELECTRON_RUN_AS_NODE: '1' } : {}) } })
    if (Number.isInteger(child.pid) && child.pid > 1) {
      try { writeFileSync(join(lock, 'worker.json'), JSON.stringify({ pid: child.pid, startedAt: Date.now() }), { flag: 'wx', mode: 0o600 }) } catch {}
    }
    child.on('error', () => { /* request stays on disk for diagnosis; no profile was changed */ })
    child.unref()
    return { pid: child.pid, logPath: join(request.stateDir, 'last-run.log'), reclaimed, stamp: request.stamp }
```

</details>

**依据 8 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:55-83](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L55-L83)

只改 desktop 入口，先备份再换入。

<details>
<summary>查看原文（29行）</summary>

```text
// The caller must own the operation lock and have waited for Desktop and its Host to exit.
export async function switchProfile({ mode, profilesRoot, liveDir, targetDir, stamp }, { rename = renameSync, link = symlinkSync, removeLink = unlinkSync, retry = {} } = {}) {
  const move = (from, to) => renameWithRetry(from, to, { rename, ...retry })
  const root = realpathSync(profilesRoot)
  if (resolve(liveDir) !== join(resolve(profilesRoot), 'desktop')) throw new Error('只允许切换 desktop 入口')
  const linked = present(liveDir) && lstatSync(liveDir).isSymbolicLink()
  let destination
  if (mode === 'link') {
    destination = realpathSync(targetDir)
    if ((dirname(destination) !== root && registeredTavernTarget(profilesRoot, targetDir) !== destination) || destination === join(root, 'desktop') || /\.fresh-|\.switch-/.test(destination.slice(root.length))) throw new Error('目标必须是 profiles 下的独立 profile')
    manifest(destination)
    if (present(liveDir) && realpathSync(liveDir) === destination) return { changed: false }
  } else if (mode === 'unlink') {
    if (!linked) throw new Error('desktop 不是链接，无需还原')
    destination = readdirSync(profilesRoot).filter(name => name.startsWith('desktop.fresh-')).sort().reverse()
      .map(name => join(profilesRoot, name)).find(dir => { try { return lstatSync(dir).isDirectory() && !lstatSync(dir).isSymbolicLink() && (manifest(dir), true) } catch { return false } })
    if (!destination) throw new Error('找不到可用的原版 desktop 备份，未修改目录')
  } else throw new Error('未知切换操作')
  if (!present(liveDir)) throw new Error('desktop 入口不存在，未执行切换')
  const previous = join(profilesRoot, linked ? `desktop.switch-${stamp}` : `desktop.fresh-${stamp}`)
  const staged = join(profilesRoot, `desktop.switch-stage-${stamp}`)
  if (present(previous) || present(staged)) throw new Error('备份路径已存在')
  if (mode === 'link') link(registeredTavernTarget(profilesRoot, targetDir) === destination ? resolve(targetDir) : destination, staged, process.platform === 'win32' ? 'junction' : 'dir')
  let moved = false
  let failure
  try {
    await move(liveDir, previous)
    moved = true
    await move(mode === 'link' ? staged : destination, liveDir)
```

</details>

**依据 9 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:220-239](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L220-L239)

NEXT readiness 和确认 stamp。

<details>
<summary>查看原文（20行）</summary>

```text
export function nextUpdatePreparation(paths, lastResult = readLastResult(paths.stateDir)) {
  if (paths.host !== 'next' || lastResult?.status !== 'pending' || lastResult.mode !== 'install') return undefined
  const request = readJson(join(paths.stateDir, 'install-pending', 'request.json'))
  if (!stagesNextUpdate(request) || request.stamp !== lastResult.stamp || request.liveDir !== paths.activeDir
      || request.pids?.[0] !== process.pid || request.pids?.[1] !== process.ppid) return undefined
  const gate = installPublishGate(paths.stateDir)
  if (existsSync(nextUpdateRestartMarker(paths.stateDir, request.stamp))) return 'restarting'
  return existsSync(gate + '.ready') ? 'ready' : 'preparing'
}

export function confirmNextUpdate(paths, stamp) {
  const lastResult = readLastResult(paths.stateDir)
  const phase = nextUpdatePreparation(paths, lastResult)
  if (lastResult?.stamp !== stamp || !['ready', 'restarting'].includes(phase)) {
    throw Object.assign(new Error('新版尚未准备好，或当前更新已结束。请刷新后重试。'), { code: 'update-not-ready' })
  }
  try { writeFileSync(nextUpdateRestartMarker(paths.stateDir, lastResult.stamp), '', { flag: 'wx', mode: 0o600 }) } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
  return { confirmed: true }
```

</details>

**依据 10 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/worker.mjs:24-37](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/worker.mjs#L24-L37)

官方首次安装用非活跃模式。

<details>
<summary>查看原文（14行）</summary>

```text
  const env = { ...process.env, ...proxyEnv, DSH_HOME: request.home, DSH_TAVERN_HOST: next ? 'next' : 'desktop',
    DSH_DESKTOP_APP_EXECUTABLE: request.relaunch, DSH_TAVERN_LAUNCHER_INSTALL: '1', DSH_TAVERN_PUBLISH_GATE: gate }
  if (next) {
    env.DSH_TAVERN_NEXT_EXECUTABLE = request.relaunch
    if (!waitForDesktop) writeFileSync(gate, 'publish', { flag: 'wx' })
  } else {
    env.DSH_TAVERN_LATE_PUBLISH = '1'
    env.DSH_TAVERN_INSTALL_INACTIVE = '1'
    env.DSH_TAVERN_PREPARING_DESKTOP_PID = String(request.pids[1])
  }
  if (request.appDir) env.DSH_TAVERN_APP_DIR = request.appDir
  writeFileSync(gate + '.progress', '正在下载酒馆文件…')
  if (replacesNext) env.DSH_TAVERN_REQUIRE_NEXT_MIGRATION = '1'
  for (const key of ['ELECTRON_RUN_AS_NODE', 'DSH_PROFILE', 'DSH_PROFILE_DIR']) delete env[key]
```

</details>

**依据 11 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/worker.mjs:50-66](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/worker.mjs#L50-L66)

NEXT 更新等待确认、退出后 publish，出错 cancel。

<details>
<summary>查看原文（17行）</summary>

```text
    if (waitForDesktop) {
      try {
        const restart = nextUpdateRestartMarker(request.stateDir, request.stamp)
        while (!finished && !existsSync(restart)) {
          if (!request.pids.every(processAlive)) throw new Error('NEXT 在确认更新前退出，已取消本次准备。')
          await delay(250)
        }
        if (!finished) {
          writeFileSync(gate + '.progress', '正在等待 NEXT 退出并应用更新…')
          await waitForDesktop()
          if (!finished) writeFileSync(gate, 'publish', { flag: 'wx' })
        }
      } catch (error) {
        if (!finished) writeFileSync(gate, 'cancel', { flag: 'wx' })
        await completion
        throw error
      }
```

</details>

#### 缺口

- 本轮未装宿主检查连接服务、实际 Electron 行为或安装完成，重点开放问题是备用路由的绑定、代理与权限。
  **影响**：只能确认固定源码两套保护条件及排队路径，实际可达性依宿主绑定。
  **进一步探讨**：同一隔离宿主分别测试 Connection 可用、缺失与抛错，并检查拒绝、端口绑定和工作目录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 下载、进程与目录切换失败时，哪些恢复可依赖？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

下载端按 CDN 和仓库 main 多源获取安装脚本，以字符串标记检查能力后执行，所读入口没有为脚本文本验签或比对固定摘要。HTTP、超时和不兼容脚本有换源或报错。Windows 会按启动前捕获的 PID、创建时间及父子关系限定清理对象，先确认根进程退出，再在目录重试时清理。迁移卸载依赖空闲检查，无授权或无法核实的进程会阻止。链接换入失败时尝试移回旧入口；回滚失败标为需人工恢复，后台助手此时不重新启动。助手失联使 pending 成为结果未知。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installer-download.mjs:30-48](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installer-download.mjs#L30-L48)

HTTP 与 curl 超时及 HTTPS 约束。

<details>
<summary>查看原文（19行）</summary>

```text
async function fetchScript(source) {
  const response = await fetch(source, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) {
    await response.body?.cancel().catch(() => {})
    throw Object.assign(new Error('HTTP'), { status: response.status })
  }
  return response.text()
}

async function curlScript(source, proxy) {
  // Old Electron versions cannot configure fetch's proxy. Windows and macOS
  // ship curl, which also supports explicit SOCKS proxies from the environment.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(https?_proxy|all_proxy|no_proxy)$/i.test(key)))
  const command = process.platform === 'win32' ? 'curl.exe' : 'curl'
  const { stdout } = await execute(command, ['-q', '--fail', '--silent', '--show-error', '--location', '--proto', '=https',
    '--proto-redir', '=https', '--max-time', String(TIMEOUT_MS / 1000), source], {
    env: { ...env, ...proxy }, encoding: 'utf8', timeout: TIMEOUT_MS + 1000, windowsHide: true,
  })
  return stdout
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installer-download.mjs:61-93](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installer-download.mjs#L61-L93)

下载 URL 可变，接受条件是特征标记。

<details>
<summary>查看原文（33行）</summary>

```text
  const sources = [
    `https://cdn.jsdelivr.net/gh/${REPOSITORY}@runtime-archive-main/${name}`,
    `https://raw.githubusercontent.com/${REPOSITORY}/main/${name}?launcher=${Date.now()}`,
    ...['fastly', 'gcore'].map(node => `https://${node}.jsdelivr.net/gh/${REPOSITORY}@runtime-archive-main/${name}`),
  ]
  const requirements = [
    [preparingUpdate, '.ready', '安装脚本尚未支持准备更新'],
    [true, 'DSH_TAVERN_INSTALL_INACTIVE', '安装脚本尚未同步'],
    [next, 'DSH_TAVERN_UNIFIED_DESKTOP', '安装脚本尚未同步统一桌面安装支持'],
    [replacesNext, 'DSH_TAVERN_REQUIRE_NEXT_MIGRATION', '安装脚本尚未支持 NEXT 迁移'],
  ]
  try {
    for (const source of sources) {
      const host = new URL(source).hostname
      let content
      try {
        content = proxy.HTTPS_PROXY && !restore ? await curlScript(source, proxy) : await fetchScript(source)
      } catch (error) {
        log(`安装脚本下载失败 ${host}：${describeFailure(error)}`)
        continue
      }
      const missing = requirements.find(([required, marker]) => required && !content.includes(marker))
      if (missing) {
        log(`安装脚本不可用 ${host}：${missing[2]}`)
        continue
      }
      log(`已从 ${host} 下载酒馆安装脚本。`)
      return { content, proxyEnv: detected.added }
    }
    throw new Error('无法获取可用的酒馆安装脚本。请检查网络连接，或复制诊断日志。')
  } finally {
    restore?.()
  }
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/worker.mjs:17-43](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/worker.mjs#L17-L43)

脚本落盘后以 PowerShell 或 Bash 执行。

<details>
<summary>查看原文（27行）</summary>

```text
  const script = join(request.stateDir, 'install-pending', 'runtime', name)
  const gate = installPublishGate(request.stateDir)
  const transcriptPath = join(request.stateDir, 'last-run.log.out')
  writeFileSync(transcriptPath, '')
  writeFileSync(gate + '.progress', '正在下载安装脚本…')
  const { content, proxyEnv } = await downloadInstaller(name, { log, preparingUpdate: Boolean(waitForDesktop), next, replacesNext })
  writeFileSync(script, windows ? '\uFEFF' + content : content, { flag: 'wx', mode: 0o600 })
  const env = { ...process.env, ...proxyEnv, DSH_HOME: request.home, DSH_TAVERN_HOST: next ? 'next' : 'desktop',
    DSH_DESKTOP_APP_EXECUTABLE: request.relaunch, DSH_TAVERN_LAUNCHER_INSTALL: '1', DSH_TAVERN_PUBLISH_GATE: gate }
  if (next) {
    env.DSH_TAVERN_NEXT_EXECUTABLE = request.relaunch
    if (!waitForDesktop) writeFileSync(gate, 'publish', { flag: 'wx' })
  } else {
    env.DSH_TAVERN_LATE_PUBLISH = '1'
    env.DSH_TAVERN_INSTALL_INACTIVE = '1'
    env.DSH_TAVERN_PREPARING_DESKTOP_PID = String(request.pids[1])
  }
  if (request.appDir) env.DSH_TAVERN_APP_DIR = request.appDir
  writeFileSync(gate + '.progress', '正在下载酒馆文件…')
  if (replacesNext) env.DSH_TAVERN_REQUIRE_NEXT_MIGRATION = '1'
  for (const key of ['ELECTRON_RUN_AS_NODE', 'DSH_PROFILE', 'DSH_PROFILE_DIR']) delete env[key]
  const command = windows ? 'powershell.exe' : '/bin/bash'
  const args = windows ? ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', script] : [script]
  const transcript = openSync(transcriptPath, 'w', 0o600)
  try {
    const child = spawn(command, args, { env, stdio: ['ignore', transcript, transcript], windowsHide: true })
    let finished = false
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/processes.mjs:115-135](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/processes.mjs#L115-L135)

父子关系与创建时间限定身份。

<details>
<summary>查看原文（21行）</summary>

```text
    for (const row of rows) {
      const parent = owned.get(row.parentPid)
      if (!valid(row) || !parent || protectedPids.has(row.pid) || owned.has(row.pid)) continue
      // Parent PID in a snapshot can already belong to a newer process.
      if (BigInt(row.created) < BigInt(parent.created)) continue
      owned.set(row.pid, row); descendants.push(row); changed = true
    }
  }
  return { roots, descendants }
}

export async function captureOwnedProcesses(pids, { platform = process.platform, inspect = powershell } = {}) {
  if (platform !== 'win32') return undefined
  const snapshot = await inspect('[pscustomobject]@{ inspectorPid=$PID; rows=@([BridgeProcesses]::Snapshot()) } | ConvertTo-Json -Depth 5 -Compress')
  const ownership = selectOwnedProcesses(snapshot.rows, pids, [snapshot.inspectorPid])
  const [host, desktop] = ownership.roots
  // process.ppid itself is only a PID. The captured Desktop must predate its
  // Host, otherwise an exited Desktop's recycled PID could own unrelated work.
  if (pids.length !== 2 || ownership.roots.length !== 2 || host.parentPid !== desktop.pid
      || BigInt(host.created) < BigInt(desktop.created)) throw new Error('无法确认桌面与 Host 的父子进程身份，未安排切换；请重试')
  return ownership
```

</details>

**依据 5 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/processes.mjs:138-167](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/processes.mjs#L138-L167)

退出确认及清理限定已捕获对象。

<details>
<summary>查看原文（30行）</summary>

```text
/** Called only after normal Desktop quit, and only when a rename is blocked. */
export async function cleanupOwnedProcesses(ownership, { platform = process.platform, inspect = powershell, log = () => {}, selfPid = process.pid } = {}) {
  if (platform !== 'win32' || !ownership) return []
  if (!Array.isArray(ownership.roots) || !ownership.roots.length || !ownership.roots.every(valid)
      || !Array.isArray(ownership.descendants) || !ownership.descendants.every(valid)) throw new Error('无效的桌面进程身份记录；未结束任何进程')
  const payload = Buffer.from(JSON.stringify({ ...ownership, selfPid }), 'utf8').toString('base64')
  const result = await inspect(`
$data = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${payload}')) | ConvertFrom-Json
foreach ($root in $data.roots) {
  if (-not [BridgeProcesses]::WaitExit([int]$root.pid, [string]$root.created, 0)) { throw 'Desktop is still running; refusing descendant cleanup' }
}
# Protect the worker and this inspector, including descendants, even if a corrupt
# or old request accidentally listed them. Never infer NEW owned descendants here.
$rows = @([BridgeProcesses]::Snapshot())
$protected = New-Object 'System.Collections.Generic.HashSet[int]'
[void]$protected.Add([int]$data.selfPid); [void]$protected.Add($PID)
do {
  $changed = $false
  foreach ($row in $rows) { if ($protected.Contains($row.parentPid) -and $protected.Add($row.pid)) { $changed = $true } }
} while ($changed)
$results = @()
$failure = $null
$watch = [Diagnostics.Stopwatch]::StartNew()
# Leaf-first minimizes orphan churn. The captured list is parent-first.
$items = @($data.descendants); [array]::Reverse($items)
try { foreach ($item in $items) {
  if ($protected.Contains([int]$item.pid) -or @($data.roots.pid) -contains $item.pid) { continue }
  $remaining = [Math]::Max(0, 15000 - $watch.ElapsedMilliseconds)
  if ($remaining -eq 0) { throw 'Descendant cleanup timed out' }
  $status = [BridgeProcesses]::Stop([int]$item.pid, [string]$item.created, [uint32][Math]::Min(5000, $remaining))
```

</details>

**依据 6 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installation-processes.mjs:58-85](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installation-processes.mjs#L58-L85)

迁移与卸载发现可能占用即拒绝。

<details>
<summary>查看原文（28行）</summary>

```text
  const home = request.home || request.installation?.sharedHome
  if (typeof home !== 'string' || !home) fail('无法确定安装归属，未修改目录。')
  const pidFile = path.join(home, 'logs', 'tavern.pid.json')
  try {
    const record = JSON.parse(read(pidFile, 'utf8'))
    if (!Number.isSafeInteger(record?.pid) || record.pid <= 1) fail(`酒馆服务进程记录无效，请检查：${pidFile}`)
    // Even a recycled PID is a reason to refuse, not a reason to terminate it.
    if (record.pid === selfPid || await alive(record.pid)) fail(`酒馆独立服务可能仍在运行（PID ${record.pid}）。请正常退出并核对 ${pidFile} 后重试；未结束任何进程。`)
  } catch (error) {
    if (error.code !== 'ENOENT') fail(`无法确认酒馆独立服务已停止：${error.message}`)
  }
  let snapshot
  try { snapshot = await inventory() } catch (error) { fail(`无法读取进程清单，未修改目录：${error.message}`) }
  if (!Array.isArray(snapshot?.rows) || snapshot.rows.length === 0) fail('进程清单为空或无效，无法确认安装空闲。')
  const roots = [home, request.installation?.appDir, request.installation?.profileDir, request.installation?.dataDir,
    ...(request.installation?.entries || []).flatMap(entry => [entry.from, entry.to])].filter(value => typeof value === 'string' && value)
    .map(value => normalize(value, platform))
  for (const row of snapshot.rows) {
    if (!Number.isSafeInteger(row?.pid) || row.pid < 0) fail('进程清单包含无效 PID，未修改目录。')
    if (row.pid === selfPid || row.pid === snapshot.inspectorPid || row.pid <= 1) continue
    const command = typeof row.commandLine === 'string' ? row.commandLine : ''
    const identity = `${row.name || ''} ${row.executable || ''} ${command}`
    const executable = executableName(row.executable || row.name || firstArgument(command))
    const isGui = gui.test(executable)
    const knownRuntime = runtime.test(executable)
    if (!knownRuntime && !isGui) continue
    // A relevant executable with hidden arguments cannot be cleared safely.
    if (!command.trim()) fail(`无法检查运行时进程 PID ${row.pid} 的参数；请正常退出相关程序后重试。`)
```

</details>

**依据 7 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:77-104](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L77-L104)

改名、移回和恢复失败分支。

<details>
<summary>查看原文（28行）</summary>

```text
  if (mode === 'link') link(registeredTavernTarget(profilesRoot, targetDir) === destination ? resolve(targetDir) : destination, staged, process.platform === 'win32' ? 'junction' : 'dir')
  let moved = false
  let failure
  try {
    await move(liveDir, previous)
    moved = true
    await move(mode === 'link' ? staged : destination, liveDir)
  } catch (error) {
    failure = error
    if (moved) {
      try { await move(previous, liveDir) } catch (rollback) {
        failure = Object.assign(new Error(`切换失败且自动恢复失败；请勿启动桌面或重新切换。原入口保存在 ${previous}，目标为 ${destination}：${rollback.message}`, { cause: error }), { code: 'recovery-required', recoveryRequired: true, previous, destination })
        throw failure
      }
    }
    throw error
  } finally {
    try {
      if (present(staged) && lstatSync(staged).isSymbolicLink()) removeLink(staged)
    } catch (cleanupError) {
      // Never mask recoveryRequired: restarting with a missing desktop can create
      // a new profile over the transaction we need to recover.
      if (failure) failure.message += `；临时链接未能清理 ${staged}：${cleanupError.message}`
      else throw cleanupError
    }
  }
  if (linked) unlinkSync(previous) // remove only the saved link, never its target
  return { changed: true, target: realpathSync(liveDir), backup: linked ? undefined : previous }
```

</details>

**依据 8 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:173-200](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L173-L200)

失联报告结果未知，阻止视为成功。

<details>
<summary>查看原文（28行）</summary>

```text
export function readLastResult(stateDir, { alive = processAlive, now = Date.now } = {}) {
  try {
    const result = JSON.parse(readFileSync(join(stateDir, 'last-result.json'), 'utf8'))
    if (!result || !['pending', 'succeeded', 'failed'].includes(result.status)) return undefined
    if (result.status === 'pending') {
      let worker
      try { worker = JSON.parse(readFileSync(join(stateDir, result.mode === 'install' ? 'install-pending' : 'pending', 'worker.json'), 'utf8')) } catch {}
      const hasWorker = Number.isInteger(worker?.pid) && worker.pid > 1
      const abandoned = hasWorker ? !alive(worker.pid)
        : now() - statSync(join(stateDir, 'last-result.json')).mtimeMs > 3 * 60 * 1000
      if (abandoned) {
        // A helper may have died between moves: never claim the old entry is
        // intact or silently offer another transaction before manual inspection.
        result.status = 'failed'
        result.code = 'helper-exited'
        result.message = '切换助手已退出或未能启动，结果不确定；请检查日志、当前入口和备份目录。'
        result.recoveryRequired = true
      }
    }
    return {
      status: result.status,
      mode: result.mode,
      stamp: result.stamp,
      finishedAt: result.finishedAt,
      updated: result.updated === true,
      message: typeof result.message === 'string' ? result.message : '',
      code: typeof result.code === 'string' ? result.code : undefined,
      recoveryRequired: result.recoveryRequired === true,
```

</details>

**依据 9 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/worker.mjs:156-185](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/worker.mjs#L156-L185)

阻塞重试及恢复失败时禁止自动重启。

<details>
<summary>查看原文（30行）</summary>

```text
      if (!stagedUpdate && (request.mode !== 'install' || request.host === 'next')) await waitForDesktop()
      let cleaned = false
      const result = await perform(request, { log, waitForDesktop: stagedUpdate ? waitForDesktop : undefined, retry: { onRetry: async ({ from, to, code, attempt }) => {
        log(`目录占用重试 ${attempt}: ${code} ${from} → ${to}`)
        if (!cleaned) {
          cleaned = true
          // Only identities captured while Desktop was still alive are eligible.
          // Unrelated sessions and unknown occupiers are never force-closed.
          if (request.ownership && !['relocate', 'uninstall'].includes(request.mode)) await cleanup(request.ownership, { log })
          else log('无可验证的桌面子进程记录；仅等待目录锁释放，不结束任何进程。')
        }
      } } })
      log(JSON.stringify(result))
      const message = stagedUpdate ? '酒馆更新完成。' : request.mode === 'install' ? '酒馆安装完成。' : '切换完成。'
      persist({ status: 'succeeded', message, updated: stagedUpdate })
      log(message)
    } catch (error) {
      failed = true
      recoveryRequired = error.recoveryRequired === true
      log('ERROR: ' + error.message)
      persist({ status: 'failed', message: error.message, code: error.code, recoveryRequired })
    }
  } catch (error) {
    failed = true
    log('ERROR: ' + error.message)
  } finally {
    if (exited && !recoveryRequired && request?.relaunch) {
      try { relaunch(request.relaunch, { continueProfile: request.host !== 'next' }); log('已重新打开桌面。') } catch (error) { log('ERROR: 无法重新打开桌面：' + error.message) }
    }
    if (recoveryRequired) log('入口需要手动恢复，未重新打开桌面；请保留备份和日志。')
```

</details>

#### 缺口

- 无法从源码保证多源当前内容与固定提交一致，也未验证 Windows 实际关闭及突然断电后目录状态。
  **影响**：脚本变更和中断可带来额外安装与回退成本，结果需查实际入口。
  **进一步探讨**：隔离环境对下载失效、标记缺失、权限拒绝、PID 重用、第二次 rename 失败分别核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 环境、权限、空间和退出成本如何盘点？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Windows 或 macOS 桌面首次安装受 Electron、IPC 和真实 desktop 目录限制，Node 引擎声明 20+。下载脚本还需网络、可用 PowerShell 或 Bash 及写入权限。迁移要求绝对的空目标、父目录存在且与现有路径不重叠。逐文件复制和 SHA-256 校验后再次查源状态，旧路径保留备份并建兼容链接，空间成本可同时含旧新副本。卸载隔离代码与 profile，保留用户数据与备份，不能以此衡量释放空间。试用可在单宿主和专用数据目录，核对重启后的原版与酒馆路径，迁移前记录备份及空间，失败时检查入口再决定重试。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/state.mjs:278-288](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/state.mjs#L278-L288)

首次安装的平台和真实目录前置。

<details>
<summary>查看原文（11行）</summary>

```text
export function canInstallTavern(paths) {
  if (!['win32', 'darwin'].includes(process.platform) || !process.versions.electron || !process.send || process.ppid <= 1) return false
  if (paths.activeDir !== join(paths.profilesDir, 'desktop')) return false
  try {
    if (!lstatSync(paths.activeDir).isDirectory()) return false
    lstatSync(join(paths.profilesDir, 'tavern'))
    if (!hasNextTavern(paths.home)) return false
  } catch (error) {
    if (error.code !== 'ENOENT' || !existsSync(paths.activeDir)) return false
  }
  return paths.host === 'next' || isOfficialDesktopApp()
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/packages/dsh-tavern/package.json:57-59](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/package.json#L57-L59)

声明 Node 引擎。

```text
  "engines": {
    "node": ">=20.0.0"
  }
```

**依据 3 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installation.mjs:104-120](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installation.mjs#L104-L120)

空目标、非重叠及明确确认。

<details>
<summary>查看原文（17行）</summary>

```text
function destinationCheck(destination, installation, identity) {
  if (typeof destination !== 'string' || !path.isAbsolute(destination) || destination.trim() !== destination || destination === path.parse(destination).root) fail('请选择绝对路径的空文件夹，不能选择磁盘根目录。')
  destination = identity.map(destination)
  ordinaryAncestors(destination)
  if (present(destination)) destination = fs.realpathSync(destination)
  else if (present(path.dirname(destination))) destination = path.join(fs.realpathSync(path.dirname(destination)), path.basename(destination))
  for (const root of [installation.home, ...installation.entries.flatMap(e => [e.from, e.to])]) if (within(destination, root) || within(root, destination)) fail('目标不能与 DSH 或现有酒馆目录重叠。')
  if (!present(path.dirname(destination)) || !fs.statSync(path.dirname(destination)).isDirectory()) fail('目标的父文件夹必须已存在。')
  if (present(destination) && (!fs.statSync(destination).isDirectory() || fs.readdirSync(destination).length)) fail('目标必须是空文件夹。')
  return destination
}
export function validateInstallationRequest(paths, mode, payload) {
  if (!['relocate', 'uninstall'].includes(mode) || payload?.confirmed !== true) fail('请先确认安装管理操作。')
  const installation = discover(paths)
  if (paths.activeDir && !same(trustedHome(paths.home).map(paths.activeDir), path.join(installation.home, 'profiles/desktop'))) fail('只能在桌面的 desktop 配置管理酒馆安装。')
  const destination = mode === 'relocate' ? destinationCheck(payload.destination, installation, trustedHome(paths.home)) : undefined
  return { mode, home: paths.home, stateDir: installation.stateDir, profilesRoot: path.join(installation.home, 'profiles'), liveDir: paths.activeDir ? trustedHome(paths.home).map(paths.activeDir) : path.join(installation.home, 'profiles/desktop'), installation, destination }
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installation.mjs:143-175](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installation.mjs#L143-L175)

复制保留链接边界并以摘要核对。

<details>
<summary>查看原文（33行）</summary>

```text
function copyVerified(source, target, entry, entries, heartbeat, identity) {
  heartbeat()
  const info = fs.lstatSync(source)
  if (info.isSymbolicLink()) {
    const original = identity(path.resolve(path.dirname(source), fs.readlinkSync(source)))
    const mapped = mapTarget(original, entries)
    const internal = entries.some(e => within(original, e.source) || within(original, e.from))
    if (!internal && (entry.kind === 'data' || !source.split(path.sep).includes('node_modules'))) fail(`未迁移不明外部链接：${source}`)
    // Never dereference links. External dependency links still use original DSH.
    const targetInfo = fs.statSync(source)
    fs.symlinkSync(mapped, target, process.platform === 'win32' ? (targetInfo.isDirectory() ? 'junction' : 'file') : undefined)
    return
  }
  if (info.isDirectory()) {
    fs.mkdirSync(target, { mode: 0o700 })
    for (const name of fs.readdirSync(source)) copyVerified(path.join(source, name), path.join(target, name), entry, entries, heartbeat, identity)
    fs.chmodSync(target, info.mode)
  } else if (info.isFile()) {
    const input = fs.openSync(source, 'r'), buffer = Buffer.allocUnsafe(1024 * 1024)
    let output
    try {
      output = fs.openSync(target, 'wx', 0o600)
      for (;;) {
        heartbeat()
        const count = fs.readSync(input, buffer, 0, buffer.length, null)
        if (!count) break
        let offset = 0
        while (offset < count) { heartbeat(); offset += fs.writeSync(output, buffer, offset, count - offset) }
      }
      fs.fsyncSync(output)
    } finally { fs.closeSync(input); if (output !== undefined) fs.closeSync(output) }
    if (hashFile(source, heartbeat) !== hashFile(target, heartbeat)) fail(`复制校验失败：${source}`)
    fs.chmodSync(target, info.mode)
```

</details>

**依据 5 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installation.mjs:218-244](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installation.mjs#L218-L244)

迁移备份、链接、卸载隔离并保留数据。

<details>
<summary>查看原文（27行）</summary>

```text
  try {
    if (request.mode === 'relocate') {
      if (!present(request.destination)) guard(() => fs.mkdirSync(request.destination))
      // All copies and hashes finish before any old registration changes.
      const inventory = sourceInventory(entries, heartbeat)
      for (const e of entries) copyVerified(e.source, e.to, e, entries, heartbeat, identity.map)
      await afterCopy()
      heartbeat(true)
      if (sourceInventory(entries, heartbeat) !== inventory) fail('复制期间源目录发生变化，未切换位置；请关闭其他使用酒馆的程序后重试。')
      for (const e of entries) {
        const backup = e.from + '.switch-backup-' + stamp
        await move(e.from, backup); journal.retained.push(backup); if (e.source !== e.from) journal.retained.push(e.source); persist(journalFile, journal)
        alias(e.from, e.to)
      }
      const record = { schemaVersion: 1, phase: 'completed', appDir: fresh.installation.logicalAppDir, destination: request.destination, entries: entries.map(({ kind, from, to }) => ({ kind, from, to })), retained: journal.retained }
      persist(registryFile, record); registryWritten = true
    } else {
      // Quarantine both code and profile; never delete user data or backups.
      for (const e of entries.filter(e => e.kind !== 'data')) {
        const backup = e.source + '.switch-removed-' + stamp
        await move(e.source, backup); journal.retained.push(backup); persist(journalFile, journal)
        if (e.from !== e.source) { const aliasBackup = e.from + '.switch-removed-' + stamp; await move(e.from, aliasBackup); journal.retained.push(aliasBackup); persist(journalFile, journal) }
      }
      persist(registryFile, { schemaVersion: 1, phase: 'uninstalled', retained: journal.retained, dataDir: fresh.installation.dataDir }); registryWritten = true
    }
    journal.phase = 'completed'; persist(journalFile, journal)
    return { changed: true, mode: request.mode, destination: request.destination, retained: journal.retained, dataDir: request.mode === 'relocate' ? path.join(request.destination, 'data') : fresh.installation.dataDir }
```

</details>

**依据 6 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/worker.mjs:84-112](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/worker.mjs#L84-L112)

工作者重新检查登记和进程。

<details>
<summary>查看原文（29行）</summary>

```text
    const fresh = validateInstallationRequest({ home: request.home, stateDir: request.stateDir, activeDir: request.liveDir }, request.mode, { confirmed: true, destination: request.destination })
    if (JSON.stringify(fresh.installation.entries) !== JSON.stringify(request.installation.entries)) throw new Error('安装目录已改变，请刷新后重试。')
    const { assertInstallationIdle } = await import('./installation-processes.mjs')
    await assertInstallationIdle(request)
    if (request.mode === 'uninstall' && lstatSync(request.liveDir).isSymbolicLink()) {
      if (realpathSync(request.liveDir) !== realpathSync(fresh.installation.profileDir)) throw new Error('desktop 入口不是当前酒馆，未修改其他 profile。')
      // Record intent before the two-step desktop restore: a crash here must
      // also fence standalone installers, not only the bridge pending queue.
      const journalFile = join(request.stateDir, 'installation-operation.json')
      const writeRestore = phase => lease.withOwnership(() => {
        const temporary = journalFile + '.restore-' + process.pid + '.tmp'
        const fd = openSync(temporary, 'wx', 0o600)
        try { writeFileSync(fd, JSON.stringify({ schemaVersion: 1, mode: 'uninstall-restore', phase, stamp: request.stamp })); fsyncSync(fd) } finally { closeSync(fd) }
        renameSync(temporary, journalFile)
      })
      writeRestore('preparing')
      try {
        await switchProfile({ ...request, mode: 'unlink' }, { ...options, rename: (from, to) => lease.withOwnership(() => renameSync(from, to)) })
        writeRestore('completed')
      } catch (error) {
        if (!error.recoveryRequired) {
          try { writeRestore('rolled-back') } catch (journalError) {
            error = Object.assign(new Error(`原版恢复结果需要检查：${journalFile}；${journalError.message}`, { cause: error }), { recoveryRequired: true, code: 'recovery-required' })
          }
        }
        throw error
      }
    }
    return await performInstallation(request, { ...options, ownership: lease, afterCopy: () => assertInstallationIdle(request) })
```

</details>

#### 缺口

- 实际大小、锁等待、恢复和保留数据的清理成本未知。
  **影响**：不同平台和现有安装量会改变手工确认及停机窗口。
  **进一步探讨**：记录首次配置和下载、迁移前后字节、停机分钟、恢复人时，退出前盘点留下的目录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 中断后给出阶段收据能否降低恢复风险？

**研究主题**：新假设与验证

#### 完整回答

现有 pending 锁阻止重复点击，状态记录带 stamp，迁移已把各步意图和完成标记写进 journal。普通链接切换的已知中断走需人工恢复，建议对比给两次 rename 及恢复动作记录阶段和盘面校验，区分准备、旧入口已备份、目标已生效与结果未知。操作者在确认前核对实际指向，并保留现有人工恢复门禁。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:173-200](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L173-L200)

现有最终状态和失联处理。

<details>
<summary>查看原文（28行）</summary>

```text
export function readLastResult(stateDir, { alive = processAlive, now = Date.now } = {}) {
  try {
    const result = JSON.parse(readFileSync(join(stateDir, 'last-result.json'), 'utf8'))
    if (!result || !['pending', 'succeeded', 'failed'].includes(result.status)) return undefined
    if (result.status === 'pending') {
      let worker
      try { worker = JSON.parse(readFileSync(join(stateDir, result.mode === 'install' ? 'install-pending' : 'pending', 'worker.json'), 'utf8')) } catch {}
      const hasWorker = Number.isInteger(worker?.pid) && worker.pid > 1
      const abandoned = hasWorker ? !alive(worker.pid)
        : now() - statSync(join(stateDir, 'last-result.json')).mtimeMs > 3 * 60 * 1000
      if (abandoned) {
        // A helper may have died between moves: never claim the old entry is
        // intact or silently offer another transaction before manual inspection.
        result.status = 'failed'
        result.code = 'helper-exited'
        result.message = '切换助手已退出或未能启动，结果不确定；请检查日志、当前入口和备份目录。'
        result.recoveryRequired = true
      }
    }
    return {
      status: result.status,
      mode: result.mode,
      stamp: result.stamp,
      finishedAt: result.finishedAt,
      updated: result.updated === true,
      message: typeof result.message === 'string' ? result.message : '',
      code: typeof result.code === 'string' ? result.code : undefined,
      recoveryRequired: result.recoveryRequired === true,
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:292-320](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L292-L320)

pending 互斥和旧记录处理。

<details>
<summary>查看原文（29行）</summary>

```text
export function acquirePendingLock(stateDir, { alive = processAlive, now = Date.now, keep = STALE_LIMIT, installing = false } = {}) {
  trustedHome(dirname(resolve(stateDir))).ordinary(stateDir)
  assertBridgeUpdateComplete(stateDir)
  mkdirSync(stateDir, { recursive: true })
  // The standalone installer rejects pending profile switches. Its own
  // installation lease still protects the files while the launcher waits.
  const lock = join(stateDir, installing ? 'install-pending' : 'pending')
  const other = join(stateDir, installing ? 'pending' : 'install-pending')
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (present(other)) throw busyError(other)
      mkdirSync(lock)
      if (present(other)) {
        rmSync(lock, { recursive: true })
        throw busyError(other)
      }
      return { lock, reclaimed: attempt > 0 }
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      if (attempt === 0 && pendingIsStale(lock, alive, now)) {
        try {
          archiveStale(lock, stateDir, now, keep)
        } catch (archiveError) {
          if (archiveError.code === 'ENOENT') continue
          throw busyError(lock, `陈旧记录无法自动归档：${archiveError.message}`)
        }
        continue
      }
      throw busyError(lock)
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:337-355](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L337-L355)

未结束 journal 及未知结果阻止新操作。

<details>
<summary>查看原文（19行）</summary>

```text
function assertManagementJournalComplete(stateDir) {
  const file = join(stateDir, 'installation-operation.json')
  if (!present(file)) return
  try {
    trustedHome(dirname(resolve(stateDir))).ordinary(file)
    const record = JSON.parse(readFileSync(file, 'utf8'))
    if (record.schemaVersion === 1 && ['completed', 'rolled-back'].includes(record.phase)) return
  } catch {}
  throw Object.assign(new Error(`安装管理记录尚未安全结束；请先检查备份与 ${file}，未安排切换。`), { code: 'recovery-required', recoveryRequired: true })
}

// Lock is acquired before responding, so repeated clicks cannot schedule competing switches.
export function scheduleSwitch(request, options = {}) {
  assertManagementJournalComplete(request.stateDir)
  const last = readLastResult(request.stateDir, options)
  if (last?.recoveryRequired) {
    throw Object.assign(new Error(`上次切换需要检查入口与备份，未安排新切换：${last.message} 日志：${last.logPath}`), { code: 'recovery-required' })
  }
  const { lock, reclaimed } = acquirePendingLock(request.stateDir, { ...options, installing: request.mode === 'install' })
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/installation.mjs:199-216](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/installation.mjs#L199-L216)

迁移路径已有逐动作前后日志。

<details>
<summary>查看原文（18行）</summary>

```text
  const registryFile = path.join(request.stateDir, 'installation.json')
  const previousRegistry = present(registryFile) ? fs.readFileSync(registryFile, 'utf8') : null
  let registryWritten = false
  const stamp = randomUUID(), journalFile = path.join(request.stateDir, 'installation-operation.json')
  const journal = { schemaVersion: 1, mode: request.mode, phase: 'preparing', stamp, actions: [], retained: [] }
  guard(() => fs.mkdirSync(request.stateDir, { recursive: true })); persist(journalFile, journal)
  const move = async (from, to) => {
    if (present(to)) fail(`备份路径已存在：${to}`)
    const action = { type: 'move', from, to, done: false }
    journal.actions.push(action); persist(journalFile, journal)
    await renameWithRetry(from, to, { ...retry, rename: ownedRename }); action.done = true; persist(journalFile, journal)
  }
  const alias = (from, to) => {
    if (present(from)) fail(`链接入口已存在：${from}`)
    const action = { type: 'link', from, to, done: false }
    journal.actions.push(action); persist(journalFile, journal)
    guard(() => link(to, from, process.platform === 'win32' ? 'junction' : 'dir')); action.done = true; persist(journalFile, journal)
  }
```

</details>

**依据 5 · 源码核查**：[tavern-plugin/packages/dsh-tavern/lib/helper.mjs:77-104](https://github.com/flizzywine/dsh-tavern/blob/3ed20efa2a276635e6c22a9c4c80658d118818d0/tavern-plugin/packages/dsh-tavern/lib/helper.mjs#L77-L104)

普通链接切换实际的两次变更和回滚。

<details>
<summary>查看原文（28行）</summary>

```text
  if (mode === 'link') link(registeredTavernTarget(profilesRoot, targetDir) === destination ? resolve(targetDir) : destination, staged, process.platform === 'win32' ? 'junction' : 'dir')
  let moved = false
  let failure
  try {
    await move(liveDir, previous)
    moved = true
    await move(mode === 'link' ? staged : destination, liveDir)
  } catch (error) {
    failure = error
    if (moved) {
      try { await move(previous, liveDir) } catch (rollback) {
        failure = Object.assign(new Error(`切换失败且自动恢复失败；请勿启动桌面或重新切换。原入口保存在 ${previous}，目标为 ${destination}：${rollback.message}`, { cause: error }), { code: 'recovery-required', recoveryRequired: true, previous, destination })
        throw failure
      }
    }
    throw error
  } finally {
    try {
      if (present(staged) && lstatSync(staged).isSymbolicLink()) removeLink(staged)
    } catch (cleanupError) {
      // Never mask recoveryRequired: restarting with a missing desktop can create
      // a new profile over the transaction we need to recover.
      if (failure) failure.message += `；临时链接未能清理 ${staged}：${cleanupError.message}`
      else throw cleanupError
    }
  }
  if (linked) unlinkSync(previous) // remove only the saved link, never its target
  return { changed: true, target: realpathSync(liveDir), backup: linked ? undefined : previous }
```

</details>

#### 缺口

- 增量是否能减少误恢复或操作时间尚未知。
  **影响**：误写阶段也可能增加误判，需对照真实目录而非仅相信日志。
  **进一步探讨**：在每次 rename 前后注入崩溃及重入，比较成功定位目录、误重启、重复变更及恢复人时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
