# DSH Standard

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[37e9c35](https://github.com/T-Auto/dsh-std/tree/37e9c35b953f0dccaad089df6e68e4f00daae7bd)

<!-- BEGIN META -->
[![GitHub ★ 160](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=160&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/T-Auto/dsh-std)
<!-- END META -->

> **功能**：提供可独立实现的协议声明、协商器与 DeepSeek Harness 映射。

> **亮点**：[Q01](#research-q01) 把版本和能力要求变成可检查报告。

> **主要限制**：[Q03](#research-q03) 兼容报告基于声明，不能代替真实运行。

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
  - [Q01 · 协议库替集成者省掉什么？](#detail-section-11)
  - [Q02 · 核心如何判定未知协议？](#detail-section-12)
  - [Q03 · compatible 能证明运行吗？](#detail-section-13)
  - [Q04 · 怎样在项目中评估？](#detail-section-14)
  - [Q05 · 比较协议报告与普通错误是否更好定位问题？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护跨宿主扩展的开发者可评估声明协商。

直接集成容易起步，但适配差异留到运行期。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 协议协商 | 检查声明兼容 | 需已注册定义 |
| DSH 适配 | 连接领域到宿主 | 需单独验证运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 协议定义 | 必需 | 验证并计算报告 | 缺失会报问题 |
| 宿主映射 | 实际执行需要 | 接入产品服务 | 只能静态检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 单一领域 | 固定版本 |
| 校验 | 比较报告与运行 | 检查缺失和可选项 |
| 退出 | 保留直接集成 | 不影响现有接口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 集成费用未知 | 准备耗时未知 | 需要维护声明 |
| 持续 | 运行与维护成本未知 | 校对耗时未知 | 领域版本独立 |
| 恢复 | 迁移开销未知 | 排障耗时未知 | 可回原适配 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 报告 | 有结构化等级与路径 | 真实互操作性 |

> **思考**：[Q03](#research-q03) 兼容报告基于声明，不能代替真实运行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把版本和能力要求变成可检查报告。

未知必需与可选定义区分错误等级。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 兼容报告基于声明，不能代替真实运行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用于单领域 CI，并另验运行映射。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的协议目录的兼容判断与实际宿主能力边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/core/src/negotiation.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的协议目录的兼容判断与实际宿主能力边界。未执行目标代码或实际宿主验证。
- 下一步：用同一矩阵盲评诊断耗时

**分析版本**

- **仓库**：[T-Auto/dsh-std](https://github.com/T-Auto/dsh-std)
- **版本号**：未声明（[固定提交 37e9c35](https://github.com/T-Auto/dsh-std/tree/37e9c35b953f0dccaad089df6e68e4f00daae7bd)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较结构化报告的排障收益。

用同一矩阵盲评诊断耗时

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 9882 | — | — | 108605 |
| .ts | source | 70 | 12903 | 11475 | 277 | — |
| .ts | test | 23 | 5205 | 4898 | 21 | — |
| .js | source | 1 | 4 | 4 | 0 | — |
| .mjs | source | 2 | 214 | 201 | 0 | — |
| .mjs | test | 1 | 51 | 46 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/T-Auto/dsh-std/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/T-Auto/dsh-std/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/T-Auto/dsh-std/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：协议目录的兼容判断与实际宿主能力边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 协议库替集成者省掉什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要把同一个扩展对接不同运行时的人可先描述 requires 和 supports，再用相应协议定义生成兼容报告。相对直接调用某宿主内部 API，它把交集判定提早，但真正使用仍要接适配器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-20](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/README.md#L5-L20)

元协议及领域隔离

<details>
<summary>查看原文（16行）</summary>

```text
In plain terms, DSH Standard is a set of **universal interoperability protocols**. Its goal is simple: let DSH plugins, background runtimes, and various user interfaces (TUI terminals, Web UIs, desktop apps, headless daemons) decouple cleanly and work together smoothly.

`@dsh-std/core` is a "meta-protocol" (the **protocol about protocols**). Domain-specific protocols—like Command, Tool, Model, and Presentation—sit on top of this meta-protocol substrate for discovery and negotiation, each versioned independently. Different hosts and applications only implement the parts they actually need.

Reference packages provide types, validators, and pure-function negotiators. Conforming implementations are not required to depend on these npm packages, nor do they need to run inside DeepSeek Harness.

## What is a "Meta-protocol" (The Protocol About Protocols)?

Most protocols you deal with handle **specific domain tasks**:
- A Command protocol handles how commands are registered and executed;
- A Model protocol governs how LLM providers are plugged in;
- A Presentation protocol handles UI dialogs, questions, and approvals.

In contrast, `@dsh-std/core` **knows zero domain business fields** (it doesn't even know what a command or a model is). It is purely the **"protocol about protocols"**:

- It defines universal primitives: how protocols are identified (`apiVersion` + `kind`), how participants declare what they need (`requires`) and what they provide (`supports`), and how to run pure-function negotiations to output a structured compatibility report.
```

</details>

**依据 2 · 源码核查**：[packages/core/src/negotiation.ts:17-42](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L17-L42)

协商数据与协议定义

<details>
<summary>查看原文（26行）</summary>

```text
export interface ProtocolNegotiationInput<RequirementSpec = unknown, SupportSpec = unknown, Policy = unknown> {
  readonly requirements: readonly { readonly participant: string; readonly requirement: ProtocolRequirement<RequirementSpec> }[]
  readonly supports: readonly { readonly participant: string; readonly support: ProtocolSupport<SupportSpec> }[]
  readonly policy?: Policy
}

export interface ProtocolNegotiationOutcome<Agreement = unknown> {
  readonly agreement?: Agreement
  readonly issues?: readonly ProtocolIssue[]
}

export interface ProtocolDefinition<RequirementSpec = unknown, SupportSpec = unknown, Agreement = unknown, Policy = unknown>
  extends ApiReference {
  /** Every accepted wire/static API version. No compatibility is inferred by core. */
  readonly accepts?: readonly string[]
  validateRequirement(spec: unknown, context: ApiReference): RequirementSpec
  validateSupport(spec: unknown, context: ApiReference): SupportSpec
  /**
   * Normalize and validate the definition-owned agreement before publication.
   * Optional for definitions written against the original v1alpha1 API.
   */
  readonly validateAgreement?: (agreement: unknown, context: ApiReference) => Agreement
  negotiate(
    input: ProtocolNegotiationInput<RequirementSpec, SupportSpec, Policy>,
  ): ProtocolNegotiationOutcome<Agreement>
}
```

</details>

#### 缺口

- 未比较移植维护时间
  **影响**：不能断言减少总成本
  **进一步探讨**：把一个小能力对接两种宿主

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 核心如何判定未知协议？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

注册版本需显式接受，重复键拒绝。参与者身份重复抛错，未知必需定义记 error，可选记 warning；定义负责验证和协商，错误汇入报告。最终 compatible 仅取决于有没有 error。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/negotiation.ts:71-87](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L71-L87)

版本键和注销

<details>
<summary>查看原文（17行）</summary>

```text
  register(definition: ProtocolDefinition): () => void {
    validateDefinition(definition)
    const accepted = new Set([definition.apiVersion, ...(definition.accepts ?? [])])
    for (const version of accepted) {
      const key = protocolKey({ apiVersion: version, kind: definition.kind })
      if (this.definitions.has(key)) {
        throw new Error(`protocol definition for ${version} ${definition.kind} is already registered`)
      }
    }
    const stored = Object.freeze({ definition: freezeDefinition(definition), accepted: new Set(accepted) })
    for (const version of accepted) this.definitions.set(protocolKey({ apiVersion: version, kind: definition.kind }), stored)
    return () => {
      for (const version of accepted) {
        const key = protocolKey({ apiVersion: version, kind: definition.kind })
        if (this.definitions.get(key) === stored) this.definitions.delete(key)
      }
    }
```

</details>

**依据 2 · 源码核查**：[packages/core/src/negotiation.ts:99-142](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L99-L142)

输入与缺失定义

<details>
<summary>查看原文（44行）</summary>

```text
  negotiate(declarations: readonly ProtocolDeclaration[], policy?: unknown): NegotiationReport {
    const participantIds = new Set<string>()
    for (const declaration of declarations) {
      validateProtocolDeclaration(declaration)
      if (participantIds.has(declaration.participant.id)) {
        throw new TypeError(`duplicate participant identity ${JSON.stringify(declaration.participant.id)}`)
      }
      participantIds.add(declaration.participant.id)
    }

    const groups = new Map<StoredDefinition, {
      requirements: ProtocolNegotiationInput['requirements'][number][]
      supports: ProtocolNegotiationInput['supports'][number][]
    }>()
    const issues: ProtocolIssue[] = []
    for (const [declarationIndex, declaration] of declarations.entries()) {
      for (const [index, requirement] of (declaration.requires ?? []).entries()) {
        const stored = this.definitions.get(protocolKey(requirement))
        if (stored === undefined) {
          issues.push(freezeIssue({
            code: 'definition-unavailable',
            severity: requirement.optional === true ? 'warning' : 'error',
            participant: declaration.participant.id,
            path: `/declarations/${declarationIndex}/requires/${index}`,
            message: `no definition recognizes ${requirement.apiVersion} ${requirement.kind}`,
          }))
          continue
        }
        const group = groups.get(stored) ?? { requirements: [], supports: [] }
        try {
          group.requirements.push(Object.freeze({
            participant: declaration.participant.id,
            requirement: Object.freeze({
              ...requirement,
              ...(Object.hasOwn(requirement, 'spec')
                ? { spec: stored.definition.validateRequirement(requirement.spec, validationContext(requirement)) }
                : { spec: stored.definition.validateRequirement(undefined, validationContext(requirement)) }),
            }),
          }))
        } catch (error) {
          issues.push(freezeIssue({
            code: 'invalid-requirement', severity: 'error', participant: declaration.participant.id,
            path: `/declarations/${declarationIndex}/requires/${index}/spec`, message: errorMessage(error),
          }))
```

</details>

**依据 3 · 源码核查**：[packages/core/src/negotiation.ts:178-219](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L178-L219)

领域协商与报告

<details>
<summary>查看原文（42行）</summary>

```text
    for (const stored of [...groups.keys()].sort((left, right) => compareStrings(protocolKey(left.definition), protocolKey(right.definition)))) {
      const group = groups.get(stored) as NonNullable<ReturnType<typeof groups.get>>
      let outcome: ProtocolNegotiationOutcome
      try {
        outcome = stored.definition.negotiate(Object.freeze({
          requirements: Object.freeze([...group.requirements]),
          supports: Object.freeze([...group.supports]),
          ...(policy === undefined ? {} : { policy }),
        }))
        if (Object.hasOwn(outcome, 'agreement') && stored.definition.validateAgreement !== undefined) {
          outcome = Object.freeze({
            ...outcome,
            agreement: stored.definition.validateAgreement(
              outcome.agreement,
              validationContext(stored.definition),
            ),
          })
        }
      } catch (error) {
        outcome = { issues: [{ code: 'definition-failed', severity: 'error', message: errorMessage(error) }] }
      }
      const protocolIssues = Object.freeze((outcome.issues ?? []).map(freezeIssue))
      issues.push(...protocolIssues)
      protocols.push(Object.freeze({
        apiVersion: stored.definition.apiVersion,
        kind: stored.definition.kind,
        participants: Object.freeze([...new Set([
          ...group.requirements.map(row => row.participant),
          ...group.supports.map(row => row.participant),
        ])].sort(compareStrings)),
        ...(Object.hasOwn(outcome, 'agreement') ? { agreement: outcome.agreement } : {}),
        issues: protocolIssues,
      }))
    }

    return Object.freeze({
      apiVersion: 'core.dsh/report/v1alpha1',
      evaluator: Object.freeze({ ...this.evaluator }),
      compatible: !issues.some(issue => issue.severity === 'error'),
      protocols: Object.freeze(protocols),
      issues: Object.freeze(issues),
    })
```

</details>

#### 缺口

- 未运行边界矩阵
  **影响**：无法确认所有领域错误映射
  **进一步探讨**：构造缺定义及重复版本测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · compatible 能证明运行吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

报告只表明给定声明和定义没有产生 error。定义可选验证 agreement，且定义本身是可执行函数，因此不能把装载任意第三方定义等同于纯粹解析不可信清单。根包是私有开发工作区，适配器为独立包。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/negotiation.ts:178-219](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L178-L219)

报告使用注册函数

<details>
<summary>查看原文（42行）</summary>

```text
    for (const stored of [...groups.keys()].sort((left, right) => compareStrings(protocolKey(left.definition), protocolKey(right.definition)))) {
      const group = groups.get(stored) as NonNullable<ReturnType<typeof groups.get>>
      let outcome: ProtocolNegotiationOutcome
      try {
        outcome = stored.definition.negotiate(Object.freeze({
          requirements: Object.freeze([...group.requirements]),
          supports: Object.freeze([...group.supports]),
          ...(policy === undefined ? {} : { policy }),
        }))
        if (Object.hasOwn(outcome, 'agreement') && stored.definition.validateAgreement !== undefined) {
          outcome = Object.freeze({
            ...outcome,
            agreement: stored.definition.validateAgreement(
              outcome.agreement,
              validationContext(stored.definition),
            ),
          })
        }
      } catch (error) {
        outcome = { issues: [{ code: 'definition-failed', severity: 'error', message: errorMessage(error) }] }
      }
      const protocolIssues = Object.freeze((outcome.issues ?? []).map(freezeIssue))
      issues.push(...protocolIssues)
      protocols.push(Object.freeze({
        apiVersion: stored.definition.apiVersion,
        kind: stored.definition.kind,
        participants: Object.freeze([...new Set([
          ...group.requirements.map(row => row.participant),
          ...group.supports.map(row => row.participant),
        ])].sort(compareStrings)),
        ...(Object.hasOwn(outcome, 'agreement') ? { agreement: outcome.agreement } : {}),
        issues: protocolIssues,
      }))
    }

    return Object.freeze({
      apiVersion: 'core.dsh/report/v1alpha1',
      evaluator: Object.freeze({ ...this.evaluator }),
      compatible: !issues.some(issue => issue.severity === 'error'),
      protocols: Object.freeze(protocols),
      issues: Object.freeze(issues),
    })
```

</details>

**依据 2 · 源码核查**：[package.json:1-13](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/package.json#L1-L13)

根包工作区脚本

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-std-workspace",
  "private": true,
  "license": "MIT",
  "packageManager": "pnpm@11.21.0",
  "scripts": {
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm run build && pnpm -r test",
    "test:release-plan": "vitest run scripts/release-plan.spec.mjs",
    "check:changelogs": "node scripts/check-changelogs.mjs",
    "check": "pnpm run check:changelogs && pnpm run test:release-plan && pnpm run test"
  },
```

</details>

**依据 3 · 作者声明**：[README.md:33-45](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/README.md#L33-L45)

作者说明适配与声明判断

<details>
<summary>查看原文（13行）</summary>

```text
**Adapter functions and implementation**
An adapter maps internal product services to the standard protocols the product adopts. Reusable adapters can reduce repeated product API integration work for third-party plugins. Each project can design its own adapter or use an existing implementation.

Third-party plugins target the protocol contracts they adopt; adapter internals and package names are not a shared entrypoint. [`@dsh-std/adapter-dsh`](packages/adapter-dsh/README.md) provides a set of mappings for DeepSeek Harness. TUIs, Web frontends, remote runners, and other integrators can provide their own implementations. Compatibility depends on protocol versions, live capabilities, and product mappings.

## What else is great about this (Beyond stable dependencies)?

Separating protocol contracts from product implementations supports the following development patterns:

- **Less repeated platform integration**: Plugins can reuse business logic that follows protocol contracts, while each product's mappings connect it to local capabilities.
- **On-Demand Activation & Zero Leaks (Facet model)**: A single plugin package can contain both frontend UI and backend logic. A host only activates the facets it needs (e.g., a headless server never loads frontend UI code). When a plugin is disabled or uninstalled, all listeners, timers, and resources are automatically garbage-collected by the scope.
- **Know Before Installing (No crash roulette)**: With static manifests (`dsh-plugin.json`), marketplaces, hosts, and CI tools calculate compatibility in milliseconds **without running a single line of plugin code**. No more installing a plugin only to find out it crashes at runtime.
- **Blazing-fast Headless Unit Tests**: The protocol core consists entirely of pure data structures and pure-function negotiators. Testing plugins or hosts takes tens of milliseconds in lightweight Node.js/CI—no need to spin up a full DSH instance or heavy browser.
```

</details>

#### 缺口

- 未测实际激活和清理
  **影响**：不能证明跨宿主运行
  **进一步探讨**：对照声明和真实可执行能力

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样在项目中评估？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先挑一个需要版本协商的领域，用参考 core 和受控协议定义在 CI 检查兼容，再单独验证真实宿主映射。若声明维护代价过高，保持直接集成；不需要把根工作区安装到 DSH profile。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/README.md#L5-L9)

参考实现可选

```text
In plain terms, DSH Standard is a set of **universal interoperability protocols**. Its goal is simple: let DSH plugins, background runtimes, and various user interfaces (TUI terminals, Web UIs, desktop apps, headless daemons) decouple cleanly and work together smoothly.

`@dsh-std/core` is a "meta-protocol" (the **protocol about protocols**). Domain-specific protocols—like Command, Tool, Model, and Presentation—sit on top of this meta-protocol substrate for discovery and negotiation, each versioned independently. Different hosts and applications only implement the parts they actually need.

Reference packages provide types, validators, and pure-function negotiators. Conforming implementations are not required to depend on these npm packages, nor do they need to run inside DeepSeek Harness.
```

**依据 2 · 作者声明**：[README.md:33-36](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/README.md#L33-L36)

DSH 映射独立

```text
**Adapter functions and implementation**
An adapter maps internal product services to the standard protocols the product adopts. Reusable adapters can reduce repeated product API integration work for third-party plugins. Each project can design its own adapter or use an existing implementation.

Third-party plugins target the protocol contracts they adopt; adapter internals and package names are not a shared entrypoint. [`@dsh-std/adapter-dsh`](packages/adapter-dsh/README.md) provides a set of mappings for DeepSeek Harness. TUIs, Web frontends, remote runners, and other integrators can provide their own implementations. Compatibility depends on protocol versions, live capabilities, and product mappings.
```

**依据 3 · 源码核查**：[packages/core/src/negotiation.ts:90-105](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L90-L105)

可先解析和协商

<details>
<summary>查看原文（16行）</summary>

```text
  resolve(reference: ApiReference): ProtocolDefinition | undefined {
    validateApiReference(reference)
    return this.definitions.get(protocolKey(reference))?.definition
  }

  understands(reference: ApiReference): boolean {
    return this.resolve(reference) !== undefined
  }

  negotiate(declarations: readonly ProtocolDeclaration[], policy?: unknown): NegotiationReport {
    const participantIds = new Set<string>()
    for (const declaration of declarations) {
      validateProtocolDeclaration(declaration)
      if (participantIds.has(declaration.participant.id)) {
        throw new TypeError(`duplicate participant identity ${JSON.stringify(declaration.participant.id)}`)
      }
```

</details>

#### 缺口

- 未验证发行包
  **影响**：环境和升级耗时未知
  **进一步探讨**：做最小版本冲突样例

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 比较协议报告与普通错误是否更好定位问题？

**研究主题**：新假设与验证

#### 完整回答

对照版本不符、可选功能缺失和错误声明三种情况。比较集成者找到责任方及恢复时间，若报告未改善或维护成本高于收益就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/negotiation.ts:113-142](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L113-L142)

错误带参与者和路径

<details>
<summary>查看原文（30行）</summary>

```text
    const issues: ProtocolIssue[] = []
    for (const [declarationIndex, declaration] of declarations.entries()) {
      for (const [index, requirement] of (declaration.requires ?? []).entries()) {
        const stored = this.definitions.get(protocolKey(requirement))
        if (stored === undefined) {
          issues.push(freezeIssue({
            code: 'definition-unavailable',
            severity: requirement.optional === true ? 'warning' : 'error',
            participant: declaration.participant.id,
            path: `/declarations/${declarationIndex}/requires/${index}`,
            message: `no definition recognizes ${requirement.apiVersion} ${requirement.kind}`,
          }))
          continue
        }
        const group = groups.get(stored) ?? { requirements: [], supports: [] }
        try {
          group.requirements.push(Object.freeze({
            participant: declaration.participant.id,
            requirement: Object.freeze({
              ...requirement,
              ...(Object.hasOwn(requirement, 'spec')
                ? { spec: stored.definition.validateRequirement(requirement.spec, validationContext(requirement)) }
                : { spec: stored.definition.validateRequirement(undefined, validationContext(requirement)) }),
            }),
          }))
        } catch (error) {
          issues.push(freezeIssue({
            code: 'invalid-requirement', severity: 'error', participant: declaration.participant.id,
            path: `/declarations/${declarationIndex}/requires/${index}/spec`, message: errorMessage(error),
          }))
```

</details>

**依据 2 · 源码核查**：[packages/core/src/negotiation.ts:213-219](https://github.com/T-Auto/dsh-std/blob/37e9c35b953f0dccaad089df6e68e4f00daae7bd/packages/core/src/negotiation.ts#L213-L219)

报告格式

```text
    return Object.freeze({
      apiVersion: 'core.dsh/report/v1alpha1',
      evaluator: Object.freeze({ ...this.evaluator }),
      compatible: !issues.some(issue => issue.severity === 'error'),
      protocols: Object.freeze(protocols),
      issues: Object.freeze(issues),
    })
```

#### 缺口

- 无诊断实测
  **影响**：收益未知
  **进一步探讨**：用同一矩阵盲评诊断耗时

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
