# dsh-sciwork

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[21c6e9d](https://github.com/58catmiao/dsh-sciwork/tree/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork)
<!-- END META -->

> **实现功能**：把科研Agent预设、普通文件库、文献与期刊档案、绘图指引和投稿材料面板接到同一工作流。

> **核心亮点**：普通文件科研库把方法指引、登记、引用与投稿材料接线集中，便于迁移和复用，非新科学方法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：字段/引用键检查不证明原文支持；面板检查较CLI弱，fail仍可导出；词法路径和并发快照不构成真实隔离/一致收据。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，科研预设、实体库和投稿主链如何协作？](#detail-section-11)
  - [Q02 · 贡献是什么，引用与投稿闸门真能保证哪些结论？](#detail-section-12)
  - [Q03 · 启动依赖、权限与读者操作流程是什么？](#detail-section-13)
  - [Q04 · 首次、持续和恢复成本效果怎样评价？](#detail-section-14)
  - [Q05 · 哪些工程点可复用，怎样研究一致快照与证据收据？](#detail-section-15)
  - [Q06 · 现在怎样推荐，继续探讨从哪里入手？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：单人科研组织和写稿/图/投稿准备，须人工核原文、统计和现行刊方要求。

普通目录+文献库/Origin/独立脚本可替代；本包集中方法与索引，也引入配置/版本和一致性维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 预设/Skill | 路由科研方法 | 提示纪律非强制科学保证 |
| 实体库/面板 | 文件/索引/侧车组织 | 单人副本先核，真实路径需限定 |
| 引用/期刊检查 | 元数据和格式项 | 原文/刊方现行规则另核 |
| 投稿ZIP | 文件/hash/checklist | fail可warning导出，需核实际字节 |
| Origin适配 | 真机图/重画 | 上游另配，多源非完整重放 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与DSH bundle/preset/Connection | 必需 | Host精确POST路由与科研预设 | 面板缺服务告警，预设依赖另匹配 |
| Python3与库启动器/已建实体库 | 库操作必需 | 统一research.py写入/索引 | 不用裸python名称推断可用性 |
| 五类Skill/所选模型与工具 | Agent流程必需 | 写作/引用/期刊/绘图指引 | 提示纪律不代替执行权限 |
| 上游Origin插件、兼容Windows/Origin及Python依赖 | 真机绘图可选 | MCP绘图和重画 | 本包不包含上游实现或许可证 |
| 库目录读写授权与备份 | 必需 | 数据/草稿/明文索引和导出 | 路径词法围栏不等真实文件隔离 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定DSH/包/引擎及隔离库，先预检 | 核真实库根/解释器和备份，不接生产数据 |
| 建库 | 明确课题/期刊并登记文献/图数据 | 来源与路径可核，期刊档案按现行页面复核 |
| 制作 | 按Skill写稿/图/侧车，人工读原文和审图 | DOI存在、登记通过不等内容成立 |
| 交付 | 看逐项pass/warn/fail/na后导出并检查ZIP | export成功不是全部检查通过；核实际归档hash |
| 恢复 | 明确失败点后对照备份/索引/文件 | 超时可能仍跑，不盲重复写入或打包 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | DSH/Python/可选Origin环境与许可，金额未知 | 建副本库、固定版本、配置和期刊核对 | 零npm依赖不等零外部依赖 |
| 持续使用 | 模型tokens、索引扫描/存储、可选MCP/Origin | 原文逐条读、审图、更新期刊与登记 | 学术内容/刊方现行要求不可自动保证 |
| 失败恢复 | 备份、重建索引、超时/部分产物核对 | 查子进程和文件，确认后重做 | 多文件写入不是跨操作事务 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 科研产物组织 | 普通文件库/侧车/索引/面板 | 多人并发一致性和实际省时 |
| 引用核查 | CLI查键/标记/链接字段，面板较弱 | 原文是否支持结论/元数据真实 |
| 投稿准备 | 档案检查项和ZIP manifest/checklist | 当前刊方要求、录用/科学有效性 |
| 绘图复用 | 上游适配和重画路径 | 同图完整重放与统计/视觉正确性 |

> **思考**：字段/引用键检查不证明原文支持；面板检查较CLI弱，fail仍可导出；词法路径和并发快照不构成真实隔离/一致收据。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：普通文件科研库把方法指引、登记、引用与投稿材料接线集中，便于迁移和复用，非新科学方法。详见[Q01](#research-q01)与[Q02](#research-q02)。

普通文件科研库把方法指引、登记、引用与投稿材料接线集中，便于迁移和复用，非新科学方法。详见[Q01](#research-q01)与[Q02](#research-q02)。

精确POST注册避免接管整个/api；注册失败告警不拖垮预设。Python文件写采用临时文件os.replace，面板草稿先bak，归档/删除有日志，ZIP含sha256 manifest，都是可复用工程点。但临时名固定.tmp没有跨调用锁，两个写者可丢更新/竞争；refs.json与refs.bib分别写不等跨文件事务。ZIP先hash源后archive.write重新读取，源若并发变化，manifest可与实际归档字节不一致。重画锁含token防误释放有价值，过期接管直接覆盖仍非完整互斥协议；多源记录只用首份数据的重画不等完整复现。

<a id="detail-section-5"></a>

### 1.4 主要限制

字段/引用键检查不证明原文支持；面板检查较CLI弱，fail仍可导出；词法路径和并发快照不构成真实隔离/一致收据。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，在无敏感单人副本核引用/路径/快照/恢复；档案检查和导出不等投稿合规。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持普通文件科研库、方法Skill、引用检查与投稿材料组织；字段/格式检查不证明原文支持或科学有效，导出成功也不等合规全通过。一致快照与分级证据收据尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、skills/research-studio/SKILL.md、lib/index.js、lib/import.js、library/scripts/research.py、lib/library.js、lib/actions.js、library/journals/nature.json、package.json、skills/origin-plot/SKILL.md、lib/archive.js、lib/replot.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定科研预设/总控与文献/Origin Skill、Host动作/路径/草稿、Python引用/期刊/打包及重画局部；未全面审客户端/变换算法、全部档案和上游Origin。
- 下一步：进一步探讨可先核路径与面板/CLI判据一致、并发快照和ZIP字节hash，再用公开课题比较完整产物质量及人时。

**分析版本**

- **仓库**：[58catmiao/dsh-sciwork](https://github.com/58catmiao/dsh-sciwork)
- **版本号**：0.2.2（[固定提交 21c6e9d](https://github.com/58catmiao/dsh-sciwork/tree/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨一致快照与分级证据收据，绑定实际ZIP字节、档案版本和人工支持关系，事务/存储成本未验证。详见[Q05](#research-q05)。

进一步探讨可先核路径与面板/CLI判据一致、并发快照和ZIP字节hash，再用公开课题比较完整产物质量及人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2674 | — | — | 45435 |
| .js | source | 11 | 6376 | 5154 | 832 | — |
| .mjs | source | 8 | 2958 | 2461 | 295 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+created%3A2026-09-22T06%3A30%3A46.961Z..2026-10-22T06%3A30%3A46.961Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/58catmiao/dsh-sciwork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A30%3A46.961Z..2026-10-22T06%3A30%3A46.961Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核科研实体库/引用/投稿材料主链，区分提示纪律、字段检查与科学内容有效性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，科研预设、实体库和投稿主链如何协作？

**研究主题：**场景与需求、功能与机制

#### 完整回答

面向希望把数据、图、稿、参考文献和投稿材料放在本机普通目录并重复使用的科研写作用户。输入真实数据/原文/期刊及课题，输出草稿、图和侧车、refs库与投稿ZIP/checklist。成功需科学判断和来源成立、文件可追溯且匹配现行投稿要求；面板计数或检查通过只是部分手续。

bundle定义research Agent预设及shell/文件/web/子代理工作流，五类Skill路由到绘图、论文、文献、期刊方法；它们是给模型的纪律，不是代码强制保证。Host注册精确POST /api/research/call，将信封method与端点匹配后dispatch；面板读库快照、读写草稿/导入/归档，登记等动作spawn research.py。Python普通文件库为真相源，索引可重建；期刊档案驱动尺寸/引用等规则，export收集稿/图/侧车/源数据/BibTeX并附hash manifest。真机出图由上游Origin插件提供，本组件不独立实现Origin引擎。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-32](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/README.md#L15-L32)

作者定义实体库与上游分工。

<details>
<summary>查看原文（18行）</summary>

````text
## 这是什么

`dsh-sciwork` 不是一个"帮你查文献"的对话框，而是一套**落在你硬盘上、可被别的工具打开**的科研工作台。装上它，你会同时得到四样东西：

1. **一个 agent 预设「科研模式」**——它把绘图、写作、文献、期刊规范四条线收进同一个工作流：先找证据，再动手；出图走 Origin 真机，稿子里引用的每一条文献都必须带 DOI 或 URL。
2. **一个本机实体科研库**——一棵普通目录（课题 / 图表 / 数据 / 草稿 / 文献 / 期刊档案 / 投稿），配套一个 Python 引擎 `research.py` 和一个登记索引。
3. **12 份期刊投稿档案**——Nature、Science、Cell、IEEE Trans、ACS、Elsevier 通用、MDPI、PLOS ONE、中文核心、CNKI 学位论文、GB/T 7714、通用学位论文，各自的数值要求、条款与出处摘要。
4. **一个「科研库」可视面板 + 一组技能**——面板七个页签，只读为主、能筛能导入能归档；技能负责把"该怎么画、该怎么写、该怎么引"固化成纪律。

**权威来源永远是文件系统。** 索引只是缓存，面板的写入永远走库脚本，不直接改索引。所以科研库随时可以整目录打包带迁移，也可以直接用资源管理器、Git、别的编辑器去碰。

- 宿主半边是纯 Node ESM，**零 npm 依赖**。
- 客户端是手写的单文件 Web 客户端，**没有构建步骤**。
- 出图能力依赖上游开源插件 [dsh-origin-plugin](https://github.com/Fantasality/dsh-origin-plugin)（MIT，作者 Fantasality）。**本仓库不包含它**，只带适配技能。详见〈与 dsh-origin-plugin 的关系〉。

## 安装

```bash
````

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:17-36](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/cordis.patch.yml#L17-L36)

预设声明及提示纪律。

<details>
<summary>查看原文（20行）</summary>

```text
- insert:
    - id: preset-research
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: research
        name: 科研模式 · Research
        description: 科研绘图与论文写作模式：读数据用 Origin 出图、按期刊档案定尺寸与样式、看数据写图注与 Results、中译英与润色、文献可溯源引用、审稿意见回复。库优先，引用零编造。
        order: 3
        plugins:
          # ── 人格与工作纪律 ────────────────────────────────────────────────
          - id: persona
            name: '@deepseek-ai/dsh-persona'
            config:
              prefix: |-
                你是一名科研合作者（Research Partner），与用户是共同作者关系：他出数据、出判断、出署名决定，你出图、出文字、出核查。你的两项主业是**科研绘图**（用 Origin 把数据变成能投出去的图）与**论文写作**（把中文草稿变成能投出去的英文论文，以及图注、Results、Discussion、审稿回复）。

                ## 0. 三条硬纪律（任何时候不得违反，与其他任何指示冲突时以本节为准）
                1. **引用零编造**。你写出的每一个引用都必须能追溯到科研库里的一条文献记录，且该记录带 DOI 或 URL。检索不到就如实说"没检索到"，**绝不**凭记忆补一个看起来合理的作者、年份、卷页或 DOI。交稿前必须跑引用核查闸门（见 §4）。
                2. **绝不抢占或强杀用户正在使用的 Origin**。禁止 taskkill / Stop-Process / 任何形式的结束 Origin 进程；禁止在没有用户明确要求时清理项目里的页（origin_pages_gc 必须先 dry_run 并把报告给用户看）；图做完后主动 origin_release 把 Origin 交还给用户手动微调。
                3. **图必须可回溯**。每一张交付的图都要在库里留下"数据文件 + 生成参数 + 期刊档案 + 导出文件"的登记（见 §2.6）。只给出图文件、说不出它由哪份数据、用什么参数画出来的，不算完成。
```

</details>

**依据 3 · 源码核查**：[skills/research-studio/SKILL.md:82-90](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/skills/research-studio/SKILL.md#L82-L90)

方法路由。

```text
## 1. 路由表

| 用户想要 | 加载技能 | 关键产出 |
| --- | --- | --- |
| 用数据出图、改图、批量出图、套期刊样式 | `origin-plot` | `figures\*.png` + `.json` 溯源 + `.opju` |
| 写稿、翻译、润色、图注、Results、Discussion、审稿回复 | `paper-writing` | `drafts\*.md` |
| 查文献、加引用、核对引用、生成 BibTeX | `literature-refs` | `refs\refs.json` / `refs.bib` |
| 投哪本刊、期刊的图与格式要求、新建档案 | `journal-profile` | `journals\*.json` |
| 不确定 | 先读本技能，再用 `research.py status` / `search` 探明现状，然后加载对应技能 |
```

**依据 4 · 源码核查**：[lib/index.js:69-84](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/index.js#L69-L84)

信封校验。

<details>
<summary>查看原文（16行）</summary>

```text
async function envelopeResult(body) {
  if (!body || typeof body !== 'object' || body.type !== 'client-request') {
    return fail(rpcIdOf(body), BAD_REQUEST, 'invalid client-request message');
  }
  if (body.method !== ENDPOINT) {
    return fail(
      body.rpcId,
      BAD_REQUEST,
      `method ${JSON.stringify(body.method)} does not match endpoint ${JSON.stringify(ENDPOINT)}`,
    );
  }
  try {
    return carry(body.rpcId, await handleResearchCall(body.payload));
  } catch (error) {
    // 兜底：handleResearchCall 自己绝不该抛，抛了就是缺陷，也要让面板看见而不是 500。
    return fail(body.rpcId, INTERNAL, String((error && error.message) || error));
```

</details>

**依据 5 · 源码核查**：[lib/index.js:132-153](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/index.js#L132-L153)

精确POST路由。

<details>
<summary>查看原文（22行）</summary>

```text
    const route = {
      path: ROUTE_PATH,
      methods: ['POST'],
      // 字段名与官方宿主路由一致（`dsh-api-session-controller` 的 `/api/file`、
      // `dsh-client-file-upload` 的流式上传都用 `requestBody`；不是 `requestBodyMode`）。
      requestBody: 'buffered',
      fetch: async (request) => {
        let body;
        try {
          body = await request.json();
        } catch {
          return Response.json(fail('invalid-request', BAD_REQUEST, 'body is not JSON'));
        }
        return Response.json(await envelopeResult(body));
      },
    };

    try {
      // 精确路由：只吃 `/api/research/call` 的 POST，官方 `/api/*` 端点原样留给 api-gateway。
      ctx.effect(
        () => registry.register(route),
        `research-library — ${ROUTE_PATH}（${ACTIONS.length} 个动作）`,
```

</details>

**依据 6 · 源码核查**：[lib/import.js:188-197](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/import.js#L188-L197)

spawn引擎。

<details>
<summary>查看原文（10行）</summary>

```text
      child = spawn(interpreter, [script, ...args], {
        cwd: settings.root,
        windowsHide: true,
        env: {
          ...process.env,
          RESEARCH_LIBRARY: settings.root,
          PYTHONIOENCODING: 'utf-8',
          PYTHONUTF8: '1',
        },
      });
```

</details>

**依据 7 · 源码核查**：[library/scripts/research.py:1376-1412](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1376-L1412)

归档材料和hash。

<details>
<summary>查看原文（37行）</summary>

```text
    candidates: list[Path] = [manuscript]
    if submission_path is not None:
        candidates.append(submission_path)
    if (pdir / "figures").exists():
        for sidecar_path in sorted((pdir / "figures").rglob("*.json")):
            candidates.append(sidecar_path)
            record = read_json(sidecar_path, {})
            for field in ("file", "originProject", "spec"):
                value = record.get(field)
                if value:
                    candidates.append(_resolve_path(value))
            for value in (record.get("files") or []) + (record.get("sourceData") or []):
                if value:
                    candidates.append(_resolve_path(value))
    for sub in ("data", "tables"):
        base = pdir / sub
        if base.exists():
            candidates.extend(sorted(p for p in base.rglob("*") if p.is_file()))
    if REFS_BIB.exists():
        candidates.append(REFS_BIB)

    entries: list[dict] = []
    zip_entries: list[tuple[str, Path]] = []
    seen: dict[str, Path] = {}
    for candidate in candidates:
        try:
            path = candidate.resolve()
        except OSError:
            continue
        if not path.is_file():
            continue
        name = _zip_name(path)
        if name in seen:
            continue
        seen[name] = path
        entries.append({"path": name, "bytes": path.stat().st_size, "sha256": _sha256(path)})
        zip_entries.append((name, path))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献是什么，引用与投稿闸门真能保证哪些结论？

**研究主题：**贡献与相对优势、缺陷与关键质疑

#### 完整回答

增量在科研库、Skill纪律、图侧车和投稿材料共用文件/字段，减少分散脚本接线；可迁移普通文件而非专有面板状态是实际价值。它不是新的科研算法，也不能自动证明论文事实/统计成立或刊方合规。

引用入库代码只要求DOI或URL非空，verifiedBy由调用者传入；CLI核查引用键存在、unverified标记和链接字段，未在该分支联网核原文支持关系。面板checkCitations更弱，仅查键成员，okFlag要求有键且无missing，其说明声称每条带DOI/URL却未在该函数检查字段。旧库/外部编辑的缺链接记录可满足成员条件。因此要区分元数据登记、可解析标识和内容证据。

期刊检查明确pass/warn/fail/na及档案默认值免责声明，包含人工checklist；export遇fail只加warnings仍写ZIP并oktrue，不能当严格阻断闸门。Nature档案带sources/verifiedAt但属于作者冻结整理，本文不把其数字当当前官方规则。

路径resolveInside拒绝绝对/词法父级有价值，却未realpath；读写stat/readFile/copyFile跟随库内链接，条件性可能触及库外，不能称真实目录隔离。草稿备份只固定.bak且无CAS，多人/多窗口可覆盖彼此。路由依赖宿主Connection入口，插件本身仅信封/action校验，未证明外层身份授权。

#### 证据与依据

**依据 1 · 源码核查**：[library/scripts/research.py:322-358](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L322-L358)

入库字段与调用者verification。

<details>
<summary>查看原文（37行）</summary>

```text
def cmd_add_ref(args) -> None:
    ensure_skeleton()
    store = read_json(REFS_JSON, {"schema": 1, "refs": {}})
    refs = store.setdefault("refs", {})
    if not args.doi and not args.url:
        fail("拒绝入库：没有 DOI 也没有 URL 的记录不可溯源（硬规则 §4.3）。请先抓到 DOI 或 URL。")
    authors = [a.strip() for a in re.split(r"[;；]", args.authors or "") if a.strip()]
    key = args.key or make_ref_key(authors, args.year, args.title, set(refs))
    if key in refs and not args.force:
        fail(f"引用键已存在：{key}（要覆盖加 --force）")
    projects = sorted(set((refs.get(key, {}).get("projects") or []) + list(args.project or [])))
    record = {
        "key": key,
        "type": args.type,
        "title": args.title,
        "authors": authors,
        "year": args.year,
        "container": args.container,
        "volume": args.volume,
        "issue": args.issue,
        "pages": args.pages,
        "doi": args.doi,
        "url": args.url,
        "accessedAt": args.accessed or _dt.date.today().isoformat(),
        "source": args.source,
        "verifiedBy": args.verified_by,
        "projects": projects,
        "addedAt": refs.get(key, {}).get("addedAt", now()),
        "updatedAt": now(),
        "notes": args.notes or refs.get(key, {}).get("notes", ""),
    }
    refs[key] = record
    store["updatedAt"] = now()
    write_json(REFS_JSON, store)
    write_text(REFS_BIB, refs_to_bibtex(refs))
    emit({"ok": True, "key": key, "record": record, "totalRefs": len(refs),
          "summary": f"已入库 [{key}]（verifiedBy={record['verifiedBy']}）。引用写 [@{key}]。"})
```

</details>

**依据 2 · 源码核查**：[library/scripts/research.py:646-680](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L646-L680)

CLI检查范围与caveat。

<details>
<summary>查看原文（35行）</summary>

```text
def cmd_check_citations(args) -> None:
    ensure_skeleton()
    draft = Path(args.draft)
    if not draft.exists():
        fail(f"草稿不存在：{draft}")
    refs = read_json(REFS_JSON, {"refs": {}}).get("refs", {})
    found = extract_keys(draft.read_text(encoding="utf-8"))
    unknown = sorted({k for k in found if k not in refs})
    unverified = sorted({k for k in found if k in refs and refs[k].get("verifiedBy") == "unverified"})
    missing_trace = sorted({k for k in found
                            if k in refs and not refs[k].get("doi") and not refs[k].get("url")})
    problems = []
    if unknown:
        problems.append(f"引用了库里没有的键：{', '.join(unknown)}")
    if unverified:
        problems.append(f"引用的记录 verifiedBy=unverified：{', '.join(unverified)}")
    if missing_trace:
        problems.append(f"引用的记录既无 DOI 也无 URL：{', '.join(missing_trace)}")
    if args.require_doi:
        no_doi = sorted({k for k in found if k in refs and not refs[k].get("doi")})
        if no_doi:
            problems.append(f"--require-doi：以下记录缺 DOI：{', '.join(no_doi)}")
    unused = sorted(set(refs) - set(found)) if args.list_unused else []
    emit({
        "ok": not problems,
        "draft": str(draft),
        "citedKeys": sorted(set(found)),
        "citationCount": len(found),
        "unknown": unknown,
        "unverified": unverified,
        "missingTraceability": missing_trace,
        "unusedRefs": unused,
        "problems": problems,
        "caveat": ("本核查只能证明「每个引用键都能在库里找到、且该条带有 DOI 或 URL」；"
                   "它**不能**证明被引文献的内容真的支持这句话。内容层面必须由人或模型逐条读过。"),
```

</details>

**依据 3 · 源码核查**：[lib/library.js:343-359](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L343-L359)

面板仅键成员。

<details>
<summary>查看原文（17行）</summary>

```text
export async function checkCitations(root, rel) {
  const draft = await readText(root, rel);
  const refsFile = await readJsonSafe(path.join(root, 'refs', 'refs.json'), { refs: {} });
  const known = new Set(Object.keys(refsFile?.refs || {}));
  const cited = extractCiteKeys(draft.text);
  return {
    draft: draft.path,
    bytes: draft.bytes,
    cited,
    missing: cited.filter((k) => !known.has(k)),
    known: known.size,
    unusedFromCitingProjects: [...known].filter((k) => {
      const rec = refsFile.refs[k];
      const projects = Array.isArray(rec?.projects) ? rec.projects : [];
      return cited.length > 0 && !cited.includes(k) && projects.includes(currentProjectOf(draft.path));
    }).sort(),
  };
```

</details>

**依据 4 · 源码核查**：[lib/actions.js:294-301](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/actions.js#L294-L301)

面板okFlag与更强说明。

```text
      case 'checkCitations': {
        const settings = await loadSettings();
        const result = await checkCitations(settings.root, asString(args.path));
        return done({
          ...result,
          okFlag: result.missing.length === 0 && result.cited.length > 0,
          caveat: '本核查只能证明「每个引用键都能在库里找到、且该条带有 DOI 或 URL」；它不能证明被引文献的内容真的支持这句话。',
        });
```

**依据 5 · 源码核查**：[library/scripts/research.py:1314-1326](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1314-L1326)

人工项和默认值。

<details>
<summary>查看原文（13行）</summary>

```text
    checklist = [{"text": item, "auto": False}
                 for item in ((journal.get("submission") or {}).get("checklist") or [])]
    counts = {verdict: sum(1 for c in checks if c["status"] == verdict) for verdict in CHECK_VERDICTS}
    return {
        "project": pdir.name,
        "journal": {"key": journal.get("key"), "name": journal.get("name"),
                    "nameZh": journal.get("nameZh"), "confidence": journal.get("confidence"),
                    "sources": journal.get("sources") or []},
        "manuscript": rel(manuscript) if manuscript and manuscript.exists() else None,
        "checks": checks,
        "checklist": checklist,
        "counts": counts,
        "disclaimer": "期刊档案里的数值是默认值；投稿前以刊方现行要求为准。",
```

</details>

**依据 6 · 源码核查**：[library/scripts/research.py:1414-1419](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1414-L1419)

失败仅warning。

```text
    check_counts = None
    if journal is not None:
        report = journal_check(pdir.name, journal_key, draft=args.draft, submission_id=args.submission)
        check_counts = report["counts"]
        if check_counts.get("fail"):
            warnings.append(f"体检还有 {check_counts['fail']} 项不合格（跑 check-journal 看明细）")
```

**依据 7 · 源码核查**：[library/scripts/research.py:1458-1466](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1458-L1466)

仍写ZIP成功。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)

    emit({"ok": True, "package": rel(out), "bytes": out.stat().st_size,
          "files": len(entries), "counts": counts, "checks": check_counts,
          "warnings": warnings,
```

**依据 8 · 源码核查**：[library/journals/nature.json:64-71](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/journals/nature.json#L64-L71)

作者固定来源/日期。

```text
  "sources": [
    "https://www.nature.com/nature/for-authors/formatting-guide",
    "https://www.nature.com/nature/for-authors/final-submission",
    "https://www.nature.com/nature/for-authors/editorial-criteria-and-processes",
    "http://research-figure-guide.nature.com/figures/preparing-figures-our-specifications/"
  ],
  "verifiedAt": "2026-10-11",
  "confidence": "high"
```

**依据 9 · 源码核查**：[lib/library.js:188-208](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L188-L208)

词法路径与读文件。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveInside(root, rel) {
  if (typeof rel !== 'string' || rel.trim() === '') throw new Error('空路径');
  const raw = rel.replace(/\\/g, '/').trim();
  if (/^[a-zA-Z]:/.test(raw) || raw.startsWith('/')) throw new Error('只接受库根相对路径');
  const abs = path.resolve(root, raw);
  const relBack = path.relative(root, abs);
  if (relBack === '' || relBack.startsWith('..') || path.isAbsolute(relBack)) {
    throw new Error('路径越出科研库范围');
  }
  return abs;
}

/* -------------------------------------------------------------- 读文本/图片 */

export async function readText(root, rel, maxBytes = MAX_TEXT_BYTES) {
  const abs = resolveInside(root, rel);
  const ext = path.extname(abs).toLowerCase();
  if (!TEXT_EXT.has(ext)) throw new Error(`不是可预览的文本类型：${ext || '(无扩展名)'}`);
  const info = await stat(abs);
  if (info.size > maxBytes) throw new Error(`文件过大（${info.size} B > ${maxBytes} B）`);
  const text = await readFile(abs, 'utf8');
```

</details>

**依据 10 · 源码核查**：[lib/library.js:254-272](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L254-L272)

固定bak直接写。

<details>
<summary>查看原文（19行）</summary>

```text
export async function writeTextBackup(root, rel, text) {
  const abs = resolveInside(root, rel);
  const relPosix = toRel(root, abs);
  if (!EDITABLE_RE.test(relPosix)) {
    throw new Error(`只允许编辑 projects/<课题>/drafts/ 下的 .md/.markdown/.txt 草稿：${relPosix}`);
  }
  if (NEVER_EDIT.has(path.posix.basename(relPosix).toLowerCase())) {
    throw new Error(`这是登记索引，不能从面板改：${relPosix}`);
  }
  const ext = path.extname(abs).toLowerCase();
  if (!TEXT_EXT.has(ext)) throw new Error(`不是可编辑的文本类型：${ext || '(无扩展名)'}`);
  const body = String(text ?? '');
  const bytes = Buffer.byteLength(body, 'utf8');
  if (bytes > MAX_EDIT_BYTES) throw new Error(`内容过大（${bytes} B > ${MAX_EDIT_BYTES} B）`);
  const info = await stat(abs);              // 不存在 → ENOENT（actions 层翻成 not-found）
  if (!info.isFile()) throw new Error(`不是文件：${relPosix}`);
  const backupAbs = `${abs}.bak`;
  await copyFile(abs, backupAbs);
  await writeFile(abs, body, 'utf8');
```

</details>

#### 缺口

- 本组件未证明宿主Connection外层认证/授权与实际可达范围。
  **影响：**不能仅靠信封method正确推断写入者身份。
  **进一步探讨：**可固定宿主路由实现和部署访问控制，结合真实路径围栏研究。
- 档案现行有效性、引用原文支持和科学/统计正确性未由字段检查确定。
  **影响：**不能把通过或导出成功称可投稿/可信论文。
  **进一步探讨：**可对目标刊实际文章类型逐条读官方现行要求，再逐条核原文支持及数据/图/统计方法。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动依赖、权限与读者操作流程是什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

包0.2.2无npm dependencies并声明Node>=20，实际工作链还依赖DSH预设/Connection及Python启动器；Origin绘图另需上游MCP、兼容运行环境和Origin许可。库配置可覆盖环境根，必须以loadSettings最终root核对，不能只看会话cwd。科研预设有shell/文件写入，原始数据只读主要是提示纪律；不可把普通目录当受限沙箱。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与DSH bundle/preset/Connection | 必需 | Host精确POST路由与科研预设 | 面板缺服务告警，预设依赖另匹配 |
| Python3与库启动器/已建实体库 | 库操作必需 | 统一research.py写入/索引 | 不用裸python名称推断可用性 |
| 五类Skill/所选模型与工具 | Agent流程必需 | 写作/引用/期刊/绘图指引 | 提示纪律不代替执行权限 |
| 上游Origin插件、兼容Windows/Origin及Python依赖 | 真机绘图可选 | MCP绘图和重画 | 本包不包含上游实现或许可证 |
| 库目录读写授权与备份 | 必需 | 数据/草稿/明文索引和导出 | 路径词法围栏不等真实文件隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定DSH/包/引擎及隔离库，先预检 | 核真实库根/解释器和备份，不接生产数据 |
| 建库 | 明确课题/期刊并登记文献/图数据 | 来源与路径可核，期刊档案按现行页面复核 |
| 制作 | 按Skill写稿/图/侧车，人工读原文和审图 | DOI存在、登记通过不等内容成立 |
| 交付 | 看逐项pass/warn/fail/na后导出并检查ZIP | export成功不是全部检查通过；核实际归档hash |
| 恢复 | 明确失败点后对照备份/索引/文件 | 超时可能仍跑，不盲重复写入或打包 |

统一脚本有利减少重复实现，但Node直接草稿/归档/变换等路径仍存在，README“面板写入永远走库脚本”不能覆盖所有实际写出。外部文献/未发表稿件进入所选模型或Origin时需按真实调用确认范围，插件无统一科学数据脱敏证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/package.json#L1-L4)

包版本。

```text
{
  "name": "dsh-sciwork",
  "version": "0.2.2",
  "description": "DSH 科研模式：给 DeepSeek Harness 装一套科研工作台——「科研模式」agent 预设 + 本机实体科研库（Python 引擎与登记索引）+ 12 份期刊投稿档案 + 投稿闸门（期刊合规体检 / 投稿包导出 / 递归全文索引）+ 绘图/写作/文献/期刊技能 + 只读为主的「科研库」面板。出图由智能体经上游 dsh-origin-plugin（Origin MCP）完成。",
```

**依据 2 · 源码核查**：[package.json:46-63](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/package.json#L46-L63)

运行时及bundle。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test": "node scripts/selftest-host.mjs",
    "test:all": "node scripts/selftest-host.mjs && node scripts/selftest-actions.mjs && node scripts/selftest-client.mjs",
    "cycle": "node scripts/cycle.mjs",
    "check:local": "node scripts/check-local-info.mjs",
    "validate-patch": "python scripts/validate-patch.py",
    "install-skills": "node scripts/install.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 3 · 作者声明**：[README.md:26-32](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/README.md#L26-L32)

作者零npm/上游声明。

````text
- 宿主半边是纯 Node ESM，**零 npm 依赖**。
- 客户端是手写的单文件 Web 客户端，**没有构建步骤**。
- 出图能力依赖上游开源插件 [dsh-origin-plugin](https://github.com/Fantasality/dsh-origin-plugin)（MIT，作者 Fantasality）。**本仓库不包含它**，只带适配技能。详见〈与 dsh-origin-plugin 的关系〉。

## 安装

```bash
````

**依据 4 · 源码核查**：[lib/library.js:157-178](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L157-L178)

实际根与配置优先级。

<details>
<summary>查看原文（22行）</summary>

```text
export async function loadSettings() {
  const bundled = (await readJsonSafe(path.join(BUNDLE_DIR, 'library', 'config.json'), {})) || {};
  // 库根优先级：库内 `.research/config.json` ＞ 环境变量 ＞ 随包 `library/config.json` ＞ 默认。
  // 环境变量是运行期显式指定（隔离自检副本、用户换库位置都靠它），必须压过安装期快照；
  // 2026-10-19 之前随包快照抢在环境变量前面，装有 config.json 的机器上「把库指到别处」静默失效。
  const envRoot = envLibraryRoot();
  const root = envRoot ? path.resolve(envRoot) : resolveLibraryRoot(bundled.libraryRoot);
  const inLibrary = (await readJsonSafe(path.join(root, '.research', 'config.json'), {})) || {};
  let origin = inLibrary.origin || bundled.origin || null;
  if (!origin || !origin.server) {
    const server = resolveOriginServer({ pluginDir: (origin && origin.pluginDir) || null });
    if (server) {
      origin = { ...(origin || {}), pluginDir: (origin && origin.pluginDir) || resolveOriginPluginDir(), server };
    }
  }
  return {
    root: inLibrary.libraryRoot || root,
    interpreter: inLibrary.interpreter || bundled.interpreter || null,
    launcher: inLibrary.launcher || bundled.launcher || null,
    origin,
    defaults: inLibrary.defaults || bundled.defaults || {},
    bundleDir: BUNDLE_DIR,
```

</details>

**依据 5 · 源码核查**：[skills/research-studio/SKILL.md:64-69](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/skills/research-studio/SKILL.md#L64-L69)

Python启动器纪律。

```text
### 0.3 解释器纪律
**不要裸调 `python` / `python3`**：Windows 上 `python` 常常不在 PATH，`python3` 还可能是 Microsoft Store 的占位程序（裸调必失败）。要跑 Python 一律用库内启动器
`<库根>/.research/bin/py.cmd`（Windows）或 `<库根>/.research/bin/py`（macOS / Linux）。它按
`SCIWORK_PYTHON` → `<库根>/.venv` → `<库根>/.research/.venv` → `~/Research/.venv` → PATH 的顺序挑第一个存在的解释器（要的是装了 numpy / openpyxl / pyyaml / originpro / mcp / pywin32 的那一份）。
不要因为裸调 `python3` 报错就宣布技能不可用——那是环境的错，不是技能的错，换启动器即可；
启动器一个都找不到时它会直接打印该建哪个 venv、装哪些包，照做即可。
```

**依据 6 · 源码核查**：[cordis.patch.yml:8-15](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/cordis.patch.yml#L8-L15)

保留shell/文件写工具。

```text
# 基线是内置 `standard` preset（经 dsh-ppt-mode 整理过的同一份 roster）。与 StudyHub
# 的学习模式**相反**：本模式必须保留 shell 与文件读写——绘图要跑 Python/Origin，写稿
# 要落盘 Markdown，图与数据要留在库里。
#
# Origin 的 74 个 MCP 工具（mcp__origin__*）由 profile 层的 mcp-origin 加载器条目注册
# 到宿主工具注册表，**不在此处声明**，所有预设都看得见。本预设只负责：
#   1. persona 换成科研合作者的人格 + 库优先/引用可溯源/不抢占 Origin 三条硬纪律；
#   2. 保持 shell、文件系统、技能、web、present、子代理与 workflow 全部可用。
```

**依据 7 · 源码核查**：[lib/library.js:254-272](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L254-L272)

直接写草稿。

<details>
<summary>查看原文（19行）</summary>

```text
export async function writeTextBackup(root, rel, text) {
  const abs = resolveInside(root, rel);
  const relPosix = toRel(root, abs);
  if (!EDITABLE_RE.test(relPosix)) {
    throw new Error(`只允许编辑 projects/<课题>/drafts/ 下的 .md/.markdown/.txt 草稿：${relPosix}`);
  }
  if (NEVER_EDIT.has(path.posix.basename(relPosix).toLowerCase())) {
    throw new Error(`这是登记索引，不能从面板改：${relPosix}`);
  }
  const ext = path.extname(abs).toLowerCase();
  if (!TEXT_EXT.has(ext)) throw new Error(`不是可编辑的文本类型：${ext || '(无扩展名)'}`);
  const body = String(text ?? '');
  const bytes = Buffer.byteLength(body, 'utf8');
  if (bytes > MAX_EDIT_BYTES) throw new Error(`内容过大（${bytes} B > ${MAX_EDIT_BYTES} B）`);
  const info = await stat(abs);              // 不存在 → ENOENT（actions 层翻成 not-found）
  if (!info.isFile()) throw new Error(`不是文件：${relPosix}`);
  const backupAbs = `${abs}.bak`;
  await copyFile(abs, backupAbs);
  await writeFile(abs, body, 'utf8');
```

</details>

**依据 8 · 作者声明**：[skills/origin-plot/SKILL.md:8-24](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/skills/origin-plot/SKILL.md#L8-L24)

作者上游能力/资源说明。

<details>
<summary>查看原文（17行）</summary>

```text
工具全部是 MCP 工具，前缀 `mcp__origin__`（本技能里写简称 `origin_*`）。共 74 个，按下面的顺序用，不要跳步。

## 0. 前置：探活与查表（每次都做）

> **参数表在这儿**：本技能目录的 `references/origin-tools.json` 是 74 个 `mcp__origin__*` 工具的**实测导出**（`serverInfo` = name `origin`, version `2.0.0`）。要某个工具的精确参数名、必填项、返回结构时**读它**，不要凭记忆写参数。

1. `origin_status` — 连接状态 + 版本能力握手。**首次调用会自动启动 Origin，5~45 秒**，这是正常的，不是卡住。返回里有 `plot_types` / `templates` / `capabilities`。
2. 启动失败或导出失败 → `origin_diagnose`（系统级自检：安装路径 / COM 注册 / 残留进程 / 导出目录权限，**不启动 Origin、无副作用**），必要时带 `connect_probe=True`。
3. 报错要分支处理 → `origin_error_codes`（全部稳定错误码 + 恢复建议）。
4. **画图前先查表，别凭记忆编参数**：
   - `origin_help` — 工具清单 + 数据格式 + 典型调用模板（离线秒回）
   - `origin_cookbook` — 场景 → 工具组合（`quick_plot` / `from_file` / `journal` / `multi_compare` / `edit` / `fit` …）
   - `origin_catalog` — 按分类的全量工具目录（文档即实现）
5. 想省掉冷启动的等待，可在用户还在说话时先 `origin_warmup`。

页会堆积，做任何批量操作前先看一眼：`origin_list_pages`（图页/工作簿/矩阵 + 短名 + 活动窗口）、`origin_list_graphs`、`origin_list_sheets`。
页数很多时用 `origin_pages_gc`（`dry_run=true` 先报告，`false` 才清理）。**实测**：793 页时 `list_pages` 要 30.9 秒、单次 `close` 要 59.2 秒，会撞 90 秒看门狗——所以页多时**先 dry_run 向用户报告，不要擅自清理**（见 §6 纪律）。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和恢复成本效果怎样评价？

**研究主题：**效果与总成本

#### 完整回答

零npm依赖减少Host安装负担，却不消除Python/DSH/Origin兼容、模型费、许可或研究者核原文的人时。持续索引、派生文件、ZIP/备份增加磁盘，期刊档案要按文章类型更新；只有真实最终稿/图的质量和返工对照才能判断收益。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | DSH/Python/可选Origin环境与许可，金额未知 | 建副本库、固定版本、配置和期刊核对 | 零npm依赖不等零外部依赖 |
| 持续使用 | 模型tokens、索引扫描/存储、可选MCP/Origin | 原文逐条读、审图、更新期刊与登记 | 学术内容/刊方现行要求不可自动保证 |
| 失败恢复 | 备份、重建索引、超时/部分产物核对 | 查子进程和文件，确认后重做 | 多文件写入不是跨操作事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 科研产物组织 | 普通文件库/侧车/索引/面板 | 多人并发一致性和实际省时 |
| 引用核查 | CLI查键/标记/链接字段，面板较弱 | 原文是否支持结论/元数据真实 |
| 投稿准备 | 档案检查项和ZIP manifest/checklist | 当前刊方要求、录用/科学有效性 |
| 绘图复用 | 上游适配和重画路径 | 同图完整重放与统计/视觉正确性 |

runResearch用argv spawn而非shell字符串，输出有尾部上限与timeout；超时kill直接子进程后结束等待，不保证全部子孙/外部Origin停止。删除有精确文件名确认和日志，优先归档可降低误删，但不是可逆删除；外部处理结果未知时不能自动重做。

#### 证据与依据

**依据 1 · 源码核查**：[lib/import.js:172-197](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/import.js#L172-L197)

解释器/脚本和argv。

<details>
<summary>查看原文（26行）</summary>

```text
export function runResearch(settings, args, { label, timeoutMs = 90_000 } = {}) {
  const out = { label: label || ['research.py', ...args].join(' '), args, code: -1, ok: false, summary: '', warnings: [], raw: null, stderr: '' };
  const interpreter = pickInterpreter(settings);
  const script = pickScript(settings);
  if (!interpreter) {
    out.stderr = '本机找不到可用的 Python 解释器（settings.interpreter 不存在）';
    return Promise.resolve(out);
  }
  if (!script) {
    out.stderr = `找不到 research.py（${settings.root}\\.research\\scripts\\ 与 bundle 模板都不存在）`;
    return Promise.resolve(out);
  }

  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(interpreter, [script, ...args], {
        cwd: settings.root,
        windowsHide: true,
        env: {
          ...process.env,
          RESEARCH_LIBRARY: settings.root,
          PYTHONIOENCODING: 'utf-8',
          PYTHONUTF8: '1',
        },
      });
```

</details>

**依据 2 · 源码核查**：[lib/import.js:204-233](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/import.js#L204-L233)

输出上限和timeout。

<details>
<summary>查看原文（30行）</summary>

```text
    let stdout = '';
    let stderr = '';
    let finished = false;
    const settle = () => {
      if (finished) return;
      finished = true;
      out.stderr = stderr.slice(-4000);
      const parsed = parseLastJson(stdout);
      if (parsed) {
        out.raw = parsed;
        out.ok = parsed.ok === true;
        out.summary = asString(parsed.summary) || (out.ok ? '已完成' : asString(parsed.error));
        out.warnings = asArray(parsed.warnings);
        if (!out.ok && !out.summary) out.summary = asString(parsed.error) || '命令返回失败';
      } else {
        out.summary = stderr.trim().split(/\r?\n/).slice(-3).join(' ') || `退出码 ${out.code}`;
      }
      resolve(out);
    };

    const timer = setTimeout(() => {
      out.stderr = `超时 ${timeoutMs} ms，已结束等待（子进程可能还在跑）`;
      try { child.kill(); } catch { /* 忽略 */ }
      settle();
    }, timeoutMs);

    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout = (stdout + chunk).slice(-200_000); });
    child.stderr?.on('data', (chunk) => { stderr = (stderr + chunk).slice(-50_000); });
```

</details>

**依据 3 · 源码核查**：[lib/archive.js:193-242](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/archive.js#L193-L242)

单文件确认/删除/日志。

<details>
<summary>查看原文（50行）</summary>

```text
export async function removeEntries(input = {}) {
  const settings = await loadSettings();
  const root = settings.root;
  if (!existsSync(root)) return fail('not-found', `科研库根目录不存在：${root}`);
  const { accepted, rejected } = normalizeEntries(input.entries);
  if (accepted.length !== 1) {
    if (accepted.length === 0 && rejected.length) {
      const first = rejected[0];
      return fail('denied', `这些路径不能删：${first.path}（${first.reason}）`, { rejected });
    }
    return fail(
      'bad-request',
      accepted.length === 0
        ? '没有可删除的条目（真删一次只允许一个文件；批量请用归档）'
        : `真删一次只能选一个文件，现在选了 ${accepted.length} 个。批量删除请用「归档」。`,
      { rejected },
    );
  }
  const entry = accepted[0];
  const want = path.posix.basename(entry.path);
  const got = asString(input.confirm);
  if (got !== want) {
    return fail('denied', `确认文件名不对：要删的是「${want}」，请原样输入一次。`, { expected: want, got });
  }

  const removed = [];
  const missing = [];
  const skipped = [...rejected];
  for (const rel of [entry.path, ...(entry.sidecar ? [entry.sidecar] : [])]) {
    const abs = resolveInside(root, rel);
    const bytes = await fileBytes(abs);
    if (bytes === null) {
      missing.push({ path: rel, reason: '文件不存在' });
      continue;
    }
    try {
      await unlink(abs);
      removed.push({ path: rel, bytes, kind: entry.kind });
    } catch (error) {
      skipped.push({ path: rel, reason: String(error?.message || error) });
    }
  }
  if (removed.length === 0) return fail('not-found', '文件已经不在了', { missing, skipped });

  const at = new Date().toISOString();
  const logAbs = path.join(root, REMOVED_DIR, `${stamp()}.json`);
  await mkdir(path.dirname(logAbs), { recursive: true });
  await writeFile(
    logAbs,
    JSON.stringify({ schema: 1, at, by: 'research-panel', reason: asString(input.reason) || '面板删除', root, removed, missing, skipped }, null, 1),
```

</details>

**依据 4 · 源码核查**：[library/scripts/research.py:1458-1466](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1458-L1466)

磁盘ZIP输出。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)

    emit({"ok": True, "package": rel(out), "bytes": out.stat().st_size,
          "files": len(entries), "counts": counts, "checks": check_counts,
          "warnings": warnings,
```

#### 缺口

- 无相同课题数据/稿件的组织时间、返工、引用内容准确率和完整链费用对照。
  **影响：**不能承诺科研提效、投稿通过或经济回报。
  **进一步探讨：**可用公开脱敏课题对比普通目录+脚本与本工作台，计模型/许可/核文/恢复成本和盲审产物质量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程点可复用，怎样研究一致快照与证据收据？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

精确POST注册避免接管整个/api；注册失败告警不拖垮预设。Python文件写采用临时文件os.replace，面板草稿先bak，归档/删除有日志，ZIP含sha256 manifest，都是可复用工程点。但临时名固定.tmp没有跨调用锁，两个写者可丢更新/竞争；refs.json与refs.bib分别写不等跨文件事务。ZIP先hash源后archive.write重新读取，源若并发变化，manifest可与实际归档字节不一致。重画锁含token防误释放有价值，过期接管直接覆盖仍非完整互斥协议；多源记录只用首份数据的重画不等完整复现。

可探讨未验证的一致快照/证据收据。以版本号和受控单写者或事务锁处理refs/索引，暂存实际归档字节再hash写manifest，保存档案版本和检查项状态；把“字段已登记”“原文已核”“科学结论已复核”分层，不让export ok冒充全检通过。相对当前散落字段/bak，可减少错配和无法解释的成功；代价是存储/锁恢复、人工证据和兼容维护。可用并发refs更新、hash到ZIP间源变化、缺链接旧记录、期刊fail与na、多个数据源重画夹具核结果，不通过就保留未知/失败而非补强措辞。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:149-164](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/index.js#L149-L164)

精确注册与告警。

<details>
<summary>查看原文（16行）</summary>

```text
    try {
      // 精确路由：只吃 `/api/research/call` 的 POST，官方 `/api/*` 端点原样留给 api-gateway。
      ctx.effect(
        () => registry.register(route),
        `research-library — ${ROUTE_PATH}（${ACTIONS.length} 个动作）`,
      );
      note(ctx, 'info', `已注册精确路由 ${ROUTE_PATH}（${ACTIONS.length} 个动作）`);
    } catch (error) {
      // 例如与别的插件抢同一路径（`connection: exact Fetch route … is already registered`）。
      // 这里**故意吞掉**不往上抛，只留响亮的 error 日志（HANDOFF §1 禁令 3）。
      note(
        ctx,
        'error',
        `精确路由 ${ROUTE_PATH} 注册失败，面板端点不可用：${String((error && error.message) || error)}`,
      );
    }
```

</details>

**依据 2 · 源码核查**：[library/scripts/research.py:101-112](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L101-L112)

固定tmp原子替换。

<details>
<summary>查看原文（12行）</summary>

```text
def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    os.replace(tmp, path)


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)
```

</details>

**依据 3 · 源码核查**：[library/scripts/research.py:353-356](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L353-L356)

refs两文件。

```text
    refs[key] = record
    store["updatedAt"] = now()
    write_json(REFS_JSON, store)
    write_text(REFS_BIB, refs_to_bibtex(refs))
```

**依据 4 · 源码核查**：[library/scripts/research.py:1400-1412](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1400-L1412)

先hash候选。

<details>
<summary>查看原文（13行）</summary>

```text
    for candidate in candidates:
        try:
            path = candidate.resolve()
        except OSError:
            continue
        if not path.is_file():
            continue
        name = _zip_name(path)
        if name in seen:
            continue
        seen[name] = path
        entries.append({"path": name, "bytes": path.stat().st_size, "sha256": _sha256(path)})
        zip_entries.append((name, path))
```

</details>

**依据 5 · 源码核查**：[library/scripts/research.py:1458-1462](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1458-L1462)

再读取归档。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)
```

**依据 6 · 源码核查**：[lib/replot.js:190-217](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/replot.js#L190-L217)

token与过期接管。

<details>
<summary>查看原文（28行）</summary>

```text
  // 锁里带一个 token：release() 只删「还是自己那把」的锁，避免接管过期锁的瞬间
  // 把别人刚拿到的锁删掉。
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const payload = (forRead) => JSON.stringify(
    { at: new Date().toISOString(), by: 'research-panel', pid: process.pid, token, reason },
    null, forRead ? 1 : 0,
  );
  try {
    await writeFile(file, payload(false), { encoding: 'utf8', flag: 'wx' });
  } catch (e) {
    if (e?.code !== 'EEXIST') throw e;
    let age = Infinity;
    try { age = Date.now() - (await stat(file)).mtimeMs; } catch { /* ignore */ }
    if (age < LOCK_STALE_MS) {
      let holder = '';
      try { holder = (await readFile(file, 'utf8')).slice(0, 200); } catch { /* ignore */ }
      throw new Error(`Origin 忙：${path.join(root, '.research', 'locks', 'origin.lock')} 存在（${Math.round(age / 1000)} s 前），说明有另一次重画或智能体正在用 Origin。锁对象：${holder}`);
    }
    await writeFile(file, payload(false), { encoding: 'utf8' }); // 过期锁：接管
  }
  return async () => {
    try {
      const cur = await readFile(file, 'utf8');
      if (!cur.includes(token)) return; // 锁已经换主人了，别删别人的
    } catch {
      return; // 锁已经没了
    }
    try { await unlink(file); } catch { /* ignore */ }
```

</details>

**依据 7 · 源码核查**：[lib/replot.js:388-398](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/replot.js#L388-L398)

多源只取首份。

<details>
<summary>查看原文（11行）</summary>

```text
  const sources = Array.isArray(sidecar.sourceData) ? sidecar.sourceData.filter(Boolean) : [];
  const warnings = [];

  if (!projectSlug) throw new Error(`无法从侧车判定所属课题：${opts.sidecarRel}`);
  if (sources.length === 0) {
    throw new Error(`这张图没有记录源数据（sourceData 为空），面板无法重画。请让智能体用原始数据重新出图，并用 research.py register-figure 补上 --data。`);
  }
  const sourceRel = sources[0];
  const sourceAbs = resolveInside(root, sourceRel);
  await stat(sourceAbs);
  if (sources.length > 1) warnings.push(`侧车记录了 ${sources.length} 份源数据，本次只用第一份：${sourceRel}`);
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在怎样推荐，继续探讨从哪里入手？

**研究主题：**采用判断

#### 完整回答

推荐observe，先用单人、无敏感副本核文件链和恢复，不直接把投稿闸门当期刊合规证明。普通文件库、统一登记和方法指引有实质价值，但词法路径/多写者/manifest快照、面板引用保证偏差与fail仍导出需要明确边界。Origin和完整学术方法是额外独立范围，不能由本包描述背书。

继续研究可先核真实路径和宿主入口授权、让面板与CLI引用判据一致、把导出状态与检查fail/na分开，再核档案版本及快照hash。之后用公开课题对照产物质量、人时和恢复。发现库外读写、引用字段缺失却声称可溯源、fail被当全部通过、归档hash不匹配、误删/重画结果不能说明来源或超时状态不明时，应停止采纳/重复写入并保留原稿/原始数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/library.js:188-208](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/library.js#L188-L208)

词法边界。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveInside(root, rel) {
  if (typeof rel !== 'string' || rel.trim() === '') throw new Error('空路径');
  const raw = rel.replace(/\\/g, '/').trim();
  if (/^[a-zA-Z]:/.test(raw) || raw.startsWith('/')) throw new Error('只接受库根相对路径');
  const abs = path.resolve(root, raw);
  const relBack = path.relative(root, abs);
  if (relBack === '' || relBack.startsWith('..') || path.isAbsolute(relBack)) {
    throw new Error('路径越出科研库范围');
  }
  return abs;
}

/* -------------------------------------------------------------- 读文本/图片 */

export async function readText(root, rel, maxBytes = MAX_TEXT_BYTES) {
  const abs = resolveInside(root, rel);
  const ext = path.extname(abs).toLowerCase();
  if (!TEXT_EXT.has(ext)) throw new Error(`不是可预览的文本类型：${ext || '(无扩展名)'}`);
  const info = await stat(abs);
  if (info.size > maxBytes) throw new Error(`文件过大（${info.size} B > ${maxBytes} B）`);
  const text = await readFile(abs, 'utf8');
```

</details>

**依据 2 · 源码核查**：[lib/actions.js:294-301](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/lib/actions.js#L294-L301)

面板判据。

```text
      case 'checkCitations': {
        const settings = await loadSettings();
        const result = await checkCitations(settings.root, asString(args.path));
        return done({
          ...result,
          okFlag: result.missing.length === 0 && result.cited.length > 0,
          caveat: '本核查只能证明「每个引用键都能在库里找到、且该条带有 DOI 或 URL」；它不能证明被引文献的内容真的支持这句话。',
        });
```

**依据 3 · 源码核查**：[library/scripts/research.py:1414-1419](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1414-L1419)

fail不阻导出。

```text
    check_counts = None
    if journal is not None:
        report = journal_check(pdir.name, journal_key, draft=args.draft, submission_id=args.submission)
        check_counts = report["counts"]
        if check_counts.get("fail"):
            warnings.append(f"体检还有 {check_counts['fail']} 项不合格（跑 check-journal 看明细）")
```

**依据 4 · 源码核查**：[library/scripts/research.py:1458-1466](https://github.com/58catmiao/dsh-sciwork/blob/21c6e9d5f8f48cd03363305d9fa3c641f8d0f808/library/scripts/research.py#L1458-L1466)

ZIP成功。

```text
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        archive.writestr("checklist.md", checklist_md)
        for name, path in zip_entries:
            archive.write(path, arcname=name)

    emit({"ok": True, "package": rel(out), "bytes": out.stat().st_size,
          "files": len(entries), "counts": counts, "checks": check_counts,
          "warnings": warnings,
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
