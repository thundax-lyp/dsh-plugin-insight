# dsh-remote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6dd1852](https://github.com/flymysql/dsh-remote/tree/6dd1852f55772b5422e77cc145230e971741d28d)

<!-- BEGIN META -->
[![GitHub ★ 275](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=275&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flymysql/dsh-remote) [![npm 30d 103,257](https://img.shields.io/static/v1?label=npm+30d&message=103%2C257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote)
<!-- END META -->

> **功能**：将 SSH 主机接入 DSH 远程工作区，提供文件同步、命令、终端与端口转发。

> **亮点**：[Q01](#research-q01) 将会话绑定到镜像来源，[Q02](#research-q02) 提供可读的三路冲突反馈。

> **主要限制**：[Q02](#research-q02) 低约束默认可能允许远端命令，[Q03](#research-q03) 取消文案强于退出证据。

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
  - [Q01 · 如何将会话绑定到一台机器及一个目录？](#detail-section-11)
  - [Q02 · 文件同步和权限边界如何工作？](#detail-section-12)
  - [Q03 · 取消何时返回，用户还要承担哪些成本？](#detail-section-13)
  - [Q04 · 怎样限定评估并验证新的回读条件？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：管理 SSH 主机的开发者可在 DSH 会话查看指定远端工作区及镜像。

分别用 SSH 和同步工具能完成同样任务；插件整合镜像与会话，但远端操作权限由实际账号决定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远端工作区 | 绑定会话及主机 | 已知本地会话拒绝借用全局机器 |
| 镜像同步 | 比较并同步远端文件 | 元数据不足以证明内容相同 |
| 远端命令 | 运行 SSH 任务 | 权限与取消结果需独立核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具和会话服务 | 必需 | 绑定工作区 | 回独立 SSH |
| SSH 账号和可达主机 | 必需 | 读取和执行 | 停止远端任务 |
| 低权限账号、镜像备份 | 隔离评估条件 | 缩小写入后果 | 保留观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 对照 | 确认会话与镜像来源 | 与独立 SSH 一致 |
| 读取 | dryRun 和内容回查 | 冲突有明确处理 |
| 退出 | 异常时停止重跑 | 独立读回进程和文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 主机与磁盘未知 | 配置身份和镜像 | 运行权限需确认 |
| 持续 | 传输和存储未知 | 处理冲突和回读 | 节时未知 |
| 失败恢复 | 备份及重试未知 | 检查两端及进程 | 取消未证明退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话归属 | 镜像来源绑定 | 多主机实际表现 |
| 冲突检查 | 三路元数据 | 所有内容一致 |
| 取消 | 中止信号尝试 | 远端进程状态 |

> **思考**：[Q02](#research-q02) 低约束默认可能允许远端命令，[Q03](#research-q03) 取消文案强于退出证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将会话绑定到镜像来源，[Q02](#research-q02) 提供可读的三路冲突反馈。

会话 origin 与全局选择分离，三路状态可解释；权限默认与远端取消都需要独立验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 低约束默认可能允许远端命令，[Q03](#research-q03) 取消文案强于退出证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先核对低权限测试主机与镜像，只读检查通过前保留独立 SSH 路径。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查会话绑定、三路同步、权限默认和 SSH2 取消。未运行目标工具及远端主机。

- 已检查：作者 README、包清单、源码路径 lib/binding.js、lib/index.js、lib/sync.js、lib/remote-sandbox.js、lib/pool.js、lib/exec-job.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查绑定、SSH2 取消、代表同步与权限分支；未执行真实主机或全协议检查。
- 下一步：在隔离账号复核双主机选择、缺策略默认、同元数据不同内容与真实进程退出。

**分析版本**

- **仓库**：[flymysql/dsh-remote](https://github.com/flymysql/dsh-remote)
- **版本号**：0.8.91（[固定提交 6dd1852](https://github.com/flymysql/dsh-remote/tree/6dd1852f55772b5422e77cc145230e971741d28d)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 选择性内容回读和远端退出确认可能减少错误同步和重复执行。

在隔离账号复核双主机选择、缺策略默认、同元数据不同内容与真实进程退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 5793 | — | — | 93748 |
| .mjs | source | 26 | 2982 | 2269 | 484 | — |
| .js | source | 49 | 24136 | 16779 | 6643 | — |
| .mjs | test | 3 | 205 | 142 | 43 | — |
| .cjs | source | 1 | 400 | 207 | 170 | — |
| .js | test | 116 | 25963 | 20258 | 3731 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=37&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=39&color=737b86&logo=github)](https://github.com/flymysql/dsh-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：管理 SSH 主机的开发者能否在 DSH 中确认会话、镜像和执行目标，并在权限不明或取消后安全恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何将会话绑定到一台机器及一个目录？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护多台 SSH 主机的开发者，可以用两个隔离项目验证每个会话是否读到预期机器和文件。基线是分别用 SSH 和文件同步工具工作。插件按会话 cwd 查包含它的本地镜像，从元数据取远端目录和主机身份，匹配多个目录时选最深路径。已知本地会话没有镜像时，要求绑定的工具会拒绝使用当前全局机器。这使切换另一会话的机器不会仅因一个全局选择而改写此会话的目标。远端身份配置、实际连接和 SSH 权限仍需独立确认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-23](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/README.md#L17-L23)

作者说明 SSH 工作区和远端 Web 接入。

```text
**为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）打造的远程工作助手。**

维护多台 SSH 机器，然后在「选择工作区」时选一个**远程工作区**（或**本地工作区**），Agent 就能在不离开 harness 的情况下直接操作——列文件、读代码、在远程主机上跑构建/命令，并把远程目录镜像成一个真实的本地工作区对象。

DSH 的 Web 界面刻意只监听 `127.0.0.1`（CLI 为安全拒绝 `--host 0.0.0.0`）。本插件反过来：**由你主动连出**到你维护的机器，选一个工作区，然后通过 DSH 原生的工作区 + 文件流来工作——**不改动 `dsh-workspace` 核心**。

反过来也成立：**你可以把远端那台机器的 DSH 网页界面，当成本机浏览器里的一个页面打开**——同样不需要在远端开放任何端口（详见 [在本地打开远程机器上的 DSH 界面](#在本地打开远程机器上的-dsh-界面)）。远端 dsh 需要你先装好（插件不再代装）。
```

**依据 2 · 源码核查**：[lib/binding.js:68-89](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/binding.js#L68-L89)

镜像包含关系和远端元数据。

<details>
<summary>查看原文（22行）</summary>

```text
    for (const entry of entries) {
      const metaPath = path.join(hostPath, entry, '.dsh-remote-meta.json')
      if (!existsSync(metaPath)) continue
      const mirrorAbs = norm(path.join(hostPath, entry))
      if (!isUnder(base, mirrorAbs)) continue
      // Deepest match wins; an equal-length path cannot occur twice.
      if (mirrorDir && mirrorAbs.length <= mirrorDir.length) continue
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
        if (!meta || !meta.host) continue
        mirrorDir = mirrorAbs
        remotePath = String(meta.remotePath || '')
        machine = {
          host: String(meta.host),
          port: Number(meta.port) || 22,
          username: String(meta.username || ''),
          // The ~/.ssh/config alias this mirror was created through, when the
          // machine was saved as one (issue #38): it keeps the mirror bound to
          // its machine even if that alias's HostName/port later change.
          alias: String(meta.alias || ''),
        }
      } catch { /* unparsable meta → not a usable binding */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1716-1746](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/index.js#L1716-L1746)

从会话 cwd 解析并选择机器连接池。

<details>
<summary>查看原文（31行）</summary>

```text
  const bindingFor = (exec) => {
    const cwd = exec?.agent?.session?.header?.cwd
    if (cwd) {
      const { remotePath, machine, mirrorDir } = resolveMirrorForLocal(String(cwd))
      if (remotePath && machine) {
        return {
          pool: poolForMachine(machine),
          ws: remotePath,
          host: machine.host,
          username: machine.username,
          port: machine.port,
          alias: machine.alias || '',
          mirrorDir,
          bound: true,
          local: false,
        }
      }
    }
    return {
      pool,
      ws: wsPath(),
      host: config.host,
      username: config.username,
      port: config.port,
      mirrorDir: wsPath() ? mirrorDirFor(wsPath(), config.host, config.username, config.port) : null,
      bound: false,
      // A caller that identified itself with a cwd, yet resolved to no mirror,
      // is definitively a LOCAL session. Distinguish it from "no caller
      // context at all", where the active machine is still the right answer.
      local: !!cwd,
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1757-1768](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/index.js#L1757-L1768)

拒绝本地会话继承全局机器。

<details>
<summary>查看原文（12行）</summary>

```text
  const requireBinding = (exec, tool) => {
    const b = bindingFor(exec)
    // A LOCAL session must be refused even when an active machine happens to
    // have a workspace: inheriting it is precisely how a command reaches a host
    // the caller never asked for. Checking only `!b.ws` missed this, because
    // the active machine's workspace is usually non-empty.
    if (b.local) {
      throw new Error(
        `${tool}: this session is LOCAL — its workspace is not a remote mirror, `
        + 'so there is no remote host to act on. Refusing rather than falling back to the active machine '
        + `(${config.username || '?'}@${config.host || '?'}), which belongs to a different session. `
        + 'Use rw_connect + rw_pick_workspace to bind a remote workspace, then open a session in its local mirror.',
```

</details>

#### 缺口

- 未在双主机、别名改动和重连条件运行。
  **影响**：不能确认全部入口都沿已核查的会话绑定。
  **进一步探讨**：用两个隔离账号和不同内容的同名文件，交错读取并对照直接 SSH。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件同步和权限边界如何工作？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

同步以远端、本地和上次记录的 size 与按秒 mtime 作为三路依据，双方变化时报告冲突，force 可覆盖。不同内容若恰好同尺寸和同秒，则可能通过未改检查，不能把该结果当内容一致。权限函数优先读取宿主 sandboxPolicy；缺失、解析异常或无有效模式时退回插件配置，inherit 不在显式模式表便落到 danger-full-access。workspace-write 对工具写路径作范围检查，但直接允许 exec 与 tunnel，远端实际读写仍由 SSH 账号和 OS 控制。投入使用前应核对有效模式和最小远端权限，不能只看配置标签。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:39-41](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/sync.js#L39-L41)

用大小和取整的 mtime 组成比较键。

```text
const keyOf = (size, mtime) => `${size}:${Math.floor(mtime || 0)}`
const localKey = (st) => (st ? keyOf(st.size, st.mtimeMs / 1000) : null)
const remoteKey = (st) => (st ? keyOf(st.size, st.mtime) : null)
```

**依据 2 · 源码核查**：[lib/sync.js:143-168](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/sync.js#L143-L168)

三路冲突与 dryRun、实际读写分开。

<details>
<summary>查看原文（26行）</summary>

```text
      if (maxFileBytes > 0 && r.size > maxFileBytes) { stats.skippedLarge++; return }
      const rk = remoteKey(r)
      const sk = state[rel] ? keyOf(state[rel].size, state[rel].mtime) : null
      let lk = null
      if (existsSync(lp)) {
        try { lk = localKey(statSync(lp)) } catch { lk = null }
      }
      if (sk && rk === sk && lk && lk === sk) { stats.skippedUnchanged++; return }
      if (!force && sk && rk !== sk && lk && lk !== sk && rk !== lk) {
        stats.conflicts.push({ path: rp, reason: 'both-modified（远端与本地都改过，跳过不覆盖）' })
        return
      }
      if (!force && sk && rk === sk && lk && lk !== sk) {
        // Pull would clobber a local edit; the remote never changed.
        stats.conflicts.push({ path: rp, reason: 'local-modified（本地改过而远端未变；如需覆盖请用 force / rw_push）' })
        return
      }
      if (dryRun) {
        stats.files++
        stats.touched.push(rp)
        nextState[rel] = { size: r.size, mtime: r.mtime }
        return
      }
      try {
        const buf = await callSftp((s) => s.readFile(rp))
        writeFileSync(lp, buf)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1795-1817](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/index.js#L1795-L1817)

注释与实现边界，策略失败会走默认。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Resolve the sandbox mode for one tool call.
   *
   * Reads the core policy service when present; otherwise honours the plugin's
   * own `remoteSandbox` fallback (`inherit` ⇒ danger-full-access, i.e. the old
   * unconfined behaviour). Any resolution failure is treated as read-only — fail
   * closed, never open.
   *
   * @param {object} [exec] - the tool run context.
   * @returns {string} the mode name.
   */
  const sandboxModeFor = (exec) => {
    if (!remoteSandboxEnabled()) return 'danger-full-access'
    try {
      const svc = ctx.get('sandboxPolicy')
      if (svc && typeof svc.resolve === 'function') {
        const session = exec && exec.agent ? exec.agent.session : undefined
        const resolved = svc.resolve(session ? { session } : {})
        if (resolved && REMOTE_SANDBOX_MODES.includes(resolved.mode)) return resolved.mode
      }
    } catch { /* fall through to the configured default */ }
    const fallback = String(config.remoteSandbox || 'inherit')
    return REMOTE_SANDBOX_MODES.includes(fallback) ? fallback : 'danger-full-access'
```

</details>

**依据 4 · 源码核查**：[lib/remote-sandbox.js:107-146](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/remote-sandbox.js#L107-L146)

workspace-write 允许命令与端口，限制工具写路径。

<details>
<summary>查看原文（40行）</summary>

```text
  if (operation === 'read' || operation === 'connect') return { allowed: true, mode: effective }

  if (effective === 'danger-full-access') return { allowed: true, mode: effective }

  if (effective === 'read-only') {
    // read-only refuses every state-changing remote operation. This is the
    // strict reading of the official mode ("`read-only` permits only required
    // sinks such as /dev/null") and the one that keeps a confined session
    // honest on a machine whose filesystem it cannot police.
    return {
      allowed: false,
      mode: effective,
      subject: operation === 'exec' ? 'command' : operation === 'tunnel' ? 'tunnel' : 'operation',
      reason:
        operation === 'exec'
          ? 'read-only sessions may not run commands on a remote host'
          : operation === 'tunnel'
            ? 'read-only sessions may not open remote port forwards'
            : 'read-only sessions may not modify a remote host',
    }
  }

  // workspace-write: writes must stay inside the workspace; exec and tunnel are
  // allowed because a command's effects cannot be bounded lexically (and the
  // official bash tool under workspace-write DOES run commands, confining them
  // via the OS). Refusing exec here would make workspace-write useless for the
  // primary remote use case (builds, tests), while pretending to confine it
  // would be worse than saying we do not.
  if (operation === 'exec' || operation === 'tunnel') return { allowed: true, mode: effective }

  // A write with no resolvable workspace root cannot be proven inside it.
  if (!workspaceRoot) {
    return {
      allowed: false,
      mode: effective,
      subject: 'operation',
      reason: 'workspace-write needs a remote workspace root to fence writes; none is set',
    }
  }
  if (isInsideRemote(target, workspaceRoot)) return { allowed: true, mode: effective }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2794-2802](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/index.js#L2794-L2802)

rw_exec 在绑定后检查 exec 许可。

```text
      output: textOut,
      async execute(args, exec) {
        const b = requireBinding(exec, 'rw_exec')
        // Remote sandbox fence: commands change remote state.
        requireRemoteSandbox(exec, 'exec', { tool: 'rw_exec' })
        const cmd = String(args.command || '')
        if (!cmd) throw new Error('rw_exec: command is required')
        const ws = b.ws
        const cwd = args.cwd ? resolveRemoteArg(b, args.cwd) : (ws || '')
```

#### 缺口

- 未复现同尺寸同时间的双端内容变化或权限服务异常。
  **影响**：已知存在判等和默认边界，影响范围需实测。
  **进一步探讨**：在隔离主机用明确的同元数据不同内容和缺策略配置比较工具结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消何时返回，用户还要承担哪些成本？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

SSH2 命令中止分支先尝试向通道发 SIGTERM，再安排关闭，并立即把本地结果设为 ABORTED 后 settle。格式化把它写成远端命令已经停止，源码没有在该分支等待远端退出确认。发生网络异常、信号失败或存在独立子进程时，应保留结果未知，使用独立 SSH 核对进程与变更文件，避免重复执行。首次成本包括配置主机身份、认证、镜像及备份，持续成本包括网络传输、镜像磁盘、冲突和命令输出管理，恢复成本还包含双端回查；各项时间和资源未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/pool.js:715-732](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/pool.js#L715-L732)

SIGTERM 尝试与本地 settle 的顺序。

<details>
<summary>查看原文（18行）</summary>

```text
              if (signal) {
                if (signal.aborted) {
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  try { stream.close() } catch {}
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  return settle()
                }
                onAbort = () => {
                  if (settled) return
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  const hardClose = setTimeout(() => { try { stream.close() } catch {} }, 500)
                  if (typeof hardClose.unref === 'function') hardClose.unref()
                  settle()
                }
                signal.addEventListener('abort', onAbort, { once: true })
```

</details>

**依据 2 · 源码核查**：[lib/exec-job.js:61-70](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/exec-job.js#L61-L70)

格式化语句对远端结果给出更强结论。

<details>
<summary>查看原文（10行）</summary>

```text
export function formatExecResult(res, { timeoutMs, cancelled = false } = {}) {
  const parts = []
  if (res.stdout) parts.push(String(res.stdout).replace(/\s+$/, ''))
  if (res.stderr) parts.push('-- stderr --\n' + String(res.stderr).replace(/\s+$/, ''))
  if (!parts.length) parts.push('(no output)')
  let text = parts.join('\n')
  if (res.signal === 'TIMEOUT') text += `\n[command timed out after ${timeoutMs}ms]`
  else if (cancelled || res.signal === 'ABORTED') text += '\n[cancelled — the remote command was stopped]'
  else if (res.code !== 0) text += `\n[exit code: ${res.code}]`
  return text
```

</details>

**依据 3 · 源码核查**：[lib/sync.js:150-172](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/sync.js#L150-L172)

冲突、复制和同步基线需要人工读回。

<details>
<summary>查看原文（23行）</summary>

```text
      if (sk && rk === sk && lk && lk === sk) { stats.skippedUnchanged++; return }
      if (!force && sk && rk !== sk && lk && lk !== sk && rk !== lk) {
        stats.conflicts.push({ path: rp, reason: 'both-modified（远端与本地都改过，跳过不覆盖）' })
        return
      }
      if (!force && sk && rk === sk && lk && lk !== sk) {
        // Pull would clobber a local edit; the remote never changed.
        stats.conflicts.push({ path: rp, reason: 'local-modified（本地改过而远端未变；如需覆盖请用 force / rw_push）' })
        return
      }
      if (dryRun) {
        stats.files++
        stats.touched.push(rp)
        nextState[rel] = { size: r.size, mtime: r.mtime }
        return
      }
      try {
        const buf = await callSftp((s) => s.readFile(rp))
        writeFileSync(lp, buf)
        try { utimesSync(lp, new Date(r.mtime * 1000), new Date(r.mtime * 1000)) } catch {}
        stats.files++
        stats.touched.push(rp)
        nextState[rel] = { size: r.size, mtime: r.mtime }
```

</details>

#### 缺口

- 未验证远端实际进程树终止。
  **影响**：不可把本地返回当远端效果确认。
  **进一步探讨**：在隔离账号的无害命令及其子进程上比较取消返回与 SSH 回查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定评估并验证新的回读条件？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前适合观察接线并在低权限测试主机对比只读任务。先确认两边是预期机器、账号和目录，使用 dryRun 与直接 SSH 内容核对。有效权限无法确认、冲突原因不明或取消后远端结果未知时，停止重跑，回原 SSH 查两端。待验证的改进是为有冲突风险的文件增加选择性内容核对，为取消增加独立的远端退出确认。用同一组同尺寸同秒文件及终止后仍运行的测试子进程，比对漏判、回读耗时和网络量；若不能减少误判，维持人工读回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sync.js:39-41](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/sync.js#L39-L41)

现有仅元数据判等可作对照。

```text
const keyOf = (size, mtime) => `${size}:${Math.floor(mtime || 0)}`
const localKey = (st) => (st ? keyOf(st.size, st.mtimeMs / 1000) : null)
const remoteKey = (st) => (st ? keyOf(st.size, st.mtime) : null)
```

**依据 2 · 源码核查**：[lib/pool.js:723-730](https://github.com/flymysql/dsh-remote/blob/6dd1852f55772b5422e77cc145230e971741d28d/lib/pool.js#L723-L730)

当前取消先返回可形成退出未知的验收样例。

```text
                onAbort = () => {
                  if (settled) return
                  exitCode = -1
                  exitSignal = 'ABORTED'
                  try { if (typeof stream.signal === 'function') stream.signal('SIGTERM') } catch {}
                  const hardClose = setTimeout(() => { try { stream.close() } catch {} }, 500)
                  if (typeof hardClose.unref === 'function') hardClose.unref()
                  settle()
```

#### 缺口

- 内容与退出确认改进未验。
  **影响**：实际开销与漏判改善未知。
  **进一步探讨**：隔离对照测读回量、错误成功和重复执行。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
