# 元冰可

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c2a4f1e](https://github.com/01men/ybkkasi/tree/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44)

<!-- BEGIN META -->
[![GitHub ★ 16](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=16&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)
<!-- END META -->

> **功能**：企业AI资源治理平台，管理身份、MCP/Agent等资产，提供受控调用、模型接入、计量审计与控制台。

> **亮点**：共享治理对象真正接到受控调用：调用方身份进入permit/manifest检查，预留后才经实际MCP传输，结果再回领域状态。增量是这些边界的组合，不是声明所有域已闭环或内置通用自治Agent。见[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：本地completed和去重不等完整业务恢复：同键只核参数，首次value/content没有随账本完整持久回放，网关强收据也有降级；SSE/错误/动态撤权需按实际接口验收，不能凭状态和方法名补齐。见[Q04](#research-q04)。

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
  - [Q01 · 它提供什么治理成果，独立平台、DSH插件和自主Agent如何区分？](#detail-section-11)
  - [Q02 · 一个受控MCP调用如何通过身份、授权、步骤预留和真实传输？](#detail-section-12)
  - [Q03 · 内置执行能否自主选择工具并根据结果继续？取消又意味着什么？](#detail-section-13)
  - [Q04 · 本地completed、幂等和审计能否保证外部动作及恢复一致？](#detail-section-14)
  - [Q05 · 小范围评估要什么条件，首次到退出的总负担是什么？](#detail-section-15)
  - [Q06 · 什么方向值得先验证，当前是否应全平台采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向有平台团队的多部门AI资源治理；单位成果是已授权主体完成一项真实调用并能核对结果、用量与审计，不是资产条目或演示通过。根组件是基础设施平台，见[Q01](#research-q01)。

相对分散IAM、网关和审计脚本，增加共享主体与调用状态；对个人工具需求，原生宿主加现有网关更简单。数据库事务、模型和DSH原生Agent属于依赖，不以包数归为独立创新。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 身份/资源治理 | 组织主体、能力清单、permit和受控API | 本轮核代表链，不推广全域安全验收 |
| 受控MCP调用 | 参数/风险/权限后真实HTTP执行并落账 | 明确real/demo，结果回放与强回执另验 |
| UHP模型执行 | 单轮模型、会话续接及取消交付控制 | 非通用工具循环；自主任务借宿主/外部harness |
| 运行与恢复 | 启动探针、步骤账本与存储 | 单进程和多存储/外部核验负担，退出码非办结证明 |

**流程与依赖**

身份/任用/permit与真实资源凭据是执行前提；自主任务另需消费工具结果的宿主或harness，不能由平台安装补齐。独立实例、存储和恢复责任表见[Q05](#research-q05)。

先确认一项资源的真实调用和可恢复结果，再接消费结果的Agent，最后评扩域；响应丢失时核权威系统，不能换stepKey绕过未决。操作与退出步骤见[Q05](#research-q05)。

**效果与成本**

总负担集中在权限运营、凭据、备份和外部结果对账；内部计量归因不等实际供应商账单，单步取消也不保证停止计费。四阶段明细见[Q05](#research-q05)。

当前可确认的是治理调用链的可检查性；结果返回、持久回放和任务真正完成需要不同证据。效果表见[Q05](#research-q05)，反例及当前缺口见[Q04](#research-q04)。

> **思考**：本地completed和去重不等完整业务恢复：同键只核参数，首次value/content没有随账本完整持久回放，网关强收据也有降级；SSE/错误/动态撤权需按实际接口验收，不能凭状态和方法名补齐。见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：共享治理对象真正接到受控调用：调用方身份进入permit/manifest检查，预留后才经实际MCP传输，结果再回领域状态。增量是这些边界的组合，不是声明所有域已闭环或内置通用自治Agent。见[Q02](#research-q02)、[Q03](#research-q03)。

短事务预留与网络分离、领域状态和失败停写语义可借鉴；复用时要同时绑定资源目标和结果收据，并验动态权限/协议变体。启动探针和flush不能替代外部任务关账，见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地completed和去重不等完整业务恢复：同键只核参数，首次value/content没有随账本完整持久回放，网关强收据也有降级；SSE/错误/动态撤权需按实际接口验收，不能凭状态和方法名补齐。见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先有真实匿名案件与平台/恢复责任人，再做一个资源的小样；无账实一致、结果恢复及净维护收益就不扩域，详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表治理/真实调用和单步模型路径；全域权限、外部结果恢复、自治任务及净收益未运行验证。建议观察，结果收据试点仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、packages/platform-core/src/index.ts、packages/platform-core/src/rest-gate.ts、packages/platform-core/src/sqlite.ts、packages/platform-core/src/workforce-port.ts、packages/plugin-authn/src/index.ts、packages/plugin-console/src/index.ts、packages/plugin-mcp/src/index.ts、packages/plugin-uhp/src/index.ts、packages/plugin-workforce/src/adapters/mcp.ts、packages/plugin-workforce/src/admission-service.ts、packages/plugin-workforce/src/contract.ts、packages/plugin-workforce/src/employee-service.ts、packages/plugin-workforce/src/identity-resolver.ts、packages/plugin-workforce/src/index.ts、packages/plugin-workforce/src/invocation-service.ts、packages/plugin-workforce/src/permit-service.ts、packages/plugin-workforce/src/port.ts、packages/plugin-workforce/src/repositories.ts、packages/plugin-workforce/src/routes.ts、packages/plugin-workforce/src/tools.ts、src/boot-all.ts、src/main.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整固定inventory；定向核根manifest/独立启动/插件树与DSH配置、console/authn/共享REST、workforce调用/身份/permit/策略/薄工具/存储、MCP adapter→网关→真实HTTP及结果、UHP创建/消息/单步执行/取消。未全审所有子包、UI、OAuth/凭据轮换、全部组织/风险/旁路/存储迁移和协议分支；未运行目标、作者测试、真实账户/模型/业务动作。
- 下一步：本轮仅只读源码/材料及研究装配校验；未执行npm安装、目标测试/服务、MCP、模型、演示或真实业务。后续核同键换目标、丢响应/结果恢复、SSE、撤权/租约与存储重启，再对照管理员工时及真实产物，见[Q04](#research-q04)、[Q06](#research-q06)。

**分析版本**

- **仓库**：[01men/ybkkasi](https://github.com/01men/ybkkasi)
- **版本号**：1.5.0（[固定提交 c2a4f1e](https://github.com/01men/ybkkasi/tree/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在现有permit/账本上把资源目标与可恢复结果收据绑定，再交已有宿主Agent继续决策；先用一种资源的真实匿名案件比较错结果、重复动作和管理员负担，无优势就不扩域。该增量未实现/未验证，详见[Q06](#research-q06)。

本轮仅只读源码/材料及研究装配校验；未执行npm安装、目标测试/服务、MCP、模型、演示或真实业务。后续核同键换目标、丢响应/结果恢复、SSE、撤权/租约与存储重启，再对照管理员工时及真实产物，见[Q04](#research-q04)、[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 164 | 26526 | — | — | 452298 |
| .ts | source | 153 | 55353 | 42970 | 8680 | — |
| .mjs | source | 46 | 18938 | 13494 | 4709 | — |
| .js | source | 57 | 23625 | 21108 | 1494 | — |
| .mjs | test | 30 | 6778 | 5477 | 922 | — |
| .tsx | source | 2 | 267 | 194 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：围绕一个企业AI资源的真实授权调用，核身份/permit/工具结果/恢复，并区分基础设施、内置单步模型与外部Agent循环，决定是否值得治理试点。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它提供什么治理成果，独立平台、DSH插件和自主Agent如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

元冰可是private monorepo根组件，声明dsh-enterprise-ops1.5.0、MIT，真实类型是基础设施平台。src/main创建自己的Cordis宿主，bootAll装配身份、资源、模型/MCP网关、执行与协作域；另一条DSH补丁路径关闭自带HTTP/ToolRuntime，复用宿主工具运行时并经桥接暴露界面/API。不能把根平台当一个低负担个人工具，也不能把所有子包能力和版本无条件加给根条目。

对象是有平台工程和权限运营能力、要治理多部门AI资源的组织。可验收的单位任务应是一个已认证主体在真实授权内调用一项资源，拿到正确业务结果，并能对应调用、用量、审计及恢复；资产条目、控制台或测试数量不算完成。对照分散IAM、网关和审计脚本，源码增量是共用主体、能力清单、permit与步骤账本衔接执行面；原生数据库事务、DSH Agent与模型协议不是本平台原创。

这套基础设施能给Agent提供受控接口，不能由此推出独立宿主内置了通用自主工具循环。当前UHP内置执行是一轮真实模型调用，多轮previous_response续接也不等同于模型自行选工具、执行后继续推理。DSH装配可利用原生宿主Agent，外部harness也可另行编排；这些循环的能力与运行验收应归相应宿主/集成，而非从平台名称推断。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-14](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/package.json#L1-L14)

根平台身份、版本与workspace声明。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-enterprise-ops",
  "version": "1.5.0",
  "private": true,
  "type": "module",
  "description": "企业 AI 资源统一管理平台 —— 基于 DeepSeek Harness「一切皆插件」架构",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/01men/ybkkasi.git"
  },
```

</details>

**依据 2 · 源码核查**：[src/main.ts:5-24](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/main.ts#L5-L24)

实际独立Cordis启动。

<details>
<summary>查看原文（20行）</summary>

```text
import { Context } from '@deepseek-ai/cordis'
import { bootAll } from './boot-all.ts'

const args = process.argv.slice(2)
function argValue(flag: string, fallback?: string): string | undefined {
  const index = args.indexOf(flag)
  return index >= 0 ? args[index + 1] : fallback
}

const ctx = new Context()
const port = Number(argValue('--port', '7300'))
const dataDir = argValue('--data', './data')

process.on('unhandledRejection', (reason) => {
  console.error('[main] 未处理的 Promise 拒绝', reason)
})

await bootAll(ctx, { dataDir, port })

const logger = ctx.logger('main')
```

</details>

**依据 3 · 源码核查**：[src/boot-all.ts:45-63](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/boot-all.ts#L45-L63)

恢复与核心治理域装配。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/boot-all.ts:78-99](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/boot-all.ts#L78-L99)

workforce/UHP/A2A与启动探针。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:13-26](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/cordis.patch.yml#L13-L26)

DSH装配复用工具运行时、关闭独立HTTP。

<details>
<summary>查看原文（14行）</summary>

```text
# 行为与 cordis.yml 一致：
#   - provideToolRuntime=false：复用 dsh 原生 ToolRuntime（服务键 tools），
#     平台插件注册的全部运维工具将直接进入 dsh 工具注册表、对模型可见、可被调用
#   - startHttp=false + plugin-dsh-bridge：元冰可数据面（REST/控制台 SPA/docs/mcp）
#     以 /rq 前缀挂进 dsh webServer——单进程单入口，无需另起独立进程
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

</details>

**依据 6 · 源码核查**：[packages/platform-core/src/index.ts:61-69](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/platform-core/src/index.ts#L61-L69)

真正按配置决定是否挂ToolRuntimeLite。

```text
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
```

**依据 7 · 源码核查**：[packages/plugin-uhp/src/index.ts:564-585](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L564-L585)

内置执行实际只调用一次modelGateway并保存文本。

<details>
<summary>查看原文（22行）</summary>

```text
      const messages = JSON.parse(record.messagesJson) as Array<{ role: string; content: string }>
      const result = await this.ctx.modelGateway.invoke({
        model,
        orgId: agent.orgId ?? '',
        subject: `agent:${agent.id}`,
        dataClass: record.dataClass,
        messages,
      })
      if (this.cancelRequested.has(record.id)) {
        // 协作取消语义：结果不交付、不回写输出（取消方已收到 canceled 终态）
        this.cancelRequested.delete(record.id)
        this.auditExecution(this.responses().get(record.id)!, agent, 'uhp.invoke.canceled_after_completion', 'ok',
          t('模型已返回但任务已取消，结果不交付（取消语义）'))
        this.emitProgress(this.responses().get(record.id), 'canceled')
        return
      }
      this.responses().update(record.id, {
        status: 'completed',
        outputText: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一个受控MCP调用如何通过身份、授权、步骤预留和真实传输？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

代表链路从POST /api/workforce/invocations进入，console中间件从Bearer调用authn.verify并组装主体，shared guarded检查workforce.invoke，callerRef取中间件principal而非请求体自报员工。authn实际核HMAC签名、签发方/过期、持久token记录、撤销和主体active，并实时解角色权限；OBO/委托又夹紧到签发范围。这里核的是所读代表入口，不能推广为全部公开/票据/桥接路由都已完整审计。

InvocationService验证active/未过期/同主体permit及run/lease字段存在，解析manifest工具，校参数Schema和业务范围，再在SQLite短事务按runId+stepKey预留；同键异参拒绝，同键已存在走回放。网络执行不在事务里。MCP adapter按服务端work上下文构造Agent caller并带permit/run引用，调用资源网关；网关有工作策略闸门、风险/原有权限裁决，最终realTransport用真实HTTP JSON-RPC tools/call，取得结果再结算状态。

这是真正的外部调用接线，不是只登记一个接口或产生候选计划。初次completed可把业务value/content传给REST/运行时工具调用方；denied、approval_required、rate_limited、failed、outcome_unknown各有领域语义，不能把HTTP200当办结。事务只覆盖本地预留/账本，外部系统不在同一事务，是否被接受和交付仍须看真实回执。

服务还存在明确降级：MCP exec非real走确定性模拟，新建与存量数据的配置要核清；演示结果不能计为真实工具动作。workforce调用API与DSH薄工具都接同一服务，工具返回结果供外部调用者继续处理，平台内置UHP不会自动拿该结果进入下一轮模型。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-console/src/index.ts:160-200](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-console/src/index.ts#L160-L200)

代表API认证与demo分支。

<details>
<summary>查看原文（41行）</summary>

```text
    // 取流自校验通道：?ticket=（一次性/10 分钟票据）与 ?sig=（签名分享链接，exp/sub/jti/sig 四参）——
    // 两者都是「URL 即凭证」，免 Bearer 头；真实性在 GET /fs/file 处理器内逐关验证（fail-closed）
    const nasFileStream = /^\/api\/nas\/[^/]+\/fs\/file$/.test(exchange.path)
    const ticketDownload = nasFileStream && Boolean(exchange.query.get('ticket'))
    const signedLinkDownload = nasFileStream && Boolean(exchange.query.get('sig'))
    if (!exchange.path.startsWith('/api/') || PUBLIC_PATHS.has(exchange.path) || PUBLIC_PATH_PREFIXES.some((prefix) => exchange.path.startsWith(prefix)) || ticketDownload || signedLinkDownload) return
    const header = String(exchange.headers['authorization'] ?? '')

    // 演示只读态（DEMO_MODE=1）：无 Bearer 时注入固定只读主体。
    // 权限集为白名单 `.read` 枚举（见 demo-mode.ts），后续每个 guarded 路由的
    // requirePermission 照常生效——写类路由自然 403，此处不另建拦截层。
    if (!header && demo) {
      // 纵深防御：写方法入口即拒。覆盖「路由漏声明权限点」这类遗漏面（第一道闸是权限集无写点）。
      if (!READONLY_METHODS.has(exchange.method.toUpperCase())) {
        exchange.fail(405, 'DEMO_READONLY', t('演示模式为只读，不支持写操作。请自行部署后体验完整功能。'))
        return true
      }
      // 演示态同样经统一 Principal 组装（authMethod='demo'）：unified 面与真实令牌同构，
      // 权限集仍为白名单 .read 枚举，后续 requirePermission 照常生效。
      const demoVerified = {
        principal: { id: DEMO_PRINCIPAL_ID, type: 'human' as const, refType: 'user' as const, refId: DEMO_PRINCIPAL_ID, name: DEMO_PRINCIPAL_NAME },
        token: { jti: DEMO_PRINCIPAL_ID, issuedBy: 'demo' },
        scopes: [...DEMO_READONLY_PERMISSIONS],
        actChain: [],
      }
      exchange.principal = await assemblePrincipal(demoVerified)
      return
    }

    if (!header.startsWith('Bearer ')) {
      exchange.fail(401, 'UNAUTHORIZED', t('缺少 Bearer 令牌，请先登录'))
      return true
    }
    try {
      const verified = ctx.authn.verify(header.slice(7))
      exchange.principal = await assemblePrincipal(verified)
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      exchange.fail(401, 'TOKEN_INVALID', message)
      return true
```

</details>

**依据 2 · 源码核查**：[packages/plugin-authn/src/index.ts:625-630](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-authn/src/index.ts#L625-L630)

HMAC签名实际校验，非只按方法名推断。

```text

  /** 校验签名：先当前密钥，再宽限期内的退役密钥（轮换在途兼容）。 */
  private signatureMatches(body: string, signature: string): boolean {
    const candidates = [this.signingSecret, ...this.retiredSecrets.filter((item) => Date.now() - item.retiredAt < SECRET_GRACE_MS).map((item) => item.secret)]
    return candidates.some((secret) => createHmac('sha256', secret).update(body).digest('base64url') === signature)
  }
```

**依据 3 · 源码核查**：[packages/plugin-authn/src/index.ts:1079-1100](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-authn/src/index.ts#L1079-L1100)

真实签名、记录/撤销/主体检查。

<details>
<summary>查看原文（22行）</summary>

```text
  verify(tokenString: string, options: { audience?: string } = {}): VerifiedPrincipal {
    const parts = tokenString.split('.')
    if (parts.length !== 3 || parts[0] !== 'dst1') throw new Error(t('令牌格式不合法'))
    if (!this.signatureMatches(parts[1]!, parts[2]!)) throw new Error(t('令牌签名校验失败'))
    let payload: any
    try {
      payload = JSON.parse(Buffer.from(parts[1]!, 'base64url').toString('utf8'))
    } catch {
      throw new Error(t('令牌载荷解析失败'))
    }
    if (payload.iss !== 'dsh-ops-authn') throw new Error(t('令牌签发方（iss）不匹配'))
    if (payload.exp * 1000 < Date.now()) throw new Error(t('令牌已过期'))
    if (options.audience !== undefined) {
      if (payload.aud === undefined) throw new Error(t('令牌未绑定受众（aud），目标服务要求受众校验'))
      if (payload.aud !== options.audience) throw new Error(t('令牌受众不匹配：期望 {expected}，实际 {actual}', { expected: options.audience, actual: payload.aud }))
    }
    const record = this.tokens().get(payload.jti)
    if (!record) throw new Error(t('令牌不存在或已被清理'))
    if (record.revokedAt) throw new Error(t('令牌已被吊销：{reason}', { reason: record.revokedReason ?? t('策略吊销') }))
    const principal = this.principals().get(record.principalId)
    if (!principal) throw new Error(t('令牌主体不存在'))
    if (principal.status !== 'active') throw new Error(t('令牌主体已禁用'))
```

</details>

**依据 4 · 源码核查**：[packages/plugin-authn/src/index.ts:1101-1113](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-authn/src/index.ts#L1101-L1113)

实时权限与委托交集。

<details>
<summary>查看原文（13行）</summary>

```text
    // 人机均实时解析：human 按用户角色、machine 按机器角色+附加权限点，角色变更即时同步到存量令牌
    let scopes = principal.type === 'human'
      ? this.ctx.iam.userPermissions(principal.refId ?? '')
      : this.resolveMachineScopes(principal)
    // QA A-07：OBO 令牌签发时 scopes 取「父链 ∩ 目标」交集——验签若只按主体实时解析，
    // 交集即被丢弃（透传令牌反而拿到目标全量权限）。对 OBO 签发的令牌按签发交集二次夹紧：
    // 实时权限收缩仍然生效（交集），但不再放大出签发时刻授予之外的能力。
    // MCP 治理（契约 §3）：delegate: 前缀的委托令牌同口径（签发时已做三方交集，实时只收不放）。
    if (record.issuedBy?.startsWith('obo:') || record.issuedBy?.startsWith('delegate:')) {
      scopes = intersectScopes(scopes, record.scopes)
    }
    this.tokens().update(record.id, { lastUsedAt: new Date().toISOString() })
    return { principal, token: record, scopes, actChain: record.actChain }
```

</details>

**依据 5 · 源码核查**：[packages/platform-core/src/rest-gate.ts:86-111](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/platform-core/src/rest-gate.ts#L86-L111)

权限检查与实际HTTP包装。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[packages/plugin-workforce/src/routes.ts:318-333](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/routes.ts#L318-L333)

从认证上下文调用服务并返回领域状态。

<details>
<summary>查看原文（16行）</summary>

```text

  // -- 受控调用账本 ---------------------------------------------------------

  gate.guarded('POST', '/api/workforce/invocations', 'workforce.invoke', async (exchange) => {
    const svc = services(ctx)
    const body = readBody(exchange)
    const outcome = await svc.invocations.invoke(callerRefOf(gate, exchange), {
      permitId: String(body['permitId'] ?? ''),
      toolHandle: String(body['toolHandle'] ?? ''),
      stepKey: String(body['stepKey'] ?? ''),
      arguments: body['arguments'],
      ...(typeof body['traceId'] === 'string' && body['traceId'] ? { traceId: body['traceId'] } : {}),
    })
    // 领域状态与 HTTP 状态分开保留（§9.3：不以 HTTP 200 冒充业务成功，也不以 4xx 丢失领域状态）
    return { ok: outcome.status === 'completed', ...outcome }
  })
```

</details>

**依据 7 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:101-138](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L101-L138)

permit/工具/参数校验和步骤预留查重。

<details>
<summary>查看原文（38行）</summary>

```text
  async invoke(caller: WorkCallerRef, request: InvocationRequest): Promise<InvocationOutcome> {
    const started = Date.now()
    // 1. permit 校验（存在/active/未过期/主体一致/run+租约绑定）
    const permit = await this.admission().verifyPermit(caller, request.permitId, { requireRun: true })
    const capabilities = this.capabilities()
    const manifest = capabilities.get(permit.manifestId)
    const tool = capabilities.resolveTool(permit.manifestId, request.toolHandle)
    if (!tool) {
      // 清单在而句柄不在＝未授予；清单本身缺失＝句柄无法解析
      throw new WorkforceError('TOOL_NOT_GRANTED', t('工具句柄 {handle} 未列入本任用能力清单（manifest v{version}）', { handle: request.toolHandle, version: manifest.version }))
    }
    // 2. stepKey 词法校验（§9.3：调用方提出的业务引用，不是可信身份）＋参数 schema＋业务范围
    if (!STEP_KEY_PATTERN.test(request.stepKey)) {
      throw new WorkforceError('ARGUMENT_SCOPE_DENIED', t('stepKey 非法：须为 1-96 位字母/数字/点/下划线/连字符，且以字母或数字开头'))
    }
    let args: Record<string, unknown>
    // validateAgainstSchema(值, schema) 返回「首条中文错误消息 | null」（非转换器）：
    // 先做 object 根检查，再校验；原实现把实参顺序与返回约定同时误用，invoke 恒拒（selftest 实证）
    const rawArgs = request.arguments ?? {}
    if (!rawArgs || typeof rawArgs !== 'object' || Array.isArray(rawArgs)) {
      throw new WorkforceError('ARGUMENT_SCOPE_DENIED', t('参数必须为 JSON 对象（object 根）'))
    }
    const violation = validateAgainstSchema(rawArgs, tool.parameters ?? { type: 'object', properties: {} })
    if (violation) {
      throw new WorkforceError('ARGUMENT_SCOPE_DENIED', t('参数校验未通过：{violation}', { violation }))
    }
    args = rawArgs as Record<string, unknown>
    this.assertBusinessScope(tool, args)
    const argsHash = argsHashOf(args)

    // 3. 事务内预留（网络调用严禁入内，§9.4）：runId+stepKey 唯一约束承载步骤幂等
    const reserved = this.store.txn(() => {
      const prior = this.store.invocations.findWhere({ runId: permit.runId, stepKey: request.stepKey })[0]
      if (prior) {
        if (prior.argsHash !== argsHash) {
          throw new WorkforceError('STEP_ARGUMENT_CONFLICT', t('步骤 {stepKey} 已绑定不同参数（冲突拒绝，不能覆盖原动作）', { stepKey: request.stepKey }), 409)
        }
        return { replay: true as const, record: prior }
```

</details>

**依据 8 · 源码核查**：[packages/platform-core/src/sqlite.ts:125-137](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/platform-core/src/sqlite.ts#L125-L137)

真实BEGIN/COMMIT/ROLLBACK实现。

<details>
<summary>查看原文（13行）</summary>

```text
  txn<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE')
    try {
      const result = fn()
      this.db.exec('COMMIT')
      return result
    } catch (error) {
      try {
        this.db.exec('ROLLBACK')
      } catch {
        /* 连接异常时回滚失败仅记录 */
      }
      throw error
```

</details>

**依据 9 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:173-198](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L173-L198)

事务外adapter调用和结算。

<details>
<summary>查看原文（26行）</summary>

```text
    // 4. 事务外：任用/租约复核（§9.4 revalidate）→ 适配器缺席 denied → 网络调用
    const appointment = this.store.appointments.get(permit.appointmentId)
    if (!appointment || appointment.status !== 'effective') {
      return this.settle(reserved.record, 'denied', {
        code: 'APPOINTMENT_NOT_EFFECTIVE',
        message: t('任用已不在生效状态，停止本步骤调用'),
      }, started)
    }
    const adapter = this.adapters.get(tool.kind)
    if (!adapter) {
      return this.settle(reserved.record, 'denied', {
        code: 'TOOL_NOT_GRANTED',
        message: t('该资源类型（{kind}）未登记适配器，拒绝调用', { kind: tool.kind }),
      }, started)
    }

    const work = this.workContextOf(permit, appointment, request.traceId)
    let result: AdapterInvokeResult
    try {
      result = await adapter.invoke({ work, tool, args, invocationId: reserved.record.id })
    } catch (error) {
      result = { ok: false, message: t('适配器执行异常：{message}', { message: error instanceof Error ? error.message : String(error) }) }
    }

    // 5. settle：AdapterInvokeResult → InvocationOutcome（§9.3 状态语义）
    return this.settleFromAdapter(reserved.record, result, started)
```

</details>

**依据 10 · 源码核查**：[packages/plugin-workforce/src/adapters/mcp.ts:87-111](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/adapters/mcp.ts#L87-L111)

实际调用MCP网关并返回业务value。

<details>
<summary>查看原文（25行）</summary>

```text
      // 授权事实（permit/租约/清单/参数范围）一律由网关侧服务端回查。stepKey 不在
      // WorkExecutionContext（账本层唯一约束承载步骤幂等），故不透传。
      const workRef: WorkRefIndex = {
        permitId: work.permitId,
        ...(work.runId ? { runId: work.runId } : {}),
        ...(work.issueId ? { issueId: work.issueId } : {}),
        ...(work.traceId ? { traceId: work.traceId } : {}),
      }
      const result = await hub.invoke(caller, input.tool.registryId, input.tool.action, input.args, workRef)
      if (result.ok) {
        // 网关暂未回传调用 ID/usage 事件 ID（组4 additive 前诚实缺省，不伪造）
        return {
          ok: true,
          value: result.result,
          gatewayRef: {
            note: 'mcp 网关暂未回传调用ID',
            status: result.status,
            version: result.version,
            latencyMs: result.latencyMs,
            workRef: `${work.runId}/${input.invocationId}`,
            argsHash: sha256Hex(JSON.stringify(input.args)).slice(0, 16),
          },
        }
      }
      return {
```

</details>

**依据 11 · 源码核查**：[packages/plugin-mcp/src/index.ts:1660-1677](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L1660-L1677)

工作授权闸门来自服务端。

<details>
<summary>查看原文（18行）</summary>

```text
    const registeredRisk = this.riskRegistryRef?.effectiveRisk(serviceId, toolName)
    const gateRisk: 'read' | 'write' | 'admin' | 'unknown' = registeredRisk
      ?? (toolSpec?.riskLevel && toolSpec.riskLevel !== 'unknown' ? toolSpec.riskLevel : 'unknown')
    gateRiskLevel = gateRisk
    const gate = await gateManagedWork(workforcePolicyOf(this.ctx), callerRef, {
      facts: { kind: 'mcp', registryId: serviceId, action: toolName, risk: gateRisk },
      ...(workRef ? { ref: workRef } : {}),
      // 参数摘要哈希（便宜可算）：用于 workforce 步骤冲突判定与审计（与调用记录 argsHash 同源）
      argsHash,
    })
    if (gate.mode === 'denied') {
      const message = t('数字员工调用被拒绝：{detail}', { detail: `${WORK_DENY_CODE_LABELS[gate.code]}${gate.message ? `（${gate.message}）` : ''}` })
      const latencyMs = Date.now() - started
      // 拒绝同样落调用记录（V07：拒绝是事实，按原 status='denied' 口径留存并附领域拒绝码；
      // 工作上下文仅在放行时由服务端核验产生，拒绝路径无可关联的 work 事实）
      this.recordCall(service, toolName, caller, {
        ok: false, status: 'denied', latencyMs, version: service.currentVersion, error: message, code: gate.code,
        traceId, argsHash, riskLevel: gateRisk,
```

</details>

**依据 12 · 源码核查**：[packages/plugin-mcp/src/index.ts:1705-1725](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L1705-L1725)

真实PDP调用和拒绝分支。

<details>
<summary>查看原文（21行）</summary>

```text

    // 资源级授权 + 组织硬约束 + 风险闸（W3-T5 契约 §11：主裁决迁 PDP）——
    // 模块序：iam-permission（资源限定 scope 第一层）→ mcp-permgroup（既有 authorize 判定面，
    // 文案/领域码逐字等价）→ scene（可选场景 ABAC）→ org-constraint（§13 三态）→
    // risk-gate（unknown 写语境拒绝）。deny 优先、reasons 聚合：首个 deny 模块的理由即
    // 主因（error 文案与既有完全一致），领域码取首个 deny 模块的 deny-code 义务。
    const decision = await this.decideViaPdp({
      caller, service, toolName, gateRisk,
      gateMode: gate.mode,
      traceId,
    })
    if (!decision.allow) {
      const reason = decision.reasons[0] ?? t('调用被策略拒绝（PDP）')
      const denyCode = McpService.denyCodeOf(decision)
      const latencyMs = Date.now() - started
      // 拒绝同样落调用记录（V07 口径：拒绝是事实，按 status='denied' 留存并附领域拒绝码与决策表达）
      this.recordCall(service, toolName, caller, {
        ok: false, status: 'denied', latencyMs, version: service.currentVersion, error: reason,
        ...(denyCode !== undefined ? { code: denyCode } : {}),
        traceId, argsHash, riskLevel: gateRisk,
        decisionId: decision.decisionId, decisionReasons: decision.reasons,
```

</details>

**依据 13 · 源码核查**：[packages/plugin-mcp/src/index.ts:1741-1761](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L1741-L1761)

demo与real执行分支。

<details>
<summary>查看原文（21行）</summary>

```text
    // 执行传输层：real = 真实 HTTP JSON-RPC；demo = 确定性模拟（显式降级，恒成功、结果可复现）。
    // 存量演示数据（无 exec 字段）按 demo 兜底——新建服务缺省一律 real。
    let tokens = 0
    let result: unknown
    let upstreamStatus: number | undefined
    if (service.exec !== 'real') {
      await sleep(simulateLatency(service, toolName))
      tokens = 200 + (Number.parseInt(sha256Hex(JSON.stringify(args)).slice(0, 6), 16) % 1800)
      result = mockToolResult(service, toolName, args)
    } else {
      // W3-T5 §14：下游转发带 traceparent 头（W3C Trace Context，version 00）
      const transportResult = await this.realTransport(service, toolName, args, traceId)
      if (!transportResult.ok) {
        // 业务失败计入熔断（评审修复：熔断不能只依赖 30s 探活，真实调用失败同样累计）
        this.noteBusinessFailure(service, transportResult.error ?? t('MCP 服务调用失败'))
        return fail('error', transportResult.error ?? t('MCP 服务调用失败'), workRefForRecord)
      }
      this.noteBusinessSuccess(service)
      result = transportResult.result
      tokens = transportResult.tokens
      upstreamStatus = transportResult.upstreamStatus
```

</details>

**依据 14 · 源码核查**：[packages/plugin-mcp/src/index.ts:1799-1810](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L1799-L1810)

真实tools/call构造。

<details>
<summary>查看原文（12行）</summary>

```text
  private async realTransport(service: McpServiceRecord, toolName: string, args: Record<string, unknown>, traceId?: string): Promise<{ ok: true; result: unknown; tokens: number; upstreamStatus?: number } | { ok: false; error: string }> {
    // W1-T2 §6 注入点：外呼头统一经 SecretBroker 组装（存量非敏感 headers 照旧、凭证覆盖同名键）
    const headers = await this.resolveCallHeaders(service)
    // W3-T5 §14：下游 HTTP 转发带 traceparent 头（traceId 缺省不产头——探活/工具发现等旁路面无需）
    if (traceId) headers['traceparent'] = formatTraceparent(traceId)
    const call = (sessionId?: string) => this.mcpRequest(service.endpoint, headers, {
      jsonrpc: '2.0',
      id: `dsh-${Date.now()}`,
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    }, REAL_TRANSPORT_TIMEOUT_MS, sessionId)
    try {
```

</details>

**依据 15 · 源码核查**：[packages/plugin-mcp/src/index.ts:990-1009](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L990-L1009)

实际fetch和超时/HTTP处理。

<details>
<summary>查看原文（20行）</summary>

```text
   */
  private async mcpRequest(endpoint: string, headers: Record<string, string> | undefined, message: Record<string, unknown>, timeoutMs: number, sessionId?: string): Promise<{ payload: any; sessionId?: string; status?: number }> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
          ...(headers ?? {}),
        },
        body: JSON.stringify(message),
        signal: controller.signal,
      })
      if (!response.ok) {
        throw new Error(t('MCP 服务 HTTP {status}：{body}', { status: response.status, body: (await response.text().catch(() => '')).slice(0, 200) }))
      }
      // 上游 HTTP 状态（W3-T5 §14 upstreamStatus 回填源；additive，既有调用方零感知）
```

</details>

**依据 16 · 源码核查**：[packages/plugin-workforce/src/tools.ts:151-166](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/tools.ts#L151-L166)

实际运行时工具透传服务结果。

<details>
<summary>查看原文（16行）</summary>

```text
      let caller: WorkCallerRef
      try {
        caller = callerRefOf(exec.principal)
      } catch (error) {
        return failureOf(error)
      }
      try {
        const outcome: InvocationOutcome = await structuredServices(ctx).invocations.invoke(caller, {
          permitId: String(args.permitId ?? ''),
          toolHandle: String(args.toolHandle ?? ''),
          stepKey: String(args.stepKey ?? ''),
          arguments: args.arguments,
          ...(typeof args.traceId === 'string' && args.traceId ? { traceId: args.traceId } : {}),
        })
        // 按领域状态透传（中文 message），不以 HTTP/工具成功冒充业务成功
        return outcome
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 内置执行能否自主选择工具并根据结果继续？取消又意味着什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

当前内置runtime=dsh的UHP执行没有工具决策循环。createResponse把请求级tools/functions/mcp_servers记入ignoredFields，不将其变为执行工具；构造的messages是system/user及上一响应的assistant文本。run只调用一次modelGateway.invoke，再把result.content、token和模型保存到completed记录。这是有生命周期/续接的真实模型执行，不是模型工具执行Agent。

另一条workforce_invoke有真正受控工具执行，工具定义的execute从exec.principal取caller并调用服务、返回领域结果。要形成“看结果再选下一步”，需要DSH原生Agent或外部harness消费这个结果，再提出后续调用。DSH补丁选择复用宿主ToolRuntime只是接入条件，不是本次已经运行通过的完整Agent loop；不能以多个包、A2A/UHP名称或任务状态数量补足这段证据。

UHP取消检查cancelRequested，在模型已返回但任务已取消时不交付/不回写输出。所读模型调用参数没有传入取消signal，不能把逻辑取消解释为已经中止供应商计算或退回费用。上一响应续接会核agent与记录属主，属于积极归属边界；真实重试、取消竞态和外部harness会话隔离仍须运行验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-uhp/src/index.ts:798-816](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L798-L816)

HTTP处理器真正调用createResponse并传认证主体。

<details>
<summary>查看原文（19行）</summary>

```text
      const record = await gateway.createResponse({
        agentId: agent.id,
        harnessRef,
        inputText,
        dataClass,
        ...(body.previous_response_id ? { previousResponseId: body.previous_response_id } : {}),
        idempotencyKey,
        ...(typeof metadata['ybk_context_id'] === 'string' ? { contextId: metadata['ybk_context_id'] } : {}),
        ...(metadata['ybk_session_policy'] === 'employee-bound' ? { sessionPolicy: 'employee-bound' as const } : {}),
        callerPrincipalId: verified.principal.id,
        callerName: verified.principal.name,
        callerKind: verified.principal.type === 'human' ? 'human' : 'machine',
        ...(verified.actChain.length > 0 ? { actChain: verified.actChain.map((e) => ({ principalId: '', name: e.name, type: e.type })) } : {}),
        ...(onBehalfUser ? { onBehalfUser } : {}),
        // 越权原语封堵：请求级 tools/functions/mcp_servers（顶层或 metadata 携带）一律接受不生效
        requestTools: body.tools !== undefined ? body.tools : metadata['tools'],
        ...(body.functions !== undefined || metadata['functions'] !== undefined ? { requestFunctions: body.functions ?? metadata['functions'] } : {}),
        ...(body.mcp_servers !== undefined || metadata['mcp_servers'] !== undefined ? { requestMcpServers: body.mcp_servers ?? metadata['mcp_servers'] } : {}),
      })
```

</details>

**依据 2 · 源码核查**：[packages/plugin-uhp/src/index.ts:387-396](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L387-L396)

创建记录后启动真实run。

<details>
<summary>查看原文（10行）</summary>

```text
        ybk_data_class: requested,
        ...(input.onBehalfUser ? { ybk_on_behalf_user: input.onBehalfUser } : {}),
        ignored_fields: ignoredFields,
      }),
    })
    this.run(record.id).catch((error) => {
      this.ctx.logger('uhp').error(`UHP 执行异常（response=${record.id}）`, error)
    })
    return record
  }
```

</details>

**依据 3 · 源码核查**：[packages/plugin-uhp/src/index.ts:335-360](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L335-L360)

忽略动态工具与基于文本的会话续接。

<details>
<summary>查看原文（26行）</summary>

```text
    // 越权原语封堵：请求级 tools/functions/mcp_servers 一律接受但不生效，留痕 ignored_fields（协作方案 §7.2）
    const ignoredFields: string[] = []
    if (input.requestTools !== undefined) ignoredFields.push('tools')
    if (input.requestFunctions !== undefined) ignoredFields.push('functions')
    if (input.requestMcpServers !== undefined) ignoredFields.push('mcp_servers')
    // 会话续接（Q-23）：继承上一响应的 sessionId（使 session_id 成为可靠归组键），
    // 并把上一轮 assistant 回答回填进上下文——否则被调方「不知道自己上一轮说了什么」
    let messages: Array<{ role: string; content: string }> = []
    let inheritedSessionId = ''
    if (input.previousResponseId) {
      const prev = this.responses().get(input.previousResponseId)
      if (!prev) throw new Error(t('previous_response_id 不存在：{id}', { id: input.previousResponseId }))
      if (prev.agentId !== agent.id) throw new Error(t('previous_response_id 属于其他执行体，拒绝跨 harness 会话续接'))
      // 归属校验（Q-3 纵深）：会话续接仅限记录属主或其组织内持 uhp.read 的治理视图
      this.assertResponseAccess(prev, input.callerPrincipalId, ['uhp.read'])
      inheritedSessionId = prev.sessionId
      messages = JSON.parse(prev.messagesJson) as Array<{ role: string; content: string }>
      if (prev.outputText) messages = [...messages, { role: 'assistant', content: prev.outputText }]
    }
    const sessionPolicy = input.sessionPolicy ?? 'task-bound'
    const sessionId = sessionPolicy === 'task-bound'
      ? (input.taskId ?? (inheritedSessionId || newId('uhpsess')))
      : `emp:${agent.id}:${input.callerPrincipalId}`
    const systemPrompt = this.systemPromptFor(agent)
    if (!messages.some((item) => item.role === 'system')) messages = [{ role: 'system', content: systemPrompt }, ...messages]
    messages = [...messages, { role: 'user', content: input.negotiationNote ? `${input.inputText}\n\n（协商附注：${input.negotiationNote}）` : input.inputText }]
```

</details>

**依据 4 · 源码核查**：[packages/plugin-uhp/src/index.ts:559-585](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L559-L585)

单次模型调用及取消后不交付分支。

<details>
<summary>查看原文（27行）</summary>

```text
    this.inflight.set(record.taskId ?? record.id, record.id)
    this.responses().update(record.id, { status: 'in_progress' })
    this.emitProgress(this.responses().get(record.id)!, 'started')
    try {
      if (record.taskId) this.inflight.set(record.taskId, record.id)
      const messages = JSON.parse(record.messagesJson) as Array<{ role: string; content: string }>
      const result = await this.ctx.modelGateway.invoke({
        model,
        orgId: agent.orgId ?? '',
        subject: `agent:${agent.id}`,
        dataClass: record.dataClass,
        messages,
      })
      if (this.cancelRequested.has(record.id)) {
        // 协作取消语义：结果不交付、不回写输出（取消方已收到 canceled 终态）
        this.cancelRequested.delete(record.id)
        this.auditExecution(this.responses().get(record.id)!, agent, 'uhp.invoke.canceled_after_completion', 'ok',
          t('模型已返回但任务已取消，结果不交付（取消语义）'))
        this.emitProgress(this.responses().get(record.id), 'canceled')
        return
      }
      this.responses().update(record.id, {
        status: 'completed',
        outputText: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
```

</details>

**依据 5 · 源码核查**：[packages/plugin-workforce/src/tools.ts:124-166](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/tools.ts#L124-L166)

真实工具定义、principal与服务执行结果。

<details>
<summary>查看原文（43行）</summary>

```text
  tools.register(defineTool({
    name: 'workforce_invoke',
    plugin: 'workforce',
    permission: 'workforce.invoke',
    description: '数字员工受控资源调用：permit + 工具句柄 + 业务步骤键（stepKey）+ 参数。返回领域状态（completed/denied/approval_required/rate_limited/failed/outcome_unknown）——denied 停止该动作不换入口重试；outcome_unknown 先核验禁止自动重写。',
    parameters: {
      permitId: { type: 'string', required: true, description: '工作授权 permit（workforce_claim 返回）' },
      toolHandle: { type: 'string', required: true, description: '工具句柄（能力清单下发，形如 registry.action）' },
      stepKey: { type: 'string', required: true, description: '业务步骤键（同步骤同参数幂等；不同参数冲突拒绝）' },
      arguments: { type: 'object', description: '调用参数（须在句柄参数 schema 与业务范围约束内）' },
      traceId: { type: 'string', description: '工作 trace 引用（可选索引）' },
    },
    output: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['completed', 'denied', 'approval_required', 'rate_limited', 'failed', 'outcome_unknown', 'cancelled'] },
        invocationId: { type: 'string' },
        value: {},
        content: { type: 'string' },
        gatewayRef: { type: 'object' },
        code: { type: 'string' },
        message: { type: 'string' },
        approvalRef: { type: 'string' },
      },
      required: ['status', 'invocationId'],
    },
    async execute(args, exec: ToolRunContext) {
      let caller: WorkCallerRef
      try {
        caller = callerRefOf(exec.principal)
      } catch (error) {
        return failureOf(error)
      }
      try {
        const outcome: InvocationOutcome = await structuredServices(ctx).invocations.invoke(caller, {
          permitId: String(args.permitId ?? ''),
          toolHandle: String(args.toolHandle ?? ''),
          stepKey: String(args.stepKey ?? ''),
          arguments: args.arguments,
          ...(typeof args.traceId === 'string' && args.traceId ? { traceId: args.traceId } : {}),
        })
        // 按领域状态透传（中文 message），不以 HTTP/工具成功冒充业务成功
        return outcome
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:13-26](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/cordis.patch.yml#L13-L26)

原生宿主工具运行时接入边界。

<details>
<summary>查看原文（14行）</summary>

```text
# 行为与 cordis.yml 一致：
#   - provideToolRuntime=false：复用 dsh 原生 ToolRuntime（服务键 tools），
#     平台插件注册的全部运维工具将直接进入 dsh 工具注册表、对模型可见、可被调用
#   - startHttp=false + plugin-dsh-bridge：元冰可数据面（REST/控制台 SPA/docs/mcp）
#     以 /rq 前缀挂进 dsh webServer——单进程单入口，无需另起独立进程
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

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地completed、幂等和审计能否保证外部动作及恢复一致？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

本地账本能减少同一步骤重复执行，但不能单独证明跨系统exactly-once。查重键是runId+stepKey，命中后只比较argsHash，未在该分支再比较registryId/action；因此同键同参换工具目标的语义需独立核实，不能把“同参”扩成“同一业务动作”。初次settle把value/content返回调用方，但持久update只记状态、摘要/引用等；completed回放没有原value/content。首次响应丢失后，回放完成状态不等于恢复了继续推理所需业务结果，必须重查权威系统或持久结果原件。

outcome_unknown来自adapter显式标记或非read动作的超时/abort/连接重置等正则；reserved中断残留也有未知分支，禁止自动重写。这是有用的状态设计，不能保证所有外部“已生效但响应异常”都被正确分类。MCP adapter还明确缺少网关调用ID/usage事件ID强收据，仅给状态/版本/延时/work引用；不是没有任何审计，而是需要按permit/run与真实网关、供应商记录对账。

协议与错误结果也有边界：所读MCP基座对SSE取首个可解析JSON data帧，没有在该处等匹配请求ID的最终结果；应验证通知/进度先到等变体，不能把HTTP成功或null结果当业务产物。workforce HTTP调用路由没有自行catch类型错误，所用共享guarded对异常统一400 BAD_REQUEST；因此服务抛出的STEP_ARGUMENT_CONFLICT/409不能直接当这条HTTP接口必保留的状态码，工具入口的failureOf又是另一种契约。以上是源码边界，未复现错误交付。

动态授权需要分层看：permit.verify检查有效期、主体和run/lease字段；所读资源策略端口核员工/任用、清单、风险和参数，不能仅凭leaseVersion字段声称每次都检查当前租约。停职/离岗服务实际撤permit并尝试释放run，属于正向联动；资源入口对未解析为受管身份走legacy后仍需原有权限裁决，离岗/撤任/租约变化的全部旁路是否一致拒绝未验，不称无认证直通。

持久化也分多个域：本地SQLite事务不含外部请求，JSON/SQLite集合与txnstore共存；SIGINT/SIGTERM的flushNow在finally退出0，退出码不能证明所有存储与外部任务都收尾。计量是内部归因材料，boot已将billing插件封存，不能称商业结算或实际账单闭环。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:131-139](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L131-L139)

步骤查重只比较参数摘要。

```text
    // 3. 事务内预留（网络调用严禁入内，§9.4）：runId+stepKey 唯一约束承载步骤幂等
    const reserved = this.store.txn(() => {
      const prior = this.store.invocations.findWhere({ runId: permit.runId, stepKey: request.stepKey })[0]
      if (prior) {
        if (prior.argsHash !== argsHash) {
          throw new WorkforceError('STEP_ARGUMENT_CONFLICT', t('步骤 {stepKey} 已绑定不同参数（冲突拒绝，不能覆盖原动作）', { stepKey: request.stepKey }), 409)
        }
        return { replay: true as const, record: prior }
      }
```

**依据 2 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:204-214](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L204-L214)

completed回放没有业务value/content。

<details>
<summary>查看原文（11行）</summary>

```text
      case 'completed':
        return {
          status: 'completed',
          invocationId: record.id,
          ...(record.gatewayRefJson !== '{}' ? { gatewayRef: this.parseJson(record.gatewayRefJson, {}) } : {}),
          // D2 修复：回放与原完成路径（settle）同源——workContextFromRecord 从记录关联的
          // permit/任用重建可信执行上下文；此前误引用作用域外标识符 tool，completed 步骤回放即抛错
          work: this.workContextFromRecord(record),
        }
      case 'outcome_unknown':
        return { status: 'outcome_unknown', invocationId: record.id, message: t('该步骤存在未决历史执行，请先核验，禁止自动重试写入') }
```

</details>

**依据 3 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:291-305](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L291-L305)

初次结果传递及未知分类。

<details>
<summary>查看原文（15行）</summary>

```text
  private settleFromAdapter(record: InvocationRecord, result: AdapterInvokeResult, started: number): InvocationOutcome {
    const message = result.message ?? ''
    if (result.ok && !result.outcomeUnknown) {
      return this.settle(record, 'completed', {
        message: 'ok',
        gatewayRef: result.gatewayRef,
        usageEventIds: result.usageEventIds,
        value: result.value,
        content: result.content,
      }, started)
    }
    if (result.outcomeUnknown || (UNCERTAIN_TIMEOUT_PATTERN.test(message) && record.risk !== 'read')) {
      return this.settle(record, 'outcome_unknown', {
        message: message || t('外部结果不确定：请求可能已生效，请先查证核验，禁止自动重试写入'),
        gatewayRef: result.gatewayRef,
```

</details>

**依据 4 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:337-353](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L337-L353)

持久落账字段不含业务结果。

<details>
<summary>查看原文（17行）</summary>

```text
  ): InvocationOutcome {
    const latencyMs = Date.now() - started
    this.store.invocations.update(record.id, {
      status,
      errorCode: detail.code ?? '',
      message: detail.message,
      gatewayRefJson: JSON.stringify(detail.gatewayRef ?? {}),
      usageEventIdsJson: JSON.stringify(detail.usageEventIds ?? []),
      approvalRef: detail.approvalRef ?? '',
      latencyMs,
      settledAt: new Date().toISOString(),
    })
    for (const usageEventId of detail.usageEventIds ?? []) {
      // usage 增量关联（§11.1/§11.3）：只做映射不复制流水；同对唯一约束保证幂等
      this.linkUsage(record.id, usageEventId, String(detail.gatewayRef?.['resource'] ?? ''))
    }
    this.emit('workforce.invocation.settled', {
```

</details>

**依据 5 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:360-369](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L360-L369)

初次completed对比返回值。

<details>
<summary>查看原文（10行）</summary>

```text
      case 'completed':
        return {
          status: 'completed',
          invocationId: record.id,
          ...(detail.value !== undefined ? { value: detail.value } : {}),
          ...(detail.content !== undefined ? { content: detail.content } : {}),
          ...(detail.gatewayRef ? { gatewayRef: detail.gatewayRef } : {}),
          work: this.workContextFromRecord(record),
        }
      case 'denied':
```

</details>

**依据 6 · 源码核查**：[packages/plugin-workforce/src/adapters/mcp.ts:96-113](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/adapters/mcp.ts#L96-L113)

业务value与网关收据降级。

<details>
<summary>查看原文（18行）</summary>

```text
      if (result.ok) {
        // 网关暂未回传调用 ID/usage 事件 ID（组4 additive 前诚实缺省，不伪造）
        return {
          ok: true,
          value: result.result,
          gatewayRef: {
            note: 'mcp 网关暂未回传调用ID',
            status: result.status,
            version: result.version,
            latencyMs: result.latencyMs,
            workRef: `${work.runId}/${input.invocationId}`,
            argsHash: sha256Hex(JSON.stringify(input.args)).slice(0, 16),
          },
        }
      }
      return {
        ok: false,
        message: result.error ?? t('MCP 网关拒绝或调用失败'),
```

</details>

**依据 7 · 源码核查**：[packages/plugin-mcp/src/index.ts:1013-1023](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-mcp/src/index.ts#L1013-L1023)

SSE首个JSON帧处理。

<details>
<summary>查看原文（11行）</summary>

```text
      const text = await response.text()
      if (contentType.includes('text/event-stream')) {
        for (const line of text.split('\n')) {
          if (!line.startsWith('data:')) continue
          const frame = line.slice(5).trim()
          if (!frame || frame === '[DONE]') continue
          try { return { payload: JSON.parse(frame), sessionId: sessionIdHeader, status } } catch { /* 跳过非 JSON 帧 */ }
        }
        throw new Error(t('MCP 服务 SSE 响应中未找到 JSON-RPC 帧'))
      }
      if (!text) return { payload: null, sessionId: sessionIdHeader, status } // 202 Accepted 等空体响应（通知类消息）
```

</details>

**依据 8 · 源码核查**：[packages/platform-core/src/rest-gate.ts:102-111](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/platform-core/src/rest-gate.ts#L102-L111)

共享HTTP异常映射。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 9 · 源码核查**：[packages/plugin-workforce/src/permit-service.ts:93-111](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/permit-service.ts#L93-L111)

permit实际校验范围。

<details>
<summary>查看原文（19行）</summary>

```text
  verify(permitId: string, caller: WorkCallerRef, opts?: { requireRun?: boolean }): PermitRecord {
    const permit = this.store.permits.get(permitId)
    if (!permit || permit.status !== 'active') {
      throw new WorkforceError('TOOL_NOT_GRANTED', t('工作授权 permit 不存在或已失效（{permitId}…）', { permitId: permitId.slice(0, 12) }))
    }
    if (permit.expiresAt && permit.expiresAt <= new Date().toISOString()) {
      throw new WorkforceError('TOOL_NOT_GRANTED', t('工作授权 permit 已过期，请重新认领（workforce_claim）'))
    }
    if (permit.principalId && caller.principalId !== permit.principalId) {
      throw new WorkforceError('PRINCIPAL_BINDING_MISMATCH', t('permit 与当前调用主体不匹配（permit 主体绑定为签发时机器主体）'))
    }
    if (opts?.requireRun) {
      if (!permit.runId || !permit.leaseId) {
        throw new WorkforceError('RUN_NOT_OWNED', t('permit 未绑定执行 run/租约，不能用于资源调用'))
      }
    }
    // 任用版本与 IdentityResolution 一致性由调用方组合校验（admission/port 持有解析结果）
    return permit
  }
```

</details>

**依据 10 · 源码核查**：[packages/plugin-workforce/src/port.ts:153-173](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/port.ts#L153-L173)

资源端口permit/run/工具匹配。

<details>
<summary>查看原文（21行）</summary>

```text
    const ref = query.ref ?? {}
    if (!ref.permitId) {
      return { allow: false, code: 'TOOL_NOT_GRANTED', message: t('数字员工必须携带工作授权 permit 经受控入口调用') }
    }
    let permit
    try {
      permit = await admission().verifyPermit(caller, ref.permitId, { requireRun: true })
    } catch (error) {
      if (error instanceof WorkforceError) {
        return { allow: false, code: error.code, message: error.message }
      }
      throw error
    }
    // permit 绑定的 run 与引用 run 一致（引用仅作索引，事实以服务端回查为准，§10.4）
    if (ref.runId && ref.runId !== permit.runId) {
      return { allow: false, code: 'RUN_NOT_OWNED', message: t('工作引用的 run 与 permit 绑定不一致') }
    }
    // 4. 工具在能力清单（服务端清单唯一事实，§9.2）
    const tool = matchTool(capabilities().toolsFor(permit.manifestId), query.facts)
    if (!tool) {
      return { allow: false, code: 'TOOL_NOT_GRANTED', message: t('工具未列入本任用能力清单') }
```

</details>

**依据 11 · 源码核查**：[packages/plugin-workforce/src/employee-service.ts:195-232](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/employee-service.ts#L195-L232)

撤销permit及释放租约联动。

<details>
<summary>查看原文（38行）</summary>

```text
    const permits = this.permits()
    const runIds: string[] = []
    if (status === 'suspended' || status === 'offboarded') {
      for (const runId of new Set(activePermits.map((permit) => permit.runId).filter((item) => item !== ''))) {
        const active = permits?.activeForRun(runId)
        if (permits && (!active || active.employeeId !== id)) continue // activeForRun 复核不过：不释放该 run
        runIds.push(runId)
      }
    }

    // 2. 撤销全部工作授权（工作策略层先失效：新动作立即被拒，V07）
    if (permits && activePermits.length > 0) {
      permits.revokeForEmployee(id, t('员工{action}：{reason}', { action: actionLabel, reason: trimmedReason }))
    }

    // 3. 释放执行租约（exec-hub 集成端口，结构化探测——不产生反向 import）
    if (status === 'suspended' || status === 'offboarded') {
      const execHub = this.execHub()
      const releaseReason = t('员工{action}：{reason}', { action: actionLabel, reason: trimmedReason })
      for (const runId of runIds) {
        if (typeof execHub?.releaseForRun !== 'function') {
          this.emitEvent('workforce.employee.changed', {
            employeeId: id, action: 'lease_release_skipped', runId, note: '执行中枢租约释放端口未就绪，交由僵尸锁回收兜底',
          })
          continue
        }
        try {
          execHub.releaseForRun(runId, releaseReason)
        } catch (error) {
          this.emitEvent('workforce.employee.changed', {
            employeeId: id, action: 'lease_release_failed', runId,
            note: `租约释放失败（待僵尸锁回收）：${error instanceof Error ? error.message : String(error)}`,
          })
        }
      }
    }

    // 4. 状态机落库（复岗 reactivate 仅 suspended→active，转换表已约束）
```

</details>

**依据 12 · 源码核查**：[packages/platform-core/src/workforce-port.ts:224-239](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/platform-core/src/workforce-port.ts#L224-L239)

受管解析/legacy与策略异常拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
  const port = registry?.port?.() ?? null
  if (!port || !caller) return { mode: 'legacy' }
  let managed: ManagedEmployeeRef | null
  try {
    managed = await port.resolveManagedEmployee(caller)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { mode: 'denied', code: 'POLICY_INTERNAL_ERROR', message: t('工作策略反查失败（fail-closed）：{message}', { message }) }
  }
  if (!managed) return { mode: 'legacy' }
  try {
    const decision = await port.authorizeWorkAction(caller, query)
    return decision.allow ? { mode: 'managed', work: decision.work } : { mode: 'denied', code: decision.code, message: decision.message }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { mode: 'denied', code: 'POLICY_INTERNAL_ERROR', message: t('工作策略校验异常（fail-closed）：{message}', { message }) }
```

</details>

**依据 13 · 源码核查**：[src/main.ts:28-34](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/main.ts#L28-L34)

flush与退出实际路径。

```text
process.on('SIGINT', () => {
  logger.info('收到 SIGINT，正在退出…')
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
process.on('SIGTERM', () => {
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
```

**依据 14 · 源码核查**：[src/boot-all.ts:9-12](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/boot-all.ts#L9-L12)

billing不装配的当前边界。

```text
import * as authn from '@dsh-ops/plugin-authn'
import * as usage from '@dsh-ops/plugin-usage'
// plugin-billing 已下线封存（M0-2，2026-09-09）：钱包/复式分账功能面退出运行时，
// 存量流水经 scripts/billing-archive-export.mjs 导出 CSV 只读封存 90 天（见 docs/billing-archive-register.md）。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 小范围评估要什么条件，首次到退出的总负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

应先把治理面与真实业务隔离。README的免费/自托管和测试徽章仅是作者信息；演示模式会对无Bearer注入只读主体并拒写，却开放实例全部只读视图，演示与真实数据需独立实例/卷，关闭变量不等于清除已持久化演示数据。不要在真实企业数据上先开免登演示再补安全。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.6、workspace依赖与匹配Cordis | 源码启动必需 | 原生TS入口/插件树 | 声明/脚本不是本轮启动验收 |
| 独立宿主或声明范围DSH Web | 二选一路径 | 平台HTTP或宿主桥接/工具 | DSH兼容声明<0.2，不推为当前宿主已兼容 |
| 管理账号、机器主体、组织/权限与任用 | 受控调用必需 | 把实际人/机与资源授权对应 | 不接受请求自报身份代替凭据 |
| 可持久化数据目录、密钥和一致备份 | 必需 | 集合、SQLite账本和恢复 | 单进程边界，恢复需同时核外部系统 |
| exec:real的测试MCP及受限凭据 | 真实工具试点评估必需 | 验授权到真实业务结果 | demo成功不算验收 |
| 可用模型端点 | UHP模型执行可选 | 单轮真实模型调用 | 缺端点应失败，不补造completion |
| 明确外部Agent/harness及恢复责任人 | 自主任务目标必需 | 消费工具结果并继续决策/核验 | 内置单步UHP不能代替完整loop |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 平台团队准备独立空数据/测试实例，关闭demo并配置身份/存储 | 权限/数据归属正确，seed与真实数据分离 |
| 2 | 为一个测试MCP资源登记工具风险、权限、任用与permit | 错身份/超范围拒绝，exec明确real |
| 3 | 调一个已授权工具，核实际请求、结果和本地账本 | 比较真实回执；状态/计数不作办结 |
| 4 | 做响应丢失、重复/换目标、撤权和重启用例 | 不重复真实写；能恢复正确结果，未知先人工核验 |
| 5 | 若需要自主任务，再接已有宿主Agent或外部harness | 实际工具结果进入下一次模型，最终产物经验收 |
| 6 | 退出前停新派发、核在途和未知动作、导出/备份并撤权 | 保留对账原件和独立恢复路径，不全栈盲重跑 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 主机/存储、模型/MCP测试调用和备份；金额未知 | 身份/权限/风险建模、依赖部署与接口验收；工时未知 | 多域平台不是轻量个人插件 |
| 持续使用 | 数据、网络、模型及外部系统调用；数值未知 | 维护任用/密钥/风险登记、审计和账实核对 | MIT不等运行或人工免费 |
| 失败恢复 | 回执核验、重复风险、备份及外部补偿；未知 | 查unknown、恢复多种存储、核正确业务结果 | 本地事务/flush不覆盖外部动作 |
| 退出 | 归档数据/密钥/外部凭据和保留资源；未知 | 停任务、对账、撤权、迁移并处置副本 | 停平台不撤销已发生外部写入 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 资源治理 | 共享身份、策略、permit和账本的代表链路 | 全部路由/组织/适配器是否同样有效 |
| 真实工具调用 | HTTP MCP、结果透传与领域状态 | 外部业务成功、完整结果恢复和重复控制 |
| 模型执行 | 单步UHP及会话续接/取消交付控制 | 通用工具循环、任务完成率、净收益 |
| 用量审计 | 调用/内部归因和降级引用可见 | 完整usage关联、外部账单或商业结算 |
| 运维 | 启动探针、存储和退出路径 | 实际吞吐、恢复时间、HA及总拥有成本 |

单进程/无水平扩展是作者明确边界，本轮未运行性能/备份/恢复或作者测试；数值未知不填0。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:36-51](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/package.json#L36-L51)

源码启动与Node声明。

<details>
<summary>查看原文（16行）</summary>

```text
  },
  "scripts": {
    "start": "node --experimental-strip-types src/main.ts",
    "selftest": "node scripts/selftest.mjs",
    "lint:manifests": "node --experimental-strip-types scripts/lint-manifests.mjs",
    "manifests": "node scripts/gen-manifests.mjs",
    "lint:boot-order": "node --experimental-strip-types scripts/check-boot-order.mjs",
    "lint:cjk": "node scripts/lint-cjk-coverage.mjs",
    "lint:i18n": "node scripts/lint-i18n-coverage.mjs",
    "test:contracts": "node --experimental-strip-types packages/plugin-dsh-bridge/tests/host-bridge.contract.mjs && node --experimental-strip-types packages/plugin-rq-card/tests/host-bridge.contract.mjs"
  },
  "engines": {
    "node": ">=22.6"
  },
  "dependencies": {
    "@dsh-ops/plugin-rq-card": "file:packages/plugin-rq-card"
```

</details>

**依据 2 · 作者声明**：[package.json:25-35](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/package.json#L25-L35)

DSH兼容范围和web声明。

<details>
<summary>查看原文（11行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.1.0-rc.7 <0.2.0",
      "dshReleases": {
        "0.1.0-rc.7": "compatible"
      },
      "profiles": [
        "web"
      ]
    }
```

</details>

**依据 3 · 作者声明**：[README.md:215-234](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/README.md#L215-L234)

作者明确demo/存储/模型协议边界。

<details>
<summary>查看原文（20行）</summary>

```text
---

## 诚实边界

这个项目的价值有一半在于它**明确说清了自己不做什么**:

- **免登演示态**(`DEMO_MODE=1`):**不新增鉴权面、不发令牌、不开写权限**——仅在既有
  console 鉴权中间件的「无 Bearer 头」分支注入固定只读主体(26 个 `.read` 点白名单,
  无 `*`);写方法入口直接 405,带 Bearer 的真实登录路径行为完全不变。代价说清楚:
  它开放实例**全部只读数据视图**给任何能访问端口的人,仅限演示种子数据实例,默认关闭。
- **存储**:业务集合**双形态**——默认 JSON 集合(原子落盘);`PLATFORM_STORAGE=sqlite` 切换
  SQLite 后端(WAL + `synchronous=FULL` + 事务,首启自动回填既有 JSON 数据,`uniqueOn`
  落为引擎级 UNIQUE INDEX,JSON 文件保留为回滚源)。计量与事务数据始终为 SQLite
  (`data/txnstore.db`)。**两种形态都是单进程、无水平扩展**——多节点 HA 需要 Postgres
  后端,规划见 [`docs/adr-0001-storage-migration.md`](docs/adr-0001-storage-migration.md)。
- **MCP 执行层**:支持真实 HTTP 传输(`exec: real`);`exec: demo` 是**显式标注**的降级演示层
  (确定性模拟、不计入计量与 SLO)。
- **模型网关**:仅转发 OpenAI 兼容 `chat/completions`;未配置 endpoint 时**直接报错,
  绝不生成假 completion 充数**。
- **NAS 文件操作**:全部经 MCP 文件网关,不直连 DSM 私有 API;
```

</details>

**依据 4 · 源码核查**：[packages/plugin-console/src/index.ts:168-188](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-console/src/index.ts#L168-L188)

demo免登主体与写方法拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
    // 演示只读态（DEMO_MODE=1）：无 Bearer 时注入固定只读主体。
    // 权限集为白名单 `.read` 枚举（见 demo-mode.ts），后续每个 guarded 路由的
    // requirePermission 照常生效——写类路由自然 403，此处不另建拦截层。
    if (!header && demo) {
      // 纵深防御：写方法入口即拒。覆盖「路由漏声明权限点」这类遗漏面（第一道闸是权限集无写点）。
      if (!READONLY_METHODS.has(exchange.method.toUpperCase())) {
        exchange.fail(405, 'DEMO_READONLY', t('演示模式为只读，不支持写操作。请自行部署后体验完整功能。'))
        return true
      }
      // 演示态同样经统一 Principal 组装（authMethod='demo'）：unified 面与真实令牌同构，
      // 权限集仍为白名单 .read 枚举，后续 requirePermission 照常生效。
      const demoVerified = {
        principal: { id: DEMO_PRINCIPAL_ID, type: 'human' as const, refType: 'user' as const, refId: DEMO_PRINCIPAL_ID, name: DEMO_PRINCIPAL_NAME },
        token: { jti: DEMO_PRINCIPAL_ID, issuedBy: 'demo' },
        scopes: [...DEMO_READONLY_PERMISSIONS],
        actChain: [],
      }
      exchange.principal = await assemblePrincipal(demoVerified)
      return
    }

```

</details>

**依据 5 · 源码核查**：[src/boot-all.ts:94-100](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/boot-all.ts#L94-L100)

实际启动探针。

```text
  // 装配后体检：必须在全部 await ctx.plugin 之后（此刻 fiber 都应 ACTIVE）；
  // 必需服务不可达或存在拦启动的卡死 fiber 时直接拒绝启动，禁止降级为告警放行
  // （FAILED fiber 仅在声明 provide 已被其他 ACTIVE fiber 接管时豁免，见 boot-probe.ts）
  const health = probeTree(ctx, ['opsStorage', 'platformBus', 'httpServer', 'iam', 'authn', 'usage', 'audit'])
  if (!health.ok) {
    throw new Error(formatTreeHealth(health))
  }
```

**依据 6 · 源码核查**：[src/main.ts:28-34](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/src/main.ts#L28-L34)

退出flush边界。

```text
process.on('SIGINT', () => {
  logger.info('收到 SIGINT，正在退出…')
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
process.on('SIGTERM', () => {
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么方向值得先验证，当前是否应全平台采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议观察，先取得真实需求与匿名案件，不全栈生产铺开。适合已有平台团队、明确权限/恢复责任人且能维护外部凭据的组织；个人只想让DSH多一个工具，原生宿主加现有网关通常是更简单基线。当前源码能支持定向治理评估，尚不足以承诺全域授权、完整业务恢复或独立自治任务交付。

待验证方向是在既有permit/账本上补“目标身份+可恢复结果收据”：步骤身份同时核资源/动作/参数与策略版本，初次业务结果用已有artifact/结果引用持久保存，回放能取到同一结果；外部未知状态先核验再让模型继续。复用现有宿主Agent和资源权限，不先重建一套模型循环。已有状态/引用提供锚点，但完整结果回放、全旁路撤权与该整体验收尚未验证，不能算当前能力。

最小试点先取得10个同一资源的真实匿名任务及可回退测试工具，含正常授权、拒绝/撤权、同键异参/换目标、执行后断连、SSE进度先行和重启恢复。对照现有网关加人工对账，记录真实重复动作、错结果、账实/usage对应、恢复时间和管理员工时；若要求Agent，额外保存工具结果进入下一模型请求和最终产物的原件。

任何未授权写、无法解释的unknown、丢失结果后误宣称完成或审计断链都应停用该试点入口并核外部真实状态，不以新stepKey绕过未决动作。若简单基线同样正确且维护更低，或结果收据没有减少错误反而加重负担，则否定独立治理扩展方向；没有案件就不进入建设。上述试点和改动本轮均未执行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:204-214](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L204-L214)

结果回放缺口支持持久收据方向。

<details>
<summary>查看原文（11行）</summary>

```text
      case 'completed':
        return {
          status: 'completed',
          invocationId: record.id,
          ...(record.gatewayRefJson !== '{}' ? { gatewayRef: this.parseJson(record.gatewayRefJson, {}) } : {}),
          // D2 修复：回放与原完成路径（settle）同源——workContextFromRecord 从记录关联的
          // permit/任用重建可信执行上下文；此前误引用作用域外标识符 tool，completed 步骤回放即抛错
          work: this.workContextFromRecord(record),
        }
      case 'outcome_unknown':
        return { status: 'outcome_unknown', invocationId: record.id, message: t('该步骤存在未决历史执行，请先核验，禁止自动重试写入') }
```

</details>

**依据 2 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:131-139](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/invocation-service.ts#L131-L139)

步骤身份当前核参边界。

```text
    // 3. 事务内预留（网络调用严禁入内，§9.4）：runId+stepKey 唯一约束承载步骤幂等
    const reserved = this.store.txn(() => {
      const prior = this.store.invocations.findWhere({ runId: permit.runId, stepKey: request.stepKey })[0]
      if (prior) {
        if (prior.argsHash !== argsHash) {
          throw new WorkforceError('STEP_ARGUMENT_CONFLICT', t('步骤 {stepKey} 已绑定不同参数（冲突拒绝，不能覆盖原动作）', { stepKey: request.stepKey }), 409)
        }
        return { replay: true as const, record: prior }
      }
```

**依据 3 · 源码核查**：[packages/plugin-workforce/src/adapters/mcp.ts:96-113](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-workforce/src/adapters/mcp.ts#L96-L113)

已有结果和降级引用是推导锚点。

<details>
<summary>查看原文（18行）</summary>

```text
      if (result.ok) {
        // 网关暂未回传调用 ID/usage 事件 ID（组4 additive 前诚实缺省，不伪造）
        return {
          ok: true,
          value: result.result,
          gatewayRef: {
            note: 'mcp 网关暂未回传调用ID',
            status: result.status,
            version: result.version,
            latencyMs: result.latencyMs,
            workRef: `${work.runId}/${input.invocationId}`,
            argsHash: sha256Hex(JSON.stringify(input.args)).slice(0, 16),
          },
        }
      }
      return {
        ok: false,
        message: result.error ?? t('MCP 网关拒绝或调用失败'),
```

</details>

**依据 4 · 源码核查**：[packages/plugin-uhp/src/index.ts:564-585](https://github.com/01men/ybkkasi/blob/c2a4f1e3af09eb2a61dbb8285e96b4191b22de44/packages/plugin-uhp/src/index.ts#L564-L585)

内置单步边界，未来不重算成已具loop。

<details>
<summary>查看原文（22行）</summary>

```text
      const messages = JSON.parse(record.messagesJson) as Array<{ role: string; content: string }>
      const result = await this.ctx.modelGateway.invoke({
        model,
        orgId: agent.orgId ?? '',
        subject: `agent:${agent.id}`,
        dataClass: record.dataClass,
        messages,
      })
      if (this.cancelRequested.has(record.id)) {
        // 协作取消语义：结果不交付、不回写输出（取消方已收到 canceled 终态）
        this.cancelRequested.delete(record.id)
        this.auditExecution(this.responses().get(record.id)!, agent, 'uhp.invoke.canceled_after_completion', 'ok',
          t('模型已返回但任务已取消，结果不交付（取消语义）'))
        this.emitProgress(this.responses().get(record.id), 'canceled')
        return
      }
      this.responses().update(record.id, {
        status: 'completed',
        outputText: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
