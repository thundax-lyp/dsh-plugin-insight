# REA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f624c3b](https://github.com/morluto/rea/tree/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97)

<!-- BEGIN META -->
[![GitHub ★ 433,920](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=433%2C920&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,542,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C542%2C817&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
<!-- END META -->

> **功能**：独立CLI/MCP逆向工具，为构建物静态分析生成带身份、覆盖和限制的可回查Evidence。

> **亮点**：[Q02](#research-q02)将工件/AST图与身份参数/限制放入Evidence；[Q03](#research-q03)完整来源留存后再摘要；[Q04](#research-q04)资源所有权/受限部分结果。

> **主要限制**：[Q03](#research-q03)hash/图不证功能正确，选源不含依赖/动态；[Q04](#research-q04)release可park、partial有阶段条件，scope和清理失败须核。

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
  - [Q01 · REA的真实类型、使用者和运行前提是什么？](#detail-section-11)
  - [Q02 · JS/Electron静态请求怎样经过真实解析而生成Evidence？](#detail-section-12)
  - [Q03 · 覆盖、摘要与哈希怎样帮助复核，又不能证明什么？](#detail-section-13)
  - [Q04 · 取消和失败如何释放/保留，采用和恢复成本在哪？](#detail-section-14)
  - [Q05 · 可证伪的生产方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：REA/rea-agents6.8.0是独立CLI和MCP逆向工具，非DSH原生插件；目标是具备逆向经验、对有权检查的构建物理解功能/来源的开发者。Agent选择工具和解释/重实现来自所接宿主/模型，REA提供分析与证据，不是自动保证复刻正确的端到端Agent。基线是手工解包/读源码、反编译器和笔记；合格结果须功能主张可回到原件、覆盖范围明确且经必要行为对照，不是图很大/哈希一致。

手工解包/源码阅读/反编译器与笔记，现成Babel和逆向后端提供基础解析；Agent理解来自宿主/模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| JS静态链 | 工件解析/图 | 非目标运行/依赖不隐读 |
| Evidence | 身份/覆盖/限制 | hash不证语义 |
| 摘要投影 | 控制响应/回源 | 先留全session Evidence |
| worker资源 | heap/timeout/partial | park非立即退出/阶段恢复 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失/边界 |
|---|---|---|---|
| 声明Node范围/dist成品 | 必需 | CLI/MCP/worker | 工程24.19不匹配，未运行 |
| MCP宿主/模型 | Agent按需 | 选择工具/解释 | CLI可独立，客户端另核 |
| 有权目标副本/OS读取/ps | 静态必需 | 盘点解析/进程归属 | 非租户授权/通用沙箱 |
| 特定逆向后端/许可 | 对应路径 | 原生/动态分析 | 不由JS链证明可用 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 匹配Node/dist、有权已知副本 | 核后端和资源权限 |
| 盘点 | 明确完整输入/选源 | 依赖不自动分析 |
| 分析 | 留全Evidence再摘要 | 无父Evidence不用摘要结论 |
| 复核 | 回原件/coverage/行为对照 | derived非运行事实 |
| 退出 | 核partial、关闭scope/worker归属 | 清理失败先解决不重跑 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/机器/后端许可未知 | 环境/目标/范围配置 | CLI非DSH直接安装 |
| 持续 | CPU/heap/worker/模型未知 | 读图/回源/行为复核 | summary只减传输 |
| 故障 | 重算/部分证据/残留未知 | 查scope/阶段清理 | partial非任意恢复 |
| 退出 | Evidence/原件留存未知 | 归档与worker/临时核清 | parked须scope关闭 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 静态派生 | 真Babel/AST/图链 | 功能理解/重实现正确率 |
| 来源覆盖 | hash/selection/limitations | 未选/动态运行行为 |
| 摘要 | 先留全来源再投影 | 跨重启永久留存/净成本 |
| 失败 | 阶段partial/资源所有权 | 真实取消/无残留恢复 |

> **思考**：[Q03](#research-q03)hash/图不证功能正确，选源不含依赖/动态；[Q04](#research-q04)release可park、partial有阶段条件，scope和清理失败须核。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)将工件/AST图与身份参数/限制放入Evidence；[Q03](#research-q03)完整来源留存后再摘要；[Q04](#research-q04)资源所有权/受限部分结果。

[Q02](#research-q02)静态解析进程/证据来源和预算、[Q03](#research-q03)摘要留存前置可借鉴；[Q04](#research-q04)release/park/close和partial阶段须分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)hash/图不证功能正确，选源不含依赖/动态；[Q04](#research-q04)release可park、partial有阶段条件，scope和清理失败须核。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)匹配环境/有权已知样本静态小试，保原件和全Evidence；范围/清理不明停重跑，回行为对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持JS/Electron静态实际worker解析与Evidence边界；匹配Node/已知样本受限试用，未执行或全后端审计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/rea.mjs、src/application/analysisView/AnalysisViewService.ts、src/application/javascript/JavaScriptApplicationEvidence.ts、src/application/javascript/JavaScriptApplicationService.ts、src/application/javascript/JavaScriptArtifactAnalysis.ts、src/application/javascript/JavaScriptArtifactReconstruction.ts、src/artifacts/javascript/JavaScriptSourceAnalysis.ts、src/composition/javascriptAnalysisWorkerProcess.ts、src/contracts/javascript/electronToolContracts.ts、src/domain/javascript/javascriptSourceParser.ts、src/javascript/analysis/JavaScriptAnalysisWorker.ts、src/process/OwnedWorkerRuntime.ts、src/process/ProviderProcess.ts、src/server/registerElectronTools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings重新复核；核CLI/MCP入口及JS/Electron静态盘点/读源/受控worker/Babel/图/Evidence、覆盖/摘要留存和取消/资源park/close代表链；未全审6818文件、原生/.NET/网页/动态后端及全部安全/配置/测试。
- 下一步：只读固定源码，不运行REA/worker/样本/MCP/后端或测试；工具Node24.19低于目标声明范围，无运行/行为/效益或全平台资源保证。

**分析版本**

- **仓库**：[morluto/rea](https://github.com/morluto/rea)
- **版本号**：6.8.0（[固定提交 f624c3b](https://github.com/morluto/rea/tree/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)功能主张支持/未覆盖/反证与行为验证状态，已知样本对照准确率/返工/全成本，不算已有自动重实现。

只读固定源码，不运行REA/worker/样本/MCP/后端或测试；工具Node24.19低于目标声明范围，无运行/行为/效益或全平台资源保证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 376 | 75705 | — | — | 717056 |
| .mjs | source | 388 | 83185 | 79354 | 1891 | — |
| .ts | source | 2542 | 601313 | 548007 | 29635 | — |
| .cjs | source | 2 | 1807 | 1682 | 73 | — |
| .mjs | example | 71 | 6229 | 5915 | 156 | — |
| .mts | source | 11 | 1680 | 1510 | 60 | — |
| .mjs | test | 36 | 9045 | 8594 | 285 | — |
| .ts | test | 3200 | 984552 | 935197 | 11626 | — |
| .md | test | 3 | 160 | — | — | 1420 |
| .js | test | 5 | 96 | 91 | 1 | — |
| .ts | example | 157 | 22971 | 21005 | 1193 | — |
| .md | example | 13 | 582 | — | — | 4530 |
| .js | source | 9 | 853 | 784 | 16 | — |
| .js | example | 5 | 70 | 64 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 848](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=848&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3,607](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3%2C607&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 2,835](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2%2C835&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：重核JavaScript/Electron代表链的真实解析/证据/资源恢复，区分静态候选与行为理解。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · REA的真实类型、使用者和运行前提是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

REA/rea-agents6.8.0是独立CLI和MCP逆向工具，非DSH原生插件；目标是具备逆向经验、对有权检查的构建物理解功能/来源的开发者。Agent选择工具和解释/重实现来自所接宿主/模型，REA提供分析与证据，不是自动保证复刻正确的端到端Agent。基线是手工解包/读源码、反编译器和笔记；合格结果须功能主张可回到原件、覆盖范围明确且经必要行为对照，不是图很大/哈希一致。

README列原生/JS/Electron/.NET/网页，但本研究完整跟的是代表JS/Electron静态链，不推所有后端同样可用。package声明CLI双命令/编译worker入口，脚本缺dist明确报错退出而非自动编译。Node范围^22.23.4或^24.22.1或>=26.12.1，当前研究工具用24.19.0不匹配，未运行目标；Linux静态路径还要求procps兼容ps做进程归属，原生/动态路径另需后端/许可与权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-65](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/README.md#L61-L65)

作者功能调查/多类逆向与本地证据定位。

```text
---

See a feature in an app that you want in your own product? Ask your agent to investigate it with REA. It can inspect the app without its source code, explain how the feature works, show the evidence, and build a version for your project.

REA connects your agent to tools for inspecting native binaries, JavaScript and Electron apps, .NET assemblies, and websites. You can also use the same tools from your terminal. Analysis runs locally, and results include the evidence and limitations behind each conclusion.
```

**依据 2 · 作者声明**：[README.md:71-76](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/README.md#L71-L76)

作者Linux进程归属ps前提。

```text
## Quick start

On Linux, Ghidra, JADX, firmware tool launches and static JavaScript/Electron
analysis require a procps-compatible `ps` on REA's `PATH` for process ownership
checks. Recovery steps are in `docs/installation.md` under
"Linux owned-process prerequisite".
```

**依据 3 · 源码核查**：[package.json:1-10](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/package.json#L1-L10)

独立工具6.8.0/MIT身份。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "rea-agents",
  "mcpName": "io.github.morluto/rea",
  "version": "6.8.0",
  "description": "Reverse engineer anything from your terminal or agent with one CLI and MCP server.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/morluto/rea.git"
  },
```

</details>

**依据 4 · 源码核查**：[package.json:36-46](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/package.json#L36-L46)

编译worker/CLI命令与Node范围。

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

**依据 5 · 源码核查**：[scripts/rea.mjs:45-70](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/scripts/rea.mjs#L45-L70)

编译入口缺失报错及MCP实际加载。

<details>
<summary>查看原文（26行）</summary>

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
} else if (isMcpDoctorMode) {
  guardClosedStdout();
```

</details>

#### 缺口

- 发布包/MCP客户端、外部逆向后端与真实功能重建效果未验。
  **影响**：源码入口不等可安装/可运行或正确复刻。
  **进一步探讨**：在匹配Node隔离环境用已知行为且有权样本验证对应分析路径和后端。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · JS/Electron静态请求怎样经过真实解析而生成Evidence？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP analyze注册到runEvidenceToolOperation，摘要先核留存能力，再调用validated服务；服务拒无效ASAR准入设置、重建并校验输出，形成Evidence。重建把调用者路径stat/realpath/access准入，盘点ASAR或目录，按source_paths读取已盘点文本，提前释放reader，再以heap/每源timeout设置取得source analyzer。

这不是只画接口：逐文件worker.analyze真正进入受控Node子进程。JavaScriptAnalysisWorker设置max-old-space等flags、清NODE_OPTIONS并用OwnedWorkerRuntime启动；runtime调用launcher，普通provider分支实际spawn(shell:false)。worker入口把传入源码交parseJavaScriptSource，再运行静态AST/语义投影；parser实际Babel.parse，语法错返回null/解析失败事实，不导入或运行目标JS。父进程adopt图投影并组Evidence，含目标哈希、参数、结果/限制、confidence=derived、authority=shipped-artifact而environment=null。

该链支持静态派生证据，不等目标行为观察；OS进程归属/heap与字节预算不是不可信任意后端的通用沙箱或全部平台硬资源保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/registerElectronTools.ts:94-129](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/server/registerElectronTools.ts#L94-L129)

真实注册/留存检查/服务及摘要投影。

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

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:61-106](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptApplicationService.ts#L61-L106)

准入设置拒绝与重建服务真实调用。

<details>
<summary>查看原文（46行）</summary>

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
    const { electron_summary: summary, ...application } = reconstructed;
    await options.progress?.report({
      phase: "validate_javascript_application_result",
      completed: 0,
      total: 1,
      message: "Validating result metadata and cross-graph bindings",
    });
    await checkpointJavaScriptAnalysis(options.signal);
    result = await completeJavaScriptAnalysisSteps(
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:105-164](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L105-L164)

路径准入/盘点/实际读取及reader释放。

<details>
<summary>查看原文（60行）</summary>

```text
    };
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
    if (snapshot.manifest.root_format !== format)
      throw new ArtifactReaderFailure(
        "format",
        `Artifact inventory classified ${path} as ${snapshot.manifest.root_format}, not ${format}`,
      );
    const reader = createReader(
      path,
      format,
      asarHeaderAdmission,
      selectedPath,
    );
    const readerOwner = {
      kind: "reader" as const,
      reader,
      resource: `JavaScript artifact reader for ${path}`,
    };
    let readerOpen = true;
    let reconstructionOutcome:
      | {
          readonly kind: "completed";
          readonly result: JavaScriptArtifactReconstructionResult;
        }
      | { readonly kind: "failed"; readonly cause: unknown };
    try {
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

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:183-244](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L183-L244)

heap/timeout worker获取、实际分析与finally释放。

<details>
<summary>查看原文（62行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:445-465](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L445-L465)

实际stat/realpath/access路径检查。

<details>
<summary>查看原文（21行）</summary>

```text
const resolveSelectedInput = async (
  inputPath: string,
): Promise<{ readonly path: string; readonly metadata: Stats }> => {
  try {
    // Native lookup must admit the selected traversal first: Darwin realpath
    // can collapse file/.. even though that path cannot be opened.
    const metadata = await stat(inputPath);
    const path = await realpath(inputPath);
    // Directory enumeration needs read access; resolving its entries also needs search access.
    await access(
      path,
      metadata.isDirectory() ? constants.R_OK | constants.X_OK : constants.R_OK,
    );
    return { path, metadata };
  } catch (cause: unknown) {
    const code =
      cause instanceof Error && "code" in cause ? String(cause.code) : "";
    if (code === "EACCES" || code === "EPERM")
      throw new AnalysisAccessDeniedError(OPERATION, inputPath, code, {
        cause,
      });
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptArtifactAnalysis.ts:109-141](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactAnalysis.ts#L109-L141)

实际worker.analyze/投影adopt。

<details>
<summary>查看原文（33行）</summary>

```text
      analysisStarted = true;
      if (file.kind !== "javascript" || !file.text.included) {
        assertJavaScriptAnalysisActive(signal);
        analyzeArtifactMetadata(file, state);
        assertJavaScriptAnalysisActive(signal);
        continue;
      }
      const result = await worker.analyze(
        file,
        projection.remainingFileCapacity(),
        signal,
        onPhase === undefined ? undefined : (phase) => onPhase(file, phase),
      );
      const facts = result.ok ? result.value : result.error;
      for (const revoked of facts.revokedStaticProjections ?? []) {
        const index = sourceIndices[revoked.sourceIndex];
        const previous = index === undefined ? undefined : state.files[index];
        if (previous === undefined)
          throw new TypeError(
            "Revoked application projection has no retained source",
          );
        state.files[index!] = {
          ...previous,
          application_projection_failure: {
            reason: revoked.error.message,
            error: projectAnalysisError(revoked.error),
            limits: revoked.error.reportedLimits,
          },
        };
      }
      const applicationProjectionFailure = facts.applicationProjectionFailure;
      if (facts.projection !== null)
        projection.adoptFileProjection(facts.projection);
```

</details>

**依据 7 · 源码核查**：[src/javascript/analysis/JavaScriptAnalysisWorker.ts:657-687](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/javascript/analysis/JavaScriptAnalysisWorker.ts#L657-L687)

真实Node/heapflags/环境/启动调用。

<details>
<summary>查看原文（31行）</summary>

```text
  async #start(deadline: ProviderStartupDeadline): Promise<void> {
    if (this.#runtime.supervisor !== undefined && this.#ready) return;
    this.#phase = "startup";
    this.#heapLimitBytes = 0;
    const environment: NodeJS.ProcessEnv = {
      ...process.env,
      UV_THREADPOOL_SIZE: "1",
    };
    delete environment.NODE_OPTIONS;
    await this.#runtime.start(
      {
        command: process.execPath,
        arguments: [
          `--max-old-space-size=${String(this.limits.heapMb)}`,
          "--max-semi-space-size=8",
          "--v8-pool-size=1",
          "--expose-gc",
          "--stack_size=2048",
          fileURLToPath(import.meta.resolve("#javascript-analysis-worker")),
        ],
        runId: `${this.#runId}-${randomUUID()}`,
        hostEnvironment: environment,
        stdin: "pipe",
        ...(this.#processMemoryLimitBytes === null
          ? {}
          : { memoryLimitBytes: this.#processMemoryLimitBytes }),
        signal: deadline.signal,
      },
      async () => {
        this.#runtime.onStdout(this.#onStdout);
        const ready = await this.#next(deadline, "worker startup");
```

</details>

**依据 8 · 源码核查**：[src/process/OwnedWorkerRuntime.ts:337-353](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/process/OwnedWorkerRuntime.ts#L337-L353)

真实受控launcher调用与所有权supervisor。

<details>
<summary>查看原文（17行）</summary>

```text
    });
    this.#cleanupEpoch ??= new OwnedWorkerRuntimeCleanupEpoch(this.#root.path);
    if (this.#closing) throw new ProcessAdmissionError("runtime_closing");
    this.#lastRunId = spawnOptions.runId;
    const spawned = await (this.options.launcher ?? spawnOwnedProviderProcess)({
      ...spawnOptions,
      cwd: this.#root.path,
    });
    this.#inputFailure = undefined;
    this.#observeStdin(spawned.process.stdin);
    this.#cleanupEpoch.setRunId(spawned.ownership?.runId ?? spawnOptions.runId);
    this.#supervisor = new ProviderProcessSupervisor(
      {
        ...spawned,
        ownsProcessLifetime: true,
        cleanup:
          spawned.cleanup ??
```

</details>

**依据 9 · 源码核查**：[src/process/ProviderProcess.ts:313-333](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/process/ProviderProcess.ts#L313-L333)

普通分支实际spawn shell:false/进程归属。

<details>
<summary>查看原文（21行）</summary>

```text
  }
  if (options.memoryLimitBytes !== undefined)
    throw new ProcessAdmissionError("memory_limit_unsupported");
  const child = spawn(options.command, [...options.arguments], {
    shell: false,
    windowsHide: true,
    stdio: [options.stdin ?? "ignore", "pipe", "pipe"],
    detached: platform !== "win32",
    windowsVerbatimArguments: options.windowsVerbatimArguments ?? false,
    env: environment,
    ...(options.cwd === undefined ? {} : { cwd: options.cwd }),
  });
  await waitForSpawn(child);
  const pid = child.pid;
  if (pid === undefined)
    throw new ProcessAdmissionError("launcher_pid_missing");
  const ownership: OwnedProcessGroup = {
    runId: options.runId,
    leaderPid: pid,
    processGroupId: pid,
    expectedParentPid: process.pid,
```

</details>

**依据 10 · 源码核查**：[src/composition/javascriptAnalysisWorkerProcess.ts:19-78](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/composition/javascriptAnalysisWorkerProcess.ts#L19-L78)

worker真实parse/static/semantic/容量与投影。

<details>
<summary>查看原文（60行）</summary>

```text
const analyze: JavaScriptSourceWorkerAnalyzer = async (
  file,
  capacity,
  callbacks,
) => {
  if (!file.text.included)
    throw new TypeError("JavaScript worker requires decoded source text");
  await callbacks.phase("parse");
  let parsed = parseJavaScriptSource(file.text.value, file.path);
  if (parsed === null) {
    await callbacks.checkpoint(failedJavaScriptStaticAnalysis());
    return null;
  }
  await callbacks.phase("static");
  const facts = await completeJavaScriptAnalysisSteps(
    analyzeParsedJavaScriptStaticSourceSteps(file.text.value, parsed),
  );
  const resultBudgetBytes = await callbacks.checkpoint(facts);
  if (facts.parse_status === "failed") return null;
  if (resultBudgetBytes === 0)
    throw new AnalysisResourceConstraintError(
      "analyze_javascript_application",
      "memory",
      `The parent reserved its remaining result capacity for static observations; semantic analysis of ${file.path} was not started`,
      { semantic_result_budget_bytes: 0 },
    );
  await callbacks.phase("semantic");
  const ir = await completeJavaScriptAnalysisSteps(
    analyzeParsedJavaScriptSemanticsSteps(
      parsed,
      moduleResolutionModeForJavaScriptReference(file.path, "static-import"),
      capacity.nodes,
    ),
  );
  parsed = null;
  const module = projectJavaScriptModuleSemantics(ir);
  const measured = measureJavaScriptModuleTransfer(
    module,
    javaScriptTransferByteBudget(resultBudgetBytes),
  );
  if (measured.retentionBytes > resultBudgetBytes)
    throw new AnalysisResourceConstraintError(
      "analyze_javascript_application",
      "memory",
      `Completed module facts for ${file.path} exceed the parent's offered result budget; static facts were retained`,
      {
        semantic_result_budget_bytes: resultBudgetBytes,
        module_transfer_bytes: measured.bytes,
      },
    );
  await callbacks.phase("projection");
  const projection = await completeJavaScriptAnalysisSteps(
    projectJavaScriptSemanticFileSteps(
      file,
      ir,
      capacity,
      facts.electron.call_paths,
    ),
  );
  return { module, projection };
```

</details>

**依据 11 · 源码核查**：[src/domain/javascript/javascriptSourceParser.ts:77-82](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/domain/javascript/javascriptSourceParser.ts#L77-L82)

实际调用Babel parse。

```text
  options: ParserOptions,
  packageContext?: JavaScriptPackageType,
): ParsedJavaScriptSource => {
  const file = parse(source, options);
  runtimeContextByProgram.set(
    file.program,
```

**依据 12 · 源码核查**：[src/domain/javascript/javascriptSourceParser.ts:250-285](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/domain/javascript/javascriptSourceParser.ts#L250-L285)

真实文件模式/容错解析/失败null。

<details>
<summary>查看原文（36行）</summary>

```text
export const parseJavaScriptSource = (
  source: string,
  sourcePath?: string,
): ParsedJavaScriptSource | null => {
  try {
    const runtimeSourceType = runtimeSourceTypeForPath(sourcePath);
    const commonjs = runtimeSourceType === "commonjs";
    const options = {
      errorRecovery: true,
      attachComment: false,
      plugins: parserPluginsForPath(sourcePath),
    };
    const file = parseWithRuntimeContext(source, sourcePath, {
      ...options,
      // Inert artifact analysis retains module declarations even in .cjs assets.
      // Infer their syntax here; reference imports keep filename-mode diagnostics.
      sourceType: commonjs ? "unambiguous" : runtimeSourceType,
      allowReturnOutsideFunction: commonjs,
      allowNewTargetOutsideFunction: commonjs,
    });
    // Unambiguous mode retains module-only diagnostics after choosing a script.
    // The .cjs extension establishes wrapper mode, so obtain its own diagnostics.
    return commonjs &&
      file.program.sourceType === "script" &&
      file.errors.length > 0
      ? parseWithRuntimeContext(source, sourcePath, {
          ...options,
          sourceType: "commonjs",
        })
      : file;
  } catch (cause: unknown) {
    // Unparseable source is represented by the null return.
    void cause;
    return null;
  }
};
```

</details>

**依据 13 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:43-86](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptApplicationEvidence.ts#L43-L86)

Evidence创建及subject/hash/derived/限制。

<details>
<summary>查看原文（44行）</summary>

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
};

const reportEvidencePhase = (
  progress: ProgressReporter | undefined,
  phase: string,
  message: string,
): Promise<void> =>
  progress?.report({ phase, completed: 0, total: 1, message }) ??
  Promise.resolve();

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 覆盖、摘要与哈希怎样帮助复核，又不能证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

结果保存root_artifact_sha256、inventory manifest/graph摘要、完整性矛盾、source_selection、应用/语义图和统计/limitations；路由盘点把不可读、parse失败/恢复和未分析源显式标unavailable/partial。相对手抄笔记，这给出同输入的来源/边界，不是语义正确证明。source_paths仅选精确盘点路径，不隐含读依赖；动态生成/加载、环境和未选文件可改变行为。静态route模式不证明可达或完整路由集。

summary不是新分析或减少分析负担：要求session evidenceById+recordEvidence，先留全Evidence，再resolve引用投影。无留存能力提前拒绝摘要，可改complete内联。保留属于服务session，不能推跨会话永久归档/目标原件永远可读；拿到summary后仍要检查父Evidence和范围。哈希绑定字节/派生结果，不能替代功能验真，也不能把source覆盖数当功能完成率或把environment:null当运行环境已采集。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:313-355](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L313-L355)

实际route来源状态及不可用/partial。

<details>
<summary>查看原文（43行）</summary>

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
              })),
          ]),
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:357-387](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L357-L387)

实际身份/选择/图/统计/限制结果。

<details>
<summary>查看原文（31行）</summary>

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
      };
```

</details>

**依据 3 · 作者声明**：[src/contracts/javascript/electronToolContracts.ts:110-117](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/contracts/javascript/electronToolContracts.ts#L110-L117)

作者明确依赖不隐含分析/route不证可达/summary范围。

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

**依据 4 · 源码核查**：[src/application/analysisView/AnalysisViewService.ts:269-299](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/analysisView/AnalysisViewService.ts#L269-L299)

实际摘要留存能力判据与失败。

<details>
<summary>查看原文（31行）</summary>

```text
export const requireAnalysisViewRetention = (
  operation: string,
  retention: AnalysisViewRetention,
): Result<
  {
    readonly evidenceById: EvidenceLookup;
    readonly recordEvidence: EvidenceWriter["recordEvidence"];
  },
  AnalysisError
> => {
  if (
    retention.recordEvidence === undefined ||
    retention.evidenceById === undefined
  )
    return err(
      new AnalysisCapabilityUnavailableError(
        ANALYSIS_VIEW_PROVIDER.id,
        operation,
        "summary detail requires a server session that retains Evidence for later views",
        {
          userMessage:
            "This server does not retain Evidence. Select detail complete to receive the complete analysis inline.",
        },
      ),
    );
  return ok({
    evidenceById: retention.evidenceById,
    recordEvidence: retention.recordEvidence,
  });
};

```

</details>

**依据 5 · 源码核查**：[src/application/analysisView/AnalysisViewService.ts:312-327](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/analysisView/AnalysisViewService.ts#L312-L327)

实际recordEvidence/resolve父引用。

<details>
<summary>查看原文（16行）</summary>

```text
export const projectRetainedAnalysis = (
  evidence: Evidence,
  retention: AnalysisViewRetention,
  view: AnalysisViewRequest,
): Result<Evidence, AnalysisError> => {
  const ready = requireAnalysisViewRetention(evidence.operation, retention);
  if (!ready.ok) return ready;
  const recorded = ready.value.recordEvidence(evidence);
  if (!recorded.ok) return recorded;
  const source = {
    kind: "retained-evidence" as const,
    evidence_id: evidence.evidence_id,
  };
  const retained = resolveEvidenceInput(source, ready.value.evidenceById);
  if (!retained.ok) return retained;
  // Duplicate semantic records retain their original ledger metadata. Detail
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

Evidence为派生且环境null/限制。

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

- 来源可回读/覆盖与推断准确率、跨重启留存未验证。
  **影响**：不能用摘要或哈希批准重实现/产品安全结论。
  **进一步探讨**：逐条主张对照原件与已知行为，保未覆盖文件和反例；缺父Evidence则停用摘要结论。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 取消和失败如何释放/保留，采用和恢复成本在哪？

**研究主题**：采用判断、效果与总成本

#### 完整回答

reader读后提前release，worker分析finally也release；但release不等每次杀进程：同scope/limits健康worker会park复用，scope close才实际worker.close，失败/不健康才关闭或保留清理重试。重建已经形成completed时，中断/cleanup失败可绑定partial_observation Evidence；validated服务也仅在reconstructed已有等条件尝试补全证据。早期盘点/读取/验证失败不能承诺都可恢复全部成果，清理失败应先解决归属，不反复重跑。

首次需匹配Node/dist、MCP/CLI与目标读取权限；给工具的路径会读取本机工件，stat/realpath/access只是OS可读检查，不等组织授权或租户隔离。对敏感/不可信构建物先离线副本、明确范围；本研究不将原生/动态执行后端纳入静态安全承诺。

持续解析CPU/heap/子进程/存储、外部逆向后端许可、模型token与人工核图/行为对照费用和耗时未知；summary减传输不等减少CPU/解析。退出需关闭服务scope并确认托管worker/临时/证据归属，保已完成Evidence再清原件。建议有经验者用已知样本受限试静态链，缺关键来源或范围/语义对不上时退原件与现有分析器，不盲信Agent解释。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:145-164](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L145-L164)

reader提前release。

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

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:228-244](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L228-L244)

worker finally release与清理失败。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/artifacts/javascript/JavaScriptSourceAnalysis.ts:73-99](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/artifacts/javascript/JavaScriptSourceAnalysis.ts#L73-L99)

同scope/limit复用与旧进程清理失败处理。

<details>
<summary>查看原文（27行）</summary>

```text
      current.worker.prepareForAnotherAnalysis(sourceCount)
    ) {
      current.busy = true;
      return new ScopeJavaScriptSourceAnalysis(scope, current.worker);
    }
    retained.delete(scope);
    try {
      await current.worker.close();
    } catch (cause) {
      // The old process is still alive. Keep it owned and fail this request
      // before another worker is constructed, including on MCP where the
      // analysis result is returned without a later cleanup retry.
      if (retained.get(scope) === undefined) {
        retained.set(scope, {
          worker: current.worker,
          limits: current.limits,
          busy: false,
        });
      } else {
        scope.retain({
          kind: "lease",
          resource: "replaced JavaScript source analyzer",
          lease: { release: () => current.worker.close() },
        });
      }
      throw cause;
    }
```

</details>

**依据 4 · 源码核查**：[src/artifacts/javascript/JavaScriptSourceAnalysis.ts:118-126](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/artifacts/javascript/JavaScriptSourceAnalysis.ts#L118-L126)

scope关闭真实worker.close。

```text
  if (closeHookRegistered.has(scope)) return;
  closeHookRegistered.add(scope);
  scope.addCloseHook(async () => {
    const current = retained.get(scope);
    if (current === undefined) return;
    await current.worker.close();
    if (retained.get(scope) === current) retained.delete(scope);
  });
};
```

**依据 5 · 源码核查**：[src/artifacts/javascript/JavaScriptSourceAnalysis.ts:155-174](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/artifacts/javascript/JavaScriptSourceAnalysis.ts#L155-L174)

健康worker close仅park/其它真实close。

<details>
<summary>查看原文（20行）</summary>

```text

  async close(): Promise<void> {
    if (this.#closed) return;
    this.#closed = true;
    try {
      const current = retained.get(this.scope);
      if (
        current?.worker === this.worker &&
        !this.#failed &&
        this.worker.canReuse()
      ) {
        current.busy = false;
        return;
      }
      if (current?.worker === this.worker) retained.delete(this.scope);
      await this.worker.close();
    } catch (cause) {
      this.#closed = false;
      throw cause;
    }
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:388-413](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L388-L413)

完成分析后中断/cleanup绑定partial Evidence。

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

**依据 7 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:137-169](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptApplicationService.ts#L137-L169)

仅满足reconstructed等条件补全partial，补全失败保持错误。

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

**依据 8 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:445-465](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L445-L465)

OS读取准入而非业务授权。

<details>
<summary>查看原文（21行）</summary>

```text
const resolveSelectedInput = async (
  inputPath: string,
): Promise<{ readonly path: string; readonly metadata: Stats }> => {
  try {
    // Native lookup must admit the selected traversal first: Darwin realpath
    // can collapse file/.. even though that path cannot be opened.
    const metadata = await stat(inputPath);
    const path = await realpath(inputPath);
    // Directory enumeration needs read access; resolving its entries also needs search access.
    await access(
      path,
      metadata.isDirectory() ? constants.R_OK | constants.X_OK : constants.R_OK,
    );
    return { path, metadata };
  } catch (cause: unknown) {
    const code =
      cause instanceof Error && "code" in cause ? String(cause.code) : "";
    if (code === "EACCES" || code === "EPERM")
      throw new AnalysisAccessDeniedError(OPERATION, inputPath, code, {
        cause,
      });
```

</details>

#### 缺口

- 取消/清理/partial恢复、真实资源与人工验证成本未测。
  **影响**：有finally/partial不等任意阶段恢复或无残留。
  **进一步探讨**：匹配环境故障注入读前/worker中/成图后，核进程/证据完整性与总时间再扩大。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可证伪的生产方向是什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：在Evidence上按功能主张列支持源码、未覆盖输入/环境、反证和可观察行为对照，明确“静态候选→行为验证→重实现验收”状态，可能减少把图当事实的错误重实现。当前来源/coverage/derived结构可承载此方向，但不等它已有用户行为验证/完整需求闭环，不计当前创新。

对同一批有已知行为/权限的JS构建物，比较原summary与主张清单，注入未选依赖、动态路由、解析恢复和部分Evidence，测错解释/遗漏/重实现返工及包含人核的总时间和模型费用。若错误率不降或标注/验证成本抵消收益则放弃。现阶段只推荐匹配环境的已知样本静态小试，不覆盖全后端，关键结论回原件和行为对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:357-387](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L357-L387)

现有身份/选择/图/限制为主张验证基础。

<details>
<summary>查看原文（31行）</summary>

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
      };
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

derived而非行为观察。

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

**依据 3 · 源码核查**：[src/application/analysisView/AnalysisViewService.ts:312-327](https://github.com/morluto/rea/blob/f624c3b8e3bb2afbcd176244707bdf0d2fde1f97/src/application/analysisView/AnalysisViewService.ts#L312-L327)

摘要父Evidence回查基础。

<details>
<summary>查看原文（16行）</summary>

```text
export const projectRetainedAnalysis = (
  evidence: Evidence,
  retention: AnalysisViewRetention,
  view: AnalysisViewRequest,
): Result<Evidence, AnalysisError> => {
  const ready = requireAnalysisViewRetention(evidence.operation, retention);
  if (!ready.ok) return ready;
  const recorded = ready.value.recordEvidence(evidence);
  if (!recorded.ok) return recorded;
  const source = {
    kind: "retained-evidence" as const,
    evidence_id: evidence.evidence_id,
  };
  const retained = resolveEvidenceInput(source, ready.value.evidenceById);
  if (!retained.ok) return retained;
  // Duplicate semantic records retain their original ledger metadata. Detail
```

</details>

#### 缺口

- 主张反证清单对准确率/返工的效果未验证。
  **影响**：不计作已实现自动复刻或商业增量。
  **进一步探讨**：固定样本做盲对照并设置错误/总成本停止条件。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
