# dsh-fact-check

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[704bf6b](https://github.com/7starsseeker/dsh-fact-check/tree/704bf6b034cd17ddd29f508fcff7ccc7658d5018)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 1,417](https://img.shields.io/static/v1?label=npm+30d&message=1%2C417&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check)
<!-- END META -->

> **功能**：提供多源公开事实核查流程、来源路由和可选Jev判据，生成带原文定位的报告。

> **亮点**：把成熟核查方法组织为可反复执行、可审阅的报告协议，路由与判据分离便于替换环境；并非自动事实真值算法。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：引用模板不能证明原文真实、来源独立或结论蕴含；双轨是规范口径，Jev数值也没有独立真值保证。[Q03](#research-q03)

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
  - [Q01 · 事实核查针对何种公开问题，交付物与简单搜索有何差别？](#detail-section-11)
  - [Q02 · Skill、来源路由与可选Jev判据如何接线？](#detail-section-12)
  - [Q03 · 可追溯引用是否保证来源独立及结论成立？](#detail-section-13)
  - [Q04 · 安装、搜索正文工具与本地配置怎样影响办结？](#detail-section-14)
  - [Q05 · 长期复核成本与失败透明的工程机制如何？](#detail-section-15)
  - [Q06 · 来源快照和断言证据图能否改善可复查性，是否适合试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给研究者组织公开资料核查，合格交付需逐事实点核对来源与未确定项。

对照为人工核查清单、宿主普通搜索和直接读来源；本轮比较方法组织，不作实测效果排序。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| fact-check Skill | 拆点核查和报告 | 依赖宿主搜索/正文工具 |
| route脚本 | 确定渠道计划 | 关键词路由不执行搜索 |
| Jev脚本 | 支持/来源/正文判据 | 可选外部模型，失败未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18及DSH skills | 必需 | provider加载 | 无法发现Skill |
| 搜索与正文抓取链 | 核查必需 | 取证 | 无法核实，不能记忆填空 |
| Jev兼容端点/密钥 | 可选 | 额外判据 | 退化到规则/人工 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 加载Skill并确认本机搜索/正文工具 | 能取得原文 |
| 核查 | 拆事实点、多渠道与反向搜索 | 每点有出处/位置及分歧 |
| 验收 | 研究者核对引文和源头 | 缺正文或冲突则保留未确定 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 搜索/模型服务，金额未知 | 配能力映射与正文链 | 路由可不用Jev |
| 持续 | 多渠道调用与可选判据 | 源头关系、引文核对 | 单位合格事实点成本未知 |
| 失败恢复 | 重试和抓取替代链 | 记录失败、补档和矛盾裁定 | 审计日志可降级 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 核查组织 | 拆点、多源、反向与分档规则 | 模型执行遵循度 |
| 路由 | 关键词映射和渠道计划 | 实际搜索召回 |
| 结论质量 | 可选Jev与双轨展示 | 独立准确率与节时 |

> **思考**：引用模板不能证明原文真实、来源独立或结论蕴含；双轨是规范口径，Jev数值也没有独立真值保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把成熟核查方法组织为可反复执行、可审阅的报告协议，路由与判据分离便于替换环境；并非自动事实真值算法。[Q01](#research-q01)、[Q02](#research-q02)

现读正文避免定义漂移，名称一致性检查、读失败拒绝和目录watch有明确理由；可选Jev日志degraded避免假审计完整，但日志仍是尽力写入。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

引用模板不能证明原文真实、来源独立或结论蕴含；双轨是规范口径，Jev数值也没有独立真值保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先选可对照原始资料的事实点，确认正文链可用，再人工核对转载关系及每条引文后试用；不要把模型判据作为最终裁定。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持Skill注册、路由与失败透明机制；事实准确率和真实核查收益未独立验证；证据图方向未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、SKILL.md、tools/jev-verdict.mjs、tools/route.mjs、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取provider、Skill、路由、判据及包声明；未执行网络判据、目标代码或核查任务，不把作者回归语料当独立效果。
- 下一步：可进一步用已知真值和转载图的资料集盲评，并比较纯URL与冻结快照的长期复核率。

**分析版本**

- **仓库**：[7starsseeker/dsh-fact-check](https://github.com/7starsseeker/dsh-fact-check)
- **版本号**：1.5.0（[固定提交 704bf6b](https://github.com/7starsseeker/dsh-fact-check/tree/704bf6b034cd17ddd29f508fcff7ccc7658d5018)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是固定来源快照并建立断言—摘录—源头图，以复核成功率和人工耗时检验其相对纯URL报告的价值。[Q06](#research-q06)

可进一步用已知真值和转载图的资料集盲评，并比较纯URL与冻结快照的长期复核率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2292 | — | — | 42734 |
| .js | source | 1 | 211 | 112 | 85 | — |
| .mjs | source | 5 | 1524 | 1182 | 231 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/7starsseeker/dsh-fact-check/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对事实核查Skill的可追溯编排贡献、判据局限和试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 事实核查针对何种公开问题，交付物与简单搜索有何差别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

场景是研究者把传闻、数字和事件拆成可独立查证的事实点，交付带来源和不确定项的核查报告。相对随手搜索，增量是把多渠道检索、正文抓取、反向查询和矛盾处理固化为重复流程；这些是成熟核查方法的编排，不等于新的真伪判定算法。国内外同时搜索能扩大线索，但跨语言或多站转载不自动增加独立源头数，合格结果仍要由研究者逐条核对。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:38-44](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L38-L44)

铁律明确独立来源、反向查询和定位要求。

```text
## 铁律

1. **知识库禁用**：即便模型"认为"自己知道答案，也必须用搜索工具从互联网核实后才下结论。严禁凭内部知识直接断言关键事实。搜索不可用时如实报告"无法核实"，而不是用记忆顶替。
2. **多源交叉**：每个事实点至少要有 2~3 个**相互独立**的来源佐证（不同站点、不同机构、不同渠道）。单一来源（哪怕是大媒体）只能算"单点证据"，必须交叉。
3. **国内外并行**：同一核查对象同时从国内、国外信息生态搜索，并在报告中分别呈现两边的情况——国内外互联网生态差异大，很多信息只在某一侧出现。
4. **对抗性核查**：结论初步成型后，用反向/质疑关键词再搜一轮，主动找反驳证据。找不到反证才给高置信度。
5. **全部可溯源**：报告中出现的**每一个**论断、数字、日期、引述，都必须绑定确切可追溯的来源——完整 URL + 出处名称 + 具体引用位置。任何无法溯源的内容一律不写进报告正文；确有必要提及的，明确标注"⚠ 无来源/无法溯源"及原因。（对工具/渠道的可用性结论同样适用：写上探测命令与日期。）
```

**依据 2 · 作者声明**：[SKILL.md:64-107](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L64-L107)

拆事实点、抓正文与分级的具体流程。

<details>
<summary>查看原文（44行）</summary>

```text
## 工作流程

### Step 0 拆解核查项

把用户的一句话拆成**可独立验证的事实点**（谁/何时/何地/何事/何数据）。例如"XX公司宣布收购YY"拆成：①收购是否属实 ②金额 ③时间 ④双方官方口径。每个事实点单独核查、单独列证据。

### Step 1 并行搜索（国内 + 国外 + 垂直）

一次发起多路搜索，不要串行逐条搜。至少覆盖：

- **通用国外**：英文查询（事态原文、英文报道、英文维基）
- **通用国内**：中文查询（国内报道、官方通报、中文社区讨论）
- **垂直领域**：先判明事实属于哪个范畴，再取该范畴的一手库，不要拿通用搜索硬顶。常见对应——政策法规→政府文件库/法规库；学术→论文库与撤稿库；医疗药品→药监批准信息与临床试验注册库；金融→交易所公告与监管问询函；灾害事故→应急管理部门与中国地震台网；食品安全→市场监管部门的抽检公告；科学常识→科学辟谣平台与对口学会；教育考试→教育部门与省级考试院；体育→联赛/协会官宣与反兴奋剂机构；娱乐名人→本人/工作室声明（涉死亡或违法以警方通报为准）；司法案件→法院公告与检察院、警情通报（裁判文书网现需注册登录，公开率已大幅下降）。完整范畴表见 `tools/source-matrix.json`。
- **质疑词**：每条主线配一条反向查询（"辟谣""造谣""造假""controversy""debunked""fact check"）

可选：先跑 `node tools/route.mjs plan --task "…"`，按事实类型拿到**来源阶梯 + 渠道建议**（确定性、0 成本）。

### Step 2 抓取原文与数据

搜索结果摘要只是线索，关键结论必须回到**一手页面**验证：

- 抓取候选页面的完整内容（官方公告、媒体报道原文、数据页、帖子正文）。
- 优先抓一手来源：政府/机构官网、公司公告、当事人账号、官方文档；其次权威媒体原文；社区/个人发言仅作旁证。
- 封闭生态内容（需要登录的平台、App 内内容）：先看搜索能否索引到全文/镜像；抓不到正文时用多个渠道的摘要 + 转载交叉，并在报告里注明"未能直接获取原文"。
- 反爬站抓取失败属正常，换渠道（搜索引擎缓存、转载站、镜像、官方 API），不要死磕一个站。
- 抓到的正文若像 JS 空壳/登录墙/验证码页，先判定再决定是否计入证据（可选：`ask --question usable_page`）。

### Step 3 交叉比对与来源分级

把各来源的要点对齐，判断**一致 / 矛盾 / 无法比对**：

| 来源类型 | 权重 |
|---|---|
| 官方/一手（官网、公告、政府、当事人、原始数据、法律条文） | 高 |
| 权威媒体/机构（通讯社、官方广播、央行、学术期刊） | 中高 |
| 一般媒体/门户/百科 | 中 |
| 社区/个人（论坛、问答、社交平台、博客） | 低（仅旁证/线索） |
| AI 生成内容 / 无法溯源内容 | 不采信 |

> **类型只是其中一条轴。** 同一来源还可能有利益关联，也可能处在大规模投毒污染的信息链上。这两项**不改变上表的权重、也不改变结论档位**——只按「利益相关与污染面」一节标注，并以双轨结论呈现（甲轨即本节档位）。

来源矛盾时**如实并列呈现**，说明分歧点（数据口径、时间线、立场），不做无依据的和稀泥。

**记录来源固定四要素**：①出处名称（站点/机构/作者）②来源类型（对照上表）③完整可点击 URL（不截断、不省略协议）④引用位置（标题、段落、表格、时间戳）。原文摘录加引号并注明"原文"，转述则注明"转述"。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Skill、来源路由与可选Jev判据如何接线？

**研究主题**：功能与机制

#### 完整回答

插件通过skills provider现读SKILL.md，list/get分离且在名称改变时拒绝返回错配正文。route用关键词矩阵选领域并合并渠道，只输出计划，不抓取页面也不判断事实。Jev脚本把指定断言和证据提交到可配置端点，读取noul数值，429/5xx与异常可重试；判据是额外判断层，实际搜索/正文获取仍由执行模型及宿主工具承担。注册一个Skill不意味着这些外部能力一并安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:89-135](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/lib/index.js#L89-L135)

provider候选与正文来自同一文件并核对名称。

<details>
<summary>查看原文（47行）</summary>

```text
export async function list() {
  const { fm } = parseFrontmatter(await readFile(SKILL_URL, 'utf8'))
  if (!isSkillName(fm.name)) {
    throw new Error(`SKILL.md 的 frontmatter name 不是 kebab-case：${JSON.stringify(fm.name)}`)
  }
  if (!fm.description) throw new Error('SKILL.md 的 frontmatter 缺少 description')
  return [
    {
      name: fm.name,
      description: fm.description,
      invocation: invocationOf(fm),
      provider: PROVIDER_NAME,
      source: 'bundled',
      // 资源基准指向包根：正文里写的 `tools/doctor.mjs`、`tools/route.mjs` 因此可解析，
      // 换成 skills/ 子目录会让这些相对路径失效。
      resourceBase: { kind: 'directory', path: fileURLToPath(ROOT_URL) },
      rank: RANK,
      // DSH 0.2.1 起摘要会保留 path：给宿主/子代理一个能直接打开的技能文件位置。
      path: SKILL_PATH,
      locator: SKILL_URL,
    },
  ]
}

/**
 * 读正文：frontmatter 已剥离，返回的就是指令正文。
 *
 * @param {object} candidate - `list()` 给出的候选。
 * @returns {Promise<object>} 完整技能定义。
 */
export async function get(candidate) {
  const { fm, body } = parseFrontmatter(await readFile(SKILL_URL, 'utf8'))
  // 正文里的 name 与候选不一致说明两次读之间文件被换过 —— 抛出去让注册表重新发现，
  // 而不是交出一份名不副实的定义。
  if (fm.name !== candidate.name) {
    throw new Error(`SKILL.md 的 name 已变为 ${JSON.stringify(fm.name)}，与候选 ${JSON.stringify(candidate.name)} 不符`)
  }
  return {
    name: candidate.name,
    description: fm.description || candidate.description,
    invocation: candidate.invocation,
    provider: PROVIDER_NAME,
    source: 'bundled',
    resourceBase: candidate.resourceBase,
    path: SKILL_PATH,
    content: body,
  }
```

</details>

**依据 2 · 源码核查**：[tools/route.mjs:120-143](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/tools/route.mjs#L120-L143)

领域路由产生计划而非执行结果。

<details>
<summary>查看原文（24行）</summary>

```text
export function planFor(task) {
  const matched = []
  for (const [domain, re] of DOMAIN_SIGNALS) if (re.test(task)) matched.push(domain)
  // An unmatched task falls back to technology releases: the widest ladder, and the
  // only one whose routes (general search + metasearch + vertical) fit any topic.
  const chosen = matched.length ? matched : ['tech_release']
  const ladders = chosen.map((d) => ({ domain: d, label: matrix.domains[d].label, ladder: matrix.domains[d].ladder }))
  const routeIds = [...new Set(chosen.flatMap((d) => DOMAIN_ROUTES[d] || []))]
  const chosenRoutes = routeIds.map((id) => routes.routes.find((r) => r.id === id)).filter(Boolean)
  const closed = chosen.some((d) => matrix.domains[d].closed)
  const factPoints = [...task.matchAll(/[；;。\n]/g)].length + 1
  return {
    task,
    domains: chosen,
    closedEcosystem: closed,
    factPointsInText: factPoints,
    ladders: substDeep(ladders),
    routes: chosenRoutes.map((r) => ({ id: r.id, when: subst(r.when), primary: substDeep(r.primary), notes: subst(r.notes) })),
    failureActions: substDeep(routes._failure_actions),
    localPlaceholdersUnset: unresolved(),
    dispatchHint: closed || chosen.length >= 3 || factPoints >= 4
      ? '需要多路取证（封闭生态 / 多类型事实点）→ 候选派子代理；最终仍以派发判据标注集为准'
      : '单路可覆盖，串行处理即可',
  }
```

</details>

**依据 3 · 源码核查**：[tools/jev-verdict.mjs:299-337](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/tools/jev-verdict.mjs#L299-L337)

可选判据的HTTP与失败返回。

<details>
<summary>查看原文（39行）</summary>

```text
export async function callJev(state, questionName, { key, question, timeoutMs = 20000, retries = 3, model = modelName() } = {}) {
  const def = question || QUESTIONS[questionName]
  if (!def) throw new Error(`unknown question "${questionName}"`)
  const id = questionName || 'q'
  const body = { model, state, questions: { [id]: def } }
  let lastError = null
  for (let attempt = 0; attempt <= retries; attempt++) {
    const started = Date.now()
    try {
      const res = await fetch(endpoint(), {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })
      const ms = Date.now() - started
      if (!res.ok) {
        const text = (await res.text()).slice(0, 200)
        lastError = new Error(`HTTP ${res.status}: ${text}`)
        if ((res.status === 429 || res.status >= 500) && attempt < retries) {
          await sleep(700 * (attempt + 1))
          continue
        }
        return { p: null, ms, error: lastError.message, usage: null, model }
      }
      const json = await res.json()
      const answer = json?.answers?.[id] ?? {}
      const p = typeof answer.noul === 'number' ? answer.noul : null
      return { p, raw: answer, ms, usage: json?.usage ?? null, model: json?.model ?? model, error: p === null ? 'unexpected answer shape' : null }
    } catch (e) {
      lastError = e
      if (attempt < retries) {
        await sleep(700 * (attempt + 1))
        continue
      }
      return { p: null, ms: Date.now() - started, error: `${e.name}: ${e.message}`, usage: null, model }
    }
  }
  return { p: null, ms: 0, error: lastError?.message ?? 'unknown failure', usage: null, model }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可追溯引用是否保证来源独立及结论成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。正文要求绑定URL、位置并区分转述/原文，是可审查协议；插件没有自动证明引文与原网页一致、来源独立或断言蕴含。双轨报告保留标注源与剔除源的两种结论，有助敏感性分析，但主档位不因利益关联自动改变的规范取舍仍需读者接受，不能当成客观概率。页面可能变更或消失，URL定位不等冻结快照；Jev返回数值也不是事实真值。最强质疑是执行模型可能形式上遵守模板，却错判来源关系或证据支持。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:103-107](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L103-L107)

来源角色与引用四要素为文字约束。

```text
> **类型只是其中一条轴。** 同一来源还可能有利益关联，也可能处在大规模投毒污染的信息链上。这两项**不改变上表的权重、也不改变结论档位**——只按「利益相关与污染面」一节标注，并以双轨结论呈现（甲轨即本节档位）。

来源矛盾时**如实并列呈现**，说明分歧点（数据口径、时间线、立场），不做无依据的和稀泥。

**记录来源固定四要素**：①出处名称（站点/机构/作者）②来源类型（对照上表）③完整可点击 URL（不截断、不省略协议）④引用位置（标题、段落、表格、时间戳）。原文摘录加引号并注明"原文"，转述则注明"转述"。
```

**依据 2 · 作者声明**：[SKILL.md:140-148](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L140-L148)

双轨与不降权是报告口径设计。

```text
## 利益相关与污染面（标注，不参与定档）
**甲轨（默认口径，正式结论）**：<档位> —— 标注不参与定档
**乙轨（保守口径，剔除标注源后重算）**：<档位> —— <与甲轨的差在哪；两轨相同则写"两轨一致">
| 来源 | 层级 | 可观察依据 | 乙轨动作 |
|---|---|---|---|
| [n] | L1 / L2 | <文件、披露、所有权、历史口径一致性…> | 从"内容为真"的支撑源中剔除 |
- **污染面**：<哪一段若被投毒则全盘失效；首发时序 / 引用链形状 / 跨生态痕迹 / 结论冗余度四项各自的观察结果>
- **已隔离（L3）**：<无法检验的动机归因，及"现象相同 ⇒ 不可判定"的说明>
- **不降权声明**：以上均为标注；甲轨不因本节下调，乙轨是给读者的敏感性视图，不是本报告主张。
```

**依据 3 · 源码核查**：[tools/jev-verdict.mjs:324-327](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/tools/jev-verdict.mjs#L324-L327)

脚本接受模型判据，未对事实真值独立核验。

```text
      const json = await res.json()
      const answer = json?.answers?.[id] ?? {}
      const p = typeof answer.noul === 'number' ? answer.noul : null
      return { p, raw: answer, ms, usage: json?.usage ?? null, model: json?.model ?? model, error: p === null ? 'unexpected answer shape' : null }
```

#### 缺口

- 缺少异域真实断言、重复转载与不支持引文的独立盲评
  **影响**：不能推断报告准确率或判据泛化
  **进一步探讨**：给定带反例的相同资料集，盲评断言支持、独立源头数和校准情况

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、搜索正文工具与本地配置怎样影响办结？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node>=18和DSH技能注册表构成加载条件，实际核查还必须有搜索加至少一条正文抓取链。缺少推荐批量工具可串行退化，Jev与路由可不启用；缺少所有正文链应交付无法核实而非用模型记忆替代。机器能力配置与规则正文分开能减少跨机器漂移，但route对坏local.json回退空覆盖，保留占位符由调用者处理，不能把计划成功等同环境就绪。用户需先确认工具及区域访问条件，再让模型执行。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:11-34](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L11-L34)

必需/推荐/可选能力分级及失败处理。

<details>
<summary>查看原文（24行）</summary>

```text
## 运行前提（三段式：必需 / 推荐 / 可选）

| 级别 | 需要什么 | 缺失时的行为 |
|---|---|---|
| **必需** | 一个能访问公开互联网的搜索能力（关键词搜索 + **至少一条可用的正文抓取链**） | 无法核查。如实报告"无法核实"，**禁止**用模型记忆顶替 |
| **推荐** | 批量/多引擎搜索、可切换的抓取工具、存档服务（Wayback） | 退化为串行单引擎搜索、单条抓取链，仍按同一套铁律执行，只是更慢 |
| **可选** | 本地确定性路由（`tools/route.mjs`）、决策模型判据层（`tools/jev-verdict.mjs`） | 跳过即可：路由改由人/模型按来源阶梯表判断；判据改由下面的确定性规则执行 |

**正文抓取链是能力族，不是单一能力**（任意一条可用即满足上述"必需"）。按下面这个顺序试，**前一级失败就往下一级退**：

1. **服务端提取**——宿主内置的网页抓取 / 正文抽取能力，或搜索服务自带的正文抽取字段（不依赖本地网络）；
2. **站点结构化端点**——社区、平台自带的 `.json` 或 API 端点（比解析 HTML 稳）；
3. **本地抓取兜底**——`curl -sL -A "<UA>" <url> -o page.html` 取回 HTML（必要时带代理），再接 readability 系工具（trafilatura / markitdown / readability-lxml）；
4. **平台专用工具**——视频 / 社交类平台的专用 CLI（字幕、弹幕、评论等）；
5. **免登录直取接口**——平台公开的免登录端点；拿不到就如实标注"未能获取原文"，不要伪造。

哪条链在本机可用、哪个站已经挂了，属于**运行时基线**：写进 `tools/local.json` 的 `runtimeNotes`（带日期），**不要写进本文**——正文没有时效标注机制，写在这里半年后就是过期信息，而且换台机器就得改正文。

**首选路径失败必须自动降级到次选**，而不是直接判定"无法核查"。只有**五条路径全部失败**才判"无法核查"，且必须在报告的「本次未能核实到的」里写明试过哪几条、各自报什么错。
**搜索结果的 `content` / `snippet` 字段只是摘要，不能当正文计入证据。**

**本技能不绑定任何具体产品、主机或工具链。** 正文只使用"能力名"；把能力落到你的环境里见 `ADAPTING.md`；所有"在某台机器上测出来"的数字都在 `MEASUREMENTS.md`，它们**是证据，不是配置**。本机的能力绑定与输出约定可写进 `tools/local.json`（可选字段，见 `tools/local.example.json`），正文只保留默认值。

自检：`node tools/doctor.mjs` 会探测当前环境有哪些能力、缺什么、会降级成什么样；加 `--net` 会额外自测判据端点与**两条可自测的抓取链**（宿主内置抓取与搜索服务的抽取字段它探不到，需自己各跑一次真实抓取确认）。
```

</details>

**依据 2 · 源码核查**：[tools/route.mjs:32-67](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/tools/route.mjs#L32-L67)

本地覆盖失败与未解占位符行为。

<details>
<summary>查看原文（36行）</summary>

```text
export function localOverrides() {
  try {
    const f = join(HERE, 'local.json')
    if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8')).overrides || {}
  } catch {
    /* a broken local.json must not break planning */
  }
  return {}
}

export function subst(text) {
  const ov = localOverrides()
  return String(text).replace(/\$\{([A-Z0-9_]+)\}/g, (m, name) =>
    process.env[`JEV_${name}`] || process.env[name] || ov[name] || m)
}

function substDeep(value) {
  if (typeof value === 'string') return subst(value)
  if (Array.isArray(value)) return value.map(substDeep)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, substDeep(v)]))
  }
  return value
}

/** Placeholders with no value anywhere — the caller must fill them in. */
export function unresolved() {
  const found = new Set()
  const walk = (v) => {
    if (typeof v === 'string') {
      for (const m of v.matchAll(/\$\{([A-Z0-9_]+)\}/g)) found.add(m[1])
    } else if (Array.isArray(v)) v.forEach(walk)
    else if (v && typeof v === 'object') Object.values(v).forEach(walk)
  }
  walk(routes)
  return [...found].filter((name) => subst(`\${${name}}`) === `\${${name}}`)
```

</details>

**依据 3 · 源码核查**：[package.json:33-40](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/package.json#L33-L40)

Node与bundle入口声明。

```text
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 长期复核成本与失败透明的工程机制如何？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

以一组事实点全部给出可回指原文且矛盾未被掩盖为合格任务。首次要映射搜索与正文链，持续要多渠道取证和人工核对，失败则要换抓取链、查时间版本并补档。路由不调用模型，但全流程仍有搜索/模型调用、网络与人工成本，没有同条件账单和耗时数据。工程可借鉴现读正文、读失败抛错保留好目录、目录watch兼容原子保存及Jev日志degraded显式告警。日志写入失败仍返回主结果，故不能声称审计记录必全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:81-85](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/lib/index.js#L81-L85)

目录读取失败不冒充技能删除。

```text
/**
 * 读候选：每次调用都重读 SKILL.md，所以正文改完立刻生效，不需要版本号或缓存失效。
 *
 * 读失败**不吞** —— 让 `list()` 拒绝比返回空数组诚实：注册表会把拒绝记成一次不完整的
 * 观测并保留上一次的好目录，而返回空数组等于告诉模型「这个技能被删了」。
```

**依据 2 · 源码核查**：[lib/index.js:156-189](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/lib/index.js#L156-L189)

目录watch和关闭生命周期。

<details>
<summary>查看原文（34行）</summary>

```text
function watchSkillFile(control, ctx) {
  // 老宿主（或自检里传空 control）没有 invalidate：不装监听，退化成「改完重启生效」。
  if (typeof control?.invalidate !== 'function') return () => {}
  let timer
  let closed = false
  let watcher
  try {
    watcher = watch(fileURLToPath(ROOT_URL), { persistent: false }, (_event, filename) => {
      // filename 为 null 表示「根目录里有东西变了」但说不出是哪个：刷新比留着旧目录安全。
      if (closed || (filename !== null && filename !== 'SKILL.md')) return
      if (timer !== undefined) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = undefined
        if (!closed) control.invalidate()
      }, WATCH_DEBOUNCE_MS)
    })
  } catch (error) {
    ctx?.logger?.warn?.(`fact-check: SKILL.md 监听未启动，改 SKILL.md 后需重启才刷新技能目录：${error.message}`)
    return () => {}
  }
  /** 幂等停止：abort、ctx 销毁、watcher 自身出错都走这里。 */
  const stop = () => {
    if (closed) return
    closed = true
    if (timer !== undefined) clearTimeout(timer)
    watcher.close()
  }
  watcher.on('error', (error) => {
    if (closed) return
    ctx?.logger?.warn?.(`fact-check: SKILL.md 监听已停用，改 SKILL.md 后需重启才刷新技能目录：${error.message}`)
    stop()
  })
  control.signal?.addEventListener?.('abort', stop, { once: true })
  return stop
```

</details>

**依据 3 · 源码核查**：[tools/jev-verdict.mjs:348-370](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/tools/jev-verdict.mjs#L348-L370)

尽力日志失败用degraded公开，不保证落盘。

<details>
<summary>查看原文（23行）</summary>

```text
export function logVerdict(entry) {
  try {
    const file = logFile()
    mkdirSync(dirname(file), { recursive: true })
    appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n', 'utf8')
  } catch (e) {
    // Logging is best-effort — but losing it silently is worse than one line on
    // stderr. Happens for real when the host file policy only allows writes
    // inside the session workspace (the state dir lives outside it).
    if (!logDegraded) {
      logDegraded = true
      console.error(
        `[jev-verdict] 日志不可写（${e.code || e.message}）：${logFile()}\n` +
        '  本次起静默跳过。可写路径用 JEV_VERDICT_LOG / JEV_VERDICT_STATE_DIR 指定，' +
        '或改用 --out <file> 保存完整结果（该文件由调用方指定，不受此限）。',
      )
    }
  }
}

/** Where logs go and whether they are actually landing. */
export function logStatus() {
  return { file: logFile(), degraded: logDegraded }
```

</details>

#### 缺口

- 缺合格事实点的总调用/人工成本与旧资料长期回读数据
  **影响**：无法量化净节时和审计耐久性
  **进一步探讨**：追踪一组固定事实点，计入失败链、复核及后续来源消失的补证负担

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 来源快照和断言证据图能否改善可复查性，是否适合试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是把每项断言、逐字摘录、抓取时间、内容摘要及源头关系保存为证据图，再让报告引用这些不可变节点。它由URL长期变化与转载非独立的限制推导，增量是可重算来源独立与支持关系，而非再加更多搜索。代价是存储、版权/敏感信息处理和人工标注。可用同一批易变网页比较纯URL报告与冻结证据报告的复核成功率和人工时间；若快照不改善复核或负担过大，应否定。建议已有搜索/正文工具、能识别来源关系的人试用；不适合无人值守自动发布真伪结论。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:107-107](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L107-L107)

四要素定位可作为图节点输入。

```text
**记录来源固定四要素**：①出处名称（站点/机构/作者）②来源类型（对照上表）③完整可点击 URL（不截断、不省略协议）④引用位置（标题、段落、表格、时间戳）。原文摘录加引号并注明"原文"，转述则注明"转述"。
```

**依据 2 · 作者声明**：[SKILL.md:162-171](https://github.com/7starsseeker/dsh-fact-check/blob/704bf6b034cd17ddd29f508fcff7ccc7658d5018/SKILL.md#L162-L171)

来源附录及公开信息判断边界。

<details>
<summary>查看原文（10行）</summary>

```text
## 来源（编号附录）
- [1] <出处名>（<类型>）<完整URL> — <引用位置>：<要点>（原文摘录带引号标"原文"，否则标"转述"）
- [2] …

## 工具与能力使用情况
- 用了哪些能力、哪些缺失（例：本环境无自托管元搜索，改用 X 搜索；无决策模型，判据按人工规则执行）
- 正文抓取链：哪几条可用、哪条失败（见「运行前提」）

---
> **核查口径**：本报告的"已证实 / 证伪"是**基于公开信息源**的判定，不构成法律事实认定；结论随新证据可变——报告开头应带此声明。
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
