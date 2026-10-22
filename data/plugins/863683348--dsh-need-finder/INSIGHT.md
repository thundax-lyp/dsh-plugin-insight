# dsh-need-finder

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b0f559c](https://github.com/863683348/dsh-need-finder/tree/b0f559c2b69b34a640e0d477d8ff0210f3840414)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder) [![npm 30d 841](https://img.shields.io/static/v1?label=npm+30d&message=841&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-need-finder) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-need-finder)
<!-- END META -->

> **实现功能**：用本地固定插件目录做中英文词法加权检索，返回命中理由和命令文本，并给出社区套装有序安装计划。

> **核心亮点**：将本地双语词法/标签过滤、多样化与有序配方初稿接入两模型工具，返回命中字段供进一步探索。详见[Q02](#research-q02)。

> **风险与缺陷**：84条英文描述都只是name、中文描述全空，分数是词重合非值得安装；固定采样无全量保证，配方只排序文本不安装/解依赖，明细截断。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 面向什么选择任务，推荐分意味着什么？](#detail-section-11)
  - [Q02 · 所谓语义评分如何产生，理由是否完整？](#detail-section-12)
  - [Q03 · 真实目录是否足以支撑双语与最合适推荐？](#detail-section-13)
  - [Q04 · 配方apply是可靠环境求解或安装吗？](#detail-section-14)
  - [Q05 · 如何启动和控制使用/维护成本？](#detail-section-15)
  - [Q06 · 推荐与可继续探讨入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向只知道“想提醒/远程看/补记忆”等能力需求、不了解插件名的DSH用户。两个工具搜索内置84候选与8配方，返回词法分、理由、安装命令文本；不会安装、不扫描本机已装插件，也不动态检查候选安全/兼容/版本。

合格结果是给可解释候选及适用边界，供用户进一步研究，不把分数当质量或值得安装的评估。基线是在目录按分类/关键词手查；增量是对话工具化入口与配方初稿，不能代替全生态检索、源码研究或实际整套验收。

人工按分类/关键词查目录再独立研究候选；插件省入口但缺适用和兼容实证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| plugin_guide | 词法候选排序/过滤 | 非推荐质量分、非全量生态 |
| 理由明细 | 显示字段/权重 | 截断不能全还原总分 |
| recipe | 列表/搜索/有序命令 | 不安装、不解DAG/冲突 |
| 引导段 | 告诉模型何时搜 | 候选仍需独立研究 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt与匹配DSL | 注册两工具/指导段 | peer为0.1系，不代表全部0.2兼容 |
| Cordis/Schemastery及包内JSON可读 | 配置/固定数据加载 | 零外部依赖指检索无服务，不是没有宿主包依赖 |
| 用户进一步核候选/CLI/版本 | 从候选到安装决定 | 工具没有质量/权限/冲突研究 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 核宿主value-schema版本和固定包 | 作者有旧schema修复记录，非本轮启动验收 |
| 搜索 | 描需求，检查category/tag与理由 | score只词重合，空结果不代表没有 |
| 看配方 | list/search/get/apply | 只读有序计划，互斥/可选先人工选 |
| 决策 | 查候选源码/兼容/权限/真实来源 | 不按一条导购就安装全套 |
| 更新 | 审目录来源/描述/日期后重载 | 不认为改JSON立即刷新活数组 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/JSON，无独立检索API | 核DSL/数据与候选可信度 | 安装工时/金额未知 |
| 持续使用 | 本地84条词法评分CPU、工具schema与结果上下文 | 阅读理由、补查候选 | 无额外LLM调用不等宿主总token费用为0，真实成本未知 |
| 失败恢复 | 修JSON/重载、重复检索和上下文资源 | 纠正误荐/过时条目、核配方命令 | 不执行安装故无安装回滚；若下游执行另计恢复未知 |



#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 用需求找候选 | 词法/类标签排序 | 无真实双语描述、非完整生态 |
| 可解释 | 命中字段/权重 | 明细截断不等完整总分推导 |
| 环境初稿 | order/required/exclusive标注 | 非DAG求解或安装 |
| 本地隐私 | 无外发检索/写文件 | 需求和结果仍在宿主模型上下文 |

作者纯逻辑测试能覆盖排序/配方形状，不能单独证明真实需求到可用插件的任务成功率。

> **思考**：84条英文描述都只是name、中文描述全空，分数是词重合非值得安装；固定采样无全量保证，配方只排序文本不安装/解依赖，明细截断。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将本地双语词法/标签过滤、多样化与有序配方初稿接入两模型工具，返回命中字段供进一步探索。详见[Q02](#research-q02)。

将本地双语词法/标签过滤、多样化与有序配方初稿接入两模型工具，返回命中字段供进一步探索。详见[Q02](#research-q02)。

固定guide-data.json标updated2026-08-17，实际解析84条、14类每类6条，84条descEn都等于name且descZh全空。典型条目虽有中英分类/名称标签，不能称有真实双语功能描述；README“含双语描述”和输出schema承诺与数据内容有差距。这不是推测缺描述，而是只读JSON逐条字段统计，统计脚本/结果保存在本轮独占材料。

均匀每类六条是覆盖策略，缺目录完整选择清单/逐条研究与评分，不证明从1019条挑出的最佳84。描述缺失使细粒度区别更依赖名字/分类标签，宽泛类别词可把同类多候选打成近分，名称排序只稳定呈现不证明更合适。无匹配不代表生态没有插件；存在匹配也不证明条目仍维护或兼容读者宿主。

apply时同步加载目录/配方，改数据并不会自动刷新已加载数组，需要重载插件；数据读错/JSON坏会在启动抛出。recipe validate失败仅warn后仍注册，未把无效数据完全拒绝。研究应把本地固定目录和未来刷新路线分开，不声称已接当前生态。

不是。installPlan只把plugins按order数字排序，再拼dsh plugin add字符串，返回exclusive/required/order和notes。没有调用子进程/宿主安装API，没有固定版本/锁文件、依赖图拓扑展开、已装状态/冲突/权限检测或失败回滚。validateRecipe只核名称、order正整数/重复与dependsOn名字存在；不核循环、展开依赖，也不自动从exclusive列表选一个。

内置recipes主要name=owner/repo，命令原样拼这个标识；是否被具体CLI当Git简写正确解析依CLI契约，不能在未读CLI时断言所有命令无效或都可用。render又从输出steps重建只有name/order/required的插件对象，丢npm/url字段，若以后配方name与安装目标不同，工具结构化install和显示文本可能不一致，当前数据不能据此称已发生该错配。

套装描述如“三层防护/覆盖桌面到手机”是作者配置意图，不是组合安全或业务验收。互斥/可选仅文本标注，读者或下游编排器必须审核再执行，不应把工具名apply当用户已授权安装全部。

<a id="detail-section-5"></a>

### 1.4 主要限制

84条英文描述都只是name、中文描述全空，分数是词重合非值得安装；固定采样无全量保证，配方只排序文本不安装/解依赖，明细截断。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先补真实描述/来源/版本与约束，作为探索入口而非可信安装名单或环境求解。详见[Q06](#research-q06)。

合格结果是给可解释候选及适用边界，供用户进一步研究，不把分数当质量或值得安装的评估。基线是在目录按分类/关键词手查；增量是对话工具化入口与配方初稿，不能代替全生态检索、源码研究或实际整套验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。离线词法和计划文本链清楚，数据描述/选择证据与配方约束不足以支持最合适推荐或一键安装承诺。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/match.js、lib/recipe.js、lib/guide-data.json、lib/recipes.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整三lib与两JSON字段统计/样例、包/patch；不运行目标测试/工具或安装候选，不将被导购插件内容当本轮已研究。
- 下一步：可继续用有人工标签固定需求集核否定/同义/跨平台与无匹配，比较误漏荐、明细完整和维护成本，不真实安装。

**分析版本**

- **仓库**：[863683348/dsh-need-finder](https://github.com/863683348/dsh-need-finder)
- **版本号**：0.3.2（[固定提交 b0f559c](https://github.com/863683348/dsh-need-finder/tree/b0f559c2b69b34a640e0d477d8ff0210f3840414)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索有版本/来源的用途与硬约束元数据、完整评分解释及保目标的配方计划，对照误漏荐/维护成本；未实现。详见[Q06](#research-q06)。

可继续用有人工标签固定需求集核否定/同义/跨平台与无匹配，比较误漏荐、明细完整和维护成本，不真实安装。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 250 | — | — | 2317 |
| .js | source | 3 | 566 | 463 | 78 | — |
| .mjs | source | 1 | 20 | 15 | 4 | — |
| .mjs | test | 2 | 171 | 144 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder/issues?q=is%3Aissue+created%3A2026-09-22T09%3A04%3A31.650Z..2026-10-22T09%3A04%3A31.650Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-need-finder/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A04%3A31.650Z..2026-10-22T09%3A04%3A31.650Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核需求检索分数与推荐质量区分、真实目录字段/覆盖、配方计划语义、宿主依赖和成本及采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向什么选择任务，推荐分意味着什么？

**研究主题：**场景与需求

#### 完整回答

面向只知道“想提醒/远程看/补记忆”等能力需求、不了解插件名的DSH用户。两个工具搜索内置84候选与8配方，返回词法分、理由、安装命令文本；不会安装、不扫描本机已装插件，也不动态检查候选安全/兼容/版本。

合格结果是给可解释候选及适用边界，供用户进一步研究，不把分数当质量或值得安装的评估。基线是在目录按分类/关键词手查；增量是对话工具化入口与配方初稿，不能代替全生态检索、源码研究或实际整套验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-15](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/README.md#L11-L15)

作者需求导购定位。

```text
- 用户说的是**任务**（"任务完成通知我"、"手机上看 DSH"、"抓取网页内容"），不是插件名。
- `plugin_guide` 用本地语义评分（英文词 + 中文子串 + 分类词典）在 84 个精选插件（覆盖 14 个分类）中匹配，**零网络、零 LLM 调用、零外部依赖**。
- 输出即"点菜单"：插件名、分类、双语描述、匹配理由、`dsh plugin add` 安装命令。

## 安装
```

**依据 2 · 源码核查**：[lib/index.js:130-138](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L130-L138)

实际finder返回。

```text
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit, {
        category: args.category,
        tag: args.tag,
        diversify: args.diversify === true,
        perCategory: args.perCategory,
      });
      return { need: args.need, count: results.length, results };
```

**依据 3 · 源码核查**：[lib/index.js:227-242](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L227-L242)

recipe仅构造输出。

<details>
<summary>查看原文（16行）</summary>

```text
    execute: async (args) => {
      const { action } = args;
      const rec = recipes.find((r) => r.id === args.id);
      if (action === "get" || action === "apply") {
        if (!rec) throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let out = [];
      if (action === "list") {
        out = recipes.map((r) => ({ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }));
      } else if (action === "search") {
        out = searchRecipes(args.need ?? "", recipes).map(({ recipe: r }) => ({ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }));
      } else {
        const r = rec;
        out = [{ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }];
      }
      return { action, count: out.length, recipes: out };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 所谓语义评分如何产生，理由是否完整？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

实现是本地词法加权，不含嵌入/LLM。英文切非字母数字、至少3字符并去停词；中文抽二字片段和整段。名称命中3，描述1，标签2，英文词触发类别词典再2；按分降序/名称排序，可category精确过滤、tag子串和每类条数多样化。得分是需求与元数据重叠，不是可信度、推荐度或效果概率。

解释hits最多5、details最多8，score却累计全部命中，显示明细不保证能加回总分；中文重叠片段/整段同源信息也多次加权。类别fallback只检查en tokens，中文主要靠各条tags，不是中文类别词典分支。英文CI/中文单字、否定“不要通知”和无共同词同义表达可漏/反向命中；token/tokens被停词去掉，使某些计费需求失去关键词。

贡献是确定、可离线、可解释的查找组合与模型工具接线，不是新的语义检索算法。它不额外发模型/网络请求，但使用工具本身的schema/结果仍占宿主对话上下文。

#### 证据与依据

**依据 1 · 源码核查**：[lib/match.js:36-52](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L36-L52)

停词/分词。

<details>
<summary>查看原文（17行）</summary>

```text
const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "my", "i", "me", "want", "need", "do", "is", "are", "it", "that", "this", "can", "you", "your", "dsh", "plugin", "plugins", "harness", "deepseek", "for", "from", "at", "by", "be", "get", "make", "have", "token", "tokens"]);

/** Extract English search terms from a requirement. */
export function tokenizeEn(need) {
  const words = need.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

/** Extract Chinese substrings (length >= 2) from a requirement. */
export function tokenizeZh(need) {
  const runs = need.match(/[一-鿿]{2,}/g) ?? [];
  const out = new Set();
  for (const run of runs) {
    for (let i = 0; i + 2 <= run.length; i++) out.add(run.slice(i, i + 2));
    if (run.length >= 3) out.add(run);
  }
  return [...out];
```

</details>

**依据 2 · 源码核查**：[lib/match.js:68-107](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L68-L107)

权重/类别和截断理由。

<details>
<summary>查看原文（40行）</summary>

```text
export function scorePlugin(plugin, { en, zh }) {
  const c = corpusOf(plugin);
  let score = 0;
  const hits = [];
  const details = [];
  const add = (field, term, weight, label) => {
    score += weight;
    hits.push(label);
    details.push({ field, term, weight });
  };
  for (const term of en) {
    if (c.name.includes(term)) {
      add("name", term, 3, "name:" + term);
    } else if (c.text.includes(term)) {
      add("description", term, 1, "desc:" + term);
    }
    if (c.tags.some((t) => t.includes(term) || (t.length >= 4 && term.includes(t)))) {
      add("tags", term, 2, "tag:" + term);
    }
  }
  for (const run of zh) {
    const inDesc = (plugin.descZh ?? "").includes(run);
    const inTag = (plugin.tags ?? []).some((t) => t.includes(run));
    const inName = plugin.name.includes(run);
    if (inName) {
      add("name", run, 3, "名称:" + run);
    } else if (inTag) {
      add("tags", run, 2, "标签:" + run);
    } else if (inDesc) {
      add("description", run, 1, "描述:" + run);
    }
  }
  // category fallback: requirement mentions a category keyword
  const cats = CATEGORY_KEYWORDS[plugin.category] ?? [];
  if (cats.some((k) => en.some((t) => k.toLowerCase().includes(t) || (k.length >= 4 && t.includes(k.toLowerCase()))))) {
    add("category", plugin.category, 2, "category:" + plugin.category);
  }
  const unique = [...new Set(hits)].slice(0, 5);
  const uniqueDetails = details.filter((d, i, arr) => arr.findIndex((x) => x.field === d.field && x.term === d.term) === i).slice(0, 8);
  return { score, hits: unique, details: uniqueDetails };
```

</details>

**依据 3 · 源码核查**：[lib/match.js:117-159](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L117-L159)

过滤/多样化/排序/命令文本。

<details>
<summary>查看原文（43行）</summary>

```text
export function search(need, plugins = loadPlugins(), limit = 5, options = {}) {
  if (typeof need !== "string" || need.trim().length === 0) {
    throw new Error('plugin_guide: "need" must be a non-empty string');
  }
  const en = tokenizeEn(need);
  const zh = tokenizeZh(need);
  const category = typeof options.category === "string" && options.category.trim().length > 0 ? options.category.trim().toLowerCase() : null;
  const tag = typeof options.tag === "string" && options.tag.trim().length > 0 ? options.tag.trim().toLowerCase() : null;
  let pool = plugins;
  if (category !== null) pool = pool.filter((p) => String(p.category ?? "").toLowerCase() === category);
  if (tag !== null) pool = pool.filter((p) => (p.tags ?? []).some((t) => String(t).toLowerCase().includes(tag)));
  const max = Math.min(Math.max(1, limit), 10);
  const scored = pool
    .map((plugin) => ({ plugin, ...scorePlugin(plugin, { en, zh }) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.plugin.name.localeCompare(b.plugin.name));
  let picked = scored;
  if (options.diversify === true) {
    const perCategory = Math.max(1, Math.floor(options.perCategory) || 2);
    const counts = new Map();
    picked = [];
    for (const row of scored) {
      const key = String(row.plugin.category ?? "");
      const seen = counts.get(key) ?? 0;
      if (seen >= perCategory) continue;
      counts.set(key, seen + 1);
      picked.push(row);
      if (picked.length >= max) break;
    }
  } else {
    picked = scored.slice(0, max);
  }
  return picked.map(({ plugin, score, hits, details }) => ({
    name: plugin.name,
    url: plugin.url,
    category: plugin.category,
    descEn: plugin.descEn,
    descZh: plugin.descZh ?? "",
    score,
    reasons: hits,
    details,
    install: "dsh plugin add " + plugin.url,
  }));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 真实目录是否足以支撑双语与最合适推荐？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

固定guide-data.json标updated2026-08-17，实际解析84条、14类每类6条，84条descEn都等于name且descZh全空。典型条目虽有中英分类/名称标签，不能称有真实双语功能描述；README“含双语描述”和输出schema承诺与数据内容有差距。这不是推测缺描述，而是只读JSON逐条字段统计，统计脚本/结果保存在本轮独占材料。

均匀每类六条是覆盖策略，缺目录完整选择清单/逐条研究与评分，不证明从1019条挑出的最佳84。描述缺失使细粒度区别更依赖名字/分类标签，宽泛类别词可把同类多候选打成近分，名称排序只稳定呈现不证明更合适。无匹配不代表生态没有插件；存在匹配也不证明条目仍维护或兼容读者宿主。

apply时同步加载目录/配方，改数据并不会自动刷新已加载数组，需要重载插件；数据读错/JSON坏会在启动抛出。recipe validate失败仅warn后仍注册，未把无效数据完全拒绝。研究应把本地固定目录和未来刷新路线分开，不声称已接当前生态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/guide-data.json:1-43](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/guide-data.json#L1-L43)

日期/count与两个真实空描述样例。

<details>
<summary>查看原文（43行）</summary>

```text
{
 "version": 1,
 "updated": "2026-08-17",
 "count": 84,
 "plugins": [
  {
   "id": "030611/dsh-telemetry-redactor",
   "name": "030611/dsh-telemetry-redactor",
   "url": "https://github.com/030611/dsh-telemetry-redactor",
   "category": "dev",
   "descEn": "030611/dsh-telemetry-redactor",
   "descZh": "",
   "tags": [
    "dev",
    "test",
    "audit",
    "security",
    "lint",
    "ci",
    "开发",
    "测试",
    "审计",
    "安全",
    "检查",
    "诊断",
    "telemetry",
    "redactor"
   ]
  },
  {
   "id": "BrambleXu/dsh-annotate",
   "name": "BrambleXu/dsh-annotate",
   "url": "https://github.com/BrambleXu/dsh-annotate",
   "category": "dev",
   "descEn": "BrambleXu/dsh-annotate",
   "descZh": "",
   "tags": [
    "dev",
    "test",
    "audit",
    "security",
    "lint",
    "ci",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:37-42](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L37-L42)

启动固定载入。

```text
function apply(ctx, config) {
  const plugins = loadPlugins();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching dsh plugins from a curated directory (84 plugins across 14 categories), each with a scored match breakdown (name/tag/description/category weights), an install command, and optional category/tag filters plus per-category diversity so one category cannot fill the list. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页' — rather than naming a plugin.",
```

**依据 3 · 源码核查**：[lib/index.js:148-152](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L148-L152)

配方验证只警告。

```text
  const recipes = loadRecipes();
  const recipeProblems = validateAll(recipes);
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("plugin-guide").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }
```

**依据 4 · 源码核查**：[lib/match.js:11-16](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L11-L16)

同步读取JSON。

```text
/** Load the bundled curated directory. */
export function loadPlugins() {
  const text = readFileSync(new URL("./guide-data.json", import.meta.url), "utf8");
  const parsed = JSON.parse(text);
  return parsed.plugins ?? [];
}
```

**依据 5 · 作者声明**：[README.md:52-63](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/README.md#L52-L63)

作者目录来源/设计声明。

<details>
<summary>查看原文（12行）</summary>

````text
内置精选目录 `lib/guide-data.json`：84 个真实插件，从 awesome-dsh-plugin 的 1019 个条目按分类均匀采样生成，含双语描述与标签。可按需增删（纯数据文件，改完即生效）。

## 设计

- **纯逻辑分离**：`lib/match.js` 零依赖（分词/评分/排序），`lib/guide-data.json` 纯数据，`lib/index.js` 才是 Cordis 插件。
- **评分**：名称命中 +3、标签命中 +2、描述命中 +1；中文 2-gram 子串匹配；分类词典兜底。
- **安全**：无网络请求、无文件写入、无 secrets。

## 测试

```bash
node test/match.test.mjs
````

</details>

#### 缺口

- 84候选的选择/维护依据、需求检索准确率和缺失候选覆盖率未提供。
  **影响：**不把精选/语义分当最优或值得安装判断。
  **进一步探讨：**对固定需求集人工标可用候选与无匹配，核描述来源/目录版本，报告召回与误荐而不自动安装。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配方apply是可靠环境求解或安装吗？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

不是。installPlan只把plugins按order数字排序，再拼dsh plugin add字符串，返回exclusive/required/order和notes。没有调用子进程/宿主安装API，没有固定版本/锁文件、依赖图拓扑展开、已装状态/冲突/权限检测或失败回滚。validateRecipe只核名称、order正整数/重复与dependsOn名字存在；不核循环、展开依赖，也不自动从exclusive列表选一个。

内置recipes主要name=owner/repo，命令原样拼这个标识；是否被具体CLI当Git简写正确解析依CLI契约，不能在未读CLI时断言所有命令无效或都可用。render又从输出steps重建只有name/order/required的插件对象，丢npm/url字段，若以后配方name与安装目标不同，工具结构化install和显示文本可能不一致，当前数据不能据此称已发生该错配。

套装描述如“三层防护/覆盖桌面到手机”是作者配置意图，不是组合安全或业务验收。互斥/可选仅文本标注，读者或下游编排器必须审核再执行，不应把工具名apply当用户已授权安装全部。

#### 证据与依据

**依据 1 · 源码核查**：[lib/recipe.js:26-59](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipe.js#L26-L59)

轻量结构验证。

<details>
<summary>查看原文（34行）</summary>

```text
export function validateRecipe(recipe, knownIds = []) {
  const problems = [];
  if (!recipe || typeof recipe !== "object") return ["recipe is not an object"];
  if (typeof recipe.id !== "string" || recipe.id.length === 0) problems.push("missing id");
  if (typeof recipe.name !== "string" || recipe.name.length === 0) problems.push("missing name");
  if (!Array.isArray(recipe.plugins) || recipe.plugins.length === 0) problems.push("plugins must be a non-empty array");
  const isExclusive = recipe.exclusive === true;
  const orders = new Set();
  for (const p of recipe.plugins ?? []) {
    if (!p || typeof p.name !== "string" || p.name.length === 0) problems.push("plugin entry missing name");
    if (p.order !== undefined) {
      if (!Number.isInteger(p.order) || p.order < 1) problems.push("plugin order must be a positive integer: " + p.name);
      // Exclusive recipes may share an order slot ("pick one of these").
      if (!isExclusive && orders.has(p.order)) problems.push("duplicate plugin order " + p.order + " (" + p.name + ")");
      orders.add(p.order);
    }
  }
  if (Array.isArray(recipe.dependsOn)) {
    for (const dep of recipe.dependsOn) {
      if (!knownIds.includes(dep)) problems.push("dependsOn unknown recipe: " + dep);
    }
  }
  return problems;
}

/** Validate every bundled recipe; returns { valid, problems } grouped by id. */
export function validateAll(recipes = loadRecipes()) {
  const ids = recipes.map((r) => r.id);
  const problems = {};
  for (const r of recipes) {
    const p = validateRecipe(r, ids);
    if (p.length > 0) problems[r.id] = p;
  }
  return { valid: Object.keys(problems).length === 0, problems };
```

</details>

**依据 2 · 源码核查**：[lib/recipe.js:67-99](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipe.js#L67-L99)

排序计划/互斥提示。

<details>
<summary>查看原文（33行）</summary>

```text
export function installPlan(recipe) {
  const steps = (recipe.plugins ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
      name: p.name,
      install: "dsh plugin add " + (p.npm ?? p.url ?? p.name),
      required: p.required !== false,
      order: p.order ?? 0,
    }));
  return {
    id: recipe.id,
    name: recipe.name,
    exclusive: recipe.exclusive === true,
    steps,
    notes: recipe.notes ?? "",
  };
}

/** Render a recipe as human-readable markdown (for get/apply results). */
export function renderRecipe(recipe) {
  const plan = installPlan(recipe);
  const lines = [
    "## " + recipe.name + " (" + recipe.nameEn + ") [" + recipe.id + "]",
    recipe.description + " / " + recipe.descriptionEn,
    "",
  ];
  for (const s of plan.steps) {
    lines.push((s.required ? "* " : "~ ") + s.name + (s.required ? "" : " (optional)") + " — " + s.install);
  }
  if (plan.exclusive) lines.push("", "⚠ exclusive: pick exactly one of the plugins above.");
  if (plan.notes) lines.push("", "notes: " + plan.notes);
  return lines.join("\n");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:213-242](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L213-L242)

render丢目标/execute只返回。

<details>
<summary>查看原文（30行）</summary>

```text
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result" + (value.count === 1 ? "" : "s"), ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({
            id: rc.id, name: rc.name, nameEn: rc.nameEn,
            description: rc.description, descriptionEn: rc.descriptionEn,
            exclusive: rc.exclusive, notes: rc.notes,
            plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })),
          }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const { action } = args;
      const rec = recipes.find((r) => r.id === args.id);
      if (action === "get" || action === "apply") {
        if (!rec) throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let out = [];
      if (action === "list") {
        out = recipes.map((r) => ({ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }));
      } else if (action === "search") {
        out = searchRecipes(args.need ?? "", recipes).map(({ recipe: r }) => ({ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }));
      } else {
        const r = rec;
        out = [{ ...recipeBrief(r), steps: installPlan(r).steps, notes: r.notes ?? "" }];
      }
      return { action, count: out.length, recipes: out };
```

</details>

**依据 4 · 作者声明**：[lib/recipes.json:5-32](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipes.json#L5-L32)

真实name标识/套装作者描述。

<details>
<summary>查看原文（28行）</summary>

```text
      "id": "notify-suite",
      "name": "通知全家桶",
      "nameEn": "Notification Suite",
      "description": "任务完成通知 + 声音提醒 + 语音回拨，覆盖桌面到手机。",
      "descriptionEn": "Turn-completion notifications, sound alerts and voice callbacks — desktop to phone.",
      "tags": ["notify", "通知", "提醒", "声音", "notification"],
      "order": 1,
      "plugins": [
        { "name": "pitetow/dsh-notify-on-complete", "order": 1, "required": true },
        { "name": "huguangyu666/dsh-plugin-notify", "order": 2, "required": true },
        { "name": "CAOGGL/dsh-ding", "order": 3, "required": false }
      ],
      "notes": "基础通知先装，增强层（语音/回拨）后装；CAOGGL/dsh-ding 可选（Windows 声音提醒）。"
    },
    {
      "id": "security-audit",
      "name": "安全审计套装",
      "nameEn": "Security Audit Kit",
      "description": "装前静态审计 + 运行中安全守卫 + 遥测脱敏，三层防护。",
      "descriptionEn": "Pre-install static audit, runtime security guard, and telemetry redaction in three layers.",
      "tags": ["security", "audit", "安全", "审计", "扫描", "vetting"],
      "order": 2,
      "plugins": [
        { "name": "BotonJ/dsh-plugin-sentinel", "order": 1, "required": true },
        { "name": "truelove-dreamer/dsh-plugin-vetting", "order": 2, "required": true },
        { "name": "030611/dsh-telemetry-redactor", "order": 3, "required": false }
      ],
      "notes": "sentinel 负责安装前审计；vetting 提供 plugin_scan 运行前检查；redactor 可选（脱敏遥测导出）。"
```

</details>

#### 缺口

- 内置owner/repo命令在目标CLI解析、配方依赖/互斥与安全组合效果未核。
  **影响：**不保证一键环境可用或安全。
  **进一步探讨：**离线核CLI参数契约并审每个候选，不执行安装；用带不同npm/url、循环依赖及互斥的合成配方核计划解释。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何启动和控制使用/维护成本？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt与匹配DSL | 注册两工具/指导段 | peer为0.1系，不代表全部0.2兼容 |
| Cordis/Schemastery及包内JSON可读 | 配置/固定数据加载 | 零外部依赖指检索无服务，不是没有宿主包依赖 |
| 用户进一步核候选/CLI/版本 | 从候选到安装决定 | 工具没有质量/权限/冲突研究 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 核宿主value-schema版本和固定包 | 作者有旧schema修复记录，非本轮启动验收 |
| 搜索 | 描需求，检查category/tag与理由 | score只词重合，空结果不代表没有 |
| 看配方 | list/search/get/apply | 只读有序计划，互斥/可选先人工选 |
| 决策 | 查候选源码/兼容/权限/真实来源 | 不按一条导购就安装全套 |
| 更新 | 审目录来源/描述/日期后重载 | 不认为改JSON立即刷新活数组 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/JSON，无独立检索API | 核DSL/数据与候选可信度 | 安装工时/金额未知 |
| 持续使用 | 本地84条词法评分CPU、工具schema与结果上下文 | 阅读理由、补查候选 | 无额外LLM调用不等宿主总token费用为0，真实成本未知 |
| 失败恢复 | 修JSON/重载、重复检索和上下文资源 | 纠正误荐/过时条目、核配方命令 | 不执行安装故无安装回滚；若下游执行另计恢复未知 |

#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 用需求找候选 | 词法/类标签排序 | 无真实双语描述、非完整生态 |
| 可解释 | 命中字段/权重 | 明细截断不等完整总分推导 |
| 环境初稿 | order/required/exclusive标注 | 非DAG求解或安装 |
| 本地隐私 | 无外发检索/写文件 | 需求和结果仍在宿主模型上下文 |

作者纯逻辑测试能覆盖排序/配方形状，不能单独证明真实需求到可用插件的任务成功率。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-50](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/package.json#L42-L50)

宿主peer。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/863683348/dsh-need-finder.git"
```

**依据 2 · 源码核查**：[lib/index.js:19-30](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L19-L30)

注入/指导段。

<details>
<summary>查看原文（12行）</summary>

```text
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration. */
const Config = z.object({
  /** Default result count when the model omits `limit`. */
  limit: z.number().default(5),
  /** Prompt section order (ascending; persona is 0). */
  sectionOrder: z.number().default(5),
});

/** Prompt section teaching when to use the finder. */
const GUIDE_SECTION_TEXT = "The `plugin_guide` tool is a semantic plugin finder: when the user states a capability or need in their own words — \"notify me when a task finishes\", \"抓取网页内容\", \"多会话管理\" — instead of naming a plugin, call `plugin_guide` to discover matching dsh plugins with reasons and install commands.\n\nThe `recipe` tool installs whole environments instead of single plugins: call `recipe action=list` or `recipe action=search need=<user words>` when the user asks for a bundle/环境/套装/整套; then `recipe action=get id=<id>` for details or `recipe action=apply id=<id>` for the ordered install plan. Do not translate the user's phrasing into plugin names yourself; let the tools match.";
```

</details>

**依据 3 · 源码核查**：[lib/index.js:252-256](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/index.js#L252-L256)

持续提示注册。

```text
  ctx.effect(() => ctx.systemPrompt.section({
    name: "plugin-guide:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "plugin-guide.section()");
```

**依据 4 · 源码核查**：[lib/recipe.js:67-83](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipe.js#L67-L83)

计划无执行。

<details>
<summary>查看原文（17行）</summary>

```text
export function installPlan(recipe) {
  const steps = (recipe.plugins ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
      name: p.name,
      install: "dsh plugin add " + (p.npm ?? p.url ?? p.name),
      required: p.required !== false,
      order: p.order ?? 0,
    }));
  return {
    id: recipe.id,
    name: recipe.name,
    exclusive: recipe.exclusive === true,
    steps,
    notes: recipe.notes ?? "",
  };
```

</details>

#### 缺口

- 与人工分类浏览的总决策时间、误装率与上下文成本无对照。
  **影响：**不量化零成本或效率收益。
  **进一步探讨：**固定需求/候选版本，盲标合适插件、比较阅读/研究步数与错误，不自动安装。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐与可继续探讨入口是什么？

**研究主题：**采用判断、新假设与验证

#### 完整回答

观察。离线词法查找/透明理由和配方初稿适合作为探索入口，但当前数据没有承诺的双语功能描述，固定均匀样本缺选择/适用证据，apply不是安装或求解。先完善数据来源/版本与候选边界，再讨论日常导购，不让“高分”替代研究结论。

由空描述和类别宽词导致近分推导“来源可追溯的需求约束匹配”。每条保存固定版本用途/平台/宿主/权限/未知，先明确硬约束，再做词法候选；缺描述/不兼容/未评估要显式标注，理由保全部评分分项。配方保真实安装目标/固定版本并只输出冲突/依赖说明，用户确认后交宿主安装器。相较现有标签采样，提高可用候选率而非追求分数更复杂。

未实现。反例是需求模糊/元数据陈旧时硬过滤可能排除实际可用候选；因此保unknown分支与候选来源，不能把缺证据当负面结论。最小对照含中文否定/同义无共同词、token计费、跨平台硬约束、无匹配、互斥/循环/自定义安装URL。若误荐/漏荐不降，或维护成本超过人工查目录、明细仍无法解释分数，改进假设不成立；不以模型口头认可代替可用性标注。

#### 证据与依据

**依据 1 · 源码核查**：[lib/match.js:36-52](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L36-L52)

词法盲区基线。

<details>
<summary>查看原文（17行）</summary>

```text
const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "my", "i", "me", "want", "need", "do", "is", "are", "it", "that", "this", "can", "you", "your", "dsh", "plugin", "plugins", "harness", "deepseek", "for", "from", "at", "by", "be", "get", "make", "have", "token", "tokens"]);

/** Extract English search terms from a requirement. */
export function tokenizeEn(need) {
  const words = need.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  return [...new Set(words)];
}

/** Extract Chinese substrings (length >= 2) from a requirement. */
export function tokenizeZh(need) {
  const runs = need.match(/[一-鿿]{2,}/g) ?? [];
  const out = new Set();
  for (const run of runs) {
    for (let i = 0; i + 2 <= run.length; i++) out.add(run.slice(i, i + 2));
    if (run.length >= 3) out.add(run);
  }
  return [...out];
```

</details>

**依据 2 · 源码核查**：[lib/match.js:100-107](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/match.js#L100-L107)

评分解释基线。

```text
  // category fallback: requirement mentions a category keyword
  const cats = CATEGORY_KEYWORDS[plugin.category] ?? [];
  if (cats.some((k) => en.some((t) => k.toLowerCase().includes(t) || (k.length >= 4 && t.includes(k.toLowerCase()))))) {
    add("category", plugin.category, 2, "category:" + plugin.category);
  }
  const unique = [...new Set(hits)].slice(0, 5);
  const uniqueDetails = details.filter((d, i, arr) => arr.findIndex((x) => x.field === d.field && x.term === d.term) === i).slice(0, 8);
  return { score, hits: unique, details: uniqueDetails };
```

**依据 3 · 源码核查**：[lib/recipe.js:67-83](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/recipe.js#L67-L83)

目标/约束计划基线。

<details>
<summary>查看原文（17行）</summary>

```text
export function installPlan(recipe) {
  const steps = (recipe.plugins ?? [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((p) => ({
      name: p.name,
      install: "dsh plugin add " + (p.npm ?? p.url ?? p.name),
      required: p.required !== false,
      order: p.order ?? 0,
    }));
  return {
    id: recipe.id,
    name: recipe.name,
    exclusive: recipe.exclusive === true,
    steps,
    notes: recipe.notes ?? "",
  };
```

</details>

**依据 4 · 源码核查**：[lib/guide-data.json:1-29](https://github.com/863683348/dsh-need-finder/blob/b0f559c2b69b34a640e0d477d8ff0210f3840414/lib/guide-data.json#L1-L29)

来源/空描述基线。

<details>
<summary>查看原文（29行）</summary>

```text
{
 "version": 1,
 "updated": "2026-08-17",
 "count": 84,
 "plugins": [
  {
   "id": "030611/dsh-telemetry-redactor",
   "name": "030611/dsh-telemetry-redactor",
   "url": "https://github.com/030611/dsh-telemetry-redactor",
   "category": "dev",
   "descEn": "030611/dsh-telemetry-redactor",
   "descZh": "",
   "tags": [
    "dev",
    "test",
    "audit",
    "security",
    "lint",
    "ci",
    "开发",
    "测试",
    "审计",
    "安全",
    "检查",
    "诊断",
    "telemetry",
    "redactor"
   ]
  },
```

</details>

#### 缺口

- 可追溯约束匹配/版本配方方案未实现。
  **影响：**不计现有推荐质量或创新优势。
  **进一步探讨：**用固定人工标签需求集比较误漏荐/解释完整性和维护成本，不做真实安装。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
