# DSH Capability Menu

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[7343fbb](https://github.com/PKUfudawei/dsh-capability-menu/tree/7343fbbffde6d0d69ea242245244784786fb6856)

<!-- BEGIN META -->
[![GitHub ★ 95](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=95&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PKUfudawei/dsh-capability-menu) [![npm 30d 2,976](https://img.shields.io/static/v1?label=npm+30d&message=2%2C976&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@daweifu/capability-menu) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@daweifu/capability-menu)
<!-- END META -->

> **功能**：按常驻、按需和禁用管理工具与技能

> **亮点**：[Q01](#research-q01) 在保留调用者上下文时按需呈现能力。

> **主要限制**：[Q03](#research-q03) 需覆盖其他调用路径及检索额外成本。

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
  - [Q01 · 交付怎样衡量？](#detail-section-11)
  - [Q02 · 如何调用？](#detail-section-12)
  - [Q03 · 权限边界？](#detail-section-13)
  - [Q04 · 采用退出？](#detail-section-14)
  - [Q05 · 什么否定价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户装有大量工具与技能。

全目录常驻。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 全目录常驻。 | 可直接比较 | 保留人工步骤 |
| DSH Capability Menu | 在保留调用者上下文时按需呈现能力。 | 需覆盖其他调用路径及检索额外成本。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 策略筛选曝光，搜索发现后经官方管线调用。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户装有大量工具与技能。 | 保留原流程 |
| 试验 | 策略筛选曝光，搜索发现后经官方管线调用。 | 观察固定版本 |
| 复核 | 隔离 profile 对照三层策略及权限。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少常驻目录负担并准确找到所需能力 | 可降低提示负担而保持任务成功率。 | 隔离 profile 对照三层策略及权限。 |

> **思考**：[Q03](#research-q03) 需覆盖其他调用路径及检索额外成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在保留调用者上下文时按需呈现能力。

保留 agent、signal 与父调用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 需覆盖其他调用路径及检索额外成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 对照三层策略及权限。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少常驻目录负担并准确找到所需能力。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/policy.ts、src/invoke.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少常驻目录负担并准确找到所需能力。未执行目标代码或实际宿主验证。
- 下一步：保留精确调用和用量。

**分析版本**

- **仓库**：[PKUfudawei/dsh-capability-menu](https://github.com/PKUfudawei/dsh-capability-menu)
- **版本号**：0.1.8（[固定提交 7343fbb](https://github.com/PKUfudawei/dsh-capability-menu/tree/7343fbbffde6d0d69ea242245244784786fb6856)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可降低提示负担而保持任务成功率。

保留精确调用和用量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 13246 | 11813 | 1972 | — |
| .md | source | 2 | 370 | — | — | 4296 |
| .mjs | source | 2 | 103 | 59 | 40 | — |
| .tsx | source | 2 | 2533 | 2154 | 312 | — |
| .ts | source | 19 | 6359 | 4500 | 1454 | — |
| .ts | test | 13 | 3843 | 3158 | 286 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PKUfudawei/dsh-capability-menu/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少常驻目录负担并准确找到所需能力

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 交付怎样衡量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

工具很多时，开发者可将少用能力按需发现，模型先搜索再调用。对照全量常驻，验收是任务成功率、初始上下文和新增查找轮数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-8](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/README.md#L1-L8)

作者描述统一管理和上下文目标

```text
<h1 align="center">dsh-capability-menu</h1>

<p align="center">
  <strong>统一管理 DeepSeek Harness 工具与技能，高效检索、按需调用，节省上下文</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@deepseek-ai/dsh"><img src="https://img.shields.io/badge/DeepSeek%20Harness-0.2.1--rc.3-4D6BFE.svg?style=flat-square&labelColor=161b22&logo=deepseek&logoColor=white" alt="DeepSeek Harness 0.2.1-rc.3"/></a>
```

**依据 2 · 源码核查**：[src/policy.ts:24-35](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/policy.ts#L24-L35)

三层策略语义

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Canonical policy classes, mirroring the registry's `CapabilityKind`.
 *
 * - `resident`: the capability is on the dsh-native exposure surface — tools in
 *   `assembly.tools` (the request `tools` payload), skills in the
 *   `<available_skills>` catalog — so the model can call/load it single-hop.
 * - `on-demand`: absent from the native surface but discoverable in the
 *   persistent meta registry; the model reaches it via `meta_search` then
 *   `meta_invoke` (catalog-resident, load/execute on demand).
 * - `disabled`: neither resident nor discoverable nor executable.
 */
export type CapabilityClass = 'resident' | 'on-demand' | 'disabled'
```

</details>

#### 缺口

- 上下文节约可能被查询开销抵消。
  **影响**：规模化目录更易管理。
  **进一步探讨**：固定十个任务比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何调用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

meta_invoke 按 kind 和 ID 找能力，禁用则拒绝；工具定义按当前 agent 解析，转交官方 tools.execute 时保留 signal、parent 和 agent。

#### 证据与依据

**依据 1 · 源码核查**：[src/invoke.ts:180-207](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/invoke.ts#L180-L207)

查找和禁用检查

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args: { id: string; kind: 'tool' | 'skill'; args?: unknown; force?: boolean }, exec: ToolRunContext) {
      const id = args.id.trim()
      const kind = args.kind
      if (kind !== 'tool' && kind !== 'skill') {
        throw new Error('meta_invoke: kind must be "tool" or "skill" (the kind meta_search reported for this id)')
      }
      const capability = ctx.capability.get(id, kind)
      if (capability === undefined) {
        throw new Error(`meta_invoke: no ${kind} capability "${id}" is available`)
      }
      // Disabled capabilities are a hard deny at the execution surface: the
      // registry keeps them indexed so the management UI can list them, but the
      // model can never reach a disabled capability through meta_invoke.
      const policy = ctx.get('capabilityPolicy')
      if (policy?.isDisabledCapability(id, kind)) {
        throw new Error(`meta_invoke: ${kind} capability "${id}" is disabled and cannot be invoked`)
      }

      // Tool: forward to the underlying tool execution (an MCP server call or a
      // harness-native tool cataloged under the built-in server) — or resolve its
      // schema.
      if (capability.kind === 'tool') {
        // On-demand tools are omitted from the prompt assembly, not from the
        // caller's tool view. Resolve in that view so session restrictions and
        // preset-scoped definitions apply to both resolve and execution.
        const definition = ctx.tools.get(capability.name, exec.agent)
        if (definition === undefined) {
          throw new Error(`meta_invoke: tool "${capability.name}" is not available`)
```

</details>

**依据 2 · 源码核查**：[src/invoke.ts:243-250](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/invoke.ts#L243-L250)

转交保留上下文

```text
        const result = await ctx.tools.execute({
          callId: ToolCallId(`${exec.callId}:meta:${id}`),
          name: capability.name,
          arguments: forwarded,
          signal: exec.signal,
          parent: exec.token,
          agent: exec.agent,
        })
```

#### 缺口

- 上游可见性仍依赖宿主。
  **影响**：避免全局视图调用。
  **进一步探讨**：两个 preset 各有不同权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

按需仅从原生提示中移除，工具仍在调用者工具视图。禁用在此执行入口检查，其他直调入口也应核对。搜索和授权并非同一件事。

#### 证据与依据

**依据 1 · 源码核查**：[src/invoke.ts:190-207](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/invoke.ts#L190-L207)

禁用及调用者视图

<details>
<summary>查看原文（18行）</summary>

```text
      // Disabled capabilities are a hard deny at the execution surface: the
      // registry keeps them indexed so the management UI can list them, but the
      // model can never reach a disabled capability through meta_invoke.
      const policy = ctx.get('capabilityPolicy')
      if (policy?.isDisabledCapability(id, kind)) {
        throw new Error(`meta_invoke: ${kind} capability "${id}" is disabled and cannot be invoked`)
      }

      // Tool: forward to the underlying tool execution (an MCP server call or a
      // harness-native tool cataloged under the built-in server) — or resolve its
      // schema.
      if (capability.kind === 'tool') {
        // On-demand tools are omitted from the prompt assembly, not from the
        // caller's tool view. Resolve in that view so session restrictions and
        // preset-scoped definitions apply to both resolve and execution.
        const definition = ctx.tools.get(capability.name, exec.agent)
        if (definition === undefined) {
          throw new Error(`meta_invoke: tool "${capability.name}" is not available`)
```

</details>

**依据 2 · 源码核查**：[src/policy.ts:24-35](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/policy.ts#L24-L35)

曝光策略

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Canonical policy classes, mirroring the registry's `CapabilityKind`.
 *
 * - `resident`: the capability is on the dsh-native exposure surface — tools in
 *   `assembly.tools` (the request `tools` payload), skills in the
 *   `<available_skills>` catalog — so the model can call/load it single-hop.
 * - `on-demand`: absent from the native surface but discoverable in the
 *   persistent meta registry; the model reaches it via `meta_search` then
 *   `meta_invoke` (catalog-resident, load/execute on demand).
 * - `disabled`: neither resident nor discoverable nor executable.
 */
export type CapabilityClass = 'resident' | 'on-demand' | 'disabled'
```

</details>

#### 缺口

- 完整路径一致性未验。
  **影响**：要检查 MCP 与原生工具。
  **进一步探讨**：禁用后尝试所有可用路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先隔离 profile 固定策略，少量能力迁为按需，记录 token、延迟、失败和人工配置。退出导出策略并恢复原常驻目录，确认工具与技能重新可见。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:7-13](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/index.ts#L7-L13)

模块职责

```text
 *   `/invoke`, `/policy`), mounted by the bundle patch as separate entries:
 *   - `registry` (P0): capability catalog + `ctx.capability` service (no model tool).
 *   - `search`   (P1): registers `meta_search`.
 *   - `invoke`   (P2): registers `meta_invoke`.
 *   - `policy`   (P3): Resident/On-demand/Disabled projection policy + `ctx.capabilityPolicy`.
 * - the package root entry (`name` + `apply` below): mounts the Typert gateway
 *   that exposes `ctx.capabilityPolicy` to the browser as the `capabilityPolicy`
```

**依据 2 · 源码核查**：[src/policy.ts:24-35](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/policy.ts#L24-L35)

策略影响提示目录

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Canonical policy classes, mirroring the registry's `CapabilityKind`.
 *
 * - `resident`: the capability is on the dsh-native exposure surface — tools in
 *   `assembly.tools` (the request `tools` payload), skills in the
 *   `<available_skills>` catalog — so the model can call/load it single-hop.
 * - `on-demand`: absent from the native surface but discoverable in the
 *   persistent meta registry; the model reaches it via `meta_search` then
 *   `meta_invoke` (catalog-resident, load/execute on demand).
 * - `disabled`: neither resident nor discoverable nor executable.
 */
export type CapabilityClass = 'resident' | 'on-demand' | 'disabled'
```

</details>

#### 缺口

- 持久策略迁移成本未知。
  **影响**：少量迁移便于对照。
  **进一步探讨**：保留原始策略。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么否定价值？

**研究主题**：新假设与验证

#### 完整回答

同模型比较全常驻、按需及禁用，安排同名工具技能、撤销、空搜索和取消。若越过 preset 限制或新增轮次抵消节约，则当前策略不满足目标。

#### 证据与依据

**依据 1 · 源码核查**：[src/invoke.ts:180-207](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/invoke.ts#L180-L207)

ID、类型及视图检查

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args: { id: string; kind: 'tool' | 'skill'; args?: unknown; force?: boolean }, exec: ToolRunContext) {
      const id = args.id.trim()
      const kind = args.kind
      if (kind !== 'tool' && kind !== 'skill') {
        throw new Error('meta_invoke: kind must be "tool" or "skill" (the kind meta_search reported for this id)')
      }
      const capability = ctx.capability.get(id, kind)
      if (capability === undefined) {
        throw new Error(`meta_invoke: no ${kind} capability "${id}" is available`)
      }
      // Disabled capabilities are a hard deny at the execution surface: the
      // registry keeps them indexed so the management UI can list them, but the
      // model can never reach a disabled capability through meta_invoke.
      const policy = ctx.get('capabilityPolicy')
      if (policy?.isDisabledCapability(id, kind)) {
        throw new Error(`meta_invoke: ${kind} capability "${id}" is disabled and cannot be invoked`)
      }

      // Tool: forward to the underlying tool execution (an MCP server call or a
      // harness-native tool cataloged under the built-in server) — or resolve its
      // schema.
      if (capability.kind === 'tool') {
        // On-demand tools are omitted from the prompt assembly, not from the
        // caller's tool view. Resolve in that view so session restrictions and
        // preset-scoped definitions apply to both resolve and execution.
        const definition = ctx.tools.get(capability.name, exec.agent)
        if (definition === undefined) {
          throw new Error(`meta_invoke: tool "${capability.name}" is not available`)
```

</details>

**依据 2 · 源码核查**：[src/invoke.ts:243-250](https://github.com/PKUfudawei/dsh-capability-menu/blob/7343fbbffde6d0d69ea242245244784786fb6856/src/invoke.ts#L243-L250)

取消和 lineage 可验

```text
        const result = await ctx.tools.execute({
          callId: ToolCallId(`${exec.callId}:meta:${id}`),
          name: capability.name,
          arguments: forwarded,
          signal: exec.signal,
          parent: exec.token,
          agent: exec.agent,
        })
```

#### 缺口

- 未完成宿主运行。
  **影响**：成功率应与 token 同测。
  **进一步探讨**：保留精确调用和用量。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
