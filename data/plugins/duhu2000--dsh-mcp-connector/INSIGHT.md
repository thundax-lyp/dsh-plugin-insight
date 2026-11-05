# dsh-mcp-connector

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[80f6182](https://github.com/duhu2000/dsh-mcp-connector/tree/80f61822451dbd964d274428d3105d7d72799610)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/duhu2000/dsh-mcp-connector) [![npm 30d 30,432](https://img.shields.io/static/v1?label=npm+30d&message=30%2C432&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-connector)
<!-- END META -->

> **功能**：管理 MCP 连接、凭据和工具缓存，并按工作区与 Agent 控制可见性。

> **亮点**：[Q01](#research-q01) 提供带来源和范围的统一发现面板。

> **主要限制**：[Q02](#research-q02) guard/restrict 是必要 Host 能力，缓存与调用状态分开。

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
  - [Q01 · 怎样把现有 MCP 配置变成可查的连接？](#detail-section-11)
  - [Q02 · 工具隐藏和发现重试怎样保持边界？](#detail-section-12)
  - [Q03 · 怎样衡量接入管理能否省时间？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户有多个 MCP 服务，需定位可用工具与授权故障。

手工维护 mcpServers 配置并单独排查服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 连接管理 | 统一配置和凭据 | 依赖提供商 |
| 工具目录 | 查询最后成功缓存 | 不证明当前业务成功 |
| 会话注入 | 精确激活工具 | 要求 Host 防护能力 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host | 必需 | 工具限制和配置 | 缺能力拒绝会话注入 |
| 提供商账号或本地服务 | 按连接需要 | 授权和业务调用 | 额度及策略独立 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 连接 | 先添加隔离只读服务 | 核对范围 |
| 发现 | 查工具来源和时间 | 区分缓存 |
| 验收 | 从正常会话调用 | 复核权限与结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 费用未知 | 账号授权和配置 | 逐服务差异 |
| 持续 | 平台成本未知 | 维护凭据和发现 | 鉴权失败暂停 |
| 失败 | 工时未知 | 回滚配置并复验 | 保留原连接证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多服务接入 | 查工具和定位故障 | 实际端到端成功率 |

> **思考**：[Q02](#research-q02) guard/restrict 是必要 Host 能力，缓存与调用状态分开。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供带来源和范围的统一发现面板。

[Q02](#research-q02) 精确工具激活配合 guard 和 restrict。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) guard/restrict 是必要 Host 能力，缓存与调用状态分开。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单个只读服务逐层验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码支持缓存、过滤和防护，未调用服务。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/session-injection.js、lib/discovery-policy.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定发现缓存、过滤和会话防护；未授权或运行服务。
- 下一步：工作区切换、失效 token、服务故障及只读调用。

**分析版本**

- **仓库**：[duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)
- **版本号**：0.2.93（[固定提交 80f6182](https://github.com/duhu2000/dsh-mcp-connector/tree/80f61822451dbd964d274428d3105d7d72799610)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照原生配置的接入和过期排障时间。

工作区切换、失效 token、服务故障及只读调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 9514 | — | — | 141980 |
| .cjs | example | 1 | 20 | 18 | 1 | — |
| .mjs | example | 2 | 158 | 154 | 6 | — |
| .js | source | 52 | 16531 | 14513 | 1164 | — |
| .mjs | source | 21 | 2742 | 2397 | 199 | — |
| .mjs | test | 64 | 13202 | 11997 | 471 | — |
| .md | example | 1 | 8 | — | — | 69 |

</details>

**活跃度**

[![Issue 未关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/duhu2000/dsh-mcp-connector/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=29&color=737b86&logo=github)](https://github.com/duhu2000/dsh-mcp-connector/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/duhu2000/dsh-mcp-connector/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何在 DSH 内统一接入、查找并排障多个 MCP 服务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样把现有 MCP 配置变成可查的连接？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户在面板选择 OAuth、API Key、HTTP、stdio 或 JSON 导入，再从工具页按来源与范围查目录。Host 保存工具缓存并按工作区过滤，管理工具注册到 DSH。相对手写 mcpServers，它增加凭据生命周期、可见范围和排障入口；缓存中的 schema 只能证明曾发现过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-39](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/README.md#L33-L39)

工具页和缓存边界。

```text
### 工具查找与故障处理

在“工具”页统一查找当前工作区可见、已启用连接的工具。输入工具名或描述，再按连接、服务和最近发现状态筛选；点击“参数详情”查看类型、必填项与嵌套结构。未选择工作区时，仅展示全局连接。

结果标注来源和最后成功缓存时间。发现失败时仍可查看已有缓存，但不代表服务当前可调用。展开“连接状态与故障处理”，按建议使用“检查连接”或“重新发现工具”。健康连接五分钟后到期，页面保持连接时后台检查到期任务；失败时退避，鉴权失败暂停自动重试。

详见[工具工作台教程](docs/USER-GUIDE.md#51-工具工作台统一查找工具)。工具页用于发现与诊断，不执行目标工具；参数摘要与原始安全缓存均有裁剪边界。
```

**依据 2 · 源码核查**：[lib/index.js:1180-1200](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/index.js#L1180-L1200)

工作区可见过滤。

<details>
<summary>查看原文（21行）</summary>

```text
        || entry.connectionSignature !== connectionToolCacheSignature(record)) return null;
    return { entry, ...toolCatalogCacheView(entry) };
  }

  function visibleToolCatalogEntries(workspaceId, connectionKey) {
    const entries = [];
    for (const record of state.connections.values()) {
      if (connectionKey && record.key !== connectionKey) continue;
      if (record.enabled === false) continue;
      if (workspaceId && !connectionVisibleInWorkspace(connectionScopes.binding(record.key), workspaceId)) continue;
      const cached = cachedToolsForRecord(record);
      if (cached) entries.push(cached.entry);
    }
    return entries;
  }

  function explorerRecords(workspaceId) {
    // Unlike the legacy management overview, no Workspace means global-only.
    return [...state.connections.values()].filter((record) => record.enabled !== false
      && connectionVisibleInWorkspace(connectionScopes.binding(record.key), workspaceId));
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3517-3533](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/index.js#L3517-L3533)

加载和核对缓存。

<details>
<summary>查看原文（17行）</summary>

```text
  if (connectionStatistics.available) void connectionStatistics.baseline([...state.connections.values()]
    .map(record => record.connectorId).filter(id => state.merged.some(d => d.id === id)))
    .catch(() => { statisticsError(); });
  if (config.persistSecrets) {
    for (const [key, cached] of await toolCatalogStore.entries().catch(() => [])) {
      const record = state.connections.get(key);
      if (record
          && cached.connectorId === record.connectorId
          && cached.serverName === record.serverName
          && cached.connectionSignature === connectionToolCacheSignature(record)) {
        state.toolCatalogCache.set(key, cached);
      } else {
        await toolCatalogStore.delete(key).catch(() => {});
      }
    }
  }
  for (const [key, raw] of await grantStore.entries().catch(() => [])) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3679-3687](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/index.js#L3679-L3687)

管理工具注册。

```text
  const discoveryInterval = setInterval(() => {
    if (statusEvents.clients.size > 0) scheduleDiscovery();
  }, 30_000);
  discoveryInterval.unref?.();
  const disposeTools = registerTools(ctx, observableApi, { compact: config.compactManagementTools === true, t });

  /* ───────────────────────── web 半区（图形化市场）──────────────────────── */
  // webServer + 新版 webStartup 或旧版 webRuntime；纯对话部署不挂载 HTTP 路由。
  if (typeof ctx.inject === 'function') {
```

#### 缺口

- 未验证真实提供商
  **影响**：不能证明授权或业务调用成功
  **进一步探讨**：先接一个隔离只读服务验收三层结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具隐藏和发现重试怎样保持边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

按 Agent 的工具限制需要 Host 同时提供 guard 与 restrict，否则拒绝开启。激活时要求精确工具名、连接归属和治理允许。发现计划遇鉴权错误停止自动重试，其他失败退避。仍需验证多个工作区切换与缓存恢复，尤其 stdio 是 Host 权限下启动的进程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/session-injection.js:158-168](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/session-injection.js#L158-L168)

工具限制接线。

<details>
<summary>查看原文（11行）</summary>

```text
    }
    try {
      // Install the new, equally-or-more-current restriction before releasing
      // the prior layer. This keeps schema/lookup/dispatch fail closed while
      // tools/change is racing with an activation update.
      const dispose = agent.ctx.tools.restrict({ deny: denied });
      restrictions.set(agent, { denied, dispose });
      current?.dispose?.();
    } catch (error) {
      logger?.warn?.(`session injection restrict agent "${agentLabel(agent)}" failed: ${error.message}`);
    }
```

</details>

**依据 2 · 源码核查**：[lib/session-injection.js:201-218](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/session-injection.js#L201-L218)

Host 能力检查和 guard。

<details>
<summary>查看原文（18行）</summary>

```text
  const disposeGuard = typeof ctx.tools?.guard === 'function'
    ? ctx.tools.guard((execution) => {
        const record = recordForPublicName(execution.name);
        if (!record || normalizeInjectionMode(record.injectionMode, { t }) !== 'session') return undefined;
        if (record.enabled === false) return t('MCP 工具 {name} 所属连接已停用', { name: execution.name });
        if (!execution.agent) return t('MCP 工具 {name} 需要当前会话显式激活', { name: execution.name });
        if (!isRecordVisible(record, execution.agent)) return t('MCP 工具 {name} 不属于当前工作区', { name: execution.name });
        if (!isToolAllowed(execution.name, record)) return t('MCP 工具 {name} 已被治理策略拒绝', { name: execution.name });
        if (!activationValid(execution.agent, execution.name)) return t('MCP 工具 {name} 未在当前会话激活或已过期', { name: execution.name });
        return undefined;
      })
    : null;

  function assertSessionCapabilities() {
    const current = capabilities();
    if (!current.executionGuard || !current.visibilityRestriction) {
      throw new Error(t('当前 DSH Host 不同时支持 tools.guard 与 Agent tools.restrict，不能安全使用按会话注入'));
    }
```

</details>

**依据 3 · 源码核查**：[lib/session-injection.js:238-247](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/session-injection.js#L238-L247)

精确名称和治理。

<details>
<summary>查看原文（10行）</summary>

```text
    if (requested.length === 0) throw new Error(t('必须指定至少一个精确 public tool name'));
    const names = observedPublicNames();
    if (names === null) throw new Error(t('Host 工具名称读取失败，暂不能激活工具'));
    const observed = new Set(names);
    for (const publicName of requested) {
      if (!observed.has(publicName)) throw new Error(t('Host 尚未观察到工具 "{name}"', { name: publicName }));
      const owner = recordForPublicName(publicName);
      if (!owner || owner.key !== record.key) throw new Error(t('工具 "{tool}" 不属于连接 "{name}"', { tool: publicName, name: record.name }));
      if (!isToolAllowed(publicName, record)) throw new Error(t('工具 "{tool}" 已被治理策略拒绝', { tool: publicName }));
    }
```

</details>

**依据 4 · 源码核查**：[lib/discovery-policy.js:1-12](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/lib/discovery-policy.js#L1-L12)

鉴权暂停与退避。

<details>
<summary>查看原文（12行）</summary>

```text
// Pure scheduling policy. No credentials, timers or network operations.
export function nextDiscovery(previous, outcome, now = Date.now()) {
  const failures = outcome.ok ? 0 : Math.min((previous?.failures || 0) + 1, 10);
  if (outcome.errorKind === 'auth') return { failures, nextAt: null, reason: 'auth' };
  const rateLimited = outcome.errorKind === 'rate-limit';
  const delay = outcome.ok ? 300_000 : Math.min((rateLimited ? 60_000 : 30_000) * 2 ** (failures - 1), 900_000);
  const retry = Number.isFinite(outcome.retryAfterMs) ? Math.max(0, outcome.retryAfterMs) : 0;
  return { failures, nextAt: now + Math.max(delay, retry), reason: outcome.ok ? 'success' : rateLimited ? 'rate-limit' : 'retry' };
}

export function discoveryDue(plan, now = Date.now()) {
  return !plan || (plan.nextAt !== null && plan.nextAt <= now);
```

</details>

#### 缺口

- 未实测权限切换与提供商 token
  **影响**：无法保证当前 Host 和全部服务相同
  **进一步探讨**：测试换工作区、禁用连接、失效凭据及已激活工具

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样衡量接入管理能否省时间？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先固定一个只读 HTTP 服务或本地测试 stdio，分开核对保存、发现和业务读取。对照原生 JSON 配置测初次接入与 token 过期后的排障时间，记录平台额度。发现陈旧或越域可见时，撤回连接并恢复原配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-67](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/README.md#L53-L67)

首次验收和安装。

<details>
<summary>查看原文（15行）</summary>

````text
## 开始使用

在插件市场搜索完整包名 **`dsh-mcp-connector`**，或在本机终端运行下方命令。当前默认 Desktop 和 Web 都使用 `web` profile；自定义部署请以宿主实际加载的 profile 为准。

```bash
dsh plugin --profile web add dsh-mcp-connector
```

安装或升级后完全重启 DeepSeek Harness Desktop 或 `dsh web`，然后打开左侧「MCP连接器」；也可从“设置 → 插件 → 插件配置 → MCP连接器”直接打开。

Desktop 需要完全退出并重新启动应用；Web 需要停止原 `dsh web` 进程再启动，只刷新网页不会重新加载后端插件。

**先完成一件事：**[查询一家企业的简介](docs/tutorials/ONE-SUCCESS-CASE.md)，按步骤核对授权、工具来源和真实返回。想写体验文章？使用[社区分享素材包](docs/tutorials/SHARING-KIT.md)，包含演示素材、文章提纲和脱敏记录模板。

首次使用建议依次确认：连接已保存且范围正确 → “工具”页能找到预期工具与来源 → 在正常 DSH 会话中通过 Host 审批链完成一次服务商许可的只读调用。缓存可见不等于当前服务可调用。
````

</details>

**依据 2 · 作者声明**：[README.md:75-86](https://github.com/duhu2000/dsh-mcp-connector/blob/80f61822451dbd964d274428d3105d7d72799610/README.md#L75-L86)

治理和生命周期。

<details>
<summary>查看原文（12行）</summary>

```text
## MCP连接器能做什么

| 能力 | 用户得到什么 |
|---|---|
| 持续更新的连接器目录 | 浏览精选与 9 类业务连接器；Registry 更新后刷新即可获取新卡片 |
| 多种接入方式 | 使用 OAuth 2.0 PKCE、API Key、Streamable HTTP/stdio 或 `mcpServers` JSON 接入 |
| 跨连接工具查找 | 在当前范围内已启用连接的最后成功缓存中按名称或描述搜索，并按连接、服务和状态筛选 |
| 易读参数与来源 | 查看类型、必填、枚举、嵌套摘要、来源、缓存时间及安全裁剪后的 Schema |
| 连接排障 | 根据明确的阶段和错误码检查连接或重新发现工具，同时保留可用的最后成功缓存 |
| 作用域与治理 | 管理 project/global 可见范围以及 Connection、Server、Tool 三层规则 |
| 按会话工具注入 | 连接保持在线，对选定连接默认隐藏 schema，只在当前 Agent 临时激活精确工具 |
| 安全生命周期 | 支持凭据本机存储、授权刷新、脱敏备份、快照回滚及失败时保留原连接 |
```

</details>

#### 缺口

- 外部服务费用与真实排障收益未知
  **影响**：无法量化总成本
  **进一步探讨**：逐服务做只读端到端对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
