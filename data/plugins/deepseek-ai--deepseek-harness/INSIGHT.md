# DeepSeek Harness

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[22ddee3](https://github.com/deepseek-ai/deepseek-harness/tree/22ddee3792402c3e70ec5f86a63c3e3e895a2f60)

<!-- BEGIN META -->
[![GitHub ★ 261,276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=261%2C276&color=yellow&logo=github&style=flat)](https://github.com/deepseek-ai/deepseek-harness)
<!-- END META -->

> **实现功能**：基于Cordis插件组合的开源Agent运行宿主，提供会话、工具与多应用入口。

> **核心亮点**：相对SDK脚本或fork核心，将模型、工具、会话及loop组织为可替换配置树，复用Cordis可逆effect和事件机制；不证明同模型任务更准确。[Q01](#research-q01)

> **风险与缺陷**：可逆注册和持久事件不等于外部副作用可回滚，声明兼容不保证运行兼容；预览软件安全边界须依赖隔离环境。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它是什么类型，插件化对谁有什么增量？](#detail-section-11)
  - [Q02 · 组合、工具执行和会话事实怎样衔接？](#detail-section-12)
  - [Q03 · 可组合是否降低了实际权限和恢复负担？](#detail-section-13)
  - [Q04 · 如何验证“可替换”真的减少定制成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要替换Agent模型、工具与交互面的开发者；这是宿主基础设施，非DSH第三方插件。[Q01](#research-q01)

直接模型SDK加少量工具脚本，或fork宿主修改。可比较定制成本，不能用不同模型/工具预算比较任务质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|插件组合宿主|按配置替换Agent子系统|开发预览、兼容需验收|
|作用域工具|准入、审批与调用|取决实际策略插件|
|会话事件|事实记录与观察|非外部副作用事务|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|兼容Node与应用profile|必需|启动宿主|按发布入口核对|
|模型连接与凭据|模型任务必需|推理调用|仅检查配置或使用隔离模型|
|可信插件及隔离权限|试用必需|限制代码/文件副作用|不用敏感主环境|
|pnpm与构建|源码运行必需|生成产物|使用已发布入口|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|选隔离profile与最少权限|开发者核对配置树|恢复空profile|
|连接模型并跑基线任务|开发者确认交付|核对凭据和预算|
|替换插件、取消并重启|开发者检查清理及持久|核对副作用后回滚配置|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|Node、模型和隔离资源|profile/权限/凭据配置|配置工时|
|持续|模型调用、插件与存储|兼容维护和备份|单位任务总成本|
|失败恢复|重启、日志和重复调用|核对外部副作用及恢复|恢复率和人工时间|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|配置替换|profile层与作用域服务|实际迁移节时|
|调用约束|审批缺失deny和准入|所有工具实际边界|
|事实观察|append-only session契约|后端崩溃恢复及外部副作用|

> **思考**：可逆注册和持久事件不等于外部副作用可回滚，声明兼容不保证运行兼容；预览软件安全边界须依赖隔离环境。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对SDK脚本或fork核心，将模型、工具、会话及loop组织为可替换配置树，复用Cordis可逆effect和事件机制；不证明同模型任务更准确。[Q01](#research-q01)

相对SDK脚本或fork核心，将模型、工具、会话及loop组织为可替换配置树，复用Cordis可逆effect和事件机制；不证明同模型任务更准确。[Q01](#research-q01)

将持久session事实和瞬态Agent事件分域，统一作用域工具准入值得借鉴；复用需承担生命周期、存储及宿主兼容的整套契约。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

可逆注册和持久事件不等于外部副作用可回滚，声明兼容不保证运行兼容；预览软件安全边界须依赖隔离环境。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有Agent扩展需求的开发者可在隔离profile以同模型小任务试用，先验收权限、取消及重启，不以架构或semver替代实际功能验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持组合与执行接缝的存在；互换收益、崩溃恢复与安全隔离未验证；契约验收假设未验证。

- 已检查：作者 README、包清单、源码路径 docs/architecture.md、SAFETY.md、packages/boot/app-boot/src/plugin-compatibility.ts、packages/core/tools/src/index.ts、packages/core/tools/src/pipeline.ts、packages/core/session/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定提交抽读README、架构、安全说明、兼容判定、tools及session关键源码；inventory仅选读文件，不是全宿主LOC，未运行。
- 下一步：隔离profile对照SDK脚本，同模型同任务记录替换改动、完成率、缺审批、取消/卸载、重启和重复副作用。

**分析版本**

- **仓库**：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- **版本号**：0.2.1-rc.3（[固定提交 22ddee3](https://github.com/deepseek-ai/deepseek-harness/tree/22ddee3792402c3e70ec5f86a63c3e3e895a2f60)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是以作用域、持久事件、取消/清理的接缝验收预测插件互换成本，优于仅semver；同任务对照修改量与恢复，成本不降则否定。[Q04](#research-q04)

隔离profile对照SDK脚本，同模型同任务记录替换改动、完成率、缺审批、取消/卸载、重启和重复副作用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：5e7837e7f09b2c1b31808b8af50d25a564ee03882330eb600a71c000fc4fa57b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 273 | — | — | 3167 |
| .ts | source | 4 | 2775 | 1816 | 780 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+created%3A2026-09-26T03%3A38%3A09.835Z..2026-10-26T03%3A38%3A09.835Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/deepseek-ai/deepseek-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A38%3A09.835Z..2026-10-26T03%3A38%3A09.835Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件化运行宿主如何组织替换、持久与准入，是否能减少定制恢复负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么类型，插件化对谁有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DeepSeek Harness是开源Agent运行宿主/基础设施，而非可安装到另一个DSH的单插件。对象是需要替换模型、工具、持久化或交互面的开发者，合格结果是可复现的配置化Agent应用。architecture描述Cordis共享context、typed events和可逆effects，profile/bundle/patch按层装配；相对直接模型SDK脚本，增量是统一生命周期与扩展接缝，相对fork宿主改核心减少源码分叉需求。Cordis机制明确归上游，项目增量是将工具、会话与loop等产品子系统应用到该组合模型，不据此宣称Agent任务质量更高。开发预览已明确兼容性破坏，长期稳定性是另一个问题。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/README.md#L5-L15)

作者定位及预览状态

<details>
<summary>查看原文（11行）</summary>

```text
DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## Developer preview

DeepSeek Harness is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.
```

</details>

**依据 2 · 作者声明**：[docs/architecture.md:7-27](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/docs/architecture.md#L7-L27)

插件树、上游和有序配置层

<details>
<summary>查看原文（21行）</summary>

```text
## Cordis

[Cordis](cordis-primer.md) is the framework under dsh: plugins contribute services, typed events, and reversible effects to a shared context. Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself, so each is replaceable from configuration.

There is no privileged core to patch: you extend dsh by mounting a plugin beside the others, and registrations are effects that unwind when their plugin unloads.

## Profiles and bundles

A running `dsh` is a plugin tree composed at boot from ordered layers.

A **profile** is a named composition stored in the Harness home. It lists the bundles it stacks, holds any out-of-tree plugins it installs, and keeps the user's own `cordis.patch.yml`. `web`, `headless`, `sdk`, `sdk-minimal`, and `acp` ship as templates.

A **bundle** is a distribution format for Cordis config rows and the code they mount, so whatever it inserts stays patchable by the layers above it.

Each declares itself in its own `package.json` under a `dsh` field: `dsh.profile` lists a profile's bundles, and `dsh.bundle` points at a bundle's patch file.

[`dsh-base`](../packages/bundle/base/README.md) is the shared first layer of the `web`, `headless`, `sdk`, and `acp` profiles: model adapters, tools, persistence, sandbox and approval policy, settings, credentials, telemetry. [`dsh-web-app`](../packages/bundle/web-app/README.md) adds the browser application, [`dsh-headless`](../packages/bundle/headless/README.md) adds a one-shot runner with no server, [`dsh-sdk-app`](../packages/bundle/sdk-app/README.md) adds the SDK JSON-RPC server, and [`dsh-acp-app`](../packages/bundle/acp-app/README.md) adds the automation-only ACP server. [`dsh-sdk-minimal`](../packages/bundle/sdk-minimal/README.md) is the deliberate exception: one bundle owns its complete explicit SDK tree and does not apply `dsh-base`.

Layers apply to an empty entry list: the profile's ordered bundles, its `cordis.patch.yml`, the home patch, then `--patch` overlays. A patch targets a row by id and replaces its whole config, or inserts new rows. A `preset` patch applies these operations inside that declaration’s `config.plugins`, with the same layer precedence.

YAML controls HMR: base enables config-only `dsh-hmr`; headless, SDK and ACP disable it; `sdk-minimal` omits it. Profile patches override these defaults. HMR coordinates watching and reloads; the launcher provides profile data and readiness.
```

</details>

#### 缺口

- 缺少同任务定制/升级的实际成本对照
  **影响**：不能确认端到端正确性或定制收益
  **进一步探讨**：以隔离profile和同模型固定任务对照最小SDK脚本，记录完成率、修改量、恢复人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组合、工具执行和会话事实怎样衔接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

profile列bundle再依次应用本地/home/命令patch，意味着同名配置覆盖有固定顺序，而不是任意插件并列无冲突。compatibility读取engines.dsh优先，否则检查DSH peers，显式预发布参与并支持精确版本豁免；这是声明兼容准入，不能证明运行兼容。ToolsService把定义和restriction放入作用域层，ToolExecutionPipeline对调用保留step admission、取消和审批通道语义，缺审批通道的ask降为deny。会话模块明确append-only事件日志并在跨边界验证/冻结；这些机制把瞬态Agent事件与持久事实分开，适合可观察扩展，但存储后端落盘、崩溃恢复和工具外部副作用并非只靠内存日志即可原子化。本项未审计整个loop，不能从接缝存在推出exactly-once任务执行。

#### 证据与依据

**依据 1 · 源码核查**：[docs/architecture.md:15-27](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/docs/architecture.md#L15-L27)

配置层次

<details>
<summary>查看原文（13行）</summary>

```text
A running `dsh` is a plugin tree composed at boot from ordered layers.

A **profile** is a named composition stored in the Harness home. It lists the bundles it stacks, holds any out-of-tree plugins it installs, and keeps the user's own `cordis.patch.yml`. `web`, `headless`, `sdk`, `sdk-minimal`, and `acp` ship as templates.

A **bundle** is a distribution format for Cordis config rows and the code they mount, so whatever it inserts stays patchable by the layers above it.

Each declares itself in its own `package.json` under a `dsh` field: `dsh.profile` lists a profile's bundles, and `dsh.bundle` points at a bundle's patch file.

[`dsh-base`](../packages/bundle/base/README.md) is the shared first layer of the `web`, `headless`, `sdk`, and `acp` profiles: model adapters, tools, persistence, sandbox and approval policy, settings, credentials, telemetry. [`dsh-web-app`](../packages/bundle/web-app/README.md) adds the browser application, [`dsh-headless`](../packages/bundle/headless/README.md) adds a one-shot runner with no server, [`dsh-sdk-app`](../packages/bundle/sdk-app/README.md) adds the SDK JSON-RPC server, and [`dsh-acp-app`](../packages/bundle/acp-app/README.md) adds the automation-only ACP server. [`dsh-sdk-minimal`](../packages/bundle/sdk-minimal/README.md) is the deliberate exception: one bundle owns its complete explicit SDK tree and does not apply `dsh-base`.

Layers apply to an empty entry list: the profile's ordered bundles, its `cordis.patch.yml`, the home patch, then `--patch` overlays. A patch targets a row by id and replaces its whole config, or inserts new rows. A `preset` patch applies these operations inside that declaration’s `config.plugins`, with the same layer precedence.

YAML controls HMR: base enables config-only `dsh-hmr`; headless, SDK and ACP disable it; `sdk-minimal` omits it. Profile patches override these defaults. HMR coordinates watching and reloads; the launcher provides profile data and readiness.
```

</details>

**依据 2 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:54-85](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/boot/app-boot/src/plugin-compatibility.ts#L54-L85)

兼容判定

<details>
<summary>查看原文（32行）</summary>

```text

function unmetRequirements(fields: Record<string, unknown>, runtimeVersion: string): Record<string, string> {
  const engines = Object.hasOwn(fields, 'engines') ? objectOf(fields.engines, 'Plugin manifest engines') : {}
  if (Object.hasOwn(engines, 'dsh')) {
    const range = engines.dsh
    if (typeof range !== 'string') throw new Error('Plugin manifest engines.dsh must be a string')
    return satisfies(runtimeVersion, range) ? {} : { 'engines.dsh': range }
  }
  if (!Object.hasOwn(fields, 'peerDependencies')) return {}
  const dependencies = objectOf(fields.peerDependencies, 'Plugin manifest peerDependencies')
  const unmet: Record<string, string> = {}
  for (const [name, range] of Object.entries(dependencies)) {
    if (typeof range !== 'string') {
      throw new Error(`Plugin manifest peerDependencies[${JSON.stringify(name)}] must be a string`)
    }
    if (name !== '@deepseek-ai/dsh' && !name.startsWith('@deepseek-ai/dsh-')) continue
    const requirement = ['workspace:^', 'workspace:~', 'workspace:*'].includes(range) ? runtimeVersion : range
    if (!satisfies(runtimeVersion, requirement)) unmet[name] = range
  }
  return unmet
}

/**
 * Check the plugin's dsh requirements against the runtime. An own `engines.dsh` range decides alone and
 * peerDependencies are ignored; otherwise every @deepseek-ai/dsh or @deepseek-ai/dsh-* peer must match.
 * Prereleases participate in ranges. For peers only, workspace:^, workspace:~, and workspace:* refer to
 * the current runtime; other empty or invalid ranges, including any workspace: `engines.dsh`, are unmet.
 * @param manifest - parsed plugin package.json; inherited fields are ignored.
 * @param exemptions - exact plugin name@version keys mapped to exact runtime versions.
 * @param runtimeVersion - running dsh version, defaulting to this app-boot package.
 * @returns unmet requirements and exemption status, or undefined when every requirement is met.
 * @throws for malformed manifest engines or peer fields, invalid runtime versions, or missing identity on a mismatch.
```

</details>

**依据 3 · 源码核查**：[packages/core/tools/src/index.ts:38-87](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/core/tools/src/index.ts#L38-L87)

作用域工具限制

<details>
<summary>查看原文（50行）</summary>

```text
/** One restriction compiled at registration for repeated live-global lookup. */
interface CompiledToolRestriction {
  readonly allow?: ReadonlySet<string>
  readonly deny?: ReadonlySet<string>
}

/** One registered definition and its step-time activation condition. */
interface ToolRegistration {
  readonly definition: ToolDefinition
  readonly when: ToolRegistrationOptions['when']
}

/** One scope's complete registry view, derived in a single layer traversal. */
interface ToolView {
  /** Visible definitions after restrictions, scoped shadowing, and inherited restrictions. */
  readonly visible: ReadonlyMap<string, ToolDefinition>
  /** Registrations behind {@link visible}, keyed by the same names. */
  readonly registrations: ReadonlyMap<string, ToolRegistration>
  /** Pre-restriction capability names used by prompt-order validation. */
  readonly knownNames: ReadonlySet<string>
  /** Current global names that a scoped restriction may name. */
  readonly restrictableNames: ReadonlySet<string>
}

/** One scope's complete tool-registry contribution. */
class ToolLayer implements ScopeLayer {
  readonly tools: NamedEntries<ToolRegistration>
  readonly restrictions = new AnonymousEntries<CompiledToolRestriction>()

  constructor(scope: ScopeKey | undefined) {
    this.tools = new NamedEntries(name => new Error(scope === undefined
      ? `tool "${name}" is already registered (for a per-agent variant, register through that agent's \`agent.ctx\` instead)`
      : `tool "${name}" is already registered in this scope`))
  }

  /** Whether every contribution table in this aggregate layer is empty. */
  isEmpty(): boolean {
    return this.tools.isEmpty() && this.restrictions.isEmpty()
  }

  /** Whether every compiled restriction in this layer admits a global tool name. */
  admits(name: string): boolean {
    for (const filter of this.restrictions.values()) {
      if ((filter.allow !== undefined && !filter.allow.has(name))
        || (filter.deny !== undefined && filter.deny.has(name))) return false
    }
    return true
  }

}
```

</details>

**依据 4 · 源码核查**：[packages/core/tools/src/pipeline.ts:422-468](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/core/tools/src/pipeline.ts#L422-L468)

审批通道缺失降级

<details>
<summary>查看原文（47行）</summary>

```text
   * Resolve an `ask` decision to allow/deny through the approval seam. The
   * seam is consumed opportunistically with `ctx.get('approval')` — a
   * deployment that composes no ApprovalService keeps the historical degrade
   * to deny, and an unmount mid-session degrades the same way on the next ask.
   * An agent-less execution also degrades: without an agent there is no
   * session to audit to and no UI to route to. Otherwise the outcome maps
   * one-to-one — `allowed-once` proceeds; the three non-grants deny with
   * distinct reasons so the model can tell a human "no" from an absent
   * approval channel.
   */
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
```

</details>

**依据 5 · 源码核查**：[packages/core/session/src/index.ts:150-171](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/core/session/src/index.ts#L150-L171)

跨边界快照与事件校验

<details>
<summary>查看原文（22行）</summary>

```text
/** Detach, validate, and freeze the creation metadata published by a session. */
function snapshotSessionHeader(id: SessionId, source?: SessionHeader): SessionHeader {
  const input: unknown = source === undefined
    ? { version: SESSION_FORMAT_VERSION, id, createdAt: Date.now(), isSeeded: false }
    : source
  const snapshot = snapshotJsonValue(input)
  if (snapshot === undefined) throw new Error('session header is not losslessly JSON-serializable')
  return validateSessionHeader(id, snapshot)
}

/**
 * Validate an exclusively owned event and deeply freeze its identified message
 * without copying the event. The caller transfers an object graph that no
 * producer retains and that shares no mutable children with another event.
 * Use {@link snapshotSessionEvent} when exclusive ownership is not guaranteed.
 * @param event - exclusively owned event imported across a trusted boundary.
 * @returns the same event object with a validated, deeply frozen message.
 * @throws when event-local surface metadata, request-header fields, or message invariants are invalid; history relations are not checked.
 */
export function adoptSessionEvent<T extends SessionEvent>(event: T): T {
  validateSessionEventData(event, `session event at seq ${event.seq}`)
  validateSurfaceMetadata(event)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可组合是否降低了实际权限和恢复负担？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

不自动降低。SAFETY明示尚未安全审计，能访问代码执行、文件、网络和凭据，沙箱/审批不是唯一隔离。安装需要Node与选定profile及模型连接，源码构建还需pnpm/build；不同profile和desktop的包/锁文件/激活归属有区别，不能盲用外部CLI修改桌面。首次投入是选择配置和权限、模型凭据、理解patch覆盖；持续成本是模型调用、插件兼容和数据备份；失败恢复还需核对已执行外部工具，日志回放不代表副作用回滚。可逆effects有利于卸载注册，但不能撤销已发送请求或已写业务文件。金额、工时、崩溃恢复成功率都未实测，因此配置可替换只构成减负机制假设。

#### 证据与依据

**依据 1 · 作者声明**：[SAFETY.md:5-23](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/SAFETY.md#L5-L23)

作者明确权限及安全边界

<details>
<summary>查看原文（19行）</summary>

```text
## Experimental status

DeepSeek Harness is experimental developer-preview software. It has not undergone a security audit and must not be treated as secure or production-ready.

The project can execute model-generated code and commands, load third-party plugins, and access the network, processes, credentials, and files made available to it. Incorrect model output, defects, misconfiguration, malicious input, or untrusted plugins may damage the host computer, modify or delete files, disclose data or credentials, or cause other unintended effects.

## Sandbox limitations

Sandboxing, approval prompts, and permission controls can reduce risk, but they do not guarantee isolation or prevent damage. Even correctly enforced restrictions cannot protect resources that the project is allowed to access.

Do not rely on DeepSeek Harness as the sole security control for untrusted workloads.

## Responsible use

- Run the project with the least privileges and access required.
- Prefer a disposable virtual machine, container, or dedicated environment.
- Keep backups of files that the project can access.
- Do not expose sensitive credentials or data unless you accept the risk.
- Review plugins, configuration, and proposed commands before allowing them to run.
```

</details>

**依据 2 · 作者声明**：[docs/architecture.md:49-53](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/docs/architecture.md#L49-L53)

desktop运行包和profile归属

```text
## Desktop application

The [Electron desktop application](../apps/desktop/README.md) ships its exact dsh production runtime in signed resources and owns the reserved `$DSH_HOME/profiles/desktop`. Shared helpers initialize profile files, reconcile bundles, and resolve installation and bundle dependencies without replacing pnpm-owned packages. Desktop and npm CLI share product data but keep packages, activation, and lockfiles separate. Desktop’s bundled CLI manages its initialized plugins.

Electron starts the private Desktop Host in Electron Node mode. The Host invokes the shared CLI profile runner and complete Web application. The window immediately loads packaged Web assets and waits for boot injections before activating client plugins in the same document. Web owns RPC and streams; the desktop carrier connects the local page to the authenticated Host. Node IPC carries boot injections, readiness, fatal errors, and shutdown. Desktop listens on an OS-assigned port by default; profile configuration can override it. Shell-owned UI runs plugin transactions through bundled pnpm with normal user and profile configuration.
```

**依据 3 · 作者声明**：[README.md:19-41](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/README.md#L19-L41)

npm及源码启动路径

<details>
<summary>查看原文（23行）</summary>

````text
### Run from `npm`

Install `Node.js`, then run:

```sh
npx @deepseek-ai/dsh web
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding.
````

</details>

#### 缺口

- 迁移、兼容和副作用失败恢复的工时与完成率未知
  **影响**：不能确认端到端正确性或定制收益
  **进一步探讨**：以隔离profile和同模型固定任务对照最小SDK脚本，记录完成率、修改量、恢复人工时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证“可替换”真的减少定制成本？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议需要做Agent扩展的开发者在隔离profile试用，不将其当生产安全承诺或全部第三方插件兼容证明。先以同模型单任务建立直接SDK脚本基线，再只替换模型adapter或工具策略，并模拟调用中取消、插件卸载、缺审批通道和宿主重启。未验证假设是把插件声明兼容升级为少量“接缝契约验收”——对作用域、持久事件和清理行为分别验证——比仅semver更能预测互换成本。最小对照检查两种实现交付率、改动行/配置、遗留注册、重复外部副作用及人工恢复。若标准接缝仍需大量跨模块修改或恢复时间不降，否定可替换减负主张；契约验收本身也增加维护负担，不能由架构优雅直接推出需求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/boot/app-boot/src/plugin-compatibility.ts:76-85](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/boot/app-boot/src/plugin-compatibility.ts#L76-L85)

声明兼容与实际契约存在区别

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Check the plugin's dsh requirements against the runtime. An own `engines.dsh` range decides alone and
 * peerDependencies are ignored; otherwise every @deepseek-ai/dsh or @deepseek-ai/dsh-* peer must match.
 * Prereleases participate in ranges. For peers only, workspace:^, workspace:~, and workspace:* refer to
 * the current runtime; other empty or invalid ranges, including any workspace: `engines.dsh`, are unmet.
 * @param manifest - parsed plugin package.json; inherited fields are ignored.
 * @param exemptions - exact plugin name@version keys mapped to exact runtime versions.
 * @param runtimeVersion - running dsh version, defaulting to this app-boot package.
 * @returns unmet requirements and exemption status, or undefined when every requirement is met.
 * @throws for malformed manifest engines or peer fields, invalid runtime versions, or missing identity on a mismatch.
```

</details>

**依据 2 · 源码核查**：[packages/core/tools/src/pipeline.ts:422-468](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/core/tools/src/pipeline.ts#L422-L468)

可用来形成审批/卸载反例

<details>
<summary>查看原文（47行）</summary>

```text
   * Resolve an `ask` decision to allow/deny through the approval seam. The
   * seam is consumed opportunistically with `ctx.get('approval')` — a
   * deployment that composes no ApprovalService keeps the historical degrade
   * to deny, and an unmount mid-session degrades the same way on the next ask.
   * An agent-less execution also degrades: without an agent there is no
   * session to audit to and no UI to route to. Otherwise the outcome maps
   * one-to-one — `allowed-once` proceeds; the three non-grants deny with
   * distinct reasons so the model can tell a human "no" from an absent
   * approval channel.
   */
  private async serviceAsk(
    exec: ToolExecution,
    ask: Extract<PreToolDecision, { kind: 'ask' }>,
  ): Promise<ToolAskResolution> {
    const approval = this.ctx.get('approval')
    if (approval === undefined) {
      return {
        decision: { kind: 'deny', reason: ask.reason ?? `tool "${exec.name}" requires approval (not yet supported)` },
        approvalCancelled: false,
      }
    }
    if (exec.agent === undefined) {
      return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but the call has no agent to route it through` },
        approvalCancelled: false,
      }
    }
    const outcome = await approval.request({
      agent: exec.agent,
      toolName: exec.name,
      callId: exec.callId,
      ...ask.reason !== undefined ? { reason: ask.reason } : {},
      ...ask.displayReason !== undefined ? { displayReason: ask.displayReason } : {},
      signal: exec.signal,
    })
    switch (outcome) {
      case 'allowed-once': return { decision: { kind: 'allow' }, approvalCancelled: false }
      case 'rejected': return {
        decision: { kind: 'deny', reason: `the user rejected tool "${exec.name}"` },
        approvalCancelled: false,
      }
      case 'cancelled': return {
        decision: { kind: 'deny', reason: `approval for tool "${exec.name}" was cancelled` },
        approvalCancelled: true,
      }
      case 'unavailable': return {
        decision: { kind: 'deny', reason: `tool "${exec.name}" requires approval, but no approval channel is available` },
```

</details>

**依据 3 · 作者声明**：[docs/architecture.md:67-75](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/docs/architecture.md#L67-L75)

持久与瞬态事件区分

```text
## Events

Events are the extension points, and picking the right domain is the first decision in most changes.

- **Session events** are durable facts appended to the log and broadcast through `session/event`. Use one when the fact must survive a reload.
- **Agent events** (`agent/*`) carry a live `Agent`: inbox, step, status, request, validation, continuation. Use one to observe or intercept work in flight.
- **Capability events** attach policy and adapters to a seam (`fs/*`, `tools/*`, `telemetry/*`) without importing the loop.

AgentLoop initializes Agents with rollback and awaits serial `agent/created` before queued work. Unload retains resources through Agent teardown; [agent-loop](../packages/core/agent-loop/README.md#understand-the-implementation) defines ordering.
```

#### 缺口

- 接缝验收预测互换成本的实验没有结果
  **影响**：不能确认端到端正确性或定制收益
  **进一步探讨**：以隔离profile和同模型固定任务对照最小SDK脚本，记录完成率、修改量、恢复人工时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
