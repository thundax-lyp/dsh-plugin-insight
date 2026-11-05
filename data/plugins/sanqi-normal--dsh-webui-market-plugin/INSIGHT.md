# DSH WebUI Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f0cfc50](https://github.com/Sanqi-normal/dsh-webui-market-plugin/tree/f0cfc501a9e66b3c77da37e346d311d092cb1e41)

<!-- BEGIN META -->
[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sanqi-normal/dsh-webui-market-plugin) [![npm 30d 1,137](https://img.shields.io/static/v1?label=npm+30d&message=1%2C137&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sanqi-normal/dsh-webui-market-plugin) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@sanqi-normal/dsh-webui-market-plugin)
<!-- END META -->

> **功能**：在 Web 内浏览插件并向 profile 安装或卸载

> **亮点**：[Q01](#research-q01) 将发现、进度及 profile 操作合并。

> **主要限制**：[Q03](#research-q03) 试装执行代码且可能修改包管理规则。

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
  - [Q01 · 贡献如何验收？](#detail-section-11)
  - [Q02 · 安装如何调度？](#detail-section-12)
  - [Q03 · 权限和副作用到哪里？](#detail-section-13)
  - [Q04 · 采用与退出？](#detail-section-14)
  - [Q05 · 什么否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望从界面发现并安装插件。

复制目录里的 CLI 命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 复制目录里的 CLI 命令。 | 可直接比较 | 保留人工步骤 |
| DSH WebUI Market | 将发现、进度及 profile 操作合并。 | 试装执行代码且可能修改包管理规则。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 目录 UI 调后台操作，Web 先试启动再执行 CLI。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户希望从界面发现并安装插件。 | 保留原流程 |
| 试验 | 目录 UI 调后台操作，Web 先试启动再执行 CLI。 | 观察固定版本 |
| 复核 | 临时 profile 检查试装、真实写与恢复。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少从目录到安装的命令切换 | 可减少命令切换并暴露部分安装故障。 | 临时 profile 检查试装、真实写与恢复。 |

> **思考**：[Q03](#research-q03) 试装执行代码且可能修改包管理规则。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将发现、进度及 profile 操作合并。

FIFO 操作和前置快照。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 试装执行代码且可能修改包管理规则。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 临时 profile 检查试装、真实写与恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少从目录到安装的命令切换。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少从目录到安装的命令切换。未执行目标代码或实际宿主验证。
- 下一步：保留文件差异与操作 ID。

**分析版本**

- **仓库**：[Sanqi-normal/dsh-webui-market-plugin](https://github.com/Sanqi-normal/dsh-webui-market-plugin)
- **版本号**：0.5.5（[固定提交 f0cfc50](https://github.com/Sanqi-normal/dsh-webui-market-plugin/tree/f0cfc501a9e66b3c77da37e346d311d092cb1e41)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少命令切换并暴露部分安装故障。

保留文件差异与操作 ID。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 68 | 48 | 11 | — |
| .js | source | 2 | 3274 | 2526 | 614 | — |
| .md | source | 2 | 174 | — | — | 5338 |
| .mjs | test | 2 | 1267 | 1061 | 190 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Sanqi-normal/dsh-webui-market-plugin/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少从目录到安装的命令切换

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 贡献如何验收？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可在设置内浏览目录并确认安装。基线是目录复制 CLI，验收要对账目标 profile 的依赖、bundle 和 UI 操作状态，不能只看安装提示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-7](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/README.md#L5-L7)

作者说明内部市场

```text
在 dsh web GUI 内部的社区插件市场：浏览 [awesome-dsh-plugin.com](https://awesome-dsh-plugin.com/) 的插件目录，直接在 **设置 → 插件 → 插件市场** 里安装 / 卸载插件到 profile。界面风格与 harness 前端一致（跟随系统深浅色主题），支持中英文（按系统语言自动切换）。

推荐 awesome-dsh-plugin.com 网站的实现 [dsh-market](https://github.com/dsh-market/dsh-market)。
```

**依据 2 · 源码核查**：[lib/host.js:620-625](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L620-L625)

真实写前保存快照

```text
      // Every profile install gets a pre-write manifest snapshot (manual
      // rollback anchor), skipCheck included: a failed add must never leave
      // the profile without a restore point.
      const snap = snapshotProfile(op.profile)
      appendOutput(op, snap ? '已备份安装前状态：' + snap + '\n' : '')
      op.beforeDeps = readProfileDeps(op.profile)
```

#### 缺口

- 实际可安装范围待测。
  **影响**：降低操作入口切换。
  **进一步探讨**：在临时 profile 安装无副作用包。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装如何调度？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

后台操作返回 ID 后轮询，FIFO 限制同时执行。Web 安装先试装临时 profile 并验证启动，然后调用 CLI 真实安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:6-18](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L6-L18)

试启动流程

<details>
<summary>查看原文（13行）</summary>

```text
// Install/uninstall run as background operations: the route returns an op id
// immediately, the browser polls it, and a hard timeout kills the child so a
// dead network cannot hang the request forever.
//
// Before installing into the web profile, a "trial boot" probe verifies the
// candidate actually boots: the same dsh CLI installs it into a throwaway
// DSH_HOME profile, boots that profile on a free OS-assigned port (--port 0),
// and waits for the `dsh web:` readiness line — which the web-app glue prints
// only after its Loader tree settles successfully. A bundle that duplicates a
// built-in service (api-gateway, webserver, ...) or otherwise breaks boot
// never reaches that line, so the probe refuses it with the real boot error,
// and the real profile has never been touched. Static manifest heuristics are
// gone: only the boot verdict decides installability.
```

</details>

**依据 2 · 源码核查**：[lib/host.js:74-80](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L74-L80)

串行状态

```text
// Ops run strictly FIFO: one live child (or trial-boot check) at a time keeps
// the CLI's pnpm serial; the rest wait in `ops` with status `pending`.
// `runningOp` is the op whose check/child is live right now.
let ops = []
let runningOp = null
let pumping = false
let opCounter = 0
```

**依据 3 · 源码核查**：[lib/host.js:596-625](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L596-L625)

Web 探测与真实写前快照

<details>
<summary>查看原文（30行）</summary>

```text
      // The trial boot proves the WEB profile composition still boots. Other
      // profiles (desktop shells) define their own composition that the market
      // cannot faithfully reproduce in a throwaway home, so non-web installs
      // are gated by whitelist + pre-install snapshot instead — still fully
      // non-destructive, just without the boot verdict.
      if (op.profile === 'web') {
        const cls = await classifyPlugin(op.target)
        if (op.status !== 'checking') return
        if (!cls.webClient) {
          const verdict = await runProbe(op.bin, op.target, op.checkAbort.signal)
          if (op.status !== 'checking') return
          if (!verdict.ok) {
            const stage = verdict.stage === 'install'
              ? '候选插件安装进试装环境失败'
              : '试装启动验证失败：该插件装进 web profile 无法正常启动'
            appendOutput(op, stage + '（真实 profile 未受影响，试装目录已清理）：\n\n' + String(verdict.output || '').slice(-8000)
              + '\n\n如需强制安装（风险自负），请勾选"跳过试装验证"。\n')
            settleOp(op, 'refused')
            return
          }
        }
      }
    }
    if (op.kind === 'install') {
      // Every profile install gets a pre-write manifest snapshot (manual
      // rollback anchor), skipCheck included: a failed add must never leave
      // the profile without a restore point.
      const snap = snapshotProfile(op.profile)
      appendOutput(op, snap ? '已备份安装前状态：' + snap + '\n' : '')
      op.beforeDeps = readProfileDeps(op.profile)
```

</details>

#### 缺口

- 其他 profile 不具备同等试启动。
  **影响**：能发现部分组合启动故障。
  **进一步探讨**：构造冲突 bundle。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限和副作用到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

同源检查比较 Origin 和 Host，但不等同用户授权。真实安装还可能根据输出自动调整构建许可和发行等待例外。试装也会执行候选包安装和启动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:220-227](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L220-L227)

同源请求检查

```text
/** Same-origin check: the browser's Origin host must equal the request Host. */
function sameOrigin(req) {
  const origin = req.headers && req.headers.origin
  const host = req.headers && req.headers.host
  if (origin === undefined || host === undefined) return false
  try {
    return new URL(origin).host === host
  } catch {
```

**依据 2 · 源码核查**：[lib/host.js:674-692](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L674-L692)

自动修改包管理规则后重试

<details>
<summary>查看原文（19行）</summary>

```text
        // op. Heal the profile's exclude list and retry the same command
        // exactly once (op.retried blocks any further loop).
        const healed = healReleaseAgeExclude(op.profile, op.output)
        if (healed.length > 0) {
          op.retried = true
          appendOutput(op, '\n[auto] 检测到 pnpm 供应链策略拦截（minimumReleaseAge），已将 '
            + healed.join(', ') + ' 加入 profile 的 minimumReleaseAgeExclude 并自动重试…\n')
          clearTimeout(op.timer)
          spawnOpChild(op)
          return
        }
        // pnpm >=11 fails unapproved build scripts (ERR_PNPM_IGNORED_BUILDS)
        // by default. Approve the flagged packages in the profile's allowBuilds
        // map (the same file pnpm's approve-builds edits) and retry once.
        const approved = healAllowBuilds(op.profile, op.output)
        if (approved.length > 0) {
          op.retried = true
          appendOutput(op, '\n[auto] 检测到 pnpm 构建脚本拦截（ERR_PNPM_IGNORED_BUILDS），已将 '
            + approved.join(', ') + ' 加入 profile 的 allowBuilds 并自动重试…\n')
```

</details>

#### 缺口

- 安装前需要核对这些变化。
  **影响**：启动成功不能证明第三方包安全。
  **进一步探讨**：比较试装前后配置与子进程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按 npm 或源码安装后重启。先备份 profile，核对 CLI 定位、网络及超时配置。退出移除市场并检查残余后台操作及 profile 快照，成本含试装下载和失败恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-27](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/README.md#L13-L27)

作者提供渠道和重启要求

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

方式一：从 **npm registry** 安装（推荐，无 git 克隆 / prepare 脚本步骤）：

```sh
dsh plugin --profile web add @sanqi-normal/dsh-webui-market-plugin
```

方式二：从 GitHub 源码安装：

```sh
dsh plugin --profile web add github:Sanqi-normal/dsh-webui-market-plugin
```

安装后**重启 web 服务**生效：
````

</details>

**依据 2 · 源码核查**：[lib/host.js:30-57](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L30-L57)

超时及网络参数

<details>
<summary>查看原文（28行）</summary>

```text
/** Hard per-op timeout. Users with slow/CN networks may raise it via env:
 * DSH_MARKET_OP_TIMEOUT_MS=300000. */
const DEFAULT_TIMEOUT = Number(process.env.DSH_MARKET_OP_TIMEOUT_MS) > 0 ? Number(process.env.DSH_MARKET_OP_TIMEOUT_MS) : 120000

/** Shell-mediated spawns (bare `dsh` on Windows via cmd /c) must never pass
 * unvalidated argv through the shell: metacharacters would inject. Fail closed.
 * Mirrors dsh-market's TARGET_RE (#16). */
const TARGET_RE = /^[A-Za-z0-9@:./_#+-]+$/

/** Shown when no dsh entry could be resolved at all (not even on PATH). */
const CLI_NOT_FOUND_HINT = 'dsh CLI 未定位：请在面板填写 dsh 仓库根目录下的 apps/cli/lib/bin.js（源码启动为 apps/cli/src/bin.ts），或设置 DSH_BIN 指向该文件后重启 web'

/**
 * pnpm network controls for every spawned dsh/pnpm child. The default pnpm
 * fetch timeout/retry behavior can hang for a long time on dead or unstable
 * connections ("GET ... error" + endless Retrying). We keep the retries low and
 * the per-attempt timeout bounded so a dead network fails fast inside the op's
 * hard timeout instead of burning it on pnpm's internal retry loop.
 * Users can still override each knob through DSH_MARKET_* environment vars.
 */
function pnpmNetworkEnv() {
  return {
    CI: 'true',
    npm_config_fetch_timeout: process.env.DSH_MARKET_FETCH_TIMEOUT_MS || '30000',
    npm_config_fetch_retries: process.env.DSH_MARKET_FETCH_RETRIES || '1',
    npm_config_fetch_retry_mintimeout: process.env.DSH_MARKET_FETCH_RETRY_MINTIMEOUT_MS || '1000',
    npm_config_fetch_retry_maxtimeout: process.env.DSH_MARKET_FETCH_RETRY_MAXTIMEOUT_MS || '10000',
  }
```

</details>

#### 缺口

- 子进程停止与配置恢复未验。
  **影响**：回退需实际文件差异。
  **进一步探讨**：断网后核对快照和锁文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么否定采用？

**研究主题**：新假设与验证

#### 完整回答

比较手工 CLI 和市场，注入试装失败、真实安装失败、重试和取消。若写错 profile、未说明调整许可、或失败后不可恢复，则当前安装流程不满足目标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:596-625](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L596-L625)

试装和快照可设对照

<details>
<summary>查看原文（30行）</summary>

```text
      // The trial boot proves the WEB profile composition still boots. Other
      // profiles (desktop shells) define their own composition that the market
      // cannot faithfully reproduce in a throwaway home, so non-web installs
      // are gated by whitelist + pre-install snapshot instead — still fully
      // non-destructive, just without the boot verdict.
      if (op.profile === 'web') {
        const cls = await classifyPlugin(op.target)
        if (op.status !== 'checking') return
        if (!cls.webClient) {
          const verdict = await runProbe(op.bin, op.target, op.checkAbort.signal)
          if (op.status !== 'checking') return
          if (!verdict.ok) {
            const stage = verdict.stage === 'install'
              ? '候选插件安装进试装环境失败'
              : '试装启动验证失败：该插件装进 web profile 无法正常启动'
            appendOutput(op, stage + '（真实 profile 未受影响，试装目录已清理）：\n\n' + String(verdict.output || '').slice(-8000)
              + '\n\n如需强制安装（风险自负），请勾选"跳过试装验证"。\n')
            settleOp(op, 'refused')
            return
          }
        }
      }
    }
    if (op.kind === 'install') {
      // Every profile install gets a pre-write manifest snapshot (manual
      // rollback anchor), skipCheck included: a failed add must never leave
      // the profile without a restore point.
      const snap = snapshotProfile(op.profile)
      appendOutput(op, snap ? '已备份安装前状态：' + snap + '\n' : '')
      op.beforeDeps = readProfileDeps(op.profile)
```

</details>

**依据 2 · 源码核查**：[lib/host.js:650-692](https://github.com/Sanqi-normal/dsh-webui-market-plugin/blob/f0cfc501a9e66b3c77da37e346d311d092cb1e41/lib/host.js#L650-L692)

真实进程和自动修复

<details>
<summary>查看原文（43行）</summary>

```text
  const child = spawn(op.inv.file, [...op.inv.args, 'plugin', '--profile', op.profile, op.kind === 'uninstall' ? 'remove' : 'add', op.target], {
    cwd: op.inv.cwd ?? profileDir(op.profile),
    // CI=true: pnpm v10 blocks forever on a silent interactive prompt without
    // a TTY (observed on re-add over a pinned git spec); CI forces fail-fast.
    // pnpmNetworkEnv() bounds fetch timeouts/retries so a dead network fails
    // fast instead of retrying until the 120s (or user-configured) op timeout.
    env: { ...process.env, ...pnpmNetworkEnv() },
    shell: op.inv.shell === true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  op.child = child
  child.stdout.on('data', (d) => { appendOutput(op, d.toString()) })
  child.stderr.on('data', (d) => { appendOutput(op, d.toString()) })
  child.on('error', (err) => {
    if (op.status !== 'running') return
    appendOutput(op, '\n[error] ' + String((err && err.message) || err))
    settleOp(op, 'failed')
  })
  child.on('close', async (code) => {
    if (op.status === 'running') {
      const ok = code === 0
      if (!ok && !op.retried) {
        // pnpm >=11 enforces a 24h minimumReleaseAge supply-chain policy by
        // default; a freshly published package in the lockfile fails every
        // op. Heal the profile's exclude list and retry the same command
        // exactly once (op.retried blocks any further loop).
        const healed = healReleaseAgeExclude(op.profile, op.output)
        if (healed.length > 0) {
          op.retried = true
          appendOutput(op, '\n[auto] 检测到 pnpm 供应链策略拦截（minimumReleaseAge），已将 '
            + healed.join(', ') + ' 加入 profile 的 minimumReleaseAgeExclude 并自动重试…\n')
          clearTimeout(op.timer)
          spawnOpChild(op)
          return
        }
        // pnpm >=11 fails unapproved build scripts (ERR_PNPM_IGNORED_BUILDS)
        // by default. Approve the flagged packages in the profile's allowBuilds
        // map (the same file pnpm's approve-builds edits) and retry once.
        const approved = healAllowBuilds(op.profile, op.output)
        if (approved.length > 0) {
          op.retried = true
          appendOutput(op, '\n[auto] 检测到 pnpm 构建脚本拦截（ERR_PNPM_IGNORED_BUILDS），已将 '
            + approved.join(', ') + ' 加入 profile 的 allowBuilds 并自动重试…\n')
```

</details>

#### 缺口

- 暂无运行测试。
  **影响**：验收应覆盖部分失败。
  **进一步探讨**：保留文件差异与操作 ID。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
