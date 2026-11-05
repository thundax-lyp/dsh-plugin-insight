# ybkkasi

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8ee57e0](https://github.com/01men/ybkkasi/tree/8ee57e08ad64ab5db335d95f1aa63b73d92690a5)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)
<!-- END META -->

> **功能**：基于 DSH 和 Cordis 的企业 Agent 治理平台，提供组织、任务、审批、用量及审计。

> **亮点**：[Q01](#research-q01) 把组织治理与 Agent 任务入口接到同一控制面。

> **主要限制**：[Q02](#research-q02) 权限点、组织范围、任务锁和审计各有边界，不能用部分路径推断全域隔离。

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
  - [Q01 · 元冰可在 DSH 上接入怎样的企业治理流程？](#detail-section-11)
  - [Q02 · 审批、组织权限和任务锁是同一层吗？](#detail-section-12)
  - [Q03 · 如何在隔离实例验收组织任务与未知结果？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：运营者需要把可执行任务、所属组织和使用量联系起来。

分别用 DSH 执行任务、用人工审批和独立记录追踪支出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 企业控制台 | 核对组织任务和用量 | 需对应身份与部署 |
| 任务执行中枢 | 审批后派发并记录运行线索 | 代表路径有本地执行锁，远端需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配 Node 与 Cordis 或 DSH Web | 必需 | 独立或 bundle 装配 | 缺服务时不可用 |
| 隔离数据目录及测试身份 | 验收必需 | 权限和组织对照 | 不要使用演示环境承载业务数据 |
| 测试执行与模型通道 | 任务验收必需 | 产生真实运行及用量 | 通道缺失时无法形成闭环 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置两个合成组织 | 角色与权限预先记录 |
| 验收 | 用户核对审批、wake、run 与用量 | 覆盖拒绝及重试 |
| 退出 | 用户关测试实例，保留证据 | 不使用未知状态重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务器和模型支出未知 | 配置组织、权限和执行入口 | 依赖目标部署 |
| 持续 | 用量与维护成本未知 | 复核任务、审批和对账 | 不同业务域需单独验收 |
| 失败 | 恢复耗时未知 | 检查日志、运行记录和实际服务 | 不能从 HTTP 错误推断远端未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 企业控制面 | 组织、任务与用量接线 | 真实租户隔离和运营节时 |
| 执行治理 | 代表路径有机器权限、P0 审批和锁 | 跨组织及远端副作用验证 |

> **思考**：[Q02](#research-q02) 权限点、组织范围、任务锁和审计各有边界，不能用部分路径推断全域隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把组织治理与 Agent 任务入口接到同一控制面。

[Q02](#research-q02) 共享权限点守卫不能独立证明对象授权范围，检查各路径还需读取业务处理器。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 权限点、组织范围、任务锁和审计各有边界，不能用部分路径推断全域隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离实例先完成双组织拒绝验收与单任务回读，再评估真实接入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持根 bundle 和代表执行与用量路由。全域权限、远端执行和真实用量未验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/main.ts、src/boot-all.ts、cordis.patch.yml、packages/plugin-exec-hub/src/index.ts、packages/platform-core/src/rest-gate.ts、packages/plugin-console/src/routes/ops.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 bundle、独立启动、代表性执行与用量权限路径。未运行平台、模型、DSH 或部署测试。
- 下一步：测试两个组织的相同权限点、P0 拒绝、重复 wake、审计和用量归属。

**分析版本**

- **仓库**：[01men/ybkkasi](https://github.com/01men/ybkkasi)
- **版本号**：1.6.0（[固定提交 8ee57e0](https://github.com/01men/ybkkasi/tree/8ee57e08ad64ab5db335d95f1aa63b73d92690a5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 将稳定操作 ID 绑定组织并回读运行状态，测试重复唤醒。

测试两个组织的相同权限点、P0 拒绝、重复 wake、审计和用量归属。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 172 | 27399 | — | — | 468317 |
| .ts | source | 170 | 60542 | 46925 | 9643 | — |
| .mjs | source | 47 | 19999 | 14165 | 5059 | — |
| .mjs | test | 36 | 7645 | 6238 | 980 | — |
| .js | source | 66 | 28935 | 25685 | 1995 | — |
| .tsx | source | 2 | 267 | 194 | 53 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/01men/ybkkasi/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：企业运营者能否用元冰可对一项测试 Agent 工作建立组织、审批、执行与用量的可核对闭环？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 元冰可在 DSH 上接入怎样的企业治理流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组织管理员可把目标、项目与任务放进控制台，再为受管理 Agent 安排执行与审批，查用量和审计。相较单独管理 DSH profile 和手工对账，平台把这些入口组织在一起。根仓有可安装 Cordis bundle，也有独立 Host。独立入口新建 Context、恢复状态并依次挂载 IAM、审计、模型网关和执行中枢。DSH patch 复用宿主工具和 Web 服务，通过 /rq 进入平台数据面。合格结果应以任务发起、审批、实际执行、结果和账本闭环验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-73](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/README.md#L36-L73)

作者的流程和两种运行形态。

<details>
<summary>查看原文（38行）</summary>

````text
## 三步上手

| 步骤 | 你要做的事 | 平台里的对应物 |
| --- | --- | --- |
| **1 · Goal 定目标** | 把业务目标拆成项目与任务，挂到组织名下 | 执行中枢的目标血缘：目标 → 项目 → 任务；派单受控、交付有验收记录 |
| **2 · Hire 招数字员工** | 数字员工登记主组织与真人主管，绑定技术 Agent | 数字员工名册与状态（在职 / 离岗）、权限矩阵、生命周期 |
| **3 · Run 跑起来** | 唤醒任务、控审批与预算，事后算账留痕 | 任务唤醒与执行记录、审批中心、模型渠道预算、用量与成本、审计日志 |

想先看效果，直接开[在线演示 demo.ybkkasi.com](https://demo.ybkkasi.com/)。

## 快速开始

在线体验无需安装：[demo.ybkkasi.com](https://demo.ybkkasi.com/)。

本地使用 Docker Compose 启动一个只读演示实例：

```bash
git clone https://github.com/01men/ybkkasi.git
cd ybkkasi
docker compose up -d
```

打开 [http://localhost:7300](http://localhost:7300)。演示模式会让访客访问实例的只读数据，请仅在隔离的演示环境使用，不要接入真实业务数据。

作为 dsh 插件接入（`web` profile）：

```bash
dsh plugin --profile web add github:01men/ybkkasi
```

如需从源码启动独立实例，需要 Node.js ≥ 22.6：

```bash
npm ci
npm start
```

独立实例默认不注入演示数据。首次启动凭据、持久化、备份和企业部署配置见[部署指南](docs/deploy-enterprise.md)。
````

</details>

**依据 2 · 源码核查**：[package.json:28-45](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/package.json#L28-L45)

根 bundle 与独立脚本。

<details>
<summary>查看原文（18行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.3.0",
      "dshReleases": {
        "0.1.0-rc.7": "compatible",
        "0.2.1-rc.5": "compatible"
      },
      "profiles": [
        "web"
      ]
    }
  },
  "scripts": {
    "start": "node --experimental-strip-types src/main.ts",
    "selftest": "node scripts/selftest.mjs",
```

</details>

**依据 3 · 源码核查**：[src/main.ts:14-33](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/src/main.ts#L14-L33)

独立启动及退出。

<details>
<summary>查看原文（20行）</summary>

```text
const ctx = new Context()
const port = Number(argValue('--port', '7300'))
const dataDir = argValue('--data', './data')

process.on('unhandledRejection', (reason) => {
  console.error('[main] 未处理的 Promise 拒绝', reason)
})

await bootAll(ctx, { dataDir, port })

const logger = ctx.logger('main')
logger.info('元冰可|企业AI资源管理平台已启动')
logger.info(`控制台地址：http://0.0.0.0:${port}（本机访问 http://127.0.0.1:${port}）`)

process.on('SIGINT', () => {
  logger.info('收到 SIGINT，正在退出…')
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
process.on('SIGTERM', () => {
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
```

</details>

**依据 4 · 源码核查**：[src/boot-all.ts:43-66](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/src/boot-all.ts#L43-L66)

核心、存储与控制面。

<details>
<summary>查看原文（24行）</summary>

```text
export async function bootAll(ctx: Context, options: BootOptions): Promise<void> {
  // 装配前断言进程内只有一个 root（双实例会让 fiber 静默 PENDING，必须 fail-fast）
  assertSingleRoot(ctx)
  await ctx.plugin(platformCore, { dataDir: options.dataDir, http: { port: options.port } })
  const restored = await ctx.opsStorage.restoreAll()
  if (restored.length > 0) {
    ctx.logger('boot').info(`已从磁盘恢复 ${restored.length} 个数据集合`)
  }
  await ctx.plugin(resourceCore)
  await ctx.plugin(iam)
  await ctx.plugin(authn)
  await ctx.plugin(usage)
  await ctx.plugin(audit)
  await ctx.plugin(market)
  // 连接器纳管（open-connector 数据面网关适配）：依赖 iam/usage/audit，先于 mcp/modelgw
  await ctx.plugin(connector)
  await ctx.plugin(mcp)
  // NAS（FS 文件存储）资产：先于 skillhub 加载（skillhub 上架时经 nasRegistry 上传 skill.zip）
  await ctx.plugin(nas)
  await ctx.plugin(skillhub)
  await ctx.plugin(agent)
  await ctx.plugin(app)
  await ctx.plugin(modelgw)
  // 宿主角色：提供远程接入端点（接入码/enroll/客户端管理）与接入管理工具
```

</details>

**依据 5 · 源码核查**：[src/boot-all.ts:73-100](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/src/boot-all.ts#L73-L100)

执行中枢和装配探针。

<details>
<summary>查看原文（28行）</summary>

```text
  await ctx.plugin(consolePlugin)
  // 部门面板（review-dsh-agent-panel-v2）：REST 依赖 console 鉴权中间件先行注册（/api/* Bearer 面）；
  // 自注册路由经 httpServer.routeMatrix 共享登记处汇入 RBAC 断言矩阵
  await ctx.plugin(panelCore)
  // 事务流引擎（IAW 交接 3-1..3-4，宿主新域）：/api/flow/* 自注册 guarded 路由，同样依赖 console 中间件先行
  await ctx.plugin(flowCore)
  // 执行中枢（ybkk-MATRIX 目标四「干活中枢」）：目标血缘/任务执行锁/心跳唤醒/例行调度，
  // /api/exec/* 自注册 guarded 路由——依赖 console 中间件、resourceCore/agentRegistry/modelgw/flow 先行
  await ctx.plugin(execHub)
  // 数字员工域（员工/任用/permit/受控调用/交付验收）：/api/workforce/* guarded 路由依赖 console 中间件，
  // 员工工作路径依赖 exec-hub 先行——须在其后、钉钉桥接之前装配；装配完成后经 platform-core 的
  // workforcePolicy 窄端口登记策略实现（artifact staging 与 SQLite 同底座，数据目录复用 options.dataDir）
  await ctx.plugin(workforce, { dataDir: options.dataDir })
  // 钉钉桥接（群桥/出向投递/审批推送/告警通道）：订阅 panel.message.created 与 audit.alert.fired
  await ctx.plugin(dingtalkBridge)
  // UHP 执行驱动（协作方案 §7）：/v1/uhp 协议面 + /api/uhp/* guarded 路由——依赖 console 中间件与
  // modelgw 先行；订阅 a2a.task.dispatch/cancel，发布 a2a.task.progress
  await ctx.plugin(uhp)
  // A2A 协作平面（协作方案 §5/§6）：well-known 卡片/目录/JSON-RPC 方法面/治理五查/协商引擎/
  // 验收/巡检——依赖 skillhub/mcp/agent 先行（卡片授权集投影），派发与执行只走事件总线
  await ctx.plugin(a2a)
  // 装配后体检：必须在全部 await ctx.plugin 之后（此刻 fiber 都应 ACTIVE）；
  // 必需服务不可达或存在拦启动的卡死 fiber 时直接拒绝启动，禁止降级为告警放行
  // （FAILED fiber 仅在声明 provide 已被其他 ACTIVE fiber 接管时豁免，见 boot-probe.ts）
  const health = probeTree(ctx, ['opsStorage', 'platformBus', 'httpServer', 'iam', 'authn', 'usage', 'audit'])
  if (!health.ok) {
    throw new Error(formatTreeHealth(health))
  }
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:18-26](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/cordis.patch.yml#L18-L26)

宿主工具和 HTTP 配置。

```text
- insert:
    - id: ops-platform-core
      name: dsh-enterprise-ops/packages/platform-core/src/index.ts
      config:
        provideToolRuntime: false
        startHttp: false
        http:
          # 对外前缀：OIDC 授权页 302 等「根绝对路径」构造据此保持 /rq 自洽
          externalBase: /rq
```

**依据 7 · 源码核查**：[cordis.patch.yml:98-102](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/cordis.patch.yml#L98-L102)

挂载前缀。

```text
    # 单进程单入口：把元冰可数据面挂进 dsh webServer（/rq 前缀），必须在 console 之后装配
    - id: ops-dsh-bridge
      name: dsh-enterprise-ops/packages/plugin-dsh-bridge/src/index.ts
      config:
        mountPath: /rq
```

#### 缺口

- 未完整审计所有业务域或运行组织任务
  **影响**：不能保证任意功能组合端到端工作
  **进一步探讨**：以一个测试组织走小任务、审批、执行和对账

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批、组织权限和任务锁是同一层吗？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不是同一机制。执行中枢代表路径先核机器主体权限，P0 需要执行前审批，随后以锁竞争结果决定是否继续，将 run、任务及 wake 关联并发出事件；这只支持所读路径的本地决策，不能推出远端恰好执行一次。REST 共享守卫检查调用者是否持有权限点，处理器还需应用对象或组织范围。用量摘要对普通调用者会覆盖其组织查询，而执行任务列表的代表处理器按可选 orgId 查询参数过滤，且手动 wake 以任务 ID 读取后入队。不能从权限点存在推导跨组织均已拒绝，部署验收需检查主体分配、中间件与最终响应。审计路径也会捕获失败并继续，不宜把业务成功当作审计必落。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-exec-hub/src/index.ts:1158-1214](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-exec-hub/src/index.ts#L1158-L1214)

机器权限、P0 审批、竞争及派发。

<details>
<summary>查看原文（57行）</summary>

```text
        detail: `机器主体缺少 exec.write（wake=${wakeId}）`,
      })
      this.ctx.platformBus.emit('audit.authz.denied', {
        actorId: agentId, actorName: agent.name, point: 'exec.write', path: `exec:wake:${wakeId}`,
      })
      return 'failed'
    }

    // 联动④：审批门禁（P0=高危任务：执行前须 exec.issue.run 审批 executed）
    if (issue.priority === 'P0' && !this.p0ApprovalPassed(issue.id)) {
      const deferred = this.wakes().update(wakeId, { status: 'deferred_issue_execution', lastError: t('P0 任务待审批放行') })
      this.recordHeartbeat(agent, 'deferred', `P0 审批 ${issue.id}`)
      return deferred ? 'deferred' : 'failed'
    }

    // 三态裁决（决策=domain 纯函数；CAS=下方护栏）
    const decision = decideWakeAdmission({
      isSameExecutionAgent: issue.executionAgentKey === normalizeAgentKey(agent.name),
      shouldDeferFollowupWake: false,
      shouldQueueFollowupForRunningWake: false,
      availableActiveExecutionRunPresent: Boolean(issue.executionRunId),
    })
    if (decision.kind === 'defer') {
      this.wakes().update(wakeId, { status: 'deferred_issue_execution', lastError: t('执行锁由 {runId} 持有', { runId: issue.executionRunId ?? '' }) })
      return 'deferred'
    }
    const agentKey = normalizeAgentKey(agent.name)
    let runId: string
    if (decision.kind === 'coalesce') {
      runId = issue.executionRunId!
    } else {
      const run = this.createRun({
        orgId: issue.orgId, agentId, issueIds: [issue.id], trigger: wake.trigger,
        contextPack: this.buildIssueContext(issue, agent),
      })
      runId = run.id
    }
    // CAS 护栏：并发下仅一方成功（决策层不依赖它，它只防重复取锁）
    const acquired = this.acquireLock(issue.id, runId, agentKey)
    if (!acquired.ok) {
      this.wakes().update(wakeId, { status: 'deferred_issue_execution', lastError: t('取锁竞争失败（{holder} 持有）', { holder: acquired.holder ?? '' }) })
      return 'deferred'
    }
    if (decision.kind === 'coalesce') {
      const run = this.runs().get(runId)
      if (run && !run.issueIds.includes(issue.id)) this.runs().update(runId, { issueIds: [...run.issueIds, issue.id] })
    }
    if (issue.status === 'todo') this.issues().update(issue.id, { status: 'in_progress' })
    this.wakes().update(wakeId, { status: 'run', runId })
    this.ctx.platformBus.emit(PlatformEvents.ExecIssueChanged, { issueId: issue.id, action: 'dispatched', status: 'in_progress', runId })
    this.auditSafe({
      type: 'invoke', actorType: 'machine', actorId: 'exec-hub', actorName: '执行中枢',
      action: 'exec.wakeup.dispatched', resourceType: 'issue', resourceId: issue.id,
      resourceName: issue.title, result: 'ok',
      detail: `run=${runId} trigger=${wake.trigger} 决策=${decision.kind} agent=${agent.name}`,
    })
    return 'woken'
```

</details>

**依据 2 · 源码核查**：[packages/platform-core/src/rest-gate.ts:79-112](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/platform-core/src/rest-gate.ts#L79-L112)

REST 权限点语义。

<details>
<summary>查看原文（34行）</summary>

```text
export function permissionPointAllows(permissions: string[], point: string): boolean {
  const impliedBy = IMPLIED_POINTS[point]
  return permissions.includes('*') || permissions.includes(point)
    || (impliedBy !== undefined && permissions.includes(impliedBy))
}

export function createRestGate(ctx: RestGateHost): RestGate {
  const caller = (exchange: HttpExchange): CallerInfo => exchange.principal as CallerInfo

  const requirePermission = (exchange: HttpExchange, point: string): boolean => {
    const info = caller(exchange)
    // 判定面单点收敛（W3-T5）：蕴含表与布尔判定在上方 permissionPointAllows，本处只补副作用
    if (permissionPointAllows(info.permissions, point)) return true
    ctx.platformBus.emit('audit.authz.denied', {
      actorId: info.userId ?? info.principalId,
      actorName: info.name,
      point,
      path: exchange.path,
    })
    exchange.fail(403, 'FORBIDDEN', t('缺少权限点 {point}，请联系管理员调整角色', { point }), { permission: point })
    return false
  }

  const guarded = (method: string, path: string, permission: string, handler: (exchange: HttpExchange) => unknown | Promise<unknown>): void => {
    ctx.httpServer.register(method, path, async (exchange) => {
      if (!requirePermission(exchange, permission)) return
      try {
        const result = await handler(exchange)
        if (!exchange.res.writableEnded) exchange.ok(result)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        exchange.fail(400, 'BAD_REQUEST', message)
      }
    }, { access: 'guarded', permission })
```

</details>

**依据 3 · 源码核查**：[packages/plugin-console/src/routes/ops.ts:350-368](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-console/src/routes/ops.ts#L350-L368)

用量摘要的组织重写。

<details>
<summary>查看原文（19行）</summary>

```text
  guarded('GET', '/api/usage/summary', 'panel.read', (exchange) => {
    const info = caller(exchange)
    const canCrossOrg = info.permissions.includes('*') || info.permissions.includes('usage.read')
    const window = exchange.query.get('window') === 'month' ? 'month' : 'today'
    const { from, to } = usageWindowBounds(window)
    let org = exchange.query.get('org') ?? undefined
    let subject = exchange.query.get('subject') ?? undefined
    if (!canCrossOrg) {
      const user = info.userId ? ctx.iam.users().get(info.userId) : undefined
      org = user?.orgId ?? '__no_org__' // 组织解析失败 → 空聚合（fail-closed，不透穿全平台成本）
      subject = undefined
    }
    const summary = ctx.usage.summary({ from, to, ...(org ? { org } : {}), ...(subject ? { subject } : {}) })
    // 预算进度（1-4 联动）：modelgw 预算在位时随摘要返回，缺席=无预算配置
    let budget: unknown = null
    try {
      budget = (ctx.modelGateway as unknown as { budgetStatusFor?: (org: string) => unknown } | undefined)?.budgetStatusFor?.(org ?? '') ?? null
    } catch { /* 预算面缺席不阻塞摘要 */ }
    return { window, scope: canCrossOrg ? 'platform' : 'self-org', ...(org ? { org } : {}), ...(subject ? { subject } : {}), budget, ...summary }
```

</details>

**依据 4 · 源码核查**：[packages/plugin-exec-hub/src/index.ts:1707-1727](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-exec-hub/src/index.ts#L1707-L1727)

任务列表的可选组织过滤。

<details>
<summary>查看原文（21行）</summary>

```text
  guarded('GET', '/api/exec/issues', 'exec.read', (exchange) => {
    const status = exchange.query.get('status') ?? ''
    const agentId = exchange.query.get('agentId') ?? ''
    const projectId = exchange.query.get('projectId') ?? ''
    const orgId = exchange.query.get('orgId') ?? '' // #16：组织范围过滤
    const agents = ctx.resourceCore.list('agent')
    const projects = hub.projects().all()
    return {
      issues: hub.issues().all()
        .filter((item) => (!status || item.status === status)
          && (!agentId || item.assigneeAgentId === agentId)
          && (!projectId || item.projectId === projectId)
          && (!orgId || item.orgId === orgId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((item) => ({
          ...item,
          assigneeAgentName: agents.find((agent) => agent.id === item.assigneeAgentId)?.name,
          projectName: projects.find((project) => project.id === item.projectId)?.name,
        })),
    }
  })
```

</details>

**依据 5 · 源码核查**：[packages/plugin-exec-hub/src/index.ts:1762-1776](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-exec-hub/src/index.ts#L1762-L1776)

按任务 ID 唤醒。

<details>
<summary>查看原文（15行）</summary>

```text
  guarded('POST', '/api/exec/issues/:id/wake', 'exec.write', (exchange) => {
    const input = body<{ reason?: string }>(exchange)
    const issue = hub.issues().get(exchange.params['id']!)
    if (!issue) { exchange.fail(404, 'NOT_FOUND', t('任务不存在：{id}', { id: exchange.params['id'] ?? '' })); return }
    if (!issue.assigneeAgentId) { exchange.fail(400, 'BAD_REQUEST', t('任务未指定负责人 Agent')); return }
    const wake = hub.enqueueWake({
      orgId: issue.orgId, issueId: issue.id, agentId: issue.assigneeAgentId, trigger: 'api',
      triggerDetail: input.reason ?? t('手动唤醒（{actor}）', { actor: actorOf(exchange) }),
      idempotencyKey: wakeIdempotencyKey('api', [issue.id, Date.now()]),
    })
    changeLog(exchange, 'exec.issue.wake', issue.title, wake.triggerDetail ?? '')
    return wake
  })

  guarded('GET', '/api/exec/lineage/:issueId', 'exec.read', (exchange) => hub.issueLineage(exchange.params['issueId']!))
```

</details>

**依据 6 · 源码核查**：[packages/plugin-exec-hub/src/index.ts:1590-1615](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-exec-hub/src/index.ts#L1590-L1615)

审计写入降级。

<details>
<summary>查看原文（26行）</summary>

```text
  /** 审计留痕（audit 缺席静默降级——dsh-bridge softRead 同款防御）。 */
  private auditSafe(entry: Omit<AuditLogRecord, 'id' | 'createdAt' | 'updatedAt'>): void {
    try {
      this.ctx.audit?.record(entry)
    } catch { /* 审计面独立降级 */ }
  }
}

// ---------------------------------------------------------------------------
// REST + 工具 + 装配（/api/exec/*：guarded 自注册，鉴权依赖 console 中间件先行）
// ---------------------------------------------------------------------------

export function apply(ctx: Context) {
  const hub = new ExecutionHubService(ctx)
  const http = ctx.httpServer
  const { caller, guarded, body, actorOf } = createRestGate(ctx)

  const changeLog = (exchange: HttpExchange, action: string, resourceName: string, detail = ''): void => {
    const info = caller(exchange)
    try {
      ctx.audit?.record({
        type: 'change', actorType: info.kind === 'human' ? 'human' : 'machine',
        actorId: info.userId ?? info.principalId, actorName: info.name,
        action, resourceType: 'exec', resourceId: exchange.params['id'] ?? '', resourceName, result: 'ok', detail,
      })
    } catch { /* 审计面独立降级 */ }
```

</details>

#### 缺口

- 未测试两组织主体、实际角色授予、上下游执行及失败恢复
  **影响**：无法确认跨组织隔离、预算硬限或审计一致性
  **进一步探讨**：用同权限点但不同组织的角色测试列表、按 ID 操作及审计失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何在隔离实例验收组织任务与未知结果？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先用独立测试实例、合成组织和受控模型通道建立一个最小任务。分别核对 DSH bundle 与独立部署的登录、角色、任务锁、审批和用量归属。手动 wake 的 idempotencyKey 以 issue ID 加当前时间生成，重复 HTTP 不必然共用同一键，因此响应丢失时应先查 wake 与 run。若跨组织范围、预算或回读不清楚，就停用测试集成，回原 DSH 和人工审批。可对照由调用方提供稳定操作 ID、按组织绑定并回读最终状态，测重复入队与拒绝率；若无法减少不明状态或误拒绝正常任务则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-exec-hub/src/index.ts:1762-1776](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/packages/plugin-exec-hub/src/index.ts#L1762-L1776)

唤醒键与回查线索。

<details>
<summary>查看原文（15行）</summary>

```text
  guarded('POST', '/api/exec/issues/:id/wake', 'exec.write', (exchange) => {
    const input = body<{ reason?: string }>(exchange)
    const issue = hub.issues().get(exchange.params['id']!)
    if (!issue) { exchange.fail(404, 'NOT_FOUND', t('任务不存在：{id}', { id: exchange.params['id'] ?? '' })); return }
    if (!issue.assigneeAgentId) { exchange.fail(400, 'BAD_REQUEST', t('任务未指定负责人 Agent')); return }
    const wake = hub.enqueueWake({
      orgId: issue.orgId, issueId: issue.id, agentId: issue.assigneeAgentId, trigger: 'api',
      triggerDetail: input.reason ?? t('手动唤醒（{actor}）', { actor: actorOf(exchange) }),
      idempotencyKey: wakeIdempotencyKey('api', [issue.id, Date.now()]),
    })
    changeLog(exchange, 'exec.issue.wake', issue.title, wake.triggerDetail ?? '')
    return wake
  })

  guarded('GET', '/api/exec/lineage/:issueId', 'exec.read', (exchange) => hub.issueLineage(exchange.params['issueId']!))
```

</details>

**依据 2 · 源码核查**：[src/boot-all.ts:43-55](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/src/boot-all.ts#L43-L55)

存储与启动依赖。

<details>
<summary>查看原文（13行）</summary>

```text
export async function bootAll(ctx: Context, options: BootOptions): Promise<void> {
  // 装配前断言进程内只有一个 root（双实例会让 fiber 静默 PENDING，必须 fail-fast）
  assertSingleRoot(ctx)
  await ctx.plugin(platformCore, { dataDir: options.dataDir, http: { port: options.port } })
  const restored = await ctx.opsStorage.restoreAll()
  if (restored.length > 0) {
    ctx.logger('boot').info(`已从磁盘恢复 ${restored.length} 个数据集合`)
  }
  await ctx.plugin(resourceCore)
  await ctx.plugin(iam)
  await ctx.plugin(authn)
  await ctx.plugin(usage)
  await ctx.plugin(audit)
```

</details>

**依据 3 · 源码核查**：[src/boot-all.ts:94-100](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/src/boot-all.ts#L94-L100)

插件树体检。

```text
  // 装配后体检：必须在全部 await ctx.plugin 之后（此刻 fiber 都应 ACTIVE）；
  // 必需服务不可达或存在拦启动的卡死 fiber 时直接拒绝启动，禁止降级为告警放行
  // （FAILED fiber 仅在声明 provide 已被其他 ACTIVE fiber 接管时豁免，见 boot-probe.ts）
  const health = probeTree(ctx, ['opsStorage', 'platformBus', 'httpServer', 'iam', 'authn', 'usage', 'audit'])
  if (!health.ok) {
    throw new Error(formatTreeHealth(health))
  }
```

**依据 4 · 作者声明**：[README.md:46-73](https://github.com/01men/ybkkasi/blob/8ee57e08ad64ab5db335d95f1aa63b73d92690a5/README.md#L46-L73)

演示数据与部署范围。

<details>
<summary>查看原文（28行）</summary>

````text
## 快速开始

在线体验无需安装：[demo.ybkkasi.com](https://demo.ybkkasi.com/)。

本地使用 Docker Compose 启动一个只读演示实例：

```bash
git clone https://github.com/01men/ybkkasi.git
cd ybkkasi
docker compose up -d
```

打开 [http://localhost:7300](http://localhost:7300)。演示模式会让访客访问实例的只读数据，请仅在隔离的演示环境使用，不要接入真实业务数据。

作为 dsh 插件接入（`web` profile）：

```bash
dsh plugin --profile web add github:01men/ybkkasi
```

如需从源码启动独立实例，需要 Node.js ≥ 22.6：

```bash
npm ci
npm start
```

独立实例默认不注入演示数据。首次启动凭据、持久化、备份和企业部署配置见[部署指南](docs/deploy-enterprise.md)。
````

</details>

#### 缺口

- 未运行双部署、远端重试和真实用量核对
  **影响**：无法估算接入、运行和恢复工时
  **进一步探讨**：用两测试组织模拟审批拒绝、超时、重复 wake 与审计失败

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
