# OrcaReplay

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a9178ca](https://github.com/Continuum-AI-Corp/OrcaReplay/tree/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84)

<!-- BEGIN META -->
[![GitHub ★ 287](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=287&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Continuum-AI-Corp/OrcaReplay)
<!-- END META -->

> **功能**：外置 CLI 调试工具，记录 Agent 请求、工具和文件变化，支持模型响应回放、检查点分叉与模型比较。

> **亮点**：以外部代理、适配器及文件checkpoint组织同一份可读录制，再用匹配游标承接严格回放和新模型分叉；未匹配与近似匹配明确留痕，能帮助区分录制重现与新调用，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 记录层如何获取模型请求和执行上下文？](#detail-section-11)
  - [Q02 · 精确回放、分叉和模型比较到底固定什么？](#detail-section-12)
  - [Q03 · 捕获和脱敏是否足以允许分享录制？](#detail-section-13)
  - [Q04 · 适合如何试用，成本与新假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Agent故障调试需求的开发者可在隔离项目中记录模型请求、工具结果和文件变化，用于回放和分叉分析，详见 [Q01](#research-q01)。

参照终端日志、现场重新运行Agent和手动切模型。这里区分旧录制的兼容重放与新模型任务，未把相同字节重放当质量、需求或节费证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 录制 | 保存Agent模型交换与派生上下文 | 依赖adapter接线，捕获层可能不完整 |
| 严格模型回放 | 返回已录响应并报告匹配 | Agent工具真实执行，不是沙箱 |
| 分叉 | 从游标继续调用另一模型 | 新调用有费用，外部状态未必冻结 |
| 模型比较 | 顺序分叉并可执行verify | 无verify的pass仅可落到进程退出码 |
| 脱敏写入 | 减少事件中已识别秘密 | 不覆盖所有MCP原件和文件快照 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node及orcareplay CLI | 启动必需 | 提供orca命令和本机代理 | 根monorepo不是DSH插件安装入口 |
| 原Agent及其模型权限/网络 | 真实录制和分叉必需 | 启动原执行循环 | 示例录制不能替代目标Agent接线 |
| Git/文件checkpoint | 文件状态重现时必需 | 快照、恢复与分叉 | 快照失败保持缺口，无快照可走原地或拒绝副本 |
| 可控工具环境 | 回放试用必需 | 避免真实外部副作用 | 模型代理不能封闭所有网络与写入 |
| MCP/TLS适配 | 对应捕获时可选 | 接入额外协议层 | 未接线要明确覆盖不足，敏感原件需单独检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选无秘密、可丢弃项目与受控工具 | Agent入口、快照范围和外部副作用可解释 |
| 录制 | CLI经adapter启动原Agent并保存trace | 核对模型/工具/MCP/文件覆盖与错误 |
| 回放 | 用户选择严格响应回放并检查指标 | unmatched/liveCalls/近似匹配不能隐藏 |
| 分叉比较 | 用户单独承担新模型调用并提供verify | 独立核对交付和成本，不用退出0代替质量 |
| 退出 | 用户停止执行，保留必要只读证据 | 核对外部副作用和整个敏感run目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Agent环境、模型和存储金额未知 | adapter、工具隔离、材料范围核对耗时未知 | 需真实运行才能确认适配 |
| 持续使用 | 录制原模型费、磁盘/工具资源，金额未知 | trace解释、匹配与覆盖复核 | 严格命中模型响应不再请求模型，工具仍运行 |
| 分叉比较 | 新模型和verify资源费用未知 | 配任务验收与解释差异 | 价格估计可空，非全流程账单 |
| 失败/退出 | 外部副作用及敏感材料处置资源未知 | 核对checkpoint、当前文件和秘密残留 | 文件还原不补偿远端业务写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 请求重现 | 录制响应字节与匹配/拒绝路径 | 目标Agent具体适配与所有回合覆盖 |
| 模型分叉 | 游标切live及独立verify入口 | 质量、节费及唯一变量归因 |
| 敏感材料控制 | writer脱敏、统一认证头、权限策略 | 任意秘密与原件均无残留 |

> **思考**：模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以外部代理、适配器及文件checkpoint组织同一份可读录制，再用匹配游标承接严格回放和新模型分叉；未匹配与近似匹配明确留痕，能帮助区分录制重现与新调用，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) 将未匹配/近似匹配显式记录，避免默默把新模型调用当旧录制；[Q03](#research-q03) 把统一脱敏置于writer也值得复用。迁移代价在协议adapter、工具世界和内容寻址文件快照，未脱敏MCP原件尤其不能被“所有事件经过writer”掩盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型回放仍真实执行Agent工具，默认文件恢复也不撤销外部副作用；MCP原件与文件快照还有敏感内容边界。旧字节一致不能证明新模型更好，compare未提供verify时的pass也可能只代表进程退出成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可丢弃、无真实秘密的项目做严格回放，只把匹配视为协议重现；分叉需另看真实任务质量与费用。生产工具或外部写入不明时退回只读trace；分享前检查MCP、文件快照和所有附属原件，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码的录制入口、代理回放、分叉比较和落盘脱敏边界。建议隔离、无真实秘密且工具副作用可控的调试试用；未执行任何目标录制、Agent、回放或TLS拦截，未来覆盖清单未验证。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、packages/cli/package.json、packages/cli/src/commands/compare.ts、packages/cli/src/commands/record.ts、packages/cli/src/commands/replay.ts、packages/cli/src/mcp.ts、packages/cli/src/snapshot.ts、packages/core/src/redaction.ts、packages/core/src/writer.ts、packages/proxy/src/server.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根组件inventory作统计，人工抽读录制启动、代理匹配、回放spawn、文件恢复决策、compare验证、writer/redaction与MCP保存；未逐个核查全部Agent适配器、TLS实现、快照restore所有分支或价格数据。
- 下一步：后续只在隔离业务环境，分别验证旧trace匹配、同模型重复、新模型任务和外部状态变化；记录独立合格率、遗漏/返工、工具副作用、费用与人工时间。合成秘密检测覆盖整个run目录，不把只读源码或作者演示当本轮实测。

**分析版本**

- **仓库**：[Continuum-AI-Corp/OrcaReplay](https://github.com/Continuum-AI-Corp/OrcaReplay)
- **版本号**：0.5.0（[固定提交 a9178ca](https://github.com/Continuum-AI-Corp/OrcaReplay/tree/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索逐次列明模型、工具、文件与外部状态冻结范围的回放覆盖清单，把verify和覆盖共同作为模型比较资格。它尚未实现验证，同模型重复/跨模型/外部状态变化对照仍不能解释差异时应否定，见 [Q04](#research-q04)。

后续只在隔离业务环境，分别验证旧trace匹配、同模型重复、新模型任务和外部状态变化；记录独立合格率、遗漏/返工、工具副作用、费用与人工时间。合成秘密检测覆盖整个run目录，不把只读源码或作者演示当本轮实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 76 | 15758 | — | — | 184683 |
| .mjs | source | 15 | 3632 | 2536 | 888 | — |
| .md | example | 1 | 50 | — | — | 450 |
| .ts | source | 124 | 33939 | 21019 | 10887 | — |
| .ts | test | 143 | 43602 | 32935 | 7115 | — |
| .js | source | 1 | 41 | 30 | 8 | — |
| .js | test | 1 | 25 | 16 | 4 | — |
| .mjs | example | 12 | 774 | 553 | 163 | — |
| .md | test | 2 | 319 | — | — | 3378 |
| .mjs | test | 5 | 1006 | 711 | 252 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Continuum-AI-Corp/OrcaReplay/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外置录制回放是否支持故障重现及模型分叉，并明确工具副作用、比较资格和敏感材料边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 记录层如何获取模型请求和执行上下文？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

OrcaReplay是外部CLI调试工具的多包工程，npm入口orcareplay提供orca命令，不是DSH原生插件。目标是已有Agent故障后需要复查模型请求、工具结果与文件变化的开发者；合格结果应是可定位原始记录、解释回放匹配和失败边界，不能只看到时间线就认定故障原因。与只保存终端日志相比，它在模型API代理、shell、MCP和文件快照等层收集更多上下文；底层Agent继续自行执行工具，并未由本工具替代自主循环。

record创建record模式proxy，上游请求回调进入串行写队列，派生工具事件并尝试文件快照。adapter.prepare取得代理URL、cwd及原环境，按已启用层改写PATH、Python路径或MCP配置，再真实spawn原Agent。MCP没有可用命令行配置接线时明确not_wired，这说明支持表不能代替具体适配。录制需要Agent、模型权限、网络和本地存储；TLS拦截是显式可选路径，本文没有启用。快照碰撞最多重试后返回ok=false而不终止Agent，故录制成功不等于每回合有完整文件checkpoint。

#### 证据与依据

**依据 1 · 源码核查**：[packages/cli/package.json:1-12](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/package.json#L1-L12)

独立npm CLI身份。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "orcareplay",
  "version": "0.5.0",
  "mcpName": "io.github.Continuum-AI-Corp/orcareplay",
  "type": "module",
  "license": "Apache-2.0",
  "description": "Record, replay and fork debugger for AI agents",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "orca": "./dist/cli.js",
    "orcareplay": "./dist/cli.js"
```

</details>

**依据 2 · 源码核查**：[packages/cli/src/commands/record.ts:342-379](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/record.ts#L342-L379)

proxy到写队列和文件快照。

<details>
<summary>查看原文（38行）</summary>

```text
  const proxy = await createProxy({
    mode: 'record',
    upstream: plan.upstream,
    upstreamHeaders: plan.headers,
    upstreamHeadersOrigin: plan.headersOrigin,
    retrievalStore,
    onExchange: (exchange: RecordedExchange) => {
      modelExchanges += 1;
      if (exchange.status >= 400) {
        erroredExchanges += 1;
        errorStatuses.set(exchange.status, (errorStatuses.get(exchange.status) ?? 0) + 1);
      }
      writes.push(() => persist(exchange));
    },
    // A POST on a path no dialect claims is forwarded rather than refused, and lands in the trace
    // as the same `net.*` pair unrecognised TLS traffic does. Orca holds the bytes but not the
    // meaning, so it is evidence, not a replayable turn.
    onNetExchange: (exchange: NetExchange) => {
      // The same warning interception has always printed, on the route most runs actually take.
      // A harness redirected by a base-URL variable posts to the proxy in plaintext, so nothing
      // it sent on an unclaimed path was ever reported — and a retrieval pipeline is made of
      // those. See {@link UnclaimedPaths}.
      unclaimed.note(out, exchange);
      writes.push(() => persistNetExchange(writer, turn, exchange));
    },
    ...tls.proxyOptions,
  });

  async function persist(exchange: RecordedExchange): Promise<void> {
    turn += 1;
    turnStartedAt.push({ turn, at: Date.now() });
    await appendDerivedEvents(writer, deriver, exchange, turn, (derived) => {
      if (derived.type === 'tool.call' && isCommandTool(derived.attrs['input'])) {
        commandToolCalls += 1;
      }
    });

    if (fs) await appendSnapshot(fs, writer, out, turn);
```

</details>

**依据 3 · 源码核查**：[packages/cli/src/commands/record.ts:444-492](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/record.ts#L444-L492)

adapter与shell/MCP/TLS环境接线。

<details>
<summary>查看原文（49行）</summary>

```text
  const { launch, sessionBefore } = await (async () => {
    try {
      const ctx: RecordContext = {
        runId: writer.runId,
        cwd,
        proxyUrl: proxy.url,
        runDir: writer.runDir,
        userArgs: args.passthrough,
        env: process.env,
      };
      const prepared = await adapter.prepare(ctx);

      // Listed before the agent starts, so the file it writes can be told from the ones already
      // there. The harness's transcript is the only record of what the person typed; without it an
      // interactive run is captured but not replayable.
      const before = await snapshotDir(adapter.session?.dir(cwd, process.env));

      if (shell) {
        prepared.env.PATH = `${shell.dir}${delimiter}${process.env.PATH ?? ''}`;
      }
      if (agentSpans) {
        // Both, or neither works: PYTHONPATH is how Python finds the bootstrap, and the variable is
        // what tells the bootstrap this is a recording rather than an ordinary Python process.
        prepared.env.PYTHONPATH = pythonPathWith(
          agentSpans.pythonPath,
          process.env.PYTHONPATH,
          delimiter,
        );
        prepared.env[SPANS_ENV] = agentSpans.spansPath;
      }
      if (mcp) {
        pointAtMcpConfig(prepared.env, mcp.configPath);
        // The variables above are belt and braces for a harness orca has not met. What actually
        // reaches Claude Code is this: it takes the path on the command line and reads no
        // environment variable for it, so without this the instrumented config was written and
        // never opened.
        const mcpArgs = adapter.mcpConfigArgs?.(mcp.configPath);
        if (mcpArgs !== undefined) prepared.args = [...mcpArgs, ...prepared.args];
        else
          out.warn('mcp.not_wired', {
            adapter: adapter.id,
            cause: `${adapter.id} has no command-line form for an MCP config, and reads none of the variables orca sets`,
            effect:
              'the instrumented config exists but the agent will not load it, so no MCP frames will be captured',
          });
      }

      if (proxy.tls) {
        await trustRunCa(writer, proxy.tls, proxy.url, prepared.env, out);
```

</details>

**依据 4 · 源码核查**：[packages/cli/src/commands/record.ts:899-919](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/record.ts#L899-L919)

实际启动原Agent。

<details>
<summary>查看原文（21行）</summary>

```text
  env: NodeJS.ProcessEnv,
  cwd: string,
  quietStdout = false,
): Promise<number> {
  // Resolved the way detection resolves, so a launcher never reports ENOENT for an agent that
  // `orca doctor` just called present.
  const target = await resolveLaunch(command, argv);
  return new Promise((resolve, reject) => {
    const child = spawn(target.file, target.args, {
      env,
      cwd,
      shell: target.shell,
      stdio: quietStdout ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    });
    child.stdout?.pipe(process.stderr);
    // Forward interrupts so Ctrl-C reaches the agent rather than orphaning it behind the proxy.
    const forward = (signal: NodeJS.Signals) => () => child.kill(signal);
    const onInt = forward('SIGINT');
    const onTerm = forward('SIGTERM');
    process.on('SIGINT', onInt);
    process.on('SIGTERM', onTerm);
```

</details>

**依据 5 · 源码核查**：[packages/cli/src/snapshot.ts:53-79](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/snapshot.ts#L53-L79)

快照重试和保留失败结果。

<details>
<summary>查看原文（27行）</summary>

```text
export async function snapshotWithRetry(
  source: SnapshotSource,
  turn: number,
  options: RetryOptions = {},
): Promise<RetryOutcome> {
  const maxAttempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 25;

  let attempts = 0;
  let lastError = '';

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      return { ok: true, snapshot: await source.snapshotTurn(turn), attempts };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      // A permanent failure — no git, not a repository — will not fix itself, and retrying it
      // just makes the agent wait.
      if (!isTransient(lastError)) break;
      if (attempts < maxAttempts && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempts));
      }
    }
  }

  return { ok: false, attempts, error: lastError };
```

</details>

#### 缺口

- 各Agent适配器、TLS和完整capture层未逐个执行验收。
  **影响**：不能声称所有支持表对象已实测可录。
  **进一步探讨**：对实际使用Agent在独立项目核对代理流量、工具、MCP接线和checkpoint覆盖。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 精确回放、分叉和模型比较到底固定什么？

**研究主题**：贡献与相对优势、功能与机制、缺陷与关键质疑

#### 完整回答

模型回放以录制的请求/响应字节为依据。replay从blob读原响应，代理matcher命中后把rawResponse发回并分别累计exact与inexact；不匹配在严格replay下返回400并停止，不会凭空补模型回答。loose或hybrid可走live并记录major divergence，fork游标之后才切到新模型。因此“精确”要同时看匹配层级、unmatched和liveCalls，而不是仅Agent退出码。

关键边界是回放会真实spawn Agent并执行其工具，模型代理不等于系统网络或写入沙箱。README也明确curl/MCP等直连网络在保证外。默认同路径回放会先保存当前树、恢复录制树并在finally还原；无快照可退到in-place，显式副本模式没有快照则拒绝。这些是文件恢复设计，不撤销数据库、邮件或远程命令等外部副作用；本文没有创建任何副本或执行回放。

compare固定具体runId和checkpoint，顺序运行多个分叉，若提供verify则在分叉目录执行该命令，以其退出码为判据；没有verify时仍会回落Agent退出码，不能把pass当交付正确。原录制重放证明协议兼容/重现，不证明新模型质量或节省；新模型继续执行才产生新的结果，而且外部服务时间、随机性和工具状态未必被固定，不能完整接受作者“唯一变量是模型”的强归因。

#### 证据与依据

**依据 1 · 源码核查**：[packages/cli/src/commands/replay.ts:80-119](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/replay.ts#L80-L119)

原始请求和响应来自录制字节。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * Rebuild the recorded exchanges from a trace.
 *
 * The raw request and response bodies are the authoritative record — they are what makes exact
 * replay exact — so they come back verbatim from the blob store rather than being regenerated
 * from the canonical form.
 */
export async function loadExchanges(reader: TraceReader): Promise<RecordedExchange[]> {
  const events = await reader.events();
  const requests = events.filter((e) => e.type === 'model.request');
  const responses = events.filter((e) => e.type === 'model.response');

  const dialects = defaultDialects();
  const exchanges: RecordedExchange[] = [];
  for (const [i, req] of requests.entries()) {
    const res = responses[i];
    const rawRequest = await rawBodyOf(reader, req);
    const rawResponse = res ? await rawBodyOf(reader, res) : '{}';
    const dialectId = String(req.attrs?.dialect ?? 'anthropic');
    const dialect = dialects.find((d) => d.id === dialectId) ?? dialects[0]!;
    exchanges.push({
      seq: req.seq,
      dialect: dialectId,
      path: String(
        req.attrs?.path ??
          (dialectId === 'anthropic'
            ? '/v1/messages'
            : dialectId === 'codex'
              ? '/backend-api/codex/responses'
              : '/v1/chat/completions'),
      ),
      rawRequest,
      rawResponse,
      status: Number(res?.attrs?.status ?? 200),
      streamed: Boolean(res?.attrs?.streamed ?? false),
      // The stored body is the provider's wire format, not the canonical form. Canonicalizing it
      // with the same translator the proxy uses at replay time is what makes rung-1 matching
      // possible at all — parsing it directly makes every request look like a major divergence.
      canonicalRequest: dialect.toCanonicalRequest(JSON.parse(rawRequest)),
      durationMs: Number(res?.attrs?.duration_ms ?? 0),
```

</details>

**依据 2 · 源码核查**：[packages/proxy/src/server.ts:1840-1859](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/proxy/src/server.ts#L1840-L1859)

游标、匹配层级与原响应。

<details>
<summary>查看原文（20行）</summary>

```text
    const beyondFork =
      options.mode === 'hybrid' && matcher.cursor >= (options.forkAt ?? replayable.length);

    if (!beyondFork) {
      const result = matcher.match(canonical);
      if (result.matched) {
        const exchange = replayable[result.index]!;
        if (result.reordered) stats.reordered += 1;
        if (result.divergence) {
          stats.matchedInexact += 1;
          stats.divergences += 1;
          options.onDivergence?.({ ...result.divergence, seq: exchange.seq });
        } else {
          stats.matchedExact += 1;
        }
        res.writeHead(exchange.status, {
          'content-type': exchange.streamed ? 'text/event-stream' : 'application/json',
        });
        res.end(exchange.rawResponse);
        return;
```

</details>

**依据 3 · 源码核查**：[packages/proxy/src/server.ts:1862-1906](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/proxy/src/server.ts#L1862-L1906)

未匹配、loose/live与严格拒绝。

<details>
<summary>查看原文（45行）</summary>

```text
      stats.unmatched += 1;

      // Hybrid mode is *supposed* to continue live here — that is what forking means — but spec §4
      // says replay must not silently approximate, and every inexact match is an event in the
      // trace. Without this a fork could start diverging below its own fork point and every
      // artifact it produced would look clean. Going live is the right behaviour; being quiet
      // about it is not.
      if (options.mode === 'hybrid' || options.loose) {
        stats.divergences += 1;
        options.onDivergence?.({
          level: 'major',
          rung: 4,
          distance: -1,
          detail: result.reason ?? 'request does not match the recording; served live instead',
          seq: replayable[result.index]?.seq ?? -1,
        });
      }

      if (!options.loose && options.mode === 'replay') {
        // Halt loudly. Inventing a reply here would make every downstream conclusion worthless.
        const reason = result.reason ?? 'request does not match the recording';
        options.onUnmatched?.({
          seq: replayable[result.index]?.seq ?? -1,
          index: result.index,
          reason,
        });

        // 400, emphatically not 409. Every mainstream client retries 408/409/429/5xx by default,
        // so a 409 halt is re-sent until the retry budget is gone — the operator gets a stalled
        // terminal and no reason, which is strictly worse than a wrong answer because it looks
        // like a hang in orca rather than a mismatch in the recording. 400 is terminal everywhere.
        //
        // The envelope is the provider's own error shape for the same reason: clients read
        // `error.message` and print it, so this sentence is what actually reaches the human.
        json(res, 400, {
          type: 'error',
          error: {
            type: 'invalid_request_error',
            message:
              `orca: replay halted — ${reason}. ` +
              'Re-run with `orca replay <run> --loose` to continue live from this point, ' +
              'or `orca show <run>` to see what was recorded.',
          },
        });
        return;
```

</details>

**依据 4 · 源码核查**：[packages/cli/src/commands/replay.ts:1300-1338](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/replay.ts#L1300-L1338)

副本/原地与缺快照处理。

<details>
<summary>查看原文（39行）</summary>

```text
async function replayWorkspace(args: ParsedArgs, out: Output, ctx: Ctx): Promise<Workspace> {
  const artifacts = adapterArtifacts(ctx);
  // `--worktree` IS A PROMISE — "never touches your files" — so once it is asked for, nothing
  // below may fall back to the operator's directory. Two branches did, both ahead of the one that
  // reads it: `--in-place` given beside it won without a word, and a run with no snapshot took the
  // in-place warning and ran the agent over the working tree anyway. Measured on a run recorded
  // with --no-fs: `orca replay last --worktree` wrote the recorded edit over uncommitted work.
  const wantsWorktree = args.bool('worktree');
  if (wantsWorktree && args.bool('in-place')) {
    throw new Error(
      '--worktree and --in-place cannot both apply: one replays in a scratch copy and never ' +
        'touches your files, the other replays in them. Give one.',
    );
  }
  if (args.bool('in-place')) {
    warnArtifactsKept(artifacts, out);
    return { dir: ctx.cwd, release: noRelease, restored: false };
  }

  const initial = deriveCheckpoints(ctx.events).find((c) => c.fsTree !== undefined);
  if (!initial?.fsTree) {
    // Refused rather than run in an empty directory: an empty directory is not a copy of anything
    // the run started from, and a replay that halts at the first file it reads is no way to learn
    // that. `--in-place` is the honest version of what this used to do, and says what it does.
    if (wantsWorktree) {
      out.warn('replay.no_snapshot', {
        why: 'this run was recorded without filesystem capture, so it holds no workspace to copy',
        next: `orca replay ${ctx.manifest.run_id} --in-place   # against this directory as it stands`,
      });
      throw new Error(
        'no workspace snapshot to copy — see replay.no_snapshot; --in-place replays without it',
      );
    }
    out.warn('replay.in-place', {
      why: 'this run has no filesystem snapshot to restore',
      note: 'recorded with --no-fs; a file the run read may since have changed',
    });
    warnArtifactsKept(artifacts, out);
    return { dir: ctx.cwd, release: noRelease, restored: false };
```

</details>

**依据 5 · 源码核查**：[packages/cli/src/commands/replay.ts:2233-2250](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/replay.ts#L2233-L2250)

回放启动真实Agent。

<details>
<summary>查看原文（18行）</summary>

```text
): Promise<number> {
  // Same resolution as record and as detection; see resolveLaunch.
  const target = await resolveLaunch(command, argv);
  return new Promise((resolve, reject) => {
    const child = spawn(target.file, target.args, {
      env,
      cwd,
      shell: target.shell,
      stdio:
        agentStdout === 'inherit'
          ? 'inherit'
          : ['inherit', agentStdout === 'ignore' ? 'ignore' : 'pipe', 'inherit'],
    });
    if (agentStdout === 'stderr') child.stdout?.pipe(process.stderr);
    child.on('error', (err) =>
      reject(new Error(`could not launch "${command}": ${String(err)}\n  is it on your PATH?`)),
    );
    child.on('close', (code) => resolve(code ?? 0));
```

</details>

**依据 6 · 源码核查**：[packages/cli/src/commands/compare.ts:88-141](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/compare.ts#L88-L141)

固定run顺序分叉和verify判据。

<details>
<summary>查看原文（54行）</summary>

```text
  const rows: CompareRow[] = [];
  // Sequential rather than parallel: each fork spawns a real agent against a real worktree, and
  // running four of those concurrently on one machine measures the machine, not the models.
  for (const model of models) {
    const startedAt = Date.now();
    try {
      const forkArgs = parseArgs([
        'replay',
        // The concrete run id, never the caller's selector. "last" is re-resolved on every fork,
        // so after the first branch it would point at the child we just created — which has no
        // checkpoints — and every later model would fail for a reason that is not about the model.
        runId,
        '--from',
        String(from),
        '--model',
        model,
        ...(args.bool('loose') ? ['--loose'] : []),
        // The same silent-no-op this list already warns about twice. `--no-fs` is what a run
        // fetched with `orca pull` needs — it has no snapshots to restore from — and dropping it
        // here would accept the flag and then fork with the restore still on, which is the one
        // thing it was passed to prevent.
        ...(args.bool('fs', true) ? [] : ['--no-fs']),
        // Every fork this makes runs a live agent, so interception has to reach them: accepting
        // the flag here and dropping it before the fork is exactly the silent-no-op the flag was
        // fixed for one layer up.
        ...(args.bool('tls-intercept') ? ['--tls-intercept'] : []),
        // Same reasoning, and the same silent-no-op if dropped: every fork launches a live agent,
        // and under --json orca's stdout is the result document. A fork that inherits it prints
        // the agent's output into the middle of the JSON.
        ...(args.bool('json') ? ['--json'] : []),
        ...(args.list('tls-hosts').flatMap((h) => ['--tls-hosts', h]) as string[]),
        ...upstreamFlags(args),
      ]);
      const result = await replayCommand(forkArgs, out, cwd);

      // The agent exiting 0 only means it did not crash. "Did the task actually get done" needs
      // a command that answers it — otherwise the verdict column is a number nobody should act on.
      const verify = args.str('verify');
      const verifyExitCode =
        verify && result.worktree ? await runVerify(verify, result.worktree) : undefined;
      const failed = verifyExitCode === undefined ? result.exitCode !== 0 : verifyExitCode !== 0;
      const usage = result.forkRunId
        ? await usageOf(cwd, result.forkRunId)
        : { input: 0, output: 0 };
      const money = priceFor({ input_tokens: usage.input, output_tokens: usage.output }, model);
      rows.push({
        model,
        verdict: failed ? 'fail' : 'pass',
        verifyExitCode,
        exitCode: result.exitCode,
        divergences: result.divergences,
        inputTokens: usage.input,
        outputTokens: usage.output,
        cost: money ? money.amount : null,
```

</details>

**依据 7 · 作者声明**：[README.md:108-115](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/README.md#L108-L115)

作者明确模型代理不是工具沙箱。

```text
Model APIs are stateless, so on every turn an agent resends the entire conversation — including the
previous turn's tool results. **A proxy in front of the model therefore sees the whole loop**: each
request, each streamed response, every tool call the model emitted, and every tool result the
harness produced. That one property is what the tool is built on, and it is why **OrcaReplay does
not patch your agent** — it stands up a local proxy, sets two environment variables, and gets out of
the way.

**What "egress blocked" means, exactly.** On replay the proxy refuses to forward anything it cannot serve from the trace, so no model is called and no tokens are spent — that run prints `egress=blocked`. `--loose` lifts it deliberately: an unmatched request is then answered by the provider and recorded as a major divergence, and the same line reads `egress=live-on-unmatched`. A replay still *executes the recorded tool calls for real*, and a tool that opens its own socket — a shell command running `curl`, an MCP server fetching something — is outside the guarantee either way. By default it never reaches the proxy and goes to the network as usual. Under `--tls-intercept` it does reach the proxy, because that sets `HTTPS_PROXY` for the whole child: a host off the intercept list is tunnelled through untouched, though its hostname, port and byte counts still land in the trace, and a host on the list is refused there like any other unmatched call. Replay is not a sandbox; if you need one, run it inside one.
```

#### 缺口

- 未检查所有外部状态与Agent随机源能否被固定。
  **影响**：不能将单次分叉差异完全归因模型，也不保证回放无副作用。
  **进一步探讨**：在隔离业务环境固定工具/服务响应，重复同模型和跨模型任务，分别报告重放一致性与新任务质量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 捕获和脱敏是否足以允许分享录制？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能直接把run目录当可公开附件。核心writer对大payload先脱敏再存blob，随后对整个事件序列化文本再次脱敏、校验后追加；redaction模块用环境allowlist和统一敏感请求/响应头名，能解释防护具体位于写路径。这个职责集中化值得借鉴，但模式识别不是所有秘密或业务敏感内容的语义分类。

仍有绕开writer的必要原件。MCP配置读取后以原始字节写mcp-source.json，MCP帧保留用于按请求回答，SECURITY明确mcp-frames不脱敏。文件快照对象也不能仅靠重写事件清理，作者说明scrub只搜索并报告这些对象，可选择放弃fs。即使权限0600，拥有该文件的用户分享或复制仍可能泄露内容；默认环境白名单还包括HOME、USER和PATH等机器上下文。另录制把认证转发上游以维持原Agent运行，脱敏只是落盘处理，不使原请求停止向其本来上游发送。实际采用需审阅整个目录、MCP和文件快照范围，不能以“红acted事件无匹配”作为全目录清白证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/src/writer.ts:265-291](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/core/src/writer.ts#L265-L291)

统一写路径脱敏和校验。

<details>
<summary>查看原文（27行）</summary>

```text
  async #write(ts: string, mono_us: number, turn: number, init: EventInit): Promise<TraceEvent> {
    const seq = this.#seq;
    const removed: string[] = [];
    let payload = init.payload;
    if (payload !== undefined) {
      const json = JSON.stringify(payload);
      if (Buffer.byteLength(json) > INLINE_PAYLOAD_LIMIT) {
        const scrubbed = this.#redactor.redactString(json, `event:${seq}:payload`);
        removed.push(...scrubbed.hits.map((h) => h.identifier));
        payload = await this.#blobs.put(scrubbed.value, 'application/json');
      }
    }

    const event: TraceEvent = { seq, ts, mono_us, turn, type: init.type, actor: init.actor };
    if (init.causes !== undefined) event.causes = init.causes;
    if (init.attrs !== undefined) event.attrs = init.attrs;
    if (payload !== undefined) event.payload = payload;

    // Placeholders contain no quote or backslash, so scrubbing the serialized line cannot make it
    // unparseable — and if it ever did, the parse throws and the event is never written.
    const scrubbed = this.#redactor.redactString(JSON.stringify(event), `event:${seq}`);
    removed.push(...scrubbed.hits.map((h) => h.identifier));
    const out = JSON.parse(scrubbed.value) as TraceEvent;
    if (removed.length > 0) out.redacted = [...new Set(removed)];

    assertEvent(out);
    await this.#handle.write(`${JSON.stringify(out)}\n`);
```

</details>

**依据 2 · 源码核查**：[packages/core/src/redaction.ts:16-52](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/core/src/redaction.ts#L16-L52)

环境白名单及统一认证头。

<details>
<summary>查看原文（37行）</summary>

```text
/** Environment capture is allowlist-only (spec §5). Everything else is denied. */
export const DEFAULT_ENV_ALLOWLIST = [
  'TERM',
  'LANG',
  'LC_ALL',
  'PATH',
  'HOME',
  'SHELL',
  'TZ',
  'USER',
  'PWD',
];

/**
 * Request headers whose value is never written, whatever it looks like (spec §5).
 *
 * The single list. There were three — here, in the recording proxy, and in the TLS interceptor —
 * and they had drifted: `api-key` and `x-goog-api-key` were known to exactly one of them, so the
 * same Azure or Google credential was stripped on the intercepted path and written on the recorded
 * one. Nothing about a header set that has to stay identical in three places will keep it that
 * way, so it is defined once and imported.
 */
export const AUTH_REQUEST_HEADERS = [
  'authorization',
  'x-api-key',
  // Azure OpenAI sends the key under its own name, and Google under another.
  'api-key',
  'x-goog-api-key',
  'cookie',
  'proxy-authorization',
];

/** A response can hand out credentials too. `set-cookie` is a session, not metadata. */
export const AUTH_RESPONSE_HEADERS = ['set-cookie'];

/** Every header name whose value is never written, in either direction. */
export const AUTH_HEADERS = [...AUTH_REQUEST_HEADERS, ...AUTH_RESPONSE_HEADERS];
```

</details>

**依据 3 · 源码核查**：[packages/cli/src/mcp.ts:240-267](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/mcp.ts#L240-L267)

原始MCP配置直接保存与帧路径。

<details>
<summary>查看原文（28行）</summary>

```text
  const raw = await readFile(opts.sourceConfigPath, 'utf8').catch(() => undefined);
  if (raw === undefined) {
    opts.out.warn('mcp.config_unreadable', { path: opts.sourceConfigPath });
    return undefined;
  }
  // Kept before it is parsed, so a later run reads back what this run was handed — byte for byte,
  // key order and all. See {@link MCP_SOURCE_FILENAME} for why a path was not good enough.
  await writeFile(join(opts.runDir, MCP_SOURCE_FILENAME), raw, { mode: 0o600 }).catch(
    () => undefined,
  );

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    opts.out.warn('mcp.config_unparseable', { path: opts.sourceConfigPath, error: String(err) });
    return undefined;
  }

  const framesPath = join(opts.runDir, 'mcp-frames.jsonl');
  const shim = resolveShimEntry();
  // Recording and replay are the same rewrite with a different flag: `--out` writes what the
  // servers say, `--replay` says it back. Both keep `--out` so a replay records its own frames and
  // is itself a run that can be read.
  const shimArgs =
    opts.replayFrames === undefined
      ? [shim, '--out', framesPath]
      : [shim, '--out', framesPath, '--replay', opts.replayFrames];
```

</details>

**依据 4 · 作者声明**：[SECURITY.md:58-70](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/SECURITY.md#L58-L70)

作者说明帧未脱敏且录制敏感。

<details>
<summary>查看原文（13行）</summary>

```text
- Where something *does* read such a file later, it stays. `mcp-frames.jsonl` holds the recorded
  JSON-RPC a replay answers from, so it cannot be deleted and must not be rewritten: the frames are
  keyed on the request, and editing one makes the replay serve a different recorded response
  instead of failing. It is not redacted. Treat a run directory as sensitive material, not just the
  trace inside it.
- The recorder opens no network connection of its own and sends no telemetry. It passes through
  only what your agent was already sending.
- The recording proxy binds `127.0.0.1`, and the local viewer binds loopback only — it refuses any
  other host outright rather than warning about it.
- Trace content is treated as untrusted input by the viewer and is escaped before rendering.

**What we do not promise:** redaction is best-effort mitigation, not a guarantee. Treat a trace as
sensitive material.
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:76-93](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/SECURITY.md#L76-L93)

作者说明scrub与fs不可改写边界。

<details>
<summary>查看原文（18行）</summary>

```text
`orca scrub` is the second pass, for what the write path missed and for the internal hostname that
is only sensitive in your organisation. It rewrites `events.jsonl`, `manifest.json` and every text
blob in place, then refreshes the integrity digest. Two things it cannot do, and says out loud
rather than papering over:

- An event line whose scrubbed form would no longer parse or validate is **put back unchanged**.
  Scrub warns per event (`scrub_reverted`) that what it matched is still on disk, and does not
  count it as removed. A scrubber that under-reports is disappointing; one that hands you a false
  all-clear is worse than no scrubber.
- A run directory holds more than the trace, and scrub rewrites only the trace. Everything else in
  it — `mcp-frames.jsonl`, the rewritten MCP config, anything a later version adds — is **searched
  and named** rather than rewritten, and finding something there suppresses the all-clear. So
  "nothing matched" is an answer about the whole directory, not only about the part scrub edits.
- The shadow filesystem store (`<run>/fs`) **cannot be rewritten**. Its objects are addressed by the
  hash of their own contents, so editing one changes its id, every tree naming it, and every
  `fs.snapshot` event naming those trees. Scrub searches the store instead and reports how many
  objects still hold the material; `--drop-fs` deletes the store outright for anyone who would
  rather lose the snapshots than keep what is in them.
```

</details>

#### 缺口

- 未做含组织特定秘密、非标准密钥和MCP内容的脱敏实验。
  **影响**：不能给出分享安全保证。
  **进一步探讨**：用合成秘密扫描完整run目录和快照，核对命中、漏报及回放是否仍有意义。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合如何试用，成本与新假设是什么？

**研究主题**：采用判断、效果与总成本、新假设与验证、贡献与相对优势

#### 完整回答

建议已有Agent调试需求且能隔离工具副作用的开发者，用不含真实凭据的复制项目先试记录与严格回放，检查matchedExact、divergences、unmatched、liveCalls和文件覆盖。相较反复现场重跑，它能复用已见模型响应，定位变化来自录制还是新调用；这种可重复材料价值由源码支持，不等于故障根因自动查明。重要项目、生产账号或带真实MCP凭据的环境不适合直接按README快速命令回放。

首次需适配Agent入口、Git/文件范围、存储和权限；录制会消耗原Agent模型费用，严格已匹配模型响应可避免再次请求该模型，但工具、CPU、磁盘和网络成本继续存在。分叉/compare又产生新模型费用，priceFor只估算支持模型价格且可为空，未计全部工具和人工复核。退出需保留必要调试证据并处理敏感trace和临时产物；完整删除与外部副作用回退未做运行核验。

可推导未验证假设：给每个回放出具“已冻结的模型/工具/文件/外部状态”覆盖清单，并将verify结果和这些缺口共同作为比较资格，可能减少把协议重现误读为模型性能。它增加适配与标注成本；以同模型重复、替换模型和变更外部服务三组任务测试，若清单仍无法解释差异或只降低可用样本却不减少错误归因，则停止。

#### 证据与依据

**依据 1 · 源码核查**：[packages/proxy/src/server.ts:1843-1859](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/proxy/src/server.ts#L1843-L1859)

可复用已录响应与匹配指标。

<details>
<summary>查看原文（17行）</summary>

```text
    if (!beyondFork) {
      const result = matcher.match(canonical);
      if (result.matched) {
        const exchange = replayable[result.index]!;
        if (result.reordered) stats.reordered += 1;
        if (result.divergence) {
          stats.matchedInexact += 1;
          stats.divergences += 1;
          options.onDivergence?.({ ...result.divergence, seq: exchange.seq });
        } else {
          stats.matchedExact += 1;
        }
        res.writeHead(exchange.status, {
          'content-type': exchange.streamed ? 'text/event-stream' : 'application/json',
        });
        res.end(exchange.rawResponse);
        return;
```

</details>

**依据 2 · 源码核查**：[packages/cli/src/commands/compare.ts:123-141](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/commands/compare.ts#L123-L141)

verify、Token与可空价格估计。

<details>
<summary>查看原文（19行）</summary>

```text
      // The agent exiting 0 only means it did not crash. "Did the task actually get done" needs
      // a command that answers it — otherwise the verdict column is a number nobody should act on.
      const verify = args.str('verify');
      const verifyExitCode =
        verify && result.worktree ? await runVerify(verify, result.worktree) : undefined;
      const failed = verifyExitCode === undefined ? result.exitCode !== 0 : verifyExitCode !== 0;
      const usage = result.forkRunId
        ? await usageOf(cwd, result.forkRunId)
        : { input: 0, output: 0 };
      const money = priceFor({ input_tokens: usage.input, output_tokens: usage.output }, model);
      rows.push({
        model,
        verdict: failed ? 'fail' : 'pass',
        verifyExitCode,
        exitCode: result.exitCode,
        divergences: result.divergences,
        inputTokens: usage.input,
        outputTokens: usage.output,
        cost: money ? money.amount : null,
```

</details>

**依据 3 · 源码核查**：[packages/cli/src/snapshot.ts:53-79](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/packages/cli/src/snapshot.ts#L53-L79)

覆盖清单须承认checkpoint失败。

<details>
<summary>查看原文（27行）</summary>

```text
export async function snapshotWithRetry(
  source: SnapshotSource,
  turn: number,
  options: RetryOptions = {},
): Promise<RetryOutcome> {
  const maxAttempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 25;

  let attempts = 0;
  let lastError = '';

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      return { ok: true, snapshot: await source.snapshotTurn(turn), attempts };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      // A permanent failure — no git, not a repository — will not fix itself, and retrying it
      // just makes the agent wait.
      if (!isTransient(lastError)) break;
      if (attempts < maxAttempts && delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempts));
      }
    }
  }

  return { ok: false, attempts, error: lastError };
```

</details>

**依据 4 · 作者声明**：[README.md:53-63](https://github.com/Continuum-AI-Corp/OrcaReplay/blob/a9178ca26af95cfd3231b8eb2da4ae11dbbd0a84/README.md#L53-L63)

作者区分真实模型录制与自带录制演示。

<details>
<summary>查看原文（11行）</summary>

````text
The three commands at the top need an agent installed, a key, a network and real tokens. If you
have none of those yet, one command brings its own:

```console
orca quickstart
```

It writes a small project with a genuine bug in it and a recording of an agent fixing that bug,
then replays the recording against the project with no model called: two failing tests before,
four passing after, three turns served from the trace and nothing spent. `--full` prints the whole
timeline and the replay as it happened.
````

</details>

#### 缺口

- 没有真实新任务的质量、人工成本与费用对照。
  **影响**：不能声称更优模型、节费或已验证的归因清单。
  **进一步探讨**：在相同任务预算下记录独立验收、工具副作用、人工解释时间和账单，单列旧录制重放结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
