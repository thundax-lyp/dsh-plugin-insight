# REA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d157560](https://github.com/morluto/rea/tree/d157560d402fbd1b54069ff59039dcde73e4a7e1)

<!-- BEGIN META -->
[![GitHub ★ 402,720](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=402%2C720&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 954,223](https://img.shields.io/static/v1?label=npm+30d&message=954%2C223&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
<!-- END META -->

> **功能**：通过 CLI 与 MCP 统一提供应用工件、JavaScript/Electron 和多种后端的分析操作，返回带来源、推断性质与限制的证据。

> **亮点**：统一分析接口、带性质/限制的来源证据与保留视图，便于追溯而不把推断伪装运行事实，见 [Q02](#research-q02)。

> **主要限制**：身份哈希/结构/响应预算不证明语义正确或全程资源有界；抽取有写入与清理，后端可用依配置，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · REA实际交付什么，工具入口到结果是否闭合？](#detail-section-11)
  - [Q02 · 目标哈希、结构校验和摘要能证明分析结论吗？](#detail-section-12)
  - [Q03 · 环境、可选后端和退出成本如何限制采用？](#detail-section-13)
  - [Q04 · 谁先有限试用，未来增量相对现有证据层是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有逆向经验的开发者理解许可内应用构建物，本轮限工件与JS/Electron静态代表路径，见 [Q01](#research-q01)。

直接解析器/反编译器与人工记录来源，模型在外部选择和解释；REA统一契约和交付而非自动证明应用行为。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工件/JS静态分析 | 结构与功能理解素材 | 推断/限制不是运行事实 |
| Evidence/摘要 | 来源回查与交付 | 保留能力/预算非全程限 |
| 抽取 | 临时目录物化工件 | 有写入，失败清理另验 |
| 多后端 | 按目标扩展分析 | 本轮未全验，不按数量采用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 满足声明的Node/编译成品 | 必需 | CLI/MCP启动 | 当前研究Node不满足，缺dist拒启动 |
| MCP宿主/外部Agent | Agent采用必需 | 选择/解释/继续调用 | 本次已核静态链不自带模型循环 |
| 当前分析provider/目标支持 | 按任务 | 静态或可选动态后端 | tool存在不等可用 |
| 外部引擎/许可/设备 | 部分操作 | 反编译/观察 | 额外环境与权限另核 |
| 证据保留/查回与临时目录 | 摘要/抽取需要 | 完整资料和物化 | 不满足先拒或恢复需核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核固定成品/Node/测试样本 | 不启动未知后端 |
| 分析 | Agent调契约工具/provider | 实际来源/限制/推断可读 |
| 复核 | 人工对已知源码/行为 | 结构成功不当结论通过 |
| 恢复 | 查取消/部分证据/写目录 | 不无条件重做变更操作 |
| 退出 | 关会话/后端，保管资料 | 临时/保留文件分别核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/包/可选引擎许可未知 | MCP配置/样本备份/路径 | 未装固定成品 |
| 持续使用 | 解析/证据空间/模型token未知 | 解释/反证/版本维护 | 无净节时实证 |
| 失败恢复 | 部分结果/后端/抽取未知 | 分目标变化/取消/预算 | 响应预算非全程资源限 |
| 退出 | 会话/临时/证据留存未知 | 停后端/核资料清理 | 关Agent不等全清 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一入口 | 契约/取消/provider活动链 | 成品/所有后端兼容 |
| 可追溯 | inferred/links/限制/摘要保留 | 功能理解正确/完整 |
| 交付控制 | 双表示响应预算 | 计算峰值/业务净收益 |

> **思考**：身份哈希/结构/响应预算不证明语义正确或全程资源有界；抽取有写入与清理，后端可用依配置，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一分析接口、带性质/限制的来源证据与保留视图，便于追溯而不把推断伪装运行事实，见 [Q02](#research-q02)。

[Q02](#research-q02) 代表准入/来源记录/保留摘要与限制分层可借鉴，不能只复制Evidence外形或把记录数当成果。

<a id="detail-section-5"></a>

### 1.4 主要限制

身份哈希/结构/响应预算不证明语义正确或全程资源有界；抽取有写入与清理，后端可用依配置，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在匹配环境已知静态样本上试，主张不可回指或关键行为缺失则停用结论回直接解析，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的工件与JS静态核心链可核，未安装或运行，建议匹配环境已知样本的有限试用，不外推全后端。

- 已检查：作者 README、包清单、源码路径 package.json、scripts/rea.mjs、src/application/artifacts/ArtifactExtractionDestination.ts、src/application/binary/BinarySession.ts、src/application/binary/BinarySessionComposition.ts、src/application/binary/CompositeProvider.ts、src/application/binary/LazyAnalysisProvider.ts、src/application/binary/SessionProviderRouter.ts、src/application/javascript/JavaScriptApplicationService.ts、src/application/javascript/JavaScriptApplicationWorkflowEvidence.ts、src/artifacts/ArtifactProvider.ts、src/composition/auxiliaryAnalysisProviders.ts、src/composition/binary.ts、src/main.ts、src/main/deferredRuntime.ts、src/main/eagerRuntime.ts、src/main/transport.ts、src/providers/DeferredAnalysisClient.ts、src/server/createServer.ts、src/server/registerArtifactTools.ts、src/server/registerElectronTools.ts、src/server/registerEvidenceTools.ts、src/server/retainedSummaryDelivery.ts、src/server/sessionAvailabilityPolicy.ts、src/server/toolResultEncoding.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读固定bin/MCP延迟初始化/会话注入、按操作路由及Artifact公开execute→inventory与响应，并核当前JS工具注册→服务/推断证据、保留摘要、预算与可用策略。固定git不含dist，未核发布成品，未穷审原生/动态/全部格式、其他模型调用及完整清理；不执行目标。
- 下一步：符合Node后以已知源码构建物验证MCP/工件/JS推断/回查、取消/大结果/抽取中断/退出，再比直接解析的质量和总人工费用。

**分析版本**

- **仓库**：[morluto/rea](https://github.com/morluto/rea)
- **版本号**：6.8.0（[固定提交 d157560](https://github.com/morluto/rea/tree/d157560d402fbd1b54069ff59039dcde73e4a7e1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在现有Evidence之上加功能主张覆盖/反证与原行为对照门槛，测错误重实现和复核总成本，未实现，见 [Q04](#research-q04)。

符合Node后以已知源码构建物验证MCP/工件/JS推断/回查、取消/大结果/抽取中断/退出，再比直接解析的质量和总人工费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 315 | 66303 | — | — | 629660 |
| .mjs | source | 374 | 78709 | 75134 | 1733 | — |
| .ts | source | 2271 | 536880 | 491842 | 24349 | — |
| .cjs | source | 2 | 1744 | 1626 | 68 | — |
| .mjs | example | 69 | 5843 | 5539 | 147 | — |
| .mts | source | 11 | 1680 | 1510 | 60 | — |
| .mjs | test | 34 | 8223 | 7868 | 207 | — |
| .ts | test | 2866 | 881299 | 838104 | 9580 | — |
| .md | test | 3 | 143 | — | — | 1257 |
| .js | test | 5 | 96 | 91 | 1 | — |
| .ts | example | 147 | 21189 | 19417 | 1076 | — |
| .md | example | 9 | 518 | — | — | 3946 |
| .js | source | 9 | 853 | 784 | 16 | — |
| .js | example | 5 | 70 | 64 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 702](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=702&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3,342](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3%2C342&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 2,685](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2%2C685&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：当前CLI/MCP静态分析的证据和清理是否足以支持可核功能理解，哪些边界影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · REA实际交付什么，工具入口到结果是否闭合？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

固定rea-agents6.8.0是CLI/MCP分析工具，不是DSH插件，本轮已核静态工具链由外部Agent选择操作和解释结果，未穷审全部功能是否存在其他模型调用。场景是开发者在自有或许可内应用构建物中理解结构、功能和运行行为；本轮聚焦静态工件与JavaScript/Electron代表路径。相对分散解析器/反编译器脚本，增量是统一契约、目标/证据和错误表达；本次已核链中，外部Agent选工具、解释并决定下一步，不能把上游算法或支持工具数量算独创。

package bin指scripts/rea.mjs，实际检查compiled runtime后将MCP路由到dist/mcp/main.js；固定git未跟踪dist，源码与发布成品应分开。src/main以stdio或HTTP服务，deferred runtime在使用时创建真实server/providers。以inspect_artifact为例，createServer注册artifact工具，统一注册器解析输入/准入后analysis.execute、接取消信号，再生成/记录Evidence并返回CallToolResult；ArtifactProvider调用真实inventory后带limitations/sourceEvidence返回。这证明活动接口而非仅类型声明，不证明本机安装或任意格式分析成功。

正常延迟初始化调用runEager创建BinarySession，transport将{kind:session,session}注入createServer，其analysis取该会话；composition/binary将含Artifact声明的lazy辅助provider交给SessionProviderRouter，CompositeProvider按操作表选择client。打开目标时route.createClient建立会话client，execute通过active.client分派；LazyAnalysisProvider首次加载ArtifactProvider并createClient，DeferredAnalysisClient转发到ArtifactClient公开execute，inspect_artifact分支才调用私有inspectArtifact。未打开/不支持目标、无能力、已关闭client或初始化失败都可先返回错误，不能把任意注册工具当必有可执行结果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-5](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/package.json#L2-L5)

包身份/版本。

```text
  "name": "rea-agents",
  "mcpName": "io.github.morluto/rea",
  "version": "6.8.0",
  "description": "Reverse engineer anything from your terminal or agent with one CLI and MCP server.",
```

**依据 2 · 源码核查**：[scripts/rea.mjs:45-68](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/scripts/rea.mjs#L45-L68)

真实bin检查及MCP compiled路由。

<details>
<summary>查看原文（24行）</summary>

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
} else if (isMcpHttpMode) {
  const { runMcpHttpEntrypoint } = await import("../dist/mcp/main.js");
  await runMcpHttpEntrypoint(args.slice(1));
```

</details>

**依据 3 · 源码核查**：[src/main.ts:30-39](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/main.ts#L30-L39)

stdio依赖。

<details>
<summary>查看原文（10行）</summary>

```text
const runtimeDependencies = (): RuntimeDependencies => ({
  env: process.env,
  stdin: process.stdin,
  serve: serveStdio,
  writeStderr: (text) => process.stderr.write(text),
  setExitCode: (code) => {
    process.exitCode = code;
  },
  registerShutdown: registerProcessShutdown,
});
```

</details>

**依据 4 · 源码核查**：[src/main/deferredRuntime.ts:76-95](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/main/deferredRuntime.ts#L76-L95)

使用时创建server/会话清理接线。

<details>
<summary>查看原文（20行）</summary>

```text
  const [{ runEager }, { createServer }] = await Promise.all([
    import("./eagerRuntime.js"),
    import("../server/createServer.js"),
  ]);
  const result = await runEager(
    {
      ...dependencies,
      // The outer SDK transport already owns and frames this stream. Eager
      // materialization owns providers only, never another copy of raw input.
      stdin: undefined,
      registerShutdown: () => () => undefined,
      captureShutdown: (close) => {
        shutdown = close;
      },
      createServer: (source, options) => {
        if (source.kind === "session")
          closeSession = async () => {
            const result = await source.session.close({
              retainProviderDocuments: true,
            });
```

</details>

**依据 5 · 源码核查**：[src/server/createServer.ts:1267-1271](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/createServer.ts#L1267-L1271)

真实artifact注册。

```text
  };
  registerNativeTools(server, { ...evidenceOptions, evidenceById });
  registerArtifactTools(server, { ...evidenceOptions, evidenceById });
  registerManagedTools(server, { ...evidenceOptions, evidenceById });
  if (session !== undefined)
```

**依据 6 · 源码核查**：[src/server/registerArtifactTools.ts:9-19](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/registerArtifactTools.ts#L9-L19)

统一注册器及抽取目的地改写。

<details>
<summary>查看原文（11行）</summary>

```text
export const registerArtifactTools = (
  server: EvidenceMcpServer,
  options: EvidenceToolFamilyOptions,
): void => {
  registerEvidenceTools(server, ARTIFACT_TOOL_CONTRACTS, {
    ...options,
    parametersForExecution: (operation, parameters) =>
      operation === "extract_artifact"
        ? { ...parameters, output_root: createArtifactExtractionDestination() }
        : parameters,
  });
```

</details>

**依据 7 · 源码核查**：[src/server/registerEvidenceTools.ts:80-118](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/registerEvidenceTools.ts#L80-L118)

analysis执行/取消/来源/记录/响应。

<details>
<summary>查看原文（39行）</summary>

```text
            const execution = await logToolExecution(
              options.logger,
              contract.name,
              () =>
                analysis.execute(contract.name, executionParameters, {
                  signal: context.mcpReq.signal,
                  progress,
                }),
            );
            await reportOperationEnd(progress, contract.name, execution.ok);
            if (!execution.ok)
              return server.delivery.toCallToolResult(execution, contract);
            const sourceEvidence = execution.value.sourceEvidence ?? [];
            const evidence = createAnalysisExecutionEvidence(
              contract.name,
              contract.retainedSummary?.evidenceParameters === "omit-detail"
                ? providerParameters
                : parameters,
              {
                ...execution.value,
                subject:
                  execution.value.subject === undefined
                    ? (options.activeTarget?.() ?? null)
                    : execution.value.subject,
              },
              "observed",
            );
            const sourceRecorded = recordEvidenceSources(
              options.recordEvidence,
              sourceEvidence,
            );
            if (!sourceRecorded.ok)
              return server.delivery.toCallToolResult(sourceRecorded, contract);
            const projected =
              delivery?.projectEvidence(parameters, evidence) ?? ok(evidence);
            if (!projected.ok)
              return server.delivery.toCallToolResult(projected, contract);
            const recorded = options.recordEvidence?.(projected.value);
            return server.delivery.toEvidenceToolResult(
```

</details>

**依据 8 · 源码核查**：[src/artifacts/ArtifactProvider.ts:474-520](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L474-L520)

真实inventory→Evidence与limitations。

<details>
<summary>查看原文（47行）</summary>

```text
  private async inspectArtifact(
    parameters: Readonly<Record<string, JsonValue>>,
    options?: ExecutionOptions,
  ) {
    const parsed = artifactInventoryInputSchema.parse(parameters);
    const inventoryParameters = {
      integrity_policy: parsed.integrity_policy,
    };
    await options?.progress?.report({
      phase: "inspect_artifact.inventory",
      completed: 0,
      total: 1,
      message: "inventory substep started",
    });
    // The freshly parsed inventory is exclusively owned here. Sealing it lets
    // the nested Evidence share it instead of cloning and re-digesting it.
    const inventory = freezeJsonSnapshot(
      await this.inventory(inventoryParameters, options),
    );
    const subject = subjectFor(
      artifactTargetSelectedPath(this.target),
      inventory.manifest,
    );
    const inventoryEvidence = createEvidence(subject, ARTIFACT_GRAPH_PROVIDER, {
      operation: "inventory_artifact",
      parameters: inventoryParameters,
      result: inventory,
      rawResult: null,
      limitations: inventory.limitations,
      // The nested inventory already names every occurrence's logical path.
      locations: [],
    });
    // The returned execution and its Evidence then reuse this owned report.
    const result = freezeJsonSnapshot(
      createArtifactInspection(inventoryEvidence),
    );
    await options?.progress?.report({
      phase: "inspect_artifact.inventory",
      completed: 1,
      total: 1,
      message: "inventory substep completed",
    });
    return ok(
      createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
        rawResult: null,
        limitations: result.limitations,
        sourceEvidence: artifactInspectionSources(result),
```

</details>

**依据 9 · 源码核查**：[src/main/eagerRuntime.ts:40-46](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/main/eagerRuntime.ts#L40-L46)

正常创建BinarySession。

```text
  const logger = createLogger("mcp", config.value.logLevel);
  const serverLogger = logger.child({ layer: "server" });
  const analysisSettings = new AnalysisSettings(environment);
  const session = createBinarySession(
    config.value,
    logger,
    environment,
```

**依据 10 · 源码核查**：[src/main/transport.ts:137-145](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/main/transport.ts#L137-L145)

真实session注入server。

```text
          const server = (dependencies.createServer ?? createServer)(
            { kind: "session", session },
            {
              ...(serverContext.analysisSettings === undefined
                ? {}
                : { analysisSettings: serverContext.analysisSettings }),
              logger: serverContext.logger,
              environment: serverContext.environment,
              delivery: serverContext.delivery,
```

**依据 11 · 源码核查**：[src/server/createServer.ts:444-450](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/createServer.ts#L444-L450)

analysis选择session。

```text
export const createServer = (
  source: ServerAnalysisSource,
  options: CreateServerOptions = {},
): EvidenceMcpServer => {
  const session = source.kind === "session" ? source.session : undefined;
  const analysis = source.kind === "session" ? source.session : source.analysis;
  const environment = snapshotEnvironment(options.environment ?? process.env);
```

**依据 12 · 源码核查**：[src/composition/binary.ts:70-92](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/composition/binary.ts#L70-L92)

lazy辅助provider装配到正常会话。

<details>
<summary>查看原文（23行）</summary>

```text
  const auxiliaryDeclarations = auxiliaryAnalysisProviderDeclarations(
    environment,
    process.platform,
    settings,
  );
  const nativeInspectionAvailable =
    inspection !== undefined &&
    auxiliaryDeclarations.some(({ capabilities }) =>
      capabilities.some(
        ({ operation, available }) => operation === inspection && available,
      ),
    );
  return composeBinarySession(
    new AnalysisProviderRegistry(
      [hopper, ghidra, ida, kuna],
      config.analysisProvider,
      nativeInspectionAvailable ? isAppleDispatchMetadataTarget : undefined,
    ),
    auxiliaryDeclarations.map(
      (declaration) => new LazyAnalysisProvider(declaration),
    ),
    createBundleResourceFactory(environment, process.platform, settings),
  );
```

</details>

**依据 13 · 源码核查**：[src/composition/auxiliaryAnalysisProviders.ts:20-34](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/composition/auxiliaryAnalysisProviders.ts#L20-L34)

真实ArtifactProvider加载声明。

<details>
<summary>查看原文（15行）</summary>

```text
export const auxiliaryAnalysisProviderDeclarations = (
  selectedEnvironment: Readonly<NodeJS.ProcessEnv>,
  platform: NodeJS.Platform = process.platform,
  settings?: AnalysisSettingsReader,
): readonly AuxiliaryProviderDeclaration[] => {
  const environment = snapshotEnvironment(selectedEnvironment, platform);
  return [
    {
      identity: ARTIFACT_GRAPH_PROVIDER,
      capabilities: artifactCapabilities(platform),
      load: async () => {
        const { ArtifactProvider } =
          await import("../artifacts/ArtifactProvider.js");
        return new ArtifactProvider(environment, platform, settings);
      },
```

</details>

**依据 14 · 源码核查**：[src/application/binary/BinarySessionComposition.ts:12-21](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/BinarySessionComposition.ts#L12-L21)

会话路由构造。

<details>
<summary>查看原文（10行）</summary>

```text
export const composeBinarySession = (
  registry: AnalysisProviderRegistry,
  auxiliaryProviders: readonly AnalysisProvider[] = [],
  bundleResourceFactory?: BundleResourceClientFactory,
): BinarySession =>
  new BinarySession(
    SessionProviderRouter.selectable(registry, auxiliaryProviders),
    new InvestigationRecords(),
    bundleResourceFactory,
  );
```

</details>

**依据 15 · 源码核查**：[src/application/binary/SessionProviderRouter.ts:129-164](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/SessionProviderRouter.ts#L129-L164)

组合路由与createClient。

<details>
<summary>查看原文（36行）</summary>

```text
const selectableRoute = (
  auxiliaryProviders: readonly AnalysisProvider[],
  selection: AnalysisProviderSelection | undefined,
): SessionProviderRoute => {
  const binding = selection?.binding ?? null;
  const providers = [
    ...auxiliaryProviders,
    ...(binding === null ? [] : [binding.provider]),
  ];
  const provider =
    binding === null && providers.length === 1
      ? providers[0]
      : providers.length === 0
        ? undefined
        : new CompositeProvider(
            providers,
            binding?.createClient === undefined
              ? new Map()
              : new Map([[binding.identity.id, binding.createClient]]),
          );
  const identity = provider?.identity() ?? emptyProviderIdentity();
  // The binding attributes deep-provider capabilities to the resolved version.
  const capabilities = capabilityMap([
    ...auxiliaryProviders.flatMap((auxiliary) => auxiliary.capabilities()),
    ...(binding?.capabilities ?? []),
  ]);
  return {
    identity,
    capabilities,
    profile: binding?.profile ?? null,
    binding,
    selection,
    createClient: (target, context) =>
      provider?.createClient(target, binding?.profile, context) ??
      emptyClient(identity),
  };
```

</details>

**依据 16 · 源码核查**：[src/application/binary/CompositeProvider.ts:150-165](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/CompositeProvider.ts#L150-L165)

操作到provider分派表。

<details>
<summary>查看原文（16行）</summary>

```text
        providers.map((provider) => provider.identity()),
      ),
    );
    const routes = new Map<string, AnalysisProvider>();
    const capabilities: CapabilityDescriptor[] = [];
    for (const provider of providers) {
      for (const descriptor of provider.capabilities()) {
        if (routes.has(descriptor.operation))
          throw new TypeError(
            `Multiple providers declare operation ${descriptor.operation}`,
          );
        routes.set(descriptor.operation, provider);
        capabilities.push(descriptor);
      }
    }
    this.#providerByOperation = routes;
```

</details>

**依据 17 · 源码核查**：[src/application/binary/CompositeProvider.ts:183-239](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/CompositeProvider.ts#L183-L239)

client创建/关闭/操作分派。

<details>
<summary>查看原文（57行）</summary>

```text
  createClient(
    target: BinaryTarget,
    profile?: AnalysisProfileCommitment,
    context?: AnalysisClientContext,
  ): AnalysisClient {
    const clients = new Map<AnalysisProvider, AnalysisClient>();
    const clientFor = (provider: AnalysisProvider): AnalysisClient => {
      const existing = clients.get(provider);
      if (existing !== undefined) return existing;
      const providerProfile =
        profile?.provider.id === provider.identity().id ? profile : undefined;
      const factory = this.#boundClientFactories.get(provider.identity().id);
      const created =
        factory !== undefined && providerProfile !== undefined
          ? factory(target, providerProfile, context)
          : provider.createClient(target, providerProfile, context);
      clients.set(provider, created);
      return created;
    };
    let closed = false;
    const closeClients = closeCompositeClients(this.#identity, clients);
    const close: AnalysisClient["close"] = (options) => {
      closed = true;
      return closeClients(options);
    };
    return {
      executeIfReady: (operation, parameters, options) => {
        const provider = this.#providerByOperation.get(operation);
        const client =
          provider === undefined || closed ? undefined : clients.get(provider);
        return (
          client?.executeIfReady?.(operation, parameters, options) ??
          Promise.resolve(undefined)
        );
      },
      execute: async (operation, parameters, options) => {
        if (closed)
          return err(
            new ProviderAdapterError(this.#identity.id, operation, {
              diagnostics: { reason: "client_closed" },
            }),
          );
        if (operation === "health")
          return executeCompositeHealth(this.#identity, clients, options);
        const provider = this.#providerByOperation.get(operation);
        return provider === undefined
          ? Promise.resolve(
              err(
                new AnalysisCapabilityUnavailableError(
                  this.#identity.id,
                  operation,
                  "operation is not declared by this provider set",
                ),
              ),
            )
          : clientFor(provider).execute(operation, parameters, options);
      },
```

</details>

**依据 18 · 源码核查**：[src/application/binary/BinarySession.ts:635-642](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/BinarySession.ts#L635-L642)

打开目标建立活动client并健康检查。

```text
    const runId = randomUUID();
    const client = route.createClient(target, {
      runId,
    });
    const run: SessionRun = { client, route, runId };
    const started = await client.execute("health", {}, options);
    if (!started.ok) {
      return err(await this.#failedOpen(run, previous, started.error));
```

**依据 19 · 源码核查**：[src/application/binary/BinarySession.ts:1204-1225](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/BinarySession.ts#L1204-L1225)

正常会话execute实际调用active.client。

<details>
<summary>查看原文（22行）</summary>

```text
    const prepared = prepareSessionExecution({
      active: this.#active,
      operation: name,
      parameters: arguments_,
      nativeSourceAdmitted: this.#active?.nativeSourceAdmitted === true,
      unboundOperationError: (operation, route) =>
        this.#providerRouter.unboundOperationError(operation, route),
      lookupSnapshot: (target, profile, operation, parameters) =>
        this.lookupSnapshot(target, profile, operation, parameters),
    });
    if (!prepared.ok) return prepared;
    const { active, capability, profile, cacheable, cached } = prepared.value;
    if (cached !== undefined) return ok(cached);
    // A failed reply cannot prove that a dispatched metadata write rolled back.
    // Stop replay before dispatch, including reads overlapping the write.
    if (capability.effects.mutatesArtifact) this.invalidateSnapshot();
    const call = active.client.execute(name, arguments_, options);
    const result = unrecordedExecution(await call);
    const profiled = bindExecutionTarget(
      commitExecutionProfile(name, result, profile),
      name,
      active.target,
```

</details>

**依据 20 · 源码核查**：[src/application/binary/LazyAnalysisProvider.ts:46-61](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/binary/LazyAnalysisProvider.ts#L46-L61)

lazy client加载真实provider。

<details>
<summary>查看原文（16行）</summary>

```text
  createClient(
    target: BinaryTarget,
    profile?: AnalysisProfileCommitment,
    context?: AnalysisClientContext,
  ): AnalysisClient {
    return new DeferredAnalysisClient(async (signal) => {
      const provider = await this.#load();
      if (signal.aborted)
        throw new AnalysisCancelledError("create_analysis_client", {
          cause: signal.reason,
        });
      return provider.createClient(target, profile, context);
    }, this.#providerIdentity.id);
  }

  async #load(): Promise<AnalysisProvider> {
```

</details>

**依据 21 · 源码核查**：[src/providers/DeferredAnalysisClient.ts:40-54](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/providers/DeferredAnalysisClient.ts#L40-L54)

实际client加载后执行转发。

<details>
<summary>查看原文（15行）</summary>

```text
  execute: AnalysisClient["execute"] = async (
    operation,
    parameters,
    options,
  ) => {
    try {
      const loaded = await this.#creation.acquire(operation, options?.signal);
      if (!loaded.ok) return loaded;
      if (this.#creation.readyClient !== loaded.value)
        return err(
          new ProviderAdapterError(this.#providerId, operation, {
            diagnostics: { reason: "client_closed" },
          }),
        );
      return await loaded.value.execute(operation, parameters, options);
```

</details>

**依据 22 · 源码核查**：[src/artifacts/ArtifactProvider.ts:84-90](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L84-L90)

公开工厂建立ArtifactClient。

```text
  createClient(target: BinaryTarget): AnalysisClient {
    return new ArtifactClient(
      target,
      this.environment,
      this.#platform,
      this.settings,
    );
```

**依据 23 · 源码核查**：[src/artifacts/ArtifactProvider.ts:221-242](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L221-L242)

公开execute识别inspect_artifact后调用私有方法。

<details>
<summary>查看原文（22行）</summary>

```text
  async execute(
    operation: AnalysisOperation,
    parameters: Readonly<Record<string, JsonValue>>,
    options?: ExecutionOptions,
  ) {
    if (operation === "health")
      return ok(createAnalysisExecution(null, ARTIFACT_GRAPH_PROVIDER));
    if (!isArtifactOperation(operation))
      return err(
        new AnalysisCapabilityUnavailableError(
          ARTIFACT_GRAPH_PROVIDER.id,
          operation,
          "Operation is not implemented by artifact graph provider.",
        ),
      );
    try {
      const targetRefusal = artifactTargetRefusal(operation, this.target);
      if (targetRefusal !== undefined)
        throw this.unsupportedTarget(operation, targetRefusal.reason);
      if (operation === "inspect_artifact") {
        const inspected = await this.inspectArtifact(parameters, options);
        return inspected;
```

</details>

#### 缺口

- 未检查已发布dist内容、实际MCP启动或分析任务。
  **影响**：源码链不能承诺安装成品等价、Host兼容或分析正确率。
  **进一步探讨**：核固定发布成品与源码对应，在符合引擎环境用已知样本验证发现、调用、证据返回和退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标哈希、结构校验和摘要能证明分析结论吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

当前JavaScript服务先验证输入/ASAR限制，重建工件图，再校跨图元数据并创建哈希Evidence；feature和semantic trace仍明确inferred/analyst-inference、limitations和evidenceLinks。这是可追溯推断，不是实测功能或完整控制流证明，动态加载/环境差异仍需反证。

本轮补核工件路径：inventory传所选路径与expectedRootSha256，inspect结果保留limitations与sourceEvidence；抽取则把服务端选择的临时UUID目录传执行器，具有实际文件物化副作用。摘要模式在没有保留/查回证据能力时先拒绝，detail只影响交付投影，不改变底层分析；输出编码按文本及结构表示预算拒超量，不能推整个分析CPU/内存均有该上限。标记目标内容不可信依赖Agent遵守，不是阻断提示注入的保证。操作成功、哈希一致与unknown数量都不替代功能解释验收。

工件检查接线的正常路径是会话注入、组合provider按operation选择、延迟ArtifactClient公开execute到inspectArtifact；并非从抽象analysis.execute直接假定任意私有方法可达，完整原件接线见Q01。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:48-58](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/javascript/JavaScriptApplicationService.ts#L48-L58)

当前输入验证。

<details>
<summary>查看原文（11行）</summary>

```text
export const analyzeJavaScriptApplication = async (
  rawInput: unknown,
  scope: ArtifactResourceScope,
  options: JavaScriptApplicationOptions = {},
): Promise<Result<Evidence, AnalysisError>> => {
  const parsed = analyzeJavaScriptApplicationInputSchema.safeParse(rawInput);
  if (!parsed.success)
    return err(
      analysisInputErrorFromIssues(OPERATION, parsed.error.issues, rawInput),
    );
  return analyzeJavaScriptApplicationValidated(parsed.data, scope, options);
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:89-126](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/javascript/JavaScriptApplicationService.ts#L89-L126)

重建/跨图/哈希接线。

<details>
<summary>查看原文（38行）</summary>

```text
    await checkpointJavaScriptAnalysis(options.signal);
    reconstructed = await reconstructJavaScriptArtifact(
      input,
      scope,
      options.signal,
      options.progress,
      acceptedAdmission,
      overrides,
    );
    const { electron_summary: summary, ...application } = reconstructed;
    await options.progress?.report({
      phase: "validate_javascript_application_result",
      completed: 0,
      total: 1,
      message: "Validating result metadata and cross-graph bindings",
    });
    await checkpointJavaScriptAnalysis(options.signal);
    result = await completeJavaScriptAnalysisSteps(
      parseOwnedJavaScriptApplicationAnalysisSteps({
        ...application,
        summary,
        limitations: reconstructed.graph.limitations,
      }),
      options.signal,
    );
    await options.progress?.report({
      phase: "create_javascript_application_evidence",
      completed: 0,
      total: 1,
      message: "Creating and hashing application analysis Evidence",
    });
    await checkpointJavaScriptAnalysis(options.signal);
    evidence = await createOwnedJavaScriptApplicationEvidenceCooperatively(
      input,
      result,
      options.signal,
      options.progress,
    );
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptApplicationWorkflowEvidence.ts:18-46](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/javascript/JavaScriptApplicationWorkflowEvidence.ts#L18-L46)

当前两类推断证据的明确性质与链接。

<details>
<summary>查看原文（29行）</summary>

```text
  createEvidence(undefined, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, {
    predicateType: "rea.application-feature-trace",
    operation: "trace_application_feature",
    parameters,
    result,
    rawResult: null,
    confidence: "inferred",
    authority: "analyst-inference",
    environment: null,
    limitations: result.limitations,
    evidenceLinks: result.evidence_links,
  });

/** Create derived Evidence for one bounded JavaScript semantic trace. */
export const createJavaScriptSemanticTraceEvidence = (
  parameters: EvidenceObservation["parameters"],
  result: JavaScriptSemanticTraceResult,
): Evidence =>
  createEvidence(undefined, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, {
    predicateType: "rea.javascript-semantic-trace",
    operation: "trace_javascript_semantics",
    parameters,
    result,
    rawResult: null,
    confidence: "inferred",
    authority: "analyst-inference",
    environment: null,
    limitations: result.limitations,
    evidenceLinks: result.evidence_links,
```

</details>

**依据 4 · 源码核查**：[src/artifacts/ArtifactProvider.ts:529-547](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L529-L547)

inventory真实路径/根身份/取消参数。

<details>
<summary>查看原文（19行）</summary>

```text
      readonly integrity_policy: "fail" | "record-and-continue";
    },
    options?: ExecutionOptions,
  ) {
    return inventoryArtifact(this.target.sourcePath ?? this.target.path, {
      expectedRootSha256:
        this.target.bundleInfoPlist === undefined
          ? this.target.sha256
          : undefined,
      selectedPath: this.target.artifactSelectedPath,
      resourceScope: this.#resourceScope,
      environment: this.environment,
      asarHeaderAdmission: runtimeAsarHeaderAdmission(
        this.environment,
        this.settings,
      ),
      ...(options?.signal === undefined ? {} : { signal: options.signal }),
      integrity: parsed.integrity_policy,
    });
```

</details>

**依据 5 · 源码核查**：[src/artifacts/ArtifactProvider.ts:324-345](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L324-L345)

extract实际写入参数。

<details>
<summary>查看原文（22行）</summary>

```text
      if (operation === "extract_artifact") {
        const parsed = artifactExtractionExecutionSchema.parse(parameters);
        const result = await extractArtifact(
          {
            inputPath: this.target.sourcePath ?? this.target.path,
            expectedRootSha256:
              this.target.bundleInfoPlist === undefined
                ? this.target.sha256
                : undefined,
            selectedPath: this.target.artifactSelectedPath,
            inputFormat: this.target.format,
            outputRoot: parsed.output_root,
            environment: this.environment,
            asarHeaderAdmission: runtimeAsarHeaderAdmission(
              this.environment,
              this.settings,
            ),
            integrityPolicy: parsed.integrity_policy,
            resourceScope: this.#resourceScope,
          },
          options?.signal,
        );
```

</details>

**依据 6 · 源码核查**：[src/application/artifacts/ArtifactExtractionDestination.ts:1-7](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/artifacts/ArtifactExtractionDestination.ts#L1-L7)

服务端临时UUID目录。

```text
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { absoluteCallerPath } from "../../filesystem/callerPath.js";

/** Choose a fresh temporary destination for an artifact extraction. */
export const createArtifactExtractionDestination = (): string =>
  absoluteCallerPath(`${tmpdir()}/rea-extracted-${randomUUID()}`);
```

**依据 7 · 源码核查**：[src/server/retainedSummaryDelivery.ts:29-47](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/retainedSummaryDelivery.ts#L29-L47)

无retention先拒摘要，投影不改分析。

<details>
<summary>查看原文（19行）</summary>

```text
export const retainedSummaryDelivery = (
  operation: string,
  options: Pick<EvidenceToolFamilyOptions, "recordEvidence" | "evidenceById">,
) => {
  const retention = {
    recordEvidence: options.recordEvidence,
    evidenceById: options.evidenceById,
  };
  const selected = (parameters: Parameters): boolean =>
    parameters.detail === "summary";
  return {
    preflight: (parameters: Parameters) =>
      selected(parameters)
        ? requireAnalysisViewRetention(operation, retention)
        : ok(null),
    projectEvidence: (parameters: Parameters, evidence: Evidence) =>
      selected(parameters)
        ? summarizeRetainedAnalysis(evidence, retention)
        : ok(evidence),
```

</details>

**依据 8 · 源码核查**：[src/server/toolResultEncoding.ts:94-126](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/toolResultEncoding.ts#L94-L126)

响应双表示预算非全计算资源预算。

<details>
<summary>查看原文（33行）</summary>

```text
/** Account for the delivered JSON representations before allocating the complete text. */
export const encodeToolResult = (
  value: JsonValue,
  budgetBytes: number,
  representations: ToolResultRepresentations = "structured-and-text",
  targetContent = false,
): ToolResultEncoding => {
  const structured = representations === "structured-and-text";
  const parts: string[] = [];
  let bytes =
    (structured ? RESULT_ENVELOPE_BYTES : ERROR_RESULT_ENVELOPE_BYTES) +
    (targetContent ? TARGET_CONTENT_META_BYTES : 0);
  let codeUnits = bytes;
  for (const part of bufferedJsonParts(jsonParts(value))) {
    const escapedPart = JSON.stringify(part);
    bytes +=
      (structured ? Buffer.byteLength(part) : 0) +
      Buffer.byteLength(escapedPart) -
      2;
    codeUnits += (structured ? part.length : 0) + escapedPart.length - 2;
    if (bytes > budgetBytes || codeUnits > MCP_RESULT_STRING_LIMIT)
      return {
        ok: false,
        bytesAtLeast: bytes,
        codeUnitsAtLeast: codeUnits,
        constraint:
          codeUnits > MCP_RESULT_STRING_LIMIT
            ? "string-length"
            : "receive-buffer",
      };
    parts.push(part);
  }
  return { ok: true, text: parts.join(""), bytes };
```

</details>

**依据 9 · 源码核查**：[src/server/createServer.ts:1307-1315](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/createServer.ts#L1307-L1315)

当前真实Electron/JS工具注册。

```text
  registerElectronTools(server, {
    ...common,
    artifactResources,
    environment,
    evidenceById,
    electron: options.electronObservation,
    electronActive: options.electronActiveObservation,
    electronFuses,
    observationLoadFailure:
```

**依据 10 · 源码核查**：[src/server/registerElectronTools.ts:93-130](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/registerElectronTools.ts#L93-L130)

工具调用JS服务并在摘要时预检保留再投影。

<details>
<summary>查看原文（38行）</summary>

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
        },
      ),
```

</details>

#### 缺口

- 未以真实已知源码样本核重建/推断完整性、所有抽取失败清理或资源峰值。
  **影响**：不能把可追溯结构、摘要可查回或响应有界升级为逆向结论正确、全程资源/恢复保障。
  **进一步探讨**：对已知源码构建物逐条回指推断，制造内容变化/取消/大输出/抽取中断，核临时目录和保留证据完整性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 环境、可选后端和退出成本如何限制采用？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Node声明^22.23.4或^24.22.1或>=26.12.1；本研究宿主Node24.19.0不满足目标引擎，因此只读不能升级运行验证。静态JS与工件检查不同于原生动态分析；Hopper/Ghidra/IDA/JADX等按任务另配，许可、运行时、宿主/设备权限不能由MCP目录替代。availability默认关闭多类可选观察/恢复，已配置仍受主机支持限制，工具名字存在不是当前可调。

首次需符合Node、取得/核对编译包、备份MCP配置和静态样本，持续有解析/保留工件/证据空间、模型解释token与人工反证；动态或专有后端再算许可/进程/设备成本，金额与耗时未知。失败要分目标改变、解析不支持、取消/结果预算、部分保留与抽取目录；MCP服务/会话/外部引擎和抽取文件要分别清理，退出不等只关Agent。源码清理所有权设计不等全部失败路径已验，不能把静态建议外推全部provider。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:43-49](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/package.json#L43-L49)

严格Node引擎。

```text
    "rea-agents": "scripts/rea.mjs"
  },
  "engines": {
    "node": "^22.23.4 || ^24.22.1 || >=26.12.1"
  },
  "packageManager": "npm@11.16.0",
  "files": [
```

**依据 2 · 源码核查**：[scripts/rea.mjs:58-65](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/scripts/rea.mjs#L58-L65)

缺compiled明确失败，不静默运行另一实现。

```text
if (!(await compiledRuntimeExists(runtimeFiles))) {
  process.stderr.write(
    `REA's compiled runtime is missing. Run \`npm ci && npm run build:cached\` in ${packageRoot} to install dependencies and build REA, then restart it. If this is an installed package, reinstall rea-agents.\n`,
  );
  process.exitCode = 1;
} else if (isMcpMode) {
  const { runEntrypoint } = await import("../dist/mcp/main.js");
  await runEntrypoint();
```

**依据 3 · 源码核查**：[src/server/sessionAvailabilityPolicy.ts:46-87](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/sessionAvailabilityPolicy.ts#L46-L87)

可选能力默认与主机支持边界。

<details>
<summary>查看原文（42行）</summary>

```text
/** Select configured availability reporting or the target-free defaults. */
export const sessionAvailabilityPolicy = (
  configured: (() => AvailabilityPolicy) | undefined,
  defaults: SessionAvailabilityDefaults,
): (() => AvailabilityPolicy) => {
  const policy =
    configured ??
    (() => ({
      packetCaptureEnabled:
        defaults.optionalFeatures?.packetCaptureEnabled ?? false,
      signalRecordingEnabled:
        defaults.optionalFeatures?.signalRecordingEnabled ?? false,
      wasmArtifactEnabled:
        defaults.optionalFeatures?.wasmArtifactEnabled ?? false,
      evmInterfaceEnabled:
        defaults.optionalFeatures?.evmInterfaceEnabled ?? false,
      processCaptureEnabled: platform !== "win32",
      recordedCrashEnabled:
        defaults.optionalFeatures?.recordedCrashEnabled ?? false,
      binaryLayoutEnabled:
        defaults.optionalFeatures?.binaryLayoutEnabled ?? false,
      firmwareInspectionEnabled:
        defaults.optionalFeatures?.firmwareInspectionEnabled ?? false,
      firmwareExtractionEnabled:
        defaults.optionalFeatures?.firmwareExtractionEnabled ?? false,
      javascriptRecoveryEnabled:
        defaults.optionalFeatures?.javascriptRecoveryEnabled ?? false,
      webModuleResolutionEnabled:
        defaults.optionalFeatures?.webModuleResolutionEnabled ?? false,
      browserObservationEnabled:
        defaults.optionalFeatures?.browserObservationEnabled ?? false,
      browserScenarioEnabled:
        defaults.optionalFeatures?.browserScenarioEnabled ?? false,
      electronObservationEnabled:
        defaults.optionalFeatures?.electronObservationEnabled ?? false,
      electronAutomationEnabled:
        defaults.optionalFeatures?.electronAutomationEnabled ?? false,
      v8InspectorObservationEnabled:
        defaults.optionalFeatures?.v8InspectorObservationEnabled ?? false,
    }));
  // Observed host support also bounds a configured policy: no policy lets the
  // default providers pass their execution host checks.
```

</details>

**依据 4 · 源码核查**：[src/main/deferredRuntime.ts:59-74](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/main/deferredRuntime.ts#L59-L74)

启动阶段清理与失败聚合。

<details>
<summary>查看原文（16行）</summary>

```text
  server.ownRuntimeCleanup(async () => {
    if (shutdown !== undefined) return shutdown();
    const results = await Promise.allSettled([
      server.closePartialRuntime(),
      (async () => {
        if (!sessionClosed && closeSession !== undefined) {
          await closeSession();
          sessionClosed = true;
        }
      })(),
    ]);
    const failures = results.flatMap((result) =>
      result.status === "rejected" ? [result.reason] : [],
    );
    if (failures.length > 0)
      throw new AggregateError(failures, "MCP startup cleanup failed");
```

</details>

**依据 5 · 源码核查**：[src/server/registerArtifactTools.ts:15-18](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/registerArtifactTools.ts#L15-L18)

抽取分配额外写入资源。

```text
    parametersForExecution: (operation, parameters) =>
      operation === "extract_artifact"
        ? { ...parameters, output_root: createArtifactExtractionDestination() }
        : parameters,
```

#### 缺口

- 各平台/后端启动、取消/清理和单位正确分析总成本未测。
  **影响**：不能将统一CLI理解为免环境配置，也不能给出准确资源、许可或恢复费用。
  **进一步探讨**：符合引擎的隔离环境仅启所需静态路径，测样本/大文件/取消/退出及证据和临时文件，再决定新增后端。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁先有限试用，未来增量相对现有证据层是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议有逆向经验且运行时匹配的开发者，在已知源码的非敏感JS/Electron构建物或小归档上有限试用静态路径；普通只查一项字符串时直接解析器更简单。证据可追溯仍不是语义正确；摘要保留和抽取写入也不等全工具已经验收。

未来方向应在已有inferred/links/limitations和保留视图之上，把每项准备重实现的功能主张绑定覆盖范围、反证样本和原行为对照；当前Evidence标签只是基础，不能重复包装成新贡献。用同一已知源码构建物比较直接分析器、当前REA、主张对照门槛版的虚构边/动态遗漏/错误重实现、复核总时间与模型成本；若只多结构材料而不降错，或维护负担高于收益，则否定。未实现；查不回证据、关键路径缺失或清理不完整时停止使用该结论并回原解析/源码映射人工核。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptApplicationWorkflowEvidence.ts:18-46](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/application/javascript/JavaScriptApplicationWorkflowEvidence.ts#L18-L46)

现有推断和limitations基础。

<details>
<summary>查看原文（29行）</summary>

```text
  createEvidence(undefined, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, {
    predicateType: "rea.application-feature-trace",
    operation: "trace_application_feature",
    parameters,
    result,
    rawResult: null,
    confidence: "inferred",
    authority: "analyst-inference",
    environment: null,
    limitations: result.limitations,
    evidenceLinks: result.evidence_links,
  });

/** Create derived Evidence for one bounded JavaScript semantic trace. */
export const createJavaScriptSemanticTraceEvidence = (
  parameters: EvidenceObservation["parameters"],
  result: JavaScriptSemanticTraceResult,
): Evidence =>
  createEvidence(undefined, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, {
    predicateType: "rea.javascript-semantic-trace",
    operation: "trace_javascript_semantics",
    parameters,
    result,
    rawResult: null,
    confidence: "inferred",
    authority: "analyst-inference",
    environment: null,
    limitations: result.limitations,
    evidenceLinks: result.evidence_links,
```

</details>

**依据 2 · 源码核查**：[src/server/retainedSummaryDelivery.ts:29-47](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/server/retainedSummaryDelivery.ts#L29-L47)

当前摘要依保留证据，不应重复算新功能。

<details>
<summary>查看原文（19行）</summary>

```text
export const retainedSummaryDelivery = (
  operation: string,
  options: Pick<EvidenceToolFamilyOptions, "recordEvidence" | "evidenceById">,
) => {
  const retention = {
    recordEvidence: options.recordEvidence,
    evidenceById: options.evidenceById,
  };
  const selected = (parameters: Parameters): boolean =>
    parameters.detail === "summary";
  return {
    preflight: (parameters: Parameters) =>
      selected(parameters)
        ? requireAnalysisViewRetention(operation, retention)
        : ok(null),
    projectEvidence: (parameters: Parameters, evidence: Evidence) =>
      selected(parameters)
        ? summarizeRetainedAnalysis(evidence, retention)
        : ok(evidence),
```

</details>

**依据 3 · 源码核查**：[src/artifacts/ArtifactProvider.ts:497-520](https://github.com/morluto/rea/blob/d157560d402fbd1b54069ff59039dcde73e4a7e1/src/artifacts/ArtifactProvider.ts#L497-L520)

当前工件来源/限制证据基础。

<details>
<summary>查看原文（24行）</summary>

```text
    const inventoryEvidence = createEvidence(subject, ARTIFACT_GRAPH_PROVIDER, {
      operation: "inventory_artifact",
      parameters: inventoryParameters,
      result: inventory,
      rawResult: null,
      limitations: inventory.limitations,
      // The nested inventory already names every occurrence's logical path.
      locations: [],
    });
    // The returned execution and its Evidence then reuse this owned report.
    const result = freezeJsonSnapshot(
      createArtifactInspection(inventoryEvidence),
    );
    await options?.progress?.report({
      phase: "inspect_artifact.inventory",
      completed: 1,
      total: 1,
      message: "inventory substep completed",
    });
    return ok(
      createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
        rawResult: null,
        limitations: result.limitations,
        sourceEvidence: artifactInspectionSources(result),
```

</details>

#### 缺口

- 没有新任务对照/真实用户需求强度或主张门槛收益样本。
  **影响**：不能把未来证据覆盖门槛计当前贡献，也不能声称工具结构已改善重实现质量或节时。
  **进一步探讨**：盲核许可内已知源码样本的功能主张与反证，记录错误、遗漏、回查/清理和总人工成本，达不到对照则止。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
