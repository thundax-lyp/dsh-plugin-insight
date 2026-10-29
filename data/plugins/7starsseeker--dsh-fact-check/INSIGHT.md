# Fact Check

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f75e564](https://github.com/7starsseeker/dsh-fact-check/tree/f75e564a2c8b7d9b96acda796b792b83c29252ef)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-fact-check) [![npm 30d 2,283](https://img.shields.io/static/v1?label=npm+30d&message=2%2C283&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fact-check)
<!-- END META -->

> **功能**：为 DSH 提供公开资料核查 Skill、关键词取证路由与可选 Jev 判断，组织原文、来源关系和不确定结论。

> **亮点**：方法/本机配置分离、正文现读一致性、确定性渠道计划和判据可替换，减少协议重复组织，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：URL与模板不证明原文、独立源或蕴含，双轨是规范口径、Jev数字不等概率真值，审计也可降级，见 [Q02](#research-q02)。

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
  - [Q01 · 核查插件交付方法还是自动事实真值？](#detail-section-11)
  - [Q02 · 关键词路由、Jev判据和双轨结论分别有什么限制？](#detail-section-12)
  - [Q03 · 谁能如何试用，冻结证据的价值如何验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究者可拆事实点并组织多渠道原文和矛盾报告，合格交付需相关证据与未知明确，见 [Q01](#research-q01)。

手工查原始公告、追转载并写报告；插件固化成熟核查方法，搜索/网页和判据能力来自外部，不是新真值算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill | 重复核查方法 | 非事实真值执行器 |
| route | 渠道/ladder计划 | 不抓网页、不裁事实 |
| Jev可选脚本 | 结构化额外判据 | 外部Key、noul非独立真值 |
| 双轨报告 | 不同源集敏感性 | 作者规范口径、需人工裁定 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18/DSH skills | 加载必需 | provider与本地脚本 | 无注册服务不能用插件方法 |
| 搜索+正文链 | 效果必需 | 原始资料获取 | 全失败报告无法核实，勿用记忆填 |
| local能力映射 | 机器相关必需 | 把计划落工具 | 不随包、坏配置可空覆盖 |
| Jev端点/Key | 可选 | 额外判断层 | 可回规则/人工，非真值保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 探搜索/正文并选事实点 | 区分能力就绪与计划 |
| 取证 | 模型/工具读原文追源 | 摘要不可充正文 |
| 判断 | 人复核，可选Jev | 来源/蕴含/矛盾分开 |
| 交付 | 双轨和未知清楚 | 不自动发布真伪 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 搜索/模型服务未知 | 能力/正文链/Key映射 | Jev可不启用 |
| 持续使用 | 多渠道与判据调用未知 | 引文/源头/矛盾核对 | 单位合格事实点成本未知 |
| 失败恢复 | 重抓/替代链未知 | 时间版本、补档和裁定 | 日志可降级 |
| 退出 | 证据保存未知 | 回手工原文核对 | 已发布结论须另负责 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 组织核查 | 拆点/渠道/反向规则 | 模型遵守 |
| 路由/判据 | 计划与可选HTTP | 真搜索召回/校准 |
| 结论质量 | 可审URL与双轨协议 | 独立准确/净节时 |

> **思考**：URL与模板不证明原文、独立源或蕴含，双轨是规范口径、Jev数字不等概率真值，审计也可降级，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：方法/本机配置分离、正文现读一致性、确定性渠道计划和判据可替换，减少协议重复组织，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q01](#research-q01) 正文现读/名称检查和watch可借鉴；[Q02](#research-q02) 路由与判据分离、日志degraded明确，但不能把计划或审计名义当完成取证。

<a id="detail-section-5"></a>

### 1.4 主要限制

URL与模板不证明原文、独立源或蕴含，双轨是规范口径、Jev数字不等概率真值，审计也可降级，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

少量公开原始资料事实点先人工核查试用，确认正文链再用；Jev仅额外线索，不无人值守发布，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

provider、路由、可选HTTP和代表协议已核，条件人工核查试用；未运行目标/取证/外部判据。冻结图是假设。

- 已检查：作者 README、包清单、源码路径 SKILL.md、lib/index.js、package.json、tools/jev-verdict.mjs、tools/route.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧六题/11findings/自code依赖及原稿证据复核；完整inventory，当前读provider、route、Jev调用/日志及SKILL关键取证/双轨段，未运行网络。
- 下一步：新标注断言/原文/转载链比较规则/Jev与人工，易变页比较URL/冻结图，计误判、复核和费用。本轮无执行。

**分析版本**

- **仓库**：[7starsseeker/dsh-fact-check](https://github.com/7starsseeker/dsh-fact-check)
- **版本号**：1.5.1（[固定提交 f75e564](https://github.com/7starsseeker/dsh-fact-check/tree/f75e564a2c8b7d9b96acda796b792b83c29252ef)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

冻结断言-摘录-来源图以提高后续复核，对照无改善或负担过大即否定，未实现，见 [Q03](#research-q03)。

新标注断言/原文/转载链比较规则/Jev与人工，易变页比较URL/冻结图，计误判、复核和费用。本轮无执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2333 | — | — | 45067 |
| .js | source | 1 | 211 | 112 | 85 | — |
| .mjs | source | 5 | 1553 | 1205 | 237 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7starsseeker/dsh-fact-check/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7starsseeker/dsh-fact-check/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查协议、路由与可选判据能支持什么，哪些真值/源独立主张仍须人工原文核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 核查插件交付方法还是自动事实真值？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-fact-check 1.5.1是薄原生插件加核查Skill、路由与可选Jev脚本。给研究者把传闻/数字拆成事实点，组织公开资料、原文、反向查询和矛盾处理，输出可溯源报告；相较随手搜索是重复协议，不是新真伪算法。跨语言/多个站点扩大线索不等来源相互独立，转载要追源头；合格任务是每点有相关原文及未知说明，而非更多URL。

provider在list/get现读同一SKILL.md，get名字与候选不一致就拒绝，watch失效通知避免正文/目录漂移。它只注册方法，不安装实际搜索和正文抓取服务。Node>=18、宿主skills为加载前提；真实核查要至少一条正文链，tools/local.json本机映射不随包分发。Skill要求首选失败降级和摘要不当正文，这是作者执行规则，不能推断每条抓取链实际可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/package.json#L2-L4)

版本/定位。

```text
  "name": "dsh-fact-check",
  "version": "1.5.1",
  "description": "Fact-checking skill for DeepSeek Harness: verifies claims against the open web instead of model memory, cross-checks independent sources across domestic and international search ecosystems, and can route three factual judgements (does the evidence support the claim / is this source primary / does this page carry usable text) to a TypeSafe Jev (System One) decision model when a key is configured, falling back to the skill's deterministic rules when it is not.",
```

**依据 2 · 源码核查**：[package.json:33-50](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/package.json#L33-L50)

Node、bundle与local配置不分发。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "lib",
    "tools",
    "!tools/local.json",
    "cases",
    "SKILL.md",
    "INSTRUCTIONS.md",
    "FOR-AI.md",
    "ADAPTING.md",
    "MEASUREMENTS.md",
```

</details>

**依据 3 · 源码核查**：[lib/index.js:89-104](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/lib/index.js#L89-L104)

候选现读与资源来源。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:119-134](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/lib/index.js#L119-L134)

正文现读与名称一致。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:201-209](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/lib/index.js#L201-L209)

provider实际注册。

```text
export function apply(ctx) {
  ctx.skills.registerProvider((control) => {
    const stop = watchSkillFile(control, ctx)
    if (typeof ctx.effect === 'function') {
      ctx.effect(function* () {
        yield () => stop()
      }, 'fact-check skill watcher')
    }
    return provider
```

**依据 6 · 作者声明**：[SKILL.md:20-30](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/SKILL.md#L20-L30)

正文链与摘要边界。

<details>
<summary>查看原文（11行）</summary>

```text

1. **服务端提取**——宿主内置的网页抓取 / 正文抽取能力，或搜索服务自带的正文抽取字段（不依赖本地网络）；
2. **站点结构化端点**——社区、平台自带的 `.json` 或 API 端点（比解析 HTML 稳）；
3. **本地抓取兜底**——`curl -sL -A "<UA>" <url> -o page.html` 取回 HTML（必要时带代理），再接 readability 系工具（trafilatura / markitdown / readability-lxml）；
4. **平台专用工具**——视频 / 社交类平台的专用 CLI（字幕、弹幕、评论等）；
5. **免登录直取接口**——平台公开的免登录端点；拿不到就如实标注"未能获取原文"，不要伪造。

哪条链在本机可用、哪个站已经挂了，属于**运行时基线**：写进 `tools/local.json` 的 `runtimeNotes`（带日期），**不要写进本文**——正文没有时效标注机制，写在这里半年后就是过期信息，而且换台机器就得改正文。

**首选路径失败必须自动降级到次选**，而不是直接判定"无法核查"。只有**五条路径全部失败**才判"无法核查"，且必须在报告的「本次未能核实到的」里写明试过哪几条、各自报什么错。
**搜索结果的 `content` / `snippet` 字段只是摘要，不能当正文计入证据。**
```

</details>

#### 缺口

- 没有实际来源链可用性和独立报告准确率对照。
  **影响**：协议或模型判据存在不能证明网页事实真值和核查效果。
  **进一步探讨**：选可回原始资料的事实点，先探正文工具，再人工核转载关系及每条引文。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关键词路由、Jev判据和双轨结论分别有什么限制？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

route.planFor按关键词选domain，未命中回general_fact，合并渠道/ladder并给dispatchHint与未解占位符；只返回计划，不取网页或裁定事实。坏local.json吞错为空覆盖，计划成功不代表环境就绪。Jev call把调用者给的state/questions送可配端点，Bearer认证、超时，429/5xx和异常可重试，返回answer.noul而不是独立事实标签；原文、断言、源头关系错了，模型数字也不补成真值。审计写失败降级告警而主结果继续，不能保证每次判据都有磁盘日志。

SKILL要求URL+位置、原文/转述、矛盾隔离与利益/污染标注，这提高可审查性，却没有程序证明引文与网页一致、源独立或证据蕴含。双轨保留原规范结论与剔除标注源后结果，是作者敏感性口径，主档位不受关联自动降权的取舍需读者理解，不是客观概率。目录/回归语料和作者Jev准确率不是本轮独立验证；可替换判据层是工程灵活性，不是无人值守发布真伪的充分依据。

#### 证据与依据

**依据 1 · 源码核查**：[tools/route.mjs:32-39](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/tools/route.mjs#L32-L39)

坏本机配置回空覆盖。

```text
export function localOverrides() {
  try {
    const f = join(HERE, 'local.json')
    if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8')).overrides || {}
  } catch {
    /* a broken local.json must not break planning */
  }
  return {}
```

**依据 2 · 源码核查**：[tools/route.mjs:121-152](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/tools/route.mjs#L121-L152)

确定性路由输出计划。

<details>
<summary>查看原文（32行）</summary>

```text
export function planFor(task) {
  const matched = []
  for (const [domain, re] of DOMAIN_SIGNALS) if (re.test(task)) matched.push(domain)
  // An unmatched task falls back to the general fact-check domain: a ladder that
  // applies to any topic (party's own release → wire service → metasearch → archive
  // → local media), not the software-release ladder. Falling back to tech_release
  // handed unrelated tasks a README/CHANGELOG ladder, and because that domain is
  // not closed, a hint saying a single route was enough — which talked the agent
  // out of dispatching.
  const fallback = matched.length === 0
  const chosen = fallback ? ['general_fact'] : matched
  const ladders = chosen.map((d) => ({ domain: d, label: matrix.domains[d].label, ladder: matrix.domains[d].ladder }))
  const routeIds = [...new Set(chosen.flatMap((d) => DOMAIN_ROUTES[d] || []))]
  const chosenRoutes = routeIds.map((id) => routes.routes.find((r) => r.id === id)).filter(Boolean)
  const closed = chosen.some((d) => matrix.domains[d].closed)
  const factPoints = [...task.matchAll(/[；;。\n]/g)].length + 1
  return {
    task,
    domains: chosen,
    // True when no domain matched and the general ladder was used: read that ladder
    // as a starting point, not as a domain verdict.
    fallback,
    closedEcosystem: closed,
    factPointsInText: factPoints,
    ladders: substDeep(ladders),
    routes: chosenRoutes.map((r) => ({ id: r.id, when: subst(r.when), primary: substDeep(r.primary), notes: subst(r.notes) })),
    failureActions: substDeep(routes._failure_actions),
    localPlaceholdersUnset: unresolved(),
    dispatchHint: fallback
      ? '未识别事实类型（兜底域）→ 按 SKILL.md 的信号表判断：涉及封闭生态 / 需抓大量长文 / 事实点 ≥4，任一命中即派子代理'
      : closed || chosen.length >= 3 || factPoints >= 4
        ? '需要多路取证（封闭生态 / 多类型事实点）→ 候选派子代理；最终仍以派发判据标注集为准'
```

</details>

**依据 3 · 源码核查**：[tools/jev-verdict.mjs:299-334](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/tools/jev-verdict.mjs#L299-L334)

实际HTTP/重试/noul读取。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[tools/jev-verdict.mjs:348-370](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/tools/jev-verdict.mjs#L348-L370)

日志尽力写入并标degraded。

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

**依据 5 · 作者声明**：[SKILL.md:103-116](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/SKILL.md#L103-L116)

引用及双轨口径。

<details>
<summary>查看原文（14行）</summary>

````text
> **类型只是其中一条轴。** 同一来源还可能有利益关联，也可能处在大规模投毒污染的信息链上。这两项**不改变上表的权重、也不改变结论档位**——只按「利益相关与污染面」一节标注，并以双轨结论呈现（甲轨即本节档位）。

来源矛盾时**如实并列呈现**，说明分歧点（数据口径、时间线、立场），不做无依据的和稀泥。

**记录来源固定四要素**：①出处名称（站点/机构/作者）②来源类型（对照上表）③完整可点击 URL（不截断、不省略协议）④引用位置（标题、段落、表格、时间戳）。原文摘录加引号并注明"原文"，转述则注明"转述"。

### Step 4 输出核查报告

**结论先行，证据入附录。** 报告是给人读的：可审计性靠编号溯源保证，不靠把证据堆在正文里。

```markdown
## 一句话结论
**<已证实 / 很可能属实 / 未证实 / 证伪 / 无法核实>** · 置信度 <高 / 中 / 低>（依据：独立来源数量与权威性）
**乙轨（保守口径）**：<剔除标注源后重算的档位>（详见「利益相关与污染面」；上句为甲轨正式结论）
````

</details>

**依据 6 · 作者声明**：[SKILL.md:177-201](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/SKILL.md#L177-L201)

关联只标注及不同来源角色。

<details>
<summary>查看原文（25行）</summary>

```text
## 利益相关与污染面（标注制、不降权、双轨呈现）

**本节只标注，不降权。** 一个来源是否存在利益关联、是否处在大规模投毒污染的信息链上，**本技能不做判定**；它只把能拿出来看的东西标出来，并给出两套固定口径下的结论，由读报告的人自己裁定。

### 为什么不用降权（改之前先看这三条）

1. **非单调**——"没有替代源就不降权"这类条件降权，会让新增一条独立佐证反而触发降权、结论变差。"证据变多、档位变差"不可接受。
2. **奖励信息垄断**——若"唯一来源"能拿全权重，那么**确保别人无法核实**就是拿到高置信度的最优策略。这正是投毒与宣传想要的性质。
3. **全局降档**——投毒永远无法排除（连"无法排除"本身都无法排除）。一旦把它接进降档条件，等价于给整个技能统一减一档，判定力归零。

三条同源：**把"源的属性"当成了"结论的档位"**。所以本节只标注，档位仍按「信源不足的处理」③ 的独立源头数算。

### 标注三层

| 层级 | 判据 | 写进哪里 |
|---|---|---|
| **L1 客观可查** | 出资方 / 所有权 / 资助披露 / 监管文件 / 广告主集中度 / 作者利益申报——有文件就能引 | 标注表，带来源编号 |
| **L2 可推断** | 同类事件的历史口径一致性；"若此说为真，谁获益" | 标注表，**必须标明是推断** |
| **L3 不可判定** | 无法检验的动机归因（"被 X 收买""是 Y 的代理人"） | 只进**隔离区**；禁止进入标注表与结论 |

**L3 的机械化判据**：该指控成立与否，**能观察到的现象完全相同** ⇒ 不可判定 ⇒ 强制隔离。不靠"听起来像阴谋论"来判。

### 同一来源的两个角色必须分开

- **角色 A「它确实说过」**：事实级，**不受任何关联影响**。谁说的、原文是什么、何时说的，本身就可核实；"发布行为"可单独判「已证实」，不需要第三方佐证。
```

</details>

#### 缺口

- 模型判断校准、源头识别、网页变更和日志失败影响未实验。
  **影响**：协议或模型判据存在不能证明网页事实真值和核查效果。
  **进一步探讨**：固定标注断言/原文/转载链，对比Jev与人工支持关系；单测计划/取证/裁定/审计分别验，不靠数值当真。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁能如何试用，冻结证据的价值如何验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有搜索和正文工具、能人工识别来源关系的研究者可限定试用；先选少量有公开原始资料的点，不自动发布真伪判定。首次映射能力与区域网络/Jev可选Key，持续多渠道取证、模型/搜索/判据调用和人工摘录复核，失败需替换抓取链、查时间版本、补档与矛盾裁定；现金和单位合格事实点时间未知。退出可回手工查原文，保留已收证据，不依赖模型记忆填缺。Jev可关但完整核查不是零成本。

可证伪方向是固定断言、逐字摘录、抓取时间/摘要和源头关系成证据图，报告引用不可变节点；相对现有URL协议，增量是以后能重查支持关系，而非再加搜索数。代价含存储、版权/敏感内容处理与人工标注。对同批易变页/转载网对比纯URL与冻结图，测复核成功、误判独立源、结论支持及人工费用；如果无改善或负担过大就否定。当前未实现，不能把研究者未来方案计作插件已有证据存档保证。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:41-44](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/SKILL.md#L41-L44)

独立源与可溯源方法。

```text
2. **多源交叉**：每个事实点至少要有 2~3 个**相互独立**的来源佐证（不同站点、不同机构、不同渠道）。单一来源（哪怕是大媒体）只能算"单点证据"，必须交叉。
3. **国内外并行**：同一核查对象同时从国内、国外信息生态搜索，并在报告中分别呈现两边的情况——国内外互联网生态差异大，很多信息只在某一侧出现。
4. **对抗性核查**：结论初步成型后，用反向/质疑关键词再搜一轮，主动找反驳证据。找不到反证才给高置信度。
5. **全部可溯源**：报告中出现的**每一个**论断、数字、日期、引述，都必须绑定确切可追溯的来源——完整 URL + 出处名称 + 具体引用位置。任何无法溯源的内容一律不写进报告正文；确有必要提及的，明确标注"⚠ 无来源/无法溯源"及原因。（对工具/渠道的可用性结论同样适用：写上探测命令与日期。）
```

**依据 2 · 作者声明**：[SKILL.md:103-107](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/SKILL.md#L103-L107)

现有URL/位置协议。

```text
> **类型只是其中一条轴。** 同一来源还可能有利益关联，也可能处在大规模投毒污染的信息链上。这两项**不改变上表的权重、也不改变结论档位**——只按「利益相关与污染面」一节标注，并以双轨结论呈现（甲轨即本节档位）。

来源矛盾时**如实并列呈现**，说明分歧点（数据口径、时间线、立场），不做无依据的和稀泥。

**记录来源固定四要素**：①出处名称（站点/机构/作者）②来源类型（对照上表）③完整可点击 URL（不截断、不省略协议）④引用位置（标题、段落、表格、时间戳）。原文摘录加引号并注明"原文"，转述则注明"转述"。
```

**依据 3 · 源码核查**：[tools/jev-verdict.mjs:303-327](https://github.com/7starsseeker/dsh-fact-check/blob/f75e564a2c8b7d9b96acda796b792b83c29252ef/tools/jev-verdict.mjs#L303-L327)

可选外部判据成本与状态输入。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

#### 缺口

- 没有冻结证据对照、真实采用成本及效果实验。
  **影响**：协议或模型判据存在不能证明网页事实真值和核查效果。
  **进一步探讨**：新事实样本盲审同源/支持，分别计成功、失败重试和人工复核，验证方案收益后再开发。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
