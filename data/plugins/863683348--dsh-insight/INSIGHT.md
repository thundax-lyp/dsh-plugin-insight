# dsh-insight

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[6fcb8fc](https://github.com/863683348/dsh-insight/tree/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-insight) [![npm 30d 821](https://img.shields.io/static/v1?label=npm+30d&message=821&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-insight)
<!-- END META -->

> **功能**：用需求匹配、环境配方、健康评分、静态安全扫描与统一 verdict 辅助选择 DSH 插件。

> **亮点**：相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。 详见[Q03](#research-q03)。

> **主要限制**：核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-insight，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-insight 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-insight 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-insight 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-insight 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-insight 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-insight 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-insight？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。 详见[Q01](#research-q01)。

面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| plugin_guide | 按需求匹配插件候选 | 依赖内置数据覆盖和新鲜度 |
| recipe | 给出环境组合配方 | 不能证明目标环境可运行 |
| plugin_rank | 按规则生成健康排序 | 分数不是实际可靠率 |
| plugin_audit | 静态扫描本地 checkout | 模式规则会误报/漏报 |
| plugin_verdict | 聚合需求、健康和审计 | 结论不授权安装，需人工复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt | 必需 | 注册五工具和使用引导 | 缺失则无模型入口 |
| 插件数据与规则 | 必需 | 匹配、配方和评分 | 陈旧会直接污染 verdict |
| 只读本地目录 | audit 才需要 | 扫描文件和清单 | 不可读时安全判断降级 |
| 本地存储 | 持续使用需要 | 保存审计/决策记录 | 损坏时历史不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 描述需求 | 用户给场景和约束 | plugin_guide 返回候选及理由 |
| 补环境 | 调用 recipe 明确组合 | 列依赖和安装顺序 |
| 审计 | 对固定 checkout 跑 plugin_audit/rank | 保留分项而非只看总分 |
| 决策 | plugin_verdict 聚合，人再复核 | 只输出研究建议，不自动安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部费；需本地数据/存储 | 理解规则并校验数据版本 | 规则校准工时未知 |
| 每次评估 | 本地文件扫描和索引资源 | 审阅分项证据与目标源码 | 按一份可追溯评估计量 |
| 错误恢复 | 无自动回滚；错误建议可能浪费试装成本 | 修规则/数据并独立复核 | 重复同一 verdict 不能消除偏差 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 候选筛选 | 源码注册需求匹配与配方工具 | 真实召回/排序质量 |
| 静态安全 | 规则扫描和审计报告可见 | 运行时数据流与权限风险 |
| 统一判断 | verdict 聚合多分项 | 标签校准和用户决策改善 |

> **思考**：核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。 详见[Q03](#research-q03)。

match、recipe、scoring、audit/security、storage 和 verdict 分模块，工具接口职责清晰，可借鉴“分项证据先出、最终判断后聚合”；但单仓库维护规则和数据会形成集中漂移点。复用时应让每个分项输出来源、版本和不可判定状态。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。只有在目标插件数据版本匹配、静态扫描范围明确、人工复核关键权限/副作用后，才可把 verdict 作为输入之一；任何目录不可读、规则未知或结果只给总分时都回到独立源码审查。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了需求匹配、配方、健康排序、静态审计和统一 verdict 五个工具及其提示接线；本轮未对插件样本运行这些规则或与专家结论对照，因此只确认聚合机制，不能确认内置数据新鲜度、扫描覆盖或 verdict 校准程度。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：固定 30 个含已知安全/维护问题的插件快照，冻结数据库版本后运行五工具；两名审查者独立给证据等级与结论，比较 verdict 的严重漏报、过期数据影响和从总分追溯到文件的完整性。

**分析版本**

- **仓库**：[863683348/dsh-insight](https://github.com/863683348/dsh-insight)
- **版本号**：0.1.0（[固定提交 6fcb8fc](https://github.com/863683348/dsh-insight/tree/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把 verdict 改成可追溯证据图，并在数据过期或扫描未覆盖时拒绝给出 install，可降低误导。最小实验让两名审查者对 30 个插件做盲审，与现 verdict/证据图 verdict 比较一致率、严重漏报和复核时间；若可追溯版不降低高风险误判则否定。 详见[Q08](#research-q08)。

固定 30 个含已知安全/维护问题的插件快照，冻结数据库版本后运行五工具；两名审查者独立给证据等级与结论，比较 verdict 的严重漏报、过期数据影响和从总分追溯到文件的完整性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 103 | — | — | 875 |
| .js | source | 9 | 1549 | 1233 | 236 | — |
| .mjs | source | 1 | 32 | 24 | 4 | — |
| .mjs | test | 5 | 367 | 309 | 12 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/863683348/dsh-insight/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-insight 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-insight，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

面对插件目录的用户需要回答“哪些值得装、如何配、是否安全”；基线是逐个读 README、源码和安装说明。合格结果是候选能追溯到数据库/源码，安全扫描与需求匹配分开呈现，最终 verdict 明确证据强弱且不会自动安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/README.md#L1-L38)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（38行）</summary>

````text
# dsh-insight — 插件评测中心 (Plugin Insight Center)

**一个插件，一个答案："哪些值得装"。** 把需求推荐、质量评分、安全审计、环境配方合并成同一个决策面 —— 装 `dsh-insight` 一个包，用户就得到完整结论，而不是在三个工具间自己拼答案。

## 为什么是合并（而不是 3 个插件）

"没有评分、没有审计、没有'哪些值得装'的答案" —— 这是**同一个决策的三个维度**（安全吗 → 好不好 → 适合我吗）。拆成多个插件 = 用户自己拼答案；合一个 = 一次调用拿结论。

## 五个工具

| 工具 | 回答的问题 |
| --- | --- |
| `plugin_guide` | 用户说需求 → 推荐最匹配的插件（84 个精选 / 14 分类，带理由与安装命令） |
| `recipe` | 用户要整套环境 → 8 个社区配方（通知全家桶、安全审计套装...）有序安装计划 |
| `plugin_rank` | "哪些值得装" → 健康分排行榜（maintenance/docs/npm/ecosystem，0-100） |
| `plugin_audit` | "这个安全吗" → 本地目录静态安全扫描（外泄/凭据/混淆/持久化启发式） |
| `plugin_verdict` | **"这个值得装吗"** → 综合评分+扫描+需求匹配，输出 install / caution / research / avoid |

## 安装

```bash
dsh plugin --profile <profile> add dsh-insight
```

## 用法示例

- "我想抓取网页" → `plugin_guide` (need="抓取网页")
- "手机远程访问" → `recipe` (search need="手机远程") → apply
- "哪些插件值得装" → `plugin_rank` (sort=score)
- "这个仓库安全吗" → `plugin_audit` (dir=/path/to/checkout)
- "dsh-browser 值得装吗，我用来抓网页" → `plugin_verdict` (repo + need + dir 可选)

## 设计

- **纯逻辑层零依赖**：`match.js`、`recipe.js`、`scoring.js`、`security.js`、`verdict.js` 全部可独立单测。
- **评分模型**：0-100 = maintenance 30 + docs 25 + npm 30 + ecosystem 15；grade A-F；安全高危 flag 封顶 D。
- **数据**：`lib/guide-data.json`（精选目录）+ `data/catalog.json`（700+ 插件评分数据）。
- **安全**：插件本身零网络请求；`plugin_audit` 只读模型指定的本地目录做静态扫描（信任边界：只扫可信源码）。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-insight 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

五个工具分别调用本地插件数据、配方、评分、scanner/security 与 verdict 模块；plugin_verdict 汇合需求匹配、健康分和可选本地目录静态扫描，输出 install/caution/research/avoid 类判断。system prompt 提醒模型把自然语言需求交给工具匹配而非自行猜插件名。结果和审计历史写本地存储。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:79-347](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js#L79-L347)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（269行）</summary>

```text
 * Register all insight tools and the guidance section.
 * @param ctx - registrant context carrying tools/systemPrompt.
 * @param config - validated plugin configuration.
 */
function apply(ctx, config) {
  const plugins = loadPlugins();
  const storage = storageFor(config);
  const records = storage.loadCatalog();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching plugins from a curated directory (84 plugins / 14 categories), each with a reason and install command. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页'.",
    parameters: {
      need: { type: "string", required: true, description: "The user's requirement in natural language (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-10)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: { type: "string", required: true },
          count: { type: "integer", required: true },
          results: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                category: { type: "string", required: true },
                descEn: { type: "string", required: true },
                descZh: { type: "string", required: true },
                score: { type: "integer", required: true },
                reasons: { type: "array", required: true, items: { type: "string" } },
                install: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Matched " + value.count + " plugin(s) for: " + value.need, ""];
        for (const r of value.results) {
          lines.push("## " + r.name + " [" + r.category + "] (score " + r.score + ")");
          lines.push(r.descEn || r.descZh);
          lines.push("reasons: " + r.reasons.join(", "));
          lines.push("install: " + r.install);
          lines.push("");
        }
        if (value.count === 0) lines.push("No match in the curated directory — try plugin_rank or search the dsh-plugin topic on GitHub.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit);
      return { need: args.need, count: results.length, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Find plugins for: " + String(args.need).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "recipe",
    description: "Bundle installer for DeepSeek Harness (插件界的 dotfiles): list, search, inspect, or get the ordered install plan for community plugin recipes (通知全家桶, 安全审计套装, 移动远程套装, ...). Use when the user wants a whole environment/setup/套装/环境 rather than a single plugin.",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "search", "get", "apply"], description: "list / search / get / apply." },
      need: { type: "string", description: "Natural-language need, required for action=search." },
      id: { type: "string", description: "Recipe id, required for get/apply." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          action: { type: "string", required: true },
          count: { type: "integer", required: true },
          recipes: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                id: { type: "string", required: true },
                name: { type: "string", required: true },
                nameEn: { type: "string", required: true },
                description: { type: "string", required: true },
                descriptionEn: { type: "string", required: true },
                exclusive: { type: "boolean", required: true },
                steps: {
                  type: "array", required: true,
                  items: {
                    type: "object", additionalProperties: false, required: true,
                    properties: {
                      name: { type: "string", required: true },
                      install: { type: "string", required: true },
                      required: { type: "boolean", required: true },
                      order: { type: "integer", required: true },
                    },
                  },
                },
                notes: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result(s)", ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({ id: rc.id, name: rc.name, nameEn: rc.nameEn, description: rc.description, descriptionEn: rc.descriptionEn, exclusive: rc.exclusive, notes: rc.notes, plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })) }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const recipes = loadRecipes();
      const { action } = args;
      if ((action === "get" || action === "apply") && !recipes.some((r) => r.id === args.id)) {
        throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let list = recipes;
      if (action === "search") list = searchRecipes(args.need ?? "", recipes).map((s) => s.recipe);
      const out = list.map((r) => ({ id: r.id, name: r.name, nameEn: r.nameEn, description: r.description, descriptionEn: r.descriptionEn, exclusive: r.exclusive === true, steps: installPlan(r).steps, notes: r.notes ?? "" }));
      return { action, count: out.length, recipes: out };
    },
    presentCall: (args) => ({ card: "generic", title: "Recipe " + String(args.action), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_rank",
    description: "Leaderboard over the curated plugin catalog by health score (maintenance/docs/npm/ecosystem), stars, newest, or name, with optional category filter. Answer to '哪些插件值得装' at a glance.",
    parameters: {
      sort: { type: "string", enum: ["score", "stars", "new", "name"], description: "Sort key (default score)." },
      category: { type: "string", description: "Optional category filter, e.g. 'tools' or 'ui'." },
      limit: { type: "integer", description: "Rows (default 10, max 50)." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          total: { type: "integer", required: true },
          rows: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                repo: { type: "string", required: true },
                grade: { type: "string" },
                score: { type: "integer" },
                stars: { type: "integer" },
                category: { type: "string" },
                curated: { type: "boolean" },
                npm: { type: "boolean" },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Top " + value.rows.length + " of " + value.total + " plugins:"];
        for (const r of value.rows) {
          lines.push("  " + (r.grade ? gradeBadge(r.grade) + " " + r.grade + " " + String(r.score).padStart(3) : "   ?   ") + "  " + r.repo + "  " + (r.stars ?? "?") + "★" + (r.curated ? " curated" : "") + (r.npm ? " npm" : "") + (r.category ? " [" + r.category + "]" : ""));
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: (args) => {
      // catalog stores raw fields; score is computed on the fly
      const withScore = records.map((r) => ({ ...r, score: scoreRecord(r) }));
      const rows = listRecords({ records: withScore, sort: args.sort ?? "score", category: args.category, limit: Math.min(args.limit ?? 10, 50) }).map((r) => ({
        repo: r.repo,
        grade: r.score?.grade,
        score: r.score?.total,
        stars: r.stars,
        category: r.category,
        curated: r.curated === true,
        npm: r.npm === true,
      }));
      return { total: records.length, rows };
    },
    presentCall: (args) => ({ card: "generic", title: "Plugin rank by " + (args.sort ?? "score"), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_audit",
    description: "Static security scan of a local plugin checkout (directory): reads package.json + lib/scripts/src JS files (capped), runs heuristics for exfiltration / credentials / obfuscation / persistence, and reports findings with severities. Give it a trusted local checkout path of the plugin under review.",
    parameters: {
      dir: { type: "string", required: true, description: "Absolute path to the plugin's local checkout directory." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          scanned: { type: "integer", required: true },
          findings: { type: "array", required: true, items: { type: "string" } },
          vetoed: { type: "boolean", required: true },
        },
      },
      render: (_args, value) => {
        const lines = ["Scanned " + value.scanned + " file(s). " + (value.findings.length === 0 ? "No suspicious patterns." : value.findings.length + " finding(s).")];
        if (value.vetoed) lines.push("⚠ VETO: high-severity findings — do not install without review.");
        for (const f of value.findings) lines.push("  - " + f);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const findings = await scanDir(String(args.dir));
      return { scanned: findings.length, findings: findings.map((f) => "[" + (f.severity ?? "info") + "] " + (f.kind ?? "finding") + ": " + (f.path ?? "")), vetoed: hasVetoFinding(findings) };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit " + String(args.dir).slice(0, 40), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_verdict",
    description: "The single install decision for one plugin: combines the health score (catalog), an optional static security scan of a local checkout (dir), and need matching (need) into install / caution / research / avoid with reasons. Answer to '这个插件值得装吗 / is it worth installing'.",
    parameters: {
      repo: { type: "string", required: true, description: "Plugin repo or name, e.g. 'owner/repo' or a URL." },
      need: { type: "string", description: "Optional natural-language need to compute match strength." },
      dir: { type: "string", description: "Optional absolute path to a local checkout for a security scan." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          repo: { type: "string", required: true },
          decision: { type: "string", required: true },
          security: { type: "string", required: true },
          score: { type: "integer" },
          grade: { type: "string" },
          reasons: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_args, value) => {
        const badge = { install: "✅", caution: "⚠️", research: "🔍", avoid: "🚫" }[value.decision] ?? "?";
        const lines = [badge + " " + value.repo + " — " + value.decision.toUpperCase()];
        for (const r of value.reasons) lines.push("  - " + r);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const repo = String(args.repo).replace(/^https?:\/\/github\.com\//, "");
      const record = records.find((r) => r.repo === repo || r.name === repo || r.url === repo);
      if (!record) throw new Error('plugin_verdict: "' + repo + '" not in the catalog — try plugin_guide first');
      const score = scoreRecord(record);
      let findings = [];
      if (args.dir) findings = await scanDir(String(args.dir));
      let needMatch;
      if (args.need) {
        const hits = search(String(args.need), plugins, 10);
        const top = hits[0]?.score ?? 1;
        const hit = hits.find((h) => h.name === record.repo || h.name === record.name);
        if (hit && top > 0) needMatch = hit.score / top;
      }
      const verdict = verdictFor({ record, score, findings, needMatch });
      return { repo: verdict.repo, decision: verdict.decision, security: verdict.security, score: verdict.score, grade: verdict.grade, reasons: verdict.reasons };
    },
    presentCall: (args) => ({ card: "generic", title: "Verdict for " + String(args.repo).slice(0, 50), kind: "other", rawInput: args }),
  }));

  const recipeProblems = validateAll(loadRecipes());
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("insight").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: "insight:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "insight.section()");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-insight 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对人工搜索，它把发现、环境组合、健康与静态安全放到同一询问入口，减少上下文切换；但“统一 verdict”容易把不同证据等级压成单一标签。静态规则与内置数据的新鲜度决定价值，不能替代固定版本源码研究、真实安装或宿主验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/README.md#L1-L38)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（38行）</summary>

````text
# dsh-insight — 插件评测中心 (Plugin Insight Center)

**一个插件，一个答案："哪些值得装"。** 把需求推荐、质量评分、安全审计、环境配方合并成同一个决策面 —— 装 `dsh-insight` 一个包，用户就得到完整结论，而不是在三个工具间自己拼答案。

## 为什么是合并（而不是 3 个插件）

"没有评分、没有审计、没有'哪些值得装'的答案" —— 这是**同一个决策的三个维度**（安全吗 → 好不好 → 适合我吗）。拆成多个插件 = 用户自己拼答案；合一个 = 一次调用拿结论。

## 五个工具

| 工具 | 回答的问题 |
| --- | --- |
| `plugin_guide` | 用户说需求 → 推荐最匹配的插件（84 个精选 / 14 分类，带理由与安装命令） |
| `recipe` | 用户要整套环境 → 8 个社区配方（通知全家桶、安全审计套装...）有序安装计划 |
| `plugin_rank` | "哪些值得装" → 健康分排行榜（maintenance/docs/npm/ecosystem，0-100） |
| `plugin_audit` | "这个安全吗" → 本地目录静态安全扫描（外泄/凭据/混淆/持久化启发式） |
| `plugin_verdict` | **"这个值得装吗"** → 综合评分+扫描+需求匹配，输出 install / caution / research / avoid |

## 安装

```bash
dsh plugin --profile <profile> add dsh-insight
```

## 用法示例

- "我想抓取网页" → `plugin_guide` (need="抓取网页")
- "手机远程访问" → `recipe` (search need="手机远程") → apply
- "哪些插件值得装" → `plugin_rank` (sort=score)
- "这个仓库安全吗" → `plugin_audit` (dir=/path/to/checkout)
- "dsh-browser 值得装吗，我用来抓网页" → `plugin_verdict` (repo + need + dir 可选)

## 设计

- **纯逻辑层零依赖**：`match.js`、`recipe.js`、`scoring.js`、`security.js`、`verdict.js` 全部可独立单测。
- **评分模型**：0-100 = maintenance 30 + docs 25 + npm 30 + ecosystem 15；grade A-F；安全高危 flag 封顶 D。
- **数据**：`lib/guide-data.json`（精选目录）+ `data/catalog.json`（700+ 插件评分数据）。
- **安全**：插件本身零网络请求；`plugin_audit` 只读模型指定的本地目录做静态扫描（信任边界：只扫可信源码）。
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-insight 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是分数与 verdict 是否具有校准意义。若插件数据过期、静态扫描误报/漏报或权重无法解释，单一建议会放大错误信心；扫描本地目录只看可匹配模式，不会运行数据流、权限或外部服务。建议名为 install 也不构成用户授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:79-347](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js#L79-L347)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（269行）</summary>

```text
 * Register all insight tools and the guidance section.
 * @param ctx - registrant context carrying tools/systemPrompt.
 * @param config - validated plugin configuration.
 */
function apply(ctx, config) {
  const plugins = loadPlugins();
  const storage = storageFor(config);
  const records = storage.loadCatalog();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching plugins from a curated directory (84 plugins / 14 categories), each with a reason and install command. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页'.",
    parameters: {
      need: { type: "string", required: true, description: "The user's requirement in natural language (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-10)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: { type: "string", required: true },
          count: { type: "integer", required: true },
          results: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                category: { type: "string", required: true },
                descEn: { type: "string", required: true },
                descZh: { type: "string", required: true },
                score: { type: "integer", required: true },
                reasons: { type: "array", required: true, items: { type: "string" } },
                install: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Matched " + value.count + " plugin(s) for: " + value.need, ""];
        for (const r of value.results) {
          lines.push("## " + r.name + " [" + r.category + "] (score " + r.score + ")");
          lines.push(r.descEn || r.descZh);
          lines.push("reasons: " + r.reasons.join(", "));
          lines.push("install: " + r.install);
          lines.push("");
        }
        if (value.count === 0) lines.push("No match in the curated directory — try plugin_rank or search the dsh-plugin topic on GitHub.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit);
      return { need: args.need, count: results.length, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Find plugins for: " + String(args.need).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "recipe",
    description: "Bundle installer for DeepSeek Harness (插件界的 dotfiles): list, search, inspect, or get the ordered install plan for community plugin recipes (通知全家桶, 安全审计套装, 移动远程套装, ...). Use when the user wants a whole environment/setup/套装/环境 rather than a single plugin.",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "search", "get", "apply"], description: "list / search / get / apply." },
      need: { type: "string", description: "Natural-language need, required for action=search." },
      id: { type: "string", description: "Recipe id, required for get/apply." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          action: { type: "string", required: true },
          count: { type: "integer", required: true },
          recipes: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                id: { type: "string", required: true },
                name: { type: "string", required: true },
                nameEn: { type: "string", required: true },
                description: { type: "string", required: true },
                descriptionEn: { type: "string", required: true },
                exclusive: { type: "boolean", required: true },
                steps: {
                  type: "array", required: true,
                  items: {
                    type: "object", additionalProperties: false, required: true,
                    properties: {
                      name: { type: "string", required: true },
                      install: { type: "string", required: true },
                      required: { type: "boolean", required: true },
                      order: { type: "integer", required: true },
                    },
                  },
                },
                notes: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result(s)", ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({ id: rc.id, name: rc.name, nameEn: rc.nameEn, description: rc.description, descriptionEn: rc.descriptionEn, exclusive: rc.exclusive, notes: rc.notes, plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })) }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const recipes = loadRecipes();
      const { action } = args;
      if ((action === "get" || action === "apply") && !recipes.some((r) => r.id === args.id)) {
        throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let list = recipes;
      if (action === "search") list = searchRecipes(args.need ?? "", recipes).map((s) => s.recipe);
      const out = list.map((r) => ({ id: r.id, name: r.name, nameEn: r.nameEn, description: r.description, descriptionEn: r.descriptionEn, exclusive: r.exclusive === true, steps: installPlan(r).steps, notes: r.notes ?? "" }));
      return { action, count: out.length, recipes: out };
    },
    presentCall: (args) => ({ card: "generic", title: "Recipe " + String(args.action), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_rank",
    description: "Leaderboard over the curated plugin catalog by health score (maintenance/docs/npm/ecosystem), stars, newest, or name, with optional category filter. Answer to '哪些插件值得装' at a glance.",
    parameters: {
      sort: { type: "string", enum: ["score", "stars", "new", "name"], description: "Sort key (default score)." },
      category: { type: "string", description: "Optional category filter, e.g. 'tools' or 'ui'." },
      limit: { type: "integer", description: "Rows (default 10, max 50)." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          total: { type: "integer", required: true },
          rows: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                repo: { type: "string", required: true },
                grade: { type: "string" },
                score: { type: "integer" },
                stars: { type: "integer" },
                category: { type: "string" },
                curated: { type: "boolean" },
                npm: { type: "boolean" },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Top " + value.rows.length + " of " + value.total + " plugins:"];
        for (const r of value.rows) {
          lines.push("  " + (r.grade ? gradeBadge(r.grade) + " " + r.grade + " " + String(r.score).padStart(3) : "   ?   ") + "  " + r.repo + "  " + (r.stars ?? "?") + "★" + (r.curated ? " curated" : "") + (r.npm ? " npm" : "") + (r.category ? " [" + r.category + "]" : ""));
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: (args) => {
      // catalog stores raw fields; score is computed on the fly
      const withScore = records.map((r) => ({ ...r, score: scoreRecord(r) }));
      const rows = listRecords({ records: withScore, sort: args.sort ?? "score", category: args.category, limit: Math.min(args.limit ?? 10, 50) }).map((r) => ({
        repo: r.repo,
        grade: r.score?.grade,
        score: r.score?.total,
        stars: r.stars,
        category: r.category,
        curated: r.curated === true,
        npm: r.npm === true,
      }));
      return { total: records.length, rows };
    },
    presentCall: (args) => ({ card: "generic", title: "Plugin rank by " + (args.sort ?? "score"), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_audit",
    description: "Static security scan of a local plugin checkout (directory): reads package.json + lib/scripts/src JS files (capped), runs heuristics for exfiltration / credentials / obfuscation / persistence, and reports findings with severities. Give it a trusted local checkout path of the plugin under review.",
    parameters: {
      dir: { type: "string", required: true, description: "Absolute path to the plugin's local checkout directory." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          scanned: { type: "integer", required: true },
          findings: { type: "array", required: true, items: { type: "string" } },
          vetoed: { type: "boolean", required: true },
        },
      },
      render: (_args, value) => {
        const lines = ["Scanned " + value.scanned + " file(s). " + (value.findings.length === 0 ? "No suspicious patterns." : value.findings.length + " finding(s).")];
        if (value.vetoed) lines.push("⚠ VETO: high-severity findings — do not install without review.");
        for (const f of value.findings) lines.push("  - " + f);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const findings = await scanDir(String(args.dir));
      return { scanned: findings.length, findings: findings.map((f) => "[" + (f.severity ?? "info") + "] " + (f.kind ?? "finding") + ": " + (f.path ?? "")), vetoed: hasVetoFinding(findings) };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit " + String(args.dir).slice(0, 40), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_verdict",
    description: "The single install decision for one plugin: combines the health score (catalog), an optional static security scan of a local checkout (dir), and need matching (need) into install / caution / research / avoid with reasons. Answer to '这个插件值得装吗 / is it worth installing'.",
    parameters: {
      repo: { type: "string", required: true, description: "Plugin repo or name, e.g. 'owner/repo' or a URL." },
      need: { type: "string", description: "Optional natural-language need to compute match strength." },
      dir: { type: "string", description: "Optional absolute path to a local checkout for a security scan." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          repo: { type: "string", required: true },
          decision: { type: "string", required: true },
          security: { type: "string", required: true },
          score: { type: "integer" },
          grade: { type: "string" },
          reasons: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_args, value) => {
        const badge = { install: "✅", caution: "⚠️", research: "🔍", avoid: "🚫" }[value.decision] ?? "?";
        const lines = [badge + " " + value.repo + " — " + value.decision.toUpperCase()];
        for (const r of value.reasons) lines.push("  - " + r);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const repo = String(args.repo).replace(/^https?:\/\/github\.com\//, "");
      const record = records.find((r) => r.repo === repo || r.name === repo || r.url === repo);
      if (!record) throw new Error('plugin_verdict: "' + repo + '" not in the catalog — try plugin_guide first');
      const score = scoreRecord(record);
      let findings = [];
      if (args.dir) findings = await scanDir(String(args.dir));
      let needMatch;
      if (args.need) {
        const hits = search(String(args.need), plugins, 10);
        const top = hits[0]?.score ?? 1;
        const hit = hits.find((h) => h.name === record.repo || h.name === record.name);
        if (hit && top > 0) needMatch = hit.score / top;
      }
      const verdict = verdictFor({ record, score, findings, needMatch });
      return { repo: verdict.repo, decision: verdict.decision, security: verdict.security, score: verdict.score, grade: verdict.grade, reasons: verdict.reasons };
    },
    presentCall: (args) => ({ card: "generic", title: "Verdict for " + String(args.repo).slice(0, 50), kind: "other", rawInput: args }),
  }));

  const recipeProblems = validateAll(loadRecipes());
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("insight").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: "insight:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "insight.section()");
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-insight 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 DSH tools/systemPrompt、插件自己的 catalog/recipe/评分规则和可写存储；plugin_audit 还需可读的本地插件目录。数据更新没有外部独立来源就会陈旧，目录不可读时只能基于元数据，verdict 必须降级为 research/caution。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/README.md#L1-L38)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（38行）</summary>

````text
# dsh-insight — 插件评测中心 (Plugin Insight Center)

**一个插件，一个答案："哪些值得装"。** 把需求推荐、质量评分、安全审计、环境配方合并成同一个决策面 —— 装 `dsh-insight` 一个包，用户就得到完整结论，而不是在三个工具间自己拼答案。

## 为什么是合并（而不是 3 个插件）

"没有评分、没有审计、没有'哪些值得装'的答案" —— 这是**同一个决策的三个维度**（安全吗 → 好不好 → 适合我吗）。拆成多个插件 = 用户自己拼答案；合一个 = 一次调用拿结论。

## 五个工具

| 工具 | 回答的问题 |
| --- | --- |
| `plugin_guide` | 用户说需求 → 推荐最匹配的插件（84 个精选 / 14 分类，带理由与安装命令） |
| `recipe` | 用户要整套环境 → 8 个社区配方（通知全家桶、安全审计套装...）有序安装计划 |
| `plugin_rank` | "哪些值得装" → 健康分排行榜（maintenance/docs/npm/ecosystem，0-100） |
| `plugin_audit` | "这个安全吗" → 本地目录静态安全扫描（外泄/凭据/混淆/持久化启发式） |
| `plugin_verdict` | **"这个值得装吗"** → 综合评分+扫描+需求匹配，输出 install / caution / research / avoid |

## 安装

```bash
dsh plugin --profile <profile> add dsh-insight
```

## 用法示例

- "我想抓取网页" → `plugin_guide` (need="抓取网页")
- "手机远程访问" → `recipe` (search need="手机远程") → apply
- "哪些插件值得装" → `plugin_rank` (sort=score)
- "这个仓库安全吗" → `plugin_audit` (dir=/path/to/checkout)
- "dsh-browser 值得装吗，我用来抓网页" → `plugin_verdict` (repo + need + dir 可选)

## 设计

- **纯逻辑层零依赖**：`match.js`、`recipe.js`、`scoring.js`、`security.js`、`verdict.js` 全部可独立单测。
- **评分模型**：0-100 = maintenance 30 + docs 25 + npm 30 + ecosystem 15；grade A-F；安全高危 flag 封顶 D。
- **数据**：`lib/guide-data.json`（精选目录）+ `data/catalog.json`（700+ 插件评分数据）。
- **安全**：插件本身零网络请求；`plugin_audit` 只读模型指定的本地目录做静态扫描（信任边界：只扫可信源码）。
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-insight 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要核对内置数据范围、评分权重和扫描规则，并为目标插件准备只读 checkout；持续每次查询消耗本地扫描/索引时间和人工复核 verdict；误报要定位规则例外，漏报只能通过独立源码审查或沙箱执行补证，不能用多跑几次同一评分恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:79-347](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js#L79-L347)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（269行）</summary>

```text
 * Register all insight tools and the guidance section.
 * @param ctx - registrant context carrying tools/systemPrompt.
 * @param config - validated plugin configuration.
 */
function apply(ctx, config) {
  const plugins = loadPlugins();
  const storage = storageFor(config);
  const records = storage.loadCatalog();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching plugins from a curated directory (84 plugins / 14 categories), each with a reason and install command. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页'.",
    parameters: {
      need: { type: "string", required: true, description: "The user's requirement in natural language (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-10)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: { type: "string", required: true },
          count: { type: "integer", required: true },
          results: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                category: { type: "string", required: true },
                descEn: { type: "string", required: true },
                descZh: { type: "string", required: true },
                score: { type: "integer", required: true },
                reasons: { type: "array", required: true, items: { type: "string" } },
                install: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Matched " + value.count + " plugin(s) for: " + value.need, ""];
        for (const r of value.results) {
          lines.push("## " + r.name + " [" + r.category + "] (score " + r.score + ")");
          lines.push(r.descEn || r.descZh);
          lines.push("reasons: " + r.reasons.join(", "));
          lines.push("install: " + r.install);
          lines.push("");
        }
        if (value.count === 0) lines.push("No match in the curated directory — try plugin_rank or search the dsh-plugin topic on GitHub.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit);
      return { need: args.need, count: results.length, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Find plugins for: " + String(args.need).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "recipe",
    description: "Bundle installer for DeepSeek Harness (插件界的 dotfiles): list, search, inspect, or get the ordered install plan for community plugin recipes (通知全家桶, 安全审计套装, 移动远程套装, ...). Use when the user wants a whole environment/setup/套装/环境 rather than a single plugin.",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "search", "get", "apply"], description: "list / search / get / apply." },
      need: { type: "string", description: "Natural-language need, required for action=search." },
      id: { type: "string", description: "Recipe id, required for get/apply." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          action: { type: "string", required: true },
          count: { type: "integer", required: true },
          recipes: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                id: { type: "string", required: true },
                name: { type: "string", required: true },
                nameEn: { type: "string", required: true },
                description: { type: "string", required: true },
                descriptionEn: { type: "string", required: true },
                exclusive: { type: "boolean", required: true },
                steps: {
                  type: "array", required: true,
                  items: {
                    type: "object", additionalProperties: false, required: true,
                    properties: {
                      name: { type: "string", required: true },
                      install: { type: "string", required: true },
                      required: { type: "boolean", required: true },
                      order: { type: "integer", required: true },
                    },
                  },
                },
                notes: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result(s)", ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({ id: rc.id, name: rc.name, nameEn: rc.nameEn, description: rc.description, descriptionEn: rc.descriptionEn, exclusive: rc.exclusive, notes: rc.notes, plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })) }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const recipes = loadRecipes();
      const { action } = args;
      if ((action === "get" || action === "apply") && !recipes.some((r) => r.id === args.id)) {
        throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let list = recipes;
      if (action === "search") list = searchRecipes(args.need ?? "", recipes).map((s) => s.recipe);
      const out = list.map((r) => ({ id: r.id, name: r.name, nameEn: r.nameEn, description: r.description, descriptionEn: r.descriptionEn, exclusive: r.exclusive === true, steps: installPlan(r).steps, notes: r.notes ?? "" }));
      return { action, count: out.length, recipes: out };
    },
    presentCall: (args) => ({ card: "generic", title: "Recipe " + String(args.action), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_rank",
    description: "Leaderboard over the curated plugin catalog by health score (maintenance/docs/npm/ecosystem), stars, newest, or name, with optional category filter. Answer to '哪些插件值得装' at a glance.",
    parameters: {
      sort: { type: "string", enum: ["score", "stars", "new", "name"], description: "Sort key (default score)." },
      category: { type: "string", description: "Optional category filter, e.g. 'tools' or 'ui'." },
      limit: { type: "integer", description: "Rows (default 10, max 50)." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          total: { type: "integer", required: true },
          rows: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                repo: { type: "string", required: true },
                grade: { type: "string" },
                score: { type: "integer" },
                stars: { type: "integer" },
                category: { type: "string" },
                curated: { type: "boolean" },
                npm: { type: "boolean" },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Top " + value.rows.length + " of " + value.total + " plugins:"];
        for (const r of value.rows) {
          lines.push("  " + (r.grade ? gradeBadge(r.grade) + " " + r.grade + " " + String(r.score).padStart(3) : "   ?   ") + "  " + r.repo + "  " + (r.stars ?? "?") + "★" + (r.curated ? " curated" : "") + (r.npm ? " npm" : "") + (r.category ? " [" + r.category + "]" : ""));
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: (args) => {
      // catalog stores raw fields; score is computed on the fly
      const withScore = records.map((r) => ({ ...r, score: scoreRecord(r) }));
      const rows = listRecords({ records: withScore, sort: args.sort ?? "score", category: args.category, limit: Math.min(args.limit ?? 10, 50) }).map((r) => ({
        repo: r.repo,
        grade: r.score?.grade,
        score: r.score?.total,
        stars: r.stars,
        category: r.category,
        curated: r.curated === true,
        npm: r.npm === true,
      }));
      return { total: records.length, rows };
    },
    presentCall: (args) => ({ card: "generic", title: "Plugin rank by " + (args.sort ?? "score"), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_audit",
    description: "Static security scan of a local plugin checkout (directory): reads package.json + lib/scripts/src JS files (capped), runs heuristics for exfiltration / credentials / obfuscation / persistence, and reports findings with severities. Give it a trusted local checkout path of the plugin under review.",
    parameters: {
      dir: { type: "string", required: true, description: "Absolute path to the plugin's local checkout directory." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          scanned: { type: "integer", required: true },
          findings: { type: "array", required: true, items: { type: "string" } },
          vetoed: { type: "boolean", required: true },
        },
      },
      render: (_args, value) => {
        const lines = ["Scanned " + value.scanned + " file(s). " + (value.findings.length === 0 ? "No suspicious patterns." : value.findings.length + " finding(s).")];
        if (value.vetoed) lines.push("⚠ VETO: high-severity findings — do not install without review.");
        for (const f of value.findings) lines.push("  - " + f);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const findings = await scanDir(String(args.dir));
      return { scanned: findings.length, findings: findings.map((f) => "[" + (f.severity ?? "info") + "] " + (f.kind ?? "finding") + ": " + (f.path ?? "")), vetoed: hasVetoFinding(findings) };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit " + String(args.dir).slice(0, 40), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_verdict",
    description: "The single install decision for one plugin: combines the health score (catalog), an optional static security scan of a local checkout (dir), and need matching (need) into install / caution / research / avoid with reasons. Answer to '这个插件值得装吗 / is it worth installing'.",
    parameters: {
      repo: { type: "string", required: true, description: "Plugin repo or name, e.g. 'owner/repo' or a URL." },
      need: { type: "string", description: "Optional natural-language need to compute match strength." },
      dir: { type: "string", description: "Optional absolute path to a local checkout for a security scan." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          repo: { type: "string", required: true },
          decision: { type: "string", required: true },
          security: { type: "string", required: true },
          score: { type: "integer" },
          grade: { type: "string" },
          reasons: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_args, value) => {
        const badge = { install: "✅", caution: "⚠️", research: "🔍", avoid: "🚫" }[value.decision] ?? "?";
        const lines = [badge + " " + value.repo + " — " + value.decision.toUpperCase()];
        for (const r of value.reasons) lines.push("  - " + r);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const repo = String(args.repo).replace(/^https?:\/\/github\.com\//, "");
      const record = records.find((r) => r.repo === repo || r.name === repo || r.url === repo);
      if (!record) throw new Error('plugin_verdict: "' + repo + '" not in the catalog — try plugin_guide first');
      const score = scoreRecord(record);
      let findings = [];
      if (args.dir) findings = await scanDir(String(args.dir));
      let needMatch;
      if (args.need) {
        const hits = search(String(args.need), plugins, 10);
        const top = hits[0]?.score ?? 1;
        const hit = hits.find((h) => h.name === record.repo || h.name === record.name);
        if (hit && top > 0) needMatch = hit.score / top;
      }
      const verdict = verdictFor({ record, score, findings, needMatch });
      return { repo: verdict.repo, decision: verdict.decision, security: verdict.security, score: verdict.score, grade: verdict.grade, reasons: verdict.reasons };
    },
    presentCall: (args) => ({ card: "generic", title: "Verdict for " + String(args.repo).slice(0, 50), kind: "other", rawInput: args }),
  }));

  const recipeProblems = validateAll(loadRecipes());
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("insight").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: "insight:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "insight.section()");
```

</details>

#### 缺口

- 内置评分/verdict 与独立专家判断的一致性未知
  **影响**：单一标签可能把静态线索包装成安装结论
  **进一步探讨**：对30个固定版本插件做双人盲审，统计严重漏报、误报、排序相关和复核分钟

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-insight 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

match、recipe、scoring、audit/security、storage 和 verdict 分模块，工具接口职责清晰，可借鉴“分项证据先出、最终判断后聚合”；但单仓库维护规则和数据会形成集中漂移点。复用时应让每个分项输出来源、版本和不可判定状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:79-347](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js#L79-L347)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（269行）</summary>

```text
 * Register all insight tools and the guidance section.
 * @param ctx - registrant context carrying tools/systemPrompt.
 * @param config - validated plugin configuration.
 */
function apply(ctx, config) {
  const plugins = loadPlugins();
  const storage = storageFor(config);
  const records = storage.loadCatalog();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching plugins from a curated directory (84 plugins / 14 categories), each with a reason and install command. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页'.",
    parameters: {
      need: { type: "string", required: true, description: "The user's requirement in natural language (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-10)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: { type: "string", required: true },
          count: { type: "integer", required: true },
          results: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                category: { type: "string", required: true },
                descEn: { type: "string", required: true },
                descZh: { type: "string", required: true },
                score: { type: "integer", required: true },
                reasons: { type: "array", required: true, items: { type: "string" } },
                install: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Matched " + value.count + " plugin(s) for: " + value.need, ""];
        for (const r of value.results) {
          lines.push("## " + r.name + " [" + r.category + "] (score " + r.score + ")");
          lines.push(r.descEn || r.descZh);
          lines.push("reasons: " + r.reasons.join(", "));
          lines.push("install: " + r.install);
          lines.push("");
        }
        if (value.count === 0) lines.push("No match in the curated directory — try plugin_rank or search the dsh-plugin topic on GitHub.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit);
      return { need: args.need, count: results.length, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Find plugins for: " + String(args.need).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "recipe",
    description: "Bundle installer for DeepSeek Harness (插件界的 dotfiles): list, search, inspect, or get the ordered install plan for community plugin recipes (通知全家桶, 安全审计套装, 移动远程套装, ...). Use when the user wants a whole environment/setup/套装/环境 rather than a single plugin.",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "search", "get", "apply"], description: "list / search / get / apply." },
      need: { type: "string", description: "Natural-language need, required for action=search." },
      id: { type: "string", description: "Recipe id, required for get/apply." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          action: { type: "string", required: true },
          count: { type: "integer", required: true },
          recipes: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                id: { type: "string", required: true },
                name: { type: "string", required: true },
                nameEn: { type: "string", required: true },
                description: { type: "string", required: true },
                descriptionEn: { type: "string", required: true },
                exclusive: { type: "boolean", required: true },
                steps: {
                  type: "array", required: true,
                  items: {
                    type: "object", additionalProperties: false, required: true,
                    properties: {
                      name: { type: "string", required: true },
                      install: { type: "string", required: true },
                      required: { type: "boolean", required: true },
                      order: { type: "integer", required: true },
                    },
                  },
                },
                notes: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result(s)", ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({ id: rc.id, name: rc.name, nameEn: rc.nameEn, description: rc.description, descriptionEn: rc.descriptionEn, exclusive: rc.exclusive, notes: rc.notes, plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })) }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const recipes = loadRecipes();
      const { action } = args;
      if ((action === "get" || action === "apply") && !recipes.some((r) => r.id === args.id)) {
        throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let list = recipes;
      if (action === "search") list = searchRecipes(args.need ?? "", recipes).map((s) => s.recipe);
      const out = list.map((r) => ({ id: r.id, name: r.name, nameEn: r.nameEn, description: r.description, descriptionEn: r.descriptionEn, exclusive: r.exclusive === true, steps: installPlan(r).steps, notes: r.notes ?? "" }));
      return { action, count: out.length, recipes: out };
    },
    presentCall: (args) => ({ card: "generic", title: "Recipe " + String(args.action), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_rank",
    description: "Leaderboard over the curated plugin catalog by health score (maintenance/docs/npm/ecosystem), stars, newest, or name, with optional category filter. Answer to '哪些插件值得装' at a glance.",
    parameters: {
      sort: { type: "string", enum: ["score", "stars", "new", "name"], description: "Sort key (default score)." },
      category: { type: "string", description: "Optional category filter, e.g. 'tools' or 'ui'." },
      limit: { type: "integer", description: "Rows (default 10, max 50)." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          total: { type: "integer", required: true },
          rows: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                repo: { type: "string", required: true },
                grade: { type: "string" },
                score: { type: "integer" },
                stars: { type: "integer" },
                category: { type: "string" },
                curated: { type: "boolean" },
                npm: { type: "boolean" },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Top " + value.rows.length + " of " + value.total + " plugins:"];
        for (const r of value.rows) {
          lines.push("  " + (r.grade ? gradeBadge(r.grade) + " " + r.grade + " " + String(r.score).padStart(3) : "   ?   ") + "  " + r.repo + "  " + (r.stars ?? "?") + "★" + (r.curated ? " curated" : "") + (r.npm ? " npm" : "") + (r.category ? " [" + r.category + "]" : ""));
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: (args) => {
      // catalog stores raw fields; score is computed on the fly
      const withScore = records.map((r) => ({ ...r, score: scoreRecord(r) }));
      const rows = listRecords({ records: withScore, sort: args.sort ?? "score", category: args.category, limit: Math.min(args.limit ?? 10, 50) }).map((r) => ({
        repo: r.repo,
        grade: r.score?.grade,
        score: r.score?.total,
        stars: r.stars,
        category: r.category,
        curated: r.curated === true,
        npm: r.npm === true,
      }));
      return { total: records.length, rows };
    },
    presentCall: (args) => ({ card: "generic", title: "Plugin rank by " + (args.sort ?? "score"), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_audit",
    description: "Static security scan of a local plugin checkout (directory): reads package.json + lib/scripts/src JS files (capped), runs heuristics for exfiltration / credentials / obfuscation / persistence, and reports findings with severities. Give it a trusted local checkout path of the plugin under review.",
    parameters: {
      dir: { type: "string", required: true, description: "Absolute path to the plugin's local checkout directory." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          scanned: { type: "integer", required: true },
          findings: { type: "array", required: true, items: { type: "string" } },
          vetoed: { type: "boolean", required: true },
        },
      },
      render: (_args, value) => {
        const lines = ["Scanned " + value.scanned + " file(s). " + (value.findings.length === 0 ? "No suspicious patterns." : value.findings.length + " finding(s).")];
        if (value.vetoed) lines.push("⚠ VETO: high-severity findings — do not install without review.");
        for (const f of value.findings) lines.push("  - " + f);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const findings = await scanDir(String(args.dir));
      return { scanned: findings.length, findings: findings.map((f) => "[" + (f.severity ?? "info") + "] " + (f.kind ?? "finding") + ": " + (f.path ?? "")), vetoed: hasVetoFinding(findings) };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit " + String(args.dir).slice(0, 40), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_verdict",
    description: "The single install decision for one plugin: combines the health score (catalog), an optional static security scan of a local checkout (dir), and need matching (need) into install / caution / research / avoid with reasons. Answer to '这个插件值得装吗 / is it worth installing'.",
    parameters: {
      repo: { type: "string", required: true, description: "Plugin repo or name, e.g. 'owner/repo' or a URL." },
      need: { type: "string", description: "Optional natural-language need to compute match strength." },
      dir: { type: "string", description: "Optional absolute path to a local checkout for a security scan." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          repo: { type: "string", required: true },
          decision: { type: "string", required: true },
          security: { type: "string", required: true },
          score: { type: "integer" },
          grade: { type: "string" },
          reasons: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_args, value) => {
        const badge = { install: "✅", caution: "⚠️", research: "🔍", avoid: "🚫" }[value.decision] ?? "?";
        const lines = [badge + " " + value.repo + " — " + value.decision.toUpperCase()];
        for (const r of value.reasons) lines.push("  - " + r);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const repo = String(args.repo).replace(/^https?:\/\/github\.com\//, "");
      const record = records.find((r) => r.repo === repo || r.name === repo || r.url === repo);
      if (!record) throw new Error('plugin_verdict: "' + repo + '" not in the catalog — try plugin_guide first');
      const score = scoreRecord(record);
      let findings = [];
      if (args.dir) findings = await scanDir(String(args.dir));
      let needMatch;
      if (args.need) {
        const hits = search(String(args.need), plugins, 10);
        const top = hits[0]?.score ?? 1;
        const hit = hits.find((h) => h.name === record.repo || h.name === record.name);
        if (hit && top > 0) needMatch = hit.score / top;
      }
      const verdict = verdictFor({ record, score, findings, needMatch });
      return { repo: verdict.repo, decision: verdict.decision, security: verdict.security, score: verdict.score, grade: verdict.grade, reasons: verdict.reasons };
    },
    presentCall: (args) => ({ card: "generic", title: "Verdict for " + String(args.repo).slice(0, 50), kind: "other", rawInput: args }),
  }));

  const recipeProblems = validateAll(loadRecipes());
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("insight").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: "insight:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "insight.section()");
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把 verdict 改成可追溯证据图，并在数据过期或扫描未覆盖时拒绝给出 install，可降低误导。最小实验让两名审查者对 30 个插件做盲审，与现 verdict/证据图 verdict 比较一致率、严重漏报和复核时间；若可追溯版不降低高风险误判则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:79-347](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/lib/index.js#L79-L347)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（269行）</summary>

```text
 * Register all insight tools and the guidance section.
 * @param ctx - registrant context carrying tools/systemPrompt.
 * @param config - validated plugin configuration.
 */
function apply(ctx, config) {
  const plugins = loadPlugins();
  const storage = storageFor(config);
  const records = storage.loadCatalog();

  ctx.tools.register(defineTool({
    name: "plugin_guide",
    description: "Semantic plugin finder for DeepSeek Harness: given a natural-language need (not a plugin name), return the best-matching plugins from a curated directory (84 plugins / 14 categories), each with a reason and install command. Use when the user describes WHAT they want — e.g. 'notify me when a task finishes', '手机上看 DSH', '抓取网页'.",
    parameters: {
      need: { type: "string", required: true, description: "The user's requirement in natural language (English or Chinese)." },
      limit: { type: "integer", description: "Max results (1-10)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: { type: "string", required: true },
          count: { type: "integer", required: true },
          results: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                name: { type: "string", required: true },
                url: { type: "string", required: true },
                category: { type: "string", required: true },
                descEn: { type: "string", required: true },
                descZh: { type: "string", required: true },
                score: { type: "integer", required: true },
                reasons: { type: "array", required: true, items: { type: "string" } },
                install: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Matched " + value.count + " plugin(s) for: " + value.need, ""];
        for (const r of value.results) {
          lines.push("## " + r.name + " [" + r.category + "] (score " + r.score + ")");
          lines.push(r.descEn || r.descZh);
          lines.push("reasons: " + r.reasons.join(", "));
          lines.push("install: " + r.install);
          lines.push("");
        }
        if (value.count === 0) lines.push("No match in the curated directory — try plugin_rank or search the dsh-plugin topic on GitHub.");
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const limit = Number.isInteger(args.limit) ? args.limit : config.limit;
      const results = search(args.need, plugins, limit);
      return { need: args.need, count: results.length, results };
    },
    presentCall: (args) => ({ card: "generic", title: "Find plugins for: " + String(args.need).slice(0, 60), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "recipe",
    description: "Bundle installer for DeepSeek Harness (插件界的 dotfiles): list, search, inspect, or get the ordered install plan for community plugin recipes (通知全家桶, 安全审计套装, 移动远程套装, ...). Use when the user wants a whole environment/setup/套装/环境 rather than a single plugin.",
    parameters: {
      action: { type: "string", required: true, enum: ["list", "search", "get", "apply"], description: "list / search / get / apply." },
      need: { type: "string", description: "Natural-language need, required for action=search." },
      id: { type: "string", description: "Recipe id, required for get/apply." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          action: { type: "string", required: true },
          count: { type: "integer", required: true },
          recipes: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                id: { type: "string", required: true },
                name: { type: "string", required: true },
                nameEn: { type: "string", required: true },
                description: { type: "string", required: true },
                descriptionEn: { type: "string", required: true },
                exclusive: { type: "boolean", required: true },
                steps: {
                  type: "array", required: true,
                  items: {
                    type: "object", additionalProperties: false, required: true,
                    properties: {
                      name: { type: "string", required: true },
                      install: { type: "string", required: true },
                      required: { type: "boolean", required: true },
                      order: { type: "integer", required: true },
                    },
                  },
                },
                notes: { type: "string", required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Recipe " + value.action + ": " + value.count + " result(s)", ""];
        for (const rc of value.recipes) {
          lines.push(renderRecipe({ id: rc.id, name: rc.name, nameEn: rc.nameEn, description: rc.description, descriptionEn: rc.descriptionEn, exclusive: rc.exclusive, notes: rc.notes, plugins: rc.steps.map((s) => ({ name: s.name, order: s.order, required: s.required })) }));
          lines.push("");
        }
        return [{ type: "text", text: lines.join("\n").trimEnd() }];
      },
    },
    execute: async (args) => {
      const recipes = loadRecipes();
      const { action } = args;
      if ((action === "get" || action === "apply") && !recipes.some((r) => r.id === args.id)) {
        throw new Error('recipe: unknown id "' + args.id + '" — call list or search first');
      }
      let list = recipes;
      if (action === "search") list = searchRecipes(args.need ?? "", recipes).map((s) => s.recipe);
      const out = list.map((r) => ({ id: r.id, name: r.name, nameEn: r.nameEn, description: r.description, descriptionEn: r.descriptionEn, exclusive: r.exclusive === true, steps: installPlan(r).steps, notes: r.notes ?? "" }));
      return { action, count: out.length, recipes: out };
    },
    presentCall: (args) => ({ card: "generic", title: "Recipe " + String(args.action), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_rank",
    description: "Leaderboard over the curated plugin catalog by health score (maintenance/docs/npm/ecosystem), stars, newest, or name, with optional category filter. Answer to '哪些插件值得装' at a glance.",
    parameters: {
      sort: { type: "string", enum: ["score", "stars", "new", "name"], description: "Sort key (default score)." },
      category: { type: "string", description: "Optional category filter, e.g. 'tools' or 'ui'." },
      limit: { type: "integer", description: "Rows (default 10, max 50)." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          total: { type: "integer", required: true },
          rows: {
            type: "array", required: true,
            items: {
              type: "object", additionalProperties: false, required: true,
              properties: {
                repo: { type: "string", required: true },
                grade: { type: "string" },
                score: { type: "integer" },
                stars: { type: "integer" },
                category: { type: "string" },
                curated: { type: "boolean" },
                npm: { type: "boolean" },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = ["Top " + value.rows.length + " of " + value.total + " plugins:"];
        for (const r of value.rows) {
          lines.push("  " + (r.grade ? gradeBadge(r.grade) + " " + r.grade + " " + String(r.score).padStart(3) : "   ?   ") + "  " + r.repo + "  " + (r.stars ?? "?") + "★" + (r.curated ? " curated" : "") + (r.npm ? " npm" : "") + (r.category ? " [" + r.category + "]" : ""));
        }
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: (args) => {
      // catalog stores raw fields; score is computed on the fly
      const withScore = records.map((r) => ({ ...r, score: scoreRecord(r) }));
      const rows = listRecords({ records: withScore, sort: args.sort ?? "score", category: args.category, limit: Math.min(args.limit ?? 10, 50) }).map((r) => ({
        repo: r.repo,
        grade: r.score?.grade,
        score: r.score?.total,
        stars: r.stars,
        category: r.category,
        curated: r.curated === true,
        npm: r.npm === true,
      }));
      return { total: records.length, rows };
    },
    presentCall: (args) => ({ card: "generic", title: "Plugin rank by " + (args.sort ?? "score"), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_audit",
    description: "Static security scan of a local plugin checkout (directory): reads package.json + lib/scripts/src JS files (capped), runs heuristics for exfiltration / credentials / obfuscation / persistence, and reports findings with severities. Give it a trusted local checkout path of the plugin under review.",
    parameters: {
      dir: { type: "string", required: true, description: "Absolute path to the plugin's local checkout directory." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          scanned: { type: "integer", required: true },
          findings: { type: "array", required: true, items: { type: "string" } },
          vetoed: { type: "boolean", required: true },
        },
      },
      render: (_args, value) => {
        const lines = ["Scanned " + value.scanned + " file(s). " + (value.findings.length === 0 ? "No suspicious patterns." : value.findings.length + " finding(s).")];
        if (value.vetoed) lines.push("⚠ VETO: high-severity findings — do not install without review.");
        for (const f of value.findings) lines.push("  - " + f);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const findings = await scanDir(String(args.dir));
      return { scanned: findings.length, findings: findings.map((f) => "[" + (f.severity ?? "info") + "] " + (f.kind ?? "finding") + ": " + (f.path ?? "")), vetoed: hasVetoFinding(findings) };
    },
    presentCall: (args) => ({ card: "generic", title: "Audit " + String(args.dir).slice(0, 40), kind: "other", rawInput: args }),
  }));

  ctx.tools.register(defineTool({
    name: "plugin_verdict",
    description: "The single install decision for one plugin: combines the health score (catalog), an optional static security scan of a local checkout (dir), and need matching (need) into install / caution / research / avoid with reasons. Answer to '这个插件值得装吗 / is it worth installing'.",
    parameters: {
      repo: { type: "string", required: true, description: "Plugin repo or name, e.g. 'owner/repo' or a URL." },
      need: { type: "string", description: "Optional natural-language need to compute match strength." },
      dir: { type: "string", description: "Optional absolute path to a local checkout for a security scan." },
    },
    output: {
      schema: {
        type: "object", additionalProperties: false, 
        properties: {
          repo: { type: "string", required: true },
          decision: { type: "string", required: true },
          security: { type: "string", required: true },
          score: { type: "integer" },
          grade: { type: "string" },
          reasons: { type: "array", required: true, items: { type: "string" } },
        },
      },
      render: (_args, value) => {
        const badge = { install: "✅", caution: "⚠️", research: "🔍", avoid: "🚫" }[value.decision] ?? "?";
        const lines = [badge + " " + value.repo + " — " + value.decision.toUpperCase()];
        for (const r of value.reasons) lines.push("  - " + r);
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const repo = String(args.repo).replace(/^https?:\/\/github\.com\//, "");
      const record = records.find((r) => r.repo === repo || r.name === repo || r.url === repo);
      if (!record) throw new Error('plugin_verdict: "' + repo + '" not in the catalog — try plugin_guide first');
      const score = scoreRecord(record);
      let findings = [];
      if (args.dir) findings = await scanDir(String(args.dir));
      let needMatch;
      if (args.need) {
        const hits = search(String(args.need), plugins, 10);
        const top = hits[0]?.score ?? 1;
        const hit = hits.find((h) => h.name === record.repo || h.name === record.name);
        if (hit && top > 0) needMatch = hit.score / top;
      }
      const verdict = verdictFor({ record, score, findings, needMatch });
      return { repo: verdict.repo, decision: verdict.decision, security: verdict.security, score: verdict.score, grade: verdict.grade, reasons: verdict.reasons };
    },
    presentCall: (args) => ({ card: "generic", title: "Verdict for " + String(args.repo).slice(0, 50), kind: "other", rawInput: args }),
  }));

  const recipeProblems = validateAll(loadRecipes());
  if (!recipeProblems.valid) {
    ctx.root?.logger?.("insight").warn("recipe validation failed: " + JSON.stringify(recipeProblems.problems));
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: "insight:instructions",
    order: config.sectionOrder,
    text: GUIDE_SECTION_TEXT,
  }), "insight.section()");
```

</details>

#### 缺口

- 内置评分/verdict 与独立专家判断的一致性未知
  **影响**：单一标签可能把静态线索包装成安装结论
  **进一步探讨**：对30个固定版本插件做双人盲审，统计严重漏报、误报、排序相关和复核分钟

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-insight？

**研究主题**：采用判断

#### 完整回答

适合插件研究者把它当候选筛选和审计线索观察，不应直接驱动生产安装。只有在目标插件数据版本匹配、静态扫描范围明确、人工复核关键权限/副作用后，才可把 verdict 作为输入之一；任何目录不可读、规则未知或结果只给总分时都回到独立源码审查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/863683348/dsh-insight/blob/6fcb8fc9a04b70e391e78d2c41bbfb240b6f021b/README.md#L1-L38)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（38行）</summary>

````text
# dsh-insight — 插件评测中心 (Plugin Insight Center)

**一个插件，一个答案："哪些值得装"。** 把需求推荐、质量评分、安全审计、环境配方合并成同一个决策面 —— 装 `dsh-insight` 一个包，用户就得到完整结论，而不是在三个工具间自己拼答案。

## 为什么是合并（而不是 3 个插件）

"没有评分、没有审计、没有'哪些值得装'的答案" —— 这是**同一个决策的三个维度**（安全吗 → 好不好 → 适合我吗）。拆成多个插件 = 用户自己拼答案；合一个 = 一次调用拿结论。

## 五个工具

| 工具 | 回答的问题 |
| --- | --- |
| `plugin_guide` | 用户说需求 → 推荐最匹配的插件（84 个精选 / 14 分类，带理由与安装命令） |
| `recipe` | 用户要整套环境 → 8 个社区配方（通知全家桶、安全审计套装...）有序安装计划 |
| `plugin_rank` | "哪些值得装" → 健康分排行榜（maintenance/docs/npm/ecosystem，0-100） |
| `plugin_audit` | "这个安全吗" → 本地目录静态安全扫描（外泄/凭据/混淆/持久化启发式） |
| `plugin_verdict` | **"这个值得装吗"** → 综合评分+扫描+需求匹配，输出 install / caution / research / avoid |

## 安装

```bash
dsh plugin --profile <profile> add dsh-insight
```

## 用法示例

- "我想抓取网页" → `plugin_guide` (need="抓取网页")
- "手机远程访问" → `recipe` (search need="手机远程") → apply
- "哪些插件值得装" → `plugin_rank` (sort=score)
- "这个仓库安全吗" → `plugin_audit` (dir=/path/to/checkout)
- "dsh-browser 值得装吗，我用来抓网页" → `plugin_verdict` (repo + need + dir 可选)

## 设计

- **纯逻辑层零依赖**：`match.js`、`recipe.js`、`scoring.js`、`security.js`、`verdict.js` 全部可独立单测。
- **评分模型**：0-100 = maintenance 30 + docs 25 + npm 30 + ecosystem 15；grade A-F；安全高危 flag 封顶 D。
- **数据**：`lib/guide-data.json`（精选目录）+ `data/catalog.json`（700+ 插件评分数据）。
- **安全**：插件本身零网络请求；`plugin_audit` 只读模型指定的本地目录做静态扫描（信任边界：只扫可信源码）。
````

</details>

#### 缺口

- 内置评分/verdict 与独立专家判断的一致性未知
  **影响**：单一标签可能把静态线索包装成安装结论
  **进一步探讨**：对30个固定版本插件做双人盲审，统计严重漏报、误报、排序相关和复核分钟

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
