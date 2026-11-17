# REA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[08b63cc](https://github.com/morluto/rea/tree/08b63cc8a136b70504bb882a30209981f95278d7)

<!-- BEGIN META -->
[![GitHub ★ 462,580](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=462%2C580&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,944,247](https://img.shields.io/static/v1?label=npm+30d&message=1%2C944%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
<!-- END META -->

> **功能**：通过终端或 MCP 调查原生二进制、JavaScript、Electron、.NET 与网站，输出分析证据及限制。

> **亮点**：[Q03](#research-q03) 将根哈希、图项来源、查询参数与解析缺口放在同一份证据中，让接手人定位结论适用的包和范围。[Q02](#research-q02) 通过原生 MCP 组合复用已有 DSH 会话，支持将分析和后续追问放在一处。

> **主要限制**：[Q02](#research-q02) 本地配置回读与宿主启动是两道边界。[Q03](#research-q03) 静态图里的候选边仍需结合原件和可观察行为验证，部分解析尤其容易让遗漏变成错误的否定结论。

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
  - [Q01 · 谁需要从 Electron 构建物交付哪种可复核结果？](#detail-section-11)
  - [Q02 · DSH 如何装载 REA，文件回读与工具接入在哪些分支分离？](#detail-section-12)
  - [Q03 · 代表性静态调用如何绑定原件，什么情况下图不足以说明行为？](#detail-section-13)
  - [Q04 · 哪些条件下试用有可逆价值，合格任务的成本和退出如何验收？](#detail-section-14)
  - [Q05 · 逐条登记证据是否降低把静态线索当作行为事实的错判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要调查有权检查的 Electron 发布包、缺少原始工程，并将线索交给同事复核的工程师。一次任务可先定位一个预加载边界，再交付原件身份、可复核位置与覆盖缺口。

[Q01](#research-q01) 有源码和测试时优先查工程本身。只有发布包时，可以手工解包搜索并记录证据，也可从终端直接调用同一类 REA 分析器。DSH 接入为已在对话中调查的人提供调用入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH MCP 组合配置 | 挂载独立的 REA 服务 | 确认 home、启动路径和宿主原生 MCP 客户端 |
| Electron 静态分析 | 查找目录或 ASAR 内的模块与脚本入口 | 依赖读取和解析范围，运行行为须独立核对 |
| 可回源证据 | 核对原件身份、选择范围和部分解析 | 根哈希与图表示对应产物，逐条推断需追到位置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.23.4、^24.22.1 或 >=26.12.1 和 REA 构建成品 | 必需 | 启动 CLI 与 MCP | 版本检查或运行产物检查会报错 |
| 支持 Cordis 家目录补丁和原生 MCP 客户端的 DSH | DSH 接入必需 | 读取 Cordis 登记并以 stdio 启动 REA | 配置可能写入但工具无法发现 |
| 已授权且可读取的 Electron 目录或 ASAR | 代表任务必需 | 固定输入并生成静态图 | 无法读取或部分解析时相应结论范围会缩小 |
| procps 兼容的 ps | Linux 静态任务依作者说明需具备 | 检查分析进程归属 | 按环境补齐后再检查，或使用另一种手工路径 |
| Hopper、Ghidra、IDA 等 | 各原生后端按需 | 对应原生逆向任务 | 本次 Electron 代表链无需引入这些后端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备样本 | 工程师固定有权样本、REA 包和 DSH 版本，在隔离 home 审查待写配置 | 识别预期 Node、REA 路径和唯一登记 |
| 加载 | 在确认路径后执行 REA 针对 DSH 的 setup，通过宿主单独核对工具发现 | 先核对配置回读，再在目标宿主确认实际工具名 |
| 执行代表任务 | 从目标 ASAR 或目录分析并追查一条预加载或模块边界 | 结果应带同一产物身份、范围和可定位的样本内线索 |
| 复核与退出 | 对照目标字节和已知行为，退出时关闭隔离实例并恢复起始状态 | 工具未出现或结果无法回源则退回终端或手工解包 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、构建产物与存储资源，具体支出未知 | 固定环境、审查 home 改动、准备对照样本 | 包成品与目标 DSH 组合待验 |
| 持续使用 | 静态分析耗用与模型请求费用未知 | 记录输入范围、报告复核与行为对照 | 以每份合格报告为计量单位 |
| 失败恢复 | 重算与额外请求成本未知 | 排查启动、读取部分结果、恢复配置 | 部分解析或回读冲突需分支核查 |
| 退出 | 样本与证据归档资源未知 | 恢复独立 home 或只移除预期登记并复查 | 共享 home 上的装载与清理未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接入和配置核对 | DSH 方言的登记发布、冲突处理与重读验证 | 对应 npm 产物与实际宿主能否握手 |
| 静态调查 | 图项表示文件、哈希和解析覆盖，证据携带原件身份 | 动态路径真值、不同打包条件的定位率 |
| 同事复核 | 证据提供统一的输入标识和范围说明 | 对照手工解包的总时间和错判变化 |

> **思考**：[Q02](#research-q02) 本地配置回读与宿主启动是两道边界。[Q03](#research-q03) 静态图里的候选边仍需结合原件和可观察行为验证，部分解析尤其容易让遗漏变成错误的否定结论。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03) 将根哈希、图项来源、查询参数与解析缺口放在同一份证据中，让接手人定位结论适用的包和范围。[Q02](#research-q02) 通过原生 MCP 组合复用已有 DSH 会话，支持将分析和后续追问放在一处。

[Q02](#research-q02) 配置发布回读包括期望登记与其他服务器的原值，遇竞争而退出可避免继续猜测文件状态。[Q03](#research-q03) 静态分析同时保存输入哈希、文件级覆盖和错误原因，适合用来重放有限主张。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 本地配置回读与宿主启动是两道边界。[Q03](#research-q03) 静态图里的候选边仍需结合原件和可观察行为验证，部分解析尤其容易让遗漏变成错误的否定结论。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 有兼容环境和已知自有样本时，可在隔离 home 试用。确认只修改预期的 Cordis 文件，再核对同一次宿主握手、工具发现和一条可回源结果。若启动或证据核查失败，关闭隔离实例并转终端或手工解包。共享 home 用卸载动作前需要核对会扫描的客户端与保留回执。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已在固定源码核查 DSH 专用组合、真实 MCP 接线及代表性 Electron 静态证据链。包成品与宿主中的运行待验，逐条证据登记属于待验证方案。

- 已检查：作者 README、包清单、源码路径 README.md、src/application/javascript/JavaScriptApplicationEvidence.ts、src/application/SupportedClients.ts、src/application/SetupClientConfiguration.ts、src/application/DshCordisPatch.ts、scripts/rea.mjs、scripts/bundle-runtime.mjs、src/main.ts、src/main/deferredRuntime.ts、src/server/createServer.ts、src/server/contractToolBindings.ts、docs/getting-started/client-configuration.md、src/server/serviceToolBindings.ts、src/application/javascript/JavaScriptApplicationService.ts、src/application/javascript/JavaScriptArtifactReconstruction.ts、package.json、src/application/Uninstall.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 REA 根发布清单、DSH 专用 setup 与退出路径、MCP 入口及代表性的 JavaScript/Electron 目录和 ASAR 静态链。其他格式、动态和原生分析后端留在范围外。未查 npm 安装成品、未执行目标代码或 DSH。
- 下一步：用两份带已知预加载与动态分支的自有 Electron 包比对。记录同版环境的配置、工具发现、可回源结果和清理回执，再对同预算报告盲评正确结论、越界断言和总复核分钟数。

**分析版本**

- **仓库**：[morluto/rea](https://github.com/morluto/rea)
- **版本号**：6.9.0（[固定提交 08b63cc](https://github.com/morluto/rea/tree/08b63cc8a136b70504bb882a30209981f95278d7)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可在证据输出之上要求报告逐条填写原件、位置和未覆盖范围，再检查一项可观察行为。这个设计是否少一次误修并缩短复核时间，要与自由汇报做同预算盲评。

用两份带已知预加载与动态分支的自有 Electron 包比对。记录同版环境的配置、工具发现、可回源结果和清理回执，再对同预算报告盲评正确结论、越界断言和总复核分钟数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 504 | 95046 | — | — | 906823 |
| .mjs | source | 443 | 95484 | 89090 | 3990 | — |
| .ts | source | 2886 | 728351 | 654846 | 44569 | — |
| .cjs | source | 2 | 1857 | 1723 | 81 | — |
| .mjs | example | 75 | 7294 | 6736 | 355 | — |
| .mts | source | 11 | 1702 | 1528 | 62 | — |
| .mjs | test | 35 | 8417 | 7919 | 336 | — |
| .ts | test | 3822 | 1208872 | 1146494 | 16505 | — |
| .md | test | 3 | 193 | — | — | 1733 |
| .js | test | 5 | 96 | 91 | 1 | — |
| .md | example | 19 | 707 | — | — | 5566 |
| .ts | example | 195 | 27825 | 25311 | 1535 | — |
| .js | source | 9 | 853 | 784 | 16 | — |
| .js | example | 5 | 70 | 64 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 751](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=751&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2,343](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2%2C343&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 2,247](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2%2C247&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向需要调查有权检查的 Electron 构建物的 DSH 用户，REA 能否交付可回源的静态分析证据，接入、覆盖和退出分别依赖哪些条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要从 Electron 构建物交付哪种可复核结果？

**研究主题**：场景与需求

#### 完整回答

适用的是反复调查有权检查的 Electron 发布包、缺少原始工程或源码映射、还需要把所得线索交给下一人的工程师。例如要确认设置页可能从哪里把一项命令交给主进程，先保留 ASAR 或解包目录的身份，再把候选模块、导入或预加载边界指向包内位置，列出未读取和解析失败的范围，最后用已知行为确认关键主张。已有源工程和对应测试时，源码和测试通常能更直接地解释行为。只是一次性找字符串时，手工解包和搜索的设置负担更少。

REA 同时有终端和 MCP 接口。终端已有同一类静态调查入口，因而 DSH 接入的特有价值在于把工具调用及结构化分析结果放入既有 Agent 会话。相对手工解包并写分散笔记，代表任务的增量是帮助记录输入身份、查询范围和结果缺口。实际是否能节省交接时间，要看复核者取得的路径是否足够具体，以及还需要补多少行为证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-67](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/README.md#L63-L67)

作者描述终端与 MCP 接口和应用静态分析，宣称可提供证据。

```text
See a feature in an app that you want in your own product? Ask your agent to investigate it with REA. It can inspect the app without its source code, explain how the feature works, show the evidence, and build a version for your project.

REA connects your agent to tools for inspecting native binaries, JavaScript and Electron apps, .NET assemblies, and websites. You can also use the same tools from your terminal. Analysis runs locally, and results include the evidence and limitations behind each conclusion.

Setup registers REA with your agent and installs matching workflow instructions. Native analysis can use an existing Hopper, Ghidra, IDA or Kuna installation; setup can optionally install Hopper with approval. Static JavaScript analysis needs no native analysis engine.
```

**依据 2 · 作者声明**：[README.md:119-128](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/README.md#L119-L128)

作者给出的 CLI 实例表明 DSH 之外也可直接分析目录或 ASAR。

<details>
<summary>查看原文（10行）</summary>

````text
### Use the terminal

Inspect an extracted JavaScript/Electron app directory or ASAR:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

The result includes modules, imports, Electron boundaries and their evidence.
Replace the path with your target, such as `"D:/apps/example"` on Windows.
````

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

证据对象实际携带产物根哈希、格式、参数和限制。

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

- 缺独立的任务频率和重复采用资料。
  **影响**：无法判断目标人群是否能摊薄接入和培训成本。
  **进一步探讨**：记录周期性与一次性调查各自的合格交接和人工投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何装载 REA，文件回读与工具接入在哪些分支分离？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

REA 的 DSH 方言从 DSH_HOME 或默认的 ~/.dsh 定位 cordis.patch.yml。它在 Cordis 根 patch 序列生成 id 为 rea-mcp 的登记，挂载宿主提供的 @deepseek-ai/dsh-mcp-client，将 REA 启动命令、参数和可选环境交给该客户端，传输选 stdio。写入之前会校验客户端环境和现有文档的可编辑性，整行表达式或无法确认作用域的结构需要人工处理。平台参数明确进入 DSH 文档的环境合并和持久化，Windows 分支以不区分大小写的方式辨认环境变量名。环境表达式实际求值仍在宿主加载时发生。

配置发布使用事务路径与原字节，写入冲突有专门失败结果。发布后重读、核对目标登记及既有其他服务器；发现内容不符时走恢复路径，回读冲突会返回冲突结果。这个证据说明 setup 检查它写出的文件，也说明用户需要把配置写到当前宿主实际读取的 home。

根包声明脚本启动器与 dist。构建将编译 main.js 链接到 dist/mcp/main.js，单一 mcp 参数才走正常 MCP stdio 分支，Node 不满足门槛或构建成品缺失会在加载前报错。服务入口校验环境，满足默认目录条件时可先加载通过摘要核验的已记录目录，在运行时物化实际工具。非默认条件可直接启动完整服务。服务创建器把 Electron 应用分析所需的资源作用域、环境和分析设置交给工具族，并按实际合约在 server.registerTool 上绑定参数与回调。排查因此分三步：先核对文件发布，再核对宿主握手与名称发现，最后验证某个真实工具调用。仅看到服务器名或工具目录仍缺调用证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/SupportedClients.ts:369-373](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/SupportedClients.ts#L369-L373)

DSH_HOME 和默认 .dsh 路径解析到 cordis.patch.yml。

```text
const dshHomeDirectory = ({ home, env }: ClientPathContext): string =>
  dshDirectory(home, env.DSH_HOME, ".dsh");

const dshPatchDirectory = (context: ClientPathContext): string =>
  join(dshHomeDirectory(context), "cordis.patch.yml");
```

**依据 2 · 源码核查**：[src/application/SupportedClients.ts:1614-1628](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/SupportedClients.ts#L1614-L1628)

DSH 方言使用此配置路径，声明标准流和共享 skill 目录。

<details>
<summary>查看原文（15行）</summary>

```text
  defineClient({
    name: "dsh",
    registrationConnection: {
      kind: "flat",
      fields: ["url"],
      stdio: [{ kind: "required-enum", field: "transport", values: ["stdio"] }],
    },
    displayName: "DeepSeek Harness",
    // The home Cordis patch applies to every profile; the skill directory is
    // shared agent storage Harness discovers.
    skillPath: ({ home, env }: ClientPathContext) =>
      join(dshDirectory(home, env.DSH_AGENTS_HOME, ".agents"), "skills"),
    configPath: dshPatchDirectory,
    markerPath: dshHomeDirectory,
    format: "dsh",
```

</details>

**依据 3 · 源码核查**：[src/application/SetupClientConfiguration.ts:1342-1362](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/SetupClientConfiguration.ts#L1342-L1362)

先核验环境，再基于现有文档或空文档生成 REA 登记。

<details>
<summary>查看原文（21行）</summary>

```text
  const format = clientWriteDialect(
    parsed?.dialect ?? client.format ?? "json",
    sources,
  );
  const launcher =
    command.length === 0 ? [PRODUCT_IDENTITY.cliBinary, "mcp"] : command;
  if (format === "dsh") {
    const validated = clientRegistrationEnvironment(
      effective,
      client,
      platform,
      providerEnvironment,
    );
    if (!validated.ok) throw validated.error;
    const desired = (
      parsed === undefined
        ? new DshCordisDocument("")
        : dshDocument(parsed.document)
    ).desired(launcher, providerEnvironment, platform);
    if (!desired.ok) throw desired.error;
    return desired.value;
```

</details>

**依据 4 · 源码核查**：[src/application/DshCordisPatch.ts:346-354](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/DshCordisPatch.ts#L346-L354)

无既有登记时向根序列插入宿主 MCP 模块与 REA 配置。

```text
    if (!carried && desired !== undefined)
      outputRoot.items.push(
        output.createNode({
          insert: [
            { id: DSH_ENTRY_ID, name: DSH_CLIENT_PACKAGE, config: desired },
          ],
        }) as never,
      );
    return output.toString({ lineWidth: 0 });
```

**依据 5 · 源码核查**：[src/application/DshCordisPatch.ts:387-408](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/DshCordisPatch.ts#L387-L408)

Windows 分支按传入平台匹配环境变量名。

<details>
<summary>查看原文（22行）</summary>

```text
      const nextEnv =
        env === undefined
          ? this.#yaml.document.createNode({})
          : this.#yaml.detach(env, invalidated);
      if (!isMap(nextEnv))
        throw new ConfigurationError("Cordis environment is not a mapping");
      for (const pair of [...nextEnv.items]) {
        const key = this.#yaml.key(pair.key);
        if (Object.hasOwn(desiredEnv, key)) {
          this.#yaml.renameKey(nextEnv, pair, key);
          continue;
        }
        // Windows environment names match case-insensitively, so a caller's
        // spelling of a desired name is kept rather than duplicated.
        const alias =
          platform === "win32"
            ? Object.keys(desiredEnv).find(
                (name) => name.toUpperCase() === key.toUpperCase(),
              )
            : undefined;
        if (alias === undefined) nextEnv.delete(pair.key);
        else this.#yaml.renameKey(nextEnv, pair, alias);
```

</details>

**依据 6 · 源码核查**：[src/application/DshCordisPatch.ts:465-478](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/DshCordisPatch.ts#L465-L478)

登记向宿主 MCP 客户端提供 stdio 和 REA 可执行参数。

<details>
<summary>查看原文（14行）</summary>

```text
export const dshClientRegistrationEntry = (
  command: readonly string[],
  environment: Readonly<Record<string, string>> = {},
): Record<string, unknown> => {
  const [executable = "rea", ...args] = command;
  return {
    serverName: "rea",
    transport: "stdio",
    command: executable,
    args,
    ...(Object.keys(environment).length === 0
      ? {}
      : { env: { ...environment } }),
  };
```

</details>

**依据 7 · 源码核查**：[src/application/SetupClientConfiguration.ts:444-467](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/SetupClientConfiguration.ts#L444-L467)

向事务目标发布内容，冲突与写入失败分别处理。

<details>
<summary>查看原文（24行）</summary>

```text
    publication = await ClientConfigurationPublication.write(
      transactionPath,
      serialized.value,
      original,
      {
        requestedPath: client.configPath,
        state: snapshot?.state,
        ...(client.privateProfile !== undefined
          ? { requiredMode: PRIVATE_PROFILE_MODES.file }
          : {}),
      },
    );
  } catch (cause: unknown) {
    if (isClientConfigurationCleanupFailure(cause) || cleanupIncomplete(cause))
      throw cause;
    if (isConfigurationConflict(cause))
      return conflictFailure(recoveryBackupPath);
    return {
      status: "failed",
      reason: "write",
      failure: (cause instanceof ClientConfigurationWriteError
        ? cause
        : new ClientConfigurationWriteError(client.configPath, "publish", cause)
      ).problem,
```

</details>

**依据 8 · 源码核查**：[src/application/SetupClientConfiguration.ts:473-513](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/SetupClientConfiguration.ts#L473-L513)

重读登记及其他服务器，内容不符走恢复路径。

<details>
<summary>查看原文（41行）</summary>

```text
  return publication.verify(async () => {
    try {
      const text = await readRegularFileText(publication.path);
      await publication.assertCurrent(text);
      const readback = parseClientConfiguration(text, format);
      if (
        !registrationCurrent(readback, desired) ||
        Object.entries(fallbackServers).some(
          ([name, entry]) =>
            name !== PRODUCT_IDENTITY.mcpServerKey &&
            !clientConfigurationValuesEqual(readback.servers[name], entry),
        )
      ) {
        return await rollbackOrReadbackFailure(
          publication,
          original,
          recoveryBackupPath,
        );
      }
    } catch (cause: unknown) {
      if (isConfigurationConflict(cause) || isMissing(cause))
        return conflictFailure(recoveryBackupPath);
      if (cause instanceof RegularFileCleanupFailure) {
        const rollback = await restoreConfig(publication, original);
        if (!rollback.ok)
          throw new ClientConfigurationCleanupRollbackFailure(
            cause,
            rollbackFailure(rollback.error, recoveryBackupPath),
          );
        throw cause;
      }
      // Readback failure restores the transaction before reporting.
      void cause;
      return rollbackOrReadbackFailure(
        publication,
        original,
        recoveryBackupPath,
      );
    }
    return {
      status: "configured",
```

</details>

**依据 9 · 源码核查**：[scripts/rea.mjs:22-29](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/scripts/rea.mjs#L22-L29)

Node 版本不满足时在导入前退出。

```text
const unsupportedRuntime = unsupportedRuntimeMessage(
  packageJson.engines?.node,
  process.versions.node,
);
if (unsupportedRuntime !== undefined) {
  process.stderr.write(`${unsupportedRuntime}\n`);
  process.exit(1);
}
```

**依据 10 · 源码核查**：[scripts/rea.mjs:61-84](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/scripts/rea.mjs#L61-L84)

显式检查编译入口，mcp 模式调用服务端 runEntrypoint。

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
          "dist/cli-runtime/cliOneShot.js",
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

**依据 11 · 源码核查**：[scripts/bundle-runtime.mjs:23-39](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/scripts/bundle-runtime.mjs#L23-L39)

MCP build 入口为编译的 main.js。

<details>
<summary>查看原文（17行）</summary>

```text
  const { imports = {} } = JSON.parse(
    await readFile(join(root, "package.json"), "utf8"),
  );
  for (const [directory, entries] of [
    ["mcp", { main: "main.js" }],
    [
      "cli-runtime",
      {
        cli: "cli.js",
        cliOneShot: "cliOneShot.js",
        cliBuiltinArguments: "cliBuiltinArguments.js",
        cliResultOutput: "cli/cliResultOutput.js",
        mcpDoctor: "mcpDoctor.js",
      },
    ],
  ]) {
    const bundle = await rolldown({
```

</details>

**依据 12 · 源码核查**：[scripts/bundle-runtime.mjs:114-122](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/scripts/bundle-runtime.mjs#L114-L122)

MCP 输出写入 dist 之下指定子目录。

```text
    try {
      await bundle.write({
        dir: join(compiledRoot, directory),
        format: "esm",
        entryFileNames: "[name].js",
        chunkFileNames:
          directory === "mcp"
            ? "[name]-[hash].js"
            : (chunk) => {
```

**依据 13 · 源码核查**：[src/main.ts:93-126](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/main.ts#L93-L126)

校验环境，按目录摘要与配置条件分走延迟或直接物化。

<details>
<summary>查看原文（34行）</summary>

```text
): Promise<number> => {
  const environment = snapshotEnvironment(
    dependencies.env,
    HOST_PLATFORM.platform,
  );
  const config = parseConfig(environment);
  if (!config.ok) {
    dependencies.writeStderr(`${projectAnalysisError(config.error).message}\n`);
    return 1;
  }
  // The deferred server omits the recorded output schemas from listings, the
  // default `off` profile; `compact` composes its bounded presentation.
  const recordedOutputCatalog =
    config.value.mcpOutputSchemaProfile !== "compact";
  // The recorded catalog holds the complete inventory and its full-catalog
  // identity, so only an unscoped registration can be served from it. A
  // scoped one composes the canonical scope itself instead of advertising
  // tools whose identity the runtime cannot verify.
  const scopedToolFamilies = environment.REA_MCP_TOOL_FAMILIES !== undefined;
  if (
    RECORDED_MCP_CATALOG_SHA256 !== undefined &&
    dependencies.transport !== "http" &&
    config.value.hopperTargetPath === undefined &&
    recordedOutputCatalog &&
    !scopedToolFamilies &&
    dependencies.createServer === undefined &&
    dependencies.loadOptionalProviders === undefined
  ) {
    return runDeferred({ ...dependencies, env: environment }, config.value);
  }
  return (await import("./main/eagerRuntime.js")).runEager(
    { ...dependencies, env: environment },
    config.value,
  );
```

</details>

**依据 14 · 源码核查**：[src/main/deferredRuntime.ts:24-37](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/main/deferredRuntime.ts#L24-L37)

实际加载时检查预记录目录摘要和 schema 版本。

<details>
<summary>查看原文（14行）</summary>

```text
/** Verify the build-owned artifact before trusting its exact typed projection. */
const readCatalog = (): RecordedMcpCatalog => {
  const bytes = readFileSync(new URL("../mcp-catalog.json", import.meta.url));
  if (sha256Hex(bytes) !== RECORDED_MCP_CATALOG_SHA256)
    throw new Error(SERVER_START_FAILED);
  // The digest binds these bytes to the same compiled producer and SDK converter.
  const catalog: unknown = JSON.parse(bytes.toString("utf8"));
  if (
    typeof catalog !== "object" ||
    catalog === null ||
    Reflect.get(catalog, "version") !== 1
  )
    throw new Error(SERVER_START_FAILED);
  return catalog as RecordedMcpCatalog;
```

</details>

**依据 15 · 源码核查**：[src/main/deferredRuntime.ts:188-222](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/main/deferredRuntime.ts#L188-L222)

在传输层持有已登记目录，以 initializeRuntime 物化实际服务。

<details>
<summary>查看原文（35行）</summary>

```text
      handle = await dependencies.serve(
        (context) => {
          const server = servers.create(() => {
            const catalog = firstCatalog ?? readCatalog();
            firstCatalog = undefined;
            const startedAt = new Date().toISOString();
            const server = new DeferredEvidenceMcpServer(
              catalog,
              new ToolResultDelivery(
                config.mcpMaxResponseBytes ?? STDIO_DEFAULT_MAX_BUFFER_SIZE,
              ),
              (target) =>
                initializeRuntime(
                  target,
                  dependencies,
                  context,
                  config,
                  startedAt,
                ).catch((cause) => {
                  dependencies.setExitCode(1);
                  throw cause;
                }),
              {
                maximumInputElements: config.mcpMaxInputElements,
                compactPresentation: COMPACT_INPUT_SCHEMA_PRESENTATION,
                identity: {
                  ...catalog.identity,
                  digests:
                    RECORDED_CATALOG_DIGEST_PROFILES?.off ??
                    catalog.identity.digests,
                },
              },
            );
            if (config.mcpToolCatalogProfile === "hot-cold")
              server.enableProgressiveCatalog();
```

</details>

**依据 16 · 源码核查**：[src/server/createServer.ts:549-571](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/server/createServer.ts#L549-L571)

组装 Electron 工具及其资源、环境和设置依赖。

<details>
<summary>查看原文（23行）</summary>

```text
    electron: () =>
      registerServiceTools(
        server,
        {
          electronFuses,
          electronObservation: {
            provider: options.electronObservation,
            loadFailure:
              options.optionalProviderLoadFailures?.electronObservation,
          },
          electronScenario: {
            provider: options.electronActiveObservation,
            loadFailure:
              options.optionalProviderLoadFailures?.electronActiveObservation,
          },
          javascriptApplication: {
            resources: artifactResources,
            environment,
            settings: analysisSettings.read,
          },
        },
        contractTools,
      ),
```

</details>

**依据 17 · 源码核查**：[src/server/contractToolBindings.ts:655-669](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/server/contractToolBindings.ts#L655-L669)

挂载了真实的工具服务回调，未绑定契约触发错误。

<details>
<summary>查看原文（15行）</summary>

```text
    const present =
      binding.value === undefined ? undefined : binding.presentResult;
    server.registerTool(
      contract.name,
      registration,
      present === undefined
        ? handler
        : async (input: unknown, context: ServerContext) =>
            present(await handler(input, context)),
    );
  }
  if (unbound.size > 0)
    throw invariantViolation(
      `MCP tool bindings name no registered contract: ${[...unbound].join(", ")}`,
    );
```

</details>

**依据 18 · 作者声明**：[docs/getting-started/client-configuration.md:1001-1017](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/docs/getting-started/client-configuration.md#L1001-L1017)

作者示例列出所插宿主模块、绝对 Node 路径和 mcp 参数，以及拒绝的表达式结构。

<details>
<summary>查看原文（17行）</summary>

````text
The written entry is:

```yaml
- insert:
    - id: rea-mcp
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        serverName: rea
        transport: stdio
        command: /absolute/path/to/node
        args: ["/absolute/path/to/rea/scripts/rea.mjs", mcp]
```

Setup preserves caller-owned Cordis expressions and replaces launcher fields
with literal values that doctor can verify. It refuses to edit an expression
that produces the entire REA config, or a group-targeted REA insertion. Use a
literal config and a root-level insertion as shown above.
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 代表性静态调用如何绑定原件，什么情况下图不足以说明行为？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

DSH 可通过 MCP 调用 analyze_javascript_application。服务先按官方合约登记，实际回调把已验证的请求交给 JavaScript 应用分析服务，输入包括应用目录或 ASAR 路径以及可选范围和资源策略。若要求摘要，回调先检查能否保留后续查询依赖的视图，再运行分析；缺保留条件时立即返回该错误。分析前检查 ASAR 头、清单上限与若干环境条件，非法设置会被拒绝，而非以默认值继续。重建阶段先固定输入身份并检查产物格式，按收录范围解析 JavaScript，通过资源作用域管理 worker 并尝试释放。图中的路由条目以文件和容器哈希标识来源，区分完整、部分、不可用，并记录超范围、解析错误或缺失原因。最终证据记录根哈希、操作参数、派生可信度、证据来源为已发布构建物及 limitations。

例如用户追问一个预加载脚本是否是设置功能实际采用的入口，可以从结果定位脚本和模块边，再独立核对目标字节和运行行为。不可用文件和部分解析意味着图上不存在某条边时仍要检查相应覆盖范围。即使显示完整解析，运行参数、延迟加载、运行时选择、远端资源和打包时转换仍可能改变行为。相比手工解包加笔记，哈希和结果参数让接手者确定两次核查是否指向同一构建物与选择范围。相比直接使用 REA CLI，在 DSH 内更容易从当前会话调用和连续查询，但证据属性来自分析工具本身。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/serviceToolBindings.ts:1624-1652](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/server/serviceToolBindings.ts#L1624-L1652)

分析工具的回调先验证摘要保留条件，向分析服务传入资源范围、分析器与配置。

<details>
<summary>查看原文（29行）</summary>

```text
  javascriptApplication: ((
    { resources, environment, settings },
    retention,
  ) => ({
    analyze_javascript_application: {
      admission: "sdk",
      run: async ({ detail, view, ...request }, options) => {
        if (detail === "summary") {
          const ready = requireAnalysisViewRetention(
            "analyze_javascript_application",
            retention,
          );
          if (!ready.ok) return ready;
        }
        const analyzed = await analyzeJavaScriptApplicationValidated(
          request,
          resources,
          {
            ...options,
            sourceAnalysis: javascriptSourceAnalysis,
            environment,
            ...(settings === undefined ? {} : { settings }),
          },
        );
        return detail === "summary" && analyzed.ok
          ? projectRetainedAnalysis(
              analyzed.value,
              retention,
              view ?? { kind: "summary" },
```

</details>

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:70-100](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptApplicationService.ts#L70-L100)

在输入分析前拒绝无效头或清单限制和环境设置。

<details>
<summary>查看原文（31行）</summary>

```text
export const analyzeJavaScriptApplicationValidated = async (
  input: z.output<typeof analyzeJavaScriptApplicationInputSchema>,
  scope: ArtifactResourceScope,
  options: JavaScriptApplicationOptions,
): Promise<Result<Evidence, AnalysisError>> => {
  // An invalid setting is refused before analysis, never replaced by the default.
  const asarHeaderAdmission = parseAsarHeaderAdmission(
    options.environment?.[ASAR_HEADER_ADMISSION_SETTING],
  );
  if (!asarHeaderAdmission.ok) return asarHeaderAdmission;
  const listingAdmission = parseAsarListingAdmission(
    options.environment?.REA_ASAR_MAX_LISTING_BYTES,
  );
  if (!listingAdmission.ok) return listingAdmission;
  const overrides = options.settings?.().overrides;
  const memberMutationAllowance = resolveJavaScriptMemberMutationAllowance(
    options.environment,
    overrides,
  );
  if (!memberMutationAllowance.ok) return memberMutationAllowance;
  const header = overrides?.["asar.max_header_bytes"];
  const listing = overrides?.["asar.max_listing_bytes"];
  const acceptedAdmission = {
    ...(header === undefined
      ? asarHeaderAdmission.value
      : { maximumBytes: header, source: "runtime" as const }),
    listing:
      listing === undefined
        ? listingAdmission.value
        : { maximumBytes: listing, source: "runtime" as const },
  };
```

</details>

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:112-151](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptApplicationService.ts#L112-L151)

调用重建服务，验证结果元数据与图绑定，再生成证据。

<details>
<summary>查看原文（40行）</summary>

```text
    await checkpointJavaScriptAnalysis(options.signal);
    reconstructed = await reconstructJavaScriptArtifact(
      input,
      scope,
      options.sourceAnalysis,
      options.signal,
      options.progress,
      acceptedAdmission,
      overrides,
      memberMutationAllowance.value,
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

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:114-139](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptArtifactReconstruction.ts#L114-L139)

解析目标和格式，按完整性策略建立输入清单并拒绝格式不一致。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:220-273](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptArtifactReconstruction.ts#L220-L273)

按收录范围调用静态分析器，finally 尝试释放分析资源。

<details>
<summary>查看原文（54行）</summary>

```text
      const worker = await sourceAnalysis(
        sourceLimits,
        files.files.filter(
          (file) => file.kind === "javascript" && file.text.included,
        ).length,
        { scope },
      );
      let outcome!: Awaited<
        ReturnType<typeof analyzeAndAdoptJavaScriptArtifactFiles>
      >;
      let analysisFailure: { readonly cause: unknown } | undefined;
      let cleanupAttempt: Awaited<ReturnType<ArtifactResourceScope["release"]>>;
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
          preloads.paths,
          preloads.limitations,
        );
      } catch (cause: unknown) {
        analysisFailure = { cause };
      } finally {
        cleanupAttempt = await scope.release({
          kind: "javascript-source-analysis",
          analysis: worker,
          resource: `JavaScript source analyzer for ${path}`,
        });
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:356-381](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptArtifactReconstruction.ts#L356-L381)

给每个图项附文件与容器哈希、覆盖状态及不可用或部分原因。

<details>
<summary>查看原文（26行）</summary>

```text
      const completed = {
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
```

</details>

**依据 7 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:414-430](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptArtifactReconstruction.ts#L414-L430)

报告已解析、已跳过、失败和受限文件范围。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 8 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

证据保存根哈希和证据来源为被分析的构建物，声明是派生结论。

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

- 打包转换、动态加载、输入范围选择对可定位率的影响未量化。
  **影响**：不能将单个文件解析完整外推为行为或全包覆盖。
  **进一步探讨**：在自有样本中安排一条已知动态载入链，要求从包原件回查并对照运行真值。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些条件下试用有可逆价值，合格任务的成本和退出如何验收？

**研究主题**：采用判断、效果与总成本、缺陷与关键质疑

#### 完整回答

已有兼容 DSH、符合包声明的 Node 和有权检查的已知 Electron 样本时，可以限定在独立 DSH home 测试源码指向的路径。启动前固定 REA 包来源和 DSH 版本，核查拟写入的 patch、命令和目标路径。清单要求 Node ^22.23.4、^24.22.1 或 >=26.12.1。Linux 静态路径另有作者声明的 procps 兼容 ps 要求。目录范围限定为样本，避免把模型能接触的文件权限扩大到平时的工作环境。

试用标准是一轮真实工具发现和一条可回源的结果：既要找到预期 REA 工具，也要能把一个预加载或模块判断连回正确的包哈希、路径和范围，最后对照一项已知行为。首次成本是隔离环境、核查包与 home 配置、选可对照样本。持续成本是解析资源、Agent 调用、同事的证据复核。失败成本包括重查 launcher、重新分析和回滚配置，模型费用、CPU 或内存耗用及人工分钟数均未知。通常需计量一份达到同一验收线的报告，再与手工解包比较。

若只写进配置但未发现工具，或得到的核心结论缺规范定位，停止该试用并回到终端或手工解包。退出时可关闭隔离实例并恢复原配置。共享 home 上的 rea uninstall 会扫描支持的客户端；源码显示遇到表达式可能产生登记行时会返回保留，成功移除分支会重读确认 REA 登记不再出现。退出时要核对提交报告及工具列表，避免误删其他 MCP 登记或把保留状态当作移除完成。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-52](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/package.json#L42-L52)

包声明启动器、Node 版本区间与 dist 产物。

<details>
<summary>查看原文（11行）</summary>

```text
  "bin": {
    "rea": "scripts/rea.mjs",
    "rea-agents": "scripts/rea.mjs"
  },
  "engines": {
    "node": "^22.23.4 || ^24.22.1 || >=26.12.1"
  },
  "packageManager": "npm@11.16.0",
  "files": [
    "dist",
    "install.sh",
```

</details>

**依据 2 · 源码核查**：[scripts/rea.mjs:74-81](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/scripts/rea.mjs#L74-L81)

缺编译产物时返回失败并提示重新构建或安装。

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

**依据 3 · 作者声明**：[README.md:73-76](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/README.md#L73-L76)

作者给 Linux 静态 JavaScript 路径声明兼容 ps 前提。

```text
On Linux, Ghidra, JADX, firmware tool launches and static JavaScript/Electron
analysis require a procps-compatible system `ps` for process ownership
checks. Recovery steps are in `docs/getting-started/installation.md` under
"Linux owned-process prerequisite".
```

**依据 4 · 作者声明**：[docs/getting-started/client-configuration.md:984-1000](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/docs/getting-started/client-configuration.md#L984-L1000)

作者说明 home 级修改的影响范围和卸载扫描语义。

<details>
<summary>查看原文（17行）</summary>

```text
## DeepSeek Harness

DeepSeek Harness registers MCP clients through a Cordis YAML patch sequence
rather than a `mcpServers` object. `rea setup --client dsh` appends (or
replaces) the REA entry in the home patch `$DSH_HOME/cordis.patch.yml`
(`~/.dsh/cordis.patch.yml` when `DSH_HOME` is unset), preserving unrelated
patches and comments. `rea doctor --client dsh` checks that same entry id.
`rea uninstall` removes it by scanning supported clients; uninstall takes no
`--client` flag. The home patch applies to every Harness profile, so the
registration is written once and no per-profile edit is needed.

Setup, doctor and uninstall resolve `DSH_HOME` and `DSH_AGENTS_HOME` as Harness
does: unset, empty or whitespace-only values use `~/.dsh` and `~/.agents`,
respectively. Bare `~`, `~/` and `~\` expand to the user home; other relative
values resolve against the command's working directory. Nonblank values retain
their original spaces, and the agents root is independent of the Harness home.
Run REA and Harness from the same working directory when using relative overrides.
```

</details>

**依据 5 · 作者声明**：[docs/getting-started/client-configuration.md:1019-1025](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/docs/getting-started/client-configuration.md#L1019-L1025)

作者说明重启后的发现名称，以及另行安装工作流技能。

```text
For a global npm installation, the launcher is under
`$(npm root -g)/rea-agents/scripts/rea.mjs`. Restart Harness after setup; it
exposes tools as `mcp__rea__<tool_name>`. Run `rea setup --skill --dry-run`,
review the destination, then `rea setup --skill --yes` to install the workflow
in `~/.agents/skills` (`$DSH_AGENTS_HOME/skills` when configured); Harness
discovers that directory, and its native `skill` tool can load
`reverse-engineer-anything`.
```

**依据 6 · 源码核查**：[src/application/Uninstall.ts:1231-1255](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/Uninstall.ts#L1231-L1255)

卸载遇到会生成登记的表达式时保留配置，归属不明时保留登记。

<details>
<summary>查看原文（25行）</summary>

```text
  const { transactionPath, original, parsed } = read;
  const name = PRODUCT_IDENTITY.mcpServerKey;
  if (
    parsed.dialect === "dsh" &&
    dshDocument(parsed.document).hasUnknownStructure
  )
    return item(
      client.name,
      "retained",
      "A Cordis expression may produce registration rows, so the patch was retained without changes.",
    );
  if (!registrationPresent(parsed))
    return item(client.name, "skipped", "REA registration is absent.");
  const removal = clientRegistrationRemoval(parsed, original, client);
  if (!removal.ok) return item(client.name, "failed", removal.error.detail);
  const { removeNative, legacyPath } = removal.value;
  const removeLegacy = legacyPath !== undefined;
  if (!removeNative && !removeLegacy)
    return item(
      client.name,
      "retained",
      "The rea-named registration is not REA-owned.",
    );
  const blocker = writeBlocker?.();
  if (blocker !== undefined) return item(client.name, "failed", blocker);
```

</details>

**依据 7 · 源码核查**：[src/application/Uninstall.ts:1324-1339](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/Uninstall.ts#L1324-L1339)

移除后重读检查原登记是否仍在。

<details>
<summary>查看原文（16行）</summary>

```text
    return await publication.verify(async () => {
      try {
        const text = await fileSystem.readText(publication.path);
        await publication.assertCurrent(text);
        const readback = parseClientConfiguration(text, client.format);
        if (
          (removeNative && Object.hasOwn(readback.servers, name)) ||
          (readback.dialect === "dsh" &&
            dshDocument(readback.document).carriesEntry) ||
          (removeLegacy && Object.hasOwn(readback.legacyServers, name))
        )
          throw new Error("registration readback mismatch");
        return item(
          client.name,
          "removed",
          `Removed registration from ${client.configPath}.`,
```

</details>

#### 缺口

- 无合格任务的人工时间、解析资源、模型费用或完整退出数据。
  **影响**：无法判定同质量报告的总成本，采用判断限于有边界试用。
  **进一步探讨**：记录相同样本在 REA 与手工两条路径上的配置、复核、重复分析和退出成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 逐条登记证据是否降低把静态线索当作行为事实的错判？

**研究主题**：新假设与验证

#### 完整回答

假设可以从 REA 已有的原件身份、范围与部分解析标记推导。如果同一 Agent 必须为每条行为解释标明原件哈希、样本内位置、未覆盖范围和预期行为检查，复核者可能更容易排除把静态图当作动态真值的断言。当前 Evidence 给出整次调用的参数与 limitations，逐条判断的登记和比对属于待验证设计。

以两版有源码和运行真值的自有 Electron 包设盲评。一版放入看似相关但不会到达的静态分支，另一版让一个与任务相关的文件因可控资源限制不参与分析。两组用相同 REA 版本、模型、命令权限和计算预算。一组自由汇报，另一组逐条登记。评审回到固定源码和行为记录，比较正确主张数、把候选描述成事实的错误数、无法定位比例和全流程复核分钟数。错误未减少或复核总成本增加且正确结论未改善，就不支持额外登记。这个设计也能看出错误来自源材料覆盖还是报告推理。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

产物哈希、结果限制与派生性质可以作为人工登记约束的字段来源。

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

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:356-381](https://github.com/morluto/rea/blob/08b63cc8a136b70504bb882a30209981f95278d7/src/application/javascript/JavaScriptArtifactReconstruction.ts#L356-L381)

源码已有部分、不可用及完整解析分类，可设计受控反例。

<details>
<summary>查看原文（26行）</summary>

```text
      const completed = {
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
```

</details>

#### 缺口

- 逐条登记对误判与复核时间的实际作用未验证。
  **影响**：它可能减少越界结论，也可能增加填写负担或漏掉正确线索。
  **进一步探讨**：对已知源码和运行行为的两版自有包做同模型同预算盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
