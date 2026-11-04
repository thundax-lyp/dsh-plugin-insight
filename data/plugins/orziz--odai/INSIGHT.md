# Odai

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ce7a999](https://github.com/orziz/odai/tree/ce7a999843ca42ecd84778561cb0ac7642c5648e)

<!-- BEGIN META -->
[![GitHub ★ 119](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=119&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/orziz/odai)
<!-- END META -->

> **功能**：提供代理任务治理技能、可选职责路由及独立命令行运行时。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目将治理规则与可执行工具门禁、可选路由组织在同一工程；效果仍取决于宿主和实际任务。

> **主要限制**：[Q03](#research-q03) 的安装会修改宿主配置，传递只读参数不证明外部 CLI 已实际隔离；[Q02](#research-q02) 的默认 skipped 命令不能冒充执行。

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
  - [Q01 · 谁使用这个仓库，它与普通代理指南有什么区别？](#detail-section-11)
  - [Q02 · 独立 CLI 如何把模型意图变成工具操作？](#detail-section-12)
  - [Q03 · 可选路由安装和子进程边界如何处理？](#detail-section-13)
  - [Q04 · 依赖、成本和试用条件是什么？](#detail-section-14)
  - [Q05 · 什么改进可以验证或否定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望代理依据明确目标、授权和证据完成开发任务的人，可以评估其治理技能和独立工具运行时。

普通代理规则文件和宿主工具也能组织任务；本项目组合治理文档、门禁和跨宿主职责路由。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 治理技能 | 给代理提供目标与证据规则 | 是否遵循依赖宿主与模型 |
| 独立 CLI | 运行 provider 与工具门禁 | 受实际配置及授权约束 |
| 职责路由安装 | 管理宿主角色配置 | 持久写配置，需明确授权 |
| 本地 CLI 委派 | 调用部分受限子角色 | 外部 CLI 的实际隔离未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容技能宿主 | 使用治理技能需要 | 读取和应用规则 | 规则遵循未实测 |
| Node >=20 | 独立 CLI 声明需要 | 运行命令和门禁 | 平台兼容未知 |
| 模型或外部 CLI | 对应路由需要 | 执行代理职责 | 缺失时不能声称委派成功 |
| 用户授权和可写配置 | 安装路由需要 | 管理宿主角色配置 | 不满足时安装器拒绝或失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选定技能或 CLI，并备份隔离配置 | 宿主与授权明确 |
| 核查 | 用户先运行只读任务 | 检查实际调用和门禁结果 |
| 配置 | 用户明确授权后考虑可选路由 | 安装器检查受管状态并留清单 |
| 验收 | 用户核对宿主权限、任务产物和回滚 | 状态不明时停止持久修改 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与模型费用未知 | 选择组件、备份与配置 | 根与子包职责不同 |
| 持续 | 模型、CLI 与计算费用未知 | 审查授权、实际结果 | 跨宿主效果未知 |
| 失败恢复 | 配置快照和重试成本未知 | 核查文件并恢复 | 安装回滚未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 治理提示 | 技能明确目标、证据和授权规则 | 模型是否遵守及效果 |
| CLI 工具门禁 | dispatcher 顺序判断并记录拒绝 | 全宿主和外部操作的隔离 |
| 可选路由 | 安装器快照和记录受管配置 | 真实宿主恢复及路由成功 |

> **思考**：[Q03](#research-q03) 的安装会修改宿主配置，传递只读参数不证明外部 CLI 已实际隔离；[Q02](#research-q02) 的默认 skipped 命令不能冒充执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目将治理规则与可执行工具门禁、可选路由组织在同一工程；效果仍取决于宿主和实际任务。

[Q02](#research-q02) 区分未执行与工具结果，[Q03](#research-q03) 的受管清单、快照和错误恢复可复核；外部宿主行为仍需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的安装会修改宿主配置，传递只读参数不证明外部 CLI 已实际隔离；[Q02](#research-q02) 的默认 skipped 命令不能冒充执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在隔离项目以只读任务核实；宿主权限或配置恢复不明时暂停路由安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向检查固定源码的规则、独立 CLI 和路由安装；真实宿主、模型与效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、skills/odai/SKILL.md、cli/package.json、cli/bin/odai.mjs、cli/src/runtime/agent-loop.mjs、cli/src/runtime/tool-dispatcher.mjs、cli/src/runtime/gates/authorization.mjs、skills/odai-orchestration/scripts/install-routing.mjs、skills/odai-orchestration/scripts/local-cli.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仓库根含多项技能、独立 CLI 与独立 DSH 子包；本次定向检查治理技能、CLI 模型意图分发和可选路由安装，不代替独立子包研究。未运行目标、宿主、模型或测试，未审全部门禁和卸载分支。
- 下一步：在隔离宿主目录固定模型与版本，检查工具门禁、只读子进程、配置冲突、中断回滚及最终产物。

**分析版本**

- **仓库**：[orziz/odai](https://github.com/orziz/odai)
- **版本号**：未声明（[固定提交 ce7a999](https://github.com/orziz/odai/tree/ce7a999843ca42ecd84778561cb0ac7642c5648e)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出跨宿主能力及实际执行凭据的未验证方案；若状态不可核实或负担过高则否定。

在隔离宿主目录固定模型与版本，检查工具门禁、只读子进程、配置冲突、中断回滚及最终产物。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 51 | 6365 | — | — | 187197 |
| .mjs | source | 131 | 34525 | 31878 | 325 | — |
| .mjs | test | 68 | 29684 | 29199 | 154 | — |
| .mts | source | 56 | 16219 | 15087 | 114 | — |
| .mjs | example | 2 | 172 | 162 | 7 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/orziz/odai/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查治理工程的技能、独立 CLI 工具门禁及可选路由安装边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用这个仓库，它与普通代理指南有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望代理在目标、授权与验证之间保持一致的开发者，可以使用治理技能及可选的职责路由；项目还包含独立 CLI 和 DSH 集成。普通代理规则文件也能描述部分原则，本仓库将指导文档、可选路由安装器和独立 CLI 的工具门禁组织起来。根目录是多组件工程，根 package 标记 private，不应将其等同于单一 DSH 插件；DSH 子包有独立身份和边界，本次不借其存在宣称根项目已安装或运行。效果、效率和跨宿主一致性尚无本轮对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-24](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/README.md#L9-L24)

作者描述治理目标。

<details>
<summary>查看原文（16行）</summary>

```text
  <img src="assets/odai-readme-badge.png" alt="Dai, the odai mascot" width="720">
</p>

`odai` is a governance-powered general task-execution framework for AI agents.

It embeds governance into execution: align the real objective, facts, assumptions, authorization, risks, and acceptance; then choose the shortest sufficient path, combine the right capabilities, act, verify, and keep moving until the task is genuinely deliverable. It does not replace the model's judgment with a rigid workflow.

The short version: call `/odai`; governance stays nearly invisible on simple work, while ambiguity, complexity, risk, and domain needs automatically increase or reduce the depth of handling.

## Why Use It

`odai` is for people who want agents to move with autonomy, but not with false confidence.

It helps an agent:

- ask only when the missing answer would change the goal, scope, authorization, acceptance, risk, or stop line
```

</details>

**依据 2 · 作者声明**：[skills/odai/SKILL.md:12-25](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai/SKILL.md#L12-L25)

技能中的目标和证据规则。

<details>
<summary>查看原文（14行）</summary>

```text
## 事：用户要得到什么

- 用户定义目标、价值取舍和不可接受结果。要求以用户原文及有效决定为准，后续决定只取代冲突部分；计划、摘要、任务清单和模型自报都不能取代用户目标或产生授权，取代关系不明时保留未判定。
- 按当前请求与有效授权区分探索、决定与实施，不要求固定措辞。评估、分析与比较交付判断，不写入；已授权实施就做完，解释、计划、道歉或改判都不能代替实施。状态询问或纠正只重对齐受影响部分；明确叫停就停，不借旧目标继续。
- 结果或范围有多种会实质改变交付的理解时，先呈现这些分歧及后果，对齐真实结果、非目标与不可接受的退化；低成本、可撤回或已有实施授权都不能代替这一步。多种合理实现不等于目标不清，受托的普通细节自主决定，不追加确认。
- 用户要探索时给出实质有别的候选及依据，标明待验证假设，不强行定案，也不要求用户先给实现方案。
- 需要用户信息、价值取舍或授权时及时沟通，带上已有事实、建议与影响。交流看能否推动理解和结果，不以少提问或多确认论优劣。

## 实：什么是真的

- 判断和行动以可核查事实为依据，区分事实、推断、假设和预期效果；经验、直觉与自报不能替代证据。结论只到证据支持的范围，未知如实保留，有据敢言，证据变化就改判。兼听时辨明同源与共同前提，不以声望、评分或票数代替证据。
- 用户给出的根因、数值、手段和举例是待核实的输入和理解问题的线索，不自动成为全部范围；被事实推翻时继续承接原目标，只保留已证必要的做法。
- 高影响决定需要相称的事实、保护与退路：证据不足时不实施原值，也不另拍替代值；用户确认只补授权、不补事实。
- 判断当前行为时，以实际代码、配置和运行结果校正文档、注释、记忆或旧结论；接口路径、字段、状态码等从实际代码或响应取得，不按相似项推测。发现差异须结合有效要求与使用场景判断是说明过时还是实现有误，不把现状自动当作正确标准，也不因旧文档不同就否定可核实的实际行为。
```

</details>

**依据 3 · 源码核查**：[package.json:1-8](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/package.json#L1-L8)

根工程为 private workspace。

```text
{
  "name": "odai-workspace",
  "private": true,
  "type": "module",
  "imports": {
    "#odai-contracts": "./skills/odai-orchestration/scripts/compose-contracts.mjs",
    "#odai-local-cli": "./skills/odai-orchestration/scripts/local-cli.mjs",
    "#odai-recognize-routing": "./skills/odai-orchestration/scripts/recognize-routing.mjs"
```

**依据 4 · 源码核查**：[cli/package.json:1-9](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/package.json#L1-L9)

独立 CLI 子包身份。

```text
{
  "name": "odai-cli",
  "version": "0.0.2",
  "description": "Provider-neutral odai CLI agent runtime.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/orziz/odai.git",
    "directory": "cli"
```

#### 缺口

- 未对照真实任务或宿主
  **影响**：不能量化错误率、效率或用户收益
  **进一步探讨**：固定同一任务与宿主比较普通指南和本项目的真实交付。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立 CLI 如何把模型意图变成工具操作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 子包的命令入口调用 main；代理循环将任务、历史工具结果交给 provider，随后把模型提供的工具意图交给 dispatcher。dispatcher 依次执行子代理边界、策略、停止、授权、感知和证据门禁，任何拒绝会记录并返回；通过后才执行。默认构造器关闭 shell 和网络，关闭 shell 时返回 skipped 并记录意图，不等于命令已执行。开放 shell 后还通过计划器、参数数组和超时执行。实际运行时可传不同配置，默认值或静态门禁存在不证明所有宿主、provider 和外部路径拥有相同隔离。

#### 证据与依据

**依据 1 · 源码核查**：[cli/package.json:15-27](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/package.json#L15-L27)

CLI 包导出与命令入口。

<details>
<summary>查看原文（13行）</summary>

```text
  "type": "module",
  "main": "./src/api.mjs",
  "exports": {
    ".": "./src/api.mjs",
    "./cli": "./src/index.mjs",
    "./interactive": "./src/core/interactive-session.mjs",
    "./i18n": "./src/runtime/i18n.mjs",
    "./model-options": "./src/runtime/model-options.mjs",
    "./update-check": "./src/runtime/update-check.mjs",
    "./package.json": "./package.json"
  },
  "bin": {
    "odai": "bin/odai.mjs"
```

</details>

**依据 2 · 源码核查**：[cli/bin/odai.mjs:1-7](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/bin/odai.mjs#L1-L7)

命令入口调用 main。

```text
#!/usr/bin/env node

import { main } from "../src/index.mjs";

main(process.argv.slice(2)).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
```

**依据 3 · 源码核查**：[cli/src/runtime/agent-loop.mjs:17-27](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/agent-loop.mjs#L17-L27)

独立代理循环输入。

<details>
<summary>查看原文（11行）</summary>

```text
export async function runAgentLoop({
  provider,
  task,
  input = {},
  dispatcher,
  evidence,
  actor = { kind: "main", id: "main" },
  maxTurns = 4,
  onEvent,
  usageLedger,
} = {}) {
```

</details>

**依据 4 · 源码核查**：[cli/src/runtime/agent-loop.mjs:44-75](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/agent-loop.mjs#L44-L75)

请求 provider 并提供先前工具结果。

<details>
<summary>查看原文（32行）</summary>

```text
  const providerInputBase = prepareProviderInput({
    input,
    provider,
    workspaceRoot: dispatcher?.workspaceRoot,
  });

  for (let turn = 1; turn <= maxTurns; turn += 1) {
    const providerInput = {
      ...providerInputBase,
      task,
      mode: "agent_loop",
      turn,
      previousToolResults: sanitizeProviderRuntimeValue(toolResults, {
        workspaceRoot: dispatcher?.workspaceRoot,
      }),
    };
    onEvent?.({
      type: "agent-turn-start",
      agent,
      turn,
      provider: provider.name,
      estimatedInputTokens: estimateTokensFromValue(providerInput),
    });
    const profile = {
      name: "main",
      tools: "tool_intents",
    };
    const runProvider = () =>
      provider.run({
        agent,
        profile,
        input: providerInput,
```

</details>

**依据 5 · 源码核查**：[cli/src/runtime/agent-loop.mjs:200-206](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/agent-loop.mjs#L200-L206)

模型工具意图送入分发。

```text
    const toolIntentDispatch = await dispatchModelToolIntents({
      output: {
        ...output,
        toolIntents: prepared.toolIntents,
      },
      dispatcher,
      actor,
```

**依据 6 · 源码核查**：[cli/src/runtime/tool-dispatcher.mjs:16-35](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/tool-dispatcher.mjs#L16-L35)

默认 shell 与网络关闭。

<details>
<summary>查看原文（20行）</summary>

```text
export class ToolDispatcher {
  constructor({
    workspaceRoot,
    sessionTmp,
    evidence,
    session,
    allowShellExecution = false,
    allowedShellCommands = [],
    shellTimeoutMs = 30000,
    maxOutputChars = 20000,
    checkpointDir,
    shellSandbox = { mode: "none" },
    shellSandboxPlatform,
    shellSandboxCommandExists,
    shellSandboxProbe,
    runShellCommand = defaultRunShellCommand,
    allowNetworkRequests = false,
    networkPolicy = { allowRequests: false, allowedHosts: [], timeoutMs: 10000 },
    fetchImpl = globalThis.fetch,
  }) {
```

</details>

**依据 7 · 源码核查**：[cli/src/runtime/tool-dispatcher.mjs:75-99](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/tool-dispatcher.mjs#L75-L99)

按顺序经过门禁再执行。

<details>
<summary>查看原文（25行）</summary>

```text
    const normalized = normalizeIntent(intent, context);

    for (const gate of [
      subagentBoundaryGate,
      policyGate,
      stopGate,
      authorizationGate,
      perceptionGate,
      evidenceGate,
    ]) {
      const decision = gate(normalized, context);
      if (!decision.allow) {
        const denial = {
          ok: false,
          gate: decision.gate,
          reason: redactString(decision.reason),
          intent: publicIntent(normalized),
        };
        this.evidence.recordDenial(denial);
        this.session.recordFailure(failureKey(normalized));
        return denial;
      }
    }

    return execute(normalized, context);
```

</details>

**依据 8 · 源码核查**：[cli/src/runtime/tool-dispatcher.mjs:183-200](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/tool-dispatcher.mjs#L183-L200)

shell 关闭返回 skipped。

<details>
<summary>查看原文（18行）</summary>

```text
  if (intent.type === "shell") {
    if (!context.allowShellExecution) {
      context.evidence.recordCommand(intent.command, intent.actor);
      return {
        ok: true,
        type: "shell",
        command: redactCommand(intent.command),
        skipped: true,
        reason: "Shell execution is disabled; intent was recorded only.",
      };
    }

    if (!Array.isArray(intent.command) || intent.command.length === 0) {
      return {
        ok: false,
        gate: "policy",
        reason: "Executable shell intents must use an argv array.",
      };
```

</details>

#### 缺口

- 未运行 CLI、模型和宿主
  **影响**：无法确认实际任务链及各 provider 的真实执行
  **进一步探讨**：在隔离仓库验证关闭和授权后的工具、拒绝及结果回流。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可选路由安装和子进程边界如何处理？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

职责路由安装器只接受指定宿主和作用域，要求显式 --yes，并在写入前检查现有受管状态、为涉及文件建立快照；写入和清单保存后复核，异常时尝试恢复快照。该操作会持久改变宿主配置，不是只读技能文本。可选的本地 CLI 适配器为部分子角色设置只读工具或沙箱参数，以无 shell 的子进程启动并处理超时与输出限制；这些参数实际约束取决于外部 CLI 与平台实现，不能因传入 read-only 就证明端到端隔离。技能原则本身也依赖模型和宿主遵循。

#### 证据与依据

**依据 1 · 源码核查**：[skills/odai-orchestration/scripts/install-routing.mjs:43-62](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/install-routing.mjs#L43-L62)

宿主/范围验证、显式 yes 和状态检查。

<details>
<summary>查看原文（20行）</summary>

```text
if (args.help) { printHelp(); process.exit(0); }
if (!new Set(["codex", "claude", "copilot"]).has(args.host)) fail(`不支持的 host：${args.host || "(missing)"}`);
if ((args.namedDispatch || args.leadMode) && !["claude", "codex"].includes(args.host)) fail("--named-dispatch / --lead-mode requires claude or codex");
if (!new Set(["project", "user"]).has(args.scope)) fail(`不支持的 scope：${args.scope}`);
for (const role of configurableRoles) {
  if (!args[`${role}Cli`]) continue;
  if (!["claude", "codex"].includes(args.host)) fail(`--${role}-cli requires claude or codex`);
  if (!(args.host === "codex" ? ["claude", "antigravity", "grok"] : ["codex", "antigravity", "grok"]).includes(args[`${role}Cli`])) fail(`--${role}-cli must be ${args.host === "codex" ? "claude" : "codex"}, antigravity, or grok`);
  if (!args[`${role}Model`]) fail(`--${role}-cli 需要同时提供 --${role}-model`);
}
if (!args.yes) fail("安装、更新或卸载会持久化宿主配置；取得用户授权后传入 --yes");

const targetRoot = resolveTarget(args.host, args.scope, args.target);
const configRoot = resolveConfigRoot(args.host, args.scope, targetRoot);
const layout = hostLayout(args.host, args.scope);
layout.retiredFiles = retiredByHost[args.host];
const manifestPath = path.join(configRoot, manifestName);
const previous = loadManifest(manifestPath);
assertSafeDestination(configRoot, layout, Object.keys(previous?.files || {}));
assertManagedState(configRoot, layout, previous);
```

</details>

**依据 2 · 源码核查**：[skills/odai-orchestration/scripts/install-routing.mjs:81-125](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/install-routing.mjs#L81-L125)

快照、写入、清单与异常恢复。

<details>
<summary>查看原文（45行）</summary>

```text
  const generatedRoot = mkdtempSync(path.join(tmpdir(), `odai-${args.host}-routing-install-`));
  const snapshots = new Map();
  const newDirectories = [];
  try {
    const generated = buildAdapter(generatedRoot, configRoot);
    const files = collectGeneratedFiles(generatedRoot, layout);
    const originalFiles = prepareOriginalFiles(configRoot, previous, files);
    const settings = planSettings(configRoot, layout, previous);
    for (const relative of directoryAncestors([...files.keys(), manifestName, ...(settings ? [settings.file] : [])])) {
      if (!existsSync(path.join(configRoot, relative))) newDirectories.push(relative);
    }
    const candidates = new Set([...layout.managedFiles, ...layout.retiredFiles, ...Object.keys(previous?.files || {}), manifestName]);
    for (const relative of candidates) snapshot(configRoot, relative, snapshots);
    if (settings) snapshot(configRoot, settings.file, snapshots);
    for (const [relative, content] of files) atomicWrite(path.join(configRoot, relative), content);
    if (settings) atomicWrite(path.join(configRoot, settings.file), Buffer.from(`${JSON.stringify(settings.value, null, 2)}\n`));
    removeObsolete(configRoot, previous, files);
    const manifest = {
      version: 13,
      id: "odai-routing-installation",
      host: args.host,
      scope: args.scope,
      target: targetRoot,
      installedAt: new Date().toISOString(),
      generatedFrom: "skills/odai-orchestration/scripts/install-routing.mjs",
      governance: generated.governance,
      orchestration: generated.orchestration,
      mapping: generated.mapping,
      routingPolicy: generated.routing_policy,
      activation: generated.activation,
      files: Object.fromEntries([...files].map(([relative, content]) => [relative, sha256(content)])),
      originalFiles,
      createdDirectories: [...new Set([...(previous?.createdDirectories || []), ...newDirectories])],
      settings: settings?.manifest || null,
    };
    atomicWrite(manifestPath, Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));
    assertManagedState(configRoot, layout, manifest);
    return {
      status: previous ? "updated" : "installed", host: args.host, scope: args.scope,
      target: targetRoot, configRoot, mapping: generated.mapping, routingPolicy: generated.routing_policy,
      activation: generated.activation, requiresNewSession: true,
    };
  } catch (error) {
    restore(configRoot, snapshots);
    removeCreatedDirectories(configRoot, newDirectories);
```

</details>

**依据 3 · 源码核查**：[skills/odai-orchestration/scripts/local-cli.mjs:50-67](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/local-cli.mjs#L50-L67)

Claude 和 Codex 的受限参数。

<details>
<summary>查看原文（18行）</summary>

```text
const ADAPTERS = Object.freeze({
  claude: {
    continuation: true,
    effort: /^(low|medium|high|xhigh|max)$/,
    command: "claude", override: "ODAI_CLAUDE_COMMAND", input: "stdin",
    args: (route, { sessionId, resumeSessionId }) => ["-p", "--output-format", "json", "--model", route.model, ...effortArgs(route),
      "--tools", "Read,Glob,Grep", "--permission-mode", "dontAsk", ...(route.session === "continue"
        ? [resumeSessionId ? "--resume" : "--session-id", resumeSessionId || sessionId]
        : ["--no-session-persistence"])],
    parse: (stdout, route) => parseClaudeResult(stdout, route.model),
  },
  codex: {
    continuation: false,
    effort: /^[a-z]+$/,
    command: "codex", override: "ODAI_CODEX_COMMAND", input: "stdin",
    args: (route, { cwd }) => ["exec", "--json", "--model", route.model,
      ...(route.reasoningEffort ? ["-c", `model_reasoning_effort=${JSON.stringify(route.reasoningEffort)}`] : []),
      "-c", "features.multi_agent=false", "--sandbox", "read-only", "--skip-git-repo-check", "-C", cwd, "-"],
```

</details>

**依据 4 · 源码核查**：[skills/odai-orchestration/scripts/local-cli.mjs:301-330](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/local-cli.mjs#L301-L330)

子进程输入和私有临时文件。

<details>
<summary>查看原文（30行）</summary>

```text
/** Executes only the target CLI. Host routing and fallback policy belong to callers. */
export async function executeLocalCli({
  route, prompt, cwd, signal, resumeSessionId, env = process.env, spawnProcess = spawn, killProcess,
  killGraceMs = 1000, maxOutputBytes = MAX_OUTPUT_BYTES,
}) {
  const normalized = validateLocalCliRoute(route);
  const sessionId = normalized.session === "continue" && normalized.cli === "claude" ? resumeSessionId || randomUUID() : undefined;
  if (typeof prompt !== "string") throw new TypeError("local-cli prompt must be a string");
  if (typeof cwd !== "string" || !cwd) throw new TypeError("local-cli cwd must be a non-empty string");
  if (!Number.isSafeInteger(killGraceMs) || killGraceMs < 0) throw new TypeError("killGraceMs must be a non-negative safe integer");
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes <= 0) throw new TypeError("maxOutputBytes must be a positive safe integer");
  if (killProcess !== undefined && typeof killProcess !== "function") throw new TypeError("killProcess must be a function");
  // An injected fake spawn must never cause OS signals to be sent to an invented PID.
  // Inject killProcess as well to exercise process-group behavior with a fake executor.
  const processGroup = process.platform !== "win32" && (spawnProcess === spawn || killProcess !== undefined);
  const signalProcess = killProcess ?? process.kill;
  const started = Date.now();
  let exitCode = null;
  const timedResult = (result) => ({ ...result, exitCode, durationMs: Date.now() - started });
  if (signal?.aborted) return timedResult(emptyResult("cancelled", "Local CLI execution cancelled"));
  const adapter = ADAPTERS[normalized.cli];
  const timeoutSeconds = normalized.timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS;
  let temporary;
  try {
    let promptFile;
    if (adapter.input === "file") {
      temporary = mkdtempSync(join(tmpdir(), "odai-local-cli-"));
      chmodSync(temporary, 0o700);
      promptFile = join(temporary, "prompt.txt");
      writeFileSync(promptFile, prompt, { encoding: "utf8", mode: 0o600, flag: "wx" });
```

</details>

**依据 5 · 源码核查**：[skills/odai-orchestration/scripts/local-cli.mjs:365-390](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/local-cli.mjs#L365-L390)

无 shell 启动及输出约束。

<details>
<summary>查看原文（26行）</summary>

```text
        if (!settled) killTimer = setTimeout(() => {
          kill("SIGKILL");
          groupKillSent = true;
          if (closed) finish(stopResult);
        }, killGraceMs);
      };
      const onAbort = () => stop("cancelled", "Local CLI execution cancelled");
      try {
        child = spawnProcess(invocation.command, invocation.args, {
          cwd, env, shell: false, windowsHide: true, detached: processGroup, stdio: ["pipe", "pipe", "pipe"],
        });
      } catch (error) {
        finish(emptyResult("error", `Could not start ${normalized.cli}: ${error?.message || String(error)}`));
        return;
      }
      child.on("error", (error) => {
        if (!child.pid) finish(stopResult || emptyResult("error", `Could not start ${normalized.cli}: ${error.message}`));
        else stop("error", `${normalized.cli} process error: ${error.message}`);
      });
      child.stdout.on("data", (chunk) => {
        if (settled || stopResult) return;
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        stdoutBytes += bytes.length;
        if (stdoutBytes > maxOutputBytes) {
          stdout.length = 0;
          stop("error", `${normalized.cli} stdout exceeded the ${maxOutputBytes} byte output limit`);
```

</details>

#### 缺口

- 未运行安装、外部 CLI 或中断恢复
  **影响**：不能证明平台约束、文件恢复和模型路由实际生效
  **进一步探讨**：在隔离配置目录测试冲突、中断、卸载及子进程真实权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本和试用条件是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

使用技能依赖宿主加载和模型遵循，独立 CLI 声明 Node 20 以上；调用外部模型或子 CLI 还需各自环境与授权。首次需选择实际组件、检查宿主配置和工作区范围，持续可能产生模型调用、子进程与人工验收成本，失败恢复需核对配置快照及实际文件；具体费用和时间未知。先在隔离项目以只读任务核对规则和工具边界，再决定是否配置路由；目标宿主权限、授权或回滚状态不明时停止持久配置并手工恢复核查。

#### 证据与依据

**依据 1 · 源码核查**：[cli/package.json:1-5](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/package.json#L1-L5)

CLI 包和许可。

```text
{
  "name": "odai-cli",
  "version": "0.0.2",
  "description": "Provider-neutral odai CLI agent runtime.",
  "license": "MIT",
```

**依据 2 · 源码核查**：[cli/package.json:60-65](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/package.json#L60-L65)

声明 Node 引擎。

```text
    "orchestration"
  ],
  "engines": {
    "node": ">=20"
  }
}
```

**依据 3 · 源码核查**：[cli/src/runtime/tool-dispatcher.mjs:16-35](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/cli/src/runtime/tool-dispatcher.mjs#L16-L35)

命令和网络默认控制。

<details>
<summary>查看原文（20行）</summary>

```text
export class ToolDispatcher {
  constructor({
    workspaceRoot,
    sessionTmp,
    evidence,
    session,
    allowShellExecution = false,
    allowedShellCommands = [],
    shellTimeoutMs = 30000,
    maxOutputChars = 20000,
    checkpointDir,
    shellSandbox = { mode: "none" },
    shellSandboxPlatform,
    shellSandboxCommandExists,
    shellSandboxProbe,
    runShellCommand = defaultRunShellCommand,
    allowNetworkRequests = false,
    networkPolicy = { allowRequests: false, allowedHosts: [], timeoutMs: 10000 },
    fetchImpl = globalThis.fetch,
  }) {
```

</details>

**依据 4 · 源码核查**：[skills/odai-orchestration/scripts/install-routing.mjs:53-62](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/install-routing.mjs#L53-L62)

配置写入前授权参数及状态检查。

<details>
<summary>查看原文（10行）</summary>

```text
if (!args.yes) fail("安装、更新或卸载会持久化宿主配置；取得用户授权后传入 --yes");

const targetRoot = resolveTarget(args.host, args.scope, args.target);
const configRoot = resolveConfigRoot(args.host, args.scope, targetRoot);
const layout = hostLayout(args.host, args.scope);
layout.retiredFiles = retiredByHost[args.host];
const manifestPath = path.join(configRoot, manifestName);
const previous = loadManifest(manifestPath);
assertSafeDestination(configRoot, layout, Object.keys(previous?.files || {}));
assertManagedState(configRoot, layout, previous);
```

</details>

#### 缺口

- 未验证宿主兼容、模型费用与恢复
  **影响**：无法预测总成本或实际安全效果
  **进一步探讨**：固定宿主和模型做隔离回放，记录权限、成本和配置前后差异。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进可以验证或否定？

**研究主题**：新假设与验证

#### 完整回答

可探索为跨宿主委派增加可校验的能力与运行结果凭据，区分请求了什么、宿主实际允许什么和任务中是否真正执行。现有本地 CLI 适配器已传受限参数并解析结果，安装器也有清单与回滚；新增的是跨宿主能力和实际执行的统一证明，不能把现有参数当作证明。以实际只读和被拒操作为样本，对照误判路由、未经核实的声称及审查成本；若无法读取可信状态或负担大于收益，则否定。当前没有实现或验证。

#### 证据与依据

**依据 1 · 源码核查**：[skills/odai-orchestration/scripts/local-cli.mjs:50-67](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/local-cli.mjs#L50-L67)

已有部分宿主限制参数。

<details>
<summary>查看原文（18行）</summary>

```text
const ADAPTERS = Object.freeze({
  claude: {
    continuation: true,
    effort: /^(low|medium|high|xhigh|max)$/,
    command: "claude", override: "ODAI_CLAUDE_COMMAND", input: "stdin",
    args: (route, { sessionId, resumeSessionId }) => ["-p", "--output-format", "json", "--model", route.model, ...effortArgs(route),
      "--tools", "Read,Glob,Grep", "--permission-mode", "dontAsk", ...(route.session === "continue"
        ? [resumeSessionId ? "--resume" : "--session-id", resumeSessionId || sessionId]
        : ["--no-session-persistence"])],
    parse: (stdout, route) => parseClaudeResult(stdout, route.model),
  },
  codex: {
    continuation: false,
    effort: /^[a-z]+$/,
    command: "codex", override: "ODAI_CODEX_COMMAND", input: "stdin",
    args: (route, { cwd }) => ["exec", "--json", "--model", route.model,
      ...(route.reasoningEffort ? ["-c", `model_reasoning_effort=${JSON.stringify(route.reasoningEffort)}`] : []),
      "-c", "features.multi_agent=false", "--sandbox", "read-only", "--skip-git-repo-check", "-C", cwd, "-"],
```

</details>

**依据 2 · 源码核查**：[skills/odai-orchestration/scripts/install-routing.mjs:92-117](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/skills/odai-orchestration/scripts/install-routing.mjs#L92-L117)

已有配置清单和回读。

<details>
<summary>查看原文（26行）</summary>

```text
    const candidates = new Set([...layout.managedFiles, ...layout.retiredFiles, ...Object.keys(previous?.files || {}), manifestName]);
    for (const relative of candidates) snapshot(configRoot, relative, snapshots);
    if (settings) snapshot(configRoot, settings.file, snapshots);
    for (const [relative, content] of files) atomicWrite(path.join(configRoot, relative), content);
    if (settings) atomicWrite(path.join(configRoot, settings.file), Buffer.from(`${JSON.stringify(settings.value, null, 2)}\n`));
    removeObsolete(configRoot, previous, files);
    const manifest = {
      version: 13,
      id: "odai-routing-installation",
      host: args.host,
      scope: args.scope,
      target: targetRoot,
      installedAt: new Date().toISOString(),
      generatedFrom: "skills/odai-orchestration/scripts/install-routing.mjs",
      governance: generated.governance,
      orchestration: generated.orchestration,
      mapping: generated.mapping,
      routingPolicy: generated.routing_policy,
      activation: generated.activation,
      files: Object.fromEntries([...files].map(([relative, content]) => [relative, sha256(content)])),
      originalFiles,
      createdDirectories: [...new Set([...(previous?.createdDirectories || []), ...newDirectories])],
      settings: settings?.manifest || null,
    };
    atomicWrite(manifestPath, Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));
    assertManagedState(configRoot, layout, manifest);
```

</details>

#### 缺口

- 跨宿主证明方案未实现
  **影响**：不能断言能减少误判或适用于全部宿主
  **进一步探讨**：先确认各宿主提供可验证状态，再对照隔离任务和审查成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
