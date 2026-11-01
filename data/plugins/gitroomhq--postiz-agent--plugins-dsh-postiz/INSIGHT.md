# dsh-postiz

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[01ab1fe](https://github.com/gitroomhq/postiz-agent/tree/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz)

<!-- BEGIN META -->
[![GitHub ★ 562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gitroomhq/postiz-agent) [![npm 30d 1,009](https://img.shields.io/static/v1?label=npm+30d&message=1%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz)
<!-- END META -->

> **功能**：连接 Postiz MCP，辅助 DSH 创建、排期和发布社媒内容。

> **亮点**：[Q02](#research-q02) 将连接配置和平台工作流整合进 DSH。

> **主要限制**：[Q03](#research-q03) skill 中的授权与草稿指示不是插件内强制执行。

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
  - [Q01 · 多平台发布流程为何需要 DSH 接入？](#detail-section-11)
  - [Q02 · 如何接入服务，缺密钥发生什么？](#detail-section-12)
  - [Q03 · 草稿优先或立即发布需要授权是强制执行吗？](#detail-section-13)
  - [Q04 · 部署和安全使用的条件是什么？](#detail-section-14)
  - [Q05 · 如何降低误发布或重复的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 中准备和排期多渠道内容的社媒运营者。

Postiz 界面或其他 MCP 客户端可手工组织渠道、草稿和排期。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| MCP 连接 | 对接 Postiz | 依赖服务与认证 |
| 工作流 skill | 指导内容及审核 | 文本不是强制门禁 |
| 草稿/排期/发布 | 社媒内容 | 依赖远端及用户授权 |
| 列表查询 | 复查已有帖子 | 一致性未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH MCP client | 运行必需 | 对接工具 | 不可调用 |
| Postiz 服务和 API key | 连接必需 | 鉴权与执行 | 缺 key 警告，远端效果未测 |
| 已连接渠道与用户授权 | 发布必需 | 确定目标 | 不猜测并停止发布 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置服务与密钥 | 验证可连接；失败检查配置 |
| 查询 | 代理列渠道并查询规则 | 未找到目标则停止 |
| 内容与确认 | 用户审核内容、渠道和时间 | 依授权选择草稿或排期 |
| 验收与恢复 | 用户查询帖子状态 | 超时先查询，再判断是否重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务费用未知 | 接入及配置时间未知 | 需密钥、账号和渠道 |
| 持续使用 | 模型、服务和媒体费用未知 | 内容和排期审核时间未知 | 按渠道和用量变化 |
| 失败恢复 | 重试费用未知 | 查询和人工复核时间未知 | 外部服务一致性未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 连接 | 子组件注入 MCP endpoint 与凭据 | 真实连接和工具注册 |
| 工作流 | skill 指导渠道、草稿、排期 | 模型遵循率和强制审核 |
| 复查 | skill 指向帖子列表 | 平台发布成功率和幂等 |

> **思考**：[Q03](#research-q03) skill 中的授权与草稿指示不是插件内强制执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将连接配置和平台工作流整合进 DSH。

[Q02](#research-q02) 内联密钥优先且缺失时仅警告；[Q03](#research-q03) 指示不构成强制审批。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) skill 中的授权与草稿指示不是插件内强制执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 优先隔离账号和草稿，提交前核对目标、内容、时间及授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件静态检查；未接入账号、MCP 或发布。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-postiz/README.md、plugins/dsh-postiz/lib/index.js、plugins/dsh-postiz/lib/skill.js、plugins/dsh-postiz/cordis.patch.yml 及固定范围 inventory；组件：plugins/dsh-postiz。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 plugins/dsh-postiz 子组件；未运行 MCP 或核查根服务实现。
- 下一步：隔离账号验证凭据、已连接渠道、时区、草稿、超时查询与重复创建。

**分析版本**

- **仓库**：[gitroomhq/postiz-agent](https://github.com/gitroomhq/postiz-agent)
- **版本号**：0.1.0（[固定提交 01ab1fe](https://github.com/gitroomhq/postiz-agent/tree/01ab1fe17efa30d12de7758b961e8776d34dba4e)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在已有草稿和列表外对照提交前明细，验证误发布和重复率。

隔离账号验证凭据、已连接渠道、时区、草稿、超时查询与重复创建。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 191 | 120 | 44 | — |
| .md | source | 1 | 117 | — | — | 640 |
| .mjs | test | 1 | 81 | 72 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/gitroomhq/postiz-agent/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Postiz 子组件接入、发布指令和安全边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多平台发布流程为何需要 DSH 接入？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望用自然语言准备多渠道社媒内容的用户可从 DSH 调用 Postiz MCP；手动 Postiz 界面也能排期和审核，插件主要减少上下文切换，不证明实际发布成功或效率提升。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/README.md:8-14](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/README.md#L8-L14)

子组件描述连接和发布能力。

```text
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin for
[Postiz](https://postiz.com), the open-source social media scheduler. It connects the agent
to the Postiz MCP server so it can list your connected channels, fetch each platform's
posting rules, and schedule, draft, or publish posts across 28+ platforms (X, LinkedIn,
Instagram, Facebook, Threads, TikTok, YouTube, Reddit, Pinterest, Bluesky, Mastodon,
Discord, Slack, Telegram, and more).

```

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:16-37](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/skill.js#L16-L37)

先列渠道并查询平台规则。

<details>
<summary>查看原文（22行）</summary>

```text
Postiz is a social media scheduler. The \`mcp__postiz__*\` tools talk to the
user's Postiz account. Always follow this order:

## 1. Find the channel

Call \`mcp__postiz__integrationList\` to get connected accounts. Each entry has
an \`id\` (the integration ID), a \`name\`, and a \`platform\` such as \`x\`,
\`linkedin\`, \`instagram\`, \`facebook\`, \`threads\`, \`tiktok\`, \`youtube\`,
\`reddit\`, \`bluesky\`, \`mastodon\`, \`discord\`, \`slack\`, \`telegram\`.
If the account has customer groups, \`mcp__postiz__groupList\` lists them and
\`integrationList\` accepts a \`group\` filter.

Never guess an integration ID. If the user names a platform that is not in the
list, say so and stop.

## 2. Learn the platform rules

Call \`mcp__postiz__integrationSchema\` with \`{ platform, isPremium }\` before
composing. It returns \`maxLength\`, \`rules\`, a \`settings\` JSON schema of
required per-platform settings, and helper \`tools\` (for example: list Discord
channels, search subreddits, list LinkedIn pages). Run helpers with
\`mcp__postiz__triggerTool\` when a setting needs an ID you do not have.
```

</details>

#### 缺口

- 未做同任务对照或真实账号试用
  **影响**：无法量化收益
  **进一步探讨**：对照人工流程记录错误和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何接入服务，缺密钥发生什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件从配置或环境变量解析 key，非空内联值优先；baseUrl 规范为 MCP URL，通过 Cordis service 供 MCP client 取 headers，key 缺失仅警告并以空头配置，源码注释称服务端不会注册工具。可选 skill 在 skills 服务可用时注册；插件自身不实现服务端发布、验证或重试。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/index.js:25-36](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L25-L36)

配置与默认 host。

<details>
<summary>查看原文（12行）</summary>

```text
/** Default Postiz Cloud host; self-hosted instances override `baseUrl`. */
export const DEFAULT_BASE_URL = 'https://mcp.postiz.com'

export const Config = z.object({
  /** Environment variable that holds the Postiz API key. */
  apiKeyEnv: z.string().default('POSTIZ_API_KEY'),
  /** Inline API key. Prefer `apiKeyEnv`; this exists for patch-level overrides. */
  apiKey: z.string().role('secret').default(''),
  /** Postiz host. The MCP endpoint is `<baseUrl>/mcp`. */
  baseUrl: z.string().default(DEFAULT_BASE_URL),
  /** Register the `postiz` workflow skill on `ctx.skills`. */
  skill: z.boolean().default(true),
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:46-59](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L46-L59)

密钥优先级及 Bearer header。

<details>
<summary>查看原文（14行）</summary>

```text
export function resolveConnection(config, env = process.env) {
  const base = String(config?.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const url = base.endsWith('/mcp') ? base : `${base}/mcp`
  const envName = String(config?.apiKeyEnv || 'POSTIZ_API_KEY')
  const inline = String(config?.apiKey || '').trim()
  const fromEnv = String(env[envName] || '').trim()
  const key = inline || fromEnv
  const source = inline ? 'config.apiKey' : fromEnv ? `env.${envName}` : 'none'
  return {
    url,
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    configured: key.length > 0,
    source,
  }
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-postiz/lib/index.js:66-102](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L66-L102)

缺 key 警告、服务和可选 skill。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx, config) {
  const cfg = Config(config ?? {})
  const conn = resolveConnection(cfg)
  const log = ctx.logger ?? console

  if (conn.configured) {
    log.info?.(`dsh-postiz: Postiz MCP endpoint ${conn.url} (key from ${conn.source})`)
  } else {
    log.warn?.(
      `dsh-postiz: no Postiz API key found — set ${cfg.apiKeyEnv} (Postiz → Settings → Developers → Public API) ` +
        `or \`apiKey\` on the \`postiz\` row; the postiz-mcp row will connect to ${conn.url} without credentials and register no tools.`,
    )
  }

  // Plain, unfrozen values on purpose: the mcp-client row validates the
  // interpolated `headers` with schemastery, which rejects frozen objects.
  // The getter hands every evaluation its own copy.
  ctx.provide(POSTIZ_SERVICE, {
    url: conn.url,
    get headers() {
      return { ...conn.headers }
    },
    configured: conn.configured,
  })

  if (cfg.skill) {
    ctx.inject(['skills'], (sctx) => {
      if (typeof sctx.skills?.register !== 'function') return
      sctx.skills.register({
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        content: SKILL_CONTENT,
        source: 'runtime',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    })
  }
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-postiz/cordis.patch.yml:1-30](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/cordis.patch.yml#L1-L30)

MCP client 使用服务配置。

<details>
<summary>查看原文（30行）</summary>

```text
# Patch layer contributed by the dsh-postiz bundle.
#
# Two rows:
#   1. `postiz`      - this package's provider plugin. Reads the Postiz API key
#                      (POSTIZ_API_KEY by default), exposes `ctx.postiz` with the
#                      MCP endpoint URL and auth headers, and registers the
#                      `postiz` skill that teaches the agent the posting workflow.
#   2. `postiz-mcp`  - one @deepseek-ai/dsh-mcp-client instance that connects to
#                      the Postiz MCP server over streamable HTTP and registers
#                      its tools as mcp__postiz__* (integrationList,
#                      integrationSchema, schedulePostTool, ...).
#
# Configuration (override the `postiz` row in your profile's cordis.patch.yml):
#   apiKeyEnv  - env var holding the Postiz API key (default: POSTIZ_API_KEY)
#   apiKey     - inline key; prefer the env var or a .env file in $DSH_HOME
#   baseUrl    - Postiz host (default: https://mcp.postiz.com; self-hosted
#                instances use their own backend URL)
#   skill      - register the `postiz` workflow skill (default: true)
- insert:
    - id: postiz
      name: dsh-postiz
      config:
        apiKeyEnv: POSTIZ_API_KEY
        baseUrl: https://mcp.postiz.com
    - id: postiz-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      inject: [postiz]
      config:
        transport: streamable-http
        serverName: postiz
```

</details>

#### 缺口

- 未连接 MCP 和 Postiz
  **影响**：不能确认实际工具注册、认证与返回
  **进一步探讨**：在隔离账号验证缺 key、失效 key、自托管 endpoint 与返回。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 草稿优先或立即发布需要授权是强制执行吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

skill 文本要求用户要审核时 draft、明确立即发布才 now，并提供 postsListTool 与未发布设置调整；这是给模型的工作流说明，不是本插件内强制拦截。MCP 返回成功亦不证明各平台发布完成；超时后盲重试可能重复，需先查询已有状态。子组件没有证据证明跨平台幂等或自动审核。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:52-80](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/skill.js#L52-L80)

模式、指示和复查工具。

<details>
<summary>查看原文（29行）</summary>

```text
## 4. Schedule or publish

Call \`mcp__postiz__schedulePostTool\` with a \`socialPost\` array. Each item:

\`\`\`json
{
  "integrationId": "<id from integrationList>",
  "isPremium": false,
  "date": "2025-01-15T10:00:00.000Z",
  "shortLink": false,
  "type": "schedule",
  "postsAndComments": [{ "content": "<p>Hello world</p>", "attachments": [] }],
  "settings": [{ "key": "<from integrationSchema>", "value": "..." }]
}
\`\`\`

- \`type\` is \`draft\`, \`schedule\`, or \`now\`. Use \`draft\` when the user
  wants to review first; use \`now\` only when they explicitly ask to publish
  immediately.
- \`date\` is UTC ISO-8601. Convert the user's local time; if no time is given,
  ask or pick a sensible one and state it.
- One item per channel per time slot. Twenty posts across a month is twenty
  items in one call.

## 5. Review and adjust

\`mcp__postiz__postsListTool\` lists posts between two dates.
\`mcp__postiz__postSettingsTool\` updates the settings of a post that has not
been published yet.
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:91-102](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L91-L102)

工作流以 skill 文本注册。

<details>
<summary>查看原文（12行）</summary>

```text
  if (cfg.skill) {
    ctx.inject(['skills'], (sctx) => {
      if (typeof sctx.skills?.register !== 'function') return
      sctx.skills.register({
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        content: SKILL_CONTENT,
        source: 'runtime',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    })
  }
```

</details>

#### 缺口

- 未核查独立 MCP 服务和下游平台
  **影响**：不能推断服务器校验、幂等或审批
  **进一步探讨**：隔离账号先保存草稿并核对服务器状态，模拟超时查询后再决定重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和安全使用的条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH/Cordis MCP client、Postiz 服务、API key 和已连接渠道；自托管可改 baseUrl。内联 key 优先环境变量，配置人员应避免无意覆盖；源码不校验远端服务的 TLS 配置或账号权限。发布面向真实渠道，先核对目标、文案、时间和授权，必要时停止并手工复查。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/index.js:25-36](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L25-L36)

服务与凭据配置。

<details>
<summary>查看原文（12行）</summary>

```text
/** Default Postiz Cloud host; self-hosted instances override `baseUrl`. */
export const DEFAULT_BASE_URL = 'https://mcp.postiz.com'

export const Config = z.object({
  /** Environment variable that holds the Postiz API key. */
  apiKeyEnv: z.string().default('POSTIZ_API_KEY'),
  /** Inline API key. Prefer `apiKeyEnv`; this exists for patch-level overrides. */
  apiKey: z.string().role('secret').default(''),
  /** Postiz host. The MCP endpoint is `<baseUrl>/mcp`. */
  baseUrl: z.string().default(DEFAULT_BASE_URL),
  /** Register the `postiz` workflow skill on `ctx.skills`. */
  skill: z.boolean().default(true),
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:46-57](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L46-L57)

内联 key 优先。

<details>
<summary>查看原文（12行）</summary>

```text
export function resolveConnection(config, env = process.env) {
  const base = String(config?.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '')
  const url = base.endsWith('/mcp') ? base : `${base}/mcp`
  const envName = String(config?.apiKeyEnv || 'POSTIZ_API_KEY')
  const inline = String(config?.apiKey || '').trim()
  const fromEnv = String(env[envName] || '').trim()
  const key = inline || fromEnv
  const source = inline ? 'config.apiKey' : fromEnv ? `env.${envName}` : 'none'
  return {
    url,
    headers: key ? { Authorization: `Bearer ${key}` } : {},
    configured: key.length > 0,
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:68-80](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/skill.js#L68-L80)

发布类型与列表。

<details>
<summary>查看原文（13行）</summary>

```text
- \`type\` is \`draft\`, \`schedule\`, or \`now\`. Use \`draft\` when the user
  wants to review first; use \`now\` only when they explicitly ask to publish
  immediately.
- \`date\` is UTC ISO-8601. Convert the user's local time; if no time is given,
  ask or pick a sensible one and state it.
- One item per channel per time slot. Twenty posts across a month is twenty
  items in one call.

## 5. Review and adjust

\`mcp__postiz__postsListTool\` lists posts between two dates.
\`mcp__postiz__postSettingsTool\` updates the settings of a post that has not
been published yet.
```

</details>

#### 缺口

- 未运行真实服务、撤权或权限检查
  **影响**：无法保证凭据权限、平台可用性与失败恢复
  **进一步探讨**：使用最小权限测试账号验证并查阅服务配置。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低误发布或重复的风险？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 skill 已要求审核用草稿、立即发布需明确要求，并可列帖子，是直接反证；不能声称没有草稿或查询。假设提交前展示用户可审查的目标渠道、文案、类型、UTC 时间和请求标识，帮助决定提交还是修改；对照现有 skill 加列表，在沙盒账号注入多渠道、时区偏移、超时后已创建及未创建场景，统计错误发布、重复创建、查询一致性、操作耗时和人工负担。错误率无改善、错误确认增加或成本抵消收益则否定；服务端幂等和现有其他 UI 能力未穷尽。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:52-80](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/skill.js#L52-L80)

已有草稿、立即发布条件和事后列表。

<details>
<summary>查看原文（29行）</summary>

```text
## 4. Schedule or publish

Call \`mcp__postiz__schedulePostTool\` with a \`socialPost\` array. Each item:

\`\`\`json
{
  "integrationId": "<id from integrationList>",
  "isPremium": false,
  "date": "2025-01-15T10:00:00.000Z",
  "shortLink": false,
  "type": "schedule",
  "postsAndComments": [{ "content": "<p>Hello world</p>", "attachments": [] }],
  "settings": [{ "key": "<from integrationSchema>", "value": "..." }]
}
\`\`\`

- \`type\` is \`draft\`, \`schedule\`, or \`now\`. Use \`draft\` when the user
  wants to review first; use \`now\` only when they explicitly ask to publish
  immediately.
- \`date\` is UTC ISO-8601. Convert the user's local time; if no time is given,
  ask or pick a sensible one and state it.
- One item per channel per time slot. Twenty posts across a month is twenty
  items in one call.

## 5. Review and adjust

\`mcp__postiz__postsListTool\` lists posts between two dates.
\`mcp__postiz__postSettingsTool\` updates the settings of a post that has not
been published yet.
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:91-102](https://github.com/gitroomhq/postiz-agent/blob/01ab1fe17efa30d12de7758b961e8776d34dba4e/plugins/dsh-postiz/lib/index.js#L91-L102)

skill 文本注册而非强制事务。

<details>
<summary>查看原文（12行）</summary>

```text
  if (cfg.skill) {
    ctx.inject(['skills'], (sctx) => {
      if (typeof sctx.skills?.register !== 'function') return
      sctx.skills.register({
        name: SKILL_NAME,
        description: SKILL_DESCRIPTION,
        content: SKILL_CONTENT,
        source: 'runtime',
        invocation: { modelInvocable: true, userInvocable: true },
      })
    })
  }
```

</details>

#### 缺口

- 未核查服务端或全部界面
  **影响**：不能断言不存在等价确认或请求去重
  **进一步探讨**：在服务和平台均可控时以已存在与不存在两种超时结果对照。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
