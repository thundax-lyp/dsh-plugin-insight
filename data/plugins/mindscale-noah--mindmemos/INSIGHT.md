# MindMemOS

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[186db4a](https://github.com/mindscale-noah/MindMemOS/tree/186db4a75122b1d8691933f280bec10191c82c28)

<!-- BEGIN META -->
[![GitHub ★ 922](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=922&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mindscale-noah/MindMemOS)
<!-- END META -->

> **功能**：提供长期记忆服务、检索与写入接口，并通过CLI和Agent插件共享跨会话记忆。

> **亮点**：以共同记忆服务连接不同Agent，并把实体与属性检索结果结构化融合；相对手动项目笔记增加按需召回和自动写入，真实收益需同任务核验。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：项目密钥不自动认证请求中的个人user_id；完成回合异步写回只告警，不证明最终落库，CLI包装未见有界超时，不能将插件loaded当记忆可靠。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 跨Agent记忆对什么任务有用，较文件笔记多做什么？](#detail-section-11)
  - [Q02 · 项目身份、用户身份及自动读写分别怎样绑定？](#detail-section-12)
  - [Q03 · 自托管、自动写回和退出各承担什么？](#detail-section-13)
  - [Q04 · 共享请求上下文有哪些价值，写回完整性如何改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供需要跨会话和Agent复用偏好、项目事实与工具经验的团队使用。

按项目人工维护事实与偏好文件，或手工调用单一向量检索。自动化必须改善最终任务并避免混用，不能只比较召回条数。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 记忆add/search接口 | 持续知识保存与按需召回 | 服务、模型与存储需可用 |
| DSH自动接入 | 每轮召回和完成后写入 | 未完成回合不走该写回路径 |
| 结构化检索融合 | 合并实体与属性线索 | 代码存在不证明召回收益 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 服务地址与project绑定API key | 接入必需 | HTTP身份与算法选择 | 请求被拒绝或无可用服务 |
| 聊天、嵌入模型路由 | 自托管主要流程必需 | 抽取和语义检索 | 不应以默认配置假定可用 |
| Qdrant、Neo4j、Kafka | 核心本地依赖栈 | 记忆存储及异步工作 | 需运维、备份和一致性检查 |
| mindmemos CLI、宿主插件和明确userId | DSH自动接入 | 每轮召回与写回 | GUI PATH和身份范围需核对 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 部署者配置模型、存储与key | 显式add/search可回查 |
| 2 | 用户固定project/user并接入单一宿主 | 双用户样本不混淆 |
| 3 | 检查completed回合与失败写回 | 区分入队和落库，不只看插件loaded |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 数据库、队列与模型资源 | 部署路由、身份、维度和CLI | 耗时未知；云服务是另一路线 |
| 持续使用 | 抽取、embedding、检索和存储 | 纠正记忆、隐私范围与服务维护 | 无合格任务总成本 |
| 失败恢复 | 可能重复抽取和模型调用 | 对账入队、落库及回合日志 | 钩子失败仅警告，无此路径重试账本 |
| 退出迁移 | 导出和存储清理 | 停止自动写回、撤钥匙、核对删除 | 多存储删除一致性未验证 |

有记忆服务运维能力且存在重复跨任务知识的团队，可先用非敏感样本试用。不能用偏好例子证明重要业务记忆可靠；若自动纠错与用户隔离无法核对，先继续明确项目笔记或手动记忆。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 按需召回 | CLI搜索并带来源注入 | 错误记忆对最终任务影响 |
| 自动写回 | completed事件触发add | 入队后最终落库及故障恢复 |
| 结构检索 | 实体/属性融合代码 | 相对笔记的准确率、节时与成本 |

> **思考**：项目密钥不自动认证请求中的个人user_id；完成回合异步写回只告警，不证明最终落库，CLI包装未见有界超时，不能将插件loaded当记忆可靠。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以共同记忆服务连接不同Agent，并把实体与属性检索结果结构化融合；相对手动项目笔记增加按需召回和自动写入，真实收益需同任务核验。[Q01](#research-q01) [Q02](#research-q02)

服务层统一构造含project、算法与actor的request context，并将搜索结果与错误记录作为独立步骤；插件给注入消息加source标记，避免将自己召回的内容重新当新对话储存。这些职责划分值得借鉴，但身份是否最终强制过滤仍要沿存储链核查。CLI使用spawn参数数组和UTF-8环境减少shell解释与跨平台乱码，包装中未见超时或AbortSignal传递，所以检索挂住可能延长首步等待，不能把catch异常等同有界超时。

<a id="detail-section-5"></a>

### 1.4 主要限制

项目密钥不自动认证请求中的个人user_id；完成回合异步写回只告警，不证明最终落库，CLI包装未见有界超时，不能将插件loaded当记忆可靠。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

有记忆服务运维能力且有跨任务复用需求的团队可用非敏感双用户样本试用；先核对身份、最终写回和错误恢复；若混用范围与纠错无法确认，继续明确的项目笔记或手动记忆。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

服务身份映射、局部融合与DSH钩子已核查；隔离、最终写回、准确率和单位成本未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、plugins/deepseek-harness-plugin/src/index.ts、plugins/deepseek-harness-plugin/src/mindmemos-cli.ts、src/mindmemos/mindmemos/api/auth/api_key.py、src/mindmemos/mindmemos/api/mappers.py、src/mindmemos/mindmemos/api/services/memory_service.py、src/mindmemos/mindmemos/components/searcher/schema/_entity_fusion.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查API key、请求映射、服务接线、Schema检索融合与DSH插件；未完整审计记忆算法、存储隔离、删除和模型基准。
- 下一步：非敏感双项目/双用户任务测试范围隔离、记忆纠正、入队故障与重复事件，记录最终答案错误及运维时间。

**分析版本**

- **仓库**：[mindscale-noah/MindMemOS](https://github.com/mindscale-noah/MindMemOS)
- **版本号**：未声明（[固定提交 186db4a](https://github.com/mindscale-noah/MindMemOS/tree/186db4a75122b1d8691933f280bec10191c82c28)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按project/session/turn保存写回待办与最终状态，恢复先对账请求ID再重试，比较丢失与重复记忆；先核对服务已有能力，尚未验证。[Q04](#research-q04)

非敏感双项目/双用户任务测试范围隔离、记忆纠正、入队故障与重复事件，记录最终答案错误及运维时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 4304 | — | — | 26733 |
| .ts | source | 4 | 1315 | 1071 | 120 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mindscale-noah/MindMemOS/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/mindscale-noah/MindMemOS/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mindscale-noah/MindMemOS/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨Agent长期记忆能否支持可纠正知识复用，其身份与自动写回边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨Agent记忆对什么任务有用，较文件笔记多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在多会话和不同Agent中反复使用用户偏好、项目事实及工具经验的开发者。合格结果是检索出的记忆与当前人、项目和事实版本一致，并能纠正或删除错误内容；不只是向提示中塞入更多文本。简单替代是项目笔记或手工维护偏好文件。

MindMemOS提供共同HTTP服务、CLI和宿主钩子，让不同Agent读写同一记忆。源码中的SchemaSearchEntityFusionManager将实体检索与属性检索结果按entity_id合并、补充属性与来源；这是可检查的结构化融合步骤，但不能从融合代码推出检索准确率或纠错能力。README基准是作者报告，本次未复现；根组件包括记忆服务，不将DSH薄适配器等同全部算法贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-74](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/README.md#L54-L74)

作者说明跨Agent、记忆与Skill结合及接入方式。

<details>
<summary>查看原文（21行）</summary>

```text
## 🌟 Core Features

- **Portable across agents**: Persist user profiles, preferences, project facts, tool experience, and skill candidates as reusable assets, allowing OpenClaw, Hermes, Claude Code, OpenHands, and other agents to share or transfer the same long-term memory.
- **Self-evolving memory system**: Continuously improve memory quality through schema learning, dreaming, and feedback by automatically learning frequent memory patterns, consolidating memories offline, and using interaction corrections to optimize add/search workflows.
- **Memory and Skills integration**: Experience memories can be distilled into skill candidates, while skill execution results, failure traces, and user feedback flow back into the memory system to drive continuous skill evolution.
- **Plugin integrations**: Connect MindMemOS to different agents and workflows through plugins that retrieve and inject relevant memories before interactions and automatically write conversations back afterward. The [OpenClaw Plugin](https://www.npmjs.com/package/@mindmemos/openclaw-plugin) and [DeepSeek Harness Plugin](https://www.npmjs.com/package/@mindmemos/deepseek-harness-plugin) are currently available, with more integrations in progress.

<p align="center">
  <img src="./assets/mindmemos-benchmark-overview.png" alt="MindMemOS benchmark results overview">
</p>

## 🚀 Quick Start

MindMemOS offers **two deployment modes** (official cloud service, local self-hosting) and **three access methods** (HTTP API, Python SDK / CLI, agent plugin). Any combination works — server and client speak the same protocol:

| Access Method | Use Case | Cloud base_url | Local base_url |
| :--- | :--- | :--- | :--- |
| [HTTP API](https://mindmemos.cn/api-docs) | Call directly from business apps | `https://mindmemos.cn` | `http://127.0.0.1:8000` |
| [Python SDK / CLI](https://pypi.org/project/mindmemos-sdk/) | Integrate into business apps | `https://mindmemos.cn` | `http://127.0.0.1:8000` |
| [OpenClaw Plugin](https://www.npmjs.com/package/@mindmemos/openclaw-plugin) | Agent auto-recalls / writes memory | `https://mindmemos.cn` | `http://127.0.0.1:8000` |
| [DeepSeek Harness Plugin](https://www.npmjs.com/package/@mindmemos/deepseek-harness-plugin) | Agent auto-recalls / writes memory (dsh) | `https://mindmemos.cn` | `http://127.0.0.1:8000` |
```

</details>

**依据 2 · 源码核查**：[src/mindmemos/mindmemos/components/searcher/schema/_entity_fusion.py:21-94](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/components/searcher/schema/_entity_fusion.py#L21-L94)

实体和属性检索按ID融合并保留来源。

<details>
<summary>查看原文（74行）</summary>

```text
    def fuse_entities(
        self,
        entity_results: list[TemporalEntity],
        property_results: list[TemporalEntity],
    ) -> list[TemporalEntity]:
        """Handle fuse entities."""
        if not entity_results and not property_results:
            return []

        if not entity_results:
            logger.info("fusion_shortcut", reason="only_property_results")
            return property_results

        if not property_results:
            logger.info("fusion_shortcut", reason="only_entity_results")
            return entity_results

        entity_dict: dict[str, TemporalEntity] = {}
        merged_count = 0
        extended_count = 0

        for entity in entity_results:
            if entity and entity.entity_id:
                entity_dict[entity.entity_id] = entity
                entity._fusion_sources = ["entity_search"]

        for prop_entity in property_results:
            if not prop_entity or not prop_entity.entity_id:
                continue

            entity_id = prop_entity.entity_id

            if entity_id in entity_dict:
                existing_entity = entity_dict[entity_id]
                self._merge_entity_properties(existing_entity, prop_entity)

                if hasattr(existing_entity, "_fusion_sources"):
                    existing_entity._fusion_sources.append("property_search")
                else:
                    existing_entity._fusion_sources = ["entity_search", "property_search"]

                merged_count += 1
                logger.debug("merge_entity_properties", entity_name=existing_entity.name)
            else:
                prop_entity._fusion_sources = ["property_search"]
                entity_dict[entity_id] = prop_entity
                extended_count += 1
                logger.debug("extend_new_entity", entity_name=prop_entity.name)

        result_entities: list[TemporalEntity] = []

        for entity in entity_results:
            if entity and entity.entity_id and entity.entity_id in entity_dict:
                result_entities.append(entity_dict[entity.entity_id])
                del entity_dict[entity.entity_id]

        additional_entities = list(entity_dict.values())
        if additional_entities:
            additional_entities.sort(
                key=lambda e: getattr(e, "_property_search_score", 0.0),
                reverse=True,
            )
            result_entities.extend(additional_entities)

        logger.info(
            "fusion_complete",
            entity_count=len(entity_results),
            property_count=len(property_results),
            merged=merged_count,
            extended=extended_count,
            total=len(result_entities),
        )

        return result_entities
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 项目身份、用户身份及自动读写分别怎样绑定？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

API key provider按配置查找密钥，拒绝未知或禁用key，返回绑定project_id、算法和scopes。请求mapper从auth取project_id，却从请求的actor字段取user_id；这说明项目身份与用户筛选是不同层次，不能把user_id字段当已认证个人身份。未完整核对各存储层过滤，不能宣称或否定跨用户隔离。

DSH前置钩子仅在首步搜索，按可选userId、appId、sessionId传CLI，搜索错误记录警告后继续原决策。turn/end只有completed时采集消息并异步add，错误只告警；中断或失败回合不在这条写回路径，async入队返回也不等于记忆已抽取落库。userId省略时配置注释明确允许项目范围搜索，团队应先明确共享范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/mindmemos/mindmemos/api/auth/api_key.py:43-58](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/auth/api_key.py#L43-L58)

key校验并绑定项目与scope。

<details>
<summary>查看原文（16行）</summary>

```text
    @traced("auth.api_key.resolve", record_args=False, record_result=False)
    def resolve_api_key(self, api_key: str) -> ResolvedIdentity:
        self._reload_if_changed()
        entry = self._entries.get(api_key)
        if entry is None:
            raise AuthenticationError("invalid api key", code="auth.invalid_api_key")
        if not entry.enabled:
            raise AuthenticationError("api key is disabled", code="auth.api_key_disabled")
        return ResolvedIdentity(
            key_id=entry.key_id,
            project_id=entry.project_id,
            memory_algorithm=entry.memory_algorithm,
            scopes=list(entry.scopes),
            user_override_config=entry.user_override_config,
            project_override_config=entry.project_override_config,
        )
```

</details>

**依据 2 · 源码核查**：[src/mindmemos/mindmemos/api/mappers.py:192-226](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/mappers.py#L192-L226)

project来自auth，actor来自请求。

<details>
<summary>查看原文（35行）</summary>

```text
def to_memory_request_context(
    auth: AuthContext,
    identity: AddRequest
    | SearchRequest
    | FeedbackRequest
    | DreamingRequest
    | MemoryPageRequest
    | MemoryScrollRequest
    | UpdateRequest
    | None = None,
    *,
    require_user_id: bool = False,
) -> MemoryRequestContext:
    """Build pipeline request context from auth and optional actor identity.

    Args:
        auth: Security context resolved by API dependencies.
        identity: Optional request model carrying actor identity fields.
        require_user_id: Whether the merged actor identity must include ``user_id``.

    Returns:
        The resolved memory request context.
    """

    resolved_actor = {field: getattr(identity, field, None) for field in _ACTOR_FIELDS} if identity is not None else {}
    if require_user_id and not resolved_actor.get("user_id"):
        raise BadRequestError("user_id is required in request body", code="missing_user_id")
    return MemoryRequestContext(
        request_id=auth.request_id,
        account_id=auth.account_id,
        project_id=auth.project_id,
        api_key_uuid=auth.api_key_uuid,
        memory_algorithm=auth.memory_algorithm,
        scopes=auth.scopes,
        **resolved_actor,
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-plugin/src/index.ts:69-100](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/index.ts#L69-L100)

userId可选且async默认。

<details>
<summary>查看原文（32行）</summary>

```text
export interface Config {
  /** Executable used to invoke the CLI — a name on `PATH` or an absolute path, not a shell command with arguments. */
  cli: string;
  /** Number of memories injected per turn. */
  topK: number;
  /** Optional strict token budget for recall; enables token-budget retention when set. */
  tokenBudget?: number;
  /** `sync` blocks until extraction finishes; `async` enqueues and returns. */
  addMode: "sync" | "async";
  /** Scopes search and add to one user; omit for project-wide search. */
  userId?: string;
  /** Application scope attached to every search and add. */
  appId: string;
  /** Override the harness session id used as the CLI session scope. */
  sessionId?: string;
  /** Skip recall for prompts shorter than this many characters. */
  minQueryLength: number;
  /** Cap on how many trailing messages are persisted per turn. */
  maxConversationMessages: number;
}

/** Schemastery schema for {@link Config}; cordis validates and defaults the entry config with it. */
export const Config: z<Config> = z.object({
  cli: z.string().default("mindmemos"),
  topK: z.natural().min(1).default(5),
  tokenBudget: z.natural().min(1),
  addMode: z.union([z.const("sync"), z.const("async")]).default("async"),
  userId: z.string(),
  appId: z.string().default("deepseek-harness"),
  sessionId: z.string(),
  minQueryLength: z.natural().min(1).default(2),
  maxConversationMessages: z.natural().min(1).default(80),
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness-plugin/src/index.ts:103-179](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/index.ts#L103-L179)

召回与completed回合写回的实际失败处理。

<details>
<summary>查看原文（77行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // Recall: search and inject memories before the first step of each turn.
  // `agent/pre-step` is a waterfall; prepending lets our injection land ahead of
  // later listeners while preserving whatever messages `next()` already claimed.
  ctx.on(
    "agent/pre-step",
    async ({ agent, messages, step, signal }, next) => {
      const decision = await next();
      if (step !== 1) {
        return decision;
      }
      if (decision.kind === "reject" || signal.aborted) {
        return decision;
      }

      const query = extractQuery(messages);
      if (query.length < config.minQueryLength) {
        return decision;
      }

      try {
        const sessionId = resolveSessionId(config, agentSessionId(agent));
        const result = await searchMemories(config, query, sessionId);
        const context = formatMemoryContext(result.memories ?? [], config.userId);
        if (!context) {
          return decision;
        }

        ctx.logger(name).info(
          `recall hit ${result.memories?.length ?? 0} memories, injected ${context.length} chars`,
        );
        return {
          kind: "enter",
          messages: [
            ...decision.messages,
            createUserMessage({
              content: [{ type: "text", text: context }],
              source: {
                kind: "plugin",
                plugin: name,
                form: "snapshot",
                sections: [{ name, text: context }],
              },
            }),
          ],
        };
      } catch (error) {
        ctx.logger(name).warn(`memory search failed: ${errorMessage(error)}`);
        return decision;
      }
    },
    { prepend: true },
  );

  // Store: on each completed turn, persist that turn's messages. The session log
  // is the source of truth, so no client-side buffer is kept in sync — earlier
  // turns were stored by their own `turn/end`. Injected memory context carries
  // `source.kind === "plugin"` and is excluded to avoid storing our own recall.
  ctx.on("session/event", (session, event) => {
    if (event.type !== "turn/end" || event.data.reason.kind !== "completed") {
      return;
    }
    const messages = collectTurnMessages(session, event.data.turn, config.maxConversationMessages);
    if (messages.length === 0) {
      return;
    }

    const sessionId = resolveSessionId(config, String(session.id));
    void addConversation(config, messages, sessionId)
      .then(() => {
        ctx.logger(name).info(
          `stored ${messages.length} message(s) from turn ${event.data.turn} (session_id=${sessionId})`,
        );
      })
      .catch((error: unknown) => {
        ctx.logger(name).warn(`memory add failed: ${errorMessage(error)}`);
      });
```

</details>

**依据 5 · 源码核查**：[plugins/deepseek-harness-plugin/src/index.ts:185-214](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/index.ts#L185-L214)

CLI实际传入范围和异步参数。

<details>
<summary>查看原文（30行）</summary>

```text
async function searchMemories(config: Config, query: string, sessionId: string): Promise<MemorySearchResult> {
  const args = ["memory", "search", query, "--top-k", String(config.topK), "--json"];
  if (config.tokenBudget) {
    args.push("--token-budget", String(config.tokenBudget));
  }
  args.push("--app-id", config.appId, "--session-id", sessionId);
  if (config.userId) {
    args.push("--user-id", config.userId);
  }
  return spawnFileJson<MemorySearchResult>(config.cli, args);
}

async function addConversation(config: Config, messages: MemoryMessage[], sessionId: string): Promise<void> {
  const args = ["memory", "add", "--messages-json-file", "-", "--json"];
  args.push("--app-id", config.appId, "--session-id", sessionId);
  if (config.addMode === "async") {
    args.push("--async");
  }
  if (config.userId) {
    args.push("--user-id", config.userId);
  }
  const skillContext = detectSkillContext(messages);
  if (skillContext.length > 0) {
    args.push("--skill-context-json", JSON.stringify(skillContext));
  }
  args.push("--metadata-json", JSON.stringify({ source: "deepseek-harness-plugin" }));
  // The structured tool-call fields are detection-only; strip them so the CLI
  // sees the same message shape it always has.
  const payload = messages.map(({ role, content, timestamp }) => ({ role, content, timestamp }));
  await spawnFileOk(config.cli, args, `${JSON.stringify(payload)}\n`);
```

</details>

**依据 6 · 源码核查**：[src/mindmemos/mindmemos/api/services/memory_service.py:159-186](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/services/memory_service.py#L159-L186)

add需要user_id并选择对应pipeline。

<details>
<summary>查看原文（28行）</summary>

```text
    async def add(
        self,
        auth: AuthContext,
        request: AddRequest,
    ) -> AddPipelineSyncResult | AddPipelineAsyncResult:
        """Run the add pipeline according to the requested mode."""

        # Stamp request identity onto the handler-root span so downstream LLM spans
        # (which live in this trace, not the auth dependency's trace) are attributable.
        annotate_request_trace(auth)
        pipeline, _add_pipeline_name = self._add_pipeline_for_auth(auth)
        if pipeline is None:
            raise NotImplementedError("add pipeline implementation is not wired yet")
        ctx = to_memory_request_context(auth, request, require_user_id=True)
        payload = to_add_pipeline_input(request)
        add_record_id = str(uuid4())
        request_submitted_at = utcnow()
        config_ctx = await self._provider_config_context(ctx)
        with config_ctx:
            skill_bindings = await self._bind_skill_context(ctx.project_id, add_record_id, request.skill_context)
            return await self._add_with_context(
                pipeline,
                payload,
                ctx,
                request,
                add_record_id,
                request_submitted_at,
                skill_bindings,
```

</details>

**依据 7 · 源码核查**：[src/mindmemos/mindmemos/api/services/memory_service.py:448-496](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/services/memory_service.py#L448-L496)

搜索pipeline与记录异常分离。

<details>
<summary>查看原文（49行）</summary>

```text
    async def search(
        self,
        auth: AuthContext,
        request: SearchRequest,
    ) -> SearchPipelineResult:
        """Run the search pipeline."""

        # Stamp request identity onto the handler-root span so downstream LLM spans
        # (which live in this trace, not the auth dependency's trace) are attributable.
        annotate_request_trace(auth)
        ctx = to_memory_request_context(auth, request)
        binding = binding_for_memory_algorithm(auth.memory_algorithm)
        payload = to_search_pipeline_input(request, search_pipeline=binding.search_pipeline)
        pipeline = self._pipeline("_search")
        if pipeline is None:
            raise NotImplementedError("search pipeline implementation is not wired yet")
        config_ctx = await self._provider_config_context(ctx)
        with config_ctx:
            return await self._search_with_context(pipeline, payload, ctx)

    async def _search_with_context(self, pipeline: SearchPipeline, payload, ctx) -> SearchPipelineResult:
        request_submitted_at = utcnow()
        try:
            result = await pipeline.search(payload, ctx)
        except Exception:
            task_completed_at = utcnow()
            await suppress_recording_errors(
                self._recorder.record_search(
                    payload,
                    None,
                    ctx=ctx,
                    request_submitted_at=request_submitted_at,
                    task_completed_at=task_completed_at,
                ),
                operation="search",
            )
            raise
        task_completed_at = utcnow()
        await suppress_recording_errors(
            self._recorder.record_search(
                payload,
                result,
                ctx=ctx,
                request_submitted_at=request_submitted_at,
                task_completed_at=task_completed_at,
            ),
            operation="search",
        )
        return result
```

</details>

#### 缺口

- 未核对全部持久层强制过滤、异步入队至落库确认及停机恢复。
  **影响**：不保证用户隔离完整或每个已完成回合最终可召回。
  **进一步探讨**：用两个user与项目、故障入队和重启场景核查检索结果及请求ID落位。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自托管、自动写回和退出各承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 服务地址与project绑定API key | 接入必需 | HTTP身份与算法选择 | 请求被拒绝或无可用服务 |
| 聊天、嵌入模型路由 | 自托管主要流程必需 | 抽取和语义检索 | 不应以默认配置假定可用 |
| Qdrant、Neo4j、Kafka | 核心本地依赖栈 | 记忆存储及异步工作 | 需运维、备份和一致性检查 |
| mindmemos CLI、宿主插件和明确userId | DSH自动接入 | 每轮召回与写回 | GUI PATH和身份范围需核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 部署者配置模型、存储与key | 显式add/search可回查 |
| 2 | 用户固定project/user并接入单一宿主 | 双用户样本不混淆 |
| 3 | 检查completed回合与失败写回 | 区分入队和落库，不只看插件loaded |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 数据库、队列与模型资源 | 部署路由、身份、维度和CLI | 耗时未知；云服务是另一路线 |
| 持续使用 | 抽取、embedding、检索和存储 | 纠正记忆、隐私范围与服务维护 | 无合格任务总成本 |
| 失败恢复 | 可能重复抽取和模型调用 | 对账入队、落库及回合日志 | 钩子失败仅警告，无此路径重试账本 |
| 退出迁移 | 导出和存储清理 | 停止自动写回、撤钥匙、核对删除 | 多存储删除一致性未验证 |

有记忆服务运维能力且存在重复跨任务知识的团队，可先用非敏感样本试用。不能用偏好例子证明重要业务记忆可靠；若自动纠错与用户隔离无法核对，先继续明确项目笔记或手动记忆。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-114](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/README.md#L78-L114)

模型配置、向量维度与核心Docker依赖。

<details>
<summary>查看原文（37行）</summary>

````text
### 1. Local Deployment

MindMemOS uses `uv` to manage dependencies and run local commands. For detailed configuration instructions, see [docs/deploy/instruction.md](docs/deploy/instruction.md).

#### 1.1 Prepare Configuration Files

```bash
cp .env.example .env
cp config/mindmemos/dev.example.yaml config/mindmemos/dev.yaml
```

Before startup, configure at least the following three model routers in `config/mindmemos/dev.yaml`:

- `chat_model_router`: supports memory extraction, Skill evolution, and other generation tasks.
- `embed_model_router`: generates semantic embeddings; make sure its dimensions match the Qdrant dimension configuration.
- `rerank_model_router`: optional; reranks memory retrieval results.

The schema memory-extraction flow is versioned: `algo_config.add.schema.version` defaults to `v2` (rule-based graph fusion) and can be pinned to `v1` (develop-compatible flow) per project. Storage is compatible in both directions; see the deployment guide for binding and effective timing.

Configure an API key and its bound `project_id` in `config/mindmemos/api_keys.yaml`.

#### 1.2 Start the Service

Start the local service:

```bash
make dev
```

`make dev` starts the full Docker dependency stack before starting FastAPI.

To start only core dependencies:

```bash
make dev-core          # Qdrant + Neo4j + Kafka
make db-observability  # Qdrant + Neo4j + Kafka + ClickHouse + OTel + Grafana
```
````

</details>

**依据 2 · 作者声明**：[README.md:184-190](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/README.md#L184-L190)

SDK配置和user可覆盖的说明。

````text
The configuration is saved to `~/.mindmemos/settings.json`. Check the current configuration with:

```bash
mindmemos config show
```

The local service automatically determines the `project_id` and memory algorithm from the API key, so SDK calls do not need to pass `project_id`. The `user_id` distinguishes users within the same project and can be overridden in an individual `add` or `search` call.
````

**依据 3 · 源码核查**：[plugins/deepseek-harness-plugin/src/index.ts:157-179](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/index.ts#L157-L179)

写回异常仅记录警告。

<details>
<summary>查看原文（23行）</summary>

```text
  // Store: on each completed turn, persist that turn's messages. The session log
  // is the source of truth, so no client-side buffer is kept in sync — earlier
  // turns were stored by their own `turn/end`. Injected memory context carries
  // `source.kind === "plugin"` and is excluded to avoid storing our own recall.
  ctx.on("session/event", (session, event) => {
    if (event.type !== "turn/end" || event.data.reason.kind !== "completed") {
      return;
    }
    const messages = collectTurnMessages(session, event.data.turn, config.maxConversationMessages);
    if (messages.length === 0) {
      return;
    }

    const sessionId = resolveSessionId(config, String(session.id));
    void addConversation(config, messages, sessionId)
      .then(() => {
        ctx.logger(name).info(
          `stored ${messages.length} message(s) from turn ${event.data.turn} (session_id=${sessionId})`,
        );
      })
      .catch((error: unknown) => {
        ctx.logger(name).warn(`memory add failed: ${errorMessage(error)}`);
      });
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness-plugin/src/mindmemos-cli.ts:23-66](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/mindmemos-cli.ts#L23-L66)

CLI子进程包装和输出处理。

<details>
<summary>查看原文（44行）</summary>

```text
function spawnFile(command: string, args: string[], stdin?: string): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      // The MindMemOS CLI is Python. On Windows, Python encodes its standard
      // streams with the ANSI code page (e.g. GBK/cp936) when they are not a
      // TTY, so piping here would corrupt non-ASCII output — and read our UTF-8
      // stdin (for `--messages-json-file -`) back as that same code page.
      // Force UTF-8 on all three streams so the `utf-8` decoding below and the
      // UTF-8 stdin round-trip correctly regardless of locale.
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONUTF8: "1",
      },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf-8");
    child.stderr.setEncoding("utf-8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`mindmemos exited with code ${code}: ${stderr || stdout}`.trim()));
    });

    if (stdin !== undefined) {
      child.stdin.end(stdin);
    } else {
      child.stdin.end();
    }
  });
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 共享请求上下文有哪些价值，写回完整性如何改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

服务层统一构造含project、算法与actor的request context，并将搜索结果与错误记录作为独立步骤；插件给注入消息加source标记，避免将自己召回的内容重新当新对话储存。这些职责划分值得借鉴，但身份是否最终强制过滤仍要沿存储链核查。CLI使用spawn参数数组和UTF-8环境减少shell解释与跨平台乱码，包装中未见超时或AbortSignal传递，所以检索挂住可能延长首步等待，不能把catch异常等同有界超时。

未验证假设是增加按project/session/turn绑定的写回待办记录与最终落库状态，恢复时先查询请求ID再重试，避免仅日志告警或重复抽取。最小对照在CLI挂起、入队后停机、同回合重复事件下比较丢失、重复记忆和人工处理时间；若服务本已提供相同幂等与状态能力，应直接复用，不再造队列。

#### 证据与依据

**依据 1 · 源码核查**：[src/mindmemos/mindmemos/api/mappers.py:216-226](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/mappers.py#L216-L226)

集中构造请求context。

<details>
<summary>查看原文（11行）</summary>

```text
    resolved_actor = {field: getattr(identity, field, None) for field in _ACTOR_FIELDS} if identity is not None else {}
    if require_user_id and not resolved_actor.get("user_id"):
        raise BadRequestError("user_id is required in request body", code="missing_user_id")
    return MemoryRequestContext(
        request_id=auth.request_id,
        account_id=auth.account_id,
        project_id=auth.project_id,
        api_key_uuid=auth.api_key_uuid,
        memory_algorithm=auth.memory_algorithm,
        scopes=auth.scopes,
        **resolved_actor,
```

</details>

**依据 2 · 源码核查**：[src/mindmemos/mindmemos/api/services/memory_service.py:468-496](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/src/mindmemos/mindmemos/api/services/memory_service.py#L468-L496)

搜索结果和录制错误边界。

<details>
<summary>查看原文（29行）</summary>

```text
    async def _search_with_context(self, pipeline: SearchPipeline, payload, ctx) -> SearchPipelineResult:
        request_submitted_at = utcnow()
        try:
            result = await pipeline.search(payload, ctx)
        except Exception:
            task_completed_at = utcnow()
            await suppress_recording_errors(
                self._recorder.record_search(
                    payload,
                    None,
                    ctx=ctx,
                    request_submitted_at=request_submitted_at,
                    task_completed_at=task_completed_at,
                ),
                operation="search",
            )
            raise
        task_completed_at = utcnow()
        await suppress_recording_errors(
            self._recorder.record_search(
                payload,
                result,
                ctx=ctx,
                request_submitted_at=request_submitted_at,
                task_completed_at=task_completed_at,
            ),
            operation="search",
        )
        return result
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-plugin/src/index.ts:157-165](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/index.ts#L157-L165)

持久化会话日志与排除注入内容的设计说明。

```text
  // Store: on each completed turn, persist that turn's messages. The session log
  // is the source of truth, so no client-side buffer is kept in sync — earlier
  // turns were stored by their own `turn/end`. Injected memory context carries
  // `source.kind === "plugin"` and is excluded to avoid storing our own recall.
  ctx.on("session/event", (session, event) => {
    if (event.type !== "turn/end" || event.data.reason.kind !== "completed") {
      return;
    }
    const messages = collectTurnMessages(session, event.data.turn, config.maxConversationMessages);
```

**依据 4 · 源码核查**：[plugins/deepseek-harness-plugin/src/mindmemos-cli.ts:23-66](https://github.com/mindscale-noah/MindMemOS/blob/186db4a75122b1d8691933f280bec10191c82c28/plugins/deepseek-harness-plugin/src/mindmemos-cli.ts#L23-L66)

spawn使用参数数组、UTF8，未实现超时/abort。

<details>
<summary>查看原文（44行）</summary>

```text
function spawnFile(command: string, args: string[], stdin?: string): Promise<SpawnResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      // The MindMemOS CLI is Python. On Windows, Python encodes its standard
      // streams with the ANSI code page (e.g. GBK/cp936) when they are not a
      // TTY, so piping here would corrupt non-ASCII output — and read our UTF-8
      // stdin (for `--messages-json-file -`) back as that same code page.
      // Force UTF-8 on all three streams so the `utf-8` decoding below and the
      // UTF-8 stdin round-trip correctly regardless of locale.
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONUTF8: "1",
      },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf-8");
    child.stderr.setEncoding("utf-8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`mindmemos exited with code ${code}: ${stderr || stdout}`.trim()));
    });

    if (stdin !== undefined) {
      child.stdin.end(stdin);
    } else {
      child.stdin.end();
    }
  });
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
