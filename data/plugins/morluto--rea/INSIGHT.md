# REA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e18594b](https://github.com/morluto/rea/tree/e18594b24754ab95ebd119311cc32a1d1ad6fa13)

<!-- BEGIN META -->
[![GitHub ★ 413,586](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=413%2C586&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,172,617](https://img.shields.io/static/v1?label=npm+30d&message=1%2C172%2C617&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
<!-- END META -->

> **功能**：通过命令行和 MCP 提供应用与二进制逆向分析工具。

> **亮点**：固定版本将来源身份、静态分析结果、覆盖和限制放入同一证据结构，并提供可保留的摘要视图；这是相对手工记录的机制增量，不证明解释正确。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：证据哈希绑定输入与结果，无法证明对功能的推断正确；未选文件、动态路径和环境状态可改变结论，使用者仍须回查来源并进行必要对照。[Q03](#research-q03)

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
  - [Q01 · REA 的类型、目标人群和启动条件是什么？](#detail-section-11)
  - [Q02 · JavaScript 静态分析怎样从 MCP 请求形成证据？](#detail-section-12)
  - [Q03 · 分析结果如何表达覆盖，能证明什么？](#detail-section-13)
  - [Q04 · 调用失败、取消和退出需要付出什么？](#detail-section-14)
  - [Q05 · 哪些机制值得复用，后续能提出什么可证伪假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：具备逆向经验的开发者对有权检查的应用构建物开展分析，可以通过 CLI 或 MCP 请求工具；真实任务频率和收益仍缺材料。[Q01](#research-q01)

手工解包、查阅源码并自行记录证据是简单替代；它不需要该工具链，但需用户自行组织来源和覆盖信息。[Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| JavaScript 应用静态分析 | 将 ASAR 或目录分析成带来源的图 | 只分析选择范围；静态路由不证明运行可达 |
| 分析摘要 | 投影保留的完整 Evidence | 留存不可用时摘要请求先失败 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明范围内的 Node 和编译成品 | 必需 | 启动 CLI/MCP | 缺编译入口时程序报错退出 |
| MCP 客户端 | Agent 集成需要 | 发现和调用工具 | 可使用 CLI，具体支持另核 |
| 外部逆向后端 | 特定操作需要 | 执行相应分析 | 缺失时不能假定相关能力可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户检查权限、运行时与输入 | 条件不符时不启动 |
| 调用 | 用户或 Agent 选择目标及分析范围 | 请求返回结果或分类错误 |
| 验收 | 用户检查来源、覆盖与未知项 | 关键文件缺失则回原始材料 |
| 退出 | 用户停止工具并检查工作目录 | 不能假定所有临时数据自动清除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、存储及可选后端许可成本未知 | 配置和版本核对耗时未知 | 固定发布包未验证 |
| 持续使用 | worker、存储与模型费用未知 | 结果核对及复现耗时未知 | 随输入与模型配置变化 |
| 失败恢复 | 重试与残留资源未知 | 核对部分结果和清理耗时未知 | 仅部分取消阶段有保留逻辑 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 静态结果 | 工件盘点、选择、分析图与 Evidence 路径存在 | 功能理解准确率和实际运行结果 |
| 摘要投影 | 需要留存能力并投影已有证据 | 客户端可用性与总体资源成本 |

> **思考**：证据哈希绑定输入与结果，无法证明对功能的推断正确；未选文件、动态路径和环境状态可改变结论，使用者仍须回查来源并进行必要对照。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：固定版本将来源身份、静态分析结果、覆盖和限制放入同一证据结构，并提供可保留的摘要视图；这是相对手工记录的机制增量，不证明解释正确。[Q02](#research-q02) [Q03](#research-q03)

工件读取和 worker 拥有清理路径，部分中断可携带已完成 Evidence；带哈希的结果保留覆盖与限制，摘要依赖留存。真实执行和异常覆盖仍需验证。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

证据哈希绑定输入与结果，无法证明对功能的推断正确；未选文件、动态路径和环境状态可改变结论，使用者仍须回查来源并进行必要对照。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有逆向经验且具备目标检查权限的用户可在匹配 Node 的隔离环境中用已知样本试用；关键来源缺失或推断不可回查时停止使用结论，改看原始材料。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有机制依据固定版本源码，效果与未来假设均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/rea.mjs、src/server/registerElectronTools.ts、src/application/javascript/JavaScriptApplicationService.ts、src/application/javascript/JavaScriptArtifactReconstruction.ts、src/application/javascript/JavaScriptApplicationEvidence.ts、src/contracts/javascript/electronToolContracts.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本 CLI/MCP 启动和 JavaScript/Electron 静态分析代表路径；不声称检查所有 6440 个文件或所有动态与原生后端，未执行插件、发布包或目标。
- 下一步：在满足 Node 的隔离环境中，对已知行为样本记录 MCP 请求、来源、取消和临时文件，并与人工检查相同任务对照。

**分析版本**

- **仓库**：[morluto/rea](https://github.com/morluto/rea)
- **版本号**：6.8.0（[固定提交 e18594b](https://github.com/morluto/rea/tree/e18594b24754ab95ebd119311cc32a1d1ad6fa13)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在现有 Evidence 上增加功能主张的来源、未覆盖输入和反证清单，可能减少错误重实现，但会增加复核成本；同一批已知行为样本上比较正确率与总时间，若无改善或成本抵消则否定。[Q05](#research-q05)

在满足 Node 的隔离环境中，对已知行为样本记录 MCP 请求、来源、取消和临时文件，并与人工检查相同任务对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 333 | 69929 | — | — | 663348 |
| .mjs | source | 383 | 80761 | 77033 | 1829 | — |
| .ts | source | 2416 | 563694 | 515494 | 26357 | — |
| .cjs | source | 2 | 1744 | 1626 | 68 | — |
| .mjs | example | 69 | 5962 | 5653 | 150 | — |
| .mts | source | 11 | 1680 | 1510 | 60 | — |
| .mjs | test | 35 | 8918 | 8479 | 269 | — |
| .ts | test | 3008 | 925634 | 880345 | 10271 | — |
| .md | test | 3 | 151 | — | — | 1346 |
| .js | test | 5 | 96 | 91 | 1 | — |
| .ts | example | 152 | 22158 | 20300 | 1118 | — |
| .md | example | 9 | 518 | — | — | 3946 |
| .js | source | 9 | 853 | 784 | 16 | — |
| .js | example | 5 | 70 | 64 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 815](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=815&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3,529](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3%2C529&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 2,765](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2%2C765&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断开发者如何用 REA 分析 JavaScript／Electron 构建物及其证据和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · REA 的类型、目标人群和启动条件是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

REA 是独立 CLI 与 MCP 工具，而不是 DSH 原生插件。它面向具备逆向分析能力、需要理解有权限检查的构建物的开发者；用户可以让兼容 MCP 的 Agent 调用工具，或通过终端操作。根 README 描述多类目标，但本次仅沿 JavaScript／Electron 静态路径核查。相较手工读取解包源码，它集中提供分析调用和来源记录；这不证明它自动正确理解功能，也不替代目标授权和人的判断。包定义两个命令并要求特定 Node 版本；入口发现编译产物不存在时明确报错而不是自动构建。本研究环境的 Node 24.19.0 低于声明的 24.22.1 下限，未运行成品。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-65](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/README.md#L61-L65)

作者描述目标、工具和可选后端。

```text
See a feature in an app that you want in your own product? Ask your agent to investigate it with REA. It can inspect the app without its source code, explain how the feature works, show the evidence, and build a version for your project.

REA connects your agent to tools for inspecting native binaries, JavaScript and Electron apps, .NET assemblies, and websites. You can also use the same tools from your terminal. Analysis runs locally, and results include the evidence and limitations behind each conclusion.

Setup registers REA with your agent and installs matching workflow instructions. Native analysis can use an existing Hopper, Ghidra, IDA or Kuna installation; setup can optionally install Hopper with approval. Static JavaScript analysis needs no native analysis engine.
```

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/package.json#L1-L5)

包名和版本表明独立 CLI/MCP 产品。

```text
{
  "name": "rea-agents",
  "mcpName": "io.github.morluto/rea",
  "version": "6.8.0",
  "description": "Reverse engineer anything from your terminal or agent with one CLI and MCP server.",
```

**依据 3 · 源码核查**：[package.json:36-46](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/package.json#L36-L46)

两个命令入口与 Node 版本条件。

<details>
<summary>查看原文（11行）</summary>

```text
  "type": "module",
  "imports": {
    "#javascript-analysis-worker": "./dist/composition/javascriptAnalysisWorkerProcess.js",
    "#web-bundle-analysis-worker": "./dist/composition/webBundleAnalysisWorkerProcess.js"
  },
  "bin": {
    "rea": "scripts/rea.mjs",
    "rea-agents": "scripts/rea.mjs"
  },
  "engines": {
    "node": "^22.23.4 || ^24.22.1 || >=26.12.1"
```

</details>

**依据 4 · 源码核查**：[scripts/rea.mjs:45-65](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/scripts/rea.mjs#L45-L65)

缺少编译运行时的报错与 MCP 启动分支。

<details>
<summary>查看原文（21行）</summary>

```text
const runtimeFiles = [
  builtinArgumentRuntime,
  ...(isMcpMode || isMcpHttpMode
    ? ["dist/mcp/main.js"]
    : isMcpDoctorMode
      ? ["dist/mcp/main.js", "dist/cli-runtime/mcpDoctor.js"]
      : [
          "dist/cli-runtime/cli.js",
          "dist/cli-runtime/cliOutput.js",
          "dist/cli-runtime/cliResultOutput.js",
        ]),
];

if (!(await compiledRuntimeExists(runtimeFiles))) {
  process.stderr.write(
    `REA's compiled runtime is missing. Run \`npm ci && npm run build:cached\` in ${packageRoot} to install dependencies and build REA, then restart it. If this is an installed package, reinstall rea-agents.\n`,
  );
  process.exitCode = 1;
} else if (isMcpMode) {
  const { runEntrypoint } = await import("../dist/mcp/main.js");
  await runEntrypoint();
```

</details>

#### 缺口

- 没有独立用户任务和采用材料
  **影响**：无法确认需求频率或实际生产收益
  **进一步探讨**：在有权检查的固定样本上与人工分析同题比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · JavaScript 静态分析怎样从 MCP 请求形成证据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP 注册器把 analyze_javascript_application 连接到统一处理器，再将参数传给已验证服务；请求 summary 时先检查证据留存能力，然后在分析成功后投影摘要。服务解析 ASAR 头部准入设置、调用重建、校验结果并生成 Evidence。重建先盘点目标，读取选定源码，然后调用受控 worker 并构造应用图和语义图；Evidence 记录对象路径、哈希、参数、结果和限制，并标为 derived。工具输出是推导出的静态证据，不等于运行行为。源码链路存在不证明实际发布包、MCP 客户端或每种目标均可工作。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/registerElectronTools.ts:94-129](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/server/registerElectronTools.ts#L94-L129)

注册工具后调用服务并在 summary 模式保留与投影。

<details>
<summary>查看原文（36行）</summary>

```text
  server.registerTool(
    analyzeContract.name,
    toolRegistrationOptions(analyzeContract),
    (input, context) =>
      runEvidenceToolOperation(
        registration,
        analyzeContract,
        undefined,
        { input, context },
        async ({ detail, view, ...request }, { signal, progress }) => {
          if (detail === "summary") {
            const ready = requireAnalysisViewRetention(
              analyzeContract.name,
              options,
            );
            if (!ready.ok) return ready;
          }
          const analyzed = await analyzeJavaScriptApplicationValidated(
            request,
            options.artifactResources,
            {
              signal,
              progress,
              environment: options.environment,
              ...(server.analysisSettings === undefined
                ? {}
                : { settings: server.analysisSettings.read }),
            },
          );
          return detail === "summary" && analyzed.ok
            ? projectRetainedAnalysis(
                analyzed.value,
                options,
                view ?? { kind: "summary" },
              )
            : analyzed;
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:61-97](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationService.ts#L61-L97)

验证准入并调用重建。

<details>
<summary>查看原文（37行）</summary>

```text
/** Analyze input already parsed by a trusted adapter boundary. */
export const analyzeJavaScriptApplicationValidated = async (
  input: z.output<typeof analyzeJavaScriptApplicationInputSchema>,
  scope: ArtifactResourceScope,
  options: JavaScriptApplicationOptions = {},
): Promise<Result<Evidence, AnalysisError>> => {
  // An invalid setting is refused before analysis, never replaced by the default.
  const asarHeaderAdmission = parseAsarHeaderAdmission(
    options.environment?.[ASAR_HEADER_ADMISSION_SETTING],
  );
  if (!asarHeaderAdmission.ok) return asarHeaderAdmission;
  const overrides = options.settings?.().overrides;
  const header = overrides?.["asar.max_header_bytes"];
  const acceptedAdmission =
    header === undefined
      ? asarHeaderAdmission.value
      : { maximumBytes: header, source: "runtime" as const };
  let reconstructed: JavaScriptArtifactReconstructionResult | undefined;
  let result: JavaScriptApplicationAnalysisResult | undefined;
  let evidence: Evidence | undefined;
  try {
    assertJavaScriptAnalysisActive(options.signal);
    await options.progress?.report({
      phase: "analyze_javascript_application",
      completed: 0,
      total: 1,
      message: "Inventorying and parsing application artifacts",
    });
    await checkpointJavaScriptAnalysis(options.signal);
    reconstructed = await reconstructJavaScriptArtifact(
      input,
      scope,
      options.signal,
      options.progress,
      acceptedAdmission,
      overrides,
    );
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:106-120](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L106-L120)

解析输入并盘点工件。

<details>
<summary>查看原文（15行）</summary>

```text
    abortIfNeeded(signal);
    const selectedPath = absoluteCallerPath(input.input_path);
    const { path, metadata } = await resolveSelectedInput(selectedPath);
    const format = resolveFormat(path, metadata, input, selectedPath);
    const snapshot = await scanCanonicalArtifactInventoryInScope(
      path,
      {
        resourceScope: scope,
        signal,
        integrity: input.integrity_policy,
        asarHeaderAdmission,
      },
      undefined,
      selectedPath,
    );
```

</details>

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:145-156](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L145-L156)

按所选路径读取工件。

<details>
<summary>查看原文（12行）</summary>

```text
      await reportPhase(
        "read_javascript_artifacts",
        "Reading inventoried JavaScript application sources",
      );
      const files = await readJavaScriptArtifactFiles(
        reader,
        snapshot,
        scope,
        signal,
        input.source_paths,
        asarHeaderAdmission,
      );
```

</details>

**依据 5 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:183-205](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L183-L205)

构建受控 worker 并分析文件。

<details>
<summary>查看原文（23行）</summary>

```text
      const worker = await createJavaScriptSourceAnalysis(
        {
          heapMb:
            input.max_heap_mb ??
            overrides?.["javascript.max_heap_mb"] ??
            JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.heapMb,
          timeoutMs:
            input.analysis_timeout_ms ??
            overrides?.["javascript.analysis_timeout_ms"] ??
            JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.timeoutMs,
        },
        files.files.filter(
          (file) => file.kind === "javascript" && file.text.included,
        ).length,
        { scope },
      );
      let outcome;
      let cleanupFailure: AnalysisError | undefined;
      try {
        outcome = await analyzeAndAdoptJavaScriptArtifactFiles(
          files,
          worker,
          semanticProjection,
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:43-56](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationEvidence.ts#L43-L56)

生成哈希证据并关联分析图。

<details>
<summary>查看原文（14行）</summary>

```text
  await reportEvidencePhase(
    progress,
    "hash_javascript_application_evidence",
    "Hashing the complete application analysis Evidence",
  );
  const evidence = await completeJavaScriptAnalysisSteps(
    createImmutableEvidenceSteps(
      applicationSubject(snapshot),
      JAVASCRIPT_APPLICATION_PROVIDER,
      applicationObservation(input, snapshot),
    ),
    signal,
  );
  return rememberOwnedApplicationGraphEvidence(evidence, snapshot);
```

</details>

**依据 7 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

证据记录对象、推导性质和限制。

<details>
<summary>查看原文（20行）</summary>

```text
const applicationSubject = (result: JavaScriptApplicationAnalysisResult) => ({
  path: result.input_path,
  sha256: result.root_artifact_sha256,
  format: result.format,
});

const applicationObservation = (
  input: AnalyzeJavaScriptApplicationInput,
  result: JavaScriptApplicationAnalysisResult,
): EvidenceObservation => ({
  predicateType: "rea.javascript-application-analysis",
  operation: "analyze_javascript_application",
  parameters: parameters(input),
  result,
  rawResult: null,
  confidence: "derived",
  authority: "shipped-artifact",
  environment: null,
  limitations: result.limitations,
  locations: [{ kind: "artifact-path", path: "artifact-root" }],
```

</details>

#### 缺口

- 未运行固定版本 MCP 请求
  **影响**：不能断言客户端可见结果或安装成功
  **进一步探讨**：在匹配 Node 及隔离客户端中用已知 ASAR 校验输入、输出与来源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分析结果如何表达覆盖，能证明什么？

**研究主题**：缺陷与关键质疑、贡献与相对优势

#### 完整回答

重建结果带根工件哈希、盘点摘要、完整性矛盾、选择范围、应用图及分析限制；逐文件路由目录对不可读、解析失败或部分恢复分别记录状态。契约说明选择 source_paths 不会自动分析依赖，静态路由也不能证明可达或完整。相比手工记笔记，这种将来源、覆盖与推断性质放进结果的结构有利于复查；反例是哈希只能绑定字节，不能验证对语义的解释，未选或动态生成的代码可能改变真实行为。此判断不覆盖二进制和其他全部分析后端。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:56-81](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L56-L81)

结果包含工件身份、范围和限制。

<details>
<summary>查看原文（26行）</summary>

```text
/** Application-layer result retaining local diagnostics outside the canonical graph. */
export interface JavaScriptArtifactReconstructionResult {
  readonly route_inventory?: JavaScriptRouteInventory;
  readonly input_path: string;
  readonly format: "asar" | "directory";
  readonly root_artifact_sha256: string;
  readonly inventory_manifest_id: string;
  readonly inventory_graph_sha256: string;
  readonly integrity_contradictions: ArtifactInventorySnapshot["integrity_contradictions"];
  readonly source_selection?: JavaScriptSourceSelection;
  readonly graph: JavaScriptApplicationGraph;
  readonly semantic_graph: JavaScriptSemanticGraph;
  readonly electron_summary: ElectronBoundarySummary;
  readonly statistics: {
    readonly relevant_files: number;
    readonly nested_asar_containers: number;
    readonly text_bytes_read: number;
    readonly invalid_utf8_files: number;
    readonly parsed_javascript_files: number;
    readonly skipped_javascript_files: number;
    readonly visited_ast_nodes: number;
    readonly findings: number;
    readonly modules: number;
    readonly parse_failures: number;
  };
  readonly limitations: readonly string[];
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:313-353](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L313-L353)

逐文件区分解析和不可用状态。

<details>
<summary>查看原文（41行）</summary>

```text
        route_inventory: await completeJavaScriptAnalysisSteps(
          buildJavaScriptRouteInventorySteps([
            ...analysis.files
              .filter(({ file }) => file.kind === "javascript")
              .map(({ file, javascript, analysis_failure }) => ({
                key: file.path,
                next_app_context: nextAppContext(file),
                path: file.path,
                url: null,
                sha256: file.sha256,
                container_sha256: file.container_sha256,
                status:
                  javascript === null || javascript.parse_status === "failed"
                    ? ("unavailable" as const)
                    : javascript.parse_error_count > 0
                      ? ("partial" as const)
                      : ("complete" as const),
                reason: !file.text.included
                  ? file.text.reason
                  : (analysis_failure?.reason ??
                    (javascript === null
                      ? "Source analysis is unavailable"
                      : javascript.parse_status === "failed"
                        ? "Script parsing failed"
                        : javascript.parse_error_count > 0
                          ? "Script parsing recovered from errors"
                          : null)),
                facts: javascript?.routes ?? null,
              })),
            ...files.unavailable_relevant_files
              .filter((file) => file.kind === "javascript")
              .map((file) => ({
                key: file.path,
                next_app_context: nextAppContext(file),
                path: file.path,
                url: null,
                sha256: file.sha256,
                container_sha256: file.container_sha256,
                status: "unavailable" as const,
                reason: "Inventoried JavaScript source bytes are unavailable",
                facts: null,
```

</details>

**依据 3 · 作者声明**：[src/contracts/javascript/electronToolContracts.ts:110-117](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/contracts/javascript/electronToolContracts.ts#L110-L117)

作者声明选定源码、覆盖、静态路由及完整性边界。

```text
  {
    name: "analyze_javascript_application",
    ...toolContractMetadata("analyze_javascript_application"),
    description:
      "Reconstruct one local ASAR or extracted JavaScript application as an inline application graph without executing it. Returns recovered graph nodes, edges, semantic relations, integrity contradictions, limitations, and coverage. Select source_paths to acquire and analyze only exact inventoried file paths; the complete artifact inventory and identity remain intact, and unselected sources remain explicit unknowns. Dependencies are not implicitly analyzed. Select detail summary to retain the complete analysis Evidence in this session and receive only its summary view, then inspect selected modules or pages with inspect_analysis_view. Select a javascript-routes view with summary detail to query deduplicated static patterns, source-linked occurrences, source status or interpretation gaps with filters, fields and paging. Static routes do not establish reachability or the full application route set. Summary detail reduces delivery, whereas source_paths bounds source analysis. Integrity mismatches fail by default; record-and-continue retains observed bytes as untrusted and marks graph coverage partial. Timeout recovery: returned provider_timeout uses the per-source analysis_timeout_ms budget. A host-only 'timed out awaiting tools/call' needs a longer client tool deadline, not a larger analysis_timeout_ms. Never repeat the unchanged call to test whether that timeout persists; report the host setting if configuration is not editable (Codex: mcp_servers.<server>.tool_timeout_sec, seconds).",
    kind: "electron-provider",
    inputSchema: analyzeJavaScriptApplicationRequestSchema,
    outputSchema: applicationOutputSchema,
```

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:73-86](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationEvidence.ts#L73-L86)

Evidence 将分析结果明确标为 derived。

<details>
<summary>查看原文（14行）</summary>

```text
const applicationObservation = (
  input: AnalyzeJavaScriptApplicationInput,
  result: JavaScriptApplicationAnalysisResult,
): EvidenceObservation => ({
  predicateType: "rea.javascript-application-analysis",
  operation: "analyze_javascript_application",
  parameters: parameters(input),
  result,
  rawResult: null,
  confidence: "derived",
  authority: "shipped-artifact",
  environment: null,
  limitations: result.limitations,
  locations: [{ kind: "artifact-path", path: "artifact-root" }],
```

</details>

#### 缺口

- 缺少同一构建物的运行行为与人工对照
  **影响**：不能衡量真实行为覆盖率或结论正确率
  **进一步探讨**：选择包含动态路由的固定样本对照运行观察和源码推断。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 调用失败、取消和退出需要付出什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次使用需要满足 Node 和编译成品条件，Agent 使用还需配置 MCP；使用外部反编译引擎的路径另需相应后端和许可。静态路径建立工件盘点与 worker，解析资源及时间取决于输入大小；模型调用和人工验证成本取决于使用者配置，当前没有金额和耗时数据。已读源码在读取后释放 reader，worker 在 finally 中释放；重建完成后遇到中断或清理失败时，代码尝试把已完成结果包装为部分 Evidence 并返回错误，这不代表任意中断阶段都能恢复全部成果。若输出缺关键文件、范围或来源，用户应停下结论并直接查目标或更换分析路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:76-89](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/README.md#L76-L89)

作者说明配置 Agent、审批和重启步骤。

<details>
<summary>查看原文（14行）</summary>

````text
### Set up your agent

With Node.js and npm installed, run:

```bash
npx rea-agents setup
```

Choose your agents, review the proposed changes, and approve them. Setup adds
REA's MCP server and matching workflow instructions, with backups of existing
configuration. Restart your agent afterward. Setup records the selected runtime and REA
entry script directly. If acquired through a package runner, keep its cache entry
available. Run package acquisition from a trusted directory outside the target
project. Installation and recovery details are in the setup guide below.
````

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:145-164](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L145-L164)

读取后释放 reader，失败则报告清理问题。

<details>
<summary>查看原文（20行）</summary>

```text
      await reportPhase(
        "read_javascript_artifacts",
        "Reading inventoried JavaScript application sources",
      );
      const files = await readJavaScriptArtifactFiles(
        reader,
        snapshot,
        scope,
        signal,
        input.source_paths,
        asarHeaderAdmission,
      );
      // Release acquisition before analysis consumes these owned file facts.
      const earlyCleanup = await scope.release(readerOwner);
      readerOpen = false;
      if (earlyCleanup.kind === "failed")
        throw scope.cleanupFailure({ kind: "completed" }, [earlyCleanup], {
          kind: "artifact-inventory",
          inventory: snapshot,
        });
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:199-245](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L199-L245)

worker 在 finally 中释放。

<details>
<summary>查看原文（47行）</summary>

```text
      let outcome;
      let cleanupFailure: AnalysisError | undefined;
      try {
        outcome = await analyzeAndAdoptJavaScriptArtifactFiles(
          files,
          worker,
          semanticProjection,
          async (file, completed, total) => {
            abortIfNeeded(signal);
            const ast =
              javascriptArtifactAnalysisScopes[file.kind]?.authority ===
              "ast-static-analysis";
            await progress?.report({
              phase: ast
                ? "parse_javascript_source"
                : "process_javascript_artifact_metadata",
              completed: 0,
              total: 1,
              message: `${ast ? "Parsing and projecting" : "Processing metadata for"} ${file.path} (${String(completed + 1)}/${String(total)})`,
            });
            abortIfNeeded(signal);
          },
          signal,
          async (file, phase) => {
            abortIfNeeded(signal);
            await progress?.report({
              phase: `javascript_worker_${phase}`,
              completed: 0,
              total: 1,
              message: `JavaScript worker ${phase}: ${file.path}`,
            });
            abortIfNeeded(signal);
          },
        );
      } finally {
        try {
          const cleanup = await scope.release({
            kind: "javascript-source-analysis",
            analysis: worker,
            resource: `JavaScript source analyzer for ${path}`,
          });
          if (cleanup.kind === "failed") throw cleanup.cause;
        } catch (cause: unknown) {
          if (!(cause instanceof AnalysisError)) throw cause;
          cleanupFailure = cause;
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:388-413](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L388-L413)

已完成部分结果可随失败保留为 Evidence。

<details>
<summary>查看原文（26行）</summary>

```text
      await checkpointCompletedAnalysis();
      const failure =
        cleanupFailure === undefined
          ? interruption
          : interruption === null
            ? cleanupFailure
            : analysisErrorWithCleanupFailure(
                interruption,
                cleanupFailure,
                OPERATION,
              ).bindCleanupDependencies([interruption, cleanupFailure]);
      if (failure !== null) {
        const { electron_summary: summary, ...application } = completed;
        const partial = await completeJavaScriptAnalysisSteps(
          parseOwnedJavaScriptApplicationAnalysisSteps({
            ...application,
            summary,
            limitations: completed.graph.limitations,
          }),
        );
        const evidence =
          await createOwnedJavaScriptApplicationEvidenceCooperatively(
            input,
            partial,
          );
        throw failure.retainPartialObservation(evidence);
```

</details>

**依据 5 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:137-169](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationService.ts#L137-L169)

特定取消阶段尝试保留部分观察及其失败边界。

<details>
<summary>查看原文（33行）</summary>

```text
  } catch (cause: unknown) {
    if (
      cause instanceof ArtifactReaderFailure &&
      cause.reason === "cancelled" &&
      reconstructed !== undefined
    ) {
      try {
        if (result === undefined) {
          const { electron_summary: summary, ...application } = reconstructed;
          result = await completeJavaScriptAnalysisSteps(
            parseOwnedJavaScriptApplicationAnalysisSteps({
              ...application,
              summary,
              limitations: reconstructed.graph.limitations,
            }),
          );
        }
        evidence ??=
          await createOwnedJavaScriptApplicationEvidenceCooperatively(
            input,
            result,
          );
        return err(
          translateArtifactFailure(OPERATION, cause).retainPartialObservation(
            evidence,
          ),
        );
      } catch (completionCause: unknown) {
        // A validation or Evidence failure while finishing the partial result
        // remains the primary failure instead of being hidden by cancellation.
        cause = completionCause;
      }
    }
```

</details>

#### 缺口

- 未测安装、运行、清理后的资源与数据残留
  **影响**：不能估算单位任务成本或保证退出后无残留
  **进一步探讨**：隔离环境记录首次与重复任务、取消、临时文件及人工复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制值得复用，后续能提出什么可证伪假设？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可借鉴的机制是把盘点身份、静态分析结果、覆盖与限制绑定为可回查的 Evidence，并让摘要投影以前先检查留存能力。用户仍需核对每个结论是否由相关原件支持；记录本身不能保证语义正确。未验证假设是在现有证据基础上要求每个功能主张列出支持来源、未覆盖输入和反证，会降低错误重实现；它增加人工标注成本且依赖来源能完整回读。最小验证应使用同一批有已知行为的构建物，让两组分别采用原摘要和主张清单，比较错误率、遗漏和包含复核在内的总时间；若错误率无改善或成本抵消收益，则放弃。建议有逆向经验的用户对一个有权检查的已知样本先试静态路径，发现关键文件缺失或推断无法回指时停止并回到原始材料。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

证据记录对象、推断性质、参数和限制。

<details>
<summary>查看原文（20行）</summary>

```text
const applicationSubject = (result: JavaScriptApplicationAnalysisResult) => ({
  path: result.input_path,
  sha256: result.root_artifact_sha256,
  format: result.format,
});

const applicationObservation = (
  input: AnalyzeJavaScriptApplicationInput,
  result: JavaScriptApplicationAnalysisResult,
): EvidenceObservation => ({
  predicateType: "rea.javascript-application-analysis",
  operation: "analyze_javascript_application",
  parameters: parameters(input),
  result,
  rawResult: null,
  confidence: "derived",
  authority: "shipped-artifact",
  environment: null,
  limitations: result.limitations,
  locations: [{ kind: "artifact-path", path: "artifact-root" }],
```

</details>

**依据 2 · 源码核查**：[src/server/registerElectronTools.ts:103-129](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/server/registerElectronTools.ts#L103-L129)

摘要依赖留存并投影。

<details>
<summary>查看原文（27行）</summary>

```text
        async ({ detail, view, ...request }, { signal, progress }) => {
          if (detail === "summary") {
            const ready = requireAnalysisViewRetention(
              analyzeContract.name,
              options,
            );
            if (!ready.ok) return ready;
          }
          const analyzed = await analyzeJavaScriptApplicationValidated(
            request,
            options.artifactResources,
            {
              signal,
              progress,
              environment: options.environment,
              ...(server.analysisSettings === undefined
                ? {}
                : { settings: server.analysisSettings.read }),
            },
          );
          return detail === "summary" && analyzed.ok
            ? projectRetainedAnalysis(
                analyzed.value,
                options,
                view ?? { kind: "summary" },
              )
            : analyzed;
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:357-386](https://github.com/morluto/rea/blob/e18594b24754ab95ebd119311cc32a1d1ad6fa13/src/application/javascript/JavaScriptArtifactReconstruction.ts#L357-L386)

输出工件摘要、图和统计。

<details>
<summary>查看原文（30行）</summary>

```text
        input_path: path,
        format,
        root_artifact_sha256: snapshot.manifest.root_sha256,
        inventory_manifest_id: snapshot.manifest.manifest_id,
        inventory_graph_sha256: snapshot.manifest.graph_sha256,
        integrity_contradictions: snapshot.integrity_contradictions,
        ...(files.source_selection === undefined
          ? {}
          : { source_selection: files.source_selection }),
        graph,
        semantic_graph: semanticGraph,
        electron_summary: electronSummary,
        statistics: {
          relevant_files:
            files.files.length + files.unavailable_relevant_files.length,
          nested_asar_containers: files.containers.length,
          text_bytes_read: files.text_bytes_read,
          invalid_utf8_files: files.invalid_utf8_files,
          parsed_javascript_files: analysis.files.filter(
            ({ javascript }) => javascript !== null,
          ).length,
          skipped_javascript_files: analysis.files.filter(
            isSkippedJavaScriptAnalysis,
          ).length,
          visited_ast_nodes: analysis.visited_ast_nodes,
          findings: analysis.findings,
          modules: analysis.modules,
          parse_failures: analysis.parse_failures,
        },
        limitations: analysis.limitations,
```

</details>

#### 缺口

- 主张清单和对照效果没有实验
  **影响**：不能声称提高准确性或节省时间
  **进一步探讨**：用相同已知行为样本开展盲评并记录额外复核成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
