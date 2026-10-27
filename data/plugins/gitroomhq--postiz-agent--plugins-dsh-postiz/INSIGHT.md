# dsh-postiz

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[17f1e27](https://github.com/gitroomhq/postiz-agent/tree/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz)

<!-- BEGIN META -->
[![GitHub ★ 550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/gitroomhq/postiz-agent) [![npm 30d 963](https://img.shields.io/static/v1?label=npm+30d&message=963&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-postiz)
<!-- END META -->

> **功能**：通过 Postiz MCP 在 DSH 中连接社交账号、读取平台规则并准备草稿或安排发布

> **亮点**：[Q01](#research-q01) 将环境凭据、MCP连接与平台工作流Skill包装为bundle，减少手工接线；不是自己实现社交平台发布引擎。

> **主要限制**：[Q02](#research-q02) Skill中的draft/now要求不是硬门禁，连接重试不保证业务幂等；本地未保存发布收据，未知结果必须回远端对账。

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
  - [Q01 · 相比手工配置 Postiz MCP，插件实际多做什么？](#detail-section-11)
  - [Q02 · 缺密钥、连接失败或发布结果未知时，本地能保证什么？](#detail-section-12)
  - [Q03 · 谁适合采用，前置条件、现金与人工成本是什么？](#detail-section-13)
  - [Q04 · 草稿确认能否绑定内容摘要与远端ID避免重复发布？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用Postiz的运营人员希望在DSH编写内容并查账号/平台规则；本地组件负责接入和工作流提示。

Postiz原界面或手工配置DSH MCP客户端；排期、平台发布和媒体生成能力来自远端服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 凭据连接 | 从环境连接可信Postiz MCP | 密钥与endpoint需核实 |
| 操作Skill | 先查渠道和规则再编写 | 指令不等于强制发布确认 |
| 动态工具 | 使用远端草稿和排期功能 | 外部可用性与结果未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP客户端与Cordis | 必需 | 加载两行bundle和远端工具 | 启动可继续但不代表工具可用 |
| Postiz API key与已连接账号 | 实际操作必需 | 访问渠道和内容 | 无key只警告，先只读核查 |
| 可达可信MCP地址 | 必需 | 发送Bearer并调用远端 | 不向未核实地址配置凭据 |
| 流式HTTP反向代理 | 自托管才需 | 保持MCP连接 | 回原界面排查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理者核实endpoint并配置环境密钥 | 不打印key，连接不等于可操作 |
| 查规则 | Agent列渠道并取平台schema | 不猜integration ID |
| 草稿 | 运营者先核对账号文本和时间 | 远端回读ID与内容一致 |
| 异常 | 运营者回Postiz查已知记录 | 结果未知先查不盲重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 模型、Postiz套餐或自托管资源，未知 | Key、账号与代理配置 | 未实际连接 |
| 持续使用 | 模型和可能媒体API费用 | 文本、平台规则与时区审核 | 无节时或转化率数据 |
| 失败恢复 | 重复提交可能新增费用/内容 | 回远端查询已知记录 | 本地无发布事务收据 |
| 退出 | 原Postiz资源仍需维护 | 禁用适配回原界面，必要时撤销key | 未做真实退出验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接入 | 本地Bearer服务和MCP客户端连接配置 | 远端账号实际权限 |
| 工作流 | 列账号、读规则、draft/now提示 | 不可绕过的内容确认 |
| 发布 | 工具来自远端 | 最终发布成功、幂等与恢复 |

> **思考**：[Q02](#research-q02) Skill中的draft/now要求不是硬门禁，连接重试不保证业务幂等；本地未保存发布收据，未知结果必须回远端对账。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将环境凭据、MCP连接与平台工作流Skill包装为bundle，减少手工接线；不是自己实现社交平台发布引擎。

[Q01](#research-q01)薄provider与宿主MCP分工明确，headers getter复制避免冻结校验问题。[Q02](#research-q02)endpoint配置没有本地可信域限制，Skill不是发布硬门禁，重连不能承担事务恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Skill中的draft/now要求不是硬门禁，连接重试不保证业务幂等；本地未保存发布收据，未知结果必须回远端对账。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先观察并以只读账号规则查验为入口；草稿与发布必须回读远端，无法确认时停止DSH写操作回Postiz界面。

最小验证用测试草稿模拟提交成功但响应中断、确认后改文案、改账号和重复请求，对照原流程记录重复草稿、误发目标和人工对账步骤。只有确认远端支持稳定ID查询或幂等键，才能声称避免重发；若远端无此接口、收据与真实发布不能一致，或Postiz界面已充分解决需求，就停止独立扩展。当前只是由薄适配缺口推导的方向，不是已实现能力或商业需求。 见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地provider与MCP配置可核查；外部草稿、发布、幂等和权限未验证。确认摘要和收据是未验证设计假设。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-postiz/README.md、plugins/dsh-postiz/package.json、plugins/dsh-postiz/lib/index.js、plugins/dsh-postiz/lib/skill.js、plugins/dsh-postiz/cordis.patch.yml 及固定范围 inventory；组件：plugins/dsh-postiz。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定17f1e27b006c02cb46c64e8a319dc75dcfd870d2，目标plugins/dsh-postiz，检查其README/package/patch/provider/Skill；未核查外部Postiz后端和全部平台。
- 下一步：仅固定源码检查，未安装、连接外部服务、生成媒体或发表内容，也未执行其测试。

**分析版本**

- **仓库**：[gitroomhq/postiz-agent](https://github.com/gitroomhq/postiz-agent)
- **版本号**：0.1.0（[固定提交 17f1e27](https://github.com/gitroomhq/postiz-agent/tree/17f1e27b006c02cb46c64e8a319dc75dcfd870d2)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可推导未验证的发布收据适配层。先把内容、账号、时间和附件摘要作为待确认对象，确认后绑定远端草稿/任务ID；超时先查该ID，内容变化则要求新的决定。这比Skill中的“明确要求now”多了可核对的状态绑定，且重连不再被误当自动重提依据。

最小验证用测试草稿模拟提交成功但响应中断、确认后改文案、改账号和重复请求，对照原流程记录重复草稿、误发目标和人工对账步骤。只有确认远端支持稳定ID查询或幂等键，才能声称避免重发；若远端无此接口、收据与真实发布不能一致，或Postiz界面已充分解决需求，就停止独立扩展。当前只是由薄适配缺口推导的方向，不是已实现能力或商业需求。 见 [Q04](#research-q04)。

仅固定源码检查，未安装、连接外部服务、生成媒体或发表内容，也未执行其测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 191 | 120 | 44 | — |
| .md | source | 1 | 117 | — | — | 640 |
| .mjs | test | 1 | 81 | 72 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/gitroomhq/postiz-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/gitroomhq/postiz-agent/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)

暂未获取：近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Postiz适配能否可靠准备内容，并区分本地接线与远端发布保障？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比手工配置 Postiz MCP，插件实际多做什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对象是已把社交渠道连接到Postiz、希望在DSH中准备跨渠道内容的运营人员。简单基线是直接在Postiz界面操作，或手工配DSH MCP客户端。此组件将读取API key、构造endpoint/Bearer头和注册工作流Skill封成两行bundle：本地provider提供ctx.postiz，另一行宿主dsh-mcp-client读取它连接远端。密钥没有嵌入静态patch，Skill讲解先列渠道、再取平台规则、然后写草稿或安排发布。

插件没有实现各平台发布API、排期引擎或媒体生成；真实工具由Postiz MCP连接时动态发现，DSH承担MCP传输与审批。因此实际贡献是凭据与工作流适配，不是新增28个平台能力。本地注册Skill也可能在没有连接可用工具时出现，用户应以真实渠道列表为接入判据。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/index.js:46-59](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/index.js#L46-L59)

endpoint与Bearer从配置/环境构造。

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

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:83-100](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/index.js#L83-L100)

提供服务并可选注册Skill。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-postiz/cordis.patch.yml:19-38](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/cordis.patch.yml#L19-L38)

两行bundle真实连接streamableHTTP和重连配置。

<details>
<summary>查看原文（20行）</summary>

```text
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
        url: !!js ctx.postiz.url
        headers: !!js ctx.postiz.headers
        failOnStartupError: false
        reconnect:
          enabled: true
          initialDelayMs: 2000
          maxDelayMs: 30000
          maxAttempts: 10
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:19-37](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/skill.js#L19-L37)

先查渠道与平台schema的工作流要求。

<details>
<summary>查看原文（19行）</summary>

```text
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺密钥、连接失败或发布结果未知时，本地能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

没有密钥时provider仅警告，仍提供endpoint和空headers；patch设置failOnStartupError:false并有限重连，因此DSH可继续启动并不表示Postiz工具可用。resolveConnection只拼接baseUrl，没有在本组件校验HTTPS、可信域名或限制重定向，配置自托管地址时应确认目标归属，不能把不写明文配置误解为凭据绝不发往错误服务器。

Skill要求now仅在用户明确要求立即发布时用，draft供先审核；这是给模型的指令，不是本地针对发布工具的不可绕过硬门禁。此组件未保存请求收据、幂等键或远端post_id，也没有未知结果后的对账事务；MCP重连只恢复连接，不能证明发布没发生或重复提交无害。远端API如何去重和确认最终发布不在这份组件源码中，本轮未调用外部服务，不应给出发布可靠性保证。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/index.js:46-57](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/index.js#L46-L57)

自定义baseURL拼接与发送Bearer边界。

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

**依据 2 · 源码核查**：[plugins/dsh-postiz/lib/index.js:71-89](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/index.js#L71-L89)

缺key只警告仍提供服务。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-postiz/cordis.patch.yml:29-38](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/cordis.patch.yml#L29-L38)

失败不阻启动与有限重连。

<details>
<summary>查看原文（10行）</summary>

```text
        transport: streamable-http
        serverName: postiz
        url: !!js ctx.postiz.url
        headers: !!js ctx.postiz.headers
        failOnStartupError: false
        reconnect:
          enabled: true
          initialDelayMs: 2000
          maxDelayMs: 30000
          maxAttempts: 10
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:68-80](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/skill.js#L68-L80)

draft/now的提示约束与后续查询，但无本地事务状态。

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

- 外部Postiz MCP的幂等、权限、最终状态和调用失败语义未核查。
  **影响**：不能将工具注册当真实发布成功，结果未知时不能盲重试。
  **进一步探讨**：对选定账户先只读查渠道，使用测试草稿核查返回ID与查询；写操作响应中断先按已有ID对账。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 谁适合采用，前置条件、现金与人工成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要DSH的MCP客户端、可选skills服务、Postiz有效API key、已授权社交账号与可达MCP服务。自托管还要反向代理支持流式HTTP。模型负责内容，平台schema和助手工具负责当前字段，运营者仍须审核文本、时区、账号和附件。未实查平台全部规则，README的28+只能记作者覆盖声明。

建议观察，适合已经用Postiz的人先评估能否省手工MCP配置；当前材料可核本地接线，却不足完整草稿写入及结果回读。现金包括模型、Postiz实际套餐或自托管运维、媒体API和平台资源，金额及节时未知。若渠道ID与目标不符、规则读取失败、发布结果无法确认或需把密钥发到未核实地址，应停止DSH写操作，回Postiz界面核对草稿和发布记录。没有真实任务、运行与退路验收，不建议自动跨平台发布。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/README.md:29-38](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/README.md#L29-L38)

密钥及只读渠道列表是连接检查入口。

<details>
<summary>查看原文（10行）</summary>

````text
Then give it a Postiz API key. Copy it from **Postiz → Settings → Developers → Public API**
and export it before starting dsh, or put it in `$DSH_HOME/.env`:

```bash
export POSTIZ_API_KEY=your-api-key
dsh web
```

Restart the profile after installing. Ask the agent *"List my connected social media
accounts"* to verify the connection.
````

</details>

**依据 2 · 源码核查**：[plugins/dsh-postiz/README.md:89-93](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/README.md#L89-L93)

自托管流式代理前提。

```text
## Self-hosted Postiz

The MCP server is part of the Postiz backend and listens at `/mcp` (Bearer auth). Point
`baseUrl` at your backend and make sure your reverse proxy forwards `/mcp` with streaming
HTTP enabled. See [Reverse Proxies](https://docs.postiz.com/self-host/reverse-proxies/caddy).
```

**依据 3 · 源码核查**：[plugins/dsh-postiz/package.json:21-33](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/package.json#L21-L33)

bundle和基础运行时声明。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:33-50](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/skill.js#L33-L50)

平台字段与媒体依赖远端工具。

<details>
<summary>查看原文（18行）</summary>

```text
Call \`mcp__postiz__integrationSchema\` with \`{ platform, isPremium }\` before
composing. It returns \`maxLength\`, \`rules\`, a \`settings\` JSON schema of
required per-platform settings, and helper \`tools\` (for example: list Discord
channels, search subreddits, list LinkedIn pages). Run helpers with
\`mcp__postiz__triggerTool\` when a setting needs an ID you do not have.

## 3. Compose the content

- Content is HTML. Wrap every line in \`<p>\`. Allowed tags: \`<p>\`, \`<h1>\`,
  \`<h2>\`, \`<h3>\`, \`<strong>\`, \`<u>\`, \`<ul>\`, \`<li>\`. Do not combine
  \`<u>\` and \`<strong>\` in one element.
- Respect \`maxLength\` from the schema.
- \`postsAndComments\` is an array. On thread platforms (X, Threads, Bluesky)
  each item is a new post in the thread; on comment platforms (LinkedIn,
  Facebook) the first item is the post and the rest are comments.
- \`attachments\` are media URLs. To generate media first, use
  \`mcp__postiz__generateImageTool\` or \`mcp__postiz__generateVideoTool\`
  (check \`generateVideoOptions\` and \`videoFunctionTool\` for settings).
```

</details>

#### 缺口

- 实际账户权限、草稿回读与同版宿主调用未验证。
  **影响**：本地薄适配不能支撑持续采用或跨平台发布效果。
  **进一步探讨**：用已有Postiz测试账号核查一个平台的草稿、时区和远端ID，再决定是否扩大。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 草稿确认能否绑定内容摘要与远端ID避免重复发布？

**研究主题**：新假设与验证

#### 完整回答

可推导未验证的发布收据适配层。先把内容、账号、时间和附件摘要作为待确认对象，确认后绑定远端草稿/任务ID；超时先查该ID，内容变化则要求新的决定。这比Skill中的“明确要求now”多了可核对的状态绑定，且重连不再被误当自动重提依据。

最小验证用测试草稿模拟提交成功但响应中断、确认后改文案、改账号和重复请求，对照原流程记录重复草稿、误发目标和人工对账步骤。只有确认远端支持稳定ID查询或幂等键，才能声称避免重发；若远端无此接口、收据与真实发布不能一致，或Postiz界面已充分解决需求，就停止独立扩展。当前只是由薄适配缺口推导的方向，不是已实现能力或商业需求。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-postiz/lib/skill.js:54-80](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/lib/skill.js#L54-L80)

当前调用参数与draft/now规则，未带确认摘要和结果收据。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 2 · 源码核查**：[plugins/dsh-postiz/cordis.patch.yml:33-38](https://github.com/gitroomhq/postiz-agent/blob/17f1e27b006c02cb46c64e8a319dc75dcfd870d2/plugins/dsh-postiz/cordis.patch.yml#L33-L38)

现有重连配置不能证明业务重试语义。

```text
        failOnStartupError: false
        reconnect:
          enabled: true
          initialDelayMs: 2000
          maxDelayMs: 30000
          maxAttempts: 10
```

#### 缺口

- 远端是否支持稳定幂等键及发布状态查询。
  **影响**：本地加记录不能凭空提供恰好一次发布。
  **进一步探讨**：先核对实际远端API，缺乏可对账身份则保持人工界面确认。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
