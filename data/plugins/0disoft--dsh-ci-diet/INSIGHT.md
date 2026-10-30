# CI Diet

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a98294d](https://github.com/0disoft/dsh-ci-diet/tree/a98294d0946f046a92a856341cea41f63dc045dc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0disoft/dsh-ci-diet) [![npm 30d 1,248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ci-diet)
<!-- END META -->

> **功能**：发现GitHub Actions资源浪费，生成可审阅的局部工作流计划，提供DSH工具、批准恢复及样本比较。

> **亮点**：把候选覆盖、计划摘要、独立批准、备份字节和不明提交收敛串成工程流程，减少审阅材料分散；事后比较明确分开样本差值与因果/账单结论。贡献限于已接线机制，见[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

> **主要限制**：净收益不由规则命中或measure差值保证；预检可重试且故障放行，模型claims的human-cli标签不证明独立人工核实，读后rename也非OS级CAS。摘要/状态不能代替业务前提与质量验收。见[Q02](#research-q02)至[Q05](#research-q05)。

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
  - [Q01 · 相对人工查运行历史再改 YAML，它新增什么，哪些不是省钱证明？](#detail-section-11)
  - [Q02 · 预检怎样接入部署命令，何时提示，为什么不是强制优化门禁？](#detail-section-12)
  - [Q03 · 计划如何变成一次有归属的写入，失败后怎样判断到底写了没有？](#detail-section-13)
  - [Q04 · 静态、历史与测量分别要什么条件，整体成本和收益证据是什么？](#detail-section-14)
  - [Q05 · 最值得复用什么，如何推翻“这项优化值得采纳”的假设？](#detail-section-15)
  - [Q06 · 当前适合谁，以什么验收和退路开始？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有重复CI负担的工作流维护者，在质量不退化的前提下寻找净资源收益；合格结果是同类合格构建的整体改善，非候选数或安装成功。见[Q01](#research-q01)。

对照人工查Actions历史再改YAML，新增材料组织、受限局部计划与可恢复写入链；缓存、并发和保留策略属于既有CI机制。形态限制与人工核实仍在，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CLI和模型工具 | 扫描/历史/报告/局部计划 | 源码先构建；历史需gh与网络；模型不执行批准和工作流改写 |
| 审阅与恢复 | owner批准、写入、回退与状态核对 | 当前摘要/依赖/声明/备份满足，外部编辑竞态仍需验 |
| 预检提醒 | 在支持的部署命令前发现候选 | 同Agent/指纹一次提示，重试与故障放行，非强制门禁 |
| 样本比较 | 查看选定运行的时间和质量指标 | 选样与重试覆盖有限，不证明因果或账单 |

**流程与依赖**

写入要求的不只是运行环境，还包括业务前提、同一state目录、当前依赖和可用备份；历史与网络另授权，模型声明不当作独立人工原件。条件表见[Q04](#research-q04)。

将“发现候选”“准许一次改写”“确认写后状态”“判断是否值得保留”分开验收；失败先核真实字节再决定重试或回退。具体步骤见[Q04](#research-q04)。

**效果与成本**

整体成本应按合格构建计入cache/失败重跑与审阅恢复人工；缩短保留期或观察到秒数差不等实际省钱。首次、持续、失败恢复、退出明细见[Q04](#research-q04)。

现有measure有样本归属与成功/重跑信息，但明确不证明因果和账单；覆盖与资源轴决定读者能解释到哪一步。效果表见[Q04](#research-q04)，质量约束对照见[Q05](#research-q05)。

> **思考**：净收益不由规则命中或measure差值保证；预检可重试且故障放行，模型claims的human-cli标签不证明独立人工核实，读后rename也非OS级CAS。摘要/状态不能代替业务前提与质量验收。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把候选覆盖、计划摘要、独立批准、备份字节和不明提交收敛串成工程流程，减少审阅材料分散；事后比较明确分开样本差值与因果/账单结论。贡献限于已接线机制，见[Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

结果摘要优先于journal字符串、备份回读和每次rename前重核值得复用；移植须保留身份/并发/取消与业务前提。预检的可用性取舍和声明来源标签需清楚解释，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

净收益不由规则命中或measure差值保证；预检可重试且故障放行，模型claims的human-cli标签不证明独立人工核实，读后rename也非OS级CAS。摘要/状态不能代替业务前提与质量验收。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用可恢复仓库离线scan并人工复核一个候选，历史、写入与测量逐段启用；质量/净资源不改善就停止该规则，冲突保留后续编辑再合并。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持候选、批准和恢复机制；没有目标运行/故障注入或净收益验收，后续质量约束采纳是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/adapters/github/transport.ts、src/client/index.ts、src/client/review.ts、src/core/analysis/change-effect.ts、src/core/analysis/saved-measurement.ts、src/core/data/default-config.ts、src/core/history/sync.ts、src/core/patch/apply.ts、src/core/patch/approval.ts、src/core/patch/request-plan.ts、src/core/patch/verify.ts、src/core/rules/index.ts、src/core/rules/npm-cache.ts、src/core/savings/metrics.ts、src/core/savings/report-metrics.ts、src/core/scan/scan.ts、src/dsh/bootstrap.ts、src/dsh/host/plugin.ts、src/dsh/host/preflight.ts、src/dsh/host/review.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整固定inventory，定向读manifest/README、Host工具注册与preflight、Client设置/审阅RPC、owner路由、规则/静态与历史调用、计划声明/批准/校验、备份/rename/中断与回退、样本比较和成本字段。未全审全部规则/分页/解析器/锁存储内部；未执行CLI、构建、gh、作者测试、目标CI或宿主验收。
- 下一步：仅执行研究材料与装配/结构验证，没有执行目标代码、CLI/gh/模型工具、付费CI实验或真实宿主。后续在临时仓库做批准/工作区/并发和中断矩阵，再用同任务构建比较质量、全尝试资源与人工；具体见[Q03](#research-q03)、[Q05](#research-q05)。

**分析版本**

- **仓库**：[0disoft/dsh-ci-diet](https://github.com/0disoft/dsh-ci-diet)
- **版本号**：0.5.2（[固定提交 a98294d](https://github.com/0disoft/dsh-ci-diet/tree/a98294d0946f046a92a856341cea41f63dc045dc)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在已有成功/重跑指标上，把可比任务、全尝试资源、人工负担与停止规则绑定为采纳验收，检验能否减少“局部省时、整体更差”的误采纳；不是再把已有measure当新增功能。对照、推翻与回退条件见[Q05](#research-q05)，尚未执行。

仅执行研究材料与装配/结构验证，没有执行目标代码、CLI/gh/模型工具、付费CI实验或真实宿主。后续在临时仓库做批准/工作区/并发和中断矩阵，再用同任务构建比较质量、全尝试资源与人工；具体见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 2459 | — | — | 23190 |
| .md | test | 6 | 1490 | — | — | 14199 |
| .md | example | 1 | 28 | — | — | 238 |
| .mjs | source | 12 | 1733 | 1524 | 85 | — |
| .ts | source | 100 | 19737 | 17470 | 1153 | — |
| .ts | test | 53 | 14184 | 13194 | 136 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/0disoft/dsh-ci-diet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查CI候选到人工批准/局部改写/恢复和事后比较的真实链路，判断质量约束下是否值得有限试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对人工查运行历史再改 YAML，它新增什么，哪些不是省钱证明？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向维护 GitHub Actions 工作流、能审核 YAML 和验证构建质量的人。合格交付是同类合格构建的净资源负担下降，而非扫描得到若干候选。根包 0.5.2 同时声明 CLI 和原生 DSH Host/Client 入口，真实类型是插件；本 checkout 没有声明入口所需 dist 和 client 构建产物，源码使用需先按项目构建，发布包和宿主可运行性未验。

离线引擎发现工作流、解析并评规则，显式给出无历史的覆盖；DSH scan 调用引擎后保存绑定及报告，返回候选和覆盖。规则并不都产补丁，历史判断也不能由静态文件凭空取得。缓存、concurrency、timeout 和 artifact 保留是既有 CI 机制，本组件的增量是把候选、限定形态的局部补丁、审阅摘要、批准、写入恢复和事后比较串起来。

对照手工查 runs 后改文件，这减少材料分散和重复对照；但复杂工作流可能无法自动改。源码中的 npm/pnpm 缓存候选要求单一匹配的 setup-node/安装步骤、可解析工作流、已跟踪依赖等，且跳过已有缓存和不明步骤。不能把未支持的 SHA pin、混合脚本或动态目录当优化覆盖。缩短 artifact 保留改变存储，不等同于减少 runner 时间；安装本身不会省钱。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-4](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/package.json#L1-L4)

作者包版本及用途。

```text
{
  "name": "dsh-ci-diet",
  "version": "0.5.2",
  "description": "Find wasted GitHub Actions runner time and propose small, reviewable local patches.",
```

**依据 2 · 作者声明**：[package.json:22-45](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/package.json#L22-L45)

CLI、Host/Client分发路径和运行环境声明。

<details>
<summary>查看原文（24行）</summary>

```text
  "bin": {
    "ci-diet": "./dist/cli/index.js"
  },
  "exports": {
    ".": "./dist/dsh/bootstrap.js",
    "./client": {
      "types": "./client/index.d.ts",
      "default": "./client/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "client",
    "cordis.patch.yml",
    "README*.md",
    "docs/assets",
    "LICENSE"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0"
  },
  "scripts": {
```

</details>

**依据 3 · 源码核查**：[src/dsh/bootstrap.ts:1-2](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/bootstrap.ts#L1-L2)

包根Host导出接线。

```text
export { Config, apply, inject, name } from "./host/plugin.ts";
export { default } from "./host/plugin.ts";
```

**依据 4 · 源码核查**：[src/core/scan/scan.ts:84-105](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/scan/scan.ts#L84-L105)

静态发现、绑定和解析实际入口。

<details>
<summary>查看原文（22行）</summary>

```text
/** Run the offline scan: workflow text only, no network, no writes. */
export function runStaticScan(options: StaticScanOptions): StaticScanResult {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const discovery = discoverWorkflows(options.workspaceRoot, {
    ...(options.maxWorkflowBytes === undefined ? {} : { maxBytes: options.maxWorkflowBytes }),
    ...(options.fs === undefined ? {} : { fs: options.fs }),
  });
  const bindingResult = createLocalBinding(discovery.root, generatedAt, {
    ...(options.fs === undefined ? {} : { fs: options.fs }),
    ...(options.commandRunner === undefined ? {} : { commandRunner: options.commandRunner }),
  });

  const workflows: WorkflowDefinition[] = [];
  const failures: SkippedWorkflow[] = [...discovery.skipped];
  for (const file of discovery.workflows) {
    const definition = parseWorkflow(file.path, file.text);
    workflows.push(definition);
    if (definition.parseError !== null) {
      failures.push({ path: file.path, reason: "WORKFLOW_PARSE_ERROR" });
    } else if (definition.unsupported.length > 0) {
      failures.push({ path: file.path, reason: "WORKFLOW_UNSUPPORTED" });
    }
```

</details>

**依据 5 · 源码核查**：[src/dsh/host/plugin.ts:268-291](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L268-L291)

模型扫描调用引擎并写本地报告，非只读状态。

<details>
<summary>查看原文（24行）</summary>

```text
    },
    async execute(args, exec) {
      exec.signal.throwIfAborted();
      const settings = engineSettingsOf(readPluginSettings(config));
      const root = toolRoot(ctx, exec, args.cwd);
      const rules = (args.rules as readonly RuleId[] | undefined) ?? settings.enabledRules;
      const scan = runStaticScan({ workspaceRoot: root, enabledRules: rules, maxWorkflowBytes: settings.config.storage.workflowMaxBytes });
      if (!existsSync(root)) throw new Error("workspace does not exist: " + root);
      const store = PatchStore.open(stateDirOf(config), settings.config.storage);
      store.saveBinding(scan.binding);
      store.saveReport(scan.report);
      return {
        root: scan.binding.workspaceRoot,
        reportId: scan.report.reportId,
        workflowsParsed: scan.workflows.length,
        workflowsTotal: scan.workflows.length + scan.skipped.length,
        findings: scan.report.findings.map((finding) => ({
          ruleId: finding.ruleId,
          title: localizedFinding(finding, locale).title,
          patchability: finding.patchability,
          workflowPath: finding.workflowPath,
        })),
        coverage: coverageRows(scan.report.coverage),
      };
```

</details>

**依据 6 · 源码核查**：[src/core/rules/npm-cache.ts:30-48](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/rules/npm-cache.ts#L30-L48)

实际候选形态及跳过条件。

<details>
<summary>查看原文（19行）</summary>

```text
export function npmCacheTargets(workflow: WorkflowDefinition, root?: string): NpmCacheTarget[] {
  if (workflow.parseError !== null || workflow.unsupported.length > 0) return [];
  const targets: NpmCacheTarget[] = [];
  for (const job of workflow.jobs) {
    if (job.reusableWorkflow !== null || job.steps.some((step) => /cache/i.test(step.uses ?? "") || (step.uses ?? "").startsWith("./"))) continue;
    const setups = job.steps.filter((step) => /^actions\/setup-node@v[3-7](?:\.\d+){0,2}$/.test(step.uses ?? ""));
    if (setups.length !== 1 || job.steps.filter((step) => (step.uses ?? "").startsWith("actions/setup-node@")).length !== 1) continue;
    const step = setups[0]!;
    const installs = job.steps.filter((item) => /^(?:npm ci|pnpm install --frozen-lockfile)$/.test(item.run?.trim() ?? ""));
    if (installs.length !== 1) continue;
    const install = installs[0]!;
    const manager: "npm" | "pnpm" = install.run!.trim().startsWith("pnpm") ? "pnpm" : "npm";
    const checkout = job.steps.find((item) => (item.uses ?? "").startsWith("actions/checkout@"));
    if (checkout === undefined || checkout.index >= step.index || install.index <= step.index
      || checkout.withEntries.some((item) => item.key !== "fetch-depth") || checkout.otherEntries.some((item) => item.key !== "id")) continue;
    if (step.flow || step.withFlow || step.otherEntries.some((item) => item.key !== "id")
      || install.otherEntries.some((item) => !["id", "working-directory"].includes(item.key))) continue;
    if (step.withEntries.some((entry) => ["cache", "cache-dependency-path", "package-manager-cache"].includes(entry.key))) continue;
    // Unknown commands between checkout and install may mutate the dependency tree.
```

</details>

**依据 7 · 作者声明**：[README.md:55-63](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/README.md#L55-L63)

规则输出及不同资源轴的作者说明。

```text
| CD001 | on | PR runs superseded by a newer commit | `concurrency` plan |
| CD002 | on | overlapping or duplicate trigger candidates | explanation |
| CD003 | off | heavy checks for declared docs-only changes | explanation |
| CD004 | on | large, resolvable matrices | review note |
| CD005 | off | jobs without a timeout | measured `timeout-minutes` plan |
| CD006 | on | supported npm, pnpm, or Bun frozen-install jobs without an explicit cache | download-cache plan |
| CD008 | on | artifact retention longer than needed | `retention-days` plan with human attestation |

CD003 and CD005 are disabled by default. CD002, CD003, and CD004 do not produce patches. CD005 caps abnormal runs; it does not shorten normal execution. CD008 changes artifact storage retention, not runner minutes. Every plan remains a hypothesis until you review it and measure the result.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预检怎样接入部署命令，何时提示，为什么不是强制优化门禁？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host apply 实际注册 tools/pre-execute 拦截。它先尊重前序决策，只有已 allow、工具名为 bash、有 Agent、未取消且 command 是字符串才继续；工具定义还必须有 workdir 属性，避免把持久 shell 的隐含 cwd 当成已知工作区。字面命令解析拒绝替换、管道等不透明形态，并解析明确 cd/git -C 后的支持部署命令，不执行 shell 文本。

工作目录来自显式参数或当前 Agent 会话的工作目录服务；本地检查生成工作流、依赖和规则指纹。实现的 seen 是 WeakMap，以 exec.agent 对象为键，每个对象保存仓库指纹；这不是持久 session 记录。相同 Agent 对象和源码指纹第一次有候选会 deny 并返回提醒，直接重试即可通过，Agent 重建也可能再次提醒。

取消、无候选、未识别命令/工作区或无所需工具契约时保留原决定；检查异常亦放行。这是有意避免阻断部署的提示策略，没有进行网络历史采集、自动修改文件或要求用户确实完成优化。其可复用价值是低侵入提示与来源失效，不能拿“一次拒绝”证明质量政策已强制实施。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host/plugin.ts:233-241](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L233-L241)

真实Host注册。

```text
export function apply(ctx: Context, config: Config) {
  registerDefaultsMigration(ctx, () => config.defaultsRevision.get());
  registerReview(ctx, () => ({ engine: engineSettingsOf(readPluginSettings(config)),
    localApplyEnabled: typeof config.localApplyEnabled === "boolean" ? config.localApplyEnabled : config.localApplyEnabled.get() }));
  // The registry captures this text at mount time; a live locale switch needs a reload.
  const locale = resolveRequestedLocale(null, process.env);
  const t = createTranslator(locale);
  registerPreflight(ctx, () => ({ enabled: config.preflightEnabled.get(), rules: config.rules.get(), maxWorkflowBytes: config.storageWorkflowMaxBytes.get() }), () => t("dsh.preflight.notice"));
  ctx.tools.register(defineTool({
```

**依据 2 · 源码核查**：[src/dsh/host/preflight.ts:12-35](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/preflight.ts#L12-L35)

字面命令解析及不透明语法拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
/** Only literal commands; substitutions, heredocs, pipelines and script wrappers stay untouched. */
function commands(source: string): string[][] | null {
  if (source.length > 16_384) return null;
  const out: string[][] = [];
  let words: string[] = [], word = "", quote = "";
  const flushWord = () => { if (word !== "") { words.push(word); word = ""; } };
  const flush = () => { flushWord(); if (words.length > 0) out.push(words); words = []; };
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i]!;
    if (quote !== "") {
      if (ch === quote) { quote = ""; continue; }
      if ((quote === '"' && /[$`\\]/.test(ch)) || ch === "\n") return null;
      word += ch; continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if (ch === "#" && word === "") { while (i < source.length && source[i] !== "\n") i += 1; flush(); continue; }
    if (/[$`\\<>|(){}]/.test(ch)) return null;
    if (ch === "&") { if (source[++i] !== "&") return null; flush(); continue; }
    if (ch === ";" || ch === "\n") { if (words[0] === "cd") return null; flush(); continue; }
    if (/\s/.test(ch)) { flushWord(); continue; }
    word += ch;
  }
  if (quote !== "") return null;
  flush(); return out;
```

</details>

**依据 3 · 源码核查**：[src/dsh/host/preflight.ts:38-68](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/preflight.ts#L38-L68)

目录/部署命令识别范围。

<details>
<summary>查看原文（31行）</summary>

```text
/** Resolve explicit cd / git -C before a recognized publish command, without executing shell text. */
export function deploymentDirectories(command: string, cwd: string): string[] {
  const parsed = commands(command);
  if (parsed === null) return [];
  let current = cwd;
  const roots = new Set<string>();
  for (const words of parsed) {
    const [head, verb] = words;
    if (head === "cd") {
      if (words.length !== 2 || verb === "-" || verb === "~") return [];
      current = resolve(current, verb!); continue;
    }
    let args = words;
    let root = current;
    if (head === "git" && verb === "-C") {
      if (words[2] === undefined) return [];
      root = resolve(current, words[2]); args = ["git", ...words.slice(3)];
    }
    const publish = args[0] === "git" && args[1] === "push"
      || ["npm", "pnpm", "bun"].includes(args[0] ?? "") && args[1] === "publish"
      || args[0] === "yarn" && (args[1] === "publish" || args[1] === "npm" && args[2] === "publish")
      || args[0] === "wrangler" && args[1] === "deploy"
      || args[0] === "npx" && args[1] === "wrangler" && args[2] === "deploy"
      || ["npm", "pnpm", "bun"].includes(args[0] ?? "") && args[1] === "run" && args[2] === "deploy";
    if (publish && !args.some((a) => ["--dry-run", "-n", "--help", "-h", "--version"].includes(a))) roots.add(root);
    // A preceding arbitrary command could change directory or replace the workflow.
    // Do not pretend that an inspection before that command covers its output.
    if (!publish && head !== "git") return [];
    if (head === "git" && !publish && !["status", "diff", "log", "add", "commit"].includes(verb ?? "")) return [];
  }
  return roots.size <= 4 ? [...roots] : [];
```

</details>

**依据 4 · 源码核查**：[src/dsh/host/preflight.ts:114-149](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/preflight.ts#L114-L149)

WeakMap实际键、工具契约、首次提示、取消和异常放行。

<details>
<summary>查看原文（36行）</summary>

```text
/** A once-per-session/source reminder, never an automatic patch or network request. */
export function registerPreflight(ctx: Context, settings: () => PreflightSettings, notice: () => string): void {
  const seen = new WeakMap<object, Map<string, string>>();
  ctx.on("tools/pre-execute", async (exec: ToolExecution, next: () => Promise<PreToolDecision>) => {
    const decision = await next();
    if (decision.kind !== "allow" || exec.name !== "bash" || exec.agent === undefined || exec.signal.aborted) return decision;
    const args = exec.arguments as { command?: unknown; workdir?: unknown } | null;
    if (typeof args?.command !== "string") return decision;
    // Only the stateless bash contract is supported. Persistent bash may have
    // changed its own cwd, which the session directory cannot establish.
    const definition = ctx.tools.get("bash", exec.agent);
    const parameters = definition?.parameters as { properties?: Record<string, unknown> } | undefined;
    if (parameters?.properties?.workdir === undefined) return decision;
    try {
      const config = settings();
      if (!config.enabled) return decision;
      const service = ctx.get("workingDirectory") as { get(session: unknown): string } | undefined;
      const base = service?.get(exec.agent.session);
      const cwd = typeof args.workdir === "string" && isAbsolute(args.workdir) ? args.workdir
        : base === undefined ? null : resolve(base, typeof args.workdir === "string" ? args.workdir : ".");
      if (cwd === null) return decision;
      const notices = [];
      const previous = new Map(seen.get(exec.agent));
      for (const directory of deploymentDirectories(args.command, cwd)) {
        const report = inspectPreflight(directory, config);
        if (report.opportunities.length === 0 || previous.get(report.root) === report.fingerprint) continue;
        if (previous.size >= 64) previous.delete(previous.keys().next().value!);
        previous.set(report.root, report.fingerprint);
        notices.push({ cwd: report.root, opportunities: report.opportunities.slice(0, 8), total: report.opportunities.length });
      }
      if (exec.signal.aborted || notices.length === 0) return decision;
      seen.set(exec.agent, previous);
      return { kind: "deny", reason: notice() + "\n" + JSON.stringify(notices) };
    } catch {
      // Advisory inspection must never lock users out of deploying.
      return decision;
```

</details>

**依据 5 · 源码核查**：[src/dsh/host/preflight.ts:107-111](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/preflight.ts#L107-L111)

指纹由工作流、依赖和规则组成。

```text
  if (settings.rules.includes("CD001")) for (const w of workflows) {
    if (w.parseError !== null || w.unsupported.length > 0 || w.concurrency !== null || w.triggers.length !== 1 || w.triggers[0] !== "pull_request") continue;
    opportunities.push({ rule: "CD001", workflow: w.path, next: "Review whether superseded PR runs can be cancelled; ci_diet_sync requires network opt-in and plan requires human ci-only/replace-safe claims" });
  }
  return { root, opportunities, fingerprint: digestOf({ workflows: workflows.map((w) => [w.path, w.sha256]), dependencies, rules: settings.rules }) };
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 计划如何变成一次有归属的写入，失败后怎样判断到底写了没有？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

模型工具可以扫描、同步、生成计划并清理部分状态，不能调用 approve/apply/revert。界面有实际按钮和 RPC，Host 精确扩展路由经 connection.admit 后要求 owner 且是 browserPeer；服务根据所选活跃 Session 在Host解析实际工作目录，不接受请求任意给出绑定。人工键入计划摘要末12位批准，再另点 Apply；这不是摘要本身充当身份凭证，身份来自宿主围栏。

计划校验检查 payload 摘要、真实 edits 与声明规则一致、来源为 observed、期限、声明/策略、依赖摘要、覆盖、当前文件摘要和批准记录。nonce 同时绑定计划摘要/状态，并检查有效期与提供的 subjectId。批准写入用每计划锁处理 nonce/status 两步失败。摘要可以证明批准对象未变，不能证明审阅者理解内容或声明已在现实成立。

特别地，ci_diet_plan 的参数可带 claims，构建调用把 issuedBy 写成 human-cli/dsh-session，request-plan 再直接传入声明创建；所以该来源标签不能证明有独立人工核实这些前提。最终浏览器 owner 批准仍是不同动作，不能由此断言模型已经能自行批准或越权写入。

Apply 在写者租约内重核工作区身份与路径，回读备份字节，先记 PREPARED，再重读源文件，记 APPLYING 后进行临时文件写入、fsync和rename，确认结果摘要才写 APPLIED 并消费批准。每次rename重试都重查源摘要；源码同时承认读后rename并非操作系统CAS，外部编辑者并不受本工具租约约束，不能承诺无竞态。

失败不能只看返回或journal字符串：若磁盘已是计划结果，会修复已应用记录并处理批准消费；仍为原文可作为未写入处理，既非原文又非结果则要求恢复。回退若当前字节已变化，记冲突并拒绝覆盖，而非盲目恢复。取消在承诺替换前检查，进入需收尾的写入阶段不能假定取消就没有副作用。本轮没有注入故障或复现覆盖/越权。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/review.ts:697-719](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/client/review.ts#L697-L719)

Approve/Apply按钮实际调用。

<details>
<summary>查看原文（23行）</summary>

```text
                "button",
                {
                  type: "button",
                  className: "ci-diet-discard",
                  disabled: approveDisabled,
                  onClick: () => { void perform("approve", plan.id, entered.trim()); },
                },
                t("plan.approve"),
              ),
            ),
            React.createElement(
              "div",
              { className: "ci-diet-review-apply" },
              React.createElement(
                "button",
                {
                  type: "button",
                  className: "ci-diet-save",
                  disabled: !canApply,
                  onClick: () => { void perform("apply", plan.id); },
                },
                t("plan.apply"),
              ),
```

</details>

**依据 2 · 源码核查**：[src/client/review.ts:439-467](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/client/review.ts#L439-L467)

请求及结果/异常显示。

<details>
<summary>查看原文（29行）</summary>

```text
  async function perform(action: ReviewAction, id?: string, confirmation?: string, runs?: { beforeRuns: number[]; afterRuns: number[] }): Promise<void> {
    if (busy || sessionId === undefined) return;
    const generation = generationRef.current;
    setBusy(true);
    setError(null);
    setFeedback({ state: "running", reasons: [] });
    let preserveError = false;
    try {
      const payload: Record<string, unknown> = { action, sessionId };
      if (id !== undefined) payload.id = id;
      if (confirmation !== undefined) payload.confirmation = confirmation;
      if (runs !== undefined) Object.assign(payload, runs);
      const response = await ctx.connection.rpc.call("/api", "ci-diet-review", payload);
      if (generationRef.current !== generation) return;
      if (!response.ok) {
        preserveError = true;
        const message = response.error.message || t("page.loadFailed");
        setError(message);
        setFeedback({ state: "error", reasons: [message] });
      } else {
        setFeedback(actionFeedback(response.value, t));
      }
    } catch (cause) {
      if (generationRef.current !== generation) return;
      preserveError = true;
      const message = cause instanceof Error && cause.message.length > 0 ? cause.message : t("page.loadFailed");
      setError(message);
      setFeedback({ state: "error", reasons: [message] });
    }
```

</details>

**依据 3 · 源码核查**：[src/dsh/host/review.ts:192-213](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/review.ts#L192-L213)

活跃Session目录与owner/browserPeer入口围栏。

<details>
<summary>查看原文（22行）</summary>

```text
export function registerReview(ctx: Context, settings: () => ReviewSettings): void {
  // CLI-only / older hosts keep their tools even when the browser carrier is absent.
  if (typeof ctx.inject !== "function") return;
  ctx.inject(["connection", "sessions", "webServer"], (scope) => {
    const connection = scope.get("connection") as Connection;
    const sessions = scope.get("sessions") as { get(id: string): unknown };
    const service = new ReviewService((id) => {
      const session = sessions.get(id) as { header?: { cwd?: string } } | undefined;
      if (session === undefined) throw new Error("SESSION_NOT_FOUND");
      const directories = scope.get("workingDirectory") as { get(session: unknown): string } | undefined;
      const root = directories?.get(session) ?? session.header?.cwd;
      if (root === undefined) throw new Error("SESSION_WORKSPACE_UNAVAILABLE");
      return root;
    }, settings);
    // /api has one Gateway-owned RPC interceptor. Exact extension routes use
    // the public Fetch registry and retain Connection's Host/Origin/auth fence.
    scope.effect(() => connection.fetch.register({ path: REVIEW_CHANNEL + "/" + REVIEW_ENDPOINT, methods: ["POST"], requestBody: "buffered", async fetch(request) {
      const admission = connection.admit(request);
      if ("rejection" in admission || admission.peer.principal.kind !== "owner" || admission.peer.id !== connection.browserPeer.id) {
        return new Response("BROWSER_OWNER_REQUIRED", { status: 403 });
      }
      if (request.headers.get("content-type")?.split(";", 1)[0] !== "application/json") return new Response("INVALID_REQUEST", { status: 415 });
```

</details>

**依据 4 · 源码核查**：[src/dsh/host/review.ts:168-182](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/review.ts#L168-L182)

分开批准与Apply，绑定计划和subject。

<details>
<summary>查看原文（15行）</summary>

```text
    const stored = reader.readPlan(id);
    if (stored === null || stored.plan.payload.bindingId !== binding.bindingId) throw new Error("PLAN_NOT_FOUND");
    const preview = this.preview(reader, stored, settings, new Date(), workflowSourceReader(binding, settings.engine.config.storage.workflowMaxBytes));
    if (preview.blockers.length > 0) throw new Error(preview.blockers.join(", "));
    const store = PatchStore.open(stateDir, settings.engine.config.storage);
    if (request.action === "approve") {
      const approved = approvePlan({ store, planId: id, confirmation: request.confirmation ?? "", subjectId, channel: "human-ui", approvalTtlSeconds: settings.engine.config.apply.approvalTtlSeconds, now: new Date() });
      return { state: approved.plan.status.state, warnings: approved.warnings ?? [] };
    }
    // A separate explicit Apply click consumes the single-use approval. All
    // dependency, policy, TTL and backup checks remain in the patch engine.
    return applyPlan({ store, planId: id, subjectId, now: new Date(), signal,
      allowedRules: settings.engine.config.apply.allowedRules,
      approvalTtlSeconds: settings.engine.config.apply.approvalTtlSeconds,
      policyMaxAgeSeconds: settings.engine.config.apply.policyMaxAgeSeconds });
```

</details>

**依据 5 · 源码核查**：[src/core/patch/approval.ts:28-42](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/approval.ts#L28-L42)

摘要确认与每计划锁。

<details>
<summary>查看原文（15行）</summary>

```text
/** The human must type the last 12 hex characters of the plan digest. */
export function approvalConfirmation(plan: PatchPlan): string {
  return plan.planDigest.slice(-12);
}

export function approvePlan(input: ApproveInput): ApproveResult {
  // Read once to validate the id through the store before it names a lock path.
  const initial = input.store.readPlan(input.planId);
  if (initial === null) throw new Error("PLAN_NOT_FOUND: " + input.planId);
  // The approval is a two-step write (nonce, then plan status). Serialize it per
  // plan so concurrent approvers cannot leave a nonce without its status, or a
  // status pointing at a nonce that a second approval overwrote.
  const lock = acquireStoreLock(input.store, "approve-" + initial.plan.planId, APPROVE_LOCK_WAIT_MS, { clock: input.clock, ids: input.ids });
  try {
    return approveLocked(input);
```

</details>

**依据 6 · 源码核查**：[src/core/patch/approval.ts:63-90](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/approval.ts#L63-L90)

nonce/status写入及补偿。

<details>
<summary>查看原文（28行）</summary>

```text
  if (input.now.getTime() >= Date.parse(plan.payload.expiresAt)) throw new Error("PLAN_EXPIRED: " + plan.payload.expiresAt);
  if (input.confirmation.trim() !== approvalConfirmation(plan)) throw new Error("NONCE_INVALID: confirmation does not match the plan digest");
  const at = input.now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const nonce: ApprovalNonce = {
    nonceId: "n_" + digestOf({ planId: plan.planId, digest: plan.planDigest, at }).slice("sha256:".length, "sha256:".length + 24),
    planDigest: plan.planDigest,
    createdAt: at,
    subjectId: input.subjectId,
    channel: input.channel,
  };
  const approved: PatchPlan = {
    ...plan,
    status: {
      state: "approved",
      revision: plan.status.revision + 1,
      previewedAt: plan.status.previewedAt ?? at,
      approvedAt: at,
      approvalNonceId: nonce.nonceId,
    },
  };
  // A failed nonce write must leave the plan available for an explicit approval retry.
  input.store.saveNonce(plan.planId, nonce);
  try {
    input.store.updatePlanStatus(plan.planId, approved.status, plan.status.revision);
  } catch (error) {
    // Do not leave a nonce that names a status this approval never published.
    if (previous !== null) input.store.saveNonce(plan.planId, previous);
    else input.store.consumeNonce(plan.planId, nonce.nonceId);
```

</details>

**依据 7 · 源码核查**：[src/dsh/host/plugin.ts:469-476](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L469-L476)

模型计划参数接收claims，不能自行批准。

```text
      claims: {
        type: "array",
        items: { type: "string" },
        description:
          "Premises for this reviewable plan: ci-only, replace-safe, artifact-purpose:temporary|release, " +
          "consumer-min-days:N, reviewed-opaque-nodes. The tool never approves anything.",
      },
    },
```

**依据 8 · 源码核查**：[src/dsh/host/plugin.ts:553-561](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L553-L561)

模型计划构造的issuedBy标签。

```text
          minutes: request.minutes,
          finding: chosenFinding,
          coverage: report.coverage,
          claims,
          history,
          evidenceRef: "dsh:plan:" + rule,
          issuedBy: { channel: "human-cli", subjectId: "dsh-session" },
          now,
          policyMaxAgeSeconds: settings.config.apply.policyMaxAgeSeconds,
```

**依据 9 · 源码核查**：[src/core/patch/request-plan.ts:138-150](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/request-plan.ts#L138-L150)

来源标签和claims传入声明创建。

<details>
<summary>查看原文（13行）</summary>

```text
  const attestation = createAttestation({
    bindingId: input.binding.bindingId,
    workflowPath: input.workflow.path,
    workflowHash: input.workflow.sha256,
    dependencyHash: dependencyHashOf(dependencyReport.dependencies),
    scope: edit.scope,
    jobKey: edit.jobKey,
    stepKey: edit.stepKey,
    claims: input.claims,
    evidenceRefs: [input.evidenceRef],
    issuedBy: input.issuedBy,
    ...(input.attestationTtlSeconds !== undefined ? { ttlSeconds: input.attestationTtlSeconds } : {}),
    now: input.now,
```

</details>

**依据 10 · 源码核查**：[src/core/patch/verify.ts:124-154](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/verify.ts#L124-L154)

写入前关键不变量。

<details>
<summary>查看原文（31行）</summary>

```text

  if (digestOf(payload) !== input.plan.planDigest) reasons.push("PLAN_DIGEST_MISMATCH");
  // A matching digest proves unchanged bytes, not that the rule summary names
  // the actual edits. Policy selection and allowedRules must not trust a
  // different rule set, including in previously saved/externally built plans.
  const editedRules = new Set(payload.edits.map((edit) => edit.ruleId));
  const declaredRules = new Set(payload.ruleIds);
  if (editedRules.size !== declaredRules.size || declaredRules.size !== payload.ruleIds.length
    || payload.ruleIds.some((rule) => !editedRules.has(rule))) reasons.push("RULE_NOT_ALLOWED");
  if (input.plan.provenance !== "observed") reasons.push("SYNTHETIC_PLAN");
  if (isExpired(now, isoMillis(payload.expiresAt))) reasons.push("PLAN_EXPIRED");

  const attestationCheck = validAttestations(input);
  reasons.push(...attestationCheck.reasons);
  if (attestationCheck.valid.length > 0) {
    for (const edit of payload.edits) {
      if (!isPatchRule(edit.ruleId)) continue;
      const rule: PatchRule = edit.ruleId;
      if (!attestationCheck.valid.some((attestation) => attestationSatisfiesRule(rule, attestation.claims))) {
        reasons.push("ATTESTATION_CLAIMS_INSUFFICIENT");
        break;
      }
    }
  }

  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

</details>

**依据 11 · 源码核查**：[src/core/patch/apply.ts:388-397](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L388-L397)

nonce期限和可选subject比较。

<details>
<summary>查看原文（10行）</summary>

```text
function isNonceValid(nonce: ApprovalNonce | null, plan: PatchPlan, options: ApplyOptions): boolean {
  if (nonce === null) return false;
  if (plan.status.approvalNonceId !== nonce.nonceId || nonce.planDigest !== plan.planDigest) return false;
  const ttlSeconds = options.approvalTtlSeconds ?? DEFAULT_APPROVAL_TTL_SECONDS;
  const createdAt = Date.parse(nonce.createdAt);
  if (!Number.isFinite(createdAt)) return false;
  if (isExpired(options.now.getTime(), createdAt + ttlSeconds * 1000)) return false;
  if (options.subjectId !== undefined && nonce.subjectId !== options.subjectId) return false;
  return true;
}
```

</details>

**依据 12 · 源码核查**：[src/core/patch/apply.ts:579-594](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L579-L594)

备份写后回读字节。

<details>
<summary>查看原文（16行）</summary>

```text
  throwIfAborted(options.signal);
  const changeId = options.store.changeIdFor(plan.planId, options.now);
  const manifest = options.store.writeBackup(changeId, inspection.beforeText, inspection.text, plan.payload.workflowPath, options.now);
  if (manifest.beforeHash !== textHash(inspection.beforeText) || manifest.afterHash !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }
  const backup = options.store.readBackup(changeId);
  // Verify the stored bytes, not only hashes copied into the manifest. A bad
  // backup must be rejected while the original workflow is still untouched.
  if (backup === null || backup.manifest.beforeHash !== inspection.beforeHash
    || backup.manifest.afterHash !== inspection.hash
    || textHash(backup.beforeText) !== inspection.beforeHash
    || textHash(backup.afterText) !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
```

</details>

**依据 13 · 源码核查**：[src/core/patch/apply.ts:608-631](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L608-L631)

重读源、写不明状态与替换。

<details>
<summary>查看原文（24行）</summary>

```text
  // The bytes may have changed while the backup was written. Read again and
  // refuse rather than overwrite a concurrent user edit.
  const recheck = readFileSync(target, "utf8");
  if (textHash(recheck) !== inspection.beforeHash) {
    options.store.saveChange({ ...prepared, state: "NOT_APPLIED", updatedAt: iso(options.now) });
    discardBackup(options.store, changeId);
    const warnings = options.store.appendSummaryEvent({ type: "source_changed_before_replace", planId: plan.planId, changeId }, options.now);
    return { state: "not_applied", reasons: ["SOURCE_HASH_MISMATCH"], change: null, resultText: null, ...(warnings.length > 0 ? { warnings } : {}) };
  }

  // Journal the in-doubt state before touching the file, so a crash after the
  // rename is recoverable from the journal instead of looking untouched.
  const applying: AppliedChange = { ...prepared, state: "APPLYING", updatedAt: iso(options.now) };
  try {
    options.store.saveChange(applying);
  } catch (error) {
    discardBackup(options.store, changeId);
    throw error;
  }

  const mode = statSync(target).mode;
  let afterHash: string;
  try {
    afterHash = await replaceAtomically(target, inspection.text, mode, inspection.beforeHash, binding, options.signal);
```

</details>

**依据 14 · 源码核查**：[src/core/patch/apply.ts:272-286](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L272-L286)

每次rename前重核，明确不是OS CAS。

<details>
<summary>查看原文（15行）</summary>

```text
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      // Journal writes, fsync and retry waits can outlive the caller's recheck.
      // Refuse a changed target on every attempt, outside the retry catch: a
      // source conflict must never turn into an unconditional later overwrite.
      // This narrows the race; the read and rename are not an OS-level CAS.
      assertWorkspaceIdentity(binding);
      assertRegularFile(path);
      if (textHash(readFileSync(path, "utf8")) !== expectedHash) {
        throw new Error("WRITE_CONFLICT: target changed before replacement");
      }
      try {
        renameSync(temporary, path);
        renamed = true;
        return textHash(readFileSync(path, "utf8"));
```

</details>

**依据 15 · 源码核查**：[src/core/patch/apply.ts:414-431](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L414-L431)

中断应用按真实结果摘要收敛。

<details>
<summary>查看原文（18行）</summary>

```text
  options: ApplyOptions,
  plan: PatchPlan,
  targetText: string,
  targetHash: string,
  nonce: ApprovalNonce | null,
): ApplyResult | null {
  if (targetHash !== plan.payload.resultHash) return null;
  const recorded = changeForPlan(options.store, plan.planId);
  if (recorded === null) return null;
  if (recorded.before.hash !== plan.payload.sourceHash || recorded.after.hash !== plan.payload.resultHash) return null;
  const noncePending = nonce !== null && nonce.nonceId === plan.status.approvalNonceId;
  const inDoubt = recorded.state === "PREPARED" || recorded.state === "APPLYING";
  if (!inDoubt && !(recorded.state === "APPLIED" && noncePending)) return null;
  const change: AppliedChange = { ...recorded, state: "APPLIED", updatedAt: iso(options.now) };
  options.store.saveChange(change);
  const warnings = noncePending ? consumeAfterApply(options, plan, plan.status.approvalNonceId ?? "") : [];
  warnings.push(...options.store.appendSummaryEvent({ type: "apply_recovered", planId: plan.planId, changeId: change.changeId, resultHash: targetHash }, options.now));
  return { state: "applied", reasons: [], change, resultText: targetText, ...(warnings.length > 0 ? { warnings } : {}) };
```

</details>

**依据 16 · 源码核查**：[src/core/patch/apply.ts:450-470](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L450-L470)

写调用报错后的三种磁盘结果分类。

<details>
<summary>查看原文（21行）</summary>

```text
  reference: string,
  failure: unknown,
): ApplyResult {
  const landed = readTargetHash(target);
  if (landed === afterHash) {
    // The replacement did land even though the call reported an error.
    const change: AppliedChange = { ...applying, state: "APPLIED", updatedAt: iso(options.now) };
    options.store.saveChange(change);
    const warnings = consumeAfterApply(options, plan, reference);
    warnings.push("REPLACE_VERIFIED_AFTER_ERROR");
    warnings.push(...options.store.appendSummaryEvent({ type: "applied", planId: plan.planId, changeId: change.changeId, resultHash: afterHash }, options.now));
    return { state: "applied", reasons: [], change, resultText: readFileSync(target, "utf8"), warnings };
  }
  if (landed === beforeHash) {
    // The target is untouched: keep the nonce so the user can retry the apply.
    options.store.saveChange({ ...applying, state: "NOT_APPLIED", updatedAt: iso(options.now) });
    discardBackup(options.store, applying.changeId);
    throw failure;
  }
  options.store.saveChange({ ...applying, state: "RECOVERY_REQUIRED", updatedAt: iso(options.now) });
  throw failure;
```

</details>

**依据 17 · 源码核查**：[src/core/patch/apply.ts:695-716](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L695-L716)

回退按当前字节分类，不盲覆盖。

<details>
<summary>查看原文（22行）</summary>

```text
    assertWorkspaceIdentity(binding);
    const target = resolveInside(binding.workspaceRoot, change.workflowPath);
    assertRegularFile(target);
    const currentText = readFileSync(target, "utf8");
    const currentHash = textHash(currentText);
    if (currentHash !== change.after.hash) {
      if (currentHash === change.before.hash) {
        if (inDoubt) {
          // The replacement never happened; only the journal needs correcting.
          options.store.saveChange({ ...change, state: "NOT_APPLIED", updatedAt: iso(options.now) });
          discardBackup(options.store, change.changeId);
          return { state: "NOT_APPLIED", reason: "TARGET_UNCHANGED" };
        }
        // A previous revert restored the bytes but crashed before finalizing the
        // journal, or the user restored them by hand. The goal already holds, so
        // converge instead of reporting a conflict the user cannot resolve.
        options.store.saveChange({ ...change, state: "REVERTED", updatedAt: iso(options.now) });
        const warnings = options.store.appendSummaryEvent({ type: "reverted", changeId: change.changeId }, options.now);
        return { state: "REVERTED", reason: null, ...(warnings.length > 0 ? { warnings } : {}) };
      }
      options.store.saveChange({ ...change, state: "CONFLICT", updatedAt: iso(options.now) });
      return { state: "CONFLICT", reason: "CURRENT_BYTES_CHANGED" };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 静态、历史与测量分别要什么条件，整体成本和收益证据是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

静态引擎不请求网络，但CLI/模型入口会保存状态；历史同步才用用户认证的 gh，transport以GitHub.com的GET请求取数据。插件网络开关是许可条件，默认启用不等于启动即联网。模型prune会删除按保留期过期的报告、计划、缓存；该入口不删除已应用变更备份，不能把全部模型工具说成只读，也不能把清理状态和回退工作流混为一谈。

measure 把用户选的前后run与变更的before/after工作流摘要和运行身份核对，再汇总成功运行的全job时间、成功率和重跑率；其结果明确 actualBilledUsd=null、verifiedCausalSavings=false，并警告选样偏差、只统计成功耗时、先前attempt时间未收集等。API给出 observed reduction 不等于因果节省，静态估算/价目表也不是实际账单。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node声明范围与构建产物 | 必需 | CLI/Host/Client运行 | 源码checkout无dist/client入口，先构建再验 |
| 匹配DSH 0.2.x Host与Web服务 | 插件必需 | 工具、预检和owner审阅页 | 0.3.0不在声明范围；CLI可另评 |
| Git仓库、工作流及依赖锁文件 | 对应规则必需 | 来源绑定、可改形态与摘要 | 复杂或不完整输入跳过/阻止写入 |
| gh认证与Actions读权限、网络许可 | 历史/测量必需 | 有限窗口runs/jobs与策略材料 | 静态不补历史，覆盖缺失应保留 |
| 同一可写state目录与备份空间 | 保存/写入必需 | 报告、计划、批准、journal和恢复 | CLI/插件路径不同看不到同一计划；勿先删备份 |
| owner审阅与事实前提核实 | 写入必需 | 摘要批准、业务保留要求与回退 | 工具claims标签不能替人工确认 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 维护者明确仓库/state目录，离线scan | 核候选及缺失覆盖，不把解析失败当无问题 |
| 2 | 需要历史时再授权sync并核归属/范围 | 网络/权限不足就保留未知，不用静态补造历史 |
| 3 | 选择一条受支持规则，生成局部plan | 逐项看diff、业务前提和锁文件，过时重新规划 |
| 4 | owner批准摘要后另执行Apply | 当前文件/依赖/策略均匹配且备份可用；失败先读字节与journal |
| 5 | 同类运行前后measure并核质量 | 比较完整资源与失败/重跑；差异不直接当因果收益 |
| 6 | 退出/回退前核当前摘要及备份 | 有冲突人工合并；保留审计副本，禁用预检不等还原已改YAML |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地构建/扫描、API配额及可选试验CI；数值未知 | 配置路径/权限、核规则与业务前提；工时未知 | 安装本身不降低runner消耗 |
| 持续使用 | 历史状态、备份、API与runner/cache/artifact资源；未知 | 候选审阅、质量/账单跟踪与规则适配 | 缓存restore/save可能抵消下载节省 |
| 失败恢复 | 备份、重跑和可能中断交付的代价；未知 | 核磁盘/journal、处理冲突、恢复构建 | 改源文件可回退，不等追回已消耗CI或恢复过期artifact |
| 退出 | 状态归档/备份保留、回退重跑；未知 | 禁用入口、核已改工作流、审阅清理 | 清理状态不可当撤销业务修改 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 候选发现 | 静态/历史规则、覆盖与受限计划 | 真实可省范围与审阅负担 |
| 受控写入 | 归属、摘要、批准、备份、状态收敛 | 同版本宿主与文件系统故障可靠性 |
| 事后比较 | 样本身份校验、成功耗时/成功率/重跑率 | 因果归因、全重试消耗和实际账单 |
| 净收益 | 估算与账单字段分开 | 每合格构建净资源、金额和人工收益 |

本轮没有运行以上步骤、gh、CLI、目标构建或作者测试；成本均未实测，不填0。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:42-45](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/package.json#L42-L45)

Node与DSH兼容声明。

```text
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0-0 || >=0.2.2-rc.1 <0.3.0-0"
  },
  "scripts": {
```

**依据 2 · 源码核查**：[src/dsh/host/plugin.ts:317-323](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L317-L323)

只在调用sync时检查网络许可。

```text
    },
    async execute(args, exec) {
      exec.signal.throwIfAborted();
      const settings = engineSettingsOf(readPluginSettings(config));
      if (!settings.networkEnabled) throw new Error("network access is disabled; enable networkEnabled in the ci-diet settings");
      const root = toolRoot(ctx, exec, args.cwd);
      const discovery = discoverWorkflows(root, { maxBytes: settings.config.storage.workflowMaxBytes });
```

**依据 3 · 源码核查**：[src/adapters/github/transport.ts:319-327](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/adapters/github/transport.ts#L319-L327)

真实gh GET调用。

```text
  private async dispatch(path: string, etag: string | null): Promise<DispatchResult> {
    throwIfAborted(this.signal);
    const args = ["api", "--hostname", "github.com", "--method", "GET", "--include", "-H", ACCEPT, "-H", VERSION];
    if (etag !== null) args.push("-H", "If-None-Match: " + etag);
    args.push(path);
    let result: GhResult;
    try {
      result = await this.runner(args, this.timeoutMs, this.signal);
    } catch (error) {
```

**依据 4 · 源码核查**：[src/dsh/host/plugin.ts:442-455](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/plugin.ts#L442-L455)

模型prune的实际状态删除及备份边界。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(_args, exec) {
      exec.signal.throwIfAborted();
      const settings = engineSettingsOf(readPluginSettings(config));
      const store = PatchStore.open(stateDirOf(config), settings.config.storage);
      // Retention and the cache cap come from the live settings; applied-change
      // backups are never deleted here because the contract requires a human
      // confirmation token issued by the CLI listing.
      const pruned = store.prune(new Date(), {
        reportDays: settings.config.storage.reportDays,
        planDays: settings.config.storage.planDays,
        cacheDays: settings.config.storage.cacheDays,
        cacheMaxBytes: settings.config.storage.cacheMaxBytes,
      });
      return { ...pruned, ...store.storageStatus() };
```

</details>

**依据 5 · 源码核查**：[src/core/analysis/change-effect.ts:14-25](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/analysis/change-effect.ts#L14-L25)

样本身份及前后workflow摘要校验。

<details>
<summary>查看原文（12行）</summary>

```text
export function measureChangeEffect(change: AppliedChange, before: readonly ChangeEffectRun[], after: readonly ChangeEffectRun[]) {
  const blockers: string[] = [];
  if (change.state !== "APPLIED") blockers.push("CHANGE_NOT_APPLIED");
  const seen = new Set<number>();
  for (const [samples, hash] of [[before, change.before.hash], [after, change.after.hash]] as const) {
    for (const run of samples) {
      if (seen.has(run.id)) blockers.push("DUPLICATE_RUN");
      seen.add(run.id);
      if (run.workflowHash !== hash) blockers.push("WORKFLOW_HASH_MISMATCH");
      if (run.observation !== null && (run.observation.workflow !== change.workflowPath
        || run.observation.id !== run.id || run.observation.attempt !== run.attempt)) blockers.push("RUN_IDENTITY_MISMATCH");
      if ((run.conclusion === "success") !== (run.observation !== null)) blockers.push("INCOMPLETE_RUN_OBSERVATION");
```

</details>

**依据 6 · 源码核查**：[src/core/analysis/change-effect.ts:39-58](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/analysis/change-effect.ts#L39-L58)

样本指标与非因果/非账单字段。

<details>
<summary>查看原文（20行）</summary>

```text
  const comparable = blockers.length === 0;
  const summarize = (samples: readonly ChangeEffectRun[], observations: readonly RunObservation[]) => ({
    selectedRuns: samples.length,
    successes: samples.filter((run) => run.conclusion === "success").length,
    failures: samples.filter((run) => run.conclusion === "failure").length,
    otherConclusions: samples.filter((run) => !["success", "failure"].includes(run.conclusion)).length,
    successRate: samples.length ? samples.filter((run) => run.conclusion === "success").length / samples.length : null,
    rerunRate: samples.length ? samples.filter((run) => run.attempt > 1).length / samples.length : null,
    rerunAttempts: samples.reduce((sum, run) => sum + Math.max(0, run.attempt - 1), 0),
    meanSuccessfulRunnerSeconds: comparable ? observations.reduce((sum, run) => sum + run.jobs.reduce((n, job) => n + job.seconds, 0), 0) / observations.length : null,
  });
  const beforeSummary = summarize(before, left), afterSummary = summarize(after, right);
  return { schemaVersion: 2, changeId: change.changeId, planId: change.planId, planDigest: change.planDigest,
    workflowPath: change.workflowPath, comparable, blockers: [...new Set(blockers)],
    before: { ...beforeSummary, runs: before }, after: { ...afterSummary, runs: after },
    observedReductionSeconds: comparable ? beforeSummary.meanSuccessfulRunnerSeconds! - afterSummary.meanSuccessfulRunnerSeconds! : null,
    actualBilledUsd: null, verifiedCausalSavings: false,
    warnings: [...new Set(["USER_SELECTED_SAMPLES_MAY_BE_BIASED", "SUCCESSFUL_RUN_TIMES_ONLY",
      "ALL_JOB_TIME_INCLUDES_CACHE_RESTORE_AND_SAVE", "PRIOR_ATTEMPT_RUNNER_TIME_NOT_COLLECTED", "STEP_RETRIES_NOT_OBSERVABLE",
      ...comparisons.flatMap((pair) => pair.warnings)])], comparisons };
```

</details>

**依据 7 · 源码核查**：[src/core/savings/report-metrics.ts:124-136](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/savings/report-metrics.ts#L124-L136)

资源/估算/账单和用户等待未知分离。

<details>
<summary>查看原文（13行）</summary>

```text
    observedRunnerSeconds: knownSeconds(secondsFromMillis(observedMillis), "sum of confirmed job durations"),
    candidateRemovableSeconds: knownSeconds(secondsFromMillis(removedMillis), "union of removable intervals"),
    modeledRoundedMinutes: knownCount(
      scenarioMinutes,
      "baseline " + baselineMinutes + " min, scenario " + scenarioMinutes + " min after per-job rounding",
    ),
    listPriceUsd,
    estimatedMarginalUsd,
    actualBilledUsd: unknownUsd("billing_not_queried", "BILLING_NOT_QUERIED"),
    queueSeconds: unknownSeconds("queue_not_observed", unknownReason),
    executionSpanSeconds: unknownSeconds("span_not_observed", unknownReason),
    criticalPathWorkSeconds: unknownSeconds("dag_not_observed", unknownReason),
    estimatedUserWaitReductionSeconds: unknownSeconds("causality_not_observed", unknownReason),
```

</details>

**依据 8 · 源码核查**：[src/client/index.ts:375-398](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/client/index.ts#L375-L398)

设置与审阅页实际注册。

<details>
<summary>查看原文（24行）</summary>

```text
    const register = () => ctx.slots.inject("settings.section", () => ctx.slots.register({
      name: "settings.section",
      id: "ci-diet",
      order: 91,
      label: () => t("nav"),
      locale: NS,
      inject: () => { settings.connect(); return { form: settings }; },
    }, SettingsPage));
    if (ctx.effect !== undefined) ctx.effect(register);
    else register();
    const reviewContext = {
      connection: ctx.connection,
      locale: ctx.locale,
      useSessionId: () => React.useSyncExternalStore(
        (listener) => ctx.uiSession.adapter.current.subscribe(listener),
        () => ctx.uiSession.adapter.current.getSnapshot().key,
      ),
    };
    const registerReview = () => ctx.slots.inject("settings.section", () => ctx.slots.register({
      name: "settings.section", id: "ci-diet-reports", order: 92,
      label: () => ctx.locale?.bind(REVIEW_NS)("nav") ?? "CI Diet Reports",
      locale: REVIEW_NS, inject: () => ({ ctx: reviewContext }),
    }, ReviewPage));
    if (ctx.effect !== undefined) ctx.effect(registerReview);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 最值得复用什么，如何推翻“这项优化值得采纳”的假设？

**研究主题**：工程质量与复用、新假设与验证、缺陷与关键质疑

#### 完整回答

可借鉴的是把编辑对象、依赖与审批摘要绑定，且把写后结果与不明提交分别处理；恢复应以真实字节和可用备份为依据。移植到其他改配置工具时，必须一起移植归属、锁、业务前提和故障默认值，不能只复制nonce或APPLIED字符串。预检失败放行适合作提示，若任务要求强制质量政策，应另用能覆盖真实执行入口的宿主/CI门禁。

最强反例是某个成本轴下降而合格交付整体更差：缓存增加restore/save，concurrency取消仍有价值的构建，timeout中断慢但必要的任务，artifact过期使下游返工。人工键入摘要和claims标签也不证明这些业务事实已核实。当前measure明确非因果且成功样本时间不含全部先前attempt，所以不能直接拿输出差值证明省钱。

在现有成功/重跑指标之上，待验证增量是绑定可比任务、全尝试资源、人工负担和明确停止规则。未验证假设是以“质量不退化且每合格交付净资源下降”作采纳条件，比按候选分钟或样本差值直接采纳更少误改。最小对照选同一仓库一条受支持缓存工作流，固定依赖锁、runner、测试集合与近似任务量，交错冷/热缓存及改前/改后各至少10次作为探索样本。记录全job（含cache）时间、失败、取消/重跑、最终产物可用性及维护工时；需要实际金额时另对账真实计费原件。

10次不是统计充分性承诺；若净资源不下降、质量/产物受损，或审查恢复工时超过收益，则回退并否定这类任务的采纳。这个质量约束和对照方案未在本轮执行，不能计入已有实现的净收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/patch/apply.ts:579-594](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L579-L594)

可复用的备份字节核实。

<details>
<summary>查看原文（16行）</summary>

```text
  throwIfAborted(options.signal);
  const changeId = options.store.changeIdFor(plan.planId, options.now);
  const manifest = options.store.writeBackup(changeId, inspection.beforeText, inspection.text, plan.payload.workflowPath, options.now);
  if (manifest.beforeHash !== textHash(inspection.beforeText) || manifest.afterHash !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
  }
  const backup = options.store.readBackup(changeId);
  // Verify the stored bytes, not only hashes copied into the manifest. A bad
  // backup must be rejected while the original workflow is still untouched.
  if (backup === null || backup.manifest.beforeHash !== inspection.beforeHash
    || backup.manifest.afterHash !== inspection.hash
    || textHash(backup.beforeText) !== inspection.beforeHash
    || textHash(backup.afterText) !== inspection.hash) {
    discardBackup(options.store, changeId);
    return { state: "not_applied", reasons: ["BACKUP_UNAVAILABLE"], change: null, resultText: null };
```

</details>

**依据 2 · 源码核查**：[src/core/patch/apply.ts:272-286](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L272-L286)

文件系统读/换边界必须保留。

<details>
<summary>查看原文（15行）</summary>

```text
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      // Journal writes, fsync and retry waits can outlive the caller's recheck.
      // Refuse a changed target on every attempt, outside the retry catch: a
      // source conflict must never turn into an unconditional later overwrite.
      // This narrows the race; the read and rename are not an OS-level CAS.
      assertWorkspaceIdentity(binding);
      assertRegularFile(path);
      if (textHash(readFileSync(path, "utf8")) !== expectedHash) {
        throw new Error("WRITE_CONFLICT: target changed before replacement");
      }
      try {
        renameSync(temporary, path);
        renamed = true;
        return textHash(readFileSync(path, "utf8"));
```

</details>

**依据 3 · 源码核查**：[src/core/analysis/change-effect.ts:40-58](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/analysis/change-effect.ts#L40-L58)

真实比较覆盖与警告支持净收益质疑。

<details>
<summary>查看原文（19行）</summary>

```text
  const summarize = (samples: readonly ChangeEffectRun[], observations: readonly RunObservation[]) => ({
    selectedRuns: samples.length,
    successes: samples.filter((run) => run.conclusion === "success").length,
    failures: samples.filter((run) => run.conclusion === "failure").length,
    otherConclusions: samples.filter((run) => !["success", "failure"].includes(run.conclusion)).length,
    successRate: samples.length ? samples.filter((run) => run.conclusion === "success").length / samples.length : null,
    rerunRate: samples.length ? samples.filter((run) => run.attempt > 1).length / samples.length : null,
    rerunAttempts: samples.reduce((sum, run) => sum + Math.max(0, run.attempt - 1), 0),
    meanSuccessfulRunnerSeconds: comparable ? observations.reduce((sum, run) => sum + run.jobs.reduce((n, job) => n + job.seconds, 0), 0) / observations.length : null,
  });
  const beforeSummary = summarize(before, left), afterSummary = summarize(after, right);
  return { schemaVersion: 2, changeId: change.changeId, planId: change.planId, planDigest: change.planDigest,
    workflowPath: change.workflowPath, comparable, blockers: [...new Set(blockers)],
    before: { ...beforeSummary, runs: before }, after: { ...afterSummary, runs: after },
    observedReductionSeconds: comparable ? beforeSummary.meanSuccessfulRunnerSeconds! - afterSummary.meanSuccessfulRunnerSeconds! : null,
    actualBilledUsd: null, verifiedCausalSavings: false,
    warnings: [...new Set(["USER_SELECTED_SAMPLES_MAY_BE_BIASED", "SUCCESSFUL_RUN_TIMES_ONLY",
      "ALL_JOB_TIME_INCLUDES_CACHE_RESTORE_AND_SAVE", "PRIOR_ATTEMPT_RUNNER_TIME_NOT_COLLECTED", "STEP_RETRIES_NOT_OBSERVABLE",
      ...comparisons.flatMap((pair) => pair.warnings)])], comparisons };
```

</details>

**依据 4 · 作者声明**：[README.md:119-131](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/README.md#L119-L131)

作者区分缓存开销、观察差值与账单。

<details>
<summary>查看原文（13行）</summary>

```text
- A dependency cache can add restore/save time. Its overhead can exceed the installation time it avoids; compare compatible cold and warm runs and include cache steps.
- `measure` compares selected real runs and reports observed runner-time differences, success and rerun rates. The comparison covers those samples only; it does not establish the cause of a change or reproduce your bill.
- The Settings page stores tool configuration and shows session-scoped reports and plans. It does not optimize a workflow by itself.
- Source hashes, approval expiry, and policy checks can block an edit. Review the report, the diff, and the repository's own checks before keeping a change.

| Measure | Meaning |
| --- | --- |
| `observedRunnerSeconds` | Runner time observed in the collected runs |
| `modeledRoundedMinutes` | Per-job minutes rounded up; an estimate only |
| `listPriceUsd` | List-price estimate from the embedded pricing snapshot |
| `actualBilledUsd` | `unknown` until an actual bill can be proven |

Keeping these values separate prevents modeled minutes from becoming a billing claim.
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前适合谁，以什么验收和退路开始？

**研究主题**：采用判断

#### 完整回答

建议有明确重复CI负担、能审工作流并保留备份的维护者有限试用。先离线scan，确认一条确实受支持且有业务价值的候选；历史、写入和measure分阶段启用。需要安装后自动省钱、自动跨复杂工作流改写或把一次预检当强制安全政策的人不适合。

写入前逐项核对diff、claims现实前提、依赖与当前工作区，使用一致state目录。先在可恢复仓库验证取消/重试/已写但未记账的处理，再由owner批准一个计划；本研究没有执行这些操作。目标文件改动、工作区身份/备份不明或journal提示恢复时先停止写入，不盲重试；回退遇当前文件变化应保留新编辑并人工合并。

只有同类合格构建净资源改善且质量不退化、维护负担可接受时才继续。没有改善或发生错误取消、产物保留失配等，应停止该规则、按确认版本回退，恢复人工维护流程。当前不支持持续安装结论或实际金额承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/host/preflight.ts:137-149](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/dsh/host/preflight.ts#L137-L149)

提醒并不要求完成优化。

<details>
<summary>查看原文（13行）</summary>

```text
      for (const directory of deploymentDirectories(args.command, cwd)) {
        const report = inspectPreflight(directory, config);
        if (report.opportunities.length === 0 || previous.get(report.root) === report.fingerprint) continue;
        if (previous.size >= 64) previous.delete(previous.keys().next().value!);
        previous.set(report.root, report.fingerprint);
        notices.push({ cwd: report.root, opportunities: report.opportunities.slice(0, 8), total: report.opportunities.length });
      }
      if (exec.signal.aborted || notices.length === 0) return decision;
      seen.set(exec.agent, previous);
      return { kind: "deny", reason: notice() + "\n" + JSON.stringify(notices) };
    } catch {
      // Advisory inspection must never lock users out of deploying.
      return decision;
```

</details>

**依据 2 · 源码核查**：[src/core/patch/verify.ts:149-154](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/verify.ts#L149-L154)

当前依赖/覆盖/源和批准必须匹配。

```text
  if (digestOf({ dependencies: payload.dependencies }) !== input.currentDependencyHash) reasons.push("DEPENDENCY_HASH_MISMATCH");
  if (payload.blockers.length > 0) reasons.push("BLOCKERS_PRESENT");
  if (!input.coverageWriteAllowed) reasons.push("COVERAGE_INSUFFICIENT_FOR_WRITE");
  const currentHash = "sha256:" + sha256Hex(input.currentText);
  if (currentHash !== payload.sourceHash) reasons.push("SOURCE_HASH_MISMATCH");
  if (!input.nonceValid) reasons.push("NONCE_INVALID");
```

**依据 3 · 源码核查**：[src/core/patch/apply.ts:695-716](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/patch/apply.ts#L695-L716)

真实回退冲突边界。

<details>
<summary>查看原文（22行）</summary>

```text
    assertWorkspaceIdentity(binding);
    const target = resolveInside(binding.workspaceRoot, change.workflowPath);
    assertRegularFile(target);
    const currentText = readFileSync(target, "utf8");
    const currentHash = textHash(currentText);
    if (currentHash !== change.after.hash) {
      if (currentHash === change.before.hash) {
        if (inDoubt) {
          // The replacement never happened; only the journal needs correcting.
          options.store.saveChange({ ...change, state: "NOT_APPLIED", updatedAt: iso(options.now) });
          discardBackup(options.store, change.changeId);
          return { state: "NOT_APPLIED", reason: "TARGET_UNCHANGED" };
        }
        // A previous revert restored the bytes but crashed before finalizing the
        // journal, or the user restored them by hand. The goal already holds, so
        // converge instead of reporting a conflict the user cannot resolve.
        options.store.saveChange({ ...change, state: "REVERTED", updatedAt: iso(options.now) });
        const warnings = options.store.appendSummaryEvent({ type: "reverted", changeId: change.changeId }, options.now);
        return { state: "REVERTED", reason: null, ...(warnings.length > 0 ? { warnings } : {}) };
      }
      options.store.saveChange({ ...change, state: "CONFLICT", updatedAt: iso(options.now) });
      return { state: "CONFLICT", reason: "CURRENT_BYTES_CHANGED" };
```

</details>

**依据 4 · 源码核查**：[src/core/analysis/change-effect.ts:50-58](https://github.com/0disoft/dsh-ci-diet/blob/a98294d0946f046a92a856341cea41f63dc045dc/src/core/analysis/change-effect.ts#L50-L58)

继续采用应额外验质量与净收益。

```text
  const beforeSummary = summarize(before, left), afterSummary = summarize(after, right);
  return { schemaVersion: 2, changeId: change.changeId, planId: change.planId, planDigest: change.planDigest,
    workflowPath: change.workflowPath, comparable, blockers: [...new Set(blockers)],
    before: { ...beforeSummary, runs: before }, after: { ...afterSummary, runs: after },
    observedReductionSeconds: comparable ? beforeSummary.meanSuccessfulRunnerSeconds! - afterSummary.meanSuccessfulRunnerSeconds! : null,
    actualBilledUsd: null, verifiedCausalSavings: false,
    warnings: [...new Set(["USER_SELECTED_SAMPLES_MAY_BE_BIASED", "SUCCESSFUL_RUN_TIMES_ONLY",
      "ALL_JOB_TIME_INCLUDES_CACHE_RESTORE_AND_SAVE", "PRIOR_ATTEMPT_RUNNER_TIME_NOT_COLLECTED", "STEP_RETRIES_NOT_OBSERVABLE",
      ...comparisons.flatMap((pair) => pair.warnings)])], comparisons };
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
