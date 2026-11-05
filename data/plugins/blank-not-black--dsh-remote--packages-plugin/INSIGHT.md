# DSH Remote Plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1d49c36](https://github.com/Blank-not-black/dsh-Remote/tree/1d49c36260f66aa511ba889834540582d2381174/packages/plugin)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Blank-not-black/dsh-Remote) [![npm 30d 5,796](https://img.shields.io/static/v1?label=npm+30d&message=5%2C796&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-plugin) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-plugin)
<!-- END META -->

> **功能**：在DSH添加手机连接入口并管理独立远程网关

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 管理宿主接线和启动，不承担全部移动客户端能力。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 插件直连管理路由缺局部鉴权且state返回master token，外层保护需证实。

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
  - [Q01 · 子插件与根客户端分别贡献什么？](#detail-section-11)
  - [Q02 · 自启、凭据和命令如何连到宿主？](#detail-section-12)
  - [Q03 · 管理路由、文件与生命周期有什么反证？](#detail-section-13)
  - [Q04 · 部署、费用和彻底退出怎样做？](#detail-section-14)
  - [Q05 · 怎么否定子插件的接入价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户希望从手机继续会话并管理连接网关。

手工启动网关并管理端口与认证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 独立网关管理 | 启动/状态/认证替换 | 卸载不等停机，默认自启 |
| 上游Cookie交换 | 让网关访问当前DSH | 0600文件与同用户权限；旧Host跳过 |
| 宿主命令桥 | 注册命令执行与状态 | 202非终态；直连管理面需独立保护 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与实际DSH注入服务 | 必需 | Host注册及运行gateway | 版本兼容需隔离核 |
| 受保护DSH监听与loopback网关 | 前置 | 阻断未认证管理路由 | 未证明保护不开放 |
| ~/.dsh-remote可写与系统进程能力 | 管理需要 | token/cookie/runtime/日志和user单元或detached | 进程独立于DSH |
| 精简FS_ROOT和模型账号预算 | 任务需要 | 文件访问和远程Agent任务 | 默认家目录范围较广，任务费用另控 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离 | 禁autostart，loopback和测试目录核无cookie管理请求 | 无401先停扩用 |
| 启动 | 核端口、真实Node、健康与cookie，不接管未知进程 | pending看状态不重复拉起 |
| 退出 | 认证shutdown写off，核systemd/PID/端口再卸包 | 撤token/cookie并另核Agent任务停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node运行时及测试Host资源未知 | 配置loopback/目录/门禁耗时未知 | 首次费用与耗时未知 |
| 持续 | 独立网关、长连接/传输及宿主模型资源未知 | 维护cookie与版本耗时未知 | 不是模型费用控制器 |
| 恢复 | 日志/状态/凭据与残留进程未知 | 停机核端口撤token再卸载耗时未知 | 退出耗时未知，自动卸载不终止独立服务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 启动接线 | 源码管理systemd或detached与健康 | 跨平台启动成功和省时未验 |
| 命令桥 | 真实Agent命令可返回operation状态 | 业务任务完成及重复效果未知 |
| 访问与退出 | gateway认证shutdown存在 | 插件直连鉴权/卸载止访未获运行证据 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 插件直连管理路由缺局部鉴权且state返回master token，外层保护需证实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 管理宿主接线和启动，不承担全部移动客户端能力。

管理链、Cookie、启动、命令与显式停机已读源码，未运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 插件直连管理路由缺局部鉴权且state返回master token，外层保护需证实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 暂观察，仅隔离loopback且禁自启核直连路由；不开放使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的核子插件如何自启网关、交换宿主凭据与控制命令，并明确直连管理路由门槛。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin/package.json、packages/plugin/index.mjs、README.md、packages/plugin/gateway.cjs 及固定范围 inventory；组件：packages/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的核子插件如何自启网关、交换宿主凭据与控制命令，并明确直连管理路由门槛。未执行目标代码或实际宿主验证。
- 下一步：先验未认证入口和停机，再讨论手机任务体验

**分析版本**

- **仓库**：[Blank-not-black/dsh-Remote](https://github.com/Blank-not-black/dsh-Remote)
- **版本号**：0.8.4（[固定提交 1d49c36](https://github.com/Blank-not-black/dsh-Remote/tree/1d49c36260f66aa511ba889834540582d2381174)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 若门禁和停机先通过，可再对照配置成本。

先验未认证入口和停机，再讨论手机任务体验

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 14 | 3608 | 3276 | 236 | — |
| .js | source | 52 | 23445 | 22310 | 509 | — |
| .cjs | source | 2 | 8616 | 7877 | 418 | — |
| .md | source | 19 | 1035 | — | — | 19736 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Blank-not-black/dsh-Remote/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核子插件如何自启网关、交换宿主凭据与控制命令，并明确直连管理路由门槛

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 子插件与根客户端分别贡献什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

packages/plugin是可安装plugin，package版本0.8.4；根仓README仍写0.8.0-rc.9，不能以该文档版本替代固定manifest。子包在DSH注册/remote前缀、连接入口、只读Doctor及文件交付工具，并管理随包gateway.cjs；后者与根gateway.js逐字一致，本轮只追子包实际接入链。远程会话/文件/审批客户端是根系统能力，子包新增宿主内启动、上游认证交换与命令/插件控制服务，非新Agent推理。相比手工起网关并维护上游cookie，减少的是配置接线，是否更快未测试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/package.json:1-15](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/package.json#L1-L15)

实际包身份版本

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-remote-plugin",
  "version": "0.8.4",
  "description": "DSH Remote 官方 bundle 插件：更多菜单中的手机连接入口、首次连接提示与浏览器管理控制台；内置网关自动启停，支持手机远程会话、审批、文件互传和设备管理。",
  "type": "module",
  "main": "./index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "index.mjs",
    "client.js",
```

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:1728-1760](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1728-L1760)

宿主接线与默认自启

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx) {
  pluginCenters.set(ctx, createPluginCenter(ctx))
  dshListen = { host: ctx.webServer.host, port: ctx.webServer.port }
  dshConnection = ctx.connection
  saveDshLaunchConfig(ctx)
  // Optional on older DSH: register the packaged read-only doctor skill when
  // the host exposes a skill registry. Failure never blocks the plugin.
  registerDoctorSkill(ctx)
  registerFileDeliveryTools(ctx, { gatewayBase, gatewayToken })
  watchDoctorWorkspaces(ctx)
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: MOUNT,
    handler: (req, res) => serveStatic(req, res, ctx).catch(error => {
      if (res.writableEnded || res.destroyed) return
      if (res.headersSent) return res.destroy()
      if (error.status === 413) res.setHeader('connection', 'close')
      sendJson(res, error.status || (error instanceof SyntaxError ? 400 : 500), { ok: false, message: error.status === 413 ? 'body too large' : 'request-failed' })
    }),
  }), 'dsh-remote: /remote route')
  // 实时统计: 监听 DSH 会话事件流, 把带 usage 的 assistant/message 投递到网关聚合
  ctx.on('session/event', (session, event) => {
    statsSend(session, event)
  })
  // DSH 启动/重启后自愈: 用户没关过网关就自动拉起(默认开, DSH_REMOTE_AUTOSTART=0 关闭)
  void ensureGateway()
  // apply 可能早于 Web 监听完成；延迟再交换一次新版 DSH 的会话 Cookie。
  ctx.effect(() => {
    const timer = setTimeout(() => { void ensureGateway() }, 5000)
    timer.unref?.()
    return () => clearTimeout(timer)
  }, 'dsh-remote: refresh upstream authentication')
}
```

</details>

**依据 3 · 作者声明**：[README.md:21-30](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/README.md#L21-L30)

作者根系统分工及旧文档版本

<details>
<summary>查看原文（10行）</summary>

```text

[Documentation](docs/README.md) · [Installation](docs/getting-started.md) · [Troubleshooting](docs/troubleshooting.md) · [Downloads](https://github.com/Blank-not-black/dsh-Remote/releases/latest) · [Issues](https://github.com/Blank-not-black/dsh-Remote/issues)

For task-based instructions and AI-assisted diagnosis, use the [operation and troubleshooting knowledge base (Chinese)](docs/wiki/README.md) or the [AI reading index](llms.txt). The plugin includes the same knowledge base as offline Doctor references.

The detailed guides are currently in Chinese. This page and the plugin README provide an English overview and installation path.

The current source is **0.8.0-rc.9** (2026-10-22), a candidate for validation before the stable release. See the [rc.9 notes](docs/rc-0.8.0-rc.9.md) for scope and evidence; a local candidate does not establish npm or GitHub release availability.

## Capabilities
```

</details>

#### 缺口

- 本轮未运行DSH入口、手机或安装流程
  **影响**：不能把打包存在当真实跨平台可用
  **进一步探讨**：用隔离DSH核包版本、gateway健康及一条无副作用查询

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自启、凭据和命令如何连到宿主？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply记录实际web listener与connection，ensure先通过authenticatedUrl交换303首Cookie，写0600文件供独立网关动态读取，旧宿主无方法则跳过。网关默认自启，端口预检后选Node运行时，优先systemd用户单元，失败回退detached/unref子进程--supervise；4秒未ready但仍活则pending，不再重复启动。ensure并发共用promise，只在版本/上游/解释器变更时认证关闭后替换，不因上游临时degraded重启。客户端命令分支核gateway master bearer、body8192、session/line，resolve真实Agent，核已注册命令，异步操作返回202及operation状态；unknown返回executed:false，不把void成功再发成文本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/index.mjs:131-154](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L131-L154)

Cookie真实交换和0600保存

<details>
<summary>查看原文（24行）</summary>

```text
async function refreshDshUpstreamCookie() {
  if (typeof dshConnection?.authenticatedUrl !== 'function') return false
  const upstream = upstreamUrlForListener(dshListen)
  try {
    const loginUrl = dshConnection.authenticatedUrl(upstream)
    const response = await fetch(loginUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(2500),
    })
    const setCookie = response.headers.get('set-cookie') || ''
    const cookie = setCookie.split(';', 1)[0].trim()
    if (response.status !== 303 || !cookie.includes('=') || cookie.length > 4096 || /[\0\r\n]/.test(cookie)) {
      throw new Error(`认证交换返回 HTTP ${response.status}`)
    }
    const file = dshUpstreamCookieFile()
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, cookie + '\n', { mode: 0o600 })
    chmodSync(file, 0o600)
    return true
  } catch (e) {
    // 禁止记录带启动令牌的 URL 或 Cookie，只保留不含凭据的错误摘要。
    logGateway('刷新 DSH 上游认证失败: ' + (e?.message || String(e)))
    return false
  }
```

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:812-840](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L812-L840)

已有网关认证与端口预检

<details>
<summary>查看原文（29行）</summary>

```text
async function startGateway() {
  const upstream = upstreamUrlForListener(dshListen)
  const health = await gatewayRunning()
  if (health.running) {
    const auth = await proxyGateway('/admin/api/state', 'GET', '')
    if (!auth || auth.status !== 200 || auth.json.ok !== true) {
      return { ok: false, running: true, started: false, error: auth?.status === 401 || auth?.status === 403 ? GATEWAY_AUTH_HINT : auth?.json?.error || '本地网关管理接口响应异常，请稍后重试' }
    }
    await gatewayRuntimeForStatus(auth.json.gatewayRuntime ?? null, health)
    setGatewayEnabled(true)
    return { ok: true, running: true, started: false }
  }
  const script = GATEWAY_SCRIPT
  if (!existsSync(script)) {
    return { ok: false, running: false, error: '插件包缺少 gateway.cjs, 请升级插件' }
  }
  const port = readGatewayPort()
  const host = readGatewayHost()
  if (await portInUse(port)) {
    logGateway(`端口 ${port} 已被占用, 拒绝启动`)
    return { ok: false, running: false, error: `端口 ${port} 已被占用，请在插件页修改网关端口后重试` }
  }
  // Windows 上运行中的 exe 不能被覆盖，网关解释器必须位于 DSH 安装目录之外，
  // 否则 DSH 原地更新(NSIS 替换整棵安装目录)会被插件进程挡住。
  // 顺序: DSH_REMOTE_NODE > PATH node > 桌面版内置 runtime 副本 > process.execPath(显式警告)。
  const runtime = await gatewayRuntimePlan()
  logGateway('启动网关, 端口: ' + port + ', 上游: ' + upstream + ', 解释器: ' + runtime.executable
    + ' (' + runtime.source + (runtime.version ? ', node ' + runtime.version : '') + ')')

```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:873-947](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L873-L947)

systemd与detached实际启动

<details>
<summary>查看原文（75行）</summary>

```text
      yield candidate
    }
  }
  for await (const candidate of runtimeCandidates()) {
    // 首选 systemd-run: 网关成为独立 user 单元, DSH 重启/升级不会连带杀掉它
    let sysd = false
    try {
      await runExit('systemctl', ['--user', 'reset-failed', 'dsh-remote-gateway'])
      sysd = (await runExit('systemd-run', [
        '--user', '--unit=dsh-remote-gateway', '--service-type=exec',
        ...gatewaySystemdEnvArgs(),
        '--setenv=PORT=' + port, '--setenv=HOST=' + host, '--setenv=DSH_UPSTREAM=' + upstream,
        '--', candidate.executable, script, '--supervise',
      ])) === 0
    } catch {}
    if (sysd) {
      try {
        const pid = Number(execFileSync('systemctl', ['--user', 'show', '-p', 'MainPID', '--value', 'dsh-remote-gateway'], { encoding: 'utf8' }).trim())
        if (Number.isFinite(pid) && pid > 1) { writeGatewayPid(pid); gatewayRuntimeSupervisorPid = pid }
      } catch {}
      const healthNow = await waitGatewayReady()
      if (healthNow) return startedResult(candidate, healthNow)
      // 单元立即失败(解释器不可执行等)才换候选；仍在启动时可能只是慢，不重复拉起。
      const unitState = gatewaySystemdUnitState()
      failures.push({ executable: candidate.executable, reason: 'systemd 单元 ' + (unitState || '未就绪') })
      logGateway('解释器 ' + candidate.executable + ' 的 systemd 单元未就绪(' + (unitState || '未知状态') + '), 尝试下一候选')
      if (unitState === 'activating' || unitState === 'active') return { ok: true, running: false, pending: true, hint: '网关启动中, 稍后刷新' }
      continue
    }

    // 无 systemd 的机器回退: detached 子进程
    if (!cwdReady) return { ok: false, running: false, error: '无法创建网关运行目录，请检查用户目录权限' }
    let logFd = null
    try {
      logFd = openSync(`${homedir()}/.dsh-remote/plugin-gateway.log`, 'a')
    } catch {}
    const gatewayEnv = { ...process.env, PORT: port, HOST: host, DSH_UPSTREAM: upstream }
    delete gatewayEnv.NODE_CHANNEL_FD
    delete gatewayEnv.NODE_CHANNEL_SERIALIZATION_MODE
    let child = null
    try {
      child = spawn(candidate.executable, [script, '--supervise'], {
        cwd: gatewayCwd,
        detached: true,
        stdio: ['ignore', logFd ?? 'ignore', logFd ?? 'ignore'],
        env: gatewayEnv,
      })
    } catch (error) {
      failures.push({ executable: candidate.executable, reason: 'spawn 失败: ' + (error?.message || error) })
      logGateway('解释器 ' + candidate.executable + ' 无法启动网关: ' + (error?.message || error) + ', 尝试下一候选')
      continue
    } finally {
      if (logFd !== null) { try { closeSync(logFd) } catch {} }
    }
    let exited = null
    child.once('exit', (code, signal) => { exited = { code, signal } })
    child.once('error', (error) => { exited = { code: null, error: error?.message || String(error) } })
    child.unref()
    if (Number.isInteger(child.pid) && child.pid > 1) { writeGatewayPid(child.pid); gatewayRuntimeSupervisorPid = child.pid }
    let healthNow = null
    for (let i = 0; i < 16; i++) {
      await sleep(250)
      const healthProbe = await gatewayRunning()
      if (healthProbe.running) { healthNow = healthProbe; break }
      if (exited) break
    }
    if (healthNow) return startedResult(candidate, healthNow)
    if (exited) {
      const detail = 'code=' + exited.code + (exited.signal ? ' signal=' + exited.signal : '') + (exited.error ? ' error=' + exited.error : '')
      failures.push({ executable: candidate.executable, reason: '立即退出(' + detail + ')' })
      logGateway('解释器 ' + candidate.executable + ' 启动的网关立即退出(' + detail + '), 尝试下一候选')
      continue
    }
    // 进程仍活着但 4 秒内未就绪: 保持原行为等待前端刷新，不重复启动第二个网关。
    return { ok: true, running: false, pending: true, hint: '网关启动中, 稍后刷新' }
```

</details>

**依据 4 · 源码核查**：[packages/plugin/index.mjs:968-1010](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L968-L1010)

ensure触发与重启门槛

<details>
<summary>查看原文（43行）</summary>

```text
function ensureGateway() {
  if (!gatewayAutostart()) return Promise.resolve(false)
  if (ensurePromise) return ensurePromise
  ensurePromise = (async () => {
    try {
      // 提前解析解释器(结果缓存)：即使网关已在运行，插件页也能显示实际选择与理由。
      const runtime = await gatewayRuntimePlan()
      await refreshDshUpstreamCookie()
      const health = await gatewayRunning()
      if (!health.running) {
        const out = await startGateway()
        return !!out.running
      }
      const upstream = upstreamUrlForListener(dshListen)
      const oldUpstream = health.upstream || ''
      const oldVersion = health.version || '?'
      const versionMismatch = oldVersion !== version
      const actualRuntime = runtime.desktopHost ? await gatewayRuntimeForStatus(undefined, health) : null
      // DSH 重启后接管遗留的宿主解释器，或应用新的外部解释器配置。
      // 本进程已尝试并回退的实例不再反复重启，避免坏候选导致重启风暴。
      const runtimeMismatch = runtime.desktopHost && gatewayRuntimeStartedPid !== health.pid
        && !runtime.insideInstallDir && actualRuntime?.executable
        && normalizeRuntimePath(actualRuntime.executable, process.platform) !== normalizeRuntimePath(runtime.executable, process.platform)
      // 上游暂时不可达不应重启网关: VPN/DSH 重启/短暂网络抖动时，
      // 重启只能制造额外断线，网关应保持运行并通过 /health 暴露 degraded 状态。
      if (versionMismatch || runtimeMismatch || (oldUpstream && oldUpstream !== upstream) || (!oldUpstream && upstream)) {
        logGateway(`网关需刷新: 版本 ${oldVersion} -> ${version}, 上游 ${oldUpstream || '?'} -> ${upstream}`)
        if (runtimeMismatch) logGateway('网关解释器需迁移: ' + actualRuntime.executable + ' -> ' + runtime.executable)
        if (!await killGateway(health)) {
          logGateway('拒绝自动重启: 无法通过认证关闭旧网关，请检查令牌或端口占用')
          return false
        }
        for (let i = 0; i < 10; i++) {
          if (!(await gatewayRunning()).running) break
          await sleep(200)
        }
        const out = await startGateway()
        return !!out.running
      }
      return true
    } finally {
      setTimeout(() => { ensurePromise = null }, 4000)
    }
```

</details>

**依据 5 · 源码核查**：[packages/plugin/index.mjs:1580-1640](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1580-L1640)

命令认证与执行分支

<details>
<summary>查看原文（61行）</summary>

```text
      return
    }
    if (!remoteCommandAuthorized(req)) {
      sendJson(res, 401, { ok: false, message: 'unauthorized' })
      return
    }
    let body
    try {
      body = JSON.parse((await readBody(req, 8192)) || '{}')
    } catch (error) {
      sendJson(res, error.status === 413 ? 413 : 400, { ok: false, message: error.status === 413 ? 'body too large' : 'invalid json' })
      return
    }
    const { sessionId, line } = body || {}
    if (!sessionId || typeof line !== 'string') {
      sendJson(res, 400, { ok: false, message: 'sessionId and line required' })
      return
    }
    try {
      const { agent, resolvePath } = await resolveAgent(ctx, sessionId)
      if (!agent) {
        sendJson(res, 200, { ok: false, message: 'agent not found', debug: { resolvePath, commandNames: [] } })
        return
      }
      let commandEntries = null
      let commandNames = []
      try {
        const listed = await ctx.commands.list(agent)
        commandEntries = Array.isArray(listed) ? listed : null
        commandNames = commandEntries ? commandEntries.map(commandEntryName).filter(Boolean) : []
      } catch (e) {
        commandNames = ['list-error']
      }
      const name = commandHead(line)
      if (commandEntries && (!name || !commandEntries.some(entry => commandEntryName(entry) === name))) {
        // 仅把 DSH 已登记的 slash command 截留到命令服务。未知 /xxx 仍让客户端
        // 按普通文本发送，保持 DSH 自己处理自定义提示词的兼容行为。
        sendJson(res, 200, { ok: true, executed: false, debug: { resolvePath, commandNames, reason: 'unknown-command' } })
        return
      }
      // /export 的成功结果必须先回到客户端，由客户端再发起 ZIP 下载；其他已登记
      // 命令统一异步受理，避免把未知耗时绑定到一条 HTTP 请求。
      if (name && (name !== 'export' || body.async === true)) {
        const { operation, reused } = beginCommandOperation(ctx, agent, sessionId, line, name)
        sendJson(res, 202, {
          ok: true,
          executed: true,
          accepted: true,
          operation: commandOperationSnapshot(operation),
          compact: name === 'compact' ? commandOperationSnapshot(operation) : undefined,
          debug: { resolvePath, commandNames, reused },
        })
        return
      }
      // /export 在持久化历史较大时会等待刷新；其他同步命令沿用较短超时。
      const signal = AbortSignal.timeout(LONG_RUNNING_COMMANDS.has(name)
        ? LONG_RUNNING_COMMAND_TIMEOUT_MS
        : DEFAULT_COMMAND_TIMEOUT_MS)
      const result = await executeRegisteredCommand(ctx, agent, line, signal)
      sendJson(res, 200, { ok: true, executed: commandWasExecuted(result), debug: { resolvePath, commandNames } })
    } catch (e) {
```

</details>

#### 缺口

- 旧/新宿主命令协议兼容与已受理任务断网后的结果未运行
  **影响**：202不是完成，重试命令可能混淆仍运行任务
  **进一步探讨**：按command-status确认终态，再验证相同session重连与未知命令回退

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 管理路由、文件与生命周期有什么反证？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心反证来自插件直连面：serveStatic的browser-launch明确说prefix不自动鉴权并调用authorizeIndex，但/admin/api/state未调用此检查就读本机gateway token并返回，管理mutation分支也代调用网关。apply直接注册prefix，无本插件统一入口鉴权。因而不能用gateway自己的admin bearer证明DSH直接/remote管理面安全；外层Host是否另保护及实际可利用性本轮未运行，源码缺局部门禁已确认。此token可交换广泛宿主权限，文件根默认家目录/Windows额外盘符，非会话级隔离。停止/卸载亦不同：apply仅返回定时器和注册释放，不关独立网关；stopGateway显式认证shutdown后写off。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/index.mjs:1210-1227](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1210-L1227)

仅browser-launch调用authorizeIndex

<details>
<summary>查看原文（18行）</summary>

```text
async function serveStatic(req, res, ctx) {
  const pathname = new URL(req.url ?? '/', 'http://x').pathname
  if (pathname === `${MOUNT}/admin/api/browser-launch`) {
    res.setHeader('cache-control', 'no-store')
    res.setHeader('referrer-policy', 'no-referrer')
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, code: 'method-not-allowed' })
    if (req.headers['x-dsh-remote-client'] !== 'entry') return sendJson(res, 403, { ok: false, code: 'explicit-entry-required' })
    if ([...new URL(req.url, 'http://x').searchParams].length) return sendJson(res, 400, { ok: false, code: 'invalid-query' })
    // Prefix routes are not automatically authenticated by DSH. Require its
    // signed browser cookie before minting a browser launch URL.
    if (typeof ctx.connection?.authorizeIndex !== 'function') return sendJson(res, 503, { ok: false, code: 'browser-auth-unavailable' })
    if (!ctx.connection.authorizeIndex(req, res)) return
    // Never accept a destination/Host header or expose a Remote gateway token.
    let url
    try { url = browserLaunchUrl(ctx) } catch (_) {}
    return sendJson(res, url ? 200 : 503, url ? { ok: true, url } : { ok: false, code: 'browser-auth-unavailable' })
  }
  if (pathname === `${MOUNT}/api/doctor/target` || pathname === `${MOUNT}/admin/api/doctor-target`) {
```

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:1359-1388](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1359-L1388)

state直接返回master token

<details>
<summary>查看原文（30行）</summary>

```text

  // 管理控制台数据: 优先代理本地网关(设备监控/更新检查完整), 网关不可用回退插件状态
  if (pathname === `${MOUNT}/admin/api/state`) {
    void ensureGateway() // 自愈: 开关为 on 而网关没起来时, 后台拉起, 下个轮询即可见网关
    const health = await gatewayRunning() // 新网关可在健康探测时恢复缺失的令牌文件
    const localToken = gatewayToken()
    const proxied = await proxyGateway('/admin/api/state', 'GET', '')
    if (proxied?.status === 200 && proxied.json.ok === true) {
      // 主机端 DSH 面板本身已登录本机用户, 管理页无需令牌门禁;
      // 把真实网关令牌一并返回, 抽屉里直接显示并允许复制(供手机 App 使用)。
      sendJson(res, proxied.status, { ...proxied.json, token: localToken, mode: 'gateway', via: 'gateway', gatewayInstalled, gatewayRuntime: await gatewayRuntimeForStatus(proxied.json.gatewayRuntime ?? null, health) })
      return
    }
    if (health.running && proxied?.status >= 500) {
      sendJson(res, proxied.status, { ...proxied.json, gatewayRunning: true })
      return
    }
    sendJson(res, 200, {
      ok: true,
      mode: 'plugin',
      gatewayRunning: health.running,
      gatewayAuthError: health.running && (!localToken || proxied?.status === 401 || proxied?.status === 403) ? GATEWAY_AUTH_HINT : '',
      gatewayVersion: health.version || '',
      gatewayRuntime: await gatewayRuntimeForStatus(null, health),
      version,
      token: health.running ? '' : localToken || '',
      gatewayInstalled,
      platform: process.platform,
      hostname: hostname(),
      lanIPs: lanIPs(),
```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:1431-1455](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1431-L1455)

管理mutation使用本机凭据代理

<details>
<summary>查看原文（25行）</summary>

```text
    if (!['GET', 'POST'].includes(req.method)) { res.writeHead(405, { allow: 'GET, POST' }); res.end(); return }
    const body = req.method === 'POST' ? await readBody(req, 4096) : undefined
    const proxied = await proxyGateway('/admin/api/' + pathname.split('/').pop(), req.method, body)
    sendJson(res, proxied?.status || 502, proxied?.json || { error: 'GATEWAY_UNAVAILABLE' })
    return
  }
  if (gatewayAdminMutations.has(pathname)) {
    if (req.method !== 'POST') {
      res.writeHead(405, { allow: 'POST' })
      res.end()
      return
    }
    const body = await readBody(req, 4096)
    const sub = gatewayAdminMutations.get(pathname)
    const proxied = await proxyGateway(`/admin/api${sub}`, 'POST', body)
    if (proxied !== null) {
      sendJson(res, proxied.status, proxied.json)
    } else {
      sendJson(res, 502, { ok: false, error: '本地网关不可用, 设备管理需在网关模式操作' })
    }
    return
  }

  // 网关端口配置(仅插件内嵌页使用): GET 当前生效端口 / PUT 修改端口
  if (pathname === `${MOUNT}/admin/api/config`) {
```

</details>

**依据 4 · 源码核查**：[packages/plugin/index.mjs:1016-1022](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1016-L1022)

显式停机和off

```text
async function stopGateway() {
  const health = await gatewayRunning()
  if (!await killGateway(health)) return { ok: false, running: health.running, error: health.running ? GATEWAY_AUTH_HINT : '网关未运行' }
  setGatewayEnabled(false)
  return { ok: true, running: false, bye: true }
}

```

**依据 5 · 源码核查**：[packages/plugin/gateway.cjs:1706-1735](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/gateway.cjs#L1706-L1735)

默认文件根较广

<details>
<summary>查看原文（30行）</summary>

```text
// 允许访问的根目录: DSH_REMOTE_FS_ROOT 使用系统路径分隔符分隔多个根,
// POSIX 为 ':'、Windows 为 ';'；Windows 默认用户目录及 C 盘以外的可用盘符。
// 所有 /fs/* 路径 resolve 后都必须位于某个根内, 已存在的路径还会用 realpath
// 复核一次, 防止 ../ 穿越与符号链接逃逸。
const FS_DEFAULT_ROOT = path.resolve(os.homedir())
function fsConfiguredRoot(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '~') return raw === '~' ? FS_DEFAULT_ROOT : ''
  if (/^~[\\/]/.test(raw)) return path.resolve(FS_DEFAULT_ROOT, raw.slice(2))
  return path.resolve(raw)
}
function fsDefaultRoots(platform, home, isDirectory) {
  const roots = [home]
  if (platform === 'win32') {
    for (const letter of 'ABDEFGHIJKLMNOPQRSTUVWXYZ') {
      const root = `${letter}:\\`
      try { if (isDirectory(root)) roots.push(root) } catch {}
    }
  }
  return roots
}
const FS_ROOTS = process.env.DSH_REMOTE_FS_ROOT
  ? process.env.DSH_REMOTE_FS_ROOT.split(path.delimiter).map(fsConfiguredRoot).filter(Boolean)
  : fsDefaultRoots(process.platform, FS_DEFAULT_ROOT, root => fs.statSync(root).isDirectory())
const FS_WINDOWS_DEFAULT = process.platform === 'win32' && !process.env.DSH_REMOTE_FS_ROOT
const FS_WORKSPACE_CACHE_MS = durationEnv('DSH_REMOTE_FS_WORKSPACE_CACHE_MS', 15_000, 1000, 10 * 60_000)
const FS_MAX_UPLOAD = Number(process.env.DSH_REMOTE_FS_MAX_UPLOAD) || 2 * 1024 * 1024 * 1024
const FS_UPLOAD_TTL_MS = durationEnv('DSH_REMOTE_FS_UPLOAD_TTL_MS', 24 * 60 * 60 * 1000, 60_000, 7 * 24 * 60 * 60 * 1000)
let FS_ROOT_REALS = null
let fsWorkspaceRootsCache = { roots: [], reals: [], fetchedAt: 0 }
```

</details>

#### 缺口

- 真实DSH监听器外层认证和该缺门禁的网络可达性未实测
  **影响**：若外部可达直连路由，可泄露主token并扩大到文件/命令控制；不能建议开放网络采用
  **进一步探讨**：在隔离宿主无cookie请求state和mutation核401；未确认保护前只观察且禁用自启/阻断监听

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、费用和彻底退出怎样做？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

子包Node>=18，但真实Host注入需webServer/commands/agents/connection，需核所装DSH版本。端口8787默认，HOST默认可能对LAN开放，自动启动可用DSH_REMOTE_AUTOSTART=0关闭；先只loopback并限制DSH_REMOTE_FS_ROOT到测试目录。首次有~/.dsh-remote token/cookie/启用状态/日志以及可能复制的Node runtime；持续为独立网关、长连接、文件/统计和后台保活，无模型费不等无需宿主模型账单。退出先通过受保护管理面stop写off，核独立systemd/监督进程及端口真停，再卸插件、撤master/device token、清upstream Cookie与不需日志；关闭DSH或卸插件不保证独立网关停止，已提交Agent命令/模型任务需另取消核结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/index.mjs:383-402](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L383-L402)

持久启停和环境覆盖

<details>
<summary>查看原文（20行）</summary>

```text
function gatewayStateFile() { return `${homedir()}/.dsh-remote/gateway.enabled` }

function gatewayAutostart() {
  if (process.env.DSH_REMOTE_AUTOSTART === '0') return false
  try {
    const v = readFileSync(gatewayStateFile(), 'utf8').trim()
    return v !== 'off'
  } catch {
    return true // 全新安装: 默认自动拉起网关, 抽屉打开即有网关模式
  }
}

function setGatewayEnabled(on) {
  try {
    mkdirSync(`${homedir()}/.dsh-remote`, { recursive: true })
    writeFileSync(gatewayStateFile(), on ? 'on\n' : 'off\n')
  } catch {}
}

/* ---------- 网关解释器解析 ----------
```

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:361-379](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L361-L379)

仅认证shutdown不按公开PID杀进程

<details>
<summary>查看原文（19行）</summary>

```text
async function killGateway(health) {
  // PID 文件和公开健康响应不能证明进程归属；仅走网关认证关闭接口。
  if (!health?.running || !Number.isInteger(health.pid) || health.pid <= 1) return false
  const token = gatewayToken()
  if (!token) return false
  try {
    const res = await fetch(`${health.base || gatewayBase()}/admin/api/shutdown`, {
      method: 'POST', headers: { authorization: `Bearer ${token}`, 'x-dsh-remote-client': 'admin' },
      signal: AbortSignal.timeout(2000),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok || body.ok !== true || body.bye !== true) return false
    logGateway('已请求旧网关认证关闭')
    await sleep(300)
    return true
  } catch (e) {
    logGateway('认证关闭旧网关失败: ' + (e?.message || String(e)))
    return false
  }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:873-889](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L873-L889)

独立user单元

<details>
<summary>查看原文（17行）</summary>

```text
      yield candidate
    }
  }
  for await (const candidate of runtimeCandidates()) {
    // 首选 systemd-run: 网关成为独立 user 单元, DSH 重启/升级不会连带杀掉它
    let sysd = false
    try {
      await runExit('systemctl', ['--user', 'reset-failed', 'dsh-remote-gateway'])
      sysd = (await runExit('systemd-run', [
        '--user', '--unit=dsh-remote-gateway', '--service-type=exec',
        ...gatewaySystemdEnvArgs(),
        '--setenv=PORT=' + port, '--setenv=HOST=' + host, '--setenv=DSH_UPSTREAM=' + upstream,
        '--', candidate.executable, script, '--supervise',
      ])) === 0
    } catch {}
    if (sysd) {
      try {
```

</details>

**依据 4 · 源码核查**：[packages/plugin/index.mjs:1728-1760](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1728-L1760)

卸载仅注册/计时器

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx) {
  pluginCenters.set(ctx, createPluginCenter(ctx))
  dshListen = { host: ctx.webServer.host, port: ctx.webServer.port }
  dshConnection = ctx.connection
  saveDshLaunchConfig(ctx)
  // Optional on older DSH: register the packaged read-only doctor skill when
  // the host exposes a skill registry. Failure never blocks the plugin.
  registerDoctorSkill(ctx)
  registerFileDeliveryTools(ctx, { gatewayBase, gatewayToken })
  watchDoctorWorkspaces(ctx)
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: MOUNT,
    handler: (req, res) => serveStatic(req, res, ctx).catch(error => {
      if (res.writableEnded || res.destroyed) return
      if (res.headersSent) return res.destroy()
      if (error.status === 413) res.setHeader('connection', 'close')
      sendJson(res, error.status || (error instanceof SyntaxError ? 400 : 500), { ok: false, message: error.status === 413 ? 'body too large' : 'request-failed' })
    }),
  }), 'dsh-remote: /remote route')
  // 实时统计: 监听 DSH 会话事件流, 把带 usage 的 assistant/message 投递到网关聚合
  ctx.on('session/event', (session, event) => {
    statsSend(session, event)
  })
  // DSH 启动/重启后自愈: 用户没关过网关就自动拉起(默认开, DSH_REMOTE_AUTOSTART=0 关闭)
  void ensureGateway()
  // apply 可能早于 Web 监听完成；延迟再交换一次新版 DSH 的会话 Cookie。
  ctx.effect(() => {
    const timer = setTimeout(() => { void ensureGateway() }, 5000)
    timer.unref?.()
    return () => clearTimeout(timer)
  }, 'dsh-remote: refresh upstream authentication')
}
```

</details>

**依据 5 · 源码核查**：[packages/plugin/package.json:57-62](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/package.json#L57-L62)

Node要求

```text
  },
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": {
```

#### 缺口

- 本轮未运行网关/DSH与停机，首次/持续/恢复费用和耗时未知
  **影响**：不能保证卸载即止远程访问或止宿主任务费用
  **进一步探讨**：隔离环境按启用→停机→卸载核PID、端口、cookie/token和任务状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎么否定子插件的接入价值？

**研究主题**：新假设与验证

#### 完整回答

比较手工固定网关与插件管理相同DSH，记录连接准备、cookie续期、版本更新及停机步骤。反例重点是无cookie直连管理路由、错误token网关接管、端口被其他进程占用、上游短断、卸载后网关常驻。若管理路由未经外层保护即可读token或停用后仍暴露，则不能扩大采用；保留手工loopback网关/可信隧道，先补访问门禁。当前没有省时或安全验证收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/index.mjs:1359-1388](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1359-L1388)

可验证管理token边界

<details>
<summary>查看原文（30行）</summary>

```text

  // 管理控制台数据: 优先代理本地网关(设备监控/更新检查完整), 网关不可用回退插件状态
  if (pathname === `${MOUNT}/admin/api/state`) {
    void ensureGateway() // 自愈: 开关为 on 而网关没起来时, 后台拉起, 下个轮询即可见网关
    const health = await gatewayRunning() // 新网关可在健康探测时恢复缺失的令牌文件
    const localToken = gatewayToken()
    const proxied = await proxyGateway('/admin/api/state', 'GET', '')
    if (proxied?.status === 200 && proxied.json.ok === true) {
      // 主机端 DSH 面板本身已登录本机用户, 管理页无需令牌门禁;
      // 把真实网关令牌一并返回, 抽屉里直接显示并允许复制(供手机 App 使用)。
      sendJson(res, proxied.status, { ...proxied.json, token: localToken, mode: 'gateway', via: 'gateway', gatewayInstalled, gatewayRuntime: await gatewayRuntimeForStatus(proxied.json.gatewayRuntime ?? null, health) })
      return
    }
    if (health.running && proxied?.status >= 500) {
      sendJson(res, proxied.status, { ...proxied.json, gatewayRunning: true })
      return
    }
    sendJson(res, 200, {
      ok: true,
      mode: 'plugin',
      gatewayRunning: health.running,
      gatewayAuthError: health.running && (!localToken || proxied?.status === 401 || proxied?.status === 403) ? GATEWAY_AUTH_HINT : '',
      gatewayVersion: health.version || '',
      gatewayRuntime: await gatewayRuntimeForStatus(null, health),
      version,
      token: health.running ? '' : localToken || '',
      gatewayInstalled,
      platform: process.platform,
      hostname: hostname(),
      lanIPs: lanIPs(),
```

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:968-1010](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L968-L1010)

短断与替换判据

<details>
<summary>查看原文（43行）</summary>

```text
function ensureGateway() {
  if (!gatewayAutostart()) return Promise.resolve(false)
  if (ensurePromise) return ensurePromise
  ensurePromise = (async () => {
    try {
      // 提前解析解释器(结果缓存)：即使网关已在运行，插件页也能显示实际选择与理由。
      const runtime = await gatewayRuntimePlan()
      await refreshDshUpstreamCookie()
      const health = await gatewayRunning()
      if (!health.running) {
        const out = await startGateway()
        return !!out.running
      }
      const upstream = upstreamUrlForListener(dshListen)
      const oldUpstream = health.upstream || ''
      const oldVersion = health.version || '?'
      const versionMismatch = oldVersion !== version
      const actualRuntime = runtime.desktopHost ? await gatewayRuntimeForStatus(undefined, health) : null
      // DSH 重启后接管遗留的宿主解释器，或应用新的外部解释器配置。
      // 本进程已尝试并回退的实例不再反复重启，避免坏候选导致重启风暴。
      const runtimeMismatch = runtime.desktopHost && gatewayRuntimeStartedPid !== health.pid
        && !runtime.insideInstallDir && actualRuntime?.executable
        && normalizeRuntimePath(actualRuntime.executable, process.platform) !== normalizeRuntimePath(runtime.executable, process.platform)
      // 上游暂时不可达不应重启网关: VPN/DSH 重启/短暂网络抖动时，
      // 重启只能制造额外断线，网关应保持运行并通过 /health 暴露 degraded 状态。
      if (versionMismatch || runtimeMismatch || (oldUpstream && oldUpstream !== upstream) || (!oldUpstream && upstream)) {
        logGateway(`网关需刷新: 版本 ${oldVersion} -> ${version}, 上游 ${oldUpstream || '?'} -> ${upstream}`)
        if (runtimeMismatch) logGateway('网关解释器需迁移: ' + actualRuntime.executable + ' -> ' + runtime.executable)
        if (!await killGateway(health)) {
          logGateway('拒绝自动重启: 无法通过认证关闭旧网关，请检查令牌或端口占用')
          return false
        }
        for (let i = 0; i < 10; i++) {
          if (!(await gatewayRunning()).running) break
          await sleep(200)
        }
        const out = await startGateway()
        return !!out.running
      }
      return true
    } finally {
      setTimeout(() => { ensurePromise = null }, 4000)
    }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:1016-1022](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1016-L1022)

停机off路径

```text
async function stopGateway() {
  const health = await gatewayRunning()
  if (!await killGateway(health)) return { ok: false, running: health.running, error: health.running ? GATEWAY_AUTH_HINT : '网关未运行' }
  setGatewayEnabled(false)
  return { ok: true, running: false, bye: true }
}

```

#### 缺口

- 无本轮隔离访问/退出对照
  **影响**：无法判定接入便利抵过认证和生命周期风险
  **进一步探讨**：先验未认证入口和停机，再讨论手机任务体验

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
