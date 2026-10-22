# dsh-recipe

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[67f2d4c](https://github.com/863683348/dsh-recipe/tree/67f2d4c662954ccd25c771fa0e0a99433cf3b530)

<!-- BEGIN META -->
[![npm 30d 123](https://img.shields.io/static/v1?label=npm+30d&message=123&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-recipe) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-recipe)
<!-- END META -->

> **实现功能**：把本地场景配方展开成去重插件清单和安装命令，支持关键词搜索与多配方组合。

> **核心亮点**：把固定场景清单接入模型工具，减少整理命令步骤。详见[Q01](#research-q01)。

> **风险与缺陷**：config被输出剥离，合并不报冲突，命令缺profile/版本与失败恢复，不能等同可复现环境。详见[Q03](#research-q03)。

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
  - [Q01 · 配方给谁用，apply是否已经安装整套环境？](#detail-section-11)
  - [Q02 · 检索和合并实际采用什么规则？](#detail-section-12)
  - [Q03 · 命令和配置有哪些实际缺口？](#detail-section-13)
  - [Q04 · 工程证据和使用成本怎样判断？](#detail-section-14)
  - [Q05 · 什么条件适合试用，如何继续研究？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：按业务场景整理多插件候选，减少逐个找目录。详见[Q01](#research-q01)。

手工目录清单与安装命令；当前不是事务性环境管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 场景检索 | 中英文关键词找配方 | 本地静态匹配 |
| 展开/组合 | 首见去重清单 | 不处理配置冲突 |
| 命令草案 | 生成add序列 | 不执行/不回滚 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| tools/systemPrompt | 注册与引导 | 宿主ABI需匹配 |
| 两份本地JSON | 场景和目录 | 损坏/过期影响结果 |
| 外部CLI与组件 | 真安装 | 另核profile/版本 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 搜索/列配方 | 模型/用户 | 场景ID合适 |
| 展开/组合 | recipe | 无未知项/冲突待核 |
| 审核命令 | 用户 | profile/版本/配置明确 |
| 分步执行检查 | 用户/外部工具 | 每组件结果可核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地配方插件 | 核目标profile/组件 | 本身本地计算；逐组件profile/配置核查工时未知 |
| 持续使用 | JSON读取/字符串计算 | 维护固定目录与组合 | 无额外外部服务请求；宿主模型费用及目录维护时间未知 |
| 失败恢复 | 已安装外部组件 | 人工核失败与逐项卸载 | 执行安装清单后无事务恢复；外部组件卸载/核对成本未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 场景选型 | 中英文关键词 | 非语义/兼容推理 |
| 合并清单 | 首见去重保序 | 配置冲突静默丢后项 |
| 安装草案 | 命令串 | 不执行/不回滚/无配置 |

> **思考**：config被输出剥离，合并不报冲突，命令缺profile/版本与失败恢复，不能等同可复现环境。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把固定场景清单接入模型工具，减少整理命令步骤。详见[Q01](#research-q01)。

把固定场景清单接入模型工具，减少整理命令步骤。详见[Q01](#research-q01)。

纯逻辑直接测试可复用，固定样例不能证明外部组件契约。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

config被输出剥离，合并不报冲突，命令缺profile/版本与失败恢复，不能等同可复现环境。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为选型草案试用，补齐profile/版本/配置再执行。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

搜索/展开逻辑可查，apply不执行安装，可选配置没有进入工具输出或命令。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/recipe.js、lib/recipe-data.json、test/recipe.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取纯逻辑和工具注册、README、package与生产纯逻辑测试，检查内置配方样例；不逐个审计所推荐插件。
- 下一步：从配置冲突和安装中途失败反例核计划/收据方向。

**分析版本**

- **仓库**：[863683348/dsh-recipe](https://github.com/863683348/dsh-recipe)
- **版本号**：0.1.0（[固定提交 67f2d4c](https://github.com/863683348/dsh-recipe/tree/67f2d4c662954ccd25c771fa0e0a99433cf3b530)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究可解释版本/配置冲突计划与分步收据，相对首胜拼串比较误安装和恢复成本，尚未验证。详见[Q05](#research-q05)。

从配置冲突和安装中途失败反例核计划/收据方向。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 124 | — | — | 890 |
| .js | source | 2 | 324 | 266 | 39 | — |
| .mjs | test | 1 | 77 | 66 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-recipe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-recipe/issues?q=is%3Aissue+created%3A2026-09-22T06%3A54%3A02.645Z..2026-10-22T06%3A54%3A02.645Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-recipe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A54%3A02.645Z..2026-10-22T06%3A54%3A02.645Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**场景配方如何生成可核查清单，与真实安装、配置和环境兼容之间有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 配方给谁用，apply是否已经安装整套环境？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向想按浏览、通知、写作等场景挑一组插件的用户。内置十种配方和本地目录，经模型工具列出、搜索、展开、组合后输出有序清单和命令。它减少查目录和重复整理命令，不能替用户证明这些插件同装兼容或业务效果。apply只是构造对象返回，没有执行安装，没有调用网络或子进程；真正写入发生在用户或另一个工具执行命令时。

README将“可选配置”和DAG前置作为设计方向，当前只按数组顺序去重，不能解释为依赖求解器或可复现环境管理器。基线是手工选清单和拼命令，贡献是把固定场景索引接进DSH工具，不是新的包管理协议。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/README.md#L3-L9)

场景主张。

```text
把 dsh 插件打包成**场景配方**：一次说清"我要一套 XX 环境"，而不是一个一个装插件。V2EX 有人做过"插件组合索引"但没做成可安装插件——本插件把 recipe 做进 DSH 本体。

## 为什么需要它

- 用户要的是**环境**（"浏览器开发环境"、"学术写作套装"、"通知全家桶"），不是单个插件。
- `recipe` 工具：`list`（浏览全部配方）→ `search`（按需求匹配）→ `apply`（展开配方：有序插件 + 安装命令）→ `compose`（多个配方合并去重）。
- recipe 格式即"插件清单 + 顺序 + 可选配置"（JSON），纯本地、零网络、零依赖。
```

**依据 2 · 作者声明**：[README.md:17-31](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/README.md#L17-L31)

内置配方。

<details>
<summary>查看原文（15行）</summary>

```text
## 内置配方（10 个）

| id | 名称 | 插件数 |
| --- | --- | --- |
| `browser-dev-env` | 浏览器开发环境 | 4 |
| `notification-suite` | 通知全家桶 | 6 |
| `academic-writing` | 学术写作套装 | 5 |
| `mobile-remote` | 移动远程控制 | 3 |
| `security-hardening` | 安全加固套装 | 4 |
| `memory-kit` | 记忆持久化套装 | 5 |
| `fun-break` | 娱乐休闲 | 4 |
| `model-routing` | 模型路由优化 | 5 |
| `workflow-automation` | 工作流自动化 | 5 |
| `market-manager` | 插件市场管理 | 5 |

```

</details>

**依据 3 · 源码核查**：[lib/index.js:150-183](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L150-L183)

各action只返回对象。

<details>
<summary>查看原文（34行）</summary>

```text
      } else if (action === "search") {
        const found = searchRecipes(String(args.need ?? ""), recipes);
        recipesOut = found.map(({ recipe }) => summaryOf(recipe, plugins));
      } else if (action === "apply") {
        const recipe = recipes.find((r) => r.id === args.recipeId)
          ?? (args.need ? searchRecipes(String(args.need), recipes)[0]?.recipe : undefined);
        if (!recipe) throw new Error("recipe: no recipe found for " + (args.recipeId ?? args.need));
        pluginsOut = expandRecipe(recipe, plugins);
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = [summaryOf(recipe, plugins)];
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else if (action === "compose") {
        const ids = String(args.recipeId ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 0) throw new Error('recipe: "recipeId" is required for compose (comma-separated ids)');
        const composed = composeRecipes(ids, recipes, plugins);
        if (composed.missingIds.length > 0) {
          throw new Error("recipe: unknown recipe id(s): " + composed.missingIds.join(", "));
        }
        pluginsOut = composed.plugins;
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = composed.recipes.map((r) => summaryOf(r, plugins));
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else {
        throw new Error('recipe: unknown action "' + action + '"');
      }
      return { action, recipes: recipesOut, plugins: [], commands, oneLine: commands.join(" && ") };
    },
    presentCall: (args) => ({
      card: "generic",
      title: "Recipe: " + (args.action ?? "search") + (args.recipeId ? " " + args.recipeId : args.need ? " " + String(args.need).slice(0, 40) : ""),
      kind: "other",
      rawInput: args,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索和合并实际采用什么规则？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

启动同步读取包内两份JSON，依赖tools/systemPrompt注册recipe工具和引导段，不注册Skill或用户命令。搜索将英文至少三字符词及中文二元组/整段提取成集合，在名称命中加三、描述标签命中加一，只保正分并按id破同分，没有语义模型、联网更新或依赖兼容推理。apply优先确切id，否则取need搜索第一项，错误id配need会回退而非显式拒绝，需检查返回id。

展开按插件名称精确匹配目录，首见保序并保留未知项标记；组合按给定配方顺序同名首见胜出。缺失配方ID最终整体报错，未知插件则保留清单但安装命令过滤掉。依赖Cordis4、tools/systemPrompt rc6、schemastery3，JSON字段在加载时无完整运行期校验，手改损坏可导致启动或搜索失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/recipe.js:13-37](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L13-L37)

本地加载和分词。

<details>
<summary>查看原文（25行）</summary>

```text
export function loadPlugins() {
  const parsed = JSON.parse(readFileSync(new URL("./plugins.json", import.meta.url), "utf8"));
  return parsed.plugins ?? [];
}

/** Load the bundled recipes. */
export function loadRecipes() {
  const parsed = JSON.parse(readFileSync(new URL("./recipe-data.json", import.meta.url), "utf8"));
  return parsed.recipes ?? [];
}

const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "my", "i", "me", "want", "need", "do", "is", "are", "it", "that", "this", "dsh", "plugin", "plugins", "harness", "deepseek"]);

function tokensOf(text) {
  const out = new Set();
  const lower = String(text).toLowerCase();
  for (const w of lower.split(/[^a-z0-9]+/)) {
    if (w.length >= 3 && !STOP.has(w)) out.add(w);
  }
  const runs = lower.match(/[\u4e00-\u9fff]{2,}/g) ?? [];
  for (const run of runs) {
    for (let i = 0; i + 2 <= run.length; i++) out.add(run.slice(i, i + 2));
    if (run.length >= 3) out.add(run);
  }
  return [...out];
```

</details>

**依据 2 · 源码核查**：[lib/recipe.js:41-73](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L41-L73)

评分排序与精确解析。

<details>
<summary>查看原文（33行）</summary>

```text
export function scoreRecipe(recipe, need) {
  const terms = tokensOf(need);
  if (terms.length === 0) return { score: 0, hits: [] };
  let score = 0;
  const hits = [];
  const nameText = (recipe.name + " " + recipe.nameZh).toLowerCase();
  const bodyText = (recipe.description + " " + recipe.descriptionZh + " " + recipe.tags.join(" ")).toLowerCase();
  for (const t of terms) {
    if (nameText.includes(t)) {
      score += 3;
      hits.push(t);
    } else if (bodyText.includes(t)) {
      score += 1;
      hits.push(t);
    }
  }
  return { score, hits: [...new Set(hits)].slice(0, 5) };
}

/** Search recipes by a natural-language need. */
export function searchRecipes(need, recipes = loadRecipes()) {
  if (typeof need !== "string" || need.trim().length === 0) {
    throw new Error('recipe: "need" must be a non-empty string');
  }
  return recipes
    .map((recipe) => ({ recipe, ...scoreRecipe(recipe, need) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id));
}

/** Resolve one plugin entry by name; returns undefined when unknown. */
export function resolvePlugin(name, plugins = loadPlugins()) {
  return plugins.find((p) => p.name === name);
```

</details>

**依据 3 · 源码核查**：[lib/recipe.js:80-129](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L80-L129)

展开和组合。

<details>
<summary>查看原文（50行）</summary>

```text
export function expandRecipe(recipe, plugins = loadPlugins()) {
  const seen = new Set();
  const list = [];
  for (const item of recipe.plugins ?? []) {
    const name = item.name;
    if (seen.has(name)) continue;
    seen.add(name);
    const info = resolvePlugin(name, plugins);
    list.push({
      name,
      url: info?.url ?? null,
      category: info?.category ?? "unknown",
      config: item.config ?? undefined,
      known: info !== undefined,
    });
  }
  return list;
}

/** Build the install command sequence for an expanded recipe. */
export function installSequence(expanded) {
  const commands = expanded
    .filter((p) => p.known)
    .map((p) => "dsh plugin add " + (p.url ?? p.name));
  return {
    commands,
    oneLine: commands.join(" && "),
    count: commands.length,
  };
}

/** Compose several recipes into one deduped plugin list (first-seen order). */
export function composeRecipes(ids, recipes = loadRecipes(), plugins = loadPlugins()) {
  const known = new Map(recipes.map((r) => [r.id, r]));
  const seen = new Set();
  const list = [];
  const missingIds = [];
  for (const id of ids) {
    const recipe = known.get(id);
    if (!recipe) {
      missingIds.push(id);
      continue;
    }
    for (const item of expandRecipe(recipe, plugins)) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);
      list.push(item);
    }
  }
  return { recipes: ids.map((id) => known.get(id)).filter(Boolean), plugins: list, missingIds };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:23-33](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L23-L33)

宿主注入。

<details>
<summary>查看原文（11行）</summary>

```text

/** Services this plugin must resolve before it applies. */
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration. */
const Config = z.object({
  /** Prompt section order (ascending; persona is 0). */
  sectionOrder: z.number().default(5),
});

const RECIPE_SECTION_TEXT = 'The `recipe` tool bundles dsh plugins into ready-made environments ("插件界的 dotfiles"): when the user asks for a whole setup or scenario — "配一套浏览器开发环境", "学术写作套装", "通知全家桶" — call `recipe` (action `search` or `apply`) instead of installing plugins one by one. It returns the ordered plugin list and the exact `dsh plugin add` commands.';
```

</details>

**依据 5 · 源码核查**：[lib/index.js:158-179](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L158-L179)

apply回退/compose拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = [summaryOf(recipe, plugins)];
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else if (action === "compose") {
        const ids = String(args.recipeId ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 0) throw new Error('recipe: "recipeId" is required for compose (comma-separated ids)');
        const composed = composeRecipes(ids, recipes, plugins);
        if (composed.missingIds.length > 0) {
          throw new Error("recipe: unknown recipe id(s): " + composed.missingIds.join(", "));
        }
        pluginsOut = composed.plugins;
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = composed.recipes.map((r) => summaryOf(r, plugins));
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else {
        throw new Error('recipe: unknown action "' + action + '"');
      }
      return { action, recipes: recipesOut, plugins: [], commands, oneLine: commands.join(" && ") };
    },
    presentCall: (args) => ({
```

</details>

**依据 6 · 源码核查**：[package.json:19-24](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/package.json#L19-L24)

peer契约。

```text
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  }
}
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 命令和配置有哪些实际缺口？

**研究主题：**缺陷与关键质疑

#### 完整回答

installSequence只拼dsh plugin add加目录URL/名称，既不指定profile，也不固定组件版本或校验依赖，不传任何config。工具输出还将展开结果映射为name/url/category/known，连config也不交给调用者。因而可选配置目前存在纯逻辑数据结构，却没有落到安装输出；数组顺序仅保证命令顺序，失败时&&停止后续，但之前装好的插件没有回滚。

同名插件跨配方出现时直接丢弃后项，没有比较配置或报告冲突。未知插件有MISSING提示且不生成命令，属于诚实降级，但整套完成不能按命令数判断。命令未做shell参数引用；当前包内目录是可信静态输入，这不是已证实外部攻击入口，不过若以后接受外部配方/目录必须先规范化argv而非直接拼串。安全配方这个名称本身也不是安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/recipe.js:88-108](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L88-L108)

config仅结构保留，命令无配置/引用。

<details>
<summary>查看原文（21行）</summary>

```text
    list.push({
      name,
      url: info?.url ?? null,
      category: info?.category ?? "unknown",
      config: item.config ?? undefined,
      known: info !== undefined,
    });
  }
  return list;
}

/** Build the install command sequence for an expanded recipe. */
export function installSequence(expanded) {
  const commands = expanded
    .filter((p) => p.known)
    .map((p) => "dsh plugin add " + (p.url ?? p.name));
  return {
    commands,
    oneLine: commands.join(" && "),
    count: commands.length,
  };
```

</details>

**依据 2 · 源码核查**：[lib/recipe.js:123-129](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L123-L129)

同名首胜无冲突报告。

```text
    for (const item of expandRecipe(recipe, plugins)) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);
      list.push(item);
    }
  }
  return { recipes: ids.map((id) => known.get(id)).filter(Boolean), plugins: list, missingIds };
```

**依据 3 · 源码核查**：[lib/index.js:137-145](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L137-L145)

未知项提示。

```text
          lines.push("", "install sequence:", ...value.commands.map((c) => "  " + c));
          lines.push("", "one line:", "  " + value.oneLine);
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const action = args.action ?? "search";
      let recipesOut = [];
```

**依据 4 · 源码核查**：[lib/index.js:162-179](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L162-L179)

公开返回剥掉config。

<details>
<summary>查看原文（18行）</summary>

```text
      } else if (action === "compose") {
        const ids = String(args.recipeId ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 0) throw new Error('recipe: "recipeId" is required for compose (comma-separated ids)');
        const composed = composeRecipes(ids, recipes, plugins);
        if (composed.missingIds.length > 0) {
          throw new Error("recipe: unknown recipe id(s): " + composed.missingIds.join(", "));
        }
        pluginsOut = composed.plugins;
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = composed.recipes.map((r) => summaryOf(r, plugins));
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else {
        throw new Error('recipe: unknown action "' + action + '"');
      }
      return { action, recipes: recipesOut, plugins: [], commands, oneLine: commands.join(" && ") };
    },
    presentCall: (args) => ({
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程证据和使用成本怎样判断？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

纯逻辑与宿主注册分开，node:test直接导入生产recipe.js，覆盖内置数据存在、目录解析、中英文搜索、空查询、展开去重、组合缺ID及命令结构。它们能守住当前固定样例的格式与组合规则，不覆盖宿主输出契约、实际组件可安装性、配置冲突和未来目录变更；本次阅读未执行目标测试。

首次安装插件及对照目标profile/清单，工具本身仅本地文件/字符串计算，不额外请求模型或外部服务；宿主模型选择调用本工具的原有费用另计。持续成本主要是维护静态目录/场景组合与检查发布变化，不能将目录known当当前可访问。执行清单后失败的恢复成本来自逐组件检查和卸载，插件本身无事务/恢复收据。没有对照数据量化节时或成功率。

#### 证据与依据

**依据 1 · 源码核查**：[test/recipe.test.mjs:1-77](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/test/recipe.test.mjs#L1-L77)

生产纯逻辑导入及样例断言。

<details>
<summary>查看原文（77行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  composeRecipes,
  expandRecipe,
  installSequence,
  loadPlugins,
  loadRecipes,
  resolvePlugin,
  searchRecipes,
} from "../lib/recipe.js";

const recipes = loadRecipes();
const plugins = loadPlugins();

test("bundled data is well-formed", () => {
  assert.ok(recipes.length >= 8, ">= 8 recipes, got " + recipes.length);
  assert.ok(plugins.length >= 50, ">= 50 plugins, got " + plugins.length);
  for (const r of recipes) {
    assert.ok(r.id && r.name && r.description, "recipe fields: " + r.id);
    assert.ok(Array.isArray(r.plugins) && r.plugins.length > 0, "recipe has plugins: " + r.id);
  }
});

test("every recipe plugin resolves in the directory", () => {
  for (const r of recipes) {
    for (const item of r.plugins) {
      const found = resolvePlugin(item.name, plugins);
      assert.ok(found, "plugin resolves: " + item.name + " (in recipe " + r.id + ")");
    }
  }
});

test("searchRecipes matches Chinese needs", () => {
  const found = searchRecipes("配一套通知提醒环境", recipes);
  assert.ok(found.length > 0, "got matches");
  assert.equal(found[0].recipe.id, "notification-suite");
});

test("searchRecipes matches English needs", () => {
  const found = searchRecipes("browser dev environment for crawling", recipes);
  assert.ok(found.length > 0);
  assert.equal(found[0].recipe.id, "browser-dev-env");
});

test("searchRecipes rejects empty need", () => {
  assert.throws(() => searchRecipes("  ", recipes), /non-empty/);
});

test("expandRecipe dedups and preserves order", () => {
  const recipe = recipes.find((r) => r.id === "browser-dev-env");
  const expanded = expandRecipe(recipe, plugins);
  // the recipe intentionally lists dsh-browser twice
  const names = expanded.map((p) => p.name);
  assert.equal(new Set(names).size, names.length, "no duplicates");
  assert.equal(expanded.filter((p) => p.known).length, expanded.length, "all known");
});

test("installSequence builds dsh plugin add commands", () => {
  const recipe = recipes.find((r) => r.id === "memory-kit");
  const seq = installSequence(expandRecipe(recipe, plugins));
  assert.ok(seq.commands.length >= 3);
  for (const c of seq.commands) assert.ok(c.startsWith("dsh plugin add "), c);
  assert.equal(seq.oneLine.split(" && ").length, seq.count);
});

test("composeRecipes merges and dedups across recipes", () => {
  const composed = composeRecipes(["memory-kit", "academic-writing"], recipes, plugins);
  const names = composed.plugins.map((p) => p.name);
  assert.equal(new Set(names).size, names.length, "no duplicates across recipes");
  assert.ok(names.includes("863683348/dsh-plugin-focus"), "shared plugin appears once");
});

test("composeRecipes reports missing ids", () => {
  const composed = composeRecipes(["memory-kit", "no-such-recipe"], recipes, plugins);
  assert.deepEqual(composed.missingIds, ["no-such-recipe"]);
});
```

</details>

**依据 2 · 源码核查**：[lib/index.js:53-56](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L53-L56)

启动时固定加载。

```text
function apply(ctx, config) {
  const recipes = loadRecipes();
  const plugins = loadPlugins();

```

**依据 3 · 源码核查**：[lib/recipe.js:100-108](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L100-L108)

无事务执行。

```text
export function installSequence(expanded) {
  const commands = expanded
    .filter((p) => p.known)
    .map((p) => "dsh plugin add " + (p.url ?? p.name));
  return {
    commands,
    oneLine: commands.join(" && "),
    count: commands.length,
  };
```

#### 缺口

- 固定清单中各组件当前可安装性、同装契约及场景实际完成率未由配方数据证明
  **影响：**只能推荐作为选型/命令草案，不能保证整套环境落地
  **进一步探讨：**以固定组件版本和目标profile逐项核依赖与冲突，比较手工清单的遗漏和恢复工时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件适合试用，如何继续研究？

**研究主题：**新假设与验证、采用判断

#### 完整回答

可作为场景选型草案试用，先看返回配方ID及MISSING项，再逐组件核用途/权限/依赖，给命令明确profile、版本与必要配置后由读者决定执行。要求一键可复现、配置原样恢复或安全加固保证的环境不适合直接按oneLine运行。价值在整理而非自动安装可靠性。

可继续研究“可解释环境计划”——在同名首胜基线加入显式版本、config冲突、依赖约束与分步收据，并把展示、确认、执行分离。反例应包含错误id附need、未知插件、两配方同名不同config、第二条安装失败、profile错误和目录URL变化；比较未提示冲突、误安装目标、恢复步骤及任务完成率。该方向尚未验证，不把DAG概念当当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:158-179](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/index.js#L158-L179)

当前决策/返回基线。

<details>
<summary>查看原文（22行）</summary>

```text
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = [summaryOf(recipe, plugins)];
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else if (action === "compose") {
        const ids = String(args.recipeId ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        if (ids.length === 0) throw new Error('recipe: "recipeId" is required for compose (comma-separated ids)');
        const composed = composeRecipes(ids, recipes, plugins);
        if (composed.missingIds.length > 0) {
          throw new Error("recipe: unknown recipe id(s): " + composed.missingIds.join(", "));
        }
        pluginsOut = composed.plugins;
        const seq = installSequence(pluginsOut);
        commands = seq.commands;
        recipesOut = composed.recipes.map((r) => summaryOf(r, plugins));
        return { action, recipes: recipesOut, plugins: pluginsOut.map((p) => ({ name: p.name, url: p.url, category: p.category, known: p.known })), commands, oneLine: seq.oneLine };
      } else {
        throw new Error('recipe: unknown action "' + action + '"');
      }
      return { action, recipes: recipesOut, plugins: [], commands, oneLine: commands.join(" && ") };
    },
    presentCall: (args) => ({
```

</details>

**依据 2 · 源码核查**：[lib/recipe.js:100-129](https://github.com/863683348/dsh-recipe/blob/67f2d4c662954ccd25c771fa0e0a99433cf3b530/lib/recipe.js#L100-L129)

命令与首胜基线。

<details>
<summary>查看原文（30行）</summary>

```text
export function installSequence(expanded) {
  const commands = expanded
    .filter((p) => p.known)
    .map((p) => "dsh plugin add " + (p.url ?? p.name));
  return {
    commands,
    oneLine: commands.join(" && "),
    count: commands.length,
  };
}

/** Compose several recipes into one deduped plugin list (first-seen order). */
export function composeRecipes(ids, recipes = loadRecipes(), plugins = loadPlugins()) {
  const known = new Map(recipes.map((r) => [r.id, r]));
  const seen = new Set();
  const list = [];
  const missingIds = [];
  for (const id of ids) {
    const recipe = known.get(id);
    if (!recipe) {
      missingIds.push(id);
      continue;
    }
    for (const item of expandRecipe(recipe, plugins)) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);
      list.push(item);
    }
  }
  return { recipes: ids.map((id) => known.get(id)).filter(Boolean), plugins: list, missingIds };
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
