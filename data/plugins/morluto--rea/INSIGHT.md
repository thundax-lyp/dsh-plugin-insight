# REA

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[047d75a](https://github.com/morluto/rea/tree/047d75a498f18a6608f35ee5e36cf1bf0f81ca97)

<!-- BEGIN META -->
[![GitHub ★ 452,144](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=452%2C144&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/rea) [![npm 30d 1,945,914](https://img.shields.io/static/v1?label=npm+30d&message=1%2C945%2C914&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
<!-- END META -->

> **功能**：通过 CLI 与 MCP 分析应用构建物、二进制和网页，并输出可回查的分析证据。

> **亮点**：[Q02](#research-q02) 的 setup 把 REA 的真实启动路径交给 DSH 原生 MCP 客户端，并在配置写入后回读。相比手工解包和分散记笔记，[Q03](#research-q03) 将产物、选择范围、图和部分失败绑定到同一证据对象，交接时能追溯判断基于哪份构建物。

> **主要限制**：[Q03](#research-q03) 的哈希只绑定产物字节。延迟加载的入口、未选择的文件及部分解析会缩小可判断范围。[Q02](#research-q02) 中配置回读和真实工具握手也属于两个阶段，需分别检查。

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
  - [Q01 · 谁会用 REA 调查 Electron 构建物，合格结果应包括什么？](#detail-section-11)
  - [Q02 · DSH 从 setup 到取得工具需经过哪些实际接线，失败时如何处理？](#detail-section-12)
  - [Q03 · Electron 工具产生的静态证据能支撑哪些判断？](#detail-section-13)
  - [Q04 · 何时值得小范围试用，如何控制全过程成本和退出？](#detail-section-14)
  - [Q05 · 如何检验将工具结论逐项绑定源证据能否减少错判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要调查有权检查的 Electron 构建物的工程师。REA 可以从同一份产物中梳理脚本、模块和入口线索，并为团队保留证据身份与覆盖范围。

原有办法是手工解包、查源码映射、运行已知行为对照并保存笔记。源码和测试齐全时先沿源码定位。DSH 的 MCP 客户端能连接外部服务，REA 补的是逆向操作与构建物证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH MCP 组合配置 | 挂载 REA 标准流服务 | 用户批准写入，目标宿主解析原生模块且保留可访问启动入口 |
| Electron 静态分析 | 查找构建物入口、脚本和模块线索 | 受文件选择、解析与运行时不可见边界约束 |
| Evidence | 核对产物哈希、参数、图与覆盖 | 静态派生内容需回源并与行为对照 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.23.4、^24.22.1 或 >=26.12.1 与构建成品 | 必需 | 启动 REA CLI 和 MCP | 缺构建文件时 launcher 报错 |
| 读取目标 home 补丁并可解析原生 MCP 客户端的 DSH | DSH 接入必需 | 启动标准流并注册工具 | 检查宿主加载与入口路径，配置回读只覆盖本地文件 |
| 有权检查的 Electron 样本与可读输入 | 代表任务必需 | 建立静态线索与证据 | 无法读取、解析或选中的文件限制结论 |
| procps 兼容 ps | 作者声明 Linux 代表链需具备 | 核查工作进程归属 | 缺少时需按环境补齐或换验证路径 |
| Hopper、Ghidra、IDA 等 | 对应后端按需 | 原生及动态分析 | 本次 Electron 静态链不用于判断这些后端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 工程师选有权样本和隔离 DSH home，保存初始配置 | Node 与产物路径固定，样本有已知行为可对照 |
| 配置 | 工程师审阅并批准 setup 写入 | 比较 Cordis 内容和备份，遇竞争冲突先处理当前文本 |
| 加载 | DSH 读取补丁并启动 REA | 工具列表有预期工具，缺失时查模块和入口 |
| 调查 | 工程师核对一项静态主张及已知行为 | 记录构建物身份和遗漏范围，部分结果不升级为成功 |
| 退出 | 关闭隔离实例，留存证据 | 独占 home 可弃用，共享配置须仅移除自己的注册项 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node、磁盘与对应后端许可费用未知 | 固定环境、审阅 home 配置、制备样本 | DSH 与 npm 路径需可访问 |
| 持续 | 解析 CPU、堆和模型费用未知 | 回源、覆盖核查和确认行为 | 只比较通过验收的任务 |
| 失败恢复 | 重算和额外模型请求未知 | 查版本、部分状态、回滚及资源 | 清理失败需另核 |
| 退出 | 证据归档用量未知 | 关闭隔离实例或只移除自己的共享配置 | 未做真实退出计时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置交接 | 审批、备份、配置发布与回读 | 同版宿主握手兼容 |
| 静态调查 | 记录根哈希、图与解析边界 | 与实际运行行为的一致性 |
| 工程交接 | 证据可标注原件和限制 | 净节时和功能判断正确率 |

> **思考**：[Q03](#research-q03) 的哈希只绑定产物字节。延迟加载的入口、未选择的文件及部分解析会缩小可判断范围。[Q02](#research-q02) 中配置回读和真实工具握手也属于两个阶段，需分别检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的 setup 把 REA 的真实启动路径交给 DSH 原生 MCP 客户端，并在配置写入后回读。相比手工解包和分散记笔记，[Q03](#research-q03) 将产物、选择范围、图和部分失败绑定到同一证据对象，交接时能追溯判断基于哪份构建物。

[Q02](#research-q02) 的写入验证绑定初读状态、备份和登记内容。它能缩小竞争写入和序列化错误的影响范围。[Q03](#research-q03) 在静态分析里明确传播部分结果和清理失败，两处状态都要求读者区分已写入、已加载和已产出。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的哈希只绑定产物字节。延迟加载的入口、未选择的文件及部分解析会缩小可判断范围。[Q02](#research-q02) 中配置回读和真实工具握手也属于两个阶段，需分别检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议把试用限定为已知的有权样本。审阅 home 级配置后先确认工具发现，再回查一条带产物身份和源位置的结论。握手、证据范围或清理状态异常时保留本次产物，转手工调查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 DSH 组合配置与 Electron 静态证据链。实际宿主握手、效果对照与逐条证据验收方案待核。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/application/javascript/JavaScriptApplicationEvidence.ts、src/application/Setup.ts、src/application/SupportedClients.ts、src/application/DshCordisPatch.ts、src/application/ClientRegistrationIdentity.ts、src/application/SetupClientConfiguration.ts、scripts/rea.mjs、src/server/createServer.ts、src/server/registerElectronTools.ts、src/application/javascript/JavaScriptApplicationService.ts、src/application/javascript/JavaScriptArtifactReconstruction.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根 CLI/MCP、DSH 专用组合配置及 Electron 静态代表链。其余逆向后端、运行兼容与实测收益没有进入本次结论。
- 下一步：先用隔离 DSH home 对照工具能否发现，检查配置缺模块、入口失效和回退。再按 [Q05](#research-q05) 对比同一构建物任务的定位率、错判和人工复核。

**分析版本**

- **仓库**：[morluto/rea](https://github.com/morluto/rea)
- **版本号**：6.8.0（[固定提交 047d75a](https://github.com/morluto/rea/tree/047d75a498f18a6608f35ee5e36cf1bf0f81ca97)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出让每条功能主张绑定源位置、未覆盖范围和待查行为。以相同模型、预算和 REA 工具对照自由汇报，比较误报、定位率与复核时间。若误报未减或总复核成本上升，就不采纳约束。此方案待验证。

先用隔离 DSH home 对照工具能否发现，检查配置缺模块、入口失效和回退。再按 [Q05](#research-q05) 对比同一构建物任务的定位率、错判和人工复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 492 | 92631 | — | — | 878211 |
| .mjs | source | 411 | 88720 | 84563 | 2066 | — |
| .ts | source | 2823 | 699287 | 635971 | 36015 | — |
| .cjs | source | 2 | 1814 | 1691 | 71 | — |
| .mjs | example | 70 | 6898 | 6561 | 151 | — |
| .mts | source | 11 | 1680 | 1510 | 60 | — |
| .mjs | test | 37 | 9269 | 8807 | 288 | — |
| .ts | test | 3556 | 1141570 | 1085035 | 13419 | — |
| .md | test | 3 | 181 | — | — | 1618 |
| .js | test | 5 | 96 | 91 | 1 | — |
| .md | example | 19 | 707 | — | — | 5566 |
| .ts | example | 172 | 25886 | 23634 | 1354 | — |
| .js | source | 9 | 853 | 784 | 16 | — |
| .js | example | 5 | 70 | 64 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 915](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=915&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3,349](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3%2C349&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 2,616](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2%2C616&color=737b86&logo=github)](https://github.com/morluto/rea/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 使用者能否从 REA 的实际配置接线与 Electron 静态链取得可回源的分析证据，以及何时应退回原分析方法？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用 REA 调查 Electron 构建物，合格结果应包括什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复调查有权检查的 Electron 交付包、又拿不到原始工程的工程师。可以从一份构建物厘清某个功能涉及的入口、预加载脚本或前后端边界，再用原件和已知行为核对主张。手工解包、浏览文件和保存笔记也能做到，REA 的价值在把分析结果及其来源放回同一个证据对象，方便下一次交接确认分析指向哪份构建物。若已有完整工程和可用的源码映射，直接查源码和测试通常更容易定位行为。合格交付至少需要记录构建物身份、明确已读与遗漏范围、为关键主张给出可以复查的线索，并将静态推断和行为观察分开。作者列出的其他原生、网页和 .NET 能力超出这条代表链。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-67](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/README.md#L61-L67)

作者描述逆向任务、支持对象与结果的证据定位。

```text
---

See a feature in an app that you want in your own product? Ask your agent to investigate it with REA. It can inspect the app without its source code, explain how the feature works, show the evidence, and build a version for your project.

REA connects your agent to tools for inspecting native binaries, JavaScript and Electron apps, .NET assemblies, and websites. You can also use the same tools from your terminal. Analysis runs locally, and results include the evidence and limitations behind each conclusion.

Setup registers REA with your agent and installs matching workflow instructions. Native analysis can use an existing Hopper, Ghidra, IDA or Kuna installation; setup can optionally install Hopper with approval. Static JavaScript analysis needs no native analysis engine.
```

**依据 2 · 源码核查**：[package.json:1-10](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/package.json#L1-L10)

根包发布身份、CLI/MCP 定位和 MIT 声明。

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

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

实际 Evidence 绑定产物身份、分析参数与覆盖限制，显式标为 derived。

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

- 缺少重复调查任务中和手工流程的直接对照。
  **影响**：无法判断证据交接需要的人工复核是否减少。
  **进一步探讨**：用两版有源码真值的 Electron 交付包比较每版调查报告的可回查率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 从 setup 到取得工具需经过哪些实际接线，失败时如何处理？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

用户选中 dsh 并批准后，REA 的 setup 会将自己的服务写入目标 DSH_HOME（默认 ~/.dsh）的 cordis.patch.yml。写入的是 id 为 rea-mcp、模块名为宿主 @deepseek-ai/dsh-mcp-client 的 Cordis 行，接线值包含当前实际运行时、REA 入口路径与 mcp 子命令。REA launcher 检查所需构建文件，随后调用 MCP 的标准流入口。目标 DSH 必须实际读取这一 home 补丁、能够解析其 MCP 客户端模块，且此前写入的 Node 和 REA 入口仍可访问。共享 home 级路径意味着试用应使用隔离 home，单换 profile 名仍可能共享同一项配置。

配置的写入边界是事务中处理旧文本、保留恢复备份并回读所需 registration。序列化失败在写入前返回，遇到变化冲突则报告冲突，回读不符进入回滚分支。配置状态 configured 只说明对本地文本的核对达到判据。DSH 真正完成 stdio 握手且能发现预期工具才是接线成功。launcher 在构建文件缺失时明确报错。使用临时包运行器时，注册仍绑定实际入口，清掉缓存也可能使后续启动路径失效。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/Setup.ts:395-432](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/Setup.ts#L395-L432)

setup 的批准或未批准分支。

<details>
<summary>查看原文（38行）</summary>

```text

  let approved = options.approved || plannedActions.length === 0;
  let interactiveApproval = false;
  if (!approved && confirm !== undefined && !options.structured) {
    const decision = await confirm?.(plannedActions, {
      stage: "confirm",
      clientStates,
      selectedClientIds,
      clientSelectionAllowed: false,
    });
    assertSetupActive(options.signal);
    if (decision !== undefined) {
      if (isSetupDecisionCancelled(decision))
        return setupCancelled(
          plannedActions,
          clients,
          clientStates,
          discovery.initialDoctor,
        );
      approved = typeof decision === "boolean" ? decision : decision.approved;
      interactiveApproval = approved;
    }
  }
  if (!approved)
    return {
      status: confirm === undefined ? "needs_confirmation" : "cancelled",
      plannedActions,
      appliedActions,
      clients,
      doctor: summarizeDoctor(discovery.initialDoctor),
      clientStates,
      ...(confirm === undefined
        ? {
            remediation:
              "Review the setup plan, then rerun interactively or with --yes.",
          }
        : {}),
    };
```

</details>

**依据 2 · 源码核查**：[src/application/Setup.ts:479-492](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/Setup.ts#L479-L492)

获准后调用实际客户端配置，传入本次注册命令。

<details>
<summary>查看原文（14行）</summary>

```text
  assertSetupActive(options.signal);
  const clientFailure = await configureDetectedClients({
    host,
    detectedClients: selectedClients,
    providerEnvironment,
    clientEnvironments: desktop.clientEnvironments,
    command: host.registrationCommand,
    clients,
    appliedActions,
    signal: options.signal,
    ...(options.onProgress === undefined
      ? {}
      : { onProgress: options.onProgress }),
  });
```

</details>

**依据 3 · 源码核查**：[src/application/SupportedClients.ts:268-290](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/SupportedClients.ts#L268-L290)

DSH_HOME 解析和 Cordis 补丁路径。

<details>
<summary>查看原文（23行）</summary>

```text
const dshDirectory = (
  home: string,
  override: string | undefined,
  fallback: string,
): string => {
  const selected =
    override !== undefined && override.trim().length > 0
      ? override
      : join(home, fallback);
  const expanded =
    selected === "~"
      ? home
      : selected.startsWith("~/") || selected.startsWith("~\\")
        ? join(home, selected.slice(2))
        : selected;
  return resolve(expanded);
};

const dshHomeDirectory = ({ home, env }: ClientPathContext): string =>
  dshDirectory(home, env.DSH_HOME, ".dsh");

const dshPatchDirectory = (context: ClientPathContext): string =>
  join(dshHomeDirectory(context), "cordis.patch.yml");
```

</details>

**依据 4 · 源码核查**：[src/application/SupportedClients.ts:996-1011](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/SupportedClients.ts#L996-L1011)

dsh 客户端专用 stdio 配置与 home 级范围。

<details>
<summary>查看原文（16行）</summary>

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
  }),
```

</details>

**依据 5 · 源码核查**：[src/application/DshCordisPatch.ts:369-389](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/DshCordisPatch.ts#L369-L389)

生成或改写真实插件行，模块常量在同文件 17–18 行。

<details>
<summary>查看原文（21行）</summary>

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
  }

  #entry(
    desired: Record<string, unknown>,
    invalidated: ReadonlySet<Node>,
  ): YAMLMap<unknown, unknown> {
    const entry = this.#yaml.detach(this.#entryNode, invalidated);
    if (!isMap(entry))
      throw new ConfigurationError("Cordis entry is not a mapping");
    this.#yaml.setValue(entry, "id", DSH_ENTRY_ID);
    this.#yaml.setValue(entry, "name", DSH_CLIENT_PACKAGE);
    entry.delete("disabled");
```

</details>

**依据 6 · 源码核查**：[src/application/DshCordisPatch.ts:479-493](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/DshCordisPatch.ts#L479-L493)

用可执行文件与参数配 stdio。

<details>
<summary>查看原文（15行）</summary>

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
};
```

</details>

**依据 7 · 源码核查**：[src/application/ClientRegistrationIdentity.ts:64-86](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/ClientRegistrationIdentity.ts#L64-L86)

组装 Node 路径、固定入口与 mcp。

<details>
<summary>查看原文（23行）</summary>

```text
export const currentClientRegistrationCommand = (
  selection: {
    readonly platform?: NodeJS.Platform;
    readonly entrypointPath?: string | undefined;
    readonly environment?: Readonly<NodeJS.ProcessEnv>;
  } = {},
): readonly string[] => {
  const platform = selection.platform ?? process.platform;
  const environment = selection.environment ?? process.env;
  const entrypointPath = Object.hasOwn(selection, "entrypointPath")
    ? selection.entrypointPath
    : CURRENT_ENTRYPOINT_PATH;
  if (entrypointPath === undefined || entrypointPath.length === 0) return [];
  return [
    registrationRuntimePath(
      process.execPath,
      javaScriptRuntime(process.versions).id,
      environment,
      platform,
    ),
    registrationEntrypointPath(entrypointPath, environment, platform),
    "mcp",
  ];
```

</details>

**依据 8 · 源码核查**：[src/application/SetupClientConfiguration.ts:366-418](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/SetupClientConfiguration.ts#L366-L418)

备份、基于原状态发布、冲突处理和回读。

<details>
<summary>查看原文（53行）</summary>

```text
  let recoveryBackupPath: string | undefined;
  if (original !== undefined) {
    const preserved = await preserveCurrentRecoveryBackup(
      `${client.configPath}.rea.backup`,
      transactionPath,
      original,
    );
    if (!preserved.ok) return { status: "failed", reason: "backup" };
    recoveryBackupPath = preserved.value;
  }
  let publication: ClientConfigurationPublication;
  try {
    await mkdir(dirname(client.configPath), { recursive: true });
    publication = await ClientConfigurationPublication.write(
      transactionPath,
      serialized.value,
      original,
      { requestedPath: client.configPath, state: snapshot?.state },
    );
  } catch (cause: unknown) {
    if (isClientConfigurationCleanupFailure(cause)) throw cause;
    if (isConfigurationConflict(cause))
      return conflictFailure(recoveryBackupPath);
    return {
      status: "failed",
      reason: "write",
      failure: (cause instanceof ClientConfigurationWriteError
        ? cause
        : new ClientConfigurationWriteError(client.configPath, "publish", cause)
      ).problem,
      ...(recoveryBackupPath === undefined
        ? {}
        : { backupPath: recoveryBackupPath }),
    };
  }
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
```

</details>

**依据 9 · 源码核查**：[scripts/rea.mjs:45-81](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/scripts/rea.mjs#L45-L81)

实际 MCP 构建入口与缺失产物处理。

<details>
<summary>查看原文（37行）</summary>

```text
const isMcpEntry =
  !isShellCompletion && (args[0] === "--mcp" || args[0] === "mcp");
const isMcpMode = isMcpEntry && args.length === 1;
const isMcpDoctorMode = doctorArguments !== undefined;
// Only flags may follow the entry: `mcp add --http` stays Incur's `mcp add`,
// while `mcp -h --http` reaches the HTTP entry's own help.
const isMcpHttpMode =
  isMcpEntry &&
  (args[1]?.startsWith("-") ?? false) &&
  args.slice(1).includes("--http");
/** Exit status of a writer terminated by SIGPIPE (128 + 13). */
const SIGPIPE_EXIT_STATUS = 141;
// Set once the reader of CLI output has closed the pipe.
let stdoutClosed = false;
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Electron 工具产生的静态证据能支撑哪些判断？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑、工程质量与复用

#### 完整回答

可以据结果定位某一构建物中已读取的代码、图和路由线索，并解释哪些文件不可用、解析不完整或未纳入分析。createServer 将 Electron 工具族接入实际服务，分析注册回调把输入交给已验证的 JavaScript 应用分析，完成后才投影摘要。服务先检查 ASAR 读取上限配置，随后盘点归档或目录，对纳入的 JavaScript 文件起用受堆大小与超时参数约束的 worker。产出标明解析完整、部分或不可用及原因，最终把根哈希、参数、图与限制放入 Evidence，authority 标记构建物，confidence 标记派生。哈希可用于绑定字节，实际运行分支还要借助行为对照。

对照案例是被打包器排除或运行时另行加载的代码，已分析图里找不到入口并不足以说明功能不存在。中断后保留的观察依赖阶段和清理结果，资源释放失败时还可能只携带已完成盘点的部分材料。判断应回到每条观察的状态与适用范围，尤其在长任务取消或解析局部失败后。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/createServer.ts:823-835](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/server/createServer.ts#L823-L835)

实际服务器的 Electron 工具族接线。

<details>
<summary>查看原文（13行）</summary>

```text
    electron: () =>
      registerElectronTools(server, {
        ...common,
        artifactResources,
        environment,
        evidenceById,
        electron: options.electronObservation,
        electronActive: options.electronActiveObservation,
        electronFuses,
        observationLoadFailure:
          options.optionalProviderLoadFailures?.electronObservation,
        activeLoadFailure:
          options.optionalProviderLoadFailures?.electronActiveObservation,
```

</details>

**依据 2 · 源码核查**：[src/server/registerElectronTools.ts:94-129](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/server/registerElectronTools.ts#L94-L129)

真实注册回调、应用分析服务及摘要投影。

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

**依据 3 · 源码核查**：[src/application/javascript/JavaScriptApplicationService.ts:63-106](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptApplicationService.ts#L63-L106)

配置限制检查及实际重建调用。

<details>
<summary>查看原文（44行）</summary>

```text
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
  const listingAdmission = parseAsarListingAdmission(
    options.environment?.REA_ASAR_MAX_LISTING_BYTES,
  );
  if (!listingAdmission.ok) return listingAdmission;
  const overrides = options.settings?.().overrides;
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
```

</details>

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:185-223](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L185-L223)

worker 堆、超时、作用域与分析调用。

<details>
<summary>查看原文（39行）</summary>

```text
      const heap = selectedAnalysisSetting(
        input.max_heap_mb,
        overrides?.["javascript.max_heap_mb"],
        JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.heapMb,
      );
      const timeout = selectedAnalysisSetting(
        input.analysis_timeout_ms,
        overrides?.["javascript.analysis_timeout_ms"],
        JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS.timeoutMs,
      );
      const sourceLimits = {
        ...(input.semantic_precision === undefined
          ? {}
          : { semanticPrecision: input.semantic_precision }),
        heapMb: heap.value,
        heapSource: heap.source,
        timeoutMs: timeout.value,
        timeoutSource: timeout.source,
      };
      const preloads = await discoverJavaScriptPreloadPaths(
        files,
        sourceLimits,
        scope,
        signal,
      );
      const worker = await createJavaScriptSourceAnalysis(
        sourceLimits,
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

**依据 5 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:333-387](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L333-L387)

解析状态、未纳入输入、根哈希和覆盖结果。

<details>
<summary>查看原文（55行）</summary>

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
        ),
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
```

</details>

**依据 6 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:409-450](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L409-L450)

中断、清理失败及部分证据的保留条件。

<details>
<summary>查看原文（42行）</summary>

```text
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
      }
      reconstructionOutcome = { kind: "completed", result: completed };
    } catch (cause: unknown) {
      reconstructionOutcome = { kind: "failed", cause };
    }
    if (readerOpen) {
      const cleanupAttempt = await scope.release(readerOwner);
      if (cleanupAttempt.kind === "failed") {
        const partialObservation: ArtifactInventoryPartialObservation = {
          kind: "artifact-inventory",
          inventory: snapshot,
        };
        throw scope.cleanupFailure(
          reconstructionOutcome,
          [cleanupAttempt],
          partialObservation,
        );
```

</details>

**依据 7 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

Evidence 的身份、来源性质与限制。

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

- 静态图和实际运行行为的吻合度未知。
  **影响**：不能据图推断特性复刻正确，尤其是延迟加载或运行期分支。
  **进一步探讨**：对含一个静态可见入口和一个运行时选择分支的已知样本做行为核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得小范围试用，如何控制全过程成本和退出？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

适合已有 DSH、匹配 Node 环境和一份有权检查的已知 Electron 小样本的逆向工程师。用隔离 DSH home 记录变更前配置，先核对仅启用预期的工具并保持固定路径，初次任务只请求输出可回查的证据与限制。固定根清单要求 Node ^22.23.4、^24.22.1 或 >=26.12.1，launcher 需要构建成品。Linux 下作者为静态路径声明了兼容 ps 这一进程归属条件。试用者需复核文件、源范围与来源身份，对照一项已知行为。

首次人工投入是准备环境、匹配包和检查配置范围，持续投入包括每次回查、复核和维护启动路径。资源消耗包括解析 CPU、堆与模型请求，外部原生后端的许可证属于另一个使用条件，固定样本的金额和时长均未知。比较单位为一份通过来源与行为核对的功能调查记录，额外重试和人工返工计入这一单位。遇到工具未出现、配置冲突、来源不可回查或中断后资源范围不明，应停在该次结果，保留证据并用手工解包、已知源码或行为试验继续。隔离试用可关闭临时实例并弃用专用 home；共享配置若已更改，先核对当前文本和备份再移除自己的注册项，避免覆盖并发更改。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:36-48](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/package.json#L36-L48)

目标程序的 Node 范围和 CLI 入口。

<details>
<summary>查看原文（13行）</summary>

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
  },
  "packageManager": "npm@11.16.0",
```

</details>

**依据 2 · 作者声明**：[README.md:71-91](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/README.md#L71-L91)

作者声明 Linux 进程条件、备份及缓存路径约束。

<details>
<summary>查看原文（21行）</summary>

````text
## Quick start

On Linux, Ghidra, JADX, firmware tool launches and static JavaScript/Electron
analysis require a procps-compatible `ps` on REA's `PATH` for process ownership
checks. Recovery steps are in `docs/getting-started/installation.md` under
"Linux owned-process prerequisite".

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

**依据 3 · 源码核查**：[src/application/SetupClientConfiguration.ts:401-438](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/SetupClientConfiguration.ts#L401-L438)

配置回读、竞争与回滚边界。

<details>
<summary>查看原文（38行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:409-450](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L409-L450)

中断和清理失败时须区分部分输出。

<details>
<summary>查看原文（42行）</summary>

```text
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
      }
      reconstructionOutcome = { kind: "completed", result: completed };
    } catch (cause: unknown) {
      reconstructionOutcome = { kind: "failed", cause };
    }
    if (readerOpen) {
      const cleanupAttempt = await scope.release(readerOwner);
      if (cleanupAttempt.kind === "failed") {
        const partialObservation: ArtifactInventoryPartialObservation = {
          kind: "artifact-inventory",
          inventory: snapshot,
        };
        throw scope.cleanupFailure(
          reconstructionOutcome,
          [cleanupAttempt],
          partialObservation,
        );
```

</details>

#### 缺口

- 目标任务的模型、时间与 CPU/堆成本没有实测。
  **影响**：无法量化采用净收益。
  **进一步探讨**：对同一产物、同一验收条件记录 setup、运行、复核、重跑和退出用时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验将工具结论逐项绑定源证据能否减少错判？

**研究主题**：新假设与验证

#### 完整回答

可检验的假设是，在工具提供产物哈希、参数与局部覆盖信息的基础上，强制每条功能主张标出具体源位置、未覆盖范围和待做的行为检查，会减少把静态线索当成运行事实的误报。以两份已知源码和行为的不同版本小型 Electron 构建物做盲评，其中一份放入看似相关却无法到达的分支，并保留一次可控的解析失败。两组使用同一模型、同一预算和同一 REA 工具，一组自由汇报，另一组按证据逐条登记，再由评审者以源码和运行真值核对正确主张数、错误断言数、无法定位比例与总复核时间。如果错误断言未减少、正确主张明显减少或全部人工复核更费时，就不支持该设计。现有实现提供检验所需的 Evidence 字段，逐条主张的验收约束是待验证研究方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/javascript/JavaScriptApplicationEvidence.ts:67-86](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptApplicationEvidence.ts#L67-L86)

源码中已存在的身份、参数、限制与派生性质。

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

**依据 2 · 源码核查**：[src/application/javascript/JavaScriptArtifactReconstruction.ts:333-375](https://github.com/morluto/rea/blob/047d75a498f18a6608f35ee5e36cf1bf0f81ca97/src/application/javascript/JavaScriptArtifactReconstruction.ts#L333-L375)

已区分完整、部分和不可用的覆盖边界，可据此构造反例。

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

#### 缺口

- 逐条约束的效果仍未知。
  **影响**：不能把研究方案转成插件已有能力或采用收益。
  **进一步探讨**：实施同预算盲评并保存原件和评分表。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
