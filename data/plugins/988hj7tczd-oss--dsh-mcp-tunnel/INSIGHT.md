# dsh-mcp-tunnel

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ecd7d8e](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/tree/ecd7d8e555423123960009f9f8ab878246f0132f)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将本地 HTTP MCP 端点经 Docker/Cloudflare Quick Tunnel 暴露，并生成待确认的 DSH MCP Client 配置。

> **核心亮点**：把 HTTP MCP 的代理、隧道和客户端片段组合到 DSH 工具流程；减少手工配置但不自动接入 profile。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：含 Bearer 的 pending YAML 默认权限未收紧，且自定义 deployDir 创建后 status/stop 按默认路径寻址；公开隧道真实鉴权依赖未固定镜像。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 远程 Agent 为什么需要这个隧道，实际交付是什么？](#detail-section-11)
  - [Q02 · 创建、鉴权和停止路径各有什么具体边界？](#detail-section-12)
  - [Q03 · 哪些默认和供应链选择阻碍把它视为生产级连接？](#detail-section-13)
  - [Q04 · 试用成本和改进验证应如何安排？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机 MCP 服务需让远程 DSH Agent 调用，但操作者不愿逐项搭建代理和隧道。

人工配置反向代理/Cloudflare Tunnel 并将 URL 与凭据加入 MCP Client；插件自动组合生成和默认目录生命周期。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| create | 启动 Quick Tunnel | 真实协议/鉴权未验 |
| pending | 用户手动接入 DSH | 含 Bearer 且权限未收紧 |
| stop | 默认目录下线 | 自定义 deployDir 不被定位 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| Docker/Podman 与外网 | 启动代理和 cloudflared | 无公网 URL |
| HTTP MCP 上游 | 代理转发 | stdio 需桥接 |
| 正确的代理镜像 env 契约 | Bearer 校验和协议转发 | 连接/鉴权失败 |
| DSH MCP Client | 远端工具接入 | 只能生成片段 |

#### 隔离验证

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 部署 | 固定镜像、使用测试上游 | 仅回环监听 |
| 权限 | 检查 .env 与 pending | 两者不泄露令牌 |
| 调用 | 未授权/授权 initialize 和工具调用 | 拒绝/成功清晰 |
| 清理 | stop 与自定义目录测试 | URL 下线、状态一致 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 首次 | Docker、镜像、上游 HTTP MCP、Cloudflare 网络 | stdio 需另建桥接 |
| 使用 | 核对待确认配置/令牌、远端手动接入 | 片段含秘密 |
| 持续 | 镜像兼容、密钥轮换、下线和监控 | 自定义目录停止缺口 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 栈生成 | Compose、证书、token 和 URL 轮询 | 容器镜像契约 |
| 客户端准备 | pending 配置生成 | DSH 真实握手 |
| 停止 | 默认目录 compose down | 自定义部署目录清理 |

> **思考**：含 Bearer 的 pending YAML 默认权限未收紧，且自定义 deployDir 创建后 status/stop 按默认路径寻址；公开隧道真实鉴权依赖未固定镜像。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 HTTP MCP 的代理、隧道和客户端片段组合到 DSH 工具流程；减少手工配置但不自动接入 profile。详见[Q01](#research-q01)、[Q02](#research-q02)。

把 HTTP MCP 的代理、隧道和客户端片段组合到 DSH 工具流程；减少手工配置但不自动接入 profile。详见[Q01](#research-q01)、[Q02](#research-q02)。

Host 三工具与 jobs 降级；token 存 .env 0600，但同 token 写入默认权限 pending YAML。Compose 绑定回环并使用 latest 镜像；命名隧道配置仅为注释。

<a id="detail-section-5"></a>

### 1.4 主要限制

含 Bearer 的 pending YAML 默认权限未收紧，且自定义 deployDir 创建后 status/stop 按默认路径寻址；公开隧道真实鉴权依赖未固定镜像。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅可在无敏感数据的隔离测试环境验证。先修复 pending 文件权限与自定义 deployDir 生命周期，再考虑生产。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可确认栈生成与生命周期；真实代理鉴权和 MCP 握手未验证，待确认片段权限及自定义目录生命周期有明确缺口。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tunnel-stack.ts、src/mcp-client-config.ts、templates/docker-compose.yml.hbs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 README、package、src 和 Compose 模板；未运行 Docker/Cloudflare 或目标插件。
- 下一步：隔离机运行 Docker，测试 Quick/命名两种模式、未知镜像版本、片段权限、deployDir 自定义与 stop、未授权/授权握手及工具调用。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-mcp-tunnel](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel)
- **版本号**：0.1.0（[固定提交 ecd7d8e](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/tree/ecd7d8e555423123960009f9f8ab878246f0132f)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把秘密片段权限和目录生命周期做成闭环、锁定代理镜像并加入真实未授权/授权 MCP 握手测试，可提高生产适用性；现版未实现。详见[Q04](#research-q04)。

隔离机运行 Docker，测试 Quick/命名两种模式、未知镜像版本、片段权限、deployDir 自定义与 stop、未授权/授权握手及工具调用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 367 | — | — | 4324 |
| .ts | source | 4 | 1421 | 1059 | 238 | — |
| .ts | test | 2 | 434 | 326 | 76 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/issues?q=is%3Aissue+created%3A2026-09-22T05%3A44%3A45.667Z..2026-10-22T05%3A44%3A45.667Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A44%3A45.667Z..2026-10-22T05%3A44%3A45.667Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实本地 MCP 服务经容器隧道暴露的调用路径、凭据保护和生命周期，判断生产使用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程 Agent 为什么需要这个隧道，实际交付是什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

目标是本机已有 HTTP(S) MCP 服务需要给远程 DSH Agent 访问的场景。源码注册 create/status/stop 三个工具，生成 Docker Compose 的 mcp-proxy/cloudflared 栈、证书与令牌，并把取得的 Quick Tunnel URL 写成待确认的 dsh-mcp-client 配置片段；它不会自动改 profile。相较人工搭栈、抄 URL 和凭据，组装步骤集中，但最终仍须用户部署、确认和粘贴。stdio MCP 不能直接接入，必须先桥接为 HTTP；无上游时可启动 hello-mcp 示例。作者 README 中的安全和可达性叙述不是远端实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:462-507](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L462-L507)

三个工具中 create 调用起栈核心，并通过 jobs 或前台给出结果。

<details>
<summary>查看原文（46行）</summary>

```text
function buildTools(ctx: Context, config: Config): ToolDefinition[] {
  const textRender = (_a: unknown, value: unknown) => [
    { type: 'text' as const, text: JSON.stringify(value, null, 2) },
  ]

  const createTool = defineTool({
    name: 'mcp_tunnel_create',
    description: [
      '把本机 MCP server 暴露给远程 Agent：生成 mcp-proxy + cloudflared 的 Docker Compose 栈',
      '（免账号 Cloudflare Quick Tunnel，或 anthropic 命名隧道），生成/复用自签证书，',
      '后台起容器并轮询出公开 HTTPS URL，然后生成 dsh-mcp-client 的 streamable-http',
      '「待确认片段」写入部署目录（需用户显式确认后才粘贴进 profile，绝不自动改写配置）。',
      '本机无任何公网监听端口（仅绑定 127.0.0.1 回环调试端口）。',
    ].join(''),
    parameters: {
      name: { type: 'string', required: true, description: '隧道名（同时作为 dsh-mcp-client 的 serverName 与 compose 项目名；1–32 个 A-Za-z0-9_- 字符）' },
      serverDir: { type: 'string', description: 'MCP server 目录：优先读取其中的 .mcp.json（取首个含 url 的条目作为上游；stdio command 需要先转成 HTTP 端点）' },
      upstreamUrl: { type: 'string', description: '直接指定上游 MCP 端点（http/https），优先级高于 serverDir 的 .mcp.json' },
      provider: { type: 'string', enum: ['cloudflare-quick', 'anthropic'], description: '隧道提供方；默认 cloudflare-quick（免账号）' },
      deployDir: { type: 'string', description: '部署目录（默认 <deployRoot>/<name>）' },
      useHelloMcp: { type: 'boolean', description: '无上游时使用内置 hello-mcp 示例 server（echo/uptime 工具）；默认自动' },
      token: { type: 'string', description: '自定义访问令牌（Authorization: Bearer <token>）；缺省自动生成 32 字节随机令牌写 .env' },
      hostProxyPort: { type: 'integer', description: '宿主回环调试端口（默认 43180，只绑定 127.0.0.1）' },
    },
    output: {
      schema: { type: 'json' },
      render: textRender,
    },
    async execute(args, exec) {
      const params = args as unknown as CreateParams
      const job = runTunnelTask(ctx, config, `mcp_tunnel_create ${params.name}`, exec.agent, async (b, s) => {
        const result = await createTunnelCore(config, params, b, s)
        return { status: 'completed' as const, note: JSON.stringify(result, null, 2) }
      })
      if (job.jobId !== undefined) {
        return { kind: 'background', jobId: job.jobId, note: '后台启动中：用 job_output 读取进度，终态输出含公开 URL 与待确认片段路径。' } as JsonValue
      }
      const outcome = await job.task
      if (outcome.note !== undefined) {
        return { kind: 'foreground', ...(JSON.parse(outcome.note) as Record<string, JsonValue>) } as JsonValue
      }
      return { kind: 'foreground', note: outcome.detail ?? 'mcp_tunnel_create 完成（无输出）' } as JsonValue
    },
  })

  const statusTool = defineTool({
```

</details>

**依据 2 · 源码核查**：[src/index.ts:299-321](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L299-L321)

显式 URL、.mcp.json URL 与 stdio 拒绝/hello 示例的分流。

<details>
<summary>查看原文（23行）</summary>

```text
  const deployRoot = expandHome(config.deployRoot)
  const tunnelDir = params.deployDir !== undefined ? resolve(params.deployDir) : join(deployRoot, params.name)

  // 1) 上游解析：显式 URL > .mcp.json(url) > .mcp.json(stdio, 提示) > hello-mcp。
  let upstreamUrl = params.upstreamUrl
  let stdioDetected: boolean | undefined
  if (upstreamUrl === undefined && params.serverDir !== undefined) {
    const spec = await resolveFromMcpJson(params.serverDir)
    if (spec.url !== undefined) {
      upstreamUrl = spec.url
    } else if (spec.stdio === true) {
      stdioDetected = true
      throw new Error(
        `serverDir 中的 .mcp.json 声明的是 stdio 命令（${spec.command ?? '?'}），`
        + '隧道只能暴露 HTTP(S) MCP 端点：请先用任意 stdio→HTTP 网关在宿主机/容器内把它'
        + '转成 streamable-http 或 SSE 端点，再传 upstreamUrl；或让 create 使用内置 hello-mcp'
        + ' 示例（useHelloMcp=true，仅测试）。本版本不自动桥接 stdio（见 README 限制）。',
      )
    }
  }
  const useHelloMcp = params.useHelloMcp ?? (upstreamUrl === undefined)
  if (upstreamUrl === undefined) {
    upstreamUrl = 'http://hello-mcp:8000/sse'
```

</details>

**依据 3 · 源码核查**：[src/mcp-client-config.ts:66-130](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/mcp-client-config.ts#L66-L130)

构造 Bearer 配置片段并仅写部署目录待确认文件。

<details>
<summary>查看原文（65行）</summary>

```text
export function buildFragment(serverName: string, url: string, token: string): McpClientFragment {
  const nameError = validateServerName(serverName)
  if (nameError !== null) throw new Error(nameError)
  if (!/^https?:\/\//.test(url)) throw new Error(`buildFragment: url must be http(s), got "${url}"`)
  if (token.length === 0) throw new Error('buildFragment: token must not be empty')
  return {
    serverName,
    transport: 'streamable-http',
    url,
    headers: { Authorization: `Bearer ${token}` },
    toolCallTimeoutMs: DEFAULT_TOOL_CALL_TIMEOUT_MS,
    failOnStartupError: false,
  }
}

/** 生成随机的部署访问令牌（32 字节 hex）。 */
export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * 把片段序列化为可直接粘进 profile cordis.patch.yml 的 YAML 追加块
 * （`- insert:` 那一层由 patch 文件自身提供，这里给到 insert 的子行）。
 */
export function fragmentToPatchYaml(fragment: McpClientFragment, rowId?: string): string {
  const id = rowId ?? `mcp-${fragment.serverName}`
  const yamlQuote = (value: string): string => {
    // 含空格 / 引号等特殊字符时用单引号包裹（' 转义为 ''）。
    if (/[\s"'#:]/.test(value)) return `'${value.replace(/'/g, "''")}'`
    return value
  }
  const header = fragment.headers

  // 保持与 dsh-mcp-client Config 字段名完全一致（既有字段都写出，便于 diff）。
  const lines: string[] = []
  lines.push(`    - id: ${yamlQuote(id)}`)
  lines.push(`      name: ${yamlQuote(MCP_CLIENT_PACKAGE)}`)
  lines.push('      config:')
  lines.push(`        serverName: ${yamlQuote(fragment.serverName)}`)
  lines.push(`        transport: ${fragment.transport}`)
  lines.push(`        url: ${yamlQuote(fragment.url)}`)
  lines.push(`        headers:`)
  for (const [key, value] of Object.entries(header)) {
    lines.push(`          ${yamlQuote(key)}: ${yamlQuote(value)}`)
  }
  lines.push(`        toolCallTimeoutMs: ${fragment.toolCallTimeoutMs}`)
  lines.push(`        failOnStartupError: ${String(fragment.failOnStartupError)}`)
  return lines.join('\n') + '\n'
}

/** 写待确认片段到部署目录，返回文件绝对路径。 */
export async function writePendingFragment(deployDir: string, fragment: McpClientFragment): Promise<string> {
  await fs.mkdir(deployDir, { recursive: true })
  const path = join(deployDir, PENDING_FILENAME)
  const body = [
    '# dsh-mcp-tunnel — 待确认的 mcp-client 追加片段（安全护栏 1：未经用户',
    '# 显式确认不得写入任何 profile 配置）。确认后把下方 `- insert:` 段复制进',
    `# 你的 profile 的 cordis.patch.yml（行引用 ${MCP_CLIENT_PACKAGE}），`,
    '# 或粘贴到「追加配置」一节描述的任意声明位置。mcp_tunnel_stop 会删除本文件。',
    '#',
    '- insert:',
    fragmentToPatchYaml(fragment),
  ].join('\n')
  await fs.writeFile(path, body, 'utf8')
  return path
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 创建、鉴权和停止路径各有什么具体边界？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

create 校验名称，解析上游后先确保 CA/证书，生成 Compose 和 env，再检查容器运行时并执行 compose up；Quick Tunnel 从 cloudflared 日志轮询 URL，成功后写带 Bearer 头的待确认 YAML 与 state。模板将宿主端口绑 127.0.0.1，cloudflared 与代理共享网络空间；.env 设置创建模式 0600。不过待确认片段自身包含完整 Bearer 令牌，writeFile 没设置权限；即使 .env 为 0600，片段仍可能按进程 umask 对同机用户可读。stop 通过默认 deployRoot/name 寻址，下线并删片段、更新 state。create 允许任意 deployDir，却不在 state/注册表映射自定义目录，之后 status/stop 找不到它。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:289-400](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L289-L400)

create 工作流、任意 deployDir 与 token/片段/state 写入顺序。

<details>
<summary>查看原文（112行）</summary>

```text
async function createTunnelCore(
  config: Config,
  params: CreateParams,
  buffer: LineBuffer,
  signal: { cancelled: boolean },
): Promise<CreateResult> {
  if (!TUNNEL_NAME_PATTERN.test(params.name)) {
    throw new Error(`参数 name 非法：必须匹配 ${TUNNEL_NAME_PATTERN.source}（1–32 个 A-Za-z0-9_- 字符）`)
  }
  const provider = params.provider ?? config.defaultProvider
  const deployRoot = expandHome(config.deployRoot)
  const tunnelDir = params.deployDir !== undefined ? resolve(params.deployDir) : join(deployRoot, params.name)

  // 1) 上游解析：显式 URL > .mcp.json(url) > .mcp.json(stdio, 提示) > hello-mcp。
  let upstreamUrl = params.upstreamUrl
  let stdioDetected: boolean | undefined
  if (upstreamUrl === undefined && params.serverDir !== undefined) {
    const spec = await resolveFromMcpJson(params.serverDir)
    if (spec.url !== undefined) {
      upstreamUrl = spec.url
    } else if (spec.stdio === true) {
      stdioDetected = true
      throw new Error(
        `serverDir 中的 .mcp.json 声明的是 stdio 命令（${spec.command ?? '?'}），`
        + '隧道只能暴露 HTTP(S) MCP 端点：请先用任意 stdio→HTTP 网关在宿主机/容器内把它'
        + '转成 streamable-http 或 SSE 端点，再传 upstreamUrl；或让 create 使用内置 hello-mcp'
        + ' 示例（useHelloMcp=true，仅测试）。本版本不自动桥接 stdio（见 README 限制）。',
      )
    }
  }
  const useHelloMcp = params.useHelloMcp ?? (upstreamUrl === undefined)
  if (upstreamUrl === undefined) {
    upstreamUrl = 'http://hello-mcp:8000/sse'
  }

  // 2) 证书：CA 存在即复用（验收标准 3）。
  const certsDir = join(tunnelDir, CERTS_DIRNAME)
  await ensureCerts({ dir: certsDir })

  // 3) 栈文件。
  const port = params.hostProxyPort ?? DEFAULT_HOST_PROXY_PORT
  const stackOptions: StackOptions = {
    projectName: params.name,
    provider,
    hostProxyPort: port,
    externalHostname: provider === 'cloudflare-quick' ? `${params.name}.trycloudflare.com` : `${params.name}.tunnel.local`,
    upstreamUrl,
    useHelloMcp,
    tunnelName: params.name,
  }
  const files = generateStack(stackOptions)
  const wroteFiles = await writeStack(tunnelDir, files)

  // 4) 访问令牌：优先传入值，其次复用 .env，否则新生成；写 .env(0600)。
  const token = params.token ?? (await readDotenvKey(tunnelDir)) ?? generateToken()
  await writeDotenv(tunnelDir, token)
  buffer.push(`[create] 凭证已写入 ${tunnelDir}/.env（0600；证书目录 certs/）\n`)

  // 5) 前置检查（验收标准 5）。
  await checkRuntimeAvailable(config.dockerBinary)

  // 6) 起栈。
  buffer.push(`[create] 启动容器栈 ${params.name}（provider=${provider}）\n`)
  const up = runCollect(config.dockerBinary, [...composeArgs(config, params.name, tunnelDir), 'up', '-d', '--build'], { cwd: tunnelDir, onLine: (t) => buffer.push(t) })
  const upResult = await up.promise
  if (upResult.code !== 0) {
    throw new Error(
      `docker compose up 失败（exit ${String(upResult.code ?? '信号')}）：\n${(upResult.err + upResult.out).slice(-2000)}`,
    )
  }
  buffer.push('[create] 容器已启动，等待 cloudflared 隧道就绪…\n')

  // 7) 轮询 URL（仅 quick 模式；anthropic 命名隧道由用户 DNS 决定）。
  let url: string | undefined
  let urlNote: string | undefined
  if (provider === 'cloudflare-quick' && !signal.cancelled) {
    const polled = await pollTunnelUrl(config, params.name, tunnelDir, buffer, signal, 180_000)
    url = polled.url
    urlNote = polled.reason
  } else if (provider === 'anthropic') {
    urlNote = '命名隧道模式：公开 URL 取决于你的 Cloudflare 域名/DNS 配置，不在日志轮询范围内。'
  }

  if (signal.cancelled) {
    throw new Error('mcp_tunnel_create 已取消')
  }

  // 8) 待确认片段 + state。
  let pendingFragmentPath: string | undefined
  if (url !== undefined) {
    const fragment = buildFragment(params.name, url, token)
    pendingFragmentPath = await writePendingFragment(tunnelDir, fragment)
    buffer.push(`[create] URL 就绪：${url}\n`)
    buffer.push(`[create] 待确认 mcp-client 片段：${pendingFragmentPath}（需用户显式确认后粘贴进 profile）\n`)
  }
  await writeState(tunnelDir, {
    name: params.name,
    provider,
    upstreamUrl,
    url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(urlNote !== undefined ? { lastError: urlNote } : {}),
  } satisfies TunnelState)

  return {
    url,
    urlNote,
    tunnelDir,
    pendingFragmentPath,
    wroteFiles,
    provider,
```

</details>

**依据 2 · 源码核查**：[src/mcp-client-config.ts:90-130](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/mcp-client-config.ts#L90-L130)

待确认 YAML 含 Authorization 值且写文件未指定 mode。

<details>
<summary>查看原文（41行）</summary>

```text
export function fragmentToPatchYaml(fragment: McpClientFragment, rowId?: string): string {
  const id = rowId ?? `mcp-${fragment.serverName}`
  const yamlQuote = (value: string): string => {
    // 含空格 / 引号等特殊字符时用单引号包裹（' 转义为 ''）。
    if (/[\s"'#:]/.test(value)) return `'${value.replace(/'/g, "''")}'`
    return value
  }
  const header = fragment.headers

  // 保持与 dsh-mcp-client Config 字段名完全一致（既有字段都写出，便于 diff）。
  const lines: string[] = []
  lines.push(`    - id: ${yamlQuote(id)}`)
  lines.push(`      name: ${yamlQuote(MCP_CLIENT_PACKAGE)}`)
  lines.push('      config:')
  lines.push(`        serverName: ${yamlQuote(fragment.serverName)}`)
  lines.push(`        transport: ${fragment.transport}`)
  lines.push(`        url: ${yamlQuote(fragment.url)}`)
  lines.push(`        headers:`)
  for (const [key, value] of Object.entries(header)) {
    lines.push(`          ${yamlQuote(key)}: ${yamlQuote(value)}`)
  }
  lines.push(`        toolCallTimeoutMs: ${fragment.toolCallTimeoutMs}`)
  lines.push(`        failOnStartupError: ${String(fragment.failOnStartupError)}`)
  return lines.join('\n') + '\n'
}

/** 写待确认片段到部署目录，返回文件绝对路径。 */
export async function writePendingFragment(deployDir: string, fragment: McpClientFragment): Promise<string> {
  await fs.mkdir(deployDir, { recursive: true })
  const path = join(deployDir, PENDING_FILENAME)
  const body = [
    '# dsh-mcp-tunnel — 待确认的 mcp-client 追加片段（安全护栏 1：未经用户',
    '# 显式确认不得写入任何 profile 配置）。确认后把下方 `- insert:` 段复制进',
    `# 你的 profile 的 cordis.patch.yml（行引用 ${MCP_CLIENT_PACKAGE}），`,
    '# 或粘贴到「追加配置」一节描述的任意声明位置。mcp_tunnel_stop 会删除本文件。',
    '#',
    '- insert:',
    fragmentToPatchYaml(fragment),
  ].join('\n')
  await fs.writeFile(path, body, 'utf8')
  return path
```

</details>

**依据 3 · 源码核查**：[src/index.ts:507-626](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L507-L626)

status/stop 只按 deployRoot/name 寻址。

<details>
<summary>查看原文（120行）</summary>

```text
  const statusTool = defineTool({
    name: 'mcp_tunnel_status',
    description: '列出全部隧道栈的连接状态：compose 容器状态、公开 URL、最近日志尾部（≤50 行）、待确认的 mcp-client 片段。',
    parameters: {
      name: { type: 'string', description: '隧道名；缺省列出部署根目录下全部隧道' },
    },
    output: {
      schema: { type: 'json' },
      render: textRender,
    },
    async execute(args) {
      const name = (args as { name?: string }).name
      const deployRoot = expandHome(config.deployRoot)
      const names = name !== undefined && name.length > 0
        ? (TUNNEL_NAME_PATTERN.test(name) ? [name] : [sanitizeForStatus(name)])
        : await listTunnelDirs(deployRoot)
      const rows: Record<string, JsonValue>[] = []
      for (const tunnelName of names) {
        const dir = join(deployRoot, tunnelName)
        const state = await readState<TunnelState>(dir)
        const presence = await readStackPresence(dir)
        let compose: JsonValue = null
        let logsTail: string[] = []
        if (presence.composePresent) {
          try {
            await checkRuntimeAvailable(config.dockerBinary)
            const ps = runCollect(config.dockerBinary, [...composeArgs(config, tunnelName, dir), 'ps'], { cwd: dir })
            const psResult = await ps.promise
            compose = {
              exitCode: psResult.code,
              output: (psResult.out + psResult.err).trim().slice(0, 2000),
            } as unknown as JsonValue
            const logs = runCollect(
              config.dockerBinary,
              [...composeArgs(config, tunnelName, dir), 'logs', '--tail', '50', 'cloudflared'],
              { cwd: dir },
            )
            const logsResult = await logs.promise
            logsTail = (logsResult.out + logsResult.err).split('\n').filter(Boolean).slice(-50)
          } catch (error) {
            compose = String(error instanceof Error ? error.message : error) as JsonValue
          }
        }
        const pending = await readPendingFragment(dir)
        rows.push({
          name: tunnelName,
          deployDir: dir,
          state: state as unknown as JsonValue,
          files: presence as unknown as JsonValue,
          compose,
          logsTail: logsTail as unknown as JsonValue,
          pendingFragment: pending !== null
            ? { serverName: pending.serverName, url: pending.url, file: PENDING_FILENAME }
            : null,
        })
      }
      return { tunnels: rows } as JsonValue
    },
  })

  const stopTool = defineTool({
    name: 'mcp_tunnel_stop',
    description: '停止隧道：docker compose down 停栈并下线公开 URL，删除待确认的 mcp-client 片段，保留证书目录供下次 create 复用（keepCerts=true 默认）。',
    parameters: {
      name: { type: 'string', required: true, description: '隧道名（对应 create 时的 name / 部署目录名）' },
      keepCerts: { type: 'boolean', description: '是否保留证书目录（默认 true；false 时删除 certs/）' },
    },
    output: {
      schema: { type: 'json' },
      render: textRender,
    },
    async execute(args) {
      const { name: tunnelName, keepCerts = true } = args as { name: string; keepCerts?: boolean }
      if (!TUNNEL_NAME_PATTERN.test(tunnelName)) {
        throw new Error(`参数 name 非法：必须匹配 ${TUNNEL_NAME_PATTERN.source}`)
      }
      const deployRoot = expandHome(config.deployRoot)
      const dir = join(deployRoot, tunnelName)
      const presence = await readStackPresence(dir)
      if (!presence.composePresent && !presence.statePresent && !presence.dotenvPresent) {
        return { stopped: false, note: `部署目录 ${dir} 不存在或为空 — 没有可停的隧道。` } as JsonValue
      }
      const steps: string[] = []
      if (presence.composePresent) {
        await checkRuntimeAvailable(config.dockerBinary)
        const down = runCollect(config.dockerBinary, [...composeArgs(config, tunnelName, dir), 'down'], { cwd: dir })
        const result = await down.promise
        if (result.code !== 0) {
          throw new Error(`docker compose down 失败（exit ${String(result.code ?? '信号')}）：\n${(result.err + result.out).slice(-1000)}`)
        }
        steps.push(`已执行 docker compose down（URL 下线）`)
      }
      const removedPending = await removePendingFragment(dir)
      if (removedPending) steps.push(`已移除待确认片段 ${PENDING_FILENAME}`)
      // 验收标准 4：stop 不整文件删除 state.json —— 把最后状态保留为「失效标注」
      // （url 下线 + lastError），status 可读 state.lastError 看到已停标注。
      const state = await readState<TunnelState>(dir)
      if (state !== null) {
        const stoppedAt = new Date().toISOString()
        await writeState(dir, {
          ...state,
          url: undefined,
          updatedAt: stoppedAt,
          lastError: `隧道已于 ${stoppedAt} 由 mcp_tunnel_stop 停止：URL 已下线、待确认片段已移除（state.json 保留为失效标注，status 可见）`,
        } satisfies TunnelState)
        steps.push('已写入 state.json 失效标注（lastError，status 可见）')
      }
      if (keepCerts === false) {
        await fs.rm(join(dir, CERTS_DIRNAME), { recursive: true, force: true })
        steps.push('已删除证书目录（keepCerts=false）')
      } else {
        steps.push(`证书目录 certs/ 已保留，下次 create 复用（验收标准 3/4）`)
      }
      return { stopped: true, name: tunnelName, steps } as JsonValue
    },
  })

  return [createTool, statusTool, stopTool]
}

```

</details>

**依据 4 · 源码核查**：[templates/docker-compose.yml.hbs:10-55](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/templates/docker-compose.yml.hbs#L10-L55)

代理回环端口、cloudflared 网络与服务依赖。

<details>
<summary>查看原文（46行）</summary>

```text
services:
  mcp-proxy:
    image: ghcr.io/anthropics/mcp-proxy:latest
    restart: unless-stopped
    env_file:
      - ./proxy-config.env
    environment:
      # docker compose 变量替换：优先取部署目录 .env 中的 API_KEY
      # （create 时自动生成并写入 .env，权限 0600；.env.example 只含占位说明）。
      API_KEY: ${API_KEY:?set API_KEY in .env — see .env.example}
    volumes:
      - ./certs:/certs:ro
    ports:
      # 仅回环绑定：无公网监听端口（验收标准 1）。
      - '127.0.0.1:{{hostProxyPort}}:80'
    {{#if useHelloMcp}}
    depends_on:
      hello-mcp:
        condition: service_healthy
    {{/if}}
    # 注：本镜像 healthcheck 依赖具体镜像版本；cloudflared 用 service_started
    # 依赖以避免把整栈卡在镜像自带的健康探针上。如需探针，取消下一行注释：
    # healthcheck:
    #   test: ["CMD-SHELL", "wget -q -O- http://127.0.0.1/ >/dev/null 2>&1 || exit 1"]
    #   interval: 5s
    #   timeout: 3s
    #   retries: 30

  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    # 与 mcp-proxy 共享网络命名空间：cloudflared 只见本机地址，且只做出站连接。
    network_mode: service:mcp-proxy
    depends_on:
      mcp-proxy:
        condition: service_started
    {{#if quickTunnel}}
    # 免账号 Quick Tunnel：随机 trycloudflare.com 域名；公开 URL 从日志解析。
    command: ['tunnel', '--no-autoupdate', '--protocol', 'quic', '--url', 'http://127.0.0.1:80']
    {{else}}
    # provider: anthropic —— 命名隧道模式（需你自己的 Cloudflare 账号/DNS/凭据）。
    # 取消注释并按需填写后使用：
    # volumes:
    #   - ./cloudflared:/etc/cloudflared:ro
    # command: ['tunnel', '--no-autoupdate', '--config', '/etc/cloudflared/config.yml', 'run', '{{tunnelName}}']
    {{/if}}
```

</details>

#### 缺口

- 未在真实文件系统验证 umask、重建已有文件权限及自定义目录清理。
  **影响：**秘密泄露与遗留隧道风险取决于部署环境。
  **进一步探讨：**检查生成文件权限并以 deployDir 创建/状态/停止实测闭环。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些默认和供应链选择阻碍把它视为生产级连接？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Compose 镜像均使用 latest，代理 env/flag 契约未锁定或核验；README 自认镜像环境变量和完整 MCP 握手未验证。命名隧道模板的 cloudflared 命令/凭据仅注释占位，选择 anthropic 模式会启动缺命令的 cloudflared 服务，且不会轮询/注册 URL。Quick Tunnel 生成随机公开地址，代理鉴权真实性取决于镜像约定；README 一处又称生产需额外鉴权层。因此应把它视为待验证的本地试验装配而非已证实的安全远程接入。

#### 证据与依据

**依据 1 · 源码核查**：[templates/docker-compose.yml.hbs:14-70](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/templates/docker-compose.yml.hbs#L14-L70)

镜像 latest、API_KEY 注入与命名隧道注释化配置。

<details>
<summary>查看原文（57行）</summary>

```text
    env_file:
      - ./proxy-config.env
    environment:
      # docker compose 变量替换：优先取部署目录 .env 中的 API_KEY
      # （create 时自动生成并写入 .env，权限 0600；.env.example 只含占位说明）。
      API_KEY: ${API_KEY:?set API_KEY in .env — see .env.example}
    volumes:
      - ./certs:/certs:ro
    ports:
      # 仅回环绑定：无公网监听端口（验收标准 1）。
      - '127.0.0.1:{{hostProxyPort}}:80'
    {{#if useHelloMcp}}
    depends_on:
      hello-mcp:
        condition: service_healthy
    {{/if}}
    # 注：本镜像 healthcheck 依赖具体镜像版本；cloudflared 用 service_started
    # 依赖以避免把整栈卡在镜像自带的健康探针上。如需探针，取消下一行注释：
    # healthcheck:
    #   test: ["CMD-SHELL", "wget -q -O- http://127.0.0.1/ >/dev/null 2>&1 || exit 1"]
    #   interval: 5s
    #   timeout: 3s
    #   retries: 30

  cloudflared:
    image: cloudflare/cloudflared:latest
    restart: unless-stopped
    # 与 mcp-proxy 共享网络命名空间：cloudflared 只见本机地址，且只做出站连接。
    network_mode: service:mcp-proxy
    depends_on:
      mcp-proxy:
        condition: service_started
    {{#if quickTunnel}}
    # 免账号 Quick Tunnel：随机 trycloudflare.com 域名；公开 URL 从日志解析。
    command: ['tunnel', '--no-autoupdate', '--protocol', 'quic', '--url', 'http://127.0.0.1:80']
    {{else}}
    # provider: anthropic —— 命名隧道模式（需你自己的 Cloudflare 账号/DNS/凭据）。
    # 取消注释并按需填写后使用：
    # volumes:
    #   - ./cloudflared:/etc/cloudflared:ro
    # command: ['tunnel', '--no-autoupdate', '--config', '/etc/cloudflared/config.yml', 'run', '{{tunnelName}}']
    {{/if}}

  {{#if useHelloMcp}}
  hello-mcp:
    build: ./hello-mcp
    restart: unless-stopped
    environment:
      # FastMCP 示例 server，暴露 SSE 端点 /sse，携带 echo/uptime 两个工具。
      HELLO_MCP_BIND: '0.0.0.0'
      HELLO_MCP_PORT: '8000'
    healthcheck:
      test: ['CMD', 'python', '-c', 'import socket; socket.create_connection(("127.0.0.1", 8000), 2)']
      interval: 5s
      timeout: 3s
      retries: 30
  {{/if}}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:351-383](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L351-L383)

compose up 后仅 Quick 模式轮询 URL，anthropic 模式只返回提示。

<details>
<summary>查看原文（33行）</summary>

```text
  buffer.push(`[create] 启动容器栈 ${params.name}（provider=${provider}）\n`)
  const up = runCollect(config.dockerBinary, [...composeArgs(config, params.name, tunnelDir), 'up', '-d', '--build'], { cwd: tunnelDir, onLine: (t) => buffer.push(t) })
  const upResult = await up.promise
  if (upResult.code !== 0) {
    throw new Error(
      `docker compose up 失败（exit ${String(upResult.code ?? '信号')}）：\n${(upResult.err + upResult.out).slice(-2000)}`,
    )
  }
  buffer.push('[create] 容器已启动，等待 cloudflared 隧道就绪…\n')

  // 7) 轮询 URL（仅 quick 模式；anthropic 命名隧道由用户 DNS 决定）。
  let url: string | undefined
  let urlNote: string | undefined
  if (provider === 'cloudflare-quick' && !signal.cancelled) {
    const polled = await pollTunnelUrl(config, params.name, tunnelDir, buffer, signal, 180_000)
    url = polled.url
    urlNote = polled.reason
  } else if (provider === 'anthropic') {
    urlNote = '命名隧道模式：公开 URL 取决于你的 Cloudflare 域名/DNS 配置，不在日志轮询范围内。'
  }

  if (signal.cancelled) {
    throw new Error('mcp_tunnel_create 已取消')
  }

  // 8) 待确认片段 + state。
  let pendingFragmentPath: string | undefined
  if (url !== undefined) {
    const fragment = buildFragment(params.name, url, token)
    pendingFragmentPath = await writePendingFragment(tunnelDir, fragment)
    buffer.push(`[create] URL 就绪：${url}\n`)
    buffer.push(`[create] 待确认 mcp-client 片段：${pendingFragmentPath}（需用户显式确认后粘贴进 profile）\n`)
  }
```

</details>

**依据 3 · 作者声明**：[README.md:205-241](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/README.md#L205-L241)

作者列出 MCP 完整握手及镜像 env 契约未验证。

<details>
<summary>查看原文（37行）</summary>

````text
   stdio→HTTP 网关转成 streamable-http/SSE 端点再交给 `upstreamUrl`。后续版本可内置
   host-side 桥接进程（spawn + job 生命周期管理）。
2. **`anthropic`（命名隧道）模式需要自备 Cloudflare 账号**：compose 模板已预留
   `--config`/凭据挂载注释位，但 URL 由你的 DNS 决定、不在日志轮询范围内。上游本
   身是 research preview，本项目默认用免账号 Quick Tunnel 保证开箱即用。
3. **完整 MCP 握手**（initialize → tools/call → echo 返回值断言）需要
   `@modelcontextprotocol/sdk` 客户端；当前 e2e 验证到「公开 URL 可达 + SSE 接入面 +
   Authorization 被接受」，把 sdk 放进 devDependencies 后即可补全验收标准 2 的端到端断言。
4. **镜像 env 契约未在离线环境验证**：`ghcr.io/anthropics/mcp-proxy` 的具体 env/flag
   以 README「栈契约」为准，遇到镜像版本差异时按镜像文档微调 compose。
5. **token 轮换**：`create` 支持显式传 `token`，但轮换/吊销流程建议交给部署方自行管理
   （改 `.env` 后重启容器）。
6. **回环端口冲突**：`hostProxyPort` 被占用时 `compose up` 会报错，暂无自动避让；
   可显式传 `hostProxyPort` 换端口。

## 十、开发与测试

```bash
# 离线冒烟（无需 docker/网络；Node ≥ 23.6 原生跑 TS，22.x 需 --experimental-strip-types）
npm test                # = node --test tests/
npm run test:smoke      # 仅离线冒烟

# 真栈 e2e（需要 docker daemon + 公网，会访问 Cloudflare 边缘）
DSH_MCP_TUNNEL_E2E=1 npm run test:e2e

npm run typecheck       # tsc --noEmit（需先 pnpm install）
```

## License

MIT（参考上游行为、未复制其 Proprietary 源码正文）。

## 权限、失败边界与 DSH STORE 状态

- [PERMISSIONS.md](./PERMISSIONS.md)：运行时读取面 / 命令面（固定 argv，非 shell）/ 写面 / 外部服务 / 失败边界 / 供应链 / 文件权限信号（无 chmod/chown、644、无 setuid/setgid）。
- [docs/store-evidence.md](./docs/store-evidence.md)：一次性 Profile 安装 → 启动（工具注册清单）→ 卸载步骤、本地离线证据、待宿主补录真实运行记录说明，并逐项回应 DSH STORE 五类审查信号（仓库 canonical 匹配 / Node 声明 / 供应链 / 文件权限 / 命令权限）。
- STORE 复检由 dsh-safe-plugin-manager 每 3 小时自动执行；本仓库已按清单契约声明（package.json 的 `repository` / `engines.node` / `dsh.compatibility` / `dsh.permissions`）。
````

</details>

#### 缺口

- 代理镜像版本、API_KEY 环境变量语义和真实握手未独立核实。
  **影响：**不能认定 Bearer 校验/协议转发按声明生效。
  **进一步探讨：**固定镜像 digest 并在隔离网络验证未授权 401、授权 initialize/tools-call 与退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用成本和改进验证应如何安排？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

仅在隔离机试用；先提供一个无敏感数据的 HTTP MCP 端点，固定镜像和 Docker/Podman 版本，检查生成文件权限及待确认片段，手动确认并复制到测试 profile，再从远端验证 Bearer 拒绝/接受、工具调用、重启、停止下线。自定义 deployDir 需先修复 status/stop 寻址，再评估生产使用。可改进为令牌只保存在受限文件或引用 secret、片段 0600、自定义目录登记、镜像锁定和端到端安全测试；这些是建议，现版未实现。相比直接在受控 VPN/网关下暴露 MCP，这个插件简化栈组装但新增 Cloudflare、Docker、镜像更新与秘密管理成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-107](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/README.md#L70-L107)

安装与 create/status/stop 的作者使用说明。

<details>
<summary>查看原文（38行）</summary>

````text
└── tests/
    ├── tunnel.smoke.ts     # 离线冒烟（node:test，无需 docker）
    └── tunnel.e2e.ts       # 真栈 e2e（需 docker + 公网，显式 DSH_MCP_TUNNEL_E2E=1 启用）
```

## 三、安装

本地开发（scratch-plugin 风格，直接加载 TS 源码）：

```yaml
# 你的 profile 的 cordis.patch.yml 追加：
- insert:
    - id: dsh-mcp-tunnel
      name: '/绝对路径/dsh-mcp-tunnel/src/index.ts'
      config: {}
```

作为 profile bundle 安装（`dsh.bundle.patch: ./cordis.yml` 已声明）：

```bash
cd <你的 DSH profile>
pnpm add ./dsh-mcp-tunnel
# 行内引用建议改为包路径形式（随 exports 解析）：
#   name: 'dsh-mcp-tunnel/src/index.ts'
```

> 依赖对齐（npm 上已发布的真实版本）：peerDependencies 声明 `@deepseek-ai/cordis ^4.0.1`、
> `@deepseek-ai/dsh-tools ^0.1.1-rc.2`、`@deepseek-ai/dsh-jobs ^0.1.0-rc.8`；dependencies 为
> `@deepseek-ai/schemastery ^3.18.1`（运行时仅真正 import schemastery；其余为类型级/服务级
> 依赖）。peer 关系保留：目标运行时是 DSH 宿主，由宿主提供 cordis / dsh-tools / dsh-jobs 服务。

## 四、工具用法

### `mcp_tunnel_create`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | ✓ | 隧道名 = compose 项目名 = mcp-client `serverName`（`^[A-Za-z0-9_-]{1,32}$`） |
````

</details>

**依据 2 · 源码核查**：[src/index.ts:289-400](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/index.ts#L289-L400)

实际部署流程和外部容器依赖。

<details>
<summary>查看原文（112行）</summary>

```text
async function createTunnelCore(
  config: Config,
  params: CreateParams,
  buffer: LineBuffer,
  signal: { cancelled: boolean },
): Promise<CreateResult> {
  if (!TUNNEL_NAME_PATTERN.test(params.name)) {
    throw new Error(`参数 name 非法：必须匹配 ${TUNNEL_NAME_PATTERN.source}（1–32 个 A-Za-z0-9_- 字符）`)
  }
  const provider = params.provider ?? config.defaultProvider
  const deployRoot = expandHome(config.deployRoot)
  const tunnelDir = params.deployDir !== undefined ? resolve(params.deployDir) : join(deployRoot, params.name)

  // 1) 上游解析：显式 URL > .mcp.json(url) > .mcp.json(stdio, 提示) > hello-mcp。
  let upstreamUrl = params.upstreamUrl
  let stdioDetected: boolean | undefined
  if (upstreamUrl === undefined && params.serverDir !== undefined) {
    const spec = await resolveFromMcpJson(params.serverDir)
    if (spec.url !== undefined) {
      upstreamUrl = spec.url
    } else if (spec.stdio === true) {
      stdioDetected = true
      throw new Error(
        `serverDir 中的 .mcp.json 声明的是 stdio 命令（${spec.command ?? '?'}），`
        + '隧道只能暴露 HTTP(S) MCP 端点：请先用任意 stdio→HTTP 网关在宿主机/容器内把它'
        + '转成 streamable-http 或 SSE 端点，再传 upstreamUrl；或让 create 使用内置 hello-mcp'
        + ' 示例（useHelloMcp=true，仅测试）。本版本不自动桥接 stdio（见 README 限制）。',
      )
    }
  }
  const useHelloMcp = params.useHelloMcp ?? (upstreamUrl === undefined)
  if (upstreamUrl === undefined) {
    upstreamUrl = 'http://hello-mcp:8000/sse'
  }

  // 2) 证书：CA 存在即复用（验收标准 3）。
  const certsDir = join(tunnelDir, CERTS_DIRNAME)
  await ensureCerts({ dir: certsDir })

  // 3) 栈文件。
  const port = params.hostProxyPort ?? DEFAULT_HOST_PROXY_PORT
  const stackOptions: StackOptions = {
    projectName: params.name,
    provider,
    hostProxyPort: port,
    externalHostname: provider === 'cloudflare-quick' ? `${params.name}.trycloudflare.com` : `${params.name}.tunnel.local`,
    upstreamUrl,
    useHelloMcp,
    tunnelName: params.name,
  }
  const files = generateStack(stackOptions)
  const wroteFiles = await writeStack(tunnelDir, files)

  // 4) 访问令牌：优先传入值，其次复用 .env，否则新生成；写 .env(0600)。
  const token = params.token ?? (await readDotenvKey(tunnelDir)) ?? generateToken()
  await writeDotenv(tunnelDir, token)
  buffer.push(`[create] 凭证已写入 ${tunnelDir}/.env（0600；证书目录 certs/）\n`)

  // 5) 前置检查（验收标准 5）。
  await checkRuntimeAvailable(config.dockerBinary)

  // 6) 起栈。
  buffer.push(`[create] 启动容器栈 ${params.name}（provider=${provider}）\n`)
  const up = runCollect(config.dockerBinary, [...composeArgs(config, params.name, tunnelDir), 'up', '-d', '--build'], { cwd: tunnelDir, onLine: (t) => buffer.push(t) })
  const upResult = await up.promise
  if (upResult.code !== 0) {
    throw new Error(
      `docker compose up 失败（exit ${String(upResult.code ?? '信号')}）：\n${(upResult.err + upResult.out).slice(-2000)}`,
    )
  }
  buffer.push('[create] 容器已启动，等待 cloudflared 隧道就绪…\n')

  // 7) 轮询 URL（仅 quick 模式；anthropic 命名隧道由用户 DNS 决定）。
  let url: string | undefined
  let urlNote: string | undefined
  if (provider === 'cloudflare-quick' && !signal.cancelled) {
    const polled = await pollTunnelUrl(config, params.name, tunnelDir, buffer, signal, 180_000)
    url = polled.url
    urlNote = polled.reason
  } else if (provider === 'anthropic') {
    urlNote = '命名隧道模式：公开 URL 取决于你的 Cloudflare 域名/DNS 配置，不在日志轮询范围内。'
  }

  if (signal.cancelled) {
    throw new Error('mcp_tunnel_create 已取消')
  }

  // 8) 待确认片段 + state。
  let pendingFragmentPath: string | undefined
  if (url !== undefined) {
    const fragment = buildFragment(params.name, url, token)
    pendingFragmentPath = await writePendingFragment(tunnelDir, fragment)
    buffer.push(`[create] URL 就绪：${url}\n`)
    buffer.push(`[create] 待确认 mcp-client 片段：${pendingFragmentPath}（需用户显式确认后粘贴进 profile）\n`)
  }
  await writeState(tunnelDir, {
    name: params.name,
    provider,
    upstreamUrl,
    url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(urlNote !== undefined ? { lastError: urlNote } : {}),
  } satisfies TunnelState)

  return {
    url,
    urlNote,
    tunnelDir,
    pendingFragmentPath,
    wroteFiles,
    provider,
```

</details>

**依据 3 · 源码核查**：[src/mcp-client-config.ts:117-130](https://github.com/988hj7tczd-oss/dsh-mcp-tunnel/blob/ecd7d8e555423123960009f9f8ab878246f0132f/src/mcp-client-config.ts#L117-L130)

凭据随片段写盘。

<details>
<summary>查看原文（14行）</summary>

```text
export async function writePendingFragment(deployDir: string, fragment: McpClientFragment): Promise<string> {
  await fs.mkdir(deployDir, { recursive: true })
  const path = join(deployDir, PENDING_FILENAME)
  const body = [
    '# dsh-mcp-tunnel — 待确认的 mcp-client 追加片段（安全护栏 1：未经用户',
    '# 显式确认不得写入任何 profile 配置）。确认后把下方 `- insert:` 段复制进',
    `# 你的 profile 的 cordis.patch.yml（行引用 ${MCP_CLIENT_PACKAGE}），`,
    '# 或粘贴到「追加配置」一节描述的任意声明位置。mcp_tunnel_stop 会删除本文件。',
    '#',
    '- insert:',
    fragmentToPatchYaml(fragment),
  ].join('\n')
  await fs.writeFile(path, body, 'utf8')
  return path
```

</details>

#### 缺口

- 没有部署时间、失败率或远端使用收益数据。
  **影响：**无法量化相对手工网关的净收益。
  **进一步探讨：**比较等价安全基线下的安装时间、连通率、恢复和密钥暴露面。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
