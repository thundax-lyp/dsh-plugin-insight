# Capital Generation

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[a12175c](https://github.com/v587d/capital-generation/tree/a12175c5ef728cfa5f97e6221f9f7a312c439781)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/v587d/capital-generation) [![npm 30d 8,947](https://img.shields.io/static/v1?label=npm+30d&message=8%2C947&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@v587d/capital-generation) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@v587d/capital-generation)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供投研 Agent 预设、数据整理、图表及定时简报。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，预设把结构化数据引用和图表交付分到可追踪的角色流程，给核对跨来源材料留下定位。

> **主要限制**：[Q01](#research-q01) 的数据能力与实际可用不同，[Q03](#research-q03) 的无人值守限制依赖宿主提供调用门禁。

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
  - [Q01 · 投研会话怎么实际加载数据能力？](#detail-section-11)
  - [Q02 · 图表怎样保留来源和授权？](#detail-section-12)
  - [Q03 · 定时任务如何避免重复和资源越界？](#detail-section-13)
  - [Q04 · 怎样在可复核范围评估采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复整理公开公司材料的研究人员，可以用自动模式组织采集结果和图表，再逐条核对口径。

原办法是手工从公告与公开来源整理日期、单位和引用。对少量材料，这一方式容易复核且依赖较少。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 采集预设 | 组织公开资料请求 | 受凭据和外部服务影响 |
| 图表 | 连接数据源和报告卡片 | 单独校验真实数值和来源 |
| 自动化 | 到期新建投研会话 | 需支持的宿主和可用日历 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 角色与 tools | 预设必需 | 处理数据与交付 | 工具可能不挂载 |
| 各来源凭据和数据接口 | 对应操作必需 | 取资料或 OCR | 来源报告失败 |
| sessionController 与工作区 | 自动化必需 | 启动后台会话 | 记录运行失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对一个公开样例和原件 | 冻结日期和口径 |
| 验收 | 读取回执并比对材料事实 | 原件能追溯，差异解释清楚 |
| 退出 | 停用自动化并改回人工核对 | 检查无仍在运行的任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 工作区和依赖资源 | 配置预设与单来源 | 实际耗时未知 |
| 持续使用 | 模型、数据、OCR 和存储资源 | 核对日期、数字和自动运行 | 实际费用未知 |
| 失败恢复 | 可能产生重复取数 | 回看原件、停止自动化 | 恢复时长未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 数据整理 | 角色授权和 DatasetRef | 实际可用性、完整性 |
| 图表 | 来源令牌与结果登记 | 页面和数值正确性 |
| 自动任务 | 调度状态和部分权限控制 | 重启、费用和整体兼容 |

> **思考**：[Q01](#research-q01) 的数据能力与实际可用不同，[Q03](#research-q03) 的无人值守限制依赖宿主提供调用门禁。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，预设把结构化数据引用和图表交付分到可追踪的角色流程，给核对跨来源材料留下定位。

[Q02](#research-q02) 将可读形状、会话与期限联合检查；[Q03](#research-q03) 以状态区分漏跑和重复，便于人工补查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 的数据能力与实际可用不同，[Q03](#research-q03) 的无人值守限制依赖宿主提供调用门禁。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察固定公告信息能否逐项回到来源，遇到时点不符或缺原件就退回手工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可追踪角色、数据和部分自动运行。外部服务可用性、报告正确性及成本仍待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、preset/capital-generation/agent.patch.yml、src/collect-entry.ts、src/index.ts、src/data-collector/tools.ts、src/chart/source-token.ts、src/chart/present-tool.ts、automation/scheduler.js、automation/runner.js、automation/policy.js、README.md、src/retriever-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主接线、采集契约、图表授权、自动化执行边界。所有在线来源、模型数据与投资结果均未验证，也未逐一调查所有可选技能。
- 下一步：使用同一公开材料比较手工与预设，记录耗时、有效引用和缺失口径，另按 [Q03](#research-q03) 验证租期和门禁边界。

**分析版本**

- **仓库**：[v587d/capital-generation](https://github.com/v587d/capital-generation)
- **版本号**：2.24.0（[固定提交 a12175c](https://github.com/v587d/capital-generation/tree/a12175c5ef728cfa5f97e6221f9f7a312c439781)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按每条结论留来源、采集时间和缺失状态的核验清单，以同一任务比较人工核对成本和错误发现率。

使用同一公开材料比较手工与预设，记录耗时、有效引用和缺失口径，另按 [Q03](#research-q03) 验证租期和门禁边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 364 | 38910 | — | — | 483060 |
| .js | source | 118 | 38830 | 35795 | 2313 | — |
| .cjs | source | 4 | 9809 | 9025 | 397 | — |
| .mjs | source | 35 | 5739 | 4918 | 527 | — |
| .ts | source | 82 | 27099 | 23251 | 1996 | — |
| .mjs | test | 108 | 38373 | 33027 | 2725 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/v587d/capital-generation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/v587d/capital-generation/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)

暂未获取：近30天关闭。

统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同一公开投研资料能否被整理成可逐项核对的报告，并在凭据、时效和自动运行边界外安全退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 投研会话怎么实际加载数据能力？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复从多份公开材料整理公司事件的研究人员，可以让宿主中的 preset 把资料采集与输出交付分开，再抽查原件。原办法是浏览公告和行情网页，把日期、单位及来源手工写入表格。包明确挂两份补丁，宿主侧注册配置和自动化，实际发行的 preset 对应角色入口挂 tools/collect；代码中能注册全部工具的根 apply 有说明，发行预设不把这个入口作为实际角色接线。采集工具调用检查会话资格、固定 capability 名称及参数和 task_id，由 Hub 返回 DatasetRef。工具说明将默认缓存复用和明确 force_refresh 分开，并让会话/能力耗尽预算后报告终止。能力可见与凭据就绪分别核查，看到能力名并不保证能取数据。最终结论的来源、日期、口径和算术仍要从数据及原材料核验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:131-141](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/package.json#L131-L141)

包明确加载宿主和 Agent 两份补丁。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./preset/capital-generation/agent.patch.yml"
      ]
    }
  },
  "scripts": {
    "clean": "node -e \"import('node:fs').then(({ rmSync }) => rmSync('lib', { recursive: true, force: true }))\"",
    "build": "npm run clean && tsc && node scripts/copy-assets.mjs && npm run build:client && npm run build:config-client && npm run build:watchlist-client && npm run build:automation-client",
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:27-43](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/cordis.patch.yml#L27-L43)

宿主设置和图表挂载。

<details>
<summary>查看原文（17行）</summary>

```text
- insert:
    - id: capital-config
      name: './config/index.js'
      config:
        customPersona: ''
        fuyaoCredentialRef: FUYAO_API_KEY
        retriever:
          baseURL: ''
          credentialRef: ANYSEARCH_API_KEY
          windDocs:
            endpoint: 'https://mcp.wind.com.cn/vserver_financial_docs/mcp/'
            credentialRef: WIND_API_KEY
            timeoutMs: 60000

- insert:
    - id: capital-charts
      name: './chart-ui/index.js'
```

</details>

**依据 3 · 源码核查**：[preset/capital-generation/agent.patch.yml:106-117](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/preset/capital-generation/agent.patch.yml#L106-L117)

发行预设使用采集子路径。

<details>
<summary>查看原文（12行）</summary>

```text
            group: true
            isolate:
              dataCollectorHub: true
              datasetStore: true
            config:
              # Family row: hub + 132 sources + the collect tools; `tools/time` sits outside the realm (own store).
              - id: capital-collect-tools
                name: '@v587d/capital-generation/tools/collect'

          - id: capital-time-tools
            name: '@v587d/capital-generation/tools/time'

```

</details>

**依据 4 · 源码核查**：[src/collect-entry.ts:8-19](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/collect-entry.ts#L8-L19)

角色入口实际构建采集与注册工具。

<details>
<summary>查看原文（12行）</summary>

```text
import { createCollectorRuntime } from './collector-runtime.js'
import { registerDataCollectorTools } from './data-collector/tools.js'
import { readCollectorConfig } from './capital-settings.js'

export const name = 'capital-collect-tools'
export const inject = ['tools']

export function apply(ctx: Context): void {
  const config = readCollectorConfig(ctx)
  const { hub, diagnostics } = createCollectorRuntime(ctx, config)
  registerDataCollectorTools(ctx, hub, diagnostics)
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:171-179](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/index.ts#L171-L179)

根工具聚合入口与实际发行角色的范围。

```text
  // Same construction as the `tools/collect` row.
  const { store, hub: collectorHub, diagnostics: collectorDiagnostics } = createCollectorRuntime(ctx, {
    fuyaoCredentialRef: effectiveConfig.fuyaoCredentialRef,
    ftshareCredentialRef: effectiveConfig.ftshareCredentialRef,
    windCredentialRef: effectiveConfig.retriever?.windDocs?.credentialRef,
  })
  // Monolith carrier registers every family explicitly; no shipped preset mounts this entry.
  registerDataCollectorTools(ctx, collectorHub, collectorDiagnostics)
  registerTimeTool(ctx, store)
```

**依据 6 · 源码核查**：[src/data-collector/tools.ts:194-244](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/data-collector/tools.ts#L194-L244)

授权、请求参数、回执与耗尽预算的实际处理。

<details>
<summary>查看原文（51行）</summary>

```text
    tool(
      'request_data',
      '向数据管道请求数据：宿主先按 capability+params 校验当前 session 的已验证 manifest；force_refresh=false 或省略且命中未过期、满足该来源缓存新鲜度的 Dataset 时直接返回已有 DatasetRef，不访问上游；force_refresh=true 才重新取数并生成新的不可变 Dataset（默认保留 7 天），绝不覆盖旧 Dataset。明确要现在/最新的行情快照时请用 force_refresh=true，7 天是保留期而非实时新鲜度。本工具只返回 DatasetRef（dataset_id / artifact_ref / schema / row_count / captured_at / retention_until 等元数据），绝不返回原始数据行。capability 必须是 list_capabilities 返回的短能力名（如 ticker_search / quote / history / trading_calendar），params 必须按 describe_capability({ capability }) 返回的 input_schema 填写。若返回 request_params_invalid，先重新调用 describe_capability({ capability: "<当前能力名>" })，再按 schema 修正并重试一次；不要凭记忆猜参数。可重试上游失败（限流、网络、超时、5xx）对同一 capability 最多 3 次尝试；返回 upstream_retry_exhausted 后停止重试，改用等价能力或回告主 Agent，不要用 wait_agent 等上游恢复。task_id 必须由主 Agent 在本轮委派前确定，并在所有子 Agent 与最终报告中原样复用；不要由 data_collector 自行生成。相同 capability+params 的并发请求合并为同一次执行。当前 workspace 只读或落盘失败时抛错 workspace_not_writable（绝不退化为内存假成功）。请求归属自动记为当前 delegated child session，不接收 requester_agent_id 参数。',
      jsonObject({
        capability: { type: 'string' },
        params: freeObject,
        force_refresh: { type: 'boolean' },
        task_id: { type: 'string' },
      }, ['capability', 'params', 'task_id']),
      datasetRefSchema(),
      async (args, exec) => {
        const requestedCapability = boundedString(args.capability, 'capability', MAX_ID_LENGTH)
        const session = authorizedSession(ctx, exec, 'request_data', DATA_COLLECTION_PRESET_IDS)
        let budgetKey: string | undefined
        let capability: string | undefined
        try {
          const params = boundedParams(args.params)
          // Fail early with the same catalog guidance as describe_capability instead of
          // making the model infer a capability typo from a low-level Hub error.
          capability = resolveCapability(hub, requestedCapability)
          budgetKey = retryBudgetKey(session.id, capability)
          const prior = retryBudget.inspect(budgetKey)
          if (prior?.exhausted) {
            throw upstreamFailureError({
              capability,
              failure: prior.failure,
              attempts: prior.attempts,
              maxAttempts: retryBudget.maxAttempts,
              terminal: true,
            })
          }
          const ref = await hub.request({
            capability,
            params,
            force_refresh: args.force_refresh === true,
            task_id: boundedString(args.task_id, 'task_id', MAX_ID_LENGTH),
            session,
          }, { signal: exec.signal })
          retryBudget.reset(budgetKey)
          return ref
        } catch (error) {
          const failure = capability && budgetKey ? classifyUpstreamFailure(error) : null
          if (failure && budgetKey && capability) {
            const snapshot = retryBudget.record(budgetKey, failure)
            throw upstreamFailureError({
              capability,
              failure,
              attempts: snapshot.attempts,
              maxAttempts: retryBudget.maxAttempts,
              terminal: snapshot.exhausted,
            })
```

</details>

**依据 7 · 源码核查**：[src/data-collector/tools.ts:250-268](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/data-collector/tools.ts#L250-L268)

目录空与缺凭据可区分。

<details>
<summary>查看原文（19行）</summary>

```text
    tool(
      'list_capabilities',
      '发现数据能力目录。不传 topic：返回九行主题索引 `topic|中文|条数|码点|例子`，先看哪个主题包含所需能力；传 topic：返回该主题的 `capability|summary|paginated` 行。按问题需要取片，不设片数上限：复杂/跨资产问题建议第一步九片全取，单一资产按需取；同一 session 已有结果不要重复调用，多个 topic 在同一条消息里并发调用（本工具纯读、可并发）。片数是结果，不是配额；单片 <2048 是体积预算。目录刻意不含 schema；选定能力后用 describe_capability 取完整契约。request_data 的 capability 必须以目录为准，不要编造。未知 topic 返回 capability_scope_invalid 并列出可用主题。',
      jsonObject({
        topic: {
          type: 'string',
          enum: [...CATALOG_TOPICS],
          description: '可选。省略返回九行主题索引；给出 topic 返回该主题的能力目录。一次只取需要的主题，不要拉全部。',
        },
      }),
      { type: 'string' },
      async (args, exec) => {
        authorizedSession(ctx, exec, 'list_capabilities', DATA_COLLECTION_PRESET_IDS)
        if (hub.capabilityNames().length === 0) {
          throw capabilityError('capability_catalog_empty', '当前没有任何已注册的数据能力（数据源注册没有生效）。注意：缺凭据**不会**让目录变空；不要反复重试，也不要编造能力名；请用 dc_status 核对 registered_capability_count / registered_topics 与 api_key，并回告主 Agent。')
        }
        const topic = resolveCatalogTopic(hub, args.topic)
        return topic === undefined ? hub.catalogIndex() : hub.capabilityDirectory(topic)
      },
```

</details>

#### 缺口

- 没有公开材料的端到端资料比对与可用率记录
  **影响**：不能判断哪类来源和报告能稳定重复
  **进一步探讨**：准备同一份固定公告样例，比较确切引用、时点和未知值

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图表怎样保留来源和授权？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

图表准备从已有 DatasetRef 开始，先检查数据确实可读且形状可用，为同一数据、任务和来源会话的有效请求返回短期标识。到期时间受 Dataset 留存上限约束。解析时带任务绑定的令牌必须匹配任务；如果执行者会话已提供，就限制为来源或其直系子会话，双方有 cwd 时也做工作区匹配。这个实现表达的是带会话调用条件下的数据授权，不能由一个令牌字段推断所有调用者均已鉴别。交付端按 chart_refs 或任务取材料，去重并检查质量信息。正常流式场景记住待交付项，回执表示已登记而非卡片已经显示；缺交付投影时可以报告已落盘 HTML 的路径，需要用户重新核对。图表的展示数据与来源引用绑定，也不能替代对报告主要数字和衍生计算的复算。

#### 证据与依据

**依据 1 · 源码核查**：[src/chart/source-token.ts:140-157](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/chart/source-token.ts#L140-L157)

同一来源重用及读取条件。

<details>
<summary>查看原文（18行）</summary>

```text
    // Idempotent within TTL for the same session+task+dataset: re-issuing triggers huge thinking
    // turns, and resolve() does not consume the token, so reuse has no semantic cost.
    for (const record of this.tokens.values()) {
      if (record.dataset_id === datasetId && record.task_id === taskId && record.sourceSession.id === input.session.id) {
        return {
          chart_source_ref: record.chart_source_ref,
          dataset_id: record.dataset_id,
          task_id: record.task_id,
          expires_at: record.expires_at,
        }
      }
    }

    const inspection: DatasetInspection = await input.store.inspectDataset(datasetId, input.session, input.signal)
    if (!inspection.query_access.readable || !['array', 'envelope_item'].includes(inspection.query_access.shape)) {
      throw new ChartError(
        'chart_source_invalid',
        `Dataset ${datasetId} cannot be used as a chart source (${inspection.query_access.reason ?? inspection.query_access.shape})`,
```

</details>

**依据 2 · 源码核查**：[src/chart/source-token.ts:161-207](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/chart/source-token.ts#L161-L207)

短期令牌留存和带会话的限制。

<details>
<summary>查看原文（47行）</summary>

```text
    const token = this.newToken()
    if (!CHART_SOURCE_TOKEN_PATTERN.test(token)) {
      throw new ChartError('chart_source_invalid', 'generated chart_source_ref is invalid')
    }
    if (this.tokens.has(token)) throw new ChartError('chart_source_invalid', 'generated chart_source_ref already exists')

    // Never outlive the dataset's retention.
    const expiresAt = Math.min(inspection.retention_until, now + this.ttlMs)
    const record: ChartSourceTokenRecord = {
      chart_source_ref: token,
      dataset_id: inspection.dataset_id,
      task_id: taskId,
      expires_at: expiresAt,
      sourceSession: input.session,
      issued_at: now,
    }
    this.tokens.set(token, record)
    return {
      chart_source_ref: record.chart_source_ref,
      dataset_id: record.dataset_id,
      task_id: record.task_id,
      expires_at: record.expires_at,
    }
  }

  resolve(input: { chart_source_ref: string; task_id?: string; session?: SessionLike; now?: number }): ChartSourceTokenRecord {
    const token = readToken(input.chart_source_ref)
    const now = input.now ?? this.now()
    this.purgeExpired(now)
    const record = this.tokens.get(token)
    if (!record) throw new ChartError('chart_source_expired', 'chart_source_ref is unknown or expired')
    const taskId = readTaskId(input.task_id, true)
    if (record.task_id !== null && record.task_id !== taskId) {
      throw new ChartError('chart_source_scope_mismatch', 'chart_source_ref does not belong to this task')
    }
    if (input.session !== undefined) {
      const caller = input.session
      const source = record.sourceSession
      const isSource = caller.id === source.id
      const isDirectChild = caller.header?.parentSession === source.id
      if (!isSource && !isDirectChild) {
        throw new ChartError('chart_source_scope_mismatch', 'chart_source_ref is not authorized for this session')
      }
      if (source.header?.cwd !== undefined && caller.header?.cwd !== undefined && source.header.cwd !== caller.header.cwd) {
        throw new ChartError('chart_source_scope_mismatch', 'chart_source_ref does not belong to this workspace')
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/chart/present-tool.ts:179-201](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/chart/present-tool.ts#L179-L201)

选择和去重后登记等待交付。

<details>
<summary>查看原文（23行）</summary>

```text
    async execute(args: Record<string, unknown>, exec: PresentExecLike): Promise<PresentChartsReceipt> {
      const session = callerSession(exec)
      const refs = normalizeRefs(args.chart_refs)
      const taskId = normalizeTaskId(args.task_id)
      if (refs.length === 0 && taskId === undefined) {
        throw new Error('present_charts 需要 chart_refs 或 task_id：两者都不给就无法确定要登记哪几张图')
      }
      const { selected: selectedRaw, failed } = selectArtifacts(input, session, refs, taskId)
      const { kept: selected, failed: qualityFailed } = dedupeArtifacts(selectedRaw)
      failed.push(...qualityFailed)
      const receipt: PresentChartsReceipt = { presented: [], failed }
      if (selected.length === 0) return receipt
      const inputs = selected.map((artifact) => ({
        ownerSessionId: session.id,
        chart_id: artifact.chart_id,
        title: artifact.title,
        html_path: artifact.html_path,
      }))
      // Normal path: remember the selection; the closing stream chunk writes it before the answer.
      if (input.delivery?.streaming() === true) {
        input.delivery.request(session, inputs)
        for (const artifact of selected) receipt.presented.push({ chart_ref: artifact.chart_ref, title: artifact.title })
        return receipt
```

</details>

**依据 4 · 源码核查**：[src/chart/present-tool.ts:203-220](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/chart/present-tool.ts#L203-L220)

Fallback 与显式失败条件。

<details>
<summary>查看原文（18行）</summary>

```text
      // Fallback path (stream listener unavailable): write now, but only when the turn is idle.
      const blocked = await input.readiness?.(session)
      if (blocked !== undefined) throw new Error(blocked)
      const publisher = input.chartEvents()
      if (publisher === undefined) {
        throw new Error('图表交付通道不可用（sessions / sessionProjections 解析不到）：图表已落盘，可在 workspace 打开 html_path 指向的 HTML')
      }
      const accepted = publisher.publishMany !== undefined
        ? publisher.publishMany(session.id, inputs)
        : inputs.every((item) => publisher.publish(item))
      if (accepted) {
        for (const artifact of selected) receipt.presented.push({ chart_ref: artifact.chart_ref, title: artifact.title })
      } else {
        for (const artifact of selected) {
          receipt.failed.push({ chart_ref: artifact.chart_ref, reason: `本轮登记已达 ${MAX_CHARTS_PER_TURN} 次上限或回合已关闭，未写入交付行` })
        }
      }
      return receipt
```

</details>

#### 缺口

- 尚无真实跨角色数据读和图表卡片测试
  **影响**：授权范围取决于实际传参，页面显示及渲染结果仍待验
  **进一步探讨**：用来源角色、直接子角色、无关会话及过期令牌核对读档与实际卡片

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 定时任务如何避免重复和资源越界？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

自动化为宿主侧入口。定时器先确认调度权，日历读取进行中时等待，交易日未知时记录跳过；最后处理的时间挡住时钟回拨重复触发，超出补跑窗口的标记 missed，有运行重叠也跳过。领取发生键后再次查所有者，丢失改记状态未知，不自动再发。之后 runner 需要 sessionController 和可解析工作区，创建新的固定 preset 会话并记录它。无人值守 guard 只识别 runner 已关联的活动会话，拒绝已列出的提问、write/edit 和 shell 提权参数；宿主缺 tools.guard 或安装失败仅日志提示，未提供通用写权限隔离。这些限制降低一部分误跑风险，不能代替独立验证后台执行和实际成本。该流程适合生成供人阅读的材料。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:57-78](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/cordis.patch.yml#L57-L78)

自动化和跨预设 runtime、policy 接线。

<details>
<summary>查看原文（22行）</summary>

```text
# ── CapGen 投研自动化 (host plane) ─────────────────────────────────────────────
# Independent from the official `ui-schedule` row: no `schedules` main/sidebar id, no
# turnTail, no right-sidebar kind. The page is host-plane for the same injection reason
# as chart-ui; `name` stays a literal path-like relative path (see the three pitfalls above).
- insert:
    - id: capital-automation
      name: './automation/index.js'

# ── Cross-preset runtime / policy (0.2.1) ─────────────────────────────────────
# Root and role presets mount separately, so apply() runs several times per process. Shared state
# (chart source tokens, chart artifacts) and the agent/created listeners (root convergence, shell
# and fs guards) must exist exactly once, which only a host-plane provide gives.
# These two rows use package subpath entries (@v587d/capital-generation/runtime and /policy): they
# are server-side, so the literal-path rule above doesn't apply — DSH composes its own
# @deepseek-ai/dsh-tool-subagent-control rows the same way.
- insert:
    - id: capital-runtime
      name: '@v587d/capital-generation/runtime'

- insert:
    - id: capital-policy
      name: '@v587d/capital-generation/policy'
```

</details>

**依据 2 · 源码核查**：[automation/scheduler.js:182-223](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/scheduler.js#L182-L223)

交易日、不追溯补跑与重复检查。

<details>
<summary>查看原文（42行）</summary>

```text
  async function dueForTask(task) {
    if (!(await requireCurrentOwner())) return
    const latest = previousOccurrenceAtOrBefore(task.trigger, now(), { calendar })
    if (latest.kind === 'none') return
    if (latest.kind === 'calendar_unavailable') {
      // A refresh already in flight can still answer today; burning the occurrence on a
      // transient unknown would turn a slow fetch into a skipped run.
      if (calendar?.pendingRefresh?.() === true) return
      const key = `${store.profileKey}:calendar:${latest.localDate}`
      if (task.lastHandledOccurrenceKey === key) return
      await createSkipped(task, key, 'skipped_calendar_unavailable', undefined, {
        at: iso(now()),
        phase: 'schedule',
        severity: 'warning',
        code: 'calendar_unavailable',
        message: `无法确认交易日（${latest.localDate}）：为避免误跑，本次计划已跳过。`,
      })
      return
    }
    const key = occurrenceKeyOf(store.profileKey, task.id, latest.scheduleVersion, latest.scheduledFor)
    if (task.lastHandledOccurrenceKey === key) return
    // A clock rollback must not re-run a claimed instant: compare the high-water mark, not just keys.
    if (task.lastScheduledFor !== undefined && latest.instant <= Date.parse(task.lastScheduledFor)) return
    const anchor = Date.parse(task.scheduleAnchorAt)
    if (Number.isFinite(anchor) && latest.instant < anchor) {
      await store.setLastHandled(task.id, key, latest.scheduledFor)
      return
    }
    const catchUpMs = settings().catchUpMs ?? DEFAULT_CATCH_UP_MS
    if (now() - latest.instant > catchUpMs) {
      await createSkipped(task, key, 'missed', latest.scheduledFor, {
        at: iso(now()),
        phase: 'schedule',
        severity: 'warning',
        code: 'missed_occurrence',
        message: '进程未在计划时刻运行；按设计不补跑，可在页面手动发起一次新运行。',
      })
      return
    }
    if (await store.activeRunForTask(task.id) !== undefined) {
      await createSkipped(task, key, 'skipped_overlap', latest.scheduledFor)
      return
```

</details>

**依据 3 · 源码核查**：[automation/scheduler.js:270-303](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/scheduler.js#L270-L303)

领取后复查所有者和失败状态。

<details>
<summary>查看原文（34行）</summary>

```text
    if (!claimed) {
      await store.updateRun(run.id, { status: 'skipped_overlap', finishedAt: iso(now()), durationMs: 0 })
      await store.setLastHandled(task.id, key, latest.scheduledFor)
      return
    }
    if (!(await requireCurrentOwner())) {
      await store.setAttemptState(key, 'unknown').catch(() => {})
      await store.updateRun(run.id, {
        status: 'unknown_after_restart',
        finishedAt: iso(now()),
        durationMs: 0,
        errors: [{
          at: iso(now()),
          phase: 'schedule',
          severity: 'warning',
          code: 'owner_lost_before_dispatch',
          message: '定时调度权在启动前失效；本次运行未自动重试，可在页面手动重跑。',
        }],
      }).catch(() => {})
      return
    }
    await store.setLastHandled(task.id, key, latest.scheduledFor)
    if (runner.canDispatch?.() === false) {
      await store.setAttemptState(key, 'unknown').catch(() => {})
      await store.updateRun(run.id, {
        status: 'skipped_overlap',
        finishedAt: iso(now()),
        durationMs: Math.max(0, now() - Date.parse(run.queuedAt)),
      }).catch(() => {})
      return
    }
    void Promise.resolve().then(() => runner.dispatch(run, task, 'scheduled')).catch((error) => {
      logger?.warn?.(`capital-automation: scheduled dispatch failed: ${String(error)}`)
    })
```

</details>

**依据 4 · 源码核查**：[automation/runner.js:791-835](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/runner.js#L791-L835)

为运行实际创建与记录会话。

<details>
<summary>查看原文（45行）</summary>

```text
    entries.set(entry.id, entry)
    armWall(entry)
    try {
      const started = await updateEntryRun(entry, { status: 'starting', startedAt: iso(now()) })
      if (started !== undefined && !store.isActiveRun(started.status)) {
        entry.finished = true
        clearTimers(entry)
        entries.delete(entry.id)
        return false
      }
      if (dispatchStopped(entry)) {
        if (disposed || entry.abandoned) await abandonEntry(entry)
        return
      }
      const controller = service(ctx, 'sessionController')
      if (controller?.create === undefined) throw new Error('sessionController 不可用')
      if (profile.runDir === undefined) throw new Error('profile run directory 不可用')
      const target = workspaces === undefined
        ? { workspaceId: undefined, path: profile.runDir }
        : await workspaces.resolve(task.workspaceId)
      if (dispatchStopped(entry)) {
        if (disposed || entry.abandoned) await abandonEntry(entry, controller)
        return
      }
      if (target.workspaceId === undefined) await mkdir(target.path ?? profile.runDir, { recursive: true, mode: 0o700 })
      const created = target.workspaceId === undefined
        ? await controller.create({ cwd: target.path ?? profile.runDir, agentPreset: PRESET_ID })
        : await controller.create({ workspaceId: target.workspaceId, agentPreset: PRESET_ID })
      entry.sessionId = created.sessionId
      if (disposed || entry.abandoned) {
        await stopEntryAgent(entry, controller)
        return
      }
      bySession.set(created.sessionId, entry.id)
      if (entry.cancelRequested !== undefined) {
        await stopEntryAgent(entry, controller)
        return
      }
      const title = sessionTitleOf(task, run.id, run.queuedAt)
      const renamed = controller.rename === undefined
        ? undefined
        : await controller.rename({ sessionId: created.sessionId, title }).catch(() => undefined)
      const sessionTitle = renamed?.title ?? title
      await store.setAttemptState(run.occurrenceKey, 'session_created')
      await updateEntryRun(entry, { sessionId: created.sessionId, sessionTitle })
```

</details>

**依据 5 · 源码核查**：[automation/policy.js:24-45](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/policy.js#L24-L45)

明确限制名单和会话匹配。

<details>
<summary>查看原文（22行）</summary>

```text
export function automationGuardReason(exec, runner) {
  const name = exec?.name
  if (typeof name !== 'string') return undefined
  const activeRunner = runnerOf(runner)
  const sessionId = exec?.agent?.session?.id
  if (typeof sessionId !== 'string' || typeof activeRunner?.hasAutomationSession !== 'function' || !activeRunner.hasAutomationSession(sessionId)) return undefined
  if (BLOCKED_TOOL_NAMES.includes(name)) {
    const reason = name === 'ask_user_question'
      ? '无人值守运行不能向用户提问：请基于现有信息采用保守口径继续，并在最终答复开头写明「需要用户确认」的缺口。'
      : `无人值守运行不能写文件（${name}）：请把结论写在最终答复中，不要修改工作区。`
    activeRunner.noteGuardDenied(sessionId, name, reason)
    return reason
  }
  if (SHELL_TOOL_NAMES.includes(name)) {
    const args = isRecord(exec.arguments) ? exec.arguments : undefined
    if (args?.sandbox_permissions !== undefined || args?.justification !== undefined) {
      const reason = '无人值守运行不能申请沙箱提权：请只读执行，缺文件或权限时如实说明。'
      activeRunner.noteGuardDenied(sessionId, name, reason)
      return reason
    }
  }
  return undefined
```

</details>

**依据 6 · 源码核查**：[automation/policy.js:70-88](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/policy.js#L70-L88)

不支持宿主 guard 时只记录。

<details>
<summary>查看原文（19行）</summary>

```text
  let tools
  try {
    tools = ctx.get?.('tools') ?? ctx.tools
  } catch {
    tools = undefined
  }
  if (tools === undefined || typeof tools.guard !== 'function') {
    logger?.warn?.('capital-automation: tools.guard 不可用，无人值守工具闸门未安装')
    return
  }
  const record = { runner, generation: 1, disposeGuard: undefined }
  const install = () => {
    try {
      record.disposeGuard = tools.guard((exec) => automationGuardReason(exec, record.runner))
      INSTALLED.set(root, record)
      logger?.info?.('capital-automation: 无人值守工具闸门已安装（ask_user_question / write / edit / shell 提权）')
    } catch (error) {
      logger?.warn?.(`capital-automation: 无人值守工具闸门安装失败：${String(error)}`)
      return undefined
```

</details>

#### 缺口

- 没有双进程租约、后台成本和跨工作区实测
  **影响**：无法断言每个触发只执行一次或通用禁止所有写入
  **进一步探讨**：以非生产任务测试争用、日历缺失、无 guard 与关闭后仍有活动会话

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样在可复核范围评估采用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次仅用公开且可回看的公告，预先列出三条事实及各自原文件，比较手工整理与插件输出是否逐条指出日期、单位和来源。若再启用来源和 OCR，需额外准备对应凭据、权限和模型，读取服务可能经宿主凭据或同名环境变量找值。自动运行还可能产生重复请求和项目存储。现金开销与人工核对时间都缺对照，错误时间窗口、材料缺失或报告无法关联来源时，停用自动化并手工复核。后续可要求最终交付附一份每条判断对应 DatasetRef、抓取时间、来源及缺失状态的核验清单，通过固定过期数据及错误币种样例比较能否减少误读；若报告仍引用错材料或核验时间明显上升，则需调整流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:91-115](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/README.md#L91-L115)

作者示例明确按来源、时间及可比范围输出。

<details>
<summary>查看原文（25行）</summary>

````text
## 试试这么用

在新的自动模式会话中使用以下指令。将方括号内容换成自己的标的、公告或持仓；证券代码写完整市场后缀，例如 `600519.SH`。每条指令单独发送，便于观察结果。

[样例：指南针Q3暴跌探因（20261031）](docs/sample/指南针Q3暴跌探因.md)

<details>
<summary>展开示例指令</summary>

**完整投资研究报告**

```instruction
请对[公司名称、俗称]([证券代码])做一份完整投资研究报告。
以你实际取得的最新可用数据为截止，覆盖业务、财务、估值、价格走势、近期重要事件以及风险与反方观点。
先给核心判断和最大风险；关键数字注明报告期或交易日、来源和采集时间。
证据不足的部分注明未评估及原因，不编造目标价或收益概率。
```

**事件与公告影响分析**

```instruction
请核查[公司名称]([完整证券代码])的[公告标题及披露日期，或“最近一次业绩公告”]，
分析它对经营、现金流和投资风险可能产生的影响。
先核对公告原文、披露时间和事项进展，区分已实施事实与尚待批准的方案；
如讨论股价反应，只比较公告后可交易时段和同窗市场走势，不把同期涨跌直接归因于公告。
````

</details>

**依据 2 · 源码核查**：[src/retriever-runtime.ts:22-35](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/retriever-runtime.ts#L22-L35)

凭据从宿主或环境配置解析。

<details>
<summary>查看原文（14行）</summary>

```text
/** credentials first, env var fallback; resolve per call, never cache (boot-time races). */
export async function resolveRetrieverCredential(ctx: CredentialContext, ref: string): Promise<string | undefined> {
  try {
    const credentials = ctx.get('credentials') as {
      resolve?: (name: string) => Promise<{ value?: string } | undefined>
    } | undefined
    const resolved = await credentials?.resolve?.(ref)
    if (resolved?.value) return resolved.value
  } catch {
    // Fall back to the env var when the credentials service is unavailable.
  }
  return envKey(ref)
}

```

</details>

**依据 3 · 源码核查**：[src/data-collector/tools.ts:194-203](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/src/data-collector/tools.ts#L194-L203)

直接使用 DatasetRef 及时间字段作验收线索。

<details>
<summary>查看原文（10行）</summary>

```text
    tool(
      'request_data',
      '向数据管道请求数据：宿主先按 capability+params 校验当前 session 的已验证 manifest；force_refresh=false 或省略且命中未过期、满足该来源缓存新鲜度的 Dataset 时直接返回已有 DatasetRef，不访问上游；force_refresh=true 才重新取数并生成新的不可变 Dataset（默认保留 7 天），绝不覆盖旧 Dataset。明确要现在/最新的行情快照时请用 force_refresh=true，7 天是保留期而非实时新鲜度。本工具只返回 DatasetRef（dataset_id / artifact_ref / schema / row_count / captured_at / retention_until 等元数据），绝不返回原始数据行。capability 必须是 list_capabilities 返回的短能力名（如 ticker_search / quote / history / trading_calendar），params 必须按 describe_capability({ capability }) 返回的 input_schema 填写。若返回 request_params_invalid，先重新调用 describe_capability({ capability: "<当前能力名>" })，再按 schema 修正并重试一次；不要凭记忆猜参数。可重试上游失败（限流、网络、超时、5xx）对同一 capability 最多 3 次尝试；返回 upstream_retry_exhausted 后停止重试，改用等价能力或回告主 Agent，不要用 wait_agent 等上游恢复。task_id 必须由主 Agent 在本轮委派前确定，并在所有子 Agent 与最终报告中原样复用；不要由 data_collector 自行生成。相同 capability+params 的并发请求合并为同一次执行。当前 workspace 只读或落盘失败时抛错 workspace_not_writable（绝不退化为内存假成功）。请求归属自动记为当前 delegated child session，不接收 requester_agent_id 参数。',
      jsonObject({
        capability: { type: 'string' },
        params: freeObject,
        force_refresh: { type: 'boolean' },
        task_id: { type: 'string' },
      }, ['capability', 'params', 'task_id']),
      datasetRefSchema(),
```

</details>

**依据 4 · 源码核查**：[automation/scheduler.js:210-222](https://github.com/v587d/capital-generation/blob/a12175c5ef728cfa5f97e6221f9f7a312c439781/automation/scheduler.js#L210-L222)

漏跑和重叠行为供人工对照。

<details>
<summary>查看原文（13行）</summary>

```text
    const catchUpMs = settings().catchUpMs ?? DEFAULT_CATCH_UP_MS
    if (now() - latest.instant > catchUpMs) {
      await createSkipped(task, key, 'missed', latest.scheduledFor, {
        at: iso(now()),
        phase: 'schedule',
        severity: 'warning',
        code: 'missed_occurrence',
        message: '进程未在计划时刻运行；按设计不补跑，可在页面手动发起一次新运行。',
      })
      return
    }
    if (await store.activeRunForTask(task.id) !== undefined) {
      await createSkipped(task, key, 'skipped_overlap', latest.scheduledFor)
```

</details>

#### 缺口

- 没有同任务模型费用、服务可用性和人工复核数据
  **影响**：暂无法量化采用，也不构成投资判断
  **进一步探讨**：用固定公告和错误日期、单位的反例作人工对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
