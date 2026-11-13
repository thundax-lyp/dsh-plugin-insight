# dsh-soul-md

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c79c973](https://github.com/Scorp1o117/dsh-soul-md/tree/c79c9734ee412e8f7dea0770b61d4fe941a73d1f)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Scorp1o117/dsh-soul-md) [![npm 30d 51,606](https://img.shields.io/static/v1?label=npm+30d&message=51%2C606&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul-md) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-soul-md)
<!-- END META -->

> **功能**：为 DSH 添加可切换的 Markdown 人设卡及分层文件记忆。

> **亮点**：[Q01](#research-q01) 把人设选择和记忆读写纳入会话流程，[Q02](#research-q02) 将核心与动态主题分开管理预算。

> **主要限制**：[Q03](#research-q03) 的读链可回到全局，且重写直接覆盖文件。使用者须检查来源并保留恢复副本。

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
  - [Q01 · 何时比手工复制人设和项目笔记更合适？](#detail-section-11)
  - [Q02 · 挂载后核心记忆与主题怎样注入？](#detail-section-12)
  - [Q03 · 持久写入与卡片回退有什么采用代价？](#detail-section-13)
  - [Q04 · 如何验证缩短重复说明且未串入其他卡内容？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在多个工作区重复使用人设和笔记的 DSH 用户，通过会话入口选择不同卡片。

以显式项目笔记及每次手工粘贴作为参照，仍可直接检查原件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 人设选择 | 切换会话卡片 | 工作区与默认设置影响回退 |
| 分层记忆 | 保留核心和可按需读的主题 | 关键词、预算和读取范围限制 |
| 写入工具 | 更新卡或记忆文件 | 重要文件先备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、systemPrompt、tools | 宿主必需 | 组装和管理记忆 | 查看加载状态 |
| 可写独占记忆与 settings | 按操作需要 | 持久化记忆与卡片 | 用临时副本并保留备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户建两张测试卡 | 保存原文件 |
| 核查 | 用户切会话并查看来源 | 没有不期望的全局回退 |
| 退出 | 用户停用并恢复备份 | 回到显式项目笔记 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境未知 | 整理卡片、备份 | 核实际宿主 |
| 持续 | 提示 token 未测 | 核回退和改写 | 字符上限不等于费用 |
| 恢复 | 重跑未知 | 查错误来源和还原 | 覆盖写需要外部备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 人设与记忆 | 选择、读写和预算 | 召回准确和节时 |
| 恢复 | 可使用外部备份 | 真实并发恢复 |

> **思考**：[Q03](#research-q03) 的读链可回到全局，且重写直接覆盖文件。使用者须检查来源并保留恢复副本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把人设选择和记忆读写纳入会话流程，[Q02](#research-q02) 将核心与动态主题分开管理预算。

[Q02](#research-q02) 分别约束核心预算和动态主题。[Q03](#research-q03) 的整文件重写要求额外恢复点。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的读链可回到全局，且重写直接覆盖文件。使用者须检查来源并保留恢复副本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在临时配置检查卡片和全局的读取范围，允许改写前备份。出现错卡或重要内容覆盖时停用，按原件恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持实际会话人设和文件记忆。真实提示组装、持久恢复及效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定宿主、Web、核心和召回及重写，未执行 DSH、模型和文件改写。
- 下一步：按 [Q04](#research-q04) 核会话切换、真实提示和按卡回退。

**分析版本**

- **仓库**：[Scorp1o117/dsh-soul-md](https://github.com/Scorp1o117/dsh-soul-md)
- **版本号**：0.12.2（[固定提交 c79c973](https://github.com/Scorp1o117/dsh-soul-md/tree/c79c9734ee412e8f7dea0770b61d4fe941a73d1f)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 交叉测试两卡与全局资料。若误召回或人工修正成本抵消节省，则保留手工笔记。

按 [Q04](#research-q04) 核会话切换、真实提示和按卡回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 2018 | 1553 | 386 | — |
| .md | example | 2 | 45 | — | — | 270 |
| .md | source | 4 | 198 | — | — | 3894 |
| .mjs | test | 10 | 1719 | 1528 | 59 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/Scorp1o117/dsh-soul-md/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：切换 DSH 会话人设时，插件如何注入文件记忆，怎样识别回退、重写与采用条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时比手工复制人设和项目笔记更合适？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 使用多个工作区、每次需要带入同一角色和历史笔记的人，可以用会话卡片和分层 Markdown 记忆减少重复粘贴。作者描述会话选择、工作区和默认卡的优先关系。Web 实际挂配置和会话切换器；宿主写入目标为当前卡，读取则沿当前卡再到全局查找。手工维护项目说明虽然需要显式操作，读者更容易逐条核对其适用范围。合格任务应在切换时确认当前卡和来源，且能回查关键记忆。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-15](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/README.md#L9-L15)

作者界定工作区、人设和记忆。

```text
- **人设卡**：在插件页创建、编辑并设置默认卡片；在新会话页或聊天标题栏为单个会话选择卡片，也可以在插件页隐藏选择器。
- **工作区人设**：为工作区指定默认卡片。解析顺序为：会话选择 → 工作区人设 → 默认卡 → 不启用。
- **文件记忆**：Agent 可使用 `memory_read`、`memory_append`、`memory_rewrite` 读取和维护记忆；`soul_read`、`soul_update` 用于读取和更新人设卡。
- **分层记忆**：默认将常驻 `core.md` 与按主题读取的 `topics/*.md` 分开，支持 `memory_search`、关键词召回和压缩后补偿，也可按需关闭。
- **按人设控制记忆**：每张卡默认启用记忆，可在插件页单独关闭，不影响人设本身。
- **子代理控制**：默认不向子代理自动注入人设和记忆；这不会改变记忆工具的读写作用域，可在设置中恢复注入。

```

**依据 2 · 源码核查**：[client.js:780-806](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/client.js#L780-L806)

真实配置和会话选择挂载。

<details>
<summary>查看原文（27行）</summary>

```text
      ctx.slots.inject("plugins.bundle.config", function () {
        return ctx.slots.register({
          name: "plugins.bundle.config",
          key: "dsh-soul-md",
          locale: NS
        }, function (props) {
          return h(SoulSection, Object.assign({}, props, { scope: scope, write: write, t: t, locale: ctx.locale }));
        });
      });
      ctx.slots.inject("conversation.session.header.actions", function () {
        return ctx.slots.register({
          name: "conversation.session.header.actions",
          id: "soul-md-persona",
          order: 40
        }, function (props) {
          return h(PersonaSwitcher, Object.assign({}, props, { key: props.sessionId, scope: scope, write: write, t: t, locale: ctx.locale }));
        });
      });
      ctx.slots.inject("conversation.hero.options", function () {
        return ctx.slots.register({
          name: "conversation.hero.options",
          id: "soul-md-persona-hero",
          order: 40
        }, function (props) {
          return h(PersonaSwitcher, Object.assign({}, props, { key: props.sessionId, scope: scope, write: write, t: t, locale: ctx.locale, hero: true, holdComposer: hold }));
        });
      });
```

</details>

**依据 3 · 源码核查**：[index.js:248-267](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L248-L267)

读取候选链与写入目标。

<details>
<summary>查看原文（20行）</summary>

```text
  const memoryScopes = (agent) => {
    const cardName = cardNameOf(agent);
    return cardName ? [cardName, "global"] : ["global"];
  };

  /** The memory scope ACTIVE for one agent (write target): card memory > global. */
  const memoryTarget = (agent, topic = "") => {
    const cardName = cardNameOf(agent);
    const scope = cardName ?? "global";
    return {
      ...memoryLayout.writeTarget(scope, { layered: layeredEnabled(), topic }),
      scope,
    };
  };

  /** First EXISTING memory along the chain (read/inject path). */
  const memoryReadChain = (agent, topic = "") => memoryLayout.readChain(memoryScopes(agent), {
    layered: layeredEnabled(),
    topic,
  });
```

</details>

#### 缺口

- 跨会话实测与收益未知。
  **影响**：不能据入口宣称能保持所有角色一致。
  **进一步探讨**：用两个工作区和显式默认卡做切换对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 挂载后核心记忆与主题怎样注入？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

根 Cordis 行加载宿主模块，依赖 systemPrompt 和 tools。宿主先判记忆启用、卡片开关与子代理策略，再组合记忆正文和主题索引。存在召回候选时会留一部分字符预算给动态内容，超限时优先保留索引，正文可能只保留首尾。动态召回按会话状态做关键词检索和压缩后主题补偿。旧版宿主若不保留上下文插值标记，组装监听改用变量承载解析好的文本。这些分支用于控制提示词体积与宿主差异。字符上限并非已测 token 或延迟，关键词匹配也可能遗漏同义表述。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:6-8](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/cordis.patch.yml#L6-L8)

实际挂载根包。

```text
- insert:
    - id: soul-md
      name: 'dsh-soul-md'
```

**依据 2 · 源码核查**：[index.js:45-46](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L45-L46)

系统提示和工具依赖。

```text
/** Services this plugin needs injected from the host tree. */
const inject = ["systemPrompt", "tools"];
```

**依据 3 · 源码核查**：[index.js:342-373](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L342-L373)

核心、索引、预算和截断。

<details>
<summary>查看原文（32行）</summary>

```text
    if (!c.memory?.inject) return "";
    if (disabledMemoryCard(assembly?.agent)) return "";
    if (skipsSubagentSections(c, assembly?.agent)) return "";
    const { text, index: fullIndex } = memoryReadChain(assembly?.agent);
    const index = layeredEnabled(c) && recallMode(c) === "keyword" && c.memory?.indexMode === "recall"
      ? "Use memory_search(query) to find topic keys and summaries; memory_read(topic) retrieves full text."
      : fullIndex;
    const rendered = [text, index].filter(Boolean).join("\n\n");
    if (!rendered) return "";
    const totalCap = Math.max(0, Math.floor(c.memory.injectMaxChars ?? 8000));
    // Keep a stable share of the budget for changing recall when topics exist.
    // Reserving it even on turns without a match keeps the system prefix fixed.
    const hasRecall = layeredEnabled(c) && (recallMode(c) === "keyword" || recoveryEnabled(c))
      && boundedInteger(c.memory?.recallMaxTopics, 5, 20) > 0
      && searchableTopics(assembly?.agent).length > 0;
    const reserved = hasRecall ? Math.min(
      boundedInteger(c.memory?.recallMaxChars, 1600, 8000), Math.floor(totalCap / 4),
    ) : 0;
    const cap = totalCap - reserved;
    if (rendered.length <= cap) return rendered;
    if (!index) {
      return retainMemoryEnds(rendered, cap) + "\n\n> 部分记忆未注入（已保留首尾），请用 memory_read 读取全文 / part of memory omitted (beginning and end retained); use memory_read for the full text.";
    }
    if (index.length > cap) {
      return index.slice(0, cap) + "\n\n> 主题索引未完整注入，core 未注入；请用 memory_read 读取全文 / topic index incomplete; core omitted; use memory_read.";
    }
    // Reserve the complete topic index before allocating the remaining space
    // to core. Keep both ends of core so recent appends remain visible.
    const coreCap = Math.max(0, cap - index.length - (text ? 2 : 0));
    const core = retainMemoryEnds(text, coreCap);
    return [core, index].filter(Boolean).join("\n\n")
      + "\n\n> core 部分内容未注入，请用 memory_read 读取全文 / part of core omitted; use memory_read for the full text.";
```

</details>

**依据 4 · 源码核查**：[index.js:376-396](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L376-L396)

关键词与压缩补偿。

<details>
<summary>查看原文（21行）</summary>

```text
  const renderMemoryRecall = (assembly) => {
    const c = cfg();
    if (!c.memory?.inject || !layeredEnabled(c) || disabledMemoryCard(assembly?.agent)
      || skipsSubagentSections(c, assembly?.agent)) return "";
    const state = stateOf(assembly?.agent);
    if (!state) return "";
    const topics = searchableTopics(assembly.agent);
    const limit = boundedInteger(c.memory.recallMaxTopics, 5, 20);
    const recovered = recoveryEnabled(c) && limit ? state.recovery.flatMap((entry) => {
      const topic = topics.find((topic) => topic.key === entry.key && topic.source === entry.source);
      return topic ? [topic] : [];
    }).slice(-limit) : [];
    const recoveredKeys = new Set(recovered.map((topic) => topic.key));
    const recalled = recallMode(c) === "keyword" && state.count >= 2
      ? searchTopics(topics, state.query, readCached, limit).filter((topic) => !recoveredKeys.has(topic.key)) : [];
    const remaining = Math.max(0, boundedInteger(c.memory.injectMaxChars, 8000, Number.MAX_SAFE_INTEGER)
      - renderMemory(assembly).length - 2);
    return renderRecall([
      { heading: "压缩后曾查阅的主题 / Topics consulted before compaction (use memory_read):", topics: recovered },
      { heading: "可能相关的记忆，仅供参考 / Possibly relevant memory; verify with memory_read:", topics: recalled },
    ], Math.min(remaining, boundedInteger(c.memory.recallMaxChars, 1600, 8000)));
```

</details>

**依据 5 · 源码核查**：[index.js:406-425](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L406-L425)

宿主组装差异及兼容分支。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
    // Cooperate with agent-scoped middleware, including model selection.
    const assembly = await next();
    if (!recallEnabled() || !wantsRecallContext() || !supportsRecallContext()
      || !Array.isArray(assembly.contexts) || !Array.isArray(assembly.sections)) return assembly;
    const recall = assembly.contexts.find((entry) => entry.name === SECTION_RECALL);
    if (recall) {
      if (recall.interpolate === false) return assembly;
      // DSH 0.2.0-rc.2 discards context.interpolate. Substitute the resolved
      // recall as one variable: host interpolation does not rescan its value.
      // Newer hosts retain interpolate:false and refresh the provider directly.
      const variables = { ...assembly.variables };
      let variable = RECALL_VARIABLE;
      for (let i = 1; Object.hasOwn(variables, variable); i++) variable = `${RECALL_VARIABLE}_${i}`;
      variables[variable] = recall.text;
      return { ...assembly, variables, contexts: assembly.contexts.map((entry) =>
        entry === recall ? { ...entry, text: `{{${variable}}}` } : entry) };
    }
    if (assembly.sections.some((entry) => entry.name === SECTION_RECALL)) return assembly;
    const text = renderMemoryRecall(context);
```

</details>

#### 缺口

- 未验证不同宿主的最终系统提示。
  **影响**：不能断定每条主题在目标宿主都出现。
  **进一步探讨**：用已知 core 与主题核对实际组装内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久写入与卡片回退有什么采用代价？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

当前卡没有相应记忆时，读取候选链包含全局，而写入选择当前卡或默认全局。配置卡名相同不等于不同工作区数据完全隔离。memory_rewrite 用整段文本覆盖文件，空字符串可清除；工具的非并发声明和字节上限并未提供这里可见的版本回退。soul_update 更新设置文档中的完整卡片，需要 settings 服务。试用时应使用可备份的临时数据，观察记忆来源再允许一次已知改写。首次要整理卡片与数据，持续要复核主题和模型是否提出错误写入，恢复成本受备份影响。若引用了错误范围或写入覆盖了重要信息，先停用并从备份或原项目笔记恢复。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:248-267](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L248-L267)

卡与全局回退。

<details>
<summary>查看原文（20行）</summary>

```text
  const memoryScopes = (agent) => {
    const cardName = cardNameOf(agent);
    return cardName ? [cardName, "global"] : ["global"];
  };

  /** The memory scope ACTIVE for one agent (write target): card memory > global. */
  const memoryTarget = (agent, topic = "") => {
    const cardName = cardNameOf(agent);
    const scope = cardName ?? "global";
    return {
      ...memoryLayout.writeTarget(scope, { layered: layeredEnabled(), topic }),
      scope,
    };
  };

  /** First EXISTING memory along the chain (read/inject path). */
  const memoryReadChain = (agent, topic = "") => memoryLayout.readChain(memoryScopes(agent), {
    layered: layeredEnabled(),
    topic,
  });
```

</details>

**依据 2 · 源码核查**：[index.js:830-869](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L830-L869)

整文件覆盖、容量检查与直接写入。

<details>
<summary>查看原文（40行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "memory_rewrite",
    description:
      "REPLACE one memory file in your CURRENT scope. In layered mode, omit topic for always-visible core.md or pass a topic key for topics/<topic>.md. Use for consolidation: merge, deduplicate and reorganize entries. Build the new content from memory_read output unless you deliberately drop entries. Pass an empty string to clear the selected file.",
    parameters: {
      content: { type: "string", required: true, description: "The new full content of the memory file (markdown)." },
      topic: { type: "string", description: "Optional topic key in layered mode. Omit or pass core/core.md to replace core.md." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bytes: { type: "integer" },
          scope: { type: "string" },
          topic: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: `Memory rewritten (${value.bytes} bytes) in scope "${value.scope}"${value.topic ? ` topic "${value.topic}"` : ""}.` }],
    },
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      const agent = agentOf(exec);
      requireMemoryEnabled(agent);
      const content = String(args.content ?? "");
      const topic = normalizeMemoryTopic(args.topic);
      if (topic && !layeredEnabled()) {
        throw new Error("memory_rewrite: `topic` requires memory.layered to be enabled");
      }
      const bytes = byteLen(content);
      if (bytes > (cfg().memory?.maxBytes ?? 1024 * 1024)) {
        throw new Error(`memory_rewrite: content exceeds maxBytes (${cfg().memory.maxBytes})`);
      }
      const target = memoryTarget(agent, topic);
      await ensureParent(target.file);
      requireMemoryEnabled(agent);
      await writeFile(target.file, content, "utf8");
      fileCache.delete(target.file);
      rememberTopic(agentOf(exec), target.scope, target.topic);
      return { bytes, scope: target.scope, topic: target.topic };
```

</details>

**依据 3 · 源码核查**：[index.js:922-937](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L922-L937)

持久更新人设卡和 settings 缺失处理。

<details>
<summary>查看原文（16行）</summary>

```text
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      const content = String(args.content ?? "").trim();
      if (!content) throw new Error("soul_update: `content` must be non-empty");
      const bytes = byteLen(content);
      if (bytes > (cfg().soulMaxBytes ?? 64 * 1024)) {
        throw new Error(`soul_update: content exceeds soulMaxBytes (${cfg().soulMaxBytes})`);
      }
      const card = resolveCard(agentOf(exec));
      if (!card.name) throw new Error("soul_update: no persona card is active for this session");
      const c = cfg();
      const settings = ctx.get("settings");
      if (!settings) throw new Error("soul_update: settings service unavailable");
      const nextCards = { ...(c.cards ?? {}), [card.name]: content };
      await settings.update(NS, { ...c, cards: nextCards });
      return { bytes, persona: card.name };
```

</details>

#### 缺口

- 共享环境的实际写入竞争与恢复未验。
  **影响**：不能确认所有配置和文件能按预期回滚。
  **进一步探讨**：用临时存储对照单次改写和回退。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证缩短重复说明且未串入其他卡内容？

**研究主题**：新假设与验证

#### 完整回答

假设分层记忆比每轮手工贴笔记减少重复输入，同时维持卡片来源正确。准备两张只共享一条全局笔记的人设卡，在固定模型和任务中交叉切换会话。比较手工提供笔记与插件召回的正确引用、错卡引用、输入 token 和最终人工修正时间，再加入同义表达与缺失主题。若出现不合预期的全局回退、错误写入或复核抵消节省，就保留显式笔记流程。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:248-267](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L248-L267)

预设可核对的卡和全局来源。

<details>
<summary>查看原文（20行）</summary>

```text
  const memoryScopes = (agent) => {
    const cardName = cardNameOf(agent);
    return cardName ? [cardName, "global"] : ["global"];
  };

  /** The memory scope ACTIVE for one agent (write target): card memory > global. */
  const memoryTarget = (agent, topic = "") => {
    const cardName = cardNameOf(agent);
    const scope = cardName ?? "global";
    return {
      ...memoryLayout.writeTarget(scope, { layered: layeredEnabled(), topic }),
      scope,
    };
  };

  /** First EXISTING memory along the chain (read/inject path). */
  const memoryReadChain = (agent, topic = "") => memoryLayout.readChain(memoryScopes(agent), {
    layered: layeredEnabled(),
    topic,
  });
```

</details>

**依据 2 · 源码核查**：[index.js:376-396](https://github.com/Scorp1o117/dsh-soul-md/blob/c79c9734ee412e8f7dea0770b61d4fe941a73d1f/index.js#L376-L396)

词面召回和预算是可设定的实验条件。

<details>
<summary>查看原文（21行）</summary>

```text
  const renderMemoryRecall = (assembly) => {
    const c = cfg();
    if (!c.memory?.inject || !layeredEnabled(c) || disabledMemoryCard(assembly?.agent)
      || skipsSubagentSections(c, assembly?.agent)) return "";
    const state = stateOf(assembly?.agent);
    if (!state) return "";
    const topics = searchableTopics(assembly.agent);
    const limit = boundedInteger(c.memory.recallMaxTopics, 5, 20);
    const recovered = recoveryEnabled(c) && limit ? state.recovery.flatMap((entry) => {
      const topic = topics.find((topic) => topic.key === entry.key && topic.source === entry.source);
      return topic ? [topic] : [];
    }).slice(-limit) : [];
    const recoveredKeys = new Set(recovered.map((topic) => topic.key));
    const recalled = recallMode(c) === "keyword" && state.count >= 2
      ? searchTopics(topics, state.query, readCached, limit).filter((topic) => !recoveredKeys.has(topic.key)) : [];
    const remaining = Math.max(0, boundedInteger(c.memory.injectMaxChars, 8000, Number.MAX_SAFE_INTEGER)
      - renderMemory(assembly).length - 2);
    return renderRecall([
      { heading: "压缩后曾查阅的主题 / Topics consulted before compaction (use memory_read):", topics: recovered },
      { heading: "可能相关的记忆，仅供参考 / Possibly relevant memory; verify with memory_read:", topics: recalled },
    ], Math.min(remaining, boundedInteger(c.memory.recallMaxChars, 1600, 8000)));
```

</details>

#### 缺口

- 没有效果数据。
  **影响**：不能把插件架构写成收益。
  **进一步探讨**：保存固定提示、实际注入与人工核对结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
