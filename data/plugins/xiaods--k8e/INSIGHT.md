# K8E

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d06b5f0](https://github.com/xiaods/k8e/tree/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737)

<!-- BEGIN META -->
[![GitHub ★ 512](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=512&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaods/k8e)
<!-- END META -->

> **功能**：自托管 AI Agent 沙箱平台，提供会话、执行、文件与 DSH 接入

> **亮点**：[Q02](#research-q02) 的实际贡献是把文件、执行和生命周期放入同一会话所有权，减少接入方自行维护上下文；底层隔离与集群能力来自所选运行时。

> **主要限制**：[Q03](#research-q03) 的文件适配保留工作区外绝对路径的本机访问，销毁还依赖 GC 兜底，不能把统一入口等同于全访问隔离或确定回收。

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
  - [Q01 · 谁使用什么交付物，根组件是什么类型？](#detail-section-11)
  - [Q02 · 文件与执行如何共享会话，相比逐命令启动有什么增量？](#detail-section-12)
  - [Q03 · 所有文件与故障路径都受远端隔离吗？](#detail-section-13)
  - [Q04 · 启动、持续维护与退出负担是什么？](#detail-section-14)
  - [Q05 · 谁可试用，如何证伪共享会话减少接入摩擦？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 Linux 运维能力的团队，为 AI 任务提供持续沙箱工作区；根组件是基础设施，DSH 接入位于子目录。

对照逐命令容器或人工调用远端 CLI；比较会话一致性与恢复负担，不宣称隔离运行时原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话与执行适配 | 远端持久工作区操作 | 已部署网关；本机绝对路径仍有本地访问分支 |

**流程与依赖**

| 依赖 | 用途与边界 |
|---|---|
| Linux、隔离运行时、网关 | 平台启动必要；失效退回既有容器/CLI |
| DSH 与 Cordis 接口 | 子插件必需，版本匹配未实测 |
| 端点与证书 | gRPC 能力必要，CLI 普通能力不等价 |

| 执行者 | 操作与验收 | 失败处理 |
|---|---|---|
| 运维 | 部署运行时、网关并检查状态 | 查集群与证书 |
| 用户 | 配置独立 profile，读写同一工作区 | 对照 sessionId 与实际路径 |
| 运维 | 销毁并核对 Pod/PVC | 手动确认 GC 与导出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Linux主机、网络和存储，金额未知 | 部署运行时/网关、证书和DSH接线，时长未知 | 面向已有运维能力团队，不能由单二进制推算60秒完成 |
| 持续使用 | 暖池、PVC和网关常驻资源未知 | 维护证书、监控会话与本机/远程路径 | 无单位合格任务资源与人工测量 |
| 失败恢复 | 孤留Pod/PVC可能继续占用，金额未知 | 核对会话销毁、断连结果和GC | destroy异常被吞掉，需集群回读 |
| 退出 | 导出工作区和留存资源未知 | 停适配并核回收，退既有CLI | 禁用插件不等于远端已回收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 同工作区文件与执行 | 共享owner/getSession接线 | 真实宿主会话隔离与故障后归属 |
| 延迟创建和并发合并 | sessionInFlight与失败TTL | 实际启动时延及端到端收益 |
| 隔离与回收 | 作者运行时主张、客户端释放代码 | 跨会话隔离、实际Pod/PVC回收 |

> **思考**：[Q03](#research-q03) 的文件适配保留工作区外绝对路径的本机访问，销毁还依赖 GC 兜底，不能把统一入口等同于全访问隔离或确定回收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的实际贡献是把文件、执行和生命周期放入同一会话所有权，减少接入方自行维护上下文；底层隔离与集群能力来自所选运行时。

单飞创建与故障负缓存可借鉴；双路径访问和尽力回收要求明确状态归属。参见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的文件适配保留工作区外绝对路径的本机访问，销毁还依赖 GC 兜底，不能把统一入口等同于全访问隔离或确定回收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议已有运维条件的团队以独立 profile 试用读写、断连和销毁；发生本机误写、串扰或残留会话则停止并退回 CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

共享会话接线有源码支持；安全、部署速度、延迟及新设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/deepseek-harness/README.md、plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts、plugins/deepseek-harness/packages/dsh-k8e-sandbox-tool/src/index.ts、plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：实际检查根 README、DSH 插件族说明、owner、工具和文件适配。未全面审计网关、运行时或底层集群。 本轮重新读取固定提交中所列关键入口、状态与失败路径，研究深度仍为源码核查。
- 下一步：仅固定源码核查；未安装、未运行目标代码，未进行真实宿主、性能或安全验收。

**分析版本**

- **仓库**：[xiaods/k8e](https://github.com/xiaods/k8e)
- **版本号**：未声明（[固定提交 d06b5f0](https://github.com/xiaods/k8e/tree/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出未验证的位置与会话归属可见性假设；同任务比较错误归属、人工核对和残留资源，若不改善则推翻。

仅固定源码核查；未安装、未运行目标代码，未进行真实宿主、性能或安全验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 16 | 3284 | 2479 | 522 | — |
| .md | source | 47 | 14978 | — | — | 113471 |
| .tsx | source | 3 | 672 | 558 | 46 | — |
| .mjs | source | 3 | 400 | 285 | 98 | — |
| .mjs | test | 7 | 891 | 682 | 123 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/xiaods/k8e/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：K8E 是否以共享会话和能力适配降低自托管隔离执行的接入摩擦？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用什么交付物，根组件是什么类型？

**研究主题**：场景与需求

#### 完整回答

根组件是供基础设施维护者部署的沙箱平台，而非单个 DSH 插件。README 将 Linux 主机、隔离运行时、暖池、网关和持久工作区组合成平台；DSH 插件族只是 plugins/deepseek-harness 下的一条接入路径。合格任务应同时验收文件读写和命令结果属于同一远端工作区，并确认不同会话隔离。已有 Docker/容器或人工远端执行可完成单次命令；平台的潜在增量是持续会话与统一接入，作者声称的60秒部署和低延迟未在本轮测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-58](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/README.md#L30-L58)

作者定义平台、隔离运行时与暖池能力

<details>
<summary>查看原文（29行）</summary>

```text
**K8E** is the **Open Source Agentic AI Sandbox Matrix** — a self-hosted sandbox platform for running secure, isolated AI agent workloads at scale, packaged as a single binary under 100MB.

As autonomous AI agents increasingly generate and execute untrusted code, robust sandboxing infrastructure is no longer optional. K8E ships everything needed to spin up a production-grade cluster in under 60 seconds, with first-class primitives for agent isolation, resource governance, and persistent execution environments — purpose-built for the AI era.

> 🔒 **One cluster. Many agents. Zero trust between them.**

### Sandbox Capabilities

| Capability | Description |
|---|---|
| 🔒 **Hardware Isolation** | Pluggable runtimes: gVisor (default), Kata Containers, Firecracker microVM |
| 🌐 **Network Policies** | Bundled Cilium enforces the standard `networking.k8s.io/v1` NetworkPolicy API by default — plus eBPF `toFQDNs` egress control per session; `allowed_hosts` enforced via `--cilium-dns-proxy` (KIP-16 M10) |
| ⚖️ **Resource Quotas** | CPU/memory caps per agent session to prevent runaway costs |
| 💾 **Persistent Workspaces** | Every session carries a PVC workspace (1Gi local-path by default); warm pods boot with their claim pre-provisioned — fast start *and* durable files |
| 🧠 **Warm Pool** | Pre-booted sandbox pods for sub-500ms session claim latency; application-layer readiness handshake, adaptive sizing, per-session background-run caps |
| 📸 **Content-Addressed Snapshots** | SHA-256 CAS layerstore with zstd compression, chunked multi-layer manifests, incremental `--base` restore, server-side registry, autosquash (KIP-16 M2) |
| 📜 **Exec Transcripts** | File-backed, windowed, offset-resumable command transcripts — `k8e-sandbox-cli log` (KIP-16 M4) |
| 📊 **Observability** | Prometheus metrics, disk-only NDJSON event stream, process topology — `events` / `ps` CLI (KIP-16 M5) |
| 🔄 **Sub-agent Reuse** | Sub-agents share the parent pod + workspace; isolated reset (KIP-16 M1) |
| 🧾 **CLI Catalog** | Machine-readable command/flag surface for SDK generation — `catalog` (KIP-16 M9) |
| 🤝 **agent-sandbox compatible** | Works with [`kubernetes-sigs/agent-sandbox`](https://github.com/kubernetes-sigs/agent-sandbox) |
| 🔄 **SKILL + CLI + MCP** | AI agents (Claude Code, Codex, Pi) connect via `k8e-sandbox-cli` or the `/k8e-sandbox` skill |

📚 **Full documentation: [k8e.sh/guide](https://k8e.sh/guide/what-is-k8e.html)** — guides, CLI reference, and examples live on the official site.

---

## 🏗️ Architecture

```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/README.md:3-16](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/README.md#L3-L16)

目录明确列 owner、fs、subprocess、tool 与 bundle，证明插件族是子范围

<details>
<summary>查看原文（14行）</summary>

```text
Out-of-tree DeepSeek Harness plugin family (KIP-20). These packages let a dsh
profile route its filesystem and subprocess execution world into k8e-sandbox
via `dsh plugin --profile <name> add`.

## Packages

| Package | Role | `ctx` key |
|---|---|---|
| [`@k8e-sandbox/dsh-k8e-sandbox`](packages/dsh-k8e-sandbox) | Sandbox owner service (session lifecycle + shared CLI/gRPC client) | `ctx.k8eSandbox` |
| [`@k8e-sandbox/dsh-k8e-sandbox-client`](packages/dsh-k8e-sandbox-client) | Transport: `CliK8eClient` (Phase 1) + `GrpcK8eClient` (Phase 2) | library |
| [`@k8e-sandbox/dsh-k8e-sandbox-fs`](packages/dsh-k8e-sandbox-fs) | Filesystem seam provider | `ctx.fs` |
| [`@k8e-sandbox/dsh-k8e-sandbox-subprocess`](packages/dsh-k8e-sandbox-subprocess) | Subprocess seam provider (streaming exec + `spawnTerminal`) | `ctx.subprocess` |
| [`@k8e-sandbox/dsh-k8e-sandbox-tool`](packages/dsh-k8e-sandbox-tool) | Model-surface tools (session status/destroy, exec, background + poll, service expose/unexpose, egress allow-hosts) | `ctx.tools` |
| [`@k8e-sandbox/dsh-k8e-sandbox-bundle`](packages/dsh-k8e-sandbox-bundle) | Installable bundle (`dsh.bundle.patch` → `cordis.patch.yml`) | — |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件与执行如何共享会话，相比逐命令启动有什么增量？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

owner 以 getSession 延迟创建、sessionInFlight 合并并发创建、sessionId 复用同一会话。配置解析后选择常驻 gRPC 或 CLI；exec 工具调用 runtime.getSession() 并显式传入 sessionId。文件适配同样从 owner 取得会话，因而可在接口层减少命令与文件分属不同容器的接线错误。这里可确认的是共享客户端与会话所有权，不是 gVisor、Kata 或 Firecracker 的原创隔离机制，也不是已测性能优势。一次性容器任务没有持续工作区需求时，该增量可能不值得额外网关。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:115-139](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L115-L139)

端点驱动 gRPC/CLI 传输选择

<details>
<summary>查看原文（25行）</summary>

```text
    // Resolve the gateway: explicit config → env → CLI profiles.yaml (KIP-17).
    const transportCfg = resolveSandboxTransport({
      ...(config.endpoint !== undefined ? { endpoint: config.endpoint } : {}),
      ...(config.certDir !== undefined ? { certDir: config.certDir } : {}),
      ...(config.profile !== undefined ? { profile: config.profile } : {}),
    })
    this.endpoint = transportCfg?.endpoint
    this.endpointSource = transportCfg?.source
    this.endpointProfile = transportCfg?.profile
    this.certDir = transportCfg?.certDir

    if (transportCfg !== undefined) {
      // Persistent gRPC connection: fs/exec ops become RPCs, no per-op CLI spawn.
      this.grpcClient = new GrpcK8eClient({
        endpoint: transportCfg.endpoint,
        ...(transportCfg.certDir !== undefined ? { certDir: transportCfg.certDir } : {}),
      })
      this.transport = this.grpcClient
    } else {
      this.grpcClient = undefined
      this.transport = new CliK8eClient({
        ...(process.env.K8E_SANDBOX_CLI_BIN !== undefined ? { bin: process.env.K8E_SANDBOX_CLI_BIN } : {}),
        ...(config.profile !== undefined ? { profile: config.profile } : {}),
        ...(config.endpoint !== undefined ? { endpoint: config.endpoint } : {}),
      })
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:165-195](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L165-L195)

共享在途创建与失败负缓存

<details>
<summary>查看原文（31行）</summary>

```text
  async getSession(): Promise<string> {
    if (this.disposed) throw new Error('k8e sandbox service is disposing')
    if (this.sessionId !== undefined) return this.sessionId
    const now = Date.now()
    if (this.sessionUnavailableUntil > now) {
      const retryIn = Math.ceil((this.sessionUnavailableUntil - now) / 1000)
      throw new Error(`k8e sandbox: session unavailable (gateway unreachable), retry in ${retryIn}s`)
    }
    if (this.sessionInFlight !== undefined) return this.sessionInFlight
    this.sessionInFlight = this.createSessionOnce().finally(() => {
      this.sessionInFlight = undefined
    })
    return this.sessionInFlight
  }

  private async createSessionOnce(): Promise<string> {
    try {
      const created = await this.transport.createSession({
        runtimeClass: this.effectiveRuntimeClass,
        ...(this.config.tenant !== undefined ? { tenant: this.config.tenant } : {}),
        ...(this.config.allowedHosts !== undefined ? { allowedHosts: this.config.allowedHosts } : {}),
      })
      if (this.disposed) {
        await this.transport.destroySession(created.sessionId).catch(() => undefined)
        throw new Error('k8e sandbox service is disposing')
      }
      this.sessionId = created.sessionId
      return this.sessionId
    } catch (err) {
      this.sessionUnavailableUntil = Date.now() + this.config.sessionFailureTtlMs
      throw err
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox-tool/src/index.ts:93-123](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox-tool/src/index.ts#L93-L123)

exec 获取共享 sessionId 后返回结构化结果

<details>
<summary>查看原文（31行）</summary>

```text
    ctx.tools.register(defineTool({
      name: 'k8e_sandbox_exec',
      description: 'Run a command in the k8e sandbox session and return its output, exit code and duration. Use for quick foreground checks; use k8e_sandbox_run_background for long tasks.',
      parameters: {
        code: { type: 'string', required: true, description: 'Command or code to run' },
        lang: { type: 'string', description: 'Language hint: bash (default), python, node, ts' },
        timeout: { type: 'number', description: 'Timeout in seconds' },
      },
      output: {
        schema: resultSchema({
          ...execResultProps,
        }),
        render: renderValue,
      },
      async execute(args) {
        const client = runtime().getClient()
        const result = await client.run(args.code, {
          ...(args.lang !== undefined ? { lang: args.lang } : {}),
          ...(args.timeout !== undefined ? { timeout: args.timeout } : {}),
          sessionId: await runtime().getSession(),
        })
        // The transport result carries extra fields (sessionId/status/language);
        // the tool schema is strict (additionalProperties: false), so return
        // exactly the declared shape.
        return {
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.exitCode,
          durationMs: Number(result.durationMs) || 0,
          truncated: result.truncated,
        }
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts:65-85](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts#L65-L85)

文件适配复用 owner 并区分工作区路径

<details>
<summary>查看原文（21行）</summary>

```text
  private async runtime(): Promise<K8eSandboxRuntime> {
    return this.owner()
  }

  private async session(): Promise<string> {
    return (await this.runtime()).getSession()
  }

  private display(path: string, cwd?: string): string {
    return posix.resolve(cwd ?? this.owner().cwd, path)
  }

  /**
   * True when the path lives in the sandbox workspace. Relative paths resolve
   * under the sandbox root; absolute paths must be under it. Host-absolute
   * paths (preflight: AGENTS.md / skills discovery) stay on the local disk.
   */
  private isSandboxPath(path: string): boolean {
    if (!posix.isAbsolute(path)) return true
    const root = this.owner().cwd
    return path === root || path.startsWith(`${root}/`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 所有文件与故障路径都受远端隔离吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能把该接入解释成所有文件访问均沙箱化：fs 对工作区外的绝对路径保留本机访问，目的是使 AGENTS.md 与 Skill 发现不等待远端往返。这是明确的设计边界，宿主端权限仍需单独约束。销毁采用尽力执行并吞掉异常，注释依赖暖池 GC 兜底；因此退出成功不能直接证明 Pod 已回收。显式 gRPC 专属操作在无端点时会抛错，即便 CLI 路径可执行普通命令。负缓存避免创建风暴但也使故障后的即时重试受 TTL 影响。上述实现有可复用的单飞与负缓存设计，但不构成安全验收。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts:1-15](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts#L1-L15)

说明本地路径保留目的

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * k8e-sandbox Service Provider for the filesystem capability seam.
 *
 * Two path worlds, one provider:
 * - Workspace paths (relative, or under the sandbox root e.g. `/workspace`)
 *   live in the sandbox pod and go through the shared transport (persistent
 *   gRPC when an endpoint is resolved — no per-op CLI spawn).
 * - Host-absolute paths outside the sandbox root (e.g. `/Users/...` used by
 *   agent-instructions / skill discovery preflight) stay on the local disk:
 *   AGENTS.md / skills discovery must not pay a pod round trip before the
 *   first model request (KIP-20 perf follow-up).
 *
 * listDir uses the gateway's ListFiles entry facts (type/size) when present —
 * no per-child stat — and falls back to a single exec probe per child only
 * when the gateway predates entry facts.
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts:77-85](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts#L77-L85)

绝对路径分流条件

```text
  /**
   * True when the path lives in the sandbox workspace. Relative paths resolve
   * under the sandbox root; absolute paths must be under it. Host-absolute
   * paths (preflight: AGENTS.md / skills discovery) stay on the local disk.
   */
  private isSandboxPath(path: string): boolean {
    if (!posix.isAbsolute(path)) return true
    const root = this.owner().cwd
    return path === root || path.startsWith(`${root}/`)
```

**依据 3 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:142-155](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L142-L155)

销毁异常吞掉并关闭连接

<details>
<summary>查看原文（14行）</summary>

```text
    ctx.effect(() => async () => {
      this.disposed = true
      // Always release the persistent gRPC connection, even when no session
      // was ever assigned (disposal before first use must not leak the
      // channel; the session pod is also reclaimed by the warm-pool GC).
      if (this.sessionId !== undefined) {
        try {
          await this.transport.destroySession(this.sessionId)
        } catch (_destroyFailure) {
          // Best-effort: the session pod is also reclaimed by the warm-pool GC.
        }
      }
      this.transport.close?.()
    }, 'k8e sandbox teardown')
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:224-233](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L224-L233)

gRPC 专属能力要求已解析端点

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * Return the direct gRPC client for the terminal primitive. Requires a
   * resolved endpoint (explicit, env, or profile).
   * @throws when no endpoint is configured.
   */
  getGrpcClient(): GrpcK8eClient {
    if (this.grpcClient === undefined) {
      throw new Error('k8e sandbox: gRPC terminal requires an endpoint (config, K8E_SANDBOX_ENDPOINT, or profiles.yaml)')
    }
    return this.grpcClient
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续维护与退出负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

平台需要 Linux、隔离运行时和可达网关；DSH 适配另外需要匹配宿主类型、包及端点/证书配置。默认 cwd=/workspace、runtimeClass=gvisor 不代表环境已满足。用户负责挑选工作区、验证本机路径访问和会话销毁，维护者负责集群、证书、PVC 与 GC。

| 阶段 | 现金/资源 | 人工与失败处理 |
|---|---|---|
| 首次 | Linux 主机、存储、网络；金额未知 | 部署运行时与网关、配置 DSH，时长未测 |
| 持续 | 暖池与 PVC 常驻资源，未测 | 监控会话与证书，确认状态归属 |
| 失败/退出 | 孤留 Pod/PVC 可能继续占资源 | 核对销毁结果与集群回收，导出所需文件 |

一次合格隔离任务的现金与人工成本都缺测量，不能由单二进制宣传推算总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-120](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/README.md#L98-L120)

作者给出运行时安装和 CLI 检验步骤

<details>
<summary>查看原文（23行）</summary>

````text

wget ${URL}/gvisor.tar.zstd ${URL}/gvisor.tar.zstd.sha512
sha512sum -c gvisor.tar.zstd.sha512   # must print OK
sudo tar --zstd -xf gvisor.tar.zstd -C /usr/local/bin
```

> K8E detects `runsc` at startup and automatically injects the gVisor stanza into its containerd config. Do **not** run `runsc install` — K8E manages its own containerd configuration.

> Need stronger isolation? Kata Containers and Firecracker are covered in the [Sandbox Runtime Setup guide](https://k8e.sh/guide/sandbox-runtime-setup.html).

### Step 2 — Install K8E

```bash
curl -sfL https://k8e.sh/install.sh | sh -
```

### Step 3 — Verify the Sandbox

```bash
k8e-sandbox-cli status        # -> {"available": true, ...}
k8e-sandbox-cli run 'echo hello from the sandbox'
```

````

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:65-75](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L65-L75)

实际配置默认值

<details>
<summary>查看原文（11行）</summary>

```text
  static Config: z<Config> = z.object({
    endpoint: z.string(),
    profile: z.string(),
    certDir: z.string(),
    cwd: z.string().default('/workspace'),
    runtimeClass: z.string().default('gvisor'),
    tenant: z.string(),
    allowedHosts: z.array(z.string()),
    pauseOnDispose: z.boolean().default(false),
    sessionFailureTtlMs: z.number().default(10_000),
  })
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/README.md:48-65](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/README.md#L48-L65)

开发依赖和宿主类型解析条件

<details>
<summary>查看原文（18行）</summary>

````text
One-time setup:

```sh
npm install               # devDependencies: esbuild + @grpc/grpc-js + @grpc/proto-loader
scripts/setup-links.sh    # symlink @deepseek-ai/* -> the dsh checkout's lib/
npm test                  # bundle + run tests/*.test.mjs
```

`npm install` prunes extraneous `node_modules` symlinks, so re-run
`scripts/setup-links.sh` after any reinstall. `DSH_CHECKOUT` overrides the dsh
path (default `../../../deepseek-harness`).

## Typecheck

The TypeScript packages target dsh's in-box types (`@deepseek-ai/dsh-fs`,
`@deepseek-ai/dsh-subprocess`, `@deepseek-ai/cordis`, `@deepseek-ai/schemastery`),
which resolve from the dsh installation at profile boot time — not from this
workspace's `node_modules`. To typecheck against a local dsh checkout:
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用，如何证伪共享会话减少接入摩擦？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有 Linux 集群和隔离运维能力、需要持续远端工作区的团队可在非敏感样本上试用；偶发单命令用户优先保留现有容器流程。由共享 owner 与本地路径边界推导的未验证假设是：显式展示每次访问的执行位置及会话归属，可减少误把本机文件当作远端文件的操作错误。最小验证用相同文件读写、命令、断连与销毁任务，比较现有 CLI 流程及适配后流程的错误归属次数、人工核对时间和残留资源。若错误未减少，或恢复时间增加抵消便利，应否定此设计增量并退回 CLI。任何隔离串扰、非预期本机写入或销毁后会话仍活跃都应立即停止扩大使用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts:77-85](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox-fs/src/index.ts#L77-L85)

双路径世界提供位置混淆的可检验机制依据

```text
  /**
   * True when the path lives in the sandbox workspace. Relative paths resolve
   * under the sandbox root; absolute paths must be under it. Host-absolute
   * paths (preflight: AGENTS.md / skills discovery) stay on the local disk.
   */
  private isSandboxPath(path: string): boolean {
    if (!posix.isAbsolute(path)) return true
    const root = this.owner().cwd
    return path === root || path.startsWith(`${root}/`)
```

**依据 2 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:165-195](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L165-L195)

会话复用支持比较实验对象

<details>
<summary>查看原文（31行）</summary>

```text
  async getSession(): Promise<string> {
    if (this.disposed) throw new Error('k8e sandbox service is disposing')
    if (this.sessionId !== undefined) return this.sessionId
    const now = Date.now()
    if (this.sessionUnavailableUntil > now) {
      const retryIn = Math.ceil((this.sessionUnavailableUntil - now) / 1000)
      throw new Error(`k8e sandbox: session unavailable (gateway unreachable), retry in ${retryIn}s`)
    }
    if (this.sessionInFlight !== undefined) return this.sessionInFlight
    this.sessionInFlight = this.createSessionOnce().finally(() => {
      this.sessionInFlight = undefined
    })
    return this.sessionInFlight
  }

  private async createSessionOnce(): Promise<string> {
    try {
      const created = await this.transport.createSession({
        runtimeClass: this.effectiveRuntimeClass,
        ...(this.config.tenant !== undefined ? { tenant: this.config.tenant } : {}),
        ...(this.config.allowedHosts !== undefined ? { allowedHosts: this.config.allowedHosts } : {}),
      })
      if (this.disposed) {
        await this.transport.destroySession(created.sessionId).catch(() => undefined)
        throw new Error('k8e sandbox service is disposing')
      }
      this.sessionId = created.sessionId
      return this.sessionId
    } catch (err) {
      this.sessionUnavailableUntil = Date.now() + this.config.sessionFailureTtlMs
      throw err
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts:142-155](https://github.com/xiaods/k8e/blob/d06b5f0b58abb06f61c7dd93df3dcddcf0bf8737/plugins/deepseek-harness/packages/dsh-k8e-sandbox/src/index.ts#L142-L155)

回收兜底决定停止判据

<details>
<summary>查看原文（14行）</summary>

```text
    ctx.effect(() => async () => {
      this.disposed = true
      // Always release the persistent gRPC connection, even when no session
      // was ever assigned (disposal before first use must not leak the
      // channel; the session pod is also reclaimed by the warm-pool GC).
      if (this.sessionId !== undefined) {
        try {
          await this.transport.destroySession(this.sessionId)
        } catch (_destroyFailure) {
          // Best-effort: the session pod is also reclaimed by the warm-pool GC.
        }
      }
      this.transport.close?.()
    }, 'k8e sandbox teardown')
```

</details>

#### 缺口

- 位置与会话收据能否减少错误归属及人工核对时间没有对照证据。
  **影响**：不能把共享会话机制或未来收据设计表述为已验证收益。
  **进一步探讨**：用同文件/断连/销毁故障集比较CLI和候选收据，错误归属未降或总恢复时间增加就否定。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
