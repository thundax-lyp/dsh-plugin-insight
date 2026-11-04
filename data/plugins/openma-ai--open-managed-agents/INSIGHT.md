# Open Managed Agents

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5a2e522](https://github.com/openma-ai/open-managed-agents/tree/5a2e5221780c6a021be8b8ece8172a6cf1903bc3)

<!-- BEGIN META -->
[![GitHub ★ 343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/open-managed-agents)
<!-- END META -->

> **功能**：提供自托管 Agent 会话、工具执行和恢复基础设施。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将执行生命周期和可插拔组件组成平台，并给会话授权加入当前 claim 检查。

> **主要限制**：[Q03](#research-q03) 租约和会话 fencing 不证明对外副作用恰好一次；部署隔离与恢复取决于组合。

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
  - [Q01 · 平台为谁提供什么能力，相比自行编排 Agent 有何增量？](#detail-section-11)
  - [Q02 · 工作领取及失租如何限制旧执行者的会话访问？](#detail-section-12)
  - [Q03 · 运行、失败恢复和退出需要哪些条件？](#detail-section-13)
  - [Q04 · 如何验证跨外部副作用的恢复改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要自行管理 Agent 会话与隔离执行的开发团队。

自行实现任务队列、模型与执行沙箱也可完成任务；此平台组合控制面、会话、执行和适配器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作领取 | 分配和重领执行 | SQL 路径，故障未实测 |
| 会话授权 | 校验当前执行者 | Node 和 Cloudflare 代表接线 |
| 适配环境 | 组合模型与 sandbox | 供应商能力不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node、控制面及数据库 | 选定 Node 方案必需 | 工作和会话存储 | 无法形成所选组合 |
| 模型、harness 及凭据 | 执行任务必需 | 推理与代理循环 | 对应能力不可用 |
| sandbox 与网络策略 | 工具执行必需 | 隔离或运行工具 | 隔离能力随供应商而异 |
| 监控、备份与恢复流程 | 运维必需 | 失租与外部对账 | 不能仅凭源码证明恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定模型、存储和 sandbox | 凭据与隔离合同可核查 |
| 投递 | 创建任务并领取工作 | 当前 generation 获取许可 |
| 执行 | 运行工具并记录结果 | 审核权限及外部副作用 |
| 恢复 | 失租后重领并对账 | 旧执行者不能写受保护会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 控制面、DB、模型费用未知 | 配置权限、镜像及备份 | 未部署组合 |
| 持续 | token、存储与 sandbox 费用未知 | 监控及升级 | 流量和成本未知 |
| 恢复 | 重试与外部副作用成本未知 | 对账及检查受损状态 | 租约非外部幂等 |
| 退出 | 资源与凭据撤销成本未知 | 停工作与导出 | 清理未演练 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作领取 | SQL 条件更新与 generation | 并发和故障下的实际效果 |
| 会话 fencing | Node/Cloudflare 身份入口检查 | 所有部署与工具是否覆盖 |
| 恢复 | 作者描述持久事件与恢复 | 外部操作无重复或遗漏 |

> **思考**：[Q03](#research-q03) 租约和会话 fencing 不证明对外副作用恰好一次；部署隔离与恢复取决于组合。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将执行生命周期和可插拔组件组成平台，并给会话授权加入当前 claim 检查。

[Q02](#research-q02) 显式区分 queued ACK、活动会话及 Work 控制宽限；必须区分受保护的会话写入与外部副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 租约和会话 fencing 不证明对外副作用恰好一次；部署隔离与恢复取决于组合。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先以固定组合和模拟外部服务观察；认证、沙箱或对账不满足时停止并保留现有方案。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

局部源码检查 SQL 领取与认证接线；未部署目标、模型或 sandbox。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/environment-work-store-sql/src/index.ts、packages/environment-work-store/src/index.ts、apps/main/src/auth.ts、packages/control-plane-node/src/modules/node-http.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、根包、SQL Work store、当前 claim 校验以及 Cloudflare/Node 认证接线；未全审模型循环、ACP、所有云和第三方副作用。
- 下一步：用隔离数据库、sandbox 和模拟目标测试重领、旧 token、故障窗口及停机。

**分析版本**

- **仓库**：[openma-ai/open-managed-agents](https://github.com/openma-ai/open-managed-agents)
- **版本号**：0.1.0（[固定提交 5a2e522](https://github.com/openma-ai/open-managed-agents/tree/5a2e5221780c6a021be8b8ece8172a6cf1903bc3)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 建议将外部动作凭据与可对账回执绑定，验证重复和遗漏，尚未实现或运行。

用隔离数据库、sandbox 和模拟目标测试重领、旧 token、故障窗口及停机。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 148 | 36895 | — | — | 281529 |
| .mjs | source | 32 | 5838 | 4959 | 546 | — |
| .ts | source | 1694 | 253222 | 204103 | 33397 | — |
| .ts | test | 926 | 197528 | 177531 | 8021 | — |
| .tsx | source | 139 | 37199 | 32423 | 2611 | — |
| .tsx | test | 61 | 6273 | 5577 | 93 | — |
| .md | test | 3 | 408 | — | — | 2279 |
| .mjs | test | 26 | 4259 | 3880 | 92 | — |
| .ts | example | 12 | 1653 | 1466 | 62 | — |
| .md | example | 1 | 81 | — | — | 437 |

</details>

**活跃度**

[![Issue 未关闭 72](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=72&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 97](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=97&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=31&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查自托管 Agent 平台的工作领取、会话 fencing 和外部副作用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 平台为谁提供什么能力，相比自行编排 Agent 有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

OpenMA 面向需要自行部署 Agent 会话、执行环境与恢复的开发团队。README 将平台控制、harness 和 sandbox 分层，并说明可选择存储、模型及部署适配器；“任意”也明确以可扩展接口为条件。普通单进程 Agent 或任务队列也能执行模型和工具，本项目额外组织工作领取、会话控制和多种部署接线；不同适配器真实兼容与跨平台运行未验证。根项目是基础设施工程，不是 DSH 原生插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-36](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/README.md#L30-L36)

作者对会话、工具和控制的目标。

```text
## Build on managed execution

Create an agent, give it work, and return to the same session later. OpenMA provides:

- **Durable sessions and recovery.** Preserve conversation history, stream progress, and coordinate execution attempts without tying the session to one process. Workspace checkpoints and retained outputs support recovery with the configured runtime.
- **Tools and integrations you can reuse.** Start with shell, file, web, and browser tools. Add MCP services and Skills, then connect agents to the platforms where your team works.
- **Control over your deployment.** Choose the model, harness, sandbox, and backend services independently. Operate through the Console, CLI, or API.
```

**依据 2 · 作者声明**：[README.md:54-78](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/README.md#L54-L78)

适配层与内外 sandbox 架构。

<details>
<summary>查看原文（25行）</summary>

```text
| **Models** | Anthropic, OpenAI, DeepSeek, OpenRouter and other Pi providers; custom endpoints through [Model Cards](packages/sdk/README.md#pi-backed-model-cards) |
| **Harnesses** | Built-in Pi; Claude Code, Codex and other agents through [ACP adapters](packages/harness-runtime-acp/README.md); [custom harnesses](#architecture-platform-harness-sandbox) |
| **Sandboxes** | E2B, Daytona, LiteBox, Cloudflare Sandbox and more; see [provider capabilities](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx) |
| **Deployment** | Native Node.js, Docker, Fly.io, Vercel (Beta), Cloudflare; [deployment paths](#self-hosting) |
| **Database** | SQLite, PostgreSQL, MySQL, Cloudflare D1 and Durable Object SQL adapters; [SQL client and Store interfaces](docs/v1-architecture.md) |
| **Queue** | SQL-backed queues, Cloudflare Queues and an in-memory adapter; [Queue and dead-letter contracts](packages/queue/src/ports.ts) |
| **Object storage** | S3-compatible storage, Cloudflare R2, local filesystem and in-memory blob adapters; [BlobStore](packages/blob-store/src/ports.ts) |

Use the included adapters or implement an extension. “Any” means you can extend these interfaces; available features and setup depend on the selected adapters. Follow the linked provider and deployment guides for requirements.

## Architecture: platform, harness, sandbox

OpenMA is a **meta-harness**: it manages the resources and lifecycle around an agent loop. Choose the execution path that fits your agent.

### Harness outside the sandbox: independent lifecycles

Run the model loop outside the sandbox and use the sandbox to execute tools. Keep session history separate from both, so a sandbox failure does not erase the conversation and a replacement harness can rebuild context from durable events. Manage execution resources without coupling them to the lifetime of the agent loop.

Use the built-in Pi harness or implement the [host-side harness interface](apps/agent/src/harness/interface.ts). Workspace restoration depends on the configured persistence and provider; the [Runtime Host guide](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx#session-brain-placement-and-scaling) describes ownership and recovery.

### Harness inside the sandbox: reuse a mature agent

Bring Claude Code, Codex, or another established harness into a managed sandbox. Reuse its agent loop, context management, tools, and skills rather than rebuilding those capabilities. OpenMA supplies the surrounding work lifecycle, workspace persistence, and output collection.

The [ACP runtime](packages/harness-runtime-acp/README.md) provides existing integrations, including versioned harness installation independent of the sandbox image. Custom harnesses can use the [supervisor contract](packages/harness-supervisor/src/index.ts); ACP is one option. Native features and session resume depend on the selected adapter.
```

</details>

**依据 3 · 源码核查**：[package.json:1-20](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/package.json#L1-L20)

根包身份和部署定位。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "open-managed-agents",
  "version": "0.1.0",
  "description": "Self-host AI agents with Claude Managed Agents and OpenAI Agents API support. Sessions, tools, subagents and recovery on your infrastructure.",
  "homepage": "https://openma.ai",
  "repository": {
    "type": "git",
    "url": "https://github.com/openma-ai/open-managed-agents"
  },
  "bugs": {
    "url": "https://github.com/openma-ai/open-managed-agents/issues"
  },
  "keywords": [
    "ai-agents",
    "agent-platform",
    "agent-infrastructure",
    "claude-managed-agents",
    "claude-tag",
    "claude-tag-alternative",
    "claude-api",
```

</details>

#### 缺口

- 缺真实团队和对照运行
  **影响**：不能量化运行收益或迁移成本
  **进一步探讨**：固定一套部署与现有任务队列对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作领取及失租如何限制旧执行者的会话访问？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

SQL Work store 的 claimAvailable 用条件更新领取已排队或失租工作，claim_generation 自增并刷新心跳 TTL，未匹配返回 empty。当前 claim 校验按 workspace/environment/work 查询，核对 session、generation 与 token；queued 状态只允许未过期 ACK，starting/active 可按租期进入会话路径，而 Work 控制请求有特别宽限以交由协议处理失租。Cloudflare 和 Node 认证入口均接入该当前 claim 判断。局部源码支持版本隔离机制，并不证明所有部署和全部外部动作恰好执行一次。

#### 证据与依据

**依据 1 · 源码核查**：[packages/environment-work-store-sql/src/index.ts:281-313](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store-sql/src/index.ts#L281-L313)

原子条件领取及 generation 自增。

<details>
<summary>查看原文（33行）</summary>

```text
    const rows = await this.client
      .prepare(
        `UPDATE managed_environment_work
            SET claim_at = ?, claim_worker_id = ?,
                claim_generation = claim_generation + 1,
                heartbeat_ttl_seconds = ?,
                state = 'queued',
                revision = revision + 1
          WHERE workspace_id = ? AND environment_id = ?
            AND id = (
              SELECT id
                FROM managed_environment_work
               WHERE workspace_id = ? AND environment_id = ?
                 AND (
                   (state = 'queued' AND (claim_at IS NULL OR claim_at <= ?))
                   OR (
                     state IN ('starting', 'active')
                     AND claim_at IS NOT NULL
                     AND claim_at + heartbeat_ttl_seconds * 1000 <= ?
                   )
                 )
               ORDER BY created_at ASC, id ASC
               LIMIT 1
            )
            AND (
              (state = 'queued' AND (claim_at IS NULL OR claim_at <= ?))
              OR (
                state IN ('starting', 'active')
                AND claim_at IS NOT NULL
                AND claim_at + heartbeat_ttl_seconds * 1000 <= ?
              )
            )
          RETURNING ${this.columns()}`,
```

</details>

**依据 2 · 源码核查**：[packages/environment-work-store/src/index.ts:120-143](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store/src/index.ts#L120-L143)

当前身份、token、generation 与 queued ACK。

<details>
<summary>查看原文（24行）</summary>

```text
export async function isCurrentEnvironmentWorkClaim(
  dependencies: { store: EnvironmentWorkStore; now(): Date },
  claim: CurrentEnvironmentWorkClaim,
): Promise<boolean> {
  const current = await dependencies.store.find({
    workspaceId: claim.workspaceId,
    environmentId: claim.environmentId,
    workId: claim.workId,
  });
  if (
    current === null
    || current.work.data.type !== "session"
    || current.work.data.id !== claim.sessionId
    || current.claim === null
    || current.claim.generation !== claim.generation
    || current.secret.sessionsToken !== claim.token
  ) return false;

  // Poll reserves a queued item. Its scoped bearer must be able to ACK
  // before the item becomes starting, without granting Session access yet.
  if (current.work.state === "queued") {
    return claim.method === "POST"
      && claim.path === `/v1/environments/${encodeURIComponent(claim.environmentId)}/work/${encodeURIComponent(claim.workId)}/ack`
      && Date.parse(current.claim.claimedAt) + current.heartbeatTtlSeconds * 1_000 > dependencies.now().getTime();
```

</details>

**依据 3 · 源码核查**：[packages/environment-work-store/src/index.ts:145-161](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store/src/index.ts#L145-L161)

状态、控制请求宽限及会话 TTL。

<details>
<summary>查看原文（17行）</summary>

```text
  const workControlRequest = claim.path.startsWith(
    `/v1/environments/${encodeURIComponent(claim.environmentId)}/work/${encodeURIComponent(claim.workId)}/`,
  );
  if (
    current.work.state !== "starting"
    && current.work.state !== "active"
    && !(current.work.state === "stopping" && workControlRequest)
  ) return false;

  // Heartbeat and stop are the Work protocol's authority checks. Let the
  // current claim reach them even after its TTL so the application can return
  // the canonical 412 (or complete cleanup). An expired executor must never
  // use the same grace path to append Session state.
  if (workControlRequest) return true;
  return Date.parse(current.claim.claimedAt)
    + current.heartbeatTtlSeconds * 1_000
    > dependencies.now().getTime();
```

</details>

**依据 4 · 源码核查**：[apps/main/src/auth.ts:80-102](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/apps/main/src/auth.ts#L80-L102)

Cloudflare 路径查询租户 store 并验证。

<details>
<summary>查看原文（23行）</summary>

```text
      isCurrent: async (claim) => {
        const tenantDb = await buildCfTenantDbProvider(c.env).resolve(
          claim.workspaceId,
        );
        const secretCrypto = new WebCryptoAesGcm(
          platformRootSecret,
          "managed.environment-work.secret",
        );
        const store = new SqlEnvironmentWorkStore(
          new CfD1SqlClient(tenantDb),
          {
            seal: async ({ plaintext }) => ({
              ciphertext: await secretCrypto.encrypt(plaintext),
            }),
            open: async ({ ciphertext }) => ({
              plaintext: await secretCrypto.decrypt(ciphertext),
            }),
          },
        );
        return isCurrentEnvironmentWorkClaim(
          { store, now: () => new Date() },
          claim,
        );
```

</details>

**依据 5 · 源码核查**：[packages/control-plane-node/src/modules/node-http.ts:253-265](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/control-plane-node/src/modules/node-http.ts#L253-L265)

Node 的 bearer 解析接线。

<details>
<summary>查看原文（13行）</summary>

```text
    resolveBearerToken: async ({ token, method, path }) => {
      if (managedEnvironmentWorkSessionTokenCrypto === null) return null;
      const scoped = await managedAcpCapabilities.authenticate({ token, method, path })
        ?? await authenticateEnvironmentWorkSessionBearer({
        token,
        method,
        path,
        crypto: managedEnvironmentWorkSessionTokenCrypto,
        now: () => new Date(),
        isCurrent: (claim) => isCurrentEnvironmentWorkClaim({
          store: managedEnvironmentWorkStore,
          now: () => new Date(),
        }, claim),
```

</details>

#### 缺口

- 未验证生产部署、并发故障及全部执行分支
  **影响**：不能证明跨适配器隔离或外部副作用去重
  **进一步探讨**：固定数据库和宿主注入失租、重领和旧执行者写入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行、失败恢复和退出需要哪些条件？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

部署组合至少依赖控制面、存储、模型与执行环境；不同宿主和 adapter 的存储合同、认证、网络与 sandbox 能力需逐一确定。数据库工作记录与 Session 写入 fencing 不是外部邮件、支付或任意 shell 副作用的幂等协议；旧进程在失租前可能已经对外产生效果。首次配置凭据和沙箱、持续模型费用与监控、故障对账及停机清理均需投入，金额与耗时未知。先固定 Node、模型、数据库和隔离 sandbox，用模拟外部操作验证重领及退出；无可信权限或恢复对账时保留现有执行方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-62](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/README.md#L50-L62)

部署、存储和适配器范围。

<details>
<summary>查看原文（13行）</summary>

```text
## Choose your stack

| Layer | Existing integrations and extension points |
| --- | --- |
| **Models** | Anthropic, OpenAI, DeepSeek, OpenRouter and other Pi providers; custom endpoints through [Model Cards](packages/sdk/README.md#pi-backed-model-cards) |
| **Harnesses** | Built-in Pi; Claude Code, Codex and other agents through [ACP adapters](packages/harness-runtime-acp/README.md); [custom harnesses](#architecture-platform-harness-sandbox) |
| **Sandboxes** | E2B, Daytona, LiteBox, Cloudflare Sandbox and more; see [provider capabilities](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx) |
| **Deployment** | Native Node.js, Docker, Fly.io, Vercel (Beta), Cloudflare; [deployment paths](#self-hosting) |
| **Database** | SQLite, PostgreSQL, MySQL, Cloudflare D1 and Durable Object SQL adapters; [SQL client and Store interfaces](docs/v1-architecture.md) |
| **Queue** | SQL-backed queues, Cloudflare Queues and an in-memory adapter; [Queue and dead-letter contracts](packages/queue/src/ports.ts) |
| **Object storage** | S3-compatible storage, Cloudflare R2, local filesystem and in-memory blob adapters; [BlobStore](packages/blob-store/src/ports.ts) |

Use the included adapters or implement an extension. “Any” means you can extend these interfaces; available features and setup depend on the selected adapters. Follow the linked provider and deployment guides for requirements.
```

</details>

**依据 2 · 源码核查**：[package.json:20-35](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/package.json#L20-L35)

Node 与工程入口。

<details>
<summary>查看原文（16行）</summary>

```text
    "claude-api",
    "claude-code",
    "open-source-agents",
    "self-hosted-agents",
    "mcp",
    "byok",
    "self-hosted",
    "cloudflare-workers",
    "durable-objects",
    "open-source",
    "openai-agents-api",
    "openai-sdk",
    "subagents",
    "agent-client-protocol"
  ],
  "license": "Apache-2.0",
```

</details>

**依据 3 · 源码核查**：[packages/environment-work-store/src/index.ts:145-161](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store/src/index.ts#L145-L161)

fencing 适用于受检查的会话路径。

<details>
<summary>查看原文（17行）</summary>

```text
  const workControlRequest = claim.path.startsWith(
    `/v1/environments/${encodeURIComponent(claim.environmentId)}/work/${encodeURIComponent(claim.workId)}/`,
  );
  if (
    current.work.state !== "starting"
    && current.work.state !== "active"
    && !(current.work.state === "stopping" && workControlRequest)
  ) return false;

  // Heartbeat and stop are the Work protocol's authority checks. Let the
  // current claim reach them even after its TTL so the application can return
  // the canonical 412 (or complete cleanup). An expired executor must never
  // use the same grace path to append Session state.
  if (workControlRequest) return true;
  return Date.parse(current.claim.claimedAt)
    + current.heartbeatTtlSeconds * 1_000
    > dependencies.now().getTime();
```

</details>

#### 缺口

- 未部署任一组合或故障演练
  **影响**：无法评估费用、权限隔离和恢复是否达标
  **进一步探讨**：用隔离环境及模拟副作用检查领取、失租和对账。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证跨外部副作用的恢复改进？

**研究主题**：新假设与验证

#### 完整回答

假设把外部动作的稳定 ID、幂等键和结果证据与工作 generation、事件及重试决策关联，并在接手时与外部系统对账，可降低重复或遗漏；这是待验证方案，不是已有通用 exactly-once 保证。与现有 lease 和 session fencing 对照，在请求前、外部成功后响应前及确认后终止执行者，记录重复、遗漏、错误拒绝、延迟和对账工时；外部系统不支持查询或幂等时需标明不适用，收益不足或误拒过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/environment-work-store-sql/src/index.ts:281-313](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store-sql/src/index.ts#L281-L313)

已有的领取 generation 和失租重领。

<details>
<summary>查看原文（33行）</summary>

```text
    const rows = await this.client
      .prepare(
        `UPDATE managed_environment_work
            SET claim_at = ?, claim_worker_id = ?,
                claim_generation = claim_generation + 1,
                heartbeat_ttl_seconds = ?,
                state = 'queued',
                revision = revision + 1
          WHERE workspace_id = ? AND environment_id = ?
            AND id = (
              SELECT id
                FROM managed_environment_work
               WHERE workspace_id = ? AND environment_id = ?
                 AND (
                   (state = 'queued' AND (claim_at IS NULL OR claim_at <= ?))
                   OR (
                     state IN ('starting', 'active')
                     AND claim_at IS NOT NULL
                     AND claim_at + heartbeat_ttl_seconds * 1000 <= ?
                   )
                 )
               ORDER BY created_at ASC, id ASC
               LIMIT 1
            )
            AND (
              (state = 'queued' AND (claim_at IS NULL OR claim_at <= ?))
              OR (
                state IN ('starting', 'active')
                AND claim_at IS NOT NULL
                AND claim_at + heartbeat_ttl_seconds * 1000 <= ?
              )
            )
          RETURNING ${this.columns()}`,
```

</details>

**依据 2 · 源码核查**：[packages/environment-work-store/src/index.ts:129-161](https://github.com/openma-ai/open-managed-agents/blob/5a2e5221780c6a021be8b8ece8172a6cf1903bc3/packages/environment-work-store/src/index.ts#L129-L161)

当前会话校验及控制宽限。

<details>
<summary>查看原文（33行）</summary>

```text
  if (
    current === null
    || current.work.data.type !== "session"
    || current.work.data.id !== claim.sessionId
    || current.claim === null
    || current.claim.generation !== claim.generation
    || current.secret.sessionsToken !== claim.token
  ) return false;

  // Poll reserves a queued item. Its scoped bearer must be able to ACK
  // before the item becomes starting, without granting Session access yet.
  if (current.work.state === "queued") {
    return claim.method === "POST"
      && claim.path === `/v1/environments/${encodeURIComponent(claim.environmentId)}/work/${encodeURIComponent(claim.workId)}/ack`
      && Date.parse(current.claim.claimedAt) + current.heartbeatTtlSeconds * 1_000 > dependencies.now().getTime();
  }
  const workControlRequest = claim.path.startsWith(
    `/v1/environments/${encodeURIComponent(claim.environmentId)}/work/${encodeURIComponent(claim.workId)}/`,
  );
  if (
    current.work.state !== "starting"
    && current.work.state !== "active"
    && !(current.work.state === "stopping" && workControlRequest)
  ) return false;

  // Heartbeat and stop are the Work protocol's authority checks. Let the
  // current claim reach them even after its TTL so the application can return
  // the canonical 412 (or complete cleanup). An expired executor must never
  // use the same grace path to append Session state.
  if (workControlRequest) return true;
  return Date.parse(current.claim.claimedAt)
    + current.heartbeatTtlSeconds * 1_000
    > dependencies.now().getTime();
```

</details>

#### 缺口

- 未实现或验证跨服务动作回执协议
  **影响**：不能推断外部效果去重
  **进一步探讨**：采用模拟目标和真实故障窗口进行对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
