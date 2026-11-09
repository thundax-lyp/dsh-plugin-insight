# Archify

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[11b0d60](https://github.com/tt-a1i/archify/tree/11b0d6031853bdae89eed57e7979aabbf0034097)

<!-- BEGIN META -->
[![GitHub ★ 94,540](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=94%2C540&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)
<!-- END META -->

> **功能**：让 Agent 将需求或代码关系制作成可交互的独立 HTML 图表和说明页。

> **亮点**：[Q02](#research-q02) 的增量是把候选、产物和机器回执用路径与字节身份串起来，让交接者区分未能渲染、成功写入和浏览器检查通过。加上 [Q03](#research-q03) 的固定 Git 引用，复杂请求链可用一份交互 HTML 浏览，出错时也能追到具体关卡。

> **主要限制**：[Q03](#research-q03) 中的来源校验可以拒绝错路径和越界行，但一段真实源码也可能与连线无关。浏览器阶段检查页面容纳、主题和可读性等信号，关键调用的归属和实际读图仍需核对。

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
  - [Q01 · 什么样的代码交接值得生成 Archify 页面，根条目如何使用？](#detail-section-11)
  - [Q02 · Agent 写的候选图通过哪些关卡才进入目标位置？](#detail-section-12)
  - [Q03 · 固定提交证据能查清什么，错误的关系能否通过关卡？](#detail-section-13)
  - [Q04 · 试画和交付分别需要哪些环境，浏览器或目录出错如何处理？](#detail-section-14)
  - [Q05 · 怎样比较一次合格交接的总负担，何时应回到简单图？](#detail-section-15)
  - [Q06 · 能否在不提高审阅成本的前提下减少有链接但错误的关系？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要向接手人解释跨组件请求链的开发者，可以制作带固定来源的交互页面，供接手人独立探索和核对。[Q01](#research-q01)

短链可直接用 Mermaid 配固定行号链接。协作者能读懂一张静态图时，人工检查已能完成基本交接；需要反复探索节点与分支时，交互页面和阶段收据提供另一种交付方式。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 交互原生图 | 交接架构或请求链 | 候选符合对应类型，完整交接需自动浏览器检查 |
| 单页说明 | 将结论、问答与图表组成一个 HTML | 由 Explainer 输入触发，浏览器检查默认不运行 |
| 固定来源定位 | 对照源码查证节点与关系 | Git 对象可读，语义归因由作者和接手人复核 |
| 阶段回执 | 分辨渲染、写入与浏览器证据 | 回执绑定当次产物，旧字节的回执不能继承 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持 Skill 与本地命令的 Agent、Skill 文件和 Node 18 或以上 | 此创作路径需要 | 写候选并调用 CLI | 可保留文字或手工图，宿主加载需单独核实 |
| 含固定提交对象且 origin 匹配的本地 Git 树 | 声明源码依据时需要 | 核实版本、文件和引用位置 | 补取指定对象，或明确只画描述示意 |
| 兼容的 Chrome 系浏览器及启动权限 | Native 图的完整 finalize 需要，Explainer 可选 | 对指定 HTML 作自动浏览器检查 | 检查回执标为跳过或失败，暂缓交接 |
| 可写产物和证据目录 | 文件交付需要 | 写 HTML、阶段收据与恢复记录 | 查明占用或改用独立目录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者固定一次请求链和源码提交，Agent 写独立候选 | 能指出每个关键关系对应的实际调用点 |
| 渲染 | Agent 调用 finalize，CLI 先核验暂存 HTML 后发布 | 检查通过才提交，输入或暂存检查失败时修候选 |
| 核对 | CLI 在目标路径重读回执并按需启动浏览器 | 最新阶段的摘要和目标 HTML 一致，缺浏览器时修环境 |
| 交接 | 作者人工核对连线、可读性和来源权限 | 接手人能沿主要分支找到代码，事实不清时回退简图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主模型、Node 与浏览器所需资源，金额未知 | 配置 Skill，确认源码读取和输出权限 | 加载与浏览器兼容未实测 |
| 持续使用 | 候选生成、渲染、浏览器和收据存储，单位消耗未知 | 查找调用点，复核图的语义与可读性 | 应按交接合格数计算总投入 |
| 失败恢复 | 重跑需要重复模型或本机资源，次数未知 | 根据阶段诊断区分候选、写入与浏览器问题 | 不能把已写 HTML 当全关卡通过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交付追踪 | 源码显示产物、阶段回执和当前输出绑定 | 故障恢复成功率及真实耗时 |
| 源码追溯 | 归档到固定 Git 提交与可核对行号 | 引用能否证明边、读者能否准确理解 |
| 交接体验 | 作者提供可追踪路径的独立 HTML 示例 | 是否优于静态图和直接说明 |

> **思考**：[Q03](#research-q03) 中的来源校验可以拒绝错路径和越界行，但一段真实源码也可能与连线无关。浏览器阶段检查页面容纳、主题和可读性等信号，关键调用的归属和实际读图仍需核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的增量是把候选、产物和机器回执用路径与字节身份串起来，让交接者区分未能渲染、成功写入和浏览器检查通过。加上 [Q03](#research-q03) 的固定 Git 引用，复杂请求链可用一份交互 HTML 浏览，出错时也能追到具体关卡。

[Q02](#research-q02) 的可借鉴设计是把阶段回执绑定到同一次 deliver 的字节身份与收据 ID，避免路径相同却误用旧检查。暂存文件通过静态检查后才提交，目标文件后续还有检查，调用方需明确哪一步拥有发布权限和失败后由谁处理；局部写入协议的实现核查不能推广到任意文件系统或断电恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中的来源校验可以拒绝错路径和越界行，但一段真实源码也可能与连线无关。浏览器阶段检查页面容纳、主题和可读性等信号，关键调用的归属和实际读图仍需核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 先选一条可独立复核的缓存链，将候选与输出放进独立目录。逐边核对谁发起、谁执行及条件，并确认浏览器收据指向实际分享的文件。关键关系说不清或图反复修仍读不顺时，保留候选并回到带固定链接的 Mermaid。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

阶段化交付和固定 Git 定位已有源码支撑。逐边审阅能否降低错误归因仍是假设，耗时与理解效果需要同任务对照。

- 已检查：作者 README、包清单、源码路径 README.md、archify/SKILL.md、archify/package.json、archify/bin/archify.mjs、archify/bin/finalize.mjs、archify/renderers/architecture/render-architecture.mjs、archify/renderers/shared/cli.mjs、archify/renderers/shared/repository-evidence.mjs、archify/references/repository-authoring.md、archify/bin/visual-check.mjs、archify/references/delivery-contract.md、archify/bin/delivery-update.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计覆盖根仓库存量中的指定 Markdown 与 JS/TS 文件，含仓内其他子组件。逐题仅抽读根 Skill、架构渲染入口、证据定位与交付流水线，未覆盖所有图种、源代码保密审计、外部链接可用性或宿主运行。
- 下一步：用同一仓库和请求链对比手工带链接 Mermaid 与 Archify，独立判断关键分支、引用准确和读者理解，再累计失败重跑与审阅时间。逐边清单的单独对照见 [Q06](#research-q06)。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：未声明（[固定提交 11b0d60](https://github.com/tt-a1i/archify/tree/11b0d6031853bdae89eed57e7979aabbf0034097)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 从节点承载来源的约束出发，提出只为关键 I/O 关系提供可勾选的证据清单。若能减少错认执行者且维持审阅预算，才有理由增加这项维护工作。

用同一仓库和请求链对比手工带链接 Mermaid 与 Archify，独立判断关键分支、引用准确和读者理解，再累计失败重跑与审阅时间。逐边清单的单独对照见 [Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 169 | 28650 | — | — | 307228 |
| .mjs | source | 140 | 60753 | 55006 | 3134 | — |
| .js | source | 25 | 12042 | 11231 | 462 | — |
| .md | example | 8 | 197 | — | — | 2093 |
| .mjs | test | 287 | 88935 | 81789 | 1858 | — |
| .tsx | source | 1 | 4 | 3 | 1 | — |
| .ts | source | 3 | 76 | 64 | 7 | — |
| .md | test | 1 | 58 | — | — | 714 |

</details>

**活跃度**

[![Issue 未关闭 147](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=147&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 118](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=118&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 93](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=93&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者用 Archify 交接一张有源码依据的图时，交付流水线能保证什么，哪些事实和质量仍需人来判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么样的代码交接值得生成 Archify 页面，根条目如何使用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合经常要向新同事解释调用链的开发者。例如把缓存未命中后的数据库读取路径交接给接手人，对方应能沿图指出调用方和存储方，并找到固定提交里的调用位置。手工 Mermaid 加文件链接也可以完成交接，尤其是分支少、只需贴在评审里的情况。作者展示的增量是浏览器可交互的独立 HTML，读者可探索路径和节点详情，查看者按说明无需安装 Skill。这里的根条目是面向支持 Skill 与本地命令的 Agent 的 Skill 及渲染 CLI。仓内 DSH 安装入口是独立的社区适配组件。内层 CLI 包标记 private，不能从 bin 字段推断它以该名称发布到 npm。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:133-148](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/README.md#L133-L148)

作者用下游追踪、缓存链与固定提交系统图说明适用场景。

<details>
<summary>查看原文（16行）</summary>

```text
## Show what matters

| Explain an agent workflow | Follow a cache miss | Explore service relationships |
|---|---|---|
| [![Agent workflow tracing everything the planner drives](docs/assets/archify-demo-reach.png)](https://archify.si/gallery/artifacts/agent-tool-call.workflow.html?theme=dark&present=1#focus=planner&reach=downstream) | [![Cache-miss sequence showing the Web App to Postgres route](docs/assets/archify-demo-route.png)](https://archify.si/gallery/artifacts/cache-miss.sequence.html?theme=dark&present=1#route=web~db) | [![Production architecture comparing backend and database roles](docs/assets/archify-demo-lens.png)](https://archify.si/gallery/artifacts/production-deployment.architecture.html?theme=dark&present=1#lens=backend~database) |
| Trace everything downstream of one step. | Highlight the path from web app to database. | Focus on authored backend and database connections. |

The [Proof Lab](https://archify.si/gallery.html) contains all 11 checked-in scenarios, their JSON sources, and validation receipts.

### Understand a real repository

<sub>CODE → DIAGRAM · A source-backed system map</sub>

[![MCO runtime architecture generated from the public mco-org/mco repository](docs/assets/mco-runtime-share-card.png)](https://archify.si/cases/mco-runtime.architecture.html?theme=dark&present=1)

Archify traced [`mco-org/mco`](https://github.com/mco-org/mco) at `9f1a1cf` and produced this checked map. **[Open it ↗](https://archify.si/cases/mco-runtime.architecture.html?theme=dark&present=1)** · [trace reach ↗](https://archify.si/cases/mco-runtime.architecture.html?theme=dark#focus=router&reach=downstream) · [typed source](docs/cases/mco-runtime.architecture.json)
```

</details>

**依据 2 · 作者声明**：[README.md:168-170](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/README.md#L168-L170)

作者说明读者可在浏览器打开独立 HTML，外部链接仍需要网络。

```text
### Download it. Open it. Explore it.

The output is a self-contained HTML file. Download it and open it in your browser to use the node details and path exploration included in that artifact. No Archify installation is needed to view it. Send the HTML to someone else and the interactions go with it; external websites and map links need a network connection.
```

**依据 3 · 作者声明**：[archify/SKILL.md:10-16](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/SKILL.md#L10-L16)

Skill 规定 Agent 构造候选、创建工作目录并调用本地 CLI。

```text
# Archify

Create checked standalone HTML as a native diagram or a one-page explainer that answers a question.

Run commands from your working directory. Unless the user names another location, give each new artifact request its own folder `.archify/<type>-<slug>-<YYYYMMDD-HHMMSS>/` there (local time, chosen once): keep the candidate and `<slug>.html` in it and reuse it for repairs. Native diagrams use `candidate.json` with `meta.output` relative to the working directory; explainers may use `candidate.archify.md` and a portable output filename. A later request gets a new folder. Replace `bin/archify.mjs` in every command with the installed package's absolute path, or its path relative to your working directory; CLI input and output paths resolve from that directory.

For a native diagram of a real codebase, read [Repository authoring](references/repository-authoring.md) while tracing the requested behavior. A system description uses the native steps below; a frozen candidate uses the handoff path.
```

**依据 4 · 源码核查**：[archify/package.json:1-13](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/package.json#L1-L13)

内层包声明 CLI、Node 版本与 private 属性。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "archify",
  "version": "3.2.0",
  "private": true,
  "type": "module",
  "description": "JSON-IR diagram renderers (architecture / workflow / sequence / dataflow / lifecycle / erd / class / tree / timeline / waterfall).",
  "license": "Apache-2.0",
  "bin": {
    "archify": "./bin/archify.mjs"
  },
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 5 · 作者声明**：[README.md:440-448](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/README.md#L440-L448)

作者分别列出根 Skill 的宿主入口与 DSH 社区集成。

```text
| Surface | Install location or method | Capability |
|---|---|---|
| **Claude Code** | `~/.claude/skills/` or `.claude/skills/` | Full renderer + validation workflow |
| **Codex CLI** | `~/.agents/skills/` or `.agents/skills/` | Full renderer + validation workflow |
| **opencode** | `~/.config/opencode/skills/`, `.opencode/skills/`, or `.agents/skills/` | Full renderer + validation workflow |
| **Claude.ai** | Upload `archify.zip` under Settings → Capabilities → Skills | Depends on Node.js access in the sandbox |
| **Project Knowledge** | Upload `archify.zip` to the project | Prompt-driven architecture fallback |
| **Hermes Agent** | Opt-in: `hermes skills install skills-sh/tt-a1i/archify/archify -y` | Community Skill-only integration; Node `>=18`; not a Nous official product. No telemetry. It is not a switcher target. [Details](integrations/hermes-agent/README.md). |
| **DeepSeek Harness** | Opt-in: `dsh plugin --profile web add @tt-a1i/archify-dsh@1.1.0`. Invoke: `Use the archify skill to map this repository's runtime architecture.` Remove: `dsh plugin --profile web remove @tt-a1i/archify-dsh`. | Community integration for developer-preview `@deepseek-ai/dsh@0.2.1-rc.2`; Node `^22.19.0 \|\| >=24.0.0`; not an official DeepSeek product. No telemetry. Shell files need exact workspace paths, not Web Produced Files. [Details](integrations/deepseek-harness/README.md). |
```

#### 缺口

- 演示由作者挑选，缺少接手人任务对照
  **影响**：可识别交接场景，无法判断多分支时能省多少往返
  **进一步探讨**：用同一真实提交，让接手人分别依靠 Mermaid 和 Archify 定位一次失败路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Agent 写的候选图通过哪些关卡才进入目标位置？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 的 finalize 命令调用 runFinalize。Native 图先执行 deliver，在私有暂存路径渲染冻结的候选，并用产物检查器检查暂存 HTML，再尝试提交目标 HTML 与带身份信息的交付收据。暂存检查失败会提前退出，旧 HTML 保留。finalize 将 deliver 回传的验证记录归为内嵌 validate，通过后才在目标文件上执行要求来源收据的 check 和自动浏览器检查。它把后两关的目标路径、产物摘要与字节长度、交付收据 ID 对照 deliver，并在交接前重读当前产物与候选。若浏览器关卡失败，命令以失败结束。因为 deliver 已在该关之前写入，调用者应按关卡和收据判定，不能把失败状态理解为未写入或已恢复旧 HTML。Explainer 默认走 deliver 与 check，加 --browser-check 才要求浏览器关卡。

#### 证据与依据

**依据 1 · 源码核查**：[archify/bin/archify.mjs:7230-7235](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L7230-L7235)

CLI 将 finalize 子命令分派给 commandFinalize。

```text
    case 'patch':
      await commandPatch(args);
      break;
    case 'finalize':
      await commandFinalize(args);
      break;
```

**依据 2 · 源码核查**：[archify/bin/archify.mjs:5932-5954](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L5932-L5954)

实际接线将候选、输出和 provenance 检查函数交给 runFinalize，并接入浏览器执行。

<details>
<summary>查看原文（23行）</summary>

```text
    result = await runFinalize({
      ...(preparedExplainer ? { preparedExplainer, env: { ...process.env, ARCHIFY_EXPLAINER_PREPARED: preparedBundlePath } } : {}),
      cliPath: fileURLToPath(import.meta.url),
      type,
      input,
      output,
      quality: qualityArgs.quality || 'showcase',
      repoRoot: repoArgs.repoRoot,
      writingMode: writingArgs.writingMode,
      browserCheck: candidateArgs.rest.includes('--browser-check'),
      candidateSha256: candidateArgs.candidateSha256,
      outDir: outDirArgs.outDir,
      receiptPath: receiptArgs.receiptPath,
      inspectDelivery: artifact => inspectArtifactDeliveryProvenance(artifact, true, pathIdentityRuntime),
      deliveryPaths: artifact => ({
        provenance: deliveryProvenancePath(artifact),
        pending: deliveryPendingPath(artifact),
        lock: deliverySidecarPath(artifact, '.delivery-lock.json'),
        directoryLock: path.join(path.dirname(deliveryProvenancePath(artifact)), DELIVERY_DIRECTORY_LOCK),
      }),
      runBrowserCheck: options => executeBrowserEvidence({
        ...options, command: 'browser-check', capture: false, requireProvenance: true,
      }),
```

</details>

**依据 3 · 源码核查**：[archify/bin/archify.mjs:4870-4888](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L4870-L4888)

从暂存候选调用 renderer，渲染失败提前返回。

<details>
<summary>查看原文（19行）</summary>

```text
    const render = runNode([renderer, specificationSnapshotPath, candidatePath], {
      stdio: 'pipe',
      // The page is rendered in staging; paths inside it are written relative to where it is delivered.
      env: { ...rendererEnv(qualityArgs.quality, repoArgs.repoRoot, true), ...(preparedBundlePath ? { ARCHIFY_EXPLAINER_PREPARED: preparedBundlePath, ARCHIFY_EXPLAINER_SNAPSHOT_INPUT: inputPath, ARCHIFY_EXPLAINER_PAGE_DIR: path.dirname(outputPath) } : {}) },
    });
    if (render.status !== 0) {
      const failure = rendererFailure(render);
      await reportDeliveryFailure({
        json,
        stage: 'render',
        type,
        input: inputPath,
        output: outputPath,
        error: failure.error,
        diagnostics: failure.diagnostics,
        status: render.status ?? 1,
      });
      return;
    }
```

</details>

**依据 4 · 源码核查**：[archify/bin/archify.mjs:4903-4909](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L4903-L4909)

在 HTML 仍是候选路径时运行产物检查器。

```text
    const checkMaxBuffer = artifactCheckMaxBuffer();
    const check = runNode([path.join(skillRoot, 'scripts/check-render-output.mjs'), candidatePath], {
      stdio: 'pipe',
      maxBuffer: checkMaxBuffer,
    });
    if (check.status !== 0) {
      if (check.stderr) process.stderr.write(check.stderr);
```

**依据 5 · 源码核查**：[archify/bin/archify.mjs:4931-4942](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L4931-L4942)

暂存检查失败返回并注明保留旧产物。

<details>
<summary>查看原文（12行）</summary>

```text
      await reportDeliveryFailure({
        json,
        stage: 'check',
        type,
        input: inputPath,
        output: outputPath,
        error: 'Final artifact check failed; the previous artifact was preserved.',
        diagnostics: checkerDiagnostics(checker),
        status: check.status ?? 1,
        checker,
      });
      return;
```

</details>

**依据 6 · 源码核查**：[archify/bin/archify.mjs:5124-5135](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/archify.mjs#L5124-L5135)

提交 HTML 和来源收据时传入各自的候选与预期身份。

<details>
<summary>查看原文（12行）</summary>

```text
      const committed = commitDeliveryPair({
        htmlCandidate: candidatePath,
        htmlContent: receipt.artifact,
        provenanceCandidate: provenanceCandidatePath,
        provenanceContent: artifactIdentity(provenanceBytes),
        stagingDirectory,
        ownership: deliveryOwnership,
        verifyAtomicOutput,
        fileBindingRuntime,
      });
      commitRecoveryBackups = committed.recoverableBackups;
      stagingOwnership.push(...committed.ownedBackupEntries);
```

</details>

**依据 7 · 源码核查**：[archify/bin/finalize.mjs:745-751](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L745-L751)

图类型与参数决定是否要求浏览器。

```text
  if (!cliPath || !type || !input || !output) throw new Error('finalize requires cliPath, type, input, and output.');
  const needsBrowser = type !== 'explainer' || browserCheck;
  const started = process.hrtime.bigint();
  const startedAt = new Date().toISOString();
  const resolvedInput = path.resolve(input);
  const resolvedOutput = resolveOutputPath({ requestedOutput: output, inputPaths: [resolvedInput] }).outputPath;
  const resolvedOutDir = outDir === undefined ? undefined : resolveNativeOutputDirectory(outDir);
```

**依据 8 · 源码核查**：[archify/bin/finalize.mjs:514-523](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L514-L523)

各阶段使用明确的参数，包括严格来源收据。

<details>
<summary>查看原文（10行）</summary>

```text
function stageArguments({ stage, type, input, output, quality, repoRoot, outDir, writingMode }) {
  const qualityArgs = ['--quality', quality];
  const repoArgs = [...(repoRoot ? ['--repo-root', repoRoot] : []), ...(type==='explainer' && writingMode ? ['--writing',writingMode] : [])];
  if (stage === 'validate') return ['validate', type, input, ...qualityArgs, ...repoArgs, '--json'];
  if (stage === 'deliver') return ['deliver', type, input, output, ...qualityArgs, ...repoArgs, '--json'];
  if (stage === 'check') return ['check', output, '--require-provenance'];
  return [
    'browser-check', output, '--json', '--require-provenance',
    ...(outDir ? ['--out-dir', outDir] : []),
  ];
```

</details>

**依据 9 · 源码核查**：[archify/bin/finalize.mjs:833-846](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L833-L846)

阶段次序固定，浏览器在交付和严格检查之后。

<details>
<summary>查看原文（14行）</summary>

```text
  try {
    let exitCode = 0;
    for (const stage of (needsBrowser ? ['deliver', 'check', 'browser-check'] : ['deliver','check'])) {
      const stageStarted = process.hrtime.bigint();
      const args = stageArguments({
        stage,
        type,
        input: resolvedInput,
        output: resolvedOutput,
        quality,
        repoRoot,
        writingMode,
        outDir: resolvedOutDir,
      });
```

</details>

**依据 10 · 源码核查**：[archify/bin/finalize.mjs:950-968](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L950-L968)

通过的 deliver 回执产生标记为内嵌的 validate。

<details>
<summary>查看原文（19行）</summary>

```text
      if (stage === 'deliver' && status === 'pass') {
        // Non-blocking warnings (for example locale fallbacks) stay visible in
        // a passing receipt; a later failing gate replaces them.
        receipt.diagnostics = (stageReceipt.diagnostics || []).filter((entry) => entry?.severity === 'warning');
        receipt.stages.validate = {
          status: 'pass',
          exitCode: 0,
          durationMs: null,
          execution: 'embedded-in-deliver',
          command,
          receipt: {
            schemaVersion: 1,
            ok: true,
            command: 'validate',
            specification: stageReceipt.specification,
            validation: stageReceipt.validation,
          },
        };
        receipt.stages.deliver = stageEntry;
```

</details>

**依据 11 · 源码核查**：[archify/bin/finalize.mjs:322-337](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L322-L337)

阶段回执要求路径、产物身份和交付收据 ID 对齐。

<details>
<summary>查看原文（16行）</summary>

```text
  const receiptArtifactPath = receipt.artifact?.path;
  const receiptFile = receipt.file;
  const pathMatchesOutput = stage === 'check'
    ? typeof receiptFile === 'string' && pathsAlias(receiptFile, output)
    : typeof receiptArtifactPath === 'string' && pathsAlias(receiptArtifactPath, output);
  if (!pathMatchesOutput
      || !identitiesMatch(receipt.artifact, expectedArtifact)
      || receipt.deliveryReceiptId !== expectedReceiptId) {
    return identityMismatchDiagnostic({
      stage,
      expected: expectedArtifact,
      actual: receipt.artifact,
      expectedReceiptId,
      actualReceiptId: receipt.deliveryReceiptId,
      output,
    });
```

</details>

**依据 12 · 源码核查**：[archify/bin/finalize.mjs:997-1028](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L997-L1028)

中止条件和最终重读，失败没有从这里进入产物回滚。

<details>
<summary>查看原文（32行）</summary>

```text
      if (status !== 'pass') {
        exitCode = status === 'skipped' ? 2 : (code || 1);
        receipt.status = status;
        receipt.diagnostics = consolidateDiagnostics(
          stageDiagnostics || failureDiagnostics(stage, result, stageReceipt, quality),
        );
        receipt.failedStage = stage === 'deliver'
          && receipt.stages.validate.status === 'fail' ? 'validate' : stage;
        break;
      }
      persistReceipts();
    }

    receipt.ok = exitCode === 0;
    receipt.status = receipt.ok ? 'pass' : receipt.status === 'running' ? 'fail' : receipt.status;
    if (receipt.ok) {
      const deliveryReceipt = receipt.stages.deliver?.receipt;
      const diagnostic = finalArtifactDiagnostic({
        output: resolvedOutput,
        expectedArtifact: deliveryReceipt?.artifact,
        expectedReceiptId: deliveryReceipt?.receiptId,
        type,
        deliveryPath: deliveryPaths(resolvedOutput).provenance,
        inspectDelivery,
      });
      if (diagnostic) {
        exitCode = 1;
        receipt.ok = false;
        receipt.status = 'fail';
        receipt.failedStage = 'finalize';
        receipt.diagnostics = [diagnostic];
      }
```

</details>

**依据 13 · 源码核查**：[archify/bin/finalize.mjs:1030-1045](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L1030-L1045)

最终检查候选摘要，失败仍记录当前目标文件身份。

<details>
<summary>查看原文（16行）</summary>

```text
    if (receipt.ok && !identitiesMatch(specification, identity(resolvedInput))) {
      exitCode = 1;
      receipt.ok = false;
      receipt.status = 'fail';
      receipt.failedStage = 'finalize';
      receipt.diagnostics = [{
        code: 'finalize/candidate-changed', severity: 'error',
        message: 'The frozen candidate changed before the final handoff.',
        subject: { candidate: resolvedInput },
        evidence: { expected: specification, actual: identity(resolvedInput) },
        supportedFixes: ['restore the frozen candidate, or finalize the edited candidate as a new attempt'],
      }];
    }
    receipt.artifact = receipt.ok
      ? { path: resolvedOutput, ...receipt.stages.deliver.receipt.artifact }
      : identity(resolvedOutput);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定提交证据能查清什么，错误的关系能否通过关卡？

**研究主题**：缺陷与关键质疑、贡献与相对优势

#### 完整回答

以 Architecture 为例，渲染器读入 JSON 后校验结构和跨集合约束，随后沿 --repo-root 提供的本地仓库核对 origin、提交对象、文件 blob 和行号边界。通过的来源进入写出 HTML 的输入。引用模式可以只做本地核对，符合规范的 Web 模式才生成链接。这个检查能发现路径错、提交不可用和引用超过文件末尾。作者要求在拥有该操作的节点上引用调用或写入位置，连线本身没有独立来源字段。机械核对的是引用所指对象，不分析该行是否支持这条关系。例如，助手把缓存读取者标成 API 路由，引用一个确实存在却只做参数校验的行，来源关卡能核对这个行号却不会识别归因错误。报告要交接谁拥有副作用时，需从图走到真正执行读取的调用点。

#### 证据与依据

**依据 1 · 源码核查**：[archify/renderers/architecture/render-architecture.mjs:51-59](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/architecture/render-architecture.mjs#L51-L59)

Architecture renderer 接入共享加载入口并读取来源核查结果。

```text
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const layoutJsonMode = process.argv.includes('--layout-json');
const cliArgs = process.argv.filter((arg) => arg !== '--layout-json');
const { diagram: arch, template, outPath, sourceEvidence } = await loadDiagramWithBrandMarks({
  rendererDir: __dirname,
  diagramType: 'architecture',
  defaultExample: 'web-app.architecture.json',
  argv: cliArgs,
});
```

**依据 2 · 源码核查**：[archify/renderers/shared/cli.mjs:80-87](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/cli.mjs#L80-L87)

结构检查之后，加载器实际调用 repository-evidence 校验。

```text
  const authoredOutput = diagram?.meta?.output;
  if (authoredOutput !== undefined) validateAuthoredOutputPath(authoredOutput);
  validateSchema(diagramType, diagram);
  applyLocaleTranslations(diagramType, diagram);
  validateCrossCollectionContracts(diagramType, diagram);
  validateEngineeringProfile(diagramType, diagram);
  const sourceEvidence = verifyRepositoryEvidence(diagramType, diagram, process.env.ARCHIFY_REPO_ROOT);
  const template = fs.readFileSync(path.join(skillRoot, 'assets/template.html'), 'utf8').replace('</head>', `${softwareNoticesHtml}\n</head>`);
```

**依据 3 · 源码核查**：[archify/renderers/architecture/render-architecture.mjs:1194-1203](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/architecture/render-architecture.mjs#L1194-L1203)

来源结果被传入渲染产物写出。

<details>
<summary>查看原文（10行）</summary>

```text
  validateArchitecture();
  writeDiagram({
    outPath,
    template,
    diagramType: 'architecture',
    meta: arch.meta,
    svg: renderSvg(),
    cards: arch.cards,
    sourceEvidence,
  });
```

</details>

**依据 4 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:232-247](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/repository-evidence.mjs#L232-L247)

检查规范化 origin 和固定提交对象可用性。

<details>
<summary>查看原文（16行）</summary>

```text
  const origin = gitValue(realRoot, ['remote', 'get-url', 'origin'], 'Evidence repository must have an origin remote.').trim();
  if (parseRepositoryRemote(origin, { provider: repository.provider })?.identity !== location.identity) {
    const safeOrigin = redactRepositoryRemote(origin);
    evidenceFailure('repository-evidence/origin-mismatch', `Evidence repository origin ${JSON.stringify(safeOrigin)} does not match ${JSON.stringify(repository.url)}.`, {
      subject: { repoRoot: realRoot },
      evidence: { localOrigin: safeOrigin, authoredRepository: repository.url },
      supportedFixes: ['use the matching local checkout or correct the authored repository URL'],
    });
  }

  const revision = repository.revision.toLowerCase();
  const commit = runGit(realRoot, ['cat-file', '-e', `${revision}^{commit}`]);
  if (commit.status !== 0) {
    evidenceFailure('repository-evidence/revision-unavailable', `Evidence revision ${revision} is not available in the local repository.`, {
      subject: { repoRoot: realRoot },
      evidence: { revision },
```

</details>

**依据 5 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:311-328](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/repository-evidence.mjs#L311-L328)

区别无法取到 Git 对象和路径错，提示补取指定对象。

<details>
<summary>查看原文（18行）</summary>

```text
            const type = runGit(realRoot, ['cat-file', '-t', object]);
            return type.status === 0 && type.stdout.trim() === 'blob';
          })();
        if (!objectIsBlob) {
          // A promisor blob can exist in the pinned tree without being stored
          // locally. Do not tell the caller to change a correct source path.
          const tree = runGit(realRoot, ['ls-tree', '-z', revision, '--', source.path]);
          const knownBlob = tree.status === 0 && tree.stdout.split('\0').some((entry) => {
            const separator = entry.indexOf('\t');
            return entry.slice(separator + 1) === source.path
              && /^\d+ blob [a-f0-9]+$/.test(entry.slice(0, separator));
          });
          if (knownBlob) {
            evidenceFailure('repository-evidence/object-unavailable', `${where} exists at revision ${revision}, but its content is unavailable in the local repository.`, {
              subject: { path: where, ...nodeSubject },
              evidence: { sourcePath: source.path, revision },
              supportedFixes: ['explicitly fetch the pinned source objects into the local checkout, then retry verification'],
            });
```

</details>

**依据 6 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:336-356](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/repository-evidence.mjs#L336-L356)

读取引用 blob 并检查上界，核对通过后生成该来源的定位信息。

<details>
<summary>查看原文（21行）</summary>

```text
        if (source.line) {
          const content = prefetched && Object.hasOwn(prefetched, 'content')
            ? { status: 0, stdout: prefetched.content }
            : runGit(realRoot, ['show', object]);
          if (content.status !== 0) evidenceFailure('repository-evidence/file-unreadable', `${where} could not be read at revision ${revision}.`, {
            subject: { path: where, ...nodeSubject },
            evidence: { sourcePath: source.path, revision },
            supportedFixes: ['verify the pinned blob is readable in the local checkout'],
          });
          const lineCount = sourceLineCount(content.stdout);
          const requestedLine = source.endLine || source.line;
          if (requestedLine > lineCount) {
            evidenceFailure('repository-evidence/line-out-of-range', `${at} requests line ${requestedLine}, but ${source.path} has ${lineCount} lines at revision ${revision}.`, {
              subject: { path: at, ...nodeSubject },
              evidence: { sourcePath: source.path, requestedLine, lineCount, revision },
              supportedFixes: ['use a line range that exists at the pinned revision'],
            });
          }
        }
        verified.push({ ...source, ...(linkMode === 'web' ? { href: repositorySourceHref(location.provider, location.url, revision, source) } : {}) });
        referenceCount += 1;
```

</details>

**依据 7 · 作者声明**：[archify/references/repository-authoring.md:76-83](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/repository-authoring.md#L76-L83)

作者明确关系归属要在主元素的来源中记录。

```text
## Evidence by diagram type

Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
```

#### 缺口

- 有行号却误归因的频率未知
  **影响**：影响为每条关系加审阅手续的必要性
  **进一步探讨**：取一批已交付的请求链，盲审有来源的关系是否由所引行支持。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试画和交付分别需要哪些环境，浏览器或目录出错如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

创作者需要支持 Skill 和 Shell 的 Agent、Skill 文件以及声明为 Node 18 或更高版本的 CLI。要核对真实仓库来源，另需 origin 匹配且含目标提交对象的本地 Git 树。Native 图的完整 finalize 需要可启动的 Chrome、Chromium 或受支持的 Edge。缺少时浏览器关写 skipped，finalize 以非零返回；默认 Explainer 则不要求这一步。目标目录要允许产物和收据写入。作者给本地文件系统的目录锁规定了排他创建和所有权检查，已有锁或碰到不同候选的旧浏览器证据应先分辨所有者，不能把旧回执归到新字节。对已查明的环境问题，可保留原候选改用可用浏览器重跑；改候选时另选证据目录保留旧收据。Finalize 另起限时更新检查，可显式关闭，这与图的语义审阅无关。

#### 证据与依据

**依据 1 · 源码核查**：[archify/package.json:8-13](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/package.json#L8-L13)

本地 CLI 和 Node 下限来自内层清单。

```text
  "bin": {
    "archify": "./bin/archify.mjs"
  },
  "engines": {
    "node": ">=18"
  },
```

**依据 2 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:198-203](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/repository-evidence.mjs#L198-L203)

声明来源的图缺本地仓库根会得到失败诊断。

```text
  if (!repoRootInput) {
    evidenceFailure('repository-evidence/root-required', 'This diagram declares source evidence. Pass --repo-root <repository> so Archify can verify it before rendering.', {
      subject: { path: '/meta/repository' },
      supportedFixes: ['pass --repo-root with the matching local Git checkout'],
    });
  }
```

**依据 3 · 源码核查**：[archify/bin/visual-check.mjs:2545-2565](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/visual-check.mjs#L2545-L2565)

无可用 Chrome 系浏览器时记录 skipped 并提示配置。

<details>
<summary>查看原文（21行）</summary>

```text
  const resolvedChrome = chromePath || resolveChrome();
  receipt.chrome = resolvedChrome
    ? { status: 'available', executable: resolvedChrome }
    : { status: 'unavailable', executable: null };

  if (!resolvedChrome) {
    receipt.status = 'skipped';
    receipt.containment.status = 'skipped';
    receipt.readability.status = 'skipped';
    receipt.viewerChrome.status = 'skipped';
    receipt.themeStates.status = 'skipped';
    if (capture) receipt.captures.status = 'skipped';
    receipt.error = 'No supported browser found. Install Chrome/Chromium (or Microsoft Edge), or set ARCHIFY_CHROME to its executable path.';
    receipt.diagnostics = [failureDiagnostic({
      code: 'viewer/chrome-unavailable',
      severity: 'warning',
      message: receipt.error,
      subject: { artifact },
      evidence: { executable: null },
      supportedFixes: [`set ARCHIFY_CHROME to a Chrome/Chromium executable (or Microsoft Edge) and rerun ${command}`],
    })];
```

</details>

**依据 4 · 源码核查**：[archify/bin/finalize.mjs:997-1005](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L997-L1005)

skipped 阶段使 finalize 返回非零。

```text
      if (status !== 'pass') {
        exitCode = status === 'skipped' ? 2 : (code || 1);
        receipt.status = status;
        receipt.diagnostics = consolidateDiagnostics(
          stageDiagnostics || failureDiagnostics(stage, result, stageReceipt, quality),
        );
        receipt.failedStage = stage === 'deliver'
          && receipt.stages.validate.status === 'fail' ? 'validate' : stage;
        break;
```

**依据 5 · 作者声明**：[archify/references/delivery-contract.md:47-65](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/delivery-contract.md#L47-L65)

作者说明已有锁是恢复屏障，并给出本地写入所有权约定。

<details>
<summary>查看原文（19行）</summary>

```text
For migration safety, Archify also detects and preserves a legacy
`<output-stem>.delivery-lock.json` beside the requested artifact. An existing
legacy entry is a fail-closed recovery barrier. While a new delivery owns the
directory mutex, it also holds temporary legacy-format fences for the requested
spelling and an existing artifact's physical target spelling. It acquires the
directory lock first, then all required compatibility fences before writing a
journal or artifact, and removes the directory lock before those fences during
release. This blocks an older Archify binary using
either known spelling from entering the delivery. A legacy fence whose raw
HEAD-era filename exceeds the host component limit is omitted because the old
binary could not create that lock or deliver that artifact on the host either.

`deliver` acquires the lock by exclusive `open(..., "wx")` before creating or
replacing the recovery journal. A successful exclusive create yields an
internal opaque ownership capability bound to that attempt. Journal creation,
failed-provenance recording, pair commit, rollback, journal finalization, and
lock release each verify the current capability inside the operation that
would mutate shared state. A rejected contender does not create a journal or
write failed provenance.
```

</details>

**依据 6 · 作者声明**：[archify/references/delivery-contract.md:563-572](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/delivery-contract.md#L563-L572)

变更候选后，可把新证据放到单独目录，旧收据仍绑定旧文件。

<details>
<summary>查看原文（10行）</summary>

````text
## A new candidate at an existing output path

Browser evidence belongs to exact artifact bytes. After editing a candidate whose previous HTML already has browser evidence, choose a fresh evidence directory before running the next `finalize`; this preserves the old receipts and captures without an avoidable ownership-conflict retry. `--out-dir` relocates the new browser-check receipt and, by default, the finalize receipt and summary. An explicit `--receipt` overrides the finalize receipt path; its summary follows that path. Successful delivery still rewrites the requested HTML and its sibling `*.delivery.json`. Earlier browser or visual evidence remains bound to its original artifact bytes and must not be treated as evidence for changed HTML:

```bash
node bin/archify.mjs finalize architecture candidate.json diagram.html --quality showcase --repo-root <root> --out-dir diagram.review-2 --json
node bin/archify.mjs visual-check diagram.html --out-dir diagram.review-2 --summary --require-provenance
```

The evidence directory is not an archive of the HTML. Copying the HTML there alone does not rebind receipt paths or provenance. If a historical snapshot is needed, preserve the candidate and artifact separately before overwriting them; do not assume copied receipts validate a relocated artifact.
````

</details>

**依据 7 · 源码核查**：[archify/bin/finalize.mjs:815-821](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/finalize.mjs#L815-L821)

回执创建后发起有截止时间的更新检查。

```text
  persistReceipts();
  // The gates below usually take seconds, so a slower network can finish the
  // update check in parallel instead of timing out on every delivery.
  const updateCheck = startUpdateCheck({ env, deadlineMs: needsBrowser ? FINALIZE_UPDATE_DEADLINE_MS : 200 });

  // Resolve and launch Chrome only after delivery and strict artifact checks pass.
  // Invalid candidates must not start a browser that cannot inspect an artifact.
```

**依据 8 · 源码核查**：[archify/bin/delivery-update.mjs:49-72](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/bin/delivery-update.mjs#L49-L72)

更新检查可以禁用，并对检查子进程设置时限。

<details>
<summary>查看原文（24行）</summary>

```text
export function startDeliveryUpdateCheck({
  env = process.env, deadlineMs = DEADLINE_MS, checkerPath = childPath,
} = {}) {
  if (env.ARCHIFY_UPDATE_CHECK_DISABLED === '1') return Promise.resolve(unavailable('disabled'));
  return new Promise((resolve) => {
    let child;
    try {
      const deadlineNs = process.hrtime.bigint() + BigInt(Math.floor(deadlineMs * 1_000_000));
      child = spawn(process.execPath, [checkerPath, String(deadlineNs)], {
        env,
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true,
      });
    } catch {
      resolve(unavailable('runtime-unavailable'));
      return;
    }
    let output = '';
    let timedOut = false;
    let overflow = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, deadlineMs);
```

</details>

#### 缺口

- 未验证不同系统与工作区权限组合
  **影响**：声明中的 Node 下限不能代替实际环境与浏览器兼容矩阵
  **进一步探讨**：用目标环境中的独立输出目录试一次并区分浏览器跳过、写入错误和校验错误。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样比较一次合格交接的总负担，何时应回到简单图？

**研究主题**：效果与总成本、采用判断

#### 完整回答

以一次合格的请求链交接为单位。接手人须能沿图找出关键分支和源码位置，人工确认主要关系与目标提交一致；采用 Native 图时还应有与当次 HTML 对齐的浏览器和交付回执。比较时应固定源码切片、绘图任务及模型，将 Archify 的候选编写、调版、浏览器启动、回执修复和人工逐边审阅计入，与手工 Mermaid 加文件引用或直接写说明比较。前置资源包括 Node、兼容浏览器和本地输出空间，宿主模型可能按自身方案计费。重复使用的人工时间主要花在事实核对与修复，渲染和重跑也消耗本机资源。失败时先识别收据是哪次产物；目录或浏览器不适配、反复修图仍看不清主路径或关键事实无可核实来源时，保留候选，退回 Mermaid 和人工复核。现有材料能说明工作项与可回退性，无法给出单次金额、平均耗时或净收益。

#### 证据与依据

**依据 1 · 作者声明**：[archify/SKILL.md:39-49](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/SKILL.md#L39-L49)

完整 finalize 与失败后按关卡修复的作者流程。

<details>
<summary>查看原文（11行）</summary>

````text
4. Once the complete first candidate is written, run `finalize` directly. Its first gate is showcase validation; successful first drafts need no separate pre-validation. Keep the candidate unchanged while the command runs:

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   For a repository-backed candidate, include evidence on the first draft and use the complete first command: `node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`. Pass the `--quality` that matches `meta.quality_profile`, such as `standard` for a dense first ERD pass.

   A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed. Use its compact summary; run standalone commands only for a separate request or focused failure diagnosis.

5. A non-zero exit is never success. Read compact stdout or `evidence.summaryReceipt`, then [repair the failed gate](references/delivery-contract.md#failed-finalize-and-candidate-repair), including its repair limit. Preserve requested meaning and source evidence. For several tangled Architecture routes, read [Architecture layout repair](references/architecture-layout-repair.md); for measured field or geometry failures, read [Authoring contract](references/authoring-contract.md). Edit the connected neighborhood and rerun the complete `finalize` command from step 4. Once a run has reached `browser-check`, the output path owns that evidence: give every later run its own `--out-dir <folder>/review-<n>`.
````

</details>

**依据 2 · 作者声明**：[archify/SKILL.md:91-97](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/SKILL.md#L91-L97)

自动通过后仍可能建议检查布局或看可选截图。

```text
`finalize` stops at the first non-passing gate. Its compact stdout and `<output-stem>.finalize-summary.json` are ordinary evidence. A passing run creates no screenshots and reports `visualReview: "not-requested"`.

When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.
```

**依据 3 · 作者声明**：[archify/references/delivery-contract.md:389-396](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/delivery-contract.md#L389-L396)

作者区分静态产物、浏览器证据、截图和感知审阅。

```text
The delivery interface exposes four separate claims:

1. `deliver` proves deterministic artifact checks and byte identity.
2. `browser-check` collects required automated browser evidence from the exact artifact without capturing images.
3. `visual-check` optionally adds artifact-bound screenshots and a contact sheet.
4. Perceptual visual review records a human or image-capable reviewer's judgment.

Passing one claim never implies the others. Never claim that the deterministic receipt includes browser or perceptual review evidence.
```

**依据 4 · 作者声明**：[archify/references/delivery-contract.md:563-572](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/delivery-contract.md#L563-L572)

重复输出需要分辨新旧证据和另存候选，产生复核与保留工作。

<details>
<summary>查看原文（10行）</summary>

````text
## A new candidate at an existing output path

Browser evidence belongs to exact artifact bytes. After editing a candidate whose previous HTML already has browser evidence, choose a fresh evidence directory before running the next `finalize`; this preserves the old receipts and captures without an avoidable ownership-conflict retry. `--out-dir` relocates the new browser-check receipt and, by default, the finalize receipt and summary. An explicit `--receipt` overrides the finalize receipt path; its summary follows that path. Successful delivery still rewrites the requested HTML and its sibling `*.delivery.json`. Earlier browser or visual evidence remains bound to its original artifact bytes and must not be treated as evidence for changed HTML:

```bash
node bin/archify.mjs finalize architecture candidate.json diagram.html --quality showcase --repo-root <root> --out-dir diagram.review-2 --json
node bin/archify.mjs visual-check diagram.html --out-dir diagram.review-2 --summary --require-provenance
```

The evidence directory is not an archive of the HTML. Copying the HTML there alone does not rebind receipt paths or provenance. If a historical snapshot is needed, preserve the candidate and artifact separately before overwriting them; do not assume copied receipts validate a relocated artifact.
````

</details>

#### 缺口

- 缺合格任务分母、模型用量及失败重跑次数
  **影响**：无法判断部署开销是否被重复交接摊薄
  **进一步探讨**：对相同交接任务记录失败也计入的总人分钟、模型用量和独立盲评合格率。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否在不提高审阅成本的前提下减少有链接但错误的关系？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在现有节点引用旁，为会触发写入或跨边界调用的关系增加一张小的审阅清单。每行列出发起者、执行者、操作条件、固定调用位置和由接手人勾选的结论。架构图的现有规则已经要求在拥有者上引用调用点，增量在于把会影响交接的边单独暴露，避免一个节点来源被误借来证明多条关系。机械检查仍只核对引用位置。可取同一批请求链并埋入少量可定位的误归因，保持绘图输入、代码版本和受试者经验可比，随机交叉给读者普通图或附清单的同图。统计每十条关键关系的漏检、正确关系的误报、完成人分钟和接手人能否定位失败分支。若漏检未降、误报增加或加清单后总审阅人时高于约定预算，停止扩展。

#### 证据与依据

**依据 1 · 作者声明**：[archify/references/repository-authoring.md:35-55](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/repository-authoring.md#L35-L55)

作者已有实际执行者、I/O 归属和调用点要求，构成对照流程。

<details>
<summary>查看原文（21行）</summary>

```text
3. **Trace ownership.** Derive runtime and I/O relationships from the observed
   actor, operation, and target at their call sites; deployment and trust
   relationships use the corresponding configuration or enforcement evidence. Distinguish the controller requesting
   an operation from the runtime that executes it and the store receiving bytes.
   For a file or database edge, the source must identify its actual reader or
   writer; a responsibility statement such as “maintains tasks” does not prove
   direct I/O. Keep these facts with the source locations while reading, without
   a separate planning artifact. Choose which distinctions need separate
   nodes using [Composition and meaning](authoring-defaults.md#composition-and-meaning);
   discovering an implementation role does not automatically add it to the overview.
   A configured provider, an injected adapter, a local stub, and a durable
   service are different claims; label the one the source supports.

4. **Record evidence while reading.** Keep exact repository-relative paths and
   inclusive line ranges for each component and meaningful relationship. Follow
   actual branches, retries, fallbacks, and error handling. A function that is
   exported or configured but never called by the normal path is an optional
   capability, not a required runtime edge. For a claim about authoritative
   state change or control ownership, trace to the actual write or execution
   site and the conditions that permit it; an upstream caller alone does not
   establish those conditions.
```

</details>

**依据 2 · 作者声明**：[archify/references/repository-authoring.md:76-83](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/references/repository-authoring.md#L76-L83)

关系无独立来源，支持把逐边审阅从节点引用中显式抽出来。

```text
## Evidence by diagram type

Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
```

**依据 3 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:336-356](https://github.com/tt-a1i/archify/blob/11b0d6031853bdae89eed57e7979aabbf0034097/archify/renderers/shared/repository-evidence.mjs#L336-L356)

固定行号校验可以复用，关系语义仍需人工检查。

<details>
<summary>查看原文（21行）</summary>

```text
        if (source.line) {
          const content = prefetched && Object.hasOwn(prefetched, 'content')
            ? { status: 0, stdout: prefetched.content }
            : runGit(realRoot, ['show', object]);
          if (content.status !== 0) evidenceFailure('repository-evidence/file-unreadable', `${where} could not be read at revision ${revision}.`, {
            subject: { path: where, ...nodeSubject },
            evidence: { sourcePath: source.path, revision },
            supportedFixes: ['verify the pinned blob is readable in the local checkout'],
          });
          const lineCount = sourceLineCount(content.stdout);
          const requestedLine = source.endLine || source.line;
          if (requestedLine > lineCount) {
            evidenceFailure('repository-evidence/line-out-of-range', `${at} requests line ${requestedLine}, but ${source.path} has ${lineCount} lines at revision ${revision}.`, {
              subject: { path: at, ...nodeSubject },
              evidence: { sourcePath: source.path, requestedLine, lineCount, revision },
              supportedFixes: ['use a line range that exists at the pinned revision'],
            });
          }
        }
        verified.push({ ...source, ...(linkMode === 'web' ? { href: repositorySourceHref(location.provider, location.url, revision, source) } : {}) });
        referenceCount += 1;
```

</details>

#### 缺口

- 逐边清单未实现或对照验证
  **影响**：无法确定增加的字段是否值得维护
  **进一步探讨**：在现有图旁人工附清单先做小样本交叉盲审。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
