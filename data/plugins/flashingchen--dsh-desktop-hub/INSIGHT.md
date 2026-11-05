# DSH Desktop Hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d81fb81](https://github.com/FlashingChen/dsh-desktop-hub/tree/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FlashingChen/dsh-desktop-hub)
<!-- END META -->

> **功能**：用桌面窗口运行 DSH Web UI，集中管理插件、MCP 和 Skills，提供转换预览、操作进度与配置备份。

> **亮点**：把扩展类型识别、配置转换、进度和确定终态放同一桌面流程，单文件备份与类型边界提供可查恢复入口；不是第三方代码安全背书。[Q01](#research-q01)

> **主要限制**：patch原子替换不等于CLI、HMR和进程启动整体事务，取消请求也不等于进程已停；启动还会修复profile行，用户须核对副作用。[Q03](#research-q03)

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
  - [Q01 · Hub相对浏览器与CLI多接管什么？](#detail-section-11)
  - [Q02 · 插件操作如何从确认到最终完成或取消？](#detail-section-12)
  - [Q03 · MCP与Skill配置写入的恢复保证到哪里？](#detail-section-13)
  - [Q04 · 启动与长期维护负担如何限制试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH用户可在固定web profile下集中管理扩展，确认后操作并核对配置与实际运行状态。[Q01](#research-q01)

浏览器与CLI可直接管理，用户自行承担命令、YAML及状态核对；Hub集中这些入口但拥有更多profile写入责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 插件管理 | 确认后安装、移除、更新 | 当前固定web，终态不证明插件功能 |
| MCP JSON转换 | 预览并合并/替换patch行 | 纯环境引用转换，混合字符串保持字面 |
| 配置备份 | 单文件修改前保留旧副本 | 不是多步骤整体事务 |
| Skill导入管理 | 校验ZIP并替换用户目录 | 实际Skill内容仍需审查 |
| 操作取消与退出收口 | 等待子进程终态 | 请求成功不等于停止成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Electron及可用Node/DSH runtime | 必需 | 桌面与服务 | 源码不能证明发行物齐备 |
| web profile与可写HOME | 当前管理必需 | 插件/MCP配置 | 不支持任意profile切换 |
| 模型账号或API凭据 | 对话任务必需 | 由Harness设置管理 | 壳运行不代表模型可用 |
| 网络与包/MCP/Skill来源 | 相应安装必需 | 下载和执行扩展 | 目录缓存不证明可安装 |
| 备份与隔离数据目录 | 本次试用前提 | 控制恢复影响 | 不满足先不接管重要环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离HOME并核对发行物 | 保留原profile与数据 |
| 启动 | 壳解析runtime并检查HTTP就绪 | 读启动修复日志与错误 |
| 预览确认 | 用户检查来源、命令和MCP转换 | 确认不代表授权其他操作 |
| 执行验收 | 插件token等待终态，配置另核实际运行 | 取消看最终停止；加载失败核备份 |
| 退出恢复 | 拒绝新写并收口在途操作 | 超时/停止失败须人工核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 捆绑runtime/下载/模型资源未知 | 隔离目录、来源与配置核对 | 发行物未验 |
| 持续使用 | Electron、DSH、扩展和模型费用未知 | 阅读确认与核对运行状态 | 管理不等于扩展可信 |
| 失败恢复 | 重试、备份与残留资源未知 | 比较patch、目录、进程及日志 | 无整体事务恢复保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中管理 | IPC/确认/操作runner接线 | 是否降低总人工时间 |
| 配置恢复入口 | 权限保留备份+rename | HMR/CLI跨步骤完整恢复 |
| Skill导入 | 路径/总量校验和目录回退 | 所有恶意内容及目标行为安全 |
| 取消退出 | 有界等待与显式失败 | 跨系统进程树确已停止 |

> **思考**：patch原子替换不等于CLI、HMR和进程启动整体事务，取消请求也不等于进程已停；启动还会修复profile行，用户须核对副作用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把扩展类型识别、配置转换、进度和确定终态放同一桌面流程，单文件备份与类型边界提供可查恢复入口；不是第三方代码安全背书。[Q01](#research-q01)

排队token与最终结果分离、取消不伪报完成、权限继承备份和ZIP边界可借鉴；仍需把文件提交与扩展运行验收分开。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

patch原子替换不等于CLI、HMR和进程启动整体事务，取消请求也不等于进程已停；启动还会修复profile行，用户须核对副作用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离HOME试预览和小型扩展，分别检查配置文件、进程终态与功能；异常就停止新操作回原生工具和备份。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

操作token、单文件备份和目录替换有源码依据；发布物与跨系统完整恢复未验证，状态分层改进为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/main/main.ts、src/main/ipc-validation.ts、src/renderer/renderer.ts、src/core/harness.ts、src/core/plugin-ops.ts、src/core/mcp.ts、src/core/skills.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查桌面启动、IPC、插件操作、MCP写入和Skill替换关键链；未运行目标、发布物或外部市场，不对所有写路径作全局原子性承诺。
- 下一步：隔离HOME验证启动修复、确认安装、取消失败、MCP加载失败、Skill替换回退和退出进程树，分别记录文件与运行状态。

**分析版本**

- **仓库**：[FlashingChen/dsh-desktop-hub](https://github.com/FlashingChen/dsh-desktop-hub)
- **版本号**：0.1.0（[固定提交 d81fb81](https://github.com/FlashingChen/dsh-desktop-hub/tree/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把配置提交、运行就绪和失败备份分别展示，可能减少把落盘当可用的误判；同加载失败轨迹比较误判与恢复时间，尚未验证。[Q04](#research-q04)

隔离HOME验证启动修复、确认安装、取消失败、MCP加载失败、Skill替换回退和退出进程树，分别记录文件与运行状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2265 | — | — | 33444 |
| .js | source | 2 | 122 | 111 | 3 | — |
| .mjs | source | 14 | 2040 | 1791 | 114 | — |
| .ts | source | 29 | 12155 | 10599 | 735 | — |
| .mjs | test | 32 | 6977 | 6350 | 229 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/FlashingChen/dsh-desktop-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/FlashingChen/dsh-desktop-hub/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/FlashingChen/dsh-desktop-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一扩展管理是否能在配置提交、进程终态和运行就绪分清时降低人工接线负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Hub相对浏览器与CLI多接管什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是社区Electron桌面客户端，核心对话仍加载DSH Web UI，独立增加Plugin/MCP/Skill管理。面向不想手改YAML但能理解第三方代码权限的本地用户，合格结果是确认后的操作有可见进度、终态和可恢复配置。相对浏览器加CLI，增量是统一管理入口、MCP JSON到patch转换及备份；模型能力与扩展质量归上游，不应继承。当前主进程固定web profile，不能按“多环境一站式”推断已支持任意profile；README也把profile切换列为进行中。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-50](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/README.md#L35-L50)

作者一体化定位与目录非背书。

<details>
<summary>查看原文（16行）</summary>

```text
## 为什么不是普通 Desktop

不是套壳。官方 Web UI 原样保留在 Harness Tab 里，同时把三个命令行场景搬进同一个窗口：

- **开箱即用**：内置 Node.js + DeepSeek Harness 运行时（约 586MB），下载即用，本机不需要安装任何环境。
- **一体化**：在 Harness 对话、插件市场、MCP 市场、Skills 市场之间切换，不用再开终端敲 `dsh plugin` / 手写 YAML。
- **安全**：所有写操作原子落盘、自动备份 `.bak-<ts>`、官方 HMR 热生效，改错了随时可恢复。
- **及时更新**：Windows 与 macOS 发布版启动后自动检查 GitHub Releases，侧边栏提示新版本；用户确认后下载并重启安装，不必再手动打开 GitHub。

## 核心能力

### 三类扩展市场

插件、MCP 与 Skills 共用一个目录体验：搜索、查看来源、来源等级与权限，确认后分别安装到当前 profile 或用户级 skills。插件默认来自 [DSH Plugin Market](https://github.com/dsh-market/dsh-market) 发布的 [Awesome DSH Plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 清单，MCP 合并官方 Registry 与 [DSH MCP Market](https://github.com/LKMeng2001/dsh-mcp-market)，Skills 合并 [ClawHub](https://clawhub.ai) 与 [SkillsMP](https://skillsmp.com)。npm 只在插件安装预检时读取 manifest，不作为主市场搜索源；网络不可用时回退到本地缓存和随包精选目录。

> **市场数据来源声明**：各来源的运行时地址、用途、缓存策略、许可证边界和安全限制见 [`MARKET_SOURCES.md`](MARKET_SOURCES.md)。上游目录的收录不等于 DSH 安全背书。
```

</details>

**依据 2 · 作者声明**：[README.md:84-94](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/README.md#L84-L94)

profile切换未完成。

<details>
<summary>查看原文（11行）</summary>

```text
| 状态 | 项目 |
|---|---|
| ✅ | 基础版：Harness 主界面 + 桌面管理面板 + MCP / Skills / Plugin 管理 + 内置运行时 |
| ✅ | 扩展中心 MVP：Plugin 市场、MCP 市场、Skills 市场（随包精选目录） |
| ✅ | DeepSeek 账号：使用 Harness 内置的账号设置 |
| 🚧 | Profile 切换（当前固定 `web`） |
| Planned | Model Manager（API Key / 模型管理面板） |
| Planned | Doctor（环境自检与一键修复） |
| ✅ | Windows 安装包（NSIS，x64，与 macOS 并行发布） |
| ✅ | 后台托盘：关闭窗口后继续运行 Harness，可从托盘显示或退出 |
| Planned | Linux 安装包 |
```

</details>

**依据 3 · 源码核查**：[src/main/main.ts:135-154](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/main/main.ts#L135-L154)

固定web profile读取。

<details>
<summary>查看原文（20行）</summary>

```text
const ACTIVE_PROFILE = 'web'
const DESKTOP_HUB_PLUGIN_NAME = '@dsh-desktop-hub/manager'
let desktopHubPluginPromise: Promise<string> | null = null

// ---- 单实例锁：两个实例同时操作同一 profile/patch 会写冲突（P2-11）----
const gotSingleInstanceLock = app.requestSingleInstanceLock()
if (!gotSingleInstanceLock) {
  if (SMOKE || HARNESS_SMOKE) {
    const mode = HARNESS_SMOKE ? '--harness-smoke' : '--smoke'
    const message = `${mode} 无法获取单实例锁；已有 DSH Desktop Hub 实例正在运行，冒烟断言未执行`
    log(`SMOKE FAIL: ${message}`)
    console.error(`SMOKE FAIL: ${message}`)
    app.exit(1)
  } else {
    app.quit()
  }
}

function activeProfile(): DshProfile | null {
  return listProfiles(dshHome()).find((p) => p.name === ACTIVE_PROFILE) ?? null
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件操作如何从确认到最终完成或取消？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

渲染器先展示第三方代码和重启说明让用户确认，再调用startOp；主进程校验IPC来源、参数和安装类型，拒绝routing-suite误装。PluginOpRunner登记token，串行schedule后启动进程、流式输出并等待process.done；返回token仅代表已排队，不代表安装成功。remove成功后另清理patch激活行，清理失败把终态改失败并保留错误。cancel返回是否已登记请求，实际停止成功要看后续状态；shutdown拒绝新操作，等待取消和终态，超时/停止失败显式拒绝，不伪报已退出。

#### 证据与依据

**依据 1 · 源码核查**：[src/renderer/renderer.ts:606-620](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/renderer/renderer.ts#L606-L620)

确认后执行操作。

<details>
<summary>查看原文（15行）</summary>

```text
    return
  }
  const spec = plan.normalized
  const display = raw === spec ? spec : `${raw}\n归一化为：${spec}`
  if (!confirm(`确认安装插件「${display}」到 profile「web」？\n安装完成后会自动重启 Harness，使插件生效。\n插件代码将在本机执行（沙箱之外）。\n若 pnpm 拒绝构建脚本，会列出明确报告的包并逐包再次确认；允许后才写入 allowBuilds 并重试。`)) return
  await runPluginOpUi('add', [spec], '安装', async () => {
    await restartHarnessForPluginChange(`插件「${spec}」安装`)
  })
}

async function removePlugin(name: string): Promise<void> {
  if (!api) return
  if (!confirm(`确认移除插件「${name}」？\n若存在 patch 激活行将一并清理，完成后会自动重启 Harness。`)) return
  await runPluginOpUi('remove', [name], '移除', async () => {
    await restartHarnessForPluginChange(`插件「${name}」移除`)
```

</details>

**依据 2 · 源码核查**：[src/main/main.ts:681-712](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/main/main.ts#L681-L712)

来源和参数二次校验以及移除后清理。

<details>
<summary>查看原文（32行）</summary>

```text
  ipcMain.handle(IPC.pluginsPrepareInstall, (event, spec: unknown) => {
    assertRendererSender(event)
    if (typeof spec !== 'string' || !spec.trim()) return { ok: false as const, error: '插件 spec 无效' }
    const plan = classifyInstallSpec(spec.slice(0, 500))
    if (plan.kind === 'routing-suite') {
      return { ok: false as const, kind: plan.kind, normalized: plan.normalized, error: plan.message }
    }
    return { ok: true as const, kind: plan.kind, normalized: plan.normalized }
  })

  ipcMain.handle(IPC.pluginsStartOp, (event, action: unknown, args: unknown) => {
    assertRendererSender(event)
    const validated = validatePluginStartInput(action, args)
    if (!validated.ok) return { ok: false as const, error: validated.error }
    const operationAction = validated.value.action
    let operationArgs = validated.value.args
    if (operationAction === 'add') {
      const plan = classifyInstallSpec(operationArgs[0])
      if (plan.kind === 'routing-suite') return { ok: false as const, error: plan.message }
      if (!plan.normalized) return { ok: false as const, error: '插件 spec 无效' }
      // Renderer 已经预处理过一次；主进程仍再次归一化，防止绕过 UI 的调用把网页 URL 送进 pnpm。
      operationArgs = [plan.normalized]
    }
    const removeName = operationAction === 'remove' ? operationArgs[0] : undefined
    return startPluginOp(operationAction, operationArgs, removeName === undefined ? undefined : () => {
      // 已在 PluginOpRunner 的 profile mutation 串行区内，不能再次进入 serializeMutation。
      const profile = activeProfile()
      if (!profile) throw new Error(`profile「${ACTIVE_PROFILE}」不存在，无法清理插件激活行`)
      const patch = readPatch(profile.dir)
      const cleaned = deactivatePluginIfActive(patch, removeName)
      if (cleaned !== patch) writePluginPatch(profile, cleaned)
    })
```

</details>

**依据 3 · 源码核查**：[src/core/plugin-ops.ts:111-154](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/plugin-ops.ts#L111-L154)

token、排队与取消请求。

<details>
<summary>查看原文（44行）</summary>

```text
  start(request: PluginOpStartRequest): PluginOpStarted {
    if (this.shuttingDown) return { ok: false, error: '应用正在退出，无法启动新的插件操作' }
    const token = this.options.nextToken()
    const { promise: completion, resolve: resolveCompletion } = Promise.withResolvers<void>()
    const operation: ActiveOperation = {
      process: null,
      cancelRequested: false,
      cancelSucceeded: false,
      completion,
      resolveCompletion,
      cancelPromise: null,
    }
    this.active.set(token, operation)

    try {
      const scheduled = this.options.schedule(() => this.execute(token, operation, request))
      void scheduled.catch((error: unknown) => {
        this.finish(token, {
          token,
          exitCode: 1,
          signal: null,
          output: `插件操作执行失败：${errorMessage(error)}\n`,
        })
      })
    } catch (error) {
      this.finish(token, {
        token,
        exitCode: 1,
        signal: null,
        output: `插件操作排队失败：${errorMessage(error)}\n`,
      })
    }

    return { ok: true, token }
  }

  cancel(token: string): boolean {
    const operation = this.active.get(token)
    if (!operation) return false
    void this.requestCancel(token, operation).catch(() => {
      // 普通 UI cancel 没有异步返回通道；错误已作为 output chunk 留痕。
      // shutdown 会复用/重试同一 ChildProcess，并把失败显式 reject 给主进程。
    })
    return true
```

</details>

**依据 4 · 源码核查**：[src/core/plugin-ops.ts:274-310](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/plugin-ops.ts#L274-L310)

等待最终结果和清理失败。

<details>
<summary>查看原文（37行）</summary>

```text
    let result: Awaited<PluginOpHandle['done']>
    try {
      result = await process.done
    } catch (error) {
      this.finish(token, {
        token,
        exitCode: 1,
        signal: null,
        output: this.appendCapped(output, `\n插件操作未返回退出状态：${errorMessage(error)}\n`),
      })
      return
    }

    let exitCode = result.exitCode
    let finalOutput = output
    if (result.exitCode === 0 && request.finalize) {
      try {
        request.finalize()
      } catch (error) {
        const message = errorMessage(error)
        try {
          this.options.onFinalizeError?.(message)
        } catch {
          // 记录日志失败也不能阻止终态广播。
        }
        exitCode = 1
        const prefix = request.action === 'remove' ? '插件移除后的 patch 激活行清理失败' : '插件操作后的 patch 清理失败'
        finalOutput = this.appendCapped(output, `\n${prefix}：${message}\n`)
      }
    }

    this.finish(token, {
      token,
      exitCode,
      signal: result.signal ?? null,
      output: finalOutput,
    })
```

</details>

**依据 5 · 源码核查**：[src/core/plugin-ops.ts:165-225](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/plugin-ops.ts#L165-L225)

有界shutdown收口。

<details>
<summary>查看原文（61行）</summary>

```text
  /** 拒绝新操作、取消全部已登记操作，并等待每个 token 写入确定终态。 */
  shutdown(): Promise<void> {
    if (this.shutdownPromise) return this.shutdownPromise
    this.shuttingDown = true
    const operations = [...this.active.entries()]
    if (operations.length === 0) {
      this.shutdownPromise = Promise.resolve()
      return this.shutdownPromise
    }

    const cancelErrors: unknown[] = []
    const recordCancelError = (error: unknown): void => {
      if (error instanceof AggregateError) cancelErrors.push(...error.errors)
      else cancelErrors.push(error)
    }
    const cancellations = operations.map(async ([token, operation]) => {
      try {
        await this.requestCancel(token, operation)
      } catch (firstError) {
        // stopTree 已绑定原 ChildProcess，不存在 PID 延时复用风险。退出阶段再重试
        // 一次可覆盖暂态 taskkill/权限竞态；两次都失败才交给有界 shutdown 上抛。
        if (this.active.get(token) !== operation) {
          recordCancelError(firstError)
          return
        }
        try {
          await this.requestCancel(token, operation)
        } catch (retryError) {
          recordCancelError(firstError)
          recordCancelError(retryError)
        }
      }
    })
    const drain = Promise.all([
      Promise.all(operations.map(([, operation]) => operation.completion)),
      Promise.all(cancellations),
    ]).then(() => {
      if (cancelErrors.length > 0) throw new AggregateError(cancelErrors, '插件进程树停止失败')
    })
    this.shutdownPromise = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        const activeTokens = operations.map(([token]) => token).filter((token) => this.active.has(token))
        const timeout = new Error(
          `等待插件操作终态超时（${this.shutdownTimeoutMs}ms；仍在运行：${activeTokens.join(', ') || '未知'}）`,
        )
        reject(cancelErrors.length > 0
          ? new AggregateError([...cancelErrors, timeout], '插件操作退出收口失败')
          : timeout)
      }, this.shutdownTimeoutMs)
      void drain.then(
        () => {
          clearTimeout(timer)
          resolve()
        },
        (error: unknown) => {
          clearTimeout(timer)
          reject(error)
        },
      )
    })
    return this.shutdownPromise
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP与Skill配置写入的恢复保证到哪里？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

MCP转换用同一序列化器做预览与写入，纯${VAR}值改为DSH动态环境引用，混合字符串仍为字面值。用户确认后主进程校验rows，再在本进程串行区读patch并merge/replace；atomicWriteWithBackup复制旧文件、继承权限、独占临时文件并rename。它保护单文件替换，不保证官方CLI安装、HMR和配置整体原子事务；写入成功返回rows不证明MCP服务已启动。Skill ZIP在解压前检查路径和总量，替换目录时先改名旧副本并在新目录移动失败时尝试回滚；若回滚也失败报告聚合错误，不能承诺永远恢复。市场只是来源入口，MCP命令和插件可在本机执行，仍需用户判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/mcp.ts:513-540](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/mcp.ts#L513-L540)

转换与环境引用语义。

<details>
<summary>查看原文（28行）</summary>

```text
export function convertToRows(servers: McpServerSpec[]): McpRow[] {
  return servers.map((s) => {
    const config: Record<string, unknown> = { serverName: s.name, transport: s.transport }
    if (s.command) config.command = s.command
    if (s.args) config.args = s.args
    if (s.env) config.env = s.env
    if (s.cwd) config.cwd = s.cwd
    if (s.url) config.url = s.url
    if (s.headers) config.headers = s.headers
    return { id: `mcp-${s.name}`, name: MCP_PLUGIN, config }
  })
}

const ENV_REF = /\$\{[A-Za-z_][A-Za-z0-9_]*\}/g

/**
 * 唯一的 MCP 行序列化器：预览与落盘共用，保证所见即所写。
 * Claude Code 的 `${VAR}` 是客户端环境替换语义；DSH 不展开，需转成
 * `!!js process.env.VAR` 动态求值。行级纯 `${VAR}` 值被转换，混合字符串保持字面。
 */
export function renderRowsYaml(rows: McpRow[]): string {
  const validated = validateMcpRows(rows)
  if (!validated.ok) throw new Error(`MCP rows 格式无效：${validated.error}`)
  const text = stringify([{ insert: validated.rows }])
  return text.replace(
    /^(\s*[A-Za-z0-9_.-]+):\s*(['"])?\$\{([A-Za-z_][A-Za-z0-9_]*)\}\2\s*$/gm,
    '$1: !!js process.env.$3',
  )
```

</details>

**依据 2 · 源码核查**：[src/main/main.ts:745-760](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/main/main.ts#L745-L760)

串行读改写patch。

<details>
<summary>查看原文（16行）</summary>

```text
  ipcMain.handle(IPC.mcpApply, async (event, input: unknown) => {
    assertRendererSender(event)
    const profile = activeProfile()
    if (!profile) return { ok: false as const, error: `profile「${ACTIVE_PROFILE}」不存在`, backup: '' }
    const validated = validateMcpApplyInput(input)
    if (!validated.ok) return { ok: false as const, error: validated.error, backup: '' }
    try {
      return await serializeMutation(() => {
        const patch = readPatch(profile.dir)
        const next = validated.value.mode === 'replace'
          ? replaceMcpRows(patch, validated.value.rows)
          : mergeMcpRows(patch, validated.value.rows)
        return writeMcpPatch(profile, next, extractMcpServers(next).length)
      })
    } catch (err) {
      return { ok: false as const, error: (err as Error).message, backup: '' }
```

</details>

**依据 3 · 源码核查**：[src/core/mcp.ts:843-877](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/mcp.ts#L843-L877)

备份与原子替换范围。

<details>
<summary>查看原文（35行）</summary>

```text
export function atomicWriteWithBackup(file: string, content: string, backupsDir?: string): string {
  assertPatchTextLimits(content)
  const dir = backupsDir ?? dirname(file)
  mkdirSync(dir, { recursive: true })
  let mode: number | null = null
  try {
    mode = statSync(file).mode & 0o777
  } catch (err) {
    if (!hasErrorCode(err, 'ENOENT')) throw err
  }
  const writeId = `${Date.now()}-${process.pid}-${atomicWriteSequence++}`
  const name = basename(file)
  let backup = ''
  if (mode !== null) {
    backup = createUniqueFile(join(dir, `${name}.bak-${writeId}`), (candidate) => {
      copyFileSync(file, candidate, constants.COPYFILE_EXCL)
    })
    chmodSync(backup, mode)
  }
  const tmp = createUniqueFile(join(dir, `.${name}.tmp-${writeId}`), (candidate) => {
    writeFileSync(candidate, content, { mode: mode ?? 0o600, flag: 'wx' })
  })
  try {
    renameWithRetry(tmp, file)
  } catch (err) {
    try {
      unlinkSync(tmp)
    } catch (cleanupErr) {
      if (!hasErrorCode(cleanupErr, 'ENOENT')) {
        throw new AggregateError([err, cleanupErr], `原子写入失败，且无法清理临时文件：${tmp}`)
      }
    }
    throw err
  }
  return backup
```

</details>

**依据 4 · 源码核查**：[src/core/skills.ts:608-677](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/skills.ts#L608-L677)

ZIP校验和替换恢复。

<details>
<summary>查看原文（70行）</summary>

```text
function safeZipRelPath(entryName: string): string | null {
  const norm = entryName.replace(/\\/g, '/')
  if (norm.includes('\0')) return null
  if (norm.startsWith('/')) return null
  if (/^[A-Za-z]:/.test(norm)) return null
  const parts = norm.split('/').filter((p) => p !== '' && p !== '.')
  if (parts.some((p) => p === '..')) return null
  if (parts.length === 0) return null
  return parts.join('/')
}

/** 校验整包限额与路径合法性（在解压任何内容之前执行） */
function validateZipEntries(entries: AdmZip.IZipEntry[]): void {
  if (entries.length > MAX_ZIP_ENTRIES) {
    throw new Error(`压缩包条目数 ${entries.length} 超过上限 ${MAX_ZIP_ENTRIES}`)
  }
  let total = 0
  for (const e of entries) {
    if (e.isDirectory) continue
    if (safeZipRelPath(e.entryName) === null) {
      throw new Error(`压缩包包含非法路径（拒绝 .. / 绝对路径 / NUL）: ${JSON.stringify(e.entryName)}`)
    }
    const size = e.header.size
    if (!Number.isFinite(size) || size < 0) throw new Error(`压缩包条目大小异常: ${e.entryName}`)
    if (size > MAX_ENTRY_SIZE) throw new Error(`文件 ${e.entryName} 超过单文件上限 ${MAX_ENTRY_SIZE} 字节`)
    total += size
    if (total > MAX_TOTAL_SIZE) throw new Error(`解压总量超过上限 ${MAX_TOTAL_SIZE} 字节`)
  }
}

interface InstallDependencies {
  rename?: typeof renameSync
  remove?: typeof rmSync
}

/** 把已解压到 tmpDir 的包原子装入 target；覆盖时旧目录先改名再替换，失败回滚。 */
export function installExtracted(
  tmpDir: string,
  target: string,
  overwrite: boolean,
  dependencies: InstallDependencies = {},
): void {
  const move = dependencies.rename ?? renameSync
  const remove = dependencies.remove ?? rmSync
  if (!existsSync(target)) {
    move(tmpDir, target)
    return
  }
  if (!overwrite) {
    const error = new Error(`skill 已存在: ${basename(target)}（如需覆盖请再次确认）`)
    throw removeAfterFailure(tmpDir, error, `skill 已存在且无法清理临时导入目录: ${target}`, remove)
  }
  const backup = siblingArtifact(target, 'old')
  move(target, backup)
  try {
    move(tmpDir, target)
  } catch (err) {
    let failure = err
    try {
      move(backup, target)
    } catch (rollbackError) {
      failure = aggregateFailure(failure, rollbackError, `导入替换失败且无法恢复原 skill: ${target}`)
    }
    throw removeAfterFailure(tmpDir, failure, `导入替换失败且无法清理临时目录: ${target}`, remove)
  }
  try {
    remove(backup, { recursive: true, force: true })
  } catch {
    // 新目录已提交；保留隐藏 recovery artifact，不能把成功安装假报为失败。
  }
```

</details>

#### 缺口

- 未核查外部CLI并发修改、HMR失败与所有市场内容的实际安全性。
  **影响**：单文件原子写不能证明多步骤无损或第三方扩展可信。
  **进一步探讨**：用隔离profile模拟外部修改和加载失败，核对备份、最终文件及实际运行状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与长期维护负担如何限制试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

服务启动解析runtime并先修复重复DirectoryPicker配置，spawn使用参数与shell:false，解析日志URL后以HTTP就绪检查收口；所以启动也可能改profile，不只是读UI。Electron窗口设置隔离与sandbox、IPC来源检查是具体防线，但不是整体安全审计。首次要取得对应系统发行物、准备DSH账号/模型与网络；持续有捆绑runtime、Electron、扩展进程与模型资源，实际费用耗时未知。可在隔离HOME里先试转换预览和小型扩展，不直接接管唯一重要profile。由Q03可提出“配置提交与运行就绪分别显示、失败绑定备份”的假设；相同加载失败轨迹比较用户误判成功和恢复时间，若不改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/harness.ts:601-649](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/harness.ts#L601-L649)

启动前修复、spawn参数及runtime。

<details>
<summary>查看原文（49行）</summary>

```text
export function startHarness(opts: {
  profile?: string
  cwd?: string
  port?: number
  /** Invocation-only overlays; the user's persistent profile patch remains untouched. */
  patchFiles?: string[]
  onLog?: (line: string) => void
  readyTimeoutMs?: number
  /** 子进程 spawn 后的同步回调（供调用方追踪 in-flight 进程，退出清理用） */
  onSpawn?: (proc: ChildProcess) => void
}, dependencies: StartHarnessDependencies = {}): Promise<HarnessHandle> {
  const resolveExec = dependencies.resolveExec ?? resolveDshExec
  const spawnProcess = dependencies.spawnProcess ?? spawn
  const platform = dependencies.platform ?? process.platform
  const stopProcess = dependencies.stopProcess ?? stopTree
  const waitForReady = dependencies.waitForReady ?? waitForHttp
  const now = dependencies.now ?? Date.now
  const setTimer = dependencies.setTimer ?? setTimeout
  const clearTimer = dependencies.clearTimer ?? clearTimeout
  let proc: ChildProcess
  let repairLog: string | null = null
  try {
    const exec = resolveExec()
    if (!exec) return Promise.reject(new Error('未找到 dsh 可执行文件（请先安装 DeepSeek Harness）'))
    const cwd = opts.cwd ?? homedir()
    const profile = opts.profile ?? 'web'
    const repairs = repairDirectoryPickerRows(dshHome(), profile)
    if (repairs.length > 0) repairLog = `harness: 已移除重复 DirectoryPicker 配置：${repairs.join(' | ')}`
    const args = [
      '--profile',
      opts.profile ?? 'web',
      ...(opts.patchFiles ?? []).flatMap((file) => ['--patch', file]),
      '--no-open',
      '--port',
      String(opts.port ?? 0),
    ]
    const plan = planDshSpawn(exec.exec, exec.node, args, {
      ...dependencies.spawnPlanDependencies,
      platform,
    })
    proc = spawnProcess(plan.executable, plan.args, {
      cwd,
      // Windows .cmd/.bat has already been resolved to node + JS argv. Never
      // pass dsh paths or arguments through cmd.exe.
      detached: platform !== 'win32',
      env: runtimePathEnv(profile, cwd),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      shell: false,
```

</details>

**依据 2 · 源码核查**：[src/core/harness.ts:700-719](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/core/harness.ts#L700-L719)

日志URL和HTTP就绪。

<details>
<summary>查看原文（20行）</summary>

```text
      }
      // dsh 启动期致命错误：立即失败并携带原因，不等 180s 轮询超时
      const fatal = line.match(DSK_FATAL_RE)
      if (fatal) {
        fail(new Error(`dsh 启动失败：${fatal[1].slice(0, 400)}`))
        return
      }
      url ??= parseHarnessUrl(line)
      // 只允许一个 HTTP 轮询在飞，避免每个日志块都新起轮询
      if (url && !settled && !polling) {
        polling = true
        void (async () => {
          try {
            const ok = await waitForReady(harnessReadinessUrl(url!), { deadline: readyDeadline, signal: pollingController.signal })
            polling = false
            if (ok) settle(() => resolve({ url: url!, stop: () => stopProcess(proc), proc }))
          } catch (err) {
            polling = false
            fail(err)
          }
```

</details>

**依据 3 · 源码核查**：[src/main/main.ts:337-343](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/main/main.ts#L337-L343)

IPC来源校验。

```text
// ---- IPC 来源校验（P1-2 / P2-9）：只接受壳层主帧与内嵌管理中心子帧，拒绝 harness iframe / 外部页 ----
function assertRendererSender(event: IpcMainInvokeEvent): void {
  const frame = event.senderFrame
  const url = frame?.url ?? ''
  if (!frame || !isAllowedIpcSender(url, frame === event.sender.mainFrame, RENDERER_URL)) {
    throw new Error('IPC 来源校验失败：拒绝非壳层主帧与非法管理中心帧调用')
  }
```

**依据 4 · 源码核查**：[src/main/main.ts:1072-1079](https://github.com/FlashingChen/dsh-desktop-hub/blob/d81fb810ee1e2cfa7694ef0ebec8ad03c8873276/src/main/main.ts#L1072-L1079)

Electron隔离设置。

```text
    show: !(SMOKE || HARNESS_SMOKE),
    webPreferences: {
      preload: join(__dirname, '..', 'preload', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })
```

#### 缺口

- 未验收发布物、跨OS进程树退出和配置失败后的端到端恢复。
  **影响**：不能保证所有平台即用或总维护负担更低。
  **进一步探讨**：用隔离HOME记录安装/转换/加载/取消/退出与恢复，比较直接CLI操作。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
