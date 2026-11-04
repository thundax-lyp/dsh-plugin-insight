# Awesome Gaussian Skills

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[865ae83](https://github.com/jaccen/Awesome-Gaussian-Skills/tree/865ae837255c7fa7572523a9a6444c9c711c9e15)

<!-- BEGIN META -->
[![GitHub ★ 177](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=177&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/jaccen/Awesome-Gaussian-Skills)
<!-- END META -->

> **功能**：提供 3D Gaussian Splatting 方法资料、Agent Skill 与 MCP 渲染服务。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 集合资料、Skill 和 MCP 入口；实际研究与渲染收益未对照。

> **主要限制**：[Q03](#research-q03) 渲染桥网络与路径检查存在需验证的边界；[Q02](#research-q02) stub 和 headless 不能当真实结果。

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
  - [Q01 · 该工程对 3DGS 研究者提供什么，相比普通论文列表有何增量？](#detail-section-11)
  - [Q02 · DSH 如何接入服务，渲染失败与实验功能如何体现？](#detail-section-12)
  - [Q03 · 场景与渲染桥的文件和网络边界是否足以视作隔离？](#detail-section-13)
  - [Q04 · 运行条件、磁盘与退出负担是什么？](#detail-section-14)
  - [Q05 · 如何让 Agent 明确区别仿真结果和真实渲染？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：3DGS 研究和内容制作人员需要发现方法、获取辅助指引或探索场景渲染。

手动检索论文和使用各自独立的渲染工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| Skill 和资料 | 组织 3DGS 方法 | 内容准确性未全审 |
| MCP 渲染 | 连接场景和浏览器 | headless 无图 |
| 实验工具 | 表达未来接口 | 仅 stub，不是实现 |
| 渲染桥 | 服务临时场景 | 网络和路径边界待验证 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| DSH Skill 和 MCP client | DSH 入口需要 | 挂载技能和服务 | 工具不可用 |
| Node、tsx 与依赖 | 源码 MCP 需要 | 启动子进程 | 启动失败 |
| 浏览器 renderer 与场景 | 实际渲染需要 | 生成图像 | 返回 headless 或失败 |
| 隔离网络和可信路径 | 安全试用需要 | 控制桥接和文件访问 | 可能暴露场景或接受连接 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户检查依赖与隔离环境 | 不满足网络边界则停止 |
| 导入 | 使用非敏感场景 | 解析失败不启用假数据冒充 |
| 渲染 | 连接 renderer 并核对 has_image | headless 或 stub 不作为成品 |
| 收尾 | 检查临时文件和进程 | 按备份与环境规则清理 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | Node、MCP、浏览器、场景 | 配置和隔离 | 兼容未知 |
| 持续 | 渲染内存、磁盘及 GPU | 验证来源和结果 | 资源消耗未知 |
| 恢复 | 工作目录与备份 | 检查临时数据及进程 | 清理恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 资料和技能入口 | 文档及 bundle | 实际科研质量 |
| MCP 调度 | 注册和处理器 | 宿主兼容 |
| 渲染输出状态 | has_image 与 stub 字段 | 消费方是否保留状态 |

> **思考**：[Q03](#research-q03) 渲染桥网络与路径检查存在需验证的边界；[Q02](#research-q02) stub 和 headless 不能当真实结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 集合资料、Skill 和 MCP 入口；实际研究与渲染收益未对照。

[Q02](#research-q02) 显式区分 headless 与 stub；[Q03](#research-q03) 的 Origin 与路径条件仍需实际验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 渲染桥网络与路径检查存在需验证的边界；[Q02](#research-q02) stub 和 headless 不能当真实结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先隔离网络并用非敏感场景核对真实渲染；[Q03](#research-q03) 边界不满足时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本定向源码检查，未安装、启动 renderer 或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、mcp-server/package.json、mcp-server/src/index.ts、mcp-server/src/tools.ts、mcp-server/src/renderer-bridge.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根 bundle、MCP 注册、场景导入、渲染结果及桥接网络；未全审论文数据、全部工具与 renderer 实现。
- 下一步：隔离环境验证工具加载、实际渲染、无 Origin、路径链接与退出清理；本次未执行。

**分析版本**

- **仓库**：[jaccen/Awesome-Gaussian-Skills](https://github.com/jaccen/Awesome-Gaussian-Skills)
- **版本号**：0.9.12（[固定提交 865ae83](https://github.com/jaccen/Awesome-Gaussian-Skills/tree/865ae837255c7fa7572523a9a6444c9c711c9e15)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设持续传递场景来源与渲染能力可减少结果误认，需对照现有标志。

隔离环境验证工具加载、实际渲染、无 Origin、路径链接与退出清理；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 263 | 45634 | — | — | 567968 |
| .js | source | 3 | 1329 | 1304 | 281 | — |
| .ts | example | 2 | 360 | 281 | 46 | — |
| .mjs | source | 2 | 126 | 95 | 23 | — |
| .ts | source | 36 | 12740 | 9968 | 1631 | — |
| .mjs | test | 7 | 1295 | 997 | 151 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jaccen/Awesome-Gaussian-Skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/jaccen/Awesome-Gaussian-Skills/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/jaccen/Awesome-Gaussian-Skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 接入、渲染状态与场景文件及网络边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该工程对 3DGS 研究者提供什么，相比普通论文列表有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

工程面向查找 Gaussian Splatting 方法、分析研究或探索场景渲染的用户，组合方法目录、自然语言 Skill 和 MCP 渲染服务。相对纯论文列表，它提供可供 Agent 使用的说明和工具接线；具体论文数量、论文比较正确性、科研节时与渲染质量仍是作者声明或未知，不能把列出的工具数量等同真实能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-78](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/README.md#L63-L78)

作者比较论文列表和 AI 工具包。

<details>
<summary>查看原文（16行）</summary>

```text
## Why This Repo?

Other awesome lists give you paper titles. **We give you paper titles + an AI toolkit that makes you faster.** The canonical lists catalog the ecosystem for humans; this repo makes it consumable by AI agents — **let your AI read the papers for you**.

| What You Need | Other Lists | This Repo |
|---------------|-------------|-----------|
| Browse papers | Static markdown table | [Interactive explorer](https://jaccen.github.io/Awesome-Gaussian-Skills/): search, filter, sort |
| Compare methods | Open 2 papers side by side | 10+ dimension auto-comparison |
| Avoid code bugs | Discover after submission | 104 known bug pattern detection |
| Design experiments | Guess baselines & ablations | Venue-tailored experiment plan |
| NeRF → 3DGS | Trial-and-error porting | Step-by-step migration guide |
| CAD → 3DGS | No coverage | 40+ method conversion pipeline |
| Patent filing | Manual from scratch | Auto-generated claims & specs |
| **Write a 3DGS paper** | Trial-and-error writing | **Full-lifecycle engine: idea → skeleton → draft → figures → experiments → polish → review → rebuttal** |

## Live Demo
```

</details>

**依据 2 · 作者声明**：[README.md:99-110](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/README.md#L99-L110)

作者列出 DSH 和 MCP 接入及实验工具。

<details>
<summary>查看原文（12行）</summary>

````text
# Option 3: One-Click Install
curl -sSL https://raw.githubusercontent.com/jaccen/Awesome-Gaussian-Skills/main/scripts/setup.sh | bash
```

Then ask your Agent: *"Compare 3DGS and 2DGS rendering formulations"*

## Integrations

This repo ships as both **AI agent skills** and an **MCP server**, so it works across agent runtimes and MCP clients — the knowledge base is consumable by your AI agent, not just by you:

| Client | How to use |
|---|---|
````

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:21-48](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/cordis.patch.yml#L21-L48)

实际 Skill provider 和 MCP 接线。

<details>
<summary>查看原文（28行）</summary>

```text
- insert:
    # --- 1. Bundled skills -------------------------------------------------
    - id: gaussian-skills-provider
      name: "@deepseek-ai/dsh-skill-filesystem"
      config:
        providerName: gaussian-skills
        includeDefaultRoots: false
        bundledSkillDir: ./skills
        watch: false

    # --- 2. MCP server bridge (stdio) -------------------------------------
    # The server ships as TypeScript sources; run it through tsx so no build
    # step is required at install time. If you prefer the compiled bundle,
    # run `npm run build -w mcp-server` once and switch `args` to
    # `["./mcp-server/dist/index.js"]`.
    - id: gaussian-mcp-renderer
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        transport: stdio
        serverName: 3dgs-renderer
        command: node
        args:
          - "--import"
          - "tsx"
          - "./mcp-server/src/index.ts"
        env: {}
        cwd: ""
        failOnStartupError: false
```

</details>

#### 缺口

- 未独立核对文献覆盖或用户研究
  **影响**：无法确认目录完整、评价准确与效率收益
  **进一步探讨**：选定研究任务对照原论文及人工检索。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何接入服务，渲染失败与实验功能如何体现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 package 声明 DSH bundle，patch 配置 filesystem Skill provider 和通过 node --import tsx 启动的 stdio MCP client，且 failOnStartupError=false；MCP server 注册列工具和调用处理器，再连接浏览器渲染桥。实验工具默认不列出，启用后返回 implemented=false 的 stub；render_frame 无已连接渲染器时可返回 has_image=false 的 headless 说明，不能把工具返回当真实图像。当前源码接线不等于依赖已安装或 DSH 宿主启动成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:31-39](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/package.json#L31-L39)

workspace 与 bundle 声明。

```text
  "workspaces": [
    "mcp-server",
    "studio/bridge",
    "studio/web"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 2 · 源码核查**：[cordis.patch.yml:21-48](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/cordis.patch.yml#L21-L48)

Skill、MCP 子进程和启动失败配置。

<details>
<summary>查看原文（28行）</summary>

```text
- insert:
    # --- 1. Bundled skills -------------------------------------------------
    - id: gaussian-skills-provider
      name: "@deepseek-ai/dsh-skill-filesystem"
      config:
        providerName: gaussian-skills
        includeDefaultRoots: false
        bundledSkillDir: ./skills
        watch: false

    # --- 2. MCP server bridge (stdio) -------------------------------------
    # The server ships as TypeScript sources; run it through tsx so no build
    # step is required at install time. If you prefer the compiled bundle,
    # run `npm run build -w mcp-server` once and switch `args` to
    # `["./mcp-server/dist/index.js"]`.
    - id: gaussian-mcp-renderer
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        transport: stdio
        serverName: 3dgs-renderer
        command: node
        args:
          - "--import"
          - "tsx"
          - "./mcp-server/src/index.ts"
        env: {}
        cwd: ""
        failOnStartupError: false
```

</details>

**依据 3 · 源码核查**：[mcp-server/src/index.ts:68-86](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/index.ts#L68-L86)

服务创建与工具清单。

<details>
<summary>查看原文（19行）</summary>

```text
const sceneState = new SceneState();
const rendererBridge = new RendererBridge(RENDERER_PORT);

const ctx: ToolContext = { state: sceneState, bridge: rendererBridge, sceneRoots };
const toolHandlers = createToolHandlers(ctx);
const toolDefinitions = getToolDefinitions();

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } },
);

// ---------------------------------------------------------------------------
// Tool Listing & Execution
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: toolDefinitions,
}));
```

</details>

**依据 4 · 源码核查**：[mcp-server/src/index.ts:88-113](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/index.ts#L88-L113)

调用及异常分支。

<details>
<summary>查看原文（26行）</summary>

```text
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const handler = toolHandlers.get(name);
  if (!handler) {
    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}. Available: ${toolDefinitions.map((t) => t.name).join(', ')}` }],
      isError: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  try {
    const result = await handler(args ?? {});
    // SDK v1.12+ changed the expected return type; cast to satisfy both old and new versions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result as any;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Tool:${name}] Error: ${message}`);
    return {
      content: [{ type: 'text', text: `Tool "${name}" failed: ${message}` }],
      isError: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }
```

</details>

**依据 5 · 源码核查**：[mcp-server/src/tools.ts:56-64](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L56-L64)

实验工具明确返回 stub。

```text
function stubResponse(name: string, args: Record<string, unknown>, description: string): ToolResult {
  return json({
    tool: name,
    status: 'stub',
    implemented: false,
    description,
    receivedArgs: args,
    message: 'EXPERIMENTAL: this tool is a schema-only stub. Backend integration pending — do not treat its output as real.',
  });
```

**依据 6 · 源码核查**：[mcp-server/src/tools.ts:432-461](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L432-L461)

真实图像与 headless 输出区别。

<details>
<summary>查看原文（30行）</summary>

```text
      const response = await ctx.bridge.send({ type: 'render', width, height, format, background });

      if (response.type === 'render_result') {
        if (response.image && response.image.length > 100) {
          const renderId = `render-${Date.now()}`;
          const renderDir = tempDir('renders');
          const renderPath = _path.join(renderDir, `${renderId}.${format}`);
          const buf = Buffer.from(response.image, 'base64');
          _fs.writeFileSync(renderPath, buf);
          return json({
            image_url: `/api/renders/${renderId}.${format}`,
            local_path: renderPath,
            render_time_ms: response.renderTimeMs,
            width: response.width,
            height: response.height,
            has_image: true,
            image_size_bytes: buf.length,
            renderer: ctx.bridge.connectedRenderers(),
          });
        }
        return json({
          image: '(headless mode — no image)',
          render_time_ms: response.renderTimeMs,
          width: response.width,
          height: response.height,
          has_image: false,
          note: 'No renderer connected. Open gsplat-renderer.html (or studio web) to enable real rendering.',
        });
      }
      return error('Render failed');
```

</details>

**依据 7 · 源码核查**：[mcp-server/src/tools.ts:1604-1625](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L1604-L1625)

实验工具开关及处理器注册。

<details>
<summary>查看原文（22行）</summary>

```text
export const CORE_TOOL_COUNT = coreTools.length;
export const EXPERIMENTAL_TOOL_COUNT = experimentalTools.length;

function includeExperimental(): boolean {
  return process.env.INCLUDE_EXPERIMENTAL === '1' || process.env.INCLUDE_EXPERIMENTAL === 'true';
}

function allTools(): MCPTool[] {
  return includeExperimental() ? [...coreTools, ...experimentalTools] : [...coreTools];
}

/** Tool definitions (schemas only) for ListTools response. */
export function getToolDefinitions(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }> {
  return allTools().map(({ name, description, inputSchema }) => ({ name, description, inputSchema }));
}

/** Create handler map for CallTool dispatch. */
export function createToolHandlers(ctx: ToolContext): Map<string, (args: Record<string, unknown>) => Promise<ToolResult>> {
  const handlers = new Map<string, (args: Record<string, unknown>) => Promise<ToolResult>>();
  for (const tool of allTools()) {
    handlers.set(tool.name, (args) => tool.handler(args, ctx));
  }
```

</details>

#### 缺口

- 未安装 tsx、运行 DSH 或浏览器 renderer
  **影响**：无法确认工具出现、画面或版本兼容
  **进一步探讨**：隔离环境测试无 renderer 和已连接 renderer，并核对返回图像。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 场景与渲染桥的文件和网络边界是否足以视作隔离？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

import_scene 对路径使用 resolve 和字符串前缀判断，并允许 cwd 下路径，未见 realpath 解析后校验，因此存在符号链接跨出名义根目录的条件风险；它限制文件大小，解析失败默认报错，仅显式允许时才生成 synthetic 场景。渲染桥以 listen(port) 未指定主机创建 HTTP/WebSocket，默认对无 Origin 的客户端放行 WebSocket，配置 Origin 时用 startsWith；HTTP 场景和导出读取未见认证，且响应 CORS 为 *。实际可达范围取决于网络、运行环境和防火墙，未运行或断言已泄露。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-server/src/tools.ts:199-243](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L199-L243)

导入候选路径、前缀和大小限制。

<details>
<summary>查看原文（45行）</summary>

```text
  // === Tool 1: import_scene ===
  {
    name: 'import_scene',
    description: 'Load a 3DGS scene from a PLY file into the renderer. Returns scene_id, gaussian_count, bounding box, and the URL used by the renderer. Files must live inside the configured scene directories. Parse failures are reported as errors unless allow_synthetic_fallback=true.',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string', description: 'File path to .ply file (inside allowed scene dirs). Use "synthetic://sphere" for a generated test scene.' },
        format: { type: 'string', enum: ['ply', 'splat', 'spz', 'ksplat'], description: 'File format (ply supported)' },
        allow_synthetic_fallback: { type: 'boolean', default: false, description: 'If true, fall back to a synthetic scene when the file cannot be parsed. Default false (fail loudly).' },
      },
      required: ['source'],
    },
    handler: guarded(async (args, ctx) => {
      const source = asString(args, 'source', { required: true })!;
      const allowFallback = asBool(args, 'allow_synthetic_fallback', { default: false });

      // Synthetic scene for testing (explicit opt-in via URI scheme)
      if (source.startsWith('synthetic://')) {
        const result = ctx.state.generateSyntheticScene(10000);
        const scene = ctx.state.getScene(result.id)!;
        await ctx.bridge.broadcast({ type: 'load_scene', sceneId: result.id, source, format: 'ply' });
        return json({ scene_id: result.id, gaussian_count: result.gaussianCount, bbox: scene.bbox, synthetic: true });
      }

      // --- Resolve within the path whitelist ---
      let filePath: string | null = null;
      const candidates: string[] = [];
      if (_path.isAbsolute(source)) candidates.push(source);
      else {
        for (const root of ctx.sceneRoots) candidates.push(_path.resolve(root, source));
        candidates.push(_path.resolve(process.cwd(), source));
      }
      for (const c of candidates) {
        const resolved = _path.resolve(c);
        const inRoot = ctx.sceneRoots.some((r) => resolved === _path.resolve(r) || resolved.startsWith(_path.resolve(r) + _path.sep))
          || resolved.startsWith(_path.resolve(process.cwd()) + _path.sep);
        if (inRoot && _fs.existsSync(resolved)) { filePath = resolved; break; }
      }
      if (!filePath) {
        return error(`File not found or outside allowed scene directories: ${source}. Allowed roots: ${ctx.sceneRoots.join(', ')}`);
      }
      const stat = _fs.statSync(filePath);
      if (stat.size > MAX_IMPORT_BYTES) {
        return error(`File too large: ${(stat.size / 1024 / 1024).toFixed(0)} MB exceeds ${MAX_IMPORT_BYTES / 1024 / 1024} MB cap.`);
```

</details>

**依据 2 · 源码核查**：[mcp-server/src/tools.ts:248-261](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L248-L261)

解析失败与显式 synthetic fallback。

<details>
<summary>查看原文（14行）</summary>

```text
        result = ctx.state.loadFromPlyFile(filePath);
      } catch (parseErr) {
        if (!allowFallback) {
          return error(`PLY parse failed for ${source}: ${(parseErr as Error).message}. Fix the file or pass allow_synthetic_fallback=true.`);
        }
        const synth = ctx.state.generateSyntheticScene(50000);
        const scene = ctx.state.getScene(synth.id)!;
        scene.source = source;
        return json({
          scene_id: synth.id,
          gaussian_count: synth.gaussianCount,
          bbox: scene.bbox,
          synthetic: true,
          note: `Parse failed (${(parseErr as Error).message}); synthetic fallback loaded because allow_synthetic_fallback=true`,
```

</details>

**依据 3 · 源码核查**：[mcp-server/src/renderer-bridge.ts:60-95](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/renderer-bridge.ts#L60-L95)

HTTP/WS 监听与 Origin 判定。

<details>
<summary>查看原文（36行）</summary>

```text
  async connect(serveRoots: string[] = []): Promise<boolean> {
    this.serveRoots = serveRoots.map((r) => path.resolve(r));
    return new Promise((resolve) => {
      try {
        this.httpServer = http.createServer((req, res) => this.handleHttp(req, res));
        this.wss = new WebSocketServer({ server: this.httpServer });

        // Origin allowlist for WebSocket upgrades (anti-hijack baseline)
        const allowedOriginEnv = process.env.RENDERER_ORIGINS;
        const isOriginAllowed = (origin: string | undefined): boolean => {
          if (allowedOriginEnv) {
            if (!origin) return false;
            return allowedOriginEnv.split(',').some((o) => origin.startsWith(o.trim()));
          }
          // Default: localhost origins only
          if (!origin) return true; // non-browser clients (curl/scripts)
          return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
        };

        this.httpServer.on('upgrade', (req, socket, head) => {
          const origin = req.headers.origin as string | undefined;
          if (!isOriginAllowed(origin)) {
            console.error(`[RendererBridge] WS upgrade rejected for origin: ${origin ?? '(none)'}`);
            socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
            socket.destroy();
            return;
          }
          this.wss!.handleUpgrade(req, socket, head, (ws) => {
            this.wss!.emit('connection', ws, req);
          });
        });

        this.httpServer.listen(this.port, () => {
          console.error(`[RendererBridge] HTTP + WebSocket server listening on port ${this.port}`);
          console.error(`[RendererBridge] Scene files: http://localhost:${this.port}/scenes/<file> | Renderer: gsplat-renderer.html`);
          resolve(true);
```

</details>

**依据 4 · 源码核查**：[mcp-server/src/renderer-bridge.ts:136-167](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/renderer-bridge.ts#L136-L167)

静态文件路由和 CORS。

<details>
<summary>查看原文（32行）</summary>

```text
  /** Serve whitelisted scene/export files over HTTP (path-traversal safe). */
  private handleHttp(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = new URL(req.url ?? '/', `http://localhost:${this.port}`);
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, port: this.port, clients: this.clients.size }));
      return;
    }
    const m = url.pathname.match(/^\/(?:scenes|exports)\/(.+)$/);
    if (!m) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const name = decodeURIComponent(m[1]);
    if (name.includes('..') || name.includes('/') || name.includes('\\')) {
      res.writeHead(400); res.end('Bad request'); return;
    }
    const sub = url.pathname.startsWith('/exports/') ? 'exports' : 'scenes';
    const filePath = path.resolve(path.join(process.cwd(), '.temp', sub, name));
    // Defense in depth: resolved path must stay inside .temp/<sub>/
    const allowedRoot = path.resolve(path.join(process.cwd(), '.temp', sub));
    if (!filePath.startsWith(allowedRoot + path.sep) || !fs.existsSync(filePath)) {
      res.writeHead(404); res.end('Not found'); return;
    }
    // Also honor configured external serve roots (e.g., repo scenes/ dir)
    res.writeHead(200, {
      'Content-Type': name.endsWith('.ply') ? 'application/octet-stream' : 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Content-Length': fs.statSync(filePath).size,
    });
    fs.createReadStream(filePath).pipe(res);
```

</details>

#### 缺口

- 未执行符号链接、网络可达性或认证攻击
  **影响**：不能判断具体部署实际暴露和数据读取
  **进一步探讨**：隔离环境验证监听地址、无 Origin 连接、路径越界与防火墙。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行条件、磁盘与退出负担是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

DSH 接入需要相应 skill 与 MCP client、Node、tsx 和该源码的依赖；渲染还需要可连接浏览器 renderer 和场景文件。服务可将场景索引、规范 PLY 与渲染图写入当前目录 .temp；处理大型场景需磁盘、内存、渲染资源和人工核验，实际成本未知。由于 Q03 的网络与路径条件，先在隔离网络用非敏感样本核对监听和输出，明确不支持或 headless 时不把结果当成真实交付。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:18-19](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/cordis.patch.yml#L18-L19)

作者声明 DSH 依赖。

```text
# Requires DSH (dsh-base / @deepseek-ai/cordis) >= 0.1.5-rc.2 so that the
# `dsh-skill-filesystem` and `dsh-mcp-client` peer plugins are available.
```

**依据 2 · 源码核查**：[cordis.patch.yml:31-48](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/cordis.patch.yml#L31-L48)

源码 MCP 启动和静默失败配置。

<details>
<summary>查看原文（18行）</summary>

```text
    # --- 2. MCP server bridge (stdio) -------------------------------------
    # The server ships as TypeScript sources; run it through tsx so no build
    # step is required at install time. If you prefer the compiled bundle,
    # run `npm run build -w mcp-server` once and switch `args` to
    # `["./mcp-server/dist/index.js"]`.
    - id: gaussian-mcp-renderer
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        transport: stdio
        serverName: 3dgs-renderer
        command: node
        args:
          - "--import"
          - "tsx"
          - "./mcp-server/src/index.ts"
        env: {}
        cwd: ""
        failOnStartupError: false
```

</details>

**依据 3 · 源码核查**：[mcp-server/package.json:26-47](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/package.json#L26-L47)

构建、tsx 与 Node 条件。

<details>
<summary>查看原文（22行）</summary>

```text
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "renderer": "npx http-server renderer -p 8080 -c-1",
    "demo": "tsx examples/voice-demo.ts",
    "test": "node scripts/run-tests.mjs",
    "test:build": "tsc && node scripts/run-tests.mjs",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/ws": "^8.5.10",
    "tsx": "^4.7.0",
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=18.0.0"
```

</details>

**依据 4 · 源码核查**：[mcp-server/src/index.ts:120-149](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/index.ts#L120-L149)

renderer 启动及 MCP 生命周期。

<details>
<summary>查看原文（30行）</summary>

```text
async function main() {
  console.error(`[${SERVER_NAME} v${SERVER_VERSION}] Starting...`);
  console.error(`[Config] Renderer port: ${RENDERER_PORT}`);
  console.error(`[Config] Scene roots: ${sceneRoots.join(', ')}`);
  console.error(`[Config] Tools: ${CORE_TOOL_COUNT} core + ${EXPERIMENTAL_TOOL_COUNT} experimental (${process.env.INCLUDE_EXPERIMENTAL === '1' ? 'LISTED' : 'hidden; set INCLUDE_EXPERIMENTAL=1 to list'})`);

  // Restore persisted scenes (server-authoritative scene ids survive restarts)
  const { restored, skipped } = sceneState.loadIndex(SCENE_INDEX_PATH);
  if (restored > 0 || skipped > 0) {
    console.error(`[Startup] Scene index: ${restored} restored, ${skipped} skipped`);
  }

  // Attempt to start renderer bridge (non-blocking — headless mode if unavailable)
  console.error('[Startup] Starting renderer bridge (WS + HTTP)...');
  const connected = await rendererBridge.connect(sceneRoots);
  if (connected) {
    console.error('[Startup] Renderer bridge ready — open gsplat-renderer.html in a browser for true 3DGS rendering.');
  } else {
    console.error('[Startup] Renderer bridge unavailable — running in headless mode.');
  }

  // Optional demo scene (off by default — agents should import real scenes)
  if (process.env.AUTO_SYNTHETIC_SCENE === '1') {
    const { id, gaussianCount } = sceneState.generateSyntheticScene(10000);
    console.error(`[Startup] Synthetic demo scene created: ${id} (${gaussianCount} Gaussians)`);
  }

  // Start MCP server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
```

</details>

**依据 5 · 源码核查**：[mcp-server/src/tools.ts:265-275](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L265-L275)

场景索引及文件写入。

<details>
<summary>查看原文（11行）</summary>

```text
      const scene = ctx.state.getScene(result.id)!;

      // Persist index so the scene survives restarts
      try { ctx.state.saveIndex(_path.resolve(process.cwd(), '.temp', 'scenes', 'index.json')); } catch { /* non-fatal */ }

      // --- True-3DGS loop: export canonical PLY and serve over HTTP ---
      const scenesDir = tempDir('scenes');
      const canonicalPath = _path.join(scenesDir, `${result.id}.ply`);
      try {
        _fs.writeFileSync(canonicalPath, toPlyBuffer(scene.gaussians));
        const url = `/scenes/${result.id}.ply`;
```

</details>

**依据 6 · 源码核查**：[mcp-server/src/tools.ts:432-458](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L432-L458)

图像写入与 headless。

<details>
<summary>查看原文（27行）</summary>

```text
      const response = await ctx.bridge.send({ type: 'render', width, height, format, background });

      if (response.type === 'render_result') {
        if (response.image && response.image.length > 100) {
          const renderId = `render-${Date.now()}`;
          const renderDir = tempDir('renders');
          const renderPath = _path.join(renderDir, `${renderId}.${format}`);
          const buf = Buffer.from(response.image, 'base64');
          _fs.writeFileSync(renderPath, buf);
          return json({
            image_url: `/api/renders/${renderId}.${format}`,
            local_path: renderPath,
            render_time_ms: response.renderTimeMs,
            width: response.width,
            height: response.height,
            has_image: true,
            image_size_bytes: buf.length,
            renderer: ctx.bridge.connectedRenderers(),
          });
        }
        return json({
          image: '(headless mode — no image)',
          render_time_ms: response.renderTimeMs,
          width: response.width,
          height: response.height,
          has_image: false,
          note: 'No renderer connected. Open gsplat-renderer.html (or studio web) to enable real rendering.',
```

</details>

#### 缺口

- 未测 GPU、实际文件清理、卸载或资源消耗
  **影响**：无法估算成本及完全恢复
  **进一步探讨**：隔离工作目录检查进程、输出和退出清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让 Agent 明确区别仿真结果和真实渲染？

**研究主题**：新假设与验证

#### 完整回答

现有导入返回 synthetic=true，render_frame 无图返回 has_image=false，实验工具也标记 stub，不能声称完全缺少状态提示。假设在后续产物与任务记录中始终携带输入来源、renderer 能力和 synthetic/stub 标志，并要求消费方复核，可以减少把演示数据当真实场景的误判。对照当前工具输出，测误判、丢失来源和调用负担；若现有字段足以被消费方可靠传递或新增标志失真则否定。此方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[mcp-server/src/tools.ts:216-221](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L216-L221)

显式 synthetic 结果。

```text
      // Synthetic scene for testing (explicit opt-in via URI scheme)
      if (source.startsWith('synthetic://')) {
        const result = ctx.state.generateSyntheticScene(10000);
        const scene = ctx.state.getScene(result.id)!;
        await ctx.bridge.broadcast({ type: 'load_scene', sceneId: result.id, source, format: 'ply' });
        return json({ scene_id: result.id, gaussian_count: result.gaussianCount, bbox: scene.bbox, synthetic: true });
```

**依据 2 · 源码核查**：[mcp-server/src/tools.ts:248-261](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L248-L261)

解析失败时显式 fallback。

<details>
<summary>查看原文（14行）</summary>

```text
        result = ctx.state.loadFromPlyFile(filePath);
      } catch (parseErr) {
        if (!allowFallback) {
          return error(`PLY parse failed for ${source}: ${(parseErr as Error).message}. Fix the file or pass allow_synthetic_fallback=true.`);
        }
        const synth = ctx.state.generateSyntheticScene(50000);
        const scene = ctx.state.getScene(synth.id)!;
        scene.source = source;
        return json({
          scene_id: synth.id,
          gaussian_count: synth.gaussianCount,
          bbox: scene.bbox,
          synthetic: true,
          note: `Parse failed (${(parseErr as Error).message}); synthetic fallback loaded because allow_synthetic_fallback=true`,
```

</details>

**依据 3 · 源码核查**：[mcp-server/src/tools.ts:432-458](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L432-L458)

是否有图。

<details>
<summary>查看原文（27行）</summary>

```text
      const response = await ctx.bridge.send({ type: 'render', width, height, format, background });

      if (response.type === 'render_result') {
        if (response.image && response.image.length > 100) {
          const renderId = `render-${Date.now()}`;
          const renderDir = tempDir('renders');
          const renderPath = _path.join(renderDir, `${renderId}.${format}`);
          const buf = Buffer.from(response.image, 'base64');
          _fs.writeFileSync(renderPath, buf);
          return json({
            image_url: `/api/renders/${renderId}.${format}`,
            local_path: renderPath,
            render_time_ms: response.renderTimeMs,
            width: response.width,
            height: response.height,
            has_image: true,
            image_size_bytes: buf.length,
            renderer: ctx.bridge.connectedRenderers(),
          });
        }
        return json({
          image: '(headless mode — no image)',
          render_time_ms: response.renderTimeMs,
          width: response.width,
          height: response.height,
          has_image: false,
          note: 'No renderer connected. Open gsplat-renderer.html (or studio web) to enable real rendering.',
```

</details>

**依据 4 · 源码核查**：[mcp-server/src/tools.ts:56-64](https://github.com/jaccen/Awesome-Gaussian-Skills/blob/865ae837255c7fa7572523a9a6444c9c711c9e15/mcp-server/src/tools.ts#L56-L64)

stub 标识。

```text
function stubResponse(name: string, args: Record<string, unknown>, description: string): ToolResult {
  return json({
    tool: name,
    status: 'stub',
    implemented: false,
    description,
    receivedArgs: args,
    message: 'EXPERIMENTAL: this tool is a schema-only stub. Backend integration pending — do not treat its output as real.',
  });
```

#### 缺口

- 未审计所有消费者或验证假设
  **影响**：无法证明当前标志会丢失或改进有效
  **进一步探讨**：固定真实、synthetic、stub 和 headless 场景比较来源识别。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
