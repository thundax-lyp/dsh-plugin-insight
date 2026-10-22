# dsh-plugin-nlbi

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[232f924](https://github.com/1byteone/dsh-plugin-nlbi/tree/232f9243029add39dd18a368de45d8326aca178f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) [![npm 30d 899](https://img.shields.io/static/v1?label=npm+30d&message=899&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)
<!-- END META -->

> **实现功能**：把MySQL连接、Schema驱动Text2SQL、查询结果与BI报表接入DSH对话和侧栏。

> **核心亮点**：在dsh-mysql底座上连接Schema、模型生成、校验执行与BI展示，贡献在流程接线而非新SQL/图表算法。详见[Q02](#research-q02)。

> **风险与缺陷**：生成链校验后直接查库并非待确认草稿，行列权限配置未在主query/Text2SQL/rerun执行链强制，不能视为数据隔离。详见[Q03](#research-q03)。

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
  - [Q01 · 业务任务及问题到SQL/结果的真实链是什么？](#detail-section-11)
  - [Q02 · 相对dsh-mysql和手写SQL增量是什么？](#detail-section-12)
  - [Q03 · 审批、只读和行列权限真实保证到哪里？](#detail-section-13)
  - [Q04 · 配置、凭据、模型与退出依赖什么？](#detail-section-14)
  - [Q05 · 首次、持续和失败恢复成本效果怎么比较？](#detail-section-15)
  - [Q06 · 可复用机制及统一查询策略假设怎么检验？](#detail-section-16)
  - [Q07 · 当前谁适合采用，停止条件是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有MySQL库的分析者希望自然语言查数并复用SQL/图表，需正确口径和原生权限范围。

受限账号下SQL客户端/手写SQL加图表；模型降低表达门槛，也增加Schema发送和语义审核成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MySQL工具 | 查询/结构/可选DML | DB权限与连接选择决定范围 |
| Text2SQL | 问题到SQL/结果 | Schema给模型，校验后自动执行 |
| 报表重跑 | 保存SQL复用 | 当前连接/策略变化需重审 |
| 权限设置 | 保存行列限制等 | 主查询链未见统一强制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH web/tools/Typert与React界面 | 主链必需 | 工具、RPC和结果展示 | peer optional不等宿主功能可缺 |
| mysql2、可达MySQL和最小权限账号 | 查询必需 | Schema和SQL执行 | 必须DB原生限制可读对象/数据 |
| 模型服务及凭据 | Text2SQL必需 | 问题/Schema到SQL | 普通手写SQL不强制生成模型 |
| node-sql-parser | 生成/重跑校验必需 | AST检查与SQL改写 | 无法解析拒绝，不证明语义正确 |
| 可写本地storage | 配置/报表等必需 | 连接密码与持久数据 | 停用不删除，需权限/备份管理 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者只用脱敏测试库和DB原生只读受限账号 | 不靠插件行列权限或提示隔离 |
| 加载 | 固定包/profile，配置模型和连接 | 能区分连接成功、生成、校验与执行 |
| 核对 | 读者用已知答案的问题比对SQL与结果 | 范围/连接/口径/截断均明确 |
| 退出 | 停用包、撤销DB凭据并治理本地配置/日志/报表 | 不把卸载当密钥撤销或数据清除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | DB、模型和包环境，金额未知 | 账号授权、schema/口径与连接核对 | 生产数据不能当默认测试材料 |
| 持续使用 | Schema读取、模型tokens、SQL扫描与图表/报表存储 | 审核口径、正确连接及截断 | 2000行不限制全部聚合扫描成本 |
| 失败恢复 | 模型重做、SQL排错、凭据/报表恢复 | 区分生成失败与已执行，避免误重跑 | 完整任务成本和故障率未测 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自然语言查数 | Schema到模型/校验/执行链完整 | 业务口径正确率与不明确问题处理 |
| 重用 | 保存SQL关联连接后重跑 | Schema/权限变化后的正确性 |
| 数据边界 | 表白名单、单语句与LIMIT路径存在 | 行列策略、多入口授权与副作用绝对安全 |

> **思考**：生成链校验后直接查库并非待确认草稿，行列权限配置未在主query/Text2SQL/rerun执行链强制，不能视为数据隔离。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在dsh-mysql底座上连接Schema、模型生成、校验执行与BI展示，贡献在流程接线而非新SQL/图表算法。详见[Q02](#research-q02)。

在dsh-mysql底座上连接Schema、模型生成、校验执行与BI展示，贡献在流程接线而非新SQL/图表算法。详见[Q02](#research-q02)。

可复用的是Schema白名单过滤、结构化模型输出、AST fail-closed拒绝不可解析输入、SQL改写与结果JSON安全清洗，以及连接缓存/会话选择和图表建议分层。多入口若绕过统一策略仍会使UI权限失去意义；固定.tmp与内存先更新后rename也不能保证多实例并发配置事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

生成链校验后直接查库并非待确认草稿，行列权限配置未在主query/Text2SQL/rerun执行链强制，不能视为数据隔离。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，优先修/核多入口策略与确认，DB原生权限兜底后再评估脱敏测试库。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持数据库Schema到SQL、结果视图与保存重跑的流程集成；生成后直接执行及未统一进入查询路径的行列策略不能证明受控分析。主体/连接/SQL绑定的统一策略计划尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/text2sql.js、package.json、lib/sqlsafe.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定主query/Text2SQL、SQL校验、rerun、权限设置与配置/工具注册；未全面审计Dashboard/图表/导出Client，不执行SQL或宿主。
- 下一步：进一步探讨可先用无DB桩和标准问题集检查禁行/列、歧义、重跑、Schema变更及确认前执行，分别统计正确率与完整成本。

**分析版本**

- **仓库**：[1byteone/dsh-plugin-nlbi](https://github.com/1byteone/dsh-plugin-nlbi)
- **版本号**：0.2.1（[固定提交 232f924](https://github.com/1byteone/dsh-plugin-nlbi/tree/232f9243029add39dd18a368de45d8326aca178f)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨统一查询计划与策略收据，绑定主体/连接/SQL/版本并对所有入口强制策略和明确确认；语义改写与迁移成本未验证。详见[Q06](#research-q06)。

进一步探讨可先用无DB桩和标准问题集检查禁行/列、歧义、重跑、Schema变更及确认前执行，分别统计正确率与完整成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1169 | — | — | 8784 |
| .cjs | source | 2 | 110 | 83 | 12 | — |
| .js | source | 10 | 7602 | 6033 | 1033 | — |
| .mjs | source | 1 | 61 | 41 | 12 | — |
| .mjs | test | 12 | 2447 | 1886 | 219 | — |
| .md | example | 1 | 134 | — | — | 766 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi/issues?q=is%3Aissue+created%3A2026-09-22T05%3A36%3A03.681Z..2026-10-22T05%3A36%3A03.681Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A36%3A03.681Z..2026-10-22T05%3A36%3A03.681Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Text2SQL到MySQL/报表的真实执行、数据权限与采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 业务任务及问题到SQL/结果的真实链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向已有MySQL库、希望在DSH对话或侧栏生成查询和复用报表的分析者。输入为自然语言问题、选中连接、可读Schema及模型，输出SQL、表格和图表建议。合格交付必须是正确库、正确口径和权限范围的答案，不仅是SQL可解析或图表漂亮。

会话映射选择连接，单连接会自动选中。Text2SQL读取information_schema，把允许表的列类型/注释组织到prompt，调用DSH模型，解析SQL后经AST/白名单/LIMIT与超时提示改写，再直接pool.query；返回结果和解释。工具nl_query和侧栏RPC同用这条执行链，保存报表另把SQL与connectionId关联重跑。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-36](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/README.md#L11-L36)

作者场景与新增能力。

<details>
<summary>查看原文（26行）</summary>

```text

在 DeepSeek Harness 对话里，用自然语言问数据库；答案不只是文字，而是「可编辑的 SQL + 可交互的数据表格 + 可复用的 BI 图表/报表」。

基于 `dsh-mysql` (v0.1.4) 连接底座二次开发，保留全部既有功能的同时，新增 Text2SQL、BI 图表、报表收藏、侧栏数据面板（借鉴 IDEA Database 工具窗）。

---

## Features

### 继承上游（dsh-mysql v0.1.4）

- **设置页连接管理**：多套 MySQL 连接 CRUD（表白名单/写权限/测试连通性）
- **会话级连接选择**：输入栏 🐬 按钮一键切换当前会话连接
- **3 个全局 Agent 工具**：

| 工具 | 用途 |
|------|------|
| `mysql_query` | 只读查询（SELECT/SHOW/DESCRIBE/EXPLAIN，单语句，白名单，超时，2000 行上限） |
| `mysql_tables` | 查看表结构（information_schema，受白名单约束） |
| `mysql_execute` | 写操作（INSERT/UPDATE/DELETE，需连接开启 allowWrite） |

### 新增能力（本插件）

| 能力 | 说明 |
|------|------|
| 🔍 **`nl_query`** | Text2SQL：自然语言→SQL 生成→AST 校验→护栏执行→结果表格+图表 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:252-263](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L252-L263)

单连接自动选择。

<details>
<summary>查看原文（12行）</summary>

```text
function resolveSelection(configs, sessionId) {
  let connection = null
  if (typeof sessionId === 'string') {
    const connId = sessionSelection.get(sessionId)
    connection = configs.connections.find((c) => c.id === connId) || null
  }
  if (connection === null && configs.connections.length === 1) {
    // 只配置了一个连接：自动选中（并记录，让 UI 与工具行为一致）
    connection = configs.connections[0]
    if (typeof sessionId === 'string') sessionSelection.set(sessionId, connection.id)
  }
  return connection
```

</details>

**依据 3 · 源码核查**：[lib/text2sql.js:500-550](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L500-L550)

Schema到模型调用。

<details>
<summary>查看原文（51行）</summary>

```text
  // 1. 获取 Schema 结构
  let schema = []
  try {
    const [rows] = await pool.query(
      'SELECT c.table_name AS table_name, c.column_name AS column_name, c.column_type AS column_type, ' +
      'c.is_nullable AS is_nullable, c.column_key AS column_key, c.column_comment AS column_comment, ' +
      't.table_comment AS table_comment ' +
      'FROM information_schema.columns c ' +
      'LEFT JOIN information_schema.tables t ON c.table_schema = t.table_schema AND c.table_name = t.table_name ' +
      'WHERE c.table_schema = DATABASE() ' +
      'ORDER BY c.table_name, c.ordinal_position',
    )
    const byTable = new Map()
    const tableComments = new Map()
    for (const r of rows) {
      const t = String(r.table_name).toLowerCase()
      if (allowlist.length > 0 && !allowlist.includes(t)) continue
      tableComments.set(t, r.table_comment || '')
      if (!byTable.has(t)) byTable.set(t, [])
      byTable.get(t).push({
        column: String(r.column_name),
        type: String(r.column_type),
        nullable: String(r.is_nullable).toUpperCase() === 'YES',
        key: r.column_key ? String(r.column_key) : '',
        comment: r.column_comment ? String(r.column_comment) : '',
      })
    }
    schema = [...byTable.keys()].sort().map(t => ({ name: t, columns: byTable.get(t), comment: tableComments.get(t) || '' }))
  } catch (err) {
    return { ok: false, error: '读取表结构失败: ' + (err.message || String(err)) }
  }

  if (schema.length === 0) {
    return { ok: false, error: '当前连接没有可读的表（受白名单限制），请检查设置' }
  }

  // 2. 构建 Prompt
  let prompt
  try {
    prompt = buildPrompt({
      question: question.trim(),
      schema,
      connectionName: connection.name,
      databaseName: connection.database,
    })
  } catch (err) {
    return { ok: false, error: 'Prompt 构建失败: ' + (err.message || String(err)) }
  }

  // 3. 调用 LLM 生成 SQL
  const llmResult = await callLlm(ctx, prompt)
```

</details>

**依据 4 · 源码核查**：[lib/text2sql.js:559-594](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L559-L594)

校验后直接查询及结果。

<details>
<summary>查看原文（36行）</summary>

```text
  // 4. 安全校验（双层防御：AST + 正则）
  const validation = validateAndPrepare(llmResult.sql, { allowlist, maxRows })
  if (!validation.ok) {
    return {
      ok: false,
      error: '生成的 SQL 未通过安全校验: ' + validation.error,
      sql: llmResult.sql,
      explain: llmResult.explain,
      schema,
    }
  }

  // 5. 执行查询
  try {
    const safeSql = validation.safeSql
    const [rows, fields] = await pool.query(safeSql)
    const columns = Array.isArray(fields) ? fields.map(f => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > maxRows
    const slice = truncated ? list.slice(0, maxRows) : list

    return {
      ok: true,
      sql: safeSql,
      originalSql: llmResult.sql,
      explain: llmResult.explain,
      chartType: llmResult.chartType || '',
      analysisType: llmResult.analysisType || '',
      result: {
        columns,
        rowCount: slice.length,
        totalRowCount: list.length,
        truncated,
        rows: slice.map(jsonSafe),
      },
      schema,
```

</details>

**依据 5 · 源码核查**：[lib/index.js:882-908](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L882-L908)

保存报表SQL重跑。

<details>
<summary>查看原文（27行）</summary>

```text
async function rerunReport(args) {
  const id = args && typeof args.reportId === 'string' ? args.reportId : ''
  const reports = await loadReports()
  const report = reports.find((r) => r.id === id)
  if (!report) return { ok: false, error: '报表不存在' }

  const configs = await ensureLoaded()
  const connection = configs.connections.find((c) => c.id === report.connectionId)
  if (!connection) return { ok: false, error: '报表关联的连接不存在或已被删除' }
  const got = await getPool(configs, connection.id)
  if (got.error !== undefined) return { ok: false, error: got.error }

  const validation = validateAndPrepare(report.sql, { allowlist: connection.tables, maxRows: MAX_ROWS })
  if (!validation.ok) return { ok: false, error: '报表 SQL 未通过安全校验：' + validation.error }

  try {
    const [rows, fields] = await got.pool.query(validation.safeSql)
    const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > MAX_ROWS
    const result = {
      columns,
      rowCount: Math.min(list.length, MAX_ROWS),
      totalRowCount: list.length,
      truncated,
      rows: list.slice(0, MAX_ROWS).map(jsonSafe),
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对dsh-mysql和手写SQL增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

作者明确基于dsh-mysql0.1.4连接底座，继承连接管理与mysql_query/tables/execute，新增Text2SQL、图表、报表/指标与侧栏。真实增量是把Schema上下文、模型生成、护栏、执行和展示连接在DSH流程里，减少手写查询接线。MySQL、node-sql-parser与图表方法来自成熟上游，不能按图表种类或“企业BI”描述计原创算法。

参照可用手写SQL加只读账号、普通SQL客户端和图表。模型生成可能降低表达门槛，也引入Schema外传、错口径和自动执行；本轮无同问题准确率、人工修正或完整人时对照，不能据此称等价专业BI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-36](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/README.md#L13-L36)

作者承认继承及新增分工。

<details>
<summary>查看原文（24行）</summary>

```text

基于 `dsh-mysql` (v0.1.4) 连接底座二次开发，保留全部既有功能的同时，新增 Text2SQL、BI 图表、报表收藏、侧栏数据面板（借鉴 IDEA Database 工具窗）。

---

## Features

### 继承上游（dsh-mysql v0.1.4）

- **设置页连接管理**：多套 MySQL 连接 CRUD（表白名单/写权限/测试连通性）
- **会话级连接选择**：输入栏 🐬 按钮一键切换当前会话连接
- **3 个全局 Agent 工具**：

| 工具 | 用途 |
|------|------|
| `mysql_query` | 只读查询（SELECT/SHOW/DESCRIBE/EXPLAIN，单语句，白名单，超时，2000 行上限） |
| `mysql_tables` | 查看表结构（information_schema，受白名单约束） |
| `mysql_execute` | 写操作（INSERT/UPDATE/DELETE，需连接开启 allowWrite） |

### 新增能力（本插件）

| 能力 | 说明 |
|------|------|
| 🔍 **`nl_query`** | Text2SQL：自然语言→SQL 生成→AST 校验→护栏执行→结果表格+图表 |
```

</details>

**依据 2 · 源码核查**：[lib/text2sql.js:536-574](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L536-L574)

真实生成到执行接线。

<details>
<summary>查看原文（39行）</summary>

```text
  // 2. 构建 Prompt
  let prompt
  try {
    prompt = buildPrompt({
      question: question.trim(),
      schema,
      connectionName: connection.name,
      databaseName: connection.database,
    })
  } catch (err) {
    return { ok: false, error: 'Prompt 构建失败: ' + (err.message || String(err)) }
  }

  // 3. 调用 LLM 生成 SQL
  const llmResult = await callLlm(ctx, prompt)
  if (!llmResult.ok) {
    return {
      ok: false,
      error: llmResult.error,
      schema, // 返回 schema 信息，方便用户参考
    }
  }

  // 4. 安全校验（双层防御：AST + 正则）
  const validation = validateAndPrepare(llmResult.sql, { allowlist, maxRows })
  if (!validation.ok) {
    return {
      ok: false,
      error: '生成的 SQL 未通过安全校验: ' + validation.error,
      sql: llmResult.sql,
      explain: llmResult.explain,
      schema,
    }
  }

  // 5. 执行查询
  try {
    const safeSql = validation.safeSql
    const [rows, fields] = await pool.query(safeSql)
```

</details>

**依据 3 · 源码核查**：[package.json:80-94](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/package.json#L80-L94)

成熟数据库/parser依赖。

<details>
<summary>查看原文（15行）</summary>

```text
    "mysql2": "^3.11.0",
    "node-sql-parser": "^5.4.0",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "react": {
      "optional": true
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批、只读和行列权限真实保证到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

README称生成SQL为草稿、需显式运行，并声称100%防写；实际工具nl_query和侧栏nlQuery直接调用text2sql，模型返回通过校验后就pool.query，没有第二次人工审批。结果里SQL可编辑不等执行前已审阅。AST只读分类/表白名单是正向约束，但不能将select根节点视为所有数据库副作用均不存在；应依赖DB原生只读与对象权限，不作绝对安全承诺。

更明确缺口是配置允许保存rowFilters/columnBlacklist/maxRows/queryTimeout，index里行过滤/黑列辅助函数只有定义，主mysql_query、Text2SQL及rerun链只传表白名单和固定MAX_ROWS，未应用连接行列策略。systemPrompt中告知模型禁止列也不构成强制过滤，Schema构建还包含允许表全部列/注释。故不能把设置页面的行列限制当数据隔离。所有Agent全局注册工具，单连接自动选中，也不等按用户/会话授予DB权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-46](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/README.md#L39-L46)

草稿审批及绝对安全作者声明。

```text
| 🗂 **数据浏览器** | 右侧栏 SchemaTree（表结构导航树）+ GridPanel（数据网格预览，分页/排序/WHERE 过滤） |
| 🎤 **智能查询** | 右侧栏自然语言输入框，即时查询 + 一键"发到对话" |
| 📋 **报表库** | 右侧栏自然语言生成报表 → 收藏 → 重跑/导出/删除 |

### 安全模型

- `nl_query` 强制只读（即使连接开了写权限）
- 双层 SQL 校验：**AST 级（node-sql-parser）+ 正则级（上游 shared.js）**，100% 防写操作泄露
```

**依据 2 · 源码核查**：[lib/index.js:1151-1173](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L1151-L1173)

Agent工具直接调用text2sql并返回查询结果。

<details>
<summary>查看原文（23行）</summary>

```text
    nlQueryToolWithCtx.execute = async (args, exec) => {
      const question = args && typeof args.question === 'string' ? args.question.trim() : ''
      if (!question) return toolError('查询问题不能为空')
      const base = await execCtx(exec)
      if (base.error !== undefined) return toolError(base.error)
      try {
        const result = await text2sql(ctx, question, base.connection, base.pool, {
          allowlist: base.connection.tables,
          maxRows: MAX_ROWS,
        })
        if (!result.ok) {
          return { ok: false, error: result.error, sql: result.sql || null, explain: result.explain || null }
        }
        const chart = suggestChartForResult(result.result, question, result.chartType || undefined)
        return {
          ok: true,
          connection: base.connection.name,
          sql: result.sql,
          explain: result.explain,
          chartType: result.chartType || '',
          analysisType: result.analysisType || '',
          result: result.result,
          chart: chart.ok ? chart.spec : null,
```

</details>

**依据 3 · 源码核查**：[lib/text2sql.js:559-574](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L559-L574)

无第二次审批直接执行。

<details>
<summary>查看原文（16行）</summary>

```text
  // 4. 安全校验（双层防御：AST + 正则）
  const validation = validateAndPrepare(llmResult.sql, { allowlist, maxRows })
  if (!validation.ok) {
    return {
      ok: false,
      error: '生成的 SQL 未通过安全校验: ' + validation.error,
      sql: llmResult.sql,
      explain: llmResult.explain,
      schema,
    }
  }

  // 5. 执行查询
  try {
    const safeSql = validation.safeSql
    const [rows, fields] = await pool.query(safeSql)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1049-1073](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L1049-L1073)

权限配置被保存。

<details>
<summary>查看原文（25行）</summary>

```text
  const entries = auditEntries.slice().reverse().slice(offset, offset + limit)
  return { ok: true, entries, total: auditEntries.length }
}

// ── ★ 新增：权限配置 ──────────────────────────────────────────────────────

async function updatePermissionsService(args) {
  const connectionId = args && typeof args.connectionId === 'string' ? args.connectionId : ''
  const permissions = args && typeof args.permissions === 'object' ? args.permissions : null
  if (!connectionId || !permissions) return { ok: false, error: '缺少参数' }

  const configs = await ensureLoaded()
  const idx = configs.connections.findIndex(c => c.id === connectionId)
  if (idx < 0) return { ok: false, error: '连接不存在' }

  configs.connections[idx].permissions = {
    rowFilters: Array.isArray(permissions.rowFilters) ? permissions.rowFilters : [],
    columnBlacklist: Array.isArray(permissions.columnBlacklist) ? permissions.columnBlacklist.filter(c => typeof c === 'string') : [],
    maxRows: Number.isFinite(Number(permissions.maxRows)) ? Number(permissions.maxRows) : MAX_ROWS,
    queryTimeout: Number.isFinite(Number(permissions.queryTimeout)) ? Number(permissions.queryTimeout) : 15000,
  }

  try {
    await persistConfigs(configs)
    return { ok: true, permissions: configs.connections[idx].permissions }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:313-358](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L313-L358)

权限辅助函数定义，定向搜索未找到调用。

<details>
<summary>查看原文（46行）</summary>

```text
function buildRowFilterClause(connection) {
  const perms = connection && connection.permissions
  if (!perms || !Array.isArray(perms.rowFilters) || perms.rowFilters.length === 0) return ''

  const conditions = []
  for (const filter of perms.rowFilters) {
    if (!filter.column || !filter.operator) continue
    const col = '`' + filter.column.replace(/`/g, '') + '`'
    switch (filter.operator) {
      case '=':
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          conditions.push(col + " = '" + String(filter.value).replace(/'/g, "''") + "'")
        }
        break
      case '!=':
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          conditions.push(col + " != '" + String(filter.value).replace(/'/g, "''") + "'")
        }
        break
      case 'IN':
        if (Array.isArray(filter.values) && filter.values.length > 0) {
          const inList = filter.values.map(v => "'" + String(v).replace(/'/g, "''") + "'").join(', ')
          conditions.push(col + ' IN (' + inList + ')')
        }
        break
      case 'LIKE':
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          conditions.push(col + " LIKE '" + String(filter.value).replace(/'/g, "''") + "'")
        }
        break
    }
  }
  return conditions.length > 0 ? conditions.join(' AND ') : ''
}

/**
 * 检查列是否在黑名单中。
 * @param {string} columnName
 * @param {object} connection
 * @returns {boolean} true = 列被禁止
 */
function isColumnBlacklisted(columnName, connection) {
  const perms = connection && connection.permissions
  if (!perms || !Array.isArray(perms.columnBlacklist) || perms.columnBlacklist.length === 0) return false
  return perms.columnBlacklist.includes(columnName.toLowerCase())
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:403-417](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L403-L417)

原始查询只做表等校验。

<details>
<summary>查看原文（15行）</summary>

```text
  async execute(args, exec) {
    const sql = stripSqlComments(typeof (args && args.sql) === 'string' ? args.sql : '').trim()
    if (!sql) return toolError('SQL 为空')
    const base = await execCtx(exec)
    if (base.error !== undefined) return toolError(base.error)
    const kind = classifyStatement(sql)
    if (kind !== 'read') {
      return toolError('mysql_query 只允许 SELECT/SHOW/DESCRIBE/EXPLAIN 语句；写入请使用 mysql_execute')
    }
    if (hasMultipleStatements(sql)) return toolError('不允许一次执行多条语句')
    const allow = checkTableAllowlist(sql, base.connection.tables)
    if (!allow.ok) return toolError('查询涉及白名单外的表：' + allow.denied.join(', '))
    try {
      const result = await runQuery(base.pool, prependExecutionHint(sql, kind), args && args.params)
      return { ok: true, connection: base.connection.name, ...result }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:894-908](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L894-L908)

rerun未应用行列权限。

<details>
<summary>查看原文（15行）</summary>

```text
  const validation = validateAndPrepare(report.sql, { allowlist: connection.tables, maxRows: MAX_ROWS })
  if (!validation.ok) return { ok: false, error: '报表 SQL 未通过安全校验：' + validation.error }

  try {
    const [rows, fields] = await got.pool.query(validation.safeSql)
    const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > MAX_ROWS
    const result = {
      columns,
      rowCount: Math.min(list.length, MAX_ROWS),
      totalRowCount: list.length,
      truncated,
      rows: list.slice(0, MAX_ROWS).map(jsonSafe),
    }
```

</details>

**依据 8 · 源码核查**：[lib/text2sql.js:514-525](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L514-L525)

允许表完整列/注释进入Schema。

<details>
<summary>查看原文（12行）</summary>

```text
    for (const r of rows) {
      const t = String(r.table_name).toLowerCase()
      if (allowlist.length > 0 && !allowlist.includes(t)) continue
      tableComments.set(t, r.table_comment || '')
      if (!byTable.has(t)) byTable.set(t, [])
      byTable.get(t).push({
        column: String(r.column_name),
        type: String(r.column_type),
        nullable: String(r.is_nullable).toUpperCase() === 'YES',
        key: r.column_key ? String(r.column_key) : '',
        comment: r.column_comment ? String(r.column_comment) : '',
      })
```

</details>

#### 缺口

- 真实DB版本/账号权限下各SELECT形式、副作用与超时语义未验证。
  **影响**：不能把AST通过等同任何形式零副作用或硬超时。
  **进一步探讨**：可先用仅假数据的DB原生受限账号与离线parser反例集研究，再按明确授权核查真实执行。
- Typert外层身份/会话授权与多用户部署边界未全面确定。
  **影响**：全局工具和可指定sessionId的服务不能被当成多租户DB隔离。
  **进一步探讨**：可核查固定网关认证及每入口主体到连接权限映射，先用无DB桩测试越权请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、凭据、模型与退出依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

真实查库需MySQL账号、网络和Schema权限；Text2SQL还需可用模型。Schema名、列名、类型/注释和问题进入模型prompt，应按所选provider的数据策略治理，本轮未发任何数据。连接包含password并以JSON整体写到本地storage，未见加密/密钥代理，所以文件系统权限、备份与撤销责任在维护者。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH web/tools/Typert与React界面 | 主链必需 | 工具、RPC和结果展示 | peer optional不等宿主功能可缺 |
| mysql2、可达MySQL和最小权限账号 | 查询必需 | Schema和SQL执行 | 必须DB原生限制可读对象/数据 |
| 模型服务及凭据 | Text2SQL必需 | 问题/Schema到SQL | 普通手写SQL不强制生成模型 |
| node-sql-parser | 生成/重跑校验必需 | AST检查与SQL改写 | 无法解析拒绝，不证明语义正确 |
| 可写本地storage | 配置/报表等必需 | 连接密码与持久数据 | 停用不删除，需权限/备份管理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者只用脱敏测试库和DB原生只读受限账号 | 不靠插件行列权限或提示隔离 |
| 加载 | 固定包/profile，配置模型和连接 | 能区分连接成功、生成、校验与执行 |
| 核对 | 读者用已知答案的问题比对SQL与结果 | 范围/连接/口径/截断均明确 |
| 退出 | 停用包、撤销DB凭据并治理本地配置/日志/报表 | 不把卸载当密钥撤销或数据清除 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:79-98](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/package.json#L79-L98)

依赖/peer及Node声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "dependencies": {
    "mysql2": "^3.11.0",
    "node-sql-parser": "^5.4.0",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "react": {
      "optional": true
    }
  },
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:157-169](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L157-L169)

完整配置JSON临时文件rename。

<details>
<summary>查看原文（13行）</summary>

```text
async function persistConfigs(configs) {
  const previous = cachedConfigs
  cachedConfigs = configs
  try {
    await fsp.mkdir(storageDir(), { recursive: true })
    const file = storageFile()
    const tmp = file + '.tmp'
    await fsp.writeFile(tmp, JSON.stringify(configs, null, 2), 'utf8')
    await fsp.rename(tmp, file)
  } catch (err) {
    cachedConfigs = previous // 写盘失败：内存回滚，与磁盘保持一致
    console.error('[dsh-plugin-nlbi] 保存连接配置失败', (err && err.message) || err)
    throw err
```

</details>

**依据 3 · 源码核查**：[lib/index.js:178-190](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L178-L190)

连接密码字段。

<details>
<summary>查看原文（13行）</summary>

```text
  return {
    id,
    name: typeof raw.name === 'string' ? raw.name.trim().slice(0, 64) : '',
    host: typeof raw.host === 'string' && raw.host.trim() ? raw.host.trim().slice(0, 255) : '127.0.0.1',
    port: Number.isFinite(Number(raw.port)) && Number(raw.port) > 0 ? Math.floor(Number(raw.port)) : 3306,
    user: typeof raw.user === 'string' ? raw.user.slice(0, 64) : 'root',
    password: typeof raw.password === 'string' ? raw.password : '',
    database: typeof raw.database === 'string' ? raw.database.trim().slice(0, 128) : '',
    tables: normalizeTables(raw.tables),
    allowWrite: raw.allowWrite === true,
  }
}

```

</details>

**依据 4 · 源码核查**：[lib/text2sql.js:500-550](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L500-L550)

Schema/问题组织入模型prompt。

<details>
<summary>查看原文（51行）</summary>

```text
  // 1. 获取 Schema 结构
  let schema = []
  try {
    const [rows] = await pool.query(
      'SELECT c.table_name AS table_name, c.column_name AS column_name, c.column_type AS column_type, ' +
      'c.is_nullable AS is_nullable, c.column_key AS column_key, c.column_comment AS column_comment, ' +
      't.table_comment AS table_comment ' +
      'FROM information_schema.columns c ' +
      'LEFT JOIN information_schema.tables t ON c.table_schema = t.table_schema AND c.table_name = t.table_name ' +
      'WHERE c.table_schema = DATABASE() ' +
      'ORDER BY c.table_name, c.ordinal_position',
    )
    const byTable = new Map()
    const tableComments = new Map()
    for (const r of rows) {
      const t = String(r.table_name).toLowerCase()
      if (allowlist.length > 0 && !allowlist.includes(t)) continue
      tableComments.set(t, r.table_comment || '')
      if (!byTable.has(t)) byTable.set(t, [])
      byTable.get(t).push({
        column: String(r.column_name),
        type: String(r.column_type),
        nullable: String(r.is_nullable).toUpperCase() === 'YES',
        key: r.column_key ? String(r.column_key) : '',
        comment: r.column_comment ? String(r.column_comment) : '',
      })
    }
    schema = [...byTable.keys()].sort().map(t => ({ name: t, columns: byTable.get(t), comment: tableComments.get(t) || '' }))
  } catch (err) {
    return { ok: false, error: '读取表结构失败: ' + (err.message || String(err)) }
  }

  if (schema.length === 0) {
    return { ok: false, error: '当前连接没有可读的表（受白名单限制），请检查设置' }
  }

  // 2. 构建 Prompt
  let prompt
  try {
    prompt = buildPrompt({
      question: question.trim(),
      schema,
      connectionName: connection.name,
      databaseName: connection.database,
    })
  } catch (err) {
    return { ok: false, error: 'Prompt 构建失败: ' + (err.message || String(err)) }
  }

  // 3. 调用 LLM 生成 SQL
  const llmResult = await callLlm(ctx, prompt)
```

</details>

**依据 5 · 源码核查**：[lib/text2sql.js:308-325](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L308-L325)

模型路由和固定用途session。

<details>
<summary>查看原文（18行）</summary>

```text
      const { BlockAssembler, createUserMessage, deepFreeze } = await importLlmHelper()
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)

      const messages = [createUserMessage({
        content: [{ type: 'text', text: prompt.userPrompt }],
      })]
      const llmOptions = deepFreeze({
        provider: route.provider,
        model: route.model,
        ...(route.reasoningEffort ? { reasoningEffort: route.reasoningEffort } : {}),
        system: prompt.systemPrompt,
        messages,
        maxTokens: 1024,
        temperature: 0.1,
        sessionId: 'dsh-plugin-nlbi-text2sql',
        purpose: 'text2sql',
        signal: controller.signal,
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续和失败恢复成本效果怎么比较？

**研究主题**：效果与总成本

#### 完整回答

完整任务应从一个有标准答案的业务问题到被审核的SQL/结果/图表，包含生成、DB扫描、人工修正和失败重做。SQL通过解析不证明指标口径正确，LIMIT2000也不限制聚合读取的底层数据量；结果截断/Schema变化会影响图表与重跑。无价格和用量资料不能填模型免费或固定单次成本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | DB、模型和包环境，金额未知 | 账号授权、schema/口径与连接核对 | 生产数据不能当默认测试材料 |
| 持续使用 | Schema读取、模型tokens、SQL扫描与图表/报表存储 | 审核口径、正确连接及截断 | 2000行不限制全部聚合扫描成本 |
| 失败恢复 | 模型重做、SQL排错、凭据/报表恢复 | 区分生成失败与已执行，避免误重跑 | 完整任务成本和故障率未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自然语言查数 | Schema到模型/校验/执行链完整 | 业务口径正确率与不明确问题处理 |
| 重用 | 保存SQL关联连接后重跑 | Schema/权限变化后的正确性 |
| 数据边界 | 表白名单、单语句与LIMIT路径存在 | 行列策略、多入口授权与副作用绝对安全 |


#### 证据与依据

**依据 1 · 源码核查**：[lib/text2sql.js:500-550](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L500-L550)

每次Schema和模型链。

<details>
<summary>查看原文（51行）</summary>

```text
  // 1. 获取 Schema 结构
  let schema = []
  try {
    const [rows] = await pool.query(
      'SELECT c.table_name AS table_name, c.column_name AS column_name, c.column_type AS column_type, ' +
      'c.is_nullable AS is_nullable, c.column_key AS column_key, c.column_comment AS column_comment, ' +
      't.table_comment AS table_comment ' +
      'FROM information_schema.columns c ' +
      'LEFT JOIN information_schema.tables t ON c.table_schema = t.table_schema AND c.table_name = t.table_name ' +
      'WHERE c.table_schema = DATABASE() ' +
      'ORDER BY c.table_name, c.ordinal_position',
    )
    const byTable = new Map()
    const tableComments = new Map()
    for (const r of rows) {
      const t = String(r.table_name).toLowerCase()
      if (allowlist.length > 0 && !allowlist.includes(t)) continue
      tableComments.set(t, r.table_comment || '')
      if (!byTable.has(t)) byTable.set(t, [])
      byTable.get(t).push({
        column: String(r.column_name),
        type: String(r.column_type),
        nullable: String(r.is_nullable).toUpperCase() === 'YES',
        key: r.column_key ? String(r.column_key) : '',
        comment: r.column_comment ? String(r.column_comment) : '',
      })
    }
    schema = [...byTable.keys()].sort().map(t => ({ name: t, columns: byTable.get(t), comment: tableComments.get(t) || '' }))
  } catch (err) {
    return { ok: false, error: '读取表结构失败: ' + (err.message || String(err)) }
  }

  if (schema.length === 0) {
    return { ok: false, error: '当前连接没有可读的表（受白名单限制），请检查设置' }
  }

  // 2. 构建 Prompt
  let prompt
  try {
    prompt = buildPrompt({
      question: question.trim(),
      schema,
      connectionName: connection.name,
      databaseName: connection.database,
    })
  } catch (err) {
    return { ok: false, error: 'Prompt 构建失败: ' + (err.message || String(err)) }
  }

  // 3. 调用 LLM 生成 SQL
  const llmResult = await callLlm(ctx, prompt)
```

</details>

**依据 2 · 源码核查**：[lib/sqlsafe.js:350-388](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/sqlsafe.js#L350-L388)

校验与默认LIMIT/超时提示，不代表总资源固定。

<details>
<summary>查看原文（39行）</summary>

```text
export function validateAndPrepare(sql, options = {}) {
  const { allowlist = [], maxRows = 2000, timeoutMs = 15000 } = options

  // 1. 基本检查
  if (!sql || typeof sql !== 'string' || !sql.trim()) {
    return { ok: false, error: 'SQL 为空' }
  }

  // 2. 多语句检测（双层防御）
  const cleaned = sql.trim()
  // 先做 AST 解析
  try {
    const ast = parser.astify(cleaned, MYSQL_OPT)
    if (Array.isArray(ast) && ast.length > 1) {
      return { ok: false, error: '不允许一次执行多条 SQL 语句' }
    }
  } catch {
    // AST 解析失败：降级到 shared.js 正则检测（ESM 安全导入）
    // 说明：AST 解析失败说明 SQL 不可靠，直接拒绝比放行更安全
    return { ok: false, error: 'SQL 语法无法解析，已拒绝执行' }
  }

  // 3. 只读校验
  const readOnly = checkReadOnly(cleaned)
  if (!readOnly.ok) {
    return { ok: false, error: readOnly.error }
  }

  // 4. 表白名单校验
  const allowCheck = checkTableAllowlistAst(cleaned, allowlist)
  if (!allowCheck.ok) {
    return { ok: false, error: '查询涉及白名单外的表: ' + allowCheck.denied.join(', ') }
  }

  // 5. 注入 LIMIT（安全改写）
  const limitResult = injectLimit(cleaned, maxRows)

  // 6. 注入 MAX_EXECUTION_TIME
  let safeSql = injectMaxExecutionTime(limitResult.sql, timeoutMs)
```

</details>

**依据 3 · 源码核查**：[lib/text2sql.js:574-592](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L574-L592)

执行后裁剪和截断标记。

<details>
<summary>查看原文（19行）</summary>

```text
    const [rows, fields] = await pool.query(safeSql)
    const columns = Array.isArray(fields) ? fields.map(f => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > maxRows
    const slice = truncated ? list.slice(0, maxRows) : list

    return {
      ok: true,
      sql: safeSql,
      originalSql: llmResult.sql,
      explain: llmResult.explain,
      chartType: llmResult.chartType || '',
      analysisType: llmResult.analysisType || '',
      result: {
        columns,
        rowCount: slice.length,
        totalRowCount: list.length,
        truncated,
        rows: slice.map(jsonSafe),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:894-908](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L894-L908)

重跑依赖当前连接和SQL。

<details>
<summary>查看原文（15行）</summary>

```text
  const validation = validateAndPrepare(report.sql, { allowlist: connection.tables, maxRows: MAX_ROWS })
  if (!validation.ok) return { ok: false, error: '报表 SQL 未通过安全校验：' + validation.error }

  try {
    const [rows, fields] = await got.pool.query(validation.safeSql)
    const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > MAX_ROWS
    const result = {
      columns,
      rowCount: Math.min(list.length, MAX_ROWS),
      totalRowCount: list.length,
      truncated,
      rows: list.slice(0, MAX_ROWS).map(jsonSafe),
    }
```

</details>

#### 缺口

- 缺少同模型/同库/同问题的正确率、修正人时、tokens、扫描及故障恢复对照。
  **影响**：不能给出净节省、企业级质量或单位成本承诺。
  **进一步探讨**：可与受限账号下手写SQL基线比较标准问题集，分别记录语义正确、误连接、截断和重做。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可复用机制及统一查询策略假设怎么检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是Schema白名单过滤、结构化模型输出、AST fail-closed拒绝不可解析输入、SQL改写与结果JSON安全清洗，以及连接缓存/会话选择和图表建议分层。多入口若绕过统一策略仍会使UI权限失去意义；固定.tmp与内存先更新后rename也不能保证多实例并发配置事务。

可探讨未验证的“统一查询计划与策略收据”。所有query/nl_query/report/dashboard入口先生成绑定主体、连接、Schema/策略版本和精确SQL的计划，DB原生权限兜底，统一执行行列限制、超时和审计；自然语言默认先显示SQL/假设再明确确认。相对当前多链各自校验，目标是策略一致和副作用可追踪。代价是策略改写正确性、保存报表迁移和确认成本。可用相同越权列/行、空白名单、重跑、Schema变更和模型歧义夹具比较绕过率与人工完成时间；若任一入口仍漏策略或改写错口径，应否定当前方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sqlsafe.js:358-381](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/sqlsafe.js#L358-L381)

解析失败拒绝与白名单。

<details>
<summary>查看原文（24行）</summary>

```text
  // 2. 多语句检测（双层防御）
  const cleaned = sql.trim()
  // 先做 AST 解析
  try {
    const ast = parser.astify(cleaned, MYSQL_OPT)
    if (Array.isArray(ast) && ast.length > 1) {
      return { ok: false, error: '不允许一次执行多条 SQL 语句' }
    }
  } catch {
    // AST 解析失败：降级到 shared.js 正则检测（ESM 安全导入）
    // 说明：AST 解析失败说明 SQL 不可靠，直接拒绝比放行更安全
    return { ok: false, error: 'SQL 语法无法解析，已拒绝执行' }
  }

  // 3. 只读校验
  const readOnly = checkReadOnly(cleaned)
  if (!readOnly.ok) {
    return { ok: false, error: readOnly.error }
  }

  // 4. 表白名单校验
  const allowCheck = checkTableAllowlistAst(cleaned, allowlist)
  if (!allowCheck.ok) {
    return { ok: false, error: '查询涉及白名单外的表: ' + allowCheck.denied.join(', ') }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:741-756](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L741-L756)

JSON边界清洗。

<details>
<summary>查看原文（16行）</summary>

```text
      auditLog({ type: 'nl_query', connectionId: connection.id, question, success: false, error: result.error, duration })
      // ★ 错误路径也必须 sanitize（sql/explain 可能 undefined，网关 assertJsonValue 会拒绝 undefined）
      return sanitizeForBoundary({ ok: false, error: result.error, sql: result.sql || null, explain: result.explain || null })
    }
    const chart = suggestChartForResult(result.result, question, args && typeof args.chartType === 'string' ? args.chartType : (result.chartType || undefined))
    auditLog({ type: 'nl_query', connectionId: connection.id, question, sql: result.sql, success: true, rowCount: result.result.rowCount, duration })
    // ★ 边界安全清洗：Chart/结果若含 NaN/Date 等非 JSON 安全值会被 Typert 网关拒绝
    const payload = {
      ok: true,
      connection: connection.name,
      sql: result.sql,
      explain: result.explain,
      result: result.result,
      chart: chart.ok ? chart.spec : null,
    }
    return sanitizeForBoundary(payload)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:157-169](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L157-L169)

本地配置持久化。

<details>
<summary>查看原文（13行）</summary>

```text
async function persistConfigs(configs) {
  const previous = cachedConfigs
  cachedConfigs = configs
  try {
    await fsp.mkdir(storageDir(), { recursive: true })
    const file = storageFile()
    const tmp = file + '.tmp'
    await fsp.writeFile(tmp, JSON.stringify(configs, null, 2), 'utf8')
    await fsp.rename(tmp, file)
  } catch (err) {
    cachedConfigs = previous // 写盘失败：内存回滚，与磁盘保持一致
    console.error('[dsh-plugin-nlbi] 保存连接配置失败', (err && err.message) || err)
    throw err
```

</details>

**依据 4 · 源码核查**：[lib/index.js:894-908](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L894-L908)

多入口统一策略假设的重跑起点。

<details>
<summary>查看原文（15行）</summary>

```text
  const validation = validateAndPrepare(report.sql, { allowlist: connection.tables, maxRows: MAX_ROWS })
  if (!validation.ok) return { ok: false, error: '报表 SQL 未通过安全校验：' + validation.error }

  try {
    const [rows, fields] = await got.pool.query(validation.safeSql)
    const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > MAX_ROWS
    const result = {
      columns,
      rowCount: Math.min(list.length, MAX_ROWS),
      totalRowCount: list.length,
      truncated,
      rows: list.slice(0, MAX_ROWS).map(jsonSafe),
    }
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前谁适合采用，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。自然语言到结果的接线有价值，但“草稿需确认”和行列权限与真实执行不一致，对业务数据采用影响大。不得靠插件配置作为生产多用户隔离，不能把模型提示或100%安全口号作为权限依据。

继续探讨可从无DB桩和脱敏标准问题集核查多入口，先统一策略/确认，再在明确授权下研究DB原生只读最小权限测试库。出现错误连接/口径、禁列/行出现在结果或prompt、无确认已执行、截断被当全文、重跑权限不一致时应停止相关查询并保存收据；扩大试用需补Q03边界与Q05完整任务结果。本轮未连接数据库。

#### 证据与依据

**依据 1 · 源码核查**：[lib/text2sql.js:559-574](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js#L559-L574)

自动执行主链。

<details>
<summary>查看原文（16行）</summary>

```text
  // 4. 安全校验（双层防御：AST + 正则）
  const validation = validateAndPrepare(llmResult.sql, { allowlist, maxRows })
  if (!validation.ok) {
    return {
      ok: false,
      error: '生成的 SQL 未通过安全校验: ' + validation.error,
      sql: llmResult.sql,
      explain: llmResult.explain,
      schema,
    }
  }

  // 5. 执行查询
  try {
    const safeSql = validation.safeSql
    const [rows, fields] = await pool.query(safeSql)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1049-1073](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L1049-L1073)

配置不等实际执行强制。

<details>
<summary>查看原文（25行）</summary>

```text
  const entries = auditEntries.slice().reverse().slice(offset, offset + limit)
  return { ok: true, entries, total: auditEntries.length }
}

// ── ★ 新增：权限配置 ──────────────────────────────────────────────────────

async function updatePermissionsService(args) {
  const connectionId = args && typeof args.connectionId === 'string' ? args.connectionId : ''
  const permissions = args && typeof args.permissions === 'object' ? args.permissions : null
  if (!connectionId || !permissions) return { ok: false, error: '缺少参数' }

  const configs = await ensureLoaded()
  const idx = configs.connections.findIndex(c => c.id === connectionId)
  if (idx < 0) return { ok: false, error: '连接不存在' }

  configs.connections[idx].permissions = {
    rowFilters: Array.isArray(permissions.rowFilters) ? permissions.rowFilters : [],
    columnBlacklist: Array.isArray(permissions.columnBlacklist) ? permissions.columnBlacklist.filter(c => typeof c === 'string') : [],
    maxRows: Number.isFinite(Number(permissions.maxRows)) ? Number(permissions.maxRows) : MAX_ROWS,
    queryTimeout: Number.isFinite(Number(permissions.queryTimeout)) ? Number(permissions.queryTimeout) : 15000,
  }

  try {
    await persistConfigs(configs)
    return { ok: true, permissions: configs.connections[idx].permissions }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:894-908](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js#L894-L908)

多入口策略缺口。

<details>
<summary>查看原文（15行）</summary>

```text
  const validation = validateAndPrepare(report.sql, { allowlist: connection.tables, maxRows: MAX_ROWS })
  if (!validation.ok) return { ok: false, error: '报表 SQL 未通过安全校验：' + validation.error }

  try {
    const [rows, fields] = await got.pool.query(validation.safeSql)
    const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
    const list = Array.isArray(rows) ? rows : []
    const truncated = list.length > MAX_ROWS
    const result = {
      columns,
      rowCount: Math.min(list.length, MAX_ROWS),
      totalRowCount: list.length,
      truncated,
      rows: list.slice(0, MAX_ROWS).map(jsonSafe),
    }
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
