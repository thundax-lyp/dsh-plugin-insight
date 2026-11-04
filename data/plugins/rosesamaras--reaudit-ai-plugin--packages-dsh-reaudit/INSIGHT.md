# DSH Reaudit

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[93268dc](https://github.com/RoseSamaras/reaudit-ai-plugin/tree/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：通过 DSH MCP 客户端连接 Reaudit 托管服务，使用其远端工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示组件将端点、命名空间、凭据与超时封装为宿主配置；远端审查能力本身不归因于此子包。

> **主要限制**：[Q03](#research-q03) 的远端实现、工具权限和数据处理不在固定子包中；[Q04](#research-q04) 的潜在写入或发布必须先核账户与服务契约。

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
  - [Q01 · 谁可以使用它，它相对直接使用远端服务增加了什么？](#detail-section-11)
  - [Q02 · 宿主怎样连接、认证和处理启动失败？](#detail-section-12)
  - [Q03 · 这个子包能证明远端能力、权限和数据处理吗？](#detail-section-13)
  - [Q04 · 需要什么条件、成本及停止标准？](#detail-section-14)
  - [Q05 · 什么后续设计值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Reaudit 账户且需查看品牌搜索可见性或站点数据的团队，可评估在 DSH 中使用远端工具。

用户可以使用服务网站，或自行配置同一 MCP 客户端；子包主要提供一份可安装的连接配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP 连接配置 | 在宿主挂载 Reaudit 远端服务 | 需要兼容桥、网络和账户密钥 |
| 远端工具调用 | 作者声明提供站点、内容和分析工具 | 实际清单、权限及效果未实测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH MCP 客户端 | 连接需要 | 挂载工具 | 未验证具体宿主版本 |
| Reaudit 账户与 API key | 作者声明需要 | 认证远端服务 | 缺失时作者称连接失败，尚未实测 |
| 网络与远端服务 | 远端操作需要 | 请求审查等能力 | 不可用时无法取得实时结果 |
| 相应账号权限 | 对应数据或写操作需要 | 访问和执行 | 权限及费用未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核实服务政策、权限和测试账户 | 不明时停止连接敏感数据 |
| 配置 | 用户在兼容宿主提供密钥与端点 | 检查连接是否成功及实际工具 |
| 使用 | 用户从只读非敏感请求开始 | 核对目标、数据和响应 |
| 恢复 | 用户回查远端状态 | 结果未知时不盲目重放写操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 账户和服务费用未知 | 配置桥接及核对权限 | 远端服务与宿主未运行 |
| 持续 | 服务、模型与网络费用未知 | 审查目标、数据和结果 | 工具数量和质量可变化 |
| 失败恢复 | 查询及重试成本未知 | 回查远端副作用 | 写操作幂等性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH 连接 | patch 配置远端桥接 | 真实连接与工具注册 |
| 站点分析 | 作者声明远端工具类别 | 结果质量和覆盖 |
| 内容操作 | 作者声明存在生成和发布 | 账号权限与实际副作用 |

> **思考**：[Q03](#research-q03) 的远端实现、工具权限和数据处理不在固定子包中；[Q04](#research-q04) 的潜在写入或发布必须先核账户与服务契约。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示组件将端点、命名空间、凭据与超时封装为宿主配置；远端审查能力本身不归因于此子包。

[Q02](#research-q02) 的最小 bundle 复用宿主桥并允许后续覆盖配置；服务故障与能力变化仍须在实际宿主中验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的远端实现、工具权限和数据处理不在固定子包中；[Q04](#research-q04) 的潜在写入或发布必须先核账户与服务契约。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先核服务政策与权限，再在隔离账户尝试非敏感只读请求；结果或目标不明时停止并人工回查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定配置支持桥接机制判断；服务工具清单、权限、效果和假设均未实际验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-reaudit/package.json、packages/dsh-reaudit/README.md、packages/dsh-reaudit/cordis.patch.yml 及固定范围 inventory；组件：packages/dsh-reaudit。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：子组件固定树只含包、README、许可与 bundle patch；未读取宿主 MCP 桥实现或运行服务、测试和网络，也不审计仓库其他平台插件。
- 下一步：固定 DSH 与服务版本，在隔离账户检查密钥失败、工具发现、只读响应、超时和潜在写操作的回查。

**分析版本**

- **仓库**：[RoseSamaras/reaudit-ai-plugin](https://github.com/RoseSamaras/reaudit-ai-plugin)
- **版本号**：0.1.0（[固定提交 93268dc](https://github.com/RoseSamaras/reaudit-ai-plugin/tree/93268dc3fa4b0768243c28917ab9b41318322c69)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出逐调用权限和目标预览及结果回查的未验证设想；元数据不可靠或负担大于收益时否定。

固定 DSH 与服务版本，在隔离账户检查密钥失败、工具发现、只读响应、超时和潜在写操作的回查。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 53 | — | — | 373 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/RoseSamaras/reaudit-ai-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 连接包的实际桥接配置、远端能力和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁可以使用它，它相对直接使用远端服务增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护品牌搜索可见性或站点内容的团队，如果已有 Reaudit 账户和兼容宿主，可以尝试在 DSH 中调用远端服务提供的审查和内容工具。直接使用服务网站或手工配置同一 MCP 客户端也可能完成部分任务；此子包提供的具体增量是一份可安装的宿主连接配置，避免每次手写桥接行。它不包含远端审查引擎，目录中的工具清单是作者描述，不能当成本次实际发现或执行结果。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-reaudit/README.md:3-15](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L3-L15)

作者描述目标、远端工具类别及执行位置。

<details>
<summary>查看原文（13行）</summary>

```text
# dsh-reaudit

[Reaudit](https://reaudit.io) for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): a bundle that mounts the hosted Reaudit MCP server (`https://mcp.reaudit.io/mcp`) through the in-box `@deepseek-ai/dsh-mcp-client` bridge.

The agent gets Reaudit's tools as `mcp__reaudit__*` (238 at the time of writing; the server's `/health` endpoint reports the live count), covering:

- **AI visibility**: how ChatGPT, Perplexity, Gemini, Google AI Overviews and other engines answer your tracked prompts, visibility scores, competitor comparisons, citation sources and sentiment (`get_visibility_score`, `get_competitor_comparison`, `get_citation_sources`, `get_sentiment_report`).
- **Site health**: audits and recommendations, crawlability and agent-readiness checks (`run_audit`, `get_audit_recommendations`, `check_crawlability`, `scan_agent_readiness`).
- **Content**: generation, editing, translation and publishing to WordPress (`generate_content`, `edit_content`, `translate_content`, `publish_to_wordpress`).
- **Search and analytics**: Google Search Console, GA4 and Bing Webmaster data in one place, plus each source on its own (`get_analytics_hub`, `get_ga4_analytics`, `get_bing_search_performance`).
- **Social and community**: post generation and scheduling, Reddit opportunities (`generate_social_posts`, `schedule_social_post`, `get_reddit_opportunities`).

Nothing runs locally besides the bridge: the tools execute on Reaudit's server against your account.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-reaudit/package.json:1-12](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/package.json#L1-L12)

组件身份、描述与仓库子路径。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-reaudit",
  "description": "Reaudit MCP for DeepSeek Harness: mounts the hosted Reaudit MCP server (https://mcp.reaudit.io/mcp) through the in-box @deepseek-ai/dsh-mcp-client bridge.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "homepage": "https://reaudit.io",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/RoseSamaras/reaudit-ai-plugin.git",
    "directory": "packages/dsh-reaudit"
  },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-reaudit/cordis.patch.yml:24-35](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/cordis.patch.yml#L24-L35)

通过宿主 MCP 客户端注册远端连接。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: mcp-reaudit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: reaudit
        transport: streamable-http
        url: https://mcp.reaudit.io/mcp
        headers:
          Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
        # Audits, strategy steps and content generation run for minutes.
        toolCallTimeoutMs: 300000
        failOnStartupError: false
```

</details>

#### 缺口

- 未使用服务账户或对照网站操作
  **影响**：不能量化接线节时、真实需求或服务效果
  **进一步探讨**：在授权测试账户对照手配和包配置，并检查实际工具清单。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主怎样连接、认证和处理启动失败？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

子包没有本地工具实现；bundle 插入一行 @deepseek-ai/dsh-mcp-client，配置名为 reaudit、使用 streamable HTTP 指向固定的 Reaudit MCP 地址，Authorization 值从 REAUDIT_API_KEY 环境变量构造，单次工具调用超时设置为 300000 毫秒并配置 failOnStartupError 为 false。README 建议通过同一行 ID 的后续层覆盖端点或超时；具体 MCP 客户端对空密钥、鉴权失败和注册失败的运行行为依赖宿主桥接和远端，本次没有读取宿主版本或连接，因此不能把启动成功、工具数量或在线可用性当作已验证事实。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-reaudit/cordis.patch.yml:24-35](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/cordis.patch.yml#L24-L35)

实际 bundle 行、认证头、超时与失败设置。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: mcp-reaudit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: reaudit
        transport: streamable-http
        url: https://mcp.reaudit.io/mcp
        headers:
          Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
        # Audits, strategy steps and content generation run for minutes.
        toolCallTimeoutMs: 300000
        failOnStartupError: false
```

</details>

**依据 2 · 作者声明**：[packages/dsh-reaudit/README.md:23-33](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L23-L33)

作者说明密钥配置及预期的缺密钥行为。

<details>
<summary>查看原文（11行）</summary>

````text
## Authenticate

1. Create an API key at [reaudit.io](https://reaudit.io/dashboard/tools) under **Tools → MCP Server** (it starts with `rau_`).
2. Make it available to dsh as `REAUDIT_API_KEY`:

   ```sh
   export REAUDIT_API_KEY=rau_your_key_here
   dsh --profile <profile>
   ```

The key is sent as an `Authorization: Bearer` header, not in the URL, so it stays out of access logs. Without it the server answers 401 and dsh starts without the Reaudit tools (`failOnStartupError: false`).
````

</details>

**依据 3 · 作者声明**：[packages/dsh-reaudit/README.md:35-49](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L35-L49)

作者说明后续层覆盖方式。

<details>
<summary>查看原文（15行）</summary>

````text
## Configure

Long-running tools (audits, strategy research, content generation) take minutes, so the bundle raises the per-call timeout to 5 minutes. To change it, or the endpoint, repeat the row's id **without** `insert` in a later layer (your profile's `cordis.patch.yml` or a `--patch` file):

```yaml
- id: mcp-reaudit
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: reaudit
    transport: streamable-http
    url: https://mcp.reaudit.io/mcp
    headers:
      Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
    toolCallTimeoutMs: 600000
```
````

</details>

#### 缺口

- 未运行 DSH 桥接或访问远端
  **影响**：不能确认鉴权、连接及工具注册结果
  **进一步探讨**：使用隔离凭据在固定宿主版本检查连接、失败状态和实际工具列表。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 这个子包能证明远端能力、权限和数据处理吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

固定子目录仅包含包元数据、README、许可和 patch，实际业务调用被配置指向远端；审查、生成、发布和账号内操作的实现、数据保存以及权限策略不在本组件可查范围。README 列出查看可见性、审查站点、内容生成和发布等工具，但这只是作者声明，数量与名称可能随远端变化。请求可包含账号密钥和用户提供的数据；头部避免把密钥放进 URL 不代表任何日志、服务方或网络中均不可见。不能将配置中的 300 秒超时当作服务正常完成或结果正确的保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-reaudit/package.json:13-18](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/package.json#L13-L18)

列出的分发文件只有配置、文档及资产声明。

```text
  "files": [
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "assets/logo.png"
  ],
```

**依据 2 · 源码核查**：[packages/dsh-reaudit/cordis.patch.yml:24-35](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/cordis.patch.yml#L24-L35)

配置调用外部服务并携带认证头。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: mcp-reaudit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: reaudit
        transport: streamable-http
        url: https://mcp.reaudit.io/mcp
        headers:
          Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
        # Audits, strategy steps and content generation run for minutes.
        toolCallTimeoutMs: 300000
        failOnStartupError: false
```

</details>

**依据 3 · 作者声明**：[packages/dsh-reaudit/README.md:7-15](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L7-L15)

作者列出远端能力与执行边界。

```text
The agent gets Reaudit's tools as `mcp__reaudit__*` (238 at the time of writing; the server's `/health` endpoint reports the live count), covering:

- **AI visibility**: how ChatGPT, Perplexity, Gemini, Google AI Overviews and other engines answer your tracked prompts, visibility scores, competitor comparisons, citation sources and sentiment (`get_visibility_score`, `get_competitor_comparison`, `get_citation_sources`, `get_sentiment_report`).
- **Site health**: audits and recommendations, crawlability and agent-readiness checks (`run_audit`, `get_audit_recommendations`, `check_crawlability`, `scan_agent_readiness`).
- **Content**: generation, editing, translation and publishing to WordPress (`generate_content`, `edit_content`, `translate_content`, `publish_to_wordpress`).
- **Search and analytics**: Google Search Console, GA4 and Bing Webmaster data in one place, plus each source on its own (`get_analytics_hub`, `get_ga4_analytics`, `get_bing_search_performance`).
- **Social and community**: post generation and scheduling, Reddit opportunities (`generate_social_posts`, `schedule_social_post`, `get_reddit_opportunities`).

Nothing runs locally besides the bridge: the tools execute on Reaudit's server against your account.
```

#### 缺口

- 远端实现、账号权限、价格和数据政策未核实
  **影响**：不能判断结果正确性、可用性及对外操作影响
  **进一步探讨**：查服务契约并在隔离账户核对可用权限、读写动作和数据处理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 需要什么条件、成本及停止标准？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要兼容的 DSH MCP 桥、网络、Reaudit 账户与 API key，部分作者列举的分析或发布还可能需要额外账户权限，具体条件和收费在本次材料中未知。首次需要配置密钥并核查服务与数据政策，持续可能产生服务和模型调用费用，也需人工复核结果，具体金额、耗时和频率未知；失败时需要核查服务是否已经执行，不应盲目重放可能写入或发布的操作。鉴于远端能力与权限没有实测，建议先观察并核实权限，仅在隔离测试账户读取非敏感数据；工具清单、目的地或数据处理不清时停止并回到服务界面人工核对。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-reaudit/README.md:15-33](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L15-L33)

作者说明远端执行及账号密钥要求。

<details>
<summary>查看原文（19行）</summary>

````text
Nothing runs locally besides the bridge: the tools execute on Reaudit's server against your account.

## Install

```sh
dsh plugin --profile <profile> add github:RoseSamaras/reaudit-ai-plugin#path:/packages/dsh-reaudit
```

## Authenticate

1. Create an API key at [reaudit.io](https://reaudit.io/dashboard/tools) under **Tools → MCP Server** (it starts with `rau_`).
2. Make it available to dsh as `REAUDIT_API_KEY`:

   ```sh
   export REAUDIT_API_KEY=rau_your_key_here
   dsh --profile <profile>
   ```

The key is sent as an `Authorization: Bearer` header, not in the URL, so it stays out of access logs. Without it the server answers 401 and dsh starts without the Reaudit tools (`failOnStartupError: false`).
````

</details>

**依据 2 · 源码核查**：[packages/dsh-reaudit/cordis.patch.yml:24-35](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/cordis.patch.yml#L24-L35)

桥接、环境变量与超时配置。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: mcp-reaudit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: reaudit
        transport: streamable-http
        url: https://mcp.reaudit.io/mcp
        headers:
          Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
        # Audits, strategy steps and content generation run for minutes.
        toolCallTimeoutMs: 300000
        failOnStartupError: false
```

</details>

**依据 3 · 作者声明**：[packages/dsh-reaudit/README.md:9-13](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L9-L13)

作者列出可能产生内容或发布的远端操作。

```text
- **AI visibility**: how ChatGPT, Perplexity, Gemini, Google AI Overviews and other engines answer your tracked prompts, visibility scores, competitor comparisons, citation sources and sentiment (`get_visibility_score`, `get_competitor_comparison`, `get_citation_sources`, `get_sentiment_report`).
- **Site health**: audits and recommendations, crawlability and agent-readiness checks (`run_audit`, `get_audit_recommendations`, `check_crawlability`, `scan_agent_readiness`).
- **Content**: generation, editing, translation and publishing to WordPress (`generate_content`, `edit_content`, `translate_content`, `publish_to_wordpress`).
- **Search and analytics**: Google Search Console, GA4 and Bing Webmaster data in one place, plus each source on its own (`get_analytics_hub`, `get_ga4_analytics`, `get_bing_search_performance`).
- **Social and community**: post generation and scheduling, Reddit opportunities (`generate_social_posts`, `schedule_social_post`, `get_reddit_opportunities`).
```

#### 缺口

- 计费、服务权限及操作幂等性未验证
  **影响**：无法估计成本或安全重试写操作
  **进一步探讨**：在正式使用前核对服务说明，并用测试账户记录请求和状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么后续设计值得验证？

**研究主题**：新假设与验证

#### 完整回答

可探索让桥接层在调用前展示远端工具的读写类别、目标账户和数据发送范围，并对结果未知的写操作保留可回查的请求标识。当前子包已有端点、命名空间和超时，但未提供此类逐调用预览；该方向需要远端接口提供真实权限和状态信息，不能靠工具名称猜测。以测试账户比较错误目标、重复提交和用户确认时间；如果元数据不可靠、不能减少错误或审批负担超过收益，就否定。此方向未实现也未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-reaudit/cordis.patch.yml:24-35](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/cordis.patch.yml#L24-L35)

现有配置只有连接、认证、超时和失败设置。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: mcp-reaudit
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: reaudit
        transport: streamable-http
        url: https://mcp.reaudit.io/mcp
        headers:
          Authorization: !!js "`Bearer ${process.env.REAUDIT_API_KEY || ''}`"
        # Audits, strategy steps and content generation run for minutes.
        toolCallTimeoutMs: 300000
        failOnStartupError: false
```

</details>

**依据 2 · 作者声明**：[packages/dsh-reaudit/README.md:9-13](https://github.com/RoseSamaras/reaudit-ai-plugin/blob/93268dc3fa4b0768243c28917ab9b41318322c69/packages/dsh-reaudit/README.md#L9-L13)

作者描述读取和发布等不同类别工具。

```text
- **AI visibility**: how ChatGPT, Perplexity, Gemini, Google AI Overviews and other engines answer your tracked prompts, visibility scores, competitor comparisons, citation sources and sentiment (`get_visibility_score`, `get_competitor_comparison`, `get_citation_sources`, `get_sentiment_report`).
- **Site health**: audits and recommendations, crawlability and agent-readiness checks (`run_audit`, `get_audit_recommendations`, `check_crawlability`, `scan_agent_readiness`).
- **Content**: generation, editing, translation and publishing to WordPress (`generate_content`, `edit_content`, `translate_content`, `publish_to_wordpress`).
- **Search and analytics**: Google Search Console, GA4 and Bing Webmaster data in one place, plus each source on its own (`get_analytics_hub`, `get_ga4_analytics`, `get_bing_search_performance`).
- **Social and community**: post generation and scheduling, Reddit opportunities (`generate_social_posts`, `schedule_social_post`, `get_reddit_opportunities`).
```

#### 缺口

- 没有可验证的权限元数据及结果回查机制
  **影响**：不能证明方案可执行或减少错误
  **进一步探讨**：先验证服务能否提供稳定工具权限和请求状态，再设计隔离对照。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
