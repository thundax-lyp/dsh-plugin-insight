# Argo

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[af556a3](https://github.com/taxueseek/argo/tree/af556a3d7f2b4632e8707b51496cb02f92b4abf2)

<!-- BEGIN META -->
[![GitHub ★ 220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taxueseek/argo) [![npm 30d 1,572](https://img.shields.io/static/v1?label=npm+30d&message=1%2C572&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/argo-search) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/argo-search)
<!-- END META -->

> **功能**：为 Agent 提供多源搜索、网页取证和本地资料检索，并以 CLI、Skill 与 MCP 接口交付结果。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把多源调度、失败分类、口径分组排名与Agent消费接口组合，减少调用侧分别接源的工作；成熟RRF与作者覆盖数不等原创算法或实际研究收益。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) 引擎共识不等独立证据，质量guard可降级，缺日期的时间窗可能未过滤。超时返回不保证尾部远端请求停止，默认本地并入也要求明确数据范围。

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
  - [Q01 · 多源搜索给谁增加什么？](#detail-section-11)
  - [Q02 · 查询路由、失败隔离、排序和输出如何接线？](#detail-section-12)
  - [Q03 · 来源依赖、成本与退出能否支持使用？](#detail-section-13)
  - [Q04 · 如何证明多源带来独立证据而非重复结果？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨领域/语言查证公开信息的Agent开发者可以统一收集搜索结果和原文线索，再自行完成事实判断。

[Q01](#research-q01) 相对人工依次查询少数来源，增量是路由和统一返回，而非自动证明多源独立或完成判断稿；根工具与DSH适配研究分开。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| CLI/MCP搜索 | 按任务统一调用多源检索 | 需Python/网络/来源条件；部分失败须读诊断 |
| 结果加工 | 过滤、去重、RRF与口径分组 | 排名与共识不证明事实/独立性 |
| 缓存/尾部补全 | 复用结果和移交未完请求 | 存在本地状态，返回不等远端全停止 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node启动器与Python3.9+/PyYAML | npm入口必需，声明范围 | 执行Python内核 | Python启动失败非零退出 |
| 网络与选定来源权限 | 对应源必需 | 取候选/正文 | 源可跳过、失败或partial，不代表全问题无答案 |
| API key/浏览器 | 特定源或登录内容才需 | 受限访问 | 不能把免密钥宣传当权限保证 |
| 明确本地范围与缓存策略 | 本地并入/持久状态时必需 | 控制读本机与结果留存 | 默认include_local需主动审阅 |
| 原文与人工判据 | 研究判断必需 | 核事实/日期/独立性 | 排名不能代替验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定工具与少量公开源，关闭本地并入 | 核Python/权限和日志策略；本轮未安装 |
| 搜索 | Agent经CLI call或MCP提交任务 | 读结果和来源失败，不只看退出码 |
| 核验 | 抓原文并比较日期/口径/发布者 | 引擎共识不当独立证据数 |
| 办结 | 人工按问题判据复核结论 | 事实/推断分开，纳入缺口 |
| 退出 | 停用入口，核对本地缓存/集成/记录 | 退回少源人工检索，不自动清数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/Python与源配置 | 接入来源、权限和数据范围 | 金额/工时未知 |
| 持续使用 | 可收费源、抓取、模型token与缓存 | 核原文/日期/独立性和来源健康 | 未测单位合格问题成本 |
| 失败恢复 | 重试/补搜、尾部补全和状态空间 | 辨认partial/降级、回人工源 | 超时不证明远端停止 |
| 退出 | 保留需追溯证据与本地记录 | 核对缓存/学习/集成配置 | 完整自动清理未核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 搜索组织 | 路由、预算、错误分类和加工链 | 实时全源可用性/任务收益 |
| 证据线索 | URL去重与口径隔离 | 发布者独立性和事实正确率 |
| 失败可辨 | partial/错误与日期未过滤告警 | 所有压缩消费形态覆盖全部诊断 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 引擎共识不等独立证据，质量guard可降级，缺日期的时间窗可能未过滤。超时返回不保证尾部远端请求停止，默认本地并入也要求明确数据范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把多源调度、失败分类、口径分组排名与Agent消费接口组合，减少调用侧分别接源的工作；成熟RRF与作者覆盖数不等原创算法或实际研究收益。

[Q02](#research-q02) CLI信号退出、MCP错误码、prepare/dispatch/postprocess/finalize分离和明确partial值得借鉴；guard降级与尾部补全需在调用方保持不确定性，不得宣称所有请求已取消或质量已放行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 引擎共识不等独立证据，质量guard可降级，缺日期的时间窗可能未过滤。超时返回不保证尾部远端请求停止，默认本地并入也要求明确数据范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先固定少量公开源并关闭本地并入，保留原文和失败诊断，用同任务核对正确率与全部投入。日期/来源失配或总成本超过少源方案便退出，不拿结果数量代替办结。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查根CLI/MCP到搜索调度、加工和失败输出代表链路；未查询任何源、运行目标代码、使用账号或复现作者性能。未来独立性评估未验证。

- 已检查：作者 README、包清单、源码路径 README.md、SKILL.md、bin/argo.js、scripts/engine_dispatch.py、scripts/mcp_handlers.py、scripts/mcp_server.py、scripts/search.py、scripts/search_pipeline.py、scripts/search_rank.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根工具定向核查Node/Python入口、搜索分阶段、RRF与失败策略；未审计284源、全部抓取/浏览器/登录/重算权限或DSH子包，不运行目标代码。Python不纳入现有JS/TS统计，不能把统计当全语言规模。
- 下一步：按[Q04](#research-q04)在固定预算公开任务中比较转载/镜像/日期反例下独立性说明与默认结果，计错误共识、正确率和人工核验；无改善或成本抵消则否定。本轮未执行。

**分析版本**

- **仓库**：[taxueseek/argo](https://github.com/taxueseek/argo)
- **版本号**：2.10.1（[固定提交 af556a3](https://github.com/taxueseek/argo/tree/af556a3d7f2b4632e8707b51496cb02f92b4abf2)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可比较引擎共识与独立发布者/原文覆盖的分离说明，检验转载镜像是否导致错误共识，并计核验成本；未审计全仓账本也不声称全新来源机制。

按[Q04](#research-q04)在固定预算公开任务中比较转载/镜像/日期反例下独立性说明与默认结果，计错误共识、正确率和人工核验；无改善或成本抵消则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 119 | 15605 | — | — | 199571 |
| .js | source | 7 | 4125 | 3694 | 221 | — |
| .mjs | source | 2 | 1227 | 1159 | 47 | — |
| .js | test | 5 | 2003 | 1707 | 211 | — |
| .js | example | 1 | 27 | 19 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/taxueseek/argo/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多源搜索如何转成可核验结果，来源独立性、降级与总成本何时限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多源搜索给谁增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Argo根是供Agent调用的搜索与取证工具，面向要跨语言、领域和本地资料收集可追溯信息的开发者/研究者。合格交付应能回答问题、回到原文并区分事实与推断；大量结果或多个引擎同意并不是研究结论。简单基线是人工依次查询少数明确来源，再抓原文与整理引文。Argo把来源选择、并行查询、排序和压缩统一，减少调用侧分别适配的工作，但源适配和审核负担转给维护层。

固定Skill自己把research称作带覆盖/缺口的取证包而非判断稿，这是重要边界；不能因名字叫深度研究就认定已经完成事实审阅。作者宣传的源数、免密钥数和延迟没有在本轮逐源验证，不拿它们当可用覆盖或质量证明。RRF和词法重排是成熟方法，当前贡献是领域路由、诊断和Agent消费接口的组合。DSH子包是另一个研究对象，本根研究不据其README继承宿主验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-56](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/README.md#L39-L56)

作者定位和四类子技能，源数与性能仅作者声明。

<details>
<summary>查看原文（18行）</summary>

```text
## 这是什么

**Argo 是一个装在 Agent 里的搜索与深度研究工具，也可以获取相关网页的信息。背后连着 284 个搜索源，覆盖 99 个业务领域，同时支持本地文件的基础搜索能力。在开源搜索项目里，具备非常强大的搜索能力。**

支持配置 API Key 提升搜索质量（配了 Key 的源质量通常更好，没配则自动跳过），也支持免费引擎和本地引擎自动保底。覆盖中英日韩等 18 种语言，支持金融、学术、影视、体育、代码、宏观等垂直场景。

## 子技能

Argo 的能力通过四个子技能（sub-skills）组织，每个子技能是一条独立可用的管线：

| 子技能 | 能力 |
|--------|------|
| **local-search** | 本机文件搜索 + 本地零成本聚合引擎（32 个本地引擎）。搜代码符号、文件名、文档全文、文件结构。可并入网络搜索结果，加一个开关本机命中就并进同一次搜索 |
| **local-seek** | 本地语义搜索（BM25 + 向量混合），搜笔记、记忆、资料库。三层递进：先定位文件、再看上下文、最后精读段落 |
| **ego-search** | 登录态专业搜索。知乎、小红书、公众号等需要登录才能看的内容，用真实浏览器配合登录态去搜。默认关闭，需时开启 |
| **js-run** | 无浏览器执行网页 JS。不开浏览器跑「环境探测 + 纯计算」型网页脚本，单次上下文 P50 约 1ms |

四个子技能覆盖了从「搜本机」到「搜全网」到「搜登录墙后面」的完整链路。大部分场景用 local-search + 联网搜索就够，特殊场景再开 ego-search 和 js-run。
```

</details>

**依据 2 · 作者声明**：[SKILL.md:29-42](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/SKILL.md#L29-L42)

研究明确为取证包非判断稿；消费档和envelope边界。

<details>
<summary>查看原文（14行）</summary>

````text
> 不止搜到，还要核到：高后果问题标 `fetch_required`、结果标 `fetch_suggested`，`--verify` 核验正文并回填证据分。收录 284 个源、240 免密钥；digup 默认关；deepseek_search 默认开、需 DEEPSEEK_API_KEY（按次计费，无 key 跳过）。

## 快速上手

```bash
argo search "查询词"                     # 自动路由搜索（daemon 需显式启动）
argo search "查询词" --json --fields agent  # Agent 消费档
argo search "查询词" --verify 3           # 核验 top-3 并回填证据分
python3 scripts/research.py "复杂问题" --json  # 取证包（扩词或多工作包 → dossier）
```

默认不附 candidates/sources；`--fields agent` 只留答案（~4.3 KB），要追溯或归档才加 `--envelope`（`--archive` 自动带）。

深度研究产出**取证包（dossier）**（来源/覆盖/缺口/达标，不是判断稿）：先读 `references/research-protocol.md` 写工作包再取证，判断分事实/推断/建议。不要另装「专业深度研究」skill。
````

</details>

**依据 3 · 源码核查**：[scripts/search_rank.py:255-280](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_rank.py#L255-L280)

使用RRF及口径分组，不能归为新排名算法。

<details>
<summary>查看原文（26行）</summary>

```text
def rrf_merge(ranked_lists: list[list[dict[str, Any]]], k: int = 60,
              weighted: bool | None = None,
              lang: str | None = None) -> list[dict[str, Any]]:
    """Reciprocal Rank Fusion 合并多引擎结果，保留 consensus_engines。

    键用归一化 URL；RRF 分单独存 _rrf_score，首次遇到的结果保留完整字段，
    后续同 URL 只累加共识、择优补充 snippet。

    口径隔离：不同口径的引擎结果不直接 merge，而是作为独立证据通道并列
    呈现。同口径内做 RRF 融合，不同口径按优先级排序后并列输出。
    口径分类表与分组逻辑在 caliber_isolation.py。
    """
    if weighted is None:
        weighted = _rrf_weighted_default()

    # 经典 RRF（weighted=False）：保留旧的全局列表级 RRF 语义，每个引擎列表
    # 独立贡献排名。口径隔离只用于加权分支（weighted=True）。
    if not weighted:
        from rrf_classic import rrf_classic
        return rrf_classic(ranked_lists, k=k, lang=lang,
                           _canonical_url=_canonical_url_impl)

    from caliber_isolation import merge_by_caliber
    return merge_by_caliber(
        ranked_lists, k=k, weighted=weighted, lang=lang,
        _canonical_url=_canonical_url_impl,
```

</details>

#### 缺口

- 没有本轮逐源可用性或同任务/预算的人工作业对照。
  **影响**：无法量化真实覆盖、节时与研究正确率。
  **进一步探讨**：固定领域任务和来源版本，对比人工少源检索与聚合，核原文和总投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询路由、失败隔离、排序和输出如何接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

npm入口bin/argo.js选择Python解释器，call子命令复用mcp_server.py --call，默认则转接stdio。子进程异常启动返回失败，被信号终止按128+信号号而非0处理，避免截断输出被当成功。Python call验证JSON对象，再执行同一execute_tool并根据isError或协议error决定退出码。argo_search handler实际调用super_search，包含缓存、时间窗、领域、本地并入等参数；include_local默认true，不能忽略本机数据进入结果的范围。

搜索执行分prepare/cache命中、dispatch、postprocess、finalize。dispatch注入来源可用性、缺失环境、预算与失败分类；单引擎可明确partial/no-results/error，而不是把所有空结果当整个网络失效。后处理做过滤、去重和RRF，finalize写缓存/学习记录并可把未完尾部交给后台补全。时间窗无published_at会给未实际过滤warning，空回声守卫/复杂度门控的一些失败则fail-open。可用性优先是明确取舍，不是所有质量guard强制成功。

排序分与consensus_engines反映检索位置和引擎返回，不证明来源独立或事实正确。返回超时也不代表所有远端请求已停止：调度可放弃daemon线程等待，后台补全也有单独移交路径。调用侧应读限制/失败和原文，不能从命令退出0直接推定完整覆盖或研究办结。

#### 证据与依据

**依据 1 · 源码核查**：[bin/argo.js:21-35](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/bin/argo.js#L21-L35)

Python选择与信号退出语义。

<details>
<summary>查看原文（15行）</summary>

```text
function exitCodeOf(code, signal) {
  if (code !== null && code !== undefined) return code;
  const num = (os.constants.signals || {})[signal];
  return typeof num === 'number' ? 128 + num : 128;
}

function resolvePython() {
  if (process.env.ARGO_PYTHON) return process.env.ARGO_PYTHON;
  if (process.env.PYTHON) return process.env.PYTHON;
  // 优先 PATH 中的 python3，避免写死 /usr/bin
  return process.platform === 'win32' ? 'python' : 'python3';
}

const PYTHON = resolvePython();
const SCRIPT = path.join(__dirname, '..', 'scripts', 'mcp_server.py');
```

</details>

**依据 2 · 源码核查**：[bin/argo.js:76-115](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/bin/argo.js#L76-L115)

实际call/stdio入口和失败退出。

<details>
<summary>查看原文（40行）</summary>

```text
// 子命令分发：`argo-search call <tool> '<json-args>'` —— CLI 单发，与 stdio
// 服务共用 mcp_server.py --call / execute_tool 入口（同引擎同压缩），供 DSH
// 原生工具等调用方免 MCP 帧协议复用；无子命令或 'mcp' 保持原行为：启动 stdio 服务。
if (argv[0] === 'call') {
  const tool = argv[1];
  if (!tool) {
    console.error('usage: argo-search call <tool> [json-args]');
    process.exit(2);
  }
  const cli = spawn(PYTHON, [SCRIPT, '--call', tool, argv[2] ?? '{}'], {
    stdio: 'inherit',
    env,
  });
  cli.on('error', (err) => {
    console.error(`argo-search: 无法启动 Python (${PYTHON}): ${err.message}`);
    process.exit(1);
  });
  cli.on('exit', (code, signal) => {
    process.exit(exitCodeOf(code, signal));
  });
} else {
  // 'mcp' 子命令作为 stdio 服务的显式别名，去除该前导参数
  const forwardedArgs = argv[0] === 'mcp' ? argv.slice(1) : argv;
  const proc = spawn(PYTHON, [SCRIPT, ...forwardedArgs], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env,
  });

  process.stdin.pipe(proc.stdin);
  proc.stdout.pipe(process.stdout);

  proc.on('error', (err) => {
    console.error(`argo-search: 无法启动 Python (${PYTHON}): ${err.message}`);
    console.error('请确认已安装 Python 3.9+，并已执行: pip install pyyaml');
    console.error('或改用即用即走的方式: npx -y argo-search（同样需要 Python 3.9+ 与 PyYAML）');
    process.exit(1);
  });

  proc.on('exit', (code, signal) => {
    process.exit(exitCodeOf(code, signal));
```

</details>

**依据 3 · 源码核查**：[scripts/mcp_server.py:115-135](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/mcp_server.py#L115-L135)

call校验与错误码。

<details>
<summary>查看原文（21行）</summary>

```text
def call_mode(tool: str, payload: str) -> int:
    """CLI 单发（--call <tool> '<json-args>'）。

    与 stdio 服务共用 execute_tool，stdout 只输出结果 JSON（isError 时
    退出码 1）；不输出任何日志到 stdout，保证调用方解析不被污染。
    """
    try:
        arguments = json.loads(payload) if payload.strip() else {}
    except json.JSONDecodeError as e:
        print(_dumps({"error": f"invalid --call payload: {e}"}))
        return 2
    if not isinstance(arguments, dict):
        print(_dumps({"error": "--call payload must be a JSON object"}))
        return 2
    result = execute_tool(tool, arguments)
    print(_dumps(result))
    # isError 是工具级错误；裸 {"error": {...}} 是协议级错误（如未知工具）。
    # 两者都必须非零退出，否则调用方（如 DSH 原生工具）把错误当成功渲染。
    is_error = bool(result.get("isError")) or (
        isinstance(result.get("error"), dict) and "content" not in result)
    return 1 if is_error else 0
```

</details>

**依据 4 · 源码核查**：[scripts/mcp_handlers.py:197-222](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/mcp_handlers.py#L197-L222)

search实际调用和默认include_local。

<details>
<summary>查看原文（26行）</summary>

```text
        if name == "argo_search":
            search_mod = _lazy_cached("search")
            result = search_mod.super_search(
                query=arguments["query"],
                engine=arguments.get("engine", "auto"),
                n=arguments.get("max_results", 5),
                skip_cache=_env_bool("ARGO_MCP_SKIP_CACHE", _env_bool("ARGO_NO_CACHE", False) or bool(arguments.get("skip_cache", False))),
                timeout=_env_int("ARGO_MCP_TIMEOUT", _int_param(arguments, "timeout", 10)),
                depth=arguments.get("depth", "fast"),
                mode=arguments.get("mode", "auto"),
                since=arguments.get("since"),
                until=arguments.get("until"),
                sort=arguments.get("sort", "relevance"),
                include_local=bool(arguments.get("include_local", True)),
                include_domains=arguments.get("include_domains") or None,
                exclude_domains=arguments.get("exclude_domains") or None,
                cache=_get_cache(),
                envelope=False,
                context="search",
            )
            summary = arguments.get("summary", True)
            if summary or not pretty:
                payload = _compact_search_result(result, summary=bool(summary))
            else:
                payload = result
            return _ok(payload, pretty=pretty)
```

</details>

**依据 5 · 源码核查**：[scripts/search.py:509-535](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search.py#L509-L535)

prepare/cache/dispatch/postprocess/finalize接线。

<details>
<summary>查看原文（27行）</summary>

```text
    hooks = _SearchHooks(
        engine_search=engine_search, available_engines=available_engines,
        get_cost_factor=get_cost_factor,
        get_engines=get_engines, get_execution_config=get_execution_config,
        missing_env_for=_missing_env_for,
        classify_outcome=_classify_engine_outcome,
        note_quota_exhausted=_note_remote_quota_exhausted,
        per_engine_budget_s=_PER_ENGINE_BUDGET_S,
        fast_budget_s=_FAST_TOTAL_BUDGET_S,
        auto_budget_s=_AUTO_TOTAL_BUDGET_S,
        deep_budget_s=_deep_budget_s(),
        primary_grace_s=_PRIMARY_GRACE_S,
        straggler_grace_s=_straggler_grace(),
        straggler_tail_fn=straggler_tail,
        serial_stagger_s=_serial_stagger(),
    )
    prepared = prepare(query, decision, max_results, timeout, depth, cache,
                       skip_cache, mode=mode, since=since, until=until,
                       sort=sort, on_progress=on_progress, timing=timing,
                       engine_domain=engine_domain,
                       engine_sub_domain=engine_sub_domain,
                       hooks=hooks)
    if prepared.cached is not None:
        return prepared.cached
    run = dispatch(prepared.req, prepared.run, hooks)
    run = postprocess(prepared.req, run, hooks)
    return finalize(prepared.req, run, hooks)
```

</details>

**依据 6 · 源码核查**：[scripts/engine_dispatch.py:163-194](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/engine_dispatch.py#L163-L194)

区分空、错误与partial。

<details>
<summary>查看原文（32行）</summary>

```text
def classify_engine_outcome(eng: str, res: list[dict[str, Any]],
                            latency_ms: int, status_hint: str | None = None
                            ) -> dict[str, Any]:
    """将单引擎结果归类为可观测 outcome。"""
    if status_hint:
        return {
            "engine": eng, "status": status_hint,
            "results_count": 0, "latency_ms": latency_ms,
        }
    if not res:
        return {
            "engine": eng, "status": "no-results",
            "results_count": 0, "latency_ms": latency_ms,
        }
    errors = [r for r in res if isinstance(r, dict) and "error" in r]
    goods = [r for r in res if isinstance(r, dict) and "error" not in r]
    if errors and not goods:
        st = classify_error_status(errors[0].get("error"))
        return {
            "engine": eng, "status": st,
            "results_count": 0, "latency_ms": latency_ms,
            "detail": str(errors[0].get("error", ""))[:200],
        }
    if goods and errors:
        return {
            "engine": eng, "status": "partial",
            "results_count": len(goods), "latency_ms": latency_ms,
        }
    return {
        "engine": eng, "status": "ok",
        "results_count": len(goods), "latency_ms": latency_ms,
    }
```

</details>

**依据 7 · 源码核查**：[scripts/search_pipeline.py:503-536](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_pipeline.py#L503-L536)

时间窗warning和质量功能fail-open。

<details>
<summary>查看原文（34行）</summary>

```text
    # D5：时间窗空操作告警——用户指定了时间窗，组合内含时间能力引擎，
    # 但结果没有任何 published_at（下推缺失/源端未返回）：
    # `--since/--until` 实际未生效（宽松策略保留无时间字段条目，
    # time_filtered 恒 0）。透传 warning 而非静默降级。
    # 组合内不含时间能力引擎时是已知常态，不重复告警。
    time_filter_warning: str | None = None
    if time_aware and (since_ts is not None or until_ts is not None) and merged:
        if not any(r.get("published_at") for r in merged):
            time_filter_warning = (
                f"引擎未返回 published_at，时间窗 {since_iso or '任意'} ~ "
                f"{until_iso or '任意'} 未实际过滤"
            )

    # ── P0-002：空结果错误恢复决策树 ──
    recovery_info: dict[str, Any] | None = None
    # 复杂度门控：低复杂度查询只允许低成本放宽（L1/L2），
    # 禁用高价多源/跨语言（L3/L4）——简单问题不搞多轮，省 token。
    _max_rec_level: str | None = None
    try:
        from query_enhance import complexity_gate
        if qu is not None and complexity_gate(query, qu) == "low":
            _max_rec_level = "L2"
    except OPT_IMPORT + SHAPE_BENIGN:  # 门控判定失败按「不限制放宽档位」处理
        pass
    _tk_recovery = _tick(timing)
    _recovery_engines: set[str] = set()
    # 查询词回声（2026-10-17 实锤）：有结果但整批退化时同样要恢复——
    # `if not merged` 只看「有没有结果」，不看「是不是垃圾」。判据与理由见
    # query_signals.is_query_echo（rerank 尚未执行，只能用零网络成本的词面）。
    try:
        from postprocess_signals import echo_recovery_needed as _echo_needed
        _echo_triggered = _echo_needed(merged, query)
    except OPT_IMPORT + SHAPE_BENIGN:  # 守卫不可用不设卡（fail-open）
        _echo_triggered = False
```

</details>

**依据 8 · 源码核查**：[scripts/search_pipeline.py:845-857](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_pipeline.py#L845-L857)

尾部任务移交后台补全。

<details>
<summary>查看原文（13行）</summary>

```text
    # 记学习器真实成绩 + 合并写 L2 缓存（ARGO_TAIL_COMPLETE_S 控制，0=关）。
    # 放在缓存写与学习记账之后：补全读的是刚写的主缓存条目；主响应已定，
    # 这里的一切都是锦上添花，异常 fail-open。
    if run.stranded:
        try:
            from tail_completion import hand_off
            hand_off(run.stranded, query=query,
                     cache_engine_key=cache_engine_key,
                     max_results=max_results, domain=domain,
                     mode=mode, depth=depth, decision=decision,
                     skip_cache=skip_cache, cache_instance=cache)
        except Exception as e:
            _log(f"后台补全移交跳过: {type(e).__name__}")
```

</details>

**依据 9 · 源码核查**：[scripts/engine_dispatch.py:767-785](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/engine_dispatch.py#L767-L785)

daemon线程不阻塞返回的策略，不能等同远端取消。

<details>
<summary>查看原文（19行）</summary>

```text
        为什么不用 ThreadPoolExecutor：它的 `with` 退出会
        `shutdown(wait=True)` 并 join 所有已提交任务，把「超时即返回」的语义
        架空——上面每个预算判断都以为自己已经止损，进程却还在等一个卡住的
        HTTP 读（models.dev 全量 API 超时 15s，实测单查询被拖到 76s，而
        w2_wait / deadline 早已到期）。daemon 线程 + 轮询才真正有界：
        早停后弃置线程既不阻塞函数返回，也不阻塞进程退出——与上面的
        hedged 分支共用同一套并发执行方式。
        """
        if not engs:
            return False
        nonlocal first_result_at, first_sufficient_at
        queue = list(engs)
        pending: list[tuple[dict[str, Any], Any, str]] = []
        deadline = _now() + max(0.0, wait_s)
        gate = None if start_before_s is None else _now() + max(0.0, start_before_s)
        last_start: float | None = None
        done_evt = threading.Event()
        max_concurrency = _max_parallel_engines(depth=depth)
        while (queue or pending) and _now() < deadline:
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源依赖、成本与退出能否支持使用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议能维护Python环境和核对原文的Agent开发者先用公开非敏感问题、小量指定来源试用CLI。npm只提供Node启动器，仍需Python3.9+和PyYAML；具体源可能另需账号/key、网络或浏览器，作者免密钥声明不保证服务持续免费可用。先关闭本地并入并核对缓存/查询落盘策略，避免把“网络搜索”误当不读本机；需要本地数据时再显式限定目录和读取范围。

现金成本包括可收费源、抓取和模型使用，时间成本包括来源健康、误去重、失效链接与事实核验。缓存减少重复请求，但过期和缺发布时间可能影响新鲜度；多源结果不是独立证据数。信源错误或guard降级时保留原文验证与人工单源退路，不自动扩大更多付费源弥补。试用成功以固定任务找到独立原文并回答正确为准，不能以结果数量计分。若日期/来源失配、错误不可辨认或全部成本超过原来少数可靠源，就停止聚合并退回原检索流程。停用入口不自动删除本地缓存、学习/使用记录或集成配置，退出前应按实际目录核对保留和删除范围；本轮没有安装或清理。

#### 证据与依据

**依据 1 · 源码核查**：[bin/argo.js:59-71](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/bin/argo.js#L59-L71)

启动器明确Python/PyYAML依赖。

<details>
<summary>查看原文（13行）</summary>

```text
if (argv[0] === '-h' || argv[0] === '--help') {
  console.log(`Argo Search — 专为 Agent 打造的统一搜索与证据核验工具

用法:
  argo-search                         启动 MCP Stdio 服务（默认）
  argo-search mcp                     显式启动 MCP Stdio 服务
  argo-search call <tool> [json-args] CLI 单发调用指定 MCP 工具
  argo-search -v, --version           查看当前版本
  argo-search -h, --help              查看本帮助信息

环境依赖:
  需要 Python 3.9+ 及 PyYAML。
  零门槛即用即走: npx -y argo-search
```

</details>

**依据 2 · 源码核查**：[scripts/mcp_handlers.py:197-216](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/mcp_handlers.py#L197-L216)

本地并入默认与可配置开关。

<details>
<summary>查看原文（20行）</summary>

```text
        if name == "argo_search":
            search_mod = _lazy_cached("search")
            result = search_mod.super_search(
                query=arguments["query"],
                engine=arguments.get("engine", "auto"),
                n=arguments.get("max_results", 5),
                skip_cache=_env_bool("ARGO_MCP_SKIP_CACHE", _env_bool("ARGO_NO_CACHE", False) or bool(arguments.get("skip_cache", False))),
                timeout=_env_int("ARGO_MCP_TIMEOUT", _int_param(arguments, "timeout", 10)),
                depth=arguments.get("depth", "fast"),
                mode=arguments.get("mode", "auto"),
                since=arguments.get("since"),
                until=arguments.get("until"),
                sort=arguments.get("sort", "relevance"),
                include_local=bool(arguments.get("include_local", True)),
                include_domains=arguments.get("include_domains") or None,
                exclude_domains=arguments.get("exclude_domains") or None,
                cache=_get_cache(),
                envelope=False,
                context="search",
            )
```

</details>

**依据 3 · 作者声明**：[SKILL.md:48-60](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/SKILL.md#L48-L60)

档位、缓存、本地与查询记录控制线索。

<details>
<summary>查看原文（13行）</summary>

```text
| 参数 | 说明 |
|------|------|
| `--engine <name>` | 强制引擎（anysearch/byted/bocha/exa/deepseek_search/tavily/eastmoney/zhihu/arxiv…，见 `--list-engines`） |
| `--local-first` | 本地零成本聚合优先（local_search 29 引擎） |
| `--include-local` / `--no-local` | 本机文件命中（source=local_files）：fast/budget 默认开，auto/deep 显式 |
| `--mode fast|auto|deep|budget` | fast 免费 / auto 成本感知（默认）/ deep 质量 / budget 配额控制 |
| `--explain` / `--no-cache` | 解释路由决策 / 跳过缓存 |
| `--depth fast|balanced|deep` | 搜索深度 |
| `--academic-deep` | 学术多源：depth=deep + domain=academic，禁用早停（arxiv/openalex/local_pubmed/core 等） |
| `--since 7d|2026-08-01` `--until` `--sort relevance|newest|oldest` | 时间窗过滤 + 时间排序 |
| `--video` `--min-duration SEC` `--max-duration SEC` | 视频模式（B 站 + YouTube）及时长筛选 |
| `--verify [N]` | 对 top-N 抓正文回填证据分（URL→证据分缓存复用） |
| `--domain` `--sub_domain` / `ARGO_USAGE_LOG=0` | 垂直域限定 / 关本地统计与查询落盘 |
```

</details>

**依据 4 · 源码核查**：[scripts/search_pipeline.py:783-807](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_pipeline.py#L783-L807)

缓存写入及降级不取消本轮返回。

<details>
<summary>查看原文（25行）</summary>

```text
    _tk_cache_write = _tick(timing)
    # 写 combo 缓存：空结果短 TTL / 时效 cap 由 cache.set 处理。
    #
    # 守卫拒绝（登录态 / 上游退化）只该取消**这次写入**，不该取消这次查询。
    # 2026-09-27 实锤：`Apple Inc 10-K annual report 2025` 命中 sec_edgar
    # 拿到 Apple 的 CIK 归档页（1 条相关 + 4 条全文检索噪音），批内多数
    # relevance=0 触发退化守卫，异常穿透到 CLI 顶层——traceback 退出，已检索
    # 到的结果连同响应一起丢弃。守卫的意图是「别固化」而不是「别返回」。
    cache_write_skip: str | None = None
    if not skip_cache:
        effective_ttl = None
        if merged and elapsed > 2000:
            # 慢查询略延长缓存：省的是「同一查询再付一次慢网」的钱。
            effective_ttl = _slow_query_ttl(cache.resolve_ttl(domain, query=query),
                                            elapsed)
        cache_write_skip = attempt_cache_write(
            lambda: cache.set(
                query, cache_engine_key, max_results, result_payload,
                domain=domain, ttl=effective_ttl, mode=mode, depth=depth,
                # 恢复成功的批次标记给写侧：整批退化时降级短 TTL 而非硬拒
                # （硬拒会让重复查询重付 dispatch+恢复链全程，cache.set 注释）。
                recovered=bool((recovery_info or {}).get("recovered")),
            ),
            context="finalize.cache_set",
        )
```

</details>

**依据 5 · 源码核查**：[scripts/search_pipeline.py:859-873](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_pipeline.py#L859-L873)

语言偏好有本地记录。

<details>
<summary>查看原文（15行）</summary>

```text
    # 语言偏好：记录本轮查询语 + 输出观测快照（默认中英 + 系统 + 习惯）
    lang_pref_info: dict[str, Any] | None = None
    try:
        from lang_pref import record_query_lang, lang_pref_snapshot
        feats = decision.get("features") or {}
        q_lang = feats.get("primary_lang") or ""
        if not q_lang:
            try:
                from lang_detect import detect_language
                q_lang = detect_language(query)
            except ImportError:
                q_lang = ""
        if q_lang:
            record_query_lang(q_lang)
        lang_pref_info = lang_pref_snapshot(query_lang=q_lang)
```

</details>

#### 缺口

- 全部源的实时费用/权限/可用性、浏览器链及完整退出清理未逐项核查。
  **影响**：不能建议全源长期采用或声称总成本低。
  **进一步探讨**：只针对所需来源固定条款/配置，在副本任务检查网络、收费和本地残留。
- 未做同预算任务正确率、延迟与全部人工核验成本对照。
  **影响**：无法证明聚合优于人工少源检索。
  **进一步探讨**：固定任务和时间窗，计失败、正文读取、核验及重试全部投入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何证明多源带来独立证据而非重复结果？

**研究主题**：新假设与验证

#### 完整回答

当前RRF按归一化URL合并并保留引擎共识，另有口径隔离，不能声称系统只拼接结果或没有去重。由此可提出一个限定评估假设：把引擎数量与真正独立的原始发布者分开，再用同一结论所依赖的原文证据检查覆盖，可能比继续增加来源更能控制“看似多证据”的误判。它不是宣称全仓没有其他证据模块，本次未审计所有研究账本；增量是为根搜索的consensus指标建立可证伪的用户结果对照。

选公开任务，植入转载同一报道、镜像URL、不同日期口径和互相独立的原始材料，比较默认聚合与附独立性说明两组，固定来源预算。观测错误共识、原始来源覆盖、事实回答正确率和人工核验时长。若独立性分类本身不可靠、没有减少错误共识，或维护成本超过收益，就否定；不能把更多token或手工审核投入归因于检索排名改进。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/search_rank.py:255-280](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/search_rank.py#L255-L280)

已有URL规范化、共识和口径隔离是基线。

<details>
<summary>查看原文（26行）</summary>

```text
def rrf_merge(ranked_lists: list[list[dict[str, Any]]], k: int = 60,
              weighted: bool | None = None,
              lang: str | None = None) -> list[dict[str, Any]]:
    """Reciprocal Rank Fusion 合并多引擎结果，保留 consensus_engines。

    键用归一化 URL；RRF 分单独存 _rrf_score，首次遇到的结果保留完整字段，
    后续同 URL 只累加共识、择优补充 snippet。

    口径隔离：不同口径的引擎结果不直接 merge，而是作为独立证据通道并列
    呈现。同口径内做 RRF 融合，不同口径按优先级排序后并列输出。
    口径分类表与分组逻辑在 caliber_isolation.py。
    """
    if weighted is None:
        weighted = _rrf_weighted_default()

    # 经典 RRF（weighted=False）：保留旧的全局列表级 RRF 语义，每个引擎列表
    # 独立贡献排名。口径隔离只用于加权分支（weighted=True）。
    if not weighted:
        from rrf_classic import rrf_classic
        return rrf_classic(ranked_lists, k=k, lang=lang,
                           _canonical_url=_canonical_url_impl)

    from caliber_isolation import merge_by_caliber
    return merge_by_caliber(
        ranked_lists, k=k, weighted=weighted, lang=lang,
        _canonical_url=_canonical_url_impl,
```

</details>

**依据 2 · 源码核查**：[scripts/engine_dispatch.py:163-194](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/scripts/engine_dispatch.py#L163-L194)

引擎outcome可用作执行维度，不能直接推成独立发布者。

<details>
<summary>查看原文（32行）</summary>

```text
def classify_engine_outcome(eng: str, res: list[dict[str, Any]],
                            latency_ms: int, status_hint: str | None = None
                            ) -> dict[str, Any]:
    """将单引擎结果归类为可观测 outcome。"""
    if status_hint:
        return {
            "engine": eng, "status": status_hint,
            "results_count": 0, "latency_ms": latency_ms,
        }
    if not res:
        return {
            "engine": eng, "status": "no-results",
            "results_count": 0, "latency_ms": latency_ms,
        }
    errors = [r for r in res if isinstance(r, dict) and "error" in r]
    goods = [r for r in res if isinstance(r, dict) and "error" not in r]
    if errors and not goods:
        st = classify_error_status(errors[0].get("error"))
        return {
            "engine": eng, "status": st,
            "results_count": 0, "latency_ms": latency_ms,
            "detail": str(errors[0].get("error", ""))[:200],
        }
    if goods and errors:
        return {
            "engine": eng, "status": "partial",
            "results_count": len(goods), "latency_ms": latency_ms,
        }
    return {
        "engine": eng, "status": "ok",
        "results_count": len(goods), "latency_ms": latency_ms,
    }
```

</details>

**依据 3 · 作者声明**：[SKILL.md:40-42](https://github.com/taxueseek/argo/blob/af556a3d7f2b4632e8707b51496cb02f92b4abf2/SKILL.md#L40-L42)

已有取证包与判断稿分离，未来建议不冒称新发明。

```text
默认不附 candidates/sources；`--fields agent` 只留答案（~4.3 KB），要追溯或归档才加 `--envelope`（`--archive` 自动带）。

深度研究产出**取证包（dossier）**（来源/覆盖/缺口/达标，不是判断稿）：先读 `references/research-protocol.md` 写工作包再取证，判断分事实/推断/建议。不要另装「专业深度研究」skill。
```

#### 缺口

- 发布者独立性说明是否改善Agent答案与核验负担未测。
  **影响**：不能声称已降低错误共识。
  **进一步探讨**：按转载/镜像/日期反例做固定预算双组实验，记录判断错误和人工投入。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
