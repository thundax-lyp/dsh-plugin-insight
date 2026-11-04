# Cue Data MCP

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sensedeal/cue-skills) [![npm 30d 110](https://img.shields.io/static/v1?label=npm+30d&message=110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-cue-data-mcp) [![最新发布 2026-09-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cueai/dsh-cue-data-mcp)
<!-- END META -->

> **功能**：把 Cue 监管、宏观、披露等公开数据 MCP 域接入 DSH。

> **亮点**：[Q01](#research-q01) 一次组合多域和一致工具命名，复用宿主传输与发现。

> **主要限制**：[Q02](#research-q02) 15 行只证明静态接入，远端工具、权限和数据新鲜度仍需检查。

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
  - [Q01 · 哪些用户可以用一个 bundle 访问多个 Cue 数据域？](#detail-section-11)
  - [Q02 · 固定地址与统一密钥限定了哪些风险？](#detail-section-12)
  - [Q03 · 如何受控试用、退出及验证多域部署收益？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中反复查多个 Cue 数据域的研究者需要统一入口。

按需手配单域 MCP 行，或切换浏览器到原始来源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多域 MCP | 接入监管与宏观等数据 | 工具能力取决于远端 |
| 固定端点 | 约束配置中的网络地址 | 未核远端调用实现 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| dsh-mcp-client ^0.1.1-rc.2 | 必需 | 挂载传输和工具 | 检查 profile peer |
| Cue key 与网络 | 必需 | 查询远端 | 保留手工渠道 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户展开隔离 profile 配置 | 确认 15 个预期域 |
| 验证 | 用户对已知数据核工具和来源 | 异常则停止使用输出 |
| 退出 | 用户移除 bundle | 新会话无对应工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 额度未核 | 配置 key 和 profile | 仅测试少量工具 |
| 持续 | 查询和模型费用未知 | 维护密钥和工具差异 | 依赖远端 |
| 失败 | 重试费用未知 | 查配置与远端拒绝 | 优先避免盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多域统一 | 固定 MCP 行 | 真实工具与覆盖 |
| 查询复用 | 宿主工具命名 | 实际节时与时效 |

> **思考**：[Q02](#research-q02) 15 行只证明静态接入，远端工具、权限和数据新鲜度仍需检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 一次组合多域和一致工具命名，复用宿主传输与发现。

固定出站服务地址使配置可检查；接线层不校验数据结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 15 行只证明静态接入，远端工具、权限和数据新鲜度仍需检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用隔离 profile 对照工具发现与授权的小查询，身份或费用不明即退回人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定补丁和 manifest 可核。远端数据和费用未验证。

- 已检查：作者 README、包清单、源码路径 dsh/cue-data-mcp/README.zh-CN.md、dsh/cue-data-mcp/package.json、dsh/cue-data-mcp/cordis.patch.yml 及固定范围 inventory；组件：dsh/cue-data-mcp。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读指定子包全部跟踪文件，未运行 MCP 客户端、查询或核 npm。
- 下一步：核展开行、代表工具发现、无凭据拒绝、数据出处和卸载后新会话。

**分析版本**

- **仓库**：[sensedeal/cue-skills](https://github.com/sensedeal/cue-skills)
- **版本号**：0.1.3（[固定提交 0e6b629](https://github.com/sensedeal/cue-skills/tree/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在隔离环境测工具清单差异检查能否较早发现远端漂移。

核展开行、代表工具发现、无凭据拒绝、数据出处和卸载后新会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 118 | — | — | 802 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sensedeal/cue-skills/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：预配多域 MCP 能否降低研究者的 DSH 接入负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户可以用一个 bundle 访问多个 Cue 数据域？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

反复查看监管、宏观和披露的 DSH 研究者，可复用预配的 MCP 客户端行而不逐域手写配置。子包仅有 manifest、补丁与说明，实际传输与工具映射依赖宿主 dsh-mcp-client，Cue 服务负责数据。逐一核查补丁有 15 条 insert 客户端行，都是相同 Cue 域名的分域路径和独立 serverName；不含 Omni Reader。单域用户手配一条 MCP 行即可，多域时统一入口才减少重复配置；无本地查询、缓存和数据加工的新实现。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-data-mcp/README.zh-CN.md:5-14](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/README.zh-CN.md#L5-L14)

作者描述场景、15 个域及安装。

<details>
<summary>查看原文（10行）</summary>

````text
一个 [DeepSeek Harness](https://github.com/deepseek-harness) **bundle**,把 Cue 的**公开数据** MCP 服务以原生 `mcp__cue_<domain>__*` 工具形式暴露到任何 Harness profile。每个"活"数据域作为一条 [`@deepseek-ai/dsh-mcp-client`](https://github.com/deepseek-harness) 实例(`transport: streamable-http`)接入 Cue 自有端点——**无需 SSRF 护栏**(URL 为 Cue 固定端点,工具集即数据面)。

15 个活域 / **约 104 个工具**(截至 2026-08-24):制裁与执法(OFAC/EU/BIS,11)、中国监管(16)、宏观(15)、美股披露 SEC EDGAR(5)、中国披露(5)、法规全文(3)、机构持仓(2)、主体数据(2)、学术(3)、事实索引(4)、IPO(9)、ESOP(10)、回购(2)、脚注(14)、两融(3)。`omni-reader` 已排除——它有独立的 `cue-omni-reader` skill。

## 安装

```sh
dsh plugin --profile web add @cueai/dsh-cue-data-mcp
# 或一次性
dsh web --patch ./dsh/cue-data-mcp/cordis.patch.yml
````

</details>

**依据 2 · 源码核查**：[dsh/cue-data-mcp/package.json:2-17](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/package.json#L2-L17)

manifest 的 Cordis patch、peer 与 Node 要求。

<details>
<summary>查看原文（16行）</summary>

```text
  "name": "@cueai/dsh-cue-data-mcp",
  "version": "0.1.3",
  "description": "DSH bundle: exposes Cue's public data MCP services (regulatory, macro, disclosures, market data, statute, holdings, entity, academic, IPO, ESOP, buyback, footnote, fact index) as native mcp__cue_<domain>__* tools.",
  "license": "MIT",
  "type": "module",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {},
  "peerDependencies": {
    "@deepseek-ai/dsh-mcp-client": "^0.1.1-rc.2"
  },
  "engines": {
    "node": ">=20.12"
```

</details>

**依据 3 · 源码核查**：[dsh/cue-data-mcp/cordis.patch.yml:6-33](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/cordis.patch.yml#L6-L33)

监管与宏观代表配置。

<details>
<summary>查看原文（28行）</summary>

```text
- insert:
    - id: mcp-cue_regulatory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_regulatory
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/regulatory/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_regulatory_cn
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_regulatory_cn
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/regulatory_cn/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_macro
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_macro
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/macro/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
```

</details>

**依据 4 · 源码核查**：[dsh/cue-data-mcp/cordis.patch.yml:106-141](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/cordis.patch.yml#L106-L141)

IPO、ESOP、回购和脚注等尾部配置。

<details>
<summary>查看原文（36行）</summary>

```text
    - id: mcp-cue_ipo
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_ipo
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/ipo/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_esop
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_esop
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/esop/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_buyback
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_buyback
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/buyback/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_fr_footnote
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_fr_footnote
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/fr_footnote/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
```

</details>

#### 缺口

- 未运行宿主加载
  **影响**：工具前缀和各域是否启动需要现场核实
  **进一步探讨**：检查 profile 展开并逐域比对工具清单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定地址与统一密钥限定了哪些风险？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

每行用 streamable-http，目标固定指向 mcp.cuecue.cn，并在环境变量中读取同一 CUE_API_KEY 作为 Bearer，请求 Accept 支持 JSON 和事件流。调用模型无法从此补丁设置服务 URL，因此这一层没有任意 URL 解析入口；这与保证远端数据真实或服务没有进一步请求不同。没有凭据预检、独立域密钥、缓存或错误恢复实现。若环境变量没值，模板仍会拼字符串，实际拒绝与日志脱敏依赖客户端和服务。文档工具数量为采集时点的外部清单；静态配置只证明 15 行，不能证明实时工具数或字段兼容。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/cue-data-mcp/cordis.patch.yml:6-24](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/cordis.patch.yml#L6-L24)

固定 URL 与请求头。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: mcp-cue_regulatory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_regulatory
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/regulatory/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_regulatory_cn
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_regulatory_cn
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/regulatory_cn/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
```

</details>

**依据 2 · 作者声明**：[dsh/cue-data-mcp/README.zh-CN.md:19-43](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/README.zh-CN.md#L19-L43)

作者说明环境变量、工具发现与边界。

<details>
<summary>查看原文（25行）</summary>

````text
只需一个凭据,走环境变量:

```sh
# $DSH_HOME/.env(或启动 dsh 前 export)
CUE_API_KEY=sk-...     # 来自 https://cuecue.cn/hub/api-key
```

每个 server 发送 `Authorization: Bearer $CUE_API_KEY` 与 streamable-http 所需的 `Accept` 头。

## 使用

重启后模型可见各域的 `mcp__cue_<domain>__*`(如 `mcp__cue_regulatory__*`、`mcp__cue_macro__*`、`mcp__cue_ipo__*`)。用各端点的 `tools/list` 发现实际工具名,再以 `tools/call` 调用。

## 验证

```sh
dsh --profile web --dump-config     # 应列出 15 条 `mcp-cue_*`
# 然后在会话里确认 mcp__cue_* 工具出现、一次小数据查询成功。
```

## 安全与范围

- 需要 `CUE_API_KEY`;模型可查询 Cue 的数据工具集,但端点是 Cue 自有且固定,无任意出网/SSRF 面。
- 不要把 key 放聊天、命令参数、本文件、日志或生成的 JSON。
- 数据端点走 `streamable-http`,由 `@deepseek-ai/dsh-mcp-client`(peer 依赖,`^0.1.1-rc.2`)桥接。
````

</details>

**依据 3 · 源码核查**：[dsh/cue-data-mcp/package.json:12-18](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/package.json#L12-L18)

运行组件由宿主提供。

```text
  "dependencies": {},
  "peerDependencies": {
    "@deepseek-ai/dsh-mcp-client": "^0.1.1-rc.2"
  },
  "engines": {
    "node": ">=20.12"
  },
```

#### 缺口

- 未核服务工具、凭据权限及配额
  **影响**：无法确认查询范围与费用或数据时效
  **进一步探讨**：用测试 key 在单域检查 tools/list、权限拒绝和小查询

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何受控试用、退出及验证多域部署收益？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可在隔离 DSH profile 比较手配单域与全量 bundle，先只检查配置，再用获授权的测试 key 做一条已知公开查询。首次成本在宿主版本、环境变量和额度，持续成本取决于请求量、远端和模型；出错先区分配置、身份、服务和返回数据，再按作者说明移除 bundle 并检查工具从新会话消失。可比较固定工具清单差异检查与仅看 profile 加载成功，测变更发现时间及误报；若清单差异无助于定位真实失败，则不加监测。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/cue-data-mcp/README.zh-CN.md:9-26](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/README.zh-CN.md#L9-L26)

安装、凭据与请求条件。

<details>
<summary>查看原文（18行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add @cueai/dsh-cue-data-mcp
# 或一次性
dsh web --patch ./dsh/cue-data-mcp/cordis.patch.yml
```

## 配置

只需一个凭据,走环境变量:

```sh
# $DSH_HOME/.env(或启动 dsh 前 export)
CUE_API_KEY=sk-...     # 来自 https://cuecue.cn/hub/api-key
```

每个 server 发送 `Authorization: Bearer $CUE_API_KEY` 与 streamable-http 所需的 `Accept` 头。
````

</details>

**依据 2 · 作者声明**：[dsh/cue-data-mcp/README.zh-CN.md:28-48](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/README.zh-CN.md#L28-L48)

查询工具发现、回滚及验证说明。

<details>
<summary>查看原文（21行）</summary>

````text
## 使用

重启后模型可见各域的 `mcp__cue_<domain>__*`(如 `mcp__cue_regulatory__*`、`mcp__cue_macro__*`、`mcp__cue_ipo__*`)。用各端点的 `tools/list` 发现实际工具名,再以 `tools/call` 调用。

## 验证

```sh
dsh --profile web --dump-config     # 应列出 15 条 `mcp-cue_*`
# 然后在会话里确认 mcp__cue_* 工具出现、一次小数据查询成功。
```

## 安全与范围

- 需要 `CUE_API_KEY`;模型可查询 Cue 的数据工具集,但端点是 Cue 自有且固定,无任意出网/SSRF 面。
- 不要把 key 放聊天、命令参数、本文件、日志或生成的 JSON。
- 数据端点走 `streamable-http`,由 `@deepseek-ai/dsh-mcp-client`(peer 依赖,`^0.1.1-rc.2`)桥接。

## 版本 / 回滚

- `@deepseek-ai/dsh-mcp-client` 是 **peer** 依赖(由 Harness profile 提供)。
- 回滚:`dsh plugin --profile web remove @cueai/dsh-cue-data-mcp`。
````

</details>

**依据 3 · 源码核查**：[dsh/cue-data-mcp/cordis.patch.yml:25-42](https://github.com/sensedeal/cue-skills/blob/0e6b629e98bebef31e63dc3f6dabdd7a0ec1d107/dsh/cue-data-mcp/cordis.patch.yml#L25-L42)

实际远端域连接形态。

<details>
<summary>查看原文（18行）</summary>

```text
    - id: mcp-cue_macro
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_macro
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/macro/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
    - id: mcp-cue_disclosure
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cue_disclosure
        transport: streamable-http
        url: https://mcp.cuecue.cn/api/disclosure/mcp/
        headers:
          Authorization: !!js '`Bearer ${process.env.CUE_API_KEY}`'
          Accept: "application/json, text/event-stream"
```

</details>

#### 缺口

- 无真实计费和移除回读
  **影响**：不能判断持续价格、退出效果或节时
  **进一步探讨**：记录隔离试用的请求数、账单及新旧会话清单

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
