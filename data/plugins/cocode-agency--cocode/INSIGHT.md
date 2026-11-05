# Cocode

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5c30dde](https://github.com/cocode-agency/cocode/tree/5c30dde7966c42df84b3c108317fc345b013f494)

<!-- BEGIN META -->
[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cocode-agency/cocode)
<!-- END META -->

> **功能**：将 DeepSeek Harness 组装为桌面和终端开发环境，通过 Supervisor 共享宿主。

> **亮点**：[Q01](#research-q01) GUI 和 TUI 使用同一范围的 Host。

> **主要限制**：[Q03](#research-q03) 发行需配套，租约不证明任务已停止。

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
  - [Q01 · 切换桌面和终端时能保留什么？](#detail-section-11)
  - [Q02 · 怎么处理不兼容与退出？](#detail-section-12)
  - [Q03 · 项目是否自带所有后端？](#detail-section-13)
  - [Q04 · 如何低成本验证及退出？](#detail-section-14)
  - [Q05 · 可见租约来源能否减少误停？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在桌面和终端交替工作的开发者可评估共享宿主。

分别启动客户端需要单独管理进程及会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 客户端切换 | 复用会话宿主 | 需要同 scope |
| 租约 | 管理宿主生命周期 | 任务结果另查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 配套版本 | 必需 | 连接 Supervisor | 拒绝不兼容 |
| 模型配置 | 执行任务需要 | 完成推理 | 只能看客户端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立 home 配置版本 | 核对 scope |
| 核验 | 两个客户端切换 | 检查会话 |
| 退出 | 关闭两端 | 查 Host 状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖及模型费用未知 | 安装耗时未知 | 版本配套 |
| 持续 | 模型资源未知 | 维护耗时未知 | 两端共用宿主 |
| 恢复 | 重启资源未知 | 检查租约耗时未知 | 保留工作区 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨端会话 | 有共享宿主协议 | 真实切换未测 |

> **思考**：[Q03](#research-q03) 发行需配套，租约不证明任务已停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) GUI 和 TUI 使用同一范围的 Host。

不兼容的活动宿主有明确拒绝。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发行需配套，租约不证明任务已停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用独立 home 验证两端切换。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的GUI 与 TUI 的宿主复用、租约及版本边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、cocode-host-supervisor/packages/host-supervisor/src/service.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的GUI 与 TUI 的宿主复用、租约及版本边界。未执行目标代码或实际宿主验证。
- 下一步：用正常与残留租约复现实验

**分析版本**

- **仓库**：[cocode-agency/cocode](https://github.com/cocode-agency/cocode)
- **版本号**：未声明（[固定提交 5c30dde](https://github.com/cocode-agency/cocode/tree/5c30dde7966c42df84b3c108317fc345b013f494)）
- **版本日期**：2026-09-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试更清楚的租约诊断。

用正常与残留租约复现实验

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6181 | — | — | 56095 |
| .cjs | source | 8 | 668 | 576 | 59 | — |
| .ts | source | 420 | 59664 | 52457 | 2934 | — |
| .tsx | source | 155 | 23348 | 20693 | 1260 | — |
| .ts | test | 247 | 34840 | 32137 | 310 | — |
| .tsx | test | 2 | 182 | 140 | 7 | — |
| .mjs | source | 72 | 10019 | 8936 | 405 | — |
| .mjs | test | 17 | 2908 | 2679 | 14 | — |
| .md | test | 2 | 153 | — | — | 1671 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/cocode-agency/cocode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：GUI 与 TUI 的宿主复用、租约及版本边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 切换桌面和终端时能保留什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一宿主配置范围内，GUI 与 TUI 可申请接入相同 Host，从而使用相同会话和任务。相比各自启动进程，关键增量是可共享的宿主管理。不同 DSH_HOME 或 profile 不应当视为同一个范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-97](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/README.md#L89-L97)

作者说明双端使用同一 Host

```text
| | |
| --- | --- |
| **Cocode GUI** | A desktop workspace built on Electron. Sessions, files, terminals, and runtime state live on one surface. Diffs and attachments open in a preview panel, so you see exactly what changed before you confirm. |
| **Cocode TUI** | A terminal client for keyboard-first and remote work. SSH into a machine and keep pushing tasks with no graphical environment required. |

Both attach to the same Host through `@cocode-agency/host-supervisor`, so they can share
sessions and task state when they use the same `DSH_HOME`, profile, and Host
configuration scope. Switching between the desktop app and the terminal does
not reset your work within that scope.
```

**依据 2 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:185-222](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L185-L222)

复用、拒绝不兼容和发租约

<details>
<summary>查看原文（38行）</summary>

```text
  private async acquire(request: AcquireRequest, signal: AbortSignal): Promise<{ leaseId: string; expiresAt: string; descriptor: HostDescriptor }> {
    this.cleanupLeases()
    this.logger.log('debug', 'host.lease.acquire.started', { clientKind: request.clientKind, hostKey: hostKey(this.scope), requiredServices: request.requiredServices.join(',') })
    const requestedScope = canonicalizeScope(request.scope)
    if (JSON.stringify(requestedScope) !== JSON.stringify(this.scope)) {
      throw new Error('Host scope does not match this Supervisor scope')
    }
    if (this.hostStopPromise !== null) await this.hostStopPromise
    if (!this.host || !isHostDescriptorCompatible(this.host.descriptor, this.scope, request)) {
      if (this.host && this.leases.size > 0) throw new Error('existing Host is incompatible while leases are active')
      if (this.host) await this.stopHost()
      try {
        await this.startHost(request)
      } catch (error) {
        // A failed first boot must not leave a Supervisor holding the scope
        // lock forever. The next client should be able to start fresh code.
        await this.stop()
        throw error
      }
    }
    const id = makeLeaseId()
    const record = createLeaseRecord({
      leaseId: id,
      clientKind: request.clientKind,
      clientPid: request.clientPid,
      fallbackPid: process.ppid,
      signal,
    })
    if (record === undefined) {
      this.logger.log('info', 'host.lease.acquire.abandoned', { clientKind: request.clientKind })
      if (this.host && this.leases.size === 0) this.armIdleShutdown()
      throw new Error(HOST_ACQUIRE_ABANDONED_MESSAGE)
    }
    this.leases.set(id, record)
    this.persistLease(record)
    if (this.host?.idleTimer) { clearTimeout(this.host.idleTimer); delete this.host.idleTimer }
    this.logger.log('info', 'host.lease.acquired', { clientKind: request.clientKind, leaseId: shortId(id), leaseCount: this.leases.size })
    return { leaseId: id, expiresAt: record.expiresAt, descriptor: this.host!.descriptor }
```

</details>

#### 缺口

- 未运行两端
  **影响**：无法证明连续任务或状态表现
  **进一步探讨**：两端连接同 profile 核对会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎么处理不兼容与退出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

申请租约时，当前 Host 不兼容且仍有租约会报错。续约持久化新截止，释放会移除文件；最后租约消失才安排空闲停止。回收过期租约提供崩溃后的释放路径，不能保证每个任务已取消。

#### 证据与依据

**依据 1 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:185-222](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L185-L222)

分配时的兼容检查

<details>
<summary>查看原文（38行）</summary>

```text
  private async acquire(request: AcquireRequest, signal: AbortSignal): Promise<{ leaseId: string; expiresAt: string; descriptor: HostDescriptor }> {
    this.cleanupLeases()
    this.logger.log('debug', 'host.lease.acquire.started', { clientKind: request.clientKind, hostKey: hostKey(this.scope), requiredServices: request.requiredServices.join(',') })
    const requestedScope = canonicalizeScope(request.scope)
    if (JSON.stringify(requestedScope) !== JSON.stringify(this.scope)) {
      throw new Error('Host scope does not match this Supervisor scope')
    }
    if (this.hostStopPromise !== null) await this.hostStopPromise
    if (!this.host || !isHostDescriptorCompatible(this.host.descriptor, this.scope, request)) {
      if (this.host && this.leases.size > 0) throw new Error('existing Host is incompatible while leases are active')
      if (this.host) await this.stopHost()
      try {
        await this.startHost(request)
      } catch (error) {
        // A failed first boot must not leave a Supervisor holding the scope
        // lock forever. The next client should be able to start fresh code.
        await this.stop()
        throw error
      }
    }
    const id = makeLeaseId()
    const record = createLeaseRecord({
      leaseId: id,
      clientKind: request.clientKind,
      clientPid: request.clientPid,
      fallbackPid: process.ppid,
      signal,
    })
    if (record === undefined) {
      this.logger.log('info', 'host.lease.acquire.abandoned', { clientKind: request.clientKind })
      if (this.host && this.leases.size === 0) this.armIdleShutdown()
      throw new Error(HOST_ACQUIRE_ABANDONED_MESSAGE)
    }
    this.leases.set(id, record)
    this.persistLease(record)
    if (this.host?.idleTimer) { clearTimeout(this.host.idleTimer); delete this.host.idleTimer }
    this.logger.log('info', 'host.lease.acquired', { clientKind: request.clientKind, leaseId: shortId(id), leaseCount: this.leases.size })
    return { leaseId: id, expiresAt: record.expiresAt, descriptor: this.host!.descriptor }
```

</details>

**依据 2 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:385-387](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L385-L387)

续期与释放

```text
  private renew(id: string): { expiresAt: string } { const record = this.leases.get(id); if (!record) throw new Error('unknown lease'); record.expiresAt = new Date(Date.now() + LEASE_TTL_MS).toISOString(); this.persistLease(record); this.logger.log('debug', 'host.lease.renewed', { leaseId: shortId(id) }); return { expiresAt: record.expiresAt } }
  private async release(id: string): Promise<Record<string, never>> { const existed = this.leases.delete(id); rmSync(join(leaseDirectory(this.directory), `${id}.json`), { force: true }); this.logger.log(existed ? 'info' : 'warn', existed ? 'host.lease.released' : 'host.lease.release.unknown', { leaseId: shortId(id), leaseCount: this.leases.size }); if (this.leases.size === 0 && this.host) this.armIdleShutdown(); return {} }
  private armIdleShutdown(): void { if (!this.host || this.host.idleTimer) return; const timeoutMs = Number(process.env.COCODE_HOST_IDLE_TIMEOUT_MS ?? 20_000); this.logger.log('info', 'dsh.host.idle-shutdown.armed', { timeoutMs }); this.host.idleTimer = setTimeout(() => { void this.stopHost() }, timeoutMs); this.host.idleTimer.unref?.() }
```

**依据 3 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:420-441](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L420-L441)

过期清理及恢复记录

<details>
<summary>查看原文（22行）</summary>

```text
    for (const record of this.leases.values()) {
      if (isLeaseActive(record, now, isProcessAlive)) continue
      removed = true
      this.leases.delete(record.leaseId)
      rmSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), { force: true })
      this.logger.log('warn', 'host.lease.expired', { leaseId: shortId(record.leaseId), clientKind: record.clientKind })
    }
    if (removed && this.leases.size === 0 && this.host) this.armIdleShutdown()
  }
  private loadLeases(): void {
    const now = Date.now()
    for (const file of readdirSync(leaseDirectory(this.directory), { withFileTypes: true })) {
      if (!file.name.endsWith('.json')) continue
      const path = join(leaseDirectory(this.directory), file.name)
      try {
        const record = JSON.parse(readFileSync(path, 'utf8')) as LeaseRecord
        if (isLeaseActive(record, now, isProcessAlive)) this.leases.set(record.leaseId, record)
        else rmSync(path, { force: true })
      } catch { rmSync(path, { force: true }) }
    }
  }
  private persistLease(record: LeaseRecord): void { writeFileSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), JSON.stringify(record) + '\n', { mode: 0o600 }) }
```

</details>

#### 缺口

- 异常进程和断线未实测
  **影响**：不能断言恢复耗时
  **进一步探讨**：杀客户端并对照 PID 与租约

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 项目是否自带所有后端？

**研究主题**：缺陷与关键质疑

#### 完整回答

README 说明固定 DSH npm 依赖且当前无托管后端源码。GUI、TUI 与 Supervisor 需要同一发行线；共享 scope 是过程组织，不是多租户隔离。锁定版本限制第三方环境自由升级。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-29](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/README.md#L24-L29)

预览和发布范围

```text
> **Project status:** Developer preview. Cocode is built on the DeepSeek Harness
> developer preview. It is an independent distribution, not an official DeepSeek
> product, and upstream compatibility may change. The repository supports source
> builds on macOS, Windows, and Linux; the current release scripts target macOS
> and Windows artifacts, and this repository does not include a hosted backend or
> a vendored Harness checkout.
```

**依据 2 · 作者声明**：[README.md:39-45](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/README.md#L39-L45)

发行版本配对

```text
The published TUI package installs the matching `@cocode-agency/host-supervisor`
automatically. For every release, keep `@cocode-agency/tui` and
`@cocode-agency/host-supervisor` on the same version line; do not mix versions from
different releases. GUI installers are downloaded separately from the matching
GitHub Release and are not installed through npm. The current repository is a
developer preview, so release availability and upstream Harness compatibility
can change.
```

**依据 3 · 作者声明**：[README.md:122-140](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/README.md#L122-L140)

DSH 依赖及 scope

<details>
<summary>查看原文（19行）</summary>

````text
The runtime itself is not vendored here. `@cocode-agency/host-supervisor` pins
`@deepseek-ai/dsh` from npm and owns the Supervisor service, the local IPC and
lease protocol, runtime-slot materialization, and the Cocode JSON-RPC Host
plugin. GUI and TUI never launch a Harness process themselves — they acquire a
lease for a canonical `DSH_HOME + profile + Host configuration` scope and connect
to the endpoint the Host advertises.

```text
Cocode GUI ─┐
            ├─→ @cocode-agency/host-supervisor ─→ @deepseek-ai/dsh (npm) ─→ models · tools · sessions
Cocode TUI ─┘
```

### Upgrading DSH

DSH is released as one exact release train in Cocode. The canonical target is
`cocode-host-supervisor/package.json`'s `@deepseek-ai/dsh` dependency; the GUI
client packages and every `packages/cocode/*` plugin peer dependency must use
that same version.
````

</details>

**依据 4 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:448-455](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L448-L455)

主动停止限制

```text
    if (!force && this.leases.size > 0) {
      throw new Error(`Cannot stop Host while ${this.leases.size} client lease(s) are active. Re-run with --force after closing GUI/TUI clients.`)
    }
    if (force) {
      for (const record of this.leases.values()) rmSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), { force: true })
      this.leases.clear()
    }
    this.stopped = true
```

#### 缺口

- 未核对 release 可得性和外部模型
  **影响**：无法确认开箱即用
  **进一步探讨**：固定成套包验证依赖

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低成本验证及退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在独立 DSH_HOME 配置一次任务，先同版本验证 TUI/GUI 能看到会话，再断开其中一端检查另一端。模型凭据、客户端和版本维护时间未知。退出关闭客户端，并观察最后租约回收后宿主状态，保留原工作区。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-45](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/README.md#L31-L45)

作者安装和版本范围

<details>
<summary>查看原文（15行）</summary>

```text
## Install and try it in five minutes

| Use case | Install | Start |
| --- | --- | --- |
| **GUI** | Download the installer for your platform from the [GitHub Releases](https://github.com/cocode-agency/cocode/releases) page. | Launch Cocode, then choose Cocode Pro with hosted Nut credits or your own DeepSeek-compatible key. |
| **TUI** | Node.js `22.19.x` or later (`24+` is also supported), then `npm install --global @cocode-agency/tui`. | Run `cocode doctor`, then `cocode`. A real terminal is required. |
| **From source** | Follow the component-specific pnpm instructions below. | Use `make dev gui` or `make dev tui`. |

The published TUI package installs the matching `@cocode-agency/host-supervisor`
automatically. For every release, keep `@cocode-agency/tui` and
`@cocode-agency/host-supervisor` on the same version line; do not mix versions from
different releases. GUI installers are downloaded separately from the matching
GitHub Release and are not installed through npm. The current repository is a
developer preview, so release availability and upstream Harness compatibility
can change.
```

</details>

**依据 2 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:385-387](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L385-L387)

释放租约

```text
  private renew(id: string): { expiresAt: string } { const record = this.leases.get(id); if (!record) throw new Error('unknown lease'); record.expiresAt = new Date(Date.now() + LEASE_TTL_MS).toISOString(); this.persistLease(record); this.logger.log('debug', 'host.lease.renewed', { leaseId: shortId(id) }); return { expiresAt: record.expiresAt } }
  private async release(id: string): Promise<Record<string, never>> { const existed = this.leases.delete(id); rmSync(join(leaseDirectory(this.directory), `${id}.json`), { force: true }); this.logger.log(existed ? 'info' : 'warn', existed ? 'host.lease.released' : 'host.lease.release.unknown', { leaseId: shortId(id), leaseCount: this.leases.size }); if (this.leases.size === 0 && this.host) this.armIdleShutdown(); return {} }
  private armIdleShutdown(): void { if (!this.host || this.host.idleTimer) return; const timeoutMs = Number(process.env.COCODE_HOST_IDLE_TIMEOUT_MS ?? 20_000); this.logger.log('info', 'dsh.host.idle-shutdown.armed', { timeoutMs }); this.host.idleTimer = setTimeout(() => { void this.stopHost() }, timeoutMs); this.host.idleTimer.unref?.() }
```

**依据 3 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:448-455](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L448-L455)

停止前核对活动客户端

```text
    if (!force && this.leases.size > 0) {
      throw new Error(`Cannot stop Host while ${this.leases.size} client lease(s) are active. Re-run with --force after closing GUI/TUI clients.`)
    }
    if (force) {
      for (const record of this.leases.values()) rmSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), { force: true })
      this.leases.clear()
    }
    this.stopped = true
```

#### 缺口

- 未装客户端或宿主
  **影响**：实际开销未知
  **进一步探讨**：验证使用与关闭顺序

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可见租约来源能否减少误停？

**研究主题**：新假设与验证

#### 完整回答

对照现有诊断和给出持有者类别、期限的诊断，让操作者处理一个残留 Host。衡量误停、等待和信息披露；若无改善或暴露会话信息则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[cocode-host-supervisor/packages/host-supervisor/src/service.ts:441-454](https://github.com/cocode-agency/cocode/blob/5c30dde7966c42df84b3c108317fc345b013f494/cocode-host-supervisor/packages/host-supervisor/src/service.ts#L441-L454)

现有诊断、停止和租约

<details>
<summary>查看原文（14行）</summary>

```text
  private persistLease(record: LeaseRecord): void { writeFileSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), JSON.stringify(record) + '\n', { mode: 0o600 }) }
  private writeDescriptor(descriptor: HostDescriptor): void { const temp = `${descriptorPath(this.directory)}.${process.pid}.tmp`; writeFileSync(temp, JSON.stringify(descriptor, null, 2) + '\n', { mode: 0o600 }); renameSync(temp, descriptorPath(this.directory)) }
  private readDescriptor(): HostDescriptor | null { try { return JSON.parse(readFileSync(descriptorPath(this.directory), 'utf8')) as HostDescriptor } catch { return null } }
  private doctor(): Record<string, unknown> { return { supervisorProtocolRevision: SUPERVISOR_PROTOCOL_REVISION, supervisorBuildRevision: SUPERVISOR_BUILD_REVISION, scope: this.scope, descriptor: this.readDescriptor(), leaseCount: this.leases.size, pid: process.pid } }
  stop(force = true): Promise<void> {
    if (this.stopPromise !== null) return this.stopPromise
    this.cleanupLeases()
    if (!force && this.leases.size > 0) {
      throw new Error(`Cannot stop Host while ${this.leases.size} client lease(s) are active. Re-run with --force after closing GUI/TUI clients.`)
    }
    if (force) {
      for (const record of this.leases.values()) rmSync(join(leaseDirectory(this.directory), `${record.leaseId}.json`), { force: true })
      this.leases.clear()
    }
```

</details>

#### 缺口

- 未做操作者对照
  **影响**：价值未证
  **进一步探讨**：用正常与残留租约复现实验

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
