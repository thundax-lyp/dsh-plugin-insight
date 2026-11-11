# dsh-plugin-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c95036f](https://github.com/lxzy-7/dsh-plugin-guard/tree/c95036f33a2a10bb4c12d04a7f470747effe6532)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lxzy-7/dsh-plugin-guard) [![npm 30d 706](https://img.shields.io/static/v1?label=npm+30d&message=706&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guard) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guard)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供插件操作前快照、启动回滚和事故报告。

> **亮点**：[Q01](#research-q01) 把配置备份接在常见插件工具之前，并提供可定位的事故与回滚入口。

> **主要限制**：[Q02](#research-q02) good 标签没有验证历史启动，[Q03](#research-q03) 配置恢复和依赖安装可出现不同结果。

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
  - [Q01 · 自动快照覆盖哪些操作与文件？](#detail-section-11)
  - [Q02 · 启动脚本如何选恢复点和判断健康？](#detail-section-12)
  - [Q03 · 回滚和事故报告引入什么依赖与恢复成本？](#detail-section-13)
  - [Q04 · 应如何采用并验证经过验收的快照标签？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常更换 DSH 插件的维护者可以研究配置备份和启动故障恢复。

手工备份 profile 与锁文件并用已知版本恢复；插件增加自动触发和事故记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配置快照 | 留存 profile 的五个文件 | 自动 hook 失败不阻断原动作 |
| 启动恢复 | 探测后回滚及重试 | 两套脚本健康标准不同 |
| 事故报告 | 定位启动失败 | 原始日志需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 与实际工具 hook | 自动快照需要 | 捕获部分插件动作 | 手工备份 |
| 对应系统脚本与 pnpm | 自动启动和恢复需要 | 检查、回滚、重装 | 保留手工恢复 |
| 验收过的备份 | 实际恢复条件 | 确认原配置可用 | 只在隔离 profile 观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 备份 | 维护者保存已知可用 profile | 清单能回读 |
| 演练 | 隔离启动故障和恢复 | 依赖、页面、会话均查 |
| 退出 | 状态不明时停止重试 | 使用独立备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖与备份未知 | 核对脚本和触发 | 平台差异 |
| 持续 | 存储和下载未知 | 核对快照与日志 | 节时未测 |
| 失败恢复 | 重装及重启未知 | 确认依赖、页面和会话 | 配置恢复不保证应用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 快照 | 指定工具与配置文件 | 所有安装动作覆盖 |
| 守护启动 | HTTP、部分渲染信号 | 真实工作恢复 |
| 事故 | 日志和版本线索 | 故障正确归因 |

> **思考**：[Q02](#research-q02) good 标签没有验证历史启动，[Q03](#research-q03) 配置恢复和依赖安装可出现不同结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把配置备份接在常见插件工具之前，并提供可定位的事故与回滚入口。

状态、快照、依赖与运行需分别读回；POSIX 和 PowerShell 的健康语义有明显差异。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) good 标签没有验证历史启动，[Q03](#research-q03) 配置恢复和依赖安装可出现不同结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先保留观察结论，用隔离 profile 和已经验收的备份做恢复对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖三种 hook、配置恢复和两套健康脚本。未运行安装、回滚或真实宿主。

- 已检查：作者 README、包清单、源码路径 src/index.js、src/layout.js、src/engine.js、scripts/boot-guard.sh、scripts/boot-guard.ps1、src/incident.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查代表性 hook、两种守护脚本、恢复引擎和事故材料；未测试宿主、构建、日志脱敏或 HTTP 外层授权。
- 下一步：隔离环境比较工具触发、HTTP 黑屏、依赖安装失败及宿主版本漂移。

**分析版本**

- **仓库**：[lxzy-7/dsh-plugin-guard](https://github.com/lxzy-7/dsh-plugin-guard)
- **版本号**：0.3.2（[固定提交 c95036f](https://github.com/lxzy-7/dsh-plugin-guard/tree/c95036f33a2a10bb4c12d04a7f470747effe6532)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将真实启动、渲染与会话验收绑定到快照，可能减少错误回滚点。

隔离环境比较工具触发、HTTP 黑屏、依赖安装失败及宿主版本漂移。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1962 | 1610 | 248 | — |
| .md | source | 1 | 319 | — | — | 3504 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/lxzy-7/dsh-plugin-guard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护 DSH 插件配置的人能否用 Guard 恢复启动，并辨认快照、健康检查和事故材料的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动快照覆盖哪些操作与文件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常试装 DSH 插件的维护者需要在新增依赖破坏启动时找回可用配置。手工备份 profile 与锁文件也能做到；插件把备份接在宿主工具和设置界面附近，减少遗漏。固定 hook 只在 tools.guard 收到 plugin_install、plugin_uninstall 或 plugin_toggle 时调用 snapshotAll，异常吞掉，操作仍继续。被捕获的是 package.json、pnpm 锁及工作区配置、Cordis 配置和补丁这五个路径。README 说任何安装方式和每次操作都可逆，所查 hook 不覆盖绕过这些工具的直接编辑或独立 CLI 调用，也不会证明保存成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-38](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/README.md#L13-L38)

作者描述自动链及可逆性主张。

<details>
<summary>查看原文（26行）</summary>

````text
A bad plugin install can leave the app unable to boot, and fixing it by hand usually means digging through config files. This plugin automates the whole chain:

```
Install a plugin (any method)
   │  tools.guard hook: automatic snapshot BEFORE the install (in-process)
   ▼
Guarded boot (boot-guard script)
   │  snapshot before boot → start dsh web → health check
   ├─ healthy ─────────────────────────────► passes through untouched
   └─ unhealthy ─► auto-rollback to last good snapshot → retry once
                   → write an incident report + set a pending marker
                   → the next session's prompt tells the agent to analyze it
                   → after fixing, call `incident_resolved` to clear the marker
```

### How it detects problems (important to understand)

The guard does **not** statically inspect plugin code, and it does **not** try to "test" a plugin in isolation. Detection works at three levels:

1. **Snapshots are pure file copies.** Taking a snapshot just copies 5 config files (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `cordis.yml`, `cordis.patch.yml`). No plugin is run, no behavior is evaluated.

2. **Boot-level detection does run the harness — with your plugin loaded.** The `boot-guard` script starts the whole `dsh web` process (which loads every installed plugin, including the one you just added) and then health-checks HTTP `/` within a timeout. If a plugin breaks boot — load error, startup crash, unresponsive server — the check fails, and the guard automatically kills the tree, rolls back to the last good snapshot, and retries once. So **yes**: to catch a boot-breaking plugin, the harness (and therefore that plugin) has to actually start. That is the one moment where "running the plugin" is part of detection. Since v0.3.1 the check also confirms the **web client actually rendered** (a plugin crash that black-screens the page with an error leaves HTTP 200 up — the guard's client reports render crashes, and the boot-guard rolls back instead of calling a black screen "healthy"); incident reports additionally record the **dsh version per snapshot** and flag when a boot failure follows a harness update that a profile rollback cannot undo. **Since v0.3.2, when rollback and the retry both fail** (a DSH update made a plugin incompatible), the boot-guard diagnoses the offending plugin from the boot logs, **quarantines it** (appends `disabled: true` to `cordis.patch.yml`), boots without it, and clearly reports which plugin was pulled out and how to restore it (`dsh-guard quarantine --undo <id>`).

3. **Runtime-only problems are not detected at install time.** If a plugin installs and boots fine but only misbehaves later (crashes under a specific operation, corrupts state, etc.), no generic guard can predict that without running your real workload. When such an incident happens, `dsh_rollback action=incident` builds a problem-localization report (last boot logs, server stderr, and a diff of the profile config against the last good snapshot) and sets a pending marker so the next session automatically focuses on diagnosing it. And because a snapshot is always taken before any mutation, you can always roll back manually afterwards.

In short: the guard never *judges* whether a plugin is "good". It guarantees that (a) every mutation is reversible, (b) boot failures roll back automatically, and (c) incidents get analyzed instead of silently breaking your setup.
````

</details>

**依据 2 · 源码核查**：[src/index.js:20-22](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/index.js#L20-L22)

只有三个工具名进入集合。

```text
export const name = 'guard'

const GUARDED_TOOLS = new Set(['plugin_install', 'plugin_uninstall', 'plugin_toggle'])
```

**依据 3 · 源码核查**：[src/index.js:155-169](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/index.js#L155-L169)

hook 在目标工具前尝试备份，失败继续。

<details>
<summary>查看原文（15行）</summary>

```text
  // 2. Pre-tool guard + guard tools. Auto-snapshot before mutating install
  // tools. Side-effect only: a guard never denies; snapshot errors are
  // swallowed so the install itself is never blocked by the safety net.
  const tools = ctx.get('tools')
  if (tools !== undefined) {
    tools.guard((execution) => {
      if (GUARDED_TOOLS.has(execution.name)) {
        try {
          snapshotAll('auto-before-install', `pre-tool guard for ${execution.name}`)
        } catch {
          // never block the install because the guard failed
        }
      }
      return undefined
    })
```

</details>

**依据 4 · 源码核查**：[src/layout.js:47-57](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/layout.js#L47-L57)

五项快照范围。

<details>
<summary>查看原文（11行）</summary>

```text
/** Files captured by every snapshot (the complete install-state metadata).
 * cordis.yml is the profile composition root — MCP servers are added there as
 * dsh-mcp-client instances, so it must be snapshotted/restored too or a bad
 * MCP config would survive rollback and keep breaking boot. */
export const SNAPSHOT_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'cordis.yml',
  'cordis.patch.yml',
]
```

</details>

#### 缺口

- 未枚举宿主各安装入口是否转发到三种工具。
  **影响**：不能把 hook 扩大为所有变更。
  **进一步探讨**：在隔离 profile 比对工具操作、外部 CLI 和直接编辑前后的快照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动脚本如何选恢复点和判断健康？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

恢复选择中的 good 只是找最新且未标 pre-boot 或 pre-rollback 的快照，找不到时用最新目录，未核对该快照曾完成宿主验收。POSIX 脚本仅检查 HTTP 根地址，失败时停止服务、回滚并重启一次，HTTP 已起但浏览器黑屏可能仍被判健康。PowerShell 脚本另查渲染端点，404、非信号 JSON 等情况回到 HTTP 条件；回滚重试失败时可诊断并停用疑似插件。两条路径的验收条件不同，自动恢复只有在真实输入、会话与插件组合确认后才可称可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.js:449-467](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/engine.js#L449-L467)

good 选择基于标签和目录顺序。

<details>
<summary>查看原文（19行）</summary>

```text
export function resolveSnapshotDir(profile, { id = '', good = false } = {}) {
  const root = rollbacksRoot(profile)
  if (!existsSync(root)) return null
  const dirs = readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort((a, b) => b.name.localeCompare(a.name))
  if (dirs.length === 0) return null
  if (id) {
    const hit = dirs.find((e) => e.name === id || e.name.startsWith(id))
    return hit ? join(root, hit.name) : null
  }
  if (good) {
    for (const e of dirs) {
      const manifest = readManifest(join(root, e.name))
      const tag = manifest?.tag ?? ''
      if (tag !== 'pre-boot' && tag !== 'pre-rollback') return join(root, e.name)
    }
  }
  return join(root, dirs[0].name)
```

</details>

**依据 2 · 源码核查**：[scripts/boot-guard.sh:35-44](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/scripts/boot-guard.sh#L35-L44)

POSIX 只做 HTTP 检查。

<details>
<summary>查看原文（10行）</summary>

```text
healthy() { curl -fsS --max-time 3 "http://127.0.0.1:$PORT/" >/dev/null 2>&1; }
guard() { node "$CLI" "$@" 2>&1 | while IFS= read -r line; do [ -n "$line" ] && log "  [guard] $line"; done; }

wait_healthy() {
  local deadline=$((SECONDS + $1))
  while [ $SECONDS -lt $deadline ]; do
    healthy && return 0
    sleep 0.5
  done
  return 1
```

</details>

**依据 3 · 源码核查**：[scripts/boot-guard.sh:82-103](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/scripts/boot-guard.sh#L82-L103)

回滚、再启动与终态。

<details>
<summary>查看原文（22行）</summary>

```text
log "server unhealthy after ${FIRST_WAIT_SEC}s; stopping and rolling back"
stop_server "$PID"

guard rollback --good

PID2=$(start_server)
log "restarted server (pgid $PID2)"
if wait_healthy "$RETRY_WAIT_SEC"; then
  set_status OK rolled-back-retry
else
  stop_server "$PID2"
  set_status FAILED boot-failed
fi

guard incident --kind boot-failure

if healthy; then
  wait
  log "server exited; boot guard done"
  exit 0
fi
exit 1
```

</details>

**依据 4 · 源码核查**：[scripts/boot-guard.ps1:131-153](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/scripts/boot-guard.ps1#L131-L153)

渲染信号与旧端点回退。

<details>
<summary>查看原文（23行）</summary>

```text
    $deadline = (Get-Date).AddSeconds($seconds)
    while ((Get-Date) -lt $deadline) {
        $resp = $null
        try {
            $resp = Invoke-WebRequest -Uri ("http://127.0.0.1:" + $Port + "/guard/api/render-error") -TimeoutSec 2 -UseBasicParsing
        } catch {
            $status = $_.Exception.Response.StatusCode
            if ($status -eq [System.Net.HttpStatusCode]::NotFound) { return "ok" }
            # other failures (busy/recovering): keep polling
        }
        if ($resp) {
            $parsed = $null
            try { $parsed = $resp.Content | ConvertFrom-Json } catch { $parsed = $null }
            $hasSignal = ($null -ne $parsed) -and (
                ($parsed.PSObject.Properties.Name -contains 'renderError') -or
                ($parsed.PSObject.Properties.Name -contains 'booted'))
            if (-not $hasSignal) { return "ok" }  # not the guard endpoint (HTML fallback / old guard)
            if ($parsed.renderError) { return "rendercrash" }
            if ($parsed.booted) { return "ok" }
        }
        Start-Sleep -Milliseconds 500
    }
    return "unconfirmed"
```

</details>

**依据 5 · 源码核查**：[scripts/boot-guard.ps1:202-230](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/scripts/boot-guard.ps1#L202-L230)

回滚失败后诊断隔离分支。

<details>
<summary>查看原文（29行）</summary>

```text
$null = Invoke-Guard @("rollback", "--good")

$proc2 = Start-Server $serverOut $serverErr
Log "restarted server (pid $($proc2.Id))"
$retry = Wait-Healthy $RetryWaitSec $proc2
if ($retry -eq "ok") {
    $retryRender = Confirm-RenderReady
    if ($retryRender -ne "ok") { $retry = "rendercrash" }
}
if ($retry -eq "ok") {
    Set-Status "OK" "rolled-back-retry"
} else {
    Stop-ServerTree $proc2
    Set-Status "FAILED" ("boot-failed (" + $retry + ")")
    Log "rollback did not fix the boot; diagnosing the offending plugin for quarantine"
    $diag = Invoke-Guard @("quarantine", "--diagnose")
    $culprit = ""
    foreach ($line in ($diag -split "`r?`n")) {
        if ($line -match '^CULPRIT=(\S+)$') { $culprit = $Matches[1] }
    }
    if ($culprit -ne "" -and $culprit -ne "NONE") {
        Log "culprit plugin identified: $culprit - disabling it and booting without it"
        $null = Invoke-Guard @("quarantine", "--plugin", $culprit)
        $proc3 = Start-Server $serverOut $serverErr
        Log "restarted server without $culprit (pid $($proc3.Id))"
        $qBoot = Wait-Healthy $RetryWaitSec $proc3
        if ($qBoot -eq "ok") {
            $qRender = Confirm-RenderReady
            if ($qRender -ne "ok") { $qBoot = "rendercrash" }
```

</details>

#### 缺口

- 未复现黑屏、错误归因或缓慢加载。
  **影响**：不能证明健康判据可识别所有坏配置。
  **进一步探讨**：分别制造 HTTP 不通、HTTP 200 黑屏、无 guard 端点和单包冲突，核对两种启动脚本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回滚和事故报告引入什么依赖与恢复成本？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

恢复先备份当前 profile，再顺次复制五类文件或清除快照中缺失项；可执行 pnpm install --frozen-lockfile 并清理遗留链接。配置复制、依赖和宿主可运行是分开的阶段。设置路由即使安装失败也可能返回 ok 和 restored，同时带警告；应看 pnpm 和真实启动，而非只看表层返回。事故报告保存启动与 stderr 尾部，插件可把事故提醒加入提示，报告中的原始日志应先核对是否适合给模型。部署需要对应的启动脚本、包管理器和可用依赖。用户投入还包括保存可用状态、核对副作用及恢复耗时，目前没有实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.js:474-493](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/engine.js#L474-L493)

多文件写入、可选依赖安装与清理顺序。

<details>
<summary>查看原文（20行）</summary>

```text
export function restoreSnapshot(profile, snapshotDir, { skipInstall = false } = {}) {
  snapshotProfile(profile, { tag: 'pre-rollback', reason: `rollback to ${snapshotDir}` })
  const dir = profileDir(profile)
  for (const f of SNAPSHOT_FILES) {
    const src = join(snapshotDir, f)
    const dst = join(dir, f)
    if (existsSync(src)) copyFileSync(src, dst)
    else if (existsSync(dst)) rmSync(dst, { force: true })
  }
  let pnpm = null
  if (!skipInstall) {
    const manifest = readManifest(snapshotDir)
    const command = manifest?.pnpm && existsSync(manifest.pnpm) ? manifest.pnpm : null
    pnpm = runPnpm(['install', '--frozen-lockfile'], dir, command)
  }
  // pnpm install --frozen-lockfile / pnpm prune both report "Already up to
  // date" and never remove a stale link: bundle entry whose target lives
  // outside node_modules, so clean those symlinks directly.
  const removedLinks = cleanupStaleBundleLinks(profile)
  return { restored: SNAPSHOT_FILES, pnpm, removedLinks }
```

</details>

**依据 2 · 源码核查**：[src/index.js:82-96](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/index.js#L82-L96)

返回配置已还原及安装失败警告。

<details>
<summary>查看原文（15行）</summary>

```text
async function handleRollback(req, res) {
  try {
    const body = await readBody(req)
    const profile = typeof body.profile === 'string' && body.profile !== '' ? body.profile : 'web'
    const stamp = typeof body.stamp === 'string' ? body.stamp : ''
    if (!stamp) return send(res, { ok: false, error: '缺少要加载的快照 stamp' })
    const dir = resolveSnapshotDir(profile, { id: stamp })
    if (!dir) return send(res, { ok: false, error: `profile "${profile}" 找不到快照 ${stamp}` })
    const { pnpm } = restoreSnapshot(profile, dir)
    const target = dir.split(/[\\/]/).at(-1)
    if (pnpm !== null && !pnpm.ok) {
      return send(res, { ok: true, restored: true, stamp: target, warning: `配置文件已还原；pnpm install 失败（exit ${pnpm.status}）：${pnpm.output}` })
    }
    send(res, { ok: true, restored: true, stamp: target, note: '请重启应用使更改生效。' })
  } catch (e) { send(res, { ok: false, error: errMsg(e) }) }
```

</details>

**依据 3 · 源码核查**：[src/incident.js:165-180](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/incident.js#L165-L180)

事故报告嵌入原日志尾部。

<details>
<summary>查看原文（16行）</summary>

```text
  lines.push('# DSH 事故报告', '')
  lines.push(`- 类型: ${kind}`)
  lines.push(`- 时间: ${new Date().toISOString()}`)
  lines.push(`- node: ${process.version}`)
  lines.push(`- dsh 版本: ${harnessVersion() || '(未知)'}`)
  lines.push(`- DSH 根目录: ${process.env.DSH_HOME ?? '(默认 ~/.dsh)'}`)
  lines.push(`- 健康状态: http://127.0.0.1:${port}/ -> ${healthy ? '正常' : '异常'}`)
  lines.push(`- 上次启动: ${readLastBoot()}`, '')

  lines.push('## 启动日志(最近)')
  const boot = latestLogTail(logsDir, 'boot-', 40)
  lines.push(boot ? `\`\`\`\n${boot}\n\`\`\`` : '_(无)_', '')

  lines.push('## 服务端 stderr(最近)')
  const err = latestLogTail(logsDir, 'server-', 80)
  lines.push(err ? `\`\`\`\n${err}\n\`\`\`` : '_(无)_', '')
```

</details>

**依据 4 · 源码核查**：[src/incident.js:215-234](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/incident.js#L215-L234)

记录宿主版本变化及事故标记。

<details>
<summary>查看原文（20行）</summary>

```text
  // DSH 版本变化检测：profile 回滚无法撤销 DSH 根目录(node_modules)的更新，
  // 若启动失败由 DSH 更新引起，明确提示用户恢复之前的 DSH 版本。
  const curHarness = harnessVersion()
  const goodDir = resolveSnapshotDir('web', { good: true })
  let snapHarness = ''
  if (goodDir) {
    try {
      const m = JSON.parse(readFileSync(join(goodDir, 'manifest.json'), 'utf8'))
      if (typeof m.harness === 'string') snapHarness = m.harness
    } catch { /* ignore */ }
  }
  if (curHarness && snapHarness && curHarness !== snapHarness) {
    lines.push('## ⚠️ DSH 版本变化（可能与本故障有关）', '')
    lines.push(`- 最近良好快照时的 dsh: ${snapHarness}`)
    lines.push(`- 当前 dsh: ${curHarness}`)
    lines.push('- **profile 回滚无法撤销 DSH 根目录(node_modules)的更新**。若启动失败由 DSH 更新引起，请恢复之前的 DSH 版本后再试。', '')
  }

  writeFileSync(reportPath, lines.join('\n'), 'utf8')
  if (!noMarker) writePending(kind, reportPath)
```

</details>

**依据 5 · 源码核查**：[src/index.js:144-152](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/index.js#L144-L152)

提示词读取事故提醒。

```text
export function apply(ctx) {
  // 1. Incident-alert prompt section.
  const sp = ctx.get('systemPrompt')
  if (sp !== undefined) {
    sp.section({
      name: 'guard:incident-alert',
      order: -50,
      text: () => incidentSectionText(),
    })
```

#### 缺口

- 未测试安装失败、错误日志内容及宿主重启。
  **影响**：无法断言可恢复非配置副作用或宿主版本。
  **进一步探讨**：在独立目录阻断 pnpm，分别核对配置、依赖与实际运行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 应如何采用并验证经过验收的快照标签？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合先观察独立测试 profile 的单次故障恢复。手工保留一份确定可启动的配置和原依赖清单，确认快照覆盖后再跑已知启动故障演练。遇到未记录快照、依赖安装失败或 HTTP 正常但页面不可用时，停止自动回滚并使用独立备份。未验证的改进是只有在明确的宿主版本、渲染和简单会话操作通过后才标记经过验收的快照，回滚按验收环境选择。对同一组黑屏、版本升级和普通配置错误比较标签选点与现有启发式。若误选未减少，或旧版本无法还原，保留人工选择。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.js:449-467](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/engine.js#L449-L467)

现有标签启发式可作对照。

<details>
<summary>查看原文（19行）</summary>

```text
export function resolveSnapshotDir(profile, { id = '', good = false } = {}) {
  const root = rollbacksRoot(profile)
  if (!existsSync(root)) return null
  const dirs = readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .sort((a, b) => b.name.localeCompare(a.name))
  if (dirs.length === 0) return null
  if (id) {
    const hit = dirs.find((e) => e.name === id || e.name.startsWith(id))
    return hit ? join(root, hit.name) : null
  }
  if (good) {
    for (const e of dirs) {
      const manifest = readManifest(join(root, e.name))
      const tag = manifest?.tag ?? ''
      if (tag !== 'pre-boot' && tag !== 'pre-rollback') return join(root, e.name)
    }
  }
  return join(root, dirs[0].name)
```

</details>

**依据 2 · 源码核查**：[scripts/boot-guard.ps1:131-153](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/scripts/boot-guard.ps1#L131-L153)

现有信号不一定提供真实渲染确认。

<details>
<summary>查看原文（23行）</summary>

```text
    $deadline = (Get-Date).AddSeconds($seconds)
    while ((Get-Date) -lt $deadline) {
        $resp = $null
        try {
            $resp = Invoke-WebRequest -Uri ("http://127.0.0.1:" + $Port + "/guard/api/render-error") -TimeoutSec 2 -UseBasicParsing
        } catch {
            $status = $_.Exception.Response.StatusCode
            if ($status -eq [System.Net.HttpStatusCode]::NotFound) { return "ok" }
            # other failures (busy/recovering): keep polling
        }
        if ($resp) {
            $parsed = $null
            try { $parsed = $resp.Content | ConvertFrom-Json } catch { $parsed = $null }
            $hasSignal = ($null -ne $parsed) -and (
                ($parsed.PSObject.Properties.Name -contains 'renderError') -or
                ($parsed.PSObject.Properties.Name -contains 'booted'))
            if (-not $hasSignal) { return "ok" }  # not the guard endpoint (HTML fallback / old guard)
            if ($parsed.renderError) { return "rendercrash" }
            if ($parsed.booted) { return "ok" }
        }
        Start-Sleep -Milliseconds 500
    }
    return "unconfirmed"
```

</details>

**依据 3 · 源码核查**：[src/incident.js:215-230](https://github.com/lxzy-7/dsh-plugin-guard/blob/c95036f33a2a10bb4c12d04a7f470747effe6532/src/incident.js#L215-L230)

宿主版本不能靠 profile 还原。

<details>
<summary>查看原文（16行）</summary>

```text
  // DSH 版本变化检测：profile 回滚无法撤销 DSH 根目录(node_modules)的更新，
  // 若启动失败由 DSH 更新引起，明确提示用户恢复之前的 DSH 版本。
  const curHarness = harnessVersion()
  const goodDir = resolveSnapshotDir('web', { good: true })
  let snapHarness = ''
  if (goodDir) {
    try {
      const m = JSON.parse(readFileSync(join(goodDir, 'manifest.json'), 'utf8'))
      if (typeof m.harness === 'string') snapHarness = m.harness
    } catch { /* ignore */ }
  }
  if (curHarness && snapHarness && curHarness !== snapHarness) {
    lines.push('## ⚠️ DSH 版本变化（可能与本故障有关）', '')
    lines.push(`- 最近良好快照时的 dsh: ${snapHarness}`)
    lines.push(`- 当前 dsh: ${curHarness}`)
    lines.push('- **profile 回滚无法撤销 DSH 根目录(node_modules)的更新**。若启动失败由 DSH 更新引起，请恢复之前的 DSH 版本后再试。', '')
```

</details>

#### 缺口

- 未实现真实验收标签。
  **影响**：不能确认能降低误恢复。
  **进一步探讨**：对照带环境标记的快照和现有标签结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
