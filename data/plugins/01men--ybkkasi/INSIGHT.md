# 元冰可 · 企业 AI 资源管理平台

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ad1086e](https://github.com/01men/ybkkasi/tree/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01men/ybkkasi)
<!-- END META -->

> **功能**：以插件化控制平面统一管理企业 MCP、Skill、Agent、AI 应用、身份、审计与用量。

> **亮点**：相比分散 IAM/网关/审计脚本，提供共享主体和调用状态的插件化治理面；具体支点是 permit 与步骤账本贯穿执行。不是独立的新治理算法。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：本地幂等账本无法独自保证外部动作一致；单进程、演示数据开放面及各适配器权限覆盖限制生产承诺。见 [Q03](#research-q03)。

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
  - [Q01 · 平台治理的单位任务与增量是什么？](#detail-section-11)
  - [Q02 · 受控调用如何约束权限和重复执行？](#detail-section-12)
  - [Q03 · 治理承诺在哪些边界不成立？](#detail-section-13)
  - [Q04 · 部署、恢复与总成本是什么？](#detail-section-14)
  - [Q05 · 如何验证最小治理闭环？](#detail-section-15)
  - [Q06 · 什么团队适合当前采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：平台团队治理多部门 AI 资源，以授权调用、真实交付、用量和审计一致为结果。

简单替代为现有 IAM、AI网关、日志与人工审批/对账；比较单位是合格治理案件，而非资产数或插件数。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一控制面 | 装配身份、审计和资源域 | 平台部署与运维必需 |
| 受控调用账本 | permit、步骤去重、结果结算 | 外部回执仍需核验 |
| 治理控制台 | 浏览和管理资源 | demo会开放只读视图，生产须关闭 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node≥22.6、Cordis与正确插件树 | 启动必需 | 独立宿主或DSH装配 | 体检失败拒绝启动 |
| 持久存储、管理口令、备份 | 生产必需 | 身份/账本恢复 | 不可将demo接真实数据 |
| 模型/MCP/NAS等后端 | 对应资源必需 | 执行真实动作 | 本地状态不能替代外部回执 |
| 平台工程和权限运营责任人 | 生产收益必需 | 处理授权、未知结果和恢复 | 无责任人应停止扩域 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 管理员隔离部署、关demo并配置存储/口令 | 身份与备份可恢复 |
| 2 | 平台团队只接一种资源并建立permit | 权限拒绝与正确调用均可追溯 |
| 3 | 业务人核验交付、usage、审计及故障恢复 | 账实一致才扩域，否则冻结写操作核验 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务器、存储、模型/MCP/NAS资源，金额未知 | 权限建模、密钥、最小域部署，工时未知 | MIT不等于运维免费 |
| 持续使用 | 数据库、网络、备份及外部调用 | 权限运营、升级、审计与对账 | TCO与吞吐未知 |
| 失败恢复 | 回执核验、重建和补偿资源未知 | 恢复数据库并核对外部真实动作 | outcome_unknown 禁止盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一治理 | 多域共享装配和身份依赖可见 | 全域权限覆盖和审计闭环 |
| 步骤幂等 | runId+stepKey 查重与冲突拒绝 | 外部重复动作、结果核验率 |
| 运维 | 启动体检与存储 flush | 真实恢复时间、TCO和业务收益 |

> **思考**：本地幂等账本无法独自保证外部动作一致；单进程、演示数据开放面及各适配器权限覆盖限制生产承诺。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相比分散 IAM/网关/审计脚本，提供共享主体和调用状态的插件化治理面；具体支点是 permit 与步骤账本贯穿执行。不是独立的新治理算法。见 [Q01](#research-q01)、[Q02](#research-q02)。

调用预留事务与网络执行分离、领域状态不等同HTTP状态，值得借鉴；需要外部回执与未知结果核验共同成立。启动顺序与依赖体检清晰，但多个业务域共享升级面，不能用源码规模或测试 badge 代替生产可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地幂等账本无法独自保证外部动作一致；单进程、演示数据开放面及各适配器权限覆盖限制生产承诺。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；有平台团队、真实匿名案件和恢复责任人后，从一种资源建立闭环，暂不全栈生产铺开。见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码抽查支持统一控制面及调用账本机制；全域安全、外部账实与企业收益未验证；最小治理闭环是假设。

- 已检查：作者 README、包清单、源码路径 src/main.ts、src/boot-all.ts、packages/plugin-workforce/src/invocation-service.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件为整个平台；固定源码抽查 main、boot-all、workforce invocation 与作者边界，不审计全部包、路由、适配器或外部协议；未运行任何目标代码。
- 下一步：以授权/拒绝/租约撤销/异参冲突/执行后断网/重启恢复矩阵比较账实一致、纠错时间与管理员负担。

**分析版本**

- **仓库**：[01men/ybkkasi](https://github.com/01men/ybkkasi)
- **版本号**：1.5.0（[固定提交 ad1086e](https://github.com/01men/ybkkasi/tree/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的单资源治理试点，以10个真实匿名案件检验账实一致和管理员负担，再决定扩域；无案件不进入建设。见 [Q05](#research-q05)。

以授权/拒绝/租约撤销/异参冲突/执行后断网/重启恢复矩阵比较账实一致、纠错时间与管理员负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 151 | 54385 | 42233 | 8490 | — |
| .md | source | 162 | 26198 | — | — | 446204 |
| .mjs | source | 41 | 17735 | 12593 | 4456 | — |
| .js | source | 56 | 23476 | 20978 | 1482 | — |
| .mjs | test | 30 | 6778 | 5477 | 922 | — |
| .tsx | source | 2 | 267 | 194 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：企业 AI 资源控制面能否以受控调用和统一身份降低治理碎片化，哪些部署与数据边界阻止直接生产采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 平台治理的单位任务与增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是有平台工程能力、需要治理多部门 MCP/Skill/Agent 等资源的组织。单位任务可定义为某员工主体在授权范围内调用一项资源，产生可核验交付并关联用量与审计；控制台存在或资源数量增加不算办结。仓库是整个平台根组件，独立 main 创建 Cordis Context，再按顺序装配身份、审计、资源、网关、执行与协作域；不是安装一个工具即可消除治理成本。相对 IAM、网关、审计脚本分散拼接，研究识别的增量是共同身份及调用状态贯穿多个域。README 关于新品类和需求验证属于作者主张，本次没有客户案例或独立采用证据，不据此确认市场机会。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/README.md#L9-L17)

作者统一资产与身份/计量/审计定位

```text
[![Demo](https://img.shields.io/badge/demo-demo.ybkkasi.com-FF6B35)](https://demo.ybkkasi.com)

**把散落在企业里的 MCP 服务 / Skill / Agent / AI 应用 / 模型渠道 / SaaS 连接器 / NAS 存储，
统一成一套可管、可算、可审的资产。**

一套身份 · 一套权限 · 一套计量 · 一套审计。**29 个插件包，按需启用。**

> **YBK Enterprise AI Asset Governance** — One control plane for every MCP server, skill,
> agent, and AI app. One identity, one permission model, one metering pipeline, one audit trail.
```

**依据 2 · 源码核查**：[src/main.ts:1-23](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/main.ts#L1-L23)

独立 Cordis 宿主入口

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * 独立宿主入口：以 cordis 插件树启动整个平台。
 * 用法：node src/main.ts [--port 7300] [--data ./data]
 */
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

```

</details>

**依据 3 · 源码核查**：[src/boot-all.ts:40-66](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/boot-all.ts#L40-L66)

按依赖顺序装配共享服务与资源域

<details>
<summary>查看原文（27行）</summary>

```text
  port: number
}

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

#### 缺口

- 没有企业真实治理案件与原有流程成本
  **影响**：需求和业务收益仍是假设
  **进一步探讨**：取得匿名授权/拒绝/超时/交付验收案例并对照现有流程

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 受控调用如何约束权限和重复执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

抽查 workforce 调用链可见：先验证 permit 和 run/租约绑定，再解析 manifest 工具句柄，校验 stepKey、参数 schema 与业务范围；在短事务内按 runId+stepKey 查重，同键不同参数拒绝，同键同参数回放。网络 adapter.invoke 位于事务外，避免外部等待持有数据库事务；随后将 adapter 结果结算为领域状态。completed、outcome_unknown、denied 等状态与 HTTP 状态分离，有利于避免 HTTP200 被误认业务成功。此机制是整个平台贡献的一个具体支点，不能据此宣称所有域均有相同覆盖。可复用的是“授权快照—调用预留—事务外执行—状态结算—usage关联”协议，移植需要统一主体、资源句柄和外部回执语义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:1-11](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L1-L11)

状态与幂等设计的明确边界

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * 受控调用账本服务（实施路径 §9.3/§9.4/§11.5/§11.6 的权威实现）。
 *
 * 调用状态机（§9.3）：reserved → completed / denied / approval_required /
 * rate_limited / failed / outcome_unknown / cancelled。HTTP 状态与领域状态分开保留，
 * 不以 HTTP 200 冒充业务成功。
 *
 * 步骤幂等（§11.5）：runId+stepKey 唯一约束；同步骤同参数已完成→回放原结果；
 * 执行中→返回当前状态；同步骤不同参数→STEP_ARGUMENT_CONFLICT（409）。
 * 网络调用一律在 txnStore 事务外（§9.4）：事务只做短检查/预留/提交。
 * usage 关联（§11.1）：只做 invocation↔usageEvent 映射，不复制消费流水、不双计。
```

</details>

**依据 2 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:101-138](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L101-L138)

permit、manifest、schema与幂等预留实际接线

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

**依据 3 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:173-198](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L173-L198)

事务外执行与领域结算

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

#### 缺口

- 未审计全部 adapter 的外部幂等与未知结果恢复
  **影响**：本地账本去重不能证明外部 exactly-once
  **进一步探讨**：对每种写适配器执行超时后核验，禁止直接重放

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 治理承诺在哪些边界不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

首要限制不是插件数量，而是控制平面状态是否与外部真实动作一致。调用账本记录 outcome_unknown 是正确边界，但仍需跨系统核验才能关账。作者明确两种存储均单进程、无水平扩展；默认演示可开放全部只读数据视图，不适合真实企业数据；模型网关只转发 OpenAI chat/completions，NAS 文件路径需同机或共享挂载。费用面也不能当商业结算系统：README 写明仅内部成本穿透、charge 恒0。以上是作者明确边界及已抽查机制，不等于安全漏洞已复现；尚未完成全部身份/路由矩阵与渗透验收，因此不把“一套权限”升级为全覆盖安全保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:199-222](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/README.md#L199-L222)

演示、单进程、网关、NAS与计费边界

<details>
<summary>查看原文（24行）</summary>

```text
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
  `fs_upload/fs_download` 在网关进程侧读写本地路径,平台与网关需同机部署或配共享挂载。
- **OIDC 私钥**存 data 目录,生产建议迁 KMS。
- **i18n**:运行时支持 zh-CN(默认)/ en-US / ja-JP 实时切换,未命中优雅降级中文;
  协议层 ASCII 键在任何语言版本中不改写。架构已支持 i18n,出海市场按需推进。
- **计费**:平台不转售、不分账。对外只呈现**用量与内部成本穿透**(价格簿为零价快照,
  `charge` 恒 0),原钱包/分账子系统已下线封存。
```

</details>

**依据 2 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:34-35](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L34-L35)

超时/连接错误视为外部结果不确定

```text
/** 命中即视为「外部写请求已发出但结果不确定」（§11.5-4：先核验，禁止自动重写）。 */
const UNCERTAIN_TIMEOUT_PATTERN = /超时|timeout|abort|aborted|ECONNRESET|ETIMEDOUT/i
```

#### 缺口

- 跨插件权限覆盖、租约撤销竞态和审计完整性未验证
  **影响**：不能确认企业隔离及合规可用性
  **进一步探讨**：用最小权限主体逐域调用，检查外部执行、审计、用量是否一致

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、恢复与总成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根包声明 Node≥22.6，DSH 兼容范围 rc.7 到0.2之前并限定 web；独立 main 又提供另一路部署。真正成本包括服务器、持久存储、密钥、备份、出站模型/MCP/NAS/连接器，不是 MIT 许可证费用。启动按插件依赖顺序，末尾 probeTree 失败拒绝启动，可避免部分治理服务缺失仍放行业务，但依赖耦合也扩大升级排障面。退出 flush 存储只是一个恢复环节，不保证所有外部任务都已结算。首次应禁用 demo、配置管理口令与存储后端；持续需要权限、凭据、审计及备份维护；失败要区分本地账本恢复和外部动作核验，不能全栈盲重试。金额和工时无真实负载依据，均未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-38](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/package.json#L24-L38)

DSH/web 兼容声明

<details>
<summary>查看原文（15行）</summary>

```text
    "bundle": {
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
  },
  "scripts": {
    "start": "node src/main.ts",
```

</details>

**依据 2 · 源码核查**：[package.json:49-53](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/package.json#L49-L53)

Node 声明

```text
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "jsdom": "^30.0.1",
    "openid-client": "^6.8.7"
```

**依据 3 · 源码核查**：[src/boot-all.ts:94-100](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/boot-all.ts#L94-L100)

末尾健康检查拒绝启动

```text
  // 装配后体检：必须在全部 await ctx.plugin 之后（此刻 fiber 都应 ACTIVE）；
  // 必需服务不可达或存在拦启动的卡死 fiber 时直接拒绝启动，禁止降级为告警放行
  // （FAILED fiber 仅在声明 provide 已被其他 ACTIVE fiber 接管时豁免，见 boot-probe.ts）
  const health = probeTree(ctx, ['opsStorage', 'platformBus', 'httpServer', 'iam', 'authn', 'usage', 'audit'])
  if (!health.ok) {
    throw new Error(formatTreeHealth(health))
  }
```

**依据 4 · 源码核查**：[src/main.ts:27-33](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/main.ts#L27-L33)

退出时 flush 存储

```text

process.on('SIGINT', () => {
  logger.info('收到 SIGINT，正在退出…')
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
})
process.on('SIGTERM', () => {
  void ctx.opsStorage.flushNow().finally(() => process.exit(0))
```

#### 缺口

- 生产负载、备份恢复和运维工时未测
  **影响**：不能计算TCO和单次合格治理任务成本
  **进一步探讨**：最小部署记录正常与故障任务的资源、人工、恢复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证最小治理闭环？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是先把一种 MCP 写工具纳入身份—permit—stepKey—回执—usage—审计闭环，比一次启用所有域更容易建立治理收益。推导来自 Q02 的具体调用协议与 Q03 的外部结果不确定边界。相对现有全平台装配，只缩小验收面，不发明第二套权限。最小实验用10个匿名案件，含授权成功、权限拒绝、租约撤销、同键异参、执行后断网、重启恢复；对照现有网关+人工表格，统计账实一致、重复动作、纠错时间和管理员维护量。若仍无法追溯外部动作，或维护量超过原流程且没有减少错误，则停止扩域。尚无真实用户/案件，不能把此方向叫已验证生产机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:101-138](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L101-L138)

最小调用协议已有入口

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

**依据 2 · 源码核查**：[packages/plugin-workforce/src/invocation-service.ts:173-198](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/packages/plugin-workforce/src/invocation-service.ts#L173-L198)

外部执行与本地状态分离

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

**依据 3 · 源码核查**：[src/boot-all.ts:82-93](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/boot-all.ts#L82-L93)

业务域与协作域的独立装配面

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么团队适合当前采用？

**研究主题**：采用判断

#### 完整回答

建议观察。具备平台工程与权限运营团队者可以从一种资源和隔离测试实例评估；希望给个人 DSH 低负担加工具的人不适合这一整个平台。先确认生产 demo 关闭、身份/权限/审计可闭环、未知结果能人工核验、备份可恢复，再考虑有限真实案件。验收应看账实一致率、纠错时间和管理员持续负担，不看 badge 测试数量。出现未授权外部写入、无法解释的 outcome_unknown、审计断链或恢复覆盖真实状态时应停止。当前 source 抽查没有足够证据支持 install，也不继承作者报告的测试通过作为本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:203-218](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/README.md#L203-L218)

生产与数据边界要求

<details>
<summary>查看原文（16行）</summary>

```text
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
  `fs_upload/fs_download` 在网关进程侧读写本地路径,平台与网关需同机部署或配共享挂载。
- **OIDC 私钥**存 data 目录,生产建议迁 KMS。
```

</details>

**依据 2 · 源码核查**：[src/boot-all.ts:94-100](https://github.com/01men/ybkkasi/blob/ad1086e5d77a93aa80c73f0e5e8e3e10fcf373d3/src/boot-all.ts#L94-L100)

治理核心可用性为启动前提

```text
  // 装配后体检：必须在全部 await ctx.plugin 之后（此刻 fiber 都应 ACTIVE）；
  // 必需服务不可达或存在拦启动的卡死 fiber 时直接拒绝启动，禁止降级为告警放行
  // （FAILED fiber 仅在声明 provide 已被其他 ACTIVE fiber 接管时豁免，见 boot-probe.ts）
  const health = probeTree(ctx, ['opsStorage', 'platformBus', 'httpServer', 'iam', 'authn', 'usage', 'audit'])
  if (!health.ok) {
    throw new Error(formatTreeHealth(health))
  }
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
