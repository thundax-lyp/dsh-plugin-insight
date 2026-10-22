# dsh-mysql

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7848bba](https://github.com/1321928757/dsh-mysql/tree/7848bba53cccfe9e365a8fd46baa6d6883a29b78)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql) [![npm 30d 35](https://img.shields.io/static/v1?label=npm+30d&message=35&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mysql) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mysql)
<!-- END META -->

> **实现功能**：在DSH设置管理多套MySQL连接，会话选择目标数据源，模型可查看表结构、查询，并在独立授权后执行行写与DDL。

> **核心亮点**：把会话多源选择、schema先行、四类工具和独立行写/DDL权限接到动态上下文，减少手工搬运；不是SQL解析器或数据库隔离层。详见[Q02](#research-q02)。

> **风险与缺陷**：只读按前缀分类，regex表名提取不覆盖全部语法且DML丢库前缀；2000行在全量读取后截断，不限服务器或内存。最小权限、TLS和网关身份仍需独立核对，未执行绕过。详见[Q03](#research-q03)。

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
  - [Q01 · 哪类数据库工作适用，成功如何判断？](#detail-section-11)
  - [Q02 · 多源选择、schema与四工具怎样连接？](#detail-section-12)
  - [Q03 · 只读、表白名单和资源限制成立到哪里？](#detail-section-13)
  - [Q04 · 安装与操作依赖什么？](#detail-section-14)
  - [Q05 · 持久化、RPC和恢复有哪些取舍？](#detail-section-15)
  - [Q06 · 成本、采用和未来假设如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH中需要问数据库问题、查看schema或辅助小型数据维护的开发者。用户在设置维护连接，在会话选零/一/多个数据源，模型每次只查一个明确目标，输出标注来源、SQL和字段。它不自动联邦查询，也没有把多库数据合并为统一真相。

合格任务应先确认库表与权限，使用正确连接取得足够但最少披露的数据，SQL与答案对应；写入/DDL还要核对业务约束、影响行和恢复计划。返回ok/affectedRows不等于业务修改正确，工具错误也不意味着数据库完全未产生副作用。

基线为数据库客户端或命令行加人工复制schema/结果给模型。增量是会话选择与结构化工具减少手工切换，默认关闭行写/DDL且两者分开。但结果会作为普通工具输出进入模型服务，密码留本地并不意味着业务数据不外发。生产敏感库、强只读/表权限和跨租户边界应以数据库账户控制为准，插件文本守卫只是附加控制。

DB客户端/命令行加人工schema与结果复制；增量在选源/工具/上下文一体化，不能代替数据库权限、备份和答案核查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话选源 | 零/一/多源，调用仅一个目标 | 内存选择重启丢失，需网关身份 |
| schema | 列类型/键/注释 | 默认库与表过滤，数据外发模型 |
| 查询 | SELECT/SHOW/DESC/EXPLAIN | 有限语法守卫，全量读后裁2000行 |
| 行写 | INSERT/UPDATE/DELETE | 独立allowWrite及DB权限 |
| DDL | 创建/改删对象 | 独立allowDdl，库/目标检查，恢复成本高 |
| 连接管理 | 保存/测试/删除 | 本地明文密码，表单无TLS配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、DSH>=0.2.0-rc.2<0.3 | 包声明必需 | ESM、0.2 Typert严格codec | 0.1宿主不能按此版假设兼容 |
| mysql2与zod | 运行依赖 | TCP池与RPC codec | 包加载/查询失败 |
| tools | 硬注入 | 四工具全局注册 | 配置连接不代表工具已可见 |
| Typert网关、Web与React | 管理/选择UI需要 | 七服务调用和连接选择 | 上层鉴权/宿主身份需核对 |
| 可达MySQL、正确默认库与最小权限账户 | 数据操作必需 | schema和SQL | 未配默认库schema可能空 |
| 可写本地DSH_HOME | 保存连接必需 | 含密码的connections.json | 失败回滚缓存并返回错误 |
| 可信模型数据通道 | 业务采用条件 | schema/结果会外发 | 不应选择未获许可的敏感数据 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，建独立最低权限测试账户并备份 | 数据范围和外发许可明确 |
| 安装 | Web profile挂载bundle并重启 | tools、Typert和上下文接通 |
| 配置 | 保存连接、默认库和表范围，写/DDL保持默认关闭 | 测试连接只证明SELECT1，不证明业务权限完整 |
| 选择 | 会话明确选一个或多源，每调用单目标 | 多源不省connectionId，清空视禁止访问 |
| 查询 | schema先行，核对SQL、来源和最少必要结果 | 2000行显示上限不是资源保障 |
| 恢复 | 核对SQL真实状态、回滚方案和连接配置备份 | DDL/写返回未知时不盲目重发 |

本轮只读源码，不连数据库、不执行SQL或普通宿主冒烟；可视权限开关不是DB用户权限的替代。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | MySQL/宿主、账户与连接配置 | 核对权限、兼容、网络和数据披露 | 未测安装与schema理解耗时 |
| 持续使用 | 每连接最多3池连接、查询完整结果、模型接收schema/数据 | 核对SQL和结果，维护最小权限 | 显示2000行不界定DB/内存/token总成本 |
| 失败恢复 | 数据库备份、可能回滚/人工修复 | 判明超时是否仍执行、避免重复写 | DDL和未知结果恢复可很重 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 路由 | 会话选中集合和单目标检查 | 宿主Agent ID与会话身份真实一致 |
| 安全开关 | 行写/DDL分开，默认关闭 | 只读语义/全语法表白名单隔离 |
| 查询结果 | 字段/行序列化与截断标记 | 业务答案正确、精度和最少披露 |
| 接线收益 | UI+工具+上下文减少手工切换 | 相比DB客户端真实耗时/错误率改善 |

> **思考**：只读按前缀分类，regex表名提取不覆盖全部语法且DML丢库前缀；2000行在全量读取后截断，不限服务器或内存。最小权限、TLS和网关身份仍需独立核对，未执行绕过。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把会话多源选择、schema先行、四类工具和独立行写/DDL权限接到动态上下文，减少手工搬运；不是SQL解析器或数据库隔离层。详见[Q02](#research-q02)。

把会话多源选择、schema先行、四类工具和独立行写/DDL权限接到动态上下文，减少手工搬运；不是SQL解析器或数据库隔离层。详见[Q02](#research-q02)。

host以内存cachedConfigs作为同步上下文快照，loadedPromise只做一次性加载门闩，persist先换缓存、tmp/rename失败回滚；编辑空密码保留原值、变更结束旧池。这比写失败仍留新内存更细致，但无revision或写入队列，多次并发保存使用同tmp并各基于旧快照，回滚也可覆盖另一成功缓存。坏文件读失败记录日志后返回空配置，未保留损坏原件的隔离副本。

Typert定义七个管理方法，以create()返回zod record满足宿主严格契约，但record(unknown)不是逐操作字段严格Schema，验证主要在方法体。saveConnection对DDL有host侧风险确认位；选择RPC直接接受传入sessionId，本插件内未核对调用者拥有该会话的授权，需网关/宿主提供身份边界。不能因codec.mode=strict就声称会话授权严格。

pool按连接更新回收，dispose结束全部池，agent/disposed删除选择，减少长期泄漏。工具注册和上下文/服务分别catch错误，宿主可部分启动；boot.log有诊断但host mounted不证明所有面接通。数据库写无多语句事务工具、DDL通常不可回滚，失败恢复依原SQL与DB账户/备份。可复用工程点是密码对外安全视图、分权限和明确单目标，而不是regex安全承诺。

<a id="detail-section-5"></a>

### 1.4 主要限制

只读按前缀分类，regex表名提取不覆盖全部语法且DML丢库前缀；2000行在全量读取后截断，不限服务器或内存。最小权限、TLS和网关身份仍需独立核对，未执行绕过。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨从最低权限可丢弃库、语法/跨库语料、取消和结果外发入手，再查网关session授权；不凭guarded连接重要库。详见[Q06](#research-q06)。

合格任务应先确认库表与权限，使用正确连接取得足够但最少披露的数据，SQL与答案对应；写入/DDL还要核对业务约束、影响行和恢复计划。返回ok/affectedRows不等于业务修改正确，工具错误也不意味着数据库完全未产生副作用。

基线为数据库客户端或命令行加人工复制schema/结果给模型。增量是会话选择与结构化工具减少手工切换，默认关闭行写/DDL且两者分开。但结果会作为普通工具输出进入模型服务，密码留本地并不意味着业务数据不外发。生产敏感库、强只读/表权限和跨租户边界应以数据库账户控制为准，插件文本守卫只是附加控制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持会话单目标、schema和独立写权限；只读/表范围是有限语法识别、全量读取后裁行与凭据/TLS限制重要采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/shared.js、lib/session-selection.js、lib/typert.host.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lib检查配置/池/选择、四工具、SQL分类/表DDL提取、Typert与上下文，不连接数据库、不执行SQL，不作完整MySQL语法或网关审计。
- 下一步：进一步探讨可对固定语法和业务问题集检查目标、权限/结果与资源，使用独立最低权限测试库并记录超时真实状态。

**分析版本**

- **仓库**：[1321928757/dsh-mysql](https://github.com/1321928757/dsh-mysql)
- **版本号**：0.3.1（[固定提交 7848bba](https://github.com/1321928757/dsh-mysql/tree/7848bba53cccfe9e365a8fd46baa6d6883a29b78)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索AST允许集合、库表操作能力句柄、最小权限账户与服务端预算，返回实际对象/取消收据；未实现。详见[Q06](#research-q06)。

进一步探讨可对固定语法和业务问题集检查目标、权限/结果与资源，使用独立最低权限测试库并记录超时真实状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 701 | — | — | 10475 |
| .js | source | 5 | 3005 | 2600 | 265 | — |
| .mjs | source | 2 | 401 | 328 | 53 | — |
| .mjs | test | 5 | 893 | 770 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/issues?q=is%3Aissue+created%3A2026-09-22T05%3A35%3A09.541Z..2026-10-22T05%3A35%3A09.541Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/1321928757/dsh-mysql/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A35%3A09.541Z..2026-10-22T05%3A35%3A09.541Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本多源MySQL工具的路由贡献、权限控制与资源/恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类数据库工作适用，成功如何判断？

**研究主题：**场景与需求

#### 完整回答

面向在DSH中需要问数据库问题、查看schema或辅助小型数据维护的开发者。用户在设置维护连接，在会话选零/一/多个数据源，模型每次只查一个明确目标，输出标注来源、SQL和字段。它不自动联邦查询，也没有把多库数据合并为统一真相。

合格任务应先确认库表与权限，使用正确连接取得足够但最少披露的数据，SQL与答案对应；写入/DDL还要核对业务约束、影响行和恢复计划。返回ok/affectedRows不等于业务修改正确，工具错误也不意味着数据库完全未产生副作用。

基线为数据库客户端或命令行加人工复制schema/结果给模型。增量是会话选择与结构化工具减少手工切换，默认关闭行写/DDL且两者分开。但结果会作为普通工具输出进入模型服务，密码留本地并不意味着业务数据不外发。生产敏感库、强只读/表权限和跨租户边界应以数据库账户控制为准，插件文本守卫只是附加控制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-35](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/README.md#L16-L35)

作者说明多源、会话选择、默认读权限和数据外发边界。

<details>
<summary>查看原文（20行）</summary>

```text

`dsh-mysql` is a profile bundle for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness). It adds a settings page for multiple MySQL connections, a per-session connection picker beside the composer, and four guarded tools that every agent preset can use. No preset edits are required.

> **Data boundary:** connection settings and passwords stay in your local DSH storage. Database schema and query results are sent to the LLM provider as ordinary tool output when the agent uses a database tool.

## At a glance

| Surface | What it provides |
| --- | --- |
| **Settings → MySQL 数据库** | Add, edit, delete, and test connections. Configure host, port, user, password, default database, table scope, row-write permission, and independent schema-change permission. |
| **Composer database button** | Select or deselect one or more data sources for the current session. Each click takes effect immediately; the composer pill shows the single name or a compact selected count. |
| **Agent tools + runtime context** | `mysql_tables`, `mysql_query`, `mysql_execute`, and `mysql_ddl`, plus a per-turn context snapshot listing this session's selected sources and capabilities. |

## Features

- **Multiple connections:** keep separate development, staging, or production data sources in one DSH installation.
- **Per-session multi-selection:** each conversation independently selects zero, one, or multiple sources. Select/deselect takes effect immediately; clearing the last selection leaves the session without database access until a source is selected again. A session with multiple configured sources starts empty; a sole configured source is auto-selected on first initialization. Selection is runtime-only and is not restored after a DSH restart.
- **One target per tool call:** when multiple sources are selected, the agent passes one selected `connectionId` to each tool call. A single selected source may be inferred. Queries are never broadcast or merged across sources.
- **Schema-first workflow:** `mysql_tables` exposes readable columns, types, nullability, keys, and comments before a query is written.
- **Read-only by default:** row-write access and schema-change access are independent per-connection settings, both disabled by default and each requiring its own risk acknowledgement.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:680-688](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L680-L688)

动态上下文要求单目标并附SQL/字段，不自动证明业务正确。

```text
              '- 数据源：' + connection.name + '（connectionId=' + connection.id + '；' + connection.host + ':' + connection.port + '/' + (connection.database || '未指定默认库') + '）',
              '  可读表：' + (connection.tables.length > 0 ? connection.tables.join('、') : '全部（未配置白名单）') + '；行写入：' + (connection.allowWrite ? '已允许' : '未允许') + '；结构变更：' + (connection.allowDdl ? '已允许' : '未允许'),
            ]),
            multiple
              ? '- 重要：每次调用 mysql_tables、mysql_query、mysql_execute 或 mysql_ddl，必须传入且仅传入一个上述已选数据源的 connectionId；禁止广播到多个数据源。'
              : '- 仅选中一个数据源，可省略工具参数 connectionId；也可显式传入上方 ID。',
            '- 工具：mysql_query 只读查询（SELECT/SHOW/DESCRIBE/EXPLAIN，单条语句，最多返回 ' + MAX_ROWS + ' 行）；mysql_tables 查看表结构；mysql_execute 写操作（仅 INSERT/UPDATE/DELETE，需目标连接开启写权限）；mysql_ddl 结构变更（CREATE/ALTER/DROP/RENAME/TRUNCATE，需目标连接开启结构变更权限）。',
            '- DDL 目标受对应数据源的表白名单限制（空白名单=不限），且只能在其默认库内执行；查询前先用 mysql_tables 确认结构，回答时附上实际执行的 SQL 与查到的字段值。',
          ].join('\n')
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多源选择、schema与四工具怎样连接？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

配置经归一化保存本地，浏览器安全视图只返回hasPassword。sessionSelection区分缺省与显式空Set，首次仅一个配置时自动选中，多源首次空，清空后不重新自动选；重启Map不恢复。工具取exec.agent.id作为选择键，一个已选源可省connectionId，多选必须明确指定且属于已选集合。动态systemPrompt.context同样读Agent键列来源与读写能力。

mysql_tables按DATABASE()查询information_schema并按表名单聚合列信息。query先去注释、分类只接受SELECT/SHOW/DESC/EXPLAIN、拒多句和检查表名，再pool.query；execute仅INSERT/UPDATE/DELETE并检查allowWrite，走预处理execute；ddl独立allowDdl，提取创建/修改/引用对象，显式库限定必须为默认库，创建新对象可豁免目标白名单但读引用仍检查。MySQL账户权限最终决定可执行范围。

连接池按主机/端口/用户/密码/库指纹重用，变更或删除会结束旧池，禁multipleStatements，日期保字符串。贡献是会话单目标路由、schema先行、行写与结构写分离及权限上下文的一体接线，不是SQL解析器或新的数据库隔离层；DDL边界比DML更细，但不能外推为整个工具集同等级保护。

#### 证据与依据

**依据 1 · 源码核查**：[lib/session-selection.js:6-35](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/session-selection.js#L6-L35)

缺省/显式空、多选明确目标和选中约束。

<details>
<summary>查看原文（30行）</summary>

```text
export function resolveSelectedConnectionIds(connections, sessionId, selections) {
  if (typeof sessionId !== 'string' || !sessionId) return []
  if (!selections.has(sessionId)) {
    const configured = Array.isArray(connections) ? connections : []
    // A session first rendered before any connections exist is still uninitialized;
    // adding its first connection should retain the historic auto-select behavior.
    if (configured.length === 0) return []
    const initial = configured.length === 1 ? [configured[0].id] : []
    selections.set(sessionId, new Set(initial))
  }
  const configured = new Set((Array.isArray(connections) ? connections : []).map((connection) => connection.id))
  const selected = selections.get(sessionId)
  for (const id of selected) {
    if (!configured.has(id)) selected.delete(id)
  }
  return [...selected]
}

export function resolveSelectedConnection(connections, sessionId, requestedId, selections) {
  const selectedIds = resolveSelectedConnectionIds(connections, sessionId, selections)
  if (selectedIds.length === 0) {
    return { error: (Array.isArray(connections) ? connections.length : 0) === 0
      ? '尚未配置任何 MySQL 连接：请打开 设置 → MySQL 数据库 添加连接。'
      : '当前会话尚未选择数据库连接：请在输入栏点击「数据库连接」按钮选择一个连接后再试。' }
  }
  let connectionId = typeof requestedId === 'string' && requestedId ? requestedId : ''
  if (!connectionId && selectedIds.length === 1) connectionId = selectedIds[0]
  if (!connectionId) return { error: '当前会话选择了多个数据源；请在本次 MySQL 工具调用中明确指定 connectionId。' }
  if (!selectedIds.includes(connectionId)) return { error: '目标连接未在当前会话选中：' + connectionId + '。请先在输入栏「数据库连接」中选择该连接。' }
  const connection = (Array.isArray(connections) ? connections : []).find((candidate) => candidate.id === connectionId)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:154-168](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L154-L168)

密码安全对外视图。

<details>
<summary>查看原文（15行）</summary>

```text
function publicView(c) {
  return {
    id: c.id,
    name: c.name,
    host: c.host,
    port: c.port,
    user: c.user,
    database: c.database,
    tables: c.tables.slice(),
    allowWrite: c.allowWrite,
    allowDdl: c.allowDdl,
    hasPassword: c.password.length > 0,
    lastTest: lastTest.get(c.id) || null,
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:174-209](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L174-L209)

池指纹、禁多句及日期处理。

<details>
<summary>查看原文（36行）</summary>

```text
function fingerprint(c) {
  return [c.host, String(c.port), c.user, c.password, c.database].join('\u0000')
}

async function getPool(configs, connId) {
  const cfg = configs.connections.find((c) => c.id === connId)
  if (cfg === undefined) return { error: '连接不存在：' + connId }
  const fp = fingerprint(cfg)
  const hit = pools.get(connId)
  if (hit !== undefined && hit.fingerprint === fp) return { pool: hit.pool, config: cfg }
  if (hit !== undefined) {
    pools.delete(connId)
    hit.pool.end().catch(() => {})
  }
  const pool = createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database || undefined,
    connectTimeout: CONNECT_TIMEOUT_MS,
    waitForConnections: true,
    connectionLimit: POOL_CONNECTION_LIMIT,
    enableKeepAlive: true,
    multipleStatements: false,
    // 原样保留 MySQL 返回的日期/时间字符串，避免 mysql2 按本机时区转 Date 后
    // 再由 jsonSafe 的 toISOString() 转成 UTC，造成 DATETIME/TIMESTAMP 时区偏移。
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
  })
  pools.set(connId, { fingerprint: fp, pool })
  return { pool, config: cfg }
}

async function dropPool(connId) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:312-329](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L312-L329)

query前置检查。

<details>
<summary>查看原文（18行）</summary>

```text
  async execute(args, exec) {
    const sql = stripSqlComments(typeof (args && args.sql) === 'string' ? args.sql : '').trim()
    if (!sql) return toolError('SQL 为空')
    const base = await execCtx(exec, args)
    if (base.error !== undefined) return toolError(base.error)
    const kind = classifyStatement(sql)
    if (kind !== 'read') {
      return connectionToolError(base.connection, 'mysql_query 只允许 SELECT/SHOW/DESCRIBE/EXPLAIN 语句；写入请使用 mysql_execute，结构变更请使用 mysql_ddl')
    }
    if (hasMultipleStatements(sql)) return connectionToolError(base.connection, '不允许一次执行多条语句')
    const allow = checkTableAllowlist(sql, base.connection.tables)
    if (!allow.ok) return connectionToolError(base.connection, '查询涉及白名单外的表：' + allow.denied.join(', '))
    try {
      const result = await runQuery(base.pool, prependExecutionHint(sql, kind), args && args.params)
      return { ok: true, connection: base.connection.name, connectionId: base.connection.id, ...result }
    } catch (err) {
      return connectionToolError(base.connection, '查询失败：' + describeDbError(err))
    }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:435-465](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L435-L465)

DDL库和表边界。

<details>
<summary>查看原文（31行）</summary>

```text
  async execute(args, exec) {
    const sql = stripSqlComments(typeof (args && args.sql) === 'string' ? args.sql : '').trim()
    if (!sql) return toolError('SQL 为空')
    const base = await execCtx(exec, args)
    if (base.error !== undefined) return toolError(base.error)
    if (base.connection.allowDdl !== true) {
      return connectionToolError(base.connection, '当前连接未开启结构变更权限（allowDdl=false）：请在 设置 → MySQL 数据库 → 权限与安全 中为该连接开启「允许结构变更（DDL）」')
    }
    const kind = classifyStatement(sql)
    if (kind !== 'ddl') {
      return connectionToolError(base.connection, 'mysql_ddl 只允许 CREATE/ALTER/DROP/RENAME/TRUNCATE 作用于表、视图、索引；账号与权限类语句、库级语句与其它语句一律拒绝')
    }
    if (hasMultipleStatements(sql)) return connectionToolError(base.connection, '不允许一次执行多条语句')
    const ddl = extractDdlTargets(sql)
    const boundary = checkDatabaseBoundary([...ddl.created, ...ddl.mutated, ...ddl.referenced], base.connection.database)
    if (!boundary.ok) {
      const scope = base.connection.database ? '（' + base.connection.database + '）' : '（连接未配置默认库）'
      return connectionToolError(base.connection, '结构变更只能作用于当前连接的默认库' + scope + '，跨库目标被拒绝：' + boundary.denied.join(', '))
    }
    // 新建对象豁免白名单（新名字不可能预先在白名单里）；改/删目标与语句读到的表都要命中
    const targets = checkTableRefs(ddl.mutated.map((r) => r.name), base.connection.tables)
    if (!targets.ok) return connectionToolError(base.connection, '结构变更涉及白名单外的表：' + targets.denied.join(', '))
    const reads = checkTableRefs(
      [...extractTableRefs(sql), ...ddl.referenced.map((ref) => ref.name)],
      base.connection.tables,
    )
    if (!reads.ok) return connectionToolError(base.connection, '结构变更涉及白名单外的表：' + reads.denied.join(', '))
    try {
      // 文本协议（pool.query）：MySQL 对部分 DDL 直接返回 ER_UNSUPPORTED_PS 1295，
      // 不能走 mysql_execute 使用的预处理协议。
      const [result] = await base.pool.query(sql, Array.isArray(args && args.params) ? args.params : [])
```

</details>

**依据 6 · 源码核查**：[lib/index.js:667-688](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L667-L688)

Agent键上下文与单目标说明。

<details>
<summary>查看原文（22行）</summary>

```text
        order: 200,
        text: (assemble) => {
          const agent = assemble && assemble.agent
          const sessionId = agent && typeof agent.id === 'string' ? agent.id : undefined
          if (cachedConfigs.connections.length === 0) return ''
          const connections = resolveSelectedConnections(cachedConfigs, sessionId)
          if (connections.length === 0) {
            return 'MySQL 数据库：当前会话尚未选择连接。需要查库时，请提醒用户在输入栏点击「数据库连接」按钮选择一个或多个连接。'
          }
          const multiple = connections.length > 1
          return [
            'MySQL 数据库上下文（以下仅列出用户为当前会话选定的数据源）：',
            ...connections.flatMap((connection) => [
              '- 数据源：' + connection.name + '（connectionId=' + connection.id + '；' + connection.host + ':' + connection.port + '/' + (connection.database || '未指定默认库') + '）',
              '  可读表：' + (connection.tables.length > 0 ? connection.tables.join('、') : '全部（未配置白名单）') + '；行写入：' + (connection.allowWrite ? '已允许' : '未允许') + '；结构变更：' + (connection.allowDdl ? '已允许' : '未允许'),
            ]),
            multiple
              ? '- 重要：每次调用 mysql_tables、mysql_query、mysql_execute 或 mysql_ddl，必须传入且仅传入一个上述已选数据源的 connectionId；禁止广播到多个数据源。'
              : '- 仅选中一个数据源，可省略工具参数 connectionId；也可显式传入上方 ID。',
            '- 工具：mysql_query 只读查询（SELECT/SHOW/DESCRIBE/EXPLAIN，单条语句，最多返回 ' + MAX_ROWS + ' 行）；mysql_tables 查看表结构；mysql_execute 写操作（仅 INSERT/UPDATE/DELETE，需目标连接开启写权限）；mysql_ddl 结构变更（CREATE/ALTER/DROP/RENAME/TRUNCATE，需目标连接开启结构变更权限）。',
            '- DDL 目标受对应数据源的表白名单限制（空白名单=不限），且只能在其默认库内执行；查询前先用 mysql_tables 确认结构，回答时附上实际执行的 SQL 与查到的字段值。',
          ].join('\n')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读、表白名单和资源限制成立到哪里？

**研究主题：**缺陷与关键质疑

#### 完整回答

“只读”以语句前缀分类实现，没有数据库只读事务、session read-only设置或完整语法分析。SELECT/SHOW开头即read，未检查SELECT的文件/变量等副作用语义。空表名单表示不限，不是禁所有表；即使非空，正则只提取FROM/JOIN/UPDATE/INTO后首个引用，逗号表列表、SHOW/DESC等语法并不等价覆盖。tableRefs还丢弃db前缀，因此query/execute的同名跨库引用不受默认库边界，只有DDL调用checkDatabaseBoundary。这些都是静态控制范围，不宣称已数据库执行绕过。

query最多2000行是在pool.query取得完整rows后slice，不能保护数据库扫描、传输或宿主内存。SELECT才注入MAX_EXECUTION_TIME，SQL已有任何optimizer hint就跳过注入，SHOW/DESC/EXPLAIN不加；MySQL/MariaDB对hint支持也不同。工具timeout不能据源码推断会取消服务器查询或回滚写入，长锁/DDL尤其需要数据库侧治理。

凭据写入本地JSON，不通过模型输出回密码；连接表单没有TLS/SSL配置，pool创建也未设ssl，不能认为远程传输自动加密。BIGINT的supportBigNumbers与bigNumberStrings=false需结合mysql2实际返回核对精度，不将结果格式化等同数值语义正确。上述边界意味着最小权限账户、独立只读身份和数据脱敏不能由按钮开关替代。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shared.js:184-197](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/shared.js#L184-L197)

前缀分类与拒绝集合。

<details>
<summary>查看原文（14行）</summary>

```text
export function classifyStatement(sql) {
  const cleaned = stripSqlComments(sql).trim()
  if (!cleaned) return 'empty'
  if (/^select\b/i.test(cleaned)) return 'read'
  if (/^show\b/i.test(cleaned)) return 'read'
  if (/^(describe|desc)\b/i.test(cleaned)) return 'read'
  if (/^explain\b/i.test(cleaned)) return 'read'
  if (/^insert\b/i.test(cleaned)) return 'write-dml'
  if (/^update\b/i.test(cleaned)) return 'write-dml'
  if (/^delete\b/i.test(cleaned)) return 'write-dml'
  if (isDdlStatement(cleaned)) return 'ddl'
  if (/^(drop|truncate|alter|create|rename|grant|revoke|lock|unlock|set|use|call|do|handler|load|replace|start|stop|kill|purge|reset|flush|analyze|optimize|repair|check)\b/i.test(cleaned)) return 'forbidden'
  return 'unknown'
}
```

</details>

**依据 2 · 源码核查**：[lib/shared.js:206-230](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/shared.js#L206-L230)

正则首引用提取与丢db前缀。

<details>
<summary>查看原文（25行）</summary>

```text
/** 提取 FROM / JOIN / UPDATE / INTO 后的表引用（小写表名；db. 前缀取最后一段）。 */
const TABLE_REF_RE = /\b(from|join|update|into)\s+((?:`[^`]+`|[A-Za-z0-9_$]+)(?:\s*\.\s*(?:`[^`]+`|[A-Za-z0-9_$]+))*)/gi

export function extractTableRefs(sql) {
  const cleaned = blankStrings(stripSqlComments(sql))
  const names = new Set()
  let m
  TABLE_REF_RE.lastIndex = 0
  while ((m = TABLE_REF_RE.exec(cleaned)) !== null) {
    const ref = m[2].replace(/\s+/g, '')
    // 整体被一对反引号包裹 = 表名本身含点（如 `weird.name`），不按 db. 拆分
    if (/^`[^`]+`$/.test(ref)) {
      const table = ref.slice(1, -1).toLowerCase()
      if (table) names.add(table)
      continue
    }
    const parts = ref.split('.')
    let last = parts[parts.length - 1]
    if (last.startsWith('`') && last.endsWith('`')) last = last.slice(1, -1)
    const table = last.toLowerCase()
    if (table) names.add(table)
  }
  return [...names]
}

```

</details>

**依据 3 · 源码核查**：[lib/shared.js:257-274](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/shared.js#L257-L274)

空allowlist不限，缺引用不拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
export function checkTableRefs(names, allowlist) {
  const list = normalizeTables(allowlist)
  if (list.length === 0) return { ok: true }
  const denied = []
  for (const raw of Array.isArray(names) ? names : []) {
    const name = String(raw).trim().replace(/`/g, '').toLowerCase()
    if (name && !list.includes(name) && !denied.includes(name)) denied.push(name)
  }
  return denied.length > 0 ? { ok: false, denied } : { ok: true }
}

/**
 * 校验 SQL 引用的表是否全部在白名单内（DML 路径，沿用 FROM/JOIN/UPDATE/INTO 提取）。
 * 白名单为空 → 放行（不限制）；否则返回 { ok:false, denied: [...] }。
 */
export function checkTableAllowlist(sql, allowlist) {
  return checkTableRefs(extractTableRefs(sql), allowlist)
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:246-265](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L246-L265)

hint可跳过，完整读取后裁行。

<details>
<summary>查看原文（20行）</summary>

```text
/** 为 SELECT 注入 MAX_EXECUTION_TIME 提示，防止无 LIMIT 的长查询拖垮连接。 */
function prependExecutionHint(sql, kind) {
  if (kind !== 'read') return sql
  if (/\/\*\+/i.test(sql)) return sql // 已自带优化器提示时不重复注入
  return sql.replace(/^(\s*)(select)/i, '$1$2 /*+ MAX_EXECUTION_TIME(' + MAX_EXECUTION_MS + ') */')
}

async function runQuery(pool, sql, params) {
  const [rows, fields] = await pool.query(sql, Array.isArray(params) ? params : [])
  const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
  const list = Array.isArray(rows) ? rows : []
  const truncated = list.length > MAX_ROWS
  const slice = truncated ? list.slice(0, MAX_ROWS) : list
  return {
    columns,
    rowCount: slice.length,
    totalRowCount: list.length,
    truncated,
    rows: slice.map(jsonSafe),
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:191-209](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L191-L209)

pool无ssl，bigNumber配置。

<details>
<summary>查看原文（19行）</summary>

```text
    user: cfg.user,
    password: cfg.password,
    database: cfg.database || undefined,
    connectTimeout: CONNECT_TIMEOUT_MS,
    waitForConnections: true,
    connectionLimit: POOL_CONNECTION_LIMIT,
    enableKeepAlive: true,
    multipleStatements: false,
    // 原样保留 MySQL 返回的日期/时间字符串，避免 mysql2 按本机时区转 Date 后
    // 再由 jsonSafe 的 toISOString() 转成 UTC，造成 DATETIME/TIMESTAMP 时区偏移。
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
  })
  pools.set(connId, { fingerprint: fp, pool })
  return { pool, config: cfg }
}

async function dropPool(connId) {
```

</details>

**依据 6 · 作者声明**：[README.md:80-82](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/README.md#L80-L82)

作者说明无TLS选项与hint限制。

```text
- The connection form currently supports host, port, username, password, default database, table allowlist, and write permission. It does not expose SSL/TLS, Unix socket/named-pipe, or charset options.
- The `MAX_EXECUTION_TIME` optimizer hint is intended for MySQL versions that support it (MySQL 5.7.8+). MariaDB may handle this hint differently; `SHOW`, `DESCRIBE`, and `EXPLAIN` do not receive the hint.
- `mysql_tables` discovers tables in `DATABASE()`. Configure a default database if you want schema discovery; a connection without one can return an empty table list.
```

#### 缺口

- 不同MySQL/MariaDB语法、账号权限和取消行为未执行验证。
  **影响：**不能把文本守卫当已验只读/表隔离，也不能量化服务器负载或写回滚。
  **进一步探讨：**可先审查最小权限账户和固定SQL语料的静态分类，再在独立可丢弃数据库对照真实影响与取消。
- mysql2固定依赖解析后的大整数实际格式未核查。
  **影响：**不能保证所有查询值无精度损失。
  **进一步探讨：**从超过安全整数的原始值、驱动返回类型与序列化值逐层比较。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与操作依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、DSH>=0.2.0-rc.2<0.3 | 包声明必需 | ESM、0.2 Typert严格codec | 0.1宿主不能按此版假设兼容 |
| mysql2与zod | 运行依赖 | TCP池与RPC codec | 包加载/查询失败 |
| tools | 硬注入 | 四工具全局注册 | 配置连接不代表工具已可见 |
| Typert网关、Web与React | 管理/选择UI需要 | 七服务调用和连接选择 | 上层鉴权/宿主身份需核对 |
| 可达MySQL、正确默认库与最小权限账户 | 数据操作必需 | schema和SQL | 未配默认库schema可能空 |
| 可写本地DSH_HOME | 保存连接必需 | 含密码的connections.json | 失败回滚缓存并返回错误 |
| 可信模型数据通道 | 业务采用条件 | schema/结果会外发 | 不应选择未获许可的敏感数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主，建独立最低权限测试账户并备份 | 数据范围和外发许可明确 |
| 安装 | Web profile挂载bundle并重启 | tools、Typert和上下文接通 |
| 配置 | 保存连接、默认库和表范围，写/DDL保持默认关闭 | 测试连接只证明SELECT1，不证明业务权限完整 |
| 选择 | 会话明确选一个或多源，每调用单目标 | 多源不省connectionId，清空视禁止访问 |
| 查询 | schema先行，核对SQL、来源和最少必要结果 | 2000行显示上限不是资源保障 |
| 恢复 | 核对SQL真实状态、回滚方案和连接配置备份 | DDL/写返回未知时不盲目重发 |

本轮只读源码，不连数据库、不执行SQL或普通宿主冒烟；可视权限开关不是DB用户权限的替代。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:50-65](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/package.json#L50-L65)

mysql2/zod、peer与Node/DSH范围。

<details>
<summary>查看原文（16行）</summary>

```text
  "dependencies": {
    "mysql2": "^3.11.0",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": { "optional": true },
    "react": { "optional": true }
  },
  "engines": {
    "dsh": ">=0.2.0-rc.2 <0.3.0",
    "node": ">=20"
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:57-63](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L57-L63)

硬注入和超时/池上限。

```text
export const name = 'dsh-mysql'
export const inject = ['tools']

/** SELECT 注入的执行超时提示（MySQL 5.7.8+ 支持，秒级会被驱动换算为毫秒）。 */
const MAX_EXECUTION_MS = 15000
const POOL_CONNECTION_LIMIT = 3
const CONNECT_TIMEOUT_MS = 10000
```

**依据 3 · 源码核查**：[lib/typert.host.js:17-29](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/typert.host.js#L17-L29)

严格codec factory与调用映射。

<details>
<summary>查看原文（13行）</summary>

```text
const args$codec = { mode: 'strict', typeSymbol: 'dsh-mysql#Args', create: () => z.record(z.string(), z.unknown()) }
const result$codec = { mode: 'strict', typeSymbol: 'dsh-mysql#Result', create: () => z.record(z.string(), z.unknown()) }

const invocation = (method) => ({
  id: 'mysql/' + method,
  service: 'mysql',
  namespace: 'mysql',
  method,
  invocation: { kind: 'direct' },
  parameters: [
    { name: 'args', wire: 'args', source: 'json', codec: args$codec },
  ],
  result: result$codec,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:590-599](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L590-L599)

连接测试只SELECT1。

<details>
<summary>查看原文（10行）</summary>

```text
      password: cfg.password,
      database: cfg.database || undefined,
      connectTimeout: CONNECT_TIMEOUT_MS,
      connectionLimit: 1,
      multipleStatements: false,
    })
    const [rows] = await pool.query('SELECT 1 AS ok')
    const latencyMs = Date.now() - started
    if (testId !== null) lastTest.set(testId, { at: Date.now(), latencyMs, error: null })
    return { ok: true, latencyMs, reached: !!(rows && rows[0]) }
```

</details>

**依据 5 · 作者声明**：[README.md:75-82](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/README.md#L75-L82)

兼容、TLS和schema条件。

```text
## Requirements and compatibility

- A DSH installation with the **Web profile** and Node.js **20 or newer**.
- **DSH 0.2.0-rc.2 or newer, below 0.3.0.** Version 0.2.0 of this plugin migrates its Typert RPC manifest to the DSH 0.2 strict codec contract (`create()` factory) and no longer loads on DSH 0.1.x — use plugin 0.1.11 there.
- A MySQL-compatible server reachable through the configured TCP host and port.
- The connection form currently supports host, port, username, password, default database, table allowlist, and write permission. It does not expose SSL/TLS, Unix socket/named-pipe, or charset options.
- The `MAX_EXECUTION_TIME` optimizer hint is intended for MySQL versions that support it (MySQL 5.7.8+). MariaDB may handle this hint differently; `SHOW`, `DESCRIBE`, and `EXPLAIN` do not receive the hint.
- `mysql_tables` discovers tables in `DATABASE()`. Configure a default database if you want schema discovery; a connection without one can return an empty table list.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久化、RPC和恢复有哪些取舍？

**研究主题：**工程质量与复用

#### 完整回答

host以内存cachedConfigs作为同步上下文快照，loadedPromise只做一次性加载门闩，persist先换缓存、tmp/rename失败回滚；编辑空密码保留原值、变更结束旧池。这比写失败仍留新内存更细致，但无revision或写入队列，多次并发保存使用同tmp并各基于旧快照，回滚也可覆盖另一成功缓存。坏文件读失败记录日志后返回空配置，未保留损坏原件的隔离副本。

Typert定义七个管理方法，以create()返回zod record满足宿主严格契约，但record(unknown)不是逐操作字段严格Schema，验证主要在方法体。saveConnection对DDL有host侧风险确认位；选择RPC直接接受传入sessionId，本插件内未核对调用者拥有该会话的授权，需网关/宿主提供身份边界。不能因codec.mode=strict就声称会话授权严格。

pool按连接更新回收，dispose结束全部池，agent/disposed删除选择，减少长期泄漏。工具注册和上下文/服务分别catch错误，宿主可部分启动；boot.log有诊断但host mounted不证明所有面接通。数据库写无多语句事务工具、DDL通常不可回滚，失败恢复依原SQL与DB账户/备份。可复用工程点是密码对外安全视图、分权限和明确单目标，而不是regex安全承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:103-131](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L103-L131)

门闩、内存更新与失败回滚。

<details>
<summary>查看原文（29行）</summary>

```text
function ensureLoaded() {
  if (loadedPromise === null) {
    loadedPromise = loadConfigsFromDisk()
      .then((configs) => { cachedConfigs = configs })
      .catch((err) => {
        console.error('[dsh-mysql] 初始化连接配置失败', describeDbError(err))
        cachedConfigs = { connections: [] }
      })
  }
  // loadedPromise 只作为一次性「已加载」门闩；每次调用都解析到当前 cachedConfigs，
  // 保证保存/删除后所有读取路径立即可见最新快照（修复旧版返回启动时旧快照的问题）。
  return loadedPromise.then(() => cachedConfigs)
}

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
    console.error('[dsh-mysql] 保存连接配置失败', describeDbError(err))
    throw err
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:519-545](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L519-L545)

保留密码和池更新路径。

<details>
<summary>查看原文（27行）</summary>

```text
  if (input.allowDdl === true && input.ddlRiskConfirmed !== true) {
    return { ok: false, error: '开启结构变更权限前，请先勾选风险确认' }
  }
  const next = normalizeConnection(input)
  if (!next.name) return { ok: false, error: '连接名称不能为空' }
  const configs = await ensureLoaded()
  const existing = next.id ? configs.connections.find((c) => c.id === next.id) : undefined
  let id = next.id
  if (id === '') {
    id = 'c-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  }
  next.id = id
  if (existing !== undefined && (input.password === undefined || input.password === null || input.password === '')) {
    // 编辑时密码留空 = 保留原密码
    next.password = existing.password
  }
  const list = configs.connections.filter((c) => c.id !== id)
  list.push(next)
  try {
    await persistConfigs({ connections: list })
  } catch (err) {
    return { ok: false, error: '保存失败：' + describeDbError(err) }
  }
  // 配置变更：丢弃旧池，下次使用时按新配置重建
  await dropPool(id)
  lastTest.delete(id) // 配置已变，旧的测试状态失效
  return { ok: true, connection: publicView(next) }
```

</details>

**依据 3 · 源码核查**：[lib/typert.host.js:17-29](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/typert.host.js#L17-L29)

record unknown严格模式不等于逐字段授权。

<details>
<summary>查看原文（13行）</summary>

```text
const args$codec = { mode: 'strict', typeSymbol: 'dsh-mysql#Args', create: () => z.record(z.string(), z.unknown()) }
const result$codec = { mode: 'strict', typeSymbol: 'dsh-mysql#Result', create: () => z.record(z.string(), z.unknown()) }

const invocation = (method) => ({
  id: 'mysql/' + method,
  service: 'mysql',
  namespace: 'mysql',
  method,
  invocation: { kind: 'direct' },
  parameters: [
    { name: 'args', wire: 'args', source: 'json', codec: args$codec },
  ],
  result: result$codec,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:495-511](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L495-L511)

选择只按输入sessionId。

<details>
<summary>查看原文（17行）</summary>

```text
}

async function selectConnection(args) {
  const configs = await ensureLoaded()
  const sessionId = args && typeof args.sessionId === 'string' ? args.sessionId : undefined
  const ids = args && Array.isArray(args.connectionIds)
    ? args.connectionIds
    : (args && typeof args.connectionId === 'string' && args.connectionId ? [args.connectionId] : null)
  const replaced = replaceSelectedConnectionIds(configs.connections, sessionId, ids, sessionSelection)
  if (!replaced.ok) return replaced
  const selected = configs.connections.filter((connection) => replaced.connectionIds.includes(connection.id))
  return {
    ok: true,
    ...selectionResult(configs, sessionId),
    name: selected.length === 1 ? selected[0].name : undefined,
    names: selected.map((connection) => connection.name),
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:513-523](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L513-L523)

DDL风险位host检查。

<details>
<summary>查看原文（11行）</summary>

```text

async function saveConnection(args) {
  const input = args && typeof args.connection === 'object' && !Array.isArray(args.connection) ? args.connection : null
  if (input === null) return { ok: false, error: '缺少连接配置' }
  // Host-side validation complements the UI gate: a direct RPC caller cannot
  // persist schema-change authorization without sending the explicit consent bit.
  if (input.allowDdl === true && input.ddlRiskConfirmed !== true) {
    return { ok: false, error: '开启结构变更权限前，请先勾选风险确认' }
  }
  const next = normalizeConnection(input)
  if (!next.name) return { ok: false, error: '连接名称不能为空' }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:697-723](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L697-L723)

选择清理、服务接线和池dispose。

<details>
<summary>查看原文（27行）</summary>

```text

  // 会话销毁时清理所选数据源集合
  ctx.on('agent/disposed', (payload) => {
    const agent = payload && payload.agent
    if (agent && typeof agent.id === 'string') sessionSelection.delete(agent.id)
  })

  // Typert 服务提供（网关经 ./typert 清单暴露给客户端）
  try {
    Object.defineProperty(service, 'typertRemote', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: { service, serviceKey: 'mysql', namespace: 'mysql' },
    })
    ctx.provide('mysql', service)
    bootLog('service mysql provided')
  } catch (err) {
    bootLog('provide mysql FAILED: ' + describeDbError(err))
    console.error('[dsh-mysql] provide mysql failed', err)
  }

  // 回收全部连接池
  ctx.on('dispose', () => {
    for (const hit of pools.values()) hit.pool.end().catch(() => {})
    pools.clear()
  })
```

</details>

#### 缺口

- Typert网关身份、sessionId归属与并发配置保存契约未核查。
  **影响：**不能给多用户会话隔离或保存无丢更新保证。
  **进一步探讨：**沿固定宿主网关授权链核对身份，并以两个配置编辑者的版本冲突比较内存/磁盘结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用和未来假设如何判断？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | MySQL/宿主、账户与连接配置 | 核对权限、兼容、网络和数据披露 | 未测安装与schema理解耗时 |
| 持续使用 | 每连接最多3池连接、查询完整结果、模型接收schema/数据 | 核对SQL和结果，维护最小权限 | 显示2000行不界定DB/内存/token总成本 |
| 失败恢复 | 数据库备份、可能回滚/人工修复 | 判明超时是否仍执行、避免重复写 | DDL和未知结果恢复可很重 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 路由 | 会话选中集合和单目标检查 | 宿主Agent ID与会话身份真实一致 |
| 安全开关 | 行写/DDL分开，默认关闭 | 只读语义/全语法表白名单隔离 |
| 查询结果 | 字段/行序列化与截断标记 | 业务答案正确、精度和最少披露 |
| 接线收益 | UI+工具+上下文减少手工切换 | 相比DB客户端真实耗时/错误率改善 |

建议观察。schema先行、多源单目标和独立写权限是具体价值，但只读/表名单靠有限语法识别、资源上限在全量读取后及本地明文凭据/TLS缺失，不适合凭“guarded”直接连接重要库。继续探讨可先在最小权限可丢弃库核对允许语法与资源取消，再查网关身份与读结果外发边界。

未验证假设是采用可审计SQL AST允许集合，把库/表/操作统一为能力句柄，并由专用最小权限账户与服务端结果/时间预算共同执行；工具返回选源、实际语法对象和取消结果收据。相比当前前缀+regex，可能减少漏识别并明确跨库边界，但引入MySQL语法覆盖和部署维护成本。最小对照固定常规、逗号多表、限定库、SHOW与复杂DDL语料，比较合法拒绝、越界放行、业务合格率与耗时；若误拒严重且账户侧已有足够限制，净收益需重估。未实现，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/shared.js:184-230](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/shared.js#L184-L230)

有限语法分类和表提取是能力化假设起点。

<details>
<summary>查看原文（47行）</summary>

```text
export function classifyStatement(sql) {
  const cleaned = stripSqlComments(sql).trim()
  if (!cleaned) return 'empty'
  if (/^select\b/i.test(cleaned)) return 'read'
  if (/^show\b/i.test(cleaned)) return 'read'
  if (/^(describe|desc)\b/i.test(cleaned)) return 'read'
  if (/^explain\b/i.test(cleaned)) return 'read'
  if (/^insert\b/i.test(cleaned)) return 'write-dml'
  if (/^update\b/i.test(cleaned)) return 'write-dml'
  if (/^delete\b/i.test(cleaned)) return 'write-dml'
  if (isDdlStatement(cleaned)) return 'ddl'
  if (/^(drop|truncate|alter|create|rename|grant|revoke|lock|unlock|set|use|call|do|handler|load|replace|start|stop|kill|purge|reset|flush|analyze|optimize|repair|check)\b/i.test(cleaned)) return 'forbidden'
  return 'unknown'
}

/** 检测多语句：去掉注释与字符串内容后，除末尾分号外仍出现分号即视为多语句。 */
export function hasMultipleStatements(sql) {
  const cleaned = blankStrings(stripSqlComments(sql)).trim()
  const noTrailing = cleaned.replace(/;+\s*$/, '')
  return noTrailing.includes(';')
}

/** 提取 FROM / JOIN / UPDATE / INTO 后的表引用（小写表名；db. 前缀取最后一段）。 */
const TABLE_REF_RE = /\b(from|join|update|into)\s+((?:`[^`]+`|[A-Za-z0-9_$]+)(?:\s*\.\s*(?:`[^`]+`|[A-Za-z0-9_$]+))*)/gi

export function extractTableRefs(sql) {
  const cleaned = blankStrings(stripSqlComments(sql))
  const names = new Set()
  let m
  TABLE_REF_RE.lastIndex = 0
  while ((m = TABLE_REF_RE.exec(cleaned)) !== null) {
    const ref = m[2].replace(/\s+/g, '')
    // 整体被一对反引号包裹 = 表名本身含点（如 `weird.name`），不按 db. 拆分
    if (/^`[^`]+`$/.test(ref)) {
      const table = ref.slice(1, -1).toLowerCase()
      if (table) names.add(table)
      continue
    }
    const parts = ref.split('.')
    let last = parts[parts.length - 1]
    if (last.startsWith('`') && last.endsWith('`')) last = last.slice(1, -1)
    const table = last.toLowerCase()
    if (table) names.add(table)
  }
  return [...names]
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:246-265](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L246-L265)

全量读取后截断决定资源成本。

<details>
<summary>查看原文（20行）</summary>

```text
/** 为 SELECT 注入 MAX_EXECUTION_TIME 提示，防止无 LIMIT 的长查询拖垮连接。 */
function prependExecutionHint(sql, kind) {
  if (kind !== 'read') return sql
  if (/\/\*\+/i.test(sql)) return sql // 已自带优化器提示时不重复注入
  return sql.replace(/^(\s*)(select)/i, '$1$2 /*+ MAX_EXECUTION_TIME(' + MAX_EXECUTION_MS + ') */')
}

async function runQuery(pool, sql, params) {
  const [rows, fields] = await pool.query(sql, Array.isArray(params) ? params : [])
  const columns = Array.isArray(fields) ? fields.map((f) => f.name) : []
  const list = Array.isArray(rows) ? rows : []
  const truncated = list.length > MAX_ROWS
  const slice = truncated ? list.slice(0, MAX_ROWS) : list
  return {
    columns,
    rowCount: slice.length,
    totalRowCount: list.length,
    truncated,
    rows: slice.map(jsonSafe),
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:191-209](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L191-L209)

连接池资源与无TLS配置。

<details>
<summary>查看原文（19行）</summary>

```text
    user: cfg.user,
    password: cfg.password,
    database: cfg.database || undefined,
    connectTimeout: CONNECT_TIMEOUT_MS,
    waitForConnections: true,
    connectionLimit: POOL_CONNECTION_LIMIT,
    enableKeepAlive: true,
    multipleStatements: false,
    // 原样保留 MySQL 返回的日期/时间字符串，避免 mysql2 按本机时区转 Date 后
    // 再由 jsonSafe 的 toISOString() 转成 UTC，造成 DATETIME/TIMESTAMP 时区偏移。
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
  })
  pools.set(connId, { fingerprint: fp, pool })
  return { pool, config: cfg }
}

async function dropPool(connId) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:435-465](https://github.com/1321928757/dsh-mysql/blob/7848bba53cccfe9e365a8fd46baa6d6883a29b78/lib/index.js#L435-L465)

DDL已有对象/库检查可供统一设计参考。

<details>
<summary>查看原文（31行）</summary>

```text
  async execute(args, exec) {
    const sql = stripSqlComments(typeof (args && args.sql) === 'string' ? args.sql : '').trim()
    if (!sql) return toolError('SQL 为空')
    const base = await execCtx(exec, args)
    if (base.error !== undefined) return toolError(base.error)
    if (base.connection.allowDdl !== true) {
      return connectionToolError(base.connection, '当前连接未开启结构变更权限（allowDdl=false）：请在 设置 → MySQL 数据库 → 权限与安全 中为该连接开启「允许结构变更（DDL）」')
    }
    const kind = classifyStatement(sql)
    if (kind !== 'ddl') {
      return connectionToolError(base.connection, 'mysql_ddl 只允许 CREATE/ALTER/DROP/RENAME/TRUNCATE 作用于表、视图、索引；账号与权限类语句、库级语句与其它语句一律拒绝')
    }
    if (hasMultipleStatements(sql)) return connectionToolError(base.connection, '不允许一次执行多条语句')
    const ddl = extractDdlTargets(sql)
    const boundary = checkDatabaseBoundary([...ddl.created, ...ddl.mutated, ...ddl.referenced], base.connection.database)
    if (!boundary.ok) {
      const scope = base.connection.database ? '（' + base.connection.database + '）' : '（连接未配置默认库）'
      return connectionToolError(base.connection, '结构变更只能作用于当前连接的默认库' + scope + '，跨库目标被拒绝：' + boundary.denied.join(', '))
    }
    // 新建对象豁免白名单（新名字不可能预先在白名单里）；改/删目标与语句读到的表都要命中
    const targets = checkTableRefs(ddl.mutated.map((r) => r.name), base.connection.tables)
    if (!targets.ok) return connectionToolError(base.connection, '结构变更涉及白名单外的表：' + targets.denied.join(', '))
    const reads = checkTableRefs(
      [...extractTableRefs(sql), ...ddl.referenced.map((ref) => ref.name)],
      base.connection.tables,
    )
    if (!reads.ok) return connectionToolError(base.connection, '结构变更涉及白名单外的表：' + reads.denied.join(', '))
    try {
      // 文本协议（pool.query）：MySQL 对部分 DDL 直接返回 ER_UNSUPPORTED_PS 1295，
      // 不能走 mysql_execute 使用的预处理协议。
      const [result] = await base.pool.query(sql, Array.isArray(args && args.params) ? args.params : [])
```

</details>

#### 缺口

- 没有同任务DB客户端/人工复制与插件的耗时、错误率及外发量对照。
  **影响：**不能量化减少操作的净收益或安全提升。
  **进一步探讨：**固定只读问题集记录SQL正确性、结果披露、token、查询资源与人工核对。
- AST能力句柄与数据库侧预算方案未实现。
  **影响：**不提升现有只读或表隔离等级。
  **进一步探讨：**先用固定语法语料比较漏识别/误拒，再计算维护与资源成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
