# Pilot Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d1fa9c1](https://github.com/op7418/pilot-harness/tree/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d)

<!-- BEGIN META -->
[![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/op7418/pilot-harness)
<!-- END META -->

> **功能**：将 DSH 底座组合为 Electron 桌面客户端与独立界面插件，提供模型配置和工作区 Files 侧栏，真实文件操作需另核目标与并发边界。

> **亮点**：桌面托管与声明式Provider组合、可独立使用的主题/Files等插件结构；本轮证实Files目标目录/草稿/变更主链，不外推所有自定义模块，见 [Q03](#research-q03)。

> **主要限制**：Host根约束不等UI意图归属；异步旧回包及check-then-rename需核，模型catalog/进程ready不等任务完成，退出也有平台差异，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

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
  - [Q01 · Pilot根对象、版本和实际桌面启动是什么？](#detail-section-11)
  - [Q02 · 模型与工具结果是否真实回到下一步，哪些是底座？](#detail-section-12)
  - [Q03 · Files侧栏如何到真实文件操作，Workspace约束够不够？](#detail-section-13)
  - [Q04 · 首次、持续、失败和退出各需要什么？](#detail-section-14)
  - [Q05 · 采用范围与未来方向如何超出已有文件侧栏？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户在聊天旁查看工作区并把相对路径放入草稿；本轮核桌面、模型/Loop与Files代表链，见 [Q01](#research-q01) 至 [Q03](#research-q03)。

原生DSH Web配编辑器/系统文件树、手复制路径与其他桌面壳；已有Loop/Provider不计Pilot新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面托管/主题 | 统一入口与视觉 | 非新Loop，发行安全未验 |
| 模型配置/Agent | 既有Provider与工具迭代 | 归底座；路由/日志非业务成功 |
| Files双面 | 查看/新建/rename/路径草稿 | 真写文件，根检查非全竞态保证 |
| 独立bundle | 按需迁移Files/主题等 | 本轮不全验提醒/ZIP和tgz |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 正确Electron成品/本地DSH资源 | 桌面必需 | 子进程/renderer/preload | 产物未核，root不是单bundle |
| Provider/Key/真实模型路由 | 真任务必需 | LLM流和工具循环 | setup-required/目录可用不等请求通过 |
| WorkspaceRegistry与本地读写权限 | Files必需 | 注册workspace/Host fs | loopback约束非OS沙箱 |
| 匹配slots/connection/workspace版本 | 独立bundle必需 | 双面挂载/公共接口 | 预构建lib/tgz与兼容需核 |
| userData/工作区备份/VCS | 试用需要 | 状态保存与失败恢复 | 资料隔离不回滚已写工作文件 |
| Node/pnpm/构建链 | 源码维护需要 | 生成lib和desktop产物 | 不把开发build当已发布 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 启动 | Shell启本地profile并loadURL | ready只证明地址/启动信号 |
| 模型配置 | 列真实目录/修空会话占位 | 旧session不静默切，真调用另验 |
| Agent活动 | 模型流→tool.execute→tool/result→下一LLM | 归底座，完成另核任务真值 |
| Files | 当前workspace回RPC/Host fs或草稿路径 | 目标/并发/已写状态分别核 |
| 失败 | 保当前文件/状态后重观 | 不凭错误盲重复rename/工具 |
| 退出 | 发TERM/必要force，处理资料/外部任务 | Mac关窗与真quit不同 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Electron/Runtime/模型配置未知 | 核发行/复制workspace/配置Key | App与根/插件版本分开 |
| 持续使用 | 内存/token/遍历/资料未知 | 版本适配/文件与任务复核 | cap非总体资源上限 |
| 失败恢复 | 可能已写文件/模型调用未知 | 核旧回包/并发/真实文件再处理 | 无统一workspace回滚承诺 |
| 退出 | userData/Key/工作文件/子进程未知 | 真quit/查进程与外部副作用/备份 | POSIX不据shell注释承诺全树停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面入口 | renderer隔离/子进程/失败shell | 成品签名/各平台可靠 |
| 任务循环 | 实际工具结果进入下一模型请求 | 最终质量/权限/预算全覆盖 |
| 文件贴近会话 | 真实slot/RPC/草稿路径/Host fs | 异步意图与并发不覆盖 |
| 可独立功能 | 普通双面bundle与公共接口 | Release工件与版本兼容 |

> **思考**：Host根约束不等UI意图归属；异步旧回包及check-then-rename需核，模型catalog/进程ready不等任务完成，退出也有平台差异，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：桌面托管与声明式Provider组合、可独立使用的主题/Files等插件结构；本轮证实Files目标目录/草稿/变更主链，不外推所有自定义模块，见 [Q03](#research-q03)。

[Q02](#research-q02)不把目录/路由可用当真实请求；[Q03](#research-q03)真实root检查值得保留，但UI请求代次、变更原子性与业务真值是不同层。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host根约束不等UI意图归属；异步旧回包及check-then-rename需核，模型catalog/进程ready不等任务完成，退出也有平台差异，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

复制workspace、独立资料目录先只读浏览和插入草稿路径；写操作/模型权限另核，界面目标或写结果不清先停，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码闭合桌面入口、底座实际工具结果回下一LLM、模型空会话修复与Files UI→RPC→fs；未运行/验发行物或复现竞态。限定复制工作区只读/草稿引用试用。

- 已检查：作者 README、包清单、源码路径 apps/desktop/assets/pilot-harness.patch.yml、apps/desktop/package.json、apps/desktop/scripts/build.mjs、apps/desktop/src/main.ts、apps/desktop/src/preload.ts、apps/desktop/src/server-url.ts、package.json、packages/boot/app-boot/src/profile.ts、packages/bundle/base/cordis.patch.yml、packages/client/connection/src/api-request-trust.ts、packages/client/connection/src/rpc-host.ts、packages/client/ui-layout/src/client/AppFrame.tsx、packages/client/ui-layout/src/client/index.ts、packages/core/agent-loop/src/agent.ts、packages/core/agent-loop/src/index.ts、packages/core/agent-loop/src/tool-calls.ts、packages/core/session/src/index.ts、packages/core/session/src/surface.ts、packages/core/tools/src/index.ts、packages/host/apiproxy/src/api-proxy.ts、packages/workspace/ui-worktree/package.json、packages/workspace/ui-worktree/src/client/WorktreePanel.tsx、packages/workspace/ui-worktree/src/client/draft.ts、packages/workspace/ui-worktree/src/client/index.ts、packages/workspace/ui-worktree/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核completed/四摘要/固定SOURCE；读desktop真实main/build/preload与profile、底座factory/模型流/tool执行/结果回消息、session.models空会话路由、Files双面slot/owner/render/RPC/fs和信任callee及退出。未启动/跑测试/核发行，未全审主题、提醒、ZIP导出、全部Provider/审批/安全后端或所有平台；静态竞态候选非已发生漏洞。
- 下一步：复制双workspace延迟A/B回包、同名文件/并发rename/丢响应和草稿路径案例，再核无害模型工具结果下一步/真退出；分别测目标错误、字节、业务正确及总工时。

**分析版本**

- **仓库**：[op7418/pilot-harness](https://github.com/op7418/pilot-harness)
- **版本号**：0.1.0-rc.7-pilot.2（桌面应用；工作区根声明 0.1.0-rc.7）（[固定提交 d1fa9c1](https://github.com/op7418/pilot-harness/tree/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d)）
- **版本日期**：2026-08-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

相对已有workspace/path检查增加读回包代次/目标绑定和rename前置状态/未知写结果对账，先复现再测错对象/字节与工时，见 [Q05](#research-q05)。

复制双workspace延迟A/B回包、同名文件/并发rename/丢响应和草稿路径案例，再核无害模型工具结果下一步/真退出；分别测目标错误、字节、业务正确及总工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2236 | 164475 | — | — | 3064116 |
| .mjs | source | 27 | 3708 | 3100 | 295 | — |
| .mjs | test | 9 | 2060 | 1909 | 93 | — |
| .ts | source | 1340 | 226500 | 148229 | 63098 | — |
| .ts | test | 865 | 260909 | 221915 | 15900 | — |
| .ts | example | 90 | 9686 | 7747 | 1210 | — |
| .mjs | example | 7 | 339 | 275 | 34 | — |
| .js | source | 1 | 13 | 11 | 0 | — |
| .cjs | source | 4 | 357 | 271 | 45 | — |
| .md | test | 103 | 3320 | — | — | 18059 |
| .md | example | 53 | 3447 | — | — | 38064 |
| .js | test | 2 | 213 | 149 | 33 | — |
| .tsx | source | 147 | 30535 | 23846 | 5301 | — |
| .tsx | test | 126 | 37995 | 31867 | 2918 | — |
| .js | example | 6 | 65 | 49 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/op7418/pilot-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/op7418/pilot-harness/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/op7418/pilot-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面Fork与Files直接贡献能否安全贴近编码任务，既有真实工具循环与新增UI/文件变更如何分清？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Pilot根对象、版本和实际桌面启动是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是带独立插件的DSH Fork桌面客户端工程，不是把整个根仓当单个dsh.bundle。根私有工作区0.1.0-rc.7与apps/desktop应用0.1.0-rc.7-pilot.2必须分开；主题、文件侧栏、提醒摘要、会话导出也有各自包。用户在熟悉聊天中查看工作区、插入路径和运行任务，作者把官方式Harness底座与CodePilot风格UI/本地桌面管理组合，不把已有模型/工具引擎归为新算法。

桌面package.main为dist/main.cjs，build脚本确以src/main.ts打到该路径，preload也独立打包。Electron主进程建contextIsolation、禁Node、sandbox窗口；子进程用Electron-as-Node运行打包dsh bin，附Pilot profile，在127.0.0.1随机端口启动。只接回环readiness行，失效/超时/退出显示失败shell，可重启；最终loadURL到该Web，允许导航为当前origin或固定本地shell，其他HTTP外开。preload只暴露restart/选目录/打开资料目录/复制诊断/主题等有限IPC；这不是所有Host工具、第三方同origin插件或文件操作的OS沙箱。发行签名/体积和真实启动本轮未核。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-27](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/package.json#L1-L27)

根工作区身份/版本/非单bundle。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-root",
  "version": "0.1.0-rc.7",
  "license": "MIT",
  "private": true,
  "homepage": "https://github.com/op7418/pilot-harness#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/op7418/pilot-harness.git"
  },
  "bugs": {
    "url": "https://github.com/op7418/pilot-harness/issues"
  },
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/landlock-run",
    "native/landlock-run/packages/*",
    "apps/*",
    "website"
  ],
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[apps/desktop/package.json:1-32](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/package.json#L1-L32)

独立应用版本/真实main。

<details>
<summary>查看原文（32行）</summary>

```text
{
  "name": "@deepseek-ai/dsh-desktop",
  "description": "CodePilot-style desktop shell for DeepSeek Harness",
  "version": "0.1.0-rc.7-pilot.2",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/op7418/pilot-harness.git",
    "directory": "apps/desktop"
  },
  "homepage": "https://github.com/op7418/pilot-harness#readme",
  "bugs": {
    "url": "https://github.com/op7418/pilot-harness/issues"
  },
  "type": "module",
  "main": "dist/main.cjs",
  "author": {
    "name": "Pilot Harness Contributors",
    "email": "op7418@users.noreply.github.com"
  },
  "files": [
    "dist"
  ],
  "license": "MIT",
  "scripts": {
    "build": "node scripts/build.mjs",
    "icons": "node scripts/generate-icons.mjs",
    "dev": "pnpm run build && electron .",
    "pack": "pnpm run build && electron-builder --config electron-builder.adhoc.yml --publish never",
    "pack:release": "pnpm run build && electron-builder --config electron-builder.yml --publish never",
```

</details>

**依据 3 · 源码核查**：[apps/desktop/scripts/build.mjs:10-38](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/scripts/build.mjs#L10-L38)

真正main/preload打包。

<details>
<summary>查看原文（29行）</summary>

```text
mkdirSync(dist, { recursive: true })

const shared = {
  bundle: true,
  external: ['electron'],
  platform: 'node',
  target: 'node22',
  sourcemap: true,
  minify: false,
}

await build({
  ...shared,
  entryPoints: [join(appRoot, 'src/main.ts')],
  format: 'cjs',
  outfile: join(dist, 'main.cjs'),
})

await build({
  ...shared,
  entryPoints: [join(appRoot, 'src/preload.ts')],
  format: 'cjs',
  outfile: join(dist, 'preload.cjs'),
})

for (const asset of ['icon.png', 'brand-icon.png', 'pilot-harness.patch.yml', 'shell.html', 'shell.js']) {
  cpSync(join(appRoot, 'assets', asset), join(dist, asset))
}

```

</details>

**依据 4 · 源码核查**：[apps/desktop/src/main.ts:161-193](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L161-L193)

实际窗口/renderer限制。

<details>
<summary>查看原文（33行）</summary>

```text
function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 940,
    minHeight: 640,
    show: false,
    title: 'Pilot Harness',
    icon: applicationIconPath(),
    backgroundColor: process.platform === 'darwin'
      ? '#00ffffff'
      : nativeThemeBackgroundColor(nativeTheme.shouldUseDarkColors),
    ...(process.platform === 'darwin'
      ? {
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 20, y: 21 },
        vibrancy: 'under-window',
        transparent: true,
        visualEffectState: 'followWindow',
      }
      : process.platform === 'win32'
        ? { titleBarStyle: 'hidden', titleBarOverlay: titleBarOverlay() }
        : {}),
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: true,
    },
  })

  installNavigationPolicy(window)
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src/main.ts:255-305](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L255-L305)

真实child/profile/loopback与readiness。

<details>
<summary>查看原文（51行）</summary>

```text
function launchHarness(): Promise<string> {
  const entry = resolveDshEntry()
  if (!existsSync(entry)) {
    return Promise.reject(new Error(`DeepSeek Harness runtime is missing: ${entry}. Run pnpm run build before desktop:dev.`))
  }

  const dshHome = resolveDshHome()
  mkdirSync(dshHome, { recursive: true })
  const patchPath = join(__dirname, 'pilot-harness.patch.yml')
  const generation = ++launchGeneration
  const child = spawn(process.execPath, [
    entry,
    'web',
    '--patch',
    patchPath,
    '--host',
    '127.0.0.1',
    '--port',
    '0',
  ], {
    cwd: app.getPath('home'),
    env: {
      ...process.env,
      DSH_HOME: dshHome,
      ELECTRON_RUN_AS_NODE: '1',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
  })
  child.stdin.end()
  harnessProcess = child

  return new Promise((resolveLaunch, rejectLaunch) => {
    let settled = false
    const stdout = new LineBuffer()
    const stderr = new LineBuffer()
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      rejectLaunch(new Error(`DeepSeek Harness did not become ready within ${STARTUP_TIMEOUT_MS / 1_000} seconds.`))
    }, STARTUP_TIMEOUT_MS)

    const acceptLine = (source: 'stdout' | 'stderr', line: string): void => {
      rememberLog(source, line)
      if (settled || generation !== launchGeneration) return
      const url = extractHarnessServerUrl(line)
      if (url === undefined) return
      settled = true
      clearTimeout(timer)
      resolveLaunch(url)
    }
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src/server-url.ts:1-20](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/server-url.ts#L1-L20)

readiness真实地址条件。

<details>
<summary>查看原文（20行）</summary>

```text
/** Accept only the loopback HTTP server printed by `dsh web`. */
export function isHarnessServerUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:'
      && (url.hostname === '127.0.0.1' || url.hostname === 'localhost')
      && url.username === ''
      && url.password === ''
      && url.port !== ''
  } catch {
    return false
  }
}

/** Extract the settled server URL from the line emitted by the Web bundle. */
export function extractHarnessServerUrl(line: string): string | undefined {
  const match = /(?:^|\s)dsh web:\s+(http:\/\/[^\s]+)/.exec(line)
  if (match?.[1] === undefined || !isHarnessServerUrl(match[1])) return undefined
  return match[1]
}
```

</details>

**依据 7 · 源码核查**：[apps/desktop/src/main.ts:315-351](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L315-L351)

失败/退出与真实loadURL。

<details>
<summary>查看原文（37行）</summary>

```text
    child.once('error', (error) => {
      if (settled || generation !== launchGeneration) return
      settled = true
      clearTimeout(timer)
      rejectLaunch(error)
    })
    child.once('exit', (code, signal) => {
      for (const line of stdout.flush()) acceptLine('stdout', line)
      for (const line of stderr.flush()) acceptLine('stderr', line)
      rememberLog('desktop', `harness exited code=${String(code)} signal=${String(signal)}`)
      if (generation !== launchGeneration || quitting) return
      harnessProcess = null
      harnessUrl = null
      if (!settled) {
        settled = true
        clearTimeout(timer)
        rejectLaunch(new Error(`DeepSeek Harness exited before startup (code ${String(code)}).`))
        return
      }
      void showShell('failed', `DeepSeek Harness stopped unexpectedly (code ${String(code)}).`)
    })
  })
}

async function restartHarness(): Promise<void> {
  if (launchPromise !== null) return launchPromise
  launchPromise = (async () => {
    await showShell('loading')
    await stopHarness()
    try {
      const url = await launchHarness()
      harnessUrl = url
      if (mainWindow !== null && !mainWindow.isDestroyed()) await mainWindow.loadURL(url)
    } catch (error) {
      rememberLog('desktop', `startup failed: ${String(error)}`)
      await showShell('failed', error instanceof Error ? error.message : String(error))
    }
```

</details>

**依据 8 · 源码核查**：[apps/desktop/src/main.ts:126-158](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L126-L158)

导航与外链策略。

<details>
<summary>查看原文（33行）</summary>

```text
function isAllowedNavigation(target: string): boolean {
  if (target.startsWith('file:')) {
    try {
      const parsed = new URL(target)
      parsed.search = ''
      parsed.hash = ''
      return parsed.href === pathToFileURL(shellFilePath()).href
    } catch {
      return false
    }
  }
  if (harnessUrl === null) return false
  try {
    return new URL(target).origin === new URL(harnessUrl).origin
  } catch {
    return false
  }
}

function installNavigationPolicy(window: BrowserWindow): void {
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) void shell.openExternal(url)
    return { action: 'deny' }
  })
  window.webContents.on('will-navigate', (event, url) => {
    if (isAllowedNavigation(url)) return
    event.preventDefault()
    if (url.startsWith('https://') || url.startsWith('http://')) void shell.openExternal(url)
  })
  window.webContents.on('will-redirect', (event, url) => {
    if (isAllowedNavigation(url)) return
    event.preventDefault()
  })
```

</details>

**依据 9 · 源码核查**：[apps/desktop/src/preload.ts:1-21](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/preload.ts#L1-L21)

真正暴露IPC表面。

<details>
<summary>查看原文（21行）</summary>

```text
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('pilotHarness', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
  restart: () => ipcRenderer.invoke('pilot-harness:restart') as Promise<boolean>,
  pickDirectory: () => ipcRenderer.invoke('pilot-harness:pick-directory') as Promise<string | null>,
  showDataFolder: () => ipcRenderer.invoke('pilot-harness:show-data-folder') as Promise<boolean>,
  copyDiagnostics: () => ipcRenderer.invoke('pilot-harness:copy-diagnostics') as Promise<boolean>,
  setThemeSource: (source: 'system' | 'light' | 'dark') => (
    ipcRenderer.invoke('pilot-harness:set-theme-source', source) as Promise<boolean>
  ),
})

window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.pilotDesktop = 'true'
  document.documentElement.dataset.pilotPlatform = process.platform
})
```

</details>

**依据 10 · 源码核查**：[apps/desktop/src/main.ts:419-436](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L419-L436)

真实IPC接收和主题sender检查。

<details>
<summary>查看原文（18行）</summary>

```text
  app.whenReady().then(async () => {
    restoreNativeThemeSource()
    if (process.platform === 'darwin') app.dock?.setIcon(applicationIconPath())
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => { callback(false) })
    ipcMain.handle('pilot-harness:restart', async () => { await restartHarness(); return harnessUrl !== null })
    ipcMain.handle('pilot-harness:pick-directory', pickDirectory)
    ipcMain.handle('pilot-harness:show-data-folder', async () => {
      mkdirSync(resolveDshHome(), { recursive: true })
      return (await shell.openPath(resolveDshHome())) === ''
    })
    ipcMain.handle('pilot-harness:copy-diagnostics', () => { clipboard.writeText(diagnostics()); return true })
    ipcMain.handle('pilot-harness:set-theme-source', (event, source: unknown) => {
      if (!isAllowedNavigation(event.senderFrame?.url ?? '')) return false
      if (!isNativeThemeSource(source)) return false
      nativeTheme.themeSource = source
      persistNativeThemeSource(source)
      applyNativeTheme()
      return true
```

</details>

#### 缺口

- 未构建/启动发行物或核全部IPC/平台签名与资源。
  **影响**：不能把README下载页/配置安全标记当成品安全、兼容或真实任务成功。
  **进一步探讨**：匹配平台固定包独立userData，核失败/正常启动与实际窗口/IPC，再核最小任务和进程退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型与工具结果是否真实回到下一步，哪些是底座？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Pilot profile禁默认单厂商路由并给setup-required占位，挂既有llm-pi-ai，用户须连接真实Provider。当前session.models实际列provider/models并解析模型信息，逐provider失败可回报；只在当前route不可用且会话无已记录request config时选首个advertised模型，旧logged session不静默换厂商；保存默认失败仅warning，本次选择可已改变。目录/route可用不等API Key/付费端点完成调用已通过，不是作者新造provider实现。

仓内base profile实际挂agent-loop，factory注册并创建ReactLoopAgent；step用session.deriveMessages形成LLM stream request，拼assistant message，取tool-call，executeToolCalls到scheduler.prepare/dispatch，工具body真正resolveExecution→tool.execute。结果按模型次序append tool/result并把额外context放next-step；会话surface把tool/result转message，下一步再deriveMessages进入LLM，而不是只画工作流图。无tool-call/concludes/max-tokens/abort等结束条件分开。真实循环属于沿用的DSH底座能力，不给Pilot重复加技术新颖性；工具执行/模型完成和日志“completed”仍不能证明用户任务正确，权限/取消/重试全覆盖未审。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/assets/pilot-harness.patch.yml:1-30](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/assets/pilot-harness.patch.yml#L1-L30)

真实模型profile组合/占位。

<details>
<summary>查看原文（30行）</summary>

```text
# Pilot Harness desktop model profile.
#
# Keep DeepSeek Harness's adapter contract and settings hot-reload intact, but
# replace the single-vendor route with the configurable pi-ai provider plugin.
# The route starts dormant until the user connects a provider on the Providers
# page; image-capable models then flow through llm-pi-ai + attachment-local.

- id: llm-deepseek
  disabled: true

# The desktop profile does not pretend that a vendor route exists before the
# user connects one. `session.models` replaces this sentinel with the first
# actually advertised model for a blank session and persists that selection.
- id: agent-default-model
  config:
    provider: pilot-harness
    model: setup-required

# Desktop development restarts the local child explicitly. The generic HMR
# plugin depends on Node internal flags that Electron-as-Node does not expose
# consistently across Windows and Linux.
- id: hmr
  disabled: true

# Keep the configurable multi-provider adapter mounted, but leave it dormant.
# Provider routes and models enter the picker only after the user connects a
# real service on the Providers page; the desktop profile must not manufacture
# an unusable Anthropic route merely to fill the empty state.
- id: llm-pi-ai

```

</details>

**依据 2 · 源码核查**：[packages/host/apiproxy/src/api-proxy.ts:297-347](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/host/apiproxy/src/api-proxy.ts#L297-L347)

provider/model目录真实获取与失败。

<details>
<summary>查看原文（51行）</summary>

```text
async function buildModelCatalog(ctx: Context): Promise<{
  groups: ModelProviderGroup[]
  failures: ModelCatalogFailure[]
}> {
  const catalog = await Promise.all(ctx.llm.listProviders().map(async (provider) => {
    try {
      const models = await ctx.llm.listModels(provider.id)
      const entries = await Promise.all(models.map(async (model) => {
        const resolved = await ctx.llm.resolveModelInfo(provider.id, model.id)
        const reasoning: ModelReasoning | undefined = resolved.reasoning === undefined
          ? undefined
          : {
            efforts: resolved.reasoning.efforts.map(effort => ({
              id: effort.id,
              name: effort.name,
              ...effort.description === undefined
                ? {}
                : { description: effort.description },
            })),
            ...resolved.reasoning.defaultEffort === undefined
              ? {}
              : { defaultEffort: resolved.reasoning.defaultEffort },
          }
        return {
          id: model.id,
          name: model.name,
          ...model.description === undefined ? {} : { description: model.description },
          ...resolved.inputModalities === undefined
            ? {}
            : { inputModalities: [...resolved.inputModalities] },
          ...reasoning === undefined ? {} : { reasoning },
        }
      }))
      const group: ModelProviderGroup = {
        id: provider.id,
        name: provider.name,
        models: entries,
      }
      return { kind: 'group' as const, group }
    } catch (error: unknown) {
      const failure: ModelCatalogFailure = {
        id: provider.id,
        name: provider.name,
        message: error instanceof Error ? error.message : String(error),
      }
      return { kind: 'failure' as const, failure }
    }
  }))
  return {
    groups: catalog.flatMap(item => item.kind === 'group' ? [item.group] : []).filter(group => group.models.length > 0),
    failures: catalog.flatMap(item => item.kind === 'failure' ? [item.failure] : []),
```

</details>

**依据 3 · 源码核查**：[packages/host/apiproxy/src/api-proxy.ts:2215-2257](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/host/apiproxy/src/api-proxy.ts#L2215-L2257)

只修空会话/默认持久化警告。

<details>
<summary>查看原文（43行）</summary>

```text
      async models(request) {
        const { sessionId } = request.payload
        const found = await agentFor(sessionId)
        if ('error' in found) return err(request, found.error)
        const { groups, failures } = await buildModelCatalog(ctx)
        const selection = selectionFor(found.agent)
        let current = selection.current
        // A desktop profile can intentionally start with no configured route.
        // Once a provider advertises its first model, repair only a still-blank
        // session: a logged session must never be silently moved to a different
        // provider because its route is temporarily absent.
        const fallbackGroup = groups[0]
        const fallbackModel = fallbackGroup?.models[0]
        if (!routeServed(current.provider)
          && found.agent.session.requestHeader()?.config === undefined
          && fallbackGroup !== undefined
          && fallbackModel !== undefined) {
          try {
            const resolved = await ctx.llm.resolveCallConfig({
              provider: fallbackGroup.id,
              model: fallbackModel.id,
            })
            current = {
              provider: resolved.provider,
              model: resolved.model,
              ...resolved.reasoningEffort === undefined
                ? {}
                : { reasoningEffort: resolved.reasoningEffort },
            }
            selection.current = current
            try {
              await defaults.saveDefaultModelSelection?.(current)
            } catch (error: unknown) {
              ctx.logger.warn(
                `api-proxy: the first available model applies to this blank session but was not saved as the default: ${String(error)}`,
              )
            }
          } catch (error: unknown) {
            ctx.logger.warn(`api-proxy: failed to select the first available model: ${String(error)}`)
          }
        }
        const routable = routeServed(current.provider)
        return ok(request, { current: { ...current }, routable, groups, failures })
```

</details>

**依据 4 · 源码核查**：[packages/bundle/base/cordis.patch.yml:434-439](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/bundle/base/cordis.patch.yml#L434-L439)

base实际挂Loop。

```text
    # Agents created at startup. The base stays empty; raw overlays may create
    # agents, while Web creates sessions on client request.
    - id: agent-loop
      name: '@deepseek-ai/dsh-agent-loop'
      config:
        agents: []
```

**依据 5 · 源码核查**：[packages/core/agent-loop/src/index.ts:346-352](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/index.ts#L346-L352)

factory真实注册。

```text
    validateConfiguredAgents(this.config.agents)
    this.ownership = new FactoryOwnership(ctx.fiber)
    this.runtime = { ctx }
    ctx.effect(() => () => this.ownership.dispose(), 'agentLoop.transactions()')
    ctx.effect(() => ctx.agents.setFactory(this), 'agentLoop.setFactory()')
    ctx.systemPrompt.variable('provider', context => context.agent?.options.provider)
    ctx.systemPrompt.variable('model', context => context.agent?.options.model)
```

**依据 6 · 源码核查**：[packages/core/agent-loop/src/index.ts:545-552](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/index.ts#L545-L552)

实际ReactLoopAgent创建。

```text
      /* v8 ignore next -- unreachable String() arm, see above */
      throw abort.signal.reason instanceof Error ? abort.signal.reason : new Error(String(abort.signal.reason))
    }
    try {
      const agent = machine = new ReactLoopAgent(loopCtx, id, options, session)
      machineReady.resolve()
      assertLive()

```

**依据 7 · 源码核查**：[packages/core/agent-loop/src/agent.ts:263-301](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/agent.ts#L263-L301)

步进与下一步循环。

<details>
<summary>查看原文（39行）</summary>

```text
      while (true) {
        signal.throwIfAborted()
        const step = phase.step + 1
        const decision = await this.preStep(target, { turn, step })
        if (decision.kind === 'reject') {
          turnEnds = { kind: 'blocked' }
          return false
        }
        if (turnEnds && decision.messages.length === 0) break
        // A removed waking message or an enter decision rewritten to empty
        // still owns the initial turn boundary, but it spends no model call.
        if (phase.step === 0 && decision.messages.length === 0) {
          turnEnds = { kind: 'completed' }
          return false
        }
        signal.throwIfAborted()
        this.session.append('step/start', { turn, step })
        phase.step = step
        try {
          for (const message of decision.messages) {
            this.session.append('user/message', message, { surfaceOp: 'append' })
          }
          // max-tokens is sticky: once any step hits the ceiling, later steps
          // that complete normally must not downgrade the turn outcome.
          const stepEnd = await this.step(decision.assembly)
          // max-tokens stays sticky: a later completed step must not
          // downgrade the turn outcome.
          if (turnEnds === null || turnEnds.kind !== 'max-tokens') turnEnds = stepEnd
        } finally {
          this.session.append('step/end', { turn, step })
        }
        signal.throwIfAborted()
        if (turnEnds && this.inbox.nextStep.length === 0) {
          await this.dispatch.serial('agent/turn-stopping', { turn, signal })
          signal.throwIfAborted()
        }
        if (turnEnds && this.inbox.nextStep.length === 0) break
        target = 'next-step'
      }
```

</details>

**依据 8 · 源码核查**：[packages/core/agent-loop/src/agent.ts:339-399](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/agent.ts#L339-L399)

模型流→工具calls。

<details>
<summary>查看原文（61行）</summary>

```text
    while (true) {
      const { request, preparedCall } = await this.buildRequest(
        turn, step, assembly.tools, system, this.session.deriveMessages(), signal,
      )
      const assembler = new BlockAssembler()
      const chunkSeqs: number[] = []
      const stream = preparedCall?.stream(request) ?? this.loopCtx.llm.stream(request)
      signal.throwIfAborted()
      for await (const chunk of stream) {
        signal.throwIfAborted()
        chunkSeqs.push(this.session.append('assistant/chunk', { turn, step, chunk }).seq)
        assembler.push(chunk)
      }
      signal.throwIfAborted()
      const finish = assembler.finish
      if (finish.kind === 'error' || finish.kind === 'aborted') {
        const action = await this.dispatch.waterfall(
          'agent/request-error', {
            turn,
            step,
            provider: request.provider,
            failure: finish.failure,
            retryPolicy: preparedCall?.retryPolicy,
            signal,
          },
          () => Promise.resolve<RequestErrorAction>(undefined),
        )
        signal.throwIfAborted()
        if (action?.kind !== 'retry') {
          throw new LlmError(finish.failure.message, finish.failure.code, finish.failure)
        }
        continue
      }

      const message = createAssistantMessage({
        content: assembler.blocks(),
        source: {
          provider: request.provider,
          model: request.model,
          ...assembler.replayState !== undefined ? { replayState: assembler.replayState } : {},
        },
      })
      this.session.append(
        'assistant/message',
        {
          turn,
          step,
          message,
          ...assembler.usage === undefined ? {} : { usage: assembler.usage },
        },
        { surfaceOp: 'append', sourceEventSeqs: chunkSeqs },
      )
      if (finish.kind === 'max-tokens') return { kind: 'max-tokens' }

      const toolCalls = message.content.filter(block => block.type === 'tool-call')
      if (toolCalls.length === 0) return { kind: 'completed' }
      const { concluded } = await executeToolCalls(
        this.loopCtx, turn, step, toolCalls, signal,
        context => this.inbox.splice('next-step', this.inbox.nextStep.length, 0, [context]),
      )
      return concluded ? { kind: 'completed' } : null
```

</details>

**依据 9 · 源码核查**：[packages/core/agent-loop/src/tool-calls.ts:145-176](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/tool-calls.ts#L145-L176)

结果次序和真正scheduler派发。

<details>
<summary>查看原文（32行）</summary>

```text
  // `committed` advances only across contiguous model-order slots.
  const commitReady = async (): Promise<void> => {
    while (committed < group.length) {
      const slot = slots[committed]
      if (slot === undefined) break
      const call = group[committed]
      const result = slot.needsPost
        ? await ctx.tools[TOOL_RUNTIME_SCHEDULER].finalize(slot.exec, slot.result)
        : ctx.tools[TOOL_RUNTIME_SCHEDULER].finish(slot.exec, slot.result)
      // oxlint-disable-next-line typescript/no-non-null-assertion -- bounded index
      appendToolResult(session, turn, step, call!.block, result, callSeqs[committed]!)
      for (const context of result.additionalContexts ?? []) acceptContext(context)
      concluded ||= result.concludesTurn === true
      committed++
    }
  }

  const inFlight = new Map<number, Promise<number>>()

  const startCall = async (index: number): Promise<void> => {
    // oxlint-disable-next-line typescript/no-non-null-assertion -- bounded index
    const call = group[index]!
    callSeqs[index] = appendToolCall(session, turn, step, call.block)
    started++
    const prepared = await ctx.tools[TOOL_RUNTIME_SCHEDULER].prepare(call.exec)
    throwSchedulerFailure()
    switch (prepared.kind) {
      case 'dispatch': {
        const promise = ctx.tools[TOOL_RUNTIME_SCHEDULER].dispatch(prepared.exec).then(
          (outcome) => {
            slots[index] = { exec: prepared.exec, result: outcome.result, needsPost: outcome.kind === 'post-result' }
            return index
```

</details>

**依据 10 · 源码核查**：[packages/core/tools/src/index.ts:1532-1555](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/tools/src/index.ts#L1532-L1555)

真正tool.execute callee。

<details>
<summary>查看原文（24行）</summary>

```text
  private async dispatchToolBody(exec: MutableToolRunContext): Promise<ToolExecutionResult> {
    const state = this.cancellationStates.get(exec)
    /* v8 ignore next -- only registry-minted executions reach the staged scheduler methods */
    if (state === undefined) throw new Error('tool registry scheduler invariant violated: missing cancellation state')
    const wrapperSignal = exec.signal
    const fused = fuseToolSignals(state.callerSignal, wrapperSignal)
    const signal = fused.signal

    if (isAborted(signal)) {
      fused.dispose()
      return toolAbortedBeforeDispatchResult()
    }
    exec.signal = signal
    try {
      const tool = this.resolveExecution(exec.name, exec.agent, exec.parent !== undefined)
      if (!tool) throw new ToolNotFoundError(exec.name)
      state.bodyInvoked = true
      const returned = await tool.execute(exec.arguments, exec)
      const result = this.createSuccessResult(exec, tool, returned)
      return isAborted(signal)
        ? toolAbortedResult(result)
        : result
    } catch (error: unknown) {
      return toolErrorResult(error)
```

</details>

**依据 11 · 源码核查**：[packages/core/agent-loop/src/tool-calls.ts:275-288](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/agent-loop/src/tool-calls.ts#L275-L288)

工具结果持久事件。

<details>
<summary>查看原文（14行）</summary>

```text
): void {
  const message = createToolResultMessage({
    callId: block.id,
    content: result.content,
    isError: result.isError,
  })
  session.append('tool/result', {
    turn, step,
    message,
    ...result.error?.info ? { error: result.error.info } : {},
    // The tool's private presentation payload (e.g. a result-time diff),
    // persisted so a UI bridge reproduces the card on replay.
    ...result.meta !== undefined ? { meta: result.meta } : {},
  }, { surfaceOp: 'append', sourceEventSeqs: [callSeq] })
```

</details>

**依据 12 · 源码核查**：[packages/core/session/src/surface.ts:106-112](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/session/src/surface.ts#L106-L112)

tool/result→模型消息。

```text
    case 'tool/result': {
      return event.data.message
    }
    default:
      // A non-surface event (boundary, chunk, log-only record) projects to
      // no message. Merge-extensible union: no assertNever here.
      return null
```

**依据 13 · 源码核查**：[packages/core/session/src/index.ts:735-746](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/core/session/src/index.ts#L735-L746)

deriveMessages把surface回LLM。

<details>
<summary>查看原文（12行）</summary>

```text
    for (const seq of nodes.slice(this.derivedNodes)) {
      // Surface sequences are built from this.log — seq is always a valid
      // index by construction. The non-null assertion expresses that invariant.
      // oxlint-disable-next-line typescript/no-non-null-assertion
      const msg = this.deriveEventMessage(this.log[seq]!)
      // A surface node is one of the five message-producing types, but an
      // empty-content assistant/message (a max-tokens step that hosts only
      // usage) derives to null and must not enter the transcript.
      if (msg) this.derived.push(msg)
    }
    this.derivedNodes = nodes.length
    return [...this.derived]
```

</details>

**依据 14 · 源码核查**：[packages/boot/app-boot/src/profile.ts:113-125](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/boot/app-boot/src/profile.ts#L113-L125)

web模板确包含base与web-app底座。

<details>
<summary>查看原文（13行）</summary>

```text
/** The shipped profile templates auto-initialized on first use, by name. */
export const PROFILE_TEMPLATES: Record<string, readonly string[]> = {
  web: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'],
  headless: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless'],
}

/** Installation-owned bundle tuples normalized to the shipped template. */
const INSTALLATION_OWNED_PROFILE_TUPLES: Record<string, readonly string[]> = {
  headless: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', '@deepseek-ai/dsh-headless'],
}

/** The bundle list a `dsh plugin` init uses for a name with no shipped template. */
export const DEFAULT_PROFILE_BUNDLES: readonly string[] = ['@deepseek-ai/dsh-base']
```

</details>

#### 缺口

- 未调用真实Provider或测工具/审批/取消/断流恢复和最终业务结果。
  **影响**：能证明存在真工具循环，不证明模型route可用等于任务可完成、预算有界或所有副作用可安全重试。
  **进一步探讨**：已知任务与无害工具核调用结果确入下一request，分别测无模型/凭据错/断流/取消及业务真值，不按步数或日志验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Files侧栏如何到真实文件操作，Workspace约束够不够？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

桌面patch实际插入ui-worktree，其Host/client双面是普通bundle；client注册header toggle与root级right-sidebar，AppFrame真实渲染此slot。面板按当前session或最近workspace选targetId，调用注入RPC，Host从workspaceRegistry解析root，safeRelative拒绝绝对/点段，realpath检查目录在root内，列表跳symlink/元数据/依赖目录并给截断信息；fileCount上限在UI用≥提示，不能当全仓准确清单。创建目录/空文件直接mkdir/open wx，rename经lstat拒symlink/检查目标后fs.rename，结果刷新列表；这是实际写文件，不经过模型工具批准来替用户授权。

行操作可把相对@path直接写当前会话草稿，未发送更不是模型已读文件；openPath委托已有公共workspace接口，本轮未完整追其原生打开后端。Host的路径检查与UI的意图归属需分开：root级panel在targetId变化时清state，但异步load回包直接setListings，没有当前workspace/代次核验或传AbortSignal。本轮未运行复现；若旧请求晚回到复用面板，可能在新workspace标题下显示旧列表，需真实延迟切换核查，不能称全程目标绑定。rename也是先检查再rename，不是原子no-replace证明；并发换链接/目标出现/取消后已写未回包都待核。branch会按.git指针读Git目录，不能把所有读取泛称绝不出workspace。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/assets/pilot-harness.patch.yml:32-46](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/assets/pilot-harness.patch.yml#L32-L46)

真实插入文件插件。

<details>
<summary>查看原文（15行）</summary>

```text
# toggle/panel. It stays outside Harness core so upstream Web updates can be
# adopted by updating dependencies while keeping this row.
- insert:
    - id: codepilot-theme
      # Client-owned theme: visible in plugin inventory and fully reversible
      # when this profile row is disabled or removed.
      name: '@deepseek-ai/dsh-client-ui-codepilot-theme'
    - id: pilot-worktree
      # Shipped as an ordinary in-box plugin dependency so both its Host and
      # Client faces are discovered by the same package name. A browser-only
      # Harness uses this identical row after `dsh plugin install`.
      name: '@deepseek-ai/dsh-ui-worktree'
    - id: time-context
      # Schedule uses the ordinary Harness time context; no desktop-only
      # reminder engine is introduced by this profile.
```

</details>

**依据 2 · 源码核查**：[packages/workspace/ui-worktree/package.json:12-39](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/package.json#L12-L39)

普通bundle/client出口。

<details>
<summary>查看原文（28行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": { "types": "./lib/types/index.d.ts", "default": "./lib/index.js" },
    "./invariant": { "types": "./lib/types/invariant.d.ts", "default": "./lib/invariant.js" },
    "./client": { "types": "./lib/types/client/index.d.ts", "default": "./lib/client.js" },
    "./types": { "types": "./lib/types/types.d.ts", "default": "./lib/types/types.js" },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
  },
  "scripts": { "bundle": "tsdown", "watch": "tsdown --watch" },
```

</details>

**依据 3 · 源码核查**：[packages/workspace/ui-worktree/src/client/index.ts:32-75](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/index.ts#L32-L75)

RPC注入/slot/草稿与打开动作。

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const connection = ctx.get('connection') as ConnectionHandle
  const call = async <T>(endpoint: string, payload: unknown, signal?: AbortSignal): Promise<T> => {
    const result = await connection.rpc.call(WORKTREE_CHANNEL, endpoint, payload, signal)
    if (!result.ok) throw new Error(result.error.message)
    return result.value as T
  }
  const loadWorktree = (request: WorktreeListRequest, signal?: AbortSignal) =>
    call<WorktreeListing>(WORKTREE_LIST_ENDPOINT, request, signal)
  const mutateWorktree = (mutation: WorktreeMutation, signal?: AbortSignal) =>
    call<WorktreeMutationResult>(WORKTREE_MUTATE_ENDPOINT, mutation, signal)
  const controller = new WorktreePanelController((open) => {
    if (open) ctx.layout.openRightSidebar?.()
    else ctx.layout.closeRightSidebar?.()
  })
  ctx.effect(() => () => { controller.close() }, 'ui-worktree: release dock width on dispose')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-worktree: dictionaries')
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'worktree-toggle',
    order: 20,
    locale: NS,
    inject: () => ({ controller }),
  }, WorktreeHeaderToggle))
  ctx.slots.inject('shell.right-sidebar', () => ctx.slots.register({
    name: 'shell.right-sidebar',
    id: 'worktree-panel',
    order: 20,
    locale: NS,
    inject: () => ({
      controller,
      loadWorktree,
      mutateWorktree,
      openPath: (path: string) => ctx.workspaces.openPath(path),
      addPathToInput: (sessionId: SessionId, path: string) => {
        const actx = ctx.sessions.scope(sessionId)
        if (actx === undefined) throw new Error(`worktree: session "${sessionId}" resolved no scope`)
        const conversation = actx.get('conversation')
        if (conversation === undefined) throw new Error('worktree: conversation service unavailable')
        const input = conversation.input.for(actx)
        input.setDraft(appendWorktreePath(input.state.getSnapshot().draft, path))
      },
    }),
  }, WorktreePanel))
```

</details>

**依据 4 · 源码核查**：[packages/client/ui-layout/src/client/index.ts:134-141](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/client/ui-layout/src/client/index.ts#L134-L141)

right-sidebar为root scope。

```text
    const disposeRegistration = ctx.slots.register({
      name: 'root',
      children: {
        'sidebar': { kind: 'single', scope: 'root' },
        'conversation': { kind: 'single', scope: 'session-maybe' },
        'details': { kind: 'single', scope: 'session' },
        'shell.right-sidebar': { kind: 'list', scope: 'root' },
        'shell.overlay': { kind: 'list', scope: 'root' },
```

**依据 5 · 源码核查**：[packages/client/ui-layout/src/client/AppFrame.tsx:199-204](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/client/ui-layout/src/client/AppFrame.tsx#L199-L204)

真实slot消费。

```text
            the shell's own pending rendering. The conversation
            is session-maybe; the strict details entry naturally renders
            empty while no session is current. */}
        <CenterColumn>{renderSlot('conversation', {})}</CenterColumn>
        <RightSidebarColumn>{renderSlot('shell.right-sidebar', {})}</RightSidebarColumn>
        <DetailsColumn>{renderSlot('details', {})}</DetailsColumn>
```

**依据 6 · 源码核查**：[packages/workspace/ui-worktree/src/client/WorktreePanel.tsx:34-79](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/WorktreePanel.tsx#L34-L79)

target/清state/异步load无响应代次核查。

<details>
<summary>查看原文（46行）</summary>

```text
  const open = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot).open
  const currentSession = useSessions(state => state.current)
  const targetId = useWorkspaces((state): string | undefined => {
    const workspace = currentSession === undefined
      ? state.items.find(item => item.workspaceId === state.recentWorkspaceId)
      : state.items.find(item => item.sessionIds.includes(currentSession))
    return workspace?.workspaceId
  })
  const targetTitle = useWorkspaces(state => state.items.find(item => item.workspaceId === targetId)?.title)
  const targetPath = useWorkspaces(state => state.items.find(item => item.workspaceId === targetId)?.path)
  const [listings, setListings] = useState<ReadonlyMap<string, WorktreeListing>>(new Map())
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())
  const [loading, setLoading] = useState<ReadonlySet<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [create, setCreate] = useState<PendingCreate | null>(null)
  const [renaming, setRenaming] = useState<PendingRename | null>(null)
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const load = useCallback(async (relative: string) => {
    if (targetId === undefined) return
    setLoading(current => new Set(current).add(relative))
    setError(null)
    try {
      const listing = await loadWorktree({ workspaceId: targetId, relative })
      setListings(current => new Map(current).set(relative, listing))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setLoading((current) => {
        const next = new Set(current)
        next.delete(relative)
        return next
      })
    }
  }, [loadWorktree, targetId])

  useEffect(() => {
    setListings(new Map())
    setExpanded(new Set())
    setCreate(null)
    setRenaming(null)
    setMenuPath(null)
    setError(null)
    if (open && targetId !== undefined) void load('')
  }, [open, targetId, load])
```

</details>

**依据 7 · 源码核查**：[packages/workspace/ui-worktree/src/client/WorktreePanel.tsx:97-122](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/WorktreePanel.tsx#L97-L122)

UI实际create/rename与刷新。

<details>
<summary>查看原文（26行）</summary>

```text
  const mutate = useCallback(async (action: WorktreeMutation, refreshParent: string) => {
    setError(null)
    await mutateWorktree(action)
    setCreate(null)
    setRenaming(null)
    setDraft('')
    await Promise.all([load(refreshParent), refreshParent === '' ? Promise.resolve() : load('')])
  }, [load, mutateWorktree])

  const submitCreate = (event: FormEvent) => {
    event.preventDefault()
    if (targetId === undefined || create === null || draft.trim() === '') return
    void mutate({
      operation: create.kind === 'file' ? 'create-file' : 'create-directory',
      workspaceId: targetId,
      parent: create.parent,
      name: draft,
    }, create.parent).catch((reason: unknown) => { setError(reason instanceof Error ? reason.message : String(reason)) })
  }

  const submitRename = (event: FormEvent) => {
    event.preventDefault()
    if (targetId === undefined || renaming === null || draft.trim() === '') return
    const parent = renaming.path.includes('/') ? renaming.path.slice(0, renaming.path.lastIndexOf('/')) : ''
    void mutate({ operation: 'rename', workspaceId: targetId, path: renaming.path, name: draft }, parent)
      .catch((reason: unknown) => { setError(reason instanceof Error ? reason.message : String(reason)) })
```

</details>

**依据 8 · 源码核查**：[packages/workspace/ui-worktree/src/client/WorktreePanel.tsx:241-244](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/WorktreePanel.tsx#L241-L244)

截断计数≥。

```text
  const subtitle = useMemo(() => fileCount === undefined
    ? targetTitle ?? ''
    : `${targetTitle ?? ''} · ${root?.truncated ? '≥' : ''}${fileCount} ${t('panel.files')}`,
  [fileCount, root?.truncated, t, targetTitle])
```

**依据 9 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:36-61](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L36-L61)

名称/相对路径/root约束。

<details>
<summary>查看原文（26行）</summary>

```text
  if (value.includes('\0') || isAbsolute(value)) throw new PublicWorktreeError('invalid relative path')
  const segments = value.split(/[\\/]+/).filter(Boolean)
  if (segments.some(segment => segment === '.' || segment === '..')) {
    throw new PublicWorktreeError('invalid relative path')
  }
  return segments.join('/')
}

function safeName(value: string): string {
  if (value !== value.trim() || value === '' || value === '.' || value === '..'
    || /[\\/\0<>:"|?*]/u.test(value) || value.endsWith('.') || WINDOWS_RESERVED_NAME.test(value)) {
    throw new PublicWorktreeError('name is not portable across supported desktop platforms')
  }
  return value
}

function isInside(root: string, target: string): boolean {
  const rel = relative(root, target)
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel))
}

async function confinedDirectory(root: string, relativePath: string): Promise<string> {
  const candidate = resolve(root, safeRelative(relativePath))
  const canonical = await realpath(candidate)
  if (!isInside(root, canonical)) throw new PublicWorktreeError('path leaves the workspace')
  return canonical
```

</details>

**依据 10 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:64-104](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L64-L104)

列表/计数跳过与上限。

<details>
<summary>查看原文（41行）</summary>

```text
async function directoryEntries(
  root: string,
  directory: string,
): Promise<{ entries: WorktreeEntry[]; truncated: boolean }> {
  const entries: WorktreeEntry[] = []
  let truncated = false
  const handle = await opendir(directory)
  for await (const row of handle) {
    if (IGNORED_NAMES.has(row.name) || row.isSymbolicLink() || (!row.isDirectory() && !row.isFile())) continue
    if (entries.length >= MAX_DIRECTORY_ENTRIES) {
      truncated = true
      break
    }
    entries.push({
      name: row.name,
      path: relative(root, join(directory, row.name)).split(sep).join('/'),
      kind: row.isDirectory() ? 'directory' : 'file',
    })
  }
  entries.sort((left, right) => left.kind === right.kind
    ? left.name.localeCompare(right.name)
    : left.kind === 'directory' ? -1 : 1)
  return { entries, truncated }
}

async function countFiles(root: string): Promise<{ count: number; truncated: boolean }> {
  let count = 0
  const pending = [root]
  while (pending.length > 0 && count < MAX_COUNTED_FILES) {
    const current = pending.pop()
    if (current === undefined) break
    const handle = await opendir(current)
    for await (const row of handle) {
      if (IGNORED_NAMES.has(row.name) || row.isSymbolicLink()) continue
      if (row.isDirectory()) pending.push(join(current, row.name))
      else if (row.isFile()) count += 1
      if (count >= MAX_COUNTED_FILES) break
    }
  }
  return { count, truncated: count >= MAX_COUNTED_FILES }
}
```

</details>

**依据 11 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:167-233](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L167-L233)

真实workspace解析/创建/rename。

<details>
<summary>查看原文（67行）</summary>

```text
async function listWorkspace(ctx: Context, request: WorktreeListRequest): Promise<WorktreeListing> {
  const workspace = ctx.workspaceRegistry.get(WorkspaceId(request.workspaceId))
  if (workspace === undefined) throw new PublicWorktreeError('workspace not found')
  const root = await realpath(workspace.path)
  const relativePath = safeRelative(request.relative ?? '')
  const directory = await confinedDirectory(root, relativePath)
  const summaryOnly = request.summary === 'branch'
  const listing = summaryOnly ? { entries: [], truncated: false } : await directoryEntries(root, directory)
  const count = !summaryOnly && relativePath === '' ? await countFiles(root) : undefined
  const branch = summaryOnly && relativePath === '' ? await currentBranch(root) : undefined
  return {
    workspaceId: request.workspaceId,
    workspaceTitle: workspace.title,
    relative: relativePath,
    entries: listing.entries,
    ...(listing.truncated ? { entriesTruncated: true } : {}),
    ...(count === undefined ? {} : { fileCount: count.count, truncated: count.truncated }),
    ...(branch === undefined ? {} : { branch }),
  }
}

async function mutateWorkspace(ctx: Context, action: WorktreeMutation): Promise<WorktreeMutationResult> {
  const workspace = ctx.workspaceRegistry.get(WorkspaceId(action.workspaceId))
  if (workspace === undefined) throw new PublicWorktreeError('workspace not found')
  const root = await realpath(workspace.path)
  const name = safeName(action.name)
  if (action.operation === 'rename') {
    const sourceRelative = safeRelative(action.path)
    if (sourceRelative === '') throw new PublicWorktreeError('workspace root cannot be renamed')
    const slash = sourceRelative.lastIndexOf('/')
    const parentRelative = slash < 0 ? '' : sourceRelative.slice(0, slash)
    const sourceName = slash < 0 ? sourceRelative : sourceRelative.slice(slash + 1)
    const parent = await confinedDirectory(root, parentRelative)
    const source = join(parent, sourceName)
    const sourceStat = await lstat(source)
    if (sourceStat.isSymbolicLink()) throw new PublicWorktreeError('symbolic links cannot be renamed')
    const destination = join(parent, name)
    if (source === destination) return { ok: true, path: sourceRelative }
    try {
      await lstat(destination)
      const [sourceCanonical, destinationCanonical] = await Promise.all([realpath(source), realpath(destination)])
      if (sourceCanonical !== destinationCanonical) throw new PublicWorktreeError('an item with that name already exists')
    } catch (error) {
      if (!isMissing(error)) throw error
    }
    try {
      await rename(source, destination)
    } catch (error) {
      if (isNameConflict(error)) throw new PublicWorktreeError('an item with that name already exists')
      throw error
    }
    return { ok: true, path: relative(root, destination).split(sep).join('/') }
  }

  const parent = await confinedDirectory(root, safeRelative(action.parent))
  const destination = join(parent, name)
  try {
    if (action.operation === 'create-directory') await mkdir(destination)
    else {
      const handle = await open(destination, 'wx')
      await handle.close()
    }
  } catch (error) {
    if (isNameConflict(error)) throw new PublicWorktreeError('an item with that name already exists')
    throw error
  }
  return { ok: true, path: relative(root, destination).split(sep).join('/') }
```

</details>

**依据 12 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:240-256](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L240-L256)

Host真实RPC与loopback声明。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.connection.rpc.handle(WORKTREE_CHANNEL, async (endpoint, payload, signal) => {
    if (signal.aborted) return { ok: false, error: { code: 'cancelled', message: 'request cancelled', details: {} } }
    try {
      if (endpoint === WORKTREE_LIST_ENDPOINT) {
        return { ok: true, value: await listWorkspace(ctx, listRequest(payload)) }
      }
      if (endpoint === WORKTREE_MUTATE_ENDPOINT) {
        return { ok: true, value: await mutateWorkspace(ctx, mutation(payload)) }
      }
      return badRequest('unknown worktree operation')
    } catch (error) {
      if (error instanceof PublicWorktreeError) return badRequest(error.message)
      ctx.logger.warn(`ui-worktree: Workspace operation failed: ${String(error)}`)
      return internalError('workspace operation failed')
    }
  }, { authority: 'loopback' }), 'ui-worktree: loopback Workspace RPC')
```

</details>

**依据 13 · 源码核查**：[packages/client/connection/src/rpc-host.ts:78-105](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/client/connection/src/rpc-host.ts#L78-L105)

声明真正入信任检查。

<details>
<summary>查看原文（28行）</summary>

```text
        const interceptor = this.interceptors.get(channel)
        if (endpoint === undefined || interceptor === undefined || !interceptor.matches(endpoint)) {
          return fallback.fetch(request)
        }
        if (interceptor.options.authority === 'loopback' && !isTrustedApiRequest(request, [])) {
          return Promise.resolve(new Response('forbidden', { status: 403 }))
        }
        return interceptor.fetchHandler.fetch(request)
      },
    }
  }

  private register(
    owner: Context,
    channel: string,
    handler: ConnectionRpcHandler,
    options: ConnectionRpcHandlerOptions,
  ): () => Promise<void> {
    assertChannel(channel)
    const trustedHosts = options.authority === 'loopback' ? [] : this.trustedHosts
    const fetchHandler = rpcFetchHandler(channel, handler)
    const route: WebRoute = {
      kind: 'prefix',
      path: channel,
      handler: async (req, res) => {
        if (!isTrustedApiRequest(req, trustedHosts)) {
          res.writeHead(403)
          res.end('forbidden')
```

</details>

**依据 14 · 源码核查**：[packages/client/connection/src/api-request-trust.ts:96-122](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/client/connection/src/api-request-trust.ts#L96-L122)

Host/Origin fence，非人类身份认证。

<details>
<summary>查看原文（27行）</summary>

```text
export function isTrustedApiRequest(request: ApiTrustRequest, trustedHosts: readonly string[]): boolean {
  // Host fence (DNS-rebinding defense), applied to every request: the browser
  // fills Host from the URL it believes it is talking to, so a rebound page
  // carries the attacker's domain here even though the socket lands on this
  // server. There is no marker shortcut — a browser read over plain HTTP
  // (images and navigations) arrives with neither Origin nor
  // Fetch-Metadata, indistinguishable from curl, and its response is readable
  // by the rebound page.
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  // Cross-site fence: modern browsers label the initiator relationship on
  // every fetch; an explicit cross-site marker is refused regardless of Origin.
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  // Origin fence: when a browser attaches an Origin it must be exactly this
  // authority (compared through the same normalization as the Host). Absent
  // Origin is fine — the Host fence above already bound the request. The
  // literal "null" (sandboxed iframes, file: pages) is an opaque origin, refused.
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 15 · 源码核查**：[packages/workspace/ui-worktree/src/client/draft.ts:1-10](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/draft.ts#L1-L10)

只插入草稿路径。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Append one workspace-relative file reference to the current composer draft.
 * @param draft - existing unsent composer text.
 * @param path - Workspace-relative file or directory path.
 * @returns the draft with a spaced `@path` token and trailing space.
 */
export function appendWorktreePath(draft: string, path: string): string {
  const separator = draft === '' || /\s$/.test(draft) ? '' : ' '
  return `${draft}${separator}@${path} `
}
```

</details>

**依据 16 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:107-123](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L107-L123)

分支Git目录指针的读取边界。

<details>
<summary>查看原文（17行）</summary>

```text
async function currentBranch(root: string): Promise<string | undefined> {
  const marker = join(root, '.git')
  let gitDir = marker
  try {
    const markerStat = await stat(marker)
    if (markerStat.isFile()) {
      const pointer = (await readFile(marker, 'utf8')).trim()
      if (!pointer.startsWith('gitdir:')) return undefined
      const target = pointer.slice('gitdir:'.length).trim()
      gitDir = isAbsolute(target) ? target : resolve(dirname(marker), target)
    } else if (!markerStat.isDirectory()) return undefined
    const head = (await readFile(join(gitDir, 'HEAD'), 'utf8')).trim()
    const prefix = 'ref: refs/heads/'
    if (head.startsWith(prefix)) return head.slice(prefix.length)
    return /^[0-9a-f]{7,64}$/iu.test(head) ? head.slice(0, 7) : undefined
  } catch {
    return undefined
```

</details>

#### 缺口

- 未复现延迟切换、并发rename/换symlink、不同文件名与取消/丢响应，也未全核openPath/IPC。
  **影响**：不能把Workspace-confined检查扩成UI目标永不串、并发无覆盖或整个Host沙箱；初试宜只读和草稿路径，写操作先核。
  **进一步探讨**：复制两个含同名文件的workspace，延迟A回包后切B，核显示/草稿/变更目标；并发造目的文件和链接、模拟已写丢回包，验实际字节与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续、失败和退出各需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

桌面成品打包Electron/本地DSH；源码维护需Node ^22.19或>=24、pnpm及构建链。默认DSH_HOME在应用userData/harness，也可override，资料隔离不是OS权限沙箱。真正任务另需Provider/Key/模型计费与工作区权限，原始插件Host代码权限不由renderer禁Node代管；独立bundle还需匹配DSH公开slots/connection/workspace服务与正确预构建lib，本轮未核Release tgz/安装签名或版本兼容。

首次核成品/备份复制工作区/模型配置，持续有Electron/Runtime内存、模型tokens、文件遍历和版本适配/结果复核；两万文件cap非全量计算预算。失败区分server未ready、模型catalog有而请求失败、旧列表/未知写结果、插件编译/版本错；先查真实文件和当前请求状态，不以错误文字自动重复rename或模型工具。退出中restart的stopHarness先TERM、2秒后force并结束等待；Windows taskkill带/t，POSIX shell代码只kill child，不能借注释称所有子孙都已停止，上游清理未全审。macOS关完窗口不会自动quit，Runtime可能继续；真正before-quit发TERM也不等删除资料、回滚文件或停止全部外部效果。钱、工时与净节时未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:16-33](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/package.json#L16-L33)

源码工具链/版本与build。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
    "vendor/*",
    "packages/*/*",
    "native/landlock-run",
    "native/landlock-run/packages/*",
    "apps/*",
    "website"
  ],
  "scripts": {
    "build": "npm run build:lib && npm run build:web",
    "build:lib": "npm run build:lib:host && npm run build:lib:client",
    "build:lib:host": "tsc -b tsconfig.host.json && tsdown --env.DSH_BUILD_FACE host",
    "build:lib:client": "tsc -b tsconfig.client.json && tsdown --env.DSH_BUILD_FACE client",
    "build:web": "pnpm --filter @deepseek-ai/dsh-web-frontend run build",
    "clean": "tsx scripts/clean.ts",
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/main.ts:51-63](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L51-L63)

默认资料/打包入口。

<details>
<summary>查看原文（13行）</summary>

```text
function resolveDshHome(): string {
  return process.env.PILOT_HARNESS_DSH_HOME
    ?? join(app.getPath('userData'), 'harness')
}

function resolveDshEntry(): string {
  const override = process.env.PILOT_HARNESS_DSH_ENTRY
  if (override !== undefined && override !== '') return resolve(override)
  if (app.isPackaged) {
    return join(app.getAppPath(), 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js')
  }
  return resolve(app.getAppPath(), '../cli/lib/bin.js')
}
```

</details>

**依据 3 · 源码核查**：[packages/workspace/ui-worktree/package.json:44-59](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/package.json#L44-L59)

匹配公开服务/前端依赖。

<details>
<summary>查看原文（16行）</summary>

```text
    "@deepseek-ai/dsh-client-locale": "workspace:^",
    "@deepseek-ai/dsh-client-runtime": "workspace:^",
    "@deepseek-ai/dsh-client-ui-layout": "workspace:^",
    "@deepseek-ai/dsh-client-ui-conversation": "workspace:^",
    "@deepseek-ai/dsh-client-ui-workspace": "workspace:^",
    "@deepseek-ai/dsh-client-ui-primitives": "workspace:^",
    "@deepseek-ai/dsh-client-ui-slots": "workspace:^",
    "@deepseek-ai/dsh-host-webserver": "workspace:^",
    "@deepseek-ai/dsh-invariants": "workspace:^",
    "@deepseek-ai/dsh-workspace": "workspace:^",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "workspace:^",
    "@deepseek-ai/dsh-client-connection": "workspace:^",
    "@deepseek-ai/dsh-client-locale": "workspace:^",
```

</details>

**依据 4 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:89-104](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L89-L104)

计数上限非整体预算。

<details>
<summary>查看原文（16行）</summary>

```text
async function countFiles(root: string): Promise<{ count: number; truncated: boolean }> {
  let count = 0
  const pending = [root]
  while (pending.length > 0 && count < MAX_COUNTED_FILES) {
    const current = pending.pop()
    if (current === undefined) break
    const handle = await opendir(current)
    for await (const row of handle) {
      if (IGNORED_NAMES.has(row.name) || row.isSymbolicLink()) continue
      if (row.isDirectory()) pending.push(join(current, row.name))
      else if (row.isFile()) count += 1
      if (count >= MAX_COUNTED_FILES) break
    }
  }
  return { count, truncated: count >= MAX_COUNTED_FILES }
}
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src/main.ts:287-305](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L287-L305)

启动超时只是ready判定。

<details>
<summary>查看原文（19行）</summary>

```text
  return new Promise((resolveLaunch, rejectLaunch) => {
    let settled = false
    const stdout = new LineBuffer()
    const stderr = new LineBuffer()
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      rejectLaunch(new Error(`DeepSeek Harness did not become ready within ${STARTUP_TIMEOUT_MS / 1_000} seconds.`))
    }, STARTUP_TIMEOUT_MS)

    const acceptLine = (source: 'stdout' | 'stderr', line: string): void => {
      rememberLog(source, line)
      if (settled || generation !== launchGeneration) return
      const url = extractHarnessServerUrl(line)
      if (url === undefined) return
      settled = true
      clearTimeout(timer)
      resolveLaunch(url)
    }
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src/main.ts:221-252](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L221-L252)

停止等待/跨平台不同终止调用。

<details>
<summary>查看原文（32行）</summary>

```text
function stopHarness(): Promise<void> {
  const child = harnessProcess
  harnessProcess = null
  harnessUrl = null
  launchGeneration++
  if (child === null || child.exitCode !== null) return Promise.resolve()
  return new Promise((resolveStop) => {
    let settled = false
    const finish = (): void => {
      if (settled) return
      settled = true
      resolveStop()
    }
    child.once('exit', finish)
    terminateHarnessProcess(child, false)
    setTimeout(() => {
      if (child.exitCode === null) terminateHarnessProcess(child, true)
      finish()
    }, 2_000).unref()
  })
}

/** Stop the whole spawned Harness tree with platform-native semantics. */
function terminateHarnessProcess(child: ChildProcessWithoutNullStreams, force: boolean): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    const killer = spawn('taskkill', [
      '/pid', String(child.pid), '/t', ...(force ? ['/f'] : []),
    ], { windowsHide: true, stdio: 'ignore' })
    killer.unref()
    return
  }
  child.kill(force ? 'SIGKILL' : 'SIGTERM')
```

</details>

**依据 7 · 源码核查**：[apps/desktop/src/main.ts:455-464](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/apps/desktop/src/main.ts#L455-L464)

before-quit及Mac关窗不quit。

<details>
<summary>查看原文（10行）</summary>

```text
  app.on('before-quit', () => {
    quitting = true
    if (harnessProcess !== null && harnessProcess.exitCode === null) {
      terminateHarnessProcess(harnessProcess, false)
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
```

</details>

#### 缺口

- 未测发行物/多平台进程树、Key存储/完整权限、文件恢复或模型账单/总体性能。
  **影响**：不能承诺预览客户端免维护、restart回滚资料、关窗停算或使用必比编辑器/原生Web便宜。
  **进一步探讨**：独立userData与复制workspace按只读→无害变更逐步核，记录四阶段资源/人工/账单及真退出/子进程与文件残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用范围与未来方向如何超出已有文件侧栏？

**研究主题**：采用判断、新假设与验证

#### 完整回答

愿意固定发行版本并备份工作区的DSH用户可先试Pilot客户端的目录查看和草稿路径引用；已经用编辑器文件树的人不必为主题再迁移整套Fork。现有真实Loop、slot/RPC、根路径检查、wx创建、模型占位与空会话路由修复都存在，不能把这些重新列为未来新功能。

可证伪方向是跨workspace异步读/变更的目标与回执门槛：UI代次和workspaceId绑定回包，陈旧结果不进新视图；对rename增加明确前置状态/原子不覆盖及已写未回包的只读核对，避免把“刷新成功”当意图实现。当前源码观察提示需要验证，尚未运行证实所有复用/竞态可触发，也不预设需求强。最小比较原生文件管理器/编辑器、当前Files与门槛版，在两工作区同名文件、延迟旧请求、并发目标出现、未知写结果和含空白路径案例中看错对象展示/写入、字节丢失、重复操作、人工核对与维护总工时。若延迟案例实际因宿主销毁而不复现，应撤销该假说分支；若只是更多状态、不减错误或收益小于维护则停，保留独立小修而非加新框架。

#### 证据与依据

**依据 1 · 源码核查**：[packages/workspace/ui-worktree/src/client/WorktreePanel.tsx:34-79](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/WorktreePanel.tsx#L34-L79)

已有target/state但无回包代次门槛。

<details>
<summary>查看原文（46行）</summary>

```text
  const open = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot).open
  const currentSession = useSessions(state => state.current)
  const targetId = useWorkspaces((state): string | undefined => {
    const workspace = currentSession === undefined
      ? state.items.find(item => item.workspaceId === state.recentWorkspaceId)
      : state.items.find(item => item.sessionIds.includes(currentSession))
    return workspace?.workspaceId
  })
  const targetTitle = useWorkspaces(state => state.items.find(item => item.workspaceId === targetId)?.title)
  const targetPath = useWorkspaces(state => state.items.find(item => item.workspaceId === targetId)?.path)
  const [listings, setListings] = useState<ReadonlyMap<string, WorktreeListing>>(new Map())
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())
  const [loading, setLoading] = useState<ReadonlySet<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [create, setCreate] = useState<PendingCreate | null>(null)
  const [renaming, setRenaming] = useState<PendingRename | null>(null)
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const load = useCallback(async (relative: string) => {
    if (targetId === undefined) return
    setLoading(current => new Set(current).add(relative))
    setError(null)
    try {
      const listing = await loadWorktree({ workspaceId: targetId, relative })
      setListings(current => new Map(current).set(relative, listing))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setLoading((current) => {
        const next = new Set(current)
        next.delete(relative)
        return next
      })
    }
  }, [loadWorktree, targetId])

  useEffect(() => {
    setListings(new Map())
    setExpanded(new Set())
    setCreate(null)
    setRenaming(null)
    setMenuPath(null)
    setError(null)
    if (open && targetId !== undefined) void load('')
  }, [open, targetId, load])
```

</details>

**依据 2 · 源码核查**：[packages/workspace/ui-worktree/src/index.ts:188-233](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/index.ts#L188-L233)

已有路径/创建/rename检查，新增应明确区别。

<details>
<summary>查看原文（46行）</summary>

```text
async function mutateWorkspace(ctx: Context, action: WorktreeMutation): Promise<WorktreeMutationResult> {
  const workspace = ctx.workspaceRegistry.get(WorkspaceId(action.workspaceId))
  if (workspace === undefined) throw new PublicWorktreeError('workspace not found')
  const root = await realpath(workspace.path)
  const name = safeName(action.name)
  if (action.operation === 'rename') {
    const sourceRelative = safeRelative(action.path)
    if (sourceRelative === '') throw new PublicWorktreeError('workspace root cannot be renamed')
    const slash = sourceRelative.lastIndexOf('/')
    const parentRelative = slash < 0 ? '' : sourceRelative.slice(0, slash)
    const sourceName = slash < 0 ? sourceRelative : sourceRelative.slice(slash + 1)
    const parent = await confinedDirectory(root, parentRelative)
    const source = join(parent, sourceName)
    const sourceStat = await lstat(source)
    if (sourceStat.isSymbolicLink()) throw new PublicWorktreeError('symbolic links cannot be renamed')
    const destination = join(parent, name)
    if (source === destination) return { ok: true, path: sourceRelative }
    try {
      await lstat(destination)
      const [sourceCanonical, destinationCanonical] = await Promise.all([realpath(source), realpath(destination)])
      if (sourceCanonical !== destinationCanonical) throw new PublicWorktreeError('an item with that name already exists')
    } catch (error) {
      if (!isMissing(error)) throw error
    }
    try {
      await rename(source, destination)
    } catch (error) {
      if (isNameConflict(error)) throw new PublicWorktreeError('an item with that name already exists')
      throw error
    }
    return { ok: true, path: relative(root, destination).split(sep).join('/') }
  }

  const parent = await confinedDirectory(root, safeRelative(action.parent))
  const destination = join(parent, name)
  try {
    if (action.operation === 'create-directory') await mkdir(destination)
    else {
      const handle = await open(destination, 'wx')
      await handle.close()
    }
  } catch (error) {
    if (isNameConflict(error)) throw new PublicWorktreeError('an item with that name already exists')
    throw error
  }
  return { ok: true, path: relative(root, destination).split(sep).join('/') }
```

</details>

**依据 3 · 源码核查**：[packages/host/apiproxy/src/api-proxy.ts:2222-2257](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/host/apiproxy/src/api-proxy.ts#L2222-L2257)

现有空会话路由修复不是新建议。

<details>
<summary>查看原文（36行）</summary>

```text
        // A desktop profile can intentionally start with no configured route.
        // Once a provider advertises its first model, repair only a still-blank
        // session: a logged session must never be silently moved to a different
        // provider because its route is temporarily absent.
        const fallbackGroup = groups[0]
        const fallbackModel = fallbackGroup?.models[0]
        if (!routeServed(current.provider)
          && found.agent.session.requestHeader()?.config === undefined
          && fallbackGroup !== undefined
          && fallbackModel !== undefined) {
          try {
            const resolved = await ctx.llm.resolveCallConfig({
              provider: fallbackGroup.id,
              model: fallbackModel.id,
            })
            current = {
              provider: resolved.provider,
              model: resolved.model,
              ...resolved.reasoningEffort === undefined
                ? {}
                : { reasoningEffort: resolved.reasoningEffort },
            }
            selection.current = current
            try {
              await defaults.saveDefaultModelSelection?.(current)
            } catch (error: unknown) {
              ctx.logger.warn(
                `api-proxy: the first available model applies to this blank session but was not saved as the default: ${String(error)}`,
              )
            }
          } catch (error: unknown) {
            ctx.logger.warn(`api-proxy: failed to select the first available model: ${String(error)}`)
          }
        }
        const routable = routeServed(current.provider)
        return ok(request, { current: { ...current }, routable, groups, failures })
```

</details>

**依据 4 · 源码核查**：[packages/workspace/ui-worktree/src/client/draft.ts:1-10](https://github.com/op7418/pilot-harness/blob/d1fa9c15fc00c05ea6931aafd724554ca34d5a6d/packages/workspace/ui-worktree/src/client/draft.ts#L1-L10)

草稿相对路径而非隐式上下文。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Append one workspace-relative file reference to the current composer draft.
 * @param draft - existing unsent composer text.
 * @param path - Workspace-relative file or directory path.
 * @returns the draft with a spaced `@path` token and trailing space.
 */
export function appendWorktreePath(draft: string, path: string): string {
  const separator = draft === '' || /\s$/.test(draft) ? '' : ' '
  return `${draft}${separator}@${path} `
}
```

</details>

#### 缺口

- 没有门槛版/真实用户误操作频率及竞态复现/对照。
  **影响**：不能把静态风险提升为已发生漏洞或已验证生产插件需求，也不能给未来方案计当前贡献。
  **进一步探讨**：先在复制目录确定反例真值和UI宿主复用，再盲核错误/字节/恢复与总工时，未复现撤分支、无收益停止扩大。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
