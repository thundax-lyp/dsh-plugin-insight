# dsh-qa-suite-n23

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8f47356](https://github.com/All3nCN/dsh-qa-suite-N23/tree/8f473567166944bf9ea94afaad294ced49034691)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：提供编辑后 TypeScript 诊断工具和本地多镜头代码审查命令。

> **核心亮点**：吸收两份上游的 TS 诊断与模型审查流程，提供一个 host 包的工具和命令入口；未见诊断自动约束审查放行的共同机制。详见[Q02](#research-q02)。

> **风险与缺陷**：code_check 优先全局最近缓存项目而非调用会话 cwd，可能返回别的项目诊断；审查阈值只是 Agent 提示，不是校准准确率或程序验收。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 两种用户任务各需要怎样的合格结果？](#detail-section-11)
  - [Q02 · 确定性诊断和模型审查怎样接线，本项的相对增量是什么？](#detail-section-12)
  - [Q03 · 多项目诊断归属和审查置信度能否可靠使用？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复的成本与已证实效果是什么？](#detail-section-14)
  - [Q05 · 怎样采用并验证跨两条路径的设计假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：TS 开发者可在模型编辑后读 tsc 诊断，并用 /code-review 召集本地审查；前者是编译器结果，后者是待复核问题候选。

替代是项目内直接 tsc --noEmit 与独立代码审查 Agent/人工流程；本包减少入口分散，未增加共同验收机制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| code_check | 读取或重跑项目 tsc 诊断 | 需项目 TypeScript/tsconfig；多项目须核返回 root |
| 编辑后自动检查 | TS 文件改动后防抖检查 | 仅匹配 actor 与扩展；消耗本机资源 |
| /code-review | 向 Agent 发送多镜头本地审查流程 | 提示执行与自评分不等于已验收问题 |
| 诊断缓存 | 避免重复启动 tsc | 最近全局项目可能与当前会话不一致 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20.3、Cordis/tools/commands | 插件必需 | 注册工具和命令 | 入口不可用 |
| 项目 tsconfig 与 TypeScript | code_check 必需 | 本机 tsc --noEmit | 返回检查不可用，不可称 clean |
| fs/observed 且 actor 名匹配 | 自动检查必需 | 编辑后防抖调度 | 仍可手动 run，但不会自动触发 |
| Agent followup、模型与写报告能力 | 审查流程需要 | 执行提示中的多镜头步骤 | 命令成功文案不证明实际完成审查 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认 TS 项目、宿主事件与模型资源 | tsconfig/TypeScript 可定位 |
| 编辑检查 | 模型编辑后工具按项目防抖运行 tsc | 核报告 root、时间、诊断；错根时不要采信 |
| 人工审查 | 用户调用 /code-review，Agent按提示组织候选 | 每条问题返回源码证据和可复现条件 |
| 验收 | 开发者分别复核 tsc 与模型候选 | 阈值不是准确率，不能自动放行 |
| 恢复 | 清错根或超时，重新选项目并复核 | 缺项目绑定时可退回手工 tsc |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 与项目 TypeScript；金额未知 | 核事件、tsconfig 和工具/命令入口 | 兼容验收时间未知 |
| 持续使用 | 编辑触发 tsc 的 CPU/内存；审查占模型 token | 核当前项目诊断、复现审查候选 | 编译次数、token 与复核分钟未测 |
| 失败恢复 | 重跑编译及可能重做审查 | 排查错根、超时、配置和假阳性 | 误报/漏报恢复工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 类型诊断 | 事件触发真实本机 tsc 并缓存解析结果 | 多项目会话中的正确归属率 |
| 审查组织 | 五镜头、置信度和报告格式的提示流程 | 真实执行、检出率与评分校准 |
| 合包 | 一个插件暴露工具和命令 | 是否降低单位合格问题成本 |

源码机制不等于本轮运行或模型审查验收。

> **思考**：code_check 优先全局最近缓存项目而非调用会话 cwd，可能返回别的项目诊断；审查阈值只是 Agent 提示，不是校准准确率或程序验收。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：吸收两份上游的 TS 诊断与模型审查流程，提供一个 host 包的工具和命令入口；未见诊断自动约束审查放行的共同机制。详见[Q02](#research-q02)。

吸收两份上游的 TS 诊断与模型审查流程，提供一个 host 包的工具和命令入口；未见诊断自动约束审查放行的共同机制。详见[Q02](#research-q02)。

按项目防抖、dirty 重跑和 dispose abort 处理后台检查生命周期；纯逻辑/host 胶水边界便于审阅。直接 child_process 收集 stdout/stderr 没有显式字节上限，且工具取全局最近 root；审查命令只注入 prompt，不能代替执行证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

code_check 优先全局最近缓存项目而非调用会话 cwd，可能返回别的项目诊断；审查阈值只是 Agent 提示，不是校准准确率或程序验收。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先独立使用并复核 code_check 的项目根和时间，重要审查问题需要源码复现；跨项目或自动放行场景暂观察。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持两条独立入口与缓存机制；多项目归属和审查质量未运行验证；会话诊断版本绑定是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/core.js、lib/commands.js、UPSTREAM.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定提交入口、诊断运行时、审查提示装配、README/package 和上游归属说明；未运行 tsc、目标插件或审查 Agent。
- 下一步：进一步探讨以双项目交错、固定 TS 缺陷与伪缺陷比较报告归属、审查接受/漏报、编译与 token 成本；本轮不执行。

**分析版本**

- **仓库**：[All3nCN/dsh-qa-suite-N23](https://github.com/All3nCN/dsh-qa-suite-N23)
- **版本号**：0.1.0（[固定提交 8f47356](https://github.com/All3nCN/dsh-qa-suite-N23/tree/8f473567166944bf9ea94afaad294ced49034691)）
- **版本日期**：2026-09-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可按会话绑定项目与诊断版本，并要求审查意见引用同版本证据；以双项目交错和缺陷注入对照错根率、接受率及成本。未实现。详见[Q05](#research-q05)。

进一步探讨以双项目交错、固定 TS 缺陷与伪缺陷比较报告归属、审查接受/漏报、编译与 token 成本；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 290 | — | — | 1908 |
| .js | source | 3 | 849 | 648 | 100 | — |
| .mjs | test | 1 | 199 | 160 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+created%3A2026-09-22T05%3A17%3A35.949Z..2026-10-22T05%3A17%3A35.949Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/All3nCN/dsh-qa-suite-N23/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A17%3A35.949Z..2026-10-22T05%3A17%3A35.949Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断两个合包入口各自的事实、限制与采用价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两种用户任务各需要怎样的合格结果？

**研究主题**：场景与需求

#### 完整回答

第一种任务是模型改动 TypeScript 后查看当前项目的 tsc --noEmit 诊断，合格结果必须绑定本次项目和检查时间，区分编译器错误、检查不可用及路径过滤后无匹配。第二种任务是开发者让 Agent 对本地改动做多角度审查，合格结果是可回到具体代码与复现条件的问题候选，不能把模型置信度 80 当真实准确率。上游分别已有 code-check 和 code-review，本包把两个入口集中在 DSH host；用户若只需确定性诊断，直接运行项目 tsc 是替代，若需审查可用既有 Agent/人工流程。合包便利不意味着它们已形成自动互证的质量闸门。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-28](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/README.md#L3-L28)

作者分别描述 code_check 与 /code-review 的任务。

<details>
<summary>查看原文（26行）</summary>

```text
DSH 质量套件插件（host 侧，无 UI 半区）。一个包合并两份上游能力：

## 能力

### 1. code_check 工具（自动类型检查）

吸收自 `a179-sanae/dsh-code-check`（BSD-3-Clause）。

- 监听 `fs/observed` 事件：模型经 `edit` / `write` 工具改动 `.ts` / `.tsx` / `.mts` / `.cts` 文件后触发。
- 按项目防抖（默认 800ms）后台运行 `node <tsc> --noEmit -p <tsconfig> --pretty false`：
  spawn 数组形态、无 shell 参与、显式超时（默认 60s）+ abort。
- 项目自动发现：自改动文件向上找最近的 `tsconfig.json`（跳过 node_modules）；
  首次使用时按调用方工作区扫描。
- 诊断缓存在内存（LRU，容量 cacheCap），模型随时调用 `code_check` 工具读取报告；
  支持 `paths` 相对路径过滤与 `run: true` 强制重跑。

### 2. /code-review 命令（多镜头本地代码审查）

吸收自 `JasonFreeLab/dsh-command-code-review`（MIT），PR / gh 回评模式已删除，
仅保留本地审查模式。

- `/code-review [审查请求] [--out <dir>]`：五镜头（dsh.md 合规 / bug 正确性 /
  历史上下文 / 安全 / 注释合规）并行审查，去重后单代理打置信度（0-100）与
  严重度（blocker/major/minor/nit），按阈值（默认 80）过滤后汇报。
- 报告落盘 `outDir`（默认 `reports/code-review`）：Markdown 报告 + JSON sidecar。
- 空输入 = 审查当前未提交变更（git diff + git diff --cached）。
```

</details>

**依据 2 · 源码核查**：[index.js:59-105](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/index.js#L59-L105)

工具读取缓存或主动检查，命令另注册。

<details>
<summary>查看原文（47行）</summary>

```text
  const disposeTool = ctx.tools.register(defineTool({
    name: 'code_check',
    description: TOOL_DESCRIPTION,
    parameters: {
      paths: {
        type: 'array',
        items: { type: 'string', description: 'Relative path filter, e.g. "src/app.ts".' },
        description: 'Optional relative paths to limit the report to.',
      },
      run: {
        type: 'boolean',
        description: 'Force a fresh tsc --noEmit run instead of the cached report.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    isConcurrencySafe: () => true,
    execute: async (args, exec) => {
      if (!resolved.enabled) {
        return 'code_check is disabled in the plugin config (enabled: false).';
      }
      const roots = runtime.roots();
      const cachedRoot = roots[0];
      // 项目发现：优先取编辑学到的缓存项目；首次使用时扫描调用方工作区
      let root = cachedRoot;
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) root = findProjectRoot(cwd);
      }
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) {
          return `No tsconfig.json found under ${cwd} (workspace scan). Projects are learned from file edits: ask the model to edit or create a source file first, then call code_check again.`;
        }
        return 'No project has been checked yet. Projects are learned from file edits: ask the model to edit or create a source file in the workspace first, then call code_check again.';
      }
      let result = runtime.peek(root);
      if (result === undefined || args?.run === true) {
        result = await runtime.check(root, exec?.signal);
      }
      return formatReport(result, resolved.maxDiagnostics, args?.paths ?? []);
    },
  }));

  const disposeCommand = registerCodeReviewCommand(ctx, resolved);
```

</details>

**依据 3 · 源码核查**：[lib/commands.js:23-48](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/commands.js#L23-L48)

审查命令注入 followup 文本而非执行程序化审查。

<details>
<summary>查看原文（26行）</summary>

```text
export function registerCodeReviewCommand(ctx, config) {
  const lensIds = resolveLenses(config);
  const autoLenses = resolveAutoLenses(config);
  const workflowLocal = renderWorkflow(buildLocalWorkflow(lensIds, autoLenses), config.threshold);

  return ctx.commands.register({
    name: 'code-review',
    description: COMMAND_DESCRIPTION,
    input: { hint: '[审查请求] [--out <dir>]' },
    handler(invocation) {
      const raw = invocation?.rawInput;
      const { request, outDir } = parseInvocation(raw, config.outDir);
      const local = renderOutputDir(workflowLocal, outDir);
      // PR 目标（编号/URL）模式已删除：任何非空输入都按本地审查请求处理
      const text = request.length === 0
        ? EMPTY_INPUT_PROBE + local
        : `Review request: ${request}\n\n${local}`;
      const agent = invocation?.agent;
      if (agent && typeof agent.followup === 'function') {
        agent.followup(createUserMessage({
          content: [{ type: 'text', text }],
          source: { kind: 'plugin', plugin: 'qa-suite', form: 'notice', summary: '代码审查已开始' },
        }));
      }
      return { kind: 'success', text: '代码审查已开始。' };
    },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确定性诊断和模型审查怎样接线，本项的相对增量是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

fs/observed 只对配置的 edit/write actor 和 TS 扩展触发，向上找 tsconfig 后按项目防抖；runTypeCheck 从项目解析 typescript/bin/tsc，以 Node 子进程的 argv 数组运行 --noEmit 并解析诊断，缓存供 code_check 读取，run=true 可强制更新。/code-review 由命令注册器把用户请求及镜头、阈值、报告模板等流程文本 followup 给 Agent；多代理执行、评分和落报告是提示要求，不在此插件源码中被程序化调度或验证。贡献是把两份上游能力吸收为纯逻辑加薄 host 胶水，改变本地触发与入口组织；TS 编译器与审查方法归各自上游或宿主，不能把合包或提示视作新验证算法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:45-111](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/index.js#L45-L111)

事件、工具和命令注册及清理。

<details>
<summary>查看原文（67行）</summary>

```text
/** 应用插件到其 Cordis 上下文。 */
export function apply(ctx, config = {}) {
  const resolved = resolveConfig(config);
  const runtime = createCheckRuntime({ config: resolved, log: ctx.logger });

  if (resolved.enabled) {
    ctx.on('fs/observed', (target, observation, actor) => {
      if (!isRelevantMutation(target, observation, actor, resolved)) return;
      const root = findProjectRoot(target.displayPath);
      if (root === undefined) return;
      runtime.schedule(root);
    });
  }

  const disposeTool = ctx.tools.register(defineTool({
    name: 'code_check',
    description: TOOL_DESCRIPTION,
    parameters: {
      paths: {
        type: 'array',
        items: { type: 'string', description: 'Relative path filter, e.g. "src/app.ts".' },
        description: 'Optional relative paths to limit the report to.',
      },
      run: {
        type: 'boolean',
        description: 'Force a fresh tsc --noEmit run instead of the cached report.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    isConcurrencySafe: () => true,
    execute: async (args, exec) => {
      if (!resolved.enabled) {
        return 'code_check is disabled in the plugin config (enabled: false).';
      }
      const roots = runtime.roots();
      const cachedRoot = roots[0];
      // 项目发现：优先取编辑学到的缓存项目；首次使用时扫描调用方工作区
      let root = cachedRoot;
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) root = findProjectRoot(cwd);
      }
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) {
          return `No tsconfig.json found under ${cwd} (workspace scan). Projects are learned from file edits: ask the model to edit or create a source file first, then call code_check again.`;
        }
        return 'No project has been checked yet. Projects are learned from file edits: ask the model to edit or create a source file in the workspace first, then call code_check again.';
      }
      let result = runtime.peek(root);
      if (result === undefined || args?.run === true) {
        result = await runtime.check(root, exec?.signal);
      }
      return formatReport(result, resolved.maxDiagnostics, args?.paths ?? []);
    },
  }));

  const disposeCommand = registerCodeReviewCommand(ctx, resolved);

  ctx.effect(() => () => {
    disposeTool();
    disposeCommand();
    runtime.dispose();
  });
```

</details>

**依据 2 · 源码核查**：[lib/core.js:133-211](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L133-L211)

本机 tsc 解析和执行链。

<details>
<summary>查看原文（79行）</summary>

```text
/** 构造 tsc 参数数组（spawn 数组形态，无 shell 参与）。 */
export function buildTscArgs(tsconfig, extraArgs = []) {
  return ['--noEmit', '-p', tsconfig, '--pretty', 'false', ...extraArgs];
}

/**
 * 在项目内运行 `tsc --noEmit -p <tsconfig>` 并解析诊断。
 * 直接 spawn `node typescript/bin/tsc`（不经 shell/npx/.cmd）；钉死 --pretty false
 * 保证输出可解析。超时显式（timer + kill）。
 */
export async function runTypeCheck(root, options = {}) {
  const tsconfig = join(root, 'tsconfig.json');
  const failure = (error) => ({ root, tsconfig, diagnostics: [], ok: false, error, checkedAt: Date.now() });
  const tscEntry = resolveTscEntry(root);
  if (!tscEntry) {
    let present = false;
    try {
      createRequire(join(root, 'package.json')).resolve('typescript');
      present = true;
    } catch {
      present = false;
    }
    return failure(present
      ? `TypeScript is installed for ${root} but its tsc entry cannot be resolved (broken install; check node_modules/typescript)`
      : `TypeScript is not installed for ${root} (run \`npm i -D typescript\`); code_check cannot run.`);
  }

  const args = buildTscArgs(tsconfig, options.extraArgs ?? []);
  if (options.signal?.aborted) return failure('type check aborted before start');

  const child = spawn(process.execPath, [tscEntry, ...args], {
    cwd: root,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    signal: options.signal,
  });

  const stdout = [];
  const stderr = [];
  child.stdout.on('data', (chunk) => stdout.push(chunk));
  child.stderr.on('data', (chunk) => stderr.push(chunk));

  const exit = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`tsc timed out after ${options.timeoutMs}ms`));
    }, options.timeoutMs);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });
  });

  const out = Buffer.concat(stdout).toString('utf8');
  const err = Buffer.concat(stderr).toString('utf8');
  const diagnostics = parseDiagnostics(out);
  if (exit !== 0 && out.length === 0 && err.length === 0) {
    return failure(`tsc exited with code ${exit} and no output`);
  }
  if (exit !== 0 && diagnostics.length === 0) {
    const detail = (err.trim() || out.trim()).slice(0, 400);
    if (detail.length === 0) return failure(`tsc exited with code ${exit} and no output`);
    // 无路径诊断（如 include:[] 的 TS18003、files 缺文件的 TS6053）来自 tsconfig
    // 配置错误；打上标签让模型去修配置而不是把项目当作不可检查。
    const label = /error TS\d+/.test(detail) ? 'tsconfig/global error' : 'tsc exited with code';
    return failure(`${label === 'tsconfig/global error' ? `tsc exited with code ${exit} (${label})` : `${label} ${exit}`}: ${detail}`);
  }
  return {
    root,
    tsconfig,
    diagnostics,
    ok: true,
    ...(exit !== 0 && err.trim().length > 0 ? { error: `tsc stderr: ${err.trim().slice(0, 400)}` } : {}),
    checkedAt: Date.now(),
  };
```

</details>

**依据 3 · 源码核查**：[lib/core.js:293-394](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L293-L394)

按项目防抖、缓存和 abort 生命周期。

<details>
<summary>查看原文（102行）</summary>

```text
export function createCheckRuntime({ config, runCheck = runTypeCheck, log = { info: () => {} } }) {
  const states = new Map();
  const byRecency = [];
  const disposed = new AbortController();

  function touch(root) {
    const index = byRecency.indexOf(root);
    if (index >= 0) byRecency.splice(index, 1);
    byRecency.unshift(root);
    while (byRecency.length > config.cacheCap) {
      const evicted = byRecency.pop();
      if (evicted === undefined) break;
      const state = states.get(evicted);
      if (state?.timer !== undefined) clearTimeout(state.timer);
      states.delete(evicted);
    }
  }

  async function check(root, signal) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    touch(root);
    // 显式检查取代任何挂起的防抖检查，避免防抖定时器随后再跑一次 tsc
    if (state.timer !== undefined) {
      clearTimeout(state.timer);
      state.timer = undefined;
    }
    if (state.running) {
      state.dirty = true;
      return state.result ?? {
        root,
        tsconfig: join(root, 'tsconfig.json'),
        diagnostics: [],
        ok: false,
        error: 'another type check is still running; call code_check again shortly',
        checkedAt: Date.now(),
      };
    }
    state.running = true;
    let completed = false;
    try {
      let result;
      try {
        result = await runCheck(root, {
          timeoutMs: config.tscTimeoutMs,
          signal: signal === undefined ? disposed.signal : AbortSignal.any([signal, disposed.signal]),
          extraArgs: config.extraArgs,
        });
      } catch (error) {
        // 引擎故障（超时/spawn 失败）降级为检查结果，code_check 永不 reject
        result = {
          root,
          tsconfig: join(root, 'tsconfig.json'),
          diagnostics: [],
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          checkedAt: Date.now(),
        };
      }
      state.result = result;
      log.info(`qa-suite: ${result.ok ? `${result.diagnostics.length} diagnostics` : `unavailable: ${result.error ?? ''}`} for ${root}`);
      completed = true;
      return result;
    } finally {
      state.running = false;
      if (completed && state.dirty && !disposed.signal.aborted && !signal?.aborted) {
        state.dirty = false;
        return check(root, signal);
      }
      state.dirty = false;
    }
  }

  function schedule(root) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    if (state.timer !== undefined) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.timer = undefined;
      check(root).catch(() => undefined);
    }, config.debounceMs);
  }

  return {
    schedule,
    check,
    peek(root) {
      return states.get(root)?.result;
    },
    roots() {
      return [...byRecency];
    },
    dispose() {
      // 中止在途检查（不留孤儿 tsc），并让 finally 分支在销毁后停止 dirty 重跑
      disposed.abort();
      for (const state of states.values()) {
        if (state.timer !== undefined) clearTimeout(state.timer);
      }
      states.clear();
      byRecency.length = 0;
    },
  };
```

</details>

**依据 4 · 源码核查**：[lib/commands.js:23-48](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/commands.js#L23-L48)

followup 文本注入的命令边界。

<details>
<summary>查看原文（26行）</summary>

```text
export function registerCodeReviewCommand(ctx, config) {
  const lensIds = resolveLenses(config);
  const autoLenses = resolveAutoLenses(config);
  const workflowLocal = renderWorkflow(buildLocalWorkflow(lensIds, autoLenses), config.threshold);

  return ctx.commands.register({
    name: 'code-review',
    description: COMMAND_DESCRIPTION,
    input: { hint: '[审查请求] [--out <dir>]' },
    handler(invocation) {
      const raw = invocation?.rawInput;
      const { request, outDir } = parseInvocation(raw, config.outDir);
      const local = renderOutputDir(workflowLocal, outDir);
      // PR 目标（编号/URL）模式已删除：任何非空输入都按本地审查请求处理
      const text = request.length === 0
        ? EMPTY_INPUT_PROBE + local
        : `Review request: ${request}\n\n${local}`;
      const agent = invocation?.agent;
      if (agent && typeof agent.followup === 'function') {
        agent.followup(createUserMessage({
          content: [{ type: 'text', text }],
          source: { kind: 'plugin', plugin: 'qa-suite', form: 'notice', summary: '代码审查已开始' },
        }));
      }
      return { kind: 'success', text: '代码审查已开始。' };
    },
```

</details>

**依据 5 · 作者声明**：[README.md:49-52](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/README.md#L49-L52)

作者明确吸收两个上游。

```text
## 归属

本插件吸收合并了两个上游项目，许可证与版权声明见 `UPSTREAM.md`、`LICENSE`、
`THIRD-PARTY-NOTICES.md`。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多项目诊断归属和审查置信度能否可靠使用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

code_check 先取 runtime.roots()[0] 最近全局项目，只有没有任何缓存根时才用调用 Agent 会话 cwd 发现项目；A 项目刚编辑后 B 会话调用，源码路径可返回 A 的诊断。paths 只过滤已选根报告，无法改回 B 根。run=true 也沿该根重跑，所以不是单纯缓存过期问题。运行时会取消定时器并用 AbortSignal 结束在途检查、dirty 后补跑，这是可借鉴的生命周期设计；同时编译器使用直接 node:child_process.spawn，stdout/stderr 累积 Buffer，源码未见采集字节上限，资源边界仍依赖项目规模和宿主。审查命令生成五镜头、阈值与置信度规则后交给 Agent，它没有检查最终报告实际评分、真实复现或每个镜头是否执行。因而 tsc 诊断和模型评论必须分别标明证据级别。本轮未执行交错项目或缺陷注入，不能宣称已观察到用户级误报。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:78-101](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/index.js#L78-L101)

最近缓存根优先于调用方 cwd，run=true 保持该选择。

<details>
<summary>查看原文（24行）</summary>

```text
    execute: async (args, exec) => {
      if (!resolved.enabled) {
        return 'code_check is disabled in the plugin config (enabled: false).';
      }
      const roots = runtime.roots();
      const cachedRoot = roots[0];
      // 项目发现：优先取编辑学到的缓存项目；首次使用时扫描调用方工作区
      let root = cachedRoot;
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) root = findProjectRoot(cwd);
      }
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) {
          return `No tsconfig.json found under ${cwd} (workspace scan). Projects are learned from file edits: ask the model to edit or create a source file first, then call code_check again.`;
        }
        return 'No project has been checked yet. Projects are learned from file edits: ask the model to edit or create a source file in the workspace first, then call code_check again.';
      }
      let result = runtime.peek(root);
      if (result === undefined || args?.run === true) {
        result = await runtime.check(root, exec?.signal);
      }
      return formatReport(result, resolved.maxDiagnostics, args?.paths ?? []);
```

</details>

**依据 2 · 源码核查**：[lib/core.js:293-394](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L293-L394)

缓存、dirty 重跑和 dispose abort。

<details>
<summary>查看原文（102行）</summary>

```text
export function createCheckRuntime({ config, runCheck = runTypeCheck, log = { info: () => {} } }) {
  const states = new Map();
  const byRecency = [];
  const disposed = new AbortController();

  function touch(root) {
    const index = byRecency.indexOf(root);
    if (index >= 0) byRecency.splice(index, 1);
    byRecency.unshift(root);
    while (byRecency.length > config.cacheCap) {
      const evicted = byRecency.pop();
      if (evicted === undefined) break;
      const state = states.get(evicted);
      if (state?.timer !== undefined) clearTimeout(state.timer);
      states.delete(evicted);
    }
  }

  async function check(root, signal) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    touch(root);
    // 显式检查取代任何挂起的防抖检查，避免防抖定时器随后再跑一次 tsc
    if (state.timer !== undefined) {
      clearTimeout(state.timer);
      state.timer = undefined;
    }
    if (state.running) {
      state.dirty = true;
      return state.result ?? {
        root,
        tsconfig: join(root, 'tsconfig.json'),
        diagnostics: [],
        ok: false,
        error: 'another type check is still running; call code_check again shortly',
        checkedAt: Date.now(),
      };
    }
    state.running = true;
    let completed = false;
    try {
      let result;
      try {
        result = await runCheck(root, {
          timeoutMs: config.tscTimeoutMs,
          signal: signal === undefined ? disposed.signal : AbortSignal.any([signal, disposed.signal]),
          extraArgs: config.extraArgs,
        });
      } catch (error) {
        // 引擎故障（超时/spawn 失败）降级为检查结果，code_check 永不 reject
        result = {
          root,
          tsconfig: join(root, 'tsconfig.json'),
          diagnostics: [],
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          checkedAt: Date.now(),
        };
      }
      state.result = result;
      log.info(`qa-suite: ${result.ok ? `${result.diagnostics.length} diagnostics` : `unavailable: ${result.error ?? ''}`} for ${root}`);
      completed = true;
      return result;
    } finally {
      state.running = false;
      if (completed && state.dirty && !disposed.signal.aborted && !signal?.aborted) {
        state.dirty = false;
        return check(root, signal);
      }
      state.dirty = false;
    }
  }

  function schedule(root) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    if (state.timer !== undefined) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.timer = undefined;
      check(root).catch(() => undefined);
    }, config.debounceMs);
  }

  return {
    schedule,
    check,
    peek(root) {
      return states.get(root)?.result;
    },
    roots() {
      return [...byRecency];
    },
    dispose() {
      // 中止在途检查（不留孤儿 tsc），并让 finally 分支在销毁后停止 dirty 重跑
      disposed.abort();
      for (const state of states.values()) {
        if (state.timer !== undefined) clearTimeout(state.timer);
      }
      states.clear();
      byRecency.length = 0;
    },
  };
```

</details>

**依据 3 · 源码核查**：[lib/core.js:160-192](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L160-L192)

直接子进程与输出 Buffer 累积。

<details>
<summary>查看原文（33行）</summary>

```text
  const args = buildTscArgs(tsconfig, options.extraArgs ?? []);
  if (options.signal?.aborted) return failure('type check aborted before start');

  const child = spawn(process.execPath, [tscEntry, ...args], {
    cwd: root,
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    signal: options.signal,
  });

  const stdout = [];
  const stderr = [];
  child.stdout.on('data', (chunk) => stdout.push(chunk));
  child.stderr.on('data', (chunk) => stderr.push(chunk));

  const exit = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`tsc timed out after ${options.timeoutMs}ms`));
    }, options.timeoutMs);
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });
  });

  const out = Buffer.concat(stdout).toString('utf8');
  const err = Buffer.concat(stderr).toString('utf8');
  const diagnostics = parseDiagnostics(out);
```

</details>

**依据 4 · 源码核查**：[lib/commands.js:28-48](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/commands.js#L28-L48)

命令只注入提示，没有程序化验收。

<details>
<summary>查看原文（21行）</summary>

```text
  return ctx.commands.register({
    name: 'code-review',
    description: COMMAND_DESCRIPTION,
    input: { hint: '[审查请求] [--out <dir>]' },
    handler(invocation) {
      const raw = invocation?.rawInput;
      const { request, outDir } = parseInvocation(raw, config.outDir);
      const local = renderOutputDir(workflowLocal, outDir);
      // PR 目标（编号/URL）模式已删除：任何非空输入都按本地审查请求处理
      const text = request.length === 0
        ? EMPTY_INPUT_PROBE + local
        : `Review request: ${request}\n\n${local}`;
      const agent = invocation?.agent;
      if (agent && typeof agent.followup === 'function') {
        agent.followup(createUserMessage({
          content: [{ type: 'text', text }],
          source: { kind: 'plugin', plugin: 'qa-suite', form: 'notice', summary: '代码审查已开始' },
        }));
      }
      return { kind: 'success', text: '代码审查已开始。' };
    },
```

</details>

**依据 5 · 源码核查**：[lib/core.js:501-542](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L501-L542)

置信度与报告模板属于 prompt 文本。

<details>
<summary>查看原文（42行）</summary>

```text
const CONFIDENCE_RUBRIC = `   a. 0: Not confident at all. This is a false positive that doesn't stand up to light scrutiny, or is a pre-existing issue.
   b. 25: Somewhat confident. This might be a real issue, but may also be a false positive. The agent wasn't able to verify that it's a real issue. If the issue is stylistic, it is one that was not explicitly called out in the relevant dsh.md.
   c. 50: Moderately confident. The agent was able to verify this is a real issue, but it might be a nitpick or not happen very often in practice. Relative to the rest of the change, it's not very important.
   d. 75: Highly confident. The agent double checked the issue, and verified that it is very likely it is a real issue that will be hit in practice. The existing approach is insufficient. The issue is very important and will directly impact the code's functionality, or it is an issue that is directly mentioned in the relevant dsh.md.
   e. 100: Absolutely certain. The agent double checked the issue, and confirmed that it is definitely a real issue, that will happen frequently in practice. The evidence directly confirms this.`;

const SEVERITY_RUBRIC = `   - blocker: will break the build, crash at runtime, leak secrets, or is a security vulnerability; must be fixed before merge.
   - major: a real bug or significant correctness/security issue that should be fixed, but does not block the change outright.
   - minor: a small bug or edge case that is unlikely to bite often.
   - nit: a stylistic or non-functional suggestion.`;

const FALSE_POSITIVES = `- Pre-existing issues
- Something that looks like a bug but is not actually a bug
- Pedantic nitpicks that a senior engineer wouldn't call out
- Issues that a linter, typechecker, or compiler would catch (eg. missing or incorrect imports, type errors, broken tests, formatting issues, pedantic style issues like newlines). No need to run these build steps yourself -- it is safe to assume that they will be run separately as part of CI.
- General code quality issues (eg. lack of test coverage, poor documentation), unless explicitly required in dsh.md
- Issues that are called out in dsh.md, but explicitly silenced in the code (eg. due to a lint ignore comment)
- Changes in functionality that are likely intentional or are directly related to the broader change
- Real issues, but on lines that were not modified by the change under review`;

const REPORT_TEMPLATE = `# Code Review

- **Scope**: <review scope / request>
- **Commit**: <short commit sha, or "n/a" if not a git repository>
- **Date**: <YYYY-MM-DD>
- **Mode**: local
- **Confidence threshold**: CONFIDENCE_THRESHOLD

## Summary

<one-sentence summary of the change under review>

## Issues

<group by severity: blocker > major > minor > nit; within a severity, by confidence>

1. <brief description> (severity: <blocker|major|minor|nit>, confidence: <0-100>)
   - <file>:<line> — <impact and suggested fix>

<or, if no issues passed the threshold:>

No issues found. Checked for bugs, security, and dsh.md compliance.`;
```

</details>

#### 缺口

- 尚无 A/B 两项目交错调用的真实宿主记录。
  **影响**：无法量化错项目诊断发生率及修复负担。
  **进一步探讨**：隔离建立两个不同 tsconfig 的项目，交错 edit、code_check 与 run=true，核对返回根和版本。
- 没有缺陷注入与人工标注对照。
  **影响**：80 阈值不是准确率或质量保证。
  **进一步探讨**：对固定真实/伪问题样本盲审，记录接受率、漏报、证据与模型调用成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复的成本与已证实效果是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 Node>=20.3 和 Cordis、tools、LLM、commands peer；code_check 另需项目内 TypeScript、tsconfig 与可运行的 Node 子进程，/code-review 依赖宿主 Agent 的 followup、模型配额和报告写入能力。首次需确认事件 actor、TS 项目和命令入口；持续编辑可触发每项目防抖 tsc，占 CPU/内存，模型审查则另占 token 与人工复核时间；失败恢复要分辨无 tsconfig、tsc 未安装、超时、诊断过期和提示执行偏差。源码里可看到 800ms 默认防抖、60s 默认超时与容量 200 缓存，但这些是配置，不是每任务实测资源。没有同条件缺陷检出率、误报率、节时和总成本，不因输出格式完整就称质量提高。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-43](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/package.json#L1-L43)

包定位、Node 与 peer 声明。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "@all3cn/dsh-qa-suite-n23",
  "version": "0.1.0",
  "description": "DSH 质量套件插件：模型编辑 TS 源后自动 tsc --noEmit 诊断（code_check 工具）+ /code-review 多镜头本地代码审查命令（吸收自 a179-sanae/dsh-code-check 与 JasonFreeLab/dsh-command-code-review）",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./lib/core.js": "./lib/core.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "license": "MIT",
  "files": [
    "index.js",
    "lib/core.js",
    "lib/commands.js",
    "tests/core.test.mjs",
    "cordis.patch.yml",
    "dsh-plugin.json",
    "README.md",
    "README_EN.md",
    "docs/RELEASE.md",
    "UPSTREAM.md",
    "LICENSE",
    "THIRD-PARTY-NOTICES.md"
  ],
  "scripts": {
    "test": "node --test 'tests/*.test.mjs'"
  },
  "engines": {
    "node": ">=20.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-commands": "^0.1.1-rc.2"
  }
```

</details>

**依据 2 · 源码核查**：[lib/core.js:18-34](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L18-L34)

防抖、超时和缓存默认值。

<details>
<summary>查看原文（17行）</summary>

```text
/** 各字段默认值；patch yml 里只覆盖关心的键。 */
export const DEFAULT_CONFIG = {
  enabled: true,
  debounceMs: 800,
  triggerTools: ['edit', 'write'],
  includeExtensions: ['.ts', '.tsx', '.mts', '.cts'],
  maxDiagnostics: 120,
  tscTimeoutMs: 60000,
  extraArgs: ['--incremental'],
  cacheCap: 200,
  threshold: 80,
  lenses: [],
  // 本套件默认关闭自适应镜头（上游默认开启，此处按合并规格改为 false）
  autoLenses: false,
  // 本地报告输出目录（上游默认 "doc"，此处改为 "reports/code-review"）
  outDir: 'reports/code-review',
};
```

</details>

**依据 3 · 源码核查**：[lib/core.js:107-157](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L107-L157)

tsc 需要从项目内解析。

<details>
<summary>查看原文（51行）</summary>

```text
/** 从项目根解析 `typescript/bin/tsc` JS 入口。 */
export function resolveTscEntry(root) {
  try {
    const requireFromProject = createRequire(join(root, 'package.json'));
    try {
      return requireFromProject.resolve(TSC_BIN);
    } catch {
      // 部分 TypeScript 版本限制 subpath exports：从包 main 向上找 bin/tsc(.js)
      const main = requireFromProject.resolve('typescript');
      let dir = dirname(main);
      for (let depth = 0; depth < 8; depth += 1) {
        for (const candidate of ['bin/tsc', 'bin/tsc.js']) {
          const full = join(dir, candidate);
          if (existsSync(full)) return full;
        }
        const parent = dirname(dir);
        if (parent === dir) break;
        dir = parent;
      }
      return undefined;
    }
  } catch {
    return undefined;
  }
}

/** 构造 tsc 参数数组（spawn 数组形态，无 shell 参与）。 */
export function buildTscArgs(tsconfig, extraArgs = []) {
  return ['--noEmit', '-p', tsconfig, '--pretty', 'false', ...extraArgs];
}

/**
 * 在项目内运行 `tsc --noEmit -p <tsconfig>` 并解析诊断。
 * 直接 spawn `node typescript/bin/tsc`（不经 shell/npx/.cmd）；钉死 --pretty false
 * 保证输出可解析。超时显式（timer + kill）。
 */
export async function runTypeCheck(root, options = {}) {
  const tsconfig = join(root, 'tsconfig.json');
  const failure = (error) => ({ root, tsconfig, diagnostics: [], ok: false, error, checkedAt: Date.now() });
  const tscEntry = resolveTscEntry(root);
  if (!tscEntry) {
    let present = false;
    try {
      createRequire(join(root, 'package.json')).resolve('typescript');
      present = true;
    } catch {
      present = false;
    }
    return failure(present
      ? `TypeScript is installed for ${root} but its tsc entry cannot be resolved (broken install; check node_modules/typescript)`
      : `TypeScript is not installed for ${root} (run \`npm i -D typescript\`); code_check cannot run.`);
```

</details>

**依据 4 · 源码核查**：[lib/core.js:233-260](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L233-L260)

无诊断与过滤无匹配的不同提示。

<details>
<summary>查看原文（28行）</summary>

```text
/** 把一条检查结果渲染为面向模型的报告文本；paths 为相对路径过滤（空 = 全部）。 */
export function formatReport(result, maxDiagnostics, paths = []) {
  if (!result || result.ok !== true) {
    return `Type check unavailable — ${result?.error ?? 'unknown failure'}`;
  }
  const cap = Math.max(0, Math.floor(maxDiagnostics));
  const filters = (Array.isArray(paths) ? paths : []).map(normalizeFilter).filter((p) => p !== undefined);
  const filtered = filters.length > 0
    ? result.diagnostics.filter((d) => filters.some((p) => within(d.file, result.root, p)))
    : result.diagnostics;
  const capped = filtered.slice(0, cap);
  const dropped = filtered.length - capped.length;
  const stamp = new Date(result.checkedAt).toLocaleTimeString();

  const lines = [`Type check report — ${filtered.length} diagnostic${filtered.length === 1 ? '' : 's'} (checked at ${stamp})`];
  for (const d of capped) {
    lines.push(`  ${relative(result.root, d.file).split(sep).join('/')}:${d.line}:${d.column}  ${d.severity} ${d.code}  ${d.message}`);
  }
  if (dropped > 0) lines.push(`  … and ${dropped} more (maxDiagnostics=${maxDiagnostics})`);
  if (filtered.length === 0) {
    // 有过滤条件时零命中是「没有匹配」，不是「干净」
    lines.push(filters.length > 0
      ? '  No diagnostics match the given path filters.'
      : '  ✓ No type errors — all checked files are clean.');
  } else {
    lines.push('Tip: fix the errors, then call code_check again to verify.');
  }
  return lines.join('\n');
```

</details>

#### 缺口

- 无真实项目 CPU/token/人工时间和审查质量对照。
  **影响**：无法计算单位合格问题成本或净收益。
  **进一步探讨**：固定项目与缺陷样本记录编译次数、资源、模型 token、复核分钟和最终正确问题。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样采用并验证跨两条路径的设计假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有 TS 项目可先使用 code_check，但多项目环境须明确核对报告中的 root、检查时间和当前会话项目；审查命令只作为召集 Agent 的候选问题流程，重要问题仍需源码复现。若会话经常跨项目或需要强质量门禁，目前不应把此合包当自动放行条件。可提出未验证设计，将会话/项目 ID、tsconfig 摘要和诊断检查版本传给审查流程，并要求每条评论绑定同版本代码证据；这样有机会减少错项目诊断和泛化审查，但也增加状态与证据管理。最小对照是两项目交错编辑、固定真缺陷和伪缺陷，比较错根率、人工接受率、漏报和 token/分钟；若不改善或成本过大，仍保持两个独立工具。该共同机制未实现，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:82-101](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/index.js#L82-L101)

当前全局根选择和 report 调用未绑定会话。

<details>
<summary>查看原文（20行）</summary>

```text
      const roots = runtime.roots();
      const cachedRoot = roots[0];
      // 项目发现：优先取编辑学到的缓存项目；首次使用时扫描调用方工作区
      let root = cachedRoot;
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) root = findProjectRoot(cwd);
      }
      if (root === undefined) {
        const cwd = workspaceCwd(exec);
        if (cwd !== undefined) {
          return `No tsconfig.json found under ${cwd} (workspace scan). Projects are learned from file edits: ask the model to edit or create a source file first, then call code_check again.`;
        }
        return 'No project has been checked yet. Projects are learned from file edits: ask the model to edit or create a source file in the workspace first, then call code_check again.';
      }
      let result = runtime.peek(root);
      if (result === undefined || args?.run === true) {
        result = await runtime.check(root, exec?.signal);
      }
      return formatReport(result, resolved.maxDiagnostics, args?.paths ?? []);
```

</details>

**依据 2 · 源码核查**：[lib/core.js:293-394](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/core.js#L293-L394)

已有项目缓存可作为改造基础。

<details>
<summary>查看原文（102行）</summary>

```text
export function createCheckRuntime({ config, runCheck = runTypeCheck, log = { info: () => {} } }) {
  const states = new Map();
  const byRecency = [];
  const disposed = new AbortController();

  function touch(root) {
    const index = byRecency.indexOf(root);
    if (index >= 0) byRecency.splice(index, 1);
    byRecency.unshift(root);
    while (byRecency.length > config.cacheCap) {
      const evicted = byRecency.pop();
      if (evicted === undefined) break;
      const state = states.get(evicted);
      if (state?.timer !== undefined) clearTimeout(state.timer);
      states.delete(evicted);
    }
  }

  async function check(root, signal) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    touch(root);
    // 显式检查取代任何挂起的防抖检查，避免防抖定时器随后再跑一次 tsc
    if (state.timer !== undefined) {
      clearTimeout(state.timer);
      state.timer = undefined;
    }
    if (state.running) {
      state.dirty = true;
      return state.result ?? {
        root,
        tsconfig: join(root, 'tsconfig.json'),
        diagnostics: [],
        ok: false,
        error: 'another type check is still running; call code_check again shortly',
        checkedAt: Date.now(),
      };
    }
    state.running = true;
    let completed = false;
    try {
      let result;
      try {
        result = await runCheck(root, {
          timeoutMs: config.tscTimeoutMs,
          signal: signal === undefined ? disposed.signal : AbortSignal.any([signal, disposed.signal]),
          extraArgs: config.extraArgs,
        });
      } catch (error) {
        // 引擎故障（超时/spawn 失败）降级为检查结果，code_check 永不 reject
        result = {
          root,
          tsconfig: join(root, 'tsconfig.json'),
          diagnostics: [],
          ok: false,
          error: error instanceof Error ? error.message : String(error),
          checkedAt: Date.now(),
        };
      }
      state.result = result;
      log.info(`qa-suite: ${result.ok ? `${result.diagnostics.length} diagnostics` : `unavailable: ${result.error ?? ''}`} for ${root}`);
      completed = true;
      return result;
    } finally {
      state.running = false;
      if (completed && state.dirty && !disposed.signal.aborted && !signal?.aborted) {
        state.dirty = false;
        return check(root, signal);
      }
      state.dirty = false;
    }
  }

  function schedule(root) {
    const state = states.get(root) ?? { root, result: undefined, running: false, dirty: false, timer: undefined };
    states.set(root, state);
    if (state.timer !== undefined) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.timer = undefined;
      check(root).catch(() => undefined);
    }, config.debounceMs);
  }

  return {
    schedule,
    check,
    peek(root) {
      return states.get(root)?.result;
    },
    roots() {
      return [...byRecency];
    },
    dispose() {
      // 中止在途检查（不留孤儿 tsc），并让 finally 分支在销毁后停止 dirty 重跑
      disposed.abort();
      for (const state of states.values()) {
        if (state.timer !== undefined) clearTimeout(state.timer);
      }
      states.clear();
      byRecency.length = 0;
    },
  };
```

</details>

**依据 3 · 源码核查**：[lib/commands.js:33-48](https://github.com/All3nCN/dsh-qa-suite-N23/blob/8f473567166944bf9ea94afaad294ced49034691/lib/commands.js#L33-L48)

审查 followup 没有诊断版本输入。

<details>
<summary>查看原文（16行）</summary>

```text
      const raw = invocation?.rawInput;
      const { request, outDir } = parseInvocation(raw, config.outDir);
      const local = renderOutputDir(workflowLocal, outDir);
      // PR 目标（编号/URL）模式已删除：任何非空输入都按本地审查请求处理
      const text = request.length === 0
        ? EMPTY_INPUT_PROBE + local
        : `Review request: ${request}\n\n${local}`;
      const agent = invocation?.agent;
      if (agent && typeof agent.followup === 'function') {
        agent.followup(createUserMessage({
          content: [{ type: 'text', text }],
          source: { kind: 'plugin', plugin: 'qa-suite', form: 'notice', summary: '代码审查已开始' },
        }));
      }
      return { kind: 'success', text: '代码审查已开始。' };
    },
```

</details>

#### 缺口

- 会话绑定与证据约束审查尚未实现和对照。
  **影响**：不能以合包名推断质量闸门成立。
  **进一步探讨**：以双项目及标注缺陷样本比较错根、接受率、漏报和资源。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
