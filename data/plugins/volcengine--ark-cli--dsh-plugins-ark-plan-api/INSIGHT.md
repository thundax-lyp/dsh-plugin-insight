# Ark Plan API

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b84d1c0](https://github.com/volcengine/ark-cli/tree/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api)

<!-- BEGIN META -->
[![GitHub ★ 148](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=148&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/ark-cli) [![npm 30d 1,752](https://img.shields.io/static/v1?label=npm+30d&message=1%2C752&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@volcengine/ark-plan-api) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@volcengine/ark-plan-api)
<!-- END META -->

> **功能**：为 DSH 的原生模型适配器声明火山方舟 Plan 和后付费路由。

> **亮点**：[Q01](#research-q01) 把不同方舟服务预置为独立路由。

> **主要限制**：[Q02](#research-q02) 固定 checkout 缺载体，不能确认最终组合。

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
  - [Q01 · 方舟路由怎样配置？](#detail-section-11)
  - [Q02 · 配置能支持哪些结论？](#detail-section-12)
  - [Q03 · 如何验证采用？](#detail-section-13)
  - [Q04 · 怎样减少路由误选？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有方舟对应账号并要在 DSH 选择模型的开发者。

手工在原生适配器配置模型、端点和凭据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 方舟路由配置 | 选择地区和服务 | 需要完整制品、宿主和权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容宿主 pi-ai | 必需 | 提供协议与模型选择 | 手工接入 |
| 完整发行制品 | 挂载必需 | 提供声明的载体 | 固定 checkout 不足 |
| 对应凭据 | 真实调用必需 | 授权目标服务 | 停在无钥匙核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 检查 | 用户核对制品与最终配置 | 排除覆盖 |
| 选择 | 用户确认地区和服务 | 记录凭据引用 |
| 退出 | 恢复原适配器配置 | 核对路由回归 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包与账号资源未知 | 核对制品和宿主 | 未实测 |
| 持续 | 模型请求费用未知 | 维护地区和计划 | 需独立对账 |
| 恢复 | 重试成本未知 | 撤销测试配置 | 核对实际路由 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 预置路由 | 配置可读取 | 实际挂载和可用性 |
| 凭据分开 | 各路由独立引用 | 账号权限与费用 |

> **思考**：[Q02](#research-q02) 固定 checkout 缺载体，不能确认最终组合。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把不同方舟服务预置为独立路由。

[Q01](#research-q01) 复用共享适配器，将变化限定在提供方配置。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 固定 checkout 缺载体，不能确认最终组合。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先做无钥匙组合核对，再按需验收。[Q02](#research-q02) 不从固定 checkout 推断可安装。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核对固定子组件的配置实现。载体未提交，未验收发行物、宿主或服务。

- 已检查：作者 README、包清单、源码路径 dsh-plugins/ark-plan-api/README.md、dsh-plugins/ark-plan-api/cordis.patch.yml、dsh-plugins/ark-plan-api/package.json 及固定范围 inventory；组件：dsh-plugins/ark-plan-api。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件的清单和补丁，Git 树无声明载体。未执行目标。
- 下一步：核对正式制品、宿主组合、实际端点及停用。

**分析版本**

- **仓库**：[volcengine/ark-cli](https://github.com/volcengine/ark-cli)
- **版本号**：0.1.0（[固定提交 b84d1c0](https://github.com/volcengine/ark-cli/tree/b84d1c02c3e3dc024b1b927f37dd39858053ea82)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在选择前展示地区和计费类别。

核对正式制品、宿主组合、实际端点及停用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 561 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/volcengine/ark-cli/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Ark Plan API 的固定补丁提供什么，哪些运行行为仍待查？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 方舟路由怎样配置？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

已有方舟相应计划或后付费凭据的用户，可把模型接入 DSH 原生选择流程。固定补丁将各路由配置送入 llm-pi-ai，给不同服务及区域独立凭据引用。代表 Agent Plan 与 Coding Plan 都以 anthropic-messages 声明协议，模型列表含配置的窗口与输入类型。增量是预置映射及模型目录，HTTP 和流式实现依赖宿主适配器。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/ark-plan-api/cordis.patch.yml:36-65](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/cordis.patch.yml#L36-L65)

载体及 Agent Plan 配置

<details>
<summary>查看原文（30行）</summary>

```text
- insert:
    - id: '@volcengine/ark-plan-api'
      name: '@volcengine/ark-plan-api'

- id: llm-pi-ai
  config:
    providers:

      # --- Agent Plan (cn-beijing) -----------------------------------------
      ark-agent-plan-cn:
        displayName: Ark Agent Plan
        apiKeyEnv: ARK_AGENT_PLAN_CN_API_KEY
        api: anthropic-messages
        baseURL: https://ark.cn-beijing.volces.com/api/plan
        models:
          - id: doubao-seed-evolving
            name: Doubao Seed Evolving (Agent Plan)
            contextWindow: 1024000
            maxTokens: 256000
            input: [text, image]
          - id: doubao-seed-2.1-pro
            name: Doubao Seed 2.1 Pro (Agent Plan)
            contextWindow: 256000
            maxTokens: 256000
            input: [text, image]
          - id: doubao-seed-2.1-turbo
            name: Doubao Seed 2.1 Turbo (Agent Plan)
            contextWindow: 256000
            maxTokens: 256000
            input: [text, image]
```

</details>

**依据 2 · 源码核查**：[dsh-plugins/ark-plan-api/cordis.patch.yml:102-110](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/cordis.patch.yml#L102-L110)

Coding Plan 引用与 endpoint

```text
      # --- Coding Plan (cn-beijing) ----------------------------------------
      ark-coding-plan-cn:
        displayName: Ark Coding Plan
        apiKeyEnv: ARK_CODING_PLAN_CN_API_KEY
        api: anthropic-messages
        baseURL: https://ark.cn-beijing.volces.com/api/coding
        models:
          - id: doubao-seed-2.1-pro
            name: Doubao Seed 2.1 Pro (Coding Plan)
```

**依据 3 · 源码核查**：[dsh-plugins/ark-plan-api/README.md:45-57](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/README.md#L45-L57)

作者列出的区域和协议

<details>
<summary>查看原文（13行）</summary>

```text
## Providers / 提供的模型路由

| Route ID | Purpose / 用途 | Base URL | API Key Env |
|---|---|---|---|
| `ark-agent-plan-cn` | Agent Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/plan` | `ARK_AGENT_PLAN_CN_API_KEY` |
| `ark-coding-plan-cn` | Coding Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/coding` | `ARK_CODING_PLAN_CN_API_KEY` |
| `ark-coding-plan-byteplus` | Coding Plan (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/coding` | `ARK_CODING_PLAN_BYTEPLUS_API_KEY` |
| `ark-cn` | Postpaid API 后付费 (cn-beijing) | `https://ark.cn-beijing.volces.com/api/v3/compatible` | `ARK_CN_API_KEY` |
| `ark-byteplus` | Postpaid API 后付费 (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/v3/compatible` | `ARK_BYTEPLUS_API_KEY` |

Default wire protocol is the Anthropic Messages API. Base URLs intentionally omit the `/v1` suffix — pi-ai hands `baseURL` straight to the Anthropic SDK, which appends `/v1/messages`.

默认走 Anthropic Messages 协议。`baseURL` 已省略 `/v1` 后缀，pi-ai 会将其直接传给 Anthropic SDK，由 SDK 拼接 `/v1/messages`。
```

</details>

#### 缺口

- 未挂载或调用真实账号
  **影响**：无法证实当前目录模型或工具和图像能力
  **进一步探讨**：先核对制品和宿主，再测试可控账号

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置能支持哪些结论？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

固定提交的子树只有许可证、README、清单和补丁，清单所指 index.js 缺失。补丁明确插入裸包行并改写 llm-pi-ai 配置，可以审查声明式映射，但不能把固定 checkout 当作完整可运行制品。补丁作者注释说明目标 row 的 config 会整块替换，假定原 row 未配置；多个同类补丁是否覆盖取决于组合规则，需读回宿主最终配置。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/ark-plan-api/package.json:1-27](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/package.json#L1-L27)

声明载体与 bundle

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "@volcengine/ark-plan-api",
  "version": "0.1.0",
  "description": "Volcengine Ark provider plugin for DeepSeek Harness (DSH): registers Agent Plan, Coding Plan, and postpaid routes on the native pi-ai adapter so Ark models appear in the model picker.",
  "type": "module",
  "license": "Apache-2.0",
  "author": "Beijing Volcano Engine Technology Co., Ltd.",
  "homepage": "https://www.volcengine.com/product/ark",
  "main": "./index.js",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "dsh-bundle",
    "cordis-plugin",
    "ark",
    "volcengine",
    "llm-provider"
  ],
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "dsh": {
    "plugin": true,
    "kind": "server",
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[dsh-plugins/ark-plan-api/package.json:43-53](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/package.json#L43-L53)

发布文件和导出均指 index.js

<details>
<summary>查看原文（11行）</summary>

```text
  "files": [
    "index.js",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": "./index.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  }
```

</details>

**依据 3 · 源码核查**：[dsh-plugins/ark-plan-api/cordis.patch.yml:25-42](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/cordis.patch.yml#L25-L42)

注释和实际目标行

<details>
<summary>查看原文（18行）</summary>

```text
# A row patch replaces the whole `config` of the targeted row; dsh-base mounts
# `llm-pi-ai` with no config, so restating only `providers` here is safe.
#
# The leading `insert` adds this bundle's own inert carrier row (name:
# '@volcengine/ark-plan-api', whose index.js exports name/apply and does nothing)
# so the bundle owns a Loader entry with a live root fiber — that is what makes
# it appear in Settings › Plugins › Plugin list (the host plugin-inventory
# enumerates Loader entries). It does not change provider behaviour: the
# providers are still injected via the `llm-pi-ai` row patch below.
# ============================================================================

- insert:
    - id: '@volcengine/ark-plan-api'
      name: '@volcengine/ark-plan-api'

- id: llm-pi-ai
  config:
    providers:
```

</details>

**依据 4 · 源码核查**：[dsh-plugins/ark-plan-api/cordis.patch.yml:45-65](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/cordis.patch.yml#L45-L65)

静态模型元数据

<details>
<summary>查看原文（21行）</summary>

```text
      ark-agent-plan-cn:
        displayName: Ark Agent Plan
        apiKeyEnv: ARK_AGENT_PLAN_CN_API_KEY
        api: anthropic-messages
        baseURL: https://ark.cn-beijing.volces.com/api/plan
        models:
          - id: doubao-seed-evolving
            name: Doubao Seed Evolving (Agent Plan)
            contextWindow: 1024000
            maxTokens: 256000
            input: [text, image]
          - id: doubao-seed-2.1-pro
            name: Doubao Seed 2.1 Pro (Agent Plan)
            contextWindow: 256000
            maxTokens: 256000
            input: [text, image]
          - id: doubao-seed-2.1-turbo
            name: Doubao Seed 2.1 Turbo (Agent Plan)
            contextWindow: 256000
            maxTokens: 256000
            input: [text, image]
```

</details>

#### 缺口

- 未取得固定提交对应发行物、载体和宿主组合
  **影响**：不能确认启动及与既有路由的共存
  **进一步探讨**：校验制品包含导出，离线读回不同补丁次序的配置

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何验证采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先确认安装制品、Node 和宿主 pi-ai。按实际地区和计划选用隔离凭据，检查生成配置中的 endpoint 及命名空间，再尝试一个获授权小请求。首次有包与账号配置，持续用量按所选计划或后付费服务计，实际价格、可用性和退路仍待验证。若目标配置被覆盖或凭据指向不明，保留原适配器与手工配置。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/ark-plan-api/package.json:20-28](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/package.json#L20-L28)

Node 与 bundle 声明

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "dsh": {
    "plugin": true,
    "kind": "server",
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 2 · 源码核查**：[dsh-plugins/ark-plan-api/README.md:15-43](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/README.md#L15-L43)

作者安装路径与重启

<details>
<summary>查看原文（29行）</summary>

````text
## Install / 安装

### From npm (recommended / 推荐)

```sh
npx -y @deepseek-ai/dsh plugin --profile web add @volcengine/ark-plan-api
```

### From GitHub Release

```sh
npx -y @deepseek-ai/dsh plugin --profile web add https://github.com/volcengine/ark-cli/releases/download/dsh-plugins%2Fv0.1.0/ark-plan-api.tgz
```

### Via awesome-dsh-plugin registry

```sh
npx -y @deepseek-ai/dsh plugin --profile web add volcengine/ark-cli#ark-plan-api
```

### From a local clone (development / 开发用)

```sh
npx -y @deepseek-ai/dsh plugin --profile web add ./dsh-plugins/ark-plan-api
```

Restart DSH after install, then open **Settings → Models**, pick an Ark provider and paste your API key. Each route reads its key from a separate env var (see table below); the Models UI writes the key to the correct name automatically.

安装后重启 DSH，打开 **Settings → Models**，选择 Ark provider 并粘贴 API Key。每条路由从独立的环境变量读取密钥（见下表），Models 设置页会自动写入对应变量。
````

</details>

**依据 3 · 源码核查**：[dsh-plugins/ark-plan-api/README.md:45-63](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/README.md#L45-L63)

不同地区、模式和凭据

<details>
<summary>查看原文（19行）</summary>

```text
## Providers / 提供的模型路由

| Route ID | Purpose / 用途 | Base URL | API Key Env |
|---|---|---|---|
| `ark-agent-plan-cn` | Agent Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/plan` | `ARK_AGENT_PLAN_CN_API_KEY` |
| `ark-coding-plan-cn` | Coding Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/coding` | `ARK_CODING_PLAN_CN_API_KEY` |
| `ark-coding-plan-byteplus` | Coding Plan (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/coding` | `ARK_CODING_PLAN_BYTEPLUS_API_KEY` |
| `ark-cn` | Postpaid API 后付费 (cn-beijing) | `https://ark.cn-beijing.volces.com/api/v3/compatible` | `ARK_CN_API_KEY` |
| `ark-byteplus` | Postpaid API 后付费 (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/v3/compatible` | `ARK_BYTEPLUS_API_KEY` |

Default wire protocol is the Anthropic Messages API. Base URLs intentionally omit the `/v1` suffix — pi-ai hands `baseURL` straight to the Anthropic SDK, which appends `/v1/messages`.

默认走 Anthropic Messages 协议。`baseURL` 已省略 `/v1` 后缀，pi-ai 会将其直接传给 Anthropic SDK，由 SDK 拼接 `/v1/messages`。

## Requirements / 前置条件

- DSH ≥ 0.1.0
- Node.js ≥ 22.19.0 (ships with DSH)
- A Volcengine Ark API key with access to the corresponding endpoint
```

</details>

#### 缺口

- 未核对价格、账号、停用或真实包
  **影响**：无法量化成本或兼容
  **进一步探讨**：在独立 profile 先进行无钥匙组合检查

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少路由误选？

**研究主题**：新假设与验证

#### 完整回答

可给选择器增加实际地区、计划与后付费归类以及凭据引用状态，帮助用户在调用前发现同名模型的计费区别。先以当前固定配置为基线，对照多地区同模型任务，记录误选、额外时间与授权失败。若误选没有下降或提示造成错误归因，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/ark-plan-api/README.md:45-57](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/README.md#L45-L57)

同类服务分布不同地区

<details>
<summary>查看原文（13行）</summary>

```text
## Providers / 提供的模型路由

| Route ID | Purpose / 用途 | Base URL | API Key Env |
|---|---|---|---|
| `ark-agent-plan-cn` | Agent Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/plan` | `ARK_AGENT_PLAN_CN_API_KEY` |
| `ark-coding-plan-cn` | Coding Plan (cn-beijing) | `https://ark.cn-beijing.volces.com/api/coding` | `ARK_CODING_PLAN_CN_API_KEY` |
| `ark-coding-plan-byteplus` | Coding Plan (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/coding` | `ARK_CODING_PLAN_BYTEPLUS_API_KEY` |
| `ark-cn` | Postpaid API 后付费 (cn-beijing) | `https://ark.cn-beijing.volces.com/api/v3/compatible` | `ARK_CN_API_KEY` |
| `ark-byteplus` | Postpaid API 后付费 (BytePlus/海外) | `https://ark.ap-southeast.bytepluses.com/api/v3/compatible` | `ARK_BYTEPLUS_API_KEY` |

Default wire protocol is the Anthropic Messages API. Base URLs intentionally omit the `/v1` suffix — pi-ai hands `baseURL` straight to the Anthropic SDK, which appends `/v1/messages`.

默认走 Anthropic Messages 协议。`baseURL` 已省略 `/v1` 后缀，pi-ai 会将其直接传给 Anthropic SDK，由 SDK 拼接 `/v1/messages`。
```

</details>

**依据 2 · 源码核查**：[dsh-plugins/ark-plan-api/cordis.patch.yml:44-55](https://github.com/volcengine/ark-cli/blob/b84d1c02c3e3dc024b1b927f37dd39858053ea82/dsh-plugins/ark-plan-api/cordis.patch.yml#L44-L55)

选项中已有路由和模型描述

<details>
<summary>查看原文（12行）</summary>

```text
      # --- Agent Plan (cn-beijing) -----------------------------------------
      ark-agent-plan-cn:
        displayName: Ark Agent Plan
        apiKeyEnv: ARK_AGENT_PLAN_CN_API_KEY
        api: anthropic-messages
        baseURL: https://ark.cn-beijing.volces.com/api/plan
        models:
          - id: doubao-seed-evolving
            name: Doubao Seed Evolving (Agent Plan)
            contextWindow: 1024000
            maxTokens: 256000
            input: [text, image]
```

</details>

#### 缺口

- 未核对宿主当前模型选择器展示
  **影响**：可能已展示部分信息
  **进一步探讨**：先检查实际 UI 再做对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
