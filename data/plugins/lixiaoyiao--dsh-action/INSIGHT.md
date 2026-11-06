# DSH-action

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[497af93](https://github.com/Lixiaoyiao/DSH-action/tree/497af93119203ca22af4f96f8fe89b3345ad665c)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Lixiaoyiao/DSH-action)
<!-- END META -->

> **功能**：在GitHub Actions运行DeepSeek Harness，处理评审、诊断、代码任务与自动化。

> **亮点**：[Q01](#research-q01)至[Q03](#research-q03)支持将DSH真实工具循环与GitHub可信Controller、验证及单写后置核对组合；增量是运行/发布责任衔接，非仅新增评论入口。已有Action与事务模式构成基线，未独立证明人审或成本收益。

> **主要限制**：[Q03](#research-q03)、[Q04](#research-q04)表明Controller的验证/延迟写入保证不能覆盖自带凭证MCP，worker网络/RW是共享能力；失败也可能已有分支或possible/confirmed外部效果。必须按实际执行方核对，不能只看回复或Actions颜色。

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
  - [Q01 · 它如何改变GitHub维护者处理任务的方式？](#detail-section-11)
  - [Q02 · 模型、工具反馈与凭证代理是否形成真正执行闭环？](#detail-section-12)
  - [Q03 · 代码与GitHub写入何时生效，失败会否被误判为成功？](#detail-section-13)
  - [Q04 · 原生生态与Session恢复能继承哪些权限？](#detail-section-14)
  - [Q05 · 什么人值得试用，配置和恢复由谁承担？](#detail-section-15)
  - [Q06 · 哪些已有设计值得迁移，如何提出可证伪的新方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH-action交付GitHub Action，适合已有GitHub仓库、愿意维护可信工作流和验证命令的维护者，让评论或定时/手动任务调用DeepSeek Harness，输出评审、诊断、答案或受控代码交付。它不是安装到DSH桌面设置页的原生插件。合格结果是依据绑定源码提供可回查回答，写任务还需验证通过、明确分支/PR或未决副作用；一条机器人回复不代表代码交付完成。

本地Agent+人工搬运上下文、固定CI脚本，以及README承认的既有编码Action模式；DSH模型与生态机制来自上游，本次不宣称全球首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| GitHub任务Agent | 评审/诊断/代码与通用任务 | Action而非桌面原生插件，真实结果需回查 |
| 工具反馈/修正 | 结果驱动继续执行 | 轮次截止与无进展停止，不保证成功 |
| Controller写入 | 验证及重核后发布 | 部分/未知效果保留receipt，非整组原子 |
| native生态 | 官方Profile和动态工具 | 实验、Docker、共享worker能力，外部MCP不继承Gateway |
| Session | 有来源的对话状态恢复 | 默认off，不能恢复授权，归档链路未全审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| GitHub可信工作流/runner | 必需 | 事件、checkout与Controller | 不应从不受信代码授予secret |
| DeepSeek端点与key | 必需 | 模型经临时token代理 | 无法推理；仍有调用和数据外发 |
| Node>=24、固定DSH rc.2 | 必需 | Action/运行时 | 升级兼容须维护 |
| Docker与网络策略 | 写入/native/Session要求 | worker和验证边界 | 不能用host替代同等保证 |
| 固定验证命令 | 写入必需 | 当前工作区验收 | 通过不等完整业务正确 |
| 第三方MCP/插件 | 可选 | 扩展任务 | 信任代码及其外部凭证，非逐扩展沙箱 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定Action、配置可信checkout/secret/runner | 只读与无扩展起步，核出网 |
| 执行 | 评论/调度触发Agent，工具结果继续 | 回查任务绑定和实际工具结果 |
| 验证发布 | Controller验证及重核后写 | 核真实ref/PR与receipt，不信自述 |
| 中断退出 | 维护者核外部效果、禁用触发并撤凭证 | 已发布内容需单独处理，Session另核留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | runner/镜像/模型资源金额未知 | 可信工作流、secret、网络和验证设计 | 无当前价目或基准费用 |
| 持续 | token、计算、artifact与工具资源未知 | 人审、固定依赖升级和误报复核 | 未证明比本地Agent便宜 |
| 失败恢复 | 重跑、对账和验证资源未知 | 检查possible/confirmed、目标变化及Session | 失败不一定无外部效果 |
| 退出 | 留存清理与遗留资源未知 | 关触发/撤secret，处理评论分支PR | 不自动撤销已发布动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自主任务 | 真实tool结果反馈、验证修正循环 | 正确选择工具和成功率 |
| Controller发布 | 验证、当前权限、单写后置核对 | 故障竞态及全验证器完整性 |
| Session | 来源绑定与Controller导入接线 | 真实归档选择/兼容/敏感信息留存 |
| 维护价值 | 责任分工和可回查状态 | 时间、费用和返工改善 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)表明Controller的验证/延迟写入保证不能覆盖自带凭证MCP，worker网络/RW是共享能力；失败也可能已有分支或possible/confirmed外部效果。必须按实际执行方核对，不能只看回复或Actions颜色。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)至[Q03](#research-q03)支持将DSH真实工具循环与GitHub可信Controller、验证及单写后置核对组合；增量是运行/发布责任衔接，非仅新增评论入口。已有Action与事务模式构成基线，未独立证明人审或成本收益。

工具反馈、截止取消、验证错误回流、Controller授权重核与未知效果receipt值得复用；不是全组事务，动态扩展共享worker权能，不能把Controller保障泛化到外部MCP。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)表明Controller的验证/延迟写入保证不能覆盖自带凭证MCP，worker网络/RW是共享能力；失败也可能已有分支或possible/confirmed外部效果。必须按实际执行方核对，不能只看回复或Actions颜色。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有可信CI维护者先用controlled、只读、Session off、无外部扩展和独立runner，设置预算与网络策略。选择重复小型诊断回查依据、工具结果和未决效果，再决定是否继续。未确认效益则禁用工作流；native、Session和写入应分别验收。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持真实自主循环和Controller受控写入设计；未执行Action或独立验收作者案例，native/Session与验证解析器非完整审计。证据交付方向仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、action.yml、package.json、src/agent/loop.ts、src/dsh/docker-policy.ts、src/dsh/engine.ts、src/dsh/proxy.ts、src/dsh/select-composition.ts、src/session/controller.ts、src/tools/github-authority-gateway.ts、src/tools/github-gateway-mutation.ts、src/write/transaction.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读Action配置、上游归属、loop/engine/proxy/Docker、代码写事务、typed Gateway单写对账和Session Controller；未全面审计212源文件、验证命令解析器、artifact归档、扩展启动与打包dist一致性。
- 下一步：未执行目标Action、模型、工具、测试、安装、GitHub写入或故障注入。作者运行链接未独立访问，不当本次同版本验收。

**分析版本**

- **仓库**：[Lixiaoyiao/DSH-action](https://github.com/Lixiaoyiao/DSH-action)
- **版本号**：0.13.0（[固定提交 497af93](https://github.com/Lixiaoyiao/DSH-action/tree/497af93119203ca22af4f96f8fe89b3345ad665c)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的主张→执行方/权限面→验证指纹→效果receipt交付包；用丢响应、MCP外写等对照人审误判和成本，若只增加日志负担就放弃，不计当前贡献。

未执行目标Action、模型、工具、测试、安装、GitHub写入或故障注入。作者运行链接未独立访问，不当本次同版本验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 44 | 8984 | 8534 | 173 | — |
| .md | source | 37 | 15085 | — | — | 125080 |
| .js | source | 1 | 57 | 32 | 26 | — |
| .md | example | 1 | 4 | — | — | 48 |
| .ts | source | 167 | 34156 | 31709 | 766 | — |
| .ts | test | 143 | 47918 | 45417 | 560 | — |
| .mjs | example | 12 | 558 | 520 | 7 | — |
| .ts | example | 1 | 23 | 22 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Lixiaoyiao/DSH-action/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断DSH GitHub任务的自主执行、权限、写入与恢复能否支撑可控试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它如何改变GitHub维护者处理任务的方式？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH-action交付GitHub Action，适合已有GitHub仓库、愿意维护可信工作流和验证命令的维护者，让评论或定时/手动任务调用DeepSeek Harness，输出评审、诊断、答案或受控代码交付。它不是安装到DSH桌面设置页的原生插件。合格结果是依据绑定源码提供可回查回答，写任务还需验证通过、明确分支/PR或未决副作用；一条机器人回复不代表代码交付完成。

相对维护者手动把Issue和CI日志复制到本地Agent，它把触发、工作区、模型工具循环、验证和发布衔接进Actions；相对固定CI脚本，Agent可以选工具、接收结果再决定下一步，而非预设每个业务步骤。相对已有Claude Code/Codex Action模式，执行与发布分离不是新范式，README也明确承认这些模式和官方DSH机制来源。可解释贡献是DSH运行时组合与Controller权限、验证和状态边界的具体整合。

重复维护摩擦和交接责任明确，但没有本次独立生产对照。README列出的运行链接是作者提供的案例，本次未访问或验收其原始结果，不能当当前固定版本的测试通过或用户收益。仅一次代码问答也可用本地Agent，没必要承担Action权限和网络配置。

#### 证据与依据

**依据 1 · 源码核查**：[action.yml:1-8](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/action.yml#L1-L8)

Action身份和任务描述。

```text
name: "DSH-action"
description: "DeepSeek coding tasks with controlled and native DSH composition, ecosystem extensions, and GitHub automation"
author: "Lixiaoyiao"
branding:
  icon: "code"
  color: "blue"

inputs:
```

**依据 2 · 作者声明**：[README.md:149-169](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L149-L169)

作者描述双模式和Controller职责。

<details>
<summary>查看原文（21行）</summary>

```text
## Core capabilities

| Capability              | What it does                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pull request review     | Reviews new commits, publishes one summary, and adds high-confidence inline findings                             |
| General tasks           | Answers repository questions or performs an explicitly authorized coding task                                    |
| CI diagnosis and repair | Reads failed checks and logs; trusted workflows may validate and publish a fix                                   |
| Issue implementation    | Turns an authorized Issue request into a validated branch and pull request                                       |
| Composition modes       | Keeps the existing controlled tool profile by default and offers an experimental native DSH mode                 |
| Controlled tools        | Adds exact profiles for native, fixed-command, typed Controller GitHub, MCP, Bundle, and Plugin tools            |
| Structured results      | Keeps the schema-v1 audit envelope and can validate an optional maintainer-defined task result                   |
| Images and binary files | Reads PNG/JPEG/WebP/GIF through official DSH tools, downloads eligible GitHub images, and preserves binary bytes |
| Explicit Session resume | Continues a completed task in a new Actions run using a verified raw DSH checkpoint and current permissions      |

The Action provides the experimental `dsh-mode: native` path over the locked DSH `0.2.1-rc.2` runtime and its official ecosystem composition. Native MCP servers, Profile Bundles, direct Cordis Plugins, repository Skills, Subagents, and Workflows retain DSH-native discovery and behavior. `controlled` remains the compatible default, so workflows that omit `dsh-mode` retain their existing composition, permissions, tools, budgets, receipts, and outputs.

Native mode is not an unsafe mode. It returns ownership of DSH's internal headless composition, capability graph, and model-visible inventory to DSH. Native MCP servers load through official `@deepseek-ai/dsh-mcp-client`; Bundles become official Profile layers; direct Plugins load through Cordis; and repository Skills, Subagents, and Workflows retain DSH-native behavior. Its definition-only extension schema declares owners and process requirements, not Action tools, grants, or per-tool budgets. Dynamic ecosystem tools appear only in runtime `observedTools`, and native `toolPolicy` never claims Controller `effectiveTools`.

The Action still owns trusted-workflow admission, exact package pins, lifecycle-script suppression, runtime inventory audit, Docker and `.git`-less workspace boundaries, the run-scoped DeepSeek credential proxy, GitHub credential isolation, actor/repository trust, validation and deferred writes, deadlines, cancellation, and secret redaction. Native remains Docker-only. Bridge network and read/write mounts are whole-worker capabilities, not per-extension or per-tool sandboxes. A user-configured GitHub MCP with its own credential is a trusted external extension whose direct effects do not receive the Controller Gateway's binding, revalidation, validation, or deferred-mutation guarantees. Controller-owned `command.*` and `github.*` capabilities remain a separate, mode-independent plane.

The Action supports [automatic Session creation and continuation by key](docs/session.md), retaining explicit save/resume. A trusted workflow discovers the latest successful compatible checkpoint; failed, unknown, missing, expired or corrupt history prevents silent fallback. Matching workflow identity and concurrency bindings serialize one key while allowing different keys to run concurrently. The existing Controller / DSH / Gateway / validation ownership, exact `0.2.1-rc.2` pin and default-off Session path remain. Current authority is recalculated; previous GitHub writes are not replayed. [Text file context](docs/text-files.md), [offline configuration checks](docs/configuration-check.md) and [bounded GitHub diagnostics](docs/github-requests.md) remain available.
```

</details>

**依据 3 · 源码核查**：[src/agent/loop.ts:138-178](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/agent/loop.ts#L138-L178)

真实工具请求、结果反馈和继续循环。

<details>
<summary>查看原文（41行）</summary>

```text
      const result: DshRunResult = {
        ...response,
        output: validatedOutput,
      };
      const aggregate = telemetry.observe(result);
      await hooks.onState?.(aggregate, stats(turn));
      const request = result.output.toolRequest;
      if (request !== undefined) {
        throwIfCancelled(hooks.signal);
        if (hooks.toolProvider === undefined) {
          throw new Error(`Agent requested unavailable tool: ${request.id}`);
        }
        const remainingBeforeTool = hooks.deadlineMs - now();
        if (remainingBeforeTool <= 0) throw new AgentDeadlineError();
        const input = request.input ?? {};
        const callId = `call-${feedbackFingerprint({
          taskScopeFingerprint,
          turn,
          id: request.id,
          input,
        }).slice(0, 40)}`;
        let toolResult;
        try {
          toolResult = await invokeControllerTool(
            hooks.toolProvider,
            { callId, id: request.id, input },
            {
              workspacePath: task.workspacePath,
              timeoutMs: remainingBeforeTool,
              ...(hooks.signal === undefined ? {} : { signal: hooks.signal }),
            },
            (receipt) => telemetry.recordTool(receipt),
            now,
          );
        } catch (error: unknown) {
          await hooks.onState?.(aggregate, stats(turn));
          throw error;
        }
        await hooks.onState?.(aggregate, stats(turn));
        feedback.push({ kind: "tool", turn, data: boundedFeedbackData(toolResult) });
        continue;
```

</details>

**依据 4 · 作者声明**：[README.md:179-186](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L179-L186)

作者列举示范运行，不是本次独立验收。

```text
These public runs show the comments and Actions logs produced by this repository.

| Scenario                                                | Run                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| PR review, including a rerun without duplicate comments | [PR #3](https://github.com/Lixiaoyiao/DSH-action/pull/3) · [Actions run](https://github.com/Lixiaoyiao/DSH-action/actions/runs/31760570162) |
| Diagnosis based on failed checks and logs               | [Actions run](https://github.com/Lixiaoyiao/DSH-action/actions/runs/31760603284)                                                            |
| Fix and validation in trusted write mode                | [Actions run](https://github.com/Lixiaoyiao/DSH-action/actions/runs/31761793492)                                                            |
| Issue implementation followed by a pull request         | [Issue #4](https://github.com/Lixiaoyiao/DSH-action/issues/4) → [PR #5](https://github.com/Lixiaoyiao/DSH-action/pull/5)                    |
```

**依据 5 · 作者声明**：[README.md:251-253](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L251-L253)

作者承认上游运行时及已有Action模式。

```text
[MIT](LICENSE). Third-party licenses are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [BUNDLED_DEPENDENCIES.md](BUNDLED_DEPENDENCIES.md).

DeepSeek Harness supplies the headless runtime and official extension mechanisms. The GitHub integration also draws on the MIT-licensed [Claude Code Action](https://github.com/anthropics/claude-code-action) patterns and the execution/publication separation described by [Codex GitHub Action](https://learn.chatgpt.com/docs/github-action); exact attributions are recorded in the third-party notices.
```

#### 缺口

- 未独立验收作者案例或维护者长期节省时间。
  **影响**：不能把可运行机制等同真实任务质量与采用必要性。
  **进一步探讨**：选定小仓库同一诊断任务比较本地Agent、固定CI和Action，回查结论依据与总人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型、工具反馈与凭证代理是否形成真正执行闭环？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Agent loop逐轮检查取消和截止时间，将结构化输出解析为任务结果；有toolRequest时生成绑定任务与轮次的callId，调用Controller toolProvider，把受限反馈加入下一轮再continue。完成则交给finalize，ValidationFailureError会转成反馈供修正，相同失败与工作区指纹触发无进展终止。这个链路支持自主工具执行和结果驱动继续，不证明模型一定选择正确工具或修好问题。

DshAgentEngine选择controlled或native组合并阻止并发轮次，dispose取消活跃轮并等清理。DeepSeek代理给worker随机32字节临时token，只有限定POST路径可过，Controller向上游重写真实key；真实key不作为worker token。代理关闭会取消活跃请求。Docker启动有只读根、去cap、no-new-privileges及按任务只读/可写工作区；这些是具体防线，不是对全部宿主与扩展的形式安全证明。

依赖Actions runner、DSH固定运行时、模型端点和按配置的网络/工具。即使拒绝公开出网仍需模型代理，worker默认允许公开出网；模型临时token减少真实key暴露，不消除运行期间被授权模型调用的费用或数据外发。仓库内容仍可能进入模型请求，不能宣称离线隐私。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/loop.ts:90-178](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/agent/loop.ts#L90-L178)

截止、结构解析和tool结果继续。

<details>
<summary>查看原文（89行）</summary>

```text
      (await dependencies.createEngine?.(runtime)) ??
      new DshAgentEngine(inputs, task.policy, runtime, task.tools.extensions);
    for (let turn = 1; turn <= inputs.maxTurns; turn += 1) {
      throwIfCancelled(hooks.signal);
      if (hooks.deadlineMs - now() <= 0) throw new AgentDeadlineError();
      const onTurn = hooks.onTurn;
      if (onTurn !== undefined) {
        await runLifecycleHookWithinDeadline(
          "turn progress",
          async () => onTurn(turn, inputs.maxTurns),
          hooks,
          now,
        );
      }
      const remainingBeforeTurn = Math.max(0, hooks.deadlineMs - now());
      if (remainingBeforeTurn <= 0) throw new AgentDeadlineError();
      let response;
      try {
        response = await runEngineTurnWithinDeadline(
          engine,
          {
            operation: task.operation,
            instructions: task.instructions,
            context: turnContext(task.contextPacket, taskContextAnchor, turn, feedback),
            tools: task.tools.manifests,
            workspacePath: task.workspacePath,
            deadlineMs: hooks.deadlineMs,
            timeoutMs: remainingBeforeTurn,
            ...(hooks.signal === undefined ? {} : { signal: hooks.signal }),
          },
          now,
        );
      } catch (error: unknown) {
        if (error instanceof DshError && error.telemetry !== undefined) {
          const aggregateFailure = telemetry.observe(error.telemetry);
          error.attachTelemetry(aggregateFailure);
          await hooks.onEngineFailure?.(aggregateFailure, stats(turn));
        }
        if (pendingValidationFailure !== undefined && error instanceof DshMalformedOutputError) {
          throw pendingValidationFailure;
        }
        throw error;
      }
      const validatedOutput = parseDshOutput(
        JSON.stringify(response.output),
        task.operation,
        task.operation === "task" ? inputs.taskOutputSchema : undefined,
      );
      const result: DshRunResult = {
        ...response,
        output: validatedOutput,
      };
      const aggregate = telemetry.observe(result);
      await hooks.onState?.(aggregate, stats(turn));
      const request = result.output.toolRequest;
      if (request !== undefined) {
        throwIfCancelled(hooks.signal);
        if (hooks.toolProvider === undefined) {
          throw new Error(`Agent requested unavailable tool: ${request.id}`);
        }
        const remainingBeforeTool = hooks.deadlineMs - now();
        if (remainingBeforeTool <= 0) throw new AgentDeadlineError();
        const input = request.input ?? {};
        const callId = `call-${feedbackFingerprint({
          taskScopeFingerprint,
          turn,
          id: request.id,
          input,
        }).slice(0, 40)}`;
        let toolResult;
        try {
          toolResult = await invokeControllerTool(
            hooks.toolProvider,
            { callId, id: request.id, input },
            {
              workspacePath: task.workspacePath,
              timeoutMs: remainingBeforeTool,
              ...(hooks.signal === undefined ? {} : { signal: hooks.signal }),
            },
            (receipt) => telemetry.recordTool(receipt),
            now,
          );
        } catch (error: unknown) {
          await hooks.onState?.(aggregate, stats(turn));
          throw error;
        }
        await hooks.onState?.(aggregate, stats(turn));
        feedback.push({ kind: "tool", turn, data: boundedFeedbackData(toolResult) });
        continue;
```

</details>

**依据 2 · 源码核查**：[src/agent/loop.ts:197-230](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/agent/loop.ts#L197-L230)

finalize与验证失败反馈/无进展判断。

<details>
<summary>查看原文（34行）</summary>

```text
      try {
        const finalization = await hooks.finalize(aggregate, remainingBeforeFinalize);
        const completed = {
          agent: aggregate,
          stats: stats(turn),
          finalization,
        };
        await hooks.onRuntimeCompleted?.(runtime, completed);
        return completed;
      } catch (error: unknown) {
        if (!(error instanceof ValidationFailureError)) throw error;
        pendingValidationFailure = error;
        telemetry.recordValidationRetry();
        await hooks.onState?.(aggregate, stats(turn));
        const onValidationRetry = hooks.onValidationRetry;
        if (onValidationRetry !== undefined) {
          await runLifecycleHookWithinDeadline(
            "validation retry progress",
            async () => onValidationRetry(turn, error),
            hooks,
            now,
          );
        }
        const data = validationFeedback(error, redact);
        const fingerprint = feedbackFingerprint({
          argv: error.argv,
          exitCode: error.exitCode,
          timedOut: error.timedOut,
          workspace: await workspaceFingerprint(task.workspacePath),
        });
        if (fingerprint === lastValidationFingerprint) {
          throw new AgentNoProgressError({ cause: error });
        }
        lastValidationFingerprint = fingerprint;
```

</details>

**依据 3 · 源码核查**：[src/dsh/engine.ts:47-95](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/dsh/engine.ts#L47-L95)

组合选择、非重叠轮次和dispose。

<details>
<summary>查看原文（49行）</summary>

```text
  public constructor(
    private readonly inputs: ActionInputs,
    private readonly policy: SecurityPolicy,
    private readonly runtime?: DshRuntime,
    private readonly extensions?: ExtensionPlan,
    composition?: DshComposition,
    private readonly diagnostics?: RunDiagnostics,
  ) {
    this.composition = composition ?? selectDshComposition(inputs.dshMode).create();
  }

  public async runTurn(request: AgentTurnRequest) {
    if (this.closing)
      throw new DshConfigurationError("A disposed DSH engine cannot start another turn");
    if (this.activeRun !== undefined)
      throw new DshConfigurationError(
        "A DSH engine cannot run overlapping turns against its runtime",
      );
    const controller = new AbortController();
    const signal =
      request.signal === undefined
        ? controller.signal
        : AbortSignal.any([request.signal, controller.signal]);
    const running = this.executeTurn({ ...request, signal });
    const active = {
      controller,
      settled: running.then(
        () => undefined,
        () => undefined,
      ),
    };
    this.activeRun = active;
    try {
      return await running;
    } finally {
      if (this.activeRun === active) this.activeRun = undefined;
    }
  }

  /** Cancel active turns and await their cleanup; the runtime owner separately drains late activity leases. */
  public dispose(): Promise<void> {
    this.closing = true;
    this.activeRun?.controller.abort(new DshAbortedError());
    this.disposal ??= this.activeRun?.settled ?? Promise.resolve();
    return this.disposal;
  }

  private async executeTurn(request: AgentTurnRequest) {
    const { nativeTools, controllerTools, extensionTools } = partitionDshToolPlanes(request.tools);
```

</details>

**依据 4 · 源码核查**：[src/dsh/proxy.ts:221-275](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/dsh/proxy.ts#L221-L275)

上游header重写、限定POST和token鉴权。

<details>
<summary>查看原文（55行）</summary>

```text
function upstreamHeaders(
  request: IncomingMessage,
  runtime: ProxyRuntime,
  kind: RoutedUpstream["kind"],
): Record<string, string> {
  const headers: Record<string, string> = {
    accept: request.headers.accept ?? "application/json",
    authorization: `Bearer ${runtime.apiKey}`,
    "content-type": request.headers["content-type"] ?? "application/json",
    "user-agent": "dsh-action-credential-proxy/1",
  };
  if (kind === "web-search" || kind === "messages") {
    // Replace both credential forms. Never forward worker-provided provider
    // credentials or any header outside this explicit Anthropic allowlist.
    headers["x-api-key"] = runtime.apiKey;
    const anthropicVersion = request.headers["anthropic-version"];
    if (typeof anthropicVersion === "string") headers["anthropic-version"] = anthropicVersion;
    if (
      kind === "messages" &&
      request.headers["anthropic-beta"] === "mid-conversation-tool-changes-2026-07-01"
    ) {
      headers["anthropic-beta"] = "mid-conversation-tool-changes-2026-07-01";
    }
  }
  return headers;
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  runtime: ProxyRuntime,
): Promise<void> {
  if (request.method !== "POST") {
    replyJson(response, 405, "method_not_allowed");
    return;
  }
  const routed = routeUpstream(runtime, request.url ?? "");
  const authorization: string | undefined = request.headers.authorization;
  const apiKey = request.headers["x-api-key"];
  const authenticated =
    routed?.kind === "messages"
      ? (authorization !== undefined || typeof apiKey === "string") &&
        (authorization === undefined || authorized(authorization, runtime.token)) &&
        (apiKey === undefined ||
          (typeof apiKey === "string" && authorized(`Bearer ${apiKey}`, runtime.token)))
      : authorized(authorization, runtime.token);
  if (!authenticated) {
    replyJson(response, 401, "unauthorized");
    return;
  }

  if (routed === null) {
    replyJson(response, 404, "endpoint_not_allowed");
    return;
  }
```

</details>

**依据 5 · 源码核查**：[src/dsh/proxy.ts:380-455](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/dsh/proxy.ts#L380-L455)

随机临时token、代理与关闭取消。

<details>
<summary>查看原文（76行）</summary>

```text
  options: DeepSeekProxyOptions,
): Promise<DeepSeekProxyHandle> {
  if (options.apiKey.trim() === "") throw new DshConfigurationError("DeepSeek API key is empty");

  const base = validatedControllerBaseUrl(options.baseUrl, "DeepSeek base URL");
  if (options.allowWebSearch === true && options.webSearchBaseUrl === undefined) {
    throw new DshConfigurationError(
      "Web search base URL is required when Controller web search permission is enabled",
    );
  }
  const configuredWebSearchBase =
    options.webSearchBaseUrl === undefined
      ? undefined
      : validatedControllerBaseUrl(options.webSearchBaseUrl, "Web search base URL");
  const webSearchBase = options.allowWebSearch === true ? configuredWebSearchBase : undefined;

  const bindHost = options.bindHost ?? "127.0.0.1";
  const workerHost = options.workerHost ?? bindHost;
  const token = randomBytes(32).toString("base64url");
  const activeRequests = new Set<AbortController>();
  const runtime: ProxyRuntime = {
    ...(options.diagnostics === undefined ? {} : { diagnostics: options.diagnostics }),
    ...(options.deadlineMs === undefined ? {} : { deadlineMs: options.deadlineMs }),
    apiKey: options.apiKey,
    token,
    base,
    allowWebSearch: options.allowWebSearch === true,
    allowWebFetch: options.allowWebFetch === true,
    ...(webSearchBase === undefined ? {} : { webSearchBase }),
    requestLimit: positiveInteger(
      options.maxRequestBytes ?? DEFAULT_REQUEST_LIMIT,
      "maxRequestBytes",
    ),
    responseLimit: positiveInteger(
      options.maxResponseBytes ?? DEFAULT_RESPONSE_LIMIT,
      "maxResponseBytes",
    ),
    timeoutMs: positiveInteger(options.requestTimeoutMs ?? DEFAULT_TIMEOUT_MS, "requestTimeoutMs"),
    fetchImplementation: options.fetchImplementation ?? fetch,
    activeRequests,
  };

  const server = createServer((request, response) => {
    void handleRequest(request, response, runtime);
  });
  server.on("clientError", (_error, socket) => {
    socket.end("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n");
  });

  let address: AddressInfo;
  try {
    address = await listen(server, bindHost);
  } catch (error: unknown) {
    throw new DshProxyError("Failed to start the DeepSeek credential proxy", { cause: error });
  }

  const { port } = address;
  const controllerHost = address.family === "IPv6" ? `[${address.address}]` : address.address;
  let closed = false;
  return {
    controllerBaseUrl: `http://${controllerHost}:${String(port)}`,
    workerBaseUrl: `http://${workerHost}:${String(port)}`,
    ...(webSearchBase === undefined
      ? {}
      : {
          workerWebSearchBaseUrl: `http://${workerHost}:${String(port)}/anthropic/v1`,
          workerWebSearchProvider: "deepseek-official",
        }),
    workerToken: token,
    boundHost: bindHost,
    port,
    async close(): Promise<void> {
      if (closed) return;
      closed = true;
      for (const controller of activeRequests) controller.abort();
      server.closeAllConnections();
```

</details>

**依据 6 · 源码核查**：[src/dsh/docker-policy.ts:173-205](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/dsh/docker-policy.ts#L173-L205)

容器资源/权限与工作区mount。

<details>
<summary>查看原文（33行）</summary>

```text

  const args = [
    "run",
    "--rm",
    "--init",
    "--name",
    `dsh-action-${randomUUID()}`,
    "--read-only",
    "--cap-drop",
    "ALL",
    "--security-opt",
    "no-new-privileges",
    "--pids-limit",
    "256",
    "--memory",
    "2g",
    "--cpus",
    "2",
    "--user",
    hostUserForContainer(),
    "--network",
    options.networkName,
    "--add-host",
    `host.docker.internal:${options.hostGateway}`,
    "--tmpfs",
    "/tmp:rw,noexec,nosuid,nodev,size=536870912",
    "--volume",
    `${options.workspace}:${CONTAINER_WORKSPACE}:${options.workspaceWrite ? "rw" : "ro"}`,
    "--volume",
    `${options.dshHome}:${CONTAINER_DSH_HOME}:ro`,
    "--volume",
    `${join(options.dshHome, "action-state")}:${CONTAINER_ACTION_STATE}:rw`,
    "--volume",
```

</details>

**依据 7 · 源码核查**：[action.yml:10-13](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/action.yml#L10-L13)

公开出网默认true。

```text
  worker-network:
    description: "Sole Worker public-egress switch, independent of mode, trust and plugin flags. Defaults to true; false requires Docker and retains the necessary model proxy."
    required: false
    default: "true"
```

#### 缺口

- 未执行模型、工具、取消和容器故障。
  **影响**：源码闭环不等目标runner实际运行通过，也不证明网络隔离完备。
  **进一步探讨**：在专用runner无私密任务核对调用结果、费用、截止取消和禁止出网下模型代理可用性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 代码与GitHub写入何时生效，失败会否被误判为成功？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

代码写入事务先核目标，再执行工作区验证并重核目标与当前权限，之后才创建GitHub提交、分支或更新PR head。新PR保留已确认分支receipt，PR发布失败不应被当作完全无事发生；先前已完成操作经所有权验证可直接返回，不重放写入。验证通过只是给定命令与当前工作区的结果，并非业务正确性或完整安全性。

Controller github.*工具另有延迟队列，flush先验证再重核当前权限，逐条执行并保留receipt。mutation适配器先读取后只发送一次变更，再读后置条件；超时等模糊失败可只读核对，无法确认时区分possible和confirmed外部效果，不盲目再次写入。取消与传输竞态仍可能发生已生效但流程失败，不能把红色Actions自动解释成无外部副作用，也不能称多GitHub操作全组原子回滚。

本次确认关键事务和typed gateway适配器，不是完整审计所有验证完整性解析器/发行包。更重要的是这些保证属于Controller链路，自带GitHub凭证的第三方MCP直接写入不经过同一验证与绑定，因此采用前必须核对工具实际执行方和凭证来源。

#### 证据与依据

**依据 1 · 源码核查**：[src/write/transaction.ts:126-149](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L126-L149)

验证、重核目标和权限的顺序。

<details>
<summary>查看原文（24行）</summary>

```text
  }
}

async function validateWriteTransaction(
  options: RepositoryWriteOptions,
  budget: ValidationDeadline,
): Promise<void> {
  const { validation, control } = options;
  const receipt = await (control.validateWorkspace?.(budget) ??
    validateWorkspaceRevision(
      options.workspace,
      validation,
      budget,
      control.onValidationCommandCount,
    ));
  control.onValidationPassed?.(receipt);
  throwIfCancelled(control.signal);
  await withinValidationDeadline(async () => revalidateWriteTarget(options), budget);
  await withinValidationDeadline(control.revalidateAuthority, budget);
  throwIfCancelled(control.signal);
}

async function persistNewPullRequest(
  options: RepositoryWriteOptions & { readonly plan: NewPullRequestWritePlan },
```

</details>

**依据 2 · 源码核查**：[src/write/transaction.ts:151-190](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L151-L190)

分支确认后再发布PR。

<details>
<summary>查看原文（40行）</summary>

```text
  reconciledCommit: string | null,
): Promise<NewPullRequestWriteResult> {
  const {
    client,
    repository: { owner, repo },
    plan,
  } = options;
  const { operation, target } = plan;
  let commitSha = reconciledCommit;
  if (commitSha === null) {
    commitSha = candidateSha;
    await createRemoteBranch(client, owner, repo, operation.branch, commitSha);
  } else {
    await assertEquivalentOperationCommit(
      plan.operationKind,
      client,
      owner,
      repo,
      commitSha,
      candidateSha,
      operation,
      target.sha,
    );
  }
  options.control.onBranchConfirmed?.({ branchName: operation.branch, commitSha });
  await assertRemoteBranchHead(client, owner, repo, operation.branch, commitSha);
  await revalidateWriteTarget(options);
  const pull = await createPullRequest(
    client,
    owner,
    repo,
    operation.branch,
    target.branch,
    plan.publication.title,
    plan.publication.body,
    operation.pullRequestMarker,
  );
  return { branch: operation.branch, pullNumber: pull.number, url: pull.url };
}

```

</details>

**依据 3 · 源码核查**：[src/write/transaction.ts:223-248](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L223-L248)

已完成操作所有权确认与无重放返回。

<details>
<summary>查看原文（26行）</summary>

```text
      budget,
    );
    // Authenticate a completed prior attempt without replaying writes or relying
    // on an Issue/base snapshot which the completed operation may have advanced.
    if (completed !== null) {
      await withinValidationDeadline(
        async () =>
          assertOwnedOperationCommit(
            plan.operationKind,
            client,
            owner,
            repo,
            completed.headSha,
            operation.key,
            completed.snapshotFingerprint,
          ),
        budget,
      );
      // The authenticated completed operation was already Controller-validated.
      // Preserve that successful evidence without rerunning tests or mutations.
      control.onValidationPassed?.({ kind: "completed-operation" });
      return { branch: operation.branch, pullNumber: completed.number, url: completed.url };
    }
    reconciledCommit = await withinValidationDeadline(
      async () =>
        findOwnedBranchCommit(plan.operationKind, client, owner, repo, operation, target.sha),
```

</details>

**依据 4 · 源码核查**：[src/write/transaction.ts:251-289](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L251-L289)

实际创建提交及更新ref的顺序。

<details>
<summary>查看原文（39行）</summary>

```text
  }
  await withinValidationDeadline(async () => revalidateWriteTarget(options), budget);
  if (plan.kind === "pr-head") {
    const changes = await withinValidationDeadline(
      async () => inspectWorkspaceChanges(options.workspace),
      budget,
    );
    if (changes.all.length === 0)
      throw new Error("DSH reported a write but produced no file changes");
  }
  await validateWriteTransaction(options, budget);
  control.onPhase?.("write");
  // The authority gate precedes every initial persistent effect, including blobs.
  // After this seam, finish the bounded transport's existing reconciliation sequence
  // if cancellation races it, without replaying a ref or PR mutation.
  const candidate = await createGitHubCommitFromWorkspace(
    client,
    {
      owner,
      repo,
      baseSha: plan.kind === "new-pr" ? plan.target.sha : plan.target.identity.headSha,
      message: plan.kind === "new-pr" ? plan.operation.commitMessage : plan.commitMessage,
    },
    options.workspace,
  );
  await revalidateWriteTarget(options);
  if (plan.kind === "new-pr") {
    return await persistNewPullRequest({ ...options, plan }, candidate.sha, reconciledCommit);
  }
  await assertRemoteBranchHead(
    client,
    owner,
    repo,
    plan.target.identity.headRef,
    plan.target.identity.headSha,
  );
  await updateRemoteBranch(client, owner, repo, plan.target.identity.headRef, candidate.sha);
  return { commitSha: candidate.sha, paths: candidate.paths };
}
```

</details>

**依据 5 · 源码核查**：[src/tools/github-authority-gateway.ts:245-307](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/tools/github-authority-gateway.ts#L245-L307)

验证与权限重核后逐条flush并保留失败receipt。

<details>
<summary>查看原文（63行）</summary>

```text
  public async flush(context: ToolInvocationContext): Promise<readonly GitHubToolFlushReceipt[]> {
    if (this.flushing) throw new Error("GitHub tool mutation flush is already active");
    const receipts: GitHubToolFlushReceipt[] = [];
    const deadlineMs = Date.now() + context.timeoutMs;
    this.flushing = true;
    try {
      if (this.pending.size > 0 && this.options.validationGate !== undefined) {
        await this.options.validationGate({
          workspacePath: context.workspacePath,
          timeoutMs: Math.max(0, deadlineMs - Date.now()),
          ...(context.signal === undefined ? {} : { signal: context.signal }),
          mutations: [...this.pending.values()].map((call) => ({
            callId: call.callId,
            id: mutationToolSchema.parse(call.id),
          })),
        });
      }
      const revalidateAuthority = this.options.revalidateAuthority;
      if (this.pending.size > 0 && revalidateAuthority !== undefined) {
        try {
          await callGitHubApi(
            { deadlineMs, ...(context.signal === undefined ? {} : { signal: context.signal }) },
            async () => revalidateAuthority(),
          );
        } catch (error: unknown) {
          this.pending.clear();
          throw error;
        }
      }
      for (const [callId, call] of this.pending) {
        const startedAt = Date.now();
        this.activeFlushCallId = callId;
        try {
          const result = await this.invoke(call, {
            ...context,
            timeoutMs: Math.max(0, deadlineMs - Date.now()),
          });
          receipts.push({ result, durationMs: Math.max(0, Date.now() - startedAt) });
          this.pending.delete(callId);
        } catch (error: unknown) {
          const mutationError = error instanceof GitHubMutationExecutionError ? error : undefined;
          const output = scheduledOutputSchema.parse({
            effect: "scheduled",
            target: this.target(),
            attempts: mutationError?.attempts ?? 0,
            reconciled: mutationError?.reconciled ?? false,
            ...(mutationError === undefined || mutationError.externalEffect === "none"
              ? {}
              : { externalEffect: mutationError.externalEffect }),
            operation: call.id,
          });
          receipts.push({
            result: { callId: call.callId, id: call.id, ok: false, output },
            durationMs: Math.max(0, Date.now() - startedAt),
          });
          throw new GitHubToolFlushError(receipts, { cause: error });
        } finally {
          this.activeFlushCallId = undefined;
        }
      }
      return receipts;
    } finally {
      this.flushing = false;
```

</details>

**依据 6 · 源码核查**：[src/tools/github-gateway-mutation.ts:36-93](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/tools/github-gateway-mutation.ts#L36-L93)

单写后置核对和possible/confirmed失败分类。

<details>
<summary>查看原文（58行）</summary>

```text
}

/** Send a mutation once, then reconcile uncertain effects with fresh reads. */
export async function mutateGitHubWithPostcondition<T>(options: {
  readonly invocation: GitHubInvocationDeadline;
  readonly read: (control: GitHubBackendRequestControl) => Promise<T>;
  readonly mutate: (control: GitHubBackendRequestControl, markStarted: () => void) => Promise<void>;
  readonly matches: (value: T) => boolean;
}): Promise<GitHubMutationResult<T>> {
  const read = async (): Promise<T> => await callGitHubApi(options.invocation, options.read);
  const before = await read();
  if (options.matches(before)) {
    return { value: before, attempts: 0, effect: "unchanged", reconciled: true };
  }
  const attempts = 1;
  const mutation = { started: false };
  let mutationAcknowledged = false;
  try {
    await callGitHubApi(options.invocation, async (control) =>
      options.mutate(control, () => {
        mutation.started = true;
      }),
    );
    mutationAcknowledged = true;
    const after = await read();
    if (!options.matches(after)) {
      throw new Error("GitHub mutation postcondition did not match the requested state");
    }
    return { value: after, attempts, effect: "updated", reconciled: true };
  } catch (error: unknown) {
    if (mutationAcknowledged) {
      throw new GitHubMutationExecutionError(attempts, false, "confirmed", {
        cause: error,
      });
    }
    if (!mutation.started || error instanceof GitHubEntityRevalidationError) {
      throw new GitHubMutationExecutionError(attempts, false, "none", { cause: error });
    }
    if (options.invocation.signal?.aborted === true || !isAmbiguousGitHubMutationError(error)) {
      const externalEffect = isAmbiguousGitHubMutationError(error) ? "possible" : "none";
      throw new GitHubMutationExecutionError(attempts, false, externalEffect, {
        cause: error,
      });
    }
    try {
      const value = await read();
      if (options.matches(value)) {
        return { value, attempts, effect: "updated", reconciled: true };
      }
      throw new GitHubMutationExecutionError(attempts, true, "possible", { cause: error });
    } catch (readError: unknown) {
      if (readError instanceof GitHubMutationExecutionError) throw readError;
      throw new GitHubMutationExecutionError(attempts, false, "possible", {
        cause: readError,
      });
    }
  }
}
```

</details>

**依据 7 · 作者声明**：[README.md:211-219](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L211-L219)

作者明确外部MCP不继承Gateway保证。

```text
- The Agent receives neither the real `GITHUB_TOKEN` nor the real DeepSeek key. Only the Controller can call Action-owned `github.*` mutation APIs; an explicitly configured external GitHub MCP uses its own credential and authority as described below.
- Repository content, diffs, issues, pull requests, comments, logs, model output, and tool output remain untrusted data.
- Fork review uses a `.git`-less, credential-free worker and must check out only the trusted base SHA with `persist-credentials: false`.
- Writes require a trusted same-repository context, authorized actors, Docker, `allow-write: "true"`, non-empty fixed validation commands, and successful validation. Protected-path and Validation Integrity checks still apply.
- Typed `github.*` mutations are exact-ID, entity-bound, deferred until Controller validation, and reconciled with bounded receipts. No arbitrary REST, GraphQL, URL, or credential pass-through exists.
- Validation Integrity provides high-confidence weakening detection plus baseline replay for its supported entrypoints, scripts, test/config weakening, lock/toolchain controls, and known wrappers/interpreters; it is not complete cross-language dependency provenance or a formal proof.
- Validation may use Docker bridge networking. On self-hosted or corporate-network runners, repository validation code may reach runner-accessible network services; use dedicated runners and runner-level segmentation/egress controls.
- An approved Bundle, Plugin, or stdio MCP server is trusted worker code. Controlled ToolRuntime limits model-routed calls; native leaves routing and inventory to DSH. Neither model is a sandbox for extension startup, background work, or direct process I/O, and any bridge/RW capability applies to the whole worker.
- `github.*` uses the Controller GitHub Gateway. A separately configured GitHub MCP uses its own external credential and is outside the Gateway's binding, revalidation, validation, and deferred-write guarantees.
```

#### 缺口

- 未故障注入传输竞态、权限撤销和验证完整性全部解析路径。
  **影响**：不能据此批准无监督写入、保证完全不重复或无损回滚。
  **进一步探讨**：在可丢弃仓库先验证撤权、目标前移、PR创建后丢响应与取消竞态，回查receipt/真实refs，不靠任务颜色重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 原生生态与Session恢复能继承哪些权限？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

controlled为默认模式，Action管理工具清单与路由；native把官方Profile/MCP/Bundle/Plugin/Skill/Subagent/Workflow组合交还DSH，仍在Action的Docker边界。它不是把动态原生工具伪装成固定Controller有效清单。native属于实验路径，插件启动、后台活动和直接进程IO并不被模型调用预算沙箱隔离；bridge网络和RW mount是整个worker共享能力，单插件network标志不等独立网络边界。选择native应视为信任整个组合和扩展代码。

Session默认关闭。Controller prepare要求当前可信权限与Docker、完整workflow/job/run/attempt身份，绑定仓库、任务、运行时版本、组合与扩展摘要；restore需已验证source并导入受检查checkpoint，save导出原始Session、附件和来源manifest，保留期限有限。Session提供对话状态延续，不能携带当前授权，prepareSessionArtifacts被传入authority.revalidate；上次写入不是新的授权。

README声称失败、缺失、过期或损坏历史禁止静默回退，本次只核Controller接线而未完整审计artifact发现和归档解析，所以把这一项保留为待验证规则。恢复原始对话和附件会扩大留存面；不能因排除已知密钥就保证所有业务秘密都不在artifact中，采用者应先核内容与访问范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/select-composition.ts:1-7](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/dsh/select-composition.ts#L1-L7)

模式选择真实接线。

```text
import type { DshCompositionSelection, DshMode } from "./composition.js";
import { PRODUCTION_DSH_COMPOSITION } from "./controlled-composition.js";
import { NATIVE_DSH_COMPOSITION } from "./native-composition.js";

export function selectDshComposition(mode: DshMode): DshCompositionSelection {
  return mode === "native" ? NATIVE_DSH_COMPOSITION : PRODUCTION_DSH_COMPOSITION;
}
```

**依据 2 · 作者声明**：[README.md:163-169](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L163-L169)

native所有权、共享能力与Session声明。

```text
The Action provides the experimental `dsh-mode: native` path over the locked DSH `0.2.1-rc.2` runtime and its official ecosystem composition. Native MCP servers, Profile Bundles, direct Cordis Plugins, repository Skills, Subagents, and Workflows retain DSH-native discovery and behavior. `controlled` remains the compatible default, so workflows that omit `dsh-mode` retain their existing composition, permissions, tools, budgets, receipts, and outputs.

Native mode is not an unsafe mode. It returns ownership of DSH's internal headless composition, capability graph, and model-visible inventory to DSH. Native MCP servers load through official `@deepseek-ai/dsh-mcp-client`; Bundles become official Profile layers; direct Plugins load through Cordis; and repository Skills, Subagents, and Workflows retain DSH-native behavior. Its definition-only extension schema declares owners and process requirements, not Action tools, grants, or per-tool budgets. Dynamic ecosystem tools appear only in runtime `observedTools`, and native `toolPolicy` never claims Controller `effectiveTools`.

The Action still owns trusted-workflow admission, exact package pins, lifecycle-script suppression, runtime inventory audit, Docker and `.git`-less workspace boundaries, the run-scoped DeepSeek credential proxy, GitHub credential isolation, actor/repository trust, validation and deferred writes, deadlines, cancellation, and secret redaction. Native remains Docker-only. Bridge network and read/write mounts are whole-worker capabilities, not per-extension or per-tool sandboxes. A user-configured GitHub MCP with its own credential is a trusted external extension whose direct effects do not receive the Controller Gateway's binding, revalidation, validation, or deferred-mutation guarantees. Controller-owned `command.*` and `github.*` capabilities remain a separate, mode-independent plane.

The Action supports [automatic Session creation and continuation by key](docs/session.md), retaining explicit save/resume. A trusted workflow discovers the latest successful compatible checkpoint; failed, unknown, missing, expired or corrupt history prevents silent fallback. Matching workflow identity and concurrency bindings serialize one key while allowing different keys to run concurrently. The existing Controller / DSH / Gateway / validation ownership, exact `0.2.1-rc.2` pin and default-off Session path remain. Current authority is recalculated; previous GitHub writes are not replayed. [Text file context](docs/text-files.md), [offline configuration checks](docs/configuration-check.md) and [bounded GitHub diagnostics](docs/github-requests.md) remain available.
```

**依据 3 · 源码核查**：[action.yml:73-88](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/action.yml#L73-L88)

默认关闭、恢复来源和留存配置。

<details>
<summary>查看原文（16行）</summary>

```text
  session-mode:
    description: "Session opt-in: off, auto, save, or resume. Auto creates or continues the latest successful compatible checkpoint by key, with verified key-scoped concurrency and run-name history. Requires Docker; explicit save/resume remain supported."
    required: false
    default: "off"
  session-key:
    description: "Maintainer-selected logical Session key, 1-64 ASCII letters, digits, dot, underscore or hyphen. Auto keys are case-insensitive, matching GitHub concurrency. Bound to repository, workflow job, task and runtime; never grants authority."
    required: false
    default: ""
  session-source-run-id:
    description: "For session-mode=resume, the explicit successful producer Actions run ID. Only its verified current attempt and latest compatible checkpoint may be restored."
    required: false
    default: ""
  session-retention-days:
    description: "Checkpoint retention, 1-7 days. Saves the complete raw DSH Session, referenced official attachment bytes and a bounded provenance manifest; credentials and Controller authorization are excluded."
    required: false
    default: "3"
```

</details>

**依据 4 · 源码核查**：[src/session/controller.ts:117-156](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/session/controller.ts#L117-L156)

当前信任/Docker和workflow身份检查。

<details>
<summary>查看原文（40行）</summary>

```text
          "Session requires current trusted repository authority and Docker isolation",
        );
      }
      const prefix = `${context.repository.fullName}/`;
      const workflowRef = environment.GITHUB_WORKFLOW_REF ?? "";
      const separator = workflowRef.lastIndexOf("@");
      const workflowPath =
        workflowRef.startsWith(prefix) && separator > prefix.length
          ? workflowRef.slice(prefix.length, separator)
          : "";
      const workflowSha = environment.GITHUB_WORKFLOW_SHA ?? "";
      const jobId = environment.GITHUB_JOB ?? "";
      const runId = Number(context.runId);
      const runAttempt = Number(environment.GITHUB_RUN_ATTEMPT);
      if (
        !/^\.github\/workflows\/[A-Za-z0-9][A-Za-z0-9._-]*\.ya?ml$/u.test(workflowPath) ||
        !/^[a-f0-9]{40}$/u.test(workflowSha) ||
        !/^[A-Za-z_][A-Za-z0-9_-]{0,99}$/u.test(jobId) ||
        !Number.isSafeInteger(runId) ||
        runId < 1 ||
        !Number.isSafeInteger(runAttempt) ||
        runAttempt < 1 ||
        runAttempt > 1000
      ) {
        throw new PolicyDeniedError(
          "Session requires complete verified Actions workflow, job, run and attempt identity",
        );
      }
      const prepared = await prepareSessionArtifacts({
        client,
        mode,
        binding: {
          repository: {
            id: context.repository.id,
            owner: context.repository.owner,
            repo: context.repository.repo,
          },
          workflow: { path: workflowPath, jobId, jobName: jobId },
          task:
            context.kind === "entity"
```

</details>

**依据 5 · 源码核查**：[src/session/controller.ts:160-193](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/session/controller.ts#L160-L193)

运行时绑定与当前权限重核回调。

<details>
<summary>查看原文（34行）</summary>

```text
                }
              : {
                  kind: "automation",
                  identity: `${operation}:${logicalKey}`,
                },
          runtime: {
            dshVersion: "0.2.1-rc.2",
            mode: inputs.dshMode,
            compositionId: options.compositionId,
            containerImage: inputs.containerImage,
            extensionDigest: options.extensionDigest,
          },
          keyHash: sessionKeyHash(logicalKey),
        },
        currentRun: { runId, runAttempt, workflowSha, actorLogin: context.actor },
        ...(sourceRunId === undefined ? {} : { sourceRunId }),
        retentionDays: inputs.sessionRetentionDays,
        deadlineMs,
        signal,
        onWorkflowWarning: (message) => core.warning(message),
        onUploadReceipt: (receipt) => {
          summary = {
            ...summary,
            ...(receipt.kind === "claim"
              ? { claimArtifactId: receipt.id }
              : {
                  artifactId: receipt.id,
                  artifactName: receipt.name,
                  ...(receipt.sha256 === undefined ? {} : { archiveSha256: receipt.sha256 }),
                }),
          };
        },
        authorizeCurrent: async () => {
          signal.throwIfAborted();
```

</details>

**依据 6 · 源码核查**：[src/session/controller.ts:223-253](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/session/controller.ts#L223-L253)

source校验与checkpoint导入。

<details>
<summary>查看原文（31行）</summary>

```text
      try {
        const prepared = await preparedArtifacts();
        signal.throwIfAborted();
        runtime.session = {
          bindingDigest: sessionBindingHash(prepared.binding),
          knownSecrets: new Set(secrets),
        };
        if (prepared.checkpoint !== undefined) {
          if (prepared.source === undefined)
            throw new PolicyDeniedError("Session checkpoint has no verified source run");
          const inspection = await importSessionCheckpoint({
            persistenceRoot: join(runtime.dshHome, "sessions"),
            dshHome: join(runtime.dshHome, "attachments"),
            checkpoint: prepared.checkpoint,
            binding: prepared.binding,
            source: prepared.source,
            workspacePath: "/workspace",
            knownSecrets: [...secrets],
          });
          runtime.session.sessionId = inspection.sessionId;
          runtime.session.checkpointEventCount = inspection.eventCount;
          summary = {
            ...summary,
            status: "restored",
            sessionId: inspection.sessionId,
          };
        }
      } catch (error: unknown) {
        failed(error);
      }
    },
```

</details>

**依据 7 · 源码核查**：[src/session/controller.ts:258-298](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/session/controller.ts#L258-L298)

保存Session附件与来源manifest。

<details>
<summary>查看原文（41行）</summary>

```text
        const session = runtime.session;
        if (session?.sessionId === undefined)
          throw new PolicyDeniedError("Successful worker did not produce an admitted Session");
        const createdAt = new Date();
        const expiresAt = new Date(
          createdAt.getTime() + inputs.sessionRetentionDays * 24 * 60 * 60 * 1000,
        ).toISOString();
        const checkpoint = await exportSessionCheckpoint({
          persistenceRoot: join(runtime.dshHome, "sessions"),
          dshHome: join(runtime.dshHome, "attachments"),
          workspacePath: "/workspace",
          knownSecrets: [...session.knownSecrets],
          manifest: {
            schemaVersion: 1,
            repository: prepared.binding.repository,
            workflow: {
              ...prepared.binding.workflow,
              sourceSha: prepared.current.sourceSha,
              runId: prepared.current.runId,
              runAttempt: prepared.current.runAttempt,
            },
            task: prepared.binding.task,
            runtime: prepared.binding.runtime,
            issuer: {
              actorId: prepared.current.actorId,
              actorLogin: prepared.current.actorLogin,
              jobRunId: prepared.current.jobRunId,
            },
            session: {
              keyHash: prepared.binding.keyHash,
              sessionId: session.sessionId,
              generation: prepared.generation,
            },
            createdAt: createdAt.toISOString(),
            expiresAt,
          },
        });
        summary = {
          ...summary,
          sessionId: session.sessionId,
          payloadSha256: checkpoint.manifest.payload.sha256,
```

</details>

#### 缺口

- 未完整核查artifact选择/归档路径、跨版本恢复和扩展后台行为。
  **影响**：不能推荐native+Session+外部写MCP一次性启用，或保证所有历史拒绝规则已验。
  **进一步探讨**：先关闭两项完成基础任务，再逐项测试坏checkpoint/密钥扫描/不同组合拒绝与完整清理，复核artifact访问范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人值得试用，配置和恢复由谁承担？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

适合已有可信CI、能维护验证命令及权限策略的仓库维护者，先试重复的只读诊断或评审。默认allow-write=false、task-access=read、自然语言写入另需开启，提供可收窄起点；不是看到@dsh就授予写权限。首次固定Action提交、准备模型secret、受信基础checkout、runner与网络策略，再在无价值仓库比较结论证据。没有可信工作流维护能力的使用者应留在本地Agent，不照抄写权限示例。

持续成本由维护者承担，包括模型token、Actions计算/存储、镜像/DSH依赖、工具配置、代码验证耗时、审核机器人回复和误报。固定DSH0.2.1-rc.2与Node>=24降低漂移但也带来升级兼容工作；没有当前价目和实测数据，金额、收益与回本时间均未知。README指出自托管runner验证代码可能访问runner可达服务，Docker并不替代runner级网络隔离。

失败时先看是否仅模型失败、验证失败或已有分支/外部效果，按receipt核对再恢复，避免简单重跑；Session坏历史需显式处理。退出是禁用触发/工作流、撤销secret或外部凭证并按需要处理产物，已发评论、分支和PR不会自动撤销。当前可控试用限定controlled、只读、Session off、无第三方扩展、专用runner，必要时worker-network=false；若调用与结论不可追溯或人工复核不降则停止。

#### 证据与依据

**依据 1 · 源码核查**：[action.yml:29-52](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/action.yml#L29-L52)

模型key、write及task访问默认。

<details>
<summary>查看原文（24行）</summary>

```text
    default: "[]"
  deepseek-api-key:
    description: "DeepSeek API key. Kept by the controller-side credential proxy; never passed to DSH or repository code."
    required: true
  github-token:
    description: "GitHub token used only by the trusted controller."
    required: false
    default: "${{ github.token }}"
  allow-write:
    description: "Allow trusted same-repository task/fix/implement writes after all trust gates pass."
    required: false
    default: "false"
  natural-language-write:
    description: "Allow an explicit natural-language change request to request write access. Ambiguous requests stay read-only. This independent opt-in never replaces allow-write, actor trust, validation or Gateway authorization; legacy commands are unchanged."
    required: false
    default: "false"
  command:
    description: "Optional explicit operation: task, review, diagnose, fix, implement, or auto."
    required: false
    default: "auto"
  task-access:
    description: "Capability requested by an explicit task: read or write. Natural-language mentions use their separate natural-language-write opt-in. Write still requires allow-write and every policy gate."
    required: false
    default: "read"
```

</details>

**依据 2 · 源码核查**：[action.yml:73-88](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/action.yml#L73-L88)

Session默认off与留存。

<details>
<summary>查看原文（16行）</summary>

```text
  session-mode:
    description: "Session opt-in: off, auto, save, or resume. Auto creates or continues the latest successful compatible checkpoint by key, with verified key-scoped concurrency and run-name history. Requires Docker; explicit save/resume remain supported."
    required: false
    default: "off"
  session-key:
    description: "Maintainer-selected logical Session key, 1-64 ASCII letters, digits, dot, underscore or hyphen. Auto keys are case-insensitive, matching GitHub concurrency. Bound to repository, workflow job, task and runtime; never grants authority."
    required: false
    default: ""
  session-source-run-id:
    description: "For session-mode=resume, the explicit successful producer Actions run ID. Only its verified current attempt and latest compatible checkpoint may be restored."
    required: false
    default: ""
  session-retention-days:
    description: "Checkpoint retention, 1-7 days. Saves the complete raw DSH Session, referenced official attachment bytes and a bounded provenance manifest; credentials and Controller authorization are excluded."
    required: false
    default: "3"
```

</details>

**依据 3 · 源码核查**：[package.json:18-21](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/package.json#L18-L21)

Node>=24。

```text
  ],
  "type": "module",
  "engines": {
    "node": ">=24"
```

**依据 4 · 源码核查**：[package.json:64-78](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/package.json#L64-L78)

官方运行时固定rc.2依赖。

<details>
<summary>查看原文（15行）</summary>

```text
    "@deepseek-ai/dsh-app-boot": "0.2.1-rc.2",
    "@deepseek-ai/dsh-atomic-write": "0.2.1-rc.2",
    "@deepseek-ai/dsh-attachment": "0.2.1-rc.2",
    "@deepseek-ai/dsh-attachment-local": "0.2.1-rc.2",
    "@deepseek-ai/dsh-authorization": "0.2.1-rc.2",
    "@deepseek-ai/dsh-base": "0.2.1-rc.2",
    "@deepseek-ai/dsh-cmdline": "0.2.1-rc.2",
    "@deepseek-ai/dsh-compaction": "0.2.1-rc.2",
    "@deepseek-ai/dsh-fs": "0.2.1-rc.2",
    "@deepseek-ai/dsh-fs-sandbox": "0.2.1-rc.2",
    "@deepseek-ai/dsh-headless": "0.2.1-rc.2",
    "@deepseek-ai/dsh-launch-environment": "0.2.1-rc.2",
    "@deepseek-ai/dsh-mcp-client": "0.2.1-rc.2",
    "@deepseek-ai/dsh-output-retention": "0.2.1-rc.2",
    "@deepseek-ai/dsh-permission-presets": "0.2.1-rc.2",
```

</details>

**依据 5 · 作者声明**：[README.md:211-221](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L211-L221)

fork/checkouts、验证与runner网络限制。

<details>
<summary>查看原文（11行）</summary>

```text
- The Agent receives neither the real `GITHUB_TOKEN` nor the real DeepSeek key. Only the Controller can call Action-owned `github.*` mutation APIs; an explicitly configured external GitHub MCP uses its own credential and authority as described below.
- Repository content, diffs, issues, pull requests, comments, logs, model output, and tool output remain untrusted data.
- Fork review uses a `.git`-less, credential-free worker and must check out only the trusted base SHA with `persist-credentials: false`.
- Writes require a trusted same-repository context, authorized actors, Docker, `allow-write: "true"`, non-empty fixed validation commands, and successful validation. Protected-path and Validation Integrity checks still apply.
- Typed `github.*` mutations are exact-ID, entity-bound, deferred until Controller validation, and reconciled with bounded receipts. No arbitrary REST, GraphQL, URL, or credential pass-through exists.
- Validation Integrity provides high-confidence weakening detection plus baseline replay for its supported entrypoints, scripts, test/config weakening, lock/toolchain controls, and known wrappers/interpreters; it is not complete cross-language dependency provenance or a formal proof.
- Validation may use Docker bridge networking. On self-hosted or corporate-network runners, repository validation code may reach runner-accessible network services; use dedicated runners and runner-level segmentation/egress controls.
- An approved Bundle, Plugin, or stdio MCP server is trusted worker code. Controlled ToolRuntime limits model-routed calls; native leaves routing and inventory to DSH. Neither model is a sandbox for extension startup, background work, or direct process I/O, and any bridge/RW capability applies to the whole worker.
- `github.*` uses the Controller GitHub Gateway. A separately configured GitHub MCP uses its own external credential and is outside the Gateway's binding, revalidation, validation, and deferred-write guarantees.

`worker-network` is the Worker public-egress switch: default `true`, explicit `false` for isolation. Plugin network flags do not control it. Read the [Security policy](SECURITY.md) when choosing network policy, write mode, host execution or third-party extensions.
```

</details>

**依据 6 · 源码核查**：[src/write/transaction.ts:172-190](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L172-L190)

保留分支后PR可能另失败。

<details>
<summary>查看原文（19行）</summary>

```text
      target.sha,
    );
  }
  options.control.onBranchConfirmed?.({ branchName: operation.branch, commitSha });
  await assertRemoteBranchHead(client, owner, repo, operation.branch, commitSha);
  await revalidateWriteTarget(options);
  const pull = await createPullRequest(
    client,
    owner,
    repo,
    operation.branch,
    target.branch,
    plan.publication.title,
    plan.publication.body,
    operation.pullRequestMarker,
  );
  return { branch: operation.branch, pullNumber: pull.number, url: pull.url };
}

```

</details>

#### 缺口

- 未量化同任务模型/runner成本、误报、人审和恢复耗时。
  **影响**：不能推荐持续采用或声称便宜、节省固定比例时间。
  **进一步探讨**：设置逐任务预算及失败阈值，用同仓库无私密样本记录总成本和人审修改量，达不到原流程基线即退出。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些已有设计值得迁移，如何提出可证伪的新方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

已有可借鉴的是把模型执行、验证、权限和持久写入分成明确责任面，单写加后置核对并保留未知效果，而不是依靠Agent自述已完成。它依赖Controller独占凭证与强绑定目标，不宜直接迁移到任意扩展直连外部API后仍声称相同保障。成熟事务、幂等与对账模式是基础，不因代码复杂就推断原创突破。

未验证的新方向是为维护者提供逐任务的证据交付包：将源码锚点、真实tool执行方、验证工作区指纹和外部效果receipt串成可回查交付，突出哪些动作绕过Controller、哪些失败需人工核对。相对当前已有状态/receipt的增量是面向接收者按主张核对实际权限面，而不是多一份活动日志；增加存储、内容脱敏和维护契约成本。

最小验证在相同仓库任务与预算下对照现有回复和交付包，注入目标变化、验证失败、MCP外写与丢响应，测维护者识别未决效果的准确性、人审时间、误重试及留存敏感信息。若只能增加材料而不减少误判/返工，或内容暴露超预算，则放弃或只保留关键receipt；本次未实现或测试此方向，不计入当前创新得分。

#### 证据与依据

**依据 1 · 源码核查**：[src/write/transaction.ts:126-149](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/write/transaction.ts#L126-L149)

验证与授权责任面。

<details>
<summary>查看原文（24行）</summary>

```text
  }
}

async function validateWriteTransaction(
  options: RepositoryWriteOptions,
  budget: ValidationDeadline,
): Promise<void> {
  const { validation, control } = options;
  const receipt = await (control.validateWorkspace?.(budget) ??
    validateWorkspaceRevision(
      options.workspace,
      validation,
      budget,
      control.onValidationCommandCount,
    ));
  control.onValidationPassed?.(receipt);
  throwIfCancelled(control.signal);
  await withinValidationDeadline(async () => revalidateWriteTarget(options), budget);
  await withinValidationDeadline(control.revalidateAuthority, budget);
  throwIfCancelled(control.signal);
}

async function persistNewPullRequest(
  options: RepositoryWriteOptions & { readonly plan: NewPullRequestWritePlan },
```

</details>

**依据 2 · 源码核查**：[src/tools/github-gateway-mutation.ts:36-93](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/tools/github-gateway-mutation.ts#L36-L93)

后置核对和未知效果边界。

<details>
<summary>查看原文（58行）</summary>

```text
}

/** Send a mutation once, then reconcile uncertain effects with fresh reads. */
export async function mutateGitHubWithPostcondition<T>(options: {
  readonly invocation: GitHubInvocationDeadline;
  readonly read: (control: GitHubBackendRequestControl) => Promise<T>;
  readonly mutate: (control: GitHubBackendRequestControl, markStarted: () => void) => Promise<void>;
  readonly matches: (value: T) => boolean;
}): Promise<GitHubMutationResult<T>> {
  const read = async (): Promise<T> => await callGitHubApi(options.invocation, options.read);
  const before = await read();
  if (options.matches(before)) {
    return { value: before, attempts: 0, effect: "unchanged", reconciled: true };
  }
  const attempts = 1;
  const mutation = { started: false };
  let mutationAcknowledged = false;
  try {
    await callGitHubApi(options.invocation, async (control) =>
      options.mutate(control, () => {
        mutation.started = true;
      }),
    );
    mutationAcknowledged = true;
    const after = await read();
    if (!options.matches(after)) {
      throw new Error("GitHub mutation postcondition did not match the requested state");
    }
    return { value: after, attempts, effect: "updated", reconciled: true };
  } catch (error: unknown) {
    if (mutationAcknowledged) {
      throw new GitHubMutationExecutionError(attempts, false, "confirmed", {
        cause: error,
      });
    }
    if (!mutation.started || error instanceof GitHubEntityRevalidationError) {
      throw new GitHubMutationExecutionError(attempts, false, "none", { cause: error });
    }
    if (options.invocation.signal?.aborted === true || !isAmbiguousGitHubMutationError(error)) {
      const externalEffect = isAmbiguousGitHubMutationError(error) ? "possible" : "none";
      throw new GitHubMutationExecutionError(attempts, false, externalEffect, {
        cause: error,
      });
    }
    try {
      const value = await read();
      if (options.matches(value)) {
        return { value, attempts, effect: "updated", reconciled: true };
      }
      throw new GitHubMutationExecutionError(attempts, true, "possible", { cause: error });
    } catch (readError: unknown) {
      if (readError instanceof GitHubMutationExecutionError) throw readError;
      throw new GitHubMutationExecutionError(attempts, false, "possible", {
        cause: readError,
      });
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[src/tools/github-authority-gateway.ts:279-300](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/src/tools/github-authority-gateway.ts#L279-L300)

部分失败receipt可用于交付核对。

<details>
<summary>查看原文（22行）</summary>

```text
            ...context,
            timeoutMs: Math.max(0, deadlineMs - Date.now()),
          });
          receipts.push({ result, durationMs: Math.max(0, Date.now() - startedAt) });
          this.pending.delete(callId);
        } catch (error: unknown) {
          const mutationError = error instanceof GitHubMutationExecutionError ? error : undefined;
          const output = scheduledOutputSchema.parse({
            effect: "scheduled",
            target: this.target(),
            attempts: mutationError?.attempts ?? 0,
            reconciled: mutationError?.reconciled ?? false,
            ...(mutationError === undefined || mutationError.externalEffect === "none"
              ? {}
              : { externalEffect: mutationError.externalEffect }),
            operation: call.id,
          });
          receipts.push({
            result: { callId: call.callId, id: call.id, ok: false, output },
            durationMs: Math.max(0, Date.now() - startedAt),
          });
          throw new GitHubToolFlushError(receipts, { cause: error });
```

</details>

**依据 4 · 作者声明**：[README.md:217-219](https://github.com/Lixiaoyiao/DSH-action/blob/497af93119203ca22af4f96f8fe89b3345ad665c/README.md#L217-L219)

共享worker及外部MCP边界要求。

```text
- Validation may use Docker bridge networking. On self-hosted or corporate-network runners, repository validation code may reach runner-accessible network services; use dedicated runners and runner-level segmentation/egress controls.
- An approved Bundle, Plugin, or stdio MCP server is trusted worker code. Controlled ToolRuntime limits model-routed calls; native leaves routing and inventory to DSH. Neither model is a sandbox for extension startup, background work, or direct process I/O, and any bridge/RW capability applies to the whole worker.
- `github.*` uses the Controller GitHub Gateway. A separately configured GitHub MCP uses its own external credential and is outside the Gateway's binding, revalidation, validation, and deferred-write guarantees.
```

#### 缺口

- 交付包是否改善接收者判断并降低总成本未知。
  **影响**：不能当作已确认需求、已实现功能或当前业务贡献。
  **进一步探讨**：预先设人审误判和成本阈值，以上故障矩阵对照，未改善就停止。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
