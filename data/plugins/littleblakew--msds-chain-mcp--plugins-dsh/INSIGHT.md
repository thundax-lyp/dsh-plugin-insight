# DSH MSDS Chain

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ff06b00](https://github.com/littleblakew/msds-chain-mcp/tree/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：通过 MCP 桥将托管化学安全查询服务接入 DSH。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供 DSH 桥配置，不实现或验证底层化学安全判断。

> **主要限制**：[Q03](#research-q03) 组件未含服务数据和核验逻辑，作者引用主张不能证明安全建议正确。

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
  - [Q01 · 化学安全资料使用者相对直接查询 SDS 获得什么？](#detail-section-11)
  - [Q02 · 组件如何连接服务，错误如何影响工具发现？](#detail-section-12)
  - [Q03 · 化学安全来源和实时可靠性能否从桥接得到保证？](#detail-section-13)
  - [Q04 · 使用前要核对哪些依赖、数据和失败条件？](#detail-section-14)
  - [Q05 · 如何帮助用户发现工具未加载或 SDS 缺乏来源？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要查找化学品安全资料并由专业人员复核的 DSH 用户。

由合格人员直接核对最新供货商 SDS 与适用规定。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| MCP 桥 | 连接化学安全工具 | 依赖远端与密钥 |
| 化学资料查询 | 获得作者声明的 SDS 线索 | 数据和适用性未核验 |
| 自托管覆盖 | 改用自有服务 | 服务身份与凭据另行核查 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| 兼容 DSH MCP 客户端 | 启用需要 | 连接远程工具 | 无工具 |
| 网络及服务 | 调用需要 | 查询化学安全信息 | 不可用或超时 |
| API key | 作者声明托管服务需要 | 访问授权 | 作者称可能静默无工具 |
| 合格人员和最新 SDS | 实际安全决策需要 | 验证物质与条件 | 不应直接采用结果 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户确认服务与密钥 | 不泄露凭据及配方 |
| 查询 | Agent 调用相关工具 | 检查工具是否可用 |
| 核对 | 专业人员核实具体物质和 SDS | 核对版本与工艺条件 |
| 决定 | 负责人按当地程序处理 | 缺证据则停止 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | DSH、服务及密钥 | 配置与隐私评估 | 兼容性未知 |
| 持续 | 网络与可能的服务额度 | 安全专业复核 | 费用和精度未知 |
| 故障 | 诊断与官方 SDS | 检查密钥和来源 | 静默失败率未知 |

| 效果 | 材料 | 未知 |
|---|---|---|
| DSH 接入 | bundle patch | 实际工具注册 |
| 引用 SDS | 作者声明 | 数据真伪、日期及适用性 |
| 启动失败处理 | 作者报告默认策略 | 当前宿主行为 |

> **思考**：[Q03](#research-q03) 组件未含服务数据和核验逻辑，作者引用主张不能证明安全建议正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供 DSH 桥配置，不实现或验证底层化学安全判断。

[Q02](#research-q02) 采用环境变量与 MCP 桥；[Q03](#research-q03) 桥没有实现来源验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 组件未含服务数据和核验逻辑，作者引用主张不能证明安全建议正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅作为待复核线索；任何化学处置先由合格人员核对最新原始 SDS 和现场条件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本组件配置和文档检查；未调用外部服务或实际 SDS。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/package.json、plugins/dsh/cordis.patch.yml 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查 plugins/dsh 的 README、package 和 patch；根服务实现、托管版本、SDS 数据及宿主身份未审计。
- 下一步：隔离环境核查 DSH 启动、密钥错误与引用字段；化学安全结论另需专业核验，本轮未执行。

**分析版本**

- **仓库**：[littleblakew/msds-chain-mcp](https://github.com/littleblakew/msds-chain-mcp)
- **版本号**：0.1.0（[固定提交 ff06b00](https://github.com/littleblakew/msds-chain-mcp/tree/ff06b00d00e00762f281a79cf1766040cf49f36d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 建议提供连接与引用状态，需验证且不泄露凭据。

隔离环境核查 DSH 启动、密钥错误与引用字段；化学安全结论另需专业核验，本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 74 | — | — | 439 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/littleblakew/msds-chain-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 桥接、鉴权和化学安全证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 化学安全资料使用者相对直接查询 SDS 获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该组件声明为 DSH 用户挂接托管化学安全 MCP，作者描述问答、兼容性、储存与 SDS 信息；直接核查供货商 SDS 和专业流程是必要基线。组件本身只配置桥接，不实现安全数据或判断；作者声称提供引用不能证明当前远端回答的正确性、覆盖或适用性。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:1-12](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L1-L12)

服务定位与作者能力声明。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-msds-chain

Chemical safety intelligence for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).
This bundle mounts the hosted MSDS Chain MCP endpoint through the in-box
`@deepseek-ai/dsh-mcp-client` bridge — no server to run locally.

MCP tools covering compatibility and mixing-order checks, GHS hazard analysis, PPE
recommendations, storage and waste-disposal guidance, occupational exposure limits,
transport classification, multi-region regulatory compliance (EU/US/CN/JP/KR/CA/AU/TW/SG),
safer alternatives, protocol text parsing, SDS section lookup and version diffs, and
signed audit reports. Every answer cites the supplier SDS and revision date it is
grounded in.
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/package.json:1-15](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/package.json#L1-L15)

组件身份与内容。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "dsh-msds-chain",
  "description": "Chemical safety intelligence for DeepSeek Harness: mounts the hosted MSDS Chain MCP endpoint (https://mcp.lagentbot.com/mcp) through the in-box @deepseek-ai/dsh-mcp-client bridge",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/littleblakew/msds-chain-mcp.git",
    "directory": "plugins/dsh"
  },
  "homepage": "https://msdschain.lagentbot.com",
  "files": [
    "cordis.patch.yml",
    "README.md"
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/cordis.patch.yml:43-51](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/cordis.patch.yml#L43-L51)

远程 MCP 客户端配置。

```text
- insert:
    - id: mcp-msds-chain
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: msds-chain
        transport: streamable-http
        url: https://mcp.lagentbot.com/mcp
        headers: !!js 'process.env.MSDS_API_KEY ? { Authorization: `Bearer ${process.env.MSDS_API_KEY}` } : {}'
        toolCallTimeoutMs: 150000
```

#### 缺口

- 远端服务和具体 SDS 未核验
  **影响**：不能确定回答正确性或现场适用性
  **进一步探讨**：由具资质人员按具体化学品和工艺对照最新供货商 SDS。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组件如何连接服务，错误如何影响工具发现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle 插入官方 MCP 客户端，配置 streamable-http URL，从环境变量存在时组装 Bearer 头，并设置 150 秒调用超时；failOnStartupError 未在配置中显式开启。作者称其在特定旧版 DSH 中缺失或错误密钥会静默导致工具未注册，这仅是作者版本特定报告，不可延伸到所有版本或将超时当服务可用性证明。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/cordis.patch.yml:43-51](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/cordis.patch.yml#L43-L51)

服务 URL、鉴权头和超时。

```text
- insert:
    - id: mcp-msds-chain
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: msds-chain
        transport: streamable-http
        url: https://mcp.lagentbot.com/mcp
        headers: !!js 'process.env.MSDS_API_KEY ? { Authorization: `Bearer ${process.env.MSDS_API_KEY}` } : {}'
        toolCallTimeoutMs: 150000
```

**依据 2 · 作者声明**：[plugins/dsh/README.md:34-55](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L34-L55)

作者对 401 和启动策略的报告。

<details>
<summary>查看原文（22行）</summary>

````text
## Verifying it loaded

⚠️ **A missing or invalid key fails silently.** The endpoint answers `401`, no tools
register, and `dsh` prints nothing to the console — the harness starts normally and the
model simply has no `mcp__msds-chain__*` tools. (Measured against dsh `0.1.0-rc.6`.)

So check the key itself rather than watching for an error:

```sh
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://mcp.lagentbot.com/mcp \
  -H "Authorization: Bearer $MSDS_API_KEY" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}'
```

`200` means the key works; `401` means it does not.

This bundle deliberately leaves `failOnStartupError` at its default (`false`). Setting it
to `true` does surface the 401 loudly — but it aborts the whole plugin tree, so `dsh`
refuses to boot at all. A chemical-safety plugin should not be able to take down your
harness because our endpoint had a bad minute.
````

</details>

#### 缺口

- 未执行远端服务和目标宿主
  **影响**：无法确认认证、注册或报错行为
  **进一步探讨**：用测试密钥在隔离宿主验证缺钥、过期、断网和恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 化学安全来源和实时可靠性能否从桥接得到保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README 声称回答引用供货商 SDS 及修订日期；该组件只提供桥，既不校验远端引用，也不在本目录包含化学品数据库、SDS 或服务逻辑。提供工具和完整来源声明不证明化学兼容、暴露限制或应急建议准确；生产使用须由专业人员结合最新 SDS、具体配方、条件和当地要求核实。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:7-12](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L7-L12)

作者对来源和功能的声明。

```text
MCP tools covering compatibility and mixing-order checks, GHS hazard analysis, PPE
recommendations, storage and waste-disposal guidance, occupational exposure limits,
transport classification, multi-region regulatory compliance (EU/US/CN/JP/KR/CA/AU/TW/SG),
safer alternatives, protocol text parsing, SDS section lookup and version diffs, and
signed audit reports. Every answer cites the supplier SDS and revision date it is
grounded in.
```

**依据 2 · 源码核查**：[plugins/dsh/package.json:13-15](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/package.json#L13-L15)

组件分发仅含 patch 和 README。

```text
  "files": [
    "cordis.patch.yml",
    "README.md"
```

**依据 3 · 源码核查**：[plugins/dsh/cordis.patch.yml:43-51](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/cordis.patch.yml#L43-L51)

组件将调用路由到远端。

```text
- insert:
    - id: mcp-msds-chain
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: msds-chain
        transport: streamable-http
        url: https://mcp.lagentbot.com/mcp
        headers: !!js 'process.env.MSDS_API_KEY ? { Authorization: `Bearer ${process.env.MSDS_API_KEY}` } : {}'
        toolCallTimeoutMs: 150000
```

#### 缺口

- 远端数据来源、更新与校验不可见
  **影响**：不能保证高风险建议准确或完整
  **进一步探讨**：针对具体物质请专业人员回源供货商 SDS 与适用标准。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用前要核对哪些依赖、数据和失败条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

组件依赖 DSH MCP bridge、网络、托管服务和 API key；请求内容与凭据会发送到所配置服务，服务端保存和数据政策未在本目录核实。作者描述可覆盖 URL 指向自托管服务，切换仍需确认其身份及凭据边界。用户需要承担密钥管理、可用性和高风险答案复核；没有授权、SDS 或环境信息不足时停止并咨询合格安全人员。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:20-32](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L20-L32)

作者的 key 和工具接入说明。

<details>
<summary>查看原文（13行）</summary>

````text
## Configure

An API key is required — there is no anonymous tier on this endpoint. Create one at
[msdschain.lagentbot.com](https://msdschain.lagentbot.com) → API Keys (free plan
available), then:

```sh
export MSDS_API_KEY=sk-msds-your-key
```

Start `dsh` with that variable set. The tools register on `ctx.tools` under the
`msds-chain` namespace, so the model sees `mcp__msds-chain__ask_chemical_safety`,
`mcp__msds-chain__check_chemical_compatibility`, and so on.
````

</details>

**依据 2 · 作者声明**：[plugins/dsh/README.md:63-67](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L63-L67)

自托管覆盖说明。

```text
## Self-hosting

To point at your own core instead of the hosted endpoint, override the row from a
later layer (profile `cordis.patch.yml` or `--patch`) — see the comment block in
[`cordis.patch.yml`](cordis.patch.yml).
```

**依据 3 · 源码核查**：[plugins/dsh/cordis.patch.yml:43-51](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/cordis.patch.yml#L43-L51)

远程及授权头。

```text
- insert:
    - id: mcp-msds-chain
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: msds-chain
        transport: streamable-http
        url: https://mcp.lagentbot.com/mcp
        headers: !!js 'process.env.MSDS_API_KEY ? { Authorization: `Bearer ${process.env.MSDS_API_KEY}` } : {}'
        toolCallTimeoutMs: 150000
```

#### 缺口

- 费用、服务隐私政策、故障恢复及真实精度未经验证
  **影响**：无法判断使用成本与风险
  **进一步探讨**：不发送敏感实验配方，先核实服务协议并核对来源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户发现工具未加载或 SDS 缺乏来源？

**研究主题**：新假设与验证

#### 完整回答

作者报告缺 key 可能静默无工具，且桥本身不校验 SDS 引用。可探索在受支持宿主暴露不含密钥的连接状态，同时对输出提示来源和修订日期是否存在；这是待验证方案，不能将字段存在当作材料准确。以缺钥、失联、来源缺失和旧修订的受控样例比较发现率、误报及排障耗时，若泄露凭据或无改善则否定。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:34-55](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L34-L55)

作者版本特定的静默失败及取舍。

<details>
<summary>查看原文（22行）</summary>

````text
## Verifying it loaded

⚠️ **A missing or invalid key fails silently.** The endpoint answers `401`, no tools
register, and `dsh` prints nothing to the console — the harness starts normally and the
model simply has no `mcp__msds-chain__*` tools. (Measured against dsh `0.1.0-rc.6`.)

So check the key itself rather than watching for an error:

```sh
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://mcp.lagentbot.com/mcp \
  -H "Authorization: Bearer $MSDS_API_KEY" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}'
```

`200` means the key works; `401` means it does not.

This bundle deliberately leaves `failOnStartupError` at its default (`false`). Setting it
to `true` does surface the 401 loudly — but it aborts the whole plugin tree, so `dsh`
refuses to boot at all. A chemical-safety plugin should not be able to take down your
harness because our endpoint had a bad minute.
````

</details>

**依据 2 · 作者声明**：[plugins/dsh/README.md:7-12](https://github.com/littleblakew/msds-chain-mcp/blob/ff06b00d00e00762f281a79cf1766040cf49f36d/plugins/dsh/README.md#L7-L12)

作者引用声明。

```text
MCP tools covering compatibility and mixing-order checks, GHS hazard analysis, PPE
recommendations, storage and waste-disposal guidance, occupational exposure limits,
transport classification, multi-region regulatory compliance (EU/US/CN/JP/KR/CA/AU/TW/SG),
safer alternatives, protocol text parsing, SDS section lookup and version diffs, and
signed audit reports. Every answer cites the supplier SDS and revision date it is
grounded in.
```

#### 缺口

- 诊断集成、字段及用户效果未验证
  **影响**：不能证明建议可降低误用
  **进一步探讨**：隔离环境模拟连接与引用缺失并由专业人员复核。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
