# TapTap Open API MCP

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6cc6ad2](https://github.com/taptap/instant-games-open-mcp/tree/6cc6ad255adda2bebb84f0b92b5f21675c1038eb)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/taptap/instant-games-open-mcp) [![npm 30d 5,074](https://img.shields.io/static/v1?label=npm+30d&message=5%2C074&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/instant-games-open-mcp) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@taptap/instant-games-open-mcp)
<!-- END META -->

> **功能**：为 TapTap 小游戏和 H5 提供文档、应用与排行榜管理、H5 上传和当前游戏相关操作的 MCP 服务器。

> **亮点**：[Q01](#research-q01) 将应用上下文、文档指南与管理handler统一在Agent接口，模块内定义与handler同置降低分派漂移；[Q02](#research-q02) 方向检查及写后回读提供具体失败区分。

> **主要限制**：[Q02](#research-q02) 上传描述的确认没有准备摘要绑定；token为JSON缓存，HTTP用户标识和会话独立不足以证明隔离；写后读回警告可能已有远端副作用，不能盲重试。

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
  - [Q01 · 根MCP如何将游戏文档与管理动作接到Agent，与Maker子包有什么边界？](#detail-section-11)
  - [Q02 · 应用身份、token和H5上传的副作用是否受可核查的确认与恢复机制约束？](#detail-section-12)
  - [Q03 · 怎样限定试用、衡量成本，并验证确认快照的新方向？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) TapTap小游戏/H5开发者在明确应用上查指南和管理状态，验收须核实际应用结果。

[Q01](#research-q01) 对照平台后台和API文档的人工流程，不把TapTap平台能力归为MCP原创，不把Maker子包能力混入根默认入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 游戏文档指南 | 查排行榜/广告/云存档等接入资料 | 文档不等于远端工具已可用 |
| 应用与排行榜管理 | 选择应用及平台管理 | 需开发者权限，写操作另行确认 |
| H5准备与上传 | 压缩并上传/更新应用 | 当前缓存app、方向与目录须核，确认未绑定准备摘要 |
| 写后方向回读 | 检查上传后应用方向 | 警告可能已有远端修改，不保证回滚 |
| 多传输入口 | 本地stdio或HTTP/SSE访问 | 独立session不证明远程多用户隔离 |

**流程与依赖**

[Q03](#research-q03) 依赖表分Node/MCP、开发者权限、应用目录、平台网络与缓存保护。

[Q03](#research-q03) 步骤表先本地只读，写前核应用与授权，异常先查远端再重试。

**效果与成本**

[Q03](#research-q03) 成本表列首次、持续、失败与退出，现金与人工未知，不由零配置称零成本。

[Q03](#research-q03) 效果表只确认集中接线、方向检查及写后回读，未证明游戏交付通过或节时。

> **思考**：[Q02](#research-q02) 上传描述的确认没有准备摘要绑定；token为JSON缓存，HTTP用户标识和会话独立不足以证明隔离；写后读回警告可能已有远端副作用，不能盲重试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将应用上下文、文档指南与管理handler统一在Agent接口，模块内定义与handler同置降低分派漂移；[Q02](#research-q02) 方向检查及写后回读提供具体失败区分。

[Q01](#research-q01) 模块化定义/handler和上下文剥离可复用；[Q02](#research-q02) 写后警告应保留部分成功语义，session独立与身份授权不可混同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 上传描述的确认没有准备摘要绑定；token为JSON缓存，HTTP用户标识和会话独立不足以证明隔离；写后读回警告可能已有远端副作用，不能盲重试。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在独立缓存与测试工作区用本地stdio查指南和状态，区分根Open API与Maker。不自动执行生产上传；每次明确应用/目录与写字段，警告后先平台回读。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根默认Open API服务器及代表H5链source核查；可有限本地stdio只读试用，非DSH原生插件，远程多用户及全部Maker功能未审完，无运行验收。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/server.ts、src/core/auth/tokenStorage.ts、src/core/utils/env.ts、src/features/leaderboard/tools.ts、src/features/h5Game/tools.ts、src/features/h5Game/handlers.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件inventory整仓，人工定向覆盖默认Open API服务器、token存储、工具分派及代表H5上传/回读；不把Maker子组件或整仓统计当默认服务器全审。
- 下一步：未执行目标代码、MCP、OAuth、上传或平台写入；隔离核只读状态后，测试应用演练app/目录错配和上传后读回失败，记录实际平台结果。

**分析版本**

- **仓库**：[taptap/instant-games-open-mcp](https://github.com/taptap/instant-games-open-mcp)
- **版本号**：1.24.14（[固定提交 6cc6ad2](https://github.com/taptap/instant-games-open-mcp/tree/6cc6ad255adda2bebb84f0b92b5f21675c1038eb)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 未验证确认快照绑定app、目录与字段，执行前验摘要、写后回读操作标识；以错配和未知结果对照，无改善或负担过高即否定。

未执行目标代码、MCP、OAuth、上传或平台写入；隔离核只读状态后，测试应用演练app/目录错配和上传后读回失败，记录实际平台结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 159 | 29175 | — | — | 379114 |
| .mjs | source | 31 | 13777 | 13226 | 411 | — |
| .cjs | source | 16 | 1566 | 1371 | 66 | — |
| .js | source | 46 | 10691 | 9768 | 234 | — |
| .ts | source | 459 | 118992 | 105482 | 7032 | — |
| .ts | test | 215 | 70046 | 65105 | 488 | — |
| .cjs | example | 2 | 155 | 155 | 2 | — |
| .md | test | 1 | 60 | — | — | 208 |
| .cjs | test | 4 | 532 | 514 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=34&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 293](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=293&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 299](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=299&color=737b86&logo=github)](https://github.com/taptap/instant-games-open-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根MCP如何接入TapTap游戏文档和管理动作，并保持应用身份、授权及发布副作用可解释？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根MCP如何将游戏文档与管理动作接到Agent，与Maker子包有什么边界？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

根包@taptap/instant-games-open-mcp是独立MCP服务器，不是原生DSH插件。package默认入口dist/server.js，源码src/server.ts把app、当前游戏DC、排行榜、H5、振动、联机、分享、云存档和广告模块汇总。ListTools按启用规则列定义，CallTool根据toolRegistry找到handler，经上下文和必要认证后调用；文档类handler返回指南，管理类handler会请求平台，两类不能混成“所有功能均直接执行”。

目标用户是管理TapTap小游戏/H5的开发者，合格结果是在选定应用上读取正确文档或得到可核对管理状态。相对查文档后手动在后台操作，增量是把开发者/应用选择、客户端指南和管理API呈现在同一Agent接口。例如排行榜指南工具返回集成流程，创建榜工具要求应用上下文；H5上传则有准备和上传两个入口。MCP接线贡献属于本包，TapTap底层平台能力不属于本包创造。

同仓有Maker源码和多个客户端/插件子包，但根默认Open API服务器不等于Maker默认会话。packages/dsh-maker是单独的原生DSH桥接包，其精确运行时依赖和技能不能自动从根仓继承；本根研究不跨组件继承评分或假设。root inventory是整仓口径，包含大量Maker相关实现，不能把总行数当默认根MCP实现量或原创量。本次只围绕根服务器和代表性H5管理链核查，不宣称已审所有Maker画布/构建/素材功能。

stdio使用固定local会话上下文，HTTP/SSE另创建每会话Server与Transport。独立上下文有助避免一个全局server混用连接，但并不单独证明用户身份可信或资源隔离，后者需检查入口与缓存键。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-15](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/package.json#L1-L15)

根包默认服务器与proxy导出。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "@taptap/instant-games-open-mcp",
  "version": "1.24.14",
  "type": "module",
  "description": "TapTap Open API MCP Server - Documentation and Management APIs for TapTap Minigame and H5 Games (Leaderboard, and more features coming)",
  "main": "dist/server.js",
  "bin": {
    "instant-games-open-mcp": "bin/instant-games-open-mcp",
    "taptap-mcp-proxy": "bin/taptap-mcp-proxy"
  },
  "exports": {
    ".": "./dist/server.js",
    "./proxy": "./dist/proxy.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[src/server.ts:81-91](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L81-L91)

根默认模块范围。

<details>
<summary>查看原文（11行）</summary>

```text
const allModules: FeatureModule[] = [
  appModule, // App management (developer/app selection)
  dcCurrentAppModule, // DC current-app store/forum/review capabilities
  leaderboardModule, // Leaderboard management
  h5GameModule, // H5 Game management (upload, publish, status)
  vibrateModule, // Vibrate API documentation and guides
  multiplayerModule, // Multiplayer/OnlineBattle SDK documentation
  shareModule, // Share API documentation and management
  cloudSaveModule, // Cloud Save documentation (client-side only)
  adsModule, // Ads integration guide (Rewarded Video, Interstitial, Banner)
];
```

</details>

**依据 3 · 源码核查**：[src/server.ts:296-301](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L296-L301)

stdio本地上下文。

```text
  private setupHandlers(): void {
    // stdio 模式：使用默认的 sessionContext
    const defaultContext: SessionContext = {
      userId: 'local', // stdio 固定使用 'local'
    };
    this.setupHandlersForServer(this.server, defaultContext);
```

**依据 4 · 源码核查**：[src/server.ts:319-358](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L319-L358)

工具列表、registry路由及认证检查。

<details>
<summary>查看原文（40行）</summary>

```text
    // 设置工具列表处理器 - 从所有模块收集
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: allModules.flatMap((m) => getEnabledTools(m.tools).map((t) => t.definition)),
    }));

    // 设置工具调用处理器 - 自动从模块路由
    server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
      const { name, arguments: args } = request.params;

      // 私有参数支持两种方式：
      // 1. MCP Proxy 在 arguments 中注入（args._mac_token, _user_id, etc.）
      // 2. HTTP Header 注入（仅 HTTP/SSE 模式，从 extra.requestInfo.headers 读取）
      let enrichedArgs = args || {};

      // 从 HTTP Headers 提取所有私有参数（如果存在且 args 中没有）
      if (extra?.requestInfo?.headers) {
        enrichedArgs = this.extractPrivateParamsFromHeaders(
          enrichedArgs,
          extra.requestInfo.headers as Record<string, string | string[]>
        );
      }

      // Log tool call input (私有参数会被自动过滤)
      await logger.logToolCall(name, enrichedArgs);

      // ✅ 构建 ResolvedContext（直接使用 SessionContext）
      const ctx = new ResolvedContext(enrichedArgs, this.getSessionContext(sessionContext));

      try {
        // 使用 Map 快速查找工具（O(1) 复杂度）
        const toolReg = this.toolRegistry.get(name);

        if (!toolReg) {
          throw new McpError(ErrorCode.MethodNotFound, `未知工具: ${name}`);
        }

        // Check if authentication is required
        if (toolReg.requiresAuth) {
          try {
            await this.ensureAuth(ctx);
```

</details>

**依据 5 · 源码核查**：[src/server.ts:382-407](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L382-L407)

剥离私有字段后调用业务handler。

<details>
<summary>查看原文（26行）</summary>

```text
        // 从 args 中移除私有参数（业务层完全不感知）
        const businessArgs = stripPrivateParams(enrichedArgs);

        // 构建 ToolCallExtra（封装 progress 通知能力）
        const toolExtra: ToolCallExtra = {};
        const progressToken = request.params._meta?.progressToken;
        if (progressToken !== undefined) {
          toolExtra.sendProgress = async (progress, total, message) => {
            try {
              await extra.sendNotification({
                method: 'notifications/progress',
                params: {
                  progressToken,
                  progress,
                  ...(total !== undefined ? { total } : {}),
                  ...(message !== undefined ? { message } : {}),
                },
              });
            } catch {
              // Progress 通知失败不应影响工具执行，静默忽略
            }
          };
        }

        // ✅ Call handler（传递 ResolvedContext 和 ToolCallExtra）
        const result = await toolReg.handler(businessArgs, ctx, toolExtra);
```

</details>

**依据 6 · 源码核查**：[src/features/leaderboard/tools.ts:16-38](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/leaderboard/tools.ts#L16-L38)

文档指南与创建榜工具并存。

<details>
<summary>查看原文（23行）</summary>

```text
export const leaderboardTools: ToolRegistration[] = [
  // 🎯 Integration Guide
  {
    definition: {
      name: 'get_leaderboard_integration_guide',
      description:
        '⭐ READ THIS FIRST when user wants to integrate/接入/setup/add leaderboard功能. Returns complete step-by-step workflow. CRITICAL: Emphasizes NO SDK installation - tap is global object. Call this BEFORE making any implementation plans.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    handler: async (_args, _context) => {
      return leaderboardDocTools.getIntegrationWorkflow();
    },
  },

  // ⚙️ Create Leaderboard
  {
    definition: {
      name: 'create_leaderboard',
      description:
        "**PREREQUISITE: An app MUST be selected first.** Before calling this tool, ALWAYS call get_current_app_info to verify an app is selected. If not, guide user through: 1) Call list_developers_and_apps, 2) Show list to user and ASK them to choose, 3) Call select_app with user's choice. Create a new leaderboard on TapTap server. Auto-fetches developer_id and app_id from selected app. Returns leaderboard_id for client-side APIs.",
```

</details>

**依据 7 · 源码核查**：[src/server.ts:758-785](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L758-L785)

每会话Server/Transport，非多租户证明。

<details>
<summary>查看原文（28行）</summary>

```text
      // New session - create new Server and Transport instances
      const sessionServer = new Server(
        {
          name: 'taptap-minigame-mcp',
          version: VERSION,
        },
        {
          capabilities: {
            logging: {},
            tools: {},
            resources: {},
          },
        }
      );

      // ✅ 为这个 session 设置 handlers（闭包自动捕获 sessionContext）
      this.setupHandlersForServer(sessionServer, sessionContext);

      // Create new transport instance for this session
      const sessionTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          // Generate secure session ID
          return Math.random().toString(36).substring(2) + Date.now().toString(36);
        },
        // Response mode based on transport type:
        // - 'http': JSON responses only (for clients that don't support SSE)
        // - 'sse': SSE streaming (for Streamable HTTP clients)
        enableJsonResponse: transportMode === 'http',
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 应用身份、token和H5上传的副作用是否受可核查的确认与恢复机制约束？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

核心限制是工具描述中的用户确认不等于持久绑定的操作许可。upload_h5_game描述要求沿用prepare_h5_upload确认的目录，但参数只有gamePath、genre和screenOrientation，没有本次准备快照或确认令牌。handler从当前缓存取app，解析路径、查方向后压缩并上传，再调用editAppInfo发布/更新应用。没有看到该链要求匹配prepare结果摘要，因此Agent和用户须在调用前再次核应用与目录，不能仅因描述写“after confirms”就宣称服务端强制确认。

方向缺失/查询失败会在上传前返回；上传后应用更新成功但缓存刷新或方向核对失败会返回警告。这种状态不是“什么都没做”：文件上传和平台更新可能已发生，不能把警告当安全重试许可。代码保留了“部分操作完成但读回失败”的重要区别，本轮未核平台幂等或回滚，故异常先查平台实际状态。

tokenStorage将token对象及附加字段JSON写入缓存，函数未显式加密或设置文件mode；cacheDir默认系统临时目录下taptap-mcp/cache。路径按userId/projectId拼接，不应把字段名“用户隔离”当成已验证权限边界。HTTP新会话会从URL或headers接收用户/项目标识和token；现有sessionId会复用transport，不能只据会话独立推断身份认证或防跨用户访问已成立。对外HTTP部署与不可信多用户场景需要独立审入口认证、键规范化与会话绑定，本轮不予背书。

可借鉴的是模块把定义与handler放在一起、认证与业务上下文分层，以及方向查询失败不猜值。维护代价则是上游API/账号权限和缓存状态必须一致，日志过滤声明也不自动证明所有输出已脱敏。本地stdio单用户能收窄暴露面，但仍要保护缓存与账号，服务器停用不等于token被撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/h5Game/tools.ts:77-119](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/tools.ts#L77-L119)

描述要求确认，但schema无prepare摘要/许可token。

<details>
<summary>查看原文（43行）</summary>

```text
      name: 'upload_h5_game',
      description: `
        [H5 Game Upload Workflow - Step 2]
        Upload the H5 game to TapTap platform after user confirms info from prepare_h5_upload.

        **PREREQUISITE: An app MUST be selected first.**
        This tool reads app info from cache (selected via select_app or create_app).
        If no app is selected, it will return an error guiding user to select one first.

        **SCREEN ORIENTATION:**
        If the selected app has no screen orientation, this tool will pause before uploading.
        Ask the user to choose 1 (portrait) or 2 (landscape), then call this tool again with
        screenOrientation. DO NOT guess the orientation.
      `,
      inputSchema: {
        type: 'object',
        properties: {
          gamePath: {
            type: 'string',
            description: `**MUST be a relative path** to the H5 game build output directory.

✅ Correct: "dist", "build", "output", "."
❌ Wrong: "/workspace/dist", "/tmp/build" (absolute paths not allowed)

Use the same path confirmed in prepare_h5_upload step.`,
          },
          genre: {
            type: 'string',
            description: TOOL_DESCRIPTION.GENRE_DESCRIPTION,
          },
          screenOrientation: {
            type: 'number',
            enum: [1, 2],
            description:
              'Game screen orientation: 1 = portrait, 2 = landscape. ' +
              'Provide this after the upload tool reports that the selected app has no orientation. ' +
              'Ask the user to choose; do not guess.',
          },
        },
      },
    },
    handler: async (args, context) => {
      return await handleUploadGame(args, context);
```

</details>

**依据 2 · 源码核查**：[src/features/h5Game/handlers.ts:405-452](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/handlers.ts#L405-L452)

当前缓存应用与方向检查，缺方向在写前返回。

<details>
<summary>查看原文（48行）</summary>

```text
export async function handleUploadGame(
  args: {
    gamePath?: string; // 相对路径，相对于 WORKSPACE_ROOT（或 WORKSPACE_ROOT/_project_path）
    genre?: string;
    screenOrientation?: number;
  },
  ctx?: ResolvedContext
): Promise<string> {
  // 1. 从缓存获取已选择的 App 信息
  const appInfo = getSelectedAppInfo(ctx);
  if (!appInfo.success) {
    return appInfo.message!;
  }

  // 2. 使用通用路径解析器（允许空路径，上传时不强制 index.html 检查）
  const pathResult = resolvePathSafe(args.gamePath, ctx, { allowEmpty: true, checkExists: true });

  // 3. H5 业务特定验证（上传时不强制要求 index.html，因为可能在后续压缩时检查）
  const validationError = validateH5GamePath(pathResult, false);
  if (validationError) {
    throw new Error(validationError);
  }

  const gamePath = pathResult.resolvedPath!;
  const developerId = appInfo.developerId!;
  const appId = appInfo.appId!;
  let screenOrientation: ScreenOrientation | undefined;
  if (args.screenOrientation === undefined) {
    try {
      screenOrientation = getScreenOrientationFromAppDetail(await fetchAppDetail(appId, ctx, true));
    } catch (orientationError) {
      const detail =
        orientationError instanceof Error ? orientationError.message : String(orientationError);
      await logger.warning(`[H5Game] 查询应用 ${appId} 横竖屏设置失败：${detail}`);
      if (isAuthError(orientationError)) {
        return getScreenOrientationQueryFailedMessage(
          detail,
          orientationError.userGuidance || orientationError.message
        );
      }
      return getScreenOrientationQueryFailedMessage(detail);
    }
  } else {
    screenOrientation = normalizeScreenOrientation(args.screenOrientation);
  }

  if (screenOrientation === undefined) {
    return SCREEN_ORIENTATION_REQUIRED;
```

</details>

**依据 3 · 源码核查**：[src/features/h5Game/handlers.ts:458-502](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/handlers.ts#L458-L502)

压缩、上传后发布更新真实副作用。

<details>
<summary>查看原文（45行）</summary>

```text
  try {
    // 1. 压缩目录
    const archiveSize = await compressDirectory(gamePath, outputPath);
    await logger.info(MESSAGES.COMPRESSION_SUCCESS(archiveSize));

    // 2. 获取上传参数
    let uploadParams: UploadParams;
    try {
      uploadParams = await getH5PackageUploadParams(appId, ctx);
      await logger.info(MESSAGES.GET_UPLOAD_PARAMS_SUCCESS(uploadParams, outputPath));
    } catch (error) {
      return MESSAGES.COMPRESSED_GET_PARAMS_FAILED(archiveSize, String(error));
    }

    // 3. 上传文件
    let packageId: number;
    try {
      packageId = await uploadFile(uploadParams, outputPath);
    } catch (error) {
      throw new Error(
        MESSAGES.FILE_COMPRESSED_UPLOAD_FAILED(
          error instanceof Error ? error.message : String(error)
        )
      );
    }

    // 4. 发布到 TapTap
    await logger.info(MESSAGES.PUBLISH_PARAMS(appId, developerId, packageId));

    const results = await editAppInfo(
      appId, // app_id
      developerId, // developer_id
      packageId, // package_id
      undefined, // appName
      args.genre, // genre
      undefined, // description
      undefined, // chatting_label
      undefined, // chatting_number
      screenOrientation, // screen_orientation
      undefined, // icon
      undefined, // banner
      undefined, // screenshots
      undefined, // trial_note
      ctx // ctx
    );
```

</details>

**依据 4 · 源码核查**：[src/features/h5Game/handlers.ts:504-524](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/handlers.ts#L504-L524)

写后缓存/方向读回警告与成功不同。

<details>
<summary>查看原文（21行）</summary>

```text
    // 5. 刷新应用缓存并确认本次提交的横竖屏方向
    let refreshedAppInfo: Awaited<ReturnType<typeof refreshAppCache>>;
    try {
      refreshedAppInfo = await refreshAppCache(ctx?.projectPath, ctx);
    } catch (refreshError) {
      return getScreenOrientationVerificationWarning(
        screenOrientation,
        undefined,
        refreshError instanceof Error ? refreshError.message : String(refreshError)
      );
    }

    const refreshedOrientation = getScreenOrientationFromCache(refreshedAppInfo);
    if (refreshedOrientation !== screenOrientation) {
      return getScreenOrientationVerificationWarning(screenOrientation, refreshedOrientation);
    }

    let msg = MESSAGES.GAME_PUBLISH_SUCCESS(results.app_title, appId);
    msg += '\n' + MESSAGES.GAME_TYPE_INFO(results.display_app_title) + '\n';

    return msg;
```

</details>

**依据 5 · 源码核查**：[src/core/auth/tokenStorage.ts:40-50](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/core/auth/tokenStorage.ts#L40-L50)

token路径由用户项目字段拼接。

<details>
<summary>查看原文（11行）</summary>

```text
export function getTokenPath(userId?: string, projectId?: string): string {
  const cacheDir = EnvConfig.cacheDir;
  const effectiveUserId = userId || 'local';

  if (projectId) {
    // 项目级隔离
    return path.join(cacheDir, effectiveUserId, projectId, 'oauth-token.json');
  } else {
    // 用户级隔离
    return path.join(cacheDir, effectiveUserId, 'oauth-token.json');
  }
```

</details>

**依据 6 · 源码核查**：[src/core/auth/tokenStorage.ts:121-144](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/core/auth/tokenStorage.ts#L121-L144)

JSON token持久化未显式mode/加密。

<details>
<summary>查看原文（24行）</summary>

```text
  const { userId, projectId, environment } = options || {};
  const tokenPath = getTokenPath(userId, projectId);

  try {
    const dir = path.dirname(tokenPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tokenData = {
      ...token,
      saved_at: new Date().toISOString(),
      environment,
      user_id: userId, // 记录用户标识
      project_id: projectId, // 记录项目标识（如果有）
    };

    fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2), 'utf8');
    process.stderr.write(`✅ Token saved to: ${tokenPath}\n`);
  } catch (error) {
    process.stderr.write(
      `⚠️  Failed to save token: ${error instanceof Error ? error.message : String(error)}\n`
    );
  }
```

</details>

**依据 7 · 源码核查**：[src/core/utils/env.ts:161-168](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/core/utils/env.ts#L161-L168)

默认缓存与临时路径。

```text
  /** 缓存目录 */
  static get cacheDir(): string {
    return getEnv('TAPTAP_MCP_CACHE_DIR', path.join(os.tmpdir(), 'taptap-mcp', 'cache'));
  }

  /** 临时文件目录 */
  static get tempDir(): string {
    return getEnv('TAPTAP_MCP_TEMP_DIR', path.join(os.tmpdir(), 'taptap-mcp', 'temp'));
```

**依据 8 · 源码核查**：[src/server.ts:680-712](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/server.ts#L680-L712)

session复用与新连接的标识来源。

<details>
<summary>查看原文（33行）</summary>

```text
        // Use existing transport for this session
        const { transport } = transports.get(sessionId)!;
        await transport.handleRequest(req, res);
        return;
      }

      // ✅ 新 session：从 URL 参数或 Headers 提取用户标识
      // 优先级：URL 参数 > HTTP Headers
      // 这样客户端可以在连接 URL 中传递参数，如：
      //   http://localhost:3000/?project_id=game-a&user_id=user-123
      const getHeader = (name: string): string | undefined => {
        const value = req.headers[name.toLowerCase()];
        return typeof value === 'string' ? value : undefined;
      };

      // URL 参数（SSE 直连兼容）
      const urlUserId = url.searchParams.get('user_id');
      const urlProjectId = url.searchParams.get('project_id');
      const urlProjectPath = url.searchParams.get('project_path');

      // HTTP Headers（Proxy 模式推荐，更安全）
      const headerUserId = getHeader('X-TapTap-User-Id');
      const headerProjectId = getHeader('X-TapTap-Project-Id');
      const headerProjectPath = getHeader('X-TapTap-Project-Path');
      const headerMacToken = getHeader('X-TapTap-Mac-Token');
      const headerCustomFields = getHeader('X-TapTap-Custom-Fields');
      const headerTag = getHeader('X-TapTap-Tag');

      // 合并：Headers 优先（Proxy 使用 Headers，SSE 直连使用 URL 参数）
      // 使用 ?? undefined 将 null 转换为 undefined（SessionContext 不接受 null）
      const userId = headerUserId || (urlUserId ?? undefined);
      const projectId = headerProjectId || (urlProjectId ?? undefined);
      let projectPath = headerProjectPath || (urlProjectPath ?? undefined);
```

</details>

#### 缺口

- 未审完远程入口身份认证、缓存键规范化和全部业务工具
  **影响**：不能证明HTTP多用户隔离或所有写操作授权
  **进一步探讨**：部署远程前核认证/session绑定、路径输入与并发应用选择；分工具检查许可。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样限定试用、衡量成本，并验证确认快照的新方向？

**研究主题**：效果与总成本、采用判断、新假设与验证、依赖、兼容与流程

#### 完整回答

可先在本地stdio单用户环境做文档与只读应用状态试用，目标是减少后台查找与API上下文拼接，而非直接让Agent无人值守发布。生产应用上传、评价回复、排行榜管理等动作应由用户针对具体应用逐项决定。服务器已有模块化调用与应用选择，是有价值的接线基础；远程部署、全部平台工具和Maker运行时均不在当前试用背书内。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18.14.1与兼容MCP客户端 | 启动必需 | 运行服务器/传输 | 本轮未执行，先验tools列表 |
| TapTap开发者账号、OAuth/token及应用权限 | 管理动作必需 | 访问所选应用 | 未授权先退出，扫码不等于拥有应用权 |
| 明确工作区与当前应用上下文 | 项目管理必需 | 目录和app对应 | 调用前展示并核对，不凭缓存猜项目 |
| 平台网络与API可用 | 远端操作必需 | 上传、管理和回读 | 超时后先核远端，不盲重试 |
| 缓存权限及认证部署 | 特别是HTTP必需 | 保护token与会话 | 不可信多用户部署须另审 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离缓存与测试工作区，选择本地stdio | 不复用生产凭据或不可信共享目录 |
| 加载 | 客户端连接根Open API MCP | 名称/工具与Maker区别明确 |
| 只读核对 | Agent查指南和当前应用，用户确认 | 应用、目录、权限可解释 |
| 写入前 | 用户审核准备信息、目录和将修改字段 | 有明确授权再调用，无确认则停 |
| 异常/退出 | 用户先查平台实际包/应用状态，再停服务器并清理/撤销token | 不把本地警告等同远端未写 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包、账号和网络资源未知 | OAuth、应用与工作区选择 | 零配置认证不等于零授权负担 |
| 持续使用 | API、上传带宽与模型调用未知 | 查文档与写前确认 | 无同任务节时/质量对照 |
| 失败恢复 | 压缩临时文件和已上传内容 | 回读平台、核部分成功、决定重试 | 无回滚与幂等实证 |
| 退出 | 缓存和备份占用 | 停进程、清token与必要撤销 | 停MCP不自动注销账号 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文档与操作集中 | 模块与工具handler统一接入 | 少多少操作/误用 |
| 应用与方向检查 | 上传前检查，写后方向回读 | 并发选择和超时是否一致 |
| 交付结果 | 有上传/发布代码链 | 游戏验收通过或平台可用性 |

新假设是prepare生成绑定应用、目录和待写字段的确认快照，执行时校验摘要并返回可回读操作标识。现有prepare与方向读回是参照，新增目标不是再加一个确认文案，而是拒绝准备后切换应用/目录的错配，并解释上传后未知结果。最小对照在测试应用中注入准备后换app、文件变化与上传后读回断开，观察误目标写入、重复上传和人工恢复时间。若当前流程同样可靠、快照频繁过期造成额外负担或仍不能解释远端结果，否定方案。该方向未实现验证，不算根包已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/h5Game/tools.ts:77-119](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/tools.ts#L77-L119)

prepare说明与执行schema构成快照假设基础。

<details>
<summary>查看原文（43行）</summary>

```text
      name: 'upload_h5_game',
      description: `
        [H5 Game Upload Workflow - Step 2]
        Upload the H5 game to TapTap platform after user confirms info from prepare_h5_upload.

        **PREREQUISITE: An app MUST be selected first.**
        This tool reads app info from cache (selected via select_app or create_app).
        If no app is selected, it will return an error guiding user to select one first.

        **SCREEN ORIENTATION:**
        If the selected app has no screen orientation, this tool will pause before uploading.
        Ask the user to choose 1 (portrait) or 2 (landscape), then call this tool again with
        screenOrientation. DO NOT guess the orientation.
      `,
      inputSchema: {
        type: 'object',
        properties: {
          gamePath: {
            type: 'string',
            description: `**MUST be a relative path** to the H5 game build output directory.

✅ Correct: "dist", "build", "output", "."
❌ Wrong: "/workspace/dist", "/tmp/build" (absolute paths not allowed)

Use the same path confirmed in prepare_h5_upload step.`,
          },
          genre: {
            type: 'string',
            description: TOOL_DESCRIPTION.GENRE_DESCRIPTION,
          },
          screenOrientation: {
            type: 'number',
            enum: [1, 2],
            description:
              'Game screen orientation: 1 = portrait, 2 = landscape. ' +
              'Provide this after the upload tool reports that the selected app has no orientation. ' +
              'Ask the user to choose; do not guess.',
          },
        },
      },
    },
    handler: async (args, context) => {
      return await handleUploadGame(args, context);
```

</details>

**依据 2 · 源码核查**：[src/features/h5Game/handlers.ts:504-524](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/features/h5Game/handlers.ts#L504-L524)

已有回读是新方案应对照的机制。

<details>
<summary>查看原文（21行）</summary>

```text
    // 5. 刷新应用缓存并确认本次提交的横竖屏方向
    let refreshedAppInfo: Awaited<ReturnType<typeof refreshAppCache>>;
    try {
      refreshedAppInfo = await refreshAppCache(ctx?.projectPath, ctx);
    } catch (refreshError) {
      return getScreenOrientationVerificationWarning(
        screenOrientation,
        undefined,
        refreshError instanceof Error ? refreshError.message : String(refreshError)
      );
    }

    const refreshedOrientation = getScreenOrientationFromCache(refreshedAppInfo);
    if (refreshedOrientation !== screenOrientation) {
      return getScreenOrientationVerificationWarning(screenOrientation, refreshedOrientation);
    }

    let msg = MESSAGES.GAME_PUBLISH_SUCCESS(results.app_title, appId);
    msg += '\n' + MESSAGES.GAME_TYPE_INFO(results.display_app_title) + '\n';

    return msg;
```

</details>

**依据 3 · 源码核查**：[src/core/auth/tokenStorage.ts:121-144](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/src/core/auth/tokenStorage.ts#L121-L144)

试用需独立保护本地token。

<details>
<summary>查看原文（24行）</summary>

```text
  const { userId, projectId, environment } = options || {};
  const tokenPath = getTokenPath(userId, projectId);

  try {
    const dir = path.dirname(tokenPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tokenData = {
      ...token,
      saved_at: new Date().toISOString(),
      environment,
      user_id: userId, // 记录用户标识
      project_id: projectId, // 记录项目标识（如果有）
    };

    fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2), 'utf8');
    process.stderr.write(`✅ Token saved to: ${tokenPath}\n`);
  } catch (error) {
    process.stderr.write(
      `⚠️  Failed to save token: ${error instanceof Error ? error.message : String(error)}\n`
    );
  }
```

</details>

**依据 4 · 作者声明**：[package.json:60-78](https://github.com/taptap/instant-games-open-mcp/blob/6cc6ad255adda2bebb84f0b92b5f21675c1038eb/package.json#L60-L78)

许可、运行时与MCP依赖声明。

<details>
<summary>查看原文（19行）</summary>

```text
  "publishConfig": {
    "access": "public"
  },
  "engines": {
    "node": ">=18.14.1"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.27.1",
    "archiver": "7.0.1",
    "crypto-js": "^4.2.0",
    "dotenv": "17.2.3",
    "marked": "9.1.6",
    "pngjs": "7.0.0",
    "protobufjs": "8.8.0",
    "qrcode": "1.5.4",
    "ws": "8.21.3",
    "yaml": "2.8.2",
    "yauzl": "3.4.0"
  },
```

</details>

#### 缺口

- 没有同条件任务、误目标或人工恢复数据
  **影响**：试用和新快照价值均为条件分析
  **进一步探讨**：以测试应用对照本题故障矩阵，记录真实平台状态与恢复成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
